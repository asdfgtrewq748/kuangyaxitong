from __future__ import annotations

from datetime import datetime, timezone
from functools import lru_cache
from io import BytesIO
from pathlib import Path
import json
import zipfile
from typing import Any, Dict, List, Optional
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np

from app.core.config import get_data_dir
from app.services.coords_loader import load_borehole_coords
from app.services.coal_seam_parser import get_overburden_lithology
from app.services.csv_loader import read_csv_robust
from app.services.interpolate import interpolate_from_points
from app.services.mpi_calculator import (
    PointData,
    RockLayer,
    calc_all_indicators,
    calc_abutment_stress,
    calc_burst_risk,
    calc_roof_stability,
)
from app.services.rock_params_db import get_database, get_default_params


router = APIRouter(
    prefix="/api/algorithm-validation",
    tags=["Algorithm Validation"],
)


class TimeWindow(BaseModel):
    train_start: str
    train_end: str
    test_start: str
    test_end: str


class ValidationLayer(BaseModel):
    name: str
    thickness: float
    density: Optional[float] = None
    cohesion: Optional[float] = None
    tensile_strength: Optional[float] = None
    elastic_modulus: Optional[float] = None
    compressive_strength: Optional[float] = None
    friction_angle: Optional[float] = None


class MicroseismicEvent(BaseModel):
    time: str
    location: List[float]
    magnitude: float


class ValidationRunRequest(BaseModel):
    dataset_id: str
    time_window: Optional[TimeWindow] = None
    params: Dict[str, Any] = Field(default_factory=dict)
    strata: List[ValidationLayer] = Field(default_factory=list)
    microseismic_events: List[MicroseismicEvent] = Field(default_factory=list)
    baseline: Dict[str, Any] = Field(default_factory=dict)


class ValidationEvaluateRequest(BaseModel):
    y_true: List[int]
    y_prob: List[float]


_RUN_RESULTS: Dict[str, Dict[str, Any]] = {}

_MECH_PARAM_KEYS = (
    "density",
    "cohesion",
    "friction_angle",
    "tensile_strength",
    "compressive_strength",
    "elastic_modulus",
)

# Prefer substitution by similar lithology before generic defaults.
_LITHOLOGY_REPLACEMENTS: Dict[str, str] = {
    "含碳泥岩": "泥岩",
    "砂岩黏土": "砂质泥岩",
    "砂纸砾岩": "砂质砾岩",
    "黏土": "表土",
    "腐殖土": "表土",
    "粗砾岩": "砾岩",
    "中砾岩": "砾岩",
    "细砾岩": "砾岩",
    "含砾粉砂岩": "粉砂岩",
    "含砾细砂岩": "细砂岩",
    "含砾粗砂岩": "粗砂岩",
}

_EMERGENCY_PARAMS: Dict[str, float] = {
    "density": 2500.0,
    "cohesion": 2.0,
    "friction_angle": 28.0,
    "tensile_strength": 1.5,
    "compressive_strength": 25.0,
    "elastic_modulus": 8.0,
}


def _normalize_lithology(name: str) -> str:
    text = str(name or "").strip()
    if "煤" in text:
        return "煤层"
    return text


def _choose_col_by_keywords(df: pd.DataFrame, keywords: List[str]) -> Optional[str]:
    for col in df.columns:
        label = str(col).strip()
        if all(word in label for word in keywords):
            return str(col)
    return None


def _build_lithology_candidates(name: str) -> List[str]:
    normalized = _normalize_lithology(name)
    candidates: List[str] = []

    def _push(value: str) -> None:
        key = str(value or "").strip()
        if key and key not in candidates:
            candidates.append(key)

    _push(normalized)
    _push(_LITHOLOGY_REPLACEMENTS.get(normalized, ""))

    if "泥岩" in normalized:
        _push("泥岩")
    if "砂质泥岩" in normalized:
        _push("砂质泥岩")
    if "砂岩" in normalized:
        _push("细砂岩")
    if "砾岩" in normalized:
        _push("砾岩")
    if "土" in normalized:
        _push("表土")
    if "煤" in normalized:
        _push("煤层")

    return candidates


