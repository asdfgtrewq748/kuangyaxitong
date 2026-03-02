# 矿压数据分析页面设计提案

> Mine Pressure Data Analysis Page - Design Proposal
>
> 创建日期：2026-03-02
> 状态：✅ 已实施 (Phase 1-5 完成)

---

## 1. 项目背景

### 1.1 目标
创建一个符合 **Nature/Science 期刊配图标准** 的矿压数据分析页面，实现：
- 02 工作面液压支架末阻力数据的时空可视化
- 与现有采区热力图系统的集成
- 多维度矿压分析图表

### 1.2 数据源
| 数据项 | 描述 |
|--------|------|
| **末阻力数据** | `data/kuangya/末阻力数据1-9 (2).csv` |
| 时间范围 | 2025年1月 - 9月（约270天） |
| 支架数量 | 125个 |
| 柱类型 | 前左柱、后右柱 |
| 总记录数 | ~26,000条 |

### 1.3 坐标系统

#### 采区边界（敏东采区）
```
文件：data/附件/地表下沉/敏东采区坐标.csv
坐标系统：CGCS2000 / 投影坐标
范围：
  X: 495601.82 ~ 498958.81 (约 3357 m)
  Y: 5403926.11 ~ 5405808.05 (约 1882 m)
```

#### 02 工作面边界
```
文件：data/附件/地表下沉/1-工作面四个圈定坐标点.xlsx
四个角点坐标：
  BJ1: (493827.2631, 5403730.276)  ← 西南角
  BJ2: (495204.7150, 5403730.059)  ← 东南角
  BJ3: (495204.7150, 5403525.741)  ← 东北角
  BJ4: (493827.2631, 5403526.016)  ← 西北角

工作面尺寸：
  长度（走向）: 495204.71 - 493827.26 ≈ 1377 m
  宽度（倾向）: 5403730.28 - 5403525.74 ≈ 205 m
```

#### 位置关系示意图
```
          敏东采区边界
    ┌─────────────────────────────────┐
    │                                 │
    │                                 │
    │    ┌───────────────────────┐   │
    │    │      02 工作面         │   │
    │    │   (1377m × 205m)      │   │
    │    │                       │   │
    │    │  支架1 ... 支架125    │   │
    │    │  (沿走向排列)          │   │
    │    └───────────────────────┘   │
    │                                 │
    └─────────────────────────────────┘

    坐标系：
    X轴：东西方向（走向）→ 支架号
    Y轴：南北方向（倾向）→ 推进方向
```

---

## 2. 关键设计参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 推进速度 | 10 m/天 | 用于时间→距离转换 |
| 时间粒度 | 按天聚合 | 每天1格 |
| 总推进距离 | ~2700 m | 270天 × 10m/天 |
| 支架排列 | 沿走向线性 | 1-125号，间距约 11m |
| 工作面长度 | 1377 m | 125支架 × 11m间距 |
| 工作面宽度 | 205 m | 倾向宽度 |

---

## 3. 页面布局设计

### 3.1 整体架构
```
┌─────────────────────────────────────────────────────────────────────┐
│                         顶部导航栏                                   │
│  [返回] 矿压数据分析 | 02工作面 | 时间范围选择器 | 导出按钮          │
├────────────┬────────────────────────────────────┬───────────────────┤
│            │                                    │                   │
│   控制面板  │           主热力图区域              │    统计面板       │
│            │        (可缩放、可交互)             │   + 辅助图表      │
│  - 柱类型  │                                    │                   │
│  - 阈值    │   X轴: 支架号 (1-125)              │  - KPI 卡片       │
│  - 显示    │   Y轴: 推进距离 (0-2700m)          │  - 时间序列       │
│  选项      │   颜色: 末阻力值 (MPa)             │  - 空间分布       │
│            │                                    │  - 周期分析       │
│   220px    │            flex-grow               │     360px        │
│            │                                    │                   │
└────────────┴────────────────────────────────────┴───────────────────┘
```

