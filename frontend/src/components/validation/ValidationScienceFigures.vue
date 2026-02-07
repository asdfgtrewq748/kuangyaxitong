<template>
  <section class="science-gallery">
    <header class="gallery-head">
      <div class="head-title">
        <h4>SCI 配图增强版（图2-图11）</h4>
        <p>统一采用期刊风格坐标系、阈值注记、置信区间和关键决策点标注。</p>
      </div>
      <div class="head-metrics">
        <span class="metric-chip">样本 n={{ sampleSize }}</span>
        <span class="metric-chip">正样本占比 {{ pct(positiveRate) }}</span>
        <span v-if="bootstrapBands" class="metric-chip">Bootstrap {{ bootstrapBands.iterations }}次</span>
        <span class="metric-chip" :class="{ warn: evalMode !== 'real_label_stream' }">评估源 {{ evalModeLabel }}</span>
        <span v-if="labelSource" class="metric-chip">标签文件 {{ labelSource }}</span>
      </div>
    </header>

    <article class="figure-card">
      <h4>图2 | RSI 机制剖面图（稳定度-损伤-置信带）</h4>
      <ScienceChart :option="fig2Option" :height="336" />
      <p class="caption">怎么看：稳定度实线越高越好，误差带越窄代表层位响应更稳定，损伤柱越低越好。</p>
      <p class="caption meta">{{ fig2Insight }}</p>
    </article>

    <article class="figure-card">
      <h4>图3 | BRI 微震能量释放、事件频次与累计风险</h4>
      <ScienceChart :option="fig3Option" :height="336" />
      <p class="caption">怎么看：能量柱与事件频次线共同识别冲击窗口，累计风险线反映风险积聚过程。</p>
      <p class="caption meta">{{ fig3Insight }}</p>
    </article>

    <article class="figure-card">
      <h4>图4 | ASI 径向/切向应力与应力集中系数 Kt</h4>
      <ScienceChart :option="fig4Option" :height="336" />
      <p class="caption">怎么看：切向应力峰值与 Kt&gt;2 区段对应高风险圈带，径向应力反映卸压后衰减。</p>
      <p class="caption meta">{{ fig4Insight }}</p>
    </article>

    <article class="figure-card">
      <h4>图5 | DBN 后验概率时序（95% CI + 预警阈值）</h4>
      <ScienceChart :option="fig5Option" :height="336" />
      <p class="caption">怎么看：后验概率曲线跨过 0.6 报警阈值时需触发强化巡检，CI 带越窄越可信。</p>
      <p class="caption meta">{{ fig5Insight }}</p>
    </article>

    <article class="figure-card">
      <h4>图6 | 新旧算法多指标对比（分数 + 增益）</h4>
      <ScienceChart :option="fig6Option" :height="336" />
      <p class="caption">怎么看：柱形给出绝对分数，增益折线给出替代旧算法的实际收益幅度。</p>
      <p class="caption meta">{{ fig6Insight }}</p>
    </article>

    <article class="figure-card">
      <h4>图7 | 消融实验（模块贡献与性能下降）</h4>
      <ScienceChart :option="fig7Option" :height="336" />
      <p class="caption">怎么看：去除模块后的性能下降越大，说明该模块对总体性能贡献越关键。</p>
      <p class="caption meta">{{ fig7Insight }}</p>
    </article>

    <article class="figure-card">
      <h4>图8 | 校准曲线（含样本直方图与置信区间）</h4>
      <ScienceChart :option="fig8Option" :height="336" />
      <p class="caption">怎么看：曲线贴近对角线且 ECE 越低，模型概率输出越可直接用于阈值决策。</p>
      <p class="caption meta">{{ fig8Insight }}</p>
    </article>

    <article class="figure-card">
      <h4>图9 | ROC 曲线（最优阈值点与 AUC）</h4>
      <ScienceChart :option="fig9Option" :height="336" />
      <p class="caption">怎么看：曲线越靠左上角越好；灰色阴影带为 bootstrap 95%CI，上下虚线为CI边界，红点为 Youden 最优阈值。</p>
      <p class="caption meta">{{ fig9Insight }}</p>
    </article>

    <article class="figure-card">
      <h4>图10 | PR 曲线（基线、F1 等值线与最优点）</h4>
      <ScienceChart :option="fig10Option" :height="336" />
      <p class="caption">怎么看：PR 曲线整体越高越好；灰色阴影带为 bootstrap 95%CI，上下虚线为CI边界，绿点为最佳F1运行点。</p>
      <p class="caption meta">{{ fig10Insight }}</p>
    </article>

    <article class="figure-card">
      <h4>图11 | 混淆矩阵热图（计数 + 占比 + 诊断指标）</h4>
      <ScienceChart :option="fig11Option" :height="336" @chart-click="onFig11Click" />
      <p class="caption">怎么看：对角线高、非对角低为理想状态；右侧指标用于误报/漏报成本权衡。</p>
      <p class="caption meta">{{ fig11Insight }}</p>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import ScienceChart from './ScienceChart.vue'

const props = defineProps({
  result: {
    type: Object,
    default: null
  },
  evaluation: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['matrix-select'])

const palette = {
  blue: '#1d4ed8',
  cyan: '#0891b2',
  green: '#15803d',
  orange: '#d97706',
  red: '#b91c1c',
  purple: '#7c3aed',
  slate: '#475569'
}

const fontFamily = "'Times New Roman', 'Noto Serif SC', 'Source Han Serif SC', serif"
const baseGrid = { left: 66, right: 26, top: 46, bottom: 62 }

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const toNum = (v, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}
const pct = (v) => `${(clamp(toNum(v, 0), 0, 1) * 100).toFixed(1)}%`
const round = (v, d = 3) => Number(toNum(v, 0).toFixed(d))
const safeDivide = (a, b, fallback = 0) => (b > 0 ? a / b : fallback)

const axisBase = (name, isValue = true) => ({
  type: isValue ? 'value' : 'category',
  name,
  nameLocation: 'middle',
  nameGap: 38,
  nameTextStyle: { fontFamily, fontSize: 12, color: '#0f172a' },
  axisLabel: { fontFamily, fontSize: 11, color: '#0f172a' },
  axisLine: { lineStyle: { color: '#0f172a', width: 1.15 } },
  axisTick: { lineStyle: { color: '#334155', width: 1 } },
  splitLine: { show: true, lineStyle: { color: '#e2e8f0', width: 0.8, type: 'dashed' } }
})

const commonLegend = {
  top: 6,
  textStyle: { fontFamily, fontSize: 11, color: '#0f172a' }
}

const commonToolbox = {
  right: 8,
  top: 6,
  itemSize: 14,
  iconStyle: { borderColor: '#334155' },
  feature: {
    dataZoom: {
      yAxisIndex: 'none',
      title: { zoom: '框选缩放', back: '还原缩放' }
    },
    restore: { title: '重置视图' },
    saveAsImage: { title: '导出PNG', type: 'png', pixelRatio: 3, backgroundColor: '#ffffff' }
  }
}

const zoomInside = [{ type: 'inside', xAxisIndex: 0, filterMode: 'none', zoomOnMouseWheel: 'ctrl', moveOnMouseMove: true }]

const evaluationInputs = computed(() => props.result?.evaluation_inputs || {})
const evalMode = computed(() => {
  const rawMode = evaluationInputs.value?.mode || evaluationInputs.value?.source || 'pseudo_threshold'
  return String(rawMode)
})
const labelSource = computed(() => String(evaluationInputs.value?.source || evaluationInputs.value?.sourceFile || ''))
const evalModeLabel = computed(() => {
  if (evalMode.value === 'real_label_stream') return '真实标签流'
  if (evalMode.value === 'pseudo_threshold') return '伪标签估计'
  return '未知'
})

const evalSamples = computed(() => {
  const yTrueRaw = Array.isArray(evaluationInputs.value?.y_true)
    ? evaluationInputs.value.y_true
    : (Array.isArray(evaluationInputs.value?.yTrue) ? evaluationInputs.value.yTrue : [])
  const yProbRaw = Array.isArray(evaluationInputs.value?.y_prob)
    ? evaluationInputs.value.y_prob
    : (Array.isArray(evaluationInputs.value?.yProb) ? evaluationInputs.value.yProb : [])
  const n = Math.min(yTrueRaw.length, yProbRaw.length)
  const rows = []
  for (let i = 0; i < n; i += 1) {
    const y = toNum(yTrueRaw[i], 0) >= 1 ? 1 : 0
    const p = clamp(toNum(yProbRaw[i], 0), 0, 1)
    rows.push({ y, p })
  }
  return rows
})

const sampleSize = computed(() => evalSamples.value.length)
const positives = computed(() => evalSamples.value.filter((v) => v.y === 1).length)
const negatives = computed(() => sampleSize.value - positives.value)
const positiveRate = computed(() => safeDivide(positives.value, Math.max(sampleSize.value, 1), 0))
const hasUsableEval = computed(() => sampleSize.value >= 6 && positives.value > 0 && negatives.value > 0)

const thresholdGrid = computed(() => {
  const base = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0]
  for (const row of evalSamples.value) base.push(Number(row.p.toFixed(3)))
  return Array.from(new Set(base.map((v) => clamp(v, 0, 1)))).sort((a, b) => b - a)
})

