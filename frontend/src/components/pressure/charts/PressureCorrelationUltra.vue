<template>
  <NatureChartContainerUltra
    panel-label="F"
    :title="title"
    subtitle="Cross-Correlation Matrix"
    :footnote="footnote"
    width="full"
    height="220px"
  >
    <div ref="chartRef" class="echarts-container-ultra"></div>
  </NatureChartContainerUltra>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import * as echarts from 'echarts'
import NatureChartContainerUltra from '../shared/NatureChartContainerUltra.vue'
import { NATURE_ECHARTS_THEME, NATURE_COLORS } from '@/utils/natureFigureConfig'
import { exportECharts } from '@/utils/figureExport'

const COLORS = {
  primary: NATURE_COLORS.primary,
  secondary: NATURE_COLORS.secondary,
  accent: NATURE_COLORS.quaternary,
  grid: '#E8E8E8'
}

const props = defineProps({
  title: { type: String, default: '相关性矩阵' },
  matrix: { type: Array, default: null }
})

const chartRef = ref(null)
let chartInstance = null

defineExpose({
  getChartInstance: () => chartInstance
})

const footnote = computed(() => {
  if (!props.matrix?.length) return ''
  const n = props.matrix.length
  let sum = 0, count = 0
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      sum += Math.abs(props.matrix[i][j])
      count++
    }
  }
  const avgCorr = count > 0 ? sum / count : 0
  return `Mean |r| = ${avgCorr.toFixed(3)}, n = ${n}`
})

function initChart() {
  if (!chartRef.value) return
  echarts.registerTheme('nature', NATURE_ECHARTS_THEME)
  chartInstance = echarts.init(chartRef.value, 'nature', {
    renderer: 'canvas',
    devicePixelRatio: window.devicePixelRatio || 2
  })
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.matrix?.length) return

  const n = props.matrix.length
  const data = []
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      data.push([j, i, props.matrix[i][j]])
    }
  }

  // 选择采样点作为标签
  const labels = []
  const step = Math.max(1, Math.floor(n / 8))
  for (let i = 0; i < n; i += step) {
    labels.push((i + 1).toString())
  }

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: 45,
      right: 15,
      top: 15,
      bottom: 40
    },

    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 8,
        color: '#525252',
        interval: 0
      },
      splitArea: { show: true }
    },

    yAxis: {
      type: 'category',
      data: labels.slice().reverse(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 8,
        color: '#525252',
        interval: 0
      },
      splitArea: { show: true }
    },

    visualMap: {
      min: -1,
      max: 1,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 5,
      itemWidth: 120,
      itemHeight: 10,
      inRange: {
        color: ['#313695', '#4575B4', '#74ADD1', '#E0F3F8', '#FFFFBF', '#FEE090', '#FDAE61', '#F46D43', '#D73027']
      },
      text: ['-1', '1'],
      textStyle: { fontSize: 9, color: '#525252' }
    },

    series: [{
      name: 'Correlation',
      type: 'heatmap',
      data: data,
      label: { show: false },
      itemStyle: {
        borderWidth: 0
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        }
      }
    }],

    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: { color: '#171717', fontSize: 11 },
      formatter: (params) => {
        return `<div style="font-weight: 600; margin-bottom: 4px;">支架 ${params.value[0]+1} ↔ ${params.value[1]+1}</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="color: #525252;">相关系数:</span>
                  <span style="font-weight: 700; font-size: 13px;">${params.value[2].toFixed(3)}</span>
                </div>`
      }
    },

    animation: true,
    animationDuration: 500
  }

  chartInstance.setOption(option, { notMerge: true })
}

function handleResize() {
  chartInstance?.resize()
}

// Nature标准导出
function exportFigure(format = 'svg') {
  if (!chartInstance) return
  const dataUrl = exportECharts(chartInstance, { type: format })
  const link = document.createElement('a')
  link.download = `Fig_F_correlation_${new Date().toISOString().split('T')[0]}.${format}`
  link.href = dataUrl
  link.click()
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
</script>

<style scoped>
.echarts-container-ultra {
  width: 100%;
  height: 100%;
  min-height: 160px;
}
</style>
