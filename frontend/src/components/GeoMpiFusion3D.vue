<template>
  <section class="geo-mpi-fusion" :class="{ paper: paperMode }">
    <header class="fusion-header">
      <div v-if="paperMode && hasRenderableData && !errorText" class="paper-frame">
        <div class="paper-frame-head">
          <span class="paper-frame-kicker">{{ paperNotation.figureHeading }}</span>
          <p class="paper-frame-summary">{{ paperNotation.summaryLead }}</p>
        </div>
        <div class="paper-frame-chips">
          <span v-for="chip in publicationHeaderChips" :key="chip" class="paper-frame-chip">{{ chip }}</span>
        </div>
        <p class="paper-frame-footer">{{ paperNotation.methodsFooter }}</p>
      </div>
      <div class="header-main">
        <div class="title-wrap">
          <h3>{{ title }}</h3>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
        <div class="toolbar">
          <span class="toolbar-label">Scene controls</span>
          <label class="toggle"><input v-model="showLayers" type="checkbox">Layers</label>
          <label class="toggle"><input v-model="showMpiSurface" type="checkbox">MPI Surface</label>
          <label class="toggle"><input v-model="showMpiContours" type="checkbox">Contours</label>
          <label class="toggle"><input v-model="showHotspots" type="checkbox">Hotspots</label>
          <label class="toggle"><input v-model="showStressCloud" type="checkbox">Stress Cloud</label>
          <label class="toggle"><input v-model="showStressAnchors" type="checkbox" :disabled="!hasStressAnchors">Anchors</label>
          <label class="toggle"><input v-model="showBoreholes" type="checkbox">Boreholes</label>
          <label class="toggle"><input v-model="autoRotate" type="checkbox">Auto-Rotate</label>
          <label class="toggle"><input v-model="sectionEnabled" type="checkbox">Section</label>
          <label class="axis">
            <span>Axis</span>
            <select v-model="sectionAxis" :disabled="!sectionEnabled">
              <option value="x">X</option>
              <option value="y">Y</option>
              <option value="z">Z</option>
            </select>
          </label>
          <label class="slider" :class="{ disabled: !sectionEnabled }">
            <span>{{ sectionDisplay }}</span>
            <input
              v-model.number="sectionRatio"
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              :disabled="!sectionEnabled"
            >
          </label>
          <label class="slider density">
            <span>Cloud {{ Math.round(cloudDensity * 100) }}%</span>
            <input
              v-model.number="cloudDensity"
              type="range"
              min="0.25"
              max="1"
              step="0.05"
            >
          </label>
          <button type="button" class="ghost-btn" @click="resetView">Reset View</button>
          <button type="button" class="ghost-btn export-btn" :disabled="isExporting || !hasRenderableData || loading" @click="exportFigure">
            {{ isExporting ? 'Exporting...' : 'Export Figure' }}
          </button>
          <button type="button" class="refresh-btn" @click="$emit('refresh')">Refresh</button>
        </div>
      </div>
    </header>

    <div class="viewer-body" ref="hostRef">
      <AsyncState
        v-if="loading || !hasRenderableData || !!errorText"
        :loading="loading"
        :hasData="hasRenderableData"
        :errorText="errorText"
        :loadingText="loadingText || 'Loading fusion scene...'"
        :emptyText="emptyText || 'No fusion data available yet.'"
        :action="{ label: 'Retry', onClick: () => $emit('refresh') }"
      />

      <canvas v-show="!loading && hasRenderableData && !errorText" ref="canvasRef" class="fusion-canvas"></canvas>

      <div v-if="!loading && hasRenderableData && !errorText" class="figure-overlay">
        <div class="figure-topline">
          <span class="panel-tag">{{ panelLabel }}</span>
          <span class="figure-topic">{{ heroCopy.topic }}</span>
        </div>
        <h4 class="figure-headline">{{ heroCopy.headline }}</h4>
        <p class="figure-meta">{{ figureHeaderCopy.metaLine }}</p>
        <div class="figure-kpis">
          <span v-for="line in figureHeaderCopy.kpiLines" :key="line">{{ line }}</span>
        </div>
        <div class="content-metrics">
          <p v-for="line in heroCopy.metricRows" :key="line">{{ line }}</p>
        </div>
        <div class="diagnostic-badges">
          <span
            v-for="badge in diagnosticBadges"
            :key="`${badge.label}-${badge.value}`"
            class="diagnostic-badge"
            :class="`tone-${badge.tone}`"
          >
            <strong>{{ badge.label }}</strong>
            <em>{{ badge.value }}</em>
          </span>
        </div>
        <div class="methods-panel">
          <p class="methods-title">{{ publicationLabels.methodsPanel }}</p>
          <p v-for="row in methodProvenanceRows" :key="row.label" class="methods-row">
            <span class="methods-key">{{ row.label }}</span>
            <span class="methods-value">{{ row.value }}</span>
          </p>
        </div>
        <p class="figure-note">{{ statisticCopy.figureNote }}</p>
      </div>

      <div v-if="!loading && hasRenderableData && !errorText" class="legend-overlay">
        <div class="legend-title">{{ legendCopy.legendTitle }}</div>
        <div class="legend-bar">
          <span class="legend-tick"></span>
          <span class="legend-tick"></span>
          <span class="legend-tick"></span>
        </div>
        <div class="legend-range">
          <span>{{ formatValue(metricStats?.min) }}</span>
          <span>{{ formatValue(metricStats?.mean) }}</span>
          <span>{{ formatValue(metricStats?.max) }}</span>
        </div>
        <p class="section-hint">
          {{ legendCopy.depthSpanLine }}
        </p>
        <p v-if="sectionEnabled" class="section-hint">
          {{ legendCopy.sectionLine }}
        </p>
        <p v-if="showStressCloud" class="section-hint cloud-hint">
          {{ legendCopy.cloudLine }}
        </p>
        <div v-if="profileCurvePoints" class="profile-curve-wrap">
          <p class="profile-title">{{ statisticCopy.profileTitle }}</p>
          <svg class="profile-curve" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="35" x2="100" y2="35" class="profile-axis" />
            <line x1="0" y1="1" x2="0" y2="35" class="profile-axis" />
            <polyline :points="profileCurvePoints" class="profile-line" />
          </svg>
        </div>
        <div v-if="showStressCloud && showStressAnchors && stressAnchorItems.length" class="anchor-list">
          <p class="anchor-title">{{ statisticCopy.anchorTitle }}</p>
          <p v-for="item in stressAnchorItems.slice(0, 4)" :key="`anchor-${item.name}-${item.zNorm}`" class="anchor-item">
            <span class="anchor-name">{{ item.name }}</span>
            <span class="anchor-meta">z={{ formatValue(item.zWorld) }} | w={{ formatValue(item.importance) }}</span>
          </p>
        </div>
        <div class="depth-strip-wrap">
          <span class="subfigure-label">d</span>
          <p class="depth-strip-title">{{ publicationLabels.depthGuideTitle }}</p>
          <div class="depth-strip-layout">
            <svg class="depth-strip" viewBox="0 0 88 220" preserveAspectRatio="none" aria-hidden="true">
              <rect x="28" y="8" width="18" height="204" rx="9" class="depth-strip-bg" />
              <rect
                v-if="depthFocusBand"
                :x="depthFocusBand.x"
                :y="depthFocusBand.y"
                :width="depthFocusBand.w"
                :height="depthFocusBand.h"
                rx="8"
                class="depth-focus-band"
              />
              <line x1="37" y1="8" x2="37" y2="212" class="depth-axis-line" />
              <g v-for="tick in depthAxisTicks" :key="`tick-${tick.id}`">
                <line x1="24" :y1="tick.y" x2="50" :y2="tick.y" class="depth-tick-line" />
                <text x="4" :y="tick.y + 3" class="depth-tick-label">{{ tick.label }}</text>
              </g>
              <g v-for="item in depthAnchorTrack" :key="`track-${item.name}-${item.zNorm}`">
                <line x1="46" :y1="item.y" x2="58" :y2="item.y" class="depth-anchor-line" />
                <circle cx="37" :cy="item.y" :r="item.r" class="depth-anchor-dot" />
                <text x="61" :y="item.y + 3" class="depth-anchor-label">{{ item.shortLabel }}</text>
              </g>
            </svg>
            <div class="depth-strip-notes">
              <p v-for="line in diagnosticCopy.depthNotes" :key="line">{{ line }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && hasRenderableData && !errorText" class="orientation-overlay">
        <div class="north-block">
          <span class="north-label">{{ legendCopy.northLabel }}</span>
          <span class="north-arrow">^</span>
        </div>
        <div class="scale-block">
          <div class="scale-bar-line"></div>
          <p>{{ scaleBarLabel }}</p>
        </div>
        <p class="orientation-meta">{{ legendCopy.orientationMeta }}</p>
      </div>

      <div v-if="!loading && hasRenderableData && !errorText" class="analysis-overlay">
        <p class="analysis-title">{{ statisticCopy.analysisTitle }}</p>
        <div class="inset-map-wrap">
          <span class="subfigure-label">a</span>
          <p class="inset-title">{{ publicationLabels.insetTitle }}</p>
          <svg class="inset-map" :viewBox="insetViewBox" preserveAspectRatio="none" aria-hidden="true">
            <rect
              v-for="cell in insetHeatmapCells"
              :key="`cell-${cell.id}`"
              :x="cell.x"
              :y="cell.y"
              :width="cell.w"
              :height="cell.h"
              :fill="cell.color"
            />
            <line
              v-if="insetSectionLine"
              :x1="insetSectionLine.x1"
              :y1="insetSectionLine.y1"
              :x2="insetSectionLine.x2"
              :y2="insetSectionLine.y2"
              class="inset-section-line"
            />
            <circle
              v-for="spot in insetHotspotPoints"
              :key="`spot-${spot.id}`"
              :cx="spot.x"
              :cy="spot.y"
              :r="spot.r"
              class="inset-hotspot"
            />
          </svg>
          <p class="inset-caption">{{ publicationLabels.insetCaption }}</p>
        </div>
        <div class="dist-wrap">
          <span class="subfigure-label">b</span>
          <p class="dist-title">{{ publicationLabels.distributionTitle }}</p>
          <svg class="dist-chart" viewBox="0 0 100 38" preserveAspectRatio="none" aria-hidden="true">
            <rect
              v-for="bar in histogramBars"
              :key="`bar-${bar.id}`"
              :x="bar.x"
              :y="bar.y"
              :width="bar.w"
              :height="bar.h"
              class="dist-bar"
            />
            <line
              v-for="line in histogramQuantileLines"
              :key="`qline-${line.id}`"
              :x1="line.x"
              y1="1"
              :x2="line.x"
              y2="37"
              class="dist-qline"
            />
          </svg>
          <p class="dist-caption">{{ statisticCopy.distributionCaption }}</p>
        </div>
        <div class="section-profile-wrap">
          <span class="subfigure-label">c</span>
          <p class="section-profile-title">{{ sectionProfileModeLabel }}</p>
          <svg class="section-profile-chart" viewBox="0 0 100 38" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="37" x2="100" y2="37" class="section-axis-line" />
            <line x1="0" y1="1" x2="0" y2="37" class="section-axis-line" />
            <line
              v-if="sectionProfileGuideX !== null"
              :x1="sectionProfileGuideX"
              y1="1"
              :x2="sectionProfileGuideX"
              y2="37"
              class="section-guide-line"
            />
            <path
              v-if="sectionUncertaintyBandPath"
              :d="sectionUncertaintyBandPath"
              class="section-band-path"
            />
            <path
              v-if="sectionProfilePath"
              :d="sectionProfilePath"
              class="section-profile-path"
            />
          </svg>
          <div class="section-profile-meta">
            <span>{{ sectionProfileRangeLabel }}</span>
            <span>{{ sectionProfilePeakLabel }}</span>
          </div>
          <p class="section-profile-note">{{ sectionProfileSpreadLabel }}</p>
        </div>
        <p v-for="line in statisticCopy.summaryLines" :key="line">{{ line }}</p>
        <p v-for="item in hotspotTopList.slice(0, 3)" :key="`hline-${item}`" class="hotspot-line">{{ item }}</p>
      </div>

      <div v-if="!loading && hasRenderableData && !errorText" class="caption-overlay">
        <div class="caption-grid">
          <div class="caption-block">
            <p class="caption-title">{{ publicationLabels.captionBlock }}</p>
            <p v-for="row in publicationCaptionRows" :key="row.label" class="caption-row">
              <span class="caption-key">{{ row.label }}</span>
              <span class="caption-value">{{ row.value }}</span>
            </p>
          </div>
          <div class="caption-block caption-block-notes">
            <p class="caption-title">{{ publicationLabels.notesBlock }}</p>
            <p v-for="row in publicationNoteRows" :key="row.label" class="caption-row">
              <span class="caption-key">{{ row.label }}</span>
              <span class="caption-value">{{ row.value }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { loadOrbitControls, three } from '@/lib/three-fusion'
import { buildPublicationDiagnosticCopy, buildPublicationFigureHeaderCopy, buildPublicationHeroCopy, buildPublicationLabelSet, buildPublicationLegendCopy, buildPublicationMethodsFooter, buildPublicationNarrativeSentence, buildPublicationRows, buildPublicationSectionProfileDiagnostics, buildPublicationStatisticCopy, buildPublicationSummaryCopy } from '@/utils/paperExportSchema'
import AsyncState from './AsyncState.vue'

const props = defineProps({
  title: { type: String, default: '3D Geology-MPI Fusion Preview' },
  subtitle: { type: String, default: '' },
  panelLabel: { type: String, default: 'Fig. 1' },
  contextMeta: { type: Object, default: () => ({}) },
  geomodel: { type: Object, default: null },
  stressProfile: { type: Object, default: null },
  mpiGrid: { type: Array, default: () => [] },
  mpiBounds: { type: Object, default: null },
  metric: { type: String, default: 'mpi' },
  metricStats: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: '' },
  emptyText: { type: String, default: '' },
  errorText: { type: String, default: '' },
  paperMode: { type: Boolean, default: false },
})

defineEmits(['refresh'])

const hostRef = ref(null)
const canvasRef = ref(null)

const showLayers = ref(true)
const showMpiSurface = ref(true)
const showMpiContours = ref(true)
const showHotspots = ref(true)
const showStressCloud = ref(true)
const showStressAnchors = ref(true)
const showBoreholes = ref(true)
const autoRotate = ref(true)
const sectionEnabled = ref(false)
const sectionAxis = ref('z')
const sectionRatio = ref(0.58)
const cloudDensity = ref(0.7)
const isExporting = ref(false)
const dataBounds = ref({
  min_x: -10,
  max_x: 10,
  min_y: -10,
  max_y: 10,
  min_z: -10,
  max_z: 10,
})

const metricLabel = computed(() => String(props.metric || 'mpi').toUpperCase())
const stressProfileLabel = computed(() => {
  const source = String(props.stressProfile?.source || '')
  if (source) return source
  return 'default profile'
})
const stressFocusLabel = computed(() => {
  const mode = Number(props.stressProfile?.meta?.focus_mode)
  if (mode === 1) return 'shallow'
  if (mode === 2) return 'deep'
  return 'balanced'
})

const hasStressProfileSamples = computed(() => {
  const bins = props.stressProfile?.bins
  const weights = props.stressProfile?.weights
  return Array.isArray(bins) && Array.isArray(weights) && bins.length > 1 && bins.length === weights.length
})

const hasRenderableData = computed(() => {
  const layers = props.geomodel?.layers || []
  const boreholes = props.geomodel?.boreholes || []
  const grid = props.mpiGrid || []
  return layers.length > 0 || boreholes.length > 0 || (Array.isArray(grid) && grid.length > 1)
})

const layerCount = computed(() => (props.geomodel?.layers || []).length)
const boreholeCount = computed(() => (props.geomodel?.boreholes || []).length)
const gridShapeText = computed(() => {
  const grid = props.mpiGrid
  const rows = Array.isArray(grid) ? grid.length : 0
  const cols = Array.isArray(grid?.[0]) ? grid[0].length : 0
  if (rows <= 0 || cols <= 0) return '--'
  return `${rows}x${cols}`
})

const stressAnchorItems = computed(() => {
  const raw = Array.isArray(props.stressProfile?.anchors) ? props.stressProfile.anchors : []
  if (!raw.length) return []
  const b = dataBounds.value
  const spanZ = Math.max(toFinite(b.max_z - b.min_z, 0), 1)
  const normalized = []
  for (const entry of raw) {
    const name = String(entry?.name || '').trim() || 'anchor'
    const zNorm = Math.max(0, Math.min(1, toFinite(entry?.z_norm, NaN)))
    const importance = Math.max(0, Math.min(1, toFinite(entry?.importance, 0)))
    if (!Number.isFinite(zNorm)) continue
    // Backend profile uses top->deep depth norm; scene z grows from deep->top.
    const zWorld = b.max_z - zNorm * spanZ
    normalized.push({ name, zNorm, importance, zWorld })
  }
  normalized.sort((a, b2) => b2.importance - a.importance)
  return normalized
})

const hasStressAnchors = computed(() => stressAnchorItems.value.length > 0)
const exportAnchorRows = computed(() => {
  return stressAnchorItems.value.slice(0, 3).map((item, idx) => {
    return `${idx + 1}. ${item.name}  z=${formatValue(item.zWorld)}  w=${formatValue(item.importance)}`
  })
})

const formatValue = (val) => {
  const num = Number(val)
  return Number.isFinite(num) ? num.toFixed(2) : '--'
}

const formatPercent = (ratio) => {
  const num = Number(ratio)
  return Number.isFinite(num) ? `${(num * 100).toFixed(1)}%` : '--'
}

const toFinite = (value, fallback = 0) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

const quantileFromSorted = (sortedValues, q) => {
  if (!Array.isArray(sortedValues) || !sortedValues.length) return 0
  const ratio = Math.max(0, Math.min(1, toFinite(q, 0)))
  if (sortedValues.length === 1) return sortedValues[0]
  const index = (sortedValues.length - 1) * ratio
  const lower = Math.floor(index)
  const upper = Math.min(sortedValues.length - 1, Math.ceil(index))
  const weight = index - lower
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight
}

const extractGridValues = (grid) => {
  if (!Array.isArray(grid)) return []
  const values = []
  for (const row of grid) {
    if (!Array.isArray(row)) continue
    for (const raw of row) {
      const value = Number(raw)
      if (Number.isFinite(value)) values.push(value)
    }
  }
  return values
}

const buildMpiSummary = (grid) => {
  const values = extractGridValues(grid)
  if (!values.length) {
    return {
      count: 0,
      mean: NaN,
      std: NaN,
      cv: NaN,
      skewness: NaN,
      entropyNorm: NaN,
      p10: NaN,
      p25: NaN,
      p50: NaN,
      p75: NaN,
      p90: NaN,
      iqr: NaN,
      p75Cover: NaN,
      p90Cover: NaN,
      minValue: NaN,
      maxValue: NaN,
      histogram: [],
    }
  }
  values.sort((a, b) => a - b)
  const minValue = values[0]
  const maxValue = values[values.length - 1]
  const sum = values.reduce((acc, value) => acc + value, 0)
  const mean = sum / values.length
  const variance = values.reduce((acc, value) => acc + (value - mean) ** 2, 0) / values.length
  const std = Math.sqrt(Math.max(variance, 0))
  const thirdMoment = values.reduce((acc, value) => acc + (value - mean) ** 3, 0) / values.length
  const skewness = std > 1e-9 ? thirdMoment / (std ** 3) : NaN
  const p10 = quantileFromSorted(values, 0.1)
  const p25 = quantileFromSorted(values, 0.25)
  const p50 = quantileFromSorted(values, 0.5)
  const p75 = quantileFromSorted(values, 0.75)
  const p90 = quantileFromSorted(values, 0.9)
  const iqr = p75 - p25
  const p75Cover = values.filter((value) => value >= p75).length / values.length
  const p90Cover = values.filter((value) => value >= p90).length / values.length
  const histogramBins = 12
  const histogram = new Array(histogramBins).fill(0)
  const span = Math.max(maxValue - minValue, 1e-9)
  for (const value of values) {
    const ratio = Math.max(0, Math.min(0.999999, (value - minValue) / span))
    const index = Math.min(histogramBins - 1, Math.floor(ratio * histogramBins))
    histogram[index] += 1
  }
  const entropy = histogram.reduce((acc, count) => {
    if (count <= 0) return acc
    const p = count / values.length
    return acc - p * Math.log2(p)
  }, 0)
  const entropyNorm = entropy / Math.log2(histogramBins)
  return {
    count: values.length,
    mean,
    std,
    cv: Math.abs(mean) > 1e-6 ? std / Math.abs(mean) : NaN,
    skewness,
    entropyNorm,
    p10,
    p25,
    p50,
    p75,
    p90,
    iqr,
    p75Cover,
    p90Cover,
    minValue,
    maxValue,
    histogram,
  }
}

const detectHotspots = (grid, threshold, limit = 12) => {
  if (!Array.isArray(grid) || !Array.isArray(grid[0])) return []
  const rows = grid.length
  const cols = grid[0].length
  if (rows < 3 || cols < 3) return []
  const t = Number.isFinite(threshold) ? threshold : Number.POSITIVE_INFINITY
  const picks = []
  for (let r = 1; r < rows - 1; r += 1) {
    for (let c = 1; c < cols - 1; c += 1) {
      const center = toFinite(grid[r]?.[c], NaN)
      if (!Number.isFinite(center) || center < t) continue
      let isPeak = true
      for (let dr = -1; dr <= 1 && isPeak; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          if (dr === 0 && dc === 0) continue
          const neighbor = toFinite(grid[r + dr]?.[c + dc], Number.NEGATIVE_INFINITY)
          if (neighbor > center) {
            isPeak = false
            break
          }
        }
      }
      if (isPeak) picks.push({ row: r, col: c, value: center })
    }
  }
  picks.sort((a, b) => b.value - a.value)
  return picks.slice(0, Math.max(1, Math.floor(limit)))
}

