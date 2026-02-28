<template>
  <div class="page mpi-heatmap-page">
    <PageHeader
      class="main-header"
      title="MPI鐑姏鍥惧垎鏋?
      description="鐙珛灞曠ずMPI缁煎悎鎸囨爣鍒嗗竷锛屾敮鎸佸宸ヤ綔闈笂浼犮€佸垏鎹笌鐑姏鍥炬覆鏌?
    />

    <div class="mpi-layout">
      <div class="left-panel">
        <Card>
          <h3 class="section-title">宸ヤ綔闈㈠潗鏍囨枃浠?/h3>
          <p class="section-desc">涓婁紶澶氬伐浣滈潰鍧愭爣鏂囦欢锛堢煩褰负涓伙紝澶氳竟褰㈠彲閫夛級</p>

          <div class="upload-box" @click="triggerWorkfaceUpload" tabindex="0" @keydown.enter="triggerWorkfaceUpload">
            <input ref="workfaceInput" type="file" accept=".csv,.json,.txt" @change="onWorkfaceFile" style="display:none">
            <div class="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <div class="upload-text">涓婁紶宸ヤ綔闈㈠潗鏍囨枃浠?/div>
            <div class="upload-hint">鏀寔 CSV / JSON / TXT</div>
          </div>

          <div class="helper-text">
            鏈笂浼犲伐浣滈潰鏃讹紝灏嗕娇鐢ㄥ叏閮ㄧ綉鏍艰竟鐣岃繘琛屾覆鏌撱€?
          </div>

          <div class="sample-actions">
            <button class="btn ghost" @click.stop="downloadSample('csv')">涓嬭浇CSV绀轰緥</button>
            <button class="btn ghost" @click.stop="downloadSample('json')">涓嬭浇JSON绀轰緥</button>
          </div>

          <div v-if="workfaces.length" class="workface-list">
            <div class="workface-header">
              <span>宸茶В鏋?{{ workfaces.length }} 涓伐浣滈潰</span>
              <button class="btn small ghost" @click="clearWorkfaces">娓呯┖</button>
            </div>
            <div class="workface-items">
              <button
                v-for="(face, idx) in workfaces"
                :key="face.name + idx"
                :class="['workface-btn', { active: activeWorkfaceIndex === idx }]"
                @click="activeWorkfaceIndex = idx"
              >
                {{ face.name || `宸ヤ綔闈?${idx + 1}` }}
                <span class="workface-type">{{ face.type === 'polygon' ? '澶氳竟褰? : '鐭╁舰' }}</span>
              </button>
            </div>
          </div>

          <div v-else class="empty-tip">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <p>璇蜂笂浼犲伐浣滈潰鍧愭爣鏂囦欢</p>
          </div>
        </Card>

        <Card>
          <h3 class="section-title">MPI璁＄畻璁剧疆</h3>
          <div class="param-group">
            <label class="param-label">鐓ゅ眰</label>
            <select v-model="seam" class="param-select">
              <option v-for="item in seams" :key="item.name" :value="item.name">{{ item.name }}</option>
            </select>
          </div>
          <div class="param-group">
            <label class="param-label">鎻掑€兼柟娉?/label>
            <select v-model="method" class="param-select">
              <option value="idw">IDW</option>
              <option value="linear">Linear</option>
              <option value="nearest">Nearest</option>
            </select>
          </div>
          <div class="param-group">
            <label class="param-label">缃戞牸鍒嗚鲸鐜?/label>
            <input v-model.number="gridSize" type="number" min="20" max="200" class="param-input">
          </div>

          <div class="action-buttons">
            <button class="btn primary" @click="handleMpiCompute" :disabled="loading || !seam">
              <span v-if="loading" class="spinner sm"></span>
              {{ loading ? '璁＄畻涓?..' : '璁＄畻MPI鐑姏鍥? }}
            </button>
            <button class="btn secondary" @click="refreshHeatmapImage" :disabled="loading || !hasGrid">
              鍒锋柊鍥惧儚
            </button>
          </div>
        </Card>

        <Card>
          <h3 class="section-title">鏄剧ず璁剧疆</h3>
          <div class="toggle-row">
            <label class="toggle-item">
              <input type="checkbox" v-model="showBoundary">
              鏄剧ず杈圭晫
            </label>
            <label class="toggle-item">
              <input type="checkbox" v-model="showMask">
              鏄剧ず閬僵
            </label>
          </div>
          <div class="param-group">
            <label class="param-label">娓叉煋妯″紡</label>
            <div class="mode-tabs">
              <button :class="['mode-tab', { active: renderMode === 'image' }]" @click="renderMode = 'image'">鍥惧儚</button>
              <button :class="['mode-tab', { active: renderMode === 'canvas' }]" @click="renderMode = 'canvas'">Canvas</button>
            </div>
          </div>
        </Card>
      </div>

      <div class="right-panel">
        <Card>
          <div class="heatmap-header">
            <h3 class="section-title">MPI缁煎悎鎸囨爣鍒嗗竷</h3>
            <div class="heatmap-actions">
              <span v-if="activeWorkface" class="tag">褰撳墠锛歿{ activeWorkface.name }}</span>
              <span v-else class="tag ghost">鏈€夋嫨宸ヤ綔闈?/span>
            </div>
          </div>

          <div v-if="activeWorkface?.bounds" class="workface-bounds">
            鑼冨洿锛歑 {{ activeWorkface.bounds.min_x }} ~ {{ activeWorkface.bounds.max_x }}锛?
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
            @hover="hoverInfo = $event"
            @imageError="handleImageError"
          />

          <div v-if="hasGrid" class="legend">
            <div class="legend-label">MPI椋庨櫓娓愬彉锛圤DI鑹茬洏锛?/div>
            <div class="legend-bar" :style="{ background: legendGradient }"></div>
            <div class="legend-scale">
              <span>楂橀闄╋紙浣嶮PI锛?/span>
              <span>浣庨闄╋紙楂楳PI锛?/span>
            </div>
          </div>

          <div v-if="hasGrid" class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">鏈€灏忓€?/span>
              <span class="stat-value">{{ stats.min?.toFixed(2) || '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">鏈€澶у€?/span>
              <span class="stat-value">{{ stats.max?.toFixed(2) || '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">骞冲潎鍊?/span>
              <span class="stat-value">{{ stats.mean?.toFixed(2) || '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">鎮仠鍊?/span>
              <span class="stat-value">{{ hoverInfo?.value?.toFixed(2) || '-' }}</span>
            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <p>璇烽€夋嫨鐓ゅ眰骞惰绠桵PI鐑姏鍥?/p>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '../composables/useToast'
import MpiHeatmapViewer from '../components/MpiHeatmapViewer.vue'
import { Card, PageHeader } from '../components/library'
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
    toast.add(`宸插鍏?${workfaces.value.length} 涓伐浣滈潰`, 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '宸ヤ綔闈㈣В鏋愬け璐?, 'error')
  }
}

const downloadSample = (type) => {
  if (type === 'csv') {
    const content = 'name,xmin,xmax,ymin,ymax\n宸ヤ綔闈,100,400,200,600\n宸ヤ綔闈,450,750,150,500\n'
    triggerDownload(content, 'workfaces_example.csv', 'text/csv')
    return
  }

  const payload = {
    workfaces: [
      {
        name: '宸ヤ綔闈',
        bounds: { min_x: 100, max_x: 400, min_y: 200, max_y: 600 }
      },
      {
        name: '宸ヤ綔闈',
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
    toast.add('鍔犺浇鐓ゅ眰澶辫触', 'error')
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
      toast.add('褰撳墠鐓ゅ眰鏃犲彲鐢ㄩ捇瀛旀暟鎹?, 'error')
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

    toast.add('MPI鐑姏鍥捐绠楀畬鎴?, 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || 'MPI璁＄畻澶辫触', 'error')
  } finally {
    loading.value = false
  }
}

const validateWorkfaceBounds = (workfaceBounds, gridBounds) => {
  if (!workfaceBounds || !gridBounds) return
  const outX = workfaceBounds.min_x < gridBounds.min_x || workfaceBounds.max_x > gridBounds.max_x
  const outY = workfaceBounds.min_y < gridBounds.min_y || workfaceBounds.max_y > gridBounds.max_y
  if (outX || outY) {
    toast.add('宸ヤ綔闈㈣寖鍥磋秴鍑篗PI缃戞牸杈圭晫锛屾樉绀哄彲鑳借瑁佸壀', 'warning')
  }
}

const refreshHeatmapImage = async () => {
  if (!grid.value || !gridBounds.value) return
  try {
    const title = activeWorkface.value?.name ? `MPI鐑姏鍥?- ${activeWorkface.value.name}` : 'MPI鐑姏鍥?
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
    toast.add(err.response?.data?.detail || '鐑姏鍥惧浘鍍忕敓鎴愬け璐?, 'error')
  }
}

const handleImageError = () => {
  if (renderMode.value !== 'image') return
  renderMode.value = 'canvas'
  toast.add('鍥惧儚鍔犺浇澶辫触锛屽凡鍒囨崲鍒癈anvas妯″紡', 'warning')
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
  toast.add('宸ヤ綔闈㈠凡鍒囨崲锛岃閲嶆柊璁＄畻MPI鐑姏鍥?, 'info')
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

