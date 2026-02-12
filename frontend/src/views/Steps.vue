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

        <label class="geo-toggle">
          地质约束
          <span class="geo-toggle-line">
            <input v-model="geoAwareEnabled" type="checkbox">
            <span>{{ geoAwareEnabled ? '已开启' : '未开启' }}</span>
          </span>
        </label>

        <label v-if="geoAwareEnabled">
          Geomodel任务ID（可选）
          <input v-model.trim="geoModelJobId" type="text" placeholder="例如 gm_20260210_xxx">
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

          <div v-if="geoCompareSummary" class="geo-summary">
            <h4>地质约束对照</h4>
            <div class="stats-row geo-summary-row">
              <div class="stat-item">
                <span>Baseline均值</span>
                <strong>{{ formatNumber(geoCompareSummary.baselineMean, 2) }}</strong>
              </div>
              <div class="stat-item">
                <span>Geo-aware均值</span>
                <strong>{{ formatNumber(geoCompareSummary.geoMean, 2) }}</strong>
              </div>
              <div class="stat-item">
                <span>均值变化</span>
                <strong>{{ formatNumber(geoCompareSummary.delta, 2) }}</strong>
              </div>
            </div>
            <p class="geo-meta">
              模式：{{ geoCompareSummary.algorithmMode }} · 回退：{{ geoCompareSummary.fallbackUsed ? '是' : '否' }}
            </p>
            <p v-if="geoFeatureSummary" class="geo-feature">{{ geoFeatureSummary }}</p>
          </div>

          <div class="zone-card" v-if="zoneRiskSummary.length">
            <h4>分区风险说明</h4>
            <div class="zone-grid">
              <div v-for="zone in zoneRiskSummary" :key="zone.key" class="zone-item" :class="zone.key">
                <span>{{ zone.label }}</span>
                <strong>{{ zone.count }}格 / {{ zone.ratio }}%</strong>
              </div>
            </div>
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
  mpiInterpolateGeo,
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

const mpiSuggestion = computed(() => {
  const mean = Number(mpiStats.value?.mean)
  if (!Number.isFinite(mean)) return '暂无建议，等待MPI结果自动计算完成。'

  if (geoAwareEnabled.value && mpiGeoCompare.value) {
    const baselineMean = Number(mpiGeoCompare.value?.baseline_statistics?.mean)
    const geoMean = Number(mpiGeoCompare.value?.geology_aware_statistics?.mean)
    const delta = geoMean - baselineMean
    if (mpiGeoCompare.value?.fallback_used) {
      return '地质约束已开启，但当前任务ID不可用或特征缺失，系统已回退默认特征；建议核查建模任务状态。'
    }
    if (Number.isFinite(delta) && delta <= -3) {
      return `地质约束后MPI均值下降 ${delta.toFixed(2)}，建议缩小步距并加强低值区支护。`
    }
    if (Number.isFinite(delta) && delta >= 3) {
      return `地质约束后MPI均值上升 ${delta.toFixed(2)}，整体可维持当前步距并优化巡检资源投入。`
    }
    return '地质约束前后差异较小，建议维持当前步距并持续监测局部异常区。'
  }

  if (mean < 60) return 'MPI偏低，建议适当减小步距并提高支护强度。'
  if (mean < 80) return 'MPI中等，建议按当前步距执行并重点监测局部异常区。'
  return 'MPI较高，整体风险较低，可在安全条件下适度增大步距。'
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
    algorithmMode: mpiGeoCompare.value?.algorithm_mode || 'unknown'
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
  if (Number.isFinite(continuity)) tokens.push(`连续性=${continuity.toFixed(3)}`)
  if (Number.isFinite(pinchout)) tokens.push(`尖灭比例=${pinchout.toFixed(3)}`)
  if (Number.isFinite(layerCv)) tokens.push(`层厚变异=${layerCv.toFixed(3)}`)
  if (Number.isFinite(span)) tokens.push(`关键层跨度=${span.toFixed(1)}`)
  return tokens.length ? `特征引用：${tokens.join('，')}` : ''
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
    { key: 'high', label: '高风险区(MPI<60)', count: high, ratio: ratio(high) },
    { key: 'medium', label: '关注区(60-80)', count: medium, ratio: ratio(medium) },
    { key: 'low', label: '低风险区(>=80)', count: low, ratio: ratio(low) }
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
      mpiError.value = '当前煤层没有可用钻孔数据'
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
  background: linear-gradient(145deg, #ffffff 0%, #f7fbfa 100%);
  border: 1px solid rgba(14, 116, 144, 0.16);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.05);
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
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 14px;
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
  border: 1px solid #d5e4e1;
  border-radius: 10px;
  padding: 9px 10px;
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
  gap: 8px;
  min-height: 38px;
}

.geo-toggle-line input[type='checkbox'] {
  width: 16px;
  height: 16px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.kpi-item {
  border: 1px solid rgba(14, 116, 144, 0.16);
  border-radius: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #ffffff, #f2f8f7);
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
  color: var(--color-info);
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
  background: rgba(14, 116, 144, 0.14);
  color: #0e7490;
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
  border: 1px dashed #bfd3d9;
  border-radius: 12px;
  font-size: 13px;
  color: #64748b;
  background: #f4f9f8;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.stat-item {
  border: 1px solid #d8e6e3;
  border-radius: 10px;
  padding: 10px;
  background: #fafdfc;
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
  border: 1px solid #bde8de;
  background: linear-gradient(135deg, #ecfdf8, #ddf7ef);
  border-radius: 12px;
  padding: 10px 12px;
}

.suggestion h4 {
  margin: 0 0 4px;
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
  padding: 10px 12px;
}

.geo-summary h4,
.zone-card h4 {
  margin: 0 0 8px;
  font-size: 13px;
  color: #1d4ed8;
}

.geo-summary-row {
  margin-top: 4px;
}

.geo-meta,
.geo-feature {
  margin: 8px 0 0;
  font-size: 12px;
  color: #1e3a8a;
}

.zone-card {
  border: 1px solid #cfe7db;
  border-radius: 12px;
  padding: 10px 12px;
  background: #f7fcfa;
}

.zone-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.zone-item {
  border-radius: 10px;
  padding: 8px 10px;
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

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #d9e6e3;
  text-align: left;
}

thead th {
  background: #eff6f4;
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

  .zone-grid {
    grid-template-columns: 1fr;
  }
}
</style>
