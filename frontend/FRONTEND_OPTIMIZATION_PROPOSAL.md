# 矿压系统前端深度优化提案

> **项目**：矿山压力评估系统（Mining Pressure Index）  
> **版本**：v1.0  
> **编制日期**：2026-02-25  
> **技术栈**：Vue 3 + Vite + Pinia + ECharts + D3.js + Three.js  
> **页面总数**：16 个视图 + 30+ 组件  

---

## 目录

- [一、现状审计摘要](#一现状审计摘要)
- [二、优化任务总表](#二优化任务总表)
- [三、任务详细方案](#三任务详细方案)
  - [P0 — 紧急修复](#p0--紧急修复)
  - [P1 — 配色体系重构（黑白灰）](#p1--配色体系重构黑白灰)
  - [P2 — 全站中文化 + 中英文切换](#p2--全站中文化--中英文切换)
  - [P3 — 布局与排版优化](#p3--布局与排版优化)
  - [P4 — 组件质量提升](#p4--组件质量提升)
  - [P5 — 性能优化](#p5--性能优化)
  - [P6 — 可访问性与响应式](#p6--可访问性与响应式)
- [四、实施路线图](#四实施路线图)
- [五、风险与依赖](#五风险与依赖)

---

## 进度快照（更新于 2026-02-28）

| 任务 | 状态 | 说明 |
|------|------|------|
| T20 空状态组件 | 部分完成 | 已新增 `EmptyState.vue` 并在 `ResearchPortal.vue` 接入，其他页面待补齐 |
| T21 骨架屏加载态 | 部分完成 | 已新增 `SkeletonPanel.vue`，并在 `ResearchPortal.vue`、`AcademicAlgorithm.vue` 接入，待扩展至更多异步场景 |
| T22 AiSearchBar 事件泄漏 | 已完成 | `addEventListener` / `removeEventListener` 已成对处理 |
| T23 缓存大小限制（LRU） | 已完成 | 相关缓存已切换 LRU 并限制容量 |
| T24 路由级代码分割 | 已完成 | 路由 chunk 命名与 `manualChunks` 已生效，构建输出已验证 |
| T25 大型图表懒加载 | 已完成 | `AcademicAlgorithm` 采用 `defineAsyncComponent + Suspense` |
| T26 虚拟列表阈值调优 | 已完成 | 虚拟列表阈值已调整到 `>=50`，并优化滚动渲染 |
| T27 响应式断点补全 | 部分完成 | 已补关键页面断点，仍需全页面验收覆盖 |
| T28 键盘导航与 ARIA | 部分完成 | `AppLayout`、`DataTable`、主要交互画布已补齐，`axe-core` 验证待执行 |
| T29 触控手势支持 | 已完成 | `AlgorithmValidation`、`MpiHeatmapPro`、`InterpolationMap/BoreholeMap` 已支持触控拖拽与缩放 |

---

## 一、现状审计摘要

### 1.1 配色现状

| 问题 | 严重程度 | 说明 |
|------|---------|------|
| CSS 变量双重定义 | 🔴 严重 | `style.css` 与 `design-tokens.css` 对 `--color-primary`、`--color-success` 等定义了**不同的值**，导致样式行为不可预测 |
| 大量彩色主题色 | 🔴 严重 | 当前主色为 Teal（`#0f766e`），辅以蓝、绿、橙、紫、粉六种强调色，与科研黑白灰定位不符 |
| 硬编码颜色泛滥 | 🔴 严重 | 全站超过 **150+ 处**硬编码的十六进制/RGB 颜色值绕过 CSS 变量系统，分布在 AlgorithmValidation（60+）、AcademicAlgorithm（50+）、ResearchPortal（31）、MpiAlgorithm（40+）等文件中 |
| 渐变色过多 | ⚠ 中等 | `--gradient-primary`、`--gradient-header`、`--gradient-card` 等渐变色不符合黑白灰学术风格 |
| 阴影带色偏 | ⚠ 中等 | 阴影使用 `rgba(15, 118, 110, ...)` 带有绿色色偏，应使用纯灰色阴影 |

### 1.2 中英文现状

| 问题 | 严重程度 | 涉及文件 |
|------|---------|---------|
| GeoMpiStudio.vue 全英文 | 🔴 严重 | 标题、标签、按钮、描述、提示全部为英文 |
| ResearchPortal.vue 大量英文 | 🔴 严重 | 页面标题、统计卡片、表头、状态标签均为英文 |
| ResearchWorkbench.vue 英文表单 | 🟡 中等 | 表单字段名（dataset_id、split_id 等）、表头、标签为英文 |
| AcademicAlgorithm.vue 英文图注 | 🟡 中等 | 科学图的 Figure 标题、坐标轴标签为英文 |
| AlgorithmValidation.vue 部分英文 | 🟡 中等 | "Geology-aware 对照"、AUC/PR-AUC 等专业术语 |
| Report.vue 部分英文 | 🟢 轻微 | Min/Max/Std/P50/AUC/Brier 等统计指标名 |
| AppLayout.vue 乱码 | 🔴 严重 | tooltip/aria-label 出现编码损坏的乱码（如 `娴佺▼杩涘害`） |

### 1.3 布局与排版现状

| 问题 | 涉及范围 |
|------|---------|
| AcademicAlgorithm.vue 3715 行巨型单文件 | 严重影响维护性 |
| 各页面卡片样式不统一 | 部分用 `.card` 全局类，部分自定义 scoped 样式 |
| 表格样式碎片化 | 至少 3 种不同的表格实现方式 |
| 页面间距/内边距不一致 | 有的用 `--spacing-*` 变量，有的直接写 `16px`、`24px` |
| 页面标题结构不统一 | header 区域有 5 种以上不同的排版方式 |

### 1.4 组件质量现状

| 问题 | 说明 |
|------|------|
| HealthCheck.vue 编译失败 | HTML 嵌套错误、未导入 `useRouter`/`onBeforeUnmount`、`useHead` 不存在 |
| Toast 组件重复实现 | `components/Toast.vue` 与 `components/library/feedback/Toast.vue` 两套 |
| 空状态缺失 | GeoMpiStudio、Scene3DPage、ResearchWorkbench 等多页面无数据时无引导 |
| 内存泄漏风险 | AlgorithmValidation 的 `spatialCache`、MpiHeatmapPro 的 `colorCache` 无大小限制 |
| AiSearchBar 事件泄漏 | `onMounted` 注册的 `window.addEventListener` 未在卸载时移除 |

---

## 二、优化任务总表

| 编号 | 优先级 | 任务名称 | 预估工时 | 涉及文件数 |
|------|-------|---------|---------|-----------|
| T01 | P0 | 修复 HealthCheck.vue 编译错误 | 2h | 1 |
| T02 | P0 | 修复 AppLayout.vue 乱码文本 | 1h | 1 |
| T03 | P0 | 统一 CSS 变量定义，消除双重冲突 | 3h | 2 |
| T04 | P1 | 设计系统重构：黑白灰配色体系 | 6h | 2 |
| T05 | P1 | 全站硬编码颜色替换为 CSS 变量 | 12h | 15+ |
| T06 | P1 | 阴影与渐变去色：改为纯灰色 | 3h | 5+ |
| T07 | P2 | 构建 i18n 国际化基础架构 | 6h | 5 |
| T08 | P2 | GeoMpiStudio.vue 全文中文化 | 3h | 1 |
| T09 | P2 | ResearchPortal.vue 全文中文化 | 3h | 1 |
| T10 | P2 | ResearchWorkbench.vue 中文化 | 4h | 1 |
| T11 | P2 | AcademicAlgorithm.vue 中文化 | 4h | 1 |
| T12 | P2 | 其他页面零散英文中文化 | 4h | 8+ |
| T13 | P2 | 中英文切换功能实现 | 4h | 5+ |
| T14 | P3 | 统一页面标题/Header 结构 | 4h | 10+ |
| T15 | P3 | 统一卡片与面板样式 | 4h | 10+ |
| T16 | P3 | 统一表格样式与交互 | 4h | 8+ |
| T17 | P3 | 统一间距与内边距系统 | 3h | 15+ |
| T18 | P3 | AcademicAlgorithm.vue 组件拆分 | 8h | 1→6+ |
| T19 | P4 | 消除 Toast 组件重复实现 | 2h | 4 |
| T20 | P4 | 添加全局空状态组件 | 3h | 8+ |
| T21 | P4 | 添加骨架屏 Loading 状态 | 4h | 6+ |
| T22 | P4 | 修复 AiSearchBar 事件泄漏 | 1h | 1 |
| T23 | P4 | 缓存大小限制（LRU） | 2h | 2 |
| T24 | P5 | 路由级代码分割优化 | 2h | 1 |
| T25 | P5 | 大型 SVG 图表懒加载 | 3h | 3 |
| T26 | P5 | 虚拟列表阈值调优 | 1h | 2 |
| T27 | P6 | 响应式断点补全 | 6h | 8+ |
| T28 | P6 | 键盘导航与 ARIA 标签修复 | 4h | 10+ |
| T29 | P6 | 触控手势支持 | 4h | 3 |

**总计：约 110 工时（约 14 个工作日）**

---

## 三、任务详细方案

### P0 — 紧急修复

---

#### T01：修复 HealthCheck.vue 编译错误

**问题描述**  
`HealthCheck.vue` 存在多个致命编译错误，页面无法正常渲染：
- HTML 标签嵌套错误（多余的 `</div>` 闭合标签）
- `useRouter()`、`useRoute()` 使用但未从 `vue-router` 导入
- `onBeforeUnmount` 使用但未从 Vue 导入
- `useHead` 从 `vue-router` 导入（该导出不存在）
- SVG path 属性语法错误

**修改方案**  
1. 删除不存在的 `useHead` 导入及调用
2. 补充缺失的 Vue/vue-router 导入：`import { useRouter, useRoute } from 'vue-router'`、`import { onBeforeUnmount } from 'vue'`
3. 修复 HTML 标签嵌套，删除多余的闭合标签
4. 修正 SVG path 的 `d` 属性值

**验收标准**  
- [ ] `HealthCheck.vue` 能通过 Vite 编译，无控制台报错
- [ ] 页面可正常加载并展示健康检查信息
- [ ] 导航栏可正常跳转到该页面

---

#### T02：修复 AppLayout.vue 乱码文本

**问题描述**  
`AppLayout.vue` 中多处 `title`、`aria-label` 属性出现 UTF-8 编码损坏的乱码字符串，例如：
- `娴佺▼杩涘害` → 应为"流程进度"
- `褰撳墠鐓ゅ眰` → 应为"当前煤层"
- `鍓嶅線` → 应为"前往"
- `閲嶇疆娴佺▼` → 应为"重置流程"
- `鍓嶅線鍓嶇疆姝ラ` → 应为"前往前置步骤"

**修改方案**  
逐一替换所有乱码字符串为正确的中文文本：

| 乱码 | 正确文本 |
|------|---------|
| `娴佺▼杩涘害` | 流程进度 |
| `褰撳墠鐓ゅ眰` | 当前煤层 |
| `鍓嶅線` | 前往 |
| `閲嶇疆娴佺▼` | 重置流程 |
| `鍓嶅線鎺ㄨ崘姝ラ` | 前往推荐步骤 |
| `鍓嶅線鍓嶇疆姝ラ` | 前往前置步骤 |
| `姝ラ` | 步骤 |

**验收标准**  
- [ ] 所有 tooltip、aria-label 显示正确的中文文本
- [ ] 鼠标悬停在导航项和工作流步骤上时显示正确中文提示
- [ ] 无任何乱码残留

---

#### T03：统一 CSS 变量定义，消除双重冲突

**问题描述**  
`style.css` 和 `design-tokens.css` 对同名 CSS 变量定义了不同值：

| 变量名 | `style.css` 值 | `design-tokens.css` 值 |
|--------|---------------|----------------------|
| `--color-primary-hover` | `#0d5f59` | `#0e6f68` |
| `--color-primary-light` | `#ccfbf1` | `rgba(15, 118, 110, 0.1)` |
| `--color-success` | `#15803d` | `#22c55e` |
| `--color-error` | `#b91c1c` | `#ef4444` |
| `--color-warning` | `#b45309` | `#f59e0b` |
| `--color-info` | `#0e7490` | `#3b82f6` |
| `--bg-secondary` | `#f3f6f5` | `#f8fafc` |
| `--text-primary` | `#2c3545` | `#0f172a` |

**修改方案**  
1. 将 `design-tokens.css` 作为**唯一的变量定义源**（Single Source of Truth）
2. 删除 `style.css` 中所有 `:root` 变量定义（约 60 行）
3. 在 `style.css` 顶部添加 `@import './styles/design-tokens.css';`
4. 验证 `main.js` 的导入顺序确保 `design-tokens.css` 先加载

**验收标准**  
- [ ] 全站 CSS 变量只在 `design-tokens.css` 中定义
- [ ] `style.css` 不再包含任何 `:root` 中的颜色/间距变量定义
- [ ] 所有页面视觉表现一致，无样式闪烁或错位

---

### P1 — 配色体系重构（黑白灰）

---

#### T04：设计系统重构 — 黑白灰配色体系

**问题描述**  
当前系统采用 Teal/Cyan 为主色调的彩色设计，不符合科研学术网站的定位。需要全面重构为黑白灰三色体系。

**修改方案**  
重新定义 `design-tokens.css` 中的所有颜色变量，建立如下体系：

```css
:root {
  /* ===== 主色：纯黑 ===== */
  --color-primary: #1a1a1a;
  --color-primary-hover: #333333;
  --color-primary-light: rgba(26, 26, 26, 0.08);
  --color-primary-lighter: rgba(26, 26, 26, 0.04);
  --color-primary-dark: #000000;

  /* ===== 中性灰阶（10 级） ===== */
  --color-gray-50:  #fafafa;
  --color-gray-100: #f5f5f5;
  --color-gray-200: #e5e5e5;
  --color-gray-300: #d4d4d4;
  --color-gray-400: #a3a3a3;
  --color-gray-500: #737373;
  --color-gray-600: #525252;
  --color-gray-700: #404040;
  --color-gray-800: #262626;
  --color-gray-900: #171717;

  /* ===== 文字颜色 ===== */
  --text-primary:   #171717;
  --text-secondary:  #525252;
  --text-tertiary:   #737373;
  --text-muted:      #a3a3a3;
  --text-inverted:   #ffffff;

  /* ===== 背景颜色 ===== */
  --bg-primary:   #ffffff;
  --bg-secondary: #fafafa;
  --bg-tertiary:  #f5f5f5;

  /* ===== 边框颜色 ===== */
  --border-color:       #e5e5e5;
  --border-color-light: #f0f0f0;
  --border-color-dark:  #d4d4d4;

  /* ===== 语义色（保留但降低饱和度） ===== */
  --color-success:    #16a34a;
  --color-success-bg: #f0fdf4;
  --color-warning:    #ca8a04;
  --color-warning-bg: #fefce8;
  --color-error:      #dc2626;
  --color-error-bg:   #fef2f2;
  --color-info:       #525252;   /* 用灰色代替蓝色 */
  --color-info-bg:    #f5f5f5;

  /* ===== 渐变：改为灰度 ===== */
  --gradient-primary: linear-gradient(135deg, #1a1a1a 0%, #404040 100%);
  --gradient-card:    none;   /* 去掉卡片渐变，用纯白 */
  --gradient-header:  linear-gradient(135deg, #1a1a1a 0%, #262626 45%, #333333 100%);

  /* ===== 阴影：纯灰色 ===== */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 48px rgba(0, 0, 0, 0.12);
}
```

**设计规范**  
| 元素 | 颜色规则 |
|------|---------|
| 页面背景 | `#ffffff` 或 `#fafafa` |
| 卡片/面板 | 纯白 `#ffffff`，1px `#e5e5e5` 边框 |
| 页面标题 | `#171717`，700 字重 |
| 正文文字 | `#525252`，400 字重 |
| 辅助文字 | `#737373` 或 `#a3a3a3` |
| 主按钮 | 黑底白字 `#1a1a1a` / `#ffffff` |
| 次要按钮 | 灰色边框 `#e5e5e5`，灰色文字 `#525252` |
| 链接/强调 | `#1a1a1a` 加下划线 |
| 分隔线 | `#e5e5e5` |
| 图片/图表内的颜色 | 保持原有色彩不变（热力图色阶、3D 模型颜色、ECharts 数据配色等） |

**验收标准**  
- [ ] `design-tokens.css` 中所有非语义色变量均为黑/白/灰色值
- [ ] 页面整体视觉只呈现黑白灰三色，除图表/热力图/3D模型外无彩色元素
- [ ] 语义色（成功绿、警告黄、错误红）保留但仅用于状态反馈

---

#### T05：全站硬编码颜色替换为 CSS 变量

**问题描述**  
全站超过 150 处硬编码颜色值散布在 scoped style 和内联样式中，必须统一使用 CSS 变量。

**涉及文件清单**  

| 文件 | 硬编码颜色数量 | 改动量 |
|------|-------------|-------|
| `views/AlgorithmValidation.vue` | 60+ | 大 |
| `views/AcademicAlgorithm.vue` | 50+ | 大 |
| `views/MpiAlgorithm.vue` | 40+ | 大 |
| `views/ResearchPortal.vue` | 31 | 中 |
| `views/MpiHeatmapPro.vue` | 20+ | 中 |
| `views/GeoMpiStudio.vue` | 15+ | 中 |
| `components/Scene3DViewer.vue` | 20+ | 中 |
| `components/InteractiveHeatmap.vue` | 15+ | 中 |
| `components/MpiHeatmapViewer.vue` | 15+ | 中 |
| `components/LithologyColumnChart.vue` | 9 | 小 |
| `style.css` | 30+ | 中 |
| `layouts/AppLayout.vue` | 15+ | 中 |
| 其他组件 | ~20 | 小 |

**修改方案**  
1. 建立颜色值 → CSS 变量的**映射对照表**
2. 使用全局搜索替换，按文件逐一处理
3. **例外规则**：以下颜色允许保留硬编码值：
   - 热力图色阶数组（`odiPalette`、`viridis` 等函数式颜色，在 JS 运行时使用）
   - ECharts 配置中的数据颜色
   - Canvas 绑定的颜色（如 `ctx.fillStyle`）
   - 岩性图例固定色（`LithologyColumnChart.vue` 的岩性识别色）
4. CSS 中的颜色**全部替换**为变量引用

**映射规则示例**  

| 硬编码值 | 替换为 |
|---------|--------|
| `#ffffff` / `#fff` | `var(--bg-primary)` |
| `#f8fafc` / `#fafafa` | `var(--bg-secondary)` |
| `#f1f5f9` / `#f5f5f5` | `var(--bg-tertiary)` |
| `#0f172a` / `#171717` | `var(--text-primary)` |
| `#475569` / `#525252` | `var(--text-secondary)` |
| `#64748b` / `#737373` | `var(--text-tertiary)` |
| `#e2e8f0` / `#e5e5e5` | `var(--border-color)` |
| `#cbd5e1` / `#d4d4d4` | `var(--border-color-dark)` |
| `#0f766e` (旧主色) | `var(--color-primary)` |

**验收标准**  
- [ ] 全站 CSS/scoped style 中不再出现非白名单的硬编码颜色值
- [ ] `grep -rn "#[0-9a-fA-F]" --include="*.vue" --include="*.css"` 输出中，除白名单文件/行外无匹配
- [ ] 修改 `design-tokens.css` 中的主色变量后，全站颜色同步变化

---

#### T06：阴影与渐变去色

**问题描述**  
当前阴影带有绿色色偏 `rgba(15, 118, 110, ...)`，渐变使用 Teal-Cyan 彩色，与黑白灰主题不符。

**修改方案**  

1. **阴影**：`style.css` 中所有阴影改为纯灰色
   ```css
   /* Before */
   --shadow-sm: 0 1px 3px rgba(15, 118, 110, 0.08);
   /* After */
   --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
   ```

2. **渐变**：去除所有彩色渐变
   ```css
   /* Before */
   --gradient-card: linear-gradient(145deg, #ffffff 0%, #f3f7f6 100%);
   /* After - 去除渐变或改为纯灰 */
   --gradient-card: none;
   ```

3. **Hover 光晕**：`--shadow-glow`、`--shadow-glow-sm` 改为无色或删除

4. **AppLayout 背景渐变**：
   ```css
   /* Before */
   background: radial-gradient(circle at 18% 12%, rgba(15, 118, 110, 0.12) ...);
   /* After */
   background: #fafafa;
   ```

5. **滚动条 hover 色**：
   ```css
   /* Before */
   *::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #0f766e ...); }
   /* After */
   *::-webkit-scrollbar-thumb:hover { background: #a3a3a3; }
   ```

**验收标准**  
- [ ] 所有阴影为纯灰色（`rgba(0,0,0,...)` 或 `rgba(23,23,23,...)`）
- [ ] 页面背景、卡片背景无彩色渐变
- [ ] 滚动条 hover 时为灰色

---

### P2 — 全站中文化 + 中英文切换

---

#### T07：构建 i18n 国际化基础架构

**问题描述**  
当前无国际化机制，中英文文本直接硬编码在模板中。需要建立轻量化 i18n 架构以支持中英文切换。

**修改方案**  

**方案选型**：不引入 `vue-i18n` 重型库，自研基于 Pinia 的轻量方案（项目只需中英双语，避免引入额外依赖）。

1. **创建语言包目录**：
   ```
   src/
     locales/
       zh-CN.js    ← 中文语言包（默认）
       en-US.js    ← 英文语言包
       index.js    ← 导出与工具函数
   ```

2. **创建语言 Store**：`src/stores/useLocaleStore.js`
   ```javascript
   // 存储当前语言偏好，持久化到 localStorage
   export const useLocaleStore = defineStore('locale', {
     state: () => ({
       locale: localStorage.getItem('locale') || 'zh-CN'
     }),
     actions: {
       setLocale(lang) {
         this.locale = lang
         localStorage.setItem('locale', lang)
       }
     }
   })
   ```

3. **创建 `useI18n` composable**：
   ```javascript
   export function useI18n() {
     const localeStore = useLocaleStore()
     const t = (key) => {
       const messages = localeStore.locale === 'zh-CN' ? zhCN : enUS
       return getNestedValue(messages, key) || key
     }
     return { t, locale: computed(() => localeStore.locale) }
   }
   ```

4. **语言包结构示例**：
   ```javascript
   // zh-CN.js
   export default {
     common: {
       loading: '加载中...',
       save: '保存',
       cancel: '取消',
       confirm: '确认',
       export: '导出',
       reset: '重置',
       search: '搜索',
       noData: '暂无数据',
     },
     nav: {
       dataImport: '数据导入',
       interpolation: '插值分析',
       mpiHeatmap: 'MPI 数值模拟',
       academicAlgorithm: '新算法原理',
       algorithmValidation: '新算法实证',
       researchWorkbench: '科研工作台',
       geoMpiStudio: '空间实验室',
       steps: '来压步距',
       report: '结果报告',
     },
     geoMpiStudio: {
       title: '地质-MPI 空间实验室',
       subtitle: '地质模型与 MPI 空间联动分析',
       description: '一屏联动地质模型、MPI 及三大子指标（RSI/BRI/ASI），支持基线、地质感知、差异对比三种模式。',
       controlPanel: '控制面板',
       seam: '煤层',
       geomodelJobId: '地质建模任务 ID',
       resolution: '分辨率',
       method: '插值方法',
       mode: '分析模式',
       baseline: '基线模式',
       geoAware: '地质感知',
       delta: '差异对比',
       runAnalysis: '运行空间分析',
       refreshing: '分析中...',
       exportSnapshot: '导出快照',
       metricMatrix: '2×2 指标矩阵',
       linkage3d: '三维联动与可解释性',
     },
     // ... 其余页面
   }
   ```

5. **在 AppLayout 添加语言切换按钮**：侧边栏底部放置中/EN 切换按钮

**验收标准**  
- [ ] `src/locales/` 下有完整的 `zh-CN.js` 和 `en-US.js` 语言包
- [ ] `useI18n()` composable 可在任意组件中使用
- [ ] 语言偏好持久化到 `localStorage`
- [ ] 语言切换按钮在侧边栏底部可见并可操作

---

#### T08：GeoMpiStudio.vue 全文中文化

**问题描述**  
`GeoMpiStudio.vue` 是全英文页面，包括标题（"Geo-MPI Studio"）、描述文本、控制面板标签（Seam、Method、Mode、Resolution 等）、按钮（Run Spatial Analysis、Export Snapshot）、标签页（Baseline、Geo-aware、Delta）等。

**修改方案**  
1. 将所有模板中的英文字面量替换为 `{{ t('geoMpiStudio.xxx') }}`
2. 在 `zh-CN.js` 和 `en-US.js` 中添加对应翻译键值
3. 技术专有名词保留英文缩写但附加中文解释：如 `IDW（反距离加权）`

**完整翻译对照表**  

| 英文原文 | 中文翻译 |
|---------|---------|
| Geo-MPI Studio | 地质-MPI 空间实验室 |
| Geology and MPI Spatial Studio | 地质模型与 MPI 空间联动分析平台 |
| One-screen linkage for Geomodel, MPI... | 一屏联动地质模型、MPI 及三大子指标... |
| Run Spatial Analysis | 运行空间分析 |
| Refreshing... | 分析中... |
| Export Snapshot | 导出快照 |
| Control Panel | 控制面板 |
| Seam | 煤层 |
| Geomodel Job ID | 地质建模任务 ID |
| e.g. gm_20260212_xxx | 如：gm_20260212_xxx |
| Resolution | 分辨率 |
| Method | 插值方法 |
| IDW / Linear / Nearest | 反距离加权 / 线性 / 最近邻 |
| Mode | 分析模式 |
| Baseline | 基线模式 |
| Geo-aware | 地质感知 |
| Delta | 差异对比 |
| 2 x 2 Metric Matrix | 2×2 指标矩阵 |
| MPI / RSI / BRI / ASI | MPI / RSI / BRI / ASI（保留缩写） |
| 3D Linkage and Explainability | 三维联动与可解释性分析 |

**验收标准**  
- [ ] 默认语言（中文）下，页面无英文 UI 文本（专业缩写除外）
- [ ] 切换英文后，页面正确显示英文
- [ ] 所有 placeholder、tooltip、按钮文字均已国际化

---

#### T09：ResearchPortal.vue 全文中文化

**问题描述**  
`ResearchPortal.vue` 页面标题、统计卡片、表头、状态标签等大量英文。

**完整翻译对照表**  

| 英文原文 | 中文翻译 |
|---------|---------|
| RESEARCH FRONTEND | 科研前端 |
| MPI Research Portal | MPI 科研门户 |
| Paper Drafts | 论文草稿 |
| Gate Pass | 质量关卡 |
| Last Sync | 最后同步 |
| Quick Actions | 快捷操作 |
| 12-Month Track | 12 个月追踪 |
| Experiment Leaderboard | 实验排行榜 |
| Top Runs | 最佳运行 |
| exp_id / model / value / action | 实验 ID / 模型 / 数值 / 操作 |
| Model Summary | 模型汇总 |
| count / datasets / mean / best | 次数 / 数据集 / 均值 / 最优 |
| Manuscripts & Gate Reports | 论文与质量关卡报告 |
| Gates PASS / Gates BLOCKED | 已通过 / 未通过 |
| Asset / Status / Updated / Action | 资源 / 状态 / 更新时间 / 操作 |
| ready / missing | 就绪 / 缺失 |

**验收标准**  
- [ ] 默认语言下页面无英文 UI  
- [ ] 表头、状态标签、统计卡片全部中文化
- [ ] i18n 键值完整，英文包对应正确

---

#### T10：ResearchWorkbench.vue 中文化

**问题描述**  
`ResearchWorkbench.vue` 的表单标签（dataset_id、split_id 等）、表头、区块标题使用英文下划线命名。

**修改方案**  
1. 表单标签（`dataset_id` → `数据集 ID`、`label_column` → `标签列`、`train_ratio` → `训练集比例` 等）
2. 表头（`experiment_name` → `实验名称`、`model_type` → `模型类型` 等）
3. 区块标题（`Traceability` → `可追溯性`、`Artifacts` → `产物文件` 等）
4. 保留 API 字段名不变（仅 UI 显示文本做翻译）

**验收标准**  
- [ ] 所有表单 label 显示中文
- [ ] 所有表头显示中文
- [ ] API 请求参数名不受影响

---

#### T11：AcademicAlgorithm.vue 中文化

**问题描述**  
科学图 Figure 标题、坐标轴标签、图例为英文。部分学术术语需中英对照处理。

**修改方案**  
1. Figure 标题改为中文：`Fig. 1 | Phase-field fracture evolution` → `图 1 | 相场断裂演化过程`
2. 坐标轴标签：`Burial Depth H (m)` → `埋深 H (m)`、`BRI` 保留缩写
3. 图例文字：`Low Risk` → `低风险`、`High Risk` → `高风险`
4. 机制名称中英对照：`Isotropic（各向同性）`、`Double-Couple（双力偶）`
5. 主标题：`Academic Algorithm Demonstration Platform` → `学术算法演示平台`

**验收标准**  
- [ ] 所有 Figure 标题使用中文（学术缩写保留英文附加中文）
- [ ] 坐标轴标签中文化（单位保留英文如 m、MPa）
- [ ] 图例可切换中英文

---

#### T12：其他页面零散英文中文化

**涉及文件与修改项**  

| 文件 | 英文内容 | 中文替换 |
|------|---------|---------|
| `AlgorithmValidation.vue` | "Geology-aware 对照" | "地质感知对照" |
| `AlgorithmValidation.vue` | SVG 内 `基线 MPI`（已中文，保留） | — |
| `Report.vue` | Min / Max / Std / P50 | 最小值 / 最大值 / 标准差 / 中位数 |
| `Report.vue` | Best AUC / Best Brier | 最佳 AUC / 最佳 Brier |
| `Scene3DPage.vue` | "3D Workspace" | "三维工作空间" |
| `GeomodelVisualization.vue` | "Geological Modeling & Visualization" | "地质建模与可视化" |
| `Steps.vue` | IDW / Linear / Nearest | 反距离加权 / 线性 / 最近邻 |
| `PressureIndex.vue` | Kriging / IDW / Linear / Nearest | 克里金 / 反距离加权 / 线性 / 最近邻 |
| `MpiHeatmap.vue` | IDW / Linear / Nearest / "Canvas" | 反距离加权 / 线性 / 最近邻 / 画布模式 |
| `DataImport.vue` | 检查是否有英文残留 | 全部中文化 |

**验收标准**  
- [ ] 以上所有文件的 UI 文本默认为中文
- [ ] 专业术语统一格式：`克里金（Kriging）`
- [ ] `grep -rn "TODO\|FIXME" --include="*.vue"` 无遗留翻译标记

---

#### T13：中英文切换功能实现

**问题描述**  
用户需要一个全局中英文切换选项，默认中文，可切换为英文。

**修改方案**  

1. **切换入口 UI**：在 `AppLayout.vue` 侧边栏底部添加语言切换按钮
   ```html
   <button class="lang-switch" @click="toggleLocale">
     {{ locale === 'zh-CN' ? 'EN' : '中' }}
   </button>
   ```

2. **实现逻辑**：
   - 使用 `useLocaleStore` 管理语言状态
   - 切换时自动更新 `document.documentElement.lang` 属性
   - 路由 `meta.title` 支持对象格式 `{ 'zh-CN': '数据导入', 'en-US': 'Data Import' }`

3. **切换范围**：
   - 导航标题 ✅
   - 页面标题与描述 ✅
   - 表单标签/placeholder ✅
   - 按钮文字 ✅
   - 状态消息/Toast ✅
   - 表头 ✅
   - 错误提示 ✅
   - 科学图中的 Figure 标题 ✅（坐标轴单位保持英文无需切换）

4. **不切换的内容**：
   - API 字段名
   - URL 路径
   - 专业缩写（MPI、RSI、BRI、ASI、AUC 等）
   - 图表数据标签中的数值

**验收标准**  
- [ ] 侧边栏底部有清晰的 中/EN 切换按钮
- [ ] 点击后全站文本在 200ms 内切换，无页面刷新
- [ ] 刷新页面后语言偏好保持不变（localStorage 持久化）
- [ ] 中文和英文下页面排版均无溢出或错位

---

### P3 — 布局与排版优化

---

#### T14：统一页面标题/Header 结构

**问题描述**  
各页面 header 区域至少有 5 种不同的实现方式，导致视觉不统一。

**修改方案**  
1. **定义标准 Header 组件**：`components/library/layout/PageHeader.vue`
   ```vue
   <template>
     <header class="page-header">
       <div class="page-header-content">
         <h1 class="page-title">{{ title }}</h1>
         <p v-if="description" class="page-description">{{ description }}</p>
       </div>
       <div v-if="$slots.actions" class="page-header-actions">
         <slot name="actions" />
       </div>
     </header>
   </template>
   ```

2. **统一 Header 样式规则**：
   - 标题：24px、700 字重、`--text-primary`
   - 描述：14px、400 字重、`--text-tertiary`
   - 背景：去除渐变，使用 `--bg-primary` + 底部 1px 分隔线
   - 右侧操作区：flex 布局，gap 12px
   - 内边距：`24px 0`，无侧边 padding（由外层容器控制）

3. **逐页替换**：将所有页面的自定义 header 替换为 `<PageHeader>` 组件

**验收标准**  
- [ ] 所有页面使用统一的 `<PageHeader>` 组件
- [ ] Header 视觉风格一致：无渐变、无彩色装饰
- [ ] 标题/描述颜色使用 CSS 变量

---

#### T15：统一卡片与面板样式

**问题描述**  
部分页面使用全局 `.card` 类，部分自定义 scoped 样式，部分直接写内联样式，导致卡片圆角、阴影、内边距不统一。

**修改方案**  
1. **定义标准卡片组件**：`components/library/layout/Card.vue`
   ```vue
   <template>
     <div class="card" :class="{ 'card--bordered': bordered, 'card--flat': flat }">
       <div v-if="title || $slots.header" class="card-header">
         <h3 v-if="title" class="card-title">{{ title }}</h3>
         <slot name="header" />
       </div>
       <div class="card-body">
         <slot />
       </div>
       <div v-if="$slots.footer" class="card-footer">
         <slot name="footer" />
       </div>
     </div>
   </template>
   ```

2. **统一规则**：
   - 圆角：8px（`--radius-md`）
   - 边框：1px solid `var(--border-color)`
   - 阴影：`var(--shadow-sm)`，hover 时 `var(--shadow-md)`
   - 内边距：`20px 24px`
   - 背景：纯白 `var(--bg-primary)`，去除渐变和 `::before`/`::after` 伪元素装饰
   - 去掉 hover 上浮动画（科研系统不需要卡片悬浮效果）

3. **修改 `style.css` 中 `.card` 全局类**：去除渐变、伪元素、hover 上浮动效果

**验收标准**  
- [ ] 所有卡片视觉一致：纯白背景、灰色边框、灰色阴影
- [ ] 无 hover 上浮/颜色变化效果
- [ ] 卡片内边距统一

---

#### T16：统一表格样式与交互

**问题描述**  
全站至少有 3 种不同表格实现：全局 `.table` 类、组件 scoped 表格、DataTable 组件，样式不统一。

**修改方案**  
1. **统一表格规范**：
   - 表头：`--bg-tertiary`（#f5f5f5）背景，`--text-secondary` 文字，12px 字号，大写去掉
   - 单元格：14px 字号，`--text-primary` 文字
   - 行高亮：hover 时 `--bg-secondary`（不使用彩色渐变）
   - 表格边框：仅水平分隔线 `1px solid var(--border-color)`
   - 去除表头 `text-transform: uppercase`（中文不应大写）
   - 去除 hover 时的 `transform: scale(1.01)` 效果

2. **修改全局 `.table` 样式**：
   ```css
   .table th {
     background: var(--bg-tertiary);
     border-bottom: 1px solid var(--border-color);
     font-weight: 600;
     color: var(--text-secondary);
     font-size: 13px;
     letter-spacing: 0;
     text-transform: none;
   }
   .table tbody tr:hover {
     background: var(--bg-secondary);
     transform: none;
     box-shadow: none;
   }
   ```

3. **推广 `DataTable.vue` 组件**，逐步替换各页面自定义表格

**验收标准**  
- [ ] 全局表格没有 `text-transform: uppercase`
- [ ] 表格 hover 无缩放效果
- [ ] 表头背景为纯灰色

---

#### T17：统一间距与内边距系统

**问题描述**  
部分文件使用 `--spacing-*` CSS 变量，部分直接写 `16px`、`24px` 等硬编码值，间距不统一。

**修改方案**  
1. **统一使用 `design-tokens.css` 中定义的间距变量**
2. **建立间距使用规范**：
   - 页面容器内边距：`--spacing-6`（24px）
   - 卡片间距：`--spacing-4`（16px）
   - 卡片内边距：`--spacing-5`（20px）`--spacing-6`（24px）
   - 表单项间距：`--spacing-4`（16px）
   - 标题与内容间距：`--spacing-3`（12px）
   - 紧凑间距（按钮组等）：`--spacing-2`（8px）
3. **全局搜索并替换硬编码间距值**

**验收标准**  
- [ ] 独立检查：所有 scoped style 中的 padding/margin 使用 `var(--spacing-*)` 变量
- [ ] 页面间视觉间距一致

---

#### T18：AcademicAlgorithm.vue 组件拆分

**问题描述**  
`AcademicAlgorithm.vue` 达 3715 行，包含多个 SVG 科学图、公式渲染、交互控件，严重影响可维护性和编译性能。

**修改方案**  
将其拆分为以下子组件：

| 新组件 | 职责 | 预估行数 |
|--------|------|---------|
| `AcademicAlgorithm.vue`（主页面） | 布局编排、Tab 切换 | ~200 |
| `PhaseFieldFracture.vue` | 相场断裂演化 SVG 图 | ~400 |
| `MomentTensorInversion.vue` | 矩张量反演震球 SVG | ~400 |
| `UnifiedStrengthTheory.vue` | 统一强度理论包络线 SVG | ~400 |
| `DepthRiskCurve.vue` | 埋深-风险关系曲线 | ~300 |
| `AlgorithmFormula.vue` | 公式渲染区域（KaTeX） | ~300 |
| `AlgorithmInteraction.vue` | 参数滑块与交互控件 | ~200 |

**拆分原则**  
- 每个 SVG 科学图独立为一个组件，通过 props 传入数据
- 交互逻辑（滑块、参数调节）集中到交互组件
- 主页面仅负责 Tab 切换和整体布局

**验收标准**  
- [ ] 主文件行数 ≤ 300 行
- [ ] 每个子组件行数 ≤ 500 行
- [ ] 页面功能与拆分前完全一致
- [ ] 子组件通过 props/emits 通信，无直接 DOM 操作

---

### P4 — 组件质量提升

---

#### T19：消除 Toast 组件重复实现

**问题描述**  
`components/Toast.vue` 和 `components/library/feedback/Toast.vue` 两套 Toast 实现共存。

**修改方案**  
1. 保留 `library/feedback/Toast.vue`（更标准化的实现）
2. 将 `components/Toast.vue` 的被引用处全部替换为 library 版本
3. 删除 `components/Toast.vue`
4. 统一 Toast API：`toast.add(message, type, duration)`

**验收标准**  
- [ ] 全站只有一个 Toast 实现：`components/library/feedback/Toast.vue`
- [ ] 所有引用处（AppLayout.vue 等）已更新
- [ ] Toast 功能正常，支持 success/error/warning/info 四种类型

---

#### T20：添加全局空状态组件

**问题描述**  
多个页面在无数据时直接显示空白或完全隐藏区域，缺少引导性空状态。

**修改方案**  
1. **创建 `EmptyState.vue` 组件**：
   ```vue
   <template>
     <div class="empty-state">
       <div class="empty-state-icon">
         <slot name="icon">
           <svg><!-- 默认空数据图标 --></svg>
         </slot>
       </div>
       <h3 class="empty-state-title">{{ title || '暂无数据' }}</h3>
       <p v-if="description" class="empty-state-desc">{{ description }}</p>
       <div v-if="$slots.action" class="empty-state-action">
         <slot name="action" />
       </div>
     </div>
   </template>
   ```

2. **覆盖页面**：
   - GeoMpiStudio：无煤层数据时 → 引导用户先导入数据
   - Scene3DPage：右侧统计无数据时 → 显示空状态而非隐藏
   - ResearchWorkbench：实验列表为空时 → 引导创建新实验
   - Report：无报告时 → 引导完成前置步骤

**验收标准**  
- [ ] 所有列表/表格/面板在数据为空时显示 `EmptyState` 组件
- [ ] 空状态包含标题、描述、操作按钮（可选）
- [ ] 空状态风格符合黑白灰主题

**当前进度（2026-02-28）**  
- 已完成组件创建与导出（`EmptyState.vue`、`components/library/index.js`）。
- 已在 `ResearchPortal.vue` 接入。
- 其余页面接入待继续推进。

---

#### T21：添加骨架屏 Loading 状态

**问题描述**  
数据加载期间仅显示简单 spinner，用户无法感知页面即将呈现的布局。

**修改方案**  
1. **创建 `SkeletonLoader.vue` 组件**：支持 text/card/table/chart 四种骨架类型
2. **应用到所有异步数据加载场景**：
   - ResearchPortal：leaderboard 和 papers 加载时显示表格骨架
   - GeomodelVisualization：3D 模型加载时显示全屏骨架
   - AlgorithmValidation：计算结果加载时显示卡片骨架
   - Report：报告数据加载时显示多段骨架
3. **骨架颜色**：使用 `--bg-tertiary` 到 `--bg-secondary` 的脉冲动画

**验收标准**  
- [ ] 使用浏览器 Network 限速（Slow 3G）下，所有页面加载期间显示骨架屏
- [ ] 骨架屏布局与实际内容布局基本匹配
- [ ] 骨架屏颜色为灰色系，无彩色

**当前进度（2026-02-28）**  
- 已完成组件创建与导出（`SkeletonPanel.vue`、`components/library/index.js`）。
- 已在 `ResearchPortal.vue` 与 `AcademicAlgorithm.vue` 接入。
- 全页面覆盖与慢网人工验收待补。

---

#### T22：修复 AiSearchBar 事件泄漏

**问题描述**  
`AiSearchBar.vue` 在 `onMounted` 中注册了 `window.addEventListener`（如键盘快捷键监听），但未在 `onBeforeUnmount` 中移除，导致组件卸载后事件仍然触发。

**修改方案**  
```javascript
// Before
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

// After
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
```

**验收标准**  
- [x] `onMounted` 中的每个 `addEventListener` 都有对应的 `removeEventListener`
- [x] 多次切换页面后无内存泄漏（Chrome DevTools Memory panel 无增长趋势）

---

#### T23：缓存大小限制

**问题描述**  
`AlgorithmValidation.vue` 的 `spatialCache`（Map）和 `MpiHeatmapPro.vue` 的 `colorCache`（Map）无大小上限，长时间运行会持续增长。

**修改方案**  
实现 LRU 缓存替代普通 Map：
```javascript
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize
    this.cache = new Map()
  }
  get(key) {
    if (!this.cache.has(key)) return undefined
    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }
  set(key, value) {
    if (this.cache.has(key)) this.cache.delete(key)
    else if (this.cache.size >= this.maxSize) {
      this.cache.delete(this.cache.keys().next().value)
    }
    this.cache.set(key, value)
  }
}
```

**验收标准**  
- [x] `spatialCache` 和 `colorCache` 使用 LRU 缓存，最大容量 200 条
- [x] 缓存溢出时自动淘汰最旧条目

---

### P5 — 性能优化

---

#### T24：路由级代码分割优化

**问题描述**  
当前路由已使用 `() => import(...)` 懒加载，但缺少预加载提示和 chunk 命名。

**修改方案**  
1. **添加 webpack magic comment**（Vite 也支持）用于 chunk 命名：
   ```javascript
   component: () => import(/* webpackChunkName: "data-import" */ '../views/DataImport.vue')
   ```
2. **添加路由预加载**：鼠标悬浮导航项时预加载目标路由组件
3. **在 `vite.config.js` 中配置 `build.rollupOptions.output.manualChunks`**：将 echarts、three.js、d3 等大型库分离为独立 chunk

**验收标准**  
- [x] `npm run build` 输出中每个路由对应独立 chunk，命名清晰
- [x] echarts、three.js、d3 各自为独立 chunk
- [x] 首次加载只请求当前路由的 chunk

---

#### T25：大型 SVG 图表懒加载

**问题描述**  
`AcademicAlgorithm.vue`（拆分后的子组件）包含多个复杂 SVG 科学图，一次性加载影响首屏性能。

**修改方案**  
1. 使用 `defineAsyncComponent` + `Suspense` 懒加载拆分后的 SVG 图组件
2. 不在视窗内的 Tab 内容延迟渲染（使用 `v-if` 替代 `v-show`）
3. SVG 静态部分提取为独立 `.svg` 文件，通过 `<img>` 或 Vite svg 插件加载

**验收标准**  
- [x] 非当前 Tab 的 SVG 组件不渲染
- [x] 切换 Tab 时组件加载延迟 < 200ms

---

#### T26：虚拟列表阈值调优

**问题描述**  
`DataImport.vue` 中虚拟列表阈值 >100 行才启用，50-100 行的长列表仍使用普通 DOM 渲染。

**修改方案**  
将虚拟列表启用阈值从 100 降低到 50。

**验收标准**  
- [x] ≥ 50 行数据时自动启用虚拟列表
- [x] 滚动流畅度不低于 60fps

---

### P6 — 可访问性与响应式

---

#### T27：响应式断点补全

**问题描述**  
多个页面缺少中间断点或完全没有响应式处理。

**修改方案**  

| 页面 | 现状 | 目标断点 |
|------|------|---------|
| GeoMpiStudio | 1280px, 768px | 增加 1024px（双列布局） |
| ResearchPortal | 仅 1080px | 增加 768px, 1280px |
| Scene3DPage | 无响应式 | 增加 1024px（面板折叠）, 768px |
| GeomodelVisualization | 侧边面板 320px 固定 | 768px 下面板收起为抽屉 |
| MpiHeatmapPro | 无响应式 | 底部控制条自适应，768px 下简化交互 |
| AcademicAlgorithm | 无响应式 | SVG 使用 viewBox 自适应，文字大小调整 |
| AlgorithmValidation | 缩略图面板固定定位 | 768px 下改为底部抽屉 |

**验收标准**  
- [ ] 所有页面在 1920px / 1440px / 1024px / 768px / 375px 五个宽度下布局合理
- [x] 无水平溢出
- [x] 文字大小可读（最小 12px）

**当前进度（2026-02-28）**  
- 已补齐 `AppLayout.vue`、`Scene3DPage.vue`、`GeoMpiStudio.vue`、`ResearchPortal.vue` 关键断点。
- 全页面五断点走查尚未全部完成。

---

#### T28：键盘导航与 ARIA 标签修复

**问题描述**  
- AppLayout.vue 中 ARIA 标签为乱码
- 多个交互元素缺少 `role`、`aria-label`
- Tab 键导航顺序不合理

**修改方案**  
1. 修复所有 ARIA 标签乱码（已在 T02 中覆盖）
2. 所有可交互元素添加 `role` 属性
3. 侧边栏添加 `role="navigation"` 和 `aria-label="主导航"`
4. 主内容区添加 `role="main"`
5. 模态框/对话框添加 `role="dialog"` 和焦点捕获
6. 所有图标按钮添加 `aria-label`
7. `tabindex` 优化：确保 Tab 顺序符合视觉流

**验收标准**  
- [x] 使用 Tab 键可遍历所有交互元素
- [x] 屏幕阅读器可正确朗读所有按钮/链接/导航项
- [ ] `axe-core` 自动化检测 0 个 critical/serious 级别问题

**当前进度（2026-02-28）**  
- 已完成 `AppLayout.vue`、`DataTable.vue` 与主要画布组件的键盘/ARIA增强。
- `axe-core` 自动化扫描待执行并归档结果。

---

#### T29：触控手势支持

**问题描述**  
Canvas 交互（拖拽/缩放）未适配触控设备。

**修改方案**  
1. `AlgorithmValidation.vue`：Canvas 添加 `touch-action: none`，使用 pointer events 替代 mouse events
2. `MpiHeatmapPro.vue`：热力图支持双指缩放、单指拖拽
3. `Interpolation.vue`：剖面线绘制添加 touch 支持

**验收标准**  
- [x] iPad/平板上可拖拽和缩放 Canvas 内容
- [x] 双指缩放手势流畅
- [x] 不与页面滚动冲突

---

## 四、实施路线图

### 第一阶段：基础修复（第 1-2 天）

| 任务 | 优先级 | 工时 |
|------|-------|------|
| T01 修复 HealthCheck 编译 | P0 | 2h |
| T02 修复 AppLayout 乱码 | P0 | 1h |
| T03 统一 CSS 变量定义 | P0 | 3h |
| T22 修复事件泄漏 | P4 | 1h |

### 第二阶段：配色重构（第 3-5 天）

| 任务 | 优先级 | 工时 |
|------|-------|------|
| T04 黑白灰设计系统 | P1 | 6h |
| T05 硬编码颜色替换 | P1 | 12h |
| T06 阴影与渐变去色 | P1 | 3h |

### 第三阶段：国际化（第 6-9 天）

| 任务 | 优先级 | 工时 |
|------|-------|------|
| T07 i18n 架构搭建 | P2 | 6h |
| T08-T12 各页面中文化 | P2 | 18h |
| T13 中英文切换实现 | P2 | 4h |

### 第四阶段：布局优化（第 10-12 天）

| 任务 | 优先级 | 工时 |
|------|-------|------|
| T14-T17 统一页面元素 | P3 | 15h |
| T18 AcademicAlgorithm 拆分 | P3 | 8h |

### 第五阶段：质量与性能（第 13-14 天）

| 任务 | 优先级 | 工时 |
|------|-------|------|
| T19-T23 组件质量修复 | P4 | 12h |
| T24-T26 性能优化 | P5 | 6h |
| T27-T29 响应式与可访问性 | P6 | 14h |

---

## 五、风险与依赖

### 5.1 风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 颜色替换遗漏 | 部分元素保持旧设计 | 用 `grep` 全文搜索验证，建立白名单清单 |
| SVG 图中文化影响布局 | 中文字符宽度不同 | 预留足够文字空间，使用 `text-anchor` 居中 |
| i18n 键名拼写错误 | 页面显示原始 key | 开发环境添加缺失翻译键警告 |
| 组件拆分引入新 Bug | 渲染或交互异常 | 拆分前后截图对比验证 |
| 响应式改动影响桌面端 | 桌面端布局变化 | 使用 min-width media query，桌面端优先 |

### 5.2 依赖项

| 依赖 | 说明 |
|------|------|
| 不新增外部依赖 | i18n 方案自研，不引入 vue-i18n |
| 现有 API 不变 | 所有优化仅涉及前端 UI，不修改 API 接口 |
| 浏览器兼容性 | 最低支持 Chrome 90+、Edge 90+、Firefox 90+ |

### 5.3 验收总标准

- [ ] 全站所有页面默认显示中文，可一键切换英文
- [ ] 配色仅含黑白灰三种颜色（语义色及图表/图片除外）
- [ ] 页面间视觉风格统一（标题、卡片、表格、间距）
- [x] 无编译错误、无控制台报错
- [ ] 所有页面在 1920px 和 768px 宽度下布局合理
- [ ] Lighthouse Performance 分数 ≥ 80
- [x] 现有测试用例全部通过

---

> **文档维护**：随着开发推进，各任务完成后在对应验收标准前打勾 `[x]`，并在提交信息中关联任务编号（如 `fix: T02 修复 AppLayout 乱码文本`）。
