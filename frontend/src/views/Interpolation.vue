<template>
  <div class="dashboard">
    <!-- Compact Header -->
    <header class="dashboard-header">
      <div class="header-left">
        <div class="project-badge">
          <span class="project-icon">⚡</span>
          <div class="project-info">
            <h1 class="project-title">{{ selectedSeam?.name || '请选择煤层' }}</h1>
            <span class="project-subtitle">Mining Pressure Analysis</span>
          </div>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-label">Min</span>
          <span class="stat-value">{{ seamStats?.thickness_min?.toFixed(2) || seamStats?.thickness?.min?.toFixed(2) || '-' }}</span>
          <span class="stat-unit">m</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Max</span>
          <span class="stat-value">{{ seamStats?.thickness_max?.toFixed(2) || seamStats?.thickness?.max?.toFixed(2) || '-' }}</span>
          <span class="stat-unit">m</span>
        </div>
        <div class="stat-item primary">
          <span class="stat-label">Avg</span>
          <span class="stat-value">{{ seamStats?.thickness_mean?.toFixed(2) || seamStats?.thickness?.mean?.toFixed(2) || '-' }}</span>
          <span class="stat-unit">m</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Depth</span>
          <span class="stat-value">{{ seamStats?.burial_depth_mean?.toFixed(1) || seamStats?.burial_depth?.mean?.toFixed(1) || '-' }}</span>
          <span class="stat-unit">m</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Holes</span>
          <span class="stat-value">{{ seamStats?.borehole_count || seamPoints.length || '-' }}</span>
          <span class="stat-unit">n</span>
        </div>
      </div>
    </header>

    <!-- Main Dashboard -->
    <div v-if="selectedSeam" class="dashboard-main">
      <!-- Left Sidebar: Controls + Histogram -->
      <aside class="sidebar-left">
        <div class="sidebar-section">
          <h3 class="section-title">插值参数</h3>

          <!-- Method Selection - Segmented Control -->
          <div class="control-group">
            <label class="control-label">插值方法</label>
            <div class="segmented-control">
              <button
                v-for="opt in methodOptions"
                :key="opt.key"
                :class="['segment-btn', { active: method === opt.key }]"
                @click="method = opt.key"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Grid Size Slider -->
          <div class="control-group">
            <div class="slider-header">
              <label class="control-label">网格密度</label>
              <span class="slider-value">{{ gridSize }}</span>
            </div>
            <input
              v-model.number="gridSize"
              type="range"
              min="30"
              max="150"
              step="10"
              class="slider"
            >
            <div class="slider-labels">
              <span>粗</span>
              <span>细</span>
            </div>
          </div>

          <!-- Contour Levels Slider -->
          <div class="control-group">
            <div class="slider-header">
              <label class="control-label">等值线级别</label>
              <span class="slider-value">{{ contourLevels }}</span>
            </div>
            <input
              v-model.number="contourLevels"
              type="range"
              min="5"
              max="20"
              step="1"
              class="slider"
            >
            <div class="slider-labels">
              <span>少</span>
              <span>多</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="action-buttons">
            <button class="btn primary" @click="handleInterpolate" :disabled="loading">
              <span v-if="loading" class="spinner sm"></span>
              {{ loading ? '计算中...' : '生成等值线图' }}
            </button>
          </div>
        </div>

        <!-- Data Histogram -->
        <div class="sidebar-section">
          <h3 class="section-title">数据分布</h3>
          <div v-if="seamPoints.length > 0" class="histogram-container">
            <canvas ref="histogramCanvas" class="histogram-canvas"></canvas>
          </div>
          <div v-else class="empty-hint">
            选择煤层后显示数据分布
          </div>
        </div>

        <!-- Uncertainty Map Toggle -->
        <div class="sidebar-section" v-if="thicknessResult">
          <h3 class="section-title">视图模式</h3>
          <div class="toggle-group">
            <label class="toggle-btn">
              <input type="radio" v-model="viewMode" value="contour">
              <span>等值线图</span>
            </label>
            <label class="toggle-btn">
              <input type="radio" v-model="viewMode" value="uncertainty">
              <span>不确定性</span>
            </label>
          </div>
        </div>

        <!-- Cross-section Mode Toggle -->
        <div class="sidebar-section" v-if="thicknessResult && viewMode === 'contour'">
          <h3 class="section-title">剖面工具</h3>
          <div class="toggle-group">
            <label class="toggle-btn">
              <input type="checkbox" v-model="crossSectionMode">
              <span>绘制剖面线</span>
            </label>
          </div>
          <div v-if="crossSectionMode" class="hint-text">
            在地图上点击两点绘制剖面线 A-A'
          </div>
        </div>
      </aside>

      <!-- Center Stage: Visualization -->
      <main class="center-stage">
        <!-- Contour Maps View -->
        <div v-if="viewMode === 'contour'" class="contour-view">
          <!-- Maps Container -->
          <div class="maps-container">
            <!-- Thickness Map -->
            <div class="map-card">
              <div class="map-header">
                <h3 class="map-title">煤层厚度分布</h3>
                <span class="map-method">{{ methodName(method) }}</span>
                <span class="map-range" v-if="thicknessResult">
                  {{ thicknessResult.valueRange?.min?.toFixed(1) }} - {{ thicknessResult.valueRange?.max?.toFixed(1) }} m
                </span>
              </div>

              <div class="map-container" :class="{ loading: loading && !thicknessResult }">
                <ContourMap
                  v-if="thicknessResult"
                  :image-url="thicknessResult.imageUrl"
                  :boreholes="seamPoints"
                  :bounds="thicknessResult.bounds"
                  property="thickness"
                  property-label="厚度"
                  :value-range="thicknessResult.valueRange"
                  colormap="YlOrBr"
                  :cross-section-mode="crossSectionMode"
                  @cross-section-complete="handleCrossSectionComplete"
                />
                <div v-else class="map-placeholder">
                  <span class="placeholder-icon">📏</span>
                  <p>设置参数后点击"生成等值线图"</p>
                </div>
              </div>
            </div>

            <!-- Depth Map -->
            <div class="map-card">
              <div class="map-header">
                <h3 class="map-title">煤层埋深分布</h3>
                <span class="map-method">{{ methodName(method) }}</span>
                <span class="map-range" v-if="depthResult">
                  {{ depthResult.valueRange?.min?.toFixed(1) }} - {{ depthResult.valueRange?.max?.toFixed(1) }} m
                </span>
              </div>

              <div class="map-container" :class="{ loading: loading && !depthResult }">
                <ContourMap
                  v-if="depthResult"
                  :image-url="depthResult.imageUrl"
                  :boreholes="seamPoints"
                  :bounds="depthResult.bounds"
                  property="burial_depth"
                  property-label="埋深"
                  :value-range="depthResult.valueRange"
                  colormap="viridis"
                  :cross-section-mode="crossSectionMode"
                  @cross-section-complete="handleCrossSectionComplete"
                />
                <div v-else class="map-placeholder">
                  <span class="placeholder-icon">⬇️</span>
                  <p>设置参数后点击"生成等值线图"</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Cross-Section Profile -->
          <div class="cross-section-container">
            <div class="section-header">
              <h3 class="section-title">
                <span class="section-icon">📐</span>
                剖面切片 (A-A')
                <span v-if="crossSectionData.distance" class="section-distance">
                  {{ crossSectionData.distance.toFixed(0) }}m
                </span>
              </h3>
              <div class="section-controls">
                <button class="btn-sm" @click="resetCrossSection">重置</button>
              </div>
            </div>
            <div class="cross-section-view">
              <canvas
                ref="crossSectionCanvas"
                class="cross-section-canvas"
              ></canvas>
              <div v-if="!crossSectionData.hasData && !crossSectionData.distance" class="cross-section-placeholder">
                <span class="placeholder-icon">📐</span>
                <p>开启"绘制剖面线"模式，在地图上点击两点绘制剖面</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Uncertainty View -->
        <div v-else class="uncertainty-view">
          <div class="map-card uncertainty-map-card">
            <div class="map-header">
              <h3 class="map-title">插值不确定性分布</h3>
              <span class="map-method">Interpolation Uncertainty Map</span>
            </div>

            <div class="map-container uncertainty-map-container">
              <canvas
                ref="uncertaintyCanvas"
                class="uncertainty-canvas"
              ></canvas>
            </div>
          </div>
        </div>
      </main>

      <!-- Right Sidebar: Geological Context -->
      <aside class="sidebar-right">
        <div class="sidebar-section">
          <h3 class="section-title">地层柱状图</h3>
          <div class="stratigraphic-container">
            <canvas
              ref="stratigraphicCanvas"
              class="stratigraphic-canvas"
            ></canvas>
          </div>

          <!-- Legend -->
          <div class="lithology-legend">
            <div
              v-for="(color, name) in lithologyColors"
              :key="name"
              class="legend-item"
            >
              <div class="legend-color" :style="{ background: color }"></div>
              <span class="legend-name">{{ name }}</span>
            </div>
          </div>
        </div>

        <!-- Layer Details Table -->
        <div class="sidebar-section">
          <h3 class="section-title">岩层详情</h3>
          <div class="layer-table">
            <div class="table-header">
              <span>岩性</span>
              <span>厚度</span>
            </div>
            <div class="table-body">
              <div
                v-for="(layer, i) in sortedLayers"
                :key="i"
                class="table-row"
              >
                <span class="layer-name">{{ layer.name }}</span>
                <span class="layer-value">{{ layer.thickness?.toFixed(2) }} m</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Seam Selection (shown when no seam selected) -->
    <div v-else class="seam-selection-view">
      <h2 class="selection-title">选择分析煤层</h2>
      <p class="selection-subtitle">从以下可用煤层中选择一个进行插值分析</p>

      <div class="seam-grid">
        <div
          v-for="seam in availableSeams"
          :key="seam.name"
          class="seam-card"
          @click="selectSeam(seam)"
        >
          <div class="seam-card-header">
            <div class="seam-title-group">
              <span class="seam-icon">📊</span>
              <span class="seam-name">{{ seam.name }}</span>
            </div>
            <span class="seam-count">{{ seam.borehole_count }}个钻孔</span>
          </div>
          <div class="seam-card-stats">
            <div class="seam-stat">
              <span class="stat-label">平均厚度</span>
              <span class="stat-value">{{ seam.avg_thickness?.toFixed(2) }} m</span>
            </div>
            <div class="seam-stat">
              <span class="stat-label">厚度范围</span>
              <span class="stat-value">{{ seam.thickness_range?.min?.toFixed(1) }}-{{ seam.thickness_range?.max?.toFixed(1) }} m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useToast } from '../composables/useToast'
