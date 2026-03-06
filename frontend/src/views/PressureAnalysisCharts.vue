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
      <div class="header-actions">
        <PaperExportMenu
          trigger-label="论文导出"
          main-label="导出当前主图"
          pack-label="导出补充图包"
          loading-main-label="主图导出中..."
          loading-pack-label="打包中..."
          main-hint="当前标签高分辨率图"
          pack-hint="全标签 PNG/SVG + 图注 + 清单"
          :disabled-main="Boolean(snapshotError)"
          :disabled-pack="Boolean(snapshotError)"
          :loading-main="exportingMain"
          :loading-pack="exportingPack"
          @export-main="exportMainFigure"
          @export-pack="exportSupplementPackage"
        />
        <button class="ghost-btn" @click="goBack">返回主分析页</button>
      </div>
    </header>

    <section v-if="snapshotError" class="empty-card">
      <h3>暂无可用图表数据</h3>
      <p>{{ snapshotError }}</p>
      <button class="ghost-btn" @click="goBack">回到矿压分析并生成数据</button>
    </section>

    <template v-else>
      <section class="publication-frame">
        <div class="figure-heading-band">
          <span class="figure-kicker">{{ paperFrame.heading }}</span>
          <h2>{{ paperFrame.title }}</h2>
          <p>{{ paperFrame.summary }}</p>
        </div>
        <div class="publication-summary-grid">
          <article v-for="item in paperFrame.cards" :key="item.label" class="publication-summary-card">
            <span class="label">{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>
        <p class="methods-footer">{{ paperFrame.methodsFooter }}</p>
      </section>

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

      <section class="active-figure-caption">
        <div class="caption-head">
          <span class="caption-kicker">{{ activeFigureMeta.figureId }}</span>
          <h3>{{ activeFigureMeta.figureTitle }}</h3>
        </div>
        <p class="caption-summary">{{ activeFigureMeta.figureSummary }}</p>
        <div class="caption-notes">
          <span><strong>Unit:</strong> {{ activeFigureMeta.unit }}</span>
          <span><strong>Notes:</strong> {{ activeFigureMeta.figureNotes }}</span>
        </div>
        <p class="methods-footer">{{ activeFigureMeta.methodsFooter }}</p>
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
import PaperExportMenu from '@/components/common/PaperExportMenu.vue'
import { exportECharts } from '@/utils/figureExport'
import { buildCaptionsMarkdown, buildPaperFigure, buildPaperManifest } from '@/utils/paperExportSchema'

const CHART_CENTER_SNAPSHOT_KEY = 'pressure_analysis_chart_snapshot_v1'

const router = useRouter()
const snapshot = ref(null)
const snapshotError = ref('')
const activeTab = ref('hist')
const chartInstances = ref([])
const toast = ref({ show: false, message: '' })
const exportingMain = ref(false)
const exportingPack = ref(false)
let toastTimer = null
let jsZipCtor = null

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
const activeTabLabel = computed(() => chartTabs.find((tab) => tab.id === activeTab.value)?.label || '--')
const chartPaperMeta = computed(() => ({
  hist: {
    figureId: 'Figure C1',
    figureTitle: 'Resistance distribution histogram',
    figureSummary: 'Histogram plate resolving the empirical resistance envelope and dominant occupancy range across the selected support interval.',
    figureCaption: 'Histogram of support resistance values, used to assess central tendency, spread, and occupancy of the dominant loading regime.',
    figureNotes: 'Bars summarize pooled support resistance samples; visual emphasis is on spread and dominant mode.',
    unit: 'MPa',
    methodsFooter: 'Methods footer: pooled resistance samples are binned into histogram form from the chart-center snapshot.'
  },
  spatial: {
    figureId: 'Figure C2',
    figureTitle: 'Support-wise spatial resistance profile',
    figureSummary: 'Support-mean resistance plate highlighting along-face spatial gradients and local concentration zones.',
    figureCaption: 'Spatial distribution of mean support resistance along the working face, used to identify structured loading gradients.',
    figureNotes: 'Each support is aggregated over the selected period.',
    unit: 'MPa',
    methodsFooter: 'Methods footer: support means are derived from the decoded raw resistance series in the active snapshot.'
  },
  cycle: {
    figureId: 'Figure C3',
    figureTitle: 'Periodicity detection plate',
    figureSummary: 'Cycle plate isolating recurrent loading fluctuations and candidate periodic structure in the selected series.',
    figureCaption: 'Cycle-detection view of resistance evolution, used to identify periodic loading signatures and recurrence intervals.',
    figureNotes: 'Periods are estimated from the series provided by the active snapshot.',
    unit: 'MPa',
    methodsFooter: 'Methods footer: temporal sequence is read from cycle-ready snapshot data or reconstructed from the heatmap midline.'
  },
  corr: {
    figureId: 'Figure C4',
    figureTitle: 'Inter-support correlation matrix',
    figureSummary: 'Matrix plate quantifying co-variation between supports to reveal coherent pressure-transfer neighborhoods.',
    figureCaption: 'Correlation matrix of support resistance, used to identify coherent clusters and mechanically coupled segments.',
    figureNotes: 'Matrix entries summarize pairwise similarity between supports.',
    unit: 'Correlation coefficient',
    methodsFooter: 'Methods footer: pairwise correlation coefficients are sourced from the chart-center snapshot.'
  },
  compare: {
    figureId: 'Figure C5',
    figureTitle: 'Front-versus-rear column comparison',
    figureSummary: 'Comparative plate separating front and rear column response to expose asymmetry in loading allocation.',
    figureCaption: 'Comparison between front and rear column resistance, used to diagnose asymmetric support behavior.',
    figureNotes: 'Front and rear subsets are decoded from column labels in the snapshot.',
    unit: 'MPa',
    methodsFooter: 'Methods footer: front and rear column groups are split from raw decoded pressure rows.'
  },
  boxplot: {
    figureId: 'Figure C6',
    figureTitle: 'Resistance distribution box plot',
    figureSummary: 'Distribution plate emphasizing quartiles, median shift, and tail behavior without histogram binning bias.',
    figureCaption: 'Box-plot view of resistance distribution, used to summarize quartiles, median, and outlier structure.',
    figureNotes: 'Quartile-based summary complements the histogram plate.',
    unit: 'MPa',
    methodsFooter: 'Methods footer: box-plot statistics are computed directly from raw resistance values.'
  },
  cdf: {
    figureId: 'Figure C7',
    figureTitle: 'Cumulative distribution function',
    figureSummary: 'CDF plate reporting percentile accumulation and threshold occupancy across the resistance range.',
    figureCaption: 'Cumulative distribution of resistance values, used to read percentile thresholds and coverage levels.',
    figureNotes: 'Useful for threshold-based operational interpretation.',
    unit: 'Cumulative probability',
    methodsFooter: 'Methods footer: cumulative proportions are estimated from sorted raw resistance samples.'
  },
  spectral: {
    figureId: 'Figure C8',
    figureTitle: 'Spectral energy decomposition',
    figureSummary: 'Frequency-domain plate isolating dominant oscillatory content in the selected support time series.',
    figureCaption: 'Spectral analysis of the selected support series, used to identify dominant loading frequencies.',
    figureNotes: 'Interpreted jointly with the cycle-detection plate.',
    unit: 'Spectral power',
    methodsFooter: 'Methods footer: frequency-domain decomposition is computed from the selected support time series.'
  },
  scatter: {
    figureId: 'Figure C9',
    figureTitle: 'Multi-support scatter matrix',
    figureSummary: 'Pairwise scatter plate screening nonlinear association and clustering between representative supports.',
    figureCaption: 'Scatter-matrix view for representative supports, used to assess linear and nonlinear joint patterns.',
    figureNotes: 'Representative support IDs are fixed for cross-tab comparability.',
    unit: 'MPa',
    methodsFooter: 'Methods footer: scatter pairs are assembled from synchronized support-level resistance values.'
  },
  anomaly: {
    figureId: 'Figure C10',
    figureTitle: 'Anomaly heatmap',
    figureSummary: 'Anomaly plate localizing departures from typical loading behavior in support-time space.',
    figureCaption: 'Heatmap of anomalous resistance departures, used to localize abnormal loading in support-time coordinates.',
    figureNotes: 'Thresholding follows the anomaly settings of the chart center.',
    unit: 'Standardized anomaly score',
    methodsFooter: 'Methods footer: anomaly scores are visualized from the heatmap matrix with the active threshold convention.'
  },
  radar: {
    figureId: 'Figure C11',
    figureTitle: 'Multidimensional pressure radar',
    figureSummary: 'Radar plate condensing multiple pressure features into a compact comparative profile.',
    figureCaption: 'Radar summary of multidimensional pressure features, used to compare composite response structure.',
    figureNotes: 'Best interpreted as a relative feature profile rather than absolute magnitude.',
    unit: 'Normalized feature score',
    methodsFooter: 'Methods footer: radar axes are derived from feature engineering over the selected support data.'
  },
  density: {
    figureId: 'Figure C12',
    figureTitle: 'Kernel density estimate',
    figureSummary: 'Smoothed density plate resolving modal structure without dependence on fixed histogram bins.',
    figureCaption: 'Kernel-density estimate of resistance values, used to assess multimodality and smooth occupancy structure.',
    figureNotes: 'KDE complements the histogram and box-plot views.',
    unit: 'Density',
    methodsFooter: 'Methods footer: kernel density is estimated from raw resistance samples in the active snapshot.'
  },
  contour: {
    figureId: 'Figure C13',
    figureTitle: 'Resistance contour map',
    figureSummary: 'Contour plate summarizing continuous spatial resistance morphology and gradient structure.',
    figureCaption: 'Contour map of resistance intensity, used to read smooth spatial gradients and coherent high-load zones.',
    figureNotes: 'Contour levels are generated from the heatmap matrix in support-space coordinates.',
    unit: 'MPa',
    methodsFooter: 'Methods footer: contour levels are interpolated from the resistance heatmap matrix.'
  },
}))
const activeFigureMeta = computed(() => chartPaperMeta.value[activeTab.value] || {
  figureId: 'Figure C0',
  figureTitle: activeTabLabel.value,
  figureSummary: 'Active chart metadata unavailable.',
  figureCaption: 'Active chart metadata unavailable.',
  figureNotes: 'No additional notes.',
  unit: '--',
  methodsFooter: 'Methods footer: metadata unavailable.'
})
const paperFrame = computed(() => ({
  heading: 'Figure Set | Pressure chart center',
  title: 'Figure-ready pressure analytics plates',
  summary: `A consolidated plate workspace for mining-pressure diagnostics across ${context.value?.dateRangeText || '--'}, covering supports #${context.value?.supportStart || '--'}-${context.value?.supportEnd || '--'}.`,
  cards: [
    { label: 'Primary evidence', value: statsLabel.value },
    { label: 'Active plate', value: activeTabLabel.value },
    { label: 'Anomaly count', value: String(context.value?.anomalyCount ?? 0) },
  ],
  methodsFooter: `Methods footer: derived from the pressure-analysis snapshot using support-wise resistance series, spatial heatmap matrices, and ECharts publication exports; current plate ${activeTabLabel.value}.`,
}))

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

const resolveChartRefByTab = (tabId) => {
  const map = {
    hist: histogramRef.value,
    spatial: spatialRef.value,
    cycle: cycleRef.value,
    corr: correlationRef.value,
    compare: compareRef.value,
    boxplot: boxplotRef.value,
    cdf: cdfRef.value,
    spectral: spectralRef.value,
    scatter: scatterRef.value,
    anomaly: anomalyRef.value,
    radar: radarRef.value,
    density: densityRef.value,
    contour: contourRef.value
  }
  return map[tabId] || null
}

const resolveChartInstanceByTab = (tabId) => resolveChartRefByTab(tabId)?.getChartInstance?.() || null
const resolveActiveChartInstance = () => resolveChartInstanceByTab(activeTab.value)

const buildTimestampTag = () => new Date().toISOString().replace(/[:.]/g, '-')

const dataUrlToBlob = async (dataUrl) => {
  const resp = await fetch(dataUrl)
  return resp.blob()
}

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const getJSZipCtor = async () => {
  if (jsZipCtor) return jsZipCtor
  const mod = await import('jszip')
  jsZipCtor = mod?.default || mod?.JSZip || null
  if (!jsZipCtor) throw new Error('JSZip unavailable')
  return jsZipCtor
}

const wait = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms))
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const normalizeResearchPaletteColors = (palette) => {
  const colors = Array.isArray(palette?.colors) ? palette.colors : []
  return colors
    .map((item) => {
      if (typeof item === 'string' && item.trim()) return item.trim()
      if (Array.isArray(item) && item.length >= 3) {
        const [r, g, b] = item
        const toHex = (channel) => clamp(Math.round(Number(channel) || 0), 0, 255).toString(16).padStart(2, '0')
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`
      }
      return ''
    })
    .filter(Boolean)
}

async function exportMainFigure() {
  if (exportingMain.value) return
  exportingMain.value = true
  try {
    await nextTick()
    const chart = resolveChartInstanceByTab(activeTab.value)
    if (!chart) {
      showToast('当前图表尚未加载完成')
      return
    }
    const dataUrl = exportECharts(chart, {
      type: 'png',
      pixelRatio: 3.2,
      backgroundColor: '#FFFFFF'
    })
    const blob = await dataUrlToBlob(dataUrl)
    const filename = `Pressure_Fig_${activeTab.value}_${buildTimestampTag()}.png`
    triggerDownload(blob, filename)
    showToast(`主图已导出：${filename}`)
  } catch (error) {
    showToast(error?.message || '主图导出失败')
  } finally {
    exportingMain.value = false
  }
}

async function exportSupplementPackage() {
  if (exportingPack.value) return
  exportingPack.value = true
  const originTab = activeTab.value
  try {
    const JSZip = await getJSZipCtor()
    const zip = new JSZip()
    const figures = []
    let exportedCount = 0

    for (let i = 0; i < chartTabs.length; i += 1) {
      const tab = chartTabs[i]
      const meta = chartPaperMeta.value[tab.id] || activeFigureMeta.value
      activeTab.value = tab.id
      await nextTick()
      await wait(120)
      const chart = resolveChartInstanceByTab(tab.id)
      if (!chart) continue

      const figId = `FigS${exportedCount + 1}`
      const baseName = `${figId}_${tab.id}_${buildTimestampTag()}`
      const figureFiles = []
      const pngUrl = exportECharts(chart, {
        type: 'png',
        pixelRatio: 3.2,
        backgroundColor: '#FFFFFF'
      })
      zip.file(`figures/${baseName}.png`, await dataUrlToBlob(pngUrl))
      figureFiles.push(`figures/${baseName}.png`)

      try {
        const svgUrl = exportECharts(chart, {
          type: 'svg',
          pixelRatio: 2,
          backgroundColor: '#FFFFFF'
        })
        zip.file(`figures/${baseName}.svg`, await dataUrlToBlob(svgUrl))
        figureFiles.push(`figures/${baseName}.svg`)
      } catch {
        // no-op: skip svg fallback
      }

      figures.push(buildPaperFigure({
        id: figId,
        panel: String.fromCharCode(65 + exportedCount),
        title: meta.figureTitle,
        caption: meta.figureCaption,
        files: figureFiles,
        tags: ['pressure', 'chart-center', tab.id, meta.unit],
        meta: {
          tab_id: tab.id,
          active_tab: tab.id,
          exported_at: new Date().toISOString(),
          unit: meta.unit,
          summary: meta.figureSummary,
          notes: meta.figureNotes,
          methods_footer: meta.methodsFooter,
        }
      }))
      exportedCount += 1
    }

    zip.file('captions.md', buildCaptionsMarkdown({
      title: 'Pressure Chart Supplement',
      intro: `Date range: ${context.value?.dateRangeText || '--'}, supports #${context.value?.supportStart || '--'}-#${context.value?.supportEnd || '--'}.`,
      figures
    }))
    zip.file('manifest.json', JSON.stringify(buildPaperManifest({
      sourcePage: 'pressure-analysis-charts',
      title: 'Pressure Chart Supplement Export',
      locale: 'zh-CN',
      context: {
        date_range: context.value?.dateRangeText || '',
        support_start: context.value?.supportStart ?? null,
        support_end: context.value?.supportEnd ?? null,
        anomaly_count: context.value?.anomalyCount ?? null
      },
      figures,
      notes: [`exported_count=${exportedCount}`]
    }), null, 2))

    const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    const zipName = `Pressure_Supplement_${buildTimestampTag()}.zip`
    triggerDownload(zipBlob, zipName)
    showToast(`已导出补充图包（${exportedCount}张）`)
  } catch (error) {
    showToast(error?.message || '补充图包导出失败')
  } finally {
    activeTab.value = originTab
    exportingPack.value = false
  }
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
  const colors = normalizeResearchPaletteColors(palette)
  const uniqueCharts = new Set([
    ...chartInstances.value,
    resolveActiveChartInstance()
  ].filter(Boolean))

  if (!colors.length || uniqueCharts.size === 0) {
    showToast(`已切换配色：${palette?.name || '默认'}`)
    return
  }

  uniqueCharts.forEach((chart) => {
    chart.setOption({ color: colors }, false, true)
  })
  showToast(`已应用配色：${palette?.name || '默认'}（${uniqueCharts.size} 图）`)
}

