<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">📁 数据导入</h1>
      <p class="page-subtitle">上传钻孔数据，设置坐标位置，系统将自动解析并预览</p>
    </div>

    <div class="grid grid-2">
      <!-- 左侧：文件上传 -->
      <div class="card">
        <h3 class="section-title">📂 上传钻孔数据文件</h3>
        <p class="section-desc">上传包含岩性参数（弹性模量、容重、抗拉强度、厚度）的 CSV 文件</p>

        <div class="upload-area" :class="{ 'drag-over': isDragOver }"
             @drop.prevent="handleDrop"
             @dragover.prevent="isDragOver = true"
             @dragleave.prevent="isDragOver = false"
             @click="triggerFileInput">
          <input ref="fileInput" type="file" multiple accept=".csv" @change="onFiles" style="display: none">
          <div class="upload-icon">📄</div>
          <p class="upload-text">点击选择或拖拽文件到此处</p>
          <p class="upload-hint">支持 .csv 格式，可多选</p>
        </div>

        <div v-if="files.length > 0" class="file-list">
          <div class="file-list-header">
            <span>已选择 {{ files.length }} 个文件</span>
            <button class="text-btn" @click="clearFiles">清空</button>
          </div>
          <div class="file-items">
            <div v-for="(file, i) in files" :key="i" class="file-item">
              <span class="file-icon">📊</span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatSize(file.size) }}</span>
              <button class="file-remove" @click="removeFile(i)">×</button>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn primary" @click="handleUpload" :disabled="loading || files.length === 0">
            <span v-if="loading" class="spinner sm"></span>
            {{ loading ? '上传中...' : '上传数据' }}
          </button>
          <button class="btn secondary" @click="handleScan" :disabled="loading">
            扫描文件
          </button>
        </div>

        <!-- 扫描结果 -->
        <div v-if="scanResult" class="result-box success">
          <div class="result-icon">✓</div>
          <div class="result-content">
            <div class="result-title">扫描完成</div>
            <div class="result-desc">检测到 {{ scanResult.files?.length || 0 }} 个 CSV 文件</div>
          </div>
        </div>

        <!-- 上传后提取的坐标预览 -->
        <div v-if="extractedCoords.length > 0" class="extracted-coords">
          <h4 class="subsection-title">从文件中提取的坐标</h4>
          <p class="subsection-desc">发现 {{ extractedCoords.length }} 个钻孔包含坐标信息</p>
          <button class="btn outline small" @click="useExtractedCoords">
            使用这些坐标
          </button>
        </div>
      </div>

      <!-- 右侧：钻孔坐标 -->
      <div class="card">
        <h3 class="section-title">📍 钻孔坐标</h3>
        <p class="section-desc">设置钻孔的平面位置坐标（X, Y）</p>

        <!-- 坐标输入方式切换 -->
        <div class="tab-buttons">
          <button :class="['tab-btn', { active: coordMode === 'manual' }]" @click="coordMode = 'manual'">
            手动输入
          </button>
          <button :class="['tab-btn', { active: coordMode === 'file' }]" @click="coordMode = 'file'">
            文件上传
          </button>
        </div>

        <!-- 手动输入坐标 -->
        <div v-if="coordMode === 'manual'" class="coord-input">
          <div class="coord-list">
            <div v-for="(b, i) in boreholes" :key="i" class="coord-item">
              <span class="coord-num">#{{ i + 1 }}</span>
              <input type="text" v-model="b.name" placeholder="名称" class="coord-name-input">
              <input type="number" v-model.number="b.x" placeholder="X (m)" class="coord-value-input">
              <input type="number" v-model.number="b.y" placeholder="Y (m)" class="coord-value-input">
              <button class="coord-remove" @click="removeBorehole(i)" title="删除">×</button>
            </div>
          </div>
          <div class="coord-actions">
            <button class="btn outline small" @click="addBorehole">
              + 添加
            </button>
            <button class="btn primary small" @click="saveCoordinates" :disabled="loading || boreholes.length === 0">
              保存坐标
            </button>
          </div>
        </div>

        <!-- 文件上传坐标 -->
        <div v-else class="coord-file">
          <div class="upload-area compact" @click="triggerCoordInput">
            <input ref="coordInput" type="file" accept=".csv,.json,.txt" @change="onCoordFile" style="display: none">
            <div class="upload-icon">📍</div>
            <p class="upload-text">上传坐标文件</p>
            <p class="upload-hint">支持 CSV/JSON/TXT 格式</p>
          </div>
          <div class="coord-format-hint">
            <strong>CSV 格式示例：</strong><br>
            <code>name,x,y</code><br>
            <code>ZK01,100,200</code>
          </div>
        </div>

        <!-- 坐标统计 -->
        <div v-if="boreholes.length > 0" class="coord-stats">
          <div class="stat-badge">
            已设置 <strong>{{ boreholes.length }}</strong> 个钻孔坐标
          </div>
          <div class="stat-range">
            范围: X {{ minX?.toFixed(0) }}~{{ maxX?.toFixed(0) }}m,
            Y {{ minY?.toFixed(0) }}~{{ maxY?.toFixed(0) }}m
          </div>
        </div>
      </div>
    </div>

    <!-- 位置预览地图 - 紧凑布局 -->
    <div class="card preview-card" v-if="boreholes.length > 0">
      <div class="preview-header">
        <div>
          <h3 class="section-title">🗺️ 钻孔位置预览</h3>
          <p class="section-desc">{{ boreholes.length }} 个钻孔 · 可拖拽平移 · 滚轮缩放 · 点击选择</p>
        </div>
        <div class="preview-actions">
          <button class="icon-btn" @click="exportCoords" title="导出坐标">
            📥
          </button>
          <button class="icon-btn" @click="clearCoords" title="清空坐标">
            🗑️
          </button>
        </div>
      </div>

      <div class="preview-grid">
        <!-- 左侧地图 -->
        <div class="map-section">
          <BoreholeMap :boreholes="boreholes" :size="320" @select="onSelectBorehole" />
        </div>

        <!-- 右侧坐标列表 -->
        <div class="table-section">
          <div class="table-header">
            <h4>坐标列表</h4>
            <input
              v-model="searchQuery"
              placeholder="搜索..."
              class="search-input"
            >
          </div>
          <div class="table-wrapper">
            <table class="table compact">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>名称</th>
                  <th>X (m)</th>
                  <th>Y (m)</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(b, i) in filteredBoreholes"
                  :key="i"
                  :class="{ 'selected': selectedBorehole === i }"
                  @click="selectedBorehole = i"
                >
                  <td>{{ i + 1 }}</td>
                  <td>{{ b.name || `BH-${i + 1}` }}</td>
                  <td>{{ b.x?.toFixed(1) || '-' }}</td>
                  <td>{{ b.y?.toFixed(1) || '-' }}</td>
                  <td>
                    <button class="table-btn" @click.stop="editBorehole(i)">编辑</button>
                    <button class="table-btn danger" @click.stop="removeBorehole(i)">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="filteredBoreholes.length === 0" class="table-empty">
              没有找到匹配的钻孔
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="card" v-else>
      <div class="empty-state">
        <div class="empty-icon">🗺️</div>
        <p>暂无钻孔位置数据</p>
        <p class="empty-hint">请先上传数据文件或手动输入坐标</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useToast } from '../composables/useToast'
