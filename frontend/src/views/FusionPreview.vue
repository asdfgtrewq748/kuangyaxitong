<template>
  <div class="fusion-page">
    <section class="hero-panel">
      <div class="hero-copy">
        <span class="hero-kicker">{{ fp('heroKicker') }}</span>
        <h1>{{ fp('title') }}</h1>
        <p>{{ fp('subtitle') }}</p>
      </div>

      <div class="hero-actions">
        <button class="tool-btn" type="button" :disabled="loadingSpatial || loadingFusion" @click="reloadAll">
          {{ loadingSpatial || loadingFusion ? fp('loading') : fp('reloadAll') }}
        </button>
        <button class="tool-btn secondary" type="button" @click="advancedOpen = !advancedOpen">
          {{ advancedOpen ? fp('hideAdvanced') : fp('showAdvanced') }}
        </button>
        <button class="tool-btn secondary" type="button" @click="goValidation">{{ fp('goValidation') }}</button>
        <PaperExportMenu
          :trigger-label="fp('exportTrigger')"
          :main-label="fp('exportMain')"
          :pack-label="fp('exportSupplement')"
          :loading-main-label="fp('exportingMain')"
          :loading-pack-label="fp('exportingPack')"
          :main-hint="fp('exportMainHint')"
          :pack-hint="fp('exportPackHint')"
          :disabled-main="!fusionReady"
          :disabled-pack="!fusionReady"
          :loading-main="exportingMain"
          :loading-pack="exportingPack"
          @export-main="exportMainFigure"
          @export-pack="exportSupplementPackage"
        />
      </div>

      <div class="summary-grid">
        <article class="summary-card">
          <span class="label">{{ fp('seam') }}</span>
          <strong>{{ seamName || '--' }}</strong>
          <small>{{ fp('focusLabel', { value: focusLabel }) }}</small>
        </article>
        <article class="summary-card">
          <span class="label">{{ fp('currentMetric') }}</span>
          <strong>{{ metric.toUpperCase() }}</strong>
          <small>{{ fp('metricRange', { min: fmt(metricStats.min), max: fmt(metricStats.max) }) }}</small>
        </article>
        <article class="summary-card">
          <span class="label">{{ fp('viewerStatusLabel') }}</span>
          <strong>{{ viewerStatusTitle }}</strong>
          <small>{{ viewerStatusDetail }}</small>
        </article>
      </div>

      <div class="status-stack">
        <p v-if="pageError" class="error">{{ pageError }}</p>
        <p v-if="fusionError" class="error">{{ fusionError }}</p>
        <p v-if="exportNote" class="export-note">{{ exportNote }}</p>
        <p v-if="fusionJobId" class="hint">{{ fp('currentJob', { jobId: fusionJobId }) }}</p>
        <p class="hint">{{ fp('exportHint') }}</p>
      </div>

      <section class="geomodel-inline" :class="{ active: needsGeomodelAction }">
        <div class="geomodel-inline-copy">
          <span class="preset-kicker">{{ fp('geomodelBuilderKicker') }}</span>
          <strong>{{ fp('geomodelBuilderTitle') }}</strong>
          <p>{{ geomodelBuilderSubtitle }}</p>
        </div>

        <div class="geomodel-inline-controls">
          <label>
            <span>{{ fp('geomodelMethod') }}</span>
            <select v-model="geomodelMethod">
              <option
                v-for="option in geomodelMethodOptions"
                :key="option.key"
                :value="option.key"
              >
                {{ option.label }}
              </option>
            </select>
          </label>

          <label>
            <span>{{ fp('geomodelResolution') }}</span>
            <input v-model.number="geomodelResolution" type="number" min="1" max="500" step="1">
          </label>

          <button
            class="tool-btn"
            type="button"
            data-testid="start-geomodel-job"
            :disabled="geomodelSubmitting || !seamName"
            @click="startGeomodelJob"
          >
            {{ geomodelSubmitting ? fp('geomodelSubmitting') : fp('geomodelSubmit') }}
          </button>
        </div>

        <div v-if="geomodelJob || geomodelError || geomodelQualitySummary" class="geomodel-inline-status">
          <span v-if="geomodelJob">{{ fp('geomodelStatus') }}: {{ geomodelJob.status }}</span>
          <span v-if="geomodelPolling">{{ fp('geomodelPolling') }}</span>
          <span v-if="geomodelJob?.message">{{ geomodelJob.message }}</span>
          <span v-if="geomodelQualitySummary">{{ fp('geomodelReadyHint') }}</span>
          <span v-if="geomodelError" class="error">{{ geomodelError }}</span>
        </div>
      </section>
    </section>

    <section class="preset-section">
      <div class="preset-head">
        <div>
          <span class="preset-kicker">{{ fp('presetKicker') }}</span>
          <h2>{{ fp('presetTitle') }}</h2>
        </div>
        <p>{{ fp('presetSubtitle') }}</p>
      </div>
      <div class="preset-grid">
        <button
          v-for="preset in scenePresetCards"
          :key="preset.id"
          type="button"
          class="effect-card"
          :class="{ active: selectedScenePreset === preset.id }"
          :data-preset="preset.id"
          @click="applyScenePreset(preset.id)"
        >
          <span class="effect-chip">{{ preset.badge }}</span>
          <strong>{{ preset.title }}</strong>
          <p>{{ preset.description }}</p>
          <small>{{ preset.footnote }}</small>
        </button>
      </div>
    </section>

    <GeoMpiFusion3D
      ref="fusionViewerRef"
      panel-label="图1"
      :context-meta="fusionContextMeta"
      :title="fp('viewerTitle')"
      :subtitle="fp('viewerSubtitle', { seam: seamName || '--', metric: metric.toUpperCase() })"
      :geomodel="fusionGeomodel"
      :stress-profile="fusionStressProfile"
      :mpi-grid="activeMetricGrid"
      :mpi-bounds="spatialData?.bounds || null"
      :metric="metric"
      :metric-stats="metricStats"
      :loading="loadingFusion"
      :loading-text="fp('viewerLoading')"
      :empty-text="fp('viewerEmpty')"
      :error-text="fusionError"
      :paper-mode="figureMode === 'nature'"
      :guided-mode="true"
      :guided-preset="selectedScenePreset"
      @refresh="loadFusionPreview"
    />

    <section v-if="advancedOpen" class="control-panel">
      <div class="control-head">
        <div>
          <span class="preset-kicker">{{ fp('advancedKicker') }}</span>
          <h2>{{ fp('advancedTitle') }}</h2>
        </div>
        <p>{{ fp('advancedSubtitle') }}</p>
      </div>

      <div class="control-grid">
        <label>
          <span>{{ fp('seam') }}</span>
          <select v-model="seamName">
            <option v-for="item in seamOptions" :key="item.name" :value="item.name">{{ item.name }}</option>
          </select>
        </label>

        <label>
          <span>{{ fp('metric') }}</span>
          <select v-model="metric">
            <option value="mpi">MPI</option>
            <option value="rsi">RSI</option>
            <option value="bri">BRI</option>
            <option value="asi">ASI</option>
          </select>
        </label>

        <label>
          <span>{{ fp('resolution') }}</span>
          <input v-model.number="resolution" type="number" min="20" max="120" step="5">
        </label>

        <label>
          <span>{{ fp('method') }}</span>
          <select v-model="method">
            <option value="idw">{{ fp('methodIdw') }}</option>
            <option value="linear">{{ fp('methodLinear') }}</option>
            <option value="nearest">{{ fp('methodNearest') }}</option>
            <option value="kriging">{{ fp('methodKriging') }}</option>
          </select>
        </label>

        <label>
          <span>{{ fp('focus') }}</span>
          <select v-model="profileFocus" :disabled="loadingFusion || !fusionJobId">
            <option value="balanced">{{ fp('focusBalanced') }}</option>
            <option value="shallow">{{ fp('focusShallow') }}</option>
            <option value="deep">{{ fp('focusDeep') }}</option>
          </select>
        </label>

        <label>
          <span>{{ fp('figureMode') }}</span>
          <select v-model="figureMode">
            <option value="standard">{{ fp('figureModeStandard') }}</option>
            <option value="nature">{{ fp('figureModeNature') }}</option>
          </select>
        </label>

        <label class="wide">
          <span>{{ fp('geomodelJobId') }}</span>
          <input v-model.trim="geoModelJobId" type="text" :placeholder="fp('geomodelJobPlaceholder')">
        </label>
      </div>

      <div class="control-actions">
        <button class="tool-btn" type="button" :disabled="loadingSpatial || loadingFusion || !seamName" @click="reloadAll">
          {{ loadingSpatial || loadingFusion ? fp('loading') : fp('applyAdvanced') }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getApiErrorMessage,
  getCoalSeams,
  getGeomodelIntegrationJobs,
  getGeomodelIntegrationVisualization,
  getGeomodelStressProfile,
  validationSpatialOverview
} from '../api'
import PaperExportMenu from '../components/common/PaperExportMenu.vue'
import { useGeomodelJob } from '../composables/useGeomodelJob'
import { useI18n } from '../composables/useI18n'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import {
  buildPaperArtifact,
  buildPaperFigure,
  buildPaperFigureId,
  buildPaperFigurePath,
  buildPaperFigureStem,
  buildPaperManifest,
  buildPaperRootPath,
  buildPaperSupplementZipName,
  buildPaperTimestampTag,
  buildPublicationCaptionsMarkdown,
  buildPublicationIndexDocument,
  buildPublicationLabelSet,
  buildPublicationMethodsFooter,
  buildPublicationNotesMarkdown,
  buildPublicationRows,
  buildPublicationReadmeMarkdown
} from '../utils/paperExportSchema'

