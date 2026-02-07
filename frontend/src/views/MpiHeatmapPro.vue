<template>
  <div class="mpi-pro-page">
    <!-- Top Navigation Bar (Compact) -->
    <nav class="top-nav">
      <div class="nav-left">
        <button class="back-btn-mini" @click="$router.back()" title="返回">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="nav-title">MPI 数值模拟</span>
        <div class="nav-separator"></div>
        <select v-model="seam" @change="handleSeamChange" class="nav-select">
          <option v-for="s in seams" :key="s.name" :value="s.name">{{ s.name }}</option>
        </select>
        <div class="mini-stats" v-if="hasData">
          <span class="mini-stat">均值: <b>{{ stats.mean?.toFixed(1) }}</b></span>
          <span class="mini-stat danger">风险: <b>{{ stats.min?.toFixed(1) }}</b></span>
        </div>
      </div>

      <div class="nav-center">
        <button class="nav-tool" @click="toggleControls" :class="{ active: controlsVisible }" title="控制面板">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m4.24-13.24l-4.24 4.24m0 5.66l4.24 4.24M1 12h6m6 0h6m13.24 4.24l-4.24-4.24m-5.66 0l-4.24-4.24"/>
          </svg>
        </button>
      </div>

      <div class="nav-right">
        <button class="nav-btn" @click="triggerWorkfaceUpload" title="导入工作面">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
        </button>
        <button class="nav-btn" @click="fitToScreen" title="适配视图">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </button>
        <button class="nav-btn" @click="zoomIn" title="放大">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
          </svg>
        </button>
        <button class="nav-btn" @click="zoomOut" title="缩小">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M8 11h6"/>
          </svg>
        </button>
      </div>
      <input ref="fileInput" type="file" style="display:none" @change="handleFileUpload" accept=".csv,.json,.txt">
    </nav>

    <!-- Collapsible Control Panel -->
    <transition name="panel-slide">
      <div v-if="controlsVisible" class="control-panel-overlay">
        <div class="control-panel">
          <div class="control-section">
            <h4>视图设置</h4>
            <div class="control-grid">
              <div class="control-item">
                <label>网格精度 (越小越精细)</label>
                <div class="range-wrapper">
                  <input type="range" v-model.number="resolution" min="20" max="100" step="5" @change="recomputeGlobal" class="range-input">
                  <span class="range-value">{{ resolution }}m</span>
                </div>
              </div>
            </div>
          </div>

          <div class="control-section">
            <h4>图层</h4>
            <div class="layer-toggles">
              <label class="layer-toggle">
                <input type="checkbox" v-model="layers.workfaces">
                <span>工作面</span>
              </label>
              <label class="layer-toggle">
                <input type="checkbox" v-model="layers.contours">
                <span>等值线</span>
              </label>
              <label class="layer-toggle">
                <input type="checkbox" v-model="layers.grid">
                <span>网格</span>
              </label>
              <label class="layer-toggle">
                <input type="checkbox" v-model="layers.boreholes">
                <span>钻孔</span>
              </label>
              <label class="layer-toggle">
                <input type="checkbox" v-model="layers.gradedBands">
                <span>分级带</span>
              </label>
            </div>
          </div>

          <div class="control-section">
            <h4>推进方向</h4>
            <DirectionControl
              v-model:direction="miningDirection"
              @update:direction="simulation.setDirection"
            />
          </div>

          <div class="control-section">
            <h4>图例</h4>
            <div class="mini-legend">
              <div class="legend-gradient"></div>
              <div class="legend-labels">
                <span>低风险</span>
                <span>高风险</span>
              </div>
            </div>
          </div>

          <button class="panel-close" @click="toggleControls">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Main Canvas Container -->
    <div ref="stageContainer" class="stage-container">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <div class="loading-text">全域数据计算中...</div>
      </div>

      <canvas ref="bgCanvas" class="layer-canvas layer-bg"></canvas>
      <canvas ref="dynamicCanvas" class="layer-canvas layer-dynamic"></canvas>
      <canvas ref="overlayCanvas" class="layer-canvas layer-overlay"></canvas>
    </div>

    <!-- Bottom Compact Playback Bar -->
    <div class="playback-bar">
      <div class="playback-main">
        <button class="play-btn-mini" @click="simulation.togglePlay" :class="{ playing: simulation.isPlaying.value }" title="播放/暂停">
          <svg v-if="!simulation.isPlaying.value" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>

        <div class="progress-section">
          <input
            type="range"
            :value="simulation.progress.value"
            @input="simulation.seek(Number($event.target.value))"
            min="0"
            max="100"
            step="0.1"
            class="progress-slider"
          >
          <div class="progress-info">
            <span>{{ Math.round(simulation.progress.value) }}%</span>
            <span>{{ ((simulation.progress.value / 100) * 500).toFixed(0) }}m</span>
          </div>
        </div>

        <div class="speed-control">
          <button
            v-for="speed in [0.5, 1, 2, 5]"
            :key="speed"
            :class="['speed-btn', { active: simulation.playbackSpeed.value === speed }]"
            @click="simulation.setPlaybackSpeed(speed)"
          >{{ speed }}x</button>
        </div>

        <button class="step-btn" @click="simulation.stepBackward" title="后退">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5-6V12z"/></svg>
        </button>
        <button class="step-btn" @click="simulation.stepForward" title="前进">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>

      <!-- Mini Dashboard -->
      <div class="mini-dashboard" v-if="activeWorkface">
        <div class="dash-item">
          <span class="dash-label">应力</span>
          <span class="dash-value stress">{{ stressLevel.toFixed(0) }}%</span>
        </div>
        <div class="dash-item">
          <span class="dash-label">卸压</span>
          <span class="dash-value relief">{{ reliefLevel.toFixed(0) }}%</span>
        </div>
        <div class="dash-item">
          <span class="dash-label">阶段</span>
          <span class="dash-value phase">{{ phaseLabels[currentPhase] }}</span>
        </div>
        <div class="dash-item">
          <span class="dash-label">方向</span>
          <span class="dash-value">{{ miningDirection }}°</span>
        </div>
      </div>
    </div>

    <!-- Floating Hint -->
    <div class="floating-hint">
      拖拽移动 · 滚轮缩放 · 空格播放 · R 重置
    </div>

    <!-- Tooltip -->
    <div v-if="hoverInfo" class="hover-tooltip" :style="hoverStyle">
      <div class="tooltip-val">{{ hoverInfo.value.toFixed(2) }}</div>
      <div class="tooltip-xy">X: {{ hoverInfo.x.toFixed(0) }} Y: {{ hoverInfo.y.toFixed(0) }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, onUnmounted, shallowRef, markRaw } from 'vue'
import { useToast } from '../composables/useToast'
import { useMiningSimulation } from '../composables/useMiningSimulation'
import { useParticles, useRipples } from '../composables/useParticles'
import DirectionControl from '../components/simulation/DirectionControl.vue'
import * as d3 from 'd3'
import {
  getCoalSeams,
  getSeamOverburden,
  getRockParams,
  mpiInterpolate,
  parseMpiWorkfaces
} from '../api'

