from __future__ import annotations

from typing import Dict, List
import numpy as np

from app.services.interpolate import interpolate_from_points


def _rmse(errors: List[float]) -> float:
    arr = np.array(errors, dtype=float)
    return float(np.sqrt(np.mean(arr ** 2))) if arr.size else float("inf")


def evaluate_methods(points: np.ndarray, values: np.ndarray, methods: List[str]) -> Dict:
    results = {}
    for method in methods:
        errors = []
        for i in range(points.shape[0]):
            train_points = np.delete(points, i, axis=0)
            train_values = np.delete(values, i, axis=0)
            target = points[i]

            result = interpolate_from_points(train_points, train_values, method=method, grid_size=10)
            if "error" in result:
                errors = []
                break

            grid = result["grid"]
            bounds = result["bounds"]
            rows = len(grid)
            cols = len(grid[0]) if rows else 0
            if rows == 0 or cols == 0:
                errors = []
                break

            min_x, max_x = bounds["min_x"], bounds["max_x"]
            min_y, max_y = bounds["min_y"], bounds["max_y"]
            dx = (max_x - min_x) / (cols - 1) if cols > 1 else 1
            dy = (max_y - min_y) / (rows - 1) if rows > 1 else 1

            col = int(round((target[0] - min_x) / dx)) if dx else 0
            row = int(round((target[1] - min_y) / dy)) if dy else 0
            row = max(0, min(rows - 1, row))
            col = max(0, min(cols - 1, col))
            pred = grid[row][col]
            errors.append(float(pred - values[i]))

        results[method] = {
            "rmse": _rmse(errors),
            "count": len(errors),
        }

    return results