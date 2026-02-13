<template>
  <div class="geo-mpi-matrix">
    <section
      v-for="tile in tiles"
      :key="tile.key"
      :class="['metric-tile', { active: selectedCell?.metric === tile.key }]"
      :data-testid="`geo-mpi-tile-${tile.key}`"
    >
      <header class="tile-head">
        <h3>{{ tile.title }}</h3>
        <span>{{ tile.note }}</span>
      </header>

      <div class="tile-body">
        <div v-if="loading" class="tile-empty">Refreshing...</div>
        <HeatmapCanvas
          v-else-if="hasGrid(tile.grid)"
          :grid="tile.grid"
          :size="280"
          @select="(payload) => emitSelect(tile.key, payload)"
        />
        <div v-else class="tile-empty">{{ tile.placeholder || 'No data' }}</div>
      </div>

      <footer class="tile-stats">
        <span>min: {{ formatNumber(tile.stats?.min) }}</span>
        <span>max: {{ formatNumber(tile.stats?.max) }}</span>
        <span>mean: {{ formatNumber(tile.stats?.mean) }}</span>
      </footer>
    </section>
  </div>
</template>

<script setup>
import HeatmapCanvas from './HeatmapCanvas.vue'

const props = defineProps({
  tiles: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  selectedCell: {
    type: Object,
    default: null,
  },
})
const emit = defineEmits(['select-cell'])

const hasGrid = (grid) => Array.isArray(grid) && grid.length > 0 && Array.isArray(grid[0]) && grid[0].length > 0

const formatNumber = (value) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return '-'
  return n.toFixed(2)
}

const emitSelect = (metric, payload) => {
  if (!payload) return
  emit('select-cell', {
    metric,
    ...payload,
  })
}
</script>

<style scoped>
.geo-mpi-matrix {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}

.metric-tile {
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: var(--border-radius-md);
  padding: 10px;
  background: rgba(255, 255, 255, 0.65);
  min-height: 220px;
  display: flex;
  flex-direction: column;
}

.metric-tile.active {
  border-color: rgba(15, 118, 110, 0.7);
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.12);
}

.tile-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.tile-head h3 {
  margin: 0;
  font-size: 14px;
}

.tile-head span {
  font-size: 11px;
  color: var(--text-tertiary);
}

.tile-body {
  flex: 1;
}

.tile-empty {
  height: 100%;
  min-height: 160px;
  border-radius: var(--border-radius-sm);
  border: 1px dashed rgba(148, 163, 184, 0.5);
  display: grid;
  place-items: center;
  color: var(--text-tertiary);
  font-size: 12px;
}

.tile-stats {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: var(--text-tertiary);
  font-size: 11px;
}

@media (max-width: 768px) {
  .geo-mpi-matrix {
    grid-template-columns: 1fr;
  }
}
</style>
