<template>
  <div class="research-page page">
    <PageHeader
      class="main-header"
      :title="rw('title')"
      :description="rw('description')"
    >
      <template #actions>
        <div class="workflow-status">
          <span class="status-pill" :class="{ active: currentStep === 0, complete: stepComplete[0] }">
            <span class="step-num">1</span> {{ rw('stepRegister') }}
          </span>
          <span class="status-pill" :class="{ active: currentStep === 1, complete: stepComplete[1] }">
            <span class="step-num">2</span> {{ rw('stepSplit') }}
          </span>
          <span class="status-pill" :class="{ active: currentStep === 2, complete: stepComplete[2] }">
            <span class="step-num">3</span> {{ rw('stepExperiment') }}
          </span>
          <span class="status-pill" :class="{ active: currentStep === 3, complete: stepComplete[3] }">
            <span class="step-num">4</span> {{ rw('stepResults') }}
          </span>
        </div>
      </template>
    </PageHeader>

    <!-- Workflow Progress Bar -->
    <div class="workflow-progress">
      <div class="progress-track">
        <div
          class="progress-fill"
          :style="{ width: progressWidth + '%' }"
        ></div>
      </div>
      <div class="progress-labels">
        <span v-for="(label, i) in workflowSteps" :key="i" :class="{ active: currentStep === i }">
          {{ label }}
        </span>
      </div>
    </div>

    <!-- Step Content -->
    <transition name="step-fade" mode="out-in">
      <!-- Step 1: Dataset Registration -->
      <section v-if="currentStep === 0" :key="'step-register'" class="workflow-step">
        <div class="step-header">
          <div class="step-info">
            <h2>{{ rw('stepRegister') }}</h2>
            <p>{{ rw('stepRegisterDesc') }}</p>
          </div>
          <div class="step-status">
            <span class="status-badge" :class="manifest ? 'ok' : 'idle'">
              {{ manifest ? rw('statusRegistered') : rw('statusPending') }}
            </span>
          </div>
        </div>

        <div class="card panel-main">
          <div class="form-grid">
            <label>
              <span>{{ rw('datasetId') }}</span>
              <input v-model.trim="registerForm.dataset_id" class="input" :placeholder="rw('placeholderDatasetId')" />
            </label>
            <label>
              <span>{{ rw('labelColumn') }}</span>
              <input v-model.trim="registerForm.label_column" class="input" :placeholder="rw('placeholderLabelColumn')" />
            </label>
            <label>
              <span>{{ rw('positiveValuesComma') }}</span>
              <input v-model.trim="registerForm.positive_values" class="input" :placeholder="rw('placeholderPositiveValues')" />
            </label>
            <label>
              <span>{{ rw('eventDefinition') }}</span>
              <input v-model.trim="registerForm.event_definition" class="input" />
            </label>
            <label>
              <span>{{ rw('timeWindowHours') }}</span>
              <input v-model.number="registerForm.time_window_hours" type="number" min="1" class="input" />
            </label>
            <label>
              <span>{{ rw('thresholdOptional') }}</span>
              <input v-model.trim="registerForm.threshold" class="input" :placeholder="rw('placeholderThreshold')" />
            </label>
            <label class="full">
              <span>{{ rw('descriptionLabel') }}</span>
              <textarea v-model.trim="registerForm.description" class="input textarea" rows="3" :placeholder="rw('placeholderDescription')"></textarea>
            </label>
          </div>
          <div class="step-actions">
            <button class="btn primary" :disabled="busy.register || !registerForm.dataset_id || !registerForm.label_column" @click="registerDataset">
              <span v-if="busy.register" class="spinner sm"></span>
              {{ busy.register ? rw('registering') : rw('registerDataset') }}
            </button>
            <button class="btn secondary" :disabled="!manifest" @click="currentStep = 1">
              {{ rw('nextStep') }} →
            </button>
          </div>
        </div>

        <div v-if="manifest" class="success-card">
          <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div>
            <h3>{{ rw('datasetRegistered') }}</h3>
            <p>{{ rw('datasetId') }}: <strong>{{ manifest.dataset_id }}</strong></p>
          </div>
        </div>
      </section>

      <!-- Step 2: Dataset Split -->
      <section v-else-if="currentStep === 1" :key="'step-split'" class="workflow-step">
        <div class="step-header">
          <div class="step-info">
            <h2>{{ rw('stepSplit') }}</h2>
            <p>{{ rw('stepSplitDesc') }}</p>
          </div>
          <div class="step-status">
            <span class="status-badge" :class="splitManifest ? 'ok' : 'idle'">
              {{ splitManifest ? rw('statusSplit') : rw('statusPending') }}
            </span>
          </div>
        </div>

        <div class="card panel-main">
          <div class="lookup-row">
            <input v-model.trim="datasetQueryId" class="input" :placeholder="rw('placeholderQueryManifest')" />
            <button class="btn secondary" :disabled="busy.loadDataset || !datasetQueryId" @click="loadDataset">
              {{ busy.loadDataset ? rw('querying') : rw('query') }}
            </button>
          </div>

          <div v-if="manifest" class="manifest-stats">
            <StatCard :title="rw('version')" :value="manifest.dataset_version" size="sm" />
            <StatCard :title="rw('rowCount')" :value="manifest.row_count" size="sm" />
            <StatCard :title="rw('columnCount')" :value="manifest.column_count" size="sm" />
            <StatCard :title="rw('file')" :value="manifest.dataset_file" size="sm" />
          </div>

          <div class="form-grid">
            <label>
              <span>{{ rw('strategy') }}</span>
              <select v-model="splitForm.strategy">
                <option value="time_borehole_block">time_borehole_block</option>
                <option value="borehole_block">borehole_block</option>
                <option value="time_block">time_block</option>
                <option value="random">random</option>
              </select>
            </label>
            <label>
              <span>{{ rw('trainRatio') }}</span>
              <input v-model.number="splitForm.train_ratio" type="number" step="0.05" min="0.05" max="0.95" class="input" />
            </label>
            <label>
              <span>{{ rw('valRatio') }}</span>
              <input v-model.number="splitForm.val_ratio" type="number" step="0.05" min="0.05" max="0.95" class="input" />
            </label>
            <label>
              <span>{{ rw('testRatio') }}</span>
              <input v-model.number="splitForm.test_ratio" type="number" step="0.05" min="0.05" max="0.95" class="input" />
            </label>
            <label>
              <span>{{ rw('timeColumnOptional') }}</span>
              <input v-model.trim="splitForm.time_column" class="input" :placeholder="rw('placeholderTimeColumn')" />
            </label>
            <label>
              <span>{{ rw('boreholeColumnOptional') }}</span>
              <input v-model.trim="splitForm.borehole_column" class="input" :placeholder="rw('placeholderBoreholeColumn')" />
            </label>
            <label>
              <span>{{ rw('seed') }}</span>
              <input v-model.number="splitForm.seed" type="number" class="input" />
            </label>
          </div>

          <div class="step-actions">
            <button class="btn secondary" @click="currentStep = 0">
              ← {{ rw('prevStep') }}
            </button>
            <button class="btn primary" :disabled="busy.split || !targetDatasetId" @click="splitDataset">
              <span v-if="busy.split" class="spinner sm"></span>
              {{ busy.split ? rw('splitting') : rw('executeSplit') }}
            </button>
            <button class="btn secondary" :disabled="!splitManifest" @click="currentStep = 2">
              {{ rw('nextStep') }} →
            </button>
          </div>

          <div v-if="splitManifest" class="split-summary">
            <div class="summary-grid">
              <div><span>{{ rw('train') }}</span><strong>{{ splitManifest.counts?.train ?? 0 }}</strong></div>
              <div><span>{{ rw('val') }}</span><strong>{{ splitManifest.counts?.val ?? 0 }}</strong></div>
              <div><span>{{ rw('test') }}</span><strong>{{ splitManifest.counts?.test ?? 0 }}</strong></div>
            </div>
            <div class="leakage" :class="hasLeakage ? 'warn' : 'safe'">
              <span>{{ rw('leakageAudit') }}</span>
              <b v-if="hasLeakage">
                train-val {{ splitManifest.leakage_audit?.overlap?.boreholes_train_val || 0 }},
                train-test {{ splitManifest.leakage_audit?.overlap?.boreholes_train_test || 0 }},
                val-test {{ splitManifest.leakage_audit?.overlap?.boreholes_val_test || 0 }}
              </b>
              <b v-else>{{ rw('noLeakage') }}</b>
            </div>
          </div>
        </div>
      </section>

      <!-- Step 3: Run Experiment -->
      <section v-else-if="currentStep === 2" :key="'step-experiment'" class="workflow-step">
        <div class="step-header">
          <div class="step-info">
            <h2>{{ rw('stepExperiment') }}</h2>
            <p>{{ rw('stepExperimentDesc') }}</p>
          </div>
          <div class="step-status">
            <span class="status-badge" :class="experimentResult ? 'ok' : 'idle'">
              {{ experimentResult ? rw('statusCompleted') : rw('statusPending') }}
            </span>
          </div>
        </div>

        <div class="card panel-main">
          <div class="form-grid">
            <label>
              <span>{{ rw('datasetId') }}</span>
              <input v-model.trim="experimentForm.dataset_id" class="input" />
            </label>
            <label>
              <span>{{ rw('datasetVersion') }}</span>
              <input v-model.trim="experimentForm.dataset_version" class="input" />
            </label>
            <label>
              <span>{{ rw('splitId') }}</span>
              <input v-model.trim="experimentForm.split_id" class="input" />
            </label>
            <label>
              <span>{{ rw('experimentName') }}</span>
              <input v-model.trim="experimentForm.experiment_name" class="input" />
            </label>
            <label>
              <span>{{ rw('modelType') }}</span>
              <select v-model="experimentForm.model_type">
                <option value="baseline">baseline</option>
                <option value="rsi_phase_field">rsi_phase_field</option>
                <option value="asi_ust">asi_ust</option>
                <option value="geomodel_aware">geomodel_aware</option>
                <option value="geomodel_ablation">geomodel_ablation</option>
                <option value="hybrid_augmented">hybrid_augmented</option>
                <option value="pinchout_sensitive">pinchout_sensitive</option>
                <option value="pinchout_no_zoning">pinchout_no_zoning</option>
                <option value="rk_enhanced">rk_enhanced</option>
                <option value="kriging_baseline">kriging_baseline</option>
                <option value="custom">custom</option>
              </select>
            </label>
            <label>
              <span>{{ rw('targetLabelColumnOptional') }}</span>
              <input v-model.trim="experimentForm.target_label_column" class="input" />
            </label>
            <label>
              <span>{{ rw('metricsComma') }}</span>
              <input v-model.trim="experimentForm.metrics" class="input" />
            </label>
            <label>
              <span>{{ rw('seed') }}</span>
              <input v-model.number="experimentForm.seed" type="number" class="input" />
            </label>
          </div>

          <div class="step-actions">
            <button class="btn secondary" @click="currentStep = 1">
              ← {{ rw('prevStep') }}
            </button>
            <button class="btn primary" :disabled="busy.runExperiment || !canRunExperiment" @click="runExperiment">
              <span v-if="busy.runExperiment" class="spinner sm"></span>
              {{ busy.runExperiment ? rw('running') : rw('runExperiment') }}
            </button>
            <button class="btn secondary" :disabled="!experimentResult" @click="currentStep = 3">
              {{ rw('nextStep') }} →
            </button>
          </div>
        </div>
      </section>

      <!-- Step 4: Results -->
      <section v-else-if="currentStep === 3" :key="'step-results'" class="workflow-step">
        <div class="step-header">
          <div class="step-info">
            <h2>{{ rw('stepResults') }}</h2>
            <p>{{ rw('stepResultsDesc') }}</p>
          </div>
        </div>

        <div class="card panel-main">
          <div class="lookup-row">
            <input v-model.trim="resultQueryExpId" class="input" :placeholder="rw('placeholderQueryExpId')" />
            <button class="btn secondary" :disabled="busy.loadResult || !resultQueryExpId" @click="loadExperimentResult">
              {{ busy.loadResult ? rw('querying') : rw('queryResult') }}
            </button>
            <button class="btn secondary" :disabled="busy.loadArtifacts || !resultQueryExpId" @click="loadArtifacts">
              {{ busy.loadArtifacts ? rw('querying') : rw('queryArtifacts') }}
            </button>
          </div>

          <SkeletonPanel v-if="busy.loadResult" :rows="7" />

          <template v-else-if="displayResult">
            <div class="result-grid">
              <article class="result-card">
                <h3>{{ rw('keyMetrics') }}</h3>
                <div class="metric-grid">
                  <div v-for="[name, value] in metricEntries" :key="name" class="metric-item">
                    <span>{{ name }}</span>
                    <b>{{ formatNumber(value, 6) }}</b>
                  </div>
                </div>
              </article>

              <article class="result-card">
                <h3>{{ rw('ci95') }}</h3>
                <table class="table compact">
                  <thead>
                    <tr>
                      <th>{{ rw('metric') }}</th>
                      <th>{{ rw('low') }}</th>
                      <th>{{ rw('high') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="[name, range] in ciEntries" :key="name">
                      <td>{{ name }}</td>
                      <td>{{ formatNumber(range?.[0], 6) }}</td>
                      <td>{{ formatNumber(range?.[1], 6) }}</td>
                    </tr>
                  </tbody>
                </table>
              </article>
            </div>

            <div class="result-grid">
              <article class="result-card">
                <h3>{{ rw('traceability') }}</h3>
                <div class="trace-row">
                  <span>{{ rw('datasetManifest') }}</span>
                  <code>{{ displayResult.traceability?.dataset_manifest || '-' }}</code>
                </div>
                <div class="trace-row">
                  <span>{{ rw('splitManifest') }}</span>
                  <code>{{ displayResult.traceability?.split_manifest || '-' }}</code>
                </div>
                <div class="trace-row">
                  <span>{{ rw('createdAt') }}</span>
                  <code>{{ displayResult.created_at || '-' }}</code>
                </div>
              </article>
            </div>
          </template>

          <EmptyState
            v-else
            :title="rw('emptyResultTitle')"
            :description="rw('emptyResultDesc')"
          />

          <div class="step-actions">
            <button class="btn secondary" @click="currentStep = 2">
              ← {{ rw('prevStep') }}
            </button>
            <button class="btn secondary" @click="resetWorkflow">
              {{ rw('startOver') }}
            </button>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  researchDownloadArtifact,
  researchGetArtifacts,
  researchGetDataset,
  researchGetExperiment,
  researchListExperimentTemplates,
  researchRegisterDataset,
  researchRunExperiment,
  researchRunExperimentSuite,
  researchSplitDataset
} from '../api'
import { useI18n } from '../composables/useI18n'
import { useToast } from '../composables/useToast'
import { EmptyState, PageHeader, SkeletonPanel, StatCard } from '../components/library'
import { useUIStore } from '../stores'

const toast = useToast()
const { t } = useI18n()
const uiStore = useUIStore()
const route = useRoute()
const router = useRouter()
const rw = (key, params) => t(`researchWorkbench.${key}`, params)

const comparisonMetricOrder = ['auc', 'pr_auc', 'f1', 'brier', 'mae', 'rmse', 'paired_significance_p']
const higherBetterMetrics = new Set(['auc', 'pr_auc', 'f1'])

// ============================================
// WORKFLOW STATE
// ============================================
const currentStep = ref(0)
const workflowSteps = computed(() => [
  rw('stepRegister'),
  rw('stepSplit'),
  rw('stepExperiment'),
  rw('stepResults')
])

const stepComplete = computed(() => [
  Boolean(manifest.value),
  Boolean(splitManifest.value),
  Boolean(experimentResult.value),
  Boolean(displayResult.value)
])

const progressWidth = computed(() => {
  const completeCount = stepComplete.value.filter(Boolean).length
  return (completeCount / workflowSteps.value.length) * 100
})

const resetWorkflow = () => {
  currentStep.value = 0
}

// Auto-advance to next step when current step completes
const advanceToNextStep = () => {
  // Find the next incomplete step
  const nextIncomplete = stepComplete.value.findIndex((complete, i) => i > currentStep.value && !complete)
  if (nextIncomplete !== -1) {
    currentStep.value = nextIncomplete
  }
}

const busy = reactive({
  register: false,
  loadDataset: false,
  split: false,
  runExperiment: false,
  loadTemplates: false,
  runSuite: false,
  loadResult: false,
  loadArtifacts: false,
  downloadArtifact: false,
  compare: false,
  exportEvidence: false
})

const registerForm = reactive({
  dataset_id: '',
  description: '',
  label_column: 'label',
  positive_values: '1',
  event_definition: 'roof_pressure_event',
  time_window_hours: 24,
  threshold: ''
})

const splitForm = reactive({
  strategy: 'time_borehole_block',
  train_ratio: 0.7,
  val_ratio: 0.15,
  test_ratio: 0.15,
  seed: 42,
  time_column: '',
  borehole_column: ''
})

const experimentForm = reactive({
  dataset_id: '',
  dataset_version: '',
  split_id: '',
  experiment_name: 'rsi_phasefield_v1',
  model_type: 'rsi_phase_field',
  target_label_column: 'label',
  metrics: 'auc,pr_auc,brier,ece,f1,mae,rmse',
  seed: 42
})

const manifest = ref(null)
const splitManifest = ref(null)
const experimentResult = ref(null)

// Watch for step completion and auto-advance
watch([manifest, splitManifest, experimentResult], () => {
  // Auto-populate next step's form fields when current step completes
  if (manifest.value && currentStep.value === 0) {
    experimentForm.dataset_id = manifest.value.dataset_id || ''
    experimentForm.dataset_version = manifest.value.dataset_version || ''
  }
  if (splitManifest.value && currentStep.value === 1) {
    experimentForm.split_id = splitManifest.value.split_id || ''
  }
}, { deep: true })

const suiteResult = ref(null)
const templates = ref({})
const selectedTemplate = ref('')
const loadedResult = ref(null)
const artifacts = ref([])
const datasetQueryId = ref('')
const resultQueryExpId = ref('')
const downloadingArtifactName = ref('')
const compareExpIdsText = ref('')
const comparisonRows = ref([])
const compareVizMetric = ref('auc')
let jsZipCtor = null

const targetDatasetId = computed(() => datasetQueryId.value || manifest.value?.dataset_id || '')
const canRunExperiment = computed(() => (
  Boolean(experimentForm.dataset_id) &&
  Boolean(experimentForm.dataset_version) &&
  Boolean(experimentForm.experiment_name)
))
const canRunSuite = computed(() => (
  Boolean(experimentForm.dataset_id) &&
  Boolean(experimentForm.dataset_version) &&
  Boolean(experimentForm.split_id)
))
const displayResult = computed(() => loadedResult.value || experimentResult.value)
const metricEntries = computed(() => Object.entries(displayResult.value?.metrics || {}))
const ciEntries = computed(() => Object.entries(displayResult.value?.ci95 || {}))
const templateNames = computed(() => Object.keys(templates.value || {}))
const templateSteps = computed(() => templates.value?.[selectedTemplate.value] || [])
const hasLeakage = computed(() => {
  const overlap = splitManifest.value?.leakage_audit?.overlap
  if (!overlap) return false
  return Number(overlap.boreholes_train_val || 0) > 0 ||
    Number(overlap.boreholes_train_test || 0) > 0 ||
    Number(overlap.boreholes_val_test || 0) > 0
})
const bestMetricValues = computed(() => {
  const rows = comparisonRows.value || []
  const result = {}
  for (const metric of comparisonMetricOrder) {
    const values = rows
      .map((row) => Number(row?.metrics?.[metric]))
      .filter((value) => Number.isFinite(value))
    if (!values.length) continue
    result[metric] = higherBetterMetrics.has(metric)
      ? Math.max(...values)
      : Math.min(...values)
  }
  return result
})
const comparisonModelRows = computed(() => {
  const buckets = new Map()
  for (const row of comparisonRows.value || []) {
    const modelType = String(row?.spec?.model_type || 'unknown')
    if (!buckets.has(modelType)) {
      buckets.set(modelType, {
        model_type: modelType,
        sample_count: 0,
        values: {},
        metrics: {}
      })
    }
    const bucket = buckets.get(modelType)
    bucket.sample_count += 1
    for (const metric of comparisonMetricOrder) {
      const value = Number(row?.metrics?.[metric])
      if (!Number.isFinite(value)) continue
      if (!bucket.values[metric]) bucket.values[metric] = []
      bucket.values[metric].push(value)
    }
  }
  for (const bucket of buckets.values()) {
    for (const metric of comparisonMetricOrder) {
      const vals = bucket.values[metric] || []
      if (!vals.length) continue
      bucket.metrics[metric] = vals.reduce((acc, item) => acc + item, 0) / vals.length
    }
  }
  return Array.from(buckets.values()).sort((a, b) => a.model_type.localeCompare(b.model_type))
})
const comparisonChampionRows = computed(() => {
  const rows = comparisonRows.value || []
  const champions = []
  for (const metric of comparisonMetricOrder) {
    let winner = null
    for (const row of rows) {
      const value = Number(row?.metrics?.[metric])
      if (!Number.isFinite(value)) continue
      if (!winner) {
        winner = row
        continue
      }
      const winnerValue = Number(winner?.metrics?.[metric])
      const takeCurrent = higherBetterMetrics.has(metric) ? value > winnerValue : value < winnerValue
      if (takeCurrent) winner = row
    }
    if (winner) {
      champions.push({
        metric,
        value: Number(winner?.metrics?.[metric]),
        exp_id: winner?.exp_id || '',
        model_type: winner?.spec?.model_type || 'unknown'
      })
    }
  }
  return champions
})
const championExpIdByMetric = computed(() => {
  const map = {}
  for (const row of comparisonChampionRows.value) {
    map[row.metric] = row.exp_id
  }
  return map
})
const comparisonPointChart = computed(() => {
  const metric = compareVizMetric.value
  const rows = (comparisonRows.value || [])
    .map((row) => {
      const value = Number(row?.metrics?.[metric])
      if (!Number.isFinite(value)) return null
      const ciRange = row?.ci95?.[metric]
      const ciLow = Number(ciRange?.[0])
      const ciHigh = Number(ciRange?.[1])
      return {
        exp_id: row.exp_id,
        shortExpId: String(row.exp_id || '').slice(-8),
        value,
        ciLow: Number.isFinite(ciLow) ? ciLow : value,
        ciHigh: Number.isFinite(ciHigh) ? ciHigh : value,
        hasCi: Number.isFinite(ciLow) && Number.isFinite(ciHigh),
        isChampion: championExpIdByMetric.value?.[metric] === row.exp_id
      }
    })
    .filter(Boolean)

  if (!rows.length) return null

  const width = 900
  const margin = { top: 20, right: 34, bottom: 34, left: 110 }
  const rowGap = 28
  const plotHeight = Math.max(160, rows.length * rowGap)
  const height = margin.top + plotHeight + margin.bottom
  const plotWidth = width - margin.left - margin.right

  const minValue = Math.min(...rows.map((row) => Math.min(row.ciLow, row.value)))
  const maxValue = Math.max(...rows.map((row) => Math.max(row.ciHigh, row.value)))
  const span = Math.max(maxValue - minValue, 1e-9)
  const pad = span * 0.12
  const domainMin = minValue - pad
  const domainMax = maxValue + pad
  const domainSpan = Math.max(domainMax - domainMin, 1e-9)
  const scaleX = (val) => margin.left + ((val - domainMin) / domainSpan) * plotWidth

  const ticks = Array.from({ length: 5 }, (_, idx) => domainMin + (idx / 4) * domainSpan)

  const chartRows = rows.map((row, idx) => ({
    ...row,
    y: margin.top + 14 + idx * rowGap
  }))

  return {
    width,
    height,
    margin,
    plotWidth,
    plotHeight,
    rows: chartRows,
    ticks,
    scaleX
  }
})
const comparisonModelBarChart = computed(() => {
  const metric = compareVizMetric.value
  const rows = (comparisonModelRows.value || [])
    .map((row) => ({
      model_type: row.model_type,
      value: Number(row?.metrics?.[metric])
    }))
    .filter((row) => Number.isFinite(row.value))
  if (!rows.length) return null

  const width = 900
  const margin = { top: 20, right: 60, bottom: 20, left: 150 }
  const rowGap = 34
  const barHeight = 20
  const plotHeight = Math.max(140, rows.length * rowGap)
  const height = margin.top + plotHeight + margin.bottom
  const plotWidth = width - margin.left - margin.right

  const minValue = Math.min(...rows.map((row) => row.value))
  const maxValue = Math.max(...rows.map((row) => row.value))
  const span = Math.max(maxValue - minValue, 1e-9)
  const pad = span * 0.1
  const domainMin = Math.min(0, minValue - pad)
  const domainMax = maxValue + pad
  const domainSpan = Math.max(domainMax - domainMin, 1e-9)
  const scaleX = (val) => margin.left + ((val - domainMin) / domainSpan) * plotWidth

  const chartRows = rows.map((row, idx) => ({
    ...row,
    y: margin.top + 16 + idx * rowGap,
    height: barHeight
  }))

  return {
    width,
    height,
    margin,
    plotWidth,
    plotHeight,
    rows: chartRows,
    scaleX
  }
})

const parseList = (text) => (
  String(text || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
)

const parseFlexibleList = (text) => (
  Array.from(
    new Set(
      String(text || '')
        .split(/[\s,]+/g)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  )
)

const parsePositiveValues = (text) => (
  parseList(text).map((item) => {
    if (/^(true|false)$/i.test(item)) return item.toLowerCase() === 'true'
    const num = Number(item)
    return Number.isFinite(num) ? num : item
  })
)

const parseNullableNumber = (value) => {
  const text = String(value ?? '').trim()
  if (!text) return null
  const num = Number(text)
  return Number.isFinite(num) ? num : null
}

const getErrorMessage = (error, fallback) => (
  error?.response?.data?.detail ||
  error?.message ||
  fallback
)

const formatNumber = (value, digits = 4) => {
  const n = Number(value)
  return Number.isFinite(n) ? n.toFixed(digits) : '-'
}

const formatBytes = (value) => {
  const size = Number(value)
  if (!Number.isFinite(size) || size < 0) return '-'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const safeStamp = () => new Date().toISOString().replace(/[:.]/g, '-')
const syncRouteExpId = (expId) => {
  const nextExpId = String(expId || '').trim()
  if (!nextExpId) return
  const currentExpId = String(route.query?.exp_id || '').trim()
  if (currentExpId === nextExpId) return
  router.replace({
    path: '/research-workbench',
    query: {
      ...route.query,
      exp_id: nextExpId
    }
  }).catch(() => {})
}

const bootstrapExpFromRoute = async () => {
  const expId = String(route.query?.exp_id || '').trim()
  if (!expId) return
  resultQueryExpId.value = expId
  await loadExperimentResult()
  await loadArtifacts()
}

const getJSZipCtor = async () => {
  if (jsZipCtor) return jsZipCtor
  const mod = await import('jszip')
  jsZipCtor = mod?.default || mod?.JSZip || null
  if (!jsZipCtor) {
    throw new Error(rw('jszipLoadFailed'))
  }
  return jsZipCtor
}

const parseFilenameFromHeader = (value, fallback) => {
  const text = String(value || '')
  const utf8Match = text.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1])
    } catch {
      return utf8Match[1]
    }
  }
  const plainMatch = text.match(/filename="?([^";]+)"?/i)
  return plainMatch?.[1] || fallback
}

