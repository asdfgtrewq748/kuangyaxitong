# Geomodel + MPI Ops Handover

## 1. Service Topology

1. Backend: FastAPI service (`backend/app/main.py`).
2. Frontend: Vue + Vite client.
3. Data path: `DATA_DIR` (default: `backend/data`).

## 2. Required Configuration

1. Backend:
- `DATA_DIR`: absolute or relative path for CSV data and generated research/perf files.

2. Frontend:
- `VITE_API_BASE_URL`: backend address.

## 3. Startup and Health

Backend:

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

Health check:

```bash
curl http://127.0.0.1:8001/health
```

## 4. Stage E Execution Entry

One-command automated checks:

```bash
python scripts/stage_e/run_stage_e_checks.py --inprocess --skip-research
```

This command runs:

1. Targeted backend regression tests.
2. Perf baseline suite.
3. Optional research template e2e.

## 5. Monitoring Recommendations

1. API success rate (`/api/geomodel/*`, `/api/mpi/*`, `/api/research/*`).
2. P95/P99 latency for:
- `POST /api/mpi/interpolate`
- `POST /api/mpi/interpolate-geo`
- `GET /api/geomodel/jobs/{job_id}`
- `GET /api/geomodel/jobs/{job_id}/artifacts/{artifact_name}`
3. Geomodel queue size and average job duration.
4. Evidence export success rate.

## 6. Alert Recommendations

1. Success rate < 99% over rolling 10-15 minutes.
2. P95 latency breach sustained for 15 minutes.
3. Geomodel job failures surge or queue backlog grows continuously.
4. Research suite failures on known baseline datasets.

## 7. Incident and Rollback Procedure

1. Disable geology-aware path first (fallback to baseline).
2. Pause new Geomodel submissions if queue unhealthy.
3. Roll back to previous stable deployment package.
4. Run minimal smoke checks:
- Interpolation page end-to-end
- MPI baseline and geo-aware fallback
- Report page quality section

## 8. Acceptance Artifacts to Archive

1. Perf:
- Three-run JSON results
- Threshold evaluation JSON/Markdown

2. Research:
- Two real-data e2e reports
- Evidence package manifest and figures

3. Frontend:
- Filled regression record template

Reference documents:

- Stage E rollout/rollback checklist document under `docs/plans`.
- Stage E frontend regression record template under `docs/plans`.
