import asyncio

import pytest
from fastapi import HTTPException

from app.routes import scene3d


def test_generate_layer_vertices_with_padding_and_depth():
    bounds = {"min_x": 10.0, "max_x": 20.0, "min_y": 30.0, "max_y": 40.0}
    vertices = scene3d._generate_layer_vertices(bounds, thickness=6.0, depth_top=100.0)

    assert len(vertices) == 4
    assert vertices[0] == [9.9, 29.9, 103.0]
    assert vertices[2] == [20.1, 40.1, 103.0]


def test_generate_borehole_cylinder_geometry_counts():
    geometry = scene3d._generate_borehole_cylinder(
        x=0.0,
        y=0.0,
        z_top=10.0,
        z_bottom=20.0,
        radius=1.0,
        segments=8,
    )
    assert len(geometry["vertices"]) == 16
    assert len(geometry["faces"]) == 14


def test_get_indicator_color_scale_known_and_unknown():
    assert scene3d._get_indicator_color_scale("mpi")["low"] == "#22c55e"
    assert scene3d._get_indicator_color_scale("unknown") == scene3d._get_indicator_color_scale("mpi")


def test_get_layer_color_is_deterministic():
    assert scene3d._get_layer_color("LayerA") == scene3d._get_layer_color("LayerA")
    assert scene3d._get_layer_color("LayerA") != ""


def test_get_scene_3d_data_not_found(monkeypatch, tmp_path):
    monkeypatch.setattr("app.core.config.get_data_dir", lambda: tmp_path)
    monkeypatch.setattr("app.services.coal_seam_parser.get_coal_seam_data", lambda seam_name, data_dir: None)

    with pytest.raises(HTTPException) as exc:
        asyncio.run(scene3d.get_scene_3d_data(seam_name="S1", indicator="mpi", resolution=50))
    assert exc.value.status_code == 404
    assert "Seam not found" in exc.value.detail


def test_get_scene_3d_data_no_boreholes(monkeypatch, tmp_path):
    monkeypatch.setattr("app.core.config.get_data_dir", lambda: tmp_path)
    monkeypatch.setattr(
        "app.services.coal_seam_parser.get_coal_seam_data",
        lambda seam_name, data_dir: {"boreholes": []},
    )

    with pytest.raises(HTTPException) as exc:
        asyncio.run(scene3d.get_scene_3d_data(seam_name="S1", indicator="mpi", resolution=50))
    assert exc.value.status_code == 404
    assert "No borehole data found" == exc.value.detail


def test_get_scene_3d_data_success(monkeypatch, tmp_path):
    monkeypatch.setattr("app.core.config.get_data_dir", lambda: tmp_path)
    monkeypatch.setattr(
        "app.services.coal_seam_parser.get_coal_seam_data",
        lambda seam_name, data_dir: {
            "boreholes": [
                {
                    "name": "BH01",
                    "x": 100.0,
                    "y": 200.0,
                    "total_thickness": 20.0,
                    "layers": {"L1": 10.0, "L2": 5.0},
                },
                {
                    "name": "BH02",
                    "x": 120.0,
                    "y": 180.0,
                    "total_thickness": 30.0,
                    "layers": {"L1": 12.0},
                },
            ]
        },
    )

    result = asyncio.run(scene3d.get_scene_3d_data(seam_name="S1", indicator="mpi", resolution=40))

    assert result.bounds == {"min_x": 100.0, "max_x": 120.0, "min_y": 180.0, "max_y": 200.0}
    assert len(result.layers) == 2
    assert len(result.boreholes) == 2
    assert result.stats["borehole_count"] == 2
    assert result.stats["layer_count"] == 2
    assert result.indicator is not None
    assert result.indicator.indicator == "mpi"
    assert len(result.indicator.grid) == 40
    assert len(result.indicator.grid[0]) == 40


def test_get_scene_3d_data_without_indicator(monkeypatch, tmp_path):
    monkeypatch.setattr("app.core.config.get_data_dir", lambda: tmp_path)
    monkeypatch.setattr(
        "app.services.coal_seam_parser.get_coal_seam_data",
        lambda seam_name, data_dir: {
            "boreholes": [
                {
                    "name": "BH01",
                    "x": 100.0,
                    "y": 200.0,
                    "total_thickness": 20.0,
                    "layers": {"L1": 10.0},
                }
            ]
        },
    )

    result = asyncio.run(scene3d.get_scene_3d_data(seam_name="S1", indicator="", resolution=20))
    assert result.indicator is None


def test_get_scene_3d_data_wraps_unexpected_error(monkeypatch, tmp_path):
    monkeypatch.setattr("app.core.config.get_data_dir", lambda: tmp_path)

    def _raise(*args, **kwargs):
        raise RuntimeError("boom")

    monkeypatch.setattr("app.services.coal_seam_parser.get_coal_seam_data", _raise)

    with pytest.raises(HTTPException) as exc:
        asyncio.run(scene3d.get_scene_3d_data(seam_name="S1", indicator="mpi", resolution=30))
    assert exc.value.status_code == 500
    assert "boom" in exc.value.detail


def test_get_indicator_3d_endpoint_function():
    result = asyncio.run(scene3d.get_indicator_3d(indicator="rsi", seam_name="S1", resolution=64))
    assert result["indicator"] == "rsi"
    assert result["seam_name"] == "S1"
    assert result["resolution"] == 64
    assert result["grid_size"] == 64
    assert "color_scale" in result
