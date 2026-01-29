from __future__ import annotations

from typing import Dict, List


def _face_index(value: float, min_v: float, max_v: float, count: int) -> int:
    if count <= 1:
        return 0
    span = max_v - min_v
    if span <= 0:
        return 0
    ratio = (value - min_v) / span
    idx = int(ratio * count)
    if idx == count:
        idx = count - 1
    return max(0, min(count - 1, idx))


def compute_workface_adjusted_grid(
    grid: List[List[float]],
    bounds: Dict,
    axis: str = "x",
    count: int = 3,
    direction: str = "ascending",
    mode: str = "decrease",
    decay: float = 0.08,
) -> Dict:
    rows = len(grid)
    cols = len(grid[0]) if rows else 0
    if rows == 0 or cols == 0:
        return {"error": "empty grid"}

    min_x = bounds["min_x"]
    max_x = bounds["max_x"]
    min_y = bounds["min_y"]
    max_y = bounds["max_y"]

    dx = (max_x - min_x) / (cols - 1) if cols > 1 else 0
    dy = (max_y - min_y) / (rows - 1) if rows > 1 else 0

    face_map = [[0 for _ in range(cols)] for _ in range(rows)]
    adjusted = [[0.0 for _ in range(cols)] for _ in range(rows)]

    for i in range(rows):
        y = min_y + i * dy
        for j in range(cols):
            x = min_x + j * dx
            value = x if axis == "x" else y
            min_v = min_x if axis == "x" else min_y
            max_v = max_x if axis == "x" else max_y
            idx = _face_index(value, min_v, max_v, count)
            if direction == "descending":
                idx = (count - 1) - idx
            face_map[i][j] = idx

            if mode == "increase":
                factor = 1 + decay * idx
            else:
                factor = max(0.0, 1 - decay * idx)

            adjusted[i][j] = grid[i][j] * factor

    return {
        "axis": axis,
        "count": count,
        "direction": direction,
        "mode": mode,
        "decay": decay,
        "face_map": face_map,
        "adjusted": adjusted,
    }