const isBestMetricValue = (metric, value) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return false
  const best = Number(bestMetricValues.value?.[metric])
  if (!Number.isFinite(best)) return false
  return Math.abs(best - num) <= 1e-12
}

const buildComparisonCsvText = (rows) => {
  if (!rows?.length) return ''
  const headers = ['exp_id', 'model_type', 'dataset_id', 'dataset_version', 'split_id', ...comparisonMetricOrder, 'created_at']
  const lines = [headers.join(',')]
  for (const row of rows) {
    const modelType = row?.spec?.model_type || ''
    const values = [
      row?.exp_id || '',
      modelType,
      row?.dataset_id || '',
      row?.dataset_version || '',
      row?.split_id || '',
      ...comparisonMetricOrder.map((metric) => row?.metrics?.[metric] ?? ''),
      row?.created_at || ''
    ]
    lines.push(values.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(','))
  }
  return `${lines.join('\n')}\n`
}

const buildModelSummaryCsvText = (rows) => {
  if (!rows?.length) return ''
  const headers = ['model_type', 'sample_count', ...comparisonMetricOrder]
  const lines = [headers.join(',')]
  for (const row of rows) {
    const values = [
      row.model_type,
      row.sample_count,
      ...comparisonMetricOrder.map((metric) => row?.metrics?.[metric] ?? '')
    ]
    lines.push(values.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(','))
  }
  return `${lines.join('\n')}\n`
}
const buildMethodsMarkdown = () => {
  const metric = compareVizMetric.value
  const lines = [
    '# Methods Summary',
    '',
    '## Data Governance',
    `- Dataset ID: ${manifest.value?.dataset_id || '-'}`,
    `- Dataset Version: ${manifest.value?.dataset_version || '-'}`,
    `- Dataset Rows: ${manifest.value?.row_count ?? '-'}`,
    `- Label Column: ${manifest.value?.label_schema?.label_column || '-'}`,
    `- Positive Values: ${(manifest.value?.label_schema?.positive_values || []).join(', ') || '-'}`,
    '',
    '## Split Strategy',
    `- Split ID: ${splitManifest.value?.split_id || displayResult.value?.split_id || '-'}`,
    `- Strategy: ${splitManifest.value?.strategy || '-'}`,
    `- Ratios: train=${splitManifest.value?.ratios?.train ?? '-'}, val=${splitManifest.value?.ratios?.val ?? '-'}, test=${splitManifest.value?.ratios?.test ?? '-'}`,
    `- Leakage Overlap: train-val=${splitManifest.value?.leakage_audit?.overlap?.boreholes_train_val ?? '-'}, train-test=${splitManifest.value?.leakage_audit?.overlap?.boreholes_train_test ?? '-'}, val-test=${splitManifest.value?.leakage_audit?.overlap?.boreholes_val_test ?? '-'}`,
    '',
    '## Experiment Protocol',
    `- Primary Experiment ID: ${displayResult.value?.exp_id || '-'}`,
    `- Model Type: ${displayResult.value?.spec?.model_type || '-'}`,
    `- Seed: ${displayResult.value?.spec?.seed ?? '-'}`,
    `- Metrics: ${comparisonMetricOrder.join(', ')}`,
    '- Statistics: bootstrap 95% CI and paired significance (as implemented by backend experiment runner).',
    '',
    '## Comparison Snapshot',
    `- Compared Experiments: ${comparisonRows.value.length}`,
    `- Visualized Metric: ${metric}`,
    `- Model Groups: ${comparisonModelRows.value.length}`,
    `- Champion Count: ${comparisonChampionRows.value.length}`,
    '',
    '## Notes',
    '- This material is generated from current reproducibility workspace state.',
    '- Use this file as supplementary methods draft for manuscript preparation.'
  ]
  return lines.join('\n')
}

