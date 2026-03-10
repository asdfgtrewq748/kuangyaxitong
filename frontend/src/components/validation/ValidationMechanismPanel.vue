<template>
  <section class="mechanism-wrap">
    <div v-if="!result" class="empty">机制结果正在自动生成，稍后将展示 RSI/BRI/ASI 结果。</div>

    <template v-else>
      <div class="module-grid">
        <article class="module-card">
          <h4>RSI 模块</h4>
          <p><span>输出值：</span>{{ fmt(result.modules?.rsi?.value) }}</p>
          <p><span>输入层数：</span>{{ result.modules?.rsi?.input_layers ?? 0 }}</p>
          <p><span>作用：</span>顶板稳定性推断。</p>
          <button class="mini" type="button" @click="$emit('download-module', 'rsi')">下载原始数据</button>
        </article>

        <article class="module-card">
          <h4>BRI 模块</h4>
          <p><span>输出值：</span>{{ fmt(result.modules?.bri?.value) }}</p>
          <p><span>事件数：</span>{{ result.modules?.bri?.event_count ?? 0 }}</p>
          <p><span>平均震级：</span>{{ fmt(result.modules?.bri?.avg_magnitude) }}</p>
          <button class="mini" type="button" @click="$emit('download-module', 'bri')">下载原始数据</button>
        </article>

        <article class="module-card">
          <h4>ASI 模块</h4>
          <p><span>输出值：</span>{{ fmt(result.modules?.asi?.value) }}</p>
          <p><span>平均内摩擦角：</span>{{ fmt(result.modules?.asi?.avg_friction_angle) }}</p>
          <p><span>作用：</span>支承应力强度评估。</p>
          <button class="mini" type="button" @click="$emit('download-module', 'asi')">下载原始数据</button>
        </article>
      </div>

      <PublicationFigureShell
        id="mechanism-fig6"
        class="figure-shell"
        figure-label="图6"
        caption="图6 | 融合模型对比传统基线"
        :summary="figureSummary"
        :chips="figureChips"
        :note="figureFooter"
      >
        <div class="figure-topline">
          <span class="figure-badge">融合对比</span>
          <span class="figure-badge subtle">{{ replacementReadiness }}</span>
          <button class="mini" type="button" @click="$emit('download-figure', 'fig6')">下载图6</button>
        </div>

        <div class="bars">
          <div class="bar-row">
            <span>基线算法</span>
            <div class="track"><div class="fill old" :style="{ width: widthOf(result.fusion?.baseline?.mpi) }"></div></div>
            <strong>{{ fmt(result.fusion?.baseline?.mpi) }}</strong>
          </div>
          <div class="bar-row">
            <span>新算法</span>
            <div class="track"><div class="fill new" :style="{ width: widthOf(result.fusion?.mpi) }"></div></div>
            <strong>{{ fmt(result.fusion?.mpi) }}</strong>
          </div>
        </div>

        <div class="detail-grid">
          <article class="detail-card primary">
            <span class="detail-label">关键结论</span>
            <p>{{ deltaText }}</p>
          </article>
          <article class="detail-card">
            <span class="detail-label">阅读提示</span>
            <p>比较两根柱高即可判断 MPI 净增益；若新算法在不同工况下持续高于基线，替换决策才具备稳定性。</p>
          </article>
          <article class="detail-card full">
            <span class="detail-label">工程说明</span>
            <p>该图用于回答“融合策略是否值得替换旧流程”。如果净增益长期为正，可进入试运行替换；若增益接近零，应继续保留双轨评估。</p>
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

defineEmits(['download-module', 'download-figure'])

const baselineMpi = computed(() => Number(props.result?.fusion?.baseline?.mpi || 0))
const fusionMpi = computed(() => Number(props.result?.fusion?.mpi || 0))
const mpiDelta = computed(() => fusionMpi.value - baselineMpi.value)
const pctDelta = computed(() => Number(props.result?.kpi?.improvement_vs_baseline_pct || 0))

const figureSummary = computed(() => '该图对比最终融合得分与传统基线流程，用于判断替换现有流程是否带来可测量的验证增益，而不是表面上的数值波动。')

const figureChips = computed(() => ([
  `基线 ${fmt(baselineMpi.value)}`,
  `融合 ${fmt(fusionMpi.value)}`,
  `净变化 ${fmt(mpiDelta.value)}`
]))

const replacementReadiness = computed(() => {
  if (mpiDelta.value > 1) return '具备替换优势'
  if (mpiDelta.value < -1) return '建议保留基线'
  return '仅建议影子部署'
})

const deltaText = computed(() => {
  if (mpiDelta.value === 0) return '当前新旧算法 MPI 持平，尚未形成可支撑替换的净收益。'
  const direction = mpiDelta.value > 0 ? '高于' : '低于'
  return `新算法 MPI ${direction} 基线 ${fmt(Math.abs(mpiDelta.value))}，相对提升 ${pctDelta.value.toFixed(2)}%。`
})

const figureFooter = computed(() => `方法注：基线 MPI ${fmt(baselineMpi.value)}；融合 MPI ${fmt(fusionMpi.value)}；净变化 ${fmt(mpiDelta.value)}；相对提升 ${pctDelta.value.toFixed(2)}%。`)

const fmt = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--'
  return Number(value).toFixed(3)
}

const widthOf = (value) => {
  const num = Number(value)
  if (Number.isNaN(num)) return '0%'
  const clamped = Math.max(0, Math.min(100, num))
  return `${clamped}%`
}
</script>

<style scoped>
.mechanism-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty {
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 16px;
  font-size: 13px;
  color: #475569;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 10px;
}

.module-card {
  border: 1px solid #dde3ea;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.module-card h4 {
  margin: 0 0 8px;
  font-size: 15px;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Times New Roman', serif;
}

.module-card p {
  margin: 6px 0;
  font-size: 13px;
  color: #334155;
}

.module-card span {
  color: #64748b;
}

.mini {
  margin-top: 8px;
  border: 1px solid #6b7280;
  border-radius: 8px;
  background: #ffffff;
  color: #111827;
  font-weight: 600;
  font-size: 12px;
  padding: 6px 10px;
  cursor: pointer;
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
  border: 1px solid #99f6e4;
  background: #ecfeff;
  color: #115e59;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.figure-badge.subtle {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.bars {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar-row {
  display: grid;
  grid-template-columns: 112px 1fr 70px;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.track {
  height: 12px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.fill {
  height: 100%;
}

.fill.old {
  background: linear-gradient(90deg, #64748b 0%, #475569 100%);
}

.fill.new {
  background: linear-gradient(90deg, #0f766e 0%, #0d9488 100%);
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
  border-color: #99f6e4;
  background: linear-gradient(180deg, #f2fffe 0%, #ecfdf5 100%);
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

@media (max-width: 1000px) {
  .module-grid {
    grid-template-columns: 1fr;
  }

  .bar-row {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
