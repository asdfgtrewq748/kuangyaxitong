<template>
  <div class="geomodel-viewer" :class="{ fullscreen }">
    <header v-if="!fullscreen" class="gm-header">
      <div class="gm-header-left">
        <h3 class="gm-title">{{ title }}</h3>
        <span v-if="subtitle" class="gm-subtitle">{{ subtitle }}</span>
      </div>
      <div class="gm-header-right">
        <button v-if="canFullscreen" class="gm-icon-btn" @click="toggleFullscreen" title="全屏">⛶</button>
      </div>
    </header>

    <div class="gm-body" :class="{ 'with-controls': showControls && hasData }">
      <div class="gm-content" ref="contentRef">
        <AsyncState
          v-if="loading || !hasData || !!errorText"
          :loading="loading"
          :hasData="hasData"
          :errorText="errorText"
          :loadingText="loadingText || '加载地质模型...'"
          :emptyText="emptyText || '暂无地质模型数据'"
          :action="emptyAction"
        />

        <div v-show="hasData && !loading && !errorText" class="gm-canvas" ref="canvasRef">
          <canvas ref="threeCanvasRef"></canvas>

          <div v-if="hoveredLayer" class="gm-layer-info">
            <span class="gm-layer-name">{{ hoveredLayer.name }}</span>
            <span class="gm-layer-value">厚度: {{ formatThickness(hoveredLayer.thickness) }}m</span>
          </div>

          <div v-if="quality" class="gm-quality-badge" :class="qualityClass">
            <span class="gm-quality-label">质量评分</span>
            <span class="gm-quality-value">{{ qualityScore }}</span>
          </div>
        </div>
      </div>

      <div v-if="showControls && hasData" class="gm-controls">
        <div class="gm-control-section">
          <h4 class="gm-control-title">图层选择</h4>
          <div class="gm-layer-list">
            <label
              v-for="layer in availableLayers"
              :key="layer.name"
              class="gm-layer-item"
              :class="{ active: isLayerVisible(layer.name) }"
            >
              <input
                :id="`layer-${layer.name}`"
                type="checkbox"
                :checked="isLayerVisible(layer.name)"
                @change="toggleLayer(layer.name)"
              />
              <span class="gm-layer-color" :style="{ background: layer.color }"></span>
              <span class="gm-layer-name">{{ layer.displayName || layer.name }}</span>
              <span class="gm-layer-thickness">{{ formatThickness(layer.avgThickness) }}m</span>
            </label>
          </div>
        </div>

        <div class="gm-control-section">
          <h4 class="gm-control-title">视图控制</h4>
          <div class="gm-view-buttons">
            <button class="gm-view-btn" @click="setView('top')" title="俯视图">俯</button>
            <button class="gm-view-btn" @click="setView('front')" title="前视图">前</button>
            <button class="gm-view-btn" @click="setView('side')" title="侧视图">侧</button>
            <button class="gm-view-btn" @click="resetView" title="重置">重</button>
          </div>
        </div>

        <div v-if="showQualityInfo && quality" class="gm-control-section">
          <h4 class="gm-control-title">质量指标</h4>
          <div class="gm-quality-stats">
            <div class="gm-stat-row">
              <span class="gm-stat-label">连续性</span>
              <div class="gm-stat-bar">
                <div class="gm-stat-fill" :style="{ width: `${(quality.continuity_score || 0) * 100}%` }"></div>
              </div>
              <span class="gm-stat-value">{{ Math.round((quality.continuity_score || 0) * 100) }}%</span>
            </div>
            <div class="gm-stat-row">
              <span class="gm-stat-label">尖灭比</span>
              <div class="gm-stat-bar">
                <div class="gm-stat-fill warning" :style="{ width: `${(quality.pinchout_ratio || 0) * 100}%` }"></div>
              </div>
              <span class="gm-stat-value">{{ Math.round((quality.pinchout_ratio || 0) * 100) }}%</span>
            </div>
            <div class="gm-stat-row">
              <span class="gm-stat-label">层间CV</span>
              <div class="gm-stat-bar">
                <div class="gm-stat-fill" :style="{ width: `${Math.min((quality.layer_cv || 0) * 100, 100)}%` }"></div>
              </div>
              <span class="gm-stat-value">{{ Math.round((quality.layer_cv || 0) * 100) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button v-if="fullscreen" class="gm-close-fullscreen" @click="toggleFullscreen">×</button>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AsyncState from './AsyncState.vue'

const props = defineProps({
  title: { type: String, default: '地质模型' },
  subtitle: String,
  fullscreen: { type: Boolean, default: false },
  showControls: { type: Boolean, default: true },
  canFullscreen: { type: Boolean, default: true },

  modelData: { type: Object, default: null },
  layers: { type: Array, default: () => [] },
  boreholes: { type: Array, default: () => [] },
  quality: { type: Object, default: null },
  jobId: String,

  loading: { type: Boolean, default: false },
  loadingText: String,
  errorText: { type: String, default: '' },
  emptyText: String,
  emptyAction: Object,

  showQualityInfo: { type: Boolean, default: true },
  initialView: { type: String, default: 'perspective' },
  initialLayers: { type: Array, default: () => [] },
})

const emit = defineEmits(['fullscreen-toggle', 'layer-toggle', 'layer-hover', 'view-change', 'refresh'])

const contentRef = ref(null)
const threeCanvasRef = ref(null)

const isFullscreen = ref(props.fullscreen)
const hoveredLayer = ref(null)
const visibleLayers = ref(new Set(props.initialLayers))
const currentView = ref(props.initialView)

const hasData = computed(() => !!props.modelData || (props.layers && props.layers.length > 0))

const availableLayers = computed(() => {
  if (!props.layers || props.layers.length === 0) return generateLayersFromBoreholes()
  return props.layers.map((layer) => ({
    ...layer,
    color: layer.color || getLayerColor(layer.name || 'layer'),
    avgThickness: layer.avgThickness || calculateAvgThickness(layer),
    displayName: layer.displayName || layer.name,
  }))
})

const qualityScore = computed(() => {
  if (!props.quality) return null
  const continuity = props.quality.continuity_score || 0
  const pinchout = 1 - (props.quality.pinchout_ratio || 0)
  const cv = 1 - Math.min(props.quality.layer_cv || 0, 1)
  return Math.round((continuity * 0.4 + pinchout * 0.3 + cv * 0.3) * 100)
})

const qualityClass = computed(() => {
  if (!qualityScore.value) return ''
  if (qualityScore.value >= 80) return 'excellent'
  if (qualityScore.value >= 60) return 'good'
  if (qualityScore.value >= 40) return 'fair'
  return 'poor'
})

const formatThickness = (val) => {
  const num = parseFloat(val)
  return Number.isFinite(num) ? num.toFixed(2) : '-'
}

const isLayerVisible = (name) => visibleLayers.value.has(name)

const toggleLayer = (name) => {
  if (visibleLayers.value.has(name)) {
    visibleLayers.value.delete(name)
  } else {
    visibleLayers.value.add(name)
  }
  emit('layer-toggle', { name, visible: visibleLayers.value.has(name) })
  updateVisualization()
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emit('fullscreen-toggle', isFullscreen.value)
}

const setView = (view) => {
  currentView.value = view
  emit('view-change', view)
  updateVisualization()
}

const resetView = () => {
  currentView.value = 'perspective'
  visibleLayers.value = new Set(availableLayers.value.map((l) => l.name))
  emit('view-change', 'perspective')
  updateVisualization()
}

const generateLayersFromBoreholes = () => {
  const layerMap = new Map()
  for (const bh of props.boreholes || []) {
    for (const layer of bh.layers || []) {
      if (!layerMap.has(layer.name)) {
        layerMap.set(layer.name, { name: layer.name, thickness: layer.thickness || 0, samples: 1 })
      } else {
        const existing = layerMap.get(layer.name)
        existing.thickness += layer.thickness || 0
        existing.samples += 1
      }
    }
  }

  return Array.from(layerMap.entries()).map(([name, data]) => ({
    name,
    avgThickness: data.samples > 0 ? data.thickness / data.samples : 0,
    color: getLayerColor(name),
  }))
}

const getLayerColor = (name) => {
  const colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#14B8A6', '#F97316']
  let hash = 0
  for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

const calculateAvgThickness = (layer) => {
  if (layer.avgThickness) return layer.avgThickness
  if (layer.thickness) return layer.thickness
  return 0
}

let scene = null
let camera = null
let renderer = null
let animationId = null

const initThree = async () => {
  if (!hasData.value || props.loading || props.errorText || !threeCanvasRef.value || !contentRef.value) return

  const { Scene, PerspectiveCamera, WebGLRenderer, Color, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } = await import('three')

  const width = contentRef.value.clientWidth || 800
  const height = contentRef.value.clientHeight || 500

  scene = new Scene()
  scene.background = new Color(0xf8fafc)

  camera = new PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.set(50, 60, 100)
  camera.lookAt(0, 0, 0)

  renderer = new WebGLRenderer({ canvas: threeCanvasRef.value, antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio || 1)

  const plane = new Mesh(
    new PlaneGeometry(220, 220, 20, 20),
    new MeshBasicMaterial({ color: 0xe2e8f0, side: DoubleSide })
  )
  plane.rotation.x = -Math.PI / 2
  scene.add(plane)

  const animate = () => {
    if (!renderer || !scene || !camera) return
    animationId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
}

const updateVisualization = () => {
  if (!scene) return
}

const onResize = () => {
  if (!camera || !renderer || !contentRef.value) return
  const width = contentRef.value.clientWidth
  const height = contentRef.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  initThree()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
})

watch(
  () => props.layers,
  () => {
    if (!visibleLayers.value.size && availableLayers.value.length > 0) {
      visibleLayers.value = new Set(availableLayers.value.map((l) => l.name))
    }
    updateVisualization()
  },
  { deep: true }
)

watch(
  () => [props.modelData, props.loading, props.errorText],
  async () => {
    await initThree()
    updateVisualization()
  },
  { deep: true }
)
</script>

<style scoped>
.geomodel-viewer {
  --gm-primary: #0f766e;
  --gm-primary-light: rgba(15, 118, 110, 0.1);
  --gm-border: rgba(148, 163, 184, 0.25);
  --gm-bg: rgba(255, 255, 255, 0.95);
  --gm-text: #334155;
  --gm-text-secondary: #64748b;

  background: var(--gm-bg);
  border: 1px solid var(--gm-border);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 500px;
}

.geomodel-viewer.fullscreen {
  position: fixed;
  inset: 0;
  z-index: 1000;
  border-radius: 0;
}

.gm-body {
  flex: 1;
  min-height: 0;
  display: flex;
}

.gm-body.with-controls .gm-content {
  min-width: 0;
}

.gm-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--gm-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.98);
}

.gm-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--gm-text);
}

