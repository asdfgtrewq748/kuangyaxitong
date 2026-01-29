import matplotlib.pyplot as plt
import matplotlib.patches as patches
import pandas as pd
import numpy as np

# ==========================================
# 1. Nature 风格全局设置
# ==========================================
def set_nature_style():
    plt.style.use('default')
    plt.rcParams['font.family'] = 'sans-serif'
    plt.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans']
    plt.rcParams['font.size'] = 10
    plt.rcParams['hatch.linewidth'] = 0.5  # 纹理线条变细，更精致
    plt.rcParams['axes.linewidth'] = 1.0
    plt.rcParams['xtick.direction'] = 'in'
    plt.rcParams['ytick.direction'] = 'in'

set_nature_style()

# ==========================================
# 2. 定义岩性样式字典 (Lithology Patterns)
# ==========================================
# 可以在这里添加更多岩性
# hatch 参考: '.'(点), '/'(斜线), '+'(十字), '-'(横线), 'x'(交叉), 'o'(圆圈)
lith_styles = {
    'Sandstone':    {'facecolor': '#FCEBB6', 'hatch': '...', 'edgecolor': '#999999'}, # 黄色+点
    'Mudstone':     {'facecolor': '#D3D3D3', 'hatch': '---', 'edgecolor': '#666666'}, # 灰色+横线
    'Shale':        {'facecolor': '#A9A9A9', 'hatch': '---', 'edgecolor': '#444444'}, # 深灰+横线
    'Limestone':    {'facecolor': '#B0E0E6', 'hatch': '+++', 'edgecolor': '#5F9EA0'}, # 浅蓝+砖块感
    'Coal':         {'facecolor': '#2F4F4F', 'hatch': '',    'edgecolor': 'black'},   # 深黑灰，实心
    'Conglomerate': {'facecolor': '#DEB887', 'hatch': 'ooo', 'edgecolor': '#8B4513'}, # 褐色+圆圈
    'Siltstone':    {'facecolor': '#E0FFFF', 'hatch': '...', 'edgecolor': '#AAAAAA'}, # 浅色+细点
}

# ==========================================
# 3. 生成模拟数据 (模拟几十层岩层)
# ==========================================
# 实际使用时，请用 pd.read_excel('data.xlsx') 替换此处
np.random.seed(42)

layers_num = 25  # 模拟层数
lith_types = list(lith_styles.keys())
formations = ['Formation A', 'Formation B', 'Formation C']

data = {
    'lithology': np.random.choice(lith_types, layers_num),
    'thickness': np.random.uniform(5, 30, layers_num), # 厚度 5-30米不等
    'description': [f'Description of layer {i+1}' for i in range(layers_num)],
    'formation': np.sort(np.random.choice(formations, layers_num)) # 简单模拟地层组
}
df = pd.DataFrame(data)

# 计算底界深度 (用于绘图Y轴)
df['bottom_depth'] = df['thickness'].cumsum()
df['top_depth'] = df['bottom_depth'] - df['thickness']
max_depth = df['bottom_depth'].max()

# ==========================================
# 4. 绘图主逻辑
# ==========================================
def draw_stratigraphic_column(df):
    # 动态调整画布高度：每100米深度对应约2英寸高度，保证层多时不拥挤
    fig_height = max(6, max_depth / 20) 
    
    # 使用 GridSpec 分割列： [地质年代, 地层组, 柱状图, 描述]
    fig = plt.figure(figsize=(8, fig_height))
    gs = fig.add_gridspec(1, 4, width_ratios=[1, 1.5, 3, 4], wspace=0)

    ax_age = fig.add_subplot(gs[0])
    ax_fmt = fig.add_subplot(gs[1], sharey=ax_age)
    ax_col = fig.add_subplot(gs[2], sharey=ax_age)
    ax_desc = fig.add_subplot(gs[3], sharey=ax_age)
    
    axes = [ax_age, ax_fmt, ax_col, ax_desc]

    # --- 绘制岩性柱 (Core Plot) ---
    for _, row in df.iterrows():
        style = lith_styles.get(row['lithology'], {'facecolor': 'white', 'hatch': ''})
        
        # 绘制矩形 (Rectangle)
        # x=0, width=1, y=top_depth, height=thickness
        rect = patches.Rectangle((0, row['top_depth']), 1, row['thickness'],
                                 facecolor=style['facecolor'],
                                 edgecolor='black', # 边框颜色
                                 linewidth=0.5,
                                 hatch=style['hatch'] * 2) # *2 让纹理更密
        ax_col.add_patch(rect)
        
        # 添加右侧描述文字
        ax_desc.text(0.05, row['top_depth'] + row['thickness']/2, 
                     f"{row['description']} ({row['lithology']})", 
                     va='center', fontsize=9)

    # --- 处理地层组 (合并同类项) ---
    # 找出每个 Formation 的起始和结束深度，画大括号或大方块
    for fmt_name in df['formation'].unique():
        fmt_data = df[df['formation'] == fmt_name]
        top = fmt_data['top_depth'].min()
        bottom = fmt_data['bottom_depth'].max()
        mid = (top + bottom) / 2
        
        ax_fmt.text(0.5, mid, fmt_name, ha='center', va='center', fontweight='bold', rotation=90)
        # 画横线分隔地层组
        ax_fmt.hlines([top, bottom], 0, 1, colors='black', linewidth=1)

    # --- 设置坐标轴属性 ---
    for ax in axes:
        ax.set_ylim(max_depth, 0) # 深度向下增加
        ax.tick_params(left=False, bottom=False, labelleft=False, labelbottom=False)
        # 竖线分隔
        ax.spines['right'].set_visible(True)
        ax.spines['left'].set_visible(False)
        ax.spines['top'].set_visible(True)
        ax.spines['bottom'].set_visible(True)

    # 恢复左侧深度轴
    ax_age.spines['left'].set_visible(True)
    ax_age.tick_params(left=True, labelleft=True)
    ax_age.set_ylabel('Depth (m)', fontsize=12, fontweight='bold')

    # --- 设置表头 ---
    ax_age.set_title("Depth", fontsize=11, fontweight='bold', pad=10)
    ax_fmt.set_title("Formation", fontsize=11, fontweight='bold', pad=10)
    ax_col.set_title("Lithology", fontsize=11, fontweight='bold', pad=10)
    ax_desc.set_title("Description", fontsize=11, fontweight='bold', pad=10)

    # 微调
    plt.tight_layout()
    
    # 保存
    plt.savefig('stratigraphic_column.pdf', bbox_inches='tight')
    plt.show()

draw_stratigraphic_column(df)