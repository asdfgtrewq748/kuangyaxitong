<template>
  <div class="borehole-map-container">
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
      <button class="control-btn" :class="{ active: showBoundary }" @click="toggleBoundary" title="边界">
        <span>⬡</span>
      </button>
    </div>
    <div class="map-wrapper" :class="{ 'dragging': isDragging }">
      <canvas
        ref="canvas"
        :width="canvasSize"
        :height="canvasSize"
        @mousedown="startDrag"
        @mousemove="handleMouseMove"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @wheel.prevent="handleWheel"
        @click="handleClick"
      ></canvas>
      <div v-if="boreholes.length === 0" class="map-empty">
        <div class="empty-icon">📍</div>
        <p>暂无钻孔数据</p>
      </div>
    </div>
    <div v-if="hoveredBorehole" class="tooltip" :style="tooltipStyle">
      <div class="tooltip-header">
        <span class="tooltip-icon">📍</span>
        {{ hoveredBorehole.name || `钻孔 #${hoveredBorehole.index + 1}` }}
      </div>
      <div class="tooltip-row">
        <span class="tooltip-label">X 坐标:</span>
        <span class="tooltip-value">{{ hoveredBorehole.x.toFixed(2) }} m</span>
      </div>
      <div class="tooltip-row">
        <span class="tooltip-label">Y 坐标:</span>
        <span class="tooltip-value">{{ hoveredBorehole.y.toFixed(2) }} m</span>
      </div>
    </div>
    <div v-if="selectedBorehole !== null" class="selection-info">
      <span class="selection-icon">🎯</span>
      <strong>{{ boreholes[selectedBorehole]?.name || `钻孔 #${selectedBorehole + 1}` }}</strong>
      <span class="selection-coords">({{ boreholes[selectedBorehole]?.x?.toFixed(1) }}, {{ boreholes[selectedBorehole]?.y?.toFixed(1) }})</span>
      <button class="clear-btn" @click="selectedBorehole = null" title="取消选择">×</button>
    </div>
    <div v-else class="map-stats">
      <span class="stat-item">📍 {{ boreholes.length }} 个钻孔</span>
      <span class="stat-item" v-if="bounds">
        📐 {{ bounds.rangeX?.toFixed(0) }}m × {{ bounds.rangeY?.toFixed(0) }}m
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'

const props = defineProps({
  boreholes: { type: Array, default: () => [] },
  size: { type: Number, default: 350 }
})

const emit = defineEmits(['select'])

const canvas = ref(null)
const hoveredBorehole = ref(null)
const selectedBorehole = ref(null)
const tooltipPos = ref({ x: 0, y: 0 })
const showBoundary = ref(true)

// View state
const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const canvasSize = computed(() => props.size)

const bounds = computed(() => {
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

const padding = 40

const tooltipStyle = computed(() => ({
  left: tooltipPos.value.x + 12 + 'px',
  top: tooltipPos.value.y + 12 + 'px'
}))

// 计算凸包边界 (Graham Scan 算法)
const computeConvexHull = (points) => {
  if (points.length < 3) return points

  // 按Y坐标排序，取最下方的点作为起点
  const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x)
  const start = sorted[0]

  // 计算极角
  const getAngle = (p) => Math.atan2(p.y - start.y, p.x - start.x)

  // 按极角排序
  const sortedByAngle = sorted.slice(1).sort((a, b) => {
    const angleA = getAngle(a)
    const angleB = getAngle(b)
    if (angleA !== angleB) return angleA - angleB
    // 同角度取距离更近的
    const distA = Math.hypot(a.x - start.x, a.y - start.y)
    const distB = Math.hypot(b.x - start.x, b.y - start.y)
    return distA - distB
  })

  // 叉积判断方向
  const crossProduct = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)

  const hull = [start]
  for (const point of sortedByAngle) {
    while (hull.length > 1 && crossProduct(hull[hull.length - 2], hull[hull.length - 1], point) <= 0) {
      hull.pop()
    }
    hull.push(point)
  }

  return hull
}

// Transform world coordinates to canvas coordinates
const worldToCanvas = (x, y) => {
  const b = bounds.value
  if (!b) return { x: 0, y: 0 }

  const centerX = canvasSize.value / 2
  const centerY = canvasSize.value / 2

  const baseScale = Math.min(
    (canvasSize.value - padding * 2) / (b.rangeX || 1),
    (canvasSize.value - padding * 2) / (b.rangeY || 1)
  )

  const currentScale = baseScale * scale.value

  const worldCenterX = (b.minX + b.maxX) / 2
  const worldCenterY = (b.minY + b.maxY) / 2

  return {
    x: centerX + (x - worldCenterX) * currentScale + offsetX.value,
    y: centerY + (worldCenterY - y) * currentScale + offsetY.value
  }
}