const escapeXml = (value) => (
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
)

const buildComparisonPointChartSvg = () => {
  const chart = comparisonPointChart.value
  if (!chart) return ''
  const lines = []
  lines.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${chart.width} ${chart.height}">`)
  lines.push(`<rect x="0" y="0" width="${chart.width}" height="${chart.height}" fill="#ffffff"/>`)
  for (const tick of chart.ticks) {
    const x = chart.scaleX(tick)
    lines.push(`<line x1="${x}" y1="${chart.margin.top}" x2="${x}" y2="${chart.margin.top + chart.plotHeight}" stroke="#e2e8f0" stroke-width="1"/>`)
    lines.push(`<text x="${x}" y="${chart.height - 6}" fill="#64748b" font-size="10" text-anchor="middle">${Number(tick).toFixed(4)}</text>`)
  }
  for (const row of chart.rows) {
    lines.push(`<line x1="${chart.scaleX(row.ciLow)}" y1="${row.y}" x2="${chart.scaleX(row.ciHigh)}" y2="${row.y}" stroke="#94a3b8" stroke-width="1.6"/>`)
    lines.push(`<circle cx="${chart.scaleX(row.value)}" cy="${row.y}" r="4.5" fill="${row.isChampion ? '#dc2626' : '#0f766e'}"/>`)
    lines.push(`<text x="${chart.margin.left - 8}" y="${row.y + 4}" fill="#0f172a" font-size="10" text-anchor="end">${escapeXml(row.shortExpId)}</text>`)
  }
  lines.push('</svg>')
  return lines.join('')
}

