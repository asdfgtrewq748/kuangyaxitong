import matplotlib.pyplot as plt
import numpy as np
import scipy.stats as stats

# 设置随机种子以保证结果可复现 (可选)
np.random.seed(42)

# ==========================================
# 1. 准备数据 (模拟数据)
# ==========================================
# 这里模拟了一组正态分布的数据，例如基因表达量的 Log2 值
data = np.random.normal(loc=2, scale=1.5, size=1200)

# ==========================================
# 2. 设置 Nature 风格的绘图参数 (全局设置)
# ==========================================
# Nature 标准单栏图片宽度约为 89mm (约 3.5 inches)
plt.rcParams['figure.figsize'] = (6, 4) # 这里设大一点以便屏幕查看，导出时可设为 (3.5, 2.5)
plt.rcParams['font.family'] = 'sans-serif'
# Nature 偏好 Arial 或 Helvetica
plt.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans'] 
plt.rcParams['font.size'] = 10
plt.rcParams['axes.labelsize'] = 12
plt.rcParams['axes.titlesize'] = 12
plt.rcParams['xtick.labelsize'] = 10
plt.rcParams['ytick.labelsize'] = 10
plt.rcParams['axes.linewidth'] = 1.0 # 坐标轴线宽，通常为 0.5-1.0 pt
plt.rcParams['xtick.major.width'] = 1.0
plt.rcParams['ytick.major.width'] = 1.0

# ==========================================
# 3. 开始绘图
# ==========================================
fig, ax = plt.subplots()

# --- A. 绘制直方图 ---
# color: #5D8AA8 (一种柔和的板岩蓝), edgecolor: 白色描边增加条形间的区分度
n, bins, patches = ax.hist(data, bins=25, density=False, alpha=0.85, 
                           color='#5D8AA8', edgecolor='white', linewidth=0.8, 
                           label='Treated (n=1200)')

# --- B. 添加拟合曲线 (Density Fit) ---
# 计算拟合曲线的 X 和 Y 值
mu, std = stats.norm.fit(data)
x_plot = np.linspace(min(data), max(data), 100)
y_pdf = stats.norm.pdf(x_plot, mu, std)
# 将概率密度转换为频数 (Count) 以匹配直方图的 Y 轴
bin_width = bins[1] - bins[0]
y_plot_count = y_pdf * len(data) * bin_width

ax.plot(x_plot, y_plot_count, color='#C8523C', linewidth=2, label='Density Fit') # 使用对比色

# ==========================================
# 4. 细节调整 (关键步骤)
# ==========================================

# --- 去除上方和右侧边框 (Spines) ---
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# --- 设置刻度朝外 ---
ax.tick_params(direction='out', length=4, width=1, colors='black')

# --- 添加标签和标题 ---
ax.set_xlabel('Log2(Expression Level)', fontweight='normal')
ax.set_ylabel('Frequency (Count)', fontweight='normal')

# 模拟 Nature 的 Figure Legend 标题格式 (左对齐, 粗体 Figure X)
ax.set_title('Figure 1 | Distribution of Gene Expression Levels', 
             loc='left', pad=15, fontsize=12, fontweight='bold')

# --- 图例设置 (去边框) ---
ax.legend(frameon=False, loc='upper right', fontsize=10)

# --- 防止布局遮挡 ---
plt.tight_layout()

# ==========================================
# 5. 保存与显示
# ==========================================
# 保存为高分辨率 PNG 或矢量图 PDF
# plt.savefig('nature_style_histogram.pdf', format='pdf', bbox_inches='tight')
# plt.savefig('nature_style_histogram.png', dpi=300, bbox_inches='tight')

plt.show()