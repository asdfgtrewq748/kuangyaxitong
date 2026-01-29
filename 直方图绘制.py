import numpy as np
import matplotlib.pyplot as plt
import matplotlib as mpl

# ==========================================
# 1. 设置 Nature 风格的绘图参数 (全局设置)
# ==========================================
def set_nature_style():
    plt.style.use('default')  # 基于默认风格修改
    # 字体设置：Nature 要求无衬线字体 (Arial/Helvetica)
    mpl.rcParams['font.family'] = 'sans-serif'
    # 尝试使用 Arial，如果系统没有则回退到其他无衬线字体
    mpl.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans', 'sans-serif']
    
    # 字号与线宽设置
    mpl.rcParams['font.size'] = 10
    mpl.rcParams['axes.labelsize'] = 12       # 轴标签字号
    mpl.rcParams['xtick.labelsize'] = 10      # 刻度标签字号
    mpl.rcParams['ytick.labelsize'] = 10
    mpl.rcParams['axes.linewidth'] = 1.0      # 坐标轴边框粗细
    mpl.rcParams['lines.linewidth'] = 1.0     # 线条粗细
    
    # 刻度设置：朝内 (direction='in') 是经典科学期刊风格
    mpl.rcParams['xtick.direction'] = 'in'
    mpl.rcParams['ytick.direction'] = 'in'
    mpl.rcParams['xtick.major.size'] = 4      # 刻度线长度
    mpl.rcParams['ytick.major.size'] = 4
    
    # 去除网格 (或使用极淡的网格)
    mpl.rcParams['axes.grid'] = False
    
    # 保存设置
    mpl.rcParams['savefig.dpi'] = 300         # 高分辨率
    mpl.rcParams['savefig.bbox'] = 'tight'    # 裁剪空白边缘

set_nature_style()

# ==========================================
# 2. 准备数据 (此处为模拟数据，请替换为您自己的数据)
# ==========================================
np.random.seed(42) # 固定随机种子以复现结果

# 模拟双峰分布数据 (例如：两个不同地质层的钻孔深度)
# 区域 A: 均值 300m, 标准差 60m
data_a = np.random.normal(loc=300, scale=60, size=300)
# 区域 B: 均值 680m, 标准差 90m
data_b = np.random.normal(loc=680, scale=90, size=250)

# 合并数据并处理
data = np.concatenate([data_a, data_b])
data = data[data > 0] # 确保深度为正值

# ==========================================
# 3. 绘图主逻辑
# ==========================================
# 图像尺寸：Nature 单栏宽度约 89mm (3.5 inch)，双栏约 183mm
# 这里设置为 7x4.5 inch 以便清晰展示
fig, ax = plt.subplots(figsize=(7, 4.5))

# --- 计算直方图参数 ---
num_bins = 25
counts, bins = np.histogram(data, bins=num_bins)
bin_centers = 0.5 * (bins[:-1] + bins[1:])
bin_width = bins[1] - bins[0]

# --- 计算误差棒 (泊松误差: sqrt(N)) ---
# 在科学绘图中，计数数据通常假设服从泊松分布，误差为根号 N
errors = np.sqrt(counts)

# --- 绘制柱状图 ---
# 颜色：推荐使用素雅的颜色，如 Slate Grey, Steel Blue 等
# color='#607c8e' (灰蓝色), edgecolor='black' (黑色边框)
ax.bar(bin_centers, counts, width=bin_width, 
       color='#607c8e', edgecolor='black', 
       alpha=0.85, linewidth=0.8, zorder=2)

# --- 绘制误差棒 ---
ax.errorbar(bin_centers, counts, yerr=errors, fmt='none', 
            ecolor='#333333', elinewidth=1.0, capsize=3, zorder=3)

# ==========================================
# 4. 标注与美化
# ==========================================
# 轴标签 (加粗可选，视具体期刊要求而定)
ax.set_xlabel('Borehole Depth (m)', fontweight='normal')
ax.set_ylabel('Frequency', fontweight='normal')

# 设置轴范围
ax.set_xlim(left=0)
ax.set_ylim(bottom=0, top=max(counts + errors) * 1.15) # 顶部留出 15% 空间放文本

# --- 添加统计信息文本框 (右上角) ---
# 使用 LaTeX 格式显示数学符号
stats_text = '\n'.join((
    r'$\mathrm{Total}\ n = %d$' % (len(data), ),
    r'$\mathrm{Mean} = %.1f$ m' % (np.mean(data), ),
    r'$\mathrm{Std} = %.1f$ m' % (np.std(data), )))

# 文本框样式
props = dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.9, edgecolor='gray', linewidth=0.5)
ax.text(0.96, 0.96, stats_text, transform=ax.transAxes, fontsize=10,
        verticalalignment='top', horizontalalignment='right', bbox=props)

# --- 添加图注标题 (模拟 Figure 1 | ...) ---
# 注意：正式投稿时，Figure Caption 通常写在 Word 文档里，而不是画在图上
# 这里为了展示效果加上标题
fig.text(0.0, 0.94, 'Figure 1 | Distribution of borehole depths in the mining area.', 
         fontsize=11, fontweight='bold', va='bottom', ha='left')

# 调整布局，防止标题被切掉
plt.tight_layout(rect=[0, 0, 1, 0.94])

# ==========================================
# 5. 输出
# ==========================================
# 保存为高分辨率 PDF (矢量图，最佳) 或 PNG (位图，300dpi+)
# plt.savefig('borehole_distribution.pdf') 
plt.show()