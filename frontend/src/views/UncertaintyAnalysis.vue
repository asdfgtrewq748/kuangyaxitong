<template>
  <div class="uncertainty-page">
    <header class="page-header">
      <div class="title-group">
        <h1>{{ copy.title }}</h1>
        <p>{{ copy.subtitle }}</p>
      </div>
      <button class="tool-btn" type="button" :disabled="loading" @click="reloadAll">
        {{ loading ? copy.loading : copy.refresh }}
      </button>
    </header>

    <section class="control-panel">
      <label>
        <span>{{ copy.seam }}</span>
        <select v-model="seamName">
          <option v-for="item in seamOptions" :key="item.name" :value="item.name">{{ item.name }}</option>
        </select>
      </label>
      <label>
        <span>{{ copy.metric }}</span>
        <select v-model="metric">
          <option value="mpi">MPI</option>
          <option value="rsi">RSI</option>
          <option value="bri">BRI</option>
          <option value="asi">ASI</option>
        </select>
      </label>
      <label>
        <span>{{ copy.method }}</span>
        <select v-model="method">
          <option value="idw">IDW</option>
          <option value="linear">Linear</option>
          <option value="nearest">Nearest</option>
          <option value="kriging">Kriging</option>
        </select>
      </label>
      <label>
        <span>{{ copy.resolution }}</span>
        <input v-model.number="resolution" type="number" min="20" max="120" step="5">
      </label>
      <label>
        <span>{{ copy.focus }}</span>
        <select v-model="profileFocus">
          <option value="balanced">{{ copy.focusBalanced }}</option>
          <option value="shallow">{{ copy.focusShallow }}</option>
          <option value="deep">{{ copy.focusDeep }}</option>
        </select>
      </label>
      <label class="wide">
        <span>{{ copy.geomodelJobId }}</span>
        <input v-model.trim="manualJobId" type="text" :placeholder="copy.geomodelJobPlaceholder">
      </label>
    </section>

    <p v-if="error" class="error-text">{{ error }}</p>

    <section v-if="hasSpatialData" class="kpi-grid">
      <article class="kpi-card">
        <span>{{ copy.kpiBoreholes }}</span>
        <strong>{{ spatialData.borehole_count || 0 }}</strong>
      </article>
      <article class="kpi-card">
        <span>{{ copy.kpiMeanStd }}</span>
        <strong>{{ fmt(statSummary.mean) }} ± {{ fmt(statSummary.std) }}</strong>
      </article>
      <article class="kpi-card">
        <span>{{ copy.kpiCv }}</span>
        <strong>{{ fmt(statSummary.cv, 4) }}</strong>
      </article>
      <article class="kpi-card">
        <span>{{ copy.kpiEntropy }}</span>
        <strong>{{ fmt(statSummary.entropyNorm, 4) }}</strong>
      </article>
      <article class="kpi-card">
        <span>{{ copy.kpiRiskRatio }}</span>
        <strong>{{ pct(statSummary.highRiskRatio) }}</strong>
      </article>
      <article class="kpi-card highlight">
        <span>{{ copy.kpiConfidence }}</span>
        <strong>{{ fmt(statSummary.confidenceScore, 2) }}/100</strong>
      </article>
    </section>

    <section v-if="hasSpatialData" class="chart-layout">
      <article class="chart-card heatmap-card">
        <header>
          <h3>{{ copy.mapTitle }} ({{ metric.toUpperCase() }})</h3>
          <p>{{ copy.mapDesc }}</p>
        </header>
        <ScienceChart :option="uncertaintyHeatmapOption" :height="420" renderer="canvas" />
      </article>

      <article class="chart-card compare-card">
        <header>
          <h3>{{ copy.methodTitle }}</h3>
          <p>{{ copy.methodDesc }}</p>
        </header>
        <ScienceChart :option="methodComparisonOption" :height="300" renderer="svg" />
      </article>

      <article class="chart-card profile-card">
        <header>
          <h3>{{ copy.profileTitle }}</h3>
          <p>{{ copy.profileDesc }}</p>
        </header>
        <ScienceChart :option="profileOption" :height="300" renderer="svg" />
      </article>

      <article class="chart-card scatter-card">
        <header>
          <h3>{{ copy.scatterTitle }}</h3>
          <p>{{ copy.scatterDesc }}</p>
        </header>
        <ScienceChart :option="scatterOption" :height="320" renderer="canvas" />
      </article>
    </section>

    <section v-else class="empty-state">
      <h3>{{ copy.emptyTitle }}</h3>
      <p>{{ copy.emptyDesc }}</p>
      <button class="tool-btn" type="button" :disabled="loading" @click="reloadAll">{{ copy.refresh }}</button>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  getApiErrorMessage,
  getCoalSeams,
  getGeomodelIntegrationJobs,
  getGeomodelStressProfile,
  validationSpatialOverview
} from '../api'
import { useI18n } from '../composables/useI18n'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import ScienceChart from '../components/validation/ScienceChart.vue'
import { NATURE_COLORS } from '../utils/natureFigureConfig'