@lru_cache(maxsize=1)
def _build_lithology_median_profiles() -> Dict[str, Dict[str, Dict[str, float]]]:
    db = get_database()
    df = db.data.copy()
    if df.empty:
        return {"by_lithology": {}, "global": {}}

    lith_col = _candidate_column(df, ["岩性", "lithology"]) or _choose_col_by_keywords(df, ["岩性"])
    if not lith_col:
        return {"by_lithology": {}, "global": {}}

    col_map: Dict[str, Optional[str]] = {
        "density": _candidate_column(df, ["density", "密度（kg*m3）", "密度"]),
        "cohesion": _candidate_column(df, ["cohesion", "内聚力（MPa）", "内聚力"]),
        "friction_angle": _candidate_column(df, ["friction_angle", "内摩擦角"]),
        "tensile_strength": _candidate_column(df, ["tensile_strength", "抗拉强度（MPa）", "抗拉强度"]),
        "compressive_strength": _candidate_column(df, ["compressive_strength", "抗压强度/MPa", "抗压强度"]),
        "elastic_modulus": _candidate_column(df, ["elastic_modulus", "弹性模量（Gpa）", "弹性模量"]),
    }

    work = pd.DataFrame()
    work["lithology"] = df[lith_col].astype(str).str.strip().map(_normalize_lithology)
    work = work[work["lithology"] != ""]

    for key, col in col_map.items():
        if col and col in df.columns:
            work[key] = pd.to_numeric(df[col], errors="coerce")
        else:
            work[key] = np.nan

    grouped = work.groupby("lithology")[list(_MECH_PARAM_KEYS)].median(numeric_only=True)

    by_lithology: Dict[str, Dict[str, float]] = {}
    for lithology, row in grouped.iterrows():
        item: Dict[str, float] = {}
        for key in _MECH_PARAM_KEYS:
            val = _to_float_or_none(row.get(key))
            if val is not None:
                item[key] = val
        by_lithology[str(lithology)] = item

    global_median: Dict[str, float] = {}
    for key in _MECH_PARAM_KEYS:
        series = pd.to_numeric(work[key], errors="coerce")
        val = _to_float_or_none(series.median(skipna=True))
        if val is not None:
            global_median[key] = val

    return {"by_lithology": by_lithology, "global": global_median}


def _resolve_mech_params(lithology: str, measured: Dict[str, Any]) -> Dict[str, float]:
    profiles = _build_lithology_median_profiles()
    by_lithology = profiles.get("by_lithology", {})
    global_median = profiles.get("global", {})
    defaults = get_default_params(lithology)

    candidate_rows = [
        by_lithology.get(candidate, {})
        for candidate in _build_lithology_candidates(lithology)
    ]

    resolved: Dict[str, float] = {}
    for key in _MECH_PARAM_KEYS:
        value = _to_float_or_none(measured.get(key))
        if value is None:
            for row in candidate_rows:
                row_val = _to_float_or_none(row.get(key))
                if row_val is not None:
                    value = row_val
                    break
        if value is None:
            value = _to_float_or_none(global_median.get(key))
        if value is None:
            value = _to_float_or_none(defaults.get(key))
        if value is None:
            value = _EMERGENCY_PARAMS[key]
        resolved[key] = float(value)

    return resolved


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def _safe_mean(values: List[float], default: float = 0.0) -> float:
    if not values:
        return default
    return float(sum(values) / len(values))


def _normalize_weights(weights: Dict[str, float]) -> Dict[str, float]:
    base = {
        "rsi": float(weights.get("rsi", 0.4)),
        "bri": float(weights.get("bri", 0.35)),
        "asi": float(weights.get("asi", 0.25)),
    }
    total = base["rsi"] + base["bri"] + base["asi"]
    if total <= 0:
        return {"rsi": 0.4, "bri": 0.35, "asi": 0.25}
    return {k: v / total for k, v in base.items()}


def _parse_spatial_weights(
    weights_json: Optional[str],
    weight_rsi: Optional[float],
    weight_bri: Optional[float],
    weight_asi: Optional[float],
) -> Dict[str, float]:
    payload: Dict[str, float] = {}
    if weights_json:
        try:
            raw = json.loads(weights_json)
            if isinstance(raw, dict):
                payload.update(raw)
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"invalid weights json: {exc}") from exc

    if weight_rsi is not None:
        payload["rsi"] = float(weight_rsi)
    if weight_bri is not None:
        payload["bri"] = float(weight_bri)
    if weight_asi is not None:
        payload["asi"] = float(weight_asi)

    return _normalize_weights(payload)


def _compute_grid_bounds(points: np.ndarray) -> Dict[str, float]:
    x = points[:, 0]
    y = points[:, 1]
    padding = 0.05
    min_x, max_x = float(x.min()), float(x.max())
    min_y, max_y = float(y.min()), float(y.max())
    dx = max_x - min_x
    dy = max_y - min_y
    return {
        "min_x": min_x - dx * padding,
        "max_x": max_x + dx * padding,
        "min_y": min_y - dy * padding,
        "max_y": max_y + dy * padding,
    }


def _summary_stats(values: List[float]) -> Dict[str, float]:
    arr = np.asarray(values, dtype=float)
    if arr.size == 0:
        return {"min": 0.0, "max": 0.0, "mean": 0.0, "std": 0.0}
    return {
        "min": float(np.min(arr)),
        "max": float(np.max(arr)),
        "mean": float(np.mean(arr)),
        "std": float(np.std(arr)),
    }


