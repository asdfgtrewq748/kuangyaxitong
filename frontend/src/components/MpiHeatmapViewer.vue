<template>
  <div class="mpi-heatmap-viewer">
    <!-- 加载骨架屏 -->
    <div v-if="loading" class="heatmap-skeleton">
      <div class="skeleton-header">
        <div class="skeleton-title"></div>
        <div class="skeleton-subtitle"></div>
      </div>
      <div class="skeleton-grid">
        <div v-for="i in 9" :key="i" class="skeleton-cell"></div>
      </div>
      <div class="skeleton-spinner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
          </path>
        </svg>
      </div>
    </div>

    <!-- 热力图显示区域 -->
    <div v-else ref="stageRef" class="heatmap-stage" @mousemove="handleMouseMove" @mouseleave="clearHover" tabindex="0" @keydown.esc="clearHover">
      <!-- 图像模式 -->
      <img
        v-if="mode === 'image' && imageUrl"
        ref="imageRef"
        :src="imageUrl"
        class="heatmap-image"
        loading="lazy"
        decoding="async"
        @load="syncCanvas"
        @error="handleImageError"
        alt="MPI热力图"
      />

      <!-- 图像加载失败/空状态 -->
      <div v-else-if="mode === 'image' && !imageUrl" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        <p class="empty-text">{{ imageError || '暂无热力图图片' }}</p>
        <button v-if="imageError" class="btn-retry" @click="$emit('retry')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
          </svg>
          重试
        </button>
      </div>

      <!-- Canvas模式 -->
      <canvas
        v-if="mode === 'canvas'"
        ref="heatmapCanvas"
        class="heatmap-canvas"
      ></canvas>

      <!-- Canvas空状态 -->
      <div v-if="mode === 'canvas' && isEmpty" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        </div>
        <p class="empty-text">暂无MPI网格数据</p>
      </div>

      <!-- 覆盖层Canvas -->
      <canvas ref="overlayCanvas" class="overlay-canvas"></canvas>

      <!-- 悬停提示框 -->
      <Transition name="tooltip-fade">
        <div v-if="hover" class="hover-tooltip" :style="hoverStyle" role="tooltip" :aria-label="`MPI值: ${hover.value?.toFixed(2)}`">
          <div class="tooltip-header">
            <svg class="tooltip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span class="tooltip-title">MPI综合指标</span>
          </div>
          <div class="tooltip-body">
            <div class="tooltip-row">
              <span class="tooltip-label">X坐标</span>
              <span class="tooltip-value">{{ hover.x.toFixed(1) }} m</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-label">Y坐标</span>
              <span class="tooltip-value">{{ hover.y.toFixed(1) }} m</span>
            </div>
            <div class="tooltip-divider"></div>
            <div class="tooltip-row tooltip-row-highlight">
              <span class="tooltip-label">MPI值</span>
              <span class="tooltip-value tooltip-value-primary">{{ hover.value?.toFixed(3) }}</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-label">风险等级</span>
              <span :class="['tooltip-badge', getRiskClass(hover.value)]">{{ getRiskLevel(hover.value) }}</span>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 导出按钮 -->
      <div class="export-actions">
        <button class="btn-export" @click="handleExport" :title="'导出热力图'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>
        <button class="btn-export" @click="handleFullscreen" :title="'全屏显示'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  mode: { type: String, default: 'image' },
  imageUrl: { type: String, default: '' },
  grid: { type: Array, default: () => [] },
  bounds: { type: Object, default: null },
  workface: { type: Object, default: null },
  showBoundary: { type: Boolean, default: true },
  showMask: { type: Boolean, default: true },
  palette: { type: Array, default: () => [] },
  size: { type: Number, default: 560 },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['hover', 'imageError', 'retry', 'export', 'fullscreen'])

const stageRef = ref(null)
const imageRef = ref(null)
const heatmapCanvas = ref(null)
const overlayCanvas = ref(null)
const hover = ref(null)
const hoverPos = ref({ x: 0, y: 0 })
const imageError = ref('')

const hoverStyle = computed(() => ({
  left: `${hoverPos.value.x + 16}px`,
  top: `${hoverPos.value.y + 16}px`
}))

const isEmpty = computed(() => !props.grid || props.grid.length === 0)

const defaultPalette = [
  '#3b82f6',
  '#facc15',
  '#fb923c',
  '#f87171',
  '#dc2626'
]

const activePalette = computed(() => (props.palette && props.palette.length ? props.palette : defaultPalette))

