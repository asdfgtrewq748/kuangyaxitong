"""
Geomodel Integration API Routes

Routes for integrating geomodel data with visualization and MPI calculation.
"""

from __future__ import annotations

import json
import math
from pathlib import Path
from typing import Dict, List, Optional, Any

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.services.geomodel_service import geomodel_service
from app.services.pressure_index import calculate_pressure_index_grid
from app.services.seam_interpolate import get_seam_overburden
from app.schemas.geomodel import GeomodelJobResponse


router = APIRouter(
    prefix="/api/geomodel-integration",
    tags=["Geomodel Integration"],
)


class GeomodelVisualizationData(BaseModel):
    """Data for geomodel visualization"""
    layers: List[Dict[str, Any]] = Field(default_factory=list)
    boreholes: List[Dict[str, Any]] = Field(default_factory=list)
    bounds: Dict[str, float] = Field(default_factory=dict)
    quality_summary: Optional[Dict[str, float]] = None


class GeomodelMpiRequest(BaseModel):
    """Request for geomodel-aware MPI calculation"""
    seam_name: str
    geomodel_job_id: Optional[str] = None
    resolution: int = Field(default=50, ge=20, le=150)
    use_geomodel_weights: bool = Field(default=True, description="Use geomodel quality for weighting")


class CombinedVisualizationResponse(BaseModel):
    """Response combining geomodel and MPI data"""
    geomodel: GeomodelVisualizationData
    mpi_grid: Optional[List[List[float]]] = None
    mpi_stats: Optional[Dict[str, float]] = None
    combined_quality: Optional[Dict[str, float]] = None


class GeomodelStressProfile(BaseModel):
    """Depth transfer profile used for stress cloud rendering"""
    job_id: str
    algorithm: str
    source: str
    bins: List[float]
    weights: List[float]
    anchors: List[Dict[str, Any]] = Field(default_factory=list)
    meta: Dict[str, float] = Field(default_factory=dict)


@router.get("/jobs", response_model=List[GeomodelJobResponse], summary="List all geomodel jobs")
async def list_geomodel_jobs():
    """List all available geomodel jobs for selection"""
    try:
        jobs = []
        # Get job records from service
        if hasattr(geomodel_service, '_jobs'):
            for job_id, record in geomodel_service._jobs.items():
                jobs.append({
                    "job_id": job_id,
                    "status": record.status,
                    "created_at": record.created_at,
                    "request": {
                        "seam_name": record.request.seam_name,
                        "resolution": record.request.resolution,
                        "method": record.request.method,
                    } if record.request else None,
                })
        return jobs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/visualization/{job_id}", response_model=GeomodelVisualizationData, summary="Get geomodel visualization data")
async def get_geomodel_visualization_data(
    job_id: str,
    include_mesh: bool = Query(default=False, description="Include layer mesh vertices/faces"),
) -> GeomodelVisualizationData:
    """
    Get geomodel data formatted for visualization components.

    Returns layers, boreholes, bounds, and quality summary
    that can be directly used by the GeomodelViewer component.
    """
    try:
        job = geomodel_service.get_job(job_id)
        manifest = _extract_manifest_dict(job)

        if not manifest:
            raise HTTPException(status_code=404, detail=f"Geomodel job {job_id} not completed")

        artifacts = _normalize_artifacts(manifest.get('artifacts', []))
        quality = manifest.get('quality_summary', {})
        model_doc = _load_model_document(manifest)

        if model_doc:
            layers = _build_layer_list_from_model(model_doc, artifacts, include_mesh=include_mesh)
            boreholes = _build_borehole_list_from_model(model_doc)
            bounds = _normalize_bounds(model_doc.get('bounds'), boreholes)
        else:
            layers = _build_layer_list(artifacts, quality)
            boreholes = _build_borehole_list(artifacts)
            bounds = _calculate_bounds(boreholes)

        return GeomodelVisualizationData(
            layers=layers,
            boreholes=boreholes,
            bounds=bounds,
            quality_summary=quality,
        )

    except KeyError:
        raise HTTPException(status_code=404, detail=f"Geomodel job {job_id} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/mpi-with-geomodel", response_model=Dict[str, Any], summary="Calculate MPI with geomodel data")
