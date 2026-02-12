# 任务计划：地质建模融合 MPI 系统

**更新日期：** 2026-02-12  
**项目：** 地质建模融合矿压 MPI 系统  
**当前阶段：** 阶段 E（验证、压测与上线）进行中  
**总周期：** 6-8 周

---

## 总目标
1. 将 `dizhijianmo` 的成熟建模能力（分层建模、智能尖灭、回归克里金、质量诊断、工程导出）服务化接入当前 MPI 系统。  
2. 形成“建模 -> 指标 -> 实证 -> 报告 -> 科研证据包”的全流程闭环。  
3. 在不破坏现有业务流程的前提下，逐步增强页面可视化和科研产出能力。

---

## 阶段路线图

### 阶段 0：融合准备与基线冻结（2-3 天）`COMPLETE`
- [x] 明确融合边界（迁移算法，不迁移 Qt UI）
- [x] 完成现有前后端与旧项目能力盘点
- [x] 产出总方案文档

**交付物：**
- `docs/plans/2026-02-10-地质建模融合MPI实施方案.md`
- `docs/plans/2026-02-10-阶段0-融合准备与基线冻结方案.md`

---

### 阶段 A：后端基座（第 1-2 周）`COMPLETE`

**目标：** 建立 Geomodel 作业服务与标准产物协议。  

**任务清单：**
- [x] 新增 `backend/app/routes/geomodel.py`
- [x] 新增 `backend/app/services/geomodel_service.py`
- [x] 新增 `backend/app/schemas/geomodel.py`
- [x] 接入任务状态、产物下载接口
- [x] 统一产物协议（`summary.json`、`quality_report.json`、`layer_*.vtp`、`model.vtk`）
- [x] 新增 `backend/tests/test_geomodel_api.py`

**验收标准：**
- [x] 可创建建模任务并成功完成
- [x] 可下载并读取标准产物
- [x] 失败场景返回明确错误

---

### 阶段 B：MPI 计算增强（第 3 周）`COMPLETE`

**目标：** 增加 geology-aware 指标能力，兼容现有 MPI 接口。  

**任务清单：**
- [x] 新增 `backend/app/services/geomodel_features.py`
- [x] 扩展 `backend/app/services/mpi_new_algorithm.py` 的地质特征输入
- [x] 新增 `POST /api/mpi/calculate-geo`
- [x] 增加地质特征来源追踪字段
- [x] 补充算法回归测试

**验收标准：**
- [x] geology-aware 与 baseline 可并行对照输出
- [x] 旧接口无行为回归
- [x] 指标结果包含可解释特征引用

---

### 阶段 C：前端接入与可视化（第 4-5 周）`COMPLETE`

**目标：** 在关键页面接入建模产物，形成 2D/3D 联动分析。  

**任务清单：**
- [x] `frontend/src/views/Interpolation.vue` 增加建模任务入口与诊断卡
- [x] `frontend/src/views/MpiHeatmapPro.vue` 增加 3D 联动入口
- [x] `frontend/src/views/AlgorithmValidation.vue` 增加地质约束开关与对照图
- [x] `frontend/src/views/Steps.vue` 增加分区步距修正建议
- [x] `frontend/src/views/Report.vue` 新增地质质量章节

**验收标准：**
- [x] 至少 3 个页面可直接消费 Geomodel 结果
- [x] 2D/3D 联动操作可用
- [x] 页面核心交互稳定

---

### 阶段 D：科研闭环与证据链（第 6 周）`COMPLETE`

**目标：** 科研工作台可一键生成可复现实验与证据包。  

**任务清单：**
- [x] 扩展 `backend/app/services/experiment_runner.py` 模板
- [x] 扩展 `frontend/src/views/ResearchWorkbench.vue` 模板配置
- [x] 新增 `geomodel_ablation` / `pinchout_effect` / `rk_vs_kriging`
- [x] 增加证据包导出（图组、统计、质量报告）
- [x] 增加实验追踪字段（数据版本、参数快照、对比结论）

**验收标准：**
- [ ] 可一键跑通模板实验
- [ ] 证据包可直接用于论文附录
- [ ] 结果可复现（同数据同参数结果一致）

---

### 阶段 E：验证、压测与上线（第 7-8 周）`TODO`

**目标：** 完成系统级质量验证并准备上线。  

**任务清单：**
- [ ] 后端接口压测与性能基线（任务队列、产物下载、大网格计算）
- [ ] 前端联调回归测试（核心页面）
- [ ] 科研模板端到端验证（至少 2 套样本数据）
- [x] 发布说明与用户指南更新
- [ ] 上线检查清单执行

