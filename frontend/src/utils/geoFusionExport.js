const createPanel = (ctx, x, y, width, height) => {
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fillRect(x, y, width, height)
  ctx.strokeStyle = 'rgba(15,23,42,0.16)'
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, width, height)
}

const wrapText = (ctx, text, maxWidth) => {
  const source = String(text || '').replace(/\s+/g, ' ').trim()
  if (!source) return []

  const words = source.includes(' ') ? source.split(' ') : [source]
  const lines = []
  let current = ''

  const pushChunk = (chunk) => {
    if (!chunk) return
    if (ctx.measureText(chunk).width <= maxWidth) {
      lines.push(chunk)
      return
    }

    let piece = ''
    for (const char of Array.from(chunk)) {
      const candidate = `${piece}${char}`
      if (piece && ctx.measureText(candidate).width > maxWidth) {
        lines.push(piece)
        piece = char
      } else {
        piece = candidate
      }
    }
    if (piece) lines.push(piece)
  }

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate
      return
    }

    if (current) {
      lines.push(current)
      current = ''
    }

    if (ctx.measureText(word).width <= maxWidth) {
      current = word
    } else {
      pushChunk(word)
    }
  })

  if (current) lines.push(current)
  return lines
}

const measureTextBlock = (ctx, text, maxWidth, lineHeight) => {
  const lines = wrapText(ctx, text, maxWidth)
  return {
    lines,
    height: Math.max(lineHeight, lines.length * lineHeight),
  }
}

const drawTextLines = (ctx, lines, x, y, lineHeight) => {
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight)
  })
}

const normalizeRows = (rows) => {
  if (!Array.isArray(rows)) return []
  return rows.filter((row) => row && (row.label || row.value))
}

const measureLabeledRows = (ctx, rows, width, options = {}) => {
  const labelWidth = options.labelWidth ?? 140
  const rowGap = options.rowGap ?? 10
  const lineHeight = options.lineHeight ?? 22
  const valueWidth = Math.max(120, width - labelWidth)
  let height = 0

  normalizeRows(rows).forEach((row) => {
    const label = row.label ? `${row.label}` : ''
    const value = row.value ?? '--'
    const labelLines = measureTextBlock(ctx, label, labelWidth - 8, lineHeight).lines
    const valueLines = measureTextBlock(ctx, value, valueWidth, lineHeight).lines
    const rowHeight = Math.max(
      labelLines.length * lineHeight || lineHeight,
      valueLines.length * lineHeight || lineHeight
    )
    height += rowHeight + rowGap
  })

  return height > 0 ? height - rowGap : 0
}

const drawLabeledRows = (ctx, rows, x, y, width, options = {}) => {
  const labelWidth = options.labelWidth ?? 140
  const rowGap = options.rowGap ?? 10
  const lineHeight = options.lineHeight ?? 22
  const labelFont = options.labelFont ?? ctx.font
  const valueFont = options.valueFont ?? ctx.font
  const labelColor = options.labelColor ?? '#0f172a'
  const valueColor = options.valueColor ?? '#334155'
  const valueWidth = Math.max(120, width - labelWidth)
  let cursorY = y

  normalizeRows(rows).forEach((row) => {
    const labelLines = measureTextBlock(ctx, row.label || '', labelWidth - 8, lineHeight).lines
    const valueLines = measureTextBlock(ctx, row.value ?? '--', valueWidth, lineHeight).lines
    const rowHeight = Math.max(
      labelLines.length * lineHeight || lineHeight,
      valueLines.length * lineHeight || lineHeight
    )

    ctx.font = labelFont
    ctx.fillStyle = labelColor
    drawTextLines(ctx, labelLines, x, cursorY, lineHeight)

    ctx.font = valueFont
    ctx.fillStyle = valueColor
    drawTextLines(ctx, valueLines, x + labelWidth, cursorY, lineHeight)

    cursorY += rowHeight + rowGap
  })

  return cursorY
}

