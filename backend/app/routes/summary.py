from __future__ import annotations

from fastapi import APIRouter


router = APIRouter(tags=["Summary"])


@router.get("/api/summary/index")
@router.get("/summary/index")
def summary_index(method: str = "idw", grid_size: int = 60) -> dict:
    from app import main as main_api

    return main_api.summary_index(method=method, grid_size=grid_size)


@router.get("/api/summary/index-workfaces")
@router.get("/summary/index-workfaces")
def summary_index_workfaces(
    method: str = "idw",
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
) -> dict:
    from app import main as main_api

    return main_api.summary_index_workfaces(
        method=method,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )


@router.get("/api/summary/steps")
@router.get("/summary/steps")
def summary_steps(model: str = "fixed", target: str = "initial", grid_size: int = 60) -> dict:
    from app import main as main_api

    return main_api.summary_steps(model=model, target=target, grid_size=grid_size)


@router.get("/api/summary/steps-workfaces")
@router.get("/summary/steps-workfaces")
def summary_steps_workfaces(
    model: str = "fixed",
    target: str = "initial",
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
) -> dict:
    from app import main as main_api

    return main_api.summary_steps_workfaces(
        model=model,
        target=target,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )


@router.get("/api/summary/report")
@router.get("/summary/report")
def summary_report(
    method: str = "idw",
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
    step_model: str = "fixed",
    step_target: str = "initial",
    step_h_mode: str = "total",
    step_q_mode: str = "density_thickness",
    step_default_q: float = 1.0,
    workface_elastic_modulus: float | None = None,
    workface_density: float | None = None,
    workface_tensile_strength: float | None = None,
) -> dict:
    from app import main as main_api

    return main_api.summary_report(
        method=method,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
        step_model=step_model,
        step_target=step_target,
        step_h_mode=step_h_mode,
        step_q_mode=step_q_mode,
        step_default_q=step_default_q,
        workface_elastic_modulus=workface_elastic_modulus,
        workface_density=workface_density,
        workface_tensile_strength=workface_tensile_strength,
    )


@router.get("/api/summary/report/perf")
@router.get("/summary/report/perf")
def summary_report_perf() -> dict:
    from app import main as main_api

    return main_api.summary_report_perf()
