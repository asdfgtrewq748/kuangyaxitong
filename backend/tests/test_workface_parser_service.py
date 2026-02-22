import json

from app.services.workface_parser import (
    _bounds_from_points,
    _find_col,
    _normalize_bounds,
    _parse_from_json,
    _parse_points,
    parse_workface_file,
)


def test_find_col_is_case_insensitive():
    columns = ["Name", "XMIN", "xmax"]
    assert _find_col(columns, ["name"]) == "Name"
    assert _find_col(columns, ["xmin"]) == "XMIN"
    assert _find_col(columns, ["missing"]) is None


def test_normalize_bounds_swaps_min_and_max():
    bounds = _normalize_bounds({"min_x": 10, "max_x": 1, "min_y": 8, "max_y": 2})
    assert bounds == {"min_x": 1.0, "max_x": 10.0, "min_y": 2.0, "max_y": 8.0}


def test_bounds_from_points():
    bounds = _bounds_from_points([[5, 9], [1, 2], [3, 8]])
    assert bounds == {"min_x": 1.0, "max_x": 5.0, "min_y": 2.0, "max_y": 9.0}


def test_parse_points_handles_string_and_invalid_items():
    value = json.dumps([[1, 2], [3, 4, 5], "bad", [6]])
    points = _parse_points(value)
    assert points == [[1.0, 2.0], [3.0, 4.0]]
    assert _parse_points("   ") == []


def test_parse_workface_file_json_polygon_and_rect():
    content = json.dumps(
        {
            "items": [
                {"title": "Poly1", "points": [[0, 0], [2, 0], [1, 1]]},
                {"name": "Rect1", "bounds": {"min_x": 10, "max_x": 1, "min_y": 5, "max_y": 2}},
                {"xmin": 1, "xmax": 3, "ymin": 4, "ymax": 6},
                "skip",
            ]
        }
    )
    result = parse_workface_file(content, "faces.json")

    assert len(result) == 3
    assert result[0]["type"] == "polygon"
    assert result[1]["bounds"] == {"min_x": 1.0, "max_x": 10.0, "min_y": 2.0, "max_y": 5.0}
    assert result[2]["type"] == "rect"


def test_parse_from_json_supports_faces_key():
    payload = {"faces": [{"name": "A", "points": [[0, 0], [1, 0], [0, 1]]}]}
    result = _parse_from_json(payload)
    assert len(result) == 1
    assert result[0]["name"] == "A"
    assert result[0]["type"] == "polygon"


def test_parse_workface_file_csv_header_with_points_and_rect():
    content = "\n".join(
        [
            "name,points,xmin,xmax,ymin,ymax",
            "P1,\"[[0,0],[2,0],[0,2]]\",,,,",
            "R1,,10,1,8,2",
            "R2,,bad,1,2,3",
        ]
    )
    result = parse_workface_file(content, "faces.csv")

    assert len(result) == 2
    assert result[0]["type"] == "polygon"
    assert result[1]["type"] == "rect"
    assert result[1]["bounds"] == {"min_x": 1.0, "max_x": 10.0, "min_y": 2.0, "max_y": 8.0}


def test_parse_workface_file_with_whitespace_delimiter_without_header():
    content = "\n".join(
        [
            "W1 1 10 2 20",
            "W2 [[0,0],[2,0],[0,2]]",
            "badrow",
        ]
    )
    result = parse_workface_file(content, "faces.txt")

    assert len(result) == 2
    assert result[0]["type"] == "rect"
    assert result[1]["type"] == "polygon"


def test_parse_workface_file_empty_content():
    assert parse_workface_file(" \n\t\n ", "faces.csv") == []
