<template>
  <section class="evidence-wrap">
    <div class="controls">
      <p class="tip strong" v-if="evaluating">正在自动计算评估指标...</p>
      <p class="tip strong" v-else-if="evaluation">当前运行的评估指标已更新。</p>
      <p class="tip strong" v-else-if="result">未检测到标签流，无法生成完整评估指标。</p>
      <p class="tip" v-if="evalMessage">{{ evalMessage }}</p>
      <p class="tip" v-if="result?.errors?.length">运行告警：{{ result.errors.join('；') }}</p>
    </div>

    <PublicationFigureShell
      v-if="evaluation"
      id="evidence-metrics"
      class="evidence-shell"
      figure-label="表2"
      caption="表2 | 核心验证指标与混淆证据"
      :summary="evaluationSummary"
      :chips="evaluationChips"
      :note="evaluationFooter"
    >
      <div class="shell-topline">
        <span class="shell-badge">区分能力 + 校准质量</span>
        <span class="shell-badge subtle">{{ evaluationStatus }}</span>
      </div>

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

      <div class="detail-grid">
        <article class="detail-card primary">
          <span class="detail-label">关键结论</span>
          <p>{{ evaluationResult }}</p>
        </article>
        <article class="detail-card">
          <span class="detail-label">阅读提示</span>
          <p>AUC 和 F1 反映区分能力，Brier 与 ECE 反映概率质量；两类指标需要联合判断，不能用单一分数代替整体证据。</p>
        </article>
        <article class="detail-card full">
          <span class="detail-label">工程说明</span>
          <p>工程预警的关键不是单纯追求高召回，而是在可接受误报成本内维持稳定识别。混淆矩阵决定 false alarm 与 miss 的实际边界。</p>
        </article>
      </div>
    </PublicationFigureShell>

    <PublicationFigureShell
      v-if="result"
      class="evidence-shell"
      figure-label="证据摘要"
      caption="证据摘要 | 融合增益与部署信号"
      :summary="fusionSummary"
      :chips="fusionChips"
      :note="fusionFooter"
    >
      <div class="shell-topline">
        <span class="shell-badge">决策信号</span>
        <span class="shell-badge subtle">{{ deploymentStatus }}</span>
      </div>

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

      <div class="detail-grid">
        <article class="detail-card primary">
          <span class="detail-label">关键结论</span>
          <p>{{ fusionResult }}</p>
        </article>
        <article class="detail-card">
          <span class="detail-label">阅读提示</span>
          <p>该摘要块用于快速判断新算法是否带来净收益，以及输出风险等级是否与模型整体证据保持一致。</p>
        </article>
        <article class="detail-card full">
          <span class="detail-label">交叉参照</span>
          <p>消融、校准和 ROC/PR 证据已在期刊标准图组中展开，这里只保留部署决策最需要的结论信息。</p>
        </article>
      </div>
    </PublicationFigureShell>

    <div class="empty" v-if="!result">暂无证据数据，系统自动运行后将填充该区域。</div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import PublicationFigureShell from '../common/PublicationFigureShell.vue'

const props = defineProps({
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

const improvementRatio = computed(() => Number(props.result?.kpi?.improvement_vs_baseline_pct || 0) / 100)
const baselineMpi = computed(() => Number(props.result?.fusion?.baseline?.mpi || 0))
const fusionMpi = computed(() => Number(props.result?.fusion?.mpi || 0))
const mpiDelta = computed(() => fusionMpi.value - baselineMpi.value)

const evaluationChips = computed(() => ([
  `AUC ${num(props.evaluation?.auc, 3)}`,
  `PR-AUC ${num(props.evaluation?.pr_auc, 3)}`,
  `ECE ${num(props.evaluation?.ece, 3)}`
]))

const evaluationStatus = computed(() => {
  const auc = Number(props.evaluation?.auc)
  const ece = Number(props.evaluation?.ece)
  if (Number.isFinite(auc) && Number.isFinite(ece) && auc >= 0.85 && ece <= 0.08) return '校准质量较好'
  if (Number.isFinite(auc) && auc >= 0.75) return '可用但需谨慎'
  return '证据仍然偏弱'
})

const evaluationSummary = computed(() => '该表汇总当前验证运行的区分能力与校准能力证据，在固化任何报警阈值前都应结合混淆矩阵一并解读。')

const evaluationResult = computed(() => {
  if (!props.evaluation) return '当前暂无完整评估结果。'
  return `当前运行 AUC=${num(props.evaluation.auc, 3)}、F1=${num(props.evaluation.f1, 3)}、Brier=${num(props.evaluation.brier, 3)}、ECE=${num(props.evaluation.ece, 3)}，可以同时判断区分能力与概率可信度。`
})

const evaluationFooter = computed(() => {
  const cm = props.evaluation?.confusion_matrix || {}
  return `方法注：AUC ${num(props.evaluation?.auc, 4)}；PR-AUC ${num(props.evaluation?.pr_auc, 4)}；F1 ${num(props.evaluation?.f1, 4)}；TP ${cm.tp ?? 0} / FP ${cm.fp ?? 0} / FN ${cm.fn ?? 0} / TN ${cm.tn ?? 0}。`
})

const fusionChips = computed(() => ([
  `基线 ${num(baselineMpi.value, 3)}`,
  `融合 ${num(fusionMpi.value, 3)}`,
  `提升 ${pct(improvementRatio.value)}`
]))

const deploymentStatus = computed(() => {
  if (improvementRatio.value > 0.01) return '具备替换优势'
  if (improvementRatio.value < -0.01) return '建议保留基线'
  return '仅建议影子部署'
})

const fusionSummary = computed(() => '该摘要卡压缩展示当前验证运行的决策层证据，重点强调 MPI 净增益、部署准备度以及最终风险等级。')

const fusionResult = computed(() => {
  if (!props.result) return '当前暂无融合证据摘要。'
  return `新算法 MPI 为 ${num(fusionMpi.value, 3)}，相对基线 ${num(baselineMpi.value, 3)} 的净变化为 ${num(mpiDelta.value, 3)}；当前输出风险等级为 ${riskLabelZh(props.result?.fusion?.risk_label)}。`
})

const fusionFooter = computed(() => `方法注：基线 MPI ${num(baselineMpi.value, 3)}；融合 MPI ${num(fusionMpi.value, 3)}；净变化 ${num(mpiDelta.value, 3)}；相对提升 ${pct(improvementRatio.value)}。`)
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

.evidence-shell {
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
}

.shell-topline {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.shell-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #bae6fd;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.shell-badge.subtle {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
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
  .cm-grid,
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
