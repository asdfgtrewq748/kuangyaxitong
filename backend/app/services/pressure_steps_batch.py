from __future__ import annotations

from pathlib import Path
from typing import Dict, List

import pandas as pd

from app.services.csv_loader import read_csv_robust
from app.services.borehole_parser import normalize_borehole_df, add_depth_columns, fill_missing_by_lithology
from app.services.lithology_stats import compute_lithology_averages
from app.services.pressure_steps import compute_pressure_steps


def _thickness_weighted_mean(df: pd.DataFrame, field: str) -> float | None:
    if field not in df.columns or "thickness" not in df.columns:
        return None
    values = pd.to_numeric(df[field], errors="coerce")
    thickness = pd.to_numeric(df["thickness"], errors="coerce").fillna(0)
    mask = values.notna() & (thickness > 0)
    if mask.sum() == 0:
        return None
    return float((values[mask] * thickness[mask]).sum() / thickness[mask].sum())


def _total_thickness(df: pd.DataFrame) -> float | None:
    if "thickness" not in df.columns:
        return None
    values = pd.to_numeric(df["thickness"], errors="coerce").fillna(0)
    return float(values.sum())


def compute_pressure_steps_boreholes(
    files: List[Path],
    model: str,
    h_mode: str = "total",
    q_mode: str = "density_thickness",
    default_q: float = 1.0,
    coords: Dict[str, Dict[str, float]] | None = None,
) -> Dict:
    lith_avgs = compute_lithology_averages(files)
    lith_avg_map = {item["name"]: item for item in lith_avgs if "name" in item}

    items = []
    for p in files:
        df = read_csv_robust(p)
        df = normalize_borehole_df(df)
        df = add_depth_columns(df)
        df = fill_missing_by_lithology(df, lith_avg_map)

        total_h = _total_thickness(df) or 0.0
        h = total_h if h_mode == "total" else total_h

        density_mean = _thickness_weighted_mean(df, "density")
        t_mean = _thickness_weighted_mean(df, "tensile_strength")
        s_mean = _thickness_weighted_mean(df, "shear_strength")

        if q_mode == "density_thickness" and density_mean is not None:
            q = density_mean * (total_h if total_h > 0 else 1.0)
        else:
            q = default_q

        result = compute_pressure_steps(model=model, h=h, q=q, t=t_mean, s=s_mean)
        item = {
            "borehole": p.stem,
            "h": h,
            "q": q,
            "t": t_mean,
            "s": s_mean,
            "result": result,
        }
        if coords and p.stem in coords:
            item["x"] = coords[p.stem]["x"]
            item["y"] = coords[p.stem]["y"]
        items.append(item)

    return {"items": items, "model": model, "h_mode": h_mode, "q_mode": q_mode}