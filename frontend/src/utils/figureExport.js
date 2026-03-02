/**
 * Professional Figure Export Utility
 * Nature Journal compliant export functionality
 */

import {
  NATURE_COLORS,
  NATURE_DIMENSIONS,
  NATURE_EXPORT,
  NATURE_TYPOGRAPHY,
  getPanelLabel,
  QUALITY_CHECKS
} from './natureFigureConfig.js'

// ============================================================================
// Canvas to High-Resolution Export
// ============================================================================

/**
 * Export canvas to high-resolution image
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {Object} options - Export options
 * @returns {Promise<string>} Data URL
 */
export async function exportCanvasToImage(canvas, options = {}) {
  const config = {
    format: 'png',
    dpi: 300,
    width: null,
    height: null,
    padding: 10,
    backgroundColor: '#FFFFFF',
    addPanelLabel: null,
    addFigureCaption: null,
    ...options
  }

  // Calculate dimensions
  const scale = config.dpi / 96  // Canvas default DPI is 96
  const width = (config.width || canvas.width) * scale
  const height = (config.height || canvas.height) * scale
  const padding = config.padding * scale

  // Create high-resolution canvas
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = Math.floor(width + padding * 2)
  exportCanvas.height = Math.floor(height + padding * 2)
  
  const ctx = exportCanvas.getContext('2d', { alpha: false })
  
  // Fill background
  ctx.fillStyle = config.backgroundColor
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
  
  // Scale and draw original canvas
  ctx.save()
  ctx.scale(scale, scale)
  ctx.drawImage(canvas, padding / scale, padding / scale)
  ctx.restore()
  
  // Add panel label if specified
  if (config.addPanelLabel) {
    drawPanelLabel(ctx, config.addPanelLabel, padding, padding, scale)
  }
  
  // Add figure caption if specified
  if (config.addFigureCaption) {
    drawFigureCaption(ctx, config.addFigureCaption, exportCanvas.width, exportCanvas.height, padding, scale)
  }
  
  // Convert to data URL
  const mimeType = `image/${config.format}`
  return exportCanvas.toDataURL(mimeType, 1.0)
}

/**
 * Export to vector SVG format
 * @param {HTMLElement} container - Chart container
 * @param {Object} options - Export options
 * @returns {string} SVG string
 */
export function exportToSVG(container, options = {}) {
  const config = {
    panelLabel: null,
    caption: null,
    width: null,
    height: null,
    fonts: {
      family: 'Arial, Helvetica, sans-serif',
      size: 8
    },
    ...options
  }

  // Find SVG element in container
  const svgElement = container.querySelector('svg')
  if (!svgElement) {
    throw new Error('No SVG element found in container')
  }

  // Clone SVG to avoid modifying original
  const svg = svgElement.cloneNode(true)
  
  // Set dimensions
  if (config.width) svg.setAttribute('width', `${config.width}cm`)
  if (config.height) svg.setAttribute('height', `${config.height}cm`)
  
  // Ensure viewBox
  if (!svg.getAttribute('viewBox')) {
    const width = parseFloat(svg.getAttribute('width')) || 800
    const height = parseFloat(svg.getAttribute('height')) || 600
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  }
  
  // Set font family globally
  svg.style.fontFamily = config.fonts.family
  
  // Ensure all text elements have proper font size
  const textElements = svg.querySelectorAll('text')
  textElements.forEach(text => {
    if (!text.getAttribute('font-size')) {
      text.setAttribute('font-size', `${config.fonts.size}pt`)
    }
    text.setAttribute('font-family', config.fonts.family)
  })
  
  // Add panel label
  if (config.panelLabel) {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    label.setAttribute('x', '10')
    label.setAttribute('y', '20')
    label.setAttribute('font-size', '12pt')
    label.setAttribute('font-weight', 'bold')
    label.setAttribute('font-family', config.fonts.family)
    label.textContent = config.panelLabel
    svg.appendChild(label)
  }
  
  // Convert to string
  const serializer = new XMLSerializer()
  let svgString = serializer.serializeToString(svg)
  
  // Add XML declaration and DOCTYPE
  svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
              '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
              svgString
  
  return svgString
}

