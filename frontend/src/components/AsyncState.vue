<template>
  <div v-if="loading" class="async-state loading">
    <div class="spinner"></div>
    <p>{{ loadingText || '加载中...' }}</p>
  </div>

  <div v-else-if="hasError" class="async-state error">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v6" />
      <path d="M12 17h.01" />
    </svg>
    <p>{{ errorText }}</p>
    <button v-if="action" class="btn primary" @click="action.onClick">{{ action.label }}</button>
  </div>

  <div v-else-if="!hasData" class="async-state empty">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 3v18m0-18l-9 9m9-9l9 9" />
    </svg>
    <p>{{ emptyText || '暂无数据' }}</p>
    <button v-if="action" class="btn primary" @click="action.onClick">{{ action.label }}</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
  hasData: { type: Boolean, default: false },
  errorText: { type: String, default: '' },
  loadingText: { type: String, default: '' },
  emptyText: { type: String, default: '' },
  action: { type: Object, default: null },
})

const hasError = computed(() => typeof props.errorText === 'string' && props.errorText.trim().length > 0)
</script>

<style scoped>
.async-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  color: #64748b;
  background: rgba(255, 255, 255, 0.9);
}

.async-state svg {
  width: 48px;
  height: 48px;
  opacity: 0.75;
}

.async-state.error {
  color: #b91c1c;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(15, 118, 110, 0.15);
  border-top-color: #0f766e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
}

.btn.primary {
  background: #0f766e;
  color: #fff;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
