<template>
  <div class="simulation-data-panel">
    <div class="panel-header">
      <span class="panel-title">实时数据</span>
      <span v-if="playing" class="live-indicator">
        <span class="live-dot"></span>
        实时
      </span>
    </div>

    <!-- Primary Metrics -->
    <div class="metrics-grid">
      <div class="metric-card primary">
        <div class="metric-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="metric-content">
          <span class="metric-value">{{ currentDistance.toFixed(1) }}</span>
          <span class="metric-unit">m</span>
        </div>
        <span class="metric-label">已推进距离</span>
      </div>

      <div class="metric-card">
        <div class="metric-icon stress">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9a4 4 0 100 8 4 4 0 000-8z"/>
            <path d="M12 3v1m0 14v1m8-8h-1M5 12H4m12.35-6.35l-.7.7M8.35 16.65l-.7.7m12.72-.72l-.7.7M8.35 7.35l-.7.7"/>
          </svg>
        </div>
        <div class="metric-content">
          <span class="metric-value">{{ stressLevel.toFixed(1) }}</span>
          <span class="metric-unit">%</span>
        </div>
        <span class="metric-label">应力集中度</span>
      </div>

      <div class="metric-card">
        <div class="metric-icon relief">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
        <div class="metric-content">
          <span class="metric-value">{{ reliefLevel.toFixed(1) }}</span>
          <span class="metric-unit">%</span>
        </div>
        <span class="metric-label">卸压程度</span>
      </div>
    </div>

    <!-- Secondary Stats -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-label">开采进度</span>
        <span class="stat-value">{{ progress.toFixed(1) }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">推进方向</span>
        <span class="stat-value">{{ direction }}°</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">推进速度</span>
        <span class="stat-value">{{ playbackSpeed }}x</span>
      </div>
    </div>

    <!-- Zone Status -->
    <div class="zone-status">
      <div class="zone-item">
        <span class="zone-label">采空区面积</span>
        <span class="zone-value">{{ goafArea.toFixed(0) }} m²</span>
      </div>
      <div class="zone-item">
        <span class="zone-label">影响范围</span>
        <span class="zone-value">{{ influenceRange.toFixed(0) }} m</span>
      </div>
    </div>

    <!-- Phase Indicator -->
    <div class="phase-indicator">
      <span class="phase-label">开采阶段</span>
      <div class="phase-bar">
        <div
          v-for="(phase, idx) in phases"
          :key="idx"
          :class="['phase-segment', { active: currentPhase === idx, passed: currentPhase > idx }]"
          :style="{ width: `${100 / phases.length}%` }"
          :title="phase.name"
        >
          <span class="phase-text">{{ phase.label }}</span>
        </div>
      </div>
      <span class="phase-name">{{ phases[currentPhase]?.name }}</span>
    </div>

    <!-- Risk Assessment -->
    <div class="risk-assessment" :class="riskLevel.class">
      <div class="risk-header">
        <span class="risk-label">风险评估</span>
        <span class="risk-value" :style="{ color: riskLevel.color }">{{ riskLevel.label }}</span>
      </div>
      <div class="risk-bar">
        <div
          class="risk-fill"
          :style="{ width: `${riskLevel.percent}%`, background: riskLevel.color }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  playing: {
    type: Boolean,
    default: false
  },
  direction: {
    type: Number,
    default: 0
  },
  playbackSpeed: {
    type: Number,
    default: 1
  },
  totalDistance: {
    type: Number,
    default: 500
  },
  workfaceLength: {
    type: Number,
    default: 150
  }
})

// Phases of mining
const phases = [
  { label: '初', name: '初采阶段' },
  { label: '初', name: '初次来压' },
  { label: '正', name: '正常推进' },
  { label: '周', name: '周期来压' },
  { label: '完', name: '收尾阶段' }
]

const currentDistance = computed(() => (props.progress / 100) * props.totalDistance)

