export const PAPER_EXPORT_SCHEMA_VERSION = 'paper-export/v1'

const toSafeArray = (value) => (Array.isArray(value) ? value : [])
const toSafeString = (value) => String(value || '').trim()
const toFiniteNumber = (value, fallback = 0) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}
const toPositiveInt = (value, fallback = 1) => {
  const num = Number(value)
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : fallback
}
const toSafeSlug = (value) => toSafeString(value)
  .replace(/[^a-zA-Z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '')

const inferArtifactName = (path) => {
  const normalizedPath = toSafeString(path).replace(/\\/g, '/')
  const basename = normalizedPath.split('/').pop() || ''
  return basename.replace(/\.[^.]+$/, '') || 'artifact'
}

export function buildPaperTimestampTag(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  const iso = Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
  return iso.replace(/[:.]/g, '-')
}

export function buildPaperFigureId({ index = 1, supplement = false } = {}) {
  const normalizedIndex = toPositiveInt(index)
  return supplement ? `FigS${normalizedIndex}` : `Fig${normalizedIndex}`
}

export function buildPaperFigureStem({
  index = 1,
  supplement = false,
  slug = ''
} = {}) {
  const figureId = buildPaperFigureId({ index, supplement })
  const safeSlug = toSafeSlug(slug)
  return safeSlug ? `${figureId}_${safeSlug}` : figureId
}

export function buildPaperFigurePath({
  index = 1,
  supplement = false,
  slug = '',
  ext = 'png',
  dir = 'figures'
} = {}) {
  const safeDir = toSafeString(dir).replace(/\\/g, '/').replace(/\/+$/g, '') || 'figures'
  const safeExt = toSafeSlug(ext).toLowerCase() || 'png'
  return `${safeDir}/${buildPaperFigureStem({ index, supplement, slug })}.${safeExt}`
}

export function buildPaperTablePath({
  name = 'table',
  ext = 'csv',
  dir = 'tables'
} = {}) {
  const safeDir = toSafeString(dir).replace(/\\/g, '/').replace(/\/+$/g, '') || 'tables'
  const safeName = toSafeSlug(name) || 'table'
  const safeExt = toSafeSlug(ext).toLowerCase() || 'csv'
  return `${safeDir}/${safeName}.${safeExt}`
}

export function buildPaperRootPath({
  name = 'artifact',
  ext = 'md'
} = {}) {
  const safeName = toSafeString(name).replace(/\s+/g, '-').replace(/^-+|-+$/g, '') || 'artifact'
  const safeExt = toSafeSlug(ext).toLowerCase() || 'md'
  return `${safeName}.${safeExt}`
}

export function buildPaperSupplementZipName({
  topic = 'Paper',
  variant = '',
  timestampTag = buildPaperTimestampTag()
} = {}) {
  const safeTopic = toSafeSlug(topic) || 'Paper'
  const safeVariant = toSafeSlug(variant)
  return `${safeTopic}_Supplement${safeVariant ? `_${safeVariant}` : ''}_${toSafeString(timestampTag) || buildPaperTimestampTag()}.zip`
}

export function buildPaperArtifact(value = {}) {
  if (typeof value === 'string') {
    return {
      name: inferArtifactName(value),
      path: String(value)
    }
  }

  const path = toSafeString(value?.path || value?.name)
  return {
    name: toSafeString(value?.name) || inferArtifactName(path),
    path
  }
}

export function buildPaperTable(value = {}) {
  if (typeof value === 'string') {
    return {
      name: inferArtifactName(value),
      path: String(value)
    }
  }

  const path = toSafeString(value?.path || value?.name)
  return {
    name: toSafeString(value?.name) || inferArtifactName(path),
    path
  }
}

export function buildPaperContext(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.entries(value).reduce((acc, [key, raw]) => {
    if (typeof raw === 'undefined') return acc
    acc[String(key)] = raw
    return acc
  }, {})
}

export function buildPaperNote(value = '') {
  return String(value ?? '')
}

export function buildPublicationRows(rows = []) {
  return toSafeArray(rows)
    .filter((row) => row && typeof row === 'object')
    .map((row) => ({
      label: toSafeString(row?.label) || '--',
      value: String(row?.value ?? '').trim() || '--'
    }))
}

export function buildPublicationLabelSet(overrides = {}) {
  const defaults = {
    figure: '图',
    summary: '摘要',
    caption: '图注',
    notes: '注释',
    methodsFooter: '方法注脚',
    methodsPanel: '方法与溯源',
    unit: '单位',
    abbrev: '缩写',
    interpretation: '解释',
    result: '结果',
    metric: '指标',
    title: '标题',
    finding: '发现',
    support: '支撑证据',
    data: '数据',
    frame: '框架',
    seam: '煤层',
    fusion: '融合',
    resolution: '分辨率',
    stressPrior: '应力先验',
    section: '剖面',
    control: '控制条件',
    fabric: '构造纹理',
    hotspot: '热点',
    sampling: '采样',
    depthGuideTitle: '地层深度导引',
    insetTitle: 'MPI 平面插图',
    insetCaption: '线表示剖面，圆表示热点',
    distributionTitle: 'MPI 分布',
    sectionTransectTitle: '剖面切线',
    xSectionTransectTitle: 'X 方向剖面切线',
    ySectionTransectTitle: 'Y 方向剖面切线',
    representativeTransectTitle: '代表性横向切线',
    peakFallback: '峰值 --',
    spreadFallback: '带状区表示局部四分位包络。',
    captionBlock: '图注块',
    notesBlock: '注释与缩写',
  }

  return Object.keys(defaults).reduce((acc, key) => {
    acc[key] = toSafeString(overrides?.[key]) || defaults[key]
    return acc
  }, {})
}

export function buildPublicationMethodsFooter({
  subject = '图件',
  source = '论文导出',
  seam = '',
  details = [],
  locale = 'zh-CN'
} = {}) {
  const subjectText = toSafeString(subject) || '图件'
  const sourceText = toSafeString(source) || '论文导出'
  const seamText = toSafeString(seam)
  const detailText = toSafeArray(details)
    .map((item) => toSafeString(item))
    .filter(Boolean)

  const normalizedLocale = toSafeString(locale) || 'zh-CN'
  const useChinese = normalizedLocale.startsWith('zh')

  if (useChinese) {
    let sentence = `方法注：${subjectText}导出自${sourceText}`
    if (seamText) {
      sentence += `，对应煤层 ${seamText}`
    }
    if (detailText.length) {
      sentence += `；关键参数包括 ${detailText.join('、')}`
    }
    return `${sentence}。`
  }

  let sentence = `Methods footer: ${subjectText} is exported from the ${sourceText}`
  if (seamText) {
    sentence += ` for seam ${seamText}`
  }
  if (detailText.length) {
    sentence += `, using ${detailText.join(', ')}`
  }
  return `${sentence}.`
}

export function buildPublicationNarrativeSentence({
  clauses = []
} = {}) {
  const normalizedClauses = toSafeArray(clauses)
    .map((item) => toSafeString(item).replace(/[.。]+$/g, ''))
    .filter(Boolean)

  if (!normalizedClauses.length) return ''
  return `${normalizedClauses.join('. ')}.`
}

export function buildPublicationDiagnosticCopy({
  profileSource = '',
  focus = '',
  seam = '',
  grid = '',
  method = '',
  resolution = '',
  layerCount = '',
  boreholeCount = '',
  anchorCount = '',
  depthMax = '',
  depthMin = '',
  depthUnit = 'm',
} = {}) {
  const profileSourceText = toSafeString(profileSource) || '--'
  const focusText = toSafeString(focus) || '--'
  const seamText = toSafeString(seam) || '--'
  const gridText = toSafeString(grid) || '--'
  const methodText = toSafeString(method).toUpperCase() || '--'
  const resolutionText = toSafeString(resolution) || '--'
  const depthMaxText = toSafeString(depthMax) || '--'
  const depthMinText = toSafeString(depthMin) || '--'
  const unitText = toSafeString(depthUnit) || 'm'

  return {
    profileLine: `Profile source: ${profileSourceText} | Focus: ${focusText}`,
    metaLine: `Seam ${seamText} | Grid ${gridText} | Method ${methodText} | Resolution ${resolutionText}`,
    structureLine: `Layers ${layerCount} | Boreholes ${boreholeCount} | Anchors ${anchorCount}`,
    methodsLine: `Data fusion: mesh layers + boreholes + ${gridText} metric grid`,
    depthNotes: [
      `Focus band: ${focusText}`,
      'Anchors ranked by transfer weight.',
      `Depth frame: ${depthMaxText} to ${depthMinText} ${unitText}.`
    ]
  }
}

export function buildPublicationStatisticCopy({
  analysisTitle = '',
  profileTitle = '',
  anchorTitle = '',
  figureNote = '',
  distributionCaption = '',
  sectionRetained = '',
  hotspotCount = '',
  p25 = '',
  p50 = '',
  p75 = '',
} = {}) {
  return {
    analysisTitle: toSafeString(analysisTitle),
    profileTitle: toSafeString(profileTitle),
    anchorTitle: toSafeString(anchorTitle),
    figureNote: toSafeString(figureNote),
    distributionCaption: toSafeString(distributionCaption),
    summaryLines: [
      `Section retained: ${toSafeString(sectionRetained) || '--'}`,
      `Hotspots (P90+): ${String(hotspotCount ?? '').trim() || '--'}`,
      `Q1/Q2/Q3: ${(toSafeString(p25) || '--')} / ${(toSafeString(p50) || '--')} / ${(toSafeString(p75) || '--')}`,
    ]
  }
}

export function buildPublicationFigureHeaderCopy({
  seam = '',
  grid = '',
  method = '',
  layerCount = '',
  boreholeCount = '',
  anchorCount = '',
  focus = '',
} = {}) {
  return {
    metaLine: `Seam ${toSafeString(seam) || '--'} | Grid ${toSafeString(grid) || '--'} | Method ${toSafeString(method).toUpperCase() || '--'}`,
    kpiLines: [
      `Layers ${String(layerCount ?? '').trim() || '--'}`,
      `Boreholes ${String(boreholeCount ?? '').trim() || '--'}`,
      `Anchors ${String(anchorCount ?? '').trim() || '--'}`,
      `Focus ${toSafeString(focus) || '--'}`
    ]
  }
}

export function buildPublicationHeroCopy({
  metricLabel = '',
  metricUnit = 'MPa',
  mean = '',
  cv = '',
  p90Cover = '',
  iqr = '',
  entropy = '',
  skew = '',
} = {}) {
  const label = toSafeString(metricLabel) || 'Metric'
  const unit = toSafeString(metricUnit) || 'MPa'
  return {
    topic: `${label}-Geology Coupled View`,
    headline: 'Integrated Multi-source Structure-Stress Interpretation',
    metricRows: [
      `Mean ${toSafeString(mean) || '--'} ${unit}`,
      `CV ${toSafeString(cv) || '--'}`,
      `P90 cover ${toSafeString(p90Cover) || '--'}`,
      `IQR ${toSafeString(iqr) || '--'}`,
      `Entropy ${toSafeString(entropy) || '--'}`,
      `Skew ${toSafeString(skew) || '--'}`
    ]
  }
}

export function buildPublicationLegendCopy({
  metricLabel = '',
  metricUnit = 'MPa',
  depthMin = '',
  depthMax = '',
  depthUnit = 'm',
  sectionAxis = '',
  sectionThreshold = '',
  stressProfileLabel = '',
  spatialFrameLabel = 'X east / Y north',
} = {}) {
  const label = toSafeString(metricLabel) || 'Metric'
  const unit = toSafeString(metricUnit) || 'MPa'
  const depthUnitText = toSafeString(depthUnit) || 'm'
  const axis = toSafeString(sectionAxis).toUpperCase() || '--'
  return {
    legendTitle: `${label} (${unit})`,
    depthSpanLine: `Depth span ${toSafeString(depthMin) || '--'} to ${toSafeString(depthMax) || '--'} ${depthUnitText}`,
    sectionLine: `Section ${axis} = ${toSafeString(sectionThreshold) || '--'}`,
    cloudLine: `Stress cloud = MPI field x depth transfer (${toSafeString(stressProfileLabel) || '--'})`,
    orientationMeta: toSafeString(spatialFrameLabel) || 'X east / Y north',
    northLabel: 'N'
  }
}

export function buildPublicationSummaryCopy({
  figureNarrative = '',
  metricLabel = '',
  metricKind = 'proxy',
  metricUnit = 'MPa',
  metricMin = '',
  metricMean = '',
  metricMax = '',
  sampleSizeLabel = '',
  p25 = '',
  p50 = '',
  p75 = '',
  cv = '',
  p75Cover = '',
  p90Cover = '',
  sectionRetained = '',
  entropy = '',
  skewness = '',
  heterogeneity = '',
  boreholeDensity = '',
  densityUnit = 'boreholes km^-2',
} = {}) {
  const metric = toSafeString(metricLabel) || 'Metric'
  const kind = toSafeString(metricKind) || 'proxy'
  const unit = toSafeString(metricUnit) || 'MPa'
  const sampleSize = toSafeString(sampleSizeLabel) || 'n = --'
  const density = toSafeString(densityUnit) || 'boreholes km^-2'

  return {
    summaryLead: `${toSafeString(figureNarrative) || 'Metric distribution is unavailable.'} ${metric} evidence spans ${toSafeString(metricMin) || '--'} to ${toSafeString(metricMax) || '--'} ${unit} with ${sampleSize}.`,
    metricLine: `${metric} (${kind}) min ${toSafeString(metricMin) || '--'} mean ${toSafeString(metricMean) || '--'} max ${toSafeString(metricMax) || '--'}`,
    quantileLine: `Q1 / Q2 / Q3 ${toSafeString(p25) || '--'} / ${toSafeString(p50) || '--'} / ${toSafeString(p75) || '--'} ${unit} | CV ${toSafeString(cv) || '--'}`,
    coverLine: `Q3 cover ${toSafeString(p75Cover) || '--'} | P90 cover ${toSafeString(p90Cover) || '--'} | Section retained ${toSafeString(sectionRetained) || '--'}`,
    distributionLine: `Entropy ${toSafeString(entropy) || '--'} | Skewness ${toSafeString(skewness) || '--'} | ${sampleSize}`,
    supportLine: `Heterogeneity ${toSafeString(heterogeneity) || '--'} | Borehole density ${toSafeString(boreholeDensity) || '--'} ${density} | ${sampleSize}`
  }
}

const quantileFromSortedValues = (sortedValues, q) => {
  if (!Array.isArray(sortedValues) || !sortedValues.length) return 0
  const ratio = Math.max(0, Math.min(1, toFiniteNumber(q, 0)))
  if (sortedValues.length === 1) return sortedValues[0]
  const index = (sortedValues.length - 1) * ratio
  const lower = Math.floor(index)
  const upper = Math.min(sortedValues.length - 1, Math.ceil(index))
  const weight = index - lower
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight
}

export function buildPublicationSectionProfileDiagnostics({
  grid = [],
  sectionAxis = 'z',
  sectionRetainedRatio = 0,
  labels = {},
  formatValue = (value) => String(value ?? '--'),
  unit = 'MPa',
} = {}) {
  const safeLabels = buildPublicationLabelSet(labels)
  const formatMetricValue = typeof formatValue === 'function'
    ? formatValue
    : (value) => String(value ?? '--')
  const fallback = {
    path: '',
    bandPath: '',
    guideX: null,
    modeLabel: safeLabels.sectionTransectTitle,
    peakLabel: safeLabels.peakFallback,
    spreadLabel: safeLabels.spreadFallback,
    rangeLabel: `-- to -- ${toSafeString(unit) || 'MPa'}`,
  }

  if (!Array.isArray(grid) || !Array.isArray(grid[0])) {
    return fallback
  }

  const rows = grid.length
  const cols = grid[0].length
  if (rows < 2 || cols < 2) {
    return fallback
  }

  const samples = []
  const retainedRatio = Math.max(0, Math.min(1, toFiniteNumber(sectionRetainedRatio, 0)))
  let guideX = null
  let modeLabel = safeLabels.sectionTransectTitle
  let axisDescriptor = 'track'

  if (sectionAxis === 'x') {
    const focusCol = Math.max(0, Math.min(cols - 1, Math.round(retainedRatio * (cols - 1))))
    guideX = ((focusCol / Math.max(cols - 1, 1)) * 100).toFixed(3)
    modeLabel = safeLabels.ySectionTransectTitle
    axisDescriptor = 'Y'
    for (let r = 0; r < rows; r += 1) {
      const local = []
      for (let dc = -1; dc <= 1; dc += 1) {
        const value = Number(grid[r]?.[focusCol + dc])
        if (Number.isFinite(value)) local.push(value)
      }
      if (!local.length) continue
      local.sort((a, b) => a - b)
      samples.push({
        index: r,
        pos: rows > 1 ? r / (rows - 1) : 0,
        mean: local.reduce((acc, value) => acc + value, 0) / local.length,
        low: quantileFromSortedValues(local, 0.25),
        high: quantileFromSortedValues(local, 0.75),
      })
    }
  } else if (sectionAxis === 'y') {
    const focusRow = Math.max(0, Math.min(rows - 1, Math.round(retainedRatio * (rows - 1))))
    guideX = ((focusRow / Math.max(rows - 1, 1)) * 100).toFixed(3)
    modeLabel = safeLabels.xSectionTransectTitle
    axisDescriptor = 'X'
    for (let c = 0; c < cols; c += 1) {
      const local = []
      for (let dr = -1; dr <= 1; dr += 1) {
        const value = Number(grid[focusRow + dr]?.[c])
        if (Number.isFinite(value)) local.push(value)
      }
      if (!local.length) continue
      local.sort((a, b) => a - b)
      samples.push({
        index: c,
        pos: cols > 1 ? c / (cols - 1) : 0,
        mean: local.reduce((acc, value) => acc + value, 0) / local.length,
        low: quantileFromSortedValues(local, 0.25),
        high: quantileFromSortedValues(local, 0.75),
      })
    }
  } else {
    modeLabel = safeLabels.representativeTransectTitle
    axisDescriptor = 'X'
    for (let c = 0; c < cols; c += 1) {
      const local = []
      for (let r = 0; r < rows; r += 1) {
        const value = Number(grid[r]?.[c])
        if (Number.isFinite(value)) local.push(value)
      }
      if (!local.length) continue
      local.sort((a, b) => a - b)
      samples.push({
        index: c,
        pos: cols > 1 ? c / (cols - 1) : 0,
        mean: local.reduce((acc, value) => acc + value, 0) / local.length,
        low: quantileFromSortedValues(local, 0.25),
        high: quantileFromSortedValues(local, 0.75),
      })
    }
  }

  if (samples.length < 2) {
    return {
      ...fallback,
      guideX,
      modeLabel,
    }
  }

  let minValue = Number.POSITIVE_INFINITY
  let maxValue = Number.NEGATIVE_INFINITY
  samples.forEach((sample) => {
    minValue = Math.min(minValue, sample.low, sample.mean)
    maxValue = Math.max(maxValue, sample.high, sample.mean)
  })

  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue) || maxValue <= minValue) {
    minValue = 0
    maxValue = 1
  }

  const span = Math.max(maxValue - minValue, 1e-6)
  const scaleY = (value) => (35 - ((value - minValue) / span) * 32).toFixed(3)
  const scaleX = (pos) => (pos * 100).toFixed(3)

  const upper = samples.map((sample) => `${scaleX(sample.pos)},${scaleY(sample.high)}`)
  const lower = [...samples].reverse().map((sample) => `${scaleX(sample.pos)},${scaleY(sample.low)}`)
  const meanLine = samples.map((sample) => `${scaleX(sample.pos)},${scaleY(sample.mean)}`)
  const peak = samples.reduce((best, sample) => (sample.mean > best.mean ? sample : best), samples[0])
  const averageBandWidth = samples.reduce((acc, sample) => acc + Math.max(0, sample.high - sample.low), 0) / samples.length
  const unitLabel = toSafeString(unit) || 'MPa'

  return {
    path: `M ${meanLine.join(' L ')}`,
    bandPath: `M ${upper.join(' L ')} L ${lower.join(' L ')} Z`,
    guideX,
    modeLabel,
    peakLabel: `Peak ${axisDescriptor}${peak.index + 1} | ${formatMetricValue(peak.mean)} ${unitLabel}`,
    spreadLabel: `Band = local interquartile envelope, mean width ${formatMetricValue(averageBandWidth)} ${unitLabel}.`,
    rangeLabel: `${formatMetricValue(minValue)} to ${formatMetricValue(maxValue)} ${unitLabel}`,
  }
}

