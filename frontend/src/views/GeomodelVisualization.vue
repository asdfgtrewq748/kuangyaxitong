<template>
  <div class="geomodel-viz-page">
    <header class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>地质建模与可视化</h1>
          <p class="subtitle">Geological Modeling & Visualization</p>
        </div>
        <div class="header-actions">
          <button class="btn secondary" @click="showHelp = !showHelp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 1 5.83" />
              <path d="M12 17h.01" />
            </svg>
            帮助
          </button>
        </div>
      </div>

      <div v-if="showHelp" class="help-panel">
        <div class="help-content">
          <h3>地质建模可视化说明</h3>
          <p>本页面集成地质建模、MPI 联动分析和统计概览。</p>
          <ul>
            <li>3D 地质模型浏览</li>
            <li>MPI 热力图联动展示</li>
            <li>质量评分与钻孔信息</li>
          </ul>
          <button class="btn" @click="showHelp = false">关闭</button>
        </div>
      </div>
    </header>

    <div class="main-layout">
      <aside class="control-panel">
        <div class="panel-section">
          <h3 class="panel-title">数据源</h3>

          <label class="control-group">
            <span class="label">选择煤层</span>
            <select v-model="selectedSeam" :disabled="loading" @change="onSeamChange">
              <option value="">-- 请选择 --</option>
              <option v-for="seam in seams" :key="seam" :value="seam">{{ seam }}</option>
            </select>
          </label>

          <label class="control-group">
            <span class="label">地质模型任务</span>
            <div class="geomodel-input-group">
              <select v-model="selectedJobId" :disabled="loading" @change="onJobChange">
                <option value="">-- 无 --</option>
                <option v-for="job in geomodelJobs" :key="job.job_id" :value="job.job_id">
                  {{ job.job_id }} ({{ job.status }})
                </option>
              </select>
              <button class="icon-btn" @click="refreshJobs" :disabled="loading" title="刷新任务">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 2v6h-6" />
                  <path d="M3 12a9 9 0 0 1 15-6l3 2" />
                  <path d="M3 22v-6h6" />
                  <path d="M21 12a9 9 0 0 1-15 6l-3-2" />
                </svg>
              </button>
            </div>
          </label>

          <div class="action-buttons">
            <button class="btn primary" :disabled="!canRunAnalysis" @click="runAnalysis">
              {{ loading ? '分析中...' : '运行分析' }}
            </button>
            <button class="btn secondary" :disabled="!hasData" @click="exportSnapshot">
              导出快照
            </button>
          </div>

          <p v-if="loadError" class="error-tip">{{ loadError }}</p>
        </div>

        <div v-if="quality" class="panel-section quality-section">
          <h3 class="panel-title">质量评估</h3>
          <div class="quality-cards">
            <div class="quality-card" :class="getQualityClass(quality.continuity_score)">
              <span class="quality-label">连续性</span>
              <span class="quality-value">{{ formatPercent(quality.continuity_score) }}</span>
            </div>
            <div class="quality-card" :class="getQualityClass(1 - quality.pinchout_ratio)">
              <span class="quality-label">完整度</span>
              <span class="quality-value">{{ formatPercent(1 - quality.pinchout_ratio) }}</span>
            </div>
            <div class="quality-card" :class="getQualityClass(1 - quality.layer_cv)">
              <span class="quality-label">稳定性</span>
              <span class="quality-value">{{ formatPercent(1 - quality.layer_cv) }}</span>
            </div>
          </div>
        </div>

        <div v-if="boreholes.length" class="panel-section">
          <h3 class="panel-title">钻孔 ({{ boreholes.length }})</h3>
          <div class="borehole-list">
            <div
              v-for="bh in boreholes.slice(0, showAllBoreholes ? undefined : 5)"
              :key="bh.name"
              class="borehole-item"
            >
              <span class="bh-name">{{ bh.name }}</span>
              <span class="bh-coords">{{ formatCoords(bh) }}</span>
            </div>
            <button v-if="boreholes.length > 5 && !showAllBoreholes" class="text-btn" @click="showAllBoreholes = true">
              显示全部 ({{ boreholes.length - 5 }}) 更多
            </button>
          </div>
        </div>
      </aside>

      <main class="viz-panel">
        <div class="viz-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="viz-tab"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="viz-content">
          <div v-show="activeTab === 'model'" class="viz-view model-view">
            <GeomodelViewer
              ref="geomodelViewer"
              :title="`${selectedSeam || '未选择'} - 地质模型`"
              :model-data="geomodelData"
              :layers="layers"
              :boreholes="boreholes"
              :quality="quality"
              :loading="loading"
              :errorText="loadError"
              :show-controls="true"
              :can-fullscreen="true"
              @layer-toggle="onLayerToggle"
              @view-change="onViewChange"
              @fullscreen-toggle="onFullscreenToggle"
            />
          </div>

          <div v-show="activeTab === 'mpi'" class="viz-view mpi-view">
            <div class="heatmap-container">
              <HeatmapCanvas
                v-if="mpiGrid && mpiGrid.length"
                :grid="mpiGrid"
                :size="600"
                :color-scale="'viridis'"
                class="main-heatmap"
              />
              <div v-else class="heatmap-empty">
                <p>请先运行分析生成 MPI 热力图</p>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'combined'" class="viz-view combined-view">
            <div class="combined-layout">
              <div class="combined-geomodel">
                <GeomodelViewer
                  title="地质模型"
                  :model-data="geomodelData"
                  :layers="layers"
                  :boreholes="boreholes"
                  :show-controls="false"
                />
              </div>
              <div class="combined-mpi">
                <div class="mpi-legend">
                  <h4>MPI 分布</h4>
                  <HeatmapCanvas
                    v-if="mpiGrid && mpiGrid.length"
                    :grid="mpiGrid"
                    :size="300"
                    :color-scale="'viridis'"
                  />
                  <div v-else class="mpi-placeholder">
                    <p>运行分析后显示</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'stats'" class="viz-view stats-view">
            <div class="stats-grid">
              <div class="stat-card">
                <h4>数据覆盖</h4>
                <div class="stat-value">{{ boreholes.length }}</div>
                <div class="stat-label">钻孔数量</div>
              </div>
              <div class="stat-card">
                <h4>模型分辨率</h4>
                <div class="stat-value">{{ resolution || '-' }}</div>
                <div class="stat-label">网格大小</div>
              </div>
              <div class="stat-card">
                <h4>图层数量</h4>
                <div class="stat-value">{{ layers.length }}</div>
                <div class="stat-label">地质层</div>
              </div>
              <div v-if="bounds" class="stat-card">
                <h4>空间范围</h4>
                <div class="stat-value">
                  <div class="coords">
                    <span>X: {{ bounds.min_x?.toFixed(0) }} - {{ bounds.max_x?.toFixed(0) }}</span>
                    <span>Y: {{ bounds.min_y?.toFixed(0) }} - {{ bounds.max_y?.toFixed(0) }}</span>
                  </div>
                </div>
                <div class="stat-label">单位 (m)</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="fullscreenViewer" class="fullscreen-modal" @click="closeFullscreen">
      <div class="fullscreen-content" @click.stop>
        <GeomodelViewer
          :fullscreen="true"
          :show-controls="true"
          :model-data="geomodelData"
          :layers="layers"
          :boreholes="boreholes"
          :quality="quality"
          :loading="loading"
          :errorText="loadError"
          @fullscreen-toggle="closeFullscreen"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import GeomodelViewer from '../components/GeomodelViewer.vue'
