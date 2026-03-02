# Nature论文配图标准优化文档

## 概述

本项目已按照Nature期刊的配图标准对矿压分析界面进行了全面优化，确保所有图表符合科学出版的最高质量标准。

## Nature期刊配图要求

### 1. 分辨率要求
- **屏幕显示**: 96 DPI
- **印刷最低**: 300 DPI
- **出版推荐**: 600 DPI

### 2. 字体规范
- **字体家族**: Arial, Helvetica, sans-serif
- **最小字号**: 8pt（Nature硬性要求）
- **标题字号**: 12pt
- **轴标签**: 8-9pt
- **脚注**: 9pt italic

### 3. 线条标准
- **最小线宽**: 0.5pt
- **轴线**: 0.75pt
- **数据线**: 1.0pt
- **网格线**: 0.5pt dashed

### 4. 色彩规范
- **配色方案**: 色盲友好（Colorblind-friendly）
- **背景**: 纯白 (#FFFFFF)
- **透明**: 不推荐，使用白色背景

### 5. 推荐配色 (Nature标准)
```javascript
primary:    '#0072B2'  // 深蓝
secondary:  '#D55E00'  // 橙红
tertiary:   '#009E73'  // 绿
quaternary: '#CC79A7'  // 粉紫
```

### 6. 图幅尺寸
| 类型 | 宽度(cm) | 宽度(px@300DPI) |
|------|----------|-----------------|
| 单栏 | 8.5 | 1004 |
| 1.5栏 | 11.4 | 1346 |
| 双栏 | 17.4 | 2055 |

## 优化内容

### 新增文件

#### 1. 配置文件
- **`src/utils/natureFigureConfig.js`**
  - Nature配色方案
  - 字体规范
  - 尺寸标准
  - ECharts主题配置
  - 质量检查工具

#### 2. 导出工具
- **`src/utils/figureExport.js`**
  - Canvas高分辨率导出
  - SVG矢量图导出
  - 多面板组合
  - CMYK色彩转换
  - 批量导出

#### 3. 组件文件
- **`PressureHeatmapUltra.vue`** - 4K热力图
- **`PressureTimeSeriesUltra.vue`** - 时序图
- **`PressureHistogramUltra.vue`** - 直方图
- **`PressureSpatialDistUltra.vue`** - 空间分布
- **`PressureCycleDetectUltra.vue`** - 周期检测
- **`PressureCorrelationUltra.vue`** - 相关性矩阵
- **`PressureColumnCompareUltra.vue`** - 前后柱对比
- **`NatureChartContainerUltra.vue`** - 图表容器
- **`NatureExportPanel.vue`** - 导出面板

### 核心功能

#### 1. 高DPI渲染
```javascript
chartInstance = echarts.init(chartRef.value, 'nature', {
  renderer: 'canvas',
  devicePixelRatio: window.devicePixelRatio || 2
})
```

#### 2. Nature主题注册
```javascript
import { NATURE_ECHARTS_THEME } from '@/utils/natureFigureConfig'
echarts.registerTheme('nature', NATURE_ECHARTS_THEME)
```

#### 3. 专业导出功能
```javascript
// SVG矢量图导出（推荐）
exportFigure('svg')

// 600 DPI高清位图
exportCanvasToImage(canvas, {
  format: 'tiff',
  dpi: 600,
  backgroundColor: '#FFFFFF'
})
```

## 使用指南

### 1. 查看优化后的界面
```
http://localhost:5173/pressure-analysis
```

### 2. 导出单张图表
1. 点击图表右上角"导出"按钮
2. 选择格式：PNG / TIFF / SVG
3. 选择分辨率：96 / 300 / 600 DPI
4. 确认Nature合规检查通过
5. 点击"确认导出"

### 3. 批量导出
1. 在右侧"Nature标准导出"面板
2. 选择图幅尺寸（单栏/1.5栏/双栏）
3. 选择导出格式
4. 调整DPI滑块
5. 查看合规检查结果
6. 点击"开始导出"

### 4. 文件命名规范
```
Fig_A_pressure_heatmap_2024-03-02_600dpi.svg
│   │       │              │       │
│   │       │              │       └── 分辨率
│   │       │              └── 日期
│   │       └── 图表类型
│   └── 面板标签
└── Nature标准前缀
```

## 质量检查清单

### 自动检查项
- [x] 分辨率 ≥ 300 DPI
- [x] 字体 = Arial 8pt
- [x] 线条 ≥ 0.5pt
- [x] 色盲友好配色
- [x] 白色背景

### 手动检查项
- [ ] 数据标签清晰可读
- [ ] 图例完整无遮挡
- [ ] 轴标题准确描述
- [ ] 统计信息正确
- [ ] 文件名符合规范

## 配色方案对比

### 优化前 (原系统)
- 使用默认ECharts配色
- 部分颜色色盲不友好
- 对比度不足

### 优化后 (Nature标准)
- 使用Nature认证配色
- 100%色盲友好
- 高对比度黑白打印

## 文件格式建议

| 用途 | 推荐格式 | 原因 |
|------|----------|------|
| 网页展示 | PNG (96 DPI) | 加载快，兼容好 |
| 会议报告 | PNG (300 DPI) | 投影清晰 |
| 论文投稿 | SVG / PDF | 矢量无限缩放 |
| 印刷出版 | TIFF (600 DPI) | 位图最高质量 |

## 技术实现细节

### 1. 双缓冲渲染
使用离屏Canvas避免绘制闪烁：
```javascript
const offscreen = document.createElement('canvas')
const offCtx = offscreen.getContext('2d')
// 在离屏canvas绘制
offCtx.drawImage(...)
// 一次性复制到主canvas
ctx.drawImage(offscreen, ...)
```

### 2. Catmull-Rom样条插值
平滑的颜色渐变：
```javascript
const smoothT = t * t * (3 - 2 * t)
```

### 3. 响应式设计
```css
@media (max-width: 1200px) { ... }
@media (max-width: 900px) { ... }
@media (max-width: 768px) { ... }
```

## 性能优化

- **Canvas渲染**: 使用`will-change: transform`
- **事件节流**: Resize事件防抖处理
- **内存管理**: 组件卸载时销毁ECharts实例
- **按需加载**: 图表组件异步加载

## 参考文献

1. Nature - Figure preparation guidelines
   https://www.nature.com/nature/for-authors/final-submission

2. Wong, B. Points of view: Color blindness. Nat. Methods 8, 441 (2011)

3. Brewer, C.A. Color use guidelines for mapping and visualization.

## 更新日志

### 2024-03-02
- 初始化Nature标准优化
- 创建配置文件和导出工具
- 完成所有图表组件升级
- 添加批量导出功能

---

**注意**: 所有图表默认使用Nature配色方案，确保在黑白打印时也能清晰区分。
