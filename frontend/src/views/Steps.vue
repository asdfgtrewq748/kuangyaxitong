<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">📐 来压步距计算</h1>
      <p class="page-subtitle">基于顶板岩层力学参数计算初次来压步距和周期来压步距</p>
    </div>

    <div class="card">
      <h3 class="section-title">计算模型选择</h3>

      <!-- 模型选择 -->
      <div class="param-row">
        <div class="param-group">
          <label class="param-label">力学模型</label>
          <select v-model="stepModel" class="param-select">
            <option value="fixed">固支梁模型</option>
            <option value="simply">简支梁模型</option>
            <option value="shear">剪切破坏模型</option>
            <option value="empirical">经验比例模型</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">计算目标</label>
          <select v-model="stepTarget" class="param-select">
            <option value="initial">初次来压步距</option>
            <option value="periodic">周期来压步距</option>
          </select>
        </div>
      </div>

      <!-- 参数输入 -->
      <div class="param-grid">
        <div class="param-group">
          <label class="param-label">顶板厚度 h (m)</label>
          <input v-model.number="stepH" type="number" step="0.1" class="param-input">
        </div>
        <div class="param-group">
          <label class="param-label">载荷 q (MPa)</label>
          <input v-model.number="stepQ" type="number" step="0.1" class="param-input">
        </div>
        <div class="param-group">
          <label class="param-label">抗拉强度 t (MPa)</label>
          <input v-model.number="stepT" type="number" step="0.1" class="param-input">
        </div>
        <div class="param-group">
          <label class="param-label">抗剪强度 s (MPa)</label>
          <input v-model.number="stepS" type="number" step="0.1" class="param-input">
        </div>
      </div>

      <!-- 取值方式 -->
      <div class="param-row">
        <div class="param-group">
          <label class="param-label">h 取值方式</label>
          <select v-model="hMode" class="param-select">
            <option value="total">总厚度</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">q 取值方式</label>
          <select v-model="qMode" class="param-select">
            <option value="density_thickness">容重 × 厚度</option>
            <option value="default">默认值</option>
          </select>
        </div>
        <div class="param-group" v-if="qMode === 'default'">
          <label class="param-label">q 默认值</label>
          <input v-model.number="defaultQ" type="number" step="0.1" class="param-input">
        </div>
        <div class="param-group">
          <label class="param-label">网格大小</label>
          <input v-model.number="gridSize" type="number" min="20" max="120" class="param-input">
        </div>
      </div>

      <!-- 计算按钮 -->
      <div class="action-buttons">
        <button class="btn primary" @click="handleSteps" :disabled="loading">
          <span v-if="loading" class="spinner sm"></span>
          {{ loading ? '计算中...' : '计算步距' }}
        </button>
        <button class="btn secondary" @click="handleStepsGrid" :disabled="loading">
          生成步距网格
        </button>
        <button v-if="stepGrid" class="btn secondary" @click="handleExportGrid" :disabled="loading">
          导出网格
        </button>
        <button class="btn secondary" @click="handleStepsBatch" :disabled="loading">
          批量计算
        </button>
        <button v-if="stepBatch" class="btn secondary" @click="handleExportBatch" :disabled="loading">
          导出批量结果
        </button>
      </div>

      <!-- 计算结果 -->
      <div v-if="stepResult" class="result-box">
        <div class="result-header">计算结果</div>
        <div class="result-values">
          <div class="result-value">
            <span class="result-label">初次来压步距</span>
            <span class="result-number">{{ stepResult.initial_step?.toFixed(2) || '-' }} m</span>
          </div>
          <div class="result-value">
            <span class="result-label">周期来压步距</span>
            <span class="result-number">{{ stepResult.periodic_step?.toFixed(2) || '-' }} m</span>
          </div>
        </div>
        <div v-if="stepResult.error" class="result-error">
          注意：{{ stepResult.error }}
        </div>
      </div>
    </div>

    <!-- 步距网格 -->
    <div v-if="stepGrid" class="card">
      <h3 class="section-title">步距分布网格</h3>
      <div class="result-content">
        <HeatmapCanvas :grid="stepGrid.values" :size="500" />
      </div>
    </div>

    <!-- MPI分布与步距建议 -->
    <div class="card">
      <h3 class="section-title">MPI分布与步距建议</h3>
      <p class="section-desc">基于煤层上覆岩层参数计算MPI分布，用于辅助步距调整</p>

      <div class="mpi-controls">
        <div class="param-group">
          <label class="param-label">煤层</label>
          <select v-model="mpiSeam" class="param-select">
            <option v-for="seam in mpiSeams" :key="seam.name" :value="seam.name">
              {{ seam.name }}
            </option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">网格分辨率</label>
          <input v-model.number="mpiGridSize" type="number" min="20" max="150" class="param-input">
        </div>
        <div class="param-group">
          <label class="param-label">插值方法</label>
          <select v-model="mpiMethod" class="param-select">
            <option value="idw">IDW</option>
            <option value="linear">Linear</option>
            <option value="nearest">Nearest</option>
          </select>
        </div>
        <button class="btn secondary" @click="handleMpiGrid" :disabled="loadingMpi || !mpiSeam">
          <span v-if="loadingMpi" class="spinner sm"></span>
          {{ loadingMpi ? '计算中...' : '计算MPI分布' }}
        </button>
      </div>

      <div v-if="mpiGrid" class="result-content">
        <HeatmapCanvas :grid="mpiGrid" :size="420" />

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

        <div class="mpi-suggestion">
          <div class="mpi-suggestion-title">步距调整建议</div>
          <p class="mpi-suggestion-text">{{ mpiSuggestion }}</p>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📊</div>
        <p>请选择煤层并计算MPI分布</p>
      </div>
    </div>

    <!-- 批量计算结果 -->
    <div v-if="stepBatch" class="card">
      <h3 class="section-title">批量计算结果</h3>
      <p class="section-desc">已计算 {{ stepBatch.items?.length || 0 }} 个钻孔的来压步距</p>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>序号</th>
              <th>初次来压步距 (m)</th>
              <th>周期来压步距 (m)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in stepBatch.items?.slice(0, 20)" :key="i">
              <td>{{ i + 1 }}</td>
              <td>{{ item.initial?.toFixed(2) || '-' }}</td>
              <td>{{ item.periodic?.toFixed(2) || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="stepBatch.items?.length > 20" class="table-more">
          还有 {{ stepBatch.items.length - 20 }} 条数据...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast'
import HeatmapCanvas from '../components/HeatmapCanvas.vue'
import {
  pressureSteps,
  pressureStepsBatch,
  pressureStepsGrid,
  exportPressureSteps,
  exportPressureStepsGrid,
  getCoalSeams,
  getSeamOverburden,
  getRockParams,
  mpiInterpolate
} from '../api'

const toast = useToast()
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
const loading = ref(false)
const stepResult = ref(null)
const stepGrid = ref(null)
const stepBatch = ref(null)

const mpiSeams = ref([])
const mpiSeam = ref('')
const mpiGridSize = ref(60)
const mpiMethod = ref('idw')
const mpiGrid = ref(null)
const mpiStats = ref({})
const loadingMpi = ref(false)
const layerParamsCache = new Map()

const mpiSuggestion = computed(() => {
  const mean = mpiStats.value?.mean
  if (mean == null || Number.isNaN(mean)) return '暂无建议，请先计算MPI分布。'
  if (mean < 60) return 'MPI偏低，建议适当减小来压步距或提高支护强度。'
  if (mean < 80) return 'MPI中等，建议按当前步距执行，并关注局部高风险区。'
  return 'MPI偏高，整体风险较低，可在安全条件下适度增大步距。'
})

const handleSteps = async () => {
  loading.value = true
  try {
    const { data } = await pressureSteps(
      stepModel.value,
      stepH.value,
      stepQ.value,
      stepT.value,
      stepS.value
    )
    stepResult.value = data
    toast.add('步距计算完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '计算失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleStepsGrid = async () => {
  loading.value = true
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
    toast.add('步距网格生成完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '生成失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleStepsBatch = async () => {
  loading.value = true
  try {
    const { data } = await pressureStepsBatch(stepModel.value)
    stepBatch.value = data
    toast.add(`已计算 ${data.items?.length || 0} 个钻孔`, 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '批量计算失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleExportGrid = async () => {
  loading.value = true
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
    toast.add('导出成功', 'success')
  } catch (err) {
    toast.add('导出失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleExportBatch = async () => {
  loading.value = true
  try {
    const { data } = await exportPressureSteps(stepModel.value)
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = `pressure_steps_${stepModel.value}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.add('导出成功', 'success')
  } catch (err) {
    toast.add('导出失败', 'error')
  } finally {
    loading.value = false
  }
}

const loadMpiSeams = async () => {
  try {
    const { data } = await getCoalSeams()
    mpiSeams.value = data.seams || []
    if (!mpiSeam.value && mpiSeams.value.length > 0) {
      mpiSeam.value = mpiSeams.value[0].name
    }
  } catch (err) {
    toast.add('加载煤层失败', 'error')
  }
}

const getLayerParams = async (name) => {
  if (!name) return null
  if (layerParamsCache.has(name)) return layerParamsCache.get(name)
  try {
    const { data } = await getRockParams(name)
    layerParamsCache.set(name, data)
    return data
  } catch (err) {
    layerParamsCache.set(name, null)
    return null
  }
}

const buildMpiPoints = async (boreholes = []) => {
  const points = []
  for (const borehole of boreholes) {
    const layers = borehole.layers || []
    const seamLayer = layers.find(l => l.name === mpiSeam.value)
    const strataLayers = layers.filter(l => l.name !== mpiSeam.value)

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

const handleMpiGrid = async () => {
  if (!mpiSeam.value) return
  loadingMpi.value = true
  try {
    const { data } = await getSeamOverburden(mpiSeam.value)
    const boreholes = data.boreholes || []
    if (boreholes.length === 0) {
      toast.add('当前煤层无可用钻孔数据', 'error')
      return
    }

    const points = await buildMpiPoints(boreholes)
    const { data: mpiData } = await mpiInterpolate(points, mpiGridSize.value, mpiMethod.value)
    mpiGrid.value = mpiData.grid
    mpiStats.value = mpiData.statistics || {}
    toast.add('MPI分布计算完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || 'MPI计算失败', 'error')
  } finally {
    loadingMpi.value = false
  }
}

loadMpiSeams()
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
  margin: 0 0 16px 0;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
}

.section-desc {
  margin: 0 0 16px 0;
  font-size: 13px;
  color: #64748b;
}

.param-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.param-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.param-group {
  display: flex;
  flex-direction: column;
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
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  background: white;
}

.param-select:focus,
.param-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.mpi-controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 12px;
  align-items: end;
  margin-bottom: 16px;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn.secondary {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  color: white;
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

.result-box {
  padding: 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  border-left: 4px solid #22c55e;
}

.result-header {
  font-size: 14px;
  font-weight: 600;
  color: #15803d;
  margin-bottom: 12px;
}

.result-values {
  display: flex;
  gap: 32px;
}

.result-value {
  text-align: center;
}

.result-label {
  display: block;
  font-size: 12px;
  color: #166534;
  margin-bottom: 4px;
}

.result-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #14532d;
}

.result-error {
  margin-top: 12px;
  padding: 8px 12px;
  background: rgba(234, 179, 8, 0.2);
  border-radius: 6px;
  font-size: 13px;
  color: #854d0e;
}

.result-content {
  text-align: center;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.stat-item {
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #64748b;
}

.stat-value {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.mpi-suggestion {
  background: #eef2ff;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  text-align: left;
}

.mpi-suggestion-title {
  font-size: 13px;
  font-weight: 700;
  color: #4338ca;
  margin-bottom: 6px;
}

.mpi-suggestion-text {
  font-size: 13px;
  color: #3730a3;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 16px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th {
  text-align: left;
  padding: 10px 12px;
  background: #f1f5f9;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
}

.table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  color: #0f172a;
}

.table tbody tr:hover {
  background: #f8fafc;
}

.table-more {
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: #64748b;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .param-row,
  .param-grid {
    grid-template-columns: 1fr;
  }

  .mpi-controls {
    grid-template-columns: 1fr;
  }

  .result-values {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
