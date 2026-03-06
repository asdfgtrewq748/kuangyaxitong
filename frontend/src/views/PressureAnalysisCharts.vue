<template>
  <div class="pressure-charts-page">
    <header class="page-header">
      <button class="back-btn" @click="goBack" title="返回矿压分析">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div class="title-wrap">
        <h1>矿压图表中心</h1>
        <p>将高密度图表与科研导出工具迁移到独立子页面，避免主页面拥挤。</p>
      </div>
      <button class="ghost-btn" @click="goBack">返回主分析页</button>
    </header>

    <section v-if="snapshotError" class="empty-card">
      <h3>暂无可用图表数据</h3>
      <p>{{ snapshotError }}</p>
      <button class="ghost-btn" @click="goBack">回到矿压分析并生成数据</button>
    </section>

    <template v-else>
      <section class="summary-grid">
        <article class="summary-card">
          <span class="label">时间范围</span>
          <strong>{{ context.dateRangeText || '--' }}</strong>
        </article>
        <article class="summary-card">
          <span class="label">支架范围</span>
          <strong>#{{ context.supportStart }} - #{{ context.supportEnd }}</strong>
        </article>
        <article class="summary-card">
          <span class="label">均值 / 峰值</span>
          <strong>{{ statsLabel }}</strong>
        </article>
        <article class="summary-card">
          <span class="label">异常点</span>
          <strong>{{ context.anomalyCount ?? 0 }}</strong>
        </article>
      </section>

      <section class="chart-workspace">
        <div class="tabs-header">
          <button
            v-for="tab in chartTabs"
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>

        <div class="tabs-content">
          <Transition name="tab-slide" mode="out-in">
            <div v-if="activeTab === 'hist'" key="hist" class="tab-panel">
              <LazyChart height="420px" :loading="!histogramData.length">
                <PressureHistogramUltra ref="histogramRef" title="阻力分布直方图" :data="histogramData" :bins="30" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'spatial'" key="spatial" class="tab-panel">
              <LazyChart height="420px" :loading="!spatialDistData.length">
                <PressureSpatialDistUltra ref="spatialRef" title="空间分布" :data="spatialDistData" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'cycle'" key="cycle" class="tab-panel">
              <LazyChart height="420px" :loading="!cycleData.length">
                <PressureCycleDetectUltra ref="cycleRef" title="周期检测" :data="cycleData" :periods="detectedPeriods" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'corr'" key="corr" class="tab-panel">
              <LazyChart height="420px" :loading="!correlationMatrix">
                <PressureCorrelationUltra ref="correlationRef" title="支架相关性" :matrix="correlationMatrix" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'compare'" key="compare" class="tab-panel">
              <LazyChart height="420px" :loading="!frontColumnData.length && !rearColumnData.length">
                <PressureColumnCompareUltra ref="compareRef" title="前后柱对比" :front-data="frontColumnData" :rear-data="rearColumnData" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'boxplot'" key="boxplot" class="tab-panel">
              <LazyChart height="420px" :loading="!rawData.length">
                <PressureBoxPlot ref="boxplotRef" panel-label="C" title="压力分布箱线图" subtitle="Box Plot Analysis" :data="rawData" time-range="day" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'cdf'" key="cdf" class="tab-panel">
              <LazyChart height="420px" :loading="!rawData.length">
                <PressureCDF ref="cdfRef" panel-label="D" title="累计分布函数" subtitle="Cumulative Distribution" :data="rawData" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'spectral'" key="spectral" class="tab-panel">
              <LazyChart height="420px" :loading="!selectedSupportData.length">
                <PressureSpectral ref="spectralRef" panel-label="E" title="频谱分析" subtitle="Spectral Analysis" :data="selectedSupportData" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'scatter'" key="scatter" class="tab-panel">
              <LazyChart height="420px" :loading="!rawData.length">
                <PressureScatterMatrix ref="scatterRef" panel-label="F" title="多支架相关性矩阵" subtitle="Scatter Plot Matrix" :data="rawData" :support-ids="[1, 25, 50, 75, 100, 125]" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'anomaly'" key="anomaly" class="tab-panel">
              <LazyChart height="420px" :loading="!heatmapMatrix.length">
                <AnomalyHeatmap ref="anomalyRef" panel-label="G" title="异常分布热力图" subtitle="Anomaly Detection Map" :matrix="heatmapMatrix" :stats="stats" :threshold="2.0" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'radar'" key="radar" class="tab-panel">
              <LazyChart height="420px" :loading="!selectedSupportData.length">
                <PressureRadar ref="radarRef" panel-label="H" title="压力特征雷达图" subtitle="Multi-dimensional Analysis" :data="selectedSupportData" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'density'" key="density" class="tab-panel">
              <LazyChart height="420px" :loading="!rawData.length">
                <PressureDensity ref="densityRef" panel-label="I" title="核密度估计" subtitle="Kernel Density Estimation" :data="rawData" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'contour'" key="contour" class="tab-panel">
              <LazyChart height="420px" :loading="!heatmapMatrix.length">
                <PressureContour ref="contourRef" panel-label="J" title="压力等值线图" subtitle="Contour Map" :matrix="heatmapMatrix" :num-supports="numRows" :levels="12" />
              </LazyChart>
            </div>
          </Transition>
        </div>
      </section>

      <section class="tool-grid">
        <NatureExportPanel :charts="chartInstances" @export-complete="onExportComplete" />
        <ResearchPanel :data="researchData" @palette-change="onResearchPaletteChange" @export-request="onResearchExport" />
      </section>

      <section class="methodology-wrap">
        <MethodologyPanel />
      </section>
    </template>

    <Transition name="toast">
      <div v-if="toast.show" class="toast-notification">{{ toast.message }}</div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import PressureHistogramUltra from '@/components/pressure/charts/PressureHistogramUltra.vue'
