<template>
  <NatureChartContainerUltra
    :panel-label="panelLabel"
    :title="title"
    :subtitle="subtitle"
    x-axis-label="推进距离 (m)"
    y-axis-label="支架编号"
    :footnote="footnote"
    width="full"
    height="300px"
  >
    <div ref="chartRef" class="echarts-container-ultra"></div>
  </NatureChartContainerUltra>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import * as echarts from 'echarts'
import NatureChartContainerUltra from '../shared/NatureChartContainerUltra.vue'
import { NATURE_COLORS } from '@/utils/natureFigureConfig'

const props = defineProps({
  title: { type: String, default: '压力等值线图' },
  subtitle: { type: String, default: 'Contour Map' },
  panelLabel: { type: String, default: 'J' },
  matrix: { type: Array, default: () => [] },
  numSupports: { type: Number, default: 125 },
  levels: { type: Number, default: 10 }
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  return `${props.levels} 条等值线，展示压力场分布`
})

const COLORS = {
  contour: NATURE_COLORS.primary,
  label: '#000000',
  grid: '#F0F0F0'
}

// Generate contour lines using marching squares
function generateContours(matrix, numLevels) {
  if (!matrix.length || !matrix[0].length) return []
  
  const rows = matrix.length
  const cols = matrix[0].length
  
  // Flatten and find min/max
  const allValues = matrix.flat().filter(Number.isFinite)
  const min = Math.min(...allValues)
  const max = Math.max(...allValues)
  
  const levels = []
  for (let i = 1; i <= numLevels; i++) {
    levels.push(min + (max - min) * i / (numLevels + 1))
  }
  
  const contourLines = []
  
  levels.forEach((level, levelIdx) => {
    const lines = []
    
    // Simple contour extraction - trace along grid
    for (let i = 0; i < rows - 1; i++) {
      for (let j = 0; j < cols - 1; j++) {
        const v00 = matrix[i][j]
        const v10 = matrix[i][j + 1]
        const v01 = matrix[i + 1][j]
        const v11 = matrix[i + 1][j + 1]
        
        // Check if level crosses this cell
        const cellMin = Math.min(v00, v10, v01, v11)
        const cellMax = Math.max(v00, v10, v01, v11)
        
        if (level >= cellMin && level <= cellMax) {
          // Linear interpolation for contour points
          const points = []
          
          // Left edge
          if ((v00 - level) * (v01 - level) < 0) {
            const t = (level - v00) / (v01 - v00)
            points.push([j, i + t])
          }
          
          // Right edge
          if ((v10 - level) * (v11 - level) < 0) {
            const t = (level - v10) / (v11 - v10)
            points.push([j + 1, i + t])
          }
          
          // Top edge
          if ((v00 - level) * (v10 - level) < 0) {
            const t = (level - v00) / (v10 - v00)
            points.push([j + t, i])
          }
          
          // Bottom edge
          if ((v01 - level) * (v11 - level) < 0) {
            const t = (level - v01) / (v11 - v01)
            points.push([j + t, i + 1])
          }
          
          if (points.length >= 2) {
            lines.push({
              coords: points,
              value: level
            })
          }
        }
      }
    }
    
    contourLines.push({
      level,
      levelIdx,
      lines
    })
  })
  
  return contourLines
}

