<template>
  <NatureChartContainer
    panel-label="I"
    :title="title"
    x-axis-label="前柱阻力"
    y-axis-label="后柱阻力"
    :footnote="footnote"
    width="full"
    height="200px"
  >
    <div ref="chartRef" class="echarts-container"></div>
  </NatureChartContainer>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import * as echarts from 'echarts'
import NatureChartContainer from '../shared/NatureChartContainer.vue'
import { mean, std } from '@/utils/pressureDataProcessor'

const props = defineProps({
  title: { type: String, default: '前后柱阻力对比' },
  frontData: { type: Array, default: () => [] },
  rearData: { type: Array, default: () => [] }
})

const chartRef = ref(null)
let chartInstance = null

// Nature 配色
const COLORS = {
  primary: '#0072B2',
  secondary: '#D55E00',
  line: '#171717',
  refLine: '#a3a3a3',
  grid: '#e5e5e5'
}

const footnote = computed(() => {
  if (props.frontData.length === 0 || props.rearData.length === 0) return ''
  const n = Math.min(props.frontData.length, props.rearData.length)
  return `n = ${n}`
})

function prepareScatterData() {
  if (!props.frontData || !props.rearData) return []

  // 按支架号和日期配对前后柱数据
  const frontBySupport = new Map()
  const rearBySupport = new Map()

  props.frontData.forEach(d => {
    const key = `${d.supportId}_${new Date(d.finalResistanceTime).getTime()}`
    frontBySupport.set(key, d.finalResistanceValue)
  })

  props.rearData.forEach(d => {
    const key = `${d.supportId}_${new Date(d.finalResistanceTime).getTime()}`
    rearBySupport.set(key, d.finalResistanceValue)
  })

  const scatterData = []
  for (const [key, frontValue] of frontBySupport) {
    if (rearBySupport.has(key)) {
      const rearValue = rearBySupport.get(key)
      if (Number.isFinite(frontValue) && Number.isFinite(rearValue)) {
        scatterData.push([frontValue, rearValue])
      }
    }
  }

  return scatterData
}

function calculateRegression(data) {
  if (data.length < 2) return { slope: 0, intercept: 0, r2: 0 }

  const n = data.length
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0

  data.forEach(([x, y]) => {
    sumX += x
    sumY += y
    sumXY += x * y
    sumX2 += x * x
    sumY2 += y * y
  })

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // R²
  const meanY = sumY / n
  let ssTotal = 0, ssRes = 0
  data.forEach(([x, y]) => {
    const yPred = slope * x + intercept
    ssTotal += (y - meanY) ** 2
    ssRes += (y - yPred) ** 2
  })

  const r2 = ssTotal === 0 ? 0 : 1 - ssRes / ssTotal

  return { slope, intercept, r2 }
}

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance) return

  const scatterData = prepareScatterData()

  if (scatterData.length === 0) {
    chartInstance.clear()
    return
  }

  const { slope, intercept, r2 } = calculateRegression(scatterData)

  // 找出数据范围
  const xValues = scatterData.map(d => d[0])
  const yValues = scatterData.map(d => d[1])
  const maxVal = Math.max(...xValues, ...yValues)
  const minVal = Math.min(...xValues, ...yValues)

  // 回归线数据
  const lineData = [
    [minVal, slope * minVal + intercept],
    [maxVal, slope * maxVal + intercept]
  ]

  // y=x 参考线
  const refLineData = [
    [minVal, minVal],
    [maxVal, maxVal]
  ]

  const option = {
    title: { show: false },

    grid: {
      left: 45,
      right: 15,
      top: 15,
      bottom: 35
    },

    xAxis: {
      type: 'value',
      min: 0,
      max: Math.ceil(maxVal / 10) * 10,
      axisLine: {
        lineStyle: { color: '#171717', width: 0.5 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#171717', width: 0.5 }
      },
      axisLabel: {
        fontSize: 7,
        color: '#171717'
      },
      splitLine: {
        lineStyle: { color: COLORS.grid, width: 0.5, type: 'dashed' }
      }
    },

    yAxis: {
      type: 'value',
      min: 0,
      max: Math.ceil(maxVal / 10) * 10,
      axisLine: {
        show: true,
        lineStyle: { color: '#171717', width: 0.5 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#171717', width: 0.5 }
      },
      axisLabel: {
        fontSize: 7,
        color: '#171717'
      },
      splitLine: {
        lineStyle: { color: COLORS.grid, width: 0.5, type: 'dashed' }
      }
    },

    series: [
      // y=x 参考线
      {
        name: 'y=x',
        type: 'line',
        data: refLineData,
        symbol: 'none',
        lineStyle: {
          color: COLORS.refLine,
          width: 0.5,
          type: 'dashed'
        },
        z: 1
      },
      // 散点
      {
        name: 'Data',
        type: 'scatter',
        data: scatterData,
        symbolSize: 4,
        itemStyle: {
          color: COLORS.primary,
          opacity: 0.6,
          borderColor: '#ffffff',
          borderWidth: 0.5
        },
        emphasis: {
          itemStyle: {
            color: COLORS.secondary,
            opacity: 1,
            shadowBlur: 6,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        z: 2
      },
      // 回归线
      {
        name: 'Regression',
        type: 'line',
        data: lineData,
        symbol: 'none',
        lineStyle: {
          color: COLORS.secondary,
          width: 1.5
        },
        z: 3
      }
    ],

    // 提示框
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      textStyle: {
        color: '#171717',
        fontSize: 11
      },
      formatter: (params) => {
        if (params.seriesName === 'Data') {
          return `<div style="font-weight:600;margin-bottom:4px;">数据点</div>
                  <div>前柱: <span style="color:${COLORS.primary};font-weight:600;">${params.value[0]}</span> MPa</div>
                  <div>后柱: <span style="color:${COLORS.primary};font-weight:600;">${params.value[1]}</span> MPa</div>`
        }
        return ''
      }
    },

    // 图形标注
    graphic: [
      {
        type: 'text',
        right: 25,
        top: 40,
        style: {
          text: `y = ${slope.toFixed(2)}x + ${intercept.toFixed(1)}`,
          font: '7pt PingFang SC, Arial',
          fill: '#737373'
        }
      },
      {
        type: 'text',
        right: 25,
        top: 55,
        style: {
          text: `R² = ${r2.toFixed(3)}`,
          font: '7pt PingFang SC, Arial',
          fill: '#737373'
        }
      }
    ],

    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut'
  }

  chartInstance.setOption(option, true)
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

watch(() => [props.frontData, props.rearData], updateChart, { deep: true })
</script>

<style scoped>
.echarts-container {
  width: 100%;
  height: 100%;
  min-height: 150px;
  animation: chartFadeIn 0.5s ease;
}

@keyframes chartFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
