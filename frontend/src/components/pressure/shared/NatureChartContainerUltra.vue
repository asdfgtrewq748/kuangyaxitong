<template>
  <div class="nature-chart-container-ultra" :style="containerStyle">
    <!-- 面板标签 -->
    <div class="panel-label" v-if="panelLabel">{{ panelLabel }}</div>
    
    <!-- 主内容 -->
    <div class="chart-content">
      <!-- 标题区域 -->
      <header class="chart-header">
        <div class="header-main">
          <h3 class="chart-title">{{ title }}</h3>
          <span v-if="subtitle" class="chart-subtitle">{{ subtitle }}</span>
        </div>
        <div v-if="$slots.actions" class="header-actions">
          <slot name="actions"></slot>
        </div>
      </header>
      
      <!-- 图表区域 -->
      <div class="chart-body" :style="bodyStyle">
        <slot></slot>
      </div>
      
      <!-- 轴标签 -->
      <div class="axis-labels">
        <span v-if="xAxisLabel" class="x-label">{{ xAxisLabel }}</span>
        <span v-if="yAxisLabel" class="y-label">{{ yAxisLabel }}</span>
      </div>
      
      <!-- 脚注 -->
      <footer v-if="footnote" class="chart-footer">
        <span class="footnote">{{ footnote }}</span>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  panelLabel: String,
  title: { type: String, required: true },
  subtitle: String,
  xAxisLabel: String,
  yAxisLabel: String,
  footnote: String,
  width: { type: String, default: 'full' },
  height: { type: String, default: '200px' }
})

const containerStyle = computed(() => ({
  width: props.width === 'full' ? '100%' : props.width,
  '--chart-height': props.height
}))

const bodyStyle = computed(() => ({
  height: props.height
}))
</script>

<style scoped>
.nature-chart-container-ultra {
  --color-primary: #1a1a1a;
  --color-secondary: #525252;
  --color-tertiary: #737373;
  --color-border: #e5e5e5;
  --color-bg: #ffffff;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  
  position: relative;
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.panel-label {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;
  z-index: 10;
}

.chart-content {
  padding: 16px;
  padding-left: 44px;
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chart-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  letter-spacing: -0.01em;
}

.chart-subtitle {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.header-actions {
  display: flex;
  gap: 6px;
}

.chart-body {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.axis-labels {
  position: relative;
  height: 20px;
  margin-top: 8px;
}

.x-label {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 9px;
  font-weight: 600;
  color: var(--color-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.y-label {
  position: absolute;
  left: -36px;
  top: -60px;
  font-size: 9px;
  font-weight: 600;
  color: var(--color-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transform: rotate(-90deg);
  transform-origin: left center;
  white-space: nowrap;
}

.chart-footer {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.footnote {
  font-size: 9px;
  font-style: italic;
  color: var(--color-tertiary);
  font-family: 'Times New Roman', serif;
}
</style>