import ContourMap from '../components/ContourMap.vue'
import { getCoalSeams, getSeamStats, getSeamContourImages } from '../api'

const toast = useToast()

// State
const loadingSeams = ref(false)
const seamError = ref(null)
const loading = ref(false)
const availableSeams = ref([])
const selectedSeam = ref(null)
const seamStats = ref(null)
const seamPoints = ref([])
const sortedLayers = ref([])
const method = ref('idw')
const gridSize = ref(80)
const contourLevels = ref(10)
const thicknessResult = ref(null)
const depthResult = ref(null)
const viewMode = ref('contour')
const crossSectionMode = ref(false)

// Cross section
const crossSectionData = ref({ line: null, points: [], depthProfile: [], distance: null, hasData: false })
const uncertaintyData = ref(null)

// Canvas refs
const histogramCanvas = ref(null)
const crossSectionCanvas = ref(null)
const stratigraphicCanvas = ref(null)
const uncertaintyCanvas = ref(null)

// Options
const methodOptions = [
  { key: 'idw', label: 'IDW' },
  { key: 'linear', label: 'Linear' },
  { key: 'nearest', label: 'Nearest' }
]

// Lithology colors (Nature style - matching Python script)
const lithologyColors = {
  '细砂岩': '#FCEBB6',      // Sandstone - light yellow
  '粉砂岩': '#E0FFFF',      // Siltstone - light cyan
  '泥岩': '#D3D3D3',       // Mudstone - gray
  '中砂岩': '#FCEBB6',      // Sandstone - light yellow
  '粗砂岩': '#F5DEB3',      // Coarse sandstone - wheat
  '砾岩': '#DEB887',       // Conglomerate - brown
  '炭质泥岩': '#8B8B8B',    // Carbonaceous mudstone - dark gray
  '砂质泥岩': '#D8D8D8',    // Sandy mudstone
  '泥质砂岩': '#E8E8E8',    // Muddy sandstone
  '石灰岩': '#B0E0E6',      // Limestone - light blue
  '煤': '#2F4F4F'          // Coal - dark gray
}

// Lithology styles (Nature style - matching Python script)
const lithologyStyles = {
  '细砂岩': { facecolor: '#FCEBB6', hatch: '...', edgecolor: '#999999' },  // Sandstone: yellow + dots
  '粉砂岩': { facecolor: '#E0FFFF', hatch: '...', edgecolor: '#AAAAAA' },  // Siltstone: light cyan + dots
  '泥岩': { facecolor: '#D3D3D3', hatch: '---', edgecolor: '#666666' },   // Mudstone: gray + h-lines
  '中砂岩': { facecolor: '#FCEBB6', hatch: '...', edgecolor: '#999999' },  // Sandstone
  '粗砂岩': { facecolor: '#F5DEB3', hatch: '...', edgecolor: '#999999' },  // Coarse sandstone: wheat + dots
  '砾岩': { facecolor: '#DEB887', hatch: 'ooo', edgecolor: '#8B4513' },    // Conglomerate: brown + circles
  '炭质泥岩': { facecolor: '#8B8B8B', hatch: '---', edgecolor: '#444444' },  // Carbonaceous mudstone
  '砂质泥岩': { facecolor: '#D8D8D8', hatch: '-..', edgecolor: '#777777' },  // Sandy mudstone
  '泥质砂岩': { facecolor: '#E8E8E8', hatch: '.-.', edgecolor: '#888888' },  // Muddy sandstone
  '石灰岩': { facecolor: '#B0E0E6', hatch: '+++', edgecolor: '#5F9EA0' },  // Limestone: light blue + cross
  '煤': { facecolor: '#2F4F4F', hatch: '', edgecolor: '#1a1a1a' }          // Coal: dark gray, solid
}

