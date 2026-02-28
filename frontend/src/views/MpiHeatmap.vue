<template>
  <div class="page mpi-heatmap-page">
    <PageHeader class="main-header" :title="tx.pageTitle" :description="tx.pageDescription" />

    <div class="mpi-layout">
      <div class="left-panel">
        <Card>
          <h3 class="section-title">{{ tx.workfaceFileTitle }}</h3>
          <p class="section-desc">{{ tx.workfaceFileDesc }}</p>

          <div class="upload-box" @click="triggerWorkfaceUpload" tabindex="0" @keydown.enter="triggerWorkfaceUpload">
            <input ref="workfaceInput" type="file" accept=".csv,.json,.txt" @change="onWorkfaceFile" style="display:none">
            <div class="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <div class="upload-text">{{ tx.uploadWorkfaceFile }}</div>
            <div class="upload-hint">{{ tx.uploadHint }}</div>
          </div>

          <div class="helper-text">{{ tx.helperText }}</div>

          <div class="sample-actions">
            <button class="btn ghost" @click.stop="downloadSample('csv')">{{ tx.downloadCsvSample }}</button>
            <button class="btn ghost" @click.stop="downloadSample('json')">{{ tx.downloadJsonSample }}</button>
          </div>

          <div v-if="workfaces.length" class="workface-list">
            <div class="workface-header">
              <span>{{ tx.parsedPrefix }} {{ workfaces.length }} {{ tx.parsedSuffix }}</span>
              <button class="btn small ghost" @click="clearWorkfaces">{{ tx.clearText }}</button>
            </div>
            <div class="workface-items">
              <button
                v-for="(face, idx) in workfaces"
                :key="face.name + idx"
                :class="['workface-btn', { active: activeWorkfaceIndex === idx }]"
                @click="activeWorkfaceIndex = idx"
              >
                {{ face.name || `${tx.workfaceNamePrefix} ${idx + 1}` }}
                <span class="workface-type">{{ face.type === 'polygon' ? tx.polygonText : tx.rectText }}</span>
              </button>
            </div>
          </div>

          <EmptyState v-else :title="tx.emptyWorkfaceTitle" :description="tx.emptyWorkfaceDesc" />
        </Card>

        <Card>
          <h3 class="section-title">{{ tx.computeSettingsTitle }}</h3>
          <div class="param-group">
            <label class="param-label">{{ tx.seamLabel }}</label>
            <select v-model="seam" class="param-select">
              <option v-for="item in seams" :key="item.name" :value="item.name">{{ item.name }}</option>
            </select>
          </div>
          <div class="param-group">
            <label class="param-label">{{ tx.methodLabel }}</label>
            <select v-model="method" class="param-select">
              <option value="idw">IDW</option>
              <option value="linear">Linear</option>
              <option value="nearest">Nearest</option>
            </select>
          </div>
          <div class="param-group">
            <label class="param-label">{{ tx.gridSizeLabel }}</label>
            <input v-model.number="gridSize" type="number" min="20" max="200" class="param-input">
          </div>

          <div class="action-buttons">
            <button class="btn primary" @click="handleMpiCompute" :disabled="loading || !seam">
              <span v-if="loading" class="spinner sm"></span>
              {{ loading ? tx.computingText : tx.computeBtnText }}
            </button>
            <button class="btn secondary" @click="refreshHeatmapImage" :disabled="loading || !hasGrid">
              {{ tx.refreshImageText }}
            </button>
          </div>
        </Card>

        <Card>
          <h3 class="section-title">{{ tx.displaySettingsTitle }}</h3>
          <div class="toggle-row">
            <label class="toggle-item">
              <input type="checkbox" v-model="showBoundary">
              {{ tx.showBoundaryText }}
            </label>
            <label class="toggle-item">
              <input type="checkbox" v-model="showMask">
              {{ tx.showMaskText }}
            </label>
          </div>
          <div class="param-group">
            <label class="param-label">{{ tx.renderModeLabel }}</label>
            <div class="mode-tabs">
              <button :class="['mode-tab', { active: renderMode === 'image' }]" @click="renderMode = 'image'">{{ tx.imageModeText }}</button>
              <button :class="['mode-tab', { active: renderMode === 'canvas' }]" @click="renderMode = 'canvas'">Canvas</button>
            </div>
          </div>
        </Card>
      </div>

      <div class="right-panel">
        <Card>
          <div class="heatmap-header">
            <h3 class="section-title">{{ tx.resultTitle }}</h3>
            <div class="heatmap-actions">
              <span v-if="activeWorkface" class="tag">{{ tx.currentWorkfacePrefix }}{{ activeWorkface.name }}</span>
              <span v-else class="tag ghost">{{ tx.noWorkfaceSelected }}</span>
            </div>
          </div>

          <div v-if="activeWorkface?.bounds" class="workface-bounds">
            {{ tx.rangePrefix }} X {{ activeWorkface.bounds.min_x }} ~ {{ activeWorkface.bounds.max_x }}，
            Y {{ activeWorkface.bounds.min_y }} ~ {{ activeWorkface.bounds.max_y }}
          </div>

          <MpiHeatmapViewer
            :mode="renderMode"
            :image-url="imageUrl"
            :grid="grid || []"
            :bounds="gridBounds"
            :workface="activeWorkface"
            :show-boundary="showBoundary"
            :show-mask="showMask"
            :palette="odiPalette"
            :loading="loading"
            @hover="hoverInfo = $event"
            @imageError="handleImageError"
          />

          <SkeletonPanel v-if="loading && !hasGrid" :rows="4" compact />
          <template v-else-if="hasGrid">
            <div class="legend">
              <div class="legend-label">{{ tx.legendLabel }}</div>
              <div class="legend-bar" :style="{ background: legendGradient }"></div>
              <div class="legend-scale">
                <span>{{ tx.highRiskLowMpi }}</span>
                <span>{{ tx.lowRiskHighMpi }}</span>
              </div>
            </div>

            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">{{ tx.minLabel }}</span>
                <span class="stat-value">{{ stats.min?.toFixed(2) || '-' }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ tx.maxLabel }}</span>
                <span class="stat-value">{{ stats.max?.toFixed(2) || '-' }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ tx.meanLabel }}</span>
                <span class="stat-value">{{ stats.mean?.toFixed(2) || '-' }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ tx.hoverLabel }}</span>
                <span class="stat-value">{{ hoverInfo?.value?.toFixed(2) || '-' }}</span>
              </div>
            </div>
          </template>
          <EmptyState v-else :title="tx.emptyMpiTitle" :description="tx.emptyMpiDesc" />
        </Card>
      </div>
    </div>
  </div>
