import asyncio
from pathlib import Path

import numpy as np

from app.services import seam_interpolate


def test_interpolate_seam_property_rejects_invalid_property():
    result = seam_interpolate.interpolate_seam_property(
        files=[],
        coords={},
        seam_name="S1",
        property="invalid",
    )
    assert "Invalid property" in result["error"]


def test_interpolate_seam_property_rejects_insufficient_seam_points(monkeypatch):
    monkeypatch.setattr(
        seam_interpolate,
        "get_coal_seam_data",
        lambda files, coords, seam_name: {"point_count": 2, "points": []},
    )

    result = seam_interpolate.interpolate_seam_property(
        files=[],
        coords={},
        seam_name="S1",
        property="thickness",
    )
    assert "Not enough data points" in result["error"]
    assert result["point_count"] == 2


def test_interpolate_seam_property_rejects_when_valid_points_less_than_three(monkeypatch):
    monkeypatch.setattr(
        seam_interpolate,
        "get_coal_seam_data",
        lambda files, coords, seam_name: {
            "point_count": 4,
            "points": [
                {"x": 0, "y": 0, "thickness": 1},
                {"x": 1, "y": 1, "thickness": None},
                {"x": None, "y": 2, "thickness": 3},
            ],
        },
    )

    result = seam_interpolate.interpolate_seam_property(
        files=[],
        coords={},
        seam_name="S1",
        property="thickness",
    )
    assert result == {"error": "Not enough valid points for interpolation"}


def test_interpolate_seam_property_propagates_interpolation_error(monkeypatch):
    monkeypatch.setattr(
        seam_interpolate,
        "get_coal_seam_data",
        lambda files, coords, seam_name: {
            "point_count": 3,
            "points": [
                {"x": 0, "y": 0, "thickness": 1},
                {"x": 1, "y": 1, "thickness": 2},
                {"x": 2, "y": 2, "thickness": 3},
            ],
        },
    )
    monkeypatch.setattr(seam_interpolate, "interpolate_from_points", lambda **kwargs: {"error": "interp failed"})

    result = seam_interpolate.interpolate_seam_property(
        files=[],
        coords={},
        seam_name="S1",
        property="thickness",
    )
    assert result == {"error": "interp failed"}


def test_interpolate_seam_property_success_without_contours(monkeypatch):
    monkeypatch.setattr(
        seam_interpolate,
        "get_coal_seam_data",
        lambda files, coords, seam_name: {
            "point_count": 4,
            "points": [
                {"x": 0, "y": 0, "thickness": 1},
                {"x": 1, "y": 1, "thickness": 2},
                {"x": 2, "y": 2, "thickness": 3},
                {"x": 3, "y": 3, "thickness": 4},
            ],
        },
    )
    monkeypatch.setattr(
        seam_interpolate,
        "interpolate_from_points",
        lambda **kwargs: {"grid": np.array([[1.0, 2.0], [3.0, 4.0]]), "bounds": {"min_x": 0, "max_x": 3, "min_y": 0, "max_y": 3}},
    )

    result = seam_interpolate.interpolate_seam_property(
        files=[],
        coords={},
        seam_name="S1",
        property="thickness",
        include_contours=False,
    )

    assert result["seam_name"] == "S1"
    assert result["property"] == "thickness"
    assert result["point_count"] == 4
    assert result["values"] == [[1.0, 2.0], [3.0, 4.0]]
    assert "contours" not in result
    assert result["stats"]["min"] == 1.0
    assert result["stats"]["max"] == 4.0


def test_interpolate_seam_property_success_with_contours(monkeypatch):
    monkeypatch.setattr(
        seam_interpolate,
        "get_coal_seam_data",
        lambda files, coords, seam_name: {
            "point_count": 3,
            "points": [
                {"x": 0, "y": 0, "burial_depth": 10},
                {"x": 1, "y": 1, "burial_depth": 20},
                {"x": 2, "y": 2, "burial_depth": 30},
            ],
        },
    )
    monkeypatch.setattr(
        seam_interpolate,
        "interpolate_from_points",
        lambda **kwargs: {"grid": np.array([[1.0]]), "bounds": {"min_x": 0, "max_x": 2, "min_y": 0, "max_y": 2}},
    )
    monkeypatch.setattr(seam_interpolate, "generate_contours_simplified", lambda **kwargs: {"lines": [1, 2]})

    result = seam_interpolate.interpolate_seam_property(
        files=[],
        coords={},
        seam_name="S1",
        property="burial_depth",
        include_contours=True,
    )
    assert result["contours"] == {"lines": [1, 2]}


