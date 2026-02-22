from pathlib import Path

import pandas as pd

from app.services import coal_seam_parser as csp


def _coal_marker() -> str:
    # Pull marker from function constants to avoid hardcoding locale-specific text.
    for item in csp.is_coal_seam.__code__.co_consts:
        if isinstance(item, str) and item and "seam" not in item.lower():
            return item
    return "COAL"


def test_float_or_none_and_is_coal_seam():
    assert csp._float_or_none("1.5") == 1.5
    assert csp._float_or_none("bad") is None
    assert csp.is_coal_seam("") is False
    assert csp.is_coal_seam(None) is False
    marker = _coal_marker()
    assert csp.is_coal_seam(f"A{marker}B") is True


def test_get_all_coal_seams(monkeypatch):
    files = [Path("bh1.csv"), Path("bh2.csv"), Path("bad.csv")]

    df1 = pd.DataFrame(
        {
            "name": ["coal_a", "stone"],
            "thickness": [3.0, 10.0],
            "z_top": [100.0, 0.0],
            "z_bottom": [103.0, 10.0],
        }
    )
    df2 = pd.DataFrame(
        {
            "name": ["coal_a", "coal_b"],
            "thickness": [4.0, 2.0],
            "z_top": [120.0, 150.0],
            "z_bottom": [124.0, 152.0],
        }
    )

    def _read(path):
        if path.name == "bh1.csv":
            return df1.copy()
        if path.name == "bh2.csv":
            return df2.copy()
        raise ValueError("broken")

    monkeypatch.setattr(csp, "read_csv_robust", _read)
    monkeypatch.setattr(csp, "normalize_borehole_df", lambda df: df)
    monkeypatch.setattr(csp, "add_depth_columns", lambda df: df)
    monkeypatch.setattr(csp, "is_coal_seam", lambda name: str(name).startswith("coal_"))

    result = csp.get_all_coal_seams(
        files,
        coords={"bh1": {"x": 1.0, "y": 2.0}, "bh2": {"x": 3.0, "y": 4.0}},
    )

    assert result["total_boreholes"] == 3
    assert result["unique_seams"] == 2
    assert [item["name"] for item in result["seams"]] == ["coal_a", "coal_b"]
    coal_a = next(item for item in result["seams"] if item["name"] == "coal_a")
    assert coal_a["borehole_count"] == 2
    assert coal_a["thickness_range"]["min"] == 3.0
    assert coal_a["thickness_range"]["max"] == 4.0


def test_get_coal_seam_data(monkeypatch):
    files = [Path("bh1.csv"), Path("bh2.csv"), Path("bh3.csv"), Path("bad.csv")]
    coords = {"bh1": {"x": 1.0, "y": 2.0}, "bh2": {"x": 3.0, "y": 4.0}}

    df1 = pd.DataFrame(
        {
            "name": ["S1", "other"],
            "thickness": [3.0, 9.0],
            "z_top": [100.0, 0.0],
            "z_bottom": [103.0, 9.0],
        }
    )
    df2 = pd.DataFrame(
        {
            "name": ["S1", "S1"],
            "thickness": [5.0, 6.0],
            "z_top": [120.0, 130.0],
            "z_bottom": [125.0, 136.0],
        }
    )
    df3 = pd.DataFrame({"x": [1]})  # no name column

    def _read(path):
        if path.name == "bh1.csv":
            return df1.copy()
        if path.name == "bh2.csv":
            return df2.copy()
        if path.name == "bh3.csv":
            return df3.copy()
        raise RuntimeError("bad file")

    monkeypatch.setattr(csp, "read_csv_robust", _read)
    monkeypatch.setattr(csp, "normalize_borehole_df", lambda df: df)
    monkeypatch.setattr(csp, "add_depth_columns", lambda df: df)

    result = csp.get_coal_seam_data(files, coords, "S1")
    assert result["seam_name"] == "S1"
    assert result["point_count"] == 2
    assert result["missing_coords"] == ["bh3", "bad"]
    assert result["stats"]["thickness"]["min"] == 3.0
    assert result["stats"]["thickness"]["max"] == 5.0
    assert result["stats"]["burial_depth"]["min"] == 100.0


