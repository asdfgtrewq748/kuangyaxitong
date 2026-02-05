"""
MPI 仪表盘 - 综合结果展示

支持matplotlib和plotly两种后端
"""

import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import warnings

# 尝试导入plotly，如果不存在则使用matplotlib
try:
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots
    PLOTLY_AVAILABLE = True
except ImportError:
    PLOTLY_AVAILABLE = False

try:
    import matplotlib.pyplot as plt
    from matplotlib.patches import FancyBboxPatch, Circle
    from matplotlib.collections import LineCollection
    import matplotlib.patches as mpatches
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False

from ..core.data_models import MPIResult, IndicatorResult, RiskLevel


class MPIDashboard:
    """
    MPI综合仪表盘

    功能：
    1. 三指标雷达图
    2. MPI风险仪表盘
    3. 时间序列趋势
    4. 不确定性区间
    5. 决策建议面板
    """

    def __init__(self, backend: str = 'auto'):
        """
        初始化仪表盘

        Args:
            backend: 'plotly', 'matplotlib', 或 'auto'
        """
        if backend == 'auto':
            if PLOTLY_AVAILABLE:
                self.backend = 'plotly'
            elif MATPLOTLIB_AVAILABLE:
                self.backend = 'matplotlib'
            else:
                raise ImportError("需要安装plotly或matplotlib")
        else:
            self.backend = backend

        self.history: List[MPIResult] = []

    def add_result(self, result: MPIResult):
        """添加结果到历史"""
        self.history.append(result)

    def create_radar_chart(self, result: MPIResult, figsize: Tuple[int, int] = (8, 8)) -> Any:
        """
        创建三指标雷达图

        Args:
            result: MPI结果
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        categories = ['RSI\n(顶板稳定性)', 'BRI\n(冲击地压风险)', 'ASI\n(支承压力)']

        # 提取值（归一化到0-1）
        values = [
            result.rsi_result.value / 100 if result.rsi_result else 0.5,
            result.bri_result.value / 100 if result.bri_result else 0.5,
            result.asi_result.value / 100 if result.asi_result else 0.5
        ]

        # 闭合雷达图
        values_closed = values + [values[0]]
        angles = np.linspace(0, 2*np.pi, len(categories), endpoint=False).tolist()
        angles_closed = angles + [angles[0]]

        if self.backend == 'plotly':
            fig = go.Figure()

            # 添加填充区域
            fig.add_trace(go.Scatterpolar(
                r=values_closed,
                theta=angles_closed,
                fill='toself',
                fillcolor='rgba(66, 133, 244, 0.3)',
                line=dict(color='rgb(66, 133, 244)', width=2),
                name='当前评估'
            ))

            # 添加风险区域标记
            fig.add_trace(go.Scatterpolar(
                r=[0.4, 0.4, 0.4, 0.4],
                theta=angles_closed,
                mode='lines',
                line=dict(color='red', width=1, dash='dash'),
                name='危险阈值',
                showlegend=True
            ))

            fig.update_layout(
                polar=dict(
                    radialaxis=dict(
                        visible=True,
                        range=[0, 1],
                        tickformat='.0%'
                    )
                ),
                title="三指标风险评估雷达图",
                showlegend=True
            )

        else:  # matplotlib
            fig, ax = plt.subplots(figsize=figsize, subplot_kw=dict(projection='polar'))

            ax.plot(angles_closed, values_closed, 'o-', linewidth=2, color='#4285f4')
            ax.fill(angles_closed, values_closed, alpha=0.3, color='#4285f4')

            # 危险阈值线
            ax.plot(angles_closed, [0.4]*4, 'r--', linewidth=1, label='危险阈值')

            ax.set_xticks(angles)
            ax.set_xticklabels(categories, fontsize=10)
            ax.set_ylim(0, 1)
            ax.set_title("三指标风险评估雷达图", fontsize=14, pad=20)
            ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.0))
            ax.grid(True)

        return fig

    def create_gauge_chart(self, result: MPIResult, figsize: Tuple[int, int] = (10, 6)) -> Any:
        """
        MPI风险仪表盘

        Args:
            result: MPI结果
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        mpi_value = result.mpi_value
        risk_level = result.risk_level

        # 颜色映射
        if mpi_value >= 70:
            color = '#4CAF50'  # 绿色-安全
        elif mpi_value >= 40:
            color = '#FF9800'  # 橙色-警戒
        else:
            color = '#F44336'  # 红色-危险

        if self.backend == 'plotly':
            fig = go.Figure(go.Indicator(
                domain={'x': [0, 1], 'y': [0, 1]},
                value=mpi_value,
                mode="gauge+number+delta",
                title={'text': f"MPI综合风险指数<br><span style='font-size:0.7em;color:gray'>{risk_level.value}</span>"},
                delta={'reference': 50, 'increasing': {'color': "red"}, 'decreasing': {'color': "green"}},
                gauge={
                    'axis': {'range': [0, 100], 'tickwidth': 1},
                    'bar': {'color': color},
                    'bgcolor': "white",
                    'borderwidth': 2,
                    'bordercolor': "gray",
                    'steps': [
                        {'range': [0, 40], 'color': '#FFEBEE'},  # 危险
                        {'range': [40, 70], 'color': '#FFF3E0'},  # 警戒
                        {'range': [70, 100], 'color': '#E8F5E9'}  # 安全
                    ],
                    'threshold': {
                        'line': {'color': "black", 'width': 4},
                        'thickness': 0.75,
                        'value': mpi_value
                    }
                }
            ))

            fig.update_layout(height=400)

        else:  # matplotlib
            fig, ax = plt.subplots(figsize=figsize)

            # 绘制弧形背景
            theta = np.linspace(0, np.pi, 100)

            # 危险区域
            ax.fill_between(np.cos(theta[:40])*0.9, np.sin(theta[:40])*0.9,
                          color='#FFEBEE', alpha=0.5)
            # 警戒区域
            ax.fill_between(np.cos(theta[40:70])*0.9, np.sin(theta[40:70])*0.9,
                          color='#FFF3E0', alpha=0.5)
            # 安全区域
            ax.fill_between(np.cos(theta[70:])*0.9, np.sin(theta[70:])*0.9,
                          color='#E8F5E9', alpha=0.5)

            # 指针
            angle = np.pi * (1 - mpi_value / 100)
            ax.arrow(0, 0, 0.7*np.cos(angle), 0.7*np.sin(angle),
                    head_width=0.05, head_length=0.05, fc=color, ec=color, linewidth=3)

            # 中心文字
            ax.text(0, -0.2, f'{mpi_value:.1f}', ha='center', va='center',
                   fontsize=36, fontweight='bold', color=color)
            ax.text(0, -0.4, risk_level.value, ha='center', va='center',
                   fontsize=14, color='gray')

            ax.set_xlim(-1.2, 1.2)
            ax.set_ylim(-0.6, 1.0)
            ax.set_aspect('equal')
            ax.axis('off')
            ax.set_title('MPI综合风险指数', fontsize=16, pad=20)

        return fig

    def create_trend_chart(self, n_history: int = 10, figsize: Tuple[int, int] = (12, 6)) -> Any:
        """
        时间序列趋势图

        Args:
            n_history: 显示历史点数
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if len(self.history) < 2:
            raise ValueError("历史数据不足，需要至少2个结果")

        recent = self.history[-n_history:]
        times = list(range(len(recent)))

        # 提取数据
        mpi_values = [r.mpi_value for r in recent]
        rsi_values = [r.rsi_result.value if r.rsi_result else 50 for r in recent]
        bri_values = [r.bri_result.value if r.bri_result else 50 for r in recent]
        asi_values = [r.asi_result.value if r.asi_result else 50 for r in recent]

        # 提取可信区间
        lower_bounds = [r.credible_interval[0] for r in recent]
        upper_bounds = [r.credible_interval[1] for r in recent]

        if self.backend == 'plotly':
            fig = go.Figure()

            # MPI主线
            fig.add_trace(go.Scatter(
                x=times, y=mpi_values,
                mode='lines+markers',
                name='MPI',
                line=dict(color='#2196F3', width=3)
            ))

            # 可信区间
            fig.add_trace(go.Scatter(
                x=times + times[::-1],
                y=upper_bounds + lower_bounds[::-1],
                fill='toself',
                fillcolor='rgba(33, 150, 243, 0.2)',
                line=dict(color='rgba(0,0,0,0)'),
                name='95%可信区间'
            ))

            # 子指标
            fig.add_trace(go.Scatter(x=times, y=rsi_values, mode='lines',
                                    name='RSI', line=dict(dash='dash', color='#4CAF50')))
            fig.add_trace(go.Scatter(x=times, y=bri_values, mode='lines',
                                    name='BRI', line=dict(dash='dash', color='#F44336')))
            fig.add_trace(go.Scatter(x=times, y=asi_values, mode='lines',
                                    name='ASI', line=dict(dash='dash', color='#FF9800')))

            # 风险阈值线
            fig.add_hline(y=40, line_dash="dash", line_color="red",
                         annotation_text="危险阈值")
            fig.add_hline(y=70, line_dash="dash", line_color="green",
                         annotation_text="安全阈值")

            fig.update_layout(
                title="风险趋势演化",
                xaxis_title="时间步",
                yaxis_title="风险指数",
                yaxis_range=[0, 100],
                hovermode='x unified'
            )

        else:  # matplotlib
            fig, ax = plt.subplots(figsize=figsize)

            # 可信区间填充
            ax.fill_between(times, lower_bounds, upper_bounds,
                          alpha=0.3, color='#2196F3', label='95%可信区间')

            # 主线
            ax.plot(times, mpi_values, 'o-', linewidth=2, markersize=8,
                   color='#2196F3', label='MPI')
            ax.plot(times, rsi_values, '--', alpha=0.7, color='#4CAF50', label='RSI')
            ax.plot(times, bri_values, '--', alpha=0.7, color='#F44336', label='BRI')
            ax.plot(times, asi_values, '--', alpha=0.7, color='#FF9800', label='ASI')

            # 阈值线
            ax.axhline(y=40, color='red', linestyle='--', alpha=0.5, label='危险阈值')
            ax.axhline(y=70, color='green', linestyle='--', alpha=0.5, label='安全阈值')

            ax.set_xlabel('时间步', fontsize=12)
            ax.set_ylabel('风险指数', fontsize=12)
            ax.set_title('风险趋势演化', fontsize=14)
            ax.set_ylim(0, 100)
            ax.legend(loc='best')
            ax.grid(True, alpha=0.3)

        return fig

    def create_uncertainty_plot(self, result: MPIResult, figsize: Tuple[int, int] = (10, 6)) -> Any:
        """
        不确定性分布图

        Args:
            result: MPI结果
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        # 获取可信区间
        ci = result.credible_interval
        mpi_val = result.mpi_value

        # 生成模拟的后验分布（基于正态近似）
        std = (ci[1] - ci[0]) / 3.92  # 95% CI -> std
        x = np.linspace(max(0, mpi_val - 3*std), min(100, mpi_val + 3*std), 200)
        y = np.exp(-0.5 * ((x - mpi_val) / std) ** 2)
        y = y / np.max(y)  # 归一化

        if self.backend == 'plotly':
            fig = go.Figure()

            # 分布曲线
            fig.add_trace(go.Scatter(
                x=x, y=y,
                mode='lines',
                fill='tozeroy',
                fillcolor='rgba(66, 133, 244, 0.3)',
                line=dict(color='rgb(66, 133, 244)', width=2),
                name='后验分布'
            ))

            # MPI估计值
            fig.add_vline(x=mpi_val, line_dash="solid", line_color="blue",
                         annotation_text=f"MPI={mpi_val:.1f}")

            # 可信区间
            fig.add_vline(x=ci[0], line_dash="dash", line_color="red",
                         annotation_text=f"下界={ci[0]:.1f}")
            fig.add_vline(x=ci[1], line_dash="dash", line_color="red",
                         annotation_text=f"上界={ci[1]:.1f}")

            fig.add_vrect(x0=ci[0], x1=ci[1], fillcolor="green", opacity=0.1,
                         annotation_text="95%可信区间")

            fig.update_layout(
                title="MPI不确定性分布",
                xaxis_title="MPI值",
                yaxis_title="相对概率密度",
                showlegend=False
            )

        else:  # matplotlib
            fig, ax = plt.subplots(figsize=figsize)

            # 分布曲线
            ax.fill_between(x, y, alpha=0.3, color='#4285f4', label='后验分布')
            ax.plot(x, y, color='#4285f4', linewidth=2)

            # MPI估计值
            ax.axvline(x=mpi_val, color='blue', linestyle='-', linewidth=2,
                      label=f'MPI={mpi_val:.1f}')

            # 可信区间
            ax.axvline(x=ci[0], color='red', linestyle='--', alpha=0.7,
                      label=f'95% CI: [{ci[0]:.1f}, {ci[1]:.1f}]')
            ax.axvline(x=ci[1], color='red', linestyle='--', alpha=0.7)
            ax.axvspan(ci[0], ci[1], alpha=0.1, color='green')

            ax.set_xlabel('MPI值', fontsize=12)
            ax.set_ylabel('相对概率密度', fontsize=12)
            ax.set_title('MPI不确定性分布', fontsize=14)
            ax.legend(loc='best')
            ax.grid(True, alpha=0.3)

        return fig

    def create_full_dashboard(self, result: MPIResult, figsize: Tuple[int, int] = (16, 12)) -> Any:
        """
        创建完整仪表盘（多子图）

        Args:
            result: MPI结果
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if self.backend == 'plotly':
            fig = make_subplots(
                rows=2, cols=2,
                subplot_titles=('风险仪表盘', '指标雷达图', '趋势分析', '不确定性'),
                specs=[[{'type': 'indicator'}, {'type': 'polar'}],
                       [{'type': 'xy'}, {'type': 'xy'}]]
            )

            # 仪表盘
            fig.add_trace(go.Indicator(
                mode="gauge+number",
                value=result.mpi_value,
                title={'text': f"MPI<br>{result.risk_level.value}"},
                gauge={'axis': {'range': [0, 100]},
                       'bar': {'color': self._get_risk_color(result.mpi_value)},
                       'steps': [
                           {'range': [0, 40], 'color': '#FFEBEE'},
                           {'range': [40, 70], 'color': '#FFF3E0'},
                           {'range': [70, 100], 'color': '#E8F5E9'}
                       ]}
            ), row=1, col=1)

            # 这里简化处理，完整实现需要分别创建图表再组合

        else:  # matplotlib
            fig = plt.figure(figsize=figsize)
            gs = fig.add_gridspec(3, 3, hspace=0.3, wspace=0.3)

            # 仪表盘
            ax1 = fig.add_subplot(gs[0, 0])
            self._draw_matplotlib_gauge(ax1, result)

            # 雷达图
            ax2 = fig.add_subplot(gs[0, 1:], projection='polar')
            self._draw_matplotlib_radar(ax2, result)

            # 如果有历史数据，显示趋势
            if len(self.history) >= 2:
                ax3 = fig.add_subplot(gs[1, :])
                self._draw_matplotlib_trend(ax3)

            # 不确定性
            ax4 = fig.add_subplot(gs[2, :2])
            self._draw_matplotlib_uncertainty(ax4, result)

            # 决策建议文本
            ax5 = fig.add_subplot(gs[2, 2])
            self._draw_recommendations(ax5, result)

            fig.suptitle('MPI矿压影响评价综合仪表盘', fontsize=16, fontweight='bold')

        return fig

    def _get_risk_color(self, value: float) -> str:
        """根据风险值获取颜色"""
        if value >= 70:
            return '#4CAF50'
        elif value >= 40:
            return '#FF9800'
        else:
            return '#F44336'

    def _draw_matplotlib_gauge(self, ax, result: MPIResult):
        """matplotlib仪表盘"""
        ax.set_xlim(-1.5, 1.5)
        ax.set_ylim(-0.5, 1.5)

        # 绘制半圆
        theta = np.linspace(0, np.pi, 100)
        x = np.cos(theta)
        y = np.sin(theta)

        # 分区颜色
        ax.fill_between(x[:40], y[:40], color='#FFEBEE', alpha=0.7)
        ax.fill_between(x[40:70], y[40:70], color='#FFF3E0', alpha=0.7)
        ax.fill_between(x[70:], y[70:], color='#E8F5E9', alpha=0.7)

        # 指针
        angle = np.pi * (1 - result.mpi_value / 100)
        ax.annotate('', xy=(0.8*np.cos(angle), 0.8*np.sin(angle)),
                   xytext=(0, 0),
                   arrowprops=dict(arrowstyle='->', color='black', lw=3))

        # 文字
        ax.text(0, -0.1, f'{result.mpi_value:.1f}', ha='center', va='center',
               fontsize=24, fontweight='bold')
        ax.text(0, -0.3, result.risk_level.value, ha='center', va='center',
               fontsize=10, color='gray')

        ax.set_aspect('equal')
        ax.axis('off')
        ax.set_title('MPI风险指数', fontsize=12)

    def _draw_matplotlib_radar(self, ax, result: MPIResult):
        """matplotlib雷达图"""
        categories = ['RSI', 'BRI', 'ASI']
        values = [
            result.rsi_result.value / 100 if result.rsi_result else 0.5,
            result.bri_result.value / 100 if result.bri_result else 0.5,
            result.asi_result.value / 100 if result.asi_result else 0.5
        ]

        values += [values[0]]
        angles = np.linspace(0, 2*np.pi, 3, endpoint=False).tolist()
        angles += [angles[0]]

        ax.plot(angles, values, 'o-', linewidth=2, color='#2196F3')
        ax.fill(angles, values, alpha=0.25, color='#2196F3')
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(categories)
        ax.set_ylim(0, 1)
        ax.set_title('指标雷达图', fontsize=12, pad=15)
        ax.grid(True)

    def _draw_matplotlib_trend(self, ax):
        """matplotlib趋势图"""
        recent = self.history[-10:]
        times = range(len(recent))
        values = [r.mpi_value for r in recent]

        ax.plot(times, values, 'o-', color='#2196F3', linewidth=2)
        ax.axhline(y=40, color='red', linestyle='--', alpha=0.5)
        ax.axhline(y=70, color='green', linestyle='--', alpha=0.5)
        ax.set_xlabel('时间步')
        ax.set_ylabel('MPI')
        ax.set_title('趋势分析', fontsize=12)
        ax.grid(True, alpha=0.3)

    def _draw_matplotlib_uncertainty(self, ax, result: MPIResult):
        """matplotlib不确定性图"""
        ci = result.credible_interval
        mpi = result.mpi_value
        std = (ci[1] - ci[0]) / 3.92

        x = np.linspace(max(0, mpi - 3*std), min(100, mpi + 3*std), 100)
        y = np.exp(-0.5 * ((x - mpi) / std) ** 2)

        ax.fill_between(x, y, alpha=0.3, color='#4285f4')
        ax.axvline(mpi, color='blue', linestyle='-', label=f'MPI={mpi:.1f}')
        ax.axvspan(ci[0], ci[1], alpha=0.2, color='green', label=f'95% CI')
        ax.set_xlabel('MPI值')
        ax.set_ylabel('概率密度')
        ax.set_title('不确定性分布', fontsize=12)
        ax.legend()

    def _draw_recommendations(self, ax, result: MPIResult):
        """绘制决策建议"""
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis('off')

        text = "决策建议:\n\n"
        for i, rec in enumerate(result.recommendations[:5], 1):
            text += f"{i}. {rec}\n\n"

        ax.text(0.05, 0.95, text, transform=ax.transAxes,
               fontsize=9, verticalalignment='top',
               bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.3))
        ax.set_title('建议', fontsize=12)


def create_dashboard(backend: str = 'auto') -> MPIDashboard:
    """
    创建仪表盘实例

    Args:
        backend: 'plotly', 'matplotlib', 或 'auto'

    Returns:
        MPIDashboard实例
    """
    return MPIDashboard(backend=backend)
