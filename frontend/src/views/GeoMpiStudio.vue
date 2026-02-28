<template>
  <div class="geo-mpi-studio page">
    <PageHeader
      class="main-header"
      :eyebrow="t('geoMpiStudio.eyebrow')"
      :title="t('geoMpiStudio.title')"
      :description="t('geoMpiStudio.subtitle')"
    >
      <template #actions>
        <div class="hero-actions">
          <button class="btn" type="button" :disabled="loadingMatrix || loadingSeams" @click="refreshMatrix">
            {{ loadingMatrix ? t('geoMpiStudio.refreshing') : t('geoMpiStudio.runSpatialAnalysis') }}
          </button>
          <button class="btn secondary" type="button" disabled>{{ t('geoMpiStudio.exportSnapshot') }}</button>
        </div>
      </template>
    </PageHeader>

    <section class="grid grid-main">
      <article class="card panel controls">
        <div class="panel-head">
          <h2>{{ t('geoMpiStudio.controlPanel') }}</h2>
          <span class="tag">P3</span>
        </div>

        <div class="form-grid">
          <label>
            {{ t('geoMpiStudio.seam') }}
            <select v-model="seamName">
              <option v-for="item in seamOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>

          <label>
            {{ t('geoMpiStudio.geomodelJobId') }}
            <input
              v-model.trim="geomodelJobId"
              type="text"
              :placeholder="t('geoMpiStudio.geomodelJobPlaceholder')"
            />
          </label>

          <label>
            {{ t('geoMpiStudio.resolution') }}
            <input v-model.number="resolution" type="number" min="20" max="150" step="5" />
          </label>

          <label>
            {{ t('geoMpiStudio.method') }}
            <select v-model="method">
              <option value="idw">{{ t('geoMpiStudio.methodIdw') }}</option>
              <option value="linear">{{ t('geoMpiStudio.methodLinear') }}</option>
              <option value="nearest">{{ t('geoMpiStudio.methodNearest') }}</option>
            </select>
          </label>
        </div>

        <div class="mode-block">
          <p class="mode-title">{{ t('geoMpiStudio.mode') }}</p>
          <div class="mode-row">
            <label class="mode-item">
              <input v-model="mode" type="radio" value="baseline" />
              <span>{{ t('geoMpiStudio.modeBaseline') }}</span>
            </label>
            <label class="mode-item">
              <input v-model="mode" type="radio" value="geo-aware" />
              <span>{{ t('geoMpiStudio.modeGeoAware') }}</span>
            </label>
            <label class="mode-item">
              <input v-model="mode" type="radio" value="delta" />
              <span>{{ t('geoMpiStudio.modeDelta') }}</span>
            </label>
          </div>
        </div>

        <div class="hint">
          <span><b>{{ t('geoMpiStudio.hintMode') }}:</b> {{ modeLabel(mode) }}</span>
          <span><b>{{ t('geoMpiStudio.hintAlgorithm') }}:</b> {{ algorithmMode || '-' }}</span>
          <span><b>{{ t('geoMpiStudio.hintFallback') }}:</b> {{ fallbackUsed ? t('common.yes') : t('common.no') }}</span>
          <span><b>{{ t('geoMpiStudio.hintFeatureSource') }}:</b> {{ featureSourceMode || '-' }}</span>
          <span><b>{{ t('geoMpiStudio.hintUpdated') }}:</b> {{ formatTime(lastUpdated) }}</span>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </article>

      <article class="card panel matrix">
        <div class="panel-head">
          <h2>{{ t('geoMpiStudio.matrixTitle') }}</h2>
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
          <h2>{{ t('geoMpiStudio.explainTitle') }}</h2>
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
import { PageHeader } from '../components/library'
import { useGeoMpiData } from '../composables/useGeoMpiData'
import { useGeoMpiStudioState } from '../composables/useGeoMpiStudioState'
import { useI18n } from '../composables/useI18n'

const state = useGeoMpiStudioState()
const { t } = useI18n()
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
} = useGeoMpiData(state, { t })

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

const modeLabel = (value) => {
  if (value === 'baseline') return t('geoMpiStudio.modeBaseline')
  if (value === 'geo-aware') return t('geoMpiStudio.modeGeoAware')
  if (value === 'delta') return t('geoMpiStudio.modeDelta')
  return value || '-'
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

@media (max-width: 1024px) {
  .card {
    padding: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .hero-actions {
    width: 100%;
  }

  .hero-actions .btn {
    width: 100%;
  }

  .mode-row {
    grid-template-columns: 1fr;
  }

  .tag {
    font-size: 10px;
    padding: 2px 8px;
  }
}
</style>
