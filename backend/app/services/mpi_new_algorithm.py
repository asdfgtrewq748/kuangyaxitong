from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
import sys
from typing import Any, Dict, List, Optional

import numpy as np

from app.services.mpi_calculator import PointData, RockLayer


# Ensure repository root is importable when backend runs with PYTHONPATH=backend.
_ROOT = Path(__file__).resolve().parents[3]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from mpi_advanced.core.data_models import (  # noqa: E402
    GeologyLayer,
    GeologyLayerType,
    GeologyModel,
    IndicatorResult,
    MicroseismicEvent,
    MiningParameters,
    MonitoringData,
)
from mpi_advanced.indicators.asi_indicator_ust import ASIIndicatorUST  # noqa: E402
from mpi_advanced.indicators.bri_microseismic import create_bri_microseismic_full  # noqa: E402
from mpi_advanced.indicators.rsi_phase_field import create_phase_field_analytical  # noqa: E402


@dataclass
class NewAlgorithmConfig:
    phase_field_length_scale: float = 0.5
    ust_parameter_b: float = 0.5
    support_pressure_mpa: float = 0.5
    panel_width_m: float = 180.0
    panel_length_m: float = 220.0
    advance_rate_m_per_day: float = 4.0
    mining_depth_fallback_m: float = 500.0


def _to_float(value: Any, default: float) -> float:
    try:
        if value is None:
            return float(default)
        v = float(value)
        if np.isnan(v):
            return float(default)
        return v
    except Exception:
        return float(default)


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def _normalize_weights(weights: Optional[Dict[str, Any]]) -> Dict[str, float]:
    raw = weights or {}
    rsi = _to_float(raw.get("rsi", raw.get("roof_stability", 0.4)), 0.4)
    bri = _to_float(raw.get("bri", raw.get("burst_risk", 0.35)), 0.35)
    asi = _to_float(raw.get("asi", raw.get("abutment_stress", 0.25)), 0.25)
    total = rsi + bri + asi
    if total <= 0:
        return {"rsi": 0.4, "bri": 0.35, "asi": 0.25}
    return {"rsi": rsi / total, "bri": bri / total, "asi": asi / total}


def _layer_type_from_name(name: str) -> GeologyLayerType:
    text = str(name or "").strip().lower()
    if not text:
        return GeologyLayerType.UNKNOWN
    if "coal" in text or "煤" in text:
        return GeologyLayerType.COAL
    if "mud" in text or "shale" in text or "泥" in text:
        return GeologyLayerType.MUDSTONE
    if "sand" in text or "砂" in text:
        return GeologyLayerType.SANDSTONE
    if "lime" in text or "灰岩" in text or "石灰" in text:
        return GeologyLayerType.LIMESTONE
    return GeologyLayerType.UNKNOWN


def _to_geology_layer(layer: RockLayer, depth_top: float) -> GeologyLayer:
    thickness = max(0.1, _to_float(layer.thickness, 1.0))
    depth_bottom = depth_top + thickness

    elastic_gpa = max(0.5, _to_float(layer.elastic_modulus, 12.0))
    cohesion_mpa = max(0.05, _to_float(layer.cohesion, 2.0))
    tensile_mpa = max(0.03, _to_float(layer.tensile_strength, 1.2))
    friction_angle = _clamp(_to_float(layer.friction_angle, 28.0), 10.0, 55.0)
    poisson_ratio = _clamp(_to_float(layer.poisson_ratio, 0.25), 0.10, 0.45)
    density = max(1200.0, _to_float(layer.density, 2500.0))
    fracture_toughness = max(0.3, tensile_mpa * 0.30)

    return GeologyLayer(
        name=layer.name or "layer",
        layer_type=_layer_type_from_name(layer.name),
        thickness=thickness,
        depth_top=depth_top,
        depth_bottom=depth_bottom,
        elastic_modulus=elastic_gpa * 1e9,
        poisson_ratio=poisson_ratio,
        cohesion=cohesion_mpa * 1e6,
        friction_angle=friction_angle,
        tensile_strength=tensile_mpa * 1e6,
        fracture_toughness=fracture_toughness,
        density=density,
        description="adapted from validation point",
    )


