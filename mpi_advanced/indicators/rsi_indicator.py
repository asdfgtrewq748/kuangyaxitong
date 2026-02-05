"""
RSI指标计算模块 - Roof Stability Index (顶板稳定性指数)

当前版本：占位实现（基于简化梁理论）
目标版本：相场断裂模型 (Phase-Field Fracture Model)

升级路线图：
1. v1.0 (当前): 简化梁理论 + 经验修正
2. v2.0: 弹性地基梁模型
3. v3.0: 关键层理论 + 损伤力学
4. v4.0: 相场断裂模型 (Phase-Field)
"""

import numpy as np
from typing import Optional, Dict, Any

from ..core.interfaces import BaseIndicator
from ..core.data_models import (
    GeologyModel, MonitoringData, IndicatorResult,
    GeologyLayerType
)


class RSIIndicator(BaseIndicator):
    """
    顶板稳定性指数 (Roof Stability Index)

    计算公式（占位版本）：
    RSI = 100 × (1 - w_max / w_limit) × k_adjust

    其中：
    - w_max: 最大挠度 (m)
    - w_limit: 极限挠度 (m)
    - k_adjust: 综合修正系数
    """

    def __init__(self):
        super().__init__(name="RSI", version="1.0-placeholder")
        self.config = {
            'safety_factor': 1.5,
            'limit_deflection_ratio': 0.1,  # 跨度/挠度比限制
            'key_layer_weight': 0.6,         # 关键层权重
            'immediate_roof_weight': 0.4     # 直接顶权重
        }

    def validate_input(self, geology: GeologyModel,
                       monitoring: Optional[MonitoringData] = None) -> bool:
        """验证输入数据"""
        if not geology.layers:
            return False

        # 检查是否有顶板岩层
        roof_layers = [l for l in geology.layers
                      if l.layer_type != GeologyLayerType.COAL]
        return len(roof_layers) > 0

    def compute(self, geology: GeologyModel,
                monitoring: Optional[MonitoringData] = None,
                **kwargs) -> IndicatorResult:
        """
        计算RSI值

        这是占位实现，使用简化公式。
        未来升级：替换为相场断裂模型。
        """
        try:
            # 获取顶板岩层
            roof_layers = self._get_roof_layers(geology)
            if not roof_layers:
                return self._error_result("未找到顶板岩层")

            # 计算等效参数
            E_eq, h_eq = self._compute_equivalent_parameters(roof_layers)

            # 计算挠度（简化梁公式）
            span = geology.mining_params.panel_width
            load = self._compute_load(roof_layers)

            w_max = self._compute_deflection(span, h_eq, E_eq, load)
            w_limit = span * self.config['limit_deflection_ratio']

            # 计算基础RSI
            rsi_base = 100 * (1 - w_max / w_limit)

            # 应用修正系数
            k_key = self._key_layer_factor(roof_layers)
            k_mining = self._mining_depth_factor(geology.mining_params.mining_depth)
            k_structural = self._structural_factor(geology)

            k_adjust = k_key * k_mining * k_structural

            rsi_value = max(0, min(100, rsi_base * k_adjust))

            # 计算置信度
            confidence = self._compute_confidence(geology, monitoring)

            # 不确定性区间（简化）
            uncertainty = 10 + (100 - confidence * 100) * 0.5
            rsi_low = max(0, rsi_value - uncertainty)
            rsi_high = min(100, rsi_value + uncertainty)

            return IndicatorResult(
                indicator_name="RSI",
                value=rsi_value,
                confidence=confidence,
                uncertainty_range=(rsi_low, rsi_high),
                details={
                    'deflection_max': w_max,
                    'deflection_limit': w_limit,
                    'adjustment_factor': k_adjust,
                    'key_layer_factor': k_key,
                    'mining_depth_factor': k_mining,
                    'structural_factor': k_structural,
                    'equivalent_thickness': h_eq,
                    'equivalent_modulus': E_eq
                },
                intermediate_results={
                    'roof_layers': [(l.name, l.thickness) for l in roof_layers],
                    'load_distribution': load
                }
            )

        except Exception as e:
            return self._error_result(f"计算错误: {str(e)}")

    def _get_roof_layers(self, geology: GeologyModel) -> list:
        """获取煤层上方的顶板岩层"""
        coal_layers = [l for l in geology.layers
                      if l.layer_type == GeologyLayerType.COAL]
        if not coal_layers:
            return [l for l in geology.layers if l.depth_bottom > 0]

        # 获取主煤层深度
        main_coal_depth = coal_layers[0].depth_bottom

        # 获取上方岩层
        return [l for l in geology.layers
                if l.depth_top >= main_coal_depth]

    def _compute_equivalent_parameters(self, layers: list) -> tuple:
        """计算等效弹性模量和厚度"""
        total_thickness = sum(l.thickness for l in layers)

        # 加权平均弹性模量
        E_eq = sum(l.elastic_modulus * l.thickness for l in layers) / total_thickness

        return E_eq, total_thickness

    def _compute_deflection(self, span: float, thickness: float,
                           E: float, load: float) -> float:
        """
        计算简支梁最大挠度

        w_max = 5 * q * L^4 / (384 * E * I)
        其中 I = b * h^3 / 12 (取单位宽度 b=1)
        """
        I = thickness ** 3 / 12  # 截面惯性矩

        w_max = 5 * load * span ** 4 / (384 * E * I)

        return w_max

    def _compute_load(self, layers: list) -> float:
        """计算顶板承受的载荷（上覆岩层重量）"""
        g = 9.81
        load = sum(l.density * g * l.thickness for l in layers)
        return load

    def _key_layer_factor(self, layers: list) -> float:
        """
        关键层影响系数（占位实现）

        未来升级：使用图神经网络识别关键层
        """
        # 简单启发式：厚硬砂岩层是关键层
        key_layers = [l for l in layers
                     if l.layer_type == GeologyLayerType.SANDSTONE
                     and l.thickness > 5.0
                     and l.elastic_modulus > 15e9]

        if not key_layers:
            return 0.9  # 无明显关键层

        # 关键层越厚越硬，稳定性越好
        key_thickness = sum(l.thickness for l in key_layers)
        total_thickness = sum(l.thickness for l in layers)

        factor = 1.0 + 0.3 * (key_thickness / total_thickness)
        return min(1.3, factor)

    def _mining_depth_factor(self, depth: float) -> float:
        """开采深度影响系数"""
        # 深度越大，地应力越高，越不稳定
        if depth < 300:
            return 1.0
        elif depth < 600:
            return 0.95
        elif depth < 1000:
            return 0.90
        else:
            return 0.85

    def _structural_factor(self, geology: GeologyModel) -> float:
        """结构因素影响系数（占位）"""
        # 未来：考虑断层、节理等地质构造
        return 1.0

    def _compute_confidence(self, geology: GeologyModel,
                           monitoring: Optional[MonitoringData]) -> float:
        """计算置信度"""
        confidence = 0.7  # 基础置信度

        # 地质数据越完整，置信度越高
        if geology.layers:
            confidence += 0.1

        # 有监测数据增加置信度
        if monitoring and monitoring.displacement_data is not None:
            confidence += 0.1

        # 有微震数据增加置信度
        if monitoring and len(monitoring.microseismic_events) > 10:
            confidence += 0.1

        return min(0.95, confidence)

    def _error_result(self, message: str) -> IndicatorResult:
        """生成错误结果"""
        return IndicatorResult(
            indicator_name="RSI",
            value=50.0,
            confidence=0.0,
            is_valid=False,
            error_message=message
        )


class RSIIndicatorPhaseField(RSIIndicator):
    """
    RSI指标 - 相场断裂模型版本（未来实现）

    这将替代当前简化版本，提供：
    1. 裂纹萌生和扩展的完整模拟
    2. 基于断裂力学的稳定性评估
    3. 与现场观测的直接对比
    """

    def __init__(self):
        super().__init__()
        self.name = "RSI-PhaseField"
        self.version = "4.0-future"

    def compute(self, geology: GeologyModel,
                monitoring: Optional[MonitoringData] = None,
                **kwargs) -> IndicatorResult:
        """
        相场断裂模型计算（TODO）

        实现计划：
        1. 使用FEniCS建立有限元模型
        2. 求解相场-力学耦合方程
        3. 从相场分布提取稳定性指数
        """
        raise NotImplementedError(
            "相场模型将在后续版本中实现。"
            "请使用 RSIIndicator 类获取占位结果。"
        )
