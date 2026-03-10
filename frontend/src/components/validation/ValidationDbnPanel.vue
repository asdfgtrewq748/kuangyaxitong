<template>
  <section class="dbn-wrap">
    <div v-if="series.length === 0" class="empty">暂无 DBN 后验序列，系统自动运行后将补全该图。</div>

    <PublicationFigureShell
      v-else
      id="dbn-fig5"
      class="figure-shell"
      figure-label="图5"
      caption="图5 | DBN 后验概率序列"
      :summary="figureSummary"
      :chips="figureChips"
      :note="figureFooter"
    >
      <div class="figure-topline">
        <span class="figure-badge">后验跟踪</span>
        <span class="figure-badge subtle">{{ alertState }}</span>
        <button class="mini" type="button" @click="$emit('download-figure', 'fig5')">下载图5</button>
      </div>

      <div class="plot-box">
        <svg viewBox="0 0 640 230" class="plot-svg">
          <line x1="70" y1="30" x2="70" y2="180" stroke="#475569" stroke-width="1.5" />
          <line x1="70" y1="180" x2="600" y2="180" stroke="#475569" stroke-width="1.5" />
          <line x1="70" y1="108" x2="600" y2="108" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="5 4" />
          <line x1="70" y1="72" x2="600" y2="72" stroke="#b91c1c" stroke-width="1.2" stroke-dasharray="5 4" />
          <polyline :points="polylinePoints" fill="none" stroke="#8b1f1f" stroke-width="3" />
          <circle v-for="item in series" :key="item.t" :cx="item.x" :cy="item.y" r="4.5" fill="#8b1f1f" />
          <text
            v-for="item in series"
            :key="`${item.t}-text`"
            :x="item.x"
            y="205"
            text-anchor="middle"
            class="axis"
          >
            {{ item.t }}
          </text>
          <text x="20" y="36" class="axis">风险</text>
          <text x="560" y="208" class="axis">时间</text>
          <text x="606" y="111" class="threshold-label">0.60</text>
          <text x="606" y="75" class="threshold-label">0.90</text>
        </svg>
      </div>

      <div class="posterior-grid">
        <div v-for="item in series" :key="`${item.t}-value`" class="posterior-item">
          <span>{{ item.t }}</span>
          <strong>{{ (item.prob * 100).toFixed(2) }}%</strong>
        </div>
      </div>

      <div class="detail-grid">
        <article class="detail-card primary">
          <span class="detail-label">关键结论</span>
          <p>{{ figureResult }}</p>
        </article>
        <article class="detail-card">
          <span class="detail-label">阅读提示</span>
          <p>曲线持续抬升意味着高风险后验置信度在积累；一旦超过报警阈值，应结合时窗位置判断是否进入重点巡检区段。</p>
        </article>
        <article class="detail-card full">
          <span class="detail-label">触发说明</span>
          <p>推荐将 0.60 作为关注阈值、0.90 作为强报警阈值。真正的现场动作应根据阈值穿越时刻与相邻时窗斜率共同决定。</p>
        </article>
      </div>
    </PublicationFigureShell>
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

defineEmits(['download-figure'])

const series = computed(() => {
  const raw = props.result?.figures?.fig5_dbn?.posterior
  if (!Array.isArray(raw) || raw.length === 0) return []

  const startX = 130
  const step = raw.length > 1 ? 390 / (raw.length - 1) : 0

  return raw.map((item, idx) => {
    const prob = Math.max(0, Math.min(1, Number(item.high_risk_prob || 0)))
    return {
      t: item.t,
      prob,
      x: startX + idx * step,
      y: 180 - prob * 120
    }
  })
})

const polylinePoints = computed(() => series.value.map((item) => `${item.x},${item.y}`).join(' '))
const peakItem = computed(() => series.value.reduce((best, item) => (item.prob > best.prob ? item : best), series.value[0] || { t: '--', prob: 0 }))
const latestItem = computed(() => series.value[series.value.length - 1] || { t: '--', prob: 0 })
const firstAlertItem = computed(() => series.value.find((item) => item.prob >= 0.6) || null)
const figureSummary = computed(() => '该图沿顺序时间窗跟踪 DBN 后验概率变化，用于判断风险累积是短暂波动、持续抬升，还是已经进入报警区间。')
const figureChips = computed(() => ([
  `最新 ${(latestItem.value.prob * 100).toFixed(1)}%`,
  `峰值 ${peakItem.value.t}`,
  firstAlertItem.value ? `首次预警 ${firstAlertItem.value.t}` : '未穿越预警阈值'
]))
const alertState = computed(() => {
  if (peakItem.value.prob >= 0.9) return '强报警阶段'
  if (peakItem.value.prob >= 0.6) return '重点关注阶段'
  return '低于预警线'
})
const figureResult = computed(() => {
  if (!series.value.length) return '当前暂无可解释的后验序列。'
  if (!firstAlertItem.value) return `全时序后验峰值为 ${(peakItem.value.prob * 100).toFixed(2)}%，尚未穿越 60% 关注阈值。`
  return `后验概率在 ${firstAlertItem.value.t} 首次穿越 60% 关注阈值，峰值出现在 ${peakItem.value.t}，最高达到 ${(peakItem.value.prob * 100).toFixed(2)}%。`
})
const figureFooter = computed(() => `方法注：共 ${series.value.length} 个时窗；最新后验 ${(latestItem.value.prob * 100).toFixed(2)}%；峰值 ${(peakItem.value.prob * 100).toFixed(2)}% 出现在 ${peakItem.value.t}；关注/强报警阈值分别为 0.60/0.90。`)
</script>

<style scoped>
.dbn-wrap {
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
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.figure-badge.subtle {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.plot-box {
  margin-top: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 8px;
}

.plot-svg {
  width: 100%;
  height: auto;
}

.axis {
  font-size: 12px;
  fill: #475569;
  font-family: 'Times New Roman', serif;
}

.threshold-label {
  font-size: 11px;
  fill: #7f1d1d;
  font-family: 'Times New Roman', serif;
}

.posterior-grid {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  gap: 8px;
}

.posterior-item {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px;
  background: #fcfdff;
}

.posterior-item span {
  display: block;
  font-size: 12px;
  color: #64748b;
}

.posterior-item strong {
  font-size: 18px;
  color: #111827;
  font-family: 'Times New Roman', serif;
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
  border-color: #fecaca;
  background: linear-gradient(180deg, #fff7f7 0%, #fef2f2 100%);
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

@media (max-width: 700px) {
  .posterior-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
