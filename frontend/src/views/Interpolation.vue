<template>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div>
        <h2>插值分析</h2>
        <div class="muted">{{ selectedSeam?.name || '选择煤层进行空间插值分析' }}</div>
      </div>
      <div v-if="selectedSeam && seamStats" class="header-stats">
        <div class="stat-badge">
          <span class="stat-label">厚度范围</span>
          <strong>{{ seamStats?.thickness_min?.toFixed(2) || '-' }} - {{ seamStats?.thickness_max?.toFixed(2) || '-' }} m</strong>
        </div>
        <div class="stat-badge primary">
          <span class="stat-label">平均厚度</span>
          <strong>{{ seamStats?.thickness_mean?.toFixed(2) || '-' }} m</strong>
        </div>
        <div class="stat-badge">
          <span class="stat-label">钻孔数量</span>
          <strong>{{ seamStats?.borehole_count || seamPoints.length || '-' }}</strong>
        </div>
      </div>
    </div>

    <!-- Seam Selection View -->
    <div v-if="!selectedSeam" class="card">
      <h3 class="section-title">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
        选择分析煤层
      </h3>
      <p class="section-desc">从以下可用煤层中选择一个进行插值分析</p>

      <div class="seam-selection-grid">
        <div
          v-for="seam in availableSeams"
          :key="seam.name"
          class="seam-selection-card"
          @click="selectSeam(seam)"
        >
          <div class="seam-card-header">
            <span class="seam-name">{{ seam.name }}</span>
            <span class="seam-count">{{ seam.borehole_count }} 个钻孔</span>
          </div>
          <div class="seam-card-stats">
            <div class="mini-stat">
              <span class="mini-stat-label">平均厚度</span>
              <span class="mini-stat-value">{{ seam.avg_thickness?.toFixed(2) }} m</span>
            </div>
            <div class="mini-stat">
              <span class="mini-stat-label">厚度范围</span>
              <span class="mini-stat-value">{{ seam.thickness_range?.min?.toFixed(1) }}-{{ seam.thickness_range?.max?.toFixed(1) }} m</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard -->
    <div v-else class="grid">
      <!-- Card 1: Interpolation Parameters -->
      <div class="card params-card">
        <h3 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6"></path>
            <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"></path>
            <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"></path>
          </svg>
          插值参数
        </h3>

        <div class="param-row">
          <label class="param-label">插值方法</label>
          <div class="tab-buttons">
            <button
              v-for="opt in methodOptions"
              :key="opt.key"
              :class="['tab-btn', { active: method === opt.key }]"
              @click="method = opt.key"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="param-row">
          <div class="param-header">
            <label class="param-label">网格密度</label>
            <span class="param-value">{{ gridSize }}</span>
          </div>
          <input v-model.number="gridSize" type="range" min="30" max="150" step="10" class="slider">
          <div class="slider-labels">
            <span>粗</span>
            <span>细</span>
          </div>
        </div>

        <div class="param-row">
          <div class="param-header">
            <label class="param-label">等值线级别</label>
            <span class="param-value">{{ contourLevels }}</span>
          </div>
          <input v-model.number="contourLevels" type="range" min="5" max="20" step="1" class="slider">
          <div class="slider-labels">
            <span>少</span>
            <span>多</span>
          </div>
        </div>

        <div class="param-row" v-if="thicknessResult">
          <label class="toggle-btn" style="width: 100%">
            <input type="checkbox" v-model="crossSectionMode">
            <span>绘制剖面线</span>
          </label>
          <p v-if="crossSectionMode" class="hint-text">在地图上点击两点绘制剖面线</p>
        </div>

        <div class="action-buttons">
          <button class="btn primary" @click="handleInterpolate" :disabled="loading">
            <span v-if="loading" class="spinner sm"></span>
            {{ loading ? '计算中...' : '生成等值线图' }}
          </button>
          <button class="btn outline" @click="selectedSeam = null; thicknessResult = null; depthResult = null">
            更换煤层
          </button>
        </div>
      </div>

      <!-- Card 2: Data Distribution -->
      <div class="card">
        <h3 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          数据分布
        </h3>
        <div v-if="seamPoints.length > 0" class="histogram-wrapper">
          <canvas ref="histogramCanvas" class="histogram-canvas"></canvas>
        </div>
        <div v-else class="empty-state">
          <p>暂无数据分布</p>
        </div>
      </div>

      <!-- Card 4: Lithology Column -->
      <div class="card">
        <h3 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="m2 17 10 5 10-5"></path>
            <path d="m2 12 10 5 10-5"></path>
          </svg>
          地层柱状图
        </h3>
        <div class="stratigraphic-wrapper">
          <canvas ref="stratigraphicCanvas" class="stratigraphic-canvas"></canvas>
        </div>
        <div class="lithology-legend-compact">
          <div v-for="(color, name) in lithologyColors" :key="name" class="legend-item-compact">
            <div class="legend-color" :style="{ background: color }"></div>
            <span class="legend-name">{{ name }}</span>
          </div>
        </div>
      </div>

      <!-- Card 5-6: Contour Maps -->
      <div class="card map-card-large" v-if="thicknessResult">
        <div class="map-header">
          <div>
            <h3 class="section-title">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              </svg>
              煤层厚度分布
            </h3>
            <p class="section-desc">{{ methodName(method) }} · {{ thicknessResult?.valueRange?.min?.toFixed(1) }} - {{ thicknessResult?.valueRange?.max?.toFixed(1) }} m</p>
          </div>
        </div>
        <div class="map-wrapper">
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
          <div v-else class="empty-state">
            <p>设置参数后点击"生成等值线图"</p>
          </div>
        </div>
      </div>

      <div class="card map-card-large" v-if="depthResult">
        <div class="map-header">
          <div>
            <h3 class="section-title">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="m2 17 10 5 10-5"></path>
              </svg>
              煤层埋深分布
            </h3>
            <p class="section-desc">{{ methodName(method) }} · {{ depthResult?.valueRange?.min?.toFixed(1) }} - {{ depthResult?.valueRange?.max?.toFixed(1) }} m</p>
          </div>
        </div>
        <div class="map-wrapper">
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
          <div v-else class="empty-state">
            <p>设置参数后点击"生成等值线图"</p>
          </div>
        </div>
      </div>

      <!-- Uncertainty Map -->
      <div class="card map-card-full" v-if="thicknessResult">
        <div class="map-header">
          <div>
            <h3 class="section-title">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              插值不确定性分布
            </h3>
            <p class="section-desc">红色区域表示高不确定性，蓝色区域更可靠</p>
          </div>
        </div>
        <div class="map-wrapper uncertainty-wrapper">
          <canvas ref="uncertaintyCanvas" class="uncertainty-canvas"></canvas>
        </div>
      </div>

      <!-- Cross Section Profile -->
      <div class="card map-card-full" v-if="crossSectionData.hasData">
        <div class="map-header">
          <div>
            <h3 class="section-title">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
              剖面切片 (A-A')
              <span class="section-badge">{{ crossSectionData.distance?.toFixed(0) }}m</span>
            </h3>
          </div>
          <button class="btn outline small" @click="resetCrossSection">重置</button>
        </div>
        <div class="cross-section-wrapper">
          <canvas ref="crossSectionCanvas" class="cross-section-canvas"></canvas>
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

    console.log('完整API响应:', data)
    console.log('data.thickness:', data.thickness)
    console.log('data.depth:', data.depth)
    
    if (data.thickness) {
      console.log('thickness对象的keys:', Object.keys(data.thickness))
      console.log('thickness.image存在吗?', 'image' in data.thickness)
      console.log('thickness所有属性:', JSON.stringify(data.thickness, null, 2))
    }
    
    if (data.depth) {
      console.log('depth对象的keys:', Object.keys(data.depth))
      console.log('depth.image存在吗?', 'image' in data.depth)
    }

    console.log('API Response:', {
      hasThicknessImage: !!data.thickness?.image,
      hasDepthImage: !!data.depth?.image,
      thicknessImageLength: data.thickness?.image?.length,
      depthImageLength: data.depth?.image?.length,
      thicknessImagePrefix: data.thickness?.image?.substring(0, 50),
      depthImagePrefix: data.depth?.image?.substring(0, 50)
    })

    seamPoints.value = data.boreholes || []

    if (data.thickness?.image) {
      thicknessResult.value = {
        imageUrl: `data:image/png;base64,${data.thickness.image}`,
        valueRange: data.thickness.value_range,
        bounds: data.bounds
      }
      console.log('Thickness imageUrl created:', thicknessResult.value.imageUrl.substring(0, 50) + '...')
    } else {
      console.error('❌ 厚度图片数据缺失!')
    }

    if (data.depth?.image) {
      depthResult.value = {
        imageUrl: `data:image/png;base64,${data.depth.image}`,
        valueRange: data.depth.value_range,
        bounds: data.bounds
      }
      console.log('Depth imageUrl created:', depthResult.value.imageUrl.substring(0, 50) + '...')
    } else {
      console.error('❌ 深度图片数据缺失!')
    }

    // Calculate uncertainty map
    calculateUncertainty()

    toast.add('等值线图生成完成', 'success')
  } catch (err) {
    console.error('Interpolate error:', err)
    console.error('Error response:', err.response?.data)
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

// Draw histogram - Modern gradient style
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

  const numBins = 15
  const binWidthVal = (maxVal - minVal) / numBins

  // Calculate histogram
  const bins = Array(numBins).fill(0)
  for (const v of values) {
    const bin = Math.min(Math.floor((v - minVal) / binWidthVal), numBins - 1)
    bins[bin]++
  }

  const maxCount = Math.max(...bins)

  // Modern gradient colors
  const gradientColors = {
    start: { r: 99, g: 102, b: 241 },   // Indigo-500
    end: { r: 168, g: 85, b: 247 }      // Purple-500
  }

  // Draw gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, h)
  bgGradient.addColorStop(0, '#f8fafc')
  bgGradient.addColorStop(1, '#f1f5f9')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, w, h)

  const padding = { left: 45, right: 20, top: 40, bottom: 40 }
  const drawW = w - padding.left - padding.right
  const drawH = h - padding.top - padding.bottom
  const barWidth = drawW / numBins - 4  // Add gap between bars
  const gap = 4
  const scaleY = drawH / (maxCount * 1.2)

  // Draw grid lines (subtle)
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (i / 4) * drawH
    ctx.beginPath()
    ctx.setLineDash([4, 4])
    ctx.moveTo(padding.left, y)
    ctx.lineTo(w - padding.right, y)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // Draw bars with gradient
  for (let i = 0; i < numBins; i++) {
    const height = bins[i] * scaleY
    const x = padding.left + i * (barWidth + gap)
    const y = h - padding.bottom - height

    if (height > 0) {
      // Create gradient for each bar
      const barGradient = ctx.createLinearGradient(x, y, x, h - padding.bottom)
      const ratio = i / numBins
      const r = Math.round(gradientColors.start.r + (gradientColors.end.r - gradientColors.start.r) * ratio)
      const g = Math.round(gradientColors.start.g + (gradientColors.end.g - gradientColors.start.g) * ratio)
      const b = Math.round(gradientColors.start.b + (gradientColors.end.b - gradientColors.start.b) * ratio)

      barGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`)
      barGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.6)`)

      // Draw bar with rounded top corners
      ctx.fillStyle = barGradient
      ctx.beginPath()
      const radius = Math.min(6, barWidth / 2)
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + barWidth - radius, y)
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius)
      ctx.lineTo(x + barWidth, h - padding.bottom)
      ctx.lineTo(x, h - padding.bottom)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
      ctx.fill()

      // Add value label on top of bar
      if (bins[i] > 0) {
        ctx.fillStyle = '#475569'
        ctx.font = 'bold 10px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(bins[i].toString(), x + barWidth / 2, y - 6)
      }
    }
  }

  // Draw axes
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(padding.left, padding.top)
  ctx.lineTo(padding.left, h - padding.bottom)
  ctx.lineTo(w - padding.right, h - padding.bottom)
  ctx.stroke()

  // X-axis labels
  ctx.fillStyle = '#64748b'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  for (let i = 0; i <= 5; i++) {
    const val = minVal + (i / 5) * (maxVal - minVal)
    const x = padding.left + (i / 5) * drawW
    ctx.fillText(val.toFixed(1) + 'm', x, h - padding.bottom + 18)
  }

  // Y-axis labels
  ctx.textAlign = 'right'
  ctx.font = '10px sans-serif'
  for (let i = 0; i <= 4; i++) {
    const count = Math.round((i / 4) * maxCount)
    const y = h - padding.bottom - (i / 4) * drawH
    ctx.fillText(count.toString(), padding.left - 8, y + 3)
  }

  // Title
  ctx.fillStyle = '#1e293b'
  ctx.font = 'bold 13px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('钻孔厚度分布', padding.left + drawW / 2, 22)

  // Statistics box (modern card style)
  const statsLines = [
    `数量: ${values.length}`,
    `均值: ${mean.toFixed(2)} m`,
    `标准差: ${stdDev.toFixed(2)} m`
  ]

  const boxWidth = 120
  const boxHeight = 70
  const boxX = w - padding.right - boxWidth - 5
  const boxY = padding.top + 5

  // Shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 2

  // White background with gradient
  const boxGradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight)
  boxGradient.addColorStop(0, '#ffffff')
  boxGradient.addColorStop(1, '#f8fafc')
  ctx.fillStyle = boxGradient
  ctx.beginPath()
  ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8)
  ctx.fill()

  // Border
  ctx.shadowColor = 'transparent'
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.stroke()

  // Statistics text
  ctx.fillStyle = '#475569'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'left'
  statsLines.forEach((line, i) => {
    const parts = line.split(': ')
    ctx.fillStyle = '#94a3b8'
    ctx.fillText(parts[0] + ':', boxX + 10, boxY + 18 + i * 16)
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 11px sans-serif'
    ctx.fillText(parts[1], boxX + 55, boxY + 18 + i * 16)
    ctx.font = '11px sans-serif'
  })
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
/* Interpolation Analysis Page - Unified with Global Design System */

