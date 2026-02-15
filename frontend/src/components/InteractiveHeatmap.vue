<template>
  <div class="interactive-heatmap" :class="{ fullscreen, 'loading': loading }" ref="heatmapContainer">
    <!-- Header -->
    <header class="heatmap-header">
      <div class="header-left">
        <h2 class="heatmap-title">{{ title }}</h2>
        <p v-if="subtitle" class="heatmap-subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-right">
        <!-- View Toggle -->
        <div class="view-toggle" v-if="!fullscreen">
          <button
            v-for="mode in viewModes"
            :key="mode.id"
            :class="['view-btn', { active: currentViewMode === mode.id }]"
            :title="mode.title"
            @click="setViewMode(mode.id)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path :d="mode.icon" />
            </svg>
          </button>
        </div>
        <!-- Actions -->
        <div class="header-actions">
          <button class="icon-btn" @click="resetView" title="重置视图">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 0 1 2.64M21 12a9 9 0 1 2.64" />
            </svg>
          </button>
          <button class="icon-btn" @click="exportImage" title="导出图片">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a1 1 0 0 1-1h4v-4a1 1 0 0 1-1zM4 19h14a1 1 0 0 1-1v-4a1 1 0 0 1-1h-4a1 1 0 0 1-1zM4 19h-2a1 1 0 0 0-2h4a1 1 0 0 0 2v-4a1 1 0 0 0 0-2h4a1 1 0 0 0 0 2zM4 19v6a1 1 0 0 1-2h-4a1 1 0 0 0 0-2v6a1 1 0 0 0 0-2z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Canvas Area -->
    <div class="canvas-container" ref="canvasContainer">
      <!-- Canvas -->
      <canvas
        ref="canvasRef"
        class="heatmap-canvas"
        :width="canvasWidth"
        :height="canvasHeight"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
        @click="onClick"
        @dblclick="onDoubleClick"
      ></canvas>

      <!-- Loading Overlay -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>{{ loadingText || '加载中...' }}</p>
      </div>

      <!-- Empty State -->
      <div v-if="!hasData" class="empty-state">
        <div class="empty-illustration">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M8 16v4m0-2.64M21 12l-4.2 4.2v-4.2M8 16V4m0-2.64 29-6.36 29-6.36 29-6.36L8 16V4m0-2.64" />
            <path d="M8 28v4m0-2.64 29 6.36 29-6.36 29-6.36 29V4m0-2.64M8 28V4m0-2.64" />
            <path d="M8 40v4m0-2.64 37 6.36 37-6.36 37-6.36 37V4m0-2.64M8 40V4m0-2.64" />
          </svg>
        </div>
        <p class="empty-title">{{ emptyText || '暂无数据' }}</p>
        <button v-if="emptyAction" class="btn primary" @click="emptyAction.onClick">
          {{ emptyAction.label }}
        </button>
      </div>
    </div>

    <!-- Tooltip -->
    <Transition name="tooltip-fade">
      <div
        v-if="hoveredCell && showTooltip"
        class="heatmap-tooltip"
        :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
      >
        <div class="tooltip-header">{{ hoveredCell.title }}</div>
        <div class="tooltip-body">
          <div class="tooltip-row">
            <span class="tooltip-label">坐标</span>
            <span class="tooltip-value">({{ hoveredCell.x }}, {{ hoveredCell.y }})</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">数值</span>
            <span class="tooltip-value">{{ formatValue(hoveredCell.value) }}</span>
          </div>
          <div v-if="hoveredCell.extra" class="tooltip-row">
            <span class="tooltip-label">{{ hoveredCell.extra.label }}</span>
            <span class="tooltip-value">{{ hoveredCell.extra.value }}</span>
          </div>
        </div>
        <div class="tooltip-footer">
          <button class="tooltip-action" @click="selectCell(hoveredCell)">
            查看详情
          </button>
        </div>
      </div>
    </Transition>

    <!-- Legend/Sidebar -->
    <aside class="heatmap-sidebar" :class="{ visible: showLegend }">
      <div class="legend-header">
        <h3>图例</h3>
        <button class="close-btn" @click="showLegend = false">×</button>
      </div>
      <div class="legend-content">
        <!-- Color Scale -->
        <div class="color-scale">
          <div class="scale-bar">
            <div
              v-for="(range, index) in colorRanges"
              :key="index"
              class="scale-segment"
              :style="{ background: range.color, left: (index / colorRanges.length * 100) + '%' }"
            ></div>
          </div>
          <div class="scale-labels">
            <span class="scale-min">{{ formatValue(scaleMin) }}</span>
            <span class="scale-max">{{ formatValue(scaleMax) }}</span>
          </div>
        </div>

        <!-- Statistics -->
        <div class="legend-stats">
          <h4 class="stats-title">统计数据</h4>
          <div class="stats-list">
            <div class="stat-item">
              <span class="stat-label">最小值</span>
              <span class="stat-value">{{ formatValue(statsMin) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最大值</span>
              <span class="stat-value">{{ formatValue(statsMax) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">平均值</span>
              <span class="stat-value">{{ formatValue(statsMean) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">标准差</span>
              <span class="stat-value">{{ formatValue(statsStd) }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Legend Toggle Button (when sidebar hidden) -->
    <button v-if="!showLegend" class="legend-toggle" @click="showLegend = true" title="显示图例">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 19c1 0 1 1 1h4a1 1 0 0 1-1v-4a1 1 0 0 0-2H9a1 1 0 0 0-2v-4a1 1 0 0 0 0z" />
        <path d="M9 19c0 1.5-1.5-1.5h-4a1 1 0 0 0-1v-4a1 1 0 0 0-2z" />
        <path d="M14 5v14a1 1 0 0 1-1h4a1 1 0 0 0 1v-4a1 1 0 0 0 0-2zm0 0l4 0v-4zm0 0l4 0v4" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import HeatmapCanvas from './HeatmapCanvas.vue'

const props = defineProps({
  title: { type: String, default: '热力图' },
  subtitle: String,
  gridSize: { type: Number, default: 0 },
  grid: { type: Array, default: () => [] },
  bounds: { type: Object, default: null },

  // Display options
  colorScale: { type: String, default: 'viridis' }, // viridis, jet, rdyl, etc.
  showLegend: { type: Boolean, default: false },
  showCoordinates: { type: Boolean, default: true },
  interactive: { type: Boolean, default: true },
  tooltipEnabled: { type: Boolean, default: true },

  // State
  loading: { type: Boolean, default: false },
  loadingText: String,
  emptyText: String,
  emptyAction: Object,
  fullscreen: Boolean,

  // Events
  cellClick: Function,
  cellHover: Function,
  viewChange: Function,
})

const emit = defineEmits(['fullscreen-toggle', 'cell-select', 'export-image'])

// Refs
const heatmapContainer = ref(null)
const canvasContainer = ref(null)
const canvasRef = ref(null)

// State
const currentViewMode = ref('heatmap')
const hoveredCell = ref(null)
const showTooltip = ref(false)
const tooltipX = ref(0)
const tooltipY = ref(0)

// View modes
const viewModes = [
  { id: 'heatmap', title: '热力图', icon: '<path d="M4 19h18v4m0-2.64 29 6.36 29-6.36 29-6.36 29V4m0-2.64M8 28V4m0-2.64" />' },
  { id: 'contour', title: '等值线', icon: '<path d="M3 3v18h12a3 3 0 0 1-2.64l6-6 6-6 6-6 6-6 6V4m0-2.64" />' },
]

// Computed
const hasData = computed(() => props.grid && props.grid.length > 0)

const canvasWidth = computed(() => {
  if (heatmapContainer.value) {
    return heatmapContainer.value.clientWidth
  }
  return 800
})

const canvasHeight = computed(() => {
  if (heatmapContainer.value) {
    return heatmapContainer.value.clientHeight
  }
  return 600
})

const statsMin = computed(() => {
  if (!props.grid) return 0
  return Math.min(...props.grid.flat())
})

const statsMax = computed(() => {
  if (!props.grid) return 0
  return Math.max(...props.grid.flat())
})

const statsMean = computed(() => {
  if (!props.grid) return 0
  const values = props.grid.flat().filter(v => Number.isFinite(v))
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
})

const statsStd = computed(() => {
  if (!props.grid) return 0
  const values = props.grid.flat().filter(v => Number.isFinite(v))
  if (values.length === 0) return 0
  const mean = statsMean.value
  const squareDiffs = values.map(v => Math.pow(v - mean, 2))
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length)
})

// Color ranges for legend
const colorRanges = computed(() => {
  if (!props.grid) return []
  const values = props.grid.flat().filter(v => Number.isFinite(v))
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min
  const step = range / 4

  return [
    { min, max: min + step, color: '#22c55e' },
    { min: min + step, max: min + step * 2, color: '#3b82f6' },
    { min: min + step * 2, max: min + step * 3, color: '#f59e0b' },
    { min: min + step * 3, max, color: '#ef4444' },
  ]
})

const scaleMin = computed(() => statsMin.value)
const scaleMax = computed(() => statsMax.value)

// Methods
const formatValue = (val) => {
  const num = parseFloat(val)
  if (!Number.isFinite(num)) return '-'
  return num.toFixed(2)
}

const setViewMode = (mode) => {
  currentViewMode.value = mode
  emit('view-change', mode)
}

const resetView = () => {
  hoveredCell.value = null
  showTooltip.value = false
}

const exportImage = () => {
  if (!canvasRef.value) return
  const link = document.createElement('a')
  link.download = `${props.title || 'heatmap'}.png`
  link.href = canvasRef.value.toDataURL('image/png')
  link.click()
  emit('export-image')
}

const getCellAtEvent = (event) => {
  if (!canvasContainer.value || !props.grid) return null

  const rect = canvasContainer.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  if (props.bounds) {
    const xStep = (props.bounds.max_x - props.bounds.min_x) / props.gridSize
    const yStep = (props.bounds.max_y - props.bounds.min_y) / props.gridSize

    const col = Math.floor((x - 40) / xStep) // Account for sidebar
    const row = Math.floor((y - 80) / yStep) // Account for header

    if (col >= 0 && col < props.gridSize && row >= 0 && row < props.gridSize) {
      const value = props.grid[row][col]
      if (Number.isFinite(value)) {
        return {
          x: props.bounds.min_x + col * xStep,
          y: props.bounds.min_y + row * yStep,
          row,
          col,
          value,
          extra: props.grid[row][col],
        }
      }
    }
  }

  return null
}

const onMouseMove = (event) => {
  if (!props.interactive) return

  const cell = getCellAtEvent(event)
  hoveredCell.value = cell
  showTooltip.value = !!cell

  if (cell) {
    tooltipX.value = event.clientX - heatmapContainer.value.getBoundingClientRect().left + 15
    tooltipY.value = event.clientY - heatmapContainer.value.getBoundingClientRect().top + 15
  }
}

const onMouseLeave = () => {
  hoveredCell.value = null
  showTooltip.value = false
}

const onClick = (event) => {
  const cell = getCellAtEvent(event)
  if (cell) {
    emit('cell-select', cell)
  }
}

const onDoubleClick = () => {
  resetView()
}

const selectCell = (cell) => {
  emit('cell-select', cell)
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  // Handle canvas resize
}
</script>

<style scoped>
.interactive-heatmap {
  --hm-bg: #ffffff;
  --hm-border: #e2e8f0;
  --hm-text: #334155;
  --hm-text-secondary: #64748b;
  --hm-primary: #0f766e;
  --hm-tooltip-bg: rgba(15, 23, 42, 0.95);
}

.heatmap-container {
  display: flex;
  flex-direction: column;
  background: var(--hm-bg);
  border: 1px solid var(--hm-border);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.heatmap-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--hm-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.heatmap-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--hm-text);
}

.heatmap-subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--hm-text-secondary);
}

.header-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.view-toggle {
  display: flex;
  gap: 4px;
}

.view-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--hm-border);
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  border-color: var(--hm-primary);
}

.view-btn.active {
  background: var(--hm-primary);
  border-color: var(--hm-primary);
}

.view-btn svg {
  width: 16px;
  height: 16px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--hm-text-secondary);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: rgba(15, 118, 110, 0.1);
  color: var(--hm-primary);
}

