# 设计系统文档

**版本**: v1.0
**最后更新**: 2026-02-15
**目标**: 为地质建模系统提供统一的设计语言和组件规范

---

## 目录

1. [快速开始](#快速开始)
2. [设计 Tokens](#设计-tokens)
3. [组件库](#组件库)
4. [状态管理](#状态管理)
5. [路由与导航](#路由与导航)
6. [最佳实践](#最佳实践)

---

## 快速开始

### 使用设计 Token

在组件中通过 CSS 变量使用设计 Token：

```vue
<template>
  <div class="my-component">
    <h1>标题</h1>
    <button>按钮</button>
  </div>
</template>

<style scoped>
.my-component {
  padding: var(--spacing-lg);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
}

h1 {
  color: var(--color-text-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

button {
  background: var(--gradient-primary);
  padding: var(--spacing-3) var(--spacing-5);
  border-radius: var(--radius-md);
  color: var(--color-text-inverse);
  transition: var(--transition-btn);
}
</style>
```

### 使用 Stores

```vue
<script setup>
import { useAppStore, useDataStore, useUIStore } from '@/stores'

const appStore = useAppStore()
const dataStore = useDataStore()
const uiStore = useUIStore()

// 使用数据
console.log(dataStore.currentSeam)

// 调用 actions
dataStore.setCurrentSeam('seam-A')
uiStore.showSuccess('煤层已切换')
</script>
```

---

## 设计 Tokens

设计 Token 定义了整个应用的设计变量，位于 `src/styles/design-tokens.css`。

### 色彩系统

#### 主色调
```css
--color-primary: #0f766e;        /* 主色 */
--color-primary-hover: #0d5f59;  /* 悬停 */
--color-primary-active: #0a4c47; /* 激活 */
--color-primary-light: #ccfbf1;  /* 浅色背景 */
```

#### 语义色
```css
/* 成功 */
--color-success: #22c55e;
--color-success-bg: #dcfce7;

/* 警告 */
--color-warning: #f59e0b;
--color-warning-bg: #ffedd5;

/* 错误 */
--color-error: #dc2626;
--color-error-bg: #fee2e2;

/* 信息 */
--color-info: #0e7490;
--color-info-bg: #cffafe;
```

#### 风险等级色（用于热力图）
```css
--color-risk-low: #0e7490;         /* 低风险 */
--color-risk-medium-low: #14b8a6;  /* 中低风险 */
--color-risk-medium: #facc15;      /* 中风险 */
--color-risk-medium-high: #fb923c; /* 中高风险 */
--color-risk-high: #dc2626;        /* 高风险 */
```

#### 渐变色
```css
--gradient-primary: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
--gradient-card: linear-gradient(145deg, #ffffff 0%, #eef7f5 52%, #fdf8f1 100%);
--gradient-heatmap: linear-gradient(90deg, #0e7490, #14b8a6, #84cc16, #facc15, #fb923c, #dc2626);
```

### 间距系统

基于 **8px** 单位，使用倍数关系：

```css
--spacing-1: 4px;    /* 0.5x */
--spacing-2: 8px;    /* 1x */
--spacing-3: 12px;   /* 1.5x */
--spacing-4: 16px;   /* 2x */
--spacing-5: 20px;   /* 2.5x */
--spacing-6: 24px;   /* 3x */
--spacing-8: 32px;   /* 4x */
```

**使用建议**：
- 组件内边距：`var(--spacing-4)` 或 `var(--spacing-5)`
- 卡片间距：`var(--spacing-5)` 或 `var(--spacing-6)`
- 区域间距：`var(--spacing-8)` 或更大

### 字体系统

```css
/* 字体族 */
--font-family-base: "PingFang SC", "Microsoft YaHei", sans-serif;
--font-family-mono: "JetBrains Mono", "Consolas", monospace;

/* 字体大小 */
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
--font-size-2xl: 1.5rem;   /* 24px */

/* 字重 */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 圆角

```css
--radius-sm: 4px;    /* 小元素 */
--radius-md: 8px;    /* 按钮、输入框 */
--radius-lg: 12px;   /* 卡片 */
--radius-xl: 16px;   /* 大卡片 */
--radius-full: 9999px; /* 圆形 */
```

### 阴影

```css
--shadow-sm: 0 1px 3px rgba(15, 118, 110, 0.08);
--shadow-md: 0 4px 12px rgba(15, 118, 110, 0.1);
--shadow-lg: 0 10px 24px rgba(15, 118, 110, 0.12);
--shadow-glow: 0 0 20px rgba(14, 116, 144, 0.3);
```

### 过渡动画

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;

--easing-default: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 组件库

组件库位于 `src/components/library/`，按功能分类：

### 目录结构

```
library/
├── data/              # 数据展示
│   ├── StatCard.vue   # 统计卡片
│   └── DataTable.vue  # 数据表格
├── controls/          # 控制组件
│   ├── Toolbar.vue    # 工具栏
│   └── PlaybackBar.vue # 播放控制
├── forms/             # 表单组件
│   ├── FormGrid.vue   # 表单布局
│   └── InputGroup.vue # 输入框组
└── feedback/          # 反馈组件
    ├── LoadingState.vue # 加载状态
    └── Toast.vue       # 消息提示
```

### 组件开发规范

#### 1. 命名规范

- **文件名**：PascalCase，如 `StatCard.vue`
- **组件名**：多词组合，描述功能，如 `StatCard`, `DataTable`, `HeatmapWebGL`

#### 2. Props 规范

```vue
<script setup>
defineProps({
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
    validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v),
    default: 'md'
  },

  // 样式
  class: [String, Object, Array],
  style: [String, Object]
})
</script>
```

#### 3. 事件规范

```vue
<script setup>
const emit = defineEmits([
  'update:modelValue',  // v-model
  'change',
  'submit',
  'click'
])

// 触发事件
emit('change', newValue)
</script>
```

#### 4. 插槽规范

```vue
<template>
  <div class="component">
    <header v-if="$slots.header">
      <slot name="header"></slot>
    </header>

    <div class="content">
      <slot></slot> <!-- 默认插槽 -->
    </div>

    <footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

### 示例：StatCard 组件

```vue
<template>
  <div class="stat-card" :class="[`size-${size}`, { loading, error }]">
    <!-- 标题 -->
    <div class="stat-header">
      <slot name="icon">
        <span class="stat-icon">{{ icon }}</span>
      </slot>
      <h3 class="stat-title">{{ title }}</h3>
    </div>

    <!-- 数值 -->
    <div class="stat-value">
      <span v-if="loading" class="spinner"></span>
      <template v-else>
        <span class="value">{{ formattedValue }}</span>
        <span v-if="unit" class="unit">{{ unit }}</span>
      </template>
    </div>

    <!-- 趋势 -->
    <div v-if="trend && !loading" class="stat-trend" :class="trendClass">
      {{ trendIcon }} {{ trend }}
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="stat-error">{{ error }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [Number, String],
  unit: String,
  icon: String,
  trend: [Number, String], // 趋势百分比，如 "+12.5%"
  loading: Boolean,
  error: String,
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

const trendClass = computed(() => {
  if (!props.trend) return ''
  const isPositive = String(props.trend).startsWith('+')
  return isPositive ? 'up' : 'down'
})

const trendIcon = computed(() => {
  if (!props.trend) return ''
  return trendClass.value === 'up' ? '↑' : '↓'
})
</script>

<style scoped>
.stat-card {
  padding: var(--spacing-4);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color-light);
  transition: var(--transition-card);
}

.stat-card.size-sm {
  padding: var(--spacing-3);
}

.stat-card.size-lg {
  padding: var(--spacing-6);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
}

.stat-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-1);
}

.stat-value .value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
}

.stat-value .unit {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.stat-trend {
  margin-top: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.stat-trend.up {
  color: var(--color-success);
}

.stat-trend.down {
  color: var(--color-error);
}

.stat-error {
  margin-top: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-error);
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

---

## 状态管理

使用 Pinia 管理应用状态。

### Stores 结构

```
stores/
├── useAppStore.js      # 全局应用状态
├── useDataStore.js     # 数据状态（煤层、任务、实验）
├── useUIStore.js       # UI 状态
└── useCacheStore.js    # 缓存管理
```

### useAppStore - 全局应用状态

```javascript
import { useAppStore } from '@/stores'

const appStore = useAppStore()

// 主题
appStore.theme        // 'light' | 'dark'
appStore.setTheme('dark')
appStore.toggleTheme()

// 用户
appStore.user         // 用户信息
appStore.setUser(userData)
appStore.logout()

// 全局加载
appStore.globalLoading
appStore.setGlobalLoading(true)
```

### useDataStore - 数据状态

```javascript
import { useDataStore } from '@/stores'

const dataStore = useDataStore()

// 当前选择
dataStore.currentSeam        // 当前煤层 ID
dataStore.currentJobId       // 当前任务 ID
dataStore.currentExperimentId // 当前实验 ID

// 设置值
dataStore.setCurrentSeam('seam-A')
dataStore.setCurrentJob('job-123')

// 加载数据
await dataStore.loadSeams()
await dataStore.loadJobs('seam-A')

// 缓存
dataStore.cacheSeamData('seam-A', data)
dataStore.currentSeamData // 获取缓存的煤层数据

// URL 同步
dataStore.syncToUrl()  // 同步状态到 URL
dataStore.loadFromUrl(params)  // 从 URL 加载状态
```

### useUIStore - UI 状态

```javascript
import { useUIStore } from '@/stores'

const uiStore = useUIStore()

// 侧边栏
uiStore.sidebarCollapsed
uiStore.toggleSidebar()
uiStore.setSidebarCollapsed(true)

// 控制面板
uiStore.controlPanelVisible
uiStore.toggleControlPanel()

// Modal
uiStore.showModal('modal-id', { prop: value })
uiStore.hideModal()

// Toast
uiStore.showSuccess('操作成功')
uiStore.showError('操作失败')
uiStore.showWarning('警告信息')
uiStore.showToast('普通消息')

// 加载状态
uiStore.showLoading()
uiStore.hideLoading()
```

### useCacheStore - 缓存管理

```javascript
import { useCacheStore } from '@/stores'

const cacheStore = useCacheStore()

// 设置缓存（5分钟TTL）
cacheStore.set('key', value)

// 获取缓存
const value = cacheStore.get('key')

// 检查是否存在
if (cacheStore.has('key')) {
  // ...
}

// 清理
cacheStore.delete('key')
cacheStore.clear()

// 定期清理（每分钟）
const cleanupTimer = cacheStore.startCleanup(60000)
```

---

## 路由与导航

### URL 状态同步

应用支持通过 URL 参数同步状态，便于分享和书签。

#### 支持的 URL 参数

```
?seam=seam-A          # 煤层 ID
&job=job-123          # 地质模型任务 ID
&exp=exp-456          # 实验 ID
```

#### 示例

```
/mpi-heatmap-pro?seam=seam-A&job=job-123
/research-workbench?exp=exp-456
```

### 路由配置示例

```javascript
{
  path: '/mpi-heatmap-pro',
  name: 'MpiHeatmapPro',
  component: () => import('../views/MpiHeatmapPro.vue'),
  meta: {
    title: 'MPI 数值模拟',
    icon: 'bolt',
    navOrder: 40
  }
}
```

### 页面元数据

```javascript
meta: {
  title: '页面标题',           // 显示在导航栏
  icon: 'bolt',                // 图标名称
  navOrder: 40,                // 导航顺序
  nav: true,                   // 是否显示在主导航（默认 true）
  workflow: false              // 是否显示工作流程条（默认 true）
}
```

### 导航守卫

路由系统会自动同步 URL 参数到全局状态：

```javascript
// 用户访问 /mpi-heatmap-pro?seam=seam-A
// 自动执行 dataStore.setCurrentSeam('seam-A')
```

---

## 最佳实践

### 1. 组件开发

#### ✅ 推荐

```vue
<script setup>
import { ref, computed } from 'vue'
import { useDataStore } from '@/stores'

const dataStore = useDataStore()

// 响应式数据
const count = ref(0)

// 计算属性
const double = computed(() => count.value * 2)

// 使用 store
const seam = computed(() => dataStore.currentSeam)
</script>

<style scoped>
/* 使用设计 Token */
.button {
  padding: var(--spacing-3) var(--spacing-5);
  background: var(--color-primary);
  border-radius: var(--radius-md);
  transition: var(--transition-btn);
}
</style>
```

#### ❌ 不推荐

```vue
<style scoped>
/* 避免硬编码 */
.button {
  padding: 12px 20px;  /* ❌ 应使用 var(--spacing-3) */
  background: #0f766e; /* ❌ 应使用 var(--color-primary) */
  border-radius: 8px;  /* ❌ 应使用 var(--radius-md) */
}
</style>
```

### 2. 状态管理

#### ✅ 推荐

```javascript
// 使用专门的 store
const dataStore = useDataStore()
dataStore.setCurrentSeam('seam-A')

// 使用响应式 computed
const seam = computed(() => dataStore.currentSeam)
```

#### ❌ 不推荐

```javascript
// 避免直接修改 localStorage
localStorage.setItem('seam', 'seam-A') // ❌

// 避免创建全局变量
window.currentSeam = 'seam-A' // ❌
```

### 3. 性能优化

#### 使用缓存

```javascript
import { useCacheStore } from '@/stores'

const cacheStore = useCacheStore()

// 检查缓存
let data = cacheStore.get('expensive-data')

if (!data) {
  // 执行昂贵计算
  data = await performExpensiveCalculation()
  // 缓存结果
  cacheStore.set('expensive-data', data)
}
```

#### 懒加载组件

```javascript
// 路由懒加载（已配置）
component: () => import('../views/HeavyComponent.vue')

// 组件内懒加载
const HeavyChart = defineAsyncComponent(() =>
  import('./HeavyChart.vue')
)
```

### 4. 错误处理

#### ✅ 推荐

```javascript
try {
  const data = await apiCall()
  uiStore.showSuccess('数据加载成功')
} catch (error) {
  console.error('加载失败:', error)
  uiStore.showError(error.message || '操作失败，请重试')
}
```

### 5. 类型安全（如果使用 TypeScript）

```typescript
import { useDataStore } from '@/stores'

interface DataStore {
  currentSeam: string
  currentJobId: string
  setCurrentSeam(seamId: string): void
}

const dataStore: DataStore = useDataStore()
dataStore.setCurrentSeam('seam-A') // 类型安全
```

---

## 常见问题

### Q: 如何添加新的设计 Token？

A: 编辑 `src/styles/design-tokens.css`，添加新的 CSS 变量：

```css
:root {
  --my-new-color: #123456;
  --my-new-spacing: 28px;
}
```

### Q: 如何创建可复用组件？

A: 在 `src/components/library/` 对应分类下创建组件，参考 [组件开发规范](#组件开发规范)。

### Q: 如何在组件间共享状态？

A: 使用 Pinia stores：

```javascript
// 组件 A
import { useDataStore } from '@/stores'
const dataStore = useDataStore()
dataStore.setCurrentSeam('seam-A')

// 组件 B
import { useDataStore } from '@/stores'
const dataStore = useDataStore()
console.log(dataStore.currentSeam) // 'seam-A'
```

### Q: 如何调试状态？

A: 使用 Vue DevTools Pinia 插件，或在代码中打印：

```javascript
console.log('App Store:', useAppStore())
console.log('Data Store:', useDataStore())
console.log('UI Store:', useUIStore())
```

---

## 更新日志

### v1.0 (2026-02-15)
- 初始版本
- 建立设计 Token 系统
- 创建 Pinia stores
- 添加路由 URL 同步
- 编写组件开发规范

---

## 联系方式

如有问题或建议，请联系开发团队。
