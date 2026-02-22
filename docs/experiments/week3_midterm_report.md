# Week3 中期实验报告（2026-02-22）

## 1. 数据与切分

- 数据集: `research_boreholes_28`
- 数据版本: `13d60b4df0dbf296`
- 样本数: 28
- 默认 split: `split_20260222_060239_1fa211`
- KFold 切分文件: `data/experiments/splits/kfold_5_spatial_seed42.json`
- LOO 切分文件: `data/experiments/splits/leave_one_out_seed42.json`
- 泄漏审计: `data/experiments/splits/split_leakage_audit.json`
- 审计结论: `all_overlap_zero = true`（样本 / 钻孔 / 时间重叠均为 0）

## 2. 套件结果

### 2.1 RSI 核心对比（`rsi_paper_core`）

- suite: `suite_20260222_060425`
- 结果文件: `data/research/suites/suite_20260222_060425/summary.json`

| experiment_name | model_type | auc | pr_auc | brier | f1 | mae | rmse |
|---|---|---:|---:|---:|---:|---:|---:|
| rsi_main | rsi_phase_field | 1.0000 | 1.0000 | 0.1900 | 1.0000 | 0.4306 | 0.4359 |
| rsi_baseline | baseline | 1.0000 | 1.0000 | 0.1446 | 0.6667 | 0.3400 | 0.3802 |

结论:
- AUC 最优: `rsi_main`（1.0000）
- Brier 最优: `rsi_baseline`（0.1446）

### 2.2 Geomodel 消融（`geomodel_ablation`）

- suite: `suite_20260222_060448`
- 结果文件: `data/research/suites/suite_20260222_060448/summary.json`

| experiment_name | model_type | auc | pr_auc | brier | f1 | mae | rmse |
|---|---|---:|---:|---:|---:|---:|---:|
| geomodel_full | geomodel_aware | 1.0000 | 1.0000 | 0.1960 | 1.0000 | 0.4421 | 0.4428 |
| geomodel_ablation_no_geo | geomodel_ablation | 1.0000 | 1.0000 | 0.1821 | 1.0000 | 0.4256 | 0.4267 |

结论:
- AUC 最优: `geomodel_full`（1.0000）
- Brier 最优: `geomodel_ablation_no_geo`（0.1821）

## 3. 当前判断

- 流程完整性: 清洗 -> 切分 -> 研究入口注册 -> 套件运行，链路已打通。
- 数据规模风险: 当前仅 28 样本，AUC=1.0 结果存在明显“过于理想”风险，需要在后续扩充样本后复核结论稳健性。

## 4. 下一步建议

1. 增补外部时段或邻区样本，提升样本规模与分布多样性。
2. 固化一套固定评测 split（不可变）用于后续模型迭代横向对比。
3. 将该报告中的关键指标接入前端“结果报告中心”自动展示。