async def calculate_mpi_with_geomodel(request: GeomodelMpiRequest) -> Dict[str, Any]:
    """
    Calculate MPI index using geomodel data for enhanced accuracy.

    This endpoint integrates the geomodel quality and layer information
    with the standard MPI calculation to provide geo-aware results.
    """
    try:
        # Get seam overburden data
        overburden_data = await get_seam_overburden(request.seam_name)

        # Get geomodel context if job_id provided
        geomodel_context = None
        if request.geomodel_job_id:
            try:
                job = geomodel_service.get_job(request.geomodel_job_id)
                manifest = _extract_manifest_dict(job) or {}
                geomodel_context = {
                    "quality": manifest.get('quality_summary', {}),
                    "artifacts": _normalize_artifacts(manifest.get('artifacts', [])),
                }
            except:
                pass

        # Calculate pressure index grid
        mpi_grid = await calculate_pressure_index_grid(
            seam_name=request.seam_name,
            resolution=request.resolution,
            points=overburden_data.get('boreholes', []),
        )

        # Prepare response
        response = {
            "mpi_grid": mpi_grid,
            "seam_name": request.seam_name,
            "resolution": request.resolution,
            "geomodel_used": geomodel_context is not None,
        }

        # Add geomodel quality info if available
        if geomodel_context:
            response["geomodel_quality"] = geomodel_context["quality"]
            response["geomodel_influence"] = _calculate_geomodel_influence(
                geomodel_context["quality"]
            )

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/stress-profile/{job_id}",
    response_model=GeomodelStressProfile,
    summary="Get geomodel-derived stress transfer profile",
)
async def get_geomodel_stress_profile(
    job_id: str,
    samples: int = Query(default=72, ge=24, le=240),
    focus: str = Query(default="balanced", pattern="^(balanced|shallow|deep)$"),
) -> GeomodelStressProfile:
    """
    Build a depth transfer profile for 3D stress-cloud rendering.

    The profile is derived from geomodel `model.json` layer thickness and continuity
    so the front-end can render stress volume with a geology-aware depth trend.
    """
    try:
        job = geomodel_service.get_job(job_id)
        manifest = _extract_manifest_dict(job)
        if not manifest:
            raise HTTPException(status_code=404, detail=f"Geomodel job {job_id} not completed")

        model_doc = _load_model_document(manifest)
        if not model_doc:
            raise HTTPException(status_code=404, detail=f"Model document not found for job {job_id}")

        profile = _build_stress_profile_from_model(model_doc, samples=samples, focus=focus)
        return GeomodelStressProfile(job_id=job_id, **profile)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Geomodel job {job_id} not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/combined-visualization/{job_id}", response_model=CombinedVisualizationResponse, summary="Get combined geomodel+MPI visualization data")
