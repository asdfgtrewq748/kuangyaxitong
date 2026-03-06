const routeChunkMap = [
  ['src/views/DataImport.vue', 'route-data-import'],
  ['src/views/Interpolation.vue', 'route-interpolation'],
  ['src/views/MpiHeatmapPro.vue', 'route-mpi-heatmap-pro'],
  ['src/views/AcademicAlgorithm.vue', 'route-academic-algorithm'],
  ['src/views/AlgorithmValidation.vue', 'route-algorithm-validation'],
  ['src/views/ResearchWorkbench.vue', 'route-research-workbench'],
  ['src/views/GeoMpiStudio.vue', 'route-geo-mpi-studio'],
  ['src/views/Steps.vue', 'route-steps'],
  ['src/views/Report.vue', 'route-report'],
  ['src/views/GeomodelVisualization.vue', 'route-geomodel-visualization'],
  ['src/views/Scene3DPage.vue', 'route-scene3d']
]

const ECHARTS_PRESSURE_ENTRY = 'src/lib/echarts-pressure.js'
const ECHARTS_SCIENCE_ENTRY = 'src/lib/echarts-science.js'
const THREE_BASIC_ENTRY = 'src/lib/three-basic.js'
const THREE_FUSION_ENTRY = 'src/lib/three-fusion.js'

function detectEchartsBuckets(id, getModuleInfo, seen = new Set()) {
  if (!getModuleInfo || seen.has(id)) return new Set()
  seen.add(id)

  if (id.includes(ECHARTS_PRESSURE_ENTRY)) return new Set(['pressure'])
  if (id.includes(ECHARTS_SCIENCE_ENTRY)) return new Set(['science'])

  const info = getModuleInfo(id)
  if (!info) return new Set()

  const buckets = new Set()
  const parents = [...(info.importers || []), ...(info.dynamicImporters || [])]

  for (const parentId of parents) {
    if (parentId.includes(ECHARTS_PRESSURE_ENTRY)) {
      buckets.add('pressure')
      continue
    }
    if (parentId.includes(ECHARTS_SCIENCE_ENTRY)) {
      buckets.add('science')
      continue
    }

    const parentBuckets = detectEchartsBuckets(parentId, getModuleInfo, seen)
    for (const bucket of parentBuckets) buckets.add(bucket)
  }

  return buckets
}

function detectThreeBuckets(id, getModuleInfo, seen = new Set()) {
  if (!getModuleInfo || seen.has(id)) return new Set()
  seen.add(id)

  if (id.includes(THREE_BASIC_ENTRY)) return new Set(['basic'])
  if (id.includes(THREE_FUSION_ENTRY)) return new Set(['fusion'])

  const info = getModuleInfo(id)
  if (!info) return new Set()

  const buckets = new Set()
  const parents = [...(info.importers || []), ...(info.dynamicImporters || [])]

  for (const parentId of parents) {
    if (parentId.includes(THREE_BASIC_ENTRY)) {
      buckets.add('basic')
      continue
    }
    if (parentId.includes(THREE_FUSION_ENTRY)) {
      buckets.add('fusion')
      continue
    }

    const parentBuckets = detectThreeBuckets(parentId, getModuleInfo, seen)
    for (const bucket of parentBuckets) buckets.add(bucket)
  }

  return buckets
}

export function resolveManualChunk(id, meta = {}) {
  const normalizedId = String(id || '').replace(/\\/g, '/')

  const routeChunk = routeChunkMap.find(([pattern]) => normalizedId.includes(pattern))
  if (routeChunk) return routeChunk[1]

  if (normalizedId.includes(ECHARTS_PRESSURE_ENTRY)) return 'echarts-pressure'
  if (normalizedId.includes(ECHARTS_SCIENCE_ENTRY)) return 'echarts-science'
  if (normalizedId.includes(THREE_BASIC_ENTRY)) return 'three-basic'
  if (normalizedId.includes(THREE_FUSION_ENTRY)) return 'three-fusion'

  if (!normalizedId.includes('node_modules')) return undefined

  if (normalizedId.includes('node_modules/pinia/')) return 'state'
  if (normalizedId.includes('node_modules/vue-router/')) return 'vue-router'
  if (normalizedId.includes('node_modules/echarts/')) {
    const buckets = detectEchartsBuckets(normalizedId, meta.getModuleInfo)
    if (buckets.has('pressure') && buckets.has('science')) return 'echarts-shared'
    if (buckets.has('pressure')) return 'echarts-pressure'
    if (buckets.has('science')) return 'echarts-science'
    return 'echarts-shared'
  }
  if (normalizedId.includes('node_modules/d3/')) return 'd3'
  if (normalizedId.includes('node_modules/three/')) {
    const buckets = detectThreeBuckets(normalizedId, meta.getModuleInfo)
    if (buckets.has('basic') && buckets.has('fusion')) return 'three-shared'
    if (buckets.has('basic')) return 'three-basic'
    if (buckets.has('fusion')) return 'three-fusion'
    return 'three-shared'
  }
  if (normalizedId.includes('node_modules/katex/')) return 'katex'
  if (normalizedId.includes('node_modules/jszip/')) return 'jszip'
  if (normalizedId.includes('node_modules/axios/')) return 'network'

  return 'vendor'
}
