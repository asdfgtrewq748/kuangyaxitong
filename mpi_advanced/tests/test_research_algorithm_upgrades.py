from __future__ import annotations

from datetime import datetime
import copy

import numpy as np

from mpi_advanced.core.data_models import GeologyLayer, GeologyLayerType, GeologyModel, MiningParameters
from mpi_advanced.indicators.rsi_phase_field import PhaseFieldFractureModel, RSIIndicatorPhaseField
from mpi_advanced.indicators.asi_indicator_ust import ASIIndicatorUST


def _build_geology(roof_thickness: float = 6.0, support_pressure: float = 0.3e6) -> GeologyModel:
    coal_top = 0.0
    coal_bottom = 3.5
    layers = [
        GeologyLayer(
            name="Coal",
            layer_type=GeologyLayerType.COAL,
            thickness=3.5,
            depth_top=coal_top,
            depth_bottom=coal_bottom,
            elastic_modulus=3e9,
            poisson_ratio=0.30,
            cohesion=2e6,
            friction_angle=20.0,
            tensile_strength=0.8e6,
            fracture_toughness=0.5,
            density=1400,
        ),
        GeologyLayer(
            name="Roof",
            layer_type=GeologyLayerType.SANDSTONE,
            thickness=roof_thickness,
            depth_top=coal_bottom,
            depth_bottom=coal_bottom + roof_thickness,
            elastic_modulus=20e9,
            poisson_ratio=0.25,
            cohesion=6e6,
            friction_angle=32.0,
            tensile_strength=2.5e6,
            fracture_toughness=1.2,
            density=2500,
        ),
    ]
    mining = MiningParameters(
        panel_length=180.0,
        panel_width=140.0,
        mining_height=3.5,
        mining_depth=450.0,
        advance_rate=4.0,
        support_pressure=support_pressure,
    )
    return GeologyModel(layers=layers, mining_params=mining)


def test_phase_field_fd_solver_converges_and_damage_monotonic():
    model = PhaseFieldFractureModel(
        fracture_energy=80.0,
        length_scale=0.5,
        elastic_modulus=18e9,
        poisson_ratio=0.25,
    )

    phi_low, info_low = model.solve_phase_field_2d_fd(load_ratio=0.8, max_iter=500, tol=1e-4)
    phi_high, info_high = model.solve_phase_field_2d_fd(load_ratio=1.4, max_iter=500, tol=1e-4)

    assert info_low["converged"] is True
    assert info_high["converged"] is True
    assert info_low["residual"] <= 1e-4
    assert info_high["residual"] <= 1e-4
    assert phi_low.shape == phi_high.shape

    damage_low = float(np.mean(1 - phi_low))
    damage_high = float(np.mean(1 - phi_high))
    assert damage_high > damage_low

    # Fixed far-field boundary
    assert np.allclose(phi_high[0, :], 1.0)
    assert np.allclose(phi_high[-1, :], 1.0)


def test_rsi_phase_field_reflects_roof_thickness_effect():
    indicator = RSIIndicatorPhaseField(length_scale=0.5)
    thin_roof = _build_geology(roof_thickness=3.0)
    thick_roof = _build_geology(roof_thickness=10.0)

    thin_result = indicator.compute(thin_roof)
    thick_result = indicator.compute(thick_roof)

    assert thin_result.is_valid is True
    assert thick_result.is_valid is True
    assert thin_result.details["solver_converged"] is True
    assert thick_result.details["solver_converged"] is True
    assert 0 <= thin_result.value <= 100
    assert 0 <= thick_result.value <= 100
    # Thicker roof should not be more fragile in this model.
    assert thick_result.value >= thin_result.value - 1e-6


def test_asi_ust_calibration_is_reproducible_and_reasonable():
    target_b = 0.6
    target_indicator = ASIIndicatorUST(b=target_b)

    geologies = [
        _build_geology(roof_thickness=5.0, support_pressure=0.22e6),
        _build_geology(roof_thickness=6.5, support_pressure=0.28e6),
        _build_geology(roof_thickness=7.0, support_pressure=0.35e6),
        _build_geology(roof_thickness=8.0, support_pressure=0.42e6),
    ]
    samples = []
    for geo in geologies:
        result = target_indicator.compute(geo)
        samples.append({"geology": copy.deepcopy(geo), "target_asi": float(result.value)})

    grid = [round(v, 2) for v in np.linspace(0, 1, 21)]
    cal_1 = ASIIndicatorUST(b=0.1).calibrate_b_parameter(samples, b_grid=grid, bootstrap_rounds=80, seed=2026)
    cal_2 = ASIIndicatorUST(b=0.1).calibrate_b_parameter(samples, b_grid=grid, bootstrap_rounds=80, seed=2026)

    assert abs(cal_1["best_b"] - target_b) <= 0.25
    assert cal_1["best_b"] == cal_2["best_b"]
    assert cal_1["ci95"] == cal_2["ci95"]
    assert cal_1["rmse"] >= 0
