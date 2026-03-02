<template>
  <div class="pressure-heatmap" ref="containerRef">
    <!-- 标题栏 -->
    <header class="heatmap-header">
      <div class="header-left">
        <h2 class="heatmap-title">{{ title }}</h2>
        <p v-if="subtitle" class="heatmap-subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-right">
        <!-- 视图切换 -->
        <div class="view-toggle">
          <button
            v-for="mode in viewModes"
            :key="mode.id"
            :class="['view-btn', { active: currentViewMode === mode.id }]"
            :title="mode.title"
            @click="setViewMode(mode.id)"
          >
            <span class="view-icon">{{ mode.icon }}</span>
          </button>
        </div>
        <!-- 操作按钮 -->
        <button class="icon-btn" @click="resetView" title="重置视图">
          <span>⟲</span>
        </button>
        <button class="icon-btn" @click="exportImage" title="导出图片">
          <span>⬇</span>
        </button>
        <button class="icon-btn" @click="toggleFullscreen" title="全屏">
          <span>{{ isFullscreen ? '⊡' : '⊞' }}</span>
        </button>
      </div>
    </header>

    <!-- Canvas 容器 -->
    <div class="canvas-container" ref="canvasContainerRef">
      <!-- 主 Canvas -->
      <canvas
        ref="canvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
        @click="onClick"
        @dblclick="onDoubleClick"
        @wheel="onWheel"
      ></canvas>

      <!-- Y轴标签 (推进距离) -->
      <div class="y-axis-label">
        <span>Advance distance (m)</span>
      </div>

      <!-- X轴标签 (支架号) -->
      <div class="x-axis-label">
        <span>Support position (number)</span>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>{{ loadingText || '加载中...' }}</p>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && !hasData" class="empty-state">
        <div class="empty-icon">📊</div>
        <p class="empty-title">{{ emptyText || '暂无数据' }}</p>
      </div>
    </div>

    <!-- 颜色图例 -->
    <div class="color-legend">
      <div class="legend-bar" :style="{ background: colorGradient }"></div>
      <div class="legend-labels">
        <span class="legend-min">{{ formatValue(colorScaleMin) }}</span>
        <span class="legend-mid">{{ formatValue((colorScaleMin + colorScaleMax) / 2) }}</span>
        <span class="legend-max">{{ formatValue(colorScaleMax) }}</span>
      </div>
      <span class="legend-unit">MPa</span>
    </div>

    <!-- 悬停提示框 -->
    <Transition name="tooltip-fade">
      <div
        v-if="hoveredCell && showTooltip"
        class="heatmap-tooltip"
        :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
      >
        <div class="tooltip-header">
          <span class="tooltip-panel-label">A</span>
          <span class="tooltip-title">Cell Info</span>
        </div>
        <div class="tooltip-body">
          <div class="tooltip-row">
            <span class="tooltip-label">Support</span>
            <span class="tooltip-value">#{{ hoveredCell.supportId }}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">Date</span>
            <span class="tooltip-value">{{ formatDate(hoveredCell.date) }}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">Advance</span>
            <span class="tooltip-value">{{ hoveredCell.advanceDistance.toFixed(1) }} m</span>
          </div>
          <div class="tooltip-row highlight">
            <span class="tooltip-label">Resistance</span>
            <span class="tooltip-value">{{ formatValue(hoveredCell.value) }} MPa</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">s.d.</span>
            <span class="tooltip-value">±{{ formatValue(hoveredCell.std) }}</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">n</span>
            <span class="tooltip-value">{{ hoveredCell.count }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 统计信息面板 -->
    <div v-if="showStats && stats" class="stats-panel">
      <div class="stat-item">
        <span class="stat-label">Mean</span>
        <span class="stat-value">{{ formatValue(stats.mean) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">s.d.</span>
        <span class="stat-value">±{{ formatValue(stats.std) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Min</span>
        <span class="stat-value">{{ formatValue(stats.min) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Max</span>
        <span class="stat-value">{{ formatValue(stats.max) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { PRESSURE_CONFIG, getDateKey } from '@/utils/pressureDataProcessor'

// ============================================================================
// Props & Emits
// ============================================================================

const props = defineProps({
  title: { type: String, default: 'End Resistance Heatmap' },
  subtitle: String,

  // 数据
  matrix: { type: Array, default: () => [] },
  cells: { type: Array, default: () => [] },
  stats: { type: Object, default: null },
  numRows: { type: Number, default: 0 },
  numCols: { type: Number, default: 0 },

  // 日期范围
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },

  // 显示选项
  colorScale: { type: String, default: 'diverging' },
  showTooltip: { type: Boolean, default: true },
  showStats: { type: Boolean, default: true },
  showGrid: { type: Boolean, default: false },

  // 状态
  loading: { type: Boolean, default: false },
  loadingText: String,
  emptyText: String
})

const emit = defineEmits(['cell-select', 'cell-hover', 'export', 'view-change'])

// ============================================================================
// Refs
// ============================================================================

const containerRef = ref(null)
const canvasContainerRef = ref(null)
const canvasRef = ref(null)

const currentViewMode = ref('heatmap')
const hoveredCell = ref(null)
const tooltipX = ref(0)
const tooltipY = ref(0)
const isFullscreen = ref(false)

// 缩放和平移状态
const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)

// ============================================================================
// Constants
// ============================================================================

const viewModes = [
  { id: 'heatmap', title: '热力图', icon: '▦' },
  { id: 'contour', title: '等值线', icon: '◎' }
]

const COLORS = PRESSURE_CONFIG.colorScale

// ============================================================================
// Computed
// ============================================================================

const hasData = computed(() => {
  return props.matrix && props.matrix.length > 0 && props.matrix[0]?.length > 0
})

const canvasWidth = computed(() => {
  if (canvasContainerRef.value) {
    return canvasContainerRef.value.clientWidth - 80 // 留出轴标签空间
  }
  return 800
})

const canvasHeight = computed(() => {
  if (canvasContainerRef.value) {
    return canvasContainerRef.value.clientHeight - 60
  }
  return 500
})

const colorScaleMin = computed(() => {
  if (!hasData.value) return 0
  const values = props.matrix.flat().filter(v => Number.isFinite(v))
  return Math.min(...values)
})

const colorScaleMax = computed(() => {
  if (!hasData.value) return 60
  const values = props.matrix.flat().filter(v => Number.isFinite(v))
  return Math.max(...values)
})

const colorGradient = computed(() => {
  const colors = COLORS[props.colorScale] || COLORS.diverging
  return `linear-gradient(to right, ${colors.join(', ')})`
})

// ============================================================================
// Methods
// ============================================================================

/**
 * 格式化数值
 */
function formatValue(val) {
  if (!Number.isFinite(val)) return '-'
  return val.toFixed(1)
}

/**
 * 格式化日期
 */
function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * 获取颜色
 */
function getColor(value, min, max) {
  if (!Number.isFinite(value)) return 'transparent'

  const colors = COLORS[props.colorScale] || COLORS.diverging
  const t = (value - min) / (max - min)

  // 简单的线性插值
  if (t <= 0) return colors[0]
  if (t >= 1) return colors[colors.length - 1]

  const idx = t * (colors.length - 1)
  const lower = Math.floor(idx)
  const upper = Math.ceil(idx)
  const frac = idx - lower

  if (lower === upper) return colors[lower]

  // 颜色插值
  return interpolateColor(colors[lower], colors[upper], frac)
}

/**
 * 颜色插值
 */
function interpolateColor(color1, color2, t) {
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)

  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)

  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)

  return `rgb(${r}, ${g}, ${b})`
}

/**
 * 绘制热力图
 */
function drawHeatmap() {
  const canvas = canvasRef.value
  if (!canvas || !hasData.value) return

  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height

  // 清空画布
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  const rows = props.numRows
  const cols = props.numCols

  // 计算单元格大小
  const marginLeft = 50
  const marginBottom = 40
  const plotWidth = width - marginLeft
  const plotHeight = height - marginBottom

  const cellWidth = plotWidth / cols
  const cellHeight = plotHeight / rows

  const min = colorScaleMin.value
  const max = colorScaleMax.value

  // 绘制热力图单元格
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const value = props.matrix[row]?.[col]
      if (!Number.isFinite(value)) continue

      const x = marginLeft + col * cellWidth
      const y = row * cellHeight

      ctx.fillStyle = getColor(value, min, max)
      ctx.fillRect(x, y, cellWidth + 0.5, cellHeight + 0.5)
    }
  }

  // 绘制网格线
  if (props.showGrid) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.lineWidth = 0.5

    for (let i = 0; i <= cols; i += 10) {
      const x = marginLeft + i * cellWidth
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, plotHeight)
      ctx.stroke()
    }

    for (let i = 0; i <= rows; i += 10) {
      const y = i * cellHeight
      ctx.beginPath()
      ctx.moveTo(marginLeft, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  // 绘制坐标轴
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 0.5
  ctx.font = '7pt Arial'
  ctx.fillStyle = '#000000'

  // Y轴刻度 (推进距离)
  const yTicks = 5
  for (let i = 0; i <= yTicks; i++) {
    const y = (i / yTicks) * plotHeight
    const distance = (rows - (i / yTicks) * rows) * 10 // 10m/天

    ctx.beginPath()
    ctx.moveTo(marginLeft - 5, y)
    ctx.lineTo(marginLeft, y)
    ctx.stroke()

    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.fillText(Math.round(distance).toString(), marginLeft - 8, y)
  }

  // X轴刻度 (支架号)
  const xTicks = 5
  for (let i = 0; i <= xTicks; i++) {
    const x = marginLeft + (i / xTicks) * plotWidth
    const supportNum = Math.round((i / xTicks) * cols) + 1

    ctx.beginPath()
    ctx.moveTo(x, plotHeight)
    ctx.lineTo(x, plotHeight + 5)
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(supportNum.toString(), x, plotHeight + 8)
  }
}

/**
 * 获取鼠标位置的单元格
 */
function getCellAtEvent(event) {
  if (!hasData.value || !canvasRef.value) return null

  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const marginLeft = 50
  const marginBottom = 40
  const plotWidth = canvas.width - marginLeft
  const plotHeight = canvas.height - marginBottom

  const cellWidth = plotWidth / props.numCols
  const cellHeight = plotHeight / props.numRows

  const col = Math.floor((x - marginLeft) / cellWidth)
  const row = Math.floor(y / cellHeight)

  if (col >= 0 && col < props.numCols && row >= 0 && row < props.numRows) {
    // 查找对应的单元格数据
    const cell = props.cells.find(c => c.row === row && c.col === col)
    if (cell) {
      return {
        ...cell,
        advanceDistance: row * 10 // 10m/天
      }
    }
  }

  return null
}

/**
 * 鼠标移动事件
 */
function onMouseMove(event) {
  const cell = getCellAtEvent(event)
  hoveredCell.value = cell

  if (cell && props.showTooltip) {
    const container = containerRef.value
    const rect = container.getBoundingClientRect()
    tooltipX.value = event.clientX - rect.left + 15
    tooltipY.value = event.clientY - rect.top + 15
  }

  emit('cell-hover', cell)
}

/**
 * 鼠标离开事件
 */
function onMouseLeave() {
  hoveredCell.value = null
  emit('cell-hover', null)
}

/**
 * 点击事件
 */
function onClick(event) {
  const cell = getCellAtEvent(event)
  if (cell) {
    emit('cell-select', cell)
  }
}

/**
 * 双击事件
 */
function onDoubleClick() {
  resetView()
}

/**
 * 滚轮缩放
 */
function onWheel(event) {
  event.preventDefault()
  const delta = event.deltaY > 0 ? 0.9 : 1.1
  scale.value = Math.max(0.5, Math.min(4, scale.value * delta))
  drawHeatmap()
}

/**
 * 重置视图
 */
function resetView() {
  scale.value = 1
  offsetX.value = 0
  offsetY.value = 0
  hoveredCell.value = null
  drawHeatmap()
}

/**
 * 设置视图模式
 */
function setViewMode(mode) {
  currentViewMode.value = mode
  emit('view-change', mode)
  drawHeatmap()
}

/**
 * 导出图片
 */
function exportImage() {
  const canvas = canvasRef.value
  if (!canvas) return

  const link = document.createElement('a')
  link.download = `${props.title || 'pressure-heatmap'}.png`
  link.href = canvas.toDataURL('image/png', 1.0)
  link.click()

  emit('export')
}

/**
 * 切换全屏
 */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    containerRef.value?.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
  window.addEventListener('resize', handleResize)
  if (hasData.value) {
    drawHeatmap()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  if (hasData.value) {
    setTimeout(drawHeatmap, 100)
  }
}

// 监听数据变化
watch(() => [props.matrix, props.cells], () => {
  if (hasData.value) {
    drawHeatmap()
  }
}, { deep: true })
</script>

<style scoped>
.pressure-heatmap {
  --hm-bg: #ffffff;
  --hm-border: #e2e8f0;
  --hm-text: #1e293b;
  --hm-text-secondary: #64748b;
  --hm-primary: #0f766e;
  --hm-tooltip-bg: rgba(15, 23, 42, 0.95);

  display: flex;
  flex-direction: column;
  background: var(--hm-bg);
  border: 1px solid var(--hm-border);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-size: 7pt;
}

/* Header */
.heatmap-header {
  padding: 8px 12px;
  border-bottom: 1px solid var(--hm-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.heatmap-title {
  margin: 0;
  font-size: 9pt;
  font-weight: 600;
  color: var(--hm-text);
}

.heatmap-subtitle {
  margin: 0;
  font-size: 7pt;
  color: var(--hm-text-secondary);
}

.header-right {
  display: flex;
  gap: 6px;
  align-items: center;
}

.view-toggle {
  display: flex;
  gap: 2px;
  border: 1px solid var(--hm-border);
  border-radius: 3px;
  overflow: hidden;
}

.view-btn {
  width: 28px;
  height: 24px;
  border: none;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.view-btn:hover {
  background: #f1f5f9;
}

.view-btn.active {
  background: var(--hm-primary);
  color: white;
}

.view-icon {
  font-size: 12px;
}

.icon-btn {
  width: 28px;
  height: 24px;
  border: 1px solid var(--hm-border);
  background: white;
  color: var(--hm-text-secondary);
  cursor: pointer;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-size: 12px;
}

.icon-btn:hover {
  background: #f1f5f9;
  color: var(--hm-primary);
  border-color: var(--hm-primary);
}

/* Canvas Container */
.canvas-container {
  position: relative;
  flex: 1;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-container canvas {
  display: block;
  cursor: crosshair;
}

/* Axis Labels */
.y-axis-label {
  position: absolute;
  left: 0;
  top: 50%;
  transform: rotate(-90deg) translateX(-50%);
  transform-origin: left center;
  font-size: 8pt;
  color: var(--hm-text);
  white-space: nowrap;
}

.x-axis-label {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8pt;
  color: var(--hm-text);
  white-space: nowrap;
}

/* Color Legend */
.color-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid var(--hm-border);
  background: #fafafa;
}

.legend-bar {
  flex: 1;
  height: 10px;
  border-radius: 2px;
  max-width: 200px;
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  flex: 1;
  max-width: 200px;
}

.legend-min,
.legend-mid,
.legend-max {
  font-size: 7pt;
  color: var(--hm-text-secondary);
}

.legend-unit {
  font-size: 7pt;
  color: var(--hm-text);
  font-weight: 500;
}

/* Tooltip */
.heatmap-tooltip {
  position: absolute;
  pointer-events: none;
  z-index: 100;
  background: white;
  border: 1px solid var(--hm-border);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  font-size: 7pt;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.15s;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}

.tooltip-header {
  padding: 6px 10px;
  background: var(--hm-tooltip-bg);
  border-radius: 3px 3px 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tooltip-panel-label {
  font-weight: 700;
  font-size: 8pt;
  color: white;
}

.tooltip-title {
  color: white;
  font-weight: 500;
}

.tooltip-body {
  padding: 8px 10px;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 3px 0;
}

.tooltip-row.highlight {
  background: #f0fdf4;
  margin: 0 -10px;
  padding: 3px 10px;
}

.tooltip-label {
  color: var(--hm-text-secondary);
}

.tooltip-value {
  color: var(--hm-text);
  font-weight: 500;
}

/* Stats Panel */
.stats-panel {
  display: flex;
  gap: 16px;
  padding: 8px 12px;
  border-top: 1px solid var(--hm-border);
  background: #fafafa;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 7pt;
  color: var(--hm-text-secondary);
}

.stat-value {
  font-size: 8pt;
  font-weight: 600;
  color: var(--hm-text);
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
  width: 28px;
  height: 28px;
  border: 3px solid var(--hm-border);
  border-top-color: var(--hm-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.empty-title {
  font-size: 9pt;
  color: var(--hm-text-secondary);
}

/* Fullscreen */
.pressure-heatmap:fullscreen {
  padding: 12px;
}

.pressure-heatmap:fullscreen .canvas-container {
  min-height: calc(100vh - 150px);
}
</style>
