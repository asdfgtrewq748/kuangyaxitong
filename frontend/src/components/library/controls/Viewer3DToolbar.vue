<!--
  Viewer3DToolbar - 3D 查看器工具栏组件

  用于 3D 可视化的工具栏，包含常用交互工具

  特性：
  - 视角控制
  - 测量工具
  - 剖切工具
  - 标注工具
  - 快照功能
-->

<template>
  <div class="viewer-3d-toolbar" :class="{ vertical }">
    <!-- 视角控制 -->
    <div class="toolbar-group">
      <div class="group-title">视角</div>
      <div class="tool-buttons">
        <button
          class="tool-btn"
          :class="{ active: activeTool === 'rotate' }"
          @click="setTool('rotate')"
          title="旋转"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            <polyline points="21 3 21 9"/>
          </svg>
        </button>
        <button
          class="tool-btn"
          :class="{ active: activeTool === 'pan' }"
          @click="setTool('pan')"
          title="平移"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 9l-3 3 3 3M9 5l3 3-3 3M15 5l-3 3 3 3M19 9l3 3-3 3"/>
          </svg>
        </button>
        <button
          class="tool-btn"
          :class="{ active: activeTool === 'zoom' }"
          @click="setTool('zoom')"
          title="缩放"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
            <path d="M21 15v6"/>
            <path d="M15 3v6"/>
          </svg>
        </button>
      </div>
      <!-- 预设视角 -->
      <div class="preset-views">
        <button class="view-btn" @click="setPresetView('top')" title="俯视图">⊥</button>
        <button class="view-btn" @click="setPresetView('front')" title="前视图">⬆</button>
        <button class="view-btn" @click="setPresetView('side')" title="侧视图">➡</button>
        <button class="view-btn" @click="setPresetView('iso')" title="等轴视图">🧊</button>
      </div>
    </div>

    <!-- 测量工具 -->
    <div class="toolbar-group">
      <div class="group-title">测量</div>
      <div class="tool-buttons">
        <button
          class="tool-btn"
          :class="{ active: activeTool === 'distance' }"
          @click="setTool('distance')"
          title="距离测量"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3l18 18"/>
            <path d="M3 21l18-18"/>
            <circle cx="3" cy="3" r="2"/>
            <circle cx="21" cy="21" r="2"/>
          </svg>
        </button>
        <button
          class="tool-btn"
          :class="{ active: activeTool === 'area' }"
          @click="setTool('area')"
          title="面积测量"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h18v18H3z"/>
          </svg>
        </button>
        <button
          class="tool-btn"
          :class="{ active: activeTool === 'angle' }"
          @click="setTool('angle')"
          title="角度测量"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l10 10-4 4"/>
            <circle cx="12" cy="2" r="1.5"/>
            <circle cx="22" cy="12" r="1.5"/>
            <circle cx="18" cy="22" r="1.5"/>
          </svg>
        </button>
        <button
          v-if="hasMeasurement"
          class="tool-btn clear"
          @click="clearMeasurements"
          title="清除测量"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
      <!-- 测量结果显示 -->
      <div v-if="measurementResult" class="measurement-result">
        <span class="result-label">{{ measurementResult.label }}</span>
        <span class="result-value">{{ measurementResult.value }}</span>
      </div>
    </div>

    <!-- 剖切工具 -->
    <div class="toolbar-group">
      <div class="group-title">剖切</div>
      <div class="tool-buttons">
        <button
          class="tool-btn"
          :class="{ active: clippingMode === 'x' }"
          @click="toggleClipping('x')"
          title="X 轴剖切"
        >
          <span class="axis-label">X</span>
        </button>
        <button
          class="tool-btn"
          :class="{ active: clippingMode === 'y' }"
          @click="toggleClipping('y')"
          title="Y 轴剖切"
        >
          <span class="axis-label">Y</span>
        </button>
        <button
          class="tool-btn"
          :class="{ active: clippingMode === 'z' }"
          @click="toggleClipping('z')"
          title="Z 轴剖切"
        >
          <span class="axis-label">Z</span>
        </button>
      </div>
      <!-- 剖切滑块 -->
      <div v-if="clippingMode" class="clipping-controls">
        <input
          type="range"
          :min="0"
          :max="100"
          :value="clippingValue"
          @input="updateClipping"
          class="clipping-slider"
        />
        <div class="clipping-value">{{ clippingValue }}%</div>
      </div>
    </div>

    <!-- 标注工具 -->
    <div class="toolbar-group">
      <div class="group-title">标注</div>
      <div class="tool-buttons">
        <button
          class="tool-btn"
          :class="{ active: activeTool === 'text' }"
          @click="setTool('text')"
          title="文字标注"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 7V4h16v3M9 20h6"/>
            <line x1="12" y1="11" x2="12" y2="17"/>
          </svg>
        </button>
        <button
          class="tool-btn"
          :class="{ active: activeTool === 'marker' }"
          @click="setTool('marker')"
          title="标记点"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </button>
        <button
          class="tool-btn"
          :class="{ active: activeTool === 'arrow' }"
          @click="setTool('arrow')"
          title="箭头"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
        <button
          v-if="hasAnnotations"
          class="tool-btn clear"
          @click="clearAnnotations"
          title="清除标注"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 快照与导出 -->
    <div class="toolbar-group">
      <div class="group-title">导出</div>
      <div class="tool-buttons">
        <button
          class="tool-btn"
          @click="captureSnapshot"
          title="截屏"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
        <button
          class="tool-btn"
          @click="exportModel"
          title="导出模型"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
        <button
          class="tool-btn"
          @click="resetView"
          title="重置视图"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0 6.74 2.74L21 20"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  // 布局方向
  vertical: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'tool-change',
  'preset-view',
  'clipping-change',
  'snapshot',
  'export-model',
  'reset-view',
  'clear-measurements',
  'clear-annotations'
])

