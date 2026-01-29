from __future__ import annotations

from pathlib import Path
from typing import Dict, List

from app.services.encoding_fix import fix_csv_encoding
from app.services.coords_loader import load_borehole_coords
from app.services.interpolate import interpolate_field
from app.services.pressure_index import compute_borehole_index, interpolate_index


def run_pipeline(data_dir: Path, field: str, method: str, grid_size: int, fix_encoding: bool = True) -> Dict:
    if fix_encoding:
        files = sorted([p for p in data_dir.glob("*.csv") if p.is_file()])
        fix_results = [fix_csv_encoding(p) for p in files]
    else:
        fix_results = []

    coord_path = data_dir / "zuobiao.csv"
    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])

    interpolation = interpolate_field(files=files, coords=coords, field=field, method=method, grid_size=grid_size)
    base = compute_borehole_index(files=files, coords=coords)
    grid = interpolate_index(items=base.get("items", []), method=method, grid_size=grid_size)

    return {
        "field": field,
        "method": method,
        "grid_size": grid_size,
        "fix_results": fix_results,
        "interpolation": interpolation,
        "index": {
            "base": base,
            "grid": grid,
        },
    }