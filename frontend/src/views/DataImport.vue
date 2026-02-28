<template>
  <div class="page">
    <div class="grid grid-2">
      <!-- 宸︿晶锛氭枃浠朵笂浼?-->
      <div class="card upload-card">
        <h3 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          涓婁紶閽诲瓟鏁版嵁鏂囦欢
        </h3>
        <p class="section-desc">涓婁紶鍖呭惈宀╂€у弬鏁帮紙寮规€фā閲忋€佸閲嶃€佹姉鎷夊己搴︺€佸帤搴︼級鐨?CSV 鏂囦欢</p>

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
          <p class="upload-text">鐐瑰嚮閫夋嫨鎴栨嫋鎷芥枃浠跺埌姝ゅ</p>
          <p class="upload-hint">鏀寔 .csv 鏍煎紡锛屽彲澶氶€?</p>
        </div>

        <div v-if="files.length > 0" class="file-list">
          <div class="file-list-header">
            <span>宸查€夋嫨 {{ files.length }} 涓枃浠?</span>
            <button class="text-btn" @click="clearFiles">娓呯┖</button>
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
            {{ loading ? '涓婁紶涓?..' : '涓婁紶鏁版嵁' }}
          </button>
          <button class="btn secondary" @click="handleScan" :disabled="loading">
            鎵弿鏂囦欢
          </button>
        </div>

        <!-- 鎵弿缁撴灉 -->
        <div v-if="scanResult" class="result-box success">
          <div class="result-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="result-content">
            <div class="result-title">鎵弿瀹屾垚</div>
            <div class="result-desc">妫€娴嬪埌 {{ scanResult.files?.length || 0 }} 涓?CSV 鏂囦欢</div>
          </div>
        </div>

        <!-- 涓婁紶鍚庢彁鍙栫殑鍧愭爣棰勮 -->
        <div v-if="extractedCoords.length > 0" class="extracted-coords">
          <h4 class="subsection-title">浠庢枃浠朵腑鎻愬彇鐨勫潗鏍?</h4>
          <p class="subsection-desc">鍙戠幇 {{ extractedCoords.length }} 涓捇瀛斿寘鍚潗鏍囦俊鎭?</p>
          <button class="btn outline small" @click="useExtractedCoords">
            浣跨敤杩欎簺鍧愭爣
          </button>
        </div>
      </div>

      <!-- 鍙充晶锛氶捇瀛斿潗鏍?-->
      <div class="card upload-card">
        <h3 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          閽诲瓟鍧愭爣
        </h3>
        <p class="section-desc">璁剧疆閽诲瓟鐨勫钩闈綅缃潗鏍囷紙X, Y锛?</p>

        <!-- 鍧愭爣杈撳叆鏂瑰紡鍒囨崲 -->
        <div class="tab-buttons">
          <button :class="['tab-btn', { active: coordMode === 'manual' }]" @click="coordMode = 'manual'">
            鎵嬪姩杈撳叆
          </button>
          <button :class="['tab-btn', { active: coordMode === 'file' }]" @click="coordMode = 'file'">
            鏂囦欢涓婁紶
          </button>
        </div>

        <!-- 鎵嬪姩杈撳叆鍧愭爣 -->
        <FormPanel
          v-if="coordMode === 'manual'"
          title="鎵嬪姩鍧愭爣褰曞叆"
          description="支持增删钻孔并批量保存坐标"
          :auto-grid="false"
          :show-actions="true"
          :show-cancel="false"
          @submit="saveCoordinates"
        >
          <div class="coord-input">
            <div class="coord-list">
              <div v-for="(b, i) in boreholes" :key="i" class="coord-item">
                <span class="coord-num">#{{ i + 1 }}</span>
                <input type="text" v-model="b.name" placeholder="鍚嶇О" class="coord-name-input">
                <input type="number" v-model.number="b.x" placeholder="X (m)" class="coord-value-input">
                <input type="number" v-model.number="b.y" placeholder="Y (m)" class="coord-value-input">
                <button class="coord-remove" @click="removeBorehole(i)" title="鍒犻櫎">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <template #actions>
            <div class="coord-actions">
              <button class="btn outline small" type="button" @click="addBorehole">
                + 娣诲姞
              </button>
              <button class="btn primary small" type="submit" :disabled="loading || boreholes.length === 0">
                淇濆瓨鍧愭爣
              </button>
            </div>
          </template>
        </FormPanel>

        <!-- 鏂囦欢涓婁紶鍧愭爣 -->
        <div v-else class="coord-file">
          <div class="upload-area compact" @click="triggerCoordInput">
            <input ref="coordInput" type="file" accept=".csv,.json,.txt" @change="onCoordFile" style="display: none">
            <div class="upload-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <p class="upload-text">涓婁紶鍧愭爣鏂囦欢</p>
            <p class="upload-hint">鏀寔 CSV/JSON/TXT 鏍煎紡</p>
          </div>
          <div class="coord-format-hint">
            <strong>CSV 鏍煎紡绀轰緥锛?</strong><br>
            <code>name,x,y</code><br>
            <code>ZK01,100,200</code>
          </div>
        </div>

        <!-- 鍧愭爣缁熻 -->
        <div v-if="boreholes.length > 0" class="coord-stats">
          <div class="stat-badge">
            宸茶缃?<strong>{{ boreholes.length }}</strong> 涓捇瀛斿潗鏍?
          </div>
          <div class="stat-range">
            鑼冨洿: X {{ minX?.toFixed(0) }}~{{ maxX?.toFixed(0) }}m,
            Y {{ minY?.toFixed(0) }}~{{ maxY?.toFixed(0) }}m
          </div>
        </div>
      </div>
    </div>

    <!-- 浣嶇疆棰勮鍦板浘 - 绱у噾甯冨眬 -->
    <div class="card preview-card" v-if="boreholes.length > 0">
      <div class="preview-header">
        <div>
          <h3 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
            閽诲瓟浣嶇疆棰勮
          </h3>
          <p class="section-desc">{{ boreholes.length }} 涓捇瀛?路 鍙嫋鎷藉钩绉?路 婊氳疆缂╂斁 路 鐐瑰嚮閫夋嫨</p>
        </div>
        <div class="preview-actions">
          <button class="icon-btn" @click="exportCoords" title="瀵煎嚭鍧愭爣">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button class="icon-btn danger" @click="clearCoords" title="娓呯┖鍧愭爣">
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
        <!-- 宸︿晶鍦板浘 -->
        <div class="map-section">
          <BoreholeMap :boreholes="boreholes" :size="320" @select="onSelectBorehole" />
        </div>

        <!-- 鍙充晶鍧愭爣鍒楄〃 -->
        <div class="table-section">
          <div class="table-header">
            <h4>鍧愭爣鍒楄〃 ({{ filteredBoreholes.length }})</h4>
            <input
              v-model="searchQuery"
              placeholder="鎼滅储..."
              class="search-input"
            >
          </div>
          <div class="table-wrapper">
            <!-- Use virtual list for medium/large datasets (>=50 items) -->
            <template v-if="useVirtualList">
              <div class="virtual-table-header">
                <div class="virtual-row virtual-header">
                  <div class="virtual-cell" style="width: 50px;">搴忓彿</div>
                  <div class="virtual-cell">鍚嶇О</div>
                  <div class="virtual-cell" style="width: 80px;">X (m)</div>
                  <div class="virtual-cell" style="width: 80px;">Y (m)</div>
                  <div class="virtual-cell" style="width: 120px;">鎿嶄綔</div>
                </div>
              </div>
              <VirtualList
                :items="filteredBoreholes"
                :item-height="VIRTUAL_LIST_ITEM_HEIGHT"
                :height="VIRTUAL_LIST_VIEWPORT_HEIGHT"
                :buffer="virtualListBuffer"
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
                      <button class="table-btn" @click.stop="editBoreholeByItem(item)">缂栬緫</button>
                      <button class="table-btn danger" @click.stop="removeBoreholeByItem(item)">鍒犻櫎</button>
                    </div>
                  </div>
                </template>
              </VirtualList>
            </template>

            <!-- Regular table for smaller datasets -->
            <table v-else class="table compact">
              <thead>
                <tr>
                  <th>搴忓彿</th>
                  <th>鍚嶇О</th>
                  <th>X (m)</th>
                  <th>Y (m)</th>
                  <th>鎿嶄綔</th>
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
                    <button class="table-btn" @click.stop="editBoreholeByItem(b)">缂栬緫</button>
                    <button class="table-btn danger" @click.stop="removeBoreholeByItem(b)">鍒犻櫎</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="filteredBoreholes.length === 0" class="table-empty">
              娌℃湁鎵惧埌鍖归厤鐨勯捇瀛?
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 绌虹姸鎬?-->
    <div class="card" v-else>
      <EmptyState
        title="暂无钻孔位置数据"
        description="请先上传数据文件或手动录入坐标。"
      />
    </div>

    <ConfirmDialog
      v-model="clearDialogVisible"
      title="纭娓呯┖鍧愭爣"
      message="娓呯┖鍚庝細鍒犻櫎褰撳墠鍏ㄩ儴閽诲瓟鍧愭爣锛屽苟绉婚櫎鏈湴缂撳瓨锛屾槸鍚︾户缁紵"
      confirm-text="纭娓呯┖"
      cancel-text="鍙栨秷"
      variant="danger"
      @confirm="confirmClearCoords"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ConfirmDialog, EmptyState, FormPanel } from '../components/library'
