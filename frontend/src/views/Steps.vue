<template>
  <div class="steps-page">
    <header class="hero card">
      <div>
        <h1>来压步距智能计算</h1>
        <p>默认自动计算：进入页面后立即生成步距结果、步距网格、MPI分布和批量统计。</p>
      </div>
      <div class="hero-actions">
        <button class="btn primary" :disabled="refreshing" @click="refreshAll(true)">
          <span v-if="refreshing" class="spinner"></span>
          {{ refreshing ? '刷新中...' : '刷新全部结果' }}
        </button>
        <button class="btn secondary" :disabled="!stepGrid" @click="handleExportGrid">导出步距网格</button>
        <button class="btn secondary" :disabled="!stepBatch" @click="handleExportBatch">导出批量结果</button>
      </div>
    </header>

    <section class="card params-card">
      <h2>参数设置</h2>
      <div class="params-grid">
        <label>
          力学模型
          <select v-model="stepModel">
            <option value="fixed">固支梁模型</option>
            <option value="simply">简支梁模型</option>
            <option value="shear">剪切破坏模型</option>
            <option value="empirical">经验比例模型</option>
          </select>
        </label>

        <label>
          计算目标
          <select v-model="stepTarget">
            <option value="initial">初次来压步距</option>
            <option value="periodic">周期来压步距</option>
          </select>
        </label>

        <label>
          顶板厚度 h (m)
          <input v-model.number="stepH" type="number" step="0.1" min="0.1">
        </label>

        <label>
          载荷 q (MPa)
          <input v-model.number="stepQ" type="number" step="0.1" min="0.1">
        </label>

        <label>
          抗拉强度 t (MPa)
          <input v-model.number="stepT" type="number" step="0.1" min="0.1">
        </label>

        <label>
          抗剪强度 s (MPa)
          <input v-model.number="stepS" type="number" step="0.1" min="0.1">
        </label>

        <label>
          h取值
          <select v-model="hMode">
            <option value="total">总厚度</option>
          </select>
        </label>

        <label>
          q取值
          <select v-model="qMode">
            <option value="density_thickness">容重 × 厚度</option>
            <option value="default">默认值</option>
          </select>
        </label>

        <label v-if="qMode === 'default'">
          默认q
          <input v-model.number="defaultQ" type="number" step="0.1" min="0.1">
        </label>

        <label>
          网格大小
          <input v-model.number="gridSize" type="number" min="20" max="120" step="1">
        </label>

        <label>
          MPI煤层
          <select v-model="mpiSeam" :disabled="mpiSeams.length === 0">
            <option v-for="seam in mpiSeams" :key="seam.name" :value="seam.name">{{ seam.name }}</option>
          </select>
        </label>

        <label>
          MPI网格
          <input v-model.number="mpiGridSize" type="number" min="20" max="150" step="1">
        </label>

        <label>
          MPI插值
          <select v-model="mpiMethod">
            <option value="idw">IDW</option>
            <option value="linear">Linear</option>
            <option value="nearest">Nearest</option>
          </select>
        </label>
      </div>
    </section>

    <section class="card kpi-card">
      <h2>核心结果总览</h2>
      <div class="kpi-grid">
        <article class="kpi-item">
          <span>初次来压步距</span>
          <strong>{{ formatNumber(stepResult?.initial_step, 2, 'm') }}</strong>
          <small v-if="loadingStepResult">自动计算中...</small>
        </article>
        <article class="kpi-item">
          <span>周期来压步距</span>
          <strong>{{ formatNumber(stepResult?.periodic_step, 2, 'm') }}</strong>
          <small v-if="loadingStepResult">自动计算中...</small>
        </article>
        <article class="kpi-item">
          <span>MPI均值</span>
          <strong>{{ formatNumber(mpiStats?.mean, 2) }}</strong>
          <small v-if="loadingMpi">自动计算中...</small>
        </article>
        <article class="kpi-item">
          <span>批量样本数</span>
          <strong>{{ stepBatch?.items?.length || 0 }}</strong>
          <small v-if="loadingStepBatch">自动计算中...</small>
        </article>
      </div>
      <p class="hint" v-if="stepResultError || stepGridError || stepBatchError || mpiError">
        {{ stepResultError || stepGridError || stepBatchError || mpiError }}
      </p>
    </section>

    <section class="two-col">
      <article class="card panel">
        <div class="panel-head">
          <h3>步距分布网格</h3>
          <span class="tag">{{ stepModel }} / {{ stepTarget }}</span>
        </div>
        <div class="panel-body">
          <div v-if="loadingStepGrid" class="loading-block">正在自动计算步距网格...</div>
          <HeatmapCanvas v-else-if="stepGrid?.values?.length" :grid="stepGrid.values" :size="480" />
          <div v-else class="empty-block">暂无网格数据</div>
        </div>
      </article>

      <article class="card panel">
        <div class="panel-head">
          <h3>MPI分布与步距建议</h3>
          <span class="tag">{{ mpiSeam || '未选择煤层' }}</span>
        </div>
        <div class="panel-body">
          <div v-if="loadingMpi" class="loading-block">正在自动计算MPI分布...</div>
          <HeatmapCanvas v-else-if="mpiGrid?.length" :grid="mpiGrid" :size="420" />
          <div v-else class="empty-block">暂无MPI分布</div>

          <div class="stats-row">
            <div class="stat-item"><span>最小值</span><strong>{{ formatNumber(mpiStats?.min, 2) }}</strong></div>
            <div class="stat-item"><span>最大值</span><strong>{{ formatNumber(mpiStats?.max, 2) }}</strong></div>
            <div class="stat-item"><span>平均值</span><strong>{{ formatNumber(mpiStats?.mean, 2) }}</strong></div>
          </div>

          <div class="suggestion">
            <h4>步距建议</h4>
            <p>{{ mpiSuggestion }}</p>
          </div>
        </div>
      </article>
    </section>

    <section class="card panel">
      <div class="panel-head">
        <h3>批量步距结果</h3>
        <span class="tag">最多预览前20条</span>
      </div>
      <div class="panel-body">
        <div v-if="loadingStepBatch" class="loading-block">正在自动计算批量结果...</div>
        <div v-else-if="stepBatch?.items?.length" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>初次来压步距 (m)</th>
                <th>周期来压步距 (m)</th>
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
          <div class="table-foot" v-if="stepBatch.items.length > 20">还有 {{ stepBatch.items.length - 20 }} 条未展示</div>
        </div>
        <div v-else class="empty-block">暂无批量结果</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useToast } from '../composables/useToast'
