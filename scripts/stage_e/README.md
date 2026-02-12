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
  --templates geomodel_ablation rk_vs_kriging \
  --auto-register \
  --label-column label
```

HTTP mode:

```bash
python scripts/stage_e/run_stage_e_checks.py \
  --base-url http://127.0.0.1:8001 \
  --dataset-ids ds_a ds_b
```

### Outputs

Default output directory: `data/research/stage_e/latest`

- `stage_e_auto_report.json`
- `stage_e_auto_report.md`
- `perf/evaluation.json` (if perf step enabled)
- `research/template_e2e.json` (if research step enabled)

### Notes

- `--dataset-ids` requires at least two datasets unless `--skip-research`.
- Manual acceptance items (frontend checklist, real-data verification, rollout/rollback drill) remain outside this script.
