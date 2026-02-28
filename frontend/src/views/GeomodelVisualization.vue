<template>
  <div class="geomodel-viz-page">
    <PageHeader
      class="main-header"
      :title="gv('pageTitle')"
      :description="gv('pageDescription')"
    >
      <template #actions>
        <button class="btn secondary" @click="showHelp = !showHelp">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 1 5.83" />
            <path d="M12 17h.01" />
          </svg>
          {{ gv('help') }}
        </button>
      </template>
    </PageHeader>

    <!-- 帮助面板 -->
    <div v-if="showHelp" class="help-panel">
      <div class="help-content">
        <h3>{{ gv('helpTitle') }}</h3>
        <p>{{ gv('helpDescription') }}</p>
        <ul>
          <li>{{ gv('helpItemModel') }}</li>
          <li>{{ gv('helpItemMpi') }}</li>
          <li>{{ gv('helpItemQuality') }}</li>
        </ul>
        <button class="btn primary" @click="showHelp = false">{{ gv('close') }}</button>
      </div>
    </div>

    <div class="main-layout">
      <!-- 侧边控制面板 -->
      <SidePanel
        :title="gv('controlPanel')"
        position="left"
        :width="320"
        :default-collapsed="false"
      >
        <!-- 数据源 -->
        <div class="panel-section">
          <h3 class="panel-title">{{ gv('dataSource') }}</h3>

          <label class="control-group">
            <span class="label">{{ gv('seam') }}</span>
            <select v-model="selectedSeam" :disabled="loading" @change="onSeamChange">
              <option value="">{{ gv('pleaseSelect') }}</option>
              <option v-for="seam in seams" :key="seam" :value="seam">{{ seam }}</option>
            </select>
          </label>

          <label class="control-group">
            <span class="label">{{ gv('geomodelJob') }}</span>
            <div class="geomodel-input-group">
              <select v-model="selectedJobId" :disabled="loading" @change="onJobChange">
                <option value="">{{ gv('noneOption') }}</option>
                <option v-for="job in geomodelJobs" :key="job.job_id" :value="job.job_id">
                  {{ job.job_id }} ({{ job.status }})
                </option>
              </select>
              <button class="icon-btn" @click="refreshJobs" :disabled="loading" :title="gv('refreshJobs')">
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
              {{ loading ? gv('analyzing') : gv('runAnalysis') }}
            </button>
            <button class="btn secondary" :disabled="!hasData" @click="exportSnapshot">
              {{ gv('exportSnapshot') }}
            </button>
          </div>

          <p v-if="loadError" class="error-tip">{{ loadError }}</p>
        </div>

        <!-- 使用 StatCard 组件显示质量评估 -->
        <div v-if="quality" class="panel-section">
          <h3 class="panel-title">{{ gv('qualityAssessment') }}</h3>
          <div class="quality-cards">
            <StatCard
              :title="gv('continuity')"
              :value="formatPercentValue(quality.continuity_score)"
              icon="📈"
              :size="'sm'"
            />
            <StatCard
              :title="gv('completeness')"
              :value="formatPercentValue(1 - quality.pinchout_ratio)"
              icon="🎯"
              :size="'sm'"
            />
            <StatCard
              :title="gv('stability')"
              :value="formatPercentValue(1 - quality.layer_cv)"
              icon="📊"
              :size="'sm'"
            />
          </div>
        </div>

        <div v-if="boreholes.length" class="panel-section">
          <h3 class="panel-title">{{ gv('boreholesTitle', { count: boreholes.length }) }}</h3>
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
              {{ gv('showAllBoreholes', { count: boreholes.length - 5 }) }}
            </button>
          </div>
        </div>
      </SidePanel>

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
              :title="mainViewerTitle"
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
              <div class="heatmap-wrapper">
                <HeatmapCanvas
                  v-if="mpiGrid && mpiGrid.length"
                  :grid="mpiGrid"
                  :size="600"
                  :color-scale="'viridis'"
                  class="main-heatmap"
                />
                <ColorLegend
                  v-if="mpiGrid && mpiGrid.length"
                  type="gradient"
                  :title="gv('mpiDistribution')"
                  unit="MPa"
                  :gradient="'linear-gradient(90deg, #0e7490, #14b8a6, #84cc16, #facc15, #fb923c, #dc2626)'"
                  :labels="legendLabels"
                  direction="horizontal"
                  class="heatmap-legend"
                />
                <SkeletonPanel v-else-if="loading" :rows="5" />
                <EmptyState
                  v-else
                  :title="gv('emptyMpiTitle')"
                  :description="gv('emptyMpiMessage')"
                />
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'combined'" class="viz-view combined-view">
            <div class="combined-layout">
              <div class="combined-geomodel">
                <GeomodelViewer
                  :title="gv('geomodelTitle')"
                  :model-data="geomodelData"
                  :layers="layers"
                  :boreholes="boreholes"
                  :show-controls="false"
                />
              </div>
              <div class="combined-mpi">
                <div class="mpi-legend">
                  <h4>{{ gv('mpiDistribution') }}</h4>
                  <HeatmapCanvas
                    v-if="mpiGrid && mpiGrid.length"
                    :grid="mpiGrid"
                    :size="300"
                    :color-scale="'viridis'"
                  />
                  <SkeletonPanel v-else-if="loading" :rows="4" compact />
                  <EmptyState
                    v-else
                    :title="gv('emptyMpiTitle')"
                    :description="gv('showAfterAnalysis')"
                  />
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'stats'" class="viz-view stats-view">
            <div class="stats-grid">
              <StatCard
                :title="gv('boreholeCount')"
                :value="boreholes.length"
                :unit="gv('unitCount')"
                icon="📍"
                :size="'lg'"
              />
              <StatCard
                :title="gv('modelResolution')"
                :value="resolution"
                unit="m"
                icon="📐"
                :size="'lg'"
              />
              <StatCard
                :title="gv('layerCount')"
                :value="layers.length"
                :unit="gv('unitLayer')"
                icon="🏔️"
                :size="'lg'"
              />
              <StatCard
                v-if="bounds"
                :title="gv('spatialRangeX')"
                :value="`${bounds.min_x?.toFixed(0)} - ${bounds.max_x?.toFixed(0)}`"
                unit="m"
                icon="↔️"
                :size="'lg'"
                :format="false"
              />
              <StatCard
                v-if="bounds"
                :title="gv('spatialRangeY')"
                :value="`${bounds.min_y?.toFixed(0)} - ${bounds.max_y?.toFixed(0)}`"
                unit="m"
                icon="↕️"
                :size="'lg'"
                :format="false"
              />
            </div>

            <!-- 钻孔详情表格 -->
            <div v-if="boreholes.length" class="borehole-table-section">
              <h3 class="table-section-title">{{ gv('boreholeDetailList') }}</h3>
              <DataTable
                :columns="boreholeColumns"
                :data="boreholes"
                :searchable="true"
                :paginated="true"
                :page-size="10"
                row-key="name"
                @row-click="handleBoreholeClick"
              />
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
import { useI18n } from '../composables/useI18n'
import { EmptyState, PageHeader, SkeletonPanel, StatCard, SidePanel, ColorLegend, DataTable } from '../components/library'
import { useDataStore, useUIStore } from '../stores'
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

