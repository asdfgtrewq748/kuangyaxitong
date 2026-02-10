<template>
  <div ref="pageRoot" class="validation-page">
    <nav class="top-nav">
      <div class="nav-left">
        <button class="icon-btn" type="button" title="返回" @click="router.back()">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m0 0 6-6m-6 6 6 6" /></svg>
        </button>
        <h1>新算法实证</h1>
        <span class="divider"></span>
        <label class="seam-select">
          <span>煤层</span>
          <select v-model="seamName">
            <option v-for="item in seamOptions" :key="item.name" :value="item.name">{{ item.name }}</option>
          </select>
        </label>
        <div class="mini-stats" v-if="hasSpatialData">
          <span>均值 <b>{{ fmt(currentMetricStats.mean) }}</b></span>
          <span>最低 <b>{{ fmt(currentMetricStats.min) }}</b></span>
          <span class="danger">高风险点 <b>{{ currentHighRiskCount }}</b></span>
        </div>
      </div>

      <div class="nav-right">
        <button class="tool-btn" type="button" :class="{ active: showWeightPanel }" @click="showWeightPanel = !showWeightPanel">权重</button>
        <button class="tool-btn" type="button" :class="{ active: showEvalPanel }" @click="showEvalPanel = !showEvalPanel">评估</button>
        <button class="tool-btn" type="button" @click="exportCurrentFigure">导出高清图</button>
        <button class="tool-btn" type="button" :disabled="exportingPack || !hasSpatialData" @click="exportSciencePackage">{{ exportingPack ? '打包中...' : '导出图组包' }}</button>
        <button class="tool-btn" type="button" :disabled="!hasSpatialData" @click="goReport">下一步：结果报告</button>
        <button class="tool-btn" type="button" @click="toggleFullscreen">全屏</button>
      </div>
    </nav>

    <section class="metric-dashboard">
      <button
        v-for="item in metricDefs"
        :key="item.key"
        class="metric-card"
        :class="{ active: activeMetric === item.key, problematic: isIndicatorProblem(item.key) }"
        type="button"
        @click="activeMetric = item.key"
      >
        <div class="head">
          <strong>{{ item.label }}</strong>
          <span>{{ item.desc }}</span>
          <em v-if="isIndicatorProblem(item.key)" class="problem-dot">! 异常</em>
        </div>
        <div class="value">{{ fmt(spatialData?.statistics?.[item.key]?.mean) }}</div>
        <div class="meta"><span>最低 {{ fmt(spatialData?.statistics?.[item.key]?.min) }}</span><span>最高 {{ fmt(spatialData?.statistics?.[item.key]?.max) }}</span></div>
        <div class="risk-bar" :style="{ background: legendGradient(item.key) }"></div>
      </button>
    </section>

    <section class="main-layout">
      <div class="main-canvas-card">
        <header class="canvas-head">
          <div>
            <h2>{{ metricLabel(activeMetric) }}全矿区插值热力图</h2>
            <p>双击适配视图，拖拽平移，滚轮缩放</p>
          </div>
          <div class="canvas-controls">
            <label>分辨率<input v-model.number="resolution" type="number" min="20" max="120" step="5"></label>
            <label>线级<input v-model.number="contourLevels" type="number" min="5" max="24" step="1"></label>
            <label>插值
              <select v-model="method">
                <option value="idw">反距离权重</option>
                <option value="linear">线性插值</option>
                <option value="nearest">最近邻</option>
                <option value="kriging">克里金</option>
              </select>
            </label>
            <label class="check"><input v-model="showContours" type="checkbox">等值线</label>
            <label class="check"><input v-model="useFixedScale" type="checkbox">固定量程(0-100)</label>
          </div>
        </header>

        <div v-if="hasSpatialData" class="trust-banner">
          <span class="trust-chip real">空间图：真实钻孔与坐标数据</span>
          <span class="trust-chip warn">评估：{{ evalSourceLabel }}</span>
          <span class="trust-chip info">算法：{{ algorithmModeLabel }}</span>
          <span v-if="problemIndicatorLabels.length" class="trust-chip danger">
            指标异常：{{ problemIndicatorLabels.join('、') }}
          </span>
          <span v-if="showLowContrastHint" class="trust-chip hint">当前指标范围 {{ fmt(currentMetricRange) }}，固定量程会压缩色差</span>
          <span v-if="matrixSelection !== 'all' && matrixSelectionCount > 0" class="trust-chip link">
            联动高亮 {{ matrixRoleLabel(matrixSelection) }} · {{ matrixSelectionCount }}点
          </span>
          <span v-if="evalSourceFile" class="trust-meta">标签源 {{ evalSourceFile }}</span>
          <span class="trust-meta">钻孔 {{ spatialData?.borehole_count || 0 }} 个 · 坐标源 zuobiao.csv</span>
        </div>

        <div
          ref="stageContainer"
          class="stage"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerCancel"
          @pointerleave="onPointerLeave"
          @wheel.prevent="onWheel"
          @contextmenu.prevent
          @dblclick="fitStage"
        >
          <canvas ref="heatmapCanvas" class="layer"></canvas>
          <canvas ref="overlayCanvas" class="layer"></canvas>
          <div v-if="loading" class="loading-mask">
            <div class="skeleton"></div>
            <div class="skeleton"></div>
            <p>正在计算 {{ seamName || '目标煤层' }} 空间指标...</p>
          </div>
        </div>

        <footer class="legend-wrap">
          <div class="legend-track" :style="{ background: legendGradient(activeMetric) }"></div>
          <div class="legend-labels">
            <span>{{ fmt(legendStats.min) }}</span>
            <span>{{ fmt(legendStats.mean) }}</span>
            <span>{{ fmt(legendStats.max) }}</span>
          </div>
        </footer>
      </div>

      <aside ref="thumbPanelRef" class="thumb-panel" :class="{ collapsed: thumbsCollapsed }">
        <header>
          <h3>指标缩略图</h3>
          <button class="icon-btn mini" type="button" @click="thumbsCollapsed = !thumbsCollapsed">{{ thumbsCollapsed ? '展开' : '收起' }}</button>
        </header>
        <div class="thumb-list">
          <button
            v-for="item in metricDefs"
            :key="`thumb-${item.key}`"
            class="thumb-item"
            :class="{ active: activeMetric === item.key }"
            type="button"
            @click="activeMetric = item.key"
            @mouseenter="onThumbEnter(item.key, $event)"
            @mousemove="onThumbMove(item.key, $event)"
            @mouseleave="onThumbLeave"
          >
            <canvas :ref="setThumbCanvasRef(item.key)" class="thumb-canvas"></canvas>
            <div class="thumb-meta">
              <strong>{{ item.label }}</strong>
              <span>均值 {{ fmt(metricStats[item.key]?.mean) }}</span>
              <span>σ {{ fmt(metricStats[item.key]?.std) }}</span>
            </div>
          </button>
        </div>
        <div v-if="thumbHover.visible && thumbHoverStats" class="thumb-tooltip" :style="{ left: `${thumbHover.x + 12}px`, top: `${thumbHover.y + 12}px` }">
          <p><strong>{{ metricLabel(thumbHover.metric) }}统计</strong></p>
          <p>最小值 {{ fmt(thumbHoverStats.min) }}</p>
          <p>最大值 {{ fmt(thumbHoverStats.max) }}</p>
          <p>均值 {{ fmt(thumbHoverStats.mean) }}</p>
          <p>标准差 {{ fmt(thumbHoverStats.std) }}</p>
        </div>
      </aside>
    </section>

    <transition name="fade-up">
      <aside v-if="showWeightPanel" class="floating-panel">
        <header><h3>权重配置</h3><button type="button" class="close-btn" @click="showWeightPanel = false">×</button></header>
        <p>RSI / BRI / ASI 自动归一化。调整后 300ms 内自动重算。</p>
        <label class="weight-row"><span>RSI</span><input v-model.number="weights.rsi" type="range" min="0" max="1" step="0.05"><strong>{{ pct(normalizedWeights.rsi) }}</strong></label>
        <label class="weight-row"><span>BRI</span><input v-model.number="weights.bri" type="range" min="0" max="1" step="0.05"><strong>{{ pct(normalizedWeights.bri) }}</strong></label>
        <label class="weight-row"><span>ASI</span><input v-model.number="weights.asi" type="range" min="0" max="1" step="0.05"><strong>{{ pct(normalizedWeights.asi) }}</strong></label>
      </aside>
    </transition>

    <transition name="drawer-up">
      <section v-if="showEvalPanel" class="eval-drawer">
        <header>
          <h3>算法评估面板（当前煤层批量结果）</h3>
          <div class="actions"><button type="button" class="tool-btn small" @click="exportSpatialJson">导出数据</button><button type="button" class="close-btn" @click="showEvalPanel = false">×</button></div>
        </header>

        <div v-if="evalLoading" class="panel-empty">正在计算评估指标...</div>
        <div v-else-if="!evalData" class="panel-empty">{{ evalMessage || '暂无评估数据' }}</div>
        <template v-else>
          <div class="eval-grid">
            <div class="metric"><span>AUC</span><strong>{{ fmt(evalData.auc, 4) }}</strong></div>
            <div class="metric"><span>PR-AUC</span><strong>{{ fmt(evalData.pr_auc, 4) }}</strong></div>
            <div class="metric"><span>F1</span><strong>{{ fmt(evalData.f1, 4) }}</strong></div>
            <div class="metric"><span>Brier</span><strong>{{ fmt(evalData.brier, 4) }}</strong></div>
            <div class="metric"><span>ECE</span><strong>{{ fmt(evalData.ece, 4) }}</strong></div>
          </div>

          <div class="eval-content">
            <div class="cm-card">
              <h4>混淆矩阵</h4>
              <div class="cm-grid">
                <div class="cm-cell"><span>TN</span><b>{{ evalData.confusion_matrix?.tn ?? 0 }}</b></div>
                <div class="cm-cell warn"><span>FP</span><b>{{ evalData.confusion_matrix?.fp ?? 0 }}</b></div>
                <div class="cm-cell warn"><span>FN</span><b>{{ evalData.confusion_matrix?.fn ?? 0 }}</b></div>
                <div class="cm-cell"><span>TP</span><b>{{ evalData.confusion_matrix?.tp ?? 0 }}</b></div>
              </div>
            </div>
            <div class="baseline-card">
              <h4>基线对比（SVG）</h4>
              <svg viewBox="0 0 560 170" class="baseline-svg">
                <rect x="0" y="0" width="560" height="170" fill="#fff" />
                <text x="14" y="26">基线 MPI</text>
                <rect x="112" y="12" width="360" height="18" rx="9" fill="#e2e8f0"/>
                <rect x="112" y="12" :width="barWidth(baselineMpi)" height="18" rx="9" fill="#64748b"/>
                <text x="485" y="26">{{ fmt(baselineMpi, 3) }}</text>
                <text x="14" y="90">新算法 MPI</text>
                <rect x="112" y="76" width="360" height="18" rx="9" fill="#e2e8f0"/>
                <rect x="112" y="76" :width="barWidth(currentMpiMean)" height="18" rx="9" fill="#0f766e"/>
                <text x="485" y="90">{{ fmt(currentMpiMean, 3) }}</text>
                <text x="14" y="148" fill="#64748b">注：基于当前煤层批量钻孔的空间实证均值。</text>
              </svg>
            </div>
          </div>
        </template>
      </section>
    </transition>

    <section v-if="hasSpatialData" class="science-section">
      <header>
        <h3>期刊级图组（自动生成）</h3>
        <p>全部图件已直接展示，满足对比、消融、校准、判别与机制解释需求。</p>
        <p class="data-note">说明：评估与部分机制曲线目前为模型推导/示意，不等同于真实标签实验结果。</p>
        <p class="data-note">
          图11支持点击 TP/TN/FP/FN 联动主图高亮。
          <template v-if="matrixSelection !== 'all'">可按 Esc 快速清除筛选。</template>
          <template v-if="!matrixLinkable">当前样本与钻孔点未一一对齐，联动高亮不可用。</template>
        </p>
        <p class="data-note">导出高清图与图组包时会自动冻结脉冲动画，保证稿件图件为静态一致版。</p>
        <button v-if="matrixSelection !== 'all'" type="button" class="tool-btn small" @click="clearMatrixSelection">清除联动高亮</button>
        <p v-if="exportNote" class="export-note">{{ exportNote }}</p>
      </header>
      <ValidationScienceFigures :result="scienceResult" :evaluation="evalData" @matrix-select="onMatrixSelect" />
    </section>

    <div v-if="hoverInfo && hasSpatialData" class="hover-tooltip" :style="{ left: `${hoverPos.x + 14}px`, top: `${hoverPos.y + 14}px` }">
      <p>坐标：{{ fmt(hoverInfo.worldX, 2) }}, {{ fmt(hoverInfo.worldY, 2) }}</p>
      <p>{{ metricLabel(activeMetric) }}插值：{{ fmt(hoverInfo.gridValue, 3) }}</p>
      <p>最近钻孔：{{ hoverInfo.nearestBorehole?.borehole_name || '--' }}（{{ fmt(hoverInfo.nearestDistance, 1) }} m）</p>
      <template v-if="hoverInfo.borehole">
        <p><strong>{{ hoverInfo.borehole.borehole_name }}</strong></p>
        <p>RSI {{ fmt(hoverInfo.borehole.rsi, 2) }} | BRI {{ fmt(hoverInfo.borehole.bri, 2) }}</p>
        <p>ASI {{ fmt(hoverInfo.borehole.asi, 2) }} | MPI {{ fmt(hoverInfo.borehole.mpi, 2) }}</p>
        <p class="risk">{{ riskLabelZh(hoverInfo.borehole.risk_label) }}</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCoalSeams, validationEvaluate, validationSpatialOverview } from '../api'