const buildComparisonModelBarSvg = () => {
  const chart = comparisonModelBarChart.value
  if (!chart) return ''
  const lines = []
  lines.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${chart.width} ${chart.height}">`)
  lines.push(`<rect x="0" y="0" width="${chart.width}" height="${chart.height}" fill="#ffffff"/>`)
  for (const row of chart.rows) {
    const x0 = chart.scaleX(0)
    const x1 = chart.scaleX(row.value)
    const left = Math.min(x0, x1)
    const width = Math.abs(x1 - x0)
    lines.push(`<rect x="${left}" y="${row.y - row.height / 2}" width="${width}" height="${row.height}" rx="4" fill="#0f766e" opacity="0.85"/>`)
    lines.push(`<text x="${chart.margin.left - 8}" y="${row.y + 4}" fill="#0f172a" font-size="10" text-anchor="end">${escapeXml(row.model_type)}</text>`)
    lines.push(`<text x="${x1 + 6}" y="${row.y + 4}" fill="#475569" font-size="10">${Number(row.value).toFixed(4)}</text>`)
  }
  lines.push('</svg>')
  return lines.join('')
}

const applyManifestToForms = (data) => {
  if (!data) return
  datasetQueryId.value = data.dataset_id || datasetQueryId.value
  experimentForm.dataset_id = data.dataset_id || experimentForm.dataset_id
  experimentForm.dataset_version = data.dataset_version || experimentForm.dataset_version
  if (data.label_schema?.label_column && !experimentForm.target_label_column) {
    experimentForm.target_label_column = data.label_schema.label_column
  }
}

