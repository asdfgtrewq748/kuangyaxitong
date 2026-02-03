<template>
  <div class="page mpi-heatmap-page">
    <div class="page-header">
      <div class="page-header-content">
        <div class="page-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">MPI热力图分析</h1>
          <p class="page-subtitle">独立展示MPI综合指标分布，支持多工作面上传、切换与热力图渲染</p>
        </div>
      </div>
    </div>

    <div class="mpi-layout">
      <div class="left-panel">
        <div class="card">
          <h3 class="section-title">工作面坐标文件</h3>
          <p class="section-desc">上传多工作面坐标文件（矩形为主，多边形可选）</p>

          <div class="upload-box" @click="triggerWorkfaceUpload" tabindex="0" @keydown.enter="triggerWorkfaceUpload">
            <input ref="workfaceInput" type="file" accept=".csv,.json,.txt" @change="onWorkfaceFile" style="display:none">
            <div class="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <div class="upload-text">上传工作面坐标文件</div>
            <div class="upload-hint">支持 CSV / JSON / TXT</div>
          </div>

          <div class="helper-text">
            未上传工作面时，将使用全部网格边界进行渲染。
          </div>

          <div class="sample-actions">
            <button class="btn ghost" @click.stop="downloadSample('csv')">下载CSV示例</button>
            <button class="btn ghost" @click.stop="downloadSample('json')">下载JSON示例</button>
          </div>

          <div v-if="workfaces.length" class="workface-list">
            <div class="workface-header">
              <span>已解析 {{ workfaces.length }} 个工作面</span>
              <button class="btn small ghost" @click="clearWorkfaces">清空</button>
            </div>
            <div class="workface-items">
              <button
                v-for="(face, idx) in workfaces"
                :key="face.name + idx"
                :class="['workface-btn', { active: activeWorkfaceIndex === idx }]"
                @click="activeWorkfaceIndex = idx"
              >
                {{ face.name || `工作面 ${idx + 1}` }}
                <span class="workface-type">{{ face.type === 'polygon' ? '多边形' : '矩形' }}</span>
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
            <p>请上传工作面坐标文件</p>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">MPI计算设置</h3>
          <div class="param-group">
            <label class="param-label">煤层</label>
            <select v-model="seam" class="param-select">
              <option v-for="item in seams" :key="item.name" :value="item.name">{{ item.name }}</option>
            </select>
          </div>
          <div class="param-group">
            <label class="param-label">插值方法</label>
            <select v-model="method" class="param-select">
              <option value="idw">IDW</option>
              <option value="linear">Linear</option>
              <option value="nearest">Nearest</option>
            </select>
          </div>
          <div class="param-group">
            <label class="param-label">网格分辨率</label>
            <input v-model.number="gridSize" type="number" min="20" max="200" class="param-input">
          </div>

          <div class="action-buttons">
            <button class="btn primary" @click="handleMpiCompute" :disabled="loading || !seam">
              <span v-if="loading" class="spinner sm"></span>
              {{ loading ? '计算中...' : '计算MPI热力图' }}
            </button>
            <button class="btn secondary" @click="refreshHeatmapImage" :disabled="loading || !hasGrid">
              刷新图像
            </button>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">显示设置</h3>
          <div class="toggle-row">
            <label class="toggle-item">
              <input type="checkbox" v-model="showBoundary">
              显示边界
            </label>
            <label class="toggle-item">
              <input type="checkbox" v-model="showMask">
              显示遮罩
            </label>
          </div>
          <div class="param-group">
            <label class="param-label">渲染模式</label>
            <div class="mode-tabs">
              <button :class="['mode-tab', { active: renderMode === 'image' }]" @click="renderMode = 'image'">图像</button>
              <button :class="['mode-tab', { active: renderMode === 'canvas' }]" @click="renderMode = 'canvas'">Canvas</button>
            </div>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="card">
          <div class="heatmap-header">
            <h3 class="section-title">MPI综合指标分布</h3>
            <div class="heatmap-actions">
              <span v-if="activeWorkface" class="tag">当前：{{ activeWorkface.name }}</span>
              <span v-else class="tag ghost">未选择工作面</span>
            </div>
          </div>

          <div v-if="activeWorkface?.bounds" class="workface-bounds">
            范围：X {{ activeWorkface.bounds.min_x }} ~ {{ activeWorkface.bounds.max_x }}，
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
            <div class="legend-label">MPI风险渐变（ODI色盘）</div>
            <div class="legend-bar" :style="{ background: legendGradient }"></div>
            <div class="legend-scale">
              <span>高风险（低MPI）</span>
              <span>低风险（高MPI）</span>
            </div>
          </div>

          <div v-if="hasGrid" class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">最小值</span>
              <span class="stat-value">{{ stats.min?.toFixed(2) || '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最大值</span>
              <span class="stat-value">{{ stats.max?.toFixed(2) || '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">平均值</span>
              <span class="stat-value">{{ stats.mean?.toFixed(2) || '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">悬停值</span>
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
            <p>请选择煤层并计算MPI热力图</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '../composables/useToast'
import MpiHeatmapViewer from '../components/MpiHeatmapViewer.vue'
import {
  getCoalSeams,
  getSeamOverburden,
  getRockParams,
  mpiInterpolate,
  parseMpiWorkfaces,
  mpiHeatmapImage
} from '../api'

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

const layerParamsCache = new Map()

const odiPalette = [
  '#3b82f6',
  '#facc15',
  '#fb923c',
  '#f87171',
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
    toast.add(`已导入 ${workfaces.value.length} 个工作面`, 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '工作面解析失败', 'error')
  }
}

const downloadSample = (type) => {
  if (type === 'csv') {
    const content = 'name,xmin,xmax,ymin,ymax\n工作面A,100,400,200,600\n工作面B,450,750,150,500\n'
    triggerDownload(content, 'workfaces_example.csv', 'text/csv')
    return
  }

  const payload = {
    workfaces: [
      {
        name: '工作面A',
        bounds: { min_x: 100, max_x: 400, min_y: 200, max_y: 600 }
      },
      {
        name: '工作面B',
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
      toast.add('当前煤层无可用钻孔数据', 'error')
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

    toast.add('MPI热力图计算完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || 'MPI计算失败', 'error')
  } finally {
    loading.value = false
  }
}

const validateWorkfaceBounds = (workfaceBounds, gridBounds) => {
  if (!workfaceBounds || !gridBounds) return
  const outX = workfaceBounds.min_x < gridBounds.min_x || workfaceBounds.max_x > gridBounds.max_x
  const outY = workfaceBounds.min_y < gridBounds.min_y || workfaceBounds.max_y > gridBounds.max_y
  if (outX || outY) {
    toast.add('工作面范围超出MPI网格边界，显示可能被裁剪', 'warning')
  }
}

const refreshHeatmapImage = async () => {
  if (!grid.value || !gridBounds.value) return
  try {
    const title = activeWorkface.value?.name ? `MPI热力图 - ${activeWorkface.value.name}` : 'MPI热力图'
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
    toast.add(err.response?.data?.detail || '热力图图像生成失败', 'error')
  }
}

const handleImageError = () => {
  if (renderMode.value !== 'image') return
  renderMode.value = 'canvas'
  toast.add('图像加载失败，已切换到Canvas模式', 'warning')
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
  toast.add('工作面已切换，请重新计算MPI热力图', 'info')
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

.page-header {
  margin-bottom: var(--spacing-3xl);
  padding: var(--spacing-2xl);
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.page-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.page-header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  position: relative;
  z-index: 1;
}

.page-header-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-md);
  color: white;
  box-shadow: var(--shadow-sm);
}

.page-header-icon svg {
  width: 26px;
  height: 26px;
}

.page-title {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.page-subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
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
  box-shadow: 0 0 0 3px rgba(90, 99, 120, 0.1);
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
  padding: 2px 8px;
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
  padding: 10px 12px;
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
  box-shadow: 0 0 0 3px rgba(90, 99, 120, 0.1);
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
  padding: 10px 16px;
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
  padding: 6px 12px;
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
  color: #4a6b8a;
  padding: 6px 12px;
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
