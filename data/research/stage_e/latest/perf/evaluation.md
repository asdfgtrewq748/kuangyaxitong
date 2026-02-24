# Backend Perf Baseline Report

- generated_at: 2026-02-23 22:18:02
- all_passed: True

## Scenario Results

| Scenario | Passed | Metric | Min | Max | Avg | Count | Threshold |
|---|---|---|---:|---:|---:|---:|---|
| mpi_interpolate_large_grid | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| mpi_interpolate_large_grid | True | rps | 3.9208 | 3.9626 | 3.9433 | 3 | `{"min": 3.5}` |
| mpi_interpolate_large_grid | True | latency_ms.p95 | 2014.0253 | 2022.0299 | 2018.9292 | 3 | `{"max": 3200.0}` |
| mpi_interpolate_large_grid | True | latency_ms.p99 | 2108.9433 | 2196.7474 | 2154.0823 | 3 | `{"max": 3800.0}` |
| mpi_interpolate_geo_large_grid | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.97}` |
| mpi_interpolate_geo_large_grid | True | rps | 0.5560 | 0.5606 | 0.5587 | 3 | `{"min": 0.45}` |
| mpi_interpolate_geo_large_grid | True | latency_ms.p95 | 11712.6655 | 12435.5055 | 12175.6501 | 3 | `{"max": 20000.0}` |
| mpi_interpolate_geo_large_grid | True | latency_ms.p99 | 11871.2785 | 13235.7265 | 12770.2876 | 3 | `{"max": 22000.0}` |
| geomodel_status_poll | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| geomodel_status_poll | True | latency_ms.p95 | 26.6563 | 79.3802 | 44.3629 | 3 | `{"max": 800.0}` |
| geomodel_artifact_download | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| geomodel_artifact_download | True | latency_ms.p95 | 24.6805 | 27.5666 | 25.8937 | 3 | `{"max": 3000.0}` |
