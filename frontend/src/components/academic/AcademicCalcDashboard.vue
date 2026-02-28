<template>
  <section class="card dashboard-card">
    <div class="section-header">
      <h2>{{ aa('calcDashboardTitle') }}</h2>
      <p>{{ aa('calcDashboardDesc') }}</p>
    </div>
    <div class="indicator-dashboard">
      <div class="indicator-card" v-for="indicator in indicators" :key="indicator.key">
        <div class="indicator-header">
          <span class="indicator-tag">{{ indicator.tag }}</span>
          <span class="indicator-name">{{ aa(indicator.nameKey) }}</span>
        </div>
        <div class="indicator-value" :class="valueClass(indicator.value)">{{ Number(indicator.value).toFixed(1) }}</div>
        <div class="indicator-progress">
          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: `${indicator.value}%`, background: progressColor(indicator.value) }"
            ></div>
          </div>
        </div>
        <div class="indicator-method">{{ aa(indicator.methodKey) }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  aa: {
    type: Function,
    required: true
  },
  indicators: {
    type: Array,
    required: true
  },
  valueClass: {
    type: Function,
    required: true
  },
  progressColor: {
    type: Function,
    required: true
  }
})
</script>

<style scoped>
.indicator-dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.indicator-card {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-5);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.indicator-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.indicator-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.indicator-tag {
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: 999px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
}

.indicator-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.indicator-value {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1;
}

.indicator-value.low {
  color: var(--color-success);
}

.indicator-value.medium {
  color: var(--color-warning);
}

.indicator-value.high {
  color: var(--color-error);
}

.indicator-progress {
  margin-bottom: 8px;
}

.progress-track {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.indicator-method {
  font-size: 12px;
  color: var(--text-tertiary);
}

@media (max-width: 1100px) {
  .indicator-dashboard {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .indicator-dashboard {
    grid-template-columns: 1fr;
  }
}
</style>
