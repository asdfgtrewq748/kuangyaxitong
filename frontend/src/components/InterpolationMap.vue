<template>
  <div class="interpolation-map-container">
    <!-- 地图控制 -->
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
      <button class="control-btn" :class="{ active: showBoreholes }" @click="showBoreholes = !showBoreholes" title="钻孔点">
        <span>📍</span>
      </button>
      <button class="control-btn" :class="{ active: showValues }" @click="showValues = !showValues" title="数值标签">
        <span>#</span>
      </button>
    </div>

    <div class="map-wrapper" :class="{ 'dragging': isDragging }">
      <canvas
        ref="canvas"
        :width="canvasSize"
        :height="canvasSize"
        tabindex="0"
        role="img"
        :aria-label="`${fieldLabel}插值画布，支持拖拽平移、滚轮或双指缩放。`"
        @pointerdown="startDrag"
        @pointermove="handlePointerMove"
        @pointerup="endDrag"
        @pointerleave="endDrag"
        @pointercancel="endDrag"
        @wheel.prevent="handleWheel"
        @keydown="handleCanvasKeydown"
      ></canvas>

      <!-- 悬停信息 -->
      <div v-if="hoverInfo" class="hover-info" :style="hoverStyle">
        <div class="hover-header">
          <span class="hover-coords">({{ hoverInfo.x?.toFixed(1) }}, {{ hoverInfo.y?.toFixed(1) }})</span>
        </div>
        <div v-if="hoverInfo.isBorehole" class="hover-borehole">
          <strong>{{ hoverInfo.name || `钻孔 #${hoverInfo.index + 1}` }}</strong>
          <div class="hover-value">
            {{ fieldLabel }}: <span class="value-num">{{ hoverInfo.value?.toFixed(3) }}</span>
          </div>
        </div>
        <div v-else class="hover-interp">
          <span class="interp-label">插值:</span>
          <span class="value-num">{{ hoverInfo.value?.toFixed(3) }}</span>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="boreholes.length === 0" class="map-empty">
        <div class="empty-icon">📊</div>
        <p>暂无钻孔数据</p>
        <p class="empty-hint">请先导入钻孔数据</p>
      </div>
    </div>

    <!-- 图例 -->
    <div class="legend-bar" v-if="hasInterpolationData">
      <div class="legend-label">{{ minVal?.toFixed(2) }}</div>
      <div class="legend-gradient"></div>
      <div class="legend-label">{{ maxVal?.toFixed(2) }}</div>
      <div class="legend-unit">{{ fieldUnit }}</div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-bar" v-if="hasInterpolationData">
      <span class="stat-item">📍 {{ boreholes.length }} 个钻孔</span>
      <span class="stat-item" v-if="bounds">
        📐 {{ bounds.rangeX?.toFixed(0) }}m × {{ bounds.rangeY?.toFixed(0) }}m
      </span>
      <span class="stat-item">
        📊 范围: {{ minVal?.toFixed(2) }} ~ {{ maxVal?.toFixed(2) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'

const props = defineProps({
  boreholes: { type: Array, default: () => [] },
  interpolationGrid: { type: Array, default: () => [] },
  gridSize: { type: Number, default: 50 },
  field: { type: String, default: 'elastic_modulus' },
  fieldLabel: { type: String, default: '弹性模量' },
  fieldUnit: { type: String, default: 'GPa' },
  size: { type: Number, default: 500 }
})

const canvas = ref(null)
const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const activePointers = ref(new Map())
const pinchStartDistance = ref(0)
const pinchStartScale = ref(1)
const hoverInfo = ref(null)
const hoverPos = ref({ x: 0, y: 0 })
const showBoreholes = ref(true)
const showValues = ref(true)

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

const hasInterpolationData = computed(() => {
  return props.interpolationGrid && props.interpolationGrid.length > 0
})

const minVal = computed(() => {
  if (!hasInterpolationData.value) return null
  let min = Infinity
  props.interpolationGrid.forEach(row => {
    row.forEach(v => {
      if (v !== null && v !== undefined && v < min) min = v
    })
  })
  return min === Infinity ? null : min
})

const maxVal = computed(() => {
  if (!hasInterpolationData.value) return null
  let max = -Infinity
  props.interpolationGrid.forEach(row => {
    row.forEach(v => {
      if (v !== null && v !== undefined && v > max) max = v
    })
  })
  return max === -Infinity ? null : max
})

const hoverStyle = computed(() => ({
  left: hoverPos.value.x + 15 + 'px',
  top: hoverPos.value.y + 15 + 'px'
}))

// 颜色映射
const getColor = (value) => {
  if (value === null || value === undefined) return null
  const min = minVal.value || 0
  const max = maxVal.value || 1
  const range = max - min || 1
  const t = Math.max(0, Math.min(1, (value - min) / range))

  // 颜色方案: 蓝(低) -> 青 -> 绿 -> 黄 -> 橙 -> 红(高)
  const colors = [
    { r: 30, g: 64, b: 175 },    // 深蓝
    { r: 37, g: 99, b: 235 },    // 蓝
    { r: 59, g: 130, b: 246 },   // 浅蓝
    { r: 6, g: 182, b: 212 },    // 青
    { r: 16, g: 185, b: 129 },   // 绿
    { r: 132, g: 204, b: 22 },   // 黄绿
    { r: 251, g: 191, b: 36 },   // 黄
    { r: 251, g: 146, b: 60 },   // 橙
    { r: 239, g: 68, b: 68 }     // 红
  ]

  const idx = t * (colors.length - 1)
  const i = Math.floor(idx)
  const f = idx - i

  const c1 = colors[Math.min(i, colors.length - 1)]
  const c2 = colors[Math.min(i + 1, colors.length - 1)]

  return {
    r: Math.round(c1.r + (c2.r - c1.r) * f),
    g: Math.round(c1.g + (c2.g - c1.g) * f),
    b: Math.round(c1.b + (c2.b - c1.b) * f)
  }
}

const worldToCanvas = (x, y) => {
  const b = bounds.value
  if (!b) return { x: 0, y: 0 }

  const centerX = canvasSize.value / 2
  const centerY = canvasSize.value / 2

  const baseScale = Math.min(
    (canvasSize.value - 60) / (b.rangeX || 1),
    (canvasSize.value - 60) / (b.rangeY || 1)
  )

  const currentScale = baseScale * scale.value
  const worldCenterX = (b.minX + b.maxX) / 2
  const worldCenterY = (b.minY + b.maxY) / 2

  return {
    x: centerX + (x - worldCenterX) * currentScale + offsetX.value,
    y: centerY + (worldCenterY - y) * currentScale + offsetY.value
  }
}

const canvasToWorld = (cx, cy) => {
  const b = bounds.value
  if (!b) return null

  const centerX = canvasSize.value / 2
  const centerY = canvasSize.value / 2

  const baseScale = Math.min(
    (canvasSize.value - 60) / (b.rangeX || 1),
    (canvasSize.value - 60) / (b.rangeY || 1)
  )

  const currentScale = baseScale * scale.value
  const worldCenterX = (b.minX + b.maxX) / 2
  const worldCenterY = (b.minY + b.maxY) / 2

  return {
    x: worldCenterX + (cx - centerX - offsetX.value) / currentScale,
    y: worldCenterY - (cy - centerY - offsetY.value) / currentScale
  }
}

const draw = () => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  const { width, height } = canvas.value

  ctx.clearRect(0, 0, width, height)

  // 背景
  const bgGradient = ctx.createLinearGradient(0, 0, width, height)
  bgGradient.addColorStop(0, '#f8fafc')
  bgGradient.addColorStop(1, '#f1f5f9')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, width, height)

  if (props.boreholes.length === 0) return

  const b = bounds.value

  // 绘制网格
  const gridSize = 50 * scale.value
  const gridAlpha = Math.min(0.25, gridSize / 120)
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

  // 绘制插值热力图
  if (hasInterpolationData.value && props.interpolationGrid.length > 0) {
    const grid = props.interpolationGrid
    const rows = grid.length
    const cols = grid[0]?.length || 0

    // 计算网格范围
    const gridMinX = b.minX
    const gridMaxX = b.maxX
    const gridMinY = b.minY
    const gridMaxY = b.maxY

    const cellWidth = (gridMaxX - gridMinX) / cols
    const cellHeight = (gridMaxY - gridMinY) / rows

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const value = grid[i][j]
        if (value === null || value === undefined) continue

        const color = getColor(value)
        if (!color) continue

        // 计算单元格的四个角
        const x1 = gridMinX + j * cellWidth
                        const y1 = gridMinY + (rows - 1 - i) * cellHeight
        const x2 = x1 + cellWidth
        const y2 = y1 + cellHeight

        const p1 = worldToCanvas(x1, y1)
                        const p2 = worldToCanvas(x2, y2)

                        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
                        ctx.fillRect(p1.x, p1.y, Math.max(1, p2.x - p1.x), Math.max(1, p2.y - p1.y))
      }
    }
  }

  // 绘制钻孔连接线（边界）
  if (showBoreholes.value && props.boreholes.length >= 3) {
    const hull = computeConvexHull(props.boreholes)

    ctx.beginPath()
    hull.forEach((point, i) => {
      const pos = worldToCanvas(point.x, point.y)
      if (i === 0) ctx.moveTo(pos.x, pos.y)
      else ctx.lineTo(pos.x, pos.y)
    })
    ctx.closePath()

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.stroke()
    ctx.setLineDash([])
  }

  // 绘制钻孔点
  if (showBoreholes.value) {
    canvas.value.boreholePositions = props.boreholes.map((bh, i) => {
      const pos = worldToCanvas(bh.x, bh.y)
      return {
        index: i,
        name: bh.name,
        x: bh.x,
        y: bh.y,
        canvasX: pos.x,
        canvasY: pos.y,
        value: bh[props.field]
      }
    })

    canvas.value.boreholePositions.forEach((bh) => {
      // 外圈
      ctx.beginPath()
      ctx.arc(bh.canvasX, bh.canvasY, 10, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.fill()

      // 主点
      ctx.beginPath()
      ctx.arc(bh.canvasX, bh.canvasY, 6, 0, Math.PI * 2)

      const valueColor = getColor(bh.value)
      if (valueColor) {
        ctx.fillStyle = `rgb(${valueColor.r}, ${valueColor.g}, ${valueColor.b})`
      } else {
        ctx.fillStyle = '#3b82f6'
      }
      ctx.fill()

      ctx.strokeStyle = '#1e3a8a'
      ctx.lineWidth = 2
      ctx.stroke()

      // 标签
      if (showValues.value && bh.value !== null && bh.value !== undefined) {
        const label = bh.value.toFixed(2)
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'

        // 标签背景
        const textMetrics = ctx.measureText(label)
        const labelBgW = textMetrics.width + 8
        const labelBgH = 14
        const labelBgX = bh.canvasX - labelBgW / 2
        const labelBgY = bh.canvasY + 14

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.beginPath()
        ctx.roundRect(labelBgX, labelBgY, labelBgW, labelBgH, 4)
        ctx.fill()

        ctx.fillStyle = '#1e293b'
        ctx.fillText(label, bh.canvasX, labelBgY + 11)
      }

      // 名称
      if (bh.name) {
        ctx.font = 'bold 10px sans-serif'
        ctx.fillStyle = '#64748b'
        ctx.textAlign = 'center'
        ctx.fillText(bh.name, bh.canvasX, bh.canvasY - 14)
      }
    })
  }

  // 绘制坐标轴
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1.5
  const origin = worldToCanvas(0, 0)

  if (origin.y >= 0 && origin.y <= height) {
    ctx.beginPath()
    ctx.moveTo(0, origin.y)
    ctx.lineTo(width, origin.y)
    ctx.stroke()
  }
  if (origin.x >= 0 && origin.x <= width) {
    ctx.beginPath()
    ctx.moveTo(origin.x, 0)
    ctx.lineTo(origin.x, height)
    ctx.stroke()
  }

  // 比例尺
  const scaleWidth = 80 * scale.value
  if (scaleWidth > 40 && scaleWidth < 200) {
    const scaleY = height - 20
    const scaleStart = 20

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.roundRect(scaleStart - 4, scaleY - 10, scaleWidth + 8, 20, 4)
    ctx.fill()

    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(scaleStart, scaleY)
    ctx.lineTo(scaleStart + scaleWidth, scaleY)
    ctx.stroke()

    const baseScale = Math.min(
      (canvasSize.value - 60) / (b.rangeX || 1),
      (canvasSize.value - 60) / (b.rangeY || 1)
    )
    const realWorldLength = Math.round(80 / scale.value / baseScale)

    ctx.fillStyle = '#475569'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${realWorldLength}m`, scaleStart + scaleWidth / 2, scaleY - 12)
  }
}

const computeConvexHull = (points) => {
  if (points.length < 3) return points

  const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x)
  const start = sorted[0]

  const getAngle = (p) => Math.atan2(p.y - start.y, p.x - start.x)

  const sortedByAngle = sorted.slice(1).sort((a, b) => {
    const angleA = getAngle(a)
    const angleB = getAngle(b)
    if (angleA !== angleB) return angleA - angleB
    const distA = Math.hypot(a.x - start.x, a.y - start.y)
    const distB = Math.hypot(b.x - start.x, b.y - start.y)
    return distA - distB
  })

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

const clampScale = (nextScale) => Math.max(0.3, Math.min(5, nextScale))

const getPointerDistance = (pointsMap) => {
  const values = Array.from(pointsMap.values())
  if (values.length < 2) return 0
  const [a, b] = values
  return Math.hypot(a.x - b.x, a.y - b.y)
}

const zoomIn = () => {
  scale.value = clampScale(scale.value * 1.25)
  draw()
}

const zoomOut = () => {
  scale.value = clampScale(scale.value / 1.25)
  draw()
}

const resetView = () => {
  scale.value = 1
  offsetX.value = 0
  offsetY.value = 0
  draw()
}

const startDrag = (e) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  canvas.value?.setPointerCapture?.(e.pointerId)
  activePointers.value.set(e.pointerId, { x: e.clientX, y: e.clientY })

  if (activePointers.value.size === 2) {
    isDragging.value = false
    pinchStartDistance.value = getPointerDistance(activePointers.value)
    pinchStartScale.value = scale.value
    return
  }

  isDragging.value = true
  dragStart.value = { x: e.clientX - offsetX.value, y: e.clientY - offsetY.value }
}

const endDrag = (e) => {
  if (canvas.value && e?.pointerId !== undefined && canvas.value.hasPointerCapture?.(e.pointerId)) {
    canvas.value.releasePointerCapture(e.pointerId)
  }
  if (e?.pointerId !== undefined) {
    activePointers.value.delete(e.pointerId)
  }
  if (activePointers.value.size < 2) {
    pinchStartDistance.value = 0
  }
  isDragging.value = activePointers.value.size === 1
}

const handlePointerMove = (e) => {
  if (!canvas.value) return
  if (activePointers.value.has(e.pointerId)) {
    activePointers.value.set(e.pointerId, { x: e.clientX, y: e.clientY })
  }
  if (activePointers.value.size === 2) {
    const distance = getPointerDistance(activePointers.value)
    if (pinchStartDistance.value > 0 && distance > 0) {
      scale.value = clampScale(pinchStartScale.value * (distance / pinchStartDistance.value))
      draw()
    }
    return
  }

  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (isDragging.value) {
    offsetX.value = e.clientX - dragStart.value.x
    offsetY.value = e.clientY - dragStart.value.y
    draw()
    return
  }

  // 检测是否悬停在钻孔点上
  let found = null
  if (e.pointerType !== 'touch' && canvas.value.boreholePositions) {
    for (const bh of canvas.value.boreholePositions) {
      const dist = Math.sqrt((x - bh.canvasX) ** 2 + (y - bh.canvasY) ** 2)
      if (dist < 12) {
        found = { ...bh, isBorehole: true }
        break
      }
    }
  }

  // 如果没有悬停在钻孔上，检查插值网格
  if (!found && hasInterpolationData.value) {
    const worldPos = canvasToWorld(x, y)
    if (worldPos) {
      const b = bounds.value
      const grid = props.interpolationGrid
      const rows = grid.length
      const cols = grid[0]?.length || 0

      const cellWidth = (b.maxX - b.minX) / cols
      const cellHeight = (b.maxY - b.minY) / rows

      const col = Math.floor((worldPos.x - b.minX) / cellWidth)
      const row = rows - 1 - Math.floor((worldPos.y - b.minY) / cellHeight)

      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        const value = grid[row][col]
        if (value !== null && value !== undefined) {
          found = { x: worldPos.x, y: worldPos.y, value, isBorehole: false }
        }
      }
    }
  }

  hoverInfo.value = found
  hoverPos.value = { x: e.clientX, y: e.clientY }
  canvas.value.style.cursor = found ? 'pointer' : (isDragging.value ? 'grabbing' : 'grab')
}

const handleWheel = (e) => {
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  scale.value = clampScale(scale.value * delta)
  draw()
}

const handleCanvasKeydown = (e) => {
  const step = e.shiftKey ? 40 : 20
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      offsetY.value += step
      draw()
      break
    case 'ArrowDown':
      e.preventDefault()
      offsetY.value -= step
      draw()
      break
    case 'ArrowLeft':
      e.preventDefault()
      offsetX.value += step
      draw()
      break
    case 'ArrowRight':
      e.preventDefault()
      offsetX.value -= step
      draw()
      break
    case '+':
    case '=':
      e.preventDefault()
      zoomIn()
      break
    case '-':
      e.preventDefault()
      zoomOut()
      break
    case 'r':
    case 'R':
      e.preventDefault()
      resetView()
      break
    default:
      break
  }
}

onMounted(() => {
  draw()
  if (canvas.value) {
    canvas.value.style.cursor = 'grab'
  }
})

onUnmounted(() => {
  activePointers.value.clear()
})

watch(() => [props.boreholes, props.interpolationGrid, props.field, showBoreholes.value, showValues.value], () => {
  draw()
}, { deep: true })
</script>

<style scoped>
.interpolation-map-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.map-wrapper {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
  background: white;
}

.map-wrapper.dragging {
  cursor: grabbing !important;
}

.map-wrapper canvas {
  display: block;
  cursor: grab;
  touch-action: none;
  overscroll-behavior: contain;
}

.map-wrapper canvas:active {
  cursor: grabbing;
}

.map-wrapper canvas:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
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
  width: 34px;
  height: 34px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  font-size: 16px;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.control-btn span {
  display: block;
  margin-top: -2px;
}

.control-btn:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

.control-btn.active {
  background: #3b82f6;
  color: white;
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
  font-size: 14px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-hint {
  font-size: 12px;
  color: #94a3b8;
}

.hover-info {
  position: fixed;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25),
              0 0 0 1px rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}

.hover-header {
  margin-bottom: 6px;
}

.hover-coords {
  font-size: 11px;
  color: #94a3b8;
}

.hover-borehole {
  font-size: 13px;
}

.hover-borehole strong {
  color: #60a5fa;
}

.hover-value {
  margin-top: 4px;
  font-size: 12px;
}

.value-num {
  color: #fbbf24;
  font-weight: 600;
  font-family: 'Consolas', monospace;
}

.hover-interp {
  font-size: 12px;
}

.interp-label {
  color: #94a3b8;
}

.legend-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.legend-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  min-width: 45px;
}

.legend-gradient {
  flex: 1;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(to right,
    #1e40af, #2563eb, #3b82f6, #06b6d4,
    #10b981, #84cc16, #fbbf24, #fb923c, #ef4444
  );
}

.legend-unit {
  font-size: 11px;
  color: #94a3b8;
  min-width: 40px;
  text-align: right;
}

.stats-bar {
  display: flex;
  gap: 16px;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 10px;
  font-size: 12px;
  color: #64748b;
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
