"""
BRI-Microseismic 测试与验证脚本

验证微震驱动BRI的正确性
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import numpy as np
from datetime import datetime, timedelta

from mpi_advanced import GeologyModel, MiningParameters, GeologyLayer, MonitoringData, MicroseismicEvent, GeologyLayerType
from mpi_advanced.indicators.bri_microseismic import (
    MicroseismicProcessor, MomentTensorInversion, EnergyDensityField,
    PrecursorPredictor, BRIIndicatorMicroseismic,
    create_bri_microseismic_full, create_bri_microseismic_basic
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


def create_simulated_microseismic_events(n_events=50, risk_scenario='normal'):
    """
    创建模拟微震事件

    Args:
        n_events: 事件数量
        risk_scenario: 'normal', 'warning', 'danger'
    """
    events = []
    base_time = datetime.now() - timedelta(days=7)

    # 根据风险场景设置参数
    if risk_scenario == 'normal':
        mag_mean, mag_std = -1.0, 0.5
        energy_factor = 1.0
    elif risk_scenario == 'warning':
        mag_mean, mag_std = 0.0, 0.8
        energy_factor = 10.0
    else:  # danger
        mag_mean, mag_std = 1.0, 1.0
        energy_factor = 100.0

    np.random.seed(42)

    for i in range(n_events):
        # 震级 (高斯分布)
        magnitude = np.random.normal(mag_mean, mag_std)
        magnitude = max(-2.0, min(3.0, magnitude))

        # 能量 (从震级计算)
        energy = 10 ** (1.5 * magnitude + 4.8) * energy_factor

        # 位置 (采区周围)
        location = np.array([
            np.random.uniform(20, 80),   # x
            np.random.uniform(20, 80),   # y
            np.random.uniform(440, 460)  # z
        ])

        event = MicroseismicEvent(
            event_id=f"MS-{i+1:03d}",
            timestamp=base_time + timedelta(hours=i*3.5),
            location=location,
            magnitude=magnitude,
            energy=energy
        )
        events.append(event)

    return events


def test_signal_processor():
    """测试信号处理器"""
    print("=" * 60)
    print("测试1: 微震信号处理")
    print("=" * 60)

    processor = MicroseismicProcessor(sampling_rate=1000)

    # 创建模拟波形
    duration = 1.0  # 秒
    t = np.linspace(0, duration, int(1000 * duration))

    # 模拟P波和S波到达
    p_arrival = 300
    s_arrival = 500

    # 生成模拟波形
    waveform = np.zeros((3, len(t)))
    # P波 (垂直分量)
    waveform[0, p_arrival:p_arrival+100] = np.sin(2*np.pi*50*t[:100]) * np.exp(-t[:100]*20)
    # S波 (水平分量)
    waveform[1, s_arrival:s_arrival+150] = np.sin(2*np.pi*30*t[:150]) * np.exp(-t[:150]*15)
    waveform[2, s_arrival:s_arrival+150] = np.sin(2*np.pi*30*t[:150]) * np.exp(-t[:150]*15)

    # 添加噪声
    waveform += np.random.randn(3, len(t)) * 0.1

    # 处理
    result = processor.process_waveform(waveform)

    print(f"处理结果:")
    print(f"  P波到时: {result['p_arrival']} 样本")
    print(f"  S波到时: {result['s_arrival']} 样本")
    print(f"  实际P波: {p_arrival} 样本")
    print(f"  实际S波: {s_arrival} 样本")

    print(f"\n波形特征:")
    for key, value in result['features'].items():
        print(f"  {key}: {value:.4f}")


def test_moment_tensor_inversion():
    """测试矩张量反演"""
    print("\n" + "=" * 60)
    print("测试2: 矩张量反演")
    print("=" * 60)

    # 传感器位置
    sensors = np.array([
        [0, 0, 400],
        [100, 0, 400],
        [0, 100, 400],
        [100, 100, 400],
    ])

    mt_inv = MomentTensorInversion(
        sensor_positions=sensors,
        velocity_model={'Vp': 4000, 'Vs': 2500}
    )

    # 模拟波形 (简化)
    waveforms = []
    arrivals = []
    for i in range(len(sensors)):
        wf = np.random.randn(3, 1000) * 0.1
        arr = 200 + i * 20
        wf[:, arr:arr+50] += np.sin(np.linspace(0, 4*np.pi, 50)) * 0.5
        waveforms.append(wf)
        arrivals.append(arr)

    # 震源位置
    source_pos = np.array([50, 50, 450])

    # 反演
    try:
        mt = mt_inv.invert(waveforms, arrivals, source_pos)

        print(f"反演结果:")
        print(f"  标量地震矩 M0: {mt.M0:.4e}")
        print(f"  矩震级 Mw: {mt.magnitude:.2f}")

        # 分解
        decomp = mt.decompose()
        print(f"\n震源机制分解:")
        print(f"  ISO: {decomp['iso_percent']:.1f}%")
        print(f"  DC: {decomp['dc_percent']:.1f}%")
        print(f"  CLVD: {decomp['clvd_percent']:.1f}%")
        print(f"  机制类型: {decomp['mechanism']}")

    except Exception as e:
        print(f"反演测试出错: {e}")


def test_energy_density_field():
    """测试能量密度场"""
    print("\n" + "=" * 60)
    print("测试3: 能量密度场构建")
    print("=" * 60)

    # 创建能量场构建器
    ef_builder = EnergyDensityField(
        grid_shape=(20, 20, 10),
        grid_spacing=10.0
    )

    # 创建模拟事件
    events = create_simulated_microseismic_events(n_events=20, risk_scenario='normal')

    # 构建能量场
    energy_field = ef_builder.build_field(events)

    print(f"能量场统计:")
    print(f"  网格尺寸: {energy_field.shape}")
    print(f"  最大值: {np.max(energy_field):.2e}")
    print(f"  最小值: {np.min(energy_field):.2e}")
    print(f"  平均值: {np.mean(energy_field):.2e}")

    # 获取特定位置能量
    test_pos = np.array([50, 50, 450])
    local_energy = ef_builder.get_local_energy(test_pos, energy_field)
    print(f"\n采区中心能量密度: {local_energy:.2e}")


def test_precursor_predictor():
    """测试前兆预测器"""
    print("\n" + "=" * 60)
    print("测试4: 前兆预测")
    print("=" * 60)

    predictor = PrecursorPredictor()

    # 测试不同场景
    scenarios = ['normal', 'warning', 'danger']

    for scenario in scenarios:
        events = create_simulated_microseismic_events(
            n_events=50,
            risk_scenario=scenario
        )

        # 提取特征
        features = predictor.extract_features(events)

        # 预测
        risk_level, confidence = predictor.predict_risk(features)

        print(f"\n{scenario.upper()}场景:")
        print(f"  关键特征:")
        print(f"    事件频率: {features[0]:.2f}")
        print(f"    平均震级: {features[1]:.2f}")
        print(f"    b值: {features[4]:.2f}")
        print(f"  预测结果: {risk_level} (置信度: {confidence:.2%})")


def test_bri_microseismic():
    """测试完整BRI微震指标"""
    print("\n" + "=" * 60)
    print("测试5: BRI微震指标综合测试")
    print("=" * 60)

    geology = create_test_geology()

    # 测试不同风险场景
    scenarios = [
        ('正常', 'normal'),
        ('警戒', 'warning'),
        ('危险', 'danger')
    ]

    for name, scenario in scenarios:
        events = create_simulated_microseismic_events(
            n_events=50,
            risk_scenario=scenario
        )

        monitoring = MonitoringData(
            microseismic_events=events,
            start_time=datetime.now() - timedelta(days=7),
            end_time=datetime.now()
        )

        # 创建BRI指标
        bri_ms = create_bri_microseismic_full()

        # 计算
        result = bri_ms.compute(geology, monitoring)

        print(f"\n{name}场景 ({scenario}):")
        print(f"  BRI值: {result.value:.2f}")
        print(f"  置信度: {result.confidence:.2%}")
        print(f"  不确定性: [{result.uncertainty_range[0]:.1f}, {result.uncertainty_range[1]:.1f}]")

        if 'microseismic_stats' in result.intermediate_results:
            stats = result.intermediate_results['microseismic_stats']
            print(f"  微震统计:")
            print(f"    事件数: {stats['event_count']}")
            print(f"    平均震级: {stats['average_magnitude']:.2f}")
            print(f"    最大震级: {stats['max_magnitude']:.2f}")

        if 'dl_prediction' in result.intermediate_results:
            dl = result.intermediate_results['dl_prediction']
            print(f"    AI预测: {dl['risk_level']} ({dl['confidence']:.1%})")


def test_comparison_with_placeholder():
    """对比微震版本与占位版本"""
    print("\n" + "=" * 60)
    print("测试6: 微震版本 vs 占位版本对比")
    print("=" * 60)

    from mpi_advanced.indicators.bri_indicator import BRIIndicator

    geology = create_test_geology()

    # 创建微震数据
    events = create_simulated_microseismic_events(n_events=50, risk_scenario='warning')
    monitoring = MonitoringData(
        microseismic_events=events,
        start_time=datetime.now() - timedelta(days=7),
        end_time=datetime.now()
    )

    # 占位版本
    placeholder = BRIIndicator()
    result_ph = placeholder.compute(geology, monitoring)

    # 微震版本
    bri_ms = create_bri_microseismic_full()
    result_ms = bri_ms.compute(geology, monitoring)

    print("占位版本 (简化能量公式):")
    print(f"  BRI: {result_ph.value:.2f}")
    print(f"  置信度: {result_ph.confidence:.2%}")

    print("\n微震版本 (矩张量+AI):")
    print(f"  BRI: {result_ms.value:.2f}")
    print(f"  置信度: {result_ms.confidence:.2%}")

    print("\n提升:")
    print(f"  置信度提升: {(result_ms.confidence - result_ph.confidence)*100:.1f}%")
    print(f"  理论基础: 从能量公式 → 微震矩张量+AI")
    print(f"  数据利用: 从地质参数 → 实时监测数据")


def main():
    """运行所有测试"""
    print("\n" + "=" * 60)
    print("BRI-Microseismic 微震驱动BRI 测试套件")
    print("=" * 60)

    test_signal_processor()
    test_moment_tensor_inversion()
    test_energy_density_field()
    test_precursor_predictor()
    test_bri_microseismic()
    test_comparison_with_placeholder()

    print("\n" + "=" * 60)
    print("所有测试完成")
    print("=" * 60)


if __name__ == "__main__":
    main()
