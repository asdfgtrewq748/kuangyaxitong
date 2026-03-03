<template>
  <NatureChartContainerUltra
    panel-label="E"
    :title="title"
    subtitle="Periodicity Detection"
    x-axis-label="Time"
    y-axis-label="Amplitude"
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
  title: { type: String, default: '周期检测' },
  data: { type: Array, default: () => [] },
  periods: { type: Object, default: null }
})

const chartRef = ref(null)
let chartInstance = null

defineExpose({
  getChartInstance: () => chartInstance
})

const footnote = computed(() => {
  if (!props.periods) return ''
  return `Dominant period: ${props.periods.period?.toFixed(1) || '--'} days`
})

const COLORS = {
  primary: NATURE_COLORS.primary,
  secondary: NATURE_COLORS.secondary,
  accent: NATURE_COLORS.quaternary,
  grid: '#E8E8E8'
}

function initChart() {
  if (!chartRef.value) return

  // 检查容器尺寸，避免 ECharts 报错
  const { clientWidth, clientHeight } = chartRef.value
  if (clientWidth === 0 || clientHeight === 0) {
    // 延迟初始化，等待容器有尺寸
    setTimeout(initChart, 100)
    return
  }

  echarts.registerTheme('nature', NATURE_ECHARTS_THEME)
  chartInstance = echarts.init(chartRef.value, 'nature', {
    renderer: 'canvas',
    devicePixelRatio: window.devicePixelRatio || 2
  })
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.data?.length) return

  const dates = props.data.map(d => d.date)
  const values = props.data.map(d => d.value)
  
  // 计算移动平均
  const maWindow = 7
  const maData = values.map((_, i) => {
    const start = Math.max(0, i - maWindow + 1)
    const window = values.slice(start, i + 1).filter(Number.isFinite)
    return window.length ? window.reduce((a,b) => a+b, 0) / window.length : null
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
      data: dates,
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
        formatter: (v) => {
          const d = new Date(v)
          return `${d.getMonth()+1}/${d.getDate()}`
        },
        interval: Math.floor(dates.length / 5)
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
      // 原始数据
      {
        name: 'Signal',
        type: 'line',
        data: values,
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: COLORS.primary,
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 114, 178, 0.2)' },
            { offset: 1, color: 'rgba(0, 114, 178, 0.02)' }
          ])
        },
        z: 1
      },
      
      // 移动平均
      {
        name: 'Trend',
        type: 'line',
        data: maData,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: COLORS.secondary,
          width: 2.5
        },
        z: 2
      },

      // 峰值标记
      ...(props.periods?.peakIndices?.length ? [{
        name: 'Peaks',
        type: 'scatter',
        data: props.periods.peakIndices.map(i => [dates[i], values[i]]),
        symbol: 'triangle',
        symbolSize: 10,
        itemStyle: {
          color: COLORS.accent,
          borderColor: '#fff',
          borderWidth: 1
        },
        z: 3
      }] : [])
    ],

    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: { color: '#171717', fontSize: 12 },
      formatter: (params) => {
        const d = new Date(params[0].axisValue)
        const signal = params.find(p => p.seriesName === 'Signal')
        const trend = params.find(p => p.seriesName === 'Trend')
        return `<div style="font-weight: 600; margin-bottom: 4px;">${d.toLocaleDateString('zh-CN')}</div>
                ${signal ? `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="display: inline-block; width: 8px; height: 2px; background: ${COLORS.primary};"></span>
                  <span style="color: #525252;">原始:</span>
                  <span style="font-weight: 600;">${signal.value?.toFixed(2) || '--'}</span>
                </div>` : ''}
                ${trend ? `<div style="display: flex; align-items: center; gap: 8px;">
                  <span style="display: inline-block; width: 8px; height: 2px; background: ${COLORS.secondary};"></span>
                  <span style="color: #525252;">趋势:</span>
                  <span style="font-weight: 600;">${trend.value?.toFixed(2) || '--'}</span>
                </div>` : ''}`
      }
    },

    animation: true,
    animationDuration: 800,
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
  link.download = `Fig_E_cycledetect_${new Date().toISOString().split('T')[0]}.${format}`
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

watch(() => [props.data, props.periods], updateChart, { deep: true })
</script>

<style scoped>
.echarts-container-ultra {
  width: 100%;
  height: 100%;
  min-height: 160px;
}
</style>
