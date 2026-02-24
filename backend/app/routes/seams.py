from __future__ import annotations

from typing import Optional

from fastapi import APIRouter


router = APIRouter(tags=["Coal Seams"])


@router.get("/seams/list")
@router.get("/api/seams/list")
def get_coal_seams_api() -> dict:
    from app import main as main_api

    return main_api.get_coal_seams_api()


@router.get("/api/seams/stats")
@router.get("/seams/stats")
def get_seam_stats_api(seam_name: str) -> dict:
    from app import main as main_api

    return main_api.get_seam_stats_api(seam_name=seam_name)


@router.get("/api/seams/interpolate")
@router.get("/seams/interpolate")
def interpolate_seam_api(
    seam_name: str,
    property: str,
    method: str = "idw",
    grid_size: int = 50,
    contour_levels: int = 10,
    include_contours: bool = True,
) -> dict:
    from app import main as main_api

    return main_api.interpolate_seam_api(
        seam_name=seam_name,
        property=property,
        method=method,
        grid_size=grid_size,
        contour_levels=contour_levels,
        include_contours=include_contours,
    )


@router.get("/seams/overburden")
@router.get("/api/seams/overburden")
def get_seam_overburden_api(
    seam_name: Optional[str] = None,
    seam: Optional[str] = None,
    borehole: Optional[str] = None,
) -> dict:
    from app import main as main_api

    return main_api.get_seam_overburden_api(
        seam_name=seam_name,
        seam=seam,
        borehole=borehole,
    )


@router.get("/api/seams/compare")
@router.get("/seams/compare")
def compare_seam_methods_api(
    seam_name: str,
    property: str = "thickness",
    grid_size: int = 50,
) -> dict:
    from app import main as main_api

    return main_api.compare_seam_methods_api(
        seam_name=seam_name,
        property=property,
        grid_size=grid_size,
    )


@router.get("/api/seams/contour-images")
@router.get("/seams/contour-images")
def get_seam_contour_images_api(
    seam_name: str,
    method: str = "kriging",
    grid_size: int = 80,
    num_levels: int = 12,
    dpi: int = 150,
    smooth_sigma: float = 1.0,
) -> dict:
    from app import main as main_api

    return main_api.get_seam_contour_images_api(
        seam_name=seam_name,
        method=method,
        grid_size=grid_size,
        num_levels=num_levels,
        dpi=dpi,
        smooth_sigma=smooth_sigma,
    )


@router.get("/api/seams/test-contour")
@router.get("/seams/test-contour")
def test_contour_api() -> dict:
    from app import main as main_api

    return main_api.test_contour_api()