// --- State ---
const loading = ref(false)
const seams = ref([])
const seam = ref('')
const resolution = ref(50)
const stats = ref({})
const activeWorkface = ref(null)
const workfaces = ref([])
const seamBoreholes = shallowRef([]) // Store borehole data for display

// UI State
const controlsVisible = ref(false)

// Mining Simulation State
const miningDirection = ref(0)  // Direction angle in degrees
const miningSpeed = ref(1)       // Playback speed multiplier

// Initialize simulation composable (reactive to activeWorkface)
const simulation = useMiningSimulation(activeWorkface, {
  totalDistance: 500,
  frameRate: 60,
  progressPerSecond: 10
})

// Initialize particle systems for visual effects
// Reduced particle counts for better performance while maintaining visual quality
const stressParticles = useParticles({ maxParticles: 80, emitRate: 1.5 })
const reliefParticles = useParticles({ maxParticles: 60, emitRate: 1 })
const ripples = useRipples({ maxRipples: 6, rippleSpeed: 60, rippleInterval: 600 })

// Track last emission time for particle generation
const lastParticleEmit = ref(0)
const particleEmitInterval = 50 // ms between emissions

const layers = reactive({
  workfaces: true,
  contours: false,
  contourLabels: false,
  boreholes: true,
  grid: true,
  gradedBands: true
})

// Canvas Refs
const stageContainer = ref(null)
const bgCanvas = ref(null)
const dynamicCanvas = ref(null)
const overlayCanvas = ref(null)
const fileInput = ref(null)

// Offscreen canvas for caching static content (rendering-hydration-no-flicker pattern)
const bgCacheCanvas = ref(null)
const bgCacheValid = ref(false)

// Data State - use shallowRef for large arrays to reduce reactivity overhead
const globalGrid = shallowRef(null)
const gridBounds = ref(null)
const hoverInfo = ref(null)
const hoverPos = ref({ x: 0, y: 0 })

const toast = useToast()

// Cache
const layerParamsCache = new Map()
// Color cache to avoid repeated color calculations (js-cache-function-results pattern)
const colorCache = new Map()
const getColorCacheKey = (val, min, max) => {
  // Handle null/undefined values safely
  const safeVal = Number.isFinite(val) ? val.toFixed(2) : 'null'
  const safeMin = Number.isFinite(min) ? min.toFixed(2) : 'null'
  const safeMax = Number.isFinite(max) ? max.toFixed(2) : 'null'
  return `${safeVal}-${safeMin}-${safeMax}`
}
// Enhanced color palette for better visual quality - smoother gradient
const odiPalette = ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444', '#7c2d12']

// --- Viewport State (Pan/Zoom) ---
const viewport = reactive({
  x: 0,
  y: 0,
  scale: 1,
  isDragging: false,
  lastX: 0,
  lastY: 0
})

// --- Computed ---
const hasData = computed(() => !!globalGrid.value)
const hoverStyle = computed(() => ({
  left: `${hoverPos.value.x + 15}px`,
  top: `${hoverPos.value.y + 15}px`
}))

const gradeColors = ['#4e79a7', '#9bb7c7', '#f6f0a4', '#f4a261', '#d62828']

const gradeThresholds = computed(() => {
  if (!stats.value || !Number.isFinite(stats.value.min) || !Number.isFinite(stats.value.max)) return []
  const minV = stats.value.min
  const maxV = stats.value.max
  if (minV === maxV) return [minV]
  const step = (maxV - minV) / 5
  return [minV + step, minV + step * 2, minV + step * 3, minV + step * 4]
})

const gradeRanges = computed(() => {
  if (gradeThresholds.value.length < 4) return []
  const [t1, t2, t3, t4] = gradeThresholds.value
  const fmt = (v) => v?.toFixed(2)
  return [
    { label: 'I 级', range: `<= ${fmt(t1)}` },
    { label: 'II 级', range: `${fmt(t1)} ~ ${fmt(t2)}` },
    { label: 'III 级', range: `${fmt(t2)} ~ ${fmt(t3)}` },
    { label: 'IV 级', range: `${fmt(t3)} ~ ${fmt(t4)}` },
    { label: 'V 级', range: `>= ${fmt(t4)}` }
  ]
})

// --- UI Methods ---
const toggleControls = () => {
  controlsVisible.value = !controlsVisible.value
}

const handleSeamChange = () => {
  // Reset and recompute when seam changes
  globalGrid.value = null
  seamBoreholes.value = []
  gridBounds.value = null
  stats.value = {}
  // Clear color cache when data changes
  colorCache.clear()
  simulation.seek(0)
  if (seam.value) {
    computeGlobal()
  }
}

const recomputeGlobal = () => {
  // Recompute grid with new resolution
  if (seam.value) {
    computeGlobal()
  }
}

// --- Mini Dashboard Computed ---
const currentPhase = computed(() => {
  const p = simulation.progress.value
  if (p < 15) return 0
  if (p < 30) return 1
  if (p < 70) return 2
  if (p < 90) return 3
  return 4
})

const phaseLabels = ['初采', '初压', '推进', '周压', '收尾']

const stressLevel = computed(() => {
  const p = simulation.progress.value
  const baseStress = 40 + p * 0.3
  const periodicStress = 20 * Math.sin((p / 100) * Math.PI * 4)
  return Math.min(100, Math.max(0, baseStress + periodicStress))
})

const reliefLevel = computed(() => {
  const p = simulation.progress.value
  return Math.min(95, p * 0.8 + 10)
})

// --- Methods: Data Loading ---
const loadSeams = async () => {
  try {
    const { data } = await getCoalSeams()
    seams.value = data.seams || []
    if (seams.value.length) {
      seam.value = seams.value[0].name
      await computeGlobal()
    }
    // Create demo workface if none exists
    if (workfaces.value.length === 0 && gridBounds.value) {
      createDemoWorkface()
    }
  } catch (e) {
    console.error(e)
    toast.add('加载煤层失败', 'error')
  }
}

// Create a demo workface from grid bounds
const createDemoWorkface = () => {
  if (!gridBounds.value) return

  const { min_x, max_x, min_y, max_y } = gridBounds.value
  const width = max_x - min_x
  const height = max_y - min_y

  // Create a workface in the center-left of the grid
  const demoWorkface = {
    id: 'demo-workface',
    name: '演示工作面',
    type: 'polygon',
    bounds: {
      min_x: min_x + width * 0.1,
      max_x: min_x + width * 0.35,
      min_y: min_y + height * 0.3,
      max_y: min_y + height * 0.7
    },
    // Generate polygon points from bounds
    points: [
      [min_x + width * 0.1, min_y + height * 0.3],  // bottom-left
      [min_x + width * 0.35, min_y + height * 0.3], // bottom-right
      [min_x + width * 0.35, min_y + height * 0.7], // top-right
      [min_x + width * 0.1, min_y + height * 0.7]   // top-left
    ]
  }

  workfaces.value.push(demoWorkface)
  activeWorkface.value = demoWorkface
  toast.add('已创建演示工作面', 'success')
}

const getLayerParams = async (name) => {
  if (!name) return null
  if (layerParamsCache.has(name)) return layerParamsCache.get(name)
  try {
    const { data } = await getRockParams(name)
    layerParamsCache.set(name, data)
    return data
  } catch (err) {
    return null
  }
}

