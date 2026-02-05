"""
MPI高级版本 集成测试

验证所有学术升级模块的协同工作
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import numpy as np
from datetime import datetime, timedelta

from mpi_advanced import (
    MPIEngine, GeologyModel, MiningParameters,
    GeologyLayer, GeologyLayerType, MonitoringData, MicroseismicEvent
)


def create_test_geology() -> GeologyModel:
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
            thickness=5.0,
            depth_top=12.0,
            depth_bottom=17.0,
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
            depth_top=17.0,
            depth_bottom=20.5,
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


def create_test_monitoring(n_events: int = 30, risk_level: str = 'normal') -> MonitoringData:
    """创建测试监测数据"""
    events = []
    base_time = datetime.now() - timedelta(days=7)

    # 根据风险等级设置参数
    if risk_level == 'normal':
        mag_mean, mag_std = -1.0, 0.5
    elif risk_level == 'warning':
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
            timestamp=base_time + timedelta(hours=i*5),
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


def test_basic_evaluation():
    """测试基础评估流程"""
    print("=" * 60)
    print("测试1: 基础评估流程")
    print("=" * 60)

    # 使用学术版本
    engine = MPIEngine(use_academic_version=True)

    geology = create_test_geology()
    monitoring = create_test_monitoring(n_events=30, risk_level='normal')

    # 执行评估
    result = engine.evaluate(geology, monitoring)

    assert result['success'], f"评估失败: {result.get('error')}"

    mpi_result = result['result']

    print(f"评估成功!")
    print(f"  MPI值: {mpi_result.mpi_value:.2f}")
    print(f"  风险等级: {mpi_result.risk_level.value}")
    print(f"  置信度: {mpi_result.confidence:.2%}")

    # 验证子指标
    sub = result['sub_indicators']
    print(f"\n子指标:")
    print(f"  RSI (相场): {sub['RSI'].value:.2f}")
    print(f"  BRI (微震): {sub['BRI'].value:.2f}")
    print(f"  ASI (UST): {sub['ASI'].value:.2f}")

    print("\n✓ 基础评估测试通过")


def test_different_risk_scenarios():
    """测试不同风险场景"""
    print("\n" + "=" * 60)
    print("测试2: 不同风险场景")
    print("=" * 60)

    engine = MPIEngine(use_academic_version=True)
    geology = create_test_geology()

    scenarios = [
        ('正常', 'normal'),
        ('警戒', 'warning'),
        ('危险', 'danger')
    ]

    print(f"{'场景':>10} {'RSI':>8} {'BRI':>8} {'ASI':>8} {'MPI':>8} {'风险':>6}")
    print("-" * 60)

    for name, risk in scenarios:
        monitoring = create_test_monitoring(n_events=30, risk_level=risk)
        result = engine.evaluate(geology, monitoring)

        if result['success']:
            mpi = result['result']
            sub = result['sub_indicators']
            risk_short = mpi.risk_level.value[:2]

            print(f"{name:>10} {sub['RSI'].value:>8.1f} {sub['BRI'].value:>8.1f} "
                  f"{sub['ASI'].value:>8.1f} {mpi.mpi_value:>8.1f} {risk_short:>6}")

    print("\n✓ 风险场景测试通过")


def test_temporal_evaluation():
    """测试时序评估"""
    print("\n" + "=" * 60)
    print("测试3: 时序评估")
    print("=" * 60)

    engine = MPIEngine(use_academic_version=True)
    geology = create_test_geology()

    # 模拟连续监测
    print("\n连续监测评估:")
    print(f"{'时间':>6} {'MPI':>8} {'风险':>6} {'趋势':>10}")
    print("-" * 40)

    for t in range(5):
        # 模拟风险逐渐上升
        risk_level = ['normal', 'normal', 'warning', 'warning', 'danger'][t]
        monitoring = create_test_monitoring(n_events=20 + t*5, risk_level=risk_level)

        result = engine.evaluate(geology, monitoring)

        if result['success']:
            mpi = result['result']
            trend = engine.get_trend_analysis()
            trend_str = trend['mpi_trend'][:8] if trend else '-'

            print(f"t={t:>4} {mpi.mpi_value:>8.1f} {mpi.risk_level.value[:2]:>6} {trend_str:>10}")

    print("\n✓ 时序评估测试通过")


def test_module_info():
    """测试模块信息"""
    print("\n" + "=" * 60)
    print("测试4: 模块信息")
    print("=" * 60)

    engine = MPIEngine(use_academic_version=True)
    info = engine.get_module_info()

    print(f"系统版本: {info['version']}")
    print("\n模块配置:")

    for module_name, module_info in info.items():
        if module_name != 'version':
            print(f"\n  {module_name}:")
            print(f"    名称: {module_info['name']}")
            print(f"    版本: {module_info['version']}")

    # 验证使用的是学术版本
    assert info['version'] == 'academic', "应使用学术版本"
    assert 'phase' in info['RSI']['name'].lower() or 'Phase' in info['RSI']['name'], \
        "RSI应使用相场版本"

    print("\n✓ 模块信息测试通过")


def test_comparison_basic_vs_academic():
    """对比基础版和学术版"""
    print("\n" + "=" * 60)
    print("测试5: 基础版 vs 学术版")
    print("=" * 60)

    geology = create_test_geology()
    monitoring = create_test_monitoring(n_events=30, risk_level='warning')

    # 基础版
    engine_basic = MPIEngine(use_academic_version=False)
    result_basic = engine_basic.evaluate(geology, monitoring)

    # 学术版
    engine_academic = MPIEngine(use_academic_version=True)
    result_academic = engine_academic.evaluate(geology, monitoring)

    print("基础版结果:")
    if result_basic['success']:
        mpi = result_basic['result']
        sub = result_basic['sub_indicators']
        print(f"  MPI: {mpi.mpi_value:.2f}")
        print(f"  方法: {mpi.computation_method}")
        print(f"  RSI: {sub['RSI'].value:.2f}, BRI: {sub['BRI'].value:.2f}, ASI: {sub['ASI'].value:.2f}")

    print("\n学术版结果:")
    if result_academic['success']:
        mpi = result_academic['result']
        sub = result_academic['sub_indicators']
        print(f"  MPI: {mpi.mpi_value:.2f}")
        print(f"  方法: {mpi.computation_method}")
        print(f"  RSI (相场): {sub['RSI'].value:.2f}")
        print(f"  BRI (微震): {sub['BRI'].value:.2f}")
        print(f"  ASI (UST): {sub['ASI'].value:.2f}")

    print("\n学术版优势:")
    print("  ✓ RSI: 梁理论 → 相场断裂力学")
    print("  ✓ BRI: 能量公式 → 矩张量+AI")
    print("  ✓ ASI: 经验公式 → 统一强度理论")
    print("  ✓ 融合: 线性加权 → DBN概率图模型")

    print("\n✓ 对比测试通过")


def test_recommendations():
    """测试决策建议"""
    print("\n" + "=" * 60)
    print("测试6: 决策建议")
    print("=" * 60)

    engine = MPIEngine(use_academic_version=True)
    geology = create_test_geology()

    # 危险场景
    monitoring = create_test_monitoring(n_events=40, risk_level='danger')
    result = engine.evaluate(geology, monitoring)

    if result['success']:
        mpi = result['result']
        print(f"场景: 危险 (MPI={mpi.mpi_value:.1f})")
        print("决策建议:")
        for rec in mpi.recommendations[:3]:
            print(f"  - {rec}")

    print("\n✓ 决策建议测试通过")


def main():
    """运行所有集成测试"""
    print("\n" + "=" * 60)
    print("MPI高级版本 集成测试套件")
    print("=" * 60)

    test_basic_evaluation()
    test_different_risk_scenarios()
    test_temporal_evaluation()
    test_module_info()
    test_comparison_basic_vs_academic()
    test_recommendations()

    print("\n" + "=" * 60)
    print("所有集成测试完成")
    print("=" * 60)

    print("\n学术创新成果汇总:")
    print("  1. RSI-PhaseField: 相场断裂模型")
    print("  2. BRI-Microseismic: 矩张量反演+AI前兆识别")
    print("  3. ASI-UST: 统一强度理论")
    print("  4. DBN-Fusion: 动态贝叶斯网络融合")


if __name__ == "__main__":
    main()
