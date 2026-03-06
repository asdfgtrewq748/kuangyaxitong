<template>
  <div class="fusion-page">
    <header class="page-header">
      <div>
        <h1>{{ fp('title') }}</h1>
        <p>{{ fp('subtitle') }}</p>
      </div>
      <div class="header-actions">
        <button class="tool-btn" type="button" :disabled="loadingSpatial || loadingFusion" @click="reloadAll">
          {{ loadingSpatial || loadingFusion ? fp('loading') : fp('reloadAll') }}
        </button>
        <button class="tool-btn" type="button" @click="goValidation">{{ fp('goValidation') }}</button>
      </div>
    </header>

    <section class="control-panel">
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

        <label class="wide">
          <span>{{ fp('geomodelJobId') }}</span>
          <input v-model.trim="geoModelJobId" type="text" :placeholder="fp('geomodelJobPlaceholder')">
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
      </div>

      <div class="control-actions">
        <button class="tool-btn" type="button" :disabled="loadingSpatial || !seamName" @click="loadSpatial">
          {{ loadingSpatial ? fp('loadingSpatial') : fp('runSpatial') }}
        </button>
        <button class="tool-btn" type="button" :disabled="loadingFusion || !seamName" @click="loadFusionPreview">
          {{ loadingFusion ? fp('loadingFusion') : fp('loadFusion') }}
        </button>
        <button class="tool-btn secondary" type="button" :disabled="exportingMain || !fusionReady" @click="exportMainFigure">
          {{ exportingMain ? fp('exportingMain') : fp('exportMain') }}
        </button>
        <button class="tool-btn secondary" type="button" :disabled="exportingPack || !fusionReady" @click="exportSupplementPackage">
          {{ exportingPack ? fp('exportingPack') : fp('exportSupplement') }}
        </button>
      </div>

      <p v-if="pageError" class="error">{{ pageError }}</p>
      <p v-if="exportNote" class="export-note">{{ exportNote }}</p>
      <p v-if="fusionJobId" class="hint">{{ fp('currentJob', { jobId: fusionJobId }) }}</p>
      <p class="hint">{{ fp('exportHint') }}</p>
    </section>

    <section class="summary-grid">
      <article class="summary-card">
        <span class="label">{{ fp('currentMetric') }}</span>
        <strong>{{ metric.toUpperCase() }}</strong>
        <small>{{ fp('metricRange', { min: fmt(metricStats.min), max: fmt(metricStats.max) }) }}</small>
      </article>
      <article class="summary-card">
        <span class="label">{{ fp('metricMeanLabel') }}</span>
        <strong>{{ fmt(metricStats.mean) }}</strong>
        <small>{{ fp('resolutionLabel', { value: resolution }) }}</small>
      </article>
      <article class="summary-card">
        <span class="label">{{ fp('seam') }}</span>
        <strong>{{ seamName || '--' }}</strong>
        <small>{{ fp('focusLabel', { value: focusLabel }) }}</small>
      </article>
    </section>

    <GeoMpiFusion3D
      ref="fusionViewerRef"
      panel-label="Fig. 1"
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
      @refresh="loadFusionPreview"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getApiErrorMessage,
  getCoalSeams,
  getGeomodelIntegrationJobs,
  getGeomodelIntegrationVisualization,
  getGeomodelStressProfile,
  validationSpatialOverview
} from '../api'
import GeoMpiFusion3D from '../components/GeoMpiFusion3D.vue'
import { useI18n } from '../composables/useI18n'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { workspaceState, setSelectedSeam } = useWorkspaceFlow()

const fp = (key, params) => t(`fusionPreview.${key}`, params)

const seamOptions = ref([])
const seamName = ref('')
const metric = ref('mpi')
const resolution = ref(50)
const method = ref('idw')
const geoModelJobId = ref('')
const profileFocus = ref('balanced')
const figureMode = ref('nature')

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

