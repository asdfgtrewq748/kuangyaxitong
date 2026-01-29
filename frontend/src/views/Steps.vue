<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">📐 来压步距计算</h1>
      <p class="page-subtitle">基于顶板岩层力学参数计算初次来压步距和周期来压步距</p>
    </div>

    <div class="card">
      <h3 class="section-title">计算模型选择</h3>

      <!-- 模型选择 -->
      <div class="param-row">
        <div class="param-group">
          <label class="param-label">力学模型</label>
          <select v-model="stepModel" class="param-select">
            <option value="fixed">固支梁模型</option>
            <option value="simply">简支梁模型</option>
            <option value="shear">剪切破坏模型</option>
            <option value="empirical">经验比例模型</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">计算目标</label>
          <select v-model="stepTarget" class="param-select">
            <option value="initial">初次来压步距</option>
            <option value="periodic">周期来压步距</option>
          </select>
        </div>
      </div>

      <!-- 参数输入 -->
      <div class="param-grid">
        <div class="param-group">
          <label class="param-label">顶板厚度 h (m)</label>
          <input v-model.number="stepH" type="number" step="0.1" class="param-input">
        </div>
        <div class="param-group">
          <label class="param-label">载荷 q (MPa)</label>
          <input v-model.number="stepQ" type="number" step="0.1" class="param-input">
        </div>
        <div class="param-group">
          <label class="param-label">抗拉强度 t (MPa)</label>
          <input v-model.number="stepT" type="number" step="0.1" class="param-input">
        </div>
        <div class="param-group">
          <label class="param-label">抗剪强度 s (MPa)</label>
          <input v-model.number="stepS" type="number" step="0.1" class="param-input">
        </div>
      </div>

      <!-- 取值方式 -->
      <div class="param-row">
        <div class="param-group">
          <label class="param-label">h 取值方式</label>
          <select v-model="hMode" class="param-select">
            <option value="total">总厚度</option>
          </select>
        </div>
        <div class="param-group">
          <label class="param-label">q 取值方式</label>
          <select v-model="qMode" class="param-select">
            <option value="density_thickness">容重 × 厚度</option>
            <option value="default">默认值</option>
          </select>
        </div>
        <div class="param-group" v-if="qMode === 'default'">
          <label class="param-label">q 默认值</label>
          <input v-model.number="defaultQ" type="number" step="0.1" class="param-input">
        </div>
        <div class="param-group">
          <label class="param-label">网格大小</label>
          <input v-model.number="gridSize" type="number" min="20" max="120" class="param-input">
        </div>
      </div>

      <!-- 计算按钮 -->
      <div class="action-buttons">
        <button class="btn primary" @click="handleSteps" :disabled="loading">
          <span v-if="loading" class="spinner sm"></span>
          {{ loading ? '计算中...' : '计算步距' }}
        </button>
        <button class="btn secondary" @click="handleStepsGrid" :disabled="loading">
          生成步距网格
        </button>
        <button v-if="stepGrid" class="btn secondary" @click="handleExportGrid" :disabled="loading">
          导出网格
        </button>
        <button class="btn secondary" @click="handleStepsBatch" :disabled="loading">
          批量计算
        </button>
        <button v-if="stepBatch" class="btn secondary" @click="handleExportBatch" :disabled="loading">
          导出批量结果
        </button>
      </div>

      <!-- 计算结果 -->
      <div v-if="stepResult" class="result-box">
        <div class="result-header">计算结果</div>
        <div class="result-values">
          <div class="result-value">
            <span class="result-label">初次来压步距</span>
            <span class="result-number">{{ stepResult.initial_step?.toFixed(2) || '-' }} m</span>
          </div>
          <div class="result-value">
            <span class="result-label">周期来压步距</span>
            <span class="result-number">{{ stepResult.periodic_step?.toFixed(2) || '-' }} m</span>
          </div>
        </div>
        <div v-if="stepResult.error" class="result-error">
          注意：{{ stepResult.error }}
        </div>
      </div>
    </div>

    <!-- 步距网格 -->
    <div v-if="stepGrid" class="card">
      <h3 class="section-title">步距分布网格</h3>
      <div class="result-content">
        <HeatmapCanvas :grid="stepGrid.values" :size="500" />
      </div>
    </div>

    <!-- 批量计算结果 -->
    <div v-if="stepBatch" class="card">
      <h3 class="section-title">批量计算结果</h3>
      <p class="section-desc">已计算 {{ stepBatch.items?.length || 0 }} 个钻孔的来压步距</p>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>序号</th>
              <th>初次来压步距 (m)</th>
              <th>周期来压步距 (m)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in stepBatch.items?.slice(0, 20)" :key="i">
              <td>{{ i + 1 }}</td>
              <td>{{ item.initial?.toFixed(2) || '-' }}</td>
              <td>{{ item.periodic?.toFixed(2) || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="stepBatch.items?.length > 20" class="table-more">
          还有 {{ stepBatch.items.length - 20 }} 条数据...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '../composables/useToast'
import HeatmapCanvas from '../components/HeatmapCanvas.vue'
import {
  pressureSteps,
  pressureStepsBatch,
  pressureStepsGrid,
  exportPressureSteps,
  exportPressureStepsGrid
} from '../api'

const toast = useToast()
const stepModel = ref('fixed')
const stepTarget = ref('initial')
const stepH = ref(10)
const stepQ = ref(1)
const stepT = ref(2)
const stepS = ref(1)
const hMode = ref('total')
const qMode = ref('density_thickness')
const defaultQ = ref(1)
const gridSize = ref(60)
const loading = ref(false)
const stepResult = ref(null)
const stepGrid = ref(null)
const stepBatch = ref(null)

const handleSteps = async () => {
  loading.value = true
  try {
    const { data } = await pressureSteps(
      stepModel.value,
      stepH.value,
      stepQ.value,
      stepT.value,
      stepS.value
    )
    stepResult.value = data
    toast.add('步距计算完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '计算失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleStepsGrid = async () => {
  loading.value = true
  try {
    const { data } = await pressureStepsGrid(
      stepModel.value,
      stepTarget.value,
      hMode.value,
      qMode.value,
      gridSize.value,
      defaultQ.value
    )
    stepGrid.value = data
    toast.add('步距网格生成完成', 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '生成失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleStepsBatch = async () => {
  loading.value = true
  try {
    const { data } = await pressureStepsBatch(stepModel.value)
    stepBatch.value = data
    toast.add(`已计算 ${data.items?.length || 0} 个钻孔`, 'success')
  } catch (err) {
    toast.add(err.response?.data?.detail || '批量计算失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleExportGrid = async () => {
  loading.value = true
  try {
    const { data } = await exportPressureStepsGrid(
      stepModel.value,
      stepTarget.value,
      hMode.value,
      qMode.value,
      gridSize.value,
      defaultQ.value
    )
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = `pressure_steps_grid_${stepModel.value}_${stepTarget.value}_${gridSize.value}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.add('导出成功', 'success')
  } catch (err) {
    toast.add('导出失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleExportBatch = async () => {
  loading.value = true
  try {
    const { data } = await exportPressureSteps(stepModel.value)
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = `pressure_steps_${stepModel.value}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.add('导出成功', 'success')
  } catch (err) {
    toast.add('导出失败', 'error')
  } finally {
    loading.value = false
  }
}
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
  margin: 0 0 16px 0;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
}

.section-desc {
  margin: 0 0 16px 0;
  font-size: 13px;
  color: #64748b;
}

.param-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.param-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.param-group {
  display: flex;
  flex-direction: column;
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

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
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

.result-box {
  padding: 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  border-left: 4px solid #22c55e;
}

.result-header {
  font-size: 14px;
  font-weight: 600;
  color: #15803d;
  margin-bottom: 12px;
}

.result-values {
  display: flex;
  gap: 32px;
}

.result-value {
  text-align: center;
}

.result-label {
  display: block;
  font-size: 12px;
  color: #166534;
  margin-bottom: 4px;
}

.result-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #14532d;
}

.result-error {
  margin-top: 12px;
  padding: 8px 12px;
  background: rgba(234, 179, 8, 0.2);
  border-radius: 6px;
  font-size: 13px;
  color: #854d0e;
}

.result-content {
  text-align: center;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 16px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table th {
  text-align: left;
  padding: 10px 12px;
  background: #f1f5f9;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
}

.table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  color: #0f172a;
}

.table tbody tr:hover {
  background: #f8fafc;
}

.table-more {
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: #64748b;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .param-row,
  .param-grid {
    grid-template-columns: 1fr;
  }

  .result-values {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
