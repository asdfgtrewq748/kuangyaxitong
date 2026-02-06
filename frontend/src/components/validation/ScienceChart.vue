<template>
  <div ref="container" class="science-chart" :style="{ height: normalizedHeight }"></div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

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

onMounted(async () => {
  await nextTick()
  if (!container.value) return
  chart = echarts.init(container.value, null, { renderer: 'svg' })
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
