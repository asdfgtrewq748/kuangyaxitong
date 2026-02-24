from __future__ import annotations

from typing import List

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import Response


router = APIRouter(tags=["Data Ops"])


@router.get("/api/boreholes/scan")
@router.get("/boreholes/scan")
def scan_boreholes() -> dict:
    from app import main as main_api

    return main_api.scan_boreholes()


@router.get("/api/boreholes/preview")
@router.get("/boreholes/preview")
def preview_borehole(file: str, limit: int = 20) -> dict:
    from app import main as main_api

    return main_api.preview_borehole(file=file, limit=limit)


@router.post("/api/boreholes/upload")
@router.post("/boreholes/upload")
async def upload_boreholes(files: List[UploadFile] = File(...)) -> dict:
    from app import main as main_api

    return await main_api.upload_boreholes(files=files)


@router.post("/api/boreholes/fix-encoding")
@router.post("/boreholes/fix-encoding")
def fix_encoding() -> dict:
    from app import main as main_api

    return main_api.fix_encoding()


@router.get("/api/lithology/averages")
@router.get("/lithology/averages")
def lithology_averages() -> dict:
    from app import main as main_api

    return main_api.lithology_averages()


@router.get("/api/interpolate/field")
@router.get("/interpolate/field")
def interpolate_field_api(field: str, method: str = "kriging", grid_size: int = 50) -> dict:
    from app import main as main_api

    return main_api.interpolate_field_api(field=field, method=method, grid_size=grid_size)


@router.get("/api/interpolate/compare")
@router.get("/interpolate/compare")
def interpolate_compare_api(field: str, grid_size: int = 50) -> dict:
    from app import main as main_api

    return main_api.interpolate_compare_api(field=field, grid_size=grid_size)


@router.get("/api/interpolate/recommend")
@router.get("/interpolate/recommend")
def interpolate_recommend_api(field: str, methods: str = "kriging,idw,linear,nearest") -> dict:
    from app import main as main_api

    return main_api.interpolate_recommend_api(field=field, methods=methods)


@router.get("/api/export/interpolation")
@router.get("/export/interpolation")
def export_interpolation(field: str, method: str = "idw", grid_size: int = 60) -> Response:
    from app import main as main_api

    return main_api.export_interpolation(field=field, method=method, grid_size=grid_size)


@router.get("/api/export/index")
@router.get("/export/index")
def export_index(method: str = "idw", grid_size: int = 60) -> Response:
    from app import main as main_api

    return main_api.export_index(method=method, grid_size=grid_size)


@router.post("/api/pipeline/run")
@router.post("/pipeline/run")
def pipeline_run(
    field: str = "elastic_modulus",
    method: str = "idw",
    grid_size: int = 60,
    fix_encoding: bool = True,
) -> dict:
    from app import main as main_api

    return main_api.pipeline_run(
        field=field,
        method=method,
        grid_size=grid_size,
        fix_encoding=fix_encoding,
    )
