/**
 * Enhanced Canvas Component
 *
 * A reusable canvas component with:
 * - High DPI (Retina) support
 * - Responsive sizing
 * - Mouse event handling
 * - Performance optimization
 * - Export functionality
 */

import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  // Display
  width: { type: [Number, String], default: '100%' },
  height: { type: [Number, String], default: 600 },
  title: String,

  // Data
  data: Array, // Flat array for heatmap
  grid: Array, // 2D grid for contour
  points: Array, // Points for scatter
  boreholes: Array, // Borehole data
  bounds: Object, // { minX, maxX, minY, maxY }

  // Options
  colorScale: { type: String, default: 'viridis' },
  showAxes: { type: Boolean, default: true },
  showTooltip: { type: Boolean, default: true },
  interactive: { type: Boolean, default: true },
  exportable: { type: Boolean, default: false },

  // Events
  onClick: Function,
  onHover: Function,
  onReady: Function,
})

const emit = defineEmits(['click', 'hover', 'ready', 'export'])

// Refs
const canvasRef = ref(null)
const containerRef = ref(null)
const ctx = ref(null)

// State
const isReady = ref(false)
const isLoading = ref(false)
const hoverData = ref(null)
const mousePos = ref({ x: 0, y: 0 })
const canvasSize = ref({ width: 0, height: 0 })
const dpr = ref(window.devicePixelRatio || 1)

// Color scales
const colorScales = {
  viridis: [
    [15, 23, 42],  // Blue to Yellow
    [15, 50, 96],  // Blue to Red
    [15, 100, 137], // Yellow to Red
    [33, 13, 107], // Green to Yellow
  [15, 113, 39],  // Green to Purple
    [153, 50, 34],  // Purple to Blue
    [175, 141, 31],  // Yellow to Green
    [15, 123, 209],  // Yellow to Purple
  ],
  jet: [
    [15, 23, 42],  // Blue
    [15, 50, 96],  // Blue to Yellow
    [15, 100, 137],  // Yellow to Red
    [15, 123, 209],  // Yellow to Purple
    [15, 153, 50],  // Purple to Blue
    [15, 113, 39],  // Purple to Yellow
  ],
  rsi: [
    [166, 54, 3],    // Blue
    [116, 28, 1],    // Blue-Green
    [51, 153, 0],    // Yellow
    [0, 102, 204],   // Red
  ],
  bri: [
    [244, 89, 34],   // Red
    [253, 174, 44],  // Orange
    [254, 229, 34],  // Yellow
    [234, 51, 13],   // Green
    ],
  asi: [
    [16, 168, 30],   // Teal
    [153, 50, 34],   // Orange
    [189, 217, 27],  // Yellow-Green
    [202, 235, 51],   // Green
    ],
}

// Helper functions
const getColorForValue = (value, scale) => {
  const colors = colorScales[scale] || colorScales.viridis
  if (value == null || isNaN(value)) return null
  const clamped = Math.max(0, Math.min(1, value))
  const index = Math.min(Math.floor(clamped * (colors.length - 1)), colors.length - 2)
  return colors[index]
}

const formatValue = (val) => {
  const num = parseFloat(val)
  return Number.isFinite(num) ? num.toFixed(2) : '-'
}

const getCanvasSize = () => {
  if (!containerRef.value) return { width: 0, height: 0 }

  const rect = containerRef.value.getBoundingClientRect()
  const dprValue = window.devicePixelRatio || 1

  return {
    width: rect.width * dprValue,
    height: rect.height * dprValue,
    dpr: dprValue
  }
}

// Drawing functions
const clear = () => {
  if (!ctx.value) return

  ctx.value.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height)
}

const drawHeatmap = () => {
  if (!ctx.value || !props.data || !props.data.length) return

  const { width, height } = canvasSize.value
  const { bounds } = props
  const { minX, maxX, minY, maxY } = bounds || { minX: 0, maxX: 100, minY: 0, maxY: 100 }

  const cellWidth = width / props.data[0].length
  const cellHeight = height / props.data.length

  // Draw cells
  props.data.forEach((row, y) => {
    row.forEach((value, x) => {
      const color = getColorForValue(value, props.colorScale)

      ctx.value.fillStyle = color
      ctx.value.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1)

      // Add border for cell separation
      ctx.value.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.value.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight - 1)
    })
  })
}

