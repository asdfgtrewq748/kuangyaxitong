<template>
  <Transition name="slide">
    <div v-if="show" class="performance-panel">
      <div class="panel-header">
        <h4>性能监控</h4>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="panel-content">
        <!-- FPS 监控 -->
        <div class="metric-group">
          <div class="metric-title">FPS</div>
          <div class="metric-value" :class="fpsClass">{{ fps }}</div>
          <div class="fps-chart">
            <div 
              v-for="(value, i) in fpsHistory" 
              :key="i"
              class="fps-bar"
              :style="{ height: `${value / 60 * 100}%`, opacity: i / fpsHistory.length + 0.3 }"
            />
          </div>
        </div>
        
        <!-- 内存使用 -->
        <div class="metric-group">
          <div class="metric-title">内存使用</div>
          <div class="metric-value">{{ memoryUsage }}</div>
          <div class="memory-bar">
            <div class="memory-fill" :style="{ width: memoryPercent }"></div>
          </div>
        </div>
        
        <!-- 渲染时间 -->
        <div class="metric-group">
          <div class="metric-title">渲染耗时</div>
          <div class="metric-value">{{ renderTime }}ms</div>
        </div>
        
        <!-- 数据量 -->
        <div class="metric-group">
          <div class="metric-title">数据量</div>
          <div class="metric-row">
            <span>数据点: {{ dataPoints.toLocaleString() }}</span>
            <span>单元格: {{ cells.toLocaleString() }}</span>
          </div>
        </div>
        
        <!-- 优化建议 -->
        <div v-if="suggestions.length" class="suggestions">
          <div class="suggestion-title">优化建议</div>
          <ul>
            <li v-for="(s, i) in suggestions" :key="i" :class="s.type">{{ s.text }}</li>
          </ul>
        </div>
        
        <!-- 快捷操作 -->
        <div class="quick-actions">
          <button @click="clearCache">清除缓存</button>
          <button @click="toggleLowPower">{{ lowPowerMode ? '关闭' : '开启' }}省电模式</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  fps: { type: Number, default: 60 },
  renderTime: { type: Number, default: 0 },
  dataPoints: { type: Number, default: 0 },
  cells: { type: Number, default: 0 }
})

const emit = defineEmits(['close', 'toggle-low-power'])

const fpsHistory = ref(Array(20).fill(60))
const memoryUsage = ref('0 MB')
const memoryPercent = ref('0%')
const lowPowerMode = ref(false)

// FPS 状态
const fpsClass = computed(() => {
  if (props.fps >= 50) return 'good'
  if (props.fps >= 30) return 'warning'
  return 'poor'
})

// 更新 FPS 历史
watch(() => props.fps, (newFps) => {
  fpsHistory.value.push(newFps)
  fpsHistory.value.shift()
})

// 性能建议
const suggestions = computed(() => {
  const list = []
  if (props.fps < 30) {
    list.push({ type: 'error', text: 'FPS 过低，建议减少数据量或开启省电模式' })
  } else if (props.fps < 50) {
    list.push({ type: 'warning', text: 'FPS 偏低，可优化渲染性能' })
  }
  if (props.renderTime > 100) {
    list.push({ type: 'warning', text: '渲染耗时较长，建议简化可视化' })
  }
  if (props.dataPoints > 100000) {
    list.push({ type: 'info', text: '数据量较大，已启用虚拟滚动' })
  }
  return list
})

// 更新内存信息
function updateMemory() {
  if (performance.memory) {
    const used = performance.memory.usedJSHeapSize
    const total = performance.memory.totalJSHeapSize
    const limit = performance.memory.jsHeapSizeLimit
    
    memoryUsage.value = `${(used / 1024 / 1024).toFixed(1)} MB`
    memoryPercent.value = `${(used / limit * 100).toFixed(1)}%`
  }
}

function clearCache() {
  // 清除图表缓存
  sessionStorage.removeItem('chartCache')
  location.reload()
}

function toggleLowPower() {
  lowPowerMode.value = !lowPowerMode.value
  emit('toggle-low-power', lowPowerMode.value)
}

let memoryTimer = null

onMounted(() => {
  memoryTimer = setInterval(updateMemory, 2000)
  updateMemory()
})

onUnmounted(() => {
  clearInterval(memoryTimer)
})
</script>

<style scoped>
.performance-panel {
  position: fixed;
  right: 20px;
  top: 80px;
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  z-index: 1000;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.panel-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.close-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 20px;
  cursor: pointer;
}

.panel-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-title {
  font-size: 11px;
  color: #737373;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
}

.metric-value.good { color: #22c55e; }
.metric-value.warning { color: #f59e0b; }
.metric-value.poor { color: #ef4444; }

.fps-chart {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 40px;
}

.fps-bar {
  flex: 1;
  background: linear-gradient(to top, #22c55e, #86efac);
  border-radius: 2px;
  min-height: 2px;
}

.memory-bar {
  height: 6px;
  background: #e5e5e5;
  border-radius: 3px;
  overflow: hidden;
}

.memory-fill {
  height: 100%;
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  border-radius: 3px;
  transition: width 0.3s;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #525252;
}

.suggestions {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.suggestion-title {
  font-size: 11px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.suggestions ul {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
}

.suggestions li {
  margin-bottom: 4px;
}

.suggestions li.error { color: #ef4444; }
.suggestions li.warning { color: #f59e0b; }
.suggestions li.info { color: #3b82f6; }

.quick-actions {
  display: flex;
  gap: 8px;
}

.quick-actions button {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-actions button:hover {
  background: #f5f5f5;
  border-color: #d0d0d0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
