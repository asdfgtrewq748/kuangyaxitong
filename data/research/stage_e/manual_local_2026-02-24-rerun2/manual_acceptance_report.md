# Stage E Manual Acceptance Report

- generated_at: 2026-02-24 21:55:23
- base_url: http://127.0.0.1:8001
- all_passed: False

## Step Results

| Step | Status | Exit Code | Output | Note |
|---|---|---:|---|---|
| backend_health | passed | 0 | `-` | GET /health |
| geomodel_job_prepare | passed | 0 | `1bcaf60f9dbd` | artifact=quality_report.json |
| perf_baseline_3runs | passed | 0 | `D:/xiangmu/kuangyaxitong/data/research/stage_e/manual_local_2026-02-24-rerun2/perf_http/evaluation.json` | run_baseline_suite.py |
| frontend_e2e | passed | 0 | `-` | npm run e2e |
| research_templates_real_datasets | failed | 2 | `D:/xiangmu/kuangyaxitong/data/research/stage_e/manual_local_2026-02-24-rerun2/research/template_e2e_manual.json` | validate_template_e2e.py |
| rollout_rollback_smoke | passed | 0 | `D:/xiangmu/kuangyaxitong/data/research/stage_e/manual_local_2026-02-24-rerun2/rollout/rollout_smoke.json` | geomodel_job_id=1bcaf60f9dbd |

## Online-Only Pending

- [ ] Execute 10%/30%/100% progressive rollout in production and observe error/latency windows.
- [ ] Run alert-routing/on-call drill with real notification channels.
- [ ] Execute rollback trigger drill under production guardrails.
- [ ] Archive 24h post-release observation report.
