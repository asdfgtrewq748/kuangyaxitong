<template>
  <div class="report-page">
    <header class="card hero">
      <div>
        <h1>结果报告中心</h1>
        <p>默认自动生成报告，进入页面后立即汇总指标统计、MPI专题分析与明细表。</p>
      </div>
      <div class="hero-actions">
        <button class="btn primary" :disabled="loading" @click="generateReport(true)">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? '刷新中...' : '刷新报告' }}
        </button>
        <button class="btn secondary" :disabled="!summary.length" @click="exportReport">导出CSV</button>
        <button class="btn secondary" @click="goValidation">返回实证页</button>
      </div>
    </header>

    <section class="card controls">
      <div class="control-item">
        <label>专题煤层</label>
        <select v-model="selectedSeam" :disabled="!seamOptions.length">
          <option v-for="item in seamOptions" :key="item.name" :value="item.name">{{ item.name }}</option>
        </select>
      </div>
      <div class="control-item status">
        <label>报告状态</label>
        <span class="status-chip" :class="loading ? 'loading' : summary.length ? 'ready' : 'idle'">
          {{ loading ? '自动计算中' : summary.length ? '已生成' : '暂无数据' }}
        </span>
      </div>
      <div class="control-item status">
        <label>最近更新</label>
        <span>{{ generatedAt || '-' }}</span>
      </div>
      <div class="control-item geomodel-control">
        <label>Geomodel任务ID</label>
        <div class="geomodel-input-row">
          <input v-model.trim="geomodelJobId" type="text" placeholder="输入任务ID，如 a1b2c3d4e5f6">
          <button class="btn secondary small" :disabled="geomodelLoading || !geomodelJobId" @click="loadGeomodelQuality(true)">
            {{ geomodelLoading ? '读取中...' : '读取质量' }}
          </button>
        </div>
      </div>
    </section>

    <section class="card" v-if="reportError">
      <p class="error">{{ reportError }}</p>
    </section>

    <section class="card">
      <h2>总览统计</h2>
      <div class="cards-grid" v-if="summary.length">
        <article class="metric-card" v-for="row in summary" :key="row.name">
          <h3>{{ row.name }}</h3>
          <div class="metric-main">{{ formatNumber(row.stats.mean, 3) }}</div>
          <div class="metric-sub">
            <span>Min {{ formatNumber(row.stats.min, 3) }}</span>
            <span>Max {{ formatNumber(row.stats.max, 3) }}</span>
          </div>
          <div class="metric-sub">
            <span>Std {{ formatNumber(row.stats.std, 3) }}</span>
            <span>P50 {{ formatNumber(row.stats.p50, 3) }}</span>
          </div>
        </article>
      </div>
      <div v-else class="empty-block">{{ loading ? '正在自动生成总览统计...' : '暂无总览统计数据' }}</div>
    </section>

    <section class="card">
      <h2>MPI专题分析</h2>
      <div v-if="mpiSummary" class="mpi-layout">
        <div class="mpi-stats">
          <div class="stat-item"><span>煤层</span><strong>{{ mpiSummary.seamName }}</strong></div>
          <div class="stat-item"><span>MPI均值</span><strong>{{ formatNumber(mpiSummary.stats.mean, 2) }}</strong></div>
          <div class="stat-item"><span>MPI最小</span><strong>{{ formatNumber(mpiSummary.stats.min, 2) }}</strong></div>
          <div class="stat-item"><span>MPI最大</span><strong>{{ formatNumber(mpiSummary.stats.max, 2) }}</strong></div>
          <div class="stat-item"><span>RSI均值</span><strong>{{ formatNumber(mpiSummary.breakdown.rsi, 2) }}</strong></div>
          <div class="stat-item"><span>BRI均值</span><strong>{{ formatNumber(mpiSummary.breakdown.bri, 2) }}</strong></div>
          <div class="stat-item"><span>ASI均值</span><strong>{{ formatNumber(mpiSummary.breakdown.asi, 2) }}</strong></div>
        </div>

        <div class="mpi-extremes">
          <article>
            <h3>高MPI区域（低风险）</h3>
            <ul>
              <li v-for="item in mpiSummary.high" :key="`high-${item.id}`">{{ item.id }}: {{ formatNumber(item.mpi, 2) }}</li>
            </ul>
          </article>
          <article>
            <h3>低MPI区域（高风险）</h3>
            <ul>
              <li v-for="item in mpiSummary.low" :key="`low-${item.id}`">{{ item.id }}: {{ formatNumber(item.mpi, 2) }}</li>
            </ul>
          </article>
        </div>
      </div>
      <div v-else class="empty-block">{{ loading ? '正在自动生成MPI专题分析...' : '暂无MPI专题分析数据' }}</div>
    </section>

    <section class="card">
      <h2>地质模型质量章节</h2>
      <div v-if="geomodelError" class="error">{{ geomodelError }}</div>
      <div v-else-if="geomodelQuality" class="geomodel-quality-grid">
        <article class="metric-card">
          <h3>任务状态</h3>
          <div class="metric-main">{{ geomodelQuality.status || '-' }}</div>
          <div class="metric-sub"><span>任务ID</span><span>{{ geomodelJobId }}</span></div>
        </article>
        <article class="metric-card">
          <h3>连续性评分</h3>
          <div class="metric-main">{{ formatNumber(geomodelQuality.summary?.continuity_score, 3) }}</div>
          <div class="metric-sub"><span>尖灭比例</span><span>{{ formatNumber(geomodelQuality.summary?.pinchout_ratio, 3) }}</span></div>
        </article>
        <article class="metric-card">
          <h3>层厚变异系数</h3>
          <div class="metric-main">{{ formatNumber(geomodelQuality.summary?.layer_cv, 3) }}</div>
          <div class="metric-sub"><span>零/负厚比</span><span>{{ formatNumber(geomodelQuality.summary?.zero_or_negative_ratio, 3) }}</span></div>
        </article>
        <article class="metric-card warning-card">
          <h3>质量告警</h3>
          <div class="warning-list">
            <span v-if="geomodelQuality.warning_flags?.low_continuity">低连续性</span>
            <span v-if="geomodelQuality.warning_flags?.high_pinchout">尖灭比例高</span>
            <span v-if="geomodelQuality.warning_flags?.high_variability">层厚变异高</span>
            <span v-if="!geomodelQuality.warning_flags || (!geomodelQuality.warning_flags.low_continuity && !geomodelQuality.warning_flags.high_pinchout && !geomodelQuality.warning_flags.high_variability)">无明显告警</span>
          </div>
        </article>
      </div>
      <div v-else class="empty-block">输入 Geomodel 任务ID 后读取质量摘要并纳入报告。</div>
    </section>

    <section class="card">
      <h2>详细统计表</h2>
      <div class="table-wrap" v-if="summary.length">
        <table>
          <thead>
            <tr>
              <th>指标</th>
              <th>最小值</th>
              <th>最大值</th>
              <th>平均值</th>
              <th>标准差</th>
              <th>P10</th>
              <th>P50</th>
              <th>P90</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in summary" :key="`table-${row.name}`">
              <td>{{ row.name }}</td>
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
      <div v-else class="empty-block">{{ loading ? '正在自动生成明细统计...' : '暂无明细统计数据' }}</div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import {
  downloadGeomodelArtifact,
  getCoalSeams,
  getGeomodelJob,
  getRockParams,
  getSeamOverburden,
  mpiBatch,
  summaryIndex,
  summaryIndexWorkfaces,
  summarySteps,
  summaryStepsWorkfaces
} from '../api'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const { setSelectedSeam, markStepDone } = useWorkspaceFlow()

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

