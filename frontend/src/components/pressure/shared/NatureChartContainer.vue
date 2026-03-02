<template>
  <div class="nature-chart-container" :style="containerStyle">
    <!-- 面板标签 (A, B, C...) -->
    <span class="panel-label" v-if="panelLabel">{{ panelLabel }}</span>

    <!-- 标题 -->
    <h4 class="chart-title" v-if="title">{{ title }}</h4>

    <!-- 图表插槽 -->
    <div class="chart-content" ref="chartRef">
      <slot></slot>
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
  height: { type: String, default: 'auto' }
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
  /* Nature 期刊字体规范 */
  --font-family: 'Arial', 'Helvetica', sans-serif;
  --font-size-base: 7pt;
  --font-size-label: 8pt;
  --font-size-title: 9pt;
  --font-size-panel: 10pt;

  --text-color: #000000;
  --text-secondary: #64748b;

  --border-color: #e2e8f0;
  --bg-color: #ffffff;

  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--text-color);
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 150px;
}

/* 面板标签 */
.panel-label {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: var(--font-size-panel);
  font-weight: 700;
  color: var(--text-color);
}

/* 标题 */
.chart-title {
  margin: 0 0 8px 24px;
  font-size: var(--font-size-title);
  font-weight: 600;
  color: var(--text-color);
}

/* 图表内容区 */
.chart-content {
  flex: 1;
  min-height: 100px;
}

/* 轴标签 */
.axis-labels {
  position: relative;
  margin-top: 8px;
}

.x-axis-label {
  display: block;
  text-align: center;
  font-size: var(--font-size-label);
  color: var(--text-color);
  margin-top: 4px;
}

.y-axis-label {
  position: absolute;
  left: -8px;
  top: 50%;
  transform: rotate(-90deg) translateX(-50%);
  transform-origin: left center;
  font-size: var(--font-size-label);
  color: var(--text-color);
  white-space: nowrap;
}

/* 图例 */
.chart-legend {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-color {
  width: 12px;
  height: 8px;
  border-radius: 2px;
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
}
</style>