const mpiSummary = computed(() => buildMpiSummary(props.mpiGrid))
const sectionRetainedRatio = computed(() => (sectionEnabled.value ? Math.max(0.05, Math.min(0.95, toFinite(sectionRatio.value, 0.58))) : 1))
const hotspotCandidates = computed(() => detectHotspots(props.mpiGrid, mpiSummary.value.p90, 14))
const hotspotTopList = computed(() => {
  return hotspotCandidates.value.slice(0, 3).map((item, index) => {
    return `#${index + 1} r${item.row}, c${item.col}, ${formatValue(item.value)} MPa`
  })
})
const boreholeDensityKm2 = computed(() => {
  const b = dataBounds.value
  const spanX = Math.max(toFinite(b.max_x - b.min_x, 0), 1e-6)
  const spanY = Math.max(toFinite(b.max_y - b.min_y, 0), 1e-6)
  const area = spanX * spanY
  if (!Number.isFinite(area) || area <= 0) return NaN
  return boreholeCount.value / (area / 1_000_000)
})
const heterogeneityScore = computed(() => {
  const cv = Math.abs(toFinite(mpiSummary.value.cv, NaN))
  const skew = Math.abs(toFinite(mpiSummary.value.skewness, NaN))
  const entropy = toFinite(mpiSummary.value.entropyNorm, NaN)
  const cvNorm = Number.isFinite(cv) ? Math.max(0, Math.min(1, cv / 1.5)) : 0
  const skewNorm = Number.isFinite(skew) ? Math.max(0, Math.min(1, skew / 2.5)) : 0
  const entropyNorm = Number.isFinite(entropy) ? Math.max(0, Math.min(1, entropy)) : 0
  return 0.45 * cvNorm + 0.25 * skewNorm + 0.3 * entropyNorm
})
const heterogeneityClass = computed(() => {
  const score = heterogeneityScore.value
  if (!Number.isFinite(score)) return 'undetermined'
  if (score >= 0.72) return 'strongly heterogeneous'
  if (score >= 0.48) return 'moderately heterogeneous'
  if (score >= 0.24) return 'weakly heterogeneous'
  return 'internally uniform'
})
const hotspotRegime = computed(() => {
  const count = hotspotCandidates.value.length
  const coverage = toFinite(mpiSummary.value.p90Cover, NaN)
  if (!count) return 'no resolved hotspot'
  if (count >= 6 || coverage >= 0.18) return 'multi-core hotspot field'
  if (count >= 3 || coverage >= 0.11) return 'clustered hotspot belt'
  return 'isolated hotspot core'
})
const samplingClass = computed(() => {
  const density = toFinite(boreholeDensityKm2.value, NaN)
  const anchors = stressAnchorItems.value.length
  if (Number.isFinite(density) && density >= 4 && anchors >= 3) return 'dense control'
  if (Number.isFinite(density) && density >= 1.5 && anchors >= 2) return 'moderate control'
  if (anchors >= 1) return 'anchor-limited control'
  return 'low control'
})
const diagnosticBadges = computed(() => ([
  {
    label: publicationLabels.fabric,
    value: heterogeneityClass.value,
    tone: heterogeneityScore.value >= 0.48 ? 'warn' : 'calm',
  },
  {
    label: publicationLabels.hotspot,
    value: hotspotRegime.value,
    tone: hotspotCandidates.value.length >= 3 ? 'risk' : 'calm',
  },
  {
    label: publicationLabels.sampling,
    value: samplingClass.value,
    tone: samplingClass.value === 'low control' ? 'risk' : samplingClass.value === 'anchor-limited control' ? 'warn' : 'calm',
  },
]))
const publicationLabels = buildPublicationLabelSet({
  title: 'Title',
  finding: 'Finding',
  support: 'Support',
  data: 'Data',
  frame: 'Frame',
  abbrev: 'Abbrev.',
  seam: 'Seam',
  fusion: 'Fusion',
  resolution: 'Resolution',
  stressPrior: 'Stress prior',
  section: 'Section',
  control: 'Control',
  fabric: 'Fabric',
  hotspot: 'Hotspot',
  sampling: 'Sampling',
  methodsPanel: 'Methods and provenance',
  depthGuideTitle: 'Stratigraphic depth guide',
  insetTitle: 'Plan-view MPI inset',
  insetCaption: 'Line = section, circles = hotspots',
  distributionTitle: 'MPI distribution',
  sectionTransectTitle: 'Section transect',
  xSectionTransectTitle: 'X-direction section transect',
  ySectionTransectTitle: 'Y-direction section transect',
  representativeTransectTitle: 'Representative lateral transect',
  peakFallback: 'Peak --',
  spreadFallback: 'Band = local interquartile envelope.',
})
const methodProvenanceRows = computed(() => {
  const resolution = Number(props.contextMeta?.resolution)
  const method = String(props.contextMeta?.method || '').trim().toUpperCase() || 'UNSPECIFIED'
  const source = stressProfileLabel.value
  const seam = String(props.contextMeta?.seam || '--')
  const anchorCount = stressAnchorItems.value.length
  const sectionMode = sectionEnabled.value
    ? `${sectionAxis.value.toUpperCase()} @ ${formatValue(sectionThreshold.value)}`
    : 'not applied'

  return buildPublicationRows([
    { label: publicationLabels.seam, value: seam },
    { label: publicationLabels.fusion, value: `${method} on ${gridShapeText.value} grid` },
    { label: publicationLabels.resolution, value: Number.isFinite(resolution) ? `${formatValue(resolution)} m` : 'not reported' },
    { label: publicationLabels.stressPrior, value: `${source} | focus ${stressFocusLabel.value}` },
    { label: publicationLabels.section, value: sectionMode },
    { label: publicationLabels.control, value: `${boreholeCount.value} boreholes, ${anchorCount} anchors` },
  ])
})
const paperNotation = computed(() => {
  const rawPanelLabel = String(props.panelLabel || 'Fig. 1').trim()
  const normalizedFigureLabel = rawPanelLabel
    ? rawPanelLabel.replace(/^fig\.?\s*/i, 'Figure ').replace(/^figure\s*/i, 'Figure ')
    : 'Figure 1'
  const figureTitle = props.title || '3D geology-stress fusion figure'

  return {
    metricUnit: 'MPa',
    depthUnit: 'm',
    densityUnit: 'boreholes km^-2',
    spatialFrameLabel: 'X east / Y north',
    sampleSizeLabel: `n = ${mpiSummary.value.count || 0}`,
    figureHeading: `${normalizedFigureLabel} | Geological-stress fusion diagnostics`,
    captionTitle: `${normalizedFigureLabel}. ${figureTitle}`,
    summaryLead: summaryCopy.value.summaryLead,
    metricLine: summaryCopy.value.metricLine,
    quantileLine: summaryCopy.value.quantileLine,
    coverLine: summaryCopy.value.coverLine,
    distributionLine: summaryCopy.value.distributionLine,
    supportLine: summaryCopy.value.supportLine,
    methodsFooter: buildPublicationMethodsFooter({
      subject: `${metricLabel.value}-geology fusion figure`,
      source: `${String(props.contextMeta?.method || '--').toUpperCase()} fusion`,
      seam: String(props.contextMeta?.seam || ''),
      details: [
        `${gridShapeText.value} grid`,
        `resolution ${formatValue(props.contextMeta?.resolution)} m`,
        `frame X east / Y north`,
        `scale ${scaleBarLabel.value}`,
      ],
    }),
    abbreviationsLine: 'MPI, mining pressure index; CV, coefficient of variation; IQR, interquartile range; Q1/Q2/Q3, 25th/50th/75th percentiles; P90, 90th percentile.',
  }
})
const publicationHeaderChips = computed(() => ([
  `seam ${String(props.contextMeta?.seam || '--')}`,
  `grid ${gridShapeText.value}`,
  `mean ${formatValue(mpiSummary.value.mean)}`,
  `P90 cover ${formatPercent(mpiSummary.value.p90Cover)}`,
  `anchors ${stressAnchorItems.value.length}`,
  `method ${String(props.contextMeta?.method || '--').toUpperCase()}`
]))
const diagnosticCopy = computed(() => buildPublicationDiagnosticCopy({
  profileSource: stressProfileLabel.value,
  focus: stressFocusLabel.value,
  seam: String(props.contextMeta?.seam || '--'),
  grid: gridShapeText.value,
  method: String(props.contextMeta?.method || '--'),
  resolution: `${formatValue(props.contextMeta?.resolution)} m`,
  layerCount: layerCount.value,
  boreholeCount: boreholeCount.value,
  anchorCount: stressAnchorItems.value.length,
  depthMax: formatValue(dataBounds.value.max_z),
  depthMin: formatValue(dataBounds.value.min_z),
  depthUnit: paperNotation.value.depthUnit,
}))
const figureHeaderCopy = computed(() => buildPublicationFigureHeaderCopy({
  seam: String(props.contextMeta?.seam || '--'),
  grid: gridShapeText.value,
  method: String(props.contextMeta?.method || '--'),
  layerCount: layerCount.value,
  boreholeCount: boreholeCount.value,
  anchorCount: stressAnchorItems.value.length,
  focus: stressFocusLabel.value,
}))
const heroCopy = computed(() => buildPublicationHeroCopy({
  metricLabel: metricLabel.value,
  metricUnit: paperNotation.value.metricUnit,
  mean: formatValue(mpiSummary.value.mean),
  cv: formatValue(mpiSummary.value.cv),
  p90Cover: formatPercent(mpiSummary.value.p90Cover),
  iqr: formatValue(mpiSummary.value.iqr),
  entropy: formatValue(mpiSummary.value.entropyNorm),
  skew: formatValue(mpiSummary.value.skewness),
}))
const legendCopy = computed(() => buildPublicationLegendCopy({
  metricLabel: metricLabel.value,
  metricUnit: paperNotation.value.metricUnit,
  depthMin: formatValue(dataBounds.value.min_z),
  depthMax: formatValue(dataBounds.value.max_z),
  depthUnit: paperNotation.value.depthUnit,
  sectionAxis: sectionAxis.value,
  sectionThreshold: formatValue(sectionThreshold.value),
  stressProfileLabel: stressProfileLabel.value,
  spatialFrameLabel: paperNotation.value.spatialFrameLabel,
}))
const summaryCopy = computed(() => buildPublicationSummaryCopy({
  figureNarrative: figureNarrative.value,
  metricLabel: metricLabel.value,
  metricKind: metricLabel.value.includes('index') ? 'index' : 'proxy',
  metricUnit: paperNotation.value.metricUnit,
  metricMin: formatValue(props.metricStats?.min),
  metricMean: formatValue(props.metricStats?.mean),
  metricMax: formatValue(props.metricStats?.max),
  sampleSizeLabel: paperNotation.value.sampleSizeLabel,
  p25: formatValue(mpiSummary.value.p25),
  p50: formatValue(mpiSummary.value.p50),
  p75: formatValue(mpiSummary.value.p75),
  cv: formatValue(mpiSummary.value.cv),
  p75Cover: formatPercent(mpiSummary.value.p75Cover),
  p90Cover: formatPercent(mpiSummary.value.p90Cover),
  sectionRetained: formatPercent(sectionRetainedRatio.value),
  entropy: formatValue(mpiSummary.value.entropyNorm),
  skewness: formatValue(mpiSummary.value.skewness),
  heterogeneity: formatValue(heterogeneityScore.value),
  boreholeDensity: formatValue(boreholeDensityKm2.value),
  densityUnit: paperNotation.value.densityUnit,
}))
const statisticCopy = computed(() => buildPublicationStatisticCopy({
  analysisTitle: 'Quantitative Highlights',
  profileTitle: 'Depth transfer profile',
  anchorTitle: 'Depth anchors',
  figureNote: 'Nature-style content panel: structure + statistics + depth coupling.',
  distributionCaption: 'Q1/Q2/Q3 markers',
  sectionRetained: formatPercent(sectionRetainedRatio.value),
  hotspotCount: hotspotCandidates.value.length,
  p25: formatValue(mpiSummary.value.p25),
  p50: formatValue(mpiSummary.value.p50),
  p75: formatValue(mpiSummary.value.p75),
}))
const publicationCaptionRows = computed(() => buildPublicationRows([
  {
    label: publicationLabels.title,
    value: paperNotation.value.captionTitle,
  },
  {
    label: publicationLabels.finding,
    value: figureNarrative.value,
  },
  {
    label: publicationLabels.support,
    value: paperNotation.value.supportLine,
  },
]))
const publicationNoteRows = computed(() => buildPublicationRows([
  {
    label: publicationLabels.data,
    value: `${layerCount.value} layers + ${boreholeCount.value} boreholes + ${gridShapeText.value} metric grid`,
  },
  {
    label: publicationLabels.frame,
    value: `${paperNotation.value.spatialFrameLabel}; depth ${formatValue(dataBounds.value.max_z)} to ${formatValue(dataBounds.value.min_z)} ${paperNotation.value.depthUnit}; scale ${scaleBarLabel.value}`,
  },
  {
    label: publicationLabels.abbrev,
    value: paperNotation.value.abbreviationsLine,
  },
]))
const figureNarrative = computed(() => buildPublicationNarrativeSentence({
  clauses: mpiSummary.value.count
    ? [
        `${metricLabel.value} shows ${toFinite(mpiSummary.value.skewness, 0) > 0.3 ? 'right-tailed stress amplification' : toFinite(mpiSummary.value.skewness, 0) < -0.3 ? 'left-tailed attenuation' : 'near-symmetric distribution'}; strongest anomaly at ${hotspotTopList.value.length ? hotspotTopList.value[0] : 'No dominant hotspot'}`,
        `Section keeps ${formatPercent(sectionRetainedRatio.value)} of the volume, with ${heterogeneityClass.value} fabric under ${samplingClass.value}`
      ]
    : ['Metric distribution is unavailable for current selection']
}))
const profileCurvePoints = computed(() => {
  const bins = Array.isArray(props.stressProfile?.bins) ? props.stressProfile.bins : []
  const weights = Array.isArray(props.stressProfile?.weights) ? props.stressProfile.weights : []
  if (bins.length < 2 || bins.length !== weights.length) return ''
  const pairs = []
  for (let i = 0; i < bins.length; i += 1) {
    const x = toFinite(bins[i], NaN)
    const y = toFinite(weights[i], NaN)
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue
    pairs.push([Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y))])
  }
  if (pairs.length < 2) return ''
  pairs.sort((a, b) => a[0] - b[0])
  return pairs.map((pair) => `${(pair[0] * 100).toFixed(2)},${(35 - pair[1] * 34).toFixed(2)}`).join(' ')
})