/* Grid Layout */
.grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--spacing-lg); }
.params-card { grid-column: span 3; }
.param-row { margin-bottom: var(--spacing-lg); }
.param-row:last-child { margin-bottom: 0; }
.param-label { display: block; font-size: 13px; font-weight: 600; color: var(--color-secondary); margin-bottom: var(--spacing-sm); }
.param-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm); }
.param-value { font-family: monospace; font-size: 13px; color: var(--color-primary); background: var(--color-primary-light); padding: 4px 10px; border-radius: var(--border-radius-sm); font-weight: 700; }

/* Tab Buttons */
.tab-buttons { display: flex; background: var(--color-primary-light); border-radius: var(--border-radius-sm); padding: 4px; gap: 4px; }
.tab-btn { flex: 1; padding: 10px 14px; border: none; border-radius: 6px; background: transparent; color: var(--color-secondary); font-size: 13px; font-weight: 600; cursor: pointer; transition: all var(--transition-fast); }
.tab-btn:hover:not(.active) { background: rgba(255, 255, 255, 0.6); }
.tab-btn.active { background: var(--gradient-primary); color: white; box-shadow: var(--shadow-sm); }

/* Slider */
.slider { width: 100%; height: 6px; border-radius: 3px; background: linear-gradient(to right, var(--color-primary-light), #ddd6fe); outline: none; -webkit-appearance: none; margin: var(--spacing-sm) 0; cursor: pointer; }
.slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: white; border: 3px solid var(--color-primary); cursor: grab; box-shadow: var(--shadow-md); transition: all var(--transition-normal); }
.slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
.slider-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--color-secondary); font-weight: 500; }

