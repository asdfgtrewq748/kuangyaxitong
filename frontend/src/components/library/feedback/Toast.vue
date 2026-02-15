<!--
  Toast - 消息提示组件

  用于显示临时通知消息

  特性：
  - 支持多种类型（成功、错误、警告、信息）
  - 支持自动关闭
  - 支持自定义持续时间
  - 支持操作按钮
-->

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="[`type-${toast.type}`, { closable: toast.closable }]"
        >
          <!-- 图标 -->
          <div class="toast-icon">
            <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <svg v-else-if="toast.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>

          <!-- 内容 -->
          <div class="toast-content">
            <div v-if="toast.title" class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>

          <!-- 操作 -->
          <div v-if="toast.action" class="toast-action">
            <button class="action-btn" @click="handleAction(toast)">
              {{ toast.action.label }}
            </button>
          </div>

          <!-- 关闭按钮 -->
          <button
            v-if="toast.closable"
            class="toast-close"
            @click="remove(toast.id)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- 进度条 -->
          <div
            v-if="toast.duration > 0"
            class="toast-progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  // 最大显示数量
  max: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['close'])

// Toast 列表
const toasts = ref([])

let toastId = 0

// 添加 Toast
function add(message, options = {}) {
  const id = ++toastId
  const toast = {
    id,
    message,
    type: options.type || 'info', // 'success' | 'error' | 'warning' | 'info'
    title: options.title,
    duration: options.duration ?? 3000,
    closable: options.closable ?? true,
    action: options.action
  }

  // 如果超过最大数量，移除最早的
  if (toasts.value.length >= props.max) {
    toasts.value.shift()
  }

  toasts.value.push(toast)

  // 自动关闭
  if (toast.duration > 0) {
    setTimeout(() => {
      remove(id)
    }, toast.duration)
  }

  return id
}

// 移除 Toast
function remove(id) {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
    emit('close', id)
  }
}

// 处理操作按钮点击
function handleAction(toast) {
  if (toast.action?.handler) {
    toast.action.handler(toast)
  }
  remove(toast.id)
}

// 清空所有 Toast
function clear() {
  toasts.value = []
}

// 快捷方法
function success(message, options = {}) {
  return add(message, { ...options, type: 'success' })
}

function error(message, options = {}) {
  return add(message, { ...options, type: 'error', duration: 5000 })
}

function warning(message, options = {}) {
  return add(message, { ...options, type: 'warning' })
}

function info(message, options = {}) {
  return add(message, { ...options, type: 'info' })
}

// 暴露方法
defineExpose({
  add,
  remove,
  clear,
  success,
  error,
  warning,
  info
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--spacing-4);
  right: var(--spacing-4);
  z-index: var(--z-tooltip);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  pointer-events: none;
}

.toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  min-width: 300px;
  max-width: 480px;
  padding: var(--spacing-4);
  background: var(--color-bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  pointer-events: auto;
  overflow: hidden;
}

/* Type Styles */
.toast.type-success {
  border-left: 4px solid var(--color-success);
}

.toast.type-error {
  border-left: 4px solid var(--color-error);
}

.toast.type-warning {
  border-left: 4px solid var(--color-warning);
}

.toast.type-info {
  border-left: 4px solid var(--color-info);
}

/* Icon */
.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.toast-icon svg {
  width: 100%;
  height: 100%;
}

.toast.type-success .toast-icon {
  color: var(--color-success);
}

.toast.type-error .toast-icon {
  color: var(--color-error);
}

.toast.type-warning .toast-icon {
  color: var(--color-warning);
}

.toast.type-info .toast-icon {
  color: var(--color-info);
}

/* Content */
.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
}

.toast-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

/* Action */
.toast-action {
  flex-shrink: 0;
}

.action-btn {
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Close Button */
.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.toast-close:hover {
  color: var(--color-text-primary);
}

.toast-close svg {
  width: 16px;
  height: 16px;
}

/* Progress Bar */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--color-primary);
  animation: progress linear forwards;
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 640px) {
  .toast-container {
    left: var(--spacing-4);
    right: var(--spacing-4);
  }

  .toast {
    min-width: 0;
    width: 100%;
  }
}
</style>