### 3.2 组件结构
```
views/PressureAnalysis.vue              # 主页面
│
├── components/pressure/
│   ├── PressureControlPanel.vue        # 左侧控制面板
│   │   ├── 时间范围选择器
│   │   ├── 柱类型切换（合并/前左柱/后右柱）
│   │   ├── 阻力阈值滑块
│   │   └── 显示选项（网格线、坐标轴等）
│   │
│   ├── PressureHeatmap.vue             # 中央热力图
│   │   ├── Canvas 绘制层
│   │   ├── 缩放/平移控制
│   │   ├── 悬停提示框
│   │   └── 颜色图例条
│   │
│   ├── PressureStatsPanel.vue          # 右侧统计面板容器
│   │
│   ├── charts/
│   │   ├── PressureKpiCards.vue        # KPI 指标卡片
│   │   ├── PressureTimeSeries.vue      # B: 时间序列折线图
│   │   ├── PressureSpatialDist.vue     # C: 空间分布柱状图
│   │   ├── PressureHistogram.vue       # D: 频率分布直方图
│   │   ├── PressureCycleDetect.vue     # E: 来压周期检测图
│   │   ├── PressureCorrelation.vue     # F: 支架相关性矩阵
│   │   ├── PressureCDF.vue             # G: 累积分布函数
│   │   ├── PressureAnomaly.vue         # H: 时空异常检测散点图
│   │   ├── PressureColumnCompare.vue   # I: 前后柱对比散点图
│   │   ├── Pressure3DView.vue          # J: 三维时空视图 (Three.js)
│   │   ├── PressureBoxPlot.vue         # K: 月度对比箱线图
│   │   └── PressureViolin.vue          # L: 小提琴分布图
│   │
│   └── shared/
│       ├── NatureChartContainer.vue    # Nature 风格图表容器
│       └── ChartExport.vue             # 图表导出组件
│
└── utils/
    └── pressureDataProcessor.js        # 数据预处理模块
```

---

## 4. 热力图详细设计

### 4.1 坐标映射
```javascript
// 支架号 → X坐标 (工作面走向)
const supportToX = (supportId) => {
  const startX = 493827.26  // BJ1 X坐标
  const spacing = 11        // 支架间距 11m
  return startX + (supportId - 1) * spacing
}

// 日期 → Y坐标 (推进距离)
const dateToAdvanceDistance = (date, startDate) => {
  const days = dateDiff(date, startDate)
  return days * 10  // 10m/天
}

// 日期 → Y坐标 (实际坐标)
const dateToY = (date, startDate) => {
  const baseY = 5403525.74  // BJ4 Y坐标 (起始位置)
  const distance = dateToAdvanceDistance(date, startDate)
  return baseY + distance
}
```

### 4.2 热力图矩阵
```
矩阵维度: 270行 × 125列

         支架1   支架2   支架3  ...  支架125
        ┌───────┬───────┬───────┬───┬───────┐
  Day1  │ 14.2  │  5.3  │ 30.1  │...│ 26.0  │
  Day2  │  3.0  │  6.0  │ 34.0  │...│ 32.0  │
  Day3  │  6.0  │  5.0  │ 38.0  │...│ 25.0  │
  ...   │  ...  │  ...  │  ...  │...│  ...  │
 Day270 │ 15.0  │  6.0  │ 31.0  │...│ 28.0  │
        └───────┴───────┴───────┴───┴───────┘

每个单元格值: 末阻力均值 (MPa)
```

### 4.3 与现有系统集成
```javascript
// 复用现有热力图组件
import InteractiveHeatmap from '@/components/InteractiveHeatmap.vue'

// 扩展配置
const heatmapConfig = {
  // 基础配置
  bounds: {
    min_x: 493827.26,
    max_x: 495204.72,
    min_y: 5403525.74,
    max_y: 5406225.74  // 起始Y + 2700m
  },

  // 矩阵配置
  gridSize: 270,  // 天数
  gridWidth: 125, // 支架数

  // 颜色配置
  colorScale: 'diverging',  // 发散色标
  colorRange: ['#2166AC', '#F7F7F7', '#B2182B'],

  // 交互配置
  interactive: true,
  tooltipEnabled: true,
  zoomable: true
}
```

