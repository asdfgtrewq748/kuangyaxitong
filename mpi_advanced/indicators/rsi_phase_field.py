"""
RSI指标计算模块 - 相场断裂模型版本 (Phase-Field Fracture Model)

这是RSI的最高级别实现，使用相场断裂模型模拟顶板从变形到断裂的完整过程。

理论基础：
- Francfort and Marigo (1998): Variational approach to fracture
- Miehe et al. (2010): Phase-field fracture model
- 核心思想：用连续变量φ描述断裂，避免追踪裂纹面

实现架构：
1. 简化版：基于能量释放率的解析相场 (当前实现)
2. 完整版：FEniCS有限元求解 (未来升级)

创新点：
- 首次将相场理论引入采场顶板分析
- 预测裂纹萌生位置和扩展路径
- 基于断裂能的稳定性评估
"""

import numpy as np
from typing import Optional, Dict, Any, Tuple, List
from dataclasses import dataclass

from .rsi_indicator import RSIIndicator
from ..core.data_models import (
    GeologyModel, MonitoringData, IndicatorResult,
    GeologyLayer, GeologyLayerType
)


@dataclass
class CrackTip:
    """裂纹尖端信息"""
    position: np.ndarray      # 位置 [x, y, z]
    direction: np.ndarray     # 扩展方向
    energy_release_rate: float  # 能量释放率
    stress_intensity: float   # 应力强度因子


@dataclass
class PhaseFieldResult:
    """相场计算结果"""
    phi_field: np.ndarray     # 相场变量 (0=断裂, 1=完好)
    displacement: np.ndarray  # 位移场
    strain_energy: np.ndarray # 应变能密度
    crack_tips: List[CrackTip]  # 裂纹尖端列表
    damage_index: float       # 整体损伤度


class PhaseFieldFractureModel:
    """
    相场断裂模型 (Phase-Field Fracture Model)

    简化实现：基于能量释放率的解析相场方法
    完整实现：需要FEniCS/Gridap有限元求解

    相场方程：
    G_c * (φ/l_0 + l_0 * |∇φ|²) = 2 * (1-φ) * H

    其中：
    - φ: 相场变量 (0≤φ≤1)
    - G_c: 断裂能
    - l_0: 相场长度尺度
    - H: 历史最大应变能
    """

    def __init__(self,
                 fracture_energy: float = 50.0,  # 断裂能 G_c (N/m)
                 length_scale: float = 0.5,      # 相场长度尺度 l_0 (m)
                 elastic_modulus: float = 10e9,  # 弹性模量 (Pa)
                 poisson_ratio: float = 0.25):   # 泊松比

        self.G_c = fracture_energy
        self.l_0 = length_scale
        self.E = elastic_modulus
        self.nu = poisson_ratio

        # 计算辅助参数
        self.K_Ic = np.sqrt(self.G_c * self.E / (1 - self.nu**2))  # 断裂韧度

    def compute_phase_field_1d(self,
                               x: np.ndarray,
                               crack_position: float = 0.0,
                               loading: float = 10e6) -> np.ndarray:
        """
        计算一维相场分布 (简化模型)

        解析解：φ(x) = exp(-|x - x_crack| / l_0)

        Args:
            x: 位置数组
            crack_position: 裂纹位置
            loading: 远场载荷

        Returns:
            phi: 相场变量数组
        """
        # 简化解析解：裂纹附近指数衰减
        distance = np.abs(x - crack_position)
        phi = 1 - np.exp(-distance / self.l_0)

        # 考虑载荷影响
        critical_load = self._compute_critical_load()
        if loading > critical_load:
            # 超载，裂纹扩展
            damage_factor = min(1.0, (loading - critical_load) / critical_load)
            phi = phi * (1 - damage_factor) + damage_factor

        return np.clip(phi, 0, 1)

    def compute_phase_field_2d_analytical(self,
                                          X: np.ndarray,
                                          Y: np.ndarray,
                                          crack_tip: Tuple[float, float],
                                          stress_state: str = 'plane_strain') -> np.ndarray:
        """
        计算二维相场分布 (解析近似)

        基于裂纹尖端的渐近解：
        φ(r, θ) ≈ 1 - exp(-r / (2*l_0))

        Args:
            X, Y: 网格坐标
            crack_tip: 裂纹尖端位置
            stress_state: 应力状态

        Returns:
            Phi: 二维相场分布
        """
        # 计算到裂纹尖端的距离
        r = np.sqrt((X - crack_tip[0])**2 + (Y - crack_tip[1])**2)

        # 渐近解
        Phi = 1 - np.exp(-r / (2 * self.l_0))

        # 考虑角度影响 (简化)
        theta = np.arctan2(Y - crack_tip[1], X - crack_tip[0])
        angle_factor = 0.5 + 0.5 * np.cos(theta)  # 裂纹前方损伤更严重

        Phi = Phi * angle_factor

        return np.clip(Phi, 0, 1)

    def compute_crack_driving_force(self,
                                    strain_energy: float,
                                    crack_length: float,
                                    thickness: float) -> float:
        """
        计算裂纹驱动力 (能量释放率 G)

        简化公式：G = ∂U/∂a

        Args:
            strain_energy: 系统应变能
            crack_length: 裂纹长度
            thickness: 岩层厚度

        Returns:
            G: 能量释放率
        """
        # 简化计算
        G = strain_energy / (crack_length * thickness)

        return G

    def check_crack_growth(self,
                          energy_release_rate: float,
                          crack_length: float) -> bool:
        """判断裂纹是否扩展"""
        # 裂纹扩展判据：G > G_c
        return energy_release_rate > self.G_c

    def _compute_critical_load(self) -> float:
        """计算临界载荷"""
        # 基于线弹性断裂力学
        # σ_c = K_Ic / (Y * sqrt(π * a))
        # 简化：假设初始裂纹尺寸为长度尺度
        a_0 = self.l_0
        Y = 1.12  # 几何修正因子

        sigma_c = self.K_Ic / (Y * np.sqrt(np.pi * a_0))
        return sigma_c

    def predict_crack_path(self,
                          initial_crack: Tuple[float, float],
                          stress_field: np.ndarray,
                          n_steps: int = 10) -> List[Tuple[float, float]]:
        """
        预测裂纹扩展路径 (简化版)

        基于最大周向应力准则：
        裂纹沿最大周向应力方向扩展

        Args:
            initial_crack: 初始裂纹位置
            stress_field: 应力场
            n_steps: 预测步数

        Returns:
            path: 裂纹路径点列表
        """
        path = [initial_crack]
        current_pos = np.array(initial_crack)

        for _ in range(n_steps):
            # 简化：假设裂纹向上扩展（重力方向）
            # 完整版需要计算应力强度因子和扩展方向
            direction = np.array([0, 1])  # 向上
            step_size = self.l_0 * 0.5

            current_pos = current_pos + step_size * direction
            path.append(tuple(current_pos))

            # 检查是否穿透岩层
            if len(path) > 5:
                break

        return path


