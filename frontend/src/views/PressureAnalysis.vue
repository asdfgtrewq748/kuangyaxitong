<template>
  <div class="pressure-analysis-page">
    <!-- 顶部导航 -->
    <nav class="top-nav">
      <div class="nav-left">
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
        </button>
        <h1 class="page-title">{{ pageTitle }}</h1>
        <span class="divider"></span>
        <span class="workface-label">02 Workface</span>
        <span class="date-range" v-if="dateRangeText">{{ dateRangeText }}</span>
      </div>
      <div class="nav-right">
        <span class="mini-stats" v-if="stats">
          <span>Mean <b>{{ stats.mean.toFixed(1) }}</b> MPa</span>
          <span>Max <b>{{ stats.max.toFixed(1) }}</b> MPa</span>
          <span class="warning" v-if="anomalyCount > 0">
            Anomalies <b>{{ anomalyCount }}</b>
          </span>
        </span>
        <button class="tool-btn" @click="exportAll">Export All</button>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 左侧控制面板 -->
      <aside class="control-panel">
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
      </aside>

      <!-- 中央热力图 -->
      <section class="heatmap-section">
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
      </section>

      <!-- 右侧统计面板 -->
      <aside class="stats-panel">
        <!-- KPI 卡片 -->
        <PressureKpiCards
          :stats="stats"
          :anomalies="anomalies"
          :peaks="peaks"
        />

        <!-- 图表标签页 -->
        <div class="chart-tabs">
          <button
            v-for="tab in chartTabs"
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 图表区域 -->
        <div class="chart-area">
          <!-- 时间序列图 -->
          <div v-show="activeTab === 'time'" class="chart-wrapper">
            <PressureTimeSeries
              :data="selectedSupportData"
              :support-id="selectedSupport"
              :show-peaks="showPeaks"
              :peaks="selectedSupportPeaks"
            />
          </div>

          <!-- 直方图 -->
          <div v-show="activeTab === 'hist'" class="chart-wrapper">
            <PressureHistogram
              :data="histogramData"
              :bins="30"
            />
          </div>

          <!-- 空间分布图 -->
          <div v-show="activeTab === 'spatial'" class="chart-wrapper">
            <PressureSpatialDist
              :data="spatialDistData"
            />
          </div>

          <!-- 周期检测图 -->
          <div v-show="activeTab === 'cycle'" class="chart-wrapper">
            <PressureCycleDetect
              :data="cycleData"
              :periods="detectedPeriods"
            />
          </div>

          <!-- 相关性矩阵 -->
          <div v-show="activeTab === 'corr'" class="chart-wrapper">
            <PressureCorrelation
              :matrix="correlationMatrix"
            />
          </div>

          <!-- 前后柱对比 -->
          <div v-show="activeTab === 'compare'" class="chart-wrapper">
            <PressureColumnCompare
              :front-data="frontColumnData"
              :rear-data="rearColumnData"
            />
          </div>
        </div>
      </aside>
    </main>

    <!-- 底部状态栏 -->
    <footer class="status-bar">
      <span class="status-item">
        <span class="status-label">Data:</span>
        <span class="status-value">{{ dataPoints }} points</span>
      </span>
      <span class="status-item">
        <span class="status-label">Period:</span>
        <span class="status-value">{{ dateRangeText }}</span>
      </span>
      <span class="status-item">
        <span class="status-label">Supports:</span>
        <span class="status-value">{{ supportStart }}-{{ supportEnd }}</span>
      </span>
      <span class="status-item" v-if="loading">
        <span class="loading-indicator">Loading...</span>
      </span>
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
  loadRawData,
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

const pageTitle = 'Mine Pressure Data Analysis'

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
  { id: 'time', label: 'Time' },
  { id: 'hist', label: 'Dist' },
  { id: 'spatial', label: 'Spatial' },
  { id: 'cycle', label: 'Cycle' },
  { id: 'corr', label: 'Corr' },
  { id: 'compare', label: 'Compare' }
]

// ============================================================================
// Computed
// ============================================================================

const dateRangeText = computed(() => {
  if (!startDate.value || !endDate.value) return ''
  const fmt = (d) => {
    const date = new Date(d)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }
  return `${fmt(startDate.value)} ~ ${fmt(endDate.value)}`
})

const anomalyCount = computed(() => anomalies.value.length)

const dataPoints = computed(() => rawData.value.length)

