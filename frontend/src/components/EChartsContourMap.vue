<template>
  <div class="canvas-contour-wrapper" :class="{ 'cross-section-mode': crossSectionMode }">
    <div class="figure-header">
      <div class="figure-copy">
        <span class="figure-kicker">{{ crossSectionMode ? 'Cross-section mode' : 'Interpolated surface' }}</span>
        <h3 class="figure-title">{{ resolvedPropertyLabel }} contour plate</h3>
        <p class="figure-story">{{ figureStory }}</p>
      </div>
      <div class="figure-highlights">
        <div
          v-for="item in mapHighlights"
          :key="item.label"
          class="highlight-chip"
          :class="item.tone ? `tone-${item.tone}` : ''"
        >
          <span class="highlight-label">{{ item.label }}</span>
          <strong class="highlight-value">{{ item.value }}</strong>
        </div>
      </div>
    </div>

    <div ref="container" class="canvas-container">
      <canvas ref="heatmapCanvas" class="heatmap-layer"></canvas>
      <canvas ref="overlayCanvas" class="overlay-layer"></canvas>

      <div class="north-arrow" aria-hidden="true">
        <span class="north-label">N</span>
        <span class="north-stem"></span>
      </div>

      <div v-if="scaleBar" class="scale-bar">
        <span class="scale-bar-rule" :style="{ width: `${scaleBar.widthPercent}%` }"></span>
        <span class="scale-bar-label">{{ scaleBar.label }}</span>
      </div>
    </div>

    <!-- Legend -->
    <div v-if="valueRange" class="legend">
      <div class="legend-title">{{ resolvedPropertyLabel }}</div>
      <div class="legend-bar">
        <div class="legend-gradient" :style="legendGradientStyle"></div>
      </div>
      <div class="legend-labels">
        <span>{{ valueRange.min?.toFixed(1) }}m</span>
        <span>{{ ((valueRange.min + valueRange.max) / 2).toFixed(1) }}m</span>
        <span>{{ valueRange.max?.toFixed(1) }}m</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="map-controls">
      <button class="control-btn" @click="zoomIn" title="放大">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5v14"/></svg>
      </button>
      <div class="zoom-level" :class="{ 'is-zoomed': scale !== 1 }">{{ Math.round(scale * 100) }}%</div>
      <button class="control-btn" @click="zoomOut" title="缩小">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
      </button>
      <button class="control-btn" @click="resetView" title="重置视图" :disabled="scale === 1 && offsetX === 0 && offsetY === 0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/><path d="M3 3v9h9"/></svg>
      </button>
      <div class="control-divider"></div>
      <button class="control-btn" @click="exportImage" title="导出图片">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </button>
    </div>

    <!-- Cross-section info -->
    <div v-if="crossSectionMode && crossSectionInfo.active" class="cross-section-info">
      <div class="info-row">
        <span class="info-label">起点:</span>
        <span class="info-value">({{ crossSectionInfo.start?.x?.toFixed(1) }}, {{ crossSectionInfo.start?.y?.toFixed(1) }})</span>
      </div>
      <div v-if="crossSectionInfo.end" class="info-row">
        <span class="info-label">终点:</span>
        <span class="info-value">({{ crossSectionInfo.end?.x?.toFixed(1) }}, {{ crossSectionInfo.end?.y?.toFixed(1) }})</span>
      </div>
      <div v-if="crossSectionInfo.distance" class="info-row">
        <span class="info-label">距离:</span>
        <span class="info-value">{{ crossSectionInfo.distance?.toFixed(1) }}m</span>
      </div>
    </div>

    <div v-if="crossSectionMode && !crossSectionInfo.active" class="mode-hint">
      点击两点绘制剖面线
    </div>

    <!-- Hover tooltip -->
    <div v-if="hoverInfo.show" class="hover-tooltip" :style="tooltipStyle" :class="{ 'is-borehole': hoverInfo.isBorehole }">
      <div class="tooltip-badge" v-if="!hoverInfo.isBorehole">插值</div>
      <div class="tooltip-title">{{ hoverInfo.name }}</div>
      <div class="tooltip-coords">({{ hoverInfo.x?.toFixed(1) }}, {{ hoverInfo.y?.toFixed(1) }})</div>
      <div class="tooltip-value">{{ resolvedPropertyLabel }}: {{ hoverInfo.value?.toFixed(2) }}m</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps({
  boreholes: { type: Array, default: () => [] },
  bounds: { type: Object, default: () => ({}) },
  property: { type: String, default: 'thickness' },
  propertyLabel: { type: String, default: '厚度' },
  valueRange: { type: Object, default: () => ({ min: 0, max: 10 }) },
  colormap: { type: String, default: 'YlOrBr' },
  crossSectionMode: { type: Boolean, default: false }
})