def test_interpolate_seam_with_overburden_aggregates_results(monkeypatch):
    monkeypatch.setattr(seam_interpolate, "get_seam_stats", lambda files, coords, seam_name: {"count": 5})

    def fake_interpolate(**kwargs):
        prop = kwargs["property"]
        return {"property": prop, "ok": True}

    monkeypatch.setattr(seam_interpolate, "interpolate_seam_property", fake_interpolate)
    monkeypatch.setattr(seam_interpolate, "get_overburden_lithology", lambda files, coords, seam_name: {"layers": []})

    result = seam_interpolate.interpolate_seam_with_overburden(
        files=[],
        coords={},
        seam_name="S1",
    )

    assert result["stats"] == {"count": 5}
    assert result["thickness"] == {"property": "thickness", "ok": True}
    assert result["burial_depth"] == {"property": "burial_depth", "ok": True}
    assert result["overburden"] == {"layers": []}


def test_compare_interpolation_methods_for_seam_recommends_lowest_cv(monkeypatch):
    def fake_interpolate(**kwargs):
        method = kwargs["method"]
        stats_map = {
            "kriging": {"mean": 10.0, "std": 5.0},
            "idw": {"mean": 10.0, "std": 1.0},
            "linear": {"mean": 10.0, "std": 2.0},
            "nearest": {"mean": 10.0, "std": 3.0},
        }
        return {"method": method, "stats": stats_map[method]}

    monkeypatch.setattr(seam_interpolate, "interpolate_seam_property", fake_interpolate)

    result = seam_interpolate.compare_interpolation_methods_for_seam(
        files=[],
        coords={},
        seam_name="S1",
        property="thickness",
    )
    assert result["recommended"] == "idw"
    assert set(result["results"].keys()) == {"kriging", "idw", "linear", "nearest"}


def test_get_seam_overburden_handles_missing_data_dir(monkeypatch, tmp_path):
    missing_dir = tmp_path / "missing"
    monkeypatch.setattr(seam_interpolate, "get_data_dir", lambda: missing_dir)

    result = asyncio.run(seam_interpolate.get_seam_overburden("S1"))
    assert result == {"seam_name": "S1", "boreholes": [], "borehole_count": 0}


def test_get_seam_overburden_handles_missing_coord_file(monkeypatch, tmp_path):
    data_dir = tmp_path / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    monkeypatch.setattr(seam_interpolate, "get_data_dir", lambda: data_dir)

    result = asyncio.run(seam_interpolate.get_seam_overburden("S1"))
    assert result == {"seam_name": "S1", "boreholes": [], "borehole_count": 0}


def test_get_seam_overburden_success(monkeypatch, tmp_path):
    data_dir = tmp_path / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    (data_dir / "zuobiao.csv").write_text("id,x,y\na,1,2\n", encoding="utf-8")
    (data_dir / "a.csv").write_text("dummy", encoding="utf-8")
    (data_dir / "b.csv").write_text("dummy", encoding="utf-8")

    monkeypatch.setattr(seam_interpolate, "get_data_dir", lambda: data_dir)
    monkeypatch.setattr(seam_interpolate, "load_borehole_coords", lambda path: {"a": {"x": 1, "y": 2}})

    captured = {}

    def fake_get_overburden(files, coords, seam_name):
        captured["files"] = [p.name for p in files]
        captured["coords"] = coords
        captured["seam_name"] = seam_name
        return {"ok": True}

    monkeypatch.setattr(seam_interpolate, "get_overburden_lithology", fake_get_overburden)

    result = asyncio.run(seam_interpolate.get_seam_overburden("S1"))

    assert result == {"ok": True}
    assert captured["files"] == ["a.csv", "b.csv"]
    assert captured["coords"] == {"a": {"x": 1, "y": 2}}
    assert captured["seam_name"] == "S1"
