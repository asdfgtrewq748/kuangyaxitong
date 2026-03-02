<template>
  <NatureChartContainer
    panel-label="B"
    :title="title"
    x-axis-label="时间 (月)"
    y-axis-label="末阻力"
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

const props = defineProps({
  title: { type: String, default: '支架阻力时序变化' },
  data: { type: Array, default: () => [] }, // [{ date, value, std }]
  supportId: { type: Number, default: null },
  showErrorBar: { type: Boolean, default: true },
  showPeaks: { type: Boolean, default: false },
  peaks: { type: Array, default: () => [] } // 峰值索引
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  if (!props.data || props.data.length === 0) return ''
  const n = props.data.length
  return `均值 ± 标准差, n = ${n}`
})

// Nature 配色
const COLORS = {
  primary: '#0072B2',
  secondary: '#D55E00',
  peak: '#CC79A7'
}

function initChart() {
  if (!chartRef.value) return

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
    // 隐藏默认标题
    title: { show: false },

    // 网格
    grid: {
      left: 45,
      right: 15,
      top: 15,
      bottom: 30
    },

    // X轴
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: { color: '#000000', width: 0.5 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#000000', width: 0.5 }
      },
      axisLabel: {
        fontSize: 7,
        color: '#000000',
        formatter: (value) => {
          if (!value) return ''
          const d = new Date(value)
          return `${d.getMonth() + 1}/${d.getDate()}`
        }
      },
      splitLine: { show: false }
    },

    // Y轴
    yAxis: {
      type: 'value',
      min: 0,
      max: 70,
      axisLine: {
        show: true,
        lineStyle: { color: '#000000', width: 0.5 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#000000', width: 0.5 }
      },
      axisLabel: {
        fontSize: 7,
        color: '#000000'
      },
      splitLine: {
        lineStyle: { color: '#e2e8f0', width: 0.5, type: 'dashed' }
      }
    },

    // 系列
    series: [
      // 误差棒（如果显示）
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
              // 上竖线
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
              // 下竖线
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

      // 主折线
      {
        name: 'Resistance',
        type: 'line',
        data: values,
        smooth: false,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: COLORS.primary,
          width: 1
        },
        itemStyle: {
          color: COLORS.primary
        },
        z: 2
      },

      // 峰值标记（如果显示）
      ...(props.showPeaks && props.peaks.length > 0 ? [{
        name: 'Peaks',
        type: 'scatter',
        data: props.peaks.map(i => [dates[i], values[i]]),
        symbol: 'triangle',
        symbolSize: 8,
        itemStyle: {
          color: COLORS.peak
        },
        z: 3
      }] : [])
    ],

    // 动画
    animation: false
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
}
</style>
