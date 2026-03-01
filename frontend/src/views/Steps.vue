<template>
  <div class="steps-page">
    <!-- Page Header with compact actions -->
    <PageHeader
      class="main-header"
      :title="sp('title')"
      :description="sp('subtitle')"
    >
      <template #actions>
        <div class="header-actions">
          <button class="btn primary" :disabled="refreshing" @click="refreshAll(true)">
            <span v-if="refreshing" class="spinner sm"></span>
            {{ refreshing ? sp('refreshing') : sp('refreshAll') }}
          </button>
          <div class="action-divider"></div>
          <button class="btn secondary" :disabled="!stepGrid" @click="handleExportGrid" :title="sp('exportStepGrid')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
          </button>
          <button class="btn secondary" :disabled="!stepBatch" @click="handleExportBatch" :title="sp('exportBatch')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
          </button>
        </div>
      </template>
    </PageHeader>

    <!-- Main Layout: Sidebar + Preview Area -->
    <div class="steps-layout">
      <!-- Left Sidebar: Parameter Groups (Accordion) -->
      <aside class="params-sidebar">
        <div class="sidebar-header">
          <h3>{{ sp('params') }}</h3>
          <button class="expand-all-btn" @click="toggleAllGroups">
            {{ allGroupsExpanded ? sp('collapseAll') : sp('expandAll') }}
          </button>
        </div>

        <!-- Parameter Groups -->
        <div class="param-groups">
          <!-- Group 1: Mechanical Model -->
          <div class="param-group" :class="{ open: openGroups.has('mechanical') }">
            <button class="param-group-header" @click="toggleGroup('mechanical')">
              <svg class="group-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24"/>
              </svg>
              <span class="group-label">{{ sp('groupMechanical') }}</span>
              <span class="group-count">3</span>
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="param-group-body">
              <label class="param-field">
                <span>{{ sp('mechanicalModel') }}</span>
                <select v-model="stepModel">
                  <option value="fixed">{{ sp('model.fixed') }}</option>
                  <option value="simply">{{ sp('model.simply') }}</option>
                  <option value="shear">{{ sp('model.shear') }}</option>
                  <option value="empirical">{{ sp('model.empirical') }}</option>
                </select>
              </label>
              <label class="param-field">
                <span>{{ sp('target') }}</span>
                <select v-model="stepTarget">
                  <option value="initial">{{ sp('targetOption.initial') }}</option>
                  <option value="periodic">{{ sp('targetOption.periodic') }}</option>
                </select>
              </label>
              <label class="param-field">
                <span>{{ sp('roofThickness') }} h (m)</span>
                <input v-model.number="stepH" type="number" step="0.1" min="0.1">
              </label>
            </div>
          </div>

          <!-- Group 2: Load Parameters -->
          <div class="param-group" :class="{ open: openGroups.has('load') }">
            <button class="param-group-header" @click="toggleGroup('load')">
              <svg class="group-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              <span class="group-label">{{ sp('groupLoad') }}</span>
              <span class="group-count">3</span>
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="param-group-body">
              <label class="param-field">
                <span>{{ sp('load') }} q (MPa)</span>
                <input v-model.number="stepQ" type="number" step="0.1" min="0.1">
              </label>
              <label class="param-field">
                <span>{{ sp('tensile') }} t (MPa)</span>
                <input v-model.number="stepT" type="number" step="0.1" min="0.1">
              </label>
              <label class="param-field">
                <span>{{ sp('shear') }} s (MPa)</span>
                <input v-model.number="stepS" type="number" step="0.1" min="0.1">
              </label>
            </div>
          </div>

          <!-- Group 3: Calculation Mode -->
          <div class="param-group" :class="{ open: openGroups.has('calcMode') }">
            <button class="param-group-header" @click="toggleGroup('calcMode')">
              <svg class="group-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
                <path d="M9 9h6M9 12h6M9 15h4"/>
              </svg>
              <span class="group-label">{{ sp('groupCalcMode') }}</span>
              <span class="group-count">5</span>
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="param-group-body">
              <label class="param-field">
                <span>{{ sp('hMode') }}</span>
                <select v-model="hMode">
                  <option value="total">{{ sp('hModeTotal') }}</option>
                </select>
              </label>
              <label class="param-field">
                <span>{{ sp('qMode') }}</span>
                <select v-model="qMode">
                  <option value="density_thickness">{{ sp('qModeDensityThickness') }}</option>
                  <option value="default">{{ sp('qModeDefault') }}</option>
                </select>
              </label>
              <label class="param-field" v-if="qMode === 'default'">
                <span>{{ sp('defaultQ') }}</span>
                <input v-model.number="defaultQ" type="number" step="0.1" min="0.1">
              </label>
              <label class="param-field">
                <span>{{ sp('gridSize') }}</span>
                <input v-model.number="gridSize" type="number" min="20" max="120" step="1">
              </label>
            </div>
          </div>

          <!-- Group 4: MPI Settings -->
          <div class="param-group" :class="{ open: openGroups.has('mpi') }">
            <button class="param-group-header" @click="toggleGroup('mpi')">
              <svg class="group-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span class="group-label">{{ sp('groupMpi') }}</span>
              <span class="group-count">5</span>
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="param-group-body">
              <label class="param-field">
                <span>{{ sp('mpiSeam') }}</span>
                <select v-model="mpiSeam" :disabled="mpiSeams.length === 0">
                  <option value="">{{ sp('selectSeam') }}</option>
                  <option v-for="seam in mpiSeams" :key="seam.name" :value="seam.name">{{ seam.name }}</option>
                </select>
              </label>
              <label class="param-field">
                <span>{{ sp('mpiGrid') }}</span>
                <input v-model.number="mpiGridSize" type="number" min="20" max="150" step="1">
              </label>
              <label class="param-field">
                <span>{{ sp('mpiInterpolation') }}</span>
                <select v-model="mpiMethod">
                  <option value="idw">{{ sp('mpiMethod.idw') }}</option>
                  <option value="linear">{{ sp('mpiMethod.linear') }}</option>
                  <option value="nearest">{{ sp('mpiMethod.nearest') }}</option>
                </select>
              </label>
              <label class="param-field toggle-field">
                <span class="toggle-label">
                  <input v-model="geoAwareEnabled" type="checkbox">
                  <span>{{ sp('geoAware') }}</span>
                </span>
                <span class="toggle-status">{{ geoAwareEnabled ? sp('enabled') : sp('disabled') }}</span>
              </label>
              <label class="param-field" v-if="geoAwareEnabled">
                <span>{{ sp('geomodelJobIdOptional') }}</span>
                <input v-model.trim="geoModelJobId" type="text" :placeholder="sp('geomodelJobPlaceholder')">
              </label>
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <p class="sidebar-error" v-if="stepResultError || stepGridError || stepBatchError || mpiError">
          {{ stepResultError || stepGridError || stepBatchError || mpiError }}
        </p>
      </aside>

      <!-- Right: Preview Area -->
      <main class="preview-area">
        <!-- KPI Cards Row with Sparklines -->
        <div class="kpi-row">
          <article class="kpi-card" :class="{ loading: loadingStepResult }">
            <div class="kpi-header">
              <span class="kpi-label">{{ sp('initialStep') }}</span>
              <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div class="kpi-value">{{ formatNumber(stepResult?.initial_step, 2, 'm') }}</div>
            <canvas ref="initialSparklineCanvas" class="kpi-sparkline"></canvas>
            <small class="kpi-hint" v-if="loadingStepResult">{{ sp('autoComputing') }}</small>
          </article>

          <article class="kpi-card" :class="{ loading: loadingStepResult }">
            <div class="kpi-header">
              <span class="kpi-label">{{ sp('periodicStep') }}</span>
              <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div class="kpi-value">{{ formatNumber(stepResult?.periodic_step, 2, 'm') }}</div>
            <canvas ref="periodicSparklineCanvas" class="kpi-sparkline"></canvas>
            <small class="kpi-hint" v-if="loadingStepResult">{{ sp('autoComputing') }}</small>
          </article>

          <article class="kpi-card" :class="{ loading: loadingMpi, 'risk-high': isMpiHighRisk }">
            <div class="kpi-header">
              <span class="kpi-label">{{ sp('mpiMean') }}</span>
              <svg class="kpi-icon" :class="{ 'risk-icon': isMpiHighRisk }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="kpi-value">{{ formatNumber(mpiStats?.mean, 2) }}</div>
            <canvas ref="mpiSparklineCanvas" class="kpi-sparkline"></canvas>
            <small class="kpi-hint" v-if="loadingMpi">{{ sp('autoComputing') }}</small>
          </article>

          <article class="kpi-card" :class="{ loading: loadingStepBatch }">
            <div class="kpi-header">
              <span class="kpi-label">{{ sp('batchCount') }}</span>
              <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
              </svg>
            </div>
            <div class="kpi-value">{{ stepBatch?.items?.length || 0 }}</div>
            <div class="kpi-bar">
              <div class="kpi-bar-fill" :style="{ width: batchProgress + '%' }"></div>
            </div>
            <small class="kpi-hint" v-if="loadingStepBatch">{{ sp('autoComputing') }}</small>
          </article>
        </div>

        <!-- Visualization Grid -->
        <div class="viz-grid">
          <!-- Step Grid Heatmap -->
          <section class="viz-card main-viz">
            <div class="viz-header">
              <div>
                <h3>{{ sp('stepGridTitle') }}</h3>
                <p class="viz-meta">{{ stepModelLabel(stepModel) }} / {{ stepTargetLabel(stepTarget) }} · {{ gridSize }}×{{ gridSize }}</p>
              </div>
              <span class="viz-tag">{{ sp('tagHeatmap') }}</span>
            </div>
            <div class="viz-body">
              <SkeletonPanel v-if="loadingStepGrid" :rows="5" compact />
              <HeatmapCanvas v-else-if="stepGrid?.values?.length" :grid="stepGrid.values" :size="480" />
              <EmptyState v-else :title="sp('noStepGrid')" :description="sp('stepGridTitle')" />
            </div>
          </section>

          <!-- MPI Analysis Panel -->
          <section class="viz-card mpi-viz">
            <div class="viz-header">
              <div>
                <h3>{{ sp('mpiPanelTitle') }}</h3>
                <p class="viz-meta">{{ mpiSeam || sp('unselectedSeam') }}</p>
              </div>
              <span class="viz-tag">{{ sp('tagSpatial') }}</span>
            </div>
            <div class="viz-body scrollable">
              <SkeletonPanel v-if="loadingMpi" :rows="5" compact />
              <template v-else>
                <HeatmapCanvas v-if="mpiGrid?.length" :grid="mpiGrid" :size="380" />
                <EmptyState v-else :title="sp('noMpi')" :description="sp('mpiPanelTitle')" />

                <!-- Stats Row -->
                <div class="mini-stats-row">
                  <div class="mini-stat">
                    <span>{{ sp('min') }}</span>
                    <strong>{{ formatNumber(mpiStats?.min, 2) }}</strong>
                  </div>
                  <div class="mini-stat">
                    <span>{{ sp('max') }}</span>
                    <strong>{{ formatNumber(mpiStats?.max, 2) }}</strong>
                  </div>
                  <div class="mini-stat">
                    <span>{{ sp('mean') }}</span>
                    <strong>{{ formatNumber(mpiStats?.mean, 2) }}</strong>
                  </div>
                </div>

                <!-- Suggestion Card -->
                <div class="suggestion-card">
                  <svg class="suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  <div>
                    <h4>{{ sp('stepSuggestionTitle') }}</h4>
                    <p>{{ mpiSuggestion }}</p>
                  </div>
                </div>

                <!-- Geo-aware Comparison -->
                <div v-if="geoCompareSummary" class="geo-compare-card">
                  <h4>{{ sp('geoCompareTitle') }}</h4>
                  <div class="compare-stats">
                    <div class="compare-item">
                      <span>{{ sp('baselineMean') }}</span>
                      <strong>{{ formatNumber(geoCompareSummary.baselineMean, 2) }}</strong>
                    </div>
                    <div class="compare-item delta">
                      <span>{{ sp('deltaMean') }}</span>
                      <strong :class="{ positive: geoCompareSummary.delta > 0, negative: geoCompareSummary.delta < 0 }">
                        {{ geoCompareSummary.delta > 0 ? '+' : ''}}{{ formatNumber(geoCompareSummary.delta, 2) }}
                      </strong>
                    </div>
                    <div class="compare-item">
                      <span>{{ sp('geoAwareMean') }}</span>
                      <strong>{{ formatNumber(geoCompareSummary.geoMean, 2) }}</strong>
                    </div>
                  </div>
                  <p class="geo-meta">
                    {{ sp('mode') }}{{ geoCompareSummary.algorithmMode }} · {{ sp('fallback') }}{{ geoCompareSummary.fallbackUsed ? t('common.yes') : t('common.no') }}
                  </p>
                </div>

                <!-- Zone Risk Summary -->
                <div v-if="zoneRiskSummary.length" class="zone-risk-card">
                  <h4>{{ sp('zoneRiskTitle') }}</h4>
                  <div class="zone-items">
                    <div v-for="zone in zoneRiskSummary" :key="zone.key" class="zone-item" :class="zone.key">
                      <span>{{ zone.label }}</span>
                      <strong>{{ zone.count }} ({{ zone.ratio }}%)</strong>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </section>
        </div>

        <!-- Batch Results (Collapsible) -->
        <section class="batch-section" :class="{ collapsed: batchCollapsed }">
          <button class="batch-header" @click="batchCollapsed = !batchCollapsed">
            <h3>{{ sp('batchResultTitle') }}</h3>
            <span class="batch-count">{{ stepBatch?.items?.length || 0 }} {{ sp('batchItems') }}</span>
            <svg class="collapse-chevron" :class="{ flipped: !batchCollapsed }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="batch-body" v-show="!batchCollapsed">
            <SkeletonPanel v-if="loadingStepBatch" :rows="6" />
            <div v-else-if="stepBatch?.items?.length" class="table-wrap">
              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{{ sp('initialStep') }} (m)</th>
                    <th>{{ sp('periodicStep') }} (m)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in stepBatch.items.slice(0, 20)" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ formatNumber(item.initial, 2) }}</td>
                    <td>{{ formatNumber(item.periodic, 2) }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="table-foot" v-if="stepBatch.items.length > 20">{{ sp('batchMore', { count: stepBatch.items.length - 20 }) }}</div>
            </div>
            <EmptyState v-else :title="sp('noBatch')" :description="sp('batchResultTitle')" />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useToast } from '../composables/useToast'
