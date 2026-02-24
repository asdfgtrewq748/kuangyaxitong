# Week4 Comparison Table (2026-02-23)

## 1. Metrics Summary

| Experiment | Model | AUC | PR-AUC | Brier | F1 | MAE | RMSE | paired_significance_p |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| exp001 | exp001_kriging_baseline | 0.666667 | 0.638889 | 0.244266 | 0.400000 | 0.481094 | 0.494233 | 0.04786895 |
| exp002 | kriging_baseline (winner) | 0.666667 | 0.638889 | 0.244266 | 0.400000 | 0.481094 | 0.494233 | 0.04786895 |
| exp003 | exp003_hybrid_wo_aug | 1.000000 | 1.000000 | 0.195077 | 1.000000 | 0.440687 | 0.441676 | 0.11532680 |
| exp004 | exp004_hybrid_augmented | 1.000000 | 1.000000 | 0.201764 | 1.000000 | 0.447604 | 0.449182 | 0.11072013 |
| exp005 | exp005_wo_pinchout | 1.000000 | 1.000000 | 0.189901 | 1.000000 | 0.434474 | 0.435776 | 0.10683865 |
| exp006 | exp006_wo_spatial_zoning | 0.333333 | 0.477778 | 0.278001 | 0.000000 | 0.523113 | 0.527258 | 0.41451446 |

## 2. Delta vs Baseline (exp001)

| Experiment | Delta AUC | Delta Brier | Delta F1 |
| --- | ---: | ---: | ---: |
| exp001 | +0.000000 | +0.000000 | +0.000000 |
| exp002 | +0.000000 | +0.000000 | +0.000000 |
| exp003 | +0.333333 | -0.049189 | +0.600000 |
| exp004 | +0.333333 | -0.042502 | +0.600000 |
| exp005 | +0.333333 | -0.054365 | +0.600000 |
| exp006 | -0.333334 | +0.033735 | -0.400000 |

## 3. Ranking

- AUC Top1 (tie): `exp003` / `exp004` / `exp005` (all `1.000000`)
- Brier Top1: `exp005` (`exp005_wo_pinchout`, 0.189901)

## 4. Statistical Notes

- Current `paired_significance_p` comes from the built-in paired significance approximation in the experiment runner.
- Current test sample size is small (`n=6`), so significance claims should be rechecked after larger-sample reruns.
