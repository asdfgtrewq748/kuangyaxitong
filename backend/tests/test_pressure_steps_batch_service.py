from pathlib import Path

import pandas as pd
import pytest

from app.services import pressure_steps_batch


def test_thickness_weighted_mean_and_total_thickness():
    df = pd.DataFrame(
        {
            "thickness": [10, 20, 0],
            "density": [2.0, 3.0, 9.0],
        }
    )

    mean = pressure_steps_batch._thickness_weighted_mean(df, "density")
    total = pressure_steps_batch._total_thickness(df)

    assert mean == pytest.approx((2.0 * 10 + 3.0 * 20) / 30)
    assert total == 30.0


def test_thickness_weighted_mean_returns_none_without_valid_data():
    df = pd.DataFrame({"thickness": [0, 0], "density": [1.0, 2.0]})
    assert pressure_steps_batch._thickness_weighted_mean(df, "density") is None
    assert pressure_steps_batch._thickness_weighted_mean(df, "missing") is None


def test_total_thickness_returns_none_without_thickness_column():
    df = pd.DataFrame({"x": [1, 2]})
    assert pressure_steps_batch._total_thickness(df) is None


def test_compute_pressure_steps_boreholes_density_mode_and_coords(monkeypatch):
    f1 = Path("bh1.csv")
    f2 = Path("bh2.csv")

    df1 = pd.DataFrame(
        {
            "thickness": [10.0, 20.0],
            "density": [2.0, 3.0],
            "tensile_strength": [1.0, None],
            "shear_strength": [None, 6.0],
        }
    )
    df2 = pd.DataFrame(
        {
            "thickness": [0.0, 0.0],
            "density": [4.0, 6.0],
            "tensile_strength": [None, None],
            "shear_strength": [None, None],
        }
    )

    seen_calls = []

    def fake_read_csv(path):
        return df1.copy() if path == f1 else df2.copy()

    monkeypatch.setattr(pressure_steps_batch, "read_csv_robust", fake_read_csv)
    monkeypatch.setattr(pressure_steps_batch, "normalize_borehole_df", lambda df: df)
    monkeypatch.setattr(pressure_steps_batch, "add_depth_columns", lambda df: df)
    monkeypatch.setattr(pressure_steps_batch, "fill_missing_by_lithology", lambda df, avg: df)
    monkeypatch.setattr(pressure_steps_batch, "compute_lithology_averages", lambda files: [{"name": "sand"}])

    def fake_compute_pressure_steps(model, h, q, t, s):
        seen_calls.append((model, h, q, t, s))
        return {"model": model, "initial_step": 1.23}

    monkeypatch.setattr(pressure_steps_batch, "compute_pressure_steps", fake_compute_pressure_steps)

    result = pressure_steps_batch.compute_pressure_steps_boreholes(
        files=[f1, f2],
        model="fixed",
        q_mode="density_thickness",
        default_q=5.0,
        coords={"bh1": {"x": 1, "y": 2}},
    )

    assert result["model"] == "fixed"
    assert len(result["items"]) == 2

    first = result["items"][0]
    assert first["borehole"] == "bh1"
    assert first["h"] == 30.0
    assert first["q"] == pytest.approx(80.0)
    assert first["t"] == 1.0
    assert first["s"] == 6.0
    assert first["x"] == 1
    assert first["y"] == 2

    second = result["items"][1]
    assert second["borehole"] == "bh2"
    assert second["h"] == 0.0
    assert second["q"] == 5.0
    assert "x" not in second
    assert "y" not in second

    assert seen_calls[0][0] == "fixed"
    assert seen_calls[1][0] == "fixed"


def test_compute_pressure_steps_boreholes_default_q_when_q_mode_not_density(monkeypatch):
    f1 = Path("bh.csv")
    df = pd.DataFrame({"thickness": [10.0], "density": [2.0]})

    monkeypatch.setattr(pressure_steps_batch, "read_csv_robust", lambda path: df.copy())
    monkeypatch.setattr(pressure_steps_batch, "normalize_borehole_df", lambda d: d)
    monkeypatch.setattr(pressure_steps_batch, "add_depth_columns", lambda d: d)
    monkeypatch.setattr(pressure_steps_batch, "fill_missing_by_lithology", lambda d, avg: d)
    monkeypatch.setattr(pressure_steps_batch, "compute_lithology_averages", lambda files: [])
    monkeypatch.setattr(pressure_steps_batch, "compute_pressure_steps", lambda **kwargs: {"ok": True, **kwargs})

    result = pressure_steps_batch.compute_pressure_steps_boreholes(
        files=[f1],
        model="empirical",
        q_mode="manual",
        default_q=9.9,
    )

    assert len(result["items"]) == 1
    assert result["items"][0]["q"] == 9.9
