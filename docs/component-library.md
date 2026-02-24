# 组件库使用说明（Week5）

## 当前范围

本组件库位于 `frontend/src/components/library/`，用于统一页面结构、交互行为和状态样式。

当前 P0 组件已完成 4 个：

1. `DataTable`（数据表格）
2. `ChartContainer`（图表容器）
3. `ConfirmDialog`（确认对话框）
4. `FormPanel`（通用表单面板）

## 组件清单

### DataTable

- 文件：`frontend/src/components/library/data/DataTable.vue`
- 导出：`import { DataTable } from '@/components/library'`
- 场景：排序、搜索、分页、行选择

最小示例：

```vue
<script setup>
import { DataTable } from '@/components/library'

const columns = [
  { key: 'name', title: '名称', sortable: true },
  { key: 'value', title: '数值', sortable: true }
]

const rows = [
  { id: 1, name: 'A', value: 10 },
  { id: 2, name: 'B', value: 20 }
]
</script>

<template>
  <DataTable :columns="columns" :data="rows" row-key="id" :searchable="true" :paginated="true" />
</template>
```

### ChartContainer

- 文件：`frontend/src/components/library/visualization/ChartContainer.vue`
- 导出：`import { ChartContainer } from '@/components/library'`
- 场景：统一图表标题、空状态、错误态、加载态

最小示例：

```vue
<ChartContainer title="MPI 分布" :loading="loading" :error="error" :empty="!points.length">
  <YourChart :data="points" />
</ChartContainer>
```

### ConfirmDialog

- 文件：`frontend/src/components/library/feedback/ConfirmDialog.vue`
- 导出：`import { ConfirmDialog } from '@/components/library'`
- 场景：删除、清空、覆盖等高风险操作确认

核心 props：

1. `v-model`：开关状态（`modelValue`）
2. `title`：标题
3. `message`：提示文本
4. `confirm-text` / `cancel-text`：按钮文案
5. `variant`：`danger | warning | primary`
6. `confirm-loading`：确认按钮加载态

核心事件：

1. `@confirm`
2. `@cancel`

最小示例：

```vue
<script setup>
import { ref } from 'vue'
import { ConfirmDialog } from '@/components/library'

const visible = ref(false)
const clearAll = () => {
  // do clear
}
</script>

<template>
  <button @click="visible = true">清空</button>
  <ConfirmDialog
    v-model="visible"
    title="确认清空"
    message="此操作不可恢复，是否继续？"
    confirm-text="确认"
    cancel-text="取消"
    variant="danger"
    @confirm="clearAll"
  />
</template>
```

### FormPanel

- 文件：`frontend/src/components/library/layout/FormPanel.vue`
- 导出：`import { FormPanel } from '@/components/library'`
- 场景：统一表单头部、提交动作、提交加载状态

核心 props：

1. `title` / `description`
2. `auto-grid`（默认 `true`）
3. `columns`（默认 `2`）
4. `submit-text` / `submit-loading-text`
5. `submit-disabled` / `submit-loading`
6. `show-actions` / `show-cancel`

核心事件：

1. `@submit`
2. `@cancel`

最小示例：

```vue
<FormPanel
  title="参数配置"
  description="设置实验运行参数"
  :submit-loading="saving"
  :submit-disabled="saving"
  submit-text="保存"
  @submit="handleSave"
>
  <label class="full">
    <span>name</span>
    <input v-model="form.name" class="input" />
  </label>
</FormPanel>
```

## 已接入页面

1. `frontend/src/views/GeomodelVisualization.vue`：`DataTable`
2. `frontend/src/views/ResearchWorkbench.vue`：`DataTable`
3. `frontend/src/views/DataImport.vue`：`ConfirmDialog` + `FormPanel`

## 后续建议

1. 为 `ConfirmDialog` 增加焦点陷阱和可访问性测试。
2. 为 `FormPanel` 增加 `v-model` 表单校验适配（如 Element Plus 表单）。
3. 补一组组件级单元测试，重点覆盖事件和状态切换。
