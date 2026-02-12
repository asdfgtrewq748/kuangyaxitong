from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.schemas.geomodel import (
    GeomodelArtifactsResponse,
    GeomodelJobCreate,
    GeomodelJobResponse,
)
from app.services.geomodel_service import geomodel_service


router = APIRouter(
    prefix="/api/geomodel",
    tags=["Geomodel"],
)


@router.post("/jobs", response_model=GeomodelJobResponse, summary="创建地质建模任务")
def create_geomodel_job(payload: GeomodelJobCreate) -> GeomodelJobResponse:
    return geomodel_service.create_job(payload)


@router.get("/jobs/{job_id}", response_model=GeomodelJobResponse, summary="查询地质建模任务")
def get_geomodel_job(job_id: str) -> GeomodelJobResponse:
    try:
        return geomodel_service.get_job(job_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=f"job not found: {job_id}") from exc


@router.get("/jobs/{job_id}/artifacts", response_model=GeomodelArtifactsResponse, summary="列出任务产物")
def list_geomodel_artifacts(job_id: str) -> GeomodelArtifactsResponse:
    try:
        job = geomodel_service.get_job(job_id)
        artifacts = geomodel_service.list_artifacts(job_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=f"job not found: {job_id}") from exc

    return GeomodelArtifactsResponse(
        job_id=job_id,
        status=job.status,
        artifacts=artifacts,
    )


@router.get("/jobs/{job_id}/artifacts/{artifact_name}", summary="下载任务产物")
def download_geomodel_artifact(job_id: str, artifact_name: str):
    try:
        artifact_path = geomodel_service.get_artifact_path(job_id, artifact_name)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=f"job not found: {job_id}") from exc
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=f"artifact not found: {artifact_name}") from exc

    return FileResponse(
        path=str(artifact_path),
        filename=artifact_path.name,
        media_type="application/octet-stream",
    )
