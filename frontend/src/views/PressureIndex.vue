<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">📈 矿压指标</h1>
      <p class="page-subtitle">基于岩性参数计算矿压影响指数，生成压力分布图</p>
    </div>

    <div class="grid grid-2">
      <!-- 参数设置 -->
      <div class="card">
        <h3 class="section-title">权重设置</h3>
        <p class="section-desc">设置各岩性参数的权重（总和会自动归一化）</p>

        <div class="weight-inputs">
          <div class="weight-item">
            <label class="weight-label">弹性模量</label>
            <input v-model.number="wElastic" type="number" step="0.1" min="0" class="weight-input">
            <span class="weight-percent">{{ (wElastic / totalWeight * 100).toFixed(0) }}%</span>
          </div>
          <div class="weight-item">
            <label class="weight-label">容重</label>
            <input v-model.number="wDensity" type="number" step="0.1" min="0" class="weight-input">
            <span class="weight-percent">{{ (wDensity / totalWeight * 100).toFixed(0) }}%</span>
          </div>
          <div class="weight-item">
            <label class="weight-label">抗拉强度</label>
            <input v-model.number="wTensile" type="number" step="0.1" min="0" class="weight-input">
            <span class="weight-percent">{{ (wTensile / totalWeight * 100).toFixed(0) }}%</span>
          </div>
        </div>

        <div class="param-group">
          <label class="param-label">插值方法</label>
          <select v-model="method" class="param-select">
            <option value="idw">IDW</option>
            <option value="linear">Linear</option>
            <option value="nearest">Nearest</option>
          </select>
        </div>

        <div class="param-group">
          <label class="param-label">网格大小</label>
          <input v-model.number="gridSize" type="number" min="20" max="120" class="param-input">
        </div>

        <div class="action-buttons">
          <button class="btn primary" @click="handleIndexGrid" :disabled="loading">
            <span v-if="loading" class="spinner sm"></span>
            {{ loading ? '计算中...' : '计算指标网格' }}
          </button>
          <button v-if="indexGrid" class="btn secondary" @click="handleExport" :disabled="loading">
            导出指标
          </button>
        </div>
      </div>

      <!-- 指标结果 -->
      <div class="card">
        <h3 class="section-title">矿压指标分布</h3>

        <div v-if="indexGrid" class="result-content">
          <HeatmapCanvas :grid="indexGrid.values" :size="420" />
          <div class="legend">
            <div class="legend-label">压力指数</div>
            <div class="legend-bar">
              <span class="legend-low">低压力</span>
              <span class="legend-high">高压力</span>
            </div>
          </div>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-label">最小值</span>
              <span class="stat-value">{{ indexGrid.min?.toFixed(3) || '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最大值</span>
              <span class="stat-value">{{ indexGrid.max?.toFixed(3) || '-' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">平均值</span>
              <span class="stat-value">{{ indexGrid.mean?.toFixed(3) || '-' }}</span>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📈</div>
          <p>请先设置权重并计算指标网格</p>
        </div>
      </div>
    </div>

    <!-- 工作面调整 -->
    <div class="card">
      <h3 class="section-title">工作面矿压调整</h3>
      <p class="section-desc">根据工作面推进方向调整矿压分布</p>

      <div class="grid grid-5">
        <div class="param-group">
          <label class="param-label">工作面数</label>
          <input v-model.number="faceCount" type="number" min="1" class="param-input">
        </div>
        <div class="param-group">
          <label class="param-label">方向轴</label>
          <select v-model="faceAxis" class="param-select">
            <option value="x">X 轴</option>
            <option value="y">Y 轴</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">推进方向</label>
          <select v-model="faceDirection" class="param-select">
            <option value="ascending">正向</option>
            <option value="descending">反向</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">影响模式</label>
          <select v-model="faceMode" class="param-select">
            <option value="decrease">递减</option>
            <option value="increase">递增</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">衰减系数</label>
          <input v-model.number="faceDecay" type="number" step="0.01" class="param-input">
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn primary" @click="handleWorkfaces" :disabled="loading">
          计算调整后指标
        </button>
        <button v-if="workfaceGrid" class="btn secondary" @click="handleExportWorkfaces" :disabled="loading">
          导出调整结果
        </button>
      </div>

      <div v-if="workfaceGrid" class="result-section">
        <HeatmapCanvas :grid="workfaceGrid" :size="500" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '../composables/useToast'
import HeatmapCanvas from '../components/HeatmapCanvas.vue'
import { pressureIndexGrid, pressureIndexWorkfaces, exportIndex, exportPressureIndexWorkfaces } from '../api'

const toast = useToast()
const method = ref('idw')
const gridSize = ref(60)
const wElastic = ref(0.4)
const wDensity = ref(0.3)
const wTensile = ref(0.3)
const loading = ref(false)
const indexGrid = ref(null)
const workfaceGrid = ref(null)

const faceCount = ref(3)
const faceAxis = ref('x')
const faceDirection = ref('ascending')
const faceMode = ref('decrease')
const faceDecay = ref(0.08)

const totalWeight = computed(() => {
  return (wElastic.value || 0) + (wDensity.value || 0) + (wTensile.value || 0) || 1
})

const normalizedWeights = computed(() => {
  const sum = totalWeight.value
  return {
    elastic: (wElastic.value || 0) / sum,
    density: (wDensity.value || 0) / sum,
    tensile: (wTensile.value || 0) / sum
  }
})

// Save weights to localStorage
const saveWeights = () => {
  localStorage.setItem('pressure_weights', JSON.stringify({
    elastic: wElastic.value,
    density: wDensity.value,
    tensile: wTensile.value
  }))
}

const loadWeights = () => {
  try {
    const data = localStorage.getItem('pressure_weights')
    if (data) {
      const parsed = JSON.parse(data)
      if (parsed.elastic) wElastic.value = parsed.elastic
      if (parsed.density) wDensity.value = parsed.density
      if (parsed.tensile) wTensile.value = parsed.tensile
    }
  } catch (e) {
    // Ignore
  }
}

const handleIndexGrid = async () => {
  loading.value = true
  try {
    const { data } = await pressureIndexGrid(
      method.value,
      gridSize.value,
      normalizedWeights.value.elastic,
      normalizedWeights.value.density,
      normalizedWeights.value.tensile
    )
    indexGrid.value = data.grid
    toast.add('指标网格计算完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '计算失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleWorkfaces = async () => {
  loading.value = true
  try {
    const { data } = await pressureIndexWorkfaces({
      method: method.value,
      grid_size: gridSize.value,
      axis: faceAxis.value,
      count: faceCount.value,
      direction: faceDirection.value,
      mode: faceMode.value,
      decay: faceDecay.value,
      elastic_modulus: normalizedWeights.value.elastic,
      density: normalizedWeights.value.density,
      tensile_strength: normalizedWeights.value.tensile
    })
    workfaceGrid.value = data.workfaces.adjusted
    toast.add('工作面调整完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '计算失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleExport = async () => {
  loading.value = true
  try {
    const { data } = await exportIndex(method.value, gridSize.value)
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = `pressure_index_${method.value}_${gridSize.value}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.add('导出成功', 'success')
  } catch (err) {
    toast.add('导出失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleExportWorkfaces = async () => {
  loading.value = true
  try {
    const { data } = await exportPressureIndexWorkfaces({
      method: method.value,
      grid_size: gridSize.value,
      axis: faceAxis.value,
      count: faceCount.value,
      direction: faceDirection.value,
      mode: faceMode.value,
      decay: faceDecay.value,
      elastic_modulus: normalizedWeights.value.elastic,
      density: normalizedWeights.value.density,
      tensile_strength: normalizedWeights.value.tensile
    })
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = `pressure_index_workfaces_${faceAxis.value}_${faceCount.value}_${gridSize.value}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.add('导出成功', 'success')
  } catch (err) {
    toast.add('导出失败', 'error')
  } finally {
    loading.value = false
  }
}

watch([wElastic, wDensity, wTensile], saveWeights)
onMounted(loadWeights)
</script>

<style scoped>
.page-title {
  margin: 0 0 8px 0;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.page-subtitle {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #64748b;
}

.section-title {
  margin: 0 0 8px 0;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
}

.section-desc {
  margin: 0 0 16px 0;
  font-size: 13px;
  color: #64748b;
}

/* Weight Inputs */
.weight-inputs {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.weight-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 10px;
}

.weight-label {
  width: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.weight-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.weight-percent {
  width: 40px;
  font-size: 12px;
  color: #64748b;
  text-align: right;
}

/* Parameters */
.param-group {
  margin-bottom: 16px;
}

.param-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.param-select,
.param-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  background: white;
}

.param-select:focus,
.param-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* Actions */
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn.secondary {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Result */
.result-content {
  text-align: center;
}

.legend {
  margin-top: 16px;
}

.legend-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}

.legend-bar {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #1e40af, #2563eb, #3b82f6, #06b6d4, #10b981, #f59e0b);
  position: relative;
}

.legend-low,
.legend-high {
  position: absolute;
  top: 12px;
  font-size: 11px;
  color: #64748b;
}

.legend-low {
  left: 0;
}

.legend-high {
  right: 0;
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.result-section {
  margin-top: 20px;
  text-align: center;
}

/* Grid */
.grid {
  display: grid;
  gap: 20px;
}

.grid-2 {
  grid-template-columns: 1fr 1fr;
}

.grid-5 {
  grid-template-columns: repeat(5, 1fr);
}

.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
}

@media (max-width: 768px) {
  .grid-2,
  .grid-5 {
    grid-template-columns: 1fr;
  }

  .weight-item {
    flex-wrap: wrap;
  }

  .weight-label {
    width: 100%;
  }
}
</style>
