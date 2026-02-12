from __future__ import annotations

from datetime import datetime, timezone
from io import BytesIO
import json
from pathlib import Path
from statistics import mean
from typing import Any, Dict, List, Literal, Optional
from zipfile import ZIP_DEFLATED, ZipFile

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel, Field, field_validator, model_validator

from app.services.research_manager import (
    create_split_manifest,
    dataset_manifest_path,
    get_experiment_artifact_path,
    list_experiment_artifacts,
    load_dataset_manifest,
    load_experiment_result,
    run_experiment,
    register_dataset_manifest,
    get_research_paths,
)
from app.services.experiment_runner import run_experiment_suite, DEFAULT_EXPERIMENT_TEMPLATES


router = APIRouter(prefix="/api/research", tags=["Research"])

_PROJECT_ROOT = Path(__file__).resolve().parents[3]
_PAPERS_DIR = _PROJECT_ROOT / "docs" / "papers"
_PAPER_SPECS: Dict[str, Dict[str, str]] = {
    "science_en": {
        "title": "MPI Science Draft",
        "language": "en",
        "manuscript": "MPI_Science_Style_Draft_EN.docx",
        "gates_dir": "gates_en",
    },
    "coal_zh": {
        "title": "MPI 鐓ょ偔瀛︽姤鍒濈",
        "language": "zh",
        "manuscript": "MPI_鐓ょ偔瀛︽姤鏍煎紡_涓枃鍒濈.docx",
        "gates_dir": "gates_zh",
    },
}
_PAPER_ASSET_FILENAMES: Dict[str, str] = {
    "manuscript": "",
    "gates_json": "manuscript_gates_report.json",
    "gates_md": "manuscript_gates_report.md",
    "reference_json": "reference_integrity_report.json",
    "reference_md": "reference_integrity_report.md",
    "claim_json": "claim_strength_report.json",
    "claim_md": "claim_strength_report.md",
    "stats_json": "stats_reporting_report.json",
    "stats_md": "stats_reporting_report.md",
}
_LOWER_IS_BETTER_METRICS = {"brier", "ece", "mae", "rmse", "paired_significance_p"}


def _file_meta(path: Path) -> Dict[str, Any]:
    if not path.exists() or not path.is_file():
        return {"exists": False, "name": path.name}
    stat = path.stat()
    return {
        "exists": True,
        "name": path.name,
        "size_bytes": int(stat.st_size),
        "updated_at": datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc).isoformat(),
    }


def _paper_asset_map(paper_id: str, spec: Dict[str, str]) -> Dict[str, Path]:
    gates_dir = _PAPERS_DIR / spec["gates_dir"]
    manuscript_path = _PAPERS_DIR / spec["manuscript"]
    assets = {"manuscript": manuscript_path}
    for kind, filename in _PAPER_ASSET_FILENAMES.items():
        if kind == "manuscript":
            continue
        assets[kind] = gates_dir / filename
    return assets


def _metric_value(result: Dict[str, Any], metric: str) -> Optional[float]:
    raw = (result.get("metrics") or {}).get(metric)
    try:
        if raw is None:
            return None
        return float(raw)
    except Exception:
        return None


def _sort_desc(metric: str) -> bool:
    return metric not in _LOWER_IS_BETTER_METRICS


class LabelSchema(BaseModel):
    label_column: str
    positive_values: List[Any] = Field(default_factory=lambda: [1])
    event_definition: str = "roof_pressure_event"
    time_window_hours: int = 24
    threshold: Optional[float] = None
    notes: str = ""


class ResearchDatasetManifest(BaseModel):
    dataset_id: str
    label_schema: LabelSchema
    description: str = ""


class DatasetSplitRequest(BaseModel):
    strategy: Literal["random", "time_block", "borehole_block", "time_borehole_block"] = "time_borehole_block"
    train_ratio: float = 0.7
    val_ratio: float = 0.15
    test_ratio: float = 0.15
    seed: int = 42
    time_column: Optional[str] = None
    borehole_column: Optional[str] = None

    @model_validator(mode="after")
    def _validate_ratios(self) -> "DatasetSplitRequest":
        total = self.train_ratio + self.val_ratio + self.test_ratio
        if abs(total - 1.0) > 1e-6:
            raise ValueError("train_ratio + val_ratio + test_ratio must equal 1.0")
        if self.train_ratio <= 0 or self.val_ratio <= 0 or self.test_ratio <= 0:
            raise ValueError("split ratios must all be > 0")
        return self


class ExperimentSpec(BaseModel):
    dataset_id: str
    dataset_version: str
    split_id: Optional[str] = None
    experiment_name: str
    model_type: Literal[
        "baseline",
        "rsi_phase_field",
        "asi_ust",
        "geomodel_aware",
        "geomodel_ablation",
        "pinchout_sensitive",
        "rk_enhanced",
        "kriging_baseline",
        "custom",
    ] = "baseline"
    target_label_column: Optional[str] = None
    params: Dict[str, Any] = Field(default_factory=dict)
    metrics: List[str] = Field(default_factory=lambda: ["auc", "pr_auc", "brier", "ece", "f1", "mae", "rmse"])
    seed: int = 42

    @field_validator("dataset_id", "dataset_version", "experiment_name")
    @classmethod
    def _strip_required(cls, value: str) -> str:
        text = str(value).strip()
        if not text:
            raise ValueError("field cannot be empty")
        return text


