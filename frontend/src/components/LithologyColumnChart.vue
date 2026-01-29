<template>
  <div class="lithology-column-chart">
    <div class="chart-container">
      <canvas
        ref="canvas"
        :width="canvasWidth"
        :height="canvasHeight"
      ></canvas>

      <!-- Legend -->
      <div class="legend">
        <div class="legend-title">岩性图例</div>
        <div class="legend-items">
          <div
            v-for="(color, name) in lithologyColors"
            :key="name"
            class="legend-item"
          >
            <div class="legend-color" :style="{ background: color }"></div>
            <span class="legend-name">{{ name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Layer Details -->
    <div class="layer-details" v-if="layers.length > 0">
      <div class="details-title">岩层详情</div>
      <div class="layer-list">
        <div
          v-for="(layer, i) in sortedLayers"
          :key="i"
          class="layer-item"
          @mouseenter="highlightLayer = i"
          @mouseleave="highlightLayer = -1"
        >
          <div class="layer-color-bar" :style="{ background: layer.color }"></div>
          <div class="layer-info">
            <span class="layer-name">{{ layer.name }}</span>
            <span class="layer-depth">{{ layer.z_top?.toFixed(1) }} - {{ layer.z_bottom?.toFixed(1) }} m</span>
          </div>
          <div class="layer-thickness">{{ layer.thickness?.toFixed(2) }} m</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

const props = defineProps({
  layers: { type: Array, default: () => [] },
  seamName: { type: String, default: '' }
})

const canvas = ref(null)
const highlightLayer = ref(-1)
const canvasWidth = ref(300)
const canvasHeight = ref(400)

// Lithology colors (matching backend)
const lithologyColors = {
  '细砂岩': '#A8D8EA',
  '粉砂岩': '#AA96DA',
  '泥岩': '#FCBAD3',
  '中砂岩': '#FFFFD2',
  '粗砂岩': '#95E1D3',
  '砾岩': '#F38181',
  '炭质泥岩': '#6C5B7B',
  '砂质泥岩': '#D4A5A5',
  '泥质砂岩': '#D5E8D4',
  '煤': '#2C2C2C'
}

// Sort layers by depth (top to bottom)
const sortedLayers = computed(() => {
  if (!props.layers || props.layers.length === 0) return []
  return [...props.layers].sort((a, b) => (b.z_top || 0) - (a.z_top || 0))
})

// Calculate total depth for scaling
const totalDepth = computed(() => {
  if (sortedLayers.value.length === 0) return 100
  const maxDepth = Math.max(...sortedLayers.value.map(l => l.z_bottom || 0))
  return Math.max(maxDepth * 1.1, 100) // Add 10% padding
})

const draw = () => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  const { width, height } = canvas.value

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Background
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, width, height)

  if (sortedLayers.value.length === 0) {
    ctx.fillStyle = '#94a3b8'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('暂无岩层数据', width / 2, height / 2)
    return
  }

  const columnX = 80
  const columnWidth = 100
  const scale = (height - 60) / totalDepth.value
  const topMargin = 30

  // Draw depth scale
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1
  ctx.font = '11px sans-serif'
  ctx.fillStyle = '#64748b'
  ctx.textAlign = 'right'

  const depthStep = Math.ceil(totalDepth.value / 10 / 10) * 10 // Round to nearest 10

  for (let depth = 0; depth <= totalDepth.value; depth += depthStep) {
    const y = topMargin + depth * scale

    // Grid line
    ctx.beginPath()
    ctx.moveTo(columnX - 10, y)
    ctx.lineTo(columnX + columnWidth + 40, y)
    ctx.stroke()

    // Depth label
    ctx.fillText(`${depth}m`, columnX - 15, y + 4)
  }

  // Draw layers
  sortedLayers.value.forEach((layer, i) => {
    const thickness = layer.thickness || 0
    const zTop = layer.z_top || 0
    const zBottom = layer.z_bottom || (zTop + thickness)

    const yTop = topMargin + zTop * scale
    const layerHeight = Math.max(thickness * scale, 1) // At least 1px

    // Layer rectangle
    ctx.fillStyle = layer.color || '#cccccc'
    ctx.fillRect(columnX, yTop, columnWidth, layerHeight)

    // Layer border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.lineWidth = 1
    ctx.strokeRect(columnX, yTop, columnWidth, layerHeight)

    // Highlight effect
    if (highlightLayer.value === i) {
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.strokeRect(columnX - 2, yTop - 2, columnWidth + 4, layerHeight + 4)
    }

    // Layer label (if thick enough)
    if (layerHeight > 15) {
      ctx.fillStyle = '#1e293b'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'

      // Calculate text color based on background
      const isDark = layer.name === '煤' || layer.name === '炭质泥岩'
      ctx.fillStyle = isDark ? '#ffffff' : '#1e293b'

      ctx.fillText(layer.name, columnX + columnWidth / 2, yTop + layerHeight / 2 + 4)
    }

    // Thickness label on the right
    if (layerHeight > 10) {
      ctx.fillStyle = '#64748b'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`${thickness.toFixed(1)}m`, columnX + columnWidth + 8, yTop + layerHeight / 2 + 3)
    }
  })

  // Draw seam label
  if (props.seamName) {
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(props.seamName, columnX + columnWidth / 2, 15)
  }

  // Column border
  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 2
  ctx.strokeRect(columnX, topMargin, columnWidth, height - topMargin - 20)
}

onMounted(() => {
  draw()
})

watch(() => [props.layers, props.seamName, highlightLayer.value], () => {
  draw()
}, { deep: true })
</script>

<style scoped>
.lithology-column-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.chart-container canvas {
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-title {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 4px;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 24px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.legend-name {
  font-size: 12px;
  color: #64748b;
}

.layer-details {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.details-title {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 12px;
}

.layer-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 250px;
  overflow-y: auto;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.layer-item:hover {
  background: #f1f5f9;
}

.layer-color-bar {
  width: 8px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.layer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.layer-name {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.layer-depth {
  font-size: 11px;
  color: #94a3b8;
}

.layer-thickness {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  font-family: 'Consolas', monospace;
}
</style>
