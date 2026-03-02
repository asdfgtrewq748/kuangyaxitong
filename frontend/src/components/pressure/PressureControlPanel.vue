<template>
  <div class="pressure-control-panel">
    <!-- 面板标题 -->
    <div class="panel-header">
      <div class="header-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m4.24-13.24l-4.24 4.24m0 5.66l4.24 4.24M1 12h6m6 0h6"/>
        </svg>
      </div>
      <h3 class="panel-title">控制面板</h3>
    </div>

    <div class="panel-body">
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
            <div class="slider-container">
              <input
                type="range"
                min="0"
                max="30"
                :value="lowThreshold"
                @input="$emit('update:lowThreshold', parseFloat($event.target.value))"
                class="threshold-slider"
              />
              <div class="slider-track"></div>
            </div>
            <span class="threshold-value">{{ lowThreshold }}</span>
          </div>
          <div class="threshold-item">
            <span class="threshold-label">上限</span>
            <div class="slider-container">
              <input
                type="range"
                min="30"
                max="60"
                :value="highThreshold"
                @input="$emit('update:highThreshold', parseFloat($event.target.value))"
                class="threshold-slider"
              />
            </div>
            <span class="threshold-value">{{ highThreshold }}</span>
          </div>
        </div>
      </div>

      <!-- 支架选择 -->
      <div class="control-section">
        <label class="section-label">支架范围</label>
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
            :key="preset.label"
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
        <div class="toggle-group">
          <label class="toggle-item">
            <input
              type="checkbox"
              :checked="showGrid"
              @change="$emit('update:showGrid', $event.target.checked)"
            />
            <span class="toggle-switch"></span>
            <span class="toggle-label">显示网格</span>
          </label>
          <label class="toggle-item">
            <input
              type="checkbox"
              :checked="showContours"
              @change="$emit('update:showContours', $event.target.checked)"
            />
            <span class="toggle-switch"></span>
            <span class="toggle-label">显示等值线</span>
          </label>
          <label class="toggle-item">
            <input
              type="checkbox"
              :checked="showAnomalies"
              @change="$emit('update:showAnomalies', $event.target.checked)"
            />
            <span class="toggle-switch"></span>
            <span class="toggle-label">高亮异常值</span>
          </label>
          <label class="toggle-item">
            <input
              type="checkbox"
              :checked="showPeaks"
              @change="$emit('update:showPeaks', $event.target.checked)"
            />
            <span class="toggle-switch"></span>
            <span class="toggle-label">标记峰值</span>
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
            :title="scheme.label"
            @click="$emit('update:colorScheme', scheme.value)"
          >
            <span class="color-preview" :style="{ background: scheme.gradient }"></span>
            <span class="color-label">{{ scheme.label }}</span>
          </button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="control-section actions">
        <button class="action-btn primary" @click="$emit('apply')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          应用更改
        </button>
        <button class="action-btn secondary" @click="$emit('reset')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          重置
        </button>
      </div>

      <!-- 当前统计 -->
      <Transition name="stats-fade">
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
              <span class="stat-value">{{ formatInt(stats.n) }}</span>
              <span class="stat-label">样本数</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  columnType: { type: String, default: 'all' },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  lowThreshold: { type: Number, default: 10 },
  highThreshold: { type: Number, default: 45 },
  supportStart: { type: Number, default: 1 },
  supportEnd: { type: Number, default: 125 },
  showGrid: { type: Boolean, default: false },
  showContours: { type: Boolean, default: false },
  showAnomalies: { type: Boolean, default: false },
  showPeaks: { type: Boolean, default: false },
  colorScheme: { type: String, default: 'diverging' },
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

function formatInt(val) {
  if (!Number.isFinite(val)) return '-'
  return val.toLocaleString()
}
</script>

<style scoped>
.pressure-control-panel {
  --transition: cubic-bezier(0.4, 0, 0.2, 1);
  --radius: 6px;

  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  font-size: 12px;
}

/* Header */
.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--color-primary, #1a1a1a);
  color: var(--text-inverted, #ffffff);
}

.header-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius);
}

.header-icon svg {
  width: 18px;
  height: 18px;
}

.panel-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

/* Control Sections */
.control-section {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color-light, #f0f0f0);
}

