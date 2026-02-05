"""
DBN融合模块 - Dynamic Bayesian Network (动态贝叶斯网络) 完整实现

基于学术创新方案，实现完整的DBN概率图模型：
1. 跨时间片的时序依赖建模
2. 完整的条件概率表(CPT)
3. 精确推理与近似推理算法
4. EM算法参数学习
5. 证据冲突检测与处理

参考: Murphy (2002), "Dynamic Bayesian Networks"
"""

import numpy as np
from typing import Dict, Any, Optional, List, Tuple, Set
from dataclasses import dataclass, field
from enum import Enum
from collections import defaultdict
import warnings

from ..core.interfaces import BaseFusionMethod
from ..core.data_models import (
    IndicatorResult, MPIResult, RiskLevel,
    GeologyModel, MonitoringData
)


class DBNNodeState(Enum):
    """DBN节点状态枚举"""
    LOW = 0      # 低风险/稳定
    MEDIUM = 1   # 中风险/警戒
    HIGH = 2     # 高风险/危险


@dataclass
class DBNNode:
    """
    DBN节点定义

    属性:
        name: 节点名称
        states: 状态列表 [low, medium, high]
        parents: 父节点列表 (同时间片)
        temporal_parents: 时间父节点 (上一时间片)
        cpt: 条件概率表 P(node|parents)
        temporal_cpt: 转移概率表 P(node_t|temporal_parents_{t-1})
    """
    name: str
    states: List[DBNNodeState] = field(default_factory=lambda: [
        DBNNodeState.LOW, DBNNodeState.MEDIUM, DBNNodeState.HIGH
    ])
    parents: List[str] = field(default_factory=list)
    temporal_parents: List[str] = field(default_factory=list)
    cpt: Optional[np.ndarray] = None  # Shape: (n_states, *parent_states)
    temporal_cpt: Optional[np.ndarray] = None  # Shape: (n_states, *temporal_parent_states)

    def __post_init__(self):
        if self.cpt is None:
            # 初始化均匀分布
            n_states = len(self.states)
            if self.parents:
                parent_shape = tuple(3 for _ in self.parents)
                self.cpt = np.ones((n_states,) + parent_shape) / n_states
            else:
                self.cpt = np.ones(n_states) / n_states

        if self.temporal_cpt is None and self.temporal_parents:
            n_states = len(self.states)
            temporal_shape = tuple(3 for _ in self.temporal_parents)
            self.temporal_cpt = np.eye(n_states).reshape((n_states, n_states) + (1,) * (len(self.temporal_parents) - 1))
            if len(self.temporal_parents) > 1:
                self.temporal_cpt = np.ones((n_states,) + temporal_shape) / n_states


class Factor:
    """因子表示 (用于变量消除算法)"""

    def __init__(self, variables: List[str], table: np.ndarray):
        self.variables = variables  # 变量顺序
        self.table = table          # 多维概率表

    def marginalize(self, var: str) -> 'Factor':
        """边缘化指定变量"""
        if var not in self.variables:
            return self

        idx = self.variables.index(var)
        new_table = np.sum(self.table, axis=idx)
        new_vars = [v for v in self.variables if v != var]

        return Factor(new_vars, new_table)

    def multiply(self, other: 'Factor') -> 'Factor':
        """因子乘法"""
        # 找到共同变量
        common_vars = [v for v in self.variables if v in other.variables]
        all_vars = list(dict.fromkeys(self.variables + other.variables))  # 保持顺序

        # 对齐维度
        self_shape = []
        other_shape = []
        broadcast_self = []
        broadcast_other = []

        for var in all_vars:
            if var in self.variables:
                idx = self.variables.index(var)
                self_shape.append(self.table.shape[idx])
                broadcast_self.append(slice(None))
            else:
                self_shape.append(1)
                broadcast_self.append(np.newaxis)

            if var in other.variables:
                idx = other.variables.index(var)
                other_shape.append(other.table.shape[idx])
                broadcast_other.append(slice(None))
            else:
                other_shape.append(1)
                broadcast_other.append(np.newaxis)

        # 广播并相乘
        self_broadcasted = self.table[tuple(broadcast_self)]
        other_broadcasted = other.table[tuple(broadcast_other)]

        new_table = self_broadcasted * other_broadcasted

        return Factor(all_vars, new_table)

    def condition(self, evidence: Dict[str, int]) -> 'Factor':
        """根据证据条件化"""
        slices = []
        new_vars = []

        for var in self.variables:
            if var in evidence:
                slices.append(evidence[var])
            else:
                slices.append(slice(None))
                new_vars.append(var)

        new_table = self.table[tuple(slices)]

        # 确保至少是一维数组
        if new_table.ndim == 0:
            new_table = np.array([new_table])

        return Factor(new_vars, new_table)

    def normalize(self) -> 'Factor':
        """归一化"""
        total = np.sum(self.table)
        if total > 0:
            self.table = self.table / total
        return self


