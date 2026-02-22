import asyncio
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from app.services import pressure_index


def test_normalize_weights_non_positive_total():
    # total == 0 should fallback to defaults
    result = pressure_index.normalize_weights({"a": 1.0, "b": -1.0, "c": None})
    assert result == pressure_index.DEFAULT_WEIGHTS


def test_compute_borehole_index_skips_empty_weight_sum(monkeypatch):
    files = [Path("bh1.csv"), Path("bh2.csv")]
    coords = {"bh1": {"x": 1, "y": 2}, "bh2": {"x": 3, "y": 4}}

    df = pd.DataFrame({"thickness": [0.0], "elastic_modulus": [1.0], "density": [2.0], "tensile_strength": [3.0]})
    monkeypatch.setattr(pressure_index, "compute_lithology_averages", lambda files: [])
    monkeypatch.setattr(pressure_index, "read_csv_robust", lambda p: df.copy())
    monkeypatch.setattr(pressure_index, "normalize_borehole_df", lambda d: d)
    monkeypatch.setattr(pressure_index, "add_depth_columns", lambda d: d)
    monkeypatch.setattr(pressure_index, "fill_missing_by_lithology", lambda d, avg: d)

    result = pressure_index.compute_borehole_index(files=files, coords=coords)
    assert result["items"] == []
    assert result["missing_coords"] == []


def test_interpolate_index_error_propagation(monkeypatch):
    items = [{"x": 1.0, "y": 2.0, "index": 5.0}, {"x": 2.0, "y": 3.0, "index": 6.0}, {"x": 3.0, "y": 4.0, "index": 7.0}]
    monkeypatch.setattr(pressure_index, "interpolate_from_points", lambda **kwargs: {"error": "bad"})
    assert pressure_index.interpolate_index(items=items, method="idw", grid_size=8) == {"error": "bad"}


def test_to_float_and_build_point_from_overburden():
    assert pressure_index._to_float("1.25") == 1.25
    assert pressure_index._to_float("bad") is None

    # invalid coordinates
    assert pressure_index._build_point_from_overburden({"x": None, "y": 2}, seam_name="S1") is None

    borehole = {
        "name": "BH01",
        "x": "1",
        "y": "2",
        "seam_top_depth": "100",
        "layers": [
            "skip",
            {"name": "L1", "thickness": "10", "density": "2.3", "cohesion": "0.7"},
            {"name": "L2", "thickness": "0"},  # ignored
            {"name": "S1", "thickness": "3", "z_bottom": None},
        ],
    }
    point = pressure_index._build_point_from_overburden(borehole, seam_name="S1")
    assert point is not None
    assert point.x == 1.0 and point.y == 2.0
    assert point.thickness == 3.0
    assert point.z_bottom == 103.0  # seam_top + seam_thickness fallback
    assert len(point.strata) == 1
    assert point.strata[0].name == "L1"


def test_calculate_pressure_index_grid_branches(monkeypatch):
    async def _run_not_enough():
        with pytest.raises(ValueError):
            await pressure_index.calculate_pressure_index_grid(seam_name="S1", resolution=20, points=[{"x": 1, "y": 2, "layers": []}])

    monkeypatch.setattr(pressure_index, "_build_point_from_overburden", lambda borehole, seam_name: None)
    asyncio.run(_run_not_enough())

    def _point_builder(borehole, seam_name):
        return pressure_index.PointData(
            x=float(borehole["x"]),
            y=float(borehole["y"]),
            borehole="B",
            thickness=1.0,
            burial_depth=100.0,
            z_top=100.0,
            z_bottom=101.0,
            strata=[],
        )

    monkeypatch.setattr(pressure_index, "_build_point_from_overburden", _point_builder)
    monkeypatch.setattr(pressure_index, "calc_all_indicators", lambda point: {"mpi": 12.5})
    monkeypatch.setattr(pressure_index, "interpolate_from_points", lambda **kwargs: {"error": "interp error"})

    async def _run_interp_error():
        pts = [{"x": 1, "y": 1}, {"x": 2, "y": 2}, {"x": 3, "y": 3}]
        with pytest.raises(RuntimeError):
            await pressure_index.calculate_pressure_index_grid(seam_name="S1", resolution=5, points=pts)

    asyncio.run(_run_interp_error())

    captured = {}

    def _interp_ok(**kwargs):
        captured["grid_size"] = kwargs["grid_size"]
        return {"grid": np.array([[1.0, 2.0], [3.0, 4.0]]), "bounds": {"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1}}

    monkeypatch.setattr(pressure_index, "interpolate_from_points", _interp_ok)

    async def _run_success():
        pts = [{"x": 1, "y": 1}, {"x": 2, "y": 2}, {"x": 3, "y": 3}, "skip"]
        grid = await pressure_index.calculate_pressure_index_grid(seam_name="S1", resolution=5, points=pts)
        assert grid == [[1.0, 2.0], [3.0, 4.0]]
        assert captured["grid_size"] == 10  # max(10, resolution)

    asyncio.run(_run_success())

    # cover branch where grid doesn't expose tolist
    monkeypatch.setattr(
        pressure_index,
        "interpolate_from_points",
        lambda **kwargs: {"grid": [[9.0]], "bounds": {"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1}},
    )

    async def _run_list_grid():
        pts = [{"x": 1, "y": 1}, {"x": 2, "y": 2}, {"x": 3, "y": 3}]
        grid = await pressure_index.calculate_pressure_index_grid(seam_name="S1", resolution=12, points=pts)
        assert grid == [[9.0]]

    asyncio.run(_run_list_grid())
