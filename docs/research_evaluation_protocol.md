# Research Evaluation Protocol (MPI RSI/ASI Track)

## Scope
- Dataset type: single-mine, multi-borehole pressure records.
- Label source: real pressure labels only (`label_mode_strict=true` required for primary claims).
- Excluded from primary claim: microseismic-driven BRI evidence.

## Mandatory Metrics
- Classification: `AUC`, `PR-AUC`, `F1`, `Brier`, `ECE`.
- Spatial/regression consistency: `MAE`, `RMSE`.
- Uncertainty: `95% bootstrap CI` for all key metrics.
- Significance: paired test against baseline (`paired_significance_p`).

## Data Governance Rules
- Every run must bind to:
  - `dataset_id`
  - `dataset_version` (hash)
  - `split_id`
  - `seed`
- Splits must include leakage audit:
  - no borehole overlap across train/val/test
  - explicit time range per split

## Split Strategy
- Recommended: `time_borehole_block` or `borehole_block`.
- Ratios: `train=0.70`, `val=0.15`, `test=0.15`.
- If the test partition has only one class, report this limitation and avoid over-claiming AUC/PR-AUC.

## Experiment Templates
- `rsi_paper_core`: RSI main model + baseline.
- `asi_paper_core`: ASI-UST main model + baseline.
- Run via:
  - `POST /api/research/experiments/run`
  - `POST /api/research/experiments/run-suite`

## Artifact Requirements
- Per experiment:
  - `result.json`
  - `metrics.csv`
  - `summary.md`
- Per suite:
  - `summary.json`
  - `summary_metrics.csv`

## Reproducibility Checklist
- Same `dataset_version + split_id + seed` yields stable outputs.
- All reported tables/figures map to stored experiment artifacts.
- Evidence level is explicit:
  - `real`: strict real labels
  - `pseudo`: pseudo labels
  - `none`: no label evidence
