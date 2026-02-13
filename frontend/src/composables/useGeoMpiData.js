import { onMounted, ref, watch } from 'vue'
import {
  getCoalSeams,
  getGeomodelJob,
  getRockParams,
  getSeamOverburden,
  listGeomodelArtifacts,
  mpiInterpolateGeo,
} from '../api'

const METRIC_META = [
  { key: 'mpi', title: 'MPI', note: 'Composite index' },
  { key: 'rsi', title: 'RSI', note: 'Roof stability' },
  { key: 'bri', title: 'BRI', note: 'Burst risk' },
  { key: 'asi', title: 'ASI', note: 'Abutment stress' },
]

const EMPTY_TILE_HINT = 'No grid data'

const createEmptyTiles = () => METRIC_META.map((meta) => ({
  ...meta,
  grid: [],
  stats: null,
  placeholder: EMPTY_TILE_HINT,
}))

const pickSeamNames = (payload) => {
  const rawItems = payload?.seams || []
  return rawItems
    .map((item) => {
      if (typeof item === 'string') return item.trim()
      return String(item?.name || '').trim()
    })
    .filter(Boolean)
}

const buildDeltaGrid = (geoGrid, baselineGrid) => {
  if (!Array.isArray(geoGrid) || !Array.isArray(baselineGrid)) return []
  if (geoGrid.length === 0 || baselineGrid.length === 0) return []
  const rows = Math.min(geoGrid.length, baselineGrid.length)
  return Array.from({ length: rows }, (_, rowIdx) => {
    const geoRow = Array.isArray(geoGrid[rowIdx]) ? geoGrid[rowIdx] : []
    const baseRow = Array.isArray(baselineGrid[rowIdx]) ? baselineGrid[rowIdx] : []
    const cols = Math.min(geoRow.length, baseRow.length)
    return Array.from({ length: cols }, (_, colIdx) => {
      const g = Number(geoRow[colIdx])
      const b = Number(baseRow[colIdx])
      if (!Number.isFinite(g) || !Number.isFinite(b)) return null
      return g - b
    })
  })
}

const statsFromGrid = (grid) => {
  const values = []
  for (const row of grid || []) {
    for (const val of row || []) {
      const n = Number(val)
      if (Number.isFinite(n)) values.push(n)
    }
  }
  if (!values.length) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length
  const variance = values.reduce((sum, v) => sum + ((v - mean) ** 2), 0) / values.length
  return {
    min,
    max,
    mean,
    std: Math.sqrt(variance),
  }
}

const selectModePayload = (data, mode) => {
  const modeKey = mode === 'geo-aware' ? 'geology_aware' : mode
  const componentGrids = data?.component_grids || {}
  const componentStats = data?.component_statistics || {}

  if (componentGrids?.[modeKey]) {
    return {
      grids: componentGrids[modeKey],
      stats: componentStats?.[modeKey] || {},
    }
  }

  if (mode === 'baseline') {
    const grid = data?.baseline_grid || []
    return {
      grids: { mpi: grid },
      stats: { mpi: data?.baseline_statistics || statsFromGrid(grid) },
    }
  }

  if (mode === 'delta') {
    const delta = buildDeltaGrid(data?.geology_aware_grid, data?.baseline_grid)
    return {
      grids: { mpi: delta },
      stats: { mpi: statsFromGrid(delta) },
    }
  }

  const geoGrid = data?.geology_aware_grid || []
  return {
    grids: { mpi: geoGrid },
    stats: { mpi: data?.geology_aware_statistics || statsFromGrid(geoGrid) },
  }
}

