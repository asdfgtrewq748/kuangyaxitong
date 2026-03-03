<template>
  <NatureChartContainerUltra
    :panel-label="panelLabel"
    :title="title"
    :subtitle="subtitle"
    x-axis-label=""
    y-axis-label=""
    :footnote="footnote"
    width="full"
    height="320px"
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
  title: { type: String, default: '多支架相关性矩阵' },
  subtitle: { type: String, default: 'Scatter Plot Matrix' },
  panelLabel: { type: String, default: 'F' },
  data: { type: Array, default: () => [] },
  supportIds: { type: Array, default: () => [1, 25, 50, 75, 100, 125] }
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  const n = props.supportIds.length
  return `${n}×${n} 矩阵，展示支架间压力相关性`
})

const COLORS = {
  scatter: NATURE_COLORS.primary,
  diagonal: NATURE_COLORS.secondary,
  regression: NATURE_COLORS.quaternary,
  grid: '#E8E8E8',
  fill: 'rgba(0, 114, 178, 0.15)'
}

function prepareDataBySupport() {
  const bySupport = new Map()
  
  props.supportIds.forEach(id => bySupport.set(id, []))
  
  props.data.forEach(item => {
    const id = item.supportId
    if (bySupport.has(id)) {
      bySupport.get(id).push({
        date: new Date(item.cycleStartTime || item.date),
        value: item.finalResistanceValue || item.value
      })
    }
  })
  
  // Sort by date and get values
  const result = new Map()
  bySupport.forEach((items, id) => {
    items.sort((a, b) => a.date - b.date)
    result.set(id, items.map(i => i.value))
  })
  
  return result
}

function calculateCorrelation(x, y) {
  const n = Math.min(x.length, y.length)
  if (n < 2) return 0
  
  const sumX = x.slice(0, n).reduce((a, b) => a + b, 0)
  const sumY = y.slice(0, n).reduce((a, b) => a + b, 0)
  const sumXY = x.slice(0, n).reduce((acc, xi, i) => acc + xi * y[i], 0)
  const sumX2 = x.slice(0, n).reduce((acc, xi) => acc + xi * xi, 0)
  const sumY2 = y.slice(0, n).reduce((acc, yi, i) => acc + yi * y[i], 0)
  
  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  
  return denominator === 0 ? 0 : numerator / denominator
}

function calculateRegression(x, y) {
  const n = Math.min(x.length, y.length)
  if (n < 2) return { slope: 0, intercept: 0 }
  
  const sumX = x.slice(0, n).reduce((a, b) => a + b, 0)
  const sumY = y.slice(0, n).reduce((a, b) => a + b, 0)
  const sumXY = x.slice(0, n).reduce((acc, xi, i) => acc + xi * y[i], 0)
  const sumX2 = x.slice(0, n).reduce((acc, xi) => acc + xi * xi, 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  return { slope, intercept }
}

function initChart() {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value, null, {
    renderer: 'canvas',
    devicePixelRatio: window.devicePixelRatio || 2
  })
  
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.data.length) return
  
  const dataBySupport = prepareDataBySupport()
  const supports = props.supportIds
  const n = supports.length
  
  if (n < 2) return
  
  // Create grid for scatter matrix
  const gridSize = 100 / n
  const grids = []
  const xAxes = []
  const yAxes = []
  const series = []
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const gridIndex = i * n + j
      
      grids.push({
        left: `${j * gridSize + 2}%`,
        top: `${i * gridSize + 2}%`,
        width: `${gridSize - 4}%`,
        height: `${gridSize - 4}%`
      })
      
      const xData = dataBySupport.get(supports[j]) || []
      const yData = dataBySupport.get(supports[i]) || []
      
      // X axis
      xAxes.push({
        gridIndex,
        type: 'value',
        show: i === n - 1,
        axisLine: { show: i === n - 1, lineStyle: { color: '#000', width: 0.5 } },
        axisTick: { show: i === n - 1, inside: true },
        axisLabel: { 
          show: i === n - 1,
          fontSize: 6,
          interval: 'auto'
        },
        splitLine: { show: false }
      })
      
      // Y axis
      yAxes.push({
        gridIndex,
        type: 'value',
        show: j === 0,
        axisLine: { show: j === 0, lineStyle: { color: '#000', width: 0.5 } },
        axisTick: { show: j === 0, inside: true },
        axisLabel: { 
          show: j === 0,
          fontSize: 6,
          interval: 'auto'
        },
        splitLine: { show: false }
      })
      
      if (i === j) {
        // Diagonal: histogram
        const values = xData
        const min = Math.min(...values)
        const max = Math.max(...values)
        const bins = 10
        const binWidth = (max - min) / bins
        const histogram = Array(bins).fill(0)
        
        values.forEach(v => {
          const bin = Math.min(bins - 1, Math.floor((v - min) / binWidth))
          histogram[bin]++
        })
        
        series.push({
          xAxisIndex: gridIndex,
          yAxisIndex: gridIndex,
          name: `hist-${i}`,
          type: 'bar',
          data: histogram.map((count, idx) => [min + (idx + 0.5) * binWidth, count]),
          barWidth: '90%',
          itemStyle: {
            color: COLORS.diagonal,
            opacity: 0.7
          }
        })
        
        // Add support ID label
        series.push({
          xAxisIndex: gridIndex,
          yAxisIndex: gridIndex,
          name: `label-${i}`,
          type: 'scatter',
          data: [[(min + max) / 2, Math.max(...histogram) * 0.7]],
          symbolSize: 0,
          label: {
            show: true,
            formatter: `#${supports[i]}`,
            fontSize: 10,
            fontWeight: 'bold',
            color: '#000'
          }
        })
      } else {
        // Off-diagonal: scatter plot
        const pairedData = xData.map((x, idx) => [x, yData[idx]]).filter(p => p[0] && p[1])
        
        series.push({
          xAxisIndex: gridIndex,
          yAxisIndex: gridIndex,
          name: `scatter-${i}-${j}`,
          type: 'scatter',
          data: pairedData,
          symbolSize: 3,
          itemStyle: {
            color: COLORS.scatter,
            opacity: 0.6
          }
        })
        
        // Add regression line
        const { slope, intercept } = calculateRegression(xData, yData)
        const xMin = Math.min(...xData)
        const xMax = Math.max(...xData)
        
        series.push({
          xAxisIndex: gridIndex,
          yAxisIndex: gridIndex,
          name: `reg-${i}-${j}`,
          type: 'line',
          data: [[xMin, slope * xMin + intercept], [xMax, slope * xMax + intercept]],
          lineStyle: {
            color: COLORS.regression,
            width: 1,
            type: [4, 2]
          },
          symbol: 'none'
        })
        
        // Add correlation coefficient
        const r = calculateCorrelation(xData, yData)
        series.push({
          xAxisIndex: gridIndex,
          yAxisIndex: gridIndex,
          name: `corr-${i}-${j}`,
          type: 'scatter',
          data: [[xMax, slope * xMax + intercept]],
          symbolSize: 0,
          label: {
            show: true,
            formatter: `r=${r.toFixed(2)}`,
            fontSize: 7,
            color: r > 0.7 ? NATURE_COLORS.tertiary : NATURE_COLORS.secondary,
            position: 'insideTopRight'
          }
        })
      }
    }
  }
  
  const option = {
    backgroundColor: 'transparent',
    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series: series,
    
    tooltip: {
      show: false
    },
    
    animation: true,
    animationDuration: 600
  }
  
  chartInstance.setOption(option, { notMerge: true })
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

watch(() => props.data, updateChart, { deep: true })

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