import { useI18n } from '../composables/useI18n'
import HeatmapCanvas from '../components/HeatmapCanvas.vue'
import { EmptyState, PageHeader, SkeletonPanel } from '../components/library'
import {
  exportPressureSteps,
  exportPressureStepsGrid,
  getCoalSeams,
  getRockParams,
  getSeamOverburden,
  mpiInterpolate,
  mpiInterpolateGeo,
  pressureSteps,
  pressureStepsBatch,
  pressureStepsGrid
} from '../api'
import { LRUCache } from '../lib/lruCache'

const toast = useToast()
const { t } = useI18n()
const sp = (key, params) => t(`steps.${key}`, params)

const stepModel = ref('fixed')
const stepTarget = ref('initial')
const stepH = ref(10)
const stepQ = ref(1)
const stepT = ref(2)
const stepS = ref(1)
const hMode = ref('total')
const qMode = ref('density_thickness')
const defaultQ = ref(1)
const gridSize = ref(60)

const mpiSeams = ref([])
const mpiSeam = ref('')
const mpiGridSize = ref(60)
const mpiMethod = ref('idw')
const geoAwareEnabled = ref(false)
const geoModelJobId = ref('')

const refreshing = ref(false)
const initialized = ref(false)

const loadingStepResult = ref(false)
const loadingStepGrid = ref(false)
const loadingStepBatch = ref(false)
const loadingMpi = ref(false)

