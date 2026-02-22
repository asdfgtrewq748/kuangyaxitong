from __future__ import annotations

from datetime import datetime, timezone

from app.services.mpi_calculator import PointData, RockLayer
from app.services import mpi_new_algorithm as new_algo
from mpi_advanced.core.data_models import IndicatorResult


def test_helpers_and_layer_type_mapping():
    assert new_algo._to_float(None, 1.2) == 1.2
    assert new_algo._to_float(float("nan"), 2.3) == 2.3
    assert new_algo._to_float("bad", 3.4) == 3.4
    assert new_algo._clamp(5.0, 0.0, 3.0) == 3.0

    defaults = new_algo._normalize_weights({"rsi": 0, "bri": 0, "asi": 0})
    assert defaults == {"rsi": 0.4, "bri": 0.35, "asi": 0.25}

    normalized = new_algo._normalize_weights({"roof_stability": 2, "burst_risk": 1, "abutment_stress": 1})
    assert round(normalized["rsi"], 4) == 0.5
    assert round(normalized["bri"], 4) == 0.25
    assert round(normalized["asi"], 4) == 0.25

    assert new_algo._layer_type_from_name("") == new_algo.GeologyLayerType.UNKNOWN
    assert new_algo._layer_type_from_name("Coal seam") == new_algo.GeologyLayerType.COAL
    assert new_algo._layer_type_from_name("mud shale") == new_algo.GeologyLayerType.MUDSTONE
    assert new_algo._layer_type_from_name("sandstone") == new_algo.GeologyLayerType.SANDSTONE
    assert new_algo._layer_type_from_name("limestone") == new_algo.GeologyLayerType.LIMESTONE


def test_build_geology_model_fallback_paths():
    point = PointData(x=10, y=20, thickness=0.2, burial_depth=0.0, z_top=0.0, strata=[])
    cfg = new_algo.NewAlgorithmConfig(
        panel_width_m=10.0,
        panel_length_m=10.0,
        advance_rate_m_per_day=0.0,
        support_pressure_mpa=0.0,
        mining_depth_fallback_m=600.0,
    )

    model = new_algo._build_geology_model(point, cfg)

    assert len(model.layers) == 2
    assert model.layers[0].name == "coal"
    assert model.layers[1].name == "roof_default"
    assert model.layers[0].thickness >= 0.8
    assert model.layers[0].depth_top > 0
    assert model.mining_params.panel_length >= 20.0
    assert model.mining_params.panel_width >= 20.0
    assert model.mining_params.advance_rate >= 0.1
    assert model.mining_params.support_pressure >= 0.01 * 1e6
    assert model.mining_params.mining_depth >= 30.0


def test_build_geology_model_with_burial_depth_and_strata():
    point = PointData(
        x=1,
        y=2,
        thickness=3.0,
        burial_depth=100.0,
        z_top=0.0,
        strata=[
            RockLayer(
                name="mud roof",
                thickness=2.0,
                elastic_modulus=15.0,
                cohesion=2.5,
                tensile_strength=1.1,
                friction_angle=29.0,
                poisson_ratio=0.3,
                density=2300.0,
            )
        ],
    )
    cfg = new_algo.NewAlgorithmConfig(mining_depth_fallback_m=500.0)

    model = new_algo._build_geology_model(point, cfg)

    assert len(model.layers) == 2
    assert model.layers[0].depth_top == 97.0
    assert model.layers[1].layer_type == new_algo.GeologyLayerType.MUDSTONE
    assert model.layers[1].depth_top == model.layers[0].depth_bottom
    assert model.mining_params.mining_depth == 100.0


def test_parse_event_time_and_build_monitoring_data_filters():
    dt = datetime(2025, 1, 1, 0, 0, tzinfo=timezone.utc)
    assert new_algo._parse_event_time(dt) is dt
    assert new_algo._parse_event_time("").tzinfo is not None
    assert new_algo._parse_event_time("2025-01-01T12:00:00").tzinfo is not None
    assert new_algo._parse_event_time("not-a-time").tzinfo is not None

    monitoring = new_algo._build_monitoring_data(
        [
            "bad-item",
            {"location": [1, 2], "magnitude": 1.0},
            {"location": [1, 2, 3], "magnitude": 0.0},
            {"event_id": "evt_ok", "location": [1, 2, 3], "magnitude": 1.0, "timestamp": "2025-01-01T00:00:00Z"},
            {"location": [4, 5, 6], "magnitude": 2.0, "time": "2025-01-02T00:00:00"},
        ]
    )

    assert len(monitoring.microseismic_events) == 2
    assert monitoring.microseismic_events[0].event_id == "evt_ok"
    assert monitoring.start_time is not None
    assert monitoring.end_time is not None
    assert monitoring.start_time <= monitoring.end_time


