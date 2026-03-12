# Fusion Preview Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the 3D fusion preview page render a usable preview immediately on entry, with scene presets first and advanced parameters moved behind secondary controls.

**Architecture:** Keep the existing fusion data pipeline and export path, but remove the lazy-gated viewer mount in the page. Introduce a guided scene mode in the shared `GeoMpiFusion3D` component so the fusion page can lead with presets while preserving the existing expert-oriented usage in other views.

**Tech Stack:** Vue 3 SFCs with `<script setup>`, Vue Router, Vitest, Vue Test Utils, Three.js.

---

### Task 1: Lock the new entry behavior with tests

**Files:**
- Create: `frontend/tests/unit/FusionPreview.spec.js`

**Step 1: Write the failing test**
- Verify the fusion page mounts the 3D viewer automatically after initial data requests complete.
- Verify clicking a scene preset updates the guided preset passed into the viewer.

**Step 2: Run test to verify it fails**

Run: `npm test -- FusionPreview.spec.js`

Expected: FAIL because the current page hides the viewer behind `fusionSceneRequested` and has no preset rail.

**Step 3: Write minimal implementation**
- Remove the lazy-gated viewer flow from `frontend/src/views/FusionPreview.vue`.
- Add a preset rail and guided viewer props.

**Step 4: Run test to verify it passes**

Run: `npm test -- FusionPreview.spec.js`

Expected: PASS.

### Task 2: Lock the guided viewer interaction

**Files:**
- Create: `frontend/tests/unit/GeoMpiFusion3D.spec.js`

**Step 1: Write the failing test**
- Verify guided mode hides advanced controls by default.
- Verify applying a guided preset updates the underlying scene toggles.

**Step 2: Run test to verify it fails**

Run: `npm test -- GeoMpiFusion3D.spec.js`

Expected: FAIL because guided mode and guided presets do not exist yet.

**Step 3: Write minimal implementation**
- Add `guidedMode` and `guidedPreset` props to `frontend/src/components/GeoMpiFusion3D.vue`.
- Add preset application logic and a collapsed advanced controls section.

**Step 4: Run test to verify it passes**

Run: `npm test -- GeoMpiFusion3D.spec.js`

Expected: PASS.

### Task 3: Refactor the fusion page layout

**Files:**
- Modify: `frontend/src/views/FusionPreview.vue`
- Modify: `frontend/src/locales/zh-CN.js`
- Modify: `frontend/src/locales/en-US.js`

**Step 1: Implement the new page structure**
- Lead with headline, status summary, preset rail, and live viewer.
- Move seam/metric/render parameters into a secondary “advanced” panel.

**Step 2: Preserve existing capabilities**
- Keep export, reload, and validation navigation working.
- Keep manual job id override available in the advanced panel.

**Step 3: Verify with tests**

Run: `npm test -- FusionPreview.spec.js`

Expected: PASS.

### Task 4: Refactor the shared viewer controls

**Files:**
- Modify: `frontend/src/components/GeoMpiFusion3D.vue`

**Step 1: Add guided controls**
- Introduce preset buttons and helper copy for `overview`, `strata`, `stress`, and `section`.

**Step 2: Demote expert controls**
- Hide the raw toggle matrix behind an explicit advanced controls toggle in guided mode.
- Preserve the current full toolbar for existing non-guided usages.

**Step 3: Verify with tests**

Run: `npm test -- GeoMpiFusion3D.spec.js`

Expected: PASS.

### Task 5: Full verification

**Files:**
- Modify only if verification exposes issues.

**Step 1: Run targeted tests**

Run: `npm test -- FusionPreview.spec.js GeoMpiFusion3D.spec.js`

Expected: PASS.

**Step 2: Run the frontend suite**

Run: `npm test`

Expected: PASS.

**Step 3: Run a production build**

Run: `npm run build`

Expected: PASS.