const GeoMpiFusion3D = defineAsyncComponent(() => import('../components/GeoMpiFusion3D.vue'))

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const { workspaceState, setSelectedSeam } = useWorkspaceFlow()

const fp = (key, params) => t(`fusionPreview.${key}`, params)
const publicationLabels = computed(() => buildPublicationLabelSet({
  figure: fp('publicationFigureLabel'),
  summary: fp('publicationSummaryLabel'),
  caption: fp('publicationCaptionLabel'),
  notes: fp('publicationNotesLabel'),
  methodsFooter: fp('publicationMethodsFooterLabel'),
  metric: fp('publicationMetricLabel'),
}))

const seamOptions = ref([])
const seamName = ref('')
const metric = ref('mpi')
const resolution = ref(50)
const method = ref('idw')
const geoModelJobId = ref('')
const geomodelMethod = ref('thickness')
const geomodelResolution = ref(20)
const profileFocus = ref('balanced')
const figureMode = ref('nature')
const selectedScenePreset = ref('overview')
const advancedOpen = ref(false)
const hasInitialized = ref(false)

const loadingSpatial = ref(false)
const loadingFusion = ref(false)
const pageError = ref('')
const fusionError = ref('')
const fusionJobId = ref('')
const exportNote = ref('')
const exportingMain = ref(false)
const exportingPack = ref(false)
const isSwitchingProfile = ref(false)