async function onResearchExport(config) {
  const chart = resolveActiveChartInstance()
  if (!chart) {
    showToast('当前图表尚未加载完成')
    return
  }

  const requestedFormat = String(config?.format || 'png').toLowerCase()
  const exportType = requestedFormat === 'svg' ? 'svg' : 'png'
  const dpi = clamp(Number(config?.dpi || 300), 72, 1200)
  const pixelRatio = clamp(dpi / 96, 1, 8)

  try {
    const dataUrl = exportECharts(chart, {
      type: exportType,
      pixelRatio,
      backgroundColor: '#FFFFFF'
    })
    const blob = await dataUrlToBlob(dataUrl)
    const ext = exportType === 'svg' ? 'svg' : 'png'
    const filename = `Pressure_Research_${activeTab.value}_${buildTimestampTag()}.${ext}`
    triggerDownload(blob, filename)

    if (requestedFormat !== exportType) {
      showToast(`已导出 ${ext.toUpperCase()}（${requestedFormat.toUpperCase()} 当前回退为 ${ext.toUpperCase()}）`)
      return
    }
    showToast(`已导出：${filename}`)
  } catch (error) {
    showToast(error?.message || '科研导出失败')
  }
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
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

.publication-frame {
  display: grid;
  gap: 10px;
  padding: 14px 16px;
  border: 1px solid #dbe4ea;
  border-radius: 12px;
  background: linear-gradient(180deg, #f8fbfc 0%, #ffffff 100%);
}

.figure-heading-band {
  display: grid;
  gap: 4px;
}

.figure-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.figure-heading-band h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.15;
  color: #0f172a;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
}

.figure-heading-band p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #475569;
  max-width: 980px;
}

.publication-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.publication-summary-card {
  display: grid;
  gap: 5px;
  padding: 10px 12px;
  border: 1px solid #dbe4ea;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.88);
}

.publication-summary-card .label {
  font-size: 11px;
  color: #64748b;
}

.publication-summary-card strong {
  font-size: 14px;
  color: #0f172a;
}

.methods-footer {
  margin: 0;
  padding-top: 2px;
  font-size: 12px;
  line-height: 1.6;
  color: #526071;
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

.active-figure-caption {
  display: grid;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid #dbe4ea;
  border-radius: 12px;
  background: #fff;
}

.caption-head {
  display: grid;
  gap: 2px;
}

.caption-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.caption-head h3 {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
  color: #0f172a;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
}

.caption-summary {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #475569;
}

.caption-notes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  font-size: 12px;
  color: #526071;
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
  .publication-summary-grid,
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

  .publication-summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