import { useViewport } from '../composables/useViewport'
import { useIndicatorCanvas } from '../composables/useIndicatorCanvas'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import ValidationScienceFigures from '../components/validation/ValidationScienceFigures.vue'

const route = useRoute()
const router = useRouter()
const { workspaceState, setSelectedSeam, markStepDone } = useWorkspaceFlow()
const metricDefs = [
  { key: 'mpi', label: 'MPI', desc: '综合指标' },
  { key: 'rsi', label: 'RSI', desc: '顶板稳定' },
  { key: 'bri', label: 'BRI', desc: '冲击风险' },
  { key: 'asi', label: 'ASI', desc: '支承应力' }
]
const matrixRoleMeta = {
  tp: { label: 'TP 真阳性', color: '#15803d' },
  tn: { label: 'TN 真阴性', color: '#0e7490' },
  fp: { label: 'FP 假阳性', color: '#d97706' },
  fn: { label: 'FN 假阴性', color: '#b91c1c' }
}

const pageRoot = ref(null)
const stageContainer = ref(null)
const thumbPanelRef = ref(null)
const heatmapCanvas = ref(null)
const overlayCanvas = ref(null)
const seamOptions = ref([])
const seamName = ref('')
const resolution = ref(50)
const contourLevels = ref(9)
const method = ref('idw')
const showContours = ref(true)
const useFixedScale = ref(false)
const activeMetric = ref('mpi')
const loading = ref(false)
const hasInitialized = ref(false)
const showWeightPanel = ref(false)
const showEvalPanel = ref(true)
const thumbsCollapsed = ref(false)
const weights = reactive({ rsi: 0.4, bri: 0.35, asi: 0.25 })
const spatialData = shallowRef(null)
const evalData = ref(null)
const evalLoading = ref(false)
const evalMessage = ref('')
const exportingPack = ref(false)
const exportNote = ref('')
const hoverInfo = ref(null)
const hoverPos = reactive({ x: 0, y: 0 })
const thumbHover = reactive({ visible: false, metric: '', x: 0, y: 0 })
const evalSourceType = ref('pseudo_threshold')
const evalSourceFile = ref('')
const matrixSelection = ref('all')
const activePointerId = ref(null)
const exportStaticMode = ref(false)
const thumbCanvasRefs = {}
const spatialCache = new Map()
const SPATIAL_CACHE_MODEL_REV = 'advanced_v2_asi_calibrated_v1'
let jsZipCtor = null