const stepResult = ref(null)
const stepGrid = ref(null)
const stepBatch = ref(null)
const mpiGrid = ref(null)
const mpiStats = ref({})
const mpiGeoCompare = ref(null)

const stepResultError = ref('')
const stepGridError = ref('')
const stepBatchError = ref('')
const mpiError = ref('')

// Accordion groups state
const openGroups = ref(new Set(['mechanical', 'load']))
const allGroupsExpanded = computed(() => openGroups.value.size === 4)

// Batch collapse state
const batchCollapsed = ref(false)

// Sparkline canvas refs
const initialSparklineCanvas = ref(null)
const periodicSparklineCanvas = ref(null)
const mpiSparklineCanvas = ref(null)

// Sparkline history data (for trend visualization)
const sparklineHistory = ref({
  initial: [],
  periodic: [],
  mpi: []
})

// Computed: batch progress (for visual bar)
const batchProgress = computed(() => {
  const count = stepBatch.value?.items?.length || 0
  return Math.min((count / 100) * 100, 100)
})

// Computed: MPI high risk indicator
const isMpiHighRisk = computed(() => {
  const mean = Number(mpiStats.value?.mean)
  return Number.isFinite(mean) && mean < 60
})

// Toggle accordion group
const toggleGroup = (groupId) => {
  if (openGroups.value.has(groupId)) {
    openGroups.value.delete(groupId)
  } else {
    openGroups.value.add(groupId)
  }
  // Force reactivity
  openGroups.value = new Set(openGroups.value)
}