import HeatmapCanvas from '../components/HeatmapCanvas.vue'
import {
  getCoalSeams,
  getSeamOverburden,
  getGeomodelIntegrationJobs,
  getGeomodelIntegrationVisualization,
  runGeomodelIntegrationMpi,
  getApiErrorMessage,
} from '../api'

const showHelp = ref(false)
const loading = ref(false)
const selectedSeam = ref('')
const selectedJobId = ref('')
const seams = ref([])
const geomodelJobs = ref([])
const geomodelData = ref(null)
const layers = ref([])
const boreholes = ref([])
const quality = ref(null)
const mpiGrid = ref(null)
const bounds = ref(null)
const resolution = ref(50)
const activeTab = ref('model')
const showAllBoreholes = ref(false)
const fullscreenViewer = ref(false)
const loadError = ref('')

const tabs = [
  { id: 'model', label: '3D 模型' },
  { id: 'mpi', label: 'MPI 热力图' },
  { id: 'combined', label: '联动视图' },
  { id: 'stats', label: '统计数据' },
]

const hasData = computed(() => geomodelData.value || (layers.value && layers.value.length > 0))
const canRunAnalysis = computed(() => !!selectedSeam.value && !loading.value)

const formatPercent = (val) => {
  const num = parseFloat(val)
  return Number.isFinite(num) ? `${Math.round(num * 100)}%` : '-'
}

const formatCoords = (bh) => `(${bh.x?.toFixed(0)}, ${bh.y?.toFixed(0)})`

const getQualityClass = (score) => {
  const s = parseFloat(score)
  if (s >= 0.8) return 'excellent'
  if (s >= 0.6) return 'good'
  if (s >= 0.4) return 'fair'
  return 'poor'
}

const onSeamChange = () => {
  loadSeamData()
}

const onJobChange = () => {
  loadGeomodelData()
}

const onLayerToggle = (event) => {
  console.log('Layer toggled:', event)
}

const onViewChange = (view) => {
  console.log('View changed:', view)
}

const onFullscreenToggle = (isFullscreen) => {
  fullscreenViewer.value = isFullscreen
}

const closeFullscreen = () => {
  fullscreenViewer.value = false
}

const refreshJobs = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const response = await getGeomodelIntegrationJobs()
    geomodelJobs.value = Array.isArray(response.data) ? response.data : []
  } catch (err) {
    loadError.value = getApiErrorMessage(err, '地质建模任务列表加载失败')
  } finally {
    loading.value = false
  }
}

