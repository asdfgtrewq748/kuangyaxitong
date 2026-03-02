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
  peak: '#CC79A7',
  threshold: '#D55E00',
  grid: '#e5e5e5'
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

  // 计算均值用于参考线
  const meanValue = values.reduce((a, b) => a + b, 0) / values.length

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
      splitLine: { show: false }
    },

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
          width: 1.5
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 114, 178, 0.15)' },
            { offset: 1, color: 'rgba(0, 114, 178, 0.02)' }
          ])
        },
        z: 1
      },
      // 峰值标记
      {
        name: 'Peaks',
        type: 'scatter',
        data: peakData,
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
        z: 2
      }
    ],

    // 参考线
    visualMap: {
      show: false,
      pieces: [
        { gt: threshold, color: COLORS.peak }
      ]
    },

    // 提示框
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
        const data = params[0]
        if (!data) return ''
        return `<div style="font-weight:600;margin-bottom:4px;">${data.value[0]} m</div>
                <div>末阻力: <span style="color:${COLORS.primary};font-weight:600;">${data.value[1]}</span> MPa</div>`
      }
    },

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
</script>

<style scoped>
.echarts-container {
  width: 100%;
  height: 100%;
  min-height: 130px;
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