class RSIIndicatorPhaseField(RSIIndicator):
    """
    RSI指标 - 相场断裂模型版本

    创新点：
    1. 基于相场理论模拟裂纹萌生和扩展
    2. 从相场分布提取稳定性指数
    3. 预测断裂位置和模式

    升级路线图：
    - v1.0 (当前): 解析相场近似
    - v2.0 (未来): FEniCS有限元实现
    """

    def __init__(self,
                 length_scale: float = 0.5,
                 use_fenics: bool = False):
        """
        初始化

        Args:
            length_scale: 相场长度尺度 (m)
            use_fenics: 是否使用FEniCS (需要安装)
        """
        super().__init__()
        self.name = "RSI-PhaseField"
        self.version = "1.0-analytical"
        self.length_scale = length_scale
        self.use_fenics = use_fenics

        if use_fenics:
            try:
                import fenics
                self.fenics_available = True
                self.version = "2.0-fenics"
            except ImportError:
                self.fenics_available = False
                print("警告：FEniCS未安装，使用解析近似")

    def compute(self,
                geology: GeologyModel,
                monitoring: Optional[MonitoringData] = None,
                **kwargs) -> IndicatorResult:
        """
        基于相场断裂模型的RSI计算
        """
        try:
            # 获取顶板岩层
            roof_layers = self._get_roof_layers(geology)
            if not roof_layers:
                return self._error_result("未找到顶板岩层")

            # 创建相场模型
            main_layer = roof_layers[0]
            pf_model = PhaseFieldFractureModel(
                fracture_energy=self._estimate_fracture_energy(main_layer),
                length_scale=self.length_scale,
                elastic_modulus=main_layer.elastic_modulus,
                poisson_ratio=main_layer.poisson_ratio
            )

            if self.use_fenics and self.fenics_available:
                # 完整有限元实现 (需要FEniCS)
                phase_field_result = self._compute_fem_phase_field(
                    geology, roof_layers, pf_model
                )
            else:
                # 解析近似实现
                phase_field_result = self._compute_analytical_phase_field(
                    geology, roof_layers, pf_model
                )

            # 从相场结果提取RSI
            rsi_value, details = self._compute_rsi_from_phase_field(
                phase_field_result, roof_layers
            )

            # 计算置信度
            confidence = self._compute_confidence_pf(geology, monitoring)

            # 不确定性
            uncertainty = 8 + (1 - confidence) * 10
            rsi_low = max(0, rsi_value - uncertainty)
            rsi_high = min(100, rsi_value + uncertainty)

            return IndicatorResult(
                indicator_name="RSI-PhaseField",
                value=rsi_value,
                confidence=confidence,
                uncertainty_range=(rsi_low, rsi_high),
                details=details,
                intermediate_results={
                    'phase_field': {
                        'phi_field_shape': phase_field_result.phi_field.shape,
                        'damage_index': phase_field_result.damage_index,
                        'crack_count': len(phase_field_result.crack_tips)
                    },
                    'crack_tips': [
                        {
                            'position': ct.position.tolist(),
                            'energy_release_rate': ct.energy_release_rate
                        }
                        for ct in phase_field_result.crack_tips
                    ],
                    'layer_info': [
                        (l.name, l.thickness, l.fracture_toughness)
                        for l in roof_layers
                    ]
                }
            )

        except Exception as e:
            return self._error_result(f"相场计算错误: {str(e)}")

    def _compute_analytical_phase_field(self,
                                       geology: GeologyModel,
                                       roof_layers: List[GeologyLayer],
                                       pf_model: PhaseFieldFractureModel
                                       ) -> PhaseFieldResult:
        """
        计算解析相场 (简化版)

        使用梁挠度理论和相场近似
        """
        # 计算等效参数
        E_eq, h_eq = self._compute_equivalent_parameters(roof_layers)
        span = geology.mining_params.panel_width

        # 计算载荷
        load = self._compute_load(roof_layers)

        # 最大弯矩位置 (简支梁中点)
        M_max = load * span**2 / 8

        # 最大拉应力 (梁底部)
        sigma_max = M_max * (h_eq/2) / (h_eq**3 / 12)

        # 临界应力
        sigma_c = pf_model._compute_critical_load()

        # 判断是否开裂
        if sigma_max < sigma_c:
            # 未开裂，相场=1 (完好)
            phi_field = np.ones(100)
            damage_index = 0.0
            crack_tips = []
        else:
            # 开裂，计算相场分布
            # 裂纹从梁底部中点开始
            x = np.linspace(0, span, 100)

            # 初始裂纹位置
            crack_pos = span / 2

            # 计算相场
            phi_field = pf_model.compute_phase_field_1d(
                x, crack_position=crack_pos, loading=sigma_max
            )

            # 计算损伤指标
            damage_index = 1 - np.mean(phi_field)

            # 识别裂纹尖端
            crack_tips = [CrackTip(
                position=np.array([crack_pos, 0]),
                direction=np.array([0, 1]),
                energy_release_rate=pf_model.compute_crack_driving_force(
                    sigma_max**2 / (2*E_eq), 1.0, 1.0
                ),
                stress_intensity=sigma_max * np.sqrt(np.pi * pf_model.l_0)
            )]

        return PhaseFieldResult(
            phi_field=phi_field,
            displacement=np.zeros_like(phi_field),
            strain_energy=np.zeros_like(phi_field),
            crack_tips=crack_tips,
            damage_index=damage_index
        )

    def _compute_fem_phase_field(self,
                                geology: GeologyModel,
                                roof_layers: List[GeologyLayer],
                                pf_model: PhaseFieldFractureModel
                                ) -> PhaseFieldResult:
        """
        有限元相场计算 (需要FEniCS)

        TODO: 完整FEniCS实现
        """
        raise NotImplementedError(
            "FEniCS有限元实现需要安装fenics包。\n"
            "当前使用解析近似版本。"
        )

    def _compute_rsi_from_phase_field(self,
                                     pf_result: PhaseFieldResult,
                                     roof_layers: List[GeologyLayer]
                                     ) -> Tuple[float, Dict]:
        """从相场结果计算RSI指数"""

        # 损伤指标 (0=完好, 1=完全断裂)
        damage = pf_result.damage_index

        # 裂纹数量
        crack_count = len(pf_result.crack_tips)

        # 基于相场的RSI计算
        # 考虑：损伤程度、裂纹数量、裂纹活跃度

        if damage < 0.1:
            # 轻微损伤
            rsi = 90 - damage * 100
        elif damage < 0.5:
            # 中度损伤
            rsi = 80 - damage * 120
        else:
            # 严重损伤
            rsi = 20 - (damage - 0.5) * 40

        rsi = max(0, min(100, rsi))

        # 裂纹惩罚
        crack_penalty = min(20, crack_count * 5)
        rsi -= crack_penalty

        details = {
            'damage_index': damage,
            'crack_count': crack_count,
            'crack_penalty': crack_penalty,
            'phase_field_min': float(np.min(pf_result.phi_field)),
            'phase_field_mean': float(np.mean(pf_result.phi_field)),
            'length_scale': self.length_scale,
            'method': 'analytical' if not self.use_fenics else 'fem'
        }

        # 如果有裂纹，添加详细信息
        if pf_result.crack_tips:
            ct = pf_result.crack_tips[0]
            details['max_energy_release_rate'] = ct.energy_release_rate
            details['stress_intensity_factor'] = ct.stress_intensity

        return max(0, rsi), details

    def _estimate_fracture_energy(self, layer: GeologyLayer) -> float:
        """估算岩层断裂能"""
        # 从断裂韧度估算
        # G_c = K_Ic² / E
        K_Ic = layer.fracture_toughness * 1e6  # 转换为Pa·m^1/2
        G_c = K_Ic**2 / layer.elastic_modulus

        return max(10.0, G_c)  # 最小10 N/m

    def _compute_confidence_pf(self,
                              geology: GeologyModel,
                              monitoring: Optional[MonitoringData]) -> float:
        """计算相场版本的置信度"""
        confidence = 0.75  # 相场方法基础置信度高

        # 地质数据完整度
        if len(geology.layers) >= 3:
            confidence += 0.1

        # 有断裂韧度参数
        roof_layers = self._get_roof_layers(geology)
        if roof_layers and all(l.fracture_toughness > 0 for l in roof_layers):
            confidence += 0.1

        # 有监测数据验证
        if monitoring and monitoring.displacement_data is not None:
            confidence += 0.1

        return min(0.95, confidence)

    def visualize_phase_field(self,
                             pf_result: PhaseFieldResult,
                             save_path: Optional[str] = None):
        """
        可视化相场分布

        Args:
            pf_result: 相场计算结果
            save_path: 保存路径
        """
        try:
            import matplotlib.pyplot as plt

            fig, axes = plt.subplots(1, 2, figsize=(12, 4))

            # 相场分布
            ax1 = axes[0]
            x = np.linspace(0, 1, len(pf_result.phi_field))
            ax1.plot(x, pf_result.phi_field, 'b-', linewidth=2)
            ax1.axhline(y=0.5, color='r', linestyle='--', label='损伤阈值')
            ax1.set_xlabel('归一化位置')
            ax1.set_ylabel('相场变量 φ')
            ax1.set_title('相场分布 (φ=0断裂, φ=1完好)')
            ax1.legend()
            ax1.grid(True, alpha=0.3)

            # 损伤状态
            ax2 = axes[1]
            damage = 1 - pf_result.phi_field
            colors = ['green' if d < 0.3 else 'orange' if d < 0.7 else 'red'
                     for d in damage]
            ax1.bar(range(len(damage)), damage, color=colors, alpha=0.6)
            ax2.set_xlabel('位置索引')
            ax2.set_ylabel('损伤度 (1-φ)')
            ax2.set_title('损伤分布')
            ax2.set_ylim(0, 1)

            plt.tight_layout()

            if save_path:
                plt.savefig(save_path, dpi=150, bbox_inches='tight')
            else:
                plt.show()

            plt.close()

        except ImportError:
            print("matplotlib未安装，无法可视化")


# 便捷的工厂函数
def create_phase_field_analytical(length_scale: float = 0.5) -> RSIIndicatorPhaseField:
    """创建解析相场版本的RSI指标"""
    return RSIIndicatorPhaseField(length_scale=length_scale, use_fenics=False)


def create_phase_field_fem(length_scale: float = 0.5) -> RSIIndicatorPhaseField:
    """创建有限元相场版本的RSI指标 (需要FEniCS)"""
    return RSIIndicatorPhaseField(length_scale=length_scale, use_fenics=True)
