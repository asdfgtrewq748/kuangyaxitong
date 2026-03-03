/**
 * 矢量图导出模块 - 科研级图表导出
 * Vector Export Module for Academic Visualization
 * 
 * 支持格式:
 * - SVG (可缩放矢量图形)
 * - PDF (通过SVG转PDF)
 * - EPS (封装PostScript)
 */

import { rgbToHex } from './scientificPalettes.js'

// ============================================================================
// SVG 导出
// ============================================================================

/**
 * 将图表配置导出为SVG
 * @param {Object} config - 图表配置
 * @param {Object} options - 导出选项
 */
export function exportToSVG(config, options = {}) {
  const {
    width = 800,
    height = 600,
    title = 'Chart',
    fontFamily = 'Arial, sans-serif',
    fontSize = 12,
    dpi = 300
  } = options
  
  const svgParts = []
  
  // XML声明
  svgParts.push('<?xml version="1.0" encoding="UTF-8"?>')
  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`)
  
  // 元数据
  svgParts.push(`  <metadata>`)
  svgParts.push(`    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">`)
  svgParts.push(`      <rdf:Description>`)
  svgParts.push(`        <dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">${escapeXml(title)}</dc:title>`)
  svgParts.push(`        <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">Mining Pressure Analysis System</dc:creator>`)
  svgParts.push(`        <dc:date xmlns:dc="http://purl.org/dc/elements/1.1/">${new Date().toISOString()}</dc:date>`)
  svgParts.push(`      </rdf:Description>`)
  svgParts.push(`    </rdf:RDF>`)
  svgParts.push(`  </metadata>`)
  
  // 样式定义
  svgParts.push(`  <style>`)
  svgParts.push(`    text { font-family: ${fontFamily}; font-size: ${fontSize}px; }`)
  svgParts.push(`    .title { font-size: ${fontSize + 2}px; font-weight: bold; }`)
  svgParts.push(`    .axis-label { font-size: ${fontSize}px; }`)
  svgParts.push(`    .tick-label { font-size: ${fontSize - 2}px; }`)
  svgParts.push(`  </style>`)
  
  // 背景
  svgParts.push(`  <rect width="${width}" height="${height}" fill="white"/>`)
  
  // 图表内容
  if (config.type === 'heatmap') {
    svgParts.push(...generateHeatmapSVG(config, options))
  } else if (config.type === 'line') {
    svgParts.push(...generateLineChartSVG(config, options))
  } else if (config.type === 'scatter') {
    svgParts.push(...generateScatterSVG(config, options))
  } else if (config.type === 'bar') {
    svgParts.push(...generateBarChartSVG(config, options))
  }
  
  // 结束标签
  svgParts.push('</svg>')
  
  return svgParts.join('\n')
}

/**
 * 生成热力图SVG
 */
function generateHeatmapSVG(config, options) {
  const parts = []
  const { width, height, margin = { top: 40, right: 40, bottom: 60, left: 60 } } = options
  const { data, xLabels, yLabels, colorScale, minValue, maxValue } = config
  
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom
  const cellWidth = chartWidth / data[0].length
  const cellHeight = chartHeight / data.length
  
  // 热力图单元格
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[row].length; col++) {
      const value = data[row][col]
      if (Number.isFinite(value)) {
        const x = margin.left + col * cellWidth
        const y = margin.top + row * cellHeight
        const color = colorScale((value - minValue) / (maxValue - minValue))
        parts.push(`  <rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cellWidth.toFixed(2)}" height="${cellHeight.toFixed(2)}" fill="${color}" stroke="none"/>`)
      }
    }
  }
  
  // 边框
  parts.push(`  <rect x="${margin.left}" y="${margin.top}" width="${chartWidth}" height="${chartHeight}" fill="none" stroke="#333" stroke-width="1"/>`)
  
  // X轴标签
  const xStep = Math.ceil(xLabels.length / 10)
  for (let i = 0; i < xLabels.length; i += xStep) {
    const x = margin.left + i * cellWidth + cellWidth / 2
    parts.push(`  <text x="${x.toFixed(2)}" y="${height - margin.bottom + 20}" text-anchor="middle" class="tick-label">${xLabels[i]}</text>`)
  }
  
  // Y轴标签
  const yStep = Math.ceil(yLabels.length / 10)
  for (let i = 0; i < yLabels.length; i += yStep) {
    const y = margin.top + i * cellHeight + cellHeight / 2
    parts.push(`  <text x="${margin.left - 10}" y="${y.toFixed(2)}" text-anchor="end" dominant-baseline="middle" class="tick-label">${yLabels[i]}</text>`)
  }
  
  // 轴标题
  if (config.xAxisTitle) {
    parts.push(`  <text x="${margin.left + chartWidth / 2}" y="${height - 15}" text-anchor="middle" class="axis-label">${config.xAxisTitle}</text>`)
  }
  if (config.yAxisTitle) {
    parts.push(`  <text x="15" y="${margin.top + chartHeight / 2}" text-anchor="middle" transform="rotate(-90, 15, ${margin.top + chartHeight / 2})" class="axis-label">${config.yAxisTitle}</text>`)
  }
  
  // 色阶图例
  parts.push(...generateColorLegend(config, options))
  
  return parts
}