/* Canvas */
.canvas-container {
  position: relative;
  min-height: 400px;
}

.heatmap-canvas {
  display: block;
  cursor: crosshair;
}

/* Loading & Empty States */
.loading-overlay,
.empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--hm-border);
  border-top-color: var(--hm-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-illustration {
  width: 64px;
  height: 64px;
  opacity: 0.5;
  margin-bottom: 12px;
}

.empty-title {
  font-size: 14px;
  color: var(--hm-text-secondary);
  margin-bottom: 12px;
}

/* Tooltip */
.heatmap-tooltip {
  position: absolute;
  pointer-events: none;
  z-index: 100;
  animation: tooltip-fade 0.15s ease-out;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-to {
  transition: opacity 0.15s;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}

.tooltip-header {
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 6px 6px 0;
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.tooltip-body {
  padding: 12px;
  background: white;
  border-radius: 6px;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
}

.tooltip-label {
  font-size: 12px;
  color: var(--hm-text-secondary);
}

.tooltip-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--hm-text);
}

.tooltip-footer {
  padding-top: 8px;
}

.tooltip-action {
  width: 100%;
  padding: 6px 12px;
  border: none;
  background: var(--hm-primary);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

/* Sidebar/Legend */
.heatmap-sidebar {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  background: white;
  border-left: 1px solid var(--hm-border);
  transform: translateX(100%);
  transition: transform 0.3s;
  z-index: 10;
}

.heatmap-sidebar.visible {
  transform: translateX(0);
}

.legend-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--hm-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.legend-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.close-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--hm-text-secondary);
  cursor: pointer;
}

.legend-content {
  padding: 16px;
}

.color-scale {
  margin-bottom: 16px;
}

.scale-bar {
  display: flex;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
}

.scale-segment {
  height: 100%;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 11px;
}

.legend-stats {
  padding-top: 16px;
  border-top: 1px solid var(--hm-border);
}

.stats-title {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--hm-text);
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.stat-label {
  color: var(--hm-text-secondary);
}

.stat-value {
  font-weight: 500;
  color: var(--hm-text);
}

/* Legend Toggle */
.legend-toggle {
  position: absolute;
  right: 16px;
  top: 12px;
  width: 36px;
  height: 36px;
  border: 1px solid var(--hm-border);
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  transition: all 0.2s;
}

.legend-toggle:hover {
  border-color: var(--hm-primary);
}

/* Buttons */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background: var(--hm-primary);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #0e6f68;
}

/* Responsive */
@media (max-width: 768px) {
  .heatmap-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    transform: none;
  }

  .legend-toggle {
    top: auto;
    bottom: 12px;
    right: 12px;
  }
}
</style>