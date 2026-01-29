from __future__ import annotations

from math import sqrt
from typing import Dict, Optional


def compute_pressure_steps(model: str, h: float, q: float, t: float | None = None, s: float | None = None) -> Dict:
    model_key = model.strip().lower()
    if h <= 0 or q <= 0:
        return {"model": model, "error": "h and q must be positive"}

    if model_key in {"fixed", "fixed-end", "固支梁"}:
        if t is None or t <= 0:
            return {"model": model, "error": "t is required for fixed-end model"}
        l1 = h * sqrt((2 * t) / q)
        lp = None
    elif model_key in {"simply", "simply-supported", "简支梁"}:
        if t is None or t <= 0:
            return {"model": model, "error": "t is required for simply-supported model"}
        l1 = 2 * h * sqrt(t / (3 * q))
        lp = None
    elif model_key in {"shear", "剪切破坏"}:
        if s is None or s <= 0:
            return {"model": model, "error": "s is required for shear model"}
        l1 = (4 * h * s) / (3 * q)
        lp = None
    elif model_key in {"empirical", "经验比例"}:
        l1 = h
        lp = 0.25 * l1, 0.5 * l1
    else:
        return {"model": model, "error": "unknown model"}

    return {
        "model": model,
        "h": h,
        "q": q,
        "t": t,
        "s": s,
        "initial_step": l1,
        "periodic_step": lp,
    }