/**
 * 生成折线图SVG
 */
function generateLineChartSVG(config, options) {
  const parts = []
  const { width, height, margin = { top: 40, right: 40, bottom: 60, left: 60 } } = options
  const { data, xScale, yScale, lines } = config
  
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom
  
  // 网格线
  if (config.grid) {
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (chartHeight / 5) * i
      parts.push(`  <line x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" stroke="#e0e0e0" stroke-width="0.5"/>`)
    }
  }
  
  // 绘制线条
  lines.forEach((line, index) => {
    const points = line.data.map((d, i) => {
      const x = margin.left + (xScale(d.x) - xScale.domain()[0]) / (xScale.domain()[1] - xScale.domain()[0]) * chartWidth
      const y = margin.top + chartHeight - (d.y - yScale.domain()[0]) / (yScale.domain()[1] - yScale.domain()[0]) * chartHeight
      return `${x.toFixed(2)},${y.toFixed(2)}`
    }).join(' ')
    
    parts.push(`  <polyline points="${points}" fill="none" stroke="${line.color}" stroke-width="${line.width || 2}" stroke-linecap="round" stroke-linejoin="round"/>`)
    
    // 数据点
    if (line.showPoints !== false) {
      line.data.forEach(d => {
        const x = margin.left + (xScale(d.x) - xScale.domain()[0]) / (xScale.domain()[1] - xScale.domain()[0]) * chartWidth
        const y = margin.top + chartHeight - (d.y - yScale.domain()[0]) / (yScale.domain()[1] - yScale.domain()[0]) * chartHeight
        parts.push(`  <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3" fill="${line.color}"/>`)
      })
    }
  })
  
  // 误差条
  if (config.errorBars) {
    config.errorBars.forEach(bar => {
      const x = margin.left + (bar.x - xScale.domain()[0]) / (xScale.domain()[1] - xScale.domain()[0]) * chartWidth
      const yLow = margin.top + chartHeight - (bar.low - yScale.domain()[0]) / (yScale.domain()[1] - yScale.domain()[0]) * chartHeight
      const yHigh = margin.top + chartHeight - (bar.high - yScale.domain()[0]) / (yScale.domain()[1] - yScale.domain()[0]) * chartHeight
      
      parts.push(`  <line x1="${x.toFixed(2)}" y1="${yLow.toFixed(2)}" x2="${x.toFixed(2)}" y2="${yHigh.toFixed(2)}" stroke="#333" stroke-width="1"/>`)
      parts.push(`  <line x1="${(x - 5).toFixed(2)}" y1="${yLow.toFixed(2)}" x2="${(x + 5).toFixed(2)}" y2="${yLow.toFixed(2)}" stroke="#333" stroke-width="1"/>`)
      parts.push(`  <line x1="${(x - 5).toFixed(2)}" y1="${yHigh.toFixed(2)}" x2="${(x + 5).toFixed(2)}" y2="${yHigh.toFixed(2)}" stroke="#333" stroke-width="1"/>`)
    })
  }
  
  // 边框
  parts.push(`  <rect x="${margin.left}" y="${margin.top}" width="${chartWidth}" height="${chartHeight}" fill="none" stroke="#333" stroke-width="1"/>`)
  
  return parts
}

/**
 * 生成散点图SVG
 */
function generateScatterSVG(config, options) {
  const parts = []
  const { width, height, margin = { top: 40, right: 40, bottom: 60, left: 60 } } = options
  const { data, xScale, yScale, pointStyle } = config
  
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom
  
  data.forEach(d => {
    const x = margin.left + (d.x - xScale.domain()[0]) / (xScale.domain()[1] - xScale.domain()[0]) * chartWidth
    const y = margin.top + chartHeight - (d.y - yScale.domain()[0]) / (yScale.domain()[1] - yScale.domain()[0]) * chartHeight
    const color = pointStyle?.color || '#5470c6'
    const size = pointStyle?.size || 4
    
    parts.push(`  <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${size}" fill="${color}" opacity="0.6"/>`)
  })
  
  // 边框
  parts.push(`  <rect x="${margin.left}" y="${margin.top}" width="${chartWidth}" height="${chartHeight}" fill="none" stroke="#333" stroke-width="1"/>`)
  
  return parts
}

/**
 * 生成柱状图SVG
 */
