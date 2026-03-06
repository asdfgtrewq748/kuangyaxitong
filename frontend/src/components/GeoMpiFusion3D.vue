<template>
  <section class="geo-mpi-fusion" :class="{ paper: paperMode }">
    <header class="fusion-header">
      <div class="title-wrap">
        <h3>{{ title }}</h3>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <div class="toolbar">
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
          <span class="figure-topic">{{ metricLabel }}-Geology Coupled View</span>
        </div>
        <h4 class="figure-headline">Integrated Multi-source Structure-Stress Interpretation</h4>
        <p class="figure-meta">
          Seam {{ contextMeta?.seam || '--' }} | Grid {{ gridShapeText }} | Method {{ String(contextMeta?.method || '--').toUpperCase() }}
        </p>
        <div class="figure-kpis">
          <span>Layers {{ layerCount }}</span>
          <span>Boreholes {{ boreholeCount }}</span>
          <span>Anchors {{ stressAnchorItems.length }}</span>
          <span>Focus {{ stressFocusLabel }}</span>
        </div>
        <div class="content-metrics">
          <p>Mean {{ formatValue(mpiSummary.mean) }} MPa</p>
          <p>CV {{ formatValue(mpiSummary.cv) }}</p>
          <p>P90 cover {{ formatPercent(mpiSummary.p90Cover) }}</p>
          <p>IQR {{ formatValue(mpiSummary.iqr) }}</p>
          <p>Entropy {{ formatValue(mpiSummary.entropyNorm) }}</p>
          <p>Skew {{ formatValue(mpiSummary.skewness) }}</p>
        </div>
        <p class="figure-note">Nature-style content panel: structure + statistics + depth coupling.</p>
      </div>

      <div v-if="!loading && hasRenderableData && !errorText" class="legend-overlay">
        <div class="legend-title">{{ metricLabel }} (MPa)</div>
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
          Depth span {{ formatValue(dataBounds.min_z) }} to {{ formatValue(dataBounds.max_z) }}
        </p>
        <p v-if="sectionEnabled" class="section-hint">
          Section {{ sectionAxis.toUpperCase() }} = {{ formatValue(sectionThreshold) }}
        </p>
        <p v-if="showStressCloud" class="section-hint cloud-hint">
          Stress cloud = MPI field x depth transfer ({{ stressProfileLabel }})
        </p>
        <div v-if="profileCurvePoints" class="profile-curve-wrap">
          <p class="profile-title">Depth transfer profile</p>
          <svg class="profile-curve" viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="35" x2="100" y2="35" class="profile-axis" />
            <line x1="0" y1="1" x2="0" y2="35" class="profile-axis" />
            <polyline :points="profileCurvePoints" class="profile-line" />
          </svg>
        </div>
        <div v-if="showStressCloud && showStressAnchors && stressAnchorItems.length" class="anchor-list">
          <p class="anchor-title">Depth anchors</p>
          <p v-for="item in stressAnchorItems.slice(0, 4)" :key="`anchor-${item.name}-${item.zNorm}`" class="anchor-item">
            <span class="anchor-name">{{ item.name }}</span>
            <span class="anchor-meta">z={{ formatValue(item.zWorld) }} | w={{ formatValue(item.importance) }}</span>
          </p>
        </div>
      </div>

      <div v-if="!loading && hasRenderableData && !errorText" class="orientation-overlay">
        <div class="north-block">
          <span class="north-label">N</span>
          <span class="north-arrow">^</span>
        </div>
        <div class="scale-block">
          <div class="scale-bar-line"></div>
          <p>{{ scaleBarLabel }}</p>
        </div>
        <p class="orientation-meta">X-east / Y-north</p>
      </div>

      <div v-if="!loading && hasRenderableData && !errorText" class="analysis-overlay">
        <p class="analysis-title">Quantitative Highlights</p>
        <div class="inset-map-wrap">
          <p class="inset-title">Plan-view MPI inset</p>
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
          <p class="inset-caption">Line = section, circles = hotspots</p>
        </div>
        <div class="dist-wrap">
          <p class="dist-title">MPI distribution</p>
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
          <p class="dist-caption">Q1/Q2/Q3 markers</p>
        </div>
        <p>Section retained: {{ formatPercent(sectionRetainedRatio) }}</p>
        <p>Hotspots (P90+): {{ hotspotCandidates.length }}</p>
        <p>Q1/Q2/Q3: {{ formatValue(mpiSummary.p25) }} / {{ formatValue(mpiSummary.p50) }} / {{ formatValue(mpiSummary.p75) }}</p>
        <p v-for="item in hotspotTopList.slice(0, 3)" :key="`hline-${item}`" class="hotspot-line">{{ item }}</p>
      </div>

      <div v-if="!loading && hasRenderableData && !errorText" class="caption-overlay">
        <p class="caption-title">Figure interpretation</p>
        <p class="caption-text">{{ figureNarrative }}</p>
        <p class="caption-meta">
          Heterogeneity {{ formatValue(heterogeneityScore) }} | Borehole density {{ formatValue(boreholeDensityKm2) }} km^-2 | N {{ mpiSummary.count || 0 }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
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
const figureNarrative = computed(() => {
  if (!mpiSummary.value.count) return 'Metric distribution is unavailable for current selection.'
  const hotspotText = hotspotTopList.value.length ? hotspotTopList.value[0] : 'No dominant hotspot'
  const skew = toFinite(mpiSummary.value.skewness, 0)
  const skewDesc = skew > 0.3 ? 'right-tailed stress amplification' : skew < -0.3 ? 'left-tailed attenuation' : 'near-symmetric distribution'
  return `${metricLabel.value} shows ${skewDesc}; strongest anomaly at ${hotspotText}. Section keeps ${formatPercent(sectionRetainedRatio.value)} of the volume.`
})
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

let three = null
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
let buildVersion = 0
let isComponentAlive = false
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
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
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
  dirtyFlags.geometry = false
  dirtyFlags.material = false
  dirtyFlags.section = false
}

