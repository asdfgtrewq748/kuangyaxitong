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
import { ref } from 'vue'

const toasts = ref([])
let idCounter = 0

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
  toasts.value.push(toast)

  setTimeout(() => {
    remove(id)
  }, duration)
}

const remove = (id) => {
  const toast = toasts.value.find(t => t.id === id)
  if (toast) {
    toast.isExiting = true
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 200)
  }
}

defineExpose({ add })
</script>