/* Buttons */
.action-buttons { display: flex; gap: var(--spacing-md); margin-top: var(--spacing-xl); }
.btn { padding: 12px 18px; border: none; border-radius: var(--border-radius-md); font-size: 14px; font-weight: 600; cursor: pointer; transition: all var(--transition-fast); display: inline-flex; align-items: center; justify-content: center; gap: var(--spacing-sm); }
.btn.primary { background: var(--gradient-primary); color: white; box-shadow: var(--shadow-md); }
.btn.primary:hover:not(:disabled) { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn.outline { background: transparent; border: 2px solid var(--border-color); color: var(--color-secondary); }
.btn.outline:hover { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-primary-light); }
.btn.small { padding: 8px 14px; font-size: 13px; }

/* Cards */
.grid > .card:nth-child(2) { grid-column: span 3; }
.grid > .card:nth-child(3) { grid-column: span 3; }
.grid > .card:nth-child(4) { grid-column: span 3; }
.histogram-wrapper, .stratigraphic-wrapper { background: var(--color-primary-light); border-radius: var(--border-radius-md); padding: var(--spacing-lg); display: flex; align-items: center; justify-content: center; min-height: 220px; }
.histogram-canvas { max-width: 100%; max-height: 200px; }
.stratigraphic-canvas { max-width: 100%; max-height: 260px; }

