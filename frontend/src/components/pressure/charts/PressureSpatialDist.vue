<template>
  <NatureChartContainer
    panel-label="C"
    :title="title"
    x-axis-label="Support number"
    y-axis-label="End resistance (MPa)"
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
  title: { type: String, default: 'Spatial distribution by support' },
  data: { type: Array, default: () => [] } // [{ supportId, mean, count }]
})

const chartRef = ref(null)
let chartInstance = null

const COLORS = {
  primary: '#0072B2'
}

const footnote = computed(() => {
  if (!props.data || props.data.length === 0) return ''
  return `n = ${props.data.length} supports`
})

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.data || props.data.length === 0) return

  const xData = props.data.map(d => d.supportId)
  const yData = props.data.map(d => d.mean)

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
        interval: Math.floor(xData.length / 6)
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
      {
        name: 'Mean',
        type: 'bar',
        data: yData,
        barWidth: '60%',
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
