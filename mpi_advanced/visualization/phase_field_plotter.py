"""
相场分布可视化

可视化相场断裂模型的裂纹扩展和损伤分布
"""

import numpy as np
from typing import Optional, Tuple, List, Dict, Any
from dataclasses import dataclass

try:
    import matplotlib.pyplot as plt
    from matplotlib import cm
    from matplotlib.colors import LinearSegmentedColormap
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
class PhaseFieldSnapshot:
    """相场快照"""
    x: np.ndarray
    phi: np.ndarray
    crack_position: Optional[float] = None
    loading: Optional[float] = None
    time_step: int = 0


class PhaseFieldPlotter:
    """
    相场绘图器

    功能：
    1. 1D相场分布曲线
    2. 裂纹扩展过程动画帧
    3. 加载-裂纹演化曲线
    4. 能量释放可视化
    """

    def __init__(self, backend: str = 'matplotlib'):
        self.backend = backend
        self.history: List[PhaseFieldSnapshot] = []

        # 自定义颜色映射（完好-损伤）
        self.cmap = self._create_phase_colormap()

    def _create_phase_colormap(self) -> Any:
        """创建相场颜色映射（蓝色=完好，红色=断裂）"""
        colors = ['#2196F3', '#FFC107', '#F44336']  # 蓝-黄-红
        return LinearSegmentedColormap.from_list('phase', colors)

    def add_snapshot(self, snapshot: PhaseFieldSnapshot):
        """添加相场快照到历史"""
        self.history.append(snapshot)

    def plot_1d_phase_field(self, snapshot: PhaseFieldSnapshot,
                           figsize: Tuple[int, int] = (10, 6),
                           show_damage_threshold: bool = True) -> Any:
        """
        绘制1D相场分布

        Args:
            snapshot: 相场快照
            figsize: 图形尺寸
            show_damage_threshold: 是否显示损伤阈值

        Returns:
            Figure对象
        """
        x = snapshot.x
        phi = snapshot.phi

        if self.backend == 'plotly' and PLOTLY_AVAILABLE:
            fig = go.Figure()

            # 相场曲线
            fig.add_trace(go.Scatter(
                x=x, y=phi,
                mode='lines',
                line=dict(color='blue', width=2),
                name='相场 φ(x)'
            ))

            # 损伤阈值
            if show_damage_threshold:
                fig.add_hline(y=0.5, line_dash="dash", line_color="red",
                             annotation_text="临界损伤 (φ=0.5)")

            # 裂纹位置标记
            if snapshot.crack_position:
                fig.add_vline(x=snapshot.crack_position, line_dash="dot",
                             line_color="green",
                             annotation_text="裂纹位置")

            fig.update_layout(
                title=f"相场分布 (加载={snapshot.loading/1e6:.1f} MPa)" if snapshot.loading else "相场分布",
                xaxis_title="位置 x (m)",
                yaxis_title="相场变量 φ",
                yaxis_range=[-0.1, 1.1],
                showlegend=True
            )

        elif MATPLOTLIB_AVAILABLE:
            fig, ax = plt.subplots(figsize=figsize)

            # 填充不同区域
            ax.fill_between(x, phi, 1, alpha=0.3, color='blue', label='完好区域')
            ax.fill_between(x, 0, phi, alpha=0.3, color='red', label='损伤区域')

            # 相场曲线
            ax.plot(x, phi, 'b-', linewidth=2, label='φ(x)')

            # 损伤阈值
            if show_damage_threshold:
                ax.axhline(y=0.5, color='r', linestyle='--', label='临界损伤 φ=0.5')

            # 裂纹位置
            if snapshot.crack_position:
                ax.axvline(x=snapshot.crack_position, color='g', linestyle=':',
                          label='裂纹位置')

            ax.set_xlabel('位置 x (m)', fontsize=12)
            ax.set_ylabel('相场变量 φ', fontsize=12)
            title = f"相场分布 (加载={snapshot.loading/1e6:.1f} MPa)" if snapshot.loading else "相场分布"
            ax.set_title(title, fontsize=14)
            ax.set_ylim(-0.1, 1.1)
            ax.legend(loc='best')
            ax.grid(True, alpha=0.3)

        return fig

    def plot_crack_evolution(self, figsize: Tuple[int, int] = (12, 8)) -> Any:
        """
        绘制裂纹演化过程（多时间步）

        Args:
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if len(self.history) < 2:
            raise ValueError("需要至少2个快照")

        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        fig, axes = plt.subplots(2, 2, figsize=figsize)
        axes = axes.flatten()

        # 选择4个代表性时间步
        indices = np.linspace(0, len(self.history)-1, 4, dtype=int)

        for ax, idx in zip(axes, indices):
            snapshot = self.history[idx]

            # 颜色根据加载强度
            if snapshot.loading:
                color_intensity = min(1, snapshot.loading / 20e6)
                color = plt.cm.Reds(0.3 + 0.7 * color_intensity)
            else:
                color = 'blue'

            ax.fill_between(snapshot.x, snapshot.phi, 1, alpha=0.3, color='blue')
            ax.fill_between(snapshot.x, 0, snapshot.phi, alpha=0.3, color='red')
            ax.plot(snapshot.x, snapshot.phi, color=color, linewidth=2)

            ax.axhline(y=0.5, color='r', linestyle='--', alpha=0.5)
            ax.set_ylim(-0.1, 1.1)
            ax.set_xlabel('位置 (m)')
            ax.set_ylabel('φ')

            title = f'步骤 {idx}'
            if snapshot.loading:
                title += f'\n({snapshot.loading/1e6:.1f} MPa)'
            ax.set_title(title, fontsize=10)
            ax.grid(True, alpha=0.3)

        plt.suptitle('裂纹演化过程', fontsize=14, fontweight='bold')
        plt.tight_layout()

        return fig

    def plot_phase_field_heatmap(self, x: np.ndarray, t: np.ndarray,
                                 phi_history: np.ndarray,
                                 figsize: Tuple[int, int] = (12, 6)) -> Any:
        """
        绘制相场热力图（时空演化）

        Args:
            x: 空间坐标
            t: 时间坐标
            phi_history: 相场历史 (n_time x n_space)
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        fig, ax = plt.subplots(figsize=figsize)

        im = ax.imshow(phi_history, aspect='auto', cmap=self.cmap,
                      extent=[x[0], x[-1], t[0], t[-1]],
                      origin='lower', vmin=0, vmax=1)

        ax.set_xlabel('位置 x (m)', fontsize=12)
        ax.set_ylabel('时间 t', fontsize=12)
        ax.set_title('相场时空演化', fontsize=14)

        cbar = plt.colorbar(im, ax=ax)
        cbar.set_label('相场变量 φ', fontsize=11)

        # 标记裂纹扩展路径
        crack_tip_positions = []
        for i, ti in enumerate(t):
            phi_t = phi_history[i, :]
            # 找到phi < 0.5的最小x位置（裂纹尖端）
            damaged = np.where(phi_t < 0.5)[0]
            if len(damaged) > 0:
                crack_tip = x[damaged[np.argmin(phi_t[damaged])]]
                crack_tip_positions.append((ti, crack_tip))

        if crack_tip_positions:
            t_arr, x_arr = zip(*crack_tip_positions)
            ax.plot(x_arr, t_arr, 'k--', linewidth=2, label='裂纹尖端')
            ax.legend()

        return fig

    def plot_load_displacement_curve(self, loads: np.ndarray,
                                    displacements: np.ndarray,
                                    crack_lengths: Optional[np.ndarray] = None,
                                    figsize: Tuple[int, int] = (10, 6)) -> Any:
        """
        绘制载荷-位移曲线

        Args:
            loads: 载荷数组
            displacements: 位移数组
            crack_lengths: 裂纹长度数组（可选）
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        fig, ax1 = plt.subplots(figsize=figsize)

        # 载荷-位移曲线
        color1 = '#2196F3'
        ax1.plot(displacements * 1000, loads / 1e6, 'o-', color=color1,
                linewidth=2, markersize=4)
        ax1.set_xlabel('位移 (mm)', fontsize=12)
        ax1.set_ylabel('载荷 (MPa)', color=color1, fontsize=12)
        ax1.tick_params(axis='y', labelcolor=color1)

        # 裂纹长度
        if crack_lengths is not None:
            ax2 = ax1.twinx()
            color2 = '#F44336'
            ax2.plot(displacements * 1000, crack_lengths, 's--', color=color2,
                    linewidth=2, markersize=4, alpha=0.7)
            ax2.set_ylabel('裂纹长度 (m)', color=color2, fontsize=12)
            ax2.tick_params(axis='y', labelcolor=color2)

        ax1.set_title('载荷-位移-裂纹演化曲线', fontsize=14)
        ax1.grid(True, alpha=0.3)

        return fig

    def plot_energy_components(self, elastic_energy: np.ndarray,
                              fracture_energy: np.ndarray,
                              total_energy: np.ndarray,
                              times: np.ndarray,
                              figsize: Tuple[int, int] = (12, 6)) -> Any:
        """
        绘制能量组分演化

        Args:
            elastic_energy: 弹性能量
            fracture_energy: 断裂能量
            total_energy: 总能量
            times: 时间数组
            figsize: 图形尺寸

        Returns:
            Figure对象
        """
        if not MATPLOTLIB_AVAILABLE:
            raise ImportError("需要安装matplotlib")

        fig, axes = plt.subplots(1, 2, figsize=figsize)

        # 左图：能量组分
        ax = axes[0]
        ax.plot(times, elastic_energy / 1e3, 'o-', label='弹性能量',
               color='#2196F3', linewidth=2)
        ax.plot(times, fracture_energy / 1e3, 's-', label='断裂能量',
               color='#F44336', linewidth=2)
        ax.plot(times, total_energy / 1e3, '^--', label='总能量',
               color='#4CAF50', linewidth=2)

        ax.set_xlabel('时间', fontsize=12)
        ax.set_ylabel('能量 (kJ)', fontsize=12)
        ax.set_title('能量组分演化', fontsize=12)
        ax.legend()
        ax.grid(True, alpha=0.3)

        # 右图：能量比例
        ax = axes[1]
        total = elastic_energy + fracture_energy
        elastic_ratio = elastic_energy / total
        fracture_ratio = fracture_energy / total

        ax.fill_between(times, 0, elastic_ratio, alpha=0.5,
                       color='#2196F3', label='弹性')
        ax.fill_between(times, elastic_ratio, 1, alpha=0.5,
                       color='#F44336', label='断裂')

        ax.set_xlabel('时间', fontsize=12)
        ax.set_ylabel('能量比例', fontsize=12)
        ax.set_title('能量分配比例', fontsize=12)
        ax.set_ylim(0, 1)
        ax.legend()
        ax.grid(True, alpha=0.3)

        plt.suptitle('能量演化分析', fontsize=14, fontweight='bold')
        plt.tight_layout()

        return fig


# 便捷函数
def create_phase_field_plotter(backend: str = 'matplotlib') -> PhaseFieldPlotter:
    """创建相场绘图器"""
    return PhaseFieldPlotter(backend=backend)
