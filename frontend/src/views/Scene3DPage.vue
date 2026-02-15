<template>
  <div class="scene3d-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">3D Workspace</p>
        <h1>三维指标可视化</h1>
        <p class="subtitle">页面打开后自动加载默认煤层数据，无需手动点击开始。</p>
      </div>
      <div class="header-actions">
        <button class="btn secondary" :disabled="!canLoadData" @click="loadData">刷新</button>
      </div>
    </header>

    <div class="summary-strip">
      <span class="chip">当前煤层：{{ selectedSeam || '未选择' }}</span>
      <span class="chip">分辨率：{{ resolution }}</span>
      <span class="chip" :class="{ loading, error: !!loadError }">{{ statusText }}</span>
      <span v-if="lastUpdatedAt" class="chip">更新于：{{ lastUpdatedAt }}</span>
    </div>

    <div class="main-layout">
      <aside class="side-panel">
        <section class="card">
          <h3>数据源</h3>
          <label class="field">
            <span>煤层</span>
            <select v-model="selectedSeam" :disabled="loading" @change="onSeamChange">
              <option value="">-- 请选择 --</option>
              <option v-for="seam in seamOptions" :key="seam" :value="seam">{{ seam }}</option>
            </select>
          </label>
          <label class="field">
            <span>分辨率</span>
            <input v-model.number="resolution" type="number" min="20" max="150" step="10" />
          </label>
          <p v-if="loadError" class="error-tip">{{ loadError }}</p>
        </section>

        <section v-if="hasData" class="card">
          <h3>显示指标</h3>
          <div class="indicator-list">
            <label
              v-for="indicator in indicators"
              :key="indicator.id"
              :class="['indicator-item', { active: activeIndicator === indicator.id }]"
            >
              <input v-model="activeIndicator" type="radio" :value="indicator.id" />
              <span class="dot" :style="{ background: indicator.color }"></span>
              <span class="name">{{ indicator.name }}</span>
              <span class="desc">{{ indicator.description }}</span>
            </label>
          </div>
        </section>

        <section v-if="sceneStats" class="card">
          <h3>场景信息</h3>
          <div class="kv"><span>图层</span><strong>{{ sceneStats.layerCount ?? 0 }}</strong></div>
          <div class="kv"><span>钻孔</span><strong>{{ sceneStats.boreholeCount ?? 0 }}</strong></div>
          <div class="kv stack">
            <span>范围</span>
            <small>
              X: {{ sceneStats.bounds?.min_x ?? '-' }} - {{ sceneStats.bounds?.max_x ?? '-' }}
            </small>
            <small>
              Y: {{ sceneStats.bounds?.min_y ?? '-' }} - {{ sceneStats.bounds?.max_y ?? '-' }}
            </small>
          </div>
        </section>
      </aside>

      <main class="viewer-panel">
        <Scene3DViewer
          ref="viewerRef"
          :title="pageTitle"
          :subtitle="pageSubtitle"
          :fullscreen="isFullscreen"
          :showInspector="true"
          :sceneData="sceneData"
          :layers="layers"
          :indicatorValues="indicatorValues"
          :indicatorConfig="activeIndicatorConfig"
          :stats="activeIndicatorValues"
          :bounds="bounds"
          :loading="loading"
          :loadingText="loadingText"
          :errorText="loadError"
          :emptyText="emptyText"
          :emptyAction="emptyAction"
          @fullscreen-toggle="onFullscreenToggle"
          @indicator-change="onIndicatorChange"
          @layer-toggle="onLayerToggle"
          @point-select="onPointSelect"
          @view-change="onViewChange"
        />
      </main>

      <aside v-if="hasData" class="stats-panel">
        <section class="card">
          <h3>当前指标</h3>
          <div class="indicator-head" :style="{ borderLeftColor: activeIndicatorConfig?.color }">
            <strong>{{ activeIndicatorConfig?.name }}</strong>
            <small>{{ activeIndicatorConfig?.fullName }}</small>
          </div>
          <div class="metric-row">
            <div><small>最小</small><strong>{{ formatValue(activeIndicatorValues.min) }}</strong></div>
            <div><small>最大</small><strong>{{ formatValue(activeIndicatorValues.max) }}</strong></div>
            <div><small>平均</small><strong>{{ formatValue(activeIndicatorValues.mean) }}</strong></div>
          </div>
          <div class="hist">
            <canvas ref="histogramCanvas"></canvas>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Scene3DViewer from '../components/Scene3DViewer.vue'
import { getCoalSeams, getScene3DData, getApiErrorMessage } from '../api'

const route = useRoute()

const selectedSeam = ref('')
const seamsRaw = ref([])
const resolution = ref(50)
const loading = ref(false)
const hasData = ref(false)
const isFullscreen = ref(false)
const loadError = ref('')
const lastUpdatedAt = ref('')

const sceneData = ref(null)
const layers = ref([])
const indicatorValues = ref(null)
const bounds = ref(null)
const sceneStats = ref(null)