const emit = defineEmits(['crossSectionComplete'])

// Refs
const container = ref(null)
const heatmapCanvas = ref(null)
const overlayCanvas = ref(null)

// State
const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const gridData = ref([])
const hoverInfo = ref({ show: false, x: 0, y: 0, value: 0, name: '' })
const mousePos = ref({ x: 0, y: 0 })

// Cross-section state
const crossSectionInfo = ref({
  start: null,
  end: null,
  distance: null,
  active: false
})

// Color palettes matching AlgorithmValidation style
const PALETTES = {
  YlOrBr: ['#fffacc', '#ffe699', '#ffbe79', '#e68c50', '#a05032'],
  viridis: ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725']
}

const legendGradientStyle = computed(() => {
  const colors = PALETTES[props.colormap] || PALETTES.YlOrBr
  return { background: `linear-gradient(90deg, ${colors.join(',')})` }
})

const resolvedPropertyLabel = computed(() => {
  return props.propertyLabel && props.propertyLabel !== '鍘氬害'
    ? props.propertyLabel
    : 'Thickness'
})

const figureStory = computed(() => {
  const boreholeCount = props.boreholes?.length || 0
  const modeText = props.crossSectionMode
    ? 'Cross-section picking is active to support profile extraction.'
    : 'The plate emphasizes interpolated gradients and local borehole control.'
  return `IDW interpolation is generated from ${boreholeCount} boreholes across the study bounds. ${modeText}`
})

const mapHighlights = computed(() => {
  const boreholeCount = props.boreholes?.length || 0
  const rangeText = props.valueRange
    ? `${props.valueRange.min?.toFixed(1)}-${props.valueRange.max?.toFixed(1)} m`
    : '--'

  return [
    { label: 'Boreholes', value: boreholeCount, tone: 'focus' },
    { label: 'Range', value: rangeText, tone: 'positive' },
    { label: 'Mode', value: props.crossSectionMode ? 'Section picking' : 'Plan view', tone: 'alert' }
  ]
})

const scaleBar = computed(() => {
  const width = (props.bounds?.max_x ?? 0) - (props.bounds?.min_x ?? 0)
  if (!Number.isFinite(width) || width <= 0) return null

  const candidates = [10, 25, 50, 100, 200, 500, 1000]
  const target = width / 4
  const distance = candidates.find((item) => item >= target) || candidates[candidates.length - 1]
  return {
    label: `${distance} m`,
    widthPercent: Math.min((distance / width) * 100, 32)
  }
})

const tooltipStyle = computed(() => {
  const rect = container.value?.getBoundingClientRect()
  if (!rect) return { left: '0px', top: '0px' }

  let left = mousePos.value.x + 15
  let top = mousePos.value.y + 15

  // Prevent tooltip from going off the right edge
  const tooltipWidth = 180 // approximate max width
  if (left + tooltipWidth > rect.width) {
    left = mousePos.value.x - tooltipWidth - 10
  }

  // Prevent tooltip from going off the bottom edge
  const tooltipHeight = 100 // approximate max height
  if (top + tooltipHeight > rect.height) {
    top = mousePos.value.y - tooltipHeight - 10
  }

  return {
    left: Math.max(5, left) + 'px',
    top: Math.max(5, top) + 'px'
  }
})

