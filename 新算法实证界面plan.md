Plan: 新算法实证页面深度重构
概要：将当前纯文本/CSS 手绘的 AlgorithmValidation.vue 重构为工业级空间可视化页面。采用混合式布局（顶部统计仪表板 + 底部全矿区热力图），主图展示当前选中指标的全矿区插值热力图，右侧面板展示 RSI/BRI/ASI/MPI 四个指标缩略图供切换，算法评估保留为可折叠面板。全部 28 个钻孔数据作为内置数据自动加载，默认煤层为 16-3 煤，支持下拉切换。

Steps
Phase 1: 后端 — 新增批量指标计算端点
1.1 在 algorithm_validation.py 新增端点 GET /api/algorithm-validation/spatial-overview，接收参数 seam_name（默认 16-3煤）、resolution（默认 50）、method（默认 idw）、weights（可选 RSI/BRI/ASI 权重）。

核心逻辑：

复用 getSeamOverburden(seam_name) 获取所有钻孔的上覆岩层 + 坐标
对每个钻孔调用 _build_point() → 分别计算 calc_roof_stability(), calc_burst_risk(), calc_abutment_stress(), calc_mpi()
返回 4 组独立的控制点数据（borehole_name, x, y, rsi, bri, asi, mpi）
对 RSI/BRI/ASI/MPI 分别调用 interpolate_from_points() 生成 4 张网格
返回结构：{ boreholes: [...], grids: { rsi: grid[][], bri: grid[][], asi: grid[][], mpi: grid[][] }, bounds, statistics: { rsi: {min,max,mean}, bri: {...}, asi: {...}, mpi: {...} }, seam_name }
1.2 在 mpi_calculator.py 中新增 calc_all_indicators(point) 便捷方法，一次性返回 { rsi, bri, asi, mpi } 四个值，避免重复计算。

1.3 复用已有的 coal_seam_parser.py 中的 parse_all_boreholes() 和 rock_params_db.py 的参数填充逻辑，确保与 MPI 热力图页面一致的数据管线。

Phase 2: 前端 API 层
2.1 在 api.js 新增 API 函数：

validationSpatialOverview(seamName, resolution, method, weights) → GET /api/algorithm-validation/spatial-overview，使用 cachedGet 缓存
Phase 3: 前端页面 — 完全重写 AlgorithmValidation.vue
3.1 顶部导航栏（参考 MpiHeatmapPro.vue:2-30）：

左侧：返回按钮 + 页面标题「新算法实证」+ 分隔线 + 煤层下拉（默认 16-3 煤，选项来自 getCoalSeams()）+ 迷你统计（当前指标均值 / 最低值 / 高风险点数）
右侧：工具按钮（权重配置面板 toggle、评估面板 toggle、导出、全屏）
3.2 核心统计仪表板（页面顶部区域，约 80px 高）：

一行 4 个统计卡片，分别对应 MPI / RSI / BRI / ASI
每个卡片显示：指标名称、全区均值、最小/最大值、风险分布迷你色条
点击卡片可切换主图显示的指标（高亮选中卡片的边框）
使用全局 CSS 变量（--color-*, --shadow-*, --spacing-*）代替硬编码颜色
3.3 主可视化区域（占页面 ~75% 高度，类似 MpiHeatmapPro 的 Canvas 区域）：

左侧主图（占宽 75%）：

双层 Canvas：底层绘制当前选中指标（RSI/BRI/ASI/MPI）的全矿区插值热力图，顶层绘制钻孔标记点 + 悬停交互
复用 MpiHeatmapPro 的渲染策略：worldToScreen() / screenToWorld() 坐标映射 + viewport pan/zoom
钻孔点标记：28 个实心圆点，颜色编码对应当前指标值，悬停显示 tooltip（钻孔名、4个指标值、风险等级）
色带图例：底部或右侧连续渐变色带 + 刻度标注（使用 ODI 色盘 #3b82f6→#facc15→#fb923c→#f87171→#dc2626）
支持鼠标拖拽平移 + 滚轮缩放 + 双击适配视图
右侧指标面板（占宽 25%，可折叠）：

4 个缩略图卡片（RSI / BRI / ASI / MPI），每个约 150×120px
每个缩略图：用小 Canvas 绘制对应指标的迷你热力图 + 指标名 + 均值文字
点击缩略图 → 切换主图显示的指标（带过渡动画）
当前选中的缩略图加边框高亮
3.4 可折叠面板 — 算法评估（底部抽屉或右侧 overlay）：

