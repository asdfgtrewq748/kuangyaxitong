<template>
  <NatureChartContainer
    panel-label="F"
    :title="title"
    :footnote="footnote"
    width="full"
    height="180px"
  >
    <div ref="chartRef" class="echarts-container"></div>
    <template #legend>
      <div class="legend-bar">
        <div class="legend-gradient"></div>
        <div class="legend-labels">
          <span>-1</span>
          <span>0</span>
          <span>1</span>
        </div>
        <span class="legend-title">r</span>
      </div>
    </template>
  </NatureChartContainer>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import * as echarts from 'echarts'
import NatureChartContainer from '../shared/NatureChartContainer.vue'

const props = defineProps({
  title: { type: String, default: '支架相关性矩阵' },
  matrix: { type: Array, default: () => [] } // 2D correlation matrix
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  if (!props.matrix || props.matrix.length === 0) return ''
  return '皮尔逊相关系数'
})

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.matrix || props.matrix.length === 0) return

  const n = props.matrix.length

  // 转换为 ECharts 热力图数据格式
  const heatmapData = []
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      heatmapData.push([j, n - 1 - i, props.matrix[i][j]])
    }
  }

  // 下采样显示（如果数据量太大）
  const displayStep = n > 50 ? Math.floor(n / 50) : 1
  const displayData = heatmapData.filter((_, idx) => {
    const i = Math.floor(idx / n)
    const j = idx % n
    return i % displayStep === 0 && j % displayStep === 0
  })

  const option = {
    title: { show: false },

    grid: {
      left: 40,
      right: 15,
      top: 15,
      bottom: 35,
      containLabel: false
    },

    xAxis: {
      type: 'value',
      min: 0,
      max: n,
      show: false
    },

    yAxis: {
      type: 'value',
      min: 0,
      max: n,
      show: false
    },

    visualMap: {
      show: false,
      min: -1,
      max: 1,
      inRange: {
        color: ['#2166AC', '#F7F7F7', '#B2182B']
      }
    },

    series: [
      {
        name: 'Correlation',
        type: 'heatmap',
        data: displayData,
        itemStyle: {
          borderWidth: 0,
          borderRadius: 1
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      }
    ],

    // 提示框
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      textStyle: {
        color: '#171717',
        fontSize: 11
      },
      formatter: (params) => {
        const [x, y, value] = params.value
        const i = n - 1 - Math.round(y)
        const j = Math.round(x)
        return `<div style="font-weight:600;margin-bottom:4px;">支架 ${i} vs ${j}</div>
                <div>r = <span style="font-weight:600;">${value.toFixed(3)}</span></div>`
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

watch(() => props.matrix, updateChart, { deep: true })
</script>

<style scoped>
.echarts-container {
  width: 100%;
  height: 130px;
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

.legend-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.legend-gradient {
  width: 100px;
  height: 10px;
  background: linear-gradient(to right, #2166AC, #F7F7F7, #B2182B);
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  width: 100px;
  font-size: 7pt;
  color: #737373;
  font-weight: 500;
}

.legend-title {
  font-size: 8pt;
  color: #171717;
  font-weight: 600;
  font-style: italic;
}
</style>
