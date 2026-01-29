from __future__ import annotations

from typing import Dict, List, Tuple
from pathlib import Path

import numpy as np
import pandas as pd

from app.services.csv_loader import read_csv_robust
from app.services.borehole_parser import normalize_borehole_df, add_depth_columns, fill_missing_by_lithology
from app.services.lithology_stats import compute_lithology_averages

try:
    from scipy.interpolate import griddata
except Exception:  # pragma: no cover
    griddata = None


def _thickness_weighted_mean(df: pd.DataFrame, field: str) -> float | None:
    if field not in df.columns or "thickness" not in df.columns:
        return None
    values = pd.to_numeric(df[field], errors="coerce")
    thickness = pd.to_numeric(df["thickness"], errors="coerce").fillna(0)
    mask = values.notna() & (thickness > 0)
    if mask.sum() == 0:
        return None
    return float((values[mask] * thickness[mask]).sum() / thickness[mask].sum())


def compute_points_values(files: List[Path], coords: Dict[str, Dict[str, float]], field: str) -> Dict:
    lith_avgs = compute_lithology_averages(files)
    lith_avg_map = {item["name"]: item for item in lith_avgs if "name" in item}

    points = []
    values = []
    missing = []

    for p in files:
        name = p.stem
        if name not in coords:
            missing.append(name)
            continue

        df = read_csv_robust(p)
        df = normalize_borehole_df(df)
        df = add_depth_columns(df)
        df = fill_missing_by_lithology(df, lith_avg_map)
        mean_val = _thickness_weighted_mean(df, field)
        if mean_val is None:
            continue
        points.append((coords[name]["x"], coords[name]["y"]))
        values.append(mean_val)

    return {"points": points, "values": values, "missing_coords": missing}


def _idw_interpolate(x: np.ndarray, y: np.ndarray, v: np.ndarray, grid_x: np.ndarray, grid_y: np.ndarray) -> np.ndarray:
    gx, gy = np.meshgrid(grid_x, grid_y)
    values = np.zeros_like(gx, dtype=float)
    for i in range(gx.shape[0]):
        for j in range(gx.shape[1]):
            dx = x - gx[i, j]
            dy = y - gy[i, j]
            dist = np.sqrt(dx * dx + dy * dy)
            dist = np.where(dist == 0, 1e-12, dist)
            w = 1 / (dist**2)
            values[i, j] = np.sum(w * v) / np.sum(w)
    return values


def interpolate_from_points(points: np.ndarray, values: np.ndarray, method: str, grid_size: int) -> Dict:
    x = points[:, 0]
    y = points[:, 1]
    v = values

    padding = 0.05
    min_x, max_x = float(x.min()), float(x.max())
    min_y, max_y = float(y.min()), float(y.max())
    dx = max_x - min_x
    dy = max_y - min_y
    min_x -= dx * padding
    max_x += dx * padding
    min_y -= dy * padding
    max_y += dy * padding

    grid_x = np.linspace(min_x, max_x, grid_size)
    grid_y = np.linspace(min_y, max_y, grid_size)

    method_key = method.strip().lower()
    if method_key == "idw":
        grid = _idw_interpolate(x, y, v, grid_x, grid_y)
    elif method_key in {"linear", "nearest"}:
        if griddata is None:
            return {"error": "scipy is required for linear/nearest interpolation"}
        gx, gy = np.meshgrid(grid_x, grid_y)
        grid = griddata(points=points, values=v, xi=(gx, gy), method=method_key)
        grid = np.nan_to_num(grid, nan=float(np.nanmean(v)))
    else:
        return {"error": "unknown method"}

    return {
        "grid": grid,
        "bounds": {"min_x": min_x, "max_x": max_x, "min_y": min_y, "max_y": max_y},
    }


def interpolate_field(files: List[Path], coords: Dict[str, Dict[str, float]], field: str, method: str, grid_size: int) -> Dict:
    data = compute_points_values(files=files, coords=coords, field=field)
    points = data["points"]
    values = data["values"]
    missing = data["missing_coords"]

    if len(points) < 3:
        return {"error": "not enough points for interpolation", "missing_coords": missing}

    pts = np.array(points)
    v = np.array(values)
    result = interpolate_from_points(points=pts, values=v, method=method, grid_size=grid_size)
    if "error" in result:
        return result

    grid = result["grid"]
    bounds = result["bounds"]

    return {
        "field": field,
        "method": method,
        "grid_size": grid_size,
        "bounds": bounds,
        "values": grid.tolist(),
        "missing_coords": missing,
        "point_count": len(points),
    }