const loadSeamData = async () => {
  if (!selectedSeam.value) return

  loading.value = true
  loadError.value = ''
  try {
    const response = await getSeamOverburden(selectedSeam.value)
    const data = response.data || {}
    boreholes.value = data.boreholes || []
    bounds.value = data.bounds
  } catch (err) {
    loadError.value = getApiErrorMessage(err, '煤层上覆岩性数据加载失败')
  } finally {
    loading.value = false
  }
}

const loadGeomodelData = async () => {
  if (!selectedJobId.value) {
    geomodelData.value = null
    layers.value = []
    quality.value = null
    loadError.value = ''
    return
  }

  loading.value = true
  loadError.value = ''
  try {
    const response = await getGeomodelIntegrationVisualization(selectedJobId.value)
    const data = response.data || {}
    geomodelData.value = data
    layers.value = data.layers || []
    boreholes.value = data.boreholes || []
    bounds.value = data.bounds
    quality.value = data.quality_summary || null
  } catch (err) {
    loadError.value = getApiErrorMessage(err, '地质模型可视化数据加载失败')
  } finally {
    loading.value = false
  }
}

const runAnalysis = async () => {
  if (!selectedSeam.value) return

  loading.value = true
  loadError.value = ''
  try {
    const response = await runGeomodelIntegrationMpi({
      seam_name: selectedSeam.value,
      geomodel_job_id: selectedJobId.value || null,
      resolution: resolution.value,
      use_geomodel_weights: true,
    })
    const data = response.data || {}
    mpiGrid.value = data.mpi_grid || []
    activeTab.value = 'mpi'
  } catch (err) {
    loadError.value = getApiErrorMessage(err, '联动分析失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const exportSnapshot = () => {
  loadError.value = '导出快照功能开发中'
}

onMounted(async () => {
  loadError.value = ''
  try {
    const response = await getCoalSeams()
    const seamList = response.data?.seams || []
    seams.value = seamList
      .map((item) => (typeof item === 'string' ? item : item?.name))
      .filter((name) => typeof name === 'string' && name.length > 0)

    if (seams.value.length > 0) {
      selectedSeam.value = seams.value[0]
      await loadSeamData()
    }
  } catch (err) {
    loadError.value = getApiErrorMessage(err, '煤层列表加载失败')
  }

  await refreshJobs()
})
</script>

<style scoped>
.geomodel-viz-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-page);
}

.page-header {
  background: var(--gradient-card);
  border-bottom: 1px solid var(--border-color);
  padding: 20px 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-text h1 {
  margin: 0 0 4px;
  font-size: 24px;
  color: var(--text-primary);
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.help-panel {
  margin-top: 16px;
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 8px;
}

.help-content h3 {
  margin: 0 0 8px;
  font-size: 14px;
}

.help-content p {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-secondary);
}

.help-content ul {
  margin: 0;
  padding-left: 20px;
}

.help-content li {
  margin-bottom: 4px;
  font-size: 13px;
  color: var(--text-secondary);
}

.main-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  padding: 20px;
  flex: 1;
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-section {
  padding: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.panel-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}

select,
input {
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 13px;
}

.geomodel-input-group {
  display: flex;
  gap: 6px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-btn:hover {
  background: var(--bg-hover);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background: var(--color-primary);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: #b91c1c;
}

.quality-section {
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%);
}

.quality-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quality-card {
  padding: 10px 12px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 1px solid var(--border-color);
}

.quality-card.excellent { border-color: #86efac; background: #f0fdf4; }
.quality-card.good { border-color: #6ee7b7; background: #f0fdfa; }
.quality-card.fair { border-color: #fcd34d; background: #fffbeb; }
.quality-card.poor { border-color: #fca5a5; background: #fef2f2; }

.quality-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.quality-value {
  font-size: 14px;
  font-weight: 600;
}

.borehole-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.borehole-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  font-size: 12px;
}

.bh-name {
  font-weight: 500;
  color: var(--text-primary);
}

.bh-coords {
  font-size: 11px;
  color: var(--text-secondary);
}

.text-btn {
  padding: 6px;
  border: none;
  background: none;
  color: var(--color-primary);
  font-size: 12px;
  cursor: pointer;
}

.viz-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viz-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.viz-tab {
  padding: 12px 20px;
  border: none;
  background: none;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.viz-tab:hover {
  color: var(--color-primary);
}

.viz-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.viz-content {
  padding: 16px;
  flex: 1;
  min-height: 0;
}

.viz-view {
  min-height: 500px;
}

.mpi-view {
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-view {
  display: block;
}

.model-view :deep(.geomodel-viewer) {
  width: 100%;
  min-height: 500px;
}

.stats-view {
  display: block;
}

.heatmap-container,
.heatmap-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heatmap-empty {
  color: var(--text-secondary);
}

.combined-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
  height: 500px;
}

.combined-geomodel {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.combined-mpi {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mpi-legend h4 {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.mpi-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 12px;
  background: var(--bg-secondary);
  border-radius: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.stat-card {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 6px;
}

.stat-card h4 {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.coords {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
}

.fullscreen-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-content {
  width: 100%;
  height: 100%;
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .combined-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 200px;
  }
}
</style>
