# 前端代码全面分析报告

> 生成时间：2025 年 7 月  
> 范围：`frontend/src/` 全部 `.vue`、`.js`、`.css` 文件

---

## 目录

0. [当前执行进度（2026-02-28）](#0-当前执行进度2026-02-28)
1. [项目概览](#1-项目概览)
2. [语言问题（中英文混用）](#2-语言问题中英文混用)
3. [颜色体系与配色问题](#3-颜色体系与配色问题)
4. [布局与样式架构](#4-布局与样式架构)
5. [UI/UX 问题](#5-uiux-问题)
6. [组件质量与架构](#6-组件质量与架构)
7. [第三方依赖分析](#7-第三方依赖分析)
8. [可访问性（Accessibility）问题](#8-可访问性accessibility问题)
9. [响应式设计](#9-响应式设计)
10. [严重 BUG 清单](#10-严重-bug-清单)
11. [优化建议汇总](#11-优化建议汇总)

---

## 0. 当前执行进度（2026-02-28）

| 任务 | 状态 | 备注 |
|---|---|---|
| T20 全局空状态组件 | 部分完成 | 已新增组件并在 `ResearchPortal.vue` 接入，其他页面待覆盖 |
| T21 骨架屏 Loading | 部分完成 | 已新增组件并在部分页面接入，全站慢网场景待验收 |
| T22 AiSearchBar 事件泄漏 | 已完成 | 事件监听已成对清理 |
| T23 LRU 缓存限制 | 已完成 | 多处缓存已切换为 LRU 并设置容量上限 |
| T24 路由级代码分割 | 已完成 | 路由 chunk 命名与手动分包生效 |
| T25 大型图表懒加载 | 已完成 | `AcademicAlgorithm` 已异步拆分加载 |
| T26 虚拟列表阈值调优 | 已完成 | 启用阈值已调为 `>= 50` |
| T27 响应式断点补全 | 部分完成 | 关键页面断点已补，需继续做全页面五断点走查 |
| T28 键盘导航与 ARIA | 部分完成 | 核心组件已增强，`axe-core` 扫描待补 |
| T29 触控手势支持 | 已完成 | 核心画布已支持拖拽、缩放及防滚动冲突 |

---

## 1. 项目概览

| 维度 | 详情 |
|---|---|
| 框架 | Vue 3.4.34 + Composition API (`<script setup>`) |
| 状态管理 | Pinia 3.0.4（4 个 store） |
| 路由 | Vue Router 4.6.4（12 条路由，全部懒加载） |
| 构建工具 | Vite 5.4.2 |
| UI 框架 | **无**（纯手写 CSS，无 Tailwind / Element UI / Vuetify） |
| 可视化 | d3、ECharts 6.0、Three.js 0.182 |
| 其他依赖 | axios、KaTeX、JSZip |
| 语言标记 | `<html lang="zh-CN">`，项目名 `mining-pressure-frontend` |

### 文件清单

| 类型 | 数量 | 说明 |
|---|---|---|
| 视图（Views） | 16 | 最大文件 AcademicAlgorithm.vue = 3715 行 |
| 组件（Components） | 43 | 含 library/、simulation/、validation/ 子目录 |
| 组合式函数（Composables） | 9 | useToast、useViewport、useParticles 等 |
| Store | 4 | useAppStore、useDataStore、useUIStore、useCacheStore |
| 全局样式 | 2 | style.css (689行)、design-tokens.css (312行) |
| API 层 | 1 | api.js (369行，含自定义 LRU 缓存) |

---

## 2. 语言问题（中英文混用）

### 2.1 乱码（Mojibake）— 🔴 严重

`AppLayout.vue` 中存在大量 **UTF-8 编码错误**（GB2312/GBK 被错误解码为 UTF-8），导致 `title` 和 `aria-label` 属性显示乱码：

| 行号 | 乱码文本 | 推测本意 |
|---|---|---|
| `layouts/AppLayout.vue` L30 | `娴佺▼杩涘害` | "流程进度" |
| `layouts/AppLayout.vue` L36-37 | `褰撳墠鐓ゅ眰` | "当前煤层" |
| `layouts/AppLayout.vue` L46-47 | `鍓嶅線` | "前往" |
| `layouts/AppLayout.vue` L54 | `鍓嶅線鎺ㄨ崘姝ラ` | "前往推荐步骤" |
| `layouts/AppLayout.vue` L59-60 | `閲嶇疆娴佺▼` | "重置流程" |
| `layouts/AppLayout.vue` L67 | `閲嶇疆娴佺▼` | "重置流程" |
| `layouts/AppLayout.vue` L83-84 | `姝ラ ${index + 1}` | "步骤 ${index + 1}" |
| `layouts/AppLayout.vue` L108-109 | `鍓嶅線鍓嶇疆姝ラ` | "前往前置步骤" |

**影响**：用户在 tooltip 和屏幕阅读器中看到的全是乱码。

### 2.2 完全英文的页面 — ⚠️ 不一致

以下页面 UI 文本几乎 **全部为英文**，与其余中文页面风格割裂：

| 文件 | 英文示例 |
|---|---|
| `views/GeoMpiStudio.vue` | "Geology and MPI Spatial Studio"、"Control Panel"、"Run Spatial Analysis"、"Export Snapshot"、"Baseline"、"Geo-aware"、"Delta" |
| `views/ResearchPortal.vue` | "RESEARCH FRONTEND"、"MPI Research Portal"、"Quick Actions"、"Experiment Leaderboard"、"Manuscripts & Gate Reports"、"Gates PASS/BLOCKED" |
| `views/Scene3DPage.vue` | "3D Workspace" 眉标为英文 |
| `views/GeomodelVisualization.vue` | "Geological Modeling & Visualization" |

### 2.3 中英混杂的页面

| 文件 | 具体位置 | 英文内容 |
|---|---|---|
| `views/AcademicAlgorithm.vue` | SVG 标签、副标题 | "Academic Algorithm Demonstration Platform"、"Intact → Fractured"、"Burial Depth H (m)"、"Low Risk / Medium / High Risk"、"Phase-Field Fracture"、"Moment Tensor Inversion" |
| `views/AlgorithmValidation.vue` | 指标标签、trust chip | "AUC"、"PR-AUC"、"F1"、"Brier"、"ECE"、"Geology-aware 对照"、"TP 真阳性" |
| `views/Interpolation.vue` | 插值方法下拉 | "Kriging"、"IDW"、"Linear"、"Nearest" |
| `views/ResearchWorkbench.vue` | 表单标签、状态标签 | "dataset_id"、"label_column"、status pills 为英文 |

### 2.4 建议

1. **立即修复** AppLayout.vue 乱码：重新输入正确的中文字符串。
2. **统一语言**：所有面向用户的文本使用中文（或引入 vue-i18n 做双语支持），技术术语如 "Kriging"、"AUC" 可保留英文但加中文注释。
3. GeoMpiStudio、ResearchPortal 需中文化翻译。

---

## 3. 颜色体系与配色问题

### 3.1 双重 CSS 变量定义 — 🔴 严重冲突

`style.css` 和 `design-tokens.css` **同时定义了同名变量但值不同**：

| 变量名 | style.css 值 | design-tokens.css 值 |
|---|---|---|
| `--color-primary` | `#0d9488` | `#0f766e` |
| `--color-success` | `#15803d` | `#22c55e` |
| `--bg-primary` | `#ffffff` | `#f8fafc` |
| `--text-primary` | `#1e293b` | `#0f172a` |
| `--text-secondary` | `#64748b` | `#475569` |
| `--border-color` | `#e2e8f0` | / |
| `--shadow-sm` | 不同值 | 不同值 |

**后果**：CSS 变量最终值取决于样式表加载顺序，导致全站颜色不一致。`main.js` 中先导入 `style.css` 再导入 `design-tokens.css`，所以 `design-tokens.css` 会覆盖 `style.css`，但两者中各有独有变量，形成交叉依赖。

### 3.2 硬编码颜色 — ⚠️ 大量分散

以下文件大量使用 **内联硬编码十六进制颜色值** 而不使用 CSS 变量：

| 文件 | 硬编码颜色数量 | 典型示例 |
|---|---|---|
| `views/MpiAlgorithm.vue` | 30+ | `#22c55e`、`#f59e0b`、`#ef4444`、`#0f766e`、`#e2e8f0`、`#64748b`、`#fff` |
| `views/AlgorithmValidation.vue` | 60+ | `#0f172a`、`#1f2937`、`#f8fafc`、`#065f46`、`#ecfdf5`、`#a7f3d0`、`#fca5a5`、`#991b1b`... |
| `views/AcademicAlgorithm.vue` | 多 | SVG fill 和内联 style 中大量颜色 |
| `components/AiSearchBar.vue` | 15+ | `#e0e0e0`、`#667eea`、`#f8f8ff`、`#333` |

### 3.3 配色方案总结

项目整体采用 **青绿色(Teal)** 为主色调：

- 主色：`#0f766e` (Teal 700)
- 辅色：`#0e7490` (Cyan 700)
- 成功：`#22c55e` (Green 500) / `#15803d` (Green 700)
- 警告：`#f59e0b` (Amber 500)
- 危险：`#ef4444` (Red 500) / `#b91c1c` (Red 700)
- 中性灰：Slate 系列 (`#0f172a` ~ `#f8fafc`)

颜色选择基本遵循 Tailwind CSS 色板规范，但由于绕过了 Tailwind 直接硬编码，导致同一语义颜色在不同文件中有 **微妙变体**（如 success 在不同地方是 `#15803d` 或 `#22c55e`）。

### 3.4 暗色模式

`design-tokens.css` 中通过 `@media (prefers-color-scheme: dark)` 定义了暗色模式变量，但：
- 大量组件使用硬编码颜色 `#fff`、`#f8fafc`，暗色模式下无法生效。
- 暗色切换逻辑在 `useAppStore.js` 中（支持 light/dark/system），但组件级未统一使用 CSS 变量。

---

## 4. 布局与样式架构

### 4.1 全局布局

- **AppLayout.vue** (670行)：固定 88px 宽侧边栏（图标导航）+ 顶部流程进度条 + 内容区
- 侧边栏使用 `position: fixed`，内容区通过 `margin-left: 88px` 偏移
- 流程条（workflow strip）显示 5 个步骤按钮 + 进度百分比
- AI 搜索栏固定在右下角（`position: fixed; bottom: 24px; right: 24px`）

### 4.2 样式组织方式

| 方式 | 使用情况 |
|---|---|
| CSS 变量 | `design-tokens.css` 定义了完整的 token 体系（颜色、间距、字体、阴影、z-index、过渡） |
| `<style scoped>` | 所有 `.vue` 文件都使用 scoped 样式 |
| 全局样式 | `style.css` 定义了基础组件样式（.card、.btn、.table、toast、badge、grid） |
| 内联 style | 大量 JS 计算样式通过 `:style` 绑定（Canvas 绘图、动态定位、渐变色） |

### 4.3 CSS 设计系统

`design-tokens.css` 设计了一套较完整的 token 系统：
- 5 级间距（xs=4px ~ xl=32px）
- 4 级圆角（sm=6px ~ full=9999px）
- 4 级阴影
- 4 级 z-index（dropdown=1000 → tooltip=3000）
- 3 级过渡时间
- 热力图色阶（7 级渐变）

但 **实际使用率不高**，大量组件直接写像素值和颜色值。

### 4.4 字体

```css
font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, -apple-system, sans-serif;
```

- 中文优先字体选择合理
- 部分组件额外使用 `'JetBrains Mono', monospace`（数据展示）和 `'Times New Roman', serif`（学术数值）
- ⚠️ 未引入 Web Font，依赖系统字体

---

## 5. UI/UX 问题

### 5.1 单文件过大 — 🔴

| 文件 | 行数 | 问题 |
|---|---|---|
| `AcademicAlgorithm.vue` | 3715 | 极其庞大，应拆分为多个子组件 |
| `MpiHeatmapPro.vue` | 2426 | 包含粒子动画、播放控制、数据面板 |
| `Interpolation.vue` | 2276 | 包含等值线图、直方图、柱状图、截面图、不确定性图 |
| `MpiAlgorithm.vue` | 2168 | 算法原理展示 |
| `ResearchWorkbench.vue` | 1860 | 数据集管理 + 实验管理 |

**建议**：超过 500 行的 Vue 文件应拆分。已有的 `validation/` 子目录模式（7 个子组件）是良好实践，应推广到其他大文件。

### 5.2 Toast 组件重复

存在 **两个** Toast 实现：
- `src/components/Toast.vue` — 全局使用（AppLayout 中引用）
- `src/components/library/feedback/Toast.vue` — 组件库版本

**建议**：统一为一个实现。

### 5.3 API 缓存重复

- `api.js` 中自定义了 `ApiCache` 类（LRU，容量 100）
- `useCacheStore.js` 中也实现了带 TTL 的缓存 store

两套缓存逻辑独立运行，可能导致内存浪费和数据不一致。

### 5.4 SVG 路径错误

`HealthCheck.vue` 中的 SVG 路径明显不合法：
```html
<path d="M16 8v-4h4a1 1 4-4h4a1 1 4-4h4" />
<path d="M21 12 12l-6a1 1 4-4h4a1 1 4-4" />
```
这些路径语法错误，不会渲染出任何有意义的图形。

### 5.5 事件监听器未清理

`AiSearchBar.vue` 在 `onMounted` 中添加了 `window.addEventListener('ai-search', ...)` 但 **没有在 `onUnmounted` 中移除**，造成内存泄漏。

---

## 6. 组件质量与架构

### 6.1 组件库设计（良好实践 ✅）

`src/components/library/` 具有清晰的分层结构：

```
library/
├── controls/     → Toolbar, FilterPanel, Viewer3DToolbar
├── data/         → DataTable, StatCard
├── feedback/     → LoadingState, Toast, ConfirmDialog
├── layout/       → SidePanel, FormPanel
└── visualization/ → ColorLegend, ChartContainer
```

通过 `index.js` 统一导出，使用方式规范。

### 6.2 Composable 设计（良好实践 ✅）

9 个组合式函数职责清晰：
- `useToast` — 全局 Toast 通知（provide/inject 模式）
- `useViewport` — 2D 画布视口控制（缩放、平移）
- `useWorkspaceFlow` — 工作流状态持久化（localStorage + debounce）
- `useMiningSimulation` — 模拟数据和动画
- `useParticles` — 粒子效果
- `useIndicatorCanvas` — Canvas 绘图逻辑
- `useGeomodelJob` — 地质建模任务管理
- `useGeoMpiData` — 空间数据获取
- `useGeoMpiStudioState` — Studio 页面状态

### 6.3 Store 架构（基本合理 ✅）

| Store | 职责 | 持久化 |
|---|---|---|
| `useAppStore` | 主题、语言、用户信息、全局 loading | localStorage |
| `useDataStore` | 当前煤层/任务/实验选择、煤层列表、数据缓存 | 无 |
| `useUIStore` | 侧边栏状态、控制面板、模态框、Toast、工具栏 | 无 |
| `useCacheStore` | 通用 TTL 缓存 + 清理 + 统计 | 无 |

### 6.4 TypeScript 使用不一致

- 仅 2 个文件使用 `<script setup lang="ts">`：`AiChatSidebar.vue`、`AiSearchBar.vue`
- 其余 **所有 40+ 个 .vue 文件和 .js 文件** 使用纯 JavaScript
- **建议**：统一迁移到 TypeScript 或统一回退到 JS，不要混用

---

## 7. 第三方依赖分析

| 依赖 | 版本 | 用途 | 评估 |
|---|---|---|---|
| vue | 3.4.34 | 核心框架 | ✅ 当前稳定版 |
| pinia | 3.0.4 | 状态管理 | ✅ 官方推荐 |
| vue-router | 4.6.4 | 路由 | ✅ |
| axios | 1.8.4 | HTTP 请求 | ✅ |
| d3 | 7.9.0 | 数据可视化 | ⚠️ 全量引入，bundle 较大 |
| echarts | 6.0.0 | 图表 | ⚠️ 未按需引入 |
| three | 0.182.0 | 3D 渲染 | ⚠️ 较大依赖，仅 2 个页面使用 |
| katex | 0.16.22 | 数学公式 | ✅ 学术场景需要 |
| jszip | 3.10.1 | ZIP 打包 | ✅ |

**包体积风险**：d3 + echarts + three.js 三者 **合计约 2~3 MB**（未压缩），对首屏加载影响显著。路由已做懒加载，但这些大依赖如果在多个 chunk 中被引用，tree-shaking 效果有限。

**无 UI 框架**：项目选择完全手写 CSS，优点是无额外依赖，缺点是缺乏一致的设计语言和组件规范，开发效率较低。

---

## 8. 可访问性（Accessibility）问题

### 8.1 乱码 aria-label — 🔴 致命

如 §2.1 所述，`AppLayout.vue` 中所有 `aria-label` 属性值均为乱码，屏幕阅读器用户完全无法使用工作流导航。

### 8.2 颜色对比度不足

多处浅色文本在浅色背景上对比度不足：
- `#64748b` (Slate 500) 在 `#fff` 背景上的对比度约 4.6:1，对于小号文字（12px）未达到 WCAG AA 标准的 4.5:1 最小要求（正文需 7:1 级别才能保证可读性）
- `#475569` (Slate 600) 在 `#f8fafc` 背景上的对比度约 7:1，通过

### 8.3 缺少 ARIA 角色和标签

- 多数交互式元素缺少 `role` 属性
- Canvas 绘制的热力图、等值线图、混淆矩阵等 **完全不可访问**（无 alt text、无 aria 描述）
- 自定义下拉选择器未实现键盘导航

### 8.4 焦点管理

- 模态框（AI 聊天侧边栏）打开时未 trap focus
- Tab 键导航顺序在某些页面不合理（固定定位元素干扰）

---

## 9. 响应式设计

### 9.1 断点定义

`AppLayout.vue` 中定义了两个主要断点：
- `@media (max-width: 768px)`：侧边栏隐藏，内容区全宽
- `@media (max-width: 1100px)`：部分布局调整

### 9.2 存在的问题

| 问题 | 文件 | 说明 |
|---|---|---|
| 固定宽度 | `AppLayout.vue` | 侧边栏固定 88px，小屏下可通过 `showSidebar` 控制隐藏 |
| Canvas 不自适应 | 多个视图 | `HeatmapCanvas`、`AlgorithmValidation` 中 Canvas 使用固定尺寸或 JS 计算尺寸，但未监听 `resize` 事件 |
| 复杂布局断裂 | `AlgorithmValidation.vue` | 多面板布局在窄屏下未提供替代排列方案 |
| 绝对定位元素 | `AlgorithmValidation.vue` L1329 | `.floating-panel` 使用 `position: absolute; right: 16px; width: 360px`，窄屏下可能溢出 |
| Grid 布局 | `style.css` | 定义了 `.cols-2`/`.cols-3` 等 grid 类，使用了 `minmax(0, 1fr)` 合理，但大部分视图未使用全局 grid 类 |

### 9.3 移动端支持

项目主要面向 **桌面端**（矿压评价系统的专业工具），移动端适配为次要需求。当前基本可用但非优先级。

---

## 10. 严重 BUG 清单

### BUG-1：HealthCheck.vue 多处语法错误 🔴

**文件**：`views/HealthCheck.vue`

| 行号 | 错误 | 说明 |
|---|---|---|
| L10 | `</header>` 多了一个 `</div>` 前的闭合 | `</div></header>` 导致 DOM 结构错误 |
| L28 | 多余的 `</div>` | error-state div 双重关闭 |
| L42 | 多余的 `</div>` | success-state div 双重关闭 |
| L49 | `import { useHead } from 'vue-router'` | `useHead` 不是 `vue-router` 的导出，应来自 `@vueuse/head` 或 `unhead` |
| L51 | `const router = useRouter()` | `useRouter` 未导入 |
| L52 | `const route = useRoute()` | `useRoute` 未导入 |
| L90 | `onBeforeUnmount` | 未导入，且缺少闭合的 `})` 和 `</script>` 标签的完整闭合 |
| 全文 | SVG path 语法错误 | 多个 `<path d="...">` 不合法 |

**该文件当前无法正常编译运行。**

### BUG-2：AppLayout.vue 乱码 🔴

如 §2.1 详述，所有 `title` 和 `aria-label` 属性显示 mojibake。

### BUG-3：AiSearchBar.vue 事件监听泄漏 ⚠️

`onMounted` 中注册了 `window.addEventListener('ai-search', handleSearchFromChat)` 但组件没有在 `onUnmounted` 中移除该监听器。

### BUG-4：CSS 变量冲突 ⚠️

`style.css` 和 `design-tokens.css` 定义了同名但不同值的 CSS 变量（见 §3.1），实际哪个生效取决于加载顺序，可能导致视觉不一致。

---

## 11. 优化建议汇总

### 高优先级（立即修复）

| # | 建议 | 影响范围 |
|---|---|---|
| 1 | **修复 HealthCheck.vue 语法错误**：修正 HTML 结构、补全 import、修复 SVG path | 页面无法渲染 |
| 2 | **修复 AppLayout.vue 乱码**：将所有乱码字符串替换为正确中文 | 全局导航不可读 |
| 3 | **合并 CSS 变量系统**：统一 style.css 和 design-tokens.css，消除重复定义 | 全站颜色一致性 |
| 4 | **修复 AiSearchBar.vue 事件泄漏**：添加 `onUnmounted` 移除事件监听器 | 内存泄漏 |

### 中优先级（近期优化）

| # | 建议 | 影响范围 |
|---|---|---|
| 5 | **统一 UI 语言**：GeoMpiStudio、ResearchPortal 等页面翻译为中文，或引入 vue-i18n | 用户体验一致性 |
| 6 | **拆分大文件**：AcademicAlgorithm (3715行)、MpiHeatmapPro (2426行) 等拆分为子组件 | 可维护性 |
| 7 | **消除硬编码颜色**：提取所有内联 `#hex` 值为 CSS 变量 | 主题一致性 & 暗色模式支持 |
| 8 | **统一 Toast 实现**：合并两个 Toast 组件 | 代码重复 |
| 9 | **合并缓存逻辑**：统一 ApiCache 和 useCacheStore | 架构清晰度 |

### 低优先级（长期改进）

| # | 建议 | 影响范围 |
|---|---|---|
| 10 | **统一 TypeScript/JavaScript**：要么全面迁移 TS，要么移除 2 个 TS 文件中的类型注解 | 代码一致性 |
| 11 | **按需引入 d3/echarts**：使用 tree-shaking 友好的导入方式减小 bundle | 性能 |
| 12 | **完善 Canvas 可访问性**：为热力图、等值线图等添加 aria 描述 | 无障碍访问 |
| 13 | **改善响应式**：为复杂面板布局添加移动端适配方案 | 跨设备体验 |
| 14 | **引入 ESLint + Prettier**：统一代码风格 | 团队协作 |
| 15 | **考虑引入 UI 框架**（如 Naive UI / Element Plus）或 Tailwind CSS，减少手写 CSS 量 | 开发效率 |

---

## 附录：文件行数概览

| 文件 | 行数 |
|---|---|
| `views/AcademicAlgorithm.vue` | 3715 |
| `views/MpiHeatmapPro.vue` | 2426 |
| `views/Interpolation.vue` | 2276 |
| `views/MpiAlgorithm.vue` | 2168 |
| `views/ResearchWorkbench.vue` | 1860 |
| `views/DataImport.vue` | 1516 |
| `views/AlgorithmValidation.vue` | 1380 |
| `views/GeomodelVisualization.vue` | 1342 |
| `views/PressureIndex.vue` | 1214 |
| `views/MpiHeatmap.vue` | 1192 |
| `views/Report.vue` | 1165 |
| `views/Steps.vue` | 1078 |
| `layouts/AppLayout.vue` | 670 |
| `views/ResearchPortal.vue` | 618 |
| `views/Scene3DPage.vue` | 402 |
| `views/GeoMpiStudio.vue` | 341 |
| `views/HealthCheck.vue` | ~200 |
| `style.css` | 689 |
| `api.js` | 369 |
| `design-tokens.css` | 312 |
