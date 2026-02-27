<template>
  <div class="report-page">
    <PageHeader
      class="main-header"
      :title="rp('title')"
      :description="rp('subtitle')"
    >
      <template #actions>
        <div class="hero-actions">
          <button class="btn primary" :disabled="loading" @click="generateReport(true)">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? rp('refreshing') : rp('refreshReport') }}
          </button>
          <button class="btn secondary" :disabled="!summary.length" @click="exportReport">{{ rp('exportCsv') }}</button>
          <button class="btn secondary" @click="goValidation">{{ rp('backToValidation') }}</button>
        </div>
      </template>
    </PageHeader>

    <section class="card controls">
      <div class="control-item">
        <label>{{ rp('seam') }}</label>
        <select v-model="selectedSeam" :disabled="!seamOptions.length">
          <option v-for="item in seamOptions" :key="item.name" :value="item.name">{{ item.name }}</option>
        </select>
      </div>
      <div class="control-item status">
        <label>{{ rp('reportStatus') }}</label>
        <span class="status-chip" :class="loading ? 'loading' : summary.length ? 'ready' : 'idle'">
          {{ loading ? rp('statusCalculating') : summary.length ? rp('statusReady') : rp('statusEmpty') }}
        </span>
      </div>
      <div class="control-item status">
        <label>{{ rp('lastUpdated') }}</label>
        <span>{{ generatedAt || '-' }}</span>
      </div>
      <div class="control-item geomodel-control">
        <label>{{ rp('geomodelJobId') }}</label>
        <div class="geomodel-input-row">
          <input v-model.trim="geomodelJobId" type="text" :placeholder="rp('geomodelJobPlaceholder')">
          <button class="btn secondary small" :disabled="geomodelLoading || !geomodelJobId" @click="loadGeomodelQuality(true)">
            {{ geomodelLoading ? rp('loadingGeomodel') : rp('loadGeomodelQuality') }}
          </button>
        </div>
      </div>
    </section>

    <section class="card" v-if="reportError">
      <p class="error">{{ reportError }}</p>
    </section>

    <section class="card">
      <h2>{{ rp('overviewStats') }}</h2>
      <div class="cards-grid" v-if="summary.length">
        <article class="metric-card" v-for="row in summary" :key="row.nameKey || row.name">
          <h3>{{ summaryDisplayName(row) }}</h3>
          <div class="metric-main">{{ formatNumber(row.stats.mean, 3) }}</div>
          <div class="metric-sub">
            <span>{{ rp('min') }} {{ formatNumber(row.stats.min, 3) }}</span>
            <span>{{ rp('max') }} {{ formatNumber(row.stats.max, 3) }}</span>
          </div>
          <div class="metric-sub">
            <span>{{ rp('std') }} {{ formatNumber(row.stats.std, 3) }}</span>
            <span>{{ rp('p50') }} {{ formatNumber(row.stats.p50, 3) }}</span>
          </div>
        </article>
      </div>
      <div v-else class="empty-block">{{ loading ? rp('generatingOverviewStats') : rp('noOverviewStats') }}</div>
    </section>

    <section class="card">
      <h2>{{ rp('mpiAnalysis') }}</h2>
      <div v-if="mpiSummary" class="mpi-layout">
        <div class="mpi-stats">
          <div class="stat-item"><span>{{ rp('seam') }}</span><strong>{{ mpiSummary.seamName }}</strong></div>
          <div class="stat-item"><span>{{ rp('mpiMean') }}</span><strong>{{ formatNumber(mpiSummary.stats.mean, 2) }}</strong></div>
          <div class="stat-item"><span>{{ rp('mpiMin') }}</span><strong>{{ formatNumber(mpiSummary.stats.min, 2) }}</strong></div>
          <div class="stat-item"><span>{{ rp('mpiMax') }}</span><strong>{{ formatNumber(mpiSummary.stats.max, 2) }}</strong></div>
          <div class="stat-item"><span>{{ rp('rsiMean') }}</span><strong>{{ formatNumber(mpiSummary.breakdown.rsi, 2) }}</strong></div>
          <div class="stat-item"><span>{{ rp('briMean') }}</span><strong>{{ formatNumber(mpiSummary.breakdown.bri, 2) }}</strong></div>
          <div class="stat-item"><span>{{ rp('asiMean') }}</span><strong>{{ formatNumber(mpiSummary.breakdown.asi, 2) }}</strong></div>
        </div>

        <div class="mpi-extremes">
          <article>
            <h3>{{ rp('highMpiArea') }}</h3>
            <ul>
              <li v-for="item in mpiSummary.high" :key="`high-${item.id}`">{{ item.id }}: {{ formatNumber(item.mpi, 2) }}</li>
            </ul>
          </article>
          <article>
            <h3>{{ rp('lowMpiArea') }}</h3>
            <ul>
              <li v-for="item in mpiSummary.low" :key="`low-${item.id}`">{{ item.id }}: {{ formatNumber(item.mpi, 2) }}</li>
            </ul>
          </article>
        </div>
      </div>
      <div v-else class="empty-block">{{ loading ? rp('generatingMpiAnalysis') : rp('noMpiAnalysis') }}</div>
    </section>

    <section class="card">
      <h2>{{ rp('geomodelQualitySection') }}</h2>
      <div v-if="geomodelError" class="error">{{ geomodelError }}</div>
      <div v-else-if="geomodelQuality" class="geomodel-quality-grid">
        <article class="metric-card">
          <h3>{{ rp('jobStatus') }}</h3>
          <div class="metric-main">{{ geomodelStatusLabel(geomodelQuality.status) }}</div>
          <div class="metric-sub"><span>{{ rp('jobId') }}</span><span>{{ geomodelJobId }}</span></div>
        </article>
        <article class="metric-card">
          <h3>{{ rp('continuityScore') }}</h3>
          <div class="metric-main">{{ formatNumber(geomodelQuality.summary?.continuity_score, 3) }}</div>
          <div class="metric-sub"><span>{{ rp('pinchoutRatio') }}</span><span>{{ formatNumber(geomodelQuality.summary?.pinchout_ratio, 3) }}</span></div>
        </article>
        <article class="metric-card">
          <h3>{{ rp('layerCv') }}</h3>
          <div class="metric-main">{{ formatNumber(geomodelQuality.summary?.layer_cv, 3) }}</div>
          <div class="metric-sub"><span>{{ rp('zeroOrNegativeRatio') }}</span><span>{{ formatNumber(geomodelQuality.summary?.zero_or_negative_ratio, 3) }}</span></div>
        </article>
        <article class="metric-card warning-card">
          <h3>{{ rp('qualityWarning') }}</h3>
          <div class="warning-list">
            <span v-if="geomodelQuality.warning_flags?.low_continuity">{{ rp('warningLowContinuity') }}</span>
            <span v-if="geomodelQuality.warning_flags?.high_pinchout">{{ rp('warningHighPinchout') }}</span>
            <span v-if="geomodelQuality.warning_flags?.high_variability">{{ rp('warningHighVariability') }}</span>
            <span v-if="!geomodelQuality.warning_flags || (!geomodelQuality.warning_flags.low_continuity && !geomodelQuality.warning_flags.high_pinchout && !geomodelQuality.warning_flags.high_variability)">{{ rp('warningNone') }}</span>
          </div>
        </article>
      </div>
      <div v-else class="empty-block">{{ rp('geomodelPrompt') }}</div>
    </section>

    <section class="card">
      <h2>{{ rp('week3Progress') }}</h2>
      <div v-if="week3Research && week3Research.status !== 'missing'" class="week3-layout">
        <article class="metric-card week3-perf-card" v-if="reportPerformance">
          <h3>{{ rp('reportApiPerformance') }}</h3>
          <div class="metric-sub"><span>{{ rp('requestsTotal') }}</span><span>{{ reportPerformance.requests_total ?? '-' }}</span></div>
          <div class="metric-sub"><span>{{ rp('cacheHitRate') }}</span><span>{{ formatPercent(reportPerformance.cache_hit_rate) }}</span></div>
          <div class="metric-sub"><span>{{ rp('avgColdStartMs') }}</span><span>{{ formatNumber(reportPerformance.avg_compute_ms, 2) }}</span></div>
          <div class="metric-sub"><span>{{ rp('avgCachedMs') }}</span><span>{{ formatNumber(reportPerformance.avg_cached_ms, 2) }}</span></div>
          <div class="metric-sub"><span>{{ rp('latestSource') }}</span><span>{{ reportCacheHit ? rp('sourceCacheHit') : rp('sourceColdStart') }}</span></div>
        </article>

        <article class="metric-card week3-split-card">
          <h3>{{ rp('splitLeakageAudit') }}</h3>
          <div class="metric-sub">
            <span>{{ rp('status') }}</span>
            <strong :class="week3Research.split_audit?.all_overlap_zero ? 'ok-text' : 'warn-text'">
              {{ week3Research.split_audit?.all_overlap_zero ? rp('pass') : rp('needsAttention') }}
            </strong>
          </div>
          <div class="metric-sub"><span>{{ rp('strategy') }}</span><span>{{ week3Research.split_audit?.strategy || '-' }}</span></div>
          <div class="metric-sub"><span>{{ rp('foldCount') }}</span><span>{{ week3Research.split_audit?.n_splits ?? '-' }}</span></div>
          <div class="metric-sub"><span>{{ rp('sampleCount') }}</span><span>{{ week3Research.split_audit?.row_count ?? '-' }}</span></div>
        </article>

        <article class="metric-card week3-suite-card" v-for="suite in week3Research.suites || []" :key="suite.suite_id">
          <h3>{{ suite.template_name || suite.suite_id }}</h3>
          <div class="metric-sub"><span>{{ rp('suite') }}</span><span>{{ suite.suite_id }}</span></div>
          <div class="metric-sub"><span>{{ rp('bestAuc') }}</span><span>{{ suite.best_auc_experiment || '-' }} / {{ formatNumber(suite.best_auc_value, 3) }}</span></div>
          <div class="metric-sub"><span>{{ rp('bestBrier') }}</span><span>{{ suite.best_brier_experiment || '-' }} / {{ formatNumber(suite.best_brier_value, 3) }}</span></div>
          <div class="mini-table-wrap" v-if="suite.runs?.length">
            <table class="mini-table">
              <thead>
                <tr>
                  <th>{{ rp('experiment') }}</th>
                  <th>AUC</th>
                  <th>Brier</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="run in suite.runs" :key="`${suite.suite_id}-${run.experiment_name}`">
                  <td>{{ run.experiment_name }}</td>
                  <td>{{ formatNumber(run.auc, 3) }}</td>
                  <td>{{ formatNumber(run.brier, 3) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
      <div class="week3-compare" v-if="week3Research?.stability_compare?.length">
        <h3>{{ rp('stabilityCompare') }}</h3>
        <div class="compare-table-wrap" v-for="item in week3Research.stability_compare" :key="`cmp-${item.template_name}`">
          <div class="compare-caption">{{ rp('compareCaption', { name: item.template_name, datasets: item.datasets?.join(' vs ') }) }}</div>
          <table class="mini-table">
            <thead>
              <tr>
                <th>{{ rp('experiment') }}</th>
                <th>ΔAUC</th>
                <th>ΔBrier</th>
                <th>ΔF1</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in item.comparisons || []" :key="`cmp-row-${item.template_name}-${row.experiment_name}`">
                <td>{{ row.experiment_name }}</td>
                <td>{{ formatNumber(row.delta_auc, 3) }}</td>
                <td>{{ formatNumber(row.delta_brier, 3) }}</td>
                <td>{{ formatNumber(row.delta_f1, 3) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="!(week3Research && week3Research.status !== 'missing')" class="empty-block">{{ rp('noWeek3Summary') }}</div>
    </section>

    <section class="card">
      <h2>{{ rp('detailStatsTable') }}</h2>
      <div class="table-wrap" v-if="summary.length">
        <table>
          <thead>
            <tr>
              <th>{{ rp('metric') }}</th>
              <th>{{ rp('minValue') }}</th>
              <th>{{ rp('maxValue') }}</th>
              <th>{{ rp('meanValue') }}</th>
              <th>{{ rp('stdValue') }}</th>
              <th>P10</th>
              <th>P50</th>
              <th>P90</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in summary" :key="`table-${row.nameKey || row.name}`">
              <td>{{ summaryDisplayName(row) }}</td>
              <td>{{ formatNumber(row.stats.min, 3) }}</td>
              <td>{{ formatNumber(row.stats.max, 3) }}</td>
              <td>{{ formatNumber(row.stats.mean, 3) }}</td>
              <td>{{ formatNumber(row.stats.std, 3) }}</td>
              <td>{{ formatNumber(row.stats.p10, 3) }}</td>
              <td>{{ formatNumber(row.stats.p50, 3) }}</td>
              <td>{{ formatNumber(row.stats.p90, 3) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-block">{{ loading ? rp('generatingDetailStats') : rp('noDetailStats') }}</div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import { useI18n } from '../composables/useI18n'
import { PageHeader } from '../components/library'
import {
  downloadGeomodelArtifact,
  getCoalSeams,
  getGeomodelJob,
  getRockParams,
  getSeamOverburden,
  mpiBatch,
  summaryReport,
  summaryIndex,
  summaryIndexWorkfaces,
  summarySteps,
  summaryStepsWorkfaces
} from '../api'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const { setSelectedSeam, markStepDone } = useWorkspaceFlow()
const { t } = useI18n()
const rp = (key, params) => t(`report.${key}`, params)

const loading = ref(false)
const summary = ref([])
const mpiSummary = ref(null)
const reportError = ref('')
const generatedAt = ref('')

const seamOptions = ref([])
const selectedSeam = ref('')
const initialized = ref(false)
const geomodelJobId = ref('')
const geomodelQuality = ref(null)
const geomodelLoading = ref(false)
const geomodelError = ref('')
const week3Research = ref(null)
const reportPerformance = ref(null)
const reportCacheHit = ref(false)

const layerParamsCache = new Map()
const layerParamsPending = new Map()

const formatNumber = (value, digits = 3) => {
  const n = Number(value)
  return Number.isFinite(n) ? n.toFixed(digits) : '-'
}

const formatPercent = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? `${(n * 100).toFixed(1)}%` : '-'
}

const summaryDisplayName = (row) => {
  const key = row?.nameKey ? `summaryLabels.${row.nameKey}` : ''
  if (key) {
    const translated = rp(key)
    if (translated !== `report.${key}`) return translated
  }
  return row?.name || '-'
}

const geomodelStatusLabel = (status) => {
  const value = String(status || '').toLowerCase()
  if (!value) return '-'
  const key = `statusLabel.${value}`
  const translated = rp(key)
  return translated === `report.${key}` ? status : translated
}

const normalizeQuerySeam = (value) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value : ''
}

const normalizeQueryJobId = (value) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value : ''
}

const loadSeams = async () => {
  try {
    const { data } = await getCoalSeams()
    seamOptions.value = data?.seams || []
    const seamFromQuery = normalizeQuerySeam(route.query?.seam)
    const jobFromQuery = normalizeQueryJobId(route.query?.geomodel_job_id) || normalizeQueryJobId(route.query?.geomodelJobId)
    if (jobFromQuery) geomodelJobId.value = jobFromQuery
    const preferred = seamFromQuery || seamOptions.value[0]?.name || ''
    selectedSeam.value = preferred
    if (preferred) setSelectedSeam(preferred)
  } catch {
    seamOptions.value = []
    selectedSeam.value = ''
  }
}

const loadGeomodelQuality = async (notify = false) => {
  geomodelError.value = ''
  geomodelQuality.value = null
  if (!geomodelJobId.value) return

  geomodelLoading.value = true
  try {
    const { data: job } = await getGeomodelJob(geomodelJobId.value)
    const summary = job?.result_manifest?.quality_summary || {}
    if (job?.status !== 'completed') {
      geomodelQuality.value = {
        status: job?.status || 'pending',
        summary,
        warning_flags: {}
      }
      if (notify) toast.add(rp('geomodelStatusTip', { status: geomodelStatusLabel(job?.status || 'pending') }), 'warning')
      return
    }

    let detail = {}
    try {
      const artifactResp = await downloadGeomodelArtifact(geomodelJobId.value, 'quality_report.json')
      const text = await artifactResp.data.text()
      detail = JSON.parse(text)
    } catch {
      detail = {}
    }

    geomodelQuality.value = {
      status: job?.status || 'completed',
      summary: {
        continuity_score: Number(summary?.continuity_score ?? detail?.continuity_score ?? 0),
        pinchout_ratio: Number(summary?.pinchout_ratio ?? detail?.pinchout_ratio ?? 0),
        layer_cv: Number(summary?.layer_cv ?? detail?.layer_cv ?? 0),
        zero_or_negative_ratio: Number(detail?.zero_or_negative_ratio ?? 0)
      },
      warning_flags: detail?.warning_flags || {}
    }
    if (notify) toast.add(rp('geomodelQualityLoaded'), 'success')
  } catch (error) {
    geomodelError.value = error?.response?.data?.detail || rp('errorLoadGeomodelQuality')
    if (notify) toast.add(geomodelError.value, 'error')
  } finally {
    geomodelLoading.value = false
  }
}

const getLayerParams = async (name) => {
  if (!name) return null
  if (layerParamsCache.has(name)) return layerParamsCache.get(name)
  if (layerParamsPending.has(name)) return layerParamsPending.get(name)

  const task = (async () => {
    try {
      const { data } = await getRockParams(name)
      layerParamsCache.set(name, data)
      return data
    } catch {
      layerParamsCache.set(name, null)
      return null
    } finally {
      layerParamsPending.delete(name)
    }
  })()

  layerParamsPending.set(name, task)
  return task
}

const buildMpiPoints = async (boreholes = [], seamName = '') => {
  const uniqueLayerNames = new Set()
  for (const borehole of boreholes) {
    const layers = borehole.layers || []
    for (const layer of layers) {
      if (!layer?.name || layer.name === seamName) continue
      uniqueLayerNames.add(layer.name)
    }
  }
  await Promise.all([...uniqueLayerNames].map((name) => getLayerParams(name)))

  const points = []
  for (const borehole of boreholes) {
    const layers = borehole.layers || []
    const seamLayer = layers.find((l) => l.name === seamName)
    const strataLayers = layers.filter((l) => l.name !== seamName)

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

const buildMpiReport = async (seamName) => {
  if (!seamName) return null
  try {
    const { data: overburden } = await getSeamOverburden(seamName)
    const boreholes = overburden?.boreholes || []
    if (!boreholes.length) return null

    const points = await buildMpiPoints(boreholes, seamName)
    const { data: batch } = await mpiBatch(points)

    const results = batch?.results || []
    if (!results.length) return null

    const breakdown = results.reduce(
      (acc, cur) => {
        acc.rsi += cur.breakdown?.rsi || 0
        acc.bri += cur.breakdown?.bri || 0
        acc.asi += cur.breakdown?.asi || 0
        return acc
      },
      { rsi: 0, bri: 0, asi: 0 }
    )

    const count = results.length
    const sorted = [...results].sort((a, b) => a.mpi - b.mpi)

    return {
      seamName,
      stats: batch?.summary || {},
      breakdown: {
        rsi: breakdown.rsi / count,
        bri: breakdown.bri / count,
        asi: breakdown.asi / count
      },
      high: sorted.slice(-3).reverse(),
      low: sorted.slice(0, 3)
    }
  } catch {
    return null
  }
}

const generateReport = async (notify = false) => {
  loading.value = true
  reportError.value = ''
  try {
    const method = 'idw'
    const gridSize = 60
    const faceAxis = 'x'
    const faceCount = 3
    const faceDirection = 'ascending'
    const faceMode = 'decrease'
    const faceDecay = 0.08
    const stepModel = 'fixed'
    const stepTarget = 'initial'

    const wElastic = 0.4
    const wDensity = 0.3
    const wTensile = 0.3

    const [reportResp, mpi] = await Promise.all([
      summaryReport({
        method,
        grid_size: gridSize,
        axis: faceAxis,
        count: faceCount,
        direction: faceDirection,
        mode: faceMode,
        decay: faceDecay,
        step_model: stepModel,
        step_target: stepTarget,
        workface_elastic_modulus: wElastic,
        workface_density: wDensity,
        workface_tensile_strength: wTensile
      }),
      buildMpiReport(selectedSeam.value)
    ])

    const reportSummary = reportResp?.data?.summary
    week3Research.value = reportResp?.data?.research || null
    reportPerformance.value = reportResp?.data?.performance || null
    reportCacheHit.value = Boolean(reportResp?.data?.cache?.hit)
    if (reportSummary?.index && reportSummary?.index_workfaces && reportSummary?.steps && reportSummary?.steps_workfaces) {
      summary.value = [
        { nameKey: 'index', stats: reportSummary.index },
        { nameKey: 'indexWorkfaces', stats: reportSummary.index_workfaces },
        { nameKey: 'steps', stats: reportSummary.steps },
        { nameKey: 'stepsWorkfaces', stats: reportSummary.steps_workfaces }
      ]
    } else {
      week3Research.value = null
      reportPerformance.value = null
      reportCacheHit.value = false
      // Fallback for older backend versions.
      const [a, b, c, d] = await Promise.all([
        summaryIndex(method, gridSize),
        summaryIndexWorkfaces({
          method,
          grid_size: gridSize,
          axis: faceAxis,
          count: faceCount,
          direction: faceDirection,
          mode: faceMode,
          decay: faceDecay,
          elastic_modulus: wElastic,
          density: wDensity,
          tensile_strength: wTensile
        }),
        summarySteps(stepModel, stepTarget, gridSize),
        summaryStepsWorkfaces({
          model: stepModel,
          target: stepTarget,
          grid_size: gridSize,
          axis: faceAxis,
          count: faceCount,
          direction: faceDirection,
          mode: faceMode,
          decay: faceDecay
        })
      ])
      summary.value = [
        { nameKey: 'index', stats: a.data.grid },
        { nameKey: 'indexWorkfaces', stats: b.data.grid },
        { nameKey: 'steps', stats: c.data.grid },
        { nameKey: 'stepsWorkfaces', stats: d.data.grid }
      ]
    }

    mpiSummary.value = mpi
    generatedAt.value = new Date().toLocaleString()
    markStepDone('Report', { reportGeneratedAt: new Date().toISOString() })

    if (notify) toast.add(rp('reportRefreshed'), 'success')
  } catch (error) {
    reportError.value = error?.response?.data?.detail || rp('errorGenerateReport')
    if (notify) toast.add(reportError.value, 'error')
  } finally {
    loading.value = false
  }
}

const goValidation = () => {
  router.push({
    name: 'AlgorithmValidation',
    query: selectedSeam.value ? { seam: selectedSeam.value } : undefined
  })
}

const exportReport = () => {
  if (!summary.value.length) return

  const keyMetric = rp('csv.metric')
  const keyMin = rp('csv.min')
  const keyMax = rp('csv.max')
  const keyMean = rp('csv.mean')
  const keyStd = rp('csv.std')
  const keyP10 = rp('csv.p10')
  const keyP50 = rp('csv.p50')
  const keyP90 = rp('csv.p90')

  const rows = summary.value.map((row) => ({
    [keyMetric]: summaryDisplayName(row),
    [keyMin]: formatNumber(row.stats.min, 3),
    [keyMax]: formatNumber(row.stats.max, 3),
    [keyMean]: formatNumber(row.stats.mean, 3),
    [keyStd]: formatNumber(row.stats.std, 3),
    [keyP10]: formatNumber(row.stats.p10, 3),
    [keyP50]: formatNumber(row.stats.p50, 3),
    [keyP90]: formatNumber(row.stats.p90, 3)
  }))

  if (mpiSummary.value) {
    rows.push({
      [keyMetric]: rp('csv.mpiComposite', { seam: mpiSummary.value.seamName }),
      [keyMin]: formatNumber(mpiSummary.value.stats.min, 3),
      [keyMax]: formatNumber(mpiSummary.value.stats.max, 3),
      [keyMean]: formatNumber(mpiSummary.value.stats.mean, 3),
      [keyStd]: formatNumber(mpiSummary.value.stats.std, 3),
      [keyP10]: '',
      [keyP50]: '',
      [keyP90]: ''
    })
  }

  const header = Object.keys(rows[0])
  const csv = [header.join(','), ...rows.map((row) => header.map((k) => row[k]).join(','))].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pressure_report_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)

  toast.add(rp('reportExportSuccess'), 'success')
}

const autoRefreshAfterSeamChange = (() => {
  let timer = null
  return () => {
    if (!initialized.value) return
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      if (selectedSeam.value) {
        setSelectedSeam(selectedSeam.value)
        generateReport(false)
      }
    }, 500)
  }
})()

watch(selectedSeam, () => {
  autoRefreshAfterSeamChange()
})

watch(
  () => route.query?.seam,
  (value) => {
    const seam = normalizeQuerySeam(value)
    if (seam && seam !== selectedSeam.value) selectedSeam.value = seam
  }
)

watch(
  () => route.query?.geomodel_job_id,
  (value) => {
    const jobId = normalizeQueryJobId(value)
    if (jobId && jobId !== geomodelJobId.value) geomodelJobId.value = jobId
  }
)

onMounted(async () => {
  await loadSeams()
  initialized.value = true
  await generateReport(false)
  if (geomodelJobId.value) {
    await loadGeomodelQuality(false)
  }
})
</script>

<style scoped>
.report-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.card {
  background: var(--gradient-card);
  border: 1px solid rgba(14, 116, 144, 0.16);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-normal), border-color var(--transition-normal), transform var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
  border-color: rgba(14, 116, 144, 0.24);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.controls {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-md);
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.control-item select {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: 9px 10px;
  font-size: 13px;
  color: var(--text-primary);
  background: var(--bg-primary);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
}

.geomodel-input-row {
  display: flex;
  gap: 8px;
}

.geomodel-input-row input {
  flex: 1;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: 9px 10px;
  font-size: 12px;
  color: var(--text-primary);
  background: var(--bg-primary);
}

.geomodel-input-row input:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.2);
}

