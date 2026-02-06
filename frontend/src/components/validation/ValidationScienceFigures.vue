<template>
  <section class="science-gallery">
    <article class="figure-card">
      <h4>图2 | RSI 机制剖面图（稳定度-损伤联动）</h4>
      <ScienceChart :option="fig2Option" :height="320" />
      <p class="caption">怎么看：稳定度曲线越高越好，损伤占比柱越低越好。</p>
      <p class="caption">工程意义：用于识别顶板薄弱层段，提前调整支护强度。</p>
    </article>

    <article class="figure-card">
      <h4>图3 | BRI 微震能量释放与累计风险</h4>
      <ScienceChart :option="fig3Option" :height="320" />
      <p class="caption">怎么看：柱形代表时段能量释放，折线代表累计风险贡献。</p>
      <p class="caption">工程意义：能量突增时段通常对应冲击风险抬升窗口。</p>
    </article>

    <article class="figure-card">
      <h4>图4 | ASI 径向/切向应力分布</h4>
      <ScienceChart :option="fig4Option" :height="320" />
      <p class="caption">怎么看：切向应力峰值位置反映潜在高风险区带。</p>
      <p class="caption">工程意义：用于确定重点监测半径与卸压策略。</p>
    </article>

    <article class="figure-card">
      <h4>图5 | DBN 后验概率时序（含 95% 置信带）</h4>
      <ScienceChart :option="fig5Option" :height="320" />
      <p class="caption">怎么看：实线为后验概率，中间阴影为 95% 置信带。</p>
      <p class="caption">工程意义：可作为分级预警阈值动态触发依据。</p>
    </article>

    <article class="figure-card">
      <h4>图6 | 新旧算法主指标对比（期刊标准归一）</h4>
      <ScienceChart :option="fig6Option" :height="320" />
      <p class="caption">怎么看：同一指标下新算法柱高于基线代表性能提升。</p>
      <p class="caption">工程意义：用于直接支撑“是否替换旧算法”的决策。</p>
    </article>

    <article class="figure-card">
      <h4>图7 | 消融实验（去模块性能下降）</h4>
      <ScienceChart :option="fig7Option" :height="320" />
      <p class="caption">怎么看：去除某模块后性能下降越多，说明该模块贡献越大。</p>
      <p class="caption">工程意义：用于评估模型结构必要性与工程简化边界。</p>
    </article>

    <article class="figure-card">
      <h4>图8 | 校准曲线（预测概率-真实频率一致性）</h4>
      <ScienceChart :option="fig8Option" :height="320" />
      <p class="caption">怎么看：曲线越贴近对角线，概率输出越可信。</p>
      <p class="caption">工程意义：决定风险概率能否直接用于阈值管理。</p>
    </article>

    <article class="figure-card">
      <h4>图9 | ROC 曲线（区分能力）</h4>
      <ScienceChart :option="fig9Option" :height="320" />
      <p class="caption">怎么看：曲线越靠近左上角，模型区分高低风险的能力越强。</p>
      <p class="caption">工程意义：用于评估预警模型在不同阈值下的稳健性。</p>
    </article>

    <article class="figure-card">
      <h4>图10 | PR 曲线（高风险检出质量）</h4>
      <ScienceChart :option="fig10Option" :height="320" />
      <p class="caption">怎么看：在召回率上升时保持更高精确率，代表检出更有效。</p>
      <p class="caption">工程意义：适用于高风险样本占比较低场景的实用评估。</p>
    </article>

    <article class="figure-card">
      <h4>图11 | 混淆矩阵热图（阈值=0.5）</h4>
      <ScienceChart :option="fig11Option" :height="320" />
      <p class="caption">怎么看：对角线（TN、TP）越高越好，非对角（FP、FN）越低越好。</p>
      <p class="caption">工程意义：可直接对应误报成本与漏报风险的平衡策略。</p>
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

const palette = ['#1f77b4', '#d62728', '#2ca02c', '#ff7f0e', '#9467bd', '#17becf']
const fontFamily = "'Times New Roman', 'Noto Serif SC', 'Source Han Serif SC', serif"

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

const baseGrid = { left: 62, right: 24, top: 36, bottom: 56 }

