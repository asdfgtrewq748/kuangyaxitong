<template>
  <section class="dbn-wrap">
    <div v-if="series.length === 0" class="empty">暂无 DBN 后验序列，系统自动运行后将补全该图。</div>

    <article v-else id="dbn-fig5" class="figure-card">
      <div class="figure-head">
        <h4>图5 | DBN 后验概率时序</h4>
        <button class="mini" type="button" @click="$emit('download-figure', 'fig5')">下载图5</button>
      </div>

      <div class="plot-box">
        <svg viewBox="0 0 640 230" class="plot-svg">
          <line x1="70" y1="30" x2="70" y2="180" stroke="#475569" stroke-width="1.5" />
          <line x1="70" y1="180" x2="600" y2="180" stroke="#475569" stroke-width="1.5" />
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
        </svg>
      </div>

      <div class="posterior-grid">
        <div v-for="item in series" :key="`${item.t}-value`" class="posterior-item">
          <span>{{ item.t }}</span>
          <strong>{{ (item.prob * 100).toFixed(2) }}%</strong>
        </div>
      </div>

      <p class="note"><strong>怎么看：</strong>曲线抬升代表高风险后验置信度在积累。</p>
      <p class="note"><strong>工程意义：</strong>转折点可用于触发分阶段干预与支护调整。</p>
    </article>
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
  border: 1px solid #9ca3af;
  border-radius: 8px;
  background: #f8fafc;
  color: #1f2937;
  font-size: 12px;
  padding: 6px 10px;
  cursor: pointer;
}

.note {
  margin: 8px 0 0;
  font-size: 12px;
  color: #374151;
}

@media (max-width: 700px) {
  .figure-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .posterior-grid {
    grid-template-columns: 1fr;
  }
}
</style>