// Toggle all accordion groups
const toggleAllGroups = () => {
  if (allGroupsExpanded.value) {
    openGroups.value = new Set(['mechanical'])
  } else {
    openGroups.value = new Set(['mechanical', 'load', 'calcMode', 'mpi'])
  }
}

// Draw sparkline on canvas
const drawSparkline = (canvas, data, color = '#0f766e') => {
  if (!canvas || !Array.isArray(data) || data.length < 2) return

  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

  const width = rect.width
  const height = rect.height
  const padding = 4
  const drawWidth = width - padding * 2
  const drawHeight = height - padding * 2

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  ctx.clearRect(0, 0, width, height)
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  data.forEach((value, i) => {
    const x = padding + (i / (data.length - 1)) * drawWidth
    const y = padding + drawHeight - ((value - min) / range) * drawHeight
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })

  ctx.stroke()

  // Add gradient fill
  ctx.lineTo(padding + drawWidth, height)
  ctx.lineTo(padding, height)
  ctx.closePath()
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, color + '20')
  gradient.addColorStop(1, color + '00')
  ctx.fillStyle = gradient
  ctx.fill()
}

// Update sparkline data
const updateSparklines = () => {
  // Update history with current values
  if (stepResult.value?.initial_step !== undefined) {
    sparklineHistory.value.initial.push(stepResult.value.initial_step)
    if (sparklineHistory.value.initial.length > 20) sparklineHistory.value.initial.shift()
  }
  if (stepResult.value?.periodic_step !== undefined) {
    sparklineHistory.value.periodic.push(stepResult.value.periodic_step)
    if (sparklineHistory.value.periodic.length > 20) sparklineHistory.value.periodic.shift()
  }
  if (mpiStats.value?.mean !== undefined) {
    sparklineHistory.value.mpi.push(mpiStats.value.mean)
    if (sparklineHistory.value.mpi.length > 20) sparklineHistory.value.mpi.shift()
  }

  // Draw sparklines
  nextTick(() => {
    drawSparkline(initialSparklineCanvas.value, sparklineHistory.value.initial, '#0f766e')
    drawSparkline(periodicSparklineCanvas.value, sparklineHistory.value.periodic, '#7c3aed')
    drawSparkline(mpiSparklineCanvas.value, sparklineHistory.value.mpi, isMpiHighRisk.value ? '#dc2626' : '#0ea5e9')
  })
}

const layerParamsCache = new LRUCache(120)

const formatNumber = (value, digits = 2, suffix = '') => {
  const n = Number(value)
  if (!Number.isFinite(n)) return '-'
  return `${n.toFixed(digits)}${suffix ? ` ${suffix}` : ''}`
}

const stepModelLabel = (value) => {
  const key = String(value || '')
  const translated = sp(`model.${key}`)
  return translated === `steps.model.${key}` ? key : translated
}

const stepTargetLabel = (value) => {
  const key = String(value || '')
  const translated = sp(`targetOption.${key}`)
  return translated === `steps.targetOption.${key}` ? key : translated
}

const mpiSuggestion = computed(() => {
  const mean = Number(mpiStats.value?.mean)
  if (!Number.isFinite(mean)) return sp('suggestion.waiting')

  if (geoAwareEnabled.value && mpiGeoCompare.value) {
    const baselineMean = Number(mpiGeoCompare.value?.baseline_statistics?.mean)
    const geoMean = Number(mpiGeoCompare.value?.geology_aware_statistics?.mean)
    const delta = geoMean - baselineMean
    if (mpiGeoCompare.value?.fallback_used) {
      return sp('suggestion.geoFallback')
    }
    if (Number.isFinite(delta) && delta <= -3) {
      return sp('suggestion.geoDrop', { delta: delta.toFixed(2) })
    }
    if (Number.isFinite(delta) && delta >= 3) {
      return sp('suggestion.geoRise', { delta: delta.toFixed(2) })
    }
    return sp('suggestion.geoStable')
  }

  if (mean < 60) return sp('suggestion.lowMpi')
  if (mean < 80) return sp('suggestion.midMpi')
  return sp('suggestion.highMpi')
})

const geoCompareSummary = computed(() => {
  if (!mpiGeoCompare.value) return null
  const baselineMean = Number(mpiGeoCompare.value?.baseline_statistics?.mean)
  const geoMean = Number(mpiGeoCompare.value?.geology_aware_statistics?.mean)
  if (!Number.isFinite(baselineMean) || !Number.isFinite(geoMean)) return null
  return {
    baselineMean,
    geoMean,
    delta: geoMean - baselineMean,
    fallbackUsed: Boolean(mpiGeoCompare.value?.fallback_used),
    algorithmMode: mpiGeoCompare.value?.algorithm_mode || sp('unmarked')
  }
})

const geoFeatureSummary = computed(() => {
  const features = mpiGeoCompare.value?.feature_trace?.features
  if (!features) return ''
  const continuity = Number(features.continuity_score)
  const pinchout = Number(features.pinchout_ratio)
  const layerCv = Number(features.layer_cv)
  const span = Number(features.key_layer_span)
  const tokens = []
  if (Number.isFinite(continuity)) tokens.push(sp('feature.continuity', { value: continuity.toFixed(3) }))
  if (Number.isFinite(pinchout)) tokens.push(sp('feature.pinchout', { value: pinchout.toFixed(3) }))
  if (Number.isFinite(layerCv)) tokens.push(sp('feature.layerCv', { value: layerCv.toFixed(3) }))
  if (Number.isFinite(span)) tokens.push(sp('feature.keySpan', { value: span.toFixed(1) }))
  return tokens.length ? sp('feature.prefix', { values: tokens.join('，') }) : ''
})