const METHOD_LIST = ['idw', 'linear', 'nearest', 'kriging']

const zh = {
  title: '不确定性与可信度分析',
  subtitle: '面向科研配图的多模型不确定性量化页面：显示空间异质性、方法差异、深度传递与风险置信区间。',
  loading: '加载中...',
  refresh: '刷新分析',
  seam: '煤层',
  metric: '指标',
  method: '主插值方法',
  resolution: '网格分辨率',
  focus: '深度关注模式',
  focusBalanced: '平衡',
  focusShallow: '浅层强化',
  focusDeep: '深层强化',
  geomodelJobId: 'Geomodel 任务 ID（可选）',
  geomodelJobPlaceholder: '留空时自动选最近 completed 任务',
  kpiBoreholes: '有效钻孔数',
  kpiMeanStd: '均值 ± 标准差',
  kpiCv: '全局变异系数 CV',
  kpiEntropy: '归一化熵',
  kpiRiskRatio: '高风险区比例(MPI<60)',
  kpiConfidence: '综合可信度',
  mapTitle: '空间局部不确定性热图',
  mapDesc: '以 3x3 邻域 CV 表示局部波动，颜色越深表示模型在该区域不稳定性越高。',
  methodTitle: '多插值方法对比',
  methodDesc: '同一煤层在 4 种插值法下的均值与不确定性并行对比。',
  profileTitle: '深度传递可信度剖面',
  profileDesc: '基于 Geomodel 深度权重曲线，显示应力传递置信度及关键锚点。',
  scatterTitle: '值-不确定性相图',
  scatterDesc: '散点与趋势线展示指标值和局部不确定性的耦合关系。',
  emptyTitle: '暂无可用空间数据',
  emptyDesc: '请先选择煤层并刷新分析。',
  profileFallback: '未获取到地质任务，使用默认剖面。'
}

const en = {
  title: 'Uncertainty and Confidence Analysis',
  subtitle: 'Research-grade panel for uncertainty quantification: spatial heterogeneity, method divergence, depth transfer, and confidence context.',
  loading: 'Loading...',
  refresh: 'Refresh',
  seam: 'Seam',
  metric: 'Metric',
  method: 'Primary interpolation',
  resolution: 'Grid resolution',
  focus: 'Depth focus',
  focusBalanced: 'Balanced',
  focusShallow: 'Shallow',
  focusDeep: 'Deep',
  geomodelJobId: 'Geomodel Job ID (optional)',
  geomodelJobPlaceholder: 'Auto-pick latest completed job if empty',
  kpiBoreholes: 'Boreholes',
  kpiMeanStd: 'Mean ± Std',
  kpiCv: 'Global CV',
  kpiEntropy: 'Normalized entropy',
  kpiRiskRatio: 'High-risk ratio (MPI<60)',
  kpiConfidence: 'Composite confidence',
  mapTitle: 'Spatial local uncertainty map',
  mapDesc: 'Local 3x3 CV highlights unstable areas where interpolation variance is high.',
  methodTitle: 'Cross-method comparison',
  methodDesc: 'Parallel comparison of mean and uncertainty across four interpolation methods.',
  profileTitle: 'Depth transfer confidence profile',
  profileDesc: 'Geomodel-derived depth weights with anchor points for stress transfer confidence.',
  scatterTitle: 'Value-uncertainty phase plot',
  scatterDesc: 'Scatter and trendline showing coupling between indicator value and local uncertainty.',
  emptyTitle: 'No spatial data',
  emptyDesc: 'Select a seam and refresh analysis first.',
  profileFallback: 'No geomodel job found. Fallback profile is used.'
}

