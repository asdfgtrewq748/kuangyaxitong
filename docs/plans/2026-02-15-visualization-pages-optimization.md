# 地质建模系统可视化页面优化方案

**项目**: 矿压系统可视化页面优化
**日期**: 2026-02-15
**目标用户**: 科研人员
**优化范围**: 地质建模可视化、三维指标可视化、空间实验室三个页面

---

## 1. 执行摘要

本优化方案针对科研人员使用场景，对三个核心可视化页面进行全面升级，涵盖视觉设计、性能优化、功能增强和用户体验四个维度。通过建立统一的设计系统、采用先进的渲染技术、优化数据流和工作流，将系统打造成专业的科研分析平台。

### 关键目标
- ✅ 统一视觉语言和交互模式
- ✅ 大幅提升渲染性能（60fps 流畅运行）
- ✅ 增强科研功能（分析、对比、导出）
- ✅ 优化用户工作流（减少操作步骤）
- ✅ 建立可维护的组件库体系

---

## 2. 设计原则

### 2.1 专业性优先
- 准确的数据可视化（无误导性图表）
- 完整的功能覆盖（支持复杂分析）
- 可追溯的操作记录（满足科研规范）

### 2.2 性能至上
- 首次加载 < 3s（3G 网络）
- 交互响应 < 100ms
- 3D 渲染 60fps
- 热力图渲染 60fps（1000×1000 网格）

### 2.3 一致性体验
- 统一的色彩系统
- 统一的交互模式
- 统一的布局结构
- 统一的术语表达

---

## 3. 整体架构与设计系统

### 3.1 统一视觉语言

#### 色彩系统
```css
/* 主色调 - 科学蓝绿 */
--color-primary: #0f766e;
--color-primary-light: #14b8a6;
--color-primary-dark: #0d5f59;

/* 警示色 - 风险等级 */
--color-danger: #dc2626;    /* 高风险 */
--color-warning: #f59e0b;    /* 中风险 */
--color-caution: #facc15;    /* 低风险 */
--color-success: #22c55e;    /* 正常 */

/* 中性色 */
--color-text-primary: #1e293b;
--color-text-secondary: #64748b;
--color-border: #d8e6e3;
--color-bg-page: #f7fbfa;
--color-bg-card: #ffffff;

/* 数据可视化渐变 */
--gradient-heatmap: linear-gradient(90deg, #0e7490, #14b8a6, #84cc16, #facc15, #fb923c, #dc2626);
--gradient-primary: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
--gradient-card: linear-gradient(145deg, #ffffff 0%, #eef7f5 52%, #fdf8f1 100%);
```

#### 间距系统
- 基础单位：8px
- 常用间距：8px、16px、24px、32px、48px
- 卡片内边距：16-24px
- 组件间距：12-16px

#### 圆角规范
- 卡片：12px
- 按钮：6-8px
- 输入框：4px
- 浮动面板：16px

#### 字体规范
```css
/* 数据展示 - 等宽字体 */
font-family: 'JetBrains Mono', 'Consolas', monospace;

/* 中文正文 */
font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

/* 英文正文 */
font-family: 'Inter', -apple-system, sans-serif;
```

### 3.2 响应式布局框架

#### 断点系统
```javascript
const breakpoints = {
  sm: '640px',   // 手机横屏
  md: '1024px',  // 平板
  lg: '1280px',  // 桌面
  xl: '1536px'   // 大屏
}
```

#### 布局模式
- **桌面端**：侧边栏 + 主内容区
- **移动端**：全屏内容 + 抽屉式侧边栏
- **固定顶部导航** + 滚动内容区

### 3.3 组件库体系

#### 核心组件列表
```
src/components/library/
├── data/                    # 数据展示组件
│   ├── StatCard.vue         # 统计卡片（带趋势指示）
│   ├── DataTable.vue        # 数据表格（支持排序、筛选、导出）
│   ├── MetricGrid.vue       # 指标网格（多指标展示）
│   └── ChartContainer.vue   # 图表容器（标题、图例、工具栏）
│
├── visualization/           # 可视化组件
│   ├── Canvas3D.vue         # 3D 画布容器（Three.js 封装）
│   ├── HeatmapWebGL.vue     # WebGL 热力图
│   ├── ColorLegend.vue      # 颜色图例
│   ├── ContourOverlay.vue   # 等值线叠加层
│   └── Crosshair.vue        # 十字光标
│
├── controls/                # 控制组件
│   ├── FilterPanel.vue      # 筛选面板
│   ├── Toolbar.vue          # 工具栏
│   ├── PlaybackBar.vue      # 播放控制栏
│   ├── DirectionControl.vue # 方向控制器
│   └── SliderDual.vue       # 双滑块范围选择器
│
├── forms/                   # 表单组件
│   ├── FormGrid.vue         # 表单网格布局
│   ├── SelectSearch.vue     # 可搜索下拉框
│   ├── InputNumber.vue      # 数字输入框
│   └── CheckboxGroup.vue    # 复选框组
│
├── feedback/                # 反馈组件
│   ├── LoadingState.vue     # 加载状态
│   ├── EmptyState.vue       # 空状态
│   ├── ErrorState.vue       # 错误状态
│   ├── Toast.vue            # 消息提示
│   └── ConfirmDialog.vue    # 确认对话框
│
└── layout/                  # 布局组件
    ├── PageHeader.vue       # 页面头部
    ├── SidePanel.vue        # 侧边面板（可折叠）
    ├── FloatingPanel.vue    # 浮动面板
    └── TabBar.vue           # 标签栏
```

