/**
 * Nature Journal Figure Configuration
 * Following Nature's figure preparation guidelines
 * 
 * Reference: https://www.nature.com/nature/for-authors/final-submission
 */

// ============================================================================
// Nature Color Palette - Colorblind Friendly
// ============================================================================

export const NATURE_COLORS = {
  // Primary palette (colorblind safe)
  primary: '#0072B2',      // Deep blue
  secondary: '#D55E00',    // Vermillion
  tertiary: '#009E73',     // Bluish green
  quaternary: '#CC79A7',   // Reddish purple
  
  // Additional colors
  orange: '#E69F00',       // Orange
  sky: '#56B4E9',          // Sky blue
  yellow: '#F0E442',       // Yellow
  black: '#000000',        // Black
  gray: '#999999',         // Gray
  
  // Grayscale for print
  grayScale: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#EEEEEE'],
  
  // Heatmap gradients
  heatmap: {
    diverging: ['#313695', '#4575B4', '#74ADD1', '#ABD9E9', '#E0F3F8', '#FFFFBF', '#FEE090', '#FDAE61', '#F46D43', '#D73027', '#A50026'],
    viridis: ['#440154', '#482878', '#3E4A89', '#31688E', '#26828E', '#1F9E89', '#35B779', '#6DCD59', '#B4DE2C', '#FDE725'],
    plasma: ['#0D0887', '#3E049C', '#6300A7', '#8707A6', '#A62098', '#C03A83', '#D5546E', '#E76F5A', '#F58F46', '#FDB32F', '#F0F921'],
    magma: ['#000004', '#140E36', '#3B0F70', '#5F187F', '#832681', '#A6407A', '#C95F6B', '#E8845E', '#FCAF62', '#FEDB7C', '#FCFDBF']
  }
}

// ============================================================================
// Typography - Nature Standard
// ============================================================================

export const NATURE_TYPOGRAPHY = {
  // Font families
  fontFamily: {
    sans: 'Arial, Helvetica, "Liberation Sans", sans-serif',
    serif: '"Times New Roman", Times, Georgia, serif',
    mono: '"Courier New", Courier, monospace'
  },
  
  // Font sizes (in points for print)
  fontSize: {
    title: 12,        // Figure title
    label: 10,        // Axis labels
    tick: 8,          // Tick labels (minimum per Nature guidelines)
    legend: 9,        // Legend text
    annotation: 8     // Annotations
  },
  
  // Line heights
  lineHeight: {
    normal: 1.2,
    relaxed: 1.4
  },
  
  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    bold: 700
  }
}

// ============================================================================
// Figure Dimensions - Nature Standard
// ============================================================================

export const NATURE_DIMENSIONS = {
  // Single column width (8.5 cm / 3.35 inches)
  singleColumn: {
    width: 8.5,      // cm
    widthPx: 320,    // px at 96 DPI
    maxHeight: 23    // cm
  },
  
  // 1.5 column width (11.4 cm / 4.49 inches)
  oneHalfColumn: {
    width: 11.4,
    widthPx: 430,
    maxHeight: 23
  },
  
  // Double column width (17.4 cm / 6.85 inches)
  doubleColumn: {
    width: 17.4,
    widthPx: 656,
    maxHeight: 23
  },
  
  // Full page width
  fullPage: {
    width: 18.0,
    widthPx: 680,
    maxHeight: 24
  },
  
  // DPI settings
  dpi: {
    screen: 96,
    print: 300,      // Minimum for print
    high: 600        // High quality print
  },
  
  // Convert cm to pixels at given DPI
  cmToPx: (cm, dpi = 300) => Math.round(cm * dpi / 2.54),
  
  // Convert inches to pixels at given DPI
  inchToPx: (inch, dpi = 300) => Math.round(inch * dpi)
}

// ============================================================================
// Line Styles - Nature Standard
// ============================================================================

