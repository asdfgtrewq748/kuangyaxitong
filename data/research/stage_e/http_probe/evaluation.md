# Backend Perf Baseline Report

- generated_at: 2026-02-23 22:12:44
- all_passed: True

## Scenario Results

| Scenario | Passed | Metric | Min | Max | Avg | Count | Threshold |
|---|---|---|---:|---:|---:|---:|---|
| mpi_interpolate_large_grid | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| mpi_interpolate_large_grid | True | rps | 3.8718 | 3.9135 | 3.8977 | 3 | `{"min": 3.5}` |
| mpi_interpolate_large_grid | True | latency_ms.p95 | 2068.5416 | 2103.1111 | 2088.3128 | 3 | `{"max": 3200.0}` |
| mpi_interpolate_large_grid | True | latency_ms.p99 | 2100.5797 | 2265.7234 | 2177.2924 | 3 | `{"max": 3800.0}` |
| mpi_interpolate_geo_large_grid | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.97}` |
| mpi_interpolate_geo_large_grid | True | rps | 0.5526 | 0.5553 | 0.5539 | 3 | `{"min": 0.45}` |
| mpi_interpolate_geo_large_grid | True | latency_ms.p95 | 12152.5958 | 12484.9511 | 12297.5821 | 3 | `{"max": 20000.0}` |
| mpi_interpolate_geo_large_grid | True | latency_ms.p99 | 12384.1455 | 12888.2034 | 12697.3366 | 3 | `{"max": 22000.0}` |
| geomodel_status_poll | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| geomodel_status_poll | True | latency_ms.p95 | 22.7464 | 26.5916 | 24.8356 | 3 | `{"max": 800.0}` |
| geomodel_artifact_download | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| geomodel_artifact_download | True | latency_ms.p95 | 17.2220 | 27.5783 | 23.2161 | 3 | `{"max": 3000.0}` |