import PressureSpatialDistUltra from '@/components/pressure/charts/PressureSpatialDistUltra.vue'
import PressureCycleDetectUltra from '@/components/pressure/charts/PressureCycleDetectUltra.vue'
import PressureCorrelationUltra from '@/components/pressure/charts/PressureCorrelationUltra.vue'
import PressureColumnCompareUltra from '@/components/pressure/charts/PressureColumnCompareUltra.vue'
import PressureBoxPlot from '@/components/pressure/charts/PressureBoxPlot.vue'
import PressureCDF from '@/components/pressure/charts/PressureCDF.vue'
import PressureSpectral from '@/components/pressure/charts/PressureSpectral.vue'
import PressureScatterMatrix from '@/components/pressure/charts/PressureScatterMatrix.vue'
import AnomalyHeatmap from '@/components/pressure/charts/AnomalyHeatmap.vue'
import PressureRadar from '@/components/pressure/charts/PressureRadar.vue'
import PressureDensity from '@/components/pressure/charts/PressureDensity.vue'
import PressureContour from '@/components/pressure/charts/PressureContour.vue'

import NatureExportPanel from '@/components/pressure/NatureExportPanel.vue'
import ResearchPanel from '@/components/pressure/ResearchPanel.vue'
import MethodologyPanel from '@/components/pressure/MethodologyPanel.vue'
import LazyChart from '@/components/common/LazyChart.vue'

const CHART_CENTER_SNAPSHOT_KEY = 'pressure_analysis_chart_snapshot_v1'

const router = useRouter()
const snapshot = ref(null)
const snapshotError = ref('')
const activeTab = ref('hist')
const chartInstances = ref([])
const toast = ref({ show: false, message: '' })
let toastTimer = null

const histogramRef = ref(null)
const spatialRef = ref(null)
const cycleRef = ref(null)
const correlationRef = ref(null)
const compareRef = ref(null)
const boxplotRef = ref(null)
const cdfRef = ref(null)
const spectralRef = ref(null)
const scatterRef = ref(null)
const anomalyRef = ref(null)
const radarRef = ref(null)
const densityRef = ref(null)
const contourRef = ref(null)

const chartTabs = [
  { id: 'hist', label: '分布' },
  { id: 'spatial', label: '空间' },
  { id: 'cycle', label: '周期' },
  { id: 'corr', label: '相关' },
  { id: 'compare', label: '对比' },
  { id: 'boxplot', label: '箱线' },
  { id: 'cdf', label: '累计' },
  { id: 'spectral', label: '频谱' },
  { id: 'scatter', label: '矩阵' },
  { id: 'anomaly', label: '异常' },
  { id: 'radar', label: '雷达' },
  { id: 'density', label: '密度' },
  { id: 'contour', label: '等值线' }
]

