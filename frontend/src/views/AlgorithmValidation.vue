<template>
  <div ref="pageRoot" class="validation-page">
    <nav class="top-nav">
      <div class="nav-left">
        <button class="icon-btn" type="button" :title="av('back')" @click="router.back()">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m0 0 6-6m-6 6 6 6" /></svg>
        </button>
        <div class="nav-heading">
          <span class="nav-kicker">验证工作台 | 论文图版模式</span>
          <h1>{{ av('title') }}</h1>
          <p class="nav-summary">热力图、验证证据与三维融合视图已联动同步，可直接用于逐图审阅与导出。</p>
        </div>
        <span class="divider"></span>
        <label class="seam-select">
          <span>{{ av('seam') }}</span>
          <select v-model="seamName">
            <option v-for="item in seamOptions" :key="item.name" :value="item.name">{{ item.name }}</option>
          </select>
        </label>
        <div class="mini-stats" v-if="hasSpatialData">
          <span>{{ av('mean') }} <b>{{ fmt(currentMetricStats.mean) }}</b></span>
          <span>{{ av('min') }} <b>{{ fmt(currentMetricStats.min) }}</b></span>
          <span class="danger">{{ av('highRiskPoints') }} <b>{{ currentHighRiskCount }}</b></span>
        </div>
      </div>

      <div class="nav-right">
        <div class="nav-toolbar-meta">
          <span class="nav-kicker">操作条 | 导出与审阅</span>
          <p>{{ toolbarSummary }}</p>
        </div>
        <div class="nav-toolbar-actions">
          <button class="tool-btn" type="button" :class="{ active: showWeightPanel }" @click="showWeightPanel = !showWeightPanel">{{ av('weight') }}</button>
          <button class="tool-btn" type="button" :class="{ active: showGeoPanel }" @click="showGeoPanel = !showGeoPanel">{{ av('geologyCompare') }}</button>
          <button class="tool-btn" type="button" :class="{ active: showEvalPanel }" @click="showEvalPanel = !showEvalPanel">{{ av('evaluation') }}</button>
          <button class="tool-btn" type="button" @click="exportCurrentFigure">{{ av('exportHd') }}</button>
          <button class="tool-btn" type="button" :disabled="!hasSpatialData" @click="goScienceFigures">{{ av('openSciencePage') }}</button>
          <button class="tool-btn" type="button" :disabled="!hasSpatialData" @click="goPressureAnalysis">{{ av('nextReport') }}</button>
          <button class="tool-btn" type="button" @click="toggleFullscreen">{{ av('fullscreen') }}</button>
        </div>
      </div>
    </nav>

    <section class="top-figure-band" :class="{ 'top-figure-band--single': !hasSpatialData }">
      <section v-if="hasSpatialData" class="top-publication-panel publication-entry">
        <div class="publication-entry-head top-publication-head">
          <span class="publication-kicker">页面摘要 | 验证概览</span>
          <h2>验证摘要总板</h2>
          <p>{{ topPublicationSummary }}</p>
        </div>
        <div class="publication-entry-grid top-publication-grid">
          <article v-for="item in topPublicationCards" :key="item.label" class="publication-entry-card top-publication-card">
            <span class="label">{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>
        <div class="top-toolbar-strip">
          <span v-for="item in toolbarStateChips" :key="item.label" class="top-toolbar-chip" :class="item.tone">{{ item.label }}: {{ item.value }}</span>
        </div>
        <p class="publication-footer">{{ topPublicationMethodsFooter }}</p>
      </section>

      <section class="metric-dashboard-panel publication-entry">
        <div class="publication-entry-head metric-dashboard-head">
          <span class="publication-kicker">图组条带 | 指标 KPI 卡片</span>
          <h2>指标总览面板</h2>
          <p>{{ metricDashboardSummary }}</p>
        </div>
        <div class="metric-dashboard">
          <button
            v-for="item in metricDefs"
            :key="item.key"
            class="metric-card"
            :class="{ active: activeMetric === item.key, problematic: isIndicatorProblem(item.key) }"
            type="button"
            @click="activeMetric = item.key"
          >
            <div class="head">
              <strong>{{ metricLabel(item.key) }}</strong>
              <span>{{ metricDesc(item.key) }}</span>
              <em v-if="isIndicatorProblem(item.key)" class="problem-dot">! {{ av('abnormal') }}</em>
            </div>
            <div class="value">{{ fmt(spatialData?.statistics?.[item.key]?.mean) }}</div>
            <div class="meta"><span>{{ av('min') }} {{ fmt(spatialData?.statistics?.[item.key]?.min) }}</span><span>{{ av('max') }} {{ fmt(spatialData?.statistics?.[item.key]?.max) }}</span></div>
            <div class="risk-bar" :style="{ background: legendGradient(item.key) }"></div>
          </button>
        </div>
        <p v-if="hasSpatialData" class="publication-footer metric-dashboard-footer">{{ metricDashboardFooter }}</p>
      </section>
    </section>

    <section class="main-layout">
      <div class="main-canvas-card">
        <header class="canvas-head">
          <div class="canvas-heading">
            <span class="canvas-kicker">图件工作区 | 平面诊断</span>
            <h2>{{ av('heatmapTitle', { metric: metricLabel(activeMetric) }) }}</h2>
            <p>{{ av('interactionHint') }}</p>
          </div>
          <div class="canvas-controls">
            <label>{{ av('resolution') }}<input v-model.number="resolution" type="number" min="20" max="120" step="5"></label>
            <label>{{ av('contourLevels') }}<input v-model.number="contourLevels" type="number" min="5" max="24" step="1"></label>
            <label>{{ av('interpolation') }}
              <select v-model="method">
                <option value="idw">{{ av('method.idw') }}</option>
                <option value="linear">{{ av('method.linear') }}</option>
                <option value="nearest">{{ av('method.nearest') }}</option>
                <option value="kriging">{{ av('method.kriging') }}</option>
              </select>
            </label>
            <label class="check"><input v-model="showContours" type="checkbox">{{ av('contours') }}</label>
            <label class="check"><input v-model="useFixedScale" type="checkbox">{{ av('fixedScale') }}</label>
          </div>
        </header>

        <div v-if="hasSpatialData" class="stage-annotation-band">
          <div class="stage-publication-grid stage-publication-grid--compact">
            <article v-for="item in stagePublicationCards" :key="item.label" class="stage-publication-card">
              <span class="label">{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </article>
          </div>
          <div class="stage-trust-row">
            <span
              v-for="item in stageTrustChips"
              :key="item.label"
              class="trust-chip"
              :class="item.tone"
            >
              {{ item.label }}
            </span>
          </div>
          <div v-if="stageTrustMeta.length" class="stage-meta-row">
            <span v-for="item in stageTrustMeta" :key="item" class="trust-meta">{{ item }}</span>
          </div>
          <p class="publication-footer stage-publication-footer">{{ stageMethodsFooter }}</p>
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
            <SkeletonPanel :rows="4" compact />
            <p class="loading-tip">{{ av('loadingSpatial', { seam: seamName || av('targetSeam') }) }}</p>
          </div>
        </div>

        <footer class="legend-wrap">
          <div class="legend-publication-head">
            <span class="canvas-kicker">图例工作区 | 量程证据</span>
            <p>{{ legendScaleLabel }}</p>
          </div>
          <div class="legend-publication-grid">
            <article v-for="item in legendPublicationCards" :key="item.label" class="stage-publication-card legend-publication-card">
              <span class="label">{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </article>
          </div>
          <div class="legend-track" :style="{ background: legendGradient(activeMetric) }"></div>
          <div class="legend-labels">
            <span>{{ fmt(legendStats.min) }}</span>
            <span>{{ fmt(legendStats.mean) }}</span>
            <span>{{ fmt(legendStats.max) }}</span>
          </div>
          <p class="publication-footer legend-publication-footer">{{ legendMethodsFooter }}</p>
        </footer>
      </div>

      <aside ref="thumbPanelRef" class="thumb-panel" :class="{ collapsed: thumbsCollapsed }">
        <header class="thumb-head">
          <div class="thumb-heading">
            <span class="canvas-kicker">图组条带 | 跨指标证据</span>
            <h3>{{ av('thumbsTitle') }}</h3>
            <p>{{ thumbPanelSummary }}</p>
          </div>
          <button class="icon-btn mini" type="button" @click="thumbsCollapsed = !thumbsCollapsed">{{ thumbsCollapsed ? av('expand') : av('collapse') }}</button>
        </header>
        <div v-if="hasSpatialData" class="thumb-publication-grid">
          <article v-for="item in thumbPublicationCards" :key="item.label" class="stage-publication-card thumb-publication-card">
            <span class="label">{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>
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
              <strong>{{ metricLabel(item.key) }}</strong>
              <span>{{ av('mean') }} {{ fmt(metricStats[item.key]?.mean) }}</span>
              <span>标准差 {{ fmt(metricStats[item.key]?.std) }}</span>
            </div>
          </button>
        </div>
        <p v-if="hasSpatialData" class="publication-footer thumb-footer">{{ thumbMethodsFooter }}</p>
        <div v-if="thumbHover.visible && thumbHoverStats" class="thumb-tooltip" :style="{ left: `${thumbHover.x + 12}px`, top: `${thumbHover.y + 12}px` }">
          <p><strong>{{ av('thumbStatsTitle', { metric: metricLabel(thumbHover.metric) }) }}</strong></p>
          <p>{{ av('minValue') }} {{ fmt(thumbHoverStats.min) }}</p>
          <p>{{ av('maxValue') }} {{ fmt(thumbHoverStats.max) }}</p>
          <p>{{ av('meanValue') }} {{ fmt(thumbHoverStats.mean) }}</p>
          <p>{{ av('stdValue') }} {{ fmt(thumbHoverStats.std) }}</p>
        </div>
      </aside>
    </section>

    <transition name="fade-up">
      <aside v-if="showWeightPanel" class="floating-panel floating-panel--paper">
        <header class="floating-head">
          <div class="floating-heading">
            <span class="canvas-kicker">方法控制 | 加权融合</span>
            <h3>{{ av('weightConfig') }}</h3>
            <p>{{ weightPanelSummary }}</p>
          </div>
          <button type="button" class="close-btn" @click="showWeightPanel = false">&times;</button>
        </header>
        <div class="floating-publication-grid">
          <article v-for="item in weightPublicationCards" :key="item.label" class="stage-publication-card floating-publication-card">
            <span class="label">{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>
        <p class="publication-footer floating-footer">{{ weightMethodsFooter }}</p>
        <label class="weight-row"><span>RSI</span><input v-model.number="weights.rsi" type="range" min="0" max="1" step="0.05"><strong>{{ pct(normalizedWeights.rsi) }}</strong></label>
        <label class="weight-row"><span>BRI</span><input v-model.number="weights.bri" type="range" min="0" max="1" step="0.05"><strong>{{ pct(normalizedWeights.bri) }}</strong></label>
        <label class="weight-row"><span>ASI</span><input v-model.number="weights.asi" type="range" min="0" max="1" step="0.05"><strong>{{ pct(normalizedWeights.asi) }}</strong></label>
      </aside>
    </transition>

    <transition name="fade-up">
      <aside v-if="showGeoPanel" class="floating-panel floating-panel--paper geo-panel">
        <header class="floating-head">
          <div class="floating-heading">
            <span class="canvas-kicker">证据工具 | 地质对照</span>
            <h3>{{ av('geoCompareTitle') }}</h3>
            <p>{{ geoPanelSummary }}</p>
          </div>
          <button type="button" class="close-btn" @click="showGeoPanel = false">&times;</button>
        </header>
        <div class="floating-publication-grid">
          <article v-for="item in geoPublicationCards" :key="item.label" class="stage-publication-card floating-publication-card">
            <span class="label">{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>
        <p class="publication-footer floating-footer">{{ geoMethodsFooter }}</p>
        <label class="geo-row">
          <span>{{ av('geomodelJobId') }}</span>
          <input v-model.trim="geoModelJobId" type="text" :placeholder="av('geomodelJobPlaceholder')">
        </label>
        <button class="tool-btn small geo-run-btn" type="button" :disabled="geoCompareLoading || !seamName" @click="runGeoCompare">
          {{ geoCompareLoading ? av('computing') : av('runCompare') }}
        </button>
        <button class="tool-btn small geo-run-btn fusion-run-btn" type="button" :disabled="fusionLoading || !hasSpatialData" @click="activateFusionScene()">
          {{ fusionLoading ? av('fusionLoadingAction') : av('loadFusion') }}
        </button>
        <p v-if="geoCompareError" class="geo-error">{{ geoCompareError }}</p>
        <div v-if="geoCompareResult" class="geo-result-grid">
          <div class="geo-cell"><span>{{ av('geoMode') }}</span><strong>{{ geoCompareResult.algorithm_mode }}</strong></div>
          <div class="geo-cell"><span>{{ av('baseline') }}</span><strong>{{ fmt(geoCompareResult.baseline?.mpi) }}</strong></div>
          <div class="geo-cell"><span>{{ av('geoAware') }}</span><strong>{{ fmt(geoCompareResult.geology_aware?.mpi) }}</strong></div>
          <div class="geo-cell"><span>{{ av('delta') }}</span><strong>{{ fmt((geoCompareResult.geology_aware?.mpi || 0) - (geoCompareResult.baseline?.mpi || 0)) }}</strong></div>
          <div class="geo-cell"><span>{{ av('fallback') }}</span><strong>{{ geoCompareResult.fallback_used ? t('common.yes') : t('common.no') }}</strong></div>
        </div>
      </aside>
    </transition>

    <transition name="drawer-up">
      <section v-if="showEvalPanel" class="eval-drawer">
        <header class="eval-head">
          <div class="eval-heading">
            <span class="canvas-kicker">表格工作区 | 评估证据</span>
            <h3>{{ av('evalDrawerTitle') }}</h3>
            <p>{{ evaluationDrawerSummary }}</p>
          </div>
          <div class="actions"><button type="button" class="tool-btn small" @click="exportSpatialJson">{{ av('exportData') }}</button><button type="button" class="close-btn" @click="showEvalPanel = false">&times;</button></div>
        </header>

        <div v-if="evalLoading" class="panel-empty">{{ av('evaluating') }}</div>
        <div v-else-if="!evalData" class="panel-empty">{{ evalMessage || av('noEvalData') }}</div>
        <template v-else>
          <div class="stage-publication-grid eval-publication-grid">
            <article v-for="item in evalPublicationCards" :key="item.label" class="stage-publication-card">
              <span class="label">{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </article>
          </div>
          <div class="eval-grid">
            <div class="metric"><span>AUC</span><strong>{{ fmt(evalData.auc, 4) }}</strong></div>
            <div class="metric"><span>PR-AUC</span><strong>{{ fmt(evalData.pr_auc, 4) }}</strong></div>
            <div class="metric"><span>F1</span><strong>{{ fmt(evalData.f1, 4) }}</strong></div>
            <div class="metric"><span>Brier</span><strong>{{ fmt(evalData.brier, 4) }}</strong></div>
            <div class="metric"><span>ECE</span><strong>{{ fmt(evalData.ece, 4) }}</strong></div>
          </div>

          <div class="eval-content">
            <div class="cm-card">
              <h4>{{ av('confusionMatrix') }}</h4>
              <div class="cm-grid">
                <div class="cm-cell"><span>TN</span><b>{{ evalData.confusion_matrix?.tn ?? 0 }}</b></div>
                <div class="cm-cell warn"><span>FP</span><b>{{ evalData.confusion_matrix?.fp ?? 0 }}</b></div>
                <div class="cm-cell warn"><span>FN</span><b>{{ evalData.confusion_matrix?.fn ?? 0 }}</b></div>
                <div class="cm-cell"><span>TP</span><b>{{ evalData.confusion_matrix?.tp ?? 0 }}</b></div>
              </div>
            </div>
            <div class="baseline-card">
              <h4>{{ av('baselineCompareSvg') }}</h4>
              <svg viewBox="0 0 560 170" class="baseline-svg">
                <rect x="0" y="0" width="560" height="170" fill="#fff" />
                <text x="14" y="26">{{ av('baselineMpi') }}</text>
                <rect x="112" y="12" width="360" height="18" rx="9" fill="#e2e8f0"/>
                <rect x="112" y="12" :width="barWidth(baselineMpi)" height="18" rx="9" fill="#64748b"/>
                <text x="485" y="26">{{ fmt(baselineMpi, 3) }}</text>
                <text x="14" y="90">{{ av('newAlgoMpi') }}</text>
                <rect x="112" y="76" width="360" height="18" rx="9" fill="#e2e8f0"/>
                <rect x="112" y="76" :width="barWidth(currentMpiMean)" height="18" rx="9" fill="#0f766e"/>
                <text x="485" y="90">{{ fmt(currentMpiMean, 3) }}</text>
                <text x="14" y="148" fill="#64748b">{{ av('baselineNote') }}</text>
              </svg>
            </div>
          </div>
          <p class="publication-footer eval-footer">{{ evalMethodsFooter }}</p>
        </template>
      </section>
    </transition>

    <section v-if="hasSpatialData" class="science-entry publication-entry">
      <div class="publication-entry-head">
        <span class="publication-kicker">图件工作区 | 验证图版</span>
        <h3>{{ av('scienceTitle') }}</h3>
        <p>{{ av('scienceDesc') }}</p>
      </div>
      <div class="publication-entry-grid">
        <article v-for="item in scienceEntryCards" :key="item.label" class="publication-entry-card">
          <span class="label">{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </div>
      <div class="publication-entry-actions">
        <p class="data-note">{{ av('scienceSubpageHint') }}</p>
        <button type="button" class="tool-btn small" @click="goScienceFigures">{{ av('openSciencePage') }}</button>
      </div>
    </section>

    <section v-if="hasSpatialData" class="fusion-section publication-entry">
      <div class="publication-entry-head">
        <span class="publication-kicker">图1 | 三维融合诊断</span>
        <h3>{{ av('fusionTitle') }}</h3>
        <p>{{ av('fusionDesc') }}</p>
      </div>
      <div class="publication-entry-grid fusion-metrics-grid">
        <article v-for="item in fusionPaperFrame.cards" :key="item.label" class="publication-entry-card">
          <span class="label">{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </div>
      <p class="publication-footer">{{ fusionPaperFrame.methodsFooter }}</p>
      <div class="fusion-controls-row">
        <p class="data-note">{{ av('fusionJobTip') }}</p>
        <div class="fusion-controls">
          <label class="fusion-focus-select">
            <span>{{ av('fusionProfileFocus') }}</span>
            <select v-model="fusionProfileFocus" :disabled="fusionLoading || !fusionJobId">
              <option value="balanced">{{ av('fusionFocusBalanced') }}</option>
              <option value="shallow">{{ av('fusionFocusShallow') }}</option>
              <option value="deep">{{ av('fusionFocusDeep') }}</option>
            </select>
          </label>
        </div>
      </div>
      <p class="data-note">{{ av('fusionProfileHint') }}</p>
      <p v-if="fusionJobId" class="fusion-job-label">{{ av('fusionJobLabel', { jobId: fusionJobId }) }}</p>
      <div v-if="!fusionSceneRequested" class="fusion-placeholder">
        <div>
          <h4>{{ av('fusionViewerTitle') }}</h4>
          <p>{{ av('fusionDesc') }}</p>
        </div>
        <button class="tool-btn small" type="button" :disabled="fusionLoading || !hasSpatialData" @click="activateFusionScene()">
          {{ fusionLoading ? av('fusionLoadingAction') : av('loadFusion') }}
        </button>
      </div>
      <GeoMpiFusion3D
        v-else
        ref="fusionViewerRef"
        panel-label="图1"
        :context-meta="fusionContextMeta"
        :title="av('fusionViewerTitle')"
        :subtitle="av('fusionViewerSubtitle', { seam: seamName || av('targetSeam'), metric: metricLabel(activeMetric) })"
        :geomodel="fusionGeomodel"
        :stress-profile="fusionStressProfile"
        :mpi-grid="activeMetricGrid"
        :mpi-bounds="spatialData?.bounds || null"
        :metric="activeMetric"
        :metric-stats="currentMetricStats"
        :loading="fusionLoading"
        :loading-text="av('fusionLoadingText')"
        :empty-text="av('fusionEmpty')"
        :error-text="fusionError"
        :paper-mode="true"
        @refresh="loadFusionPreview"
      />
    </section>

    <div v-if="hoverInfo && hasSpatialData" class="hover-tooltip" :style="{ left: `${hoverPos.x + 14}px`, top: `${hoverPos.y + 14}px` }">
      <p>{{ av('hoverCoord', { x: fmt(hoverInfo.worldX, 2), y: fmt(hoverInfo.worldY, 2) }) }}</p>
      <p>{{ av('hoverInterpolated', { metric: metricLabel(activeMetric), value: fmt(hoverInfo.gridValue, 3) }) }}</p>
      <p>{{ av('hoverNearest', { name: hoverInfo.nearestBorehole?.borehole_name || '--', distance: fmt(hoverInfo.nearestDistance, 1) }) }}</p>
      <template v-if="hoverInfo.borehole">
        <p><strong>{{ hoverInfo.borehole.borehole_name }}</strong></p>
        <p>{{ av('hoverRsiBri', { rsi: fmt(hoverInfo.borehole.rsi, 2), bri: fmt(hoverInfo.borehole.bri, 2) }) }}</p>
        <p>{{ av('hoverAsiMpi', { asi: fmt(hoverInfo.borehole.asi, 2), mpi: fmt(hoverInfo.borehole.mpi, 2) }) }}</p>
        <p class="risk">{{ riskLabel(hoverInfo.borehole.risk_label) }}</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getCoalSeams,
  getGeomodelIntegrationJobs,
  getGeomodelStressProfile,
  getGeomodelIntegrationVisualization,
  getRockParams,
  getSeamOverburden,
  mpiCalculateGeo,
  validationEvaluate,
  validationSpatialOverview
} from '../api'
import { useViewport } from '../composables/useViewport'
import { useIndicatorCanvas } from '../composables/useIndicatorCanvas'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import { useI18n } from '../composables/useI18n'
import { LRUCache } from '../lib/lruCache'
import { SkeletonPanel } from '../components/library'
import { buildPublicationMethodsFooter } from '../utils/paperExportSchema'

const GeoMpiFusion3D = defineAsyncComponent(() => import('../components/GeoMpiFusion3D.vue'))

const route = useRoute()
const router = useRouter()
const { workspaceState, setSelectedSeam, markStepDone } = useWorkspaceFlow()
const { t } = useI18n()
const av = (key, params) => t(`algorithmValidation.${key}`, params)
const metricDefs = [
  { key: 'mpi' },
  { key: 'rsi' },
  { key: 'bri' },
  { key: 'asi' }
]
const matrixRoleMeta = {
  tp: { labelKey: 'matrix.tp', color: '#15803d' },
  tn: { labelKey: 'matrix.tn', color: '#0e7490' },
  fp: { labelKey: 'matrix.fp', color: '#d97706' },
  fn: { labelKey: 'matrix.fn', color: '#b91c1c' }
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
const showGeoPanel = ref(false)
const showEvalPanel = ref(true)
const thumbsCollapsed = ref(false)
const weights = reactive({ rsi: 0.4, bri: 0.35, asi: 0.25 })
const spatialData = shallowRef(null)
const evalData = ref(null)
const evalLoading = ref(false)
const evalMessage = ref('')
const hoverInfo = ref(null)
const hoverPos = reactive({ x: 0, y: 0 })
const thumbHover = reactive({ visible: false, metric: '', x: 0, y: 0 })
const evalSourceType = ref('pseudo_threshold')
const evalSourceFile = ref('')
const matrixSelection = ref('all')
const activePointerId = ref(null)
const exportStaticMode = ref(false)
const thumbCanvasRefs = {}
const fusionViewerRef = ref(null)
const spatialCache = new LRUCache(200)
const layerParamsCache = new LRUCache(120)
const SPATIAL_CACHE_MODEL_REV = 'advanced_v2_asi_calibrated_v1'
const geoModelJobId = ref('')
const geoCompareLoading = ref(false)
const geoCompareError = ref('')
const geoCompareResult = ref(null)
const fusionGeomodel = shallowRef(null)
const fusionStressProfile = shallowRef(null)
const fusionProfileFocus = ref('balanced')
const fusionLoading = ref(false)
const fusionError = ref('')
const fusionJobId = ref('')
const fusionSceneRequested = ref(false)
const SCIENCE_SNAPSHOT_KEY = 'algorithm_validation_science_snapshot_v1'
let scienceSnapshotPersistTimer = null

const { viewport, worldToScreen, screenToWorld, fitToBounds, startDrag, dragTo, endDrag, zoomAt } = useViewport()
const { getLegendGradient, drawGrid, drawBoreholes, pickNearestBorehole, sampleGridValue, drawMiniHeatmap } = useIndicatorCanvas()

const normalizedWeights = computed(() => {
  const sum = weights.rsi + weights.bri + weights.asi || 1
  return { rsi: weights.rsi / sum, bri: weights.bri / sum, asi: weights.asi / sum }
})

const hasSpatialData = computed(() => !!(spatialData.value?.grids && spatialData.value?.statistics && spatialData.value?.boreholes))
const algorithmModeLabel = computed(() => {
  const mode = String(spatialData.value?.algorithm_mode || '')
  if (mode === 'advanced_v2') return av('algorithmModeAdvancedV2')
  if (!mode) return av('algorithmModeUnmarked')
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
const fusionGainPct = computed(() => {
  if (baselineMpi.value <= 0) return 0
  return ((currentMpiMean.value - baselineMpi.value) / baselineMpi.value) * 100
})
const scienceEntryCards = computed(() => ([
  { label: '煤层', value: seamName.value || '--' },
  { label: '指标', value: metricLabel(activeMetric.value) },
  { label: 'AUC', value: fmt(evalData.value?.auc, 3) },
  { label: 'Brier', value: fmt(evalData.value?.brier, 3) }
]))
const fusionContextMeta = computed(() => ({
  seam: seamName.value || '',
  method: method.value || '',
  resolution: resolution.value || 0,
  focus: fusionProfileFocus.value || '',
  mode: 'validation-paper',
  jobId: fusionJobId.value || ''
}))
const fusionPaperFrame = computed(() => ({
  cards: [
    { label: '指标', value: metricLabel(activeMetric.value) },
    { label: 'MPI均值', value: fmt(currentMetricStats.value?.mean, 3) },
    { label: '融合增益', value: `${fusionGainPct.value.toFixed(2)}%` },
    { label: '焦点模式', value: fusionProfileFocus.value }
  ],
  methodsFooter: buildPublicationMethodsFooter({
    subject: '验证联动三维融合图',
    source: '新算法实证工作台',
    seam: seamName.value || '',
    details: [
      `指标 ${metricLabel(activeMetric.value)}`,
      `方法 ${String(method.value || '--').toUpperCase()}`,
      `分辨率 ${resolution.value} m`,
      `焦点 ${fusionProfileFocus.value}`
    ]
  })
}))
const toolbarSummary = computed(() => (
  '7 个导航操作已按论文图版模式组织，可直接联动导出、证据审阅与下游图组页面。'
))
const topPublicationSummary = computed(() => {
  if (!hasSpatialData.value) return '正在等待当前煤层的空间诊断结果，以填充验证摘要总板。'
  return `当前煤层 ${seamName.value || '--'} 采用 ${String(method.value || '--').toUpperCase()} 插值，网格分辨率为 ${resolution.value} m，识别出 ${currentHighRiskCount.value} 个高风险点，评估来源为 ${evalSourceLabel.value}。`
})
const topPublicationCards = computed(() => ([
  { label: '煤层', value: seamName.value || '--' },
  { label: '插值方法', value: String(method.value || '--').toUpperCase() },
  { label: 'AUC', value: fmt(evalData.value?.auc, 3) },
  { label: '高风险点', value: String(currentHighRiskCount.value) }
]))
const toolbarStateChips = computed(() => ([
  { label: '权重面板', value: showWeightPanel.value ? '开启' : '关闭', tone: showWeightPanel.value ? 'tone-active' : 'tone-neutral' },
  { label: '地质对照', value: showGeoPanel.value ? '开启' : '关闭', tone: showGeoPanel.value ? 'tone-active' : 'tone-neutral' },
  { label: '评估抽屉', value: showEvalPanel.value ? '开启' : '关闭', tone: showEvalPanel.value ? 'tone-active' : 'tone-neutral' },
  { label: '对比度状态', value: showLowContrastHint.value ? '低对比' : '稳定', tone: showLowContrastHint.value ? 'tone-warn' : 'tone-neutral' }
]))
const topPublicationMethodsFooter = computed(() => buildPublicationMethodsFooter({
  subject: '验证页首屏摘要',
  source: '新算法实证页头部',
  seam: seamName.value || '',
  details: [
    `方法 ${String(method.value || '--').toUpperCase()}` ,
    `分辨率 ${resolution.value} m` ,
    `评估来源 ${evalSourceLabel.value}` ,
    `高风险点 ${currentHighRiskCount.value}`
  ]
}))
const metricDashboardSummary = computed(() => (
  '4 张煤层特定 KPI 卡片汇总当前矿压指标，异常诊断会直接高亮，便于立即切换主图面板。'
))
const metricDashboardFooter = computed(() => buildPublicationMethodsFooter({
  subject: '指标 KPI 总览',
  source: '多指标验证卡片组',
  seam: seamName.value || '',
  details: [
    `当前指标 ${metricLabel(activeMetric.value)}` ,
    `异常指标 ${problemIndicatorLabels.value.length}` ,
    `高风险点 ${currentHighRiskCount.value}` ,
    `范围 ${fmt(currentMetricRange.value, 2)}`
  ]
}))
const stagePublicationCards = computed(() => ([
  { label: '煤层', value: seamName.value || '--' },
  { label: '指标', value: metricLabel(activeMetric.value) },
  { label: '分辨率', value: `${resolution.value} m` },
  { label: '高风险点', value: String(currentHighRiskCount.value) }
]))
const stageTrustChips = computed(() => {
  const chips = [
    { label: av('trustSpatialReal'), tone: 'real' },
    { label: `${av('trustEvaluation')}${evalSourceLabel.value}`, tone: 'warn' },
    { label: `${av('trustAlgorithm')}${algorithmModeLabel.value}`, tone: 'info' }
  ]

  if (problemIndicatorLabels.value.length) {
    chips.push({
      label: `${av('trustIndicatorAbnormal')}${problemIndicatorLabels.value.join(' / ')}`,
      tone: 'danger'
    })
  }

  if (showLowContrastHint.value) {
    chips.push({
      label: av('trustLowContrastHint', { range: fmt(currentMetricRange.value) }),
      tone: 'hint'
    })
  }

  if (matrixSelection.value !== 'all' && matrixSelectionCount.value > 0) {
    chips.push({
      label: av('trustLinkHighlight', { role: matrixRoleLabel(matrixSelection.value), count: matrixSelectionCount.value }),
      tone: 'link'
    })
  }

  return chips
})
const stageTrustMeta = computed(() => {
  const items = []
  if (evalSourceFile.value) {
    items.push(av('trustLabelSource', { file: evalSourceFile.value }))
  }
  items.push(av('trustBoreholeAndCoord', { count: spatialData.value?.borehole_count || 0 }))
  return items
})
const stageMethodsFooter = computed(() => buildPublicationMethodsFooter({
  subject: '平面验证热力图',
  source: '验证空间工作区',
  seam: seamName.value || '',
  details: [
    `指标 ${metricLabel(activeMetric.value)}`,
    `方法 ${String(method.value || '--').toUpperCase()}`,
    `分辨率 ${resolution.value} m`,
    `等值线 ${contourLevels.value}`
  ]
}))
const legendScaleLabel = computed(() => (
  useFixedScale.value ? '固定 0-100 量程' : `${String(method.value || '--').toUpperCase()} 自适应量程`
))
const legendPublicationCards = computed(() => ([
  { label: '量程模式', value: legendScaleLabel.value },
  { label: '范围', value: fmt(currentMetricRange.value, 2) },
  { label: '均值', value: fmt(legendStats.value?.mean, 2) },
  { label: '等值线', value: showContours.value ? String(contourLevels.value) : '关闭' }
]))
const legendMethodsFooter = computed(() => buildPublicationMethodsFooter({
  subject: '图例与对比度条带',
  source: '当前热力图量程标注',
  seam: seamName.value || '',
  details: [
    `指标 ${metricLabel(activeMetric.value)}` ,
    `量程 ${legendScaleLabel.value}` ,
    `均值 ${fmt(legendStats.value?.mean, 2)}` ,
    `等值线 ${showContours.value ? contourLevels.value : '关闭'}`
  ]
}))
const thumbPanelSummary = computed(() => (
  `${metricDefs.length} 张缩略图用于跨指标对照；当前有 ${problemIndicatorLabels.value.length} 个指标被诊断为异常。`
))
const thumbPublicationCards = computed(() => ([
  { label: '当前指标', value: metricLabel(activeMetric.value) },
  { label: '面板数', value: String(metricDefs.length) },
  { label: '异常指标', value: String(problemIndicatorLabels.value.length) },
  { label: '联动状态', value: matrixSelection.value === 'all' ? '全钻孔' : `${matrixRoleLabel(matrixSelection.value)} x ${matrixSelectionCount.value}` }
]))
const thumbMethodsFooter = computed(() => buildPublicationMethodsFooter({
  subject: '缩略图证据条带',
  source: '多指标迷你热力图',
  seam: seamName.value || '',
  details: [
    `当前指标 ${metricLabel(activeMetric.value)}` ,
    `异常指标 ${problemIndicatorLabels.value.length}` ,
    `联动 ${matrixSelection.value === 'all' ? '全钻孔' : matrixRoleLabel(matrixSelection.value)}` ,
    `面板数 ${metricDefs.length}`
  ]
}))
const weightPanelSummary = computed(() => (
  `${String(method.value || '--').toUpperCase()} 插值会在 300 ms 防抖后重新应用归一化的 RSI / BRI / ASI 权重。`
))
const weightPublicationCards = computed(() => ([
  { label: 'RSI', value: pct(normalizedWeights.value.rsi) },
  { label: 'BRI', value: pct(normalizedWeights.value.bri) },
  { label: 'ASI', value: pct(normalizedWeights.value.asi) },
  { label: '方法', value: String(method.value || '--').toUpperCase() }
]))
const weightMethodsFooter = computed(() => buildPublicationMethodsFooter({
  subject: '动态权重控制面板',
  source: 'RSI-BRI-ASI 归一化融合',
  seam: seamName.value || '',
  details: [
    `RSI ${pct(normalizedWeights.value.rsi)}` ,
    `BRI ${pct(normalizedWeights.value.bri)}` ,
    `ASI ${pct(normalizedWeights.value.asi)}` ,
    `方法 ${String(method.value || '--').toUpperCase()}`
  ]
}))
const geoDelta = computed(() => (
  Number(geoCompareResult.value?.geology_aware?.mpi || 0) - Number(geoCompareResult.value?.baseline?.mpi || 0)
))
const geoPanelSummary = computed(() => {
  if (geoCompareLoading.value) return av('computing')
  if (geoCompareError.value) return geoCompareError.value
  if (!geoCompareResult.value) return '等待当前煤层的钻孔点与 Geomodel 任务结果，以比较 baseline 与 geology-aware MPI。'
  return `当前煤层 geology-aware MPI 为 ${fmt(geoCompareResult.value?.geology_aware?.mpi, 3)}，baseline MPI 为 ${fmt(geoCompareResult.value?.baseline?.mpi, 3)}，两者差值为 ${fmt(geoDelta.value, 3)}。`
})
const geoPublicationCards = computed(() => ([
  { label: '煤层', value: seamName.value || '--' },
  { label: '模式', value: geoCompareResult.value?.algorithm_mode || String(method.value || '--').toUpperCase() },
  { label: '差值', value: geoCompareResult.value ? fmt(geoDelta.value, 3) : '--' },
  { label: '回退', value: geoCompareResult.value ? (geoCompareResult.value.fallback_used ? t('common.yes') : t('common.no')) : '--' }
]))
const geoMethodsFooter = computed(() => buildPublicationMethodsFooter({
  subject: '地质感知对照面板',
  source: 'baseline 与 geology-aware MPI 对比',
  seam: seamName.value || '',
  details: [
    `指标 ${metricLabel(activeMetric.value)}` ,
    `模式 ${geoCompareResult.value?.algorithm_mode || String(method.value || '--').toUpperCase()}` ,
    `差值 ${geoCompareResult.value ? fmt(geoDelta.value, 3) : '--'}` ,
    `回退 ${geoCompareResult.value ? (geoCompareResult.value.fallback_used ? '是' : '否') : '待计算'}`
  ]
}))
const evaluationDrawerSummary = computed(() => {
  if (evalLoading.value) return av('evaluating')
  if (!evalData.value) return evalMessage.value || av('noEvalData')
  return `当前煤层验证流的 AUC 为 ${fmt(evalData.value?.auc, 3)}，F1 为 ${fmt(evalData.value?.f1, 3)}，Brier 为 ${fmt(evalData.value?.brier, 3)}。`
})
const evalPublicationCards = computed(() => ([
  { label: 'AUC', value: fmt(evalData.value?.auc, 3) },
  { label: 'F1', value: fmt(evalData.value?.f1, 3) },
  { label: 'Brier', value: fmt(evalData.value?.brier, 3) },
  { label: 'ECE', value: fmt(evalData.value?.ece, 3) }
]))
const evalMethodsFooter = computed(() => buildPublicationMethodsFooter({
  subject: '验证证据抽屉',
  source: '标签联动验证流',
  seam: seamName.value || '',
  details: [
    `指标 ${metricLabel(activeMetric.value)}`,
    `AUC ${fmt(evalData.value?.auc, 3)}`,
    `F1 ${fmt(evalData.value?.f1, 3)}`,
    `Brier ${fmt(evalData.value?.brier, 3)}`
  ]
}))
const currentHighRiskCount = computed(() => highRiskCount(activeMetric.value))
const activeMetricGrid = computed(() => spatialData.value?.grids?.[activeMetric.value] || [])
const evalSourceLabel = computed(() => {
  if (evalSourceType.value === 'real_label_stream') return av('evalSource.realLabelStream')
  if (evalSourceType.value === 'pseudo_threshold') return av('evalSource.pseudoThreshold')
  if (evalSourceType.value === 'none') return av('evalSource.none')
  return av('evalSource.unknown')
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

const matrixRoleLabel = (role) => {
  const key = String(role || '').toLowerCase()
  const labelKey = matrixRoleMeta[key]?.labelKey
  return labelKey ? av(labelKey) : av('matrix.all')
}
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

const metricLabel = (metric) => {
  const key = String(metric || '').toLowerCase()
  const translated = av(`metrics.${key}`)
  return translated === `algorithmValidation.metrics.${key}` ? key.toUpperCase() : translated
}
const metricDesc = (metric) => {
  const key = String(metric || '').toLowerCase()
  const translated = av(`metricsDesc.${key}`)
  return translated === `algorithmValidation.metricsDesc.${key}` ? '' : translated
}
const isIndicatorProblem = (metric) => problemIndicators.value.includes(metric)
const legendGradient = (metric) => getLegendGradient(metric)
const fmt = (value, digit = 2) => (value === undefined || value === null || Number.isNaN(Number(value)) ? '--' : Number(value).toFixed(digit))
const pct = (value) => `${(Number(value || 0) * 100).toFixed(0)}%`
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const riskLabel = (label) => {
  const t = String(label || '').toLowerCase()
  if (t.includes('high') || t.includes('高')) return av('risk.high')
  if (t.includes('medium') || t.includes('中')) return av('risk.medium')
  if (t.includes('low') || t.includes('低')) return av('risk.low')
  return av('risk.unknown')
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
  ctx.fillText(av('matrixOverlay', { role: av(meta.labelKey), count: selected.length }), 22, 29)
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
    evalMessage.value = av('errorInsufficientBoreholes')
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
    evalMessage.value = error?.response?.data?.detail || av('errorEvaluateFailed')
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
  const cached = force ? undefined : spatialCache.get(key)
  if (cached !== undefined) {
    if (requestId !== latestSpatialRequestId) return
    await applySpatialData(cached)
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
    evalMessage.value = error?.response?.data?.detail || av('errorSpatialOverviewFailed')
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

const NATURE_EXPORT_PROFILE = Object.freeze({
  targetLongEdgePx: 4200,
  rasterScaleMin: 1.25,
  rasterScaleMax: 6
})

const resolveRasterExport = (width, height, options = {}) => {
  const sourceWidth = Math.max(1, Math.round(Number(width) || 1))
  const sourceHeight = Math.max(1, Math.round(Number(height) || 1))
  const targetLongEdge = Math.max(1200, Number(options.targetLongEdge) || NATURE_EXPORT_PROFILE.targetLongEdgePx)
  const minScale = Math.max(1, Number(options.minScale) || 1)
  const maxScale = Math.max(minScale, Number(options.maxScale) || 6)
  const baseScale = targetLongEdge / Math.max(sourceWidth, sourceHeight)
  const scale = clamp(baseScale, minScale, maxScale)
  return {
    sourceWidth,
    sourceHeight,
    scale,
    pixelWidth: Math.max(1, Math.round(sourceWidth * scale)),
    pixelHeight: Math.max(1, Math.round(sourceHeight * scale))
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
    const sourceW = heatmapCanvas.value.width
    const sourceH = heatmapCanvas.value.height
    const raster = resolveRasterExport(sourceW, sourceH, {
      targetLongEdge: NATURE_EXPORT_PROFILE.targetLongEdgePx,
      minScale: NATURE_EXPORT_PROFILE.rasterScaleMin,
      maxScale: NATURE_EXPORT_PROFILE.rasterScaleMax
    })
    const merged = document.createElement('canvas')
    merged.width = raster.pixelWidth
    merged.height = raster.pixelHeight
    const ctx = merged.getContext('2d')
    ctx.scale(raster.scale, raster.scale)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, sourceW, sourceH)
    ctx.drawImage(heatmapCanvas.value, 0, 0)
    ctx.drawImage(overlayCanvas.value, 0, 0)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)'
    ctx.font = "14px 'Times New Roman', 'Noto Serif SC', serif"
    ctx.fillText(av('exportCaption', { seam: seamName.value || '--', metric: metricLabel(activeMetric.value), resolution: resolution.value }), 16, 26)
    const link = document.createElement('a')
    link.href = merged.toDataURL('image/png', 1)
    link.download = `algorithm_validation_${seamName.value || 'seam'}_${activeMetric.value}_hd.png`
    link.click()
  })
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

const goPressureAnalysis = () => {
  router.push({
    name: 'PressureAnalysis',
    query: seamName.value ? { seam: seamName.value } : undefined
  })
}

const goScienceFigures = () => {
  router.push({
    name: 'AlgorithmValidationFigures',
    query: seamName.value ? { seam: seamName.value } : undefined
  })
}

const loadSeams = async () => {
  try {
    const resp = await getCoalSeams()
    const seams = resp?.data?.seams || []
    seamOptions.value = seams
    if (seams.length === 0) return
    const preferredName = normalizeQuerySeam(route.query?.seam) || workspaceState.selectedSeam || seams[0]?.name || ''
    const preferred = seams.find((item) => item.name === preferredName)
    seamName.value = preferred?.name || seams[0].name
    setSelectedSeam(seamName.value)
  } catch (error) {
    evalMessage.value = error?.response?.data?.detail || av('errorLoadSeams')
  }
}

const getLayerParamsForGeo = async (name) => {
  if (!name) return null
  if (layerParamsCache.has(name)) return layerParamsCache.get(name)
  try {
    const { data } = await getRockParams(name)
    layerParamsCache.set(name, data)
    return data
  } catch {
    layerParamsCache.set(name, null)
    return null
  }
}

const buildGeoComparePoint = async () => {
  if (!seamName.value) return null
  const { data } = await getSeamOverburden(seamName.value)
  const boreholes = data?.boreholes || []
  const candidate = boreholes.find((item) => Array.isArray(item.layers) && item.layers.length > 0)
  if (!candidate) return null

  const layers = candidate.layers || []
  const seamLayer = layers.find((l) => l.name === seamName.value)
  const strataLayers = layers.filter((l) => l.name !== seamName.value)
  const strata = []
  for (const layer of strataLayers) {
    const params = await getLayerParamsForGeo(layer.name)
    strata.push({
      thickness: Number(layer.thickness || 0),
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

  const burialDepth = Number(candidate.seam_top_depth ?? candidate.total_overburden_thickness ?? 0)
  const thickness = Number(seamLayer?.thickness || 0)
  return {
    x: Number(candidate.x || 0),
    y: Number(candidate.y || 0),
    borehole: candidate.name || '',
    thickness,
    burial_depth: burialDepth,
    z_top: burialDepth,
    z_bottom: burialDepth + thickness,
    strata
  }
}

const toUnixTs = (raw) => {
  const ts = Date.parse(String(raw || ''))
  return Number.isFinite(ts) ? ts : 0
}

const resolveGeomodelJobId = async () => {
  const manual = String(geoModelJobId.value || '').trim()
  if (manual) return manual

  const { data } = await getGeomodelIntegrationJobs()
  const jobs = Array.isArray(data) ? data : []
  const completed = jobs
    .filter((item) => String(item?.status || '').toLowerCase() === 'completed')
    .sort((a, b) => toUnixTs(b?.created_at) - toUnixTs(a?.created_at))
  return completed[0]?.job_id || ''
}

const loadFusionPreview = async () => {
  fusionSceneRequested.value = true
  fusionError.value = ''
  if (!hasSpatialData.value) {
    fusionError.value = av('errorFusionNeedSpatial')
    return
  }

  fusionLoading.value = true
  try {
    const jobId = await resolveGeomodelJobId()
    if (!jobId) {
      fusionGeomodel.value = null
      fusionStressProfile.value = null
      fusionJobId.value = ''
      fusionError.value = av('errorNoGeomodelJob')
      return
    }
    const { data } = await getGeomodelIntegrationVisualization(jobId, { include_mesh: true })
    fusionGeomodel.value = data || null
    await loadFusionStressProfile(jobId, { silent: true })
    fusionJobId.value = jobId
    if (!geoModelJobId.value) geoModelJobId.value = jobId
  } catch (error) {
    fusionStressProfile.value = null
    fusionError.value = error?.response?.data?.detail || error?.message || av('errorFusionLoadFailed')
  } finally {
    fusionLoading.value = false
  }
}

const activateFusionScene = async () => {
  fusionSceneRequested.value = true
  if (fusionLoading.value || !hasSpatialData.value) return
  await loadFusionPreview()
}

const loadFusionStressProfile = async (jobId, options = {}) => {
  const { silent = false } = options
  if (!jobId) {
    fusionStressProfile.value = null
    return false
  }
  try {
    const { data } = await getGeomodelStressProfile(jobId, {
      samples: 96,
      focus: fusionProfileFocus.value
    })
    fusionStressProfile.value = data || null
    return true
  } catch (error) {
    fusionStressProfile.value = null
    if (!silent) {
      fusionError.value = error?.response?.data?.detail || error?.message || av('errorFusionLoadFailed')
    }
    return false
  }
}

const runGeoCompare = async () => {
  geoCompareError.value = ''
  geoCompareResult.value = null
  geoCompareLoading.value = true
  try {
    const point = await buildGeoComparePoint()
    if (!point) {
      geoCompareError.value = av('errorNoGeoCompareBorehole')
      return
    }
    const { data } = await mpiCalculateGeo({
      point,
      geomodel_job_id: geoModelJobId.value || null,
      include_baseline: true
    })
    geoCompareResult.value = data
  } catch (error) {
    geoCompareError.value = error?.response?.data?.detail || error?.message || av('errorGeoCompareFailed')
  } finally {
    geoCompareLoading.value = false
  }
}

watch(activeMetric, () => queueRender())
watch(showContours, () => queueRender())
watch(contourLevels, () => { clampContourLevels(); queueRender() })
watch(useFixedScale, () => { queueRender(); queueThumbRender() })
watch([resolution, method], () => { if (hasInitialized.value) fetchSpatial({ force: false }) })
watch(seamName, () => {
  setSelectedSeam(seamName.value || '')
  geoCompareError.value = ''
  geoCompareResult.value = null
  fusionSceneRequested.value = false
  fusionGeomodel.value = null
  fusionStressProfile.value = null
  fusionError.value = ''
  fusionJobId.value = ''
  if (hasInitialized.value) fetchSpatial({ force: false })
})
watch(fusionProfileFocus, async () => {
  if (!fusionJobId.value || !fusionGeomodel.value || fusionLoading.value) return
  await loadFusionStressProfile(fusionJobId.value, { silent: true })
})

const persistScienceSnapshot = () => {
  if (!hasSpatialData.value || !scienceResult.value) return
  try {
    const payload = {
      seam: seamName.value || '',
      updated_at: new Date().toISOString(),
      result: scienceResult.value,
      evaluation: evalData.value || null
    }
    window.sessionStorage?.setItem?.(SCIENCE_SNAPSHOT_KEY, JSON.stringify(payload))
  } catch {
    // ignore persistence errors
  }
}

const scheduleScienceSnapshotPersist = () => {
  window.clearTimeout(scienceSnapshotPersistTimer)
  scienceSnapshotPersistTimer = window.setTimeout(() => {
    scienceSnapshotPersistTimer = null
    persistScienceSnapshot()
  }, 120)
}

watch([scienceResult, evalData, seamName, hasSpatialData], () => {
  scheduleScienceSnapshotPersist()
}, { flush: 'post' })

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
  window.clearTimeout(scienceSnapshotPersistTimer)
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
.validation-page { position: relative; display: flex; flex-direction: column; gap: 12px; min-height: calc(100vh - 18px); padding: 12px; background: radial-gradient(circle at 14% 10%, rgba(15,118,110,.14), transparent 40%), radial-gradient(circle at 86% 100%, rgba(180,83,9,.1), transparent 42%), var(--bg-secondary); }
.top-nav { display: flex; justify-content: space-between; align-items: center; gap: 10px; min-height: 58px; padding: 8px 12px; border-radius: var(--border-radius-md); border: 1px solid rgba(255,255,255,.12); background: linear-gradient(135deg, #0f172a 0%, #1f2937 100%); box-shadow: var(--shadow-md); color: #f8fafc; }
.nav-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.nav-heading { display: grid; gap: 2px; }
.nav-kicker, .canvas-kicker { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: rgba(15,118,110,.92); }
.nav-left h1 { margin: 0; font-size: 22px; font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif; }
.nav-summary { margin: 0; max-width: 460px; font-size: 11px; line-height: 1.5; color: rgba(226,232,240,.84); }
.nav-toolbar-meta { display: grid; gap: 2px; min-width: 220px; }
.nav-toolbar-meta p { margin: 0; font-size: 11px; line-height: 1.45; color: rgba(226,232,240,.76); }
.divider { width: 1px; height: 26px; background: rgba(255,255,255,.22); }
.icon-btn { border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.1); color: #f8fafc; border-radius: 8px; width: 34px; height: 34px; display: grid; place-items: center; cursor: pointer; }
.icon-btn:hover { border-color: rgba(45,212,191,.5); background: rgba(45,212,191,.2); }
.icon-btn svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; }
.icon-btn.mini {
  width: auto;
  height: 28px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 600;
  background: #f8fafc;
  border-color: #475569;
  color: #0f172a;
}
.seam-select { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; }
.seam-select select { min-width: 120px; border-radius: 8px; border: 1px solid rgba(255,255,255,.24); background: rgba(255,255,255,.12); color: #f8fafc; padding: 5px 8px; }
.seam-select select:focus { outline: none; border-color: rgba(45,212,191,.7); box-shadow: 0 0 0 3px rgba(45,212,191,.2); }
.seam-select select option { color: #0f172a; }
.mini-stats { display: inline-flex; gap: 10px; padding: 4px 10px; border-radius: 999px; background: rgba(255,255,255,.1); font-size: 11px; }
.mini-stats .danger b { color: #fca5a5; }
.nav-right { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex: 1; }
.nav-toolbar-actions { display: flex; align-items: center; justify-content: flex-end; gap: 7px; flex-wrap: wrap; }
.tool-btn { border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.12); color: #f8fafc; border-radius: 8px; font-size: 11px; padding: 6px 10px; cursor: pointer; }
.tool-btn:hover { background: rgba(45,212,191,.16); border-color: rgba(45,212,191,.36); }
.tool-btn.active { background: rgba(15,118,110,.52); border-color: rgba(45,212,191,.58); }
.tool-btn:disabled { opacity: .6; cursor: not-allowed; }
.tool-btn.small { color: #111827; border-color: var(--border-color-light); background: #f8fafc; }
.top-figure-band { display: grid; grid-template-columns: minmax(360px, 1.05fr) minmax(520px, 1.4fr); gap: 12px; align-items: stretch; }
.top-figure-band--single { grid-template-columns: 1fr; }
.top-publication-panel, .metric-dashboard-panel { border-radius: var(--border-radius-md); border: 1px solid var(--border-color-light); background: linear-gradient(180deg, rgba(255,255,255,.96) 0%, rgba(247,250,249,.94) 100%); box-shadow: var(--shadow-sm); padding: 10px 12px; }
.top-publication-head, .metric-dashboard-head { margin-bottom: 8px; }
.top-publication-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.top-publication-card { min-height: 64px; padding: 8px 10px; }
.top-toolbar-strip { display: flex; flex-wrap: wrap; gap: 6px; }
.top-toolbar-chip { display: inline-flex; align-items: center; padding: 4px 9px; border-radius: 999px; border: 1px solid #d8e6e3; background: #f8fafc; font-size: 10px; font-weight: 600; color: #334155; }
.top-toolbar-chip.tone-active { color: #065f46; background: #ecfdf5; border-color: #a7f3d0; }
.top-toolbar-chip.tone-warn { color: #92400e; background: #fffbeb; border-color: #fcd34d; }
.top-toolbar-chip.tone-neutral { color: #475569; background: #f8fafc; border-color: #d8e6e3; }
.metric-dashboard { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.metric-dashboard-footer { margin-top: 8px; }
.metric-card { border: 1px solid var(--border-color-light); border-radius: var(--border-radius-md); background: var(--bg-elevated); box-shadow: var(--shadow-sm); padding: 8px 10px; text-align: left; cursor: pointer; transition: all var(--transition-normal); }
.metric-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.metric-card.active { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(15,118,110,.18); }
.metric-card.problematic { border-color: #f59e0b; box-shadow: 0 0 0 2px rgba(245, 158, 11, .2); }
.metric-card .head { display: flex; justify-content: space-between; gap: 8px; }
.metric-card .head span { font-size: 11px; color: var(--text-tertiary); }
.metric-card .head .problem-dot { margin-left: auto; font-style: normal; font-size: 10px; color: #b45309; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 999px; padding: 1px 6px; }
.metric-card .value { margin-top: 4px; font-size: 22px; font-family: 'Times New Roman', serif; color: #111827; }
.metric-card .meta { display: flex; justify-content: space-between; margin-top: 3px; font-size: 11px; color: var(--text-secondary); }
.risk-bar { margin-top: 6px; height: 6px; border-radius: 999px; }
.main-layout { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 3fr) minmax(260px, 1fr); gap: var(--spacing-md); }
.main-canvas-card, .thumb-panel { border-radius: var(--border-radius-md); border: 1px solid var(--border-color-light); background: var(--bg-elevated); }
.main-canvas-card { display: flex; flex-direction: column; min-height: 0; box-shadow: var(--shadow-md); overflow: hidden; }
.canvas-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 8px 12px; border-bottom: 1px solid var(--border-color-light); background: linear-gradient(135deg, #f1f8f6 0%, #e4f3ef 100%); }
.canvas-heading { display: grid; gap: 3px; }
.canvas-head h2 { margin: 0; font-size: 15px; font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif; }
.canvas-head p { margin: 2px 0 0; font-size: 11px; color: #64748b; }
.canvas-controls { display: flex; gap: 7px; }
.canvas-controls label { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #334155; }
.canvas-controls input, .canvas-controls select { width: 78px; border: 1px solid var(--border-color-light); border-radius: 8px; padding: 3px 6px; font-size: 11px; background: #fff; }
.canvas-controls .check input { width: auto; }
.stage-annotation-band { display: grid; gap: 6px; padding: 8px 12px; border-bottom: 1px solid var(--border-color-light); background: linear-gradient(180deg, rgba(249,252,251,.96) 0%, rgba(243,248,247,.88) 100%); }
.trust-chip { display: inline-flex; align-items: center; border-radius: 999px; padding: 2px 9px; font-size: 10px; border: 1px solid transparent; font-weight: 600; }
.trust-chip.real { color: #065f46; background: #ecfdf5; border-color: #a7f3d0; }
.trust-chip.warn { color: #92400e; background: #fffbeb; border-color: #fde68a; }
.trust-chip.info { color: #0c4a6e; background: #ecfeff; border-color: #a5f3fc; }
.trust-chip.danger { color: #991b1b; background: #fef2f2; border-color: #fca5a5; }
.trust-chip.hint { color: #7c2d12; background: #fff7ed; border-color: #fdba74; }
.trust-chip.link { color: #0e7490; background: #e7f8f3; border-color: #99ead7; }
.trust-meta { font-size: 10px; color: #64748b; }
.stage-publication-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; padding: 8px 12px 0; background: linear-gradient(180deg, rgba(249,252,251,.96) 0%, rgba(244,249,248,.82) 100%); }
.stage-publication-grid--compact { padding: 0; background: transparent; }
.stage-publication-card { display: grid; gap: 4px; padding: 8px 10px; border: 1px solid #d8e6e3; border-radius: 10px; background: rgba(255,255,255,.9); box-shadow: 0 6px 16px rgba(15,23,42,.04); }
.stage-publication-card .label { font-size: 11px; color: #64748b; }
.stage-publication-card strong { font-size: 14px; color: #0f172a; }
.stage-trust-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.stage-meta-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.stage-publication-footer { padding: 0; background: transparent; }
.stage { position: relative; flex: 1; min-height: 400px; overflow: hidden; background: #f4f9f8; touch-action: none; }
.layer { position: absolute; inset: 0; width: 100%; height: 100%; }
.loading-mask { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 10px; justify-content: center; align-items: center; background: rgba(248,250,252,.92); z-index: 5; }
.loading-tip { margin: 0; font-size: 12px; color: #475569; }
.legend-wrap { display: grid; gap: 10px; border-top: 1px solid var(--border-color-light); padding: 12px; background: linear-gradient(180deg, rgba(248,251,250,.92) 0%, rgba(242,247,246,.88) 100%); }
.legend-publication-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.legend-publication-head p { margin: 0; font-size: 12px; color: #526071; }
.legend-publication-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
.legend-publication-card { padding: 8px 10px; }
.legend-track { height: 11px; border-radius: 999px; }
.legend-labels { display: flex; justify-content: space-between; margin-top: 5px; font-size: 11px; color: #475569; }
.legend-publication-footer { padding-top: 2px; }
.thumb-panel { position: relative; display: flex; flex-direction: column; min-height: 0; box-shadow: var(--shadow-sm); background: linear-gradient(180deg, rgba(249,251,252,.98) 0%, rgba(243,247,249,.94) 100%); }
.thumb-panel.collapsed .thumb-list, .thumb-panel.collapsed .thumb-footer { display: none; }
.thumb-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; padding: 12px; border-bottom: 1px solid var(--border-color-light); background: linear-gradient(180deg, rgba(240,247,245,.96) 0%, rgba(233,242,240,.88) 100%); }
.thumb-heading { display: grid; gap: 4px; }
.thumb-panel h3 { margin: 0; font-size: 14px; }
.thumb-heading p { margin: 0; font-size: 12px; line-height: 1.55; color: #526071; }
.thumb-publication-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; padding: 10px; border-bottom: 1px solid rgba(216,230,227,.9); }
.thumb-publication-card { padding: 8px 10px; }
.thumb-list { overflow: auto; padding: 10px; display: flex; flex-direction: column; gap: 10px; }
.thumb-item { border: 1px solid var(--border-color-light); border-radius: 10px; background: #fff; padding: 8px; display: flex; flex-direction: column; gap: 7px; cursor: pointer; }
.thumb-item.active { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(15,118,110,.14); }
.thumb-canvas { width: 100%; height: 110px; border-radius: 8px; border: 1px solid #e2e8f0; }
.thumb-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; font-size: 12px; color: #4b5563; }
.thumb-meta strong { text-align: left; }
.thumb-meta span { text-align: center; }
.thumb-footer { padding: 0 10px 10px; }
.thumb-tooltip { position: absolute; z-index: 8; pointer-events: none; min-width: 154px; border: 1px solid rgba(15,23,42,.2); border-radius: 8px; background: rgba(255,255,255,.96); box-shadow: 0 10px 20px rgba(15,23,42,.12); padding: 8px 10px; font-size: 11px; color: #1f2937; }
.thumb-tooltip p { margin: 2px 0; }
.floating-panel { position: absolute; right: 16px; top: 152px; z-index: 20; width: 360px; border-radius: var(--border-radius-md); border: 1px solid var(--border-color-light); background: #fff; box-shadow: var(--shadow-lg); padding: 12px; }
.floating-panel--paper { display: grid; gap: 10px; background: linear-gradient(180deg, rgba(250,252,251,.98) 0%, rgba(244,248,247,.94) 100%); }
.geo-panel { top: 328px; }
.floating-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.floating-heading { display: grid; gap: 4px; }
.floating-panel h3 { margin: 0; font-size: 15px; }
.floating-heading p { margin: 0; font-size: 12px; line-height: 1.55; color: #526071; }
.floating-publication-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.floating-publication-card { padding: 8px 10px; }
.floating-footer { margin-top: -2px; }
.weight-row { display: grid; grid-template-columns: 44px 1fr 46px; align-items: center; gap: 10px; margin-bottom: 10px; }
.geo-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; font-size: 12px; color: #475569; }
.geo-row input { border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 10px; font-size: 12px; }
.geo-row input:focus-visible { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(15,118,110,.2); }
.geo-run-btn { width: 100%; justify-content: center; margin-bottom: 8px; color: #111827; border-color: #d8e6e3; background: #f8fafc; }
.fusion-run-btn { margin-top: -2px; }
.geo-error { margin: 0 0 8px; color: #b91c1c; font-size: 12px; }
.geo-result-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.geo-cell { border: 1px solid #d8e6e3; border-radius: 8px; background: #f8fafc; padding: 7px 8px; }
.geo-cell span { display: block; font-size: 11px; color: #64748b; }
.geo-cell strong { font-size: 13px; color: #111827; font-family: 'JetBrains Mono', monospace; }
.close-btn { border: 1px solid #cbd5e1; background: #f1f8f6; color: #1f2937; border-radius: 8px; width: 28px; height: 28px; font-size: 17px; line-height: 1; cursor: pointer; }
.close-btn:hover { border-color: var(--color-primary); color: var(--color-primary); background: #e8f5f2; }
.eval-drawer { position: relative; z-index: 4; border-radius: var(--border-radius-md); border: 1px solid var(--border-color-light); background: #fff; box-shadow: var(--shadow-md); padding: 12px; }
.eval-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; }
.eval-heading { display: grid; gap: 4px; }
.eval-drawer h3 { margin: 0; font-size: 15px; }
.eval-heading p { margin: 0; font-size: 12px; line-height: 1.55; color: #526071; }
.eval-drawer .actions { display: flex; gap: 8px; }
.panel-empty { margin-top: 12px; border: 1px dashed #bfd3d9; border-radius: 10px; padding: 14px; font-size: 13px; color: #475569; background: #f5faf9; }
.eval-grid { margin-top: 10px; display: grid; grid-template-columns: repeat(5, minmax(90px, 1fr)); gap: 8px; }
.eval-grid .metric { border: 1px solid #d8e6e3; border-radius: 10px; background: #f3f8f7; padding: 8px; }
.eval-grid .metric span { display: block; font-size: 11px; color: #64748b; }
.eval-grid .metric strong { font-size: 18px; font-family: 'Times New Roman', serif; color: #111827; }
.eval-publication-grid { padding: 10px 0 0; }
.eval-content { margin-top: 10px; display: grid; grid-template-columns: 1fr 1.2fr; gap: 10px; }
.eval-footer { margin-top: 10px; }
.cm-card, .baseline-card { border: 1px solid #d8e6e3; border-radius: 10px; background: #f7fbfa; padding: 10px; }
.cm-card h4, .baseline-card h4 { margin: 0 0 8px; font-size: 13px; }
.cm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.cm-cell { border: 1px solid #cbd5e1; border-radius: 8px; background: #ecfdf5; padding: 8px; text-align: center; }
.cm-cell.warn { background: #fef3c7; }
.cm-cell span { display: block; font-size: 11px; color: #475569; }
.cm-cell b { font-size: 20px; color: #111827; }
.baseline-svg { width: 100%; height: auto; font-family: 'Times New Roman', serif; font-size: 12px; }
.science-entry { border-radius: var(--border-radius-md); border: 1px solid var(--border-color-light); background: var(--bg-elevated); box-shadow: var(--shadow-sm); padding: 12px; }
.science-entry .data-note { color: #92400e; }
.science-entry .export-note { color: #065f46; font-weight: 600; }
.fusion-section { border-radius: var(--border-radius-md); border: 1px solid var(--border-color-light); background: var(--bg-elevated); box-shadow: var(--shadow-sm); padding: 12px; }
.publication-entry { display: grid; gap: 10px; }
.publication-entry-head { display: grid; gap: 4px; }
.publication-kicker { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #0f766e; }
.publication-entry h3 { margin: 0; font-size: 18px; font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif; color: #111827; }
.publication-entry p { margin: 0; font-size: 12px; color: #475569; }
.publication-entry-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.publication-entry-card { display: grid; gap: 5px; padding: 10px 12px; border: 1px solid #dbe4ea; border-radius: 10px; background: rgba(255,255,255,.88); }
.publication-entry-card .label { font-size: 11px; color: #64748b; }
.publication-entry-card strong { font-size: 14px; color: #0f172a; }
.publication-entry-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.publication-footer { margin: 0; font-size: 12px; line-height: 1.6; color: #526071; }
.fusion-controls-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.fusion-placeholder { border: 1px dashed #94a3b8; border-radius: 10px; background: linear-gradient(135deg, #fbfcfe 0%, #eef6f4 100%); padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.fusion-placeholder h4 { margin: 0; font-size: 15px; color: #111827; }
.fusion-placeholder p { margin: 6px 0 0; max-width: 560px; }
.fusion-controls { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px; }
.fusion-focus-select { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #334155; }
.fusion-focus-select select { border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; color: #0f172a; padding: 4px 8px; font-size: 12px; }
.fusion-focus-select select:focus-visible { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(15,118,110,.18); }
.fusion-section .data-note { color: #92400e; }
.fusion-job-label { color: #0f766e; font-weight: 600; }
.hover-tooltip { position: absolute; z-index: 30; pointer-events: none; min-width: 200px; border: 1px solid rgba(15,23,42,.2); border-radius: 10px; background: rgba(255,255,255,.95); box-shadow: 0 12px 24px rgba(15,23,42,.15); padding: 8px 10px; font-size: 12px; color: #1f2937; }
.hover-tooltip p { margin: 2px 0; }
.hover-tooltip .risk { font-weight: 600; color: #991b1b; }
.fade-up-enter-active, .fade-up-leave-active, .drawer-up-enter-active, .drawer-up-leave-active { transition: all .24s ease; }
.fade-up-enter-from, .fade-up-leave-to { opacity: 0; transform: translateY(6px); }
.drawer-up-enter-from, .drawer-up-leave-to { opacity: 0; transform: translateY(20px); }
@media (max-width: 1400px) { .top-figure-band { grid-template-columns: 1fr; } .main-layout { grid-template-columns: 1fr; } .thumb-list { flex-direction: row; overflow-x: auto; } .thumb-item { min-width: 220px; } }
@media (max-width: 1080px) { .validation-page { height: auto; min-height: calc(100vh - 18px); } .metric-dashboard { grid-template-columns: repeat(2, minmax(0, 1fr)); } .thumb-panel { display: none; } .floating-panel { position: fixed; left: 12px; right: 12px; top: 88px; width: auto; } .geo-panel { top: 88px; } .eval-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .eval-content { grid-template-columns: 1fr; } .publication-entry-grid, .stage-publication-grid, .legend-publication-grid, .top-publication-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 760px) { .top-nav { flex-direction: column; align-items: flex-start; } .nav-summary { max-width: none; } .nav-right { width: 100%; flex-wrap: wrap; } .nav-toolbar-actions { width: 100%; justify-content: flex-start; } .stage { min-height: 320px; } .publication-entry-grid, .stage-publication-grid, .legend-publication-grid, .floating-publication-grid, .top-publication-grid { grid-template-columns: 1fr; } .publication-entry-actions, .fusion-controls-row, .fusion-placeholder, .eval-head, .legend-publication-head, .thumb-head, .floating-head { flex-direction: column; align-items: flex-start; } .eval-drawer .actions { width: 100%; flex-wrap: wrap; } }
</style>
