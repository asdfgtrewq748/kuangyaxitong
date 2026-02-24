<template>
  <teleport to="body">
    <transition name="confirm-fade">
      <div
        v-if="modelValue"
        class="confirm-dialog-mask"
        @click="handleMaskClick"
      >
        <section
          class="confirm-dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="dialogTitleId"
          @click.stop
        >
          <header class="confirm-dialog-header">
            <h3 :id="dialogTitleId" class="confirm-dialog-title">{{ title }}</h3>
            <button
              v-if="showClose"
              type="button"
              class="icon-close"
              aria-label="Close"
              @click="handleCancel"
            >
              x
            </button>
          </header>

          <div class="confirm-dialog-body">
            <slot>
              <p class="confirm-dialog-message">{{ message }}</p>
            </slot>
          </div>

          <footer class="confirm-dialog-footer">
            <slot name="footer">
              <button
                type="button"
                class="btn cancel"
                :disabled="confirmLoading"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                class="btn confirm"
                :class="`variant-${variant}`"
                :disabled="confirmDisabled || confirmLoading"
                @click="handleConfirm"
              >
                <span v-if="confirmLoading" class="spinner"></span>
                {{ confirmLoading ? confirmLoadingText : confirmText }}
              </button>
            </slot>
          </footer>
        </section>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm'
  },
  message: {
    type: String,
    default: 'Are you sure you want to continue?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  confirmLoadingText: {
    type: String,
    default: 'Processing...'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  variant: {
    type: String,
    default: 'danger',
    validator: (value) => ['danger', 'warning', 'primary'].includes(value)
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  closeOnConfirm: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  confirmLoading: {
    type: Boolean,
    default: false
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const dialogTitleId = `confirm-dialog-${Math.random().toString(36).slice(2, 10)}`

function closeDialog() {
  emit('update:modelValue', false)
}

function handleCancel() {
  emit('cancel')
  closeDialog()
}

function handleConfirm() {
  emit('confirm')
  if (props.closeOnConfirm) {
    closeDialog()
  }
}

function handleMaskClick() {
  if (props.closeOnOverlay) {
    handleCancel()
  }
}

function handleEsc(event) {
  if (!props.modelValue || !props.closeOnEsc) return
  if (event.key === 'Escape') {
    handleCancel()
  }
}

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      document.addEventListener('keydown', handleEsc)
    } else {
      document.removeEventListener('keydown', handleEsc)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.confirm-dialog-mask {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal, 1000);
  background: rgba(15, 23, 42, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
}

.confirm-dialog {
  width: min(560px, calc(100vw - 2 * var(--spacing-4)));
  background: var(--color-bg-card);
  border: 1px solid var(--border-color-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg, 0 20px 40px rgba(15, 23, 42, 0.18));
  overflow: hidden;
}

.confirm-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
  padding: var(--spacing-4) var(--spacing-5);
  border-bottom: 1px solid var(--border-color-light);
}

.confirm-dialog-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.icon-close {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.icon-close:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.confirm-dialog-body {
  padding: var(--spacing-5);
}

.confirm-dialog-message {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed, 1.6);
}

.confirm-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
  padding: var(--spacing-4) var(--spacing-5);
  border-top: 1px solid var(--border-color-light);
}

.btn {
  border: 1px solid var(--border-color);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.cancel:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn.confirm {
  color: #fff;
  border-color: transparent;
}

.btn.confirm.variant-danger {
  background: var(--color-danger, #dc2626);
}

.btn.confirm.variant-warning {
  background: var(--color-warning, #d97706);
}

.btn.confirm.variant-primary {
  background: var(--color-primary, #0f766e);
}

.spinner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: #fff;
  animation: confirm-spin 0.8s linear infinite;
}

@keyframes confirm-spin {
  to {
    transform: rotate(360deg);
  }
}

.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.16s ease;
}

.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}
</style>
