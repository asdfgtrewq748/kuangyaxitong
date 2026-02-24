# Week4 exp006 消融报告：去掉空间分区（2026-02-23）

## 1. 说明

- 为支持 `exp006`，本轮在后端新增 `model_type=pinchout_no_zoning`。
- 实现位置: `backend/app/services/research_manager.py`，并在 `backend/app/routes/research.py` 放开枚举。

## 2. 运行配置

- 数据集: `research_boreholes_36`
- 数据版本: `ae5f476a1eb0d25c`
- 固定 split: `split_20260222_134800_0efe6a`
- 参考:
  - exp004: `hybrid_augmented`（`exp_20260223_113726_3bf742`）
  - exp005: `geomodel_ablation`（`exp_20260223_113726_00b4c3`）
- exp006: `pinchout_no_zoning`（`exp_20260223_113727_1ef20f`）

## 3. 结果

| experiment_name | auc | pr_auc | brier | f1 | mae | rmse |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| exp004_hybrid_augmented | 1.000000 | 1.000000 | 0.201764 | 1.0 | 0.447604 | 0.449182 |
| exp005_wo_pinchout | 1.000000 | 1.000000 | 0.189901 | 1.0 | 0.434474 | 0.435776 |
| exp006_wo_spatial_zoning | 0.333333 | 0.477778 | 0.278001 | 0.0 | 0.523113 | 0.527258 |

差值（`exp006 - exp004`）:

- AUC: `-0.666667`
- PR-AUC: `-0.522222`
- Brier: `+0.076237`（变差）
- F1: `-1.000000`
- RMSE: `+0.078076`（变差）

差值（`exp006 - exp005`）:

- AUC: `-0.666667`
- PR-AUC: `-0.522222`
- Brier: `+0.088100`（变差）
- F1: `-1.000000`
- RMSE: `+0.091482`（变差）

## 4. 结论

- 去掉空间分区后，分类和误差指标均显著劣化，说明空间分区项在当前实现中是有效贡献项。
- 结合 `exp005`，当前更可能是“空间分区有正贡献、尖灭模式项贡献不稳定”。

## 5. 产物

- 三件套目录:
  - `data/experiments/results/exp006/result.json`
  - `data/experiments/results/exp006/metrics.csv`
  - `data/experiments/results/exp006/summary.md`
- 原始实验产物:
  - `data/research/experiments/exp_20260223_113727_1ef20f/result.json`
