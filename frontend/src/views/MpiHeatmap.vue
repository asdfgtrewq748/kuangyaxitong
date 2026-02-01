<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">🔥 MPI热力图</h1>
      <p class="page-subtitle">独立展示MPI综合指标分布，支持多工作面上传、切换与热力图渲染</p>
    </div>

    <div class="mpi-layout">
      <div class="left-panel">
        <div class="card">
          <h3 class="section-title">工作面坐标文件</h3>
          <p class="section-desc">上传多工作面坐标文件（矩形为主，多边形可选）</p>

          <div class="upload-box" @click="triggerWorkfaceUpload">
            <input ref="workfaceInput" type="file" accept=".csv,.json,.txt" @change="onWorkfaceFile" style="display:none">
            <div class="upload-icon">📤</div>
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
            <div class="empty-icon">📐</div>
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
            <div class="empty-icon">📊</div>
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
.page-title {
  margin: 0 0 8px 0;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.page-subtitle {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #64748b;
}

.mpi-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  align-items: start;
}

.left-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
}

.section-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.section-desc {
  margin: 0 0 16px 0;
  font-size: 13px;
  color: #64748b;
}

.upload-box {
  border: 1px dashed #cbd5f5;
  border-radius: 14px;
  padding: 18px;
  text-align: center;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-box:hover {
  background: #eef2ff;
  border-color: #818cf8;
}

.upload-icon {
  font-size: 28px;
}

.upload-text {
  font-weight: 600;
  color: #1e293b;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
}

.helper-text {
  margin-top: 10px;
  font-size: 12px;
  color: #94a3b8;
}

.sample-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.workface-list {
  margin-top: 16px;
}

.workface-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 12px;
  color: #64748b;
}

.workface-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 220px;
  overflow: auto;
}

.workface-btn {
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.workface-btn.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

.workface-type {
  background: rgba(15, 23, 42, 0.08);
  color: inherit;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 10px;
}

.empty-tip {
  text-align: center;
  color: #94a3b8;
  margin-top: 12px;
}

.empty-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.param-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.param-label {
  font-size: 12px;
  color: #64748b;
}

.param-input,
.param-select {
  border: 1px solid #cbd5f5;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 13px;
  background: #f8fafc;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn.primary {
  background: #6366f1;
  color: white;
}

.btn.secondary {
  background: #e2e8f0;
  color: #334155;
}

.btn.small {
  padding: 4px 10px;
  font-size: 12px;
}

.btn.ghost {
  background: transparent;
  border: 1px solid #cbd5f5;
  color: #64748b;
}

.toggle-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.toggle-item {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.mode-tabs {
  display: flex;
  gap: 8px;
}

.mode-tab {
  flex: 1;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
  font-size: 12px;
  cursor: pointer;
}

.mode-tab.active {
  background: #1e293b;
  color: white;
  border-color: #1e293b;
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tag {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.ghost {
  background: #f1f5f9;
  color: #94a3b8;
}

.workface-bounds {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 10px;
}

.empty-state {
  margin-top: 16px;
  text-align: center;
  color: #94a3b8;
}

.empty-state .empty-icon {
  font-size: 28px;
  margin-bottom: 6px;
}

.legend {
  margin-top: 16px;
}

.legend-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.legend-bar {
  height: 10px;
  border-radius: 999px;
}

.legend-scale {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
}

.stats-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 12px;
}

.stat-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px;
  border: 1px solid #e2e8f0;
}

.stat-label {
  font-size: 11px;
  color: #94a3b8;
  display: block;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

@media (max-width: 1200px) {
  .mpi-layout {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }
}
</style>
