"""
RSI-PhaseField 使用示例

展示如何使用相场断裂模型版本的RSI指标
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import numpy as np

from mpi_advanced import (
    MPIEngine, GeologyModel, MiningParameters, GeologyLayer,
    GeologyLayerType
)
from mpi_advanced.indicators.rsi_phase_field import (
    RSIIndicatorPhaseField, PhaseFieldFractureModel,
    create_phase_field_analytical
)


def create_test_geology():
    """创建测试地质模型"""
    layers = [
        GeologyLayer(
            name="基本顶",
            layer_type=GeologyLayerType.SANDSTONE,
            thickness=12.0,
            depth_top=0,
            depth_bottom=12.0,
            elastic_modulus=25e9,
            poisson_ratio=0.22,
            cohesion=8e6,
            friction_angle=35.0,
            tensile_strength=4e6,
            fracture_toughness=2.0,
            density=2600
        ),
        GeologyLayer(
            name="直接顶",
            layer_type=GeologyLayerType.MUDSTONE,
            thickness=4.5,
            depth_top=12.0,
            depth_bottom=16.5,
            elastic_modulus=8e9,
            poisson_ratio=0.28,
            cohesion=3e6,
            friction_angle=25.0,
            tensile_strength=1.5e6,
            fracture_toughness=0.8,
            density=2400
        ),
        GeologyLayer(
            name="煤层",
            layer_type=GeologyLayerType.COAL,
            thickness=3.5,
            depth_top=16.5,
            depth_bottom=20.0,
            elastic_modulus=3e9,
            poisson_ratio=0.30,
            cohesion=2e6,
            friction_angle=20.0,
            tensile_strength=0.8e6,
            fracture_toughness=0.5,
            density=1400
        )
    ]

    mining_params = MiningParameters(
        mining_height=3.5,
        mining_depth=450.0,
        support_pressure=0.3e6
    )

    return GeologyModel(layers=layers, mining_params=mining_params)


def example_phase_field_basic():
    """示例1: 相场断裂模型基础"""
    print("=" * 60)
    print("示例1: 相场断裂模型基础")
    print("=" * 60)

    # 创建相场模型
    pf = PhaseFieldFractureModel(
        fracture_energy=100.0,  # N/m
        length_scale=0.5,       # m
        elastic_modulus=25e9,   # Pa
        poisson_ratio=0.22
    )

    print("\n相场模型参数:")
    print(f"  断裂能 G_c = {pf.G_c:.2f} N/m")
    print(f"  长度尺度 l_0 = {pf.l_0:.2f} m")
    print(f"  断裂韧度 K_Ic = {pf.K_Ic/1e6:.2f} MPa·m^1/2")

    # 计算相场分布
    x = np.linspace(0, 10, 100)
    phi = pf.compute_phase_field_1d(x, crack_position=5.0, loading=15e6)

    print(f"\n相场分布:")
    print(f"  位置范围: [{x[0]:.1f}, {x[-1]:.1f}] m")
    print(f"  裂纹位置: 5.0 m")
    print(f"  最大相场值: {np.max(phi):.3f} (完好)")
    print(f"  最小相场值: {np.min(phi):.3f} (损伤)")


def example_rsi_phase_field():
    """示例2: 相场RSI指标"""
    print("\n" + "=" * 60)
    print("示例2: 相场RSI指标计算")
    print("=" * 60)

    geology = create_test_geology()

    # 创建相场RSI指标
    rsi_pf = create_phase_field_analytical(length_scale=0.5)

    # 计算
    result = rsi_pf.compute(geology)

    print("\n相场RSI计算结果:")
    print(f"  RSI值: {result.value:.2f}")
    print(f"  置信度: {result.confidence:.2%}")
    print(f"  不确定性区间: [{result.uncertainty_range[0]:.1f}, {result.uncertainty_range[1]:.1f}]")

    print("\n相场分析详情:")
    print(f"  损伤指标: {result.details.get('damage_index', 0):.3f}")
    print(f"  裂纹数量: {result.details.get('crack_count', 0)}")
    print(f"  裂纹惩罚: {result.details.get('crack_penalty', 0):.2f}")
    print(f"  相场最小值: {result.details.get('phase_field_min', 0):.3f}")
    print(f"  相场平均值: {result.details.get('phase_field_mean', 0):.3f}")


def main():
    """主函数"""
    print("\n" + "=" * 60)
    print("RSI-PhaseField 相场断裂模型 使用示例")
    print("=" * 60)

    example_phase_field_basic()
    example_rsi_phase_field()

    print("\n" + "=" * 60)
    print("所有示例运行完成")
    print("=" * 60)


if __name__ == "__main__":
    main()
