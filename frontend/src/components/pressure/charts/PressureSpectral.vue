<template>
  <NatureChartContainerUltra
    :panel-label="panelLabel"
    :title="title"
    :subtitle="subtitle"
    x-axis-label="Period (days)"
    y-axis-label="Power Spectral Density"
    :footnote="footnote"
    width="full"
    height="260px"
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
  title: { type: String, default: '棰戣氨鍒嗘瀽' },
  subtitle: { type: String, default: 'Spectral Analysis (FFT)' },
  panelLabel: { type: String, default: 'E' },
  data: { type: Array, default: () => [] }
})

const chartRef = ref(null)
let chartInstance = null

const footnote = computed(() => {
  if (!props.data.length) return ''
  const dominantPeriod = calculateDominantPeriod()
  return dominantPeriod
    ? `Dominant period: ${dominantPeriod.toFixed(1)} days`
    : 'Frequency-domain periodicity analysis'
})

const COLORS = {
  spectrum: NATURE_COLORS.tertiary,
  peak: NATURE_COLORS.secondary,
  baseline: '#E8E8E8',
  fill: 'rgba(0, 158, 115, 0.15)'
}

// Simple FFT implementation for spectral analysis
function calculateFFT(values) {
  const n = values.length
  if (n < 4) return []
  
  // Remove mean
  const mean = values.reduce((a, b) => a + b, 0) / n
  const centered = values.map(v => v - mean)
  
  // Periodogram (simplified)
  const spectrum = []
  const maxPeriod = Math.min(n / 2, 365)
  
  for (let period = 2; period <= maxPeriod; period++) {
    const frequency = 1 / period
    let real = 0, imag = 0
    
    for (let t = 0; t < n; t++) {
      const angle = 2 * Math.PI * frequency * t
      real += centered[t] * Math.cos(angle)
      imag -= centered[t] * Math.sin(angle)
    }
    
    const power = (real * real + imag * imag) / n
    spectrum.push({ period, frequency, power })
  }
  
  return spectrum
}

function calculateDominantPeriod() {
  const values = props.data.map(d => d.value || d.finalResistanceValue).filter(Number.isFinite)
  if (values.length < 4) return null
  
  const spectrum = calculateFFT(values)
  if (!spectrum.length) return null
  
  const maxPower = Math.max(...spectrum.map(s => s.power))
  const dominant = spectrum.find(s => s.power === maxPower)
  
  return dominant ? dominant.period : null
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
  
  const values = props.data.map(d => d.value || d.finalResistanceValue).filter(Number.isFinite)
  if (values.length < 4) return
  
  const spectrum = calculateFFT(values)
  if (!spectrum.length) return
  
  // Normalize power
  const maxPower = Math.max(...spectrum.map(s => s.power))
  const normalizedSpectrum = spectrum.map(s => ({
    ...s,
    normalizedPower: s.power / maxPower
  }))
  
  // Find peaks
  const peaks = []
  for (let i = 1; i < normalizedSpectrum.length - 1; i++) {
    if (normalizedSpectrum[i].normalizedPower > normalizedSpectrum[i-1].normalizedPower &&
        normalizedSpectrum[i].normalizedPower > normalizedSpectrum[i+1].normalizedPower &&
        normalizedSpectrum[i].normalizedPower > 0.3) {
      peaks.push(normalizedSpectrum[i])
    }
  }
  
  // Take top 3 peaks
  const topPeaks = peaks
    .sort((a, b) => b.normalizedPower - a.normalizedPower)
    .slice(0, 3)
  
  const option = {
    backgroundColor: 'transparent',
    
    grid: {
      left: 55,
      right: 25,
      top: 30,
      bottom: 45
    },
    
    xAxis: {
      type: 'value',
      min: 2,
      max: Math.min(values.length / 2, 60),
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
      splitLine: { show: false },
      name: '鍛ㄦ湡 (澶?',
      nameLocation: 'middle',
      nameGap: 25,
      nameTextStyle: {
        fontSize: 9,
        color: '#000000'
      }
    },
    
    yAxis: {
      type: 'value',
      min: 0,
      max: 1.05,
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
        formatter: (val) => val.toFixed(1)
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
        name: 'Spectrum',
        type: 'line',
        data: normalizedSpectrum.map(s => [s.period, s.normalizedPower]),
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: COLORS.spectrum,
          width: 1.5
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: COLORS.fill },
            { offset: 1, color: 'rgba(0, 158, 115, 0.02)' }
          ])
        },
        markPoint: {
          symbol: 'triangle',
          symbolSize: 10,
          symbolRotate: 0,
          itemStyle: {
            color: COLORS.peak,
            borderColor: '#ffffff',
            borderWidth: 1.5
          },
          label: {
            show: true,
            fontSize: 8,
            formatter: (p) => `${p.data.period.toFixed(0)}d`,
            position: 'top',
            distance: 5,
            color: COLORS.peak
          },
          data: topPeaks.map(p => ({
            coord: [p.period, p.normalizedPower],
            period: p.period,
            value: p.normalizedPower
          }))
        },
        markLine: {
          symbol: ['none', 'none'],
          lineStyle: {
            color: COLORS.baseline,
            width: 0.5,
            type: [2, 2]
          },
          data: [
            { yAxis: 0.5, label: { formatter: '50%', fontSize: 8 } }
          ]
        }
      }
    ],
    
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderColor: '#e5e5e5',
      borderWidth: 1,
      padding: [12, 16],
      textStyle: {
        fontSize: 11,
        color: '#171717'
      },
      extraCssText: 'box-shadow: 0 8px 24px rgba(0,0,0,0.12); border-radius: 8px;',
      formatter: function (params) {
        const period = params[0].data[0]
        const power = params[0].data[1]
        return `
          <div style="font-weight: 600; margin-bottom: 4px;">鍛ㄦ湡鍒嗘瀽</div>
          <div style="font-size: 11px;">
            鍛ㄦ湡: <span style="font-weight: 600;">${period.toFixed(1)} 澶?/span><br>
            鐩稿鍔熺巼: <span style="font-weight: 600; color: ${COLORS.spectrum};">${(power * 100).toFixed(1)}%</span>
          </div>
        `
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