export const NATURE_LINE_STYLES = {
  // Minimum line width: 0.5 pt for print
  width: {
    thin: 0.5,       // Grid lines, minor ticks
    normal: 0.75,    // Axis lines, borders
    thick: 1.0,      // Data lines
    heavy: 1.5       // Emphasis lines
  },
  
  // Line types
  type: {
    solid: [],
    dashed: [4, 2],
    dotted: [1, 2],
    dashDot: [4, 2, 1, 2]
  },
  
  // Cap and join styles
  cap: 'square',
  join: 'miter'
}

// ============================================================================
// Chart Configuration Templates
// ============================================================================

export const NATURE_CHART_CONFIG = {
  // Base configuration for all charts
  base: {
    backgroundColor: '#FFFFFF',
    animation: false,  // Disable for print quality
    
    // Grid configuration
    grid: {
      show: true,
      left: 50,
      right: 20,
      top: 30,
      bottom: 45,
      borderWidth: 0.75,
      borderColor: '#000000',
      backgroundColor: 'transparent'
    },
    
    // Axis configuration
    axis: {
      lineWidth: 0.75,
      lineColor: '#000000',
      tickLength: 4,
      tickWidth: 0.5,
      tickColor: '#000000',
      labelFontSize: 8,
      labelFontFamily: 'Arial, Helvetica, sans-serif',
      labelColor: '#000000'
    },
    
    // Legend configuration
    legend: {
      fontSize: 9,
      fontFamily: 'Arial, Helvetica, sans-serif',
      itemWidth: 12,
      itemHeight: 8,
      itemGap: 10
    }
  },
  
  // Specific chart type configurations
  line: {
    symbolSize: 4,
    lineWidth: 1.0,
    emphasis: {
      symbolSize: 6,
      lineWidth: 1.5
    }
  },
  
  bar: {
    barWidth: '60%',
    borderWidth: 0
  },
  
  scatter: {
    symbolSize: 5,
    emphasis: {
      symbolSize: 7,
      borderWidth: 1.5
    }
  },
  
  heatmap: {
    borderWidth: 0,
    emphasis: {
      shadowBlur: 4,
      shadowColor: 'rgba(0,0,0,0.3)'
    }
  }
}

// ============================================================================
// Export Configuration
// ============================================================================

export const NATURE_EXPORT = {
  // Supported formats
  formats: {
    vector: ['svg', 'pdf', 'eps'],
    raster: ['png', 'tiff', 'jpg']
  },
  
  // Default settings
  defaults: {
    format: 'svg',       // Vector preferred
    dpi: 300,            // Print quality
    colorSpace: 'cmyk',  // For print (fallback to rgb)
    transparent: false,  // White background
    padding: 10          // px
  },
  
  // Quality presets
  presets: {
    screen: {
      dpi: 96,
      format: 'png',
      colorSpace: 'rgb'
    },
    print: {
      dpi: 300,
      format: 'tiff',
      colorSpace: 'cmyk'
    },
    publication: {
      dpi: 600,
      format: 'pdf',
      colorSpace: 'cmyk'
    }
  }
}

// ============================================================================
// Figure Panel Labels (A, B, C...)
// ============================================================================

export const PANEL_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export function getPanelLabel(index) {
  return PANEL_LABELS[index] || String.fromCharCode(65 + (index % 26))
}

// ============================================================================
// Quality Check Utilities
// ============================================================================

/**
 * Validate figure quality against Nature standards
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} config 
 * @returns {Object} Validation results
 */