### 3.4 性能架构

#### 渲染优化
```javascript
// 1. Canvas/WebGL 分层渲染
// - 静态背景层：离屏 Canvas 缓存
// - 动态前景层：实时渲染
// - 叠加层：UI、标注、控制点

const renderLayers = {
  background: 'cached-canvas',  // 缓存静态内容
  dynamic: 'main-canvas',       // 实时渲染
  overlay: 'ui-canvas'          // UI 元素
}

// 2. 数据分层加载
const loadStrategy = {
  phase1: 'skeleton',    // 骨架屏（200ms）
  phase2: 'overview',    // 概览数据（低分辨率）
  phase3: 'detail'       // 详细数据（高分辨率）
}

// 3. Web Worker 处理计算
// - 数据插值计算
// - 统计分析
// - 图表生成
```

#### 状态管理
```javascript
// Pinia Store 结构
stores/
├── useAppStore.js        # 全局应用状态（主题、语言、用户）
├── useDataStore.js       # 数据状态（煤层、模型、实验）
├── useUIStore.js         # UI 状态（面板、模态框、加载）
└── useCacheStore.js      # 缓存管理
```

---

## 4. 地质建模可视化页面优化

### 4.1 当前问题
- 3D 模型渲染效果差（缺乏光照、阴影、材质）
- 交互操作不便（缺少快捷键、视角切换）
- 加载速度慢（未使用 LOD、未优化几何体）
- 质量评估展示简陋（仅卡片式）

### 4.2 优化方案

#### 4.2.1 3D 模型交互升级

**自由视角控制**
```javascript
// 六自由度相机
const cameraControls = {
  rotate: true,      // 旋转
  zoom: true,        // 缩放
  pan: true,         // 平移
  polarAngle: [0, Math.PI],     // 俯仰角限制
  azimuthAngle: [-Infinity, Infinity],  // 方位角
  dampingFactor: 0.05,  // 阻尼惯性
  enableDamping: true
}

// 预设视角
const presetViews = {
  top: { position: [0, 100, 0], target: [0, 0, 0] },
  front: { position: [0, 0, 100], target: [0, 0, 0] },
  side: { position: [100, 0, 0], target: [0, 0, 0] },
  iso: { position: [50, 50, 50], target: [0, 0, 0] }
}
```

**剖切工具**
```javascript
// X/Y/Z 轴剖切
const clippingPlane = {
  enabled: true,
  axis: 'x',  // 'x' | 'y' | 'z'
  constant: 0,  // 剖切位置
  showPlane: true,  // 显示剖切面
  color: 0xff0000
}

// 实时查看内部结构
```

**测量工具**
```javascript
const measurementTools = {
  distance: {
    enabled: false,
    points: [],  // 测量点
    unit: 'm'
  },
  area: {
    enabled: false,
    polygon: []
  },
  volume: {
    enabled: false,
    bounds: {}
  }
}
```

**标注系统**
```javascript
const annotations = [
  {
    id: '1',
    position: [10, 20, 30],
    text: '关键断层位置',
    type: 'text' | 'arrow'
  }
]
```

#### 4.2.2 数据可视化增强

**质量仪表盘（雷达图）**
```vue
<RadarChart
  :data="{
    连续性: quality.continuity_score,
    完整度: 1 - quality.pinchout_ratio,
    稳定性: 1 - quality.layer_cv
  }"
  :options="radarOptions"
/>
```

**钻孔详情面板**
```vue
<Dialog v-model="boreholeDialogVisible">
  <BoreholeColumnChart
    :borehole="selectedBorehole"
    :layers="selectedBorehole.layers"
  />
  <BoreholeCompare
    :boreholes="[selectedBorehole, compareBorehole]"
  />
</Dialog>
```

**MPI 热力图联动**
```javascript
// 3D 模型选择区域 → 热力图对应区域高亮
const syncSelection = (region3D) => {
  heatmapRef.value?.highlightRegion(region3D)
}
```

#### 4.2.3 性能优化

**LOD（细节层次）**
```javascript
const lodLevels = [
  { distance: 0, resolution: 1.0 },    // 高精度
  { distance: 100, resolution: 0.5 },  // 中精度
  { distance: 200, resolution: 0.25 }  // 低精度
]
```

**视锥体裁剪**
```javascript
// 只渲染视野内的几何体
const frustumCulling = true
```

**实例化渲染**
```javascript
// 钻孔使用 InstancedMesh 批量渲染
const boreholeInstances = new THREE.InstancedMesh(
  geometry,
  material,
  boreholeCount
)
```

#### 4.2.4 科研功能增强

**场景快照**
```javascript
const saveSnapshot = () => {
  return {
    camera: camera.toJSON(),
    layers: visibleLayers,
    annotations: annotations,
    timestamp: Date.now()
  }
}
```

**导出功能**
```javascript
const exportOptions = {
  image: 'png',     // 高清截图
  model: 'gltf',    // 3D 模型
  data: 'json'      // 数据
}
```

