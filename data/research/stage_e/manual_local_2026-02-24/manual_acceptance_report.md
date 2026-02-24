# Stage E Manual Acceptance Report

- generated_at: 2026-02-24 13:22:52
- base_url: http://127.0.0.1:8001
- all_passed: True

## Step Results

| Step | Status | Exit Code | Output | Note |
|---|---|---:|---|---|
| backend_health | passed | 0 | `-` | GET /health |
| geomodel_job_prepare | passed | 0 | `9614de96903a` | artifact=quality_report.json |
| perf_baseline_3runs | passed | 0 | `D:/xiangmu/kuangyaxitong/data/research/stage_e/manual_local_2026-02-24/perf_http/evaluation.json` | run_baseline_suite.py |
| frontend_e2e | passed | 0 | `-` | npm run e2e |
| research_templates_real_datasets | passed | 0 | `D:/xiangmu/kuangyaxitong/data/research/stage_e/manual_local_2026-02-24/research/template_e2e_manual.json` | validate_template_e2e.py |
| rollout_rollback_smoke | passed | 0 | `D:/xiangmu/kuangyaxitong/data/research/stage_e/manual_local_2026-02-24/rollout/rollout_smoke.json` | geomodel_job_id=9614de96903a |

## Online-Only Pending

- [ ] Execute 10%/30%/100% progressive rollout in production and observe error/latency windows.
- [ ] Run alert-routing/on-call drill with real notification channels.
- [ ] Execute rollback trigger drill under production guardrails.
- [ ] Archive 24h post-release observation report.
