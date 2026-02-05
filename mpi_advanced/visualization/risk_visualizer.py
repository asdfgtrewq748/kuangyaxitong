"""
风险可视化模块

专门用于展示矿压风险评估结果的可视化组件
"""

import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime

try:
    import matplotlib.pyplot as plt
    from matplotlib.patches import Rectangle, FancyBboxPatch, Circle
    from matplotlib.collections import PatchCollection
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False

try:
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots
    PLOTLY_AVAILABLE = True
except ImportError:
    PLOTLY_AVAILABLE = False


@dataclass
class RiskZone:
    """风险区域"""
    x: float
    y: float
    width: float
    height: float
    risk_level: str
    risk_value: float
    description: str = ""


class RiskVisualizer:
    """
    风险可视化器

    功能：
    1. 采区风险热力图
    2. 风险矩阵图
    3. 风险对比条形图
    4. 预警指标仪表盘
    """

    def __init__(self, backend: str = 'matplotlib'):
        self.backend = backend

    def plot_mining_area_risk_map(self, risk_zones: List[RiskZone],
                                  mine_boundary: Optional[np.ndarray] = None,
                                  figsize: Tuple[int, int] = (12, 10)) -> Any:
        """
        绘制采区风险热力图

        Args:
            risk_zones: 风险区域列表
            mine_boundary: 矿区边界
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        fig, ax = plt.subplots(figsize=figsize)

        # 颜色映射
        color_map = {
            'LOW': '#4CAF50',
            'MEDIUM': '#FF9800',
            'HIGH': '#F44336'
        }

        # 绘制风险区域
        for zone in risk_zones:
            color = color_map.get(zone.risk_level, '#9E9E9E')
            alpha = 0.3 + 0.5 * (1 - zone.risk_value / 100)

            rect = Rectangle((zone.x, zone.y), zone.width, zone.height,
                           facecolor=color, alpha=alpha,
                           edgecolor='black', linewidth=1)
            ax.add_patch(rect)

            # 添加风险值标注
            center_x = zone.x + zone.width / 2
            center_y = zone.y + zone.height / 2
            ax.text(center_x, center_y, f'{zone.risk_value:.0f}',
                   ha='center', va='center', fontsize=10, fontweight='bold')

        # 绘制矿区边界
        if mine_boundary is not None:
            ax.plot(mine_boundary[:, 0], mine_boundary[:, 1],
                   'k--', linewidth=2, label='矿区边界')

        ax.set_xlabel('X (m)', fontsize=12)
        ax.set_ylabel('Y (m)', fontsize=12)
        ax.set_title('采区风险分布热力图', fontsize=14, fontweight='bold')
        ax.set_aspect('equal')
        ax.grid(True, alpha=0.3)

        # 图例
        from matplotlib.patches import Patch
        legend_elements = [
            Patch(facecolor='#4CAF50', alpha=0.6, label='低风险'),
            Patch(facecolor='#FF9800', alpha=0.6, label='中风险'),
            Patch(facecolor='#F44336', alpha=0.6, label='高风险')
        ]
        ax.legend(handles=legend_elements, loc='upper right')

        return fig

    def plot_risk_matrix(self, probability: np.ndarray, consequence: np.ndarray,
                        current_position: Optional[Tuple[float, float]] = None,
                        figsize: Tuple[int, int] = (10, 10)) -> Any:
        """
        绘制风险矩阵图

        Args:
            probability: 概率网格 (0-1)
            consequence: 后果网格 (0-1)
            current_position: 当前风险位置
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        fig, ax = plt.subplots(figsize=figsize)

        # 创建风险等级网格
        n = len(probability)
        risk_matrix = np.outer(probability, consequence)

        # 颜色映射
        cmap = plt.cm.RdYlGn_r

        # 绘制热力图
        im = ax.imshow(risk_matrix, cmap=cmap, origin='lower',
                      extent=[0, 1, 0, 1], aspect='auto', vmin=0, vmax=1)

        # 添加风险区域边界
        ax.axhline(y=0.3, color='black', linestyle='--', alpha=0.5)
        ax.axhline(y=0.7, color='black', linestyle='--', alpha=0.5)
        ax.axvline(x=0.3, color='black', linestyle='--', alpha=0.5)
        ax.axvline(x=0.7, color='black', linestyle='--', alpha=0.5)

        # 添加文字标签
        regions = [
            (0.15, 0.15, '低风险', 'green'),
            (0.5, 0.15, '中风险', 'orange'),
            (0.85, 0.15, '高风险', 'red'),
            (0.15, 0.5, '中风险', 'orange'),
            (0.5, 0.5, '中风险', 'orange'),
            (0.85, 0.5, '高风险', 'red'),
            (0.15, 0.85, '高风险', 'red'),
            (0.5, 0.85, '高风险', 'red'),
            (0.85, 0.85, '极高风险', 'darkred')
        ]

        for x, y, text, color in regions:
            ax.text(x, y, text, ha='center', va='center',
                   fontsize=11, color=color, fontweight='bold')

        # 标记当前位置
        if current_position:
            ax.scatter(*current_position, s=300, c='blue',
                      marker='*', edgecolors='black', linewidths=2,
                      label='当前风险', zorder=5)

        ax.set_xlabel('后果严重性', fontsize=12)
        ax.set_ylabel('发生概率', fontsize=12)
        ax.set_title('风险矩阵评估', fontsize=14, fontweight='bold')

        cbar = plt.colorbar(im, ax=ax)
        cbar.set_label('风险等级', fontsize=11)

        return fig

    def plot_indicator_comparison(self, values: Dict[str, float],
                                 thresholds: Optional[Dict[str, float]] = None,
                                 figsize: Tuple[int, int] = (10, 6)) -> Any:
        """
        绘制多指标对比条形图

        Args:
            values: 指标值字典
            thresholds: 阈值字典（可选）
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        fig, ax = plt.subplots(figsize=figsize)

        indicators = list(values.keys())
        vals = list(values.values())

        # 根据风险等级着色
        colors = []
        for v in vals:
            if v >= 70:
                colors.append('#4CAF50')
            elif v >= 40:
                colors.append('#FF9800')
            else:
                colors.append('#F44336')

        bars = ax.barh(indicators, vals, color=colors, alpha=0.7, edgecolor='black')

        # 添加阈值线
        if thresholds:
            for i, (ind, bar) in enumerate(zip(indicators, bars)):
                if ind in thresholds:
                    thresh = thresholds[ind]
                    ax.axvline(x=thresh, ymin=i/len(indicators),
                              ymax=(i+1)/len(indicators),
                              color='red', linestyle='--', linewidth=2)

        # 添加数值标签
        for bar, val in zip(bars, vals):
            width = bar.get_width()
            ax.text(width + 1, bar.get_y() + bar.get_height()/2,
                   f'{val:.1f}', ha='left', va='center', fontsize=10)

        # 添加风险区域背景
        ax.axvspan(0, 40, alpha=0.1, color='red', label='危险区')
        ax.axvspan(40, 70, alpha=0.1, color='orange', label='警戒区')
        ax.axvspan(70, 100, alpha=0.1, color='green', label='安全区')

        ax.set_xlim(0, 100)
        ax.set_xlabel('风险指数', fontsize=12)
        ax.set_title('多指标风险对比', fontsize=14, fontweight='bold')
        ax.legend(loc='lower right')
        ax.grid(True, alpha=0.3, axis='x')

        return fig

    def plot_warning_gauges(self, mpi_value: float, rsi_value: float,
                           bri_value: float, asi_value: float,
                           figsize: Tuple[int, int] = (14, 4)) -> Any:
        """
        绘制多指标预警仪表盘

        Args:
            mpi_value: MPI值
            rsi_value: RSI值
            bri_value: BRI值
            asi_value: ASI值
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        fig, axes = plt.subplots(1, 4, figsize=figsize)

        indicators = [
            ('MPI', mpi_value, '综合风险'),
            ('RSI', rsi_value, '顶板稳定性'),
            ('BRI', bri_value, '冲击地压风险'),
            ('ASI', asi_value, '支承压力')
        ]

        for ax, (name, value, desc) in zip(axes, indicators):
            self._draw_single_gauge(ax, name, value, desc)

        plt.suptitle('实时风险监控仪表盘', fontsize=14, fontweight='bold')
        plt.tight_layout()

        return fig

    def _draw_single_gauge(self, ax, name: str, value: float, description: str):
        """绘制单个仪表盘"""
        # 清除坐标轴
        ax.set_xlim(-1.2, 1.2)
        ax.set_ylim(-0.2, 1.2)
        ax.axis('off')

        # 绘制半圆弧形
        theta = np.linspace(0, np.pi, 100)
        x = np.cos(theta)
        y = np.sin(theta)

        # 分区颜色
        ax.fill_between(x[:40], y[:40], color='#FFEBEE', alpha=0.7)
        ax.fill_between(x[40:70], y[40:70], color='#FFF3E0', alpha=0.7)
        ax.fill_between(x[70:], y[70:], color='#E8F5E9', alpha=0.7)

        # 指针
        angle = np.pi * (1 - value / 100)
        ax.arrow(0, 0, 0.8 * np.cos(angle), 0.8 * np.sin(angle),
                head_width=0.05, head_length=0.05, fc='black', ec='black', lw=2)

        # 中心数值
        color = self._get_risk_color(value)
        ax.text(0, -0.05, f'{value:.0f}', ha='center', va='center',
               fontsize=20, fontweight='bold', color=color)

        # 标签
        ax.text(0, 1.1, name, ha='center', va='center',
               fontsize=14, fontweight='bold')
        ax.text(0, -0.25, description, ha='center', va='center',
               fontsize=9, color='gray')

        ax.set_aspect('equal')

    def _get_risk_color(self, value: float) -> str:
        """获取风险颜色"""
        if value >= 70:
            return '#4CAF50'
        elif value >= 40:
            return '#FF9800'
        else:
            return '#F44336'

    def plot_risk_trend_comparison(self,
                                   time_points: np.ndarray,
                                   mpi_history: np.ndarray,
                                   rsi_history: np.ndarray,
                                   bri_history: np.ndarray,
                                   asi_history: np.ndarray,
                                   alert_threshold: float = 40,
                                   figsize: Tuple[int, int] = (14, 8)) -> Any:
        """
        绘制风险趋势对比图

        Args:
            time_points: 时间点
            mpi_history: MPI历史值
            rsi_history: RSI历史值
            bri_history: BRI历史值
            asi_history: ASI历史值
            alert_threshold: 报警阈值
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        fig, axes = plt.subplots(2, 1, figsize=figsize,
                                gridspec_kw={'height_ratios': [2, 1]})

        # 上图：各指标趋势
        ax = axes[0]
        ax.plot(time_points, mpi_history, 'o-', linewidth=2.5,
               markersize=6, color='#2196F3', label='MPI')
        ax.plot(time_points, rsi_history, 's--', linewidth=1.5,
               markersize=4, color='#4CAF50', alpha=0.7, label='RSI')
        ax.plot(time_points, bri_history, '^--', linewidth=1.5,
               markersize=4, color='#F44336', alpha=0.7, label='BRI')
        ax.plot(time_points, asi_history, 'd--', linewidth=1.5,
               markersize=4, color='#FF9800', alpha=0.7, label='ASI')

        # 报警线
        ax.axhline(y=alert_threshold, color='red', linestyle='--',
                  linewidth=2, alpha=0.7, label=f'报警线 ({alert_threshold})')

        # 风险区域
        ax.fill_between(time_points, 0, alert_threshold,
                       alpha=0.1, color='red', label='危险区')
        ax.fill_between(time_points, alert_threshold, 70,
                       alpha=0.1, color='orange', label='警戒区')
        ax.fill_between(time_points, 70, 100,
                       alpha=0.1, color='green', label='安全区')

        ax.set_ylabel('风险指数', fontsize=12)
        ax.set_title('风险趋势对比分析', fontsize=14, fontweight='bold')
        ax.legend(loc='best', ncol=2)
        ax.set_ylim(0, 100)
        ax.grid(True, alpha=0.3)

        # 下图：风险等级变化
        ax = axes[1]
        risk_levels = np.digitize(mpi_history, [0, 40, 70, 100]) - 1
        colors = ['#F44336', '#FF9800', '#4CAF50']
        level_names = ['危险', '警戒', '安全']

        for i in range(len(time_points) - 1):
            ax.barh(0, time_points[i+1] - time_points[i],
                   left=time_points[i], color=colors[risk_levels[i]],
                   height=0.5, alpha=0.7)

        ax.set_xlabel('时间', fontsize=12)
        ax.set_yticks([])
        ax.set_title('风险等级时序', fontsize=12)
        ax.set_ylim(-0.5, 0.5)

        # 图例
        from matplotlib.patches import Patch
        legend_elements = [Patch(facecolor=c, label=n)
                          for c, n in zip(colors, level_names)]
        ax.legend(handles=legend_elements, loc='upper right')

        plt.tight_layout()

        return fig


def create_risk_visualizer(backend: str = 'matplotlib') -> RiskVisualizer:
    """创建风险可视化器"""
    return RiskVisualizer(backend=backend)