const subplotPadding = {
  left: 0.10,
  top: 0.10,
  width: 0.85,
  height: 0.80
}

// 风险等级判断
const getRiskLevel = (value) => {
  if (value === null || value === undefined) return '未知'
  if (value >= 0.7) return '低风险'
  if (value >= 0.4) return '中等风险'
  return '高风险'
}

const getRiskClass = (value) => {
  if (value === null || value === undefined) return 'risk-unknown'
  if (value >= 0.7) return 'risk-low'
  if (value >= 0.4) return 'risk-medium'
  return 'risk-high'
}

// 导出功能
const handleExport = () => {
  if (props.mode === 'image' && props.imageUrl) {
    // 触发图片下载
    const link = document.createElement('a')
    link.href = props.imageUrl
    link.download = `MPI热力图_${new Date().toISOString().slice(0, 10)}.png`
    link.click()
  } else if (props.mode === 'canvas' && heatmapCanvas.value) {
    // 导出Canvas
    const link = document.createElement('a')
    link.download = `MPI热力图_${new Date().toISOString().slice(0, 10)}.png`
    link.href = heatmapCanvas.value.toDataURL('image/png')
    link.click()
  }
  emit('export')
}

const handleFullscreen = () => {
  if (stageRef.value) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      stageRef.value.requestFullscreen()
    }
  }
  emit('fullscreen')
}

const syncCanvas = async () => {
  await nextTick()
  const stage = stageRef.value
  if (!stage) return
  const rect = stage.getBoundingClientRect()
  const width = Math.floor(rect.width)
  const height = Math.floor(rect.height)
  const pixelRatio = window.devicePixelRatio || 1

  const overlay = overlayCanvas.value
  if (overlay) {
    overlay.width = width * pixelRatio
    overlay.height = height * pixelRatio
    overlay.style.width = `${width}px`
    overlay.style.height = `${height}px`
    const ctx = overlay.getContext('2d')
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  }

  const baseCanvas = heatmapCanvas.value
  if (baseCanvas && props.mode === 'canvas') {
    baseCanvas.width = width * pixelRatio
    baseCanvas.height = height * pixelRatio
    baseCanvas.style.width = `${width}px`
    baseCanvas.style.height = `${height}px`
    const ctx = baseCanvas.getContext('2d')
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  }

  drawHeatmap()
  drawOverlay()
}

const handleImageError = () => {
  imageError.value = '热力图图片加载失败'
  emit('imageError')
}

const getPlotRect = () => {
  const stage = stageRef.value
  if (!stage) return null
  const stageRect = stage.getBoundingClientRect()
  let left = 0
  let top = 0
  let width = stageRect.width
  let height = stageRect.height

  if (props.mode === 'image' && imageRef.value) {
    const imgRect = imageRef.value.getBoundingClientRect()
    left = imgRect.left - stageRect.left
    top = imgRect.top - stageRect.top
    width = imgRect.width
    height = imgRect.height
  }

  return {
    x: left + width * subplotPadding.left,
    y: top + height * subplotPadding.top,
    width: width * subplotPadding.width,
    height: height * subplotPadding.height
  }
}

const worldToCanvas = (x, y) => {
  if (!props.bounds) return { x: 0, y: 0 }
  const plot = getPlotRect()
  if (!plot) return { x: 0, y: 0 }

  const rangeX = props.bounds.max_x - props.bounds.min_x
  const rangeY = props.bounds.max_y - props.bounds.min_y
  const tx = (x - props.bounds.min_x) / (rangeX || 1)
  const ty = (props.bounds.max_y - y) / (rangeY || 1)

  return {
    x: plot.x + tx * plot.width,
    y: plot.y + ty * plot.height
  }
}

const canvasToWorld = (cx, cy) => {
  if (!props.bounds) return null
  const plot = getPlotRect()
  if (!plot) return null
  if (cx < plot.x || cy < plot.y || cx > plot.x + plot.width || cy > plot.y + plot.height) return null

  const tx = (cx - plot.x) / plot.width
  const ty = (cy - plot.y) / plot.height

  return {
    x: props.bounds.min_x + tx * (props.bounds.max_x - props.bounds.min_x),
    y: props.bounds.max_y - ty * (props.bounds.max_y - props.bounds.min_y)
  }
}

