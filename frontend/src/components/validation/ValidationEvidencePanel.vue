<template>
  <section class="evidence-wrap">
    <div class="controls">
      <p class="tip strong" v-if="evaluating">正在自动计算评估指标...</p>
      <p class="tip strong" v-else-if="evaluation">当前运行的评估指标已更新。</p>
      <p class="tip strong" v-else-if="result">未检测到标签流，无法生成完整评估指标。</p>
      <p class="tip" v-if="evalMessage">{{ evalMessage }}</p>
      <p class="tip" v-if="result?.errors?.length">运行告警：{{ result.errors.join('；') }}</p>
    </div>

    <article id="evidence-metrics" class="card" v-if="evaluation">
      <h4>表2 | 主评估指标</h4>
      <div class="metric-grid">
        <div><span>AUC</span><strong>{{ num(evaluation.auc, 4) }}</strong></div>
        <div><span>PR-AUC</span><strong>{{ num(evaluation.pr_auc, 4) }}</strong></div>
        <div><span>F1</span><strong>{{ num(evaluation.f1, 4) }}</strong></div>
        <div><span>Brier</span><strong>{{ num(evaluation.brier, 4) }}</strong></div>
        <div><span>ECE</span><strong>{{ num(evaluation.ece, 4) }}</strong></div>
      </div>

      <div class="cm-grid">
        <div><span>TP</span><strong>{{ evaluation.confusion_matrix?.tp ?? 0 }}</strong></div>
        <div><span>FP</span><strong>{{ evaluation.confusion_matrix?.fp ?? 0 }}</strong></div>
        <div><span>FN</span><strong>{{ evaluation.confusion_matrix?.fn ?? 0 }}</strong></div>
        <div><span>TN</span><strong>{{ evaluation.confusion_matrix?.tn ?? 0 }}</strong></div>
      </div>

      <p class="note"><strong>怎么看：</strong>AUC/F1 反映区分能力，Brier/ECE 反映概率质量。</p>
      <p class="note"><strong>工程意义：</strong>在保证召回率的同时控制误报，是预警系统可用性的核心。</p>
    </article>

    <article class="card" v-if="result">
      <h4>证据摘要</h4>
      <div class="summary-grid">
        <div>
          <span>基线 MPI</span>
          <strong>{{ num(result.fusion?.baseline?.mpi, 3) }}</strong>
        </div>
        <div>
          <span>新算法 MPI</span>
          <strong>{{ num(result.fusion?.mpi, 3) }}</strong>
        </div>
        <div>
          <span>风险等级</span>
          <strong>{{ riskLabelZh(result.fusion?.risk_label) }}</strong>
        </div>
        <div>
          <span>相对提升</span>
          <strong>{{ pct((result.kpi?.improvement_vs_baseline_pct || 0) / 100) }}</strong>
        </div>
      </div>
      <p class="note">消融细节与校准图已在“期刊标准图组”中展示。</p>
    </article>

    <div class="empty" v-if="!result">暂无证据数据，系统自动运行后将填充该区域。</div>
  </section>
</template>

<script setup>
defineProps({
  result: {
    type: Object,
    default: null
  },
  evaluation: {
    type: Object,
    default: null
  },
  evaluating: {
    type: Boolean,
    default: false
  },
  evalMessage: {
    type: String,
    default: ''
  }
})

const num = (value, digit = 3) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return '--'
  return Number(value).toFixed(digit)
}

const pct = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return '--'
  return `${(Number(value) * 100).toFixed(2)}%`
}

const riskLabelZh = (label) => {
  if (!label) return '暂无'
  const normalized = String(label).toLowerCase()
  if (normalized.includes('high') || normalized.includes('高')) return '高风险'
  if (normalized.includes('medium') || normalized.includes('中')) return '中风险'
  if (normalized.includes('low') || normalized.includes('低')) return '低风险'
  return String(label)
}
</script>

<style scoped>
.evidence-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.controls {
  border: 1px solid #dde3ea;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.tip {
  margin: 4px 0 0;
  font-size: 12px;
  color: #4b5563;
}

.tip.strong {
  margin-top: 0;
  color: #1f2937;
  font-weight: 600;
}

.card {
  border: 1px solid #dde3ea;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.card h4 {
  margin: 0 0 10px;
  font-size: 15px;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Times New Roman', serif;
}

.metric-grid,
.summary-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(100px, 1fr));
  gap: 8px;
}

.summary-grid {
  grid-template-columns: repeat(4, minmax(120px, 1fr));
}

.metric-grid > div,
.summary-grid > div,
.cm-grid > div {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px;
  background: #fcfdff;
}

.metric-grid span,
.summary-grid span,
.cm-grid span {
  display: block;
  font-size: 12px;
  color: #64748b;
}

.metric-grid strong,
.summary-grid strong,
.cm-grid strong {
  font-size: 18px;
  color: #111827;
  font-family: 'Times New Roman', serif;
}

.cm-grid {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(4, minmax(90px, 1fr));
  gap: 8px;
}

.note {
  margin: 8px 0 0;
  font-size: 12px;
  color: #374151;
}

.empty {
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 16px;
  font-size: 13px;
  color: #475569;
}

@media (max-width: 1100px) {
  .metric-grid {
    grid-template-columns: repeat(2, minmax(110px, 1fr));
  }

  .summary-grid,
  .cm-grid {
    grid-template-columns: repeat(2, minmax(110px, 1fr));
  }
}

@media (max-width: 680px) {
  .metric-grid,
  .summary-grid,
  .cm-grid {
    grid-template-columns: 1fr;
  }
}
</style>
