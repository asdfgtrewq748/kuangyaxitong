<template>
  <div class="pressure-charts-page">
    <header class="page-header">
      <button class="back-btn" @click="goBack" :title="pac('backToPressureAnalysis')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div class="title-wrap">
        <h1>{{ pac('title') }}</h1>
        <p>{{ pac('subtitle') }}</p>
      </div>
      <div class="header-actions">
        <PaperExportMenu
          :trigger-label="pac('exportTrigger')"
          :main-label="pac('exportMain')"
          :pack-label="pac('exportSupplement')"
          :loading-main-label="pac('exportingMain')"
          :loading-pack-label="pac('exportingPack')"
          :main-hint="pac('exportMainHint')"
          :pack-hint="pac('exportPackHint')"
          :disabled-main="Boolean(snapshotError)"
          :disabled-pack="Boolean(snapshotError)"
          :loading-main="exportingMain"
          :loading-pack="exportingPack"
          @export-main="exportMainFigure"
          @export-pack="exportSupplementPackage"
        />
        <button class="ghost-btn" @click="goBack">{{ pac('backToPressureAnalysis') }}</button>
      </div>
    </header>

    <section v-if="snapshotError" class="empty-card">
      <h3>{{ pac('emptyTitle') }}</h3>
      <p>{{ snapshotError }}</p>
      <button class="ghost-btn" @click="goBack">{{ pac('emptyAction') }}</button>
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
          <span class="label">{{ pac('summaryDateRange') }}</span>
          <strong>{{ context.dateRangeText || '--' }}</strong>
        </article>
        <article class="summary-card">
          <span class="label">{{ pac('summarySupportRange') }}</span>
          <strong>#{{ context.supportStart }} - #{{ context.supportEnd }}</strong>
        </article>
        <article class="summary-card">
          <span class="label">{{ pac('summaryMeanPeak') }}</span>
          <strong>{{ statsLabel }}</strong>
        </article>
        <article class="summary-card">
          <span class="label">{{ pac('summaryAnomaly') }}</span>
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
            <span class="tab-label">{{ pac(tab.labelKey) }}</span>
          </button>
        </div>

        <div class="tabs-content">
          <Transition name="tab-slide" mode="out-in">
            <div v-if="activeTab === 'hist'" key="hist" class="tab-panel">
              <LazyChart height="420px" :loading="!histogramData.length">
                <PressureHistogramUltra ref="histogramRef" :title="pac('chartHistTitle')" :data="histogramData" :bins="30" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'spatial'" key="spatial" class="tab-panel">
              <LazyChart height="420px" :loading="!spatialDistData.length">
                <PressureSpatialDistUltra ref="spatialRef" :title="pac('chartSpatialTitle')" :data="spatialDistData" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'cycle'" key="cycle" class="tab-panel">
              <LazyChart height="420px" :loading="!cycleData.length">
                <PressureCycleDetectUltra ref="cycleRef" :title="pac('chartCycleTitle')" :data="cycleData" :periods="detectedPeriods" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'corr'" key="corr" class="tab-panel">
              <LazyChart height="420px" :loading="!correlationMatrix">
                <PressureCorrelationUltra ref="correlationRef" :title="pac('chartCorrTitle')" :matrix="correlationMatrix" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'compare'" key="compare" class="tab-panel">
              <LazyChart height="420px" :loading="!frontColumnData.length && !rearColumnData.length">
                <PressureColumnCompareUltra ref="compareRef" :title="pac('chartCompareTitle')" :front-data="frontColumnData" :rear-data="rearColumnData" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'boxplot'" key="boxplot" class="tab-panel">
              <LazyChart height="420px" :loading="!rawData.length">
                <PressureBoxPlot ref="boxplotRef" panel-label="C" :title="pac('chartBoxplotTitle')" :subtitle="pac('chartBoxplotSubtitle')" :data="rawData" time-range="day" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'cdf'" key="cdf" class="tab-panel">
              <LazyChart height="420px" :loading="!rawData.length">
                <PressureCDF ref="cdfRef" panel-label="D" :title="pac('chartCdfTitle')" :subtitle="pac('chartCdfSubtitle')" :data="rawData" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'spectral'" key="spectral" class="tab-panel">
              <LazyChart height="420px" :loading="!selectedSupportData.length">
                <PressureSpectral ref="spectralRef" panel-label="E" :title="pac('chartSpectralTitle')" :subtitle="pac('chartSpectralSubtitle')" :data="selectedSupportData" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'scatter'" key="scatter" class="tab-panel">
              <LazyChart height="420px" :loading="!rawData.length">
                <PressureScatterMatrix ref="scatterRef" panel-label="F" :title="pac('chartScatterTitle')" :subtitle="pac('chartScatterSubtitle')" :data="rawData" :support-ids="[1, 25, 50, 75, 100, 125]" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'anomaly'" key="anomaly" class="tab-panel">
              <LazyChart height="420px" :loading="!heatmapMatrix.length">
                <AnomalyHeatmap ref="anomalyRef" panel-label="G" :title="pac('chartAnomalyTitle')" :subtitle="pac('chartAnomalySubtitle')" :matrix="heatmapMatrix" :stats="stats" :threshold="2.0" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'radar'" key="radar" class="tab-panel">
              <LazyChart height="420px" :loading="!selectedSupportData.length">
                <PressureRadar ref="radarRef" panel-label="H" :title="pac('chartRadarTitle')" :subtitle="pac('chartRadarSubtitle')" :data="selectedSupportData" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'density'" key="density" class="tab-panel">
              <LazyChart height="420px" :loading="!rawData.length">
                <PressureDensity ref="densityRef" panel-label="I" :title="pac('chartDensityTitle')" :subtitle="pac('chartDensitySubtitle')" :data="rawData" />
              </LazyChart>
            </div>
            <div v-else-if="activeTab === 'contour'" key="contour" class="tab-panel">
              <LazyChart height="420px" :loading="!heatmapMatrix.length">
                <PressureContour ref="contourRef" panel-label="J" :title="pac('chartContourTitle')" :subtitle="pac('chartContourSubtitle')" :matrix="heatmapMatrix" :num-supports="numRows" :levels="12" />
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
          <span><strong>{{ pac('activeFigureUnit') }}:</strong> {{ activeFigureMeta.unit }}</span>
          <span><strong>{{ pac('activeFigureNotes') }}:</strong> {{ activeFigureMeta.figureNotes }}</span>
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
import { useI18n } from '../composables/useI18n'
import {
  buildPaperArtifact,
  buildPaperFigure,
  buildPaperFigureId,
  buildPaperFigurePath,
  buildPaperManifest,
  buildPaperRootPath,
  buildPaperSupplementZipName,
  buildPaperTimestampTag,
  buildPublicationCaptionsMarkdown,
  buildPublicationIndexDocument,
  buildPublicationLabelSet,
  buildPublicationMethodsFooter,
  buildPublicationNotesMarkdown,
  buildPublicationRows,
  buildPublicationReadmeMarkdown
} from '@/utils/paperExportSchema'