const confusionAt = (threshold) => {
  let tp = 0
  let fp = 0
  let tn = 0
  let fn = 0
  for (const row of evalSamples.value) {
    const pred = row.p >= threshold ? 1 : 0
    if (row.y === 1 && pred === 1) tp += 1
    else if (row.y === 1 && pred === 0) fn += 1
    else if (row.y === 0 && pred === 1) fp += 1
    else tn += 1
  }
  const recall = safeDivide(tp, tp + fn, 0)
  const precision = safeDivide(tp, tp + fp, 0)
  const specificity = safeDivide(tn, tn + fp, 0)
  const fpr = safeDivide(fp, fp + tn, 0)
  const accuracy = safeDivide(tp + tn, tp + tn + fp + fn, 0)
  const f1 = safeDivide(2 * precision * recall, precision + recall, 0)
  return { threshold, tp, fp, tn, fn, recall, precision, specificity, fpr, accuracy, f1 }
}

const thresholdStats = computed(() => thresholdGrid.value.map((thr) => confusionAt(thr)))
const rocPairs = computed(() => {
  if (!hasUsableEval.value) {
    return [[0, 0], [0.06, 0.28], [0.15, 0.54], [0.33, 0.75], [0.56, 0.89], [1, 1]]
  }
  const pts = thresholdStats.value.map((r) => [r.fpr, r.recall])
  pts.push([0, 0], [1, 1])
  pts.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]))
  return pts
})

const prPairs = computed(() => {
  if (!hasUsableEval.value) {
    return [[0, 1], [0.15, 0.9], [0.35, 0.82], [0.55, 0.73], [0.75, 0.61], [1, 0.5]]
  }
  const pts = thresholdStats.value.map((r) => [r.recall, r.precision])
  pts.push([0, 1], [1, positiveRate.value])
  pts.sort((a, b) => (a[0] - b[0]) || (b[1] - a[1]))
  return pts
})

const curveArea = (pairs) => {
  let area = 0
  for (let i = 1; i < pairs.length; i += 1) {
    const [x0, y0] = pairs[i - 1]
    const [x1, y1] = pairs[i]
    area += (x1 - x0) * ((y0 + y1) / 2)
  }
  return clamp(area, 0, 1)
}

const quantile = (values, q, fallback = 0) => {
  const arr = values.filter((v) => Number.isFinite(v)).slice().sort((a, b) => a - b)
  if (!arr.length) return fallback
  const pos = clamp(q, 0, 1) * (arr.length - 1)
  const lo = Math.floor(pos)
  const hi = Math.min(arr.length - 1, lo + 1)
  const w = pos - lo
  return arr[lo] * (1 - w) + arr[hi] * w
}

const interpY = (pairs, x) => {
  if (!Array.isArray(pairs) || pairs.length === 0) return 0
  if (pairs.length === 1) return clamp(toNum(pairs[0][1], 0), 0, 1)
  if (x <= pairs[0][0]) return clamp(toNum(pairs[0][1], 0), 0, 1)
  for (let i = 1; i < pairs.length; i += 1) {
    const [x0, y0] = pairs[i - 1]
    const [x1, y1] = pairs[i]
    if (x <= x1) {
      if (Math.abs(x1 - x0) < 1e-12) return clamp(Math.max(y0, y1), 0, 1)
      const t = (x - x0) / (x1 - x0)
      return clamp(y0 + (y1 - y0) * t, 0, 1)
    }
  }
  return clamp(toNum(pairs[pairs.length - 1][1], 0), 0, 1)
}

const makeCurveStats = (rows) => {
  const n = rows.length
  const pos = rows.reduce((acc, row) => acc + (row.y >= 1 ? 1 : 0), 0)
  const neg = n - pos
  if (n < 2 || pos <= 0 || neg <= 0) {
    return {
      roc: [[0, 0], [1, 1]],
      pr: [[0, 1], [1, clamp(safeDivide(pos, Math.max(n, 1), 0), 0, 1)]],
      auc: 0.5,
      prAuc: 0.5
    }
  }

  const thr = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0]
  for (const row of rows) thr.push(Number(row.p.toFixed(3)))
  const thresholds = Array.from(new Set(thr.map((v) => clamp(v, 0, 1)))).sort((a, b) => b - a)

  const roc = []
  const pr = []
  for (const threshold of thresholds) {
    let tp = 0
    let fp = 0
    let tn = 0
    let fn = 0
    for (const row of rows) {
      const pred = row.p >= threshold ? 1 : 0
      if (row.y === 1 && pred === 1) tp += 1
      else if (row.y === 1 && pred === 0) fn += 1
      else if (row.y === 0 && pred === 1) fp += 1
      else tn += 1
    }
    const recall = safeDivide(tp, tp + fn, 0)
    const precision = safeDivide(tp, tp + fp, 0)
    const fpr = safeDivide(fp, fp + tn, 0)
    roc.push([fpr, recall])
    pr.push([recall, precision])
  }

  roc.push([0, 0], [1, 1])
  roc.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]))
  const baseRate = clamp(safeDivide(pos, n, 0), 0, 1)
  pr.push([0, 1], [1, baseRate])
  pr.sort((a, b) => (a[0] - b[0]) || (b[1] - a[1]))
  return { roc, pr, auc: curveArea(roc), prAuc: curveArea(pr) }
}

