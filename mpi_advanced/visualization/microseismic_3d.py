"""
微震事件3D可视化

可视化微震事件的时空分布、能量密度场和矩张量
"""

import numpy as np
from typing import List, Optional, Tuple, Dict, Any
from dataclasses import dataclass

try:
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d import Axes3D
    from mpl_toolkits.mplot3d.art3d import Line3DCollection
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
class MicroseismicEvent:
    """微震事件"""
    event_id: str
    timestamp: Any
    location: np.ndarray  # [x, y, z]
    magnitude: float
    energy: float
    moment_tensor: Optional[np.ndarray] = None


class Microseismic3DPlotter:
    """
    微震3D绘图器

    功能：
    1. 事件时空3D散点图
    2. 能量密度场等值面
    3. 矩张量震源球
    4. 震级-频率分布
    """

    def __init__(self, backend: str = 'matplotlib'):
        self.backend = backend

    def plot_events_3d(self, events: List[MicroseismicEvent],
                      working_face: Optional[Tuple[np.ndarray, np.ndarray]] = None,
                      figsize: Tuple[int, int] = (12, 10),
                      color_by: str = 'magnitude') -> Any:
        """
        绘制微震事件3D分布

        Args:
            events: 微震事件列表
            working_face: 采掘工作面位置 (origin, size)
            figsize: 图形尺寸
            color_by: 着色方式 ('magnitude', 'time', 'energy')

        Returns:
            Figure对象
        """
        if len(events) == 0:
            raise ValueError("事件列表为空")

        # 提取坐标
        x = np.array([e.location[0] for e in events])
        y = np.array([e.location[1] for e in events])
        z = np.array([e.location[2] for e in events])
        mags = np.array([e.magnitude for e in events])
        energies = np.array([e.energy for e in events])

        # 颜色映射
        if color_by == 'magnitude':
            colors = mags
            colorbar_title = '震级'
            size = 10 ** (mags + 2)  # 震级决定大小
        elif color_by == 'energy':
            colors = np.log10(energies + 1)
            colorbar_title = 'log10(能量)'
            size = np.log10(energies + 1) * 10
        else:
            colors = np.arange(len(events))
            colorbar_title = '事件序号'
            size = 50

        if self.backend == 'plotly' and PLOTLY_AVAILABLE:
            return self._plot_3d_plotly(x, y, z, colors, size, colorbar_title,
                                       events, working_face)
        elif MATPLOTLIB_AVAILABLE:
            return self._plot_3d_matplotlib(x, y, z, colors, size, colorbar_title,
                                           events, working_face, figsize)
        else:
            raise ImportError("需要安装matplotlib或plotly")

    def _plot_3d_matplotlib(self, x, y, z, colors, size, colorbar_title,
                           events, working_face, figsize):
        """使用matplotlib绘制3D图"""
        fig = plt.figure(figsize=figsize)
        ax = fig.add_subplot(111, projection='3d')

        # 绘制事件
        scatter = ax.scatter(x, y, z, c=colors, s=size, cmap='jet',
                           alpha=0.6, edgecolors='black', linewidth=0.5)

        # 添加颜色条
        cbar = plt.colorbar(scatter, ax=ax, shrink=0.5, aspect=10)
        cbar.set_label(colorbar_title, fontsize=11)

        # 绘制工作面
        if working_face:
            origin, size = working_face
            self._draw_working_face(ax, origin, size)

        # 绘制坐标轴标签
        ax.set_xlabel('X (m)', fontsize=11)
        ax.set_ylabel('Y (m)', fontsize=11)
        ax.set_zlabel('Z (m)', fontsize=11)
        ax.set_title('微震事件时空分布', fontsize=14)

        # 添加网格
        ax.grid(True, alpha=0.3)

        # 添加图例说明
        legend_text = f'事件数量: {len(events)}\n平均震级: {np.mean([e.magnitude for e in events]):.2f}'
        ax.text2D(0.02, 0.98, legend_text, transform=ax.transAxes,
                 fontsize=10, verticalalignment='top',
                 bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

        return fig

    def _plot_3d_plotly(self, x, y, z, colors, size, colorbar_title,
                       events, working_face):
        """使用plotly绘制3D图"""
        fig = go.Figure()

        # 绘制事件
        hover_text = [f"ID: {e.event_id}<br>震级: {e.magnitude:.2f}<br>能量: {e.energy:.2e}"
                     for e in events]

        fig.add_trace(go.Scatter3d(
            x=x, y=y, z=z,
            mode='markers',
            marker=dict(
                size=np.sqrt(size),
                color=colors,
                colorscale='Jet',
                opacity=0.6,
                line=dict(color='black', width=0.5)
            ),
            text=hover_text,
            hoverinfo='text',
            name='微震事件'
        ))

        # 绘制工作面
        if working_face:
            origin, size = working_face
            self._add_working_face_plotly(fig, origin, size)

        fig.update_layout(
            title='微震事件时空分布',
            scene=dict(
                xaxis_title='X (m)',
                yaxis_title='Y (m)',
                zaxis_title='Z (m)',
                aspectmode='cube'
            ),
            coloraxis_colorbar=dict(title=colorbar_title)
        )

        return fig

    def _draw_working_face(self, ax, origin, size):
        """绘制工作面（matplotlib）"""
        ox, oy, oz = origin
        sx, sy, sz = size

        # 绘制矩形框
        xx, yy = np.meshgrid([ox, ox+sx], [oy, oy+sy])
        zz = np.full_like(xx, oz)
        ax.plot_surface(xx, yy, zz, alpha=0.2, color='red')

        # 添加标签
        ax.text(ox + sx/2, oy + sy/2, oz, '工作面', fontsize=10, color='red')

    def _add_working_face_plotly(self, fig, origin, size):
        """添加工作面到plotly"""
        ox, oy, oz = origin
        sx, sy, sz = size

        # 绘制矩形框
        fig.add_trace(go.Mesh3d(
            x=[ox, ox+sx, ox+sx, ox],
            y=[oy, oy, oy+sy, oy+sy],
            z=[oz, oz, oz, oz],
            color='red',
            opacity=0.2,
            name='工作面'
        ))

    def plot_energy_density_field(self, grid_x: np.ndarray, grid_y: np.ndarray,
                                 grid_z: np.ndarray,
                                 energy_field: np.ndarray,
                                 events: Optional[List[MicroseismicEvent]] = None,
                                 figsize: Tuple[int, int] = (12, 10),
                                 iso_value: Optional[float] = None) -> Any:
        """
        绘制能量密度场等值面

        Args:
            grid_x, grid_y, grid_z: 网格坐标
            energy_field: 能量密度场 (3D数组)
            events: 微震事件（可选，叠加显示）
            figsize: 图形尺寸
            iso_value: 等值面值（默认为最大值的10%）

        Returns:
            Figure对象
        """
        if not PLOTLY_AVAILABLE:
            raise ImportError("能量密度场可视化需要plotly")

        if iso_value is None:
            iso_value = np.max(energy_field) * 0.1

        fig = go.Figure()

        # 添加等值面
        fig.add_trace(go.Isosurface(
            x=grid_x.flatten(),
            y=grid_y.flatten(),
            z=grid_z.flatten(),
            value=energy_field.flatten(),
            isomin=iso_value,
            isomax=np.max(energy_field),
            surface_count=5,
            colorscale='YlOrRd',
            opacity=0.5,
            name='能量密度场'
        ))

        # 叠加事件
        if events:
            x = [e.location[0] for e in events]
            y = [e.location[1] for e in events]
            z = [e.location[2] for e in events]
            mags = [e.magnitude for e in events]

            fig.add_trace(go.Scatter3d(
                x=x, y=y, z=z,
                mode='markers',
                marker=dict(
                    size=5,
                    color=mags,
                    colorscale='Jet',
                    line=dict(color='black', width=0.5)
                ),
                name='微震事件'
            ))

        fig.update_layout(
            title='能量密度场等值面',
            scene=dict(
                xaxis_title='X (m)',
                yaxis_title='Y (m)',
                zaxis_title='Z (m)',
                aspectmode='cube'
            )
        )

        return fig

    def plot_magnitude_frequency(self, events: List[MicroseismicEvent],
                                figsize: Tuple[int, int] = (10, 6)) -> Any:
        """
        绘制震级-频率关系（Gutenberg-Richter定律）

        Args:
            events: 微震事件列表
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        mags = np.array([e.magnitude for e in events])

        # 计算累积频度
        mag_bins = np.arange(np.floor(mags.min()), np.ceil(mags.max()) + 0.1, 0.1)
        cum_counts = []

        for mag_min in mag_bins:
            count = np.sum(mags >= mag_min)
            cum_counts.append(count)

        cum_counts = np.array(cum_counts)

        # 拟合b值
        valid = cum_counts > 0
        if np.sum(valid) > 2:
            log_cum = np.log10(cum_counts[valid])
            mag_valid = mag_bins[valid]

            # 线性拟合 log10(N) = a - b*M
            coeffs = np.polyfit(mag_valid, log_cum, 1)
            b_value = -coeffs[0]
            a_value = coeffs[1]

            fitted = 10 ** (a_value - b_value * mag_bins)
        else:
            b_value = None
            fitted = None

        # 绘制
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=figsize)

        # 左图：震级直方图
        ax1.hist(mags, bins=20, color='steelblue', edgecolor='black', alpha=0.7)
        ax1.set_xlabel('震级', fontsize=12)
        ax1.set_ylabel('频数', fontsize=12)
        ax1.set_title('震级分布直方图', fontsize=12)
        ax1.grid(True, alpha=0.3)

        # 添加统计信息
        stats_text = f'事件数: {len(events)}\n平均震级: {np.mean(mags):.2f}\n最大震级: {np.max(mags):.2f}'
        ax1.text(0.98, 0.98, stats_text, transform=ax1.transAxes,
                fontsize=10, verticalalignment='top', horizontalalignment='right',
                bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

        # 右图：G-R关系
        ax2.scatter(mag_bins[valid], cum_counts[valid], c='red', s=50, alpha=0.6, label='观测数据')

        if fitted is not None:
            ax2.plot(mag_bins, fitted, 'b--', linewidth=2, label=f'拟合: b={b_value:.2f}')

        ax2.set_yscale('log')
        ax2.set_xlabel('震级', fontsize=12)
        ax2.set_ylabel('累积频度 N (>=M)', fontsize=12)
        ax2.set_title('Gutenberg-Richter关系', fontsize=12)
        ax2.legend()
        ax2.grid(True, alpha=0.3, which='both')

        plt.suptitle('微震震级统计分析', fontsize=14, fontweight='bold')
        plt.tight_layout()

        return fig

    def plot_moment_tensor_beachball(self, moment_tensor: np.ndarray,
                                    figsize: Tuple[int, int] = (8, 8)) -> Any:
        """
        绘制矩张量震源球（沙滩球图）

        Args:
            moment_tensor: 3x3矩张量矩阵
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        # 计算特征值和特征向量
        eigenvalues, eigenvectors = np.linalg.eigh(moment_tensor)

        # 排序（降序）
        idx = np.argsort(eigenvalues)[::-1]
        eigenvalues = eigenvalues[idx]

        # 创建极坐标图
        fig, ax = plt.subplots(figsize=figsize, subplot_kw=dict(projection='polar'))

        # 简化：绘制一个代表震源机制的圆
        theta = np.linspace(0, 2*np.pi, 100)

        # 根据ISO/DC/CLVD比例着色
        # 这里简化处理，实际应根据特征值计算辐射图样
        iso = np.trace(moment_tensor) / 3
        dev = moment_tensor - iso * np.eye(3)

        # 绘制震源球（简化表示）
        ax.fill_between(theta, 0, 1, color='red', alpha=0.3)
        ax.fill_between(theta, 0, 0.5, color='white', alpha=1.0)

        ax.set_title('矩张量震源机制\n(简化表示)', fontsize=12)
        ax.set_yticks([])
        ax.set_xticks([])

        # 添加文字说明
        textstr = f'特征值:\nλ1={eigenvalues[0]:.3e}\nλ2={eigenvalues[1]:.3e}\nλ3={eigenvalues[2]:.3e}'
        ax.text(0.5, 0.95, textstr, transform=ax.transAxes, fontsize=10,
               verticalalignment='top', horizontalalignment='center',
               bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

        return fig

    def plot_temporal_evolution(self, events: List[MicroseismicEvent],
                               time_window: str = 'hour',
                               figsize: Tuple[int, int] = (14, 10)) -> Any:
        """
        绘制微震时序演化（多子图）

        Args:
            events: 微震事件列表
            time_window: 时间窗口 ('hour', 'day')
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        # 按时间排序
        sorted_events = sorted(events, key=lambda e: e.timestamp)

        # 提取时间序列
        times = [e.timestamp for e in sorted_events]
        mags = [e.magnitude for e in sorted_events]
        energies = [e.energy for e in sorted_events]

        fig, axes = plt.subplots(3, 1, figsize=figsize, sharex=True)

        # 1. 震级时序
        ax = axes[0]
        ax.scatter(range(len(times)), mags, c=mags, cmap='jet', s=50, alpha=0.6)
        ax.set_ylabel('震级', fontsize=11)
        ax.set_title('微震时序演化分析', fontsize=14, fontweight='bold')
        ax.grid(True, alpha=0.3)

        # 2. 能量时序（对数）
        ax = axes[1]
        ax.semilogy(range(len(times)), energies, 'o-', color='red', markersize=4)
        ax.set_ylabel('能量 (J)', fontsize=11)
        ax.grid(True, alpha=0.3)

        # 3. 累积能量
        ax = axes[2]
        cum_energy = np.cumsum(energies)
        ax.plot(range(len(times)), cum_energy / 1e6, 'g-', linewidth=2)
        ax.set_ylabel('累积能量 (MJ)', fontsize=11)
        ax.set_xlabel('事件序号', fontsize=11)
        ax.grid(True, alpha=0.3)

        plt.tight_layout()

        return fig


def create_microseismic_3d_plotter(backend: str = 'matplotlib') -> Microseismic3DPlotter:
    """创建微震3D绘图器"""
    return Microseismic3DPlotter(backend=backend)
