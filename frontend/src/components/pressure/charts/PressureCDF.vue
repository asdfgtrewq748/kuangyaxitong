<template>
  <NatureChartContainerUltra
    :panel-label="panelLabel"
    :title="title"
    :subtitle="subtitle"
    x-axis-label="末阻力 (MPa)"
    y-axis-label="累积概率"
    :footnote="footnote"
    width="full"
    height="260px"
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
  title: { type: String, default: '累积分布函数' },
  subtitle: { type: String, default: 'Cumulative Distribution Function' },
  panelLabel: { type: String, default: 'D' },
  data: { type: Array, default: () => [] },
  showPercentiles: { type: Boolean, default: true }
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  if (!props.data.length) return ''
  const values = props.data.map(d => d.finalResistanceValue || d.value).filter(Number.isFinite)
  const sorted = [...values].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  return `中位数: ${median.toFixed(2)} MPa，样本量 n = ${values.length}`
})

const COLORS = {
  cdf: NATURE_COLORS.primary,
  percentile: NATURE_COLORS.secondary,
  reference: '#E8E8E8',
  fill: 'rgba(0, 114, 178, 0.1)'
}

function calculateCDF(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  
  return sorted.map((val, i) => ({
    value: val,
    probability: (i + 1) / n
  }))
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
  if (!chartInstance || !props.data.length) return
  
  const values = props.data.map(d => d.finalResistanceValue || d.value).filter(Number.isFinite)
  if (!values.length) return
  
  const cdfData = calculateCDF(values)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  
  // Calculate percentiles
  const sorted = [...values].sort((a, b) => a - b)
  const p10 = sorted[Math.floor(sorted.length * 0.1)]
  const p25 = sorted[Math.floor(sorted.length * 0.25)]
  const p50 = sorted[Math.floor(sorted.length * 0.5)]
  const p75 = sorted[Math.floor(sorted.length * 0.75)]
  const p90 = sorted[Math.floor(sorted.length * 0.9)]
  
  const markLines = props.showPercentiles ? [
    { xAxis: p10, name: 'P10', label: { formatter: 'P10' } },
    { xAxis: p25, name: 'P25', label: { formatter: 'Q1' } },
    { xAxis: p50, name: 'P50', label: { formatter: 'Median', fontWeight: 'bold' } },
    { xAxis: p75, name: 'P75', label: { formatter: 'Q3' } },
    { xAxis: p90, name: 'P90', label: { formatter: 'P90' } }
  ] : []
  
  const option = {
    backgroundColor: 'transparent',
    
    grid: {
      left: 55,
      right: 25,
      top: 30,
      bottom: 45
    },
    
    xAxis: {
      type: 'value',
      min: Math.floor(minVal),
      max: Math.ceil(maxVal),
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
      max: 1,
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
        formatter: (val) => `${(val * 100).toFixed(0)}%`
      },
      splitLine: {
        lineStyle: { 
          color: '#E8E8E8', 
          width: 0.5,
          type: [4, 4]
        }
      }
    },
    
    series: [
      {
        name: 'CDF',
        type: 'line',
        data: cdfData.map(d => [d.value, d.probability]),
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: COLORS.cdf,
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 114, 178, 0.2)' },
            { offset: 1, color: 'rgba(0, 114, 178, 0.02)' }
          ])
        },
        markLine: props.showPercentiles ? {
          symbol: ['none', 'none'],
          lineStyle: {
            color: COLORS.percentile,
            width: 0.75,
            type: [4, 2]
          },
          label: {
            position: 'insideEndTop',
            fontSize: 8,
            color: COLORS.percentile,
            distance: 5
          },
          data: markLines
        } : null,
        markPoint: props.showPercentiles ? {
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: COLORS.percentile,
            borderColor: '#ffffff',
            borderWidth: 1.5
          },
          label: {
            show: true,
            fontSize: 8,
            formatter: (p) => `${p.value.toFixed(1)}`,
            position: 'bottom',
            distance: 5
          },
          data: [
            { coord: [p50, 0.5], value: p50 }
          ]
        } : null
      }
    ],
    
    tooltip: {
      trigger: 'axis',
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
        const val = params[0].data[0]
        const prob = params[0].data[1]
        return `
          <div style="font-weight: 600; margin-bottom: 4px;">累积分布</div>
          <div style="font-size: 11px;">
            压力: <span style="font-weight: 600;">${val.toFixed(2)} MPa</span><br>
            累积概率: <span style="font-weight: 600; color: ${COLORS.cdf};">${(prob * 100).toFixed(1)}%</span>
          </div>
        `
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
