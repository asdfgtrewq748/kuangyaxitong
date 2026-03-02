<template>
  <NatureChartContainer
    panel-label="C"
    :title="title"
    x-axis-label="支架编号"
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
  title: { type: String, default: '支架空间分布' },
  data: { type: Array, default: () => [] } // [{ supportId, mean, count }]
})

const chartRef = ref(null)
let chartInstance = null

const COLORS = {
  primary: '#0072B2',
  secondary: '#D55E00',
  grid: '#e5e5e5'
}

const footnote = computed(() => {
  if (!props.data || props.data.length === 0) return ''
  return `n = ${props.data.length} 个支架`
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

  // 计算统计值用于颜色映射
  const mean = yData.reduce((a, b) => a + b, 0) / yData.length
  const max = Math.max(...yData)
  const min = Math.min(...yData)

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
        name: 'Mean',
        type: 'bar',
        data: yData.map((val, idx) => ({
          value: val,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: COLORS.primary },
              { offset: 1, color: '#4da6e8' }
            ]),
            borderRadius: [2, 2, 0, 0]
          }
        })),
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: COLORS.secondary },
              { offset: 1, color: '#f5a623' }
            ]),
            shadowBlur: 8,
            shadowColor: 'rgba(0, 0, 0, 0.15)'
          }
        },
        // 均值线
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: '#737373',
            width: 1,
            type: 'dashed'
          },
          label: {
            fontSize: 7,
            color: '#737373',
            formatter: `均值: {c}`
          },
          data: [
            { yAxis: mean.toFixed(1) }
          ],
          animationDelay: 800
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
        const originalData = props.data[data.dataIndex]
        return `<div style="font-weight:600;margin-bottom:4px;">支架 #${data.axisValue}</div>
                <div>平均阻力: <span style="color:${COLORS.primary};font-weight:600;">${data.value}</span> MPa</div>
                <div>数据点数: ${originalData?.count || '-'}</div>`
      }
    },

    animation: true,
    animationDuration: 600,
    animationEasing: 'cubicOut',
    animationDelay: (idx) => idx * 15
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