export const useGeoMpiData = (state) => {
  const metricTiles = ref(createEmptyTiles())
  const loadingSeams = ref(false)
  const loadingMatrix = ref(false)
  const error = ref('')
  const lastUpdated = ref('')
  const algorithmMode = ref('')
  const fallbackUsed = ref(false)
  const featureSourceMode = ref('')
  const latestGeoPayload = ref(null)
  const geomodelStatus = ref('')
  const geomodelQuality = ref(null)
  const geomodelArtifacts = ref([])
  const geomodelError = ref('')

  const layerParamsCache = new Map()

  const resetTiles = () => {
    metricTiles.value = createEmptyTiles()
  }

  const applyModeFromPayload = () => {
    const payload = latestGeoPayload.value
    if (!payload) {
      resetTiles()
      return
    }
    const selectedMode = String(state.mode.value || 'baseline')
    const modePayload = selectModePayload(payload, selectedMode)
    metricTiles.value = METRIC_META.map((meta) => {
      const grid = modePayload?.grids?.[meta.key] || []
      const stats = modePayload?.stats?.[meta.key] || null
      return {
        ...meta,
        grid,
        stats,
        placeholder: Array.isArray(grid) && grid.length > 0 ? '' : EMPTY_TILE_HINT,
      }
    })
  }

  const loadSeams = async () => {
    loadingSeams.value = true
    error.value = ''
    try {
      const { data } = await getCoalSeams()
      state.setSeamOptions(pickSeamNames(data))
    } catch (err) {
      error.value = err?.response?.data?.detail || err?.message || 'Failed to load seams.'
      state.setSeamOptions([])
    } finally {
      loadingSeams.value = false
    }
  }

  const resetGeomodelContext = () => {
    geomodelStatus.value = ''
    geomodelQuality.value = null
    geomodelArtifacts.value = []
    geomodelError.value = ''
  }

  const loadGeomodelContext = async (jobId) => {
    const normalizedJobId = String(jobId || '').trim()
    if (!normalizedJobId) {
      resetGeomodelContext()
      return
    }

    geomodelError.value = ''
    try {
      const { data: job } = await getGeomodelJob(normalizedJobId)
      geomodelStatus.value = String(job?.status || '')
      geomodelQuality.value = job?.result_manifest?.quality_summary || null
      geomodelArtifacts.value = job?.result_manifest?.artifacts || []
      if (!geomodelArtifacts.value.length) {
        const { data: artResp } = await listGeomodelArtifacts(normalizedJobId)
        geomodelArtifacts.value = artResp?.artifacts || []
      }
    } catch (err) {
      geomodelStatus.value = 'unavailable'
      geomodelQuality.value = null
      geomodelArtifacts.value = []
      geomodelError.value = err?.response?.data?.detail || err?.message || 'Failed to load Geomodel context.'
    }
  }

  const getLayerParams = async (lithologyName) => {
    const key = String(lithologyName || '').trim()
    if (!key) return null
    if (layerParamsCache.has(key)) {
      return layerParamsCache.get(key)
    }
    try {
      const { data } = await getRockParams(key)
      layerParamsCache.set(key, data || null)
      return data || null
    } catch (err) {
      layerParamsCache.set(key, null)
      return null
    }
  }

  const buildPoints = async (boreholes, seamName) => {
    const result = []
    for (const borehole of boreholes || []) {
      const layers = borehole?.layers || []
      const seamLayer = layers.find((layer) => layer?.name === seamName)
      const strataLayers = layers.filter((layer) => layer?.name !== seamName)
      const strata = []

      for (const layer of strataLayers) {
        const params = await getLayerParams(layer?.name)
        strata.push({
          thickness: Number(layer?.thickness || 0),
          name: String(layer?.name || ''),
          density: params?.density,
          bulk_modulus: params?.bulk_modulus,
          shear_modulus: params?.shear_modulus,
          cohesion: params?.cohesion,
          friction_angle: params?.friction_angle,
          tensile_strength: params?.tensile_strength,
          compressive_strength: params?.compressive_strength,
          elastic_modulus: params?.elastic_modulus,
          poisson_ratio: params?.poisson_ratio,
        })
      }

      const burialDepth = Number(
        borehole?.seam_top_depth ?? borehole?.total_overburden_thickness ?? 0,
      )
      const seamThickness = Number(seamLayer?.thickness || 0)

      result.push({
        x: Number(borehole?.x),
        y: Number(borehole?.y),
        borehole: String(borehole?.name || ''),
        thickness: seamThickness,
        burial_depth: burialDepth,
        z_top: burialDepth,
        z_bottom: burialDepth + seamThickness,
        strata,
      })
    }

    return result.filter((item) => Number.isFinite(item.x) && Number.isFinite(item.y))
  }

  const refreshMatrix = async () => {
    loadingMatrix.value = true
    error.value = ''
    try {
      const seamName = String(state.seamName.value || '').trim()
      if (!seamName) {
        throw new Error('Please select a seam first.')
      }

      const { data: overburdenPayload } = await getSeamOverburden(seamName)
      const points = await buildPoints(overburdenPayload?.boreholes || [], seamName)
      if (points.length < 3) {
        throw new Error('At least 3 valid boreholes are required for interpolation.')
      }

      const payload = {
        points,
        resolution: Number(state.resolution.value),
        method: state.method.value,
        geomodel_job_id: state.geomodelJobId.value || null,
        include_baseline_grid: true,
        include_component_grids: true,
      }

      const { data } = await mpiInterpolateGeo(payload)
      latestGeoPayload.value = data
      applyModeFromPayload()

      algorithmMode.value = String(data?.algorithm_mode || '')
      fallbackUsed.value = Boolean(data?.fallback_used)
      featureSourceMode.value = String(data?.feature_trace?.source?.mode || '')
      await loadGeomodelContext(state.geomodelJobId.value)
      lastUpdated.value = new Date().toISOString()
    } catch (err) {
      latestGeoPayload.value = null
      resetTiles()
      error.value = err?.response?.data?.detail || err?.message || 'Failed to refresh spatial matrix.'
    } finally {
      loadingMatrix.value = false
    }
  }

  watch(
    () => state.mode.value,
    () => {
      if (!loadingMatrix.value) {
        applyModeFromPayload()
      }
    },
  )

  watch(
    () => state.geomodelJobId.value,
    async (value) => {
      if (!loadingMatrix.value) {
        await loadGeomodelContext(value)
      }
    },
  )

  onMounted(async () => {
    await loadSeams()
  })

  return {
    metricTiles,
    loadingSeams,
    loadingMatrix,
    error,
    lastUpdated,
    algorithmMode,
    fallbackUsed,
    featureSourceMode,
    latestGeoPayload,
    geomodelStatus,
    geomodelQuality,
    geomodelArtifacts,
    geomodelError,
    loadSeams,
    refreshMatrix,
  }
}
