# 阶段 E Playwright 回归记录（更新于 2026-02-13）

## 1. 执行信息

- 全量回归脚本：scripts/qa/run_stage_e_frontend_regression_playwright.py
- 全量回归结果目录：data/research/stage_e/ui_regression/20260213_212304
- 全量回归报告：data/research/stage_e/ui_regression/20260213_212304/report.md
- 专项回归脚本：scripts/qa/run_geo_mpi_studio_playwright.py
- 专项回归结果：data/research/stage_e/ui_regression/geo_mpi_studio_20260213_212242/result.txt

## 2. 回归结果

- 全量回归：PASS=8，FAIL=0
- 通过项：
  - precheck（含数据准备 + 模板复现性验证）
  - 3.1 Interpolation
  - 3.2 MpiHeatmapPro
  - 3.3 AlgorithmValidation
  - 3.4 Steps
  - 3.5 Report
  - 3.6 ResearchWorkbench
  - 3.7 GeoMpiStudio
- Geo-MPI Studio 专项：PASS（四指标矩阵渲染 + delta 模式切换 + 解释面板 + 伪3D锚点联动通过）

## 3. 本轮结论

1. 阶段 E 前端联调清单对应核心页面全量回归通过。
2. Geo-MPI Studio 的 P3（MPI/RSI/BRI/ASI 四图矩阵）和 P4 第二批（选点到伪3D锚点 + 解释面板）均已通过 Playwright 自动化验证。
3. 阶段 E 仍待完成项集中在目标部署环境压测阈值固化、真实数据科研模板归档、上线演练与 24h 观察。

## 4. 待完成项（非本地一次性闭环）

- 目标部署环境三轮压测与阈值固化。
- 两套真实数据的科研模板端到端归档报告。
- 上线/回滚演练及发布后 24h 观察报告。
