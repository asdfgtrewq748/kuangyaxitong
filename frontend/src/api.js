import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001'

const api = axios.create({
  baseURL: API_BASE_URL
})

// LRU Cache for API responses (server-cache-lru pattern)
class ApiCache {
  constructor(maxSize = 50) {
    this.cache = new Map()
    this.pending = new Map()
    this.maxSize = maxSize
  }

  normalizeParams(value) {
    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeParams(item))
    }
    if (value && typeof value === 'object') {
      return Object.keys(value)
        .sort()
        .reduce((acc, key) => {
          acc[key] = this.normalizeParams(value[key])
          return acc
        }, {})
    }
    return value
  }

  generateKey(url, params) {
    const normalizedParams = this.normalizeParams(params || {})
    return `${url}?${JSON.stringify(normalizedParams)}`
  }

  get(url, params) {
    const key = this.generateKey(url, params)
    const entry = this.cache.get(key)
    if (entry) {
      // Update access time for LRU
      entry.lastAccess = Date.now()
      return entry.data
    }
    return null
  }

  set(url, params, data) {
    const key = this.generateKey(url, params)

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      let oldestKey = null
      let oldestTime = Infinity
      for (const [k, v] of this.cache.entries()) {
        if (v.lastAccess < oldestTime) {
          oldestTime = v.lastAccess
          oldestKey = k
        }
      }
      if (oldestKey) this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      data,
      lastAccess: Date.now()
    })
  }

  clear() {
    this.cache.clear()
    this.pending.clear()
  }

  // Cache GET requests for static data
  cachedGet(url, config = {}, options = {}) {
    const params = config.params || {}
    const bypassCache = Boolean(options?.bypassCache)
    const key = this.generateKey(url, params)

    if (!bypassCache) {
      const cached = this.get(url, params)
      if (cached) {
        return Promise.resolve({ data: cached })
      }

      const pendingRequest = this.pending.get(key)
      if (pendingRequest) {
        return pendingRequest
      }
    }

    const requestPromise = api.get(url, config)
      .then((response) => {
        if (!bypassCache) {
          this.set(url, params, response.data)
        }
        return response
      })
      .finally(() => {
        this.pending.delete(key)
      })

    if (!bypassCache) {
      this.pending.set(key, requestPromise)
    }

    return requestPromise
  }
}

// Create cache instance
const apiCache = new ApiCache(100)

// Clear cache on certain actions
export const clearApiCache = () => apiCache.clear()

export const scanBoreholes = () => api.get('/boreholes/scan')
export const previewBorehole = (file, limit = 20) => api.get('/boreholes/preview', { params: { file, limit } })
export const fixEncoding = () => api.post('/boreholes/fix-encoding')
export const uploadBoreholes = (files) => {
  const form = new FormData()
  files.forEach((f) => form.append('files', f))
  return api.post('/boreholes/upload', form)
}
export const interpolateField = (field, method, gridSize) =>
  api.get('/interpolate/field', { params: { field, method, grid_size: gridSize } })
export const compareInterpolate = (field, gridSize) =>
  api.get('/interpolate/compare', { params: { field, grid_size: gridSize } })
export const recommendInterpolate = (field) =>
  api.get('/interpolate/recommend', { params: { field } })
export const pressureIndexGrid = (method, gridSize, wElastic, wDensity, wTensile) =>
  api.get('/pressure/index/grid', {
    params: {
      method,
      grid_size: gridSize,
      elastic_modulus: wElastic,
      density: wDensity,
      tensile_strength: wTensile
    }
  })
export const pressureSteps = (model, h, q, t, s) =>
  api.get('/pressure/steps', { params: { model, h, q, t, s } })
export const runPipeline = (field, method, gridSize, fixEncoding) =>
  api.post('/pipeline/run', null, { params: { field, method, grid_size: gridSize, fix_encoding: fixEncoding } })
export const exportInterpolation = (field, method, gridSize) =>
  api.get('/export/interpolation', { params: { field, method, grid_size: gridSize }, responseType: 'blob' })
export const exportIndex = (method, gridSize) =>
  api.get('/export/index', { params: { method, grid_size: gridSize }, responseType: 'blob' })
