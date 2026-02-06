from __future__ import annotations

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from typing import List, Optional

from app.core.config import get_data_dir
from app.services.csv_loader import analyze_csv_file, read_csv_robust
from app.services.borehole_parser import normalize_borehole_df, add_depth_columns
from app.services.encoding_fix import fix_csv_encoding
from app.services.lithology_stats import compute_lithology_averages
from app.services.pressure_steps import compute_pressure_steps
from app.services.coords_loader import load_borehole_coords
from app.services.interpolate import interpolate_field, compute_points_values
from app.services.pressure_index import compute_borehole_index, interpolate_index
from app.services.coal_seam_parser import get_all_coal_seams, get_coal_seam_data, get_overburden_lithology, get_seam_stats
from app.services.seam_interpolate import interpolate_seam_property, interpolate_seam_with_overburden, compare_interpolation_methods_for_seam
from app.services.pipeline import run_pipeline
from app.services.grid_export import grid_to_csv_bytes
from app.services.interpolation_eval import evaluate_methods
from app.services.pressure_steps_batch import compute_pressure_steps_boreholes
from app.services.interpolate import interpolate_from_points
from app.services.workface import compute_workface_adjusted_grid
from app.services.summary import summarize_grid
from app.services.contour_generator import generate_matplotlib_contour_image, generate_dual_contour_images
from app.routes.mpi import router as mpi_router
from app.routes.rock_params import router as rock_params_router
from app.routes.algorithm_validation import router as validation_router

app = FastAPI(title="Mining Pressure System API", version="0.1.0")

# Include routers
app.include_router(mpi_router)
app.include_router(rock_params_router)
app.include_router(validation_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/boreholes/scan")
def scan_boreholes() -> dict:
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail=f"data dir not found: {data_dir}")

    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file()])
    results = []
    for p in files:
        info = analyze_csv_file(p)
        results.append(info)
    return {"data_dir": str(data_dir), "files": results}


@app.get("/boreholes/preview")
def preview_borehole(file: str, limit: int = 20) -> dict:
    data_dir = get_data_dir()
    path = (data_dir / file).resolve()
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"file not found: {path}")
    if path.suffix.lower() != ".csv":
        raise HTTPException(status_code=400, detail="only csv supported")

    df = read_csv_robust(path)
    df = normalize_borehole_df(df)
    df = add_depth_columns(df)

    preview = df.head(limit).to_dict(orient="records")
    return {
        "file": path.name,
        "rows": preview,
        "columns": list(df.columns),
        "row_count": int(df.shape[0]),
    }


@app.post("/boreholes/upload")
async def upload_boreholes(files: List[UploadFile] = File(...)) -> dict:
    data_dir = get_data_dir()
    if not data_dir.exists():
        data_dir.mkdir(parents=True, exist_ok=True)

    saved = []
    for f in files:
        if not f.filename.lower().endswith(".csv"):
            continue
        dest = (data_dir / Path(f.filename).name).resolve()
        content = await f.read()
        dest.write_bytes(content)
        saved.append(dest.name)

    return {"saved": saved, "count": len(saved)}


@app.post("/boreholes/fix-encoding")
def fix_encoding() -> dict:
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail=f"data dir not found: {data_dir}")

    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file()])
    results = []
    for p in files:
        result = fix_csv_encoding(p)
        results.append(result)
    return {"data_dir": str(data_dir), "files": results}


@app.get("/lithology/averages")
def lithology_averages() -> dict:
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail=f"data dir not found: {data_dir}")

    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file()])
    stats = compute_lithology_averages(files)
    return {"data_dir": str(data_dir), "averages": stats}


@app.get("/pressure/steps")
def pressure_steps(model: str, h: float, q: float, t: float | None = None, s: float | None = None) -> dict:
    result = compute_pressure_steps(model=model, h=h, q=q, t=t, s=s)
    return result


@app.get("/pressure/steps/boreholes")
def pressure_steps_boreholes(model: str = "fixed", h_mode: str = "total", q_mode: str = "density_thickness", default_q: float = 1.0) -> dict:
    data_dir = get_data_dir()
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    coord_path = data_dir / "zuobiao.csv"
    coords = load_borehole_coords(coord_path)
    result = compute_pressure_steps_boreholes(files=files, model=model, h_mode=h_mode, q_mode=q_mode, default_q=default_q, coords=coords)
    return result