/**
 * Download SVG as file
 * @param {string} svgString - SVG content
 * @param {string} filename - Output filename
 */
export function downloadSVG(svgString, filename = 'figure.svg') {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * Export ECharts instance to high-quality image
 * @param {Object} chartInstance - ECharts instance
 * @param {Object} options - Export options
 * @returns {string} Data URL
 */
export function exportECharts(chartInstance, options = {}) {
  const config = {
    type: 'svg',  // SVG preferred for vector quality
    pixelRatio: 2,
    backgroundColor: '#FFFFFF',
    excludeComponents: ['toolbox', 'dataZoom'],
    ...options
  }
  
  if (config.type === 'svg') {
    return chartInstance.getDataURL({
      type: 'svg',
      pixelRatio: config.pixelRatio,
      backgroundColor: config.backgroundColor,
      excludeComponents: config.excludeComponents
    })
  } else {
    return chartInstance.getDataURL({
      type: config.type,
      pixelRatio: config.pixelRatio * 2,  // High DPI
      backgroundColor: config.backgroundColor,
      excludeComponents: config.excludeComponents
    })
  }
}

// ============================================================================
// Figure Composition (Multiple Panels)
// ============================================================================

/**
 * Compose multiple figures into a single multi-panel figure
 * @param {Array} panels - Array of panel configurations
 * @param {Object} options - Composition options
 * @returns {HTMLCanvasElement} Composed canvas
 */
export async function composeMultiPanelFigure(panels, options = {}) {
  const config = {
    layout: 'horizontal',  // 'horizontal', 'vertical', 'grid'
    cols: 2,
    gap: 20,
    dpi: 300,
    panelLabels: true,
    ...options
  }
  
  // Calculate dimensions
  const maxPanelWidth = Math.max(...panels.map(p => p.width || 400))
  const maxPanelHeight = Math.max(...panels.map(p => p.height || 300))
  
  let rows, cols
  if (config.layout === 'grid') {
    cols = config.cols
    rows = Math.ceil(panels.length / cols)
  } else if (config.layout === 'horizontal') {
    cols = panels.length
    rows = 1
  } else {
    cols = 1
    rows = panels.length
  }
  
  const scale = config.dpi / 96
  const gap = config.gap * scale
  const totalWidth = maxPanelWidth * cols * scale + gap * (cols + 1)
  const totalHeight = maxPanelHeight * rows * scale + gap * (rows + 1) + 30 * scale  // Extra space for labels
  
  // Create canvas
  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(totalWidth)
  canvas.height = Math.floor(totalHeight)
  
  const ctx = canvas.getContext('2d', { alpha: false })
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Draw panels
  for (let i = 0; i < panels.length; i++) {
    const panel = panels[i]
    const row = Math.floor(i / cols)
    const col = i % cols
    
    const x = gap + col * (maxPanelWidth * scale + gap)
    const y = gap + row * (maxPanelHeight * scale + gap) + 25 * scale
    
    // Draw panel content
    if (panel.canvas) {
      ctx.drawImage(
        panel.canvas,
        x,
        y,
        (panel.width || panel.canvas.width) * scale,
        (panel.height || panel.canvas.height) * scale
      )
    }
    
    // Draw panel label
    if (config.panelLabels) {
      drawPanelLabel(ctx, getPanelLabel(i), x, y - 20 * scale, scale)
    }
  }
  
  return canvas
}

// ============================================================================
// Drawing Helpers
// ============================================================================

function drawPanelLabel(ctx, label, x, y, scale) {
  ctx.save()
  ctx.font = `bold ${12 * scale}px Arial, Helvetica, sans-serif`
  ctx.fillStyle = '#000000'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(label, x, y)
  ctx.restore()
}

function drawFigureCaption(ctx, caption, width, height, padding, scale) {
  ctx.save()
  ctx.font = `italic ${9 * scale}px Arial, Helvetica, sans-serif`
  ctx.fillStyle = '#333333'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'bottom'
  
  // Word wrap caption
  const maxWidth = width - padding * 2
  const lineHeight = 12 * scale
  const lines = wrapText(ctx, caption, maxWidth)
  
  let y = height - padding
  for (let i = lines.length - 1; i >= 0; i--) {
    ctx.fillText(lines[i], padding, y)
    y -= lineHeight
  }
  ctx.restore()
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let currentLine = ''
  
  for (const word of words) {
    const testLine = currentLine + word + ' '
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine.trim())
      currentLine = word + ' '
    } else {
      currentLine = testLine
    }
  }
  
  lines.push(currentLine.trim())
  return lines
}

