<template>
  <NatureChartContainer
    panel-label="D"
    :title="title"
    x-axis-label="末阻力"
    y-axis-label="频数"
    :footnote="footnote"
    width="full"
    height="180px"
  >
    <div ref="chartRef" class="echarts-container"></div>
  </NatureChartContainer>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import * as echarts from 'echarts'
import NatureChartContainer from '../shared/NatureChartContainer.vue'

const props = defineProps({
  title: { type: String, default: '阻力分布' },
  data: { type: Array, default: () => [] },
  bins: { type: Number, default: 30 },
  showKDE: { type: Boolean, default: false }
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  if (!props.data || props.data.length === 0) return ''
  const n = props.data.length
  return `n = ${n}`
})

// Nature 配色
const COLORS = {
  primary: '#0072B2',
  kde: '#D55E00'
}

function calculateHistogram(data, bins) {
  if (!data || data.length === 0) return { values: [], edges: [] }

  const valid = data.filter(v => Number.isFinite(v))
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

  return { values: counts, edges }
}

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.data || props.data.length === 0) return

  const { values, edges } = calculateHistogram(props.data, props.bins)

  // 柱状图的 x 轴数据（区间中点）
  const xData = []
  for (let i = 0; i < values.length; i++) {
    xData.push(((edges[i] + edges[i + 1]) / 2).toFixed(1))
  }

  const option = {
    title: { show: false },

    grid: {
      left: 40,
      right: 15,
      top: 15,
      bottom: 35
    },

    xAxis: {
      type: 'category',
      data: xData,
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
        interval: Math.floor(xData.length / 5)
      },
      splitLine: { show: false }
    },

    yAxis: {
      type: 'value',
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

    series: [
      {
        name: 'Frequency',
        type: 'bar',
        data: values,
        barWidth: '90%',
        itemStyle: {
          color: COLORS.primary,
          borderWidth: 0
        },
        emphasis: {
          itemStyle: {
            color: COLORS.primary
          }
        }
      }
    ],

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
</script>

<style scoped>
.echarts-container {
  width: 100%;
  height: 100%;
  min-height: 130px;
}
</style>
