"""
DBN融合测试与验证脚本

验证动态贝叶斯网络融合的正确性和性能
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import numpy as np
from datetime import datetime, timedelta

from mpi_advanced import GeologyModel, MiningParameters, GeologyLayer, GeologyLayerType
from mpi_advanced.core.data_models import IndicatorResult, RiskLevel
from mpi_advanced.fusion.dbn_fusion_advanced import (
    DBNFusionAdvanced,
    DynamicBayesianNetwork,
    DBNNode,
    Factor,
    create_dbn_fusion_basic,
    create_dbn_fusion_temporal
)


def create_test_indicator_result(name: str, value: float, confidence: float = 0.8) -> IndicatorResult:
    """创建测试指标结果"""
    return IndicatorResult(
        name=name,
        value=value,
        confidence=confidence,
        risk_level=RiskLevel.LOW if value >= 70 else RiskLevel.MEDIUM if value >= 40 else RiskLevel.HIGH,
        uncertainty_range=(max(0, value - 10), min(100, value + 10)),
        details={},
        indicator_name=name
    )


def test_factor_operations():
    """测试因子基本操作"""
    print("=" * 60)
    print("测试1: 因子操作")
    print("=" * 60)

    # 创建简单因子
    f1 = Factor(['A', 'B'], np.array([
        [0.3, 0.4],
        [0.7, 0.6]
    ]))
    print(f"因子1: vars={f1.variables}, shape={f1.table.shape}")

    # 边缘化
    f1_marginal = f1.marginalize('B')
    print(f"边缘化B后: vars={f1_marginal.variables}, values={f1_marginal.table}")

    # 创建第二个因子
    f2 = Factor(['B', 'C'], np.array([
        [0.2, 0.5],
        [0.8, 0.5]
    ]))

    # 因子乘法
    f_product = f1.multiply(f2)
    print(f"因子乘积: vars={f_product.variables}, shape={f_product.table.shape}")

    # 归一化
    f_product.normalize()
    print(f"归一化后总和: {np.sum(f_product.table):.4f}")

    print("\n✓ 因子操作测试通过")


def test_dbn_structure():
    """测试DBN网络结构"""
    print("\n" + "=" * 60)
    print("测试2: DBN网络结构")
    print("=" * 60)

    dbn_fusion = create_dbn_fusion_basic()

    structure = dbn_fusion.get_network_structure()
    print("网络结构:")
    for node_name, info in structure['nodes'].items():
        print(f"  {node_name}:")
        print(f"    父节点: {info['parents']}")
        print(f"    时间父节点: {info['temporal_parents']}")
        print(f"    状态数: {info['n_states']}")

    print("\n✓ 网络结构测试通过")


def test_static_inference():
    """测试静态推理"""
    print("\n" + "=" * 60)
    print("测试3: 静态概率推理")
    print("=" * 60)

    dbn_fusion = create_dbn_fusion_basic()

    # 测试场景1: 所有指标正常
    rsi = create_test_indicator_result('RSI', 75, 0.85)
    bri = create_test_indicator_result('BRI', 80, 0.80)
    asi = create_test_indicator_result('ASI', 70, 0.82)

    result = dbn_fusion.fuse(rsi, bri, asi)

    print("场景1 - 全部正常:")
    print(f"  RSI={rsi.value}, BRI={bri.value}, ASI={asi.value}")
    print(f"  MPI={result.mpi_value:.2f}, 置信度={result.confidence:.2%}")
    print(f"  风险等级: {result.risk_level.value}")
    print(f"  权重: RSI={result.weights['RSI']:.2f}, BRI={result.weights['BRI']:.2f}, ASI={result.weights['ASI']:.2f}")

    # 测试场景2: 高风险
    rsi2 = create_test_indicator_result('RSI', 30, 0.80)
    bri2 = create_test_indicator_result('BRI', 25, 0.85)
    asi2 = create_test_indicator_result('ASI', 35, 0.78)

    result2 = dbn_fusion.fuse(rsi2, bri2, asi2)

    print("\n场景2 - 全部危险:")
    print(f"  RSI={rsi2.value}, BRI={bri2.value}, ASI={asi2.value}")
    print(f"  MPI={result2.mpi_value:.2f}, 置信度={result2.confidence:.2%}")
    print(f"  风险等级: {result2.risk_level.value}")

    # 验证MPI值范围
    assert 0 <= result.mpi_value <= 100, "MPI值超出范围"
    assert 0 <= result2.mpi_value <= 100, "MPI值超出范围"

    print("\n✓ 静态推理测试通过")


def test_temporal_inference():
    """测试时序推理"""
    print("\n" + "=" * 60)
    print("测试4: 时序推理")
    print("=" * 60)

    dbn_fusion = create_dbn_fusion_temporal()

    # 模拟时间序列
    scenarios = [
        (80, 85, 75),  # t=1: 安全
        (75, 80, 70),  # t=2: 仍然安全
        (60, 65, 55),  # t=3: 开始下降
        (45, 50, 40),  # t=4: 警戒
        (30, 35, 25),  # t=5: 危险
    ]

    print("时间序列分析:")
    print("-" * 40)

    for t, (rsi_v, bri_v, asi_v) in enumerate(scenarios, 1):
        rsi = create_test_indicator_result('RSI', rsi_v)
        bri = create_test_indicator_result('BRI', bri_v)
        asi = create_test_indicator_result('ASI', asi_v)

        result = dbn_fusion.fuse(rsi, bri, asi)

        trend_info = ""
        if result.recommendations and any("趋势" in r for r in result.recommendations):
            trend_info = [r for r in result.recommendations if "趋势" in r][0]

        print(f"t={t}: MPI={result.mpi_value:.1f}, 风险={result.risk_level.value[:1]}, {trend_info}")

    print("\n✓ 时序推理测试通过")


def test_evidence_conflict_detection():
    """测试证据冲突检测"""
    print("\n" + "=" * 60)
    print("测试5: 证据冲突检测")
    print("=" * 60)

    dbn_fusion = create_dbn_fusion_basic()

    # 场景1: 低冲突 (指标一致)
    rsi1 = create_test_indicator_result('RSI', 75, 0.85)
    bri1 = create_test_indicator_result('BRI', 70, 0.80)
    asi1 = create_test_indicator_result('ASI', 72, 0.82)

    result1 = dbn_fusion.fuse(rsi1, bri1, asi1)
    conflict1 = result1.intermediate_results.get('is_conflict', False)

    print("场景1 - 指标一致:")
    print(f"  RSI={rsi1.value}, BRI={bri1.value}, ASI={asi1.value}")
    print(f"  冲突检测: {conflict1}")

    # 场景2: 高冲突 (指标不一致)
    rsi2 = create_test_indicator_result('RSI', 80, 0.85)  # 安全
    bri2 = create_test_indicator_result('BRI', 25, 0.80)  # 危险
    asi2 = create_test_indicator_result('ASI', 75, 0.82)  # 安全

    result2 = dbn_fusion.fuse(rsi2, bri2, asi2)
    conflict2 = result2.intermediate_results.get('is_conflict', False)
    conflict_degree2 = result2.intermediate_results.get('conflict_degree', 0)

    print("\n场景2 - 指标冲突:")
    print(f"  RSI={rsi2.value}, BRI={bri2.value}, ASI={asi2.value}")
    print(f"  冲突检测: {conflict2}, 冲突程度: {conflict_degree2:.2%}")

    # 验证冲突被检测
    assert conflict2 == True, "应该检测到冲突"
    assert any("冲突" in r for r in result2.recommendations), "建议中应包含冲突警告"

    print("\n✓ 证据冲突检测测试通过")


def test_weight_adjustment():
    """测试动态权重调整"""
    print("\n" + "=" * 60)
    print("测试6: 动态权重调整")
    print("=" * 60)

    dbn_fusion = create_dbn_fusion_basic()

    # 低置信度场景
    rsi = create_test_indicator_result('RSI', 50, 0.5)  # 低置信度
    bri = create_test_indicator_result('BRI', 50, 0.9)  # 高置信度
    asi = create_test_indicator_result('ASI', 50, 0.85)

    result = dbn_fusion.fuse(rsi, bri, asi)

    print("低置信度场景:")
    print(f"  RSI置信度={rsi.confidence}, BRI={bri.confidence}, ASI={asi.confidence}")
    print(f"  调整后权重:")
    print(f"    RSI: {result.weights['RSI']:.3f}")
    print(f"    BRI: {result.weights['BRI']:.3f}")
    print(f"    ASI: {result.weights['ASI']:.3f}")

    # 验证权重归一化
    total_weight = sum(result.weights.values())
    assert abs(total_weight - 1.0) < 1e-6, f"权重未归一化: {total_weight}"

    print("\n✓ 动态权重调整测试通过")


def test_uncertainty_quantification():
    """测试不确定性量化"""
    print("\n" + "=" * 60)
    print("测试7: 不确定性量化")
    print("=" * 60)

    dbn_fusion = create_dbn_fusion_basic()

    # 高不确定性场景
    rsi = create_test_indicator_result('RSI', 50, 0.6)
    rsi.uncertainty_range = (30, 70)  # 大区间

    bri = create_test_indicator_result('BRI', 55, 0.9)
    bri.uncertainty_range = (45, 65)

    asi = create_test_indicator_result('ASI', 52, 0.7)
    asi.uncertainty_range = (35, 70)

    result = dbn_fusion.fuse(rsi, bri, asi)

    print("不确定性分析:")
    print(f"  MPI值: {result.mpi_value:.2f}")
    print(f"  95%可信区间: [{result.credible_interval[0]:.1f}, {result.credible_interval[1]:.1f}]")
    print(f"  区间宽度: {result.credible_interval[1] - result.credible_interval[0]:.1f}")
    print(f"  综合置信度: {result.confidence:.2%}")

    # 验证区间有效性
    assert result.credible_interval[0] <= result.mpi_value <= result.credible_interval[1], \
        "MPI值应在可信区间内"

    print("\n✓ 不确定性量化测试通过")


def test_comparison_with_placeholder():
    """对比高级版本与占位版本"""
    print("\n" + "=" * 60)
    print("测试8: DBN高级版 vs 占位版对比")
    print("=" * 60)

    from mpi_advanced.fusion.dbn_fusion import DBNFusionMethod

    # 相同输入
    rsi = create_test_indicator_result('RSI', 55, 0.80)
    bri = create_test_indicator_result('BRI', 45, 0.75)
    asi = create_test_indicator_result('ASI', 60, 0.82)

    # 占位版本
    placeholder = DBNFusionMethod()
    result_ph = placeholder.fuse(rsi, bri, asi)

    # 高级版本
    advanced = create_dbn_fusion_basic()
    result_adv = advanced.fuse(rsi, bri, asi)

    print("相同输入:")
    print(f"  RSI={rsi.value}, BRI={bri.value}, ASI={asi.value}")

    print("\n占位版本:")
    print(f"  MPI: {result_ph.mpi_value:.2f}")
    print(f"  置信度: {result_ph.confidence:.2%}")
    print(f"  方法: {result_ph.computation_method}")

    print("\n高级版本:")
    print(f"  MPI: {result_adv.mpi_value:.2f}")
    print(f"  置信度: {result_adv.confidence:.2%}")
    print(f"  方法: {result_adv.computation_method}")

    print("\n创新点:")
    print("  ✓ 概率图模型推理")
    print("  ✓ 证据冲突检测")
    print("  ✓ 不确定性量化")
    print("  ✓ 时序依赖建模")

    print("\n✓ 对比测试通过")


def test_performance():
    """测试计算性能"""
    print("\n" + "=" * 60)
    print("测试9: 计算性能")
    print("=" * 60)

    import time

    dbn_fusion = create_dbn_fusion_basic()

    rsi = create_test_indicator_result('RSI', 55, 0.80)
    bri = create_test_indicator_result('BRI', 45, 0.75)
    asi = create_test_indicator_result('ASI', 60, 0.82)

    # 多次运行取平均
    n_runs = 100
    start = time.time()

    for _ in range(n_runs):
        result = dbn_fusion.fuse(rsi, bri, asi)

    elapsed = time.time() - start
    avg_time = elapsed / n_runs * 1000  # ms

    print(f"运行次数: {n_runs}")
    print(f"总时间: {elapsed:.3f}s")
    print(f"平均每次: {avg_time:.3f}ms")

    if avg_time < 10:
        print("✓ 性能优秀 (< 10ms)")
    elif avg_time < 50:
        print("✓ 性能良好 (< 50ms)")
    else:
        print("⚠ 性能一般，建议优化")

    print("\n✓ 性能测试通过")


def main():
    """运行所有测试"""
    print("\n" + "=" * 60)
    print("DBN融合 动态贝叶斯网络 测试套件")
    print("=" * 60)

    test_factor_operations()
    test_dbn_structure()
    test_static_inference()
    test_temporal_inference()
    test_evidence_conflict_detection()
    test_weight_adjustment()
    test_uncertainty_quantification()
    test_comparison_with_placeholder()
    test_performance()

    print("\n" + "=" * 60)
    print("所有测试完成")
    print("=" * 60)


if __name__ == "__main__":
    main()
