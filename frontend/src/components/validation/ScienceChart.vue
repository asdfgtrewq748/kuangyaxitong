<template>
  <div ref="container" class="science-chart" :style="{ height: normalizedHeight }"></div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { echarts } from '../../lib/echarts-science'
import { mergePublicationChartOption } from '@/utils/publicationFigureTheme'

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  height: {
    type: [String, Number],
    default: 320
  },
  renderer: {
    type: String,
    default: 'svg'
  }
})
const emit = defineEmits(['chart-click'])

const container = ref(null)
let chart = null
let resizeObserver = null

const normalizedHeight = computed(() => {
  if (typeof props.height === 'number') return `${props.height}px`
  return props.height
})

const render = () => {
  if (!chart) return
  chart.setOption(mergePublicationChartOption(props.option || {}), {
    notMerge: true,
    lazyUpdate: true,
    silent: true
  })
}

const createChart = () => {
  if (!container.value) return
  chart = echarts.init(container.value, null, {
    renderer: props.renderer === 'canvas' ? 'canvas' : 'svg',
    useDirtyRect: true,
    devicePixelRatio: Math.max(window.devicePixelRatio || 1, props.renderer === 'canvas' ? 2 : 1)
  })
  chart.on('click', onChartClick)
  render()
  bindResize()
}

const onResize = () => {
  if (chart) chart.resize()
}

const onChartClick = (params) => {
  emit('chart-click', params)
}

const bindResize = () => {
  if (!container.value) return

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      onResize()
    })
    resizeObserver.observe(container.value)
    return
  }

  window.addEventListener('resize', onResize)
}

const unbindResize = () => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  } else {
    window.removeEventListener('resize', onResize)
  }
}

const getChartInstance = () => chart
const getContainer = () => container.value

defineExpose({
  getChartInstance,
  getContainer
})

onMounted(async () => {
  await nextTick()
  if (!container.value) return
  
  // 检查容器尺寸，避免 ECharts 报错
  const { clientWidth, clientHeight } = container.value
  if (clientWidth === 0 || clientHeight === 0) {
    setTimeout(() => {
      if (!container.value) return
      createChart()
    }, 100)
    return
  }
  
  createChart()
})

watch(
  () => props.option,
  () => {
    render()
  }
)

watch(
  () => props.height,
  async () => {
    await nextTick()
    onResize()
  }
)

onBeforeUnmount(() => {
  unbindResize()
  if (chart) {
    chart.off('click', onChartClick)
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped>
.science-chart {
  width: 100%;
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(255, 253, 250, 0.92) 0%, rgba(255, 251, 245, 0.92) 100%);
}
</style>