import BoreholeMap from '../components/BoreholeMap.vue'
import { scanBoreholes, uploadBoreholes, previewBorehole } from '../api'

const toast = useToast()
const fileInput = ref(null)
const coordInput = ref(null)
const files = ref([])
const isDragOver = ref(false)
const loading = ref(false)
const scanResult = ref(null)
const coordMode = ref('manual')
const selectedBorehole = ref(null)
const searchQuery = ref('')

// 钻孔坐标数据
const boreholes = ref([])
const extractedCoords = ref([])

// 计算属性
const minX = computed(() => boreholes.value.length ? Math.min(...boreholes.value.map(b => b.x)) : null)
const maxX = computed(() => boreholes.value.length ? Math.max(...boreholes.value.map(b => b.x)) : null)
const minY = computed(() => boreholes.value.length ? Math.min(...boreholes.value.map(b => b.y)) : null)
const maxY = computed(() => boreholes.value.length ? Math.max(...boreholes.value.map(b => b.y)) : null)

const filteredBoreholes = computed(() => {
  if (!searchQuery.value) return boreholes.value
  const q = searchQuery.value.toLowerCase()
  return boreholes.value.filter(b =>
    (b.name && b.name.toLowerCase().includes(q)) ||
    b.x?.toString().includes(q) ||
    b.y?.toString().includes(q)
  )
})

