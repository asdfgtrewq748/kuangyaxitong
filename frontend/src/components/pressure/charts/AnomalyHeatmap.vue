<template>
  <NatureChartContainerUltra
    :panel-label="panelLabel"
    :title="title"
    :subtitle="subtitle"
    x-axis-label="鎺ㄨ繘璺濈 (m)"
    y-axis-label="鏀灦缂栧彿"
    :footnote="footnote"
    width="full"
    height="280px"
  >
    <div ref="chartRef" class="echarts-container-ultra"></div>
  </NatureChartContainerUltra>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import { echarts } from '@/lib/echarts-pressure'
import NatureChartContainerUltra from '../shared/NatureChartContainerUltra.vue'
import { NATURE_COLORS } from '@/utils/natureFigureConfig'

const props = defineProps({
  title: { type: String, default: 'Anomaly Heatmap' },
  subtitle: { type: String, default: 'Anomaly Detection Map' },
  panelLabel: { type: String, default: 'G' },
  matrix: { type: Array, default: () => [] },
  threshold: { type: Number, default: 2.0 },
  stats: { type: Object, default: null }
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  const anomalies = countAnomalies()
  return `浣跨敤 ${props.threshold}蟽 鍑嗗垯妫€娴嬶紝鍙戠幇 ${anomalies} 涓紓甯哥偣`
})

const COLORS = {
  normal: '#E8E8E8',
  low: NATURE_COLORS.sky,
  high: NATURE_COLORS.secondary,
  grid: '#F0F0F0'
}

function countAnomalies() {
  if (!props.matrix.length || !props.stats) return 0
  
  let count = 0
  const mean = props.stats.mean
  const std = props.stats.std || 1
  
  props.matrix.forEach(row => {
    row.forEach(val => {
      if (Math.abs((val - mean) / std) > props.threshold) {
        count++
      }
    })
  })
  
  return count
}

function detectAnomalies() {
  if (!props.matrix.length || !props.stats) return []
  
  const anomalies = []
  const mean = props.stats.mean
  const std = props.stats.std || 1
  
  props.matrix.forEach((row, i) => {
    row.forEach((val, j) => {
      const zScore = (val - mean) / std
      if (Math.abs(zScore) > props.threshold) {
        anomalies.push({
          row: i,
          col: j,
          value: val,
          zScore: zScore,
          type: zScore > 0 ? 'high' : 'low'
        })
      }
    })
  })
  
  return anomalies
}

function initChart() {
  if (!chartRef.value) return
  
  // 妫€鏌ュ鍣ㄥ昂瀵革紝閬垮厤 ECharts 鎶ラ敊
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
  
  const anomalies = detectAnomalies()
  const numRows = props.matrix.length
  const numCols = props.matrix[0]?.length || 0
  
  // Create background grid
  const backgroundData = []
  for (let i = 0; i < numRows; i += 5) {
    for (let j = 0; j < numCols; j += 5) {
      backgroundData.push([j, i, 0])
    }
  }
  
  // Anomaly data
  const highAnomalies = anomalies.filter(a => a.type === 'high').map(a => [a.col, a.row, a.zScore])
  const lowAnomalies = anomalies.filter(a => a.type === 'low').map(a => [a.col, a.row, Math.abs(a.zScore)])
  
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
      max: numCols,
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
        fontFamily: 'Arial, Helvetica, sans-serif',
        formatter: (val) => (val * 0.6).toFixed(0)
      },
      splitLine: { show: false }
    },
    
    yAxis: {
      type: 'value',
      min: 0,
      max: numRows,
      inverse: true,
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
        fontFamily: 'Arial, Helvetica, sans-serif',
        formatter: (val) => Math.floor(val + 1)
      },
      splitLine: {
        lineStyle: { 
          color: '#F0F0F0', 
          width: 0.5
        }
      }
    },
    
    visualMap: [
      {
        show: false,
        min: props.threshold,
        max: 4,
        dimension: 2,
        seriesIndex: 1,
        inRange: {
          color: ['#FDAE61', '#F46D43', '#D73027', '#A50026']
        }
      },
      {
        show: false,
        min: props.threshold,
        max: 4,
        dimension: 2,
        seriesIndex: 2,
        inRange: {
          color: ['#74ADD1', '#4575B4', '#313695']
        }
      }
    ],
    
    series: [
      {
        name: 'Background',
        type: 'heatmap',
        data: backgroundData,
        itemStyle: {
          color: '#FAFAFA',
          borderWidth: 0
        },
        emphasis: { disabled: true }
      },
      {
        name: 'High Anomaly',
        type: 'heatmap',
        data: highAnomalies,
        itemStyle: {
          borderColor: '#ffffff',
          borderWidth: 0.5
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 6,
            shadowColor: 'rgba(213, 94, 0, 0.5)'
          }
        }
      },
      {
        name: 'Low Anomaly',
        type: 'heatmap',
        data: lowAnomalies,
        itemStyle: {
          borderColor: '#ffffff',
          borderWidth: 0.5
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 6,
            shadowColor: 'rgba(86, 180, 233, 0.5)'
          }
        }
      }
    ],
    
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
      formatter: function (param) {
        if (param.seriesName === 'Background') return null
        
        const zScore = param.data[2]
        const type = param.seriesName === 'High Anomaly' ? '楂樺帇寮傚父' : '浣庡帇寮傚父'
        const color = param.seriesName === 'High Anomaly' ? NATURE_COLORS.secondary : NATURE_COLORS.sky
        
        return `
          <div style="font-weight: 600; margin-bottom: 4px; color: ${color};">${type}</div>
          <div style="font-size: 11px;">
            浣嶇疆: 鏀灦 #${Math.floor(param.data[1] + 1)}, 绗?{param.data[0]}澶?br>
            Z-Score: <span style="font-weight: 600;">${zScore.toFixed(2)}蟽</span>
          </div>
        `
      }
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

watch(() => props.matrix, updateChart, { deep: true })
watch(() => props.threshold, updateChart)

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