---

## 5. 辅助图表设计 (Nature 标准)

### 5.1 图表布局方案

#### 布局方案 A：右侧面板纵向排列
```
┌─────────────────────────────────────────────────────────────────┐
│                        主热力图 (A)                              │
├───────────────────────┬─────────────────────────────────────────┤
│   B: 时间序列         │   C: 空间分布      D: 频率分布          │
│   (1/4 宽)            │   (1/4 宽)         (1/4 宽)             │
├───────────────────────┼─────────────────────────────────────────┤
│   E: 周期检测         │   F: 相关性矩阵    G: CDF曲线           │
├───────────────────────┼─────────────────────────────────────────┤
│   H: 异常检测         │   I: 前后柱对比    J: 3D视图            │
├───────────────────────┴─────────────────────────────────────────┤
│   K: 月度箱线图                   L: 小提琴图                   │
└─────────────────────────────────────────────────────────────────┘
```

#### 布局方案 B：可切换标签页
```
┌─────────────────────────────────────────────────────────────────┐
│ [时间分析] [空间分析] [相关性] [分布] [3D视图]                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                     当前标签页内容                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 各图表详细设计

#### 图 B - 时间序列折线图
```
┌─────────────────────────────────────────────────┐
│ B  Support #22 resistance over time             │
├─────────────────────────────────────────────────┤
│  60 ┤                                           │
│     │      ▲        ▲        ▲                 │
│  50 ┤     ╱╲      ╱╲      ╱╲                   │
│     │    ╱  ╲    ╱  ╲    ╱  ╲                  │
│  40 ┤   ╱    ╲  ╱    ╲  ╱    ╲                 │
│     │  ╱      ╲╱      ╲╱      ╲                │
│  30 ┤ ╱                                s.d.    │
│     ││  │  │  │  │  │  │  │  │  │  ╠═══════    │
│  20 ┤                                           │
│     │                                           │
│   0 ┼───┬───┬───┬───┬───┬───┬───┬───           │
│     Jan Feb Mar Apr May Jun Jul Aug Sep         │
│     Time (month)                                │
│                                                 │
│     Mean ± s.d., n = 270                       │
└─────────────────────────────────────────────────┘
```

#### 图 E - 来压周期检测
```
┌─────────────────────────────────────────────────┐
│ E  Periodic pressure detection                  │
├─────────────────────────────────────────────────┤
│  60 ┤                                           │
│     │    ★        ★        ★        ★         │
│  50 ┤   ╱╲      ╱╲      ╱╲      ╱╲            │
│     │  ╱  ╲    ╱  ╲    ╱  ╲    ╱  ╲           │
│  40 ┤ ╱    ╲  ╱    ╲  ╱    ╲  ╱    ╲          │
│     │╱      ╲╱      ╲╱      ╲╱      ╲         │
│  30 ┤                                           │
│     │                                           │
│   0 ┼─────┬─────┬─────┬─────┬─────             │
│     0    50   100   150   200   250            │
│     Advance distance (m)                       │
│                                                 │
│     Period: 45.2 ± 3.1 m (n=5, p<0.01)        │
└─────────────────────────────────────────────────┘
```

#### 图 F - 支架相关性矩阵
```
┌─────────────────────────────────────────────────┐
│ F  Support correlation matrix                   │
├─────────────────────────────────────────────────┤
│     125 ┬────────────────────────────────┐      │
│         │░░░▒▒▒▓▓▓███▓▓▓▒▒▒░░░          │      │
│     100 │░░░▒▒▒▓▓▓███▓▓▓▒▒▒░░░          │      │
│      75 │▒▒▒▓▓▓█████████▓▓▓▒▒▒          │      │
│      50 │▓▓▓███████████████▓▓▓          │      │
│      25 │▒▒▒▓▓▓█████████▓▓▓▒▒▒          │      │
│       1 │░░░▒▒▒▓▓▓███▓▓▓▒▒▒░░░          │      │
│         └────────────────────────────────┘      │
│         1   25   50   75   100   125           │
│         Support number                          │
│                                                 │
│     ┌───┐                    ┌───┐             │
│     │-1 │ 0  0.5  1  r       │ 1 │             │
│     └───┘                    └───┘             │
│         Pearson correlation coefficient        │
└─────────────────────────────────────────────────┘
```

#### 图 I - 前后柱对比
```
┌─────────────────────────────────────────────────┐
│ I  Front vs Rear column comparison              │
├─────────────────────────────────────────────────┤
│  60 ┤                                    ●      │
│     │                               ●  ●       │
│  50 ┤                          ●  ●            │
│     │                     ●  ●                 │
│  40 ┤                ●  ●                      │
│     │           ●  ● ─ ─ ─ ─ ─ ─ ─ ─ ─        │
│  30 ┤      ●  ●    (y = x)                    │
│     │ ●  ●                                   │
│  20 ┤●                                       │
│     │                                        │
│  10 ┤                                        │
│     │                                        │
│   0 ┼───┬───┬───┬───┬───┬───┬───            │
│     0  10  20  30  40  50  60                │
│     Front column resistance (MPa)             │
│                                               │
│     y = 0.85x + 2.1, R² = 0.72              │
│     *** p < 0.001, n = 26,283               │
└─────────────────────────────────────────────────┘
```

### 5.3 Nature 配图规范

#### 字体与尺寸
```css
/* Nature 期刊标准 */
.nature-chart {
  --font-family: 'Arial', 'Helvetica', sans-serif;
  --font-size-base: 7pt;
  --font-size-axis-label: 8pt;
  --font-size-title: 9pt;
  --font-size-panel-label: 10pt;  /* A, B, C... */
  --font-size-legend: 7pt;

  --line-width-axis: 0.5pt;
  --line-width-data: 1pt;
  --marker-size: 4pt;

  --chart-width-single: 89mm;   /* 单栏 */
  --chart-width-double: 183mm;  /* 双栏 */
  --export-dpi: 300;
}
```

#### 配色方案 (Okabe-Ito 色盲友好)
```javascript
const NATURE_COLORS = {
  // 主色板
  blue: '#0072B2',
  orange: '#D55E00',
  green: '#009E73',
  pink: '#CC79A7',
  black: '#000000',
  yellow: '#F0E442',
  skyBlue: '#56B4E9',
  vermillion: '#D55E00',

  // 热力图发散色标 (蓝-白-红)
  heatmapLow: '#2166AC',
  heatmapMid: '#F7F7F7',
  heatmapHigh: '#B2182B',

  // 热力图顺序色标 (Viridis)
  viridis: ['#440154', '#31688E', '#35B779', '#FDE725']
}
```

#### 图表元素规范
| 元素 | Nature 标准 |
|------|-------------|
| 面板标签 | **A**, **B**, **C**... 加粗，左上角，10pt |
| 轴标签 | 物理量 (单位)，如 `Time (h)`，8pt |
| 刻度线 | 向内，长度 3pt，简洁 |
| 图例 | 无边框，放在空白区域，7pt |
| 误差棒 | 标注 s.d. 或 s.e.m. |
| 显著性 | `*` p<0.05, `**` p<0.01, `***` p<0.001 |
| 统计信息 | R², p值, 样本量 n |

---

## 6. 数据预处理模块

### 6.1 处理流程
```javascript
// utils/pressureDataProcessor.js

