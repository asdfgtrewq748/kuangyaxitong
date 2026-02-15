<!--
  DataTable - 数据表格组件

  功能丰富的数据表格，支持：
  - 排序
  - 分页
  - 筛选
  - 选择
  - 自定义列渲染
  - 加载状态
  - 空状态
-->

<template>
  <div class="data-table" :class="{ compact, borderless }">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <!-- 搜索框 -->
      <div v-if="searchable" class="table-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="table-actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- 表格容器 -->
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <!-- 选择列 -->
            <th v-if="selectable" class="table-select">
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate="someSelected"
                @change="toggleAll"
              />
            </th>

            <!-- 数据列 -->
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'table-header',
                column.align ? `align-${column.align}` : '',
                { sortable: column.sortable }
              ]"
              :style="{ width: column.width }"
              @click="column.sortable && handleSort(column.key)"
            >
              <div class="header-content">
                <span>{{ column.title }}</span>
                <span v-if="column.sortable" class="sort-icon">
                  <template v-if="sortKey === column.key">
                    <svg v-if="sortOrder === 'asc'" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 22 22 2 22"/>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="22 12 2 22 12 2"/>
                    </svg>
                  </template>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 22 22 2 22"/>
                  </svg>
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- 加载状态 -->
          <tr v-if="loading">
            <td :colspan="columns.length + (selectable ? 1 : 0)">
              <div class="table-loading">
                <div class="spinner"></div>
                <span>加载中...</span>
              </div>
            </td>
          </tr>

          <!-- 空状态 -->
          <tr v-else-if="displayData.length === 0">
            <td :colspan="columns.length + (selectable ? 1 : 0)">
              <div class="table-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                </svg>
                <p>{{ emptyText }}</p>
              </div>
            </td>
          </tr>

          <!-- 数据行 -->
          <tr
            v-for="(row, index) in displayData"
            :key="row[rowKey] || index"
            :class="[
              'table-row',
              { selected: isRowSelected(row) },
              rowClass ? rowClass(row, index) : ''
            ]"
            @click="handleRowClick(row, index)"
          >
            <!-- 选择列 -->
            <td v-if="selectable" class="table-select" @click.stop>
              <input
                type="checkbox"
                :checked="isRowSelected(row)"
                @change="toggleRow(row)"
              />
            </td>

            <!-- 数据列 -->
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                'table-cell',
                column.align ? `align-${column.align}` : ''
              ]"
            >
              <!-- 自定义渲染 -->
              <slot
                v-if="$slots[`cell-${column.key}`]"
                :name="`cell-${column.key}`"
                :row="row"
                :value="row[column.key]"
                :index="index"
              >
                {{ row[column.key] }}
              </slot>

              <!-- 默认渲染 -->
              <template v-else>
                {{ formatCellValue(row[column.key], column) }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div v-if="paginated && totalPages > 1" class="table-pagination">
      <div class="pagination-info">
        显示 {{ startIndex + 1 }}-{{ endIndex }} / 共 {{ filteredData.length }} 条
      </div>

      <div class="pagination-controls">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="currentPage = 1"
        >
          首页
        </button>

        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          上一页
        </button>

        <span class="pagination-pages">
          第 {{ currentPage }} / {{ totalPages }} 页
        </span>

        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          下一页
        </button>

        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage = totalPages"
        >
          末页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  // 列定义
  columns: {
    type: Array,
    required: true
  },

  // 数据
  data: {
    type: Array,
    default: () => []
  },

  // 行主键
  rowKey: {
    type: String,
    default: 'id'
  },

  // 是否可选择
  selectable: {
    type: Boolean,
    default: false
  },

  // 是否可搜索
  searchable: {
    type: Boolean,
    default: false
  },

  // 搜索占位符
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },

  // 是否分页
  paginated: {
    type: Boolean,
    default: false
  },

  // 每页数量
  pageSize: {
    type: Number,
    default: 10
  },

  // 是否显示工具栏
  showToolbar: {
    type: Boolean,
    default: true
  },

  // 是否紧凑模式
  compact: {
    type: Boolean,
    default: false
  },

  // 是否无边框
  borderless: {
    type: Boolean,
    default: false
  },

  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },

  // 空状态文本
  emptyText: {
    type: String,
    default: '暂无数据'
  },

  // 行类名函数
  rowClass: Function
})

const emit = defineEmits(['row-click', 'selection-change', 'sort-change'])

// 搜索
const searchQuery = ref('')

// 排序
const sortKey = ref(null)
const sortOrder = ref('asc') // 'asc' | 'desc'

// 分页
const currentPage = ref(1)

// 选择
const selectedRows = ref(new Set())