</template>
          <EmptyState
            v-else
            title="鏆傛棤 MPI 鏁版嵁"
            description="璇烽€夋嫨鐓ゅ眰骞舵墽琛?MPI 璁＄畻銆?
          />
        </Card>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '../composables/useToast'
import MpiHeatmapViewer from '../components/MpiHeatmapViewer.vue'
import { Card, EmptyState, PageHeader, SkeletonPanel } from '../components/library'
import {
  getCoalSeams,
  getSeamOverburden,
  getRockParams,
  mpiInterpolate,
  parseMpiWorkfaces,
  mpiHeatmapImage
} from '../api'
import { LRUCache } from '../lib/lruCache'

const toast = useToast()
const seams = ref([])
const seam = ref('')
const method = ref('idw')
const gridSize = ref(80)
const loading = ref(false)

const workfaces = ref([])
const activeWorkfaceIndex = ref(0)
const showBoundary = ref(true)
const showMask = ref(true)
const renderMode = ref('image')
const imageUrl = ref('')
const grid = ref(null)
const gridBounds = ref(null)
const stats = ref({})
const hoverInfo = ref(null)

const tx = {
  pageTitle: '\u004d\u0050\u0049 \u70ed\u529b\u56fe\u5206\u6790',
  pageDescription: '\u72ec\u7acb\u5c55\u793a MPI \u7efc\u5408\u6307\u6807\u5206\u5e03\uff0c\u652f\u6301\u591a\u5de5\u4f5c\u9762\u4e0a\u4f20\u3001\u5207\u6362\u4e0e\u70ed\u529b\u56fe\u6e32\u67d3\u3002',
  workfaceFileTitle: '\u5de5\u4f5c\u9762\u5750\u6807\u6587\u4ef6',
  workfaceFileDesc: '\u4e0a\u4f20\u591a\u5de5\u4f5c\u9762\u5750\u6807\u6587\u4ef6\uff08\u77e9\u5f62\u4e3a\u4e3b\uff0c\u591a\u8fb9\u5f62\u53ef\u9009\uff09',
  uploadWorkfaceFile: '\u4e0a\u4f20\u5de5\u4f5c\u9762\u5750\u6807\u6587\u4ef6',
  uploadHint: '\u652f\u6301 CSV / JSON / TXT',
  helperText: '\u672a\u4e0a\u4f20\u5de5\u4f5c\u9762\u65f6\uff0c\u5c06\u4f7f\u7528\u5168\u90e8\u7f51\u683c\u8fb9\u754c\u8fdb\u884c\u6e32\u67d3\u3002',
  downloadCsvSample: '\u4e0b\u8f7d CSV \u793a\u4f8b',
  downloadJsonSample: '\u4e0b\u8f7d JSON \u793a\u4f8b',
  parsedPrefix: '\u5df2\u89e3\u6790',
  parsedSuffix: '\u4e2a\u5de5\u4f5c\u9762',
  clearText: '\u6e05\u7a7a',
  workfaceNamePrefix: '\u5de5\u4f5c\u9762',
  polygonText: '\u591a\u8fb9\u5f62',
  rectText: '\u77e9\u5f62',
  emptyWorkfaceTitle: '\u6682\u65e0\u5de5\u4f5c\u9762\u6587\u4ef6',
  emptyWorkfaceDesc: '\u8bf7\u4e0a\u4f20 CSV / JSON / TXT \u5de5\u4f5c\u9762\u5750\u6807\u6587\u4ef6\u3002',
  computeSettingsTitle: 'MPI \u8ba1\u7b97\u8bbe\u7f6e',
  seamLabel: '\u7164\u5c42',
  methodLabel: '\u63d2\u503c\u65b9\u6cd5',
  gridSizeLabel: '\u7f51\u683c\u5206\u8fa8\u7387',
  computingText: '\u8ba1\u7b97\u4e2d...',
  computeBtnText: '\u8ba1\u7b97 MPI \u70ed\u529b\u56fe',
  refreshImageText: '\u5237\u65b0\u56fe\u50cf',
  displaySettingsTitle: '\u663e\u793a\u8bbe\u7f6e',
  showBoundaryText: '\u663e\u793a\u8fb9\u754c',
  showMaskText: '\u663e\u793a\u906e\u7f69',
  renderModeLabel: '\u6e32\u67d3\u6a21\u5f0f',
  imageModeText: '\u56fe\u50cf',
  resultTitle: 'MPI \u7efc\u5408\u6307\u6807\u5206\u5e03',
  currentWorkfacePrefix: '\u5f53\u524d\uff1a',
  noWorkfaceSelected: '\u672a\u9009\u62e9\u5de5\u4f5c\u9762',
  rangePrefix: '\u8303\u56f4\uff1a',
  legendLabel: 'MPI \u98ce\u9669\u6e10\u53d8\uff08ODI \u8272\u76d8\uff09',
  highRiskLowMpi: '\u9ad8\u98ce\u9669\uff08\u4f4e MPI\uff09',
  lowRiskHighMpi: '\u4f4e\u98ce\u9669\uff08\u9ad8 MPI\uff09',
  minLabel: '\u6700\u5c0f\u503c',
  maxLabel: '\u6700\u5927\u503c',
  meanLabel: '\u5e73\u5747\u503c',
  hoverLabel: '\u60ac\u505c\u503c',
  emptyMpiTitle: '\u6682\u65e0 MPI \u6570\u636e',
  emptyMpiDesc: '\u8bf7\u9009\u62e9\u7164\u5c42\u5e76\u6267\u884c MPI \u8ba1\u7b97\u3002',
  loadSeamsError: '\u52a0\u8f7d\u7164\u5c42\u5931\u8d25',
  parseWorkfaceSuccessPrefix: '\u5df2\u5bfc\u5165',
  parseWorkfaceSuccessSuffix: '\u4e2a\u5de5\u4f5c\u9762',
  parseWorkfaceError: '\u5de5\u4f5c\u9762\u89e3\u6790\u5931\u8d25',
  noBoreholesError: '\u5f53\u524d\u7164\u5c42\u65e0\u53ef\u7528\u94bb\u5b54\u6570\u636e',
  computeDone: 'MPI \u70ed\u529b\u56fe\u8ba1\u7b97\u5b8c\u6210',
  computeError: 'MPI \u8ba1\u7b97\u5931\u8d25',
  boundsWarning: '\u5de5\u4f5c\u9762\u8303\u56f4\u8d85\u51fa MPI \u7f51\u683c\u8fb9\u754c\uff0c\u663e\u793a\u53ef\u80fd\u88ab\u88c1\u526a',
  imageBuildError: '\u70ed\u529b\u56fe\u56fe\u50cf\u751f\u6210\u5931\u8d25',
  imageFallbackWarning: '\u56fe\u50cf\u52a0\u8f7d\u5931\u8d25\uff0c\u5df2\u5207\u6362\u5230 Canvas \u6a21\u5f0f',
  switchWorkfaceInfo: '\u5de5\u4f5c\u9762\u5df2\u5207\u6362\uff0c\u8bf7\u91cd\u65b0\u8ba1\u7b97 MPI \u70ed\u529b\u56fe'
}