def _build_geology_model(point: PointData, config: NewAlgorithmConfig) -> GeologyModel:
    coal_thickness = max(0.8, _to_float(point.thickness, 3.5))
    coal_depth_top = _to_float(point.z_top, 0.0)
    if coal_depth_top <= 0 and _to_float(point.burial_depth, 0.0) > 0:
        coal_depth_top = max(0.0, _to_float(point.burial_depth, 0.0) - coal_thickness)
    if coal_depth_top <= 0:
        coal_depth_top = max(0.0, _to_float(config.mining_depth_fallback_m, 500.0) - coal_thickness)

    layers: List[GeologyLayer] = [
        GeologyLayer(
            name="coal",
            layer_type=GeologyLayerType.COAL,
            thickness=coal_thickness,
            depth_top=coal_depth_top,
            depth_bottom=coal_depth_top + coal_thickness,
            elastic_modulus=3.5e9,
            poisson_ratio=0.30,
            cohesion=2.0e6,
            friction_angle=22.0,
            tensile_strength=0.8e6,
            fracture_toughness=0.5,
            density=1450.0,
            description="synthetic coal layer",
        )
    ]

    depth_cursor = layers[0].depth_bottom
    for layer in point.strata or []:
        adapted = _to_geology_layer(layer, depth_cursor)
        layers.append(adapted)
        depth_cursor = adapted.depth_bottom

    if len(layers) == 1:
        layers.append(
            GeologyLayer(
                name="roof_default",
                layer_type=GeologyLayerType.SANDSTONE,
                thickness=5.0,
                depth_top=depth_cursor,
                depth_bottom=depth_cursor + 5.0,
                elastic_modulus=16e9,
                poisson_ratio=0.25,
                cohesion=4.0e6,
                friction_angle=30.0,
                tensile_strength=2.0e6,
                fracture_toughness=1.0,
                density=2450.0,
                description="default roof layer",
            )
        )

    mining_depth = _to_float(point.burial_depth, 0.0)
    if mining_depth <= 0:
        mining_depth = _to_float(config.mining_depth_fallback_m, depth_cursor)

    mining = MiningParameters(
        panel_length=max(20.0, _to_float(config.panel_length_m, 220.0)),
        panel_width=max(20.0, _to_float(config.panel_width_m, 180.0)),
        mining_height=coal_thickness,
        mining_depth=max(30.0, mining_depth),
        advance_rate=max(0.1, _to_float(config.advance_rate_m_per_day, 4.0)),
        support_pressure=max(0.01, _to_float(config.support_pressure_mpa, 0.5)) * 1e6,
        face_position=0.0,
        face_angle=0.0,
    )
    return GeologyModel(layers=layers, mining_params=mining)


def _event_energy_from_magnitude(magnitude: float) -> float:
    # Gutenberg-Richter style rough estimate.
    return float(10 ** (1.5 * magnitude + 4.8))


def _parse_event_time(value: Any) -> datetime:
    if isinstance(value, datetime):
        return value
    text = str(value or "").strip()
    if not text:
        return datetime.now(timezone.utc)
    try:
        t = datetime.fromisoformat(text.replace("Z", "+00:00"))
        if t.tzinfo is None:
            return t.replace(tzinfo=timezone.utc)
        return t
    except Exception:
        return datetime.now(timezone.utc)


def _build_monitoring_data(events: Optional[List[Dict[str, Any]]]) -> MonitoringData:
    converted: List[MicroseismicEvent] = []
    for idx, item in enumerate(events or []):
        if not isinstance(item, dict):
            continue
        location = item.get("location")
        if not isinstance(location, (list, tuple)) or len(location) < 3:
            continue
        x = _to_float(location[0], 0.0)
        y = _to_float(location[1], 0.0)
        z = _to_float(location[2], 0.0)
        magnitude = _to_float(item.get("magnitude"), 0.0)
        if magnitude <= 0:
            continue
        converted.append(
            MicroseismicEvent(
                event_id=str(item.get("event_id") or f"evt_{idx+1}"),
                timestamp=_parse_event_time(item.get("time") or item.get("timestamp")),
                location=np.asarray([x, y, z], dtype=float),
                magnitude=magnitude,
                energy=_event_energy_from_magnitude(magnitude),
            )
        )

    payload = MonitoringData(microseismic_events=converted)
    if converted:
        payload.start_time = min(evt.timestamp for evt in converted)
        payload.end_time = max(evt.timestamp for evt in converted)
    return payload


def _status_rank(status: str) -> int:
    order = {"ok": 0, "warn": 1, "error": 2}
    return order.get(str(status), 0)


