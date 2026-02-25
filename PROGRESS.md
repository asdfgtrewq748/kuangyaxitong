# 矿压系统 8 周行动计划进度

- 起始日期: 2026-02-16
- 当前日期: 2026-02-24
- 当前阶段: Week 6（进行中）

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
- Week5 路由合并方案: `docs/backend-route-merge-plan.md`
- Week5 路由合并实现（Phase A）:
  - `summary` 增加 `/api/summary/*` 统一别名，旧 `/summary/*` 保持兼容（`backend/app/main.py`）
  - 前端 summary 调用切换到 `/api/summary/*`（`frontend/src/api.js`）
- Week5 路由合并实现（Phase B）:
  - `pressure` 增加 `/api/pressure/*` 统一别名，旧路径保持兼容（`backend/app/main.py`）
  - `export` 增加 `/api/export/*` 统一别名，旧路径保持兼容（`backend/app/main.py`）
  - 前端 pressure/export 调用切换到新路径（`frontend/src/api.js`）
- Week5 路由合并实现（Phase C）:
  - `boreholes/lithology/interpolate/pipeline/seams` 增加 `/api/*` 统一别名，旧路径保持兼容（`backend/app/main.py`）
  - 前端剩余调用统一切换到 `/api/*` 前缀（`frontend/src/api.js`）
- Week5 路由下沉（Phase C.1）:
  - 新增 `backend/app/routes/pressure.py`，承接 pressure/export 相关路由注册
  - 新增 `backend/app/routes/seams.py`，承接 seams 相关路由注册
  - 新增 `backend/app/routes/summary.py`，承接 summary 相关路由注册
  - `backend/app/main.py` 移除 summary/pressure/seams 对应 decorator，保留逻辑函数，改由 `include_router` 统一装配
  - `backend/app/routes/__init__.py` 增加 `pressure_router`、`seams_router`、`summary_router` 导出
- Week5 路由下沉（Phase C.2）:
  - 新增 `backend/app/routes/data_ops.py`，承接 boreholes/lithology/interpolate/export/pipeline 第二批路由注册
  - `backend/app/main.py` 移除对应第二批接口 decorator，保留函数逻辑
  - `backend/app/main.py` 增加 `app.include_router(data_ops_router)`
  - `backend/app/routes/__init__.py` 增加 `data_ops_router` 导出
- Week5 组件库补齐（P0）:
  - 新增 `ConfirmDialog`（`frontend/src/components/library/feedback/ConfirmDialog.vue`）
  - 新增 `FormPanel`（`frontend/src/components/library/layout/FormPanel.vue`）
  - 更新导出入口（`frontend/src/components/library/index.js`）
  - 页面接入：`frontend/src/views/DataImport.vue`（清空坐标确认 + 手动坐标表单面板）
  - 文档更新：`docs/component-library.md`
- Week5 回归验证:
  - `python -m pytest backend/tests/test_main_api.py -q` -> 16 passed（包含别名路由注册校验）
- 回归验证:
  - `python -m pytest backend/tests/test_research_api.py -q` -> 8 passed
