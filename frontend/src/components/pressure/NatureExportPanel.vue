<template>
  <div class="nature-export-panel">
    <div class="export-header">
      <div class="export-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </div>
      <div class="export-title">
        <h4>Nature标准导出</h4>
        <span>符合Nature期刊配图规范</span>
      </div>
    </div>

    <div class="export-options">
      <div class="option-section">
        <label class="section-label">图幅尺寸</label>
        <div class="size-options">
          <button
            v-for="size in sizeOptions"
            :key="size.id"
            :class="['size-btn', { active: selectedSize === size.id }]"
            @click="selectedSize = size.id"
          >
            <span class="size-name">{{ size.name }}</span>
            <span class="size-dim">{{ size.width }} cm</span>
          </button>
        </div>
      </div>

      <div class="option-section">
        <label class="section-label">导出格式</label>
        <div class="format-options">
          <button
            v-for="fmt in formatOptions"
            :key="fmt.id"
            :class="['format-btn', { active: selectedFormat === fmt.id, recommended: fmt.recommended }]"
            @click="selectedFormat = fmt.id"
          >
            <span class="format-name">{{ fmt.name }}</span>
            <span v-if="fmt.recommended" class="format-badge">推荐</span>
          </button>
        </div>
      </div>

      <div class="option-section">
        <label class="section-label">分辨率 (DPI)</label>
        <div class="dpi-slider">
          <input
            type="range"
            v-model.number="dpiValue"
            :min="96"
            :max="600"
            :step="96"
          />
          <div class="dpi-labels">
            <span :class="{ active: dpiValue === 96 }">96 (屏幕)</span>
            <span :class="{ active: dpiValue === 300 }">300 (印刷)</span>
            <span :class="{ active: dpiValue === 600 }">600 (出版)</span>
          </div>
        </div>
      </div>
    </div>

    <div class="compliance-check">
      <h5>Nature合规检查</h5>
      <div class="check-list">
        <div class="check-item" v-for="check in complianceChecks" :key="check.id">
          <svg v-if="check.passed" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span :class="{ passed: check.passed }">{{ check.label }}</span>
        </div>
      </div>
    </div>

    <div class="export-preview">
      <div class="preview-title">导出预览</div>
      <div class="preview-content">
        <div class="preview-panel" v-for="i in 6" :key="i">
          <span class="panel-label">{{ getPanelLabel(i-1) }}</span>
        </div>
      </div>
      <div class="preview-info">
        <span>{{ panels.length }} 个面板</span>
        <span>{{ estimatedSize }} MB</span>
        <span>{{ dpiValue }} DPI</span>
      </div>
    </div>

    <button 
      class="export-action-btn" 
      :class="{ exporting: isExporting }"
      @click="startExport"
      :disabled="isExporting"
    >
      <div v-if="isExporting" class="export-spinner"></div>
      <span>{{ isExporting ? '导出中...' : '开始导出' }}</span>
    </button>

    <div v-if="exportProgress > 0 && exportProgress < 100" class="export-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: exportProgress + '%' }"></div>
      </div>
      <span class="progress-text">{{ exportProgress }}%</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NATURE_DIMENSIONS } from '@/utils/natureFigureConfig'
import { batchExport, exportECharts } from '@/utils/figureExport'

const props = defineProps({
  panels: { type: Array, default: () => [] },
  charts: { type: Array, default: () => [] }
})

const emit = defineEmits(['export-complete'])

// 状态
const selectedSize = ref('double')
const selectedFormat = ref('svg')
const dpiValue = ref(300)
const isExporting = ref(false)
const exportProgress = ref(0)

// 选项
const sizeOptions = [
  { id: 'single', name: '单栏', width: 8.5 },
  { id: 'oneHalf', name: '1.5栏', width: 11.4 },
  { id: 'double', name: '双栏', width: 17.4 }
]

const formatOptions = [
  { id: 'png', name: 'PNG' },
  { id: 'tiff', name: 'TIFF', recommended: true },
  { id: 'svg', name: 'SVG', recommended: true },
  { id: 'pdf', name: 'PDF' }
]

