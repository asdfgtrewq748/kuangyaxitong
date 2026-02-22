import base64

import numpy as np
import pytest

from app.services import contour_generator


def test_calculate_optimal_levels_handles_nan_and_constant_grid():
    nan_grid = np.array([[np.nan, np.nan], [np.nan, np.nan]])
    assert contour_generator.calculate_optimal_levels(nan_grid) == []

    constant = np.array([[3.0, 3.0], [3.0, 3.0]])
    assert contour_generator.calculate_optimal_levels(constant) == [3.0]


def test_calculate_optimal_levels_methods_and_fallback():
    grid = np.array([[1.0, 2.0], [3.0, 4.0]])

    levels_equal = contour_generator.calculate_optimal_levels(grid, method="equal", num_levels=4)
    levels_quantile = contour_generator.calculate_optimal_levels(grid, method="quantile", num_levels=4)
    levels_natural = contour_generator.calculate_optimal_levels(grid, method="natural", num_levels=4)
    levels_unknown = contour_generator.calculate_optimal_levels(grid, method="whatever", num_levels=4)

    assert len(levels_equal) == 4
    assert len(levels_quantile) == 4
    assert levels_natural == levels_quantile
    assert levels_unknown == levels_equal


def test_get_contour_color_and_label():
    assert contour_generator.get_contour_color(1.0, []) == "#3b82f6"

    color = contour_generator.get_contour_color(2.0, [2.0, 2.0])
    assert color.startswith("#") and len(color) == 7

    label = contour_generator.format_contour_label(12.3456, bounds={}, precision=1)
    assert label == "12.3m"


def test_smooth_contour_path_basic_and_exception(monkeypatch):
    short_path = [[0.0, 0.0], [1.0, 1.0]]
    assert contour_generator.smooth_contour_path(short_path, n_points=50) == short_path

    def fake_splprep(args, **kwargs):
        return "tck", np.array([0.0, 1.0])

    def fake_splev(tck, u_new):
        return np.asarray(u_new), np.asarray(u_new) * 0.5

    monkeypatch.setattr(contour_generator, "splprep", fake_splprep)
    monkeypatch.setattr(contour_generator, "splev", fake_splev)

    open_path = [[0.0, 0.0], [1.0, 0.5], [2.0, 0.0]]
    smoothed = contour_generator.smooth_contour_path(open_path, n_points=25)
    assert len(smoothed) == 25

    closed_path = [[0.0, 0.0], [1.0, 0.0], [0.5, 0.5], [0.0, 0.0]]
    smoothed_closed = contour_generator.smooth_contour_path(closed_path, n_points=30)
    assert len(smoothed_closed) == 30

    monkeypatch.setattr(contour_generator, "splprep", lambda *args, **kwargs: (_ for _ in ()).throw(RuntimeError("x")))
    fallback = contour_generator.smooth_contour_path(open_path, n_points=20)
    assert fallback == open_path


def test_simplify_path_keeps_first_last_and_filters_close_points():
    path = [[0, 0], [0.2, 0.2], [2.0, 2.0], [2.1, 2.1], [5.0, 5.0]]
    simplified = contour_generator.simplify_path(path, tolerance=1.0)
    assert simplified[0] == [0, 0]
    assert simplified[-1] == [5.0, 5.0]
    assert [2.0, 2.0] in simplified
    assert len(simplified) < len(path)


def test_generate_contours_no_valid_levels():
    grid = np.array([[np.nan, np.nan], [np.nan, np.nan]])
    bounds = {"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1}
    result = contour_generator.generate_contours(grid, bounds, levels=None, num_levels=4)
    assert result["contours"] == []
    assert result["error"] == "no valid levels"


def test_generate_contours_success_and_structure():
    grid = np.array(
        [
            [1.0, 1.5, 2.0],
            [1.5, 2.0, 2.5],
            [2.0, 2.5, 3.0],
        ]
    )
    bounds = {"min_x": 10, "max_x": 20, "min_y": 30, "max_y": 40}
    result = contour_generator.generate_contours(grid, bounds, levels=[2.0], num_levels=1)

    assert "contours" in result
    assert "value_range" in result
    assert result["levels"] == [2.0]
    assert result["value_range"]["min"] == 1.0
    assert result["value_range"]["max"] == 3.0


def test_generate_contours_simplified_filters_invalid_paths(monkeypatch):
    monkeypatch.setattr(
        contour_generator,
        "generate_contours",
        lambda *args, **kwargs: {
            "contours": [
                {"level": 1.0, "paths": [[[0, 0], [0.1, 0.1], [2, 2]], [[5, 5]]], "color": "#000", "label": "1.0m"}
            ],
            "value_range": {"min": 0.0, "max": 2.0},
        },
    )

    result = contour_generator.generate_contours_simplified(
        grid=np.array([[1.0, 2.0], [2.0, 3.0]]),
        bounds={"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1},
        simplify_tolerance=0.5,
    )
    assert len(result["contours"]) == 1
    assert len(result["contours"][0]["paths"]) == 1


def test_create_filled_contours_returns_regions():
    grid = np.array(
        [
            [1.0, 2.0, 3.0],
            [2.0, 3.0, 4.0],
            [3.0, 4.0, 5.0],
        ]
    )
    bounds = {"min_x": 0, "max_x": 2, "min_y": 0, "max_y": 2}
    result = contour_generator.create_filled_contours(grid, bounds, levels=[3.0], num_levels=1)
    assert "regions" in result
    assert isinstance(result["regions"], list)
    if result["regions"]:
        assert "polygon" in result["regions"][0]
        assert "color" in result["regions"][0]


def test_generate_matplotlib_contour_image_success():
    grid = np.array(
        [
            [1.0, 2.0, 3.0],
            [2.0, 3.0, 4.0],
            [3.0, 4.0, 5.0],
        ]
    )
    bounds = {"min_x": 0, "max_x": 2, "min_y": 0, "max_y": 2}

    result = contour_generator.generate_matplotlib_contour_image(
        grid=grid,
        bounds=bounds,
        title="T",
        property_name="P",
        levels=[2.0, 3.0, 4.0],
        num_levels=3,
        dpi=80,
        smooth_sigma=0.0,
        colormap=["#000000", "#ffffff"],
    )

    assert result["format"] == "png"
    assert result["value_range"]["min"] == 1.0
    assert result["value_range"]["max"] == 5.0
    assert isinstance(result["image"], str)
    assert len(result["image"]) > 100
    # Ensure valid base64 payload.
    base64.b64decode(result["image"])


def test_generate_dual_contour_images_aggregates_calls(monkeypatch):
    calls = []

    def fake_generate(*args, **kwargs):
        calls.append(kwargs["colormap"])
        return {"image": "x", "format": "png", "value_range": {"min": 0, "max": 1}}

    monkeypatch.setattr(contour_generator, "generate_matplotlib_contour_image", fake_generate)

    result = contour_generator.generate_dual_contour_images(
        thickness_grid=np.array([[1.0, 2.0], [2.0, 3.0]]),
        depth_grid=np.array([[10.0, 20.0], [20.0, 30.0]]),
        bounds={"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1},
        seam_name="S1",
    )

    assert "thickness" in result
    assert "depth" in result
    assert calls == ["YlOrBr", "viridis"]
