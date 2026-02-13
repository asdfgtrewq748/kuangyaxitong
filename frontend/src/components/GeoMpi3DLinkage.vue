<template>
  <div class="geo-mpi-3d-linkage" data-testid="geo-mpi-3d-linkage">
    <div class="viewer">
      <svg viewBox="0 0 320 220" role="img" aria-label="Geo-MPI pseudo 3D linkage viewer">
        <polygon class="block top" points="78,44 250,44 286,82 114,82" />
        <polygon class="block left" points="78,44 114,82 114,180 78,142" />
        <polygon class="block right" points="250,44 286,82 286,180 250,142" />
        <polygon class="block front" points="114,82 286,82 286,180 114,180" />

        <line v-for="line in verticalGrid" :key="`v-${line}`" class="grid" :x1="line" y1="82" :x2="line" y2="180" />
        <line v-for="line in depthGrid" :key="`d-${line}`" class="grid" x1="114" :y1="line" x2="286" :y2="line" />

        <line v-if="anchorPoint" class="anchor-line" x1="96" y1="202" :x2="anchorPoint.x" :y2="anchorPoint.y" />
        <circle v-if="anchorPoint" class="anchor-dot" :cx="anchorPoint.x" :cy="anchorPoint.y" r="5" />
        <text v-if="anchorPoint" class="anchor-label" :x="anchorPoint.x + 8" :y="anchorPoint.y - 8">
          Anchor
        </text>
      </svg>
    </div>

    <div class="meta">
      <div v-if="anchorInfo" class="kv-grid">
        <div class="kv"><span>Anchor</span><b>{{ anchorInfo.cell }}</b></div>
        <div class="kv"><span>X/Y</span><b>{{ anchorInfo.xy }}</b></div>
        <div class="kv"><span>Z-depth</span><b>{{ anchorInfo.depth }} m</b></div>
        <div class="kv"><span>Mode</span><b>{{ mode || '-' }}</b></div>
      </div>
      <p v-else class="placeholder">Select a matrix cell to sync anchor with pseudo-3D seam context.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedCell: { type: Object, default: null },
  geomodelQuality: { type: Object, default: null },
  mode: { type: String, default: 'baseline' },
})

const verticalGrid = [142, 170, 198, 226, 254]
const depthGrid = [104, 126, 148, 170]

const clamp01 = (v) => {
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  if (n < 0) return 0
  if (n > 1) return 1
  return n
}

const anchorPoint = computed(() => {
  const cell = props.selectedCell
  if (!cell) return null
  const rows = Number(cell.rows)
  const cols = Number(cell.cols)
  if (!Number.isFinite(rows) || !Number.isFinite(cols) || rows <= 1 || cols <= 1) return null

  const u = clamp01(Number(cell.col) / (cols - 1))
  const v = clamp01(Number(cell.row) / (rows - 1))

  // Bilinear interpolation in projected top face (A-B-C-D).
  const A = { x: 114, y: 82 }
  const B = { x: 286, y: 82 }
  const C = { x: 286, y: 180 }
  const D = { x: 114, y: 180 }

  const x = A.x * (1 - u) * (1 - v) + B.x * u * (1 - v) + D.x * (1 - u) * v + C.x * u * v
  const y = A.y * (1 - u) * (1 - v) + B.y * u * (1 - v) + D.y * (1 - u) * v + C.y * u * v
  return { x, y, u, v }
})

const anchorInfo = computed(() => {
  if (!props.selectedCell || !anchorPoint.value) return null
  const q = props.geomodelQuality || {}
  const span = Number(q?.key_layer_span)
  const fallbackSpan = Number.isFinite(span) && span > 0 ? span : 30
  const depth = fallbackSpan * (1 - anchorPoint.value.v)
  return {
    cell: `(${props.selectedCell.row}, ${props.selectedCell.col})`,
    xy: `${anchorPoint.value.u.toFixed(3)}, ${anchorPoint.value.v.toFixed(3)}`,
    depth: depth.toFixed(2),
  }
})
</script>

<style scoped>
.geo-mpi-3d-linkage {
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.75);
  padding: 10px;
}

.viewer {
  border: 1px dashed rgba(148, 163, 184, 0.45);
  border-radius: var(--border-radius-sm);
  background: linear-gradient(160deg, rgba(15, 118, 110, 0.05), rgba(14, 116, 144, 0.02));
}

.viewer svg {
  width: 100%;
  height: 196px;
  display: block;
}

.block.top {
  fill: rgba(20, 184, 166, 0.18);
  stroke: rgba(15, 118, 110, 0.6);
}

.block.left {
  fill: rgba(15, 118, 110, 0.22);
  stroke: rgba(15, 118, 110, 0.5);
}

.block.right {
  fill: rgba(14, 116, 144, 0.18);
  stroke: rgba(14, 116, 144, 0.45);
}

.block.front {
  fill: rgba(240, 249, 255, 0.85);
  stroke: rgba(148, 163, 184, 0.8);
}

.grid {
  stroke: rgba(100, 116, 139, 0.25);
  stroke-width: 1;
}

.anchor-line {
  stroke: rgba(239, 68, 68, 0.7);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
}

.anchor-dot {
  fill: #ef4444;
  stroke: #ffffff;
  stroke-width: 2;
}

.anchor-label {
  fill: #ef4444;
  font-size: 11px;
  font-weight: 700;
}

.meta {
  margin-top: 10px;
}

.kv-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 10px;
}

.kv {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.kv span {
  color: var(--text-tertiary);
}

.kv b {
  color: var(--text-primary);
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
}

.placeholder {
  margin: 0;
  color: var(--text-tertiary);
  font-size: 12px;
}
</style>
