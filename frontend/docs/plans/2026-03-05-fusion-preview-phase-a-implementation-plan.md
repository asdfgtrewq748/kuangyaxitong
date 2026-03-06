# FusionPreview Phase A Implementation Plan (2026-03-05)

## Goal
Deliver a stable and visibly smoother 3D fusion preview in 1 week without changing backend contracts.

Primary outcomes:
- Remove full-scene rebuilds for control-only interactions.
- Add quality levels (`fast`, `balanced`, `publication`) with adaptive render budget.
- Improve responsiveness under typical data volume while preserving export behavior.

## Current Bottlenecks
- Scene is rebuilt on section/axis/ratio/cloudDensity changes instead of incrementally updating render state.
  - `src/components/GeoMpiFusion3D.vue` watchers around section controls.
- Heavy geometry generation runs on UI thread every rebuild.
  - `buildStressCloud`, `buildMpiSurface`, `buildBoreholes`, `buildLayerMeshes`.
- No explicit quality profile in page state.
  - `src/views/FusionPreview.vue` has metric/resolution/method controls but no render quality control.

## Scope for Phase A
In scope:
- Incremental updates for visibility, section plane, and cloud density.
- Renderer quality profile and adaptive pixel ratio.
- Lightweight performance telemetry overlay (FPS + frame time budget).
- Keep current visual language and export API.

Out of scope:
- Full postprocessing pipeline (SSAO/Bloom/TAA).
- Shader rewrite of stress cloud.
- Worker/offscreen migration.

## Architecture Changes
### 1) Split scene lifecycle into build once + update paths
File: `src/components/GeoMpiFusion3D.vue`

Add internal update layers:
- `initRendererAndScene()`
- `buildStaticGeometry()` for layer mesh + boreholes + mpi surface
- `updateSectionState()` to update clipping threshold, section plane, visibility gates
- `updateCloudState()` to rebuild only cloud data when density changes (not full scene)
- `updateMaterialState()` for opacity and toggles

Replace broad rebuild watchers:
- Keep full rebuild only for true data changes:
  - `geomodel`, `mpiGrid`, `mpiBounds`, `stressProfile` (and only when references actually changed)
- Route control changes:
  - `showLayers/showMpiSurface/showStressCloud/showStressAnchors/showBoreholes` -> `applyVisibility()`
  - `sectionEnabled/sectionAxis/sectionRatio` -> `updateSectionState()`
  - `cloudDensity` -> `updateCloudState()` with debounce

### 2) Add quality profile and adaptive render budget
Files:
- `src/views/FusionPreview.vue`
- `src/components/GeoMpiFusion3D.vue`

New prop contract:
- `qualityProfile: 'fast' | 'balanced' | 'publication'`
- `adaptiveQuality: boolean`

Profile mapping in viewer:
- `fast`:
  - pixel ratio max 1.25
  - cloud step coarser
  - point size smaller, lower z-slices
- `balanced`:
  - current baseline
- `publication`:
  - pixel ratio max 2.0
  - denser cloud samples
  - higher geometric detail where affordable

Adaptive loop:
- Measure frame time moving average over last N frames.
- If frame time > budget for sustained window, downgrade one level.
- If frame time remains below budget, optionally restore toward selected level.
- Never change export resolution presets.

### 3) Keep export stable and deterministic
File: `src/components/GeoMpiFusion3D.vue`

Rules:
- Export uses requested width/height from caller as-is.
- Export ignores adaptive downgrade and applies deterministic camera pose.
- Add export metadata payload fields:
  - `qualityProfileUsed`
  - `adaptiveQualityAtCapture`

No breaking change to `exportFigureBlob` return structure.

## Detailed Task Breakdown
### Task A1 (Day 1): Refactor watchers and scene update boundaries
- Modify watcher groups in `GeoMpiFusion3D.vue`.
- Introduce targeted update methods.
- Add simple dirty flags for geometry/material/section.

Acceptance:
- Toggling layer visibility does not recreate renderer/controls.
- Section slider movement does not trigger full rebuild.

### Task A2 (Day 2): Implement quality profile controls in page + viewer
- Add UI controls in `FusionPreview.vue` control panel:
  - quality profile select
  - adaptive quality toggle
- Pass props to `GeoMpiFusion3D`.
- Implement profile parameter table in viewer.

Acceptance:
- Switching quality profile changes render density/pixel ratio immediately.
- No regression in seam/metric/focus controls.

### Task A3 (Day 3): Cloud rebuild isolation + debounce
- Isolate stress cloud generation into `rebuildStressCloudOnly()`.
- Debounce cloud density updates (150-250ms).
- Keep section clipping synced with cloud without full scene reset.

Acceptance:
- Dragging cloud density slider remains interactive.
- No camera reset during density/section tweaks.

### Task A4 (Day 4): Add runtime telemetry and adaptive quality guardrails
- Add optional small overlay in viewer:
  - FPS
  - avg frame ms
  - active quality
- Implement downgrade/upgrade thresholds and cooldown windows.

Acceptance:
- On constrained hardware simulation (manually setting high density), adaptive mode can step down and recover.

### Task A5 (Day 5): Verification and cleanup
- Build and manual QA on:
  - `FusionPreview`
  - `AlgorithmValidation` embedded fusion section
- Ensure no leaks from repeated seam changes.
- Keep exports unchanged in naming and packaging.

Acceptance:
- `npm run build` passes.
- No obvious memory growth over repeated open/close and seam switch loops.

## Verification Plan
Commands:
- `npm run build`
- `npm run test` (if test scope includes viewer utilities)

Manual checks:
- Open `FusionPreview`, switch seam/metric/focus and adjust section+density repeatedly.
- Confirm camera remains stable for control-only operations.
- Export main + supplement package in both `standard` and `nature`.
- Open `AlgorithmValidation` and verify embedded `GeoMpiFusion3D` behavior parity.

## Metrics (Phase A Success Criteria)
- Interaction FPS (balanced): >= 45 at 1080p with typical dataset.
- Section slider response: visual update starts within 120ms.
- Density slider response: no full scene flicker or camera reset.
- Export quality: unchanged or improved at same resolution preset.

## Risks and Mitigations
- Risk: incremental updates leave stale geometry.
  - Mitigation: explicit dirty flags + fallback one-shot rebuild button for debug.
- Risk: adaptive quality oscillation.
  - Mitigation: hysteresis thresholds + cooldown.
- Risk: behavior divergence in two consuming views.
  - Mitigation: verify both `FusionPreview.vue` and `AlgorithmValidation.vue`.

## Rollback Strategy
- Keep changes localized to:
  - `src/components/GeoMpiFusion3D.vue`
  - `src/views/FusionPreview.vue`
- If instability appears, disable adaptive mode and force `balanced` profile by default.
- Retain old rebuild path behind a temporary feature flag for one release cycle.

