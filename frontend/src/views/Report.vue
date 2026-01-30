<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">📑 结果报告</h1>
      <p class="page-subtitle">生成综合分析报告，汇总所有计算结果</p>
    </div>

    <div class="card">
      <h3 class="section-title">生成报告</h3>
      <p class="section-desc">点击生成按钮获取完整的分析报告</p>

      <div class="action-buttons">
        <button class="btn primary" @click="handleSummary" :disabled="loading">
          <span v-if="loading" class="spinner sm"></span>
          {{ loading ? '生成中...' : '生成综合报告' }}
        </button>
        <button v-if="summary" class="btn secondary" @click="exportReport">
          导出报告
        </button>
      </div>
    </div>

    <div v-if="summary" class="report-content">
      <!-- 概览卡片 -->
      <div class="summary-cards">
        <div v-for="item in summary" :key="item.name" class="summary-card">
          <div class="card-title">{{ item.name }}</div>
          <div class="card-stats">
            <div class="card-stat">
              <span class="stat-label">最小值</span>
              <span class="stat-value">{{ item.stats.min?.toFixed(3) || '-' }}</span>
            </div>
            <div class="card-stat">
              <span class="stat-label">最大值</span>
              <span class="stat-value">{{ item.stats.max?.toFixed(3) || '-' }}</span>
            </div>
            <div class="card-stat">
              <span class="stat-label">平均值</span>
              <span class="stat-value">{{ item.stats.mean?.toFixed(3) || '-' }}</span>
            </div>
          </div>
          <div class="card-additional">
            <span>标准差: {{ item.stats.std?.toFixed(3) || '-' }}</span>
            <span>P50: {{ item.stats.p50?.toFixed(3) || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- MPI专题 -->
      <div class="card" v-if="mpiSummary">
        <h3 class="section-title">MPI专题分析（{{ mpiSummary.seamName }}）</h3>
        <p class="section-desc">综合MPI与分项指标统计，并标注高/低MPI区域</p>

        <div class="mpi-summary-grid">
          <div class="mpi-summary-item">
            <span class="stat-label">MPI最小值</span>
            <span class="stat-value">{{ mpiSummary.stats.min?.toFixed(2) || '-' }}</span>
          </div>
          <div class="mpi-summary-item">
            <span class="stat-label">MPI最大值</span>
            <span class="stat-value">{{ mpiSummary.stats.max?.toFixed(2) || '-' }}</span>
          </div>
          <div class="mpi-summary-item">
            <span class="stat-label">MPI平均值</span>
            <span class="stat-value">{{ mpiSummary.stats.mean?.toFixed(2) || '-' }}</span>
          </div>
          <div class="mpi-summary-item">
            <span class="stat-label">RSI平均值</span>
            <span class="stat-value">{{ mpiSummary.breakdown.rsi?.toFixed(2) || '-' }}</span>
          </div>
          <div class="mpi-summary-item">
            <span class="stat-label">BRI平均值</span>
            <span class="stat-value">{{ mpiSummary.breakdown.bri?.toFixed(2) || '-' }}</span>
          </div>
          <div class="mpi-summary-item">
            <span class="stat-label">ASI平均值</span>
            <span class="stat-value">{{ mpiSummary.breakdown.asi?.toFixed(2) || '-' }}</span>
          </div>
        </div>

        <div class="mpi-markers">
          <div class="mpi-marker">
            <div class="mpi-marker-title">高MPI区域（低风险）</div>
            <ul>
              <li v-for="item in mpiSummary.high" :key="item.id">
                {{ item.id }}：MPI {{ item.mpi.toFixed(2) }}
              </li>
            </ul>
          </div>
          <div class="mpi-marker">
            <div class="mpi-marker-title">低MPI区域（高风险）</div>
            <ul>
              <li v-for="item in mpiSummary.low" :key="item.id">
                {{ item.id }}：MPI {{ item.mpi.toFixed(2) }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 详细数据表格 -->
      <div class="card">
        <h3 class="section-title">详细统计数据</h3>
        <div class="table-wrapper">
          <table class="table">
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
              <tr v-for="row in summary" :key="row.name">
                <td><strong>{{ row.name }}</strong></td>
                <td>{{ row.stats.min?.toFixed(3) || '-' }}</td>
                <td>{{ row.stats.max?.toFixed(3) || '-' }}</td>
                <td>{{ row.stats.mean?.toFixed(3) || '-' }}</td>
                <td>{{ row.stats.std?.toFixed(3) || '-' }}</td>
                <td>{{ row.stats.p10?.toFixed(3) || '-' }}</td>
                <td>{{ row.stats.p50?.toFixed(3) || '-' }}</td>
                <td>{{ row.stats.p90?.toFixed(3) || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📊</div>
      <p>暂无报告数据</p>
      <p class="empty-hint">请先完成数据分析后再生成报告</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '../composables/useToast'
import {
  summaryIndex,
  summaryIndexWorkfaces,
  summarySteps,
  summaryStepsWorkfaces,
  getCoalSeams,
  getSeamOverburden,
  getRockParams,
  mpiBatch
} from '../api'

const toast = useToast()
const loading = ref(false)
const summary = ref(null)
const mpiSummary = ref(null)
const layerParamsCache = new Map()

const handleSummary = async () => {
  loading.value = true
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

    const [a, b, c, d] = await Promise.all([
      summaryIndex(method, gridSize),
      summaryIndexWorkfaces({ method, grid_size: gridSize, axis: faceAxis, count: faceCount, direction: faceDirection, mode: faceMode, decay: faceDecay, elastic_modulus: wElastic, density: wDensity, tensile_strength: wTensile }),
      summarySteps(stepModel, stepTarget, gridSize),
      summaryStepsWorkfaces({ model: stepModel, target: stepTarget, grid_size: gridSize, axis: faceAxis, count: faceCount, direction: faceDirection, mode: faceMode, decay: faceDecay })
    ])

    summary.value = [
      { name: '矿压指标', stats: a.data.grid },
      { name: '矿压指标-工作面', stats: b.data.grid },
      { name: '来压步距', stats: c.data.grid },
      { name: '来压步距-工作面', stats: d.data.grid }
    ]

    mpiSummary.value = await buildMpiReport()

    toast.add('报告生成完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '生成失败', 'error')
  } finally {
    loading.value = false
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

const buildMpiPoints = async (boreholes = [], seamName = '') => {
  const points = []
  for (const borehole of boreholes) {
    const layers = borehole.layers || []
    const seamLayer = layers.find(l => l.name === seamName)
    const strataLayers = layers.filter(l => l.name !== seamName)

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

const buildMpiReport = async () => {
  try {
    const { data: seamData } = await getCoalSeams()
    const seams = seamData.seams || []
    if (seams.length === 0) return null

    const seamName = seams[0].name
    const { data: overburden } = await getSeamOverburden(seamName)
    const boreholes = overburden.boreholes || []
    if (boreholes.length === 0) return null

    const points = await buildMpiPoints(boreholes, seamName)
    const { data: batch } = await mpiBatch(points)
    const results = batch.results || []

    const breakdown = results.reduce(
      (acc, cur) => {
        acc.rsi += cur.breakdown?.rsi || 0
        acc.bri += cur.breakdown?.bri || 0
        acc.asi += cur.breakdown?.asi || 0
        return acc
      },
      { rsi: 0, bri: 0, asi: 0 }
    )
    const count = results.length || 1
    const breakdownAvg = {
      rsi: breakdown.rsi / count,
      bri: breakdown.bri / count,
      asi: breakdown.asi / count
    }

    const sorted = [...results].sort((a, b) => a.mpi - b.mpi)
    const low = sorted.slice(0, 3)
    const high = sorted.slice(-3).reverse()

    return {
      seamName,
      stats: batch.summary || {},
      breakdown: breakdownAvg,
      high,
      low
    }
  } catch (err) {
    return null
  }
}

const exportReport = () => {
  const data = summary.value.map(row => ({
    指标: row.name,
    最小值: row.stats.min?.toFixed(3),
    最大值: row.stats.max?.toFixed(3),
    平均值: row.stats.mean?.toFixed(3),
    标准差: row.stats.std?.toFixed(3),
    P10: row.stats.p10?.toFixed(3),
    P50: row.stats.p50?.toFixed(3),
    P90: row.stats.p90?.toFixed(3)
  }))

  if (mpiSummary.value) {
    data.push({
      指标: `MPI综合指标（${mpiSummary.value.seamName}）`,
      最小值: mpiSummary.value.stats.min?.toFixed(3),
      最大值: mpiSummary.value.stats.max?.toFixed(3),
      平均值: mpiSummary.value.stats.mean?.toFixed(3),
      标准差: mpiSummary.value.stats.std?.toFixed(3),
      P10: '',
      P50: '',
      P90: ''
    })
  }

  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pressure_report_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)

  toast.add('报告导出成功', 'success')
}
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

.action-buttons {
  display: flex;
  gap: 10px;
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

/* Report Content */
.report-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.mpi-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.mpi-summary-item {
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px 12px;
}

.mpi-markers {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.mpi-marker {
  background: #f1f5f9;
  border-radius: 10px;
  padding: 12px 14px;
}

.mpi-marker-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.mpi-marker ul {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
  color: #334155;
}

.summary-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.card-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.card-additional {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #64748b;
  padding-top: 8px;
  border-top: 1px dashed #e2e8f0;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th {
  text-align: left;
  padding: 12px 16px;
  background: #f1f5f9;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
}

.table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #0f172a;
}

.table tbody tr:hover {
  background: #f8fafc;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-hint {
  font-size: 13px;
  color: #94a3b8;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .mpi-summary-grid,
  .mpi-markers {
    grid-template-columns: 1fr;
  }
}
</style>
