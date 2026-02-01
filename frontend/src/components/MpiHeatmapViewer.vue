<template>
  <div class="mpi-heatmap-viewer">
    <div ref="stageRef" class="heatmap-stage" @mousemove="handleMouseMove" @mouseleave="clearHover">
      <img
        v-if="mode === 'image' && imageUrl"
        ref="imageRef"
        :src="imageUrl"
        class="heatmap-image"
        @load="syncCanvas"
        @error="handleImageError"
      />
      <div v-else-if="mode === 'image' && !imageUrl" class="empty-image">
        <div class="empty-icon">🖼️</div>
        <p>{{ imageError || '暂无热力图图片' }}</p>
      </div>
      <canvas
        v-if="mode === 'canvas'"
        ref="heatmapCanvas"
        class="heatmap-canvas"
      ></canvas>
      <div v-if="mode === 'canvas' && isEmpty" class="empty-image">
        <div class="empty-icon">📊</div>
        <p>暂无MPI网格数据</p>
      </div>
      <canvas ref="overlayCanvas" class="overlay-canvas"></canvas>

      <div v-if="hover" class="hover-tooltip" :style="hoverStyle">
        <div class="tooltip-title">MPI</div>
        <div class="tooltip-row">X: {{ hover.x.toFixed(1) }}</div>
        <div class="tooltip-row">Y: {{ hover.y.toFixed(1) }}</div>
        <div class="tooltip-row">
          值: <strong>{{ hover.value?.toFixed(2) }}</strong>
        </div>
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
  size: { type: Number, default: 560 }
})

const emit = defineEmits(['hover', 'imageError'])

const stageRef = ref(null)
const imageRef = ref(null)
const heatmapCanvas = ref(null)
const overlayCanvas = ref(null)
const hover = ref(null)
const hoverPos = ref({ x: 0, y: 0 })
const imageError = ref('')

const hoverStyle = computed(() => ({
  left: `${hoverPos.value.x + 12}px`,
  top: `${hoverPos.value.y + 12}px`
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

.heatmap-stage {
  position: relative;
  width: 100%;
  height: 560px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: #f8fafc;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
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

.empty-image {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  gap: 6px;
}

.empty-icon {
  font-size: 32px;
}

.hover-tooltip {
  position: absolute;
  padding: 10px 12px;
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
  font-size: 12px;
  border-radius: 10px;
  min-width: 110px;
  pointer-events: none;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.4);
}

.tooltip-title {
  font-weight: 700;
  margin-bottom: 4px;
}

.tooltip-row {
  line-height: 1.4;
}
</style>
