from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd

from app.services.csv_loader import read_csv_robust
from app.services.borehole_parser import normalize_borehole_df, add_depth_columns, fill_missing_by_lithology
from app.services.lithology_stats import compute_lithology_averages
from app.services.interpolate import interpolate_from_points
from app.services.mpi_calculator import PointData, RockLayer, calc_all_indicators


DEFAULT_WEIGHTS = {
    "elastic_modulus": 0.4,
    "density": 0.3,
    "tensile_strength": 0.3,
}


def normalize_weights(weights: Dict) -> Dict:
    if not weights:
        return DEFAULT_WEIGHTS.copy()
    cleaned = {k: float(v) for k, v in weights.items() if v is not None}
    total = sum(cleaned.values())
    if total <= 0:
        return DEFAULT_WEIGHTS.copy()
    return {k: v / total for k, v in cleaned.items()}


def _thickness_weighted_mean(df: pd.DataFrame, field: str) -> float | None:
    if field not in df.columns or "thickness" not in df.columns:
        return None
    values = pd.to_numeric(df[field], errors="coerce")
    thickness = pd.to_numeric(df["thickness"], errors="coerce").fillna(0)
    mask = values.notna() & (thickness > 0)
    if mask.sum() == 0:
        return None
    return float((values[mask] * thickness[mask]).sum() / thickness[mask].sum())


def compute_borehole_index(files: List[Path], coords: Dict[str, Dict[str, float]], weights: Dict | None = None) -> Dict:
    weights = normalize_weights(weights)
    lith_avgs = compute_lithology_averages(files)
    lith_avg_map = {item["name"]: item for item in lith_avgs if "name" in item}

    results = []
    missing_coords = []

    for p in files:
        name = p.stem
        if name not in coords:
            missing_coords.append(name)
            continue

        df = read_csv_robust(p)
        df = normalize_borehole_df(df)
        df = add_depth_columns(df)
        df = fill_missing_by_lithology(df, lith_avg_map)

        index_value = 0.0
        weight_sum = 0.0
        for field, w in weights.items():
            val = _thickness_weighted_mean(df, field)
            if val is None:
                continue
            index_value += w * val
            weight_sum += w

        if weight_sum == 0:
            continue

        results.append(
            {
                "name": name,
                "x": coords[name]["x"],
                "y": coords[name]["y"],
                "index": index_value / weight_sum,
            }
        )

    return {"items": results, "missing_coords": missing_coords}


def interpolate_index(items: List[Dict], method: str, grid_size: int) -> Dict:
    if len(items) < 3:
        return {"error": "not enough points for interpolation"}

    points = np.array([[item["x"], item["y"]] for item in items])
    values = np.array([item["index"] for item in items])

    result = interpolate_from_points(points=points, values=values, method=method, grid_size=grid_size)
    if "error" in result:
        return result

    grid = result["grid"]
    bounds = result["bounds"]
    return {
        "method": method,
        "grid_size": grid_size,
        "bounds": bounds,
        "values": grid.tolist(),
        "point_count": len(items),
    }


def _to_float(value: Any) -> Optional[float]:
    parsed = pd.to_numeric(value, errors="coerce")
    if pd.isna(parsed):
        return None
    return float(parsed)


def _build_point_from_overburden(borehole: Dict[str, Any], seam_name: str) -> Optional[PointData]:
    x = _to_float(borehole.get("x"))
    y = _to_float(borehole.get("y"))
    if x is None or y is None:
        return None

    seam_name_norm = str(seam_name or "").strip()
    layers = borehole.get("layers") or []
    seam_layer: Dict[str, Any] | None = None
    strata: List[RockLayer] = []

    for layer in layers:
        if not isinstance(layer, dict):
            continue
        layer_name = str(layer.get("name") or "").strip()
        thickness = _to_float(layer.get("thickness"))
        if thickness is None or thickness <= 0:
            continue

        if layer_name == seam_name_norm:
            seam_layer = layer
            continue

        strata.append(
            RockLayer(
                thickness=thickness,
                name=layer_name,
                density=_to_float(layer.get("density")),
                cohesion=_to_float(layer.get("cohesion")),
                friction_angle=_to_float(layer.get("friction_angle")),
                tensile_strength=_to_float(layer.get("tensile_strength")),
                compressive_strength=_to_float(layer.get("compressive_strength")),
                elastic_modulus=_to_float(layer.get("elastic_modulus")),
            )
        )

    seam_top = _to_float(borehole.get("seam_top_depth")) or 0.0
    seam_thickness = _to_float((seam_layer or {}).get("thickness")) or 0.0
    seam_bottom = _to_float((seam_layer or {}).get("z_bottom"))
    if seam_bottom is None:
        seam_bottom = seam_top + seam_thickness

    return PointData(
        x=x,
        y=y,
        borehole=str(borehole.get("name") or ""),
        thickness=seam_thickness,
        burial_depth=seam_top,
        z_top=seam_top,
        z_bottom=seam_bottom,
        strata=strata,
    )


async def calculate_pressure_index_grid(
    *,
    seam_name: str,
    resolution: int,
    points: List[Dict[str, Any]],
) -> List[List[float]]:
    """
    Compatibility helper used by geomodel integration routes.

    Builds point-wise MPI from overburden borehole payload, then interpolates
    a grid with IDW.
    """
    valid_points: List[List[float]] = []
    valid_values: List[float] = []

    for borehole in points or []:
        if not isinstance(borehole, dict):
            continue
        point = _build_point_from_overburden(borehole, seam_name)
        if point is None:
            continue

        indicators = calc_all_indicators(point)
        valid_points.append([point.x, point.y])
        valid_values.append(float(indicators["mpi"]))

    if len(valid_points) < 3:
        raise ValueError("Not enough valid borehole points for MPI interpolation (need >= 3)")

    interp = interpolate_from_points(
        points=np.asarray(valid_points, dtype=float),
        values=np.asarray(valid_values, dtype=float),
        method="idw",
        grid_size=max(10, int(resolution)),
    )
    if "error" in interp:
        raise RuntimeError(str(interp["error"]))

    grid = interp["grid"]
    return grid.tolist() if hasattr(grid, "tolist") else grid
