<template>
  <div class="steps-page">
    <PageHeader
      class="main-header"
      :title="sp('title')"
      :description="sp('subtitle')"
    >
      <template #actions>
        <div class="hero-actions">
          <button class="btn primary" :disabled="refreshing" @click="refreshAll(true)">
            <span v-if="refreshing" class="spinner"></span>
            {{ refreshing ? sp('refreshing') : sp('refreshAll') }}
          </button>
          <button class="btn secondary" :disabled="!stepGrid" @click="handleExportGrid">{{ sp('exportStepGrid') }}</button>
          <button class="btn secondary" :disabled="!stepBatch" @click="handleExportBatch">{{ sp('exportBatch') }}</button>
        </div>
      </template>
    </PageHeader>

    <section class="card params-card">
      <h2>{{ sp('params') }}</h2>
      <div class="params-grid">
        <label>
          {{ sp('mechanicalModel') }}
          <select v-model="stepModel">
            <option value="fixed">{{ sp('model.fixed') }}</option>
            <option value="simply">{{ sp('model.simply') }}</option>
            <option value="shear">{{ sp('model.shear') }}</option>
            <option value="empirical">{{ sp('model.empirical') }}</option>
          </select>
        </label>

        <label>
          {{ sp('target') }}
          <select v-model="stepTarget">
            <option value="initial">{{ sp('targetOption.initial') }}</option>
            <option value="periodic">{{ sp('targetOption.periodic') }}</option>
          </select>
        </label>

        <label>
          {{ sp('roofThickness') }} h (m)
          <input v-model.number="stepH" type="number" step="0.1" min="0.1">
        </label>

        <label>
          {{ sp('load') }} q (MPa)
          <input v-model.number="stepQ" type="number" step="0.1" min="0.1">
        </label>

        <label>
          {{ sp('tensile') }} t (MPa)
          <input v-model.number="stepT" type="number" step="0.1" min="0.1">
        </label>

        <label>
          {{ sp('shear') }} s (MPa)
          <input v-model.number="stepS" type="number" step="0.1" min="0.1">
        </label>

        <label>
          {{ sp('hMode') }}
          <select v-model="hMode">
            <option value="total">{{ sp('hModeTotal') }}</option>
          </select>
        </label>

        <label>
          {{ sp('qMode') }}
          <select v-model="qMode">
            <option value="density_thickness">{{ sp('qModeDensityThickness') }}</option>
            <option value="default">{{ sp('qModeDefault') }}</option>
          </select>
        </label>

        <label v-if="qMode === 'default'">
          {{ sp('defaultQ') }}
          <input v-model.number="defaultQ" type="number" step="0.1" min="0.1">
        </label>

        <label>
          {{ sp('gridSize') }}
          <input v-model.number="gridSize" type="number" min="20" max="120" step="1">
        </label>

        <label>
          {{ sp('mpiSeam') }}
          <select v-model="mpiSeam" :disabled="mpiSeams.length === 0">
            <option v-for="seam in mpiSeams" :key="seam.name" :value="seam.name">{{ seam.name }}</option>
          </select>
        </label>

        <label>
          {{ sp('mpiGrid') }}
          <input v-model.number="mpiGridSize" type="number" min="20" max="150" step="1">
        </label>

        <label>
          {{ sp('mpiInterpolation') }}
          <select v-model="mpiMethod">
            <option value="idw">{{ sp('mpiMethod.idw') }}</option>
            <option value="linear">{{ sp('mpiMethod.linear') }}</option>
            <option value="nearest">{{ sp('mpiMethod.nearest') }}</option>
          </select>
        </label>

        <label class="geo-toggle">
          {{ sp('geoAware') }}
          <span class="geo-toggle-line">
            <input v-model="geoAwareEnabled" type="checkbox">
            <span>{{ geoAwareEnabled ? sp('enabled') : sp('disabled') }}</span>
          </span>
        </label>

        <label v-if="geoAwareEnabled">
          {{ sp('geomodelJobIdOptional') }}
          <input v-model.trim="geoModelJobId" type="text" :placeholder="sp('geomodelJobPlaceholder')">
        </label>
      </div>
    </section>

    <section class="card kpi-card">
      <h2>{{ sp('kpiTitle') }}</h2>
      <div class="kpi-grid">
        <article class="kpi-item">
          <span>{{ sp('initialStep') }}</span>
          <strong>{{ formatNumber(stepResult?.initial_step, 2, 'm') }}</strong>
          <small v-if="loadingStepResult">{{ sp('autoComputing') }}</small>
        </article>
        <article class="kpi-item">
          <span>{{ sp('periodicStep') }}</span>
          <strong>{{ formatNumber(stepResult?.periodic_step, 2, 'm') }}</strong>
          <small v-if="loadingStepResult">{{ sp('autoComputing') }}</small>
        </article>
        <article class="kpi-item">
          <span>{{ sp('mpiMean') }}</span>
          <strong>{{ formatNumber(mpiStats?.mean, 2) }}</strong>
          <small v-if="loadingMpi">{{ sp('autoComputing') }}</small>
        </article>
        <article class="kpi-item">
          <span>{{ sp('batchCount') }}</span>
          <strong>{{ stepBatch?.items?.length || 0 }}</strong>
          <small v-if="loadingStepBatch">{{ sp('autoComputing') }}</small>
        </article>
      </div>
      <p class="hint" v-if="stepResultError || stepGridError || stepBatchError || mpiError">
        {{ stepResultError || stepGridError || stepBatchError || mpiError }}
      </p>
    </section>

    <section class="two-col">
      <article class="card panel">
        <div class="panel-head">
          <h3>{{ sp('stepGridTitle') }}</h3>
          <span class="tag">{{ stepModelLabel(stepModel) }} / {{ stepTargetLabel(stepTarget) }}</span>
        </div>
        <div class="panel-body">
          <div v-if="loadingStepGrid" class="loading-block">{{ sp('loadingStepGrid') }}</div>
          <HeatmapCanvas v-else-if="stepGrid?.values?.length" :grid="stepGrid.values" :size="480" />
          <div v-else class="empty-block">{{ sp('noStepGrid') }}</div>
        </div>
      </article>

      <article class="card panel">
        <div class="panel-head">
          <h3>{{ sp('mpiPanelTitle') }}</h3>
          <span class="tag">{{ mpiSeam || sp('unselectedSeam') }}</span>
        </div>
        <div class="panel-body">
          <div v-if="loadingMpi" class="loading-block">{{ sp('loadingMpi') }}</div>
          <HeatmapCanvas v-else-if="mpiGrid?.length" :grid="mpiGrid" :size="420" />
          <div v-else class="empty-block">{{ sp('noMpi') }}</div>

          <div class="stats-row">
            <div class="stat-item"><span>{{ sp('min') }}</span><strong>{{ formatNumber(mpiStats?.min, 2) }}</strong></div>
            <div class="stat-item"><span>{{ sp('max') }}</span><strong>{{ formatNumber(mpiStats?.max, 2) }}</strong></div>
            <div class="stat-item"><span>{{ sp('mean') }}</span><strong>{{ formatNumber(mpiStats?.mean, 2) }}</strong></div>
          </div>

          <div class="suggestion">
            <h4>{{ sp('stepSuggestionTitle') }}</h4>
            <p>{{ mpiSuggestion }}</p>
          </div>

          <div v-if="geoCompareSummary" class="geo-summary">
            <h4>{{ sp('geoCompareTitle') }}</h4>
            <div class="stats-row geo-summary-row">
              <div class="stat-item">
                <span>{{ sp('baselineMean') }}</span>
                <strong>{{ formatNumber(geoCompareSummary.baselineMean, 2) }}</strong>
              </div>
              <div class="stat-item">
                <span>{{ sp('geoAwareMean') }}</span>
                <strong>{{ formatNumber(geoCompareSummary.geoMean, 2) }}</strong>
              </div>
              <div class="stat-item">
                <span>{{ sp('deltaMean') }}</span>
                <strong>{{ formatNumber(geoCompareSummary.delta, 2) }}</strong>
              </div>
            </div>
            <p class="geo-meta">
              {{ sp('mode') }}{{ geoCompareSummary.algorithmMode }} · {{ sp('fallback') }}{{ geoCompareSummary.fallbackUsed ? t('common.yes') : t('common.no') }}
            </p>
            <p v-if="geoFeatureSummary" class="geo-feature">{{ geoFeatureSummary }}</p>
          </div>

          <div class="zone-card" v-if="zoneRiskSummary.length">
            <h4>{{ sp('zoneRiskTitle') }}</h4>
            <div class="zone-grid">
              <div v-for="zone in zoneRiskSummary" :key="zone.key" class="zone-item" :class="zone.key">
                <span>{{ zone.label }}</span>
                <strong>{{ sp('zoneCount', { count: zone.count, ratio: zone.ratio }) }}</strong>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section class="card panel">
      <div class="panel-head">
        <h3>{{ sp('batchResultTitle') }}</h3>
        <span class="tag">{{ sp('batchPreviewLimit') }}</span>
      </div>
      <div class="panel-body">
        <div v-if="loadingStepBatch" class="loading-block">{{ sp('loadingBatch') }}</div>
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
        <div v-else class="empty-block">{{ sp('noBatch') }}</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useToast } from '../composables/useToast'
import { useI18n } from '../composables/useI18n'
import HeatmapCanvas from '../components/HeatmapCanvas.vue'
import { PageHeader } from '../components/library'
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

const layerParamsCache = new Map()

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
    if (!mpiSeam.value && mpiSeams.value.length) mpiSeam.value = mpiSeams.value[0].name
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

onMounted(async () => {
  await loadMpiSeams()
  initialized.value = true
  await refreshAll(false)
})
</script>

<style scoped>
.steps-page {
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
  background: rgba(14, 116, 144, 0.14);
  color: #0e7490;
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
  color: #64748b;
  background: #f4f9f8;
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
</style>
