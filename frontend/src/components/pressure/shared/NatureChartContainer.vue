<template>
  <div class="nature-chart-container" :class="{ 'is-loading': loading }" :style="containerStyle">
    <!-- 面板标签 (A, B, C...) -->
    <span class="panel-label" v-if="panelLabel">{{ panelLabel }}</span>

    <!-- 标题 -->
    <h4 class="chart-title" v-if="title">
      <span class="title-text">{{ title }}</span>
    </h4>

    <!-- 图表插槽 -->
    <div class="chart-content" ref="chartRef">
      <slot></slot>
      <!-- 加载状态 -->
      <div class="loading-overlay" v-if="loading">
        <div class="loading-spinner"></div>
      </div>
    </div>

    <!-- 轴标签 -->
    <div class="axis-labels" v-if="xAxisLabel || yAxisLabel">
      <span class="y-axis-label" v-if="yAxisLabel">{{ yAxisLabel }}</span>
      <span class="x-axis-label" v-if="xAxisLabel">{{ xAxisLabel }}</span>
    </div>

    <!-- 图例 -->
    <div class="chart-legend" v-if="$slots.legend || legend">
      <slot name="legend">
        <div class="legend-items" v-if="legend">
          <div
            v-for="(item, index) in legend"
            :key="index"
            class="legend-item"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <span class="legend-color" :style="{ background: item.color }"></span>
            <span class="legend-text">{{ item.label }}</span>
          </div>
        </div>
      </slot>
    </div>

    <!-- 脚注 -->
    <div class="chart-footnote" v-if="footnote">{{ footnote }}</div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  panelLabel: String,
  title: String,
  xAxisLabel: String,
  yAxisLabel: String,
  footnote: String,
  legend: Array,
  width: { type: String, default: 'single' }, // 'single' | 'double' | 'full'
  height: { type: String, default: 'auto' },
  loading: { type: Boolean, default: false }
})

const chartRef = ref(null)

const containerStyle = computed(() => {
  const widths = {
    single: '89mm',
    double: '183mm',
    full: '100%'
  }
  return {
    width: widths[props.width] || props.width,
    height: props.height === 'auto' ? 'auto' : props.height
  }
})
</script>

<style scoped>
.nature-chart-container {
  /* Nature 期刊字体规范 - 与设计系统对齐 */
  --font-family: 'PingFang SC', 'Microsoft YaHei', Arial, Helvetica, sans-serif;
  --font-size-base: 7pt;
  --font-size-label: 8pt;
  --font-size-title: 9pt;
  --font-size-panel: 11pt;

  --text-color: var(--text-primary, #171717);
  --text-secondary: var(--text-tertiary, #737373);
  --border-color: var(--border-color-light, #e5e5e5);
  --bg-color: var(--bg-primary, #ffffff);

  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--text-color);
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 150px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: containerFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

@keyframes containerFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nature-chart-container:hover {
  border-color: var(--border-color, #d4d4d4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 面板标签 */
.panel-label {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: var(--font-size-panel);
  font-weight: 700;
  color: var(--text-color);
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid var(--border-color-light, #e5e5e5);
}

/* 标题 */
.chart-title {
  margin: 0 0 10px 28px;
  font-size: var(--font-size-title);
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 6px;
}

.title-text {
  position: relative;
}

.title-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--text-color);
  transition: width 0.3s ease;
}

.nature-chart-container:hover .title-text::after {
  width: 100%;
}

/* 图表内容区 */
.chart-content {
  flex: 1;
  min-height: 100px;
  position: relative;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color, #e5e5e5);
  border-top-color: var(--text-secondary, #737373);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 轴标签 */
.axis-labels {
  position: relative;
  margin-top: 8px;
  min-height: 20px;
}

.x-axis-label {
  display: block;
  text-align: center;
  font-size: var(--font-size-label);
  color: var(--text-color);
  margin-top: 4px;
  font-weight: 500;
}

.y-axis-label {
  position: absolute;
  left: -12px;
  top: 50%;
  transform: rotate(-90deg) translateX(-50%);
  transform-origin: left center;
  font-size: var(--font-size-label);
  color: var(--text-color);
  white-space: nowrap;
  font-weight: 500;
}

/* 图例 */
.chart-legend {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color-light, #f0f0f0);
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  animation: legendFadeIn 0.3s ease backwards;
}

@keyframes legendFadeIn {
  from {
    opacity: 0;
    transform: translateX(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.legend-color {
  width: 14px;
  height: 9px;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.legend-text {
  font-size: var(--font-size-base);
  color: var(--text-color);
}

/* 脚注 */
.chart-footnote {
  margin-top: 8px;
  font-size: 6pt;
  color: var(--text-secondary);
  text-align: center;
  font-style: italic;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .nature-chart-container {
    --text-color: #f5f5f5;
    --text-secondary: #a3a3a3;
    --border-color: #404040;
    --bg-color: #262626;
  }

  .panel-label {
    background: linear-gradient(135deg, #333333 0%, #262626 100%);
  }

  .loading-overlay {
    background: rgba(38, 38, 38, 0.8);
  }

  .loading-spinner {
    border-color: #404040;
    border-top-color: #a3a3a3;
  }
}
</style>
