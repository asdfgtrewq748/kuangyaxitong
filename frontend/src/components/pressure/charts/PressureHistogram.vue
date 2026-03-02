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
  kde: '#D55E00',
  grid: '#e5e5e5'
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

  // 计算统计信息
  const maxCount = Math.max(...values)
  const maxIdx = values.indexOf(maxCount)

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
        lineStyle: { color: '#171717', width: 0.5 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#171717', width: 0.5 }
      },
      axisLabel: {
        fontSize: 7,
        color: '#171717',
        interval: Math.floor(xData.length / 5)
      },
      splitLine: { show: false }
    },

    yAxis: {
      type: 'value',
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
            borderRadius: idx === values.length - 1 ? [2, 2, 0, 0] : 0
          }
        })),
        barWidth: '90%',
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: COLORS.kde },
              { offset: 1, color: '#f5a623' }
            ]),
            shadowBlur: 8,
            shadowColor: 'rgba(0, 0, 0, 0.15)'
          }
        },
        // 高亮峰值柱
        markPoint: {
          symbol: 'pin',
          symbolSize: 30,
          data: [
            {
              coord: [maxIdx, maxCount],
              value: maxCount,
              itemStyle: { color: COLORS.kde }
            }
          ],
          label: {
            fontSize: 8,
            color: '#fff'
          },
          animationDelay: 500
        }
      }
    ],

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
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0, 114, 178, 0.08)'
        }
      },
      formatter: (params) => {
        const data = params[0]
        if (!data) return ''
        return `<div style="font-weight:600;margin-bottom:4px;">${data.axisValue} MPa</div>
                <div>频数: <span style="color:${COLORS.primary};font-weight:600;">${data.value}</span></div>`
      }
    },

    animation: true,
    animationDuration: 600,
    animationEasing: 'cubicOut',
    animationDelay: (idx) => idx * 10
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