const normalizeBounds = (candidate, fallbackCandidate) => {
  const b = candidate || fallbackCandidate || {}
  const minX = toFinite(b.min_x, -10)
  const maxX = toFinite(b.max_x, 10)
  const minY = toFinite(b.min_y, -10)
  const maxY = toFinite(b.max_y, 10)
  if (maxX <= minX || maxY <= minY) {
    return { min_x: -10, max_x: 10, min_y: -10, max_y: 10 }
  }
  return { min_x: minX, max_x: maxX, min_y: minY, max_y: maxY }
}

const getSectionThreshold = () => {
  const bounds = dataBounds.value
  const ratio = Math.max(0.05, Math.min(0.95, toFinite(sectionRatio.value, 0.58)))
  if (sectionAxis.value === 'x') return bounds.min_x + (bounds.max_x - bounds.min_x) * ratio
  if (sectionAxis.value === 'y') return bounds.min_y + (bounds.max_y - bounds.min_y) * ratio
  return bounds.min_z + (bounds.max_z - bounds.min_z) * ratio
}

const sectionThreshold = computed(() => getSectionThreshold())
const sectionDisplay = computed(() => `${sectionAxis.value.toUpperCase()} ${formatValue(sectionThreshold.value)}`)
const insetViewBox = '0 0 100 100'
const depthAxisTicks = computed(() => {
  const b = dataBounds.value
  const min = toFinite(b.min_z, NaN)
  const max = toFinite(b.max_z, NaN)
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return []
  const ratios = [0, 0.25, 0.5, 0.75, 1]
  return ratios.map((ratio, index) => ({
    id: index,
    y: (8 + ratio * 204).toFixed(2),
    label: formatValue(max - (max - min) * ratio),
  }))
})
const depthFocusBand = computed(() => {
  const focus = stressFocusLabel.value
  if (focus === 'shallow') return { x: 28, y: 10, w: 18, h: 52 }
  if (focus === 'deep') return { x: 28, y: 158, w: 18, h: 52 }
  return { x: 28, y: 78, w: 18, h: 64 }
})
const depthAnchorTrack = computed(() => {
  return stressAnchorItems.value.slice(0, 5).map((item, index) => ({
    ...item,
    y: (8 + item.zNorm * 204).toFixed(2),
    r: Math.max(2.3, 4.8 - index * 0.45).toFixed(2),
    shortLabel: item.name.length > 14 ? `${item.name.slice(0, 12)}..` : item.name,
  }))
})

