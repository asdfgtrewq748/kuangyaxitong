# Week4 exp004 代理升级评估（2026-02-23）

## 1. 背景

- 原 `exp004` 使用 `model_type=pinchout_sensitive` 作为 `hybrid_augmented` 的代理实现。
- 该代理在 `week4_exp004_report` 中表现为指标回落（相对 `geomodel_aware`）。

## 2. 本次升级

- 在 `backend/app/services/research_manager.py` 中新增真实增强策略 `model_type=hybrid_augmented`。
- 增强特征不再仅依赖“薄煤层 proxy”，而是引入空间上下文:
  - 邻域厚度方差 `local_thickness_var`
  - 边界梯度 `boundary_gradient`
  - 稀疏区增益 `sparse_boost`
  - 深度不连续项 `depth_discontinuity`
- 同步将 `pinchout_sensitive` / `pinchout_no_zoning` 公式改为基于空间特征的实现，降低语义漂移。

## 3. 快速验证（同一数据版本与 split）

- 数据集: `research_boreholes_36`
- split: `split_20260222_134800_0efe6a`
- 指标对比:

| model_type | AUC | PR-AUC | Brier | F1 | RMSE |
| --- | ---: | ---: | ---: | ---: | ---: |
| `geomodel_aware` | 1.000000 | 1.000000 | 0.199653 | 0.857143 | 0.446825 |
| `pinchout_sensitive`（旧代理） | 0.888889 | 0.916667 | 0.225880 | 0.500000 | 0.475269 |
| `hybrid_augmented`（新实现） | 1.000000 | 1.000000 | 0.200915 | 0.857143 | 0.448235 |

## 4. 结论

- `hybrid_augmented` 的表现显著优于旧代理 `pinchout_sensitive`，并与 `geomodel_aware` 基本持平。
- `exp004` 口径已切换为 `hybrid_augmented`，且 `exp004~exp006` 已完成重跑并同步到 Week4 报告。