const currentPhase = computed(() => {
  const p = props.progress
  if (p < 15) return 0
  if (p < 30) return 1
  if (p < 70) return 2
  if (p < 90) return 3
  return 4
})

// Simulated stress level based on progress (higher during initial and periodic pressure)
const stressLevel = computed(() => {
  const p = props.progress
  // Stress peaks at certain intervals (simulating periodic weighting)
  const baseStress = 40 + p * 0.3
  const periodicStress = 20 * Math.sin((p / 100) * Math.PI * 4)
  return Math.min(100, Math.max(0, baseStress + periodicStress))
})

// Relief level increases as goaf expands
const reliefLevel = computed(() => {
  const p = props.progress
  return Math.min(95, p * 0.8 + 10)
})

// Goaf area calculation (approximate)
const goafArea = computed(() => {
  return currentDistance.value * props.workfaceLength
})

// Influence range (stress affects area ahead of face)
const influenceRange = computed(() => {
  return 50 + currentDistance.value * 0.1
})

// Risk assessment based on stress level
const riskLevel = computed(() => {
  const stress = stressLevel.value
  if (stress < 40) {
    return { label: '低风险', class: 'low', color: '#22c55e', percent: 25 }
  } else if (stress < 60) {
    return { label: '中等风险', class: 'medium', color: '#f59e0b', percent: 50 }
  } else if (stress < 80) {
    return { label: '较高风险', class: 'high', color: '#f97316', percent: 75 }
  } else {
    return { label: '高风险', class: 'critical', color: '#ef4444', percent: 100 }
  }
})
</script>

<style scoped>
.simulation-data-panel {
  background: var(--bg-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--color-error);
  font-weight: 500;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: var(--color-error);
  border-radius: 50%;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.metric-card {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  transition: all 0.2s ease;
}

.metric-card:hover {
  background: var(--bg-tertiary);
}

.metric-card.primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
}

.metric-card.primary .metric-value,
.metric-card.primary .metric-label {
  color: white;
}

.metric-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.metric-icon svg {
  width: 16px;
  height: 16px;
}

.metric-icon.stress {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.metric-icon.relief {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.metric-content {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
}

.metric-unit {
  font-size: 12px;
  color: var(--text-tertiary);
}

.metric-label {
  font-size: 11px;
  color: var(--text-tertiary);
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm) 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
}

/* Zone Status */
.zone-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
}

.zone-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.zone-label {
  font-size: 10px;
  color: var(--text-tertiary);
}

.zone-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
}

/* Phase Indicator */
.phase-indicator {
  margin-bottom: var(--spacing-md);
}

.phase-label {
  display: block;
  font-size: 11px;
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-xs);
}

.phase-bar {
  display: flex;
  height: 24px;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  margin-bottom: var(--spacing-xs);
}

.phase-segment {
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--bg-primary);
  transition: all 0.3s ease;
}

.phase-segment:last-child {
  border-right: none;
}

.phase-segment.active {
  background: var(--color-primary);
}

.phase-segment.passed {
  background: var(--color-secondary);
}

.phase-text {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-tertiary);
}

.phase-segment.active .phase-text,
.phase-segment.passed .phase-text {
  color: white;
}

.phase-name {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
  display: block;
}

/* Risk Assessment */
.risk-assessment {
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  background: var(--bg-secondary);
}

.risk-assessment.low {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.risk-assessment.medium {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.risk-assessment.high {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05));
  border: 1px solid rgba(249, 115, 22, 0.2);
}

.risk-assessment.critical {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.risk-label {
  font-size: 11px;
  color: var(--text-tertiary);
}

.risk-value {
  font-size: 13px;
  font-weight: 600;
}

.risk-bar {
  height: 6px;
  background: var(--bg-primary);
  border-radius: 3px;
  overflow: hidden;
}

.risk-fill {
  height: 100%;
  transition: width 0.3s ease, background 0.3s ease;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .stats-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .stat-item {
    flex-direction: row;
    justify-content: space-between;
    padding: 0 var(--spacing-sm);
  }
}
</style>