// 状态
const activeTool = ref(null)
const clippingMode = ref(null) // 'x' | 'y' | 'z' | null
const clippingValue = ref(50)
const hasMeasurement = ref(false)
const measurementResult = ref(null)
const hasAnnotations = ref(false)

// 设置工具
function setTool(tool) {
  if (activeTool.value === tool) {
    activeTool.value = null // 取消选择
  } else {
    activeTool.value = tool
  }
  emit('tool-change', activeTool.value)
}

// 设置预设视角
function setPresetView(view) {
  emit('preset-view', view)
}

// 切换剖切模式
function toggleClipping(axis) {
  if (clippingMode.value === axis) {
    clippingMode.value = null
  } else {
    clippingMode.value = axis
    clippingValue.value = 50
  }
  emit('clipping-change', {
    mode: clippingMode.value,
    value: clippingValue.value
  })
}

// 更新剖切位置
function updateClipping(event) {
  clippingValue.value = parseInt(event.target.value)
  emit('clipping-change', {
    mode: clippingMode.value,
    value: clippingValue.value
  })
}

// 截屏
function captureSnapshot() {
  emit('snapshot')
}

// 导出模型
function exportModel() {
  emit('export-model')
}

// 重置视图
function resetView() {
  emit('reset-view')
}

// 清除测量
function clearMeasurements() {
  hasMeasurement.value = false
  measurementResult.value = null
  emit('clear-measurements')
}

// 清除标注
function clearAnnotations() {
  hasAnnotations.value = false
  emit('clear-annotations')
}

// 暴露方法供父组件调用
function setMeasurementResult(result) {
  measurementResult.value = result
  hasMeasurement.value = true
}

function setHasAnnotations(value) {
  hasAnnotations.value = value
}

defineExpose({
  setMeasurementResult,
  setHasAnnotations,
  activeTool,
  clippingMode,
  clippingValue
})
</script>

<style scoped>
.viewer-3d-toolbar {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-4);
  padding: var(--spacing-3);
  background: var(--color-bg-card);
  border: 1px solid var(--border-color-light);
  border-radius: var(--radius-lg);
  overflow-x: auto;
}

.viewer-3d-toolbar.vertical {
  flex-direction: column;
}

.toolbar-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: 0 var(--spacing-3);
  border-right: 1px solid var(--border-color-light);
}

.viewer-3d-toolbar.vertical .toolbar-group {
  border-right: none;
  border-bottom: 1px solid var(--border-color-light);
  padding-bottom: var(--spacing-3);
}

.toolbar-group:last-child {
  border-right: none;
  padding-right: 0;
}

.viewer-3d-toolbar.vertical .toolbar-group:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.group-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tool-buttons {
  display: flex;
  gap: var(--spacing-1);
}

.viewer-3d-toolbar.vertical .tool-buttons {
  flex-wrap: wrap;
}

.preset-views {
  display: flex;
  gap: var(--spacing-1);
  padding-top: var(--spacing-2);
}

.tool-btn,
.view-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 var(--spacing-2);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tool-btn svg,
.view-btn svg {
  width: 16px;
  height: 16px;
}

.tool-btn:hover,
.view-btn:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.tool-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.tool-btn.clear {
  color: var(--color-error);
  border-color: var(--color-error-border);
}

.tool-btn.clear:hover {
  background: var(--color-error-bg);
}

.axis-label {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
}

.clipping-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding-top: var(--spacing-2);
}

.clipping-slider {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--border-color);
  outline: none;
  -webkit-appearance: none;
}

.clipping-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.clipping-value {
  font-size: var(--font-size-xs);
  font-family: var(--font-family-mono);
  color: var(--color-text-secondary);
  min-width: 32px;
  text-align: right;
}

.measurement-result {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-primary-light);
  border-radius: var(--radius-sm);
  margin-top: var(--spacing-2);
}

.result-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.result-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  font-family: var(--font-family-mono);
}

@media (max-width: 768px) {
  .viewer-3d-toolbar {
    flex-wrap: wrap;
  }

  .toolbar-group {
    border-right: none;
    border-bottom: 1px solid var(--border-color-light);
  }
}
</style>
