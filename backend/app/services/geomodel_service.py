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

        summary_path = job.output_dir / "summary.json"
        quality_path = job.output_dir / "quality_report.json"
        summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
        quality_path.write_text(json.dumps(quality, ensure_ascii=False, indent=2), encoding="utf-8")

        requested = {x.lower() for x in job.request.output_formats}
        if "vtk" in requested:
            self._write_model_vtk(job.output_dir / "model.vtk", parsed["boreholes"])
        if "vtp" in requested:
            self._write_layer_vtps(job.output_dir, parsed)

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

    def _write_model_vtk(self, file_path: Path, boreholes: List[Dict[str, Any]]) -> None:
        points = [(float(bh["x"]), float(bh["y"]), 0.0) for bh in boreholes]
        lines = [
            "# vtk DataFile Version 3.0",
            "Geomodel Point Cloud",
            "ASCII",
            "DATASET POLYDATA",
            f"POINTS {len(points)} float",
        ]
        lines.extend(f"{x:.6f} {y:.6f} {z:.6f}" for x, y, z in points)
        lines.append(f"VERTICES {len(points)} {len(points) * 2}")
        lines.extend(f"1 {idx}" for idx in range(len(points)))
        file_path.write_text("\n".join(lines), encoding="utf-8")

    def _write_layer_vtps(self, output_dir: Path, parsed: Dict[str, Any]) -> None:
        boreholes = parsed["boreholes"]
        layer_values = parsed["layer_values"]
        if not layer_values:
            return

        top_layers = sorted(layer_values.keys(), key=lambda n: len(layer_values[n]), reverse=True)[:12]
        for layer_name in top_layers:
            points: List[tuple[float, float, float]] = []
            thickness_values: List[float] = []
            for bh in boreholes:
                thickness = _to_float_or_none((bh.get("layers") or {}).get(layer_name))
                if thickness is None or thickness <= 0:
                    continue
                points.append((float(bh["x"]), float(bh["y"]), 0.0))
                thickness_values.append(float(thickness))

            if not points:
                continue

            pts_text = " ".join(f"{x:.6f} {y:.6f} {z:.6f}" for x, y, z in points)
            conn_text = " ".join(str(i) for i in range(len(points)))
            off_text = " ".join(str(i + 1) for i in range(len(points)))
            thick_text = " ".join(f"{v:.6f}" for v in thickness_values)

            file_content = (
                '<?xml version="1.0"?>\n'
                '<VTKFile type="PolyData" version="0.1" byte_order="LittleEndian">\n'
                "  <PolyData>\n"
                f'    <Piece NumberOfPoints="{len(points)}" NumberOfVerts="{len(points)}" NumberOfLines="0" NumberOfStrips="0" NumberOfPolys="0">\n'
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