/**
 * 1. 加载原始 CSV 数据
 */
async function loadRawData(filePath) {
  // 读取 CSV，解析日期，转换数值
}

/**
 * 2. 按天聚合数据
 * @returns {Map<date, Map<supportId, { mean, std, count }>>}
 */
function aggregateByDay(rawData) {
  // 按日期和支架号分组
  // 计算每日每支架的均值、标准差、样本数
}

/**
 * 3. 计算推进距离
 * @param {Date} date - 当前日期
 * @param {Date} startDate - 起始日期
 * @param {number} speed - 推进速度 (m/天)
 * @returns {number} 推进距离 (m)
 */
function calculateAdvanceDistance(date, startDate, speed = 10) {
  const days = dateDiff(date, startDate)
  return days * speed
}

/**
 * 4. 生成热力图矩阵
 * @returns {number[][]} 270×125 矩阵
 */
function generateHeatmapMatrix(aggregatedData, config) {
  const { numDays, numSupports, startDate, columnType } = config
  const matrix = Array(numDays).fill(null).map(() => Array(numSupports).fill(NaN))

  // 填充矩阵
  for (const [date, supports] of aggregatedData) {
    const row = dateDiff(date, startDate)
    for (const [supportId, stats] of supports) {
      const col = supportId - 1
      if (row >= 0 && row < numDays && col >= 0 && col < numSupports) {
        matrix[row][col] = stats.mean
      }
    }
  }

  return matrix
}