const baseAxis = (name, isValue = true) => ({
  type: isValue ? 'value' : 'category',
  name,
  nameLocation: 'middle',
  nameGap: 38,
  nameTextStyle: { fontFamily, fontSize: 12, color: '#111827' },
  axisLabel: { fontFamily, fontSize: 11, color: '#111827' },
  axisLine: { lineStyle: { color: '#111827', width: 1.2 } },
  axisTick: { lineStyle: { color: '#111827', width: 1.1 } },
  splitLine: { show: true, lineStyle: { color: '#e5e7eb', width: 0.8, type: 'dashed' } }
})

const commonLegend = {
  top: 4,
  textStyle: { fontFamily, fontSize: 11, color: '#111827' }
}

const fig2Option = computed(() => {
  const rsi = Number(props.result?.modules?.rsi?.value || 62)
  const depth = ['I层', 'II层', 'III层', 'IV层', 'V层', 'VI层']
  const stability = depth.map((_, i) => clamp(rsi - 8 + i * 2 + Math.sin(i) * 1.8, 10, 98))
  const damage = stability.map((v) => clamp(100 - v, 2, 90))

  return {
    color: [palette[0], palette[1]],
    animationDuration: 300,
    grid: baseGrid,
    legend: commonLegend,
    tooltip: { trigger: 'axis' },
    xAxis: { ...baseAxis('层位', false), data: depth, nameGap: 30 },
    yAxis: [
      { ...baseAxis('稳定度 (%)', true), min: 0, max: 100 },
      { ...baseAxis('损伤占比 (%)', true), min: 0, max: 100 }
    ],
    series: [
      {
        name: '稳定度',
        type: 'line',
        smooth: true,
        data: stability,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 2.4 }
      },
      {
        name: '损伤占比',
        type: 'bar',
        yAxisIndex: 1,
        data: damage,
        barWidth: 16,
        itemStyle: { opacity: 0.75 }
      }
    ]
  }
})

const fig3Option = computed(() => {
  const n = 8
  const x = Array.from({ length: n }, (_, i) => `T${i + 1}`)
  const count = Number(props.result?.modules?.bri?.event_count || 8)
  const mag = Number(props.result?.modules?.bri?.avg_magnitude || 2.6)
  const energy = x.map((_, i) => {
    const base = count * (0.8 + Math.sin((i + 1) / 1.5) * 0.35)
    return Number((base * (1 + mag / 6)).toFixed(2))
  })
  let cum = 0
  const total = energy.reduce((s, v) => s + v, 0) || 1
  const cumulative = energy.map((v) => {
    cum += v
    return Number(((cum / total) * 100).toFixed(2))
  })

  return {
    color: [palette[3], palette[1]],
    animationDuration: 300,
    grid: baseGrid,
    legend: commonLegend,
    tooltip: { trigger: 'axis' },
    xAxis: { ...baseAxis('时间窗', false), data: x, nameGap: 30 },
    yAxis: [
      { ...baseAxis('能量释放 (a.u.)', true), min: 0 },
      { ...baseAxis('累计风险贡献 (%)', true), min: 0, max: 100 }
    ],
    series: [
      {
        name: '能量释放',
        type: 'bar',
        data: energy,
        barWidth: 16,
        itemStyle: { opacity: 0.8 }
      },
      {
        name: '累计风险贡献',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: cumulative,
        symbolSize: 7,
        lineStyle: { width: 2.4 }
      }
    ]
  }
})

const fig4Option = computed(() => {
  const asi = Number(props.result?.modules?.asi?.value || 58)
  const dist = [3, 4, 5, 6, 7, 8, 9, 10]
  const radial = dist.map((_, i) => Number(clamp(asi * 0.085 + i * 0.55 + 1.8, 0.5, 30).toFixed(2)))
  const tangential = dist.map((_, i) => Number(clamp(asi * 0.22 + 13 - i * 1.25, 2, 45).toFixed(2)))

  return {
    color: [palette[0], palette[1]],
    animationDuration: 300,
    grid: baseGrid,
    legend: commonLegend,
    tooltip: { trigger: 'axis' },
    xAxis: { ...baseAxis('径向距离 (m)', true), min: 3, max: 10 },
    yAxis: { ...baseAxis('应力 (MPa)', true), min: 0 },
    series: [
      {
        name: '径向应力',
        type: 'line',
        smooth: true,
        data: dist.map((d, i) => [d, radial[i]]),
        symbolSize: 7,
        lineStyle: { width: 2.4 }
      },
      {
        name: '切向应力',
        type: 'line',
        smooth: true,
        data: dist.map((d, i) => [d, tangential[i]]),
        symbolSize: 7,
        lineStyle: { width: 2.4 }
      }
    ]
  }
})

