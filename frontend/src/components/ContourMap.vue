<template>
  <div class="contour-map-wrapper" :class="{ 'cross-section-mode': crossSectionMode }">
    <!-- Matplotlib-generated image -->
    <div
      ref="imageContainer"
      class="image-container"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @wheel.prevent="handleWheel"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="contour-image"
        :style="imageStyle"
        alt="Contour Map"
        @load="onImageLoad"
      />
      <div v-else class="loading-placeholder">
        <div class="spinner"></div>
        <p>正在生成等值线图...</p>
      </div>
    </div>

    <!-- Borehole overlay (positioned on top of the image) -->
    <svg
      v-if="imageUrl"
      class="borehole-overlay"
      :style="overlayStyle"
      :viewBox="`0 0 ${imageWidth} ${imageHeight}`"
      :width="imageWidth"
      :height="imageHeight"
    >
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b"/>
        </marker>
      </defs>

      <!-- Cross-section line -->
      <g v-if="crossSectionLine.start && crossSectionLine.end">
        <line
          :x1="crossSectionLine.start.x"
          :y1="crossSectionLine.start.y"
          :x2="crossSectionLine.end.x"
          :y2="crossSectionLine.end.y"
          stroke="#f59e0b"
          stroke-width="3"
          stroke-dasharray="8,4"
          marker-end="url(#arrowhead)"
          class="cross-section-line"
        />
        <!-- Start point marker -->
        <circle
          :cx="crossSectionLine.start.x"
          :cy="crossSectionLine.start.y"
          r="8"
          fill="#f59e0b"
          stroke="white"
          stroke-width="2"
          class="cross-section-marker"
        />
        <text
          :x="crossSectionLine.start.x"
          :y="crossSectionLine.start.y - 15"
          fill="#f59e0b"
          font-size="14"
          font-weight="bold"
          text-anchor="middle"
        >A</text>
        <!-- End point marker -->
        <circle
          :cx="crossSectionLine.end.x"
          :cy="crossSectionLine.end.y"
          r="8"
          fill="#f59e0b"
          stroke="white"
          stroke-width="2"
          class="cross-section-marker"
        />
        <text
          :x="crossSectionLine.end.x"
          :y="crossSectionLine.end.y - 15"
          fill="#f59e0b"
          font-size="14"
          font-weight="bold"
          text-anchor="middle"
        >A'</text>
        <!-- Distance label -->
        <text
          :x="(crossSectionLine.start.x + crossSectionLine.end.x) / 2"
          :y="(crossSectionLine.start.y + crossSectionLine.end.y) / 2 - 15"
          fill="white"
          font-size="12"
          text-anchor="middle"
          class="distance-label"
        >{{ crossSectionLine.distance?.toFixed(0) }}m</text>
      </g>

      <!-- Drawing preview line -->
      <line
        v-if="crossSectionMode && crossSectionLine.start && drawingPreview"
        :x1="crossSectionLine.start.x"
        :y1="crossSectionLine.start.y"
        :x2="drawingPreview.x"
        :y2="drawingPreview.y"
        stroke="rgba(245, 158, 11, 0.5)"
        stroke-width="2"
        stroke-dasharray="4,4"
      />

      <!-- Borehole markers -->
      <g
        v-if="showBoreholes"
        v-for="(bh, i) in boreholesWithCanvas"
        :key="i"
        :transform="`translate(${bh.canvasX}, ${bh.canvasY})`"
        class="borehole-marker"
        @mouseenter="hoverInfo = { ...bh, isBorehole: true }"
        @mouseleave="hoverInfo = null"
      >
        <!-- Outer white ring -->
        <circle r="9" fill="rgba(255,255,255,0.95)" filter="url(#shadow)"/>
        <!-- Colored center -->
        <circle r="6" :fill="bh.color || '#3b82f6'" stroke="#1e3a8a" stroke-width="1.5"/>
      </g>
    </svg>

    <!-- Controls -->
    <div class="map-controls">
      <button class="control-btn" @click="zoomIn" title="放大">
        <span>+</span>
      </button>
      <button class="control-btn" @click="zoomOut" title="缩小">
        <span>−</span>
      </button>
      <button class="control-btn" @click="resetView" title="重置">
        <span>⟲</span>
      </button>
      <button
        class="control-btn"
        :class="{ active: showBoreholes }"
        @click="showBoreholes = !showBoreholes"
        title="钻孔点"
      >
        <span>📍</span>
      </button>
    </div>

    <!-- Value range legend -->
    <div v-if="valueRange" class="legend">
      <div class="legend-title">{{ propertyLabel }}</div>
      <div class="legend-range">
        <span class="legend-min">{{ valueRange.min?.toFixed(2) }}m</span>
        <div class="legend-bar">
          <div
            class="legend-gradient"
            :style="gradientStyle"
          ></div>
        </div>
        <span class="legend-max">{{ valueRange.max?.toFixed(2) }}m</span>
      </div>
    </div>

    <!-- Hover tooltip -->
    <div v-if="hoverInfo" class="hover-tooltip" :style="tooltipStyle">
      <div v-if="hoverInfo.isBorehole" class="tooltip-borehole">
        <div class="tooltip-name">{{ hoverInfo.name || hoverInfo.borehole }}</div>
        <div class="tooltip-coords">({{ hoverInfo.x?.toFixed(1) }}, {{ hoverInfo.y?.toFixed(1) }})</div>
        <div class="tooltip-value">
          <span class="tooltip-label">{{ propertyLabel }}:</span>
          <span class="tooltip-number">{{ hoverInfo.value?.toFixed(2) }} m</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

