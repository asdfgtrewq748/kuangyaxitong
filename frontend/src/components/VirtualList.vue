<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    :style="containerStyle"
    role="list"
    tabindex="0"
    aria-label="虚拟列表"
    @scroll.passive="onScroll"
  >
    <div class="virtual-list-spacer" :style="spacerStyle">
      <div
        class="virtual-list-window"
        :style="windowStyle"
      >
        <div
          v-for="item in visibleItems"
          :key="getKey(item)"
          :class="itemClass"
          :style="itemStyle"
          role="listitem"
          :aria-posinset="item.index + 1"
          :aria-setsize="props.items.length"
        >
          <slot :item="item.data" :index="item.index" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { VIRTUAL_LIST_DEFAULT_BUFFER } from '../constants/performance'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  itemHeight: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  buffer: {
    type: Number,
    default: VIRTUAL_LIST_DEFAULT_BUFFER
  },
  keyField: {
    type: String,
    default: 'id'
  },
  itemClass: {
    type: String,
    default: ''
  }
})

const containerRef = ref(null)
const scrollTop = ref(0)

// Container styles
const containerStyle = computed(() => ({
  height: `${props.height}px`,
  overflow: 'auto',
  position: 'relative'
}))

// Total height of all items
const totalHeight = computed(() => props.items.length * props.itemHeight)

// Spacer style to maintain scroll height
const spacerStyle = computed(() => ({
  height: `${totalHeight.value}px`,
  position: 'relative'
}))

const itemStyle = computed(() => ({
  height: `${props.itemHeight}px`,
  position: 'relative',
  width: '100%',
  boxSizing: 'border-box'
}))

const safeBuffer = computed(() => Math.max(2, Number(props.buffer) || 2))

// Calculate visible range
const visibleRange = computed(() => {
  const startIdx = Math.floor(scrollTop.value / props.itemHeight)
  const visibleCount = Math.ceil(props.height / props.itemHeight)

  // Apply buffer
  const start = Math.max(0, startIdx - safeBuffer.value)
  const end = Math.min(props.items.length, startIdx + visibleCount + safeBuffer.value)

  return { start, end }
})

const startOffset = computed(() => visibleRange.value.start * props.itemHeight)
const windowStyle = computed(() => ({
  transform: `translateY(${startOffset.value}px)`,
  willChange: 'transform'
}))

// Get visible items with their positions
const visibleItems = computed(() => {
  const { start, end } = visibleRange.value
  const result = []

  for (let i = start; i < end; i++) {
    if (i >= 0 && i < props.items.length) {
      result.push({
        data: props.items[i],
        index: i
      })
    }
  }

  return result
})

// Get unique key for item
const getKey = (entry) => {
  if (!entry) return 'virtual-item'
  const item = entry.data
  const index = entry.index
  if (props.keyField && item?.[props.keyField] !== undefined && item?.[props.keyField] !== null) {
    return `${String(item[props.keyField])}_${index}`
  }
  return `index_${index}`
}

// Scroll handler
let rafId = null
const onScroll = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    scrollTop.value = containerRef.value?.scrollTop ?? 0
    rafId = null
  })
}

// Expose scrollTo method for external control
defineExpose({
  scrollTo: (index) => {
    if (containerRef.value) {
      const safeIndex = Math.max(0, Math.min(props.items.length - 1, Number(index) || 0))
      containerRef.value.scrollTop = safeIndex * props.itemHeight
    }
  },
  scrollToTop: () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = 0
    }
  }
})

onBeforeUnmount(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
})
</script>

<style scoped>
.virtual-list-container {
  overflow-anchor: none;
}

.virtual-list-container:focus-visible {
  outline: 2px solid var(--color-primary-light);
  outline-offset: 0;
}

.virtual-list-spacer {
  position: relative;
}

.virtual-list-window {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
