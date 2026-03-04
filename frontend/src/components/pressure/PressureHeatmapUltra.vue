<template>
  <div class="pressure-heatmap-ultra" ref="containerRef">
    <!-- 閺嶅洭顣介弽?-->
    <header class="heatmap-header">
      <div class="header-left">
        <div class="panel-badge">{{ panelLabel }}</div>
        <div class="title-group">
          <h2 class="heatmap-title">{{ title }}</h2>
          <p v-if="subtitle" class="heatmap-subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <div class="header-center">
        <div class="view-modes">
          <button
            v-for="mode in viewModes"
            :key="mode.id"
            :class="['mode-btn', { active: currentViewMode === mode.id }]"
            @click="setViewMode(mode.id)"
          >
            <span class="mode-icon">{{ mode.icon }}</span>
            <span class="mode-label">{{ mode.label }}</span>
          </button>
        </div>
      </div>
      <div class="header-right">
        <button class="tool-btn" @click="resetView" title="重置视图">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/>
            <path d="M3 3v9h9"/>
          </svg>
        </button>
        <button class="tool-btn" :class="{ active: showGrid }" @click="showGrid = !showGrid">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
          </svg>
        </button>
        <button class="tool-btn" @click="showExportDialog = true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- 娑撶眴anvas閸栧搫鐓?-->
    <div class="canvas-wrapper" ref="canvasWrapperRef">
      <div class="canvas-container" ref="canvasContainerRef">
        <!-- 閼冲本娅欑仦鍌︾窗闁插洤灏懗灞炬珯閿涘牓娼ら幀渚婄礉娑撳秹娈㈢紓鈺傛杹閿?-->
        <div class="mining-area-bg"></div>
        
        <!-- 娑撶眴anvas閿涙艾瀵橀崥顐紣娴ｆ粓娼版潏瑙勵攱閸滃本鏆熼幑?-->
        <canvas
          ref="canvasRef"
          :width="internalWidth"
          :height="internalHeight"
          :style="canvasStyle"
          @mousemove="onMouseMove"
          @mouseleave="onMouseLeave"
          @click="onClick"
          @dblclick="onDoubleClick"
          @wheel="onWheel"
          @mousedown="onMouseDown"
        ></canvas>

        <!-- 閸ф劖鐖ｆ潪?-->
        <div class="axis axis-y">
          <div class="axis-title">支架编号</div>
          <div class="axis-ticks">
            <div 
              v-for="tick in yAxisTicks" 
              :key="tick.value" 
              class="tick" 
              :style="{ top: tick.position + '%' }"
            >
              <span class="tick-label">#{{ tick.label }}</span>
              <span class="tick-line"></span>
            </div>
          </div>
        </div>

        <div class="axis axis-x">
          <div class="axis-title">推进距离 (m)</div>
          <div class="axis-ticks">
            <div 
              v-for="tick in xAxisTicks" 
              :key="tick.value" 
              class="tick" 
              :style="{ left: tick.position + '%' }"
            >
              <span class="tick-line"></span>
              <span class="tick-label">{{ tick.label }}</span>
            </div>
          </div>
        </div>

        <!-- 缂傗晜鏂侀幒褍鍩?-->
        <div class="zoom-controls">
          <button class="zoom-btn" @click="zoomIn">+</button>
          <div class="zoom-level">{{ Math.round(scale * 100) }}%</div>
          <button class="zoom-btn" @click="zoomOut">-</button>
        </div>
        
        <!-- 閹嗗厴閹稿洨銇氶崳?-->
        <div v-if="showPerformanceMetrics" class="performance-indicator">
          <span>FPS: {{ fps }}</span>
          <span>渲染: {{ renderTime.toFixed(1) }}ms</span>
        </div>

        <!-- 閸椾礁鐡ч崙鍡樻Е -->
        <div v-if="crosshair.visible" class="crosshair" :style="crosshairStyle">
          <div class="crosshair-line crosshair-h"></div>
          <div class="crosshair-line crosshair-v"></div>
          <div class="crosshair-point"></div>
        </div>
        
        <!-- 閸ュ彞绶?-->
        <div class="region-legend">
          <div class="legend-item">
            <span class="legend-color workface"></span>
            <span class="legend-label">工作面</span>
          </div>
          <div class="legend-item">
            <span class="legend-color mining-area"></span>
            <span class="legend-label">采区</span>
          </div>
        </div>
      </div>

      <!-- 妤犮劍鐏︾仦蹇撳鏉炵晫濮搁幀?-->
      <div v-if="props.loading" class="skeleton-overlay">
        <div class="skeleton-container">
          <div class="skeleton-header">
            <div class="skeleton-badge"></div>
            <div class="skeleton-titles">
              <div class="skeleton-title"></div>
              <div class="skeleton-subtitle"></div>
            </div>
          </div>
          <div class="skeleton-chart">
            <div class="skeleton-grid">
              <div v-for="n in 8" :key="n" class="skeleton-row">
                <div v-for="m in 12" :key="m" class="skeleton-cell"></div>
              </div>
            </div>
          </div>
        </div>
        <p class="loading-text">{{ props.loadingText || '数据加载中...' }}</p>
        <div class="loading-progress-bar" v-if="props.loadingProgress > 0">
          <div class="progress-fill" :style="{ width: props.loadingProgress + '%' }"></div>
        </div>
      </div>

      <!-- 缁岃櫣濮搁幀?-->
      <div v-else-if="!hasData" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="8" y="8" width="48" height="48" rx="4"/>
            <path d="M16 48l12-12 8 8 12-16 8 8" stroke-linecap="round"/>
          </svg>
        </div>
        <h3 class="empty-title">{{ emptyText || '暂无数据' }}</h3>
        <p class="empty-desc">请导入数据或调整筛选条件</p>
        <button class="empty-action" @click="$emit('request-data')">导入数据</button>
      </div>
    </div>

    <!-- 鎼存洟鍎撮幒褍鍩楅弽?-->
    <div class="heatmap-footer">
      <!-- 妫版粏澹婇崶鍙ョ伐 -->
      <div class="legend-section">
        <div class="legend-header">
          <span class="legend-title">矿压强度 (MPa)</span>
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
        <div class="legend-bar-container">
          <div class="legend-gradient" :style="{ background: currentGradient }"></div>
          <div class="legend-labels">
            <div class="legend-point" v-for="(point, i) in legendPoints" :key="i" :style="{ left: point.position + '%' }">
              <span class="point-tick"></span>
              <span class="point-value">{{ point.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 缂佺喕顓告穱鈩冧紖 -->
      <div class="stats-section" v-if="stats">
        <div class="stat-group">
          <div class="stat-item">
            <span class="stat-label">均值</span>
            <span class="stat-value">{{ formatValue(stats.mean) }}</span>
            <span class="stat-unit">MPa</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">范围</span>
            <span class="stat-value">{{ formatValue(stats.min) }} ~ {{ formatValue(stats.max) }}</span>
          </div>
          <div class="stat-item highlight" v-if="stats.outliers">
            <span class="stat-label">寮傚父</span>
            <span class="stat-value">{{ stats.outliers }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 閹剚璇為幓鎰仛濡?-->
    <Transition name="tooltip-scale">
      <div
        v-if="hoveredCell && showTooltip"
        class="tooltip-ultra"
        :style="tooltipStyle"
      >
        <div class="tooltip-header" :style="{ background: getCellColor(hoveredCell.value) }">
          <div class="tooltip-badge">{{ hoveredCell.supportId }}</div>
          <div class="tooltip-title-group">
            <span class="tooltip-title">支架 #{{ hoveredCell.supportId }}</span>
            <span class="tooltip-subtitle">{{ formatDateFull(hoveredCell.date) }}</span>
          </div>
        </div>
        <div class="tooltip-body">
          <div class="metric-row primary">
            <span class="metric-label">末阻力</span>
            <span class="metric-value">
              {{ formatValue(hoveredCell.value) }}
              <span class="metric-unit">MPa</span>
            </span>
          </div>
          <div class="metric-row">
            <span class="metric-label">推进距离</span>
            <span class="metric-value">{{ hoveredCell.advanceDistance.toFixed(0) }} m</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">标准差</span>
            <span class="metric-value">±{{ formatValue(hoveredCell.std) }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 鐎电厧鍤€电鐦藉?-->
    <Transition name="dialog-fade">
      <div v-if="showExportDialog" class="export-dialog-overlay" @click.self="showExportDialog = false">
        <div class="export-dialog">
          <div class="dialog-header">
            <h3>导出热力图</h3>
            <button class="close-btn" @click="showExportDialog = false">×</button>
          </div>
          <div class="dialog-body">
            <div class="export-options">
              <div class="export-option-group">
                <label>格式</label>
                <div class="format-buttons">
                  <button 
                    v-for="fmt in exportFormats" 
                    :key="fmt.id"
                    :class="['format-btn', { active: exportFormat === fmt.id }]"
                    @click="exportFormat = fmt.id"
                  >
                    {{ fmt.label }}
                  </button>
                </div>
              </div>
              <div class="export-option-group">
                <label>分辨率</label>
                <div class="dpi-buttons">
                  <button 
                    v-for="dpi in dpiOptions" 
                    :key="dpi.value"
                    :class="['dpi-btn', { active: exportDpi === dpi.value }]"
                    @click="exportDpi = dpi.value"
                  >
                    {{ dpi.label }}
                  </button>
                </div>
              </div>
            </div>
            <button class="btn-primary" @click="executeExport" :disabled="isExporting">
              <span v-if="isExporting">导出中...</span>
              <span v-else>瀵煎嚭 {{ exportFormat.toUpperCase() }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { 
  COLORS, 
  WORKFACE_BOUNDS,
  createColorLookup 
} from '@/utils/pressureDataProcessor'

// ============================================================================
// Props
// ============================================================================

const props = defineProps({
  panelLabel: { type: String, default: 'A' },
  title: { type: String, default: '矿压强度热力图' },
  subtitle: String,
  matrix: { type: Array, default: () => [] },
  cells: { type: Array, default: () => [] },
  stats: { type: Object, default: null },
  numRows: { type: Number, default: 0 },  // 閺€顖涚仸閺?
  numCols: { type: Number, default: 0 },  // 閹恒劏绻樻径鈺傛殶
  loading: { type: Boolean, default: false },
  loadingProgress: { type: Number, default: 0 },
  loadingText: String,
  emptyText: String,
  showTooltip: { type: Boolean, default: true },
  showPerformanceMetrics: { type: Boolean, default: false }
})
const emit = defineEmits(['cell-select', 'cell-hover'])

// ============================================================================
// Refs & State
// ============================================================================

const containerRef = ref(null)
const canvasWrapperRef = ref(null)
const canvasContainerRef = ref(null)
const canvasRef = ref(null)

const currentViewMode = ref('heatmap')
const currentColorScheme = ref('diverging')
const hoveredCell = ref(null)
const showGrid = ref(false)

// 缂傗晜鏂侀崪灞介挬缁?
const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const isDragging = ref(false)

// 閸椾礁鐡ч崙鍡樻Е
const crosshair = ref({ visible: false, x: 0, y: 0 })

// DPR
const dpr = ref(window.devicePixelRatio || 1)

// 鐎电厧鍤?
const showExportDialog = ref(false)
const exportFormat = ref('png')
const exportDpi = ref(96)
const isExporting = ref(false)

const exportFormats = [
  { id: 'png', label: 'PNG' },
  { id: 'jpg', label: 'JPEG' },
  { id: 'webp', label: 'WebP' }
]

const dpiOptions = [
  { value: 96, label: '96 DPI (屏幕)' },
  { value: 150, label: '150 DPI' },
  { value: 300, label: '300 DPI (印刷)' }
]

// 閹嗗厴
const fps = ref(60)
const renderTime = ref(0)
let frameCount = 0
let lastFrameTime = 0

// 濞撳弶鐓嬮幒褍鍩?
let animationFrameId = null
let renderPending = false
let lastHoverTime = 0

// 妫版粏澹婇弻銉﹀鐞?
let colorLookupTable = null

// ============================================================================
// Constants
// ============================================================================

const viewModes = [
  { id: 'heatmap', label: '热力图', icon: 'H' },
  { id: 'contour', label: '等值线', icon: 'C' }
]

const colorSchemes = Object.entries(COLORS).map(([id, config]) => ({
  id,
  name: config.name,
  preview: `linear-gradient(to right, ${config.colors[0]}, ${config.colors[Math.floor(config.colors.length / 2)]}, ${config.colors[config.colors.length - 1]})`
}))

// 閸栧搫鐓欐０婊嗗
const REGION_COLORS = {
  mining_area: '#F5F5F5',   // 闁插洤灏懗灞炬珯閼?
  workface_border: '#666666' // 瀹搞儰缍旈棃銏ｇ珶濡?
}

// ============================================================================
// Computed
// ============================================================================

const internalWidth = computed(() => {
  const width = canvasContainerRef.value?.clientWidth || 800
  return Math.floor(width * dpr.value)
})

const internalHeight = computed(() => {
  const height = canvasContainerRef.value?.clientHeight || 500
  return Math.floor(height * dpr.value)
})

const canvasStyle = computed(() => ({
  width: '100%',
  height: '100%',
  imageRendering: 'crisp-edges'
}))

const hasData = computed(() => props.matrix?.length > 0 && props.matrix[0]?.length > 0)

const colorScaleMin = computed(() => {
  if (!hasData.value) return 0
  const values = props.matrix.flat().filter(Number.isFinite)
  return values.length > 0 ? Math.min(...values) : 0
})

const colorScaleMax = computed(() => {
  if (!hasData.value) return 60
  const values = props.matrix.flat().filter(Number.isFinite)
  return values.length > 0 ? Math.max(...values) : 60
})

const currentGradient = computed(() => {
  const scheme = COLORS[currentColorScheme.value] || COLORS.diverging
  return `linear-gradient(to right, ${scheme.colors.join(', ')})`
})

const legendPoints = computed(() => {
  const min = colorScaleMin.value
  const max = colorScaleMax.value
  return [0, 0.25, 0.5, 0.75, 1].map(t => ({
    value: (min + (max - min) * t).toFixed(1),
    position: t * 100
  }))
})

// Y鏉炴潙鍩㈡惔锔肩窗閺€顖涚仸缂傛牕褰块敍鍫濆冀鏉烆剨绱?閸︺劌绨抽柈顭掔礆
const yAxisTicks = computed(() => {
  if (!hasData.value) return []
  const ticks = []
  const count = props.numRows
  for (let i = 0; i <= 4; i++) {
    const supportNum = Math.round(1 + (count - 1) * (i / 4))
    ticks.push({
      value: supportNum,
      label: supportNum.toString(),
      position: (i / 4) * 100
    })
  }
  return ticks
})

// X鏉炴潙鍩㈡惔锔肩窗閹恒劏绻樼捄婵堫瀲
const xAxisTicks = computed(() => {
  if (!hasData.value) return []
  const ticks = []
  const maxDistance = props.numCols * WORKFACE_BOUNDS.advance.speed
  for (let i = 0; i <= 4; i++) {
    const distance = Math.round(maxDistance * (i / 4))
    ticks.push({
      value: distance,
      label: distance.toString(),
      position: (i / 4) * 100
    })
  }
  return ticks
})

const tooltipStyle = computed(() => {
  if (!hoveredCell.value || !containerRef.value) return {}
  const rect = containerRef.value.getBoundingClientRect()
  let left = crosshair.value.x + 15
  let top = crosshair.value.y + 15
  if (left + 200 > rect.width) left = crosshair.value.x - 215
  if (top + 150 > rect.height) top = crosshair.value.y - 165
  return { left: left + 'px', top: top + 'px' }
})

const crosshairStyle = computed(() => ({
  left: crosshair.value.x + 'px',
  top: crosshair.value.y + 'px'
}))

// ============================================================================
// Methods
// ============================================================================

function initColorLookup() {
  const scheme = COLORS[currentColorScheme.value] || COLORS.diverging
  colorLookupTable = createColorLookup(scheme.colors, 256)
}

function getCellColor(value) {
  if (!Number.isFinite(value)) return 'transparent'
  
  const min = colorScaleMin.value
  const max = colorScaleMax.value
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)))
  
  if (!colorLookupTable) initColorLookup()
  
  const idx = Math.floor(t * 255)
  const color = colorLookupTable[idx]
  const r = color & 0xFF
  const g = (color >> 8) & 0xFF
  const b = (color >> 16) & 0xFF
  
  return `rgb(${r},${g},${b})`
}

/**
 * 閺嶇绺惧〒鍙夌厠閿涙艾瀵橀崥顐紣娴ｆ粓娼版潏瑙勵攱閸滃本鏆熼幑顕嗙礉娑撯偓鐠ч缂夐弨鎯ч挬缁?
 */
function render() {
  if (renderPending) return
  renderPending = true
  
  const startTime = performance.now()
  
  animationFrameId = requestAnimationFrame(() => {
    renderPending = false
    drawHeatmap()
    
    renderTime.value = performance.now() - startTime
    frameCount++
    const now = performance.now()
    if (now - lastFrameTime >= 1000) {
      fps.value = frameCount
      frameCount = 0
      lastFrameTime = now
    }
  })
}

function drawHeatmap() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d', { alpha: true })
  const width = canvas.width
  const height = canvas.height
  
  const displayWidth = width / dpr.value
  const displayHeight = height / dpr.value

  // 濞撳懐鈹栭悽璇茬
  ctx.clearRect(0, 0, width, height)
  ctx.save()
  ctx.scale(dpr.value, dpr.value)

  // 鎼存梻鏁ょ紓鈺傛杹閸滃苯閽╃粔?
  ctx.translate(offsetX.value, offsetY.value)
  ctx.scale(scale.value, scale.value)

  // 鐠侊紕鐣婚弫鐗堝祦閸栧搫鐓欑亸鍝勵嚟
  const numSupports = props.numRows
  const numDays = props.numCols
  
  if (numSupports > 0 && numDays > 0) {
    // 鐠侊紕鐣婚崡鏇炲帗閺嶇厧銇囩亸?
    const cellWidth = displayWidth / numDays
    const cellHeight = displayHeight / numSupports
    
    // 閺佺増宓侀崠鍝勭厵閹鏄傜€?
    const dataWidth = numDays * cellWidth
    const dataHeight = numSupports * cellHeight
    
    // 缂佹ê鍩楀銉ょ稊闂堛垼绔熷鍡礄鐠虹喖娈㈢紓鈺傛杹楠炲磭些閿?
    ctx.strokeStyle = REGION_COLORS.workface_border
    ctx.lineWidth = 3 / scale.value
    ctx.strokeRect(0, 0, dataWidth, dataHeight)
    
    // 缂佹ê鍩楀銉ょ稊闂堛垺鐖ｇ粵?
    ctx.fillStyle = REGION_COLORS.workface_border
    ctx.font = `${12 / scale.value}px Arial`
    ctx.fillText('工作面边界', 5 / scale.value, -8 / scale.value)
    
    // 缂佹ê鍩楅悜顓炲閸ョ偓鏆熼幑?
    if (hasData.value) {
      drawHeatmapData(ctx, cellWidth, cellHeight, numSupports, numDays)
    }
  }

  ctx.restore()
}

function drawHeatmapData(ctx, cellWidth, cellHeight, numSupports, numDays) {
  // 閸欘亝瑕嗛弻鎾冲讲鐟欎礁灏崺?
  const visibleStartCol = Math.max(0, Math.floor(-offsetX.value / scale.value / cellWidth))
  const visibleEndCol = Math.min(numDays, Math.ceil((-offsetX.value + ctx.canvas.width / dpr.value) / scale.value / cellWidth))
  const visibleStartRow = Math.max(0, Math.floor(-offsetY.value / scale.value / cellHeight))
  const visibleEndRow = Math.min(numSupports, Math.ceil((-offsetY.value + ctx.canvas.height / dpr.value) / scale.value / cellHeight))

  // 閹靛綊鍣虹紒妯哄煑
  const batchSize = 500
  let batch = []
  
  for (let row = visibleStartRow; row < visibleEndRow; row++) {
    for (let col = visibleStartCol; col < visibleEndCol; col++) {
      const value = props.matrix[row]?.[col]
      if (!Number.isFinite(value)) continue
      
      // Y鏉炴潙寮芥潪顒婄窗row 0 閸︺劎鐓╅梼鐢搞€婇柈顭掔礉閻㈣绔锋稉濠冩暜閺?閸︺劌绨抽柈?
      const y = (numSupports - 1 - row) * cellHeight
      const x = col * cellWidth
      
      batch.push({
        x,
        y,
        w: cellWidth + 0.5,
        h: cellHeight + 0.5,
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

  // 缂冩垶鐗哥痪?
  if (showGrid.value) {
    drawGrid(ctx, numDays, numSupports, cellWidth, cellHeight)
  }
  
  // 妤傛ü瀵掗幃顒€浠犻崡鏇炲帗閺?
  if (hoveredCell.value) {
    drawHighlight(ctx, hoveredCell.value, numSupports, cellWidth, cellHeight)
  }
}

function drawBatch(ctx, batch) {
  const byColor = {}
  batch.forEach(item => {
    if (!byColor[item.color]) byColor[item.color] = []
    byColor[item.color].push(item)
  })

  Object.entries(byColor).forEach(([color, items]) => {
    ctx.fillStyle = color
    items.forEach(item => ctx.fillRect(item.x, item.y, item.w, item.h))
  })
}

function drawGrid(ctx, cols, rows, cellWidth, cellHeight) {
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'
  ctx.lineWidth = 0.5 / scale.value
  ctx.beginPath()
  
  // 缁鹃潧鎮滅純鎴炵壐閿涘牊鐦?0婢垛晪绱?
  for (let i = 0; i <= cols; i += 10) {
    const x = i * cellWidth
    ctx.moveTo(x, 0)
    ctx.lineTo(x, rows * cellHeight)
  }
  // 濡亜鎮滅純鎴炵壐閿涘牊鐦?0娑擃亝鏁弸璁圭礆
  for (let i = 0; i <= rows; i += 10) {
    const y = i * cellHeight
    ctx.moveTo(0, y)
    ctx.lineTo(cols * cellWidth, y)
  }
  ctx.stroke()
}

function drawHighlight(ctx, cell, numSupports, cellWidth, cellHeight) {
  // Y鏉炴潙寮芥潪?
  const y = (numSupports - 1 - cell.row) * cellHeight
  const x = cell.col * cellWidth
  
  ctx.shadowColor = 'rgba(0,0,0,0.3)'
  ctx.shadowBlur = 10 / scale.value
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'
  ctx.lineWidth = 2 / scale.value
  ctx.strokeRect(x, y, cellWidth, cellHeight)
  ctx.shadowColor = 'transparent'
}

// ============================================================================
// Event Handlers
// ============================================================================

function getCellAtEvent(event) {
  if (!hasData.value || !canvasRef.value) return null

  const rect = canvasRef.value.getBoundingClientRect()
  const x = (event.clientX - rect.left - offsetX.value) / scale.value
  const y = (event.clientY - rect.top - offsetY.value) / scale.value

  const numSupports = props.numRows
  const numDays = props.numCols
  
  const cellWidth = rect.width / numDays
  const cellHeight = rect.height / numSupports

  const col = Math.floor(x / cellWidth)
  // Y鏉炴潙寮芥潪?
  const row = numSupports - 1 - Math.floor(y / cellHeight)

  if (col >= 0 && col < numDays && row >= 0 && row < numSupports) {
    const cell = props.cells.find(c => c.row === row && c.col === col)
    return cell || null
  }
  return null
}

function onMouseMove(e) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  crosshair.value = { x, y, visible: true }
  
  if (isDragging.value) {
    offsetX.value += e.movementX
    offsetY.value += e.movementY
    render()
  }
  
  const now = performance.now()
  if (now - lastHoverTime > 16) {
    lastHoverTime = now
    const cell = getCellAtEvent(e)
    if (cell?.supportId !== hoveredCell.value?.supportId ||
        cell?.col !== hoveredCell.value?.col) {
      hoveredCell.value = cell
      emit('cell-hover', cell)
      render()
    }
  }
}

function onMouseLeave() {
  hoveredCell.value = null
  crosshair.value.visible = false
  isDragging.value = false
  emit('cell-hover', null)
  render()
}

function onClick(e) {
  const cell = getCellAtEvent(e)
  if (cell) emit('cell-select', cell)
}

function onDoubleClick() {
  resetView()
}

function onWheel(e) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  const newScale = Math.max(0.5, Math.min(10, scale.value * delta))
  if (newScale === scale.value) return
  
  const rect = canvasRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  const ratio = newScale / scale.value
  
  offsetX.value = mouseX - (mouseX - offsetX.value) * ratio
  offsetY.value = mouseY - (mouseY - offsetY.value) * ratio
  scale.value = newScale
  render()
}

function onMouseDown() {
  isDragging.value = true
}

// ============================================================================
// Controls
// ============================================================================

function setViewMode(mode) {
  currentViewMode.value = mode
  render()
}

function setColorScheme(scheme) {
  currentColorScheme.value = scheme
  initColorLookup()
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

async function executeExport() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  isExporting.value = true
  
  try {
    // 婵″倹鐏?DPI 娑撳秵妲?96閿涘矂娓剁憰浣稿灡瀵ゆ椽鐝崚鍡氶哺閻滃洨澧楅張?
    let exportCanvas = canvas
    if (exportDpi.value > 96) {
      exportCanvas = await createHighResCanvas(canvas, exportDpi.value / 96)
    }
    
    // 閺嶈宓侀弽鐓庣础鐎电厧鍤?
    const mimeType = getMimeType(exportFormat.value)
    const quality = exportFormat.value === 'jpg' ? 0.92 : undefined
    
    const dataUrl = exportCanvas.toDataURL(mimeType, quality)
    
    const link = document.createElement('a')
    link.download = `heatmap_${formatDate()}_${exportDpi.value}dpi.${exportFormat.value}`
    link.href = dataUrl
    link.click()
    
    showToast?.('热力图导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    showToast?.('导出失败，请重试')
  } finally {
    isExporting.value = false
    showExportDialog.value = false
  }
}

function createHighResCanvas(sourceCanvas, scale) {
  return new Promise((resolve) => {
    const newCanvas = document.createElement('canvas')
    newCanvas.width = sourceCanvas.width * scale
    newCanvas.height = sourceCanvas.height * scale
    
    const ctx = newCanvas.getContext('2d')
    ctx.scale(scale, scale)
    ctx.drawImage(sourceCanvas, 0, 0)
    
    resolve(newCanvas)
  })
}

function getMimeType(format) {
  const types = {
    png: 'image/png',
    jpg: 'image/jpeg',
    webp: 'image/webp'
  }
  return types[format] || 'image/png'
}

function formatDate() {
  const now = new Date()
  return `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`
}

// Toast 閹绘劗銇氶敍鍫滅矤閻栧墎绮嶆禒鑸垫暈閸忋儲鍨ㄩ悪顒傜彌娴ｈ法鏁ら敍?
let showToast = null
function setToastHandler(handler) {
  showToast = handler
}

// ============================================================================
// Utilities
// ============================================================================

function formatValue(val) {
  if (!Number.isFinite(val)) return '--'
  return val.toFixed(2)
}

function formatDateFull(date) {
  if (!date) return '--'
  return new Date(date).toLocaleDateString('zh-CN')
}

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
  initColorLookup()
  nextTick(() => {
    if (hasData.value) render()
  })
  
  window.addEventListener('resize', () => {
    dpr.value = window.devicePixelRatio || 1
    nextTick(() => {
      render()
    })
  })
})

watch(() => props.matrix, () => {
  initColorLookup()
  nextTick(() => {
    render()
  })
}, { deep: true })
</script>

<style scoped>
.pressure-heatmap-ultra {
  --header-height: 56px;
  --footer-height: 64px;
  --axis-size: 48px;
  
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.heatmap-header {
  height: var(--header-height);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(180deg, #fafafa, #ffffff);
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
  margin: 2px 0 0;
  font-size: 11px;
  color: #737373;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-modes {
  display: flex;
  gap: 2px;
  padding: 2px;
  background: #f5f5f5;
  border-radius: 8px;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #737373;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mode-btn.active {
  background: #ffffff;
  color: #1a1a1a;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}

.header-right {
  display: flex;
  gap: 6px;
}

.tool-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #525252;
  transition: all 0.15s ease;
}

.tool-btn:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.tool-btn.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #ffffff;
}

.tool-btn svg {
  width: 16px;
  height: 16px;
}

/* Canvas Wrapper */
.canvas-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #F5F5F5; /* 闁插洤灏懗灞炬珯閼?*/
}

.canvas-container {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: var(--axis-size) 1fr;
  grid-template-rows: 1fr var(--axis-size);
}

.mining-area-bg {
  grid-column: 2;
  grid-row: 1;
  background: #F5F5F5;
}

canvas {
  grid-column: 2;
  grid-row: 1;
  cursor: crosshair;
}

/* Axes */
.axis {
  position: relative;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

.axis-y {
  grid-column: 1;
  grid-row: 1;
  background: #fafafa;
  border-right: 1px solid #e5e5e5;
}

.axis-x {
  grid-column: 2;
  grid-row: 2;
  background: #fafafa;
  border-top: 1px solid #e5e5e5;
}

.axis-title {
  font-size: 10px;
  font-weight: 600;
  color: #737373;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.axis-y .axis-title {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: rotate(-90deg) translateX(-50%);
  transform-origin: left center;
  white-space: nowrap;
}

.axis-x .axis-title {
  position: absolute;
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
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #737373;
}

.axis-y .tick {
  right: 8px;
  transform: translateY(-50%);
}

.axis-y .tick-line {
  position: absolute;
  right: -8px;
  width: 4px;
  height: 1px;
  background: #d4d4d4;
}

.axis-x .tick {
  bottom: 8px;
  transform: translateX(-50%);
  flex-direction: column;
}

.axis-x .tick-line {
  width: 1px;
  height: 4px;
  background: #d4d4d4;
  margin-bottom: 4px;
}

/* Region Legend */
.region-legend {
  position: absolute;
  top: 12px;
  right: calc(var(--axis-size) + 16px);
  display: flex;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.95);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #525252;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid #ccc;
}

.legend-color.workface {
  background: #fff;
}

.legend-color.mining-area {
  background: #F5F5F5;
}

/* Zoom Controls */
.zoom-controls {
  position: absolute;
  right: 16px;
  bottom: calc(var(--axis-size) + 16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: rgba(255,255,255,0.95);
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  z-index: 10;
}

.zoom-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #525252;
}

.zoom-level {
  font-size: 10px;
  font-weight: 600;
  color: #737373;
  min-width: 40px;
  text-align: center;
}

/* Performance Indicator */
.performance-indicator {
  position: absolute;
  left: calc(var(--axis-size) + 16px);
  top: 48px;
  display: flex;
  gap: 12px;
  padding: 6px 10px;
  background: rgba(0,0,0,0.7);
  border-radius: 6px;
  font-size: 10px;
  font-family: monospace;
  color: #4ade80;
  z-index: 10;
}

/* Crosshair */
.crosshair {
  position: absolute;
  pointer-events: none;
  z-index: 5;
}

.crosshair-line {
  position: absolute;
  background: rgba(26,26,26,0.4);
}

.crosshair-h {
  left: -1000px;
  right: -1000px;
  top: 0;
  height: 1px;
}

.crosshair-v {
  top: -1000px;
  bottom: -1000px;
  left: 0;
  width: 1px;
}

.crosshair-point {
  position: absolute;
  left: -4px;
  top: -4px;
  width: 8px;
  height: 8px;
  border: 2px solid #1a1a1a;
  border-radius: 50%;
  background: #ffffff;
}

/* Loading & Empty */
.loading-overlay, .empty-state, .skeleton-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(255,255,255,0.98);
  z-index: 20;
}

.skeleton-overlay {
  padding: 16px;
  background: white;
}

.skeleton-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
}

