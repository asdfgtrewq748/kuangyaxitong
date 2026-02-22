# Week4 exp006 消融报告：去掉空间分区（2026-02-22）

## 1. 说明

- 为支持 `exp006`，本轮在后端新增 `model_type=pinchout_no_zoning`。
- 实现位置: `backend/app/services/research_manager.py`，并在 `backend/app/routes/research.py` 放开枚举。

## 2. 运行配置

- 数据集: `research_boreholes_36`
- 数据版本: `ae5f476a1eb0d25c`
- 固定 split: `split_20260222_134800_0efe6a`
- 参考:
  - exp004: `pinchout_sensitive`（`exp_20260222_142454_9626e0`）
  - exp005: `geomodel_ablation`（`exp_20260222_142628_3d261c`）
- exp006: `pinchout_no_zoning`（`exp_20260222_142844_4796d6`）

## 3. 结果

| experiment_name | auc | pr_auc | brier | f1 | mae | rmse |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| exp004_hybrid_augmented | 0.666667 | 0.638889 | 0.256373 | 0.0 | 0.502693 | 0.506333 |
| exp005_wo_pinchout | 1.000000 | 1.000000 | 0.186218 | 1.0 | 0.430347 | 0.431530 |
| exp006_wo_spatial_zoning | 0.666667 | 0.638889 | 0.270765 | 0.0 | 0.517254 | 0.520351 |

差值（`exp006 - exp004`）:

- AUC: `+0.000000`
- PR-AUC: `+0.000000`
- Brier: `+0.014392`（变差）
- F1: `+0.000000`
- RMSE: `+0.014018`（变差）

差值（`exp006 - exp005`）:

- AUC: `-0.333333`
- PR-AUC: `-0.361111`
- Brier: `+0.084547`（变差）
- F1: `-1.000000`
- RMSE: `+0.088821`（变差）

## 4. 结论

- 去掉空间分区后，指标相较 `exp004` 无提升且误差略增。
- 在当前映射体系下，`exp005` 结果优于 `exp004/exp006`，说明增强代理实现与空间分区项仍需重新设计和校准。

## 5. 产物

- 三件套目录:
  - `data/experiments/results/exp006/result.json`
  - `data/experiments/results/exp006/metrics.csv`
  - `data/experiments/results/exp006/summary.md`
- 原始实验产物:
  - `data/research/experiments/exp_20260222_142844_4796d6/result.json`