const CHART_CENTER_SNAPSHOT_KEY = 'pressure_analysis_chart_snapshot_v1'

const router = useRouter()
const { t, locale } = useI18n()
const pac = (key, params) => t(`pressureAnalysisCharts.${key}`, params)
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
  { id: 'hist', labelKey: 'tabHist' },
  { id: 'spatial', labelKey: 'tabSpatial' },
  { id: 'cycle', labelKey: 'tabCycle' },
  { id: 'corr', labelKey: 'tabCorr' },
  { id: 'compare', labelKey: 'tabCompare' },
  { id: 'boxplot', labelKey: 'tabBoxplot' },
  { id: 'cdf', labelKey: 'tabCdf' },
  { id: 'spectral', labelKey: 'tabSpectral' },
  { id: 'scatter', labelKey: 'tabScatter' },
  { id: 'anomaly', labelKey: 'tabAnomaly' },
  { id: 'radar', labelKey: 'tabRadar' },
  { id: 'density', labelKey: 'tabDensity' },
  { id: 'contour', labelKey: 'tabContour' }
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
const activeTabLabel = computed(() => {
  const tab = chartTabs.find((item) => item.id === activeTab.value)
  return tab ? pac(tab.labelKey) : '--'
})

const buildChartMeta = (prefix, unit) => ({
  figureTitle: pac(`${prefix}FigureTitle`),
  figureSummary: pac(`${prefix}FigureSummary`),
  figureCaption: pac(`${prefix}FigureCaption`),
  figureNotes: pac(`${prefix}FigureNotes`),
  unit,
  methodsFooter: pac(`${prefix}MethodsFooter`)
})

