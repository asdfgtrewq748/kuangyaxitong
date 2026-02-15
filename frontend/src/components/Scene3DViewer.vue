<template>
  <div class="scene-3d-viewer" :class="{ fullscreen, 'show-inspector': showInspector }">
    <header class="viewer-header">
      <div class="header-left">
        <h2 class="viewer-title">{{ title }}</h2>
        <span v-if="subtitle" class="viewer-subtitle">{{ subtitle }}</span>
      </div>

      <div class="header-center">
        <div class="indicator-tabs">
          <button
            v-for="indicator in indicators"
            :key="indicator.id"
            :class="['tab-btn', { active: activeIndicator === indicator.id }]"
            @click="setActiveIndicator(indicator.id)"
          >
            {{ indicator.label }}
          </button>
        </div>
      </div>

      <div class="header-right">
        <div class="view-modes">
          <button
            :class="['mode-btn', { active: viewMode === 'scene' }]"
            @click="viewMode = 'scene'"
            title="3D 场景"
          >
            3D
          </button>
          <button
            :class="['mode-btn', { active: viewMode === 'split' }]"
            @click="viewMode = 'split'"
            title="分屏对比"
          >
            分屏
          </button>
        </div>

        <div class="header-actions">
          <button class="icon-btn" @click="resetCamera" title="重置视角">⟲</button>
          <button class="icon-btn" @click="toggleFullscreen" title="全屏">⛶</button>
        </div>
      </div>
    </header>

    <div class="viewer-content">
      <AsyncState
        v-if="loading || !hasData || !!errorText"
        :loading="loading"
        :hasData="hasData"
        :errorText="errorText"
        :loadingText="loadingText || '加载 3D 场景...'"
        :emptyText="emptyText || '暂无可视化数据'"
        :action="emptyAction"
      />

      <template v-else>
        <div v-show="viewMode === 'scene'" class="scene-container" ref="sceneContainer">
          <canvas ref="canvasRef" class="three-canvas"></canvas>

          <div class="layer-controls-overlay">
            <div class="layer-controls">
              <h4 class="controls-title">图层</h4>
              <div class="layer-toggles">
                <label v-for="layer in visibleLayers" :key="layer.id" class="layer-toggle">
                  <input type="checkbox" :checked="layer.visible" @change="toggleLayer(layer.id)" />
                  <span class="layer-color" :style="{ background: layer.color }"></span>
                  <span class="layer-name">{{ layer.name }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="scale-overlay">
            <div class="value-scale">
              <div class="scale-labels">
                <span>{{ formatValue(displayStats.min) }}</span>
                <span>{{ formatValue(displayStats.max) }}</span>
              </div>
              <div class="scale-bar"></div>
            </div>
          </div>

          <div v-if="showStats" class="stats-overlay">
            <div class="stats-panel">
              <h4 class="stats-title">统计</h4>
              <div class="stats-list">
                <div class="stat-item"><span>最小</span><strong>{{ formatValue(displayStats.min) }}</strong></div>
                <div class="stat-item"><span>最大</span><strong>{{ formatValue(displayStats.max) }}</strong></div>
                <div class="stat-item"><span>平均</span><strong>{{ formatValue(displayStats.mean) }}</strong></div>
                <div class="stat-item"><span>标准差</span><strong>{{ formatValue(displayStats.std) }}</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="viewMode === 'split'" class="split-view">
          <div class="split-panel">3D 场景</div>
          <div class="split-panel">二维热力图</div>
        </div>

        <div v-if="showInspector" class="inspector-panel">
          <div class="inspector-header">
            <h3>详细信息</h3>
            <button class="close-btn" @click="$emit('view-change', 'close-inspector')">×</button>
          </div>
          <div class="inspector-content">
            <div class="data-row"><span>当前指标</span><strong>{{ activeIndicator.toUpperCase() }}</strong></div>
            <div class="data-row"><span>图层数量</span><strong>{{ layers?.length || 0 }}</strong></div>
            <div class="data-row"><span>坐标范围</span><strong>{{ boundsText }}</strong></div>
          </div>
        </div>
      </template>
    </div>

    <button v-if="fullscreen" class="fullscreen-close" @click="toggleFullscreen">×</button>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AsyncState from './AsyncState.vue'

const props = defineProps({
  title: { type: String, default: '3D 可视化' },
  subtitle: String,
  fullscreen: { type: Boolean, default: false },
  showInspector: { type: Boolean, default: false },

  sceneData: { type: Object, default: null },
  layers: { type: Array, default: () => [] },
  indicatorValues: { type: Object, default: null },
  bounds: { type: Object, default: null },
  stats: { type: Object, default: null },

  loading: { type: Boolean, default: false },
  loadingText: String,
  errorText: { type: String, default: '' },
  emptyText: String,
  emptyAction: Object,
})

const emit = defineEmits(['fullscreen-toggle', 'indicator-change', 'layer-toggle', 'point-select', 'view-change'])

const sceneContainer = ref(null)
const canvasRef = ref(null)

const viewMode = ref('scene')
const activeIndicator = ref('mpi')
const showStats = ref(true)
const isFullscreen = ref(props.fullscreen)

const indicators = [
  { id: 'mpi', label: 'MPI', color: '#0f766e' },
  { id: 'rsi', label: 'RSI', color: '#3b82f6' },
  { id: 'bri', label: 'BRI', color: '#f59e0b' },
  { id: 'asi', label: 'ASI', color: '#10b981' },
]

const hasData = computed(() => !!props.sceneData || (props.layers?.length || 0) > 0)

const displayStats = computed(() => {
  const source = props.stats && typeof props.stats === 'object' ? props.stats : {}
  const min = Number(source[`${activeIndicator.value}_min`] ?? source.min ?? 0)
  const max = Number(source[`${activeIndicator.value}_max`] ?? source.max ?? 1)
  const mean = Number(source[`${activeIndicator.value}_mean`] ?? source.mean ?? 0)
  const std = Number(source[`${activeIndicator.value}_std`] ?? source.std ?? 0)

  return {
    min: Number.isFinite(min) ? min : 0,
    max: Number.isFinite(max) ? max : 1,
    mean: Number.isFinite(mean) ? mean : 0,
    std: Number.isFinite(std) ? std : 0,
  }
})

const boundsText = computed(() => {
  if (!props.bounds) return '-'
  const b = props.bounds
  return `X:${Number(b.min_x ?? 0).toFixed(0)}~${Number(b.max_x ?? 0).toFixed(0)} / Y:${Number(b.min_y ?? 0).toFixed(0)}~${Number(b.max_y ?? 0).toFixed(0)}`
})

const visibleLayers = ref(
  (props.layers || []).map((layer) => ({
    id: layer.id || layer.name,
    name: layer.displayName || layer.name,
    color: layer.color || getLayerColor(layer.name || 'layer'),
    visible: true,
  }))
)

const formatValue = (val) => {
  const num = parseFloat(val)
  return Number.isFinite(num) ? num.toFixed(2) : '-'
}

const setActiveIndicator = (id) => {
  activeIndicator.value = id
  emit('indicator-change', id)
}

const toggleLayer = (id) => {
  const layer = visibleLayers.value.find((l) => l.id === id)
  if (!layer) return
  layer.visible = !layer.visible
  emit('layer-toggle', { id, visible: layer.visible })
  updateLayers()
}

const resetCamera = () => {
  emit('view-change', 'reset')
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emit('fullscreen-toggle', isFullscreen.value)
}

const getLayerColor = (name) => {
  const colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#14B8A6', '#F97316']
  let hash = 0
  for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

let scene = null
let camera = null
let renderer = null
let animationId = null

const initThreeJS = async () => {
  if (!canvasRef.value || !sceneContainer.value || !hasData.value) return

  const { Scene, PerspectiveCamera, WebGLRenderer, Color, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } = await import('three')

  const width = sceneContainer.value.clientWidth || 800
  const height = sceneContainer.value.clientHeight || 500

  scene = new Scene()
  scene.background = new Color(0xf8fafc)

  camera = new PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.set(50, 60, 100)
  camera.lookAt(0, 0, 0)

  renderer = new WebGLRenderer({ canvas: canvasRef.value, antialias: true, alpha: true })
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

const updateLayers = () => {
  if (!scene) return
}

const onWindowResize = () => {
  if (!camera || !renderer || !sceneContainer.value) return
  const width = sceneContainer.value.clientWidth
  const height = sceneContainer.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  window.addEventListener('resize', onWindowResize)
  if (hasData.value && !props.loading && !props.errorText) initThreeJS()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
})

watch(
  () => props.layers,
  () => {
    visibleLayers.value = (props.layers || []).map((layer) => ({
      id: layer.id || layer.name,
      name: layer.displayName || layer.name,
      color: layer.color || getLayerColor(layer.name || 'layer'),
      visible: true,
    }))
    updateLayers()
  },
  { deep: true }
)

watch(
  () => [props.sceneData, props.loading, props.errorText],
  async () => {
    if (props.loading || props.errorText || !hasData.value) return
    await initThreeJS()
    updateLayers()
  },
  { deep: true }
)

watch(viewMode, (newMode) => emit('view-change', newMode))
</script>

<style scoped>
.scene-3d-viewer {
  --viewer-bg: #f8fafc;
  --viewer-border: rgba(148, 163, 184, 0.2);
  --viewer-text: #334155;
  --viewer-text-secondary: #64748b;
  --viewer-primary: #0f766e;

  background: var(--viewer-bg);
  border: 1px solid var(--viewer-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 540px;
}

.viewer-header {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--viewer-border);
  background: #fff;
}

.viewer-title {
  margin: 0;
  font-size: 32px;
  line-height: 1.1;
  color: #0f172a;
}

.viewer-subtitle {
  font-size: 12px;
  color: var(--viewer-text-secondary);
}

.indicator-tabs {
  display: flex;
  gap: 6px;
}

.tab-btn {
  border: 1px solid var(--viewer-border);
  background: #fff;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
}

.tab-btn.active {
  background: var(--viewer-primary);
  color: #fff;
  border-color: var(--viewer-primary);
}

.view-modes,
.header-actions {
  display: flex;
  gap: 6px;
}

.mode-btn,
.icon-btn {
  border: 1px solid var(--viewer-border);
  background: #fff;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
}

.mode-btn.active {
  border-color: var(--viewer-primary);
  color: var(--viewer-primary);
}

.viewer-content {
  flex: 1;
  min-height: 0;
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
}

.scene-container {
  position: relative;
  min-height: 500px;
  border-right: 1px solid var(--viewer-border);
}

.three-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.layer-controls-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
}

.layer-controls {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--viewer-border);
  border-radius: 8px;
  padding: 10px;
  width: 200px;
}