const props = defineProps({
  imageUrl: { type: String, default: '' },
  boreholes: { type: Array, default: () => [] },
  bounds: { type: Object, default: () => ({}) },
  property: { type: String, default: 'thickness' },
  propertyLabel: { type: String, default: '厚度' },
  valueRange: { type: Object, default: () => ({ min: 0, max: 10 }) },
  colormap: { type: String, default: 'YlOrBr' },
  crossSectionMode: { type: Boolean, default: false }
})

const emit = defineEmits(['crossSectionChange', 'crossSectionComplete'])

const imageContainer = ref(null)
const imageWidth = ref(800)
const imageHeight = ref(600)
const imageLoaded = ref(false)
const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const isDragging = ref(false)
const isDrawing = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const hoverInfo = ref(null)
const hoverPos = ref({ x: 0, y: 0 })
const showBoreholes = ref(true)

// Cross-section state
const crossSectionLine = ref({ start: null, end: null, distance: null })
const drawingPreview = ref(null)

const bounds = computed(() => {
  if (props.bounds && props.bounds.min_x !== undefined) {
    return {
      minX: props.bounds.min_x,
      maxX: props.bounds.max_x,
      minY: props.bounds.min_y,
      maxY: props.bounds.max_y,
      rangeX: props.bounds.max_x - props.bounds.min_x,
      rangeY: props.bounds.max_y - props.bounds.min_y
    }
  }
  if (props.boreholes.length === 0) return null
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  props.boreholes.forEach(b => {
    if (b.x < minX) minX = b.x
    if (b.x > maxX) maxX = b.x
    if (b.y < minY) minY = b.y
    if (b.y > maxY) maxY = b.y
  })
  return { minX, maxX, minY, maxY, rangeX: maxX - minX, rangeY: maxY - minY }
})

// Calculate borehole positions in canvas coordinates
const boreholesWithCanvas = computed(() => {
  if (!bounds.value || props.boreholes.length === 0) return []
  if (!imageLoaded.value || !props.imageUrl) return []  // Not loaded yet

  const b = bounds.value
  const padding = 60  // matplotlib figure padding
  const w = imageWidth.value
  const h = imageHeight.value

  return props.boreholes.map(bh => {
    const x = bh.x ?? bh.borehole_x
    const y = bh.y ?? bh.borehole_y

    if (x == null || y == null) return null

    // Map world coordinates to image coordinates (matplotlib style)
    // matplotlib: origin at bottom-left, y increases upward
    const relX = (x - b.minX) / b.rangeX
    const relY = (y - b.minY) / b.rangeY

    const canvasX = padding + relX * (w - padding * 2)
    const canvasY = h - padding - relY * (h - padding * 2)

    return {
      ...bh,
      x: x,
      y: y,
      canvasX: Math.round(canvasX * 10) / 10,  // Round to 1 decimal
      canvasY: Math.round(canvasY * 10) / 10,
      color: getBoreholeColor(bh[props.property] || bh.thickness || bh.burial_depth)
    }
  }).filter(bh => bh !== null)
})

const getBoreholeColor = (value) => {
  if (value === null || value === undefined) return '#3b82f6'
  const min = props.valueRange?.min || 0
  const max = props.valueRange?.max || 1
  const t = Math.max(0, Math.min(1, (value - min) / (max - min || 1)))

  // Color gradient matching matplotlib's YlOrBr colormap
  if (props.colormap === 'YlOrBr') {
    // Yellow-Orange-Brown gradient
    const colors = [
      { t: 0.0, r: 255, g: 255, b: 204 },   // Light yellow
      { t: 0.25, r: 255, g: 230, b: 153 },  // Light orange
      { t: 0.5, r: 255, g: 190, b: 121 },   // Orange
      { t: 0.75, r: 230, g: 140, b: 80 },   // Brown-orange
      { t: 1.0, r: 160, g: 80, b: 50 }      // Brown
    ]
    return interpolateColor(t, colors)
  } else {
    // Viridis-like gradient
    const colors = [
      { t: 0.0, r: 68, g: 1, b: 84 },
      { t: 0.25, r: 59, g: 82, b: 139 },
      { t: 0.5, r: 33, g: 154, b: 141 },
      { t: 0.75, r: 94, g: 201, b: 98 },
      { t: 1.0, r: 253, g: 231, b: 37 }
    ]
    return interpolateColor(t, colors)
  }
}

