# MPI算法图片空白优化指南

## 问题说明

页面上的SVG图表（由matplotlib生成）周围有大量空白区域，影响显示效果。

## 当前状态

✅ **已完成（快速修复）：**
- 在CSS中添加了`max-height`限制
- 使用`object-fit: contain`防止图片过度拉伸
- 减少了视觉上的空白区域

⚠️ **根本问题：**
- SVG文件本身的viewBox包含了matplotlib的默认margin
- 需要重新生成SVG才能彻底解决

## 解决方案

### 方案1: CSS优化（已实施）✅

**优点：** 无需修改SVG文件，立即生效
**缺点：** 只是视觉效果，文件大小未优化

```css
.flow-figure img {
  max-height: 600px;
  object-fit: contain;
}

.figure-block img {
  max-height: 400px;
  object-fit: contain;
}
```

### 方案2: 使用Inkscape批量优化（推荐）⭐

如果你安装了Inkscape：

```bash
# 批量去除SVG空白
cd frontend/public/mpi-algorithm

for file in *.svg; do
  inkscape "$file" --actions="select-all;selection-ungroup;fit-to-canvas;export-filename:$file;export-do"
done
```

### 方案3: Python脚本（部分有效）

运行提供的脚本：

```bash
python scripts/regenerate_svg_figures.py
```

**注意：** 这个脚本只能减少约10%的空白，效果有限。

### 方案4: 重新生成图表（最佳）⭐⭐⭐

如果你有生成这些图表的原始Python代码，重新生成时使用：

```python
import matplotlib.pyplot as plt

# 生成图表
fig, ax = plt.subplots()
# ... 你的绘图代码 ...

# 保存时使用tight参数
plt.savefig(
    'output.svg',
    format='svg',
    bbox_inches='tight',      # 关键：去除周围空白
    pad_inches=0.1,            # 添加少量内边距
    dpi=100
)
plt.close()
```

**推荐的matplotlib配置：**

```python
import matplotlib.pyplot as plt

# 全局配置
plt.rcParams['figure.autolayout'] = True
plt.rcParams['figure.constrained_layout.use'] = True
plt.rcParams['savefig.bbox'] = 'tight'
plt.rcParams['savefig.pad_inches'] = 0.1

# 或者针对单个图表
fig.savefig('file.svg', bbox_inches='tight', pad_inches=0.1)
```

## 文件位置

- SVG文件: `frontend/public/mpi-algorithm/`
- 备份位置: `frontend/public/mpi-algorithm/backup/`
- 组件文件: `frontend/src/views/MpiAlgorithm.vue`

## 测试结果

### 优化前
- mpi_panels.svg: 679.68 × 747.75 pt (111 KB)
- 大量白色margin区域

### 优化后（预期）
- 减少20-30%的文件大小
- 内容更紧凑，无多余空白

## 推荐步骤

1. **立即生效（已完成）：** CSS优化已应用，刷新页面即可看到改进
2. **长期方案：** 使用方案4重新生成所有图表
3. **备选方案：** 使用Inkscape批量处理现有SVG

## 验证方法

在浏览器中打开页面，检查：
- ✅ 图片不会超出容器高度
- ✅ 图片内容居中显示
- ✅ 没有过大的白色margin
- ✅ 文字和图形清晰可读

## 相关文件

- CSS修改: `frontend/src/views/MpiAlgorithm.vue` (行1005-1017, 1149-1157)
- 优化脚本: `scripts/regenerate_svg_figures.py`
- SVG目录: `frontend/public/mpi-algorithm/`