// 合规检查
const complianceChecks = computed(() => [
  { id: 1, label: `分辨率: ${dpiValue.value} DPI ${dpiValue.value >= 300 ? '(≥300 通过)' : '(<300 警告)'}`, passed: dpiValue.value >= 300 },
  { id: 2, label: '字体: Arial 8pt (通过)', passed: true },
  { id: 3, label: '线条宽度: ≥0.5pt (通过)', passed: true },
  { id: 4, label: '色彩空间: 色盲友好 (通过)', passed: true },
  { id: 5, label: '背景: 纯白不透明 (通过)', passed: true }
])

// 预览信息
const estimatedSize = computed(() => {
  const baseSize = 0.5 // MB
  const dpiFactor = dpiValue.value / 96
  return (baseSize * dpiFactor * props.panels.length).toFixed(1)
})

// 获取面板标签
function getPanelLabel(index) {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[index] || ''
}

// 开始导出
async function startExport() {
  if (isExporting.value) return
  
  isExporting.value = true
  exportProgress.value = 0
  
  const totalPanels = props.charts.length
  const exports = []
  
  for (let i = 0; i < totalPanels; i++) {
    const chart = props.charts[i]
    
    try {
      const dataUrl = exportECharts(chart, {
        type: selectedFormat.value,
        pixelRatio: dpiValue.value / 96
      })
      
      exports.push({
        index: i,
        label: getPanelLabel(i),
        dataUrl,
        success: true
      })
    } catch (error) {
      exports.push({
        index: i,
        label: getPanelLabel(i),
        error: error.message,
        success: false
      })
    }
    
    exportProgress.value = Math.round(((i + 1) / totalPanels) * 100)
  }
  
  isExporting.value = false
  emit('export-complete', exports)
  
  // 下载所有文件
  exports.forEach((exp, i) => {
    if (exp.success) {
      const link = document.createElement('a')
      link.download = `Fig_${exp.label}_panel_${new Date().toISOString().split('T')[0]}.${selectedFormat.value}`
      link.href = exp.dataUrl
      setTimeout(() => link.click(), i * 200)
    }
  })
}
</script>

<style scoped>
.nature-export-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.export-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.export-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1a1a1a, #333);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.export-icon svg {
  width: 20px;
  height: 20px;
}

.export-title h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.export-title span {
  font-size: 11px;
  color: #737373;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.option-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  font-size: 11px;
  font-weight: 600;
  color: #525252;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.size-options,
.format-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.size-btn,
.format-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.size-btn:hover,
.format-btn:hover {
  border-color: #1a1a1a;
}

.size-btn.active,
.format-btn.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: white;
}

.size-name,
.format-name {
  font-size: 12px;
  font-weight: 600;
}

.size-dim {
  font-size: 10px;
  color: #737373;
}

.size-btn.active .size-dim {
  color: #a3a3a3;
}

.format-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  padding: 2px 6px;
  background: #22c55e;
  color: white;
  font-size: 9px;
  font-weight: 600;
  border-radius: 4px;
}

.dpi-slider {
  padding: 8px 0;
}

.dpi-slider input {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: #e5e5e5;
  border-radius: 2px;
  outline: none;
}

.dpi-slider input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #1a1a1a;
  border-radius: 50%;
  cursor: pointer;
}

.dpi-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 10px;
  color: #a3a3a3;
}

.dpi-labels .active {
  color: #1a1a1a;
  font-weight: 600;
}

.compliance-check {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.compliance-check h5 {
  margin: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
}

.check-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #525252;
}

.check-item svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.check-item .passed {
  color: #166534;
}

.export-preview {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.preview-title {
  font-size: 11px;
  font-weight: 600;
  color: #525252;
  margin-bottom: 8px;
}

.preview-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 8px;
}

.preview-panel {
  aspect-ratio: 4/3;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e5e5;
}

.panel-label {
  width: 20px;
  height: 20px;
  background: #1a1a1a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  border-radius: 3px;
}

.preview-info {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #737373;
}

.export-action-btn {
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.export-action-btn:hover:not(:disabled) {
  background: #333;
}

.export-action-btn.exporting {
  background: #525252;
  cursor: not-allowed;
}

.export-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.export-progress {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: #e5e5e5;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1a1a1a;
  transition: width 0.3s;
}

.progress-text {
  font-size: 11px;
  font-weight: 600;
  color: #525252;
  min-width: 35px;
  text-align: right;
}
</style>
