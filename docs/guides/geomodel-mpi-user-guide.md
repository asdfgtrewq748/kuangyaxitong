# Geomodel + MPI User Guide

## 1. Who This Is For

1. Engineering users: run geological modeling + MPI analysis workflow.
2. Research users: run reproducible experiment templates and export evidence packages.
3. Ops/Test users: execute Stage E scripts and checklists.

## 2. Prerequisites

1. Backend is running and reachable.
2. Frontend is running and points to backend (`VITE_API_BASE_URL`).
3. `DATA_DIR` has required CSV files, including `zuobiao.csv`.

## 3. Core Workflow

### 3.1 Build Geomodel Job

1. Open `Interpolation` page.
2. Select seam and modeling method.
3. Create job and wait for status `completed`.
4. Check quality summary and download artifacts if needed.

### 3.2 Run Geology-aware MPI

1. Open `MpiHeatmapPro`.
2. Enable geology-aware mode.
3. Input/select `geomodel_job_id`.
4. Run interpolation and compare baseline vs geo-aware outputs.

### 3.3 Validate in Analysis Pages

1. `AlgorithmValidation`: run baseline vs geo-aware comparison.
2. `Steps`: inspect geology-constrained step recommendations.
3. `Report`: load Geomodel quality section and export report assets.

### 3.4 Research Templates

1. Open `ResearchWorkbench`.
2. Select template (`geomodel_ablation` / `pinchout_effect` / `rk_vs_kriging`).
3. Select dataset + split.
4. Run suite and export evidence package.

## 4. Script-Based Validation

Quick local smoke:

```bash
python scripts/stage_e/run_stage_e_checks.py --inprocess --skip-research
```

Full run (requires two prepared datasets):

```bash
python scripts/stage_e/run_stage_e_checks.py \
  --inprocess \
  --dataset-ids research_demo research_demo_alt \
  --templates geomodel_ablation rk_vs_kriging \
  --auto-register
```

Reports are written to:

- `data/research/stage_e/latest/stage_e_auto_report.json`
- `data/research/stage_e/latest/stage_e_auto_report.md`

## 5. Troubleshooting

1. `404 data dir not found`:
- Check `DATA_DIR` env and directory permissions.

2. `split failed` in research e2e:
- Confirm dataset manifest exists and required columns are present.

3. `geomodel artifact not found`:
- Ensure job status is `completed` and artifact name is correct.

4. Perf step fails with missing scenarios:
- Provide `geomodel_job_id`, or use `--perf-allow-missing-scenarios` for partial baseline runs.

## 6. What Still Needs Manual Acceptance

1. Frontend checklist execution:
- Stage E frontend regression checklist document under `docs/plans`.

2. Rollout and rollback check:
- Stage E rollout/rollback checklist document under `docs/plans`.

3. Real-data research e2e archive:
- Two real datasets must be run and archived for final acceptance.
