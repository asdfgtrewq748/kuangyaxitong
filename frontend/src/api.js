import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8001'
})

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
export const getCoalSeams = () => api.get('/seams/list')
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
export const getSeamContourImages = (seamName, method = 'kriging', gridSize = 80, numLevels = 12, dpi = 150, smoothSigma = 1.0) =>
  api.get('/seams/contour-images', {
    params: {
      seam_name: seamName,
      method,
      grid_size: gridSize,
      num_levels: numLevels,
      dpi,
      smooth_sigma: smoothSigma
    }
  })

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

// Rock Params APIs
export const getRockParams = (lithology, useSynonyms = true, includeDefault = true) =>
  api.get('/api/rock-params/query', {
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
