<template>
  <div class="health-check-page">
    <header class="page-header">
      <h1>系统状态检查</h1>
      <p class="subtitle">后端服务健康监控</p>
    </header>

    <main class="health-content">
      <section v-if="loading" class="state-card loading-state" aria-live="polite">
        <div class="loader" aria-hidden="true"></div>
        <h2>正在检查后端服务</h2>
        <p class="description">系统会每 5 秒自动刷新一次状态。</p>
      </section>

      <section v-else-if="!backendRunning" class="state-card error-state" aria-live="assertive">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 8v5"></path>
          <path d="M12 16h.01"></path>
        </svg>
        <h2>后端服务未运行</h2>
        <p class="description">请先启动后端服务后再访问。</p>
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      </section>

      <section v-else class="state-card success-state" aria-live="polite">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="m8.5 12 2.5 2.5 4.5-5"></path>
        </svg>
        <h2>后端服务正常</h2>
        <p class="description">API 服务可以正常访问。</p>
      </section>

      <button type="button" class="retry-btn" @click="checkBackend">
        立即重试
      </button>
    </main>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const loading = ref(true)
const backendRunning = ref(false)
const errorMessage = ref('')
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api').replace(/\/$/, '')

let intervalId = null

const checkBackend = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      const detail = await response.text()
      backendRunning.value = false
      errorMessage.value = detail ? `HTTP ${response.status}: ${detail}` : `HTTP ${response.status}`
      return
    }

    backendRunning.value = true
  } catch (error) {
    backendRunning.value = false
    errorMessage.value = error instanceof Error ? error.message : '健康检查请求失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkBackend()
  intervalId = window.setInterval(checkBackend, 5000)
})

onBeforeUnmount(() => {
  if (intervalId !== null) {
    window.clearInterval(intervalId)
    intervalId = null
  }
})
</script>

<style scoped>
.health-check-page {
  min-height: calc(100vh - var(--spacing-10));
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  background: var(--bg-secondary);
  padding: var(--spacing-6);
}

.page-header h1 {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--text-primary);
}

.subtitle {
  margin: var(--spacing-2) 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.health-content {
  display: grid;
  gap: var(--spacing-4);
  justify-items: start;
}

.state-card {
  min-width: min(100%, 520px);
  display: grid;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
}

.state-card svg {
  width: 42px;
  height: 42px;
}

.loading-state {
  color: var(--text-primary);
}

.success-state {
  color: var(--color-success);
}

.error-state {
  color: var(--color-error);
}

.state-card h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-lg);
}

.description {
  margin: 0;
  color: var(--text-secondary);
}

.error-text {
  margin: 0;
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

.retry-btn {
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
}

.retry-btn:hover {
  border-color: var(--border-color-dark);
  background: var(--bg-tertiary);
}

.loader {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid var(--border-color-light);
  border-top-color: var(--color-primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
