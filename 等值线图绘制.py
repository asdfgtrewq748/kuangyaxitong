import numpy as np
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter

# ---------------------------------------------------------
# 1. 生成模拟数据 (如果你有真实数据，请替换这一部分)
# ---------------------------------------------------------
# 设置随机种子以保证结果可复现
np.random.seed(42)

# 创建网格坐标 (例如：1000m x 800m 的区域)
nx, ny = 100, 80
x = np.linspace(0, 1000, nx)
y = np.linspace(0, 800, ny)
X, Y = np.meshgrid(x, y)

# 生成随机噪声并使用高斯滤波进行平滑，模拟自然沉积的地质形态
noise = np.random.rand(ny, nx)
# sigma 越大，地形越平滑；sigma 越小，地形越破碎
thickness = gaussian_filter(noise, sigma=8)

# 将数据归一化并映射到真实的煤层厚度范围 (例如 0.5m 到 12m)
thickness = (thickness - thickness.min()) / (thickness.max() - thickness.min())
thickness = thickness * 11.5 + 0.5 

# ---------------------------------------------------------
# 2. 绘图设置 (符合 Nature/Science 出版风格)
# ---------------------------------------------------------
# 设置全局字体：Nature通常偏好无衬线字体 (Arial 或 Helvetica)
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'DejaVu Sans']
plt.rcParams['font.size'] = 10
plt.rcParams['axes.linewidth'] = 1.0 # 边框线宽

# 创建画布，dpi=300 满足印刷清晰度要求
fig, ax = plt.subplots(figsize=(8, 6), dpi=300)

# ---------------------------------------------------------
# 3. 绘制等值线图
# ---------------------------------------------------------
# 设定等值线级别 (每 1m 一个级别)
levels = np.arange(0, 14, 1)

# A. 填充颜色 (Filled Contours) - 使用 YlOrBr (黄-橙-棕) 色阶
# extend='both' 表示超出范围的颜色也会被填充
contour_filled = ax.contourf(X, Y, thickness, levels=levels, cmap='YlOrBr', extend='both')

# B. 绘制轮廓线 (Contour Lines) - 使用细黑线增强清晰度
contour_lines = ax.contour(X, Y, thickness, levels=levels, colors='k', linewidths=0.6, alpha=0.6)

# C. 添加等值线数值标签 (Inline Labels)
ax.clabel(contour_lines, inline=True, fontsize=8, fmt='%1.0fm', colors='k')

# ---------------------------------------------------------
# 4. 装饰与标注
# ---------------------------------------------------------
ax.set_xlabel('Distance East (m)', fontsize=12, weight='bold')
ax.set_ylabel('Distance North (m)', fontsize=12, weight='bold')
ax.set_title('Spatial distribution of coal seam thickness', fontsize=14, weight='bold', pad=15)

# 添加色条 (Colorbar)
cbar = fig.colorbar(contour_filled, ax=ax, pad=0.03, aspect=30)
cbar.set_label('Thickness (m)', rotation=270, labelpad=20, fontsize=12, weight='bold')
cbar.ax.tick_params(labelsize=10)

# 开启次刻度线 (Minor Ticks) 让图表看起来更专业
ax.minorticks_on()
ax.tick_params(which='major', length=6, width=1.0, direction='in')
ax.tick_params(which='minor', length=3, width=0.5, direction='in', top=True, right=True)
ax.tick_params(which='major', top=True, right=True) # 上右边框也显示刻度

# 调整布局防止标签被截断
plt.tight_layout()

# 保存图片 (PDF 或 PNG 格式)
# plt.savefig('Coal_Seam_Thickness_Nature_Style.pdf', format='pdf', dpi=300)
plt.show()