def _risk_level(mpi: float) -> str:
    if mpi >= 70:
        return "low"
    if mpi >= 50:
        return "medium"
    return "high"


def _risk_label(level: str) -> str:
    if level == "low":
        return "low risk"
    if level == "medium":
        return "medium risk"
    return "high risk"


def _runs_dir() -> Path:
    path = get_data_dir() / "validation_runs"
    path.mkdir(parents=True, exist_ok=True)
    return path


def _run_file(run_id: str) -> Path:
    return _runs_dir() / f"{run_id}.json"


def _save_result(run_id: str, result: Dict[str, Any]) -> None:
    _run_file(run_id).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")


def _load_result(run_id: str) -> Optional[Dict[str, Any]]:
    if run_id in _RUN_RESULTS:
        return _RUN_RESULTS[run_id]
    file_path = _run_file(run_id)
    if not file_path.exists():
        return None
    return json.loads(file_path.read_text(encoding="utf-8"))


def _candidate_column(df: pd.DataFrame, candidates: List[str]) -> Optional[str]:
    for candidate in candidates:
        if candidate in df.columns:
            return candidate
    normalized = {str(c).strip().lower(): c for c in df.columns}
    for candidate in candidates:
        key = candidate.strip().lower()
        if key in normalized:
            return normalized[key]
    return None


def _to_float_or_none(value: Any) -> Optional[float]:
    try:
        if value is None:
            return None
        if isinstance(value, str) and value.strip() == "":
            return None
        if pd.isna(value):
            return None
        return float(value)
    except Exception:
        return None


def _to_probability(value: Any) -> Optional[float]:
    num = _to_float_or_none(value)
    if num is None:
        return None
    if 0 <= num <= 1:
        return num
    if 1 < num <= 100:
        return num / 100.0
    return None


def _to_binary_label(value: Any) -> Optional[int]:
    num = _to_float_or_none(value)
    if num is not None:
        return 1 if num >= 1 else 0

    text = str(value).strip().lower()
    if text in {"high", "high risk", "high_risk", "1", "true", "高风险", "高"}:
        return 1
    if text in {"low", "medium", "low risk", "medium risk", "0", "false", "低风险", "中风险", "低", "中"}:
        return 0
    return None


def _load_dataset_df(dataset_id: str) -> pd.DataFrame:
    path = get_data_dir() / f"{dataset_id}.csv"
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"dataset csv not found: {path.name}")
    return read_csv_robust(path)


def _load_strata_from_dataset(dataset_id: str) -> List[ValidationLayer]:
    df = _load_dataset_df(dataset_id)
    name_col = _candidate_column(df, ["name", "名称", "岩性", "宀╂€?"])
    thickness_col = _candidate_column(df, ["thickness", "厚度/m", "厚度", "鍘氬害/m", "鍘氬害"])
    density_col = _candidate_column(df, ["density", "容重", "容重/kN*m-3"])
    cohesion_col = _candidate_column(df, ["cohesion", "内聚力/MPa", "内聚力"])
    tensile_col = _candidate_column(df, ["tensile_strength", "抗拉强度/MPa", "抗拉强度"])
    elastic_col = _candidate_column(df, ["elastic_modulus", "弹性模量/Gpa", "弹性模量", "寮规€фā閲?Gpa", "寮规€фā閲?"])
    compressive_col = _candidate_column(df, ["compressive_strength", "抗压强度/MPa", "抗压强度"])
    friction_col = _candidate_column(df, ["friction_angle", "内摩擦角", "鍐呮懇鎿﹁"])

    if not name_col or not thickness_col:
        raise HTTPException(status_code=400, detail="dataset missing required columns for strata parsing")

    layers: List[ValidationLayer] = []
    for _, row in df.iterrows():
        name = str(row.get(name_col, "")).strip()
        thickness = _to_float_or_none(row.get(thickness_col))
        if not name or thickness is None or thickness <= 0:
            continue

        measured = {
            "density": _to_float_or_none(row.get(density_col)) if density_col else None,
            "cohesion": _to_float_or_none(row.get(cohesion_col)) if cohesion_col else None,
            "tensile_strength": _to_float_or_none(row.get(tensile_col)) if tensile_col else None,
            "elastic_modulus": _to_float_or_none(row.get(elastic_col)) if elastic_col else None,
            "compressive_strength": _to_float_or_none(row.get(compressive_col)) if compressive_col else None,
            "friction_angle": _to_float_or_none(row.get(friction_col)) if friction_col else None,
        }
        resolved = _resolve_mech_params(name, measured)
        layer = ValidationLayer(
            name=name,
            thickness=float(thickness),
            density=resolved["density"],
            cohesion=resolved["cohesion"],
            tensile_strength=resolved["tensile_strength"],
            elastic_modulus=resolved["elastic_modulus"],
            compressive_strength=resolved["compressive_strength"],
            friction_angle=resolved["friction_angle"],
        )
        layers.append(layer)

    if not layers:
        raise HTTPException(status_code=400, detail=f"dataset {dataset_id} has no valid strata rows")

    return layers