**对比模式**
```vue
<SplitPane>
  <GeomodelViewer :data="modelA" />
  <GeomodelViewer :data="modelB" />
</SplitPane>
```

### 4.3 布局设计

```
┌─────────────────────────────────────────────────────────────┐
│ 顶部导航栏                                                  │
│ [Logo] 地质建模与可视化 | [煤层选择] [任务选择] [刷新]       │
│ [视图切换] [3D模型] [MPI热力图] [联动视图] [统计]          │
│ [快照] [导出] [帮助]                                        │
├──────────┬──────────────────────────────────────────────────┤
│ 左侧面板  │                                                    │
│          │                                                    │
│ 📊 数据源  │              3D 可视化主区域                      │
│ ▸ 煤层选择  │         (Three.js Canvas)                       │
│ ▸ 任务ID   │                                                    │
│ ▸ [运行分析]│                                                    │
│          │                                                    │
│ 📈 质量评估 │                                                    │
│ ┌─────────┐│                 [剖切工具]                        │
│ │ 雷达图   ││                 [测量工具]                        │
│ │         ││                 [标注工具]                        │
│ └─────────┘│                                                    │
│          │                 [相机控制]                          │
│ 📍 钻孔列表  │                 [视角切换]                          │
│ • ZK001   │                                                    │
│ • ZK002   │                                                    │
│ ...      │                                                    │
│          │                                                    │
│ 🎨 图层控制  │                                                    │
│ ☑ 地质模型  │                                                    │
│ ☑ 钻孔标注  │                                                    │
│ ☑ 边界框   │                                                    │
│          │                                                    │
│ 🔧 工具箱   │                                                    │
│ [剖切] [测量]│                                                    │
│ [标注] [对比]│                                                    │
│          │                                                    │
└──────────┴───────────────────────────────────────────────────┘
```

---

## 5. 三维指标可视化页面优化

### 5.1 当前问题
- Canvas 渲染性能差（大网格卡顿）
- 交互体验不流畅（缺少快捷操作）
- 数据展示不够直观（单一热力图）
- 地质约束功能不完善

### 5.2 优化方案

#### 5.2.1 WebGL 热力图渲染

**WebGL Shader 实现**
```glsl
// vertex shader
attribute vec2 a_position;
attribute float a_value;
varying float v_value;

void main() {
  v_value = a_value;
  gl_Position = vec4(a_position, 0.0, 1.0);
}

// fragment shader
precision mediump float;
varying float v_value;
uniform vec2 u_range;  // min, max
uniform sampler2D u_colormap;  // 颜色映射纹理

void main() {
  float t = (v_value - u_range.x) / (u_range.y - u_range.x);
  vec4 color = texture2D(u_colormap, vec2(t, 0.5));
  gl_FragColor = color;
}
```

**多级纹理缓存**
```javascript
const textureCache = new Map()

function getTextureForZoom(zoom) {
  const level = Math.floor(zoom / 2)
  if (!textureCache.has(level)) {
    textureCache.set(level, generateTexture(level))
  }
  return textureCache.get(level)
}
```

**增量渲染**
```javascript
// 只更新变化的单元格
const dirtyCells = new Set()

function updateGrid(updates) {
  updates.forEach(({x, y, value}) => {
    grid[y][x] = value
    dirtyCells.add(`${x},${y}`)
  })
  renderDirtyCells()
}
```

#### 5.2.2 交互体验提升

**框选分析**
```javascript
const boxSelect = {
  enabled: true,
  onStart: (point) => { selectionRect.start = point },
  onMove: (point) => { selectionRect.end = point },
  onEnd: (rect) => {
    const stats = calculateStats(rect)
    showFloatingPanel(stats)
  }
}
```

**时序回放增强**
```vue
<TimelineControl
  :duration="500"
  :keyframes="[0, 50, 100, 200, 300, 400, 500]"
  :speed-profile="{
    0-50: 0.5,    // 初采慢速
    50-400: 1.0,  // 推进常速
    400-500: 0.5  // 收尾慢速
  }"
  @keyframe-click="jumpToKeyframe"
/>
```

**十字光标**
```javascript
const crosshair = {
  showValues: true,
  showDiagonals: true,
  snapToGrid: true
}
```

#### 5.2.3 多数据源对比

**分屏对比**
```vue
<SplitPane direction="horizontal">
  <HeatmapWebGL
    :data="baselineData"
    title="Baseline"
  />
  <HeatmapWebGL
    :data="geoAwareData"
    title="Geology-Aware"
  />
</SplitPane>
```

**差异图**
```javascript
const differenceMap = calculateDifference(baseline, geoAware)
// 显示正值/负值/零值的不同颜色
```

**统计图表**
```vue
<Histogram
  :data="selectedRegionValues"
  :bins="50"
  title="数值分布"
/>
```

**数据探针**
```javascript
const probes = [
  { id: 1, x: 100, y: 200, label: '探针1' },
  { id: 2, x: 300, y: 400, label: '探针2' }
]

// 实时监控探针位置数值变化
```

#### 5.2.4 地质约束增强

**地质模型叠加**
```vue
<LayerManager>
  <HeatmapLayer :data="mpiGrid" :opacity="0.8" />
  <GeomodelLayer :data="geomodel" :opacity="0.3" />
  <BoreholeLayer :data="boreholes" />
  <ContourLayer :data="mpiGrid" />
</LayerManager>
```

