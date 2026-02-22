# Week4 exp004 混合建模+增强报告（2026-02-22）

## 1. 说明

- 该仓库当前无独立 `hybrid_augmented` 模型类型。
- 本次执行采用工程映射: `model_type=pinchout_sensitive` 作为“混合建模+增强（Proposed）”代理实现。

## 2. 运行配置

- 数据集: `research_boreholes_36`
- 数据版本: `ae5f476a1eb0d25c`
- 固定 split: `split_20260222_134800_0efe6a`
- exp004 候选: `exp004_hybrid_augmented` / `pinchout_sensitive`（`exp_20260222_142454_9626e0`）
- 参考:
  - exp001 基线 `kriging_baseline`（`exp_20260222_141909_a01e77`）
  - exp003 无增强混合 `geomodel_aware`（`exp_20260222_142216_86a543`）

## 3. 结果

| experiment_name | auc | pr_auc | brier | f1 | mae | rmse |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| exp001 / kriging_baseline | 0.666667 | 0.638889 | 0.234223 | 0.4 | 0.467937 | 0.483966 |
| exp003 / hybrid_wo_aug | 1.000000 | 1.000000 | 0.206095 | 1.0 | 0.452884 | 0.453977 |
| exp004 / hybrid_augmented(mapped) | 0.666667 | 0.638889 | 0.256373 | 0.0 | 0.502693 | 0.506333 |

差值（`exp004 - exp003`）:

- AUC: `-0.333333`
- PR-AUC: `-0.361111`
- Brier: `+0.050278`（变差）
- F1: `-1.000000`
- RMSE: `+0.052356`（变差）

## 4. 结论

- 当前代理实现下，`exp004` 未体现对 `exp003` 的增量收益，指标整体回落。
- 下一步应进入 `exp005/exp006` 消融，同时考虑是否需要在代码层新增真正的“增强策略”模型实现，避免代理映射引入偏差。

## 5. 产物

- 三件套目录:
  - `data/experiments/results/exp004/result.json`
  - `data/experiments/results/exp004/metrics.csv`
  - `data/experiments/results/exp004/summary.md`
- 原始实验产物:
  - `data/research/experiments/exp_20260222_142454_9626e0/result.json`
