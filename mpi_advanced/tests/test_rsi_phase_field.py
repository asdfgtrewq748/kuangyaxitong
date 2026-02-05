"""
RSI-PhaseField 测试与验证脚本

验证相场断裂模型的正确性
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import numpy as np

from mpi_advanced import GeologyModel, MiningParameters, GeologyLayer, GeologyLayerType
from mpi_advanced.indicators.rsi_phase_field import (
    PhaseFieldFractureModel, RSIIndicatorPhaseField,
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
            fracture_toughness=2.0,  # MPa·m^1/2
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
        panel_length=200.0,
        panel_width=180.0,
        mining_height=3.5,
        mining_depth=450.0,
        advance_rate=4.5,
        support_pressure=0.3e6
    )

    return GeologyModel(layers=layers, mining_params=mining_params)


def test_phase_field_basic():
    """测试相场基本功能"""
    print("=" * 60)
    print("测试1: 相场断裂模型基本功能")
    print("=" * 60)

    # 创建相场模型
    pf = PhaseFieldFractureModel(
        fracture_energy=100.0,  # N/m
        length_scale=0.5,       # m
        elastic_modulus=25e9,   # Pa
        poisson_ratio=0.22
    )

    print(f"模型参数:")
    print(f"  断裂能 G_c = {pf.G_c:.2f} N/m")
    print(f"  长度尺度 l_0 = {pf.l_0:.2f} m")
    print(f"  弹性模量 E = {pf.E/1e9:.2f} GPa")
    print(f"  断裂韧度 K_Ic = {pf.K_Ic/1e6:.2f} MPa·m^1/2")

    # 测试临界载荷
    sigma_c = pf._compute_critical_load()
    print(f"\n临界应力 σ_c = {sigma_c/1e6:.2f} MPa")

    # 测试相场分布
    x = np.linspace(0, 10, 100)
    phi = pf.compute_phase_field_1d(x, crack_position=5.0, loading=15e6)

    print(f"\n相场分布统计:")
    print(f"  最大值: {np.max(phi):.3f} (完好)")
    print(f"  最小值: {np.min(phi):.3f} (损伤)")
    print(f"  平均值: {np.mean(phi):.3f}")


def test_rsi_phase_field():
    """测试RSI相场指标"""
    print("\n" + "=" * 60)
    print("测试2: RSI相场指标计算")
    print("=" * 60)

    geology = create_test_geology()

    # 创建相场RSI指标
    rsi_pf = create_phase_field_analytical(length_scale=0.5)

    # 计算
    result = rsi_pf.compute(geology)

    print(f"计算结果:")
    print(f"  RSI值: {result.value:.2f}")
    print(f"  置信度: {result.confidence:.2%}")
    print(f"  方法: {result.indicator_name}")

    print(f"\n详细信息:")
    print(f"  损伤指标: {result.details.get('damage_index', 0):.3f}")
    print(f"  裂纹数量: {result.details.get('crack_count', 0)}")
    print(f"  相场最小值: {result.details.get('phase_field_min', 0):.3f}")
    print(f"  相场平均值: {result.details.get('phase_field_mean', 0):.3f}")
    print(f"  长度尺度: {result.details.get('length_scale', 0)} m")


def test_comparison_with_placeholder():
    """对比相场版本与占位版本"""
    print("\n" + "=" * 60)
    print("测试3: 相场版本 vs 占位版本对比")
    print("=" * 60)

    from mpi_advanced.indicators.rsi_indicator import RSIIndicator

    geology = create_test_geology()

    # 占位版本
    placeholder = RSIIndicator()
    result_ph = placeholder.compute(geology)

    # 相场版本
    phase_field = RSIIndicatorPhaseField(length_scale=0.5)
    result_pf = phase_field.compute(geology)

    print("占位版本 (梁理论):")
    print(f"  RSI: {result_ph.value:.2f}")
    print(f"  置信度: {result_ph.confidence:.2%}")

    print("\n相场版本 (断裂力学):")
    print(f"  RSI: {result_pf.value:.2f}")
    print(f"  置信度: {result_pf.confidence:.2%}")

    print("\n对比:")
    print(f"  差值: {result_pf.value - result_ph.value:.2f}")
    print(f"  置信度提升: {(result_pf.confidence - result_ph.confidence)*100:.1f}%")
    print(f"  理论基础: 从梁理论 → 相场断裂力学")


def test_length_scale_sensitivity():
    """测试长度尺度敏感性"""
    print("\n" + "=" * 60)
    print("测试4: 长度尺度参数敏感性分析")
    print("=" * 60)

    geology = create_test_geology()

    # 测试不同长度尺度
    length_scales = [0.2, 0.5, 1.0, 2.0]

    print("长度尺度对RSI的影响:")
    print("-" * 40)

    for l_0 in length_scales:
        rsi_pf = RSIIndicatorPhaseField(length_scale=l_0)
        result = rsi_pf.compute(geology)

        print(f"l_0 = {l_0:.1f}m: RSI = {result.value:.2f}, "
              f"损伤 = {result.details.get('damage_index', 0):.3f}")


def test_layer_thickness_effect():
    """测试岩层厚度影响"""
    print("\n" + "=" * 60)
    print("测试5: 岩层厚度对断裂的影响")
    print("=" * 60)

    thicknesses = [2.0, 5.0, 8.0, 12.0, 15.0]

    print("不同厚度的顶板RSI:")
    print("-" * 40)

    for thick in thicknesses:
        layers = [
            GeologyLayer(
                name="直接顶",
                layer_type=GeologyLayerType.SANDSTONE,
                thickness=thick,
                depth_top=0,
                depth_bottom=thick,
                elastic_modulus=20e9,
                poisson_ratio=0.25,
                cohesion=5e6,
                friction_angle=30.0,
                tensile_strength=2e6,
                fracture_toughness=1.5,
                density=2500
            ),
            GeologyLayer(
                name="煤层",
                layer_type=GeologyLayerType.COAL,
                thickness=3.5,
                depth_top=thick,
                depth_bottom=thick+3.5,
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

        geology = GeologyModel(layers=layers, mining_params=mining_params)

        rsi_pf = create_phase_field_analytical()
        result = rsi_pf.compute(geology)

        print(f"厚度 {thick:.1f}m: RSI = {result.value:.2f}, "
              f"损伤 = {result.details.get('damage_index', 0):.3f}")


def main():
    """运行所有测试"""
    print("\n" + "=" * 60)
    print("RSI-PhaseField 相场断裂模型 测试套件")
    print("=" * 60)

    test_phase_field_basic()
    test_rsi_phase_field()
    test_comparison_with_placeholder()
    test_length_scale_sensitivity()
    test_layer_thickness_effect()

    print("\n" + "=" * 60)
    print("所有测试完成")
    print("=" * 60)


if __name__ == "__main__":
    main()
