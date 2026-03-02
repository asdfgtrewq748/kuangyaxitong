<template>
  <div class="pressure-control-panel">
    <!-- 面板标题 -->
    <div class="panel-header">
      <h3 class="panel-title">控制面板</h3>
    </div>

    <!-- 柱类型选择 -->
    <div class="control-section">
      <label class="section-label">立柱类型</label>
      <div class="button-group">
        <button
          v-for="option in columnTypeOptions"
          :key="option.value"
          :class="['option-btn', { active: columnType === option.value }]"
          @click="$emit('update:columnType', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- 时间范围 -->
    <div class="control-section">
      <label class="section-label">时间范围</label>
      <div class="date-inputs">
        <div class="date-field">
          <span class="date-label">起始</span>
          <input
            type="date"
            :value="formatDateForInput(startDate)"
            @input="$emit('update:startDate', parseDate($event.target.value))"
            class="date-input"
          />
        </div>
        <div class="date-field">
          <span class="date-label">结束</span>
          <input
            type="date"
            :value="formatDateForInput(endDate)"
            @input="$emit('update:endDate', parseDate($event.target.value))"
            class="date-input"
          />
        </div>
      </div>

      <!-- 快捷选择 -->
      <div class="quick-select">
        <button
          v-for="preset in timePresets"
          :key="preset.value"
          class="preset-btn"
          @click="applyTimePreset(preset.value)"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- 阻力阈值 -->
    <div class="control-section">
      <label class="section-label">阻力阈值</label>
      <div class="threshold-controls">
        <div class="threshold-item">
          <span class="threshold-label">下限</span>
          <input
            type="range"
            min="0"
            max="30"
            :value="lowThreshold"
            @input="$emit('update:lowThreshold', parseFloat($event.target.value))"
            class="threshold-slider"
          />
          <span class="threshold-value">{{ lowThreshold }} MPa</span>
        </div>
        <div class="threshold-item">
          <span class="threshold-label">上限</span>
          <input
            type="range"
            min="30"
            max="60"
            :value="highThreshold"
            @input="$emit('update:highThreshold', parseFloat($event.target.value))"
            class="threshold-slider"
          />
          <span class="threshold-value">{{ highThreshold }} MPa</span>
        </div>
      </div>
    </div>

    <!-- 支架选择 -->
    <div class="control-section">
      <label class="section-label">支架选择</label>
      <div class="support-range">
        <div class="range-input">
          <span class="range-label">从</span>
          <input
            type="number"
            min="1"
            max="125"
            :value="supportStart"
            @input="$emit('update:supportStart', parseInt($event.target.value) || 1)"
            class="number-input"
          />
        </div>
        <span class="range-separator">—</span>
        <div class="range-input">
          <span class="range-label">到</span>
          <input
            type="number"
            min="1"
            max="125"
            :value="supportEnd"
            @input="$emit('update:supportEnd', parseInt($event.target.value) || 125)"
            class="number-input"
          />
        </div>
      </div>

      <!-- 常用支架快捷选择 -->
      <div class="support-presets">
        <button
          v-for="preset in supportPresets"
          :key="preset.value"
          class="preset-btn small"
          :class="{ active: supportStart === preset.start && supportEnd === preset.end }"
          @click="applySupportPreset(preset)"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- 显示选项 -->
    <div class="control-section">
      <label class="section-label">显示选项</label>
      <div class="checkbox-group">
        <label class="checkbox-item">
          <input
            type="checkbox"
            :checked="showGrid"
            @change="$emit('update:showGrid', $event.target.checked)"
          />
          <span class="checkbox-label">显示网格</span>
        </label>
        <label class="checkbox-item">
          <input
            type="checkbox"
            :checked="showContours"
            @change="$emit('update:showContours', $event.target.checked)"
          />
          <span class="checkbox-label">显示等值线</span>
        </label>
        <label class="checkbox-item">
          <input
            type="checkbox"
            :checked="showAnomalies"
            @change="$emit('update:showAnomalies', $event.target.checked)"
          />
          <span class="checkbox-label">高亮异常值</span>
        </label>
        <label class="checkbox-item">
          <input
            type="checkbox"
            :checked="showPeaks"
            @change="$emit('update:showPeaks', $event.target.checked)"
          />
          <span class="checkbox-label">标记峰值</span>
        </label>
      </div>
    </div>

    <!-- 颜色方案 -->
    <div class="control-section">
      <label class="section-label">配色方案</label>
      <div class="color-schemes">
        <button
          v-for="scheme in colorSchemes"
          :key="scheme.value"
          :class="['color-btn', { active: colorScheme === scheme.value }]"
          :style="{ background: scheme.gradient }"
          :title="scheme.label"
          @click="$emit('update:colorScheme', scheme.value)"
        />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="control-section actions">
      <button class="action-btn primary" @click="$emit('apply')">
        <span class="btn-icon">✓</span>
        应用更改
      </button>
      <button class="action-btn secondary" @click="$emit('reset')">
        <span class="btn-icon">↺</span>
        重置
      </button>
    </div>

    <!-- 当前统计 -->
    <div class="control-section stats" v-if="stats">
      <label class="section-label">当前统计</label>
      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-value">{{ formatNumber(stats.mean) }}</span>
          <span class="stat-label">均值</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">±{{ formatNumber(stats.std) }}</span>
          <span class="stat-label">标准差</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">{{ formatNumber(stats.min) }}</span>
          <span class="stat-label">最小值</span>
        </div>
        <div class="stat-box">
          <span class="stat-value">{{ formatNumber(stats.max) }}</span>
          <span class="stat-label">最大值</span>
        </div>
        <div class="stat-box wide">
          <span class="stat-value">{{ stats.n || '-' }}</span>
          <span class="stat-label">样本数</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// ============================================================================