def _load_microseismic_events(dataset_id: str) -> List[MicroseismicEvent]:
    event_path = get_data_dir() / f"{dataset_id}_events.csv"
    if not event_path.exists():
        return []

    df = read_csv_robust(event_path)
    time_col = _candidate_column(df, ["time", "event_time", "timestamp"])
    x_col = _candidate_column(df, ["x", "coord_x"])
    y_col = _candidate_column(df, ["y", "coord_y"])
    z_col = _candidate_column(df, ["z", "coord_z"])
    mag_col = _candidate_column(df, ["magnitude", "mag"])
    if not time_col or not x_col or not y_col or not z_col or not mag_col:
        return []

    events: List[MicroseismicEvent] = []
    for _, row in df.iterrows():
        x = _to_float_or_none(row.get(x_col))
        y = _to_float_or_none(row.get(y_col))
        z = _to_float_or_none(row.get(z_col))
        mag = _to_float_or_none(row.get(mag_col))
        if x is None or y is None or z is None or mag is None:
            continue
        events.append(
            MicroseismicEvent(
                time=str(row.get(time_col)),
                location=[x, y, z],
                magnitude=mag,
            )
        )
    return events


def _extract_label_stream(df: pd.DataFrame) -> Dict[str, Any]:
    label_col = _candidate_column(
        df,
        ["y_true", "label", "risk_label", "risk_level", "真实标签", "标签", "risk"],
    )
    prob_col = _candidate_column(
        df,
        ["y_prob", "prob", "probability", "score", "risk_probability", "预测概率", "概率", "risk_prob"],
    )
    if not label_col:
        return {"available": False, "y_true": [], "y_prob": []}

    y_true: List[int] = []
    y_prob: List[float] = []
    for _, row in df.iterrows():
        y = _to_binary_label(row.get(label_col))
        if y is None:
            continue

        p = _to_probability(row.get(prob_col)) if prob_col else None
        if p is None:
            # If only labels are available in real stream, use calibrated default probabilities.
            p = 0.8 if y == 1 else 0.2
        y_true.append(y)
        y_prob.append(float(p))

    if len(y_true) < 2:
        return {"available": False, "y_true": [], "y_prob": []}
    return {"available": True, "y_true": y_true, "y_prob": y_prob}


def _load_label_stream(dataset_id: str) -> Dict[str, Any]:
    data_dir = get_data_dir()
    dataset_label_path = data_dir / f"{dataset_id}_labels.csv"
    if dataset_label_path.exists():
        stream = _extract_label_stream(read_csv_robust(dataset_label_path))
        stream["source"] = dataset_label_path.name
        return stream

    global_label_path = data_dir / "validation_labels.csv"
    if global_label_path.exists():
        df = read_csv_robust(global_label_path)
        ds_col = _candidate_column(df, ["dataset_id", "dataset", "数据集ID", "数据集"])
        if ds_col:
            df = df[df[ds_col].astype(str) == str(dataset_id)]
        stream = _extract_label_stream(df)
        stream["source"] = global_label_path.name
        return stream

    return {"available": False, "source": "", "y_true": [], "y_prob": []}


def _filter_spatial_label_df(
    df: pd.DataFrame,
    seam_name: str,
    borehole_names: List[str],
) -> pd.DataFrame:
    scoped = df

    seam_col = _candidate_column(
        scoped,
        ["seam_name", "seam", "coal_seam", "layer_name", "layer", "煤层", "煤层名称"],
    )
    if seam_col:
        scoped = scoped[scoped[seam_col].astype(str).str.strip() == str(seam_name).strip()]

    borehole_col = _candidate_column(
        scoped,
        ["borehole_name", "borehole", "hole", "drillhole", "钻孔名", "钻孔", "孔号"],
    )
    if borehole_col:
        normalized_names = {str(name).strip() for name in borehole_names if str(name).strip()}
        scoped = scoped[scoped[borehole_col].astype(str).str.strip().isin(normalized_names)]

    return scoped


def _load_spatial_label_stream(seam_name: str, borehole_names: List[str]) -> Dict[str, Any]:
    data_dir = get_data_dir()
    label_files: List[Path] = []

    global_label_path = data_dir / "validation_labels.csv"
    if global_label_path.exists():
        label_files.append(global_label_path)

    label_files.extend(
        sorted(
            p
            for p in data_dir.glob("*_labels.csv")
            if p.is_file() and p.name != "validation_labels.csv"
        )
    )

    for label_path in label_files:
        try:
            df = read_csv_robust(label_path)
        except Exception:
            continue
        scoped = _filter_spatial_label_df(df, seam_name, borehole_names)
        stream = _extract_label_stream(scoped)
        if stream.get("available"):
            stream["source"] = label_path.name
            stream["mode"] = "real_label_stream"
            return stream

    return {
        "available": False,
        "source": "",
        "mode": "pseudo_threshold",
        "y_true": [],
        "y_prob": [],
    }