**本轮进展：**
- [x] 已新增压测脚本 `scripts/perf/run_backend_perf.py`（覆盖大网格 MPI、地质增强、Geomodel 状态轮询、产物下载场景）
- [x] 已新增压测说明 `scripts/perf/README.md`
- [x] 已新增前端联调清单 `docs/plans/2026-02-11-阶段E-前端联调回归清单.md`
- [x] 已新增阈值评估脚本 `scripts/perf/evaluate_backend_perf.py` 与阈值模板 `scripts/perf/thresholds.default.json`
- [x] 已新增一键基线脚本 `scripts/perf/run_baseline_suite.py`（三轮压测 + 阈值评估 + Markdown报告）
- [x] 已新增上线与回滚清单 `docs/plans/2026-02-11-阶段E-上线与回滚检查清单.md`
- [x] 已新增联调回归记录模板 `docs/plans/2026-02-11-阶段E-联调回归记录模板.md`
- [x] 已新增科研模板端到端验证脚本 `scripts/research/validate_template_e2e.py`
- [x] 已新增阶段 E 一键执行脚本 `scripts/stage_e/run_stage_e_checks.py`
- [x] 已新增发布说明 `docs/release/2026-02-12-geomodel-mpi-release-notes.md`
- [x] 已新增用户指南 `docs/guides/geomodel-mpi-user-guide.md`
- [x] 已新增运维交接手册 `docs/ops/geomodel-mpi-ops-handover.md`
- [x] 已完成脚本自验证（2套临时样本 + `geomodel_ablation` / `rk_vs_kriging` 模板通过）
- [ ] 待在目标部署环境完成三轮基线采样并固化阈值
- [ ] 待按联调清单完成核心页面逐项验收
- [ ] 待使用 2 套真实数据执行科研模板端到端验证并归档报告

**验收标准：**
- [ ] 核心链路通过回归测试
- [ ] 关键接口性能达标
- [ ] 线上可观测性与故障回滚预案齐备

---

## 关键依赖关系

1. 阶段 A 完成后，阶段 B 才能接入稳定地质特征。  
2. 阶段 B 完成后，阶段 C 的实证/报告页面改造才有统一数据源。  
3. 阶段 C 完成后，阶段 D 才能形成完整科研证据链。  
4. 阶段 D 完成后，阶段 E 才能进行最终发布验证。

---

## 风险与缓解
1. 依赖冲突（PyKrige/VTK/Scipy）
- 缓解：Geomodel 依赖隔离、明确环境文件、提供降级方案。

2. 大网格任务耗时高
- 缓解：任务队列、分辨率分级、结果缓存、重算控制。

3. 页面复杂度抬升
- 缓解：默认模式保持简洁，专家功能分层展示。

4. 指标口径漂移
- 缓解：冻结基线样本、建立自动回归对照报表。

---

## 模块化执行入口

- 模块级清单：`docs/plans/2026-02-10-地质建模融合MPI-模块级执行清单.md`

---

## 文档索引（本轮补齐）

1. 总方案：`docs/plans/2026-02-10-地质建模融合MPI实施方案.md`  
2. 阶段 0：`docs/plans/2026-02-10-阶段0-融合准备与基线冻结方案.md`  
3. 阶段 A：`docs/plans/2026-02-10-阶段A-后端基座实施方案.md`  
4. 阶段 B：`docs/plans/2026-02-10-阶段B-MPI计算增强方案.md`  
5. 阶段 C：`docs/plans/2026-02-10-阶段C-前端接入与可视化方案.md`  
6. 阶段 D：`docs/plans/2026-02-10-阶段D-科研闭环与证据链方案.md`  
7. 阶段 E：`docs/plans/2026-02-10-阶段E-验证压测与上线方案.md`  
8. 阶段 E 联调清单：`docs/plans/2026-02-11-阶段E-前端联调回归清单.md`  
9. 阶段 E 上线与回滚清单：`docs/plans/2026-02-11-阶段E-上线与回滚检查清单.md`  
10. 阶段 E 联调记录模板：`docs/plans/2026-02-11-阶段E-联调回归记录模板.md`  
11. 模块执行清单：`docs/plans/2026-02-10-地质建模融合MPI-模块级执行清单.md`
12. 阶段 E 发布说明：`docs/release/2026-02-12-geomodel-mpi-release-notes.md`
13. 阶段 E 用户指南：`docs/guides/geomodel-mpi-user-guide.md`
14. 阶段 E 运维交接：`docs/ops/geomodel-mpi-ops-handover.md`
15. 阶段 E 自动检查脚本说明：`scripts/stage_e/README.md`