export function buildPaperFigure({
  id,
  title,
  caption = '',
  panel = '',
  files = [],
  tags = [],
  meta = {}
}) {
  return {
    id: String(id || ''),
    panel: String(panel || ''),
    title: String(title || ''),
    caption: String(caption || ''),
    files: toSafeArray(files).map((item) => String(item)),
    tags: toSafeArray(tags).map((item) => String(item)),
    meta: meta && typeof meta === 'object' ? meta : {}
  }
}

export function buildPaperManifest({
  sourcePage,
  title = '',
  locale = 'zh-CN',
  context = {},
  figures = [],
  tables = [],
  artifacts = [],
  notes = [],
  generatedAt = new Date().toISOString()
}) {
  return {
    schema_version: PAPER_EXPORT_SCHEMA_VERSION,
    generated_at: String(generatedAt),
    source_page: String(sourcePage || ''),
    title: String(title || ''),
    locale: String(locale || 'zh-CN'),
    context: buildPaperContext(context),
    figures: toSafeArray(figures),
    tables: toSafeArray(tables).map((item) => buildPaperTable(item)),
    artifacts: toSafeArray(artifacts).map((item) => buildPaperArtifact(item)),
    notes: toSafeArray(notes).map((item) => buildPaperNote(item))
  }
}

