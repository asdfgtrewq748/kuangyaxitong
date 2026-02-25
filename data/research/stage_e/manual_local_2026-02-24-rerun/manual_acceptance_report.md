# Stage E Manual Acceptance Report

- generated_at: 2026-02-24 21:52:10
- base_url: http://127.0.0.1:8001
- all_passed: False

## Step Results

| Step | Status | Exit Code | Output | Note |
|---|---|---:|---|---|
| backend_health | failed | 1 | `-` | GET /health failed status=0 err=URLError: [WinError 10061] 由于目标计算机积极拒绝，无法连接。 |
| geomodel_job_prepare | failed | 1 | `` | create geomodel job failed status=0 err=URLError: [WinError 10061] 由于目标计算机积极拒绝，无法连接。 |
| perf_baseline_3runs | failed | 1 | `D:/xiangmu/kuangyaxitong/data/research/stage_e/manual_local_2026-02-24-rerun/perf_http/evaluation.json` | run_baseline_suite.py |
| frontend_e2e | passed | 0 | `-` | npm run e2e |
| research_templates_real_datasets | failed | 2 | `D:/xiangmu/kuangyaxitong/data/research/stage_e/manual_local_2026-02-24-rerun/research/template_e2e_manual.json` | validate_template_e2e.py |
| rollout_rollback_smoke | passed | 0 | `D:/xiangmu/kuangyaxitong/data/research/stage_e/manual_local_2026-02-24-rerun/rollout/rollout_smoke.json` | geomodel_job_id=n/a |

## Online-Only Pending

- [ ] Execute 10%/30%/100% progressive rollout in production and observe error/latency windows.
- [ ] Run alert-routing/on-call drill with real notification channels.
- [ ] Execute rollback trigger drill under production guardrails.
- [ ] Archive 24h post-release observation report.