const draw = () => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  const { width, height } = canvas.value

  ctx.clearRect(0, 0, width, height)

  // 渐变背景
  const bgGradient = ctx.createLinearGradient(0, 0, width, height)
  bgGradient.addColorStop(0, '#f8fafc')
  bgGradient.addColorStop(1, '#f1f5f9')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, width, height)

  if (props.boreholes.length === 0) return

  const b = bounds.value

  // 绘制网格
  const gridSize = 50 * scale.value
  const gridAlpha = Math.min(0.3, gridSize / 100)
  ctx.strokeStyle = `rgba(148, 163, 184, ${gridAlpha})`
  ctx.lineWidth = 1

  const topLeft = canvasToWorld(0, 0)
  const bottomRight = canvasToWorld(width, height)

  const gridStartX = Math.floor(topLeft.x / 50) * 50
  const gridStartY = Math.floor(bottomRight.y / 50) * 50

  for (let gx = gridStartX; gx <= bottomRight.x; gx += 50) {
    const pos = worldToCanvas(gx, 0)
    ctx.beginPath()
    ctx.moveTo(pos.x, 0)
    ctx.lineTo(pos.x, height)
    ctx.stroke()
  }

  for (let gy = gridStartY; gy <= topLeft.y; gy += 50) {
    const pos = worldToCanvas(0, gy)
    ctx.beginPath()
    ctx.moveTo(0, pos.y)
    ctx.lineTo(width, pos.y)
    ctx.stroke()
  }

  // 绘制坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1.5
  const origin = worldToCanvas(0, 0)

  // X轴
  if (origin.y >= 0 && origin.y <= height) {
    ctx.beginPath()
    ctx.moveTo(0, origin.y)
    ctx.lineTo(width, origin.y)
    ctx.stroke()
  }
  // Y轴
  if (origin.x >= 0 && origin.x <= width) {
    ctx.beginPath()
    ctx.moveTo(origin.x, 0)
    ctx.lineTo(origin.x, height)
    ctx.stroke()
  }

  // Store scaled positions
  canvas.value.scaledBoreholes = props.boreholes.map((bh, i) => {
    const pos = worldToCanvas(bh.x, bh.y)
    return {
      index: i,
      name: bh.name,
      x: bh.x,
      y: bh.y,
      canvasX: pos.x,
      canvasY: pos.y
    }
  })

  // 计算并绘制边界多边形
  if (showBoundary.value && canvas.value.scaledBoreholes.length >= 3) {
    const hull = computeConvexHull(canvas.value.scaledBoreholes)

    // 绘制边界填充
    ctx.beginPath()
    hull.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point.canvasX, point.canvasY)
      else ctx.lineTo(point.canvasX, point.canvasY)
    })
    ctx.closePath()

    // 渐变填充
    const hullBounds = hull.reduce((acc, p) => ({
      minX: Math.min(acc.minX, p.canvasX),
      maxX: Math.max(acc.maxX, p.canvasX),
      minY: Math.min(acc.minY, p.canvasY),
      maxY: Math.max(acc.maxY, p.canvasY)
    }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity })

    const fillGradient = ctx.createRadialGradient(
      (hullBounds.minX + hullBounds.maxX) / 2,
      (hullBounds.minY + hullBounds.maxY) / 2,
      0,
      (hullBounds.minX + hullBounds.maxX) / 2,
      (hullBounds.minY + hullBounds.maxY) / 2,
      Math.max(hullBounds.maxX - hullBounds.minX, hullBounds.maxY - hullBounds.minY) / 2
    )
    fillGradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)')
    fillGradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)')
    ctx.fillStyle = fillGradient
    ctx.fill()

    // 边界线
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 4])
    ctx.stroke()
    ctx.setLineDash([])

    // 边界顶点
    hull.forEach((point, i) => {
      ctx.beginPath()
      ctx.arc(point.canvasX, point.canvasY, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    })
  }

  // 绘制连接线
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)'
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  canvas.value.scaledBoreholes.forEach((bh, i) => {
    if (i === 0) {
      ctx.moveTo(bh.canvasX, bh.canvasY)
    } else {
      ctx.lineTo(bh.canvasX, bh.canvasY)
    }
  })
  ctx.stroke()
  ctx.setLineDash([])

  // 绘制钻孔点
  canvas.value.scaledBoreholes.forEach((bh, i) => {
    const isSelected = selectedBorehole.value === i
    const isHovered = hoveredBorehole.value?.index === i

    // 选中/悬停光晕效果
    if (isSelected || isHovered) {
      const pulseRadius = isSelected ? 20 : 16
      const pulseGradient = ctx.createRadialGradient(bh.canvasX, bh.canvasY, 0, bh.canvasX, bh.canvasY, pulseRadius)

      if (isSelected) {
        pulseGradient.addColorStop(0, 'rgba(245, 158, 11, 0.4)')
        pulseGradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)')
        pulseGradient.addColorStop(1, 'rgba(245, 158, 11, 0)')
      } else {
        pulseGradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
        pulseGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)')
        pulseGradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
      }

      ctx.beginPath()
      ctx.arc(bh.canvasX, bh.canvasY, pulseRadius, 0, Math.PI * 2)
      ctx.fillStyle = pulseGradient
      ctx.fill()
    }

    // 主点
    const radius = isSelected ? 8 : 6
    ctx.beginPath()
    ctx.arc(bh.canvasX, bh.canvasY, radius, 0, Math.PI * 2)

    // 渐变填充
    const pointGradient = ctx.createRadialGradient(
      bh.canvasX - radius * 0.3, bh.canvasY - radius * 0.3, 0,
      bh.canvasX, bh.canvasY, radius
    )

    if (isSelected) {
      pointGradient.addColorStop(0, '#fcd34d')
      pointGradient.addColorStop(0.5, '#f59e0b')
      pointGradient.addColorStop(1, '#d97706')
    } else {
      pointGradient.addColorStop(0, '#93c5fd')
      pointGradient.addColorStop(0.5, '#3b82f6')
      pointGradient.addColorStop(1, '#2563eb')
    }

    ctx.fillStyle = pointGradient
    ctx.fill()

    // 边框
    ctx.strokeStyle = isSelected ? '#b45309' : '#1d4ed8'
    ctx.lineWidth = isSelected ? 2.5 : 2
    ctx.stroke()

    // 阴影
    ctx.shadowColor = isSelected ? 'rgba(245, 158, 11, 0.4)' : 'rgba(59, 130, 246, 0.3)'
    ctx.shadowBlur = 6
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 2

    // 重置阴影
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // 标签
    const label = bh.name || `#${i + 1}`
    const labelY = bh.canvasY - radius - 6

    // 标签背景
    ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif'
    const textMetrics = ctx.measureText(label)
    const labelPadding = 4
    const labelBgX = bh.canvasX - textMetrics.width / 2 - labelPadding
    const labelBgY = labelY - 10
    const labelBgW = textMetrics.width + labelPadding * 2
    const labelBgH = 14

    if (isSelected) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.9)'
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
    }
    ctx.beginPath()
    ctx.roundRect(labelBgX, labelBgY, labelBgW, labelBgH, 4)
    ctx.fill()

    // 标签文字
    ctx.fillStyle = isSelected ? '#fff' : '#1e40af'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, bh.canvasX, labelY - 3)
  })

  // 绘制比例尺
  const scaleWidth = 60 * scale.value
  if (scaleWidth > 30 && scaleWidth < 180) {
    const scaleY = height - 18
    const scaleStart = 16

    // 比例尺背景
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.roundRect(scaleStart - 4, scaleY - 10, scaleWidth + 8, 20, 4)
    ctx.fill()

    // 比例尺线
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(scaleStart, scaleY)
    ctx.lineTo(scaleStart + scaleWidth, scaleY)
    ctx.stroke()

    // 端点刻度
    ctx.beginPath()
    ctx.moveTo(scaleStart, scaleY - 5)
    ctx.lineTo(scaleStart, scaleY + 5)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(scaleStart + scaleWidth, scaleY - 5)
    ctx.lineTo(scaleStart + scaleWidth, scaleY + 5)
    ctx.stroke()

    // 比例尺文字
    const baseScale = Math.min(
      (canvasSize.value - padding * 2) / (b.rangeX || 1),
      (canvasSize.value - padding * 2) / (b.rangeY || 1)
    )
    const realWorldLength = Math.round(60 / scale.value / baseScale)

    ctx.fillStyle = '#475569'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${realWorldLength}m`, scaleStart + scaleWidth / 2, scaleY - 10)
  }
}

const canvasToWorld = (cx, cy) => {
  const b = bounds.value
  if (!b) return { x: 0, y: 0 }

  const centerX = canvasSize.value / 2
  const centerY = canvasSize.value / 2

  const baseScale = Math.min(
    (canvasSize.value - padding * 2) / (b.rangeX || 1),
    (canvasSize.value - padding * 2) / (b.rangeY || 1)
  )

  const currentScale = baseScale * scale.value
  const worldCenterX = (b.minX + b.maxX) / 2
  const worldCenterY = (b.minY + b.maxY) / 2

  return {
    x: worldCenterX + (cx - centerX - offsetX.value) / currentScale,
    y: worldCenterY - (cy - centerY - offsetY.value) / currentScale
  }
}

const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.3, 5)
  draw()
}

const zoomOut = () => {
  scale.value = Math.max(scale.value / 1.3, 0.2)
  draw()
}

const resetView = () => {
  scale.value = 1
  offsetX.value = 0
  offsetY.value = 0
  draw()
}

const toggleBoundary = () => {
  showBoundary.value = !showBoundary.value
  draw()
}

const startDrag = (e) => {
  isDragging.value = true
  dragStart.value = { x: e.clientX - offsetX.value, y: e.clientY - offsetY.value }
}

const endDrag = () => {
  isDragging.value = false
}

const handleMouseMove = (e) => {
  if (!canvas.value?.scaledBoreholes) return
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (isDragging.value) {
    offsetX.value = e.clientX - dragStart.value.x
    offsetY.value = e.clientY - dragStart.value.y
    draw()
    return
  }

  let found = null
  for (const bh of canvas.value.scaledBoreholes) {
    const dist = Math.sqrt((x - bh.canvasX) ** 2 + (y - bh.canvasY) ** 2)
    if (dist < 12) {
      found = bh
      break
    }
  }
  hoveredBorehole.value = found
  tooltipPos.value = { x: e.clientX, y: e.clientY }
  canvas.value.style.cursor = found ? 'pointer' : (isDragging.value ? 'grabbing' : 'grab')
}

const handleWheel = (e) => {
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  scale.value = Math.max(0.2, Math.min(5, scale.value * delta))
  draw()
}

const handleClick = (e) => {
  if (!canvas.value?.scaledBoreholes) return
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  let found = null
  for (const bh of canvas.value.scaledBoreholes) {
    const dist = Math.sqrt((x - bh.canvasX) ** 2 + (y - bh.canvasY) ** 2)
    if (dist < 12) {
      found = bh.index
      break
    }
  }

  if (found !== null) {
    selectedBorehole.value = found
    emit('select', found)
  } else {
    selectedBorehole.value = null
  }
  draw()
}

onMounted(() => {
  draw()
  if (canvas.value) {
    canvas.value.style.cursor = 'grab'
  }
})

onUnmounted(() => {
  // Cleanup
})

watch(() => props.boreholes, () => {
  resetView()
}, { deep: true })

watch(showBoundary, draw)
</script>

<style scoped>
.borehole-map-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.map-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%) border-box;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12),
              0 2px 8px rgba(15, 23, 42, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.map-wrapper:hover {
  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.18),
              0 4px 12px rgba(15, 23, 42, 0.08);
  transform: translateY(-2px);
}

.map-wrapper.dragging {
  cursor: grabbing !important;
}

.map-wrapper canvas {
  display: block;
  cursor: grab;
}

.map-wrapper canvas:active {
  cursor: grabbing;
}

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
  background: linear-gradient(145deg, #ffffff 0%, #fafbff 100%);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15),
              0 0 0 1px rgba(99, 102, 241, 0.1);
  cursor: pointer;
  font-size: 16px;
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
  font-weight: 600;
}

.control-btn span {
  display: block;
  margin-top: -2px;
}

.control-btn:hover {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
}

.control-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.map-empty {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 13px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.tooltip {
  position: fixed;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  color: white;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 12px 32px rgba(30, 27, 75, 0.4),
              0 4px 12px rgba(0, 0, 0, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  backdrop-filter: blur(12px);
  animation: tooltipFadeIn 0.2s ease;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-header {
  font-weight: 600;
  color: #a5b4fc;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.tooltip-icon {
  font-size: 14px;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 11px;
  color: #cbd5e1;
  margin-top: 4px;
}

.tooltip-label {
  color: #94a3b8;
}

.tooltip-value {
  color: #f1f5f9;
  font-weight: 500;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #fbbf24;
  border-radius: 12px;
  font-size: 13px;
  color: #78350f;
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.25);
  animation: selectionFadeIn 0.3s ease;
}

@keyframes selectionFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.selection-icon {
  font-size: 14px;
}

.selection-coords {
  color: #b45309;
  font-family: 'Consolas', monospace;
}

.clear-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: #f59e0b;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.clear-btn:hover {
  background: #d97706;
  transform: scale(1.1);
}

.map-stats {
  display: flex;
  gap: 14px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
  border-radius: 10px;
  font-size: 12px;
  color: #475569;
  border: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}
</style>
