<!--
  FilterPanel - 筛选面板组件

  用于展示筛选选项，支持多种筛选器类型

  特性：
  - 支持多种筛选器类型
  - 支持折叠/展开
  - 支持清除筛选
  - 响应式布局
-->

<template>
  <div class="filter-panel" :class="{ collapsed }">
    <!-- 头部 -->
    <div class="panel-header">
      <h3 class="panel-title">{{ title }}</h3>
      <div class="panel-actions">
        <button
          v-if="hasActiveFilters"
          class="action-btn clear"
          title="清除筛选"
          @click="handleClear"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
        <button
          class="action-btn toggle"
          :title="collapsed ? '展开' : '收起'"
          @click="toggle"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline :points="collapsed ? '6 9 12 15 18 9' : '18 15 12 9 6 15'"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 筛选器列表 -->
    <div v-show="!collapsed" class="panel-body">
      <div
        v-for="filter in filters"
        :key="filter.key"
        class="filter-item"
      >
        <!-- 标签 -->
        <label class="filter-label">
          {{ filter.label }}
        </label>

        <!-- 文本输入 -->
        <template v-if="filter.type === 'text'">
          <input
            v-model="filterValues[filter.key]"
            type="text"
            :placeholder="filter.placeholder"
            class="filter-input"
          />
        </template>

        <!-- 下拉选择 -->
        <template v-else-if="filter.type === 'select'">
          <select
            v-model="filterValues[filter.key]"
            class="filter-select"
          >
            <option value="">{{ filter.placeholder || '全部' }}</option>
            <option
              v-for="option in filter.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </template>

        <!-- 多选框组 -->
        <template v-else-if="filter.type === 'checkbox'">
          <div class="checkbox-group">
            <label
              v-for="option in filter.options"
              :key="option.value"
              class="checkbox-item"
            >
              <input
                v-model="filterValues[filter.key]"
                type="checkbox"
                :value="option.value"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </template>

        <!-- 范围滑块 -->
        <template v-else-if="filter.type === 'range'">
          <div class="range-inputs">
            <input
              v-model.number="filterValues[filter.key][0]"
              type="number"
              :placeholder="filter.minLabel || '最小值'"
              class="range-input"
            />
            <span class="range-separator">-</span>
            <input
              v-model.number="filterValues[filter.key][1]"
              type="number"
              :placeholder="filter.maxLabel || '最大值'"
              class="range-input"
            />
          </div>
        </template>

        <!-- 日期范围 -->
        <template v-else-if="filter.type === 'date'">
          <div class="date-inputs">
            <input
              v-model="filterValues[filter.key][0]"
              type="date"
              class="date-input"
            />
            <span class="date-separator">至</span>
            <input
              v-model="filterValues[filter.key][1]"
              type="date"
              class="date-input"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  // 标题
  title: {
    type: String,
    default: '筛选'
  },

  // 筛选器定义
  filters: {
    type: Array,
    default: () => []
  },

  // 默认折叠
  defaultCollapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change', 'clear'])

// 筛选值
const filterValues = reactive({})

// 初始化筛选值
props.filters.forEach((filter) => {
  if (filter.type === 'range' || filter.type === 'date') {
    filterValues[filter.key] = [null, null]
  } else if (filter.type === 'checkbox') {
    filterValues[filter.key] = []
  } else {
    filterValues[filter.key] = filter.defaultValue || ''
  }
})

// 折叠状态
const collapsed = reactive({ value: props.defaultCollapsed })

// 是否有激活的筛选
const hasActiveFilters = computed(() => {
  return props.filters.some((filter) => {
    const value = filterValues[filter.key]
    if (Array.isArray(value)) {
      return value.length > 0 && value.some((v) => v !== null && v !== '')
    }
    return value !== null && value !== ''
  })
})

// 监听筛选值变化
watch(filterValues, (newValues) => {
  emit('change', newValues)
}, { deep: true })

// 切换折叠
function toggle() {
  collapsed.value = !collapsed.value
}

// 清除筛选
function handleClear() {
  props.filters.forEach((filter) => {
    if (filter.type === 'range' || filter.type === 'date') {
      filterValues[filter.key] = [null, null]
    } else if (filter.type === 'checkbox') {
      filterValues[filter.key] = []
    } else {
      filterValues[filter.key] = filter.defaultValue || ''
    }
  })
  emit('clear')
}

// 暴露方法
defineExpose({
  clear: handleClear,
  getValues: () => ({ ...filterValues }),
  setValues: (values) => {
    Object.assign(filterValues, values)
  }
})
</script>

<style scoped>
.filter-panel {
  background: var(--color-bg-card);
  border: 1px solid var(--border-color-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* Header */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border-color-light);
}

.panel-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.panel-actions {
  display: flex;
  gap: var(--spacing-2);
}

.action-btn {
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

.action-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.action-btn.clear:hover {
  color: var(--color-error);
  border-color: var(--color-error);
}

.action-btn svg {
  width: 14px;
  height: 14px;
}

/* Body */
.panel-body {
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.filter-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

/* Inputs */
.filter-input,
.filter-select {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.filter-input:hover,
.filter-select:hover {
  border-color: var(--color-primary);
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  cursor: pointer;
}

/* Range */
.range-inputs,
.date-inputs {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.range-input,
.date-input {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
  font-size: var(--font-size-sm);
}

.range-separator,
.date-separator {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}
</style>
