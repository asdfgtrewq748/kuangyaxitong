# Backend Performance Scripts

This folder contains performance baseline scripts for Stage E.

## 1. Script

- `run_backend_perf.py`
  - Scenarios:
    - `mpi_interpolate_large_grid` (`POST /api/mpi/interpolate`)
    - `mpi_interpolate_geo_large_grid` (`POST /api/mpi/interpolate-geo`)
    - `geomodel_status_poll` (`GET /api/geomodel/jobs/{job_id}`)
    - `geomodel_artifact_download` (`GET /api/geomodel/jobs/{job_id}/artifacts/{name}`)
- `evaluate_backend_perf.py`
  - Read 3+ perf reports and evaluate pass/fail against threshold rules.
- `run_baseline_suite.py`
  - One-command workflow: run N rounds + evaluate thresholds + generate markdown report.
- `thresholds.default.json`
  - Default threshold template, should be tuned by real deployment baseline.

## 2. Usage

Run against local backend service:

```bash
python scripts/perf/run_backend_perf.py --base-url http://127.0.0.1:8001 --requests 80 --concurrency 16 --resolution 120
```

Run in-process (no external server process required):

```bash
python scripts/perf/run_backend_perf.py --inprocess --requests 40 --concurrency 8 --resolution 100
```

Enable Geomodel queue and artifact scenarios:

```bash
python scripts/perf/run_backend_perf.py --base-url http://127.0.0.1:8001 --geomodel-job-id <job_id> --artifact-name quality_report.json
```

Write JSON report:

```bash
python scripts/perf/run_backend_perf.py --inprocess --output-json data/research/perf/baseline.json
```

Evaluate multiple baseline runs:

```bash
python scripts/perf/evaluate_backend_perf.py \
  --reports data/research/perf/run1.json data/research/perf/run2.json data/research/perf/run3.json \
  --thresholds scripts/perf/thresholds.default.json \
  --output-json data/research/perf/eval.json
```

One command for 3-round baseline suite:

```bash
python scripts/perf/run_baseline_suite.py \
  --inprocess \
  --runs 3 \
  --requests 40 \
  --concurrency 8 \
  --resolution 100 \
  --output-dir data/research/perf/latest \
  --allow-missing-scenarios
```

If current run intentionally excludes some scenarios (for example no `geomodel_job_id`):

```bash
python scripts/perf/evaluate_backend_perf.py \
  --reports data/research/perf/run1.json data/research/perf/run2.json data/research/perf/run3.json \
  --allow-missing-scenarios
```

## 3. Suggested Baseline Protocol

1. Warm up once with low request count (`--requests 10`).
2. Run baseline 3 times with fixed args (same points/resolution/concurrency).
3. Track `success_rate`, `rps`, `latency_ms.p95`, `latency_ms.p99`.
4. Use `evaluate_backend_perf.py` to evaluate 3 runs against thresholds.
5. Keep one JSON report per run for regression comparison.

## 4. Notes

- `geomodel_status_poll` and `geomodel_artifact_download` need a valid `--geomodel-job-id`.
- Without `--geomodel-job-id`, Geomodel scenarios are skipped.
- In-process mode is useful for CI smoke benchmark and quick regression checks.
