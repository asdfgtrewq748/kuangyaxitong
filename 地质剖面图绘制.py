import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import numpy as np

def create_geological_block_diagram():
    # ================= 配置区域 =================
    # 1. 基础设置
    fig = plt.figure(figsize=(12, 10), dpi=300) # 高分辨率
    ax = fig.add_subplot(111, projection='3d')
    
    # 2. 岩层定义 (从上到下: 名称, 厚度, 颜色)
    # 颜色代码参考地质标准色
    strata_config = [
        {"name": "Top Soil", "thick": 0.5, "color": "#8FBC8F"},       # 草绿色/表土
        {"name": "Sandstone", "thick": 2.5, "color": "#F4A460"},      # 砂岩黄
        {"name": "Shale", "thick": 1.5, "color": "#778899"},          # 页岩灰
        {"name": "Coal Seam", "thick": 1.2, "color": "#2F2F2F"},      # 煤层黑 (重点)
        {"name": "Sandy Shale", "thick": 1.5, "color": "#A9A9A9"},    # 砂质页岩
        {"name": "Limestone", "thick": 3.0, "color": "#B0C4DE"},      # 石灰岩蓝
    ]
    
    # 3. 断层设置
    fault_angle = 60  # 断层角度 (未使用几何计算，仅做示意)
    throw = 2.0       # 断距 (右侧地块下沉的高度)
    dip_angle = 5     # 岩层倾向角度 (让图看起来更自然，不是完全平的)
    
    # ================= 绘图核心函数 =================
    
    def get_dipping_z(x, y, z_ref, dip=0.1):
        """计算具有倾角的Z轴坐标 (模拟地层倾斜)"""
        return z_ref - y * dip

    def draw_block(x_range, y_range, z_start, is_hanging_wall=False):
        """
        绘制一个地质块体
        x_range: (x_min, x_max)
        y_range: (y_min, y_max)
        z_start: 起始最高点Z坐标
        is_hanging_wall: 是否是上盘（如果是，会应用断距下沉）
        """
        x_min, x_max = x_range
        y_min, y_max = y_range
        
        # 应用断距
        current_z = z_start - (throw if is_hanging_wall else 0)
        
        # 遍历每一层岩性
        for layer in strata_config:
            h = layer["thick"]
            c = layer["color"]
            
            # 定义该层的8个顶点
            # 顺序: 后左下, 后右下, 前右下, 前左下, 后左上, 后右上, 前右上, 前左上
            # 为了简单，我们主要构建可视面：顶面(Top)、正面(Front)、侧面(Side - usually Right)
            
            # 计算顶面和底面的Z坐标 (考虑倾角)
            z_top_back = get_dipping_z(0, y_max, current_z, dip=np.tan(np.radians(dip_angle)))
            z_top_front = get_dipping_z(0, y_min, current_z, dip=np.tan(np.radians(dip_angle)))
            
            z_bottom_back = z_top_back - h
            z_bottom_front = z_top_front - h
            
            # 顶点坐标 (x, y, z)
            # 定义由于是视角图，我们主要画三个面：Top, Front (y_min), Side (x_max)
            
            # 1. 顶面 (Top Surface)
            # 只有第一层或者是台阶状露出时才需要画顶面，但为了厚度感，每层画顶面会被覆盖，
            # 实际上只有最顶层需要画顶面。
            # 这里为了简单，我们用多边形集合画六面体，但只把可见的添加进去
            
            verts_top = [
                (x_min, y_max, z_top_back), (x_max, y_max, z_top_back),
                (x_max, y_min, z_top_front), (x_min, y_min, z_top_front)
            ]
            
            verts_front = [
                (x_min, y_min, z_top_front), (x_max, y_min, z_top_front),
                (x_max, y_min, z_bottom_front), (x_min, y_min, z_bottom_front)
            ]
            
            verts_side = [ # 右侧面 (x_max)
                (x_max, y_min, z_top_front), (x_max, y_max, z_top_back),
                (x_max, y_max, z_bottom_back), (x_max, y_min, z_bottom_front)
            ]
            
            # 只有当它是断层暴露面（左块的右侧，或右块的左侧）才需要画内侧面
            # 这里简化：只画右侧面作为可视侧面（假设视角从右前方看）
            
            # 绘制
            # Top: 只有最上一层需要画
            if layer == strata_config[0]:
                poly_top = Poly3DCollection([verts_top], facecolors=c, edgecolors='k', linewidths=0.5, alpha=1.0)
                ax.add_collection3d(poly_top)
            
            # Front: 总是可见
            poly_front = Poly3DCollection([verts_front], facecolors=c, edgecolors='k', linewidths=0.5, alpha=1.0)
            ax.add_collection3d(poly_front)
            
            # Side: 对于右侧块，画右侧面；对于左侧块，画断层面（右侧面）
            # 为了视觉效果，我们给断层面加一点阴影颜色差异
            side_color = c
            
            # 特殊处理：如果是左块（Footwall），它的右侧面是断层面，应该画出来
            if not is_hanging_wall:
                poly_fault = Poly3DCollection([verts_side], facecolors=c, edgecolors='k', linewidths=0.5, alpha=0.9) 
                # 给断层面加阴影线效果（可选，这里用透明度模拟）
                ax.add_collection3d(poly_fault)
            
            # 如果是右块（Hanging wall），它的右侧面是边界，也画出来
            if is_hanging_wall:
                 poly_side = Poly3DCollection([verts_side], facecolors=c, edgecolors='k', linewidths=0.5, alpha=1.0)
                 ax.add_collection3d(poly_side)

            # 更新下一层的起始Z
            current_z -= h
            
            # 添加文字标签 (仅在右侧块的侧面添加，或者左侧块的正面)
            if is_hanging_wall:
                # 在侧面标注
                text_z = (z_top_front + z_bottom_front) / 2
                ax.text(x_max + 0.5, y_min + (y_max-y_min)/2, text_z, layer["name"], fontsize=9, ha='left')

    # ================= 执行绘图 =================
    
    # 定义两个地块的范围
    # 左块 (Footwall - 上盘/下盘取决于断层类型，这里假设左高右低)
    draw_block(x_range=(0, 5), y_range=(0, 8), z_start=10, is_hanging_wall=False)
    
    # 右块 (Hanging wall - 下沉块)
    # x从 5.2 开始，留出一点缝隙表示断层线，增加视觉清晰度
    draw_block(x_range=(5.2, 10), y_range=(0, 8), z_start=10, is_hanging_wall=True)

    # ================= 装饰与美化 =================
    
    # 设置坐标轴范围
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.set_zlim(0, 12)
    
    # 隐藏坐标轴 (Nature风格通常不需要坐标轴刻度，而是用比例尺)
    ax.set_axis_off()
    
    # 设置视角 (Elev: 仰角, Azim: 方位角)
    ax.view_init(elev=30, azim=-60)
    
    # 添加断层线标注
    # ax.text(5.1, 0, 11, "Normal Fault", fontsize=12, fontweight='bold', color='red')
    
    # 添加标题
    plt.title("Geological Cross-section: Stratigraphic Sequence & Faulting", fontsize=14, y=0.95)
    
    # 添加比例尺 (手动绘制一条线)
    plt.plot([1, 3], [0, 0], [0, 0], color='k', linewidth=3)
    ax.text(2, -0.5, 0, "Scale", ha='center', fontsize=10)

    # 调整布局
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    create_geological_block_diagram()