<template>
  <section class="chart-container" :class="{ compact }">
    <header class="chart-header">
      <div class="chart-meta">
        <h3 class="chart-title">{{ title }}</h3>
        <p v-if="subtitle" class="chart-subtitle">{{ subtitle }}</p>
      </div>
      <div class="chart-actions">
        <slot name="actions"></slot>
      </div>
    </header>

    <div class="chart-body">
      <div v-if="loading" class="chart-state loading">
        <div class="spinner"></div>
        <span>{{ loadingText }}</span>
      </div>

      <div v-else-if="error" class="chart-state error">
        <strong>数据加载失败</strong>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="empty" class="chart-state empty">
        <span>{{ emptyText }}</span>
      </div>

      <slot v-else></slot>
    </div>

    <footer v-if="$slots.footer" class="chart-footer">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  empty: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: '暂无可展示数据'
  },
  loadingText: {
    type: String,
    default: '图表加载中...'
  },
  compact: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border: 1px solid var(--border-color-light);
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);
}

.chart-container.compact {
  padding: var(--spacing-3);
  gap: var(--spacing-2);
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-3);
}

.chart-meta {
  min-width: 0;
}

.chart-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.chart-subtitle {
  margin: var(--spacing-1) 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.chart-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.chart-body {
  min-height: 220px;
  border: 1px dashed var(--border-color-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
}

.chart-state {
  height: 100%;
  min-height: 190px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-text-secondary);
  gap: var(--spacing-2);
}

.chart-state.error strong {
  color: var(--color-danger, #dc2626);
}

.chart-state.error p {
  margin: 0;
  font-size: var(--font-size-sm);
}

.spinner {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-primary);
  animation: chart-spin 0.8s linear infinite;
}

.chart-footer {
  padding-top: var(--spacing-2);
  border-top: 1px solid var(--border-color-light);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

@keyframes chart-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
  }

  .chart-body {
    min-height: 180px;
  }
}
</style>