// Interpolation function (IDW)
const interpolateValue = (x, y, points) => {
  let weightedSum = 0
  let weightSum = 0

  for (const p of points) {
    const value = p[props.property] ?? p.thickness ?? p.burial_depth
    if (value == null) continue

    const dist = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2)
    if (dist < 0.001) return value

    const weight = 1 / (dist ** 2)
    weightedSum += value * weight
    weightSum += weight
  }

  return weightSum > 0 ? weightedSum / weightSum : null
}

// Generate grid data
const generateGrid = () => {
  if (!props.bounds?.min_x || props.boreholes.length === 0) return []

  const { min_x, max_x, min_y, max_y } = props.bounds
  const gridSize = 80
  const grid = []

  for (let i = 0; i <= gridSize; i++) {
    const row = []
    const y = min_y + (i / gridSize) * (max_y - min_y)
    for (let j = 0; j <= gridSize; j++) {
      const x = min_x + (j / gridSize) * (max_x - min_x)
      row.push(interpolateValue(x, y, props.boreholes))
    }
    grid.push(row)
  }

  return grid
}

// Color interpolation
const getColor = (value) => {
  const min = props.valueRange?.min ?? 0
  const max = props.valueRange?.max ?? 1
  const t = Math.max(0, Math.min(1, (value - min) / (max - min || 1)))

  const palette = PALETTES[props.colormap] || PALETTES.YlOrBr
  const idx = t * (palette.length - 1)
  const i = Math.floor(idx)
  const f = idx - i

  if (i >= palette.length - 1) return palette[palette.length - 1]

  // Simple RGB interpolation
  const c1 = hexToRgb(palette[i])
  const c2 = hexToRgb(palette[i + 1])

  const r = Math.round(c1.r + (c2.r - c1.r) * f)
  const g = Math.round(c1.g + (c2.g - c1.g) * f)
  const b = Math.round(c1.b + (c2.b - c1.b) * f)

  return `rgb(${r}, ${g}, ${b})`
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

// Coordinate transforms
const worldToScreen = (wx, wy) => {
  if (!props.bounds) return { x: 0, y: 0 }
  const { min_x, max_x, min_y, max_y } = props.bounds
  const rect = container.value?.getBoundingClientRect()
  if (!rect) return { x: 0, y: 0 }

  const padding = { x: 24, y: 18 }
  const availW = rect.width - padding.x * 2
  const availH = rect.height - padding.y * 2

  const worldW = max_x - min_x
  const worldH = max_y - min_y

  const baseScale = Math.min(availW / worldW, availH / worldH)
  const s = baseScale * scale.value

  const cx = rect.width / 2 + offsetX.value
  const cy = rect.height / 2 + offsetY.value

  const x = cx + (wx - (min_x + max_x) / 2) * s
  const y = cy - (wy - (min_y + max_y) / 2) * s

  return { x, y, scale: s }
}

const screenToWorld = (sx, sy) => {
  if (!props.bounds) return { x: 0, y: 0 }
  const { min_x, max_x, min_y, max_y } = props.bounds
  const rect = container.value?.getBoundingClientRect()
  if (!rect) return { x: 0, y: 0 }

  const padding = { x: 24, y: 18 }
  const availW = rect.width - padding.x * 2
  const availH = rect.height - padding.y * 2

  const worldW = max_x - min_x
  const worldH = max_y - min_y

  const baseScale = Math.min(availW / worldW, availH / worldH)
  const s = baseScale * scale.value

  const cx = rect.width / 2 + offsetX.value
  const cy = rect.height / 2 + offsetY.value

  const x = (sx - cx) / s + (min_x + max_x) / 2
  const y = -(sy - cy) / s + (min_y + max_y) / 2

  return { x, y }
}

// Drawing functions
const drawHeatmap = () => {
  const canvas = heatmapCanvas.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx || !gridData.value.length) return

  const rect = container.value?.getBoundingClientRect()
  if (!rect) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  ctx.clearRect(0, 0, rect.width, rect.height)

  const { min_x, max_x, min_y, max_y } = props.bounds
  const rows = gridData.value.length
  const cols = gridData.value[0]?.length || 0

  // Draw grid cells
  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < cols - 1; j++) {
      const value = gridData.value[i][j]
      if (value == null) continue

      const wx = min_x + (j / (cols - 1)) * (max_x - min_x)
      const wy = min_y + (i / (rows - 1)) * (max_y - min_y)
      const p = worldToScreen(wx, wy)
      const p2 = worldToScreen(
        min_x + ((j + 1) / (cols - 1)) * (max_x - min_x),
        min_y + ((i + 1) / (rows - 1)) * (max_y - min_y)
      )

      ctx.fillStyle = getColor(value)
      ctx.fillRect(p.x, p2.y, p2.x - p.x + 1, p.y - p2.y + 1)
    }
  }
}