const { locale } = useI18n()
const copy = computed(() => (locale.value === 'zh-CN' ? zh : en))
const { workspaceState, setSelectedSeam } = useWorkspaceFlow()
const route = useRoute()

const seamOptions = ref([])
const seamName = ref('')
const metric = ref('mpi')
const method = ref('idw')
const resolution = ref(50)
const profileFocus = ref('balanced')
const manualJobId = ref('')

const loading = ref(false)
const error = ref('')
const spatialData = ref(null)
const methodComparisonData = ref([])
const stressProfile = ref(null)

const fmt = (value, digits = 3) => {
  const num = Number(value)
  return Number.isFinite(num) ? num.toFixed(digits) : '--'
}

const pct = (value, digits = 1) => {
  const num = Number(value)
  return Number.isFinite(num) ? `${(num * 100).toFixed(digits)}%` : '--'
}

const flattenGrid = (grid) => {
  if (!Array.isArray(grid)) return []
  const values = []
  for (const row of grid) {
    if (!Array.isArray(row)) continue
    for (const raw of row) {
      const num = Number(raw)
      if (Number.isFinite(num)) values.push(num)
    }
  }
  return values
}

const calcEntropyNorm = (values, bins = 14) => {
  if (!values.length) return NaN
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = Math.max(max - min, 1e-9)
  const counts = new Array(bins).fill(0)
  for (const value of values) {
    const idx = Math.min(bins - 1, Math.floor(((value - min) / span) * bins))
    counts[idx] += 1
  }
  let entropy = 0
  for (const c of counts) {
    if (!c) continue
    const p = c / values.length
    entropy -= p * Math.log2(p)
  }
  return entropy / Math.log2(bins)
}

const calcGridStats = (grid, isMpiMetric = false) => {
  const values = flattenGrid(grid)
  if (!values.length) {
    return {
      count: 0,
      min: NaN,
      max: NaN,
      mean: NaN,
      std: NaN,
      cv: NaN,
      entropyNorm: NaN,
      highRiskRatio: NaN,
      confidenceScore: NaN
    }
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const mean = values.reduce((s, v) => s + v, 0) / values.length
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
  const std = Math.sqrt(Math.max(variance, 0))
  const cv = Math.abs(mean) > 1e-8 ? std / Math.abs(mean) : NaN
  const entropyNorm = calcEntropyNorm(values)

  let highRiskRatio = NaN
  if (isMpiMetric) {
    highRiskRatio = values.filter((v) => v < 60).length / values.length
  }

  const cvNorm = Number.isFinite(cv) ? Math.min(1, cv / 0.35) : 0.5
  const entropyPenalty = Number.isFinite(entropyNorm) ? Math.max(0, Math.min(1, entropyNorm)) : 0.5
  const riskPenalty = Number.isFinite(highRiskRatio) ? Math.max(0, Math.min(1, highRiskRatio)) : 0.35
  const confidenceScore = 100 * (1 - (0.5 * cvNorm + 0.3 * entropyPenalty + 0.2 * riskPenalty))

  return {
    count: values.length,
    min,
    max,
    mean,
    std,
    cv,
    entropyNorm,
    highRiskRatio,
    confidenceScore: Math.max(0, Math.min(100, confidenceScore))
  }
}

const buildLocalCvGrid = (grid) => {
  if (!Array.isArray(grid) || !Array.isArray(grid[0])) return []
  const rows = grid.length
  const cols = grid[0].length
  const output = Array.from({ length: rows }, () => Array(cols).fill(NaN))

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const window = []
      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          const rr = r + dr
          const cc = c + dc
          if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue
          const num = Number(grid[rr]?.[cc])
          if (Number.isFinite(num)) window.push(num)
        }
      }
      if (window.length < 3) continue
      const mean = window.reduce((s, v) => s + v, 0) / window.length
      const variance = window.reduce((s, v) => s + (v - mean) ** 2, 0) / window.length
      const std = Math.sqrt(Math.max(variance, 0))
      output[r][c] = Math.abs(mean) > 1e-8 ? std / Math.abs(mean) : NaN
    }
  }

  return output
}

