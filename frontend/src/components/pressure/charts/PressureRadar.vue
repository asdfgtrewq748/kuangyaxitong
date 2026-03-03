<template>
  <NatureChartContainerUltra
    :panel-label="panelLabel"
    :title="title"
    :subtitle="subtitle"
    x-axis-label=""
    y-axis-label=""
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
  title: { type: String, default: '压力特征雷达图' },
  subtitle: { type: String, default: 'Multi-dimensional Analysis' },
  panelLabel: { type: String, default: 'H' },
  data: { type: Array, default: () => [] },
  compareData: { type: Array, default: null }
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  return '展示压力数据的多维统计特征'
})

const COLORS = {
  primary: NATURE_COLORS.primary,
  secondary: NATURE_COLORS.secondary,
  fill: 'rgba(0, 114, 178, 0.2)',
  fillSecondary: 'rgba(213, 94, 0, 0.15)',
  grid: '#E8E8E8'
}

function calculateFeatures(data) {
  if (!data.length) return null
  
  const values = data.map(d => d.finalResistanceValue || d.value).filter(Number.isFinite)
  if (!values.length) return null
  
  const n = values.length
  const mean = values.reduce((a, b) => a + b, 0) / n
  const min = Math.min(...values)
  const max = Math.max(...values)
  const std = Math.sqrt(values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n)
  
  // Coefficient of variation
  const cv = mean > 0 ? (std / mean) * 100 : 0
  
  // Skewness (simplified)
  const skewness = values.reduce((acc, v) => acc + Math.pow((v - mean) / std, 3), 0) / n
  
  // Kurtosis (simplified)
  const kurtosis = values.reduce((acc, v) => acc + Math.pow((v - mean) / std, 4), 0) / n - 3
  
  // Trend strength (autocorrelation at lag 1)
  let trendStrength = 0
  if (n > 1) {
    const lag1Corr = calculateAutocorrelation(values, 1)
    trendStrength = Math.abs(lag1Corr) * 100
  }
  
  // Normalized values (0-100 scale)
  const features = {
    mean: Math.min(100, (mean / 60) * 100),
    variation: Math.min(100, cv * 2),
    stability: Math.max(0, 100 - cv * 3),
    peakRatio: Math.min(100, (max / 60) * 100),
    trend: trendStrength,
    skewness: Math.min(100, Math.abs(skewness) * 50)
  }
  
  return features
}

function calculateAutocorrelation(values, lag) {
  const n = values.length
  const mean = values.reduce((a, b) => a + b, 0) / n
  
  let numerator = 0
  let denominator = 0
  
  for (let i = 0; i < n - lag; i++) {
    numerator += (values[i] - mean) * (values[i + lag] - mean)
  }
  
  for (let i = 0; i < n; i++) {
    denominator += Math.pow(values[i] - mean, 2)
  }
  
  return denominator === 0 ? 0 : numerator / denominator
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
  
  const features = calculateFeatures(props.data)
  if (!features) return
  
  const indicator = [
    { name: '平均压力', max: 100 },
    { name: '变异系数', max: 100 },
    { name: '稳定性', max: 100 },
    { name: '峰值比例', max: 100 },
    { name: '趋势强度', max: 100 },
    { name: '偏度', max: 100 }
  ]
  
  const seriesData = [{
    value: [
      features.mean,
      features.variation,
      features.stability,
      features.peakRatio,
      features.trend,
      features.skewness
    ],
    name: '当前数据'
  }]
  
  // Add comparison if provided
  if (props.compareData) {
    const compareFeatures = calculateFeatures(props.compareData)
    if (compareFeatures) {
      seriesData.push({
        value: [
          compareFeatures.mean,
          compareFeatures.variation,
          compareFeatures.stability,
          compareFeatures.peakRatio,
          compareFeatures.trend,
          compareFeatures.skewness
        ],
        name: '对比数据'
      })
    }
  }
  
  const option = {
    backgroundColor: 'transparent',
    
    legend: {
      bottom: 5,
      textStyle: {
        fontSize: 9,
        fontFamily: 'Arial, Helvetica, sans-serif'
      },
      data: seriesData.map(s => s.name)
    },
    
    radar: {
      indicator: indicator,
      center: ['50%', '45%'],
      radius: '65%',
      axisName: {
        fontSize: 9,
        color: '#000000',
        fontFamily: 'Arial, Helvetica, sans-serif'
      },
      splitArea: {
        areaStyle: {
          color: ['#FAFAFA', '#FFFFFF']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#E0E0E0',
          width: 0.5
        }
      },
      splitLine: {
        lineStyle: {
          color: '#E0E0E0',
          width: 0.5
        }
      }
    },
    
    series: [{
      type: 'radar',
      data: seriesData.map((s, i) => ({
        ...s,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: {
          color: i === 0 ? COLORS.primary : COLORS.secondary,
          width: 1.5
        },
        itemStyle: {
          color: i === 0 ? COLORS.primary : COLORS.secondary,
          borderColor: '#ffffff',
          borderWidth: 1.5
        },
        areaStyle: {
          color: i === 0 ? COLORS.fill : COLORS.fillSecondary
        }
      })),
      emphasis: {
        lineStyle: {
          width: 2.5
        },
        itemStyle: {
          symbolSize: 7,
          borderWidth: 2
        }
      }
    }],
    
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
        const indicators = ['平均压力', '变异系数', '稳定性', '峰值比例', '趋势强度', '偏度']
        const values = params.value
        
        let html = `<div style="font-weight: 600; margin-bottom: 8px;">${params.name}</div>`
        html += '<div style="font-size: 11px; display: grid; grid-template-columns: auto auto; gap: 4px 12px;">'
        
        indicators.forEach((ind, i) => {
          html += `<span>${ind}:</span><span style="font-weight: 600;">${values[i].toFixed(1)}</span>`
        })
        
        html += '</div>'
        return html
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
