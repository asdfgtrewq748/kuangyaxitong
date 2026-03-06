<template>
  <NatureChartContainerUltra
    panel-label="B"
    :title="title"
    subtitle="Resistance Time Series"
    x-axis-label="鏃堕棿"
    y-axis-label="鏈樆鍔?(MPa)"
    :footnote="footnote"
    width="full"
    height="260px"
  >
    <div ref="chartRef" class="echarts-container-ultra"></div>
  </NatureChartContainerUltra>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import { echarts } from '@/lib/echarts-pressure'
import NatureChartContainerUltra from '../shared/NatureChartContainerUltra.vue'
import { NATURE_ECHARTS_THEME, NATURE_COLORS } from '@/utils/natureFigureConfig'
import { exportECharts } from '@/utils/figureExport'

const props = defineProps({
  title: { type: String, default: '鏀灦闃诲姏鏃跺簭鍙樺寲' },
  data: { type: Array, default: () => [] },
  supportId: { type: Number, default: null },
  showErrorBar: { type: Boolean, default: true },
  showPeaks: { type: Boolean, default: false },
  peaks: { type: Array, default: () => [] },
  showTrend: { type: Boolean, default: true },
  showBands: { type: Boolean, default: true }
})

const chartRef = ref(null)
let chartInstance = null

// 鏆撮湶鍥捐〃瀹炰緥渚涘鍑轰娇鐢?
defineExpose({
  getChartInstance: () => chartInstance
})

const footnote = computed(() => {
  if (!props.data || props.data.length === 0) return ''
  const n = props.data.length
  const mean = props.data.reduce((a, b) => a + b.value, 0) / n
  const std = Math.sqrt(props.data.reduce((a, b) => a + Math.pow(b.value - mean, 2), 0) / n)
  return `鍧囧€?${mean.toFixed(2)} 卤 ${std.toFixed(2)} MPa, n = ${n}`
})

// Nature鏈熷垔閰嶈壊 - 鑹茬洸鍙嬪ソ
const COLORS = {
  primary: '#0072B2',      // 娣辫摑鑹?
  secondary: '#D55E00',    // 姗欑孩鑹?
  accent: '#CC79A7',       // 绮夌传鑹?
  success: '#009E73',      // 缁胯壊
  grid: '#E8E8E8',
  text: '#171717',
  textSecondary: '#525252'
}

function initChart() {
  if (!chartRef.value) return
  
  // 妫€鏌ュ鍣ㄥ昂瀵革紝閬垮厤 ECharts 鎶ラ敊
  const { clientWidth, clientHeight } = chartRef.value
  if (clientWidth === 0 || clientHeight === 0) {
    // 寤惰繜鍒濆鍖栵紝绛夊緟瀹瑰櫒鏈夊昂瀵?
    setTimeout(initChart, 100)
    return
  }

  chartInstance = echarts.init(chartRef.value, null, {
    renderer: 'canvas',
    devicePixelRatio: window.devicePixelRatio || 2
  })

  updateChart()
}

function calculateTrendLine(data) {
  if (data.length < 2) return []
  
  const n = data.length
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0
  
  data.forEach((d, i) => {
    sumX += i
    sumY += d.value
    sumXY += i * d.value
    sumXX += i * i
  })
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  return data.map((d, i) => ({
    date: d.date,
    value: slope * i + intercept
  }))
}

function calculateConfidenceBands(data) {
  if (data.length < 2) return { upper: [], lower: [] }
  
  const trend = calculateTrendLine(data)
  const residuals = data.map((d, i) => Math.abs(d.value - trend[i].value))
  const meanResidual = residuals.reduce((a, b) => a + b, 0) / residuals.length
  const stdResidual = Math.sqrt(residuals.reduce((a, b) => a + b * b, 0) / residuals.length)
  
  const band = meanResidual + 1.96 * stdResidual
  
  return {
    upper: trend.map(t => ({ date: t.date, value: t.value + band })),
    lower: trend.map(t => ({ date: t.date, value: Math.max(0, t.value - band) }))
  }
}

