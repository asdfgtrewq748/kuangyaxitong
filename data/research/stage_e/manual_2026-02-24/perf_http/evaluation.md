# Backend Perf Baseline Report

- generated_at: 2026-02-24 13:05:58
- all_passed: True

## Scenario Results

| Scenario | Passed | Metric | Min | Max | Avg | Count | Threshold |
|---|---|---|---:|---:|---:|---:|---|
| mpi_interpolate_large_grid | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| mpi_interpolate_large_grid | True | rps | 6.2004 | 6.2666 | 6.2327 | 3 | `{"min": 3.5}` |
| mpi_interpolate_large_grid | True | latency_ms.p95 | 1292.9596 | 1402.9980 | 1332.1946 | 3 | `{"max": 3200.0}` |
| mpi_interpolate_large_grid | True | latency_ms.p99 | 1318.7896 | 1456.5996 | 1389.6963 | 3 | `{"max": 3800.0}` |
| mpi_interpolate_geo_large_grid | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.97}` |
| mpi_interpolate_geo_large_grid | True | rps | 0.8957 | 0.9047 | 0.9005 | 3 | `{"min": 0.45}` |
| mpi_interpolate_geo_large_grid | True | latency_ms.p95 | 7730.6302 | 8250.1009 | 7935.7166 | 3 | `{"max": 20000.0}` |
| mpi_interpolate_geo_large_grid | True | latency_ms.p99 | 7831.5232 | 8829.9943 | 8219.1457 | 3 | `{"max": 22000.0}` |
| geomodel_status_poll | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| geomodel_status_poll | True | latency_ms.p95 | 22.4065 | 27.0271 | 24.7949 | 3 | `{"max": 800.0}` |
| geomodel_artifact_download | True | success_rate | 1.0000 | 1.0000 | 1.0000 | 3 | `{"min": 0.99}` |
| geomodel_artifact_download | True | latency_ms.p95 | 22.8536 | 30.7039 | 27.2525 | 3 | `{"max": 3000.0}` |