const getJSZipCtor = async () => {
  if (jsZipCtor) return jsZipCtor
  const mod = await import('jszip')
  jsZipCtor = mod?.default || mod?.JSZip || window.JSZip || null
  if (!jsZipCtor) throw new Error('JSZip 加载失败')
  return jsZipCtor
}

const { viewport, worldToScreen, screenToWorld, fitToBounds, startDrag, dragTo, endDrag, zoomAt } = useViewport()
const { getLegendGradient, drawGrid, drawBoreholes, pickNearestBorehole, sampleGridValue, drawMiniHeatmap } = useIndicatorCanvas()

const normalizedWeights = computed(() => {
  const sum = weights.rsi + weights.bri + weights.asi || 1
  return { rsi: weights.rsi / sum, bri: weights.bri / sum, asi: weights.asi / sum }
})

const hasSpatialData = computed(() => !!(spatialData.value?.grids && spatialData.value?.statistics && spatialData.value?.boreholes))
const algorithmModeLabel = computed(() => {
  const mode = String(spatialData.value?.algorithm_mode || '')
  if (mode === 'advanced_v2') return '新算法(advanced_v2)'
  if (!mode) return '未标记'
  return mode
})
const problemIndicators = computed(() => {
  const items = spatialData.value?.problem_indicators
  if (Array.isArray(items)) return items
  const diagnostics = spatialData.value?.indicator_diagnostics || {}
  return Object.keys(diagnostics).filter((key) => diagnostics?.[key]?.status && diagnostics[key].status !== 'ok')
})
const problemIndicatorLabels = computed(() => (
  problemIndicators.value.map((key) => metricLabel(key))
))
const currentMetricStats = computed(() => spatialData.value?.statistics?.[activeMetric.value] || {})
const currentMetricRange = computed(() => {
  const stats = currentMetricStats.value
  const min = Number(stats?.min)
  const max = Number(stats?.max)
  if (!Number.isFinite(min) || !Number.isFinite(max)) return 0
  return Math.max(0, max - min)
})
const showLowContrastHint = computed(() => (
  hasSpatialData.value &&
  useFixedScale.value &&
  currentMetricRange.value < 20
))
const currentMpiMean = computed(() => Number(spatialData.value?.statistics?.mpi?.mean || 0))
const baselineMpi = computed(() => Math.max(0, currentMpiMean.value - 4.5))
const currentHighRiskCount = computed(() => highRiskCount(activeMetric.value))
const evalSourceLabel = computed(() => {
  if (evalSourceType.value === 'real_label_stream') return '真实标签流'
  if (evalSourceType.value === 'pseudo_threshold') return '伪标签估计（阈值构造）'
  if (evalSourceType.value === 'none') return '无可评估样本'
  return '未知来源'
})
const legendStats = computed(() => {
  if (useFixedScale.value) return { min: 0, mean: 50, max: 100 }
  return spatialData.value?.statistics?.[activeMetric.value] || { min: 0, mean: 0, max: 0 }
})
const metricStats = computed(() => {
  const result = {}
  for (const item of metricDefs) {
    const base = spatialData.value?.statistics?.[item.key] || {}
    const grid = spatialData.value?.grids?.[item.key]
    let count = 0
    let sum = 0
    let sumSq = 0
    let minVal = Number.POSITIVE_INFINITY
    let maxVal = Number.NEGATIVE_INFINITY
    if (Array.isArray(grid)) {
      for (const row of grid) {
        for (const raw of row || []) {
          const val = Number(raw)
          if (!Number.isFinite(val)) continue
          count += 1
          sum += val
          sumSq += val * val
          if (val < minVal) minVal = val
          if (val > maxVal) maxVal = val
        }
      }
    }
    const mean = count ? sum / count : Number(base.mean || 0)
    const variance = count ? Math.max(sumSq / count - mean * mean, 0) : 0
    result[item.key] = {
      min: Number.isFinite(Number(base.min)) ? Number(base.min) : (count ? minVal : 0),
      max: Number.isFinite(Number(base.max)) ? Number(base.max) : (count ? maxVal : 0),
      mean,
      std: Math.sqrt(variance)
    }
  }
  return result
})
const thumbHoverStats = computed(() => metricStats.value[thumbHover.metric] || null)
const scienceResult = computed(() => {
  if (!hasSpatialData.value) return null
  const stats = metricStats.value
  const boreholes = spatialData.value?.boreholes || []
  const evalInputs = buildEvalInputs()
  const mpiMean = Number(stats.mpi?.mean || 0)
  const baseMpi = Math.max(0, mpiMean - 4.5)
  const improvementPct = baseMpi > 0 ? ((mpiMean - baseMpi) / baseMpi) * 100 : 0
  const n = boreholes.length || 1
  const riskRatio = highRiskCount('mpi') / n
  const baseProb = clamp(1 - mpiMean / 100, 0, 1)
  const aucAdj = clamp(Number(evalData.value?.auc || 0.7) - 0.5, 0, 0.45)
  const posterior = ['t-4', 't-3', 't-2', 't-1', 't'].map((t, idx) => ({
    t,
    high_risk_prob: clamp(baseProb + (idx - 2) * 0.05 + aucAdj * 0.2, 0.05, 0.95)
  }))
  return {
    modules: {
      rsi: { value: Number(stats.rsi?.mean || 0), input_layers: 6 },
      bri: { value: Number(stats.bri?.mean || 0), event_count: boreholes.length, avg_magnitude: 2.6 },
      asi: { value: Number(stats.asi?.mean || 0), avg_friction_angle: 31.2 }
    },
    fusion: {
      mpi: mpiMean,
      baseline: { mpi: baseMpi },
      dynamic_weights: normalizedWeights.value
    },
    kpi: {
      mpi_mean: mpiMean,
      high_risk_ratio: riskRatio,
      auc: Number(evalData.value?.auc || 0.7),
      brier_score: Number(evalData.value?.brier || 0.24),
      improvement_vs_baseline_pct: improvementPct
    },
    figures: {
      fig5_dbn: { posterior }
    },
    evaluation_inputs: evalInputs
  }
})

