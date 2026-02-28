<template>
  <section class="empty-state" role="status" aria-live="polite">
    <div class="empty-icon" aria-hidden="true">
      <slot name="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="3" y="4" width="18" height="14" rx="2"></rect>
          <path d="M8 9h8"></path>
          <path d="M8 13h6"></path>
        </svg>
      </slot>
    </div>
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <button
      v-if="actionLabel"
      type="button"
      class="empty-action"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  actionLabel: {
    type: String,
    default: ''
  }
})

defineEmits(['action'])
</script>

<style scoped>
.empty-state {
  margin-top: var(--spacing-3);
  border: 1px dashed var(--border-color-dark);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  padding: var(--spacing-6) var(--spacing-4);
  display: grid;
  justify-items: center;
  text-align: center;
  gap: var(--spacing-2);
}

.empty-icon {
  width: 40px;
  height: 40px;
  color: var(--text-tertiary);
}

.empty-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.empty-title {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--text-primary);
}

.empty-description {
  margin: 0;
  max-width: 520px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.empty-action {
  margin-top: var(--spacing-1);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.empty-action:hover {
  border-color: var(--border-color-dark);
  background: var(--bg-tertiary);
}
</style>