const regressionLine = (points) => {
  const valid = points.filter((item) => Number.isFinite(item[0]) && Number.isFinite(item[1]))
  if (valid.length < 3) return []
  const n = valid.length
  const sx = valid.reduce((s, [x]) => s + x, 0)
  const sy = valid.reduce((s, [, y]) => s + y, 0)
  const sxy = valid.reduce((s, [x, y]) => s + x * y, 0)
  const sxx = valid.reduce((s, [x]) => s + x * x, 0)
  const denominator = n * sxx - sx * sx
  if (Math.abs(denominator) < 1e-9) return []

  const a = (n * sxy - sx * sy) / denominator
  const b = (sy - a * sx) / n
  const xs = valid.map(([x]) => x)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  return [[minX, a * minX + b], [maxX, a * maxX + b]]
}

const hasSpatialData = computed(() => Boolean(spatialData.value?.grids?.[metric.value]?.length))

const activeGrid = computed(() => spatialData.value?.grids?.[metric.value] || [])
const uncertaintyGrid = computed(() => buildLocalCvGrid(activeGrid.value))

const statSummary = computed(() => calcGridStats(activeGrid.value, metric.value === 'mpi'))

const uncertaintyRange = computed(() => {
  const values = flattenGrid(uncertaintyGrid.value)
  if (!values.length) return { min: 0, max: 1 }
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  }
})

const uncertaintyHeatmapOption = computed(() => {
  const grid = uncertaintyGrid.value
  const rows = Array.isArray(grid) ? grid.length : 0
  const cols = Array.isArray(grid?.[0]) ? grid[0].length : 0
  const seriesData = []

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const value = Number(grid[r]?.[c])
      if (!Number.isFinite(value)) continue
      seriesData.push([c, rows - 1 - r, value])
    }
  }

  const { min, max } = uncertaintyRange.value

  return {
    backgroundColor: '#ffffff',
    tooltip: {
      trigger: 'item',
      formatter: (params) => `x=${params.value[0]}, y=${rows - 1 - params.value[1]}<br/>CV=${fmt(params.value[2], 4)}`
    },
    grid: { left: 50, right: 80, top: 35, bottom: 45 },
    xAxis: {
      type: 'category',
      data: Array.from({ length: cols }, (_, i) => i),
      name: 'X index',
      nameLocation: 'middle',
      nameGap: 28,
      axisLabel: { fontSize: 8 }
    },
    yAxis: {
      type: 'category',
      data: Array.from({ length: rows }, (_, i) => i),
      name: 'Y index',
      nameLocation: 'middle',
      nameGap: 32,
      axisLabel: { fontSize: 8 }
    },
    visualMap: {
      min,
      max,
      orient: 'vertical',
      right: 12,
      top: 'center',
      calculable: true,
      precision: 3,
      text: ['High', 'Low'],
      inRange: {
        color: [
          '#edf8fb',
          '#bfd3e6',
          '#9ebcda',
          '#8c96c6',
          '#8856a7',
          '#810f7c'
        ]
      }
    },
    series: [
      {
        type: 'heatmap',
        data: seriesData,
        progressive: 0,
        emphasis: {
          itemStyle: {
            borderColor: '#111827',
            borderWidth: 0.6
          }
        }
      }
    ]
  }
})

