# 矿压分析页面 Nature 风格图表优化设计

> 创建日期: 2026-03-02
> 状态: 已批准
> 目标: 将矿压分析页面的图表质量提升到 Nature/Science 期刊投稿级别

## 1. 项目背景

### 1.1 当前状态

矿压分析页面 (`PressureAnalysis.vue`) 是系统的核心可视化模块，包含：
- **热力图组件** (`PressureHeatmap.vue`) - Canvas 渲染的支架阻力时空分布图
- **6个统计图表** - 使用 ECharts 实现的时序图、直方图、空间分布图、周期检测图、相关性矩阵、前后柱对比图
- **控制面板** - 参数过滤和显示控制

### 1.2 存在的问题

1. **视觉风格不统一** - 各组件样式分散，缺乏统一的主题系统
2. **配色方案不专业** - 未使用感知均匀的色盲友好配色
3. **导出功能有限** - 无法导出高分辨率 (300+ DPI) 图像
4. **交互体验一般** - 缺乏多图表联动、区域选择等高级交互
5. **不符合期刊规范** - 字体大小、线宽等不符合 Nature 期刊要求

## 2. 设计目标

### 2.1 核心目标

将矿压分析页面的所有图表组件重构为符合 **Nature/Science 期刊投稿标准** 的专业学术图表。

### 2.2 具体要求

| 维度 | 要求 |
|------|------|
| 配色 | 使用感知均匀、色盲友好的配色方案 (viridis, Batlow) |
| 字体 | 遵循 Nature 期刊字体规范 (7-11pt) |
| 线宽 | 坐标轴线 0.5pt，数据线 1.0pt |
| 导出 | 支持 SVG 矢量、300+ DPI PNG、PDF 格式 |
| 交互 | 保留基础交互，添加多图表联动、区域选择 |
| 尺寸 | 单栏 89mm，双栏 183mm |

## 3. 技术方案

### 3.1 方案选择

采用 **方案 B: 组件重构方案** - 创建一套全新的 Nature 风格图表组件库。

**选择理由：**
- 架构清晰，可复用性强
- 长期维护成本低
- 可以严格遵循 Nature 规范

### 3.2 项目结构

```
frontend/src/
├── components/
│   └── pressure/
│       ├── nature/                      # 新建 Nature 风格组件目录
│       │   ├── NatureHeatmap.vue        # 核心热力图 (SVG+Canvas)
│       │   ├── NatureTimeSeries.vue     # 时序图
│       │   ├── NatureHistogram.vue      # 直方图
│       │   ├── NatureCorrelation.vue    # 相关性矩阵
│       │   ├── NatureSpatialDist.vue    # 空间分布图
│       │   ├── NatureCycleDetect.vue    # 周期检测图
│       │   ├── NatureColumnCompare.vue  # 前后柱对比图
│       │   ├── shared/
│       │   │   ├── NaturePanel.vue      # 面板容器（标签、标题、脚注）
│       │   │   ├── NatureAxis.vue       # 坐标轴组件
│       │   │   ├── NatureLegend.vue     # 图例组件
│       │   │   └── NatureColorbar.vue   # 颜色条组件
│       │   └── export/
│       │       ├── SvgExporter.js       # SVG 导出工具
│       │       ├── PngExporter.js       # 高清 PNG 导出
│       │       └── PdfExporter.js       # PDF 导出
│       └── views/
│           └── PressureAnalysisPro.vue  # 新版分析页面
├── styles/
│   └── nature-theme.js                  # Nature 主题配置
└── utils/
    └── colorScales.js                   # 色盲友好配色方案
```

## 4. 组件设计

### 4.1 主题配置系统

**文件：`styles/nature-theme.js`**

```javascript
export const NATURE_THEME = {
  typography: {
    fontFamily: "'PingFang SC', 'Microsoft YaHei', Arial, sans-serif",
    fontSize: {
      panelLabel: 11,    // pt - 面板标签 A, B, C
      title: 9,          // pt - 图表标题
      axisLabel: 8,      // pt - 轴标签
      tickLabel: 7,      // pt - 刻度标签
      legend: 7,         // pt - 图例
      footnote: 6        // pt - 脚注
    }
  },
  lines: {
    axisWidth: 0.5,
    gridWidth: 0.25,
    dataLineWidth: 1.0,
    markerSize: 4
  },
  colors: {
    primary: ['#440154', '#482878', '#3E4A89', '#31688E',
              '#26838F', '#1F9E89', '#35B779', '#6DCD59',
              '#B4DE2C', '#FDE725'],  // viridis
    contrast: ['#0072B2', '#D55E00', '#009E73', '#CC79A7',
               '#F0E442', '#56B4E9'],  // Wong 色盲友好
    diverging: ['#313695', '#4575B4', '#74ADD1', '#ABD9E9',
                '#E0F3F8', '#FEE090', '#FDAE61', '#F46D43',
                '#D73027', '#A50026']  // Batlow
  },
  dimensions: {
    singleColumn: { width: 89, height: 80 },
    doubleColumn: { width: 183, height: 140 }
  },
  export: {
    dpi: 300,
    formats: ['svg', 'png', 'pdf']
  }
}
```

### 4.2 组件统一接口

```typescript
interface NatureChartProps {
  // 数据
  data: ChartData

  // 标签
  panelLabel?: string
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  footnote?: string

  // 尺寸
  width?: 'single' | 'double' | 'full'
  height?: number | string

  // 主题
  theme?: 'nature' | 'science' | 'cell'
  colorScale?: string

  // 交互
  interactive?: boolean
  selectable?: boolean

  // 导出
  exportFormat?: 'svg' | 'png' | 'pdf'
  exportDPI?: number
}
```

