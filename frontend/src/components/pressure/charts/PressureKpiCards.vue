<template>
  <div class="pressure-kpi-cards">
    <div
      v-for="(kpi, index) in kpis"
      :key="kpi.key"
      class="kpi-card"
      :class="{ warning: kpi.isWarning, danger: kpi.isDanger }"
      :style="{ animationDelay: `${index * 60}ms` }"
    >
      <div class="kpi-header">
        <span class="kpi-icon" v-html="kpi.icon"></span>
        <span class="kpi-label">{{ kpi.label }}</span>
      </div>
      <div class="kpi-body">
        <span class="kpi-value">{{ formatValue(kpi.value) }}</span>
        <span class="kpi-unit" v-if="kpi.unit">{{ kpi.unit }}</span>
      </div>
      <div class="kpi-trend" v-if="kpi.trend !== null">
        <span :class="['trend-icon', kpi.trend > 0 ? 'up' : 'down']">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path v-if="kpi.trend > 0" d="M8 3l5 6H3z"/>
            <path v-else d="M8 13l5-6H3z"/>
          </svg>
        </span>
        <span class="trend-value">{{ Math.abs(kpi.trend).toFixed(1) }}%</span>
      </div>
      <div class="kpi-indicator" v-if="kpi.isWarning || kpi.isDanger"></div>
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
      isDanger: stats.mean > 50,
      icon: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
    },
    {
      key: 'std',
      label: '标准差',
      value: stats.std,
      unit: 'MPa',
      trend: prev ? ((stats.std - prev.std) / prev.std) * 100 : null,
      icon: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 8h12M8 2v12" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>'
    },
    {
      key: 'max',
      label: '最大值',
      value: stats.max,
      unit: 'MPa',
      isWarning: stats.max > 50,
      isDanger: stats.max > 55,
      icon: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 2l6 12H2z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
    },
    {
      key: 'min',
      label: '最小值',
      value: stats.min,
      unit: 'MPa',
      icon: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 14l-6-8h12z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
    },
    {
      key: 'anomalies',
      label: '异常值',
      value: props.anomalies.length,
      unit: '',
      isWarning: props.anomalies.length > 10,
      isDanger: props.anomalies.length > 50,
      icon: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 2v6m0 4v2" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>'
    },
    {
      key: 'peaks',
      label: '峰值',
      value: props.peaks.length,
      unit: '',
      icon: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 12l4-6 3 4 5-8" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>'
    },
    {
      key: 'samples',
      label: '样本数',
      value: stats.n,
      unit: '',
      icon: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
    }
  ]
})

function formatValue(val) {
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return val.toLocaleString()
    return val.toFixed(1)
  }
  return '-'
}
</script>

<style scoped>
.pressure-kpi-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
}

.kpi-card {
  position: relative;
  background: var(--bg-primary, #ffffff);
  border: 1px solid var(--border-color-light, #f0f0f0);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: cardFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.kpi-card:hover {
  border-color: var(--border-color, #e5e5e5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.kpi-card.warning {
  border-color: var(--color-warning, #ca8a04);
  background: linear-gradient(135deg, var(--color-warning-bg, #fefce8) 0%, #ffffff 100%);
}

.kpi-card.warning:hover {
  border-color: var(--color-warning);
  box-shadow: 0 4px 16px rgba(202, 138, 4, 0.15);
}

.kpi-card.danger {
  border-color: var(--color-error, #dc2626);
  background: linear-gradient(135deg, var(--color-error-bg, #fef2f2) 0%, #ffffff 100%);
}

.kpi-card.danger:hover {
  border-color: var(--color-error);
  box-shadow: 0 4px 16px rgba(220, 38, 38, 0.15);
}

.kpi-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 6px;
}

.kpi-icon {
  width: 14px;
  height: 14px;
  color: var(--text-tertiary, #737373);
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.kpi-card.warning .kpi-icon {
  color: var(--color-warning, #ca8a04);
}

.kpi-card.danger .kpi-icon {
  color: var(--color-error, #dc2626);
}

.kpi-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-tertiary, #737373);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.kpi-body {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 3px;
}

.kpi-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary, #171717);
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.kpi-unit {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted, #a3a3a3);
}

.kpi-card.warning .kpi-value {
  color: var(--color-warning-text, #92400e);
}

.kpi-card.danger .kpi-value {
  color: var(--color-error-text, #991b1b);
}

.kpi-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid var(--border-color-light, #f0f0f0);
}

.trend-icon {
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trend-icon svg {
  width: 10px;
  height: 10px;
}

.trend-icon.up {
  color: var(--color-error, #dc2626);
}

.trend-icon.down {
  color: var(--color-success, #16a34a);
}

.trend-value {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-tertiary, #737373);
}

.kpi-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-warning, #ca8a04);
}

.kpi-card.danger .kpi-indicator {
  background: var(--color-error, #dc2626);
  animation: indicatorPulse 2s infinite;
}

@keyframes indicatorPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
