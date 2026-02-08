<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">📈 矿压指标</h1>
      <p class="page-subtitle">基于岩性参数计算矿压影响指数，生成压力分布图</p>
    </div>

    <!-- 选项卡切换 -->
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

    <!-- 传统矿压指标选项卡 -->
    <div v-show="activeTab === 'traditional'" class="tab-content">
    <div class="grid grid-2">
      <!-- 参数设置 -->
      <div class="card">
        <h3 class="section-title">权重设置</h3>
        <p class="section-desc">设置各岩性参数的权重（总和会自动归一化）</p>

        <div class="weight-inputs">
          <div class="weight-item">
            <label class="weight-label">弹性模量</label>
            <input v-model.number="wElastic" type="number" step="0.1" min="0" class="weight-input">
            <span class="weight-percent">{{ (wElastic / totalWeight * 100).toFixed(0) }}%</span>
          </div>
          <div class="weight-item">
            <label class="weight-label">容重</label>
            <input v-model.number="wDensity" type="number" step="0.1" min="0" class="weight-input">
            <span class="weight-percent">{{ (wDensity / totalWeight * 100).toFixed(0) }}%</span>
          </div>
          <div class="weight-item">
            <label class="weight-label">抗拉强度</label>
            <input v-model.number="wTensile" type="number" step="0.1" min="0" class="weight-input">
            <span class="weight-percent">{{ (wTensile / totalWeight * 100).toFixed(0) }}%</span>
          </div>
        </div>

        <div class="param-group">
          <label class="param-label">插值方法</label>
          <select v-model="method" class="param-select">
            <option value="kriging">Kriging</option>
            <option value="idw">IDW</option>
            <option value="linear">Linear</option>
            <option value="nearest">Nearest</option>
          </select>
        </div>

        <div class="param-group">
          <label class="param-label">网格大小</label>
          <input v-model.number="gridSize" type="number" min="20" max="120" class="param-input">
        </div>

        <div class="action-buttons">
          <button class="btn primary" @click="handleIndexGrid" :disabled="loading">
            <span v-if="loading" class="spinner sm"></span>
            {{ loading ? '计算中...' : '计算指标网格' }}
          </button>
          <button v-if="indexGrid" class="btn secondary" @click="handleExport" :disabled="loading">
            导出指标
          </button>
          <button v-if="indexGrid" class="btn secondary" @click="goValidation" :disabled="loading">
            下一步：实证验证
          </button>
        </div>
      </div>

      <!-- 指标结果 -->
      <div class="card">
        <h3 class="section-title">矿压指标分布</h3>

        <div v-if="indexGrid" class="result-content">
          <HeatmapCanvas :grid="indexGrid.values" :size="420" />
          <div class="legend">
            <div class="legend-label">压力指数</div>
            <div class="legend-bar">
              <span class="legend-low">低压力</span>
              <span class="legend-high">高压力</span>
            </div>
          </div>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-label">最小值</span>
              <span class="stat-value">{{ indexGrid.min?.toFixed(3) || '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最大值</span>
              <span class="stat-value">{{ indexGrid.max?.toFixed(3) || '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">平均值</span>
              <span class="stat-value">{{ indexGrid.mean?.toFixed(3) || '-' }}</span>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📈</div>
          <p>请先设置权重并计算指标网格</p>
        </div>
      </div>
    </div>

    <!-- 工作面调整 -->
    <div class="card">
      <h3 class="section-title">工作面矿压调整</h3>
      <p class="section-desc">根据工作面推进方向调整矿压分布</p>

      <div class="grid grid-5">
        <div class="param-group">
          <label class="param-label">工作面数</label>
          <input v-model.number="faceCount" type="number" min="1" class="param-input">
        </div>
        <div class="param-group">
          <label class="param-label">方向轴</label>
          <select v-model="faceAxis" class="param-select">
            <option value="x">X 轴</option>
            <option value="y">Y 轴</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">推进方向</label>
          <select v-model="faceDirection" class="param-select">
            <option value="ascending">正向</option>
            <option value="descending">反向</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">影响模式</label>
          <select v-model="faceMode" class="param-select">
            <option value="decrease">递减</option>
            <option value="increase">递增</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">衰减系数</label>
          <input v-model.number="faceDecay" type="number" step="0.01" class="param-input">
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn primary" @click="handleWorkfaces" :disabled="loading">
          计算调整后指标
        </button>
        <button v-if="workfaceGrid" class="btn secondary" @click="handleExportWorkfaces" :disabled="loading">
          导出调整结果
        </button>
      </div>

      <div v-if="workfaceGrid" class="result-section">
        <HeatmapCanvas :grid="workfaceGrid" :size="500" />
      </div>
    </div>
    </div>

    <!-- MPI指标选项卡 -->
    <div v-show="activeTab === 'mpi'" class="tab-content">
      <div class="grid grid-2">
        <!-- MPI权重设置 -->
        <div class="card">
          <h3 class="section-title">MPI权重配置</h3>
          <p class="section-desc">设置矿压影响指标各子项的权重</p>

          <div class="weight-inputs">
            <div class="weight-item">
              <label class="weight-label">顶板稳定性 (RSI)</label>
              <input v-model.number="mpiWeights.roof_stability" type="number" step="0.05" min="0" max="1" class="weight-input">
              <span class="weight-percent">{{ (mpiWeights.roof_stability * 100).toFixed(0) }}%</span>
            </div>
            <div class="weight-item">
              <label class="weight-label">冲击地压风险 (BRI)</label>
              <input v-model.number="mpiWeights.burst_risk" type="number" step="0.05" min="0" max="1" class="weight-input">
              <span class="weight-percent">{{ (mpiWeights.burst_risk * 100).toFixed(0) }}%</span>
            </div>
            <div class="weight-item">
              <label class="weight-label">支承压力分布 (ASI)</label>
              <input v-model.number="mpiWeights.abutment_stress" type="number" step="0.05" min="0" max="1" class="weight-input">
              <span class="weight-percent">{{ (mpiWeights.abutment_stress * 100).toFixed(0) }}%</span>
            </div>
          </div>

          <div class="weight-total" :class="{ invalid: !isWeightValid }">
            <span>权重总和: {{ mpiWeightTotal }}</span>
            <span v-if="!isWeightValid" class="weight-warning">（应为1.0）</span>
          </div>

          <div class="param-group">
            <label class="param-label">插值方法</label>
            <select v-model="mpiMethod" class="param-select">
              <option value="kriging">Kriging - 普通克里金</option>
              <option value="idw">IDW - 反距离加权</option>
              <option value="linear">Linear - 线性插值</option>
              <option value="nearest">Nearest - 最近邻</option>
            </select>
          </div>

          <div class="param-group">
            <label class="param-label">网格分辨率</label>
            <input v-model.number="mpiGridSize" type="number" min="20" max="150" class="param-input">
          </div>

          <div class="action-buttons">
            <button class="btn primary" @click="handleMpiCalculate" :disabled="loading || !isWeightValid">
              <span v-if="loading" class="spinner sm"></span>
              {{ loading ? '计算中...' : '计算MPI网格' }}
            </button>
            <button v-if="mpiGrid" class="btn secondary" @click="handleMpiExport" :disabled="loading">
              导出MPI数据
            </button>
          </div>
        </div>

        <!-- MPI网格结果 -->
        <div class="card">
          <h3 class="section-title">MPI综合指标分布</h3>

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
              <div class="legend-label">MPI值 ({{ mpiDisplayModeLabel }})</div>
              <div class="legend-bar mpi-gradient">
                <span class="legend-low">高风险 (低MPI)</span>
                <span class="legend-high">低风险 (高MPI)</span>
              </div>
            </div>

            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-label">最小值</span>
                <span class="stat-value">{{ mpiStats.min?.toFixed(2) || '-' }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">最大值</span>
                <span class="stat-value">{{ mpiStats.max?.toFixed(2) || '-' }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">平均值</span>
                <span class="stat-value">{{ mpiStats.mean?.toFixed(2) || '-' }}</span>
              </div>
            </div>

            <div v-if="mpiPointCount > 0" class="mpi-info">
              <span class="mpi-info-item">数据点: {{ mpiPointCount }}</span>
              <span class="mpi-info-item">插值方法: {{ mpiMethod }}</span>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">📊</div>
            <p>请先设置权重并计算MPI网格</p>
            <p class="empty-hint">需要先导入钻孔数据和坐标数据</p>
          </div>
        </div>
      </div>

      <!-- 分项指标说明 -->
      <div class="card">
        <h3 class="section-title">MPI分项指标说明</h3>
        <div class="mpi-definitions">
          <div class="mpi-def-item">
            <div class="mpi-def-header">
              <span class="mpi-def-icon">🏠</span>
              <span class="mpi-def-title">RSI - 顶板稳定性指标</span>
            </div>
            <p class="mpi-def-desc">评估顶板岩层的稳定性，基于直接顶抗拉强度、关键层数量和岩层结构综合计算。分数越高顶板越稳定。</p>
            <div class="mpi-def-breakdown">
              <span>抗拉强度 (40%)</span>
              <span>关键层数量 (30%)</span>
              <span>岩层结构 (30%)</span>
            </div>
          </div>
          <div class="mpi-def-item">
            <div class="mpi-def-header">
              <span class="mpi-def-icon">💥</span>
              <span class="mpi-def-title">BRI - 冲击地压风险指标</span>
            </div>
            <p class="mpi-def-desc">评估冲击地压发生的风险程度，考虑采深、硬厚岩层能量积聚和煤层厚度影响。分数越高风险越低。</p>
            <div class="mpi-def-breakdown">
              <span>采深因子</span>
              <span>硬岩能量积聚</span>
              <span>煤层厚度</span>
            </div>
          </div>
          <div class="mpi-def-item">
            <div class="mpi-def-header">
              <span class="mpi-def-icon">⚖️</span>
              <span class="mpi-def-title">ASI - 支承压力分布指标</span>
            </div>
            <p class="mpi-def-desc">评估支承压力分布的合理性，基于岩层综合刚度和内摩擦角计算。分数越高应力分布越合理。</p>
            <div class="mpi-def-breakdown">
              <span>综合刚度 (50%)</span>
              <span>内摩擦角 (50%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 风险等级说明 -->
      <div class="card">
        <h3 class="section-title">MPI风险等级划分</h3>
        <div class="risk-levels">
          <div class="risk-level low">
            <div class="risk-header">
              <span class="risk-badge low">低风险</span>
              <span class="risk-range">MPI ≥ 70</span>
            </div>
            <p class="risk-desc">围岩条件较好，可采用常规支护方式。</p>
          </div>
          <div class="risk-level medium">
            <div class="risk-header">
              <span class="risk-badge medium">中等风险</span>
              <span class="risk-range">50 ≤ MPI < 70</span>
            </div>
            <p class="risk-desc">建议加强顶板支护，增加锚杆/锚索密度。</p>
          </div>
          <div class="risk-level high">
            <div class="risk-header">
              <span class="risk-badge high">高风险</span>
              <span class="risk-range">MPI < 50</span>
            </div>
            <p class="risk-desc">围岩条件较差，建议采用加强支护联合方式，必要时采取卸压措施。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import HeatmapCanvas from '../components/HeatmapCanvas.vue'
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
const { workspaceState, setSelectedSeam, markStepDone } = useWorkspaceFlow()

// 选项卡
const tabs = [
  { key: 'traditional', label: '传统指标', icon: '📈' },
  { key: 'mpi', label: 'MPI指标', icon: '📊' }
]
const activeTab = ref('traditional')

// 传统指标
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

// MPI相关
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
const mpiDisplayModes = [
  { key: 'mpi', label: '综合MPI' },
  { key: 'rsi', label: '顶板稳定性' },
  { key: 'bri', label: '冲击地压风险' },
  { key: 'asi', label: '支承压力分布' }
]

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

// MPI相关计算属性
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
  const mode = mpiDisplayModes.find(m => m.key === mpiDisplayMode.value)
  return mode ? mode.label : 'MPI'
})

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
    toast.add('指标网格计算完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '计算失败', 'error')
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
    toast.add('工作面调整完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '计算失败', 'error')
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
    toast.add('导出成功', 'success')
  } catch (err) {
    toast.add('导出失败', 'error')
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
    toast.add('导出成功', 'success')
  } catch (err) {
    toast.add('导出失败', 'error')
  } finally {
    loading.value = false
  }
}

// MPI相关函数
const loadMpiWeights = async () => {
  try {
    const { data } = await getMpiWeights()
    mpiWeights.value = data
  } catch (err) {
    // 使用默认权重
  }
}

const saveMpiWeights = async () => {
  if (!isWeightValid.value) return
  try {
    await setMpiWeights(mpiWeights.value)
    toast.add('权重配置已保存', 'success')
  } catch (err) {
    toast.add('保存权重失败', 'error')
  }
}

const handleMpiCalculate = async () => {
  if (!isWeightValid.value) {
    toast.add('MPI 权重总和需为 1.00', 'warning')
    return
  }

  loading.value = true
  try {
    const seamName = workspaceState.selectedSeam || normalizeQuerySeam(route.query?.seam) || '16-3煤'
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
    toast.add('MPI网格计算完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || 'MPI计算失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleMpiExport = async () => {
  if (!mpiGrid.value) return

  // 导出CSV
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
  toast.add('导出成功', 'success')
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
.page-title {
  margin: 0 0 8px 0;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.page-subtitle {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #64748b;
}

.section-title {
  margin: 0 0 8px 0;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
}

.section-desc {
  margin: 0 0 16px 0;
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
  padding: 10px 14px;
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
  padding: 8px 12px;
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
  padding: 10px 14px;
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
  padding: 10px 18px;
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
  padding: 12px;
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
  padding: 60px 20px;
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
  padding: 20px;
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
  gap: 8px;
  margin-bottom: 20px;
  padding: 6px;
  background: #e8f1ef;
  border-radius: 14px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
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
  gap: 8px;
  padding: 10px 14px;
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
  padding: 6px 12px;
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
  padding: 10px;
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
  padding: 16px;
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
  margin: 0 0 10px 0;
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
  padding: 4px 10px;
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
  padding: 14px 16px;
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
  padding: 4px 10px;
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
