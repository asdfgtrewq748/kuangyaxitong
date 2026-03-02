<template>
  <div class="pressure-analysis-ultra" ref="pageRef">
    <!-- 顶部导航栏 -->
    <header class="top-nav-ultra">
      <div class="nav-brand">
        <button class="back-btn" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="brand-info">
          <h1 class="page-title">矿压数据分析</h1>
          <div class="workface-info">
            <span class="badge">02 工作面</span>
            <span class="date-range" v-if="dateRangeText">{{ dateRangeText }}</span>
          </div>
        </div>
      </div>

      <div class="nav-stats">
        <div class="stat-cards">
          <div class="stat-card">
            <span class="stat-label">均值</span>
            <span class="stat-value">{{ stats?.mean?.toFixed(2) || '--' }}</span>
            <span class="stat-unit">MPa</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">峰值</span>
            <span class="stat-value highlight">{{ stats?.max?.toFixed(2) || '--' }}</span>
            <span class="stat-unit">MPa</span>
          </div>
          <div class="stat-card warning" v-if="anomalyCount > 0">
            <span class="stat-label">异常</span>
            <span class="stat-value">{{ anomalyCount }}</span>
          </div>
        </div>
      </div>

      <div class="nav-actions">
        <button class="action-btn" @click="toggleLayout" title="切换布局">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
        </button>
        <button class="action-btn" @click="exportReport" title="导出报告">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
        <button class="action-btn primary" @click="toggleFullscreen" title="全屏">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content-ultra">
      <!-- 左侧控制面板 -->
      <aside class="control-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
        
        <div class="sidebar-content" v-show="!sidebarCollapsed">
          <!-- 数据筛选 -->
          <div class="control-section">
            <h4 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              数据筛选
            </h4>
            
            <div class="control-group">
              <label>柱类型</label>
              <select v-model="columnType" class="control-select">
                <option value="all">全部</option>
                <option value="front">前柱</option>
                <option value="rear">后柱</option>
              </select>
            </div>

            <div class="control-group">
              <label>日期范围</label>
              <div class="date-inputs">
                <input type="date" v-model="startDateStr" class="control-input" />
                <span>至</span>
                <input type="date" v-model="endDateStr" class="control-input" />
              </div>
            </div>

            <div class="control-group">
              <label>支架范围</label>
              <div class="range-inputs">
                <input type="number" v-model.number="supportStart" min="1" max="125" class="control-input" />
                <span>-</span>
                <input type="number" v-model.number="supportEnd" min="1" max="125" class="control-input" />
              </div>
            </div>
          </div>

          <!-- 阈值设置 -->
          <div class="control-section">
            <h4 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2v20M2 12h20"/>
              </svg>
              阈值设置
            </h4>
            
            <div class="control-group">
              <label>低压阈值: {{ lowThreshold }} MPa</label>
              <input type="range" v-model.number="lowThreshold" min="0" max="30" class="control-slider" />
            </div>

            <div class="control-group">
              <label>高压阈值: {{ highThreshold }} MPa</label>
              <input type="range" v-model.number="highThreshold" min="30" max="60" class="control-slider" />
            </div>
          </div>

          <!-- 显示选项 -->
          <div class="control-section">
            <h4 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              显示选项
            </h4>
            
            <div class="toggle-list">
              <label class="toggle-item">
                <input type="checkbox" v-model="showGrid" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">显示网格</span>
              </label>
              <label class="toggle-item">
                <input type="checkbox" v-model="showAnomalies" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">标记异常</span>
              </label>
              <label class="toggle-item">
                <input type="checkbox" v-model="showPeaks" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">显示峰值</span>
              </label>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="control-actions">
            <button class="btn-primary" @click="applyFilters">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              应用筛选
            </button>
            <button class="btn-secondary" @click="resetFilters">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/>
              </svg>
              重置
            </button>
          </div>
        </div>
      </aside>

      <!-- 中央可视化区 -->
      <section class="visualization-area">
        <!-- 热力图 -->
        <div class="heatmap-panel">
          <PressureHeatmapUltra
            panel-label="A"
            title="矿压强度热力图"
            :subtitle="heatmapSubtitle"
            :matrix="heatmapMatrix"
            :cells="heatmapCells"
            :stats="stats"
            :num-rows="numRows"
            :num-cols="numCols"
            :start-date="startDate"
            :end-date="endDate"
            :color-scale="colorScheme"
            :show-grid="showGrid"
            :loading="loading"
            :loading-progress="loadingProgress"
            @cell-select="onCellSelect"
            @export="onHeatmapExport"
            @scheme-change="onSchemeChange"
          />
        </div>

        <!-- 时间轴 -->
        <div class="timeline-panel">
          <PressureTimeSeriesUltra
            title="时序分析"
            :data="selectedSupportData"
            :support-id="selectedSupport"
            :show-peaks="showPeaks"
            :peaks="selectedSupportPeaks"
            :show-trend="true"
            :show-bands="true"
          />
        </div>
      </section>

      <!-- 右侧分析面板 -->
      <aside class="analysis-sidebar">
        <!-- KPI卡片 -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon" style="background: linear-gradient(135deg, #0072B2, #4da6e8);">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div class="kpi-data">
              <span class="kpi-value">{{ stats?.mean?.toFixed(2) || '--' }}</span>
              <span class="kpi-unit">MPa</span>
              <span class="kpi-label">平均值</span>
            </div>
          </div>
          
          <div class="kpi-card">
            <div class="kpi-icon" style="background: linear-gradient(135deg, #D55E00, #f5a623);">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <div class="kpi-data">
              <span class="kpi-value">{{ stats?.max?.toFixed(2) || '--' }}</span>
              <span class="kpi-unit">MPa</span>
              <span class="kpi-label">最大值</span>
            </div>
          </div>
          
          <div class="kpi-card">
            <div class="kpi-icon" style="background: linear-gradient(135deg, #009E73, #35B779);">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div class="kpi-data">
              <span class="kpi-value">{{ stats?.min?.toFixed(2) || '--' }}</span>
              <span class="kpi-unit">MPa</span>
              <span class="kpi-label">最小值</span>
            </div>
          </div>
          
          <div class="kpi-card" v-if="anomalyCount > 0">
            <div class="kpi-icon" style="background: linear-gradient(135deg, #CC79A7, #f5a623);">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="kpi-data">
              <span class="kpi-value warning">{{ anomalyCount }}</span>
              <span class="kpi-unit">个</span>
              <span class="kpi-label">异常点</span>
            </div>
          </div>
        </div>

        <!-- Nature导出面板 -->
        <NatureExportPanel 
          :charts="chartInstances"
          @export-complete="onExportComplete"
        />

        <!-- 标签页图表 -->
        <div class="chart-tabs-container">
          <div class="tabs-header">
            <button
              v-for="tab in chartTabs"
              :key="tab.id"
              :class="['tab-btn', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <span class="tab-icon">{{ tab.icon }}</span>
              <span class="tab-label">{{ tab.label }}</span>
            </button>
          </div>
          
          <div class="tabs-content">
            <Transition name="tab-slide" mode="out-in">
              <!-- 分布图 -->
              <div v-if="activeTab === 'hist'" key="hist" class="tab-panel">
                <PressureHistogramUltra
                  title="阻力分布直方图"
                  :data="histogramData"
                  :bins="30"
                />
              </div>

              <!-- 空间分布 -->
              <div v-else-if="activeTab === 'spatial'" key="spatial" class="tab-panel">
                <PressureSpatialDistUltra
                  title="空间分布"
                  :data="spatialDistData"
                />
              </div>

              <!-- 周期检测 -->
              <div v-else-if="activeTab === 'cycle'" key="cycle" class="tab-panel">
                <PressureCycleDetectUltra
                  title="周期检测"
                  :data="cycleData"
                  :periods="detectedPeriods"
                />
              </div>

              <!-- 相关性 -->
              <div v-else-if="activeTab === 'corr'" key="corr" class="tab-panel">
                <PressureCorrelationUltra
                  title="支架相关性"
                  :matrix="correlationMatrix"
                />
              </div>

              <!-- 对比 -->
              <div v-else-if="activeTab === 'compare'" key="compare" class="tab-panel">
                <PressureColumnCompareUltra
                  title="前后柱对比"
                  :front-data="frontColumnData"
                  :rear-data="rearColumnData"
                />
              </div>
            </Transition>
          </div>
        </div>
      </aside>
    </main>

    <!-- 底部状态栏 -->
    <footer class="status-bar-ultra">
      <div class="status-info">
        <div class="status-item">
          <span class="status-dot active"></span>
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
        <div class="status-divider"></div>
        <div class="status-item">
          <span class="status-label">选中支架</span>
          <span class="status-value highlight">#{{ selectedSupport }}</span>
        </div>
      </div>
      
      <div class="status-actions">
        <Transition name="fade">
          <div v-if="loading" class="loading-indicator">
            <div class="loading-spinner-sm"></div>
            <span>数据处理中...</span>
          </div>
        </Transition>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

// 导入优化后的组件
import PressureHeatmapUltra from '@/components/pressure/PressureHeatmapUltra.vue'
import PressureTimeSeriesUltra from '@/components/pressure/charts/PressureTimeSeriesUltra.vue'
import PressureHistogramUltra from '@/components/pressure/charts/PressureHistogramUltra.vue'
import PressureSpatialDistUltra from '@/components/pressure/charts/PressureSpatialDistUltra.vue'
import PressureCycleDetectUltra from '@/components/pressure/charts/PressureCycleDetectUltra.vue'
import PressureCorrelationUltra from '@/components/pressure/charts/PressureCorrelationUltra.vue'
import PressureColumnCompareUltra from '@/components/pressure/charts/PressureColumnCompareUltra.vue'
import NatureExportPanel from '@/components/pressure/NatureExportPanel.vue'

// 导入数据处理函数
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

const router = useRouter()
const pageRef = ref(null)

// ============================================================================
// 状态管理
// ============================================================================

const loading = ref(false)
const loadingProgress = ref(0)
const sidebarCollapsed = ref(false)
const activeTab = ref('hist')

// 控制参数
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
const rawData = ref([])
const aggregatedData = ref(new Map())
const heatmapMatrix = ref([])
const heatmapCells = ref([])
const numRows = ref(0)
const numCols = ref(125)
const stats = ref(null)
const anomalies = ref([])

// 选中状态
const selectedSupport = ref(22)
const selectedSupportData = ref([])
const selectedSupportPeaks = ref([])

// 标签页配置
// Chart instances for export
const chartInstances = ref([])

const chartTabs = [
  { id: 'hist', label: '分布', icon: '📊' },
  { id: 'spatial', label: '空间', icon: '🗺' },
  { id: 'cycle', label: '周期', icon: '🔄' },
  { id: 'corr', label: '相关', icon: '🔗' },
  { id: 'compare', label: '对比', icon: '⚖' }
]

// ============================================================================
// 计算属性
// ============================================================================

const startDateStr = computed({
  get: () => startDate.value.toISOString().split('T')[0],
  set: (val) => startDate.value = new Date(val)
})

const endDateStr = computed({
  get: () => endDate.value.toISOString().split('T')[0],
  set: (val) => endDate.value = new Date(val)
})

const dateRangeText = computed(() => {
  if (!startDate.value || !endDate.value) return ''
  const fmt = (d) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
  return `${fmt(startDate.value)} - ${fmt(endDate.value)}`
})

const heatmapSubtitle = computed(() => {
  return `${dateRangeText.value} · 支架 #${supportStart.value}-${supportEnd.value}`
})

const anomalyCount = computed(() => anomalies.value.length)
const dataPoints = computed(() => rawData.value.length)

// 直方图数据
const histogramData = computed(() => {
  if (!heatmapMatrix.value.length) return []
  const values = heatmapMatrix.value.flat().filter(Number.isFinite)
  return values
})

// 空间分布数据
const spatialDistData = computed(() => {
  if (!rawData.value.length) return []
  const grouped = groupBySupport(rawData.value)
  const data = []
  for (let i = supportStart.value; i <= supportEnd.value; i++) {
    const values = grouped.get(i) || []
    if (values.length) {
      data.push({
        supportId: i,
        mean: calculateStats(values).mean,
        count: values.length
      })
    }
  }
  return data
})

// 周期数据
const cycleData = computed(() => {
  if (!heatmapMatrix.value.length) return []
  const midCol = Math.floor(numCols.value / 2)
  return heatmapMatrix.value.map((row, i) => ({
    date: new Date(startDate.value.getTime() + i * 24 * 60 * 60 * 1000),
    value: row[midCol]
  }))
})

const detectedPeriods = computed(() => {
  if (!cycleData.value.length) return null
  const values = cycleData.value.map(d => d.value).filter(Number.isFinite)
  return detectPressureCycles(values)
})

// 相关性矩阵
const correlationMatrix = computed(() => {
  if (!heatmapMatrix.value.length) return null
  return calculateCorrelationMatrix(heatmapMatrix.value)
})

// 前后柱数据
const frontColumnData = computed(() => 
  rawData.value.filter(r => r.columnType === '前左柱')
)

const rearColumnData = computed(() => 
  rawData.value.filter(r => r.columnType === '后右柱')
)

// ============================================================================
// 方法
// ============================================================================

function goBack() {
  router.back()
}

function formatNumber(num) {
  if (!num) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function toggleLayout() {
  // 切换布局逻辑
}

function exportReport() {
  console.log('Exporting report...')
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    pageRef.value?.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function applyFilters() {
  loadData()
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
  loadData()
}

function onCellSelect(cell) {
  if (cell) {
    selectedSupport.value = cell.supportId
    updateSelectedSupportData()
  }
}

function onHeatmapExport() {
  console.log('Heatmap exported')
}

function onSchemeChange(scheme) {
  colorScheme.value = scheme
}

function onExportComplete(results) {
  console.log('Export completed:', results)
}

// 生成更真实的模拟数据
function generateMockData() {
  const mockData = []
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  
  // 添加一些周期性模式
  const cycleLength = 30 // 30天周期
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfCycle = Math.floor((d - start) / (24 * 60 * 60 * 1000)) % cycleLength
    const cycleFactor = Math.sin((dayOfCycle / cycleLength) * Math.PI * 2) * 0.3 + 1
    
    for (let s = supportStart.value; s <= supportEnd.value; s++) {
      // 基础值 + 位置相关 + 周期 + 随机噪声
      const baseValue = 20 + (s / supportEnd.value) * 15
      const positionFactor = Math.sin(s / 20) * 5
      const noise = (Math.random() - 0.5) * 10
      const value = Math.max(5, Math.min(60, 
        (baseValue + positionFactor) * cycleFactor + noise
      ))
      
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
  if (!rawData.value.length) return
  
  loading.value = true
  loadingProgress.value = 0
  
  // 模拟渐进式加载
  const steps = 5
  let currentStep = 0
  
  const processStep = () => {
    currentStep++
    loadingProgress.value = (currentStep / steps) * 100
    
    if (currentStep === 1) {
      aggregatedData.value = aggregateByDay(rawData.value, columnType.value)
    } else if (currentStep === 2) {
      const result = generateHeatmapMatrix(aggregatedData.value, {
        startDate: startDate.value,
        endDate: endDate.value,
        numSupports: supportEnd.value - supportStart.value + 1,
        supportStart: supportStart.value
      })
      heatmapMatrix.value = result.matrix
      heatmapCells.value = result.cells
      numRows.value = result.numRows
      numCols.value = result.numCols
      stats.value = result.stats
    } else if (currentStep === 3) {
      const values = rawData.value.map(r => r.finalResistanceValue)
      const anomalyResult = detectAnomalies(values, 2)
      anomalies.value = anomalyResult.indices.map(i => ({
        index: i,
        value: values[i]
      }))
    } else if (currentStep === 4) {
      updateSelectedSupportData()
    } else if (currentStep >= steps) {
      loading.value = false
      loadingProgress.value = 100
      return
    }
    
    setTimeout(processStep, 50)
  }
  
  processStep()
}

function updateSelectedSupportData() {
  const supportData = []
  const current = new Date(startDate.value)
  
  while (current <= endDate.value) {
    const dateKey = getDateKey(current)
    const dayData = aggregatedData.value.get(dateKey)
    
    if (dayData?.has(selectedSupport.value)) {
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

async function loadData() {
  loading.value = true
  try {
    generateMockData()
    processData()
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

// ============================================================================
// 生命周期
// ============================================================================

onMounted(() => {
  loadData()
})

watch([columnType, startDate, endDate, supportStart, supportEnd], () => {
  // 防抖处理
  const timeout = setTimeout(() => {
    // 可选：自动更新
  }, 500)
  return () => clearTimeout(timeout)
})
</script>

<style scoped>
.pressure-analysis-ultra {
  --nav-height: 64px;
  --status-height: 40px;
  --sidebar-width: 280px;
  --panel-gap: 16px;
  
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
}

/* Top Navigation */
.top-nav-ultra {
  height: var(--nav-height);
  background: white;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #525252;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #1a1a1a;
  color: white;
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.page-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.workface-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge {
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #525252;
}

.date-range {
  font-size: 12px;
  color: #737373;
}

.nav-stats {
  display: flex;
  align-items: center;
}

.stat-cards {
  display: flex;
  gap: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #f5f5f5;
  border-radius: 8px;
}

.stat-card.warning {
  background: #fef2f2;
}

.stat-label {
  font-size: 11px;
  font-weight: 500;
  color: #737373;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-value.highlight {
  color: #D55E00;
}

.stat-value.warning {
  color: #dc2626;
}

.stat-unit {
  font-size: 10px;
  color: #a3a3a3;
}

.nav-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #525252;
  transition: all 0.2s;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.action-btn.primary {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: white;
}

.action-btn.primary:hover {
  background: #333;
}

/* Main Content */
.main-content-ultra {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: var(--panel-gap);
  gap: var(--panel-gap);
}

/* Control Sidebar */
.control-sidebar {
  width: var(--sidebar-width);
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  transition: width 0.3s;
}

.control-sidebar.collapsed {
  width: 0;
  overflow: hidden;
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: white;
  border: 1px solid #e5e5e5;
  border-left: none;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 2px 0 8px rgba(0,0,0,0.06);
}

.sidebar-toggle svg {
  width: 14px;
  height: 14px;
  color: #737373;
  transition: transform 0.3s;
}

.control-sidebar.collapsed .sidebar-toggle svg {
  transform: rotate(180deg);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.control-section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-title svg {
  width: 14px;
  height: 14px;
  color: #525252;
}

.control-group {
  margin-bottom: 12px;
}

.control-group label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #525252;
  margin-bottom: 6px;
}

.control-select,
.control-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 12px;
  background: white;
  transition: all 0.2s;
}

.control-select:focus,
.control-input:focus {
  outline: none;
  border-color: #1a1a1a;
}

.date-inputs,
.range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-inputs span,
.range-inputs span {
  font-size: 11px;
  color: #737373;
}

.control-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: #e5e5e5;
  border-radius: 2px;
  outline: none;
}

.control-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #1a1a1a;
  border-radius: 50%;
  cursor: pointer;
}

.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toggle-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.toggle-item input {
  display: none;
}

.toggle-slider {
  width: 36px;
  height: 20px;
  background: #e5e5e5;
  border-radius: 10px;
  position: relative;
  transition: all 0.2s;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  left: 2px;
  top: 2px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.toggle-item input:checked + .toggle-slider {
  background: #1a1a1a;
}

.toggle-item input:checked + .toggle-slider::after {
  left: 18px;
}

.toggle-label {
  font-size: 12px;
  color: #525252;
}

.control-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #1a1a1a;
  border: none;
  color: white;
}

.btn-primary:hover {
  background: #333;
}

.btn-secondary {
  background: white;
  border: 1px solid #e5e5e5;
  color: #525252;
}

.btn-secondary:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.btn-primary svg,
.btn-secondary svg {
  width: 14px;
  height: 14px;
}

/* Visualization Area */
.visualization-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--panel-gap);
  min-width: 0;
}

.heatmap-panel {
  flex: 2;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  overflow: hidden;
  min-height: 0;
}

.timeline-panel {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  overflow: hidden;
  min-height: 200px;
}

/* Analysis Sidebar */
.analysis-sidebar {
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: var(--panel-gap);
  flex-shrink: 0;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.kpi-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon svg {
  width: 22px;
  height: 22px;
}

.kpi-data {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.kpi-value {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.kpi-value.warning {
  color: #dc2626;
}

.kpi-unit {
  font-size: 10px;
  font-weight: 500;
  color: #a3a3a3;
}

.kpi-label {
  font-size: 11px;
  color: #737373;
}

.chart-tabs-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.tabs-header {
  display: flex;
  gap: 4px;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #737373;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  background: #f5f5f5;
  color: #525252;
}

.tab-btn.active {
  background: #1a1a1a;
  color: white;
}

.tab-icon {
  font-size: 14px;
}

.tabs-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.tab-panel {
  height: 100%;
  padding: 12px;
}

.tab-slide-enter-active,
.tab-slide-leave-active {
  transition: all 0.3s ease;
}

.tab-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.tab-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Status Bar */
.status-bar-ultra {
  height: var(--status-height);
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #525252;
}

.status-dot.active {
  background: #22c55e;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-label {
  color: #a3a3a3;
}

.status-value {
  color: white;
  font-weight: 600;
}

.status-value.highlight {
  color: #4da6e8;
}

.status-divider {
  width: 1px;
  height: 16px;
  background: #404040;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #22c55e;
  font-size: 12px;
}

.loading-spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(34, 197, 94, 0.2);
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
