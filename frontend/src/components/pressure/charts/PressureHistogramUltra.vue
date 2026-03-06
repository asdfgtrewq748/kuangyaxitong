<template>
  <NatureChartContainerUltra
    panel-label="C"
    :title="title"
    subtitle="Distribution Histogram"
    x-axis-label="Resistance (MPa)"
    y-axis-label="Frequency"
    :footnote="footnote"
    width="full"
    height="220px"
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
  title: { type: String, default: '闃诲姏鍒嗗竷' },
  data: { type: Array, default: () => [] },
  bins: { type: Number, default: 30 }
})

const chartRef = ref(null)
let chartInstance = null

defineExpose({
  getChartInstance: () => chartInstance
})

const footnote = computed(() => {
  if (!props.data || props.data.length === 0) return ''
  const mean = props.data.reduce((a, b) => a + b, 0) / props.data.length
  const std = Math.sqrt(props.data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / props.data.length)
  return `Mean = ${mean.toFixed(2)}, SD = ${std.toFixed(2)}, n = ${props.data.length}`
})

const COLORS = {
  primary: '#0072B2',
  secondary: '#D55E00',
  accent: '#009E73',
  grid: '#E8E8E8'
}

function calculateHistogram(data, bins) {
  if (!data || data.length === 0) return { values: [], edges: [] }

  const valid = data.filter(Number.isFinite)
  const min = Math.min(...valid)
  const max = Math.max(...valid)
  const binWidth = (max - min) / bins

  const edges = []
  const counts = Array(bins).fill(0)

  for (let i = 0; i <= bins; i++) {
    edges.push(min + i * binWidth)
  }

  for (const v of valid) {
    const idx = Math.min(Math.floor((v - min) / binWidth), bins - 1)
    if (idx >= 0 && idx < bins) {
      counts[idx]++
    }
  }

  return { 
    values: counts, 
    edges,
    stats: {
      min, max, mean: valid.reduce((a,b) => a+b, 0) / valid.length
    }
  }
}

function calculateKDE(data, points = 100) {
  if (!data || data.length < 2) return []
  
  const valid = data.filter(Number.isFinite)
  const min = Math.min(...valid)
  const max = Math.max(...valid)
  const bandwidth = (max - min) / Math.pow(valid.length, 0.2) // Silverman's rule
  
  const kde = []
  for (let i = 0; i < points; i++) {
    const x = min + (max - min) * (i / (points - 1))
    let sum = 0
    for (const xi of valid) {
      const u = (x - xi) / bandwidth
      sum += Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI)
    }
    kde.push({
      x: x.toFixed(2),
      y: sum / (valid.length * bandwidth)
    })
  }
  return kde
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

function updateChart() {
  if (!chartInstance || !props.data || props.data.length === 0) return

  const { values, edges, stats } = calculateHistogram(props.data, props.bins)
  const kdeData = calculateKDE(props.data)
  
  const xData = []
  for (let i = 0; i < values.length; i++) {
    xData.push(((edges[i] + edges[i + 1]) / 2).toFixed(1))
  }

  const maxCount = Math.max(...values)
  const maxIdx = values.indexOf(maxCount)

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
        fontFamily: 'Times New Roman, serif',
        interval: Math.floor(xData.length / 5)
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
        color: '#525252',
        fontFamily: 'Times New Roman, serif'
      },
      splitLine: {
        lineStyle: { color: COLORS.grid, width: 0.5, type: [4, 4] }
      }
    },

    series: [
      // KDE鏇茬嚎
      {
        name: 'KDE',
        type: 'line',
        data: kdeData.map(d => Math.round(d.y * props.data.length)),
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: COLORS.secondary,
          width: 2,
          type: [8, 4]
        },
        z: 2
      },
      
      // 鐩存柟鍥?
      {
        name: 'Frequency',
        type: 'bar',
        data: values.map((val, idx) => ({
          value: val,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: COLORS.primary },
              { offset: 1, color: '#4da6e8' }
            ]),
            borderRadius: idx === maxIdx ? [3, 3, 0, 0] : [1, 1, 0, 0],
            borderWidth: idx === maxIdx ? 0 : 0
          }
        })),
        barWidth: '92%',
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: COLORS.secondary },
              { offset: 1, color: '#f5a623' }
            ])
          }
        },
        markPoint: {
          symbol: 'pin',
          symbolSize: 35,
          data: [
            {
              coord: [maxIdx, maxCount],
              value: maxCount,
              itemStyle: { color: COLORS.secondary },
              label: {
                fontSize: 9,
                color: '#fff',
                fontWeight: 600
              }
            }
          ],
          animationDelay: 600
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: COLORS.accent,
            width: 1.5,
            type: [6, 4]
          },
          label: {
            position: 'end',
            fontSize: 9,
            color: COLORS.accent,
            formatter: '渭'
          },
          data: [
            { xAxis: xData.findIndex(x => parseFloat(x) >= stats.mean) }
          ]
        },
        z: 1
      }
    ],

    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: { color: '#171717', fontSize: 12 },
      extraCssText: 'box-shadow: 0 8px 24px rgba(0,0,0,0.12); border-radius: 8px;',
      formatter: (params) => {
        const barData = params.find(p => p.seriesName === 'Frequency')
        if (!barData) return ''
        return `<div style="font-weight: 600; margin-bottom: 4px;">${barData.axisValue} MPa</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 2px; background: ${COLORS.primary};"></span>
                  <span style="color: #525252;">棰戞暟:</span>
                  <span style="font-weight: 700; color: ${COLORS.primary};">${barData.value}</span>
                </div>`
      }
    },

    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut',
    animationDelay: (idx) => idx * 8
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
</script>

<style scoped>
.echarts-container-ultra {
  width: 100%;
  height: 100%;
  min-height: 160px;
}
</style>