保留现有的 AUC / PR-AUC / F1 / Brier Score / ECE 评估指标
保留混淆矩阵可视化
保留基线对比条形图（改用 Canvas 或 SVG 高质量渲染代替 CSS div）
默认折叠，点击顶部导航栏按钮展开
评估数据基于当前煤层所有钻孔的批量运行结果
3.5 可折叠面板 — 权重配置：

RSI / BRI / ASI 三个权重滑块（自动归一化，复用现有逻辑）
修改权重后自动重新计算所有指标和热力图（debounce 300ms）
默认折叠
3.6 悬停交互：

主图上鼠标悬停显示浮动 tooltip 卡片：
当前坐标（x, y）
当距离最近钻孔 < 阈值时：钻孔名、RSI/BRI/ASI/MPI 四个值、风险等级色块
当前插值点的指标值
缩略图悬停显示该指标的统计信息（最小/最大/均值/标准差）
Phase 4: 数据内置与自动加载
4.1 进入页面时自动调用 getCoalSeams() 加载可用煤层列表，默认选择 16-3煤。

4.2 选择煤层后自动调用 validationSpatialOverview(seamName) 获取全部 4 个指标的网格数据和钻孔级数据。

4.3 加载期间显示骨架屏动画（参考 MpiHeatmapPro 的 loading 状态），避免空白闪烁。

4.4 数据缓存：切换煤层时缓存已加载的数据，返回时直接从缓存恢复，避免重复请求。

Phase 5: 样式与视觉规范
5.1 全部使用 style.css 中定义的 CSS 变量（--color-primary, --shadow-md, --border-radius-md, --spacing-*, --transition-*），不再硬编码颜色值。

5.2 卡片样式统一：background: var(--bg-elevated), border: 1px solid var(--border-color-light), border-radius: var(--border-radius-md), box-shadow: var(--shadow-sm)，hover 时提升 shadow。

5.3 指标色盘：

MPI 使用 ODI 5 级色盘（#3b82f6→#facc15→#fb923c→#f87171→#dc2626）
RSI 使用绿→黄→红（稳定性高→低）
BRI 使用绿→黄→红（风险低→高，注意 BRI 数值越高风险越低，需反转色盘）
ASI 使用蓝→紫→红
5.4 深色顶部导航栏（background: linear-gradient(135deg, #1a1f2e, #2a2f3e)），与 MpiHeatmapPro 一致。

5.5 响应式断点：

>1400px：完整布局（统计栏 + 主图 + 侧面板）
1080px-1400px：侧面板折叠为底部横向滚动条
<1080px：单列，缩略图隐藏
Phase 6: 文件结构
文件	操作	说明
algorithm_validation.py	修改	新增 spatial-overview 端点
mpi_calculator.py	修改	新增 calc_all_indicators()
api.js	修改	新增 validationSpatialOverview()
AlgorithmValidation.vue	重写	完全重构为工业级可视化页面
frontend/src/composables/useIndicatorCanvas.js	新建	抽取 Canvas 热力图渲染逻辑（主图+缩略图复用）
frontend/src/composables/useViewport.js	新建	pan/zoom 视口变换逻辑（从 MpiHeatmapPro 中抽取通用化）
Verification
后端单元测试：调用 GET /api/algorithm-validation/spatial-overview?seam_name=16-3煤，验证返回 4 个网格 + 28 个钻孔点数据，所有指标值在 [0, 100] 范围内
前端渲染验证：切换每个指标缩略图，主图热力图正确更新且色盘对应
钻孔悬停：鼠标悬停任一钻孔点，tooltip 显示正确的 4 个指标值
煤层切换：下拉切换到 15-4 煤 / 16-1 煤等，数据刷新并重新渲染
权重调整：修改 RSI/BRI/ASI 权重后 MPI 热力图实时更新
评估面板：展开评估面板，KPI 数值正确计算
性能：28 点 × 50 分辨率 网格渲染 < 500ms，pan/zoom 流畅 60fps
Decisions
混合式布局（非全屏沉浸式）：顶部仪表板提供数据概览，底部热力图提供空间洞察，平衡信息密度与可读性
主图+侧面板模式展示 4 个指标：主区域聚焦单一指标，避免四宫格每个图太小
评估功能保留为可折叠面板：不占主视觉空间，需要时可展开
默认 16-3 煤：按用户指定，支持下拉切换
复用现有后端管线：不重新发明 MPI 计算逻辑，直接组合 coal_seam_parser + mpi_calculator + interpolate_from_points
新建 useIndicatorCanvas composable：避免在单个 Vue 文件中堆积 Canvas 逻辑，主图和缩略图共享渲染代码
BRI 色盘反转：BRI 数值越高风险越低，地图需将低 BRI（高风险）显示为红色，与其他指标视觉语义一致