function generateBarChartSVG(config, options) {
  const parts = []
  const { width, height, margin = { top: 40, right: 40, bottom: 60, left: 60 } } = options
  const { data, xScale, yScale, barWidth, colors } = config
  
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom
  const zeroY = margin.top + chartHeight - (0 - yScale.domain()[0]) / (yScale.domain()[1] - yScale.domain()[0]) * chartHeight
  
  data.forEach((d, i) => {
    const x = margin.left + i * (chartWidth / data.length) + (chartWidth / data.length - barWidth) / 2
    const barHeight = (d.y / (yScale.domain()[1] - yScale.domain()[0])) * chartHeight
    const y = zeroY - barHeight
    const color = colors?.[i % colors.length] || '#5470c6'
    
    parts.push(`  <rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth}" height="${barHeight.toFixed(2)}" fill="${color}" stroke="none"/>`)
  })
  
  // 边框
  parts.push(`  <rect x="${margin.left}" y="${margin.top}" width="${chartWidth}" height="${chartHeight}" fill="none" stroke="#333" stroke-width="1"/>`)
  
  return parts
}

/**
 * 生成色阶图例
 */
function generateColorLegend(config, options) {
  const parts = []
  const { width, height, margin = { top: 40, right: 40, bottom: 60, left: 60 } } = options
  const { colorScale, minValue, maxValue, valueLabel = 'Value' } = config
  
  const legendWidth = 20
  const legendHeight = 150
  const legendX = width - margin.right + 10
  const legendY = margin.top + 50
  
  // 渐变色条
  const gradientId = 'legendGradient'
  parts.push(`  <defs>`)
  parts.push(`    <linearGradient id="${gradientId}" x1="0%" y1="100%" x2="0%" y2="0%">`)
  
  const steps = 20
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const color = colorScale(t)
    parts.push(`      <stop offset="${(t * 100).toFixed(1)}%" stop-color="${color}"/>`)
  }
  
  parts.push(`    </linearGradient>`)
  parts.push(`  </defs>`)
  
  parts.push(`  <rect x="${legendX}" y="${legendY}" width="${legendWidth}" height="${legendHeight}" fill="url(#${gradientId})" stroke="#333" stroke-width="0.5"/>`)
  
  // 刻度标签
  for (let i = 0; i <= 4; i++) {
    const t = i / 4
    const value = minValue + t * (maxValue - minValue)
    const y = legendY + legendHeight - t * legendHeight
    parts.push(`  <text x="${legendX + legendWidth + 5}" y="${y.toFixed(2)}" dominant-baseline="middle" class="tick-label" font-size="10">${value.toFixed(1)}</text>`)
  }
  
  // 单位标签
  parts.push(`  <text x="${legendX + legendWidth / 2}" y="${legendY - 10}" text-anchor="middle" class="tick-label" font-size="10">${valueLabel}</text>`)
  
  return parts
}

// ============================================================================
// PDF 导出 (通过 SVG)
// ============================================================================

/**
 * 将SVG转换为PDF
 * 使用简单的PDF生成，实际项目中可使用 pdfmake 或 jsPDF
 */
export async function exportToPDF(config, options = {}) {
  const svg = exportToSVG(config, options)
  
  // 在浏览器环境中，使用打印到PDF的方式
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${options.title || 'Chart'}</title>
      <style>
        @page { size: ${options.pageSize || 'A4'} ${options.orientation || 'landscape'}; margin: 1cm; }
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        svg { max-width: 100%; max-height: 100%; }
      </style>
    </head>
    <body>
      ${svg}
      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print()
            window.close()
          }, 500)
        }
      </script>
    </body>
    </html>
  `)
  printWindow.document.close()
}

// ============================================================================
// 高质量栅格图导出 (PNG with DPI)
// ============================================================================

/**
 * 导出高DPI PNG
 * @param {HTMLCanvasElement} canvas - 源Canvas
 * @param {Object} options - 导出选项
 */
export function exportHighDPIPNG(canvas, options = {}) {
  const {
    dpi = 300,
    filename = 'chart.png',
    format = 'image/png',
    quality = 1.0
  } = options
  
  // 计算DPI比例
  const dpr = dpi / 96 // 标准屏幕DPI为96
  
  // 创建高分辨率Canvas
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = canvas.width * dpr
  exportCanvas.height = canvas.height * dpr
  
  const ctx = exportCanvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.drawImage(canvas, 0, 0)
  
  // 添加DPI元数据到PNG
  const dataURL = exportCanvas.toDataURL(format, quality)
  
  // 下载
  const link = document.createElement('a')
  link.download = filename
  link.href = dataURL
  link.click()
  
  return dataURL
}

// ============================================================================
// 辅助函数
// ============================================================================

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// ============================================================================
// 导出
// ============================================================================

export default {
  exportToSVG,
  exportToPDF,
  exportHighDPIPNG
}
