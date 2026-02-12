# Stage E Frontend Regression Report

- generated_at: 2026-02-12T21:07:04.993138
- base_url: http://127.0.0.1:5173

| Item | Status | Detail |
|---|---|---|
| precheck | PASS | backend healthy; prepared dataset=research_demo exp_ids=['exp_20260212_130435_48d38d', 'exp_20260212_130436_3880fa'] |
| 3.1 Interpolation | PASS | job=69f794225b68; status=completed; artifact=interpolation_layer_中砾岩.vtp |
| 3.2 MpiHeatmapPro | PASS | geo-aware compare shown; jump carried geomodel_job_id and auto-loaded status |
| 3.3 AlgorithmValidation | PASS | geo result panel reset confirmed after seam change |
| 3.4 Steps | PASS | geo summary + MPI suggestion visible; zone ratio sum=100.00% |
| 3.5 Report | FAIL | Page.wait_for_selector: Timeout 120000ms exceeded.
Call log:
  - waiting for locator(".geomodel-quality-grid") to be visible
  - waiting for locator(".geomodel-quality-grid")
 |
| 3.6 ResearchWorkbench | FAIL | missing template options: ['pinchout_effect', 'rk_vs_kriging'] |