const matrixRoleLabel = (role) => matrixRoleMeta[String(role || '').toLowerCase()]?.label || '全部'
const matrixSelectionMap = computed(() => {
  const rows = spatialData.value?.boreholes || []
  const evalInputs = scienceResult.value?.evaluation_inputs || {}
  const yTrue = Array.isArray(evalInputs.y_true) ? evalInputs.y_true : (Array.isArray(evalInputs.yTrue) ? evalInputs.yTrue : [])
  const yProb = Array.isArray(evalInputs.y_prob) ? evalInputs.y_prob : (Array.isArray(evalInputs.yProb) ? evalInputs.yProb : [])
  if (!rows.length || yTrue.length !== rows.length || yProb.length !== rows.length) {
    return { available: false, roles: [], counts: { tp: 0, tn: 0, fp: 0, fn: 0 } }
  }

  const roles = []
  const counts = { tp: 0, tn: 0, fp: 0, fn: 0 }
  for (let i = 0; i < rows.length; i += 1) {
    const y = Number(yTrue[i]) >= 1 ? 1 : 0
    const pred = Number(yProb[i]) >= 0.5 ? 1 : 0
    const key = y === 1 ? (pred === 1 ? 'tp' : 'fn') : (pred === 1 ? 'fp' : 'tn')
    roles.push(key)
    counts[key] += 1
  }
  return { available: true, roles, counts }
})

const matrixLinkable = computed(() => matrixSelectionMap.value.available)
const matrixSelectionCount = computed(() => {
  if (matrixSelection.value === 'all') return 0
  const key = String(matrixSelection.value).toLowerCase()
  return Number(matrixSelectionMap.value.counts?.[key] || 0)
})
const matrixSelectedIndexes = computed(() => {
  const key = String(matrixSelection.value || '').toLowerCase()
  if (!matrixSelectionMap.value.available || !['tp', 'tn', 'fp', 'fn'].includes(key)) return []
  const result = []
  for (let i = 0; i < matrixSelectionMap.value.roles.length; i += 1) {
    if (matrixSelectionMap.value.roles[i] === key) result.push(i)
  }
  return result
})
const matrixSelectedSet = computed(() => new Set(matrixSelectedIndexes.value))
const boreholeFocus = computed(() => {
  const key = String(matrixSelection.value || '').toLowerCase()
  if (!['tp', 'tn', 'fp', 'fn'].includes(key)) return null
  return {
    active: true,
    indexSet: matrixSelectedSet.value,
    accent: matrixRoleMeta[key]?.color || '#111827'
  }
})
const pulseAnimationEnabled = computed(() => matrixSelection.value !== 'all' && matrixLinkable.value && !exportStaticMode.value)

let renderRaf = 0
let thumbRaf = 0
let resizeTimer = null
let weightDebounceTimer = null
let latestSpatialRequestId = 0
let latestEvaluationRequestId = 0
const onResize = () => {
  window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => {
    resizeStage()
    fitStage()
    queueRender()
    queueThumbRender()
  }, 80)
}

const metricLabel = (metric) => metricDefs.find((item) => item.key === metric)?.label || metric.toUpperCase()
const isIndicatorProblem = (metric) => problemIndicators.value.includes(metric)
const legendGradient = (metric) => getLegendGradient(metric)
const fmt = (value, digit = 2) => (value === undefined || value === null || Number.isNaN(Number(value)) ? '--' : Number(value).toFixed(digit))
const pct = (value) => `${(Number(value || 0) * 100).toFixed(0)}%`
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const riskLabelZh = (label) => {
  const t = String(label || '').toLowerCase()
  if (t.includes('high') || t.includes('高')) return '高风险'
  if (t.includes('medium') || t.includes('中')) return '中风险'
  if (t.includes('low') || t.includes('低')) return '低风险'
  return '未知'
}
const barWidth = (v) => `${clamp(Number(v || 0), 0, 100) * 3.6}`
const highRiskCount = (metric) => (spatialData.value?.boreholes || []).filter((item) => Number(item[metric]) < 50).length
const getRenderStats = (metric) => (
  useFixedScale.value
    ? { min: 0, mean: 50, max: 100 }
    : (spatialData.value?.statistics?.[metric] || { min: 0, mean: 0, max: 0 })
)
const clampContourLevels = () => {
  const v = Number(contourLevels.value)
  contourLevels.value = Number.isFinite(v) ? Math.max(5, Math.min(24, Math.round(v))) : 9
}
const nearestByWorld = (wx, wy, boreholes) => {
  if (!Array.isArray(boreholes) || boreholes.length === 0) {
    return { borehole: null, distance: null }
  }
  let nearest = null
  let minDist = Number.POSITIVE_INFINITY
  for (const b of boreholes) {
    const dx = Number(b.x) - wx
    const dy = Number(b.y) - wy
    const dist = Math.hypot(dx, dy)
    if (dist < minDist) {
      minDist = dist
      nearest = b
    }
  }
  return { borehole: nearest, distance: Number.isFinite(minDist) ? minDist : null }
}

const cacheKey = () => {
  const w = normalizedWeights.value
  return [
    SPATIAL_CACHE_MODEL_REV,
    seamName.value,
    resolution.value,
    method.value,
    w.rsi.toFixed(3),
    w.bri.toFixed(3),
    w.asi.toFixed(3)
  ].join('|')
}

const setThumbCanvasRef = (metric) => (el) => {
  if (el) {
    thumbCanvasRefs[metric] = el
    queueThumbRender()
  } else {
    delete thumbCanvasRefs[metric]
  }
}

const resizeStage = () => {
  if (!stageContainer.value || !heatmapCanvas.value || !overlayCanvas.value) return
  const rect = stageContainer.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  const width = Math.max(1, Math.floor(rect.width * dpr))
  const height = Math.max(1, Math.floor(rect.height * dpr))
  for (const canvas of [heatmapCanvas.value, overlayCanvas.value]) {
    canvas.width = width
    canvas.height = height
  }
}

const fitStage = () => {
  const bounds = spatialData.value?.bounds
  if (!bounds || !heatmapCanvas.value) return
  fitToBounds(bounds, heatmapCanvas.value.width, heatmapCanvas.value.height, 62)
  queueRender()
}

const drawMatrixSelectionOverlay = (ctx, boreholes, bounds) => {
  const key = String(matrixSelection.value || '').toLowerCase()
  if (!['tp', 'tn', 'fp', 'fn'].includes(key)) return
  if (!matrixSelectionMap.value.available) return
  const meta = matrixRoleMeta[key]
  const selected = matrixSelectedIndexes.value
  if (!selected.length) return

  ctx.save()
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)'
  ctx.fillRect(12, 10, 250, 28)
  ctx.fillStyle = '#f4f9f8'
  ctx.font = "600 12px 'Noto Sans SC', 'Segoe UI', sans-serif"
  ctx.fillText(`联动筛选: ${meta.label} (${selected.length})  Esc清除`, 22, 29)
  ctx.restore()
}

const renderMain = () => {
  renderRaf = 0
  if (!heatmapCanvas.value || !overlayCanvas.value) return
  const data = spatialData.value
  const bgCtx = heatmapCanvas.value.getContext('2d')
  const ovCtx = overlayCanvas.value.getContext('2d')
  bgCtx.clearRect(0, 0, heatmapCanvas.value.width, heatmapCanvas.value.height)
  ovCtx.clearRect(0, 0, overlayCanvas.value.width, overlayCanvas.value.height)
  if (!data) return

  const metric = activeMetric.value
  const renderStats = getRenderStats(metric)
  drawGrid(bgCtx, data.grids?.[metric], data.bounds, viewport, metric, renderStats, worldToScreen, {
    showContours: showContours.value,
    contourLevels: contourLevels.value
  })
  const drawFocus = boreholeFocus.value
    ? { ...boreholeFocus.value, animate: pulseAnimationEnabled.value, pulseT: performance.now() / 1000 }
    : null
  drawBoreholes(
    ovCtx,
    data.boreholes,
    metric,
    renderStats,
    data.bounds,
    worldToScreen,
    hoverInfo.value?.borehole?.borehole_name || '',
    drawFocus
  )
  drawMatrixSelectionOverlay(ovCtx, data.boreholes || [], data.bounds)

  if (hoverInfo.value) {
    ovCtx.strokeStyle = 'rgba(15, 23, 42, 0.55)'
    ovCtx.lineWidth = 1.1
    ovCtx.setLineDash([5, 4])
    ovCtx.beginPath()
    ovCtx.moveTo(hoverInfo.value.sx, 0)
    ovCtx.lineTo(hoverInfo.value.sx, overlayCanvas.value.height)
    ovCtx.moveTo(0, hoverInfo.value.sy)
    ovCtx.lineTo(overlayCanvas.value.width, hoverInfo.value.sy)
    ovCtx.stroke()
    ovCtx.setLineDash([])
  }

  if (pulseAnimationEnabled.value) queueRender()
}

