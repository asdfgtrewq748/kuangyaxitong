"""
MPI Academic Algorithm API server.
Provides demo endpoints for RSI/BRI/ASI/DBN and comprehensive assessment.
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional
import os
import socket
import sys

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add repository root for local imports.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

ALGO_IMPORT_OK = True
ALGO_IMPORT_ERROR = ""

try:
    from mpi_advanced.indicators.rsi_phase_field import create_rsi_phase_field_standard
    from mpi_advanced.indicators.bri_microseismic import create_bri_microseismic_standard
    from mpi_advanced.indicators.asi_indicator_ust import create_asi_ust_standard
    from mpi_advanced.fusion.dbn_fusion_advanced import create_dbn_fusion_standard
except ImportError as exc:
    ALGO_IMPORT_OK = False
    ALGO_IMPORT_ERROR = str(exc)


class StrataLayer(BaseModel):
    name: str
    thickness: float
    tensile_strength: Optional[float] = None
    elastic_modulus: Optional[float] = None
    fracture_energy: Optional[float] = None
    friction_angle: Optional[float] = None
    cohesion: Optional[float] = None
    compressive_strength: Optional[float] = None


class MicroseismicEvent(BaseModel):
    time: str
    location: List[float]
    magnitude: float
    waveform: Optional[List[float]] = None


class RSIRequest(BaseModel):
    strata: List[StrataLayer]
    mesh_size: int = 50
    time_steps: int = 10


class BRIRequest(BaseModel):
    microseismic_events: List[MicroseismicEvent]
    sensor_positions: List[List[float]]
    time_window_days: int = 7


class ASIRequest(BaseModel):
    strata: List[StrataLayer]
    tunnel_radius: float = 3.0
    original_stress: float = 10.0
    support_pressure: float = 0.5
    ust_parameter_b: float = 0.5


class DBNRequest(BaseModel):
    rsi: float
    bri: float
    asi: float
    historical_data: Optional[List[Dict[str, Any]]] = []
    geological_context: Optional[Dict[str, Any]] = {}


class ComprehensiveRequest(BaseModel):
    strata: List[StrataLayer]
    microseismic_events: Optional[List[MicroseismicEvent]] = []
    sensor_positions: Optional[List[List[float]]] = []
    geological_context: Optional[Dict[str, Any]] = {}
    historical_data: Optional[List[Dict[str, Any]]] = []



def _safe_mean(values: List[float], default: float = 0.0) -> float:
    if not values:
        return default
    return float(np.mean(np.asarray(values, dtype=float)))


@asynccontextmanager
async def lifespan(app: FastAPI):
    runtime_port = getattr(app.state, "runtime_port", int(os.getenv("API_PORT", "5000")))
    print("=" * 60)
    print("MPI 学术算法 API 服务器")
    if ALGO_IMPORT_OK:
        print("学术算法模块导入: OK")
    else:
        print(f"警告: 无法导入学术算法模块: {ALGO_IMPORT_ERROR}")
        print("将使用模拟数据进行演示")
    print("=" * 60)
    print("端点列表:")
    print("  GET  /api/health                    - 健康检查")
    print("  POST /api/rsi/phase-field           - RSI 相场断裂模型")
    print("  POST /api/bri/microseismic          - BRI 微震矩张量反演")
    print("  POST /api/asi/ust                   - ASI 统一强度理论")
    print("  POST /api/fusion/dbn                - DBN 动态贝叶斯网络融合")
    print("  POST /api/comprehensive-assessment  - 综合评估")
    print("=" * 60)
    print(f"API 文档: http://localhost:{runtime_port}/docs")
    print("=" * 60)
    yield


app = FastAPI(
    title="MPI Academic Algorithm API",
    description="矿压影响评价系统 - 学术算法 API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "service": "MPI Academic Algorithm API",
        "version": "1.0.0",
        "academic_modules_loaded": ALGO_IMPORT_OK,
    }


@app.post("/api/rsi/phase-field")
async def calculate_rsi_phase_field(request: RSIRequest) -> Dict[str, Any]:
    try:
        avg_tensile = _safe_mean([layer.tensile_strength or 2.0 for layer in request.strata], 2.0)
        avg_modulus = _safe_mean([layer.elastic_modulus or 10.0 for layer in request.strata], 10.0)

        rsi_value = min(100.0, max(0.0, 50.0 + avg_tensile * 5.0 + avg_modulus * 2.0))
        phase_field = np.random.uniform(0.7, 1.0, (request.mesh_size, request.mesh_size)).tolist()

        return {
            "success": True,
            "rsi_value": float(rsi_value),
            "phase_field_distribution": phase_field,
            "crack_pattern": {
                "crack_length": float(np.random.uniform(0, 5)),
                "crack_width": float(np.random.uniform(0, 0.5)),
                "crack_locations": [[25, 25], [30, 28], [35, 32]],
            },
            "damage_zone": {
                "radius": float(np.random.uniform(5, 15)),
                "severity": "moderate",
            },
            "computation_time": 0.5,
            "method": "Phase-Field Fracture Model (demo)",
            "description": "RSI based on phase-field fracture concept.",
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/bri/microseismic")
async def calculate_bri_microseismic(request: BRIRequest) -> Dict[str, Any]:
    try:
        num_events = len(request.microseismic_events)
        avg_mag = _safe_mean([e.magnitude for e in request.microseismic_events], 0.0)

        bri_value = min(100.0, max(0.0, 100.0 - num_events * 2.0 - avg_mag * 10.0))

        moment_tensors = [
            {
                "event_id": i,
                "iso_percent": float(np.random.uniform(10, 30)),
                "dc_percent": float(np.random.uniform(40, 60)),
                "clvd_percent": float(np.random.uniform(10, 30)),
                "mechanism": "shear" if np.random.random() > 0.5 else "tensile",
            }
            for i in range(min(num_events, 10))
        ]

        return {
            "success": True,
            "bri_value": float(bri_value),
            "moment_tensors": moment_tensors,
            "energy_field": {
                "max_energy": float(np.random.uniform(1e6, 1e8)),
                "spatial_distribution": "concentrated",
            },
            "precursor_features": {
                "b_value": float(np.random.uniform(0.8, 1.2)),
                "event_rate": float(num_events / max(1, request.time_window_days)),
                "energy_release_rate": float(np.random.uniform(1e5, 1e7)),
            },
            "risk_prediction": {
                "probability_high_risk": float(np.random.uniform(0.1, 0.4)),
                "time_to_event": "2-5 days" if bri_value < 50 else "> 7 days",
            },
            "ai_confidence": float(np.random.uniform(0.75, 0.95)),
            "method": "Moment Tensor Inversion + DL (demo)",
            "description": "BRI based on microseismic risk features.",
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/asi/ust")
async def calculate_asi_ust(request: ASIRequest) -> Dict[str, Any]:
    try:
        avg_modulus = _safe_mean([layer.elastic_modulus or 10.0 for layer in request.strata], 10.0)
        avg_friction = _safe_mean([layer.friction_angle or 30.0 for layer in request.strata], 30.0)

        asi_value = min(100.0, max(0.0, 40.0 + avg_modulus * 2.0 + avg_friction * 0.5))

        r_array = np.linspace(request.tunnel_radius, request.tunnel_radius * 5, 100)
        radial_stress = (request.original_stress * (1 - (request.tunnel_radius / r_array) ** 2)).tolist()
        tangential_stress = (request.original_stress * (1 + (request.tunnel_radius / r_array) ** 2)).tolist()

        plastic_zone_radius = request.tunnel_radius * (
            (2.0 * request.original_stress) / (request.support_pressure + 1.0)
        ) ** (1.0 / (2.0 * (1.0 + request.ust_parameter_b)))

        return {
            "success": True,
            "asi_value": float(asi_value),
            "stress_distribution": {
                "radial_distances": r_array.tolist(),
                "radial_stress": radial_stress,
                "tangential_stress": tangential_stress,
            },
            "plastic_zone_radius": float(plastic_zone_radius),
            "stress_concentration": float(np.max(tangential_stress) / max(request.original_stress, 1e-6)),
            "radial_stress": radial_stress,
            "tangential_stress": tangential_stress,
            "method": "Unified Strength Theory (demo)",
            "description": f"ASI analysis with UST parameter b={request.ust_parameter_b}.",
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/fusion/dbn")
async def calculate_dbn_fusion(request: DBNRequest) -> Dict[str, Any]:
    try:
        base_weights = {"rsi": 0.4, "bri": 0.35, "asi": 0.25}
        total = request.rsi + request.bri + request.asi

        if total > 0:
            dynamic_weights = {
                "rsi": 0.35 + 0.1 * (request.rsi / total),
                "bri": 0.30 + 0.1 * (request.bri / total),
                "asi": 0.25 + 0.1 * (request.asi / total),
            }
        else:
            dynamic_weights = base_weights

        w_sum = sum(dynamic_weights.values())
        dynamic_weights = {k: v / w_sum for k, v in dynamic_weights.items()}

        mpi_value = (
            dynamic_weights["rsi"] * request.rsi
            + dynamic_weights["bri"] * request.bri
            + dynamic_weights["asi"] * request.asi
        )

        if mpi_value >= 70:
            risk_level, risk_label = "low", "低风险"
        elif mpi_value >= 50:
            risk_level, risk_label = "medium", "中风险"
        else:
            risk_level, risk_label = "high", "高风险"

        confidence = 0.85 if len(request.historical_data or []) > 5 else 0.70
        uncertainty = 5.0 if confidence > 0.8 else 10.0

        return {
            "success": True,
            "mpi_value": float(mpi_value),
            "risk_level": risk_level,
            "risk_label": risk_label,
            "confidence": float(confidence),
            "uncertainty_range": {
                "lower": float(max(0, mpi_value - uncertainty)),
                "upper": float(min(100, mpi_value + uncertainty)),
            },
            "dynamic_weights": dynamic_weights,
            "probability_distribution": {
                "low_risk": float(0.8 if risk_level == "low" else 0.2 if risk_level == "medium" else 0.05),
                "medium_risk": float(0.15 if risk_level == "low" else 0.7 if risk_level == "medium" else 0.25),
                "high_risk": float(0.05 if risk_level == "low" else 0.1 if risk_level == "medium" else 0.70),
            },
            "temporal_reasoning": {
                "trend": "stable" if len(request.historical_data or []) < 3 else "improving",
                "prediction_horizon": "24 hours",
            },
            "method": "Dynamic Bayesian Network (demo)",
            "description": "Multi-indicator probabilistic fusion.",
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/comprehensive-assessment")
async def comprehensive_assessment(request: ComprehensiveRequest) -> Dict[str, Any]:
    try:
        rsi_result = await calculate_rsi_phase_field(RSIRequest(strata=request.strata))

        if request.microseismic_events:
            bri_result = await calculate_bri_microseismic(
                BRIRequest(
                    microseismic_events=request.microseismic_events,
                    sensor_positions=request.sensor_positions or [],
                )
            )
        else:
            bri_result = {"success": True, "bri_value": 70.0}

        asi_result = await calculate_asi_ust(ASIRequest(strata=request.strata))

        fusion_result = await calculate_dbn_fusion(
            DBNRequest(
                rsi=rsi_result["rsi_value"],
                bri=bri_result["bri_value"],
                asi=asi_result["asi_value"],
                historical_data=request.historical_data,
                geological_context=request.geological_context,
            )
        )

        return {
            "success": True,
            "rsi": {"value": rsi_result["rsi_value"], "method": "Phase-Field", "details": rsi_result},
            "bri": {"value": bri_result["bri_value"], "method": "Microseismic", "details": bri_result},
            "asi": {"value": asi_result["asi_value"], "method": "UST", "details": asi_result},
            "fusion": {
                "mpi": fusion_result["mpi_value"],
                "risk_level": fusion_result["risk_level"],
                "confidence": fusion_result["confidence"],
                "method": "DBN",
                "details": fusion_result,
            },
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("API_HOST", "0.0.0.0")
    requested_port = int(os.getenv("API_PORT", "5000"))
    runtime_port = requested_port

    for port in range(requested_port, requested_port + 20):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            in_use = sock.connect_ex(("127.0.0.1", port)) == 0
            if not in_use:
                runtime_port = port
                break
        finally:
            sock.close()

    if runtime_port != requested_port:
        print(f"端口 {requested_port} 被占用，自动切换到 {runtime_port}")

    app.state.runtime_port = runtime_port
    uvicorn.run(app, host=host, port=runtime_port)