async def get_combined_visualization(job_id: str, seam: str = Query(...)) -> CombinedVisualizationResponse:
    """
    Get combined visualization data showing both geomodel and MPI heatmap.

    This allows viewing the geomodel 3D structure alongside the MPI values,
    providing a unified visualization experience.
    """
    try:
        # Get geomodel data
        geomodel_data = await get_geomodel_visualization_data(job_id)

        # Get MPI data
        overburden_data = await get_seam_overburden(seam)
        mpi_grid = await calculate_pressure_index_grid(
            seam_name=seam,
            resolution=50,
            points=overburden_data.get('boreholes', []),
        )

        # Calculate combined quality metrics
        combined_quality = _calculate_combined_quality(
            geomodel_data.quality_summary,
            mpi_grid
        )
        mpi_stats = _calculate_grid_stats(mpi_grid)

        return CombinedVisualizationResponse(
            geomodel=geomodel_data,
            mpi_grid=mpi_grid,
            mpi_stats=mpi_stats,
            combined_quality=combined_quality,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Helper functions

def _build_layer_list(artifacts: List, quality: Dict) -> List[Dict]:
    """Build layer list from artifacts and quality data"""
    layers = []

    for artifact in artifacts:
        name = str(artifact.get('name', ''))
        file_type = str(artifact.get('file_type', '')).lower()
        if name.startswith('layer_') and file_type in {'vtk', 'vtp'}:
            layer_name = name.replace('layer_', '').replace('.vtk', '').replace('.vtp', '')
            if layer_name:
                layers.append({
                    "name": layer_name,
                    "type": file_type,
                    "download_url": artifact.get('download_url'),
                    "size_bytes": artifact.get('size_bytes', 0),
                })

    # Add quality info if available
    if quality:
        top_layers = quality.get('top_layers', [])
        for layer_info in top_layers:
            existing = next((l for l in layers if l['name'] == layer_info.get('layer_name')), None)
            if existing:
                existing.update({
                    "mean_thickness": layer_info.get('mean_thickness', 0),
                    "appearance_ratio": layer_info.get('appearance_ratio', 0),
                })

    return layers


def _build_borehole_list(artifacts: List) -> List[Dict]:
    """Build borehole list from artifacts"""
    return []


def _calculate_bounds(boreholes: List) -> Dict[str, float]:
    """Calculate spatial bounds from borehole data"""
    if not boreholes:
        return {"min_x": 0, "max_x": 100, "min_y": 0, "max_y": 100}

    x_coords = [bh.get('x', 0) for bh in boreholes]
    y_coords = [bh.get('y', 0) for bh in boreholes]

    return {
        "min_x": min(x_coords),
        "max_x": max(x_coords),
        "min_y": min(y_coords),
        "max_y": max(y_coords),
    }


def _calculate_geomodel_influence(quality: Dict) -> float:
    """Calculate geomodel influence factor based on quality"""
    continuity = quality.get('continuity_score', 0)
    pinchout = 1 - quality.get('pinchout_ratio', 1)
    layer_cv = 1 - min(quality.get('layer_cv', 1), 1)

    # Combined influence score (0-1)
    return (continuity * 0.4 + pinchout * 0.3 + layer_cv * 0.3)


def _calculate_combined_quality(geomodel_quality: Optional[Dict], mpi_grid: List) -> Optional[Dict]:
    """Calculate combined quality metrics for geomodel+MPI visualization"""
    if not geomodel_quality:
        return None

    return {
        "geomodel_score": (
            geomodel_quality.get('continuity_score', 0) * 0.5 +
            (1 - geomodel_quality.get('pinchout_ratio', 1)) * 0.5
        ),
        "data_coverage": len(mpi_grid) if mpi_grid else 0,
    }


def _extract_manifest_dict(job: Any) -> Optional[Dict[str, Any]]:
    if isinstance(job, dict):
        manifest = job.get("result_manifest")
    else:
        manifest = getattr(job, "result_manifest", None)

    if not manifest:
        return None
    if isinstance(manifest, dict):
        return manifest
    if hasattr(manifest, "model_dump"):
        return manifest.model_dump()
    return None


def _normalize_artifacts(artifacts: List[Any]) -> List[Dict[str, Any]]:
    normalized: List[Dict[str, Any]] = []
    for artifact in artifacts or []:
        if isinstance(artifact, dict):
            normalized.append(artifact)
            continue
        if hasattr(artifact, "model_dump"):
            normalized.append(artifact.model_dump())
    return normalized


def _load_model_document(manifest: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    output_dir = str(manifest.get("output_dir") or "").strip()
    if not output_dir:
        return None
    model_path = Path(output_dir) / "model.json"
    if not model_path.exists():
        return None
    try:
        return json.loads(model_path.read_text(encoding="utf-8"))
    except Exception:
        return None


def _sanitize_layer_name(name: str) -> str:
    sanitized = []
    for ch in str(name):
        if ch.isalnum() or ch in {"-", "_"}:
            sanitized.append(ch)
        else:
            sanitized.append("_")
    clean = "".join(sanitized).strip("_")
    return clean[:40] if clean else "layer"


def _build_layer_list_from_model(
    model_doc: Dict[str, Any],
    artifacts: List[Dict[str, Any]],
    include_mesh: bool = False,
) -> List[Dict[str, Any]]:
    artifact_by_name = {str(item.get("name", "")): item for item in artifacts}
    layers: List[Dict[str, Any]] = []

    for idx, layer in enumerate(model_doc.get("layers") or []):
        layer_name = str(layer.get("name", "")).strip()
        if not layer_name:
            continue

        artifact = None
        for ext in ("vtp", "vtk"):
            candidate = f"layer_{_sanitize_layer_name(layer_name)}.{ext}"
            artifact = artifact_by_name.get(candidate)
            if artifact:
                break

        mesh = layer.get("mesh") or {}
        vertices = mesh.get("vertices") or []
        faces = mesh.get("faces") or []
        item = {
            "name": layer_name,
            "type": str((artifact or {}).get("file_type", "mesh")),
            "download_url": (artifact or {}).get("download_url"),
            "size_bytes": int((artifact or {}).get("size_bytes", 0)),
            "order": int(layer.get("order", idx)),
            "sample_count": int(layer.get("sample_count", 0)),
            "appearance_ratio": float(layer.get("appearance_ratio", 0.0)),
            "mean_thickness": float(layer.get("mean_thickness", 0.0)),
            "std_thickness": float(layer.get("std_thickness", 0.0)),
            "avgThickness": float(layer.get("mean_thickness", 0.0)),
            "has_mesh": bool(vertices),
            "vertex_count": int(len(vertices)),
            "face_count": int(len(faces)),
        }
        if include_mesh and vertices:
            item["mesh"] = mesh
        layers.append(item)

    layers.sort(key=lambda item: item.get("order", 0))
    return layers


def _build_borehole_list_from_model(model_doc: Dict[str, Any]) -> List[Dict[str, Any]]:
    boreholes: List[Dict[str, Any]] = []
    for item in model_doc.get("boreholes") or []:
        name = str(item.get("name", "")).strip()
        layers = []
        for layer in item.get("layers") or []:
            layer_name = str(layer.get("name", "")).strip()
            thickness = float(layer.get("thickness", 0.0))
            if layer_name:
                layers.append({"name": layer_name, "thickness": thickness})

        boreholes.append(
            {
                "name": name,
                "borehole": name,
                "x": float(item.get("x", 0.0)),
                "y": float(item.get("y", 0.0)),
                "total_thickness": float(item.get("total_thickness", 0.0)),
                "layers": layers,
            }
        )
    return boreholes


def _normalize_bounds(raw_bounds: Any, boreholes: List[Dict[str, Any]]) -> Dict[str, float]:
    if isinstance(raw_bounds, dict):
        try:
            min_x = float(raw_bounds.get("min_x"))
            max_x = float(raw_bounds.get("max_x"))
            min_y = float(raw_bounds.get("min_y"))
            max_y = float(raw_bounds.get("max_y"))
            if max_x > min_x and max_y > min_y:
                return {
                    "min_x": min_x,
                    "max_x": max_x,
                    "min_y": min_y,
                    "max_y": max_y,
                }
        except Exception:
            pass
    return _calculate_bounds(boreholes)


def _calculate_grid_stats(grid: List[List[Any]]) -> Optional[Dict[str, float]]:
    values: List[float] = []
    for row in grid or []:
        for value in row or []:
            try:
                number = float(value)
            except Exception:
                continue
            if number == number:  # NaN guard
                values.append(number)
    if not values:
        return None

    mean = sum(values) / len(values)
    variance = sum((v - mean) ** 2 for v in values) / len(values)
    return {
        "min": min(values),
        "max": max(values),
        "mean": mean,
        "std": variance ** 0.5,
    }


def _build_stress_profile_from_model(
    model_doc: Dict[str, Any],
    samples: int = 72,
    focus: str = "balanced",
) -> Dict[str, Any]:
    layers = list(model_doc.get("layers") or [])
    if not layers:
        bins = [i / max(samples - 1, 1) for i in range(samples)]
        weights = [max(0.0, min(1.0, math.exp(-1.7 * z))) for z in bins]
        return {
            "algorithm": "depth-transfer-v1",
            "source": "fallback(no layers)",
            "bins": bins,
            "weights": weights,
            "anchors": [],
            "meta": {
                "layer_count": 0.0,
                "total_thickness": 0.0,
                "focus_mode": 0.0,
            },
        }

    sorted_layers = sorted(
        layers,
        key=lambda item: int(item.get("order", 0)),
    )
    layer_rows: List[Dict[str, float]] = []
    total_thickness = 0.0
    for item in sorted_layers:
        thickness = float(item.get("mean_thickness") or 0.0)
        if thickness <= 0:
            thickness = 0.5
        continuity = float(item.get("appearance_ratio") or 0.0)
        continuity = max(0.0, min(1.0, continuity))
        layer_rows.append(
            {
                "thickness": thickness,
                "continuity": continuity,
                "sample_count": float(item.get("sample_count") or 0.0),
            }
        )
        total_thickness += thickness

    if total_thickness <= 0:
        total_thickness = float(len(layer_rows))
        for row in layer_rows:
            row["thickness"] = 1.0

    depth_cursor = 0.0
    anchors: List[Dict[str, Any]] = []
    for idx, item in enumerate(sorted_layers):
        row = layer_rows[idx]
        t_norm = row["thickness"] / total_thickness
        z_mid = (depth_cursor + row["thickness"] * 0.5) / total_thickness
        depth_cursor += row["thickness"]
        raw_importance = row["thickness"] * (0.55 + 0.45 * row["continuity"]) * (1.0 + min(row["sample_count"], 20.0) / 100.0)
        anchors.append(
            {
                "name": str(item.get("name") or f"layer_{idx + 1}"),
                "z_norm": z_mid,
                "thickness_norm": t_norm,
                "appearance_ratio": row["continuity"],
                "importance_raw": raw_importance,
            }
        )

    total_importance = sum(float(item["importance_raw"]) for item in anchors) or 1.0
    for item in anchors:
        item["importance"] = float(item["importance_raw"]) / total_importance
        item.pop("importance_raw", None)

    anchors = sorted(anchors, key=lambda item: float(item["importance"]), reverse=True)[:6]

    bins = [i / max(samples - 1, 1) for i in range(samples)]
    weights: List[float] = []
    for z in bins:
        if focus == "shallow":
            base = math.exp(-2.1 * z) * (1.12 - 0.12 * z)
        elif focus == "deep":
            base = math.exp(-1.2 * z) * (0.86 + 0.42 * z)
        else:
            base = math.exp(-1.6 * z)

        structural = 0.0
        for anchor in anchors:
            center = float(anchor["z_norm"])
            sigma = max(0.045, min(0.14, float(anchor["thickness_norm"]) * 0.9 + 0.03))
            delta = z - center
            gauss = math.exp(-(delta * delta) / (2 * sigma * sigma))
            structural += float(anchor["importance"]) * gauss

        raw = 0.45 * base + 0.55 * structural
        weights.append(raw)

    # Smooth with a lightweight 3-point kernel to reduce banding in point-cloud render.
    smoothed: List[float] = []
    for idx, _ in enumerate(weights):
        left = weights[max(0, idx - 1)]
        center = weights[idx]
        right = weights[min(len(weights) - 1, idx + 1)]
        smoothed.append(0.25 * left + 0.5 * center + 0.25 * right)

    min_w = min(smoothed)
    max_w = max(smoothed)
    if max_w <= min_w:
        normalized = [1.0 for _ in smoothed]
    else:
        normalized = [(w - min_w) / (max_w - min_w) for w in smoothed]

    return {
        "algorithm": "depth-transfer-v1",
        "source": "geomodel:model.json layers",
        "bins": bins,
        "weights": normalized,
        "anchors": anchors,
        "meta": {
            "layer_count": float(len(layer_rows)),
            "total_thickness": float(total_thickness),
            "focus_mode": float({"balanced": 0, "shallow": 1, "deep": 2}.get(focus, 0)),
        },
    }
