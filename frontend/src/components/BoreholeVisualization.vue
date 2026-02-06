<template>
  <div class="borehole-viz">
    <!-- 钻孔选择器 -->
    <div class="borehole-selector">
      <div class="selector-header">
        <h4>钻孔选择</h4>
        <span class="borehole-count">共 {{ boreholeNames.length }} 个钻孔</span>
      </div>
      <div class="borehole-tags">
        <button
          v-for="name in boreholeNames"
          :key="name"
          :class="['borehole-tag', { active: selectedBorehole === name }]"
          @click="selectBorehole(name)"
        >
          {{ name }}
        </button>
      </div>
    </div>

    <!-- 钻孔柱状图 -->
    <div class="borehole-column">
      <div class="column-header">
        <h4>{{ selectedBorehole }} 钻孔柱状图</h4>
        <div class="column-stats">
          <span class="stat-item">总深度: {{ totalDepth.toFixed(1) }}m</span>
          <span class="stat-item">煤层数: {{ coalLayerCount }}层</span>
          <span class="stat-item">主要岩性: {{ dominantRockType }}</span>
        </div>
      </div>

      <div class="column-chart" ref="columnChart">
        <div
          v-for="(layer, index) in currentBoreholeData"
          :key="index"
          class="layer-bar"
          :style="{
            height: getLayerHeight(layer.thickness) + 'px',
            background: getLayerColor(layer.name),
            borderColor: getLayerBorderColor(layer.name)
          }"
          @mouseenter="hoveredLayer = layer"
          @mouseleave="hoveredLayer = null"
        >
          <div class="layer-label" v-if="layer.thickness > 2">
            <span class="layer-name">{{ layer.name }}</span>
            <span class="layer-thickness">{{ layer.thickness }}m</span>
          </div>

          <!-- 悬浮提示 -->
          <div v-if="hoveredLayer === layer" class="layer-tooltip">
            <div class="tooltip-header">{{ layer.name }}</div>
            <div class="tooltip-body">
              <div class="tooltip-row">
                <span>厚度:</span>
                <span>{{ layer.thickness }} m</span>
              </div>
              <div class="tooltip-row">
                <span>埋深:</span>
                <span>{{ getLayerDepth(index) }} m</span>
              </div>
              <div class="tooltip-row" v-if="layer.elastic_modulus">
                <span>弹性模量:</span>
                <span>{{ layer.elastic_modulus }} GPa</span>
              </div>
              <div class="tooltip-row" v-if="layer.unit_weight">
                <span>容重:</span>
                <span>{{ layer.unit_weight }} kN/m³</span>
              </div>
              <div class="tooltip-row" v-if="layer.tensile_strength">
                <span>抗拉强度:</span>
                <span>{{ layer.tensile_strength }} MPa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 深度标尺 -->
      <div class="depth-scale">
        <div
          v-for="tick in depthTicks"
          :key="tick"
          class="depth-tick"
          :style="{ top: getTickPosition(tick) + 'px' }"
        >
          <span class="tick-line"></span>
          <span class="tick-label">{{ tick }}m</span>
        </div>
      </div>
    </div>

    <!-- 岩性图例 -->
    <div class="rock-legend">
      <h4>岩性图例</h4>
      <div class="legend-items">
        <div class="legend-item" v-for="(color, name) in rockColors" :key="name">
          <span class="legend-color" :style="{ background: color }"></span>
          <span class="legend-name">{{ name }}</span>
        </div>
      </div>
    </div>

    <!-- 钻孔坐标信息 -->
    <div class="coordinate-info" v-if="currentCoordinate">
      <h4>钻孔坐标</h4>
      <div class="coord-grid">
        <div class="coord-item">
          <span class="coord-label">X坐标</span>
          <span class="coord-value">{{ currentCoordinate.x.toFixed(2) }}</span>
        </div>
        <div class="coord-item">
          <span class="coord-label">Y坐标</span>
          <span class="coord-value">{{ currentCoordinate.y.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- 关键层分析 -->
    <div class="key-layers-analysis">
      <h4>关键层分析</h4>
      <div class="key-layers-list">
        <div
          v-for="(layer, idx) in keyLayers"
          :key="idx"
          class="key-layer-item"
          :class="{ 'is-coal': isCoalLayer(layer.name) }"
        >
          <span class="key-layer-name">{{ layer.name }}</span>
          <span class="key-layer-thickness">{{ layer.thickness }}m</span>
          <span class="key-layer-depth">@{{ layer.depth }}m</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_BASE = "http://localhost:5000/api"

// 状态
const boreholeNames = ref([])
const selectedBorehole = ref('')
const boreholeData = ref({})
const coordinates = ref({})
const hoveredLayer = ref(null)
const columnChart = ref(null)

// 岩层颜色映射
const rockColors = {
  '腐殖土': '#8B4513',
  '细砂岩': '#D2B48C',
  '泥岩': '#808080',
  '中砾岩': '#A9A9A9',
  '粉砂岩': '#C0C0C0',
  '中砂岩': '#D3D3D3',
  '粗砾岩': '#696969',
  '炭质泥岩': '#2F4F4F',
  '15-4煤': '#1a1a1a',
  '15-5上煤': '#1a1a1a',
  '15-5下煤': '#1a1a1a',
  '15-7煤': '#1a1a1a',
  '16-1煤': '#1a1a1a',
  '16-2上煤': '#1a1a1a',
  '16-2下煤': '#1a1a1a',
  '16-3上煤': '#1a1a1a',
  '16-3中煤': '#1a1a1a',
  '16-3煤': '#1a1a1a',
  '16-4煤': '#1a1a1a'
}

// 获取岩层颜色
const getLayerColor = (name) => {
  // 匹配煤层
  if (name.includes('煤')) {
    return 'linear-gradient(135deg, #1a1a1a 0%, #333333 50%, #1a1a1a 100%)'
  }
  // 匹配特定岩层
  for (const [key, color] of Object.entries(rockColors)) {
    if (name.includes(key)) {
      return color
    }
  }
  // 默认颜色
  return '#E5E7EB'
}

// 获取岩层边框颜色
const getLayerBorderColor = (name) => {
  if (name.includes('煤')) {
    return '#000000'
  }
  return '#D1D5DB'
}

// 判断是否为煤层
const isCoalLayer = (name) => {
  return name.includes('煤')
}

// 当前钻孔数据
const currentBoreholeData = computed(() => {
  return boreholeData.value[selectedBorehole.value] || []
})

// 当前钻孔坐标
const currentCoordinate = computed(() => {
  return coordinates.value[selectedBorehole.value]
})

// 总深度
const totalDepth = computed(() => {
  return currentBoreholeData.value.reduce((sum, layer) => sum + (parseFloat(layer.thickness) || 0), 0)
})

// 煤层数量
const coalLayerCount = computed(() => {
  return currentBoreholeData.value.filter(layer => isCoalLayer(layer.name)).length
})

// 主要岩性
const dominantRockType = computed(() => {
  const thicknessByType = {}
  currentBoreholeData.value.forEach(layer => {
    const type = isCoalLayer(layer.name) ? '煤层' : layer.name.replace(/[0-9-]/g, '')
    thicknessByType[type] = (thicknessByType[type] || 0) + (parseFloat(layer.thickness) || 0)
  })

  let maxThickness = 0
  let dominantType = '未知'
  for (const [type, thickness] of Object.entries(thicknessByType)) {
    if (thickness > maxThickness) {
      maxThickness = thickness
      dominantType = type
    }
  }
  return dominantType
})

// 关键层（厚度较大的岩层或煤层）
const keyLayers = computed(() => {
  const layers = []
  let currentDepth = 0

  currentBoreholeData.value.forEach(layer => {
    const thickness = parseFloat(layer.thickness) || 0
    if (thickness > 5 || isCoalLayer(layer.name)) {
      layers.push({
        name: layer.name,
        thickness: thickness,
        depth: currentDepth.toFixed(1)
      })
    }
    currentDepth += thickness
  })

  return layers.slice(0, 8) // 只显示前8个关键层
})

// 深度刻度
const depthTicks = computed(() => {
  const ticks = []
  const maxDepth = Math.ceil(totalDepth.value / 50) * 50
  for (let i = 0; i <= maxDepth; i += 50) {
    ticks.push(i)
  }
  return ticks
})

// 获取层高度（像素）
const getLayerHeight = (thickness) => {
  // 缩放因子：每米3像素，最小高度20像素
  return Math.max(20, (parseFloat(thickness) || 0) * 3)
}

// 获取层埋深
const getLayerDepth = (index) => {
  let depth = 0
  for (let i = 0; i < index; i++) {
    depth += parseFloat(currentBoreholeData.value[i]?.thickness) || 0
  }
  return depth.toFixed(1)
}

// 获取刻度位置
const getTickPosition = (tick) => {
  return tick * 3 // 每米3像素
}

// 选择钻孔
const selectBorehole = (name) => {
  selectedBorehole.value = name
}

// 加载钻孔数据
const loadBoreholeData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/boreholes`)
    if (response.data.success) {
      boreholeNames.value = response.data.boreholes
      boreholeData.value = response.data.data
      coordinates.value = response.data.coordinates

      if (boreholeNames.value.length > 0) {
        selectedBorehole.value = boreholeNames.value[0]
      }
    }
  } catch (error) {
    console.error('加载钻孔数据失败:', error)
    // 使用模拟数据
    loadMockData()
  }
}

// 模拟数据（用于开发测试）
const loadMockData = () => {
  boreholeNames.value = ['50-14', '50-15', 'BK12-2']

  boreholeData.value = {
    '50-14': [
      { name: '腐殖土', thickness: 0.6 },
      { name: '细砂岩', thickness: 47 },
      { name: '泥岩', thickness: 4.4 },
      { name: '中砾岩', thickness: 4.2 },
      { name: '粉砂岩', thickness: 3 },
      { name: '中砾岩', thickness: 37.8 },
      { name: '粉砂岩', thickness: 0.6 },
      { name: '15-4煤', thickness: 2.5 },
      { name: '泥岩', thickness: 4.5 },
      { name: '中砾岩', thickness: 18 },
      { name: '细砂岩', thickness: 4.4 },
      { name: '15-5上煤', thickness: 0.8 },
      { name: '泥岩', thickness: 1.2 },
      { name: '15-5下煤', thickness: 2.9 }
    ],
    '50-15': [
      { name: '腐殖土', thickness: 0.8 },
      { name: '细砂岩', thickness: 45 },
      { name: '泥岩', thickness: 5.2 },
      { name: '15-4煤', thickness: 2.2 },
      { name: '中砾岩', thickness: 35 },
      { name: '15-5煤', thickness: 3.5 }
    ],
    'BK12-2': [
      { name: '腐殖土', thickness: 0.5 },
      { name: '细砂岩', thickness: 42 },
      { name: '泥岩', thickness: 3.8 },
      { name: '中砾岩', thickness: 38 },
      { name: '15-4煤', thickness: 2.8 },
      { name: '粉砂岩', thickness: 5.5 },
      { name: '15-5煤', thickness: 4.2 }
    ]
  }

  coordinates.value = {
    '50-14': { x: 495394.96, y: 5404813.13 },
    '50-15': { x: 495558.87, y: 5404339.03 },
    'BK12-2': { x: 497464.39, y: 5404959.31 }
  }

  selectedBorehole.value = '50-14'
}

onMounted(() => {
  loadBoreholeData()
})
</script>

<style scoped>
.borehole-viz {
  display: grid;
  grid-template-columns: 200px 1fr 180px;
  grid-template-rows: auto auto auto;
  gap: 20px;
  padding: 20px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
}

/* 钻孔选择器 */
.borehole-selector {
  grid-column: 1;
  grid-row: 1 / 4;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.selector-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.borehole-count {
  font-size: 11px;
  color: var(--text-tertiary);
}

.borehole-tags {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 400px;
  overflow-y: auto;
}

.borehole-tag {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: var(--bg-secondary);
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.borehole-tag:hover {
  background: var(--bg-tertiary);
  border-color: var(--color-secondary);
}

.borehole-tag.active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

/* 钻孔柱状图 */
.borehole-column {
  grid-column: 2;
  grid-row: 1 / 4;
  display: grid;
  grid-template-columns: 1fr 60px;
  gap: 12px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  padding: 16px;
  border: 1px solid var(--border-color);
}

.column-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.column-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.column-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--bg-primary);
  padding: 4px 10px;
  border-radius: 999px;
}

.column-chart {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.layer-bar {
  position: relative;
  min-height: 20px;
  border: 1px solid;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.layer-bar:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.layer-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-size: 11px;
  font-weight: 500;
}

.layer-name {
  font-size: 11px;
}

.layer-thickness {
  font-size: 10px;
  opacity: 0.9;
}

/* 悬浮提示 */
.layer-tooltip {
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: 12px;
  min-width: 160px;
  box-shadow: var(--shadow-lg);
  z-index: 100;
}

.tooltip-header {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
}

.tooltip-row span:first-child {
  color: var(--text-tertiary);
}

.tooltip-row span:last-child {
  color: var(--text-primary);
  font-weight: 500;
}

/* 深度标尺 */
.depth-scale {
  position: relative;
  width: 50px;
  height: 100%;
  border-left: 1px solid var(--border-color);
}

.depth-tick {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tick-line {
  width: 8px;
  height: 1px;
  background: var(--border-color);
}

.tick-label {
  font-size: 10px;
  color: var(--text-tertiary);
}

/* 岩性图例 */
.rock-legend {
  grid-column: 3;
  grid-row: 1;
}

.rock-legend h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.legend-name {
  font-size: 11px;
  color: var(--text-secondary);
}

/* 坐标信息 */
.coordinate-info {
  grid-column: 3;
  grid-row: 2;
}

.coordinate-info h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.coord-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.coord-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
}

.coord-label {
  font-size: 11px;
  color: var(--text-tertiary);
}

.coord-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: monospace;
}

/* 关键层分析 */
.key-layers-analysis {
  grid-column: 3;
  grid-row: 3;
}

.key-layers-analysis h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.key-layers-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
}

.key-layer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  font-size: 11px;
}

.key-layer-item.is-coal {
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  color: white;
  border-color: #000;
}

.key-layer-name {
  flex: 1;
  font-weight: 500;
}

.key-layer-thickness {
  color: var(--text-tertiary);
}

.key-layer-depth {
  font-family: monospace;
  color: var(--color-primary);
}

.key-layer-item.is-coal .key-layer-thickness,
.key-layer-item.is-coal .key-layer-depth {
  color: rgba(255, 255, 255, 0.8);
}

/* 响应式 */
@media (max-width: 1100px) {
  .borehole-viz {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto auto;
  }

  .borehole-selector {
    grid-column: 1 / -1;
    grid-row: 1;
  }

  .borehole-tags {
    flex-direction: row;
    flex-wrap: wrap;
    max-height: none;
  }

  .borehole-column {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .rock-legend {
    grid-column: 1;
    grid-row: 3;
  }

  .coordinate-info {
    grid-column: 2;
    grid-row: 3;
  }

  .key-layers-analysis {
    grid-column: 1 / -1;
    grid-row: 4;
  }
}

@media (max-width: 768px) {
  .borehole-viz {
    grid-template-columns: 1fr;
  }

  .rock-legend,
  .coordinate-info,
  .key-layers-analysis {
    grid-column: 1;
  }

  .column-stats {
    flex-direction: column;
    gap: 4px;
  }

  .layer-tooltip {
    left: 50%;
    top: auto;
    bottom: calc(100% + 8px);
    transform: translateX(-50%);
  }
}
</style>
