# Geomodel + MPI Release Notes (2026-02-12)

## 1. Release Scope

This release integrates mature geological modeling capability into the MPI system and closes Stage A-D deliverables, with Stage E automation and runbooks added.

## 2. Key New Capabilities

1. Geomodel service and artifacts:
- `POST /api/geomodel/jobs`
- `GET /api/geomodel/jobs/{job_id}`
- `GET /api/geomodel/jobs/{job_id}/artifacts`
- `GET /api/geomodel/jobs/{job_id}/artifacts/{artifact_name}`
- Standard artifacts: `summary.json`, `quality_report.json`, `layer_*.vtp`, `model.vtk`

2. Geology-aware MPI:
- `POST /api/mpi/calculate-geo`
- `POST /api/mpi/interpolate-geo`
- Geology feature trace and fallback behavior are exposed in response payloads.

3. Research reproducibility workflow:
- Experiment suite templates: `geomodel_ablation`, `pinchout_effect`, `rk_vs_kriging`
- Research export and evidence package pipeline in workbench flow.

4. Stage E scripts and checklists:
- Perf scripts: `scripts/perf/*`
- Research e2e script: `scripts/research/validate_template_e2e.py`
- Stage E one-command runner: `scripts/stage_e/run_stage_e_checks.py`

## 3. Frontend Impact

Updated pages:

- `frontend/src/views/Interpolation.vue`
- `frontend/src/views/MpiHeatmapPro.vue`
- `frontend/src/views/AlgorithmValidation.vue`
- `frontend/src/views/Steps.vue`
- `frontend/src/views/Report.vue`
- `frontend/src/views/ResearchWorkbench.vue`

## 4. Compatibility and Deployment

1. Backend runtime:
- Python 3.11+
- FastAPI stack compatible with current backend requirements

2. Data and environment:
- `DATA_DIR` must be readable/writable by backend process.
- `DATA_DIR` must contain `zuobiao.csv` and borehole CSV files.

3. Frontend:
- `VITE_API_BASE_URL` should point to backend URL.

## 5. Known Pending Acceptance Items

1. Three-round perf baseline must still be sampled in target deployment environment and thresholds finalized.
2. Frontend checklist execution remains a manual acceptance step.
3. Two real datasets for research template e2e must still be executed and archived.
4. Final rollout and rollback drill must be executed in the ops window.

## 6. Rollback Strategy

1. Disable geology-aware path and fall back to baseline MPI calculation.
2. Freeze new Geomodel task submission if queue instability occurs.
3. Roll back to previous stable backend/frontend package.
4. Re-run minimal health checks for Interpolation/MPI/Report chain.

Reference checklists:

- Stage E rollout/rollback checklist document under `docs/plans`.
- Stage E frontend regression checklist document under `docs/plans`.