// 使用全局状态
const dataStore = useDataStore()
const uiStore = useUIStore()
const { t } = useI18n()
const gv = (key, params) => t(`geomodelVisualization.${key}`, params)

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

// 钻孔表格列定义
const boreholeColumns = computed(() => ([
  { key: 'name', title: gv('table.boreholeName'), sortable: true },
  { key: 'x', title: gv('table.coordX'), sortable: true, align: 'right' },
  { key: 'y', title: gv('table.coordY'), sortable: true, align: 'right' },
  { key: 'z', title: gv('table.coordZ'), sortable: true, align: 'right' }
]))

const tabs = computed(() => ([
  { id: 'model', label: gv('tabs.model') },
  { id: 'mpi', label: gv('tabs.mpi') },
  { id: 'combined', label: gv('tabs.combined') },
  { id: 'stats', label: gv('tabs.stats') },
]))

const hasData = computed(() => geomodelData.value || (layers.value && layers.value.length > 0))
const canRunAnalysis = computed(() => !!selectedSeam.value && !loading.value)
const legendLabels = computed(() => [gv('legendLow'), '', '', '', '', gv('legendHigh')])
const mainViewerTitle = computed(() => gv('modelViewerTitle', { seam: selectedSeam.value || gv('unselected') }))

// 格式化百分比值（用于 StatCard）
const formatPercentValue = (val) => {
  const num = parseFloat(val)
  return Number.isFinite(num) ? Math.round(num * 100) : null
}

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
    loadError.value = getApiErrorMessage(err, gv('errorLoadJobs'))
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
    loadError.value = getApiErrorMessage(err, gv('errorLoadSeamData'))
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
    loadError.value = getApiErrorMessage(err, gv('errorLoadVisualization'))
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
    loadError.value = getApiErrorMessage(err, gv('errorRunAnalysis'))
  } finally {
    loading.value = false
  }
}

