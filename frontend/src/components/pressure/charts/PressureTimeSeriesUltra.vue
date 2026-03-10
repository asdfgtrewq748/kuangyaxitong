<template>
  <NatureChartContainerUltra
    panel-label="B"
    :title="resolvedTitle"
    subtitle="Temporal response profile"
    :story="story"
    x-axis-label="Monitoring epoch"
    y-axis-label="Pressure (MPa)"
    :caption="caption"
    :footnote="footnote"
    :note="note"
    :highlights="highlights"
    icon="TS"
    width="full"
    height="280px"
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
  calculateConfidenceBands,
  calculateTrendLine,
  summarizeTimeSeries
} from '@/utils/pressureFigureAnalytics'

const props = defineProps({
  title: { type: String, default: '' },
  data: { type: Array, default: () => [] },
  supportId: { type: Number, default: null },
  showErrorBar: { type: Boolean, default: true },
  showPeaks: { type: Boolean, default: false },
  peaks: { type: Array, default: () => [] },
  showTrend: { type: Boolean, default: true },
  showBands: { type: Boolean, default: true }
})

const chartRef = ref(null)
let chartInstance = null

const seriesData = computed(() =>
  (props.data || []).filter((item) => Number.isFinite(Number(item?.value)))
)

const summary = computed(() => summarizeTimeSeries(seriesData.value))
const trendLine = computed(() => (props.showTrend ? calculateTrendLine(seriesData.value) : []))
const bands = computed(() => (props.showBands ? calculateConfidenceBands(seriesData.value) : { upper: [], lower: [], band: 0 }))

const resolvedTitle = computed(() => {
  if (props.title) return props.title
  return props.supportId ? `Support ${props.supportId} pressure evolution` : 'Pressure evolution'
})

const story = computed(() => {
  if (!summary.value.count) return 'Temporal pressure dynamics were unavailable for the selected support.'

  const supportText = props.supportId ? `Support ${props.supportId}` : 'The selected profile'
  const peakDate = formatDateLabel(summary.value.peak?.date)
  return `${supportText} is tracked across ${summary.value.count} monitoring epochs; the curve highlights net drift, peak loading (${peakDate}), and the uncertainty envelope derived from residual scatter.`
})

const caption = computed(
  () => 'Measured support pressure with linear drift estimate, residual confidence envelope, and peak-response annotation.'
)

const footnote = computed(() => {
  if (!summary.value.count) return ''

  return `Mean ${summary.value.mean.toFixed(2)} MPa; SD ${summary.value.std.toFixed(2)} MPa; observation window ${formatDateLabel(summary.value.startDate)} to ${formatDateLabel(summary.value.endDate)}.`
})

const note = computed(() => {
  if (!summary.value.count) return ''

  const bandText = props.showBands ? `95% residual envelope ±${bands.value.band.toFixed(2)} MPa.` : ''
  const errorText = props.showErrorBar ? 'Vertical whiskers denote per-epoch variability.' : ''
  return [bandText, errorText].filter(Boolean).join(' ')
})

const highlights = computed(() =>
  buildFigureHighlights([
    { label: 'n', value: summary.value.count, tone: 'focus' },
    { label: 'Peak', value: `${summary.value.max.toFixed(2)} MPa`, tone: 'alert' },
    { label: 'Drift', value: `${formatSigned(summary.value.drift)} MPa`, tone: Math.abs(summary.value.drift) >= summary.value.std ? 'alert' : 'positive' }
  ])
)

defineExpose({
  getChartInstance: () => chartInstance
})

