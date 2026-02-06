"""
MPI (Mining Pressure Impact Index) 计算引擎

矿压影响指标计算模块，包含：
- RSI (Roof Stability Index) - 顶板稳定性指标
- BRI (Burst Risk Index) - 冲击地压风险指标
- ASI (Abutment Stress Index) - 支承压力分布指标
- MPI - 综合矿压影响指标
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Any
import numpy as np


@dataclass
class MPIConfig:
    """MPI计算配置"""

    # 权重配置
    weight_roof_stability: float = 0.4  # 顶板稳定性权重
    weight_burst_risk: float = 0.35  # 冲击地压风险权重
    weight_abutment_stress: float = 0.25  # 支承压力分布权重

    # 阈值配置
    critical_depth: float = 400.0  # 冲击地压临界深度 (m)
    soft_rock_threshold: float = 30.0  # 软岩抗压强度阈值 (MPa)
    key_layer_strength: float = 60.0  # 关键层抗压强度阈值 (MPa)
    key_layer_thickness: float = 5.0  # 关键层厚度阈值 (m)
    key_layer_modulus_ratio: float = 0.8  # 关键层模量比阈值

    # 参考模量
    reference_modulus: float = 35.0  # GPa

    def validate(self) -> None:
        """验证配置有效性"""
        total = (self.weight_roof_stability + self.weight_burst_risk +
                 self.weight_abutment_stress)
        if abs(total - 1.0) > 0.01:
            raise ValueError(f"权重总和必须为1.0，当前为: {total}")


@dataclass
class RockLayer:
    """岩层数据类"""
    thickness: float  # 厚度 m
    name: str = ""  # 岩性名称

    # 力学参数
    density: Optional[float] = None  # kg/m³
    bulk_modulus: Optional[float] = None  # GPa
    shear_modulus: Optional[float] = None  # GPa
    cohesion: Optional[float] = None  # MPa
    friction_angle: Optional[float] = None  # °
    tensile_strength: Optional[float] = None  # MPa
    compressive_strength: Optional[float] = None  # MPa
    elastic_modulus: Optional[float] = None  # GPa
    poisson_ratio: Optional[float] = None

    # 位置信息
    z_top: Optional[float] = None
    z_bottom: Optional[float] = None

    def has_parameter(self, param_name: str) -> bool:
        """检查是否有某个参数"""
        value = getattr(self, param_name, None)
        return value is not None and not np.isnan(value)

    def get_param(self, param_name: str, default: float = 0.0) -> float:
        """获取参数值"""
        value = getattr(self, param_name, None)
        if value is None or np.isnan(value):
            return default
        return float(value)


@dataclass
class PointData:
    """坐标点数据"""
    x: float
    y: float
    borehole: str = ""
    thickness: float = 0.0  # 煤层厚度 m
    burial_depth: float = 0.0  # 埋深 m
    z_top: float = 0.0
    z_bottom: float = 0.0
    strata: List[RockLayer] = None

    def __post_init__(self):
        if self.strata is None:
            self.strata = []


def identify_key_layers(strata: List[RockLayer], config: Optional[MPIConfig] = None) -> List[int]:
    """
    关键层识别（基于钱鸣高院士关键层理论）

    判定条件：
    1. 抗压强度 > 60 MPa（硬岩）
    2. 厚度 > 5 m（厚层）
    3. 弹性模量比 > 0.8（高刚度）

    Args:
        strata: 岩层列表（从下往上，即从煤层顶板开始）
        config: 配置参数

    Returns:
        关键层索引列表
    """
    if config is None:
        config = MPIConfig()

    key_layers = []

    for i, layer in enumerate(strata):
        is_hard = layer.get_param("compressive_strength", 0) > config.key_layer_strength
        is_thick = layer.thickness > config.key_layer_thickness

        # 弹性模量比
        if layer.has_parameter("elastic_modulus"):
            stiffness_ratio = layer.get_param("elastic_modulus", 0) / config.reference_modulus
            is_stiff = stiffness_ratio > config.key_layer_modulus_ratio
        else:
            is_stiff = False

        if is_hard and is_thick and is_stiff:
            key_layers.append(i)

    return key_layers


def calc_roof_stability(point: PointData, config: Optional[MPIConfig] = None) -> float:
    """
    顶板稳定性指标 (RSI - Roof Stability Index)

    计算要素：
    1. 直接顶抗拉强度评分（40%）- 厚度加权
    2. 关键层数量评分（30%）
    3. 岩层结构评分（30%）- 软岩比例

    Args:
        point: 坐标点数据
        config: 配置参数

    Returns:
        RSI得分 [0, 100]，分数越高越稳定
    """
    if config is None:
        config = MPIConfig()

    if not point.strata:
        return 50.0  # 无数据时返回中等分数

    # 1. 直接顶抗拉强度评分（取下面2层）
    immediate = point.strata[:2] if len(point.strata) >= 2 else point.strata
    total_thick = sum(l.thickness for l in immediate)

    if total_thick > 0:
        weighted_tensile = sum(
            l.get_param("tensile_strength", 0) * l.thickness
            for l in immediate
        ) / total_thick
        # 抗拉强度 4-8 MPa 为较好范围
        rsi_tensile = min(weighted_tensile / 8.0, 1.0) * 40
    else:
        rsi_tensile = 0

    # 2. 关键层数量评分
    key_layers = identify_key_layers(point.strata, config)
    rsi_key = min(len(key_layers) * 10, 30)  # 最多3个关键层给30分

    # 3. 岩层结构评分（软岩比例）
    total_thick = sum(l.thickness for l in point.strata)
    if total_thick > 0:
        soft_thick = sum(
            l.thickness for l in point.strata
            if l.get_param("compressive_strength", float('inf')) < config.soft_rock_threshold
        )
        soft_ratio = soft_thick / total_thick
        rsi_structure = (1 - soft_ratio) * 30
    else:
        rsi_structure = 0

    rsi = rsi_tensile + rsi_key + rsi_structure
    return _clamp(rsi, 0, 100)


def calc_burst_risk(point: PointData, config: Optional[MPIConfig] = None) -> float:
    """
    冲击地压风险指标 (BRI - Burst Risk Index)

    计算要素：
    1. 采深度因子（超过临界深度风险增加）
    2. 硬厚岩层能量积聚
    3. 煤层厚度影响

    Args:
        point: 坐标点数据
        config: 配置参数

    Returns:
        BRI得分 [0, 100]，分数越高风险越低
    """
    if config is None:
        config = MPIConfig()

    # 1. 采深度因子
    if point.burial_depth > config.critical_depth:
        depth_penalty = min((point.burial_depth - config.critical_depth) / 200, 1) * 40
    else:
        depth_penalty = 0

    # 2. 硬厚岩层能量积聚
    hard_rock_energy = 0
    for layer in point.strata:
        if layer.get_param("compressive_strength", 0) > 60:
            # 弹性模量 × 厚度 作为能量指标
            E = layer.get_param("elastic_modulus", 0)
            hard_rock_energy += E * layer.thickness

    hard_penalty = min(hard_rock_energy / 500, 1) * 30

    # 3. 煤层厚度因子
    thickness_penalty = min(point.thickness / 10, 1) * 30

    # 风险越高分越低，所以用100减去罚分
    bri = 100 - depth_penalty - hard_penalty - thickness_penalty
    return _clamp(bri, 0, 100)


def calc_abutment_stress(point: PointData, config: Optional[MPIConfig] = None) -> float:
    """
    支承压力分布指标 (ASI - Abutment Stress Index)

    计算要素：
    1. 综合刚度评分（50%）
    2. 内摩擦角评分（50%）

    Args:
        point: 坐标点数据
        config: 配置参数

    Returns:
        ASI得分 [0, 100]，分数越高应力分布越合理
    """
    if config is None:
        config = MPIConfig()

    if not point.strata:
        return 50.0

    total_thick = sum(l.thickness for l in point.strata)
    if total_thick == 0:
        return 50.0

    # 1. 综合刚度评分
    avg_stiffness = sum(
        l.get_param("elastic_modulus", config.reference_modulus) * l.thickness
        for l in point.strata
    ) / total_thick
    stiffness_score = min(avg_stiffness / config.reference_modulus * 50, 50)

    # 2. 内摩擦角评分
    avg_friction = sum(
        l.get_param("friction_angle", 25) * l.thickness
        for l in point.strata
    ) / total_thick
    # 20°-45° 范围映射到 0-50 分
    friction_score = max(min((avg_friction - 20) / 25 * 50, 50), 0)

    asi = stiffness_score + friction_score
    return _clamp(asi, 0, 100)


def calc_mpi(
    point: PointData,
    config: Optional[MPIConfig] = None,
    weights: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    计算综合矿压影响指标（MPI）

    Args:
        point: 坐标点数据
        config: 配置参数
        weights: 自定义权重 {roof_stability, burst_risk, abutment_stress}

    Returns:
        {
            "mpi": float,           # 综合MPI值 [0, 100]
            "breakdown": {          # 分项得分
                "rsi": float,       # 顶板稳定性
                "bri": float,       # 冲击地压风险
                "asi": float        # 支承压力分布
            }
        }
    """
    if config is None:
        config = MPIConfig()

    # 应用自定义权重
    if weights:
        config.weight_roof_stability = weights.get("roof_stability", config.weight_roof_stability)
        config.weight_burst_risk = weights.get("burst_risk", config.weight_burst_risk)
        config.weight_abutment_stress = weights.get("abutment_stress", config.weight_abutment_stress)
        config.validate()

    # 计算三个子指标
    rsi = calc_roof_stability(point, config)
    bri = calc_burst_risk(point, config)
    asi = calc_abutment_stress(point, config)

    # 加权综合
    mpi = (
        config.weight_roof_stability * rsi +
        config.weight_burst_risk * bri +
        config.weight_abutment_stress * asi
    )

    return {
        "mpi": round(mpi, 2),
        "breakdown": {
            "rsi": round(rsi, 2),
            "bri": round(bri, 2),
            "asi": round(asi, 2)
        }
    }


