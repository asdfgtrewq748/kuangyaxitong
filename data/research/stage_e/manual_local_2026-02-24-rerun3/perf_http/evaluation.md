# Backend Perf Baseline Report

- generated_at: 2026-02-24 22:00:51
- all_passed: True

## Scenario Results

| Scenario | Passed | Metric | Min | Max | Avg | Count | Threshold |
|---|---|---|---:|---:|---:|---:|---|
| mpi_interpolate_large_grid | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| mpi_interpolate_large_grid | True | rps | 8.3202 | 8.3689 | 8.3448 | 3 | `{"min": 3.5}` |
| mpi_interpolate_large_grid | True | latency_ms.p95 | 954.5548 | 986.0325 | 968.9694 | 3 | `{"max": 3200.0}` |
| mpi_interpolate_large_grid | True | latency_ms.p99 | 987.2544 | 1001.4504 | 996.1999 | 3 | `{"max": 3800.0}` |
| mpi_interpolate_geo_large_grid | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.97}` |
| mpi_interpolate_geo_large_grid | True | rps | 1.2022 | 1.2086 | 1.2062 | 3 | `{"min": 0.45}` |
| mpi_interpolate_geo_large_grid | True | latency_ms.p95 | 5612.9141 | 5857.8939 | 5721.6052 | 3 | `{"max": 20000.0}` |
| mpi_interpolate_geo_large_grid | True | latency_ms.p99 | 5811.3640 | 6053.2879 | 5936.3317 | 3 | `{"max": 22000.0}` |
| geomodel_status_poll | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| geomodel_status_poll | True | latency_ms.p95 | 18.8648 | 26.2398 | 22.6062 | 3 | `{"max": 800.0}` |
| geomodel_artifact_download | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| geomodel_artifact_download | True | latency_ms.p95 | 20.8431 | 24.7258 | 23.3664 | 3 | `{"max": 3000.0}` |