const chartPaperMeta = computed(() => ({
  hist: {
    figureId: 'Figure C1',
    ...buildChartMeta('hist', 'MPa')
  },
  spatial: {
    figureId: 'Figure C2',
    ...buildChartMeta('spatial', 'MPa')
  },
  cycle: {
    figureId: 'Figure C3',
    ...buildChartMeta('cycle', 'MPa')
  },
  corr: {
    figureId: 'Figure C4',
    ...buildChartMeta('corr', 'Correlation coefficient')
  },
  compare: {
    figureId: 'Figure C5',
    ...buildChartMeta('compare', 'MPa')
  },
  boxplot: {
    figureId: 'Figure C6',
    ...buildChartMeta('boxplot', 'MPa')
  },
  cdf: {
    figureId: 'Figure C7',
    ...buildChartMeta('cdf', 'Cumulative probability')
  },
  spectral: {
    figureId: 'Figure C8',
    ...buildChartMeta('spectral', 'Spectral power')
  },
  scatter: {
    figureId: 'Figure C9',
    ...buildChartMeta('scatter', 'MPa')
  },
  anomaly: {
    figureId: 'Figure C10',
    ...buildChartMeta('anomaly', 'Standardized anomaly score')
  },
  radar: {
    figureId: 'Figure C11',
    ...buildChartMeta('radar', 'Normalized feature score')
  },
  density: {
    figureId: 'Figure C12',
    ...buildChartMeta('density', 'Density')
  },
  contour: {
    figureId: 'Figure C13',
    ...buildChartMeta('contour', 'MPa')
  },
}))
const activeFigureMeta = computed(() => chartPaperMeta.value[activeTab.value] || {
  figureId: 'Figure C0',
  figureTitle: activeTabLabel.value,
  figureSummary: pac('fallbackFigureSummary'),
  figureCaption: pac('fallbackFigureCaption'),
  figureNotes: pac('fallbackFigureNotes'),
  unit: '--',
  methodsFooter: pac('fallbackMethodsFooter')
})
const paperFrame = computed(() => ({
  heading: pac('figureHeading'),
  title: pac('figureTitle'),
  summary: pac('figureSummary', {
    dateRange: context.value?.dateRangeText || '--',
    supportStart: context.value?.supportStart || '--',
    supportEnd: context.value?.supportEnd || '--'
  }),
  cards: [
    { label: pac('cardPrimaryEvidence'), value: statsLabel.value },
    { label: pac('cardActivePlate'), value: activeTabLabel.value },
    { label: pac('cardAnomalyCount'), value: String(context.value?.anomalyCount ?? 0) },
  ],
  methodsFooter: buildPublicationMethodsFooter({
    subject: 'Pressure analytics plates',
    source: 'pressure-analysis snapshot',
    details: [
      'support-wise resistance series',
      'spatial heatmap matrices',
      'ECharts publication exports',
      `current plate ${activeTabLabel.value}`
    ]
  }),
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

const dataUrlToBlob = async (dataUrl) => {
  const resp = await fetch(dataUrl)
  return resp.blob()
}

const publicationLabels = buildPublicationLabelSet()

const buildPublicationCaptionRows = (meta) => buildPublicationRows([
  { label: publicationLabels.figure, value: meta?.figureTitle || '--' },
  { label: publicationLabels.summary, value: meta?.figureSummary || '--' },
  { label: publicationLabels.caption, value: meta?.figureCaption || '--' }
])

const buildPublicationNoteRows = (meta) => buildPublicationRows([
  { label: publicationLabels.unit, value: meta?.unit || '--' },
  { label: publicationLabels.notes, value: meta?.figureNotes || '--' },
  { label: publicationLabels.methodsFooter, value: meta?.methodsFooter || '--' }
])

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
      showToast(pac('toastChartNotReady'))
      return
    }
    const dataUrl = exportECharts(chart, {
      type: 'png',
      pixelRatio: 3.2,
      backgroundColor: '#FFFFFF'
    })
    const blob = await dataUrlToBlob(dataUrl)
    const filename = `Pressure_Fig_${activeTab.value}_${buildPaperTimestampTag()}.png`
    triggerDownload(blob, filename)
    showToast(pac('toastMainExported', { filename }))
  } catch (error) {
    showToast(error?.message || pac('toastMainExportFailed'))
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

      const figId = buildPaperFigureId({ index: exportedCount + 1, supplement: true })
      const figureFiles = []
      const pngUrl = exportECharts(chart, {
        type: 'png',
        pixelRatio: 3.2,
        backgroundColor: '#FFFFFF'
      })
      const pngPath = buildPaperFigurePath({
        index: exportedCount + 1,
        supplement: true,
        slug: tab.id,
        ext: 'png'
      })
      zip.file(pngPath, await dataUrlToBlob(pngUrl))
      figureFiles.push(pngPath)

      try {
        const svgUrl = exportECharts(chart, {
          type: 'svg',
          pixelRatio: 2,
          backgroundColor: '#FFFFFF'
        })
        const svgPath = buildPaperFigurePath({
          index: exportedCount + 1,
          supplement: true,
          slug: tab.id,
          ext: 'svg'
        })
        zip.file(svgPath, await dataUrlToBlob(svgUrl))
        figureFiles.push(svgPath)
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
          figure_heading: meta.figureTitle,
          caption_title: meta.figureTitle,
          caption_rows: buildPublicationCaptionRows(meta),
          note_rows: buildPublicationNoteRows(meta),
          unit: meta.unit,
          summary: meta.figureSummary,
          notes: meta.figureNotes,
          methods_footer: meta.methodsFooter,
        }
      }))
      exportedCount += 1
    }

    const captionsPath = buildPaperRootPath({ name: 'captions', ext: 'md' })
    const notesPath = buildPaperRootPath({ name: 'publication-notes', ext: 'md' })
    const manifestPath = buildPaperRootPath({ name: 'manifest', ext: 'json' })
    const indexPath = buildPaperRootPath({ name: 'index', ext: 'json' })
    const readmePath = buildPaperRootPath({ name: 'README', ext: 'md' })
    const generatedAt = new Date().toISOString()

    zip.file(captionsPath, buildPublicationCaptionsMarkdown({
      title: 'Pressure Chart Supplement',
      intro: `Date range: ${context.value?.dateRangeText || '--'}, supports #${context.value?.supportStart || '--'}-#${context.value?.supportEnd || '--'}.`,
      figures
    }))
    zip.file(notesPath, buildPublicationNotesMarkdown({
      title: 'Publication Notes',
      figures
    }))
    zip.file(readmePath, buildPublicationReadmeMarkdown({
      title: 'Pressure Chart Supplement Export',
      intro: 'This archive contains publication-ready pressure analysis figures and their supporting metadata.',
      sourcePage: 'pressure-analysis-charts',
      manifestPath,
      indexPath,
      captionsPath,
      notesPath,
      figures
    }))
    zip.file(indexPath, JSON.stringify(buildPublicationIndexDocument({
      title: 'Pressure Chart Supplement Export',
      generatedAt,
      sourcePage: 'pressure-analysis-charts',
      manifestPath,
      captionsPath,
      notesPath,
      readmePath,
      figures
    }), null, 2))
    zip.file(manifestPath, JSON.stringify(buildPaperManifest({
      sourcePage: 'pressure-analysis-charts',
      title: 'Pressure Chart Supplement Export',
      locale: locale.value,
      context: {
        date_range: context.value?.dateRangeText || '',
        support_start: context.value?.supportStart ?? null,
        support_end: context.value?.supportEnd ?? null,
        anomaly_count: context.value?.anomalyCount ?? null
      },
      figures,
      artifacts: [
        buildPaperArtifact({ name: 'captions', path: captionsPath }),
        buildPaperArtifact({ name: 'publication_notes', path: notesPath }),
        buildPaperArtifact({ name: 'index', path: indexPath }),
        buildPaperArtifact({ name: 'readme', path: readmePath }),
        buildPaperArtifact({ name: 'manifest', path: manifestPath })
      ],
      notes: [`exported_count=${exportedCount}`],
      generatedAt
    }), null, 2))

    const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    const zipName = buildPaperSupplementZipName({
      topic: 'Pressure',
      timestampTag: buildPaperTimestampTag()
    })
    triggerDownload(zipBlob, zipName)
    showToast(pac('toastSupplementExported', { count: exportedCount }))
  } catch (error) {
    showToast(error?.message || pac('toastSupplementExportFailed'))
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
  showToast(pac('toastExportComplete', { count: successCount }))
}

