<!--
  Toolbar - 工具栏组件

  用于页面或组件的工具栏，包含标题、操作按钮等

  特性：
  - 支持标题和描述
  - 支持左侧和右侧操作区
  - 支持分隔符
  - 支持多种尺寸
  - 响应式布局
-->

<template>
  <div class="toolbar" :class="[`size-${size}`, { bordered }]">
    <!-- 左侧区域 -->
    <div class="toolbar-left">
      <!-- 标题 -->
      <div v-if="title || $slots.title" class="toolbar-title">
        <slot name="title">
          <h2>{{ title }}</h2>
        </slot>
        <p v-if="description" class="toolbar-description">{{ description }}</p>
      </div>

      <!-- 左侧操作 -->
      <div v-if="$slots.left" class="toolbar-actions">
        <slot name="left"></slot>
      </div>
    </div>

    <!-- 右侧区域 -->
    <div v-if="$slots.right || $slots.default" class="toolbar-right">
      <div class="toolbar-actions">
        <slot name="right">
          <slot></slot>
        </slot>
      </div>
    </div>

    <!-- 底部扩展区 -->
    <div v-if="$slots.extensions" class="toolbar-extensions">
      <slot name="extensions"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // 标题
  title: String,

  // 描述
  description: String,

  // 尺寸
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },

  // 是否显示底部边框
  bordered: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  background: var(--color-bg-card);
  transition: all var(--transition-fast);
}

.toolbar.bordered {
  border-bottom: 1px solid var(--border-color-light);
}

.toolbar.size-sm {
  padding: var(--spacing-3);
}

.toolbar.size-lg {
  padding: var(--spacing-5);
}

/* Left Section */
.toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  flex: 1;
  min-width: 0;
}

.toolbar-title {
  margin: 0;
  padding: 0;
  min-width: 0;
}

.toolbar-title h2 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--line-height-tight);
}

.toolbar.size-sm .toolbar-title h2 {
  font-size: var(--font-size-base);
}

.toolbar.size-lg .toolbar-title h2 {
  font-size: var(--font-size-xl);
}

.toolbar-description {
  margin: var(--spacing-1) 0 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}

/* Right Section */
.toolbar-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* Actions */
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

/* Extensions */
.toolbar-extensions {
  flex-basis: 100%;
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--border-color-light);
}

/* Responsive */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
  }

  .toolbar-right {
    justify-content: flex-start;
  }

  .toolbar-actions {
    width: 100%;
  }
}
</style>