// ============================================================================
// Color Space Conversion
// ============================================================================

/**
 * Convert RGB to CMYK color space
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {Object} CMYK values (0-100)
 */
export function rgbToCmyk(r, g, b) {
  r = r / 255
  g = g / 255
  b = b / 255
  
  const k = 1 - Math.max(r, g, b)
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k)
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k)
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k)
  
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  }
}

/**
 * Convert CMYK to RGB color space
 * @param {number} c - Cyan (0-100)
 * @param {number} m - Magenta (0-100)
 * @param {number} y - Yellow (0-100)
 * @param {number} k - Black (0-100)
 * @returns {Object} RGB values (0-255)
 */
export function cmykToRgb(c, m, y, k) {
  c = c / 100
  m = m / 100
  y = y / 100
  k = k / 100
  
  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k))
  }
}

// ============================================================================
// Quality Validation
// ============================================================================

/**
 * Validate figure against Nature standards
 * @param {HTMLCanvasElement} canvas 
 * @returns {Object} Validation results
 */
export function validateFigureQuality(canvas) {
  const results = {
    valid: true,
    warnings: [],
    errors: [],
    recommendations: []
  }
  
  // Check resolution
  const minPixels = NATURE_DIMENSIONS.singleColumn.widthPx
  if (canvas.width < minPixels) {
    results.warnings.push(`Canvas width (${canvas.width}px) below Nature recommended minimum (${minPixels}px for single column)`)
  }
  
  // Check for transparency
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, 10, 10)
  let hasAlpha = false
  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] < 255) {
      hasAlpha = true
      break
    }
  }
  if (hasAlpha) {
    results.warnings.push('Canvas contains transparency - consider using white background for print')
  }
  
  // Check aspect ratio
  const aspectRatio = canvas.width / canvas.height
  if (aspectRatio > 4 || aspectRatio < 0.25) {
    results.recommendations.push('Unusual aspect ratio - verify figure dimensions for publication')
  }
  
  return results
}

// ============================================================================
// Batch Export
// ============================================================================

/**
 * Batch export multiple figures
 * @param {Array} figures - Array of figure configurations
 * @param {Object} options - Batch options
 */
export async function batchExport(figures, options = {}) {
  const config = {
    format: 'png',
    dpi: 300,
    prefix: 'figure',
    zip: false,
    ...options
  }
  
  const exports = []
  
  for (let i = 0; i < figures.length; i++) {
    const figure = figures[i]
    const filename = `${config.prefix}_${String(i + 1).padStart(2, '0')}.${config.format}`
    
    try {
      if (figure.canvas) {
        const dataUrl = await exportCanvasToImage(figure.canvas, {
          format: config.format,
          dpi: config.dpi
        })
        exports.push({ filename, dataUrl, success: true })
      } else if (figure.svg) {
        downloadSVG(figure.svg, filename)
        exports.push({ filename, success: true })
      }
    } catch (error) {
      exports.push({ filename, success: false, error: error.message })
    }
  }
  
  return exports
}

// ============================================================================
// Export utilities
// ============================================================================

export default {
  exportCanvasToImage,
  exportToSVG,
  downloadSVG,
  exportECharts,
  composeMultiPanelFigure,
  rgbToCmyk,
  cmykToRgb,
  validateFigureQuality,
  batchExport
}