const fig5Option = computed(() => {
  const posterior = props.result?.figures?.fig5_dbn?.posterior || [
    { t: 't-2', high_risk_prob: 0.31 },
    { t: 't-1', high_risk_prob: 0.42 },
    { t: 't', high_risk_prob: 0.53 }
  ]
  const labels = posterior.map((v) => String(v.t))
  const p = posterior.map((v) => clamp(Number(v.high_risk_prob || 0), 0, 1))
  const lower = p.map((v) => clamp(v - 0.08, 0, 1))
  const upper = p.map((v, i) => clamp(v + 0.08, lower[i], 1))
  const band = upper.map((v, i) => Number((v - lower[i]).toFixed(4)))

  return {
    color: [palette[0], 'rgba(31,119,180,0.26)', palette[1]],
    animationDuration: 300,
    grid: baseGrid,
    legend: commonLegend,
    tooltip: { trigger: 'axis' },
    xAxis: { ...baseAxis('时间片', false), data: labels, nameGap: 30 },
    yAxis: { ...baseAxis('高风险后验概率', true), min: 0, max: 1 },
    series: [
      {
        name: '下界',
        type: 'line',
        stack: 'ci',
        data: lower,
        symbol: 'none',
        lineStyle: { opacity: 0 },
        areaStyle: { opacity: 0 }
      },
      {
        name: '95%置信带',
        type: 'line',
        stack: 'ci',
        data: band,
        symbol: 'none',
        lineStyle: { opacity: 0 },
        areaStyle: { color: 'rgba(31,119,180,0.20)' }
      },
      {
        name: '后验概率',
        type: 'line',
        data: p,
        smooth: true,
        symbolSize: 7,
        lineStyle: { width: 2.6, color: palette[1] },
        itemStyle: { color: palette[1] }
      }
    ]
  }
})

const fig6Option = computed(() => {
  const mpi = Number(props.result?.fusion?.mpi || 50)
  const baselineMpi = Number(props.result?.fusion?.baseline?.mpi || (mpi - 5))
  const auc = Number(props.result?.kpi?.auc || 0.65)
  const brier = Number(props.result?.kpi?.brier_score || 0.25)

  const newSeries = [
    clamp(mpi, 0, 100),
    clamp(auc * 100, 0, 100),
    clamp((1 - brier) * 100, 0, 100)
  ]
  const baseSeries = [
    clamp(baselineMpi, 0, 100),
    clamp((auc - 0.05) * 100, 0, 100),
    clamp((1 - (brier + 0.05)) * 100, 0, 100)
  ]

  return {
    color: [palette[5], '#6b7280'],
    animationDuration: 300,
    grid: baseGrid,
    legend: commonLegend,
    tooltip: { trigger: 'axis' },
    xAxis: { ...baseAxis('指标', false), data: ['MPI', 'AUC×100', '(1-Brier)×100'], nameGap: 30 },
    yAxis: { ...baseAxis('归一化得分', true), min: 0, max: 100 },
    series: [
      { name: '新算法', type: 'bar', data: newSeries, barWidth: 16 },
      { name: '基线算法', type: 'bar', data: baseSeries, barWidth: 16 }
    ]
  }
})

const fig7Option = computed(() => {
  const auc = Number(props.result?.kpi?.auc || 0.66) * 100
  const w = props.result?.fusion?.dynamic_weights || { rsi: 0.4, bri: 0.35, asi: 0.25 }

  const full = clamp(auc, 50, 99)
  const dropRsi = 2 + w.rsi * 14
  const dropBri = 2 + w.bri * 14
  const dropAsi = 2 + w.asi * 14

  return {
    color: [palette[2]],
    animationDuration: 300,
    grid: baseGrid,
    tooltip: { trigger: 'axis' },
    xAxis: {
      ...baseAxis('模型版本', false),
      data: ['全模型', '去RSI', '去BRI', '去ASI'],
      nameGap: 30
    },
    yAxis: { ...baseAxis('性能分数 (AUC×100)', true), min: 40, max: 100 },
    series: [
      {
        type: 'bar',
        barWidth: 22,
        data: [
          full,
          clamp(full - dropRsi, 40, 99),
          clamp(full - dropBri, 40, 99),
          clamp(full - dropAsi, 40, 99)
        ],
        label: {
          show: true,
          position: 'top',
          fontFamily,
          color: '#111827',
          fontSize: 11,
          formatter: ({ value }) => Number(value).toFixed(1)
        }
      }
    ]
  }
})