const drawOverlay = () => {
  const canvas = overlayCanvas.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  const rect = container.value?.getBoundingClientRect()
  if (!rect) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  ctx.clearRect(0, 0, rect.width, rect.height)

  // Draw cross-section line
  if (crossSectionInfo.value.start) {
    const p1 = worldToScreen(crossSectionInfo.value.start.x, crossSectionInfo.value.start.y)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 3
    ctx.setLineDash([8, 4])
    ctx.beginPath()
    ctx.arc(p1.x, p1.y, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#f59e0b'
    ctx.fill()
    ctx.fillStyle = '#f59e0b'
    ctx.font = 'bold 14px sans-serif'
    ctx.fillText('A', p1.x - 4, p1.y - 12)

    if (crossSectionInfo.value.end) {
      const p2 = worldToScreen(crossSectionInfo.value.end.x, crossSectionInfo.value.end.y)
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()

      ctx.setLineDash([])
      ctx.beginPath()
      ctx.arc(p2.x, p2.y, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillText("A'", p2.x - 6, p2.y - 12)

      // Draw arrow
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x)
      const arrowLen = 10
      ctx.beginPath()
      ctx.moveTo(p2.x, p2.y)
      ctx.lineTo(p2.x - arrowLen * Math.cos(angle - Math.PI / 6), p2.y - arrowLen * Math.sin(angle - Math.PI / 6))
      ctx.moveTo(p2.x, p2.y)
      ctx.lineTo(p2.x - arrowLen * Math.cos(angle + Math.PI / 6), p2.y - arrowLen * Math.sin(angle + Math.PI / 6))
      ctx.stroke()
    }
    ctx.setLineDash([])
  }

  // Draw boreholes
  for (const b of props.boreholes) {
    const p = worldToScreen(b.x, b.y)
    const value = b[props.property] ?? b.thickness ?? b.burial_depth

    // Outer white ring
    ctx.beginPath()
    ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.fill()

    // Colored center
    ctx.beginPath()
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
    ctx.fillStyle = getColor(value)
    ctx.fill()

    // Border
    ctx.strokeStyle = '#1e3a8a'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}

const render = () => {
  drawHeatmap()
  drawOverlay()
}

// Event handlers
const handlePointerDown = (e) => {
  if (e.button !== 0) return

  const rect = container.value?.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (props.crossSectionMode) {
    const world = screenToWorld(x, y)

    if (!crossSectionInfo.value.start) {
      crossSectionInfo.value.start = world
      crossSectionInfo.value.active = true
    } else if (!crossSectionInfo.value.end) {
      crossSectionInfo.value.end = world
      const dist = Math.sqrt(
        (world.x - crossSectionInfo.value.start.x) ** 2 +
        (world.y - crossSectionInfo.value.start.y) ** 2
      )
      crossSectionInfo.value.distance = dist

      emit('crossSectionComplete', {
        start: crossSectionInfo.value.start,
        end: crossSectionInfo.value.end,
        distance: dist,
        points: props.boreholes
      })
    } else {
      crossSectionInfo.value = { start: world, end: null, distance: null, active: true }
    }
    render()
    return
  }

  isDragging.value = true
  dragStart.value = { x: e.clientX - offsetX.value, y: e.clientY - offsetY.value }
  container.value?.setPointerCapture?.(e.pointerId)
}

const handlePointerMove = (e) => {
  const rect = container.value?.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  mousePos.value = { x, y }

  if (isDragging.value) {
    offsetX.value = e.clientX - dragStart.value.x
    offsetY.value = e.clientY - dragStart.value.y
    render()
    return
  }

  // Find nearest borehole for hover
  let nearest = null
  let minDist = Infinity

  for (const b of props.boreholes) {
    const p = worldToScreen(b.x, b.y)
    const dist = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2)
    if (dist < minDist && dist < 15) {
      minDist = dist
      nearest = b
    }
  }

  if (nearest) {
    hoverInfo.value = {
      show: true,
      x: nearest.x,
      y: nearest.y,
      value: nearest[props.property] ?? nearest.thickness ?? nearest.burial_depth,
      name: nearest.name || nearest.borehole || '钻孔',
      isBorehole: true
    }
  } else {
    // Show interpolated value at cursor position
    const world = screenToWorld(x, y)
    const value = interpolateValue(world.x, world.y, props.boreholes)
    if (value !== null) {
      hoverInfo.value = {
        show: true,
        x: world.x,
        y: world.y,
        value,
        name: '插值点',
        isBorehole: false
      }
    } else {
      hoverInfo.value.show = false
    }
  }
}

const handlePointerUp = () => {
  isDragging.value = false
}

const handlePointerLeave = () => {
  hoverInfo.value.show = false
  isDragging.value = false
}

const handleWheel = (e) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  scale.value = Math.max(0.5, Math.min(4, scale.value * delta))
  render()
}