function toDateOrNull(raw) {
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

function toFiniteNumber(raw, fallback = 0) {
  const num = Number(raw)
  return Number.isFinite(num) ? num : fallback
}

function decodeRawRows(rows = []) {
  return rows
    .map((row) => {
      if (Array.isArray(row)) {
        const [supportId, value, dateIso, columnType] = row
        const date = toDateOrNull(dateIso)
        const finalResistanceValue = toFiniteNumber(value, Number.NaN)
        return {
          supportId: toFiniteNumber(supportId, 0),
          finalResistanceValue,
          value: finalResistanceValue,
          cycleStartTime: date,
          date,
          columnType: String(columnType || '')
        }
      }

      const date = toDateOrNull(row?.cycleStartTime || row?.date)
      const finalResistanceValue = toFiniteNumber(row?.finalResistanceValue ?? row?.value, Number.NaN)
      return {
        ...row,
        supportId: toFiniteNumber(row?.supportId, 0),
        finalResistanceValue,
        value: finalResistanceValue,
        cycleStartTime: date,
        date,
        columnType: String(row?.columnType || '')
      }
    })
    .filter((row) => Number.isFinite(row.finalResistanceValue))
}

function decodeSeriesRows(rows = []) {
  return rows
    .map((row) => {
      if (Array.isArray(row)) {
        const [dateIso, value, std] = row
        return {
          date: toDateOrNull(dateIso),
          value: toFiniteNumber(value, Number.NaN),
          std: toFiniteNumber(std, 0)
        }
      }
      return {
        ...row,
        date: toDateOrNull(row?.date),
        value: toFiniteNumber(row?.value ?? row?.finalResistanceValue, Number.NaN),
        std: toFiniteNumber(row?.std, 0)
      }
    })
    .filter((row) => Number.isFinite(row.value))
}

const context = computed(() => snapshot.value?.context || {})
const datasets = computed(() => snapshot.value?.datasets || {})

const rawData = computed(() => decodeRawRows(datasets.value.rawData || []))
const heatmapMatrix = computed(() => datasets.value.heatmapMatrix || [])
const numRows = computed(() => Number(datasets.value.numRows || 0))
const stats = computed(() => datasets.value.stats || null)
const histogramData = computed(() => {
  if (Array.isArray(datasets.value.histogramData) && datasets.value.histogramData.length) {
    return datasets.value.histogramData
  }
  return heatmapMatrix.value.flat().filter(Number.isFinite)
})
const spatialDistData = computed(() => {
  if (Array.isArray(datasets.value.spatialDistData) && datasets.value.spatialDistData.length) {
    return datasets.value.spatialDistData
  }
  if (!rawData.value.length) return []

  const start = Number(context.value.supportStart || 1)
  const end = Number(context.value.supportEnd || 125)
  const grouped = new Map()

  for (const row of rawData.value) {
    const id = Number(row.supportId)
    if (!Number.isFinite(id) || id < start || id > end) continue
    if (!grouped.has(id)) grouped.set(id, [])
    grouped.get(id).push(Number(row.finalResistanceValue))
  }

  return Array.from(grouped.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([supportId, values]) => ({
      supportId,
      mean: values.reduce((sum, value) => sum + value, 0) / values.length,
      count: values.length
    }))
})
const cycleData = computed(() => {
  const rows = datasets.value.cycleData || []
  if (rows.length) {
    return rows.map((item) => ({
      ...item,
      date: toDateOrNull(item?.date)
    }))
  }

  if (!heatmapMatrix.value.length) return []
  const firstRow = heatmapMatrix.value[0] || []
  if (!firstRow.length) return []

  const midCol = Math.floor(firstRow.length / 2)
  const start = toDateOrNull(context.value.startDateIso)

  return heatmapMatrix.value.map((row, index) => ({
    date: start ? new Date(start.getTime() + index * 24 * 60 * 60 * 1000) : null,
    value: Number(row[midCol])
  }))
})
const detectedPeriods = computed(() => datasets.value.detectedPeriods || null)
const correlationMatrix = computed(() => datasets.value.correlationMatrix || null)
const frontColumnData = computed(() => {
  if (Array.isArray(datasets.value.frontColumnData) && datasets.value.frontColumnData.length) {
    return datasets.value.frontColumnData
  }
  return rawData.value.filter((row) => /前|front/i.test(row.columnType || ''))
})
const rearColumnData = computed(() => {
  if (Array.isArray(datasets.value.rearColumnData) && datasets.value.rearColumnData.length) {
    return datasets.value.rearColumnData
  }
  return rawData.value.filter((row) => /后|rear/i.test(row.columnType || ''))
})
const selectedSupportData = computed(() => {
  const rows = datasets.value.selectedSupportData || []
  if (rows.length) return decodeSeriesRows(rows)

  const selectedSupport = Number(context.value.selectedSupport || 0)
  if (!selectedSupport) return []
  return rawData.value
    .filter((row) => Number(row.supportId) === selectedSupport)
    .sort((a, b) => (a.date?.getTime?.() || 0) - (b.date?.getTime?.() || 0))
    .map((row) => ({
      date: row.date || null,
      value: Number(row.finalResistanceValue),
      std: 0
    }))
})

const researchData = computed(() => snapshot.value?.researchData || {
  heatmapMatrix: heatmapMatrix.value,
  stats: stats.value,
  dateRange: context.value.dateRangeText || '--',
  supportRange: `#${context.value.supportStart || '--'} - #${context.value.supportEnd || '--'}`,
  rawData: rawData.value
})

const statsLabel = computed(() => {
  const s = stats.value
  if (!s) return '--'
  return `${Number(s.mean || 0).toFixed(2)} / ${Number(s.max || 0).toFixed(2)} MPa`
})

function collectChartInstances() {
  const refs = [
    histogramRef.value,
    spatialRef.value,
    cycleRef.value,
    correlationRef.value,
    compareRef.value,
    boxplotRef.value,
    cdfRef.value,
    spectralRef.value,
    scatterRef.value,
    anomalyRef.value,
    radarRef.value,
    densityRef.value,
    contourRef.value
  ]
  chartInstances.value = refs.map((item) => item?.getChartInstance?.()).filter(Boolean)
}

function showToast(message) {
  toast.value = { show: true, message }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 1800)
}