def test_get_overburden_lithology(monkeypatch):
    files = [Path("bh1.csv"), Path("bh2.csv"), Path("bh3.csv")]
    coords = {"bh1": {"x": 1.0, "y": 2.0}, "bh2": {"x": 3.0, "y": 4.0}}

    df1 = pd.DataFrame(
        {
            "name": ["L1", "L2", "S1"],
            "thickness": [10.0, 5.0, 3.0],
            "z_top": [0.0, 10.0, 20.0],
            "z_bottom": [10.0, 15.0, 23.0],
            "tensile_strength": [1.1, 1.2, 1.3],
            "elastic_modulus": [11.0, 12.0, 13.0],
            "compressive_strength": [21.0, 22.0, 23.0],
            "friction_angle": [31.0, 32.0, 33.0],
            "density": [2.1, 2.2, 2.3],
            "cohesion": [0.5, 0.6, 0.7],
        }
    )
    df2 = pd.DataFrame(
        {
            "name": ["S1"],
            "thickness": [2.0],
            "z_top": [None],  # invalid seam z_top, should skip
            "z_bottom": [22.0],
        }
    )
    df3 = pd.DataFrame({"name": ["S1"], "thickness": [1.0], "z_top": [5.0], "z_bottom": [6.0]})

    def _read(path):
        if path.name == "bh1.csv":
            return df1.copy()
        if path.name == "bh2.csv":
            return df2.copy()
        return df3.copy()

    monkeypatch.setattr(csp, "read_csv_robust", _read)
    monkeypatch.setattr(csp, "normalize_borehole_df", lambda df: df)
    monkeypatch.setattr(csp, "add_depth_columns", lambda df: df)
    monkeypatch.setattr(csp, "LITHOLOGY_COLORS", {"L1": "#111111", "L2": "#222222", "S1": "#333333"})

    result = csp.get_overburden_lithology(files, coords, "S1")
    assert result["seam_name"] == "S1"
    assert result["borehole_count"] == 1
    bh = result["boreholes"][0]
    assert bh["name"] == "bh1"
    assert bh["seam_top_depth"] == 20.0
    assert len(bh["layers"]) == 3
    # overburden rows are sorted descending by z_top
    assert bh["layers"][0]["name"] == "L2"
    assert bh["layers"][-1]["name"] == "S1"
    assert bh["layers"][-1]["color"] == "#2C2C2C"
    assert bh["layers"][-1]["elastic_modulus"] == 13.0


def test_get_seam_stats(monkeypatch):
    monkeypatch.setattr(
        csp,
        "get_coal_seam_data",
        lambda files, coords, seam_name: {
            "point_count": 2,
            "stats": {
                "thickness": {"min": 1.0, "max": 2.0},
                "burial_depth": {"min": 100.0, "max": 120.0},
            },
        },
    )
    monkeypatch.setattr(
        csp,
        "get_overburden_lithology",
        lambda files, coords, seam_name: {
            "boreholes": [
                {
                    "layers": [
                        {"name": "A", "thickness": 10.0},
                        {"name": "B", "thickness": 20.0},
                        {"name": seam_name, "thickness": 3.0},
                    ]
                },
                {
                    "layers": [
                        {"name": "A", "thickness": 5.0},
                        {"name": "B", "thickness": 10.0},
                        {"name": seam_name, "thickness": 2.0},
                    ]
                },
            ]
        },
    )
    monkeypatch.setattr(csp, "LITHOLOGY_COLORS", {"A": "#aaaaaa", "B": "#bbbbbb"})

    result = csp.get_seam_stats(files=[], coords={}, seam_name="S1")
    assert result["seam_name"] == "S1"
    assert result["borehole_count"] == 2
    assert result["thickness"]["min"] == 1.0
    assert result["burial_depth"]["max"] == 120.0
    # Seam itself is excluded from lithology summary.
    assert [x["name"] for x in result["lithology_summary"]] == ["B", "A"]
    assert result["lithology_summary"][0]["avg_thickness"] == 15.0
