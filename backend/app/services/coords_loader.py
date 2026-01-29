from __future__ import annotations

from pathlib import Path
from typing import Dict

import pandas as pd


def load_borehole_coords(path: Path) -> Dict[str, Dict[str, float]]:
    df = pd.read_csv(path, encoding="utf-8", engine="python")
    name_col = "钻孔名"
    x_col = "坐标x"
    y_col = "坐标y"
    if name_col not in df.columns:
        raise ValueError("missing 钻孔名 column in zuobiao.csv")
    if x_col not in df.columns or y_col not in df.columns:
        raise ValueError("missing 坐标x/坐标y columns in zuobiao.csv")

    coords = {}
    for _, row in df.iterrows():
        name = str(row[name_col]).strip()
        if not name:
            continue
        coords[name] = {
            "x": float(row[x_col]),
            "y": float(row[y_col]),
        }
    return coords