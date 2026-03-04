from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import json
from pathlib import Path
import threading
from typing import Any, Dict, List, Optional
from uuid import uuid4

import numpy as np
import pandas as pd

from app.core.config import get_data_dir
from app.schemas.geomodel import (
    GeomodelArtifactItem,
    GeomodelJobCreate,
    GeomodelJobResponse,
    GeomodelJobStatus,
    GeomodelManifest,
)
from app.services.csv_loader import read_csv_robust
from app.services.interpolate import interpolate_from_points


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


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


def _guess_column(df: pd.DataFrame, candidates: List[str]) -> Optional[str]:
    normalized = {str(col).strip().lower(): col for col in df.columns}
    for cand in candidates:
        key = cand.strip().lower()
        if key in normalized:
            return str(normalized[key])
    for col in df.columns:
        text = str(col).strip().lower()
        if any(c in text for c in [c.lower() for c in candidates]):
            return str(col)
    return None


def _sanitize_layer_name(name: str) -> str:
    allowed = []
    for ch in name:
        if ch.isalnum() or ch in {"-", "_"}:
            allowed.append(ch)
        else:
            allowed.append("_")
    clean = "".join(allowed).strip("_")
    if not clean:
        return "layer"
    return clean[:40]


@dataclass
class _JobRecord:
    job_id: str
    created_at: str
    request: GeomodelJobCreate
    output_dir: Path
    status: GeomodelJobStatus = GeomodelJobStatus.pending
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    message: str = ""
    error: Optional[str] = None
    result_manifest: Optional[GeomodelManifest] = None


