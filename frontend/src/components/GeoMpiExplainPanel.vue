<template>
  <div class="geo-mpi-explain" data-testid="geo-mpi-explain-panel">
    <section class="section">
      <h3>Selected Cell</h3>
      <div v-if="selectedCell" class="selection-grid">
        <div class="kv"><span>Cell</span><b>({{ selectedCell.row }}, {{ selectedCell.col }})</b></div>
        <div class="kv"><span>Mode</span><b>{{ mode }}</b></div>
        <div class="kv"><span>MPI</span><b>{{ fmt(selectedValues?.mpi) }}</b></div>
        <div class="kv"><span>RSI</span><b>{{ fmt(selectedValues?.rsi) }}</b></div>
        <div class="kv"><span>BRI</span><b>{{ fmt(selectedValues?.bri) }}</b></div>
        <div class="kv"><span>ASI</span><b>{{ fmt(selectedValues?.asi) }}</b></div>
      </div>
      <p v-else class="placeholder">Click any matrix cell to inspect values and geology context.</p>
    </section>

    <section class="section">
      <h3>Model Context</h3>
      <div class="selection-grid">
        <div class="kv"><span>Algorithm</span><b>{{ algorithmMode || '-' }}</b></div>
        <div class="kv"><span>Fallback</span><b>{{ fallbackUsed ? 'yes' : 'no' }}</b></div>
        <div class="kv"><span>Feature source</span><b>{{ featureSourceMode || '-' }}</b></div>
        <div class="kv"><span>Geomodel</span><b>{{ geomodelStatus || '-' }}</b></div>
      </div>
      <p v-if="geomodelError" class="warn">{{ geomodelError }}</p>
    </section>

    <section class="section">
      <h3>Geomodel Quality</h3>
      <div v-if="hasQuality" class="selection-grid">
        <div class="kv"><span>Continuity</span><b>{{ fmt(geomodelQuality.continuity_score) }}</b></div>
        <div class="kv"><span>Pinchout ratio</span><b>{{ fmt(geomodelQuality.pinchout_ratio) }}</b></div>
        <div class="kv"><span>Layer CV</span><b>{{ fmt(geomodelQuality.layer_cv) }}</b></div>
        <div class="kv"><span>Key layer span</span><b>{{ fmt(geomodelQuality.key_layer_span) }}</b></div>
      </div>
      <p v-else class="placeholder">No Geomodel quality summary loaded.</p>
    </section>

    <section class="section">
      <h3>Artifacts</h3>
      <div v-if="Array.isArray(geomodelArtifacts) && geomodelArtifacts.length" class="chips">
        <span v-for="item in geomodelArtifacts.slice(0, 6)" :key="item.name" class="chip">{{ item.name }}</span>
      </div>
      <p v-else class="placeholder">No artifact list loaded.</p>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedCell: { type: Object, default: null },
  selectedValues: { type: Object, default: null },
  mode: { type: String, default: 'baseline' },
  algorithmMode: { type: String, default: '' },
  fallbackUsed: { type: Boolean, default: false },
  featureSourceMode: { type: String, default: '' },
  geomodelStatus: { type: String, default: '' },
  geomodelQuality: { type: Object, default: null },
  geomodelArtifacts: { type: Array, default: () => [] },
  geomodelError: { type: String, default: '' },
})

const hasQuality = computed(() => {
  const q = props.geomodelQuality || {}
  return ['continuity_score', 'pinchout_ratio', 'layer_cv', 'key_layer_span']
    .some((key) => Number.isFinite(Number(q?.[key])))
})

const fmt = (value) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return '-'
  return n.toFixed(3)
}
</script>

<style scoped>
.geo-mpi-explain {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section {
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: var(--border-radius-sm);
  padding: 10px;
  background: rgba(255, 255, 255, 0.72);
}

.section h3 {
  margin: 0 0 8px;
  font-size: 13px;
}

.selection-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 10px;
}

.kv {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
}

.kv span {
  color: var(--text-tertiary);
}

.kv b {
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}

.placeholder {
  margin: 0;
  color: var(--text-tertiary);
  font-size: 12px;
}

.warn {
  margin: 8px 0 0;
  color: var(--color-error);
  font-size: 12px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  color: var(--text-secondary);
}
</style>