const interpolateColor = (t, colors) => {
  let lower = colors[0], upper = colors[colors.length - 1]
  for (let i = 0; i < colors.length - 1; i++) {
    if (t >= colors[i].t && t <= colors[i + 1].t) {
      lower = colors[i]
      upper = colors[i + 1]
      break
    }
  }
  const localT = upper.t !== lower.t ? (t - lower.t) / (upper.t - lower.t) : 0
  const r = Math.round(lower.r + (upper.r - lower.r) * localT)
  const g = Math.round(lower.g + (upper.g - lower.g) * localT)
  const b = Math.round(lower.b + (upper.b - lower.b) * localT)
  return `rgb(${r}, ${g}, ${b})`
}

const imageStyle = computed(() => ({
  transform: `scale(${scale.value}) translate(${offsetX.value / scale.value}px, ${offsetY.value / scale.value}px)`,
  transformOrigin: 'center center',
  transition: isDragging.value ? 'none' : 'transform 0.1s ease-out'
}))

const overlayStyle = computed(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
  width: `${imageWidth.value}px`,
  height: `${imageHeight.value}px`
}))

const tooltipStyle = computed(() => ({
  left: hoverPos.value.x + 15 + 'px',
  top: hoverPos.value.y + 15 + 'px'
}))

const gradientStyle = computed(() => {
  if (props.colormap === 'YlOrBr') {
    return 'background: linear-gradient(to right, #fffacc, #ffe699, #ffbe79, #e68c50, #a05032)'
  } else {
    return 'background: linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725)'
  }
})

const onImageLoad = (e) => {
  imageWidth.value = e.target.naturalWidth
  imageHeight.value = e.target.naturalHeight
  imageLoaded.value = true
}

const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.2, 3)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value / 1.2, 0.5)
}

const resetView = () => {
  scale.value = 1
  offsetX.value = 0
  offsetY.value = 0
}

const resetCrossSection = () => {
  crossSectionLine.value = { start: null, end: null, distance: null }
  drawingPreview.value = null
  emit('crossSectionChange', null)
}

// Convert screen coordinates to canvas coordinates
const screenToCanvas = (screenX, screenY) => {
  if (!imageContainer.value) return null
  const rect = imageContainer.value.getBoundingClientRect()
  const containerCenterX = rect.width / 2
  const containerCenterY = rect.height / 2

  // Account for scale and offset
  const x = (screenX - containerCenterX - offsetX.value) / scale.value + containerCenterX
  const y = (screenY - containerCenterY - offsetY.value) / scale.value + containerCenterY

  // Adjust for image position (centered in container)
  const imgLeft = (rect.width - imageWidth.value) / 2
  const imgTop = (rect.height - imageHeight.value) / 2

  return {
    x: x - imgLeft,
    y: y - imgTop
  }
}

// Convert canvas coordinates to world coordinates
const canvasToWorld = (canvasX, canvasY) => {
  if (!bounds.value) return null
  const padding = 60
  const w = imageWidth.value - padding * 2
  const h = imageHeight.value - padding * 2

  const b = bounds.value
  const worldX = b.minX + (canvasX - padding) / w * b.rangeX
  const worldY = b.minY + (imageHeight.value - canvasY - padding) / h * b.rangeY

  return { x: worldX, y: worldY }
}

