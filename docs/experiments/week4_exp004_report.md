# Week4 exp004 混合建模+增强报告（2026-02-23）

## 1. 说明（升级后）

- 已新增独立 `hybrid_augmented` 模型类型，不再使用 `pinchout_sensitive` 代理映射。
- 本报告基于同一 `dataset/split` 的重跑结果更新。

## 2. 运行配置

- 数据集: `research_boreholes_36`
- 数据版本: `ae5f476a1eb0d25c`
- 固定 split: `split_20260222_134800_0efe6a`
- exp004 候选: `exp004_hybrid_augmented` / `hybrid_augmented`（`exp_20260223_113726_3bf742`）
- 参考:
  - exp001 基线 `kriging_baseline`（`exp_20260223_113724_5bc0fa`）
  - exp003 无增强混合 `geomodel_aware`（`exp_20260223_113725_dfd03e`）

## 3. 结果

| experiment_name | auc | pr_auc | brier | f1 | mae | rmse |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| exp001 / kriging_baseline | 0.666667 | 0.638889 | 0.244266 | 0.4 | 0.481094 | 0.494233 |
| exp003 / hybrid_wo_aug | 1.000000 | 1.000000 | 0.195077 | 1.0 | 0.440687 | 0.441676 |
| exp004 / hybrid_augmented | 1.000000 | 1.000000 | 0.201764 | 1.0 | 0.447604 | 0.449182 |

差值（`exp004 - exp003`）:

- AUC: `+0.000000`
- PR-AUC: `+0.000000`
- Brier: `+0.006687`（轻微变差）
- F1: `+0.000000`
- RMSE: `+0.007506`（轻微变差）

## 4. 结论

- 升级为真实 `hybrid_augmented` 后，`exp004` 分类指标（AUC/PR-AUC/F1）已恢复到与 `exp003` 同级，不再出现“代理版本”中的崩塌。
- 误差指标（Brier/RMSE）较 `exp003` 仍略高，后续需结合 `exp005/exp006` 消融判断各增强项的真实贡献。

## 5. 产物

- 三件套目录:
  - `data/experiments/results/exp004/result.json`
  - `data/experiments/results/exp004/metrics.csv`
  - `data/experiments/results/exp004/summary.md`
- 原始实验产物:
  - `data/research/experiments/exp_20260223_113726_3bf742/result.json`