const drawSubfigureLabel = (ctx, label, x, y, scale) => {
  ctx.save()
  ctx.fillStyle = '#0f172a'
  ctx.font = `700 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  if (label === 'a') ctx.fillText('a', x, y)
  else if (label === 'b') ctx.fillText('b', x, y)
  else if (label === 'c') ctx.fillText('c', x, y)
  else if (label === 'd') ctx.fillText('d', x, y)
  else ctx.fillText(String(label || '').toLowerCase(), x, y)
  ctx.restore()
}

const strokePath2D = (ctx, d, draw) => {
  if (!d || typeof Path2D === 'undefined') return
  const path = new Path2D(d)
  draw(path)
}

const drawInsetPanel = (ctx, x, y, width, height, snapshot, scale) => {
  const labels = snapshot.publicationLabels || {}
  createPanel(ctx, x, y, width, height)
  drawSubfigureLabel(ctx, snapshot.subfigureLabels?.inset || 'a', x + Math.round(16 * scale), y + Math.round(24 * scale), scale)
  ctx.fillStyle = '#0f172a'
  ctx.font = `600 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(snapshot.publicationLabels?.insetTitle || labels.insetTitle || 'Plan-view MPI inset', x + Math.round(42 * scale), y + Math.round(24 * scale))

  const chartX = x + Math.round(16 * scale)
  const chartY = y + Math.round(40 * scale)
  const chartW = width - Math.round(32 * scale)
  const chartH = Math.max(Math.round(110 * scale), height - Math.round(88 * scale))

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(chartX, chartY, chartW, chartH)
  ctx.strokeStyle = 'rgba(100,116,139,0.32)'
  ctx.lineWidth = Math.max(1, scale)
  ctx.strokeRect(chartX, chartY, chartW, chartH)

  ;(Array.isArray(snapshot.insetHeatmapCells) ? snapshot.insetHeatmapCells : []).forEach((cell) => {
    ctx.fillStyle = cell.color || '#94a3b8'
    ctx.fillRect(
      chartX + (Number(cell.x) / 100) * chartW,
      chartY + (Number(cell.y) / 100) * chartH,
      Math.max(1, (Number(cell.w) / 100) * chartW),
      Math.max(1, (Number(cell.h) / 100) * chartH)
    )
  })

  if (snapshot.insetSectionLine) {
    ctx.strokeStyle = 'rgba(127,29,29,0.92)'
    ctx.lineWidth = Math.max(2, 1.5 * scale)
    ctx.beginPath()
    ctx.moveTo(chartX + (Number(snapshot.insetSectionLine.x1) / 100) * chartW, chartY + (Number(snapshot.insetSectionLine.y1) / 100) * chartH)
    ctx.lineTo(chartX + (Number(snapshot.insetSectionLine.x2) / 100) * chartW, chartY + (Number(snapshot.insetSectionLine.y2) / 100) * chartH)
    ctx.stroke()
  }

  ;(Array.isArray(snapshot.insetHotspotPoints) ? snapshot.insetHotspotPoints : []).forEach((spot) => {
    ctx.fillStyle = 'rgba(127,29,29,0.9)'
    ctx.beginPath()
    ctx.arc(
      chartX + (Number(spot.x) / 100) * chartW,
      chartY + (Number(spot.y) / 100) * chartH,
      Math.max(2, Number(spot.r) * scale * 0.5),
      0,
      Math.PI * 2
    )
    ctx.fill()
  })

  ctx.fillStyle = '#475569'
  ctx.font = `500 ${Math.round(14 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(snapshot.publicationLabels?.insetCaption || labels.insetCaption || 'Line = section, circles = hotspots', chartX, y + height - Math.round(16 * scale))
}

const drawSectionPanel = (ctx, x, y, width, height, snapshot, scale) => {
  const labels = snapshot.publicationLabels || {}
  createPanel(ctx, x, y, width, height)
  drawSubfigureLabel(ctx, snapshot.subfigureLabels?.section || 'c', x + Math.round(16 * scale), y + Math.round(24 * scale), scale)
  ctx.fillStyle = '#0f172a'
  ctx.font = `600 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(snapshot.publicationLabels?.sectionTransectTitle || labels.sectionTransectTitle || 'Section transect', x + Math.round(42 * scale), y + Math.round(24 * scale))

  const modeLabel = snapshot.sectionProfile?.modeLabel || 'Representative transect'
  ctx.fillStyle = '#475569'
  ctx.font = `500 ${Math.round(14 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(modeLabel, x + Math.round(16 * scale), y + Math.round(42 * scale))

  const chartX = x + Math.round(16 * scale)
  const chartY = y + Math.round(54 * scale)
  const chartW = width - Math.round(32 * scale)
  const chartH = Math.max(Math.round(90 * scale), height - Math.round(110 * scale))
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(chartX, chartY, chartW, chartH)
  ctx.strokeStyle = 'rgba(100,116,139,0.32)'
  ctx.lineWidth = Math.max(1, scale)
  ctx.strokeRect(chartX, chartY, chartW, chartH)

  ctx.strokeStyle = 'rgba(51,65,85,0.8)'
  ctx.beginPath()
  ctx.moveTo(chartX, chartY + chartH)
  ctx.lineTo(chartX + chartW, chartY + chartH)
  ctx.moveTo(chartX, chartY)
  ctx.lineTo(chartX, chartY + chartH)
  ctx.stroke()

  if (snapshot.sectionProfile?.guideX !== null && snapshot.sectionProfile?.guideX !== undefined) {
    ctx.strokeStyle = 'rgba(127,29,29,0.5)'
    ctx.setLineDash([Math.max(2, 2 * scale), Math.max(2, 2 * scale)])
    const gx = chartX + (Number(snapshot.sectionProfile.guideX) / 100) * chartW
    ctx.beginPath()
    ctx.moveTo(gx, chartY)
    ctx.lineTo(gx, chartY + chartH)
    ctx.stroke()
    ctx.setLineDash([])
  }

  ctx.save()
  ctx.translate(chartX, chartY)
  ctx.scale(chartW / 100, chartH / 38)
  strokePath2D(ctx, snapshot.sectionProfile?.bandPath, (path) => {
    ctx.fillStyle = 'rgba(148,163,184,0.35)'
    ctx.fill(path)
  })
  strokePath2D(ctx, snapshot.sectionProfile?.path, (path) => {
    ctx.strokeStyle = 'rgba(15,23,42,0.92)'
    ctx.lineWidth = 1.6
    ctx.stroke(path)
  })
  ctx.restore()

  ctx.fillStyle = '#334155'
  ctx.font = `500 ${Math.round(13 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(snapshot.sectionProfile?.rangeLabel || '--', chartX, y + height - Math.round(34 * scale))
  ctx.fillText(snapshot.sectionProfile?.peakLabel || 'Peak --', chartX, y + height - Math.round(20 * scale))
}

const drawDepthGuidePanel = (ctx, x, y, width, height, snapshot, scale) => {
  const labels = snapshot.publicationLabels || {}
  createPanel(ctx, x, y, width, height)
  drawSubfigureLabel(ctx, snapshot.subfigureLabels?.depth || 'd', x + Math.round(16 * scale), y + Math.round(24 * scale), scale)
  ctx.fillStyle = '#0f172a'
  ctx.font = `600 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(snapshot.publicationLabels?.depthGuideTitle || labels.depthGuideTitle || 'Stratigraphic depth guide', x + Math.round(42 * scale), y + Math.round(24 * scale))

  const stripX = x + Math.round(16 * scale)
  const stripY = y + Math.round(42 * scale)
  const stripW = Math.round(96 * scale)
  const stripH = Math.max(Math.round(138 * scale), height - Math.round(64 * scale))
  const notesX = stripX + stripW + Math.round(14 * scale)
  const notesW = width - (notesX - x) - Math.round(16 * scale)

  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(stripX, stripY, stripW, stripH)
  ctx.strokeStyle = 'rgba(100,116,139,0.32)'
  ctx.lineWidth = Math.max(1, scale)
  ctx.strokeRect(stripX, stripY, stripW, stripH)

  const sx = stripW / 88
  const sy = stripH / 220
  const focusBand = snapshot.depthGuide?.focusBand
  if (focusBand) {
    ctx.fillStyle = 'rgba(15,118,110,0.18)'
    ctx.fillRect(stripX + Number(focusBand.x) * sx, stripY + Number(focusBand.y) * sy, Number(focusBand.w) * sx, Number(focusBand.h) * sy)
  }

  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = Math.max(1.5, 1.4 * scale)
  ctx.beginPath()
  ctx.moveTo(stripX + 37 * sx, stripY + 8 * sy)
  ctx.lineTo(stripX + 37 * sx, stripY + 212 * sy)
  ctx.stroke()

  ;(Array.isArray(snapshot.depthGuide?.axisTicks) ? snapshot.depthGuide.axisTicks : []).forEach((tick) => {
    const ty = stripY + Number(tick.y) * sy
    ctx.strokeStyle = 'rgba(71,85,105,0.72)'
    ctx.beginPath()
    ctx.moveTo(stripX + 24 * sx, ty)
    ctx.lineTo(stripX + 50 * sx, ty)
    ctx.stroke()
    ctx.fillStyle = '#475569'
    ctx.font = `500 ${Math.round(11 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    ctx.fillText(String(tick.label || ''), stripX + Math.round(4 * scale), ty + Math.round(3 * scale))
  })

  ;(Array.isArray(snapshot.depthGuide?.anchorTrack) ? snapshot.depthGuide.anchorTrack : []).forEach((item) => {
    const ty = stripY + Number(item.y) * sy
    ctx.strokeStyle = 'rgba(15,23,42,0.75)'
    ctx.beginPath()
    ctx.moveTo(stripX + 46 * sx, ty)
    ctx.lineTo(stripX + 58 * sx, ty)
    ctx.stroke()
    ctx.fillStyle = '#0f766e'
    ctx.beginPath()
    ctx.arc(stripX + 37 * sx, ty, Math.max(2, Number(item.r) * scale * 0.45), 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#334155'
    ctx.font = `500 ${Math.round(11 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    ctx.fillText(String(item.shortLabel || item.name || ''), stripX + 61 * sx, ty + Math.round(3 * scale))
  })

  const noteBlocks = (Array.isArray(snapshot.depthGuide?.notes) ? snapshot.depthGuide.notes : [])
    .map((line) => measureTextBlock(ctx, line, notesW, Math.round(15 * scale)))
  let noteY = stripY + Math.round(8 * scale)
  ctx.fillStyle = '#334155'
  ctx.font = `500 ${Math.round(13 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  noteBlocks.forEach((block) => {
    drawTextLines(ctx, block.lines, notesX, noteY, Math.round(15 * scale))
    noteY += block.height + Math.round(8 * scale)
  })
}

const drawExportOverlay = (ctx, width, height, snapshot) => {
  const labels = snapshot.publicationLabels || {}
  const scale = Math.max(0.8, width / 2400)
  const pad = Math.round(48 * scale)
  const gap = Math.round(24 * scale)
  const headingBandH = Math.round(74 * scale)

  const methodRows = normalizeRows(snapshot.methodProvenanceRows)
  const captionRows = normalizeRows(snapshot.publicationCaptionRows)
  const noteRows = normalizeRows(snapshot.publicationNoteRows)
  const hotspotRows = Array.isArray(snapshot.hotspotRows) ? snapshot.hotspotRows.slice(0, 2) : []
  const anchorRows = Array.isArray(snapshot.anchorRows) ? snapshot.anchorRows : []

  const captionPanelX = pad
  const captionPanelW = width - pad * 2
  const captionColumnGap = Math.round(28 * scale)
  const captionInnerPad = Math.round(22 * scale)
  const captionHeaderLineHeight = Math.round(22 * scale)
  const captionRowLineHeight = Math.round(18 * scale)
  const captionLabelWidth = Math.round(112 * scale)
  const captionColumnWidth = Math.round((captionPanelW - captionInnerPad * 2 - captionColumnGap) / 2)

  ctx.font = `600 ${Math.round(16 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  const captionBodyHeight = measureLabeledRows(ctx, captionRows, captionColumnWidth, {
    labelWidth: captionLabelWidth,
    lineHeight: captionRowLineHeight,
    rowGap: Math.round(10 * scale),
  })
  const noteBodyHeight = measureLabeledRows(ctx, noteRows, captionColumnWidth, {
    labelWidth: captionLabelWidth,
    lineHeight: captionRowLineHeight,
    rowGap: Math.round(10 * scale),
  })
  const captionPanelH = Math.round(
    captionInnerPad * 2 +
    captionHeaderLineHeight +
    Math.max(captionBodyHeight, noteBodyHeight) +
    10 * scale
  )
  const captionPanelY = height - pad - captionPanelH

  const orientWidth = Math.round(212 * scale)
  const orientHeight = Math.round(116 * scale)
  const orientX = width - pad - orientWidth
  const orientY = pad + headingBandH + gap

  const histPanelW = Math.round(324 * scale)
  const histPanelH = Math.round(206 * scale)
  const histX = width - pad - histPanelW
  const histY = captionPanelY - gap - histPanelH

  const leftPanelX = pad
  const leftPanelY = pad + headingBandH + gap
  const leftPanelW = Math.min(width * 0.58, Math.round(1120 * scale))
  const leftInnerPad = Math.round(24 * scale)
  const leftContentW = leftPanelW - leftInnerPad * 2
  const methodsHeaderGap = Math.round(18 * scale)
  const blockGap = Math.round(12 * scale)
  const methodLabelWidth = Math.round(146 * scale)
  const rowLineHeight = Math.round(20 * scale)

  const scienceColumnX = leftPanelX + leftPanelW + gap
  const scienceColumnW = Math.max(Math.round(210 * scale), Math.min(Math.round(320 * scale), histX - scienceColumnX - gap))
  const insetPanelH = Math.round(178 * scale)
  const sectionPanelH = Math.round(190 * scale)
  const depthPanelH = Math.round(202 * scale)
  const insetPanelX = scienceColumnX
  const insetPanelY = orientY
  const sectionPanelX = scienceColumnX
  const sectionPanelY = insetPanelY + insetPanelH + gap
  const depthPanelX = scienceColumnX
  const depthPanelY = sectionPanelY + sectionPanelH + gap

  ctx.font = `500 ${Math.round(20 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  const metaLines = [
    snapshot.metaLine,
    snapshot.structureLine,
    snapshot.quantLine,
    snapshot.coverLine,
    snapshot.distLine,
    snapshot.methodsLine,
    snapshot.narrativeLine,
  ].filter(Boolean)
  const metaHeights = metaLines.map((line) => measureTextBlock(ctx, line, leftContentW, rowLineHeight))
  const hotspotBlocks = hotspotRows.map((line) => measureTextBlock(ctx, line, leftContentW - Math.round(18 * scale), rowLineHeight))
  const anchorBlocks = anchorRows.map((line) => measureTextBlock(ctx, line, leftContentW - Math.round(18 * scale), rowLineHeight))
  const summaryLineHeight = Math.round(22 * scale)
  const summaryBlock = measureTextBlock(ctx, snapshot.summaryLead, leftContentW, summaryLineHeight)
  const methodsFooterBlock = measureTextBlock(ctx, snapshot.methodsFooter, leftContentW, Math.round(18 * scale))

  ctx.font = `600 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  const methodsHeight = measureLabeledRows(ctx, methodRows, leftContentW, {
    labelWidth: methodLabelWidth,
    lineHeight: rowLineHeight,
    rowGap: Math.round(8 * scale),
  })

  const leftPanelH = Math.round(
    leftInnerPad * 2 +
    22 * scale +
    summaryBlock.height +
    18 * scale +
    26 * scale +
    26 * scale +
    metaHeights.reduce((sum, item) => sum + item.height + blockGap, 0) +
    (methodRows.length ? methodsHeaderGap + Math.round(22 * scale) + methodsHeight : 0) +
    (hotspotRows.length ? methodsHeaderGap + Math.round(22 * scale) + hotspotBlocks.reduce((sum, item) => sum + item.height + 6 * scale, 0) : 0) +
    (anchorRows.length ? methodsHeaderGap + Math.round(22 * scale) + anchorBlocks.reduce((sum, item) => sum + item.height + 6 * scale, 0) : 0) +
    (snapshot.methodsFooter ? methodsHeaderGap + Math.round(20 * scale) + methodsFooterBlock.height : 0)
  )

  createPanel(ctx, pad, pad, width - pad * 2, headingBandH)
  createPanel(ctx, leftPanelX, leftPanelY, leftPanelW, leftPanelH)
  createPanel(ctx, orientX, orientY, orientWidth, orientHeight)
  createPanel(ctx, histX, histY, histPanelW, histPanelH)
  createPanel(ctx, captionPanelX, captionPanelY, captionPanelW, captionPanelH)
  if (scienceColumnW > Math.round(180 * scale)) {
    drawInsetPanel(ctx, insetPanelX, insetPanelY, scienceColumnW, insetPanelH, snapshot, scale)
    drawSectionPanel(ctx, sectionPanelX, sectionPanelY, scienceColumnW, sectionPanelH, snapshot, scale)
    drawDepthGuidePanel(ctx, depthPanelX, depthPanelY, scienceColumnW, depthPanelH, snapshot, scale)
  }

  ctx.fillStyle = '#0f172a'
  ctx.font = `700 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(snapshot.figureHeading || 'Figure 1 | Geological-stress fusion diagnostics', pad + Math.round(22 * scale), pad + Math.round(26 * scale))
  ctx.fillStyle = '#334155'
  ctx.font = `600 ${Math.round(28 * scale)}px "Times New Roman", "Noto Serif SC", serif`
  ctx.fillText(snapshot.captionTitle || snapshot.title || 'Figure title', pad + Math.round(22 * scale), pad + Math.round(56 * scale))

  let cursorY = leftPanelY + leftInnerPad
  ctx.fillStyle = '#0f172a'
  ctx.font = `700 ${Math.round(20 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText('Summary', leftPanelX + leftInnerPad, cursorY)

  cursorY += Math.round(22 * scale)
  ctx.fillStyle = '#1f2937'
  ctx.font = `500 ${Math.round(20 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  drawTextLines(ctx, summaryBlock.lines, leftPanelX + leftInnerPad, cursorY, summaryLineHeight)
  cursorY += summaryBlock.height + Math.round(18 * scale)

  ctx.fillStyle = '#475569'
  ctx.font = `500 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(snapshot.metricLine, leftPanelX + leftInnerPad, cursorY)

  cursorY += Math.round(26 * scale)
  ctx.fillStyle = '#334155'
  ctx.font = `500 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(snapshot.profileLine, leftPanelX + leftInnerPad, cursorY)

  cursorY += Math.round(26 * scale)
  ctx.fillStyle = '#334155'
  ctx.font = `500 ${Math.round(20 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  metaHeights.forEach((item) => {
    drawTextLines(ctx, item.lines, leftPanelX + leftInnerPad, cursorY, rowLineHeight)
    cursorY += item.height + blockGap
  })

  if (methodRows.length) {
    cursorY += Math.round(10 * scale)
    ctx.fillStyle = '#0f172a'
    ctx.font = `600 ${Math.round(21 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    ctx.fillText(labels.methodsPanel || 'Methods and provenance', leftPanelX + leftInnerPad, cursorY)
    cursorY += Math.round(22 * scale)
    drawLabeledRows(ctx, methodRows, leftPanelX + leftInnerPad, cursorY, leftContentW, {
      labelWidth: methodLabelWidth,
      lineHeight: rowLineHeight,
      rowGap: Math.round(8 * scale),
      labelFont: `600 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`,
      valueFont: `500 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`,
      labelColor: '#0f172a',
      valueColor: '#334155',
    })
    cursorY += methodsHeight + Math.round(8 * scale)
  }

  if (hotspotRows.length) {
    cursorY += Math.round(12 * scale)
    ctx.fillStyle = '#0f172a'
    ctx.font = `600 ${Math.round(21 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    ctx.fillText('Hotspot summary', leftPanelX + leftInnerPad, cursorY)
    cursorY += Math.round(22 * scale)
    ctx.fillStyle = '#334155'
    ctx.font = `500 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    hotspotBlocks.forEach((item) => {
      drawTextLines(ctx, item.lines, leftPanelX + leftInnerPad + Math.round(18 * scale), cursorY, rowLineHeight)
      cursorY += item.height + Math.round(6 * scale)
    })
  }

  if (anchorRows.length) {
    cursorY += Math.round(12 * scale)
    ctx.fillStyle = '#0f172a'
    ctx.font = `600 ${Math.round(21 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    ctx.fillText('Top depth anchors', leftPanelX + leftInnerPad, cursorY)
    cursorY += Math.round(22 * scale)
    ctx.fillStyle = '#334155'
    ctx.font = `500 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    anchorBlocks.forEach((item) => {
      drawTextLines(ctx, item.lines, leftPanelX + leftInnerPad + Math.round(18 * scale), cursorY, rowLineHeight)
      cursorY += item.height + Math.round(6 * scale)
    })
  }

  if (snapshot.methodsFooter) {
    cursorY += Math.round(12 * scale)
    ctx.fillStyle = '#0f172a'
    ctx.font = `600 ${Math.round(19 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    ctx.fillText('Methods footer', leftPanelX + leftInnerPad, cursorY)
    cursorY += Math.round(20 * scale)
    ctx.fillStyle = '#475569'
    ctx.font = `500 ${Math.round(17 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    drawTextLines(ctx, methodsFooterBlock.lines, leftPanelX + leftInnerPad, cursorY, Math.round(18 * scale))
    cursorY += methodsFooterBlock.height
  }

  ctx.fillStyle = '#0f172a'
  ctx.font = `700 ${Math.round(24 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText('N', orientX + Math.round(18 * scale), orientY + Math.round(32 * scale))
  ctx.fillStyle = '#0f766e'
  ctx.font = `700 ${Math.round(30 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText('^', orientX + Math.round(42 * scale), orientY + Math.round(36 * scale))

  const barX = orientX + Math.round(18 * scale)
  const barY = orientY + Math.round(54 * scale)
  const barW = Math.round(98 * scale)
  const barH = Math.round(10 * scale)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(barX, barY, Math.round(barW / 2), barH)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(barX + Math.round(barW / 2), barY, Math.round(barW / 2), barH)
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = Math.max(2, 2 * scale)
  ctx.strokeRect(barX, barY, barW, barH)
  ctx.fillStyle = '#334155'
  ctx.font = `600 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(snapshot.scaleBarLabel, barX, orientY + Math.round(82 * scale))
  ctx.fillStyle = '#64748b'
  ctx.font = `500 ${Math.round(16 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText('X-east / Y-north', barX, orientY + Math.round(102 * scale))

  ctx.fillStyle = '#0f172a'
  ctx.font = `700 ${Math.round(21 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  drawSubfigureLabel(ctx, snapshot.subfigureLabels?.distribution || 'b', histX + Math.round(16 * scale), histY + Math.round(30 * scale), scale)
  ctx.fillText(labels.distributionTitle || 'MPI distribution', histX + Math.round(42 * scale), histY + Math.round(30 * scale))

  const chartX = histX + Math.round(16 * scale)
  const chartY = histY + Math.round(42 * scale)
  const chartW = histPanelW - Math.round(32 * scale)
  const chartH = Math.round(112 * scale)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(chartX, chartY, chartW, chartH)
  ctx.strokeStyle = 'rgba(100,116,139,0.36)'
  ctx.lineWidth = Math.max(1, 1 * scale)
  ctx.strokeRect(chartX, chartY, chartW, chartH)

  ;(Array.isArray(snapshot.histogramBars) ? snapshot.histogramBars : []).forEach((bar) => {
    const x = chartX + (Number(bar.x) / 100) * chartW
    const y = chartY + (Number(bar.y) / 38) * chartH
    const w = Math.max(1, (Number(bar.w) / 100) * chartW)
    const h = Math.max(1, (Number(bar.h) / 38) * chartH)
    ctx.fillStyle = 'rgba(15,118,110,0.72)'
    ctx.fillRect(x, y, w, h)
  })

  ctx.setLineDash([Math.max(2, 2 * scale), Math.max(2, 2 * scale)])
  ;(Array.isArray(snapshot.histogramQuantileLines) ? snapshot.histogramQuantileLines : []).forEach((line) => {
    const x = chartX + (Number(line.x) / 100) * chartW
    ctx.strokeStyle = 'rgba(127,29,29,0.86)'
    ctx.beginPath()
    ctx.moveTo(x, chartY)
    ctx.lineTo(x, chartY + chartH)
    ctx.stroke()
    ctx.fillStyle = 'rgba(127,29,29,0.92)'
    ctx.font = `700 ${Math.round(12 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
    ctx.fillText(String(line.id || '').toUpperCase(), x + Math.round(2 * scale), chartY + Math.round(12 * scale))
  })
  ctx.setLineDash([])
  ctx.fillStyle = '#334155'
  ctx.font = `600 ${Math.round(16 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(snapshot.histogramFooter, chartX, histY + histPanelH - Math.round(18 * scale))

  const captionLeftX = captionPanelX + captionInnerPad
  const captionRightX = captionLeftX + captionColumnWidth + captionColumnGap
  const captionHeaderY = captionPanelY + captionInnerPad
  const captionBodyY = captionHeaderY + captionHeaderLineHeight + Math.round(10 * scale)

  ctx.fillStyle = '#0f172a'
  ctx.font = `700 ${Math.round(18 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`
  ctx.fillText(labels.captionBlock || 'Figure caption', captionLeftX, captionHeaderY)
  ctx.fillText(labels.notesBlock || 'Notes and abbreviations', captionRightX, captionHeaderY)

  drawLabeledRows(ctx, captionRows, captionLeftX, captionBodyY, captionColumnWidth, {
    labelWidth: captionLabelWidth,
    lineHeight: captionRowLineHeight,
    rowGap: Math.round(10 * scale),
    labelFont: `600 ${Math.round(16 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`,
    valueFont: `500 ${Math.round(16 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`,
    labelColor: '#0f172a',
    valueColor: '#334155',
  })
  drawLabeledRows(ctx, noteRows, captionRightX, captionBodyY, captionColumnWidth, {
    labelWidth: captionLabelWidth,
    lineHeight: captionRowLineHeight,
    rowGap: Math.round(10 * scale),
    labelFont: `600 ${Math.round(16 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`,
    valueFont: `500 ${Math.round(16 * scale)}px "Segoe UI", "Noto Sans SC", sans-serif`,
    labelColor: '#0f172a',
    valueColor: '#334155',
  })
}

const canvasToBlob = (canvas, type = 'image/png') => new Promise((resolve, reject) => {
  if (canvas.toBlob) {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('canvas toBlob failed'))
    }, type)
    return
  }

  try {
    const dataUrl = canvas.toDataURL(type)
    fetch(dataUrl).then((resp) => resp.blob()).then(resolve).catch(reject)
  } catch (error) {
    reject(error)
  }
})

const buildExportName = (metric) => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const mi = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  return `fusion_figure_${String(metric || 'mpi').toLowerCase()}_${y}${m}${d}_${h}${mi}${s}.png`
}

const getExportSize = (options = {}) => {
  const width = Math.max(1600, Math.round(Number(options?.width) || 3840))
  const height = Math.max(1000, Math.round(Number(options?.height) || 2400))
  return { width, height }
}

const renderExportCanvas = ({ renderer, scene, camera, controls, rootGroup, three, autoRotateRef, applyPaperViewPose, snapshot }, options = {}) => {
  if (!renderer || !scene || !camera || !controls || !rootGroup || !three) return null

  const oldAutoRotate = autoRotateRef.value
  const oldRootRotation = rootGroup.rotation.clone()
  const oldCameraPosition = camera.position.clone()
  const oldCameraQuaternion = camera.quaternion.clone()
  const oldTarget = controls.target.clone()
  const oldNear = camera.near
  const oldFar = camera.far
  const oldAspect = camera.aspect
  const oldPixelRatio = renderer.getPixelRatio()
  const oldSize = renderer.getSize(new three.Vector2())
  const { width: exportWidth, height: exportHeight } = getExportSize(options)

  try {
    autoRotateRef.value = false
    rootGroup.rotation.set(0, 0, 0)
    applyPaperViewPose()

    renderer.setPixelRatio(1)
    renderer.setSize(exportWidth, exportHeight, false)
    camera.aspect = exportWidth / exportHeight
    camera.updateProjectionMatrix()
    controls.update()
    renderer.render(scene, camera)

    const output = document.createElement('canvas')
    output.width = exportWidth
    output.height = exportHeight
    const ctx = output.getContext('2d')
    if (!ctx) throw new Error('2D context unavailable')

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, exportWidth, exportHeight)
    ctx.drawImage(renderer.domElement, 0, 0, exportWidth, exportHeight)
    drawExportOverlay(ctx, exportWidth, exportHeight, snapshot)
    return output
  } catch (error) {
    console.error('Export fusion figure failed:', error)
    return null
  } finally {
    renderer.setPixelRatio(oldPixelRatio)
    renderer.setSize(oldSize.x, oldSize.y, false)

    camera.aspect = oldAspect
    camera.near = oldNear
    camera.far = oldFar
    camera.position.copy(oldCameraPosition)
    camera.quaternion.copy(oldCameraQuaternion)
    camera.updateProjectionMatrix()

    controls.target.copy(oldTarget)
    controls.update()
    rootGroup.rotation.copy(oldRootRotation)
    autoRotateRef.value = oldAutoRotate
    renderer.render(scene, camera)
  }
}

export const exportGeoFusionFigureBlob = async (context, options = {}) => {
  const canvas = renderExportCanvas(context, options)
  if (!canvas) return null

  const blob = await canvasToBlob(canvas, 'image/png')
  return {
    blob,
    filename: buildExportName(context.snapshot?.metric),
    width: canvas.width,
    height: canvas.height
  }
}