const methodName = (key) => {
  const names = { idw: 'IDW', linear: 'Linear', nearest: 'Nearest' }
  return names[key] || key
}

// Load seams
const loadSeams = async () => {
  loadingSeams.value = true
  try {
    const { data } = await getCoalSeams()
    availableSeams.value = data.seams || []
  } catch (err) {
    seamError.value = '加载煤层失败'
  } finally {
    loadingSeams.value = false
  }
}

// Select seam
const selectSeam = async (seam) => {
  selectedSeam.value = seam
  thicknessResult.value = null
  depthResult.value = null

  try {
    const { data } = await getSeamStats(seam.name)
    seamStats.value = data
    seamPoints.value = data.points || []

    // Extract layers for stratigraphic column
    sortedLayers.value = data.layers?.sort((a, b) => (b.z_top || 0) - (a.z_top || 0)) || []

    // Auto-run interpolation
    await handleInterpolate()

    // Draw histogram and stratigraphic column
    await nextTick()
    drawHistogram()
    drawStratigraphicColumn()
  } catch (err) {
    toast.add('加载煤层详情失败: ' + (err.response?.data?.detail || err.message), 'error')
  }
}

// Interpolate
const handleInterpolate = async () => {
  if (!selectedSeam.value) return

  loading.value = true
  try {
    const { data } = await getSeamContourImages(
      selectedSeam.value.name,
      method.value,
      gridSize.value,
      contourLevels.value
    )

    seamPoints.value = data.boreholes || []

    thicknessResult.value = {
      imageUrl: `data:image/png;base64,${data.thickness.image}`,
      valueRange: data.thickness.value_range,
      bounds: data.bounds
    }

    depthResult.value = {
      imageUrl: `data:image/png;base64,${data.depth.image}`,
      valueRange: data.depth.value_range,
      bounds: data.bounds
    }

    // Calculate uncertainty map
    calculateUncertainty()

    toast.add('等值线图生成完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '生成等值线图失败', 'error')
  } finally {
    loading.value = false
  }
}

// Calculate uncertainty map - matching 误差分布图绘制.py style
const calculateUncertainty = () => {
  if (!seamPoints.value.length || !thicknessResult.value) return

  const canvas = uncertaintyCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const w = canvas.width = 900
  const h = canvas.height = 550

  const bounds = thicknessResult.value.bounds
  const points = seamPoints.value.map(p => ({ x: p.x, y: p.y }))

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  // Draw area dimensions (matching Python script style)
  const padding = { left: 20, right: 35, top: 20, bottom: 60 }
  const drawW = w - padding.left - padding.right - 50  // Extra space for colorbar
  const drawH = h - padding.top - padding.bottom

  // Calculate uncertainty map with Gaussian smoothing
  const resolution = 150
  const uncertaintyMap = []

  // First pass: calculate raw distances
  const maxDist = 500  // meters
  for (let py = 0; py < resolution; py++) {
    uncertaintyMap[py] = []
    for (let px = 0; px < resolution; px++) {
      const worldX = bounds.min_x + (px / resolution) * (bounds.max_x - bounds.min_x)
      const worldY = bounds.max_y - (py / resolution) * (bounds.max_y - bounds.min_y)

      // Find minimum distance to any borehole
      let minDist = Infinity
      for (const p of points) {
        const dist = Math.sqrt((worldX - p.x)**2 + (worldY - p.y)**2)
        if (dist < minDist) minDist = dist
      }

      // Normalize to 0-1.6 (matching Python script)
      uncertaintyMap[py][px] = Math.min(1.6, (minDist / maxDist) * 1.6)
    }
  }

  // Second pass: apply Gaussian smoothing (simplified)
  const smoothedMap = []
  const sigma = 3
  for (let py = 0; py < resolution; py++) {
    smoothedMap[py] = []
    for (let px = 0; px < resolution; px++) {
      let sum = 0
      let weightSum = 0
      for (let dy = -sigma; dy <= sigma; dy++) {
        for (let dx = -sigma; dx <= sigma; dx++) {
          const ny = py + dy
          const nx = px + dx
          if (ny >= 0 && ny < resolution && nx >= 0 && nx < resolution) {
            const dist = Math.sqrt(dx*dx + dy*dy)
            const weight = Math.exp(-(dist*dist) / (2*sigma*sigma))
            sum += uncertaintyMap[ny][nx] * weight
            weightSum += weight
          }
        }
      }
      smoothedMap[py][px] = sum / weightSum
    }
  }

  // RdYlBu_r colormap function (Red=high uncertainty, Blue=low)
  const rdylbu_r = (value) => {
    // value from 0 to 1.5
    const normalized = Math.min(1.5, Math.max(0, value)) / 1.5
    // RdYlBu_r: Red (1.0) -> Yellow (0.5) -> Blue (0.0)
    if (normalized < 0.5) {
      // Blue to Yellow (0.0-0.5)
      const t = normalized * 2
      return {
        r: Math.floor(49 + (255 - 49) * t),
        g: Math.floor(130 + (255 - 130) * t),
        b: Math.floor(189 + (0 - 189) * t)
      }
    } else {
      // Yellow to Red (0.5-1.0)
      const t = (normalized - 0.5) * 2
      return {
        r: Math.floor(255 + (215 - 255) * t),
        g: Math.floor(255 + (48 - 255) * t),
        b: Math.floor(0 + (48 - 0) * t)
      }
    }
  }

  // Draw heatmap
  const cellW = drawW / resolution
  const cellH = drawH / resolution

  for (let py = 0; py < resolution; py++) {
    for (let px = 0; px < resolution; px++) {
      const value = smoothedMap[py][px]
      const color = rdylbu_r(value)
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
      ctx.fillRect(
        padding.left + px * cellW,
        padding.top + (resolution - 1 - py) * cellH,
        cellW + 1,
        cellH + 1
      )
    }
  }

  // Draw borehole points (black circles, matching Python script)
  const boreholeRadius = 6
  for (const p of points) {
    const px = padding.left + ((p.x - bounds.min_x) / (bounds.max_x - bounds.min_x)) * drawW
    const py = padding.top + ((bounds.max_y - p.y) / (bounds.max_y - bounds.min_y)) * drawH

    ctx.beginPath()
    ctx.arc(px, py, boreholeRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#000000'
    ctx.fill()
  }

  // Draw bold border (matching Python script: linewidth=2.0)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2.0
  ctx.strokeRect(padding.left, padding.top, drawW, drawH)

  // Custom legend box (bottom-left, matching Python script)
  const legendBoxX = padding.left + 20
  const legendBoxY = padding.top + drawH - 80
  const legendBoxW = 120
  const legendBoxH = 50

  // White background box with black border
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1.5
  ctx.fillRect(legendBoxX, legendBoxY, legendBoxW, legendBoxH)
  ctx.strokeRect(legendBoxX, legendBoxY, legendBoxW, legendBoxH)

  // High uncertainty color patch (red)
  ctx.fillStyle = '#d73027'
  ctx.fillRect(legendBoxX + 10, legendBoxY + 28, 15, 15)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1
  ctx.strokeRect(legendBoxX + 10, legendBoxY + 28, 15, 15)

  // Legend text
  ctx.fillStyle = '#000000'
  ctx.font = '12px Arial, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('High Uncertainty', legendBoxX + 32, legendBoxY + 40)

  // Borehole location dot
  ctx.beginPath()
  ctx.arc(legendBoxX + 17, legendBoxY + 18, boreholeRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#000000'
  ctx.fill()

  ctx.fillText('Borehole Locations', legendBoxX + 32, legendBoxY + 22)

  // Custom scale bar (bottom-right, matching Python script)
  const scaleBoxX = padding.left + drawW - 150
  const scaleBoxY = legendBoxY
  const scaleBoxW = 130
  const scaleBoxH = 35

  // White background box
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1.5
  ctx.fillRect(scaleBoxX, scaleBoxY, scaleBoxW, scaleBoxH)
  ctx.strokeRect(scaleBoxX, scaleBoxY, scaleBoxW, scaleBoxH)

  // Scale labels
  ctx.fillStyle = '#000000'
  ctx.font = '12px Arial, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('0', scaleBoxX + 10, scaleBoxY + 22)
  ctx.textAlign = 'center'
  ctx.fillText('500', scaleBoxX + 75, scaleBoxY + 22)
  ctx.textAlign = 'right'
  ctx.fillText('1000 m', scaleBoxX + 120, scaleBoxY + 22)

  // Scale line
  const lineY = scaleBoxY + 12
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(scaleBoxX + 10, lineY)
  ctx.lineTo(scaleBoxX + 120, lineY)
  ctx.stroke()

  // Bold part (0-500)
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(scaleBoxX + 10, lineY)
  ctx.lineTo(scaleBoxX + 75, lineY)
  ctx.stroke()

  // Draw colorbar (right side, matching Python script)
  const colorbarX = padding.left + drawW + 20
  const colorbarY = padding.top
  const colorbarW = 20
  const colorbarH = drawH

  // Colorbar gradient
  for (let i = 0; i < colorbarH; i++) {
    const value = (1 - i / colorbarH) * 1.5
    const color = rdylbu_r(value)
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
    ctx.fillRect(colorbarX, colorbarY + i, colorbarW, 1)
  }

  // Colorbar border
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1.5
  ctx.strokeRect(colorbarX, colorbarY, colorbarW, colorbarH)

  // Colorbar ticks and labels
  ctx.fillStyle = '#000000'
  ctx.font = '11px Arial, sans-serif'
  ctx.textAlign = 'left'

  const ticks = [0, 0.5, 1.0, 1.5]
  const tickLabels = ['0', '0.5', '1.0', '1.5+']

  ticks.forEach((tick, i) => {
    const y = colorbarY + colorbarH - (tick / 1.5) * colorbarH
    // Tick mark
    ctx.beginPath()
    ctx.moveTo(colorbarX + colorbarW, y)
    ctx.lineTo(colorbarX + colorbarW + 4, y)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.stroke()
    // Label
    ctx.fillText(tickLabels[i], colorbarX + colorbarW + 8, y + 4)
  })

  // Colorbar label (rotated)
  ctx.save()
  ctx.translate(colorbarX + colorbarW + 35, colorbarY + colorbarH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.font = '12px Arial, sans-serif'
  ctx.fillText('Variance (normalized)', 0, 0)
  ctx.restore()

  // Title (matching Python script style)
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 14px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Interpolation Uncertainty Map', padding.left + drawW / 2, h - 28)

  ctx.font = '11px Arial, sans-serif'
  ctx.fillText('Red zones indicate higher uncertainty; blue zones are more reliable.', padding.left + drawW / 2, h - 12)
}

// Draw histogram - Nature style
const drawHistogram = () => {
  const canvas = histogramCanvas.value
  if (!canvas || seamPoints.value.length === 0) return

  const ctx = canvas.getContext('2d')
  const w = canvas.width = 320
  const h = canvas.height = 280

  const values = seamPoints.value.map(p => p.thickness).filter(v => v != null)
  if (values.length === 0) return

  // Calculate statistics
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
  const stdDev = Math.sqrt(variance)

  const numBins = 20
  const binWidthVal = (maxVal - minVal) / numBins

  // Calculate histogram
  const bins = Array(numBins).fill(0)
  for (const v of values) {
    const bin = Math.min(Math.floor((v - minVal) / binWidthVal), numBins - 1)
    bins[bin]++
  }

  const maxCount = Math.max(...bins)

  // Nature style colors (matching Python script) - Light theme
  const barColor = '#607c8e'      // Slate gray-blue
  const edgeColor = '#1a1a1a'     // Near black
  const errorColor = '#333333'    // Dark gray for error bars

  // Draw background - Light theme
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, w, h)

  const padding = { left: 45, right: 20, top: 30, bottom: 35 }
  const drawW = w - padding.left - padding.right
  const drawH = h - padding.top - padding.bottom
  const barWidth = drawW / numBins
  const scaleY = drawH / (maxCount * 1.15) // Leave 15% space at top

  // Draw axes (Nature style: ticks pointing inward)
  ctx.strokeStyle = '#E2E8F0'
  ctx.lineWidth = 1.0

  // Y-axis
  ctx.beginPath()
  ctx.moveTo(padding.left, padding.top)
  ctx.lineTo(padding.left, h - padding.bottom)
  ctx.stroke()

  // X-axis
  ctx.beginPath()
  ctx.moveTo(padding.left, h - padding.bottom)
  ctx.lineTo(w - padding.right, h - padding.bottom)
  ctx.stroke()

  // Draw ticks (pointing inward)
  const tickSize = 4
  ctx.strokeStyle = '#CBD5E1'
  ctx.lineWidth = 1.0

  // X-axis ticks
  for (let i = 0; i <= 5; i++) {
    const x = padding.left + (i / 5) * drawW
    ctx.beginPath()
    ctx.moveTo(x, h - padding.bottom)
    ctx.lineTo(x, h - padding.bottom + tickSize)
    ctx.stroke()
  }

  // Y-axis ticks
  for (let i = 0; i <= 4; i++) {
    const y = h - padding.bottom - (i / 4) * drawH
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(padding.left - tickSize, y)
    ctx.stroke()
  }

  // Draw bars with Nature style
  for (let i = 0; i < numBins; i++) {
    const height = bins[i] * scaleY
    const x = padding.left + i * barWidth
    const y = h - padding.bottom - height

    // Bar fill (alpha 0.85 like Python script)
    ctx.fillStyle = barColor
    ctx.globalAlpha = 0.85
    ctx.fillRect(x + 1, y, barWidth - 2, height)
    ctx.globalAlpha = 1.0

    // Black edge (linewidth 0.8)
    ctx.strokeStyle = edgeColor
    ctx.lineWidth = 0.8
    ctx.strokeRect(x + 1, y, barWidth - 2, height)

    // Error bars (Poisson error: sqrt(N))
    const error = Math.sqrt(bins[i])
    const errorHeight = error * scaleY

    if (errorHeight > 2) {
      ctx.strokeStyle = errorColor
      ctx.lineWidth = 1.0
      ctx.beginPath()
      // Vertical line
      ctx.moveTo(x + barWidth / 2, y - errorHeight)
      ctx.lineTo(x + barWidth / 2, y)
      // Top cap
      ctx.moveTo(x + barWidth / 2 - 3, y - errorHeight)
      ctx.lineTo(x + barWidth / 2 + 3, y - errorHeight)
      ctx.stroke()
    }
  }

  // X-axis labels
  ctx.fillStyle = '#64748B'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  for (let i = 0; i <= 5; i++) {
    const val = minVal + (i / 5) * (maxVal - minVal)
    const x = padding.left + (i / 5) * drawW
    ctx.fillText(val.toFixed(1), x, h - padding.bottom + 15)
  }

  // Y-axis labels
  ctx.textAlign = 'right'
  for (let i = 0; i <= 4; i++) {
    const count = Math.round((i / 4) * maxCount)
    const y = h - padding.bottom - (i / 4) * drawH
    ctx.fillText(count.toString(), padding.left - 8, y + 3)
  }

  // Axis titles (Nature style: normal weight, no bold)
  ctx.fillStyle = '#475569'
  ctx.font = '12px sans-serif'

  // X-axis title
  ctx.textAlign = 'center'
  ctx.fillText('Thickness (m)', padding.left + drawW / 2, h - 8)

  // Y-axis title (rotated)
  ctx.save()
  ctx.translate(12, padding.top + drawH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('Frequency', 0, 0)
  ctx.restore()

  // Statistics text box (top right, Nature style)
  const statsLines = [
    `Total n = ${values.length}`,
    `Mean = ${mean.toFixed(2)} m`,
    `Std = ${stdDev.toFixed(2)} m`
  ]

  const boxWidth = 110
  const boxHeight = 50
  const boxX = w - padding.right - boxWidth
  const boxY = padding.top

  // Light background box with rounded corners and border
  ctx.fillStyle = '#F8FAFC'
  ctx.strokeStyle = '#E2E8F0'
  ctx.lineWidth = 1
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 4)
  ctx.fill()
  ctx.stroke()

  // Statistics text
  ctx.fillStyle = '#1a1a1a'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'left'
  statsLines.forEach((line, i) => {
    ctx.fillText(line, boxX + 8, boxY + 15 + i * 13)
  })

  // Figure label (Nature style: bottom left)
  ctx.fillStyle = '#94A3B8'
  ctx.font = '10px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Fig. 1 | Thickness distribution', padding.left, h - 5)
}

// Helper function to draw rounded rectangle
const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// Draw stratigraphic column - Nature style (Light theme)
const drawStratigraphicColumn = () => {
  const canvas = stratigraphicCanvas.value
  if (!canvas || sortedLayers.value.length === 0) return

  const ctx = canvas.getContext('2d')
  const w = canvas.width = 280
  const h = canvas.height = 500

  // Background - Light theme
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, w, h)

  const layers = sortedLayers.value
  const totalDepth = Math.max(...layers.map(l => l.z_bottom || 0))
  const scale = (h - 55) / totalDepth
  const topMargin = 30
  const columnX = 25
  const columnWidth = 50
  const labelX = columnX + columnWidth + 12

  // Draw title (Nature style - Light theme)
  ctx.fillStyle = '#0F172A'
  ctx.font = 'bold 12px Arial, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Lithology', columnX, 18)

  // Draw depth scale (Nature style: ticks pointing inward)
  const tickSize = 4
  const depthStep = Math.ceil(totalDepth / 6 / 5) * 5 || 10

  ctx.strokeStyle = '#E2E8F0'
  ctx.lineWidth = 1.0
  ctx.fillStyle = '#64748B'
  ctx.font = '10px Arial, sans-serif'
  ctx.textAlign = 'right'

  // Y-axis line
  ctx.beginPath()
  ctx.moveTo(columnX - 8, topMargin)
  ctx.lineTo(columnX - 8, h - 25)
  ctx.stroke()

  for (let depth = 0; depth <= totalDepth; depth += depthStep) {
    const y = topMargin + depth * scale

    // Tick pointing right (inward)
    ctx.beginPath()
    ctx.moveTo(columnX - 8, y)
    ctx.lineTo(columnX - 8 + tickSize, y)
    ctx.stroke()

    // Depth label
    ctx.fillText(`${depth}m`, columnX - 12, y + 3)
  }

  // Draw layers with Nature-style patterns
  layers.forEach((layer, i) => {
    const yTop = topMargin + (layer.z_top || 0) * scale
    const thickness = layer.thickness || 0
    const layerHeight = Math.max(thickness * scale, 3)

    // Get lithology style (fallback to gray)
    const style = lithologyStyles[layer.name] || {
      facecolor: '#D3D3D3',
      hatch: '---',
      edgecolor: '#666666'
    }

    // Layer rectangle with base color
    ctx.fillStyle = style.facecolor
    ctx.fillRect(columnX, yTop, columnWidth, layerHeight)

    // Draw hatch pattern
    if (layerHeight > 6 && style.hatch) {
      drawNatureHatchPattern(ctx, style.hatch, columnX, yTop, columnWidth, layerHeight, style.edgecolor)
    }

    // Black edge (linewidth 0.5 like Python script)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 0.5
    ctx.strokeRect(columnX, yTop, columnWidth, layerHeight)

    // Layer info on the right (compact Nature style - Light theme)
    if (layerHeight > 10) {
      // Lithology name
      ctx.fillStyle = '#475569'
      ctx.font = '10px Arial, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(layer.name, labelX, yTop + layerHeight / 2 + 3)

      // Thickness value (smaller, monospace)
      ctx.fillStyle = '#2563EB'
      ctx.font = '9px SF Mono, monospace'
      ctx.fillText(`${thickness.toFixed(1)}m`, labelX, yTop + layerHeight / 2 + 14)
    }
  })

  // Column border (Nature style)
  ctx.strokeStyle = '#94A3B8'
  ctx.lineWidth = 1.0
  ctx.strokeRect(columnX, topMargin, columnWidth, h - topMargin - 25)
}