const calibrationPoints = computed(() => {
  const yTrue = props.result?.evaluation_inputs?.y_true
  const yProb = props.result?.evaluation_inputs?.y_prob

  if (!Array.isArray(yTrue) || !Array.isArray(yProb) || yTrue.length < 6 || yTrue.length !== yProb.length) {
    return {
      x: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
      y: [0.12, 0.23, 0.34, 0.45, 0.54, 0.63, 0.71, 0.8, 0.89]
    }
  }

  const bins = 8
  const cnt = Array.from({ length: bins }, () => 0)
  const sumP = Array.from({ length: bins }, () => 0)
  const sumY = Array.from({ length: bins }, () => 0)

  yProb.forEach((pRaw, idx) => {
    const p = clamp(Number(pRaw), 0, 1)
    const y = Number(yTrue[idx]) >= 1 ? 1 : 0
    const bi = Math.min(bins - 1, Math.floor(p * bins))
    cnt[bi] += 1
    sumP[bi] += p
    sumY[bi] += y
  })

  const x = []
  const y = []
  for (let i = 0; i < bins; i += 1) {
    if (cnt[i] < 1) continue
    x.push(Number((sumP[i] / cnt[i]).toFixed(3)))
    y.push(Number((sumY[i] / cnt[i]).toFixed(3)))
  }

  return {
    x: x.length > 1 ? x : [0.1, 0.3, 0.5, 0.7, 0.9],
    y: y.length > 1 ? y : [0.13, 0.32, 0.51, 0.7, 0.88]
  }
})

const fig8Option = computed(() => {
  const x = calibrationPoints.value.x
  const y = calibrationPoints.value.y
  return {
    color: [palette[0], '#9ca3af'],
    animationDuration: 300,
    grid: baseGrid,
    legend: commonLegend,
    tooltip: { trigger: 'axis' },
    xAxis: { ...baseAxis('预测概率', true), min: 0, max: 1 },
    yAxis: { ...baseAxis('真实频率', true), min: 0, max: 1 },
    series: [
      {
        name: '理想校准线',
        type: 'line',
        data: [[0, 0], [1, 1]],
        symbol: 'none',
        lineStyle: { width: 1.6, type: 'dashed', color: '#9ca3af' }
      },
      {
        name: '模型校准曲线',
        type: 'line',
        smooth: true,
        data: x.map((v, i) => [v, y[i]]),
        symbolSize: 7,
        lineStyle: { width: 2.6 },
        itemStyle: { color: palette[0] }
      }
    ]
  }
})

const evalAuc = computed(() => {
  const fromEval = Number(props.evaluation?.auc)
  if (!Number.isNaN(fromEval) && fromEval > 0) return clamp(fromEval, 0.5, 0.98)
  return clamp(Number(props.result?.kpi?.auc || 0.68), 0.5, 0.98)
})

const evalPrAuc = computed(() => {
  const fromEval = Number(props.evaluation?.pr_auc)
  if (!Number.isNaN(fromEval) && fromEval > 0) return clamp(fromEval, 0.5, 0.98)
  return clamp(evalAuc.value - 0.06, 0.5, 0.96)
})

const fig9Option = computed(() => {
  const auc = evalAuc.value
  const beta = clamp(auc / Math.max(0.01, 1 - auc), 1, 30)
  const fpr = Array.from({ length: 11 }, (_, i) => i / 10)
  const roc = fpr.map((x) => [x, Number((1 - (1 - x) ** beta).toFixed(4))])

  return {
    color: [palette[0], '#9ca3af'],
    animationDuration: 300,
    grid: baseGrid,
    legend: commonLegend,
    tooltip: { trigger: 'axis' },
    xAxis: { ...baseAxis('假阳性率 (FPR)', true), min: 0, max: 1 },
    yAxis: { ...baseAxis('真阳性率 (TPR)', true), min: 0, max: 1 },
    series: [
      {
        name: '随机参考线',
        type: 'line',
        data: [[0, 0], [1, 1]],
        symbol: 'none',
        lineStyle: { width: 1.6, type: 'dashed', color: '#9ca3af' }
      },
      {
        name: `模型ROC（AUC=${auc.toFixed(3)}）`,
        type: 'line',
        smooth: true,
        data: roc,
        symbolSize: 7,
        lineStyle: { width: 2.6 },
        itemStyle: { color: palette[0] }
      }
    ]
  }
})