.gm-subtitle {
  font-size: 12px;
  color: var(--gm-text-secondary);
}

.gm-icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--gm-text-secondary);
  cursor: pointer;
  border-radius: 6px;
}

.gm-icon-btn:hover {
  background: var(--gm-primary-light);
  color: var(--gm-primary);
}

.gm-content {
  flex: 1;
  position: relative;
  min-width: 0;
  min-height: 360px;
}

.gm-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  overflow: hidden;
}

.gm-canvas canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.gm-layer-info {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.9);
  border-radius: 8px;
  color: white;
  font-size: 12px;
  display: flex;
  flex-direction: column;
}

.gm-quality-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--gm-border);
}

.gm-quality-badge.excellent { background: #f0fdf4; border-color: #86efac; color: #166534; }
.gm-quality-badge.good { background: #f0fdfa; border-color: #6ee7b7; color: #15803d; }
.gm-quality-badge.fair { background: #fffbeb; border-color: #fcd34d; color: #a16207; }
.gm-quality-badge.poor { background: #fef2f2; border-color: #fca5a5; color: #991b1b; }

.gm-quality-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

.gm-quality-value {
  font-size: 20px;
  font-weight: 700;
}

.gm-controls {
  width: 280px;
  flex-shrink: 0;
  border-left: 1px solid var(--gm-border);
  background: rgba(255, 255, 255, 0.98);
  overflow-y: auto;
  max-height: 100%;
}

.gm-control-section {
  padding: 16px;
  border-bottom: 1px solid var(--gm-border);
}

.gm-control-title {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--gm-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.gm-layer-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gm-layer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.gm-layer-item:hover {
  background: var(--gm-primary-light);
}

.gm-layer-item input {
  display: none;
}

.gm-layer-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.gm-layer-item.active .gm-layer-color {
  box-shadow: 0 0 0 2px var(--gm-primary);
}

.gm-layer-item .gm-layer-name {
  flex: 1;
  font-size: 13px;
  color: var(--gm-text);
}

.gm-layer-thickness {
  font-size: 11px;
  color: var(--gm-text-secondary);
}

.gm-view-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.gm-view-btn {
  height: 36px;
  border: 1px solid var(--gm-border);
  background: white;
  border-radius: 6px;
  cursor: pointer;
}

.gm-view-btn:hover {
  border-color: var(--gm-primary);
  background: var(--gm-primary-light);
}

.gm-quality-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gm-stat-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gm-stat-label {
  width: 60px;
  font-size: 11px;
  color: var(--gm-text-secondary);
}

.gm-stat-bar {
  flex: 1;
  height: 6px;
  background: rgba(148, 163, 184, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.gm-stat-fill {
  height: 100%;
  background: var(--gm-primary);
}

.gm-stat-fill.warning {
  background: #f59e0b;
}

.gm-stat-value {
  width: 40px;
  font-size: 11px;
  text-align: right;
  color: var(--gm-text);
}

.gm-close-fullscreen {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(15, 23, 42, 0.9);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
}

@media (max-width: 768px) {
  .gm-body.with-controls {
    flex-direction: column;
  }

  .gm-controls {
    width: 100%;
    max-height: 260px;
    border-left: none;
    border-top: 1px solid var(--gm-border);
  }
}
</style>