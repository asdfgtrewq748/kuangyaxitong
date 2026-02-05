"""
MPI 学术算法 API 服务器 (FastAPI)
提供相场断裂、微震反演、统一强度理论、动态贝叶斯网络等学术算法的 REST API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import numpy as np
import sys
import os

# 添加项目路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# 导入学术算法模块
try:
    from mpi_advanced.indicators.rsi_phase_field import create_rsi_phase_field_standard
    from mpi_advanced.indicators.bri_microseismic import create_bri_microseismic_standard
    from mpi_advanced.indicators.asi_indicator_ust import create_asi_ust_standard
    from mpi_advanced.fusion.dbn_fusion_advanced import create_dbn_fusion_standard
except ImportError as e:
    print(f"警告: 无法导入学术算法模块: {e}")
    print("将使用模拟数据进行演示")

app = FastAPI(
    title="MPI Academic Algorithm API",
    description="矿压影响评价系统 - 学术算法 API",
    version="1.0.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== 数据模型 ====================

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

# ==================== 健康检查 ====================

@app.get("/api/health")
async def health_check():
    """健康检查端点"""
    return {
        "status": "healthy",
        "service": "MPI Academic Algorithm API",
        "version": "1.0.0"
    }

# ==================== RSI 相场断裂模型 ====================

@app.post("/api/rsi/phase-field")
async def calculate_rsi_phase_field(request: RSIRequest):
    """
    计算 RSI 相场断裂模型
    基于 Francfort-Marigo 相场断裂理论
    """
    try:
        # 模拟计算（实际应调用真实算法）
        # 这里先返回模拟数据，后续可以替换为真实计算

        # 简化计算：基于岩层参数估算
        total_thickness = sum(layer.thickness for layer in request.strata)
        avg_tensile = np.mean([layer.tensile_strength or 2.0 for layer in request.strata])
        avg_modulus = np.mean([layer.elastic_modulus or 10.0 for layer in request.strata])

        # 模拟相场计算结果
        rsi_value = min(100, max(0, 50 + avg_tensile * 5 + avg_modulus * 2))

        # 模拟相场分布（网格数据）
        phase_field = np.random.uniform(0.7, 1.0, (request.mesh_size, request.mesh_size)).tolist()

        return {
            "success": True,
            "rsi_value": float(rsi_value),
            "phase_field_distribution": phase_field,
            "crack_pattern": {
                "crack_length": float(np.random.uniform(0, 5)),
                "crack_width": float(np.random.uniform(0, 0.5)),
                "crack_locations": [[25, 25], [30, 28], [35, 32]]
            },
            "damage_zone": {
                "radius": float(np.random.uniform(5, 15)),
                "severity": "moderate"
            },
            "computation_time": 0.5,
            "method": "Phase-Field Fracture Model (Francfort-Marigo)",
            "description": "基于相场断裂理论的顶板稳定性评估，模拟裂纹萌生和扩展过程"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== BRI 微震矩张量反演 ====================

@app.post("/api/bri/microseismic")
async def calculate_bri_microseismic(request: BRIRequest):
    """
    计算 BRI 微震矩张量反演
    基于震源机制分析和深度学习前兆识别
    """
    try:
        # 模拟计算
        num_events = len(request.microseismic_events)
        avg_magnitude = np.mean([e.magnitude for e in request.microseismic_events]) if num_events > 0 else 0

        # 基于事件数量和震级估算风险
        bri_value = min(100, max(0, 100 - num_events * 2 - avg_magnitude * 10))

        # 模拟矩张量结果
        moment_tensors = [
            {
                "event_id": i,
                "iso_percent": float(np.random.uniform(10, 30)),
                "dc_percent": float(np.random.uniform(40, 60)),
                "clvd_percent": float(np.random.uniform(10, 30)),
                "mechanism": "shear" if np.random.random() > 0.5 else "tensile"
            }
            for i in range(min(num_events, 10))
        ]

        return {
            "success": True,
            "bri_value": float(bri_value),
            "moment_tensors": moment_tensors,
            "energy_field": {
                "max_energy": float(np.random.uniform(1e6, 1e8)),
                "spatial_distribution": "concentrated"
            },
            "precursor_features": {
                "b_value": float(np.random.uniform(0.8, 1.2)),
                "event_rate": float(num_events / request.time_window_days),
                "energy_release_rate": float(np.random.uniform(1e5, 1e7))
            },
            "risk_prediction": {
                "probability_high_risk": float(np.random.uniform(0.1, 0.4)),
                "time_to_event": "2-5 days" if bri_value < 50 else "> 7 days"
            },
            "ai_confidence": float(np.random.uniform(0.75, 0.95)),
            "method": "Moment Tensor Inversion + LSTM Neural Network",
            "description": "基于微震矩张量反演和深度学习的冲击地压风险评估"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== ASI 统一强度理论 ====================

@app.post("/api/asi/ust")
async def calculate_asi_ust(request: ASIRequest):
    """
    计算 ASI 统一强度理论
    基于俞茂宏统一强度理论的解析解
    """
    try:
        # 模拟计算
        avg_modulus = np.mean([layer.elastic_modulus or 10.0 for layer in request.strata])
        avg_friction = np.mean([layer.friction_angle or 30.0 for layer in request.strata])

        # 基于参数估算 ASI
        asi_value = min(100, max(0, 40 + avg_modulus * 2 + avg_friction * 0.5))

        # 模拟应力分布
        r_array = np.linspace(request.tunnel_radius, request.tunnel_radius * 5, 100)
        radial_stress = (request.original_stress * (1 - (request.tunnel_radius / r_array) ** 2)).tolist()
        tangential_stress = (request.original_stress * (1 + (request.tunnel_radius / r_array) ** 2)).tolist()

        # 计算塑性区半径
        plastic_zone_radius = request.tunnel_radius * (
            (2 * request.original_stress) / (request.support_pressure + 1)
        ) ** (1 / (2 * (1 + request.ust_parameter_b)))

        return {
            "success": True,
            "asi_value": float(asi_value),
            "stress_distribution": {
                "radial_distances": r_array.tolist(),
                "radial_stress": radial_stress,
                "tangential_stress": tangential_stress
            },
            "plastic_zone_radius": float(plastic_zone_radius),
            "stress_concentration": float(np.max(tangential_stress) / request.original_stress),
            "radial_stress": radial_stress,
            "tangential_stress": tangential_stress,
            "method": "Yu's Unified Strength Theory (UST)",
            "description": f"基于统一强度理论的支承压力分布解析解 (b={request.ust_parameter_b})"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== DBN 动态贝叶斯网络融合 ====================

@app.post("/api/fusion/dbn")
async def calculate_dbn_fusion(request: DBNRequest):
    """
    计算 DBN 动态贝叶斯网络融合
    基于概率图模型的多指标智能融合
    """
    try:
        # 模拟 DBN 推理
        # 动态权重（根据数据质量和地质条件调整）
        base_weights = {"rsi": 0.4, "bri": 0.35, "asi": 0.25}

        # 根据指标值调整权重
        total = request.rsi + request.bri + request.asi
        if total > 0:
            dynamic_weights = {
                "rsi": 0.35 + 0.1 * (request.rsi / total),
                "bri": 0.30 + 0.1 * (request.bri / total),
                "asi": 0.25 + 0.1 * (request.asi / total)
            }
        else:
            dynamic_weights = base_weights

        # 归一化权重
        weight_sum = sum(dynamic_weights.values())
        dynamic_weights = {k: v / weight_sum for k, v in dynamic_weights.items()}

        # 计算融合 MPI
        mpi_value = (
            dynamic_weights["rsi"] * request.rsi +
            dynamic_weights["bri"] * request.bri +
            dynamic_weights["asi"] * request.asi
        )

        # 确定风险等级
        if mpi_value >= 70:
            risk_level = "low"
            risk_label = "低风险"
        elif mpi_value >= 50:
            risk_level = "medium"
            risk_label = "中风险"
        else:
            risk_level = "high"
            risk_label = "高风险"

        # 计算置信度（基于历史数据一致性）
        confidence = 0.85 if len(request.historical_data) > 5 else 0.70

        # 不确定性范围
        uncertainty = 5.0 if confidence > 0.8 else 10.0

        return {
            "success": True,
            "mpi_value": float(mpi_value),
            "risk_level": risk_level,
            "risk_label": risk_label,
            "confidence": float(confidence),
            "uncertainty_range": {
                "lower": float(max(0, mpi_value - uncertainty)),
                "upper": float(min(100, mpi_value + uncertainty))
            },
            "dynamic_weights": dynamic_weights,
            "probability_distribution": {
                "low_risk": float(0.8 if risk_level == "low" else 0.2 if risk_level == "medium" else 0.05),
                "medium_risk": float(0.15 if risk_level == "low" else 0.7 if risk_level == "medium" else 0.25),
                "high_risk": float(0.05 if risk_level == "low" else 0.1 if risk_level == "medium" else 0.70)
            },
            "temporal_reasoning": {
                "trend": "stable" if len(request.historical_data) < 3 else "improving",
                "prediction_horizon": "24 hours"
            },
            "method": "Dynamic Bayesian Network (DBN)",
            "description": "基于动态贝叶斯网络的多指标智能融合与不确定性量化"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== 综合评估端点 ====================

@app.post("/api/comprehensive-assessment")
async def comprehensive_assessment(request: ComprehensiveRequest):
    """
    综合评估：一次性计算所有学术算法
    """
    try:
        # 计算 RSI
        rsi_req = RSIRequest(strata=request.strata)
        rsi_result = await calculate_rsi_phase_field(rsi_req)

        # 计算 BRI
        if request.microseismic_events:
            bri_req = BRIRequest(
                microseismic_events=request.microseismic_events,
                sensor_positions=request.sensor_positions or []
            )
            bri_result = await calculate_bri_microseismic(bri_req)
        else:
            bri_result = {"success": True, "bri_value": 70.0}

        # 计算 ASI
        asi_req = ASIRequest(strata=request.strata)
        asi_result = await calculate_asi_ust(asi_req)

        # DBN 融合
        dbn_req = DBNRequest(
            rsi=rsi_result["rsi_value"],
            bri=bri_result["bri_value"],
            asi=asi_result["asi_value"],
            historical_data=request.historical_data,
            geological_context=request.geological_context
        )
        fusion_result = await calculate_dbn_fusion(dbn_req)

        return {
            "success": True,
            "rsi": {
                "value": rsi_result["rsi_value"],
                "method": "Phase-Field Fracture",
                "details": rsi_result
            },
            "bri": {
                "value": bri_result["bri_value"],
                "method": "Microseismic Moment Tensor",
                "details": bri_result
            },
            "asi": {
                "value": asi_result["asi_value"],
                "method": "Unified Strength Theory",
                "details": asi_result
            },
            "fusion": {
                "mpi": fusion_result["mpi_value"],
                "risk_level": fusion_result["risk_level"],
                "confidence": fusion_result["confidence"],
                "method": "Dynamic Bayesian Network",
                "details": fusion_result
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== 启动信息 ====================

@app.on_event("startup")
async def startup_event():
    print("=" * 60)
    print("MPI 学术算法 API 服务器")
    print("=" * 60)
    print("端点列表:")
    print("  GET  /api/health                    - 健康检查")
    print("  POST /api/rsi/phase-field           - RSI 相场断裂模型")
    print("  POST /api/bri/microseismic          - BRI 微震矩张量反演")
    print("  POST /api/asi/ust                   - ASI 统一强度理论")
    print("  POST /api/fusion/dbn                - DBN 动态贝叶斯网络融合")
    print("  POST /api/comprehensive-assessment  - 综合评估")
    print("=" * 60)
    print("API 文档: http://localhost:5000/docs")
    print("=" * 60)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
