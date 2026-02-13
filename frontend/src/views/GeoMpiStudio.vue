<template>
  <div class="geo-mpi-studio page">
    <header class="card hero">
      <div class="hero-main">
        <p class="eyebrow">Geo-MPI Studio</p>
        <h1>Geology and MPI Spatial Studio</h1>
        <p class="subtitle">
          One-screen linkage for Geomodel, MPI, and the three sub-indicators (RSI/BRI/ASI).
          Supports baseline, geo-aware, and delta comparison modes.
        </p>
      </div>
      <div class="hero-actions">
        <button class="btn" type="button" :disabled="loadingMatrix || loadingSeams" @click="refreshMatrix">
          {{ loadingMatrix ? 'Refreshing...' : 'Run Spatial Analysis' }}
        </button>
        <button class="btn secondary" type="button" disabled>Export Snapshot</button>
      </div>
    </header>

    <section class="grid grid-main">
      <article class="card panel controls">
        <div class="panel-head">
          <h2>Control Panel</h2>
          <span class="tag">P3</span>
        </div>

        <div class="form-grid">
          <label>
            Seam
            <select v-model="seamName">
              <option v-for="item in seamOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>

          <label>
            Geomodel Job ID
            <input v-model.trim="geomodelJobId" type="text" placeholder="e.g. gm_20260212_xxx" />
          </label>

          <label>
            Resolution
            <input v-model.number="resolution" type="number" min="20" max="150" step="5" />
          </label>

          <label>
            Method
            <select v-model="method">
              <option value="idw">IDW</option>
              <option value="linear">Linear</option>
              <option value="nearest">Nearest</option>
            </select>
          </label>
        </div>

        <div class="mode-block">
          <p class="mode-title">Mode</p>
          <div class="mode-row">
            <label class="mode-item">
              <input v-model="mode" type="radio" value="baseline" />
              <span>Baseline</span>
            </label>
            <label class="mode-item">
              <input v-model="mode" type="radio" value="geo-aware" />
              <span>Geo-aware</span>
            </label>
            <label class="mode-item">
              <input v-model="mode" type="radio" value="delta" />
              <span>Delta</span>
            </label>
          </div>
        </div>

        <div class="hint">
          <span><b>mode:</b> {{ mode }}</span>
          <span><b>algorithm:</b> {{ algorithmMode || '-' }}</span>
          <span><b>fallback:</b> {{ fallbackUsed ? 'yes' : 'no' }}</span>
          <span><b>feature source:</b> {{ featureSourceMode || '-' }}</span>
          <span><b>updated:</b> {{ formatTime(lastUpdated) }}</span>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </article>

      <article class="card panel matrix">
        <div class="panel-head">
          <h2>2 x 2 Metric Matrix</h2>
          <span class="tag">MPI / RSI / BRI / ASI</span>
        </div>
        <GeoMpiMapMatrix
          :tiles="metricTiles"
          :loading="loadingMatrix"
          :selected-cell="selectedCell"
          @select-cell="handleCellSelect"
        />
      </article>

      <article class="card panel explain">
        <div class="panel-head">
          <h2>3D Linkage and Explainability</h2>
          <span class="tag">P4</span>
        </div>
        <GeoMpi3DLinkage
          :selected-cell="selectedCell"
          :geomodel-quality="geomodelQuality"
          :mode="mode"
        />
        <GeoMpiExplainPanel
          :selected-cell="selectedCell"
          :selected-values="selectedValues"
          :mode="mode"
          :algorithm-mode="algorithmMode"
          :fallback-used="fallbackUsed"
          :feature-source-mode="featureSourceMode"
          :geomodel-status="geomodelStatus"
          :geomodel-quality="geomodelQuality"
          :geomodel-artifacts="geomodelArtifacts"
          :geomodel-error="geomodelError"
        />
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import GeoMpi3DLinkage from '../components/GeoMpi3DLinkage.vue'
import GeoMpiExplainPanel from '../components/GeoMpiExplainPanel.vue'
import GeoMpiMapMatrix from '../components/GeoMpiMapMatrix.vue'
import { useGeoMpiData } from '../composables/useGeoMpiData'
import { useGeoMpiStudioState } from '../composables/useGeoMpiStudioState'

const state = useGeoMpiStudioState()
const { seamOptions, seamName, geomodelJobId, resolution, method, mode } = state

const {
  metricTiles,
  loadingSeams,
  loadingMatrix,
  error,
  lastUpdated,
  algorithmMode,
  fallbackUsed,
  featureSourceMode,
  geomodelStatus,
  geomodelQuality,
  geomodelArtifacts,
  geomodelError,
  refreshMatrix,
} = useGeoMpiData(state)

const selectedCell = ref(null)

const handleCellSelect = (payload) => {
  selectedCell.value = payload || null
}

const selectedValues = computed(() => {
  if (!selectedCell.value) return null
  const row = Number(selectedCell.value.row)
  const col = Number(selectedCell.value.col)
  if (!Number.isInteger(row) || !Number.isInteger(col)) return null
  const values = {}
  for (const tile of metricTiles.value || []) {
    const metricKey = tile?.key
    if (!metricKey) continue
    const value = tile?.grid?.[row]?.[col]
    values[metricKey] = Number.isFinite(Number(value)) ? Number(value) : null
  }
  return values
})

const formatTime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}
</script>

<style scoped>
.geo-mpi-studio {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
}

.card {
  background: var(--gradient-card);
  border: 1px solid rgba(14, 116, 144, 0.16);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-lg);
  align-items: flex-start;
}

.hero-main h1 {
  margin: 4px 0 8px;
  font-size: 28px;
}

.eyebrow {
  margin: 0;
  color: var(--color-primary);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.subtitle {
  margin: 0;
  color: var(--text-secondary);
  max-width: 860px;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.grid-main {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr) 320px;
  gap: var(--spacing-lg);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.panel-head h2 {
  margin: 0;
  font-size: 18px;
}

.tag {
  border: 1px solid rgba(15, 118, 110, 0.35);
  color: var(--color-primary);
  background: rgba(15, 118, 110, 0.08);
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 11px;
}

.form-grid {
  display: grid;
  gap: var(--spacing-sm);
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.form-grid select,
.form-grid input {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: 9px 10px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
}

.mode-block {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px dashed rgba(148, 163, 184, 0.45);
}

.mode-title {
  margin: 0 0 var(--spacing-sm);
  font-size: 12px;
  color: var(--text-secondary);
}

.mode-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.mode-item {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: var(--border-radius-sm);
  padding: 7px 8px;
  font-size: 12px;
  color: var(--text-primary);
}

.hint {
  margin-top: var(--spacing-md);
  padding: 10px;
  border-radius: var(--border-radius-sm);
  background: rgba(14, 116, 144, 0.08);
  color: var(--text-secondary);
  font-size: 12px;
  display: grid;
  gap: 4px;
}

.error {
  margin: 8px 0 0;
  color: var(--color-error);
  font-size: 12px;
}

.explain {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (max-width: 1280px) {
  .grid-main {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
  }
}
</style>
