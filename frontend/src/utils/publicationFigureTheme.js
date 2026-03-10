const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]'

const cloneValue = (value) => {
  if (Array.isArray(value)) return value.map(cloneValue)
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneValue(item)]))
  }
  return value
}

const mergeObjects = (base, override) => {
  const output = cloneValue(base)
  if (!isPlainObject(override)) return output

  for (const [key, value] of Object.entries(override)) {
    if (isPlainObject(value) && isPlainObject(output[key])) {
      output[key] = mergeObjects(output[key], value)
    } else {
      output[key] = cloneValue(value)
    }
  }

  return output
}

export const PUBLICATION_FIGURE_TOKENS = {
  palette: {
    blue: '#255f85',
    cyan: '#2e7d82',
    teal: '#0f766e',
    gold: '#c38a2d',
    terracotta: '#b35c37',
    wine: '#8a3b4b',
    slate: '#4f5d6b',
    sand: '#fffdfa',
    panel: '#f7f3ed',
    border: '#d8d0c4',
    grid: '#d9d4cb',
    ink: '#1d2733',
    softInk: '#607081'
  },
  fontFamily: {
    serif: '"Source Han Serif SC", "Noto Serif SC", "Palatino Linotype", "Times New Roman", serif',
    sans: '"Source Han Sans SC", "Noto Sans SC", "Aptos", "Segoe UI", Arial, sans-serif',
    mono: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace'
  }
}

const AXIS_BASE = {
  nameTextStyle: {
    fontFamily: PUBLICATION_FIGURE_TOKENS.fontFamily.serif,
    fontSize: 12,
    color: PUBLICATION_FIGURE_TOKENS.palette.ink
  },
  axisLabel: {
    fontFamily: PUBLICATION_FIGURE_TOKENS.fontFamily.sans,
    fontSize: 11,
    color: PUBLICATION_FIGURE_TOKENS.palette.softInk
  },
  axisLine: {
    show: true,
    lineStyle: {
      color: PUBLICATION_FIGURE_TOKENS.palette.ink,
      width: 1
    }
  },
  axisTick: {
    show: true,
    lineStyle: {
      color: PUBLICATION_FIGURE_TOKENS.palette.ink,
      width: 0.9
    }
  },
  splitLine: {
    show: true,
    lineStyle: {
      color: PUBLICATION_FIGURE_TOKENS.palette.grid,
      width: 0.9,
      type: 'dashed'
    }
  }
}

const mergeAxis = (axis, kind = 'value') => {
  const base = kind === 'category'
    ? mergeObjects(AXIS_BASE, { splitLine: { show: false } })
    : AXIS_BASE

  if (Array.isArray(axis)) {
    return axis.map((item) => mergeObjects(base, item))
  }

  return mergeObjects(base, axis || {})
}

const mergeSeries = (series = []) => {
  if (!Array.isArray(series)) return series

  return series.map((item) => {
    if (!isPlainObject(item)) return item

    if (item.type === 'line') {
      return mergeObjects({
        smooth: true,
        symbolSize: 6,
        lineStyle: {
          width: 2.2
        }
      }, item)
    }

    if (item.type === 'bar') {
      return mergeObjects({
        barMaxWidth: 22,
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        }
      }, item)
    }

    if (item.type === 'scatter') {
      return mergeObjects({
        symbolSize: 8,
        itemStyle: {
          borderColor: '#ffffff',
          borderWidth: 1
        }
      }, item)
    }

    if (item.type === 'heatmap') {
      return mergeObjects({
        itemStyle: {
          borderWidth: 0.75,
          borderColor: 'rgba(255,255,255,0.22)'
        }
      }, item)
    }

    return item
  })
}

const normalizeGraphic = (graphic) => {
  if (!graphic) return []
  return Array.isArray(graphic) ? cloneValue(graphic) : [cloneValue(graphic)]
}

