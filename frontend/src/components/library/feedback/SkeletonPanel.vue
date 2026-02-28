<template>
  <section class="skeleton-panel" :class="{ compact }" aria-hidden="true">
    <div class="skeleton-line skeleton-title"></div>
    <div
      v-for="(width, index) in lineWidths"
      :key="`skeleton-${index}`"
      class="skeleton-line"
      :style="{ width }"
    ></div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rows: {
    type: Number,
    default: 5
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const lineWidths = computed(() => {
  const size = Math.max(1, Number(props.rows) || 1)
  return Array.from({ length: size }, (_, index) => {
    const base = 92 - index * 8
    return `${Math.max(48, base)}%`
  })
})
</script>

<style scoped>
.skeleton-panel {
  margin-top: var(--spacing-3);
  border: 1px solid var(--border-color-light);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  padding: var(--spacing-4);
  display: grid;
  gap: var(--spacing-2);
}

.skeleton-panel.compact {
  padding: var(--spacing-3);
}

.skeleton-line {
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 8%,
    var(--border-color) 35%,
    var(--bg-tertiary) 65%
  );
  background-size: 220% 100%;
  animation: skeleton-shimmer 1.1s linear infinite;
}

.skeleton-title {
  width: 42%;
  height: 14px;
  margin-bottom: var(--spacing-1);
}

@keyframes skeleton-shimmer {
  to {
    background-position: -220% 0;
  }
}
</style>
