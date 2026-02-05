<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    :style="containerStyle"
    @scroll="onScroll"
  >
    <div class="virtual-list-spacer" :style="spacerStyle">
      <div
        v-for="item in visibleItems"
        :key="getKey(item.data)"
        :class="itemClass"
        :style="getItemStyle(item.index)"
      >
        <slot :item="item.data" :index="item.index" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
    default: 5
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

// Get item style with position
const getItemStyle = (index) => ({
  height: `${props.itemHeight}px`,
  position: 'absolute',
  top: `${index * props.itemHeight}px`,
  left: 0,
  right: 0,
  boxSizing: 'border-box'
})

// Calculate visible range
const visibleRange = computed(() => {
  const startIdx = Math.floor(scrollTop.value / props.itemHeight)
  const visibleCount = Math.ceil(props.height / props.itemHeight)

  // Apply buffer
  const start = Math.max(0, startIdx - props.buffer)
  const end = Math.min(props.items.length, startIdx + visibleCount + props.buffer)

  return { start, end }
})

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
const getKey = (item) => {
  if (props.keyField && item[props.keyField] !== undefined) {
    return item[props.keyField]
  }
  // Fallback to index if no key field
  return visibleItems.value.find(vi => vi.data === item)?.index ?? Math.random()
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
      containerRef.value.scrollTop = index * props.itemHeight
    }
  },
  scrollToTop: () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = 0
    }
  }
})
</script>

<style scoped>
.virtual-list-container {
  will-change: transform;
}

.virtual-list-spacer {
  position: relative;
}
</style>