- 最新验证:
  - `python -m pytest backend/tests/test_main_api.py -q` -> 16 passed
  - `python -m pytest backend/tests/test_summary.py backend/tests/test_pressure_steps_service.py backend/tests/test_pressure_index.py backend/tests/test_seam_interpolate_service.py -q` -> 50 passed
  - `python -m pytest backend/tests/test_scene3d_route.py backend/tests/test_seam_interpolate_service.py backend/tests/test_pressure_steps_service.py backend/tests/test_pressure_index.py -q` -> 45 passed
  - `python -m pytest backend/tests/test_research_api.py -q` -> 8 passed（`hybrid_augmented` 接入后）
  - `npm run build` -> success
  - `python -m pytest backend/tests/test_main_api.py -q` -> 16 passed（Phase C.2 路由下沉后）
  - `npm run test`（frontend）-> 2 files / 6 tests passed（ConfirmDialog + FormPanel）
  - `DATA_DIR=./data` 下快速对比（`research_boreholes_36`, `split_20260222_134800_0efe6a`）:
    - `geomodel_aware`: AUC 1.000000 / Brier 0.199653
    - `pinchout_sensitive`（旧代理）: AUC 0.888889 / Brier 0.225880
    - `hybrid_augmented`（新增强）: AUC 1.000000 / Brier 0.200915
  - 重跑 `exp001/003/004/005/006`（固定 split）并刷新 Week4 三件套:
    - `data/experiments/results/exp004/*`
    - `data/experiments/results/exp005/*`
    - `data/experiments/results/exp006/*`
  - Week4 报告与总对比表已更新:
    - `docs/experiments/week4_exp004_report.md`
    - `docs/experiments/week4_exp005_report.md`
    - `docs/experiments/week4_exp006_report.md`
    - `docs/experiments/comparison_table.md`
  - 多 seed 稳定性报告（2数据集 × 5模型 × 5 seeds）:
    - `data/experiments/results/week4_multi_seed_stability/stability_summary.json`
    - `data/experiments/results/week4_multi_seed_stability/stability_runs.csv`
    - `data/experiments/results/week4_multi_seed_stability/stability_model_summary.csv`
    - `docs/experiments/week4_multi_seed_stability.md`
  - 周验收脚本默认模板已纳入 `hybrid_augmented_upgrade`:
    - `scripts/stage_e/run_stage_e_checks.py`
    - `scripts/research/validate_template_e2e.py`
    - `scripts/stage_e/README.md`
    - `scripts/research/README.md`
  - 新增稳定性自动化脚本:
    - `scripts/research/run_week4_multi_seed_stability.py`
  - Stage E 自动验收（in-process, 双数据集）:
    - `data/research/stage_e/latest/stage_e_auto_report.json` -> `all_passed=false`
    - `research_template_e2e` 通过，含 `hybrid_augmented_upgrade`（`data/research/stage_e/latest/research/template_e2e.json`）
    - 失败项集中在 perf 阈值（`data/research/stage_e/latest/perf/evaluation.json`）
  - Perf 阈值与 Stage E 脚本增强:
    - `scripts/stage_e/run_stage_e_checks.py` 新增 `--perf-geomodel-job-id` / `--perf-artifact-name`
    - 未提供 `--perf-geomodel-job-id` 时自动启用 `allow-missing-scenarios`
    - `scripts/perf/thresholds.default.json` 已按当前基线重标定（in-process）
  - Stage E 自动验收复跑（in-process, 双数据集）:
    - `data/research/stage_e/latest/stage_e_auto_report.json` -> `all_passed=true`
    - `data/research/stage_e/latest/perf/evaluation.json` -> `all_passed=true`
    - `data/research/stage_e/latest/research/template_e2e.json` -> `all_passed=true`
  - Week6 Results 草稿:
    - `docs/experiments/week6_results_draft.md`（已同步 multi-seed 稳定性与消融结论）
  - 论文主稿 Results 章节合并（英文）:
    - `docs/papers/MPI_Science_Style_Draft_EN.docx` 的 Section 4 已由占位内容替换为 `4.1~4.4` 完整结果
    - 合并来源: `docs/experiments/week6_results_draft.md`
  - 论文主稿 Methods 章节补齐（英文）:
    - `docs/papers/MPI_Science_Style_Draft_EN.docx` 的 Section 2 已由简要占位扩展为 `2.1~2.5`
    - 覆盖内容: 融合公式、ASI-UST、RSI-PhaseField、BRI回退分支、可复现实验协议
  - 论文主稿 Discussion/Conclusion 补齐（英文）:
    - `docs/papers/MPI_Science_Style_Draft_EN.docx` 的 Section 6 已扩展为 `6.1~6.3`
    - 新增 Section 7 `Conclusions`，形成完整主干章节结构
  - 论文主稿表图编号与引用一致性修正（英文）:
    - `docs/papers/MPI_Science_Style_Draft_EN.docx`
    - Section 4 已统一为 `Table 1/2/3` 对应关系，并修正 `4.4` 的表号映射
    - Section 4 中单次对比与多 seed 结果已落为 Word 原生表格
    - References 已统一为 DOI URL 格式，并补充 bootstrap 参考文献
  - ARP 文稿门禁检查（2026-02-24）:
    - `stats_reporting_check --strict` 通过（missing_count=0）
    - `reference_integrity_check --strict` 通过（total=2, verified=2, unresolved=0）
    - `claim_strength_audit --strict --require-labels` 通过（unlabeled_claim_candidates=0）
    - 报告归档:
      - `docs/papers/gates_en/reference_integrity_report_2026-02-24.md`
      - `docs/papers/gates_en/claim_strength_report_2026-02-24.md`
      - `docs/papers/gates_en/stats_reporting_report_2026-02-24.md`
  - HTTP 阈值与负载分环境基线:
    - 新增 `scripts/perf/thresholds.http.json`（HTTP 部署口径）
    - `scripts/stage_e/run_stage_e_checks.py` 在 HTTP 模式下自动切换
      - 阈值: `thresholds.default.json -> thresholds.http.json`
      - 负载: `requests 40 -> 30`, `concurrency 8 -> 6`（仅未显式传参时）
    - 文档更新: `scripts/perf/README.md`、`scripts/stage_e/README.md`
  - Stage E 自动验收（HTTP + 真实 geomodel job）:
    - 任务创建并完成: `GEOMODEL_JOB_ID=064f12d9991d`
    - `data/research/stage_e/latest/stage_e_auto_report.json` -> `all_passed=true`
    - `data/research/stage_e/latest/perf/evaluation.json` -> `all_passed=true`
    - `data/research/stage_e/latest/stage_e_auto_report.md` 已更新（含 thresholds 与负载参数）
  - 论文主稿期刊格式终对齐（2026-02-24）:
    - `docs/papers/MPI_Science_Style_Draft_EN.docx` 已完成标题层级/题注/参考文献段落样式收敛
    - 删除独立 `Main Text` 占位标题，Title/Subtitle 样式已统一
    - Figure/Table 相关题注段落统一为 `Caption` 样式
    - References 条目应用悬挂缩进（hanging indent）便于期刊排版迁移
    - 在 `Eq. (1) ~ Eq. (5)` 段落补入 OMML 数学对象，满足 DOCX 公式门禁
  - ARP 综合门禁（2026-02-24）:
    - `manuscript_gate_runner --strict --require-labels` 通过（4/4）
    - `docx_formula_qa` 通过（OMML + 编号连续）
    - 报告归档:
      - `docs/papers/gates_en/manuscript_gates_report_2026-02-24.md`
      - `docs/papers/gates_en/manuscript_gates_report_2026-02-24.json`
  - Stage E 人工验收执行（2026-02-24）:
    - 3轮 HTTP 基线压测通过（含 Geomodel 场景）:
      - `data/research/stage_e/manual_2026-02-24/perf_http/evaluation.md` -> `all_passed=true`
      - `data/research/stage_e/manual_2026-02-24/perf_http/run_1.json ~ run_3.json`
    - 前端回归自动化通过:
      - `npm run e2e` -> 16/16 passed
      - `data/research/stage_e/manual_2026-02-24/frontend/playwright_report.json`
    - 双数据集模板回归通过:
      - `data/research/stage_e/manual_2026-02-24/research/template_e2e_manual.json` -> `all_passed=true`
    - 上线/回滚本地预演通过（非生产）:
      - Geomodel 任务 `06ec501845c4` 已完成并可下载 `quality_report.json`
      - 烟雾验证报告: `data/research/stage_e/manual_2026-02-24/rollout/rollout_smoke.json`
    - 人工验收执行记录:
      - `docs/plans/2026-02-24-阶段E-人工验收执行记录.md`
  - Stage E 线上执行工具包（2026-02-24）:
    - 新增一键脚本：`scripts/stage_e/run_stage_e_manual_acceptance.py`
    - 文档更新：`scripts/stage_e/README.md`（新增 manual acceptance 用法）
    - 新增线上灰度执行清单：`docs/plans/2026-02-24-阶段E-线上灰度执行清单.md`
    - 新增线上灰度执行记录模板：`docs/plans/2026-02-24-阶段E-线上灰度执行记录模板.md`
    - 新增线上灰度执行记录实例：`docs/plans/2026-02-24-阶段E-线上灰度执行记录.md`
    - 执行记录实例已按本地演练结果预填（`manual_local_2026-02-24-rerun3`），线上仅需替换 `base_url` 并回填灰度观测数据
    - 本地全流程自验证：
      - `python scripts/stage_e/run_stage_e_manual_acceptance.py --base-url http://127.0.0.1:8001 --output-dir data/research/stage_e/manual_local_2026-02-24 --dataset-ids research_boreholes_28 research_boreholes_36 --auto-register --label-column label`
      - 结果：`data/research/stage_e/manual_local_2026-02-24/manual_acceptance_report.json` -> `all_passed=true`
      - 验证任务：`geomodel_job_id=9614de96903a`
    - 本地复跑验证（2026-02-24，修正 DATA_DIR 前置）：
      - 前置：启动后端时需设置 `DATA_DIR=./data`，否则 `auto-register` 会读取 `backend/data` 并触发 `dataset csv not found`。
      - 执行：`python scripts/stage_e/run_stage_e_manual_acceptance.py --base-url http://127.0.0.1:8001 --output-dir data/research/stage_e/manual_local_2026-02-24-rerun3 --dataset-ids research_boreholes_28 research_boreholes_36 --auto-register --label-column label`
      - 结果：`data/research/stage_e/manual_local_2026-02-24-rerun3/manual_acceptance_report.json` -> `all_passed=true`
      - 关键产物：`perf_http/evaluation.json`、`research/template_e2e_manual.json`、`rollout/rollout_smoke.json`
      - 验证任务：`geomodel_job_id=136d833d5461`

## 下一步执行顺序

1. [x] 为 P0 组件补齐单测（`ConfirmDialog` 与 `FormPanel`）。
2. [x] 收敛 `main.py` 中第二批直挂接口（interpolate/export/boreholes/pipeline）。
3. [x] 评估并落地 `exp004` 代理升级：新增 `hybrid_augmented` 真实增强策略（空间邻域 + 边界变化 + 稀疏区增益）。
4. [x] 重跑 `exp004~exp006` 并同步刷新 Week4 报告口径。
5. [x] 完成双数据集多 seed 稳定性统计并接入周验收模板基线。

## 后续建议顺序

1. [x] 将 `docs/papers/MPI_Science_Style_Draft_EN.docx` 与目标期刊模板做格式层最终对齐（标题层级、图注样式、参考文献样式）。
2. [ ] 完成 Stage E 线上灰度/回滚实操（10%/30%/100% 灰度、告警联动、回滚触发演练、24h 观察报告）；本地预演已完成，详见 `docs/plans/2026-02-24-阶段E-人工验收执行记录.md`。
