<template>
  <NatureChartContainerUltra
    panel-label="G"
    :title="title"
    subtitle="Front vs Rear Column"
    x-axis-label="Time"
    y-axis-label="Resistance (MPa)"
    :footnote="footnote"
    width="full"
    height="220px"
  >
    <div ref="chartRef" class="echarts-container-ultra"></div>
  </NatureChartContainerUltra>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import * as echarts from 'echarts'
import NatureChartContainerUltra from '../shared/NatureChartContainerUltra.vue'
import { NATURE_ECHARTS_THEME, NATURE_COLORS } from '@/utils/natureFigureConfig'
import { exportECharts } from '@/utils/figureExport'

const props = defineProps({
  title: { type: String, default: '前后柱对比' },
  frontData: { type: Array, default: () => [] },
  rearData: { type: Array, default: () => [] }
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  const frontMean = props.frontData.reduce((a,b) => a + b.finalResistanceValue, 0) / props.frontData.length || 0
  const rearMean = props.rearData.reduce((a,b) => a + b.finalResistanceValue, 0) / props.rearData.length || 0
  const diff = ((rearMean - frontMean) / frontMean * 100) || 0
  return `Front: ${frontMean.toFixed(1)} | Rear: ${rearMean.toFixed(1)} | Diff: ${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`
})

const COLORS = {
  front: NATURE_COLORS.primary,
  rear: NATURE_COLORS.secondary,
  grid: '#E8E8E8'
}

function initChart() {
  if (!chartRef.value) return
  echarts.registerTheme('nature', NATURE_ECHARTS_THEME)
  chartInstance = echarts.init(chartRef.value, 'nature', {
    renderer: 'canvas',
    devicePixelRatio: window.devicePixelRatio || 2
  })
  updateChart()
}

function updateChart() {
  if (!chartInstance) return

  // 按日期聚合
  const aggregateByDate = (data) => {
    const map = new Map()
    data.forEach(d => {
      const key = d.finalResistanceTime.toISOString().split('T')[0]
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(d.finalResistanceValue)
    })
    return Array.from(map.entries()).map(([date, values]) => ({
      date,
      mean: values.reduce((a,b) => a+b, 0) / values.length
    })).sort((a,b) => new Date(a.date) - new Date(b.date))
  }

  const frontAgg = aggregateByDate(props.frontData)
  const rearAgg = aggregateByDate(props.rearData)
  
  // 合并日期
  const allDates = [...new Set([...frontAgg.map(d => d.date), ...rearAgg.map(d => d.date)])].sort()
  
  const frontSeries = allDates.map(d => {
    const item = frontAgg.find(x => x.date === d)
    return item ? item.mean : null
  })
  
  const rearSeries = allDates.map(d => {
    const item = rearAgg.find(x => x.date === d)
    return item ? item.mean : null
  })

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: 50,
      right: 25,
      top: 20,
      bottom: 40
    },

    legend: {
      data: ['Front', 'Rear'],
      top: 0,
      right: 0,
      itemGap: 15,
      textStyle: {
        fontSize: 10,
        color: '#525252'
      },
      itemWidth: 12,
      itemHeight: 8
    },

    xAxis: {
      type: 'category',
      data: allDates,
      axisLine: {
        lineStyle: { color: '#171717', width: 0.8 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#171717', width: 0.8 }
      },
      axisLabel: {
        fontSize: 9,
        color: '#525252',
        formatter: (v) => {
          const d = new Date(v)
          return `${d.getMonth()+1}/${d.getDate()}`
        },
        interval: Math.floor(allDates.length / 5)
      },
      splitLine: { show: false }
    },

    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: { color: '#171717', width: 0.8 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#171717', width: 0.8 }
      },
      axisLabel: {
        fontSize: 9,
        color: '#525252'
      },
      splitLine: {
        lineStyle: { color: COLORS.grid, width: 0.5, type: [4, 4] }
      }
    },

    series: [
      {
        name: 'Front',
        type: 'line',
        data: frontSeries,
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color: COLORS.front, width: 1.5 },
        itemStyle: { color: COLORS.front },
        connectNulls: true
      },
      {
        name: 'Rear',
        type: 'line',
        data: rearSeries,
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color: COLORS.rear, width: 1.5 },
        itemStyle: { color: COLORS.rear },
        connectNulls: true
      }
    ],

    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: { color: '#171717', fontSize: 12 },
      formatter: (params) => {
        const front = params.find(p => p.seriesName === 'Front')
        const rear = params.find(p => p.seriesName === 'Rear')
        return `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>
                ${front ? `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${COLORS.front};"></span>
                  <span style="color: #525252;">前柱:</span>
                  <span style="font-weight: 600;">${front.value?.toFixed(2) || '--'}</span>
                </div>` : ''}
                ${rear ? `<div style="display: flex; align-items: center; gap: 8px;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${COLORS.rear};"></span>
                  <span style="color: #525252;">后柱:</span>
                  <span style="font-weight: 600;">${rear.value?.toFixed(2) || '--'}</span>
                </div>` : ''}`
      }
    },

    animation: true,
    animationDuration: 600
  }

  chartInstance.setOption(option, { notMerge: true })
}

function handleResize() {
  chartInstance?.resize()
}

// Nature标准导出
function exportFigure(format = 'svg') {
  if (!chartInstance) return
  const dataUrl = exportECharts(chartInstance, { type: format })
  const link = document.createElement('a')
  link.download = `Fig_G_columncompare_${new Date().toISOString().split('T')[0]}.${format}`
  link.href = dataUrl
  link.click()
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
.echarts-container-ultra {
  width: 100%;
  height: 100%;
  min-height: 160px;
}
</style>