const exportSnapshot = () => {
  try {
    // 生成快照数据
    const snapshot = {
      timestamp: new Date().toISOString(),
      seam: selectedSeam.value,
      jobId: selectedJobId.value,
      quality: quality.value,
      bounds: bounds.value,
      boreholes: boreholes.value.length,
      layers: layers.value.length
    }

    // 导出为 JSON
    const dataStr = JSON.stringify(snapshot, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `geomodel-snapshot-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)

    uiStore.showSuccess(gv('exportSnapshotSuccess'))
  } catch (error) {
    console.error('Failed to export geomodel snapshot:', error)
    uiStore.showError(gv('exportSnapshotFailed'))
  }
}

const handleBoreholeClick = (row) => {
  console.log('Borehole row clicked:', row)
  // TODO: 在 3D 视图中高亮显示该钻孔
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
    loadError.value = getApiErrorMessage(err, gv('errorLoadSeams'))
  }

  await refreshJobs()
})
</script>

<style scoped>
.geomodel-viz-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-page);
}

.main-header {
  padding: 0 var(--spacing-5);
}

/* 帮助面板 */
.help-panel {
  margin: var(--spacing-4) var(--spacing-4) 0;
  padding: var(--spacing-4);
  background: var(--color-bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.help-content h3 {
  margin: 0 0 var(--spacing-2);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.help-content p {
  margin: 0 0 var(--spacing-3);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

.help-content ul {
  margin: 0 0 var(--spacing-4);
  padding-left: var(--spacing-6);
}

.help-content li {
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

/* 主布局 */
.main-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-5);
  padding: var(--spacing-5);
  flex: 1;
  max-width: 1920px;
  margin: 0 auto;
  width: 100%;
}

/* 面板部分 */
.panel-section {
  margin-bottom: var(--spacing-4);
}

.panel-section:last-child {
  margin-bottom: 0;
}

.panel-title {
  margin: 0 0 var(--spacing-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
}

.label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

select {
  padding: var(--spacing-3);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

select:hover {
  border-color: var(--color-primary);
}

select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

.geomodel-input-group {
  display: flex;
  gap: var(--spacing-2);
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.icon-btn:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
}

.btn {
  padding: var(--spacing-3) var(--spacing-4);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
}

.btn.primary {
  background: var(--gradient-primary);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-btn-hover);
}

.btn.secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--border-color);
}

.btn.secondary:hover:not(:disabled) {
  background: var(--color-bg-hover);
  border-color: var(--color-primary);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-tip {
  margin-top: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-error-bg);
  border: 1px solid var(--color-error-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-error);
}

/* 质量卡片（使用 StatCard 后简化） */
.quality-cards {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

/* 钻孔列表 */
.borehole-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.borehole-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  transition: background var(--transition-fast);
}

.borehole-item:hover {
  background: var(--color-bg-hover);
}

.bh-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.bh-coords {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-family: var(--font-family-mono);
}

.text-btn {
  padding: var(--spacing-2) var(--spacing-3);
  border: none;
  background: transparent;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.text-btn:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

/* 可视化面板 */
.viz-panel {
  background: var(--color-bg-card);
  border: 1px solid var(--border-color-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
}

.viz-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color-light);
  background: var(--color-bg-elevated);
}

.viz-tab {
  padding: var(--spacing-3) var(--spacing-5);
  border: none;
  background: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
}

.viz-tab:hover {
  color: var(--color-primary);
  background: var(--color-bg-hover);
}

.viz-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.viz-content {
  padding: var(--spacing-5);
  flex: 1;
  min-height: 0;
}

.viz-view {
  min-height: 600px;
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
  min-height: 600px;
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
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

.combined-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--spacing-4);
  height: 600px;
}

.combined-geomodel {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-color-light);
}

.combined-mpi {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.mpi-legend h4 {
  margin: 0 0 var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.mpi-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
}

.stat-card {
  padding: var(--spacing-5);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color-light);
}

.stat-card h4 {
  margin: 0 0 var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  font-family: var(--font-family-mono);
}

.stat-label {
  margin-top: var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

/* 表格区域 */
.borehole-table-section {
  margin-top: var(--spacing-6);
}

.table-section-title {
  margin: 0 0 var(--spacing-4);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

/* MPI 热力图布局 */
.heatmap-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  align-items: center;
  padding: var(--spacing-4);
}

.heatmap-legend {
  width: 100%;
  max-width: 600px;
}

.coords {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
  font-family: var(--font-family-mono);
  color: var(--color-text-secondary);
}

/* 全屏模态框 */
.fullscreen-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.fullscreen-content {
  width: 100%;
  height: 100%;
}

/* 响应式 */
@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .combined-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
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