const activeIndicator = ref('mpi')
const indicators = [
  { id: 'mpi', name: 'MPI', fullName: '矿压影响指标', description: '综合压力评估', color: '#0f766e' },
  { id: 'rsi', name: 'RSI', fullName: '顶板稳定指数', description: '稳定状态评估', color: '#3b82f6' },
  { id: 'bri', name: 'BRI', fullName: '冲击风险指数', description: '危险程度评估', color: '#f59e0b' },
  { id: 'asi', name: 'ASI', fullName: '支承应力指数', description: '应力分布评估', color: '#10b981' },
]

const viewerRef = ref(null)
const histogramCanvas = ref(null)
let autoLoadTimer = null
let loadController = null

const seamOptions = computed(() =>
  (seamsRaw.value || [])
    .map((item) => (typeof item === 'string' ? item : item?.name))
    .filter((name) => typeof name === 'string' && name.length > 0)
)

const activeIndicatorConfig = computed(() => indicators.find((i) => i.id === activeIndicator.value))

const activeIndicatorValues = computed(() => {
  const source = indicatorValues.value
  if (!source || typeof source !== 'object') return { min: 0, max: 1, mean: 0.5, std: 0 }

  const key = activeIndicator.value
  const raw = source[key] || source[String(key).toUpperCase()] || source
  if (!raw || typeof raw !== 'object') return { min: 0, max: 1, mean: 0.5, std: 0 }

  const min = Number(raw.min ?? raw.minimum ?? 0)
  const max = Number(raw.max ?? raw.maximum ?? 1)
  const mean = Number(raw.mean ?? raw.avg ?? 0.5)
  const std = Number(raw.std ?? raw.stdev ?? 0)
  return {
    min: Number.isFinite(min) ? min : 0,
    max: Number.isFinite(max) ? max : 1,
    mean: Number.isFinite(mean) ? mean : 0.5,
    std: Number.isFinite(std) ? std : 0,
  }
})

const pageTitle = computed(() => `${activeIndicatorConfig.value?.name || 'MPI'} 三维可视化`)
const pageSubtitle = computed(() => (selectedSeam.value ? `煤层: ${selectedSeam.value}` : '三维指标可视化系统'))
const canLoadData = computed(() => !!selectedSeam.value && !loading.value)
const loadingText = computed(() =>
  loading.value
    ? selectedSeam.value
      ? `正在自动加载煤层 ${selectedSeam.value} 的场景...`
      : '正在自动加载场景...'
    : ''
)
const emptyText = computed(() =>
  selectedSeam.value ? '未获取到场景数据，请检查后端接口返回。' : '请先选择煤层'
)
const emptyAction = computed(() =>
  loadError.value ? { label: '重试加载', onClick: () => loadData() } : null
)
const statusText = computed(() => {
  if (loading.value) return '自动加载中'
  if (loadError.value) return '加载失败'
  if (hasData.value) return '已自动加载'
  return '等待数据'
})

const formatValue = (val) => {
  const num = Number(val)
  return Number.isFinite(num) ? num.toFixed(3) : '-'
}

const scheduleAutoLoad = (delay = 260) => {
  if (!selectedSeam.value) return
  if (autoLoadTimer) clearTimeout(autoLoadTimer)
  autoLoadTimer = setTimeout(() => {
    loadData()
  }, delay)
}

const loadSeams = async () => {
  const response = await getCoalSeams()
  seamsRaw.value = response.data?.seams || []
}

const loadData = async () => {
  if (!selectedSeam.value) return

  if (loadController) loadController.abort()
  loadController = new AbortController()
  const { signal } = loadController

  loading.value = true
  loadError.value = ''

  try {
    const response = await getScene3DData(selectedSeam.value, resolution.value, { signal })
    const data = response.data || {}

    sceneData.value = data.scene ?? { seam: selectedSeam.value, resolution: resolution.value }
    layers.value = Array.isArray(data.layers) ? data.layers : []
    indicatorValues.value = data.indicators || data.indicatorValues || {}
    bounds.value = data.bounds ?? null
    sceneStats.value = data.stats ?? null
    hasData.value = !!sceneData.value || layers.value.length > 0
    lastUpdatedAt.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })

    setTimeout(drawHistogram, 60)
  } catch (err) {
    if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') return
    hasData.value = false
    loadError.value = getApiErrorMessage(err, '场景加载失败')
    console.error('Failed to load scene data:', err)
  } finally {
    if (loadController?.signal === signal) loadController = null
    loading.value = false
  }
}

const resetScene = () => {
  hasData.value = false
  sceneData.value = null
  layers.value = []
  indicatorValues.value = null
  bounds.value = null
  sceneStats.value = null
  loadError.value = ''
  lastUpdatedAt.value = ''
}

const onSeamChange = () => {
  resetScene()
  scheduleAutoLoad(120)
}

const onFullscreenToggle = (val) => {
  isFullscreen.value = val
}

const onIndicatorChange = (id) => {
  activeIndicator.value = id
}

const onLayerToggle = () => {}
const onPointSelect = () => {}
const onViewChange = () => {}