// 监听选中状态，同步到地图组件
watch(selectedBorehole, (val) => {
  // 可以在这里添加额外的逻辑
})

// 从 localStorage 加载坐标
const loadCoordinates = () => {
  try {
    const data = localStorage.getItem('borehole_coordinates')
    if (data) {
      boreholes.value = JSON.parse(data)
    }
  } catch (e) {
    console.error('Failed to load coordinates:', e)
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerCoordInput = () => {
  coordInput.value?.click()
}

const onFiles = (e) => {
  const newFiles = Array.from(e.target.files || []).filter(f => f.name.endsWith('.csv'))
  files.value = [...files.value, ...newFiles]
}

const handleDrop = (e) => {
  isDragOver.value = false
  const newFiles = Array.from(e.dataTransfer.files || []).filter(f => f.name.endsWith('.csv'))
  files.value = [...files.value, ...newFiles]
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

const clearFiles = () => {
  files.value = []
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 从上传的文件中提取坐标
const extractCoordinatesFromFiles = async () => {
  extractedCoords.value = []
  const coords = []

  for (const file of files.value) {
    try {
      // 使用预览 API 获取文件内容
      const { data } = await previewBorehole(file.name, 100)

      // 检查数据中是否包含坐标列
      if (data.data && data.data.length > 0) {
        const columns = Object.keys(data.data[0]).map(k => k.toLowerCase())

        // 查找可能的坐标列
        const xCol = Object.keys(data.data[0]).find(k =>
          k.toLowerCase().includes('x') || k === '坐标x' || k === 'x坐标'
        )
        const yCol = Object.keys(data.data[0]).find(k =>
          k.toLowerCase().includes('y') || k === '坐标y' || k === 'y坐标'
        )
        const nameCol = Object.keys(data.data[0]).find(k =>
          k.toLowerCase().includes('name') || k.toLowerCase().includes('钻孔') ||
          k === '钻孔号' || k === '孔号'
        )

        if (xCol && yCol) {
          // 提取第一个包含坐标的行（通常每个文件代表一个钻孔）
          const firstRow = data.data[0]
          const x = parseFloat(firstRow[xCol])
          const y = parseFloat(firstRow[yCol])

          if (!isNaN(x) && !isNaN(y)) {
            coords.push({
              name: nameCol ? firstRow[nameCol] : file.name.replace('.csv', ''),
              x,
              y,
              file: file.name
            })
          }
        }
      }
    } catch (e) {
      console.log('无法从', file.name, '提取坐标:', e.message)
    }
  }

  extractedCoords.value = coords
}

const handleUpload = async () => {
  loading.value = true
  try {
    await uploadBoreholes(files.value)
    const { data } = await scanBoreholes()
    scanResult.value = data
    toast.add(`已上传 ${files.value.length} 个文件`, 'success')

    // 尝试从文件中提取坐标
    await extractCoordinatesFromFiles()
  } catch (err) {
    toast.add(err.response?.data?.detail || '上传失败', 'error')
  } finally {
    loading.value = false
  }
}

const handleScan = async () => {
  loading.value = true
  try {
    const { data } = await scanBoreholes()
    scanResult.value = data
    toast.add('扫描完成', 'success')

    // 尝试提取坐标
    await extractCoordinatesFromFiles()
  } catch (err) {
    toast.add(err.response?.data?.detail || '扫描失败', 'error')
  } finally {
    loading.value = false
  }
}

// 使用提取的坐标
const useExtractedCoords = () => {
  if (extractedCoords.value.length > 0) {
    boreholes.value = [...extractedCoords.value]
    saveCoordinates()
    toast.add(`已导入 ${extractedCoords.value.length} 个钻孔坐标`, 'success')
    extractedCoords.value = []
  }
}

const onCoordFile = (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    const content = event.target.result
    parseCoordFile(content, file.name)
  }
  reader.readAsText(file)
}

const parseCoordFile = (content, filename) => {
  try {
    let data = []

    if (filename.endsWith('.json')) {
      data = JSON.parse(content)
    } else {
      // CSV or TXT: name,x,y 格式
      const lines = content.split('\n')
      const startIndex = lines[0].toLowerCase().includes('name') ||
                        lines[0].toLowerCase().includes('名称') ? 1 : 0

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue
        const parts = line.split(/[,\t\s]+/)
        if (parts.length >= 3) {
          const x = parseFloat(parts[1])
          const y = parseFloat(parts[2])
          if (!isNaN(x) && !isNaN(y)) {
            data.push({
              name: parts[0]?.trim(),
              x,
              y
            })
          }
        }
      }
    }

    // 过滤有效数据
    data = data.filter(b => !isNaN(b.x) && !isNaN(b.y))

    if (data.length > 0) {
      boreholes.value = data
      saveCoordinates()
      toast.add(`已导入 ${data.length} 个钻孔坐标`, 'success')
    } else {
      toast.add('文件格式不正确', 'error')
    }
  } catch (e) {
    toast.add('文件解析失败', 'error')
  }
}

const addBorehole = () => {
  boreholes.value.push({
    name: `BH-${boreholes.value.length + 1}`,
    x: 0,
    y: 0
  })
}

const removeBorehole = (index) => {
  boreholes.value.splice(index, 1)
  saveCoordinates()
  if (selectedBorehole.value === index) {
    selectedBorehole.value = null
  }
}

const editBorehole = (index) => {
  const b = boreholes.value[index]
  const newName = prompt('钻孔名称:', b.name || '')
  const newX = prompt('X 坐标:', b.x)
  const newY = prompt('Y 坐标:', b.y)
  if (newName !== null) b.name = newName
  if (newX !== null && !isNaN(parseFloat(newX))) b.x = parseFloat(newX)
  if (newY !== null && !isNaN(parseFloat(newY))) b.y = parseFloat(newY)
  saveCoordinates()
}

const onSelectBorehole = (index) => {
  selectedBorehole.value = index
}

const saveCoordinates = () => {
  localStorage.setItem('borehole_coordinates', JSON.stringify(boreholes.value))
  toast.add('坐标已保存', 'success')
}

const exportCoords = () => {
  const csv = boreholes.value.map(b =>
    `${b.name || ''},${b.x},${b.y}`
  ).join('\n')
  const header = 'name,x,y\n' + csv
  const blob = new Blob([header], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'borehole_coordinates.csv'
  a.click()
  URL.revokeObjectURL(url)
  toast.add('坐标已导出', 'success')
}

const clearCoords = () => {
  if (confirm('确定要清空所有坐标吗？')) {
    boreholes.value = []
    selectedBorehole.value = null
    localStorage.removeItem('borehole_coordinates')
    toast.add('坐标已清空', 'success')
  }
}

onMounted(() => {
  loadCoordinates()
})
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

.subsection-title {
  margin: 12px 0 4px 0;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.subsection-desc {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #64748b;
}

/* Grid */
.grid {
  display: grid;
  gap: 20px;
}

.grid-2 {
  grid-template-columns: 1fr 1fr;
}

/* Card */
.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
}

.preview-card {
  padding: 16px;
}

/* Upload Area */
.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 24px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #3b82f6;
  background: #eff6ff;
}

.upload-area.compact {
  padding: 16px;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.upload-text {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.upload-hint {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
}

/* File List */
.file-list {
  margin-top: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
}

.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

.file-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: white;
  border-radius: 8px;
  font-size: 12px;
}

.file-icon {
  font-size: 14px;
}

.file-name {
  flex: 1;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  color: #94a3b8;
  font-size: 11px;
  min-width: 50px;
}

.file-remove {
  width: 18px;
  height: 18px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.file-remove:hover {
  background: #fecaca;
}

.text-btn {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 12px;
}

/* Actions */
.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.coord-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.small {
  padding: 6px 12px;
  font-size: 12px;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.25);
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn.secondary {
  background: #e2e8f0;
  color: #475569;
}

.btn.secondary:hover {
  background: #cbd5e1;
}

.btn.outline {
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.btn.outline:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Result Box */
.result-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 10px;
}

.result-box.success {
  background: #f0fdf4;
  border-left: 4px solid #22c55e;
}

.result-icon {
  width: 24px;
  height: 24px;
  background: #22c55e;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.result-title {
  font-weight: 600;
  font-size: 13px;
  color: #15803d;
}

.result-desc {
  font-size: 12px;
  color: #166534;
}

/* Extracted Coords */
.extracted-coords {
  margin-top: 16px;
  padding: 12px;
  background: #eff6ff;
  border-radius: 10px;
  border-left: 4px solid #3b82f6;
}

/* Tab Buttons */
.tab-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #64748b;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* Coordinate Input */
.coord-input {
  max-height: 220px;
  overflow-y: auto;
}

.coord-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.coord-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: #f8fafc;
  border-radius: 8px;
}

.coord-num {
  font-size: 11px;
  color: #64748b;
  min-width: 24px;
}

.coord-name-input {
  flex: 1;
  padding: 5px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
}

.coord-value-input {
  width: 60px;
  padding: 5px 6px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
}

.coord-remove {
  width: 18px;
  height: 18px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.coord-stats {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-badge {
  display: inline-block;
  padding: 6px 10px;
  background: #eff6ff;
  border-radius: 8px;
  color: #1e40af;
  font-size: 12px;
}

.stat-range {
  font-size: 11px;
  color: #64748b;
  padding: 0 4px;
}

.coord-file {
  text-align: center;
}

.coord-format-hint {
  margin-top: 12px;
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 11px;
  color: #64748b;
  text-align: left;
}

.coord-format-hint code {
  background: #e2e8f0;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 10px;
}

/* Preview Section */
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.preview-actions {
  display: flex;
  gap: 6px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.icon-btn:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.preview-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
}

.map-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.table-section {
  display: flex;
  flex-direction: column;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.table-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.search-input {
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  width: 120px;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.table-wrapper {
  flex: 1;
  overflow-y: auto;
  max-height: 320px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.table.compact th,
.table.compact td {
  padding: 8px 10px;
}

.table th {
  text-align: left;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
  position: sticky;
  top: 0;
}

.table td {
  border-bottom: 1px solid #f1f5f9;
  color: #0f172a;
}

.table tbody tr {
  cursor: pointer;
  transition: background 0.15s;
}

.table tbody tr:hover {
  background: #f8fafc;
}

.table tbody tr.selected {
  background: #eff6ff;
}

.table tbody tr.selected td {
  color: #1e40af;
  font-weight: 500;
}

.table-btn {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 10px;
  cursor: pointer;
  margin-right: 4px;
}

.table-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.table-btn.danger:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.table-empty {
  padding: 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 10px;
  opacity: 0.6;
}

.empty-hint {
  font-size: 13px;
  color: #94a3b8;
}

@media (max-width: 900px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }

  .preview-grid {
    grid-template-columns: 1fr;
  }

  .map-section {
    order: -1;
  }
}
</style>