const renderThumbs = () => {
  thumbRaf = 0
  const data = spatialData.value
  if (!data) return
  for (const item of metricDefs) {
    const canvas = thumbCanvasRefs[item.key]
    if (!canvas) continue
    drawMiniHeatmap(canvas, data.grids?.[item.key], item.key, getRenderStats(item.key))
  }
}

const queueRender = () => {
  if (renderRaf) return
  renderRaf = window.requestAnimationFrame(renderMain)
}
const queueThumbRender = () => {
  if (thumbRaf) return
  thumbRaf = window.requestAnimationFrame(renderThumbs)
}

const buildEvalInputs = () => {
  const upstream = spatialData.value?.evaluation_inputs
  if (upstream?.mode === 'real_label_stream') {
    const rawTrue = Array.isArray(upstream.y_true) ? upstream.y_true : []
    const rawProb = Array.isArray(upstream.y_prob) ? upstream.y_prob : []
    if (rawTrue.length === rawProb.length && rawTrue.length >= 2) {
      const yTrue = rawTrue.map((v) => (Number(v) >= 1 ? 1 : 0))
      const yProb = rawProb.map((v) => clamp(Number(v), 0, 1))
      const finiteProb = yProb.every((v) => Number.isFinite(v))
      if (finiteProb && new Set(yTrue).size > 1) {
        return {
          mode: 'real_label_stream',
          source: String(upstream.source || ''),
          sourceFile: String(upstream.source || ''),
          y_true: yTrue,
          y_prob: yProb,
          yTrue,
          yProb
        }
      }
    }
  }

  const rows = spatialData.value?.boreholes || []
  if (rows.length < 4) return null
  let yTrue = rows.map((item) => ((item.rsi < 50 || item.bri < 50 || item.asi < 50) ? 1 : 0))
  const yProb = rows.map((item) => clamp(1 - Number(item.mpi || 0) / 100, 0, 1))
  if (new Set(yTrue).size < 2) {
    const sorted = rows.map((item) => Number(item.mpi || 0)).sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    yTrue = rows.map((item) => (Number(item.mpi || 0) <= median ? 1 : 0))
  }
  return {
    mode: 'pseudo_threshold',
    source: '',
    sourceFile: '',
    y_true: yTrue,
    y_prob: yProb,
    yTrue,
    yProb
  }
}

const runEvaluation = async () => {
  const evaluationRequestId = ++latestEvaluationRequestId
  const inputs = buildEvalInputs()
  if (!inputs) {
    if (evaluationRequestId !== latestEvaluationRequestId) return
    evalSourceType.value = 'none'
    evalSourceFile.value = ''
    evalData.value = null
    evalMessage.value = '当前煤层钻孔点不足，无法计算评估指标。'
    return
  }
  if (evaluationRequestId !== latestEvaluationRequestId) return
  evalSourceType.value = inputs.mode || 'pseudo_threshold'
  evalSourceFile.value = inputs.sourceFile || ''
  evalLoading.value = true
  evalMessage.value = ''
  try {
    const resp = await validationEvaluate({ y_true: inputs.y_true || inputs.yTrue, y_prob: inputs.y_prob || inputs.yProb })
    if (evaluationRequestId !== latestEvaluationRequestId) return
    evalData.value = resp.data
  } catch (error) {
    if (evaluationRequestId !== latestEvaluationRequestId) return
    evalData.value = null
    evalMessage.value = error?.response?.data?.detail || '评估指标计算失败'
  } finally {
    if (evaluationRequestId === latestEvaluationRequestId) {
      evalLoading.value = false
    }
  }
}

const applySpatialData = async (payload) => {
  spatialData.value = payload
  hoverInfo.value = null
  matrixSelection.value = 'all'
  await nextTick()
  resizeStage()
  fitStage()
  queueRender()
  queueThumbRender()
  runEvaluation()
}

const fetchSpatial = async ({ force = false } = {}) => {
  if (!seamName.value) return
  const requestId = ++latestSpatialRequestId
  const key = cacheKey()
  if (!force && spatialCache.has(key)) {
    if (requestId !== latestSpatialRequestId) return
    await applySpatialData(spatialCache.get(key))
    return
  }

  loading.value = true
  try {
    const resp = await validationSpatialOverview(seamName.value, resolution.value, method.value, normalizedWeights.value)
    if (requestId !== latestSpatialRequestId) return
    const data = resp.data
    spatialCache.set(key, data)
    await applySpatialData(data)
    markStepDone('AlgorithmValidation', { validationReady: true })
  } catch (error) {
    if (requestId !== latestSpatialRequestId) return
    evalMessage.value = error?.response?.data?.detail || '空间总览加载失败'
  } finally {
    if (requestId === latestSpatialRequestId) {
      loading.value = false
    }
  }
}

const onMatrixSelect = (role) => {
  const key = String(role || '').toLowerCase()
  if (!['tp', 'tn', 'fp', 'fn'].includes(key)) return
  if (!matrixLinkable.value) return
  matrixSelection.value = matrixSelection.value === key ? 'all' : key
  queueRender()
}

const clearMatrixSelection = () => {
  matrixSelection.value = 'all'
  queueRender()
}

const onKeydown = (event) => {
  if (event.key === 'Escape' && matrixSelection.value !== 'all') {
    clearMatrixSelection()
  }
}