const registerDataset = async () => {
  busy.register = true
  try {
    const payload = {
      dataset_id: registerForm.dataset_id,
      description: registerForm.description,
      label_schema: {
        label_column: registerForm.label_column,
        positive_values: parsePositiveValues(registerForm.positive_values),
        event_definition: registerForm.event_definition,
        time_window_hours: Number(registerForm.time_window_hours || 24),
        threshold: parseNullableNumber(registerForm.threshold)
      }
    }
    const { data } = await researchRegisterDataset(payload)
    manifest.value = data
    splitManifest.value = null
    applyManifestToForms(data)
    toast.success(rw('registerSuccess', { id: data.dataset_id }))
  } catch (error) {
    toast.error(getErrorMessage(error, rw('errorRegisterDataset')))
  } finally {
    busy.register = false
  }
}

const loadDataset = async () => {
  if (!datasetQueryId.value) return
  busy.loadDataset = true
  try {
    const { data } = await researchGetDataset(datasetQueryId.value)
    manifest.value = data
    applyManifestToForms(data)
    toast.success(rw('loadedManifest', { id: data.dataset_id }))
  } catch (error) {
    toast.error(getErrorMessage(error, rw('errorQueryDataset')))
  } finally {
    busy.loadDataset = false
  }
}

const splitDataset = async () => {
  if (!targetDatasetId.value) return
  busy.split = true
  try {
    const payload = {
      strategy: splitForm.strategy,
      train_ratio: Number(splitForm.train_ratio),
      val_ratio: Number(splitForm.val_ratio),
      test_ratio: Number(splitForm.test_ratio),
      seed: Number(splitForm.seed),
      time_column: splitForm.time_column || null,
      borehole_column: splitForm.borehole_column || null
    }
    const { data } = await researchSplitDataset(targetDatasetId.value, payload)
    splitManifest.value = data
    experimentForm.split_id = data.split_id || experimentForm.split_id
    toast[hasLeakage.value ? 'warning' : 'success'](
      hasLeakage.value ? rw('splitWithLeakage') : rw('splitSuccess', { id: data.split_id })
    )
  } catch (error) {
    toast.error(getErrorMessage(error, rw('errorSplitDataset')))
  } finally {
    busy.split = false
  }
}