const spatialData = shallowRef(null)
const fusionGeomodel = shallowRef(null)
const fusionStressProfile = shallowRef(null)
const fusionViewerRef = ref(null)
let jsZipCtor = null

const FIGURE_EXPORT_PROFILE = Object.freeze({
  standard: { main: { width: 3200, height: 2000 }, supplement: { width: 2800, height: 1800 } },
  nature: { main: { width: 4800, height: 3000 }, supplement: { width: 4200, height: 2600 } }
})

const SCENE_PRESET_META = Object.freeze({
  overview: { focus: 'balanced', figureMode: 'nature' },
  strata: { focus: 'balanced', figureMode: 'standard' },
  stress: { focus: 'deep', figureMode: 'nature' },
  section: { focus: 'shallow', figureMode: 'standard' }
})

const {
  jobId: activeGeomodelJobId,
  job: geomodelJob,
  loading: geomodelSubmitting,
  polling: geomodelPolling,
  error: geomodelError,
  submit: submitGeomodelJob,
  clear: clearGeomodelJob
} = useGeomodelJob()

const activeMetricGrid = computed(() => spatialData.value?.grids?.[metric.value] || [])
const metricStats = computed(() => spatialData.value?.statistics?.[metric.value] || { min: 0, mean: 0, max: 0 })
const fusionReady = computed(() => Boolean(fusionGeomodel.value && fusionStressProfile.value && activeMetricGrid.value.length > 0))
const geomodelMethodOptions = computed(() => [
  { key: 'thickness', label: fp('geomodelMethodThickness') },
  { key: 'hybrid', label: fp('geomodelMethodHybrid') },
  { key: 'regression_kriging', label: fp('geomodelMethodRegressionKriging') },
  { key: 'smart_pinchout', label: fp('geomodelMethodSmartPinchout') }
])
const geomodelQualitySummary = computed(() => geomodelJob.value?.result_manifest?.quality_summary || null)
const geomodelStatus = computed(() => String(geomodelJob.value?.status || '').toLowerCase())
const needsGeomodelAction = computed(() => !fusionReady.value || geomodelStatus.value === 'pending' || geomodelStatus.value === 'running')
const geomodelBuilderSubtitle = computed(() => {
  if (geomodelStatus.value === 'completed') return fp('geomodelBuilderReady')
  if (geomodelStatus.value === 'failed') return fp('geomodelBuilderFailed')
  if (geomodelStatus.value === 'pending' || geomodelStatus.value === 'running') {
    return fp('geomodelBuilderPending', { status: geomodelJob.value?.status || '--' })
  }
  return fp('geomodelBuilderSubtitle')
})
const focusLabel = computed(() => {
  if (profileFocus.value === 'shallow') return fp('focusShallow')
  if (profileFocus.value === 'deep') return fp('focusDeep')
  return fp('focusBalanced')
})