const methodComparisonOption = computed(() => {
  const methods = methodComparisonData.value
  if (!methods.length) return { xAxis: { type: 'category', data: [] }, yAxis: { type: 'value' }, series: [] }

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      top: 0,
      textStyle: { fontSize: 9 },
      data: ['Mean', 'CV', 'Confidence']
    },
    grid: { left: 52, right: 40, top: 34, bottom: 38 },
    xAxis: {
      type: 'category',
      data: methods.map((item) => item.method.toUpperCase()),
      axisLabel: { fontSize: 8 }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Mean',
        axisLabel: { fontSize: 8 }
      },
      {
        type: 'value',
        name: 'CV / Score',
        min: 0,
        max: 1,
        axisLabel: { fontSize: 8 }
      }
    ],
    series: [
      {
        name: 'Mean',
        type: 'bar',
        barMaxWidth: 24,
        data: methods.map((item) => item.mean),
        itemStyle: { color: NATURE_COLORS.primary }
      },
      {
        name: 'CV',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: methods.map((item) => item.cv),
        itemStyle: { color: NATURE_COLORS.secondary },
        lineStyle: { width: 1.4 }
      },
      {
        name: 'Confidence',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: methods.map((item) => item.confidenceScore / 100),
        itemStyle: { color: NATURE_COLORS.tertiary },
        lineStyle: { width: 1.4, type: 'dashed' }
      }
    ]
  }
})

const profileSeries = computed(() => {
  const bins = Array.isArray(stressProfile.value?.bins) ? stressProfile.value.bins : []
  const weights = Array.isArray(stressProfile.value?.weights) ? stressProfile.value.weights : []
  if (bins.length > 1 && bins.length === weights.length) {
    return bins.map((z, idx) => [z, Number(weights[idx])])
  }

  const synthetic = []
  const points = 72
  for (let i = 0; i < points; i += 1) {
    const z = i / (points - 1)
    synthetic.push([z, Math.exp(-1.6 * z)])
  }
  return synthetic
})

const profileAnchors = computed(() => {
  const anchors = Array.isArray(stressProfile.value?.anchors) ? stressProfile.value.anchors : []
  return anchors
    .slice(0, 6)
    .map((item) => [Number(item.z_norm), Number(item.importance)])
    .filter((item) => Number.isFinite(item[0]) && Number.isFinite(item[1]))
})

const profileOption = computed(() => {
  const lineData = profileSeries.value
  const areaData = lineData.map(([z, w]) => [z, Math.max(0, w - 0.08), Math.min(1, w + 0.08)])

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const p = params?.[0]
        if (!p) return ''
        return `z_norm=${fmt(p.value[0], 3)}<br/>weight=${fmt(p.value[1], 3)}`
      }
    },
    grid: { left: 52, right: 16, top: 26, bottom: 38 },
    xAxis: {
      type: 'value',
      min: 0,
      max: 1,
      name: 'Depth norm',
      nameLocation: 'middle',
      nameGap: 28,
      axisLabel: { fontSize: 8 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1,
      name: 'Transfer confidence',
      axisLabel: { fontSize: 8 }
    },
    series: [
      {
        name: '95% band upper',
        type: 'line',
        data: areaData.map((item) => [item[0], item[2]]),
        lineStyle: { opacity: 0 },
        symbol: 'none',
        areaStyle: {
          color: 'rgba(0,114,178,0.14)'
        }
      },
      {
        name: '95% band lower',
        type: 'line',
        data: areaData.map((item) => [item[0], item[1]]),
        lineStyle: { opacity: 0 },
        symbol: 'none',
        areaStyle: {
          color: '#ffffff'
        }
      },
      {
        name: 'weight',
        type: 'line',
        smooth: true,
        data: lineData,
        symbol: 'circle',
        symbolSize: 3,
        itemStyle: { color: NATURE_COLORS.primary },
        lineStyle: { width: 1.5 }
      },
      {
        name: 'anchor',
        type: 'scatter',
        data: profileAnchors.value,
        symbolSize: (val) => 4 + (Number(val[1]) || 0) * 18,
        itemStyle: {
          color: NATURE_COLORS.secondary,
          opacity: 0.78
        }
      }
    ]
  }
})

