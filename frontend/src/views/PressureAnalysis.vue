<template>
  <div class="pressure-analysis-page">
    <!-- 顶部导航 -->
    <header class="top-nav">
      <div class="nav-left">
        <button class="back-btn" @click="goBack" :aria-label="'返回'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <div class="title-group">
          <h1 class="page-title">{{ pageTitle }}</h1>
          <div class="title-meta">
            <span class="workface-badge">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="12" height="12" rx="2"/>
              </svg>
              02 工作面
            </span>
            <span class="date-range" v-if="dateRangeText">{{ dateRangeText }}</span>
          </div>
        </div>
      </div>

      <div class="nav-center">
        <div class="live-stats" v-if="stats">
          <div class="stat-pill">
            <span class="stat-label">均值</span>
            <span class="stat-value">{{ stats.mean.toFixed(1) }}</span>
            <span class="stat-unit">MPa</span>
          </div>
          <div class="stat-pill">
            <span class="stat-label">峰值</span>
            <span class="stat-value">{{ stats.max.toFixed(1) }}</span>
            <span class="stat-unit">MPa</span>
          </div>
          <div class="stat-pill danger" v-if="anomalyCount > 0">
            <span class="stat-label">异常</span>
            <span class="stat-value">{{ anomalyCount }}</span>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <button class="nav-action" @click="toggleFullscreen" :title="'全屏'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
          </svg>
        </button>
        <button class="nav-action primary" @click="exportAll">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          <span>导出</span>
        </button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 左侧控制面板 -->
      <aside class="control-panel" :class="{ collapsed: controlPanelCollapsed }">
        <div class="panel-toggle" @click="controlPanelCollapsed = !controlPanelCollapsed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
        <div class="panel-content" v-show="!controlPanelCollapsed">
          <PressureControlPanel
            v-model:columnType="columnType"
            v-model:startDate="startDate"
            v-model:endDate="endDate"
            v-model:lowThreshold="lowThreshold"
            v-model:highThreshold="highThreshold"
            v-model:supportStart="supportStart"
            v-model:supportEnd="supportEnd"
            v-model:showGrid="showGrid"
            v-model:showAnomalies="showAnomalies"
            v-model:showPeaks="showPeaks"
            v-model:colorScheme="colorScheme"
            :stats="stats"
            @apply="applyFilters"
            @reset="resetFilters"
          />
        </div>
      </aside>

      <!-- 中央热力图 -->
      <section class="heatmap-section">
        <div class="heatmap-container">
          <PressureHeatmap
            :matrix="heatmapMatrix"
            :cells="heatmapCells"
            :stats="stats"
            :num-rows="numRows"
            :num-cols="numCols"
            :start-date="startDate"
            :end-date="endDate"
            :loading="loading"
            :color-scale="colorScheme"
            :show-grid="showGrid"
            @cell-select="onCellSelect"
            @export="onHeatmapExport"
          />
        </div>
      </section>

      <!-- 右侧统计面板 -->
      <aside class="stats-panel">
        <!-- KPI 卡片 -->
        <div class="kpi-section">
          <PressureKpiCards
            :stats="stats"
            :anomalies="anomalies"
            :peaks="peaks"
          />
        </div>

        <!-- 图表标签页 -->
        <div class="chart-tabs">
          <button
            v-for="(tab, index) in chartTabs"
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>

        <!-- 图表区域 -->
        <div class="chart-area">
          <TransitionGroup name="chart-fade" tag="div" class="chart-container">
            <!-- 时间序列图 -->
            <div v-if="activeTab === 'time'" key="time" class="chart-wrapper">
              <PressureTimeSeries
                :data="selectedSupportData"
                :support-id="selectedSupport"
                :show-peaks="showPeaks"
                :peaks="selectedSupportPeaks"
              />
            </div>

            <!-- 直方图 -->
            <div v-if="activeTab === 'hist'" key="hist" class="chart-wrapper">
              <PressureHistogram :data="histogramData" :bins="30" />
            </div>

            <!-- 空间分布图 -->
            <div v-if="activeTab === 'spatial'" key="spatial" class="chart-wrapper">
              <PressureSpatialDist :data="spatialDistData" />
            </div>

            <!-- 周期检测图 -->
            <div v-if="activeTab === 'cycle'" key="cycle" class="chart-wrapper">
              <PressureCycleDetect :data="cycleData" :periods="detectedPeriods" />
            </div>

            <!-- 相关性矩阵 -->
            <div v-if="activeTab === 'corr'" key="corr" class="chart-wrapper">
              <PressureCorrelation :matrix="correlationMatrix" />
            </div>

            <!-- 前后柱对比 -->
            <div v-if="activeTab === 'compare'" key="compare" class="chart-wrapper">
              <PressureColumnCompare
                :front-data="frontColumnData"
                :rear-data="rearColumnData"
              />
            </div>
          </TransitionGroup>
        </div>
      </aside>
    </main>

    <!-- 底部状态栏 -->
    <footer class="status-bar">
      <div class="status-left">
        <div class="status-item">
          <span class="status-dot"></span>
          <span class="status-label">数据点</span>
          <span class="status-value">{{ formatNumber(dataPoints) }}</span>
        </div>
        <div class="status-divider"></div>
        <div class="status-item">
          <span class="status-label">时间跨度</span>
          <span class="status-value">{{ dateRangeText }}</span>
        </div>
        <div class="status-divider"></div>
        <div class="status-item">
          <span class="status-label">支架范围</span>
          <span class="status-value">#{{ supportStart }} - #{{ supportEnd }}</span>
        </div>
      </div>
      <div class="status-right">
        <Transition name="fade">
          <div v-if="loading" class="loading-status">
            <span class="loading-spinner"></span>
            <span>数据加载中...</span>
          </div>
        </Transition>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

