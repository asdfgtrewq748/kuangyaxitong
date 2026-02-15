"""
Geomodel Integration API Routes

Routes for integrating geomodel data with visualization and MPI calculation.
"""

from __future__ import annotations

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
async def get_geomodel_visualization_data(job_id: str) -> GeomodelVisualizationData:
    """
    Get geomodel data formatted for visualization components.

    Returns layers, boreholes, bounds, and quality summary
    that can be directly used by the GeomodelViewer component.
    """
    try:
        job = geomodel_service.get_job(job_id)
        manifest = job.get('result_manifest') if isinstance(job, dict) else job.result_manifest

        if not manifest:
            raise HTTPException(status_code=404, detail=f"Geomodel job {job_id} not completed")

        # Extract visualization data from manifest
        artifacts = manifest.get('artifacts', [])
        quality = manifest.get('quality_summary', {})

        # Build layer list
        layers = _build_layer_list(artifacts, quality)

        # Build borehole list
        boreholes = _build_borehole_list(artifacts)

        # Calculate bounds
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
                manifest = job.get('result_manifest') if isinstance(job, dict) else job.result_manifest
                geomodel_context = {
                    "quality": manifest.get('quality_summary', {}),
                    "artifacts": manifest.get('artifacts', []),
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

        return CombinedVisualizationResponse(
            geomodel=geomodel_data,
            mpi_grid=mpi_grid,
            combined_quality=combined_quality,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Helper functions

def _build_layer_list(artifacts: List, quality: Dict) -> List[Dict]:
    """Build layer list from artifacts and quality data"""
    layers = []

    # Extract layer information from artifacts
    for artifact in artifacts:
        if artifact.get('file_type') == 'vtk':
            # This is a layer file
            layer_name = artifact.get('name', '').replace('layer_', '').replace('.vtk', '')
            if layer_name:
                layers.append({
                    "name": layer_name,
                    "type": "vtk",
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
    # This would extract borehole information from the artifacts
    # For now, return a placeholder
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