const getGridValue = (world) => {
  if (!world || !props.grid || props.grid.length === 0) return null
  const rows = props.grid.length
  const cols = props.grid[0]?.length || 0
  if (rows === 0 || cols === 0) return null

  const rangeX = props.bounds.max_x - props.bounds.min_x
  const rangeY = props.bounds.max_y - props.bounds.min_y
  const col = Math.min(cols - 1, Math.max(0, Math.round(((world.x - props.bounds.min_x) / (rangeX || 1)) * (cols - 1))))
  const row = Math.min(rows - 1, Math.max(0, Math.round(((world.y - props.bounds.min_y) / (rangeY || 1)) * (rows - 1))))

  const value = props.grid[row]?.[col]
  return Number.isFinite(value) ? value : null
}

const handleMouseMove = (event) => {
  const rect = stageRef.value?.getBoundingClientRect()
  if (!rect) return
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  hoverPos.value = { x, y }

  const world = canvasToWorld(x, y)
  if (!world) {
    hover.value = null
    emit('hover', null)
    return
  }

  const value = getGridValue(world)
  if (value === null || value === undefined) {
    hover.value = null
    emit('hover', null)
    return
  }

  const info = { x: world.x, y: world.y, value }
  hover.value = info
  emit('hover', info)
}

const clearHover = () => {
  hover.value = null
  emit('hover', null)
}

const getColor = (t) => {
  const colors = activePalette.value
  const idx = t * (colors.length - 1)
  const i = Math.floor(idx)
  const f = idx - i

  const c1 = colors[Math.min(i, colors.length - 1)]
  const c2 = colors[Math.min(i + 1, colors.length - 1)]

  const toRgb = (hex) => {
    const raw = hex.replace('#', '')
    const r = parseInt(raw.slice(0, 2), 16)
    const g = parseInt(raw.slice(2, 4), 16)
    const b = parseInt(raw.slice(4, 6), 16)
    return { r, g, b }
  }

  const a = toRgb(c1)
  const b = toRgb(c2)
  const r = Math.round(a.r + (b.r - a.r) * f)
  const g = Math.round(a.g + (b.g - a.g) * f)
  const bVal = Math.round(a.b + (b.b - a.b) * f)
  return `rgb(${r}, ${g}, ${bVal})`
}

const drawHeatmap = () => {
  if (props.mode !== 'canvas') return
  if (!heatmapCanvas.value || !props.grid || props.grid.length === 0) return

  const ctx = heatmapCanvas.value.getContext('2d')
  const plot = getPlotRect()
  if (!plot) return

  ctx.clearRect(0, 0, heatmapCanvas.value.width, heatmapCanvas.value.height)

  const rows = props.grid.length
  const cols = props.grid[0]?.length || 0

  let min = Infinity
  let max = -Infinity
  for (const row of props.grid) {
    for (const v of row) {
      if (!Number.isFinite(v)) continue
      if (v < min) min = v
      if (v > max) max = v
    }
  }
  const range = max - min || 1

  const cellW = plot.width / cols
  const cellH = plot.height / rows

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const v = props.grid[i][j]
      if (!Number.isFinite(v)) continue
      const t = (v - min) / range
      ctx.fillStyle = getColor(t)
      ctx.fillRect(plot.x + j * cellW, plot.y + i * cellH, cellW + 0.5, cellH + 0.5)
    }
  }
}

const drawOverlay = () => {
  if (!overlayCanvas.value) return
  const ctx = overlayCanvas.value.getContext('2d')
  const rect = overlayCanvas.value.getBoundingClientRect()
  ctx.clearRect(0, 0, rect.width, rect.height)

  if (!props.workface || !props.bounds) return

  const points = props.workface.type === 'polygon'
    ? props.workface.points
    : [
        [props.workface.bounds.min_x, props.workface.bounds.min_y],
        [props.workface.bounds.max_x, props.workface.bounds.min_y],
        [props.workface.bounds.max_x, props.workface.bounds.max_y],
        [props.workface.bounds.min_x, props.workface.bounds.max_y]
      ]

  if (!points || points.length < 3) return

  ctx.save()
  ctx.beginPath()
  points.forEach((p, idx) => {
    const pos = worldToCanvas(p[0], p[1])
    if (idx === 0) ctx.moveTo(pos.x, pos.y)
    else ctx.lineTo(pos.x, pos.y)
  })
  ctx.closePath()

  if (props.showMask) {
    ctx.fillStyle = 'rgba(37, 99, 235, 0.18)'
    ctx.fill()
  }

  if (props.showBoundary) {
    ctx.strokeStyle = 'rgba(30, 64, 175, 0.9)'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.stroke()
    ctx.setLineDash([])
  }

  ctx.restore()
}