@app.get("/export/pressure-steps")
def export_pressure_steps(model: str = "fixed", h_mode: str = "total", q_mode: str = "density_thickness", default_q: float = 1.0) -> Response:
    data_dir = get_data_dir()
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    result = compute_pressure_steps_boreholes(files=files, model=model, h_mode=h_mode, q_mode=q_mode, default_q=default_q)

    rows = [
        ["borehole", "h", "q", "t", "s", "initial_step", "periodic_step", "error"]
    ]
    for item in result["items"]:
        r = item["result"]
        rows.append([
            item["borehole"],
            item["h"],
            item["q"],
            item["t"],
            item["s"],
            r.get("initial_step"),
            r.get("periodic_step"),
            r.get("error"),
        ])

    content = "\n".join(",".join(map(lambda x: "" if x is None else str(x), row)) for row in rows)
    filename = f"pressure_steps_{model}.csv"
    return Response(content=content.encode("utf-8"), media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


@app.get("/pressure/steps/grid")
def pressure_steps_grid(model: str = "fixed", target: str = "initial", h_mode: str = "total", q_mode: str = "density_thickness", default_q: float = 1.0, grid_size: int = 60) -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    result = compute_pressure_steps_boreholes(files=files, model=model, h_mode=h_mode, q_mode=q_mode, default_q=default_q, coords=coords)

    points = []
    values = []
    for item in result["items"]:
        if "x" not in item or "y" not in item:
            continue
        step = item["result"].get("initial_step" if target == "initial" else "periodic_step")
        if isinstance(step, (list, tuple)):
            step_val = sum(step) / len(step)
        else:
            step_val = step
        if step_val is None:
            continue
        points.append((item["x"], item["y"]))
        values.append(step_val)

    if len(points) < 3:
        return {"error": "not enough points for interpolation"}

    import numpy as np
    pts = np.array(points)
    vals = np.array(values)
    grid = interpolate_from_points(points=pts, values=vals, method="idw", grid_size=grid_size)
    if "error" in grid:
        return grid
    return {
        "target": target,
        "grid_size": grid_size,
        "bounds": grid["bounds"],
        "values": grid["grid"].tolist(),
    }


@app.get("/pressure/steps/workfaces")
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
    grid_data = pressure_steps_grid(
        model=model,
        target=target,
        h_mode=h_mode,
        q_mode=q_mode,
        default_q=default_q,
        grid_size=grid_size,
    )
    if "error" in grid_data:
        return grid_data
    adjusted = compute_workface_adjusted_grid(
        grid=grid_data["values"],
        bounds=grid_data["bounds"],
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )
    return {"grid": grid_data, "workfaces": adjusted}


@app.get("/export/pressure-steps-grid")
def export_pressure_steps_grid(model: str = "fixed", target: str = "initial", h_mode: str = "total", q_mode: str = "density_thickness", default_q: float = 1.0, grid_size: int = 60) -> Response:
    data = pressure_steps_grid(model=model, target=target, h_mode=h_mode, q_mode=q_mode, default_q=default_q, grid_size=grid_size)
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    content = grid_to_csv_bytes(data["values"], data["bounds"])
    filename = f"pressure_steps_grid_{model}_{target}_{grid_size}.csv"
    return Response(content=content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


@app.get("/export/pressure-steps-workfaces")
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
    data = pressure_steps_workfaces(
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
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    content = grid_to_csv_bytes(data["workfaces"]["adjusted"], data["grid"]["bounds"])
    filename = f"pressure_steps_workfaces_{model}_{target}_{grid_size}.csv"
    return Response(content=content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


@app.get("/interpolate/field")
def interpolate_field_api(field: str, method: str = "kriging", grid_size: int = 50) -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    result = interpolate_field(files=files, coords=coords, field=field, method=method, grid_size=grid_size)
    return result


@app.get("/interpolate/compare")
def interpolate_compare_api(field: str, grid_size: int = 50) -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    methods = ["kriging", "idw", "linear", "nearest"]
    results = {}
    for method in methods:
        results[method] = interpolate_field(files=files, coords=coords, field=field, method=method, grid_size=grid_size)
    return {"field": field, "grid_size": grid_size, "results": results}


@app.get("/interpolate/recommend")
def interpolate_recommend_api(field: str, methods: str = "kriging,idw,linear,nearest") -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    data = compute_points_values(files=files, coords=coords, field=field)
    points = data["points"]
    values = data["values"]

    if len(points) < 3:
        return {"error": "not enough points for evaluation"}

    import numpy as np

    pts = np.array(points)
    vals = np.array(values)
    method_list = [m.strip() for m in methods.split(",") if m.strip()]
    scores = evaluate_methods(points=pts, values=vals, methods=method_list)
    best = min(scores.items(), key=lambda kv: kv[1]["rmse"])
    return {"field": field, "scores": scores, "recommended": best[0]}


@app.get("/pressure/index/boreholes")
def pressure_index_boreholes(elastic_modulus: float | None = None, density: float | None = None, tensile_strength: float | None = None) -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    weights = {}
    if elastic_modulus is not None:
        weights["elastic_modulus"] = elastic_modulus
    if density is not None:
        weights["density"] = density
    if tensile_strength is not None:
        weights["tensile_strength"] = tensile_strength
    result = compute_borehole_index(files=files, coords=coords, weights=weights or None)
    return result


@app.get("/pressure/index/grid")
def pressure_index_grid(method: str = "idw", grid_size: int = 50, elastic_modulus: float | None = None, density: float | None = None, tensile_strength: float | None = None) -> dict:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    weights = {}
    if elastic_modulus is not None:
        weights["elastic_modulus"] = elastic_modulus
    if density is not None:
        weights["density"] = density
    if tensile_strength is not None:
        weights["tensile_strength"] = tensile_strength
    base = compute_borehole_index(files=files, coords=coords, weights=weights or None)
    items = base.get("items", [])
    grid = interpolate_index(items=items, method=method, grid_size=grid_size)
    return {"base": base, "grid": grid}


@app.get("/pressure/index/workfaces")
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
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    weights = {}
    if elastic_modulus is not None:
        weights["elastic_modulus"] = elastic_modulus
    if density is not None:
        weights["density"] = density
    if tensile_strength is not None:
        weights["tensile_strength"] = tensile_strength

    base = compute_borehole_index(files=files, coords=coords, weights=weights or None)
    items = base.get("items", [])
    grid = interpolate_index(items=items, method=method, grid_size=grid_size)
    if "error" in grid:
        return grid

    adjusted = compute_workface_adjusted_grid(
        grid=grid["values"],
        bounds=grid["bounds"],
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )

    return {"base": base, "grid": grid, "workfaces": adjusted}


@app.get("/export/pressure-index-workfaces")
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
    data = pressure_index_workfaces(
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
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"])
    content = grid_to_csv_bytes(data["workfaces"]["adjusted"], data["grid"]["bounds"])
    filename = f"pressure_index_workfaces_{axis}_{count}_{grid_size}.csv"
    return Response(content=content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


@app.get("/summary/index")
def summary_index(method: str = "idw", grid_size: int = 60) -> dict:
    data = pressure_index_grid(method=method, grid_size=grid_size)
    if "error" in data:
        return data
    return {"grid": summarize_grid(data["grid"]["values"])}


@app.get("/summary/index-workfaces")
def summary_index_workfaces(
    method: str = "idw",
    grid_size: int = 60,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
) -> dict:
    data = pressure_index_workfaces(
        method=method,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )
    if "error" in data:
        return data
    return {"grid": summarize_grid(data["workfaces"]["adjusted"])}


@app.get("/summary/steps")
def summary_steps(model: str = "fixed", target: str = "initial", grid_size: int = 60) -> dict:
    data = pressure_steps_grid(model=model, target=target, grid_size=grid_size)
    if "error" in data:
        return data
    return {"grid": summarize_grid(data["values"])}


@app.get("/summary/steps-workfaces")
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
    data = pressure_steps_workfaces(
        model=model,
        target=target,
        grid_size=grid_size,
        axis=axis,
        count=count,
        direction=direction,
        mode=mode,
        decay=decay,
    )
    if "error" in data:
        return data
    return {"grid": summarize_grid(data["workfaces"]["adjusted"])}


@app.get("/export/interpolation")
def export_interpolation(field: str, method: str = "idw", grid_size: int = 60) -> Response:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    result = interpolate_field(files=files, coords=coords, field=field, method=method, grid_size=grid_size)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    content = grid_to_csv_bytes(result["values"], result["bounds"])
    filename = f"interpolation_{field}_{method}_{grid_size}.csv"
    return Response(content=content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


@app.get("/export/index")
def export_index(method: str = "idw", grid_size: int = 60) -> Response:
    data_dir = get_data_dir()
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    base = compute_borehole_index(files=files, coords=coords)
    grid = interpolate_index(items=base.get("items", []), method=method, grid_size=grid_size)
    if "error" in grid:
        raise HTTPException(status_code=400, detail=grid["error"])

    content = grid_to_csv_bytes(grid["values"], grid["bounds"])
    filename = f"pressure_index_{method}_{grid_size}.csv"
    return Response(content=content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})


@app.post("/pipeline/run")
def pipeline_run(field: str = "elastic_modulus", method: str = "idw", grid_size: int = 60, fix_encoding: bool = True) -> dict:
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail=f"data dir not found: {data_dir}")
    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found in data dir")

    result = run_pipeline(data_dir=data_dir, field=field, method=method, grid_size=grid_size, fix_encoding=fix_encoding)
    return result


# =============================================================================
# Coal Seam Interpolation API Endpoints
# =============================================================================

@app.get("/seams/list")
def get_coal_seams_api() -> dict:
    """
    Get list of all available coal seams from borehole data.

    Returns:
        Dictionary with list of coal seams found in borehole files:
        {
            "seams": [
                {"name": "16-3煤", "borehole_count": 15, "avg_thickness": 8.5},
                {"name": "15-4煤", "borehole_count": 20, "avg_thickness": 2.1},
                ...
            ]
        }
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    result = get_all_coal_seams(files, coords)
    return result


@app.get("/seams/stats")
def get_seam_stats_api(seam_name: str) -> dict:
    """
    Get detailed statistics for a specific coal seam.

    Args:
        seam_name: Name of the coal seam (e.g., "16-3煤")

    Returns:
        Dictionary with seam statistics including thickness, burial depth, and lithology summary
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    result = get_seam_stats(files, coords, seam_name)

    if not result.get("borehole_count") or result["borehole_count"] == 0:
        raise HTTPException(status_code=404, detail=f"Coal seam '{seam_name}' not found in any borehole data")

    return result


@app.get("/seams/interpolate")
def interpolate_seam_api(
    seam_name: str,
    property: str,
    method: str = "idw",
    grid_size: int = 50,
    contour_levels: int = 10,
    include_contours: bool = True
) -> dict:
    """
    Interpolate a property for a specific coal seam with optional contour line generation.

    Args:
        seam_name: Name of the coal seam (e.g., "16-3煤")
        property: Property to interpolate ("thickness" or "burial_depth")
        method: Interpolation method ("kriging", "idw", "linear", "nearest")
        grid_size: Grid resolution (20-100)
        contour_levels: Number of contour levels (5-20)
        include_contours: Whether to include contour line data

    Returns:
        Dictionary with interpolation grid and optional contour line data
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    result = interpolate_seam_property(
        files=files,
        coords=coords,
        seam_name=seam_name,
        property=property,
        method=method,
        grid_size=grid_size,
        contour_levels=contour_levels,
        include_contours=include_contours
    )

    return result


@app.get("/seams/overburden")
def get_seam_overburden_api(seam_name: str, borehole: Optional[str] = None) -> dict:
    """
    Get overburden lithology data for a coal seam.

    Args:
        seam_name: Name of the coal seam (e.g., "16-3煤")
        borehole: Optional specific borehole name to filter results

    Returns:
        Dictionary with lithology data for column chart visualization:
        {
            "seam_name": "16-3煤",
            "boreholes": [
                {
                    "name": "50-14",
                    "x": 495394.96,
                    "y": 5404813.13,
                    "layers": [...],
                    "seam_top_depth": 450.5
                },
                ...
            ]
        }
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    result = get_overburden_lithology(files, coords, seam_name)

    if borehole:
        # Filter to specific borehole if requested
        boreholes = result.get("boreholes", [])
        filtered = [b for b in boreholes if b["name"] == borehole]
        if not filtered:
            raise HTTPException(status_code=404, detail=f"Borehole '{borehole}' not found or has no overburden data for seam '{seam_name}'")
        result["boreholes"] = filtered
        result["borehole_count"] = len(filtered)

    return result


@app.get("/seams/compare")
def compare_seam_methods_api(
    seam_name: str,
    property: str = "thickness",
    grid_size: int = 50
) -> dict:
    """
    Compare different interpolation methods for a specific coal seam property.

    Args:
        seam_name: Name of the coal seam
        property: Property to compare ("thickness" or "burial_depth")
        grid_size: Grid resolution

    Returns:
        Dictionary comparing interpolation methods with recommendations
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    result = compare_interpolation_methods_for_seam(
        files=files,
        coords=coords,
        seam_name=seam_name,
        property=property,
        grid_size=grid_size
    )

    return result


@app.get("/seams/contour-images")
def get_seam_contour_images_api(
    seam_name: str,
    method: str = "kriging",
    grid_size: int = 80,
    num_levels: int = 12,
    dpi: int = 150,
    smooth_sigma: float = 1.0
) -> dict:
    """
    Generate high-quality matplotlib contour images for both thickness and burial depth.

    This endpoint uses matplotlib to generate publication-quality contour plots with:
    - Gaussian smoothed contours
    - Filled contour colors (YlOrBr for thickness, viridis for depth)
    - Thin black contour lines with inline labels
    - Professional colorbar and formatting

    Args:
        seam_name: Name of the coal seam (e.g., "16-3煤")
        method: Interpolation method ("idw", "linear", "nearest")
        grid_size: Grid resolution (20-150, higher = smoother)
        num_levels: Number of contour levels (5-20)
        dpi: Image DPI for high-quality output (150-600)
        smooth_sigma: Gaussian smoothing sigma (0-5, higher = smoother)

    Returns:
        Dictionary with base64-encoded PNG images:
        {
            "thickness": {"image": "base64...", "format": "png", "value_range": {...}},
            "depth": {"image": "base64...", "format": "png", "value_range": {...}},
            "seam_name": "16-3煤",
            "borehole_count": 15
        }
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        raise HTTPException(status_code=404, detail="data dir not found")

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        raise HTTPException(status_code=404, detail="zuobiao.csv not found")

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    # Get seam data (includes both thickness and burial depth)
    seam_data = get_coal_seam_data(files, coords, seam_name)

    if "error" in seam_data:
        raise HTTPException(status_code=404, detail=seam_data.get("error", f"Coal seam '{seam_name}' not found"))

    # Extract points and values for interpolation
    points_list = seam_data.get("points", [])
    if not points_list:
        raise HTTPException(status_code=404, detail=f"No data found for seam '{seam_name}'")

    # Interpolate both properties
    import numpy as np
    from app.services.interpolate import interpolate_from_points

    # Prepare thickness data
    thickness_pts = []
    thickness_vals = []
    depth_pts = []
    depth_vals = []

    for p in points_list:
        if p.get("x") is not None and p.get("y") is not None:
            if p.get("thickness") is not None:
                thickness_pts.append([p["x"], p["y"]])
                thickness_vals.append(p["thickness"])
            if p.get("burial_depth") is not None:
                depth_pts.append([p["x"], p["y"]])
                depth_vals.append(p["burial_depth"])

    if len(thickness_pts) < 3:
        raise HTTPException(status_code=400, detail="Not enough thickness data points for interpolation")
    if len(depth_pts) < 3:
        raise HTTPException(status_code=400, detail="Not enough burial depth data points for interpolation")

    # Thickness interpolation
    thickness_grid = interpolate_from_points(
        points=np.array(thickness_pts),
        values=np.array(thickness_vals),
        method=method,
        grid_size=grid_size
    )

    # Burial depth interpolation
    depth_grid = interpolate_from_points(
        points=np.array(depth_pts),
        values=np.array(depth_vals),
        method=method,
        grid_size=grid_size
    )

    if "error" in thickness_grid:
        raise HTTPException(status_code=400, detail=thickness_grid["error"])
    if "error" in depth_grid:
        raise HTTPException(status_code=400, detail=depth_grid["error"])

    # Generate matplotlib contour images
    try:
        images = generate_dual_contour_images(
            thickness_grid=np.array(thickness_grid["grid"]),
            depth_grid=np.array(depth_grid["grid"]),
            bounds=thickness_grid["bounds"],
            seam_name=seam_name,
            num_levels=num_levels,
            dpi=dpi,
            smooth_sigma=smooth_sigma
        )
    except Exception as e:
        import traceback
        error_detail = f"Contour generation failed: {str(e)}\n{traceback.format_exc()}"
        raise HTTPException(status_code=500, detail=error_detail)

    return {
        "seam_name": seam_name,
        "method": method,
        "grid_size": grid_size,
        "borehole_count": seam_data.get("point_count", 0),
        "bounds": thickness_grid.get("bounds"),
        "thickness": images["thickness"],
        "depth": images["depth"],
        "boreholes": seam_data.get("points", [])
    }


@app.get("/seams/test-contour")
def test_contour_api() -> dict:
    """Test endpoint for contour generation."""
    import numpy as np
    from app.services.contour_generator import generate_dual_contour_images

    # Create test data
    thickness_grid = np.random.rand(20, 20) * 10 + 10
    depth_grid = np.random.rand(20, 20) * 100 + 400
    bounds = {"min_x": 0, "max_x": 1000, "min_y": 0, "max_y": 800}

    images = generate_dual_contour_images(
        thickness_grid=thickness_grid,
        depth_grid=depth_grid,
        bounds=bounds,
        seam_name="Test",
        num_levels=5,
        dpi=50,
        smooth_sigma=1.0
    )

    return {
        "test": "OK",
        "thickness": images["thickness"],
        "depth": images["depth"]
    }