def _to_indicator_diag(
    metric: str,
    result: Optional[IndicatorResult],
    *,
    missing_microseismic: bool = False,
) -> Dict[str, Any]:
    status = "ok"
    issues: List[str] = []
    message_parts: List[str] = []
    confidence = 0.0
    value = 50.0
    uncertainty = [0.0, 100.0]
    indicator_name = ""

    if result is None:
        status = "error"
        issues.append("compute_exception")
        message_parts.append("indicator compute failed")
    else:
        indicator_name = str(result.indicator_name or "")
        confidence = float(_to_float(result.confidence, 0.0))
        uncertainty = [
            float(_to_float((result.uncertainty_range or (0.0, 100.0))[0], 0.0)),
            float(_to_float((result.uncertainty_range or (0.0, 100.0))[1], 100.0)),
        ]
        if not result.is_valid:
            status = "error"
            issues.append("invalid_result")
            if result.error_message:
                message_parts.append(str(result.error_message))
        if np.isfinite(_to_float(result.value, np.nan)):
            value = float(_clamp(_to_float(result.value, 50.0), 0.0, 100.0))
        else:
            status = "error"
            issues.append("non_finite_value")
            message_parts.append("non-finite value")

        # Backward compatibility:
        # If ASI result comes from legacy implementation (without explicit
        # calibration metadata), apply the same engineering-range mapping so
        # UI values stay consistent across mixed deployments.
        if metric == "asi":
            details = result.details or {}
            has_asi_calibration = isinstance(details.get("asi_calibration"), dict)
            if not has_asi_calibration:
                value = float(_clamp(15.0 + 0.85 * value, 0.0, 100.0))
                uncertainty = [
                    float(_clamp(15.0 + 0.85 * uncertainty[0], 0.0, 100.0)),
                    float(_clamp(15.0 + 0.85 * uncertainty[1], 0.0, 100.0)),
                ]

        if confidence < 0.55:
            if _status_rank(status) < _status_rank("warn"):
                status = "warn"
            issues.append("low_confidence")

        if metric == "rsi":
            solver = ((result.intermediate_results or {}).get("phase_field") or {}).get("solver") or {}
            if solver and not bool(solver.get("converged", True)):
                if _status_rank(status) < _status_rank("warn"):
                    status = "warn"
                issues.append("phase_field_not_converged")
                message_parts.append("phase-field solver not converged")

        if metric == "asi":
            ratio = _to_float((result.details or {}).get("plastic_zone_ratio"), 0.0)
            if ratio > 6.0:
                if _status_rank(status) < _status_rank("warn"):
                    status = "warn"
                issues.append("large_plastic_zone_ratio")

        if metric == "bri":
            if missing_microseismic:
                if _status_rank(status) < _status_rank("warn"):
                    status = "warn"
                issues.append("missing_microseismic_events")
                message_parts.append("microseismic events missing, fallback branch used")
            if "Fallback" in indicator_name:
                if _status_rank(status) < _status_rank("warn"):
                    status = "warn"
                issues.append("bri_fallback")

    dedup_issues = sorted(set(issues))
    message = "; ".join(part for part in message_parts if part).strip()

    return {
        "status": status,
        "issues": dedup_issues,
        "message": message,
        "value": round(float(value), 4),
        "confidence": round(float(confidence), 4),
        "uncertainty_range": [round(float(uncertainty[0]), 4), round(float(uncertainty[1]), 4)],
        "indicator_name": indicator_name,
    }


