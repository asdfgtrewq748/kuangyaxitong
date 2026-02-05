"""
BRI-Microseismic 使用示例

展示如何使用微震驱动版本的BRI指标
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import numpy as np
from datetime import datetime, timedelta

from mpi_advanced import (
    MPIEngine, GeologyModel, MiningParameters, GeologyLayer,
    MonitoringData, MicroseismicEvent, GeologyLayerType
)
from mpi_advanced.indicators.bri_microseismic import (
    BRIIndicatorMicroseismic,
    create_bri_microseismic_full,
    create_bri_microseismic_basic
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
        )
    ]

    mining_params = MiningParameters(
        mining_height=3.5,
        mining_depth=450.0,
        support_pressure=0.3e6
    )

    return GeologyModel(layers=layers, mining_params=mining_params)


def create_microseismic_data(scenario='normal', n_events=50):
    """
    创建模拟微震数据

    Args:
        scenario: 'normal', 'warning', 'danger'
        n_events: 事件数量
    """
    events = []
    base_time = datetime.now() - timedelta(days=7)

    # 根据场景设置参数
    if scenario == 'normal':
        mag_mean, mag_std = -1.0, 0.5
    elif scenario == 'warning':
        mag_mean, mag_std = 0.0, 0.8
    else:  # danger
        mag_mean, mag_std = 1.0, 1.0

    np.random.seed(42)

    for i in range(n_events):
        magnitude = np.random.normal(mag_mean, mag_std)
        magnitude = max(-2.0, min(3.0, magnitude))

        energy = 10 ** (1.5 * magnitude + 4.8)

        location = np.array([
            np.random.uniform(20, 80),
            np.random.uniform(20, 80),
            np.random.uniform(440, 460)
        ])

        event = MicroseismicEvent(
            event_id=f"MS-{i+1:03d}",
            timestamp=base_time + timedelta(hours=i*3.5),
            location=location,
            magnitude=magnitude,
            energy=energy
        )
        events.append(event)

    return MonitoringData(
        microseismic_events=events,
        start_time=base_time,
        end_time=datetime.now()
    )


def example_basic_usage():
    """示例1: 基础使用"""
    print("=" * 60)
    print("示例1: BRI微震指标基础使用")
    print("=" * 60)

    geology = create_test_geology()
    monitoring = create_microseismic_data('warning', n_events=50)

    # 创建BRI微震指标
    bri_ms = create_bri_microseismic_full()

    # 计算
    result = bri_ms.compute(geology, monitoring)

    print(f"\n计算结果:")
    print(f"  BRI值: {result.value:.2f}")
    print(f"  置信度: {result.confidence:.2%}")
    print(f"  不确定性区间: [{result.uncertainty_range[0]:.1f}, {result.uncertainty_range[1]:.1f}]")

    print(f"\n微震统计:")
    stats = result.intermediate_results['microseismic_stats']
    print(f"  事件总数: {stats['event_count']}")
    print(f"  平均震级: {stats['average_magnitude']:.2f}")
    print(f"  最大震级: {stats['max_magnitude']:.2f}")
    print(f"  本地能量密度: {stats['local_energy']:.2e}")

    print(f"\nAI预测:")
    dl = result.intermediate_results['dl_prediction']
    print(f"  风险等级: {dl['risk_level']}")
    print(f"  预测置信度: {dl['confidence']:.1%}")


def example_risk_scenarios():
    """示例2: 不同风险场景对比"""
    print("\n" + "=" * 60)
    print("示例2: 不同风险场景对比")
    print("=" * 60)

    geology = create_test_geology()

    scenarios = [
        ('正常生产', 'normal'),
        ('警戒状态', 'warning'),
        ('危险预警', 'danger')
    ]

    print("\n场景对比:")
    print("-" * 60)
    print(f"{'场景':<12} {'BRI值':<8} {'置信度':<10} {'平均震级':<10} {'AI预测':<10}")
    print("-" * 60)

    for name, scenario in scenarios:
        monitoring = create_microseismic_data(scenario, n_events=50)
        bri_ms = create_bri_microseismic_full()
        result = bri_ms.compute(geology, monitoring)

        stats = result.intermediate_results['microseismic_stats']
        dl = result.intermediate_results['dl_prediction']

        print(f"{name:<12} {result.value:>6.2f}   {result.confidence:>7.1%}    "
              f"{stats['average_magnitude']:>6.2f}     {dl['risk_level']:<10}")


def example_in_mpi_engine():
    """示例3: 在MPI引擎中使用"""
    print("\n" + "=" * 60)
    print("示例3: 在MPI引擎中使用微震BRI")
    print("=" * 60)

    geology = create_test_geology()
    monitoring = create_microseismic_data('warning', n_events=50)

    # 创建引擎
    engine = MPIEngine()

    # 替换BRI指标为微震版本
    engine.bri_indicator = create_bri_microseismic_full()

    # 执行评估
    result = engine.evaluate(geology, monitoring)

    if result['success']:
        print("\nMPI综合评估结果 (使用微震BRI):")
        print(f"  MPI值: {result['result'].mpi_value:.2f}")
        print(f"  风险等级: {result['result'].risk_level.value}")
        print(f"  综合置信度: {result['result'].confidence:.2%}")

        print("\n子指标结果:")
        for name, indicator in result['sub_indicators'].items():
            print(f"  {name}: {indicator.value:.2f} "
                  f"(置信度: {indicator.confidence:.2%})")
            if name == 'BRI':
                print(f"    - 方法: {indicator.indicator_name}")


def example_feature_analysis():
    """示例4: 微震特征分析"""
    print("\n" + "=" * 60)
    print("示例4: 微震特征分析")
    print("=" * 60)

    from mpi_advanced.indicators.bri_microseismic import PrecursorPredictor

    monitoring = create_microseismic_data('warning', n_events=50)

    predictor = PrecursorPredictor()
    features = predictor.extract_features(monitoring.microseismic_events)

    print("\n提取的特征:")
    feature_names = [
        '事件频率', '平均震级', '震级标准差', '最大震级',
        'b值', '总能量(log)', '能量速率(log)',
        '空间集中度', '强震数量', '时间密度'
    ]

    for name, value in zip(feature_names, features):
        print(f"  {name}: {value:.4f}")

    # 预测
    risk, conf = predictor.predict_risk(features)
    print(f"\n预测结果: {risk} (置信度: {conf:.1%})")


def main():
    """主函数"""
    print("\n" + "=" * 60)
    print("BRI-Microseismic 微震驱动BRI 使用示例")
    print("=" * 60)

    example_basic_usage()
    example_risk_scenarios()
    example_in_mpi_engine()
    example_feature_analysis()

    print("\n" + "=" * 60)
    print("所有示例运行完成")
    print("=" * 60)


if __name__ == "__main__":
    main()
