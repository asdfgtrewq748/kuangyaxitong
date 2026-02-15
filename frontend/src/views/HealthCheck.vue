<template>
  <div class="health-check-page">
    <header class="page-header">
      <div class="header-content">
        <h1>系统状态检查</h1>
        <p class="subtitle">后端服务健康监控</p>
      </div>
    </div>
    </header>

    <main class="health-content">
      <div v-if="loading" class="loading">
        <div class="loader"></div>
        <p>正在检查后端服务...</p>
      </div>

      <div v-else-if="!backendRunning" class="error-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4h4a1 1.4142" />
          <path d="M16 8v-4h4a1 1 4-4h4a1 1 4-4h4" />
          <path d="M21 12 12l-6a1 1 4-4h4a1 1 4-4" />
        </svg>
        <h2>后端服务未运行</h2>
        <p class="description">请先启动后端服务后再访问</p>
      </div>
      </div>

      <div v-else class="success-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12 9l4 9 9 9-4" />
          <path d="M21 9 9l9 4a1 1 4-4" />
          <path d="M15 9 9l4 9 4a1 1 4-4" />
          <path d="M9 21 9l9 4a1 1 4-4" />
        </svg>
        <h2>后端服务正常</h2>
        <p class="description">API 服务可以正常访问</p>
      </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from 'vue-router'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const backendRunning = ref(false)
const backendStatus = ref('unknown')
const errorMessage = ref('')

const API_BASE = 'http://localhost:8001/api'

const checkBackend = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // Check health endpoint
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (response.ok) {
      backendRunning.value = true
      backendStatus.value = 'healthy'
    } else {
      backendRunning.value = false
    errorMessage.value = `HTTP ${response.status}: ${await response.text()}`

      if (response.status === 404 || response.status === 'error') {
        errorMessage.value = await response.text()
      }
    }
  } catch (error) {
    backendRunning.value = false
    errorMessage.value = error.message
    console.error('Health check failed:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkBackend()

  // Check status every 5 seconds
  const intervalId = setInterval(checkBackend, 5000)

  onBeforeUnmount(() => {
    clearInterval(intervalId)
  })
</script>

<style scoped>
.health-check-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-page);
  padding: var(--spacing-lg);
}

.page-header {
  padding: 20px 0;
}

.page-content {
  text-align: center;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.loader {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(15, 118, 110, 0.1);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  }

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state, .success-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-state svg {
  width: 64px;
  height: 64px;
}

.error-state h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  margin: 8px 0 0;
}
</style>