// Controls
const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.2, 4)
  render()
}

const zoomOut = () => {
  scale.value = Math.max(scale.value / 1.2, 0.5)
  render()
}

const resetView = () => {
  scale.value = 1
  offsetX.value = 0
  offsetY.value = 0
  render()
}

const exportImage = () => {
  const canvas = heatmapCanvas.value
  if (!canvas) return

  // Create a temporary canvas to combine both layers
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = canvas.width
  tempCanvas.height = canvas.height
  const ctx = tempCanvas.getContext('2d')

  // Fill white background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

  // Draw heatmap layer
  ctx.drawImage(canvas, 0, 0)

  // Draw overlay layer
  if (overlayCanvas.value) {
    ctx.drawImage(overlayCanvas.value, 0, 0)
  }

  // Export
  const link = document.createElement('a')
  link.download = `contour-map-${props.property}-${Date.now()}.png`
  link.href = tempCanvas.toDataURL('image/png')
  link.click()
}

const resetCrossSection = () => {
  crossSectionInfo.value = { start: null, end: null, distance: null, active: false }
  render()
}

// Lifecycle
onMounted(() => {
  gridData.value = generateGrid()

  nextTick(() => {
    render()

    const el = container.value
    if (el) {
      el.addEventListener('pointerdown', handlePointerDown)
      el.addEventListener('pointermove', handlePointerMove)
      el.addEventListener('pointerup', handlePointerUp)
      el.addEventListener('pointerleave', handlePointerLeave)
      el.addEventListener('wheel', handleWheel, { passive: false })
    }
  })
})

onBeforeUnmount(() => {
  const el = container.value
  if (el) {
    el.removeEventListener('pointerdown', handlePointerDown)
    el.removeEventListener('pointermove', handlePointerMove)
    el.removeEventListener('pointerup', handlePointerUp)
    el.removeEventListener('pointerleave', handlePointerLeave)
    el.removeEventListener('wheel', handleWheel)
  }
})

watch(() => [props.boreholes, props.bounds, props.property], () => {
  gridData.value = generateGrid()
  render()
}, { deep: true })

watch(() => props.crossSectionMode, (isMode) => {
  if (!isMode) resetCrossSection()
})

defineExpose({
  resetView,
  resetCrossSection,
  crossSectionInfo
})
</script>

<style scoped>
.canvas-contour-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background:
    radial-gradient(circle at top left, rgba(195, 138, 45, 0.08), transparent 28%),
    linear-gradient(180deg, #fffef9 0%, #fffdfa 100%);
  border: 1px solid rgba(143, 115, 76, 0.14);
  border-radius: 18px;
  box-shadow: 0 16px 38px rgba(31, 41, 55, 0.08);
  overflow: hidden;
}

.canvas-contour-wrapper.cross-section-mode {
  cursor: crosshair;
}

.figure-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.figure-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 64ch;
}

.figure-kicker {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #8b6b46;
}