.control-item select:hover {
  border-color: rgba(14, 116, 144, 0.42);
}

.control-item select:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.2);
}

.status-chip {
  display: inline-flex;
  width: fit-content;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
}

.status-chip.loading {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.status-chip.ready {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-chip.idle {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 14px;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: var(--gradient-primary);
  color: #fff;
  box-shadow: var(--shadow-sm);
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn.small {
  padding: 8px 10px;
  font-size: 12px;
}

.btn.secondary:hover:not(:disabled) {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-color: rgba(14, 116, 144, 0.34);
}

.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.22);
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

.error {
  margin: 0;
  color: var(--color-error);
  font-size: 13px;
}

h2 {
  margin: 0 0 12px;
  font-size: 16px;
  color: var(--text-primary);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.metric-card {
  border: 1px solid var(--border-color-light);
  border-radius: 12px;
  padding: 12px;
  background: linear-gradient(145deg, #ffffff 0%, #f7fbfa 100%);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.metric-card:hover {
  transform: translateY(-2px);
  border-color: rgba(14, 116, 144, 0.3);
  box-shadow: var(--shadow-sm);
}

.metric-card h3 {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.metric-main {
  margin-top: 8px;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.metric-sub {
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-secondary);
}

.mpi-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 14px;
}

.mpi-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.stat-item {
  border: 1px solid var(--border-color-light);
  border-radius: 10px;
  padding: 10px;
  background: var(--bg-primary);
}

.stat-item span {
  display: block;
  font-size: 11px;
  color: var(--text-secondary);
}

.stat-item strong {
  display: block;
  margin-top: 4px;
  font-size: 15px;
  color: var(--text-primary);
}

.mpi-extremes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.mpi-extremes article {
  border: 1px solid var(--border-color-light);
  border-radius: 10px;
  padding: 10px;
  background: var(--bg-elevated);
}

.mpi-extremes h3 {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--text-primary);
}

.mpi-extremes ul {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
  color: var(--text-secondary);
}

.geomodel-quality-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.week3-layout {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.week3-split-card {
  background: linear-gradient(145deg, #ffffff 0%, #f2fbf6 100%);
}

.week3-perf-card {
  background: linear-gradient(145deg, #ffffff 0%, #f3f8ff 100%);
}

.week3-suite-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ok-text {
  color: var(--color-success);
}

.warn-text {
  color: var(--color-warning);
}

.mini-table-wrap {
  margin-top: 6px;
  border: 1px solid var(--border-color-light);
  border-radius: 8px;
  overflow: hidden;
}

.mini-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.mini-table th,
.mini-table td {
  padding: 6px 8px;
  border-bottom: 1px solid var(--border-color-light);
}

.mini-table th {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  text-align: left;
}

.week3-compare {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.week3-compare h3 {
  margin: 0;
  font-size: 13px;
  color: var(--text-primary);
}

.compare-table-wrap {
  border: 1px solid var(--border-color-light);
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-primary);
}

.compare-caption {
  padding: 8px 10px;
  font-size: 12px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color-light);
  background: var(--bg-secondary);
}

.warning-card .warning-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.empty-block {
  min-height: 140px;
  display: grid;
  place-items: center;
  border: 1px dashed var(--border-color);
  border-radius: 12px;
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--bg-elevated);
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-color-light);
  text-align: left;
}

thead th {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-weight: 700;
}

tbody tr:hover {
  background: rgba(15, 118, 110, 0.06);
}

@media (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .controls {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mpi-layout {
    grid-template-columns: 1fr;
  }

  .mpi-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .geomodel-quality-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .week3-layout {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .hero-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .controls,
  .cards-grid,
  .mpi-stats,
  .mpi-extremes,
  .geomodel-quality-grid,
  .week3-layout {
    grid-template-columns: 1fr;
  }
}
</style>
