# Backend Perf Baseline Report

- generated_at: 2026-02-24 13:24:49
- all_passed: True

## Scenario Results

| Scenario | Passed | Metric | Min | Max | Avg | Count | Threshold |
|---|---|---|---:|---:|---:|---:|---|
| mpi_interpolate_large_grid | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| mpi_interpolate_large_grid | True | rps | 6.1704 | 6.2105 | 6.1870 | 3 | `{"min": 3.5}` |
| mpi_interpolate_large_grid | True | latency_ms.p95 | 1285.4970 | 1380.0430 | 1324.4658 | 3 | `{"max": 3200.0}` |
| mpi_interpolate_large_grid | True | latency_ms.p99 | 1376.4974 | 1435.4761 | 1406.8110 | 3 | `{"max": 3800.0}` |
| mpi_interpolate_geo_large_grid | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.97}` |
| mpi_interpolate_geo_large_grid | True | rps | 0.8981 | 0.9014 | 0.9002 | 3 | `{"min": 0.45}` |
| mpi_interpolate_geo_large_grid | True | latency_ms.p95 | 7638.7169 | 8394.4401 | 8104.6778 | 3 | `{"max": 20000.0}` |
| mpi_interpolate_geo_large_grid | True | latency_ms.p99 | 7971.7583 | 8731.7840 | 8365.8242 | 3 | `{"max": 22000.0}` |
| geomodel_status_poll | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| geomodel_status_poll | True | latency_ms.p95 | 22.2642 | 70.5320 | 39.8617 | 3 | `{"max": 800.0}` |
| geomodel_artifact_download | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| geomodel_artifact_download | True | latency_ms.p95 | 22.9254 | 26.8147 | 24.7495 | 3 | `{"max": 3000.0}` |
