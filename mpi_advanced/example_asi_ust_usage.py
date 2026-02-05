"""
ASI-UST 使用示例

展示如何使用统一强度理论版本的ASI指标
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np

from mpi_advanced import (
    MPIEngine, GeologyModel, MiningParameters, GeologyLayer,
    GeologyLayerType
)
from mpi_advanced.indicators.asi_indicator_ust import (
    ASIIndicatorUST, create_asi_mohr_coulomb,
    create_asi_ust_standard, create_asi_twin_shear
)


def create_test_geology():
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
        panel_length=200.0,
        panel_width=180.0,
        mining_height=3.5,
        mining_depth=450.0,
        advance_rate=4.5,
        support_pressure=0.3e6,
        face_position=120.0
    )

    return GeologyModel(layers=layers, mining_params=mining_params)


def example_direct_usage():
    """示例1: 直接使用UST版本的ASI"""
    print("=" * 60)
    print("示例1: 直接使用UST版本的ASI指标")
    print("=" * 60)

    geology = create_test_geology()

    # 三种不同的强度理论
    indicators = {
        'Mohr-Coulomb (b=0)': create_asi_mohr_coulomb(),
        'UST标准 (b=0.5)': create_asi_ust_standard(),
        '双剪理论 (b=1)': create_asi_twin_shear()
    }

    print("\n不同强度理论的ASI计算结果:")
    print("-" * 60)

    for name, indicator in indicators.items():
        result = indicator.compute(geology)

        print(f"\n{name}:")
        print(f"  ASI值: {result.value:.2f}")
        print(f"  置信度: {result.confidence:.2%}")
        print(f"  应力集中系数: {result.details.get('stress_concentration', 0):.2f}")
        print(f"  塑性区半径: {result.details.get('plastic_zone_radius', 0):.2f} m")
        print(f"  UST修正因子: {result.details.get('ust_factor', 1.0):.3f}")


def example_compare_with_placeholder():
    """示例2: 对比占位版本和UST版本"""
    print("\n" + "=" * 60)
    print("示例2: 占位版本 vs UST版本对比")
    print("=" * 60)

    from mpi_advanced.indicators.asi_indicator import ASIIndicator

    geology = create_test_geology()

    # 占位版本
    placeholder = ASIIndicator()
    result_ph = placeholder.compute(geology)

    # UST版本
    ust = ASIIndicatorUST(b=0.5)
    result_ust = ust.compute(geology)

    print("\n占位版本 (经验影响函数):")
    print(f"  ASI: {result_ph.value:.2f}")
    print(f"  置信度: {result_ph.confidence:.2%}")
    print(f"  方法: 经验影响函数")

    print("\nUST版本 (统一强度理论):")
    print(f"  ASI: {result_ust.value:.2f}")
    print(f"  置信度: {result_ust.confidence:.2%}")
    print(f"  方法: UST解析解 (b={ust.b})")

    print("\n提升:")
    print(f"  置信度提升: {(result_ust.confidence - result_ph.confidence)*100:.1f}%")
    print(f"  理论基础: 从经验公式 → 统一强度理论")
    print(f"  中间主应力: 从不考虑 → 显式考虑")


def example_in_mpi_engine():
    """示例3: 在MPI引擎中使用UST版本的ASI"""
    print("\n" + "=" * 60)
    print("示例3: 在MPI引擎中使用UST版本的ASI")
    print("=" * 60)

    geology = create_test_geology()

    # 创建引擎
    engine = MPIEngine()

    # 替换ASI指标为UST版本
    engine.asi_indicator = ASIIndicatorUST(b=0.5)

    # 执行评估
    result = engine.evaluate(geology)

    if result['success']:
        mpi_result = result['result']

        print("\nMPI综合评估结果 (使用UST-ASI):")
        print(f"  MPI值: {mpi_result.mpi_value:.2f}")
        print(f"  风险等级: {mpi_result.risk_level.value}")
        print(f"  综合置信度: {mpi_result.confidence:.2%}")

        print("\n子指标结果:")
        for name, indicator in result['sub_indicators'].items():
            print(f"  {name}: {indicator.value:.2f} "
                  f"(置信度: {indicator.confidence:.2%})")
            if name == 'ASI':
                print(f"    - 方法: {indicator.indicator_name}")
                if 'ust_parameter_b' in indicator.details:
                    print(f"    - UST参数b: {indicator.details['ust_parameter_b']}")


def example_b_parameter_sensitivity():
    """示例4: UST参数b的敏感性分析"""
    print("\n" + "=" * 60)
    print("示例4: UST参数b的敏感性分析")
    print("=" * 60)

    geology = create_test_geology()

    # 测试不同b值
    b_values = np.linspace(0, 1, 11)

    print("\nb值范围: 0.0 (Mohr-Coulomb) → 1.0 (双剪理论)")
    print("-" * 60)

    results = []
    for b in b_values:
        indicator = ASIIndicatorUST(b=b)
        result = indicator.compute(geology)
        results.append((b, result))

        print(f"b={b:.2f}: ASI={result.value:.2f}, "
              f"应力集中={result.details.get('stress_concentration', 0):.2f}, "
              f"塑性区={result.details.get('plastic_zone_radius', 0):.2f}m")

    # 分析敏感性
    asi_values = [r[1].value for r in results]
    print(f"\n敏感性分析:")
    print(f"  ASI范围: [{min(asi_values):.2f}, {max(asi_values):.2f}]")
    print(f"  极差: {max(asi_values) - min(asi_values):.2f}")
    print(f"  标准差: {np.std(asi_values):.2f}")


def main():
    """主函数"""
    print("\n" + "=" * 60)
    print("ASI-UST 统一强度理论版本 使用示例")
    print("=" * 60)

    example_direct_usage()
    example_compare_with_placeholder()
    example_in_mpi_engine()
    example_b_parameter_sensitivity()

    print("\n" + "=" * 60)
    print("所有示例运行完成")
    print("=" * 60)


if __name__ == "__main__":
    main()