### 4.3 核心热力图设计

**渲染架构：Canvas + SVG 混合**

```
┌─────────────────────────────────────┐
│  SVG Overlay Layer                  │
│  ┌─────────────────────────────┐    │
│  │ Y-Axis Labels               │    │
│  │    ┌───────────────────┐    │    │
│  │    │                   │    │    │
│  │    │   Canvas Layer    │    │    │
│  │    │   (Heatmap Cells) │    │    │
│  │    │                   │    │    │
│  │    └───────────────────┘    │    │
│  │         X-Axis Labels       │    │
│  └─────────────────────────────┘    │
│  Colorbar │ Legend                  │
└─────────────────────────────────────┘
```

**主要功能：**
1. 高精度颜色映射 (viridis/Batlow)
2. 自动刻度计算
3. 多级标签（日期、推进距离双轴）
4. 矩形区域选择
5. 缩略图导航
6. 高分辨率导出

## 5. 交互设计

### 5.1 基础交互（保留）

- 热力图单元格悬停提示
- 缩放和平移
- 视图重置

### 5.2 高级交互（新增）

**区域选择与统计：**
- 热力图支持矩形框选
- 自动计算选中区域统计信息
- 选中区域可导出为子数据集

**多图表联动：**
- 热力图选择 → 时序图显示对应支架数据
- 时序图时间点选择 → 热力图高亮对应行
- 相关性矩阵点击 → 显示两支架对比图

**数据标注：**
- 支持在图表上添加注释点
- 标注可包含文字和箭头
- 导出时保留标注

## 6. 导出系统

### 6.1 支持格式

| 格式 | 用途 | 特点 |
|------|------|------|
| SVG | 投稿首选 | 矢量格式，无损缩放 |
| PNG | 预览分享 | 支持 300/600 DPI |
| PDF | 打印存档 | 矢量 + 字体嵌入 |

### 6.2 导出流程

```
用户点击导出
    ↓
选择格式 (SVG/PNG/PDF)
    ↓
选择尺寸 (单栏/双栏/全页)
    ↓
选择 DPI (150/300/600)
    ↓
生成预览
    ↓
确认下载
```

## 7. 配色方案

### 7.1 主色板 - Viridis

用于热力图和连续数据可视化。

```
#440154 → #482878 → #3E4A89 → #31688E → #26838F
    → #1F9E89 → #35B779 → #6DCD59 → #B4DE2C → #FDE725
```

特点：
- 感知均匀（equal perceptual distance）
- 色盲友好（deuteranopia/protanopia safe）
- 黑白打印时可区分

### 7.2 对比色 - Wong

用于分类数据和多系列对比。

```
#0072B2 (蓝)  | #D55E00 (橙)  | #009E73 (绿)
#CC79A7 (粉)  | #F0E442 (黄)  | #56B4E9 (天蓝)
```

### 7.3 发散色 - Batlow

用于相关性矩阵和有中心点的数据。

```
负值 ← #313695 → #4575B4 → #74ADD1 → #ABD9E9 → #E0F3F8 (中心)
正值 ← #FEE090 → #FDAE61 → #F46D43 → #D73027 → #A50026
```

## 8. 实现优先级

### Phase 1: 基础设施 (Week 1)
- [ ] 创建 `nature-theme.js` 主题配置
- [ ] 创建 `colorScales.js` 配色工具
- [ ] 创建 `NaturePanel.vue` 面板容器

### Phase 2: 核心组件 (Week 2-3)
- [ ] 重构 `NatureHeatmap.vue` 热力图
- [ ] 创建 `NatureTimeSeries.vue` 时序图
- [ ] 创建 `NatureHistogram.vue` 直方图

### Phase 3: 辅助组件 (Week 4)
- [ ] 创建 `NatureCorrelation.vue` 相关性矩阵
- [ ] 创建 `NatureSpatialDist.vue` 空间分布图
- [ ] 创建 `NatureCycleDetect.vue` 周期检测图
- [ ] 创建 `NatureColumnCompare.vue` 前后柱对比图

### Phase 4: 导出系统 (Week 5)
- [ ] 实现 `SvgExporter.js`
- [ ] 实现 `PngExporter.js`
- [ ] 实现 `PdfExporter.js`

### Phase 5: 集成测试 (Week 6)
- [ ] 创建 `PressureAnalysisPro.vue` 新版页面
- [ ] 多图表联动测试
- [ ] 导出功能测试
- [ ] 性能优化

## 9. 验收标准

### 9.1 视觉标准

- [ ] 所有图表符合 Nature 期刊字体规范
- [ ] 配色使用色盲友好方案
- [ ] 面板标签 (A, B, C...) 自动编号
- [ ] 统一的图例和颜色条样式

### 9.2 功能标准

- [ ] 热力图支持区域选择和统计
- [ ] 多图表联动正常工作
- [ ] SVG/PNG/PDF 导出功能完整
- [ ] 导出图像达到 300 DPI

### 9.3 性能标准

- [ ] 热力图渲染 < 500ms (1000x125 数据)
- [ ] 图表切换动画流畅 (60fps)
- [ ] 导出 300 DPI PNG < 3s

## 10. 参考资源

- [Nature Figure Guidelines](https://www.nature.com/nature/for-authors/formatting-guide)
- [Crameri, S. et al. (2020). The misuse of colour in science communication. Nature Communications](https://doi.org/10.1038/s41467-020-19160-7)
- [Wong, B. (2011). Points of view: Color blindness. Nature Methods](https://doi.org/10.1038/nmeth.1618)
- [Viridis Colormap](https://bids.github.io/colormap/)