const zoneRiskSummary = computed(() => {
  const grid = mpiGrid.value
  if (!Array.isArray(grid) || !grid.length) return []
  let high = 0
  let medium = 0
  let low = 0
  let total = 0

  for (const row of grid) {
    if (!Array.isArray(row)) continue
    for (const raw of row) {
      const value = Number(raw)
      if (!Number.isFinite(value)) continue
      total += 1
      if (value < 60) {
        high += 1
      } else if (value < 80) {
        medium += 1
      } else {
        low += 1
      }
    }
  }
  if (!total) return []
  const ratio = (count) => ((count / total) * 100).toFixed(1)
  return [
    { key: 'high', label: sp('zone.highRisk'), count: high, ratio: ratio(high) },
    { key: 'medium', label: sp('zone.watch'), count: medium, ratio: ratio(medium) },
    { key: 'low', label: sp('zone.lowRisk'), count: low, ratio: ratio(low) }
  ]
})

const createDebouncer = (fn, delay = 600) => {
  let timer = null
  return () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(fn, delay)
  }
}

const runStepResult = async (notifyError = false) => {
  loadingStepResult.value = true
  stepResultError.value = ''
  try {
    const { data } = await pressureSteps(stepModel.value, stepH.value, stepQ.value, stepT.value, stepS.value)
    stepResult.value = data
  } catch (error) {
    const message = error?.response?.data?.detail || sp('errorStepResult')
    stepResultError.value = message
    if (notifyError) toast.add(message, 'error')
  } finally {
    loadingStepResult.value = false
  }
}

const runStepGrid = async (notifyError = false) => {
  loadingStepGrid.value = true
  stepGridError.value = ''
  try {
    const { data } = await pressureStepsGrid(
      stepModel.value,
      stepTarget.value,
      hMode.value,
      qMode.value,
      gridSize.value,
      defaultQ.value
    )
    stepGrid.value = data
  } catch (error) {
    const message = error?.response?.data?.detail || sp('errorStepGrid')
    stepGridError.value = message
    if (notifyError) toast.add(message, 'error')
  } finally {
    loadingStepGrid.value = false
  }
}

const runStepBatch = async (notifyError = false) => {
  loadingStepBatch.value = true
  stepBatchError.value = ''
  try {
    const { data } = await pressureStepsBatch(stepModel.value)
    stepBatch.value = data
  } catch (error) {
    const message = error?.response?.data?.detail || sp('errorStepBatch')
    stepBatchError.value = message
    if (notifyError) toast.add(message, 'error')
  } finally {
    loadingStepBatch.value = false
  }
}

const getLayerParams = async (name) => {
  if (!name) return null
  if (layerParamsCache.has(name)) return layerParamsCache.get(name)
  try {
    const { data } = await getRockParams(name)
    layerParamsCache.set(name, data)
    return data
  } catch {
    layerParamsCache.set(name, null)
    return null
  }
}

const buildMpiPoints = async (boreholes = []) => {
  const points = []
  for (const borehole of boreholes) {
    const layers = borehole.layers || []
    const seamLayer = layers.find((l) => l.name === mpiSeam.value)
    const strataLayers = layers.filter((l) => l.name !== mpiSeam.value)

    const strata = []
    for (const layer of strataLayers) {
      const params = await getLayerParams(layer.name)
      strata.push({
        thickness: layer.thickness || 0,
        name: layer.name || '',
        density: params?.density,
        bulk_modulus: params?.bulk_modulus,
        shear_modulus: params?.shear_modulus,
        cohesion: params?.cohesion,
        friction_angle: params?.friction_angle,
        tensile_strength: params?.tensile_strength,
        compressive_strength: params?.compressive_strength,
        elastic_modulus: params?.elastic_modulus,
        poisson_ratio: params?.poisson_ratio
      })
    }

    const burialDepth = borehole.seam_top_depth ?? borehole.total_overburden_thickness ?? 0
    const thickness = seamLayer?.thickness || 0

    points.push({
      x: borehole.x,
      y: borehole.y,
      borehole: borehole.name,
      thickness,
      burial_depth: burialDepth,
      z_top: burialDepth,
      z_bottom: burialDepth + thickness,
      strata
    })
  }
  return points
}

const runMpiGrid = async (notifyError = false) => {
  if (!mpiSeam.value) {
    mpiGrid.value = null
    mpiStats.value = {}
    mpiGeoCompare.value = null
    return
  }

  loadingMpi.value = true
  mpiError.value = ''
  mpiGeoCompare.value = null
  try {
    const { data } = await getSeamOverburden(mpiSeam.value)
    const boreholes = data?.boreholes || []
    if (!boreholes.length) {
      mpiGrid.value = null
      mpiStats.value = {}
      mpiGeoCompare.value = null
      mpiError.value = sp('errorNoBoreholes')
      if (notifyError) toast.add(mpiError.value, 'warning')
      return
    }

    const points = await buildMpiPoints(boreholes)
    if (geoAwareEnabled.value) {
      const payload = {
        points,
        resolution: mpiGridSize.value,
        method: mpiMethod.value
      }
      if (geoModelJobId.value) {
        payload.geomodel_job_id = geoModelJobId.value
      }
      const { data: geoData } = await mpiInterpolateGeo(payload)
      mpiGrid.value = geoData?.geology_aware_grid || null
      mpiStats.value = geoData?.geology_aware_statistics || {}
      mpiGeoCompare.value = geoData || null
    } else {
      const { data: mpiData } = await mpiInterpolate(points, mpiGridSize.value, mpiMethod.value)
      mpiGrid.value = mpiData?.grid || null
      mpiStats.value = mpiData?.statistics || {}
    }
  } catch (error) {
    const message = error?.response?.data?.detail || sp('errorMpi')
    mpiError.value = message
    if (notifyError) toast.add(message, 'error')
  } finally {
    loadingMpi.value = false
  }
}