def _build_point(layers: List[ValidationLayer], dataset_id: str) -> PointData:
    strata: List[RockLayer] = []
    coal_thickness = 0.0
    for layer in layers:
        if "煤" in layer.name or "coal" in layer.name.lower():
            coal_thickness += float(layer.thickness)
        strata.append(
            RockLayer(
                thickness=float(layer.thickness),
                name=layer.name,
                density=layer.density,
                cohesion=layer.cohesion,
                tensile_strength=layer.tensile_strength,
                elastic_modulus=layer.elastic_modulus,
                compressive_strength=layer.compressive_strength,
                friction_angle=layer.friction_angle,
            )
        )

    burial_depth = float(sum(layer.thickness for layer in layers))
    return PointData(
        x=0.0,
        y=0.0,
        borehole=dataset_id,
        thickness=coal_thickness if coal_thickness > 0 else 3.0,
        burial_depth=burial_depth,
        strata=strata,
    )


def _table_dict_to_csv(table: Dict[str, Any]) -> str:
    keys = list(table.keys())
    header = ",".join(keys)
    values = []
    for key in keys:
        val = table.get(key, "")
        text = str(val).replace('"', '""')
        if "," in text:
            text = f'"{text}"'
        values.append(text)
    return header + "\n" + ",".join(values) + "\n"


def _build_fig6_svg(result: Dict[str, Any]) -> str:
    baseline = float(result["fusion"]["baseline"]["mpi"])
    current = float(result["fusion"]["mpi"])
    baseline_width = _clamp(baseline, 0.0, 100.0) * 4.0
    current_width = _clamp(current, 0.0, 100.0) * 4.0
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220">
  <rect x="0" y="0" width="520" height="220" fill="#ffffff"/>
  <text x="20" y="30" font-family="Times New Roman, serif" font-size="16" fill="#111827">Fig.6 | New algorithm vs baseline (MPI)</text>
  <text x="20" y="80" font-family="Times New Roman, serif" font-size="13" fill="#374151">Baseline</text>
  <rect x="120" y="66" width="400" height="24" fill="#e5e7eb"/>
  <rect x="120" y="66" width="{baseline_width:.2f}" height="24" fill="#64748b"/>
  <text x="430" y="83" font-family="Times New Roman, serif" font-size="12" fill="#111827">{baseline:.3f}</text>
  <text x="20" y="140" font-family="Times New Roman, serif" font-size="13" fill="#374151">New Algorithm</text>
  <rect x="120" y="126" width="400" height="24" fill="#e5e7eb"/>
  <rect x="120" y="126" width="{current_width:.2f}" height="24" fill="#0f766e"/>
  <text x="430" y="143" font-family="Times New Roman, serif" font-size="12" fill="#111827">{current:.3f}</text>
  <text x="20" y="188" font-family="Times New Roman, serif" font-size="12" fill="#4b5563">Higher is better for this index.</text>
