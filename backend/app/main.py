from __future__ import annotations

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from typing import Any, Dict, List, Optional
from collections import OrderedDict
import json
import math
import threading
import time

from app.core.config import get_data_dir
from app.services.csv_loader import analyze_csv_file, read_csv_robust
from app.services.borehole_parser import normalize_borehole_df, add_depth_columns
from app.services.encoding_fix import fix_csv_encoding
from app.services.lithology_stats import compute_lithology_averages
from app.services.pressure_steps import compute_pressure_steps
from app.services.coords_loader import load_borehole_coords
from app.services.interpolate import interpolate_field, compute_points_values
from app.services.pressure_index import compute_borehole_index, interpolate_index
from app.services.coal_seam_parser import get_all_coal_seams, get_coal_seam_data, get_overburden_lithology, get_seam_stats
from app.services.seam_interpolate import interpolate_seam_property, interpolate_seam_with_overburden, compare_interpolation_methods_for_seam
from app.services.pipeline import run_pipeline
from app.services.grid_export import grid_to_csv_bytes
from app.services.interpolation_eval import evaluate_methods
from app.services.pressure_steps_batch import compute_pressure_steps_boreholes
from app.services.interpolate import interpolate_from_points
from app.services.workface import compute_workface_adjusted_grid
from app.services.summary import summarize_grid
from app.services.contour_generator import generate_matplotlib_contour_image, generate_dual_contour_images
from app.routes.mpi import router as mpi_router
from app.routes.rock_params import router as rock_params_router
from app.routes.algorithm_validation import router as validation_router
from app.routes.research import router as research_router
from app.routes.geomodel import router as geomodel_router
from app.routes.geomodel_integration import router as geomodel_integration_router
from app.routes.ai_chat import router as ai_chat_router
from app.routes.health import router as health_router
from app.routes.data_ops import router as data_ops_router
from app.routes.pressure import router as pressure_router
from app.routes.seams import router as seams_router
from app.routes.summary import router as summary_router

app = FastAPI(title="Mining Pressure System API", version="0.1.0")

# Include routers
app.include_router(mpi_router)
app.include_router(rock_params_router)
app.include_router(validation_router)
app.include_router(research_router)
app.include_router(geomodel_router)
app.include_router(geomodel_integration_router)
app.include_router(ai_chat_router)
app.include_router(health_router)
app.include_router(data_ops_router)
app.include_router(pressure_router)
app.include_router(seams_router)
app.include_router(summary_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lightweight in-memory cache for expensive seam contour image generation.
_CONTOUR_CACHE_MAXSIZE = 24
_contour_cache: OrderedDict[tuple, dict] = OrderedDict()
_contour_cache_lock = threading.Lock()

# Lightweight in-memory cache for report-summary requests.
_REPORT_CACHE_MAXSIZE = 64
_REPORT_CACHE_TTL_SEC = 45.0
_report_cache: OrderedDict[tuple, Dict[str, Any]] = OrderedDict()
_report_cache_lock = threading.Lock()
_report_perf_lock = threading.Lock()
_report_perf: Dict[str, Any] = {
    "requests_total": 0,
    "cache_hits": 0,
    "cache_misses": 0,
    "compute_ms_total": 0.0,
    "cached_ms_total": 0.0,
    "last_compute_ms": 0.0,
    "last_cached_ms": 0.0,
    "last_request_ts": 0.0,
}


def _build_contour_data_signature(data_dir: Path) -> str:
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file()])
    latest_mtime_ns = 0
    for file_path in files:
        try:
            mtime_ns = file_path.stat().st_mtime_ns
            if mtime_ns > latest_mtime_ns:
                latest_mtime_ns = mtime_ns
        except OSError:
            continue
    return f"{len(files)}:{latest_mtime_ns}"


def _get_cached_contour_response(cache_key: tuple) -> Optional[dict]:
    with _contour_cache_lock:
        cached = _contour_cache.get(cache_key)
        if cached is None:
            return None
        _contour_cache.move_to_end(cache_key)
        return cached


def _set_cached_contour_response(cache_key: tuple, payload: dict) -> None:
    with _contour_cache_lock:
        _contour_cache[cache_key] = payload
        _contour_cache.move_to_end(cache_key)
        while len(_contour_cache) > _CONTOUR_CACHE_MAXSIZE:
            _contour_cache.popitem(last=False)


def _clear_contour_cache() -> None:
    with _contour_cache_lock:
        _contour_cache.clear()


def _build_report_data_signature(data_dir: Path) -> str:
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file()])
    latest_mtime_ns = 0
    total_size = 0
    for file_path in files:
        try:
            st = file_path.stat()
            mtime_ns = int(st.st_mtime_ns)
            total_size += int(st.st_size)
            if mtime_ns > latest_mtime_ns:
                latest_mtime_ns = mtime_ns
        except OSError:
            continue
    return f"{len(files)}:{total_size}:{latest_mtime_ns}"


def _build_week3_research_signature(data_dir: Path) -> str:
    split_audit_path = data_dir / "experiments" / "splits" / "split_leakage_audit.json"
    suites_root = data_dir / "research" / "suites"
    suite_files = sorted(suites_root.glob("suite_*/summary.json")) if suites_root.exists() else []
    targets = [split_audit_path, *suite_files]

    latest_mtime_ns = 0
    total_size = 0
    existing_count = 0
    for file_path in targets:
        if not file_path.exists() or not file_path.is_file():
            continue
        try:
            st = file_path.stat()
        except OSError:
            continue
        existing_count += 1
        total_size += int(st.st_size)
        latest_mtime_ns = max(latest_mtime_ns, int(st.st_mtime_ns))
    return f"{existing_count}:{total_size}:{latest_mtime_ns}"


def _read_json_object(path: Path) -> Dict[str, Any]:
    if not path.exists() or not path.is_file():
        return {}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}
    if isinstance(payload, dict):
        return payload
    return {}


def _safe_finite(value: Any) -> Optional[float]:
    try:
        if value is None:
            return None
        out = float(value)
    except Exception:
        return None
    if not math.isfinite(out):
        return None
    return out


