<template>
  <div class="mpi-pro-page">
    <!-- Map Canvas Container (The "Stage") -->
    <div ref="stageContainer" class="stage-container">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <div class="loading-text">全域数据计算中...</div>
      </div>
      
      <!-- Background Layer (Global MPI) -->
      <canvas ref="bgCanvas" class="layer-canvas layer-bg"></canvas>
      
      <!-- Dynamic Layer (Simulation/Mining Effect) -->
      <canvas ref="dynamicCanvas" class="layer-canvas layer-dynamic"></canvas>
      
      <!-- Overlay Layer (Workfaces, Grid, Highlights) -->
      <canvas ref="overlayCanvas" class="layer-canvas layer-overlay"></canvas>
    </div>

    <!-- UI Overlay: Header & Stats -->
    <div class="ui-panel top-left-panel">
      <div class="panel-header">
        <button class="back-btn" @click="$router.back()" title="返回">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div class="app-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div class="title-group">
          <h1>MPI 数值模拟系统</h1>
          <span class="subtitle">Mining Pressure Intelligence Core</span>
        </div>
      </div>

      <div class="status-chips">
        <span class="chip">煤层: {{ seam || '-' }}</span>
        <span class="chip">分辨率: {{ resolution }}m</span>
        <span class="chip">工作面: {{ workfaces.length }}</span>
        <span class="chip" :class="{ on: layers.contours }">等值线</span>
      </div>

      <div class="stats-card glass-panel" v-if="hasData">
        <div class="stat-row">
          <span class="label">全域均值</span>
          <span class="value">{{ stats.mean?.toFixed(2) || '-' }}</span>
        </div>
        <div class="stat-row">
          <span class="label">最低风险</span>
          <span class="value safe">{{ stats.max?.toFixed(2) || '-' }}</span>
        </div>
        <div class="stat-row">
          <span class="label">最高风险</span>
          <span class="value danger">{{ stats.min?.toFixed(2) || '-' }}</span>
        </div>
      </div>
    </div>

    <!-- UI Overlay: Controls & Layers -->
    <div class="ui-panel top-right-panel">
      <div class="glass-panel control-group">
        <h3>视图控制</h3>
        <div class="control-row">
          <label>煤层</label>
          <select v-model="seam" @change="handleSeamChange" class="select-input">
            <option v-for="s in seams" :key="s.name" :value="s.name">{{ s.name }}</option>
          </select>
        </div>
        <div class="control-row">
          <label>网格精度</label>
          <input type="range" v-model.number="resolution" min="30" max="150" step="10" @change="recomputeGlobal" class="range-input">
          <span class="value-display">{{ resolution }}m</span>
        </div>
      </div>

      <div class="glass-panel control-group">
        <h3>图层叠加</h3>
        <label class="checkbox-row">
          <input type="checkbox" v-model="layers.workfaces"> 工作面边界
        </label>
        <label class="checkbox-row">
          <input type="checkbox" v-model="layers.contours"> 等值线
        </label>
        <label class="checkbox-row sub-option" v-if="layers.contours">
          <input type="checkbox" v-model="layers.contourLabels"> 等值线标注
        </label>
        <label class="checkbox-row">
          <input type="checkbox" v-model="layers.boreholes"> 钻孔点位
        </label>
        <label class="checkbox-row">
          <input type="checkbox" v-model="layers.grid"> 工程网格
        </label>
        <label class="checkbox-row">
          <input type="checkbox" v-model="layers.gradedBands"> 分级等值带
        </label>
      </div>

      <DirectionControl
        v-model:direction="miningDirection"
        @update:direction="simulation.setDirection"
      />

      <div class="glass-panel control-group action-group">
        <button class="btn primary" @click="triggerWorkfaceUpload">
          导入工作面
          <span class="btn-sub">CSV / JSON / TXT</span>
          <input ref="fileInput" type="file" style="display:none" @change="handleFileUpload" accept=".csv,.json,.txt">
        </button>
        <button class="btn ghost" @click="fitToScreen">适配视图</button>
      </div>

      <div class="glass-panel legend-card">
        <div class="legend-title">MPI 分级等值带</div>
        <div class="legend-bands">
          <div v-for="(item, idx) in gradeRanges" :key="item.label" class="legend-band">
            <div class="legend-swatch" :style="{ background: gradeColors[idx] }"></div>
            <div class="legend-text">
              <div class="legend-grade">{{ item.label }}</div>
              <div class="legend-range">{{ item.range }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- UI Overlay: Simulation Bar (Bottom) -->
    <div class="ui-panel bottom-panel glass-panel">
      <PlaybackControls
        :progress="simulation.progress.value"
        :playing="simulation.isPlaying.value"
        :playback-speed="simulation.playbackSpeed.value"
        :total-distance="500"
        @update:progress="simulation.seek"
        @toggle-play="simulation.togglePlay"
        @update:playbackSpeed="simulation.setPlaybackSpeed"
        @step-forward="simulation.stepForward"
        @step-backward="simulation.stepBackward"
        @skip-to-start="simulation.skipToStart"
        @skip-to-end="simulation.skipToEnd"
      />
    </div>

    <div class="ui-panel bottom-right-panel">
      <div class="glass-panel tool-group">
        <button class="tool-btn" @click="zoomIn" title="放大">+</button>
        <button class="tool-btn" @click="zoomOut" title="缩小">−</button>
        <button class="tool-btn" @click="fitToScreen" title="适配">适配</button>
        <button class="tool-btn" @click="resetView" title="复位">复位</button>
      </div>
      <div class="hint-card">拖拽移动 · 滚轮缩放 · 单击选择工作面</div>
    </div>

    <!-- Tooltip -->
    <div v-if="hoverInfo" class="hover-tooltip" :style="hoverStyle">
      <div class="tooltip-val">{{ hoverInfo.value.toFixed(2) }}</div>
      <div class="tooltip-xy">X: {{ hoverInfo.x.toFixed(0) }} Y: {{ hoverInfo.y.toFixed(0) }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'
import { useToast } from '../composables/useToast'
import { useMiningSimulation } from '../composables/useMiningSimulation'
import { useParticles, useRipples } from '../composables/useParticles'
import DirectionControl from '../components/simulation/DirectionControl.vue'
import PlaybackControls from '../components/simulation/PlaybackControls.vue'
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
const resolution = ref(80)
const stats = ref({})
const activeWorkface = ref(null)
const workfaces = ref([])

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
const stressParticles = useParticles({ maxParticles: 150, emitRate: 2 })
const reliefParticles = useParticles({ maxParticles: 100, emitRate: 1 })
const ripples = useRipples({ maxRipples: 8, rippleSpeed: 60, rippleInterval: 600 })

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

// Data State
const globalGrid = ref(null)
const gridBounds = ref(null)
const hoverInfo = ref(null)
const hoverPos = ref({ x: 0, y: 0 })

const toast = useToast()

// Cache
const layerParamsCache = new Map()
const odiPalette = ['#3b82f6', '#facc15', '#fb923c', '#f87171', '#dc2626']

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

// --- Methods: Data Loading ---
const loadSeams = async () => {
  try {
    const { data } = await getCoalSeams()
    seams.value = data.seams || []
    if (seams.value.length) {
      seam.value = seams.value[0].name
      await computeGlobal()
    }
  } catch (e) {
    console.error(e)
    toast.add('加载煤层失败', 'error')
  }
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
  
  // Optimization: Only draw cells in viewport? 
  // For now draw all, but using simple rects.
  // Better approach: Create an offscreen ImageBitmap for the grid, then drawImage with transform.
  // But to support dynamic updates, we'll draw cells.
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = grid[r][c]
      if (val === null) continue
      
      const wx = min_x + c * cellW_m
      const wy = max_y - r * cellH_m // Top-left of cell in world
      
      const p1 = worldToScreen(wx, wy)
      const p2 = worldToScreen(wx + cellW_m, wy - cellH_m)
      
      const w = p2.x - p1.x
      const h = p2.y - p1.y // h will be positive
      
      // Cull invisible
      if (p1.x > bgCanvas.value.width || p2.x < 0 || p1.y > bgCanvas.value.height || p2.y < 0) continue
      
      const color = layers.gradedBands
        ? getDiscreteColor(val, thresholds, gradeColors)
        : getColor(val, minVal, maxVal)
      ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`
      // +1 to fix gaps
      ctx.fillRect(Math.floor(p1.x), Math.floor(p1.y), Math.ceil(w)+1, Math.ceil(h)+1)
    }
  }
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
  
  // Center (Shifted right by 120px to account for sidebar)
  const midX = (min_x + max_x) / 2
  const midY = (min_y + max_y) / 2
  
  viewport.x = (screenW / 2 + 120) - (midX - min_x) * scale
  viewport.y = (screenH / 2) - (max_y - midY) * scale 
}

const handleMouseDown = (e) => {
  viewport.isDragging = true
  viewport.lastX = e.clientX
  viewport.lastY = e.clientY
  viewport.startX = e.clientX // Record start for click detection
  viewport.startY = e.clientY
}

const handleMouseMove = (e) => {
  // Tooltip
  const rect = stageContainer.value.getBoundingClientRect()
  const sx = e.clientX - rect.left
  const sy = e.clientY - rect.top
  hoverPos.value = { x: sx, y: sy }
  
  const wPos = screenToWorld(sx, sy)
  
  // Find grid val
  if (globalGrid.value) {
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
  
  requestAnimationFrame(renderAll)
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
  requestAnimationFrame(renderAll)
}

// Animation loop reference
const animationLoopRef = ref(null)

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

// Cleanup on unmount
onUnmounted(() => {
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
})

// --- Lifecycle ---
onMounted(() => {
  loadSeams()
  
  const stage = stageContainer.value
  stage.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
  stage.addEventListener('wheel', handleWheel, { passive: false })
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
  requestAnimationFrame(renderAll)
}

const zoomOut = () => {
  viewport.scale = Math.max(0.1, viewport.scale / 1.15)
  requestAnimationFrame(renderAll)
}

const resetView = () => {
  viewport.scale = 1
  viewport.x = 0
  viewport.y = 0
  requestAnimationFrame(renderAll)
}
</script>

<style scoped>
.mpi-pro-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(1200px 800px at 20% 10%, rgba(136, 146, 168, 0.08), transparent 55%),
              radial-gradient(1200px 800px at 80% 90%, rgba(90, 99, 120, 0.06), transparent 55%),
              #f5f6f8;
  overflow: hidden;
  color: var(--text-primary);
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, -apple-system, "Segoe UI", sans-serif;
  z-index: 200;
}
.mpi-pro-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(245, 246, 248, 0.8));
  pointer-events: none;
  z-index: 0;
}

.back-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}
.back-btn:hover {
  background: var(--color-primary);
  color: #fff;
}
.back-btn svg { width: 24px; height: 24px; }

/* Stage */
.stage-container {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: crosshair;
  z-index: 1;
  background-image: linear-gradient(transparent 95%, rgba(136, 146, 168, 0.06) 96%),
                    linear-gradient(90deg, transparent 95%, rgba(136, 146, 168, 0.05) 96%);
  background-size: 40px 40px;
}

.layer-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.layer-bg { z-index: 1; }
.layer-dynamic { z-index: 2; }
.layer-overlay { z-index: 3; }

/* Loading */
.loading-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255, 255, 255, 0.9);
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.loading-spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
.loading-text {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: var(--spacing-md);
}
@keyframes spin { to { transform: rotate(360deg); } }

/* UI Panels */
.ui-panel {
  position: absolute;
  z-index: 10;
  padding: 16px;
  pointer-events: none;
}
.ui-panel > * {
  pointer-events: auto;
}

.top-left-panel { top: 12px; left: 240px; width: 360px; display: flex; flex-direction: column; gap: 14px; }
.top-right-panel { top: 12px; right: 12px; width: 320px; display: flex; flex-direction: column; gap: 14px; }
.bottom-panel { bottom: 20px; left: calc(50% + 120px); transform: translateX(-50%); width: 640px; }
.bottom-right-panel { bottom: 18px; right: 12px; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; }

/* Glass Panel Style - Academic Light */
.glass-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: 16px;
  box-shadow: var(--shadow-md);
}

/* Header */
.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}
.app-icon {
  width: 40px; height: 40px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-sm);
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow-sm);
}
.app-icon svg { width: 24px; height: 24px; stroke: #fff; }
.title-group h1 { font-size: 18px; font-weight: 600; margin: 0; color: var(--text-primary); }
.title-group .subtitle { font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px; }

.status-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}
.chip.on {
  background: var(--color-info-light);
  border-color: var(--color-info);
  color: var(--color-info);
}

/* Stats */
.stats-card { display: flex; flex-direction: column; gap: 12px; }
.stat-row { display: flex; justify-content: space-between; align-items: baseline; }
.stat-row .label { font-size: 13px; color: var(--text-tertiary); }
.stat-row .value { font-size: 16px; font-weight: 600; font-family: 'JetBrains Mono', monospace; color: var(--text-primary); }
.stat-row .value.safe { color: var(--color-success); }
.stat-row .value.danger { color: var(--color-error); }

/* Controls */
.control-group h3 { font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; margin: 0 0 12px 0; font-weight: 500; }
.control-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.select-input { background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 6px 10px; border-radius: var(--border-radius-sm); min-width: 140px; }
.range-input { flex: 1; margin: 0 10px; accent-color: var(--color-primary); }
.value-display { min-width: 44px; text-align: right; font-size: 12px; color: var(--text-secondary); }
.checkbox-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-primary); margin-bottom: 8px; cursor: pointer; }

/* Action Button */
.btn.primary {
  width: 100%;
  background: var(--gradient-primary);
  border: none;
  padding: 10px;
  border-radius: var(--border-radius-sm);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
}
.btn.primary:hover { background: var(--color-primary-hover); transform: translateY(-1px); }
.btn.primary .btn-sub { font-size: 11px; opacity: 0.8; }
.btn.ghost {
  width: 100%;
  margin-top: 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 8px;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  cursor: pointer;
}
.btn.ghost:hover { background: var(--bg-tertiary); color: var(--color-primary); }

/* Simulation Bar */
.simulation-controls { display: flex; align-items: center; gap: 16px; }
.btn-icon { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all var(--transition-normal); }
.btn-icon:hover { background: var(--color-primary); color: #fff; }
.btn-icon:disabled { opacity: 0.4; cursor: not-allowed; }
.timeline-container { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.timeline-label { font-size: 10px; color: var(--text-tertiary); }
.timeline-slider { width: 100%; accent-color: var(--color-primary); }
.step-display { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-secondary); width: 100px; text-align: right; }
.workface-indicator { font-size: 10px; color: var(--text-tertiary); margin-top: 4px; }

/* Tooltip */
.hover-tooltip {
  position: fixed;
  background: rgba(44, 53, 69, 0.95);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  pointer-events: none;
  z-index: 100;
  transform: translate(10px, 10px);
}
.tooltip-val { color: #d0d5e0; font-weight: 600; font-size: 14px; }
.tooltip-xy { color: #aab0c0; font-size: 11px; margin-top: 2px; }

.legend-card { display: flex; flex-direction: column; gap: 8px; }
.legend-title { font-size: 12px; color: var(--text-secondary); font-weight: 500; }
.legend-bar {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #dc2626 0%, #fb923c 35%, #facc15 55%, #60a5fa 75%, #3b82f6 100%);
  border: 1px solid var(--border-color);
}
.legend-labels { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-tertiary); }
.legend-labels span { width: 33%; text-align: center; }
.legend-labels span:first-child { text-align: left; }
.legend-labels span:last-child { text-align: right; }
.sub-option { margin-left: 14px; opacity: 0.9; }

.legend-bands { display: flex; flex-direction: column; gap: 6px; }
.legend-band { display: flex; align-items: center; gap: 8px; }
.legend-swatch { width: 28px; height: 12px; border-radius: 3px; border: 1px solid var(--border-color); }
.legend-text { display: flex; flex-direction: column; line-height: 1.2; }
.legend-grade { font-size: 11px; color: var(--text-secondary); font-weight: 500; }
.legend-range { font-size: 10px; color: var(--text-tertiary); }

.tool-group { display: flex; gap: 8px; }
.tool-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 10px;
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-normal);
}
.tool-btn:hover { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }

.hint-card {
  font-size: 11px;
  color: var(--text-tertiary);
  background: var(--bg-primary);
  padding: 6px 10px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
}

@media (max-width: 1200px) {
  .top-left-panel { left: 16px; width: 320px; }
  .bottom-panel { width: 520px; left: 50%; }
}

@media (max-width: 900px) {
  .top-right-panel { width: 280px; }
  .bottom-panel { width: 420px; }
  .bottom-right-panel { right: 8px; }
}
</style>