const viewerStatusTitle = computed(() => {
  if (loadingFusion.value) return fp('statusLoading')
  if (geomodelStatus.value === 'pending' || geomodelStatus.value === 'running') return fp('statusGeomodeling')
  if (fusionError.value) return fp('statusError')
  if (fusionReady.value) return fp('statusReady')
  return fp('statusPreparing')
})

const viewerStatusDetail = computed(() => {
  if (geomodelStatus.value === 'pending' || geomodelStatus.value === 'running') {
    return fp('statusGeomodelingDetail', { status: geomodelJob.value?.status || '--' })
  }
  if (fusionError.value) return fusionError.value
  if (fusionReady.value) return fp('statusReadyDetail', { preset: scenePresetCards.value.find((item) => item.id === selectedScenePreset.value)?.title || '--' })
  if (loadingSpatial.value || loadingFusion.value) return fp('statusLoadingDetail')
  return fp('statusPreparingDetail')
})

const fusionContextMeta = computed(() => ({
  seam: seamName.value || '',
  method: method.value || '',
  resolution: resolution.value || 0,
  focus: profileFocus.value || '',
  mode: figureMode.value || '',
  jobId: fusionJobId.value || '',
  preset: selectedScenePreset.value
}))

const scenePresetCards = computed(() => [
  {
    id: 'overview',
    badge: fp('presetOverviewBadge'),
    title: fp('presetOverviewTitle'),
    description: fp('presetOverviewDesc'),
    footnote: fp('presetOverviewFoot')
  },
  {
    id: 'strata',
    badge: fp('presetStrataBadge'),
    title: fp('presetStrataTitle'),
    description: fp('presetStrataDesc'),
    footnote: fp('presetStrataFoot')
  },
  {
    id: 'stress',
    badge: fp('presetStressBadge'),
    title: fp('presetStressTitle'),
    description: fp('presetStressDesc'),
    footnote: fp('presetStressFoot')
  },
  {
    id: 'section',
    badge: fp('presetSectionBadge'),
    title: fp('presetSectionTitle'),
    description: fp('presetSectionDesc'),
    footnote: fp('presetSectionFoot')
  }
])

const fmt = (value, digits = 3) => {
  const num = Number(value)
  return Number.isFinite(num) ? num.toFixed(digits) : '--'
}

const normalizeQuerySeam = (value) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value : ''
}

const loadSeams = async () => {
  try {
    const resp = await getCoalSeams()
    const seams = resp?.data?.seams || []
    seamOptions.value = seams
    if (!seams.length) return
    const preferredName = normalizeQuerySeam(route.query?.seam) || workspaceState.selectedSeam || seams[0].name
    const preferred = seams.find((item) => item.name === preferredName)
    seamName.value = preferred?.name || seams[0].name
    setSelectedSeam(seamName.value)
  } catch (error) {
    pageError.value = getApiErrorMessage(error, fp('errorLoadSeams'))
  }
}

const loadSpatial = async () => {
  if (!seamName.value) return
  loadingSpatial.value = true
  pageError.value = ''
  try {
    const { data } = await validationSpatialOverview(seamName.value, resolution.value, method.value)
    spatialData.value = data || null
  } catch (error) {
    pageError.value = getApiErrorMessage(error, fp('errorLoadSpatial'))
    spatialData.value = null
  } finally {
    loadingSpatial.value = false
  }
}

const toUnixTs = (raw) => {
  const ts = Date.parse(String(raw || ''))
  return Number.isFinite(ts) ? ts : 0
}

const resolveGeomodelJobId = async () => {
  const manual = String(geoModelJobId.value || '').trim()
  if (manual) {
    const isPendingInlineJob = manual === activeGeomodelJobId.value && geomodelStatus.value && geomodelStatus.value !== 'completed'
    return isPendingInlineJob ? '' : manual
  }
  const { data } = await getGeomodelIntegrationJobs()
  const jobs = Array.isArray(data) ? data : []
  const completed = jobs
    .filter((item) => String(item?.status || '').toLowerCase() === 'completed')
    .sort((a, b) => toUnixTs(b?.created_at) - toUnixTs(a?.created_at))
  return completed[0]?.job_id || ''
}

