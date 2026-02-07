<template>
  <div ref="container" class="science-chart" :style="{ height: normalizedHeight }"></div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { echarts } from '../../lib/echarts'

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  height: {
    type: [String, Number],
    default: 320
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
  chart.setOption(props.option || {}, {
    notMerge: true,
    lazyUpdate: true,
    silent: true
  })
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

onMounted(async () => {
  await nextTick()
  if (!container.value) return
  chart = echarts.init(container.value, null, { renderer: 'canvas' })
  chart.on('click', onChartClick)
  render()
  bindResize()
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
}
</style>