**等值线优化**
```javascript
// Marching Squares 算法
import { marchingSquares } from 'marching-squares'

const contours = marchingSquares(grid, thresholds)
```

**自定义阈值**
```vue
<ThresholdEditor
  v-model="gradeThresholds"
  :min="stats.min"
  :max="stats.max"
  :color-scale="gradeColors"
/>
```

### 5.3 布局设计

```
┌──────────────────────────────────────────────────────────────────┐
│ 顶部工具栏                                                        │
│ [煤层] [任务] [精度] [地质约束 ☑] [对比模式] [导出] [设置]       │
├─────────┬────────────────────────────────────────────────────────┤
│ 控制面板  │                                                        │
│ (可收起)  │                                                        │
│          │                   热力图主区域                          │
│ ▸ 视图设置  │               (WebGL Canvas)                         │
│   网格精度  │                                                        │
│   色彩方案  │                                                        │
│          │                                                        │
│ ▸ 地质约束  │                   ┌──────────┐                      │
│   ☑ 启用   │                   │浮动统计  │                      │
│   任务ID   │                   │面板      │                      │
│   [计算]   │                   │ 均值: 45 │                      │
│          │                   │ 方差: 12 │                      │
│ ▸ 图层    │                   │ 风险: 中 │                      │
│   ☑ 热力图  │                   └──────────┘                      │
│   ☑ 等值线  │                                                        │
│   ☑ 网格   │                                                        │
│   ☑ 钻孔   │                                                        │
│   ☑ 分级带  │                                                        │
│          │                                                        │
│ ▸ 图例    │                   [十字光标跟随]                        │
│   [渐变条] │                                                        │
│   低→高  │                                                        │
│          │                                                        │
├─────────┤                                                        │
│ 底部面板  │                                                        │
│ (可收起)  │                                                        │
│          │                                                        │
│ ▸ 时序控制  │                                                        │
│  ━━━●━━━ │  [◀◀] [▶]  [▶▶]                                     │
│  0%    50% 100%                                                 │
│          │                                                        │
│  播放速度:  1×  2×  5×                                           │
│          │                                                        │
│  当前阶段: 推进  (应力: 78%  卸压: 45%)                          │
│          │                                                        │
│  关键帧:   ⏹  50m  200m  400m  [+]                              │
│          │                                                        │
└─────────┴────────────────────────────────────────────────────────┘
```

### 5.4 科研功能增强

**自动化分析报告**
```javascript
function generateReport(data) {
  return {
    title: 'MPI 分析报告',
    timestamp: new Date().toISOString(),
    statistics: calculateStatistics(data),
    screenshots: captureScreenshots(),
    recommendations: generateRecommendations(data),
    format: 'pdf'
  }
}
```

**批量导出**
```javascript
async function exportTimeSeries() {
  const frames = []
  for (let i = 0; i <= 100; i++) {
    seekToProgress(i)
    await wait(100) // 等待渲染
    frames.push(captureFrame())
  }
  await downloadAsGIF(frames)
}
```

**Python API**
```python
# 提供给科研人员的 Python 接口
import mpiviz

viz = mpiviz.Visualizer()
viz.load_data('seam_A.csv')
viz.set_thresholds([20, 40, 60, 80])
viz.export_heatmap('output.png')
```

---

## 6. 空间实验室页面优化

### 6.1 当前问题
- 功能复杂难用（6 个步骤不直观）
- 实验结果可视化不清晰
- 操作流程繁琐（重复输入多）
- 缺少协作功能

### 6.2 优化方案

#### 6.2.1 工作流程优化

**可视化流程图**
```vue
<WorkflowWizard :current-step="currentStep">
  <WorkflowStep
    id="dataset"
    title="数据集注册"
    :completed="steps.dataset.completed"
    :active="steps.dataset.active"
    icon="📊"
  >
    <DatasetRegistrationForm />
  </WorkflowStep>

  <WorkflowStep
    id="split"
    title="数据集切分"
    :completed="steps.split.completed"
    :active="steps.split.active"
    icon="✂️"
  >
    <DatasetSplitForm />
  </WorkflowStep>

  <!-- ... 其他步骤 ... -->
</WorkflowWizard>
```

**智能填充**
```javascript
// 基于上一步自动填充
watch(() => steps.dataset.value, (dataset) => {
  steps.split.value.dataset_id = dataset.id
  steps.split.value.dataset_version = dataset.version
  steps.experiment.value.dataset_id = dataset.id
  // ... 自动填充关联字段
})
```

**模板系统**
```javascript
const experimentTemplates = {
  rsi_phase_field: {
    name: 'RSI 相场模型',
    model_type: 'rsi_phase_field',
    metrics: ['auc', 'pr_auc', 'brier', 'ece'],
    description: '基于相场理论的岩性指标预测'
  },
  asi_ust: {
    name: 'ASI-UST 强度模型',
    model_type: 'asi_ust',
    metrics: ['auc', 'pr_auc', 'f1', 'mae'],
    description: '基于上覆岩层厚度的强度评估'
  },
  // ... 更多模板
}

// 自定义模板
function saveAsCustomTemplate(config) {
  const template = {
    id: generateId(),
    name: config.name,
    parameters: config.parameters,
    created_at: Date.now(),
    created_by: currentUser.id
  }
  userTemplates.push(template)
}
```

