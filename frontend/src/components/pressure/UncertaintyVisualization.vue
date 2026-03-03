<template>
  <div class="uncertainty-viz">
    <div ref="chartRef" class="uncertainty-chart"></div>
    <div class="legend">
      <div class="legend-item">
        <span class="legend-color" style="background: #333;"></span>
        <span>均值</span>
      </div>
      <div class="legend-item">
        <span class="legend-line"></span>
        <span>95% 置信区间</span>
      </div>
      <div class="legend-item">
        <span class="legend-error"></span>
        <span>标准差</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  // 数据: { x: number, mean: number, std: number, ci95: [min, max], n: number }[]
  data: {
    type: Array,
    required: true
  },
  xLabel: {
    type: String,
    default: '推进距离 (m)'
  },
  yLabel: {
    type: String,
    default: '支架压力 (MPa)'
  },
  showConfidenceInterval: {
    type: Boolean,
    default: true
  },
  showErrorBars: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#5470c6'
  },
  lineStyle: {
    type: String,
    default: 'solid' // solid, dashed, dotted
  }
})

const chartRef = ref(null)
let chart = null

function initChart() {
  if (!chartRef.value) return
  
  // 检查容器尺寸，避免 ECharts 报错
  const { clientWidth, clientHeight } = chartRef.value
  if (clientWidth === 0 || clientHeight === 0) {
    setTimeout(initChart, 100)
    return
  }
  
  chart = echarts.init(chartRef.value)
  updateChart()
  
  const resizeObserver = new ResizeObserver(() => {
    chart?.resize()
  })
  resizeObserver.observe(chartRef.value)
}

function updateChart() {
  if (!chart || !props.data.length) return
  
  const xData = props.data.map(d => d.x)
  const meanData = props.data.map(d => d.mean)
  
  const series = []
  
  // 主数据线（均值）
  series.push({
    name: '均值',
    type: 'line',
    data: meanData,
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      color: props.color,
      width: 2,
      type: props.lineStyle
    },
    itemStyle: {
      color: props.color
    }
  })
  
  // 95% 置信区间（填充区域）
  if (props.showConfidenceInterval) {
    const upperCI = props.data.map(d => d.ci95?.[1] ?? d.mean + 1.96 * (d.std || 0) / Math.sqrt(d.n || 1))
    const lowerCI = props.data.map(d => d.ci95?.[0] ?? d.mean - 1.96 * (d.std || 0) / Math.sqrt(d.n || 1))
    
    series.push({
      name: '95% CI',
      type: 'line',
      data: upperCI,
      smooth: true,
      lineStyle: { opacity: 0 },
      symbol: 'none',
      areaStyle: {
        color: props.color,
        opacity: 0.1,
        origin: 'start'
      }
    }, {
      name: '95% CI Lower',
      type: 'line',
      data: lowerCI,
      smooth: true,
      lineStyle: { opacity: 0 },
      symbol: 'none',
      areaStyle: {
        color: '#fff',
        opacity: 1,
        origin: 'start'
      }
    })
  }
  
  // 误差条（标准差）
  if (props.showErrorBars) {
    const errorData = props.data.map(d => {
      const std = d.std || 0
      return [d.mean - std, d.mean + std]
    })
    
    series.push({
      name: '标准差',
      type: 'custom',
      renderItem: (params, api) => {
        const x = api.coord([api.value(0), 0])[0]
        const low = api.coord([api.value(0), api.value(1)])[1]
        const high = api.coord([api.value(0), api.value(2)])[1]
        
        return {
          type: 'group',
          children: [
            {
              type: 'line',
              shape: { x1: x - 5, y1: low, x2: x + 5, y2: low },
              style: { stroke: props.color, lineWidth: 1 }
            },
            {
              type: 'line',
              shape: { x1: x - 5, y1: high, x2: x + 5, y2: high },
              style: { stroke: props.color, lineWidth: 1 }
            },
            {
              type: 'line',
              shape: { x1: x, y1: low, x2: x, y2: high },
              style: { stroke: props.color, lineWidth: 1 }
            }
          ]
        }
      },
      data: props.data.map((d, i) => [i, errorData[i][0], errorData[i][1]]),
      z: 10
    })
  }
  
  const option = {
    title: {
      text: '带不确定性估计的压力趋势',
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 'normal' }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const dataIndex = params[0].dataIndex
        const d = props.data[dataIndex]
        if (!d) return ''
        
        let html = `<strong>${props.xLabel}: ${d.x}</strong><br/>`
        html += `均值: ${d.mean.toFixed(3)} MPa<br/>`
        if (d.std) html += `标准差: ${d.std.toFixed(3)}<br/>`
        if (d.n) html += `样本数: ${d.n}<br/>`
        if (d.ci95) html += `95% CI: [${d.ci95[0].toFixed(3)}, ${d.ci95[1].toFixed(3)}]`
        
        return html
      }
    },
    legend: {
      data: ['均值'],
      bottom: 0
    },
    grid: {
      left: 60,
      right: 30,
      top: 50,
      bottom: 50
    },
    xAxis: {
      type: 'category',
      data: xData,
      name: props.xLabel,
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      name: props.yLabel,
      nameLocation: 'middle',
      nameGap: 40
    },
    series
  }
  
  chart.setOption(option)
}

onMounted(initChart)
onUnmounted(() => chart?.dispose())
watch(() => props.data, updateChart, { deep: true })
watch(() => [props.showConfidenceInterval, props.showErrorBars], updateChart)
</script>

<style scoped>
.uncertainty-viz {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.uncertainty-chart {
  flex: 1;
  min-height: 300px;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 20px;
  height: 3px;
  border-radius: 1px;
}

.legend-line {
  width: 20px;
  height: 8px;
  background: rgba(84, 112, 198, 0.2);
  border: 1px solid rgba(84, 112, 198, 0.5);
}

.legend-error {
  width: 3px;
  height: 15px;
  background: #333;
  position: relative;
}

.legend-error::before,
.legend-error::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 1px;
  background: #333;
  left: -2.5px;
}

.legend-error::before { top: 0; }
.legend-error::after { bottom: 0; }
</style>