const runExperiment = async () => {
  busy.runExperiment = true
  try {
    const payload = {
      dataset_id: experimentForm.dataset_id,
      dataset_version: experimentForm.dataset_version,
      split_id: experimentForm.split_id || null,
      experiment_name: experimentForm.experiment_name,
      model_type: experimentForm.model_type,
      target_label_column: experimentForm.target_label_column || null,
      metrics: parseList(experimentForm.metrics),
      seed: Number(experimentForm.seed)
    }
    const { data } = await researchRunExperiment(payload)
    experimentResult.value = data
    loadedResult.value = data
    resultQueryExpId.value = data.exp_id
    syncRouteExpId(data.exp_id)
    artifacts.value = []
    toast.success(rw('experimentDone', { id: data.exp_id }))
  } catch (error) {
    toast.error(getErrorMessage(error, rw('errorRunExperiment')))
  } finally {
    busy.runExperiment = false
  }
}

const loadTemplates = async () => {
  busy.loadTemplates = true
  try {
    const { data } = await researchListExperimentTemplates()
    templates.value = data?.templates || {}
    if (!selectedTemplate.value && templateNames.value.length > 0) {
      selectedTemplate.value = templateNames.value[0]
    }
  } catch (error) {
    toast.error(getErrorMessage(error, rw('errorLoadTemplates')))
  } finally {
    busy.loadTemplates = false
  }
}

const runSuite = async () => {
  if (!selectedTemplate.value) return
  busy.runSuite = true
  try {
    const payload = {
      template_name: selectedTemplate.value,
      dataset_id: experimentForm.dataset_id,
      dataset_version: experimentForm.dataset_version,
      split_id: experimentForm.split_id,
      seed: Number(experimentForm.seed)
    }
    const { data } = await researchRunExperimentSuite(payload)
    suiteResult.value = data
    const firstExpId = data?.runs?.[0]?.exp_id
    if (firstExpId) {
      resultQueryExpId.value = firstExpId
      syncRouteExpId(firstExpId)
    }
    toast.success(rw('templateRunDone', { id: data.suite_id }))
  } catch (error) {
    toast.error(getErrorMessage(error, rw('errorRunTemplateExperiment')))
  } finally {
    busy.runSuite = false
  }
}

const loadExperimentResult = async () => {
  if (!resultQueryExpId.value) return
  busy.loadResult = true
  try {
    const { data } = await researchGetExperiment(resultQueryExpId.value)
    loadedResult.value = data
    syncRouteExpId(data.exp_id)
    toast.success(rw('loadedResult', { id: data.exp_id }))
  } catch (error) {
    toast.error(getErrorMessage(error, rw('errorQueryExperimentResult')))
  } finally {
    busy.loadResult = false
  }
}

const loadArtifacts = async () => {
  if (!resultQueryExpId.value) return
  busy.loadArtifacts = true
  try {
    const { data } = await researchGetArtifacts(resultQueryExpId.value)
    artifacts.value = data?.artifacts || []
    toast.success(rw('loadedArtifacts', { count: artifacts.value.length }))
  } catch (error) {
    toast.error(getErrorMessage(error, rw('errorQueryArtifacts')))
  } finally {
    busy.loadArtifacts = false
  }
}

