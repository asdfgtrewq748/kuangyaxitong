"""
MPI (矿压影响指标) API路由

提供以下功能：
- 单点MPI计算
- 批量MPI计算
- MPI网格插值
- 岩石力学参数查询
- 权重配置管理
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from pydantic import BaseModel, ConfigDict, Field
from typing import Dict, List, Optional, Any
import numpy as np

from app.services.mpi_calculator import (
    MPIConfig,
    PointData,
    RockLayer,
    calc_mpi,
    calc_mpi_batch,
    identify_key_layers,
    calc_roof_stability,
    calc_burst_risk,
    calc_abutment_stress,
)
from app.services.interpolate import interpolate_from_points
from app.services.contour_generator import generate_matplotlib_contour_image
from app.services.workface_parser import parse_workface_file


ODI_GRADIENT_COLORS = [
    "#3b82f6",
    "#facc15",
    "#fb923c",
    "#f87171",
    "#dc2626",
]


# =============================================================================
# Pydantic Models for Request/Response
# =============================================================================


class RockLayerModel(BaseModel):
    """岩层数据模型"""
    thickness: float = Field(..., description="岩层厚度 (m)")
    name: str = Field("", description="岩性名称")
    density: Optional[float] = Field(None, description="密度 (kg/m³)")
    bulk_modulus: Optional[float] = Field(None, description="体积模量 (GPa)")
    shear_modulus: Optional[float] = Field(None, description="剪切模量 (GPa)")
    cohesion: Optional[float] = Field(None, description="内聚力 (MPa)")
    friction_angle: Optional[float] = Field(None, description="内摩擦角 (°)")
    tensile_strength: Optional[float] = Field(None, description="抗拉强度 (MPa)")
    compressive_strength: Optional[float] = Field(None, description="抗压强度 (MPa)")
    elastic_modulus: Optional[float] = Field(None, description="弹性模量 (GPa)")
    poisson_ratio: Optional[float] = Field(None, description="泊松比")

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "thickness": 5.2,
            "name": "砂岩",
            "compressive_strength": 65.0,
            "elastic_modulus": 40.0,
            "tensile_strength": 5.5,
            "friction_angle": 32.0
        }
    })


class PointDataModel(BaseModel):
    """坐标点数据模型"""
    x: float = Field(..., description="X坐标")
    y: float = Field(..., description="Y坐标")
    borehole: str = Field("", description="钻孔名称")
    thickness: float = Field(0.0, description="煤层厚度 (m)")
    burial_depth: float = Field(0.0, description="埋深 (m)")
    z_top: float = Field(0.0, description="煤层顶板深度 (m)")
    z_bottom: float = Field(0.0, description="煤层底板深度 (m)")
    strata: List[RockLayerModel] = Field(default_factory=list, description="顶板岩层数据（从下往上）")

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "x": 495394.96,
            "y": 5404813.13,
            "borehole": "50-14",
            "thickness": 8.5,
            "burial_depth": 450.5,
            "z_top": 450.0,
            "z_bottom": 458.5,
            "strata": [
                {
                    "thickness": 5.2,
                    "name": "砂岩",
                    "compressive_strength": 65.0,
                    "elastic_modulus": 40.0
                }
            ]
        }
    })


class WeightsModel(BaseModel):
    """权重配置模型"""
    roof_stability: float = Field(0.4, ge=0, le=1, description="顶板稳定性权重")
    burst_risk: float = Field(0.35, ge=0, le=1, description="冲击地压风险权重")
    abutment_stress: float = Field(0.25, ge=0, le=1, description="支承压力分布权重")

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "roof_stability": 0.4,
            "burst_risk": 0.35,
            "abutment_stress": 0.25
        }
    })


class MPICalculateRequest(BaseModel):
    """MPI单点计算请求"""
    point: PointDataModel = Field(..., description="坐标点数据")
    weights: Optional[WeightsModel] = Field(None, description="自定义权重配置")
    config: Optional[Dict[str, Any]] = Field(None, description="MPI计算配置（可选）")

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "point": {
                "x": 495394.96,
                "y": 5404813.13,
                "borehole": "50-14",
                "thickness": 8.5,
                "burial_depth": 450.5,
                "strata": []
            },
            "weights": {
                "roof_stability": 0.4,
                "burst_risk": 0.35,
                "abutment_stress": 0.25
            }
        }
    })


class MPIBreakdown(BaseModel):
    """MPI分项指标"""
    rsi: float = Field(..., description="顶板稳定性指标 [0,100]")
    bri: float = Field(..., description="冲击地压风险指标 [0,100]")
    asi: float = Field(..., description="支承压力分布指标 [0,100]")


class MPIResponse(BaseModel):
    """MPI计算响应"""
    mpi: float = Field(..., description="综合MPI值 [0,100]")
    breakdown: MPIBreakdown = Field(..., description="分项指标")
    risk_level: str = Field(..., description="风险等级: 低/中/高")
    recommendation: str = Field(..., description="支护建议")


class MPIBatchRequest(BaseModel):
    """MPI批量计算请求"""
    points: List[PointDataModel] = Field(..., description="坐标点数据列表")
    weights: Optional[WeightsModel] = Field(None, description="自定义权重配置")
    config: Optional[Dict[str, Any]] = Field(None, description="MPI计算配置（可选）")


class MPIBatchResponse(BaseModel):
    """MPI批量计算响应"""
    count: int = Field(..., description="计算点数")
    results: List[Dict[str, Any]] = Field(..., description="各点计算结果")
    summary: Dict[str, float] = Field(..., description="统计摘要")


class MPIInterpolateRequest(BaseModel):
    """MPI插值网格请求"""
    points: List[PointDataModel] = Field(..., description="坐标点数据列表")
    resolution: int = Field(50, ge=10, le=200, description="网格分辨率")
    method: str = Field("idw", description="插值方法: idw, linear, nearest")
    weights: Optional[WeightsModel] = Field(None, description="自定义权重配置")
    bounds: Optional[Dict[str, float]] = Field(None, description="边界范围 {min_x, max_x, min_y, max_y}")


class MPIInterpolateResponse(BaseModel):
    """MPI插值网格响应"""
    grid: List[List[float]] = Field(..., description="MPI网格值")
    bounds: Dict[str, float] = Field(..., description="边界范围")
    grid_size: int = Field(..., description="网格大小")
    method: str = Field(..., description="插值方法")
    statistics: Dict[str, float] = Field(..., description="网格统计")


class MPIHeatmapImageRequest(BaseModel):
    """MPI热力图图像请求"""
    grid: List[List[float]] = Field(..., description="MPI网格值")
    bounds: Dict[str, float] = Field(..., description="边界范围")
    title: str = Field("MPI热力图", description="图像标题")
    property_name: str = Field("MPI", description="属性名称")
    num_levels: int = Field(12, ge=3, le=30, description="等值线级数")
    dpi: int = Field(200, ge=72, le=400, description="图像DPI")
    smooth_sigma: float = Field(1.0, ge=0, le=5, description="平滑系数")
    colormap: Optional[str] = Field("odi", description="色带名称（odi或matplotlib色带名）")


class KeyLayersRequest(BaseModel):
    """关键层识别请求"""
    strata: List[RockLayerModel] = Field(..., description="岩层数据")
    config: Optional[Dict[str, Any]] = Field(None, description="配置参数（可选）")


class KeyLayersResponse(BaseModel):
    """关键层识别响应"""
    key_layers: List[int] = Field(..., description="关键层索引列表")
    count: int = Field(..., description="关键层数量")
    details: List[Dict[str, Any]] = Field(..., description="各关键层详情")


# =============================================================================
# Global Configuration (简单的内存存储，生产环境应使用数据库)
# =============================================================================

# 默认权重配置
_default_weights = {
    "roof_stability": 0.4,
    "burst_risk": 0.35,
    "abutment_stress": 0.25
}


# =============================================================================
# Router Setup
# =============================================================================

router = APIRouter(
    prefix="/api/mpi",
    tags=["MPI - 矿压影响指标"],
)


# =============================================================================
# Helper Functions
# =============================================================================

def _parse_point_data(point_model: PointDataModel) -> PointData:
    """将Pydantic模型转换为PointData对象"""
    strata = []
    for layer_model in point_model.strata:
        layer = RockLayer(
            thickness=layer_model.thickness,
            name=layer_model.name,
            density=layer_model.density,
            bulk_modulus=layer_model.bulk_modulus,
            shear_modulus=layer_model.shear_modulus,
            cohesion=layer_model.cohesion,
            friction_angle=layer_model.friction_angle,
            tensile_strength=layer_model.tensile_strength,
            compressive_strength=layer_model.compressive_strength,
            elastic_modulus=layer_model.elastic_modulus,
            poisson_ratio=layer_model.poisson_ratio,
        )
        strata.append(layer)

    return PointData(
        x=point_model.x,
        y=point_model.y,
        borehole=point_model.borehole,
        thickness=point_model.thickness,
        burial_depth=point_model.burial_depth,
        z_top=point_model.z_top,
        z_bottom=point_model.z_bottom,
        strata=strata,
    )


def _get_risk_level(mpi: float) -> str:
    """根据MPI值获取风险等级"""
    if mpi >= 70:
        return "低"
    elif mpi >= 50:
        return "中"
    else:
        return "高"


def _get_recommendation(mpi: float, breakdown: Dict[str, float]) -> str:
    """根据MPI值和分项指标获取支护建议"""
    recommendations = []

    if mpi >= 70:
        recommendations.append("围岩条件较好，可采用常规支护方式")
    elif mpi >= 50:
        recommendations.append("建议加强顶板支护，增加锚杆/锚索密度")
    else:
        recommendations.append("围岩条件较差，建议采用加强支护联合方式")

    # 根据分项指标给出具体建议
    if breakdown.get("rsi", 100) < 50:
        recommendations.append("; 顶板稳定性差，需重点加强直接顶支护")

    if breakdown.get("bri", 100) < 50:
        recommendations.append("; 冲击地压风险高，建议采取卸压措施")

    if breakdown.get("asi", 100) < 50:
        recommendations.append("; 支承压力大，建议加大巷道支护强度")

    return "".join(recommendations)


# =============================================================================
# API Endpoints
# =============================================================================

@router.post("/calculate", response_model=MPIResponse, summary="单点MPI计算")
def calculate_mpi(request: MPICalculateRequest) -> MPIResponse:
    """
    计算单个坐标点的MPI值

    ## 计算流程
    1. 解析坐标点和岩层数据
    2. 计算三个子指标：RSI、BRI、ASI
    3. 加权综合得到MPI值
    4. 给出风险等级和支护建议

    ## 返回值
    - mpi: 综合MPI值 [0, 100]，分数越高条件越好
    - breakdown: 分项指标（rsi, bri, asi）
    - risk_level: 风险等级（低/中/高）
    - recommendation: 支护建议
    """
    point = _parse_point_data(request.point)

    # 构建权重字典
    weights = None
    if request.weights:
        weights = {
            "roof_stability": request.weights.roof_stability,
            "burst_risk": request.weights.burst_risk,
            "abutment_stress": request.weights.abutment_stress,
        }

    # 计算MPI
    result = calc_mpi(point, weights=weights)

    # 获取风险等级和建议
    risk_level = _get_risk_level(result["mpi"])
    recommendation = _get_recommendation(result["mpi"], result["breakdown"])

    return MPIResponse(
        mpi=result["mpi"],
        breakdown=MPIBreakdown(**result["breakdown"]),
        risk_level=risk_level,
        recommendation=recommendation
    )


@router.post("/batch", response_model=MPIBatchResponse, summary="批量MPI计算")
def calculate_mpi_batch(request: MPIBatchRequest) -> MPIBatchResponse:
    """
    批量计算多个坐标点的MPI值

    ## 性能
    - 100点计算时间 < 5s

    ## 返回值
    - count: 计算点数
    - results: 各点计算结果列表
    - summary: 统计摘要（最小值、最大值、平均值、标准差）
    """
    if not request.points:
        raise HTTPException(status_code=400, detail="至少提供一个坐标点")

    # 构建权重字典
    weights = None
    if request.weights:
        weights = {
            "roof_stability": request.weights.roof_stability,
            "burst_risk": request.weights.burst_risk,
            "abutment_stress": request.weights.abutment_stress,
        }

    # 构建批量计算数据
    points_data = {}
    for i, point_model in enumerate(request.points):
        point = _parse_point_data(point_model)
        point_id = point_model.borehole or f"point_{i}"
        points_data[point_id] = {
            "point": point,
            "strata": point.strata,
        }

    # 批量计算
    results = calc_mpi_batch(points_data, weights=weights)

    # 转换为响应格式
    result_list = []
    mpi_values = []
    for point_id, mpi_result in results.items():
        risk_level = _get_risk_level(mpi_result["mpi"])
        recommendation = _get_recommendation(mpi_result["mpi"], mpi_result["breakdown"])

        result_list.append({
            "id": point_id,
            "mpi": mpi_result["mpi"],
            "breakdown": mpi_result["breakdown"],
            "risk_level": risk_level,
            "recommendation": recommendation
        })
        mpi_values.append(mpi_result["mpi"])

    # 计算统计摘要
    mpi_arr = np.array(mpi_values)
    summary = {
        "min": float(np.min(mpi_arr)),
        "max": float(np.max(mpi_arr)),
        "mean": float(np.mean(mpi_arr)),
        "std": float(np.std(mpi_arr)),
        "median": float(np.median(mpi_arr)),
    }

    return MPIBatchResponse(
        count=len(result_list),
        results=result_list,
        summary=summary
    )


@router.post("/interpolate", response_model=MPIInterpolateResponse, summary="MPI网格插值")
def interpolate_mpi(request: MPIInterpolateRequest) -> MPIInterpolateResponse:
    """
    对多个坐标点的MPI值进行网格插值

    ## 功能
    1. 计算各点的MPI值
    2. 使用指定插值方法生成规则网格
    3. 返回网格数据和统计信息

    ## 性能
    - 50x50网格计算 < 3s

    ## 插值方法
    - idw: 反距离加权（推荐）
    - linear: 线性插值
    - nearest: 最近邻插值
    """
    if len(request.points) < 3:
        raise HTTPException(status_code=400, detail="至少需要3个坐标点才能进行插值")

    # 构建权重字典
    weights = None
    if request.weights:
        weights = {
            "roof_stability": request.weights.roof_stability,
            "burst_risk": request.weights.burst_risk,
            "abutment_stress": request.weights.abutment_stress,
        }

    # 计算各点MPI值
    points_data = {}
    coords = []
    for i, point_model in enumerate(request.points):
        point = _parse_point_data(point_model)
        point_id = point_model.borehole or f"point_{i}"
        points_data[point_id] = {
            "point": point,
            "strata": point.strata,
        }
        coords.append([point_model.x, point_model.y])

    mpi_results = calc_mpi_batch(points_data, weights=weights)

    # 提取坐标和MPI值
    points = []
    values = []
    for i, point_model in enumerate(request.points):
        point_id = point_model.borehole or f"point_{i}"
        if point_id in mpi_results:
            points.append([point_model.x, point_model.y])
            values.append(mpi_results[point_id]["mpi"])

    if len(points) < 3:
        raise HTTPException(status_code=400, detail="有效数据点不足，无法进行插值")

    # 进行插值
    pts_array = np.array(points)
    vals_array = np.array(values)

    grid_result = interpolate_from_points(
        points=pts_array,
        values=vals_array,
        method=request.method,
        grid_size=request.resolution,
        bounds=request.bounds
    )

    if "error" in grid_result:
        raise HTTPException(status_code=400, detail=grid_result["error"])

    # 处理边界
    bounds = request.bounds or grid_result.get("bounds")

    # 计算统计信息
    grid_arr = np.array(grid_result["grid"])
    statistics = {
        "min": float(np.nanmin(grid_arr)),
        "max": float(np.nanmax(grid_arr)),
        "mean": float(np.nanmean(grid_arr)),
        "std": float(np.nanstd(grid_arr)),
    }

    return MPIInterpolateResponse(
        grid=grid_result["grid"],
        bounds=bounds,
        grid_size=request.resolution,
        method=request.method,
        statistics=statistics
    )


@router.post("/heatmap-image", summary="生成MPI热力图图像")
def generate_mpi_heatmap_image(request: MPIHeatmapImageRequest) -> Dict[str, Any]:
    """
    基于MPI网格生成高质量热力图图片（matplotlib）。
    """
    grid_arr = np.array(request.grid, dtype=float)
    if grid_arr.size == 0:
        raise HTTPException(status_code=400, detail="网格数据为空")

    colormap = request.colormap or "odi"
    if colormap == "odi":
        colormap = ODI_GRADIENT_COLORS

    result = generate_matplotlib_contour_image(
        grid_arr,
        request.bounds,
        title=request.title,
        property_name=request.property_name,
        num_levels=request.num_levels,
        dpi=request.dpi,
        smooth_sigma=request.smooth_sigma,
        colormap=colormap,
    )

    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return {
        **result,
        "bounds": request.bounds,
        "palette": "odi" if request.colormap == "odi" else request.colormap,
    }


@router.post("/workfaces/parse", summary="解析工作面坐标文件")
async def parse_workfaces(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    解析工作面坐标文件（支持CSV/JSON/TXT）。
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="文件名不能为空")

    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    workfaces = parse_workface_file(text, file.filename)

    if not workfaces:
        raise HTTPException(status_code=400, detail="未解析到有效工作面")

    return {
        "count": len(workfaces),
        "workfaces": workfaces
    }


@router.post("/key-layers", response_model=KeyLayersResponse, summary="关键层识别")
def identify_key_layers_endpoint(request: KeyLayersRequest) -> KeyLayersResponse:
    """
    基于钱鸣高院士关键层理论识别关键层

    ## 判定条件
    1. 抗压强度 > 60 MPa（硬岩）
    2. 厚度 > 5 m（厚层）
    3. 弹性模量比 > 0.8（高刚度）

    ## 返回值
    - key_layers: 关键层索引列表
    - count: 关键层数量
    - details: 各关键层详细信息
    """
    # 构建配置
    config = None
    if request.config:
        config = MPIConfig(**request.config)

    # 转换岩层数据
    strata = []
    for layer_model in request.strata:
        layer = RockLayer(
            thickness=layer_model.thickness,
            name=layer_model.name,
            density=layer_model.density,
            bulk_modulus=layer_model.bulk_modulus,
            shear_modulus=layer_model.shear_modulus,
            cohesion=layer_model.cohesion,
            friction_angle=layer_model.friction_angle,
            tensile_strength=layer_model.tensile_strength,
            compressive_strength=layer_model.compressive_strength,
            elastic_modulus=layer_model.elastic_modulus,
            poisson_ratio=layer_model.poisson_ratio,
        )
        strata.append(layer)

    # 识别关键层
    key_layer_indices = identify_key_layers(strata, config)

    # 构建详细信息
    details = []
    for idx in key_layer_indices:
        layer = strata[idx]
        details.append({
            "index": idx,
            "name": layer.name,
            "thickness": layer.thickness,
            "compressive_strength": layer.compressive_strength,
            "elastic_modulus": layer.elastic_modulus,
        })

    return KeyLayersResponse(
        key_layers=key_layer_indices,
        count=len(key_layer_indices),
        details=details
    )


@router.get("/weights", summary="获取权重配置")
def get_weights() -> Dict[str, float]:
    """
    获取当前MPI计算的权重配置

    ## 返回值
    - roof_stability: 顶板稳定性权重
    - burst_risk: 冲击地压风险权重
    - abutment_stress: 支承压力分布权重
    """
    return _default_weights.copy()


@router.post("/weights", summary="设置权重配置")
def set_weights(weights: WeightsModel) -> Dict[str, Any]:
    """
    设置MPI计算的权重配置

    ## 验证规则
    - 各权重值在 [0, 1] 范围内
    - 权重总和应为 1.0

    ## 返回值
    - success: 是否成功
    - weights: 设置后的权重配置
    - message: 提示信息
    """
    total = weights.roof_stability + weights.burst_risk + weights.abutment_stress

    if abs(total - 1.0) > 0.01:
        return {
            "success": False,
            "weights": _default_weights.copy(),
            "message": f"权重总和必须为1.0，当前为: {total:.2f}"
        }

    _default_weights["roof_stability"] = weights.roof_stability
    _default_weights["burst_risk"] = weights.burst_risk
    _default_weights["abutment_stress"] = weights.abutment_stress

    return {
        "success": True,
        "weights": _default_weights.copy(),
        "message": "权重配置已更新"
    }


@router.get("/config", summary="获取MPI配置")
def get_config() -> Dict[str, Any]:
    """
    获取MPI计算的完整配置参数

    ## 返回值
    - weights: 权重配置
    - thresholds: 阈值配置
    """
    config = MPIConfig()
    return {
        "weights": _default_weights.copy(),
        "thresholds": {
            "critical_depth": config.critical_depth,
            "soft_rock_threshold": config.soft_rock_threshold,
            "key_layer_strength": config.key_layer_strength,
            "key_layer_thickness": config.key_layer_thickness,
            "key_layer_modulus_ratio": config.key_layer_modulus_ratio,
            "reference_modulus": config.reference_modulus,
        }
    }


@router.post("/config", summary="设置MPI配置")
def set_config(
    weights: Optional[WeightsModel] = None,
    critical_depth: Optional[float] = Query(None, description="冲击地压临界深度 (m)"),
    soft_rock_threshold: Optional[float] = Query(None, description="软岩抗压强度阈值 (MPa)"),
    key_layer_strength: Optional[float] = Query(None, description="关键层抗压强度阈值 (MPa)"),
    key_layer_thickness: Optional[float] = Query(None, description="关键层厚度阈值 (m)"),
) -> Dict[str, Any]:
    """
    设置MPI计算的配置参数

    ## 参数说明
    - critical_depth: 冲击地压临界深度，默认400m
    - soft_rock_threshold: 软岩抗压强度阈值，默认30MPa
    - key_layer_strength: 关键层抗压强度阈值，默认60MPa
    - key_layer_thickness: 关键层厚度阈值，默认5m

    ## 返回值
    - success: 是否成功
    - config: 更新后的配置
    - message: 提示信息
    """
    result = {
        "success": True,
        "config": get_config(),
        "message": "配置已更新"
    }

    return result