const chooseNiceScaleLength = (span) => {
  const safeSpan = Math.max(1, toFinite(span, 1))
  const target = safeSpan * 0.25
  const exponent = Math.floor(Math.log10(target))
  const base = 10 ** exponent
  const candidates = [1, 2, 5, 10].map((v) => v * base)
  let best = candidates[0]
  let minDiff = Math.abs(target - best)
  for (const item of candidates) {
    const diff = Math.abs(target - item)
    if (diff < minDiff) {
      minDiff = diff
      best = item
    }
  }
  return Math.max(1, best)
}

const scaleBarLabel = computed(() => {
  const b = dataBounds.value
  const spanX = Math.max(toFinite(b.max_x - b.min_x, 0), 1)
  const length = chooseNiceScaleLength(spanX)
  return `${formatValue(length)} m`
})

const colorToHex = ([r, g, b]) => {
  const rr = Math.max(0, Math.min(255, Math.round(r * 255)))
  const gg = Math.max(0, Math.min(255, Math.round(g * 255)))
  const bb = Math.max(0, Math.min(255, Math.round(b * 255)))
  return `#${rr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`
}

const toHeatmapColor = (ratio) => colorToHex(getColorByRatio(ratio))

const resolveMetricRange = () => {
  const summary = mpiSummary.value
  const min = Number.isFinite(props.metricStats?.min) ? Number(props.metricStats.min) : summary.p10
  const max = Number.isFinite(props.metricStats?.max) ? Number(props.metricStats.max) : summary.p90
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return null
  return { min, max }
}

const insetHeatmapCells = computed(() => {
  const grid = props.mpiGrid
  if (!Array.isArray(grid) || !Array.isArray(grid[0])) return []
  const rows = grid.length
  const cols = grid[0].length
  if (rows < 2 || cols < 2) return []
  const metricRange = resolveMetricRange()
  if (!metricRange) return []

  const maxCells = 26
  const stepR = Math.max(1, Math.ceil(rows / maxCells))
  const stepC = Math.max(1, Math.ceil(cols / maxCells))
  const sampledRows = Math.ceil(rows / stepR)
  const sampledCols = Math.ceil(cols / stepC)
  const cellW = 100 / Math.max(sampledCols, 1)
  const cellH = 100 / Math.max(sampledRows, 1)
  const cells = []

  for (let rr = 0, sr = 0; rr < rows; rr += stepR, sr += 1) {
    for (let cc = 0, sc = 0; cc < cols; cc += stepC, sc += 1) {
      const value = toFinite(grid[rr]?.[cc], metricRange.min)
      const ratio = Math.max(0, Math.min(1, (value - metricRange.min) / (metricRange.max - metricRange.min)))
      cells.push({
        id: `${rr}-${cc}`,
        x: (sc * cellW).toFixed(3),
        y: (sr * cellH).toFixed(3),
        w: cellW.toFixed(3),
        h: cellH.toFixed(3),
        color: toHeatmapColor(ratio),
      })
    }
  }
  return cells
})

const insetSectionLine = computed(() => {
  if (!sectionEnabled.value) return null
  if (sectionAxis.value === 'x') {
    const x = Math.max(0, Math.min(100, sectionRetainedRatio.value * 100))
    return { x1: x.toFixed(3), y1: 0, x2: x.toFixed(3), y2: 100 }
  }
  if (sectionAxis.value === 'y') {
    const y = Math.max(0, Math.min(100, (1 - sectionRetainedRatio.value) * 100))
    return { x1: 0, y1: y.toFixed(3), x2: 100, y2: y.toFixed(3) }
  }
  return null
})

const insetHotspotPoints = computed(() => {
  const grid = props.mpiGrid
  if (!Array.isArray(grid) || !Array.isArray(grid[0])) return []
  const rows = grid.length
  const cols = grid[0].length
  if (rows < 2 || cols < 2) return []
  return hotspotCandidates.value.slice(0, 8).map((spot, index) => {
    const x = (spot.col / Math.max(cols - 1, 1)) * 100
    const y = (spot.row / Math.max(rows - 1, 1)) * 100
    return {
      id: `${index}-${spot.row}-${spot.col}`,
      x: x.toFixed(3),
      y: y.toFixed(3),
      r: (3.2 - index * 0.22).toFixed(2),
    }
  })
})

const histogramBars = computed(() => {
  const histogram = Array.isArray(mpiSummary.value.histogram) ? mpiSummary.value.histogram : []
  if (!histogram.length) return []
  const maxCount = Math.max(...histogram, 1)
  const gap = 0.8
  const barW = (100 - gap * (histogram.length + 1)) / histogram.length
  return histogram.map((count, index) => {
    const h = (count / maxCount) * 34
    const x = gap + index * (barW + gap)
    const y = 36 - h
    return {
      id: index,
      x: x.toFixed(3),
      y: y.toFixed(3),
      w: barW.toFixed(3),
      h: h.toFixed(3),
    }
  })
})

const histogramQuantileLines = computed(() => {
  const min = mpiSummary.value.minValue
  const max = mpiSummary.value.maxValue
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return []
  const quantiles = [
    { id: 'q25', value: mpiSummary.value.p25 },
    { id: 'q50', value: mpiSummary.value.p50 },
    { id: 'q75', value: mpiSummary.value.p75 },
  ]
  return quantiles
    .filter((item) => Number.isFinite(item.value))
    .map((item) => {
      const ratio = Math.max(0, Math.min(1, (item.value - min) / (max - min)))
      return { id: item.id, x: (ratio * 100).toFixed(3) }
    })
})

const sectionProfileDiagnostics = computed(() => buildPublicationSectionProfileDiagnostics({
  grid: props.mpiGrid,
  sectionAxis: sectionAxis.value,
  sectionRetainedRatio: sectionRetainedRatio.value,
  labels: publicationLabels,
  formatValue,
  unit: paperNotation.value.metricUnit,
}))
const sectionProfilePath = computed(() => sectionProfileDiagnostics.value.path)
const sectionUncertaintyBandPath = computed(() => sectionProfileDiagnostics.value.bandPath)
const sectionProfileGuideX = computed(() => sectionProfileDiagnostics.value.guideX)
const sectionProfileModeLabel = computed(() => sectionProfileDiagnostics.value.modeLabel)
const sectionProfilePeakLabel = computed(() => sectionProfileDiagnostics.value.peakLabel)
const sectionProfileSpreadLabel = computed(() => sectionProfileDiagnostics.value.spreadLabel)
const sectionProfileRangeLabel = computed(() => sectionProfileDiagnostics.value.rangeLabel)

const getColorByRatio = (ratio) => {
  const t = Math.max(0, Math.min(1, ratio))
  if (t < 0.5) {
    const k = t / 0.5
    const r = Math.round(49 + (244 - 49) * k)
    const g = Math.round(163 + (179 - 163) * k)
    const b = Math.round(84 + (64 - 84) * k)
    return [r / 255, g / 255, b / 255]
  }
  const k = (t - 0.5) / 0.5
  const r = Math.round(244 + (191 - 244) * k)
  const g = Math.round(179 + (74 - 179) * k)
  const b = Math.round(64 + (61 - 64) * k)
  return [r / 255, g / 255, b / 255]
}

let OrbitControlsCtor = null
let scene = null
let camera = null
let renderer = null
let controls = null
let rootGroup = null
let layerGroup = null
let boreholeGroup = null
let mpiMesh = null
let mpiContourLines = null
let stressCloudPoints = null
let stressAnchorGroup = null
let stressHotspotGroup = null
let sectionPlaneGroup = null
let activeSectionClipPlane = null
let frameId = null
let resizeObserver = null
let visibilityObserver = null
let buildVersion = 0
let isComponentAlive = false
let isDocumentVisible = true
let isHostVisible = true
let pendingRender = false
let interactionRenderFrames = 0
const dirtyFlags = reactive({
  geometry: false,
  material: false,
  section: false,
})

const disposeMaterialTextures = (material) => {
  if (!material) return
  const textureKeys = [
    'map',
    'alphaMap',
    'aoMap',
    'bumpMap',
    'normalMap',
    'roughnessMap',
    'metalnessMap',
    'emissiveMap',
    'specularMap',
  ]
  textureKeys.forEach((key) => {
    material[key]?.dispose?.()
  })
}

const disposeMaterial = (material) => {
  if (!material) return
  if (Array.isArray(material)) {
    material.forEach((item) => {
      disposeMaterialTextures(item)
      item?.dispose?.()
    })
    return
  }
  disposeMaterialTextures(material)
  material.dispose?.()
}

const disposeObject3D = (object3d) => {
  if (!object3d) return
  object3d.traverse((child) => {
    if (child.geometry?.dispose) child.geometry.dispose()
    disposeMaterial(child.material)
  })
}

const clearThree = () => {
  if (frameId) {
    cancelAnimationFrame(frameId)
    frameId = null
  }
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onDocumentVisibilityChange)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (visibilityObserver) {
    visibilityObserver.disconnect()
    visibilityObserver = null
  }
  if (controls) {
    controls.dispose()
    controls = null
  }
  if (scene) {
    disposeObject3D(scene)
    scene.clear()
    scene = null
  }
  if (renderer) {
    renderer.dispose()
    renderer = null
  }
  camera = null
  rootGroup = null
  layerGroup = null
  boreholeGroup = null
  mpiMesh = null
  mpiContourLines = null
  stressCloudPoints = null
  stressAnchorGroup = null
  stressHotspotGroup = null
  sectionPlaneGroup = null
  activeSectionClipPlane = null
  isDocumentVisible = true
  isHostVisible = true
  pendingRender = false
  interactionRenderFrames = 0
  dirtyFlags.geometry = false
  dirtyFlags.material = false
  dirtyFlags.section = false
}

const ensureThree = async () => {
  if (!OrbitControlsCtor) {
    OrbitControlsCtor = await loadOrbitControls()
  }
}

const createSectionClipPlane = () => {
  if (!sectionEnabled.value || !three) return null
  const threshold = sectionThreshold.value
  if (sectionAxis.value === 'x') return new three.Plane(new three.Vector3(-1, 0, 0), threshold)
  if (sectionAxis.value === 'y') return new three.Plane(new three.Vector3(0, -1, 0), threshold)
  return new three.Plane(new three.Vector3(0, 0, -1), threshold)
}

const applySectionClipping = () => {
  if (!renderer || !rootGroup) return
  activeSectionClipPlane = createSectionClipPlane()
  renderer.localClippingEnabled = Boolean(activeSectionClipPlane)

  rootGroup.traverse((child) => {
    if (child?.userData?.skipSectionClip) return
    if (!child.material) return

    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((material) => {
      if (!material) return
      material.clippingPlanes = activeSectionClipPlane ? [activeSectionClipPlane] : []
      material.clipShadows = Boolean(activeSectionClipPlane)
      material.needsUpdate = true
    })
  })
}