const buildGraphicMeta = ({ panelLabel, note }) => {
  const items = []

  if (panelLabel) {
    items.push({
      type: 'text',
      left: 10,
      top: 10,
      silent: true,
      style: {
        text: panelLabel,
        font: `700 12px ${PUBLICATION_FIGURE_TOKENS.fontFamily.sans}`,
        fill: '#ffffff',
        backgroundColor: PUBLICATION_FIGURE_TOKENS.palette.ink,
        padding: [4, 8],
        borderRadius: 10
      }
    })
  }

  if (note) {
    items.push({
      type: 'text',
      right: 12,
      bottom: 10,
      silent: true,
      style: {
        text: note,
        font: `400 11px ${PUBLICATION_FIGURE_TOKENS.fontFamily.sans}`,
        fill: PUBLICATION_FIGURE_TOKENS.palette.softInk,
        backgroundColor: 'rgba(255,253,250,0.9)',
        padding: [4, 8],
        borderRadius: 10
      }
    })
  }

  return items
}

const hasName = (axis) => {
  if (Array.isArray(axis)) return axis.some((item) => Boolean(item?.name))
  return Boolean(axis?.name)
}

export const buildFigureHighlights = (items = []) => {
  return items
    .filter((item) => item && item.label && item.value !== undefined && item.value !== null && item.value !== '')
    .map((item) => ({
      label: String(item.label),
      value: String(item.value),
      tone: item.tone || 'neutral'
    }))
}

export function mergePublicationChartOption(option = {}, meta = {}) {
  const merged = mergeObjects({
    backgroundColor: '#fffdfa',
    color: [
      PUBLICATION_FIGURE_TOKENS.palette.blue,
      PUBLICATION_FIGURE_TOKENS.palette.terracotta,
      PUBLICATION_FIGURE_TOKENS.palette.teal,
      PUBLICATION_FIGURE_TOKENS.palette.gold,
      PUBLICATION_FIGURE_TOKENS.palette.wine,
      PUBLICATION_FIGURE_TOKENS.palette.slate
    ],
    animationDuration: 420,
    textStyle: {
      fontFamily: PUBLICATION_FIGURE_TOKENS.fontFamily.sans,
      color: PUBLICATION_FIGURE_TOKENS.palette.ink
    },
    grid: {
      top: 48,
      right: 32,
      bottom: 56,
      left: 68,
      containLabel: true
    },
    tooltip: {
      confine: true,
      backgroundColor: 'rgba(255,253,250,0.98)',
      borderColor: PUBLICATION_FIGURE_TOKENS.palette.border,
      borderWidth: 1,
      padding: [10, 12],
      textStyle: {
        fontFamily: PUBLICATION_FIGURE_TOKENS.fontFamily.sans,
        fontSize: 11,
        color: PUBLICATION_FIGURE_TOKENS.palette.ink
      },
      extraCssText: 'box-shadow: 0 10px 32px rgba(29,39,51,0.14); border-radius: 12px;'
    },
    legend: {
      top: 8,
      itemGap: 12,
      itemWidth: 14,
      itemHeight: 9,
      textStyle: {
        fontFamily: PUBLICATION_FIGURE_TOKENS.fontFamily.sans,
        fontSize: 11,
        color: PUBLICATION_FIGURE_TOKENS.palette.ink
      }
    },
    toolbox: {
      right: 8,
      top: 6,
      itemSize: 14,
      iconStyle: {
        borderColor: PUBLICATION_FIGURE_TOKENS.palette.softInk
      },
      feature: {
        saveAsImage: {
          type: 'png',
          pixelRatio: 4,
          backgroundColor: '#fffdfa'
        }
      }
    }
  }, option)

  merged.grid = mergeObjects({
    top: 48,
    right: 32,
    bottom: 56,
    left: 68,
    containLabel: true
  }, option.grid || {})

  merged.xAxis = mergeAxis(option.xAxis, hasName(option.xAxis) ? 'category' : 'category')
  merged.yAxis = mergeAxis(option.yAxis, 'value')
  merged.series = mergeSeries(option.series)
  merged.graphic = [...normalizeGraphic(option.graphic), ...buildGraphicMeta(meta)]

  return merged
}