// Props & Emits
// ============================================================================

const props = defineProps({
  // 柱类型
  columnType: { type: String, default: 'all' },

  // 时间范围
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },

  // 阈值
  lowThreshold: { type: Number, default: 10 },
  highThreshold: { type: Number, default: 45 },

  // 支架范围
  supportStart: { type: Number, default: 1 },
  supportEnd: { type: Number, default: 125 },

  // 显示选项
  showGrid: { type: Boolean, default: false },
  showContours: { type: Boolean, default: false },
  showAnomalies: { type: Boolean, default: false },
  showPeaks: { type: Boolean, default: false },

  // 颜色方案
  colorScheme: { type: String, default: 'diverging' },

  // 统计数据
  stats: { type: Object, default: null }
})

const emit = defineEmits([
  'update:columnType',
  'update:startDate',
  'update:endDate',
  'update:lowThreshold',
  'update:highThreshold',
  'update:supportStart',
  'update:supportEnd',
  'update:showGrid',
  'update:showContours',
  'update:showAnomalies',
  'update:showPeaks',
  'update:colorScheme',
  'apply',
  'reset'
])

// ============================================================================
// Constants
// ============================================================================

const columnTypeOptions = [
  { value: 'all', label: '综合' },
  { value: '前左柱', label: '前左柱' },
  { value: '后右柱', label: '后右柱' }
]

const timePresets = [
  { label: '1个月', value: 30 },
  { label: '3个月', value: 90 },
  { label: '6个月', value: 180 },
  { label: '全部', value: 365 }
]

const supportPresets = [
  { label: '1-20', start: 1, end: 20 },
  { label: '21-50', start: 21, end: 50 },
  { label: '51-80', start: 51, end: 80 },
  { label: '81-125', start: 81, end: 125 }
]

const colorSchemes = [
  { value: 'diverging', label: '发散', gradient: 'linear-gradient(to right, #2166AC, #F7F7F7, #B2182B)' },
  { value: 'sequential', label: '顺序', gradient: 'linear-gradient(to right, #440154, #31688E, #35B779, #FDE725)' },
  { value: 'viridis', label: '翠绿', gradient: 'linear-gradient(to right, #440154, #31688E, #35B779, #FDE725)' },
  { value: 'heat', label: '热力', gradient: 'linear-gradient(to right, #0000FF, #00FF00, #FFFF00, #FF0000)' }
]

// ============================================================================
// Methods
// ============================================================================

function formatDateForInput(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

function parseDate(value) {
  if (!value) return null
  return new Date(value)
}

function applyTimePreset(days) {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)
  emit('update:startDate', start)
  emit('update:endDate', end)
}

function applySupportPreset(preset) {
  emit('update:supportStart', preset.start)
  emit('update:supportEnd', preset.end)
}

function formatNumber(val) {
  if (!Number.isFinite(val)) return '-'
  return val.toFixed(1)
}
</script>