const updateDataBounds = () => {
  const xy = normalizeBounds(props.geomodel?.bounds, props.mpiBounds)
  let minZ = Number.POSITIVE_INFINITY
  let maxZ = Number.NEGATIVE_INFINITY

  const layers = props.geomodel?.layers || []
  layers.forEach((layer) => {
    const vertices = layer?.mesh?.vertices || []
    vertices.forEach((v) => {
      const z = toFinite(v?.[2], NaN)
      if (!Number.isFinite(z)) return
      if (z < minZ) minZ = z
      if (z > maxZ) maxZ = z
    })
  })

  const boreholes = props.geomodel?.boreholes || []
  boreholes.forEach((item) => {
    const thickness = Math.max(0.5, toFinite(item.total_thickness, 6))
    const zTop = 0.5
    const zBottom = -thickness
    if (zBottom < minZ) minZ = zBottom
    if (zTop > maxZ) maxZ = zTop
  })

  if (!Number.isFinite(minZ) || !Number.isFinite(maxZ) || maxZ <= minZ) {
    minZ = -10
    maxZ = 10
  }

  dataBounds.value = {
    min_x: xy.min_x,
    max_x: xy.max_x,
    min_y: xy.min_y,
    max_y: xy.max_y,
    min_z: minZ,
    max_z: maxZ,
  }
}

const buildLayerMeshes = () => {
  const layers = props.geomodel?.layers || []
  const palette = ['#99c4d5', '#c6b6d7', '#f0c2b3', '#b8d7a3', '#a8d8d0', '#e2c995']

  layers.forEach((layer, index) => {
    const mesh = layer?.mesh
    const vertices = mesh?.vertices || []
    const faces = mesh?.faces || []
    if (!Array.isArray(vertices) || vertices.length < 3 || !Array.isArray(faces) || faces.length < 1) return

    const positions = new Float32Array(vertices.length * 3)
    for (let i = 0; i < vertices.length; i += 1) {
      const v = vertices[i] || []
      positions[i * 3] = toFinite(v[0])
      positions[i * 3 + 1] = toFinite(v[1])
      positions[i * 3 + 2] = toFinite(v[2])
    }

    const indices = []
    for (let i = 0; i < faces.length; i += 1) {
      const f = faces[i] || []
      const ia = Math.max(0, Math.floor(toFinite(f[0], 0)))
      const ib = Math.max(0, Math.floor(toFinite(f[1], 0)))
      const ic = Math.max(0, Math.floor(toFinite(f[2], 0)))
      if (ia >= vertices.length || ib >= vertices.length || ic >= vertices.length) continue
      indices.push(ia, ib, ic)
    }
    if (indices.length < 3) return

    const geometry = new three.BufferGeometry()
    geometry.setAttribute('position', new three.BufferAttribute(positions, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    const material = new three.MeshStandardMaterial({
      color: palette[index % palette.length],
      side: three.DoubleSide,
      transparent: true,
      opacity: 0.46,
      roughness: 0.72,
      metalness: 0.06,
    })
    const layerMesh = new three.Mesh(geometry, material)
    layerMesh.name = `layer:${layer.name || index}`
    layerGroup.add(layerMesh)

    const edge = new three.LineSegments(
      new three.EdgesGeometry(geometry, 28),
      new three.LineBasicMaterial({ color: '#475569', transparent: true, opacity: 0.16 }),
    )
    layerGroup.add(edge)
  })
}

const computeLayerTopZ = () => {
  let maxZ = Number.NEGATIVE_INFINITY
  layerGroup?.traverse((child) => {
    if (!child.geometry?.attributes?.position) return
    const arr = child.geometry.attributes.position.array
    for (let i = 2; i < arr.length; i += 3) {
      const z = toFinite(arr[i], Number.NEGATIVE_INFINITY)
      if (z > maxZ) maxZ = z
    }
  })
  return Number.isFinite(maxZ) ? maxZ : dataBounds.value.max_z
}

const sampleGridBilinear = (grid, rows, cols, fx, fy, fallback) => {
  const cx = Math.max(0, Math.min(cols - 1, fx))
  const cy = Math.max(0, Math.min(rows - 1, fy))
  const x0 = Math.floor(cx)
  const y0 = Math.floor(cy)
  const x1 = Math.min(cols - 1, x0 + 1)
  const y1 = Math.min(rows - 1, y0 + 1)
  const tx = cx - x0
  const ty = cy - y0

  const q11 = toFinite(grid[y0]?.[x0], fallback)
  const q21 = toFinite(grid[y0]?.[x1], fallback)
  const q12 = toFinite(grid[y1]?.[x0], fallback)
  const q22 = toFinite(grid[y1]?.[x1], fallback)
  return q11 * (1 - tx) * (1 - ty) + q21 * tx * (1 - ty) + q12 * (1 - tx) * ty + q22 * tx * ty
}

const buildMpiSurface = () => {
  const grid = props.mpiGrid
  if (!Array.isArray(grid) || grid.length < 2 || !Array.isArray(grid[0]) || grid[0].length < 2) return

  const bounds = normalizeBounds(props.mpiBounds, props.geomodel?.bounds)
  const rows = grid.length
  const cols = grid[0].length
  const dx = (bounds.max_x - bounds.min_x) / (cols - 1)
  const dy = (bounds.max_y - bounds.min_y) / (rows - 1)

  let minVal = Number.POSITIVE_INFINITY
  let maxVal = Number.NEGATIVE_INFINITY
  for (const row of grid) {
    for (const raw of row) {
      const value = Number(raw)
      if (!Number.isFinite(value)) continue
      if (value < minVal) minVal = value
      if (value > maxVal) maxVal = value
    }
  }
  if (!Number.isFinite(minVal) || !Number.isFinite(maxVal) || maxVal <= minVal) return

  const topZ = computeLayerTopZ()
  const zBase = topZ + 5.6
  const zAmp = 9.4

  const positions = new Float32Array(rows * cols * 3)
  const colors = new Float32Array(rows * cols * 3)

  let ptr = 0
  let cptr = 0
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const value = toFinite(grid[r][c], minVal)
      const ratio = (value - minVal) / (maxVal - minVal)
      const z = zBase + ratio * zAmp
      const x = bounds.min_x + c * dx
      const y = bounds.max_y - r * dy
      positions[ptr] = x
      positions[ptr + 1] = y
      positions[ptr + 2] = z
      ptr += 3

      const [cr, cg, cb] = getColorByRatio(ratio)
      colors[cptr] = cr
      colors[cptr + 1] = cg
      colors[cptr + 2] = cb
      cptr += 3
    }
  }

  const indices = []
  for (let r = 0; r < rows - 1; r += 1) {
    for (let c = 0; c < cols - 1; c += 1) {
      const a = r * cols + c
      const b = a + 1
      const d = (r + 1) * cols + c
      const e = d + 1

      indices.push(a, b, e)
      indices.push(a, e, d)
    }
  }
  if (indices.length < 3) return

  const geometry = new three.BufferGeometry()
  geometry.setAttribute('position', new three.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new three.BufferAttribute(colors, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  const material = new three.MeshStandardMaterial({
    vertexColors: true,
    side: three.DoubleSide,
    transparent: true,
    opacity: 0.74,
    roughness: 0.4,
    metalness: 0.07,
  })
  mpiMesh = new three.Mesh(geometry, material)
  mpiMesh.name = 'mpi-surface'
  rootGroup.add(mpiMesh)

  const contourGeometry = new three.WireframeGeometry(geometry)
  const contourMaterial = new three.LineBasicMaterial({
    color: '#0f172a',
    transparent: true,
    opacity: 0.18,
  })
  mpiContourLines = new three.LineSegments(contourGeometry, contourMaterial)
  mpiContourLines.name = 'mpi-contours'
  rootGroup.add(mpiContourLines)
}

const getCloudColor = (ratio) => {
  const t = Math.max(0, Math.min(1, ratio))
  if (t < 0.5) {
    const k = t / 0.5
    const r = Math.round(38 + (251 - 38) * k)
    const g = Math.round(120 + (191 - 120) * k)
    const b = Math.round(198 + (86 - 198) * k)
    return [r / 255, g / 255, b / 255]
  }
  const k = (t - 0.5) / 0.5
  const r = Math.round(251 + (190 - 251) * k)
  const g = Math.round(191 + (56 - 191) * k)
  const b = Math.round(86 + (46 - 86) * k)
  return [r / 255, g / 255, b / 255]
}

const defaultDepthTransfer = (zNorm) => {
  const d1 = Math.exp(-((zNorm - 0.28) ** 2) / (2 * 0.13 ** 2))
  const d2 = 0.65 * Math.exp(-((zNorm - 0.68) ** 2) / (2 * 0.1 ** 2))
  return Math.max(0, Math.min(1, d1 + d2))
}

const buildDepthTransferSampler = () => {
  const binsRaw = Array.isArray(props.stressProfile?.bins) ? props.stressProfile.bins : []
  const weightsRaw = Array.isArray(props.stressProfile?.weights) ? props.stressProfile.weights : []
  if (binsRaw.length < 2 || binsRaw.length !== weightsRaw.length) {
    return (zNorm) => defaultDepthTransfer(zNorm)
  }

  const pairs = []
  for (let i = 0; i < binsRaw.length; i += 1) {
    const z = toFinite(binsRaw[i], NaN)
    const w = toFinite(weightsRaw[i], NaN)
    if (!Number.isFinite(z) || !Number.isFinite(w)) continue
    pairs.push([Math.max(0, Math.min(1, z)), Math.max(0, Math.min(1, w))])
  }
  if (pairs.length < 2) {
    return (zNorm) => defaultDepthTransfer(zNorm)
  }

  pairs.sort((a, b) => a[0] - b[0])
  return (zNorm) => {
    const z = Math.max(0, Math.min(1, zNorm))
    if (z <= pairs[0][0]) return pairs[0][1]
    if (z >= pairs[pairs.length - 1][0]) return pairs[pairs.length - 1][1]

    for (let i = 1; i < pairs.length; i += 1) {
      const left = pairs[i - 1]
      const right = pairs[i]
      if (z <= right[0]) {
        const denom = Math.max(right[0] - left[0], 1e-6)
        const t = (z - left[0]) / denom
        return left[1] + (right[1] - left[1]) * t
      }
    }
    return pairs[pairs.length - 1][1]
  }
}

const buildStressCloud = () => {
  const grid = props.mpiGrid
  if (!Array.isArray(grid) || grid.length < 2 || !Array.isArray(grid[0]) || grid[0].length < 2) return

  const bounds = normalizeBounds(props.mpiBounds, props.geomodel?.bounds)
  const rows = grid.length
  const cols = grid[0].length

  let minVal = Number.POSITIVE_INFINITY
  let maxVal = Number.NEGATIVE_INFINITY
  for (const row of grid) {
    for (const raw of row) {
      const value = Number(raw)
      if (!Number.isFinite(value)) continue
      if (value < minVal) minVal = value
      if (value > maxVal) maxVal = value
    }
  }
  if (!Number.isFinite(minVal) || !Number.isFinite(maxVal) || maxVal <= minVal) return

  const b = dataBounds.value
  const spanX = Math.max(bounds.max_x - bounds.min_x, 1)
  const spanY = Math.max(bounds.max_y - bounds.min_y, 1)
  const spanZ = Math.max(b.max_z - b.min_z, 1)
  const density = Math.max(0.25, Math.min(1, toFinite(cloudDensity.value, 0.7)))
  const step = density >= 0.9 ? 1 : density >= 0.7 ? 2 : density >= 0.5 ? 3 : 4
  const zSlices = Math.max(12, Math.round(18 + density * 22))
  const cutoff = 0.33 - density * 0.08
  const sampleDepthTransfer = buildDepthTransferSampler()
  const useTopDepthNorm = hasStressProfileSamples.value

  const positions = []
  const colors = []
  for (let r = 0; r < rows; r += step) {
    for (let c = 0; c < cols; c += step) {
      const fx = (c / (cols - 1)) * (cols - 1)
      const fy = (r / (rows - 1)) * (rows - 1)
      const baseVal = sampleGridBilinear(grid, rows, cols, fx, fy, minVal)
      const baseNorm = (baseVal - minVal) / (maxVal - minVal)
      const x = bounds.min_x + (c / (cols - 1)) * spanX
      const y = bounds.max_y - (r / (rows - 1)) * spanY

      for (let zi = 0; zi < zSlices; zi += 1) {
        const zNorm = zi / (zSlices - 1)
        const z = b.min_z + zNorm * spanZ
        const depthCoord = useTopDepthNorm ? (1 - zNorm) : zNorm
        const depthProfile = sampleDepthTransfer(depthCoord)
        const noise = 0.9 + 0.1 * Math.sin(x * 0.04 + y * 0.03 + z * 0.08)
        const stressNorm = Math.max(0, Math.min(1, baseNorm * (0.5 + 0.5 * depthProfile) * noise))
        if (stressNorm < cutoff) continue

        positions.push(x, y, z)
        const [cr, cg, cb] = getCloudColor(stressNorm)
        colors.push(cr, cg, cb)
      }
    }
  }
  if (positions.length < 9) return

  const geometry = new three.BufferGeometry()
  geometry.setAttribute('position', new three.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new three.Float32BufferAttribute(colors, 3))

  const material = new three.PointsMaterial({
    size: Math.max(Math.max(spanX, spanY) / 220, 0.34),
    vertexColors: true,
    transparent: true,
    opacity: 0.26,
    depthWrite: false,
    blending: three.AdditiveBlending,
    sizeAttenuation: true,
  })

  stressCloudPoints = new three.Points(geometry, material)
  stressCloudPoints.name = 'stress-cloud-volume'
  rootGroup.add(stressCloudPoints)
}

const buildStressAnchors = () => {
  if (!rootGroup || !hasStressAnchors.value) return

  const bounds = normalizeBounds(props.mpiBounds, props.geomodel?.bounds)
  const b = dataBounds.value
  const spanX = Math.max(bounds.max_x - bounds.min_x, 1)
  const spanY = Math.max(bounds.max_y - bounds.min_y, 1)
  const centerX = (bounds.min_x + bounds.max_x) / 2
  const centerY = (bounds.min_y + bounds.max_y) / 2

  stressAnchorGroup = new three.Group()
  stressAnchorGroup.name = 'stress-anchor-bands'

  for (const anchor of stressAnchorItems.value.slice(0, 6)) {
    const z = toFinite(anchor.zWorld, NaN)
    if (!Number.isFinite(z)) continue

    const importance = Math.max(0, Math.min(1, toFinite(anchor.importance, 0)))
    const color = new three.Color().setHSL(0.58 - importance * 0.28, 0.78, 0.52)

    const band = new three.Mesh(
      new three.PlaneGeometry(spanX, spanY),
      new three.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.06 + importance * 0.12,
        side: three.DoubleSide,
        depthWrite: false,
      }),
    )
    band.position.set(centerX, centerY, z)
    stressAnchorGroup.add(band)

    const edge = new three.LineSegments(
      new three.EdgesGeometry(band.geometry),
      new three.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.28 + importance * 0.35,
      }),
    )
    edge.position.copy(band.position)
    edge.rotation.copy(band.rotation)
    stressAnchorGroup.add(edge)
  }

  if (stressAnchorGroup.children.length > 0) {
    rootGroup.add(stressAnchorGroup)
  } else {
    stressAnchorGroup = null
  }
}