/* Toggle */
.toggle-group { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.toggle-btn { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); cursor: pointer; transition: all var(--transition-fast); background: white; }
.toggle-btn:hover { border-color: var(--color-primary); background: var(--color-primary-light); }
.toggle-btn input { width: 16px; height: 16px; accent-color: var(--color-primary); cursor: pointer; }
.toggle-btn span { font-size: 14px; color: var(--color-secondary); font-weight: 500; }
.hint-text { margin-top: var(--spacing-md); padding: var(--spacing-md); background: var(--color-warning-light); border-radius: var(--border-radius-sm); font-size: 12px; color: #B45309; line-height: 1.5; }

/* Legend */
.lithology-legend-compact { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-sm) var(--spacing-md); margin-top: var(--spacing-lg); }
.legend-item-compact { display: flex; align-items: center; gap: var(--spacing-sm); font-size: 11px; }
.legend-item-compact .legend-color { width: 12px; height: 12px; border-radius: 3px; border: 1px solid var(--border-color); flex-shrink: 0; }
.legend-item-compact .legend-name { color: var(--color-secondary); font-weight: 500; }

/* Map Cards */
.map-card-large { grid-column: span 6; }
.map-card-full { grid-column: span 12; }
.map-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-lg); padding-bottom: var(--spacing-lg); border-bottom: 1px solid var(--border-color); }
.section-badge { display: inline-block; padding: 4px 10px; background: var(--color-warning-light); color: var(--color-warning); font-size: 11px; font-weight: 700; font-family: monospace; border-radius: var(--border-radius-sm); margin-left: var(--spacing-sm); }
.map-wrapper, .cross-section-wrapper {
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: #f8fafc;
  min-height: 450px;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.map-wrapper :deep(.contour-map-wrapper) {
  width: 100%;
  height: 100%;
}

.map-wrapper :deep(.contour-image) {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  display: block;
}

.uncertainty-wrapper {
  min-height: 500px;
  height: 500px;
}

.uncertainty-canvas {
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius-md);
}

