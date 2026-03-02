<template>
  <div class="pressure-heatmap-pro" ref="containerRef">
    <!-- 标题栏 -->
    <header class="heatmap-header">
      <div class="header-left">
        <div class="panel-badge">{{ panelLabel }}</div>
        <div class="title-group">
          <h2 class="heatmap-title">{{ title }}</h2>
          <p v-if="subtitle" class="heatmap-subtitle">{{ subtitle }}</p>
        </div>
      </div>
      
      <div class="header-center">
        <!-- 工具栏 -->
        <div class="toolbar">
          <button
            v-for="tool in tools"
            :key="tool.id"
            :class="['tool-btn', { active: activeTool === tool.id }]"
            @click="setTool(tool.id)"
            :title="tool.label"
          >
            <span v-html="tool.icon"></span>
          </button>
        </div>
        
        <!-- 视图模式 -->
        <div class="view-modes">
          <button
            v-for="mode in viewModes"
            :key="mode.id"
            :class="['mode-btn', { active: currentViewMode === mode.id }]"
            @click="setViewMode(mode.id)"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>
      
      <div class="header-right">
        <button class="action-btn" @click="resetView" title="重置视图">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/>
          </svg>
        </button>
        <button class="action-btn" :class="{ active: showGrid }" @click="showGrid = !showGrid">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
          </svg>
        </button>
        <button class="action-btn primary" @click="exportImage">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- 主Canvas区域 -->
    <div class="canvas-wrapper" ref="wrapperRef">
      <!-- 底层：静态瓦片缓存 -->
      <canvas ref="tileCanvasRef" class="tile-canvas"></canvas>
      
      <!-- 中层：动态交互层 -->
      <canvas 
        ref="canvasRef" 
        class="main-canvas"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @wheel="onWheel"
        @click="onClick"
        @dblclick="onDoubleClick"
      ></canvas>
      
      <!-- 顶层：选择框/刷选层 -->
      <canvas ref="overlayCanvasRef" class="overlay-canvas"></canvas>
      
      <!-- 轴标签 -->
      <div class="axis axis-y">
        <div class="axis-title">推进距离 (m)</div>
        <div class="axis-ticks" ref="yTicksRef">
          <div 
            v-for="tick in visibleYTicks" 
            :key="tick.value"
            class="tick"
            :style="{ top: tick.position + '%' }"
          >
            <span class="tick-label">{{ tick.label }}</span>
          </div>
        </div>
      </div>
      
      <div class="axis axis-x">
        <div class="axis-title">支架位置 (编号)</div>
        <div class="axis-ticks" ref="xTicksRef">
          <div 
            v-for="tick in visibleXTicks" 
            :key="tick.value"
            class="tick"
            :style="{ left: tick.position + '%' }"
          >
            <span class="tick-label">{{ tick.label }}</span>
          </div>
        </div>
      </div>
      
      <!-- 缩放控制 -->
      <div class="zoom-control">
        <button @click="zoomIn" class="zoom-btn">+</button>
        <div class="zoom-slider">
          <input 
            type="range" 
            min="0.5" 
            max="10" 
            step="0.1" 
            v-model.number="scale"
            @input="onZoomInput"
          />
        </div>
        <button @click="zoomOut" class="zoom-btn">−</button>
        <span class="zoom-value">{{ Math.round(scale * 100) }}%</span>
      </div>
      
      <!-- 十字准星 -->
      <div v-if="crosshair.visible" class="crosshair" :style="crosshairStyle">
        <div class="crosshair-line-h"></div>
        <div class="crosshair-line-v"></div>
        <div class="crosshair-center"></div>
      </div>
      
      <!-- 选择框 -->
      <div v-if="selection.active" class="selection-box" :style="selectionStyle">
        <div class="selection-inner"></div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <span>加载中...</span>
      </div>
    </div>

    <!-- 底部控制栏 -->
    <div class="heatmap-footer">
      <!-- 颜色图例 -->
      <div class="legend-section">
        <div class="legend-gradient-wrapper">
          <div class="legend-gradient" :style="{ background: currentGradient }"></div>
          <div class="legend-ticks">
            <div v-for="(tick, i) in legendTicks" :key="i" class="tick" :style="{ left: tick.position + '%' }">
              <span class="tick-line"></span>
              <span class="tick-value">{{ tick.value }}</span>
            </div>
          </div>
        </div>
        <span class="legend-unit">MPa</span>
        
        <!-- 配色方案选择 -->
        <div class="color-schemes">
          <button
            v-for="scheme in colorSchemes"
            :key="scheme.id"
            :class="['scheme-btn', { active: currentColorScheme === scheme.id }]"
            @click="setColorScheme(scheme.id)"
            :title="scheme.name"
          >
            <div class="scheme-preview" :style="{ background: scheme.preview }"></div>
          </button>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="stats-section" v-if="stats">
        <div class="stat-item" v-for="stat in displayStats" :key="stat.label">
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-value" :class="stat.class">{{ stat.value }}</span>
          <span v-if="stat.unit" class="stat-unit">{{ stat.unit }}</span>
        </div>
      </div>
    </div>

    <!-- 悬浮提示 -->
    <Transition name="tooltip">
      <div v-if="hoveredCell && showTooltip" class="tooltip-pro" :style="tooltipStyle">
        <div class="tooltip-header" :style="{ background: getCellColor(hoveredCell.value) }">
          <span class="tooltip-badge">{{ hoveredCell.supportId }}</span>
          <span class="tooltip-title">支架 #{{ hoveredCell.supportId }}</span>
        </div>
        <div class="tooltip-body">
          <div class="metric">
            <span class="metric-label">末阻力</span>
            <span class="metric-value">{{ formatValue(hoveredCell.value) }} MPa</span>
          </div>
          <div class="metric">
            <span class="metric-label">日期</span>
            <span class="metric-value">{{ formatDate(hoveredCell.date) }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">推进距离</span>
            <span class="metric-value">{{ hoveredCell.advanceDistance }} m</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 聚焦模式面板 -->
    <div v-if="focusMode.active" class="focus-panel">
      <div class="focus-header">
        <span>聚焦模式</span>
        <button @click="exitFocusMode">退出</button>
      </div>
      <div class="focus-stats">
        <div class="focus-stat">
          <span>选中区域</span>
          <strong>{{ focusMode.cellCount }} 单元格</strong>
        </div>
        <div class="focus-stat">
          <span>平均值</span>
          <strong>{{ formatValue(focusMode.avgValue) }} MPa</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

// ============================================================================
// Props & Emits
// ============================================================================

const props = defineProps({
  panelLabel: { type: String, default: 'A' },
  title: { type: String, default: '矿压强度热力图' },
  subtitle: String,
  matrix: { type: Array, default: () => [] },
  cells: { type: Array, default: () => [] },
  stats: { type: Object, default: null },
  numRows: { type: Number, default: 0 },
  numCols: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  showTooltip: { type: Boolean, default: true }
})

const emit = defineEmits(['cell-select', 'cell-hover', 'selection-change', 'export'])

// ============================================================================
// Refs
// ============================================================================

const containerRef = ref(null)
const wrapperRef = ref(null)
const canvasRef = ref(null)
const tileCanvasRef = ref(null)
const overlayCanvasRef = ref(null)

// 状态
const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const currentColorScheme = ref('diverging')
const currentViewMode = ref('heatmap')
const activeTool = ref('pan') // pan, select, brush
const showGrid = ref(false)

// 交互状态
const hoveredCell = ref(null)
const crosshair = ref({ visible: false, x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// 选择/刷选
const selection = ref({
  active: false,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0
})

// 聚焦模式
const focusMode = ref({
  active: false,
  selectedCells: [],
  cellCount: 0,
  avgValue: 0
})

// 渲染缓存
const tileCache = ref(null)
const renderPending = ref(false)

// ============================================================================
// Constants
// ============================================================================

const COLORS = {
  diverging: {
    name: '发散色',
    colors: ['#313695', '#4575B4', '#74ADD1', '#ABD9E9', '#E0F3F8', '#FFFFBF', '#FEE090', '#FDAE61', '#F46D43', '#D73027', '#A50026']
  },
  viridis: {
    name: 'Viridis',
    colors: ['#440154', '#482878', '#3E4A89', '#31688E', '#26828E', '#1F9E89', '#35B779', '#6DCD59', '#B4DE2C', '#FDE725']
  },
  plasma: {
    name: 'Plasma',
    colors: ['#0D0887', '#3E049C', '#6300A7', '#8707A6', '#A62098', '#C03A83', '#D5546E', '#E76F5A', '#F58F46', '#FDB32F', '#F0F921']
  },
  magma: {
    name: 'Magma',
    colors: ['#000004', '#140E36', '#3B0F70', '#5F187F', '#832681', '#A6407A', '#C95F6B', '#E8845E', '#FCAF62', '#FEDB7C', '#FCFDBF']
  },
  coolwarm: {
    name: '冷暖',
    colors: ['#3B4CC0', '#5B7AE4', '#82A5FB', '#AAC7FD', '#D3E0FE', '#F5F5F5', '#FFD7D7', '#FFAAA8', '#F57974', '#D95853', '#B40426']
  }
}

const tools = [
  { id: 'pan', label: '平移', icon: '&#9995;' },
  { id: 'select', label: '框选', icon: '&#9744;' },
  { id: 'brush', label: '刷选', icon: '&#9998;' }
]

const viewModes = [
  { id: 'heatmap', label: '热力图' },
  { id: 'contour', label: '等值线' },
  { id: 'detail', label: '细节' }
]

const colorSchemes = Object.entries(COLORS).map(([id, config]) => ({
  id,
  name: config.name,
  preview: `linear-gradient(to right, ${config.colors[0]}, ${config.colors[Math.floor(config.colors.length / 2)]}, ${config.colors[config.colors.length - 1]})`
}))

// ============================================================================
// Computed
// ============================================================================

const hasData = computed(() => props.matrix?.length > 0 && props.matrix[0]?.length > 0)

const colorScaleRange = computed(() => {
  if (!hasData.value) return { min: 0, max: 60 }
  const values = props.matrix.flat().filter(Number.isFinite)
  return {
    min: values.length ? Math.min(...values) : 0,
    max: values.length ? Math.max(...values) : 60
  }
})

const currentGradient = computed(() => {
  const scheme = COLORS[currentColorScheme.value] || COLORS.diverging
  return `linear-gradient(to right, ${scheme.colors.join(', ')})`
})

const legendTicks = computed(() => {
  const { min, max } = colorScaleRange.value
  return [0, 0.25, 0.5, 0.75, 1].map(t => ({
    value: formatValue(min + (max - min) * t),
    position: t * 100
  }))
})

const visibleXTicks = computed(() => {
  if (!hasData.value) return []
  const ticks = []
  const cols = props.numCols
  for (let i = 0; i <= 5; i++) {
    ticks.push({
      value: Math.round((i / 5) * cols) + 1,
      position: (i / 5) * 100
    })
  }
  return ticks
})

const visibleYTicks = computed(() => {
  if (!hasData.value) return []
  const ticks = []
  const rows = props.numRows
  for (let i = 0; i <= 5; i++) {
    const value = Math.round((rows - (i / 5) * rows) * 10)
    ticks.push({
      value,
      label: value.toString(),
      position: (i / 5) * 100
    })
  }
  return ticks
})

const displayStats = computed(() => {
  if (!props.stats) return []
  return [
    { label: '均值', value: formatValue(props.stats.mean), unit: 'MPa' },
    { label: '范围', value: `${formatValue(props.stats.min)} - ${formatValue(props.stats.max)}`, unit: 'MPa' },
    { label: '标准差', value: formatValue(props.stats.std), unit: '' }
  ]
})

const crosshairStyle = computed(() => ({
  left: crosshair.value.x + 'px',
  top: crosshair.value.y + 'px'
}))

const selectionStyle = computed(() => ({
  left: Math.min(selection.value.startX, selection.value.endX) + 'px',
  top: Math.min(selection.value.startY, selection.value.endY) + 'px',
  width: Math.abs(selection.value.endX - selection.value.startX) + 'px',
  height: Math.abs(selection.value.endY - selection.value.startY) + 'px'
}))

const tooltipStyle = computed(() => {
  if (!hoveredCell.value || !wrapperRef.value) return {}
  const rect = wrapperRef.value.getBoundingClientRect()
  let left = crosshair.value.x + 15
  let top = crosshair.value.y + 15
  
  // 边界检测
  if (left + 180 > rect.width) left = crosshair.value.x - 195
  if (top + 120 > rect.height) top = crosshair.value.y - 135
  
  return { left: left + 'px', top: top + 'px' }
})

// ============================================================================
// Methods - 渲染核心
// ============================================================================

/**
 * 初始化画布
 */
function initCanvas() {
  const canvas = canvasRef.value
  const tileCanvas = tileCanvasRef.value
  const overlayCanvas = overlayCanvasRef.value
  if (!canvas || !wrapperRef.value) return

  const rect = wrapperRef.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  
  // 设置画布尺寸
  ;[canvas, tileCanvas, overlayCanvas].forEach(c => {
    c.width = Math.floor(rect.width * dpr)
    c.height = Math.floor(rect.height * dpr)
    c.style.width = rect.width + 'px'
    c.style.height = rect.height + 'px'
    const ctx = c.getContext('2d')
    ctx.scale(dpr, dpr)
  })

  // 初始化渲染
  render()
}

/**
 * 主渲染函数 - 使用requestAnimationFrame优化
 */
function render() {
  if (renderPending.value) return
  renderPending.value = true
  
  requestAnimationFrame(() => {
    renderPending.value = false
    
    if (currentViewMode.value === 'heatmap') {
      renderHeatmap()
    } else if (currentViewMode.value === 'contour') {
      renderContours()
    } else {
      renderDetail()
    }
    
    renderOverlay()
  })
}

/**
 * 渲染热力图 - 优化版
 */
function renderHeatmap() {
  const canvas = canvasRef.value
  if (!canvas || !hasData.value) return

  const ctx = canvas.getContext('2d')
  const width = canvas.width / (window.devicePixelRatio || 1)
  const height = canvas.height / (window.devicePixelRatio || 1)

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  const rows = props.numRows
  const cols = props.numCols
  
  // 计算可见区域
  const visibleRect = getVisibleRect(width, height)
  
  // 计算单元格尺寸
  const cellW = width / cols
  const cellH = height / rows

  // 应用变换
  ctx.save()
  ctx.translate(offsetX.value, offsetY.value)
  ctx.scale(scale.value, scale.value)

  // 只渲染可见区域的单元格
  const startCol = Math.max(0, Math.floor(-offsetX.value / scale.value / cellW))
  const endCol = Math.min(cols, Math.ceil((-offsetX.value + width) / scale.value / cellW))
  const startRow = Math.max(0, Math.floor(-offsetY.value / scale.value / cellH))
  const endRow = Math.min(rows, Math.ceil((-offsetY.value + height) / scale.value / cellH))

  // 批量绘制 - 减少状态切换
  const batchSize = 1000
  let batch = []
  
  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      const value = props.matrix[row]?.[col]
      if (!Number.isFinite(value)) continue

      batch.push({
        x: col * cellW,
        y: row * cellH,
        w: cellW + 0.5,
        h: cellH + 0.5,
        color: getCellColor(value)
      })

      if (batch.length >= batchSize) {
        drawBatch(ctx, batch)
        batch = []
      }
    }
  }
  
  if (batch.length > 0) {
    drawBatch(ctx, batch)
  }

  // 绘制网格
  if (showGrid.value) {
    drawGrid(ctx, cols, rows, cellW, cellH)
  }

  ctx.restore()
}

/**
 * 批量绘制单元格
 */
function drawBatch(ctx, batch) {
  // 按颜色分组，减少fillStyle切换
  const byColor = {}
  batch.forEach(item => {
    if (!byColor[item.color]) byColor[item.color] = []
    byColor[item.color].push(item)
  })

  Object.entries(byColor).forEach(([color, items]) => {
    ctx.fillStyle = color
    items.forEach(item => {
      ctx.fillRect(item.x, item.y, item.w, item.h)
    })
  })
}

/**
 * 绘制网格
 */
function drawGrid(ctx, cols, rows, cellW, cellH) {
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'
  ctx.lineWidth = 0.5 / scale.value
  ctx.beginPath()

  // 主网格线
  for (let i = 0; i <= cols; i += 10) {
    const x = i * cellW
    ctx.moveTo(x, 0)
    ctx.lineTo(x, rows * cellH)
  }
  for (let i = 0; i <= rows; i += 10) {
    const y = i * cellH
    ctx.moveTo(0, y)
    ctx.lineTo(cols * cellW, y)
  }
  ctx.stroke()
}

/**
 * 渲染等值线
 */
function renderContours() {
  // 简化的等值线实现
  renderHeatmap()
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const width = canvas.width / (window.devicePixelRatio || 1)
  const height = canvas.height / (window.devicePixelRatio || 1)
  
  const { min, max } = colorScaleRange.value
  const levels = 8
  
  ctx.save()
  ctx.translate(offsetX.value, offsetY.value)
  ctx.scale(scale.value, scale.value)
  
  const cellW = width / props.numCols
  const cellH = height / props.numRows
  
  ctx.lineWidth = 1.5 / scale.value
  
  for (let level = 1; level < levels; level++) {
    const threshold = min + (max - min) * (level / levels)
    ctx.strokeStyle = level % 2 === 0 ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)'
    
    ctx.beginPath()
    for (let row = 0; row < props.numRows - 1; row++) {
      for (let col = 0; col < props.numCols - 1; col++) {
        const v00 = props.matrix[row]?.[col]
        const v01 = props.matrix[row]?.[col + 1]
        const v10 = props.matrix[row + 1]?.[col]
        const v11 = props.matrix[row + 1]?.[col + 1]
        
        if (![v00, v01, v10, v11].every(Number.isFinite)) continue
        
        const crosses = [
          (v00 - threshold) * (v01 - threshold) < 0,
          (v00 - threshold) * (v10 - threshold) < 0
        ]
        
        if (crosses.some(c => c)) {
          const x = col * cellW + cellW / 2
          const y = row * cellH + cellH / 2
          ctx.moveTo(x - 2, y)
          ctx.lineTo(x + 2, y)
        }
      }
    }
    ctx.stroke()
  }
  
  ctx.restore()
}

