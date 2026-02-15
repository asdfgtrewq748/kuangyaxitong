<!--
  SidePanel - 侧边面板组件

  可折叠的侧边面板，用于显示控制项、信息等

  特性：
  - 支持左右两侧
  - 支持折叠/展开
  - 支持自定义宽度
  - 支持固定和浮动模式
  - 支持移动端抽屉模式
-->

<template>
  <div
    class="side-panel"
    :class="[
      `position-${position}`,
      { collapsed, floating, mobile }
    ]"
    :style="panelStyles"
  >
    <!-- 折叠按钮 -->
    <button
      v-if="showToggle"
      class="panel-toggle"
      :title="collapsed ? '展开' : '收起'"
      @click="toggle"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline v-if="position === 'left'" :points="collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'"/>
        <polyline v-else :points="collapsed ? '15 18 9 12 15 6' : '9 18 15 12 9 6'"/>
      </svg>
    </button>

    <!-- 面板内容 -->
    <div class="panel-content" :class="{ 'show-overlay': showOverlay && collapsed }">
      <!-- 头部 -->
      <div v-if="$slots.header || title" class="panel-header">
        <slot name="header">
          <h3>{{ title }}</h3>
          <p v-if="description">{{ description }}</p>
        </slot>
      </div>

      <!-- 主体内容 -->
      <div class="panel-body">
        <slot></slot>
      </div>

      <!-- 底部 -->
      <div v-if="$slots.footer" class="panel-footer">
        <slot name="footer"></slot>
      </div>
    </div>

    <!-- 移动端遮罩层 -->
    <div
      v-if="mobile && !collapsed"
      class="panel-overlay"
      @click="toggle"
    ></div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  // 位置：left | right
  position: {
    type: String,
    default: 'left',
    validator: (v) => ['left', 'right'].includes(v)
  },

  // 标题
  title: String,

  // 描述
  description: String,

  // 宽度
  width: {
    type: [String, Number],
    default: 320
  },

  // 折叠后的宽度
  collapsedWidth: {
    type: [String, Number],
    default: 0
  },

  // 是否浮动（不占据空间）
  floating: {
    type: Boolean,
    default: false
  },

  // 默认是否折叠
  defaultCollapsed: {
    type: Boolean,
    default: false
  },

  // 是否显示切换按钮
  showToggle: {
    type: Boolean,
    default: true
  },

  // 是否在折叠时显示遮罩（提示有内容）
  showOverlay: {
    type: Boolean,
    default: false
  },

  // 是否移动端模式
  mobile: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle', 'expand', 'collapse'])

const collapsed = ref(props.defaultCollapsed)

// 监听默认折叠状态
watch(() => props.defaultCollapsed, (value) => {
  collapsed.value = value
})

// 面板样式
const panelStyles = computed(() => {
  const width = typeof props.width === 'number'
    ? `${props.width}px`
    : props.width

  const collapsedWidth = typeof props.collapsedWidth === 'number'
    ? `${props.collapsedWidth}px`
    : props.collapsedWidth

  return {
    '--panel-width': width,
    '--panel-collapsed-width': collapsedWidth
  }
})

// 切换折叠状态
function toggle() {
  collapsed.value = !collapsed.value

  if (collapsed.value) {
    emit('collapse')
  } else {
    emit('expand')
  }

  emit('toggle', collapsed.value)
}

// 展开面板
function expand() {
  collapsed.value = false
  emit('expand')
  emit('toggle', false)
}

// 折叠面板
function collapse() {
  collapsed.value = true
  emit('collapse')
  emit('toggle', true)
}

// 暴露方法
defineExpose({
  toggle,
  expand,
  collapse
})
</script>

<style scoped>
.side-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-card);
  border: 1px solid var(--border-color-light);
  transition: all var(--transition-normal);
}

.side-panel.position-left {
  border-right: 1px solid var(--border-color-light);
}

.side-panel.position-right {
  border-left: 1px solid var(--border-color-light);
}

/* 宽度控制 */
.side-panel:not(.collapsed) {
  width: var(--panel-width);
}

.side-panel.collapsed {
  width: var(--panel-collapsed-width);
  overflow: hidden;
}

.side-panel.position-left.collapsed {
  min-width: var(--panel-collapsed-width);
}

.side-panel.position-right.collapsed {
  min-width: var(--panel-collapsed-width);
}

/* 浮动模式 */
.side-panel.floating {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: var(--z-fixed);
  box-shadow: var(--shadow-lg);
}

.side-panel.floating.position-left {
  left: 0;
}

.side-panel.floating.position-right {
  right: 0;
}

/* 移动端模式 */
.side-panel.mobile {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100% !important;
  max-width: 320px;
  z-index: var(--z-modal);
  transform: translateX(-100%);
}

.side-panel.mobile.position-right {
  left: auto;
  transform: translateX(100%);
}

.side-panel.mobile:not(.collapsed) {
  transform: translateX(0);
}

/* Toggle Button */
.panel-toggle {
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-3);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.panel-toggle:hover {
  background: var(--color-bg-hover);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.side-panel.position-right .panel-toggle {
  right: auto;
  left: var(--spacing-3);
}

.panel-toggle svg {
  width: 16px;
  height: 16px;
}

/* Panel Content */
.panel-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.side-panel.collapsed .panel-content {
  opacity: 0;
  pointer-events: none;
}

/* Header */
.panel-header {
  flex-shrink: 0;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border-color-light);
}

.panel-header h3 {
  margin: 0 0 var(--spacing-1) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.panel-header p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Body */
.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
}

/* Footer */
.panel-footer {
  flex-shrink: 0;
  padding: var(--spacing-4);
  border-top: 1px solid var(--border-color-light);
}

/* Overlay (Mobile) */
.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal-backdrop);
  animation: fadeIn var(--transition-fast);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Show overlay hint when collapsed */
.panel-content.show-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to {{ position === 'left' ? 'right' : 'left' }},
    transparent 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.side-panel.collapsed .panel-content.show-overlay::after {
  opacity: 1;
}
</style>
