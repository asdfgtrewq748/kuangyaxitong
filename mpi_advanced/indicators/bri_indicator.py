"""
BRI指标计算模块 - Burst Risk Index (冲击地压风险指数)

当前版本：占位实现（基于简化能量计算）
目标版本：微震矩张量反演 + 深度学习前兆识别

升级路线图：
1. v1.0 (当前): 弹性能密度公式 + 经验系数
2. v2.0: 应力场数值模拟
3. v3.0: 微震能量场反演
4. v4.0: 深度学习前兆识别
"""

import numpy as np
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta

from ..core.interfaces import BaseIndicator
from ..core.data_models import (
    GeologyModel, MonitoringData, IndicatorResult,
    MicroseismicEvent, GeologyLayerType
)


class BRIIndicator(BaseIndicator):
    """
    冲击地压风险指数 (Burst Risk Index)

    计算公式（占位版本）：
    BRI = 100 × (1 - E_accum / E_crit) × k_monitoring

    其中：
    - E_accum: 积聚的弹性能
    - E_crit: 临界能量
    - k_monitoring: 监测数据修正系数
    """

    def __init__(self):
        super().__init__(name="BRI", version="1.0-placeholder")
        self.config = {
            'critical_energy_density': 50e3,  # 临界能量密度 (J/m³)
            'depth_threshold': 400,           # 深度阈值 (m)
            'hard_roof_penalty': 0.85,        # 坚硬顶板惩罚系数
            'thick_coal_penalty': 0.90,       # 厚煤层惩罚系数
            'microseismic_weight': 0.3        # 微震数据权重
        }

    def validate_input(self, geology: GeologyModel,
                       monitoring: Optional[MonitoringData] = None) -> bool:
        """验证输入数据"""
        # BRI需要煤层信息
        coal_layers = [l for l in geology.layers
                      if l.layer_type == GeologyLayerType.COAL]
        return len(coal_layers) > 0

    def compute(self, geology: GeologyModel,
                monitoring: Optional[MonitoringData] = None,
                **kwargs) -> IndicatorResult:
        """
        计算BRI值

        这是占位实现，使用简化能量计算。
        未来升级：微震矩张量反演 + 深度学习。
        """
        try:
            # 获取煤层信息
            coal_layers = [l for l in geology.layers
                         if l.layer_type == GeologyLayerType.COAL]
            if not coal_layers:
                return self._error_result("未找到煤层")

            main_coal = coal_layers[0]

            # 计算弹性能密度
            E_accum = self._compute_accumulated_energy(geology, main_coal)
            E_crit = self.config['critical_energy_density']

            # 基础BRI
            bri_base = 100 * (1 - E_accum / E_crit)

            # 应用修正系数
            k_depth = self._depth_factor(geology.mining_params.mining_depth)
            k_structure = self._geological_structure_factor(geology)
            k_monitoring = self._monitoring_factor(monitoring)

            k_total = k_depth * k_structure * k_monitoring

            bri_value = max(0, min(100, bri_base * k_total))

            # 计算置信度
            confidence = self._compute_confidence(monitoring)

            # 不确定性区间
            uncertainty = 15 + (1 - confidence) * 20
            bri_low = max(0, bri_value - uncertainty)
            bri_high = min(100, bri_value + uncertainty)

            # 提取微震特征（如果有数据）
            ms_features = self._extract_microseismic_features(monitoring)

            return IndicatorResult(
                indicator_name="BRI",
                value=bri_value,
                confidence=confidence,
                uncertainty_range=(bri_low, bri_high),
                details={
                    'accumulated_energy': E_accum,
                    'critical_energy': E_crit,
                    'depth_factor': k_depth,
                    'structure_factor': k_structure,
                    'monitoring_factor': k_monitoring,
                    'microseismic_features': ms_features
                },
                intermediate_results={
                    'coal_layers': [(l.name, l.thickness) for l in coal_layers],
                    'mining_depth': geology.mining_params.mining_depth
                }
            )

        except Exception as e:
            return self._error_result(f"计算错误: {str(e)}")

    def _compute_accumulated_energy(self, geology: GeologyModel,
                                   coal_layer: Any) -> float:
        """
        计算积聚的弹性能密度

        E = σ² / (2E)
        其中 σ 是应力，E 是弹性模量
        """
        # 原岩应力（简化）
        depth = (coal_layer.depth_top + coal_layer.depth_bottom) / 2
        vertical_stress = 0.025 * depth  # MPa, 简化重力应力

        # 水平应力（假设侧压系数为1.5）
        k_ratio = 1.5
        horizontal_stress = k_ratio * vertical_stress

        # 偏应力
        deviatoric_stress = abs(horizontal_stress - vertical_stress)

        # 弹性能密度
        E_coal = coal_layer.elastic_modulus / 1e6  # 转换为MPa
        energy_density = deviatoric_stress ** 2 / (2 * E_coal)

        return energy_density * 1e6  # 转换为 J/m³

    def _depth_factor(self, depth: float) -> float:
        """开采深度影响系数"""
        threshold = self.config['depth_threshold']

        if depth < threshold:
            return 1.0
        else:
            # 超过阈值后，深度越大风险越高
            excess = (depth - threshold) / 200
            return max(0.5, 1.0 - excess * 0.1)

    def _geological_structure_factor(self, geology: GeologyModel) -> float:
        """地质结构影响系数"""
        factor = 1.0

        # 检查是否有坚硬厚顶板
        roof_layers = [l for l in geology.layers
                      if l.depth_top > 0]

        for layer in roof_layers:
            if (layer.layer_type == GeologyLayerType.SANDSTONE and
                layer.thickness > 10 and
                layer.elastic_modulus > 20e9):
                factor *= self.config['hard_roof_penalty']
                break

        # 检查煤层厚度
        coal_layers = [l for l in geology.layers
                      if l.layer_type == GeologyLayerType.COAL]
        for coal in coal_layers:
            if coal.thickness > 4.0:  # 厚煤层
                factor *= self.config['thick_coal_penalty']
                break

        return factor

    def _monitoring_factor(self, monitoring: Optional[MonitoringData]) -> float:
        """监测数据修正系数（占位）"""
        if monitoring is None:
            return 1.0

        factor = 1.0

        # 微震事件分析（简化）
        events = monitoring.microseismic_events
        if len(events) > 0:
            # 近期事件频率
            recent_events = [e for e in events
                           if (datetime.now() - e.timestamp).days <= 7]

            if len(recent_events) > 5:
                # 微震活动频繁，风险增加
                factor *= 0.9

            # 高能量事件
            high_energy_events = [e for e in events if e.energy > 1e4]
            if len(high_energy_events) > 0:
                factor *= 0.85

        return factor

    def _extract_microseismic_features(self,
                                      monitoring: Optional[MonitoringData]) -> Dict:
        """提取微震特征（占位，未来用于深度学习）"""
        features = {
            'event_count': 0,
            'total_energy': 0.0,
            'average_magnitude': 0.0,
            'b_value': 1.0,  # b值（震级-频度关系）
            'energy_release_rate': 0.0
        }

        if monitoring is None:
            return features

        events = monitoring.microseismic_events
        features['event_count'] = len(events)

        if len(events) == 0:
            return features

        # 基础统计
        energies = [e.energy for e in events]
        magnitudes = [e.magnitude for e in events]

        features['total_energy'] = sum(energies)
        features['average_magnitude'] = np.mean(magnitudes)

        # 计算b值（简化）
        features['b_value'] = self._compute_b_value(magnitudes)

        # 能量释放速率
        if len(events) >= 2:
            time_span = (max(e.timestamp for e in events) -
                        min(e.timestamp for e in events)).days
            if time_span > 0:
                features['energy_release_rate'] = sum(energies) / time_span

        return features

    def _compute_b_value(self, magnitudes: List[float]) -> float:
        """计算b值（占位实现）"""
        if len(magnitudes) < 10:
            return 1.0  # 默认值

        # 简化计算：使用最大似然估计
        M_mean = np.mean(magnitudes)
        M_min = min(magnitudes)

        b_value = 1.0 / (np.log(10) * (M_mean - M_min))

        return max(0.5, min(2.0, b_value))

    def _compute_confidence(self, monitoring: Optional[MonitoringData]) -> float:
        """计算置信度"""
        confidence = 0.6  # 基础置信度

        if monitoring is None:
            return confidence

        # 微震数据越多，置信度越高
        event_count = len(monitoring.microseismic_events)
        if event_count > 50:
            confidence += 0.2
        elif event_count > 20:
            confidence += 0.15
        elif event_count > 5:
            confidence += 0.1

        # 有应力测量数据
        if len(monitoring.stress_measurements) > 0:
            confidence += 0.1

        return min(0.9, confidence)

    def _error_result(self, message: str) -> IndicatorResult:
        """生成错误结果"""
        return IndicatorResult(
            indicator_name="BRI",
            value=50.0,
            confidence=0.0,
            is_valid=False,
            error_message=message
        )


class BRIIndicatorMicroseismic(BRIIndicator):
    """
    BRI指标 - 微震驱动版本（未来实现）

    功能：
    1. 微震矩张量反演
    2. 能量密度场构建
    3. 深度学习前兆识别
    """

    def __init__(self):
        super().__init__()
        self.name = "BRI-Microseismic"
        self.version = "4.0-future"

    def compute(self, geology: GeologyModel,
                monitoring: Optional[MonitoringData] = None,
                **kwargs) -> IndicatorResult:
        """微震驱动计算（TODO）"""
        raise NotImplementedError(
            "微震驱动版本将在后续实现。"
            "请使用 BRIIndicator 类获取占位结果。"
        )
