# 矿压 MPI 系统项目总结（用于 NotebookLM）

## 1. 项目定位

- 项目名称：矿压影响指标（MPI）系统
- 目标：将地质建模能力与矿压计算、可视化分析、科研实证流程融合，形成“数据 -> 建模 -> 指标 -> 报告 -> 科研证据包”的一体化平台。
- 技术栈：
  - 后端：FastAPI（Python）
  - 前端：Vue + Vite
  - 数据：CSV 井孔/煤层数据（`DATA_DIR`）

## 2. 代码结构总览

- 后端目录：`backend/app`
  - 路由：`routes/`（`mpi.py`、`geomodel.py`、`research.py`、`algorithm_validation.py`）
  - 服务：`services/`（建模、MPI、实验、压测评估等）
  - Schema：`schemas/geomodel.py`
- 前端目录：`frontend/src`
  - 视图页面：`views/`（`Interpolation.vue`、`MpiHeatmapPro.vue`、`AlgorithmValidation.vue`、`Steps.vue`、`Report.vue`、`ResearchWorkbench.vue`）
  - API 封装：`api.js`
- 方案文档：`docs/plans/`
- 脚本目录：`scripts/perf/`、`scripts/research/`、`scripts/stage_e/`

## 3. 核心能力

### 3.1 地质建模（Geomodel）

- 关键接口：
  - `POST /api/geomodel/jobs`
  - `GET /api/geomodel/jobs/{job_id}`
  - `GET /api/geomodel/jobs/{job_id}/artifacts`
  - `GET /api/geomodel/jobs/{job_id}/artifacts/{artifact_name}`
- 标准产物协议：
  - `summary.json`
  - `quality_report.json`
  - `layer_*.vtp`
  - `model.vtk`
- 支持方法：`thickness`、`hybrid`、`regression_kriging`、`smart_pinchout`

### 3.2 MPI 地质增强计算

- 关键接口：
  - `POST /api/mpi/calculate`
  - `POST /api/mpi/calculate-geo`
  - `POST /api/mpi/interpolate`
  - `POST /api/mpi/interpolate-geo`
- 特点：
  - baseline 与 geology-aware 双路径并行
  - 响应中包含特征追踪与回退标记（fallback）

### 3.3 科研复现实验

- 关键接口：
  - 数据集注册/切分：`/api/research/dataset/*`
  - 模板实验：`POST /api/research/experiments/run-suite`
  - 结果与产物：`/api/research/experiments/{exp_id}*`
- 模板：
  - `geomodel_ablation`
  - `pinchout_effect`
  - `rk_vs_kriging`

## 4. 前端融合与可视化

- `Interpolation.vue`：建模任务入口、质量摘要、产物下载
- `MpiHeatmapPro.vue`：地质增强热力图、联动分析入口
- `AlgorithmValidation.vue`：baseline/geo-aware 对照
- `Steps.vue`：地质约束下步距建议
- `Report.vue`：地质质量章节
- `ResearchWorkbench.vue`：模板实验运行与证据导出

## 5. 已补齐的阶段 E 工程化内容

- 压测与评估：
  - `scripts/perf/run_backend_perf.py`
  - `scripts/perf/evaluate_backend_perf.py`
  - `scripts/perf/run_baseline_suite.py`
  - `scripts/perf/thresholds.default.json`
- 科研模板端到端验证：
  - `scripts/research/validate_template_e2e.py`
- 一键阶段 E 检查：
  - `scripts/stage_e/run_stage_e_checks.py`

## 6. 文档与运维交付

- 发布说明：`docs/release/2026-02-12-geomodel-mpi-release-notes.md`
- 用户指南：`docs/guides/geomodel-mpi-user-guide.md`
- 运维交接：`docs/ops/geomodel-mpi-ops-handover.md`
- 计划总表：`task_plan.md`

## 7. 当前状态（截至 2026-02-12）

- 阶段 0-A-B-C-D：功能开发与代码落地完成。
- 阶段 E：工具链与文档已补齐，仍保留人工验收项：
  - 目标环境三轮性能基线采样与阈值固化
  - 前端联调清单逐项验收
  - 两套真实数据科研模板端到端归档
  - 上线检查与回滚演练

## 8. 后续建议

- 以真实矿区数据建立长期基线仓（性能 + 科研指标）
- 建立 Geomodel/MPI 版本化追踪（模型版本、参数快照、结果校验）
- 将阶段 E 人工清单逐步脚本化，提升发布一致性与可复现性
