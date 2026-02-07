import * as d3 from 'd3'

const METRIC_PALETTES = {
  mpi: ['#3b82f6', '#facc15', '#fb923c', '#f87171', '#dc2626'],
  rsi: ['#dc2626', '#fb923c', '#facc15', '#84cc16', '#16a34a'],
  bri: ['#dc2626', '#fb923c', '#facc15', '#84cc16', '#16a34a'],
  asi: ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#dc2626']
}

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const colorToRgb = (color) => {
  const text = String(color || '')
  const m = text.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (m) {
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) }
  }
  return null
}
const toMutedGray = (color, ratio = 0.8) => {
  const rgb = colorToRgb(color)
  if (!rgb) return '#94a3b8'
  const gray = Math.round(rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114)
  const blended = Math.round(gray * ratio + 235 * (1 - ratio))
  return `rgb(${blended},${blended},${blended})`
}

const safeStats = (stats) => {
  const min = Number(stats?.min ?? 0)
  const max = Number(stats?.max ?? 100)
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    return { min: 0, max: 100 }
  }
  return { min, max }
}

export function useIndicatorCanvas() {
  const getPalette = (metric) => METRIC_PALETTES[metric] || METRIC_PALETTES.mpi

  const getLegendGradient = (metric) => {
    const colors = getPalette(metric)
    return `linear-gradient(90deg, ${colors.join(',')})`
  }

  const getColor = (metric, value, stats) => {
    const { min, max } = safeStats(stats)
    const t = clamp01((Number(value) - min) / (max - min))
    const interpolator = d3.interpolateRgbBasis(getPalette(metric))
    return interpolator(t)
  }

  const drawContours = (ctx, grid, bounds, viewport, stats, worldToScreen, options = {}) => {
    const rows = grid.length
    const cols = grid[0]?.length || 0
    if (rows < 2 || cols < 2) return
    const values = new Array(rows * cols)
    let idx = 0
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        values[idx] = Number(grid[i][j] || 0)
        idx += 1
      }
    }
    const { min, max } = safeStats(stats)
    const contourLevels = Math.max(5, Number(options.contourLevels || 9))
    const thresholds = d3.ticks(min, max, contourLevels).slice(1, -1)
    if (!thresholds.length) return
    const contours = d3.contours().size([cols, rows]).thresholds(thresholds)(values)
    const worldW = Math.max(bounds.max_x - bounds.min_x, 1e-6)
    const worldH = Math.max(bounds.max_y - bounds.min_y, 1e-6)

    ctx.save()
    ctx.strokeStyle = options.contourColor || 'rgba(15,23,42,0.32)'
    ctx.lineWidth = viewport.scale > 2 ? 1.2 : 0.9
    ctx.globalAlpha = viewport.scale < 0.65 ? 0.45 : 0.7

    for (const contour of contours) {
      for (const polygon of contour.coordinates) {
        for (const ring of polygon) {
          if (!Array.isArray(ring) || ring.length < 2) continue
          ctx.beginPath()
          for (let i = 0; i < ring.length; i += 1) {
            const point = ring[i]
            const wx = bounds.min_x + (point[0] / Math.max(cols - 1, 1)) * worldW
            const wy = bounds.max_y - (point[1] / Math.max(rows - 1, 1)) * worldH
            const p = worldToScreen(wx, wy, bounds)
            if (i === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
          }
          ctx.closePath()
          ctx.stroke()
        }
      }
    }
    ctx.restore()
  }

  const drawGrid = (ctx, grid, bounds, viewport, metric, stats, worldToScreen, options = {}) => {
    if (!ctx || !Array.isArray(grid) || grid.length === 0 || !bounds) return
    const rows = grid.length
    const cols = grid[0]?.length || 0
    if (!cols) return

    const worldW = bounds.max_x - bounds.min_x
    const worldH = bounds.max_y - bounds.min_y
    const cellW = worldW / cols
    const cellH = worldH / rows
    const canvasW = ctx.canvas.width
    const canvasH = ctx.canvas.height

    for (let i = 0; i < rows; i += 1) {
      const row = grid[i]
      const wy = bounds.max_y - i * cellH
      for (let j = 0; j < cols; j += 1) {
        const wx = bounds.min_x + j * cellW
        const p1 = worldToScreen(wx, wy, bounds)
        const p2 = worldToScreen(wx + cellW, wy - cellH, bounds)
        const x = Math.min(p1.x, p2.x)
        const y = Math.min(p1.y, p2.y)
        const w = Math.abs(p2.x - p1.x) + 0.8
        const h = Math.abs(p2.y - p1.y) + 0.8

        if (x > canvasW || x + w < 0 || y > canvasH || y + h < 0) continue
        ctx.fillStyle = getColor(metric, Number(row[j] || 0), stats)
        ctx.fillRect(x, y, w, h)
      }
    }

    if (options.showContours !== false) {
      drawContours(ctx, grid, bounds, viewport, stats, worldToScreen, options)
    }

    if (viewport.scale > 3.2) {
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i <= rows; i += 1) {
        const wy = bounds.max_y - i * cellH
        const s1 = worldToScreen(bounds.min_x, wy, bounds)
        const s2 = worldToScreen(bounds.max_x, wy, bounds)
        ctx.moveTo(s1.x, s1.y)
        ctx.lineTo(s2.x, s2.y)
      }
      for (let j = 0; j <= cols; j += 1) {
        const wx = bounds.min_x + j * cellW
        const s1 = worldToScreen(wx, bounds.min_y, bounds)
        const s2 = worldToScreen(wx, bounds.max_y, bounds)
        ctx.moveTo(s1.x, s1.y)
        ctx.lineTo(s2.x, s2.y)
      }
      ctx.stroke()
    }
  }

  const drawBoreholes = (ctx, boreholes, metric, stats, bounds, worldToScreen, hoveredName = '', focus = null) => {
    if (!ctx || !Array.isArray(boreholes) || !bounds) return
    const hasFocus = !!(focus?.active && focus?.indexSet instanceof Set && focus.indexSet.size > 0)
    const accent = String(focus?.accent || '#111827')
    const animatePulse = !!focus?.animate
    const pulseT = Number(focus?.pulseT || 0)
    for (let i = 0; i < boreholes.length; i += 1) {
      const b = boreholes[i]
      const p = worldToScreen(b.x, b.y, bounds)
      const isHover = hoveredName && hoveredName === b.borehole_name
      const isSelected = !hasFocus || focus.indexSet.has(i)
      const pulse = animatePulse && hasFocus && isSelected ? (Math.sin(pulseT * 5 + i * 0.35) + 1) / 2 : 0
      const radius = isHover ? 7.5 : (isSelected && hasFocus ? 6.6 : 5.8)
      ctx.save()
      const baseColor = getColor(metric, b[metric], stats)
      ctx.globalAlpha = hasFocus && !isSelected ? 0.24 : 1
      ctx.fillStyle = hasFocus && !isSelected ? toMutedGray(baseColor, 0.84) : baseColor
      ctx.strokeStyle = isHover ? '#111827' : (isSelected && hasFocus ? accent : 'rgba(255,255,255,0.95)')
      ctx.lineWidth = isHover ? 2.4 : 1.8
      ctx.beginPath()
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      if (isSelected && hasFocus && !isHover) {
        ctx.globalAlpha = 0.95
        ctx.strokeStyle = accent
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius + 3.6, 0, Math.PI * 2)
        ctx.stroke()
        if (animatePulse) {
          ctx.globalAlpha = 0.35 + pulse * 0.45
          ctx.lineWidth = 1.6 + pulse * 0.9
          ctx.beginPath()
          ctx.arc(p.x, p.y, radius + 6 + pulse * 5.5, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
      ctx.restore()
    }
  }

  const pickNearestBorehole = (sx, sy, boreholes, bounds, worldToScreen, radiusPx = 14) => {
    if (!Array.isArray(boreholes) || !bounds) return null
    let nearest = null
    let minDist = Number.POSITIVE_INFINITY
    for (const b of boreholes) {
      const p = worldToScreen(b.x, b.y, bounds)
      const dist = Math.hypot(sx - p.x, sy - p.y)
      if (dist < minDist) {
        minDist = dist
        nearest = b
      }
    }
    return minDist <= radiusPx ? nearest : null
  }

  const sampleGridValue = (grid, bounds, wx, wy) => {
    if (!Array.isArray(grid) || grid.length === 0 || !bounds) return null
    const rows = grid.length
    const cols = grid[0]?.length || 0
    if (!cols) return null
    const tx = clamp01((wx - bounds.min_x) / Math.max(bounds.max_x - bounds.min_x, 1e-6))
    const ty = clamp01((bounds.max_y - wy) / Math.max(bounds.max_y - bounds.min_y, 1e-6))
    const col = Math.max(0, Math.min(cols - 1, Math.floor(tx * (cols - 1))))
    const row = Math.max(0, Math.min(rows - 1, Math.floor(ty * (rows - 1))))
    return Number(grid[row][col])
  }

  const drawMiniHeatmap = (canvas, grid, metric, stats) => {
    if (!canvas || !Array.isArray(grid) || grid.length === 0) return
    const dpr = window.devicePixelRatio || 1
    const cssW = canvas.clientWidth || 150
    const cssH = canvas.clientHeight || 110
    canvas.width = Math.round(cssW * dpr)
    canvas.height = Math.round(cssH * dpr)
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, cssW, cssH)

    const rows = grid.length
    const cols = grid[0]?.length || 0
    if (!cols) return
    const cellW = cssW / cols
    const cellH = cssH / rows
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        ctx.fillStyle = getColor(metric, Number(grid[i][j] || 0), stats)
        ctx.fillRect(j * cellW, i * cellH, cellW + 0.4, cellH + 0.4)
      }
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.strokeRect(0, 0, cssW, cssH)
  }

  return {
    getLegendGradient,
    drawGrid,
    drawBoreholes,
    pickNearestBorehole,
    sampleGridValue,
    drawMiniHeatmap
  }
}
