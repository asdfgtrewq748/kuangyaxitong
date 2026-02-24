from __future__ import annotations

from fastapi import APIRouter
from fastapi.responses import Response


router = APIRouter(tags=["Pressure"])


@router.get("/api/pressure/steps")
@router.get("/pressure/steps")
def pressure_steps(model: str, h: float, q: float, t: float | None = None, s: float | None = None) -> dict:
    from app import main as main_api

    return main_api.pressure_steps(model=model, h=h, q=q, t=t, s=s)


@router.get("/api/pressure/steps/boreholes")
@router.get("/pressure/steps/boreholes")
def pressure_steps_boreholes(
    model: str = "fixed",
    h_mode: str = "total",
    q_mode: str = "density_thickness",
    default_q: float = 1.0,
) -> dict:
    from app import main as main_api

    return main_api.pressure_steps_boreholes(
        model=model,
        h_mode=h_mode,
        q_mode=q_mode,
        default_q=default_q,
    )


@router.get("/api/export/pressure-steps")
@router.get("/export/pressure-steps")
def export_pressure_steps(
    model: str = "fixed",
    h_mode: str = "total",
    q_mode: str = "density_thickness",
    default_q: float = 1.0,
) -> Response:
    from app import main as main_api

    return main_api.export_pressure_steps(
        model=model,
        h_mode=h_mode,
        q_mode=q_mode,
        default_q=default_q,
    )


@router.get("/api/pressure/steps/grid")
@router.get("/pressure/steps/grid")
def pressure_steps_grid(
    model: str = "fixed",
    target: str = "initial",
    h_mode: str = "total",
    q_mode: str = "density_thickness",
    default_q: float = 1.0,
    grid_size: int = 60,
) -> dict:
    from app import main as main_api

    return main_api.pressure_steps_grid(
        model=model,
        target=target,
        h_mode=h_mode,
        q_mode=q_mode,
        default_q=default_q,
        grid_size=grid_size,
    )


@router.get("/api/pressure/steps/workfaces")
@router.get("/pressure/steps/workfaces")
def pressure_steps_workfaces(
    model: str = "fixed",
    target: str = "initial",
    h_mode: str = "total",
    q_mode: str = "density_thickness",
    default_q: float = 1.0,
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
) -> dict:
    from app import main as main_api

    return main_api.pressure_steps_workfaces(
        model=model,
        target=target,
        h_mode=h_mode,
        q_mode=q_mode,
        default_q=default_q,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )


@router.get("/api/export/pressure-steps-grid")
@router.get("/export/pressure-steps-grid")
def export_pressure_steps_grid(
    model: str = "fixed",
    target: str = "initial",
    h_mode: str = "total",
    q_mode: str = "density_thickness",
    default_q: float = 1.0,
    grid_size: int = 60,
) -> Response:
    from app import main as main_api

    return main_api.export_pressure_steps_grid(
        model=model,
        target=target,
        h_mode=h_mode,
        q_mode=q_mode,
        default_q=default_q,
        grid_size=grid_size,
    )


@router.get("/api/export/pressure-steps-workfaces")
@router.get("/export/pressure-steps-workfaces")
def export_pressure_steps_workfaces(
    model: str = "fixed",
    target: str = "initial",
    h_mode: str = "total",
    q_mode: str = "density_thickness",
    default_q: float = 1.0,
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
) -> Response:
    from app import main as main_api

    return main_api.export_pressure_steps_workfaces(
        model=model,
        target=target,
        h_mode=h_mode,
        q_mode=q_mode,
        default_q=default_q,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )


@router.get("/api/pressure/index/boreholes")
@router.get("/pressure/index/boreholes")
def pressure_index_boreholes(
    elastic_modulus: float | None = None,
    density: float | None = None,
    tensile_strength: float | None = None,
) -> dict:
    from app import main as main_api

    return main_api.pressure_index_boreholes(
        elastic_modulus=elastic_modulus,
        density=density,
        tensile_strength=tensile_strength,
    )


@router.get("/api/pressure/index/grid")
@router.get("/pressure/index/grid")
def pressure_index_grid(
    method: str = "idw",
    grid_size: int = 50,
    elastic_modulus: float | None = None,
    density: float | None = None,
    tensile_strength: float | None = None,
) -> dict:
    from app import main as main_api

    return main_api.pressure_index_grid(
        method=method,
        grid_size=grid_size,
        elastic_modulus=elastic_modulus,
        density=density,
        tensile_strength=tensile_strength,
    )


@router.get("/api/pressure/index/workfaces")
@router.get("/pressure/index/workfaces")
def pressure_index_workfaces(
    method: str = "idw",
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
    elastic_modulus: float | None = None,
    density: float | None = None,
    tensile_strength: float | None = None,
) -> dict:
    from app import main as main_api

    return main_api.pressure_index_workfaces(
        method=method,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
        elastic_modulus=elastic_modulus,
        density=density,
        tensile_strength=tensile_strength,
    )


@router.get("/api/export/pressure-index-workfaces")
@router.get("/export/pressure-index-workfaces")
def export_pressure_index_workfaces(
    method: str = "idw",
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
    elastic_modulus: float | None = None,
    density: float | None = None,
    tensile_strength: float | None = None,
) -> Response:
    from app import main as main_api

    return main_api.export_pressure_index_workfaces(
        method=method,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
        elastic_modulus=elastic_modulus,
        density=density,
        tensile_strength=tensile_strength,
    )