def calc_all_indicators(
    point: PointData,
    config: Optional[MPIConfig] = None,
    weights: Optional[Dict[str, float]] = None
) -> Dict[str, float]:
    """
    一次性计算 RSI / BRI / ASI / MPI 四项指标。

    Args:
        point: 坐标点数据
        config: MPI配置
        weights: 可选权重，支持两套键名：
            - {rsi, bri, asi}
            - {roof_stability, burst_risk, abutment_stress}

    Returns:
        {"rsi": float, "bri": float, "asi": float, "mpi": float}
    """
    cfg = config if config is not None else MPIConfig()

    # Local weights override, normalized to avoid validation failure.
    if weights:
        w_rsi = float(weights.get("rsi", weights.get("roof_stability", cfg.weight_roof_stability)))
        w_bri = float(weights.get("bri", weights.get("burst_risk", cfg.weight_burst_risk)))
        w_asi = float(weights.get("asi", weights.get("abutment_stress", cfg.weight_abutment_stress)))
        total = w_rsi + w_bri + w_asi
        if total > 0:
            cfg.weight_roof_stability = w_rsi / total
            cfg.weight_burst_risk = w_bri / total
            cfg.weight_abutment_stress = w_asi / total

    rsi = calc_roof_stability(point, cfg)
    bri = calc_burst_risk(point, cfg)
    asi = calc_abutment_stress(point, cfg)
    mpi = (
        cfg.weight_roof_stability * rsi +
        cfg.weight_burst_risk * bri +
        cfg.weight_abutment_stress * asi
    )

    return {
        "rsi": round(_clamp(float(rsi), 0.0, 100.0), 4),
        "bri": round(_clamp(float(bri), 0.0, 100.0), 4),
        "asi": round(_clamp(float(asi), 0.0, 100.0), 4),
        "mpi": round(_clamp(float(mpi), 0.0, 100.0), 4),
    }


