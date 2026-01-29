from __future__ import annotations

from typing import Dict, List
import io
import csv


def grid_to_csv_bytes(grid: List[List[float]], bounds: Dict) -> bytes:
    rows = len(grid)
    cols = len(grid[0]) if rows else 0
    if rows == 0 or cols == 0:
        return b""

    min_x = bounds["min_x"]
    max_x = bounds["max_x"]
    min_y = bounds["min_y"]
    max_y = bounds["max_y"]

    dx = (max_x - min_x) / (cols - 1) if cols > 1 else 0
    dy = (max_y - min_y) / (rows - 1) if rows > 1 else 0

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["x", "y", "value"])
    for i in range(rows):
        y = min_y + i * dy
        for j in range(cols):
            x = min_x + j * dx
            writer.writerow([x, y, grid[i][j]])

    return buf.getvalue().encode("utf-8")