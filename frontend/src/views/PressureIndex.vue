<template>
  <div class="page">
    <PageHeader
      class="main-header"
      :title="pi('pageTitle')"
      :description="pi('pageSubtitle')"
    />

    <!-- 閫夐」鍗″垏鎹?-->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- 浼犵粺鐭垮帇鎸囨爣閫夐」鍗?-->
    <div v-show="activeTab === 'traditional'" class="tab-content">
    <div class="grid grid-2">
      <!-- 鍙傛暟璁剧疆 -->
      <div class="card">
        <h3 class="section-title">{{ pi('traditional.weightsTitle') }}</h3>
        <p class="section-desc">{{ pi('traditional.weightsDesc') }}</p>

        <div class="weight-inputs">
          <div class="weight-item">
            <label class="weight-label">{{ pi('traditional.elasticModulus') }}</label>
            <input v-model.number="wElastic" type="number" step="0.1" min="0" class="weight-input">
            <span class="weight-percent">{{ (wElastic / totalWeight * 100).toFixed(0) }}%</span>
          </div>
          <div class="weight-item">
            <label class="weight-label">{{ pi('traditional.density') }}</label>
            <input v-model.number="wDensity" type="number" step="0.1" min="0" class="weight-input">
            <span class="weight-percent">{{ (wDensity / totalWeight * 100).toFixed(0) }}%</span>
          </div>
          <div class="weight-item">
            <label class="weight-label">{{ pi('traditional.tensileStrength') }}</label>
            <input v-model.number="wTensile" type="number" step="0.1" min="0" class="weight-input">
            <span class="weight-percent">{{ (wTensile / totalWeight * 100).toFixed(0) }}%</span>
          </div>
        </div>

        <div class="param-group">
          <label class="param-label">{{ pi('traditional.interpolationMethod') }}</label>
          <select v-model="method" class="param-select">
            <option value="kriging">{{ pi('interpolation.kriging') }}</option>
            <option value="idw">{{ pi('interpolation.idw') }}</option>
            <option value="linear">{{ pi('interpolation.linear') }}</option>
            <option value="nearest">{{ pi('interpolation.nearest') }}</option>
          </select>
        </div>

        <div class="param-group">
          <label class="param-label">{{ pi('traditional.gridSize') }}</label>
          <input v-model.number="gridSize" type="number" min="20" max="120" class="param-input">
        </div>

        <div class="action-buttons">
          <button class="btn primary" @click="handleIndexGrid" :disabled="loading">
            <span v-if="loading" class="spinner sm"></span>
            {{ loading ? pi('calculating') : pi('traditional.calcIndexGrid') }}
          </button>
          <button v-if="indexGrid" class="btn secondary" @click="handleExport" :disabled="loading">
            {{ pi('traditional.exportIndex') }}
          </button>
          <button v-if="indexGrid" class="btn secondary" @click="goValidation" :disabled="loading">
            {{ pi('traditional.nextValidation') }}
          </button>
        </div>
      </div>

      <!-- 鎸囨爣缁撴灉 -->
      <div class="card">
        <h3 class="section-title">{{ pi('traditional.indexDistribution') }}</h3>

        <div v-if="indexGrid" class="result-content">
          <HeatmapCanvas :grid="indexGrid.values" :size="420" />
          <div class="legend">
            <div class="legend-label">{{ pi('traditional.pressureIndexLabel') }}</div>
            <div class="legend-bar">
              <span class="legend-low">{{ pi('traditional.lowPressure') }}</span>
              <span class="legend-high">{{ pi('traditional.highPressure') }}</span>
            </div>
          </div>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-label">{{ pi('common.min') }}</span>
              <span class="stat-value">{{ indexGrid.min?.toFixed(3) || '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">{{ pi('common.max') }}</span>
              <span class="stat-value">{{ indexGrid.max?.toFixed(3) || '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">{{ pi('common.mean') }}</span>
              <span class="stat-value">{{ indexGrid.mean?.toFixed(3) || '-' }}</span>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">馃搱</div>
          <p>{{ pi('traditional.emptyState') }}</p>
        </div>
      </div>
    </div>

    <!-- 宸ヤ綔闈㈣皟鏁?-->
    <div class="card">
      <h3 class="section-title">{{ pi('workface.title') }}</h3>
      <p class="section-desc">{{ pi('workface.description') }}</p>

      <div class="grid grid-5">
        <div class="param-group">
          <label class="param-label">{{ pi('workface.count') }}</label>
          <input v-model.number="faceCount" type="number" min="1" class="param-input">
        </div>
        <div class="param-group">
          <label class="param-label">{{ pi('workface.axis') }}</label>
          <select v-model="faceAxis" class="param-select">
            <option value="x">{{ pi('workface.axisX') }}</option>
            <option value="y">{{ pi('workface.axisY') }}</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">{{ pi('workface.direction') }}</label>
          <select v-model="faceDirection" class="param-select">
            <option value="ascending">{{ pi('workface.directionAscending') }}</option>
            <option value="descending">{{ pi('workface.directionDescending') }}</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">{{ pi('workface.mode') }}</label>
          <select v-model="faceMode" class="param-select">
            <option value="decrease">{{ pi('workface.modeDecrease') }}</option>
            <option value="increase">{{ pi('workface.modeIncrease') }}</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">{{ pi('workface.decay') }}</label>
          <input v-model.number="faceDecay" type="number" step="0.01" class="param-input">
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn primary" @click="handleWorkfaces" :disabled="loading">
          {{ pi('workface.calcAdjusted') }}
        </button>
        <button v-if="workfaceGrid" class="btn secondary" @click="handleExportWorkfaces" :disabled="loading">
          {{ pi('workface.exportAdjusted') }}
        </button>
      </div>

      <div v-if="workfaceGrid" class="result-section">
        <HeatmapCanvas :grid="workfaceGrid" :size="500" />
      </div>
    </div>
    </div>

    <!-- MPI鎸囨爣閫夐」鍗?-->
    <div v-show="activeTab === 'mpi'" class="tab-content">
      <div class="grid grid-2">
        <!-- MPI鏉冮噸璁剧疆 -->
        <div class="card">
          <h3 class="section-title">{{ pi('mpi.weightsTitle') }}</h3>
          <p class="section-desc">{{ pi('mpi.weightsDesc') }}</p>

          <div class="weight-inputs">
            <div class="weight-item">
              <label class="weight-label">{{ pi('mpi.roofStability') }}</label>
              <input v-model.number="mpiWeights.roof_stability" type="number" step="0.05" min="0" max="1" class="weight-input">
              <span class="weight-percent">{{ (mpiWeights.roof_stability * 100).toFixed(0) }}%</span>
            </div>
            <div class="weight-item">
              <label class="weight-label">{{ pi('mpi.burstRisk') }}</label>
              <input v-model.number="mpiWeights.burst_risk" type="number" step="0.05" min="0" max="1" class="weight-input">
              <span class="weight-percent">{{ (mpiWeights.burst_risk * 100).toFixed(0) }}%</span>
            </div>
            <div class="weight-item">
              <label class="weight-label">{{ pi('mpi.abutmentStress') }}</label>
              <input v-model.number="mpiWeights.abutment_stress" type="number" step="0.05" min="0" max="1" class="weight-input">
              <span class="weight-percent">{{ (mpiWeights.abutment_stress * 100).toFixed(0) }}%</span>
            </div>
          </div>

          <div class="weight-total" :class="{ invalid: !isWeightValid }">
            <span>{{ pi('mpi.weightTotal', { total: mpiWeightTotal }) }}</span>
            <span v-if="!isWeightValid" class="weight-warning">{{ pi('mpi.weightWarning') }}</span>
          </div>

          <div class="param-group">
            <label class="param-label">{{ pi('mpi.interpolationMethod') }}</label>
            <select v-model="mpiMethod" class="param-select">
              <option value="kriging">{{ pi('interpolation.kriging') }}</option>
              <option value="idw">{{ pi('interpolation.idw') }}</option>
              <option value="linear">{{ pi('interpolation.linear') }}</option>
              <option value="nearest">{{ pi('interpolation.nearest') }}</option>
            </select>
          </div>

          <div class="param-group">
            <label class="param-label">{{ pi('mpi.gridResolution') }}</label>
            <input v-model.number="mpiGridSize" type="number" min="20" max="150" class="param-input">
          </div>

          <div class="action-buttons">
            <button class="btn primary" @click="handleMpiCalculate" :disabled="loading || !isWeightValid">
              <span v-if="loading" class="spinner sm"></span>
              {{ loading ? pi('calculating') : pi('mpi.calcGrid') }}
            </button>
            <button v-if="mpiGrid" class="btn secondary" @click="handleMpiExport" :disabled="loading">
              {{ pi('mpi.exportData') }}
            </button>
          </div>
        </div>

        <!-- MPI缃戞牸缁撴灉 -->
        <div class="card">
          <h3 class="section-title">{{ pi('mpi.compositeDistribution') }}</h3>

          <div v-if="mpiGrid" class="result-content">
            <div class="mpi-legend-tabs">
              <button
                v-for="mode in mpiDisplayModes"
                :key="mode.key"
                :class="['mpi-legend-tab', { active: mpiDisplayMode === mode.key }]"
                @click="mpiDisplayMode = mode.key"
              >
                {{ mode.label }}
              </button>
            </div>

            <HeatmapCanvas :grid="currentMpiGrid" :size="420" />

            <div class="legend">
              <div class="legend-label">{{ pi('mpi.valueLabel', { mode: mpiDisplayModeLabel }) }}</div>
              <div class="legend-bar mpi-gradient">
                <span class="legend-low">{{ pi('mpi.highRiskLowMpi') }}</span>
                <span class="legend-high">{{ pi('mpi.lowRiskHighMpi') }}</span>
              </div>
            </div>

            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-label">{{ pi('common.min') }}</span>
                <span class="stat-value">{{ mpiStats.min?.toFixed(2) || '-' }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ pi('common.max') }}</span>
                <span class="stat-value">{{ mpiStats.max?.toFixed(2) || '-' }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ pi('common.mean') }}</span>
                <span class="stat-value">{{ mpiStats.mean?.toFixed(2) || '-' }}</span>
              </div>
            </div>

            <div v-if="mpiPointCount > 0" class="mpi-info">
              <span class="mpi-info-item">{{ pi('mpi.dataPoints', { count: mpiPointCount }) }}</span>
              <span class="mpi-info-item">{{ pi('mpi.interpolationUsed', { method: formatInterpolationMethod(mpiMethod) }) }}</span>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">馃搳</div>
            <p>{{ pi('mpi.emptyState') }}</p>
            <p class="empty-hint">{{ pi('mpi.emptyHint') }}</p>
          </div>
        </div>
      </div>

      <!-- 鍒嗛」鎸囨爣璇存槑 -->
      <div class="card">
        <h3 class="section-title">{{ pi('definitions.title') }}</h3>
        <div class="mpi-definitions">
          <div class="mpi-def-item">
            <div class="mpi-def-header">
              <span class="mpi-def-icon">馃彔</span>
              <span class="mpi-def-title">{{ pi('definitions.rsi.title') }}</span>
            </div>
            <p class="mpi-def-desc">{{ pi('definitions.rsi.desc') }}</p>
            <div class="mpi-def-breakdown">
              <span>{{ pi('definitions.rsi.part1') }}</span>
              <span>{{ pi('definitions.rsi.part2') }}</span>
              <span>{{ pi('definitions.rsi.part3') }}</span>
            </div>
          </div>
          <div class="mpi-def-item">
            <div class="mpi-def-header">
              <span class="mpi-def-icon">馃挜</span>
              <span class="mpi-def-title">{{ pi('definitions.bri.title') }}</span>
            </div>
            <p class="mpi-def-desc">{{ pi('definitions.bri.desc') }}</p>
            <div class="mpi-def-breakdown">
              <span>{{ pi('definitions.bri.part1') }}</span>
              <span>{{ pi('definitions.bri.part2') }}</span>
              <span>{{ pi('definitions.bri.part3') }}</span>
            </div>
          </div>
          <div class="mpi-def-item">
            <div class="mpi-def-header">
              <span class="mpi-def-icon">鈿栵笍</span>
              <span class="mpi-def-title">{{ pi('definitions.asi.title') }}</span>
            </div>
            <p class="mpi-def-desc">{{ pi('definitions.asi.desc') }}</p>
            <div class="mpi-def-breakdown">
              <span>{{ pi('definitions.asi.part1') }}</span>
              <span>{{ pi('definitions.asi.part2') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 椋庨櫓绛夌骇璇存槑 -->
      <div class="card">
        <h3 class="section-title">{{ pi('riskLevels.title') }}</h3>
        <div class="risk-levels">
          <div class="risk-level low">
            <div class="risk-header">
              <span class="risk-badge low">{{ pi('riskLevels.low.label') }}</span>
              <span class="risk-range">{{ pi('riskLevels.low.range') }}</span>
            </div>
            <p class="risk-desc">{{ pi('riskLevels.low.desc') }}</p>
          </div>
          <div class="risk-level medium">
            <div class="risk-header">
              <span class="risk-badge medium">{{ pi('riskLevels.medium.label') }}</span>
              <span class="risk-range">{{ pi('riskLevels.medium.range') }}</span>
            </div>
            <p class="risk-desc">{{ pi('riskLevels.medium.desc') }}</p>
          </div>
          <div class="risk-level high">
            <div class="risk-header">
              <span class="risk-badge high">{{ pi('riskLevels.high.label') }}</span>
              <span class="risk-range">{{ pi('riskLevels.high.range') }}</span>
            </div>
            <p class="risk-desc">{{ pi('riskLevels.high.desc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '../composables/useI18n'
import { useToast } from '../composables/useToast'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import HeatmapCanvas from '../components/HeatmapCanvas.vue'
import { PageHeader } from '../components/library'
import {
  pressureIndexGrid,
  pressureIndexWorkfaces,
  exportIndex,
  exportPressureIndexWorkfaces,
  validationSpatialOverview,
  getMpiWeights,
  setMpiWeights
} from '../api'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { workspaceState, setSelectedSeam, markStepDone } = useWorkspaceFlow()
const pi = (key, params) => t(`pressureIndex.${key}`, params)

// 閫夐」鍗?const tabs = computed(() => ([
  { key: 'traditional', label: pi('tabs.traditional'), icon: '馃搱' },
  { key: 'mpi', label: pi('tabs.mpi'), icon: '馃搳' }
]))
const activeTab = ref('traditional')

// 浼犵粺鎸囨爣
const method = ref('kriging')
const gridSize = ref(60)
const wElastic = ref(0.4)
const wDensity = ref(0.3)
const wTensile = ref(0.3)
const loading = ref(false)
const indexGrid = ref(null)
const workfaceGrid = ref(null)

const faceCount = ref(3)
const faceAxis = ref('x')
const faceDirection = ref('ascending')
const faceMode = ref('decrease')
const faceDecay = ref(0.08)

// MPI鐩稿叧
const mpiWeights = ref({
  roof_stability: 0.4,
  burst_risk: 0.35,
  abutment_stress: 0.25
})
const mpiMethod = ref('kriging')
const mpiGridSize = ref(60)
const mpiGrid = ref(null)
const mpiBreakdown = ref({ rsi: null, bri: null, asi: null })
const mpiPointCount = ref(0)
const mpiDisplayMode = ref('mpi') // mpi, rsi, bri, asi
const mpiDisplayModes = computed(() => ([
  { key: 'mpi', label: pi('mpi.displayMode.mpi') },
  { key: 'rsi', label: pi('mpi.displayMode.rsi') },
  { key: 'bri', label: pi('mpi.displayMode.bri') },
  { key: 'asi', label: pi('mpi.displayMode.asi') }
]))

const totalWeight = computed(() => {
  return (wElastic.value || 0) + (wDensity.value || 0) + (wTensile.value || 0) || 1
})

const normalizedWeights = computed(() => {
  const sum = totalWeight.value
  return {
    elastic: (wElastic.value || 0) / sum,
    density: (wDensity.value || 0) / sum,
    tensile: (wTensile.value || 0) / sum
  }
})

// MPI鐩稿叧璁＄畻灞炴€?
const mpiWeightTotal = computed(() => {
  const total = mpiWeights.value.roof_stability + mpiWeights.value.burst_risk + mpiWeights.value.abutment_stress
  return total.toFixed(2)
})

const isWeightValid = computed(() => {
  const total = mpiWeights.value.roof_stability + mpiWeights.value.burst_risk + mpiWeights.value.abutment_stress
  const entries = [mpiWeights.value.roof_stability, mpiWeights.value.burst_risk, mpiWeights.value.abutment_stress]
  const validEntries = entries.every((value) => Number.isFinite(value) && value >= 0 && value <= 1)
  return validEntries && Math.abs(total - 1.0) < 0.01
})

const mpiStats = computed(() => {
  if (!mpiGrid.value) return {}
  const grid = currentMpiGrid.value
  const flat = grid.flat()
  const valid = flat.filter(v => v != null && !isNaN(v))
  if (valid.length === 0) return {}
  return {
    min: Math.min(...valid),
    max: Math.max(...valid),
    mean: valid.reduce((a, b) => a + b, 0) / valid.length
  }
})

const currentMpiGrid = computed(() => {
  if (!mpiGrid.value) return []
  if (mpiDisplayMode.value === 'mpi') return mpiGrid.value
  return mpiBreakdown.value[mpiDisplayMode.value] || mpiGrid.value
})

const mpiDisplayModeLabel = computed(() => {
  const mode = mpiDisplayModes.value.find(m => m.key === mpiDisplayMode.value)
  return mode ? mode.label : pi('mpi.displayMode.mpi')
})

const formatInterpolationMethod = (methodName) => {
  const key = String(methodName || '').toLowerCase()
  if (key === 'kriging') return pi('interpolation.kriging')
  if (key === 'idw') return pi('interpolation.idw')
  if (key === 'linear') return pi('interpolation.linear')
  if (key === 'nearest') return pi('interpolation.nearest')
  return methodName || '-'
}

// Save weights to localStorage
const saveWeights = () => {
  localStorage.setItem('pressure_weights', JSON.stringify({
    elastic: wElastic.value,
    density: wDensity.value,
    tensile: wTensile.value
  }))
}

const loadWeights = () => {
  try {
    const data = localStorage.getItem('pressure_weights')
    if (data) {
      const parsed = JSON.parse(data)
      if (Number.isFinite(parsed.elastic)) wElastic.value = parsed.elastic
      if (Number.isFinite(parsed.density)) wDensity.value = parsed.density
      if (Number.isFinite(parsed.tensile)) wTensile.value = parsed.tensile
    }
  } catch (e) {
    // Ignore
  }
}

const handleIndexGrid = async () => {
  loading.value = true
  try {
    const { data } = await pressureIndexGrid(
      method.value,
      gridSize.value,
      normalizedWeights.value.elastic,
      normalizedWeights.value.density,
      normalizedWeights.value.tensile
    )
    indexGrid.value = data.grid
    markStepDone('PressureIndex', { pressureReady: true })
    toast.add(pi('toast.indexGridDone'), 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || pi('toast.calcFailed'), 'error')
  } finally {
    loading.value = false
  }
}

const handleWorkfaces = async () => {
  loading.value = true
  try {
    const { data } = await pressureIndexWorkfaces({
      method: method.value,
      grid_size: gridSize.value,
      axis: faceAxis.value,
      count: faceCount.value,
      direction: faceDirection.value,
      mode: faceMode.value,
      decay: faceDecay.value,
      elastic_modulus: normalizedWeights.value.elastic,
      density: normalizedWeights.value.density,
      tensile_strength: normalizedWeights.value.tensile
    })
    workfaceGrid.value = data.workfaces.adjusted
    markStepDone('PressureIndex', { pressureReady: true })
    toast.add(pi('toast.workfaceDone'), 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || pi('toast.calcFailed'), 'error')
  } finally {
    loading.value = false
  }
}

const handleExport = async () => {
  loading.value = true
  try {
    const { data } = await exportIndex(method.value, gridSize.value)
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = `pressure_index_${method.value}_${gridSize.value}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.add(pi('toast.exportDone'), 'success')
  } catch (err) {
    toast.add(pi('toast.exportFailed'), 'error')
  } finally {
    loading.value = false
  }
}

const handleExportWorkfaces = async () => {
  loading.value = true
  try {
    const { data } = await exportPressureIndexWorkfaces({
      method: method.value,
      grid_size: gridSize.value,
      axis: faceAxis.value,
      count: faceCount.value,
      direction: faceDirection.value,
      mode: faceMode.value,
      decay: faceDecay.value,
      elastic_modulus: normalizedWeights.value.elastic,
      density: normalizedWeights.value.density,
      tensile_strength: normalizedWeights.value.tensile
    })
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = `pressure_index_workfaces_${faceAxis.value}_${faceCount.value}_${gridSize.value}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.add(pi('toast.exportDone'), 'success')
  } catch (err) {
    toast.add(pi('toast.exportFailed'), 'error')
  } finally {
    loading.value = false
  }
}

// MPI鐩稿叧鍑芥暟
const loadMpiWeights = async () => {
  try {
    const { data } = await getMpiWeights()
    mpiWeights.value = data
  } catch (err) {
    // 浣跨敤榛樿鏉冮噸
  }
}

const saveMpiWeights = async () => {
  if (!isWeightValid.value) return
  try {
    await setMpiWeights(mpiWeights.value)
    toast.add(pi('toast.weightsSaved'), 'success')
  } catch (err) {
    toast.add(pi('toast.saveWeightsFailed'), 'error')
  }
}

const handleMpiCalculate = async () => {
  if (!isWeightValid.value) {
    toast.add(pi('toast.weightTotalInvalid'), 'warning')
    return
  }

  loading.value = true
  try {
    const seamName = workspaceState.selectedSeam || normalizeQuerySeam(route.query?.seam) || '16-3鐓?
    const weights = {
      rsi: mpiWeights.value.roof_stability,
      bri: mpiWeights.value.burst_risk,
      asi: mpiWeights.value.abutment_stress
    }
    const { data } = await validationSpatialOverview(
      seamName,
      mpiGridSize.value,
      mpiMethod.value,
      weights
    )

    mpiGrid.value = data?.grids?.mpi || null
    mpiBreakdown.value = {
      rsi: data?.grids?.rsi || null,
      bri: data?.grids?.bri || null,
      asi: data?.grids?.asi || null
    }
    mpiPointCount.value = Number(data?.borehole_count || 0)
    mpiDisplayMode.value = 'mpi'
    markStepDone('PressureIndex', { pressureReady: true })
    toast.add(pi('toast.mpiGridDone'), 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || pi('toast.mpiCalcFailed'), 'error')
  } finally {
    loading.value = false
  }
}

const handleMpiExport = async () => {
  if (!mpiGrid.value) return

  // 瀵煎嚭CSV
  const rows = [['x', 'y', 'mpi', 'rsi', 'bri', 'asi']]
  const grid = mpiGrid.value || []
  const rsiGrid = mpiBreakdown.value.rsi || []
  const briGrid = mpiBreakdown.value.bri || []
  const asiGrid = mpiBreakdown.value.asi || []
  const rowCount = grid.length
  for (let i = 0; i < rowCount; i++) {
    const colCount = Array.isArray(grid[i]) ? grid[i].length : 0
    for (let j = 0; j < colCount; j++) {
      rows.push([
        i,
        j,
        grid[i]?.[j] ?? '',
        rsiGrid[i]?.[j] ?? '',
        briGrid[i]?.[j] ?? '',
        asiGrid[i]?.[j] ?? ''
      ])
    }
  }
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `mpi_grid_${mpiMethod.value}_${mpiGridSize.value}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.add(pi('toast.exportDone'), 'success')
}

const normalizeQuerySeam = (value) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value : ''
}

const goValidation = () => {
  router.push({
    name: 'AlgorithmValidation',
    query: workspaceState.selectedSeam ? { seam: workspaceState.selectedSeam } : undefined
  })
}

watch([wElastic, wDensity, wTensile], saveWeights)
onMounted(() => {
  const querySeam = normalizeQuerySeam(route.query?.seam)
  if (querySeam) setSelectedSeam(querySeam)
  loadWeights()
  loadMpiWeights()
})
</script>

<style scoped>
.main-header {
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 var(--spacing-2) 0;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
}

.section-desc {
  margin: 0 0 var(--spacing-4) 0;
  font-size: 13px;
  color: #64748b;
}

/* Weight Inputs */
.weight-inputs {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.weight-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: var(--spacing-3) var(--spacing-4);
  background: #f3f8f7;
  border-radius: 10px;
}

.weight-label {
  width: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.weight-input {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid #d8e5e2;
  border-radius: 8px;
  font-size: 14px;
}

.weight-percent {
  width: 40px;
  font-size: 12px;
  color: #64748b;
  text-align: right;
}

/* Parameters */
.param-group {
  margin-bottom: 16px;
}

.param-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.param-select,
.param-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid #d8e5e2;
  border-radius: 10px;
  font-size: 14px;
  background: white;
}

.param-select:focus,
.param-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.12);
}

/* Actions */
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.btn {
  padding: var(--spacing-3) var(--spacing-5);
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 14px rgba(14, 116, 144, 0.28);
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(14, 116, 144, 0.34);
}

.btn.secondary {
  background: #e8f0ee;
  border-color: rgba(15, 118, 110, 0.22);
  color: #1f2937;
}

.btn.secondary:hover:not(:disabled) {
  background: #deebe8;
  border-color: rgba(15, 118, 110, 0.34);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Result */
.result-content {
  text-align: center;
}

.legend {
  margin-top: 16px;
}

.legend-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}

.legend-bar {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #0e7490, #14b8a6, #22c55e, #eab308, #f97316, #dc2626);
  position: relative;
}

.legend-low,
.legend-high {
  position: absolute;
  top: 12px;
  font-size: 11px;
  color: #64748b;
}

.legend-low {
  left: 0;
}

.legend-high {
  right: 0;
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  padding: var(--spacing-3);
  background: #f3f8f7;
  border-radius: 10px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.empty-state {
  text-align: center;
  padding: calc(var(--spacing-12) + var(--spacing-3)) var(--spacing-5);
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.result-section {
  margin-top: 20px;
  text-align: center;
}

/* Grid */
.grid {
  display: grid;
  gap: 20px;
}

.grid-2 {
  grid-template-columns: 1fr 1fr;
}

.grid-5 {
  grid-template-columns: repeat(5, 1fr);
}

.card {
  background: linear-gradient(145deg, #ffffff 0%, #f7fbfa 100%);
  border: 1px solid rgba(14, 116, 144, 0.14);
  border-radius: 16px;
  padding: var(--spacing-5);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.07);
}

@media (max-width: 768px) {
  .grid-2,
  .grid-5 {
    grid-template-columns: 1fr;
  }

  .weight-item {
    flex-wrap: wrap;
  }

  .weight-label {
    width: 100%;
  }
}

/* Tabs */
.tabs {
  display: flex;
  gap: var(--spacing-2);
  margin-bottom: 20px;
  padding: var(--spacing-1);
  background: #e8f1ef;
  border-radius: 14px;
}

.tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-5);
  border: none;
  border-radius: 10px;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  color: #475569;
}

.tab.active {
  background: white;
  color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(14, 116, 144, 0.18);
}

.tab-icon {
  font-size: 16px;
}

.tab-label {
  font-size: 14px;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* MPI Styles */
.weight-total {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  margin-bottom: 16px;
  background: #f0fdf4;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #16a34a;
}

.weight-total.invalid {
  background: #fef2f2;
  color: #dc2626;
}

.weight-warning {
  font-weight: 400;
  font-size: 12px;
}

/* MPI Legend Tabs */
.mpi-legend-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
  justify-content: center;
}

.mpi-legend-tab {
  padding: var(--spacing-1) var(--spacing-3);
  border: 1px solid #d6e6e2;
  border-radius: 8px;
  background: white;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.mpi-legend-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.mpi-legend-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.mpi-gradient {
  background: linear-gradient(to right, #dc2626, #f97316, #eab308, #22c55e, #16a34a);
}

.mpi-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 12px;
  padding: var(--spacing-3);
  background: #f3f8f7;
  border-radius: 10px;
  font-size: 12px;
  color: #64748b;
}

.empty-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 8px;
}

/* MPI Definitions */
.mpi-definitions {
  display: grid;
  gap: 16px;
}

.mpi-def-item {
  padding: var(--spacing-4);
  background: #f4f9f8;
  border-radius: 12px;
  border-left: 4px solid var(--color-primary);
}

.mpi-def-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.mpi-def-icon {
  font-size: 20px;
}

.mpi-def-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.mpi-def-desc {
  margin: 0 0 var(--spacing-3) 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

.mpi-def-breakdown {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.mpi-def-breakdown span {
  padding: var(--spacing-1) var(--spacing-3);
  background: white;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #475569;
}

/* Risk Levels */
.risk-levels {
  display: grid;
  gap: 12px;
}

.risk-level {
  padding: var(--spacing-4) var(--spacing-4);
  border-radius: 12px;
  border-left: 4px solid;
}

.risk-level.low {
  background: #f0fdf4;
  border-left-color: #16a34a;
}

.risk-level.medium {
  background: #fff8ed;
  border-left-color: #d97706;
}

.risk-level.high {
  background: #fef2f2;
  border-left-color: #dc2626;
}

.risk-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.risk-badge {
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.risk-badge.low {
  background: #dcfce7;
  color: #16a34a;
}

.risk-badge.medium {
  background: #fef3c7;
  color: #d97706;
}

.risk-badge.high {
  background: #fee2e2;
  color: #dc2626;
}

.risk-range {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.risk-desc {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}
</style>