const loadFusionStressProfile = async (jobId, focus = profileFocus.value) => {
  const { data } = await getGeomodelStressProfile(jobId, {
    samples: 96,
    focus
  })
  fusionStressProfile.value = data || null
}

const loadFusionPreview = async () => {
  if (!seamName.value) return
  if (!spatialData.value) {
    await loadSpatial()
  }
  if (!spatialData.value) {
    fusionError.value = fp('errorNeedSpatial')
    return
  }

  loadingFusion.value = true
  pageError.value = ''
  fusionError.value = ''
  try {
    const jobId = await resolveGeomodelJobId()
    if (!jobId) {
      fusionGeomodel.value = null
      fusionStressProfile.value = null
      fusionJobId.value = ''
      fusionError.value = geomodelStatus.value === 'pending' || geomodelStatus.value === 'running'
        ? fp('geomodelScenePending', { status: geomodelJob.value?.status || '--' })
        : fp('errorNoGeomodelJob')
      return
    }
    const { data } = await getGeomodelIntegrationVisualization(jobId, { include_mesh: true })
    fusionGeomodel.value = data || null
    await loadFusionStressProfile(jobId)
    fusionJobId.value = jobId
    if (!geoModelJobId.value) geoModelJobId.value = jobId
  } catch (error) {
    fusionGeomodel.value = null
    fusionStressProfile.value = null
    fusionError.value = getApiErrorMessage(error, fp('errorLoadFusion'))
  } finally {
    loadingFusion.value = false
  }
}

const startGeomodelJob = async () => {
  if (!seamName.value) {
    pageError.value = fp('errorNeedSeam')
    return
  }

  pageError.value = ''
  fusionError.value = ''
  exportNote.value = ''

  try {
    const data = await submitGeomodelJob({
      method: geomodelMethod.value,
      seam_name: seamName.value,
      resolution: geomodelResolution.value,
      output_formats: ['vtk', 'vtp', 'summary', 'quality']
    })
    geoModelJobId.value = data?.job_id || ''
    fusionJobId.value = ''
    fusionGeomodel.value = null
    fusionStressProfile.value = null
  } catch (error) {
    fusionError.value = getApiErrorMessage(error, fp('errorGeomodelSubmit'))
  }
}

const applyScenePreset = (presetId) => {
  const preset = SCENE_PRESET_META[presetId] || SCENE_PRESET_META.overview
  selectedScenePreset.value = presetId in SCENE_PRESET_META ? presetId : 'overview'
  profileFocus.value = preset.focus
  figureMode.value = preset.figureMode
}

const reloadAll = async () => {
  exportNote.value = ''
  await loadSpatial()
  await loadFusionPreview()
}

const waitNextFrame = () => new Promise((resolve) => window.requestAnimationFrame(resolve))

const getJSZipCtor = async () => {
  if (jsZipCtor) return jsZipCtor
  const mod = await import('jszip')
  jsZipCtor = mod?.default || mod?.JSZip || window.JSZip || null
  if (!jsZipCtor) throw new Error(fp('errorZipLoad'))
  return jsZipCtor
}

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const getExportPreset = () => {
  return figureMode.value === 'nature' ? FIGURE_EXPORT_PROFILE.nature : FIGURE_EXPORT_PROFILE.standard
}

const ensureFusionReadyForExport = async () => {
  if (!fusionReady.value) await reloadAll()
  if (!fusionReady.value || !fusionViewerRef.value?.exportFigureBlob) {
    throw new Error(fp('errorFusionUnavailable'))
  }
}

const exportMainFigure = async () => {
  if (exportingMain.value) return
  exportingMain.value = true
  exportNote.value = ''
  try {
    await ensureFusionReadyForExport()
    const preset = getExportPreset()
    const payload = await fusionViewerRef.value.exportFigureBlob({
      width: preset.main.width,
      height: preset.main.height
    })
    if (!payload?.blob) throw new Error(fp('errorExportMain'))
    const filename = `${buildPaperFigureStem({ index: 1, slug: `fusion_main_${figureMode.value}` })}_${buildPaperTimestampTag()}.png`
    triggerDownload(payload.blob, filename)
    exportNote.value = fp('exportMainDone', {
      width: payload.width || preset.main.width,
      height: payload.height || preset.main.height
    })
  } catch (error) {
    exportNote.value = getApiErrorMessage(error, fp('errorExportMain'))
  } finally {
    exportingMain.value = false
  }
}