.cross-section-wrapper {
  min-height: 320px;
  height: 320px;
}

.cross-section-canvas {
  width: 100%;
  height: 100%;
}

/* Seam Selection */
.seam-selection-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--spacing-lg); margin-top: var(--spacing-xl); max-height: 600px; overflow-y: auto; padding: 4px; }
.seam-selection-card { background: white; border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: var(--spacing-lg); cursor: pointer; transition: all var(--transition-normal); box-shadow: var(--shadow-sm); }
.seam-selection-card:hover { box-shadow: var(--shadow-lg); border-color: var(--color-primary); transform: translateY(-4px); }
.seam-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md); }
.seam-name { font-size: 16px; font-weight: 700; color: var(--text-primary); }
.seam-count { font-size: 11px; color: var(--color-primary); background: var(--color-primary-light); padding: 4px 10px; border-radius: var(--border-radius-sm); font-weight: 700; }
.seam-card-stats { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.mini-stat { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
.mini-stat-label { color: var(--color-secondary); font-weight: 500; }
.mini-stat-value { color: var(--text-primary); font-weight: 700; font-family: monospace; }

/* Header Stats */
.header-stats { display: flex; gap: var(--spacing-md); position: relative; z-index: 1; }
.stat-badge { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; padding: var(--spacing-sm) var(--spacing-md); background: rgba(255, 255, 255, 0.2); border-radius: var(--border-radius-sm); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); }
.stat-badge.primary { background: rgba(251, 191, 36, 0.2); border-color: rgba(251, 191, 36, 0.3); }
.stat-badge .stat-label { font-size: 10px; color: rgba(255, 255, 255, 0.85); font-weight: 600; text-transform: uppercase; }
.stat-badge strong { font-size: 14px; color: white; font-weight: 700; font-family: monospace; }

/* Spinner */
.spinner { width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
.spinner.sm { width: 14px; height: 14px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 1400px) { .params-card, .grid > .card:nth-child(2), .grid > .card:nth-child(3), .grid > .card:nth-child(4) { grid-column: span 6; } .map-card-large { grid-column: span 12; } }
@media (max-width: 1024px) { .grid { grid-template-columns: 1fr; } .params-card, .grid > .card, .map-card-large, .map-card-full { grid-column: span 1; } .header-stats { flex-wrap: wrap; } .seam-selection-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); } }
@media (max-width: 768px) { .action-buttons { flex-direction: column; } .btn { width: 100%; } .map-wrapper, .uncertainty-wrapper, .cross-section-wrapper { min-height: 300px; } .map-wrapper :deep(.contour-map), .uncertainty-canvas, .cross-section-canvas { height: 300px; } .seam-selection-grid { grid-template-columns: 1fr; max-height: 400px; } }
</style>