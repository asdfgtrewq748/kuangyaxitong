<template>
  <NatureChartContainer
    panel-label="E"
    :title="title"
    x-axis-label="推进距离"
    y-axis-label="末阻力"
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
  title: { type: String, default: '周期来压检测' },
  data: { type: Array, default: () => [] }, // [{ date, value }]
  periods: { type: Object, default: null } // { meanPeriod, stdPeriod, numCycles }
})

const chartRef = ref(null)
let chartInstance = null

// Nature 配色
const COLORS = {
  primary: '#0072B2',
  peak: '#CC79A7'
}

const footnote = computed(() => {
  if (!props.periods || props.periods.numCycles === 0) return ''
  const { meanPeriod, stdPeriod, numCycles } = props.periods
  return `周期: ${meanPeriod.toFixed(1)} ± ${stdPeriod.toFixed(1)} m (n=${numCycles})`
})

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.data || props.data.length === 0) return

  // X轴数据：推进距离
  const xData = props.data.map((d, i) => i * 10) // 10m/天
  const values = props.data.map(d => d.value)

  // 找出峰值索引
  const peakIndices = []
  const threshold = (Math.max(...values) + Math.min(...values)) / 2

  for (let i = 1; i < values.length - 1; i++) {
    if (values[i] > threshold &&
        values[i] > values[i - 1] &&
        values[i] > values[i + 1]) {
      // 检查与上一个峰的距离
      if (peakIndices.length === 0 || i - peakIndices[peakIndices.length - 1] >= 5) {
        peakIndices.push(i)
      }
    }
  }

  // 峰值数据
  const peakData = peakIndices.map(i => [xData[i], values[i]])

  const option = {
    title: { show: false },

    grid: {
      left: 40,
      right: 15,
      top: 15,
      bottom: 35
    },

    xAxis: {
      type: 'value',
      min: 0,
      max: Math.ceil(xData[xData.length - 1] / 500) * 500,
      axisLine: {
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
      splitLine: { show: false }
    },

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

    series: [
      // 主折线
      {
        name: 'Resistance',
        type: 'line',
        data: xData.map((x, i) => [x, values[i]]),
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: COLORS.primary,
          width: 1
        },
        z: 1
      },
      // 峰值标记
      {
        name: 'Peaks',
        type: 'scatter',
        data: peakData,
        symbol: 'triangle',
        symbolSize: 8,
        itemStyle: {
          color: COLORS.peak
        },
        z: 2
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
