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

      <article id="overview-fig1" class="figure-card">
        <div class="figure-head">
          <h4>图1 | 数据覆盖与质量总览</h4>
          <button class="mini" type="button" @click="$emit('download-figure', 'fig1')">下载图1</button>
        </div>

        <div class="overview-grid">
          <div>
            <span>钻孔层样本</span>
            <strong>{{ result.figures?.fig1_overview?.borehole_count ?? 0 }}</strong>
          </div>
          <div>
            <span>微震事件数</span>
            <strong>{{ result.figures?.fig1_overview?.microseismic_count ?? 0 }}</strong>
          </div>
          <div>
            <span>标签样本数</span>
            <strong>{{ result.figures?.fig1_overview?.label_samples ?? 0 }}</strong>
          </div>
          <div>
            <span>标签来源</span>
            <strong>{{ result.figures?.fig1_overview?.label_source || '暂无' }}</strong>
          </div>
        </div>

        <p class="note"><strong>怎么看：</strong>若覆盖稀疏，后续 KPI 结论置信度会下降。</p>
        <p class="note"><strong>工程意义：</strong>数据质量是是否可用于工程决策的前置门槛。</p>
      </article>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: {
    type: Object,
    default: null
  }
})

defineEmits(['jump', 'download-figure'])

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

.figure-card {
  border: 1px solid #dde3ea;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.figure-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.figure-head h4 {
  margin: 0;
  font-size: 15px;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Times New Roman', serif;
}

.mini {
  border: 1px solid #9ca3af;
  border-radius: 8px;
  background: #f8fafc;
  color: #1f2937;
  font-size: 12px;
  padding: 6px 10px;
  cursor: pointer;
}

.overview-grid {
  margin-top: 10px;
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

.note {
  margin: 8px 0 0;
  font-size: 12px;
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

  .figure-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