export const pressureIndexWorkfaces = (params) =>
  api.get('/pressure/index/workfaces', { params })
export const exportPressureIndexWorkfaces = (params) =>
  api.get('/export/pressure-index-workfaces', { params, responseType: 'blob' })
export const summaryIndex = (method, gridSize) =>
  api.get('/summary/index', { params: { method, grid_size: gridSize } })
export const summaryIndexWorkfaces = (params) =>
  api.get('/summary/index-workfaces', { params })
export const summarySteps = (model, target, gridSize) =>
  api.get('/summary/steps', { params: { model, target, grid_size: gridSize } })
export const summaryStepsWorkfaces = (params) =>
  api.get('/summary/steps-workfaces', { params })
export const pressureStepsBatch = (model) =>
  api.get('/pressure/steps/boreholes', { params: { model } })
export const exportPressureSteps = (model) =>
  api.get('/export/pressure-steps', { params: { model }, responseType: 'blob' })
export const pressureStepsGrid = (model, target, hMode, qMode, gridSize, defaultQ) =>
  api.get('/pressure/steps/grid', {
    params: { model, target, h_mode: hMode, q_mode: qMode, grid_size: gridSize, default_q: defaultQ }
  })
export const exportPressureStepsGrid = (model, target, hMode, qMode, gridSize, defaultQ) =>
  api.get('/export/pressure-steps-grid', {
    params: { model, target, h_mode: hMode, q_mode: qMode, grid_size: gridSize, default_q: defaultQ },
    responseType: 'blob'
  })
export const pressureStepsWorkfaces = (params) =>
  api.get('/pressure/steps/workfaces', { params })
export const exportPressureStepsWorkfaces = (params) =>
  api.get('/export/pressure-steps-workfaces', { params, responseType: 'blob' })

// Coal Seam Interpolation APIs
// Use cached GET for static data (client-swr-dedup pattern)
export const getCoalSeams = () => apiCache.cachedGet('/seams/list')
export const getSeamStats = (seamName) =>
  api.get('/seams/stats', { params: { seam_name: seamName } })
export const interpolateSeam = (seamName, property, method = 'idw', gridSize = 100, contourLevels = 10, includeContours = true) =>
  api.get('/seams/interpolate', {
    params: {
      seam_name: seamName,
      property,
      method,
      grid_size: gridSize,
      contour_levels: contourLevels,
      include_contours: includeContours
    }
  })
export const getSeamOverburden = (seamName, borehole = null) =>
  api.get('/seams/overburden', { params: { seam_name: seamName, borehole } })
export const compareSeamMethods = (seamName, property = 'thickness', gridSize = 100) =>
  api.get('/seams/compare', { params: { seam_name: seamName, property, grid_size: gridSize } })
export const exportSeamInterpolation = (seamName, property, method, gridSize) =>
  api.get('/export/seam-interpolation', {
    params: { seam_name: seamName, property, method, grid_size: gridSize },
    responseType: 'blob'
  })
export const getSeamContourImages = (
  seamName,
  method = 'kriging',
  gridSize = 80,
  numLevels = 12,
  dpi = 150,
  smoothSigma = 1.0,
  options = {}
) => {
  const config = {
    params: {
      seam_name: seamName,
      method,
      grid_size: gridSize,
      num_levels: numLevels,
      dpi,
      smooth_sigma: smoothSigma
    }
  }

  if (options?.forceRefresh) {
    return api.get('/seams/contour-images', config)
  }

  return apiCache.cachedGet('/seams/contour-images', config)
}

// MPI (矿压影响指标) APIs
export const mpiCalculate = (point, weights = null, config = null) =>
  api.post('/api/mpi/calculate', { point, weights, config })
export const mpiBatch = (points, weights = null, config = null) =>
  api.post('/api/mpi/batch', { points, weights, config })
export const mpiInterpolate = (points, resolution = 50, method = 'idw', weights = null, bounds = null) =>
  api.post('/api/mpi/interpolate', { points, resolution, method, weights, bounds })
export const mpiKeyLayers = (strata, config = null) =>
  api.post('/api/mpi/key-layers', { strata, config })