.control-section:last-child {
  border-bottom: none;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary, #737373);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Button Group */
.button-group {
  display: flex;
  gap: 6px;
}

.option-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-color, #e5e5e5);
  background: var(--bg-primary, #ffffff);
  border-radius: var(--radius);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary, #525252);
  cursor: pointer;
  transition: all 0.2s var(--transition);
}

.option-btn:hover {
  border-color: var(--color-primary, #1a1a1a);
  color: var(--color-primary, #1a1a1a);
}

.option-btn.active {
  background: var(--color-primary, #1a1a1a);
  border-color: var(--color-primary, #1a1a1a);
  color: var(--text-inverted, #ffffff);
}

/* Date Inputs */
.date-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}

.date-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-label {
  width: 32px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-tertiary, #737373);
}

.date-input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid var(--border-color, #e5e5e5);
  border-radius: var(--radius);
  font-size: 12px;
  font-family: inherit;
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #171717);
  transition: all 0.2s var(--transition);
}

.date-input:hover {
  border-color: var(--color-gray-400, #a3a3a3);
}

.date-input:focus {
  outline: none;
  border-color: var(--color-primary, #1a1a1a);
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
}

/* Quick Select & Presets */
.quick-select,
.support-presets {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 6px 10px;
  border: 1px solid var(--border-color, #e5e5e5);
  background: var(--bg-primary, #ffffff);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-tertiary, #737373);
  cursor: pointer;
  transition: all 0.2s var(--transition);
}

.preset-btn:hover {
  border-color: var(--color-primary, #1a1a1a);
  color: var(--color-primary, #1a1a1a);
  background: var(--bg-secondary, #fafafa);
}

.preset-btn.small {
  padding: 5px 8px;
  font-size: 10px;
}

.preset-btn.active {
  background: var(--color-primary, #1a1a1a);
  border-color: var(--color-primary, #1a1a1a);
  color: var(--text-inverted, #ffffff);
}

/* Threshold Controls */
.threshold-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.threshold-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.threshold-label {
  width: 32px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-tertiary, #737373);
}

.slider-container {
  flex: 1;
  position: relative;
}

.threshold-slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--border-color, #e5e5e5);
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.2s;
}

.threshold-slider:hover {
  background: var(--color-gray-400, #a3a3a3);
}

.threshold-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-primary, #1a1a1a);
  border-radius: 50%;
  cursor: grab;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.threshold-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.threshold-slider::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.threshold-value {
  width: 36px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary, #171717);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* Support Range */
.support-range {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.range-input {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.range-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-tertiary, #737373);
}

.range-separator {
  color: var(--text-muted, #a3a3a3);
}

.number-input {
  width: 56px;
  padding: 8px 10px;
  border: 1px solid var(--border-color, #e5e5e5);
  border-radius: var(--radius);
  font-size: 12px;
  font-family: inherit;
  text-align: center;
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #171717);
  font-variant-numeric: tabular-nums;
  transition: all 0.2s var(--transition);
}

.number-input:hover {
  border-color: var(--color-gray-400, #a3a3a3);
}

.number-input:focus {
  outline: none;
  border-color: var(--color-primary, #1a1a1a);
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
}

/* Toggle Group */
.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toggle-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 0;
}

.toggle-item input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch {
  position: relative;
  width: 36px;
  height: 20px;
  background: var(--border-color, #e5e5e5);
  border-radius: 10px;
  transition: background 0.2s var(--transition);
  flex-shrink: 0;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: var(--bg-primary, #ffffff);
  border-radius: 50%;
  transition: transform 0.2s var(--transition);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.toggle-item input:checked + .toggle-switch {
  background: var(--color-primary, #1a1a1a);
}

.toggle-item input:checked + .toggle-switch::after {
  transform: translateX(16px);
}

.toggle-item:hover .toggle-switch {
  background: var(--color-gray-400, #a3a3a3);
}

.toggle-item input:checked:hover + .toggle-switch {
  background: var(--color-primary-hover, #333333);
}

.toggle-label {
  font-size: 12px;
  color: var(--text-primary, #171717);
}

/* Color Schemes */
.color-schemes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.color-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border: 2px solid var(--border-color-light, #f0f0f0);
  border-radius: var(--radius);
  background: var(--bg-primary, #ffffff);
  cursor: pointer;
  transition: all 0.2s var(--transition);
}

.color-btn:hover {
  border-color: var(--border-color, #e5e5e5);
}

.color-btn.active {
  border-color: var(--color-primary, #1a1a1a);
  background: var(--bg-secondary, #fafafa);
}

.color-preview {
  width: 100%;
  height: 12px;
  border-radius: 2px;
}

.color-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-tertiary, #737373);
}

.color-btn.active .color-label {
  color: var(--color-primary, #1a1a1a);
}

/* Action Buttons */
.control-section.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--bg-secondary, #fafafa);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s var(--transition);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.primary {
  background: var(--color-primary, #1a1a1a);
  color: var(--text-inverted, #ffffff);
}

.action-btn.primary:hover {
  background: var(--color-primary-hover, #333333);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn.primary:active {
  transform: translateY(0);
}

.action-btn.secondary {
  background: var(--bg-primary, #ffffff);
  color: var(--text-secondary, #525252);
  border: 1px solid var(--border-color, #e5e5e5);
}

.action-btn.secondary:hover {
  background: var(--bg-tertiary, #f5f5f5);
  border-color: var(--border-color-dark, #d4d4d4);
}

/* Stats */
.control-section.stats {
  background: linear-gradient(135deg, var(--bg-secondary, #fafafa) 0%, var(--bg-tertiary, #f5f5f5) 100%);
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
  padding: 12px 8px;
  background: var(--bg-primary, #ffffff);
  border: 1px solid var(--border-color-light, #f0f0f0);
  border-radius: var(--radius);
  transition: all 0.2s var(--transition);
}

.stat-box:hover {
  border-color: var(--border-color, #e5e5e5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-box.wide {
  grid-column: span 2;
}

.stat-box .stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary, #171717);
  font-variant-numeric: tabular-nums;
}

.stat-box .stat-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-tertiary, #737373);
  margin-top: 2px;
}

/* Stats Fade Animation */
.stats-fade-enter-active,
.stats-fade-leave-active {
  transition: all 0.3s var(--transition);
}

.stats-fade-enter-from,
.stats-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
