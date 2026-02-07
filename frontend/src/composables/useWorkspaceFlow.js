import { computed, reactive, watch } from 'vue'

const STORAGE_KEY = 'kuangya_workspace_flow_v1'

const flowOrder = ['DataImport', 'Interpolation', 'AcademicAlgorithm', 'AlgorithmValidation', 'Report']

const defaultState = () => ({
  selectedSeam: '',
  updatedAt: '',
  steps: {
    DataImport: false,
    Interpolation: false,
    AcademicAlgorithm: false,
    MpiAlgorithm: false,
    PressureIndex: false,
    AlgorithmValidation: false,
    Report: false
  },
  metrics: {
    boreholes: 0,
    interpolationPoints: 0,
    pressureReady: false,
    validationReady: false,
    reportGeneratedAt: ''
  }
})

const workspaceState = reactive(defaultState())

const applyState = (source = {}) => {
  const safe = defaultState()
  workspaceState.selectedSeam = typeof source.selectedSeam === 'string' ? source.selectedSeam : safe.selectedSeam
  workspaceState.updatedAt = typeof source.updatedAt === 'string' ? source.updatedAt : safe.updatedAt
  workspaceState.steps = { ...safe.steps, ...(source.steps || {}) }
  workspaceState.metrics = { ...safe.metrics, ...(source.metrics || {}) }
}

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    applyState(JSON.parse(raw))
  } catch (_) {
    applyState()
  }
}

const persist = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceState))
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
    persist()
  },
  { deep: true }
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