function formatSigned(value) {
  if (!Number.isFinite(value)) return '0.00'
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`
}

function formatDateLabel(value) {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatAxisDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
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

function buildPeakIndices() {
  if (!props.showPeaks) return []

  if (props.peaks?.length) {
    return props.peaks.filter((index) => index >= 0 && index < seriesData.value.length)
  }

  const peakIndex = seriesData.value.findIndex((item) => item.value === summary.value.max)
  return peakIndex >= 0 ? [peakIndex] : []
}

function updateChart() {
  if (!chartInstance) return

  if (!seriesData.value.length) {
    chartInstance.clear()
    return
  }

  const dates = seriesData.value.map((item) => item.date)
  const values = seriesData.value.map((item) => Number(item.value))
  const stds = seriesData.value.map((item) => Number(item.std || 0))
  const trendValues = trendLine.value.map((item) => item.value)
  const lowerValues = bands.value.lower.map((item) => item.value)
  const bandRange = bands.value.upper.map((item, index) => item.value - (bands.value.lower[index]?.value || 0))
  const peakIndices = buildPeakIndices()
  const peakPoints = peakIndices.map((index) => ({
    coord: [dates[index], values[index]],
    value: values[index].toFixed(2),
    itemStyle: { color: '#b35c37' }
  }))

  const option = mergePublicationChartOption({
    animationDuration: 700,
    grid: {
      top: 34,
      right: 24,
      bottom: 44,
      left: 56
    },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLabel: {
        interval: Math.max(Math.floor(dates.length / 6), 0),
        formatter: formatAxisDate
      }
    },
    yAxis: {
      type: 'value',
      scale: true,
      min: (range) => Math.max(0, range.min * 0.92),
      max: (range) => range.max * 1.08
    },
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        const observed = params.find((item) => item.seriesName === 'Observed')
        const drift = params.find((item) => item.seriesName === 'Trend')
        const index = observed?.dataIndex ?? 0
        const date = formatDateLabel(dates[index])
        const std = stds[index]
        const trendText = drift ? `<br/>Trend: ${Number(drift.value).toFixed(2)} MPa` : ''
        const stdText = std ? `<br/>Local SD: ${std.toFixed(2)} MPa` : ''
        return `${date}<br/>Observed: ${Number(observed?.value).toFixed(2)} MPa${trendText}${stdText}`
      }
    },
    series: [
      ...(props.showBands && lowerValues.length
        ? [
            {
              name: 'Lower CI',
              type: 'line',
              stack: 'ci',
              data: lowerValues,
              symbol: 'none',
              lineStyle: { opacity: 0 },
              areaStyle: { opacity: 0 },
              emphasis: { disabled: true },
              tooltip: { show: false }
            },
            {
              name: '95% envelope',
              type: 'line',
              stack: 'ci',
              data: bandRange,
              symbol: 'none',
              lineStyle: { opacity: 0 },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(37, 95, 133, 0.22)' },
                  { offset: 1, color: 'rgba(37, 95, 133, 0.04)' }
                ])
              },
              emphasis: { disabled: true },
              tooltip: { show: false }
            }
          ]
        : []),
      ...(props.showTrend && trendValues.length
        ? [
            {
              name: 'Trend',
              type: 'line',
              data: trendValues,
              symbol: 'none',
              lineStyle: {
                color: '#b35c37',
                width: 2,
                type: 'dashed'
              },
              z: 2
            }
          ]
        : []),
      ...(props.showErrorBar
        ? [
            {
              name: 'Uncertainty',
              type: 'custom',
              z: 3,
              silent: true,
              tooltip: { show: false },
              data: dates.map((_, index) => [index, values[index], stds[index]]),
              renderItem(params, api) {
                const xIndex = api.value(0)
                const yValue = api.value(1)
                const std = api.value(2)
                if (!std) return null

                const center = api.coord([xIndex, yValue])
                const top = api.coord([xIndex, yValue + std])
                const bottom = api.coord([xIndex, yValue - std])

                return {
                  type: 'group',
                  children: [
                    {
                      type: 'line',
                      shape: { x1: center[0], y1: top[1], x2: center[0], y2: bottom[1] },
                      style: { stroke: '#607081', lineWidth: 1 }
                    },
                    {
                      type: 'line',
                      shape: { x1: center[0] - 4, y1: top[1], x2: center[0] + 4, y2: top[1] },
                      style: { stroke: '#607081', lineWidth: 1 }
                    },
                    {
                      type: 'line',
                      shape: { x1: center[0] - 4, y1: bottom[1], x2: center[0] + 4, y2: bottom[1] },
                      style: { stroke: '#607081', lineWidth: 1 }
                    }
                  ]
                }
              }
            }
          ]
        : []),
      {
        name: 'Observed',
        type: 'line',
        data: values,
        smooth: false,
        symbol: 'circle',
        symbolSize: 7,
        z: 4,
        lineStyle: {
          color: '#255f85',
          width: 2.4
        },
        itemStyle: {
          color: '#255f85',
          borderColor: '#ffffff',
          borderWidth: 1.4
        },
        markLine: {
          symbol: 'none',
          label: {
            formatter: 'Mean',
            color: '#0f766e'
          },
          lineStyle: {
            color: '#0f766e',
            type: 'dashed'
          },
          data: [{ yAxis: summary.value.mean }]
        },
        markPoint: peakPoints.length
          ? {
              symbol: 'triangle',
              symbolSize: 14,
              label: {
                formatter: ({ value }) => value,
                color: '#7b281f',
                offset: [0, -18]
              },
              data: peakPoints
            }
          : undefined
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
watch(() => props.showErrorBar, updateChart)
watch(() => props.showPeaks, updateChart)
watch(() => props.showTrend, updateChart)
watch(() => props.showBands, updateChart)
</script>

<style scoped>
.echarts-container-ultra {
  width: 100%;
  height: 100%;
  min-height: 220px;
}
</style>