**批量操作**
```javascript
const experimentQueue = []

async function runBatch(template, variations) {
  variations.forEach(params => {
    experimentQueue.push({
      template,
      params,
      status: 'pending'
    })
  })
  processQueue()
}
```

#### 6.2.2 数据可视化增强

**实验结果卡片**
```vue
<ResultCard :result="experimentResult">
  <template #metrics>
    <MetricRow
      label="AUC"
      :value="result.metrics.auc"
      :ci="result.ci95.auc"
      :trend="compareWithPrevious(result.metrics.auc)"
    />
    <!-- ... 更多指标 ... -->
  </template>

  <template #actions>
    <button @click="viewDetails">查看详情</button>
    <button @click="exportResults">导出</button>
  </template>
</ResultCard>
```

**对比看板优化**
```vue
<TabGroup>
  <Tab label="散点图">
    <ScatterPlot
      :data="comparisonData"
      x-axis="auc"
      y-axis="pr_auc"
      :color-by="model_type"
    />
  </Tab>

  <Tab label="平行坐标">
    <ParallelCoordinates
      :data="comparisonData"
      :dimensions="['auc', 'pr_auc', 'f1', 'brier']"
    />
  </Tab>

  <Tab label="热力图矩阵">
    <HeatmapMatrix
      :rows="models"
      :columns="datasets"
      :values="auc_values"
    />
  </Tab>
</TabGroup>
```

**校准曲线**
```vue
<CalibrationPlot
  :predicted="probabilities"
  :actual="labels"
  :bins="10"
/>
```

**特征重要性**
```vue
<FeatureImportance
  :features="featureNames"
  :importance="featureWeights"
  :type="'bar' | 'beeswarm'"
/>
```

#### 6.2.3 可复现性强化

**实验追溯链**
```vue
<TraceabilityChain :experiment="experiment">
  <ChainNode type="dataset" :data="experiment.dataset">
    <DatasetInfo :manifest="experiment.dataset_manifest" />
  </ChainNode>

  <Arrow />

  <ChainNode type="split" :data="experiment.split">
    <SplitInfo :manifest="experiment.split_manifest" />
  </ChainNode>

  <Arrow />

  <ChainNode type="experiment" :data="experiment">
    <ExperimentInfo :result="experiment.result" />
  </ChainNode>
</TraceabilityChain>
```

**参数对比工具**
```vue
<ParameterDiff>
  <ParameterPanel :experiment="expA" title="实验 A" />
  <ParameterPanel :experiment="expB" title="实验 B" />
  <DiffHighlighter :a="expA.params" :b="expB.params" />
</ParameterDiff>
```

**版本标签**
```javascript
const tags = [
  { id: '1', name: 'v1.0', color: '#3b82f6' },
  { id: '2', name: 'final', color: '#22c55e' },
  { id: '3', name: 'paper-ready', color: '#f59e0b' }
]

function addTag(experimentId, tag) {
  experiments[experimentId].tags.push(tag)
}
```

**证据包自动生成**
```javascript
async function generateEvidenceBundle(experimentId) {
  const bundle = {
    // 数据
    'data/dataset_manifest.json': await loadManifest(datasetId),
    'data/split_manifest.json': await loadSplitManifest(splitId),

    // 配置
    'config/experiment_params.json': experiment.params,
    'config/model_config.json': model.config,

    // 结果
    'results/metrics.json': experiment.metrics,
    'results/calibration.json': experiment.calibration,
    'results/predictions.csv': predictions,

    // 可视化
    'figures/roc_curve.svg': generateROC(experiment),
    'figures/calibration_plot.svg': generateCalibration(experiment),
    'figures/confusion_matrix.svg': generateConfusion(experiment),

    // 文档
    'README.md': generateReadme(experiment),
    'METHODS.md': generateMethodsSection(experiment),
    'reproducibility_checklist.md': generateChecklist(experiment)
  }

  return downloadAsZip(bundle)
}
```

#### 6.2.4 性能优化

**后台任务系统**
```javascript
const taskQueue = []

function submitExperiment(config) {
  const taskId = generateId()
  taskQueue.push({
    id: taskId,
    config,
    status: 'pending',
    progress: 0
  })

  // 后台运行，不阻塞 UI
  runInBackground(taskId)

  return taskId
}

// WebSocket 实时推送进度
websocket.on('task_progress', (data) => {
  updateTaskProgress(data.taskId, data.progress)
})
```

**结果缓存**
```javascript
const cache = new Map()

function getCachedResult(cacheKey) {
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  return null
}

function setCachedResult(cacheKey, result) {
  cache.set(cacheKey, {
    result,
    timestamp: Date.now(),
    ttl: 3600000  // 1 hour
  })
}
```

**懒加载**
```vue
<VirtualList
  :items="experiments"
  :item-height="80"
  :buffer="200"
>
  <template #default="{ item }">
    <ExperimentCard :experiment="item" />
  </template>
</VirtualList>
```

### 6.3 布局设计