function initChart() {
  if (!chartRef.value) return
  
  // 检查容器尺寸，避免 ECharts 报错
  const { clientWidth, clientHeight } = chartRef.value
  if (clientWidth === 0 || clientHeight === 0) {
    setTimeout(initChart, 100)
    return
  }
  
  chartInstance = echarts.init(chartRef.value, null, {
    renderer: 'canvas',
    devicePixelRatio: window.devicePixelRatio || 2
  })
  
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.matrix.length) return
  
  const numRows = props.matrix.length
  const numCols = props.matrix[0]?.length || 0
  
  const contours = generateContours(props.matrix, props.levels)
  
  // Generate series for each contour level
  const series = []
  const allValues = props.matrix.flat().filter(Number.isFinite)
  const min = Math.min(...allValues)
  const max = Math.max(...allValues)
  
  contours.forEach((contour, idx) => {
    const colorRatio = idx / (contours.length - 1)
    
    contour.lines.forEach((line, lineIdx) => {
      series.push({
        name: `Contour-${idx}`,
        type: 'line',
        data: line.coords.map(p => [p[0] * 0.6, (numRows - p[1]) * (props.numSupports / numRows)]),
        lineStyle: {
          color: getContourColor(colorRatio),
          width: 1 + colorRatio * 1.5
        },
        symbol: 'none',
        silent: true,
        z: idx
      })
    })
    
    // Add label for some contours
    if (idx % 2 === 0 && contour.lines.length > 0) {
      const midLine = contour.lines[Math.floor(contour.lines.length / 2)]
      if (midLine && midLine.coords.length > 0) {
        const midPoint = midLine.coords[Math.floor(midLine.coords.length / 2)]
        series.push({
          name: `Label-${idx}`,
          type: 'scatter',
          data: [[midPoint[0] * 0.6, (numRows - midPoint[1]) * (props.numSupports / numRows)]],
          symbolSize: 0,
          label: {
            show: true,
            formatter: contour.level.toFixed(1),
            fontSize: 8,
            color: getContourColor(colorRatio),
            fontWeight: 'bold'
          },
          silent: true,
          z: idx + 100
        })
      }
    }
  })
  
  // Add heatmap background
  const heatmapData = []
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (Number.isFinite(props.matrix[i][j])) {
        heatmapData.push([j * 0.6, (numRows - i) * (props.numSupports / numRows), props.matrix[i][j]])
      }
    }
  }
  
  series.unshift({
    name: 'Background',
    type: 'heatmap',
    data: heatmapData,
    emphasis: { disabled: true },
    itemStyle: {
      borderWidth: 0
    }
  })
  
  const option = {
    backgroundColor: 'transparent',
    
    grid: {
      left: 55,
      right: 25,
      top: 20,
      bottom: 45
    },
    
    xAxis: {
      type: 'value',
      min: 0,
      max: numCols * 0.6,
      axisLine: {
        lineStyle: { color: '#000000', width: 0.75 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#000000', width: 0.5 }
      },
      axisLabel: {
        fontSize: 8,
        color: '#000000',
        fontFamily: 'Arial, Helvetica, sans-serif'
      },
      splitLine: { show: false }
    },
    
    yAxis: {
      type: 'value',
      min: 0,
      max: props.numSupports,
      axisLine: {
        lineStyle: { color: '#000000', width: 0.75 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#000000', width: 0.5 }
      },
      axisLabel: {
        fontSize: 8,
        color: '#000000',
        fontFamily: 'Arial, Helvetica, sans-serif'
      },
      splitLine: {
        lineStyle: { 
          color: '#F0F0F0', 
          width: 0.5
        }
      }
    },
    
    visualMap: {
      show: true,
      left: 'right',
      top: 'center',
      dimension: 2,
      min: min,
      max: max,
      itemWidth: 12,
      itemHeight: 80,
      textStyle: {
        fontSize: 8
      },
      inRange: {
        color: NATURE_COLORS.heatmap.diverging.slice(2, -2)
      }
    },
    
    series: series,
    
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        fontSize: 11,
        color: '#171717'
      },
      extraCssText: 'box-shadow: 0 8px 24px rgba(0,0,0,0.12); border-radius: 8px;',
      formatter: function (params) {
        if (params.seriesName === 'Background') {
          return `
            <div style="font-weight: 600; margin-bottom: 4px;">压力值</div>
            <div style="font-size: 11px;">
              推进: ${params.data[0].toFixed(1)} m<br>
              支架: #${Math.floor(params.data[1])}<br>
              压力: <span style="font-weight: 600; color: ${NATURE_COLORS.primary};">${params.data[2].toFixed(2)} MPa</span>
            </div>
          `
        }
        return null
      }
    },
    
    animation: false
  }
  
  chartInstance.setOption(option, { notMerge: true })
}

function getContourColor(ratio) {
  // Interpolate between colors
  if (ratio < 0.5) {
    // Blue to green
    return interpolateColor('#4575B4', '#90EE90', ratio * 2)
  } else {
    // Green to red
    return interpolateColor('#90EE90', '#A50026', (ratio - 0.5) * 2)
  }
}

function interpolateColor(c1, c2, t) {
  const hex2rgb = hex => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16)
  ]
  
  const rgb1 = hex2rgb(c1)
  const rgb2 = hex2rgb(c2)
  
  const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t)
  const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t)
  const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t)
  
  return `rgb(${r},${g},${b})`
}

function handleResize() {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})

watch(() => props.matrix, updateChart, { deep: true })

defineExpose({
  getChartInstance: () => chartInstance
})
</script>

<style scoped>
.echarts-container-ultra {
  width: 100%;
  height: 100%;
  min-height: 200px;
}
</style>
