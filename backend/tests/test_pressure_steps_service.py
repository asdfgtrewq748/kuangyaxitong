import pytest

from app.services.pressure_steps import compute_pressure_steps


def test_compute_pressure_steps_rejects_non_positive_h_or_q():
    result = compute_pressure_steps(model="fixed", h=0, q=1, t=1)
    assert result["error"] == "h and q must be positive"

    result = compute_pressure_steps(model="fixed", h=1, q=-1, t=1)
    assert result["error"] == "h and q must be positive"


def test_compute_pressure_steps_fixed_requires_t():
    result = compute_pressure_steps(model="fixed", h=10, q=2)
    assert result["error"] == "t is required for fixed-end model"


def test_compute_pressure_steps_fixed_model():
    result = compute_pressure_steps(model=" fixed ", h=10, q=2, t=8)
    assert "error" not in result
    assert result["initial_step"] == pytest.approx(28.2842712475)
    assert result["periodic_step"] is None


def test_compute_pressure_steps_simply_supported_model():
    result = compute_pressure_steps(model="simply-supported", h=9, q=3, t=12)
    assert "error" not in result
    assert result["initial_step"] == pytest.approx(20.7846096908)
    assert result["periodic_step"] is None


def test_compute_pressure_steps_shear_requires_s():
    result = compute_pressure_steps(model="shear", h=10, q=5)
    assert result["error"] == "s is required for shear model"


def test_compute_pressure_steps_shear_model():
    result = compute_pressure_steps(model="shear", h=9, q=3, s=6)
    assert "error" not in result
    assert result["initial_step"] == pytest.approx(24.0)
    assert result["periodic_step"] is None


def test_compute_pressure_steps_empirical_model():
    result = compute_pressure_steps(model="empirical", h=18, q=2)
    assert "error" not in result
    assert result["initial_step"] == 18
    assert result["periodic_step"] == (4.5, 9.0)


def test_compute_pressure_steps_unknown_model():
    result = compute_pressure_steps(model="unknown-model", h=10, q=2)
    assert result["error"] == "unknown model"
