<template>
  <section class="form-panel" :class="{ compact }">
    <header v-if="title || description || $slots.header" class="form-panel-header">
      <slot name="header">
        <h3 v-if="title" class="form-panel-title">{{ title }}</h3>
        <p v-if="description" class="form-panel-description">{{ description }}</p>
      </slot>
    </header>

    <form class="form-panel-body" @submit.prevent="handleSubmit">
      <div
        v-if="autoGrid"
        class="form-panel-grid"
        :style="{
          gridTemplateColumns: `repeat(${Math.max(columns, 1)}, minmax(0, 1fr))`
        }"
      >
        <slot></slot>
      </div>
      <slot v-else></slot>

      <footer v-if="showActions || $slots.actions" class="form-panel-actions">
        <slot name="actions">
          <button
            v-if="showCancel"
            type="button"
            class="btn secondary"
            :disabled="cancelDisabled || submitLoading"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          <button
            type="submit"
            class="btn primary"
            :disabled="submitDisabled || submitLoading"
          >
            <span v-if="submitLoading" class="spinner"></span>
            {{ submitLoading ? submitLoadingText : submitText }}
          </button>
        </slot>
      </footer>
    </form>
  </section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  columns: {
    type: Number,
    default: 2
  },
  compact: {
    type: Boolean,
    default: false
  },
  autoGrid: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  submitText: {
    type: String,
    default: 'Submit'
  },
  submitLoadingText: {
    type: String,
    default: 'Submitting...'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  submitDisabled: {
    type: Boolean,
    default: false
  },
  submitLoading: {
    type: Boolean,
    default: false
  },
  cancelDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

function handleSubmit() {
  if (props.submitLoading || props.submitDisabled) return
  emit('submit')
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.form-panel {
  border: 1px solid var(--border-color-light);
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);
  overflow: hidden;
}

.form-panel.compact {
  border-radius: var(--radius-md);
}

.form-panel-header {
  padding: var(--spacing-4) var(--spacing-5);
  border-bottom: 1px solid var(--border-color-light);
}

.form-panel-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.form-panel-description {
  margin: var(--spacing-1) 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.form-panel-body {
  padding: var(--spacing-4) var(--spacing-5);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.form-panel-grid {
  display: grid;
  gap: var(--spacing-3);
}

.form-panel-grid :deep(.full) {
  grid-column: 1 / -1;
}

.form-panel-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
}

.btn {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
}

.btn.secondary {
  background: var(--color-bg-card);
  color: var(--color-text-primary);
}

.btn.primary {
  background: var(--color-primary);
  color: #fff;
  border-color: transparent;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  animation: form-panel-spin 0.8s linear infinite;
}

@keyframes form-panel-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .form-panel-body {
    padding: var(--spacing-3) var(--spacing-4);
  }

  .form-panel-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
