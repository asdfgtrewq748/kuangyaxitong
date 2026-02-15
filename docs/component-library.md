# 组件库使用指南

本目录包含项目的共用组件库，基于优化方案开发。

## 已完成的组件 (P0)

### 数据展示组件

#### StatCard - 统计卡片
用于展示数值统计信息，支持趋势指示和多种状态。

**位置**: `library/data/StatCard.vue`

**基本用法**:
```vue
<script setup>
import { StatCard } from '@/components/library'
</script>

<template>
  <StatCard
    title="数据集行数"
    :value="12500"
    unit="行"
    :trend="12.5"
    trendLabel="较上周"
    icon="📊"
  />
</template>
```

**Props**:
- `title` (String, 必需): 标题
- `value` (Number|String): 数值
- `unit` (String): 单位
- `subtitle` (String): 副标题
- `icon` (String): 图标（emoji 或文本）
- `trend` (Number|String): 趋势（百分比）
- `trendLabel` (String): 趋势标签
- `loading` (Boolean): 加载状态
- `error` (String): 错误信息
- `size` (String): 尺寸 (`'sm' | 'md' | 'lg'`)
- `onClick` (Function): 点击回调

#### DataTable - 数据表格
功能丰富的数据表格，支持排序、分页、搜索、选择。

**位置**: `library/data/DataTable.vue`

**基本用法**:
```vue
<script setup>
import { ref } from 'vue'
import { DataTable } from '@/components/library'

const columns = [
  { key: 'name', title: '名称', sortable: true },
  { key: 'value', title: '数值', sortable: true },
  { key: 'status', title: '状态' }
]

const data = ref([
  { id: 1, name: '项目 A', value: 100, status: '进行中' },
  { id: 2, name: '项目 B', value: 200, status: '已完成' }
])
</script>

<template>
  <DataTable
    :columns="columns"
    :data="data"
    row-key="id"
    :selectable="true"
    :searchable="true"
    :paginated="true"
    :page-size="10"
    @row-click="handleRowClick"
  />
</template>
```

**Props**:
- `columns` (Array, 必需): 列定义
- `data` (Array): 数据
- `rowKey` (String): 行主键（默认 `'id'`）
- `selectable` (Boolean): 是否可选择
- `searchable` (Boolean): 是否可搜索
- `paginated` (Boolean): 是否分页
- `pageSize` (Number): 每页数量（默认 `10`）
- `loading` (Boolean): 加载状态

**事件**:
- `@row-click`: 行点击事件
- `@selection-change`: 选择变化事件
- `@sort-change`: 排序变化事件

### 控制组件

#### Toolbar - 工具栏
页面或组件的工具栏，包含标题和操作按钮。

**位置**: `library/controls/Toolbar.vue`

**基本用法**:
```vue
<Toolbar
  title="数据集管理"
  description="管理和配置所有数据集"
>
  <template #right>
    <button @click="handleAdd">添加</button>
    <button @click="handleExport">导出</button>
  </template>
</Toolbar>
```

**Props**:
- `title` (String): 标题
- `description` (String): 描述
- `size` (String): 尺寸 (`'sm' | 'md' | 'lg'`)
- `bordered` (Boolean): 是否显示底部边框

### 反馈组件

#### LoadingState - 加载状态
展示加载、空状态、错误状态。

**位置**: `library/feedback/LoadingState.vue`

**基本用法**:
```vue
<!-- 加载状态 -->
<LoadingState type="loading" message="正在加载数据..." />

<!-- 空状态 -->
<LoadingState
  type="empty"
  title="暂无数据"
  message="请先创建数据集"
>
  <template #actions>
    <button @click="handleCreate">创建数据集</button>
  </template>
</LoadingState>

<!-- 错误状态 -->
<LoadingState
  type="error"
  title="加载失败"
  message="网络连接失败，请检查网络设置"
  @retry="handleRetry"
/>
```

**Props**:
- `type` (String, 必需): 类型 (`'loading' | 'empty' | 'error' | 'success'`)
- `title` (String): 标题
- `message` (String): 消息
- `showRetry` (Boolean): 是否显示重试按钮（仅 error）
- `fullScreen` (Boolean): 是否全屏显示

### 布局组件

#### SidePanel - 侧边面板
可折叠的侧边面板，用于显示控制项。

**位置**: `library/layout/SidePanel.vue`

**基本用法**:
```vue
<script setup>
import { ref } from 'vue'
import { SidePanel } from '@/components/library'

const panelRef = ref()

function collapse() {
  panelRef.value?.collapse()
}
</script>

<template>
  <SidePanel
    ref="panelRef"
    title="控制面板"
    position="left"
    :width="320"
    :default-collapsed="false"
  >
    <div>面板内容</div>

    <template #footer>
      <button @click="collapse">收起</button>
    </template>
  </SidePanel>
</template>
```

**Props**:
- `position` (String): 位置 (`'left' | 'right'`)
- `title` (String): 标题
- `description` (String): 描述
- `width` (Number|String): 宽度（默认 `320`）
- `collapsedWidth` (Number|String): 折叠后宽度
- `floating` (Boolean): 是否浮动
- `defaultCollapsed` (Boolean): 默认是否折叠
- `showToggle` (Boolean): 是否显示切换按钮

**方法**:
- `expand()`: 展开面板
- `collapse()`: 折叠面板
- `toggle()`: 切换面板

## 设计规范

### Props 规范

所有组件遵循统一的 Props 规范：

```javascript
{
  // 数据
  data: Array,
  items: Array,
  value: [String, Number],

  // 状态
  loading: Boolean,
  disabled: Boolean,
  error: String,

  // 尺寸
  size: {
    type: String,
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v)
  },

  // 样式
  class: [String, Object, Array],
  style: [String, Object]
}
```

### 事件规范

所有组件遵循统一的事件命名：

```javascript
// 更新类事件（v-model）
emit('update:modelValue', value)

// 动作类事件
emit('click', event)
emit('change', value)

// 状态类事件
emit('loading', isLoading)
emit('error', error)
```

### 插槽规范

所有组件使用具名插槽，提供扩展性：

```vue
<template>
  <div class="component">
    <!-- 头部插槽 -->
    <div v-if="$slots.header">
      <slot name="header"></slot>
    </div>

    <!-- 默认插槽 -->
    <slot></slot>

    <!-- 底部插槽 -->
    <div v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```

## 使用建议

1. **优先使用库组件**: 开发新页面时，优先使用库组件，保持一致性
2. **遵循设计 Token**: 使用 CSS 变量，而不是硬编码颜色和间距
3. **保持简洁**: 不要过度封装，简单页面可以直接使用原生元素
4. **按需引入**: 只导入需要使用的组件

## 后续计划

**P1 组件（重要）**:
- FilterPanel - 筛选面板
- PlaybackBar - 播放控制
- ChartContainer - 图表容器
- ColorLegend - 颜色图例

**P2 组件（可选）**:
- VirtualList - 虚拟列表
- SplitPane - 分屏组件
- AnnotationTool - 标注工具

## 问题反馈

如有问题或建议，请联系开发团队。