/**
 * 渲染细节模式
 */
function renderDetail() {
  // 在细节模式下显示单元格数值
  renderHeatmap()
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const width = canvas.width / (window.devicePixelRatio || 1)
  const height = canvas.height / (window.devicePixelRatio || 1)
  
  if (scale.value < 2) return // 只在足够放大时显示
  
  ctx.save()
  ctx.translate(offsetX.value, offsetY.value)
  ctx.scale(scale.value, scale.value)
  
  const cellW = width / props.numCols
  const cellH = height / props.numRows
  
  ctx.font = `${Math.min(10, cellH / 2)}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#333'
  
  // 只在可见区域绘制文本
  const startCol = Math.max(0, Math.floor(-offsetX.value / scale.value / cellW))
  const endCol = Math.min(props.numCols, Math.ceil((-offsetX.value + width) / scale.value / cellW))
  const startRow = Math.max(0, Math.floor(-offsetY.value / scale.value / cellH))
  const endRow = Math.min(props.numRows, Math.ceil((-offsetY.value + height) / scale.value / cellH))
  
  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      const value = props.matrix[row]?.[col]
      if (!Number.isFinite(value)) continue
      
      const x = col * cellW + cellW / 2
      const y = row * cellH + cellH / 2
      ctx.fillText(value.toFixed(1), x, y)
    }
  }
  
  ctx.restore()
}

/**
 * 渲染覆盖层（选择框、高亮等）
 */
function renderOverlay() {
  const canvas = overlayCanvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const width = canvas.width / (window.devicePixelRatio || 1)
  const height = canvas.height / (window.devicePixelRatio || 1)
  
  ctx.clearRect(0, 0, width, height)
  
  // 绘制悬停单元格高亮
  if (hoveredCell.value) {
    ctx.save()
    ctx.translate(offsetX.value, offsetY.value)
    ctx.scale(scale.value, scale.value)
    
    const cellW = width / props.numCols
    const cellH = height / props.numRows
    const x = hoveredCell.value.col * cellW
    const y = hoveredCell.value.row * cellH
    
    // 高亮效果
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2 / scale.value
    ctx.strokeRect(x, y, cellW, cellH)
    
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.lineWidth = 0.5 / scale.value
    ctx.strokeRect(x + 1/scale.value, y + 1/scale.value, cellW - 2/scale.value, cellH - 2/scale.value)
    
    ctx.restore()
  }
}

/**
 * 获取可见区域
 */
function getVisibleRect(width, height) {
  return {
    x: -offsetX.value / scale.value,
    y: -offsetY.value / scale.value,
    width: width / scale.value,
    height: height / scale.value
  }
}

// ============================================================================
// Methods - 颜色处理
// ============================================================================

function getCellColor(value) {
  if (!Number.isFinite(value)) return 'transparent'
  
  const { min, max } = colorScaleRange.value
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)))
  
  const scheme = COLORS[currentColorScheme.value] || COLORS.diverging
  const colors = scheme.colors
  
  const idx = t * (colors.length - 1)
  const lower = Math.floor(idx)
  const upper = Math.ceil(idx)
  const frac = idx - lower
  
  if (lower === upper) return colors[lower]
  
  return interpolateColor(colors[lower], colors[upper], frac)
}

function interpolateColor(c1, c2, t) {
  const r1 = parseInt(c1.slice(1, 3), 16)
  const g1 = parseInt(c1.slice(3, 5), 16)
  const b1 = parseInt(c1.slice(5, 7), 16)
  const r2 = parseInt(c2.slice(1, 3), 16)
  const g2 = parseInt(c2.slice(3, 5), 16)
  const b2 = parseInt(c2.slice(5, 7), 16)
  
  const smoothT = t * t * (3 - 2 * t)
  
  const r = Math.round(r1 + (r2 - r1) * smoothT)
  const g = Math.round(g1 + (g2 - g1) * smoothT)
  const b = Math.round(b1 + (b2 - b1) * smoothT)
  
  return `rgb(${r},${g},${b})`
}

// ============================================================================
// Methods - 事件处理
// ============================================================================

function onMouseMove(e) {
  const rect = wrapperRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  crosshair.value = { x, y, visible: true }
  
  if (activeTool.value === 'pan' && isDragging.value) {
    offsetX.value += e.clientX - dragStart.value.x
    offsetY.value += e.clientY - dragStart.value.y
    dragStart.value = { x: e.clientX, y: e.clientY }
    render()
  } else if (activeTool.value === 'select' && isDragging.value) {
    selection.value.endX = x
    selection.value.endY = y
  }
  
  // 更新悬停单元格
  const cell = getCellAtPosition(x, y)
  if (cell?.supportId !== hoveredCell.value?.supportId) {
    hoveredCell.value = cell
    emit('cell-hover', cell)
    render()
  }
}

function onMouseDown(e) {
  const rect = wrapperRef.value?.getBoundingClientRect()
  if (!rect) return
  
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  
  if (activeTool.value === 'select') {
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    selection.value = {
      active: true,
      startX: x,
      startY: y,
      endX: x,
      endY: y
    }
  }
}

function onMouseUp() {
  isDragging.value = false
  
  if (activeTool.value === 'select' && selection.value.active) {
    // 完成选择
    const selectedCells = getSelectedCells()
    if (selectedCells.length > 0) {
      enterFocusMode(selectedCells)
    }
    selection.value.active = false
  }
}

function onMouseLeave() {
  hoveredCell.value = null
  crosshair.value.visible = false
  isDragging.value = false
  emit('cell-hover', null)
  render()
}

function onWheel(e) {
  e.preventDefault()
  
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  const newScale = Math.max(0.5, Math.min(10, scale.value * delta))
  
  if (newScale === scale.value) return
  
  const rect = wrapperRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  
  const scaleRatio = newScale / scale.value
  offsetX.value = mouseX - (mouseX - offsetX.value) * scaleRatio
  offsetY.value = mouseY - (mouseY - offsetY.value) * scaleRatio
  
  scale.value = newScale
  render()
}

function onClick(e) {
  const cell = getCellAtPosition(
    crosshair.value.x,
    crosshair.value.y
  )
  if (cell) {
    emit('cell-select', cell)
  }
}

function onDoubleClick() {
  resetView()
}

function onZoomInput() {
  render()
}

// ============================================================================
// Methods - 辅助功能
// ============================================================================

function getCellAtPosition(x, y) {
  const canvas = canvasRef.value
  if (!canvas) return null
  
  const width = canvas.width / (window.devicePixelRatio || 1)
  const height = canvas.height / (window.devicePixelRatio || 1)
  
  const adjustedX = (x - offsetX.value) / scale.value
  const adjustedY = (y - offsetY.value) / scale.value
  
  const cellW = width / props.numCols
  const cellH = height / props.numRows
  
  const col = Math.floor(adjustedX / cellW)
  const row = Math.floor(adjustedY / cellH)
  
  if (col >= 0 && col < props.numCols && row >= 0 && row < props.numRows) {
    const cell = props.cells.find(c => c.row === row && c.col === col)
    return cell || null
  }
  
  return null
}

function getSelectedCells() {
  // 根据选择框获取单元格
  // 简化实现
  return []
}

function enterFocusMode(cells) {
  focusMode.value = {
    active: true,
    selectedCells: cells,
    cellCount: cells.length,
    avgValue: cells.reduce((a, b) => a + (b.value || 0), 0) / cells.length
  }
}

function exitFocusMode() {
  focusMode.value.active = false
  focusMode.value.selectedCells = []
}

// ============================================================================
// Methods - 控制
// ============================================================================

function setTool(tool) {
  activeTool.value = tool
}

function setViewMode(mode) {
  currentViewMode.value = mode
  render()
}

function setColorScheme(scheme) {
  currentColorScheme.value = scheme
  render()
}

function resetView() {
  scale.value = 1
  offsetX.value = 0
  offsetY.value = 0
  render()
}

function zoomIn() {
  scale.value = Math.min(10, scale.value * 1.2)
  render()
}

function zoomOut() {
  scale.value = Math.max(0.5, scale.value / 1.2)
  render()
}

function exportImage() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const link = document.createElement('a')
  link.download = `heatmap-${Date.now()}.png`
  link.href = canvas.toDataURL()
  link.click()
  
  emit('export')
}

// ============================================================================
// Utilities
// ============================================================================

function formatValue(val) {
  if (!Number.isFinite(val)) return '--'
  return val.toFixed(2)
}

function formatDate(date) {
  if (!date) return '--'
  const d = new Date(date)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', initCanvas)
  
  if (hasData.value) {
    render()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', initCanvas)
})

watch(() => props.matrix, () => {
  if (hasData.value) {
    nextTick(render)
  }
}, { deep: true })
</script>

<style scoped>
.pressure-heatmap-pro {
  --header-height: 56px;
  --footer-height: 60px;
  --axis-size: 40px;
  
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

/* Header */
.heatmap-header {
  height: var(--header-height);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(180deg, #fafafa, #fff);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-badge {
  width: 28px;
  height: 28px;
  background: #1a1a1a;
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.title-group h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.title-group p {
  margin: 0;
  font-size: 11px;
  color: #737373;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar {
  display: flex;
  gap: 4px;
  padding: 3px;
  background: #f5f5f5;
  border-radius: 6px;
}

.tool-btn {
  width: 32px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: rgba(255,255,255,0.8);
}

.tool-btn.active {
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.view-modes {
  display: flex;
  gap: 2px;
  padding: 2px;
  background: #f5f5f5;
  border-radius: 6px;
}

.mode-btn {
  padding: 6px 12px;
  border: none;
  background: transparent;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #737373;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn:hover {
  color: #1a1a1a;
}

.mode-btn.active {
  background: #fff;
  color: #1a1a1a;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.header-right {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e5e5e5;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #525252;
  transition: all 0.2s;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.action-btn.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: white;
}

/* Canvas Wrapper */
.canvas-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #f5f5f5;
}

.tile-canvas,
.main-canvas,
.overlay-canvas {
  position: absolute;
  top: var(--axis-size);
  left: var(--axis-size);
  right: 0;
  bottom: 0;
}

.tile-canvas {
  z-index: 1;
}

.main-canvas {
  z-index: 2;
  cursor: crosshair;
}

.overlay-canvas {
  z-index: 3;
  pointer-events: none;
}

/* Axes */
.axis {
  position: absolute;
  pointer-events: none;
}

.axis-y {
  left: 0;
  top: var(--axis-size);
  bottom: 0;
  width: var(--axis-size);
}

.axis-x {
  left: var(--axis-size);
  right: 0;
  bottom: 0;
  height: var(--axis-size);
}

.axis-title {
  position: absolute;
  font-size: 10px;
  font-weight: 600;
  color: #525252;
  text-transform: uppercase;
}

.axis-y .axis-title {
  top: 8px;
  left: 50%;
  transform: rotate(-90deg) translateX(-50%);
  transform-origin: left center;
}

.axis-x .axis-title {
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
}

.axis-ticks {
  position: absolute;
  inset: 0;
}

.tick {
  position: absolute;
  font-size: 10px;
  color: #737373;
}

.axis-y .tick {
  right: 8px;
  transform: translateY(-50%);
}

.axis-x .tick {
  bottom: 8px;
  transform: translateX(-50%);
}

/* Zoom Control */
.zoom-control {
  position: absolute;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.95);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10;
}

.zoom-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #e5e5e5;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: #525252;
}

.zoom-btn:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.zoom-slider {
  width: 80px;
}

.zoom-slider input {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: #e5e5e5;
  border-radius: 2px;
  outline: none;
}

.zoom-slider input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #1a1a1a;
  border-radius: 50%;
  cursor: pointer;
}

.zoom-value {
  font-size: 11px;
  font-weight: 600;
  color: #525252;
  min-width: 40px;
}

/* Crosshair */
.crosshair {
  position: absolute;
  pointer-events: none;
  z-index: 5;
}

.crosshair-line-h,
.crosshair-line-v {
  position: absolute;
  background: rgba(26, 26, 26, 0.5);
}

.crosshair-line-h {
  left: -1000px;
  right: -1000px;
  top: 0;
  height: 1px;
}

.crosshair-line-v {
  top: -1000px;
  bottom: -1000px;
  left: 0;
  width: 1px;
}

.crosshair-center {
  position: absolute;
  left: -4px;
  top: -4px;
  width: 8px;
  height: 8px;
  border: 2px solid #1a1a1a;
  border-radius: 50%;
  background: white;
}

/* Selection Box */
.selection-box {
  position: absolute;
  border: 2px dashed #1a1a1a;
  background: rgba(26, 26, 26, 0.1);
  pointer-events: none;
  z-index: 4;
}

/* Loading */
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255,255,255,0.9);
  z-index: 20;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e5e5;
  border-top-color: #1a1a1a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Footer */
.heatmap-footer {
  height: var(--footer-height);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.legend-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.legend-gradient-wrapper {
  position: relative;
  width: 200px;
}

.legend-gradient {
  height: 12px;
  border-radius: 6px;
}

.legend-ticks {
  position: relative;
  height: 16px;
  margin-top: 4px;
}

.legend-ticks .tick {
  position: absolute;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.tick-line {
  width: 1px;
  height: 4px;
  background: #a3a3a3;
}

.tick-value {
  font-size: 9px;
  color: #737373;
}

.legend-unit {
  font-size: 11px;
  font-weight: 600;
  color: #1a1a1a;
}

.color-schemes {
  display: flex;
  gap: 4px;
}

.scheme-btn {
  width: 24px;
  height: 16px;
  padding: 2px;
  border: 1px solid #e5e5e5;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.scheme-btn.active {
  border-color: #1a1a1a;
  box-shadow: 0 0 0 2px rgba(26,26,26,0.1);
}

.scheme-preview {
  width: 100%;
  height: 100%;
  border-radius: 2px;
}

.stats-section {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.stat-label {
  font-size: 10px;
  color: #737373;
}

.stat-value {
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-unit {
  font-size: 10px;
  color: #a3a3a3;
}

/* Tooltip */
.tooltip-pro {
  position: absolute;
  z-index: 100;
  min-width: 160px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  overflow: hidden;
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

.tooltip-header {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tooltip-badge {
  width: 20px;
  height: 20px;
  background: rgba(255,255,255,0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: white;
}

.tooltip-title {
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.tooltip-body {
  padding: 10px 12px;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.metric-label {
  font-size: 11px;
  color: #737373;
}

.metric-value {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
}

/* Focus Panel */
.focus-panel {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 200px;
  padding: 16px;
  background: rgba(255,255,255,0.98);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  z-index: 15;
}

.focus-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.focus-header span {
  font-size: 13px;
  font-weight: 600;
}

.focus-header button {
  padding: 4px 10px;
  border: none;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

.focus-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.focus-stat {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.focus-stat span {
  color: #737373;
}

.focus-stat strong {
  color: #1a1a1a;
}
</style>
