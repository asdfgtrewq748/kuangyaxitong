<!--
  LoadingState - 加载状态组件

  用于展示加载、空状态、错误状态

  特性：
  - 支持加载动画
  - 支持空状态
  - 支持错误状态
  - 支持自定义图标和消息
  - 支持操作按钮
-->

<template>
  <div class="loading-state" :class="[`type-${type}`, { fullScreen }]">
    <!-- 加载状态 -->
    <template v-if="type === 'loading'">
      <div class="state-icon">
        <div class="spinner"></div>
      </div>
      <h3 v-if="title" class="state-title">{{ title }}</h3>
      <p v-if="message" class="state-message">{{ message }}</p>
      <p v-if="showProgress && progress !== undefined" class="state-progress">
        {{ progress }}%
      </p>
    </template>

    <!-- 空状态 -->
    <template v-else-if="type === 'empty'">
      <div class="state-icon">
        <slot name="icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
          </svg>
        </slot>
      </div>
      <h3 v-if="title" class="state-title">{{ title }}</h3>
      <p v-if="message" class="state-message">{{ message }}</p>
      <div v-if="$slots.actions" class="state-actions">
        <slot name="actions"></slot>
      </div>
    </template>

    <!-- 错误状态 -->
    <template v-else-if="type === 'error'">
      <div class="state-icon error">
        <slot name="icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </slot>
      </div>
      <h3 v-if="title" class="state-title">{{ title || '发生错误' }}</h3>
      <p v-if="message" class="state-message">{{ message }}</p>
      <div v-if="showRetry || $slots.actions" class="state-actions">
        <slot name="actions">
          <button v-if="showRetry" class="btn primary" @click="handleRetry">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            重试
          </button>
        </slot>
      </div>
    </template>

    <!-- 成功状态 -->
    <template v-else-if="type === 'success'">
      <div class="state-icon success">
        <slot name="icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </slot>
      </div>
      <h3 v-if="title" class="state-title">{{ title || '操作成功' }}</h3>
      <p v-if="message" class="state-message">{{ message }}</p>
      <div v-if="$slots.actions" class="state-actions">
        <slot name="actions"></slot>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  // 类型：loading | empty | error | success
  type: {
    type: String,
    default: 'loading',
    validator: (v) => ['loading', 'empty', 'error', 'success'].includes(v)
  },

  // 标题
  title: String,

  // 消息描述
  message: String,

  // 是否显示重试按钮（仅 error 类型）
  showRetry: {
    type: Boolean,
    default: true
  },

  // 是否显示进度（仅 loading 类型）
  showProgress: Boolean,

  // 进度值（0-100）
  progress: {
    type: Number,
    default: undefined,
    validator: (v) => v === undefined || (v >= 0 && v <= 100)
  },

  // 是否全屏显示
  fullScreen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['retry'])

function handleRetry() {
  emit('retry')
}
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8);
  text-align: center;
  min-height: 200px;
}

.loading-state.fullScreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
  background: var(--color-bg-overlay);
  backdrop-filter: blur(4px);
}

.state-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-4);
  color: var(--color-text-tertiary);
}

.state-icon svg {
  width: 100%;
  height: 100%;
}

.state-icon.error {
  color: var(--color-error);
}

.state-icon.success {
  color: var(--color-success);
}

.state-title {
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.state-message {
  margin: 0 0 var(--spacing-4) 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  max-width: 400px;
}

.state-progress {
  margin-top: var(--spacing-2);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.state-actions {
  display: flex;
  gap: var(--spacing-3);
  margin-top: var(--spacing-4);
}

/* Spinner */
.spinner {
  width: 100%;
  height: 100%;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-5);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.btn.primary {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
}

.btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-btn-hover);
}

.btn svg {
  width: 16px;
  height: 16px;
}
</style>
