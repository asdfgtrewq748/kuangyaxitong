# Critical Issue 002: Frontend Validation Fails with Connection Refused

## Severity
Critical

## Detected On
2026-02-16

## Evidence
From `agent_team/optimization_reports/cycle_20260216_183334.json` validation section:

- `Page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/geomodel-visualization`
- `Page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/research-workbench`
- `Page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/mpi-heatmap-pro`

## Root Cause
E2E/validation execution did not have a standardized Playwright harness that auto-starts required web services (frontend + backend). Test runners assumed services were already running.

## Impact
- Validation step fails before business assertions.
- Quality gate cannot reliably indicate true frontend stability.
- Agent-team optimization cycles repeatedly report false-negative UI failures.

## Fix
- Added Playwright baseline framework:
  - `tests/e2e/playwright.config.ts`
  - auto-start backend (`uvicorn`, port `8001`)
  - auto-start frontend (`vite`, port `5173`)
- Added smoke regression:
  - `tests/e2e/smoke.spec.ts`
- Added convenient npm scripts for execution:
  - `e2e`, `e2e:smoke`

## Verification
At repo root:

```powershell
npx playwright test -c tests/e2e/playwright.config.ts tests/e2e/smoke.spec.ts --reporter=list
```

Expected:
- Services auto-start by Playwright `webServer`.
- Smoke test passes and no `ERR_CONNECTION_REFUSED`.

