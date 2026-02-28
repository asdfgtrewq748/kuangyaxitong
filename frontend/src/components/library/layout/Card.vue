<template>
  <component :is="as" class="card" :class="cardClassList">
    <template v-if="useStructuredLayout">
      <div v-if="title || $slots.header || $slots.actions" class="card-header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <slot name="header"></slot>
        <div v-if="$slots.actions" class="card-actions">
          <slot name="actions"></slot>
        </div>
      </div>
      <div class="card-body">
        <slot></slot>
      </div>
      <div v-if="$slots.footer" class="card-footer">
        <slot name="footer"></slot>
      </div>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </component>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  as: {
    type: String,
    default: 'div'
  },
  title: {
    type: String,
    default: ''
  },
  bordered: {
    type: Boolean,
    default: true
  },
  flat: {
    type: Boolean,
    default: false
  },
  structured: {
    type: Boolean,
    default: false
  }
})

const slots = useSlots()

const useStructuredLayout = computed(() => {
  return props.structured || !!props.title || !!slots.header || !!slots.footer || !!slots.actions
})

const cardClassList = computed(() => ({
  'card--bordered': props.bordered,
  'card--flat': props.flat
}))
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.card-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.card-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.card-footer {
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--border-color-light);
}

.card.card--flat {
  box-shadow: none;
}

.card.card--bordered {
  border: 1px solid var(--border-color);
}
</style>
