<!--
  StatCard - 统计卡片组件

  用于展示数值统计信息，如：
  - 数据集行数、列数
  - 模型性能指标（AUC、F1 等）
  - 实验结果统计

  特性：
  - 支持加载状态
  - 支持趋势指示（上升/下降）
  - 支持错误状态
  - 支持自定义图标
  - 支持多种尺寸
-->

<template>
  <div class="stat-card" :class="[`size-${size}`, { loading, error, clickable: !!onClick }]">
    <!-- 头部：图标和标题 -->
    <div class="stat-header">
      <div v-if="$slots.icon || icon" class="stat-icon-wrapper">
        <slot name="icon">
          <span class="stat-icon">{{ icon }}</span>
        </slot>
      </div>
      <h3 class="stat-title">{{ title }}</h3>
      <button v-if="tooltip" class="stat-tooltip" :title="tooltip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
      </button>
    </div>

    <!-- 数值区域 -->
    <div class="stat-value" :class="valueClass" @click="handleClick">
      <!-- 加载状态 -->
      <span v-if="loading" class="spinner"></span>

      <!-- 正常状态 -->
      <template v-else>
        <span class="value">{{ formattedValue }}</span>
        <span v-if="unit" class="unit">{{ unit }}</span>
      </template>
    </div>

    <!-- 副标题/描述 -->
    <p v-if="subtitle" class="stat-subtitle">{{ subtitle }}</p>

    <!-- 趋势指示 -->
    <div v-if="trend !== undefined && !loading && !error" class="stat-trend" :class="trendClass">
      <span class="trend-icon">{{ trendIcon }}</span>
      <span class="trend-value">{{ formattedTrend }}</span>
      <span v-if="trendLabel" class="trend-label">{{ trendLabel }}</span>
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="stat-error">
      <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4"/>
        <path d="M12 16h.01"/>
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- 底部插槽 -->
    <div v-if="$slots.footer" class="stat-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 标题
  title: {
    type: String,
    required: true
  },

  // 数值
  value: {
    type: [Number, String],
    default: null
  },

  // 单位
  unit: String,

  // 副标题/描述
  subtitle: String,

  // 图标（emoji 或文本）
  icon: String,

  // 工具提示
  tooltip: String,

  // 趋势（百分比或数值）
  trend: {
    type: [Number, String],
    default: undefined
  },

  // 趋势标签
  trendLabel: String,

  // 趋势方向（自动检测或手动指定）
  trendDirection: {
    type: String,
    validator: (v) => ['up', 'down', 'neutral'].includes(v),
    default: null
  },

  // 错误信息
  error: String,

  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },

  // 尺寸
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },

  // 数值对齐方式
  align: {
    type: String,
    default: 'left',
    validator: (v) => ['left', 'center', 'right'].includes(v)
  },

  // 自定义数值类名
  valueClass: [String, Array, Object],

  // 格式化选项
  format: {
    type: Boolean,
    default: true
  },

  // 小数位数
  decimals: {
    type: Number,
    default: 2
  },

  // 点击事件
  onClick: Function
})

const emit = defineEmits(['click'])

// 格式化数值
const formattedValue = computed(() => {
  if (props.value === null || props.value === undefined) {
    return '-'
  }

  if (!props.format) {
    return String(props.value)
  }

  if (typeof props.value === 'number') {
    // 大数使用千分位
    if (Math.abs(props.value) >= 1000) {
      return props.value.toLocaleString('en-US', {
        minimumFractionDigits: props.decimals,
        maximumFractionDigits: props.decimals
      })
    }
    // 小数保留指定位数
    return props.value.toFixed(props.decimals)
  }

  return String(props.value)
})

// 格式化趋势
const formattedTrend = computed(() => {
  if (props.trend === undefined || props.trend === null) {
    return ''
  }

  const value = typeof props.trend === 'number'
    ? Math.abs(props.trend).toFixed(1)
    : props.trend

  return value
})

// 趋势方向
const trendClass = computed(() => {
  if (props.trendDirection) {
    return props.trendDirection
  }

  if (props.trend === undefined || props.trend === null) {
    return 'neutral'
  }

  // 自动检测：正数为上升，负数为下降
  const numValue = typeof props.trend === 'number' ? props.trend : parseFloat(props.trend)
  if (isNaN(numValue)) {
    return 'neutral'
  }

  return numValue > 0 ? 'up' : numValue < 0 ? 'down' : 'neutral'
})

// 趋势图标
const trendIcon = computed(() => {
  const direction = trendClass.value
  if (direction === 'up') return '↑'
  if (direction === 'down') return '↓'
  return '→'
})

// 点击处理
function handleClick() {
  if (props.onClick) {
    props.onClick()
  }
  emit('click')
}
</script>

<style scoped>
.stat-card {
  position: relative;
  padding: var(--spacing-4);
  background: var(--color-bg-card);
  border: 1px solid var(--border-color-light);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.stat-card.size-sm {
  padding: var(--spacing-3);
}

.stat-card.size-lg {
  padding: var(--spacing-6);
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-card.clickable:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-card.error {
  border-color: var(--color-error-border);
  background: var(--color-error-bg);
}

/* Header */
.stat-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--gradient-primary);
  color: white;
  font-size: var(--font-size-lg);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.stat-title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  flex: 1;
}

.stat-tooltip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: help;
  opacity: 0.6;
  transition: opacity var(--transition-fast);
}

.stat-tooltip:hover {
  opacity: 1;
}

.stat-tooltip svg {
  width: 14px;
  height: 14px;
}

/* Value */
.stat-value {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-2);
}

.stat-value.align-center {
  justify-content: center;
}

.stat-value.align-right {
  justify-content: flex-end;
}

.stat-value .value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
  line-height: 1;
}

.stat-card.size-sm .stat-value .value {
  font-size: var(--font-size-2xl);
}

.stat-card.size-lg .stat-value .value {
  font-size: 48px;
}

.stat-value .unit {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-normal);
}

/* Subtitle */
.stat-subtitle {
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  line-height: var(--line-height-normal);
}

/* Trend */
.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.stat-trend.up {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.stat-trend.down {
  background: var(--color-error-bg);
  color: var(--color-error);
}

.stat-trend.neutral {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.trend-icon {
  font-size: var(--font-size-base);
  line-height: 1;
}

.trend-label {
  font-size: var(--font-size-xs);
  opacity: 0.8;
}

/* Error */
.stat-error {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2);
  margin-top: var(--spacing-2);
  border-radius: var(--radius-sm);
  background: rgba(220, 38, 38, 0.1);
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

.error-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.stat-card.size-sm .spinner {
  width: 20px;
  height: 20px;
}

.stat-card.size-lg .spinner {
  width: 28px;
  height: 28px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Footer */
.stat-footer {
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--border-color-light);
}
</style>
