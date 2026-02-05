"""
MPI Advanced 使用示例

演示如何使用框架进行矿压影响评价
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
from datetime import datetime, timedelta

from mpi_advanced import (
    MPIEngine, GeologyModel, MiningParameters, GeologyLayer,
    MonitoringData, MicroseismicEvent, RiskLevel,
    GeologyLayerType
)


def create_sample_geology() -> GeologyModel:
    """创建示例地质模型"""

    # 定义岩层
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
            density=1400
        ),
        GeologyLayer(
            name="直接底",
            layer_type=GeologyLayerType.MUDSTONE,
            thickness=3.0,
            depth_top=20.0,
            depth_bottom=23.0,
            elastic_modulus=10e9,
            poisson_ratio=0.27,
            cohesion=4e6,
            friction_angle=28.0,
            tensile_strength=2e6,
            density=2450
        ),
        GeologyLayer(
            name="老底",
            layer_type=GeologyLayerType.SANDSTONE,
            thickness=15.0,
            depth_top=23.0,
            depth_bottom=38.0,
            elastic_modulus=22e9,
            poisson_ratio=0.24,
            cohesion=7e6,
            friction_angle=33.0,
            tensile_strength=3.5e6,
            density=2550
        )
    ]

    # 开采参数
    mining_params = MiningParameters(
        panel_length=200.0,
        panel_width=180.0,
        mining_height=3.5,
        mining_depth=450.0,
        advance_rate=4.5,
        support_pressure=0.3e6,
        face_position=120.0
    )

    return GeologyModel(
        layers=layers,
        mining_params=mining_params
    )


def create_sample_monitoring() -> MonitoringData:
    """创建示例监测数据"""

    # 生成一些模拟微震事件
    events = []
    base_time = datetime.now() - timedelta(days=7)

    np.random.seed(42)

    for i in range(20):
        event = MicroseismicEvent(
            event_id=f"MS-{i+1:03d}",
            timestamp=base_time + timedelta(hours=i*8),
            location=np.array([
                np.random.uniform(0, 200),  # x
                np.random.uniform(0, 180),  # y
                np.random.uniform(450, 470)  # z
            ]),
            magnitude=np.random.uniform(-1.5, 1.0),
            energy=10 ** (1.5 * np.random.uniform(-1.5, 1.0) + 4.8)
        )
        events.append(event)

    return MonitoringData(
        microseismic_events=events,
        start_time=base_time,
        end_time=datetime.now()
    )


def example_basic_evaluation():
    """示例1：基础评估"""
    print("=" * 60)
    print("示例1：基础MPI评估")
    print("=" * 60)

    # 创建数据
    geology = create_sample_geology()
    monitoring = create_sample_monitoring()

    # 创建引擎
    engine = MPIEngine()

    # 执行评估
    result = engine.evaluate(geology, monitoring)

    if result['success']:
        mpi_result = result['result']

        print(f"\n评估时间: {result['timestamp']}")
        print(f"\n【综合结果】")
        print(f"  MPI值: {mpi_result.mpi_value:.2f}")
        print(f"  风险等级: {mpi_result.risk_level.value}")
        print(f"  置信度: {mpi_result.confidence:.2%}")
        print(f"  可信区间: [{mpi_result.credible_interval[0]:.1f}, "
              f"{mpi_result.credible_interval[1]:.1f}]")

        print(f"\n【子指标结果】")
        for name, indicator in result['sub_indicators'].items():
            print(f"  {name}: {indicator.value:.2f} "
                  f"(置信度: {indicator.confidence:.2%})")

        print(f"\n【动态权重】")
        for name, weight in mpi_result.weights.items():
            print(f"  {name}: {weight:.3f}")

        print(f"\n【决策建议】")
        for rec in mpi_result.recommendations:
            print(f"  - {rec}")

    else:
        print(f"评估失败: {result['error']}")

    return result


def example_without_monitoring():
    """示例2：无监测数据的评估"""
    print("\n" + "=" * 60)
    print("示例2：无监测数据的评估")
    print("=" * 60)

    geology = create_sample_geology()

    # 只使用地质数据
    engine = MPIEngine()
    result = engine.evaluate(geology, monitoring=None)

    if result['success']:
        mpi_result = result['result']

        print(f"\n【评估结果】")
        print(f"  MPI值: {mpi_result.mpi_value:.2f}")
        print(f"  风险等级: {mpi_result.risk_level.value}")
        print(f"  置信度: {mpi_result.confidence:.2%} (无监测数据)")

        print(f"\n【数据质量评估】")
        for data_type, quality in result['data_quality'].items():
            print(f"  {data_type}: {quality:.1%}")

    return result


def example_custom_config():
    """示例3：自定义配置"""
    print("\n" + "=" * 60)
    print("示例3：自定义配置")
    print("=" * 60)

    # 自定义配置
    config = {
        'rsi': {
            'safety_factor': 2.0,  # 更保守的安全系数
            'limit_deflection_ratio': 0.08
        },
        'bri': {
            'depth_threshold': 350,
            'hard_roof_penalty': 0.80
        },
        'asi': {
            'peak_stress_factor': 2.8,
            'allowable_stress_ratio': 1.8
        },
        'fusion': {
            'base_weights': {
                'RSI': 0.35,
                'BRI': 0.40,  # 提高BRI权重
                'ASI': 0.25
            }
        }
    }

    geology = create_sample_geology()
    monitoring = create_sample_monitoring()

    engine = MPIEngine(config=config)

    # 查看模块信息
    print("\n【模块配置信息】")
    module_info = engine.get_module_info()
    for module, info in module_info.items():
        print(f"\n{module}:")
        print(f"  名称: {info['name']}")
        if 'version' in info:
            print(f"  版本: {info['version']}")
        print(f"  配置: {info['config']}")

    # 执行评估
    result = engine.evaluate(geology, monitoring)

    if result['success']:
        print(f"\n【评估结果】")
        print(f"  MPI值: {result['result'].mpi_value:.2f}")
        print(f"  风险等级: {result['result'].risk_level.value}")

    return result


def example_batch_evaluation():
    """示例4：批量评估（用于不确定性分析）"""
    print("\n" + "=" * 60)
    print("示例4：批量评估")
    print("=" * 60)

    from mpi_advanced.core.data_models import SimulationScenario

    # 创建多个场景（参数扰动）
    scenarios = []
    base_geology = create_sample_geology()

    for i in range(5):
        # 扰动弹性模量
        perturbed_geology = GeologyModel(
            layers=[
                GeologyLayer(
                    name=l.name,
                    layer_type=l.layer_type,
                    thickness=l.thickness,
                    depth_top=l.depth_top,
                    depth_bottom=l.depth_bottom,
                    elastic_modulus=l.elastic_modulus * (0.9 + 0.2 * np.random.random()),
                    poisson_ratio=l.poisson_ratio,
                    cohesion=l.cohesion,
                    friction_angle=l.friction_angle,
                    tensile_strength=l.tensile_strength,
                    density=l.density
                )
                for l in base_geology.layers
            ],
            mining_params=base_geology.mining_params
        )

        scenario = SimulationScenario(
            scenario_id=i,
            geology=perturbed_geology,
            parameters={'perturbation': f'scenario_{i}'},
            probability=0.2
        )
        scenarios.append(scenario)

    # 批量评估
    engine = MPIEngine()
    print(f"\n评估 {len(scenarios)} 个场景...")

    results = engine.batch_evaluate(scenarios)

    print("\n【批量评估结果】")
    mpi_values = [r.mpi_value for r in results]
    print(f"  MPI均值: {np.mean(mpi_values):.2f}")
    print(f"  MPI标准差: {np.std(mpi_values):.2f}")
    print(f"  MPI范围: [{min(mpi_values):.2f}, {max(mpi_values):.2f}]")

    return results


def example_trend_analysis():
    """示例5：趋势分析"""
    print("\n" + "=" * 60)
    print("示例5：趋势分析")
    print("=" * 60)

    geology = create_sample_geology()
    monitoring = create_sample_monitoring()

    engine = MPIEngine()

    # 模拟多次评估
    print("\n模拟多次评估...")
    for i in range(5):
        # 稍微改变开采位置
        geology.mining_params.face_position += 10

        result = engine.evaluate(geology, monitoring)
        print(f"  第{i+1}次: MPI={result['result'].mpi_value:.2f}, "
              f"风险={result['result'].risk_level.value}")

    # 趋势分析
    trend = engine.get_trend_analysis()
    if trend:
        print(f"\n【趋势分析】")
        print(f"  MPI均值: {trend['mpi_mean']:.2f}")
        print(f"  MPI标准差: {trend['mpi_std']:.2f}")
        print(f"  趋势方向: {trend['mpi_trend']}")
        print(f"  风险变化: {'是' if trend['risk_changes'] else '否'}")

    return trend


def main():
    """主函数：运行所有示例"""
    print("\n" + "=" * 60)
    print("MPI Advanced 框架使用示例")
    print("=" * 60)

    # 运行所有示例
    example_basic_evaluation()
    example_without_monitoring()
    example_custom_config()
    example_batch_evaluation()
    example_trend_analysis()

    print("\n" + "=" * 60)
    print("所有示例运行完成")
    print("=" * 60)


if __name__ == "__main__":
    main()