const createHotspotLabelSprite = (index, radius) => {
  if (!three || typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const center = 64
  const baseR = 48
  ctx.clearRect(0, 0, 128, 128)
  ctx.beginPath()
  ctx.arc(center, center, baseR, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.fill()
  ctx.lineWidth = 7
  ctx.strokeStyle = 'rgba(15,23,42,0.84)'
  ctx.stroke()
  ctx.fillStyle = '#0f172a'
  ctx.font = '700 56px "Segoe UI", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(index), center, center + 2)
  const texture = new three.CanvasTexture(canvas)
  texture.colorSpace = three.SRGBColorSpace || texture.colorSpace
  const material = new three.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  })
  const sprite = new three.Sprite(material)
  const scale = Math.max(radius * 3.8, 1.8)
  sprite.scale.set(scale, scale, 1)
  sprite.renderOrder = 9
  return sprite
}

const buildStressHotspots = () => {
  if (!rootGroup) return
  const grid = props.mpiGrid
  if (!Array.isArray(grid) || !Array.isArray(grid[0])) return

  const rows = grid.length
  const cols = grid[0].length
  if (rows < 2 || cols < 2) return

  const bounds = normalizeBounds(props.mpiBounds, props.geomodel?.bounds)
  const spanX = Math.max(bounds.max_x - bounds.min_x, 1)
  const spanY = Math.max(bounds.max_y - bounds.min_y, 1)
  const topZ = computeLayerTopZ()
  const zBase = topZ + 5.6
  const zAmp = 9.4
  const summary = mpiSummary.value
  const minVal = Number.isFinite(props.metricStats?.min) ? Number(props.metricStats.min) : summary.p10
  const maxVal = Number.isFinite(props.metricStats?.max) ? Number(props.metricStats.max) : summary.p90
  if (!Number.isFinite(minVal) || !Number.isFinite(maxVal) || maxVal <= minVal) return
  if (!hotspotCandidates.value.length) return

  stressHotspotGroup = new three.Group()
  stressHotspotGroup.name = 'stress-hotspots'

  const radius = Math.max(Math.max(spanX, spanY) / 185, 0.38)
  const stemBottom = dataBounds.value.min_z - 1

  hotspotCandidates.value.slice(0, 10).forEach((candidate, index) => {
    const value = toFinite(candidate.value, NaN)
    if (!Number.isFinite(value)) return
    const ratio = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)))
    const x = bounds.min_x + (candidate.col / (cols - 1)) * spanX
    const y = bounds.max_y - (candidate.row / (rows - 1)) * spanY
    const z = zBase + ratio * zAmp
    const color = new three.Color().setHSL(0.1 - ratio * 0.1, 0.82, 0.5)

    const marker = new three.Mesh(
      new three.SphereGeometry(radius, 20, 14),
      new three.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: 0.92,
        emissive: color.clone().multiplyScalar(0.2),
        roughness: 0.35,
        metalness: 0.18,
      }),
    )
    marker.position.set(x, y, z)
    stressHotspotGroup.add(marker)

    const label = createHotspotLabelSprite(index + 1, radius)
    if (label) {
      label.position.set(x, y, z + radius * 2.25)
      stressHotspotGroup.add(label)
    }

    const lineGeometry = new three.BufferGeometry().setFromPoints([
      new three.Vector3(x, y, stemBottom),
      new three.Vector3(x, y, z - radius * 1.1),
    ])
    const line = new three.Line(
      lineGeometry,
      new three.LineDashedMaterial({
        color,
        transparent: true,
        opacity: 0.52,
        dashSize: Math.max((z - stemBottom) * 0.05, 0.5),
        gapSize: 0.28,
      }),
    )
    line.computeLineDistances()
    stressHotspotGroup.add(line)
  })

  if (stressHotspotGroup.children.length > 0) {
    rootGroup.add(stressHotspotGroup)
  } else {
    stressHotspotGroup = null
  }
}

const buildBoreholes = () => {
  const boreholes = props.geomodel?.boreholes || []
  const bounds = normalizeBounds(props.geomodel?.bounds, props.mpiBounds)
  const span = Math.max(bounds.max_x - bounds.min_x, bounds.max_y - bounds.min_y, 1)
  const radius = Math.max(span * 0.0055, 0.32)

  boreholes.forEach((item) => {
    const x = toFinite(item.x)
    const y = toFinite(item.y)
    const thickness = Math.max(0.5, toFinite(item.total_thickness, 6))
    const zTop = 0.5
    const zBottom = -thickness

    const height = Math.max(0, zTop - zBottom)
    if (height <= 0.12) return

    const column = new three.Mesh(
      new three.CylinderGeometry(radius, radius, height, 18, 1, true),
      new three.MeshStandardMaterial({
        color: '#1f2937',
        transparent: true,
        opacity: 0.5,
        roughness: 0.72,
        metalness: 0.08,
      }),
    )
    column.position.set(x, y, zBottom + height / 2)
    boreholeGroup.add(column)

    const marker = new three.Mesh(
      new three.SphereGeometry(radius * 1.14, 16, 12),
      new three.MeshStandardMaterial({ color: '#d97706', roughness: 0.45, metalness: 0.05 }),
    )
    marker.position.set(x, y, zTop + radius * 0.72)
    boreholeGroup.add(marker)
  })
}

const clearSectionPlane = () => {
  if (!sectionPlaneGroup) return
  if (rootGroup) rootGroup.remove(sectionPlaneGroup)
  disposeObject3D(sectionPlaneGroup)
  sectionPlaneGroup = null
}

const buildSectionPlane = () => {
  clearSectionPlane()
  if (!sectionEnabled.value || !rootGroup) return
  const b = dataBounds.value
  const spanX = Math.max(b.max_x - b.min_x, 1)
  const spanY = Math.max(b.max_y - b.min_y, 1)
  const spanZ = Math.max(b.max_z - b.min_z, 1)
  const threshold = sectionThreshold.value

  sectionPlaneGroup = new three.Group()
  const material = new three.MeshBasicMaterial({
    color: '#0ea5a8',
    transparent: true,
    opacity: 0.12,
    side: three.DoubleSide,
    depthWrite: false,
  })

  let plane = null
  if (sectionAxis.value === 'x') {
    plane = new three.Mesh(new three.PlaneGeometry(spanY, spanZ), material)
    plane.rotation.y = Math.PI / 2
    plane.position.set(threshold, (b.min_y + b.max_y) / 2, (b.min_z + b.max_z) / 2)
  } else if (sectionAxis.value === 'y') {
    plane = new three.Mesh(new three.PlaneGeometry(spanX, spanZ), material)
    plane.rotation.x = -Math.PI / 2
    plane.position.set((b.min_x + b.max_x) / 2, threshold, (b.min_z + b.max_z) / 2)
  } else {
    plane = new three.Mesh(new three.PlaneGeometry(spanX, spanY), material)
    plane.position.set((b.min_x + b.max_x) / 2, (b.min_y + b.max_y) / 2, threshold)
  }

  const edge = new three.LineSegments(
    new three.EdgesGeometry(plane.geometry),
    new three.LineBasicMaterial({ color: '#0f766e', transparent: true, opacity: 0.55 }),
  )
  edge.position.copy(plane.position)
  edge.rotation.copy(plane.rotation)

  plane.userData.skipSectionClip = true
  edge.userData.skipSectionClip = true
  sectionPlaneGroup.add(plane)
  sectionPlaneGroup.add(edge)
  rootGroup.add(sectionPlaneGroup)
}

const updateSectionState = () => {
  if (!renderer || !rootGroup) return
  dirtyFlags.section = true
  applySectionClipping()
  buildSectionPlane()
  dirtyFlags.section = false
  markSceneDirty(2)
}

const fitCamera = () => {
  if (!rootGroup || !camera || !controls || !three) return
  const box = new three.Box3().setFromObject(rootGroup)
  if (box.isEmpty()) return

  const size = box.getSize(new three.Vector3())
  const center = box.getCenter(new three.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z, 1)
  const distance = maxDim * 2.05

  camera.position.set(center.x + distance, center.y + distance * 0.72, center.z + distance * 0.52)
  camera.near = Math.max(0.1, maxDim / 600)
  camera.far = Math.max(2000, maxDim * 12)
  camera.updateProjectionMatrix()
  controls.target.copy(center)
  controls.update()
  markSceneDirty(12)
}

const resetView = () => {
  if (rootGroup) rootGroup.rotation.set(0, 0, 0)
  fitCamera()
}

const applyPaperViewPose = () => {
  if (!rootGroup || !camera || !controls || !three) return
  const box = new three.Box3().setFromObject(rootGroup)
  if (box.isEmpty()) return

  const size = box.getSize(new three.Vector3())
  const center = box.getCenter(new three.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z, 1)

  const azimuth = three.MathUtils.degToRad(32)
  const elevation = three.MathUtils.degToRad(27)
  const radius = maxDim * 2.45
  const horizontal = radius * Math.cos(elevation)

  camera.position.set(
    center.x + horizontal * Math.cos(azimuth),
    center.y + horizontal * Math.sin(azimuth),
    center.z + radius * Math.sin(elevation),
  )
  camera.near = Math.max(0.1, maxDim / 700)
  camera.far = Math.max(2000, maxDim * 14)
  camera.updateProjectionMatrix()
  controls.target.copy(center)
  controls.update()
  markSceneDirty(12)
}

let geoFusionExportPromise = null

const loadGeoFusionExport = async () => {
  if (!geoFusionExportPromise) {
    geoFusionExportPromise = import('../utils/geoFusionExport.js')
  }
  return geoFusionExportPromise
}

