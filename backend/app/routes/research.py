from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
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
)
from app.services.experiment_runner import run_experiment_suite, DEFAULT_EXPERIMENT_TEMPLATES


router = APIRouter(prefix="/api/research", tags=["Research"])


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
    model_type: Literal["baseline", "rsi_phase_field", "asi_ust", "custom"] = "baseline"
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
