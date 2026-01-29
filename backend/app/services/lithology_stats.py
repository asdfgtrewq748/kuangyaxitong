from __future__ import annotations

from pathlib import Path
from typing import Dict, List

import pandas as pd

from app.services.csv_loader import read_csv_robust
from app.services.borehole_parser import normalize_borehole_df


NUMERIC_FIELDS = [
    "thickness",
    "elastic_modulus",
    "density",
    "tensile_strength",
]


def compute_lithology_averages(files: List[Path]) -> Dict:
    frames = []
    for p in files:
        try:
            df = read_csv_robust(p)
            df = normalize_borehole_df(df)
            frames.append(df)
        except Exception:
            continue

    if not frames:
        return {}

    data = pd.concat(frames, ignore_index=True)
    if "name" not in data.columns:
        return {}

    for col in NUMERIC_FIELDS:
        if col in data.columns:
            data[col] = pd.to_numeric(data[col], errors="coerce")

    grouped = data.groupby("name", dropna=False)
    averages = grouped[NUMERIC_FIELDS].mean(numeric_only=True).reset_index()
    return averages.fillna(0).to_dict(orient="records")