// 组件导入
import PressureControlPanel from '@/components/pressure/PressureControlPanel.vue'
import PressureHeatmap from '@/components/pressure/PressureHeatmap.vue'
import PressureKpiCards from '@/components/pressure/charts/PressureKpiCards.vue'
import PressureTimeSeries from '@/components/pressure/charts/PressureTimeSeries.vue'
import PressureHistogram from '@/components/pressure/charts/PressureHistogram.vue'
import PressureSpatialDist from '@/components/pressure/charts/PressureSpatialDist.vue'
import PressureCycleDetect from '@/components/pressure/charts/PressureCycleDetect.vue'
import PressureCorrelation from '@/components/pressure/charts/PressureCorrelation.vue'
import PressureColumnCompare from '@/components/pressure/charts/PressureColumnCompare.vue'

// 数据处理模块
import {
  aggregateByDay,
  generateHeatmapMatrix,
  calculateStats,
  detectPressureCycles,
  detectAnomalies,
  calculateCorrelationMatrix,
  groupBySupport,
  getDateKey
} from '@/utils/pressureDataProcessor'

// ============================================================================
// Router
// ============================================================================

const router = useRouter()

function goBack() {
  router.back()
}

// ============================================================================
// 状态
// ============================================================================

const pageTitle = '矿压数据分析'
const controlPanelCollapsed = ref(false)

// 控制面板状态
const columnType = ref('all')
const startDate = ref(new Date('2025-01-01'))
const endDate = ref(new Date('2025-09-30'))
const lowThreshold = ref(10)
const highThreshold = ref(45)
const supportStart = ref(1)
const supportEnd = ref(125)
const showGrid = ref(false)
const showAnomalies = ref(false)
const showPeaks = ref(false)
const colorScheme = ref('diverging')

// 数据状态
const loading = ref(false)
const rawData = ref([])
const aggregatedData = ref(new Map())
const heatmapMatrix = ref([])
const heatmapCells = ref([])
const numRows = ref(0)
const numCols = ref(125)
const stats = ref(null)
const anomalies = ref([])
const peaks = ref([])

// 选中状态
const selectedSupport = ref(22)
const selectedSupportData = ref([])
const selectedSupportPeaks = ref([])

// 图表标签页
const activeTab = ref('time')
const chartTabs = [
  { id: 'time', label: '时序', icon: '📈' },
  { id: 'hist', label: '分布', icon: '📊' },
  { id: 'spatial', label: '空间', icon: '🗺' },
  { id: 'cycle', label: '周期', icon: '🔄' },
  { id: 'corr', label: '相关', icon: '🔗' },
  { id: 'compare', label: '对比', icon: '⚖' }
]

// ============================================================================
// Computed
// ============================================================================

