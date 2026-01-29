import numpy as np
import matplotlib.pyplot as plt
from scipy.spatial import cKDTree
from scipy.ndimage import gaussian_filter
from matplotlib.patches import Rectangle

# ==========================================
# 1. 数据准备 (模拟特定的钻孔分布)
# ==========================================
np.random.seed(42) # 固定种子

# 模拟三个主要的钻孔集群中心，位置经过挑选以匹配目标图
centers = np.array([[0.2, 0.25], [0.75, 0.75], [0.3, 0.65]])
n_boreholes = 48

borehole_coords = []
for _ in range(n_boreholes):
    center = centers[np.random.randint(len(centers))]
    # 在中心周围添加噪声
    noise = np.random.normal(0, 0.12, 2)
    borehole_coords.append(np.clip(center + noise, 0.05, 0.95))

borehole_coords = np.array(borehole_coords)
# 手动添加几个孤立点，以增强右侧和中间的空缺感
borehole_coords = np.vstack([borehole_coords, [[0.85, 0.25], [0.9, 0.3], [0.65, 0.95], [0.7, 0.92]]])

# ==========================================
# 2. 计算不确定性场 (核心：距离 + 平滑)
# ==========================================
resolution = 400 # 高分辨率计算
x = np.linspace(0, 1, resolution)
y = np.linspace(0, 1, resolution)
xx, yy = np.meshgrid(x, y)
grid_points = np.c_[xx.ravel(), yy.ravel()]

# 计算到最近钻孔的距离
tree = cKDTree(borehole_coords)
dist, _ = tree.query(grid_points, k=1)
uncertainty_map_raw = dist.reshape(resolution, resolution)

# *** 关键步骤：强力高斯平滑 ***
# sigma=25 是产生柔和、团块状热力图效果的关键参数
uncertainty_map_smooth = gaussian_filter(uncertainty_map_raw, sigma=25)

# 归一化并缩放，使最大值略超过 1.5，配合色条的 "1.5+"
norm_uncertainty = (uncertainty_map_smooth - uncertainty_map_smooth.min()) / (uncertainty_map_smooth.max() - uncertainty_map_smooth.min())
norm_uncertainty = norm_uncertainty * 1.6

# ==========================================
# 3. 绘图 (复刻目标风格)
# ==========================================
# 设置字体
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'DejaVu Sans']
plt.rcParams['font.size'] = 14

# 创建画布
fig, ax = plt.subplots(figsize=(10, 6), dpi=300)

# 3.1 绘制热力图
# vmin=0, vmax=1.5 确保色谱映射范围一致
im = ax.imshow(norm_uncertainty, extent=[0, 10, 0, 10], origin='lower',
               cmap='RdYlBu_r', aspect='auto', vmin=0, vmax=1.5)

# 3.2 绘制钻孔点
# 纯黑色实心点，无描边，zorder很高确保在最上层
ax.scatter(borehole_coords[:, 0]*10, borehole_coords[:, 1]*10,
           c='black', s=60, marker='o', zorder=30)

# 3.3 清理坐标轴
ax.set_xticks([])
ax.set_yticks([])
# 加粗边框
for spine in ax.spines.values():
    spine.set_linewidth(2.0)

# ==========================================
# 4. 自定义注释框 (图例和比例尺)
# ==========================================

# 4.1 自定义图例框 (左下角)
# 手动绘制白底黑框矩形
legend_box = Rectangle((0.2, 0.2), 2.8, 1.2, transform=ax.transData,
                       facecolor='white', edgecolor='black', linewidth=1.5, zorder=20)
ax.add_patch(legend_box)

# 在框内添加元素
# "High Uncertainty" 的红色色块
rect_patch = Rectangle((0.4, 0.8), 0.3, 0.3, transform=ax.transData,
                       facecolor=plt.cm.RdYlBu_r(0.9), edgecolor='black', linewidth=1, zorder=21)
ax.add_patch(rect_patch)
ax.text(0.8, 0.95, "High Uncertainty", transform=ax.transData, va='center', fontsize=14, zorder=21)

# "Borehole Locations" 的黑点
ax.scatter(0.55, 0.5, transform=ax.transData, c='black', s=60, zorder=21)
ax.text(0.8, 0.5, "Borehole Locations", transform=ax.transData, va='center', fontsize=14, zorder=21)


# 4.2 自定义比例尺框 (右下角)
scale_box_width = 3.5
scale_box_height = 0.8
scale_box_x = 10 - scale_box_width - 0.2
scale_box_y = 0.2
# 手动绘制白底黑框矩形
scale_box = Rectangle((scale_box_x, scale_box_y), scale_box_width, scale_box_height, transform=ax.transData,
                      facecolor='white', edgecolor='black', linewidth=1.5, zorder=20)
ax.add_patch(scale_box)

# 在框内添加比例尺元素
ax.text(scale_box_x + 0.2, scale_box_y + 0.4, "0", transform=ax.transData, va='center', fontsize=14, zorder=21)
ax.text(scale_box_x + 1.7, scale_box_y + 0.4, "5", transform=ax.transData, va='center', ha='center', fontsize=14, zorder=21)
ax.text(scale_box_x + 3.2, scale_box_y + 0.4, "10 km", transform=ax.transData, va='center', ha='right', fontsize=14, zorder=21)

# 绘制比例尺线段
scale_line_y = scale_box_y + 0.15
# 细全长线
ax.plot([scale_box_x + 0.2, scale_box_x + 3.2], [scale_line_y, scale_line_y], color='black', linewidth=2, transform=ax.transData, zorder=21)
# 粗实心线 (0-5km部分)
ax.plot([scale_box_x + 0.2, scale_box_x + 1.7], [scale_line_y, scale_line_y], color='black', linewidth=4, transform=ax.transData, zorder=21)


# 4.3 色条 (Colorbar)
# 手动指定位置和大小 [left, bottom, width, height]
cax = fig.add_axes([0.92, 0.125, 0.025, 0.755]) 
cbar = plt.colorbar(im, cax=cax)
cbar.set_label('Variance (normalized)', rotation=270, labelpad=20, fontsize=14)
# 精确设置刻度和标签
cbar.set_ticks([0, 0.5, 1.0, 1.5])
cbar.set_ticklabels(['0', '0.5', '1.0', '1.5+'])
cbar.ax.tick_params(labelsize=14)
cbar.outline.set_linewidth(1.5)

# ==========================================
# 5. 标题和说明文字 (图的下方)
# ==========================================
# 使用 fig.text 将文字放置在坐标轴外部
fig.text(0.5, 0.05, "**Figure 1: Interpolation Uncertainty Map (Kriging Variance) in a Sparse Borehole Region.**",
         ha='center', fontsize=16) # 移除 fontweight='bold', 这里的markdown bold可能不生效，直接用大字号
fig.text(0.5, 0.01, "Red zones indicate higher uncertainty due to sparse data; blue zones are more reliable.",
         ha='center', fontsize=14)

# 调整布局以为底部文字留出空间
plt.subplots_adjust(left=0.05, right=0.9, top=0.98, bottom=0.15)

# 保存并显示
plt.savefig('refined_uncertainty_map.png', bbox_inches='tight', dpi=300)
plt.show()