const ensureThree = async () => {
  if (!three) three = await import('three')
  if (!OrbitControlsCtor) {
    const controlsModule = await import('three/addons/controls/OrbitControls.js')
    OrbitControlsCtor = controlsModule.OrbitControls
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
}

const drawExportOverlay = (ctx, width, height) => {
  const scale = Math.max(0.8, width / 2400)
  const pad = Math.round(48 * scale)
  const panelWidth = Math.min(width * 0.64, Math.round(1080 * scale))
  const includeAnchorRows = showStressCloud.value && showStressAnchors.value && exportAnchorRows.value.length > 0
  const includeHotspotRows = showHotspots.value && hotspotTopList.value.length > 0
  const hotspotRowCount = includeHotspotRows ? Math.min(2, hotspotTopList.value.length) : 0
  const panelHeight = Math.round(
    (382 + (includeAnchorRows ? 40 + exportAnchorRows.value.length * 28 : 0) + (includeHotspotRows ? 34 + hotspotRowCount * 24 : 0)) * scale,
  )
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.fillRect(pad, pad, panelWidth, panelHeight)
  ctx.strokeStyle = 'rgba(15,23,42,0.16)'
  ctx.lineWidth = Math.max(2, 2 * scale)
  ctx.strokeRect(pad, pad, panelWidth, panelHeight)

  ctx.fillStyle = '#0f172a'
  ctx.font = `700 ${Math.round(24 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(String(props.panelLabel || 'Fig. 1'), pad + Math.round(22 * scale), pad + Math.round(38 * scale))

  ctx.fillStyle = '#0f172a'
  ctx.font = `600 ${Math.round(42 * scale)}px "Times New Roman", "Noto Serif SC", serif`
  ctx.fillText(props.title || '3D Geology-MPI Fusion', pad + Math.round(22 * scale), pad + Math.round(78 * scale))

  const subtitle = props.subtitle || 'Preview'
  ctx.fillStyle = '#334155'
  ctx.font = `500 ${Math.round(28 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(subtitle, pad + Math.round(22 * scale), pad + Math.round(116 * scale))

  const metricLine = `${metricLabel.value}  min ${formatValue(props.metricStats?.min)}   mean ${formatValue(props.metricStats?.mean)}   max ${formatValue(props.metricStats?.max)}`
  ctx.fillStyle = '#475569'
  ctx.font = `500 ${Math.round(24 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(metricLine, pad + Math.round(22 * scale), pad + Math.round(150 * scale))

  const profileLine = `Profile source: ${stressProfileLabel.value}  |  focus: ${stressFocusLabel.value}`
  ctx.fillStyle = '#1f2937'
  ctx.font = `600 ${Math.round(22 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(profileLine, pad + Math.round(22 * scale), pad + Math.round(184 * scale))

  const metaLine = `Seam ${String(props.contextMeta?.seam || '--')} | Grid ${gridShapeText.value} | Method ${String(props.contextMeta?.method || '--').toUpperCase()} | Resolution ${formatValue(props.contextMeta?.resolution)}`
  ctx.fillStyle = '#334155'
  ctx.font = `500 ${Math.round(20 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(metaLine, pad + Math.round(22 * scale), pad + Math.round(214 * scale))

  const structureLine = `Layers ${layerCount.value}  Boreholes ${boreholeCount.value}  Anchors ${stressAnchorItems.value.length}`
  ctx.fillStyle = '#334155'
  ctx.font = `500 ${Math.round(20 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(structureLine, pad + Math.round(22 * scale), pad + Math.round(242 * scale))

  const quantLine = `Q1/Q2/Q3 ${formatValue(mpiSummary.value.p25)} / ${formatValue(mpiSummary.value.p50)} / ${formatValue(mpiSummary.value.p75)}  |  CV ${formatValue(mpiSummary.value.cv)}`
  ctx.fillText(quantLine, pad + Math.round(22 * scale), pad + Math.round(268 * scale))
  const coverLine = `P75 cover ${formatPercent(mpiSummary.value.p75Cover)}  |  P90 cover ${formatPercent(mpiSummary.value.p90Cover)}  |  Section retained ${formatPercent(sectionRetainedRatio.value)}`
  ctx.fillText(coverLine, pad + Math.round(22 * scale), pad + Math.round(294 * scale))
  const distLine = `Entropy ${formatValue(mpiSummary.value.entropyNorm)}  |  Skew ${formatValue(mpiSummary.value.skewness)}  |  N ${mpiSummary.value.count || 0}`
  ctx.fillText(distLine, pad + Math.round(22 * scale), pad + Math.round(320 * scale))
  const methodsLine = `Data fusion: mesh layers + boreholes + ${gridShapeText.value} metric grid`
  ctx.fillText(methodsLine, pad + Math.round(22 * scale), pad + Math.round(346 * scale))
  const narrativeLine = figureNarrative.value.length > 118 ? `${figureNarrative.value.slice(0, 118)}...` : figureNarrative.value
  ctx.fillText(narrativeLine, pad + Math.round(22 * scale), pad + Math.round(372 * scale))

  let offsetY = 398
  if (includeHotspotRows) {
    ctx.fillStyle = '#0f172a'
    ctx.font = `600 ${Math.round(21 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    ctx.fillText('Hotspot summary', pad + Math.round(22 * scale), pad + Math.round(offsetY * scale))
    ctx.fillStyle = '#334155'
    ctx.font = `500 ${Math.round(20 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    hotspotTopList.value.slice(0, hotspotRowCount).forEach((line, index) => {
      ctx.fillText(line, pad + Math.round(38 * scale), pad + Math.round((offsetY + 26 + index * 24) * scale))
    })
    offsetY += 34 + hotspotRowCount * 24
  }

  if (includeAnchorRows) {
    ctx.fillStyle = '#0f172a'
    ctx.font = `600 ${Math.round(21 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    ctx.fillText('Top depth anchors', pad + Math.round(22 * scale), pad + Math.round(offsetY * scale))
    ctx.fillStyle = '#334155'
    ctx.font = `500 ${Math.round(20 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    exportAnchorRows.value.forEach((line, index) => {
      ctx.fillText(line, pad + Math.round(38 * scale), pad + Math.round((offsetY + 28 + index * 26) * scale))
    })
  }

  const orientWidth = Math.round(212 * scale)
  const orientHeight = Math.round(116 * scale)
  const orientX = width - pad - orientWidth
  const orientY = pad
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.fillRect(orientX, orientY, orientWidth, orientHeight)
  ctx.strokeStyle = 'rgba(15,23,42,0.16)'
  ctx.lineWidth = Math.max(2, 2 * scale)
  ctx.strokeRect(orientX, orientY, orientWidth, orientHeight)
  ctx.fillStyle = '#0f172a'
  ctx.font = `700 ${Math.round(24 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText('N', orientX + Math.round(18 * scale), orientY + Math.round(32 * scale))
  ctx.fillStyle = '#0f766e'
  ctx.font = `700 ${Math.round(30 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText('^', orientX + Math.round(42 * scale), orientY + Math.round(36 * scale))

  const barX = orientX + Math.round(18 * scale)
  const barY = orientY + Math.round(54 * scale)
  const barW = Math.round(98 * scale)
  const barH = Math.round(10 * scale)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(barX, barY, Math.round(barW / 2), barH)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(barX + Math.round(barW / 2), barY, Math.round(barW / 2), barH)
  ctx.strokeStyle = '#0f172a'
  ctx.strokeRect(barX, barY, barW, barH)
  ctx.fillStyle = '#334155'
  ctx.font = `600 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(scaleBarLabel.value, barX, orientY + Math.round(82 * scale))
  ctx.fillStyle = '#64748b'
  ctx.font = `500 ${Math.round(16 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText('X-east / Y-north', barX, orientY + Math.round(102 * scale))

  const histPanelW = Math.round(324 * scale)
  const histPanelH = Math.round(206 * scale)
  const histX = width - pad - histPanelW
  const histY = height - pad - histPanelH
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.fillRect(histX, histY, histPanelW, histPanelH)
  ctx.strokeStyle = 'rgba(15,23,42,0.16)'
  ctx.lineWidth = Math.max(2, 2 * scale)
  ctx.strokeRect(histX, histY, histPanelW, histPanelH)
  ctx.fillStyle = '#0f172a'
  ctx.font = `700 ${Math.round(21 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(`${metricLabel.value} distribution`, histX + Math.round(16 * scale), histY + Math.round(30 * scale))

  const chartX = histX + Math.round(16 * scale)
  const chartY = histY + Math.round(42 * scale)
  const chartW = histPanelW - Math.round(32 * scale)
  const chartH = Math.round(112 * scale)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(chartX, chartY, chartW, chartH)
  ctx.strokeStyle = 'rgba(100,116,139,0.36)'
  ctx.lineWidth = Math.max(1, 1 * scale)
  ctx.strokeRect(chartX, chartY, chartW, chartH)

  const bars = histogramBars.value
  bars.forEach((bar) => {
    const x = chartX + (Number(bar.x) / 100) * chartW
    const y = chartY + (Number(bar.y) / 38) * chartH
    const w = Math.max(1, (Number(bar.w) / 100) * chartW)
    const h = Math.max(1, (Number(bar.h) / 38) * chartH)
    ctx.fillStyle = 'rgba(15,118,110,0.72)'
    ctx.fillRect(x, y, w, h)
  })

  ctx.setLineDash([Math.max(2, 2 * scale), Math.max(2, 2 * scale)])
  histogramQuantileLines.value.forEach((line) => {
    const x = chartX + (Number(line.x) / 100) * chartW
    ctx.strokeStyle = 'rgba(127,29,29,0.86)'
    ctx.beginPath()
    ctx.moveTo(x, chartY)
    ctx.lineTo(x, chartY + chartH)
    ctx.stroke()
    ctx.fillStyle = 'rgba(127,29,29,0.92)'
    ctx.font = `700 ${Math.round(12 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    ctx.fillText(String(line.id || '').toUpperCase(), x + Math.round(2 * scale), chartY + Math.round(12 * scale))
  })
  ctx.setLineDash([])
  ctx.fillStyle = '#334155'
  ctx.font = `600 ${Math.round(16 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(`Entropy ${formatValue(mpiSummary.value.entropyNorm)}  |  Skew ${formatValue(mpiSummary.value.skewness)}`, chartX, histY + histPanelH - Math.round(18 * scale))
}

const canvasToBlob = (canvas, type = 'image/png') => new Promise((resolve, reject) => {
  if (canvas.toBlob) {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('canvas toBlob failed'))
    }, type)
    return
  }
  try {
    const dataUrl = canvas.toDataURL(type)
    fetch(dataUrl).then((resp) => resp.blob()).then(resolve).catch(reject)
  } catch (error) {
    reject(error)
  }
})

const buildExportName = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const mi = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  return `fusion_figure_${String(props.metric || 'mpi').toLowerCase()}_${y}${m}${d}_${h}${mi}${s}.png`
}

const getExportSize = (options = {}) => {
  const width = Math.max(1600, Math.round(Number(options?.width) || 3840))
  const height = Math.max(1000, Math.round(Number(options?.height) || 2400))
  return { width, height }
}

const renderExportCanvas = (options = {}) => {
  if (!renderer || !scene || !camera || !controls || !rootGroup || !three) return null
  const oldAutoRotate = autoRotate.value
  const oldRootRotation = rootGroup.rotation.clone()
  const oldCameraPosition = camera.position.clone()
  const oldCameraQuaternion = camera.quaternion.clone()
  const oldTarget = controls.target.clone()
  const oldNear = camera.near
  const oldFar = camera.far
  const oldAspect = camera.aspect
  const oldPixelRatio = renderer.getPixelRatio()
  const oldSize = renderer.getSize(new three.Vector2())

  const { width: exportWidth, height: exportHeight } = getExportSize(options)

  try {
    autoRotate.value = false
    rootGroup.rotation.set(0, 0, 0)
    applyPaperViewPose()

    renderer.setPixelRatio(1)
    renderer.setSize(exportWidth, exportHeight, false)
    camera.aspect = exportWidth / exportHeight
    camera.updateProjectionMatrix()
    controls.update()
    renderer.render(scene, camera)

    const output = document.createElement('canvas')
    output.width = exportWidth
    output.height = exportHeight
    const ctx = output.getContext('2d')
    if (!ctx) throw new Error('2D context unavailable')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, exportWidth, exportHeight)
    ctx.drawImage(renderer.domElement, 0, 0, exportWidth, exportHeight)
    drawExportOverlay(ctx, exportWidth, exportHeight)
    return output
  } catch (error) {
    console.error('Export fusion figure failed:', error)
    return null
  } finally {
    renderer.setPixelRatio(oldPixelRatio)
    renderer.setSize(oldSize.x, oldSize.y, false)

    camera.aspect = oldAspect
    camera.near = oldNear
    camera.far = oldFar
    camera.position.copy(oldCameraPosition)
    camera.quaternion.copy(oldCameraQuaternion)
    camera.updateProjectionMatrix()

    controls.target.copy(oldTarget)
    controls.update()
    rootGroup.rotation.copy(oldRootRotation)
    autoRotate.value = oldAutoRotate
    renderer.render(scene, camera)
  }
}

const exportFigureBlob = async (options = {}) => {
  const canvas = renderExportCanvas(options)
  if (!canvas) return null
  const blob = await canvasToBlob(canvas, 'image/png')
  return {
    blob,
    filename: buildExportName(),
    width: canvas.width,
    height: canvas.height,
  }
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
    link.download = payload.filename || buildExportName()
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

const renderLoop = () => {
  if (!renderer || !scene || !camera) return
  frameId = requestAnimationFrame(renderLoop)
  if (autoRotate.value && rootGroup) rootGroup.rotation.z += 0.001
  controls?.update()
  renderer.render(scene, camera)
}

const onResize = () => {
  if (!renderer || !camera || !hostRef.value) return
  const width = hostRef.value.clientWidth || 960
  const height = hostRef.value.clientHeight || 520
  renderer.setSize(width, height, false)
  camera.aspect = width / Math.max(height, 1)
  camera.updateProjectionMatrix()
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
  dirtyFlags.geometry = false
  renderLoop()
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
})

watch([sectionEnabled, sectionAxis, sectionRatio], async () => {
  await nextTick()
  updateSectionState()
})

watch(cloudDensity, async () => {
  await rebuildSceneSafe()
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

.caption-title {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.01em;
}

.caption-text {
  margin: 4px 0 0;
  font-size: 11px;
  line-height: 1.4;
  color: #1e293b;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
}

.caption-meta {
  margin: 4px 0 0;
  font-size: 10px;
  color: #64748b;
}

.inset-map-wrap {
  margin-top: 6px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  border-radius: 8px;
  padding: 6px;
  background: rgba(248, 250, 252, 0.9);
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
  .analysis-overlay {
    min-width: 180px;
    max-width: 60%;
    padding: 8px 9px;
  }
  .caption-overlay {
    width: min(84%, 520px);
    padding: 7px 9px;
  }
  .caption-title {
    font-size: 10px;
  }
  .caption-text {
    font-size: 10px;
  }
  .caption-meta {
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
  .analysis-overlay p {
    font-size: 10px;
  }
}
</style>