const layerParamsCache = new Map()

const formatNumber = (value, digits = 3) => {
  const n = Number(value)
  return Number.isFinite(n) ? n.toFixed(digits) : '-'
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
      if (notify) toast.add(`建模任务状态：${job?.status || 'pending'}`, 'warning')
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
    if (notify) toast.add('已加载地质模型质量摘要', 'success')
  } catch (error) {
    geomodelError.value = error?.response?.data?.detail || '读取地质建模质量失败'
    if (notify) toast.add(geomodelError.value, 'error')
  } finally {
    geomodelLoading.value = false
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

const buildMpiPoints = async (boreholes = [], seamName = '') => {
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

    const [a, b, c, d, mpi] = await Promise.all([
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
      }),
      buildMpiReport(selectedSeam.value)
    ])

    summary.value = [
      { name: '矿压指标', stats: a.data.grid },
      { name: '矿压指标-工作面', stats: b.data.grid },
      { name: '来压步距', stats: c.data.grid },
      { name: '来压步距-工作面', stats: d.data.grid }
    ]

    mpiSummary.value = mpi
    generatedAt.value = new Date().toLocaleString()
    markStepDone('Report', { reportGeneratedAt: new Date().toISOString() })

    if (notify) toast.add('报告已刷新', 'success')
  } catch (error) {
    reportError.value = error?.response?.data?.detail || '报告生成失败'
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

  const rows = summary.value.map((row) => ({
    指标: row.name,
    最小值: formatNumber(row.stats.min, 3),
    最大值: formatNumber(row.stats.max, 3),
    平均值: formatNumber(row.stats.mean, 3),
    标准差: formatNumber(row.stats.std, 3),
    P10: formatNumber(row.stats.p10, 3),
    P50: formatNumber(row.stats.p50, 3),
    P90: formatNumber(row.stats.p90, 3)
  }))

  if (mpiSummary.value) {
    rows.push({
      指标: `MPI综合指标(${mpiSummary.value.seamName})`,
      最小值: formatNumber(mpiSummary.value.stats.min, 3),
      最大值: formatNumber(mpiSummary.value.stats.max, 3),
      平均值: formatNumber(mpiSummary.value.stats.mean, 3),
      标准差: formatNumber(mpiSummary.value.stats.std, 3),
      P10: '',
      P50: '',
      P90: ''
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

  toast.add('报告导出成功', 'success')
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

.hero {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-lg);
  align-items: center;
  background:
    radial-gradient(circle at right top, rgba(15, 118, 110, 0.12), transparent 55%),
    linear-gradient(145deg, #ffffff 0%, #f1f7f5 100%);
}

.hero h1 {
  margin: 0;
  font-size: 26px;
  color: var(--text-primary);
}

.hero p {
  margin: var(--spacing-sm) 0 0;
  font-size: 13px;
  color: var(--text-secondary);
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

  .controls,
  .cards-grid,
  .mpi-stats,
  .mpi-extremes,
  .geomodel-quality-grid {
    grid-template-columns: 1fr;
  }
}
</style>
