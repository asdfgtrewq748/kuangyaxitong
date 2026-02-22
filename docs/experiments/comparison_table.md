# Week4 Comparison Table (2026-02-22)

## 1. Metrics Summary

| Experiment | Model | AUC | PR-AUC | Brier | F1 | MAE | RMSE | paired_significance_p |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| exp001 | kriging_baseline | 0.666667 | 0.638889 | 0.234223 | 0.400000 | 0.467937 | 0.483966 | 0.04239658 |
| exp002 | kriging_baseline (winner) | 0.666667 | 0.638889 | 0.234223 | 0.400000 | 0.467937 | 0.483966 | 0.04239658 |
| exp003 | exp003_hybrid_wo_aug | 1.000000 | 1.000000 | 0.206095 | 1.000000 | 0.452884 | 0.453977 | 0.11598980 |
| exp004 | exp004_hybrid_augmented | 0.666667 | 0.638889 | 0.256373 | 0.000000 | 0.502693 | 0.506333 | 0.23867454 |
| exp005 | exp005_wo_pinchout | 1.000000 | 1.000000 | 0.186218 | 1.000000 | 0.430347 | 0.431530 | 0.09005017 |
| exp006 | exp006_wo_spatial_zoning | 0.666667 | 0.638889 | 0.270765 | 0.000000 | 0.517254 | 0.520351 | 0.57848966 |

## 2. Delta vs Baseline (exp001)

| Experiment | Delta AUC | Delta Brier | Delta F1 |
| --- | ---: | ---: | ---: |
| exp001 | +0.000000 | +0.000000 | +0.000000 |
| exp002 | +0.000000 | +0.000000 | +0.000000 |
| exp003 | +0.333333 | -0.028128 | +0.600000 |
| exp004 | +0.000000 | +0.022150 | -0.400000 |
| exp005 | +0.333333 | -0.048005 | +0.600000 |
| exp006 | +0.000000 | +0.036542 | -0.400000 |

## 3. Ranking

- AUC Top1: `exp003` (`exp003_hybrid_wo_aug`, 1.000000)
- Brier Top1: `exp005` (`exp005_wo_pinchout`, 0.186218)

## 4. Statistical Notes

- Current `paired_significance_p` comes from the built-in paired significance approximation in the experiment runner.
- Current test sample size is small (`n=6`), so significance claims should be rechecked after larger-sample reruns.