const buildPoints = async (boreholes) => {
  const points = []
  for (const b of boreholes) {
    const layers = b.layers || []
    const seamLayer = layers.find(l => l.name === seam.value)
    const strataLayers = layers.filter(l => l.name !== seam.value)
    const strata = []
    
    // Simplification: only get params for key layers to speed up, 
    // but here we do all for accuracy as per requirement
    for (const l of strataLayers) {
      const p = await getLayerParams(l.name)
      strata.push({
        thickness: l.thickness || 0,
        name: l.name,
        density: p?.density,
        elastic_modulus: p?.elastic_modulus,
        compressive_strength: p?.compressive_strength,
        tensile_strength: p?.tensile_strength
      })
    }
    
    const depth = b.seam_top_depth ?? b.total_overburden_thickness ?? 0
    points.push({
      x: b.x,
      y: b.y,
      borehole: b.name,
      thickness: seamLayer?.thickness || 0,
      burial_depth: depth,
      strata
    })
  }
  return points
}

const computeGlobal = async () => {
  if (!seam.value) return
  loading.value = true
  try {
    // 1. Get Boreholes
    const { data } = await getSeamOverburden(seam.value)
    if (!data.boreholes?.length) throw new Error('无钻孔数据')

    // Store boreholes for display
    seamBoreholes.value = data.boreholes

    // 2. Build Points
    const points = await buildPoints(data.boreholes)

    // 3. Interpolate Global Grid (No bounds = auto bounds)
    const res = await mpiInterpolate(points, resolution.value, 'idw', null, null)

    globalGrid.value = res.data.grid
    gridBounds.value = res.data.bounds
    stats.value = res.data.statistics

    // 4. Center View
    fitToScreen()

    // 5. Render
    requestAnimationFrame(renderAll)

  } catch (e) {
    console.error(e)
    toast.add(e.message || '计算失败', 'error')
  } finally {
    loading.value = false
  }
}


// --- Methods: Canvas Rendering ---
const getColor = (val, min, max) => {
  if (!Number.isFinite(val)) return [0,0,0,0]
  const range = max - min || 1
  const t = Math.max(0, Math.min(1, (val - min) / range))
  
  // Simple gradient interpolation
  const idx = t * (odiPalette.length - 1)
  const i = Math.floor(idx)
  const f = idx - i
  
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16)
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
  }
  
  const c1 = hexToRgb(odiPalette[Math.min(i, odiPalette.length - 1)])
  const c2 = hexToRgb(odiPalette[Math.min(i + 1, odiPalette.length - 1)])
  
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * f),
    Math.round(c1[1] + (c2[1] - c1[1]) * f),
    Math.round(c1[2] + (c2[2] - c1[2]) * f),
    255
  ]
}

const getDiscreteColor = (val, thresholds, colors) => {
  if (!Number.isFinite(val) || thresholds.length < 4) return [0,0,0,0]
  let idx = 0
  if (val <= thresholds[0]) idx = 0
  else if (val <= thresholds[1]) idx = 1
  else if (val <= thresholds[2]) idx = 2
  else if (val <= thresholds[3]) idx = 3
  else idx = 4

  const hex = colors[Math.min(idx, colors.length - 1)]
  const bigint = parseInt(hex.slice(1), 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255]
}

const renderAll = () => {
  if (!globalGrid.value) return
  resizeCanvas(bgCanvas.value)
  resizeCanvas(dynamicCanvas.value)
  resizeCanvas(overlayCanvas.value)
  
  drawBackground()
  drawOverlay()
  // Re-draw simulation if active or at any progress
  if (simulation.progress.value > 0) {
    simulateMiningEffect(simulation.progress.value)
  }
}

const resizeCanvas = (canvas) => {
  if (!canvas || !stageContainer.value) return
  const rect = stageContainer.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  const cssW = Math.round(rect.width)
  const cssH = Math.round(rect.height)

  canvas.style.width = `${cssW}px`
  canvas.style.height = `${cssH}px`
  canvas.width = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = false
  }
}

const worldToScreen = (wx, wy) => {
  if (!gridBounds.value) return { x: 0, y: 0 }
  const { min_x, max_y } = gridBounds.value
  // World: Y up. Screen: Y down.
  // We align World(min_x, max_y) to Screen(0,0) initially, then apply transform
  // Scale factor: how many pixels per meter
  const pixelsPerMeter = 1 // Base scale
  
  const dx = (wx - min_x) * pixelsPerMeter
  const dy = (max_y - wy) * pixelsPerMeter // Invert Y
  
  return {
    x: dx * viewport.scale + viewport.x,
    y: dy * viewport.scale + viewport.y
  }
}

const screenToWorld = (sx, sy) => {
  if (!gridBounds.value) return { x: 0, y: 0 }
  const { min_x, max_y } = gridBounds.value
  
  const dx = (sx - viewport.x) / viewport.scale
  const dy = (sy - viewport.y) / viewport.scale
  
  return {
    x: min_x + dx,
    y: max_y - dy
  }
}

