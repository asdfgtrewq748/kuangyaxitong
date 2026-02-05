"""
ASI指标计算模块 - Abutment Stress Index (支承压力分布指数)

当前版本：占位实现（基于经验影响函数）
目标版本：统一强度理论解析解 + 数值模拟代理模型

升级路线图：
1. v1.0 (当前): 经验影响函数 + 峰值估算
2. v2.0: 弹性力学解析解
3. v3.0: 统一强度理论解析解
4. v4.0: 数值模拟代理模型 (GPR)
"""

import numpy as np
from typing import Optional, Dict, Any, Tuple

from ..core.interfaces import BaseIndicator
from ..core.data_models import (
    GeologyModel, MonitoringData, IndicatorResult,
    GeologyLayerType
)


class ASIIndicator(BaseIndicator):
    """
    支承压力分布指数 (Abutment Stress Index)

    计算公式（占位版本）：
    ASI = 100 × (1 - (σ_max - σ_0) / σ_allow) × k_distribution

    其中：
    - σ_max: 支承压力峰值
    - σ_0: 原岩应力
    - σ_allow: 允许应力增量
    - k_distribution: 应力分布修正系数
    """

    def __init__(self):
        super().__init__(name="ASI", version="1.0-placeholder")
        self.config = {
            'peak_stress_factor': 2.5,     # 峰值应力集中系数
            'influence_distance': 30.0,     # 影响距离 (m)
            'plastic_zone_penalty': 0.85,   # 塑性区惩罚系数
            'allowable_stress_ratio': 2.0   # 允许应力比
        }

    def validate_input(self, geology: GeologyModel,
                       monitoring: Optional[MonitoringData] = None) -> bool:
        """验证输入数据"""
        # ASI需要煤层和开采参数
        has_coal = any(l.layer_type == GeologyLayerType.COAL
                      for l in geology.layers)
        has_mining_params = geology.mining_params is not None

        return has_coal and has_mining_params

    def compute(self, geology: GeologyModel,
                monitoring: Optional[MonitoringData] = None,
                **kwargs) -> IndicatorResult:
        """
        计算ASI值

        这是占位实现，使用经验影响函数。
        未来升级：统一强度理论解析解。
        """
        try:
            # 获取煤层和开采参数
            coal_layers = [l for l in geology.layers
                         if l.layer_type == GeologyLayerType.COAL]
            if not coal_layers:
                return self._error_result("未找到煤层")

            main_coal = coal_layers[0]
            mining = geology.mining_params

            # 计算应力分布
            stress_profile = self._compute_stress_distribution(
                geology, main_coal, mining
            )

            # 提取关键指标
            sigma_max = stress_profile['peak_stress']
            sigma_0 = stress_profile['virgin_stress']
            sigma_allow = sigma_0 * self.config['allowable_stress_ratio']

            # 基础ASI
            asi_base = 100 * (1 - (sigma_max - sigma_0) / (sigma_allow - sigma_0))

            # 应用修正系数
            k_plastic = self._plastic_zone_factor(stress_profile)
            k_distribution = self._distribution_factor(stress_profile)
            k_monitoring = self._monitoring_factor(monitoring, stress_profile)

            k_total = k_plastic * k_distribution * k_monitoring

            asi_value = max(0, min(100, asi_base * k_total))

            # 计算置信度
            confidence = self._compute_confidence(geology, monitoring)

            # 不确定性区间
            uncertainty = 12 + (1 - confidence) * 15
            asi_low = max(0, asi_value - uncertainty)
            asi_high = min(100, asi_value + uncertainty)

            return IndicatorResult(
                indicator_name="ASI",
                value=asi_value,
                confidence=confidence,
                uncertainty_range=(asi_low, asi_high),
                details={
                    'peak_stress': sigma_max,
                    'virgin_stress': sigma_0,
                    'allowable_stress': sigma_allow,
                    'stress_concentration': sigma_max / sigma_0,
                    'plastic_zone_factor': k_plastic,
                    'distribution_factor': k_distribution,
                    'monitoring_factor': k_monitoring,
                    'peak_location': stress_profile['peak_location']
                },
                intermediate_results={
                    'stress_profile': stress_profile,
                    'coal_properties': {
                        'cohesion': main_coal.cohesion,
                        'friction_angle': main_coal.friction_angle,
                        'elastic_modulus': main_coal.elastic_modulus
                    }
                }
            )

        except Exception as e:
            return self._error_result(f"计算错误: {str(e)}")

    def _compute_stress_distribution(self, geology: GeologyModel,
                                    coal_layer: Any,
                                    mining: Any) -> Dict:
        """
        计算支承压力分布（占位实现）

        使用简化经验模型：
        σ(x) = σ_0 + Δσ × exp(-x/L) × (x/x_peak)

        未来升级：统一强度理论解析解
        """
        # 原岩应力
        depth = (coal_layer.depth_top + coal_layer.depth_bottom) / 2
        sigma_0 = 0.025 * depth  # MPa

        # 峰值应力（经验公式）
        k_concentration = self.config['peak_stress_factor']

        # 考虑开采深度的影响
        depth_factor = 1.0 + (mining.mining_depth - 300) / 1000
        k_concentration *= max(0.8, min(1.5, depth_factor))

        sigma_max = sigma_0 * k_concentration

        # 峰值位置（经验值：煤壁前方5-10m）
        peak_location = 5.0 + mining.mining_depth / 200

        # 影响距离
        influence_distance = self.config['influence_distance']

        # 生成应力分布曲线
        x = np.linspace(0, 50, 100)  # 0-50m
        stress = sigma_0 + (sigma_max - sigma_0) * \
                 np.exp(-x / influence_distance) * \
                 (1 + x / peak_location) * np.exp(-x / peak_location)

        return {
            'distances': x,
            'stress_values': stress,
            'peak_stress': sigma_max,
            'virgin_stress': sigma_0,
            'peak_location': peak_location,
            'influence_distance': influence_distance
        }

    def _plastic_zone_factor(self, stress_profile: Dict) -> float:
        """塑性区影响系数（占位）"""
        # 简化：峰值应力越高，塑性区越大
        stress_ratio = stress_profile['peak_stress'] / stress_profile['virgin_stress']

        if stress_ratio > 3.0:
            return self.config['plastic_zone_penalty']
        elif stress_ratio > 2.5:
            return 0.90
        else:
            return 1.0

    def _distribution_factor(self, stress_profile: Dict) -> float:
        """应力分布形态系数"""
        # 峰值位置越靠近煤壁，分布越不利
        peak_loc = stress_profile['peak_location']

        if peak_loc < 3.0:
            return 0.90
        elif peak_loc > 15.0:
            return 0.95
        else:
            return 1.0

    def _monitoring_factor(self, monitoring: Optional[MonitoringData],
                          stress_profile: Dict) -> float:
        """监测数据修正系数（占位）"""
        if monitoring is None:
            return 1.0

        factor = 1.0

        # 应力测量数据对比
        stress_measurements = monitoring.stress_measurements
        if len(stress_measurements) > 0:
            # 如果有实测应力，可以校准模型
            # 这里简化处理
            factor = 0.95

        return factor

    def _compute_confidence(self, geology: GeologyModel,
                           monitoring: Optional[MonitoringData]) -> float:
        """计算置信度"""
        confidence = 0.65  # 基础置信度

        # 地质数据完整度
        if len(geology.layers) >= 3:
            confidence += 0.1

        # 有煤层的详细力学参数
        coal_layers = [l for l in geology.layers
                      if l.layer_type == GeologyLayerType.COAL]
        if coal_layers:
            coal = coal_layers[0]
            if coal.cohesion > 0 and coal.friction_angle > 0:
                confidence += 0.1

        # 有应力监测数据
        if monitoring and len(monitoring.stress_measurements) > 0:
            confidence += 0.15

        return min(0.9, confidence)

    def _error_result(self, message: str) -> IndicatorResult:
        """生成错误结果"""
        return IndicatorResult(
            indicator_name="ASI",
            value=50.0,
            confidence=0.0,
            is_valid=False,
            error_message=message
        )


