# Week4 exp002 协同克里金对比报告（2026-02-22）

## 1. 目标

- 完成 Week4 `exp002`：在固定数据集与固定 split 下对比 `rk_enhanced` 与 `kriging_baseline`。
- 固化可追溯结果（suite / exp / 指标表 / 图表），为 `exp003~exp006` 提供对照基线。

## 2. 运行配置

- 数据集: `research_boreholes_36`
- 数据版本: `ae5f476a1eb0d25c`
- 固定 split: `split_20260222_134800_0efe6a`
- 模板: `rk_vs_kriging`
- suite: `suite_20260222_141909`
- 运行命令:

```powershell
$env:DATA_DIR='d:\xiangmu\kuangyaxitong\data'
python -c "import json; from app.services.experiment_runner import run_experiment_suite; print(json.dumps(run_experiment_suite(template_name='rk_vs_kriging', dataset_id='research_boreholes_36', dataset_version='ae5f476a1eb0d25c', split_id='split_20260222_134800_0efe6a', seed=42), ensure_ascii=False, indent=2))"
```

## 3. 结果对比（summary_metrics.csv）

| experiment_name | auc | pr_auc | brier | f1 | mae | rmse | paired_significance_p |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| rk_enhanced | 0.333333 | 0.477778 | 0.291073 | 0.0 | 0.533428 | 0.539512 | 0.66131819 |
| kriging_baseline | 0.666667 | 0.638889 | 0.234223 | 0.4 | 0.467937 | 0.483966 | 0.04239658 |

关键差值（`kriging_baseline - rk_enhanced`）:

- AUC: `+0.333334`
- PR-AUC: `+0.161111`
- Brier: `-0.056850`（更低更好）
- F1: `+0.400000`

## 4. 结论

- 本轮 `exp002` 已完成并产出可追溯记录。
- 在当前 36 样本与固定 split 下，`kriging_baseline` 全面优于 `rk_enhanced`。
- Week4 后续实验应以该结果作为当前对照基线，优先在 `exp003/exp004` 中验证“混合建模是否能稳定超过 kriging baseline”。

## 5. 产物清单

- Suite摘要: `data/research/suites/suite_20260222_141909/summary.json`
- 指标表: `data/research/suites/suite_20260222_141909/summary_metrics.csv`
- 单实验产物:
  - `data/research/experiments/exp_20260222_141908_11a250/result.json`
  - `data/research/experiments/exp_20260222_141909_a01e77/result.json`
- 图表:
  - `docs/experiments/figures/week4/suite_20260222_141909_auc.png`
  - `docs/experiments/figures/week4/suite_20260222_141909_pr_auc.png`
  - `docs/experiments/figures/week4/suite_20260222_141909_brier.png`
  - `docs/experiments/figures/week4/suite_20260222_141909_f1.png`