const downloadArtifact = async (item) => {
  const expId = resultQueryExpId.value || displayResult.value?.exp_id
  const artifactName = item?.name
  if (!expId || !artifactName) return
  busy.downloadArtifact = true
  downloadingArtifactName.value = artifactName
  try {
    const response = await researchDownloadArtifact(expId, artifactName)
    const filename = parseFilenameFromHeader(response?.headers?.['content-disposition'], artifactName)
    saveBlob(response.data, filename)
    toast.success(rw('downloadedFile', { filename }))
  } catch (error) {
    toast.error(getErrorMessage(error, rw('errorDownloadArtifact')))
  } finally {
    busy.downloadArtifact = false
    downloadingArtifactName.value = ''
  }
}

const loadComparison = async () => {
  const expIds = parseFlexibleList(compareExpIdsText.value)
  if (!expIds.length) {
    toast.warning(rw('warnNeedOneExpId'))
    return
  }
  busy.compare = true
  try {
    const settled = await Promise.allSettled(expIds.map((expId) => researchGetExperiment(expId)))
    const okRows = []
    const failed = []
    settled.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value?.data) {
        okRows.push(result.value.data)
      } else {
        failed.push(expIds[index])
      }
    })
    comparisonRows.value = okRows
    if (okRows.length > 0) {
      loadedResult.value = okRows[0]
      resultQueryExpId.value = okRows[0].exp_id
      syncRouteExpId(okRows[0].exp_id)
    }
    if (failed.length > 0) {
      toast.warning(rw('warnPartialFailed', { failed: failed.join(', ') }))
    }
    if (okRows.length > 0) {
      toast.success(rw('comparisonLoaded', { count: okRows.length }))
    } else {
      toast.error(rw('noValidExperimentResult'))
    }
  } catch (error) {
    toast.error(getErrorMessage(error, rw('errorLoadComparison')))
  } finally {
    busy.compare = false
  }
}

const exportComparisonCsv = () => {
  if (!comparisonRows.value.length) return
  const blob = new Blob([buildComparisonCsvText(comparisonRows.value)], { type: 'text/csv;charset=utf-8;' })
  saveBlob(blob, `research_comparison_${safeStamp()}.csv`)
  toast.success(rw('comparisonCsvExported'))
}

const exportComparisonJson = () => {
  if (!comparisonRows.value.length) return
  const payload = {
    exported_at: new Date().toISOString(),
    comparison_metric_order: comparisonMetricOrder,
    rows: comparisonRows.value
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' })
  saveBlob(blob, `research_comparison_${safeStamp()}.json`)
  toast.success(rw('comparisonJsonExported'))
}

const exportEvidenceBundle = async () => {
  busy.exportEvidence = true
  try {
    const JSZip = await getJSZipCtor()
    const zip = new JSZip()
    const stamp = safeStamp()
    const expId = resultQueryExpId.value || displayResult.value?.exp_id || ''

    const readmeLines = [
      '# Research Evidence Bundle',
      '',
      `exported_at: ${new Date().toISOString()}`,
      `dataset_id: ${manifest.value?.dataset_id || '-'}`,
      `dataset_version: ${manifest.value?.dataset_version || '-'}`,
      `split_id: ${splitManifest.value?.split_id || displayResult.value?.split_id || '-'}`,
      `primary_exp_id: ${expId || '-'}`,
      '',
      '包含内容:',
      '- manifests/dataset_manifest.json',
      '- manifests/dataset_quality_report.json',
      '- manifests/split_manifest.json',
      '- results/latest_result.json',
      '- results/suite_result.json',
      '- methods/methods.md',
      '- comparison/*.json|csv',
      '- figures/*.svg',
      '- artifacts/index.json (和可下载产物)'
    ]
    zip.file('README.md', readmeLines.join('\n'))
    zip.file('methods/methods.md', buildMethodsMarkdown())

    if (manifest.value) {
      zip.file('manifests/dataset_manifest.json', JSON.stringify(manifest.value, null, 2))
      if (manifest.value?.quality_report) {
        zip.file('manifests/dataset_quality_report.json', JSON.stringify(manifest.value.quality_report, null, 2))
      }
    }
    if (splitManifest.value) zip.file('manifests/split_manifest.json', JSON.stringify(splitManifest.value, null, 2))
    if (displayResult.value) zip.file('results/latest_result.json', JSON.stringify(displayResult.value, null, 2))
    if (suiteResult.value) zip.file('results/suite_result.json', JSON.stringify(suiteResult.value, null, 2))

    if (comparisonRows.value.length) {
      zip.file('comparison/comparison_rows.json', JSON.stringify(comparisonRows.value, null, 2))
      zip.file('comparison/comparison_rows.csv', buildComparisonCsvText(comparisonRows.value))
    }
    if (comparisonModelRows.value.length) {
      zip.file('comparison/model_summary.json', JSON.stringify(comparisonModelRows.value, null, 2))
      zip.file('comparison/model_summary.csv', buildModelSummaryCsvText(comparisonModelRows.value))
    }
    if (comparisonChampionRows.value.length) {
      zip.file('comparison/champions.json', JSON.stringify(comparisonChampionRows.value, null, 2))
    }
    if (comparisonPointChart.value) {
      zip.file('comparison/point_chart_data.json', JSON.stringify(comparisonPointChart.value.rows, null, 2))
      const pointSvg = buildComparisonPointChartSvg()
      if (pointSvg) zip.file('figures/comparison_point_chart.svg', pointSvg)
    }
    if (comparisonModelBarChart.value) {
      zip.file('comparison/model_bar_chart_data.json', JSON.stringify(comparisonModelBarChart.value.rows, null, 2))
      const barSvg = buildComparisonModelBarSvg()
      if (barSvg) zip.file('figures/model_summary_bar.svg', barSvg)
    }

    zip.file('artifacts/index.json', JSON.stringify(artifacts.value || [], null, 2))

    const downloaded = []
    const failed = []
    if (expId && artifacts.value.length) {
      for (const artifact of artifacts.value) {
        try {
          const response = await researchDownloadArtifact(expId, artifact.name)
          zip.file(`artifacts/files/${artifact.name}`, response.data)
          downloaded.push(artifact.name)
        } catch {
          failed.push(artifact.name)
        }
      }
    }
    zip.file('artifacts/download_report.json', JSON.stringify({
      exp_id: expId,
      requested: artifacts.value.map((item) => item.name),
      downloaded,
      failed
    }, null, 2))

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    })
    saveBlob(blob, `research_evidence_bundle_${stamp}.zip`)
    if (failed.length) {
      toast.warning(rw('evidenceExportedWithFailures', { count: failed.length }))
    } else {
      toast.success(rw('evidenceZipExported'))
    }
  } catch (error) {
    toast.error(getErrorMessage(error, rw('errorExportEvidenceBundle')))
  } finally {
    busy.exportEvidence = false
  }
}

onMounted(async () => {
  await loadTemplates()
  await bootstrapExpFromRoute()
})
</script>