<style scoped>
.pressure-control-panel {
  --panel-bg: #ffffff;
  --panel-border: #e2e8f0;
  --panel-text: #1e293b;
  --panel-text-secondary: #64748b;
  --panel-primary: #0f766e;
  --panel-primary-light: #ccfbf1;

  width: 220px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  font-family: 'Arial', 'Helvetica', sans-serif;
  font-size: 7pt;
  display: flex;
  flex-direction: column;
}

/* Header */
.panel-header {
  padding: 10px 12px;
  border-bottom: 1px solid var(--panel-border);
  background: #fafafa;
}

.panel-title {
  margin: 0;
  font-size: 9pt;
  font-weight: 600;
  color: var(--panel-text);
}

/* Control Sections */
.control-section {
  padding: 10px 12px;
  border-bottom: 1px solid var(--panel-border);
}

.control-section:last-child {
  border-bottom: none;
}

.section-label {
  display: block;
  font-size: 7pt;
  font-weight: 600;
  color: var(--panel-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

/* Button Group */
.button-group {
  display: flex;
  gap: 4px;
}

.option-btn {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid var(--panel-border);
  background: white;
  border-radius: 3px;
  font-size: 7pt;
  color: var(--panel-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.option-btn:hover {
  border-color: var(--panel-primary);
  color: var(--panel-primary);
}

.option-btn.active {
  background: var(--panel-primary);
  border-color: var(--panel-primary);
  color: white;
}

/* Date Inputs */
.date-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.date-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-label {
  font-size: 7pt;
  color: var(--panel-text-secondary);
  width: 30px;
}

.date-input {
  flex: 1;
  padding: 4px 6px;
  border: 1px solid var(--panel-border);
  border-radius: 3px;
  font-size: 7pt;
  font-family: inherit;
}

/* Quick Select */
.quick-select,
.support-presets {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 4px 8px;
  border: 1px solid var(--panel-border);
  background: white;
  border-radius: 3px;
  font-size: 7pt;
  color: var(--panel-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.preset-btn:hover {
  border-color: var(--panel-primary);
  color: var(--panel-primary);
}

.preset-btn.small {
  padding: 3px 6px;
}

.preset-btn.active {
  background: var(--panel-primary-light);
  border-color: var(--panel-primary);
  color: var(--panel-primary);
}

/* Threshold Controls */
.threshold-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.threshold-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.threshold-label {
  font-size: 7pt;
  color: var(--panel-text-secondary);
  width: 30px;
}

.threshold-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: var(--panel-border);
  border-radius: 2px;
  cursor: pointer;
}

.threshold-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: var(--panel-primary);
  border-radius: 50%;
  cursor: pointer;
}

.threshold-value {
  font-size: 7pt;
  color: var(--panel-text);
  width: 40px;
  text-align: right;
}

/* Support Range */
.support-range {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.range-input {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.range-label {
  font-size: 7pt;
  color: var(--panel-text-secondary);
}

.range-separator {
  color: var(--panel-text-secondary);
}

.number-input {
  width: 50px;
  padding: 4px 6px;
  border: 1px solid var(--panel-border);
  border-radius: 3px;
  font-size: 7pt;
  font-family: inherit;
  text-align: center;
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 12px;
  height: 12px;
  accent-color: var(--panel-primary);
}

.checkbox-label {
  font-size: 7pt;
  color: var(--panel-text);
}

/* Color Schemes */
.color-schemes {
  display: flex;
  gap: 6px;
}

.color-btn {
  width: 40px;
  height: 16px;
  border: 2px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.color-btn:hover {
  border-color: var(--panel-text-secondary);
}

.color-btn.active {
  border-color: var(--panel-primary);
}

/* Action Buttons */
.control-section.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 3px;
  font-size: 8pt;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn.primary {
  background: var(--panel-primary);
  color: white;
}

.action-btn.primary:hover {
  background: #0d5c56;
}

.action-btn.secondary {
  background: #f1f5f9;
  color: var(--panel-text-secondary);
  border: 1px solid var(--panel-border);
}

.action-btn.secondary:hover {
  background: #e2e8f0;
}

.btn-icon {
  font-size: 10px;
}

/* Stats */
.control-section.stats {
  background: #fafafa;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: white;
  border: 1px solid var(--panel-border);
  border-radius: 3px;
}

.stat-box.wide {
  grid-column: span 2;
}

.stat-box .stat-value {
  font-size: 10pt;
  font-weight: 600;
  color: var(--panel-text);
}

.stat-box .stat-label {
  font-size: 6pt;
  color: var(--panel-text-secondary);
  text-transform: uppercase;
}
</style>