const dateRangeText = computed(() => {
  if (!startDate.value || !endDate.value) return ''
  const fmt = (d) => {
    const date = new Date(d)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`
  }
  return `${fmt(startDate.value)} - ${fmt(endDate.value)}`
})

const anomalyCount = computed(() => anomalies.value.length)

const dataPoints = computed(() => rawData.value.length)

// 直方图数据
const histogramData = computed(() => {
  if (!heatmapMatrix.value || heatmapMatrix.value.length === 0) return []
  const values = heatmapMatrix.value.flat().filter(v => Number.isFinite(v))
  if (values.length === 0) return []

  const min = Math.min(...values)
  const max = Math.max(...values)
  const binWidth = (max - min) / 30 || 1
  const bins = Array(30).fill(0)

  values.forEach(v => {
    const binIndex = Math.min(29, Math.floor((v - min) / binWidth))
    bins[binIndex]++
  })

  return bins.map((count, i) => ({
    start: min + i * binWidth,
    end: min + (i + 1) * binWidth,
    count
  }))
})

// 空间分布数据
const spatialDistData = computed(() => {
  if (!rawData.value || rawData.value.length === 0) return []

  const grouped = groupBySupport(rawData.value)
  const data = []

  for (let i = supportStart.value; i <= supportEnd.value; i++) {
    const values = grouped.get(i) || []
    if (values.length > 0) {
      data.push({
        supportId: i,
        mean: calculateStats(values).mean,
        count: values.length
      })
    }
  }

  return data
})

// 周期检测数据
const cycleData = computed(() => {
  if (!heatmapMatrix.value || heatmapMatrix.value.length === 0) return []

  const midCol = Math.floor(numCols.value / 2)
  return heatmapMatrix.value.map((row, i) => ({
    date: new Date(startDate.value.getTime() + i * 24 * 60 * 60 * 1000),
    value: row[midCol]
  }))
})

const detectedPeriods = computed(() => {
  if (!cycleData.value || cycleData.value.length === 0) return null

  const values = cycleData.value.map(d => d.value).filter(v => Number.isFinite(v))
  return detectPressureCycles(values)
})

// 相关性矩阵
const correlationMatrix = computed(() => {
  if (!heatmapMatrix.value || heatmapMatrix.value.length === 0) return null
  return calculateCorrelationMatrix(heatmapMatrix.value)
})

// 前后柱对比数据
const frontColumnData = computed(() => {
  return rawData.value.filter(r => r.columnType === '前左柱')
})

const rearColumnData = computed(() => {
  return rawData.value.filter(r => r.columnType === '后右柱')
})

// ============================================================================
// Methods
// ============================================================================

function formatNumber(num) {
  if (!num) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

async function loadData() {
  loading.value = true

  try {
    generateMockData()
    processData()
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

function generateMockData() {
  const mockData = []
  const start = new Date('2025-01-01')
  const end = new Date('2025-09-30')

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    for (let s = 1; s <= 125; s++) {
      const baseValue = 25 + Math.sin(s / 20) * 10
      const noise = (Math.random() - 0.5) * 15
      const value = Math.max(0, Math.min(60, baseValue + noise))

      mockData.push({
        workFaceName: '02工作面',
        supportId: s,
        columnType: s % 2 === 0 ? '前左柱' : '后右柱',
        cycleStartTime: new Date(d),
        cycleEndTime: new Date(d.getTime() + 10 * 60 * 1000),
        finalResistanceTime: new Date(d),
        finalResistanceValue: value
      })
    }
  }

  rawData.value = mockData
}

function processData() {
  if (!rawData.value || rawData.value.length === 0) return

  aggregatedData.value = aggregateByDay(rawData.value, columnType.value)

  const result = generateHeatmapMatrix(aggregatedData.value, {
    startDate: startDate.value,
    endDate: endDate.value,
    numSupports: supportEnd.value - supportStart.value + 1
  })

  heatmapMatrix.value = result.matrix
  heatmapCells.value = result.cells
  numRows.value = result.numRows
  numCols.value = result.numCols
  stats.value = result.stats

  const values = rawData.value.map(r => r.finalResistanceValue)
  const anomalyResult = detectAnomalies(values, 2)
  anomalies.value = anomalyResult.indices.map(i => ({
    index: i,
    value: values[i]
  }))

  updateSelectedSupportData()
}

function updateSelectedSupportData() {
  const supportData = []
  const current = new Date(startDate.value)

  while (current <= endDate.value) {
    const dateKey = getDateKey(current)
    const dayData = aggregatedData.value.get(dateKey)

    if (dayData && dayData.has(selectedSupport.value)) {
      const cellStats = dayData.get(selectedSupport.value)
      supportData.push({
        date: new Date(current),
        value: cellStats.mean,
        std: cellStats.std
      })
    }

    current.setDate(current.getDate() + 1)
  }

  selectedSupportData.value = supportData

  const values = supportData.map(d => d.value)
  const cycleResult = detectPressureCycles(values)
  selectedSupportPeaks.value = cycleResult.peakIndices || []
}

function applyFilters() {
  processData()
}

function resetFilters() {
  columnType.value = 'all'
  startDate.value = new Date('2025-01-01')
  endDate.value = new Date('2025-09-30')
  lowThreshold.value = 10
  highThreshold.value = 45
  supportStart.value = 1
  supportEnd.value = 125
  showGrid.value = false
  showAnomalies.value = false
  showPeaks.value = false
  colorScheme.value = 'diverging'

  processData()
}

function onCellSelect(cell) {
  if (cell) {
    selectedSupport.value = cell.supportId
    updateSelectedSupportData()
    activeTab.value = 'time'
  }
}

function onHeatmapExport() {
  console.log('Heatmap exported')
}

function exportAll() {
  console.log('Exporting all charts...')
}

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
  loadData()
})

watch([columnType, startDate, endDate, supportStart, supportEnd], () => {
  // 自动更新（可选）
})
</script>

<style scoped>
/* ============================================================================
   压力分析页面 - 优化版
   ============================================================================ */

.pressure-analysis-page {
  /* 布局变量 */
  --nav-height: 56px;
  --status-height: 32px;
  --panel-width: 240px;
  --stats-width: 360px;
  --transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);

  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-secondary, #fafafa);
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  overflow: hidden;

  /* 页面进入动画 */
  animation: pageEnter 0.5s var(--transition-smooth);
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================================================
   顶部导航
   ============================================================================ */

.top-nav {
  height: var(--nav-height);
  background: var(--bg-primary, #ffffff);
  border-bottom: 1px solid var(--border-color, #e5e5e5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  animation: navSlideDown 0.4s var(--transition-smooth);
}

@keyframes navSlideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--bg-tertiary, #f5f5f5);
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #525252);
  transition: all 0.2s var(--transition-smooth);
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.back-btn:hover {
  background: var(--color-primary, #1a1a1a);
  color: var(--text-inverted, #ffffff);
  transform: translateX(-2px);
}

.back-btn:active {
  transform: translateX(0) scale(0.95);
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #171717);
  letter-spacing: -0.01em;
}

.title-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.workface-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary, #525252);
  padding: 3px 8px;
  background: var(--bg-tertiary, #f5f5f5);
  border-radius: 4px;
}

.workface-badge svg {
  width: 12px;
  height: 12px;
  opacity: 0.6;
}

.date-range {
  font-size: 12px;
  color: var(--text-tertiary, #737373);
  font-weight: 500;
}

/* 中间实时统计 */
.nav-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.live-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--bg-tertiary, #f5f5f5);
  border-radius: 20px;
  font-size: 12px;
  transition: all 0.2s var(--transition-smooth);
}

.stat-pill:hover {
  background: var(--border-color, #e5e5e5);
}

.stat-pill.danger {
  background: var(--color-error-bg, #fef2f2);
}

.stat-pill.danger .stat-value {
  color: var(--color-error, #dc2626);
}

.stat-label {
  color: var(--text-tertiary, #737373);
  font-weight: 500;
}

.stat-value {
  color: var(--text-primary, #171717);
  font-weight: 700;
}

.stat-unit {
  color: var(--text-muted, #a3a3a3);
  font-size: 10px;
  font-weight: 500;
}

/* 右侧操作按钮 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid var(--border-color, #e5e5e5);
  background: var(--bg-primary, #ffffff);
  border-radius: var(--radius-md, 8px);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary, #525252);
  cursor: pointer;
  transition: all 0.2s var(--transition-smooth);
}

.nav-action svg {
  width: 16px;
  height: 16px;
}

.nav-action:hover {
  border-color: var(--color-primary, #1a1a1a);
  color: var(--color-primary, #1a1a1a);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.nav-action.primary {
  background: var(--color-primary, #1a1a1a);
  border-color: var(--color-primary, #1a1a1a);
  color: var(--text-inverted, #ffffff);
}

.nav-action.primary:hover {
  background: var(--color-primary-hover, #333333);
  border-color: var(--color-primary-hover, #333333);
  color: var(--text-inverted, #ffffff);
}

/* ============================================================================
   主内容区
   ============================================================================ */

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

/* 控制面板 */
.control-panel {
  width: var(--panel-width);
  background: var(--bg-primary, #ffffff);
  border-right: 1px solid var(--border-color, #e5e5e5);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.3s var(--transition-smooth);
  animation: panelSlideRight 0.5s var(--transition-smooth) 0.1s backwards;
}

@keyframes panelSlideRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.control-panel.collapsed {
  width: 0;
  overflow: hidden;
}

.panel-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: var(--bg-primary, #ffffff);
  border: 1px solid var(--border-color, #e5e5e5);
  border-left: none;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s var(--transition-smooth);
}

.panel-toggle svg {
  width: 14px;
  height: 14px;
  color: var(--text-tertiary, #737373);
  transition: transform 0.3s var(--transition-smooth);
}

.control-panel.collapsed .panel-toggle svg {
  transform: rotate(180deg);
}

.panel-toggle:hover {
  background: var(--bg-tertiary, #f5f5f5);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 热力图区域 */
.heatmap-section {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  animation: contentFadeIn 0.6s var(--transition-smooth) 0.2s backwards;
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.heatmap-container {
  flex: 1;
  background: var(--bg-primary, #ffffff);
  border-radius: var(--radius-lg, 12px);
  border: 1px solid var(--border-color, #e5e5e5);
  overflow: hidden;
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.06));
}

/* 统计面板 */
.stats-panel {
  width: var(--stats-width);
  background: var(--bg-primary, #ffffff);
  border-left: 1px solid var(--border-color, #e5e5e5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: panelSlideLeft 0.5s var(--transition-smooth) 0.15s backwards;
}

@keyframes panelSlideLeft {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.kpi-section {
  padding: 12px;
  border-bottom: 1px solid var(--border-color, #e5e5e5);
}

/* 图表标签页 */
.chart-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 12px;
  background: var(--bg-secondary, #fafafa);
  border-bottom: 1px solid var(--border-color, #e5e5e5);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-tertiary, #737373);
  cursor: pointer;
  transition: all 0.2s var(--transition-smooth);
  animation: tabFadeIn 0.4s var(--transition-smooth) backwards;
}

@keyframes tabFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-icon {
  font-size: 12px;
}

.tab-btn:hover {
  background: var(--bg-tertiary, #f5f5f5);
  color: var(--text-secondary, #525252);
}

.tab-btn.active {
  background: var(--color-primary, #1a1a1a);
  color: var(--text-inverted, #ffffff);
}

/* 图表区域 */
.chart-area {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.chart-wrapper {
  padding: 12px;
  min-height: 200px;
}

/* 图表切换动画 */
.chart-fade-enter-active {
  transition: all 0.3s var(--transition-smooth);
}

.chart-fade-leave-active {
  transition: all 0.2s var(--transition-smooth);
}

.chart-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.chart-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ============================================================================
   底部状态栏
   ============================================================================ */

.status-bar {
  height: var(--status-height);
  background: var(--color-gray-800, #262626);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  animation: statusSlideUp 0.4s var(--transition-smooth) 0.2s backwards;
}

@keyframes statusSlideUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: var(--color-success, #16a34a);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-divider {
  width: 1px;
  height: 12px;
  background: var(--color-gray-600, #525252);
}

.status-label {
  color: var(--color-gray-400, #a3a3a3);
}

.status-value {
  color: var(--text-inverted, #ffffff);
  font-weight: 600;
}

.status-right {
  display: flex;
  align-items: center;
}

.loading-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--color-success, #16a34a);
}

.loading-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(22, 163, 74, 0.2);
  border-top-color: var(--color-success, #16a34a);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s var(--transition-smooth);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ============================================================================
   响应式布局
   ============================================================================ */

@media (max-width: 1200px) {
  .control-panel {
    width: 200px;
  }

  .stats-panel {
    width: 300px;
  }

  .nav-center {
    display: none;
  }
}

@media (max-width: 900px) {
  .control-panel {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 50;
    box-shadow: var(--shadow-lg, 0 12px 28px rgba(0, 0, 0, 0.12));
  }

  .control-panel.collapsed {
    width: 0;
    box-shadow: none;
  }

  .stats-panel {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .stats-panel {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 50;
    box-shadow: var(--shadow-lg, 0 12px 28px rgba(0, 0, 0, 0.12));
    transform: translateX(100%);
    transition: transform 0.3s var(--transition-smooth);
  }

  .heatmap-section {
    padding: 8px;
  }
}
</style>