class CalibrationReport(BaseModel):
    ece: float
    mce: float
    bin_count: int
    bins: List[Dict[str, Any]]


class ExperimentResult(BaseModel):
    exp_id: str
    status: str
    dataset_id: str
    dataset_version: str
    split_id: str
    spec: Dict[str, Any]
    metrics: Dict[str, float]
    calibration: CalibrationReport
    ci95: Dict[str, List[float]]
    traceability: Dict[str, str]
    created_at: str


class ExperimentSuiteRequest(BaseModel):
    template_name: str = "rsi_paper_core"
    dataset_id: str
    dataset_version: str
    split_id: str
    seed: int = 42


@router.post("/dataset/register")
def register_dataset(payload: ResearchDatasetManifest) -> Dict[str, Any]:
    try:
        return register_dataset_manifest(
            dataset_id=payload.dataset_id,
            label_schema=payload.label_schema.model_dump(),
            description=payload.description,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"failed to register dataset: {exc}") from exc


@router.get("/dataset/{dataset_id}")
def get_dataset(dataset_id: str) -> Dict[str, Any]:
    try:
        manifest = load_dataset_manifest(dataset_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {
        **manifest,
        "manifest_file": str(dataset_manifest_path(dataset_id)),
    }


@router.post("/dataset/{dataset_id}/split")
def split_dataset(dataset_id: str, payload: DatasetSplitRequest) -> Dict[str, Any]:
    try:
        return create_split_manifest(
            dataset_id=dataset_id,
            strategy=payload.strategy,
            train_ratio=float(payload.train_ratio),
            val_ratio=float(payload.val_ratio),
            test_ratio=float(payload.test_ratio),
            seed=int(payload.seed),
            time_column=payload.time_column,
            borehole_column=payload.borehole_column,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"failed to split dataset: {exc}") from exc


@router.post("/experiments/run")
def run_research_experiment(payload: ExperimentSpec) -> Dict[str, Any]:
    try:
        result = run_experiment(payload.model_dump())
        return ExperimentResult(**result).model_dump()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"failed to run experiment: {exc}") from exc


@router.get("/experiments/templates")
def list_experiment_templates() -> Dict[str, Any]:
    return {"templates": DEFAULT_EXPERIMENT_TEMPLATES}


@router.post("/experiments/run-suite")
def run_research_experiment_suite(payload: ExperimentSuiteRequest) -> Dict[str, Any]:
    try:
        return run_experiment_suite(
            template_name=payload.template_name,
            dataset_id=payload.dataset_id,
            dataset_version=payload.dataset_version,
            split_id=payload.split_id,
            seed=payload.seed,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"failed to run experiment suite: {exc}") from exc




@router.get("/experiments/{exp_id}")
def get_research_experiment(exp_id: str) -> Dict[str, Any]:
    try:
        result = load_experiment_result(exp_id)
        return ExperimentResult(**result).model_dump()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"failed to load experiment result: {exc}") from exc


@router.get("/experiments/{exp_id}/artifacts")
def get_research_experiment_artifacts(exp_id: str) -> Dict[str, Any]:
    try:
        artifacts = list_experiment_artifacts(exp_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"exp_id": exp_id, "artifacts": artifacts}


@router.get("/experiments/{exp_id}/artifacts/{artifact_name:path}")
def download_research_experiment_artifact(exp_id: str, artifact_name: str) -> FileResponse:
    try:
        artifact = get_experiment_artifact_path(exp_id=exp_id, artifact_name=artifact_name)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return FileResponse(
        path=str(artifact),
        filename=artifact.name,
        media_type="application/octet-stream",
    )


@router.get("/papers/overview")
def get_research_papers_overview() -> Dict[str, Any]:
    papers: List[Dict[str, Any]] = []
    for paper_id, spec in _PAPER_SPECS.items():
        assets = _paper_asset_map(paper_id, spec)
        manuscript_meta = _file_meta(assets["manuscript"])

        gate_summary = None
        gate_json = assets.get("gates_json")
        if gate_json and gate_json.exists():
            try:
                payload = json.loads(gate_json.read_text(encoding="utf-8"))
                gate_summary = payload.get("summary", {})
            except Exception:
                gate_summary = {"overall_pass": False, "parse_error": True}

        asset_items: List[Dict[str, Any]] = []
        for kind, path in assets.items():
            meta = _file_meta(path)
            asset_items.append(
                {
                    "kind": kind,
                    **meta,
                    "download_url": (
                        f"/api/research/papers/{paper_id}/download?kind={kind}"
                        if meta.get("exists")
                        else None
                    ),
                }
            )

        papers.append(
            {
                "paper_id": paper_id,
                "title": spec["title"],
                "language": spec["language"],
                "manuscript": manuscript_meta,
                "gate_summary": gate_summary,
                "assets": asset_items,
            }
        )

    return {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "papers_dir": str(_PAPERS_DIR),
        "papers": papers,
    }