def test_indicator_diag_branches():
    diag_none = new_algo._to_indicator_diag("rsi", None)
    assert diag_none["status"] == "error"
    assert "compute_exception" in diag_none["issues"]

    rsi_invalid = IndicatorResult(
        indicator_name="RSI",
        value=float("inf"),
        confidence=0.4,
        uncertainty_range=(10.0, 90.0),
        is_valid=False,
        error_message="broken",
        intermediate_results={"phase_field": {"solver": {"converged": False}}},
    )
    diag_rsi = new_algo._to_indicator_diag("rsi", rsi_invalid)
    assert diag_rsi["status"] == "error"
    assert "invalid_result" in diag_rsi["issues"]
    assert "non_finite_value" in diag_rsi["issues"]
    assert "low_confidence" in diag_rsi["issues"]
    assert "phase_field_not_converged" in diag_rsi["issues"]

    asi_legacy = IndicatorResult(
        indicator_name="ASI Legacy",
        value=80.0,
        confidence=0.9,
        uncertainty_range=(20.0, 90.0),
        details={"plastic_zone_ratio": 7.0},
    )
    diag_asi = new_algo._to_indicator_diag("asi", asi_legacy)
    assert diag_asi["status"] == "warn"
    assert "large_plastic_zone_ratio" in diag_asi["issues"]
    assert diag_asi["value"] == 83.0

    bri_fallback = IndicatorResult(indicator_name="BRI Fallback", value=45.0, confidence=0.8)
    diag_bri = new_algo._to_indicator_diag("bri", bri_fallback, missing_microseismic=True)
    assert diag_bri["status"] == "warn"
    assert "missing_microseismic_events" in diag_bri["issues"]
    assert "bri_fallback" in diag_bri["issues"]


def test_calc_all_indicators_new_success_warn_and_error(monkeypatch):
    class _Indicator:
        def __init__(self, result):
            self._result = result

        def compute(self, geology, monitoring):
            return self._result

    class _ASIIndicator:
        def __init__(self, b):
            self.b = b

        def compute(self, geology, monitoring):
            return IndicatorResult(indicator_name="ASI", value=55.0, confidence=0.4)

    point = PointData(x=0, y=0, thickness=3.5, burial_depth=400.0, z_top=398.0, strata=[])
    events = [{"event_id": "e1", "location": [0, 0, 0], "magnitude": 1.2, "timestamp": "2025-01-01T00:00:00Z"}]

    monkeypatch.setattr(
        new_algo,
        "create_phase_field_analytical",
        lambda length_scale: _Indicator(IndicatorResult(indicator_name="RSI", value=70.0, confidence=0.9)),
    )
    monkeypatch.setattr(
        new_algo,
        "create_bri_microseismic_full",
        lambda: _Indicator(IndicatorResult(indicator_name="BRI", value=60.0, confidence=0.9)),
    )
    monkeypatch.setattr(new_algo, "ASIIndicatorUST", _ASIIndicator)

    ok_result = new_algo.calc_all_indicators_new(
        point,
        weights={"roof_stability": 2, "burst_risk": 1, "abutment_stress": 1},
        microseismic_events=events,
    )
    assert ok_result["status"] == "warn"
    assert ok_result["algorithm_mode"] == "advanced_v2"
    assert ok_result["missing_microseismic"] is False
    assert ok_result["compute_errors"] == []
    assert abs(sum(ok_result["weights"].values()) - 1.0) < 1e-9
    assert "asi" in ok_result["problem_indicators"]

    class _BrokenIndicator:
        def compute(self, geology, monitoring):
            raise RuntimeError("boom")

    class _BrokenASI:
        def __init__(self, b):
            self.b = b

        def compute(self, geology, monitoring):
            raise RuntimeError("boom-asi")

    monkeypatch.setattr(new_algo, "create_phase_field_analytical", lambda length_scale: _BrokenIndicator())
    monkeypatch.setattr(new_algo, "create_bri_microseismic_full", lambda: _BrokenIndicator())
    monkeypatch.setattr(new_algo, "ASIIndicatorUST", _BrokenASI)

    err_result = new_algo.calc_all_indicators_new(point, microseismic_events=None)
    assert err_result["status"] == "error"
    assert err_result["missing_microseismic"] is True
    assert len(err_result["compute_errors"]) == 3
    assert set(err_result["problem_indicators"]) == {"rsi", "bri", "asi"}


def test_calc_mpi_geology_aware_zero_baseline():
    result = new_algo.calc_mpi_geology_aware(
        baseline_result={"mpi": 0.0, "breakdown": {"rsi": 80.0, "bri": 70.0, "asi": 60.0}},
        features={
            "key_layer_span": 300.0,
            "layer_cv": 1.0,
            "pinchout_ratio": 2.0,
            "continuity_score": -1.0,
        },
    )
    assert result["algorithm_mode"] == "geology_aware_v1"
    assert result["mpi"] == 0.0
    assert result["breakdown"]["rsi"] == 80.0
    assert result["breakdown"]["bri"] == 70.0
    assert result["breakdown"]["asi"] == 60.0