const drawPoints = () => {
  if (!ctx.value || !props.points || !props.points.length) return

  const { width, height } = canvasSize.value
  const { bounds } = props

  if (bounds) {
    const padding = 20
    const scaleX = (width - padding * 2) / (bounds.maxX - bounds.minX || 1)
    const scaleY = (height - padding * 2) / (bounds.maxY - bounds.minY || 1)

    props.points.forEach((point, i) => {
      const x = padding + (point.x - (bounds.minX || 0)) * scaleX
      const y = height - padding - (point.y - (bounds.minY || 0)) * scaleY
      const size = 4

      ctx.value.beginPath()
      ctx.value.arc(x, y, size, 0, Math.PI * 2)
      ctx.value.fillStyle = '#0f766e'
      ctx.value.fill()
      ctx.value.strokeStyle = 'rgba(255,255,255,0.8)'
      ctx.value.lineWidth = 2
      ctx.value.stroke()
    })
  }
}

const drawBoreholes = () => {
  if (!ctx.value || !props.boreholes || !props.boreholes.length) return

  const { width, height } = canvasSize.value
  const { bounds } = props

  if (bounds) {
    const padding = 20
    const radius = 6
    const scaleX = (width - padding * 2) / (bounds.maxX - bounds.minX || 1)
    const scaleY = (height - padding * 2) / (bounds.maxY - bounds.minY || 1)

    props.boreholes.forEach((bh, i) => {
      const x = padding + (bh.x - (bounds.minX || 0)) * scaleX
      const y = height - padding - (bh.y - (bounds.minY || 0)) * scaleY

      // Draw circle
      ctx.value.beginPath()
      ctx.value.arc(x, y, radius, 0, Math.PI * 2)
      ctx.value.fillStyle = 'rgba(15, 23, 42, 0.8)'
      ctx.value.fill()

      // Draw label
      ctx.value.fillStyle = '#334155'
      ctx.value.font = '11px sans-serif'
      ctx.value.textAlign = 'center'
      ctx.value.text(bh.name || `BH${i + 1}`, x, y + radius + 10)
    })
  }
}

const drawAxes = () => {
  if (!ctx.value || !props.showAxes || !props.bounds) return

  const { width, height } = canvasSize.value
  const { bounds } = props
  const padding = 40

  // Calculate scale
  const scaleX = (width - padding * 2) / (bounds.maxX - bounds.minX || 100)
  const scaleY = (height - padding * 2) / (bounds.maxY - bounds.minY || 100)

  ctx.value.strokeStyle = '#94a3b8'
  ctx.value.lineWidth = 1
  ctx.value.font = '10px sans-serif'
  ctx.value.fillStyle = '#64748b'

  // X axis
  ctx.value.beginPath()
  ctx.value.moveTo(padding, padding)
  ctx.value.lineTo(width - padding, padding)
  ctx.value.stroke()

  // Y axis
  ctx.value.beginPath()
  ctx.value.moveTo(padding, padding)
  ctx.value.lineTo(padding, height - padding)
  ctx.value.stroke()

  // Labels
  ctx.value.fillStyle = '#64748b'
  ctx.value.textAlign = 'center'

  // X labels
  const xStep = (width - padding * 2) / 5
  for (let i = 0; i <= 5; i++) {
    const x = padding + i * xStep
    const val = Math.round(bounds.minX + (bounds.maxX - bounds.minX) * (i / 5))
    ctx.value.fillText(val, x, height - padding + 15)
  }

  // Y labels
  const yStep = (height - padding * 2) / 5
  for (let i = 0; i <= 5; i++) {
    const y = height - padding - i * yStep
    const val = Math.round(bounds.minY + (bounds.maxY - bounds.minY) * (i / 5))
    ctx.value.save()
    ctx.value.translate(val - 10, y + 5)
    ctx.value.rotate(-Math.PI / 4)
    ctx.value.fillText(val, 0, 0)
    ctx.value.restore()
  }
}

const drawTooltip = (data) => {
  if (!data) return

  // Would be implemented with overlay DOM element
  console.log('Tooltip data:', data)
}

