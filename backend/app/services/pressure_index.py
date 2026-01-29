from __future__ import annotations

from pathlib import Path
from typing import Dict, List

import numpy as np
import pandas as pd

from app.services.csv_loader import read_csv_robust
from app.services.borehole_parser import normalize_borehole_df, add_depth_columns, fill_missing_by_lithology
from app.services.lithology_stats import compute_lithology_averages
from app.services.interpolate import interpolate_from_points


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