const scatterPairs = computed(() => {
  const grid = activeGrid.value
  const uGrid = uncertaintyGrid.value
  if (!Array.isArray(grid) || !Array.isArray(uGrid)) return []

  const pairs = []
  for (let r = 0; r < grid.length; r += 1) {
    const row = grid[r]
    const uRow = uGrid[r]
    if (!Array.isArray(row) || !Array.isArray(uRow)) continue
    for (let c = 0; c < row.length; c += 1) {
      const value = Number(row[c])
      const unc = Number(uRow[c])
      if (!Number.isFinite(value) || !Number.isFinite(unc)) continue
      pairs.push([value, unc])
    }
  }
  return pairs
})

const scatterOption = computed(() => {
  const points = scatterPairs.value
  const trend = regressionLine(points)

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => `${metric.value.toUpperCase()}=${fmt(params.value[0], 3)}<br/>CV=${fmt(params.value[1], 4)}`
    },
    grid: { left: 52, right: 20, top: 28, bottom: 40 },
    xAxis: {
      type: 'value',
      name: `${metric.value.toUpperCase()} value`,
      axisLabel: { fontSize: 8 }
    },
    yAxis: {
      type: 'value',
      name: 'Local CV',
      axisLabel: { fontSize: 8 }
    },
    series: [
      {
        type: 'scatter',
        data: points,
        symbolSize: 4,
        itemStyle: {
          color: 'rgba(0,158,115,0.42)'
        }
      },
      {
        type: 'line',
        data: trend,
        symbol: 'none',
        lineStyle: {
          color: NATURE_COLORS.secondary,
          width: 1.6
        }
      }
    ]
  }
})

const normalizeQuerySeam = (value) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value : ''
}

const resolveLatestGeomodelJobId = async () => {
  const manual = String(manualJobId.value || '').trim()
  if (manual) return manual

  const { data } = await getGeomodelIntegrationJobs()
  const jobs = Array.isArray(data) ? data : []
  const completed = jobs
    .filter((item) => String(item?.status || '').toLowerCase() === 'completed')
    .sort((a, b) => Date.parse(String(b?.created_at || '')) - Date.parse(String(a?.created_at || '')))

  return completed[0]?.job_id || ''
}

const loadSeams = async () => {
  const resp = await getCoalSeams()
  const seams = resp?.data?.seams || []
  seamOptions.value = seams
  if (!seams.length) return

  const preferredName = normalizeQuerySeam(route.query?.seam)
  const active = workspaceState.selectedSeam || preferredName || seams[0].name
  const found = seams.find((item) => item.name === active)
  seamName.value = found?.name || seams[0].name
  setSelectedSeam(seamName.value)
}

const loadSpatialMain = async () => {
  if (!seamName.value) return null
  const { data } = await validationSpatialOverview(seamName.value, resolution.value, method.value)
  spatialData.value = data || null
  return data || null
}

const loadMethodComparisons = async () => {
  if (!seamName.value) {
    methodComparisonData.value = []
    return
  }

  const tasks = METHOD_LIST.map(async (m) => {
    try {
      const { data } = await validationSpatialOverview(seamName.value, resolution.value, m)
      const grid = data?.grids?.[metric.value] || []
      const stats = calcGridStats(grid, metric.value === 'mpi')
      return {
        method: m,
        mean: stats.mean,
        cv: stats.cv,
        confidenceScore: stats.confidenceScore
      }
    } catch {
      return {
        method: m,
        mean: NaN,
        cv: NaN,
        confidenceScore: NaN
      }
    }
  })

  const rows = await Promise.all(tasks)
  methodComparisonData.value = rows.map((item) => ({
    ...item,
    mean: Number.isFinite(item.mean) ? item.mean : 0,
    cv: Number.isFinite(item.cv) ? item.cv : 0,
    confidenceScore: Number.isFinite(item.confidenceScore) ? item.confidenceScore : 0
  }))
}