function onResearchPaletteChange(palette) {
  const colors = normalizeResearchPaletteColors(palette)
  const uniqueCharts = new Set([
    ...chartInstances.value,
    resolveActiveChartInstance()
  ].filter(Boolean))

  if (!colors.length || uniqueCharts.size === 0) {
    showToast(pac('toastPaletteSwitched', { name: palette?.name || pac('defaultPalette') }))
    return
  }

  uniqueCharts.forEach((chart) => {
    chart.setOption({ color: colors }, false, true)
  })
  showToast(pac('toastPaletteApplied', {
    name: palette?.name || pac('defaultPalette'),
    count: uniqueCharts.size
  }))
}

async function onResearchExport(config) {
  const chart = resolveActiveChartInstance()
  if (!chart) {
    showToast(pac('toastChartNotReady'))
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
    const filename = `Pressure_Research_${activeTab.value}_${buildPaperTimestampTag()}.${ext}`
    triggerDownload(blob, filename)

    if (requestedFormat !== exportType) {
      showToast(pac('toastResearchFallback', {
        actual: ext.toUpperCase(),
        requested: requestedFormat.toUpperCase()
      }))
      return
    }
    showToast(pac('toastResearchExported', { filename }))
  } catch (error) {
    showToast(error?.message || pac('toastResearchExportFailed'))
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
      snapshotError.value = pac('snapshotMissing')
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