watch(
  () => [props.mode, props.grid, props.bounds, props.workface, props.showBoundary, props.showMask, props.imageUrl],
  () => {
    if (props.imageUrl) {
      imageError.value = ''
    }
    syncCanvas()
  },
  { deep: true }
)

onMounted(() => {
  window.addEventListener('resize', syncCanvas)
  syncCanvas()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncCanvas)
})
</script>

<style scoped>
.mpi-heatmap-viewer {
  width: 100%;
}

/* 骨架屏样式 */
.heatmap-skeleton {
  position: relative;
  width: 100%;
  height: 560px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  box-shadow: var(--shadow-sm);
}

.skeleton-header {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
}

.skeleton-title {
  height: 24px;
  width: 200px;
  background: linear-gradient(90deg, var(--border-color) 25%, var(--bg-tertiary) 50%, var(--border-color) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-sm);
}

.skeleton-subtitle {
  height: 14px;
  width: 300px;
  background: linear-gradient(90deg, var(--border-color) 25%, var(--bg-tertiary) 50%, var(--border-color) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--border-radius-sm);
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
}

.skeleton-cell {
  aspect-ratio: 1;
  background: linear-gradient(135deg, var(--border-color) 0%, var(--bg-tertiary) 100%);
  border-radius: var(--border-radius-md);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  color: var(--color-primary);
}

.skeleton-spinner svg {
  width: 100%;
  height: 100%;
  animation: spin 1s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 热力图显示区域 */
.heatmap-stage {
  position: relative;
  width: 100%;
  height: 560px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.heatmap-stage:hover {
  box-shadow: var(--shadow-md);
}

.heatmap-stage:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(90, 99, 120, 0.1);
}

.heatmap-image,
.heatmap-canvas,
.overlay-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.heatmap-image {
  object-fit: contain;
  background: #ffffff;
}

/* 空状态 */
.empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  gap: var(--spacing-md);
  padding: var(--spacing-2xl);
}

.empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: var(--color-info-light);
  border-radius: var(--border-radius-lg);
  color: var(--color-info);
  transition: all var(--transition-normal);
}

.empty-state:hover .empty-icon {
  transform: scale(1.05);
}

.empty-icon svg {
  width: 32px;
  height: 32px;
}

.empty-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-tertiary);
}

.btn-retry {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--bg-primary);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-retry:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-retry svg {
  width: 16px;
  height: 16px;
}

/* Tooltip样式 */
.hover-tooltip {
  position: absolute;
  padding: 0;
  background: rgba(44, 53, 69, 0.95);
  backdrop-filter: blur(10px);
  color: #f8fafc;
  font-size: 12px;
  border-radius: var(--border-radius-md);
  min-width: 160px;
  pointer-events: none;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  overflow: hidden;
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(90, 99, 120, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tooltip-icon {
  width: 16px;
  height: 16px;
  color: #aab0c0;
}

.tooltip-title {
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.02em;
}

.tooltip-body {
  padding: var(--spacing-sm) var(--spacing-md);
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  line-height: 1.6;
  margin-bottom: var(--spacing-xs);
}

.tooltip-row:last-child {
  margin-bottom: 0;
}

.tooltip-row-highlight {
  background: rgba(90, 99, 120, 0.2);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  margin: var(--spacing-xs) 0;
}

.tooltip-label {
  color: #aab0c0;
  font-weight: 500;
}

.tooltip-value {
  font-weight: 500;
  color: #f1f5f9;
}

.tooltip-value-primary {
  color: #d0d5e0;
  font-size: 13px;
}

.tooltip-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: var(--spacing-xs) 0;
}

.tooltip-badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.risk-low {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.risk-medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.risk-high {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.risk-unknown {
  background: rgba(148, 163, 184, 0.2);
  color: #94a3b8;
}

/* Tooltip动画 */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tooltip-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 导出按钮 */
.export-actions {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
  z-index: 10;
}

.btn-export {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  color: var(--text-secondary);
}

.btn-export:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-export svg {
  width: 18px;
  height: 18px;
}

/* 响应式 */
@media (max-width: 768px) {
  .heatmap-stage,
  .heatmap-skeleton {
    height: 400px;
  }

  .skeleton-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .export-actions {
    flex-direction: column;
  }

  .hover-tooltip {
    min-width: 140px;
  }
}
</style>
