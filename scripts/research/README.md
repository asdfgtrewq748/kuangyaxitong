# Research Validation Scripts

## 1. validate_template_e2e.py

Validate template suite flow on 2+ existing datasets:

1. Check dataset manifest exists.
2. Create split for each dataset.
3. Run selected suite templates.
4. Export pass/fail summary report.

### Usage

In-process mode:

```bash
python scripts/research/validate_template_e2e.py \
  --inprocess \
  --dataset-ids research_demo research_demo_alt \
  --templates geomodel_ablation rk_vs_kriging \
  --output-json data/research/e2e/template_e2e.json
```

If manifests are not registered yet (but CSV files exist in `DATA_DIR`), add:

```bash
python scripts/research/validate_template_e2e.py \
  --inprocess \
  --dataset-ids research_demo research_demo_alt \
  --auto-register
```

HTTP mode:

```bash
python scripts/research/validate_template_e2e.py \
  --base-url http://127.0.0.1:8001 \
  --dataset-ids research_demo research_demo_alt \
  --templates geomodel_ablation rk_vs_kriging \
  --output-json data/research/e2e/template_e2e.json
```

### Notes

- Requires dataset CSV and manifest already available in backend data directory.
- `--auto-register` can bootstrap manifests from CSV files in `DATA_DIR`.
- `--dataset-ids` must contain at least two datasets for Stage E acceptance target.
