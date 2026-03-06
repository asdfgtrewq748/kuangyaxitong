export const PAPER_EXPORT_SCHEMA_VERSION = 'paper-export/v1'

const toSafeArray = (value) => (Array.isArray(value) ? value : [])

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
    context: context && typeof context === 'object' ? context : {},
    figures: toSafeArray(figures),
    tables: toSafeArray(tables),
    artifacts: toSafeArray(artifacts),
    notes: toSafeArray(notes)
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
