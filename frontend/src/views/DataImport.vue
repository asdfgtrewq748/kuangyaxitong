<template>
  <div class="page">
    <div class="grid grid-2">
      <!-- 左侧：文件上传 -->
      <div class="card upload-card">
        <h3 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          上传钻孔数据文件
        </h3>
        <p class="section-desc">上传包含岩性参数（弹性模量、容重、抗拉强度、厚度）的 CSV 文件</p>

        <div class="upload-area" :class="{ 'drag-over': isDragOver }"
             @drop.prevent="handleDrop"
             @dragover.prevent="isDragOver = true"
             @dragleave.prevent="isDragOver = false"
             @click="triggerFileInput">
          <input ref="fileInput" type="file" multiple accept=".csv" @change="onFiles" style="display: none">
          <div class="upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
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
              <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatSize(file.size) }}</span>
              <button class="file-remove" @click="removeFile(i)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
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
          <div class="result-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
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
      <div class="card upload-card">
        <h3 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          钻孔坐标
        </h3>
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
              <button class="coord-remove" @click="removeBorehole(i)" title="删除">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
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
            <div class="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
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
          <h3 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
            钻孔位置预览
          </h3>
          <p class="section-desc">{{ boreholes.length }} 个钻孔 · 可拖拽平移 · 滚轮缩放 · 点击选择</p>
        </div>
        <div class="preview-actions">
          <button class="icon-btn" @click="exportCoords" title="导出坐标">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button class="icon-btn danger" @click="clearCoords" title="清空坐标">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
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
            <h4>坐标列表 ({{ filteredBoreholes.length }})</h4>
            <input
              v-model="searchQuery"
              placeholder="搜索..."
              class="search-input"
            >
          </div>
          <div class="table-wrapper">
            <!-- Use virtual list for large datasets (>100 items) -->
            <template v-if="filteredBoreholes.length > 100">
              <div class="virtual-table-header">
                <div class="virtual-row virtual-header">
                  <div class="virtual-cell" style="width: 50px;">序号</div>
                  <div class="virtual-cell">名称</div>
                  <div class="virtual-cell" style="width: 80px;">X (m)</div>
                  <div class="virtual-cell" style="width: 80px;">Y (m)</div>
                  <div class="virtual-cell" style="width: 120px;">操作</div>
                </div>
              </div>
              <VirtualList
                :items="filteredBoreholes"
                :item-height="44"
                :height="320"
                :buffer="5"
                key-field="name"
                item-class="virtual-row"
              >
                <template #default="{ item, index }">
                  <div
                    :class="{ 'selected': selectedBorehole === item }"
                    @click="selectedBorehole = item"
                    style="display: flex; width: 100%; height: 100%; align-items: center;"
                  >
                    <div class="virtual-cell" style="width: 50px;">{{ index + 1 }}</div>
                    <div class="virtual-cell">{{ item.name || `BH-${index + 1}` }}</div>
                    <div class="virtual-cell" style="width: 80px;">{{ item.x?.toFixed(1) || '-' }}</div>
                    <div class="virtual-cell" style="width: 80px;">{{ item.y?.toFixed(1) || '-' }}</div>
                    <div class="virtual-cell" style="width: 120px;">
                      <button class="table-btn" @click.stop="editBoreholeByItem(item)">编辑</button>
                      <button class="table-btn danger" @click.stop="removeBoreholeByItem(item)">删除</button>
                    </div>
                  </div>
                </template>
              </VirtualList>
            </template>

            <!-- Regular table for smaller datasets -->
            <table v-else class="table compact">
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
                  :class="{ 'selected': selectedBorehole === b }"
                  @click="selectedBorehole = b"
                >
                  <td>{{ i + 1 }}</td>
                  <td>{{ b.name || `BH-${i + 1}` }}</td>
                  <td>{{ b.x?.toFixed(1) || '-' }}</td>
                  <td>{{ b.y?.toFixed(1) || '-' }}</td>
                  <td>
                    <button class="table-btn" @click.stop="editBoreholeByItem(b)">编辑</button>
                    <button class="table-btn danger" @click.stop="removeBoreholeByItem(b)">删除</button>
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
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
        </div>
        <p>暂无钻孔位置数据</p>
        <p class="empty-hint">请先上传数据文件或手动输入坐标</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useToast } from '../composables/useToast'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import BoreholeMap from '../components/BoreholeMap.vue'
import VirtualList from '../components/VirtualList.vue'
import { scanBoreholes, uploadBoreholes, previewBorehole } from '../api'