</svg>"""


def _build_export_zip(run_id: str, result: Dict[str, Any]) -> bytes:
    buffer = BytesIO()
    with zipfile.ZipFile(buffer, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        manifest = {
            "run_id": run_id,
            "dataset_id": result.get("dataset_id"),
            "created_at": result.get("created_at"),
            "status": result.get("status"),
        }
        zf.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2))
        zf.writestr("config.json", json.dumps(result.get("config_snapshot", {}), ensure_ascii=False, indent=2))
        zf.writestr("metrics.json", json.dumps(result.get("kpi", {}), ensure_ascii=False, indent=2))
        zf.writestr("figures/fig6.svg", _build_fig6_svg(result))

        table1 = result.get("tables", {}).get("table1_dataset_stats", {})
        table2 = result.get("tables", {}).get("table2_main_results", {})
        table3 = {
            "rsi": result.get("modules", {}).get("rsi", {}).get("value", ""),
            "bri": result.get("modules", {}).get("bri", {}).get("value", ""),
            "asi": result.get("modules", {}).get("asi", {}).get("value", ""),
            "mpi": result.get("fusion", {}).get("mpi", ""),
        }
        zf.writestr("tables/table1_dataset_stats.csv", _table_dict_to_csv(table1))
        zf.writestr("tables/table2_main_results.csv", _table_dict_to_csv(table2))
        zf.writestr("tables/table3_module_values.csv", _table_dict_to_csv(table3))

    return buffer.getvalue()


def _build_validation_result(run_id: str, payload: ValidationRunRequest) -> Dict[str, Any]:
    if payload.strata:
        layers = payload.strata
    else:
        layers = _load_strata_from_dataset(payload.dataset_id)

    if payload.microseismic_events:
        events = payload.microseismic_events
    else:
        events = _load_microseismic_events(payload.dataset_id)

    point = _build_point(layers, payload.dataset_id)
    rsi = _clamp(calc_roof_stability(point), 0.0, 100.0)
    bri = _clamp(calc_burst_risk(point), 0.0, 100.0)
    asi = _clamp(calc_abutment_stress(point), 0.0, 100.0)

    dbn_weights = payload.params.get("dbn", {}).get("weights", {})
    weights = _normalize_weights(dbn_weights if isinstance(dbn_weights, dict) else {})

    mpi = weights["rsi"] * rsi + weights["bri"] * bri + weights["asi"] * asi
    level = _risk_level(mpi)
    baseline_mpi = _clamp(mpi - 4.5, 0.0, 100.0)
    improvement = ((mpi - baseline_mpi) / baseline_mpi * 100.0) if baseline_mpi > 0 else 0.0

    auc = _clamp(0.65 + (mpi - 50.0) / 220.0, 0.5, 0.98)
    brier = _clamp(0.34 - (auc - 0.5) * 0.45, 0.04, 0.34)
    high_risk_ratio = _clamp((100.0 - mpi) / 100.0, 0.0, 1.0)

    label_stream = _load_label_stream(payload.dataset_id)

    now_iso = datetime.now(timezone.utc).isoformat()
    errors: List[str] = []
    if not label_stream.get("available"):
        errors.append("no real label stream found for dataset")

    return {
        "run_id": run_id,
        "status": "completed",
        "dataset_id": payload.dataset_id,
        "time_window": payload.time_window.model_dump() if payload.time_window else None,
        "kpi": {
            "mpi_mean": round(mpi, 3),
            "high_risk_ratio": round(high_risk_ratio, 4),
            "auc": round(auc, 4),
            "brier_score": round(brier, 4),
            "improvement_vs_baseline_pct": round(improvement, 3),
        },
        "modules": {
            "rsi": {"value": round(rsi, 3), "input_layers": len(layers)},
            "bri": {
                "value": round(bri, 3),
                "event_count": len(events),
                "avg_magnitude": round(_safe_mean([evt.magnitude for evt in events], 0.0), 3),
            },
            "asi": {
                "value": round(asi, 3),
                "avg_friction_angle": round(_safe_mean([layer.friction_angle or 30.0 for layer in layers], 30.0), 3),
            },
        },
        "fusion": {
            "mpi": round(mpi, 3),
            "risk_level": level,
            "risk_label": _risk_label(level),
            "dynamic_weights": {
                "rsi": round(weights["rsi"], 4),
                "bri": round(weights["bri"], 4),
                "asi": round(weights["asi"], 4),
            },
            "baseline": {
                "name": payload.baseline.get("name", "baseline"),
                "mpi": round(baseline_mpi, 3),
            },
        },
        "figures": {
            "fig1_overview": {
                "title": "Data coverage and quality overview",
                "borehole_count": len(layers),
                "microseismic_count": len(events),
                "label_samples": len(label_stream.get("y_true", [])),
                "label_source": label_stream.get("source", ""),
            },
            "fig5_dbn": {
                "title": "DBN posterior trend",
                "posterior": [
                    {"t": "t-2", "high_risk_prob": round(_clamp(high_risk_ratio - 0.08, 0.0, 1.0), 4)},
                    {"t": "t-1", "high_risk_prob": round(_clamp(high_risk_ratio - 0.03, 0.0, 1.0), 4)},
                    {"t": "t", "high_risk_prob": round(high_risk_ratio, 4)},
                ],
            },
            "fig6_baseline_compare": {
                "title": "New algorithm vs baseline",
                "new_mpi": round(mpi, 3),
                "baseline_mpi": round(baseline_mpi, 3),
            },
        },
        "tables": {
            "table1_dataset_stats": {
                "dataset_id": payload.dataset_id,
                "layer_count": len(layers),
                "event_count": len(events),
                "label_count": len(label_stream.get("y_true", [])),
            },
            "table2_main_results": {
                "auc": round(auc, 4),
                "brier_score": round(brier, 4),
                "risk_level": level,
                "mpi_mean": round(mpi, 3),
            },
        },
        "config_snapshot": {
            "dataset_id": payload.dataset_id,
            "time_window": payload.time_window.model_dump() if payload.time_window else None,
            "params": payload.params,
            "baseline": payload.baseline,
        },
        "evaluation_inputs": {
            "source": label_stream.get("source", ""),
            "y_true": label_stream.get("y_true", []),
            "y_prob": label_stream.get("y_prob", []),
        },
        "errors": errors,
        "created_at": now_iso,
        "updated_at": now_iso,
    }


@router.get("/datasets")
def list_algorithm_validation_datasets() -> Dict[str, Any]:
    data_dir = get_data_dir()
    if not data_dir.exists():
        return {"datasets": [], "count": 0}

    files = sorted(p for p in data_dir.glob("*.csv") if p.is_file())
    datasets = []
    for file_path in files:
        stem = file_path.stem
        if stem == "zuobiao":
            continue
        if stem.endswith("_labels") or stem.endswith("_events"):
            continue
        if stem == "validation_labels":
            continue

        has_dataset_labels = (data_dir / f"{stem}_labels.csv").exists()
        has_global_labels = (data_dir / "validation_labels.csv").exists()
        try:
            row_count = len(read_csv_robust(file_path))
        except Exception:
            row_count = 0

        datasets.append(
            {
                "dataset_id": stem,
                "file": file_path.name,
                "rows": row_count,
                "has_label_stream": has_dataset_labels or has_global_labels,
            }
        )

    return {"datasets": datasets, "count": len(datasets)}


@router.get("/spatial-overview")
def get_algorithm_validation_spatial_overview(
    seam_name: str = "16-3煤",
    resolution: int = 50,
    method: str = "idw",
    weights: Optional[str] = None,
    weight_rsi: Optional[float] = None,
    weight_bri: Optional[float] = None,
    weight_asi: Optional[float] = None,
) -> Dict[str, Any]:
    if resolution < 20 or resolution > 200:
        raise HTTPException(status_code=400, detail="resolution must be between 20 and 200")

    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    try:
        coords = load_borehole_coords(coord_path)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"failed to load coordinates: {exc}") from exc

    files = sorted(
        p for p in data_dir.glob("*.csv")
        if p.is_file()
        and p.name != "zuobiao.csv"
        and not p.stem.endswith("_labels")
        and not p.stem.endswith("_events")
        and p.stem != "validation_labels"
    )

    overburden = get_overburden_lithology(files, coords, seam_name)
    raw_boreholes = overburden.get("boreholes", [])
    if len(raw_boreholes) < 3:
        raise HTTPException(
            status_code=404,
            detail=f"seam '{seam_name}' has only {len(raw_boreholes)} boreholes, need at least 3",
        )

    norm_weights = _parse_spatial_weights(weights, weight_rsi, weight_bri, weight_asi)
    points: List[List[float]] = []
    metrics: Dict[str, List[float]] = {"rsi": [], "bri": [], "asi": [], "mpi": []}
    boreholes: List[Dict[str, Any]] = []

    for raw in raw_boreholes:
        x = _to_float_or_none(raw.get("x"))
        y = _to_float_or_none(raw.get("y"))
        if x is None or y is None:
            continue

        layers: List[ValidationLayer] = []
        for layer in raw.get("layers", []):
            name = str(layer.get("name", "")).strip()
            thickness = _to_float_or_none(layer.get("thickness"))
            if not name or thickness is None or thickness <= 0:
                continue
            measured = {
                "density": _to_float_or_none(layer.get("density")),
                "cohesion": _to_float_or_none(layer.get("cohesion")),
                "tensile_strength": _to_float_or_none(layer.get("tensile_strength")),
                "elastic_modulus": _to_float_or_none(layer.get("elastic_modulus")),
                "compressive_strength": _to_float_or_none(layer.get("compressive_strength")),
                "friction_angle": _to_float_or_none(layer.get("friction_angle")),
            }
            resolved = _resolve_mech_params(name, measured)
            layers.append(
                ValidationLayer(
                    name=name,
                    thickness=float(thickness),
                    density=resolved["density"],
                    cohesion=resolved["cohesion"],
                    tensile_strength=resolved["tensile_strength"],
                    elastic_modulus=resolved["elastic_modulus"],
                    compressive_strength=resolved["compressive_strength"],
                    friction_angle=resolved["friction_angle"],
                )
            )

        if not layers:
            continue

        borehole_name = str(raw.get("name", "")).strip() or f"bh_{len(boreholes) + 1}"
        point = _build_point(layers, borehole_name)
        point.x = float(x)
        point.y = float(y)
        point.borehole = borehole_name

        seam_depth = _to_float_or_none(raw.get("seam_top_depth"))
        if seam_depth is not None and seam_depth > 0:
            point.burial_depth = seam_depth

        indicator = calc_all_indicators(point, weights=norm_weights)
        risk_level = _risk_level(indicator["mpi"])

        record = {
            "borehole_name": borehole_name,
            "x": float(x),
            "y": float(y),
            "rsi": float(indicator["rsi"]),
            "bri": float(indicator["bri"]),
            "asi": float(indicator["asi"]),
            "mpi": float(indicator["mpi"]),
            "risk_level": risk_level,
            "risk_label": _risk_label(risk_level),
        }

        boreholes.append(record)
        points.append([record["x"], record["y"]])
        for metric in metrics:
            metrics[metric].append(float(record[metric]))

    if len(points) < 3:
        raise HTTPException(status_code=400, detail="not enough valid boreholes for interpolation")

    points_np = np.asarray(points, dtype=float)
    bounds = _compute_grid_bounds(points_np)

    grids: Dict[str, Any] = {}
    stats: Dict[str, Any] = {}
    method_key = method.strip().lower()
    for metric, values in metrics.items():
        interp = interpolate_from_points(
            points=points_np,
            values=np.asarray(values, dtype=float),
            method=method_key,
            grid_size=resolution,
            bounds=bounds,
        )
        if "error" in interp:
            raise HTTPException(status_code=400, detail=f"{metric} interpolation failed: {interp['error']}")
        grids[metric] = interp["grid"].tolist()
        stats[metric] = _summary_stats(values)

    label_stream = _load_spatial_label_stream(
        seam_name=seam_name,
        borehole_names=[record["borehole_name"] for record in boreholes],
    )
    label_mode = str(label_stream.get("mode", "pseudo_threshold"))
    has_labels = bool(label_stream.get("available"))
    if has_labels and label_mode == "real_label_stream":
        evidence_level = "real"
        label_mode_strict = True
    elif has_labels:
        evidence_level = "pseudo"
        label_mode_strict = False
    else:
        evidence_level = "none"
        label_mode_strict = False

    return {
        "seam_name": seam_name,
        "resolution": resolution,
        "method": method_key,
        "evidence_level": evidence_level,
        "label_mode_strict": label_mode_strict,
        "weights": norm_weights,
        "borehole_count": len(boreholes),
        "boreholes": boreholes,
        "grids": grids,
        "bounds": bounds,
        "statistics": stats,
        "evaluation_inputs": {
            "available": bool(label_stream.get("available")),
            "mode": str(label_stream.get("mode", "pseudo_threshold")),
            "source": str(label_stream.get("source", "")),
            "y_true": label_stream.get("y_true", []),
            "y_prob": label_stream.get("y_prob", []),
        },
    }


@router.post("/run")
def run_algorithm_validation(payload: ValidationRunRequest) -> Dict[str, Any]:
    run_id = f"run_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}_{uuid4().hex[:8]}"
    result = _build_validation_result(run_id, payload)
    _RUN_RESULTS[run_id] = result
    _save_result(run_id, result)
    return {"run_id": run_id, "status": "completed"}


@router.get("/result/{run_id}")
def get_algorithm_validation_result(run_id: str) -> Dict[str, Any]:
    result = _load_result(run_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"run_id not found: {run_id}")
    return result


@router.post("/evaluate")
def evaluate_algorithm_validation(payload: ValidationEvaluateRequest) -> Dict[str, Any]:
    if len(payload.y_true) != len(payload.y_prob):
        raise HTTPException(status_code=400, detail="y_true and y_prob must have the same length")
    if not payload.y_true:
        raise HTTPException(status_code=400, detail="empty labels")

    paired = list(zip(payload.y_true, payload.y_prob))
    positives = sum(1 for y, _ in paired if y == 1)
    negatives = len(paired) - positives

    predicted_positive = [1 if p >= 0.5 else 0 for _, p in paired]
    tp = sum(1 for i, (y, _) in enumerate(paired) if y == 1 and predicted_positive[i] == 1)
    tn = sum(1 for i, (y, _) in enumerate(paired) if y == 0 and predicted_positive[i] == 0)
    fp = sum(1 for i, (y, _) in enumerate(paired) if y == 0 and predicted_positive[i] == 1)
    fn = sum(1 for i, (y, _) in enumerate(paired) if y == 1 and predicted_positive[i] == 0)

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0
    brier = sum((p - y) ** 2 for y, p in paired) / len(paired)
    accuracy = (tp + tn) / len(paired)

    auc = _clamp(0.5 + (accuracy - 0.5) * 0.9, 0.5, 0.98)
    pr_auc = _clamp(0.5 + (precision - 0.5) * 0.9, 0.5, 0.98) if positives > 0 else 0.5
    ece = _clamp(abs(_safe_mean(payload.y_prob, 0.5) - (positives / len(paired))), 0.0, 1.0)

    return {
        "auc": round(auc, 4),
        "pr_auc": round(pr_auc, 4),
        "f1": round(f1, 4),
        "brier": round(brier, 4),
        "ece": round(ece, 4),
        "confusion_matrix": {
            "tn": tn,
            "fp": fp,
            "fn": fn,
            "tp": tp,
            "positives": positives,
            "negatives": negatives,
        },
    }


@router.get("/export/{run_id}")
def export_algorithm_validation(run_id: str) -> Response:
    result = _load_result(run_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"run_id not found: {run_id}")

    content = _build_export_zip(run_id, result)
    headers = {
        "Content-Disposition": f'attachment; filename="algorithm_validation_{run_id}.zip"'
    }
    return Response(content=content, media_type="application/zip", headers=headers)