<style scoped>
/* ============================================
   科研工作台 - 工作流布局样式
   ============================================ */

.research-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  padding-bottom: var(--spacing-3);
}

.card {
  background: var(--color-bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-sm);
}

/* Workflow Status Pills */
.workflow-status {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.workflow-status .status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: var(--color-bg-subtle);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.workflow-status .status-pill .step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--text-tertiary);
  color: white;
  font-size: 10px;
  font-weight: 600;
}

.workflow-status .status-pill.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.workflow-status .status-pill.active .step-num {
  background: var(--color-primary);
}

.workflow-status .status-pill.complete {
  background: #ecfdf3;
  color: #16a34a;
  border-color: #86efac;
}

.workflow-status .status-pill.complete .step-num {
  background: #16a34a;
}

/* Workflow Progress Bar */
.workflow-progress {
  margin-bottom: var(--spacing-5);
}

.progress-track {
  position: relative;
  height: 6px;
  background: var(--color-bg-subtle);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: var(--spacing-2);
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: 3px;
  transition: width 0.5s ease-out;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-tertiary);
}

.progress-labels span.active {
  color: var(--color-primary);
  font-weight: 500;
}

/* Workflow Steps */
.workflow-step {
  animation: step-fade-in 0.3s ease-out;
}

@keyframes step-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-fade-enter-active,
.step-fade-leave-active {
  transition: all 0.3s ease;
}

.step-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.step-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.step-fade-enter-to,
.step-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* Step Header */
.step-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-4);
}

.step-info h2 {
  margin: 0 0 var(--spacing-1) 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.step-info p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.step-status .status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.step-status .status-badge.ok {
  background: #ecfdf3;
  color: #16a34a;
}

.step-status .status-badge.idle {
  background: var(--color-bg-subtle);
  color: var(--text-tertiary);
}

/* Panel Main */
.panel-main {
  padding: var(--spacing-6);
}

/* Step Actions */
.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--border-color);
}

/* Success Card */
.success-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border: 1px solid #86efac;
  border-radius: var(--radius-md);
  margin-top: var(--spacing-4);
}

.success-icon {
  width: 24px;
  height: 24px;
  color: #16a34a;
  flex-shrink: 0;
}

.success-card h3 {
  margin: 0 0 var(--spacing-1) 0;
  font-size: 14px;
  font-weight: 600;
  color: #16a34a;
}

.success-card p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

/* Original styles kept below */
.grid {
  display: grid;
  gap: var(--spacing-5);
}

.grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* Status Pills in Toolbar */
.status-pills {
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-xs);
  border: 1px solid var(--border-color);
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
}

.status-pill.ok {
  background: var(--color-success-bg);
  color: var(--color-success-text);
  border-color: var(--color-success-border);
}

.status-pill.idle {
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
}

.status-pill.info {
  background: var(--color-info-bg);
  color: var(--color-info-text);
  border-color: var(--color-info-border);
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: var(--spacing-1) var(--spacing-3);
  font-size: 11px;
  border: 1px solid var(--border-color-light);
  background: #fff;
  color: var(--text-secondary);
}

.status-pill.ok {
  background: #ecfdf5;
  color: #065f46;
  border-color: #a7f3d0;
}

.status-pill.idle {
  background: #f8fafc;
  color: #64748b;
}

.status-pill.info {
  background: #ecfeff;
  color: #0e7490;
  border-color: #a5f3fc;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-2);
  align-items: baseline;
}

.panel-head h2 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.tip {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-3);
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.form-grid label.full {
  grid-column: 1 / -1;
}

.textarea {
  resize: vertical;
}

.lookup-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: var(--spacing-2);
  align-items: center;
}

/* Manifest Stats with StatCard */
.manifest-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-2);
}

.summary-grid div {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);
  padding: var(--spacing-2) var(--spacing-3);
}

.summary-grid span {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.summary-grid strong {
  display: block;
  margin-top: var(--spacing-1);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.split-summary {
  display: grid;
  gap: var(--spacing-2);
}

.leakage {
  border: 1px solid;
  border-radius: var(--radius-lg);
  padding: var(--spacing-2) var(--spacing-3);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
}

.leakage.safe {
  background: var(--color-success-bg);
  border-color: var(--color-success-border);
  color: var(--color-success-text);
}

.leakage.warn {
  background: var(--color-warning-bg);
  border-color: var(--color-warning-border);
  color: var(--color-warning-text);
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-1);
}

.actions.actions-split {
  justify-content: flex-start;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.compare-label {
  display: grid;
  gap: var(--spacing-1);
  font-size: 12px;
  color: #475569;
}

.viz-controls {
  display: flex;
  justify-content: flex-start;
}

.viz-controls label {
  display: inline-grid;
  gap: var(--spacing-1);
  font-size: 12px;
  color: #475569;
}

.viz-controls select {
  min-width: 180px;
}

.btn-inline {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: 12px;
}

.template-preview {
  max-height: 220px;
  overflow: auto;
}

.suite-summary {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-3);
}

.result-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);
  padding: var(--spacing-3);
}

.result-card h3 {
  margin: 0 0 var(--spacing-2);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-2);
}

.metric-item {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-2);
  background: var(--color-bg-tertiary);
}

.metric-item span {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.metric-item b {
  display: block;
  margin-top: var(--spacing-1);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.best {
  display: inline-flex;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-md);
  background: var(--color-success-bg);
  border: 1px solid var(--color-success-border);
  color: var(--color-success-text);
  font-weight: var(--font-weight-bold);
}

.compare-svg {
  width: 100%;
  height: 280px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);
}

.axis-label {
  font-size: var(--font-size-xs);
  fill: var(--color-text-secondary);
}

.axis-label.left {
  fill: var(--color-text-primary);
}

.meta-row {
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: wrap;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2);
}

.trace-row {
  display: grid;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-3);
  color: var(--color-text-secondary);
}

.trace-row code {
  padding: var(--spacing-2) var(--spacing-2);
  border-radius: var(--radius-md);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--border-color);
  color: var(--color-text-primary);
  word-break: break-all;
}

@media (max-width: 1440px) {
  .status-pills {
    flex-wrap: wrap;
  }

  .lookup-row {
    grid-template-columns: minmax(0, 1fr) auto;
  }
}

@media (max-width: 1200px) {
  .result-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .grid-2,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .lookup-row {
    grid-template-columns: 1fr;
  }

  .status-pills {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .actions {
    justify-content: flex-start;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }

  .manifest-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .card {
    padding: var(--spacing-3);
  }

  .panel-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .compare-svg {
    height: 240px;
  }
}

@media (max-width: 375px) {
  .card {
    padding: var(--spacing-2);
  }

  .status-pill {
    width: 100%;
    justify-content: flex-start;
  }

  .compare-svg {
    height: 210px;
  }
}
</style>
