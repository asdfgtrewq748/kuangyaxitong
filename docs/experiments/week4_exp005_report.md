# Week4 exp005 消融报告：去掉尖灭模式（2026-02-23）

## 1. 目标

- 完成 `exp005`：在 `exp004` 参考配置上去掉尖灭模式识别，评估尖灭模式贡献。

## 2. 运行配置

- 数据集: `research_boreholes_36`
- 数据版本: `ae5f476a1eb0d25c`
- 固定 split: `split_20260222_134800_0efe6a`
- 参考模型（exp004）: `hybrid_augmented`（`exp_20260223_113726_3bf742`）
- 消融模型（exp005）: `geomodel_ablation`（`exp_20260223_113726_00b4c3`）

## 3. 结果

| experiment_name | auc | pr_auc | brier | f1 | mae | rmse |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| exp004_hybrid_augmented | 1.000000 | 1.000000 | 0.201764 | 1.0 | 0.447604 | 0.449182 |
| exp005_wo_pinchout | 1.000000 | 1.000000 | 0.189901 | 1.0 | 0.434474 | 0.435776 |

差值（`exp005 - exp004`）:

- AUC: `+0.000000`
- PR-AUC: `+0.000000`
- Brier: `-0.011863`（更低更好）
- F1: `+0.000000`
- RMSE: `-0.013406`（更低更好）

## 4. 结论

- 在升级后的真实 `exp004` 基础上，去掉尖灭模式后分类指标持平，但误差指标（Brier/RMSE）小幅改善。
- 当前结果不支持“尖灭模式在该 split 上带来稳定收益”，建议继续扩大样本后再做结论固化。

## 5. 产物

- 三件套目录:
  - `data/experiments/results/exp005/result.json`
  - `data/experiments/results/exp005/metrics.csv`
  - `data/experiments/results/exp005/summary.md`
- 原始实验产物:
  - `data/research/experiments/exp_20260223_113726_00b4c3/result.json`
