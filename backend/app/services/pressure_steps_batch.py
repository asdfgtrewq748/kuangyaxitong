from __future__ import annotations

from pathlib import Path
from typing import Dict, List

import pandas as pd
import numpy as np

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
    selected_files = list(files)
    if coords:
        coord_names = set(coords.keys())
        filtered = [p for p in selected_files if p.stem in coord_names]
        if filtered:
            selected_files = filtered

    lith_avgs = compute_lithology_averages(selected_files)
    lith_avg_map = {item["name"]: item for item in lith_avgs if "name" in item}

    items = []
    safe_default_q = float(default_q) if np.isfinite(default_q) and float(default_q) > 0 else 1.0
    safe_default_t = 2.0
    safe_default_s = 1.0

    for p in selected_files:
        df = read_csv_robust(p)
        df = normalize_borehole_df(df)
        df = add_depth_columns(df)
        df = fill_missing_by_lithology(df, lith_avg_map)

        total_h = float(_total_thickness(df) or 0.0)
        h = total_h if h_mode == "total" else total_h

        density_mean = _thickness_weighted_mean(df, "density")
        t_mean = _thickness_weighted_mean(df, "tensile_strength")
        s_mean = _thickness_weighted_mean(df, "shear_strength")

        if (
            q_mode == "density_thickness"
            and density_mean is not None
            and np.isfinite(float(density_mean))
            and float(density_mean) > 0
            and total_h > 0
        ):
            q = float(density_mean) * total_h
        else:
            q = safe_default_q
        if not np.isfinite(q) or q <= 0:
            q = safe_default_q

        safe_t = float(t_mean) if t_mean is not None and np.isfinite(float(t_mean)) and float(t_mean) > 0 else safe_default_t
        safe_s = float(s_mean) if s_mean is not None and np.isfinite(float(s_mean)) and float(s_mean) > 0 else safe_default_s

        result = compute_pressure_steps(model=model, h=h, q=q, t=safe_t, s=safe_s)
        item = {
            "borehole": p.stem,
            "h": h,
            "q": q,
            "t": safe_t,
            "s": safe_s,
            "result": result,
        }
        if coords and p.stem in coords:
            item["x"] = coords[p.stem]["x"]
            item["y"] = coords[p.stem]["y"]
        items.append(item)

    return {"items": items, "model": model, "h_mode": h_mode, "q_mode": q_mode}
