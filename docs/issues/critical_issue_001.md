# Critical Issue 001: Repo-Root Pytest Collection Failure

## Severity
Critical

## Detected On
2026-02-16

## Evidence
Command executed at repo root:

```powershell
python -m pytest backend/tests -q
```

Observed failure during collection:

- `ModuleNotFoundError: No module named 'app'`
- Affected files: multiple backend tests importing `from app...`

## Root Cause
When pytest is executed from repository root, `backend/` is not on `sys.path`, so the backend package root (`app`) cannot be resolved.

## Impact
- Backend regression tests cannot run from a standard CI entrypoint at repository root.
- Week1 quality gate execution is blocked before actual tests start.
- One-click check scripts are unreliable across environments.

## Fix
- Added repo-level `pytest.ini` with:
  - `pythonpath = backend`
- Added regression test:
  - `backend/tests/test_environment_bootstrap.py`

## Verification
Run at repo root:

```powershell
python -m pytest backend/tests -q
```

Expected:
- Tests collect and execute successfully (no `ModuleNotFoundError: app`).

