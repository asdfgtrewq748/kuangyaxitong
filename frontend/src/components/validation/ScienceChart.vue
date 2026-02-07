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

const normalizedHeight = computed(() => {
  if (typeof props.height === 'number') return `${props.height}px`
  return props.height
})

const render = () => {
  if (!chart) return
  chart.setOption(props.option || {}, true)
}

const onResize = () => {
  if (chart) chart.resize()
}

const onChartClick = (params) => {
  emit('chart-click', params)
}

onMounted(async () => {
  await nextTick()
  if (!container.value) return
  chart = echarts.init(container.value, null, { renderer: 'svg' })
  chart.on('click', onChartClick)
  render()
  window.addEventListener('resize', onResize)
})

watch(
  () => props.option,
  () => {
    render()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
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