// 直方图数据
const histogramData = computed(() => {
  if (!heatmapMatrix.value || heatmapMatrix.value.length === 0) return []
  const values = heatmapMatrix.value.flat().filter(v => Number.isFinite(v))

  // 计算直方图
  const min = Math.min(...values)
  const max = Math.max(...values)
  const binWidth = (max - min) / 30
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

  // 取中间支架的数据
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

async function loadData() {
  loading.value = true

  try {
    // 在实际应用中，这里应该从 API 或文件加载数据
    // 目前使用模拟数据
    // const response = await fetch('/data/kuangya/末阻力数据1-9 (2).csv')
    // const csvContent = await response.text()
    // rawData.value = loadRawData(csvContent)

    // 模拟数据用于演示
    generateMockData()
    processData()
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

function generateMockData() {
  // 生成模拟数据用于开发测试
  const mockData = []
  const start = new Date('2025-01-01')
  const end = new Date('2025-09-30')

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    for (let s = 1; s <= 125; s++) {
      // 生成带有一定规律的阻力值
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

  // 聚合数据
  aggregatedData.value = aggregateByDay(rawData.value, columnType.value)

  // 生成热力图矩阵
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

  // 检测异常
  const values = rawData.value.map(r => r.finalResistanceValue)
  const anomalyResult = detectAnomalies(values, 2)
  anomalies.value = anomalyResult.indices.map(i => ({
    index: i,
    value: values[i]
  }))

  // 更新选中支架的时间序列
  updateSelectedSupportData()
}

function updateSelectedSupportData() {
  const supportData = []
  const current = new Date(startDate.value)

  while (current <= endDate.value) {
    const dateKey = getDateKey(current)
    const dayData = aggregatedData.value.get(dateKey)

    if (dayData && dayData.has(selectedSupport.value)) {
      const stats = dayData.get(selectedSupport.value)
      supportData.push({
        date: new Date(current),
        value: stats.mean,
        std: stats.std
      })
    }

    current.setDate(current.getDate() + 1)
  }

  selectedSupportData.value = supportData

  // 检测峰值
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
  // 导出所有图表为 PDF
  console.log('Exporting all charts...')
}

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
  loadData()
})

// 监听筛选条件变化
watch([columnType, startDate, endDate, supportStart, supportEnd], () => {
  // 自动更新（可选）
  // processData()
})
</script>

<style scoped>
.pressure-analysis-page {
  --nav-height: 48px;
  --status-height: 28px;
  --panel-width: 220px;
  --stats-width: 320px;

  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-size: 8pt;
}

/* 顶部导航 */
.top-nav {
  height: var(--nav-height);
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background: #f1f5f9;
}

.back-icon {
  font-size: 16px;
  color: #64748b;
}

.page-title {
  margin: 0;
  font-size: 11pt;
  font-weight: 600;
  color: #1e293b;
}

.divider {
  width: 1px;
  height: 20px;
  background: #e2e8f0;
}

.workface-label {
  font-size: 8pt;
  color: #64748b;
  padding: 4px 8px;
  background: #f1f5f9;
  border-radius: 4px;
}

.date-range {
  font-size: 8pt;
  color: #64748b;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mini-stats {
  display: flex;
  gap: 16px;
  font-size: 8pt;
  color: #64748b;
}

.mini-stats b {
  color: #1e293b;
  font-weight: 600;
}

.mini-stats .warning {
  color: #ef4444;
}

.mini-stats .warning b {
  color: #ef4444;
}

.tool-btn {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 4px;
  font-size: 8pt;
  color: #64748b;
  cursor: pointer;
}

.tool-btn:hover {
  background: #f1f5f9;
  border-color: #0f766e;
  color: #0f766e;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.control-panel {
  width: var(--panel-width);
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
}

.heatmap-section {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.stats-panel {
  width: var(--stats-width);
  background: #ffffff;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 图表标签页 */
.chart-tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 8px;
  background: #fafafa;
}

.tab-btn {
  padding: 8px 12px;
  border: none;
  background: transparent;
  font-size: 7pt;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
}

.tab-btn:hover {
  color: #0f766e;
}

.tab-btn.active {
  color: #0f766e;
  border-bottom-color: #0f766e;
  font-weight: 600;
}

/* 图表区域 */
.chart-area {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.chart-wrapper {
  min-height: 180px;
}

/* 底部状态栏 */
.status-bar {
  height: var(--status-height);
  background: #1e293b;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 24px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 7pt;
}

.status-label {
  color: #64748b;
}

.status-value {
  color: #ffffff;
}

.loading-indicator {
  color: #22c55e;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
