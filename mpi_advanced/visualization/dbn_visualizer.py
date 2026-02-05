"""
DBN网络可视化

可视化动态贝叶斯网络结构、CPT和推理过程
"""

import numpy as np
from typing import Dict, Any, Optional, List, Tuple
import warnings

try:
    import networkx as nx
    NETWORKX_AVAILABLE = True
except ImportError:
    NETWORKX_AVAILABLE = False

try:
    import matplotlib.pyplot as plt
    from matplotlib.patches import FancyArrowPatch, Circle, FancyBboxPatch
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False

try:
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots
    PLOTLY_AVAILABLE = True
except ImportError:
    PLOTLY_AVAILABLE = False


class DBNVisualizer:
    """
    DBN网络可视化器

    功能：
    1. 网络拓扑图（片内+片间连接）
    2. CPT热力图
    3. 推理过程动画
    4. 后验概率条形图
    """

    def __init__(self, backend: str = 'matplotlib'):
        """
        初始化可视化器

        Args:
            backend: 'matplotlib', 'plotly', 或 'networkx'
        """
        self.backend = backend
        self.node_positions: Dict[str, Tuple[float, float]] = {}

    def draw_network_structure(self, dbn: Any, figsize: Tuple[int, int] = (12, 8)) -> Any:
        """
        绘制DBN网络结构

        Args:
            dbn: DynamicBayesianNetwork实例
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        nodes = list(dbn.nodes.keys())

        # 定义节点位置（两个时间片）
        # 时间片 t-1 (左) 和 t (右)
        pos_t1 = {
            'HGI': (-2, 2), 'RSI': (-2, 0), 'BRI': (-2, -1.5), 'ASI': (-2, -3)
        }
        pos_t2 = {
            'HGI': (2, 2), 'RSI': (2, 0), 'BRI': (2, -1.5), 'ASI': (2, -3), 'MPI': (4, -1.5)
        }

        if self.backend == 'networkx' and NETWORKX_AVAILABLE:
            return self._draw_networkx(dbn, pos_t1, pos_t2, figsize)
        else:
            return self._draw_matplotlib(dbn, pos_t1, pos_t2, figsize)

    def _draw_matplotlib(self, dbn, pos_t1, pos_t2, figsize):
        """使用matplotlib绘制网络"""
        fig, ax = plt.subplots(figsize=figsize)

        # 绘制时间片框
        rect1 = FancyBboxPatch((-3, -4), 2.5, 7, boxstyle="round,pad=0.1",
                               facecolor='lightblue', alpha=0.3, edgecolor='blue')
        rect2 = FancyBboxPatch((1, -4), 4.5, 7, boxstyle="round,pad=0.1",
                               facecolor='lightgreen', alpha=0.3, edgecolor='green')
        ax.add_patch(rect1)
        ax.add_patch(rect2)

        # 添加时间标签
        ax.text(-1.75, 3.2, '时间片 t-1', ha='center', fontsize=11, fontweight='bold', color='blue')
        ax.text(3, 3.2, '时间片 t', ha='center', fontsize=11, fontweight='bold', color='green')

        # 绘制节点
        all_pos = {**pos_t1, **{k+'_t': v for k, v in pos_t2.items()}}

        # 片内连接 (t-1)
        for node_name, node in dbn.nodes.items():
            if node_name in pos_t1:
                for parent in node.parents:
                    if parent in pos_t1:
                        self._draw_arrow(ax, pos_t1[parent], pos_t1[node_name], 'blue', 0.5)

        # 片内连接 (t)
        for node_name, node in dbn.nodes.items():
            t_name = node_name + '_t' if node_name != 'MPI' else 'MPI_t'
            t_pos = pos_t2.get(node_name, pos_t2.get('MPI'))

            for parent in node.parents:
                parent_t_pos = pos_t2.get(parent)
                if parent_t_pos and t_pos:
                    self._draw_arrow(ax, parent_t_pos, t_pos, 'green', 0.7)

        # 时间连接 (t-1 -> t)
        for node_name, node in dbn.nodes.items():
            if node_name in pos_t1 and node_name in pos_t2:
                if node.temporal_parents:
                    self._draw_arrow(ax, pos_t1[node_name], pos_t2[node_name],
                                   'purple', 1.0, style='dashed')

        # 绘制节点圆圈
        for name, pos in pos_t1.items():
            circle = Circle(pos, 0.3, facecolor='white', edgecolor='blue', linewidth=2)
            ax.add_patch(circle)
            ax.text(pos[0], pos[1], name, ha='center', va='center',
                   fontsize=10, fontweight='bold')

        for name, pos in pos_t2.items():
            color = 'orange' if name == 'MPI' else 'white'
            circle = Circle(pos, 0.3, facecolor=color, edgecolor='green', linewidth=2)
            ax.add_patch(circle)
            label = name if name != 'MPI' else 'MPI'
            ax.text(pos[0], pos[1], label, ha='center', va='center',
                   fontsize=10, fontweight='bold')

        # 图例
        legend_elements = [
            plt.Line2D([0], [0], color='blue', lw=2, alpha=0.5, label='片内连接 (t-1)'),
            plt.Line2D([0], [0], color='green', lw=2, alpha=0.7, label='片内连接 (t)'),
            plt.Line2D([0], [0], color='purple', lw=2, linestyle='--', label='时序连接')
        ]
        ax.legend(handles=legend_elements, loc='upper left', bbox_to_anchor=(1.02, 1))

        ax.set_xlim(-3.5, 6)
        ax.set_ylim(-5, 4)
        ax.set_aspect('equal')
        ax.axis('off')
        ax.set_title('动态贝叶斯网络结构', fontsize=14, fontweight='bold')

        return fig

    def _draw_arrow(self, ax, start, end, color, alpha, style='solid'):
        """绘制箭头"""
        dx = end[0] - start[0]
        dy = end[1] - start[1]

        # 缩短箭头使其不触及圆圈
        length = np.sqrt(dx**2 + dy**2)
        if length > 0.6:
            scale = (length - 0.6) / length
            dx *= scale
            dy *= scale

        ax.annotate('', xy=(start[0] + dx, start[1] + dy), xytext=start,
                   arrowprops=dict(arrowstyle='->', color=color, alpha=alpha,
                                  linestyle=style, lw=2))

    def _draw_networkx(self, dbn, pos_t1, pos_t2, figsize):
        """使用networkx绘制"""
        if not NETWORKX_AVAILABLE:
            raise ImportError("需要安装networkx")

        G = nx.DiGraph()

        # 添加节点
        for name in pos_t1.keys():
            G.add_node(name + '_t1')
        for name in pos_t2.keys():
            G.add_node(name + '_t2')

        # 添加边
        for node_name, node in dbn.nodes.items():
            for parent in node.parents:
                G.add_edge(parent + '_t1', node_name + '_t1')
            if node.temporal_parents:
                for t_parent in node.temporal_parents:
                    G.add_edge(t_parent + '_t1', node_name + '_t2')

        # 合并位置
        pos = {}
        for name, p in pos_t1.items():
            pos[name + '_t1'] = p
        for name, p in pos_t2.items():
            pos[name + '_t2'] = p

        fig, ax = plt.subplots(figsize=figsize)
        nx.draw(G, pos, ax=ax, with_labels=True, node_color='lightblue',
               node_size=2000, font_size=10, font_weight='bold',
               arrows=True, arrowsize=20)
        ax.set_title('DBN网络结构 (NetworkX)')

        return fig

    def draw_cpt_heatmap(self, node_name: str, cpt: np.ndarray,
                        figsize: Tuple[int, int] = (8, 6)) -> Any:
        """
        绘制CPT热力图

        Args:
            node_name: 节点名称
            cpt: 条件概率表
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        fig, ax = plt.subplots(figsize=figsize)

        # 根据CPT维度处理
        if cpt.ndim == 1:
            # 根节点
            cpt_2d = cpt.reshape(-1, 1)
            im = ax.imshow(cpt_2d, cmap='YlOrRd', aspect='auto')
            ax.set_yticks(range(len(cpt)))
            ax.set_yticklabels(['LOW', 'MEDIUM', 'HIGH'])
            ax.set_xticks([])
            ax.set_title(f'{node_name} - 先验概率 P({node_name})', fontsize=12)

            # 添加数值
            for i, v in enumerate(cpt):
                ax.text(0, i, f'{v:.3f}', ha='center', va='center',
                       color='white' if v > 0.5 else 'black', fontweight='bold')

        elif cpt.ndim == 2:
            # 单父节点
            im = ax.imshow(cpt, cmap='YlOrRd', aspect='auto')
            ax.set_xticks(range(cpt.shape[1]))
            ax.set_xticklabels(['LOW', 'MEDIUM', 'HIGH'])
            ax.set_yticks(range(cpt.shape[0]))
            ax.set_yticklabels(['LOW', 'MEDIUM', 'HIGH'])
            ax.set_xlabel('父节点状态', fontsize=11)
            ax.set_ylabel(f'{node_name}状态', fontsize=11)
            ax.set_title(f'{node_name} - 条件概率表 P({node_name}|Parent)', fontsize=12)

            # 添加数值
            for i in range(cpt.shape[0]):
                for j in range(cpt.shape[1]):
                    v = cpt[i, j]
                    ax.text(j, i, f'{v:.2f}', ha='center', va='center',
                           color='white' if v > 0.5 else 'black', fontsize=9)

        plt.colorbar(im, ax=ax, label='概率')
        plt.tight_layout()

        return fig

    def draw_posterior_bars(self, posterior: Dict[str, np.ndarray],
                           figsize: Tuple[int, int] = (12, 6)) -> Any:
        """
        绘制后验概率条形图

        Args:
            posterior: 后验概率字典
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        n_nodes = len(posterior)
        fig, axes = plt.subplots(1, n_nodes, figsize=figsize)

        if n_nodes == 1:
            axes = [axes]

        states = ['LOW', 'MEDIUM', 'HIGH']
        colors = ['#4CAF50', '#FF9800', '#F44336']

        for ax, (node_name, probs) in zip(axes, posterior.items()):
            bars = ax.bar(states, probs, color=colors, alpha=0.7, edgecolor='black')

            # 添加数值标签
            for bar, prob in zip(bars, probs):
                height = bar.get_height()
                ax.text(bar.get_x() + bar.get_width()/2., height,
                       f'{prob:.3f}', ha='center', va='bottom', fontweight='bold')

            ax.set_ylim(0, 1)
            ax.set_ylabel('概率', fontsize=10)
            ax.set_title(f'{node_name}', fontsize=12, fontweight='bold')

            # 高亮最大概率
            max_idx = np.argmax(probs)
            bars[max_idx].set_edgecolor('blue')
            bars[max_idx].set_linewidth(3)

        plt.suptitle('后验概率分布', fontsize=14, fontweight='bold')
        plt.tight_layout()

        return fig

    def draw_inference_process(self, evidence: Dict[str, int],
                               inference_steps: List[Dict],
                               figsize: Tuple[int, int] = (14, 8)) -> Any:
        """
        绘制推理过程动画帧（静态展示）

        Args:
            evidence: 证据
            inference_steps: 推理步骤列表
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        n_steps = len(inference_steps)
        fig, axes = plt.subplots(1, n_steps, figsize=figsize)

        if n_steps == 1:
            axes = [axes]

        states = ['L', 'M', 'H']

        for idx, (ax, step) in enumerate(zip(axes, inference_steps)):
            node_name = step['node']
            probs = step['probabilities']

            colors = ['#4CAF50', '#FF9800', '#F44336']
            bars = ax.bar(states, probs, color=colors, alpha=0.7)

            # 标记证据节点
            if node_name in evidence:
                ax.set_title(f'{node_name}\n(证据)', fontsize=11,
                           color='blue', fontweight='bold')
                for spine in ax.spines.values():
                    spine.set_color('blue')
                    spine.set_linewidth(3)
            else:
                ax.set_title(f'{node_name}\n(推理)', fontsize=11)

            ax.set_ylim(0, 1)
            ax.set_ylabel('概率')

            # 数值
            for bar, prob in zip(bars, probs):
                ax.text(bar.get_x() + bar.get_width()/2., prob + 0.02,
                       f'{prob:.2f}', ha='center', va='bottom', fontsize=9)

            # 步骤编号
            ax.text(0.5, 1.1, f'步骤 {idx+1}', transform=ax.transAxes,
                   ha='center', fontsize=10, bbox=dict(boxstyle='round',
                   facecolor='wheat', alpha=0.5))

        plt.suptitle('DBN推理过程', fontsize=14, fontweight='bold')
        plt.tight_layout()

        return fig


def create_dbn_visualizer(backend: str = 'matplotlib') -> DBNVisualizer:
    """
    创建DBN可视化器

    Args:
        backend: 'matplotlib', 'plotly', 或 'networkx'

    Returns:
        DBNVisualizer实例
    """
    return DBNVisualizer(backend=backend)