const drawHistogram = () => {
  const canvas = histogramCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = (canvas.width = canvas.offsetWidth || 280)
  const height = (canvas.height = 150)
  const min = activeIndicatorValues.value.min
  const max = activeIndicatorValues.value.max
  const mean = activeIndicatorValues.value.mean

  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#f1f5f9'
  ctx.fillRect(0, 0, width, height)

  const bars = 18
  const barW = width / bars
  for (let i = 0; i < bars; i += 1) {
    const ratio = i / (bars - 1)
    const h = 20 + Math.sin(ratio * Math.PI) * 70
    const y = height - h - 20
    ctx.fillStyle = `rgba(15,118,110,${0.25 + ratio * 0.55})`
    ctx.fillRect(i * barW + 2, y, barW - 4, h)
  }

  ctx.fillStyle = '#334155'
  ctx.font = '12px sans-serif'
  ctx.fillText(`min ${formatValue(min)}`, 8, height - 4)
  ctx.fillText(`mean ${formatValue(mean)}`, width / 2 - 30, height - 4)
  ctx.fillText(`max ${formatValue(max)}`, width - 88, height - 4)
}

onMounted(async () => {
  try {
    await loadSeams()
  } catch (err) {
    loadError.value = getApiErrorMessage(err, '煤层列表加载失败')
    return
  }

  const querySeam = typeof route.query.seam === 'string' ? route.query.seam : ''
  if (querySeam && seamOptions.value.includes(querySeam)) {
    selectedSeam.value = querySeam
  } else if (seamOptions.value.length > 0) {
    selectedSeam.value = seamOptions.value[0]
  }

  if (selectedSeam.value) {
    await loadData()
  }
})

watch(() => resolution.value, () => {
  if (selectedSeam.value) scheduleAutoLoad()
})

watch(activeIndicator, () => {
  if (hasData.value) drawHistogram()
})

onBeforeUnmount(() => {
  if (autoLoadTimer) clearTimeout(autoLoadTimer)
  if (loadController) loadController.abort()
})
</script>

<style scoped>
.scene3d-page { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg-page); }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 16px 24px; border-bottom: 1px solid var(--border-color); background: var(--gradient-card); }
.eyebrow { margin: 0; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-primary); }
h1 { margin: 4px 0 6px; font-size: 38px; line-height: 1.08; }
.subtitle { margin: 0; color: var(--text-secondary); }
.header-actions { display: flex; gap: 8px; }
.btn { padding: 8px 14px; border-radius: 8px; border: 1px solid transparent; cursor: pointer; }
.btn.secondary { background: var(--bg-secondary); color: var(--text-primary); border-color: var(--border-color); }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }

.summary-strip { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 16px; border-bottom: 1px solid var(--border-color); background: rgba(15, 118, 110, 0.04); }
.chip { font-size: 12px; padding: 4px 8px; border-radius: 999px; border: 1px solid var(--border-color); background: var(--bg-card); }
.chip.loading { color: #0f766e; border-color: #99f6e4; }
.chip.error { color: #b91c1c; border-color: #fecaca; }

.main-layout { flex: 1; display: grid; grid-template-columns: 280px minmax(0, 1fr) 300px; gap: 14px; padding: 14px; }
.side-panel, .stats-panel { display: flex; flex-direction: column; gap: 12px; }
.viewer-panel { min-width: 0; }
.card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; padding: 12px; }
.card h3 { margin: 0 0 10px; font-size: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
.field span { font-size: 12px; color: var(--text-secondary); }
.field select, .field input { padding: 8px 10px; border: 1px solid var(--border-color); border-radius: 6px; background: #fff; }

.error-tip { margin: 6px 0 0; font-size: 12px; color: #b91c1c; }

.indicator-list { display: flex; flex-direction: column; gap: 6px; }
.indicator-item { display: flex; align-items: center; gap: 8px; border-radius: 8px; padding: 8px; cursor: pointer; }
.indicator-item.active, .indicator-item:hover { background: var(--bg-hover); }
.indicator-item input { display: none; }
.indicator-item .dot { width: 10px; height: 10px; border-radius: 999px; }
.indicator-item .name { font-weight: 600; }
.indicator-item .desc { margin-left: auto; font-size: 12px; color: var(--text-secondary); }

.kv { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 13px; }
.kv.stack { align-items: flex-start; flex-direction: column; gap: 3px; }

.indicator-head { border-left: 4px solid; padding: 10px; border-radius: 8px; background: var(--bg-hover); display: flex; flex-direction: column; gap: 2px; }
.metric-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
.metric-row div { text-align: center; background: var(--bg-secondary); border-radius: 8px; padding: 8px 4px; }
.metric-row small { color: var(--text-secondary); display: block; margin-bottom: 4px; }
.metric-row strong { font-size: 16px; }
.hist { margin-top: 10px; height: 150px; background: #fff; border: 1px dashed var(--border-color); border-radius: 8px; overflow: hidden; }
.hist canvas { width: 100%; height: 100%; display: block; }

@media (max-width: 1280px) {
  .main-layout { grid-template-columns: 1fr; }
}
</style>
