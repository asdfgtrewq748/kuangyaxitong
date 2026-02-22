# Week3 扩样本稳定性复核（2026-02-22）

## 1) 本次目的

- 对 Week3 中期结论进行稳健性复核。
- 将样本规模从 28 扩展到 36，并在相同模板下重跑：
  - `rsi_paper_core`
  - `geomodel_ablation`

## 2) 数据与切分

- 基线数据集（旧）: `research_boreholes_28`（28 样本）
- 扩展数据集（新）: `research_boreholes_36`（36 样本）
- 扩展来源: `data/附件/地表下沉/1-地质钻孔`（新增 8 个钻孔）
- 扩展清洗产物:
  - `data/experiments/cleaned/boreholes_extra_cleaned.csv`
  - `data/experiments/cleaned/boreholes_36_cleaned.csv`
- 泄漏审计:
  - 28 样本: `data/experiments/splits/split_leakage_audit.json` -> `all_overlap_zero=true`
  - 36 样本: `data/experiments/splits/boreholes_36/split_leakage_audit.json` -> `all_overlap_zero=true`

## 3) 套件运行结果

### 3.1 RSI 核心模板

- 28 样本套件: `suite_20260222_060425`
- 36 样本套件: `suite_20260222_134844`

| experiment_name | auc(28) | auc(36) | brier(28) | brier(36) | f1(28) | f1(36) |
|---|---:|---:|---:|---:|---:|---:|
| rsi_main | 1.0000 | 1.0000 | 0.1900 | 0.1545 | 1.0000 | 0.8571 |
| rsi_baseline | 1.0000 | 0.6667 | 0.1446 | 0.2819 | 0.6667 | 0.0000 |

结论:

- `rsi_main` 在扩样本后仍保持 AUC=1.0，Brier 更优（更低）。
- `rsi_baseline` 在扩样本后明显退化（AUC/F1/Brier 均变差），说明 28 样本下的“过于理想”现象被放大验证。

### 3.2 Geomodel 消融模板

- 28 样本套件: `suite_20260222_060448`
- 36 样本套件: `suite_20260222_134845`

| experiment_name | auc(28) | auc(36) | brier(28) | brier(36) | f1(28) | f1(36) |
|---|---:|---:|---:|---:|---:|---:|
| geomodel_full | 1.0000 | 1.0000 | 0.1960 | 0.2063 | 1.0000 | 1.0000 |
| geomodel_ablation_no_geo | 1.0000 | 1.0000 | 0.1821 | 0.2030 | 1.0000 | 0.8000 |

结论:

- 两条分支 AUC 仍相同，但扩样本后 Brier 普遍升高。
- `geomodel_full` 在 F1 上更稳定，`no_geo` 分支出现退化（1.0 -> 0.8）。

## 4) 复核结论（是否稳定）

- “AUC=1.0”的结论在主模型上仍可复现，但仅看 AUC 不足以判定稳定性。
- 扩样本后，校准与分类稳定性指标（Brier、F1）出现分化，尤其 baseline 明显退化。
- 因此 Week3 的结论应更新为：
  - 主模型具备相对稳健性；
  - 但仍需继续扩大样本与时段，避免单一分割和小样本导致的乐观偏差。

## 5) 关键产物

- 新数据集注册: `data/research/datasets/research_boreholes_36/dataset_manifest.json`
- 新套件:
  - `data/research/suites/suite_20260222_134844/summary.json`
  - `data/research/suites/suite_20260222_134845/summary.json`
