"""
ASI指标计算模块 - 统一强度理论解析解版本

Abutment Stress Index based on Unified Strength Theory (UST)

核心创新：
1. 基于统一强度理论的塑性区解析解
2. 考虑中间主应力效应 (σ2)
3. 无需数值模拟，计算效率高

理论基础：
- 俞茂宏. 双剪理论及其应用. 科学出版社, 1998.
- 统一强度理论将多种强度理论统一为带参数b的公式族
  * b=0: Mohr-Coulomb准则
  * b=1: 双剪强度理论
  * 0<b<1: 系列中间准则
"""

import numpy as np
from typing import Dict, Any, Tuple, Optional
from scipy.optimize import fsolve

from .asi_indicator import ASIIndicator
from ..core.data_models import (
    GeologyModel, MonitoringData, IndicatorResult,
    GeologyLayerType
)


class UnifiedStrengthTheory:
    """
    统一强度理论 (Unified Strength Theory, UST)

    公式：
    F = σ1 - (σ2 + b*σ3)/(1+b) = ft  当 σ2 ≤ (σ1 + b*σ3)/(1+b)
    F' = (σ1 + b*σ2)/(1+b) - σ3 = ft  当 σ2 ≥ (σ1 + b*σ3)/(1+b)

    其中：
    - σ1, σ2, σ3: 第一、第二、第三主应力
    - b: UST参数 (0 ≤ b ≤ 1)
    - ft: 单轴抗拉强度
    """

    def __init__(self, cohesion: float, friction_angle: float, b: float = 0.5):
        """
        初始化UST参数

        Args:
            cohesion: 粘聚力 c (Pa)
            friction_angle: 内摩擦角 φ (度)
            b: UST参数，默认0.5
        """
        self.c = cohesion
        self.phi = np.radians(friction_angle)
        self.b = b

        # 预计算常用参数
        self.sin_phi = np.sin(self.phi)
        self.cos_phi = np.cos(self.phi)

        # 计算等效强度参数
        self._compute_equivalent_parameters()

    def _compute_equivalent_parameters(self):
        """计算等效强度参数"""
        # UST等效内摩擦角和粘聚力
        # 参考：Unified Strength Theory and Its Applications (Yu, 2004)

        if self.b == 0:
            # 退化为Mohr-Coulomb
            self.phi_ust = self.phi
            self.c_ust = self.c
            self.sin_phi_ust = self.sin_phi
        else:
            # UST等效参数
            # 基于双剪概念的修正
            numerator = 2 * (1 + self.b) * self.sin_phi
            denominator = (1 + self.b) - (self.b - self.sin_phi)

            if denominator > 0:
                self.sin_phi_ust = numerator / denominator
                self.sin_phi_ust = min(0.99, max(-0.99, self.sin_phi_ust))
                self.phi_ust = np.arcsin(self.sin_phi_ust)
            else:
                self.phi_ust = self.phi
                self.sin_phi_ust = self.sin_phi

            # 等效粘聚力修正
            self.c_ust = self.c * (1 + self.b) * self.cos_phi / \
                        ((1 + self.b) * np.cos(self.phi_ust) + 1e-10)

    def yield_function(self, sigma1: float, sigma2: float, sigma3: float) -> float:
        """
        计算UST屈服函数值

        Returns:
            F > 0: 屈服
            F ≤ 0: 弹性
        """
        # 判断使用哪个表达式
        threshold = (sigma1 + self.b * sigma3) / (1 + self.b)

        if sigma2 <= threshold:
            F = sigma1 - (sigma2 + self.b * sigma3) / (1 + self.b)
        else:
            F = (sigma1 + self.b * sigma2) / (1 + self.b) - sigma3

        # 强度
        ft = 2 * self.c * self.cos_phi / (1 + self.sin_phi)

        return F - ft

    def get_plastic_zone_radius(self, R0: float, P0: float, Pi: float) -> float:
        """
        计算塑性区半径

        基于UST的解析解：
        Rp = R0 * [(2*P0 + C0) / (Pi + C0)]^(1/(A-1))

        Args:
            R0: 巷道半径 (m)
            P0: 原岩应力 (Pa)
            Pi: 支护压力 (Pa)

        Returns:
            Rp: 塑性区半径 (m)
        """
        # 计算参数 A
        A = 2 * (1 + self.b) * self.sin_phi_ust / \
            ((1 + self.b) - (self.b - self.sin_phi_ust) + 1e-10)

        # 常数项 C0
        C0 = (1 + self.b) * self.c_ust * np.cos(self.phi_ust) / \
             ((self.b - self.sin_phi_ust) * (1 - self.sin_phi_ust) + 1e-10)

        # 塑性区半径公式
        numerator = 2 * P0 + C0
        denominator = Pi + C0

        if denominator <= 0 or numerator <= 0:
            return R0 * 1.5  # 默认最小塑性区

        if abs(A - 1) < 0.01:
            # 特殊情况处理
            Rp = R0 * np.exp((numerator - denominator) / denominator)
        else:
            power = 1.0 / (A - 1)
            Rp = R0 * (numerator / denominator) ** power

        return max(R0, Rp)

    def get_stress_distribution(self, r: np.ndarray, R0: float,
                                 Rp: float, P0: float, Pi: float) -> Tuple[np.ndarray, np.ndarray]:
        """
        计算巷道周围应力分布

        Args:
            r: 距离数组 (m)
            R0: 巷道半径 (m)
            Rp: 塑性区半径 (m)
            P0: 原岩应力 (Pa)
            Pi: 支护压力 (Pa)

        Returns:
            sigma_r: 径向应力数组
            sigma_theta: 环向应力数组
        """
        sigma_r = np.zeros_like(r)
        sigma_theta = np.zeros_like(r)

        # 弹塑性交界面处的径向应力
        A = 2 * (1 + self.b) * self.sin_phi_ust / \
            ((1 + self.b) - (self.b - self.sin_phi_ust) + 1e-10)
        C0 = (1 + self.b) * self.c_ust * np.cos(self.phi_ust) / \
             ((self.b - self.sin_phi_ust) * (1 - self.sin_phi_ust) + 1e-10)

        sigma_rp = (Pi + C0) * (Rp / R0) ** (A - 1) - C0

        for i, ri in enumerate(r):
            if ri <= Rp:
                # 塑性区 - UST解析解
                sigma_r[i] = (Pi + C0) * (ri / R0) ** (A - 1) - C0

                # 从UST计算环向应力
                sigma_theta[i] = self._get_sigma_theta_from_ust(sigma_r[i])
            else:
                # 弹性区 - Lame解
                sigma_r[i] = P0 - (P0 - sigma_rp) * (Rp / ri) ** 2
                sigma_theta[i] = P0 + (P0 - sigma_rp) * (Rp / ri) ** 2

        return sigma_r, sigma_theta

    def _get_sigma_theta_from_ust(self, sigma_r: float) -> float:
        """从UST关系推导环向应力"""
        # 简化处理：使用UST的应力关系
        # 假设 σ2 = (σr + σθ)/2 (中间主应力为平均值)

        # 计算抗拉强度
        ft = 2 * self.c * self.cos_phi / (1 + self.sin_phi)

        def equation(sigma_theta):
            sigma2 = (sigma_r + sigma_theta) / 2

            # UST判据
            threshold = (sigma_theta + self.b * sigma_r) / (1 + self.b)

            if sigma2 <= threshold:
                F = sigma_theta - (sigma2 + self.b * sigma_r) / (1 + self.b)
            else:
                F = (sigma_theta + self.b * sigma2) / (1 + self.b) - sigma_r

            return F - ft

        # 初始猜测
        sigma_theta_guess = sigma_r + ft * 1.5

        try:
            sigma_theta = fsolve(equation, sigma_theta_guess)[0]
        except:
            sigma_theta = sigma_r + ft

        return sigma_theta