/**
 * 5. 来压周期检测
 * @returns {{ periods: number[], peaks: Date[], meanPeriod: number }}
 */
function detectPressureCycles(timeSeries) {
  // 峰值检测算法
  // 计算周期间隔
  // 统计平均周期
}

/**
 * 6. 计算统计量
 */
function calculateStats(data) {
  return {
    mean: mean(data),
    std: std(data),
    min: min(data),
    max: max(data),
    median: median(data),
    q1: quartile(data, 0.25),
    q3: quartile(data, 0.75),
    n: data.length
  }
}

/**
 * 7. 异常检测
 */
function detectAnomalies(data, threshold = 2) {
  const m = mean(data)
  const s = std(data)
  return data.filter(v => Math.abs(v - m) > threshold * s)
}
```

### 6.2 数据结构定义
```typescript
// types/pressure.ts

interface RawPressureRecord {
  workFaceName: string
  supportId: number
  columnType: '前左柱' | '后右柱'
  cycleStartTime: Date
  cycleEndTime: Date
  finalResistanceTime: Date
  finalResistanceValue: number  // MPa
}

interface AggregatedRecord {
  date: Date
  supportId: number
  columnType: string
  mean: number
  std: number
  count: number
  advanceDistance: number  // m
}

interface HeatmapCell {
  row: number       // 天数索引 (0-269)
  col: number       // 支架索引 (0-124)
  x: number         // 实际 X 坐标
  y: number         // 实际 Y 坐标
  value: number     // 阻力值 (MPa)
  date: Date
  supportId: number
  std: number
  count: number
}

