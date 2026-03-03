<template>
  <div ref="containerRef" class="virtual-scroller" :style="containerStyle">
    <div class="virtual-content" :style="contentStyle">
      <div 
        v-for="item in visibleItems" 
        :key="item.key"
        class="virtual-item"
        :style="item.style"
      >
        <slot :item="item.data" :index="item.index" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  itemHeight: { type: Number, required: true },
  itemWidth: { type: Number, default: null }, // null 表示横向不虚拟化
  buffer: { type: Number, default: 5 }, // 上下缓冲数量
  direction: { type: String, default: 'vertical' } // vertical | horizontal
})

const containerRef = ref(null)
const scrollTop = ref(0)
const scrollLeft = ref(0)
const containerHeight = ref(0)
const containerWidth = ref(0)

// 计算可见区域
const visibleRange = computed(() => {
  if (props.direction === 'vertical') {
    const startIdx = Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
    const visibleCount = Math.ceil(containerHeight.value / props.itemHeight) + props.buffer * 2
    const endIdx = Math.min(props.items.length, startIdx + visibleCount)
    return { start: startIdx, end: endIdx }
  } else {
    const startIdx = Math.max(0, Math.floor(scrollLeft.value / props.itemWidth) - props.buffer)
    const visibleCount = Math.ceil(containerWidth.value / props.itemWidth) + props.buffer * 2
    const endIdx = Math.min(props.items.length, startIdx + visibleCount)
    return { start: startIdx, end: endIdx }
  }
})

// 可见项目
const visibleItems = computed(() => {
  const { start, end } = visibleRange.value
  return props.items.slice(start, end).map((data, idx) => {
    const index = start + idx
    const style = props.direction === 'vertical'
      ? { transform: `translateY(${index * props.itemHeight}px)` }
      : { transform: `translateX(${index * props.itemWidth}px)` }
    
    return {
      key: `item-${index}`,
      data,
      index,
      style: {
        ...style,
        position: 'absolute',
        top: 0,
        left: 0,
        height: props.direction === 'vertical' ? `${props.itemHeight}px` : '100%',
        width: props.direction === 'horizontal' ? `${props.itemWidth}px` : '100%'
      }
    }
  })
})

// 容器样式
const containerStyle = computed(() => ({
  position: 'relative',
  overflow: 'auto',
  height: '100%'
}))

// 内容总高度/宽度
const contentStyle = computed(() => {
  if (props.direction === 'vertical') {
    return {
      height: `${props.items.length * props.itemHeight}px`,
      position: 'relative'
    }
  } else {
    return {
      width: `${props.items.length * props.itemWidth}px`,
      height: '100%',
      position: 'relative'
    }
  }
})

// 处理滚动
function handleScroll() {
  if (!containerRef.value) return
  scrollTop.value = containerRef.value.scrollTop
  scrollLeft.value = containerRef.value.scrollLeft
}

// 更新容器尺寸
function updateContainerSize() {
  if (!containerRef.value) return
  containerHeight.value = containerRef.value.clientHeight
  containerWidth.value = containerRef.value.clientWidth
}

// 监听items变化，重置滚动位置
watch(() => props.items.length, () => {
  nextTick(() => {
    updateContainerSize()
  })
})

onMounted(() => {
  updateContainerSize()
  containerRef.value?.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', updateContainerSize)
})

onUnmounted(() => {
  containerRef.value?.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateContainerSize)
})
</script>

<style scoped>
.virtual-scroller {
  will-change: transform;
}

.virtual-content {
  will-change: transform;
}

.virtual-item {
  will-change: transform;
  contain: layout style paint;
}
</style>