.figure-title {
  margin: 0;
  color: #241d14;
  font-size: 18px;
  font-weight: 700;
  font-family: "Source Han Serif SC", "Noto Serif SC", "Times New Roman", serif;
}

.figure-story {
  margin: 0;
  color: #5b4631;
  font-size: 12px;
  line-height: 1.6;
}

.figure-highlights {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.highlight-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(115, 90, 61, 0.14);
  background: rgba(255, 255, 255, 0.86);
}

.highlight-chip.tone-focus {
  border-color: rgba(137, 92, 38, 0.22);
  background: rgba(137, 92, 38, 0.08);
}

.highlight-chip.tone-positive {
  border-color: rgba(50, 117, 76, 0.22);
  background: rgba(50, 117, 76, 0.08);
}

.highlight-chip.tone-alert {
  border-color: rgba(179, 92, 55, 0.22);
  background: rgba(179, 92, 55, 0.08);
}

.highlight-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7a5b3f;
}

.highlight-value {
  font-size: 12px;
  color: #2d241a;
}

.canvas-container {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 420px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: #f8fafc;
}

.heatmap-layer,
.overlay-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.overlay-layer {
  pointer-events: none;
}

.north-arrow {
  position: absolute;
  top: 18px;
  left: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  z-index: 12;
}

.north-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: #475569;
}

.north-stem {
  position: relative;
  width: 2px;
  height: 26px;
  background: linear-gradient(180deg, #0f766e 0%, #1e293b 100%);
}

.north-stem::before {
  content: "";
  position: absolute;
  top: -6px;
  left: -5px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 10px solid #0f766e;
}

.scale-bar {
  position: absolute;
  right: 18px;
  bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  z-index: 12;
}

.scale-bar-rule {
  display: inline-block;
  height: 6px;
  min-width: 48px;
  background: linear-gradient(90deg, #1e293b 0%, #1e293b 50%, #94a3b8 50%, #94a3b8 100%);
  border-radius: 999px;
}

.scale-bar-label {
  font-size: 10px;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.08em;
}

/* Legend */
.legend {
  position: absolute;
  bottom: 24px;
  left: 28px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 8px 10px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #E2E8F0;
  min-width: 120px;
}

.legend-title {
  font-size: 10px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.legend-bar {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #E2E8F0;
}

.legend-gradient {
  width: 100%;
  height: 100%;
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 3px;
  font-size: 9px;
  color: #64748B;
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
}

/* Controls */
.map-controls {
  position: absolute;
  top: 104px;
  right: 28px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  padding: 4px;
}

.control-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.control-btn:hover {
  background: #f1f5f9;
  color: #0f766e;
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-level {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  margin: 2px 0;
}

.zoom-level.is-zoomed {
  color: #0f766e;
}

.control-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
}

/* Cross-section info */
.cross-section-info {
  position: absolute;
  top: 104px;
  left: 28px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  pointer-events: none;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.info-label {
  font-weight: 500;
  color: #64748b;
  min-width: 36px;
}

.info-value {
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
  color: #0f766e;
  font-weight: 600;
}

.mode-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(15, 118, 110, 0.95);
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(15, 118, 110, 0.3);
}

/* Tooltip */
.hover-tooltip {
  position: absolute;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border: 1px solid #E2E8F0;
}

.tooltip-title {
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 2px;
}

.tooltip-coords {
  font-size: 10px;
  color: #94A3B8;
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
}

.tooltip-value {
  font-size: 12px;
  color: #2563EB;
  font-weight: 600;
  margin-top: 2px;
}

.tooltip-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f59e0b;
  color: white;
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
}

.hover-tooltip.is-borehole {
  border-color: #0f766e;
}

.hover-tooltip.is-borehole .tooltip-value {
  color: #0f766e;
}

@media (max-width: 900px) {
  .canvas-contour-wrapper {
    padding: 14px;
  }

  .figure-header {
    flex-direction: column;
  }

  .figure-highlights {
    justify-content: flex-start;
  }

  .canvas-container {
    min-height: 360px;
  }

  .map-controls,
  .cross-section-info {
    top: 146px;
  }
}
</style>