const refreshAll = async (notify = false) => {
  refreshing.value = true
  await Promise.all([
    runStepResult(notify),
    runStepGrid(notify),
    runStepBatch(notify),
    runMpiGrid(notify)
  ])
  refreshing.value = false
  if (notify) toast.add(sp('refreshDone'), 'success')
}

const handleExportGrid = async () => {
  try {
    const { data } = await exportPressureStepsGrid(
      stepModel.value,
      stepTarget.value,
      hMode.value,
      qMode.value,
      gridSize.value,
      defaultQ.value
    )
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = `pressure_steps_grid_${stepModel.value}_${stepTarget.value}_${gridSize.value}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.add(sp('exportStepGridDone'), 'success')
  } catch {
    toast.add(sp('exportStepGridFailed'), 'error')
  }
}

const handleExportBatch = async () => {
  try {
    const { data } = await exportPressureSteps(stepModel.value)
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = `pressure_steps_${stepModel.value}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.add(sp('exportBatchDone'), 'success')
  } catch {
    toast.add(sp('exportBatchFailed'), 'error')
  }
}

const loadMpiSeams = async () => {
  try {
    const { data } = await getCoalSeams()
    mpiSeams.value = data?.seams || []
    if (!mpiSeam.value && mpiSeams.value.length) {
      const defaultSeam = mpiSeams.value.find(s => s.name === '16-3煤')
      mpiSeam.value = defaultSeam?.name || mpiSeams.value[0].name
    }
  } catch {
    mpiSeams.value = []
    mpiSeam.value = ''
    mpiError.value = sp('errorLoadSeams')
  }
}

const debounceStepResult = createDebouncer(() => runStepResult(false), 500)
const debounceStepGrid = createDebouncer(() => runStepGrid(false), 650)
const debounceStepBatch = createDebouncer(() => runStepBatch(false), 650)
const debounceMpi = createDebouncer(() => runMpiGrid(false), 700)
const debounceMpiGeo = createDebouncer(() => runMpiGrid(false), 900)

watch([stepModel, stepH, stepQ, stepT, stepS], () => {
  if (!initialized.value) return
  debounceStepResult()
})

watch([stepModel, stepTarget, hMode, qMode, defaultQ, gridSize], () => {
  if (!initialized.value) return
  debounceStepGrid()
})

watch(stepModel, () => {
  if (!initialized.value) return
  debounceStepBatch()
})

watch([mpiSeam, mpiGridSize, mpiMethod], () => {
  if (!initialized.value) return
  debounceMpi()
})

watch(geoAwareEnabled, () => {
  if (!initialized.value) return
  debounceMpi()
})

watch(geoModelJobId, () => {
  if (!initialized.value || !geoAwareEnabled.value) return
  debounceMpiGeo()
})

// Watch for data changes to update sparklines
watch([stepResult, mpiStats], () => {
  if (initialized.value) {
    updateSparklines()
  }
}, { deep: true })

onMounted(async () => {
  await loadMpiSeams()
  initialized.value = true
  await refreshAll(false)
  // Initialize sparklines after initial data load
  nextTick(updateSparklines)
})
</script>

<style scoped>
/* ============================================
   来压步距页面 - 重构设计
   - 左侧手风琴参数面板
   - 右侧预览区（KPI + 可视化）
   ============================================ */

.steps-page {
  --sidebar-width: 320px;
  --gap-xl: 24px;
  --gap-lg: 16px;
  --gap-md: 12px;
  --gap-sm: 8px;
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
  --color-primary: #0f766e;
  --color-primary-light: #ccfbf1;
  --color-accent: #7c3aed;
  --color-danger: #dc2626;
  --color-warning: #f59e0b;
  --color-success: #10b981;
  --color-bg-elevated: #ffffff;
  --color-bg-subtle: #f8fafc;
  --color-bg-surface: #f1f5f9;
  --color-border: #e2e8f0;
  --color-border-subtle: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-5) var(--spacing-6);
  box-shadow: var(--shadow-sm);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn {
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  padding: var(--spacing-3) var(--spacing-4);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: var(--gradient-primary);
  color: #fff;
  box-shadow: 0 6px 16px rgba(14, 116, 144, 0.3);
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(14, 116, 144, 0.34);
}

.btn.secondary {
  background: #e9f0ee;
  border-color: rgba(15, 118, 110, 0.18);
  color: #1f2937;
}

.btn.secondary:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(15, 118, 110, 0.32);
  background: #deebe8;
}

.spinner {
  display: inline-block;
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 6px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.params-card h2,
.kpi-card h2 {
  margin: 0 0 var(--spacing-3);
  font-size: 16px;
  color: #0f172a;
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-3);
}

.params-grid label {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  font-size: 12px;
  color: #475569;
}

.params-grid input,
.params-grid select {
  border: 1px solid #d5e4e1;
  border-radius: 10px;
  padding: var(--spacing-2) var(--spacing-3);
  font-size: 13px;
  background: #fff;
}

.params-grid input:focus,
.params-grid select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.geo-toggle-line {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  min-height: 38px;
}

.geo-toggle-line input[type='checkbox'] {
  width: 16px;
  height: 16px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-3);
}

.kpi-item {
  border: 1px solid rgba(14, 116, 144, 0.16);
  border-radius: 12px;
  padding: var(--spacing-3);
  background: linear-gradient(135deg, #ffffff, #f2f8f7);
}

.kpi-item span {
  display: block;
  font-size: 12px;
  color: #64748b;
}

.kpi-item strong {
  display: block;
  margin-top: var(--spacing-1);
  font-size: 22px;
  color: #0f172a;
}

.kpi-item small {
  color: var(--color-info);
  font-size: 11px;
}

.hint {
  margin: var(--spacing-3) 0 0;
  color: #b91c1c;
  font-size: 12px;
}

.two-col {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--spacing-4);
}

