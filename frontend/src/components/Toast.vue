<template>
  <teleport to="body">
    <div class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', toast.type, toast.isExiting && 'toast-exit']"
        role="alert"
        :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
      >
        <span class="toast-icon">{{ getIcon(toast.type) }}</span>
        <span class="toast-content">{{ toast.message }}</span>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'

const toasts = ref([])
let idCounter = 0
const MAX_TOASTS = 5
const removeTimers = new Map()
const exitTimers = new Map()

const getIcon = (type) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[type] || icons.info
}

const add = (message, type = 'info', duration = 3000) => {
  const id = ++idCounter
  const toast = { id, message, type, isExiting: false }
  toasts.value = [...toasts.value, toast].slice(-MAX_TOASTS)

  const timer = setTimeout(() => {
    remove(id)
  }, duration)
  removeTimers.set(id, timer)
}

const remove = (id) => {
  const pendingRemove = removeTimers.get(id)
  if (pendingRemove) {
    clearTimeout(pendingRemove)
    removeTimers.delete(id)
  }

  const toast = toasts.value.find(t => t.id === id)
  if (toast) {
    toast.isExiting = true
    const timer = setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
      exitTimers.delete(id)
    }, 200)
    exitTimers.set(id, timer)
  }
}

onBeforeUnmount(() => {
  for (const timer of removeTimers.values()) clearTimeout(timer)
  for (const timer of exitTimers.values()) clearTimeout(timer)
  removeTimers.clear()
  exitTimers.clear()
})

defineExpose({ add })
</script>
