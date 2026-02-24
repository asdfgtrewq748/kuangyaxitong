# Stage E Auto Check Report

- generated_at: 2026-02-23 22:14:39
- mode: http(http://127.0.0.1:8001)
- all_passed: True

## Step Results

| Step | Passed | Exit Code | Output | Note |
|---|---|---:|---|---|
| backend_regression_tests | True | 0 | `-` | pytest targeted suite |
| backend_perf_baseline | True | 0 | `D:/xiangmu/kuangyaxitong/data/research/stage_e/latest/perf/evaluation.json` | run_baseline_suite.py (thresholds=scripts/perf/thresholds.http.json, requests=30, concurrency=6) |
| research_template_e2e | True | 0 | `D:/xiangmu/kuangyaxitong/data/research/stage_e/latest/research/template_e2e.json` | validate_template_e2e.py |

## Manual Acceptance Still Required

- [ ] Collect three baseline perf runs in target deployment and finalize thresholds.
- [ ] Execute the Stage E frontend regression checklist document under docs/plans.
- [ ] Run research templates on two real datasets and archive reports.
- [ ] Execute the Stage E rollout and rollback checklist document under docs/plans.