.panel {
  min-height: 420px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
}

.panel-head h3 {
  margin: 0;
  font-size: 15px;
  color: #0f172a;
}

.tag {
  font-size: 11px;
  border-radius: 999px;
  padding: var(--spacing-1) var(--spacing-3);
  background: #dbeafe;
  color: #1e3a8a;
}

.panel-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.loading-block,
.empty-block {
  min-height: 260px;
  display: grid;
  place-items: center;
  border: 1px dashed #bfd3d9;
  border-radius: 12px;
  font-size: 13px;
  color: #334155;
  background: #eef6f5;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-2);
}

.stat-item {
  border: 1px solid #d8e6e3;
  border-radius: 10px;
  padding: var(--spacing-3);
  background: #fafdfc;
}

.stat-item span {
  display: block;
  font-size: 11px;
  color: #64748b;
}

.stat-item strong {
  display: block;
  margin-top: var(--spacing-1);
  font-size: 16px;
  color: #0f172a;
}

.suggestion {
  border: 1px solid #bde8de;
  background: linear-gradient(135deg, #ecfdf8, #ddf7ef);
  border-radius: 12px;
  padding: var(--spacing-3);
}

.suggestion h4 {
  margin: 0 0 var(--spacing-1);
  font-size: 13px;
  color: #0f766e;
}

.suggestion p {
  margin: 0;
  font-size: 12px;
  color: #0f766e;
}

.geo-summary {
  border: 1px solid #bfd6ff;
  background: linear-gradient(135deg, #edf4ff, #e2ecff);
  border-radius: 12px;
  padding: var(--spacing-3);
}

.geo-summary h4,
.zone-card h4 {
  margin: 0 0 var(--spacing-2);
  font-size: 13px;
  color: #1d4ed8;
}

.geo-summary-row {
  margin-top: var(--spacing-1);
}

.geo-meta,
.geo-feature {
  margin: var(--spacing-2) 0 0;
  font-size: 12px;
  color: #1e3a8a;
}

.zone-card {
  border: 1px solid #cfe7db;
  border-radius: 12px;
  padding: var(--spacing-3);
  background: #f7fcfa;
}

.zone-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-2);
}

.zone-item {
  border-radius: 10px;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid transparent;
}

.zone-item span {
  display: block;
  font-size: 11px;
  color: #334155;
}

.zone-item strong {
  display: block;
  margin-top: 3px;
  font-size: 13px;
  color: #0f172a;
}

.zone-item.high {
  border-color: #fecaca;
  background: #fff1f2;
}

.zone-item.medium {
  border-color: #fde68a;
  background: #fff9e8;
}

.zone-item.low {
  border-color: #bbf7d0;
  background: #ecfdf3;
}

.table-wrap {
  overflow-x: auto;
}

.table-foot {
  margin-top: var(--spacing-2);
  font-size: 12px;
  color: var(--text-tertiary);
}

@media (max-width: 1200px) {
  .params-grid,
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .two-col {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .hero-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .params-grid,
  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .zone-grid {
    grid-template-columns: 1fr;
  }
}

/* ============================================
   NEW REFACTORED STYLES
   ============================================ */

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
}

.action-divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
  margin: 0 var(--gap-sm);
}

/* MAIN LAYOUT */
.steps-layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  gap: var(--gap-xl);
  align-items: start;
  max-width: 1600px;
  margin: 0 auto;
}

/* PARAMS SIDEBAR */
.params-sidebar {
  position: sticky;
  top: var(--gap-lg);
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  overflow: hidden;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--gap-lg);
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(to bottom, var(--color-bg-subtle), var(--color-bg-elevated));
}

.sidebar-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.expand-all-btn {
  font-size: 12px;
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-elevated);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.expand-all-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.param-groups {
  padding: var(--gap-md);
  overflow-y: auto;
  flex: 1;
}

/* ACCORDION GROUPS */
.param-group {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--gap-sm);
  background: var(--color-bg-elevated);
  transition: all 0.2s;
}

.param-group.open {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-sm);
}

.param-group-header {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
  padding: var(--gap-md);
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  border-radius: var(--radius-md);
  transition: background 0.2s;
}

.param-group-header:hover {
  background: var(--color-bg-subtle);
}

.group-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.group-label {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.group-count {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  background: var(--color-bg-surface);
  color: var(--text-tertiary);
}

.chevron {
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
  transition: transform 0.2s;
  flex-shrink: 0;
}

.param-group.open .chevron {
  transform: rotate(180deg);
}

.param-group-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease-out;
}

.param-group.open .param-group-body {
  grid-template-rows: 1fr;
}

.param-group-body > * {
  overflow: hidden;
}

.param-fields {
  padding: 0 var(--gap-md) var(--gap-md);
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
}

.param-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.param-field > span {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.param-field input,
.param-field select {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  background: var(--color-bg-elevated);
  color: var(--text-primary);
  transition: all 0.2s;
}

.param-field input:focus,
.param-field select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

.param-field.toggle-field {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--color-bg-subtle);
  border-radius: var(--radius-sm);
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
  font-size: 13px;
}

.toggle-label input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}

.toggle-status {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 12px;
  background: var(--color-bg-elevated);
  color: var(--text-tertiary);
}

.sidebar-error {
  margin: var(--gap-md);
  padding: var(--gap-md);
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-sm);
  color: #dc2626;
  font-size: 12px;
}

/* PREVIEW AREA */
.preview-area {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xl);
}

/* KPI CARDS ROW */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--gap-lg);
}

