<template>
  <div ref="containerRef" class="lazy-chart-container">
    <SkeletonCard v-if="!isVisible || loading" :height="height" :show-header="showHeader" />
    <div v-show="isVisible && !loading" class="chart-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SkeletonCard from './SkeletonCard.vue'

const props = defineProps({
  height: { type: String, default: '300px' },
  showHeader: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  threshold: { type: Number, default: 0.1 }
})

const containerRef = ref(null)
const isVisible = ref(false)
let observer = null

onMounted(() => {
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            // 可以选择在可见后停止观察
            // observer.unobserve(entry.target)
          }
        })
      },
      { threshold: props.threshold }
    )
    
    if (containerRef.value) {
      observer.observe(containerRef.value)
    }
  } else {
    // 如果不支持 IntersectionObserver，直接显示
    isVisible.value = true
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.lazy-chart-container {
  width: 100%;
  height: 100%;
}

.chart-content {
  width: 100%;
  height: 100%;
}
</style>