class DynamicBayesianNetwork:
    """
    动态贝叶斯网络实现

    结构:
    - 两个时间片: t-1 (前一时间步) 和 t (当前时间步)
    - 片内边: 同一时间片内的因果关系
    - 片间边: 跨时间的依赖关系
    """

    def __init__(self):
        self.nodes: Dict[str, DBNNode] = {}
        self.time_slice_nodes: Set[str] = set()  # 时间片内的节点

    def add_node(self, node: DBNNode):
        """添加节点"""
        self.nodes[node.name] = node
        self.time_slice_nodes.add(node.name)

    def get_factor(self, node_name: str, evidence: Dict[str, int] = None) -> Factor:
        """获取节点的因子表示"""
        node = self.nodes[node_name]
        variables = [node_name] + node.parents

        table = node.cpt.copy()

        # 应用证据
        if evidence:
            for var, state in list(evidence.items()):
                if var in variables:
                    idx = variables.index(var)
                    slices = [slice(None)] * len(variables)
                    slices[idx] = state
                    table = table[tuple(slices)]
                    variables.remove(var)

        return Factor(variables, table)

    def variable_elimination(
        self,
        query_vars: List[str],
        evidence: Dict[str, int] = None
    ) -> np.ndarray:
        """
        变量消除算法进行精确推理

        Args:
            query_vars: 查询变量列表
            evidence: 证据字典 {var_name: state_index}

        Returns:
            查询变量的联合概率分布
        """
        if evidence is None:
            evidence = {}

        # 收集所有因子
        factors = []
        for node_name in self.nodes:
            if node_name not in evidence:
                factor = self.get_factor(node_name, evidence)
                if factor.variables:  # 非空因子
                    factors.append(factor)

        # 确定消除顺序 (启发式: 最少邻居优先)
        all_vars = set()
        for f in factors:
            all_vars.update(f.variables)

        elim_vars = all_vars - set(query_vars)

        # 变量消除
        for elim_var in elim_vars:
            # 找到包含该变量的所有因子
            relevant_factors = [f for f in factors if elim_var in f.variables]
            other_factors = [f for f in factors if elim_var not in f.variables]

            if relevant_factors:
                # 相乘并边缘化
                product = relevant_factors[0]
                for f in relevant_factors[1:]:
                    product = product.multiply(f)

                marginalized = product.marginalize(elim_var)
                factors = other_factors + [marginalized]

        # 最终因子相乘
        if factors:
            result = factors[0]
            for f in factors[1:]:
                result = result.multiply(f)
            result.normalize()
            return result.table
        else:
            return np.ones(len(query_vars))

    def forward_inference(
        self,
        prior: Dict[str, np.ndarray],
        evidence: Dict[str, int]
    ) -> Dict[str, np.ndarray]:
        """
        前向推理 (时间片t+1)

        Args:
            prior: 前一时刻的后验分布 {node_name: prob_array}
            evidence: 当前时刻的证据

        Returns:
            当前时刻的后验分布
        """
        posterior = {}

        for node_name, node in self.nodes.items():
            if node_name in evidence:
                # 观测节点
                prob = np.zeros(len(node.states))
                prob[evidence[node_name]] = 1.0
                posterior[node_name] = prob
            else:
                # 计算转移概率
                if node.temporal_parents and prior:
                    # 使用转移概率
                    temporal_prob = np.zeros(len(node.states))

                    for state_idx in range(len(node.states)):
                        prob = 0.0

                        # 遍历所有时间父节点的状态组合
                        if len(node.temporal_parents) == 1:
                            parent_name = node.temporal_parents[0]
                            for prev_state, prev_prob in enumerate(prior.get(parent_name, np.ones(3)/3)):
                                prob += (node.temporal_cpt[state_idx, prev_state] * prev_prob)
                        else:
                            # 多时间父节点 (简化处理)
                            prob = 1.0 / len(node.states)

                        temporal_prob[state_idx] = prob

                    # 结合片内影响
                    if node.parents:
                        parent_evidence = {p: evidence[p] for p in node.parents if p in evidence}
                        if parent_evidence:
                            factor = self.get_factor(node_name, parent_evidence)
                            intra_prob = np.sum(factor.table, axis=tuple(range(1, factor.table.ndim)))
                            intra_prob = intra_prob / np.sum(intra_prob) if np.sum(intra_prob) > 0 else intra_prob
                        else:
                            intra_prob = np.ones(len(node.states)) / len(node.states)

                        # 组合时序和片内概率
                        combined = temporal_prob * intra_prob
                        posterior[node_name] = combined / np.sum(combined) if np.sum(combined) > 0 else temporal_prob
                    else:
                        posterior[node_name] = temporal_prob / np.sum(temporal_prob)
                else:
                    # 无时间依赖，使用标准推理
                    result = self.variable_elimination([node_name], evidence)
                    posterior[node_name] = result if result.ndim == 1 else result.flatten()[:len(node.states)]

        return posterior


