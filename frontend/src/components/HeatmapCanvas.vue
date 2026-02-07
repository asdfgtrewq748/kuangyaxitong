<template>
  <div class="heatmap-wrapper">
    <canvas ref="canvas" :width="size" :height="size" class="heatmap-canvas"></canvas>
    <div v-if="colorScale" class="color-scale">
      <span class="scale-label">{{ minVal?.toFixed(2) }}</span>
      <div class="scale-bar"></div>
      <span class="scale-label">{{ maxVal?.toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  grid: { type: Array, default: () => [] },
  size: { type: Number, default: 420 },
  colorScale: { type: Boolean, default: true }
})

const canvas = ref(null)
const minVal = ref(null)
const maxVal = ref(null)
let drawRaf = 0

// Modern color palette - cool to warm gradient
const getColor = (t) => {
  // t is 0 to 1
  const colors = [
    { r: 30, g: 64, b: 175 },   // Deep blue
    { r: 37, g: 99, b: 235 },   // Blue
    { r: 59, g: 130, b: 246 },  // Light blue
    { r: 6, g: 182, b: 212 },   // Cyan
    { r: 16, g: 185, b: 129 },  // Green
    { r: 245, g: 158, b: 11 }   // Orange
  ]

  const idx = t * (colors.length - 1)
  const i = Math.floor(idx)
  const f = idx - i

  const c1 = colors[Math.min(i, colors.length - 1)]
  const c2 = colors[Math.min(i + 1, colors.length - 1)]

  return `rgb(${Math.round(c1.r + (c2.r - c1.r) * f)}, ${Math.round(c1.g + (c2.g - c1.g) * f)}, ${Math.round(c1.b + (c2.b - c1.b) * f)})`
}

const draw = () => {
  if (!canvas.value || props.grid.length === 0) return
  const ctx = canvas.value.getContext('2d')
  const rows = props.grid.length
  const cols = props.grid[0]?.length || 0
  if (rows === 0 || cols === 0) return
  const cellW = props.size / cols
  const cellH = props.size / rows

  let min = Infinity
  let max = -Infinity
  props.grid.forEach((row) => {
    row.forEach((v) => {
      if (!Number.isFinite(Number(v))) return
      if (v < min) min = v
      if (v > max) max = v
    })
  })
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    min = 0
    max = 1
  }
  const range = max - min || 1

  minVal.value = min
  maxVal.value = max

  ctx.clearRect(0, 0, props.size, props.size)

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const v = props.grid[i][j]
      if (!Number.isFinite(Number(v))) continue
      const t = (v - min) / range
      ctx.fillStyle = getColor(t)
      ctx.fillRect(j * cellW, i * cellH, cellW + 0.5, cellH + 0.5)
    }
  }
}

const queueDraw = () => {
  if (drawRaf) return
  drawRaf = requestAnimationFrame(() => {
    drawRaf = 0
    draw()
  })
}

onMounted(queueDraw)
watch(() => props.grid, queueDraw)
watch(() => props.size, queueDraw)

onBeforeUnmount(() => {
  if (drawRaf) {
    cancelAnimationFrame(drawRaf)
    drawRaf = 0
  }
})
</script>

<style scoped>
.heatmap-wrapper {
  width: 100%;
}

.heatmap-canvas {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.color-scale {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 0 4px;
}

.scale-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.scale-bar {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #1e40af, #2563eb, #3b82f6, #06b6d4, #10b981, #f59e0b);
}
</style>