import HeatmapCanvas from '../components/HeatmapCanvas.vue'
import {
  exportPressureSteps,
  exportPressureStepsGrid,
  getCoalSeams,
  getRockParams,
  getSeamOverburden,
  mpiInterpolate,
  pressureSteps,
  pressureStepsBatch,
  pressureStepsGrid
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

const mpiSeams = ref([])
const mpiSeam = ref('')
const mpiGridSize = ref(60)
const mpiMethod = ref('idw')

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

const mpiSuggestion = computed(() => {
  const mean = Number(mpiStats.value?.mean)
  if (!Number.isFinite(mean)) return '暂无建议，等待MPI结果自动计算完成。'
  if (mean < 60) return 'MPI偏低，建议适当减小步距并提高支护强度。'
  if (mean < 80) return 'MPI中等，建议按当前步距执行并重点监测局部异常区。'
  return 'MPI较高，整体风险较低，可在安全条件下适度增大步距。'
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
    const message = error?.response?.data?.detail || '步距计算失败'
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
    const message = error?.response?.data?.detail || '步距网格计算失败'
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
    const message = error?.response?.data?.detail || '批量步距计算失败'
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
    return
  }

  loadingMpi.value = true
  mpiError.value = ''
  try {
    const { data } = await getSeamOverburden(mpiSeam.value)
    const boreholes = data?.boreholes || []
    if (!boreholes.length) {
      mpiGrid.value = null
      mpiStats.value = {}
      mpiError.value = '当前煤层没有可用钻孔数据'
      if (notifyError) toast.add(mpiError.value, 'warning')
      return
    }

    const points = await buildMpiPoints(boreholes)
    const { data: mpiData } = await mpiInterpolate(points, mpiGridSize.value, mpiMethod.value)
    mpiGrid.value = mpiData?.grid || null
    mpiStats.value = mpiData?.statistics || {}
  } catch (error) {
    const message = error?.response?.data?.detail || 'MPI分布计算失败'
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
  if (notify) toast.add('全部结果已刷新', 'success')
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
    toast.add('步距网格导出成功', 'success')
  } catch {
    toast.add('步距网格导出失败', 'error')
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
    toast.add('批量结果导出成功', 'success')
  } catch {
    toast.add('批量结果导出失败', 'error')
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
    mpiError.value = '煤层列表加载失败'
  }
}

const debounceStepResult = createDebouncer(() => runStepResult(false), 500)
const debounceStepGrid = createDebouncer(() => runStepGrid(false), 650)
const debounceStepBatch = createDebouncer(() => runStepBatch(false), 650)
const debounceMpi = createDebouncer(() => runMpiGrid(false), 700)

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
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.hero h1 {
  margin: 0;
  font-size: 26px;
  color: #0f172a;
}

.hero p {
  margin: 8px 0 0;
  font-size: 13px;
  color: #64748b;
}

.hero-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn {
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 14px;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #fff;
}

.btn.secondary {
  background: #e2e8f0;
  color: #0f172a;
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
  margin: 0 0 12px;
  font-size: 16px;
  color: #0f172a;
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.params-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #475569;
}

.params-grid input,
.params-grid select {
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  padding: 9px 10px;
  font-size: 13px;
  background: #fff;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.kpi-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
}

.kpi-item span {
  display: block;
  font-size: 12px;
  color: #64748b;
}

.kpi-item strong {
  display: block;
  margin-top: 4px;
  font-size: 22px;
  color: #0f172a;
}

.kpi-item small {
  color: #2563eb;
  font-size: 11px;
}

.hint {
  margin: 10px 0 0;
  color: #b91c1c;
  font-size: 12px;
}

.two-col {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
}

.panel {
  min-height: 420px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.panel-head h3 {
  margin: 0;
  font-size: 15px;
  color: #0f172a;
}

.tag {
  font-size: 11px;
  border-radius: 999px;
  padding: 4px 10px;
  background: #eff6ff;
  color: #1d4ed8;
}

.panel-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-block,
.empty-block {
  min-height: 260px;
  display: grid;
  place-items: center;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  font-size: 13px;
  color: #64748b;
  background: #f8fafc;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.stat-item {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
}

.stat-item span {
  display: block;
  font-size: 11px;
  color: #64748b;
}

.stat-item strong {
  display: block;
  margin-top: 4px;
  font-size: 16px;
  color: #0f172a;
}

.suggestion {
  border: 1px solid #dbeafe;
  background: #eff6ff;
  border-radius: 12px;
  padding: 10px 12px;
}

.suggestion h4 {
  margin: 0 0 4px;
  font-size: 13px;
  color: #1e3a8a;
}

.suggestion p {
  margin: 0;
  font-size: 12px;
  color: #1e40af;
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
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

thead th {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
}

.table-foot {
  margin-top: 8px;
  font-size: 12px;
  color: #64748b;
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
  .hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .params-grid,
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