const activeMetricGrid = computed(() => spatialData.value?.grids?.[metric.value] || [])
const metricStats = computed(() => spatialData.value?.statistics?.[metric.value] || { min: 0, mean: 0, max: 0 })
const fusionReady = computed(() => {
  return Boolean(fusionGeomodel.value && fusionStressProfile.value && activeMetricGrid.value.length > 0)
})
const focusLabel = computed(() => {
  if (profileFocus.value === 'shallow') return fp('focusShallow')
  if (profileFocus.value === 'deep') return fp('focusDeep')
  return fp('focusBalanced')
})

const fusionContextMeta = computed(() => ({
  seam: seamName.value || '',
  method: method.value || '',
  resolution: resolution.value || 0,
  focus: profileFocus.value || '',
  mode: figureMode.value || '',
  jobId: fusionJobId.value || ''
}))

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
  if (manual) return manual
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
      fusionError.value = fp('errorNoGeomodelJob')
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

const reloadAll = async () => {
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

const getTimestampTag = () => {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

const getExportPreset = () => {
  return figureMode.value === 'nature' ? FIGURE_EXPORT_PROFILE.nature : FIGURE_EXPORT_PROFILE.standard
}

const ensureFusionReadyForExport = async () => {
  if (!fusionReady.value) {
    await loadFusionPreview()
  }
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
    const filename = `Fig1_Fusion_Main_${figureMode.value}_${getTimestampTag()}.png`
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
    const manifest = []

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
      const tag = `FigS${index + 1}`
      const filename = `${tag}_Fusion_${focus}.png`
      zip.file(`figures/${filename}`, payload.blob)
      manifest.push({
        figure: tag,
        focus,
        metric: metric.value,
        seam: seamName.value,
        size: {
          width: payload.width || preset.supplement.width,
          height: payload.height || preset.supplement.height
        }
      })
    }

    zip.file('data/manifest.json', JSON.stringify({
      mode: figureMode.value,
      job_id: fusionJobId.value,
      generated_at: new Date().toISOString(),
      figures: manifest
    }, null, 2))
    const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    triggerDownload(zipBlob, `Fusion_Supplement_${figureMode.value}_${getTimestampTag()}.zip`)
    exportNote.value = fp('exportPackDone', { count: manifest.length })
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

watch(seamName, (value) => {
  setSelectedSeam(value || '')
  spatialData.value = null
  fusionGeomodel.value = null
  fusionStressProfile.value = null
  fusionError.value = ''
  fusionJobId.value = ''
})

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
  await loadSeams()
  if (!seamName.value) return
  await loadSpatial()
  await loadFusionPreview()
})
</script>

<style scoped>
.fusion-page {
  display: grid;
  gap: 12px;
}

.page-header {
  border: 1px solid #d8e6e3;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f6faf9 100%);
  padding: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.page-header h1 {
  margin: 0;
  font-size: 20px;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
  color: #0f172a;
}

.page-header p {
  margin: 6px 0 0;
  color: #475569;
  font-size: 12px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.control-panel {
  border: 1px solid #d8e6e3;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
  display: grid;
  gap: 10px;
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
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  padding: 8px 10px;
  font-size: 12px;
}

.control-grid select:focus-visible,
.control-grid input:focus-visible {
  outline: none;
  border-color: #0f766e;
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.18);
}

.control-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
  color: #475569;
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

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.summary-card {
  border: 1px solid #d8e6e3;
  border-radius: 10px;
  background: #fff;
  padding: 10px 12px;
  display: grid;
  gap: 6px;
}

.summary-card .label {
  font-size: 11px;
  color: #64748b;
}

.summary-card strong {
  font-size: 20px;
  color: #0f172a;
  line-height: 1.1;
}

.summary-card small {
  font-size: 11px;
  color: #475569;
}

@media (max-width: 1080px) {
  .control-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .page-header {
    flex-direction: column;
  }

  .control-grid {
    grid-template-columns: 1fr;
  }

  .control-grid label.wide {
    grid-column: span 1;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