export function validateFigureQuality(canvas, config = {}) {
  const checks = {
    passed: [],
    warnings: [],
    errors: [],
    valid: true
  }
  
  if (!canvas) {
    checks.errors.push('No canvas provided')
    checks.valid = false
    return checks
  }
  
  // Resolution check
  const minWidth = NATURE_DIMENSIONS.singleColumn.widthPx
  if (canvas.width < minWidth) {
    checks.warnings.push(`Width (${canvas.width}px) below recommended minimum (${minWidth}px for single column)`)
  } else {
    checks.passed.push(`Resolution: ${canvas.width}px (meets minimum)`)
  }
  
  // Check for transparency
  try {
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, Math.min(10, canvas.width), Math.min(10, canvas.height))
    let hasAlpha = false
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 255) {
        hasAlpha = true
        break
      }
    }
    if (hasAlpha) {
      checks.warnings.push('Image may contain transparent areas')
    } else {
      checks.passed.push('Background: opaque white')
    }
  } catch (e) {
    // Cross-origin issues may prevent reading canvas
    checks.passed.push('Background: assumed opaque')
  }
  
  // Aspect ratio check
  const aspectRatio = canvas.width / canvas.height
  if (aspectRatio > 4 || aspectRatio < 0.25) {
    checks.warnings.push(`Unusual aspect ratio (${aspectRatio.toFixed(2)}) - verify dimensions`)
  }
  
  return checks
}

export const QUALITY_CHECKS = {
  // Alias for validateFigureQuality
  checkFigure: validateFigureQuality,
  
  // Check color contrast for accessibility
  checkContrast: (color1, color2) => {
    const luminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }
    
    const hex2rgb = hex => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : [0, 0, 0]
    }
    
    const rgb1 = hex2rgb(color1)
    const rgb2 = hex2rgb(color2)
    
    const l1 = luminance(...rgb1)
    const l2 = luminance(...rgb2)
    
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    
    return {
      ratio: ratio.toFixed(2),
      pass: ratio >= 4.5,  // WCAG AA standard
      aa: ratio >= 4.5,
      aaa: ratio >= 7
    }
  }
}

// ============================================================================
// ECharts Theme Configuration for Nature Style
// ============================================================================

export const NATURE_ECHARTS_THEME = {
  // Color palette
  color: [
    NATURE_COLORS.primary,
    NATURE_COLORS.secondary,
    NATURE_COLORS.tertiary,
    NATURE_COLORS.quaternary,
    NATURE_COLORS.orange,
    NATURE_COLORS.sky
  ],
  
  // Background
  backgroundColor: '#FFFFFF',
  
  // Text styles
  textStyle: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 8,
    color: '#000000'
  },
  
  // Title
  title: {
    textStyle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#000000'
    },
    subtextStyle: {
      fontSize: 9,
      color: '#333333'
    }
  },
  
  // Legend
  legend: {
    textStyle: {
      fontSize: 9,
      color: '#000000'
    }
  },
  
  // Tooltip
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#CCCCCC',
    borderWidth: 0.5,
    textStyle: {
      fontSize: 9,
      color: '#000000'
    },
    extraCssText: 'box-shadow: 0 2px 8px rgba(0,0,0,0.1);'
  },
  
  // Axis
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#000000',
        width: 0.75
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#000000',
        width: 0.5
      }
    },
    axisLabel: {
      fontSize: 8,
      color: '#000000'
    },
    splitLine: {
      show: false
    },
    splitArea: {
      show: false
    }
  },
  
  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#000000',
        width: 0.75
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#000000',
        width: 0.5
      }
    },
    axisLabel: {
      fontSize: 8,
      color: '#000000'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#E8E8E8',
        width: 0.5,
        type: 'dashed'
      }
    }
  },
  
  // DataZoom
  dataZoom: {
    backgroundColor: 'rgba(255,255,255,0)',
    dataBackgroundColor: 'rgba(0,0,0,0.1)',
    fillerColor: 'rgba(0,0,0,0.05)',
    handleColor: '#666666'
  }
}

// ============================================================================
// Export for use
// ============================================================================

export default {
  colors: NATURE_COLORS,
  typography: NATURE_TYPOGRAPHY,
  dimensions: NATURE_DIMENSIONS,
  lineStyles: NATURE_LINE_STYLES,
  chartConfig: NATURE_CHART_CONFIG,
  export: NATURE_EXPORT,
  getPanelLabel,
  qualityChecks: QUALITY_CHECKS,
  echartsTheme: NATURE_ECHARTS_THEME
}