const render = () => {
  updateCanvasSize()
  clear()

  // Set canvas size for high DPI
  canvasRef.value.width = canvasSize.value.width
  canvasRef.value.height = canvasSize.value.height

  if (props.grid) {
    drawHeatmap()
  } else if (props.points) {
    drawPoints()
  } else if (props.boreholes) {
    drawBoreholes()
  }

  if (props.showAxes) {
    drawAxes()
  }
}

const updateCanvasSize = () => {
  canvasSize.value = getCanvasSize()
}

const handleMouseMove = (event) => {
  if (!props.interactive || !ctx.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  mousePos.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }

  // Calculate grid position
  if (props.data && props.data.length > 0) {
    const { bounds } = props
    const cellWidth = canvasSize.value.width / props.data[0].length
    const cellHeight = canvasSize.value.height / props.data.length

    const col = Math.floor((mousePos.value.x - 40) / cellWidth)
    const row = Math.floor(mousePos.value.y - 40) / cellHeight)

    if (col >= 0 && col < props.data[0].length && row >= 0 && row < props.data.length) {
      const value = props.data[row][col]
      if (value != null && !isNaN(value)) {
        hoverData.value = { x: mousePos.value.x, y: mousePos.value.y, value, row, col }
      }
    }
  }

  if (props.onHover) {
    props.onHover(hoverData.value)
  }
}

const handleMouseLeave = () => {
  hoverData.value = null
  if (props.onHover) {
    props.onHover(null)
  }
}

const handleClick = (event) => {
  if (!props.interactive || !ctx.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // Check if clicking on a data point
  if (hoverData.value) {
    emit('click', {
      x, y,
      data: hoverData.value,
      canvasSize: canvasSize.value,
    })
  }
}

const handleDoubleClick = () => {
  // Reset view on double click
  emit('ready', { reset: true })
}

const exportAsImage = () => {
  if (!canvasRef.value || !props.exportable) return

  const link = document.createElement('a')
  link.download = `${props.title || 'canvas'}.png`
  link.href = canvasRef.value.toDataURL('image/png')
  link.click()
}

// Lifecycle
onMounted(() => {
  canvasRef.value = containerRef.value?.querySelector('canvas')

  if (!canvasRef.value) {
    console.error('Canvas element not found')
    return
  }

  ctx.value = canvasRef.value.getContext('2d')

  // Handle high DPI displays
  const dprValue = window.devicePixelRatio || 1
  dpr.value = dprValue

  if (dprValue !== 1) {
    canvasRef.value.width = canvasSize.value.width * dprValue
    canvasRef.value.height = canvasSize.value.height * dprValue
    ctx.value.scale(dprValue, dprValue)
  }

  updateCanvasSize()

  // Add event listeners
  if (props.interactive) {
    canvasRef.value.addEventListener('mousemove', handleMouseMove)
    canvasRef.value.addEventListener('mouseleave', handleMouseLeave)
    canvasRef.value.addEventListener('click', handleClick)
    canvasRef.value.addEventListener('dblclick', handleDoubleClick)
  }

  window.addEventListener('resize', updateCanvasSize)

  // Initial render
  requestAnimationFrame(() => {
    render()
    isReady.value = true
    emit('ready')
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCanvasSize)

  if (canvasRef.value && props.interactive) {
    canvasRef.value.removeEventListener('mousemove', handleMouseMove)
    canvasRef.value.removeEventListener('mouseleave', handleMouseLeave)
    canvasRef.value.removeEventListener('click', handleClick)
    canvasRef.value.removeEventListener('dblclick', handleDoubleClick)
  }
})

// Watch for data changes
watch(() => props.data, () => {
  if (isReady.value) {
    requestAnimationFrame(render)
  }
}, { deep: true })

watch(() => props.points, () => {
  if (isReady.value) {
    requestAnimationFrame(render)
  }
}, { deep: true })

watch(() => props.boreholes, () => {
  if (isReady.value) {
    requestAnimationFrame(render)
  }
}, { deep: true })

watch(() => props.grid, () => {
  if (isReady.value) {
    requestAnimationFrame(render)
  }
}, { deep: true })
</script>

<style scoped>
.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

canvas:disabled {
  cursor: not-allowed;
}
</style>