const exportSupplementPackage = async () => {
  if (exportingPack.value) return
  exportingPack.value = true
  exportNote.value = ''
  const originalFocus = profileFocus.value
  try {
    await ensureFusionReadyForExport()
    const JSZip = await getJSZipCtor()
    const zip = new JSZip()
    const preset = getExportPreset()
    const focuses = ['balanced', 'shallow', 'deep']
    const figureRecords = []
    const buildFusionCaptionRows = (focus) => buildPublicationRows([
      { label: publicationLabels.value.figure, value: fp('focusFigureTitle', { focus: fp(`focus${focus.charAt(0).toUpperCase()}${focus.slice(1)}`) }) },
      { label: publicationLabels.value.summary, value: fp('focusFigureSummary', { focus: fp(`focus${focus.charAt(0).toUpperCase()}${focus.slice(1)}`) }) },
      { label: publicationLabels.value.caption, value: fp('focusFigureCaption', { seam: seamName.value || '--', metric: metric.value.toUpperCase(), method: method.value.toUpperCase() }) }
    ])
    const buildFusionNoteRows = (focus, payload) => buildPublicationRows([
      { label: publicationLabels.value.notes, value: fp('focusFigureNotes', { focus: fp(`focus${focus.charAt(0).toUpperCase()}${focus.slice(1)}`) }) },
      { label: publicationLabels.value.metric, value: metric.value.toUpperCase() },
      {
        label: publicationLabels.value.methodsFooter,
        value: buildPublicationMethodsFooter({
          subject: fp('focusFigureTitle', { focus: fp(`focus${focus.charAt(0).toUpperCase()}${focus.slice(1)}`) }),
          source: 'fusion preview renderer',
          seam: seamName.value || '',
          details: [
            `metric ${metric.value.toUpperCase()}`,
            `method ${method.value.toUpperCase()}`,
            `resolution ${resolution.value}`,
            `figure mode ${figureMode.value}`,
            `size ${(payload?.width || preset.supplement.width)}x${(payload?.height || preset.supplement.height)}`
          ]
        })
      }
    ])

    for (let index = 0; index < focuses.length; index += 1) {
      const focus = focuses[index]
      isSwitchingProfile.value = true
      profileFocus.value = focus
      await loadFusionStressProfile(fusionJobId.value, focus)
      await nextTick()
      await waitNextFrame()
      const payload = await fusionViewerRef.value.exportFigureBlob({
        width: preset.supplement.width,
        height: preset.supplement.height
      })
      if (!payload?.blob) continue
      const tag = buildPaperFigureId({ index: index + 1, supplement: true })
      const figurePath = buildPaperFigurePath({
        index: index + 1,
        supplement: true,
        slug: `fusion_${focus}`,
        ext: 'png'
      })
      zip.file(figurePath, payload.blob)
      const focusName = fp(`focus${focus.charAt(0).toUpperCase()}${focus.slice(1)}`)
      figureRecords.push(buildPaperFigure({
        id: tag,
        panel: String.fromCharCode(65 + index),
        title: fp('focusFigureTitle', { focus: focusName }),
        caption: fp('focusFigureSummary', { focus: focusName }),
        files: [figurePath],
        tags: ['fusion', 'geomodel', focus],
        meta: {
          focus,
          metric: metric.value,
          seam: seamName.value,
          width: payload.width || preset.supplement.width,
          height: payload.height || preset.supplement.height,
          figure_heading: fp('focusFigureTitle', { focus: focusName }),
          caption_title: fp('focusFigureTitle', { focus: focusName }),
          caption_rows: buildFusionCaptionRows(focus),
          note_rows: buildFusionNoteRows(focus, payload)
        }
      }))
    }

    const captionsPath = buildPaperRootPath({ name: 'captions', ext: 'md' })
    const notesPath = buildPaperRootPath({ name: 'publication-notes', ext: 'md' })
    const manifestPath = buildPaperRootPath({ name: 'manifest', ext: 'json' })
    const indexPath = buildPaperRootPath({ name: 'index', ext: 'json' })
    const readmePath = buildPaperRootPath({ name: 'README', ext: 'md' })
    const generatedAt = new Date().toISOString()

    zip.file(captionsPath, buildPublicationCaptionsMarkdown({
      title: fp('supplementCaptionsTitle'),
      intro: fp('supplementCaptionsIntro', { seam: seamName.value || '--', metric: metric.value.toUpperCase(), method: method.value.toUpperCase() }),
      figures: figureRecords
    }))
    zip.file(notesPath, buildPublicationNotesMarkdown({
      title: fp('supplementNotesTitle'),
      figures: figureRecords
    }))
    zip.file(readmePath, buildPublicationReadmeMarkdown({
      title: fp('supplementExportTitle'),
      intro: fp('supplementReadmeIntro'),
      sourcePage: 'fusion-preview',
      manifestPath,
      indexPath,
      captionsPath,
      notesPath,
      figures: figureRecords
    }))
    zip.file(indexPath, JSON.stringify(buildPublicationIndexDocument({
      title: fp('supplementExportTitle'),
      generatedAt,
      sourcePage: 'fusion-preview',
      manifestPath,
      captionsPath,
      notesPath,
      readmePath,
      figures: figureRecords
    }), null, 2))

    const manifest = buildPaperManifest({
      sourcePage: 'fusion-preview',
      title: fp('supplementExportTitle'),
      locale: locale.value,
      context: {
        seam: seamName.value || '',
        metric: metric.value,
        method: method.value,
        resolution: resolution.value,
        figure_mode: figureMode.value,
        geomodel_job_id: fusionJobId.value || '',
        focus: profileFocus.value
      },
      figures: figureRecords,
      artifacts: [
        buildPaperArtifact({ name: 'captions', path: captionsPath }),
        buildPaperArtifact({ name: 'publication_notes', path: notesPath }),
        buildPaperArtifact({ name: 'index', path: indexPath }),
        buildPaperArtifact({ name: 'readme', path: readmePath }),
        buildPaperArtifact({ name: 'manifest', path: manifestPath })
      ],
      notes: [
        fp('supplementManifestNote1'),
        fp('supplementManifestNote2')
      ],
      generatedAt
    })

    zip.file(manifestPath, JSON.stringify(manifest, null, 2))
    const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    triggerDownload(zipBlob, buildPaperSupplementZipName({
      topic: 'Fusion',
      variant: figureMode.value,
      timestampTag: buildPaperTimestampTag()
    }))
    exportNote.value = fp('exportPackDone', { count: figureRecords.length })
  } catch (error) {
    exportNote.value = getApiErrorMessage(error, fp('errorExportPack'))
  } finally {
    isSwitchingProfile.value = true
    profileFocus.value = originalFocus
    if (fusionJobId.value) {
      try {
        await loadFusionStressProfile(fusionJobId.value, originalFocus)
      } catch {
        // keep current profile if restoration fails
      }
    }
    isSwitchingProfile.value = false
    exportingPack.value = false
  }
}