const layerParamsCache = new LRUCache(120)

const odiPalette = [
  '#0e7490',
  '#14b8a6',
  '#facc15',
  '#fb923c',
  '#dc2626'
]

const legendGradient = computed(() => `linear-gradient(90deg, ${odiPalette.join(', ')})`)
const hasGrid = computed(() => Array.isArray(grid.value) && grid.value.length > 0)

const activeWorkface = computed(() => {
  if (!workfaces.value.length) return null
  return workfaces.value[Math.min(activeWorkfaceIndex.value, workfaces.value.length - 1)] || null
})

const triggerWorkfaceUpload = () => {
  workfaceInput.value?.click()
}

const workfaceInput = ref(null)

const saveWorkfaces = () => {
  localStorage.setItem('mpi-workfaces', JSON.stringify(workfaces.value))
}

const loadWorkfaces = () => {
  const raw = localStorage.getItem('mpi-workfaces')
  if (!raw) return
  try {
    workfaces.value = JSON.parse(raw) || []
  } catch (e) {
    workfaces.value = []
  }
}

const clearWorkfaces = () => {
  workfaces.value = []
  activeWorkfaceIndex.value = 0
  saveWorkfaces()
}

const onWorkfaceFile = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const { data } = await parseMpiWorkfaces(file)
    workfaces.value = data.workfaces || []
    activeWorkfaceIndex.value = 0
    saveWorkfaces()
    toast.add(${tx.parseWorkfaceSuccessPrefix}  , 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || tx.parseWorkfaceError, 'error')
  }
}

