# Nature 标准可视化组件库

## 概述

为矿压分析页面新增了一系列符合 **Nature** 期刊配图标准的可视化组件，全部采用色盲友好的配色方案、规范的字体大小和线条宽度。

## 新增图表组件 (10个)

### 1. 压力分布箱线图 (PressureBoxPlot) 📦
- **面板标签**: C
- **功能**: 展示压力数据的时间分布统计
- **特点**:
  - 显示中位数、四分位数、异常值
  - 支持日/周/月时间分组
  - 使用 Nature 标准箱线样式
- **Nature 规范**:
  - 箱体填充色: `rgba(0, 114, 178, 0.1)`
  - 边框颜色: `#0072B2`
  - 异常值: `#CC79A7` (粉紫色)

### 2. 累积分布函数图 (PressureCDF) 📈
- **面板标签**: D
- **功能**: 展示压力的累积概率分布
- **特点**:
  - 显示 P10/P25/P50/P75/P90 分位数
  - 标记中位数位置
  - 面积填充渐变效果
- **Nature 规范**:
  - 主曲线: `#0072B2`
  - 分位数线: `#D55E00` (橙红色虚线)
  - 字体: Arial 8pt

### 3. 频谱分析图 (PressureSpectral) 🔊
- **面板标签**: E
- **功能**: FFT 频谱分析检测周期性
- **特点**:
  - 自动识别主导周期
  - 标记峰值频率
  - 归一化功率谱密度
- **Nature 规范**:
  - 谱线: `#009E73` (绿色)
  - 峰值标记: `#D55E00` (橙红色三角形)
  - 背景渐变填充

### 4. 多支架散点矩阵 (PressureScatterMatrix) ⬛
- **面板标签**: F
- **功能**: 多维度支架间相关性分析
- **特点**:
  - 6×6 散点矩阵
  - 对角线显示直方图
  - 显示 Pearson 相关系数
  - 回归线拟合
- **Nature 规范**:
  - 散点: `#0072B2` (透明度 0.6)
  - 回归线: `#CC79A7` (粉紫色虚线)
  - 相关系数颜色: 强相关绿色/弱相关橙色

### 5. 异常分布热力图 (AnomalyHeatmap) ⚠️
- **面板标签**: G
- **功能**: 基于统计准则的异常检测可视化
- **特点**:
  - 使用 2σ/3σ 准则检测异常
  - 高压异常 (红色) / 低压异常 (蓝色)
  - Z-Score 颜色映射
- **Nature 规范**:
  - 高压: `#D73027` → `#A50026` 渐变
  - 低压: `#74ADD1` → `#313695` 渐变
  - 网格线: 浅灰色

### 6. 压力特征雷达图 (PressureRadar) 🕸️
- **面板标签**: H
- **功能**: 多维度压力特征分析
- **维度**:
  - 平均压力
  - 变异系数
  - 稳定性
  - 峰值比例
  - 趋势强度
  - 偏度
- **Nature 规范**:
  - 主数据: `#0072B2` (填充透明度 0.2)
  - 对比数据: `#D55E00` (填充透明度 0.15)
  - 轴线: 浅灰色

### 7. 核密度估计图 (PressureDensity) 🌊
- **面板标签**: I
- **功能**: KDE 核密度估计
- **特点**:
  - Silverman 带宽自动选择
  - 高斯核函数
  - 标记均值和众数
- **Nature 规范**:
  - 密度曲线: `#009E73` (绿色)
  - 均值线: `#D55E00` (橙红色虚线)
  - 面积填充渐变

### 8. 压力等值线图 (PressureContour) ⭕
- **面板标签**: J
- **功能**: 压力场等值线可视化
- **特点**:
  - 12 条等值线
  - 热力图背景
  - 等值线标签
- **Nature 规范**:
  - 等值线颜色从蓝到红渐变
  - 线宽随值增加
  - 标签字体 8pt Arial

## 配色方案 (Nature 色盲友好)

```javascript
const NATURE_COLORS = {
  primary:    '#0072B2',  // Deep blue
  secondary:  '#D55E00',  // Vermillion
  tertiary:   '#009E73',  // Bluish green
  quaternary: '#CC79A7',  // Reddish purple
  orange:     '#E69F00',  // Orange
  sky:        '#56B4E9',  // Sky blue
  yellow:     '#F0E442',  // Yellow
  black:      '#000000',
  gray:       '#999999'
}
```

## 字体规范

| 元素 | 字体 | 大小 | 粗细 |
|------|------|------|------|
| 标题 | Arial | 12pt | Bold |
| 副标题 | Arial | 9pt | Normal |
| 轴标签 | Arial | 8pt | Normal |
| 刻度标签 | Arial | 8pt | Normal |
| 图例 | Arial | 9pt | Normal |
| 脚注 | Times New Roman | 9pt | Italic |

## 线条规范

| 类型 | 宽度 | 样式 |
|------|------|------|
| 轴线 | 0.75pt | Solid |
| 主数据线 | 1.0pt | Solid |
| 网格线 | 0.5pt | Dashed [4,4] |
| 辅助线 | 0.75pt | Dashed [4,2] |
| 趋势线 | 1.5pt | Dash-dot [8,4] |

## 页面集成

### 标签页列表 (13个)
1. 📊 分布 - 直方图
2. 🗺 空间 - 空间分布
3. 🔄 周期 - 周期检测
4. 🔗 相关 - 相关性矩阵
5. ⚖️ 对比 - 前后柱对比
6. 📦 **箱线** - 箱线图 (新增)
7. 📈 **累积** - CDF (新增)
8. 🔊 **频谱** - 频谱分析 (新增)
9. ⬛ **矩阵** - 散点矩阵 (新增)
10. ⚠️ **异常** - 异常热力图 (新增)
11. 🕸️ **雷达** - 雷达图 (新增)
12. 🌊 **密度** - 核密度估计 (新增)
13. ⭕ **等值** - 等值线图 (新增)

### 组件引用
```javascript
// 图表组件引用
const histogramRef = ref(null)
const spatialRef = ref(null)
const cycleRef = ref(null)
const correlationRef = ref(null)
const compareRef = ref(null)

// 新增 Nature 图表组件引用
const boxplotRef = ref(null)
const cdfRef = ref(null)
const spectralRef = ref(null)
const scatterRef = ref(null)
const anomalyRef = ref(null)
const radarRef = ref(null)
const densityRef = ref(null)
const contourRef = ref(null)
```

## 导出功能

所有图表组件均暴露 `getChartInstance()` 方法，支持 NatureExportPanel 的批量导出：
- SVG (矢量图，推荐)
- PNG (300/600 DPI)
- TIFF (印刷品质)
- PDF (多页文档)

## 构建验证

✅ 构建成功
```
vite v5.4.21 building for production...
✓ 1427 modules transformed
✓ built in 6.55s

PressureAnalysisUltra: 116.58 kB (gzipped: 33.69 kB)
```

## 使用示例

```vue
<PressureBoxPlot
  ref="boxplotRef"
  panel-label="C"
  title="压力分布箱线图"
  subtitle="Box Plot Analysis"
  :data="rawData"
  time-range="day"
/>
```

```vue
<PressureSpectral
  ref="spectralRef"
  panel-label="E"
  title="频谱分析"
  subtitle="Spectral Analysis"
  :data="selectedSupportData"
/>
```

## 后续优化建议

1. **3D 可视化**: 添加 WebGL 3D 表面图
2. **动画支持**: 时间序列动画播放
3. **交互增强**: 图表间联动选择
4. **实时数据**: WebSocket 实时更新
5. **机器学习**: 预测结果可视化