import { useToast } from '../composables/useToast'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import BoreholeMap from '../components/BoreholeMap.vue'
import VirtualList from '../components/VirtualList.vue'
import {
  VIRTUAL_LIST_DEFAULT_BUFFER,
  VIRTUAL_LIST_ITEM_HEIGHT,
  VIRTUAL_LIST_THRESHOLD,
  VIRTUAL_LIST_VIEWPORT_HEIGHT
} from '../constants/performance'
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
const clearDialogVisible = ref(false)

// 閽诲瓟鍧愭爣鏁版嵁
const boreholes = ref([])
const extractedCoords = ref([])

// 璁＄畻灞炴€?
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

const useVirtualList = computed(() => filteredBoreholes.value.length >= VIRTUAL_LIST_THRESHOLD)
const virtualListBuffer = computed(() => {
  const size = filteredBoreholes.value.length
  if (size >= 2000) return 14
  if (size >= 800) return 12
  if (size >= 300) return 10
  return VIRTUAL_LIST_DEFAULT_BUFFER
})

// 鐩戝惉閫変腑鐘舵€侊紝鍚屾鍒板湴鍥剧粍浠?
watch(selectedBorehole, (val) => {
  // 鍙互鍦ㄨ繖閲屾坊鍔犻澶栫殑閫昏緫
})

