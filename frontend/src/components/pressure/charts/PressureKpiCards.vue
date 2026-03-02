<template>
  <div class="pressure-kpi-cards">
    <div
      v-for="kpi in kpis"
      :key="kpi.key"
      class="kpi-card"
      :class="{ warning: kpi.isWarning, danger: kpi.isDanger }"
    >
      <div class="kpi-value">
        {{ formatValue(kpi.value) }}
        <span class="kpi-unit">{{ kpi.unit }}</span>
      </div>
      <div class="kpi-label">{{ kpi.label }}</div>
      <div class="kpi-trend" v-if="kpi.trend">
        <span :class="['trend-icon', kpi.trend > 0 ? 'up' : 'down']">
          {{ kpi.trend > 0 ? '↑' : '↓' }}
        </span>
        <span class="trend-value">{{ Math.abs(kpi.trend).toFixed(1) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: { type: Object, default: null },
  anomalies: { type: Array, default: () => [] },
  peaks: { type: Array, default: () => [] },
  previousStats: { type: Object, default: null }
})

const kpis = computed(() => {
  if (!props.stats) return []

  const stats = props.stats
  const prev = props.previousStats

  return [
    {
      key: 'mean',
      label: '均值',
      value: stats.mean,
      unit: 'MPa',
      trend: prev ? ((stats.mean - prev.mean) / prev.mean) * 100 : null,
      isWarning: stats.mean > 40,
      isDanger: stats.mean > 50
    },
    {
      key: 'std',
      label: '标准差',
      value: stats.std,
      unit: 'MPa',
      trend: prev ? ((stats.std - prev.std) / prev.std) * 100 : null
    },
    {
      key: 'max',
      label: '最大值',
      value: stats.max,
      unit: 'MPa',
      isWarning: stats.max > 50,
      isDanger: stats.max > 55
    },
    {
      key: 'min',
      label: '最小值',
      value: stats.min,
      unit: 'MPa'
    },
    {
      key: 'anomalies',
      label: '异常值',
      value: props.anomalies.length,
      unit: '',
      isWarning: props.anomalies.length > 10,
      isDanger: props.anomalies.length > 50
    },
    {
      key: 'peaks',
      label: '峰值',
      value: props.peaks.length,
      unit: ''
    },
    {
      key: 'samples',
      label: '样本数',
      value: stats.n,
      unit: ''
    }
  ]
})

function formatValue(val) {
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return val
    return val.toFixed(1)
  }
  return '-'
}
</script>

<style scoped>
.pressure-kpi-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
  font-family: 'Arial', 'Helvetica', sans-serif;
}

.kpi-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
  transition: all 0.2s;
}

.kpi-card.warning {
  border-color: #f59e0b;
  background: #fffbeb;
}

.kpi-card.danger {
  border-color: #ef4444;
  background: #fef2f2;
}

.kpi-value {
  font-size: 14pt;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.kpi-unit {
  font-size: 8pt;
  font-weight: 400;
  color: #64748b;
  margin-left: 2px;
}

.kpi-label {
  font-size: 7pt;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
}

.kpi-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  margin-top: 4px;
  font-size: 7pt;
}

.trend-icon.up {
  color: #ef4444;
}

.trend-icon.down {
  color: #22c55e;
}

.trend-value {
  color: #64748b;
}
</style>