interface PressureStats {
  global: {
    mean: number
    std: number
    min: number
    max: number
    median: number
  }
  bySupport: Map<number, PressureStats>
  byDate: Map<string, PressureStats>
}
```

---

## 7. 实施计划

### Phase 1: 数据层 (1天)
- [ ] 创建 `utils/pressureDataProcessor.js`
- [ ] 实现 CSV 加载和解析
- [ ] 实现按天聚合
- [ ] 实现推进距离计算
- [ ] 实现热力图矩阵生成
- [ ] 单元测试

### Phase 2: 热力图组件 (2天)
- [ ] 创建 `PressureHeatmap.vue`
- [ ] 实现 Canvas 绘制（复用 HeatmapCanvas）
- [ ] 实现坐标映射
- [ ] 实现缩放/平移交互
- [ ] 实现悬停提示
- [ ] 实现点击选中

### Phase 3: 控制面板 (0.5天)
- [ ] 创建 `PressureControlPanel.vue`
- [ ] 实现柱类型切换
- [ ] 实现阈值设置
- [ ] 实现显示选项

### Phase 4: 统计图表 (2天)
- [ ] 创建 `NatureChartContainer.vue` 基础组件
- [ ] 实现 KPI 卡片
- [ ] 实现时间序列图 (B)
- [ ] 实现空间分布图 (C)
- [ ] 实现频率分布图 (D)
- [ ] 实现来压周期检测 (E)
- [ ] 实现相关性矩阵 (F)
- [ ] 实现 CDF 曲线 (G)
- [ ] 实现前后柱对比 (I)
- [ ] 实现箱线图 (K)
- [ ] 实现小提琴图 (L)

### Phase 5: 高级功能 (1天)
- [ ] 实现异常检测 (H)
- [ ] 实现 3D 时空视图 (J) - 使用 Three.js
- [ ] 实现图表导出 (PDF/PNG, 300 DPI)

### Phase 6: 集成与优化 (0.5天)
- [ ] 创建主页面 `PressureAnalysis.vue`
- [ ] 添加路由配置
- [ ] 性能优化（大数据量渲染）
- [ ] 响应式布局适配

**预计总工期：7天**

---

## 8. 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| 框架 | Vue 3 + Composition API | 前端框架 |
| 状态 | Pinia | 状态管理 |
| 图表 | ECharts 5 | 2D 图表 |
| 热力图 | Canvas 2D | 高性能渲染 |
| 3D | Three.js | 三维可视化 |
| 样式 | Tailwind CSS | 样式框架 |
| 工具 | Lodash | 数据处理 |
| 数学 | Simple-statistics | 统计计算 |

---

## 9. 验收标准

### 功能验收
- [ ] 热力图正确显示 270天 × 125支架 数据
- [ ] 缩放/平移流畅（60fps）
- [ ] 悬停提示准确显示数据
- [ ] 柱类型切换实时更新
- [ ] 所有辅助图表正确渲染

### Nature 标准备验收
- [ ] 字体：Arial/Helvetica，7-9pt
- [ ] 配色：Okabe-Ito 色盲友好
- [ ] 尺寸：单栏 89mm / 双栏 183mm
- [ ] 导出：300 DPI PDF/PNG
- [ ] 轴标签：物理量 (单位) 格式
- [ ] 面板标签：A, B, C... 加粗

### 性能验收
- [ ] 初始加载 < 3秒
- [ ] 交互响应 < 100ms
- [ ] 内存占用 < 500MB

---

## 10. 待确认事项

- [x] 采区边界坐标（已提供：敏东采区坐标.csv）
- [x] 02 工作面边界坐标（已提供：1-工作面四个圈定坐标点.xlsx）
- [ ] 支架排列方向确认（假设：沿走向线性排列）
- [ ] 是否需要实时数据接入
- [ ] 是否需要与现有 MPI 热力图联动

---

## 附录

### A. 坐标数据

#### 敏东采区边界
```
X,Y
498958.8109,5405677.7
495625.2405,5405808.045
495683.992,5405751.926
495685.6996,5405672.939
495603.0531,5405610.878
495603.0673,5404851.351
495687.4409,5404819.902
495693.6678,5404712.835
495601.8241,5404671.804
495601.8241,5404270.607
496085.1344,5404272.579
496085.1344,5404207.591
496177.6283,5404207.591
496171.0123,5403933.395
498958.8109,5403926.114
```

#### 02 工作面四角坐标
```
角点    X坐标          Y坐标
BJ1    493827.2631   5403730.276  (西南)
BJ2    495204.7150   5403730.059  (东南)
BJ3    495204.7150   5403525.741  (东北)
BJ4    493827.2631   5403526.016  (西北)

尺寸计算：
- 走向长度 (X方向): 495204.72 - 493827.26 = 1377.46 m
- 倾向宽度 (Y方向): 5403730.28 - 5403525.74 = 204.54 m
```

---

*文档版本: 1.0*
*最后更新: 2026-03-02*