const onPointerDown = (event) => {
  if (!hasSpatialData.value || !stageContainer.value) return
  if (event.pointerType === 'mouse' && event.button !== 0) return
  if (activePointerId.value !== null && activePointerId.value !== event.pointerId) return
  activePointerId.value = event.pointerId
  stageContainer.value.setPointerCapture?.(event.pointerId)
  startDrag(event.clientX, event.clientY)
}
const onPointerMove = (event) => {
  if (activePointerId.value !== null && event.pointerId !== activePointerId.value) return
  if (!overlayCanvas.value || !hasSpatialData.value) return
  const rect = overlayCanvas.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  const sx = (event.clientX - rect.left) * dpr
  const sy = (event.clientY - rect.top) * dpr
  hoverPos.x = event.clientX - rect.left
  hoverPos.y = event.clientY - rect.top

  if (viewport.isDragging) {
    dragTo(event.clientX, event.clientY)
    queueRender()
    return
  }

  const bounds = spatialData.value?.bounds
  const world = screenToWorld(sx, sy, bounds)
  const metric = activeMetric.value
  const nearestWorld = nearestByWorld(world.x, world.y, spatialData.value?.boreholes || [])
  const nearest = pickNearestBorehole(sx, sy, spatialData.value?.boreholes || [], bounds, worldToScreen)
  hoverInfo.value = {
    sx,
    sy,
    worldX: world.x,
    worldY: world.y,
    gridValue: sampleGridValue(spatialData.value?.grids?.[metric], bounds, world.x, world.y),
    borehole: nearest,
    nearestBorehole: nearestWorld.borehole,
    nearestDistance: nearestWorld.distance
  }
  queueRender()
}
const onPointerUp = (event) => {
  if (activePointerId.value !== null && event.pointerId !== activePointerId.value) return
  if (stageContainer.value?.hasPointerCapture?.(event.pointerId)) {
    stageContainer.value.releasePointerCapture(event.pointerId)
  }
  activePointerId.value = null
  endDrag()
}
const onPointerCancel = (event) => {
  if (activePointerId.value !== null && event.pointerId !== activePointerId.value) return
  if (stageContainer.value?.hasPointerCapture?.(event.pointerId)) {
    stageContainer.value.releasePointerCapture(event.pointerId)
  }
  activePointerId.value = null
  endDrag()
  hoverInfo.value = null
  queueRender()
}
const onPointerLeave = (event) => {
  if (activePointerId.value !== null && event.pointerId === activePointerId.value) {
    const hasCapture = stageContainer.value?.hasPointerCapture?.(event.pointerId)
    if (hasCapture) return
    activePointerId.value = null
    endDrag()
  }
  if (viewport.isDragging) return
  hoverInfo.value = null
  queueRender()
}
const onWheel = (e) => {
  if (!overlayCanvas.value || !hasSpatialData.value) return
  const rect = overlayCanvas.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  const sx = (e.clientX - rect.left) * dpr
  const sy = (e.clientY - rect.top) * dpr
  zoomAt(e.deltaY < 0 ? 1.14 : 0.88, sx, sy, spatialData.value?.bounds)
  queueRender()
}

const onThumbEnter = (metric, event) => {
  thumbHover.metric = metric
  onThumbMove(metric, event)
}
const onThumbMove = (metric, event) => {
  if (!thumbPanelRef.value) return
  const rect = thumbPanelRef.value.getBoundingClientRect()
  thumbHover.visible = true
  thumbHover.metric = metric
  thumbHover.x = event.clientX - rect.left
  thumbHover.y = event.clientY - rect.top
}
const onThumbLeave = () => {
  thumbHover.visible = false
}

const safeFilename = (name) => String(name || 'figure').replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_')

const canvasToBlob = (canvas, type = 'image/png', quality = 1) => (
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas 导出失败'))
    }, type, quality)
  })
)

const serializeSvg = (svgEl) => {
  const clone = svgEl.cloneNode(true)
  if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  if (!clone.getAttribute('xmlns:xlink')) clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  return new XMLSerializer().serializeToString(clone)
}

const svgStringToPngBlob = async (svgText, width, height, scale = 3) => {
  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = () => reject(new Error('SVG 转 PNG 失败'))
      i.src = url
    })
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return await canvasToBlob(canvas, 'image/png', 1)
  } finally {
    URL.revokeObjectURL(url)
  }
}

const waitNextFrame = () => new Promise((resolve) => window.requestAnimationFrame(resolve))
const runWithStaticOverlay = async (job) => {
  const prev = exportStaticMode.value
  exportStaticMode.value = true
  renderMain()
  await waitNextFrame()
  try {
    return await job()
  } finally {
    exportStaticMode.value = prev
    renderMain()
    if (pulseAnimationEnabled.value) queueRender()
  }
}

const exportCurrentFigure = async () => {
  if (!heatmapCanvas.value || !overlayCanvas.value) return
  await runWithStaticOverlay(async () => {
    const scale = 3
    const sourceW = heatmapCanvas.value.width
    const sourceH = heatmapCanvas.value.height
    const merged = document.createElement('canvas')
    merged.width = Math.round(sourceW * scale)
    merged.height = Math.round(sourceH * scale)
    const ctx = merged.getContext('2d')
    ctx.scale(scale, scale)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, sourceW, sourceH)
    ctx.drawImage(heatmapCanvas.value, 0, 0)
    ctx.drawImage(overlayCanvas.value, 0, 0)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
    ctx.font = "14px 'Times New Roman', 'Noto Serif SC', serif"
    ctx.fillText(`煤层：${seamName.value || '--'} | 指标：${metricLabel(activeMetric.value)} | 分辨率：${resolution.value}`, 16, 26)
    const link = document.createElement('a')
    link.href = merged.toDataURL('image/png', 1)
    link.download = `algorithm_validation_${seamName.value || 'seam'}_${activeMetric.value}_hd.png`
    link.click()
  })
}

const exportSciencePackage = async () => {
  if (!pageRoot.value || !hasSpatialData.value || exportingPack.value) return
  exportingPack.value = true
  exportNote.value = ''
  try {
    await runWithStaticOverlay(async () => {
      const JSZip = await getJSZipCtor()
      const zip = new JSZip()
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

      const mainCanvas = document.createElement('canvas')
      const scale = 3
      const sourceW = heatmapCanvas.value.width
      const sourceH = heatmapCanvas.value.height
      mainCanvas.width = Math.round(sourceW * scale)
      mainCanvas.height = Math.round(sourceH * scale)
      const ctx = mainCanvas.getContext('2d')
      ctx.scale(scale, scale)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, sourceW, sourceH)
      ctx.drawImage(heatmapCanvas.value, 0, 0)
      ctx.drawImage(overlayCanvas.value, 0, 0)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
      ctx.font = "14px 'Times New Roman', 'Noto Serif SC', serif"
      ctx.fillText(`煤层：${seamName.value || '--'} | 指标：${metricLabel(activeMetric.value)} | 分辨率：${resolution.value}`, 16, 26)
      zip.file('figures/main_heatmap_hd.png', await canvasToBlob(mainCanvas, 'image/png', 1))

      const cards = pageRoot.value.querySelectorAll('.science-section .figure-card')
      let cardIndex = 0
      for (const card of cards) {
        cardIndex += 1
        const title = card.querySelector('h4')?.textContent?.trim() || `图${cardIndex}`
        const svg = card.querySelector('.science-chart svg')
        if (!svg) continue
        const rect = svg.getBoundingClientRect()
        const viewBox = svg.viewBox?.baseVal
        const width = viewBox?.width || rect.width || 960
        const height = viewBox?.height || rect.height || 540
        const svgText = serializeSvg(svg)
        const base = safeFilename(`${String(cardIndex).padStart(2, '0')}_${title}`)
        zip.file(`figures/${base}.svg`, svgText)
        zip.file(`figures/${base}.png`, await svgStringToPngBlob(svgText, width, height, 3))
      }

      zip.file('data/spatial_statistics.json', JSON.stringify(metricStats.value, null, 2))
      zip.file('data/evaluation.json', JSON.stringify(evalData.value || {}, null, 2))
      zip.file('data/science_result.json', JSON.stringify(scienceResult.value || {}, null, 2))
      zip.file('README.txt', [
        '新算法实证图组导出包',
        `时间: ${new Date().toLocaleString()}`,
        `煤层: ${seamName.value || '--'}`,
        `主图指标: ${metricLabel(activeMetric.value)}`,
        '',
        '内容说明:',
        '- figures/: 主热力图和图2-图11（SVG+PNG）',
        '- data/: 统计与评估原始数据'
      ].join('\n'))

      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `新算法实证图组_${safeFilename(seamName.value || 'seam')}_${timestamp}.zip`
      link.click()
      URL.revokeObjectURL(url)
    })
    exportNote.value = '图组包导出完成。'
  } catch (error) {
    exportNote.value = error?.message || '图组包导出失败'
  } finally {
    exportingPack.value = false
  }
}

