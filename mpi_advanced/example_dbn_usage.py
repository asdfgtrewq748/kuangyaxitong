"""
DBN融合 使用示例

展示如何使用动态贝叶斯网络进行多指标融合
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import numpy as np
from mpi_advanced.core.data_models import IndicatorResult, RiskLevel
from mpi_advanced.fusion.dbn_fusion_advanced import (
    DBNFusionAdvanced,
    create_dbn_fusion_basic,
    create_dbn_fusion_temporal
)


def create_indicator_result(name: str, value: float, confidence: float = 0.8) -> IndicatorResult:
    """创建指标结果"""
    risk = RiskLevel.LOW if value >= 70 else RiskLevel.MEDIUM if value >= 40 else RiskLevel.HIGH
    return IndicatorResult(
        name=name,
        value=value,
        confidence=confidence,
        risk_level=risk,
        uncertainty_range=(max(0, value - 10), min(100, value + 10)),
        details={},
        indicator_name=name
    )


def example_basic_fusion():
    """示例1: 基础DBN融合"""
    print("=" * 60)
    print("示例1: 基础DBN融合 (静态)")
    print("=" * 60)

    # 创建融合器
    fusion = create_dbn_fusion_basic()

    # 准备子指标结果
    rsi = create_indicator_result('RSI', 65, 0.82)
    bri = create_indicator_result('BRI', 55, 0.78)
    asi = create_indicator_result('ASI', 70, 0.85)

    print("\n输入指标:")
    print(f"  RSI (顶板稳定性): {rsi.value}, 置信度: {rsi.confidence:.0%}")
    print(f"  BRI (冲击地压风险): {bri.value}, 置信度: {bri.confidence:.0%}")
    print(f"  ASI (支承压力): {asi.value}, 置信度: {asi.confidence:.0%}")

    # 执行融合
    result = fusion.fuse(rsi, bri, asi)

    print("\n融合结果:")
    print(f"  MPI综合指数: {result.mpi_value:.2f}")
    print(f"  风险等级: {result.risk_level.value}")
    print(f"  置信度: {result.confidence:.2%}")
    print(f"  95%可信区间: [{result.credible_interval[0]:.1f}, {result.credible_interval[1]:.1f}]")

    print("\n动态权重:")
    for k, v in result.weights.items():
        print(f"    {k}: {v:.3f}")

    print("\n决策建议:")
    for rec in result.recommendations:
        print(f"  - {rec}")


def example_temporal_fusion():
    """示例2: 时序DBN融合"""
    print("\n" + "=" * 60)
    print("示例2: 时序DBN融合")
    print("=" * 60)

    # 创建带时序的融合器
    fusion = create_dbn_fusion_temporal()

    # 模拟连续监测数据
    time_series_data = [
        (75, 80, 70),  # t=1: 正常
        (72, 75, 68),  # t=2: 轻微下降
        (65, 68, 60),  # t=3: 持续下降
        (55, 58, 50),  # t=4: 警戒
        (40, 45, 35),  # t=5: 危险
    ]

    print("\n时序监测数据:")
    print("-" * 50)
    print(f"{'时间':>6} {'RSI':>8} {'BRI':>8} {'ASI':>8} {'MPI':>8} {'风险':>6}")
    print("-" * 50)

    for t, (rsi_v, bri_v, asi_v) in enumerate(time_series_data, 1):
        rsi = create_indicator_result('RSI', rsi_v)
        bri = create_indicator_result('BRI', bri_v)
        asi = create_indicator_result('ASI', asi_v)

        result = fusion.fuse(rsi, bri, asi)

        risk_short = result.risk_level.value[:2]
        print(f"{t:>6} {rsi_v:>8} {bri_v:>8} {asi_v:>8} "
              f"{result.mpi_value:>8.1f} {risk_short:>6}")

    print("-" * 50)

    # 显示趋势分析
    trend = fusion.get_trend()
    if trend:
        print(f"\n趋势分析: {trend}")


def example_conflict_detection():
    """示例3: 证据冲突检测"""
    print("\n" + "=" * 60)
    print("示例3: 证据冲突检测")
    print("=" * 60)

    fusion = create_dbn_fusion_basic()

    # 场景1: 一致指标
    print("\n场景A - 指标一致:")
    rsi_a = create_indicator_result('RSI', 75, 0.85)
    bri_a = create_indicator_result('BRI', 70, 0.80)
    asi_a = create_indicator_result('ASI', 72, 0.82)

    result_a = fusion.fuse(rsi_a, bri_a, asi_a)
    print(f"  输入: RSI={rsi_a.value}, BRI={bri_a.value}, ASI={asi_a.value}")
    print(f"  冲突: {result_a.intermediate_results.get('is_conflict', False)}")

    # 场景2: 冲突指标 (顶板安全但冲击危险)
    print("\n场景B - 指标冲突:")
    rsi_b = create_indicator_result('RSI', 80, 0.85)  # 顶板稳定
    bri_b = create_indicator_result('BRI', 25, 0.80)  # 冲击危险
    asi_b = create_indicator_result('ASI', 75, 0.82)  # 压力正常

    result_b = fusion.fuse(rsi_b, bri_b, asi_b)
    conflict = result_b.intermediate_results.get('is_conflict', False)
    conflict_degree = result_b.intermediate_results.get('conflict_degree', 0)

    print(f"  输入: RSI={rsi_b.value}, BRI={bri_b.value}, ASI={asi_b.value}")
    print(f"  冲突: {conflict}, 程度: {conflict_degree:.1%}")

    if conflict:
        print(f"  各指标可靠性:")
        rels = result_b.intermediate_results.get('reliabilities', {})
        for k, v in rels.items():
            print(f"    {k}: {v:.2f}")

    print("\n  冲突时的建议:")
    for rec in result_b.recommendations:
        if '冲突' in rec or 'BRI' in rec:
            print(f"    - {rec}")


def example_uncertainty_analysis():
    """示例4: 不确定性分析"""
    print("\n" + "=" * 60)
    print("示例4: 不确定性分析")
    print("=" * 60)

    fusion = create_dbn_fusion_basic()

    scenarios = [
        ("高置信度", 0.9, 0.88, 0.92),
        ("中置信度", 0.75, 0.70, 0.78),
        ("低置信度", 0.55, 0.50, 0.60),
    ]

    print("\n不同置信度水平的影响:")
    print("-" * 60)
    print(f"{'场景':>12} {'RSIConf':>10} {'BRIConf':>10} {'ASIConf':>10} "
          f"{'MPI':>8} {'置信度':>8} {'区间宽度':>10}")
    print("-" * 60)

    base_values = (60, 55, 58)

    for name, rsi_c, bri_c, asi_c in scenarios:
        rsi = create_indicator_result('RSI', base_values[0], rsi_c)
        bri = create_indicator_result('BRI', base_values[1], bri_c)
        asi = create_indicator_result('ASI', base_values[2], asi_c)

        result = fusion.fuse(rsi, bri, asi)
        interval_width = result.credible_interval[1] - result.credible_interval[0]

        print(f"{name:>12} {rsi_c:>10.2f} {bri_c:>10.2f} {asi_c:>10.2f} "
              f"{result.mpi_value:>8.1f} {result.confidence:>8.2f} {interval_width:>10.1f}")

    print("-" * 60)
    print("结论: 输入置信度越低，输出置信度越低，可信区间越宽")


def example_network_structure():
    """示例5: 查看网络结构"""
    print("\n" + "=" * 60)
    print("示例5: DBN网络结构")
    print("=" * 60)

    fusion = create_dbn_fusion_temporal()
    structure = fusion.get_network_structure()

    print("\nDBN网络节点:")
    for node_name, info in structure['nodes'].items():
        print(f"\n  {node_name}:")
        print(f"    状态: [LOW, MEDIUM, HIGH]")
        if info['parents']:
            print(f"    片内父节点: {info['parents']}")
        if info['temporal_parents']:
            print(f"    时间父节点: {info['temporal_parents']}")
        if not info['parents'] and not info['temporal_parents']:
            print(f"    根节点 (无父节点)")

    print("\n  图结构说明:")
    print("    HGI → RSI → MPI")
    print("      ↘   ↗")
    print("    HGI → BRI → MPI")
    print("      ↘   ↗")
    print("    HGI → ASI → MPI")
    print("\n  时序依赖:")
    print("    RSI_t-1 → RSI_t")
    print("    BRI_t-1 → BRI_t")
    print("    ASI_t-1 → ASI_t")


def example_custom_cpt():
    """示例6: 自定义条件概率表"""
    print("\n" + "=" * 60)
    print("示例6: 自定义CPT参数")
    print("=" * 60)

    fusion = DBNFusionAdvanced(use_temporal=False)

    # 修改RSI节点的CPT
    rsi_node = fusion.dbn.nodes['RSI']

    print("\n原始CPT (P(RSI|HGI)):")
    print(rsi_node.cpt)

    # 自定义: 如果地质条件差，顶板更可能不稳定
    new_cpt = np.array([
        [0.8, 0.15, 0.05],  # HGI=LOW -> RSI likely LOW
        [0.3, 0.5, 0.2],    # HGI=MEDIUM
        [0.1, 0.3, 0.6]     # HGI=HIGH
    ]).T

    rsi_node.cpt = new_cpt

    print("\n修改后CPT:")
    print(rsi_node.cpt)

    # 测试
    rsi = create_indicator_result('RSI', 50)
    bri = create_indicator_result('BRI', 50)
    asi = create_indicator_result('ASI', 50)

    result = fusion.fuse(rsi, bri, asi)
    print(f"\n自定义参数后MPI: {result.mpi_value:.2f}")


def main():
    """主函数"""
    print("\n" + "=" * 60)
    print("DBN融合模块 使用示例")
    print("=" * 60)

    example_basic_fusion()
    example_temporal_fusion()
    example_conflict_detection()
    example_uncertainty_analysis()
    example_network_structure()
    example_custom_cpt()

    print("\n" + "=" * 60)
    print("所有示例运行完成")
    print("=" * 60)


if __name__ == "__main__":
    main()