export function buildCaptionsMarkdown({
  title = '图注汇总',
  intro = '',
  figures = []
}) {
  const lines = [`# ${String(title || '图注汇总')}`, '']
  if (intro) {
    lines.push(String(intro))
    lines.push('')
  }

  toSafeArray(figures).forEach((figure, index) => {
    const id = String(figure?.id || `Fig.${index + 1}`)
    const figureTitle = String(figure?.title || '')
    const caption = String(figure?.caption || '').trim() || '未提供图注。'
    lines.push(`## ${id}${figureTitle ? ` ${figureTitle}` : ''}`)
    lines.push(caption)
    lines.push('')
  })

  return lines.join('\n')
}

export function buildPublicationCaptionsMarkdown({
  title = '图注汇总',
  intro = '',
  figures = []
}) {
  const lines = [`# ${String(title || '图注汇总')}`, '']
  if (intro) {
    lines.push(String(intro))
    lines.push('')
  }

  toSafeArray(figures).forEach((figure, index) => {
    const id = String(figure?.id || `Fig.${index + 1}`)
    const figureTitle = String(figure?.title || '')
    const captionRows = toSafeArray(figure?.meta?.caption_rows)
    const noteRows = toSafeArray(figure?.meta?.note_rows)
    const fallbackCaption = String(figure?.caption || '').trim() || '未提供图注。'
    lines.push(`## ${id}${figureTitle ? ` ${figureTitle}` : ''}`)

    if (captionRows.length) {
      captionRows.forEach((row) => {
        lines.push(`**${String(row?.label || '图注')}:** ${String(row?.value || '--')}`)
      })
    } else {
      lines.push(`**图注：** ${fallbackCaption}`)
    }

    if (noteRows.length) {
      lines.push('')
      noteRows.forEach((row) => {
        lines.push(`**${String(row?.label || '注释')}:** ${String(row?.value || '--')}`)
      })
    }

    lines.push('')
  })

  return lines.join('\n')
}