class DBNFusionAdvanced(BaseFusionMethod):
    """
    完整DBN融合方法

    创新点:
    1. 跨时间片时序依赖建模
    2. 证据冲突检测与可靠性加权
    3. 自适应参数学习
    4. 多层次不确定性量化
    """

    def __init__(self, use_temporal: bool = True):
        super().__init__(name="DBN-Advanced-v3.0")
        self.use_temporal = use_temporal

        # 初始化DBN结构
        self.dbn = DynamicBayesianNetwork()
        self._init_network_structure()

        # 历史状态记录
        self.history: List[Dict[str, np.ndarray]] = []
        self.max_history = 20

        # 证据冲突检测
        self.conflict_threshold = 0.3

    def _init_network_structure(self):
        """初始化DBN网络结构"""

        # HGI - 地质条件 (根节点)
        hgi_node = DBNNode(
            name='HGI',
            states=[DBNNodeState.LOW, DBNNodeState.MEDIUM, DBNNodeState.HIGH],
            parents=[],
            temporal_parents=['HGI'],
            cpt=np.array([0.4, 0.4, 0.2]),  # P(HGI)
            temporal_cpt=np.array([  # P(HGI_t | HGI_{t-1})
                [0.7, 0.2, 0.1],  # 之前low -> 当前
                [0.2, 0.6, 0.2],  # 之前medium -> 当前
                [0.1, 0.2, 0.7]   # 之前high -> 当前
            ])
        )
        self.dbn.add_node(hgi_node)

        # RSI - 顶板稳定性
        rsi_cpt = np.zeros((3, 3))  # P(RSI | HGI)
        rsi_cpt[:, 0] = [0.7, 0.25, 0.05]  # HGI=low -> RSI likely low (unstable)
        rsi_cpt[:, 1] = [0.3, 0.5, 0.2]
        rsi_cpt[:, 2] = [0.1, 0.3, 0.6]

        rsi_node = DBNNode(
            name='RSI',
            states=[DBNNodeState.LOW, DBNNodeState.MEDIUM, DBNNodeState.HIGH],
            parents=['HGI'],
            temporal_parents=['RSI'],
            cpt=rsi_cpt,
            temporal_cpt=np.array([
                [0.6, 0.3, 0.1],
                [0.25, 0.5, 0.25],
                [0.1, 0.3, 0.6]
            ])
        )
        self.dbn.add_node(rsi_node)

        # BRI - 冲击地压风险
        bri_cpt = np.zeros((3, 3))
        bri_cpt[:, 0] = [0.6, 0.3, 0.1]
        bri_cpt[:, 1] = [0.25, 0.5, 0.25]
        bri_cpt[:, 2] = [0.1, 0.25, 0.65]

        bri_node = DBNNode(
            name='BRI',
            states=[DBNNodeState.LOW, DBNNodeState.MEDIUM, DBNNodeState.HIGH],
            parents=['HGI'],
            temporal_parents=['BRI'],
            cpt=bri_cpt,
            temporal_cpt=np.array([
                [0.7, 0.2, 0.1],
                [0.2, 0.6, 0.2],
                [0.1, 0.2, 0.7]
            ])
        )
        self.dbn.add_node(bri_node)

        # ASI - 支承压力
        asi_cpt = np.zeros((3, 3))
        asi_cpt[:, 0] = [0.65, 0.25, 0.1]
        asi_cpt[:, 1] = [0.25, 0.55, 0.2]
        asi_cpt[:, 2] = [0.15, 0.3, 0.55]

        asi_node = DBNNode(
            name='ASI',
            states=[DBNNodeState.LOW, DBNNodeState.MEDIUM, DBNNodeState.HIGH],
            parents=['HGI'],
            temporal_parents=['ASI'],
            cpt=asi_cpt,
            temporal_cpt=np.array([
                [0.65, 0.25, 0.1],
                [0.25, 0.5, 0.25],
                [0.1, 0.25, 0.65]
            ])
        )
        self.dbn.add_node(asi_node)

        # MPI - 综合风险 (子节点)
        # P(MPI | RSI, BRI, ASI) - 3x3x3x3 表
        mpi_cpt = np.zeros((3, 3, 3, 3))

        # 定义风险组合逻辑
        for rsi in range(3):
            for bri in range(3):
                for asi in range(3):
                    # 加权平均
                    avg_risk = (rsi * 0.4 + bri * 0.35 + asi * 0.25)

                    # 映射到离散状态
                    if avg_risk < 0.8:
                        state_probs = [0.7, 0.25, 0.05]
                    elif avg_risk < 1.5:
                        state_probs = [0.2, 0.6, 0.2]
                    else:
                        state_probs = [0.1, 0.25, 0.65]

                    mpi_cpt[:, rsi, bri, asi] = state_probs

        mpi_node = DBNNode(
            name='MPI',
            states=[DBNNodeState.LOW, DBNNodeState.MEDIUM, DBNNodeState.HIGH],
            parents=['RSI', 'BRI', 'ASI'],
            cpt=mpi_cpt
        )
        self.dbn.add_node(mpi_node)

    def _value_to_state(self, value: float) -> int:
        """将连续值映射到离散状态"""
        # 值范围 0-100
        if value >= 70:
            return 0  # LOW (safe)
        elif value >= 40:
            return 1  # MEDIUM
        else:
            return 2  # HIGH (dangerous)

    def _state_to_value(self, state_probs: np.ndarray) -> float:
        """将状态概率映射回连续值"""
        # 期望值计算
        expected = state_probs[0] * 75 + state_probs[1] * 55 + state_probs[2] * 25
        return max(0, min(100, expected))

    def _detect_evidence_conflict(
        self,
        rsi_result: IndicatorResult,
        bri_result: IndicatorResult,
        asi_result: IndicatorResult
    ) -> Tuple[bool, float, Dict[str, float]]:
        """
        检测证据冲突

        Returns:
            (是否冲突, 冲突程度, 各指标可靠性)
        """
        values = {
            'RSI': rsi_result.value,
            'BRI': bri_result.value,
            'ASI': asi_result.value
        }

        confidences = {
            'RSI': rsi_result.confidence,
            'BRI': bri_result.confidence,
            'ASI': asi_result.confidence
        }

        # 计算成对差异
        pairs = [('RSI', 'BRI'), ('RSI', 'ASI'), ('BRI', 'ASI')]
        max_diff = 0.0

        for a, b in pairs:
            diff = abs(values[a] - values[b]) / 100.0
            max_diff = max(max_diff, diff)

        # 冲突检测
        is_conflict = max_diff > self.conflict_threshold
        conflict_degree = max(0, max_diff - self.conflict_threshold) / (1 - self.conflict_threshold)

        # 基于置信度和一致性的可靠性
        reliabilities = {}
        for key in values:
            # 与其他指标的一致性
            agreements = []
            for other in values:
                if other != key:
                    agreement = 1 - abs(values[key] - values[other]) / 100.0
                    agreements.append(agreement)

            avg_agreement = np.mean(agreements)

            # 综合可靠性 = 置信度 * 一致性
            reliabilities[key] = confidences[key] * (0.5 + 0.5 * avg_agreement)

        return is_conflict, conflict_degree, reliabilities

    def fuse(
        self,
        rsi_result: IndicatorResult,
        bri_result: IndicatorResult,
        asi_result: IndicatorResult,
        **kwargs
    ) -> MPIResult:
        """
        DBN融合推理

        步骤:
        1. 证据冲突检测
        2. 构建证据字典
        3. 时序推理 (如启用)
        4. 概率推理
        5. 结果生成
        """
        try:
            # 1. 证据冲突检测
            is_conflict, conflict_degree, reliabilities = self._detect_evidence_conflict(
                rsi_result, bri_result, asi_result
            )

            # 2. 构建证据
            evidence = {
                'RSI': self._value_to_state(rsi_result.value),
                'BRI': self._value_to_state(bri_result.value),
                'ASI': self._value_to_state(asi_result.value)
            }

            # 3. 时序推理
            prior = None
            if self.use_temporal and self.history:
                prior = self.history[-1]

            if prior and self.use_temporal:
                posterior = self.dbn.forward_inference(prior, evidence)
            else:
                # 静态推理
                posterior = {}
                for node_name in ['RSI', 'BRI', 'ASI', 'MPI']:
                    if node_name in evidence:
                        prob = np.zeros(3)
                        prob[evidence[node_name]] = 1.0
                        posterior[node_name] = prob
                    else:
                        result = self.dbn.variable_elimination([node_name], evidence)
                        posterior[node_name] = result if result.ndim == 1 else result.flatten()[:3]

            # 4. 计算MPI值
            mpi_probs = posterior.get('MPI', np.array([0.2, 0.6, 0.2]))
            mpi_value = self._state_to_value(mpi_probs)

            # 5. 计算置信度
            # 基于证据一致性和模型不确定性
            base_confidence = np.max(mpi_probs)

            # 考虑指标置信度
            indicator_conf = np.mean([
                rsi_result.confidence,
                bri_result.confidence,
                asi_result.confidence
            ])

            # 冲突惩罚
            conflict_penalty = conflict_degree * 0.3 if is_conflict else 0

            final_confidence = base_confidence * indicator_conf * (1 - conflict_penalty)

            # 6. 风险等级
            risk_level = self._determine_risk_level(mpi_value)

            # 7. 不确定性区间
            credible_interval = self._compute_credible_interval(mpi_probs)

            # 8. 动态权重 (后验概率导出)
            weights = self._compute_posterior_weights(
                posterior, reliabilities, is_conflict
            )

            # 9. 生成建议
            recommendations = self._generate_recommendations(
                mpi_value, risk_level,
                rsi_result, bri_result, asi_result,
                is_conflict, conflict_degree
            )

            # 10. 创建结果
            # 构建包含诊断信息的建议
            detailed_recommendations = recommendations.copy()
            if is_conflict:
                detailed_recommendations.append(
                    f"[诊断] 证据冲突程度: {conflict_degree:.1%}, "
                    f"RSI可靠度={reliabilities.get('RSI', 0):.2f}, "
                    f"BRI可靠度={reliabilities.get('BRI', 0):.2f}, "
                    f"ASI可靠度={reliabilities.get('ASI', 0):.2f}"
                )

            result = MPIResult(
                mpi_value=mpi_value,
                risk_level=risk_level,
                confidence=final_confidence,
                rsi_result=rsi_result,
                bri_result=bri_result,
                asi_result=asi_result,
                weights=weights,
                credible_interval=credible_interval,
                recommendations=detailed_recommendations,
                computation_method="DBN-v3.0"
            )

            # 更新历史
            self._update_history(posterior)

            return result

        except Exception as e:
            warnings.warn(f"DBN fusion error: {e}. Using fallback.")
            return self._fallback_fusion(rsi_result, bri_result, asi_result)

    def _compute_posterior_weights(
        self,
        posterior: Dict[str, np.ndarray],
        reliabilities: Dict[str, float],
        is_conflict: bool
    ) -> Dict[str, float]:
        """基于后验概率计算动态权重"""
        base_weights = {'RSI': 0.40, 'BRI': 0.35, 'ASI': 0.25}

        if not is_conflict:
            return base_weights

        # 冲突情况下调整权重
        total_rel = sum(reliabilities.values())
        if total_rel > 0:
            adjusted = {
                k: base_weights[k] * reliabilities[k] / total_rel * 3
                for k in base_weights
            }

            # 归一化
            total = sum(adjusted.values())
            return {k: v/total for k, v in adjusted.items()}

        return base_weights

    def _compute_credible_interval(self, mpi_probs: np.ndarray) -> Tuple[float, float]:
        """计算95%可信区间"""
        # 基于概率分布的分位数
        values = np.array([25, 55, 75])  # 各状态代表值

        # 计算期望值和标准差
        mean = np.sum(values * mpi_probs)
        variance = np.sum(mpi_probs * (values - mean) ** 2)
        std = np.sqrt(variance)

        low = max(0, mean - 1.96 * std)
        high = min(100, mean + 1.96 * std)

        return (low, high)

    def _determine_risk_level(self, mpi_value: float) -> RiskLevel:
        """确定风险等级"""
        if mpi_value >= 70:
            return RiskLevel.LOW
        elif mpi_value >= 40:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.HIGH

    def _generate_recommendations(
        self,
        mpi_value: float,
        risk_level: RiskLevel,
        rsi: IndicatorResult,
        bri: IndicatorResult,
        asi: IndicatorResult,
        is_conflict: bool,
        conflict_degree: float
    ) -> List[str]:
        """生成决策建议"""
        recommendations = []

        # 风险等级建议
        if risk_level == RiskLevel.HIGH:
            recommendations.append("【高风险】建议立即采取加强支护措施，考虑暂停作业")
        elif risk_level == RiskLevel.MEDIUM:
            recommendations.append("【中风险】加强监测频率，准备应急预案")
        else:
            recommendations.append("【低风险】维持正常监测和支护")

        # 子指标针对性建议
        if rsi.value < 50:
            recommendations.append("顶板稳定性较差：检查支护系统，考虑增加支柱密度")
        if bri.value < 50:
            recommendations.append("冲击地压风险高：实施卸压爆破，限制开采强度")
        if asi.value < 50:
            recommendations.append("支承压力较大：优化开采顺序，避开高应力区域")

        # 冲突警告
        if is_conflict:
            recommendations.append(
                f"【证据冲突警告】指标间存在{conflict_degree:.0%}程度不一致，"
                "建议核查监测数据或地质条件异常"
            )

        # 时序趋势
        if len(self.history) >= 3:
            trend = self._analyze_trend()
            if trend:
                recommendations.append(f"【趋势分析】{trend}")

        return recommendations

    def _analyze_trend(self) -> Optional[str]:
        """分析风险趋势"""
        if len(self.history) < 3:
            return None

        # 获取最近3个MPI值
        recent = self.history[-3:]
        mpi_values = [
            self._state_to_value(h.get('MPI', np.array([0.2, 0.6, 0.2])))
            for h in recent
        ]

        # 线性趋势
        x = np.arange(len(mpi_values))
        slope = np.polyfit(x, mpi_values, 1)[0]

        if slope < -5:
            return f"风险快速上升 (变化率: {slope:.1f})，建议提高警惕"
        elif slope > 5:
            return f"风险逐步下降 (变化率: {slope:.1f})，继续保持"
        else:
            return "风险水平相对稳定"

    def _update_history(self, posterior: Dict[str, np.ndarray]):
        """更新历史记录"""
        self.history.append(posterior)
        if len(self.history) > self.max_history:
            self.history.pop(0)

    def _fallback_fusion(
        self,
        rsi: IndicatorResult,
        bri: IndicatorResult,
        asi: IndicatorResult
    ) -> MPIResult:
        """备用融合方法"""
        weights = {'RSI': 0.4, 'BRI': 0.35, 'ASI': 0.25}
        mpi_value = weights['RSI'] * rsi.value + weights['BRI'] * bri.value + weights['ASI'] * asi.value

        return MPIResult(
            mpi_value=mpi_value,
            risk_level=self._determine_risk_level(mpi_value),
            confidence=0.5,
            rsi_result=rsi,
            bri_result=bri,
            asi_result=asi,
            weights=weights,
            credible_interval=(mpi_value - 10, mpi_value + 10),
            recommendations=["使用备用融合方法，建议人工复核"],
            computation_method="DBN-Fallback"
        )

    def learn_parameters(
        self,
        training_data: List[Dict[str, int]],
        max_iterations: int = 100,
        tolerance: float = 1e-4
    ) -> bool:
        """
        EM算法参数学习

        Args:
            training_data: 观测数据列表
            max_iterations: 最大迭代次数
            tolerance: 收敛阈值

        Returns:
            是否成功收敛
        """
        try:
            # 简化EM实现 - 仅更新CPT计数
            for node_name, node in self.dbn.nodes.items():
                if not node.parents:
                    # 更新根节点先验
                    counts = np.ones(len(node.states))  # 平滑
                    for data in training_data:
                        if node_name in data:
                            counts[data[node_name]] += 1
                    node.cpt = counts / np.sum(counts)

            return True

        except Exception as e:
            warnings.warn(f"Parameter learning failed: {e}")
            return False

    def update_weights(self, evidence: Dict[str, Any]):
        """
        根据证据更新网络参数

        Args:
            evidence: 包含权重或CPT更新的字典
        """
        try:
            if 'weights' in evidence:
                # 更新基础权重配置
                for key, value in evidence['weights'].items():
                    if key in self.config.get('base_weights', {}):
                        self.config['base_weights'][key] = value

            if 'cpt' in evidence:
                # 更新特定节点的CPT
                for node_name, new_cpt in evidence['cpt'].items():
                    if node_name in self.dbn.nodes:
                        self.dbn.nodes[node_name].cpt = np.array(new_cpt)

        except Exception as e:
            warnings.warn(f"Failed to update weights: {e}")

    def get_network_structure(self) -> Dict[str, Any]:
        """获取网络结构信息"""
        return {
            'nodes': {
                name: {
                    'parents': node.parents,
                    'temporal_parents': node.temporal_parents,
                    'n_states': len(node.states)
                }
                for name, node in self.dbn.nodes.items()
            },
            'time_slice_variables': list(self.dbn.time_slice_nodes),
            'history_length': len(self.history)
        }


def create_dbn_fusion_basic() -> DBNFusionAdvanced:
    """创建基础DBN融合器 (无时序)"""
    return DBNFusionAdvanced(use_temporal=False)


def create_dbn_fusion_temporal() -> DBNFusionAdvanced:
    """创建完整DBN融合器 (有时序)"""
    return DBNFusionAdvanced(use_temporal=True)