```
┌─────────────────────────────────────────────────────────────────┐
│ 顶部导航栏                                                        │
│ [Logo] 科研工作台 | 当前: 煤层A / 切分v1.2 / 实验rsi-001          │
│ [运行模板实验] [批量运行] [导出证据包] [设置] [帮助]              │
├─────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ 工作流程图                                                  │  │
│ │                                                            │  │
│ │  ①数据集 ✓ → ②切分 ✓ → ③实验 ⚡ → ④结果  → ⑤对比  → ⑥导出  │  │
│ │                                                            │  │
│ └───────────────────────────────────────────────────────────┘  │
├─────────────┬───────────────────────────────────────────────────┤
│ 左侧面板     │                                                    │
│             │            主内容区（Tab 切换）                    │
│ 📊 当前状态  │                                                    │
│ ┌───────────┐│  ┌──────────────────────────────────────────┐   │
│ │数据集: A  ││  │ Tab1: 配置与运行  Tab2: 结果分析           │   │
│ │切分: v1.2││  └──────────────────────────────────────────┘   │
│ │实验: 3个 ││                                                    │
│ └───────────┘│  [根据 Tab 显示不同内容]                         │
│             │                                                    │
│ 📁 数据集信息 │  Tab1 内容:                                        │
│ ┌───────────┐│  ┌─────────────────────────────────────────┐    │
│ │ID: demo  ││  │ 实验: rsi_phasefield_v1                    │    │
│ │版本: 1.2 ││  │                                             │    │
│ │行数: 5.2K││  │ [选择模板] [从最近加载] [从模板加载]         │    │
│ │列数: 45  ││  │                                             │    │
│ └───────────┘│  │ 参数配置:                                    │    │
│             ││  │  模型类型: [rsi_phase_field ▼]              │    │
│ 🧪 切分审计  ││  │  种子: [42]                                 │    │
│ ┌───────────┐│  │  指标: [auc, pr_auc, brier, ...]            │    │
│ │策略: block││  │                                             │    │
│ │泄漏: ✅   ││  │ [运行实验] [保存为模板] [重置]               │    │
│ │train/val: ││  └─────────────────────────────────────────┘    │
│ │0/0 overlap││                                                    │
│ └───────────┘│  Tab2 内容:                                        │
│             ││  [实验结果可视化 - 图表、统计、对比]              │
│ 🚀 实验队列  ││                                                    │
│ • exp_001   ││                                                    │
│   进行中 45%││                                                    │
│ • exp_002   ││                                                    │
│   等待中   ││                                                    │
│ • exp_003   ││                                                    │
│   等待中   ││                                                    │
├─────────────┤                                                    │
│ 右侧面板     │                                                    │
│             │                                                    │
│ 📜 最近实验  │                                                    │
│ • rsi-v1    │                                                    │
│ • asi-ust   │                                                    │
│ • baseline  │                                                    │
│             │                                                    │
│ 📦 实验模板  │                                                    │
│ • RSI 相场  │                                                    │
│ • ASI 强度  │                                                    │
│ • 基线对照  │                                                    │
│             │                                                    │
│ ⚡ 快捷操作  │                                                    │
│ [新建实验]  │                                                    │
│ [批量运行]  │                                                    │
│ [导出报告]  │                                                    │
└─────────────┴───────────────────────────────────────────────────┘
```

---

## 7. 跨页面整合

### 7.1 统一导航系统

**全局顶部导航栏**
```vue
<GlobalNav>
  <Logo />
  <NavMenu>
    <NavItem to="/geomodel-visualization">地质建模</NavItem>
    <NavItem to="/mpi-heatmap">MPI 模拟</NavItem>
    <NavItem to="/research-workbench">科研工作台</NavItem>
  </NavMenu>

  <QuickSwitcher>
    <QuickSelect label="煤层" :options="seams" v-model="currentSeam" />
    <QuickSelect label="任务" :options="jobs" v-model="currentJob" />
    <QuickSelect label="实验" :options="experiments" v-model="currentExperiment" />
  </QuickSwitcher>

  <UserMenu>
    <MenuItem>设置</MenuItem>
    <MenuItem>帮助</MenuItem>
    <MenuItem>文档</MenuItem>
  </UserMenu>
</GlobalNav>
```

**面包屑导航**
```vue
<Breadcrumb>
  <BreadcrumbItem to="/mpi-heatmap">MPI 模拟</BreadcrumbItem>
  <BreadcrumbItem to="/mpi-heatmap?seam=A">煤层 A</BreadcrumbItem>
  <BreadcrumbItem active>任务 123</BreadcrumbItem>
</Breadcrumb>
```

**全局搜索**
```vue
<GlobalSearch
  placeholder="搜索煤层、任务、实验 ID..."
  :search="globalSearch"
>
  <template #result="{ item }">
    <SearchResult
      :icon="item.type"
      :title="item.title"
      :subtitle="item.subtitle"
      :to="item.url"
    />
  </template>
</GlobalSearch>
```

### 7.2 数据流打通

**共享状态管理**
```javascript
// stores/useDataStore.js
export const useDataStore = defineStore('data', {
  state: () => ({
    currentSeam: '',
    currentJob: '',
    currentExperiment: '',
    seams: [],
    jobs: [],
    experiments: []
  }),

  actions: {
    async loadSeams() { /* ... */ },
    async loadJobs(seamId) { /* ... */ },
    setCurrentSeam(seamId) {
      this.currentSeam = seamId
      // 跨页面同步
      syncToUrl({ seam: seamId })
    }
  }
})
```

