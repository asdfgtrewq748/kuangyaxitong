# Week4 Multi-Seed Stability Report

- generated_at: 2026-02-23 19:50:12
- elapsed_sec: 26.89
- dataset_ids: research_boreholes_28, research_boreholes_36
- models: kriging_baseline, geomodel_aware, hybrid_augmented, geomodel_ablation, pinchout_no_zoning
- seed_count_per_model: 5

## Dataset: `research_boreholes_28`
- dataset_version: `13d60b4df0dbf296`
- split_id: `split_20260222_060239_1fa211`

| model_type | auc(mean±std) | brier(mean±std) | f1(mean±std) | rmse(mean±std) |
| --- | ---: | ---: | ---: | ---: |
| geomodel_ablation | 1.000000±0.000000 | 0.183460±0.007664 | 0.920000±0.097980 | 0.428230±0.008916 |
| geomodel_aware | 1.000000±0.000000 | 0.189773±0.002924 | 1.000000±0.000000 | 0.435616±0.003358 |
| hybrid_augmented | 1.000000±0.000000 | 0.183455±0.007803 | 1.000000±0.000000 | 0.428219±0.009150 |
| kriging_baseline | 1.000000±0.000000 | 0.136172±0.004398 | 0.666667±0.000000 | 0.368966±0.005975 |
| pinchout_no_zoning | 0.900000±0.122474 | 0.192147±0.002236 | 0.666667±0.000000 | 0.438339±0.002547 |

## Dataset: `research_boreholes_36`
- dataset_version: `ae5f476a1eb0d25c`
- split_id: `split_20260222_134800_0efe6a`

| model_type | auc(mean±std) | brier(mean±std) | f1(mean±std) | rmse(mean±std) |
| --- | ---: | ---: | ---: | ---: |
| geomodel_ablation | 0.933333±0.054433 | 0.205308±0.003348 | 0.822857±0.027994 | 0.453095±0.003680 |
| geomodel_aware | 1.000000±0.000000 | 0.201201±0.004423 | 0.880000±0.097980 | 0.448527±0.004931 |
| hybrid_augmented | 0.955556±0.054433 | 0.198534±0.007721 | 0.864762±0.126548 | 0.445488±0.008644 |
| kriging_baseline | 0.644445±0.044444 | 0.240584±0.008727 | 0.240000±0.195959 | 0.490413±0.008884 |
| pinchout_no_zoning | 0.377777±0.054433 | 0.277928±0.015162 | 0.080000±0.160000 | 0.526994±0.014348 |

## Notes

- Higher is better for AUC/F1; lower is better for Brier/RMSE.
- This report is generated from repeated runs using frozen split per dataset.

