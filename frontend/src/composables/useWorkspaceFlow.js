import { computed, reactive, watch } from 'vue'

const STORAGE_KEY = 'kuangya_workspace_flow_v1'
const PERSIST_DEBOUNCE_MS = 120

const flowOrder = ['DataImport', 'Interpolation', 'AcademicAlgorithm', 'AlgorithmValidation', 'PressureAnalysis']

const defaultState = () => ({
  selectedSeam: '',
  updatedAt: '',
  steps: {
    DataImport: false,
    Interpolation: false,
    AcademicAlgorithm: false,
    AlgorithmValidation: false,
    PressureAnalysis: false
  },
  metrics: {
    boreholes: 0,
    interpolationPoints: 0,
    validationReady: false,
    pressureAnalysisVisited: false
  }
})

const workspaceState = reactive(defaultState())
let persistTimer = null

const pickKnownKeys = (safeObj, sourceObj) => {
  const input = sourceObj && typeof sourceObj === 'object' ? sourceObj : {}
  const result = {}
  for (const key of Object.keys(safeObj)) {
    result[key] = key in input ? input[key] : safeObj[key]
  }
  return result
}

const applyState = (source = {}) => {
  const safe = defaultState()
  workspaceState.selectedSeam = typeof source.selectedSeam === 'string' ? source.selectedSeam : safe.selectedSeam
  workspaceState.updatedAt = typeof source.updatedAt === 'string' ? source.updatedAt : safe.updatedAt

  const nextSteps = pickKnownKeys(safe.steps, source.steps)
  for (const key of Object.keys(nextSteps)) {
    nextSteps[key] = Boolean(nextSteps[key])
  }
  workspaceState.steps = nextSteps

  const nextMetrics = pickKnownKeys(safe.metrics, source.metrics)
  workspaceState.metrics = {
    ...nextMetrics,
    boreholes: Number(nextMetrics.boreholes) || 0,
    interpolationPoints: Number(nextMetrics.interpolationPoints) || 0,
    validationReady: Boolean(nextMetrics.validationReady),
    pressureAnalysisVisited: Boolean(nextMetrics.pressureAnalysisVisited)
  }
}

const loadState = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    applyState(JSON.parse(raw))
  } catch (_) {
    applyState()
  }
}

const persist = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceState))
  } catch (_) {
    // Ignore quota/security errors; in-memory state remains available.
  }
}

const schedulePersist = () => {
  if (persistTimer) clearTimeout(persistTimer)
  persistTimer = setTimeout(() => {
    persistTimer = null
    persist()
  }, PERSIST_DEBOUNCE_MS)
}

const markStepDone = (stepName, metrics = null) => {
  if (!Object.prototype.hasOwnProperty.call(workspaceState.steps, stepName)) return
  workspaceState.steps[stepName] = true
  if (metrics && typeof metrics === 'object') {
    workspaceState.metrics = { ...workspaceState.metrics, ...metrics }
  }
  workspaceState.updatedAt = new Date().toISOString()
}

const setSelectedSeam = (seamName) => {
  workspaceState.selectedSeam = typeof seamName === 'string' ? seamName : ''
  workspaceState.updatedAt = new Date().toISOString()
}

const resetFlow = () => {
  applyState()
  workspaceState.updatedAt = new Date().toISOString()
}

loadState()

watch(
  workspaceState,
  () => {
    schedulePersist()
  },
  { deep: true, flush: 'post' }
)

const completionRate = computed(() => {
  const done = flowOrder.filter((name) => workspaceState.steps[name]).length
  return Number((done / flowOrder.length).toFixed(2))
})

export const useWorkspaceFlow = () => ({
  flowOrder,
  workspaceState,
  completionRate,
  markStepDone,
  setSelectedSeam,
  resetFlow
})