class ASIIndicatorUST(ASIIndicator):
    """
    ASI指标 - 统一强度理论解析解版本（未来实现）

    功能：
    1. 基于统一强度理论(UST)的塑性区分析
    2. 考虑中间主应力效应
    3. 解析解计算（无需数值模拟）
    """

    def __init__(self):
        super().__init__()
        self.name = "ASI-UST"
        self.version = "3.0-future"

    def compute(self, geology: GeologyModel,
                monitoring: Optional[MonitoringData] = None,
                **kwargs) -> IndicatorResult:
        """UST解析解计算（TODO）"""
        raise NotImplementedError(
            "UST解析解版本将在后续实现。"
            "请使用 ASIIndicator 类获取占位结果。"
        )


class ASIIndicatorSurrogate(ASIIndicator):
    """
    ASI指标 - 代理模型版本（未来实现）

    功能：
    1. 高斯过程回归(GPR)代理模型
    2. 基于FLAC/UDEC数值模拟训练
    3. 毫秒级响应时间
    """

    def __init__(self):
        super().__init__()
        self.name = "ASI-Surrogate"
        self.version = "4.0-future"

    def compute(self, geology: GeologyModel,
                monitoring: Optional[MonitoringData] = None,
                **kwargs) -> IndicatorResult:
        """代理模型计算（TODO）"""
        raise NotImplementedError(
            "代理模型版本将在后续实现。"
            "请使用 ASIIndicator 类获取占位结果。"
        )
