"""
Nature 期刊风格的末阻力数据可视化脚本
End Resistance Data Visualization for Nature Journal

功能:
- 读取末阻力数据 CSV 文件
- 数据清洗和预处理
- 按时间聚合计算均值和标准差
- 创建多面板折线图
- 添加误差棒和显著性标记
- 导出符合 Nature 期刊要求的图表

作者: Claude Code
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl
from matplotlib.gridspec import GridSpec
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# ============================================================================
# Nature 期刊样式配置
# ============================================================================

def apply_nature_style():
    """应用 Nature 期刊出版级样式"""
    # 字体设置 - Nature 推荐使用 Arial 或 Helvetica
    mpl.rcParams['font.family'] = 'sans-serif'
    mpl.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans']
    mpl.rcParams['mathtext.fontset'] = 'custom'
    mpl.rcParams['mathtext.rm'] = 'Arial'
    mpl.rcParams['mathtext.it'] = 'Arial:italic'

    # 字体大小 - Nature 单栏宽度约 89mm
    mpl.rcParams['font.size'] = 7  # 基础字体大小
    mpl.rcParams['axes.labelsize'] = 8  # 轴标签
    mpl.rcParams['axes.titlesize'] = 9  # 标题
    mpl.rcParams['xtick.labelsize'] = 7  # X轴刻度
    mpl.rcParams['ytick.labelsize'] = 7  # Y轴刻度
    mpl.rcParams['legend.fontsize'] = 7  # 图例

    # 线条和边框
    mpl.rcParams['axes.linewidth'] = 0.5
    mpl.rcParams['lines.linewidth'] = 1.0
    mpl.rcParams['lines.markersize'] = 4
    mpl.rcParams['xtick.major.width'] = 0.5
    mpl.rcParams['ytick.major.width'] = 0.5
    mpl.rcParams['xtick.major.size'] = 3
    mpl.rcParams['ytick.major.size'] = 3
    mpl.rcParams['xtick.direction'] = 'in'
    mpl.rcParams['ytick.direction'] = 'in'

    # 移除上边框和右边框
    mpl.rcParams['axes.spines.top'] = False
    mpl.rcParams['axes.spines.right'] = False

    # 图例设置
    mpl.rcParams['legend.frameon'] = False
    mpl.rcParams['legend.borderpad'] = 0.3

    # 保存设置
    mpl.rcParams['savefig.dpi'] = 300
    mpl.rcParams['savefig.bbox'] = 'tight'
    mpl.rcParams['savefig.pad_inches'] = 0.05

    print("[OK] Nature 期刊样式已应用")


# Okabe-Ito 色盲友好配色方案
OKABE_ITO_COLORS = {
    'orange': '#E69F00',
    'sky_blue': '#56B4E9',
    'bluish_green': '#009E73',
    'yellow': '#F0E442',
    'blue': '#0072B2',
    'vermillion': '#D55E00',
    'reddish_purple': '#CC79A7',
    'black': '#000000'
}


# ============================================================================
# 数据处理函数
# ============================================================================

def load_and_process_data(filepath):
    """加载并处理 CSV 数据"""
    print(f"正在加载数据: {filepath}")

    # 读取 CSV，跳过标题行
    df = pd.read_csv(filepath, skiprows=1, encoding='utf-8')
    df.columns = ['工作面名称', '支架号', '柱类型', '循环开始时间',
                  '循环结束时间', '末阻力时间', '末阻力值']

    # 转换时间列
    df['末阻力时间'] = pd.to_datetime(df['末阻力时间'])
    df['循环结束时间'] = pd.to_datetime(df['循环结束时间'])

    # 提取日期和小时
    df['日期'] = df['末阻力时间'].dt.date
    df['小时'] = df['末阻力时间'].dt.hour

    # 转换数值列
    df['末阻力值'] = pd.to_numeric(df['末阻力值'], errors='coerce')

    # 删除缺失值
    df = df.dropna(subset=['末阻力值'])

    print(f"✓ 数据加载完成: {len(df)} 条记录")
    print(f"  - 工作面: {df['工作面名称'].unique()}")
    print(f"  - 支架号: {sorted(df['支架号'].unique())}")
    print(f"  - 柱类型: {df['柱类型'].unique()}")

    return df


def aggregate_by_time(df, time_freq='h'):
    """
    按时间聚合数据，计算均值和标准差

    Parameters:
    -----------
    df : DataFrame
        原始数据
    time_freq : str
        时间频率: 'h'=小时, 'D'=天, '4h'=4小时
    """
    # 按时间和柱类型分组聚合
    aggregated = df.groupby([
        pd.Grouper(key='末阻力时间', freq=time_freq),
        '柱类型'
    ]).agg({
        '末阻力值': ['mean', 'std', 'count']
    }).reset_index()

    aggregated.columns = ['时间', '柱类型', '均值', '标准差', '样本数']

    # 填充标准差为0的情况（单一数据点）
    aggregated['标准差'] = aggregated['标准差'].fillna(0)

    print(f"✓ 数据聚合完成: {len(aggregated)} 条记录")

    return aggregated


def calculate_statistics(df, group_col='柱类型'):
    """计算统计显著性"""
    groups = df.groupby(group_col)['末阻力值'].apply(list).to_dict()

    results = {}
    group_names = list(groups.keys())

    for i, g1 in enumerate(group_names):
        for g2 in group_names[i+1:]:
            data1 = groups[g1]
            data2 = groups[g2]

            # t检验
            t_stat, p_value = stats.ttest_ind(data1, data2)

            results[f"{g1} vs {g2}"] = {
                't_statistic': t_stat,
                'p_value': p_value,
                'significant': p_value < 0.05
            }

    return results


# ============================================================================
# 可视化函数
# ============================================================================

def add_significance_marker(ax, x1, x2, y, p_value, bar_height=0.5):
    """添加显著性标记"""
    # 确定标记符号
    if p_value < 0.001:
        marker = '***'
    elif p_value < 0.01:
        marker = '**'
    elif p_value < 0.05:
        marker = '*'
    else:
        marker = 'n.s.'  # 不显著

    # 绘制连接线
    ax.plot([x1, x1, x2, x2], [y, y + bar_height, y + bar_height, y],
            color='black', linewidth=0.5)

    # 添加标记文字
    ax.text((x1 + x2) / 2, y + bar_height, marker,
            ha='center', va='bottom', fontsize=6)


def create_multipanel_figure(df, aggregated, output_path=None):
    """
    创建多面板图表

    面板布局:
    A: 不同柱类型的末阻力时间序列对比
    B: 不同支架号的末阻力箱线图对比
    C: 末阻力分布直方图
    D: 按小时的末阻力变化趋势
    """
    # 应用 Nature 样式
    apply_nature_style()

    # 创建图形 - Nature 双栏宽度约 183mm = 7.2 inches
    fig = plt.figure(figsize=(7.2, 6))
    gs = GridSpec(2, 2, figure=fig, hspace=0.35, wspace=0.3)

    # 获取柱类型列表
    column_types = df['柱类型'].unique()

    # 颜色映射
    colors = [OKABE_ITO_COLORS['blue'], OKABE_ITO_COLORS['vermillion'],
              OKABE_ITO_COLORS['bluish_green'], OKABE_ITO_COLORS['orange']]

    # ========================================================================
    # Panel A: 时间序列折线图（带误差棒）
    # ========================================================================
    ax1 = fig.add_subplot(gs[0, 0])

    for i, col_type in enumerate(column_types):
        data = aggregated[aggregated['柱类型'] == col_type].sort_values('时间')

        if len(data) > 0:
            # 将时间转换为数值（小时数）
            time_numeric = (data['时间'] - data['时间'].min()).dt.total_seconds() / 3600

            ax1.errorbar(time_numeric, data['均值'], yerr=data['标准差'],
                        label=col_type, color=colors[i % len(colors)],
                        marker='o', markersize=3, capsize=2, capthick=0.5,
                        elinewidth=0.5, alpha=0.9)

    ax1.set_xlabel('Time (h)')
    ax1.set_ylabel('End Resistance (MPa)')
    ax1.legend(loc='upper right', handlelength=1.5)
    ax1.set_title('A', loc='left', fontweight='bold', fontsize=10)

    # ========================================================================
    # Panel B: 支架号对比箱线图
    # ========================================================================
    ax2 = fig.add_subplot(gs[0, 1])

    # 选取数据量最多的前6个支架
    top_supports = df['支架号'].value_counts().head(6).index.tolist()
    box_data = [df[df['支架号'] == s]['末阻力值'].values for s in sorted(top_supports)]

    bp = ax2.boxplot(box_data, positions=range(len(top_supports)),
                     widths=0.6, patch_artist=True)

    # 设置箱线图颜色
    for patch, color in zip(bp['boxes'], colors):
        patch.set_facecolor(color)
        patch.set_alpha(0.6)

    ax2.set_xticklabels([str(s) for s in sorted(top_supports)])
    ax2.set_xlabel('Support Number')
    ax2.set_ylabel('End Resistance (MPa)')
    ax2.set_title('B', loc='left', fontweight='bold', fontsize=10)

    # ========================================================================
    # Panel C: 末阻力分布直方图（按柱类型）
    # ========================================================================
    ax3 = fig.add_subplot(gs[1, 0])

    for i, col_type in enumerate(column_types):
        data = df[df['柱类型'] == col_type]['末阻力值']
        ax3.hist(data, bins=30, alpha=0.5, label=col_type,
                color=colors[i % len(colors)], edgecolor='none')

    ax3.set_xlabel('End Resistance (MPa)')
    ax3.set_ylabel('Frequency')
    ax3.legend(loc='upper right', handlelength=1.5)
    ax3.set_title('C', loc='left', fontweight='bold', fontsize=10)

    # ========================================================================
    # Panel D: 按小时的趋势图（带误差棒）
    # ========================================================================
    ax4 = fig.add_subplot(gs[1, 1])

    # 按小时聚合
    hourly = df.groupby(['小时', '柱类型']).agg({
        '末阻力值': ['mean', 'std']
    }).reset_index()
    hourly.columns = ['小时', '柱类型', '均值', '标准差']

    for i, col_type in enumerate(column_types):
        data = hourly[hourly['柱类型'] == col_type].sort_values('小时')

        if len(data) > 0:
            ax4.errorbar(data['小时'], data['均值'], yerr=data['标准差'],
                        label=col_type, color=colors[i % len(colors)],
                        marker='s', markersize=3, capsize=2, capthick=0.5,
                        elinewidth=0.5, alpha=0.9)

    ax4.set_xlabel('Hour of Day')
    ax4.set_ylabel('End Resistance (MPa)')
    ax4.set_xticks(range(0, 24, 4))
    ax4.legend(loc='upper right', handlelength=1.5)
    ax4.set_title('D', loc='left', fontweight='bold', fontsize=10)

    # 添加显著性标记示例（Panel B中）
    # 计算前两个支架之间的显著性
    if len(box_data) >= 2:
        t_stat, p_val = stats.ttest_ind(box_data[0], box_data[1])
        max_y = max([max(d) for d in box_data[:2]])
        add_significance_marker(ax2, 0, 1, max_y + 2, p_val, bar_height=1.5)

    plt.tight_layout()

    # ========================================================================
    # 保存图表
    # ========================================================================
    if output_path:
        # 保存为 PDF（矢量格式，期刊首选）
        pdf_path = output_path.replace('.png', '.pdf')
        fig.savefig(pdf_path, format='pdf', dpi=300, bbox_inches='tight')
        print(f"✓ PDF 已保存: {pdf_path}")

        # 保存为 PNG（高分辨率）
        fig.savefig(output_path, format='png', dpi=300, bbox_inches='tight',
                    facecolor='white', edgecolor='none')
        print(f"✓ PNG 已保存: {output_path}")

    return fig


def create_simple_time_series(df, output_path=None):
    """
    创建简洁的时间序列折线图（单面板）
    适用于单栏图表（Nature 单栏宽度约 89mm = 3.5 inches）
    """
    apply_nature_style()

    fig, ax = plt.subplots(figsize=(3.5, 2.8))

    # 按时间和柱类型聚合
    daily = df.groupby([
        pd.Grouper(key='末阻力时间', freq='6h'),
        '柱类型'
    ]).agg({
        '末阻力值': ['mean', 'std', 'count']
    }).reset_index()
    daily.columns = ['时间', '柱类型', '均值', '标准差', '样本数']

    # 获取柱类型
    column_types = daily['柱类型'].unique()
    colors = [OKABE_ITO_COLORS['blue'], OKABE_ITO_COLORS['vermillion'],
              OKABE_ITO_COLORS['bluish_green'], OKABE_ITO_COLORS['orange']]

    # 绘制折线
    for i, col_type in enumerate(column_types):
        data = daily[daily['柱类型'] == col_type].sort_values('时间')

        if len(data) > 0:
            # 时间轴转换为相对小时
            time_hours = (data['时间'] - data['时间'].min()).dt.total_seconds() / 3600

            ax.errorbar(time_hours, data['均值'], yerr=data['标准差'],
                       label=col_type, color=colors[i % len(colors)],
                       marker='o', markersize=3, capsize=1.5,
                       linewidth=1, elinewidth=0.5, capthick=0.5)

    ax.set_xlabel('Time (h)', fontsize=8)
    ax.set_ylabel('End Resistance (MPa)', fontsize=8)
    ax.legend(loc='best', handlelength=1.5, frameon=False)

    # 移除不必要的边框
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    plt.tight_layout()

    if output_path:
        # 保存 PDF
        pdf_path = output_path.replace('.png', '_single.pdf')
        fig.savefig(pdf_path, format='pdf', dpi=300, bbox_inches='tight')
        print(f"✓ 单栏 PDF 已保存: {pdf_path}")

        # 保存 PNG
        png_path = output_path.replace('.png', '_single.png')
        fig.savefig(png_path, format='png', dpi=300, bbox_inches='tight',
                    facecolor='white')
        print(f"✓ 单栏 PNG 已保存: {png_path}")

    return fig


# ============================================================================
# 主程序
# ============================================================================

def main():
    """主函数"""
    print("=" * 60)
    print("Nature 期刊风格末阻力数据可视化")
    print("End Resistance Data Visualization for Nature Journal")
    print("=" * 60)
    print()

    # 数据文件路径
    data_path = r"e:\xiangmu\kuangyaxitong\data\kuangya\末阻力数据7-9 (2).csv"
    output_path = r"e:\xiangmu\kuangyaxitong\output\figures\nature_end_resistance.png"

    # 1. 加载和处理数据
    df = load_and_process_data(data_path)

    # 2. 按小时聚合数据
    aggregated = aggregate_by_time(df, time_freq='h')

    # 3. 计算统计显著性
    print("\n统计显著性检验 (t-test):")
    print("-" * 40)
    stats_results = calculate_statistics(df)
    for comparison, result in stats_results.items():
        sig = "显著" if result['significant'] else "不显著"
        print(f"  {comparison}: p = {result['p_value']:.4f} ({sig})")

    # 4. 创建多面板图表
    print("\n生成图表...")
    fig1 = create_multipanel_figure(df, aggregated, output_path)

    # 5. 创建单栏时间序列图
    fig2 = create_simple_time_series(df, output_path)

    # 6. 显示统计摘要
    print("\n" + "=" * 60)
    print("数据统计摘要")
    print("=" * 60)
    print(f"\n总记录数: {len(df)}")
    print(f"时间范围: {df['末阻力时间'].min()} 至 {df['末阻力时间'].max()}")
    print(f"\n按柱类型统计:")
    for col_type in df['柱类型'].unique():
        subset = df[df['柱类型'] == col_type]['末阻力值']
        print(f"  {col_type}: 均值={subset.mean():.2f}, 标准差={subset.std():.2f}, "
              f"最小={subset.min():.2f}, 最大={subset.max():.2f}")

    print("\n✓ 图表生成完成!")
    print("✓ 请检查 output/figures/ 目录查看生成的图表")

    plt.show()

    return df, aggregated


if __name__ == "__main__":
    df, aggregated = main()
