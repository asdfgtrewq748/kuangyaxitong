<template>
  <section class="kpi-wrapper">
    <div v-if="!result" class="empty">
      <h4>等待首次运行结果</h4>
      <p>系统会自动启动实证运行，完成后这里将展示总览指标与图1。</p>
    </div>

    <template v-else>
      <div class="kpi-grid">
        <article class="kpi-card" @click="$emit('jump', 'overview-fig1')">
          <span>MPI 均值</span>
          <strong>{{ formatNumber(result.kpi?.mpi_mean, 3) }}</strong>
          <small>综合风险主指标</small>
        </article>

        <article class="kpi-card" @click="$emit('jump', 'dbn-fig5')">
          <span><abbr title="高风险占比">高风险占比</abbr></span>
          <strong>{{ formatPct(result.kpi?.high_risk_ratio) }}</strong>
          <small>后验高风险比例</small>
        </article>

        <article class="kpi-card" @click="$emit('jump', 'evidence-metrics')">
          <span><abbr title="ROC 曲线下面积">AUC</abbr></span>
          <strong>{{ formatNumber(result.kpi?.auc, 4) }}</strong>
          <small>分类区分能力</small>
        </article>

        <article class="kpi-card" @click="$emit('jump', 'evidence-metrics')">
          <span><abbr title="概率质量误差">Brier</abbr></span>
          <strong>{{ formatNumber(result.kpi?.brier_score, 4) }}</strong>
          <small>概率校准质量</small>
        </article>
      </div>

      <div class="conclusion-card" :class="conclusion.className">
        <div>
          <p class="label">结论</p>
          <h4>{{ conclusion.text }}</h4>
        </div>
        <p>
          相对基线提升：
          <strong>{{ formatPct((result.kpi?.improvement_vs_baseline_pct || 0) / 100) }}</strong>
        </p>
      </div>

      <PublicationFigureShell
        id="overview-fig1"
        class="figure-shell"
        figure-label="图1"
        caption="图1 | 数据覆盖与质量总览"
        :summary="fig1Summary"
        :chips="fig1Chips"
        :note="fig1Footer"
      >
        <div class="figure-topline">
          <span class="figure-badge">覆盖审计</span>
          <span class="figure-badge subtle">{{ fig1Status }}</span>
          <button class="mini" type="button" @click="$emit('download-figure', 'fig1')">下载图1</button>
        </div>

        <div class="overview-grid">
          <div>
            <span>钻孔层样本</span>
            <strong>{{ overview.borehole_count ?? 0 }}</strong>
          </div>
          <div>
            <span>微震事件数</span>
            <strong>{{ overview.microseismic_count ?? 0 }}</strong>
          </div>
          <div>
            <span>标签样本数</span>
            <strong>{{ overview.label_samples ?? 0 }}</strong>
          </div>
          <div>
            <span>标签来源</span>
            <strong>{{ overview.label_source || '暂无' }}</strong>
          </div>
        </div>

        <div class="detail-grid">
          <article class="detail-card primary">
            <span class="detail-label">关键结论</span>
            <p>{{ fig1CoverageText }}</p>
          </article>
          <article class="detail-card">
            <span class="detail-label">阅读提示</span>
            <p>若覆盖稀疏或标签来源不明，后续 KPI 结论只能作为趋势参考，不能直接用于阈值固化。</p>
          </article>
          <article class="detail-card full">
            <span class="detail-label">工程说明</span>
            <p>图1是整套验证图的前置质量门槛，只有样本、事件和标签同时具备基本覆盖，后续 ROC、PR 与 DBN 预警才具备工程解释力。</p>
          </article>
        </div>
      </PublicationFigureShell>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import PublicationFigureShell from '../common/PublicationFigureShell.vue'

const props = defineProps({
  result: {
    type: Object,
    default: null
  }
})

defineEmits(['jump', 'download-figure'])

const overview = computed(() => props.result?.figures?.fig1_overview || {})

const conclusion = computed(() => {
  const pct = props.result?.kpi?.improvement_vs_baseline_pct
  if (pct === undefined || pct === null) {
    return { text: '暂无结论', className: 'neutral' }
  }
  if (pct > 1) {
    return { text: '新算法优于基线算法', className: 'better' }
  }
  if (pct < -1) {
    return { text: '新算法劣于基线算法', className: 'worse' }
  }
  return { text: '新算法与基线算法接近', className: 'neutral' }
})