const goValidation = () => {
  router.push({
    name: 'AlgorithmValidation',
    query: seamName.value ? { seam: seamName.value } : undefined
  })
}

watch(seamName, async (value, oldValue) => {
  setSelectedSeam(value || '')
  spatialData.value = null
  fusionGeomodel.value = null
  fusionStressProfile.value = null
  fusionError.value = ''
  fusionJobId.value = ''
  exportNote.value = ''
  geoModelJobId.value = ''
  clearGeomodelJob()
  if (!hasInitialized.value || !value || value === oldValue) return
  await reloadAll()
})

watch(
  [activeGeomodelJobId, geomodelStatus],
  async ([jobId, status]) => {
    if (!jobId || status !== 'completed' || loadingFusion.value || fusionJobId.value === jobId) return
    geoModelJobId.value = jobId
    fusionError.value = ''
    await loadFusionPreview()
  }
)

watch(profileFocus, async () => {
  if (isSwitchingProfile.value || !fusionJobId.value || loadingFusion.value) return
  try {
    await loadFusionStressProfile(fusionJobId.value, profileFocus.value)
    fusionError.value = ''
  } catch (error) {
    fusionError.value = getApiErrorMessage(error, fp('errorLoadFusion'))
  }
})

onMounted(async () => {
  applyScenePreset(selectedScenePreset.value)
  await loadSeams()
  if (!seamName.value) return
  await reloadAll()
  hasInitialized.value = true
})
</script>

<style scoped>
.fusion-page {
  display: grid;
  gap: 14px;
}

.hero-panel,
.preset-section,
.control-panel {
  border: 1px solid #d8e6e3;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbfb 100%);
  padding: 18px;
  display: grid;
  gap: 14px;
}

.hero-panel {
  background:
    radial-gradient(circle at top right, rgba(15, 118, 110, 0.12), transparent 32%),
    linear-gradient(135deg, #ffffff 0%, #f3f9f8 100%);
}

.hero-copy {
  display: grid;
  gap: 8px;
}

.hero-kicker,
.preset-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0f766e;
}