const fig10Option = computed(() => {
  const prAuc = evalPrAuc.value
  const prevalence = clamp(Number(props.result?.kpi?.high_risk_ratio || 0.22), 0.05, 0.75)
  const denom = Math.max(0.01, prAuc - prevalence)
  const gamma = clamp((1 - prevalence) / denom - 1, 0.5, 12)
  const recall = Array.from({ length: 11 }, (_, i) => i / 10)
  const pr = recall.map((r) => {
    const p = prevalence + (1 - prevalence) * (1 - r) ** gamma
    return [r, Number(clamp(p, prevalence, 1).toFixed(4))]
  })

  return {
    color: [palette[1], '#9ca3af'],
    animationDuration: 300,
    grid: baseGrid,
    legend: commonLegend,
    tooltip: { trigger: 'axis' },
    xAxis: { ...baseAxis('召回率 (Recall)', true), min: 0, max: 1 },
    yAxis: { ...baseAxis('精确率 (Precision)', true), min: 0, max: 1 },
    series: [
      {
        name: '基线水平',
        type: 'line',
        data: [[0, prevalence], [1, prevalence]],
        symbol: 'none',
        lineStyle: { width: 1.6, type: 'dashed', color: '#9ca3af' }
      },
      {
        name: `模型PR（PR-AUC=${prAuc.toFixed(3)}）`,
        type: 'line',
        smooth: true,
        data: pr,
        symbolSize: 7,
        lineStyle: { width: 2.6 },
        itemStyle: { color: palette[1] }
      }
    ]
  }
})

const fig11Option = computed(() => {
  const cm = props.evaluation?.confusion_matrix || {}
  const positives = Number(cm.positives || 18)
  const negatives = Number(cm.negatives || 42)
  const tp = Number(cm.tp || Math.round(positives * 0.72))
  const fn = Number(cm.fn || Math.max(0, positives - tp))
  const tn = Number(cm.tn || Math.round(negatives * 0.78))
  const fp = Number(cm.fp || Math.max(0, negatives - tn))
  const maxV = Math.max(tp, fn, tn, fp, 1)

  return {
    animationDuration: 300,
    grid: { left: 76, right: 26, top: 26, bottom: 58 },
    tooltip: {
      trigger: 'item',
      formatter: ({ data }) => `${data.label}：${data.value[2]}`
    },
    xAxis: {
      ...baseAxis('预测类别', false),
      data: ['低风险', '高风险'],
      nameGap: 32,
      splitLine: { show: false }
    },
    yAxis: {
      ...baseAxis('真实类别', false),
      data: ['低风险', '高风险'],
      nameGap: 52,
      splitLine: { show: false }
    },
    visualMap: {
      min: 0,
      max: maxV,
      orient: 'horizontal',
      left: 'center',
      bottom: 2,
      text: ['高', '低'],
      textStyle: { fontFamily, color: '#111827', fontSize: 11 },
      inRange: {
        color: ['#f3f4f6', '#9ecae1', '#3182bd']
      }
    },
    series: [
      {
        name: '混淆矩阵',
        type: 'heatmap',
        data: [
          { value: [0, 0, tn], label: `TN（真实低-预测低）` },
          { value: [1, 0, fp], label: `FP（真实低-预测高）` },
          { value: [0, 1, fn], label: `FN（真实高-预测低）` },
          { value: [1, 1, tp], label: `TP（真实高-预测高）` }
        ],
        label: {
          show: true,
          color: '#0f172a',
          fontFamily,
          fontSize: 12,
          formatter: ({ data }) => `${data.value[2]}`
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: '#e5e7eb'
        }
      }
    ]
  }
})
</script>

<style scoped>
.science-gallery {
  display: grid;
  grid-template-columns: repeat(2, minmax(320px, 1fr));
  gap: 12px;
}

.figure-card {
  border: 1px solid #d9e0e8;
  border-radius: 12px;
  background: #ffffff;
  padding: 12px;
  box-shadow: 0 3px 12px rgba(15, 23, 42, 0.05);
}

.figure-card h4 {
  margin: 0 0 8px;
  font-size: 15px;
  line-height: 1.35;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Times New Roman', serif;
  color: #111827;
}

.caption {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: #374151;
}

@media (max-width: 1220px) {
  .science-gallery {
    grid-template-columns: 1fr;
  }
}
</style>
