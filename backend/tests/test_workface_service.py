import pytest

from app.services.workface import _face_index, compute_workface_adjusted_grid


def test_face_index_handles_small_count_and_zero_span():
    assert _face_index(value=10, min_v=0, max_v=100, count=1) == 0
    assert _face_index(value=10, min_v=5, max_v=5, count=4) == 0


def test_face_index_clamps_upper_boundary():
    assert _face_index(value=100, min_v=0, max_v=100, count=4) == 3


def test_compute_workface_adjusted_grid_rejects_empty_grid():
    result = compute_workface_adjusted_grid(grid=[], bounds={"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1})
    assert result == {"error": "empty grid"}


def test_compute_workface_adjusted_grid_x_axis_decrease_ascending():
    grid = [
        [10.0, 10.0, 10.0],
        [10.0, 10.0, 10.0],
    ]
    bounds = {"min_x": 0, "max_x": 2, "min_y": 0, "max_y": 1}

    result = compute_workface_adjusted_grid(
        grid=grid,
        bounds=bounds,
        axis="x",
        count=3,
        direction="ascending",
        mode="decrease",
        decay=0.1,
    )

    assert result["face_map"][0] == [0, 1, 2]
    assert result["adjusted"][0] == pytest.approx([10.0, 9.0, 8.0])


def test_compute_workface_adjusted_grid_y_axis_increase_descending():
    grid = [
        [10.0, 10.0],
        [10.0, 10.0],
        [10.0, 10.0],
    ]
    bounds = {"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 2}

    result = compute_workface_adjusted_grid(
        grid=grid,
        bounds=bounds,
        axis="y",
        count=3,
        direction="descending",
        mode="increase",
        decay=0.1,
    )

    # y increases from top to bottom; descending reverses indices.
    assert [row[0] for row in result["face_map"]] == [2, 1, 0]
    assert [row[0] for row in result["adjusted"]] == pytest.approx([12.0, 11.0, 10.0])
