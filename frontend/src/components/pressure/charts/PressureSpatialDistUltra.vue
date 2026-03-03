<template>
  <NatureChartContainerUltra
    panel-label="D"
    :title="title"
    subtitle="Spatial Distribution"
    x-axis-label="Support ID"
    y-axis-label="Mean Resistance (MPa)"
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

const props = defineProps({
  title: { type: String, default: '空间分布' },
  data: { type: Array, default: () => [] }
})

const chartRef = ref(null)
let chartInstance = null

defineExpose({
  getChartInstance: () => chartInstance
})

const footnote = computed(() => {
  if (!props.data?.length) return ''
  const values = props.data.map(d => d.mean)
  const trend = calculateTrend(values)
  return `Trend: ${trend > 0 ? '↑' : '↓'} ${Math.abs(trend * 100).toFixed(1)}%, n = ${props.data.length}`
})

const COLORS = {
  primary: NATURE_COLORS.primary,
  secondary: NATURE_COLORS.secondary,
  accent: NATURE_COLORS.quaternary,
  grid: '#E8E8E8'
}

function calculateTrend(values) {
  if (values.length < 2) return 0
  const n = values.length
  const mid = Math.floor(n / 2)
  const firstHalf = values.slice(0, mid).reduce((a,b) => a+b, 0) / mid
  const secondHalf = values.slice(mid).reduce((a,b) => a+b, 0) / (n - mid)
  return (secondHalf - firstHalf) / firstHalf
}

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
  if (!chartInstance || !props.data?.length) return

  const xData = props.data.map(d => d.supportId)
  const yData = props.data.map(d => d.mean)
  
  // 计算移动平均线
  const maWindow = 5
  const maData = yData.map((_, i) => {
    const start = Math.max(0, i - maWindow + 1)
    const window = yData.slice(start, i + 1)
    return window.reduce((a,b) => a+b, 0) / window.length
  })

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: 50,
      right: 25,
      top: 20,
      bottom: 40
    },

    xAxis: {
      type: 'category',
      data: xData,
      axisLine: {
        lineStyle: { color: '#171717', width: 0.8 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#171717', width: 0.8 }
      },
      axisLabel: {
        fontSize: 9,
        color: '#525252',
        interval: Math.floor(xData.length / 6)
      },
      splitLine: { show: false }
    },

    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: { color: '#171717', width: 0.8 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#171717', width: 0.8 }
      },
      axisLabel: {
        fontSize: 9,
        color: '#525252'
      },
      splitLine: {
        lineStyle: { color: COLORS.grid, width: 0.5, type: [4, 4] }
      }
    },

    series: [
      // 移动平均线
      {
        name: 'MA',
        type: 'line',
        data: maData,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: COLORS.secondary,
          width: 2
        },
        z: 1
      },
      
      // 散点
      {
        name: 'Resistance',
        type: 'scatter',
        data: yData,
        symbolSize: 6,
        itemStyle: {
          color: COLORS.primary,
          borderColor: '#fff',
          borderWidth: 1,
          shadowBlur: 2,
          shadowColor: 'rgba(0,0,0,0.1)'
        },
        emphasis: {
          itemStyle: {
            color: COLORS.accent,
            symbolSize: 10,
            shadowBlur: 8,
            shadowColor: 'rgba(0, 158, 115, 0.4)'
          }
        },
        z: 2
      }
    ],

    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: { color: '#171717', fontSize: 12 },
      formatter: (params) => {
        const scatter = params.find(p => p.seriesName === 'Resistance')
        const idx = params[0].dataIndex
        const d = props.data[idx]
        return `<div style="font-weight: 600; margin-bottom: 4px;">支架 #${d.supportId}</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${COLORS.primary};"></span>
                  <span style="color: #525252;">均值:</span>
                  <span style="font-weight: 700; color: ${COLORS.primary};">${d.mean.toFixed(2)}</span>
                  <span style="color: #a3a3a3; font-size: 11px;">MPa</span>
                </div>
                <div style="margin-top: 4px; font-size: 11px; color: #737373;">样本数: ${d.count}</div>`
      }
    },

    animation: true,
    animationDuration: 600,
    animationEasing: 'cubicOut'
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
  link.download = `Fig_D_spatialdist_${new Date().toISOString().split('T')[0]}.${format}`
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

watch(() => props.data, updateChart, { deep: true })
</script>

<style scoped>
.echarts-container-ultra {
  width: 100%;
  height: 100%;
  min-height: 160px;
}
</style>