@router.get("/papers/{paper_id}/download")
def download_research_paper_asset(paper_id: str, kind: str = "manuscript") -> FileResponse:
    spec = _PAPER_SPECS.get(paper_id)
    if spec is None:
        raise HTTPException(status_code=404, detail=f"paper not found: {paper_id}")
    assets = _paper_asset_map(paper_id, spec)
    path = assets.get(kind)
    if path is None:
        raise HTTPException(status_code=400, detail=f"unsupported asset kind: {kind}")
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=404, detail=f"asset not found: {kind}")
    return FileResponse(
        path=str(path),
        filename=path.name,
        media_type="application/octet-stream",
    )


@router.get("/papers/{paper_id}/bundle")
def download_research_paper_bundle(paper_id: str) -> Response:
    spec = _PAPER_SPECS.get(paper_id)
    if spec is None:
        raise HTTPException(status_code=404, detail=f"paper not found: {paper_id}")

    assets = _paper_asset_map(paper_id, spec)
    existing_assets: List[tuple[str, Path]] = []
    for kind, path in assets.items():
        if path.exists() and path.is_file():
            existing_assets.append((kind, path))
    if not existing_assets:
        raise HTTPException(status_code=404, detail=f"no assets found for paper: {paper_id}")

    bundle_time = datetime.now(timezone.utc).isoformat()
    mem = BytesIO()
    with ZipFile(mem, mode="w", compression=ZIP_DEFLATED) as zf:
        readme_lines = [
            "# Research Paper Bundle",
            f"paper_id: {paper_id}",
            f"title: {spec['title']}",
            f"language: {spec['language']}",
            f"generated_at_utc: {bundle_time}",
            "",
            "included_assets:",
        ]
        for kind, path in existing_assets:
            arcname = f"assets/{kind}_{path.name}"
            zf.write(path, arcname=arcname)
            readme_lines.append(f"- {kind}: {arcname}")
        zf.writestr("README.txt", "\n".join(readme_lines) + "\n")

    mem.seek(0)
    filename = f"{paper_id}_research_bundle.zip"
    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
    return Response(content=mem.getvalue(), media_type="application/zip", headers=headers)


@router.get("/leaderboard/experiments")
def get_research_experiment_leaderboard(metric: str = "auc", limit: int = 20) -> Dict[str, Any]:
    metric_key = str(metric).strip()
    if not metric_key:
        raise HTTPException(status_code=400, detail="metric is required")
    if limit <= 0 or limit > 200:
        raise HTTPException(status_code=400, detail="limit must be in [1, 200]")

    exp_dir = get_research_paths().experiments_dir
    rows: List[Dict[str, Any]] = []
    for path in sorted(exp_dir.glob("*/result.json")):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            continue
        value = _metric_value(payload, metric_key)
        if value is None:
            continue
        rows.append(
            {
                "exp_id": payload.get("exp_id", path.parent.name),
                "experiment_name": (payload.get("spec") or {}).get("experiment_name", ""),
                "model_type": (payload.get("spec") or {}).get("model_type", ""),
                "dataset_id": payload.get("dataset_id", ""),
                "dataset_version": payload.get("dataset_version", ""),
                "split_id": payload.get("split_id", ""),
                "created_at": payload.get("created_at", ""),
                "metric": metric_key,
                "value": value,
                "ci95": (payload.get("ci95") or {}).get(metric_key),
            }
        )

    desc = _sort_desc(metric_key)
    rows.sort(key=lambda item: item["value"], reverse=desc)
    top_rows = rows[:limit]

    by_model: Dict[str, Dict[str, Any]] = {}
    for item in rows:
        model = item.get("model_type") or "unknown"
        bucket = by_model.setdefault(
            model,
            {
                "values": [],
                "best_exp_id": "",
                "datasets": set(),
            },
        )
        value = float(item["value"])
        bucket["values"].append(value)
        bucket["datasets"].add(item.get("dataset_id") or "")

        current_best = bucket.get("best_value")
        if current_best is None:
            take = True
        elif desc:
            take = value > float(current_best)
        else:
            take = value < float(current_best)
        if take:
            bucket["best_value"] = value
            bucket["best_exp_id"] = item.get("exp_id", "")
    model_summary = [
        {
            "model_type": model,
            "count": len(bucket["values"]),
            "mean": float(mean(bucket["values"])),
            "best": float(bucket["best_value"]),
            "best_exp_id": bucket.get("best_exp_id", ""),
            "dataset_count": len([x for x in bucket.get("datasets", set()) if x]),
        }
        for model, bucket in by_model.items()
    ]
    model_summary.sort(key=lambda item: item["best"], reverse=desc)

    return {
        "metric": metric_key,
        "higher_is_better": desc,
        "total_runs": len(rows),
        "rows": top_rows,
        "model_summary": model_summary,
    }

