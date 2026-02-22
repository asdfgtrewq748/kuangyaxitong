# Frontend Route Audit (Week2)

- Date: 2026-02-21
- Scope: `frontend/src/router/index.js`
- Goal: Route convergence to <= 12 total entries while keeping core workflow stable.

## Summary

- Before: 16 routes
- After: 12 routes
- Strategy: remove 4 legacy route entries and keep old URLs compatible through `alias`.

## Core Product Entrances (Kept)

1. `/data` (`DataImport`)
2. `/interpolation` (`Interpolation`)
3. `/academic-algorithm` (`AcademicAlgorithm`)
4. `/mpi-heatmap-pro` (`MpiHeatmapPro`)
5. `/algorithm-validation` (`AlgorithmValidation`)
6. `/report` (`Report`)

## Route Decisions

| Route | Decision | Notes |
|---|---|---|
| `/` | Keep | Redirects to `/algorithm-validation`. |
| `/data` | Keep | Core workflow step 1. |
| `/interpolation` | Keep | Core workflow step 2. |
| `/mpi-heatmap-pro` | Keep | Main simulation/MPI dashboard page. |
| `/academic-algorithm` | Keep | Core workflow step 3. |
| `/algorithm-validation` | Keep | Core workflow step 4. |
| `/report` | Keep | Core workflow step 5. |
| `/research-workbench` | Keep | Research workspace entry. |
| `/geo-mpi-studio` | Keep | Spatial lab entry. |
| `/geomodel-viz` | Keep | Geomodel visualization entry. |
| `/scene3d` | Keep | 3D indicator visualization entry. |
| `/steps` | Keep | Pressure steps entry. |
| `/pressure` | Remove as standalone | Legacy entry; now aliased to `/algorithm-validation`. |
| `/mpi-heatmap` | Remove as standalone | Legacy entry; now aliased to `/mpi-heatmap-pro`. |
| `/mpi-algorithm` | Remove as standalone | Legacy entry; now aliased to `/academic-algorithm`. |
| `/research-portal` | Remove as standalone | Consolidated to `/research-workbench` via alias. |

## Compatibility Mapping

| Old URL | New Target |
|---|---|
| `/pressure` | `/algorithm-validation` |
| `/mpi-heatmap` | `/mpi-heatmap-pro` |
| `/mpi-algorithm` | `/academic-algorithm` |
| `/research-portal` | `/research-workbench` |

## Verification

- `npm run e2e:smoke`: pass
- `npm run e2e`: pass (16/16)

## Risks / Follow-ups

1. Legacy view components (`PressureIndex.vue`, `MpiHeatmap.vue`, `MpiAlgorithm.vue`, `ResearchPortal.vue`) are still in codebase and should be archived in a later cleanup PR.
2. Report page real backend calculation path is slow; current E2E report tests use mocked API responses for stability.
3. Lighthouse baseline report has been generated in `docs/performance-baseline.md`.