const downloadSample = (type) => {
  if (type === 'csv') {
    const content = 'name,xmin,xmax,ymin,ymax\n\u5de5\u4f5c\u9762A,100,400,200,600\n\u5de5\u4f5c\u9762B,450,750,150,500\n'
    triggerDownload(content, 'workfaces_example.csv', 'text/csv')
    return
  }

  const payload = {
    workfaces: [
      {
        name: '\u5de5\u4f5c\u9762A',
        bounds: { min_x: 100, max_x: 400, min_y: 200, max_y: 600 }
      },
      {
        name: '\u5de5\u4f5c\u9762B',
        points: [
          [450, 150],
          [750, 150],
          [720, 500],
          [480, 520]
        ]
      }
    ]
  }
  triggerDownload(JSON.stringify(payload, null, 2), 'workfaces_example.json', 'application/json')
}

const triggerDownload = (content, filename, type) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const loadSeams = async () => {
  try {
    const { data } = await getCoalSeams()
    seams.value = data.seams || []
    if (!seam.value && seams.value.length) {
      seam.value = seams.value[0].name
    }
  } catch (err) {
    toast.add(tx.loadSeamsError, 'error')
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
    layerParamsCache.set(name, null)
    return null
  }
}

const buildMpiPoints = async (boreholes = []) => {
  const points = []
  for (const borehole of boreholes) {
    const layers = borehole.layers || []
    const seamLayer = layers.find(l => l.name === seam.value)
    const strataLayers = layers.filter(l => l.name !== seam.value)

    const strata = []
    for (const layer of strataLayers) {
      const params = await getLayerParams(layer.name)
      strata.push({
        thickness: layer.thickness || 0,
        name: layer.name || '',
        density: params?.density,
        bulk_modulus: params?.bulk_modulus,
        shear_modulus: params?.shear_modulus,
        cohesion: params?.cohesion,
        friction_angle: params?.friction_angle,
        tensile_strength: params?.tensile_strength,
        compressive_strength: params?.compressive_strength,
        elastic_modulus: params?.elastic_modulus,
        poisson_ratio: params?.poisson_ratio
      })
    }

    const burialDepth = borehole.seam_top_depth ?? borehole.total_overburden_thickness ?? 0
    const thickness = seamLayer?.thickness || 0

    points.push({
      x: borehole.x,
      y: borehole.y,
      borehole: borehole.name,
      thickness,
      burial_depth: burialDepth,
      z_top: burialDepth,
      z_bottom: burialDepth + thickness,
      strata
    })
  }
  return points
}