function updateChart() {
  if (!chartInstance || !props.data || props.data.length === 0) return

  const dates = props.data.map(d => d.date)
  const values = props.data.map(d => d.value)
  const stds = props.data.map(d => d.std || 0)
  
  const trendData = props.showTrend ? calculateTrendLine(props.data) : []
  const bands = props.showBands ? calculateConfidenceBands(props.data) : { upper: [], lower: [] }

  const option = {
    backgroundColor: 'transparent',
    
    grid: {
      left: 55,
      right: 25,
      top: 30,
      bottom: 45
    },

    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: {
        show: true,
        lineStyle: { color: COLORS.text, width: 0.8 }
      },
      axisTick: {
        show: true,
        inside: true,
        lineStyle: { color: COLORS.text, width: 0.8 }
      },
      axisLabel: {
        fontSize: 9,
        color: COLORS.textSecondary,
        fontFamily: 'Times New Roman, serif',
        formatter: (value) => {
          if (!value) return ''
          const d = new Date(value)
          return `${d.getMonth() + 1}/${d.getDate()}`
        },
        interval: Math.floor(dates.length / 6)
      },
      splitLine: { show: false }
    },

    yAxis: {
      type: 'value',
      min: 0,
      max: (value) => Math.ceil(value.max * 1.1),
      axisLine: {
        show: true,
        lineStyle: { color: COLORS.text, width: 0.8 }
      },
      axisTick: {
        show: true,
        inside: true,
        lineStyle: { color: COLORS.text, width: 0.8 }
      },
      axisLabel: {
        fontSize: 9,
        color: COLORS.textSecondary,
        fontFamily: 'Times New Roman, serif'
      },
      splitLine: {
        lineStyle: { 
          color: COLORS.grid, 
          width: 0.5,
          type: [4, 4]
        }
      }
    },

    series: [
      // 缃俊鍖洪棿濉厖
      ...(props.showBands && bands.upper.length > 0 ? [{
        name: 'Confidence',
        type: 'line',
        data: bands.upper.map((d, i) => [d.date, d.value, bands.lower[i].value]),
        lineStyle: { opacity: 0 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 114, 178, 0.15)' },
            { offset: 1, color: 'rgba(0, 114, 178, 0.05)' }
          ])
        },
        symbol: 'none',
        silent: true,
        z: 1
      }] : []),

      // 瓒嬪娍绾?
      ...(props.showTrend && trendData.length > 0 ? [{
        name: 'Trend',
        type: 'line',
        data: trendData.map(d => d.value),
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: COLORS.secondary,
          width: 2,
          type: [8, 4],
          dashOffset: 4
        },
        silent: true,
        z: 2
      }] : []),

      // 璇樊妫?
      ...(props.showErrorBar ? [{
        name: 'Error',
        type: 'custom',
        renderItem: (params, api) => {
          const xValue = api.value(0)
          const yValue = api.value(1)
          const std = api.value(2)
          
          const point = api.coord([xValue, yValue])
          const pointTop = api.coord([xValue, yValue + std])
          const pointBottom = api.coord([xValue, yValue - std])
          
          return {
            type: 'group',
            children: [
              {
                type: 'line',
                shape: { x1: point[0], y1: pointTop[1], x2: point[0], y2: pointBottom[1] },
                style: { stroke: COLORS.primary, lineWidth: 0.8 }
              },
              {
                type: 'line',
                shape: { x1: point[0] - 4, y1: pointTop[1], x2: point[0] + 4, y2: pointTop[1] },
                style: { stroke: COLORS.primary, lineWidth: 0.8 }
              },
              {
                type: 'line',
                shape: { x1: point[0] - 4, y1: pointBottom[1], x2: point[0] + 4, y2: pointBottom[1] },
                style: { stroke: COLORS.primary, lineWidth: 0.8 }
              }
            ]
          }
        },
        data: dates.map((date, i) => [date, values[i], stds[i]]),
        z: 3
      }] : []),

      // 涓绘姌绾?
      {
        name: 'Resistance',
        type: 'line',
        data: values,
        smooth: false,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: {
          color: COLORS.primary,
          width: 1.5
        },
        itemStyle: {
          color: COLORS.primary,
          borderColor: '#ffffff',
          borderWidth: 1.5
        },
        emphasis: {
          itemStyle: {
            color: COLORS.accent,
            borderColor: '#ffffff',
            borderWidth: 2,
            shadowBlur: 8,
            shadowColor: 'rgba(204, 121, 167, 0.4)'
          }
        },
        z: 4
      },

      // 宄板€兼爣璁?
      ...(props.showPeaks && props.peaks.length > 0 ? [{
        name: 'Peaks',
        type: 'scatter',
        data: props.peaks.map(i => [dates[i], values[i]]),
        symbol: 'triangle',
        symbolSize: 12,
        itemStyle: {
          color: COLORS.secondary,
          borderColor: '#ffffff',
          borderWidth: 1.5,
          shadowBlur: 4,
          shadowColor: 'rgba(213, 94, 0, 0.3)'
        },
        emphasis: {
          itemStyle: {
            symbolSize: 15,
            shadowBlur: 8,
            shadowColor: 'rgba(213, 94, 0, 0.5)'
          }
        },
        z: 5
      }] : [])
    ],

    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        color: '#171717',
        fontSize: 12,
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
      },
      extraCssText: 'box-shadow: 0 8px 24px rgba(0,0,0,0.12); border-radius: 8px;',
      formatter: (params) => {
        const date = params[0].axisValue
        const mainData = params.find(p => p.seriesName === 'Resistance')
        const value = mainData?.value || '-'
        const d = new Date(date)
        
        let html = `<div style="font-weight: 600; margin-bottom: 8px; font-size: 13px;">
                      ${d.getFullYear()}骞?{d.getMonth() + 1}鏈?{d.getDate()}鏃?
                    </div>`
        html += `<div style="display: flex; align-items: center; gap: 8px;">
                   <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${COLORS.primary};"></span>
                   <span style="color: #525252;">鏈樆鍔?</span>
                   <span style="font-weight: 700; color: ${COLORS.primary}; font-size: 14px;">${value}</span>
                   <span style="color: #a3a3a3; font-size: 11px;">MPa</span>
                 </div>`
        
        const trendData = params.find(p => p.seriesName === 'Trend')
        if (trendData) {
          html += `<div style="margin-top: 6px; display: flex; align-items: center; gap: 8px;">
                     <span style="display: inline-block; width: 12px; height: 2px; background: ${COLORS.secondary};"></span>
                     <span style="color: #525252; font-size: 11px;">瓒嬪娍:</span>
                     <span style="font-weight: 600; color: ${COLORS.secondary};">${trendData.value.toFixed(2)}</span>
                   </div>`
        }
        
        return html
      }
    },

    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
    animationDelay: (idx) => idx * 15
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
watch(() => props.showPeaks, updateChart)
watch(() => props.showTrend, updateChart)
</script>

<style scoped>
.echarts-container-ultra {
  width: 100%;
  height: 100%;
  min-height: 200px;
}
</style>

