<template>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div>
        <h2>插值分析</h2>
        <div class="muted">{{ selectedSeam?.name || '请选择煤层并执行空间插值分析' }}</div>
      </div>
      <div v-if="selectedSeam && seamStats" class="header-stats">
        <div class="stat-badge">
          <span class="stat-label">厚度范围</span>
          <strong>{{ seamStats?.thickness?.min?.toFixed(2) || '-' }} - {{ seamStats?.thickness?.max?.toFixed(2) || '-' }} m</strong>
        </div>
        <div class="stat-badge primary">
          <span class="stat-label">平均厚度</span>
          <strong>{{ seamStats?.thickness?.mean?.toFixed(2) || '-' }} m</strong>
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
      <div class="card params-card compact-card">
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

        <div class="param-row">
          <label class="param-label">渲染质量</label>
          <div class="tab-buttons quality-tabs">
            <button
              v-for="opt in renderQualityOptions"
              :key="opt.key"
              :class="['tab-btn', { active: renderQuality === opt.key }]"
              @click="renderQuality = opt.key"
            >
              {{ opt.label }}
            </button>
          </div>
          <div class="slider-labels quality-hint">
            <span>默认先快速预览，需要时再切换更高质量重算。</span>
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
          <button class="btn primary" @click="handleInterpolate({ forceRefresh: true, silent: false })" :disabled="loading">
            <span v-if="loading" class="spinner sm"></span>
            {{ loading ? '计算中...' : '生成等值线图' }}
          </button>
          <button class="btn outline" @click="selectedSeam = null; thicknessResult = null; depthResult = null">
            更换煤层
          </button>
          <button
            v-if="thicknessResult || depthResult"
            class="btn outline"
            @click="goPressureAnalysis"
          >
            下一步：新算法原理
          </button>
        </div>
        <p v-if="interpolationStatus" class="status-text">{{ interpolationStatus }}</p>

        <div class="geomodel-panel" v-if="selectedSeam">
          <div class="geomodel-head">
            <span class="geomodel-title">地质建模任务</span>
            <span class="geomodel-jobid" v-if="geomodelJobId">#{{ geomodelJobId }}</span>
          </div>

          <div class="geomodel-controls">
            <select v-model="geomodelMethod" class="geomodel-select">
              <option
                v-for="opt in geomodelMethodOptions"
                :key="opt.key"
                :value="opt.key"
              >
                {{ opt.label }}
              </option>
            </select>
            <div class="geomodel-range">
              <label>分辨率</label>
              <input v-model.number="geomodelResolution" type="number" min="1" max="500" step="1">
            </div>
            <button class="btn outline geomodel-btn" @click="startGeomodelJob" :disabled="geomodelSubmitting">
              {{ geomodelSubmitting ? '提交中...' : '发起建模' }}
            </button>
          </div>

          <div v-if="geomodelJob" class="geomodel-status">
            <span>状态: {{ geomodelJob.status }}</span>
            <span v-if="geomodelPolling">轮询中...</span>
            <span v-if="geomodelJob.message">{{ geomodelJob.message }}</span>
          </div>
          <p v-if="geomodelError" class="geomodel-error">{{ geomodelError }}</p>

          <div v-if="geomodelQualitySummary" class="geomodel-summary">
            <div class="summary-item">
              <span>连续性</span>
              <strong>{{ Number(geomodelQualitySummary.continuity_score || 0).toFixed(3) }}</strong>
            </div>
            <div class="summary-item">
              <span>尖灭比例</span>
              <strong>{{ Number(geomodelQualitySummary.pinchout_ratio || 0).toFixed(3) }}</strong>
            </div>
            <div class="summary-item">
              <span>层厚变异</span>
              <strong>{{ Number(geomodelQualitySummary.layer_cv || 0).toFixed(3) }}</strong>
            </div>
          </div>

          <div class="geomodel-files" v-if="geomodelArtifacts.length">
            <button
              v-for="artifact in geomodelArtifacts"
              :key="artifact.name"
              class="file-chip"
              @click="downloadGeomodelFile(artifact.name)"
            >
              {{ artifact.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Card 2: Data Distribution -->
      <div class="card compact-card">
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
        <!-- 统计信息 -->
        <div v-if="seamPoints.length > 0" class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">样本数</span>
            <span class="stat-value">{{ seamThicknessStats.count }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">均值</span>
            <span class="stat-value">{{ seamThicknessStats.mean.toFixed(2) }}m</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">标准差</span>
            <span class="stat-value">{{ seamThicknessStats.stdDev.toFixed(2) }}m</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">变异系数</span>
            <span class="stat-value">{{ seamThicknessStats.cv.toFixed(2) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最小值</span>
            <span class="stat-value">{{ seamThicknessStats.min.toFixed(2) }}m</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最大值</span>
            <span class="stat-value">{{ seamThicknessStats.max.toFixed(2) }}m</span>
          </div>
        </div>
      </div>

      <!-- Card 4: Lithology Column -->
      <div class="card compact-card">
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
      <div class="map-row" v-if="selectedSeam">
        <div class="card map-card-large">
          <div class="map-header">
            <div>
              <h3 class="section-title">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                </svg>
                煤层厚度分布
              </h3>
              <p class="section-desc" v-if="thicknessResult">{{ methodName(method) }} · {{ thicknessResult?.valueRange?.min?.toFixed(1) }} - {{ thicknessResult?.valueRange?.max?.toFixed(1) }} m</p>
              <p class="section-desc" v-else>正在准备厚度分布图...</p>
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
            <div v-else class="map-placeholder" :class="{ loading }">
              <div v-if="loading" class="spinner"></div>
              <p>{{ loading ? '正在计算厚度分布图...' : '点击“生成等值线图”后显示厚度分布图。' }}</p>
            </div>
          </div>
        </div>

        <div class="card map-card-large">
          <div class="map-header">
            <div>
              <h3 class="section-title">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="m2 17 10 5 10-5"></path>
                </svg>
                煤层埋深分布
              </h3>
              <p class="section-desc" v-if="depthResult">{{ methodName(method) }} · {{ depthResult?.valueRange?.min?.toFixed(1) }} - {{ depthResult?.valueRange?.max?.toFixed(1) }} m</p>
              <p class="section-desc" v-else>正在准备埋深分布图...</p>
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
            <div v-else class="map-placeholder" :class="{ loading }">
              <div v-if="loading" class="spinner"></div>
              <p>{{ loading ? '正在计算埋深分布图...' : '点击“生成等值线图”后显示埋深分布图。' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Uncertainty Map -->
      <div class="card map-card-full" v-if="selectedSeam">
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
          <canvas v-if="thicknessResult" ref="uncertaintyCanvas" class="uncertainty-canvas"></canvas>
          <div v-else class="map-placeholder" :class="{ loading }">
            <div v-if="loading" class="spinner"></div>
            <p>{{ loading ? '正在计算不确定性分布图...' : '完成插值后显示不确定性分布图。' }}</p>
          </div>
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
              <span class="section-badge">{{ crossSectionData.distance?.toFixed(0) }} m</span>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import { useGeomodelJob } from '../composables/useGeomodelJob'
import ContourMap from '../components/ContourMap.vue'
import {
  downloadGeomodelArtifact,
  getCoalSeams,
  getSeamStats,
  getSeamOverburden,
  getSeamContourImages
} from '../api'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const { workspaceState, setSelectedSeam, markStepDone } = useWorkspaceFlow()

// State
const loadingSeams = ref(false)
const seamError = ref(null)
const loading = ref(false)
const availableSeams = ref([])
const selectedSeam = ref(null)
const seamStats = ref(null)
const seamPoints = ref([])
const sortedLayers = ref([])
const method = ref('kriging')
const gridSize = ref(80)
const contourLevels = ref(10)
const renderQuality = ref('standard')
const interpolationStatus = ref('')
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

// Geomodel state
const geomodelMethod = ref('thickness')
const geomodelResolution = ref(20)
const geomodelMethodOptions = [
  { key: 'thickness', label: '厚度建模' },
  { key: 'hybrid', label: '混合建模' },
  { key: 'regression_kriging', label: '回归克里金' },
  { key: 'smart_pinchout', label: '智能尖灭' }
]
const {
  jobId: geomodelJobId,
  job: geomodelJob,
  artifacts: geomodelArtifacts,
  loading: geomodelSubmitting,
  polling: geomodelPolling,
  error: geomodelError,
  submit: submitGeomodelJob,
  refresh: refreshGeomodelJob
} = useGeomodelJob()

// Options
const methodOptions = [
  { key: 'kriging', label: 'Kriging' },
  { key: 'idw', label: 'IDW' },
  { key: 'linear', label: 'Linear' },
  { key: 'nearest', label: 'Nearest' }
]

const renderQualityOptions = [
  { key: 'fast', label: '快速' },
  { key: 'standard', label: '标准' },
  { key: 'high', label: '高精' }
]

const renderQualityConfig = {
  fast: { dpi: 120, smoothSigma: 0.75, label: '快速' },
  standard: { dpi: 200, smoothSigma: 1.15, label: '标准' },
  high: { dpi: 300, smoothSigma: 1.35, label: '高精' }
}

const LAST_CONTOUR_CACHE_KEY = 'interpolation:lastContour:v1'
const UNCERTAINTY_RESOLUTION_BASE = { fast: 72, standard: 96, high: 128 }
const FIGURE_STYLE = {
  textColor: '#111827',
  subTextColor: '#475569',
  axisColor: '#1f2937',
  gridColor: 'rgba(148, 163, 184, 0.28)',
  panelBorder: '#cbd5e1',
  fontFamily: "'Helvetica Neue', Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif",
  monoFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace"
}

let interpolateRequestToken = 0
let seamSelectionToken = 0
let uncertaintyIdleHandle = null
let uncertaintyTimer = null

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
  const names = { kriging: 'Kriging', idw: 'IDW', linear: 'Linear', nearest: 'Nearest' }
  return names[key] || key
}

const figureFont = (size, weight = 400, mono = false) => {
  const family = mono ? FIGURE_STYLE.monoFamily : FIGURE_STYLE.fontFamily
  return `${weight} ${size}px ${family}`
}

const applyFigureRenderDefaults = (ctx) => {
  ctx.imageSmoothingEnabled = true
  if ('imageSmoothingQuality' in ctx) {
    ctx.imageSmoothingQuality = 'high'
  }
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

const seamThicknessValues = computed(() => {
  return seamPoints.value
    .map((p) => Number(p.thickness))
    .filter((v) => Number.isFinite(v))
})

const seamThicknessStats = computed(() => {
  const values = seamThicknessValues.value
  const count = values.length
  if (!count) {
    return { count: 0, mean: 0, stdDev: 0, cv: 0, min: 0, max: 0 }
  }

  const mean = values.reduce((sum, v) => sum + v, 0) / count
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / count
  const stdDev = Math.sqrt(variance)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const cv = mean > 0 ? (stdDev / mean) * 100 : 0

  return { count, mean, stdDev, cv, min, max }
})

const geomodelQualitySummary = computed(() => {
  return geomodelJob.value?.result_manifest?.quality_summary || null
})

const applyContourResult = (data) => {
  seamPoints.value = data?.boreholes || seamPoints.value

  if (data?.thickness?.image) {
    thicknessResult.value = {
      imageUrl: `data:image/png;base64,${data.thickness.image}`,
      valueRange: data.thickness.value_range,
      bounds: data.bounds
    }
  } else {
    thicknessResult.value = null
  }

  if (data?.depth?.image) {
    depthResult.value = {
      imageUrl: `data:image/png;base64,${data.depth.image}`,
      valueRange: data.depth.value_range,
      bounds: data.bounds
    }
  } else {
    depthResult.value = null
  }
}

const readLastContourCache = (seamName) => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(LAST_CONTOUR_CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw)
    if (!cached?.seamName || cached.seamName !== seamName) return null
    if (!cached?.data?.bounds) return null
    return cached
  } catch (err) {
    return null
  }
}

const writeLastContourCache = (seamName, data) => {
  if (typeof window === 'undefined') return
  try {
    const payload = {
      seamName,
      updatedAt: Date.now(),
      method: method.value,
      gridSize: gridSize.value,
      contourLevels: contourLevels.value,
      quality: renderQuality.value,
      data: {
        bounds: data?.bounds || null,
        boreholes: data?.boreholes || [],
        thickness: data?.thickness || null,
        depth: data?.depth || null
      }
    }
    window.sessionStorage.setItem(LAST_CONTOUR_CACHE_KEY, JSON.stringify(payload))
  } catch (err) {
    // Ignore cache errors (quota / unavailable storage).
  }
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
const normalizeLayers = (layers = []) => {
  let cursor = 0
  return layers.map((layer) => {
    const thickness = Number(layer.thickness ?? 0) || 0
    let zTop = Number(layer.z_top)
    let zBottom = Number(layer.z_bottom)

    if (!Number.isFinite(zTop)) {
      zTop = cursor
    }
    if (!Number.isFinite(zBottom)) {
      zBottom = zTop + thickness
    }
    if (!Number.isFinite(thickness) || thickness === 0) {
      const computed = Math.max((zBottom || 0) - (zTop || 0), 0)
      if (computed > 0) {
        layer.thickness = computed
      }
    }

    cursor = zBottom
    return {
      ...layer,
      thickness: Number(layer.thickness ?? thickness) || 0,
      z_top: zTop,
      z_bottom: zBottom
    }
  })
}

const selectSeam = async (seam) => {
  const currentSelectionToken = ++seamSelectionToken
  selectedSeam.value = seam
  setSelectedSeam(seam?.name || '')
  thicknessResult.value = null
  depthResult.value = null
  sortedLayers.value = []
  interpolationStatus.value = ''

  try {
    const cached = readLastContourCache(seam.name)
    if (cached?.data) {
      applyContourResult(cached.data)
      interpolationStatus.value = '已加载上次缓存结果，正在后台刷新...'
      await nextTick()
      scheduleUncertaintyCalculation()
    }

    const seamStatsRequest = getSeamStats(seam.name)
    const overburdenRequest = getSeamOverburden(seam.name).catch(() => null)
    const { data } = await seamStatsRequest
    if (currentSelectionToken !== seamSelectionToken) return
    seamStats.value = data
    seamPoints.value = data.points || []

    // Draw histogram first and start fast interpolation immediately.
    await nextTick()
    drawHistogram()
    markStepDone('Interpolation', {
      interpolationPoints: seamPoints.value.length || 0
    })
    void handleInterpolate({ presetKey: 'fast', forceRefresh: false, silent: true, autoMode: true })

    // Load stratigraphic data in background to avoid blocking first paint.
    void (async () => {
      const overburden = await overburdenRequest
      if (currentSelectionToken !== seamSelectionToken) return
      const boreholes = overburden?.data?.boreholes || []
      const best = boreholes.reduce((acc, cur) => {
        const accLen = acc?.layers?.length || 0
        const curLen = cur?.layers?.length || 0
        return curLen > accLen ? cur : acc
      }, boreholes[0])
      const layers = normalizeLayers(best?.layers || [])
      sortedLayers.value = layers.sort((a, b) => (a.z_top || 0) - (b.z_top || 0))
      await nextTick()
      drawStratigraphicColumn()
    })()
  } catch (err) {
    if (currentSelectionToken !== seamSelectionToken) return
    toast.add('加载煤层详情失败: ' + (err.response?.data?.detail || err.message), 'error')
  }
}

const startGeomodelJob = async () => {
  if (!selectedSeam.value?.name) {
    toast.add('请先选择煤层后再发起建模任务', 'warning')
    return
  }
  try {
    await submitGeomodelJob({
      method: geomodelMethod.value,
      seam_name: selectedSeam.value.name,
      resolution: geomodelResolution.value,
      output_formats: ['vtk', 'vtp', 'summary', 'quality']
    })
    toast.add('建模任务已提交，正在后台计算', 'success')
  } catch (err) {
    toast.add(geomodelError.value || '建模任务提交失败', 'error')
  }
}

const downloadGeomodelFile = async (artifactName) => {
  if (!geomodelJobId.value) return
  try {
    const response = await downloadGeomodelArtifact(geomodelJobId.value, artifactName)
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = artifactName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (err) {
    toast.add(err?.response?.data?.detail || '下载产物失败', 'error')
  }
}

// Interpolate
const handleInterpolate = async (options = {}) => {
  if (!selectedSeam.value) return

  const {
    presetKey = renderQuality.value,
    forceRefresh = false,
    silent = false,
    autoMode = false
  } = options

  const preset = renderQualityConfig[presetKey] || renderQualityConfig.standard
  const seamName = selectedSeam.value.name
  const requestToken = ++interpolateRequestToken
  loading.value = true
  interpolationStatus.value = autoMode
    ? `正在生成${preset.label}预览图...`
    : `正在渲染${preset.label}质量结果...`
  try {
    const { data } = await getSeamContourImages(
      seamName,
      method.value,
      gridSize.value,
      contourLevels.value,
      preset.dpi,
      preset.smoothSigma,
      { forceRefresh }
    )
    if (requestToken !== interpolateRequestToken) {
      return
    }

    applyContourResult(data)
    writeLastContourCache(seamName, data)

    // Calculate uncertainty map and draw other charts after DOM update
    await nextTick()
    scheduleUncertaintyCalculation()
    drawHistogram()
    markStepDone('Interpolation', {
      interpolationPoints: seamPoints.value.length || 0
    })
    if (!silent) {
      toast.add('等值线图生成完成', 'success')
    }
  } catch (err) {
    console.error('Interpolate error:', err)
    console.error('Error response:', err.response?.data)
    toast.add(err.response?.data?.detail || '生成等值线图失败', 'error')
  } finally {
    if (requestToken === interpolateRequestToken) {
      loading.value = false
      interpolationStatus.value = ''
    }
  }
}

// Calculate uncertainty map - matching 误差分布图绘制.py style
const scheduleUncertaintyCalculation = () => {
  if (typeof window === 'undefined') {
    calculateUncertainty()
    return
  }

  if (typeof window.cancelIdleCallback === 'function' && uncertaintyIdleHandle !== null) {
    window.cancelIdleCallback(uncertaintyIdleHandle)
    uncertaintyIdleHandle = null
  }
  if (uncertaintyTimer !== null) {
    window.clearTimeout(uncertaintyTimer)
    uncertaintyTimer = null
  }

  if (typeof window.requestIdleCallback === 'function') {
    uncertaintyIdleHandle = window.requestIdleCallback(() => {
      uncertaintyIdleHandle = null
      calculateUncertainty()
    }, { timeout: 240 })
    return
  }

  uncertaintyTimer = window.setTimeout(() => {
    uncertaintyTimer = null
    calculateUncertainty()
  }, 16)
}

const calculateUncertainty = () => {
  if (!seamPoints.value.length || !thicknessResult.value) {
    return
  }

  const canvas = uncertaintyCanvas.value
  if (!canvas) {
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const hostRect = canvas.parentElement?.getBoundingClientRect()
  const cssW = Math.max(720, Math.floor(hostRect?.width || 900))
  const cssH = Math.max(420, Math.floor(hostRect?.height || 550))
  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1

  canvas.width = Math.floor(cssW * dpr)
  canvas.height = Math.floor(cssH * dpr)
  canvas.style.width = `${cssW}px`
  canvas.style.height = `${cssH}px`

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  applyFigureRenderDefaults(ctx)
  const w = cssW
  const h = cssH

  const bounds = thicknessResult.value.bounds
  const hasValidBounds = bounds &&
    Number.isFinite(bounds.min_x) &&
    Number.isFinite(bounds.max_x) &&
    Number.isFinite(bounds.min_y) &&
    Number.isFinite(bounds.max_y) &&
    bounds.max_x > bounds.min_x &&
    bounds.max_y > bounds.min_y

  if (!hasValidBounds) return

  const points = seamPoints.value
    .map((p) => ({ x: Number(p.x), y: Number(p.y) }))
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))

  if (points.length === 0) return

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  // Draw area dimensions (matching Python script style)
  const padding = { left: 56, right: 48, top: 26, bottom: 76 }
  const drawW = w - padding.left - padding.right - 58  // Extra space for colorbar
  const drawH = h - padding.top - padding.bottom

  // Calculate uncertainty map with Gaussian smoothing
  const requestedGrid = Math.max(30, Number(gridSize.value) || 80)
  const baseResolution = UNCERTAINTY_RESOLUTION_BASE[renderQuality.value] || UNCERTAINTY_RESOLUTION_BASE.standard
  const resolution = Math.max(64, Math.min(144, Math.round((requestedGrid + baseResolution) / 2)))
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
  const sigma = renderQuality.value === 'high' ? 3 : (renderQuality.value === 'standard' ? 2.4 : 2)
  const kernelRadius = Math.max(1, Math.ceil(sigma * 2))
  for (let py = 0; py < resolution; py++) {
    smoothedMap[py] = []
    for (let px = 0; px < resolution; px++) {
      let sum = 0
      let weightSum = 0
      for (let dy = -kernelRadius; dy <= kernelRadius; dy++) {
        for (let dx = -kernelRadius; dx <= kernelRadius; dx++) {
          const ny = py + dy
          const nx = px + dx
          if (ny >= 0 && ny < resolution && nx >= 0 && nx < resolution) {
            const dist = Math.sqrt(dx*dx + dy*dy)
            const weight = Math.exp(-(dist*dist) / (2*sigma*sigma))
            const sample = uncertaintyMap[ny]?.[nx]
            if (!Number.isFinite(sample)) continue
            sum += sample * weight
            weightSum += weight
          }
        }
      }
      smoothedMap[py][px] = weightSum > 0 ? (sum / weightSum) : uncertaintyMap[py][px]
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
  ctx.fillStyle = FIGURE_STYLE.textColor
  ctx.font = figureFont(12)
  ctx.textAlign = 'left'
  ctx.fillText('高不确定性', legendBoxX + 32, legendBoxY + 40)

  // Borehole location dot
  ctx.beginPath()
  ctx.arc(legendBoxX + 17, legendBoxY + 18, boreholeRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#000000'
  ctx.fill()

  ctx.fillText('钻孔位置', legendBoxX + 32, legendBoxY + 22)

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
  ctx.fillStyle = FIGURE_STYLE.textColor
  ctx.font = figureFont(11)
  ctx.textAlign = 'left'
  ctx.fillText('0', scaleBoxX + 10, scaleBoxY + 22)
  ctx.textAlign = 'center'
  ctx.fillText('500', scaleBoxX + 75, scaleBoxY + 22)
  ctx.textAlign = 'right'
  ctx.fillText('1000 米', scaleBoxX + 120, scaleBoxY + 22)

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
  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(10)
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
  ctx.font = figureFont(11, 500)
  ctx.fillText('不确定性 (归一化)', 0, 0)
  ctx.restore()

  // Title (matching Python script style)
  ctx.fillStyle = FIGURE_STYLE.textColor
  ctx.font = figureFont(13, 700)
  ctx.textAlign = 'center'
  ctx.fillText('Fig. 3 | 插值不确定性分布', padding.left + drawW / 2, h - 28)

  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(10)
  ctx.fillText('红色区域表示较高不确定性，蓝色区域表示相对可靠。', padding.left + drawW / 2, h - 12)

}

// Draw histogram - Nature journal style
const drawHistogram = () => {
  const canvas = histogramCanvas.value
  if (!canvas) {
    return
  }
  if (seamPoints.value.length === 0) {
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = window.devicePixelRatio || 1
  const container = canvas.parentElement
  const cssW = container?.clientWidth || canvas.clientWidth || 500
  const cssH = container?.clientHeight || canvas.clientHeight || 350
  canvas.width = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)
  canvas.style.width = `${cssW}px`
  canvas.style.height = `${cssH}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  applyFigureRenderDefaults(ctx)
  const w = cssW
  const h = cssH

  const values = seamPoints.value
    .map((p) => Number(p.thickness))
    .filter((v) => Number.isFinite(v))
  if (values.length === 0) return

  // Calculate statistics
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
  const stdDev = Math.sqrt(variance)

  const valueSpan = maxVal - minVal
  const sortedValues = [...values].sort((a, b) => a - b)
  const q1 = sortedValues[Math.floor((sortedValues.length - 1) * 0.25)] ?? minVal
  const q3 = sortedValues[Math.floor((sortedValues.length - 1) * 0.75)] ?? maxVal
  const iqr = Math.max(q3 - q1, 0)
  const fdBinWidth = iqr > Number.EPSILON ? (2 * iqr) / Math.cbrt(sortedValues.length) : 0
  const roughBinCount = fdBinWidth > 0 && valueSpan > 0 ? Math.round(valueSpan / fdBinWidth) : 16
  const numBins = Math.max(10, Math.min(28, roughBinCount || 16))
  const binWidthVal = valueSpan > 0 ? valueSpan / numBins : 1

  // Calculate histogram bins
  const bins = Array(numBins).fill(0)
  for (const v of values) {
    const rawBin = valueSpan > 0
      ? Math.floor((v - minVal) / binWidthVal)
      : Math.floor(numBins / 2)
    const bin = Math.max(0, Math.min(rawBin, numBins - 1))
    bins[bin]++
  }

  const maxCount = Math.max(...bins)

  // Publication-style colors
  const histColor = '#5f8fb0'
  const curveColor = '#c5523a'
  const histAlpha = 0.85

  // Clear canvas - white background (Nature style)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  const padding = { left: 50, right: 25, top: 45, bottom: 45 }
  const drawW = w - padding.left - padding.right
  const drawH = h - padding.top - padding.bottom

  // Calculate bar width
  const barWidth = drawW / numBins
  const scaleY = drawH / (maxCount * 1.1)

  // Draw histogram bars - Nature style
  ctx.fillStyle = histColor
  ctx.globalAlpha = histAlpha

  for (let i = 0; i < numBins; i++) {
    const height = bins[i] * scaleY
    const x = padding.left + i * barWidth
    const y = h - padding.bottom - height

    if (height > 0) {
      // Draw bar
      ctx.fillRect(x, y, barWidth - 1, height)

      // White edge between bars (Nature style)
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 0.8
      ctx.strokeRect(x, y, barWidth - 1, height)
    }
  }
  ctx.globalAlpha = 1.0

  // Draw density fit curve (Normal distribution) - Nature style
  const canDrawDensityCurve = stdDev > Number.EPSILON && valueSpan > 0
  if (canDrawDensityCurve) {
    ctx.strokeStyle = curveColor
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let i = 0; i <= 100; i++) {
      const x = padding.left + (i / 100) * drawW
      const val = minVal + (i / 100) * valueSpan

      // Normal distribution PDF
      const pdf = (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
                  Math.exp(-0.5 * ((val - mean) / stdDev) ** 2)

      // Convert PDF to count scale
      const curveCount = pdf * values.length * binWidthVal
      const y = h - padding.bottom - curveCount * scaleY

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
  }

  // Draw axes - Nature style (only left and bottom, no top/right spines)
  ctx.strokeStyle = FIGURE_STYLE.axisColor
  ctx.lineWidth = 1.0

  // Left spine (Y-axis)
  ctx.beginPath()
  ctx.moveTo(padding.left, padding.top)
  ctx.lineTo(padding.left, h - padding.bottom)
  ctx.stroke()

  // Bottom spine (X-axis)
  ctx.beginPath()
  ctx.moveTo(padding.left, h - padding.bottom)
  ctx.lineTo(w - padding.right, h - padding.bottom)
  ctx.stroke()

  // Draw ticks - Nature style (outward facing)
  const tickLength = 4

  // X-axis ticks
  ctx.strokeStyle = FIGURE_STYLE.axisColor
  ctx.lineWidth = 1.0
  for (let i = 0; i <= 6; i++) {
    const x = padding.left + (i / 6) * drawW
    ctx.beginPath()
    ctx.moveTo(x, h - padding.bottom)
    ctx.lineTo(x, h - padding.bottom + tickLength)
    ctx.stroke()
  }

  // Y-axis ticks
  for (let i = 0; i <= 5; i++) {
    const y = h - padding.bottom - (i / 5) * drawH
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(padding.left - tickLength, y)
    ctx.stroke()
  }

  // X-axis labels - Nature style
  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(10)
  ctx.textAlign = 'center'
  for (let i = 0; i <= 6; i++) {
    const val = minVal + (i / 6) * (maxVal - minVal)
    const x = padding.left + (i / 6) * drawW
    ctx.fillText(val.toFixed(1), x, h - padding.bottom + 15)
  }

  // Y-axis labels - Nature style
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const count = Math.round((i / 5) * (maxCount * 1.1))
    const y = h - padding.bottom - (i / 5) * drawH
    ctx.fillText(count.toString(), padding.left - 6, y + 3)
  }

  // Axis labels - Nature style (normal weight, not bold)
  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(11)

  // X-axis label
  ctx.textAlign = 'center'
  ctx.fillText('厚度 (m)', padding.left + drawW / 2, h - 8)

  // Y-axis label
  ctx.save()
  ctx.translate(12, padding.top + drawH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('频数', 0, 0)
  ctx.restore()

  // Title - Nature style (left aligned, bold "Figure" format)
  ctx.fillStyle = FIGURE_STYLE.textColor
  ctx.font = figureFont(12, 700)
  ctx.textAlign = 'left'
  ctx.fillText('Fig. 1 | 煤层厚度频率分布 (n=' + values.length + ')', padding.left, 18)

  // Legend - Nature style (no frame)
  ctx.fillStyle = FIGURE_STYLE.textColor
  ctx.font = figureFont(10)
  ctx.textAlign = 'left'

  // Histogram legend
  const legendX = w - padding.right - 120
  const legendY = padding.top + 10

  // Histogram bar in legend
  ctx.fillStyle = histColor
  ctx.globalAlpha = histAlpha
  ctx.fillRect(legendX, legendY - 4, 12, 10)
  ctx.globalAlpha = 1.0
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 0.8
  ctx.strokeRect(legendX, legendY - 4, 12, 10)

  ctx.fillText('观测值', legendX + 16, legendY + 4)

  if (canDrawDensityCurve) {
    // Density fit legend
    ctx.strokeStyle = curveColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(legendX, legendY + 20)
    ctx.lineTo(legendX + 12, legendY + 20)
    ctx.stroke()

    ctx.fillStyle = '#000000'
    ctx.fillText('密度拟合', legendX + 16, legendY + 24)
  }

  // Statistics annotation (small text below legend)
  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(9, 400, true)
  ctx.textAlign = 'left'
  const statsText = `μ=${mean.toFixed(2)}  σ=${stdDev.toFixed(2)}`
  ctx.fillText(statsText, legendX, legendY + 42)

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
  const dpr = window.devicePixelRatio || 1
  const container = canvas.parentElement
  const cssW = container?.clientWidth || canvas.clientWidth || 280
  const cssH = container?.clientHeight || canvas.clientHeight || 500
  canvas.width = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)
  canvas.style.width = `${cssW}px`
  canvas.style.height = `${cssH}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  applyFigureRenderDefaults(ctx)
  const w = cssW
  const h = cssH

  // Background - Light theme
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, w, h)

  const layers = sortedLayers.value
  let totalDepth = Math.max(...layers.map(l => l.z_bottom || 0))
  if (!Number.isFinite(totalDepth) || totalDepth <= 0) {
    totalDepth = layers.reduce((sum, l) => sum + (Number(l.thickness) || 0), 0)
  }
  if (!Number.isFinite(totalDepth) || totalDepth <= 0) return

  const padding = { top: 24, bottom: 22 }
  const scale = (h - padding.top - padding.bottom) / totalDepth
  const topMargin = padding.top
  const axisGap = 14
  const labelArea = Math.max(110, Math.min(160, w * 0.3))
  const columnWidth = Math.max(80, Math.min(140, w * 0.22))
  const groupWidth = axisGap + columnWidth + 16 + labelArea
  const startX = Math.max(16, (w - groupWidth) / 2)
  const axisX = startX
  const columnX = axisX + axisGap
  const labelX = columnX + columnWidth + 16

  // Draw title (Nature style - Light theme)
  ctx.fillStyle = FIGURE_STYLE.textColor
  ctx.font = figureFont(12, 700)
  ctx.textAlign = 'left'
  ctx.fillText('Fig. 2 | 代表性钻孔地层柱状图', columnX, 18)

  // Draw depth scale (Nature style: ticks pointing inward)
  const tickSize = 4
  const depthStep = Math.max(5, Math.ceil(totalDepth / 6 / 5) * 5) || 10

  ctx.strokeStyle = FIGURE_STYLE.gridColor
  ctx.lineWidth = 1.0
  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(10)
  ctx.textAlign = 'right'

  // Y-axis line
  ctx.beginPath()
  ctx.moveTo(axisX, topMargin)
  ctx.lineTo(axisX, h - padding.bottom)
  ctx.stroke()

  for (let depth = 0; depth <= totalDepth; depth += depthStep) {
    const y = topMargin + depth * scale

    // Tick pointing right (inward)
    ctx.beginPath()
    ctx.moveTo(axisX, y)
    ctx.lineTo(axisX + tickSize, y)
    ctx.stroke()

    // Depth label
    ctx.fillText(`${Math.round(depth)} m`, axisX - 6, y + 3)
  }

  // Axis label
  ctx.save()
  ctx.translate(axisX - 28, topMargin + (h - padding.bottom - topMargin) / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(11)
  ctx.fillText('深度 (m)', 0, 0)
  ctx.restore()

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
      ctx.fillStyle = FIGURE_STYLE.subTextColor
      ctx.font = figureFont(10)
      ctx.textAlign = 'left'
      ctx.fillText(layer.name, labelX, yTop + layerHeight / 2 + 3)

      // Thickness value (smaller, monospace)
      ctx.fillStyle = '#2563EB'
      ctx.font = figureFont(9, 500, true)
      ctx.fillText(`${thickness.toFixed(1)}米`, labelX, yTop + layerHeight / 2 + 14)
    }
  })

  // Column border (Nature style)
  ctx.strokeStyle = '#94A3B8'
  ctx.lineWidth = 1.0
  ctx.strokeRect(columnX, topMargin, columnWidth, h - topMargin - padding.bottom)
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
  if (!ctx) return

  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1
  const w = Math.max(640, canvas.offsetWidth || 900)
  const h = 300
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

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
  if (!ctx) return
  applyFigureRenderDefaults(ctx)

  // Clear canvas - Light theme
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, w, h)

  if (!profile.length || !Number.isFinite(totalDistance) || totalDistance <= 0) {
    ctx.fillStyle = FIGURE_STYLE.subTextColor
    ctx.font = figureFont(14)
    ctx.textAlign = 'center'
    ctx.fillText('当前剖面线附近缺少可用埋深数据，请重选剖面线。', w / 2, h / 2)
    return
  }

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
  ctx.strokeStyle = FIGURE_STYLE.gridColor
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
  ctx.strokeStyle = FIGURE_STYLE.axisColor
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
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.75)'
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

  // Draw the burial depth profile (smoothed curve for publication quality)
  ctx.beginPath()
  // Use sandstone color for main profile line (matching Python script)
  ctx.strokeStyle = geoColors.sandstone
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const screenPoints = profile.map((p) => ({
    x: padding.left + (p.distance / totalDistance) * drawW,
    y: h - padding.bottom - ((p.depth - minDepth) / depthRange) * drawH
  }))
  ctx.moveTo(screenPoints[0].x, screenPoints[0].y)
  if (screenPoints.length > 2) {
    for (let i = 1; i < screenPoints.length - 1; i++) {
      const xc = (screenPoints[i].x + screenPoints[i + 1].x) / 2
      const yc = (screenPoints[i].y + screenPoints[i + 1].y) / 2
      ctx.quadraticCurveTo(screenPoints[i].x, screenPoints[i].y, xc, yc)
    }
    const last = screenPoints[screenPoints.length - 1]
    const prev = screenPoints[screenPoints.length - 2]
    ctx.quadraticCurveTo(prev.x, prev.y, last.x, last.y)
  } else if (screenPoints.length === 2) {
    ctx.lineTo(screenPoints[1].x, screenPoints[1].y)
  }

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
      ctx.fillStyle = FIGURE_STYLE.subTextColor
      ctx.font = figureFont(10)
      ctx.textAlign = 'center'
      const label = borehole.borehole || borehole.name || ''
      if (label) {
        ctx.fillText(label, x, y - 10)
      }
    }
  }

  // Draw axes labels (Nature style - Light theme)
  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(11)
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
  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(12)
  ctx.textAlign = 'center'

  // X-axis title
  ctx.fillText('剖面距离 (米)', padding.left + drawW / 2, h - 5)

  // Y-axis title (rotated)
  ctx.save()
  ctx.translate(12, padding.top + drawH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('埋藏深度 (米)', 0, 0)
  ctx.restore()

  // Title (Nature style: Figure label format - Light theme)
  ctx.fillStyle = FIGURE_STYLE.textColor
  ctx.font = figureFont(13, 700)
  ctx.textAlign = 'left'
  ctx.fillText(`Fig. 4 | 剖面 A-A' 深度分布 (${minDepth.toFixed(1)}-${maxDepth.toFixed(1)} m)`, padding.left, 18)

  // Scale bar
  const preferredScale = Math.max(10, totalDistance / 4)
  const scaleCandidates = [10, 20, 50, 100, 200, 500, 1000]
  let scaleMeters = scaleCandidates[0]
  for (const candidate of scaleCandidates) {
    if (candidate <= preferredScale) scaleMeters = candidate
  }
  const scaleLength = Math.max(34, Math.min(110, (scaleMeters / totalDistance) * drawW))
  const scaleBarX = w - padding.right - scaleLength - 16
  const scaleBarY = h - padding.bottom + 12

  ctx.strokeStyle = FIGURE_STYLE.axisColor
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

  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(10, 500)
  ctx.textAlign = 'center'
  ctx.fillText(`比例尺: ${Math.round(scaleMeters)} m`, scaleBarX + scaleLength / 2, scaleBarY + 12)
}

const resetCrossSection = () => {
  crossSectionMode.value = false
  crossSectionData.value = { line: null, points: [], depthProfile: [], distance: null, hasData: false }
  if (crossSectionCanvas.value) {
    const ctx = crossSectionCanvas.value.getContext('2d')
    ctx.clearRect(0, 0, crossSectionCanvas.value.width, crossSectionCanvas.value.height)
  }
}

const goPressureAnalysis = () => {
  router.push({
    name: 'AcademicAlgorithm',
    query: selectedSeam.value?.name ? { seam: selectedSeam.value.name } : undefined
  })
}

const normalizeQuerySeam = (value) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value : ''
}

const normalizeQueryJobId = (value) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value.trim() : ''
}

onMounted(async () => {
  await loadSeams()
  const preferredJobId = normalizeQueryJobId(route.query?.geomodel_job_id || route.query?.geomodelJobId)
  if (preferredJobId) {
    geomodelJobId.value = preferredJobId
    try {
      await refreshGeomodelJob()
    } catch (err) {
      toast.add('读取 Geomodel 任务状态失败: ' + (err?.response?.data?.detail || err?.message || ''), 'warning')
    }
  }
  const preferredName = normalizeQuerySeam(route.query?.seam) || workspaceState.selectedSeam
  if (!preferredName) return
  const preferred = availableSeams.value.find((item) => item.name === preferredName)
  if (preferred) {
    await selectSeam(preferred)
  }
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
.params-card { grid-column: span 4; }
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
.quality-tabs .tab-btn { padding: 8px 12px; font-size: 12px; }
.quality-hint { margin-top: 6px; justify-content: flex-start; color: var(--text-tertiary); }

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
.status-text { margin: var(--spacing-md) 0 0; font-size: 12px; color: var(--text-secondary); }

.geomodel-panel { margin-top: var(--spacing-lg); padding: 12px; border-radius: var(--border-radius-md); border: 1px solid var(--border-color); background: #ffffff; }
.geomodel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.geomodel-title { font-size: 13px; font-weight: 700; color: var(--text-primary); }
.geomodel-jobid { font-size: 11px; color: var(--text-secondary); font-family: monospace; }
.geomodel-controls { display: grid; grid-template-columns: 1.5fr 1fr auto; gap: 8px; align-items: center; }
.geomodel-select { height: 34px; border-radius: 8px; border: 1px solid var(--border-color); padding: 0 10px; background: #fff; font-size: 12px; }
.geomodel-range { display: flex; align-items: center; gap: 6px; }
.geomodel-range label { font-size: 11px; color: var(--text-secondary); }
.geomodel-range input { width: 74px; height: 32px; border-radius: 8px; border: 1px solid var(--border-color); padding: 0 8px; font-size: 12px; }
.geomodel-btn { height: 34px; padding: 0 12px; font-size: 12px; }
.geomodel-status { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 10px; font-size: 11px; color: var(--text-secondary); }
.geomodel-error { margin-top: 8px; margin-bottom: 0; font-size: 11px; color: #b91c1c; }
.geomodel-summary { margin-top: 10px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.summary-item { border: 1px solid var(--border-color); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 4px; }
.summary-item span { font-size: 10px; color: var(--text-secondary); }
.summary-item strong { font-size: 13px; color: var(--text-primary); font-family: monospace; }
.geomodel-files { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; }
.file-chip { border: 1px solid var(--border-color); background: #f8fafc; color: var(--text-primary); border-radius: 999px; padding: 4px 10px; font-size: 11px; cursor: pointer; }
.file-chip:hover { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-primary-light); }

/* Cards */
.grid > .card:nth-child(2) { grid-column: span 4; }
.grid > .card:nth-child(3) { grid-column: span 4; }
.grid > .card:nth-child(4) { grid-column: span 4; }
.compact-card { padding: 16px; }
.histogram-wrapper, .stratigraphic-wrapper { background: #ffffff; border-radius: var(--border-radius-md); padding: var(--spacing-md); display: flex; align-items: center; justify-content: center; min-height: 260px; }
.histogram-canvas { max-width: 100%; max-height: 100%; width: 100%; }
.stratigraphic-canvas { width: 100%; height: 300px; max-height: none; }

/* Statistics Grid - Nature style */
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-sm); padding: var(--spacing-sm) var(--spacing-md); background: white; border-top: 1px solid #e5e7eb; }
.stat-item { display: flex; flex-direction: column; align-items: center; padding: var(--spacing-xs); }
.stat-item .stat-label { font-size: 10px; color: #666666; font-weight: 400; }
.stat-item .stat-value { font-size: 13px; color: #000000; font-weight: 500; font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace; }

/* Toggle */
.toggle-group { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.toggle-btn { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-md); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); cursor: pointer; transition: all var(--transition-fast); background: white; }
.toggle-btn:hover { border-color: var(--color-primary); background: var(--color-primary-light); }
.toggle-btn input { width: 16px; height: 16px; accent-color: var(--color-primary); cursor: pointer; }
.toggle-btn span { font-size: 14px; color: var(--color-secondary); font-weight: 500; }
.hint-text { margin-top: var(--spacing-md); padding: var(--spacing-md); background: var(--color-warning-light); border-radius: var(--border-radius-sm); font-size: 12px; color: #B45309; line-height: 1.5; }

/* Legend */
.lithology-legend-compact { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px 10px; margin-top: var(--spacing-md); }
.legend-item-compact { display: flex; align-items: center; gap: 6px; font-size: 10px; }
.legend-item-compact .legend-color { width: 10px; height: 10px; border-radius: 3px; border: 1px solid var(--border-color); flex-shrink: 0; }
.legend-item-compact .legend-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.legend-item-compact .legend-name { color: var(--color-secondary); font-weight: 500; }

/* Map Cards */
.map-row { grid-column: span 12; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--spacing-lg); }
.map-row .map-card-large { grid-column: auto; }
.map-card-large { grid-column: span 6; display: flex; flex-direction: column; }
.map-card-full { grid-column: span 12; }
.map-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-lg); padding-bottom: var(--spacing-lg); border-bottom: 1px solid var(--border-color); }
.section-badge { display: inline-block; padding: 4px 10px; background: var(--color-warning-light); color: var(--color-warning); font-size: 11px; font-weight: 700; font-family: monospace; border-radius: var(--border-radius-sm); margin-left: var(--spacing-sm); }
.map-wrapper {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cross-section-wrapper {
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: #f8fafc;
  min-height: 320px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.map-wrapper :deep(.contour-map-wrapper) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-wrapper :deep(.contour-image) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.uncertainty-wrapper {
  min-height: 500px;
  height: 500px;
}

.uncertainty-canvas {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  border-radius: var(--border-radius-md);
  display: block;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-secondary);
  background:
    radial-gradient(circle at 22% 18%, rgba(15, 118, 110, 0.08), transparent 42%),
    linear-gradient(145deg, #f9fbfb 0%, #f2f7f5 100%);
}

.map-placeholder p {
  margin: 0;
  font-size: 13px;
}

.map-placeholder .spinner {
  border-color: rgba(15, 118, 110, 0.2);
  border-top-color: var(--color-primary);
}

.cross-section-wrapper {
  min-height: 320px;
  height: 320px;
}

.cross-section-canvas {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  display: block;
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
@media (max-width: 1400px) { .params-card, .grid > .card:nth-child(2), .grid > .card:nth-child(3), .grid > .card:nth-child(4) { grid-column: span 6; } .map-row { grid-template-columns: 1fr; } .map-card-large { grid-column: span 12; } }
@media (max-width: 1024px) { .grid { grid-template-columns: 1fr; } .params-card, .grid > .card, .map-card-large, .map-card-full { grid-column: span 1; } .header-stats { flex-wrap: wrap; } .seam-selection-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); } .stats-grid { grid-template-columns: repeat(2, 1fr); } .geomodel-controls { grid-template-columns: 1fr; } .geomodel-summary { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .action-buttons { flex-direction: column; } .btn { width: 100%; } .map-wrapper, .uncertainty-wrapper, .cross-section-wrapper { min-height: 300px; } .map-wrapper :deep(.contour-map), .uncertainty-canvas, .cross-section-canvas { height: 300px; } .seam-selection-grid { grid-template-columns: 1fr; max-height: 400px; } .stats-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
