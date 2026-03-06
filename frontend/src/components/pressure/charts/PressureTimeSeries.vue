<template>
  <NatureChartContainer
    panel-label="B"
    :title="title"
    x-axis-label="Time"
    y-axis-label="Final Resistance (MPa)"
    :footnote="footnote"
    width="full"
    height="200px"
  >
    <div ref="chartRef" class="echarts-container"></div>
  </NatureChartContainer>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import { echarts } from '@/lib/echarts-pressure'
import NatureChartContainer from '../shared/NatureChartContainer.vue'

const props = defineProps({
  title: { type: String, default: '鏀灦闃诲姏鏃跺簭鍙樺寲' },
  data: { type: Array, default: () => [] }, // [{ date, value, std }]
  supportId: { type: Number, default: null },
  showErrorBar: { type: Boolean, default: true },
  showPeaks: { type: Boolean, default: false },
  peaks: { type: Array, default: () => [] } // 宄板€肩储寮?
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  if (!props.data || props.data.length === 0) return ''
  const n = props.data.length
  return `鍧囧€?卤 鏍囧噯宸? n = ${n}`
})

// Nature 閰嶈壊
const COLORS = {
  primary: '#0072B2',
  secondary: '#D55E00',
  peak: '#CC79A7',
  grid: '#e5e5e5'
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
    renderer: 'canvas'
  })

  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.data || props.data.length === 0) return

  const dates = props.data.map(d => d.date)
  const values = props.data.map(d => d.value)
  const stds = props.data.map(d => d.std || 0)

  const option = {
    // 闅愯棌榛樿鏍囬
    title: { show: false },

    // 缃戞牸
    grid: {
      left: 45,
      right: 15,
      top: 15,
      bottom: 30
    },

    // X杞?
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: { color: '#171717', width: 0.5 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#171717', width: 0.5 }
      },
      axisLabel: {
        fontSize: 7,
        color: '#171717',
        formatter: (value) => {
          if (!value) return ''
          const d = new Date(value)
          return `${d.getMonth() + 1}/${d.getDate()}`
        }
      },
      splitLine: { show: false }
    },

    // Y杞?
    yAxis: {
      type: 'value',
      min: 0,
      max: 70,
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

    // 绯诲垪
    series: [
      // 璇樊妫掞紙濡傛灉鏄剧ず锛?
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
              // 涓婄珫绾?
              {
                type: 'line',
                shape: {
                  x1: point[0],
                  y1: point[1],
                  x2: pointTop[0],
                  y2: pointTop[1]
                },
                style: { stroke: COLORS.primary, lineWidth: 0.5 }
              },
              // 涓嬬珫绾?
              {
                type: 'line',
                shape: {
                  x1: point[0],
                  y1: point[1],
                  x2: pointBottom[0],
                  y2: pointBottom[1]
                },
                style: { stroke: COLORS.primary, lineWidth: 0.5 }
              }
            ]
          }
        },
        data: dates.map((date, i) => [date, values[i], stds[i]]),
        z: 1
      }] : []),

      // 涓绘姌绾?
      {
        name: 'Resistance',
        type: 'line',
        data: values,
        smooth: false,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: COLORS.primary,
          width: 1.5
        },
        itemStyle: {
          color: COLORS.primary,
          borderColor: '#ffffff',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            color: COLORS.secondary,
            borderColor: '#ffffff',
            borderWidth: 2,
            shadowBlur: 4,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        z: 2
      },

      // 宄板€兼爣璁帮紙濡傛灉鏄剧ず锛?
      ...(props.showPeaks && props.peaks.length > 0 ? [{
        name: 'Peaks',
        type: 'scatter',
        data: props.peaks.map(i => [dates[i], values[i]]),
        symbol: 'triangle',
        symbolSize: 10,
        itemStyle: {
          color: COLORS.peak,
          borderColor: '#ffffff',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            color: COLORS.peak,
            shadowBlur: 6,
            shadowColor: 'rgba(204, 121, 167, 0.4)'
          }
        },
        z: 3
      }] : [])
    ],

    // 鎻愮ず妗?
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      textStyle: {
        color: '#171717',
        fontSize: 11
      },
      formatter: (params) => {
        const date = params[0].axisValue
        const value = params.find(p => p.seriesName === 'Resistance')?.value || '-'
        const d = new Date(date)
        return `<div style="font-weight:600;margin-bottom:4px;">${d.toLocaleDateString('zh-CN')}</div>
                <div>鏈樆鍔? <span style="color:${COLORS.primary};font-weight:600;">${value}</span> MPa</div>`
      }
    },

    // 鍔ㄧ敾
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

watch(() => props.data, updateChart, { deep: true })
watch(() => props.showPeaks, updateChart)
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

