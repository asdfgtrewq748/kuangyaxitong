from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from app.services import interpolate


def test_thickness_weighted_mean_edge_cases():
    df = pd.DataFrame({"thickness": [0, 0], "value": [1, 2]})
    assert interpolate._thickness_weighted_mean(df, "value") is None
    assert interpolate._thickness_weighted_mean(df, "missing") is None


def test_compute_points_values(monkeypatch):
    files = [Path("bh1.csv"), Path("bh2.csv"), Path("bh3.csv")]
    coords = {"bh1": {"x": 1.0, "y": 2.0}, "bh2": {"x": 3.0, "y": 4.0}}

    df1 = pd.DataFrame({"thickness": [10.0], "density": [2.0]})
    df2 = pd.DataFrame({"thickness": [0.0], "density": [2.0]})

    def _read(path):
        return df1.copy() if path.name == "bh1.csv" else df2.copy()

    monkeypatch.setattr(interpolate, "compute_lithology_averages", lambda files: [{"name": "A"}])
    monkeypatch.setattr(interpolate, "read_csv_robust", _read)
    monkeypatch.setattr(interpolate, "normalize_borehole_df", lambda df: df)
    monkeypatch.setattr(interpolate, "add_depth_columns", lambda df: df)
    monkeypatch.setattr(interpolate, "fill_missing_by_lithology", lambda df, avg: df)

    result = interpolate.compute_points_values(files=files, coords=coords, field="density")
    assert result["points"] == [(1.0, 2.0)]
    assert result["values"] == [2.0]
    assert result["missing_coords"] == ["bh3"]


def test_kriging_interpolate_requirements_and_nan_fill(monkeypatch):
    x = np.array([0.0, 1.0, 2.0])
    y = np.array([0.0, 1.0, 2.0])
    v = np.array([1.0, 2.0, 3.0])
    grid_x = np.array([0.0, 1.0])
    grid_y = np.array([0.0, 1.0])

    monkeypatch.setattr(interpolate, "OrdinaryKriging", None)
    with pytest.raises(RuntimeError):
        interpolate._kriging_interpolate(x, y, v, grid_x, grid_y)

    class _OK:
        def __init__(self, *args, **kwargs):
            pass

        def execute(self, mode, gx, gy):
            return np.array([[1.0, np.nan], [2.0, 3.0]]), None

    monkeypatch.setattr(interpolate, "OrdinaryKriging", _OK)
    out = interpolate._kriging_interpolate(x, y, v, grid_x, grid_y)
    assert np.isfinite(out).all()


def test_interpolate_from_points_dependency_errors_and_bounds(monkeypatch):
    points = np.array([[0.0, 0.0], [1.0, 1.0], [2.0, 2.0]])
    values = np.array([1.0, 2.0, 3.0])
    bounds = {"min_x": 10, "max_x": 20, "min_y": 30, "max_y": 40}

    monkeypatch.setattr(interpolate, "OrdinaryKriging", None)
    kriging = interpolate.interpolate_from_points(points=points, values=values, method="kriging", grid_size=5, bounds=bounds)
    assert "pykrige is required" in kriging["error"]
    assert "bounds" not in kriging

    monkeypatch.setattr(interpolate, "griddata", None)
    linear = interpolate.interpolate_from_points(points=points, values=values, method="linear", grid_size=5, bounds=bounds)
    assert "scipy is required" in linear["error"]

    # Unknown method branch.
    invalid = interpolate.interpolate_from_points(points=points, values=values, method="unknown", grid_size=5, bounds=bounds)
    assert invalid == {"error": "unknown method"}


def test_interpolate_field_branches(monkeypatch):
    monkeypatch.setattr(
        interpolate,
        "compute_points_values",
        lambda **kwargs: {"points": [(1, 2), (2, 3)], "values": [1.0, 2.0], "missing_coords": ["m1"]},
    )
    low = interpolate.interpolate_field(files=[], coords={}, field="density", method="idw", grid_size=8)
    assert low["error"] == "not enough points for interpolation"
    assert low["missing_coords"] == ["m1"]

    monkeypatch.setattr(
        interpolate,
        "compute_points_values",
        lambda **kwargs: {"points": [(1, 2), (2, 3), (3, 4)], "values": [1.0, 2.0, 3.0], "missing_coords": []},
    )
    monkeypatch.setattr(interpolate, "interpolate_from_points", lambda **kwargs: {"error": "interp failed"})
    err = interpolate.interpolate_field(files=[], coords={}, field="density", method="idw", grid_size=8)
    assert err == {"error": "interp failed"}

    monkeypatch.setattr(
        interpolate,
        "interpolate_from_points",
        lambda **kwargs: {"grid": np.array([[1.0, 2.0], [3.0, 4.0]]), "bounds": {"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1}},
    )
    ok = interpolate.interpolate_field(files=[], coords={}, field="density", method="idw", grid_size=8)
    assert ok["field"] == "density"
    assert ok["method"] == "idw"
    assert ok["point_count"] == 3
    assert ok["values"] == [[1.0, 2.0], [3.0, 4.0]]