def _load_week3_research_summary(data_dir: Path, max_suites: int = 12) -> Dict[str, Any]:
    notes: List[str] = []

    split_audit_path = data_dir / "experiments" / "splits" / "split_leakage_audit.json"
    split_payload = _read_json_object(split_audit_path)
    split_audit: Optional[Dict[str, Any]] = None
    if split_payload:
        kfold_summary = split_payload.get("kfold_summary") or {}
        aggregate = split_payload.get("aggregate") or {}
        split_audit = {
            "generated_at_utc": split_payload.get("generated_at_utc"),
            "path": str(split_audit_path),
            "strategy": kfold_summary.get("strategy", ""),
            "n_splits": int(kfold_summary.get("n_splits", 0) or 0),
            "row_count": int(kfold_summary.get("row_count", 0) or 0),
            "all_overlap_zero": bool(aggregate.get("all_overlap_zero", False)),
            "max_overlap": aggregate.get("max_overlap") or {},
        }
    else:
        notes.append("split_audit_missing")

    suites: List[Dict[str, Any]] = []
    suites_root = data_dir / "research" / "suites"
    if suites_root.exists():
        suite_summary_files = sorted(
            suites_root.glob("suite_*/summary.json"),
            key=lambda p: p.parent.name,
            reverse=True,
        )
        for suite_summary_path in suite_summary_files[: max(1, int(max_suites))]:
            suite_payload = _read_json_object(suite_summary_path)
            if not suite_payload:
                notes.append(f"suite_parse_failed:{suite_summary_path.parent.name}")
                continue

            conclusion = suite_payload.get("comparison_conclusion") or {}
            run_items: List[Dict[str, Any]] = []
            for run in suite_payload.get("runs") or []:
                metrics = run.get("metrics") or {}
                run_items.append(
                    {
                        "experiment_name": run.get("experiment_name", ""),
                        "model_type": run.get("model_type", ""),
                        "auc": _safe_finite(metrics.get("auc")),
                        "brier": _safe_finite(metrics.get("brier")),
                        "f1": _safe_finite(metrics.get("f1")),
                        "mae": _safe_finite(metrics.get("mae")),
                        "rmse": _safe_finite(metrics.get("rmse")),
                    }
                )

            suites.append(
                {
                    "suite_id": suite_payload.get("suite_id", suite_summary_path.parent.name),
                    "template_name": suite_payload.get("template_name", ""),
                    "dataset_id": suite_payload.get("dataset_id", ""),
                    "dataset_version": suite_payload.get("dataset_version", ""),
                    "split_id": suite_payload.get("split_id", ""),
                    "created_at": suite_payload.get("created_at", ""),
                    "best_auc_experiment": conclusion.get("best_auc_experiment", ""),
                    "best_auc_value": _safe_finite(conclusion.get("best_auc_value")),
                    "best_brier_experiment": conclusion.get("best_brier_experiment", ""),
                    "best_brier_value": _safe_finite(conclusion.get("best_brier_value")),
                    "runs": run_items,
                }
            )
    else:
        notes.append("suite_dir_missing")

    status = "missing"
    if split_audit and suites:
        status = "ready"
    elif split_audit or suites:
        status = "partial"

    stability_compare = _build_week3_stability_compare(suites)
    return {
        "status": status,
        "split_audit": split_audit,
        "suites": suites,
        "stability_compare": stability_compare,
        "notes": notes,
    }


def _get_cached_report_response(cache_key: tuple) -> Optional[Dict[str, Any]]:
    now = time.monotonic()
    with _report_cache_lock:
        cached = _report_cache.get(cache_key)
        if cached is None:
            return None
        created_at = float(cached.get("_cache_time", 0.0))
        if (now - created_at) > _REPORT_CACHE_TTL_SEC:
            _report_cache.pop(cache_key, None)
            return None
        _report_cache.move_to_end(cache_key)
        payload = cached.get("payload")
        if isinstance(payload, dict):
            return payload
        return None


def _set_cached_report_response(cache_key: tuple, payload: Dict[str, Any]) -> None:
    with _report_cache_lock:
        _report_cache[cache_key] = {"_cache_time": time.monotonic(), "payload": payload}
        _report_cache.move_to_end(cache_key)
        while len(_report_cache) > _REPORT_CACHE_MAXSIZE:
            _report_cache.popitem(last=False)


def _clear_report_cache() -> None:
    with _report_cache_lock:
        _report_cache.clear()


def _record_report_perf(cache_hit: bool, elapsed_ms: float) -> Dict[str, Any]:
    now_ts = float(time.time())
    with _report_perf_lock:
        _report_perf["requests_total"] = int(_report_perf.get("requests_total", 0)) + 1
        if cache_hit:
            _report_perf["cache_hits"] = int(_report_perf.get("cache_hits", 0)) + 1
            _report_perf["cached_ms_total"] = float(_report_perf.get("cached_ms_total", 0.0)) + float(elapsed_ms)
            _report_perf["last_cached_ms"] = float(elapsed_ms)
        else:
            _report_perf["cache_misses"] = int(_report_perf.get("cache_misses", 0)) + 1
            _report_perf["compute_ms_total"] = float(_report_perf.get("compute_ms_total", 0.0)) + float(elapsed_ms)
            _report_perf["last_compute_ms"] = float(elapsed_ms)
        _report_perf["last_request_ts"] = now_ts

    return _report_perf_snapshot()


def _report_perf_snapshot() -> Dict[str, Any]:
    with _report_perf_lock:
        requests_total = int(_report_perf.get("requests_total", 0))
        hits = int(_report_perf.get("cache_hits", 0))
        misses = int(_report_perf.get("cache_misses", 0))
        compute_total = float(_report_perf.get("compute_ms_total", 0.0))
        cached_total = float(_report_perf.get("cached_ms_total", 0.0))
        last_compute_ms = float(_report_perf.get("last_compute_ms", 0.0))
        last_cached_ms = float(_report_perf.get("last_cached_ms", 0.0))
        last_request_ts = float(_report_perf.get("last_request_ts", 0.0))

    hit_rate = (hits / requests_total) if requests_total > 0 else 0.0
    avg_compute_ms = (compute_total / misses) if misses > 0 else 0.0
    avg_cached_ms = (cached_total / hits) if hits > 0 else 0.0
    return {
        "requests_total": requests_total,
        "cache_hits": hits,
        "cache_misses": misses,
        "cache_hit_rate": float(hit_rate),
        "avg_compute_ms": float(avg_compute_ms),
        "avg_cached_ms": float(avg_cached_ms),
        "last_compute_ms": float(last_compute_ms),
        "last_cached_ms": float(last_cached_ms),
        "last_request_ts": float(last_request_ts),
    }