const loadStressProfile = async () => {
  const jobId = await resolveLatestGeomodelJobId()
  if (!jobId) {
    stressProfile.value = null
    return
  }

  try {
    const { data } = await getGeomodelStressProfile(jobId, {
      samples: 96,
      focus: profileFocus.value
    })
    stressProfile.value = data || null
    if (!manualJobId.value) manualJobId.value = jobId
  } catch {
    stressProfile.value = null
  }
}

const reloadAll = async () => {
  if (!seamName.value) return

  loading.value = true
  error.value = ''
  try {
    await Promise.all([loadSpatialMain(), loadMethodComparisons(), loadStressProfile()])
  } catch (err) {
    error.value = getApiErrorMessage(err, '分析加载失败')
  } finally {
    loading.value = false
  }
}

watch(seamName, async (value) => {
  setSelectedSeam(value || '')
  if (!value) return
  await reloadAll()
})

watch([metric, resolution, method, profileFocus], () => {
  if (!seamName.value) return
  reloadAll()
})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    await loadSeams()
  } catch (err) {
    error.value = getApiErrorMessage(err, '初始化失败')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.uncertainty-page {
  display: grid;
  gap: 12px;
}

.page-header {
  border: 1px solid #d8e6e3;
  border-radius: 12px;
  background: linear-gradient(140deg, #ffffff 0%, #f4faf8 100%);
  padding: 14px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
}

.title-group h1 {
  margin: 0;
  font-size: 20px;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
  color: #0f172a;
}

.title-group p {
  margin: 6px 0 0;
  font-size: 12px;
  color: #475569;
  max-width: 900px;
}

.tool-btn {
  border: 1px solid #0f766e;
  border-radius: 8px;
  background: #0f766e;
  color: #ffffff;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
}

.tool-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.control-panel {
  border: 1px solid #d8e6e3;
  border-radius: 12px;
  background: #ffffff;
  padding: 12px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.control-panel label {
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #334155;
}

.control-panel label.wide {
  grid-column: span 2;
}

.control-panel select,
.control-panel input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #0f172a;
  padding: 8px 10px;
  font-size: 12px;
}

.control-panel select:focus-visible,
.control-panel input:focus-visible {
  outline: none;
  border-color: #0f766e;
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.18);
}

.error-text {
  margin: 0;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fef2f2;
  color: #991b1b;
  font-size: 12px;
  padding: 10px 12px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
}

.kpi-card {
  border: 1px solid #d8e6e3;
  border-radius: 10px;
  background: #ffffff;
  padding: 10px 12px;
  display: grid;
  gap: 6px;
}

.kpi-card span {
  font-size: 11px;
  color: #64748b;
}

.kpi-card strong {
  font-size: 20px;
  color: #0f172a;
  line-height: 1;
}

.kpi-card.highlight {
  border-color: rgba(15, 118, 110, 0.4);
  background: linear-gradient(160deg, #f0fdfa 0%, #ecfdf5 100%);
}

.chart-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 12px;
}

.chart-card {
  border: 1px solid #d8e6e3;
  border-radius: 12px;
  background: #ffffff;
  padding: 10px;
}

.chart-card header {
  margin-bottom: 6px;
}

.chart-card h3 {
  margin: 0;
  font-size: 15px;
  color: #0f172a;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
}

.chart-card p {
  margin: 4px 0 0;
  font-size: 11px;
  color: #64748b;
}

.heatmap-card {
  grid-row: span 2;
}

.scatter-card {
  grid-column: 1 / -1;
}

.empty-state {
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: #ffffff;
  padding: 20px;
  display: grid;
  gap: 8px;
  justify-items: start;
}

.empty-state h3 {
  margin: 0;
  color: #0f172a;
}

.empty-state p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

@media (max-width: 1280px) {
  .control-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .kpi-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .chart-layout {
    grid-template-columns: 1fr;
  }

  .heatmap-card {
    grid-row: span 1;
  }

  .scatter-card {
    grid-column: auto;
  }
}

@media (max-width: 760px) {
  .page-header {
    flex-direction: column;
  }

  .control-panel {
    grid-template-columns: 1fr;
  }

  .control-panel label.wide {
    grid-column: span 1;
  }

  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