**URL 状态同步**
```javascript
// URL 参数示例
// /mpi-heatmap?seam=A&job=123&tab=combined&layers=contours,grid

function syncToUrl(params) {
  const query = new URLSearchParams(window.location.search)
  Object.entries(params).forEach(([key, value]) => {
    query.set(key, value)
  })
  window.history.replaceState({}, '', `${window.location.pathname}?${query}`)
}

function loadFromUrl() {
  const query = new URLSearchParams(window.location.search)
  return {
    seam: query.get('seam'),
    job: query.get('job'),
    tab: query.get('tab')
  }
}
```

**跨页面跳转**
```javascript
// 地质建模 → MPI 模拟
function jumpToMPI(jobId) {
  router.push({
    path: '/mpi-heatmap',
    query: {
      geomodel_job_id: jobId,
      seam: dataStore.currentSeam
    }
  })
}

// MPI 模拟 → 科研工作台
function jumpToWorkbench(datasetId) {
  router.push({
    path: '/research-workbench',
    query: {
      dataset_id: datasetId
    }
  })
}
```

### 7.3 统一设计规范

**设计 Token**
```javascript
// design-tokens.js
export const tokens = {
  color: { /* ... */ },
  spacing: { /* ... */ },
  typography: { /* ... */ },
  borderRadius: { /* ... */ },
  shadows: { /* ... */ }
}
```

**组件 Prop 规范**
```javascript
// 统一 Prop 命名
const commonProps = {
  // 数据
  data: Array,
  items: Array,
  value: [String, Number, Boolean, Object, Array],

  // 状态
  loading: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  error: String,

  // 尺寸
  size: {
    type: String,
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v)
  },

  // 样式
  class: [String, Object, Array],
  style: [String, Object, Array],

  // 事件
  onClick: Function,
  onChange: Function
}
```

---

## 8. 技术实施计划

### 8.1 阶段划分

#### 阶段 1：基础设施（1-2 周）

**目标**：搭建统一的设计系统和项目架构

**任务**：
1. ✅ 配置 Tailwind CSS 和设计 Token
2. ✅ 创建全局布局组件（导航栏、侧边栏、面包屑）
3. ✅ 建立 Pinia store 结构
4. ✅ 设置路由和权限系统
5. ✅ 配置 Vite 构建优化
6. ✅ 搭建组件开发文档系统

**交付物**：
- 设计系统文档（`docs/design-system.md`）
- 组件库骨架（`src/components/library/`）
- 全局布局（`src/layouts/`）
- Store 定义（`src/stores/`）

#### 阶段 2：组件库开发（2-3 周）

**目标**：开发 15-20 个核心共用组件

**优先级**：
**P0（必须）**：
- StatCard（统计卡片）
- DataTable（数据表格）
- Canvas3D（3D 画布容器）
- HeatmapWebGL（热力图）
- LoadingState（加载状态）
- Toolbar（工具栏）
- SidePanel（侧边面板）

**P1（重要）**：
- FilterPanel（筛选面板）
- PlaybackBar（播放控制）
- ChartContainer（图表容器）
- ColorLegend（颜色图例）
- ConfirmDialog（确认对话框）
- Toast（消息提示）

**P2（可选）**：
- VirtualList（虚拟列表）
- SplitPane（分屏组件）
- AnnotationTool（标注工具）

**交付物**：
- 组件库文档（`docs/components/`）
- 组件示例（Storybook 或单独页面）
- 单元测试（`tests/unit/components/`）

#### 阶段 3：页面优化（3-4 周，并行推进）

##### 3.1 地质建模页面（1.5 周）

**Week 1**：
- ✅ 升级 Three.js 渲染器（光照、阴影、材质）
- ✅ 实现相机控制（OrbitControls 配置）
- ✅ 添加预设视角切换
- ✅ 性能优化（LOD、视锥体裁剪、实例化）

**Week 2**：
- ✅ 实现剖切工具
- ✅ 实现测量工具
- ✅ 实现标注系统
- ✅ 升级质量仪表盘（雷达图）
- ✅ 钻孔详情面板
- ✅ 快照和导出功能

##### 3.2 MPI 模拟页面（1.5 周）

**Week 1**：
- ✅ WebGL 热力图渲染（Shader 编写）
- ✅ 多级纹理缓存
- ✅ 增量渲染
- ✅ 性能测试和优化

**Week 2**：
- ✅ 框选分析
- ✅ 时序回放增强
- ✅ 十字光标
- ✅ 分屏对比
- ✅ 统计图表（直方图）
- ✅ 地质约束叠加

##### 3.3 科研工作台页面（1 周）

**Week 1**：
- ✅ 流程图重构
- ✅ 智能填充
- ✅ 模板系统
- ✅ 实验结果卡片升级
- ✅ 对比看板（散点图、平行坐标）
- ✅ 证据包生成

#### 阶段 4：集成与测试（1-2 周）

**任务**：
1. ✅ 跨页面数据流测试
2. ✅ 性能测试（Lighthouse、WebPageTest）
3. ✅ 兼容性测试（Chrome、Firefox、Safari、Edge）
4. ✅ 用户验收测试（UAT）
5. ✅ Bug 修复和优化
6. ✅ 安全审查