const drawBackground = () => {
  const ctx = bgCanvas.value?.getContext('2d')
  if (!ctx || !globalGrid.value) return

  // Invalidate cache when viewport changes significantly (js-cache-function-results pattern)
  const cacheKey = `${viewport.scale.toFixed(2)}-${viewport.x.toFixed(0)}-${viewport.y.toFixed(0)}`
  if (bgCacheValid.value && bgCacheCanvas.value && bgCacheCanvas.value.key === cacheKey) {
    ctx.clearRect(0, 0, bgCanvas.value.width, bgCanvas.value.height)
    ctx.drawImage(bgCacheCanvas.value, 0, 0)
    return
  }

  ctx.clearRect(0, 0, bgCanvas.value.width, bgCanvas.value.height)

  const grid = globalGrid.value
  const rows = grid.length
  const cols = grid[0].length
  const { min_x, max_x, min_y, max_y } = gridBounds.value
  const cellW_m = (max_x - min_x) / cols
  const cellH_m = (max_y - min_y) / rows

  const minVal = stats.value.min || 0
  const maxVal = stats.value.max || 100
  const thresholds = gradeThresholds.value

  // PERFORMANCE: Viewport culling - only render visible cells
  // Calculate visible world bounds from screen viewport
  const canvasW = bgCanvas.value.width
  const canvasH = bgCanvas.value.height
  const tl = screenToWorld(0, 0)
  const br = screenToWorld(canvasW, canvasH)

  // Convert to grid indices with padding for smooth panning
  const padding = 1 // Extra cells around edges
  const startCol = Math.max(0, Math.floor((tl.x - min_x) / cellW_m) - padding)
  const endCol = Math.min(cols - 1, Math.ceil((br.x - min_x) / cellW_m) + padding)
  const startRow = Math.max(0, Math.floor((max_y - br.y) / cellH_m) - padding)
  const endRow = Math.min(rows - 1, Math.ceil((max_y - tl.y) / cellH_m) + padding)

  // Only iterate visible cells - major performance improvement for large grids
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      const val = grid[r][c]
      if (val === null) continue

      const wx = min_x + c * cellW_m
      const wy = max_y - r * cellH_m // Top-left of cell in world

      const p1 = worldToScreen(wx, wy)
      const p2 = worldToScreen(wx + cellW_m, wy - cellH_m)

      const w = p2.x - p1.x
      const h = p2.y - p1.y // h will be positive

      // Additional culling for edge cases
      if (p1.x > canvasW || p2.x < 0 || p1.y > canvasH || p2.y < 0) continue

      const color = layers.gradedBands
        ? getDiscreteColor(val, thresholds, gradeColors)
        : getColor(val, minVal, maxVal)
      ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`
      // +1 to fix gaps
      ctx.fillRect(Math.floor(p1.x), Math.floor(p1.y), Math.ceil(w)+1, Math.ceil(h)+1)
    }
  }

  // Cache the rendered background (js-cache-function-results pattern)
  const offscreen = document.createElement('canvas')
  offscreen.width = bgCanvas.value.width
  offscreen.height = bgCanvas.value.height
  offscreen.key = cacheKey
  offscreen.getContext('2d').drawImage(bgCanvas.value, 0, 0)
  bgCacheCanvas.value = markRaw(offscreen)
  bgCacheValid.value = true
}

const drawContours = (ctx) => {
  if (!globalGrid.value || !gridBounds.value || !stats.value) return
  
  const grid = globalGrid.value
  const rows = grid.length
  const cols = grid[0].length
  
  // 1. Flatten grid for d3
  const values = new Float64Array(rows * cols)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      values[r * cols + c] = grid[r][c] ?? -9999 // Handle nulls by using low val
    }
  }
  
  // 2. Generate Contours
  const minV = stats.value.min || 0
  const maxV = stats.value.max || 100
  const thresholds = gradeThresholds.value.length === 4
    ? gradeThresholds.value
    : d3.range(minV, maxV, (maxV - minV) / 5)
  
  const contours = d3.contours()
    .size([cols, rows])
    .thresholds(thresholds)
    (values)
    
  // 3. Draw
  ctx.save()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
  
  const { min_x, max_x, min_y, max_y } = gridBounds.value
  const cellW = (max_x - min_x) / cols
  const cellH = (max_y - min_y) / rows
  
  contours.forEach(contour => {
    ctx.beginPath()
    contour.coordinates.forEach(polygon => {
      polygon.forEach(ring => {
        ring.forEach((point, i) => {
            // point is [c, r] in grid index
            const c = point[0]
            const r = point[1]
            
            const wx = min_x + c * cellW
            const wy = max_y - r * cellH 
            
            const s = worldToScreen(wx, wy)
            if (i === 0) ctx.moveTo(s.x, s.y)
            else ctx.lineTo(s.x, s.y)
        })
        ctx.closePath()
      })
    })
    ctx.stroke()
  })

  // Optional contour labels (sparse)
  if (layers.contourLabels) {
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = '12px JetBrains Mono, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    contours.forEach((contour, idx) => {
      if (idx % 2 !== 0) return
      const poly = contour.coordinates[0]
      if (!poly || !poly[0] || !poly[0][0]) return
      const sample = poly[0][Math.floor(poly[0].length / 2)]
      if (!sample) return
      const wx = min_x + sample[0] * cellW
      const wy = max_y - sample[1] * cellH
      const s = worldToScreen(wx, wy)
      ctx.fillText(contour.value.toFixed(1), s.x, s.y)
    })
  }
  
  ctx.restore()
}

const drawBoreholes = (ctx) => {
  if (!seamBoreholes.value?.length) return

  ctx.save()
  ctx.font = '11px JetBrains Mono, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (const b of seamBoreholes.value) {
    const pos = worldToScreen(b.x, b.y)

    // Skip if outside viewport (with margin)
    const margin = 50
    if (pos.x < -margin || pos.x > overlayCanvas.value.width + margin ||
        pos.y < -margin || pos.y > overlayCanvas.value.height + margin) {
      continue
    }

    // Draw borehole marker (circle with cross)
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw cross inside
    ctx.beginPath()
    ctx.moveTo(pos.x - 3, pos.y)
    ctx.lineTo(pos.x + 3, pos.y)
    ctx.moveTo(pos.x, pos.y - 3)
    ctx.lineTo(pos.x, pos.y + 3)
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Draw borehole name label
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)'
    ctx.fillRect(pos.x - 25, pos.y + 10, 50, 16)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.lineWidth = 1
    ctx.strokeRect(pos.x - 25, pos.y + 10, 50, 16)

    ctx.fillStyle = '#fff'
    ctx.fillText(b.name || '', pos.x, pos.y + 18)
  }

  ctx.restore()
}

const drawOverlay = () => {
  const ctx = overlayCanvas.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, overlayCanvas.value.width, overlayCanvas.value.height)

  if (layers.grid) {
    drawEngineeringGrid(ctx)
  }
  
  // Draw Contours
  if (layers.contours) {
    drawContours(ctx)
  }

  // Draw boreholes
  if (layers.boreholes) {
    drawBoreholes(ctx)
  }

  // Draw workfaces
  if (layers.workfaces) {
    workfaces.value.forEach(wf => {
      ctx.beginPath()
      if (wf.type === 'polygon' && wf.points) {
        wf.points.forEach((p, i) => {
          const s = worldToScreen(p[0], p[1])
          if (i === 0) ctx.moveTo(s.x, s.y)
          else ctx.lineTo(s.x, s.y)
        })
      } else if (wf.bounds) {
        const p1 = worldToScreen(wf.bounds.min_x, wf.bounds.max_y)
        const p2 = worldToScreen(wf.bounds.max_x, wf.bounds.max_y)
        const p3 = worldToScreen(wf.bounds.max_x, wf.bounds.min_y)
        const p4 = worldToScreen(wf.bounds.min_x, wf.bounds.min_y)
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.lineTo(p3.x, p3.y)
        ctx.lineTo(p4.x, p4.y)
      }
      ctx.closePath()
      ctx.strokeStyle = wf === activeWorkface.value ? '#facc15' : '#fff'
      ctx.lineWidth = wf === activeWorkface.value ? 3 : 2
      ctx.stroke()
      
      // Fill active
      if (wf === activeWorkface.value) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.1)'
        ctx.fill()
      }
    })
  }
}

const drawEngineeringGrid = (ctx) => {
  if (!gridBounds.value || !stageContainer.value) return
  const rect = stageContainer.value.getBoundingClientRect()
  const w = rect.width
  const h = rect.height

  const base = 100
  const step = Math.max(20, Math.round(base / viewport.scale / 10) * 10)

  ctx.save()
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)'
  ctx.lineWidth = 1

  const worldTL = screenToWorld(0, 0)
  const worldBR = screenToWorld(w, h)

  const minX = Math.floor(Math.min(worldTL.x, worldBR.x) / step) * step
  const maxX = Math.ceil(Math.max(worldTL.x, worldBR.x) / step) * step
  const minY = Math.floor(Math.min(worldTL.y, worldBR.y) / step) * step
  const maxY = Math.ceil(Math.max(worldTL.y, worldBR.y) / step) * step

  for (let x = minX; x <= maxX; x += step) {
    const p1 = worldToScreen(x, minY)
    const p2 = worldToScreen(x, maxY)
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
  }
  for (let y = minY; y <= maxY; y += step) {
    const p1 = worldToScreen(minX, y)
    const p2 = worldToScreen(maxX, y)
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
  }

  ctx.restore()
}

/**
 * Enhanced Mining Effect with Directional Support and Particles
 * Renders goaf area, stress zone, relief zone, ripples, and particles
 */
const simulateMiningEffect = (progress) => {
  const ctx = dynamicCanvas.value?.getContext('2d')
  if (!ctx || !activeWorkface.value) return

  ctx.clearRect(0, 0, dynamicCanvas.value.width, dynamicCanvas.value.height)

  // Get bounds from workface
  let bounds = activeWorkface.value.bounds
  if (!bounds && activeWorkface.value.points) {
    const xs = activeWorkface.value.points.map(p => p[0])
    const ys = activeWorkface.value.points.map(p => p[1])
    bounds = {
      min_x: Math.min(...xs), max_x: Math.max(...xs),
      min_y: Math.min(...ys), max_y: Math.max(...ys)
    }
  }
  if (!bounds) return

  const directionRad = (miningDirection.value - 90) * Math.PI / 180
  const workfaceLength = bounds.max_y - bounds.min_y
  const maxWidth = bounds.max_x - bounds.min_x
  const centerX = (bounds.min_x + bounds.max_x) / 2
  const centerY = (bounds.min_y + bounds.max_y) / 2

  // Calculate distance from initial position to front
  const distance = maxWidth * (progress / 100)

  // Front line center position
  const frontCenterX = centerX + Math.cos(directionRad) * distance
  const frontCenterY = centerY + Math.sin(directionRad) * distance

  // Perpendicular angle for front line
  const perpAngle = directionRad + Math.PI / 2
  const halfLength = workfaceLength / 2

  // Calculate front line endpoints
  const frontStart = {
    x: frontCenterX - Math.cos(perpAngle) * halfLength,
    y: frontCenterY - Math.sin(perpAngle) * halfLength
  }
  const frontEnd = {
    x: frontCenterX + Math.cos(perpAngle) * halfLength,
    y: frontCenterY + Math.sin(perpAngle) * halfLength
  }

  // Back line (initial position)
  const backCenterX = centerX - Math.cos(directionRad) * (centerX - bounds.min_x)
  const backCenterY = centerY - Math.sin(directionRad) * (centerX - bounds.min_x)
  const backStart = {
    x: backCenterX - Math.cos(perpAngle) * halfLength,
    y: backCenterY - Math.sin(perpAngle) * halfLength
  }
  const backEnd = {
    x: backCenterX + Math.cos(perpAngle) * halfLength,
    y: backCenterY + Math.sin(perpAngle) * halfLength
  }

  // Convert to screen coordinates
  const sBackStart = worldToScreen(backStart.x, backStart.y)
  const sBackEnd = worldToScreen(backEnd.x, backEnd.y)
  const sFrontStart = worldToScreen(frontStart.x, frontStart.y)
  const sFrontEnd = worldToScreen(frontEnd.x, frontEnd.y)
  const sFrontCenter = worldToScreen(frontCenterX, frontCenterY)

  // ===== 1. Draw Goaf (Mined Area) with Enhanced Progressive Gradient =====
  ctx.save()

  // Multi-stage gradient based on progress
  const goafGradient = ctx.createLinearGradient(
    (sBackStart.x + sBackEnd.x) / 2,
    (sBackStart.y + sBackEnd.y) / 2,
    (sFrontStart.x + sFrontEnd.x) / 2,
    (sFrontStart.y + sFrontEnd.y) / 2
  )

  // Progressive color scheme based on mining stage
  if (progress < 20) {
    // Early stage: fresh goaf, darker
    goafGradient.addColorStop(0, 'rgba(35, 35, 35, 0.9)')
    goafGradient.addColorStop(1, 'rgba(40, 40, 40, 0.85)')
  } else if (progress < 40) {
    // Initial settling
    goafGradient.addColorStop(0, 'rgba(40, 40, 40, 0.85)')
    goafGradient.addColorStop(0.5, 'rgba(38, 38, 38, 0.82)')
    goafGradient.addColorStop(1, 'rgba(42, 42, 42, 0.8)')
  } else if (progress < 60) {
    // Mid stage: compacting
    goafGradient.addColorStop(0, 'rgba(45, 45, 45, 0.8)')
    goafGradient.addColorStop(0.5, 'rgba(40, 40, 40, 0.78)')
    goafGradient.addColorStop(1, 'rgba(43, 43, 43, 0.75)')
  } else if (progress < 80) {
    // Advanced: compacted
    goafGradient.addColorStop(0, 'rgba(48, 48, 48, 0.75)')
    goafGradient.addColorStop(0.5, 'rgba(42, 42, 42, 0.73)')
    goafGradient.addColorStop(1, 'rgba(45, 45, 45, 0.7)')
  } else {
    // Final: fully compacted
    goafGradient.addColorStop(0, 'rgba(50, 50, 50, 0.72)')
    goafGradient.addColorStop(0.5, 'rgba(44, 44, 44, 0.7)')
    goafGradient.addColorStop(1, 'rgba(47, 47, 47, 0.68)')
  }

  ctx.fillStyle = goafGradient
  ctx.beginPath()
  ctx.moveTo(sBackStart.x, sBackStart.y)
  ctx.lineTo(sBackEnd.x, sBackEnd.y)
  ctx.lineTo(sFrontEnd.x, sFrontEnd.y)
  ctx.lineTo(sFrontStart.x, sFrontStart.y)
  ctx.closePath()
  ctx.fill()

  // Add grid pattern overlay to goaf for texture
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
  ctx.lineWidth = 1
  const gridSpacing = 20
  const goafWidth = Math.hypot(sFrontEnd.x - sBackEnd.x, sFrontEnd.y - sBackEnd.y)
  const goafHeight = Math.hypot(sFrontEnd.x - sFrontStart.x, sFrontEnd.y - sFrontStart.y)

  for (let i = 0; i < goafWidth; i += gridSpacing) {
    const t = i / goafWidth
    const x = sBackStart.x + (sFrontStart.x - sBackStart.x) * t
    const y = sBackStart.y + (sFrontStart.y - sBackStart.y) * t
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + sFrontEnd.x - sFrontStart.x, y + sFrontEnd.y - sFrontStart.y)
    ctx.stroke()
  }

  // ===== 2. Draw Multi-Layered Stress Zone with Pulse =====
  const stressDistance = maxWidth * 0.12
  const stressCenterX = frontCenterX + Math.cos(directionRad) * stressDistance
  const stressCenterY = frontCenterY + Math.sin(directionRad) * stressDistance

  const stressHalfLength = workfaceLength * 0.58

  const stressStart = {
    x: stressCenterX - Math.cos(perpAngle) * stressHalfLength,
    y: stressCenterY - Math.sin(perpAngle) * stressHalfLength
  }
  const stressEnd = {
    x: stressCenterX + Math.cos(perpAngle) * stressHalfLength,
    y: stressCenterY + Math.sin(perpAngle) * stressHalfLength
  }

  const sStressStart = worldToScreen(stressStart.x, stressStart.y)
  const sStressEnd = worldToScreen(stressEnd.x, stressEnd.y)

  // Multi-layer pulsing effect with different frequencies
  const pulsePhase1 = (Date.now() / 800) % 2
  const pulsePhase2 = (Date.now() / 1200) % 2
  const pulseIntensity1 = 0.5 + 0.2 * Math.sin(pulsePhase1 * Math.PI)
  const pulseIntensity2 = 0.4 + 0.15 * Math.sin(pulsePhase2 * Math.PI)

  // Outer stress layer (larger, softer)
  const outerStressGradient = ctx.createRadialGradient(
    sFrontCenter.x, sFrontCenter.y, 0,
    sFrontCenter.x, sFrontCenter.y,
    Math.hypot(sStressEnd.x - sFrontCenter.x, sStressEnd.y - sFrontCenter.y) * 1.5
  )
  outerStressGradient.addColorStop(0, `rgba(239, 68, 68, ${pulseIntensity1 * 0.3})`)
  outerStressGradient.addColorStop(0.5, `rgba(239, 68, 68, ${pulseIntensity1 * 0.15})`)
  outerStressGradient.addColorStop(1, 'rgba(239, 68, 68, 0)')

  ctx.fillStyle = outerStressGradient
  ctx.beginPath()
  ctx.arc(sFrontCenter.x, sFrontCenter.y,
    Math.hypot(sStressEnd.x - sFrontCenter.x, sStressEnd.y - sFrontCenter.y) * 1.5,
    0, Math.PI * 2)
  ctx.fill()

  // Inner stress layer (more intense)
  const innerStressGradient = ctx.createLinearGradient(
    (sFrontStart.x + sFrontEnd.x) / 2,
    (sFrontStart.y + sFrontEnd.y) / 2,
    (sStressStart.x + sStressEnd.x) / 2,
    (sStressStart.y + sStressEnd.y) / 2
  )
  innerStressGradient.addColorStop(0, `rgba(220, 38, 38, ${pulseIntensity2 * 0.7})`)
  innerStressGradient.addColorStop(0.5, `rgba(239, 68, 68, ${pulseIntensity2 * 0.4})`)
  innerStressGradient.addColorStop(1, `rgba(239, 68, 68, 0)`)

  ctx.fillStyle = innerStressGradient
  ctx.beginPath()
  ctx.moveTo(sFrontStart.x, sFrontStart.y)
  ctx.lineTo(sFrontEnd.x, sFrontEnd.y)
  ctx.lineTo(sStressEnd.x, sStressEnd.y)
  ctx.lineTo(sStressStart.x, sStressStart.y)
  ctx.closePath()
  ctx.fill()

  // ===== 3. Draw Relief Zone with Enhanced Gradient =====
  const reliefDistance = maxWidth * 0.1
  const reliefCenterX = frontCenterX - Math.cos(directionRad) * reliefDistance
  const reliefCenterY = frontCenterY - Math.sin(directionRad) * reliefDistance

  const reliefHalfLength = workfaceLength * 0.52
  const reliefStart = {
    x: reliefCenterX - Math.cos(perpAngle) * reliefHalfLength,
    y: reliefCenterY - Math.sin(perpAngle) * reliefHalfLength
  }
  const reliefEnd = {
    x: reliefCenterX + Math.cos(perpAngle) * reliefHalfLength,
    y: reliefCenterY + Math.sin(perpAngle) * reliefHalfLength
  }

  const sReliefStart = worldToScreen(reliefStart.x, reliefStart.y)
  const sReliefEnd = worldToScreen(reliefEnd.x, reliefEnd.y)

  // Relief pulse (calmer, slower)
  const reliefPulse = (Date.now() / 2000) % 2
  const reliefIntensity = 0.4 + 0.1 * Math.sin(reliefPulse * Math.PI)

  const reliefGradient = ctx.createLinearGradient(
    (sReliefStart.x + sReliefEnd.x) / 2,
    (sReliefStart.y + sReliefEnd.y) / 2,
    (sFrontStart.x + sFrontEnd.x) / 2,
    (sFrontStart.y + sFrontEnd.y) / 2
  )
  reliefGradient.addColorStop(0, `rgba(59, 130, 246, ${reliefIntensity * 0.5})`)
  reliefGradient.addColorStop(0.7, `rgba(96, 165, 250, ${reliefIntensity * 0.3})`)
  reliefGradient.addColorStop(1, `rgba(59, 130, 246, 0)`)

  ctx.fillStyle = reliefGradient
  ctx.beginPath()
  ctx.moveTo(sReliefStart.x, sReliefStart.y)
  ctx.lineTo(sReliefEnd.x, sReliefEnd.y)
  ctx.lineTo(sFrontStart.x, sFrontStart.y)
  ctx.lineTo(sFrontEnd.x, sFrontEnd.y)
  ctx.closePath()
  ctx.fill()

  // ===== 4. Draw Ripples (Stress Wave Visualization) =====
  if (simulation.isPlaying.value || progress > 0) {
    ripples.update(0.016)
    ripples.draw(ctx)

    // Emit new ripple periodically
    if (simulation.isPlaying.value && Math.random() < 0.02) {
      ripples.emit(sFrontCenter.x, sFrontCenter.y)
    }
  }

  // ===== 5. Emit and Draw Particles =====
  if (simulation.isPlaying.value && progress > 0) {
    const now = Date.now()
    if (now - lastParticleEmit.value > particleEmitInterval) {
      // Emit stress particles from front line
      const stressDir = { x: Math.cos(directionRad), y: Math.sin(directionRad) }
      stressParticles.emitStressParticles(
        [sFrontStart, sFrontEnd],
        stressDir,
        2
      )

      // Emit relief particles in goaf area
      const goafBounds = {
        minX: Math.min(sBackStart.x, sBackEnd.x, sFrontStart.x, sFrontEnd.x),
        maxX: Math.max(sBackStart.x, sBackEnd.x, sFrontStart.x, sFrontEnd.x),
        minY: Math.min(sBackStart.y, sBackEnd.y, sFrontStart.y, sFrontEnd.y),
        maxY: Math.max(sBackStart.y, sBackEnd.y, sFrontStart.y, sFrontEnd.y)
      }
      reliefParticles.emitReliefParticles(goafBounds, 0.5)

      lastParticleEmit.value = now
    }

    // Update and draw particles
    stressParticles.update(0.016)
    stressParticles.draw(ctx)
    reliefParticles.update(0.016)
    reliefParticles.draw(ctx)
  } else if (progress > 0) {
    // Still update particles when paused for visual effect
    stressParticles.update(0.016)
    reliefParticles.update(0.016)
    stressParticles.draw(ctx)
    reliefParticles.draw(ctx)
  }

  // ===== 6. Draw Workface Front Line =====
  ctx.strokeStyle = '#facc15'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(sFrontStart.x, sFrontStart.y)
  ctx.lineTo(sFrontEnd.x, sFrontEnd.y)
  ctx.stroke()

  // Front line glow
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(sFrontStart.x, sFrontStart.y)
  ctx.lineTo(sFrontEnd.x, sFrontEnd.y)
  ctx.stroke()

  // ===== 7. Draw Direction Indicator =====
  ctx.restore()

  ctx.save()
  const arrowX = (backCenterX + frontCenterX) / 2
  const arrowY = (backCenterY + frontCenterY) / 2
  const sArrow = worldToScreen(arrowX, arrowY)

  ctx.translate(sArrow.x, sArrow.y)
  ctx.rotate(miningDirection.value * Math.PI / 180)

  // Arrow body
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.beginPath()
  ctx.moveTo(-10, 0)
  ctx.lineTo(6, -6)
  ctx.lineTo(6, 6)
  ctx.closePath()
  ctx.fill()

  // Arrow glow
  ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
  ctx.shadowBlur = 8
  ctx.fill()

  ctx.restore()
}


// --- Interaction: Pan/Zoom ---
const fitToScreen = () => {
  if (!gridBounds.value || !stageContainer.value) return
  const { min_x, max_x, min_y, max_y } = gridBounds.value
  const worldW = max_x - min_x
  const worldH = max_y - min_y

  const rect = stageContainer.value.getBoundingClientRect()
  const screenW = rect.width
  const screenH = rect.height

  const scaleX = screenW / worldW
  const scaleY = screenH / worldH
  const scale = Math.min(scaleX, scaleY) * 0.9 // 90% fit

  viewport.scale = scale

  // Center (no longer shifted since we have full width)
  const midX = (min_x + max_x) / 2
  const midY = (min_y + max_y) / 2

  viewport.x = (screenW / 2) - (midX - min_x) * scale
  viewport.y = (screenH / 2) - (max_y - midY) * scale

  requestRender()
}

const handleMouseDown = (e) => {
  if (!stageContainer.value) return
  viewport.isDragging = true
  viewport.lastX = e.clientX
  viewport.lastY = e.clientY
  viewport.startX = e.clientX // Record start for click detection
  viewport.startY = e.clientY
}

const handleMouseMove = (e) => {
  // Tooltip
  if (!stageContainer.value) return
  const rect = stageContainer.value.getBoundingClientRect()
  const sx = e.clientX - rect.left
  const sy = e.clientY - rect.top
  hoverPos.value = { x: sx, y: sy }
  
  const wPos = screenToWorld(sx, sy)
  
  // Find grid val
  if (globalGrid.value && gridBounds.value) {
    const { min_x, max_x, min_y, max_y } = gridBounds.value
    const rows = globalGrid.value.length
    const cols = globalGrid.value[0].length
    const c = Math.floor((wPos.x - min_x) / ((max_x - min_x) / cols))
    const r = Math.floor((max_y - wPos.y) / ((max_y - min_y) / rows))
    
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      const val = globalGrid.value[r][c]
      if (val !== null) {
        hoverInfo.value = { x: wPos.x, y: wPos.y, value: val }
      } else {
        hoverInfo.value = null
      }
    } else {
      hoverInfo.value = null
    }
  }

  // Dragging
  if (!viewport.isDragging) return
  const dx = e.clientX - viewport.lastX
  const dy = e.clientY - viewport.lastY
  viewport.x += dx
  viewport.y += dy
  viewport.lastX = e.clientX
  viewport.lastY = e.clientY

  requestRender()
}

const handleMouseUp = (e) => {
  // Detect Click
  const dist = Math.hypot(e.clientX - viewport.startX, e.clientY - viewport.startY)
  if (viewport.isDragging && dist < 5) {
     handleCanvasClick(e)
  }
  viewport.isDragging = false
}

const handleCanvasClick = (e) => {
  if (!stageContainer.value) return
  const rect = stageContainer.value.getBoundingClientRect()
  const sx = e.clientX - rect.left
  const sy = e.clientY - rect.top
  const w = screenToWorld(sx, sy)
  
  const hit = workfaces.value.find(wf => {
      if(wf.bounds) {
           return w.x >= wf.bounds.min_x && w.x <= wf.bounds.max_x &&
                  w.y >= wf.bounds.min_y && w.y <= wf.bounds.max_y
      }
      return false 
  })
  
  if(hit) {
      activeWorkface.value = hit
      renderAll()
  }
}

const handleWheel = (e) => {
  e.preventDefault()
  const zoomSensitivity = 0.001
  const delta = -e.deltaY * zoomSensitivity
  const newScale = viewport.scale * (1 + delta)

  viewport.scale = Math.max(0.1, Math.min(50, newScale))
  requestRender()
}

// Animation loop reference
const animationLoopRef = ref(null)

// Throttled render request (js-early-exit pattern)
let renderRequested = false
const requestRender = () => {
  if (renderRequested) return
  renderRequested = true
  requestAnimationFrame(() => {
    renderAll()
    renderRequested = false
  })
}

// Watchers
watch(() => simulation.progress.value, (val) => {
  // Update render when progress changes (manual or during playback)
  simulateMiningEffect(val)
})

watch(() => simulation.isPlaying.value, (isPlaying) => {
  if (isPlaying) {
    startAnimationLoop()
  }
})

// Invalidate background cache when viewport changes - with throttling for performance
let cacheInvalidationScheduled = false
watch(() => [viewport.scale, viewport.x, viewport.y], () => {
  if (!cacheInvalidationScheduled) {
    cacheInvalidationScheduled = true
    requestAnimationFrame(() => {
      bgCacheValid.value = false
      cacheInvalidationScheduled = false
    })
  }
}, { flush: 'sync' })

// Animation loop for smooth playback
const startAnimationLoop = () => {
  if (animationLoopRef.value) {
    cancelAnimationFrame(animationLoopRef.value)
  }

  const loop = () => {
    if (simulation.isPlaying.value && simulation.progress.value < 100) {
      simulateMiningEffect(simulation.progress.value)
      animationLoopRef.value = requestAnimationFrame(loop)
    } else if (simulation.progress.value >= 100) {
      simulation.isPlaying.value = false
    }
  }

  animationLoopRef.value = requestAnimationFrame(loop)
}

// Keyboard shortcuts for playback control
const handleKeyboard = (e) => {
  // Ignore if typing in an input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
    return
  }

  switch (e.code) {
    case 'Space':
      e.preventDefault()
      simulation.togglePlay()
      break
    case 'ArrowLeft':
      e.preventDefault()
      if (e.shiftKey) {
        simulation.skipToStart()
      } else {
        simulation.stepBackward()
      }
      break
    case 'ArrowRight':
      e.preventDefault()
      if (e.shiftKey) {
        simulation.skipToEnd()
      } else {
        simulation.stepForward()
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      simulation.setPlaybackSpeed(Math.min(5, simulation.playbackSpeed.value + 0.5))
      break
    case 'ArrowDown':
      e.preventDefault()
      simulation.setPlaybackSpeed(Math.max(0.5, simulation.playbackSpeed.value - 0.5))
      break
    case 'KeyR':
      e.preventDefault()
      simulation.seek(0)
      stressParticles.clear()
      reliefParticles.clear()
      ripples.clear()
      break
    case 'Digit1':
      e.preventDefault()
      simulation.setPlaybackSpeed(1)
      break
    case 'Digit2':
      e.preventDefault()
      simulation.setPlaybackSpeed(2)
      break
    case 'Digit5':
      e.preventDefault()
      simulation.setPlaybackSpeed(5)
      break
  }
}

// Cleanup on unmount
onUnmounted(() => {
  const stage = stageContainer.value
  if (animationLoopRef.value) {
    cancelAnimationFrame(animationLoopRef.value)
  }
  simulation.pause()
  // Clear particle systems
  stressParticles.clear()
  reliefParticles.clear()
  ripples.clear()
  stressParticles.stopAnimation()
  reliefParticles.stopAnimation()
  if (stage) {
    stage.removeEventListener('mousedown', handleMouseDown)
    stage.removeEventListener('wheel', handleWheel)
  }
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  // Remove keyboard listener
  window.removeEventListener('keydown', handleKeyboard)
})

// --- Lifecycle ---
onMounted(() => {
  loadSeams()

  const stage = stageContainer.value
  if (!stage) return
  stage.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  stage.addEventListener('wheel', handleWheel, { passive: false })
  // Add keyboard shortcuts
  window.addEventListener('keydown', handleKeyboard)
})

// --- Workface Upload Handler ---
const triggerWorkfaceUpload = () => fileInput.value?.click()
const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if(!file) return
  const { data } = await parseMpiWorkfaces(file)
  workfaces.value = [...workfaces.value, ...data.workfaces]
  if(data.workfaces.length) {
    activeWorkface.value = data.workfaces[0]
    // Reset simulation progress when new workface is selected
    simulation.seek(0)
    // Clear visual effects
    stressParticles.clear()
    reliefParticles.clear()
    ripples.clear()
  }
  renderAll()
}

const zoomIn = () => {
  viewport.scale = Math.min(50, viewport.scale * 1.15)
  requestRender()
}

const zoomOut = () => {
  viewport.scale = Math.max(0.1, viewport.scale / 1.15)
  requestRender()
}

const resetView = () => {
  viewport.scale = 1
  viewport.x = 0
  viewport.y = 0
  bgCacheValid.value = false
  requestRender()
}
</script>

<style scoped>
/* ==================== Main Layout ==================== */
.mpi-pro-page {
  position: fixed;
  inset: 0;
  background: #f0f2f5;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", -apple-system, sans-serif;
}

/* ==================== Top Navigation Bar ==================== */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 100;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn-mini {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.back-btn-mini:hover {
  background: #f1f5f9;
  color: #334155;
}
.back-btn-mini svg {
  width: 18px;
  height: 18px;
}

.nav-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.nav-separator {
  width: 1px;
  height: 20px;
  background: #e2e8f0;
}

.nav-select {
  font-size: 12px;
  color: #475569;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.15s;
}
.nav-select:hover {
  background: #f1f5f9;
}
.nav-select:focus {
  outline: none;
  background: #e2e8f0;
}

.mini-stats {
  display: flex;
  gap: 12px;
  font-size: 11px;
}

.mini-stat {
  display: flex;
  align-items: center;
  gap: 4px;
}
.mini-stat b {
  color: #0f172a;
}
.mini-stat.danger b {
  color: #dc2626;
}

.nav-center {
  display: flex;
  justify-content: center;
}

.nav-tool {
  width: 32px;
  height: 28px;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.nav-tool:hover {
  background: #f1f5f9;
  color: #334155;
}
.nav-tool.active {
  background: #3b82f6;
  color: white;
}
.nav-tool svg {
  width: 16px;
  height: 16px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-btn {
  width: 32px;
  height: 28px;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.nav-btn:hover {
  background: #f1f5f9;
  color: #334155;
}
.nav-btn svg {
  width: 16px;
  height: 16px;
}

/* ==================== Stage Container ==================== */
.stage-container {
  position: absolute;
  inset: 0;
  cursor: crosshair;
  z-index: 1;
}

.layer-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.layer-bg { z-index: 1; }
.layer-dynamic { z-index: 2; }
.layer-overlay { z-index: 3; }

/* ==================== Loading ==================== */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 13px;
  color: #64748b;
}

/* ==================== Control Panel Overlay ==================== */
.control-panel-overlay {
  position: fixed;
  top: 52px;
  right: 16px;
  z-index: 90;
  pointer-events: none;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.control-panel {
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 20px;
  width: 280px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
}

.panel-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.panel-close:hover {
  background: #f1f5f9;
  color: #64748b;
}
.panel-close svg {
  width: 14px;
  height: 14px;
}

.control-section {
  margin-bottom: 16px;
}
.control-section:last-of-type {
  margin-bottom: 0;
}

.control-section h4 {
  margin: 0 0 12px 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  font-weight: 600;
}

.control-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-item label {
  font-size: 12px;
  color: #64748b;
}

.range-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-input {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}
.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: grab;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
  transition: transform 0.15s;
}
.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}
.range-input::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.15);
}
.range-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: grab;
  border: none;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
}

.range-value {
  font-size: 12px;
  color: #475569;
  min-width: 40px;
  text-align: right;
}

.layer-toggles {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.layer-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
}
.layer-toggle input {
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
}

.mini-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-gradient {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #22c55e, #84cc16, #eab308, #f97316, #ef4444, #7c2d12);
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #94a3b8;
}

/* ==================== Bottom Playback Bar ==================== */
.playback-bar {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.playback-main {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.play-btn-mini {
  width: 36px;
  height: 36px;
  border: none;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}
.play-btn-mini:hover {
  background: #2563eb;
  transform: scale(1.05);
}
.play-btn-mini.playing {
  background: #ef4444;
}
.play-btn-mini svg {
  width: 16px;
  height: 16px;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 180px;
}

.progress-slider {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}
.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: grab;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
.progress-slider::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.1);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #64748b;
}

.speed-control {
  display: flex;
  gap: 4px;
}

.speed-btn {
  width: 28px;
  height: 24px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  transition: all 0.15s;
}
.speed-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}
.speed-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.step-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.step-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}
.step-btn svg {
  width: 14px;
  height: 14px;
}

/* ==================== Mini Dashboard ==================== */
.mini-dashboard {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 8px 12px;
  display: flex;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.dash-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.dash-label {
  font-size: 9px;
  color: #94a3b8;
  text-transform: uppercase;
}

.dash-value {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  font-family: 'JetBrains Mono', monospace;
}

.dash-value.stress {
  color: #ef4444;
}

.dash-value.relief {
  color: #3b82f6;
}

.dash-value.phase {
  color: #f59e0b;
}

/* ==================== Floating Hint ==================== */
.floating-hint {
  position: fixed;
  bottom: 80px;
  right: 16px;
  font-size: 11px;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  pointer-events: none;
  z-index: 50;
}

/* ==================== Tooltip ==================== */
.hover-tooltip {
  position: fixed;
  background: rgba(30, 41, 59, 0.95);
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 200;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tooltip-val {
  font-weight: 600;
}

.tooltip-xy {
  font-size: 10px;
  opacity: 0.8;
}

/* ==================== Responsive ==================== */
@media (max-width: 768px) {
  .nav-title {
    display: none;
  }

  .mini-stats {
    display: none;
  }

  .playback-bar {
    flex-direction: column;
    align-items: stretch;
    bottom: 12px;
    left: 12px;
    right: 12px;
    transform: none;
  }

  .playback-main {
    flex-wrap: wrap;
  }

  .mini-dashboard {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }

  .control-panel-overlay {
    top: 48px;
    right: 8px;
  }

  .control-panel {
    width: 220px;
    padding: 12px;
  }

  .floating-hint {
    display: none;
  }
}
</style>