const toast = useToast()
const { markStepDone } = useWorkspaceFlow()
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
    markStepDone('DataImport')
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
  const item = boreholes.value[index]
  boreholes.value.splice(index, 1)
  saveCoordinates()
  // Clear selection if the removed item was selected
  if (selectedBorehole.value === index || selectedBorehole.value === item) {
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

// Helper to get original index from borehole object
const getBoreholeIndex = (boreholeItem) => {
  if (typeof boreholeItem === 'number') return boreholeItem
  return boreholes.value.indexOf(boreholeItem)
}

// Remove borehole by object (for virtual list with filtered data)
const removeBoreholeByItem = (item) => {
  const index = getBoreholeIndex(item)
  if (index !== -1) {
    removeBorehole(index)
  }
}

// Edit borehole by object (for virtual list with filtered data)
const editBoreholeByItem = (item) => {
  const index = getBoreholeIndex(item)
  if (index !== -1) {
    editBorehole(index)
  }
}

const onSelectBorehole = (index) => {
  selectedBorehole.value = index
}

const saveCoordinates = () => {
  localStorage.setItem('borehole_coordinates', JSON.stringify(boreholes.value))
  markStepDone('DataImport', { boreholes: boreholes.value.length || 0 })
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  flex-shrink: 0;
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

/* Upload Card - with scroll */
.upload-card {
  max-height: 440px;
  overflow-y: auto;
}

/* 美化滚动条 */
.upload-card::-webkit-scrollbar {
  width: 8px;
}

.upload-card::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.upload-card::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.upload-card::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Upload Area */
.upload-area {
  border: 3px dashed #cbd5e1;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%);
  position: relative;
  overflow: hidden;
}

.upload-area::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #6366f1;
  background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.15);
}

.upload-area:hover::before,
.upload-area.drag-over::before {
  opacity: 1;
}

.upload-area:hover .upload-text {
  color: #6366f1;
  transform: scale(1.02);
}

.upload-area:hover .upload-icon {
  transform: translateY(-4px) scale(1.1);
}

.upload-area.compact {
  padding: 16px;
}

.upload-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  color: #a5b4fc;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.upload-area:hover .upload-icon {
  color: #6366f1;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.upload-area:hover .upload-icon svg {
  stroke: white;
}

.upload-text {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 600;
  color: #334155;
  transition: all 0.3s ease;
}

.upload-hint {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}

/* File List */
.file-list {
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%);
  border-radius: 14px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.06);
}

.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.file-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: white;
  border-radius: 10px;
  font-size: 13px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.file-item:hover {
  background: #fafbff;
  border-color: rgba(99, 102, 241, 0.2);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

.file-icon {
  width: 16px;
  height: 16px;
  color: #3b82f6;
  flex-shrink: 0;
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
  width: 20px;
  height: 20px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 0.2s;
}

.file-remove:hover {
  background: #fecaca;
}

.file-remove svg {
  width: 12px;
  height: 12px;
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
  transition: all 0.2s ease;
}

.btn.small {
  padding: 6px 12px;
  font-size: 12px;
}

.btn.primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  position: relative;
  overflow: hidden;
}

.btn.primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.45);
}

.btn.primary:hover:not(:disabled)::before {
  left: 100%;
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
  background: #eff6ff;
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
  flex-shrink: 0;
}

.result-icon svg {
  width: 14px;
  height: 14px;
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
  gap: 10px;
  margin-bottom: 18px;
  padding: 4px;
  background: #f1f5f9;
  border-radius: 12px;
}

.tab-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  position: relative;
}

.tab-btn:hover:not(.active) {
  color: #475569;
  background: rgba(255, 255, 255, 0.5);
}

.tab-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
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
  transition: background 0.15s;
}

.coord-item:hover {
  background: #f1f5f9;
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
  width: 20px;
  height: 20px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 0.2s;
}

.coord-remove:hover {
  background: #fecaca;
}

.coord-remove svg {
  width: 12px;
  height: 12px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s;
  color: #64748b;
}

.icon-btn svg {
  width: 16px;
  height: 16px;
}

.icon-btn:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.icon-btn.danger:hover {
  border-color: #ef4444;
  background: #fee2e2;
  color: #ef4444;
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
  width: 56px;
  height: 56px;
  margin: 0 auto 10px;
  color: #94a3b8;
  opacity: 0.6;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Virtual Table Styles */
.virtual-table-header {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  border-radius: 8px 8px 0 0;
}

.virtual-header {
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
}

.virtual-row {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.15s ease;
  cursor: pointer;
}

.virtual-row:hover {
  background: #f8fafc;
}

.virtual-row.selected {
  background: #e0e7ff;
  border-color: #c7d2fe;
}

.virtual-cell {
  flex: 1;
  padding: 0 8px;
  font-size: 13px;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.virtual-header .virtual-cell {
  font-weight: 600;
}

/* Ensure virtual list container has proper height */
.table-wrapper :deep(.virtual-list-container) {
  border-radius: 0 0 8px 8px;
  border: 1px solid #e2e8f0;
  border-top: none;
}
</style>
