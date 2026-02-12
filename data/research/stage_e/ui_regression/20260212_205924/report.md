# Stage E Frontend Regression Report

- generated_at: 2026-02-12T21:00:03.136351
- base_url: http://127.0.0.1:5173

| Item | Status | Detail |
|---|---|---|
| precheck | PASS | backend healthy; prepared dataset=research_demo exp_ids=['exp_20260212_125925_0341ba', 'exp_20260212_125926_4af2bb'] |
| 3.1 Interpolation | PASS | job=b2db5ef0a91a; status=completed; artifact=interpolation_layer_中砾岩.vtp |
| 3.2 MpiHeatmapPro | PASS | geo-aware compare shown; jump carried geomodel_job_id and auto-loaded status |
| 3.3 AlgorithmValidation | PASS | geo result panel reset confirmed after seam change |
| 3.4 Steps | FAIL | missing zone risk blocks |
| 3.5 Report | FAIL | Locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator(".geomodel-input-row button")
    - locator resolved to JSHandle@<button data-v-eb61a2b3="" class="btn secondary small">读取质量</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <section data-v-eb61a2b3="" class="card controls">…</section> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <section data-v-eb61a2b3="" class="card controls">…</section> intercepts pointer events
    - retrying click action
      - waiting 100ms
    19 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <section data-v-eb61a2b3="" class="card controls">…</section> intercepts pointer events
     - retrying click action
       - waiting 500ms
 |
| 3.6 ResearchWorkbench | FAIL | missing evidence files: ['manifests/dataset_quality_report.json'] |