// 浠?localStorage 鍔犺浇鍧愭爣
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

// 浠庝笂浼犵殑鏂囦欢涓彁鍙栧潗鏍?
const extractCoordinatesFromFiles = async () => {
  extractedCoords.value = []
  const coords = []

  for (const file of files.value) {
    try {
      // 浣跨敤棰勮 API 鑾峰彇鏂囦欢鍐呭锛堝吋瀹?rows/data 涓ょ杩斿洖瀛楁锛?
      const { data } = await previewBorehole(file.name, 100)
      const previewRows = data?.rows || data?.data || []

      // 妫€鏌ユ暟鎹腑鏄惁鍖呭惈鍧愭爣鍒?
      if (previewRows.length > 0) {

        // 鏌ユ壘鍙兘鐨勫潗鏍囧垪
        const xCol = Object.keys(previewRows[0]).find(k =>
          k.toLowerCase().includes('x') || k === '鍧愭爣x' || k === 'x鍧愭爣'
        )
        const yCol = Object.keys(previewRows[0]).find(k =>
          k.toLowerCase().includes('y') || k === '鍧愭爣y' || k === 'y鍧愭爣'
        )
        const nameCol = Object.keys(previewRows[0]).find(k =>
          k.toLowerCase().includes('name') || k.toLowerCase().includes('閽诲瓟') ||
          k === '閽诲瓟鍙?' || k === '瀛斿彿'
        )

        if (xCol && yCol) {
          // 鎻愬彇绗竴涓寘鍚潗鏍囩殑琛岋紙閫氬父姣忎釜鏂囦欢浠ｈ〃涓€涓捇瀛旓級
          const firstRow = previewRows[0]
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
      if (import.meta.env.DEV) {
        console.warn('鏃犳硶浠庢枃浠舵彁鍙栧潗鏍?', file.name, '鎻愬彇鍧愭爣:', e.message)
      }
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

    // 灏濊瘯浠庢枃浠朵腑鎻愬彇鍧愭爣
    await extractCoordinatesFromFiles()
  } catch (err) {
    toast.add(err.response?.data?.detail || '涓婁紶澶辫触', 'error')
  } finally {
    loading.value = false
  }
}

const handleScan = async () => {
  loading.value = true
  try {
    const { data } = await scanBoreholes()
    scanResult.value = data
    toast.add('鎵弿瀹屾垚', 'success')

    // 灏濊瘯鎻愬彇鍧愭爣
    await extractCoordinatesFromFiles()
  } catch (err) {
    toast.add(err.response?.data?.detail || '鎵弿澶辫触', 'error')
  } finally {
    loading.value = false
  }
}

// 浣跨敤鎻愬彇鐨勫潗鏍?
const useExtractedCoords = () => {
  if (extractedCoords.value.length > 0) {
    boreholes.value = [...extractedCoords.value]
    saveCoordinates()
    toast.add('已导入 ' + extractedCoords.value.length + ' 个钻孔坐标', 'success')
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
      // CSV or TXT: name,x,y 鏍煎紡
      const lines = content.split('\n')
      const startIndex = lines[0].toLowerCase().includes('name') ||
                        lines[0].toLowerCase().includes('鍚嶇О') ? 1 : 0

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

    // 杩囨护鏈夋晥鏁版嵁
    data = data.filter(b => !isNaN(b.x) && !isNaN(b.y))

    if (data.length > 0) {
      boreholes.value = data
      saveCoordinates()
      toast.add(`已导入 ${data.length} 个钻孔坐标`, 'success')
    } else {
      toast.add('文件格式不正确', 'error')
    }
  } catch (e) {
    toast.add('鏂囦欢瑙ｆ瀽澶辫触', 'error')
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
  const newName = prompt('閽诲瓟鍚嶇О:', b.name || '')
  const newX = prompt('X 鍧愭爣:', b.x)
  const newY = prompt('Y 鍧愭爣:', b.y)
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
  selectedBorehole.value = boreholes.value[index] ?? null
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
  if (!boreholes.value.length) return
  clearDialogVisible.value = true
}

const confirmClearCoords = () => {
  boreholes.value = []
  selectedBorehole.value = null
  localStorage.removeItem('borehole_coordinates')
  toast.add('坐标已清空', 'success')
}

onMounted(() => {
  loadCoordinates()
})
</script>

<style scoped>
.page-title {
  margin: 0 0 var(--spacing-2) 0;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.page-subtitle {
  margin: 0 0 var(--spacing-6) 0;
  font-size: 14px;
  color: #64748b;
}

.section-title {
  margin: 0 0 var(--spacing-2) 0;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.section-desc {
  margin: 0 0 var(--spacing-4) 0;
  font-size: 13px;
  color: #64748b;
}

.subsection-title {
  margin: var(--spacing-3) 0 var(--spacing-1) 0;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.subsection-desc {
  margin: 0 0 var(--spacing-2) 0;
  font-size: 12px;
  color: #64748b;
}

/* Grid */
.grid {
  display: grid;
  gap: var(--spacing-5);
}

.grid-2 {
  grid-template-columns: 1fr 1fr;
}

/* Card */
.card {
  background: white;
  border-radius: 16px;
  padding: var(--spacing-5);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
}

.preview-card {
  padding: var(--spacing-4);
}

/* Upload Card - with scroll */
.upload-card {
  max-height: 440px;
  overflow-y: auto;
}

/* 缇庡寲婊氬姩鏉?*/
.upload-card::-webkit-scrollbar {
  width: 8px;
}

.upload-card::-webkit-scrollbar-track {
  background: #edf5f3;
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
  padding: var(--spacing-8) var(--spacing-6);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #f4faf8 0%, #edf8f5 100%);
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
  background: radial-gradient(circle at center, rgba(14, 116, 144, 0.07) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: var(--color-primary);
  background: linear-gradient(135deg, #e8f7f3 0%, #d7f2eb 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(14, 116, 144, 0.2);
}

.upload-area:hover::before,
.upload-area.drag-over::before {
  opacity: 1;
}

.upload-area:hover .upload-text {
  color: var(--color-primary);
  transform: scale(1.02);
}

.upload-area:hover .upload-icon {
  transform: translateY(-4px) scale(1.1);
}

.upload-area.compact {
  padding: var(--spacing-4);
}

.upload-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto var(--spacing-3);
  color: #7cb7ae;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #d9f0eb 0%, #cde8e1 100%);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(14, 116, 144, 0.15);
}

.upload-area:hover .upload-icon {
  color: var(--color-primary);
  background: linear-gradient(135deg, #0f766e 0%, #0e7490 100%);
}

.upload-area:hover .upload-icon svg {
  stroke: white;
}

.upload-text {
  margin: 0 0 var(--spacing-1) 0;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
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
  margin-top: var(--spacing-5);
  padding: var(--spacing-4);
  background: linear-gradient(135deg, #f4faf8 0%, #edf8f5 100%);
  border-radius: 14px;
  border: 1px solid rgba(14, 116, 144, 0.14);
  box-shadow: 0 2px 8px rgba(14, 116, 144, 0.1);
}

.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-3);
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.file-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.file-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: white;
  border-radius: 10px;
  font-size: 13px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.file-item:hover {
  background: #f6fbfa;
  border-color: rgba(14, 116, 144, 0.22);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(14, 116, 144, 0.14);
}

.file-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
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
  color: var(--color-primary);
  cursor: pointer;
  font-size: 12px;
}

/* Actions */
.action-buttons {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-4);
  flex-wrap: wrap;
}

.coord-actions {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
}

.btn {
  padding: var(--spacing-2) var(--spacing-4);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn.small {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: 12px;
}

.btn.primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 14px rgba(14, 116, 144, 0.35);
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
  box-shadow: 0 8px 24px rgba(14, 116, 144, 0.45);
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
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: #e8f7f3;
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
  gap: var(--spacing-3);
  margin-top: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-4);
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
  margin-top: var(--spacing-4);
  padding: var(--spacing-3);
  background: #e8f7f3;
  border-radius: 10px;
  border-left: 4px solid var(--color-primary);
}

/* Tab Buttons */
.tab-buttons {
  display: flex;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
  padding: var(--spacing-1);
  background: #edf5f3;
  border-radius: 12px;
}

.tab-btn {
  flex: 1;
  padding: var(--spacing-3) var(--spacing-4);
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
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(14, 116, 144, 0.3),
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
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-3);
}

.coord-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-2);
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
  padding: var(--spacing-1) var(--spacing-2);
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
}

.coord-value-input {
  width: 60px;
  padding: var(--spacing-1);
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
  margin-top: var(--spacing-3);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.stat-badge {
  display: inline-block;
  padding: var(--spacing-1) var(--spacing-3);
  background: #e8f7f3;
  border-radius: 8px;
  color: var(--color-info);
  font-size: 12px;
}

.stat-range {
  font-size: 11px;
  color: #64748b;
  padding: 0 var(--spacing-1);
}

.coord-file {
  text-align: center;
}

.coord-format-hint {
  margin-top: var(--spacing-3);
  padding: var(--spacing-2) var(--spacing-3);
  background: #f4faf8;
  border-radius: 8px;
  font-size: 11px;
  color: #64748b;
  text-align: left;
}

.coord-format-hint code {
  background: #e2e8f0;
  padding: var(--spacing-1);
  border-radius: 4px;
  font-size: 10px;
}

/* Preview Section */
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-4);
}

.preview-actions {
  display: flex;
  gap: var(--spacing-1);
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
  border-color: var(--color-primary);
  background: #e8f7f3;
  color: var(--color-primary);
}

.icon-btn.danger:hover {
  border-color: #ef4444;
  background: #fee2e2;
  color: #ef4444;
}

.preview-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: var(--spacing-5);
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
  margin-bottom: var(--spacing-3);
}

.table-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.search-input {
  padding: var(--spacing-1) var(--spacing-3);
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  width: 120px;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.table-wrapper {
  flex: 1;
  overflow-y: auto;
  max-height: 320px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.table.compact th,
.table.compact td {
  padding: var(--spacing-2) var(--spacing-3);
}

.table th {
  text-align: left;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  color: var(--text-secondary);
  position: sticky;
  top: 0;
}

.table td {
  border-bottom: 1px solid var(--border-color-light);
  color: var(--text-primary);
}

.table tbody tr {
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.table tbody tr:hover {
  background: var(--bg-secondary);
}

.table tbody tr.selected {
  background: var(--bg-tertiary);
}

.table tbody tr.selected td {
  color: var(--text-primary);
  font-weight: 600;
}

.table-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: var(--spacing-1);
  font-size: 10px;
  cursor: pointer;
  margin-right: var(--spacing-1);
}

.table-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.table-btn.danger:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}

.table-empty {
  padding: var(--spacing-6);
  text-align: center;
  color: var(--text-tertiary);
  font-size: 13px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-10) var(--spacing-5);
  color: #94a3b8;
}

.empty-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto var(--spacing-3);
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
  background: #f4faf8;
  border-bottom: 2px solid #e2e8f0;
  border-radius: 8px 8px 0 0;
}

.virtual-header {
  font-weight: 600;
  color: #475569;
  background: #f4faf8;
}

.virtual-row {
  display: flex;
  align-items: center;
  padding: var(--spacing-3);
  border-bottom: 1px solid #edf5f3;
  transition: all 0.15s ease;
  cursor: pointer;
}

.virtual-row:hover {
  background: #f4faf8;
}

.virtual-row.selected {
  background: #d7f2eb;
  border-color: #99ead7;
}

.virtual-cell {
  flex: 1;
  padding: 0 var(--spacing-2);
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
  border: 1px solid var(--border-color);
  border-top: none;
}
</style>