.hero-copy h1,
.preset-head h2,
.control-head h2 {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
  color: #0f172a;
}

.hero-copy p,
.preset-head p,
.control-head p {
  margin: 0;
  max-width: 920px;
  font-size: 14px;
  line-height: 1.7;
  color: #526071;
}

.hero-actions,
.control-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.summary-card {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  padding: 14px;
  display: grid;
  gap: 6px;
}

.summary-card .label {
  font-size: 11px;
  color: #64748b;
}

.summary-card strong {
  font-size: 22px;
  color: #0f172a;
  line-height: 1.1;
}

.summary-card small {
  font-size: 12px;
  line-height: 1.5;
  color: #526071;
}

.status-stack {
  display: grid;
  gap: 6px;
}

.geomodel-inline {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.88);
  padding: 14px;
  display: grid;
  gap: 12px;
}

.geomodel-inline.active {
  border-color: rgba(15, 118, 110, 0.28);
  box-shadow: inset 0 0 0 1px rgba(15, 118, 110, 0.06);
}

.geomodel-inline-copy {
  display: grid;
  gap: 6px;
}

.geomodel-inline-copy strong {
  font-size: 18px;
  color: #0f172a;
}

.geomodel-inline-copy p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #526071;
}

.geomodel-inline-controls {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(140px, 0.8fr) auto;
  gap: 10px;
  align-items: end;
}

.geomodel-inline-controls label {
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #334155;
}

.geomodel-inline-controls select,
.geomodel-inline-controls input {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  color: #0f172a;
  padding: 9px 10px;
  font-size: 12px;
}

.geomodel-inline-controls select:focus-visible,
.geomodel-inline-controls input:focus-visible {
  outline: none;
  border-color: #0f766e;
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.14);
}

.geomodel-inline-status {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #526071;
}

.preset-head,
.control-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.effect-card {
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 14px;
  display: grid;
  gap: 10px;
  text-align: left;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}

.effect-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.effect-card.active {
  border-color: rgba(15, 118, 110, 0.4);
  background: linear-gradient(180deg, rgba(240, 253, 250, 0.96) 0%, #ffffff 100%);
  box-shadow: 0 14px 28px rgba(15, 118, 110, 0.12);
}

.effect-chip {
  display: inline-flex;
  width: fit-content;
  padding: 4px 9px;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.1);
  color: #0f766e;
  font-size: 11px;
  font-weight: 700;
}

.effect-card strong {
  font-size: 16px;
  color: #0f172a;
}

.effect-card p,
.effect-card small {
  margin: 0;
  line-height: 1.6;
}

.effect-card p {
  font-size: 13px;
  color: #334155;
}

.effect-card small {
  font-size: 11px;
  color: #64748b;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.control-grid label {
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #334155;
}

.control-grid label.wide {
  grid-column: span 2;
}

.control-grid select,
.control-grid input {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  color: #0f172a;
  padding: 9px 10px;
  font-size: 12px;
}

.control-grid select:focus-visible,
.control-grid input:focus-visible {
  outline: none;
  border-color: #0f766e;
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.14);
}

.tool-btn.secondary {
  color: #0f172a;
  border-color: #cbd5e1;
  background: #f8fafc;
}

.tool-btn.secondary:hover:not(:disabled) {
  border-color: #94a3b8;
  background: #f1f5f9;
}

.hint {
  margin: 0;
  font-size: 12px;
  color: #526071;
}

.error {
  margin: 0;
  font-size: 12px;
  color: #b91c1c;
  font-weight: 600;
}

.export-note {
  margin: 0;
  font-size: 12px;
  color: #065f46;
  font-weight: 600;
}

@media (max-width: 1080px) {
  .summary-grid,
  .preset-grid,
  .control-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .geomodel-inline-controls {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .geomodel-inline-controls .tool-btn {
    grid-column: span 2;
  }
}

@media (max-width: 760px) {
  .hero-panel,
  .preset-section,
  .control-panel {
    padding: 14px;
  }

  .hero-copy h1,
  .preset-head h2,
  .control-head h2 {
    font-size: 22px;
  }

  .preset-head,
  .control-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-grid,
  .preset-grid,
  .control-grid {
    grid-template-columns: 1fr;
  }

  .geomodel-inline-controls {
    grid-template-columns: 1fr;
  }

  .geomodel-inline-controls .tool-btn {
    grid-column: span 1;
  }

  .control-grid label.wide {
    grid-column: span 1;
  }
}
</style>
