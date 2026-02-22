# Week4 exp003 混合建模（无增强）报告（2026-02-22）

## 1. 目标

- 执行 Week4 `exp003`，验证“混合建模（无增强）”是否优于基线 `exp001`。
- 与 `exp002` 使用同一数据版本与同一 split，保证横向可比。

## 2. 运行配置

- 数据集: `research_boreholes_36`
- 数据版本: `ae5f476a1eb0d25c`
- 固定 split: `split_20260222_134800_0efe6a`
- 基线模型（exp001 映射）: `kriging_baseline`（`exp_20260222_141909_a01e77`）
- 候选模型（exp003）: `geomodel_aware` / `exp003_hybrid_wo_aug`（`exp_20260222_142216_86a543`）

## 3. 结果对比

| experiment_name | auc | pr_auc | brier | f1 | mae | rmse |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| kriging_baseline | 0.666667 | 0.638889 | 0.234223 | 0.4 | 0.467937 | 0.483966 |
| exp003_hybrid_wo_aug | 1.000000 | 1.000000 | 0.206095 | 1.0 | 0.452884 | 0.453977 |

差值（`exp003 - baseline`）:

- AUC: `+0.333333`
- PR-AUC: `+0.361111`
- Brier: `-0.028128`（更低更好）
- F1: `+0.600000`
- RMSE: `-0.029989`（更低更好）

## 4. 结论

- 在当前固定 split 下，`exp003` 指标全面优于 `exp001` 基线。
- 由于当前测试样本量较小（test=6），该结论需在 `exp004~exp006` 与后续统计检验中继续验证稳定性。

## 5. 产物

- 实验三件套目录:
  - `data/experiments/results/exp003/result.json`
  - `data/experiments/results/exp003/metrics.csv`
  - `data/experiments/results/exp003/summary.md`
- 原始实验产物:
  - `data/research/experiments/exp_20260222_142216_86a543/result.json`