def _to_int_tail(value: str) -> int:
    text = str(value or "")
    digits = "".join(ch for ch in text if ch.isdigit())
    if not digits:
        return -1
    try:
        return int(digits)
    except Exception:
        return -1


def _build_week3_stability_compare(suites: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    latest_by_template_dataset: Dict[tuple[str, str], Dict[str, Any]] = {}
    for suite in suites:
        template_name = str(suite.get("template_name") or "")
        dataset_id = str(suite.get("dataset_id") or "")
        if not template_name or not dataset_id:
            continue
        key = (template_name, dataset_id)
        current = latest_by_template_dataset.get(key)
        if current is None:
            latest_by_template_dataset[key] = suite
            continue
        if str(suite.get("suite_id") or "") > str(current.get("suite_id") or ""):
            latest_by_template_dataset[key] = suite

    result_rows: List[Dict[str, Any]] = []
    template_names = sorted({key[0] for key in latest_by_template_dataset.keys()})
    for template_name in template_names:
        dataset_items = [
            suite
            for (tpl, _), suite in latest_by_template_dataset.items()
            if tpl == template_name
        ]
        if len(dataset_items) < 2:
            continue
        dataset_items.sort(
            key=lambda item: _to_int_tail(str(item.get("dataset_id") or "")),
        )
        left = dataset_items[0]
        right = dataset_items[-1]
        left_runs = {str(run.get("experiment_name") or ""): run for run in (left.get("runs") or [])}
        right_runs = {str(run.get("experiment_name") or ""): run for run in (right.get("runs") or [])}
        exp_names = sorted({*left_runs.keys(), *right_runs.keys()})

        comparisons: List[Dict[str, Any]] = []
        for exp_name in exp_names:
            if not exp_name:
                continue
            left_run = left_runs.get(exp_name) or {}
            right_run = right_runs.get(exp_name) or {}
            left_auc = _safe_finite(left_run.get("auc"))
            right_auc = _safe_finite(right_run.get("auc"))
            left_brier = _safe_finite(left_run.get("brier"))
            right_brier = _safe_finite(right_run.get("brier"))
            left_f1 = _safe_finite(left_run.get("f1"))
            right_f1 = _safe_finite(right_run.get("f1"))
            comparisons.append(
                {
                    "experiment_name": exp_name,
                    "auc": {str(left.get("dataset_id") or ""): left_auc, str(right.get("dataset_id") or ""): right_auc},
                    "brier": {str(left.get("dataset_id") or ""): left_brier, str(right.get("dataset_id") or ""): right_brier},
                    "f1": {str(left.get("dataset_id") or ""): left_f1, str(right.get("dataset_id") or ""): right_f1},
                    "delta_auc": (right_auc - left_auc) if (left_auc is not None and right_auc is not None) else None,
                    "delta_brier": (right_brier - left_brier) if (left_brier is not None and right_brier is not None) else None,
                    "delta_f1": (right_f1 - left_f1) if (left_f1 is not None and right_f1 is not None) else None,
                }
            )

        result_rows.append(
            {
                "template_name": template_name,
                "datasets": [str(left.get("dataset_id") or ""), str(right.get("dataset_id") or "")],
                "suite_ids": [str(left.get("suite_id") or ""), str(right.get("suite_id") or "")],
                "comparisons": comparisons,
            }
        )
    return result_rows


def _clip01_100(value: float) -> float:
    return max(0.0, min(100.0, float(value)))


def _stats_from_values(values: list[float]) -> dict:
    import numpy as np

    if not values:
        return {"min": 0.0, "max": 0.0, "mean": 0.0, "std": 0.0}
    arr = np.asarray(values, dtype=float)
    return {
        "min": float(np.min(arr)),
        "max": float(np.max(arr)),
        "mean": float(np.mean(arr)),
        "std": float(np.std(arr)),
    }


@app.get("/api/scene3d/data")
def get_scene3d_data_api(seam: str, resolution: int = 50) -> dict:
    """
    Frontend-friendly scene3d data endpoint.
    Returns keys expected by `Scene3DPage.vue`:
    `scene`, `layers`, `indicators`, `bounds`, `stats`.
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    seam_data = get_coal_seam_data(files, coords, seam)
    if (seam_data.get("point_count") or 0) <= 0:
        raise HTTPException(status_code=404, detail=f"no seam data found: {seam}")

    overburden = get_overburden_lithology(files, coords, seam)
    boreholes = overburden.get("boreholes", [])

    if boreholes:
        xs = [float(bh.get("x", 0.0)) for bh in boreholes]
        ys = [float(bh.get("y", 0.0)) for bh in boreholes]
    else:
        points = seam_data.get("points", [])
        xs = [float(p.get("x", 0.0)) for p in points]
        ys = [float(p.get("y", 0.0)) for p in points]

    if not xs or not ys:
        raise HTTPException(status_code=404, detail="no valid coordinates for scene")

    bounds = {
        "min_x": float(min(xs)),
        "max_x": float(max(xs)),
        "min_y": float(min(ys)),
        "max_y": float(max(ys)),
    }

    layer_agg: dict[str, dict] = {}
    for bh in boreholes:
        for layer in (bh.get("layers") or []):
            name = str(layer.get("name") or "").strip()
            if not name:
                continue
            rec = layer_agg.setdefault(
                name,
                {"thickness": [], "z_top": [], "z_bottom": [], "color": layer.get("color") or "#94a3b8"},
            )
            try:
                rec["thickness"].append(float(layer.get("thickness") or 0.0))
                rec["z_top"].append(float(layer.get("z_top") or 0.0))
                rec["z_bottom"].append(float(layer.get("z_bottom") or 0.0))
            except Exception:
                continue

    layers_payload = []
    sorted_layers = sorted(
        layer_agg.items(),
        key=lambda kv: sum(kv[1]["z_top"]) / max(1, len(kv[1]["z_top"])),
    )
    for i, (name, rec) in enumerate(sorted_layers):
        avg_thick = sum(rec["thickness"]) / max(1, len(rec["thickness"]))
        avg_z_top = sum(rec["z_top"]) / max(1, len(rec["z_top"]))
        avg_z_bottom = sum(rec["z_bottom"]) / max(1, len(rec["z_bottom"]))
        z_mid = (avg_z_top + avg_z_bottom) * 0.5
        layers_payload.append(
            {
                "id": f"layer_{i}",
                "name": name,
                "displayName": name,
                "color": rec["color"],
                "thickness": float(avg_thick),
                "depthTop": float(avg_z_top),
                "depthBottom": float(avg_z_bottom),
                "vertices": [
                    [bounds["min_x"], bounds["min_y"], z_mid],
                    [bounds["max_x"], bounds["min_y"], z_mid],
                    [bounds["max_x"], bounds["max_y"], z_mid],
                    [bounds["min_x"], bounds["max_y"], z_mid],
                ],
                "faces": [[0, 1, 2], [0, 2, 3]],
            }
        )

    thickness_values = []
    depth_values = []
    for p in seam_data.get("points", []):
        t = p.get("thickness")
        d = p.get("burial_depth")
        if isinstance(t, (int, float)):
            thickness_values.append(float(t))
        if isinstance(d, (int, float)):
            depth_values.append(float(d))

    point_scores = {"rsi": [], "bri": [], "asi": [], "mpi": []}
    points = seam_data.get("points", [])
    if points:
        depth_ref = (sum(depth_values) / len(depth_values)) if depth_values else 500.0
        for p in points:
            thickness = float(p.get("thickness") or 0.0)
            depth = float(p.get("burial_depth") or depth_ref)
            rsi = _clip01_100(42.0 + thickness * 3.2 - depth * 0.02)
            bri = _clip01_100(92.0 - depth * 0.085 - thickness * 1.4)
            asi = _clip01_100(48.0 + thickness * 2.1 - abs(depth - depth_ref) * 0.03)
            mpi = _clip01_100(0.4 * rsi + 0.35 * bri + 0.25 * asi)
            point_scores["rsi"].append(rsi)
            point_scores["bri"].append(bri)
            point_scores["asi"].append(asi)
            point_scores["mpi"].append(mpi)

    indicators = {
        "mpi": _stats_from_values(point_scores["mpi"]),
        "rsi": _stats_from_values(point_scores["rsi"]),
        "bri": _stats_from_values(point_scores["bri"]),
        "asi": _stats_from_values(point_scores["asi"]),
    }

    stats = {
        "layerCount": len(layers_payload),
        "boreholeCount": len(boreholes),
        "bounds": bounds,
        "resolution": int(resolution),
    }

    return {
        "scene": {
            "seam": seam,
            "resolution": int(resolution),
            "pointCount": int(seam_data.get("point_count") or 0),
        },
        "layers": layers_payload,
        "indicators": indicators,
        "bounds": bounds,
        "stats": stats,
    }


def scan_boreholes() -> dict:
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail=f"data dir not found: {data_dir}")

    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file()])
    results = []
    for p in files:
        info = analyze_csv_file(p)
        results.append(info)
    return {"data_dir": str(data_dir), "files": results}


def preview_borehole(file: str, limit: int = 20) -> dict:
    data_dir = get_data_dir()
    path = (data_dir / file).resolve()
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"file not found: {path}")
    if path.suffix.lower() != ".csv":
        raise HTTPException(status_code=400, detail="only csv supported")

    df = read_csv_robust(path)
    df = normalize_borehole_df(df)
    df = add_depth_columns(df)

    preview = df.head(limit).to_dict(orient="records")
    return {
        "file": path.name,
        "rows": preview,
        "columns": list(df.columns),
        "row_count": int(df.shape[0]),
    }


async def upload_boreholes(files: List[UploadFile] = File(...)) -> dict:
    data_dir = get_data_dir()
    if not data_dir.exists():
        data_dir.mkdir(parents=True, exist_ok=True)

    saved = []
    for f in files:
        if not f.filename.lower().endswith(".csv"):
            continue
        dest = (data_dir / Path(f.filename).name).resolve()
        content = await f.read()
        dest.write_bytes(content)
        saved.append(dest.name)

    # Uploaded data can change seam interpolation results.
    _clear_contour_cache()
    _clear_report_cache()
    return {"saved": saved, "count": len(saved)}


def fix_encoding() -> dict:
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail=f"data dir not found: {data_dir}")

    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file()])
    results = []
    for p in files:
        result = fix_csv_encoding(p)
        results.append(result)
    _clear_contour_cache()
    _clear_report_cache()
    return {"data_dir": str(data_dir), "files": results}


def lithology_averages() -> dict:
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail=f"data dir not found: {data_dir}")

    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file()])
    stats = compute_lithology_averages(files)
    return {"data_dir": str(data_dir), "averages": stats}


def pressure_steps(model: str, h: float, q: float, t: float | None = None, s: float | None = None) -> dict:
    result = compute_pressure_steps(model=model, h=h, q=q, t=t, s=s)
    return result


def pressure_steps_boreholes(model: str = "fixed", h_mode: str = "total", q_mode: str = "density_thickness", default_q: float = 1.0) -> dict:
    data_dir = get_data_dir()
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    coord_path = data_dir / "zuobiao.csv"
    coords = load_borehole_coords(coord_path)
    result = compute_pressure_steps_boreholes(files=files, model=model, h_mode=h_mode, q_mode=q_mode, default_q=default_q, coords=coords)
    return result


def export_pressure_steps(model: str = "fixed", h_mode: str = "total", q_mode: str = "density_thickness", default_q: float = 1.0) -> Response:
    data_dir = get_data_dir()
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    result = compute_pressure_steps_boreholes(files=files, model=model, h_mode=h_mode, q_mode=q_mode, default_q=default_q)

    rows = [
        ["borehole", "h", "q", "t", "s", "initial_step", "periodic_step", "error"]
    ]
    for item in result["items"]:
        r = item["result"]
        rows.append([
            item["borehole"],
            item["h"],
            item["q"],
            item["t"],
            item["s"],
            r.get("initial_step"),
            r.get("periodic_step"),
            r.get("error"),
        ])

    content = "\n".join(",".join(map(lambda x: "" if x is None else str(x), row)) for row in rows)
    filename = f"pressure_steps_{model}.csv"
    return Response(content=content.encode("utf-8"), media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


def pressure_steps_grid(model: str = "fixed", target: str = "initial", h_mode: str = "total", q_mode: str = "density_thickness", default_q: float = 1.0, grid_size: int = 60) -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    result = compute_pressure_steps_boreholes(files=files, model=model, h_mode=h_mode, q_mode=q_mode, default_q=default_q, coords=coords)

    points = []
    values = []
    for item in result["items"]:
        if "x" not in item or "y" not in item:
            continue
        step = item["result"].get("initial_step" if target == "initial" else "periodic_step")
        if isinstance(step, (list, tuple)):
            step_val = sum(step) / len(step)
        else:
            step_val = step
        if step_val is None:
            continue
        points.append((item["x"], item["y"]))
        values.append(step_val)

    if len(points) < 3:
        return {"error": "not enough points for interpolation"}

    import numpy as np
    pts = np.array(points)
    vals = np.array(values)
    grid = interpolate_from_points(points=pts, values=vals, method="idw", grid_size=grid_size)
    if "error" in grid:
        return grid
    return {
        "target": target,
        "grid_size": grid_size,
        "bounds": grid["bounds"],
        "values": grid["grid"].tolist(),
    }


def pressure_steps_workfaces(
    model: str = "fixed",
    target: str = "initial",
    h_mode: str = "total",
    q_mode: str = "density_thickness",
    default_q: float = 1.0,
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
) -> dict:
    grid_data = pressure_steps_grid(
        model=model,
        target=target,
        h_mode=h_mode,
        q_mode=q_mode,
        default_q=default_q,
        grid_size=grid_size,
    )
    if "error" in grid_data:
        return grid_data
    adjusted = compute_workface_adjusted_grid(
        grid=grid_data["values"],
        bounds=grid_data["bounds"],
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )
    return {"grid": grid_data, "workfaces": adjusted}


def export_pressure_steps_grid(model: str = "fixed", target: str = "initial", h_mode: str = "total", q_mode: str = "density_thickness", default_q: float = 1.0, grid_size: int = 60) -> Response:
    data = pressure_steps_grid(model=model, target=target, h_mode=h_mode, q_mode=q_mode, default_q=default_q, grid_size=grid_size)
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    content = grid_to_csv_bytes(data["values"], data["bounds"])
    filename = f"pressure_steps_grid_{model}_{target}_{grid_size}.csv"
    return Response(content=content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


def export_pressure_steps_workfaces(
    model: str = "fixed",
    target: str = "initial",
    h_mode: str = "total",
    q_mode: str = "density_thickness",
    default_q: float = 1.0,
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
) -> Response:
    data = pressure_steps_workfaces(
        model=model,
        target=target,
        h_mode=h_mode,
        q_mode=q_mode,
        default_q=default_q,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    content = grid_to_csv_bytes(data["workfaces"]["adjusted"], data["grid"]["bounds"])
    filename = f"pressure_steps_workfaces_{model}_{target}_{grid_size}.csv"
    return Response(content=content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


def interpolate_field_api(field: str, method: str = "kriging", grid_size: int = 50) -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    result = interpolate_field(files=files, coords=coords, field=field, method=method, grid_size=grid_size)
    return result


def interpolate_compare_api(field: str, grid_size: int = 50) -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    methods = ["kriging", "idw", "linear", "nearest"]
    results = {}
    for method in methods:
        results[method] = interpolate_field(files=files, coords=coords, field=field, method=method, grid_size=grid_size)
    return {"field": field, "grid_size": grid_size, "results": results}


def interpolate_recommend_api(field: str, methods: str = "kriging,idw,linear,nearest") -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    data = compute_points_values(files=files, coords=coords, field=field)
    points = data["points"]
    values = data["values"]

    if len(points) < 3:
        return {"error": "not enough points for evaluation"}

    import numpy as np

    pts = np.array(points)
    vals = np.array(values)
    method_list = [m.strip() for m in methods.split(",") if m.strip()]
    scores = evaluate_methods(points=pts, values=vals, methods=method_list)
    best = min(scores.items(), key=lambda kv: kv[1]["rmse"])
    return {"field": field, "scores": scores, "recommended": best[0]}


def pressure_index_boreholes(elastic_modulus: float | None = None, density: float | None = None, tensile_strength: float | None = None) -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    weights = {}
    if elastic_modulus is not None:
        weights["elastic_modulus"] = elastic_modulus
    if density is not None:
        weights["density"] = density
    if tensile_strength is not None:
        weights["tensile_strength"] = tensile_strength
    result = compute_borehole_index(files=files, coords=coords, weights=weights or None)
    return result


def pressure_index_grid(method: str = "idw", grid_size: int = 50, elastic_modulus: float | None = None, density: float | None = None, tensile_strength: float | None = None) -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    weights = {}
    if elastic_modulus is not None:
        weights["elastic_modulus"] = elastic_modulus
    if density is not None:
        weights["density"] = density
    if tensile_strength is not None:
        weights["tensile_strength"] = tensile_strength
    base = compute_borehole_index(files=files, coords=coords, weights=weights or None)
    items = base.get("items", [])
    grid = interpolate_index(items=items, method=method, grid_size=grid_size)
    return {"base": base, "grid": grid}


def pressure_index_workfaces(
    method: str = "idw",
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
    elastic_modulus: float | None = None,
    density: float | None = None,
    tensile_strength: float | None = None,
) -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    weights = {}
    if elastic_modulus is not None:
        weights["elastic_modulus"] = elastic_modulus
    if density is not None:
        weights["density"] = density
    if tensile_strength is not None:
        weights["tensile_strength"] = tensile_strength

    base = compute_borehole_index(files=files, coords=coords, weights=weights or None)
    items = base.get("items", [])
    grid = interpolate_index(items=items, method=method, grid_size=grid_size)
    if "error" in grid:
        return grid

    adjusted = compute_workface_adjusted_grid(
        grid=grid["values"],
        bounds=grid["bounds"],
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )

    return {"base": base, "grid": grid, "workfaces": adjusted}


def export_pressure_index_workfaces(
    method: str = "idw",
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
    elastic_modulus: float | None = None,
    density: float | None = None,
    tensile_strength: float | None = None,
) -> Response:
    data = pressure_index_workfaces(
        method=method,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
        elastic_modulus=elastic_modulus,
        density=density,
        tensile_strength=tensile_strength,
    )
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    content = grid_to_csv_bytes(data["workfaces"]["adjusted"], data["grid"]["bounds"])
    filename = f"pressure_index_workfaces_{axis}_{count}_{grid_size}.csv"
    return Response(content=content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


def summary_index(method: str = "idw", grid_size: int = 60) -> dict:
    data = pressure_index_grid(method=method, grid_size=grid_size)
    if "error" in data:
        return data
    return {"grid": summarize_grid(data["grid"]["values"])}


def summary_index_workfaces(
    method: str = "idw",
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
) -> dict:
    data = pressure_index_workfaces(
        method=method,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )
    if "error" in data:
        return data
    return {"grid": summarize_grid(data["workfaces"]["adjusted"])}


def summary_steps(model: str = "fixed", target: str = "initial", grid_size: int = 60) -> dict:
    data = pressure_steps_grid(model=model, target=target, grid_size=grid_size)
    if "error" in data:
        return data
    return {"grid": summarize_grid(data["values"])}


def summary_steps_workfaces(
    model: str = "fixed",
    target: str = "initial",
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
) -> dict:
    data = pressure_steps_workfaces(
        model=model,
        target=target,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )
    if "error" in data:
        return data
    return {"grid": summarize_grid(data["workfaces"]["adjusted"])}


def summary_report(
    method: str = "idw",
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
    step_model: str = "fixed",
    step_target: str = "initial",
    step_h_mode: str = "total",
    step_q_mode: str = "density_thickness",
    step_default_q: float = 1.0,
    workface_elastic_modulus: float | None = None,
    workface_density: float | None = None,
    workface_tensile_strength: float | None = None,
) -> dict:
    """
    One-shot summary API for Report page.
    Returns four summary cards in a single response and caches
    results briefly with automatic invalidation via data signature.
    """
    req_start = time.perf_counter()
    data_dir = get_data_dir()
    data_signature = _build_report_data_signature(data_dir)
    research_signature = _build_week3_research_signature(data_dir)
    cache_key = (
        method,
        int(grid_size),
        axis,
        int(count),
        direction,
        mode,
        float(decay),
        step_model,
        step_target,
        step_h_mode,
        step_q_mode,
        float(step_default_q),
        workface_elastic_modulus,
        workface_density,
        workface_tensile_strength,
        data_signature,
        research_signature,
    )
    cached = _get_cached_report_response(cache_key)
    if cached is not None:
        elapsed_ms = (time.perf_counter() - req_start) * 1000.0
        perf = _record_report_perf(cache_hit=True, elapsed_ms=elapsed_ms)
        out = dict(cached)
        out["performance"] = perf
        out["cache"] = {"hit": True, "elapsed_ms": float(elapsed_ms)}
        return out

    index_data = pressure_index_grid(method=method, grid_size=grid_size)
    if "error" in index_data:
        err_payload = {"error": index_data.get("error", "summary index failed")}
        _set_cached_report_response(cache_key, err_payload)
        elapsed_ms = (time.perf_counter() - req_start) * 1000.0
        perf = _record_report_perf(cache_hit=False, elapsed_ms=elapsed_ms)
        out = dict(err_payload)
        out["performance"] = perf
        out["cache"] = {"hit": False, "elapsed_ms": float(elapsed_ms)}
        return out
    index_grid_values = (index_data.get("grid") or {}).get("values") or []
    index_grid_bounds = (index_data.get("grid") or {}).get("bounds") or {}
    index_grid_summary = summarize_grid(index_grid_values)

    warnings: List[str] = []

    if any(v is not None for v in (workface_elastic_modulus, workface_density, workface_tensile_strength)):
        index_wf_data = pressure_index_workfaces(
            method=method,
            grid_size=grid_size,
            axis=axis,
            count=count,
            direction=direction,
            mode=mode,
            decay=decay,
            elastic_modulus=workface_elastic_modulus,
            density=workface_density,
            tensile_strength=workface_tensile_strength,
        )
        if "error" in index_wf_data:
            warnings.append(f"index_workfaces_fallback:{index_wf_data.get('error', 'failed')}")
            index_wf_adjusted = compute_workface_adjusted_grid(
                grid=index_grid_values,
                bounds=index_grid_bounds,
                axis=axis,
                count=count,
                direction=direction,
                mode=mode,
                decay=decay,
            )
            index_wf_summary = summarize_grid(index_wf_adjusted.get("adjusted") or [])
        else:
            index_wf_summary = summarize_grid(((index_wf_data.get("workfaces") or {}).get("adjusted")) or [])
    else:
        index_wf_adjusted = compute_workface_adjusted_grid(
            grid=index_grid_values,
            bounds=index_grid_bounds,
            axis=axis,
            count=count,
            direction=direction,
            mode=mode,
            decay=decay,
        )
        index_wf_summary = summarize_grid(index_wf_adjusted.get("adjusted") or [])

    steps_data = pressure_steps_grid(
        model=step_model,
        target=step_target,
        h_mode=step_h_mode,
        q_mode=step_q_mode,
        default_q=step_default_q,
        grid_size=grid_size,
    )
    if "error" in steps_data:
        warnings.append(f"steps_unavailable:{steps_data.get('error', 'failed')}")
        steps_summary = summarize_grid([])
        steps_wf_summary = summarize_grid([])
    else:
        steps_values = steps_data.get("values") or []
        steps_bounds = steps_data.get("bounds") or {}
        steps_summary = summarize_grid(steps_values)
        steps_wf_adjusted = compute_workface_adjusted_grid(
            grid=steps_values,
            bounds=steps_bounds,
            axis=axis,
            count=count,
            direction=direction,
            mode=mode,
            decay=decay,
        )
        steps_wf_summary = summarize_grid(steps_wf_adjusted.get("adjusted") or [])
    week3_research = _load_week3_research_summary(data_dir)

    payload: Dict[str, Any] = {
        "generated_at": time.time(),
        "params": {
            "method": method,
            "grid_size": int(grid_size),
            "axis": axis,
            "count": int(count),
            "direction": direction,
            "mode": mode,
            "decay": float(decay),
            "step_model": step_model,
            "step_target": step_target,
            "step_h_mode": step_h_mode,
            "step_q_mode": step_q_mode,
            "step_default_q": float(step_default_q),
        },
        "summary": {
            "index": index_grid_summary,
            "index_workfaces": index_wf_summary,
            "steps": steps_summary,
            "steps_workfaces": steps_wf_summary,
        },
        "research": week3_research,
    }
    if warnings:
        payload["warnings"] = warnings
    _set_cached_report_response(cache_key, payload)
    elapsed_ms = (time.perf_counter() - req_start) * 1000.0
    perf = _record_report_perf(cache_hit=False, elapsed_ms=elapsed_ms)
    out = dict(payload)
    out["performance"] = perf
    out["cache"] = {"hit": False, "elapsed_ms": float(elapsed_ms)}
    return out


def summary_report_perf() -> dict:
    return {"performance": _report_perf_snapshot()}


def export_interpolation(field: str, method: str = "idw", grid_size: int = 60) -> Response:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    result = interpolate_field(files=files, coords=coords, field=field, method=method, grid_size=grid_size)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    content = grid_to_csv_bytes(result["values"], result["bounds"])
    filename = f"interpolation_{field}_{method}_{grid_size}.csv"
    return Response(content=content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


def export_index(method: str = "idw", grid_size: int = 60) -> Response:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    base = compute_borehole_index(files=files, coords=coords)
    grid = interpolate_index(items=base.get("items", []), method=method, grid_size=grid_size)
    if "error" in grid:
        raise HTTPException(status_code=400, detail=grid["error"])

    content = grid_to_csv_bytes(grid["values"], grid["bounds"])
    filename = f"pressure_index_{method}_{grid_size}.csv"
    return Response(content=content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


def pipeline_run(field: str = "elastic_modulus", method: str = "idw", grid_size: int = 60, fix_encoding: bool = True) -> dict:
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail=f"data dir not found: {data_dir}")
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    result = run_pipeline(data_dir=data_dir, field=field, method=method, grid_size=grid_size, fix_encoding=fix_encoding)
    return result


# =============================================================================
# Coal Seam Interpolation API Endpoints
# =============================================================================

def get_coal_seams_api() -> dict:
    """
    Get list of all available coal seams from borehole data.

    Returns:
        Dictionary with list of coal seams found in borehole files:
        {
            "seams": [
                {"name": "16-3煤", "borehole_count": 15, "avg_thickness": 8.5},
                {"name": "15-4煤", "borehole_count": 20, "avg_thickness": 2.1},
                ...
            ]
        }
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    result = get_all_coal_seams(files, coords)
    return result


def get_seam_stats_api(seam_name: str) -> dict:
    """
    Get detailed statistics for a specific coal seam.

    Args:
        seam_name: Name of the coal seam (e.g., "16-3煤")

    Returns:
        Dictionary with seam statistics including thickness, burial depth, and lithology summary
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    result = get_seam_stats(files, coords, seam_name)

    if not result.get("borehole_count") or result["borehole_count"] == 0:
        raise HTTPException(status_code=404, detail=f"Coal seam '{seam_name}' not found in any borehole data")

    return result


def interpolate_seam_api(
    seam_name: str,
    property: str,
    method: str = "idw",
    grid_size: int = 50,
    contour_levels: int = 10,
    include_contours: bool = True
) -> dict:
    """
    Interpolate a property for a specific coal seam with optional contour line generation.

    Args:
        seam_name: Name of the coal seam (e.g., "16-3煤")
        property: Property to interpolate ("thickness" or "burial_depth")
        method: Interpolation method ("kriging", "idw", "linear", "nearest")
        grid_size: Grid resolution (20-100)
        contour_levels: Number of contour levels (5-20)
        include_contours: Whether to include contour line data

    Returns:
        Dictionary with interpolation grid and optional contour line data
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    result = interpolate_seam_property(
        files=files,
        coords=coords,
        seam_name=seam_name,
        property=property,
        method=method,
        grid_size=grid_size,
        contour_levels=contour_levels,
        include_contours=include_contours
    )

    return result


def get_seam_overburden_api(
    seam_name: Optional[str] = None,
    seam: Optional[str] = None,
    borehole: Optional[str] = None
) -> dict:
    """
    Get overburden lithology data for a coal seam.

    Args:
        seam_name: Name of the coal seam (e.g., "16-3煤")
        borehole: Optional specific borehole name to filter results

    Returns:
        Dictionary with lithology data for column chart visualization:
        {
            "seam_name": "16-3煤",
            "boreholes": [
                {
                    "name": "50-14",
                    "x": 495394.96,
                    "y": 5404813.13,
                    "layers": [...],
                    "seam_top_depth": 450.5
                },
                ...
            ]
        }
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    seam_key = seam_name or seam
    if not seam_key:
        raise HTTPException(status_code=422, detail="missing required query param: seam_name or seam")

    result = get_overburden_lithology(files, coords, seam_key)

    if borehole:
        # Filter to specific borehole if requested
        boreholes = result.get("boreholes", [])
        filtered = [b for b in boreholes if b["name"] == borehole]
        if not filtered:
            raise HTTPException(status_code=404, detail=f"Borehole '{borehole}' not found or has no overburden data for seam '{seam_key}'")
        result["boreholes"] = filtered
        result["borehole_count"] = len(filtered)

    return result


def compare_seam_methods_api(
    seam_name: str,
    property: str = "thickness",
    grid_size: int = 50
) -> dict:
    """
    Compare different interpolation methods for a specific coal seam property.

    Args:
        seam_name: Name of the coal seam
        property: Property to compare ("thickness" or "burial_depth")
        grid_size: Grid resolution

    Returns:
        Dictionary comparing interpolation methods with recommendations
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    result = compare_interpolation_methods_for_seam(
        files=files,
        coords=coords,
        seam_name=seam_name,
        property=property,
        grid_size=grid_size
    )

    return result


def get_seam_contour_images_api(
    seam_name: str,
    method: str = "kriging",
    grid_size: int = 80,
    num_levels: int = 12,
    dpi: int = 150,
    smooth_sigma: float = 1.0
) -> dict:
    """
    Generate high-quality matplotlib contour images for both thickness and burial depth.

    This endpoint uses matplotlib to generate publication-quality contour plots with:
    - Gaussian smoothed contours
    - Filled contour colors (YlOrBr for thickness, viridis for depth)
    - Thin black contour lines with inline labels
    - Professional colorbar and formatting

    Args:
        seam_name: Name of the coal seam (e.g., "16-3煤")
        method: Interpolation method ("idw", "linear", "nearest")
        grid_size: Grid resolution (20-150, higher = smoother)
        num_levels: Number of contour levels (5-20)
        dpi: Image DPI for high-quality output (150-600)
        smooth_sigma: Gaussian smoothing sigma (0-5, higher = smoother)

    Returns:
        Dictionary with base64-encoded PNG images:
        {
            "thickness": {"image": "base64...", "format": "png", "value_range": {...}},
            "depth": {"image": "base64...", "format": "png", "value_range": {...}},
            "seam_name": "16-3煤",
            "borehole_count": 15
        }
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    data_signature = _build_contour_data_signature(data_dir)
    cache_key = (
        seam_name,
        method,
        int(grid_size),
        int(num_levels),
        int(dpi),
        round(float(smooth_sigma), 3),
        data_signature,
    )
    cached_payload = _get_cached_contour_response(cache_key)
    if cached_payload is not None:
        return cached_payload

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    # Get seam data (includes both thickness and burial depth)
    seam_data = get_coal_seam_data(files, coords, seam_name)

    if "error" in seam_data:
        raise HTTPException(status_code=404, detail=seam_data.get("error", f"Coal seam '{seam_name}' not found"))

    # Extract points and values for interpolation
    points_list = seam_data.get("points", [])
    if not points_list:
        raise HTTPException(status_code=404, detail=f"No data found for seam '{seam_name}'")

    # Interpolate both properties
    import numpy as np
    from app.services.interpolate import interpolate_from_points

    # Prepare thickness data
    thickness_pts = []
    thickness_vals = []
    depth_pts = []
    depth_vals = []

    for p in points_list:
        if p.get("x") is not None and p.get("y") is not None:
            if p.get("thickness") is not None:
                thickness_pts.append([p["x"], p["y"]])
                thickness_vals.append(p["thickness"])
            if p.get("burial_depth") is not None:
                depth_pts.append([p["x"], p["y"]])
                depth_vals.append(p["burial_depth"])

    if len(thickness_pts) < 3:
        raise HTTPException(status_code=400, detail="Not enough thickness data points for interpolation")
    if len(depth_pts) < 3:
        raise HTTPException(status_code=400, detail="Not enough burial depth data points for interpolation")

    # Thickness interpolation
    thickness_grid = interpolate_from_points(
        points=np.array(thickness_pts),
        values=np.array(thickness_vals),
        method=method,
        grid_size=grid_size
    )

    # Burial depth interpolation
    depth_grid = interpolate_from_points(
        points=np.array(depth_pts),
        values=np.array(depth_vals),
        method=method,
        grid_size=grid_size
    )

    if "error" in thickness_grid:
        raise HTTPException(status_code=400, detail=thickness_grid["error"])
    if "error" in depth_grid:
        raise HTTPException(status_code=400, detail=depth_grid["error"])

    # Generate matplotlib contour images
    try:
        images = generate_dual_contour_images(
            thickness_grid=np.array(thickness_grid["grid"]),
            depth_grid=np.array(depth_grid["grid"]),
            bounds=thickness_grid["bounds"],
            seam_name=seam_name,
            num_levels=num_levels,
            dpi=dpi,
            smooth_sigma=smooth_sigma
        )
    except Exception as e:
        import traceback
        error_detail = f"Contour generation failed: {str(e)}\n{traceback.format_exc()}"
        raise HTTPException(status_code=500, detail=error_detail)

    response_payload = {
        "seam_name": seam_name,
        "method": method,
        "grid_size": grid_size,
        "borehole_count": seam_data.get("point_count", 0),
        "bounds": thickness_grid.get("bounds"),
        "thickness": images["thickness"],
        "depth": images["depth"],
        "boreholes": seam_data.get("points", [])
    }
    _set_cached_contour_response(cache_key, response_payload)
    return response_payload


def test_contour_api() -> dict:
    """Test endpoint for contour generation."""
    import numpy as np
    from app.services.contour_generator import generate_dual_contour_images

    # Create test data
    thickness_grid = np.random.rand(20, 20) * 10 + 10
    depth_grid = np.random.rand(20, 20) * 100 + 400
    bounds = {"min_x": 0, "max_x": 1000, "min_y": 0, "max_y": 800}

    images = generate_dual_contour_images(
        thickness_grid=thickness_grid,
        depth_grid=depth_grid,
        bounds=bounds,
        seam_name="Test",
        num_levels=5,
        dpi=50,
        smooth_sigma=1.0
    )

    return {
        "test": "OK",
        "thickness": images["thickness"],
        "depth": images["depth"]
    }