// 过滤后的数据
const filteredData = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.data
  }

  const query = searchQuery.value.toLowerCase()
  return props.data.filter((row) => {
    return props.columns.some((column) => {
      const value = row[column.key]
      if (value == null) return false
      return String(value).toLowerCase().includes(query)
    })
  })
})

// 排序后的数据
const sortedData = computed(() => {
  if (!sortKey.value) {
    return filteredData.value
  }

  const column = props.columns.find((col) => col.key === sortKey.value)
  const data = [...filteredData.value]

  data.sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]

    // 自定义排序函数
    if (column?.sortFunction) {
      return column.sortFunction(aVal, bVal, sortOrder.value)
    }

    // 默认排序
    if (aVal === bVal) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1

    let result = 0
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      result = aVal - bVal
    } else {
      result = String(aVal).localeCompare(String(bVal))
    }

    return sortOrder.value === 'asc' ? result : -result
  })

  return data
})

// 分页后的数据
const displayData = computed(() => {
  if (!props.paginated) {
    return sortedData.value
  }

  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return sortedData.value.slice(start, end)
})

// 分页信息
const totalPages = computed(() => {
  if (!props.paginated) return 1
  return Math.ceil(filteredData.value.length / props.pageSize)
})

const startIndex = computed(() => {
  if (!props.paginated) return 0
  return (currentPage.value - 1) * props.pageSize
})

const endIndex = computed(() => {
  if (!props.paginated) return filteredData.value.length
  return Math.min(startIndex.value + props.pageSize, filteredData.value.length)
})

// 选择相关
const allSelected = computed(() => {
  return filteredData.value.length > 0 &&
    selectedRows.value.size === filteredData.value.length
})

const someSelected = computed(() => {
  return selectedRows.value.size > 0 && !allSelected.value
})

function isRowSelected(row) {
  const keyValue = row[props.rowKey]
  return selectedRows.value.has(keyValue)
}

function toggleRow(row) {
  const keyValue = row[props.rowKey]
  if (selectedRows.value.has(keyValue)) {
    selectedRows.value.delete(keyValue)
  } else {
    selectedRows.value.add(keyValue)
  }
  emit('selection-change', getSelectedRows())
}

function toggleAll() {
  if (allSelected.value) {
    selectedRows.value.clear()
  } else {
    filteredData.value.forEach((row) => {
      selectedRows.value.add(row[props.rowKey])
    })
  }
  emit('selection-change', getSelectedRows())
}

function getSelectedRows() {
  return filteredData.value.filter((row) =>
    selectedRows.value.has(row[props.rowKey])
  )
}

// 排序处理
function handleSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  emit('sort-change', { key, order: sortOrder.value })
}

// 行点击处理
function handleRowClick(row, index) {
  emit('row-click', row, index)
}

// 格式化单元格值
function formatCellValue(value, column) {
  if (value == null) return '-'

  if (column.formatter) {
    return column.formatter(value)
  }

  return value
}

// 监听数据变化，重置分页
watch(() => props.data, () => {
  currentPage.value = 1
})

// 监听搜索，重置分页
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.data-table {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.data-table.borderless {
  border: none;
}

/* Toolbar */
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border-color-light);
}

.table-search {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--color-bg-page);
  flex: 1;
  max-width: 400px;
}

.table-search svg {
  width: 16px;
  height: 16px;
  color: var(--color-text-tertiary);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--font-size-sm);
}

.table-actions {
  display: flex;
  gap: var(--spacing-2);
}

/* Table */
.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.table th,
.table td {
  padding: var(--spacing-3) var(--spacing-4);
  text-align: left;
  border-bottom: 1px solid var(--border-color-light);
}

.data-table.compact .table th,
.data-table.compact .table td {
  padding: var(--spacing-2) var(--spacing-3);
}

/* Header */
.table-header {
  background: var(--color-bg-secondary);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  user-select: none;
}

.table-header.sortable {
  cursor: pointer;
}

.table-header.sortable:hover {
  background: var(--color-bg-hover);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.sort-icon {
  display: flex;
  align-items: center;
  color: var(--color-text-tertiary);
}

.sort-icon svg {
  width: 12px;
  height: 12px;
}

/* Alignment */
.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.align-right {
  text-align: right;
}

/* Row */
.table-row {
  transition: background var(--transition-fast);
}

.table-row:hover {
  background: var(--color-bg-hover);
}

.table-row.selected {
  background: var(--color-primary-light);
}

/* Checkbox */
.table-select {
  width: 40px;
  text-align: center;
}

.table-select input[type="checkbox"] {
  cursor: pointer;
}

/* States */
.table-loading,
.table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  padding: var(--spacing-8);
  color: var(--color-text-secondary);
}

.table-loading svg,
.table-empty svg {
  width: 48px;
  height: 48px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Pagination */
.table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-4);
  border-top: 1px solid var(--border-color-light);
}

.pagination-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.pagination-btn {
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .table-pagination {
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