const handleMpiCompute = async () => {
  if (!seam.value) return
  loading.value = true
  try {
    const { data } = await getSeamOverburden(seam.value)
    const boreholes = data.boreholes || []
    if (!boreholes.length) {
      toast.add(tx.loadSeamsError, 'error')
      return
    }

    const points = await buildMpiPoints(boreholes)
    const bounds = activeWorkface.value?.bounds || null

    const { data: mpiData } = await mpiInterpolate(points, gridSize.value, method.value, null, bounds)
    grid.value = mpiData.grid
    gridBounds.value = mpiData.bounds
    stats.value = mpiData.statistics || {}

    if (activeWorkface.value?.bounds) {
      validateWorkfaceBounds(activeWorkface.value.bounds, mpiData.bounds)
    }

    if (renderMode.value === 'image') {
      await refreshHeatmapImage()
    }

    toast.add(tx.computeDone, 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || tx.parseWorkfaceError, 'error')
  } finally {
    loading.value = false
  }
}

const validateWorkfaceBounds = (workfaceBounds, gridBounds) => {
  if (!workfaceBounds || !gridBounds) return
  const outX = workfaceBounds.min_x < gridBounds.min_x || workfaceBounds.max_x > gridBounds.max_x
  const outY = workfaceBounds.min_y < gridBounds.min_y || workfaceBounds.max_y > gridBounds.max_y
  if (outX || outY) {
    toast.add(tx.boundsWarning, 'warning')
  }
}

const refreshHeatmapImage = async () => {
  if (!grid.value || !gridBounds.value) return
  try {
    const title = activeWorkface.value?.name ? MPI \u70ed\u529b\u56fe -  : 'MPI \u70ed\u529b\u56fe'
      ? `MPI \u70ed\u529b\u56fe - ${activeWorkface.value.name}`
      : 'MPI \u70ed\u529b\u56fe'
    const { data } = await mpiHeatmapImage({
      grid: grid.value,
      bounds: gridBounds.value,
      title,
      property_name: 'MPI',
      num_levels: 12,
      dpi: 200,
      smooth_sigma: 1.0,
      colormap: 'odi'
    })
    imageUrl.value = `data:image/png;base64,${data.image}`
  } catch (err) {
    toast.add(err.response?.data?.detail || tx.parseWorkfaceError, 'error')
  }
}

const handleImageError = () => {
  if (renderMode.value !== 'image') return
  renderMode.value = 'canvas'
  toast.add(tx.boundsWarning, 'warning')
}

watch(renderMode, async (value) => {
  if (value === 'image' && grid.value && !imageUrl.value) {
    await refreshHeatmapImage()
  }
})

watch(activeWorkfaceIndex, () => {
  if (!grid.value) return
  grid.value = null
  gridBounds.value = null
  imageUrl.value = ''
  stats.value = {}
  toast.add(tx.switchWorkfaceInfo, 'info')
})

onMounted(() => {
  loadSeams()
  loadWorkfaces()
})
</script>

<style scoped>
.mpi-heatmap-page {
  animation: pageIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-header {
  margin-bottom: var(--spacing-3xl);
}

.mpi-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: var(--spacing-2xl);
  align-items: start;
}

.left-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.card {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
  border-color: var(--color-primary);
}