**性能目标**：
- Lighthouse 性能分数 > 90
- 首次内容绘制（FCP）< 1.5s
- 最大内容绘制（LCP）< 2.5s
- 累积布局偏移（CLS）< 0.1
- 首次输入延迟（FID）< 100ms

#### 阶段 5：文档与部署（1 周）

**任务**：
1. ✅ 用户使用手册（`docs/user-guide.md`）
2. ✅ 开发者文档（`docs/developer-guide.md`）
3. ✅ API 文档（`docs/api/`）
4. ✅ 组件 Storybook
5. ✅ 生产环境部署配置
6. ✅ 监控和日志系统（Sentry、Analytics）
7. ✅ CI/CD 流程配置

### 8.2 技术栈确认

```json
{
  "framework": "Vue 3.4+",
  "language": "JavaScript (ES2022)",
  "build-tool": "Vite 5.0+",
  "state-management": "Pinia 2.1+",
  "router": "Vue Router 4.2+",
  "3d-rendering": "Three.js 0.160+",
  "2d-visualization": "D3.js 7.8+",
  "chart-library": "ECharts 5.4+",
  "styling": "Tailwind CSS 3.4+",
  "testing": "Vitest + Vue Test Utils",
  "linting": "ESLint + Prettier",
  "git-hooks": "Husky + lint-staged"
}
```

### 8.3 团队分工建议

```
前端开发 (2 人)
  └─ Dev A: 地质建模页面 + 3D 渲染
  └─ Dev B: MPI 模拟页面 + 科研工作台

全栈开发 (1 人)
  └─ Dev C: 组件库 + 性能优化 + 后端集成

UI/UX 设计 (1 人)
  └─ Designer: 设计系统 + 用户测试

测试工程师 (1 人)
  └─ QA: 功能测试 + 性能测试 + 用户验收

项目经理 (1 人)
  └─ PM: 需求管理 + 进度控制 + 协调
```

---

## 9. 风险与缓解

### 9.1 技术风险

**风险 1：WebGL 性能不达标**
- **影响**：热力图渲染卡顿
- **概率**：中
- **缓解措施**：
  - 提前进行性能测试（POC）
  - 准备降级方案（Canvas 2D）
  - 使用纹理压缩和 GPU 优化

**风险 2：Three.js 兼容性问题**
- **影响**：3D 模型无法正常显示
- **概率**：低
- **缓解措施**：
  - 锁定 Three.js 版本
  - 编写兼容性测试
  - 提供 WebGL 功能检测

**风险 3：状态管理复杂度**
- **影响**：跨页面数据同步错误
- **概率**：中
- **缓解措施**：
  - 简化 Store 结构
  - 使用 TypeScript 定义类型
  - 编写详细的 Store 文档

### 9.2 项目风险

**风险 4：时间延期**
- **影响**：无法按时交付
- **概率**：中
- **缓解措施**：
  - 设置里程碑检查点
  - 优先实现 P0 功能
  - 预留缓冲时间（1 周）

**风险 5：需求变更**
- **影响**：返工、延期
- **概率**：中
- **缓解措施**：
  - 需求评审和确认
  - 敏捷开发，快速迭代
  - 保持架构灵活性

---

## 10. 成功指标

### 10.1 性能指标
- ✅ Lighthouse 性能分数 > 90
- ✅ 首次加载时间 < 3s（3G 网络）
- ✅ 交互响应时间 < 100ms
- ✅ 3D 渲染帧率 > 60fps
- ✅ 热力图渲染帧率 > 60fps（1000×1000 网格）

### 10.2 用户体验指标
- ✅ 任务完成时间减少 30%（相对于当前版本）
- ✅ 用户满意度评分 > 4.5/5
- ✅ 错误率降低 50%
- ✅ 帮助文档查阅次数减少 40%

### 10.3 科研效率指标
- ✅ 实验运行效率提升 50%
- ✅ 数据分析时间减少 40%
- ✅ 报告生成时间从小时级降到分钟级
- ✅ 可复现性检查通过率 100%

---

## 11. 后续迭代

### 11.1 短期（3 个月内）
- 支持更多数据格式导入
- 添加更多可视化类型（3D 地质体渲染、时间序列动画）
- 协作功能（评论、分享、@提醒）
- 移动端适配（响应式优化）

### 11.2 中期（6 个月内）
- 机器学习模型集成（自动预测）
- 实时数据流处理（WebSocket 长连接）
- 云端部署和分布式计算
- 多语言支持（英文、中文）

### 11.3 长期（1 年内）
- VR/AR 支持（沉浸式 3D 交互）
- AI 辅助分析（异常检测、智能推荐）
- 与其他科研工具集成（Jupyter、MATLAB）
- 开源社区建设

---

## 12. 附录

### 12.1 参考资料
- Three.js 官方文档：https://threejs.org/docs/
- WebGL Fundamentals：https://webglfundamentals.org/
- Vue 3 官方文档：https://vuejs.org/
- Tailwind CSS 文档：https://tailwindcss.com/
- D3.js 文档：https://d3js.org/

### 12.2 设计文件
- Figma 设计稿：[链接]
- 组件 Storybook：[链接]
- 原型演示：[链接]

### 12.3 联系方式
- 技术负责人：[姓名]
- 产品经理：[姓名]
- 设计师：[姓名]

---

**文档版本**: v1.0
**最后更新**: 2026-02-15
**审核状态**: 待审核