const fig1Chips = computed(() => ([
  `钻孔 ${overview.value.borehole_count ?? 0}`,
  `微震 ${overview.value.microseismic_count ?? 0}`,
  `标签 ${overview.value.label_samples ?? 0}`
]))

const fig1Status = computed(() => {
  const labelSamples = Number(overview.value.label_samples || 0)
  if (labelSamples >= 30) return '标签支撑充足'
  if (labelSamples > 0) return '标签支撑有限'
  return '缺少标签支撑'
})

const fig1Summary = computed(() => {
  const source = overview.value.label_source || '未报告'
  return `该图报告完整验证流程背后的证据覆盖情况。在解读后续 KPI 之前，先集中展示钻孔层样本、微震事件和标签支撑。当前标签来源：${source}。`
})

const fig1CoverageText = computed(() => {
  const boreholes = Number(overview.value.borehole_count || 0)
  const microseismic = Number(overview.value.microseismic_count || 0)
  const labels = Number(overview.value.label_samples || 0)
  if (boreholes + microseismic + labels <= 0) return '当前尚未形成可解释的数据覆盖基线。'
  if (labels <= 0) return '输入数据已累计，但缺少标签支撑，后续验证图应按弱监督场景解读。'
  return `当前覆盖包含 ${boreholes} 个钻孔层样本、${microseismic} 个微震事件与 ${labels} 个标签样本，可支撑后续验证图的定量对比。`
})

const fig1Footer = computed(() => `方法注：标签来源 ${overview.value.label_source || '暂无'}；钻孔 ${overview.value.borehole_count ?? 0}；微震 ${overview.value.microseismic_count ?? 0}；标签 ${overview.value.label_samples ?? 0}。`)

const formatNumber = (value, digit = 2) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--'
  return Number(value).toFixed(digit)
}

const formatPct = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--'
  return `${(Number(value) * 100).toFixed(2)}%`
}
</script>

<style scoped>
.kpi-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty {
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 18px;
  color: #475569;
  background: #f8fafc;
}

.empty h4 {
  margin: 0 0 6px;
}

.empty p {
  margin: 0;
  font-size: 13px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  gap: 10px;
}

.kpi-card {
  border: 1px solid #dde3ea;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.kpi-card span {
  font-size: 12px;
  color: #475569;
}

.kpi-card strong {
  display: block;
  margin-top: 4px;
  font-size: 26px;
  color: #111827;
  font-family: 'Times New Roman', serif;
}

.kpi-card small {
  font-size: 11px;
  color: #6b7280;
}

.conclusion-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid #d5dbe3;
  background: #f9fafb;
}

.conclusion-card .label {
  margin: 0;
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.conclusion-card h4 {
  margin: 2px 0 0;
  font-size: 16px;
}

.conclusion-card p {
  margin: 0;
  font-size: 13px;
}

.conclusion-card.better {
  border-color: #86efac;
  background: #f0fdf4;
}

.conclusion-card.worse {
  border-color: #fca5a5;
  background: #fef2f2;
}

.figure-shell {
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
}

.figure-topline {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.figure-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #c7d2fe;
  background: #eef2ff;
  color: #3730a3;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.figure-badge.subtle {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.mini {
  border: 1px solid #6b7280;
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  font-weight: 600;
  font-size: 12px;
  padding: 6px 10px;
  cursor: pointer;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 8px;
}

.overview-grid > div {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  background: #fcfdff;
}

.overview-grid span {
  display: block;
  font-size: 12px;
  color: #64748b;
}

.overview-grid strong {
  font-size: 18px;
  color: #111827;
  font-family: 'Times New Roman', serif;
}

.detail-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.detail-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fcfdff;
}

.detail-card.primary {
  border-color: #bfdbfe;
  background: linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%);
}

.detail-card.full {
  grid-column: 1 / -1;
}

.detail-label {
  display: inline-flex;
  margin-bottom: 6px;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
}

.detail-card p {
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
  color: #374151;
}

@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }

  .overview-grid {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }
}

@media (max-width: 680px) {
  .kpi-grid,
  .overview-grid {
    grid-template-columns: 1fr;
  }

  .conclusion-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
