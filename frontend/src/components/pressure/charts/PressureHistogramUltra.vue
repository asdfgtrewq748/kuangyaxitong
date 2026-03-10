<template>
  <NatureChartContainerUltra
    panel-label="C"
    :title="resolvedTitle"
    subtitle="Distribution structure"
    :story="story"
    x-axis-label="Pressure bins (MPa)"
    y-axis-label="Frequency"
    :caption="caption"
    :footnote="footnote"
    :note="note"
    :highlights="highlights"
    icon="PDF"
    width="full"
    height="250px"
  >
    <div ref="chartRef" class="echarts-container-ultra"></div>
  </NatureChartContainerUltra>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import NatureChartContainerUltra from '../shared/NatureChartContainerUltra.vue'
import { echarts } from '@/lib/echarts-pressure'
import { buildFigureHighlights, mergePublicationChartOption } from '@/utils/publicationFigureTheme'
import {
  calculateHistogram,
  calculateKDE,
  summarizeDistribution
} from '@/utils/pressureFigureAnalytics'

const props = defineProps({
  title: { type: String, default: '' },
  data: { type: Array, default: () => [] },
  bins: { type: Number, default: 24 }
})

const chartRef = ref(null)
let chartInstance = null

const values = computed(() => (props.data || []).filter((value) => Number.isFinite(Number(value))).map(Number))
const summary = computed(() => summarizeDistribution(values.value))
const histogram = computed(() => calculateHistogram(values.value, props.bins))
const kde = computed(() => calculateKDE(values.value))

const resolvedTitle = computed(() => props.title || 'Pressure distribution')

const story = computed(() => {
  if (!summary.value.count) return 'Distribution data are unavailable for the active selection.'

  return `The histogram resolves the central pressure band, tail spread, and density ridge simultaneously, allowing rapid comparison between the modal load interval and upper-tail risk.`
})

const caption = computed(
  () => 'Histogram of observed pressure values with scaled kernel-density envelope and percentile markers.'
)

const footnote = computed(() => {
  if (!summary.value.count) return ''

  return `Mean ${summary.value.mean.toFixed(2)} MPa; SD ${summary.value.std.toFixed(2)} MPa; range ${summary.value.min.toFixed(2)}-${summary.value.max.toFixed(2)} MPa.`
})

const note = computed(() => {
  if (!summary.value.count) return ''
  return 'Dashed guides indicate the median and 90th percentile; the line curve is a frequency-scaled kernel density estimate.'
})

const highlights = computed(() =>
  buildFigureHighlights([
    { label: 'n', value: summary.value.count, tone: 'focus' },
    { label: 'P50', value: `${summary.value.p50.toFixed(2)} MPa`, tone: 'positive' },
    { label: 'P90', value: `${summary.value.p90.toFixed(2)} MPa`, tone: 'alert' }
  ])
)

defineExpose({
  getChartInstance: () => chartInstance
})

function nearestBinIndex(target) {
  const centers = histogram.value.centers || []
  if (!centers.length || !Number.isFinite(target)) return 0

  return centers.reduce((bestIndex, center, index) => {
    const bestDistance = Math.abs(centers[bestIndex] - target)
    const currentDistance = Math.abs(center - target)
    return currentDistance < bestDistance ? index : bestIndex
  }, 0)
}

function formatRangeLabel(index) {
  const low = histogram.value.edges?.[index]
  const high = histogram.value.edges?.[index + 1]
  if (!Number.isFinite(low) || !Number.isFinite(high)) return '--'
  return `${low.toFixed(2)}-${high.toFixed(2)}`
}

function initChart() {
  if (!chartRef.value) return

  const { clientWidth, clientHeight } = chartRef.value
  if (!clientWidth || !clientHeight) {
    window.setTimeout(initChart, 100)
    return
  }

  chartInstance = echarts.init(chartRef.value, null, {
    renderer: 'canvas',
    devicePixelRatio: Math.max(window.devicePixelRatio || 1, 2)
  })

  updateChart()
}

function updateChart() {
  if (!chartInstance) return

  if (!values.value.length) {
    chartInstance.clear()
    return
  }

  const counts = histogram.value.values
  const centers = histogram.value.centers
  const labels = centers.map((center) => center.toFixed(2))
  const maxCount = Math.max(...counts)
  const modalIndex = counts.indexOf(maxCount)
  const kdeScale = kde.value.length ? maxCount / Math.max(...kde.value.map((item) => item.y)) : 1
  const scaledKde = kde.value.map((item) => ({
    x: item.x,
    y: item.y * kdeScale
  }))
  const medianIndex = nearestBinIndex(summary.value.p50)
  const p90Index = nearestBinIndex(summary.value.p90)

  const option = mergePublicationChartOption({
    animationDuration: 650,
    grid: {
      top: 34,
      right: 24,
      bottom: 46,
      left: 54
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: {
        interval: Math.max(Math.floor(labels.length / 6), 0),
        formatter(value) {
          return Number(value).toFixed(1)
        }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: (range) => range.max * 1.12
    },
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        const bar = params.find((item) => item.seriesName === 'Frequency')
        if (!bar) return ''
        const index = bar.dataIndex
        return `${formatRangeLabel(index)} MPa<br/>Frequency: ${bar.value}`
      }
    },
    series: [
      {
        name: 'Density',
        type: 'line',
        data: scaledKde.map((item) => item.y),
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#b35c37',
          width: 2,
          type: 'dashed'
        },
        z: 3
      },
      {
        name: 'Frequency',
        type: 'bar',
        data: counts.map((count, index) => ({
          value: count,
          itemStyle: {
            color:
              index === modalIndex
                ? '#b35c37'
                : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#4f89ab' },
                    { offset: 1, color: '#255f85' }
                  ])
          }
        })),
        markPoint: {
          symbol: 'pin',
          symbolSize: 36,
          data: [
            {
              coord: [labels[modalIndex], counts[modalIndex]],
              value: 'Mode',
              itemStyle: { color: '#8a3b4b' }
            }
          ],
          label: {
            color: '#fffdfa',
            fontWeight: 700
          }
        },
        markLine: {
          symbol: 'none',
          label: {
            formatter(params) {
              return params.name
            }
          },
          data: [
            {
              name: `P50 ${summary.value.p50.toFixed(2)}`,
              xAxis: labels[medianIndex],
              lineStyle: { color: '#0f766e', type: 'dashed' },
              label: { color: '#0f766e' }
            },
            {
              name: `P90 ${summary.value.p90.toFixed(2)}`,
              xAxis: labels[p90Index],
              lineStyle: { color: '#b35c37', type: 'dashed' },
              label: { color: '#b35c37' }
            }
          ]
        },
        z: 2
      }
    ]
  })

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
watch(() => props.bins, updateChart)
</script>

<style scoped>
.echarts-container-ultra {
  width: 100%;
  height: 100%;
  min-height: 200px;
}
</style>