.kpi-card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  padding: var(--gap-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  opacity: 0;
  transition: opacity 0.2s;
}

.kpi-card:hover::before {
  opacity: 1;
}

.kpi-card.loading {
  opacity: 0.6;
  pointer-events: none;
}

.kpi-card.risk-high {
  border-color: #fecaca;
  background: linear-gradient(to bottom, #fff5f5, var(--color-bg-elevated));
}

.kpi-card.risk-high::before {
  background: var(--color-danger);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--gap-sm);
}

.kpi-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.kpi-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.kpi-icon.risk-icon {
  color: var(--color-danger);
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-family-mono, 'JetBrains Mono', monospace);
  margin-bottom: var(--gap-sm);
}

.kpi-sparkline {
  width: 100%;
  height: 32px;
}

.kpi-bar {
  height: 4px;
  background: var(--color-bg-surface);
  border-radius: 2px;
  overflow: hidden;
  margin-top: var(--gap-sm);
}

.kpi-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width 0.5s ease-out;
}

.kpi-hint {
  display: block;
  margin-top: var(--gap-sm);
  font-size: 11px;
  color: var(--text-tertiary);
}

/* VISUALIZATION GRID */
.viz-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--gap-xl);
}

.viz-card {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viz-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--gap-lg);
  border-bottom: 1px solid var(--color-border);
}

.viz-header h3 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.viz-meta {
  margin: 0;
  font-size: 12px;
  color: var(--text-tertiary);
}

.viz-tag {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 12px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 500;
}

.viz-body {
  padding: var(--gap-lg);
  flex: 1;
  min-height: 280px;
}

.viz-body.scrollable {
  overflow-y: auto;
  max-height: 480px;
}

.mpi-viz .viz-body {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
}

/* Mini Stats Row */
.mini-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-sm);
}

.mini-stat {
  padding: var(--gap-sm);
  background: var(--color-bg-subtle);
  border-radius: var(--radius-sm);
  text-align: center;
}

.mini-stat span {
  display: block;
  font-size: 11px;
  color: var(--text-tertiary);
}

.mini-stat strong {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 2px;
}

/* Suggestion Card */
.suggestion-card {
  display: flex;
  gap: var(--gap-md);
  padding: var(--gap-md);
  background: linear-gradient(135deg, #f0fdfa, #ecfdf5);
  border: 1px solid #ccfbf1;
  border-radius: var(--radius-md);
}

.suggestion-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.suggestion-card h4 {
  margin: 0 0 4px 0;
  font-size: 13px;
  color: var(--color-primary);
}

.suggestion-card p {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Geo Compare Card */
.geo-compare-card {
  padding: var(--gap-md);
  background: linear-gradient(135deg, #eff6ff, #eef2ff);
  border: 1px solid #dbeafe;
  border-radius: var(--radius-md);
}

.geo-compare-card h4 {
  margin: 0 0 var(--gap-sm) 0;
  font-size: 13px;
  color: #1d4ed8;
}

.compare-stats {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--gap-sm);
  align-items: center;
}

.compare-item {
  text-align: center;
}

.compare-item span {
  display: block;
  font-size: 11px;
  color: var(--text-tertiary);
}

.compare-item strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.compare-item.delta strong {
  font-size: 16px;
  color: var(--color-warning);
}

.compare-item.delta strong.positive {
  color: var(--color-success);
}

.compare-item.delta strong.negative {
  color: var(--color-danger);
}

.geo-meta {
  margin: var(--gap-sm) 0 0 0;
  font-size: 11px;
  color: var(--text-tertiary);
}

/* Zone Risk Card */
.zone-risk-card {
  padding: var(--gap-md);
  background: linear-gradient(135deg, #fefce8, #fef9c3);
  border: 1px solid #fef08a;
  border-radius: var(--radius-md);
}

.zone-risk-card h4 {
  margin: 0 0 var(--gap-sm) 0;
  font-size: 13px;
  color: #a16207;
}

.zone-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-sm);
}

.zone-item {
  padding: var(--gap-sm);
  border-radius: var(--radius-sm);
  text-align: center;
}

.zone-item span {
  display: block;
  font-size: 11px;
  color: var(--text-tertiary);
}

.zone-item strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-top: 2px;
}

.zone-item.high {
  background: #fef2f2;
  color: #dc2626;
}

.zone-item.medium {
  background: #fffbeb;
  color: #d97706;
}

.zone-item.low {
  background: #f0fdf4;
  color: #16a34a;
}

/* BATCH SECTION (Collapsible) */
.batch-section {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all 0.2s;
}

.batch-header {
  display: flex;
  align-items: center;
  gap: var(--gap-md);
  padding: var(--gap-lg);
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
}

.batch-header:hover {
  background: var(--color-bg-subtle);
}

.batch-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.batch-count {
  margin-left: auto;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  background: var(--color-bg-surface);
  color: var(--text-secondary);
}

.collapse-chevron {
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
  transition: transform 0.2s;
}

.collapse-chevron.flipped {
  transform: rotate(180deg);
}

.batch-body {
  padding: 0 var(--gap-lg) var(--gap-lg);
  border-top: 1px solid var(--color-border);
}

.batch-section.collapsed .batch-body {
  display: none;
}

/* RESPONSIVE */
@media (max-width: 1400px) {
  .steps-layout {
    grid-template-columns: 280px 1fr;
  }
}

@media (max-width: 1200px) {
  .steps-layout {
    grid-template-columns: 1fr;
  }

  .params-sidebar {
    position: static;
    max-height: none;
  }

  .kpi-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .viz-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .kpi-row {
    grid-template-columns: 1fr;
  }

  .compare-stats {
    grid-template-columns: 1fr;
  }

  .zone-items {
    grid-template-columns: 1fr;
  }

  .mini-stats-row {
    grid-template-columns: 1fr;
  }
}
</style>