.card:hover::before {
  opacity: 1;
}

.section-title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  letter-spacing: -0.01em;
}

.section-desc {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.upload-box {
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  text-align: center;
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.upload-box:hover {
  border-color: var(--color-primary);
  background: var(--bg-tertiary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.upload-box:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.upload-box:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.upload-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin: 0 auto var(--spacing-sm);
  background: var(--color-primary-light);
  border-radius: var(--border-radius-sm);
  color: var(--color-primary);
  transition: all var(--transition-normal);
}

.upload-box:hover .upload-icon {
  transform: scale(1.05);
  background: var(--color-primary);
  color: white;
}

.upload-icon svg {
  width: 24px;
  height: 24px;
}

.upload-text {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.upload-hint {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: var(--spacing-xs);
}

.helper-text {
  margin-top: var(--spacing-sm);
  font-size: 12px;
  color: var(--text-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border-left: 3px solid var(--color-info);
}

.sample-actions {
  margin-top: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.workface-list {
  margin-top: var(--spacing-lg);
}

.workface-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
}

.workface-items {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  max-height: 240px;
  overflow-y: auto;
  padding: var(--spacing-xs);
}

.workface-items::-webkit-scrollbar {
  width: 6px;
}

.workface-items::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 3px;
}

.workface-items::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.workface-items::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

.workface-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  position: relative;
  overflow: hidden;
}

.workface-btn:hover {
  border-color: var(--color-primary);
  background: var(--bg-secondary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.workface-btn.active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-md);
}

.workface-type {
  background: rgba(0, 0, 0, 0.06);
  color: inherit;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.workface-btn.active .workface-type {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.empty-tip {
  text-align: center;
  color: var(--text-tertiary);
  margin-top: var(--spacing-md);
  padding: var(--spacing-xl) var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  border: 1px dashed var(--border-color);
}

.empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0 auto var(--spacing-sm);
  background: var(--bg-tertiary);
  border-radius: var(--border-radius-md);
  color: var(--text-tertiary);
}

.empty-icon svg {
  width: 24px;
  height: 24px;
}

.param-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.param-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.param-input,
.param-select {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-3) var(--spacing-3);
  font-size: 14px;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.param-input:hover,
.param-select:hover {
  border-color: var(--color-secondary);
  background: var(--bg-elevated);
}

.param-input:focus,
.param-select:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--bg-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.param-input:disabled,
.param-select:disabled {
  background: var(--bg-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-top: var(--spacing-md);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-3) var(--spacing-4);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn:hover:not(:disabled)::before {
  left: 100%;
}

.btn.primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn.primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none;
}

.btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.btn.secondary:hover:not(:disabled) {
  background: var(--border-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn.small {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: 12px;
}

.btn.ghost {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  box-shadow: none;
}

.btn.ghost:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.toggle-row {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-md);
}

.toggle-item {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  user-select: none;
}

.toggle-item:hover {
  background: var(--bg-tertiary);
}

.toggle-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.mode-tabs {
  display: flex;
  gap: var(--spacing-sm);
}

.mode-tab {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
  text-align: center;
}

.mode-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.mode-tab.active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-sm);
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag {
  background: var(--color-info-light);
  color: var(--color-info);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border-color);
}

.tag.ghost {
  background: var(--bg-secondary);
  color: var(--text-tertiary);
  border-color: var(--border-color);
}

.workface-bounds {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border-left: 3px solid var(--color-info);
}

.empty-state {
  margin-top: var(--spacing-lg);
  text-align: center;
  color: var(--text-tertiary);
  padding: var(--spacing-3xl) var(--spacing-2xl);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  border: 1px dashed var(--border-color);
}

.empty-state .empty-icon {
  color: var(--text-tertiary);
}

.legend {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
}

.legend-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.legend-bar {
  height: 12px;
  border-radius: 999px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.legend-scale {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-top: var(--spacing-sm);
}

.stats-grid {
  margin-top: var(--spacing-lg);
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: var(--spacing-md);
}

.stat-item {
  background: var(--bg-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.stat-item:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
  border-color: var(--color-primary);
}

.stat-item:hover::before {
  opacity: 1;
}

.stat-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  display: block;
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 1200px) {
  .mpi-layout {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }

  .page-header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