.skeleton-badge {
  width: 28px;
  height: 28px;
  background: #e5e5e5;
  border-radius: 6px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-titles {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-title {
  width: 140px;
  height: 16px;
  background: #e5e5e5;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-subtitle {
  width: 200px;
  height: 12px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-chart {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.skeleton-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-width: 600px;
}

.skeleton-row {
  display: flex;
  gap: 4px;
  height: 24px;
}

.skeleton-cell {
  flex: 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 2px;
  animation: shimmer 1.5s infinite;
}

.loading-progress-bar {
  width: 200px;
  height: 4px;
  background: #e5e5e5;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1a1a1a;
  border-radius: 2px;
  transition: width 0.3s ease;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.loading-spinner {
  position: relative;
  width: 40px;
  height: 40px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border: 3px solid transparent;
  border-top-color: #1a1a1a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.3s;
  border-top-color: #a3a3a3;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #d4d4d4;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #525252;
}

.empty-desc {
  margin: 0;
  font-size: 13px;
  color: #737373;
}

.empty-action {
  margin-top: 8px;
  padding: 10px 20px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.empty-action:hover {
  background: #333;
  transform: translateY(-1px);
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
  flex-direction: column;
  gap: 8px;
}

.legend-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-title {
  font-size: 11px;
  font-weight: 600;
  color: #525252;
}

.color-schemes {
  display: flex;
  gap: 4px;
}

.scheme-btn {
  width: 20px;
  height: 14px;
  padding: 2px;
  border: 1px solid #d4d4d4;
  background: #ffffff;
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

.legend-bar-container {
  position: relative;
  width: 200px;
}

.legend-gradient {
  height: 10px;
  border-radius: 5px;
}

.legend-labels {
  position: relative;
  height: 16px;
  margin-top: 4px;
}

.legend-point {
  position: absolute;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.point-tick {
  width: 1px;
  height: 4px;
  background: #a3a3a3;
}

.point-value {
  font-size: 9px;
  color: #737373;
}

/* Stats */
.stats-section {
  display: flex;
  align-items: center;
}

.stat-group {
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

.stat-item.highlight .stat-value {
  color: #dc2626;
}

/* Tooltip */
.tooltip-ultra {
  position: absolute;
  z-index: 100;
  min-width: 180px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  overflow: hidden;
}

.tooltip-scale-enter-active,
.tooltip-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.tooltip-scale-enter-from,
.tooltip-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-8px);
}

.tooltip-header {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tooltip-badge {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  background: rgba(255,255,255,0.3);
}

.tooltip-title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tooltip-title {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
}

.tooltip-subtitle {
  font-size: 10px;
  color: rgba(255,255,255,0.8);
}

.tooltip-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-row.primary {
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
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

.metric-unit {
  font-size: 10px;
  color: #a3a3a3;
}

/* Dialog */
.export-dialog-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
}

.export-dialog {
  width: 300px;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.close-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  border: none;
  background: #1a1a1a;
  border-radius: 8px;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:disabled {
  background: #a3a3a3;
  cursor: not-allowed;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.export-option-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.export-option-group label {
  font-size: 12px;
  font-weight: 600;
  color: #525252;
}

.format-buttons,
.dpi-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.format-btn,
.dpi-btn {
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.format-btn:hover,
.dpi-btn:hover {
  border-color: #1a1a1a;
}

.format-btn.active,
.dpi-btn.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: white;
}
</style>