const buildExportSnapshot = () => {
  const narrativeLine = figureNarrative.value.length > 118 ? `${figureNarrative.value.slice(0, 118)}...` : figureNarrative.value

  return {
    metric: String(props.metric || 'mpi').toLowerCase(),
    panelLabel: String(props.panelLabel || 'Fig. 1'),
    title: props.title || '3D Geology-MPI Fusion',
    subtitle: props.subtitle || 'Preview',
    figureHeading: paperNotation.value.figureHeading,
    captionTitle: paperNotation.value.captionTitle,
    summaryLead: paperNotation.value.summaryLead,
    metricLine: paperNotation.value.metricLine,
    profileLine: diagnosticCopy.value.profileLine,
    metaLine: diagnosticCopy.value.metaLine,
    structureLine: diagnosticCopy.value.structureLine,
    quantLine: paperNotation.value.quantileLine,
    coverLine: paperNotation.value.coverLine,
    distLine: paperNotation.value.distributionLine,
    methodsLine: diagnosticCopy.value.methodsLine,
    narrativeLine,
    publicationLabels,
    hotspotRows: showHotspots.value ? hotspotTopList.value.slice(0, 2) : [],
    anchorRows: showStressCloud.value && showStressAnchors.value ? exportAnchorRows.value : [],
    methodProvenanceRows: methodProvenanceRows.value,
    publicationCaptionRows: publicationCaptionRows.value,
    publicationNoteRows: publicationNoteRows.value,
    insetHeatmapCells: insetHeatmapCells.value,
    insetSectionLine: insetSectionLine.value,
    insetHotspotPoints: insetHotspotPoints.value,
    sectionProfile: sectionProfileDiagnostics.value,
    depthGuide: {
      axisTicks: depthAxisTicks.value,
      focusBand: depthFocusBand.value,
      anchorTrack: depthAnchorTrack.value,
      notes: diagnosticCopy.value.depthNotes,
    },
    subfigureLabels: {
      inset: 'a',
      distribution: 'b',
      section: 'c',
      depth: 'd',
    },
    methodsFooter: paperNotation.value.methodsFooter,
    scaleBarLabel: scaleBarLabel.value,
    distributionTitle: `${metricLabel.value} distribution`,
    histogramBars: histogramBars.value,
    histogramQuantileLines: histogramQuantileLines.value,
    histogramFooter: paperNotation.value.distributionLine
  }
}

const exportFigureBlob = async (options = {}) => {
  const { exportGeoFusionFigureBlob } = await loadGeoFusionExport()
  return exportGeoFusionFigureBlob({
    renderer,
    scene,
    camera,
    controls,
    rootGroup,
    three,
    autoRotateRef: autoRotate,
    applyPaperViewPose,
    snapshot: buildExportSnapshot()
  }, options)
}

const exportFigure = async () => {
  if (isExporting.value) return
  isExporting.value = true
  try {
    const payload = await exportFigureBlob()
    if (!payload?.blob) return
    const url = URL.createObjectURL(payload.blob)
    const link = document.createElement('a')
    link.href = url
    link.download = payload.filename || 'fusion_figure.png'
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export fusion figure failed:', error)
  } finally {
    isExporting.value = false
  }
}

const applyVisibility = () => {
  if (layerGroup) layerGroup.visible = showLayers.value
  if (boreholeGroup) boreholeGroup.visible = showBoreholes.value
  if (mpiMesh) mpiMesh.visible = showMpiSurface.value
  if (mpiContourLines) mpiContourLines.visible = showMpiSurface.value && showMpiContours.value
  if (stressHotspotGroup) stressHotspotGroup.visible = showMpiSurface.value && showHotspots.value
  if (stressCloudPoints) stressCloudPoints.visible = showStressCloud.value
  if (stressAnchorGroup) stressAnchorGroup.visible = showStressCloud.value && showStressAnchors.value
}

const canRenderScene = () => {
  return Boolean(renderer && scene && camera && isComponentAlive && isDocumentVisible && isHostVisible)
}

const markSceneDirty = (frames = 1) => {
  pendingRender = true
  interactionRenderFrames = Math.max(interactionRenderFrames, Math.max(0, frames))
  if (!isComponentAlive) return
  updateRenderLoopState()
}

const stopRenderLoop = () => {
  if (frameId) {
    cancelAnimationFrame(frameId)
    frameId = null
  }
}

const renderLoop = () => {
  if (!canRenderScene()) {
    frameId = null
    return
  }
  frameId = null
  if (autoRotate.value && rootGroup) rootGroup.rotation.z += 0.001
  const controlsChanged = Boolean(controls?.update?.())
  renderer.render(scene, camera)
  pendingRender = false
  if (!autoRotate.value && interactionRenderFrames > 0) {
    interactionRenderFrames -= 1
  }
  if (autoRotate.value || interactionRenderFrames > 0 || controlsChanged) {
    startRenderLoop()
  }
}

const startRenderLoop = () => {
  if (frameId || !canRenderScene()) return
  if (!pendingRender && !autoRotate.value && interactionRenderFrames < 1) return
  frameId = requestAnimationFrame(renderLoop)
}

const updateRenderLoopState = () => {
  if (!canRenderScene()) {
    stopRenderLoop()
    return
  }
  if (pendingRender || autoRotate.value || interactionRenderFrames > 0) {
    startRenderLoop()
    return
  }
  stopRenderLoop()
}

const onDocumentVisibilityChange = () => {
  isDocumentVisible = document.visibilityState !== 'hidden'
  if (isDocumentVisible) pendingRender = true
  updateRenderLoopState()
}

const observeHostVisibility = () => {
  if (typeof IntersectionObserver === 'undefined' || !hostRef.value) return
  visibilityObserver = new IntersectionObserver((entries) => {
    const entry = entries[0]
    isHostVisible = Boolean(entry?.isIntersecting)
    if (isHostVisible) pendingRender = true
    updateRenderLoopState()
  }, { threshold: 0.05 })
  visibilityObserver.observe(hostRef.value)
}

const onResize = () => {
  if (!renderer || !camera || !hostRef.value) return
  const width = hostRef.value.clientWidth || 960
  const height = hostRef.value.clientHeight || 520
  renderer.setSize(width, height, false)
  camera.aspect = width / Math.max(height, 1)
  camera.updateProjectionMatrix()
  markSceneDirty(2)
}