// Draw Nature-style hatch patterns (matching Python matplotlib hatches)
const drawNatureHatchPattern = (ctx, hatch, x, y, w, h, edgeColor) => {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()

  ctx.strokeStyle = edgeColor
  ctx.globalAlpha = 0.4
  ctx.lineWidth = 0.5

  const spacing = 6

  switch (hatch) {
    case '...': // Dots
    case 'ooo': // Circles
      ctx.fillStyle = edgeColor
      ctx.globalAlpha = 0.3
      for (let dx = spacing/2; dx < w; dx += spacing) {
        for (let dy = spacing/2; dy < h; dy += spacing) {
          ctx.beginPath()
          if (hatch === 'ooo') {
            // Larger circles for conglomerate
            ctx.arc(x + dx, y + dy, 2.5, 0, Math.PI * 2)
          } else {
            // Small dots
            ctx.arc(x + dx, y + dy, 1, 0, Math.PI * 2)
          }
          ctx.fill()
        }
      }
      break

    case '---': // Horizontal lines
      ctx.globalAlpha = 0.5
      for (let dy = 4; dy < h; dy += spacing) {
        ctx.beginPath()
        ctx.moveTo(x, y + dy)
        ctx.lineTo(x + w, y + dy)
        ctx.stroke()
      }
      break

    case '+++': // Cross/plus pattern
    case 'xx':  // Cross pattern
      ctx.globalAlpha = 0.3
      for (let dx = spacing/2; dx < w; dx += spacing) {
        for (let dy = spacing/2; dy < h; dy += spacing) {
          // Draw cross
          const size = 3
          ctx.beginPath()
          ctx.moveTo(x + dx - size, y + dy)
          ctx.lineTo(x + dx + size, y + dy)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x + dx, y + dy - size)
          ctx.lineTo(x + dx, y + dy + size)
          ctx.stroke()
        }
      }
      break

    case '-..': // Dash-dot pattern
    case '.-.': // Dot-dash pattern
      ctx.globalAlpha = 0.5
      for (let dy = spacing; dy < h; dy += spacing * 1.5) {
        ctx.beginPath()
        ctx.moveTo(x, y + dy)
        ctx.lineTo(x + w / 2, y + dy)
        ctx.stroke()
        // Dot
        ctx.fillStyle = edgeColor
        ctx.beginPath()
        ctx.arc(x + w * 0.75, y + dy, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
      break

    case '//':  // Diagonal lines
    case '\\\\':  // Reverse diagonal
      ctx.globalAlpha = 0.4
      for (let i = -h; i < w; i += spacing) {
        ctx.beginPath()
        ctx.moveTo(x + i, y)
        ctx.lineTo(x + i + h, y + h)
        ctx.stroke()
      }
      break
  }

  ctx.restore()
}

// Cross section handling
const handleMapClick = (event) => {
  // Not used anymore - cross-section drawing is handled in ContourMap component
}

const handleCrossSectionComplete = (data) => {
  crossSectionData.value = {
    line: { start: data.startCanvas, end: data.endCanvas },
    worldLine: { start: data.start, end: data.end },
    points: data.points || [],
    depthProfile: [],
    distance: data.distance,
    hasData: true
  }

  // Generate the cross-section profile
  generateCrossSectionProfile(data.start, data.end, data.distance)
}

const generateCrossSectionProfile = (start, end, distance) => {
  if (!seamPoints.value.length || distance === null) return

  const canvas = crossSectionCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const w = canvas.width = canvas.offsetWidth || 900
  const h = canvas.height = 300

  // Generate sample points along the cross-section line
  const numSamples = 100
  const dx = (end.x - start.x) / numSamples
  const dy = (end.y - start.y) / numSamples

  // Get burial depth from boreholes using IDW interpolation
  const profile = []

  for (let i = 0; i <= numSamples; i++) {
    const px = start.x + dx * i
    const py = start.y + dy * i

    // Find nearby boreholes and interpolate burial depth
    const depths = seamPoints.value
      .map(b => {
        const dist = Math.sqrt((px - b.x)**2 + (py - b.y)**2)
        return {
          depth: b.burial_depth,
          distance: dist
        }
      })
      .filter(b => b.depth != null && b.distance < 500) // Only use nearby boreholes

    if (depths.length > 0) {
      // IDW interpolation
      let sumWeights = 0
      let weightedDepth = 0
      for (const d of depths) {
        const weight = 1 / (d.distance + 1) ** 2
        weightedDepth += d.depth * weight
        sumWeights += weight
      }
      profile.push({
        distance: (i / numSamples) * distance,
        depth: weightedDepth / sumWeights
      })
    }
  }

  crossSectionData.value.depthProfile = profile

  // Draw the profile
  drawCrossSectionProfile(profile, distance, w, h)
}

const drawCrossSectionProfile = (profile, totalDistance, w, h) => {
  const canvas = crossSectionCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  // Clear canvas - Light theme
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, w, h)

  const padding = { left: 50, right: 30, top: 35, bottom: 40 }
  const drawW = w - padding.left - padding.right
  const drawH = h - padding.top - padding.bottom

  // Find depth range
  const depths = profile.map(p => p.depth)
  const minDepth = Math.min(...depths)
  const maxDepth = Math.max(...depths)
  const depthRange = maxDepth - minDepth || 1

  // Geological layer colors (matching Python script 地质剖面图绘制.py)
  const geoColors = {
    topSoil: '#8FBC8F',      // 草绿色/表土
    sandstone: '#F4A460',    // 砂岩黄
    shale: '#778899',        // 页岩灰
    coal: '#2F2F2F',         // 煤层黑 (重点)
    sandyShale: '#A9A9A9',   // 砂质页岩
    limestone: '#B0C4DE'     // 石灰岩蓝
  }

  // Draw geological background layers (simulated stratigraphy)
  // This creates a visual representation of geological layers
  const layerCount = 6
  const layerHeight = drawH / layerCount
  const layerColors = [geoColors.limestone, geoColors.sandyShale, geoColors.coal,
                       geoColors.shale, geoColors.sandstone, geoColors.topSoil]

  layerColors.forEach((color, i) => {
    const y = padding.top + i * layerHeight
    ctx.fillStyle = color
    ctx.globalAlpha = 0.08  // Subtle background effect
    ctx.fillRect(padding.left, y, drawW, layerHeight)
    ctx.globalAlpha = 1.0
  })

  // Draw grid (Nature style: subtle, light theme)
  ctx.strokeStyle = '#E2E8F0'
  ctx.lineWidth = 0.8

  // Vertical grid lines (distance)
  const numVerticalLines = 10
  for (let i = 0; i <= numVerticalLines; i++) {
    const x = padding.left + (i / numVerticalLines) * drawW
    ctx.beginPath()
    ctx.moveTo(x, padding.top)
    ctx.lineTo(x, h - padding.bottom)
    ctx.stroke()
  }

  // Horizontal grid lines (depth)
  const numHorizontalLines = 5
  for (let i = 0; i <= numHorizontalLines; i++) {
    const y = padding.top + (i / numHorizontalLines) * drawH
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(w - padding.right, y)
    ctx.stroke()
  }

  // Draw axes (Nature style: ticks pointing inward)
  ctx.strokeStyle = '#94A3B8'
  ctx.lineWidth = 1.0

  // Y-axis line
  ctx.beginPath()
  ctx.moveTo(padding.left, padding.top)
  ctx.lineTo(padding.left, h - padding.bottom)
  ctx.stroke()

  // X-axis line
  ctx.beginPath()
  ctx.moveTo(padding.left, h - padding.bottom)
  ctx.lineTo(w - padding.right, h - padding.bottom)
  ctx.stroke()

  // Draw ticks (pointing inward - Nature style)
  const tickSize = 4
  ctx.strokeStyle = '#CBD5E1'
  ctx.lineWidth = 1.0

  // X-axis ticks
  for (let i = 0; i <= numVerticalLines; i++) {
    const x = padding.left + (i / numVerticalLines) * drawW
    ctx.beginPath()
    ctx.moveTo(x, h - padding.bottom)
    ctx.lineTo(x, h - padding.bottom + tickSize)
    ctx.stroke()
  }

  // Y-axis ticks
  for (let i = 0; i <= numHorizontalLines; i++) {
    const y = h - padding.bottom - (i / numHorizontalLines) * drawH
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(padding.left - tickSize, y)
    ctx.stroke()
  }

  // Draw the burial depth profile (Nature style: smooth curve)
  ctx.beginPath()
  // Use sandstone color for main profile line (matching Python script)
  ctx.strokeStyle = geoColors.sandstone
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  profile.forEach((p, i) => {
    const x = padding.left + (p.distance / totalDistance) * drawW
    const y = h - padding.bottom - ((p.depth - minDepth) / depthRange) * drawH

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  // Fill area under the curve (subtle)
  ctx.lineTo(padding.left + drawW, h - padding.bottom)
  ctx.lineTo(padding.left, h - padding.bottom)
  ctx.closePath()
  ctx.fillStyle = 'rgba(244, 164, 96, 0.12)'  // Sandstone color with low alpha
  ctx.fill()

  // Draw borehole points on the profile (Nature style)
  for (const borehole of seamPoints.value) {
    if (borehole.burial_depth == null) continue

    // Find the closest point on the profile line
    const px = borehole.x
    const py = borehole.y

    // Calculate distance from start of line to this borehole
    const start = crossSectionData.value.worldLine?.start || { x: 0, y: 0 }
    const end = crossSectionData.value.worldLine?.end || { x: 0, y: 0 }

    // Project point onto line
    const lineLength = Math.sqrt((end.x - start.x)**2 + (end.y - start.y)**2)
    if (lineLength === 0) continue

    const t = ((px - start.x) * (end.x - start.x) + (py - start.y) * (end.y - start.y)) / (lineLength ** 2)

    // Check if point is close to the line
    const projX = start.x + t * (end.x - start.x)
    const projY = start.y + t * (end.y - start.y)
    const distToLine = Math.sqrt((px - projX)**2 + (py - projY)**2)

    if (distToLine < 50 && t >= 0 && t <= 1) {
      const x = padding.left + t * drawW
      const y = h - padding.bottom - ((borehole.burial_depth - minDepth) / depthRange) * drawH

      // Draw borehole point (coal color for contrast)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = geoColors.coal
      ctx.fill()
      // White edge for visibility
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Borehole label (Nature style: compact)
      ctx.fillStyle = '#64748B'
      ctx.font = '10px Arial, sans-serif'
      ctx.textAlign = 'center'
      const label = borehole.borehole || borehole.name || ''
      if (label) {
        ctx.fillText(label, x, y - 10)
      }
    }
  }

  // Draw axes labels (Nature style - Light theme)
  ctx.fillStyle = '#64748B'
  ctx.font = '11px Arial, sans-serif'
  ctx.textAlign = 'center'

  // X-axis labels (distance)
  for (let i = 0; i <= numVerticalLines; i++) {
    const x = padding.left + (i / numVerticalLines) * drawW
    const dist = (i / numVerticalLines) * totalDistance
    ctx.fillText(`${dist.toFixed(0)}`, x, h - 15)
  }

  // Y-axis labels (depth)
  ctx.textAlign = 'right'
  for (let i = 0; i <= numHorizontalLines; i++) {
    const y = h - padding.bottom - (i / numHorizontalLines) * drawH
    const depth = minDepth + (i / numHorizontalLines) * depthRange
    ctx.fillText(`${depth.toFixed(0)}`, padding.left - 8, y + 4)
  }

  // Axis titles (Nature style: normal weight, sans-serif)
  ctx.fillStyle = '#475569'
  ctx.font = '12px Arial, sans-serif'
  ctx.textAlign = 'center'

  // X-axis title
  ctx.fillText('Distance along profile (m)', padding.left + drawW / 2, h - 5)

  // Y-axis title (rotated)
  ctx.save()
  ctx.translate(12, padding.top + drawH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('Burial Depth (m)', 0, 0)
  ctx.restore()

  // Title (Nature style: Figure label format - Light theme)
  ctx.fillStyle = '#0F172A'
  ctx.font = 'bold 13px Arial, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`Profile A-A' | Depth: ${minDepth.toFixed(1)} - ${maxDepth.toFixed(1)} m`, padding.left, 18)

  // Scale bar (Nature style: manual scale bar instead of axis ticks)
  const scaleBarX = w - padding.right - 80
  const scaleBarY = h - padding.bottom + 12
  const scaleLength = 60  // Represents 60m

  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(scaleBarX, scaleBarY)
  ctx.lineTo(scaleBarX + scaleLength, scaleBarY)
  ctx.stroke()

  // Scale bar end caps
  ctx.beginPath()
  ctx.moveTo(scaleBarX, scaleBarY - 3)
  ctx.lineTo(scaleBarX, scaleBarY + 3)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(scaleBarX + scaleLength, scaleBarY - 3)
  ctx.lineTo(scaleBarX + scaleLength, scaleBarY + 3)
  ctx.stroke()

  ctx.fillStyle = '#64748B'
  ctx.font = '10px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Scale: 60m', scaleBarX + scaleLength / 2, scaleBarY + 12)
}

const resetCrossSection = () => {
  crossSectionMode.value = false
  crossSectionData.value = { line: null, points: [], depthProfile: [], distance: null, hasData: false }
  if (crossSectionCanvas.value) {
    const ctx = crossSectionCanvas.value.getContext('2d')
    ctx.clearRect(0, 0, crossSectionCanvas.value.width, crossSectionCanvas.value.height)
  }
}

onMounted(() => {
  loadSeams()
})

// Reset view function
const resetView = () => {
  resetCrossSection()
}

defineExpose({ resetView })
</script>

<style scoped>
/* ============================================
   MODERN DASHBOARD STYLE
   Clean, Professional & Scientific
   ============================================ */

:root {
  /* Color Palette - Modern & Clean */
  --bg-primary: #F1F5F9;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F8FAFC;
  --bg-elevated: #FFFFFF;

  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;

  --border-subtle: #E2E8F0;
  --border-medium: #CBD5E1;

  /* Brand Colors */
  --primary: #2563EB;
  --primary-light: #3B82F6;
  --primary-faint: #EFF6FF;
  --primary-gradient: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);

  --success: #10B981;
  --success-faint: #ECFDF5;

  --warning: #F59E0B;
  --warning-faint: #FFFBEB;

  --danger: #EF4444;
  --danger-faint: #FEF2F2;

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03);

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 20px;
}

/* ============================================
   DASHBOARD LAYOUT
   ============================================ */

.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

/* ============================================
   HEADER
   ============================================ */

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 28px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-subtle);
  height: 60px;
  box-shadow: var(--shadow-xs);
  z-index: 100;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.project-badge {
  display: flex;
  align-items: center;
  gap: 14px;
}

.project-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-faint);
  border-radius: var(--radius-md);
  font-size: 20px;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.project-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.project-subtitle {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 0.03em;
}

.header-stats {
  display: flex;
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  transition: all 0.15s ease;
}

.stat-item:hover {
  background: var(--bg-secondary);
  border-color: var(--border-medium);
}

.stat-item.primary {
  background: var(--primary-faint);
  border-color: rgba(37, 99, 235, 0.15);
}

.stat-item.primary .stat-value {
  color: var(--primary);
}

.stat-label {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
  color: var(--text-primary);
}

.stat-unit {
  display: none;
}

/* ============================================
   MAIN CONTENT - GRID LAYOUT
   ============================================ */

.dashboard-main {
  display: grid;
  grid-template-columns: 300px 1fr 280px;
  gap: 20px;
  padding: 20px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ============================================
   SIDEBARS
   ============================================ */

.sidebar-left,
.sidebar-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2px 6px 6px 2px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-medium) transparent;
}

.sidebar-left::-webkit-scrollbar,
.sidebar-right::-webkit-scrollbar {
  width: 5px;
}

.sidebar-left::-webkit-scrollbar-thumb,
.sidebar-right::-webkit-scrollbar-thumb {
  background: var(--border-medium);
  border-radius: 3px;
}

.sidebar-section {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 18px;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.section-icon {
  margin-right: 6px;
}

/* ============================================
   CONTROLS
   ============================================ */

.control-group {
  margin-bottom: 20px;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.segmented-control {
  display: flex;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 4px;
  gap: 3px;
}

.segment-btn {
  flex: 1;
  padding: 9px 12px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.segment-btn:hover {
  color: var(--text-primary);
}

.segment-btn.active {
  background: var(--bg-secondary);
  color: var(--primary);
  box-shadow: var(--shadow-xs);
}

/* Sliders */
.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.slider-value {
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--primary);
  background: var(--primary-faint);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.slider {
  width: 100%;
  height: 5px;
  border-radius: 3px;
  background: var(--border-subtle);
  outline: none;
  -webkit-appearance: none;
  margin: 10px 0;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2.5px solid var(--primary);
  cursor: grab;
  box-shadow: var(--shadow-sm);
  transition: transform 0.1s;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.08);
}

.slider::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.05);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}

/* Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn.primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn.primary:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.btn.primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  background: var(--border-medium);
  color: var(--text-muted);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-sm {
  padding: 7px 14px;
  font-size: 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}

.btn-sm:hover {
  background: var(--bg-secondary);
  border-color: var(--border-medium);
  color: var(--text-primary);
}

/* Toggle */
.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid var(--border-subtle);
  background: var(--bg-tertiary);
}

.toggle-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--border-medium);
}

.toggle-btn input[type="checkbox"],
.toggle-btn input[type="radio"] {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
}

.toggle-btn span {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.hint-text {
  margin-top: 12px;
  padding: 10px 12px;
  background: var(--warning-faint);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: #B45309;
  line-height: 1.4;
}

/* Empty State */
.empty-hint {
  text-align: center;
  padding: 24px 16px;
  color: var(--text-muted);
  font-size: 12px;
}

/* ============================================
   CENTER STAGE
   ============================================ */

.center-stage {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2px 6px 6px 2px;
}

.contour-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ============================================
   MAP CARDS
   ============================================ */

.maps-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.map-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.map-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--border-medium);
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.map-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.map-method {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.map-range {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
  font-weight: 500;
}

.map-container {
  flex: 1;
  position: relative;
  min-height: 420px;
  background: var(--bg-primary);
}

.map-container.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  color: var(--text-muted);
  gap: 12px;
}

.placeholder-icon {
  font-size: 40px;
  opacity: 0.5;
}

.map-placeholder p {
  margin: 0;
  font-size: 13px;
}

/* ============================================
   CROSS SECTION
   ============================================ */

.cross-section-container {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  padding: 18px;
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.section-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.section-distance {
  margin-left: 8px;
  padding: 4px 10px;
  background: var(--primary-faint);
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
  border-radius: var(--radius-sm);
}

.section-controls {
  display: flex;
  gap: 8px;
}

.cross-section-view {
  position: relative;
  height: 280px;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
}

.cross-section-canvas {
  width: 100%;
  height: 100%;
}

.cross-section-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 10px;
}

.cross-section-placeholder .placeholder-icon {
  font-size: 36px;
}

.cross-section-placeholder p {
  margin: 0;
  font-size: 13px;
}

/* ============================================
   UNCERTAINTY VIEW
   ============================================ */

.uncertainty-view {
  display: flex;
  flex-direction: column;
}

.uncertainty-map-card {
  flex: 1;
}

.uncertainty-map-container {
  min-height: 500px;
}

.uncertainty-canvas {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
}

/* ============================================
   RIGHT SIDEBAR COMPONENTS
   ============================================ */

.stratigraphic-container {
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 14px;
  display: flex;
  justify-content: center;
}

.stratigraphic-canvas {
  width: 100%;
  height: 380px;
  max-width: 240px;
}

/* Legend */
.lithology-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--border-medium);
  flex-shrink: 0;
}

.legend-name {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Layer Table */
.layer-table {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.table-header {
  background: var(--bg-tertiary);
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-secondary);
  display: flex;
  justify-content: space-between;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 12px;
  transition: background 0.15s ease;
}

.table-row:hover {
  background: var(--bg-tertiary);
}

.table-row:last-child {
  border-bottom: none;
}

.layer-name {
  color: var(--text-secondary);
  font-weight: 500;
}

.layer-value {
  font-family: 'SF Mono', 'JetBrains Mono', monospace;
  font-weight: 600;
  color: var(--primary);
}

/* Histogram */
.histogram-container {
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 14px;
}

.histogram-canvas {
  width: 100%;
  height: 180px;
}

/* ============================================
   SEAM SELECTION VIEW
   ============================================ */

.seam-selection-view {
  padding: 48px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.selection-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

.selection-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 40px;
}

.seam-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.seam-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.seam-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}

.seam-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.seam-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.seam-icon {
  font-size: 20px;
}

.seam-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.seam-count {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
}

.seam-card-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.seam-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.seam-stat .stat-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: none;
  letter-spacing: normal;
}

.seam-stat .stat-value {
  font-size: 13px;
  color: var(--text-primary);
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 1400px) {
  .dashboard-main {
    grid-template-columns: 280px 1fr;
    grid-template-rows: auto auto;
  }

  .sidebar-right {
    grid-column: 2;
    grid-row: 2;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .sidebar-right > * {
    flex: 1;
    min-width: 280px;
  }
}

@media (max-width: 1100px) {
  .dashboard-main {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .maps-container {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    padding: 0 20px;
  }

  .header-stats {
    display: none;
  }
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner.sm {
  width: 14px;
  height: 14px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