.controls-title {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--viewer-text-secondary);
}

.layer-toggles {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.layer-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.layer-color {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.scale-overlay {
  position: absolute;
  right: 14px;
  bottom: 14px;
}

.value-scale {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--viewer-border);
  border-radius: 8px;
  padding: 8px;
  width: 180px;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.scale-bar {
  margin-top: 6px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(to right, #22c55e, #fbbf24, #ef4444);
}

.split-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 10px;
}

.split-panel {
  min-height: 500px;
  border: 1px dashed var(--viewer-border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--viewer-text-secondary);
  background: #fff;
}

.inspector-panel {
  border-left: 1px solid var(--viewer-border);
  background: #fff;
}

.inspector-header {
  height: 64px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--viewer-border);
}

.inspector-header h3 {
  margin: 0;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.inspector-content {
  padding: 14px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
}

.stats-overlay {
  position: absolute;
  right: 10px;
  top: 10px;
}

.stats-panel {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--viewer-border);
  border-radius: 8px;
  padding: 8px;
  width: 170px;
}

.stats-title {
  margin: 0 0 6px;
  font-size: 12px;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.fullscreen-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: rgba(15, 23, 42, 0.85);
  color: #fff;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .viewer-content {
    grid-template-columns: 1fr;
  }

  .inspector-panel {
    border-left: none;
    border-top: 1px solid var(--viewer-border);
  }
}
</style>
