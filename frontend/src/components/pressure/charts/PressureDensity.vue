<template>
  <NatureChartContainerUltra
    :panel-label="panelLabel"
    :title="title"
    :subtitle="subtitle"
    x-axis-label="末阻力 (MPa)"
    y-axis-label="概率密度"
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
  title: { type: String, default: '核密度估计' },
  subtitle: { type: String, default: 'Kernel Density Estimation' },
  panelLabel: { type: String, default: 'I' },
  data: { type: Array, default: () => [] },
  bandwidth: { type: Number, default: null } // Auto if null
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  if (!props.data.length) return ''
  const bw = calculateBandwidth()
  return `带宽 h = ${bw.toFixed(3)}，高斯核函数`
})

const COLORS = {
  density: NATURE_COLORS.tertiary,
  mean: NATURE_COLORS.secondary,
  fill: 'rgba(0, 158, 115, 0.2)',
  grid: '#E8E8E8'
}

function calculateBandwidth() {
  if (props.bandwidth) return props.bandwidth
  
  const values = props.data.map(d => d.finalResistanceValue || d.value).filter(Number.isFinite)
  if (values.length < 2) return 1
  
  // Silverman's rule of thumb
  const n = values.length
  const std = Math.sqrt(values.reduce((acc, v) => acc + Math.pow(v - values.reduce((a,b) => a+b)/n, 2), 0) / n)
  const iqr = calculateIQR(values)
  const sigma = Math.min(std, iqr / 1.34)
  
  return 0.9 * sigma * Math.pow(n, -0.2)
}

function calculateIQR(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  const q1 = sorted[Math.floor(n * 0.25)]
  const q3 = sorted[Math.floor(n * 0.75)]
  return q3 - q1
}

function gaussianKernel(x) {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x)
}

function calculateKDE(values, xValues, bandwidth) {
  const n = values.length
  
  return xValues.map(x => {
    let sum = 0
    values.forEach(xi => {
      sum += gaussianKernel((x - xi) / bandwidth)
    })
    return {
      x: x,
      density: sum / (n * bandwidth)
    }
  })
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
  if (values.length < 2) return
  
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min
  
  // Create evaluation points
  const numPoints = 200
  const xValues = []
  for (let i = 0; i < numPoints; i++) {
    xValues.push(min - range * 0.1 + (range * 1.2) * i / (numPoints - 1))
  }
  
  const bandwidth = calculateBandwidth()
  const kde = calculateKDE(values, xValues, bandwidth)
  
  // Calculate mean
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const meanDensity = kde.reduce((closest, p) => 
    Math.abs(p.x - mean) < Math.abs(closest.x - mean) ? p : closest
  , kde[0])
  
  // Find modes (local maxima)
  const modes = []
  for (let i = 1; i < kde.length - 1; i++) {
    if (kde[i].density > kde[i-1].density && kde[i].density > kde[i+1].density && kde[i].density > 0.01) {
      modes.push(kde[i])
    }
  }
  const topModes = modes.sort((a, b) => b.density - a.density).slice(0, 2)
  
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
      min: Math.floor(min - range * 0.05),
      max: Math.ceil(max + range * 0.05),
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
          color: '#E8E8E8', 
          width: 0.5,
          type: [4, 4]
        }
      }
    },
    
    series: [
      {
        name: 'KDE',
        type: 'line',
        data: kde.map(d => [d.x, d.density]),
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: COLORS.density,
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: COLORS.fill },
            { offset: 1, color: 'rgba(0, 158, 115, 0.02)' }
          ])
        },
        markLine: {
          symbol: ['none', 'none'],
          lineStyle: {
            color: COLORS.mean,
            width: 0.75,
            type: [4, 2]
          },
          label: {
            position: 'end',
            fontSize: 8,
            formatter: 'μ'
          },
          data: [
            { xAxis: mean }
          ]
        },
        markPoint: {
          symbol: 'triangle',
          symbolSize: 10,
          symbolRotate: 180,
          itemStyle: {
            color: NATURE_COLORS.orange,
            borderColor: '#ffffff',
            borderWidth: 1.5
          },
          label: {
            show: true,
            fontSize: 8,
            formatter: (p) => `Mode: ${p.data.xAxis.toFixed(1)}`,
            position: 'top',
            distance: 5
          },
          data: topModes.slice(0, 1).map(m => ({
            xAxis: m.x,
            yAxis: m.density
          }))
        }
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
        const x = params[0].data[0]
        const density = params[0].data[1]
        return `
          <div style="font-weight: 600; margin-bottom: 4px;">核密度估计</div>
          <div style="font-size: 11px;">
            压力: <span style="font-weight: 600;">${x.toFixed(2)} MPa</span><br>
            密度: <span style="font-weight: 600; color: ${COLORS.density};">${density.toFixed(4)}</span>
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
