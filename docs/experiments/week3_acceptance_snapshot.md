# Week3 阶段验收快照（2026-02-22）

## 验收结论

- Week3 目标状态: **已完成**
- 验收结论: **通过（进入 Week4）**

## 目标完成清单

1. 数据清洗与质量报告  
状态: 已完成  
产物:
- `data/experiments/cleaned/boreholes_28_cleaned.csv`
- `data/experiments/cleaned/boreholes_28_quality_report.json`
- `data/experiments/cleaned/boreholes_36_cleaned.csv`
- `data/experiments/cleaned/boreholes_36_quality_report.json`

2. 数据切分与泄漏审计  
状态: 已完成  
产物:
- `data/experiments/splits/kfold_5_spatial_seed42.json`
- `data/experiments/splits/split_leakage_audit.json`
- `data/experiments/splits/boreholes_36/split_leakage_audit.json`  
结论:
- 28 样本与 36 样本均为 `all_overlap_zero=true`

3. 实验套件运行（核心模板）  
状态: 已完成  
产物:
- `data/research/suites/suite_20260222_060425/summary.json`（28, rsi）
- `data/research/suites/suite_20260222_060448/summary.json`（28, geomodel）
- `data/research/suites/suite_20260222_134844/summary.json`（36, rsi）
- `data/research/suites/suite_20260222_134845/summary.json`（36, geomodel）

4. 稳定性复核（28 vs 36）  
状态: 已完成  
产物:
- `docs/experiments/week3_stability_report.md`
- 关键图表:
  - `docs/experiments/figures/week3/compare_rsi_paper_core_research_boreholes_28_vs_research_boreholes_36_auc.png`
  - `docs/experiments/figures/week3/compare_rsi_paper_core_research_boreholes_28_vs_research_boreholes_36_brier.png`
  - `docs/experiments/figures/week3/compare_geomodel_ablation_research_boreholes_28_vs_research_boreholes_36_f1.png`

5. 报告页联动与可观测性  
状态: 已完成  
产物:
- 后端: `backend/app/main.py`
  - `/summary/report` 新增 `research` 与 `performance`
  - `/summary/report/perf` 性能快照接口
- 前端: `frontend/src/views/Report.vue`
  - Week3 进展、28 vs 36 对比、缓存命中率/耗时展示

## 关键验证

- 后端回归: `python -m pytest backend/tests/test_main_api.py -q` -> `14 passed`
- 前端构建: `npm run build` -> `success`

## Week4 入口建议

1. 对 `geomodel_ablation_no_geo` 在 36 样本下的 F1 下降进行误差分层分析。  
2. 新增固定评测 split 清单并冻结版本，作为 Week4 对比基线。  
3. 继续扩样本至 >=50，并引入跨时段数据做稳健性复验。  
