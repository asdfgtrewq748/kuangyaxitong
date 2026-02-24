# Week6 Results Draft (Paper-Ready, EN)

## 3. Results

### 3.1 Baseline and Method Comparison

Table 1 summarizes the representative single-split comparison (fixed split: `split_20260222_134800_0efe6a`, dataset: `research_boreholes_36`). Relative to the kriging baseline, all hybrid/geomodel-aware variants improved discriminative and calibration metrics.

| Model | AUC | PR-AUC | Brier | F1 | RMSE |
| --- | ---: | ---: | ---: | ---: | ---: |
| Kriging baseline (`exp001`) | 0.666667 | 0.638889 | 0.244266 | 0.400000 | 0.494233 |
| Geomodel-aware (`exp003`) | 1.000000 | 1.000000 | 0.195077 | 1.000000 | 0.441676 |
| Hybrid-augmented (`exp004`) | 1.000000 | 1.000000 | 0.201764 | 1.000000 | 0.449182 |
| Geomodel ablation (`exp005`) | 1.000000 | 1.000000 | 0.189901 | 1.000000 | 0.435776 |
| No spatial zoning (`exp006`) | 0.333333 | 0.477778 | 0.278001 | 0.000000 | 0.527258 |

Compared with the baseline, the main hybrid/geomodel-aware settings achieved +0.333333 AUC and +0.600000 F1 gains. The no-zoning variant (`exp006`) showed substantial degradation across all metrics, indicating that spatial zoning is a core contributor under current data conditions.

### 3.2 Multi-Seed Robustness Across Two Datasets

To reduce split/seed sensitivity, we executed 5 seeds per model on two datasets with frozen splits (`research_boreholes_28`, `research_boreholes_36`; 50 runs total).

#### Dataset: `research_boreholes_36`

| Model | AUC (mean +/- std) | Brier (mean +/- std) | F1 (mean +/- std) | RMSE (mean +/- std) |
| --- | ---: | ---: | ---: | ---: |
| Kriging baseline | 0.644445 +/- 0.044444 | 0.240584 +/- 0.008727 | 0.240000 +/- 0.195959 | 0.490413 +/- 0.008884 |
| Geomodel-aware | 1.000000 +/- 0.000000 | 0.201201 +/- 0.004423 | 0.880000 +/- 0.097980 | 0.448527 +/- 0.004931 |
| Hybrid-augmented | 0.955556 +/- 0.054433 | 0.198534 +/- 0.007721 | 0.864762 +/- 0.126548 | 0.445488 +/- 0.008644 |
| Geomodel ablation | 0.933333 +/- 0.054433 | 0.205308 +/- 0.003348 | 0.822857 +/- 0.027994 | 0.453095 +/- 0.003680 |
| No spatial zoning | 0.377777 +/- 0.054433 | 0.277928 +/- 0.015162 | 0.080000 +/- 0.160000 | 0.526994 +/- 0.014348 |

Key observations on the 36-borehole dataset:

1. `geomodel_aware` achieved the highest AUC stability (1.000000 +/- 0.000000) and strong calibration (Brier 0.201201).
2. `hybrid_augmented` provided the best calibration/RMSE trade-off among top-performing models (Brier 0.198534; RMSE 0.445488).
3. Relative to baseline, `hybrid_augmented` improved AUC by +0.311111 and reduced Brier by 17.5% (`0.240584 -> 0.198534`).
4. Removing spatial zoning caused major regression (AUC 0.377777; F1 0.080000), supporting zoning as a necessary module.

#### Dataset: `research_boreholes_28`

On the smaller 28-borehole dataset, multiple models reached ceiling-level AUC (1.0). Therefore, calibration and error metrics become more discriminative. In this setting, `hybrid_augmented` and `geomodel_ablation` were competitive on Brier/RMSE, while `kriging_baseline` showed lower Brier but weaker F1 robustness.

### 3.3 Ablation Findings

The ablation sequence (`exp004`-`exp006`) suggests:

1. Spatial zoning has the strongest positive contribution (confirmed by severe drop in `exp006`).
2. The pinch-out-specific branch did not yield a stable gain on the current fixed split (`exp005` slightly improved Brier/RMSE over `exp004`), and should be interpreted as data-dependent.
3. The upgraded hybrid feature construction (`hybrid_augmented`) remains robust in multi-seed runs and should be kept as the default hybrid candidate for later large-sample validation.

### 3.4 Result Section Usage Notes

Recommended mapping for paper assets:

1. Table 2: use the Table 1 values in this file (single-split comparison).
2. Table 3: use the `research_boreholes_36` multi-seed table above.
3. Figure 8 (ablation bar chart): map from `docs/experiments/figures/week4/fig5_ablation_rmse_bar.png` and `fig6_metric_matrix.png`.
4. Robustness paragraph: cite `docs/experiments/week4_multi_seed_stability.md`.

Data sources:

- `docs/experiments/comparison_table.md`
- `docs/experiments/week4_multi_seed_stability.md`
- `data/experiments/results/week4_multi_seed_stability/stability_model_summary.csv`