def calc_all_indicators_new(
    point: PointData,
    *,
    weights: Optional[Dict[str, Any]] = None,
    microseismic_events: Optional[List[Dict[str, Any]]] = None,
    config: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    cfg_data = config or {}
    cfg = NewAlgorithmConfig(
        phase_field_length_scale=_to_float(cfg_data.get("phase_field_length_scale"), 0.5),
        ust_parameter_b=_to_float(cfg_data.get("ust_parameter_b"), 0.5),
        support_pressure_mpa=_to_float(cfg_data.get("support_pressure_mpa"), 0.5),
        panel_width_m=_to_float(cfg_data.get("panel_width_m"), 180.0),
        panel_length_m=_to_float(cfg_data.get("panel_length_m"), 220.0),
        advance_rate_m_per_day=_to_float(cfg_data.get("advance_rate_m_per_day"), 4.0),
        mining_depth_fallback_m=_to_float(cfg_data.get("mining_depth_fallback_m"), 500.0),
    )

    geology = _build_geology_model(point, cfg)
    monitoring = _build_monitoring_data(microseismic_events)
    missing_microseismic = len(monitoring.microseismic_events) == 0

    rsi_result: Optional[IndicatorResult] = None
    bri_result: Optional[IndicatorResult] = None
    asi_result: Optional[IndicatorResult] = None
    compute_errors: List[str] = []

    try:
        rsi_result = create_phase_field_analytical(length_scale=cfg.phase_field_length_scale).compute(geology, monitoring)
    except Exception as exc:
        compute_errors.append(f"rsi: {exc}")

    try:
        bri_result = create_bri_microseismic_full().compute(geology, monitoring)
    except Exception as exc:
        compute_errors.append(f"bri: {exc}")

    try:
        asi_result = ASIIndicatorUST(b=cfg.ust_parameter_b).compute(geology, monitoring)
    except Exception as exc:
        compute_errors.append(f"asi: {exc}")

    diagnostics = {
        "rsi": _to_indicator_diag("rsi", rsi_result),
        "bri": _to_indicator_diag("bri", bri_result, missing_microseismic=missing_microseismic),
        "asi": _to_indicator_diag("asi", asi_result),
    }

    values = {
        "rsi": diagnostics["rsi"]["value"],
        "bri": diagnostics["bri"]["value"],
        "asi": diagnostics["asi"]["value"],
    }
    norm_w = _normalize_weights(weights)
    mpi_value = (
        norm_w["rsi"] * values["rsi"]
        + norm_w["bri"] * values["bri"]
        + norm_w["asi"] * values["asi"]
    )
    values["mpi"] = round(float(_clamp(mpi_value, 0.0, 100.0)), 4)

    problem_indicators = [name for name, item in diagnostics.items() if item.get("status") != "ok"]
    status = "ok"
    if any(item.get("status") == "error" for item in diagnostics.values()):
        status = "error"
    elif problem_indicators:
        status = "warn"

    return {
        **values,
        "weights": norm_w,
        "diagnostics": diagnostics,
        "algorithm_mode": "advanced_v2",
        "status": status,
        "problem_indicators": problem_indicators,
        "missing_microseismic": missing_microseismic,
        "compute_errors": compute_errors,
    }


def calc_mpi_geology_aware(
    baseline_result: Dict[str, Any],
    features: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    在 baseline MPI 基础上引入地质特征修正，输出 geology-aware 结果。
    """
    baseline_mpi = float(_to_float((baseline_result or {}).get("mpi"), 50.0))
    baseline_breakdown = (baseline_result or {}).get("breakdown") or {}

    f = features or {}
    key_layer_span = float(_to_float(f.get("key_layer_span"), 80.0))
    layer_cv = float(_to_float(f.get("layer_cv"), 0.3))
    pinchout_ratio = float(_clamp(_to_float(f.get("pinchout_ratio"), 0.0), 0.0, 1.0))
    continuity_score = float(_clamp(_to_float(f.get("continuity_score"), 0.5), 0.0, 1.0))

    continuity_term = (continuity_score - 0.5) * 0.12
    pinchout_term = -pinchout_ratio * 0.10
    variability_term = -max(0.0, layer_cv - 0.3) * 0.08
    span_term = -max(0.0, key_layer_span - 80.0) / 200.0 * 0.08

    adjustment_ratio = continuity_term + pinchout_term + variability_term + span_term
    geology_mpi = _clamp(baseline_mpi * (1.0 + adjustment_ratio), 0.0, 100.0)

    scale = geology_mpi / baseline_mpi if baseline_mpi > 1e-6 else 1.0
    rsi = _clamp(_to_float(baseline_breakdown.get("rsi"), 50.0) * scale, 0.0, 100.0)
    bri = _clamp(_to_float(baseline_breakdown.get("bri"), 50.0) * scale, 0.0, 100.0)
    asi = _clamp(_to_float(baseline_breakdown.get("asi"), 50.0) * scale, 0.0, 100.0)

    return {
        "mpi": round(float(geology_mpi), 4),
        "breakdown": {
            "rsi": round(float(rsi), 4),
            "bri": round(float(bri), 4),
            "asi": round(float(asi), 4),
        },
        "feature_contribution": {
            "continuity_term": round(float(continuity_term), 6),
            "pinchout_term": round(float(pinchout_term), 6),
            "variability_term": round(float(variability_term), 6),
            "span_term": round(float(span_term), 6),
            "adjustment_ratio": round(float(adjustment_ratio), 6),
        },
        "algorithm_mode": "geology_aware_v1",
    }