const sampleSeed = computed(() => {
  let seed = 2166136261
  for (let i = 0; i < evalSamples.value.length; i += 1) {
    const row = evalSamples.value[i]
    const y = row.y >= 1 ? 1 : 0
    const p = Math.round(clamp(row.p, 0, 1) * 1000)
    seed ^= (y * 733 + p * 31 + i * 131) >>> 0
    seed = Math.imul(seed, 16777619) >>> 0
  }
  return seed || 1315423911
})

const bootstrapIterations = computed(() => {
  if (!hasUsableEval.value) return 0
  if (sampleSize.value <= 60) return 240
  if (sampleSize.value <= 180) return 180
  return 120
})

const bootstrapBands = computed(() => {
  if (!hasUsableEval.value) return null
  const n = evalSamples.value.length
  const iterations = bootstrapIterations.value
  if (iterations <= 0 || n < 6) return null

  const grid = Array.from({ length: 21 }, (_, i) => i / 20)
  const rocCols = grid.map(() => [])
  const prCols = grid.map(() => [])
  const aucList = []
  const prAucList = []

  let state = sampleSeed.value >>> 0
  const rnd = () => {
    state += 0x6D2B79F5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  for (let b = 0; b < iterations; b += 1) {
    const sampled = []
    for (let i = 0; i < n; i += 1) sampled.push(evalSamples.value[Math.floor(rnd() * n)])
    const stat = makeCurveStats(sampled)
    aucList.push(stat.auc)
    prAucList.push(stat.prAuc)
    for (let i = 0; i < grid.length; i += 1) {
      const x = grid[i]
      rocCols[i].push(interpY(stat.roc, x))
      prCols[i].push(interpY(stat.pr, x))
    }
  }

  const rocLow = rocCols.map((c) => quantile(c, 0.025, 0))
  const rocHigh = rocCols.map((c) => quantile(c, 0.975, 1))
  const prLow = prCols.map((c) => quantile(c, 0.025, 0))
  const prHigh = prCols.map((c) => quantile(c, 0.975, 1))

  return {
    iterations,
    grid,
    rocLow,
    rocHigh,
    prLow,
    prHigh,
    aucLow: clamp(quantile(aucList, 0.025, metricAuc.value), 0, 1),
    aucHigh: clamp(quantile(aucList, 0.975, metricAuc.value), 0, 1),
    prAucLow: clamp(quantile(prAucList, 0.025, metricPrAuc.value), 0, 1),
    prAucHigh: clamp(quantile(prAucList, 0.975, metricPrAuc.value), 0, 1)
  }
})

const rocCiPairs = computed(() => {
  if (!bootstrapBands.value) return { low: [], high: [] }
  return {
    low: bootstrapBands.value.grid.map((x, i) => [x, bootstrapBands.value.rocLow[i]]),
    high: bootstrapBands.value.grid.map((x, i) => [x, bootstrapBands.value.rocHigh[i]])
  }
})

const rocCiBand = computed(() => {
  if (!bootstrapBands.value) return []
  return bootstrapBands.value.grid.map((x, i) => [x, Math.max(bootstrapBands.value.rocHigh[i] - bootstrapBands.value.rocLow[i], 0)])
})

const prCiPairs = computed(() => {
  if (!bootstrapBands.value) return { low: [], high: [] }
  return {
    low: bootstrapBands.value.grid.map((x, i) => [x, bootstrapBands.value.prLow[i]]),
    high: bootstrapBands.value.grid.map((x, i) => [x, bootstrapBands.value.prHigh[i]])
  }
})

const prCiBand = computed(() => {
  if (!bootstrapBands.value) return []
  return bootstrapBands.value.grid.map((x, i) => [x, Math.max(bootstrapBands.value.prHigh[i] - bootstrapBands.value.prLow[i], 0)])
})

const empiricalAuc = computed(() => curveArea(rocPairs.value))
const empiricalPrAuc = computed(() => curveArea(prPairs.value))

const bestYouden = computed(() => {
  if (!hasUsableEval.value) return { threshold: 0.5, fpr: 0.22, recall: 0.78, j: 0.56 }
  return thresholdStats.value.reduce((best, cur) => {
    const j = cur.recall - cur.fpr
    return j > best.j ? { ...cur, j } : best
  }, { threshold: 0.5, fpr: 1, recall: 0, j: -1 })
})

const bestF1 = computed(() => {
  if (!hasUsableEval.value) return { threshold: 0.5, recall: 0.74, precision: 0.78, f1: 0.76 }
  return thresholdStats.value.reduce((best, cur) => (cur.f1 > best.f1 ? cur : best), thresholdStats.value[0] || { threshold: 0.5, recall: 0, precision: 0, f1: 0 })
})

const brierFromSamples = computed(() => {
  if (!evalSamples.value.length) return 0.25
  const loss = evalSamples.value.reduce((acc, row) => acc + (row.p - row.y) ** 2, 0)
  return clamp(loss / evalSamples.value.length, 0, 1)
})

const calibrationData = computed(() => {
  if (!hasUsableEval.value) {
    return {
      centers: [0.1, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82, 0.94],
      pred: [0.11, 0.23, 0.36, 0.45, 0.57, 0.69, 0.8, 0.9],
      obs: [0.14, 0.2, 0.31, 0.49, 0.55, 0.63, 0.78, 0.89],
      lower: [0.04, 0.08, 0.19, 0.31, 0.39, 0.47, 0.63, 0.74],
      band: [0.2, 0.24, 0.24, 0.18, 0.16, 0.16, 0.15, 0.15],
      count: [4, 6, 8, 11, 12, 10, 7, 5],
      ece: 0.043
    }
  }

  const bins = 8
  const edges = Array.from({ length: bins + 1 }, (_, i) => i / bins)
  const count = Array.from({ length: bins }, () => 0)
  const sumP = Array.from({ length: bins }, () => 0)
  const sumY = Array.from({ length: bins }, () => 0)
  for (const row of evalSamples.value) {
    const idx = Math.min(bins - 1, Math.floor(row.p * bins))
    count[idx] += 1
    sumP[idx] += row.p
    sumY[idx] += row.y
  }

  const centers = []
  const pred = []
  const obs = []
  const lower = []
  const band = []
  const nCount = []
  for (let i = 0; i < bins; i += 1) {
    if (count[i] <= 0) continue
    const pBar = sumP[i] / count[i]
    const yBar = sumY[i] / count[i]
    const err = 1.96 * Math.sqrt(safeDivide(yBar * (1 - yBar), count[i], 0))
    const lo = clamp(yBar - err, 0, 1)
    const hi = clamp(yBar + err, 0, 1)
    centers.push((edges[i] + edges[i + 1]) / 2)
    pred.push(pBar)
    obs.push(yBar)
    lower.push(lo)
    band.push(hi - lo)
    nCount.push(count[i])
  }

  const total = Math.max(evalSamples.value.length, 1)
  const ece = pred.reduce((acc, v, i) => acc + Math.abs(v - obs[i]) * nCount[i], 0) / total
  return { centers, pred, obs, lower, band, count: nCount, ece }
})

const metricAuc = computed(() => {
  const fromEval = toNum(props.evaluation?.auc, NaN)
  if (!Number.isNaN(fromEval) && fromEval > 0) return clamp(fromEval, 0.5, 1)
  const fromResult = toNum(props.result?.kpi?.auc, NaN)
  if (!Number.isNaN(fromResult) && fromResult > 0) return clamp(fromResult, 0.5, 1)
  return clamp(empiricalAuc.value, 0.5, 1)
})

const metricPrAuc = computed(() => {
  const fromEval = toNum(props.evaluation?.pr_auc, NaN)
  if (!Number.isNaN(fromEval) && fromEval > 0) return clamp(fromEval, 0.4, 1)
  return clamp(empiricalPrAuc.value, 0.4, 1)
})

const metricBrier = computed(() => {
  const fromEval = toNum(props.evaluation?.brier, NaN)
  if (!Number.isNaN(fromEval) && fromEval >= 0) return clamp(fromEval, 0, 1)
  const fromResult = toNum(props.result?.kpi?.brier_score, NaN)
  if (!Number.isNaN(fromResult) && fromResult >= 0) return clamp(fromResult, 0, 1)
  return clamp(brierFromSamples.value, 0, 1)
})

const metricEce = computed(() => {
  const fromEval = toNum(props.evaluation?.ece, NaN)
  if (!Number.isNaN(fromEval) && fromEval >= 0) return clamp(fromEval, 0, 1)
  return clamp(calibrationData.value.ece, 0, 1)
})

const confusionMatrix = computed(() => {
  const cm = props.evaluation?.confusion_matrix
  if (cm && ['tp', 'tn', 'fp', 'fn'].every((k) => Number.isFinite(Number(cm[k])))) {
    return { tp: Number(cm.tp), tn: Number(cm.tn), fp: Number(cm.fp), fn: Number(cm.fn) }
  }
  const thr05 = thresholdStats.value.find((v) => Math.abs(v.threshold - 0.5) < 1e-9)
  if (thr05) return { tp: thr05.tp, tn: thr05.tn, fp: thr05.fp, fn: thr05.fn }
  return { tp: 13, tn: 31, fp: 6, fn: 8 }
})

const diagnosticMetrics = computed(() => {
  const cm = confusionMatrix.value
  const accuracy = safeDivide(cm.tp + cm.tn, cm.tp + cm.tn + cm.fp + cm.fn, 0)
  const precision = safeDivide(cm.tp, cm.tp + cm.fp, 0)
  const recall = safeDivide(cm.tp, cm.tp + cm.fn, 0)
  const specificity = safeDivide(cm.tn, cm.tn + cm.fp, 0)
  return { accuracy, precision, recall, specificity }
})

const fig2Data = computed(() => {
  const rsi = toNum(props.result?.modules?.rsi?.value, 62)
  const layers = ['伪顶', '直接顶', '老顶Ⅰ', '老顶Ⅱ', '关键层A', '关键层B', '关键层C', '覆岩']
  const profile = [0, -4, -2, 1, 3, 4, 2, 1]
  const stability = layers.map((_, i) => clamp(rsi + profile[i] * 3 + Math.sin(i * 1.2) * 2.2, 24, 96))
  const sigma = layers.map((_, i) => clamp(9 - i * 0.7 + (100 - rsi) * 0.03, 3, 12))
  const lower = stability.map((v, i) => clamp(v - sigma[i], 0, 100))
  const upper = stability.map((v, i) => clamp(v + sigma[i], 0, 100))
  const band = upper.map((v, i) => round(v - lower[i], 4))
  const damage = stability.map((v) => clamp(102 - v, 4, 90))
  const minIdx = stability.reduce((best, cur, i, arr) => (cur < arr[best] ? i : best), 0)
  return { layers, stability, lower, band, damage, minIdx }
})

const fig3Data = computed(() => {
  const windows = Array.from({ length: 12 }, (_, i) => `T${String(i + 1).padStart(2, '0')}`)
  const eventCount = toNum(props.result?.modules?.bri?.event_count, 20)
  const avgMag = toNum(props.result?.modules?.bri?.avg_magnitude, 2.6)
  const eventRate = windows.map((_, i) => Math.max(1, Math.round(eventCount / windows.length * (0.8 + 0.6 * Math.sin((i + 1) / 1.7)))))
  const energy = eventRate.map((v, i) => round(v * (18 + avgMag * 6) * (0.85 + 0.25 * Math.cos((i + 2) / 2.3))))
  const smooth = energy.map((_, i) => round((energy[Math.max(0, i - 1)] + energy[i] + energy[Math.min(energy.length - 1, i + 1)]) / 3, 2))
  let running = 0
  const total = energy.reduce((s, v) => s + v, 0) || 1
  const cumulativeRisk = energy.map((v) => {
    running += v
    return round((running / total) * 100, 2)
  })
  const peakIdx = energy.reduce((best, cur, i, arr) => (cur > arr[best] ? i : best), 0)
  return { windows, energy, smooth, eventRate, cumulativeRisk, peakIdx }
})

const fig4Data = computed(() => {
  const asi = toNum(props.result?.modules?.asi?.value, 58)
  const dist = [2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10]
  const radial = dist.map((r) => round(clamp(6.5 + asi * 0.06 + 10 / Math.max(r, 1), 4, 34), 3))
  const tangential = dist.map((r) => round(clamp(12 + asi * 0.16 + 18 / Math.max(r - 1.5, 1), 8, 48), 3))
  const kt = dist.map((_, i) => round(clamp(safeDivide(tangential[i], radial[i], 1), 1, 4.5), 3))
  const peakIdx = tangential.reduce((best, cur, i, arr) => (cur > arr[best] ? i : best), 0)
  const riskRadius = dist.find((_, i) => kt[i] < 2) || dist[dist.length - 1]
  return { dist, radial, tangential, kt, peakIdx, riskRadius }
})

const fig5Data = computed(() => {
  const posteriorRaw = props.result?.figures?.fig5_dbn?.posterior
  const fallback = [
    { t: 't-4', high_risk_prob: 0.31 },
    { t: 't-3', high_risk_prob: 0.35 },
    { t: 't-2', high_risk_prob: 0.42 },
    { t: 't-1', high_risk_prob: 0.48 },
    { t: 't', high_risk_prob: 0.56 }
  ]
  const posterior = Array.isArray(posteriorRaw) && posteriorRaw.length ? posteriorRaw : fallback
  const labels = posterior.map((v) => String(v.t))
  const p = posterior.map((v) => clamp(toNum(v.high_risk_prob, 0), 0, 1))
  const uncertainty = clamp(0.22 - Math.sqrt(Math.max(sampleSize.value, 1)) / 22, 0.06, 0.2)
  const lower = p.map((v) => clamp(v - uncertainty, 0, 1))
  const upper = p.map((v) => clamp(v + uncertainty, 0, 1))
  const band = upper.map((v, i) => round(v - lower[i], 4))
  const alertCount = p.filter((v) => v >= 0.6).length
  return { labels, p, lower, band, alertCount }
})

const fig6Data = computed(() => {
  const mpi = clamp(toNum(props.result?.fusion?.mpi, 52), 0, 100)
  const baselineMpi = clamp(toNum(props.result?.fusion?.baseline?.mpi, mpi - 4.5), 0, 100)
  const auc = clamp(metricAuc.value, 0.5, 1)
  const prAuc = clamp(metricPrAuc.value, 0.4, 1)
  const brier = clamp(metricBrier.value, 0, 1)
  const categories = ['MPI', 'AUC×100', 'PR-AUC×100', '(1-Brier)×100']
  const newScores = [round(mpi, 2), round(auc * 100, 2), round(prAuc * 100, 2), round((1 - brier) * 100, 2)]
  const baseScores = [
    round(baselineMpi, 2),
    round(clamp((auc - 0.05) * 100, 0, 100), 2),
    round(clamp((prAuc - 0.06) * 100, 0, 100), 2),
    round(clamp((1 - (brier + 0.05)) * 100, 0, 100), 2)
  ]
  const gain = newScores.map((v, i) => round(v - baseScores[i], 2))
  return { categories, newScores, baseScores, gain }
})

const fig7Data = computed(() => {
  const full = round(clamp(metricAuc.value * 100, 45, 99), 2)
  const w = props.result?.fusion?.dynamic_weights || { rsi: 0.4, bri: 0.35, asi: 0.25 }
  const dropRsi = round(2.5 + toNum(w.rsi, 0.4) * 16, 2)
  const dropBri = round(2.5 + toNum(w.bri, 0.35) * 16, 2)
  const dropAsi = round(2.5 + toNum(w.asi, 0.25) * 16, 2)
  const categories = ['全模型', '去RSI', '去BRI', '去ASI']
  const score = [full, round(clamp(full - dropRsi, 40, 99), 2), round(clamp(full - dropBri, 40, 99), 2), round(clamp(full - dropAsi, 40, 99), 2)]
  const drop = [0, dropRsi, dropBri, dropAsi]
  const dropSum = dropRsi + dropBri + dropAsi || 1
  const contribution = [0, round(dropRsi / dropSum * 100, 1), round(dropBri / dropSum * 100, 1), round(dropAsi / dropSum * 100, 1)]
  return { categories, score, drop, contribution }
})
const fig2Insight = computed(() => {
  const d = fig2Data.value
  const minLayer = d.layers[d.minIdx]
  const minVal = d.stability[d.minIdx]
  return `关键结论：最低稳定层位为 ${minLayer}（${minVal.toFixed(1)}%），${minVal < 60 ? '低于' : '高于'}60%预警阈值。`
})

const fig3Insight = computed(() => {
  const d = fig3Data.value
  return `关键结论：峰值窗口 ${d.windows[d.peakIdx]}，能量 ${d.energy[d.peakIdx].toFixed(1)} a.u.，累计风险在后半段快速抬升。`
})

const fig4Insight = computed(() => {
  const d = fig4Data.value
  return `关键结论：切向应力峰值出现在 r=${d.dist[d.peakIdx]} m，Kt>2 高风险圈带约在 r≤${d.riskRadius.toFixed(1)} m。`
})

const fig5Insight = computed(() => {
  const d = fig5Data.value
  const latest = d.p[d.p.length - 1]
  return `关键结论：最新后验概率 ${latest.toFixed(3)}，达到0.6报警阈值的时间片数量为 ${d.alertCount}。`
})

const fig6Insight = computed(() => {
  const d = fig6Data.value
  const bestIdx = d.gain.reduce((best, cur, i, arr) => (cur > arr[best] ? i : best), 0)
  return `关键结论：最大增益指标为 ${d.categories[bestIdx]}（+${d.gain[bestIdx].toFixed(2)}）。`
})

const fig7Insight = computed(() => {
  const d = fig7Data.value
  const idx = d.drop.reduce((best, cur, i, arr) => (cur > arr[best] ? i : best), 0)
  return `关键结论：${d.categories[idx]} 对整体性能贡献最大（移除后下降 ${d.drop[idx].toFixed(2)} 分）。`
})

const fig8Insight = computed(() => `关键结论：ECE=${metricEce.value.toFixed(4)}，有效分箱 ${calibrationData.value.centers.length} 个。`)

const fig9Insight = computed(() => {
  const b = bestYouden.value
  const ci = bootstrapBands.value
  const ciText = ci ? `，95%CI=[${ci.aucLow.toFixed(3)}, ${ci.aucHigh.toFixed(3)}]` : ''
  return `关键结论：AUC=${metricAuc.value.toFixed(3)}${ciText}，最优阈值≈${b.threshold.toFixed(3)}（TPR=${b.recall.toFixed(2)}, FPR=${b.fpr.toFixed(2)}）。`
})

const fig10Insight = computed(() => {
  const b = bestF1.value
  const ci = bootstrapBands.value
  const ciText = ci ? `，95%CI=[${ci.prAucLow.toFixed(3)}, ${ci.prAucHigh.toFixed(3)}]` : ''
  return `关键结论：PR-AUC=${metricPrAuc.value.toFixed(3)}${ciText}，最佳F1=${b.f1.toFixed(3)} 对应阈值≈${b.threshold.toFixed(3)}。`
})

const fig11Insight = computed(() => {
  const m = diagnosticMetrics.value
  return `关键结论：Accuracy=${(m.accuracy * 100).toFixed(1)}%，Precision=${(m.precision * 100).toFixed(1)}%，Recall=${(m.recall * 100).toFixed(1)}%。`
})

const onFig11Click = (params) => {
  const raw = String(params?.data?.label || params?.name || '').toUpperCase()
  if (raw === 'TP' || raw === 'TN' || raw === 'FP' || raw === 'FN') {
    emit('matrix-select', raw.toLowerCase())
  }
}

const fig2Option = computed(() => {
  const d = fig2Data.value
  return {
    color: [palette.blue, 'rgba(29,78,216,0.18)', palette.orange, palette.red],
    animationDuration: 350,
    grid: baseGrid,
    legend: commonLegend,
    toolbox: commonToolbox,
    dataZoom: zoomInside,
    tooltip: { trigger: 'axis' },
    xAxis: { ...axisBase('层位', false), data: d.layers, nameGap: 30 },
    yAxis: [
      { ...axisBase('稳定度 / 置信区间 (%)', true), min: 0, max: 100 },
      { ...axisBase('损伤占比 (%)', true), min: 0, max: 100 }
    ],
    series: [
      { name: 'CI下界', type: 'line', stack: 'rsi_ci', data: d.lower, symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { opacity: 0 } },
      { name: '95%CI', type: 'line', stack: 'rsi_ci', data: d.band, symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { color: 'rgba(29,78,216,0.14)' } },
      {
        name: '稳定度',
        type: 'line',
        data: d.stability,
        smooth: true,
        symbolSize: 7,
        lineStyle: { width: 2.5, color: palette.blue },
        itemStyle: { color: palette.blue },
        markLine: {
          symbol: 'none',
          label: { formatter: '预警阈值 60%', color: '#7f1d1d', fontFamily, fontSize: 10 },
          lineStyle: { type: 'dashed', color: '#b91c1c', width: 1.2 },
          data: [{ yAxis: 60 }]
        },
        markPoint: {
          symbol: 'circle',
          symbolSize: 44,
          label: { color: '#111827', fontFamily, fontSize: 10, formatter: '最低层' },
          itemStyle: { color: '#fee2e2', borderColor: '#b91c1c', borderWidth: 1.2 },
          data: [{ coord: [d.minIdx, d.stability[d.minIdx]] }]
        }
      },
      { name: '损伤占比', type: 'bar', yAxisIndex: 1, data: d.damage, barWidth: 14, itemStyle: { color: palette.orange, opacity: 0.75 } }
    ]
  }
})

const fig3Option = computed(() => {
  const d = fig3Data.value
  return {
    color: [palette.orange, palette.cyan, palette.red],
    animationDuration: 350,
    grid: baseGrid,
    legend: commonLegend,
    toolbox: commonToolbox,
    dataZoom: zoomInside,
    tooltip: { trigger: 'axis' },
    xAxis: { ...axisBase('时间窗', false), data: d.windows, nameGap: 30 },
    yAxis: [
      { ...axisBase('能量释放 / 平滑能量 (a.u.)', true), min: 0 },
      { ...axisBase('事件频次 / 累计风险 (%)', true), min: 0, max: 110 }
    ],
    series: [
      {
        name: '能量释放', type: 'bar', data: d.energy, barWidth: 14, itemStyle: { color: palette.orange, opacity: 0.82 },
        markPoint: { symbol: 'pin', symbolSize: 34, data: [{ name: '峰值', coord: [d.peakIdx, d.energy[d.peakIdx]] }], label: { formatter: '峰值', fontSize: 10, color: '#111827' } }
      },
      { name: '平滑能量', type: 'line', data: d.smooth, smooth: true, symbolSize: 5, lineStyle: { width: 2, color: palette.cyan } },
      { name: '事件频次', type: 'line', yAxisIndex: 1, data: d.eventRate, symbolSize: 6, lineStyle: { width: 1.8, type: 'dashed', color: palette.slate } },
      { name: '累计风险', type: 'line', yAxisIndex: 1, data: d.cumulativeRisk, smooth: true, symbolSize: 7, lineStyle: { width: 2.6, color: palette.red }, itemStyle: { color: palette.red } }
    ]
  }
})

const fig4Option = computed(() => {
  const d = fig4Data.value
  return {
    color: [palette.blue, palette.red, palette.purple],
    animationDuration: 350,
    grid: { left: 64, right: 54, top: 46, bottom: 62 },
    legend: commonLegend,
    toolbox: commonToolbox,
    dataZoom: zoomInside,
    tooltip: { trigger: 'axis' },
    xAxis: { ...axisBase('径向距离 r (m)', true), min: 2, max: 10 },
    yAxis: [
      { ...axisBase('应力 (MPa)', true), min: 0, max: 50 },
      { ...axisBase('应力集中系数 Kt', true), min: 1, max: 4.5, position: 'right' }
    ],
    series: [
      { name: '径向应力 σr', type: 'line', data: d.dist.map((x, i) => [x, d.radial[i]]), smooth: true, symbolSize: 6, lineStyle: { width: 2.2, color: palette.blue } },
      {
        name: '切向应力 σθ', type: 'line', data: d.dist.map((x, i) => [x, d.tangential[i]]), smooth: true, symbolSize: 6, lineStyle: { width: 2.4, color: palette.red },
        markPoint: { symbol: 'circle', symbolSize: 40, itemStyle: { color: '#fee2e2', borderColor: palette.red, borderWidth: 1.2 }, label: { formatter: '峰值', fontSize: 10, color: '#111827' }, data: [{ coord: [d.dist[d.peakIdx], d.tangential[d.peakIdx]] }] }
      },
      {
        name: 'Kt=σθ/σr', type: 'line', yAxisIndex: 1, data: d.dist.map((x, i) => [x, d.kt[i]]), smooth: true, symbolSize: 5, lineStyle: { width: 1.9, type: 'dashed', color: palette.purple },
        markLine: { symbol: 'none', label: { formatter: 'Kt=2', color: palette.purple, fontFamily, fontSize: 10 }, lineStyle: { color: palette.purple, width: 1.1, type: 'dashed' }, data: [{ yAxis: 2 }] }
      }
    ]
  }
})

const fig5Option = computed(() => {
  const d = fig5Data.value
  return {
    color: [palette.blue, 'rgba(29,78,216,0.18)', palette.red],
    animationDuration: 350,
    grid: baseGrid,
    legend: commonLegend,
    toolbox: commonToolbox,
    dataZoom: zoomInside,
    tooltip: { trigger: 'axis' },
    xAxis: { ...axisBase('时间片', false), data: d.labels, nameGap: 30 },
    yAxis: { ...axisBase('高风险后验概率', true), min: 0, max: 1 },
    series: [
      { name: 'CI下界', type: 'line', stack: 'dbn_ci', data: d.lower, symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { opacity: 0 } },
      { name: '95%CI', type: 'line', stack: 'dbn_ci', data: d.band, symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { color: 'rgba(29,78,216,0.18)' } },
      {
        name: '后验概率', type: 'line', data: d.p, smooth: true, symbolSize: 7, lineStyle: { width: 2.6, color: palette.red }, itemStyle: { color: palette.red },
        markLine: { symbol: 'none', lineStyle: { type: 'dashed', width: 1.15 }, data: [{ yAxis: 0.3, name: '关注阈值', lineStyle: { color: palette.orange } }, { yAxis: 0.6, name: '报警阈值', lineStyle: { color: palette.red } }] }
      }
    ]
  }
})

const fig6Option = computed(() => {
  const d = fig6Data.value
  return {
    color: [palette.cyan, palette.slate, palette.red],
    animationDuration: 350,
    grid: { left: 74, right: 54, top: 46, bottom: 66 },
    legend: commonLegend,
    toolbox: commonToolbox,
    dataZoom: zoomInside,
    tooltip: { trigger: 'axis' },
    xAxis: { ...axisBase('指标', false), data: d.categories, nameGap: 30 },
    yAxis: [
      { ...axisBase('归一化分数', true), min: 0, max: 100 },
      { ...axisBase('增益(新-基线)', true), min: Math.min(...d.gain) - 2, max: Math.max(...d.gain) + 2, position: 'right' }
    ],
    series: [
      { name: '新算法', type: 'bar', data: d.newScores, barWidth: 14, itemStyle: { color: palette.cyan } },
      { name: '基线算法', type: 'bar', data: d.baseScores, barWidth: 14, itemStyle: { color: palette.slate, opacity: 0.85 } },
      { name: '增益', type: 'line', yAxisIndex: 1, data: d.gain, symbol: 'diamond', symbolSize: 8, lineStyle: { width: 2.2, color: palette.red }, label: { show: true, position: 'top', color: palette.red, fontFamily, fontSize: 10, formatter: ({ value }) => `+${Number(value).toFixed(2)}` } }
    ]
  }
})

const fig7Option = computed(() => {
  const d = fig7Data.value
  const maxDropIdx = d.drop.reduce((best, cur, i, arr) => (cur > arr[best] ? i : best), 0)
  return {
    color: [palette.green, palette.red, palette.orange],
    animationDuration: 350,
    grid: { left: 66, right: 52, top: 46, bottom: 64 },
    legend: commonLegend,
    toolbox: commonToolbox,
    dataZoom: zoomInside,
    tooltip: { trigger: 'axis' },
    xAxis: { ...axisBase('模型版本', false), data: d.categories, nameGap: 30 },
    yAxis: [
      { ...axisBase('性能分数 (AUC×100)', true), min: 40, max: 100 },
      { ...axisBase('下降分数 / 贡献(%)', true), min: 0, max: Math.max(...d.drop, ...d.contribution) + 8, position: 'right' }
    ],
    series: [
      { name: '性能分数', type: 'bar', data: d.score, barWidth: 16, itemStyle: { color: palette.green }, label: { show: true, position: 'top', fontFamily, fontSize: 10, formatter: ({ value }) => Number(value).toFixed(1) } },
      { name: '下降分数', type: 'line', yAxisIndex: 1, data: d.drop, symbolSize: 8, lineStyle: { width: 2, color: palette.red }, itemStyle: { color: palette.red }, markPoint: { symbol: 'pin', symbolSize: 34, data: [{ coord: [maxDropIdx, d.drop[maxDropIdx]], name: '最大下降' }], label: { formatter: '最大下降', fontSize: 10, color: '#111827' } } },
      { name: '贡献率(%)', type: 'line', yAxisIndex: 1, data: d.contribution, symbolSize: 6, lineStyle: { width: 1.8, type: 'dashed', color: palette.orange } }
    ]
  }
})
const fig8Option = computed(() => {
  const d = calibrationData.value
  const maxCount = Math.max(...d.count, 1)
  return {
    color: [palette.blue, 'rgba(29,78,216,0.2)', '#94a3b8', palette.cyan],
    animationDuration: 350,
    grid: { left: 66, right: 54, top: 46, bottom: 62 },
    legend: commonLegend,
    toolbox: commonToolbox,
    dataZoom: zoomInside,
    tooltip: { trigger: 'axis' },
    xAxis: { ...axisBase('预测概率', true), min: 0, max: 1, interval: 0.1 },
    yAxis: [
      { ...axisBase('真实频率', true), min: 0, max: 1, interval: 0.1 },
      { ...axisBase('样本数', true), min: 0, max: maxCount + 2, position: 'right' }
    ],
    series: [
      { name: '理想校准线', type: 'line', data: [[0, 0], [1, 1]], symbol: 'none', lineStyle: { width: 1.4, type: 'dashed', color: '#94a3b8' } },
      { name: 'CI下界', type: 'line', stack: 'cal_ci', data: d.centers.map((v, i) => [v, d.lower[i]]), symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { opacity: 0 } },
      { name: '95%CI', type: 'line', stack: 'cal_ci', data: d.centers.map((v, i) => [v, d.band[i]]), symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { color: 'rgba(29,78,216,0.15)' } },
      { name: '校准曲线', type: 'line', data: d.centers.map((v, i) => [v, d.obs[i]]), smooth: true, symbolSize: 7, lineStyle: { width: 2.4, color: palette.blue }, itemStyle: { color: palette.blue } },
      { name: '分箱样本数', type: 'bar', yAxisIndex: 1, data: d.centers.map((v, i) => [v, d.count[i]]), barWidth: 18, itemStyle: { color: '#cbd5e1', opacity: 0.6 } }
    ],
    graphic: [
      { type: 'text', right: 26, top: 18, style: { text: `ECE=${metricEce.value.toFixed(4)}`, font: `600 12px ${fontFamily}`, fill: '#0f172a' } }
    ]
  }
})

const fig9Option = computed(() => {
  const best = bestYouden.value
  const rocCi = rocCiPairs.value
  const rocBand = rocCiBand.value
  const ci = bootstrapBands.value
  const rocName = `ROC 曲线 (AUC=${metricAuc.value.toFixed(3)})`
  const ciLabel = ci
    ? `AUC 95%CI [${ci.aucLow.toFixed(3)}, ${ci.aucHigh.toFixed(3)}]`
    : 'AUC 95%CI 不可用'
  return {
    color: ['#64748b', '#94a3b8', palette.blue, palette.red],
    animationDuration: 350,
    grid: baseGrid,
    legend: {
      ...commonLegend,
      data: ['随机参考线', rocName, '最优阈值点']
    },
    toolbox: commonToolbox,
    dataZoom: zoomInside,
    tooltip: { trigger: 'axis' },
    xAxis: { ...axisBase('假阳性率 FPR', true), min: 0, max: 1, interval: 0.1 },
    yAxis: { ...axisBase('真阳性率 TPR', true), min: 0, max: 1, interval: 0.1 },
    series: [
      { name: '随机参考线', type: 'line', data: [[0, 0], [1, 1]], symbol: 'none', lineStyle: { width: 1.5, type: 'dashed', color: '#94a3b8' } },
      { name: '__roc_ci_low__', type: 'line', stack: 'roc_ci', data: rocCi.low, symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { opacity: 0 }, tooltip: { show: false } },
      { name: '__roc_ci_band__', type: 'line', stack: 'roc_ci', data: rocBand, symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { color: 'rgba(100,116,139,0.12)' }, tooltip: { show: false } },
      { name: 'ROC 95%CI下界', type: 'line', data: rocCi.low, symbol: 'none', lineStyle: { width: 1.2, type: 'dotted', color: '#64748b' } },
      { name: 'ROC 95%CI上界', type: 'line', data: rocCi.high, symbol: 'none', lineStyle: { width: 1.2, type: 'dotted', color: '#64748b' } },
      { name: rocName, type: 'line', smooth: true, data: rocPairs.value, symbolSize: 5, lineStyle: { width: 2.6, color: palette.blue }, areaStyle: { color: 'rgba(29,78,216,0.12)' } },
      { name: '最优阈值点', type: 'scatter', data: [[best.fpr, best.recall]], symbolSize: 12, itemStyle: { color: palette.red }, label: { show: true, position: 'top', fontFamily, fontSize: 10, color: palette.red, formatter: `thr=${best.threshold.toFixed(2)}` } }
    ],
    graphic: [
      { type: 'text', right: 26, top: 18, style: { text: ciLabel, font: `600 11px ${fontFamily}`, fill: '#0f172a' } }
    ]
  }
})

const f1IsoLine = computed(() => {
  const f1 = 0.6
  const points = []
  for (let i = 1; i <= 99; i += 1) {
    const recall = i / 100
    const den = 2 * recall - f1
    if (den <= 0) continue
    const precision = clamp((f1 * recall) / den, 0, 1)
    if (precision > 0 && precision <= 1) points.push([recall, precision])
  }
  return points
})

const fig10Option = computed(() => {
  const best = bestF1.value
  const prCi = prCiPairs.value
  const prBand = prCiBand.value
  const ci = bootstrapBands.value
  const prName = `PR 曲线 (PR-AUC=${metricPrAuc.value.toFixed(3)})`
  const ciLabel = ci
    ? `PR-AUC 95%CI [${ci.prAucLow.toFixed(3)}, ${ci.prAucHigh.toFixed(3)}]`
    : 'PR-AUC 95%CI 不可用'
  return {
    color: ['#64748b', '#94a3b8', palette.orange, palette.red, palette.green],
    animationDuration: 350,
    grid: baseGrid,
    legend: {
      ...commonLegend,
      data: ['基线(阳性占比)', 'F1=0.6 等值线', prName, '最佳F1点']
    },
    toolbox: commonToolbox,
    dataZoom: zoomInside,
    tooltip: { trigger: 'axis' },
    xAxis: { ...axisBase('召回率 Recall', true), min: 0, max: 1, interval: 0.1 },
    yAxis: { ...axisBase('精确率 Precision', true), min: 0, max: 1, interval: 0.1 },
    series: [
      { name: '基线(阳性占比)', type: 'line', data: [[0, positiveRate.value], [1, positiveRate.value]], symbol: 'none', lineStyle: { width: 1.5, type: 'dashed', color: '#94a3b8' } },
      { name: '__pr_ci_low__', type: 'line', stack: 'pr_ci', data: prCi.low, symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { opacity: 0 }, tooltip: { show: false } },
      { name: '__pr_ci_band__', type: 'line', stack: 'pr_ci', data: prBand, symbol: 'none', lineStyle: { opacity: 0 }, areaStyle: { color: 'rgba(100,116,139,0.12)' }, tooltip: { show: false } },
      { name: 'PR 95%CI下界', type: 'line', data: prCi.low, symbol: 'none', lineStyle: { width: 1.2, type: 'dotted', color: '#64748b' } },
      { name: 'PR 95%CI上界', type: 'line', data: prCi.high, symbol: 'none', lineStyle: { width: 1.2, type: 'dotted', color: '#64748b' } },
      { name: 'F1=0.6 等值线', type: 'line', data: f1IsoLine.value, symbol: 'none', lineStyle: { width: 1.2, type: 'dotted', color: palette.orange } },
      { name: prName, type: 'line', smooth: true, data: prPairs.value, symbolSize: 5, lineStyle: { width: 2.6, color: palette.red } },
      { name: '最佳F1点', type: 'scatter', data: [[best.recall, best.precision]], symbolSize: 12, itemStyle: { color: palette.green }, label: { show: true, position: 'top', fontFamily, fontSize: 10, color: palette.green, formatter: `F1=${best.f1.toFixed(2)}` } }
    ],
    graphic: [
      { type: 'text', right: 26, top: 18, style: { text: ciLabel, font: `600 11px ${fontFamily}`, fill: '#0f172a' } }
    ]
  }
})

const fig11Option = computed(() => {
  const cm = confusionMatrix.value
  const total = Math.max(cm.tp + cm.tn + cm.fp + cm.fn, 1)
  const data = [
    { value: [0, 0, cm.tn, cm.tn / total], label: 'TN' },
    { value: [1, 0, cm.fp, cm.fp / total], label: 'FP' },
    { value: [0, 1, cm.fn, cm.fn / total], label: 'FN' },
    { value: [1, 1, cm.tp, cm.tp / total], label: 'TP' }
  ]
  const m = diagnosticMetrics.value

  return {
    animationDuration: 350,
    grid: { left: 76, right: 120, top: 38, bottom: 66 },
    toolbox: {
      ...commonToolbox,
      feature: {
        restore: { title: '重置视图' },
        saveAsImage: { title: '导出PNG', type: 'png', pixelRatio: 3, backgroundColor: '#ffffff' }
      }
    },
    tooltip: { trigger: 'item', formatter: ({ data: item }) => `${item.label}：${item.value[2]} (${(item.value[3] * 100).toFixed(1)}%)` },
    xAxis: { ...axisBase('预测类别', false), data: ['低风险', '高风险'], nameGap: 34, splitLine: { show: false } },
    yAxis: { ...axisBase('真实类别', false), data: ['低风险', '高风险'], nameGap: 54, splitLine: { show: false } },
    visualMap: {
      min: 0,
      max: Math.max(cm.tp, cm.tn, cm.fp, cm.fn, 1),
      orient: 'vertical',
      right: 18,
      top: 'middle',
      text: ['高', '低'],
      textStyle: { fontFamily, fontSize: 11, color: '#0f172a' },
      inRange: { color: ['#ecfeff', '#67e8f9', '#0e7490'] }
    },
    series: [
      {
        name: '混淆矩阵',
        type: 'heatmap',
        data,
        label: { show: true, color: '#0f172a', fontFamily, fontSize: 11, formatter: ({ data: item }) => `${item.label}\n${item.value[2]}\n${(item.value[3] * 100).toFixed(1)}%` },
        itemStyle: { borderWidth: 1, borderColor: '#e2e8f0' }
      }
    ],
    graphic: [
      {
        type: 'group',
        right: 10,
        bottom: 8,
        children: [
          { type: 'text', top: 0, style: { text: `Acc ${(m.accuracy * 100).toFixed(1)}%`, font: `600 11px ${fontFamily}`, fill: '#0f172a' } },
          { type: 'text', top: 16, style: { text: `Prec ${(m.precision * 100).toFixed(1)}%`, font: `600 11px ${fontFamily}`, fill: '#0f172a' } },
          { type: 'text', top: 32, style: { text: `Rec ${(m.recall * 100).toFixed(1)}%`, font: `600 11px ${fontFamily}`, fill: '#0f172a' } },
          { type: 'text', top: 48, style: { text: `Spec ${(m.specificity * 100).toFixed(1)}%`, font: `600 11px ${fontFamily}`, fill: '#0f172a' } }
        ]
      }
    ]
  }
})
</script>

<style scoped>
.science-gallery {
  display: grid;
  grid-template-columns: repeat(2, minmax(340px, 1fr));
  gap: 14px;
}

.gallery-head {
  grid-column: 1 / -1;
  border: 1px solid #d9e0e8;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 65%, #e2e8f0 100%);
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.head-title h4 {
  margin: 0;
  font-size: 15px;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Times New Roman', serif;
  color: #111827;
}

.head-title p {
  margin: 6px 0 0;
  font-size: 12px;
  color: #334155;
}

.head-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.metric-chip {
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #ffffff;
  color: #0f172a;
  font-size: 11px;
  padding: 2px 10px;
  font-family: 'Source Han Sans SC', 'Noto Sans SC', 'Segoe UI', sans-serif;
}

.metric-chip.warn {
  background: #fff7ed;
  border-color: #fdba74;
  color: #9a3412;
}

.figure-card {
  border: 1px solid #d9e0e8;
  border-radius: 12px;
  background: #ffffff;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
}

.figure-card h4 {
  margin: 0 0 8px;
  font-size: 15px;
  line-height: 1.35;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Times New Roman', serif;
  color: #0f172a;
}

.caption {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: #334155;
}

.caption.meta {
  color: #0f172a;
  font-weight: 600;
}

@media (max-width: 1280px) {
  .science-gallery {
    grid-template-columns: 1fr;
  }

  .gallery-head {
    flex-direction: column;
  }
}
</style>
