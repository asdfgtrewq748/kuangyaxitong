# Week4 exp005 消融报告：去掉尖灭模式（2026-02-22）

## 1. 目标

- 完成 `exp005`：在 `exp004` 参考配置上去掉尖灭模式识别，评估尖灭模式贡献。

## 2. 运行配置

- 数据集: `research_boreholes_36`
- 数据版本: `ae5f476a1eb0d25c`
- 固定 split: `split_20260222_134800_0efe6a`
- 参考模型（exp004）: `pinchout_sensitive`（`exp_20260222_142454_9626e0`）
- 消融模型（exp005）: `geomodel_ablation`（`exp_20260222_142628_3d261c`）

## 3. 结果

| experiment_name | auc | pr_auc | brier | f1 | mae | rmse |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| exp004_hybrid_augmented | 0.666667 | 0.638889 | 0.256373 | 0.0 | 0.502693 | 0.506333 |
| exp005_wo_pinchout | 1.000000 | 1.000000 | 0.186218 | 1.0 | 0.430347 | 0.431530 |

差值（`exp005 - exp004`）:

- AUC: `+0.333333`
- PR-AUC: `+0.361111`
- Brier: `-0.070155`（更低更好）
- F1: `+1.000000`
- RMSE: `-0.074803`（更低更好）

## 4. 结论

- 在当前固定 split 下，去掉尖灭模式后的指标反而提升。
- 这表明当前 `exp004` 代理实现（`pinchout_sensitive`）可能引入了不稳定项，不能支持“尖灭模式带来收益”的结论。
- 建议在 `exp006` 后统一做统计检验，再决定是否重写 `exp004` 的增强实现。

## 5. 产物

- 三件套目录:
  - `data/experiments/results/exp005/result.json`
  - `data/experiments/results/exp005/metrics.csv`
  - `data/experiments/results/exp005/summary.md`
- 原始实验产物:
  - `data/research/experiments/exp_20260222_142628_3d261c/result.json`