export function buildPublicationNotesMarkdown({
  title = '出版注释',
  intro = '',
  figures = []
}) {
  const lines = [`# ${String(title || '出版注释')}`, '']
  if (intro) {
    lines.push(String(intro))
    lines.push('')
  }

  toSafeArray(figures).forEach((figure, index) => {
    const id = String(figure?.id || `Fig.${index + 1}`)
    const figureTitle = String(figure?.title || '')
    const noteRows = toSafeArray(figure?.meta?.note_rows)
    lines.push(`## ${id}${figureTitle ? ` ${figureTitle}` : ''}`)

    if (noteRows.length) {
      noteRows.forEach((row) => {
        lines.push(`- ${String(row?.label || '注释')}: ${String(row?.value || '--')}`)
      })
    } else {
      lines.push('- 注释：未提供说明。')
    }

    lines.push('')
  })

  return lines.join('\n')
}

export function buildPublicationReadmeMarkdown({
  title = '论文补充材料',
  intro = '',
  sourcePage = '',
  manifestPath = buildPaperRootPath({ name: 'manifest', ext: 'json' }),
  indexPath = buildPaperRootPath({ name: 'index', ext: 'json' }),
  captionsPath = buildPaperRootPath({ name: 'captions', ext: 'md' }),
  notesPath = buildPaperRootPath({ name: 'publication-notes', ext: 'md' }),
  figures = [],
  tables = []
} = {}) {
  const lines = [`# ${String(title || '论文补充材料')}`, '']
  if (intro) {
    lines.push(String(intro))
    lines.push('')
  }

  lines.push('## 文件结构')
  if (toSafeString(sourcePage)) {
    lines.push(`- \`来源页面\`: \`${toSafeString(sourcePage)}\``)
  }
  lines.push(`- \`${String(manifestPath || 'manifest.json')}\`: 规范化导出清单。`)
  lines.push(`- \`${String(indexPath || 'index.json')}\`: 轻量级机器可读文件索引。`)
  lines.push(`- \`${String(captionsPath || 'captions.md')}\`: 结构化图注。`)
  lines.push(`- \`${String(notesPath || 'publication-notes.md')}\`: 补充注释与缩写说明。`)
  lines.push('')

  lines.push('## 图件')
  if (toSafeArray(figures).length) {
    toSafeArray(figures).forEach((figure, index) => {
      const id = String(figure?.id || `Fig.${index + 1}`)
      const titleText = String(figure?.title || '').trim()
      const files = toSafeArray(figure?.files).map((item) => `\`${String(item)}\``).join(', ') || '`--`'
      lines.push(`- \`${id}\`${titleText ? ` ${titleText}` : ''}: ${files}`)
    })
  } else {
    lines.push('- 未包含图件文件。')
  }
  lines.push('')

  lines.push('## 表格')
  if (toSafeArray(tables).length) {
    toSafeArray(tables).forEach((table) => {
      const name = String(table?.name || inferArtifactName(table?.path || 'table'))
      const tablePath = String(table?.path || '--')
      lines.push(`- \`${name}\`: \`${tablePath}\``)
    })
  } else {
    lines.push('- 未包含表格文件。')
  }
  lines.push('')

  lines.push('## 使用说明')
  lines.push('- 使用 `manifest.json` 查看机器可读的元数据与文件清单。')
  lines.push('- 使用 `index.json` 快速定位根目录文件、图件与表格。')
  lines.push('- 组装图例或补充说明时，优先引用 `captions.md` 和 `publication-notes.md`。')

  return lines.join('\n')
}