function onExportComplete(results) {
  const successCount = (results || []).filter((r) => r?.success).length
  showToast(`已导出 ${successCount} 张图表`)
}

function onResearchPaletteChange(palette) {
  showToast(`已切换配色：${palette?.name || '默认'}`)
}

function onResearchExport(config) {
  showToast(`导出请求：${String(config?.format || 'png').toUpperCase()} / ${config?.dpi || 300} DPI`)
}

function goBack() {
  router.push({ name: 'PressureAnalysis' })
}

function loadSnapshot() {
  snapshotError.value = ''
  try {
    const raw = window.sessionStorage?.getItem?.(CHART_CENTER_SNAPSHOT_KEY)
    if (!raw) {
      snapshotError.value = '请先在矿压数据分析页完成数据加载，再进入图表中心。'
      snapshot.value = null
      return
    }

    const parsed = JSON.parse(raw)
    if (!parsed?.datasets?.rawData?.length) {
      snapshotError.value = '当前快照没有可用数据，请返回主分析页刷新后重试。'
      snapshot.value = null
      return
    }

    snapshot.value = parsed
  } catch {
    snapshotError.value = '图表快照读取失败，请返回主分析页重新进入。'
    snapshot.value = null
  }
}

watch(activeTab, async () => {
  await nextTick()
  collectChartInstances()
})

onMounted(async () => {
  loadSnapshot()
  await nextTick()
  collectChartInstances()
})

onBeforeUnmount(() => {
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }
})
</script>

<style scoped>
.pressure-charts-page {
  display: grid;
  gap: 12px;
  padding: 12px;
}

.page-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
}

.back-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.title-wrap h1 {
  margin: 0;
  font-size: 20px;
  color: #111827;
}

.title-wrap p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #4b5563;
}

.ghost-btn {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #1f2937;
  font-size: 12px;
  height: 34px;
  padding: 0 12px;
  cursor: pointer;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.summary-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  display: grid;
  gap: 5px;
}

.summary-card .label {
  font-size: 11px;
  color: #6b7280;
}

.summary-card strong {
  font-size: 14px;
  color: #111827;
}

.chart-workspace {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  gap: 4px;
  padding: 10px;
  border-bottom: 1px solid #f1f5f9;
  overflow-x: auto;
}

.tab-btn {
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #475569;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  cursor: pointer;
  white-space: nowrap;
}

.tab-btn.active {
  background: #111827;
  color: #fff;
}

.tabs-content {
  min-height: 450px;
}

.tab-panel {
  padding: 12px;
}

.tool-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: start;
}

.methodology-wrap {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px;
}

.empty-card {
  background: #fff;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 16px;
  display: grid;
  gap: 8px;
}

.empty-card h3 {
  margin: 0;
  color: #0f172a;
}

.empty-card p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.tab-slide-enter-active,
.tab-slide-leave-active {
  transition: all 0.25s ease;
}

.tab-slide-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.tab-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.toast-notification {
  position: fixed;
  top: 86px;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: #fff;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  z-index: 9999;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
}

@media (max-width: 1280px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .tool-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .page-header {
    grid-template-columns: auto 1fr;
  }

  .page-header .ghost-btn {
    grid-column: 1 / -1;
  }
}
</style>
