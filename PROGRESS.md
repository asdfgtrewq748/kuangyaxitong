# 矿压系统 8 周行动计划进度

- 起始日期: 2026-02-16
- 当前日期: 2026-02-22
- 当前阶段: Week 4（已完成，待进入 Week 5）

## 当前总览

- Week 1 主任务: 已完成（7/7）
- Week 2 已完成: 7/7
- 全量 E2E: 16/16 通过（2026-02-21）
- 后端单测: 324/324 通过（2026-02-22）
- 后端覆盖率: 91%（目标 80%，已超额完成）

## Week 1 效果评估

### 做得好的点

- 健康检查链路已修正并纳入路由，`/health` 与 API 健康检查可正常工作。
- Playwright E2E 从骨架推进到可执行，核心流程均已落地。
- 后端测试规模明显扩大，回归稳定性提升。
- CI 脚本从“日志字符串判断”改为“命令退出码判断”，可靠性更高。

### 仍需改进

- 覆盖率已从 58% 提升至 91%，但仍需保持新增功能的测试同步。
- 报告页真实后端计算链路耗时长，UI 在“自动计算中”停留时间过久。
- 周报文档曾有编码混乱，已开始统一为 UTF-8。

## Week 2 已完成项

- [x] E2E: 数据导入链路通过
- [x] E2E: 插值计算链路通过
- [x] E2E: MPI 指标查看通过
- [x] E2E: 模拟 + 报告通过
- [x] 前端路由审计文档（`docs/frontend-route-audit.md`）
- [x] 路由收敛（总路由数已降至 12）
- [x] Lighthouse 基准报告（`docs/performance-baseline.md`）

> 说明: 报告导出 E2E 当前采用接口桩（mock）保证稳定性，真实后端报告计算链路需单独性能治理。

## Week 2 待完成项

- [x] 无（Week2 计划项已全部完成）

## 最近关键验证（2026-02-22）

- `npm run e2e` -> 16 passed
- `frontend/src/router/index.js` 路由项计数 -> 12
- Lighthouse 基线 -> 已生成（`docs/performance-baseline.md`）
- `python -m pytest backend/tests -q` -> 324 passed
- `python -m pytest backend/tests --cov=backend/app --cov-report=term-missing` -> 91%
- `python scripts/prepare_experiment_data.py` -> 生成 28 条清洗样本
- 清洗产物: `data/experiments/cleaned/boreholes_28_cleaned.csv`
- 质量报告: `data/experiments/cleaned/boreholes_28_quality_report.json`
- `python scripts/create_experiment_splits.py --register-research-dataset-id research_boreholes_28` -> 切分与审计成功
- 切分产物: `data/experiments/splits/kfold_5_spatial_seed42.json`、`data/experiments/splits/leave_one_out_seed42.json`
- 泄漏审计: `data/experiments/splits/split_leakage_audit.json`（all_overlap_zero=true）
- 研究入口接入: `data/research/datasets/research_boreholes_28/dataset_manifest.json` + 默认 split manifest
- `run_experiment_suite(rsi_paper_core)` -> `suite_20260222_060425`
- `run_experiment_suite(geomodel_ablation)` -> `suite_20260222_060448`
- 中期报告: `docs/experiments/week3_midterm_report.md`
- 报告页后端链路优化: 新增 `GET /summary/report` + LRU/TTL缓存（`backend/app/main.py`）
- 性能实测: 旧4接口总耗时 `3385.5ms` -> 新接口冷启动 `2502.7ms`，缓存命中 `1.1ms`
- 性能分析文档: `docs/performance-report-backend.md`
- `summary/steps*` 根因修复: `pressure_steps_batch` 增加坐标过滤 + `q/t/s` 回退（`backend/app/services/pressure_steps_batch.py`）
- 修复后验证: `pressure_steps_boreholes` 28/28 可计算，`summary_steps` 不再报 `not enough points for interpolation`
- Week3 摘要接入报告页: `GET /summary/report` 新增 `research` 字段（split leakage + latest suites）
- 报告页前端展示: `frontend/src/views/Report.vue` 新增 “Week3实验进展” 章节
- 回归验证: `python -m pytest backend/tests/test_main_api.py -q` -> 13 passed
- 前端构建验证: `npm run build` -> success
- 扩样本准备: `boreholes_28` + `地表下沉`新增 8 钻孔 -> `data/experiments/cleaned/boreholes_36_cleaned.csv`
- 扩样本切分审计: `data/experiments/splits/boreholes_36/split_leakage_audit.json`（all_overlap_zero=true）
- 扩样本套件复跑:
  - `rsi_paper_core` -> `suite_20260222_134844`
  - `geomodel_ablation` -> `suite_20260222_134845`
- 稳定性报告: `docs/experiments/week3_stability_report.md`
- 性能监控接入: `summary/report` 返回 `performance`，新增 `GET /summary/report/perf`
- 结果页对比接入: 报告页支持 `28 vs 36` 稳定性对比与接口命中率展示
- 可视化脚本: `scripts/plot_experiment_results.py`
- 可视化产物: `docs/experiments/figures/week3/*.png`
- Week3 验收快照: `docs/experiments/week3_acceptance_snapshot.md`
- Week4 exp002 完成: `run_experiment_suite(rk_vs_kriging)` -> `suite_20260222_141909`
- Week4 exp002 报告: `docs/experiments/week4_exp002_report.md`
- Week4 图表产物: `docs/experiments/figures/week4/suite_20260222_141909_*.png`
- Week4 exp002 三件套目录: `data/experiments/results/exp002/`
- Week4 exp003 完成: `geomodel_aware` -> `exp_20260222_142216_86a543`（对照 `exp_20260222_141909_a01e77`）
- Week4 exp003 报告: `docs/experiments/week4_exp003_report.md`
- Week4 exp003 三件套目录: `data/experiments/results/exp003/`
- Week4 exp004 完成: `pinchout_sensitive`（增强代理映射）-> `exp_20260222_142454_9626e0`
- Week4 exp004 报告: `docs/experiments/week4_exp004_report.md`
- Week4 exp004 三件套目录: `data/experiments/results/exp004/`
- Week4 exp005 完成: `geomodel_ablation`（去掉尖灭模式）-> `exp_20260222_142628_3d261c`
- Week4 exp005 报告: `docs/experiments/week4_exp005_report.md`
- Week4 exp005 三件套目录: `data/experiments/results/exp005/`
- Week4 exp006 完成: `pinchout_no_zoning`（去掉空间分区）-> `exp_20260222_142844_4796d6`
- Week4 exp006 报告: `docs/experiments/week4_exp006_report.md`
- Week4 exp006 三件套目录: `data/experiments/results/exp006/`
- Week4 消融实现补齐: 新增 `model_type=pinchout_no_zoning`（`backend/app/services/research_manager.py`）
- Week4 基线三件套补齐: `data/experiments/results/exp001/`
- Week4 综合对比表: `docs/experiments/comparison_table.md`
- Week4 图表 6 张: `docs/experiments/figures/week4/fig1_*.png` ~ `fig6_*.png`
- 回归验证:
  - `python -m pytest backend/tests/test_research_api.py -q` -> 8 passed
- 最新验证:
  - `python -m pytest backend/tests/test_main_api.py -q` -> 15 passed
  - `npm run build` -> success

## 下一步执行顺序

1. 启动 Week5：输出后端路由合并方案（目标收敛研究/报告接口）。
2. 启动 Week5：前端 API 层适配清单（按路由变更映射）。
3. 评估是否将 `exp004` 代理实现升级为真实增强策略模型，避免实验语义漂移。