export const getMpiWeights = () => api.get('/api/mpi/weights')
export const setMpiWeights = (weights) => api.post('/api/mpi/weights', weights)
export const getMpiConfig = () => api.get('/api/mpi/config')
export const setMpiConfig = (params) => api.post('/api/mpi/config', null, { params })
export const parseMpiWorkfaces = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/api/mpi/workfaces/parse', form)
}
export const mpiHeatmapImage = (payload) => api.post('/api/mpi/heatmap-image', payload)

// Rock Params APIs - use cached GET for reference data
export const getRockParams = (lithology, useSynonyms = true, includeDefault = true) =>
  apiCache.cachedGet('/api/rock-params/query', {
    params: { lithology, use_synonyms: useSynonyms, include_default: includeDefault }
  })
export const getRockParamsStats = () => api.get('/api/rock-params/stats')
export const getLithologies = (standardOnly = false) =>
  api.get('/api/rock-params/lithologies', { params: { standard_only: standardOnly } })
export const getMines = () => api.get('/api/rock-params/mines')
export const getLithologySynonyms = () => api.get('/api/rock-params/synonyms')
export const standardizeLithology = (lithology) =>
  api.get('/api/rock-params/standardize', { params: { lithology } })
export const estimateRockParams = (lithology, params = {}) =>
  api.post('/api/rock-params/estimate', null, { params: { lithology, ...params } })
export const getDefaultRockParams = (lithology) =>
  api.get(`/api/rock-params/default/${lithology}`)

// Algorithm Validation APIs
export const validationDatasets = () =>
  api.get('/api/algorithm-validation/datasets')
export const validationRun = (payload) =>
  api.post('/api/algorithm-validation/run', payload)
export const validationResult = (runId) =>
  api.get(`/api/algorithm-validation/result/${runId}`)
export const validationEvaluate = (payload) =>
  api.post('/api/algorithm-validation/evaluate', payload)
export const validationExport = (runId) =>
  api.get(`/api/algorithm-validation/export/${runId}`, { responseType: 'blob' })
const VALIDATION_SPATIAL_MODEL_REV = 'advanced_v2_asi_calibrated_v1'

export const validationSpatialOverview = (seamName = '16-3煤', resolution = 50, method = 'idw', weights = null) => {
  const params = {
    seam_name: seamName,
    resolution,
    method,
    model_rev: VALIDATION_SPATIAL_MODEL_REV
  }
  if (weights && typeof weights === 'object') {
    params.weights = JSON.stringify(weights)
  }
  return apiCache.cachedGet('/api/algorithm-validation/spatial-overview', { params })
}

// Research Reproducibility APIs
export const researchRegisterDataset = (payload) =>
  api.post('/api/research/dataset/register', payload)
export const researchGetDataset = (datasetId) =>
  api.get(`/api/research/dataset/${datasetId}`)
export const researchSplitDataset = (datasetId, payload) =>
  api.post(`/api/research/dataset/${datasetId}/split`, payload)
export const researchRunExperiment = (payload) =>
  api.post('/api/research/experiments/run', payload)
export const researchGetExperiment = (expId) =>
  api.get(`/api/research/experiments/${expId}`)
export const researchGetArtifacts = (expId) =>
  api.get(`/api/research/experiments/${expId}/artifacts`)
export const researchDownloadArtifact = (expId, artifactName) =>
  api.get(`/api/research/experiments/${expId}/artifacts/${encodeURIComponent(artifactName)}`, { responseType: 'blob' })
export const researchListExperimentTemplates = () =>
  api.get('/api/research/experiments/templates')
export const researchRunExperimentSuite = (payload) =>
  api.post('/api/research/experiments/run-suite', payload)
export const researchPapersOverview = () =>
  api.get('/api/research/papers/overview')
export const researchDownloadPaperAsset = (paperId, kind) =>
  api.get(`/api/research/papers/${paperId}/download`, { params: { kind }, responseType: 'blob' })
export const researchDownloadPaperBundle = (paperId) =>
  api.get(`/api/research/papers/${paperId}/bundle`, { responseType: 'blob' })
export const researchExperimentLeaderboard = (metric = 'auc', limit = 20) =>
  api.get('/api/research/leaderboard/experiments', { params: { metric, limit } })