class ASIIndicatorUST(ASIIndicator):
    """
    ASI指标 - 基于统一强度理论的解析解版本

    创新点：
    1. 使用UST替代Mohr-Coulomb，考虑中间主应力效应
    2. 完全解析解，无需数值模拟
    3. 通过参数b可调节强度理论
    """

    def __init__(self, b: float = 0.5):
        """
        初始化

        Args:
            b: UST参数 (0-1)
               b=0: Mohr-Coulomb
               b=0.5: 默认推荐值
               b=1: 双剪理论
        """
        super().__init__()
        self.name = "ASI-UST"
        self.version = "3.0-ust"
        self.b = b

        # 更新配置
        self.config.update({
            'ust_parameter_b': b,
            'use_ust': True
        })

    def compute(self, geology: GeologyModel,
                monitoring: Optional[MonitoringData] = None,
                **kwargs) -> IndicatorResult:
        """
        基于UST的ASI计算
        """
        try:
            # 获取煤层信息
            coal_layers = [l for l in geology.layers
                         if l.layer_type == GeologyLayerType.COAL]
            if not coal_layers:
                return self._error_result("未找到煤层")

            main_coal = coal_layers[0]
            mining = geology.mining_params

            # 创建UST模型
            ust = UnifiedStrengthTheory(
                cohesion=main_coal.cohesion,
                friction_angle=main_coal.friction_angle,
                b=self.b
            )

            # 计算参数
            R0 = mining.mining_height / 2  # 等效巷道半径
            depth = (main_coal.depth_top + main_coal.depth_bottom) / 2
            P0 = 0.025e6 * depth  # 原岩应力 (MPa to Pa)
            Pi = mining.support_pressure

            # 计算塑性区半径
            Rp = ust.get_plastic_zone_radius(R0, P0, Pi)

            # 计算应力分布
            r = np.linspace(R0, 5*R0, 200)  # 从巷壁到5倍半径
            sigma_r, sigma_theta = ust.get_stress_distribution(r, R0, Rp, P0, Pi)

            # 计算ASI指标
            asi_value, details = self._compute_asi_metrics(
                r, sigma_r, sigma_theta, Rp, R0, P0, ust, main_coal
            )

            # 计算置信度
            confidence = self._compute_confidence_ust(geology, monitoring)

            # 不确定性区间
            uncertainty = 8 + (1 - confidence) * 12
            asi_low = max(0, asi_value - uncertainty)
            asi_high = min(100, asi_value + uncertainty)

            return IndicatorResult(
                indicator_name="ASI-UST",
                value=asi_value,
                confidence=confidence,
                uncertainty_range=(asi_low, asi_high),
                details=details,
                intermediate_results={
                    'stress_distribution': {
                        'r': r,
                        'sigma_r': sigma_r,
                        'sigma_theta': sigma_theta
                    },
                    'plastic_zone_radius': Rp,
                    'ust_parameter_b': self.b,
                    'equivalent_phi': np.degrees(ust.phi_ust),
                    'coal_properties': {
                        'cohesion': main_coal.cohesion,
                        'friction_angle': main_coal.friction_angle
                    }
                }
            )

        except Exception as e:
            return self._error_result(f"UST计算错误: {str(e)}")

    def _compute_asi_metrics(self, r: np.ndarray, sigma_r: np.ndarray,
                            sigma_theta: np.ndarray, Rp: float, R0: float,
                            P0: float, ust: UnifiedStrengthTheory,
                            coal_layer: Any) -> Tuple[float, Dict]:
        """计算ASI相关指标"""

        # 应力集中系数
        sigma_max = np.max(sigma_theta)
        stress_concentration = sigma_max / P0

        # 塑性区范围指标
        plastic_zone_ratio = Rp / R0

        # 高应力区范围 (σθ > 1.5*P0)
        high_stress_mask = sigma_theta > 1.5 * P0
        high_stress_range = np.sum(high_stress_mask) * (r[1] - r[0]) if len(r) > 1 else 0

        # 应变能密度
        E = coal_layer.elastic_modulus
        nu = coal_layer.poisson_ratio

        # 弹性应变能
        strain_energy = 0.5 * (sigma_r**2 + sigma_theta**2 -
                               2*nu*sigma_r*sigma_theta) / E
        max_strain_energy = np.max(strain_energy)

        # 综合ASI计算
        # 相比原方法，UST考虑了中间主应力，结果更保守

        # 归一化各指标
        w1, w2, w3, w4 = 0.3, 0.25, 0.25, 0.2

        # 应力集中 (目标: < 2.5)
        sci_norm = min(100, stress_concentration * 35)

        # 塑性区 (目标: < 3倍半径)
        pzr_norm = min(100, plastic_zone_ratio * 30)

        # 高应力范围 (目标: < 10m)
        hsr_norm = min(100, high_stress_range * 8)

        # 应变能 (目标: 低)
        sed_norm = min(100, max_strain_energy * 5e6)

        # UST修正因子 (考虑中间主应力效应)
        ust_factor = 0.9 + 0.1 * self.b  # b越大，评估越保守

        asi = 100 - (w1*sci_norm + w2*pzr_norm + w3*hsr_norm + w4*sed_norm) * ust_factor

        details = {
            'stress_concentration': stress_concentration,
            'plastic_zone_ratio': plastic_zone_ratio,
            'plastic_zone_radius': Rp,
            'high_stress_range': high_stress_range,
            'max_strain_energy': max_strain_energy,
            'ust_parameter_b': self.b,
            'ust_factor': ust_factor,
            'peak_stress_location': r[np.argmax(sigma_theta)] - R0,
            'equivalent_strength_parameters': {
                'phi_ust_deg': np.degrees(ust.phi_ust),
                'c_ust': ust.c_ust
            }
        }

        return max(0, min(100, asi)), details

    def _compute_confidence_ust(self, geology: GeologyModel,
                               monitoring: Optional[MonitoringData]) -> float:
        """计算UST版本的置信度"""
        confidence = 0.75  # UST方法基础置信度更高

        # 地质数据完整度
        if len(geology.layers) >= 3:
            confidence += 0.1

        # 有准确的煤层力学参数
        coal_layers = [l for l in geology.layers
                      if l.layer_type == GeologyLayerType.COAL]
        if coal_layers:
            coal = coal_layers[0]
            if coal.cohesion > 0 and coal.friction_angle > 0:
                confidence += 0.1
            # 有UST参数b的校准数据
            if 'b_calibration' in self.config:
                confidence += 0.05

        # 有监测数据验证
        if monitoring and len(monitoring.stress_measurements) > 0:
            confidence += 0.1

        return min(0.95, confidence)

    def compare_with_mohr_coulomb(self, geology: GeologyModel) -> Dict:
        """
        对比UST与Mohr-Coulomb的结果差异

        Returns:
            对比分析结果
        """
        # 使用b=0得到Mohr-Coulomb结果
        mc_indicator = ASIIndicatorUST(b=0.0)
        ust_indicator = ASIIndicatorUST(b=self.b)

        mc_result = mc_indicator.compute(geology)
        ust_result = ust_indicator.compute(geology)

        return {
            'mohr_coulomb': {
                'asi': mc_result.value,
                'confidence': mc_result.confidence
            },
            'ust': {
                'asi': ust_result.value,
                'confidence': ust_result.confidence,
                'b_parameter': self.b
            },
            'difference': mc_result.value - ust_result.value,
            'relative_difference': (mc_result.value - ust_result.value) / mc_result.value * 100 if mc_result.value > 0 else 0
        }


# 便捷的工厂函数
def create_asi_mohr_coulomb() -> ASIIndicatorUST:
    """创建基于Mohr-Coulomb准则的ASI指标 (b=0)"""
    return ASIIndicatorUST(b=0.0)


def create_asi_ust_standard() -> ASIIndicatorUST:
    """创建标准UST的ASI指标 (b=0.5)"""
    return ASIIndicatorUST(b=0.5)


def create_asi_twin_shear() -> ASIIndicatorUST:
    """创建基于双剪理论的ASI指标 (b=1)"""
    return ASIIndicatorUST(b=1.0)