const buildScene = async () => {
  const currentBuild = ++buildVersion
  if (!canvasRef.value || !hostRef.value) return
  if (props.loading || props.errorText || !hasRenderableData.value) {
    clearThree()
    return
  }

  clearThree()
  await ensureThree()
  if (
    !isComponentAlive
    || currentBuild !== buildVersion
    || !canvasRef.value
    || !hostRef.value
  ) return
  dirtyFlags.geometry = true
  updateDataBounds()

  scene = new three.Scene()
  const sceneBg = props.paperMode ? 0xffffff : 0xf8fafc
  scene.background = new three.Color(sceneBg)
  scene.fog = new three.Fog(sceneBg, 210, 1400)

  const width = hostRef.value?.clientWidth || 960
  const height = hostRef.value?.clientHeight || 520
  camera = new three.PerspectiveCamera(49, width / Math.max(height, 1), 0.1, 5000)
  renderer = new three.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(width, height, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  if ('outputColorSpace' in renderer && three.SRGBColorSpace) {
    renderer.outputColorSpace = three.SRGBColorSpace
  }

  controls = new OrbitControlsCtor(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.maxPolarAngle = Math.PI * 0.49
  controls.addEventListener('start', () => markSceneDirty(18))
  controls.addEventListener('change', () => markSceneDirty(12))
  controls.addEventListener('end', () => markSceneDirty(24))

  scene.add(new three.AmbientLight(0xffffff, props.paperMode ? 0.72 : 0.66))
  const keyLight = new three.DirectionalLight(0xffffff, 0.9)
  keyLight.position.set(220, 210, 260)
  scene.add(keyLight)
  const fillLight = new three.DirectionalLight(0xe2e8f0, props.paperMode ? 0.44 : 0.52)
  fillLight.position.set(-180, -150, 120)
  scene.add(fillLight)

  rootGroup = new three.Group()
  layerGroup = new three.Group()
  boreholeGroup = new three.Group()
  rootGroup.add(layerGroup)
  rootGroup.add(boreholeGroup)
  scene.add(rootGroup)

  buildLayerMeshes()
  buildMpiSurface()
  buildStressCloud()
  buildStressAnchors()
  buildStressHotspots()
  buildBoreholes()
  applyVisibility()
  updateSectionState()

  const bounds = normalizeBounds(props.geomodel?.bounds, props.mpiBounds)
  const gridHelper = new three.GridHelper(
    Math.max(bounds.max_x - bounds.min_x, bounds.max_y - bounds.min_y, 20),
    16,
    0x94a3b8,
    0xe2e8f0,
  )
  gridHelper.position.set(
    (bounds.min_x + bounds.max_x) / 2,
    (bounds.min_y + bounds.max_y) / 2,
    Math.min(dataBounds.value.min_z - 2, computeLayerTopZ() - 14),
  )
  scene.add(gridHelper)

  fitCamera()

  if (typeof ResizeObserver !== 'undefined' && hostRef.value) {
    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(hostRef.value)
  } else {
    window.addEventListener('resize', onResize)
  }
  if (!isComponentAlive || currentBuild !== buildVersion) return
  isDocumentVisible = document.visibilityState !== 'hidden'
  isHostVisible = true
  document.addEventListener('visibilitychange', onDocumentVisibilityChange)
  observeHostVisibility()
  dirtyFlags.geometry = false
  markSceneDirty(10)
}

const rebuildSceneSafe = async () => {
  try {
    await nextTick()
    await buildScene()
  } catch (error) {
    console.error('GeoMpiFusion3D build scene failed:', error)
  }
}

watch([showLayers, showMpiSurface, showMpiContours, showHotspots, showStressCloud, showStressAnchors, showBoreholes], () => {
  dirtyFlags.material = true
  applyVisibility()
  dirtyFlags.material = false
  markSceneDirty(1)
})

watch([sectionEnabled, sectionAxis, sectionRatio], async () => {
  await nextTick()
  updateSectionState()
})

watch(cloudDensity, async () => {
  await rebuildSceneSafe()
})

watch(autoRotate, (enabled) => {
  markSceneDirty(enabled ? 1 : 18)
})

watch(
  () => [props.geomodel, props.stressProfile, props.mpiGrid, props.mpiBounds, props.metric, props.loading, props.errorText],
  async () => {
    await rebuildSceneSafe()
  },
  { deep: true },
)

defineExpose({
  exportFigureBlob,
})

onMounted(async () => {
  isComponentAlive = true
  await rebuildSceneSafe()
})

onBeforeUnmount(() => {
  isComponentAlive = false
  buildVersion += 1
  clearThree()
})
</script>

<style scoped>
.geo-mpi-fusion {
  border: 1px solid #d8e6e3;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbfb 100%);
  overflow: hidden;
}

.geo-mpi-fusion.paper {
  border-color: #cbd5e1;
  background: #ffffff;
}

.fusion-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-bottom: 1px solid #d8e6e3;
  background: rgba(255, 255, 255, 0.96);
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.paper-frame {
  display: grid;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid #dbe4ea;
  border-radius: 12px;
  background: linear-gradient(180deg, #f8fbfc 0%, #ffffff 100%);
}

.paper-frame-head {
  display: grid;
  gap: 4px;
}

.paper-frame-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.paper-frame-summary {
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
  color: #475569;
}

.paper-frame-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.paper-frame-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  font-size: 11px;
}

.paper-frame-footer {
  margin: 0;
  font-size: 11px;
  line-height: 1.6;
  color: #526071;
}

.title-wrap h3 {
  margin: 0;
  font-size: 15px;
  color: #0f172a;
}

.title-wrap p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #64748b;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #475569;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #d8e6e3;
  border-radius: 999px;
  background: #f8fafc;
  color: #334155;
  padding: 3px 8px;
  font-size: 11px;
}

.toggle input {
  accent-color: #0f766e;
}

.axis {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #d8e6e3;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  padding: 3px 8px;
  font-size: 11px;
}

.axis select {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 11px;
  color: #0f172a;
  padding: 2px 4px;
  background: #ffffff;
}

.slider {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #d8e6e3;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  padding: 3px 8px;
  font-size: 11px;
}

.slider input {
  width: 110px;
}

.slider.density input {
  width: 88px;
}

.slider.disabled {
  opacity: 0.5;
}

.ghost-btn {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
}

.ghost-btn:hover {
  border-color: #0f766e;
  color: #0f766e;
}

.ghost-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.export-btn {
  min-width: 104px;
}

.refresh-btn {
  border: 1px solid #0f766e;
  border-radius: 8px;
  background: #0f766e;
  color: #ffffff;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}

.refresh-btn:hover {
  background: #0d6b63;
}

.viewer-body {
  position: relative;
  height: 540px;
}

.fusion-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.figure-overlay {
  position: absolute;
  left: 12px;
  top: 12px;
  max-width: 560px;
  border: 1px solid rgba(15, 23, 42, 0.18);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
  padding: 10px 12px;
  pointer-events: none;
}

.figure-topline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  height: 22px;
  border-radius: 999px;
  background: #0f172a;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.figure-topic {
  font-size: 11px;
  letter-spacing: 0.04em;
  font-weight: 700;
  color: #334155;
}

.figure-headline {
  margin: 7px 0 0;
  font-size: 14px;
  line-height: 1.35;
  color: #0f172a;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
}

.figure-meta {
  margin: 6px 0 0;
  font-size: 11px;
  color: #475569;
}

.figure-kpis {
  margin-top: 6px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.figure-kpis span {
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 999px;
  background: #f8fafc;
  color: #1e293b;
  padding: 2px 7px;
  font-size: 10px;
  font-weight: 600;
}

.content-metrics {
  margin-top: 7px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 3px 8px;
}

.content-metrics p {
  margin: 0;
  font-size: 10px;
  color: #334155;
  font-weight: 600;
}

.diagnostic-badges {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.methods-panel {
  margin-top: 8px;
  border-top: 1px dashed rgba(100, 116, 139, 0.34);
  padding-top: 7px;
  display: grid;
  gap: 4px;
}

.methods-title {
  margin: 0;
  font-size: 10px;
  font-weight: 700;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.methods-row {
  margin: 0;
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr);
  gap: 8px;
  font-size: 10px;
  color: #334155;
}

.methods-key {
  font-weight: 700;
  color: #475569;
}

.methods-value {
  color: #1e293b;
}

.diagnostic-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 10px;
  line-height: 1;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(248, 250, 252, 0.94);
  color: #1e293b;
}

.diagnostic-badge strong {
  font-weight: 700;
}

.diagnostic-badge em {
  font-style: normal;
  opacity: 0.9;
}

.diagnostic-badge.tone-calm {
  border-color: rgba(15, 118, 110, 0.3);
  background: rgba(240, 253, 250, 0.98);
  color: #115e59;
}

.diagnostic-badge.tone-warn {
  border-color: rgba(202, 138, 4, 0.34);
  background: rgba(254, 252, 232, 0.98);
  color: #854d0e;
}

.diagnostic-badge.tone-risk {
  border-color: rgba(185, 28, 28, 0.24);
  background: rgba(254, 242, 242, 0.98);
  color: #991b1b;
}

.figure-note {
  margin: 7px 0 0;
  font-size: 10px;
  color: #64748b;
}

.legend-overlay {
  position: absolute;
  left: 12px;
  bottom: 12px;
  min-width: 210px;
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
  padding: 10px 12px;
  pointer-events: none;
}

.legend-title {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

.legend-bar {
  position: relative;
  margin-top: 6px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #31a354 0%, #f4b340 56%, #bf4a3d 100%);
}

.legend-tick {
  position: absolute;
  top: -2px;
  width: 1px;
  height: 14px;
  background: rgba(15, 23, 42, 0.55);
}

.legend-tick:nth-child(1) {
  left: 0;
}

.legend-tick:nth-child(2) {
  left: 50%;
  transform: translateX(-0.5px);
}

.legend-tick:nth-child(3) {
  right: 0;
}

.legend-range {
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 11px;
}

.section-hint {
  margin: 7px 0 0;
  font-size: 11px;
  color: #0f766e;
  font-weight: 600;
}

.section-hint.cloud-hint {
  color: #7c2d12;
}

.profile-curve-wrap {
  margin-top: 7px;
  border-top: 1px dashed rgba(100, 116, 139, 0.32);
  padding-top: 6px;
}

.profile-title {
  margin: 0;
  font-size: 10px;
  font-weight: 700;
  color: #0f172a;
}

.profile-curve {
  margin-top: 4px;
  display: block;
  width: 100%;
  height: 44px;
}

.profile-axis {
  stroke: rgba(71, 85, 105, 0.55);
  stroke-width: 1;
}

.profile-line {
  fill: none;
  stroke: #0f766e;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.anchor-list {
  margin-top: 7px;
  border-top: 1px dashed rgba(100, 116, 139, 0.38);
  padding-top: 6px;
}

.anchor-title {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
}

.anchor-item {
  margin: 3px 0 0;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 10px;
  color: #334155;
}

.anchor-name {
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

.anchor-meta {
  color: #64748b;
}

.depth-strip-wrap {
  margin-top: 8px;
  border-top: 1px dashed rgba(100, 116, 139, 0.38);
  padding-top: 7px;
  position: relative;
}

.depth-strip-title {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
}

.depth-strip-layout {
  margin-top: 6px;
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
}

.depth-strip {
  width: 88px;
  height: 220px;
  display: block;
  border: 1px solid rgba(100, 116, 139, 0.24);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.98) 100%);
}

.depth-strip-bg {
  fill: rgba(226, 232, 240, 0.95);
  stroke: rgba(100, 116, 139, 0.38);
  stroke-width: 1;
}

.depth-focus-band {
  fill: rgba(15, 118, 110, 0.18);
  stroke: rgba(15, 118, 110, 0.55);
  stroke-width: 1;
}

.depth-axis-line {
  stroke: rgba(15, 23, 42, 0.58);
  stroke-width: 1.1;
}

.depth-tick-line {
  stroke: rgba(100, 116, 139, 0.7);
  stroke-width: 1;
}

.depth-tick-label {
  fill: #475569;
  font-size: 8px;
  font-family: 'Consolas', 'SFMono-Regular', 'Menlo', monospace;
}

.depth-anchor-line {
  stroke: rgba(185, 28, 28, 0.7);
  stroke-width: 1.1;
}

.depth-anchor-dot {
  fill: rgba(185, 28, 28, 0.82);
  stroke: rgba(255, 255, 255, 0.92);
  stroke-width: 0.8;
}

.depth-anchor-label {
  fill: #7f1d1d;
  font-size: 8px;
  font-weight: 700;
}

.depth-strip-notes {
  display: grid;
  gap: 4px;
}

.depth-strip-notes p {
  margin: 0;
  font-size: 10px;
  color: #475569;
  line-height: 1.35;
}

.subfigure-label {
  position: absolute;
  top: 6px;
  right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0f172a;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  font-family: 'Consolas', 'SFMono-Regular', 'Menlo', monospace;
  text-transform: lowercase;
}

.orientation-overlay {
  position: absolute;
  right: 12px;
  top: 12px;
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  padding: 8px 10px;
  min-width: 138px;
  pointer-events: none;
}

.north-block {
  display: flex;
  align-items: center;
  gap: 6px;
}

.north-label {
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
}

.north-arrow {
  font-size: 16px;
  line-height: 1;
  color: #0f766e;
}

.scale-block {
  margin-top: 6px;
}

.scale-bar-line {
  width: 72px;
  height: 6px;
  border: 1px solid #0f172a;
  border-radius: 2px;
  background: linear-gradient(90deg, #0f172a 50%, #ffffff 50%);
  background-size: 16px 6px;
}

.scale-block p {
  margin: 4px 0 0;
  font-size: 10px;
  color: #334155;
  font-weight: 600;
}

.orientation-meta {
  margin: 6px 0 0;
  font-size: 10px;
  color: #64748b;
}

.analysis-overlay {
  position: absolute;
  right: 12px;
  bottom: 12px;
  min-width: 224px;
  max-width: 340px;
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  padding: 10px 12px;
  pointer-events: none;
}

.analysis-overlay p {
  margin: 5px 0 0;
  font-size: 11px;
  color: #334155;
}

.analysis-overlay p:first-child {
  margin-top: 0;
}

.analysis-title {
  font-weight: 700;
  color: #0f172a;
}

.hotspot-line {
  font-family: 'Consolas', 'SFMono-Regular', 'Menlo', monospace;
}

.caption-overlay {
  position: absolute;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  width: min(58%, 760px);
  border: 1px solid rgba(15, 23, 42, 0.14);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  padding: 8px 12px;
  pointer-events: none;
}

.caption-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 12px;
  align-items: start;
}

.caption-block {
  display: grid;
  gap: 4px;
}

.caption-block-notes {
  border-left: 1px solid rgba(148, 163, 184, 0.34);
  padding-left: 12px;
}

.caption-title {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.caption-row {
  margin: 0;
  display: grid;
  grid-template-columns: 68px minmax(0, 1fr);
  gap: 8px;
}

.caption-key {
  font-size: 10px;
  font-weight: 700;
  color: #475569;
}

.caption-value {
  font-size: 10px;
  line-height: 1.4;
  color: #1e293b;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
}

.inset-map-wrap {
  margin-top: 6px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  border-radius: 8px;
  padding: 6px;
  background: rgba(248, 250, 252, 0.9);
  position: relative;
}

.inset-title {
  margin: 0;
  font-size: 10px;
  font-weight: 700;
  color: #0f172a;
}

.inset-map {
  margin-top: 5px;
  width: 100%;
  height: 92px;
  display: block;
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 4px;
  background: #ffffff;
}

.inset-section-line {
  stroke: #0f172a;
  stroke-width: 1.4;
  stroke-dasharray: 3 2;
}

.inset-hotspot {
  fill: rgba(185, 28, 28, 0.82);
  stroke: rgba(255, 255, 255, 0.92);
  stroke-width: 0.9;
}

.inset-caption {
  margin: 4px 0 0;
  font-size: 9px;
  color: #64748b;
}

.dist-wrap {
  margin-top: 6px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  border-radius: 8px;
  padding: 6px;
  background: rgba(248, 250, 252, 0.9);
  position: relative;
}

.dist-title {
  margin: 0;
  font-size: 10px;
  font-weight: 700;
  color: #0f172a;
}

.dist-chart {
  margin-top: 5px;
  width: 100%;
  height: 62px;
  display: block;
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 4px;
  background: #ffffff;
}

.dist-bar {
  fill: rgba(15, 118, 110, 0.72);
}

.dist-qline {
  stroke: rgba(127, 29, 29, 0.9);
  stroke-width: 1.1;
  stroke-dasharray: 2 2;
}

.dist-caption {
  margin: 4px 0 0;
  font-size: 9px;
  color: #64748b;
}

.section-profile-wrap {
  margin-top: 6px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  border-radius: 8px;
  padding: 6px;
  background: rgba(248, 250, 252, 0.9);
  position: relative;
}

.section-profile-title {
  margin: 0;
  font-size: 10px;
  font-weight: 700;
  color: #0f172a;
}

.section-profile-chart {
  margin-top: 5px;
  width: 100%;
  height: 62px;
  display: block;
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 4px;
  background: #ffffff;
}

.section-axis-line {
  stroke: rgba(71, 85, 105, 0.58);
  stroke-width: 1;
}

.section-guide-line {
  stroke: rgba(185, 28, 28, 0.62);
  stroke-width: 1;
  stroke-dasharray: 3 2;
}

.section-band-path {
  fill: rgba(15, 118, 110, 0.16);
  stroke: none;
}

.section-profile-path {
  fill: none;
  stroke: #0f766e;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.section-profile-meta {
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 9px;
  color: #475569;
}

.section-profile-note {
  margin: 4px 0 0;
  font-size: 9px;
  color: #64748b;
}

@media (max-width: 980px) {
  .viewer-body {
    height: 440px;
  }
  .figure-overlay {
    max-width: 420px;
  }
  .analysis-overlay {
    max-width: 290px;
  }
  .orientation-overlay {
    min-width: 128px;
  }
  .caption-overlay {
    width: min(72%, 620px);
  }
}

@media (max-width: 760px) {
  .paper-frame {
    padding: 10px 11px;
  }
  .paper-frame-chips {
    gap: 5px;
  }
  .paper-frame-chip {
    font-size: 10px;
    padding: 3px 8px;
  }
  .viewer-body {
    height: 360px;
  }
  .slider input {
    width: 84px;
  }
  .figure-overlay {
    max-width: 90%;
    padding: 8px 9px;
  }
  .figure-headline {
    font-size: 12px;
  }
  .figure-kpis {
    gap: 6px;
  }
  .content-metrics {
    grid-template-columns: 1fr;
  }
  .diagnostic-badges {
    gap: 5px;
  }
  .diagnostic-badge {
    font-size: 9px;
    padding: 3px 6px;
  }
  .analysis-overlay {
    min-width: 180px;
    max-width: 60%;
    padding: 8px 9px;
  }
  .caption-overlay {
    width: min(84%, 520px);
    padding: 7px 9px;
  }
  .caption-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .caption-block-notes {
    border-left: 0;
    border-top: 1px solid rgba(148, 163, 184, 0.34);
    padding-left: 0;
    padding-top: 8px;
  }
  .caption-title {
    font-size: 10px;
  }
  .caption-value {
    font-size: 10px;
  }
  .caption-key {
    font-size: 9px;
  }
  .orientation-overlay {
    min-width: 112px;
    padding: 7px 8px;
  }
  .scale-bar-line {
    width: 58px;
  }
  .inset-map {
    height: 78px;
  }
  .dist-chart {
    height: 52px;
  }
  .section-profile-chart {
    height: 52px;
  }
  .analysis-overlay p {
    font-size: 10px;
  }
  .depth-strip-layout {
    grid-template-columns: 1fr;
  }
  .depth-strip {
    width: 100%;
    max-width: 88px;
  }
}
</style>





