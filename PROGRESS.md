# 矿压系统 8 周行动计划进度

- 起始日期: 2026-02-16
- 当前日期: 2026-02-22
- 当前阶段: Week 2（已完成）

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

## 下一步执行顺序

1. 启动 Week3：落地 `scripts/prepare_experiment_data.py`，完成实验数据清洗与质量报告。
2. 完成数据集切分（K-fold + 固定随机种子 + 空间分层）并输出到 `data/experiments/splits/`。
3. 对报告页真实后端计算链路做性能剖析，缩短“自动计算中”等待时长。
