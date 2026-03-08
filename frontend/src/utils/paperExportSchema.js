export const PAPER_EXPORT_SCHEMA_VERSION = 'paper-export/v1'

const toSafeArray = (value) => (Array.isArray(value) ? value : [])
const toSafeString = (value) => String(value || '').trim()
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
    figure: 'Figure',
    summary: 'Summary',
    caption: 'Caption',
    notes: 'Notes',
    methodsFooter: 'Methods footer',
    methodsPanel: 'Methods and provenance',
    unit: 'Unit',
    abbrev: 'Abbrev.',
    interpretation: 'Interpretation',
    result: 'Result',
    metric: 'Metric',
    title: 'Title',
    finding: 'Finding',
    support: 'Support',
    data: 'Data',
    frame: 'Frame',
    seam: 'Seam',
    fusion: 'Fusion',
    resolution: 'Resolution',
    stressPrior: 'Stress prior',
    section: 'Section',
    control: 'Control',
    fabric: 'Fabric',
    hotspot: 'Hotspot',
    sampling: 'Sampling',
    depthGuideTitle: 'Stratigraphic depth guide',
    insetTitle: 'Plan-view MPI inset',
    insetCaption: 'Line = section, circles = hotspots',
    distributionTitle: 'MPI distribution',
    sectionTransectTitle: 'Section transect',
    xSectionTransectTitle: 'X-direction section transect',
    ySectionTransectTitle: 'Y-direction section transect',
    representativeTransectTitle: 'Representative lateral transect',
    peakFallback: 'Peak --',
    spreadFallback: 'Band = local interquartile envelope.',
    captionBlock: 'Figure caption',
    notesBlock: 'Notes and abbreviations',
  }

  return Object.keys(defaults).reduce((acc, key) => {
    acc[key] = toSafeString(overrides?.[key]) || defaults[key]
    return acc
  }, {})
}

export function buildPublicationMethodsFooter({
  subject = 'Figure',
  source = 'publication export',
  seam = '',
  details = []
} = {}) {
  const subjectText = toSafeString(subject) || 'Figure'
  const sourceText = toSafeString(source) || 'publication export'
  const seamText = toSafeString(seam)
  const detailText = toSafeArray(details)
    .map((item) => toSafeString(item))
    .filter(Boolean)

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
  title = 'Figure Captions',
  intro = '',
  figures = []
}) {
  const lines = [`# ${String(title || 'Figure Captions')}`, '']
  if (intro) {
    lines.push(String(intro))
    lines.push('')
  }

  toSafeArray(figures).forEach((figure, index) => {
    const id = String(figure?.id || `Fig.${index + 1}`)
    const figureTitle = String(figure?.title || '')
    const caption = String(figure?.caption || '').trim() || 'No caption provided.'
    lines.push(`## ${id}${figureTitle ? ` ${figureTitle}` : ''}`)
    lines.push(caption)
    lines.push('')
  })

  return lines.join('\n')
}

export function buildPublicationCaptionsMarkdown({
  title = 'Figure Captions',
  intro = '',
  figures = []
}) {
  const lines = [`# ${String(title || 'Figure Captions')}`, '']
  if (intro) {
    lines.push(String(intro))
    lines.push('')
  }

  toSafeArray(figures).forEach((figure, index) => {
    const id = String(figure?.id || `Fig.${index + 1}`)
    const figureTitle = String(figure?.title || '')
    const captionRows = toSafeArray(figure?.meta?.caption_rows)
    const noteRows = toSafeArray(figure?.meta?.note_rows)
    const fallbackCaption = String(figure?.caption || '').trim() || 'No caption provided.'
    lines.push(`## ${id}${figureTitle ? ` ${figureTitle}` : ''}`)

    if (captionRows.length) {
      captionRows.forEach((row) => {
        lines.push(`**${String(row?.label || 'Caption')}:** ${String(row?.value || '--')}`)
      })
    } else {
      lines.push(`**Caption:** ${fallbackCaption}`)
    }

    if (noteRows.length) {
      lines.push('')
      noteRows.forEach((row) => {
        lines.push(`**${String(row?.label || 'Note')}:** ${String(row?.value || '--')}`)
      })
    }

    lines.push('')
  })

  return lines.join('\n')
}

export function buildPublicationNotesMarkdown({
  title = 'Publication Notes',
  intro = '',
  figures = []
}) {
  const lines = [`# ${String(title || 'Publication Notes')}`, '']
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
        lines.push(`- ${String(row?.label || 'Note')}: ${String(row?.value || '--')}`)
      })
    } else {
      lines.push('- Note: No notes provided.')
    }

    lines.push('')
  })

  return lines.join('\n')
}

export function buildPublicationReadmeMarkdown({
  title = 'Publication Supplement',
  intro = '',
  sourcePage = '',
  manifestPath = buildPaperRootPath({ name: 'manifest', ext: 'json' }),
  indexPath = buildPaperRootPath({ name: 'index', ext: 'json' }),
  captionsPath = buildPaperRootPath({ name: 'captions', ext: 'md' }),
  notesPath = buildPaperRootPath({ name: 'publication-notes', ext: 'md' }),
  figures = [],
  tables = []
} = {}) {
  const lines = [`# ${String(title || 'Publication Supplement')}`, '']
  if (intro) {
    lines.push(String(intro))
    lines.push('')
  }

  lines.push('## Package Structure')
  if (toSafeString(sourcePage)) {
    lines.push(`- \`Source page\`: \`${toSafeString(sourcePage)}\``)
  }
  lines.push(`- \`${String(manifestPath || 'manifest.json')}\`: normalized package manifest.`)
  lines.push(`- \`${String(indexPath || 'index.json')}\`: lightweight machine-readable file index.`)
  lines.push(`- \`${String(captionsPath || 'captions.md')}\`: structured figure captions.`)
  lines.push(`- \`${String(notesPath || 'publication-notes.md')}\`: supporting notes and abbreviations.`)
  lines.push('')

  lines.push('## Figures')
  if (toSafeArray(figures).length) {
    toSafeArray(figures).forEach((figure, index) => {
      const id = String(figure?.id || `Fig.${index + 1}`)
      const titleText = String(figure?.title || '').trim()
      const files = toSafeArray(figure?.files).map((item) => `\`${String(item)}\``).join(', ') || '`--`'
      lines.push(`- \`${id}\`${titleText ? ` ${titleText}` : ''}: ${files}`)
    })
  } else {
    lines.push('- No figure files included.')
  }
  lines.push('')

  lines.push('## Tables')
  if (toSafeArray(tables).length) {
    toSafeArray(tables).forEach((table) => {
      const name = String(table?.name || inferArtifactName(table?.path || 'table'))
      const tablePath = String(table?.path || '--')
      lines.push(`- \`${name}\`: \`${tablePath}\``)
    })
  } else {
    lines.push('- No table files included.')
  }
  lines.push('')

  lines.push('## Usage')
  lines.push('- Use `manifest.json` for machine-readable metadata and file inventory.')
  lines.push('- Use `index.json` for quick programmatic discovery of root files, figures, and tables.')
  lines.push('- Use `captions.md` and `publication-notes.md` when assembling figure legends or supplementary text.')

  return lines.join('\n')
}

export function buildPublicationIndexDocument({
  title = 'Publication Supplement',
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
    title: String(title || 'Publication Supplement'),
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