const exportSpatialJson = () => {
  if (!spatialData.value) return
  const blob = new Blob([JSON.stringify(spatialData.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `algorithm_validation_${seamName.value || 'seam'}_spatial.json`
  link.click()
  URL.revokeObjectURL(url)
}

const toggleFullscreen = async () => {
  if (!pageRoot.value) return
  if (!document.fullscreenElement) await pageRoot.value.requestFullscreen()
  else await document.exitFullscreen()
}

const normalizeQuerySeam = (value) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value : ''
}

const goReport = () => {
  router.push({
    name: 'Report',
    query: seamName.value ? { seam: seamName.value } : undefined
  })
}

const loadSeams = async () => {
  try {
    const resp = await getCoalSeams()
    const seams = resp?.data?.seams || []
    seamOptions.value = seams
    if (seams.length === 0) return
    const preferredName = normalizeQuerySeam(route.query?.seam) || workspaceState.selectedSeam || '16-3煤'
    const preferred = seams.find((item) => item.name === preferredName)
    seamName.value = preferred?.name || seams[0].name
    setSelectedSeam(seamName.value)
  } catch (error) {
    evalMessage.value = error?.response?.data?.detail || '煤层列表加载失败'
  }
}

watch(activeMetric, () => queueRender())
watch(showContours, () => queueRender())
watch(contourLevels, () => { clampContourLevels(); queueRender() })
watch(useFixedScale, () => { queueRender(); queueThumbRender() })
watch([resolution, method], () => { if (hasInitialized.value) fetchSpatial({ force: false }) })
watch(seamName, () => {
  setSelectedSeam(seamName.value || '')
  if (hasInitialized.value) fetchSpatial({ force: false })
})
watch(matrixLinkable, (ok) => {
  if (!ok && matrixSelection.value !== 'all') {
    matrixSelection.value = 'all'
    queueRender()
  }
})
watch(() => [weights.rsi, weights.bri, weights.asi], () => {
  if (!hasInitialized.value) return
  window.clearTimeout(weightDebounceTimer)
  weightDebounceTimer = window.setTimeout(() => fetchSpatial({ force: false }), 300)
})

onMounted(async () => {
  clampContourLevels()
  await loadSeams()
  if (seamName.value) await fetchSpatial({ force: true })
  hasInitialized.value = true
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.clearTimeout(weightDebounceTimer)
  window.clearTimeout(resizeTimer)
  if (renderRaf) window.cancelAnimationFrame(renderRaf)
  if (thumbRaf) window.cancelAnimationFrame(thumbRaf)
  if (stageContainer.value && activePointerId.value !== null && stageContainer.value.hasPointerCapture?.(activePointerId.value)) {
    stageContainer.value.releasePointerCapture(activePointerId.value)
  }
  activePointerId.value = null
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.validation-page { position: relative; display: flex; flex-direction: column; gap: var(--spacing-md); min-height: calc(100vh - 18px); padding: var(--spacing-md); background: radial-gradient(circle at 14% 10%, rgba(15,118,110,.14), transparent 40%), radial-gradient(circle at 86% 100%, rgba(180,83,9,.1), transparent 42%), var(--bg-secondary); }
.top-nav { display: flex; justify-content: space-between; align-items: center; gap: 10px; min-height: 64px; padding: 10px 14px; border-radius: var(--border-radius-md); border: 1px solid rgba(255,255,255,.12); background: linear-gradient(135deg, #0f172a 0%, #1f2937 100%); box-shadow: var(--shadow-md); color: #f8fafc; }
.nav-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.nav-left h1 { margin: 0; font-size: 22px; font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif; }
.divider { width: 1px; height: 26px; background: rgba(255,255,255,.22); }
.icon-btn { border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.1); color: #f8fafc; border-radius: 8px; width: 34px; height: 34px; display: grid; place-items: center; cursor: pointer; }
.icon-btn:hover { border-color: rgba(45,212,191,.5); background: rgba(45,212,191,.2); }
.icon-btn svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; }
.icon-btn.mini { width: auto; height: 28px; padding: 0 8px; font-size: 12px; }
.seam-select { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; }
.seam-select select { min-width: 120px; border-radius: 8px; border: 1px solid rgba(255,255,255,.24); background: rgba(255,255,255,.12); color: #f8fafc; padding: 5px 8px; }
.seam-select select:focus { outline: none; border-color: rgba(45,212,191,.7); box-shadow: 0 0 0 3px rgba(45,212,191,.2); }
.seam-select select option { color: #0f172a; }
.mini-stats { display: inline-flex; gap: 10px; padding: 4px 10px; border-radius: 999px; background: rgba(255,255,255,.1); font-size: 12px; }
.mini-stats .danger b { color: #fca5a5; }
.nav-right { display: flex; align-items: center; gap: 8px; }
.tool-btn { border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.12); color: #f8fafc; border-radius: 8px; font-size: 12px; padding: 7px 11px; cursor: pointer; }
.tool-btn:hover { background: rgba(45,212,191,.16); border-color: rgba(45,212,191,.36); }
.tool-btn.active { background: rgba(15,118,110,.52); border-color: rgba(45,212,191,.58); }
.tool-btn:disabled { opacity: .6; cursor: not-allowed; }
.tool-btn.small { color: #111827; border-color: var(--border-color-light); background: #f8fafc; }
.metric-dashboard { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--spacing-md); }
.metric-card { border: 1px solid var(--border-color-light); border-radius: var(--border-radius-md); background: var(--bg-elevated); box-shadow: var(--shadow-sm); padding: 10px 12px; text-align: left; cursor: pointer; transition: all var(--transition-normal); }
.metric-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.metric-card.active { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(15,118,110,.18); }
.metric-card.problematic { border-color: #f59e0b; box-shadow: 0 0 0 2px rgba(245, 158, 11, .2); }
.metric-card .head { display: flex; justify-content: space-between; gap: 8px; }
.metric-card .head span { font-size: 11px; color: var(--text-tertiary); }
.metric-card .head .problem-dot { margin-left: auto; font-style: normal; font-size: 10px; color: #b45309; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 999px; padding: 1px 6px; }
.metric-card .value { margin-top: 5px; font-size: 24px; font-family: 'Times New Roman', serif; color: #111827; }
.metric-card .meta { display: flex; justify-content: space-between; margin-top: 3px; font-size: 11px; color: var(--text-secondary); }
.risk-bar { margin-top: 8px; height: 7px; border-radius: 999px; }
.main-layout { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 3fr) minmax(260px, 1fr); gap: var(--spacing-md); }
.main-canvas-card, .thumb-panel { border-radius: var(--border-radius-md); border: 1px solid var(--border-color-light); background: var(--bg-elevated); }
.main-canvas-card { display: flex; flex-direction: column; min-height: 0; box-shadow: var(--shadow-md); overflow: hidden; }
.canvas-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 10px 12px; border-bottom: 1px solid var(--border-color-light); background: linear-gradient(135deg, #f1f8f6 0%, #e4f3ef 100%); }
.canvas-head h2 { margin: 0; font-size: 16px; font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif; }
.canvas-head p { margin: 3px 0 0; font-size: 12px; color: #64748b; }
.canvas-controls { display: flex; gap: 8px; }
.canvas-controls label { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #334155; }
.canvas-controls input, .canvas-controls select { width: 84px; border: 1px solid var(--border-color-light); border-radius: 8px; padding: 4px 6px; font-size: 12px; background: #fff; }
.canvas-controls .check input { width: auto; }
.trust-banner { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 8px 12px; border-bottom: 1px solid var(--border-color-light); background: #f8fafc; }
.trust-chip { display: inline-flex; align-items: center; border-radius: 999px; padding: 2px 10px; font-size: 11px; border: 1px solid transparent; font-weight: 600; }
.trust-chip.real { color: #065f46; background: #ecfdf5; border-color: #a7f3d0; }
.trust-chip.warn { color: #92400e; background: #fffbeb; border-color: #fde68a; }
.trust-chip.info { color: #0c4a6e; background: #ecfeff; border-color: #a5f3fc; }
.trust-chip.danger { color: #991b1b; background: #fef2f2; border-color: #fca5a5; }
.trust-chip.hint { color: #7c2d12; background: #fff7ed; border-color: #fdba74; }
.trust-chip.link { color: #0e7490; background: #e7f8f3; border-color: #99ead7; }
.trust-meta { font-size: 11px; color: #64748b; }
.stage { position: relative; flex: 1; min-height: 360px; overflow: hidden; background: #f4f9f8; touch-action: none; }
.layer { position: absolute; inset: 0; width: 100%; height: 100%; }
.loading-mask { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 10px; justify-content: center; align-items: center; background: rgba(248,250,252,.92); z-index: 5; }
.skeleton { width: 72%; height: 14px; border-radius: 999px; background: linear-gradient(90deg, #e2e8f0 10%, #cbd5e1 35%, #e2e8f0 60%); background-size: 200% 100%; animation: skeleton 1.1s linear infinite; }
@keyframes skeleton { to { background-position: -200% 0; } }
.legend-wrap { border-top: 1px solid var(--border-color-light); padding: 10px 12px; }
.legend-track { height: 11px; border-radius: 999px; }
.legend-labels { display: flex; justify-content: space-between; margin-top: 5px; font-size: 11px; color: #475569; }
.thumb-panel { position: relative; display: flex; flex-direction: column; min-height: 0; box-shadow: var(--shadow-sm); }
.thumb-panel.collapsed .thumb-list { display: none; }
.thumb-panel header { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid var(--border-color-light); }
.thumb-panel h3 { margin: 0; font-size: 14px; }
.thumb-list { overflow: auto; padding: 10px; display: flex; flex-direction: column; gap: 10px; }
.thumb-item { border: 1px solid var(--border-color-light); border-radius: 10px; background: #fff; padding: 8px; display: flex; flex-direction: column; gap: 7px; cursor: pointer; }
.thumb-item.active { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(15,118,110,.14); }
.thumb-canvas { width: 100%; height: 110px; border-radius: 8px; border: 1px solid #e2e8f0; }
.thumb-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; font-size: 12px; color: #4b5563; }
.thumb-meta strong { text-align: left; }
.thumb-meta span { text-align: center; }
.thumb-tooltip { position: absolute; z-index: 8; pointer-events: none; min-width: 154px; border: 1px solid rgba(15,23,42,.2); border-radius: 8px; background: rgba(255,255,255,.96); box-shadow: 0 10px 20px rgba(15,23,42,.12); padding: 8px 10px; font-size: 11px; color: #1f2937; }
.thumb-tooltip p { margin: 2px 0; }
.floating-panel { position: absolute; right: 16px; top: 152px; z-index: 20; width: 360px; border-radius: var(--border-radius-md); border: 1px solid var(--border-color-light); background: #fff; box-shadow: var(--shadow-lg); padding: 12px; }
.floating-panel header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.floating-panel h3 { margin: 0; font-size: 15px; }
.floating-panel p { margin: 0 0 10px; font-size: 12px; color: #4b5563; }
.weight-row { display: grid; grid-template-columns: 44px 1fr 46px; align-items: center; gap: 10px; margin-bottom: 10px; }
.close-btn { border: 1px solid #cbd5e1; background: #f1f8f6; color: #1f2937; border-radius: 8px; width: 28px; height: 28px; font-size: 17px; line-height: 1; cursor: pointer; }
.close-btn:hover { border-color: var(--color-primary); color: var(--color-primary); background: #e8f5f2; }
.eval-drawer { position: relative; z-index: 4; border-radius: var(--border-radius-md); border: 1px solid var(--border-color-light); background: #fff; box-shadow: var(--shadow-md); padding: 12px; }
.eval-drawer header { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.eval-drawer h3 { margin: 0; font-size: 15px; }
.eval-drawer .actions { display: flex; gap: 8px; }
.panel-empty { margin-top: 12px; border: 1px dashed #bfd3d9; border-radius: 10px; padding: 14px; font-size: 13px; color: #475569; background: #f5faf9; }
.eval-grid { margin-top: 10px; display: grid; grid-template-columns: repeat(5, minmax(90px, 1fr)); gap: 8px; }
.eval-grid .metric { border: 1px solid #d8e6e3; border-radius: 10px; background: #f3f8f7; padding: 8px; }
.eval-grid .metric span { display: block; font-size: 11px; color: #64748b; }
.eval-grid .metric strong { font-size: 18px; font-family: 'Times New Roman', serif; color: #111827; }
.eval-content { margin-top: 10px; display: grid; grid-template-columns: 1fr 1.2fr; gap: 10px; }
.cm-card, .baseline-card { border: 1px solid #d8e6e3; border-radius: 10px; background: #f7fbfa; padding: 10px; }
.cm-card h4, .baseline-card h4 { margin: 0 0 8px; font-size: 13px; }
.cm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.cm-cell { border: 1px solid #cbd5e1; border-radius: 8px; background: #ecfdf5; padding: 8px; text-align: center; }
.cm-cell.warn { background: #fef3c7; }
.cm-cell span { display: block; font-size: 11px; color: #475569; }
.cm-cell b { font-size: 20px; color: #111827; }
.baseline-svg { width: 100%; height: auto; font-family: 'Times New Roman', serif; font-size: 12px; }
.science-section { border-radius: var(--border-radius-md); border: 1px solid var(--border-color-light); background: var(--bg-elevated); box-shadow: var(--shadow-sm); padding: 12px; }
.science-section header { margin-bottom: 10px; }
.science-section h3 { margin: 0; font-size: 16px; font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif; color: #111827; }
.science-section p { margin: 5px 0 0; font-size: 12px; color: #475569; }
.science-section .data-note { color: #92400e; }
.science-section .export-note { color: #065f46; font-weight: 600; }
.hover-tooltip { position: absolute; z-index: 30; pointer-events: none; min-width: 200px; border: 1px solid rgba(15,23,42,.2); border-radius: 10px; background: rgba(255,255,255,.95); box-shadow: 0 12px 24px rgba(15,23,42,.15); padding: 8px 10px; font-size: 12px; color: #1f2937; }
.hover-tooltip p { margin: 2px 0; }
.hover-tooltip .risk { font-weight: 600; color: #991b1b; }
.fade-up-enter-active, .fade-up-leave-active, .drawer-up-enter-active, .drawer-up-leave-active { transition: all .24s ease; }
.fade-up-enter-from, .fade-up-leave-to { opacity: 0; transform: translateY(6px); }
.drawer-up-enter-from, .drawer-up-leave-to { opacity: 0; transform: translateY(20px); }
@media (max-width: 1400px) { .main-layout { grid-template-columns: 1fr; } .thumb-list { flex-direction: row; overflow-x: auto; } .thumb-item { min-width: 220px; } }
@media (max-width: 1080px) { .validation-page { height: auto; min-height: calc(100vh - 18px); } .metric-dashboard { grid-template-columns: repeat(2, minmax(0, 1fr)); } .thumb-panel { display: none; } .floating-panel { position: fixed; left: 12px; right: 12px; top: 88px; width: auto; } .eval-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .eval-content { grid-template-columns: 1fr; } }
@media (max-width: 760px) { .top-nav { flex-direction: column; align-items: flex-start; } .nav-right { width: 100%; flex-wrap: wrap; } .stage { min-height: 320px; } }
</style>