class GeomodelService:
    def __init__(self) -> None:
        self._jobs: Dict[str, _JobRecord] = {}
        self._lock = threading.Lock()

    def create_job(self, request: GeomodelJobCreate) -> GeomodelJobResponse:
        job_id = uuid4().hex[:12]
        output_dir = get_data_dir() / "_geomodel_runs" / job_id
        output_dir.mkdir(parents=True, exist_ok=True)

        record = _JobRecord(
            job_id=job_id,
            created_at=_utc_now_iso(),
            request=request,
            output_dir=output_dir,
            status=GeomodelJobStatus.pending,
            message="job queued",
        )
        with self._lock:
            self._jobs[job_id] = record

        worker = threading.Thread(target=self._run_job, args=(job_id,), daemon=True)
        worker.start()

        return self._as_job_response(record)

    def get_job(self, job_id: str) -> GeomodelJobResponse:
        record = self._get_job_record(job_id)
        return self._as_job_response(record)

    def list_artifacts(self, job_id: str) -> List[GeomodelArtifactItem]:
        record = self._get_job_record(job_id)
        if not record.result_manifest:
            return []
        return record.result_manifest.artifacts

    def get_artifact_path(self, job_id: str, artifact_name: str) -> Path:
        record = self._get_job_record(job_id)
        safe_name = Path(artifact_name).name
        artifact_path = (record.output_dir / safe_name).resolve()
        if not artifact_path.exists():
            raise FileNotFoundError(safe_name)
        if record.output_dir.resolve() not in artifact_path.parents:
            raise FileNotFoundError(safe_name)
        return artifact_path

    def _get_job_record(self, job_id: str) -> _JobRecord:
        with self._lock:
            record = self._jobs.get(job_id)
        if not record:
            raise KeyError(job_id)
        return record

    def _set_job_status(
        self,
        job_id: str,
        status: GeomodelJobStatus,
        message: str,
        error: Optional[str] = None,
        manifest: Optional[GeomodelManifest] = None,
        mark_started: bool = False,
        mark_completed: bool = False,
    ) -> None:
        with self._lock:
            job = self._jobs[job_id]
            job.status = status
            job.message = message
            job.error = error
            if mark_started:
                job.started_at = _utc_now_iso()
            if mark_completed:
                job.completed_at = _utc_now_iso()
            if manifest is not None:
                job.result_manifest = manifest

    def _run_job(self, job_id: str) -> None:
        self._set_job_status(
            job_id=job_id,
            status=GeomodelJobStatus.running,
            message="running geomodel job",
            mark_started=True,
        )

        try:
            record = self._get_job_record(job_id)
            manifest = self._build_job_artifacts(record)
            self._set_job_status(
                job_id=job_id,
                status=GeomodelJobStatus.completed,
                message="geomodel job completed",
                manifest=manifest,
                mark_completed=True,
            )
        except Exception as exc:  # pragma: no cover - defensive path
            self._set_job_status(
                job_id=job_id,
                status=GeomodelJobStatus.failed,
                message="geomodel job failed",
                error=str(exc),
                mark_completed=True,
            )

    def _build_job_artifacts(self, job: _JobRecord) -> GeomodelManifest:
        data_dir = get_data_dir()
        borehole_files = sorted(
            p
            for p in data_dir.glob("*.csv")
            if p.is_file()
            and p.name != "zuobiao.csv"
            and not p.stem.endswith("_labels")
            and not p.stem.endswith("_events")
            and p.stem != "validation_labels"
        )
        if not borehole_files:
            raise ValueError("no borehole csv files found in DATA_DIR")

        coords = self._load_coords(data_dir / "zuobiao.csv")
        parsed = self._parse_boreholes(borehole_files, coords)
        if not parsed["boreholes"]:
            raise ValueError("no valid borehole rows with layer/thickness columns")

        summary = self._build_summary(job, parsed)
        quality = self._build_quality_report(parsed)
        bounds = self._calculate_bounds(parsed["boreholes"])
        layer_meshes = self._build_layer_meshes(
            parsed=parsed,
            method_hint=job.request.method.value,
            resolution=float(job.request.resolution),
            bounds=bounds,
        )

        summary_path = job.output_dir / "summary.json"
        quality_path = job.output_dir / "quality_report.json"
        summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
        quality_path.write_text(json.dumps(quality, ensure_ascii=False, indent=2), encoding="utf-8")

        model_doc = self._build_model_document(
            job=job,
            parsed=parsed,
            summary=summary,
            quality=quality,
            bounds=bounds,
            layer_meshes=layer_meshes,
        )
        model_json_path = job.output_dir / "model.json"
        model_json_path.write_text(json.dumps(model_doc, ensure_ascii=False, indent=2), encoding="utf-8")

        requested = {x.lower() for x in job.request.output_formats}
        if "vtk" in requested:
            self._write_model_vtk(job.output_dir / "model.vtk", parsed["boreholes"])
        if "vtp" in requested:
            self._write_layer_vtps(job.output_dir, layer_meshes)

        artifacts = self._collect_artifacts(job.job_id, job.output_dir)
        manifest = GeomodelManifest(
            job_id=job.job_id,
            method=job.request.method,
            created_at=job.created_at,
            output_dir=str(job.output_dir),
            input_signature=self._input_signature(borehole_files),
            quality_summary={
                "continuity_score": float(quality["continuity_score"]),
                "pinchout_ratio": float(quality["pinchout_ratio"]),
                "layer_cv": float(quality["layer_cv"]),
                "borehole_count": int(summary["borehole_count"]),
                "layer_count": int(len(layer_meshes)),
            },
            artifacts=artifacts,
        )
        return manifest

    def _load_coords(self, coord_path: Path) -> Dict[str, Dict[str, float]]:
        if not coord_path.exists():
            return {}
        df = read_csv_robust(coord_path)
        name_col = _guess_column(df, ["钻孔名", "name", "borehole"])
        x_col = _guess_column(df, ["坐标x", "x", "coord_x"])
        y_col = _guess_column(df, ["坐标y", "y", "coord_y"])
        if not name_col or not x_col or not y_col:
            return {}

        coords: Dict[str, Dict[str, float]] = {}
        for _, row in df.iterrows():
            name = str(row.get(name_col, "")).strip()
            x = _to_float_or_none(row.get(x_col))
            y = _to_float_or_none(row.get(y_col))
            if not name or x is None or y is None:
                continue
            coords[name] = {"x": float(x), "y": float(y)}
        return coords

    def _parse_boreholes(self, borehole_files: List[Path], coords: Dict[str, Dict[str, float]]) -> Dict[str, Any]:
        boreholes: List[Dict[str, Any]] = []
        layer_values: Dict[str, List[float]] = {}
        layer_appearance: Dict[str, int] = {}
        zero_or_negative_samples = 0
        total_samples = 0

        for idx, file_path in enumerate(borehole_files):
            df = read_csv_robust(file_path)
            name_col = _guess_column(df, ["名称", "name", "岩性", "lithology"])
            thickness_col = _guess_column(df, ["厚度/m", "厚度", "thickness"])
            if not name_col or not thickness_col:
                continue

            layer_totals: Dict[str, float] = {}
            layer_seen = set()
            for _, row in df.iterrows():
                layer_name = str(row.get(name_col, "")).strip()
                thickness = _to_float_or_none(row.get(thickness_col))
                if not layer_name or thickness is None:
                    continue
                total_samples += 1
                if thickness <= 0:
                    zero_or_negative_samples += 1
                    continue
                layer_seen.add(layer_name)
                layer_totals[layer_name] = float(layer_totals.get(layer_name, 0.0) + thickness)
                layer_values.setdefault(layer_name, []).append(float(thickness))

            if not layer_totals:
                continue

            borehole_name = file_path.stem
            point = coords.get(borehole_name, {"x": float(idx), "y": 0.0})
            boreholes.append(
                {
                    "borehole": borehole_name,
                    "x": float(point["x"]),
                    "y": float(point["y"]),
                    "layers": layer_totals,
                    "layer_count": len(layer_totals),
                    "total_thickness": float(sum(layer_totals.values())),
                }
            )

            for layer_name in layer_seen:
                layer_appearance[layer_name] = int(layer_appearance.get(layer_name, 0) + 1)

        return {
            "boreholes": boreholes,
            "layer_values": layer_values,
            "layer_appearance": layer_appearance,
            "zero_or_negative_samples": zero_or_negative_samples,
            "total_samples": total_samples,
        }

    def _build_summary(self, job: _JobRecord, parsed: Dict[str, Any]) -> Dict[str, Any]:
        boreholes = parsed["boreholes"]
        layer_values = parsed["layer_values"]
        layer_appearance = parsed["layer_appearance"]
        borehole_count = len(boreholes)

        layer_stats = []
        for layer_name, values in layer_values.items():
            arr = np.asarray(values, dtype=float)
            layer_stats.append(
                {
                    "layer_name": layer_name,
                    "samples": int(arr.size),
                    "appearance_ratio": round(float(layer_appearance.get(layer_name, 0) / max(borehole_count, 1)), 4),
                    "mean_thickness": round(float(np.mean(arr)), 4),
                    "std_thickness": round(float(np.std(arr)), 4),
                }
            )
        layer_stats.sort(key=lambda item: item["samples"], reverse=True)

        thickness_arr = np.asarray([bh["total_thickness"] for bh in boreholes], dtype=float)
        return {
            "job_id": job.job_id,
            "method": job.request.method.value,
            "seam_name": job.request.seam_name,
            "resolution": job.request.resolution,
            "layer_order_method": job.request.layer_order_method,
            "pinchout_strategy": job.request.pinchout_strategy,
            "borehole_count": borehole_count,
            "unique_layer_count": len(layer_values),
            "thickness_stats": {
                "min": round(float(np.min(thickness_arr)), 4),
                "max": round(float(np.max(thickness_arr)), 4),
                "mean": round(float(np.mean(thickness_arr)), 4),
                "std": round(float(np.std(thickness_arr)), 4),
            },
            "top_layers": layer_stats[:20],
            "generated_at": _utc_now_iso(),
        }

    def _build_quality_report(self, parsed: Dict[str, Any]) -> Dict[str, Any]:
        boreholes = parsed["boreholes"]
        layer_values = parsed["layer_values"]
        layer_appearance = parsed["layer_appearance"]
        borehole_count = max(len(boreholes), 1)

        appearance_ratios = [
            float(count / borehole_count)
            for count in layer_appearance.values()
        ]
        continuity = float(np.mean(appearance_ratios)) if appearance_ratios else 0.0
        pinchout_ratio = (
            float(sum(1 for r in appearance_ratios if r < 0.5) / max(len(appearance_ratios), 1))
            if appearance_ratios
            else 0.0
        )

        cvs = []
        for values in layer_values.values():
            arr = np.asarray(values, dtype=float)
            if arr.size < 2:
                continue
            mean = float(np.mean(arr))
            if mean <= 0:
                continue
            cvs.append(float(np.std(arr) / mean))
        layer_cv = float(np.mean(cvs)) if cvs else 0.0

        total_samples = int(parsed["total_samples"])
        zero_or_negative_samples = int(parsed["zero_or_negative_samples"])
        zero_ratio = float(zero_or_negative_samples / max(total_samples, 1))

        return {
            "continuity_score": round(continuity, 4),
            "pinchout_ratio": round(pinchout_ratio, 4),
            "layer_cv": round(layer_cv, 4),
            "zero_or_negative_ratio": round(zero_ratio, 4),
            "sample_count": total_samples,
            "warning_flags": {
                "low_continuity": continuity < 0.4,
                "high_pinchout": pinchout_ratio > 0.4,
                "high_variability": layer_cv > 0.8,
            },
            "generated_at": _utc_now_iso(),
        }

    def _calculate_bounds(self, boreholes: List[Dict[str, Any]]) -> Dict[str, float]:
        if not boreholes:
            return {"min_x": 0.0, "max_x": 1.0, "min_y": 0.0, "max_y": 1.0}

        xs = [float(bh.get("x", 0.0)) for bh in boreholes]
        ys = [float(bh.get("y", 0.0)) for bh in boreholes]

        min_x, max_x = min(xs), max(xs)
        min_y, max_y = min(ys), max(ys)
        dx = max(max_x - min_x, 1.0)
        dy = max(max_y - min_y, 1.0)
        padding = 0.05
        return {
            "min_x": float(min_x - dx * padding),
            "max_x": float(max_x + dx * padding),
            "min_y": float(min_y - dy * padding),
            "max_y": float(max_y + dy * padding),
        }

    def _method_to_interpolation(self, method_hint: str, n_points: int) -> str:
        hint = (method_hint or "").strip().lower()
        if hint == "regression_kriging":
            return "kriging"
        if hint in {"hybrid", "smart_pinchout"}:
            return "linear" if n_points >= 4 else "idw"
        return "idw"

    def _build_layer_meshes(
        self,
        parsed: Dict[str, Any],
        method_hint: str,
        resolution: float,
        bounds: Dict[str, float],
    ) -> List[Dict[str, Any]]:
        boreholes = parsed["boreholes"]
        layer_values = parsed["layer_values"]
        if not layer_values:
            return []

        max_range = max(bounds["max_x"] - bounds["min_x"], bounds["max_y"] - bounds["min_y"], 1.0)
        spacing = max(float(resolution), 1.0)
        grid_size = int(max(16, min(128, round(max_range / spacing) + 1)))

        layer_names = sorted(layer_values.keys(), key=lambda n: len(layer_values[n]), reverse=True)[:12]
        layer_meshes: List[Dict[str, Any]] = []
        depth_cursor = 0.0
        total_boreholes = max(len(boreholes), 1)

        for order, layer_name in enumerate(layer_names):
            sample_points: List[List[float]] = []
            sample_values: List[float] = []

            for bh in boreholes:
                thickness = _to_float_or_none((bh.get("layers") or {}).get(layer_name))
                if thickness is None or thickness <= 0:
                    continue
                sample_points.append([float(bh["x"]), float(bh["y"])])
                sample_values.append(float(thickness))

            if not sample_values:
                continue

            sample_arr = np.asarray(sample_values, dtype=float)
            appearance_ratio = float(len(sample_values) / total_boreholes)
            mesh = None

            if len(sample_points) >= 3:
                grid = self._interpolate_layer_grid(
                    points=np.asarray(sample_points, dtype=float),
                    values=sample_arr,
                    method_hint=method_hint,
                    grid_size=grid_size,
                    bounds=bounds,
                )
                if grid is not None:
                    mesh = self._grid_to_mesh(grid, bounds, depth_cursor)

            layer_meshes.append(
                {
                    "name": layer_name,
                    "order": order,
                    "sample_count": int(sample_arr.size),
                    "appearance_ratio": round(appearance_ratio, 4),
                    "mean_thickness": round(float(np.mean(sample_arr)), 4),
                    "std_thickness": round(float(np.std(sample_arr)), 4),
                    "sample_points": [
                        {"x": float(p[0]), "y": float(p[1]), "thickness": float(v)}
                        for p, v in zip(sample_points, sample_values)
                    ],
                    "mesh": mesh,
                }
            )
            depth_cursor += float(np.mean(sample_arr))

        return layer_meshes

    def _interpolate_layer_grid(
        self,
        points: np.ndarray,
        values: np.ndarray,
        method_hint: str,
        grid_size: int,
        bounds: Dict[str, float],
    ) -> Optional[np.ndarray]:
        method = self._method_to_interpolation(method_hint, len(points))
        result = interpolate_from_points(
            points=points,
            values=values,
            method=method,
            grid_size=grid_size,
            bounds=bounds,
        )
        if "error" in result and method != "idw":
            result = interpolate_from_points(
                points=points,
                values=values,
                method="idw",
                grid_size=grid_size,
                bounds=bounds,
            )
        if "error" in result:
            return None

        grid = np.asarray(result["grid"], dtype=float)
        finite = np.isfinite(grid)
        if not np.any(finite):
            return None

        grid = np.where(finite, grid, float(np.nanmean(values)))
        grid = np.clip(grid, a_min=0.0, a_max=None)

        hint = (method_hint or "").strip().lower()
        if hint == "smart_pinchout":
            # Sparse layers should taper to zero smoothly.
            q = float(np.quantile(values, 0.15))
            threshold = max(q * 0.35, 0.05)
            grid = np.where(grid < threshold, 0.0, grid)
        elif hint == "hybrid":
            # Prevent extreme spikes from dominating rendered surfaces.
            q_low = float(np.quantile(grid, 0.05))
            q_high = float(np.quantile(grid, 0.95))
            if q_high > q_low:
                grid = np.clip(grid, q_low, q_high)

        return grid

    def _grid_to_mesh(
        self,
        grid: np.ndarray,
        bounds: Dict[str, float],
        depth_cursor: float,
    ) -> Dict[str, Any]:
        ny, nx = grid.shape
        xs = np.linspace(bounds["min_x"], bounds["max_x"], nx)
        ys = np.linspace(bounds["min_y"], bounds["max_y"], ny)

        vertices: List[List[float]] = []
        thickness_scalars: List[float] = []
        for iy, y in enumerate(ys):
            for ix, x in enumerate(xs):
                thickness = float(grid[iy, ix])
                z = -(depth_cursor + thickness * 0.5)
                vertices.append([float(x), float(y), float(z)])
                thickness_scalars.append(thickness)

        faces: List[List[int]] = []
        for iy in range(ny - 1):
            for ix in range(nx - 1):
                a = iy * nx + ix
                b = a + 1
                c = (iy + 1) * nx + ix
                d = c + 1
                faces.append([a, b, d])
                faces.append([a, d, c])

        return {
            "vertices": vertices,
            "faces": faces,
            "point_scalars": thickness_scalars,
            "grid_shape": [int(ny), int(nx)],
        }

    def _build_model_document(
        self,
        job: _JobRecord,
        parsed: Dict[str, Any],
        summary: Dict[str, Any],
        quality: Dict[str, Any],
        bounds: Dict[str, float],
        layer_meshes: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        boreholes_payload = []
        for bh in parsed["boreholes"]:
            layers = [
                {"name": str(name), "thickness": float(thickness)}
                for name, thickness in sorted((bh.get("layers") or {}).items(), key=lambda item: item[0])
            ]
            boreholes_payload.append(
                {
                    "name": str(bh.get("borehole", "")),
                    "x": float(bh.get("x", 0.0)),
                    "y": float(bh.get("y", 0.0)),
                    "total_thickness": float(bh.get("total_thickness", 0.0)),
                    "layers": layers,
                }
            )

        layers_payload = []
        for layer in layer_meshes:
            mesh = layer.get("mesh")
            layers_payload.append(
                {
                    "name": layer["name"],
                    "order": int(layer["order"]),
                    "sample_count": int(layer["sample_count"]),
                    "appearance_ratio": float(layer["appearance_ratio"]),
                    "mean_thickness": float(layer["mean_thickness"]),
                    "std_thickness": float(layer["std_thickness"]),
                    "sample_points": layer.get("sample_points", []),
                    "mesh": mesh,
                }
            )

        return {
            "job_id": job.job_id,
            "method": job.request.method.value,
            "seam_name": job.request.seam_name,
            "resolution": float(job.request.resolution),
            "generated_at": _utc_now_iso(),
            "bounds": bounds,
            "boreholes": boreholes_payload,
            "layers": layers_payload,
            "summary": summary,
            "quality_summary": quality,
        }

    def _write_model_vtk(self, file_path: Path, boreholes: List[Dict[str, Any]]) -> None:
        points = [
            (
                float(bh["x"]),
                float(bh["y"]),
                -float(bh.get("total_thickness", 0.0)),
            )
            for bh in boreholes
        ]
        lines = [
            "# vtk DataFile Version 3.0",
            "Geomodel Borehole Cloud",
            "ASCII",
            "DATASET POLYDATA",
            f"POINTS {len(points)} float",
        ]
        lines.extend(f"{x:.6f} {y:.6f} {z:.6f}" for x, y, z in points)
        lines.append(f"VERTICES {len(points)} {len(points) * 2}")
        lines.extend(f"1 {idx}" for idx in range(len(points)))
        file_path.write_text("\n".join(lines), encoding="utf-8")

    def _write_layer_vtps(
        self,
        output_dir: Path,
        layer_meshes: List[Dict[str, Any]],
    ) -> None:
        if not layer_meshes:
            return

        for layer in layer_meshes:
            layer_name = str(layer.get("name") or "layer")
            mesh = layer.get("mesh") or {}
            vertices = mesh.get("vertices") or []
            faces = mesh.get("faces") or []
            point_scalars = mesh.get("point_scalars") or []

            if not vertices:
                continue

            pts_text = " ".join(f"{v[0]:.6f} {v[1]:.6f} {v[2]:.6f}" for v in vertices)
            thick_text = " ".join(f"{float(v):.6f}" for v in point_scalars) if point_scalars else ""

            if faces:
                conn_text = " ".join(str(int(idx)) for tri in faces for idx in tri)
                off_text = " ".join(str(3 * (i + 1)) for i in range(len(faces)))
                file_content = (
                    '<?xml version="1.0"?>\n'
                    '<VTKFile type="PolyData" version="0.1" byte_order="LittleEndian">\n'
                    "  <PolyData>\n"
                    f'    <Piece NumberOfPoints="{len(vertices)}" NumberOfVerts="0" NumberOfLines="0" NumberOfStrips="0" NumberOfPolys="{len(faces)}">\n'
                    "      <PointData Scalars=\"thickness\">\n"
                    f'        <DataArray type="Float32" Name="thickness" format="ascii">{thick_text}</DataArray>\n'
                    "      </PointData>\n"
                    "      <Points>\n"
                    f'        <DataArray type="Float32" NumberOfComponents="3" format="ascii">{pts_text}</DataArray>\n'
                    "      </Points>\n"
                    "      <Polys>\n"
                    f'        <DataArray type="Int32" Name="connectivity" format="ascii">{conn_text}</DataArray>\n'
                    f'        <DataArray type="Int32" Name="offsets" format="ascii">{off_text}</DataArray>\n'
                    "      </Polys>\n"
                    "    </Piece>\n"
                    "  </PolyData>\n"
                    "</VTKFile>\n"
                )
            else:
                conn_text = " ".join(str(i) for i in range(len(vertices)))
                off_text = " ".join(str(i + 1) for i in range(len(vertices)))
                file_content = (
                    '<?xml version="1.0"?>\n'
                    '<VTKFile type="PolyData" version="0.1" byte_order="LittleEndian">\n'
                    "  <PolyData>\n"
                    f'    <Piece NumberOfPoints="{len(vertices)}" NumberOfVerts="{len(vertices)}" NumberOfLines="0" NumberOfStrips="0" NumberOfPolys="0">\n'
                    "      <PointData Scalars=\"thickness\">\n"
                    f'        <DataArray type="Float32" Name="thickness" format="ascii">{thick_text}</DataArray>\n'
                    "      </PointData>\n"
                    "      <Points>\n"
                    f'        <DataArray type="Float32" NumberOfComponents="3" format="ascii">{pts_text}</DataArray>\n'
                    "      </Points>\n"
                    "      <Verts>\n"
                    f'        <DataArray type="Int32" Name="connectivity" format="ascii">{conn_text}</DataArray>\n'
                    f'        <DataArray type="Int32" Name="offsets" format="ascii">{off_text}</DataArray>\n'
                    "      </Verts>\n"
                    "    </Piece>\n"
                    "  </PolyData>\n"
                    "</VTKFile>\n"
                )

            file_name = f"layer_{_sanitize_layer_name(layer_name)}.vtp"
            (output_dir / file_name).write_text(file_content, encoding="utf-8")

    def _collect_artifacts(self, job_id: str, output_dir: Path) -> List[GeomodelArtifactItem]:
        items: List[GeomodelArtifactItem] = []
        for path in sorted(output_dir.glob("*")):
            if not path.is_file():
                continue
            ext = path.suffix.lower().lstrip(".")
            file_type = ext or "file"
            stat = path.stat()
            items.append(
                GeomodelArtifactItem(
                    name=path.name,
                    file_type=file_type,
                    size_bytes=int(stat.st_size),
                    updated_at=datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc).isoformat(),
                    download_url=f"/api/geomodel/jobs/{job_id}/artifacts/{path.name}",
                )
            )
        return items

    def _input_signature(self, files: List[Path]) -> Dict[str, str | int | float]:
        latest_mtime = 0.0
        for f in files:
            try:
                latest_mtime = max(latest_mtime, f.stat().st_mtime)
            except OSError:
                continue
        return {
            "file_count": len(files),
            "latest_mtime": round(latest_mtime, 3),
            "source_dir": str(get_data_dir()),
        }

    def _as_job_response(self, record: _JobRecord) -> GeomodelJobResponse:
        return GeomodelJobResponse(
            job_id=record.job_id,
            status=record.status,
            created_at=record.created_at,
            started_at=record.started_at,
            completed_at=record.completed_at,
            message=record.message,
            error=record.error,
            result_manifest=record.result_manifest,
        )


geomodel_service = GeomodelService()