def calc_mpi_batch(
    points_data: Dict[str, Dict[str, Any]],
    config: Optional[MPIConfig] = None,
    weights: Optional[Dict[str, float]] = None
) -> Dict[str, Dict[str, Any]]:
    """
    批量计算MPI

    Args:
        points_data: {point_id: {point, strata}, ...}
        config: 配置参数
        weights: 自定义权重

    Returns:
        {point_id: {mpi, breakdown}, ...}
    """
    results = {}

    for pid, data in points_data.items():
        point = _parse_point_data(data)
        results[pid] = calc_mpi(point, config, weights)

    return results


def _parse_point_data(data: Dict[str, Any]) -> PointData:
    """解析点数据"""
    strata_data = data.get("strata", [])
    strata = []

    for layer_data in strata_data:
        # 支持字典和RockLayer对象
        if isinstance(layer_data, dict):
            layer = RockLayer(**layer_data)
        else:
            layer = layer_data
        strata.append(layer)

    return PointData(
        x=data.get("x", 0),
        y=data.get("y", 0),
        borehole=data.get("borehole", ""),
        thickness=data.get("thickness", 0),
        burial_depth=data.get("burial_depth", 0),
        z_top=data.get("z_top", 0),
        z_bottom=data.get("z_bottom", 0),
        strata=strata,
    )


def _clamp(value: float, min_val: float, max_val: float) -> float:
    """限制数值范围"""
    return max(min_val, min(max_val, value))
