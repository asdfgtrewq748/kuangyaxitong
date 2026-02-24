# Stage E Automation Scripts

## 1. run_stage_e_checks.py

Run Stage E checks in one command:

1. Backend regression tests (`pytest`).
2. Backend performance baseline suite.
3. Research template e2e validation.
4. Generate merged JSON/Markdown summary report.

### Usage

In-process mode (recommended for quick local checks):

```bash
python scripts/stage_e/run_stage_e_checks.py \
  --inprocess \
  --skip-research
```

Run full pipeline (requires two datasets already prepared for research):

```bash
python scripts/stage_e/run_stage_e_checks.py \
  --inprocess \
  --dataset-ids research_demo research_demo_alt \
  --templates geomodel_ablation hybrid_augmented_upgrade rk_vs_kriging \
  --auto-register \
  --label-column label
```

HTTP mode:

```bash
python scripts/stage_e/run_stage_e_checks.py \
  --base-url http://127.0.0.1:8001 \
  --dataset-ids ds_a ds_b
```

Run perf with geomodel scenarios enabled:

```bash
python scripts/stage_e/run_stage_e_checks.py \
  --inprocess \
  --dataset-ids ds_a ds_b \
  --perf-geomodel-job-id <job_id> \
  --perf-artifact-name quality_report.json
```

### Outputs

Default output directory: `data/research/stage_e/latest`

- `stage_e_auto_report.json`
- `stage_e_auto_report.md`
- `perf/evaluation.json` (if perf step enabled)
- `research/template_e2e.json` (if research step enabled)

### Notes

- `--dataset-ids` requires at least two datasets unless `--skip-research`.
- Default research templates include `hybrid_augmented_upgrade` for weekly regression baseline.
- Perf step now auto-enables `--allow-missing-scenarios` when no `--perf-geomodel-job-id` is provided.
- Perf thresholds auto-select by mode when `--perf-thresholds` is not explicitly set:
  - in-process: `scripts/perf/thresholds.default.json`
  - HTTP mode: `scripts/perf/thresholds.http.json`
- Perf load also auto-tunes in HTTP mode when not explicitly set:
  - `--perf-requests`: `40 -> 30`
  - `--perf-concurrency`: `8 -> 6`
- Manual acceptance items (frontend checklist, real-data verification, rollout/rollback drill) remain outside this script.

## 2. run_stage_e_manual_acceptance.py

Run Stage E manual-acceptance items in one command:

1. Backend health probe.
2. Geomodel job prepare (for rollout/perf scenarios).
3. 3-round HTTP perf baseline with thresholds.
4. Frontend E2E regression command.
5. Research template e2e on two real datasets.
6. Rollout/rollback smoke perf probe.
7. Generate merged JSON/Markdown summary report.

### Usage

```bash
python scripts/stage_e/run_stage_e_manual_acceptance.py \
  --base-url http://127.0.0.1:8001 \
  --output-dir data/research/stage_e/manual_2026-02-24 \
  --dataset-ids research_boreholes_28 research_boreholes_36 \
  --auto-register \
  --label-column label
```

Dry run:

```bash
python scripts/stage_e/run_stage_e_manual_acceptance.py --dry-run
```

Skip optional steps:

```bash
python scripts/stage_e/run_stage_e_manual_acceptance.py \
  --skip-frontend \
  --skip-rollout-smoke
```

### Outputs

- `manual_acceptance_report.json`
- `manual_acceptance_report.md`
- `perf_http/evaluation.json` (if perf step enabled)
- `research/template_e2e_manual.json` (if research step enabled)
- `rollout/rollout_smoke.json` (if rollout-smoke enabled)

### Notes

- This script does **not** replace production gray release operations.
- Online-only items still need manual execution:
  - 10%/30%/100% gray rollout
  - alert-routing/on-call drill
  - rollback trigger drill
  - 24h post-release observation report