const handleMouseDown = (e) => {
  if (props.crossSectionMode) {
    // Cross-section drawing mode
    const canvasPos = screenToCanvas(e.clientX, e.clientY)
    if (!canvasPos) return

    if (!crossSectionLine.value.start) {
      // Set start point
      crossSectionLine.value.start = canvasPos
      isDrawing.value = true
    } else if (!crossSectionLine.value.end) {
      // Set end point
      crossSectionLine.value.end = canvasPos
      isDrawing.value = false

      // Calculate distance
      const startWorld = canvasToWorld(canvasPos.x, canvasPos.y)
      const endWorld = canvasToWorld(crossSectionLine.value.start.x, crossSectionLine.value.start.y)
      if (startWorld && endWorld) {
        const dist = Math.sqrt((endWorld.x - startWorld.x)**2 + (endWorld.y - startWorld.y)**2)
        crossSectionLine.value.distance = dist
      }

      drawingPreview.value = null
      emit('crossSectionComplete', {
        start: canvasToWorld(crossSectionLine.value.start.x, crossSectionLine.value.start.y),
        end: canvasToWorld(crossSectionLine.value.end.x, crossSectionLine.value.end.y),
        startCanvas: crossSectionLine.value.start,
        endCanvas: crossSectionLine.value.end,
        distance: crossSectionLine.value.distance
      })
    } else {
      // Reset and start new line
      crossSectionLine.value = { start: canvasPos, end: null, distance: null }
      isDrawing.value = true
    }
    emit('crossSectionChange', crossSectionLine.value)
  } else {
    // Normal pan mode
    isDragging.value = true
    dragStart.value = { x: e.clientX - offsetX.value, y: e.clientY - offsetY.value }
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

const handleMouseMove = (e) => {
  if (!imageContainer.value) return
  const rect = imageContainer.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (props.crossSectionMode && isDrawing.value) {
    // Update drawing preview
    const canvasPos = screenToCanvas(e.clientX, e.clientY)
    if (canvasPos) {
      drawingPreview.value = canvasPos
    }
    hoverPos.value = { x: e.clientX, y: e.clientY }
    return
  }

  if (isDragging.value) {
    offsetX.value = e.clientX - dragStart.value.x
    offsetY.value = e.clientY - dragStart.value.y
    return
  }

  hoverPos.value = { x: e.clientX, y: e.clientY }
}

const handleWheel = (e) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  scale.value = Math.max(0.5, Math.min(3, scale.value * delta))
}

onMounted(() => {
  // Initialize
})

watch(() => props.imageUrl, () => {
  resetView()
  imageLoaded.value = false
})

// Expose methods for external access
defineExpose({
  resetView,
  resetCrossSection,
  boreholes: boreholesWithCanvas,
  crossSectionLine
})
</script>

<style scoped>
/* ============================================
   MODERN CONTOUR MAP COMPONENT STYLES
   ============================================ */

.contour-map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8FAFC;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #E2E8F0;
}

.contour-map-wrapper.cross-section-mode {
  cursor: crosshair;
}

.contour-map-wrapper.cross-section-mode .image-container {
  cursor: crosshair;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  overflow: hidden;
}

.image-container:active {
  cursor: grabbing;
}

.contour-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.loading-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  color: #94A3B8;
}

.loading-placeholder p {
  margin: 0;
  font-size: 13px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid #E2E8F0;
  border-top-color: #2563EB;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.borehole-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.borehole-marker {
  pointer-events: all;
  cursor: pointer;
}

.borehole-marker circle {
  transition: r 0.15s ease;
}

.borehole-marker:hover circle {
  r: 7;
}

/* ============================================
   MAP CONTROLS
   ============================================ */

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 10;
}

.control-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 15px;
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  backdrop-filter: blur(4px);
}

.control-btn span {
  display: block;
  line-height: 1;
}

.control-btn:hover {
  background: #2563EB;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
}

.control-btn:active {
  transform: translateY(0);
}

.control-btn.active {
  background: #2563EB;
  color: white;
}

/* ============================================
   LEGEND
   ============================================ */

.legend {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  padding: 10px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #E2E8F0;
}

.legend-title {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.legend-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-min,
.legend-max {
  font-size: 10px;
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
  color: #64748B;
  min-width: 38px;
}

.legend-bar {
  width: 90px;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #E2E8F0;
}

.legend-gradient {
  width: 100%;
  height: 100%;
}

/* ============================================
   TOOLTIP
   ============================================ */

.hover-tooltip {
  position: fixed;
  background: white;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12),
              0 0 0 1px rgba(0, 0, 0, 0.04);
  white-space: nowrap;
}

.tooltip-borehole {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.tooltip-name {
  font-weight: 600;
  color: #1E293B;
  font-size: 13px;
}

.tooltip-coords {
  font-size: 10px;
  color: #94A3B8;
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
}

.tooltip-value {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.tooltip-label {
  color: #64748B;
  font-size: 11px;
}

.tooltip-number {
  color: #2563EB;
  font-weight: 600;
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
  font-size: 13px;
}

/* ============================================
   CROSS-SECTION STYLES
   ============================================ */

.cross-section-line {
  animation: dash 1s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -24;
  }
}

.cross-section-marker {
  cursor: pointer;
  transition: r 0.15s ease;
}

.cross-section-marker:hover {
  r: 9;
}

.distance-label {
  fill: #f59e0b;
  font-weight: 600;
  font-size: 11px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}
</style>
