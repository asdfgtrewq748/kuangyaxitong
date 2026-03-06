<template>
  <NatureChartContainerUltra
    :panel-label="panelLabel"
    :title="title"
    :subtitle="subtitle"
    x-axis-label="Time Window"
    y-axis-label="Resistance (MPa)"
    :footnote="footnote"
    width="full"
    height="280px"
  >
    <div ref="chartRef" class="echarts-container-ultra"></div>
  </NatureChartContainerUltra>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import { echarts } from '@/lib/echarts-pressure'
import NatureChartContainerUltra from '../shared/NatureChartContainerUltra.vue'
import { NATURE_COLORS } from '@/utils/natureFigureConfig'

const props = defineProps({
  title: { type: String, default: 'Pressure Box Plot' },
  subtitle: { type: String, default: 'Box Plot Analysis' },
  panelLabel: { type: String, default: 'C' },
  data: { type: Array, default: () => [] },
  timeRange: { type: String, default: 'day' } // 'day', 'week', 'month'
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  if (!props.data.length) return ''
  const groups = groupDataByTime()
  return `n = ${groups.length} grouped windows with quartile and outlier summaries`
})

// Nature 閰嶈壊
const COLORS = {
  box: NATURE_COLORS.primary,
  median: NATURE_COLORS.secondary,
  whisker: NATURE_COLORS.gray,
  outlier: NATURE_COLORS.quaternary,
  fill: 'rgba(0, 114, 178, 0.1)'
}

function groupDataByTime() {
  const grouped = new Map()
  
  props.data.forEach(item => {
    const date = new Date(item.cycleStartTime || item.date)
    let key
    
    if (props.timeRange === 'day') {
      key = `${date.getMonth() + 1}/${date.getDate()}`
    } else if (props.timeRange === 'week') {
      const week = Math.floor(date.getDate() / 7) + 1
      key = `W${week}`
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }
    
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key).push(item.finalResistanceValue || item.value)
  })
  
  // 鎸夋椂闂存帓搴?
  return Array.from(grouped.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-20) // 鏈€澶氭樉绀?0涓椂闂存
}

function calculateBoxStats(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  
  const min = sorted[0]
  const max = sorted[n - 1]
  const q1 = sorted[Math.floor(n * 0.25)]
  const median = sorted[Math.floor(n * 0.5)]
  const q3 = sorted[Math.floor(n * 0.75)]
  
  // IQR method for outliers
  const iqr = q3 - q1
  const lowerFence = q1 - 1.5 * iqr
  const upperFence = q3 + 1.5 * iqr
  
  const outliers = sorted.filter(v => v < lowerFence || v > upperFence)
  const whiskerMin = Math.max(min, lowerFence)
  const whiskerMax = Math.min(max, upperFence)
  
  return [whiskerMin, q1, median, q3, whiskerMax, outliers]
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
    renderer: 'canvas',
    devicePixelRatio: window.devicePixelRatio || 2
  })
  
  updateChart()
}

function updateChart() {
  if (!chartInstance || !props.data.length) return
  
  const groups = groupDataByTime()
  const categories = groups.map(([key]) => key)
  const boxData = groups.map(([, values]) => calculateBoxStats(values))
  
  const option = {
    backgroundColor: 'transparent',
    
    grid: {
      left: 55,
      right: 25,
      top: 20,
      bottom: 50
    },
    
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: {
        lineStyle: { color: '#000000', width: 0.75 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#000000', width: 0.5 }
      },
      axisLabel: {
        fontSize: 8,
        color: '#000000',
        fontFamily: 'Arial, Helvetica, sans-serif',
        interval: Math.floor(categories.length / 6)
      },
      splitLine: { show: false }
    },
    
    yAxis: {
      type: 'value',
      min: 0,
      axisLine: {
        lineStyle: { color: '#000000', width: 0.75 }
      },
      axisTick: {
        inside: true,
        lineStyle: { color: '#000000', width: 0.5 }
      },
      axisLabel: {
        fontSize: 8,
        color: '#000000',
        fontFamily: 'Arial, Helvetica, sans-serif'
      },
      splitLine: {
        lineStyle: { 
          color: '#E8E8E8', 
          width: 0.5,
          type: [4, 4]
        }
      }
    },
    
    series: [
      {
        name: 'boxplot',
        type: 'boxplot',
        data: boxData.map(d => ({
          value: [d[0], d[1], d[2], d[3], d[4]],
          itemStyle: {
            color: COLORS.fill,
            borderColor: COLORS.box,
            borderWidth: 1.5
          }
        })),
        boxWidth: [10, 20],
        itemStyle: {
          color: COLORS.fill,
          borderColor: COLORS.box,
          borderWidth: 1.5
        },
        emphasis: {
          itemStyle: {
            borderWidth: 2,
            shadowBlur: 4,
            shadowColor: 'rgba(0,0,0,0.2)'
          }
        }
      },
      {
        name: 'outlier',
        type: 'scatter',
        data: boxData.flatMap((d, i) => 
          d[5].map(val => [i, val])
        ),
        symbolSize: 6,
        itemStyle: {
          color: COLORS.outlier,
          borderColor: '#ffffff',
          borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            borderWidth: 2,
            shadowBlur: 4,
            shadowColor: 'rgba(204, 121, 167, 0.4)'
          }
        }
      }
    ],
    
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        fontSize: 11,
        color: '#171717'
      },
      extraCssText: 'box-shadow: 0 8px 24px rgba(0,0,0,0.12); border-radius: 8px;',
      formatter: function (param) {
        if (param.seriesName === 'boxplot') {
          const [min, q1, median, q3, max] = param.data.value
          return `
            <div style="font-weight: 600; margin-bottom: 8px;">${param.name}</div>
            <div style="display: grid; grid-template-columns: auto auto; gap: 4px 12px; font-size: 11px;">
              <span>鏈€澶у€?</span><span style="font-weight: 600;">${max.toFixed(2)} MPa</span>
              <span>Q3:</span><span style="font-weight: 600;">${q3.toFixed(2)} MPa</span>
              <span>涓綅鏁?</span><span style="font-weight: 600; color: ${COLORS.median};">${median.toFixed(2)} MPa</span>
              <span>Q1:</span><span style="font-weight: 600;">${q1.toFixed(2)} MPa</span>
              <span>鏈€灏忓€?</span><span style="font-weight: 600;">${min.toFixed(2)} MPa</span>
            </div>
          `
        } else {
          return `
            <div style="font-weight: 600; margin-bottom: 4px;">寮傚父鍊?/div>
            <div style="font-size: 11px;">
              鏁板€? <span style="font-weight: 600; color: ${COLORS.outlier};">${param.data[1].toFixed(2)} MPa</span>
            </div>
          `
        }
      }
    },
    
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut'
  }
  
  chartInstance.setOption(option, { notMerge: true })
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
watch(() => props.timeRange, updateChart)

defineExpose({
  getChartInstance: () => chartInstance
})
</script>

<style scoped>
.echarts-container-ultra {
  width: 100%;
  height: 100%;
  min-height: 200px;
}
</style>