export function buildPublicationIndexDocument({
  title = '论文补充材料',
  generatedAt = new Date().toISOString(),
  sourcePage = '',
  manifestPath = buildPaperRootPath({ name: 'manifest', ext: 'json' }),
  captionsPath = buildPaperRootPath({ name: 'captions', ext: 'md' }),
  notesPath = buildPaperRootPath({ name: 'publication-notes', ext: 'md' }),
  readmePath = buildPaperRootPath({ name: 'README', ext: 'md' }),
  figures = [],
  tables = []
} = {}) {
  return {
    schema_version: PAPER_EXPORT_SCHEMA_VERSION,
    generated_at: String(generatedAt || new Date().toISOString()),
    source_page: String(sourcePage || ''),
    title: String(title || '论文补充材料'),
    files: {
      manifest: String(manifestPath || 'manifest.json'),
      captions: String(captionsPath || 'captions.md'),
      publication_notes: String(notesPath || 'publication-notes.md'),
      readme: String(readmePath || 'README.md')
    },
    figures: toSafeArray(figures).map((figure, index) => ({
      id: String(figure?.id || `Fig.${index + 1}`),
      title: String(figure?.title || ''),
      files: toSafeArray(figure?.files).map((item) => String(item))
    })),
    tables: toSafeArray(tables).map((table) => ({
      name: String(table?.name || inferArtifactName(table?.path || 'table')),
      path: String(table?.path || '')
    }))
  }
}
