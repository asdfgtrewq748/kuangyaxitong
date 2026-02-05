"""
ASI-UST 测试与验证脚本

验证统一强度理论解析解的正确性
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import numpy as np
import matplotlib.pyplot as plt
from matplotlib import rcParams

# 设置中文字体
rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
rcParams['axes.unicode_minus'] = False

from mpi_advanced import GeologyModel, MiningParameters, GeologyLayer, GeologyLayerType
from mpi_advanced.indicators.asi_indicator import ASIIndicator
from mpi_advanced.indicators.asi_indicator_ust import (
    ASIIndicatorUST, UnifiedStrengthTheory,
    create_asi_mohr_coulomb, create_asi_ust_standard, create_asi_twin_shear
)


def create_test_geology() -> GeologyModel:
    """创建测试地质模型"""
    layers = [
        GeologyLayer(
            name="直接顶",
            layer_type=GeologyLayerType.MUDSTONE,
            thickness=5.0,
            depth_top=10.0,
            depth_bottom=15.0,
            elastic_modulus=8e9,
            poisson_ratio=0.28,
            cohesion=3e6,
            friction_angle=25.0,
            density=2400
        ),
        GeologyLayer(
            name="煤层",
            layer_type=GeologyLayerType.COAL,
            thickness=3.5,
            depth_top=15.0,
            depth_bottom=18.5,
            elastic_modulus=3e9,
            poisson_ratio=0.30,
            cohesion=2e6,
            friction_angle=20.0,
            density=1400
        ),
        GeologyLayer(
            name="直接底",
            layer_type=GeologyLayerType.MUDSTONE,
            thickness=4.0,
            depth_top=18.5,
            depth_bottom=22.5,
            elastic_modulus=10e9,
            poisson_ratio=0.27,
            cohesion=4e6,
            friction_angle=28.0,
            density=2450
        )
    ]

    mining_params = MiningParameters(
        mining_height=3.5,
        mining_depth=450.0,
        support_pressure=0.3e6
    )

    return GeologyModel(layers=layers, mining_params=mining_params)


def test_ust_basic():
    """测试UST基本功能"""
    print("=" * 60)
    print("测试1: UST基本功能")
    print("=" * 60)

    # 创建UST模型
    ust = UnifiedStrengthTheory(
        cohesion=2e6,      # 2 MPa
        friction_angle=20, # 20度
        b=0.5              # 标准UST参数
    )

    print(f"输入参数:")
    print(f"  粘聚力 c = {ust.c/1e6:.2f} MPa")
    print(f"  内摩擦角 φ = {np.degrees(ust.phi):.1f}°")
    print(f"  UST参数 b = {ust.b}")

    print(f"\n等效参数:")
    print(f"  等效内摩擦角 φ_ust = {np.degrees(ust.phi_ust):.2f}°")
    print(f"  等效粘聚力 c_ust = {ust.c_ust/1e6:.2f} MPa")

    # 测试塑性区半径计算
    R0 = 2.0  # 巷道半径
    P0 = 12e6  # 原岩应力 (约450m深度)
    Pi = 0.3e6  # 支护压力

    Rp = ust.get_plastic_zone_radius(R0, P0, Pi)
    print(f"\n塑性区计算:")
    print(f"  巷道半径 R0 = {R0} m")
    print(f"  原岩应力 P0 = {P0/1e6:.2f} MPa")
    print(f"  支护压力 Pi = {Pi/1e6:.2f} MPa")
    print(f"  塑性区半径 Rp = {Rp:.2f} m")
    print(f"  塑性区范围 Rp/R0 = {Rp/R0:.2f}")


def test_stress_distribution():
    """测试应力分布计算"""
    print("\n" + "=" * 60)
    print("测试2: 应力分布计算")
    print("=" * 60)

    ust = UnifiedStrengthTheory(
        cohesion=2e6,
        friction_angle=20,
        b=0.5
    )

    R0 = 2.0
    P0 = 12e6
    Pi = 0.3e6
    Rp = ust.get_plastic_zone_radius(R0, P0, Pi)

    # 计算应力分布
    r = np.linspace(R0, 5*R0, 100)
    sigma_r, sigma_theta = ust.get_stress_distribution(r, R0, Rp, P0, Pi)

    print(f"应力分布统计:")
    print(f"  径向应力 σr:")
    print(f"    最小值: {np.min(sigma_r)/1e6:.2f} MPa (巷壁)")
    print(f"    最大值: {np.max(sigma_r)/1e6:.2f} MPa")
    print(f"  环向应力 σθ:")
    print(f"    最小值: {np.min(sigma_theta)/1e6:.2f} MPa")
    print(f"    最大值: {np.max(sigma_theta)/1e6:.2f} MPa (峰值)")
    print(f"    峰值位置: {r[np.argmax(sigma_theta)] - R0:.2f} m (距巷壁)")

    # 应力集中系数
    k = np.max(sigma_theta) / P0
    print(f"  应力集中系数 K = {k:.2f}")

    return r, sigma_r, sigma_theta, Rp, R0


def test_asi_comparison():
    """对比不同b值的ASI计算结果"""
    print("\n" + "=" * 60)
    print("测试3: 不同UST参数的ASI对比")
    print("=" * 60)

    geology = create_test_geology()

    # 三种不同的b值
    b_values = [0.0, 0.5, 1.0]
    labels = ['Mohr-Coulomb (b=0)', 'UST标准 (b=0.5)', '双剪理论 (b=1)']

    results = []

    for b, label in zip(b_values, labels):
        indicator = ASIIndicatorUST(b=b)
        result = indicator.compute(geology)
        results.append((label, result))

        print(f"\n{label}:")
        print(f"  ASI值: {result.value:.2f}")
        print(f"  置信度: {result.confidence:.2%}")
        print(f"  塑性区半径: {result.intermediate_results.get('plastic_zone_radius', 0):.2f} m")
        print(f"  应力集中系数: {result.details.get('stress_concentration', 0):.2f}")

    # 对比差异
    print(f"\n对比分析:")
    asi_values = [r[1].value for r in results]
    print(f"  ASI范围: [{min(asi_values):.2f}, {max(asi_values):.2f}]")
    print(f"  最大差异: {max(asi_values) - min(asi_values):.2f}")

    return results


def test_comparison_with_placeholder():
    """对比UST版本与占位版本"""
    print("\n" + "=" * 60)
    print("测试4: UST版本 vs 占位版本对比")
    print("=" * 60)

    geology = create_test_geology()

    # 占位版本
    placeholder = ASIIndicator()
    result_ph = placeholder.compute(geology)

    # UST版本
    ust_indicator = ASIIndicatorUST(b=0.5)
    result_ust = ust_indicator.compute(geology)

    print(f"占位版本:")
    print(f"  ASI: {result_ph.value:.2f}")
    print(f"  置信度: {result_ph.confidence:.2%}")

    print(f"\nUST版本 (b=0.5):")
    print(f"  ASI: {result_ust.value:.2f}")
    print(f"  置信度: {result_ust.confidence:.2%}")

    print(f"\n差异:")
    print(f"  ASI差值: {result_ust.value - result_ph.value:.2f}")
    print(f"  相对变化: {(result_ust.value - result_ph.value)/result_ph.value*100:.1f}%")
    print(f"  置信度提升: {(result_ust.confidence - result_ph.confidence)*100:.1f}%")


def plot_stress_distribution():
    """绘制应力分布图"""
    print("\n" + "=" * 60)
    print("生成应力分布可视化...")
    print("=" * 60)

    ust = UnifiedStrengthTheory(cohesion=2e6, friction_angle=20, b=0.5)
    R0 = 2.0
    P0 = 12e6
    Pi = 0.3e6
    Rp = ust.get_plastic_zone_radius(R0, P0, Pi)

    r, sigma_r, sigma_theta, _, _ = test_stress_distribution()

    # 转换为MPa
    sigma_r_mpa = sigma_r / 1e6
    sigma_theta_mpa = sigma_theta / 1e6
    P0_mpa = P0 / 1e6

    # 创建图形
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

    # 图1: 应力分布曲线
    ax1.plot(r/R0, sigma_r_mpa, 'b-', linewidth=2, label='径向应力 σr')
    ax1.plot(r/R0, sigma_theta_mpa, 'r-', linewidth=2, label='环向应力 σθ')
    ax1.axhline(y=P0_mpa, color='g', linestyle='--', label=f'原岩应力 P0={P0_mpa:.1f}MPa')
    ax1.axvline(x=Rp/R0, color='k', linestyle=':', label=f'塑性区边界 Rp/R0={Rp/R0:.2f}')

    ax1.set_xlabel('相对距离 r/R0', fontsize=12)
    ax1.set_ylabel('应力 (MPa)', fontsize=12)
    ax1.set_title('巷道周围应力分布 (UST b=0.5)', fontsize=14)
    ax1.legend(loc='best')
    ax1.grid(True, alpha=0.3)
    ax1.set_xlim(1, 5)

    # 图2: 不同b值的对比
    b_values = [0.0, 0.25, 0.5, 0.75, 1.0]
    peak_stresses = []

    for b in b_values:
        ust_b = UnifiedStrengthTheory(cohesion=2e6, friction_angle=20, b=b)
        Rp_b = ust_b.get_plastic_zone_radius(R0, P0, Pi)
        r_b = np.linspace(R0, 5*R0, 100)
        _, sigma_theta_b = ust_b.get_stress_distribution(r_b, R0, Rp_b, P0, Pi)
        peak_stresses.append(np.max(sigma_theta_b) / 1e6)

    ax2.plot(b_values, peak_stresses, 'bo-', linewidth=2, markersize=8)
    ax2.set_xlabel('UST参数 b', fontsize=12)
    ax2.set_ylabel('峰值应力 (MPa)', fontsize=12)
    ax2.set_title('不同b值的应力集中效应', fontsize=14)
    ax2.grid(True, alpha=0.3)
    ax2.axvline(x=0, color='r', linestyle='--', alpha=0.5, label='Mohr-Coulomb')
    ax2.axvline(x=1, color='g', linestyle='--', alpha=0.5, label='双剪理论')
    ax2.legend()

    plt.tight_layout()

    # 保存图片
    output_dir = os.path.join(os.path.dirname(__file__), 'output')
    os.makedirs(output_dir, exist_ok=True)
    plt.savefig(os.path.join(output_dir, 'asi_ust_stress_distribution.png'), dpi=150)
    print(f"图片已保存: {os.path.join(output_dir, 'asi_ust_stress_distribution.png')}")

    plt.close()


def run_all_tests():
    """运行所有测试"""
    print("\n" + "=" * 60)
    print("ASI-UST 统一强度理论解析解 测试套件")
    print("=" * 60)

    test_ust_basic()
    test_stress_distribution()
    test_asi_comparison()
    test_comparison_with_placeholder()

    try:
        plot_stress_distribution()
    except Exception as e:
        print(f"绘图失败 (可能缺少matplotlib): {e}")

    print("\n" + "=" * 60)
    print("所有测试完成")
    print("=" * 60)


if __name__ == "__main__":
    run_all_tests()
