<template>
  <div class="research-panel">
    <div class="panel-header">
      <h3>
        <span class="icon">🔬</span>
        科研分析工具
      </h3>
      <div class="header-actions">
        <button 
          class="action-btn"
          :class="{ active: showColorBlindPreview }"
          @click="showColorBlindPreview = !showColorBlindPreview"
          title="色盲预览"
        >
          👁️
        </button>
        <button class="action-btn" @click="exportPublicationFigure" title="导出出版级图片">
          📷
        </button>
        <button class="action-btn" @click="collapsed = !collapsed">
          {{ collapsed ? '展开' : '收起' }}
        </button>
      </div>
    </div>
    
    <div v-show="!collapsed" class="panel-content">
      <!-- 色盲模拟预览 -->
      <div v-if="showColorBlindPreview" class="colorblind-preview">
        <h4>色盲友好性检查</h4>
        <div class="preview-types">
          <div class="preview-type">
            <div class="preview-label">正常视觉</div>
            <div class="preview-box normal" :style="{ background: previewGradient }"></div>
          </div>
          <div class="preview-type">
            <div class="preview-label">红色盲 (Protanopia)</div>
            <div class="preview-box" :style="{ background: protanopiaGradient }"></div>
          </div>
          <div class="preview-type">
            <div class="preview-label">绿色盲 (Deuteranopia)</div>
            <div class="preview-box" :style="{ background: deuteranopiaGradient }"></div>
          </div>
          <div class="preview-type">
            <div class="preview-label">蓝色盲 (Tritanopia)</div>
            <div class="preview-box" :style="{ background: tritanopiaGradient }"></div>
          </div>
        </div>
        <div class="preview-note">
          <span v-if="colorBlindSafe" class="safe-badge">✓ 色盲友好</span>
          <span v-else class="warning-badge">⚠ 建议调整配色</span>
        </div>
      </div>
      
      <!-- 配色方案选择 -->
      <section class="tool-section">
        <h4>配色方案</h4>
        <div class="palette-grid">
          <div 
            v-for="palette in palettes" 
            :key="palette.name"
            class="palette-card"
            :class="{ active: selectedPalette === palette }"
            @click="selectPalette(palette)"
          >
            <div class="palette-preview">
              <div 
                v-for="color in palette.colors.slice(0, 5)" 
                :key="color"
                class="palette-color"
                :style="{ background: rgbToHex(color) }"
              ></div>
            </div>
            <div class="palette-info">
              <div class="palette-name">{{ palette.name }}</div>
              <div class="palette-tags">
                <span v-if="palette.colorBlindSafe" class="tag safe">色盲友好</span>
                <span v-if="palette.printFriendly" class="tag print">打印友好</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 统计分析工具 -->
      <section class="tool-section">
        <h4>统计分析</h4>
        <div class="stat-tools">
          <button 
            v-for="tool in statTools" 
            :key="tool.id"
            class="stat-tool-btn"
            :class="{ active: activeTool === tool.id }"
            @click="activateTool(tool.id)"
          >
            <span class="tool-icon">{{ tool.icon }}</span>
            <span class="tool-name">{{ tool.name }}</span>
          </button>
        </div>
        
        <!-- 工具详情面板 -->
        <div v-if="activeTool" class="tool-detail">
          <div v-if="activeTool === 'ttest'" class="tool-content">
            <div class="form-group">
              <label>选择对比组:</label>
              <select v-model="ttestConfig.group1" class="form-select">
                <option v-for="g in dataGroups" :key="g.id" :value="g.id">{{ g.name }}</option>
              </select>
              <span>vs</span>
              <select v-model="ttestConfig.group2" class="form-select">
                <option v-for="g in dataGroups" :key="g.id" :value="g.id">{{ g.name }}</option>
              </select>
            </div>
            <button class="run-btn" @click="runTTest">执行t检验</button>
            <div v-if="ttestResult" class="result-panel">
              <div class="result-row">
                <span>t = {{ ttestResult.t.toFixed(4) }}</span>
                <span>df = {{ ttestResult.df }}</span>
              </div>
              <div class="result-row">
                <span :class="{ significant: ttestResult.significant }">
                  p = {{ ttestResult.pValue.toExponential(3) }}
                  {{ ttestResult.significant ? '***' : 'ns' }}
                </span>
              </div>
              <div class="result-row">
                <span>效应量 (Cohen's d) = {{ ttestResult.effectSize?.toFixed(3) || 'N/A' }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="activeTool === 'correlation'" class="tool-content">
            <div class="form-group">
              <label>变量 X:</label>
              <select v-model="corrConfig.varX" class="form-select">
                <option v-for="v in variables" :key="v.id" :value="v.id">{{ v.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>变量 Y:</label>
              <select v-model="corrConfig.varY" class="form-select">
                <option v-for="v in variables" :key="v.id" :value="v.id">{{ v.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>方法:</label>
              <select v-model="corrConfig.method" class="form-select">
                <option value="pearson">Pearson (参数)</option>
                <option value="spearman">Spearman (非参数)</option>
              </select>
            </div>
            <button class="run-btn" @click="runCorrelation">计算相关</button>
            <div v-if="corrResult" class="result-panel">
              <div class="result-row">
                <span>r = {{ corrResult.r.toFixed(4) }}</span>
                <span>r² = {{ corrResult.rSquared.toFixed(4) }}</span>
              </div>
              <div class="result-row">
                <span :class="{ significant: corrResult.significant }">
                  p = {{ corrResult.pValue.toExponential(3) }}
                  {{ corrResult.significant ? '***' : 'ns' }}
                </span>
              </div>
              <div class="result-row interpretation">
                {{ correlationInterpretation }}
              </div>
            </div>
          </div>
          
          <div v-if="activeTool === 'regression'" class="tool-content">
            <button class="run-btn" @click="runRegression">运行回归分析</button>
            <div v-if="regResult" class="result-panel">
              <div class="equation">
                <LatexFormula :formula="regResult.equation" display />
              </div>
              <div class="result-row">
                <span>R² = {{ regResult.rSquared.toFixed(4) }}</span>
                <span>RMSE = {{ regResult.rmse.toFixed(4) }}</span>
              </div>
              <div class="result-row">
                <span>斜率 CI: [{{ regResult.slopeCI[0].toFixed(4) }}, {{ regResult.slopeCI[1].toFixed(4) }}]</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 导出设置 -->
      <section class="tool-section">
        <h4>出版级导出设置</h4>
        <div class="export-settings">
          <div class="setting-row">
            <label>DPI:</label>
            <select v-model="exportSettings.dpi" class="form-select">
              <option :value="300">300 DPI (期刊标准)</option>
              <option :value="600">600 DPI (高质量)</option>
            </select>
          </div>
          <div class="setting-row">
            <label>格式:</label>
            <select v-model="exportSettings.format" class="form-select">
              <option value="svg">SVG (矢量)</option>
              <option value="png">PNG (栅格)</option>
              <option value="pdf">PDF (打印)</option>
            </select>
          </div>
          <div class="setting-row">
            <label>字体大小:</label>
            <select v-model="exportSettings.fontSize" class="form-select">
              <option :value="8">8pt (Nature标准)</option>
              <option :value="10">10pt</option>
              <option :value="12">12pt</option>
            </select>
          </div>
          <div class="setting-row">
            <label>颜色模式:</label>
            <select v-model="exportSettings.colorMode" class="form-select">
              <option value="rgb">RGB (屏幕)</option>
              <option value="cmyk">CMYK (印刷)</option>
              <option value="grayscale">灰度</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  viridis, plasma, grayscale, rdBu, brBG, 
  okabeIto, pressureHeatmap, stressField, tableau10 
} from '@/utils/scientificPalettes.js'
import { 
  twoSampleTTest, pearsonCorrelation, linearRegression 
} from '@/utils/statisticalAnalysis.js'
import LatexFormula from './LatexFormula.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['palette-change', 'export-request'])

// 状态
const collapsed = ref(false)
const showColorBlindPreview = ref(false)
const selectedPalette = ref(viridis)
const activeTool = ref(null)

// 配色方案
const palettes = [
  viridis,
  plasma,
  pressureHeatmap,
  stressField,
  rdBu,
  brBG,
  okabeIto,
  tableau10,
  grayscale
]

// 统计工具
const statTools = [
  { id: 'ttest', name: 't检验', icon: '🔍' },
  { id: 'correlation', name: '相关性', icon: '📊' },
  { id: 'regression', name: '回归', icon: '📈' }
]

// 示例数据组
const dataGroups = ref([
  { id: 'group1', name: '早期推进 (0-400m)', data: [] },
  { id: 'group2', name: '中期推进 (400-800m)', data: [] },
  { id: 'group3', name: '晚期推进 (800m+)', data: [] }
])

const variables = ref([
  { id: 'pressure', name: '支架压力' },
  { id: 'distance', name: '推进距离' },
  { id: 'time', name: '时间' }
])

// t检验配置
const ttestConfig = ref({
  group1: 'group1',
  group2: 'group2'
})
const ttestResult = ref(null)

// 相关配置
const corrConfig = ref({
  varX: 'distance',
  varY: 'pressure',
  method: 'pearson'
})
const corrResult = ref(null)

// 回归结果
const regResult = ref(null)

// 导出设置
const exportSettings = ref({
  dpi: 300,
  format: 'svg',
  fontSize: 8,
  colorMode: 'rgb'
})

// 计算属性
const colorBlindSafe = computed(() => selectedPalette.value.colorBlindSafe)

const previewGradient = computed(() => {
  const colors = selectedPalette.value.colors.slice(0, 5)
  return `linear-gradient(to right, ${colors.map(rgbToHex).join(', ')})`
})

const protanopiaGradient = computed(() => {
  const colors = selectedPalette.value.colors.slice(0, 5)
    .map(c => simulateColorBlind(c, 'protanopia'))
  return `linear-gradient(to right, ${colors.map(rgbToHex).join(', ')})`
})

const deuteranopiaGradient = computed(() => {
  const colors = selectedPalette.value.colors.slice(0, 5)
    .map(c => simulateColorBlind(c, 'deuteranopia'))
  return `linear-gradient(to right, ${colors.map(rgbToHex).join(', ')})`
})

const tritanopiaGradient = computed(() => {
  const colors = selectedPalette.value.colors.slice(0, 5)
    .map(c => simulateColorBlind(c, 'tritanopia'))
  return `linear-gradient(to right, ${colors.map(rgbToHex).join(', ')})`
})

const correlationInterpretation = computed(() => {
  if (!corrResult.value) return ''
  const r = Math.abs(corrResult.value.r)
  if (r < 0.1) return '无相关性'
  if (r < 0.3) return '弱相关'
  if (r < 0.5) return '中等相关'
  if (r < 0.7) return '较强相关'
  return '强相关'
})

// 方法
function selectPalette(palette) {
  selectedPalette.value = palette
  emit('palette-change', palette)
}

function activateTool(toolId) {
  activeTool.value = activeTool.value === toolId ? null : toolId
}

function runTTest() {
  // 模拟数据
  const group1 = Array.from({ length: 50 }, () => 25 + Math.random() * 10)
  const group2 = Array.from({ length: 50 }, () => 28 + Math.random() * 10)
  ttestResult.value = twoSampleTTest(group1, group2)
}

function runCorrelation() {
  // 模拟数据
  const x = Array.from({ length: 100 }, (_, i) => i)
  const y = x.map(xi => xi * 0.5 + Math.random() * 20)
  corrResult.value = pearsonCorrelation(x, y)
}

function runRegression() {
  const x = Array.from({ length: 100 }, (_, i) => i)
  const y = x.map(xi => 10 + xi * 0.5 + Math.random() * 5)
  regResult.value = linearRegression(x, y)
}

function exportPublicationFigure() {
  emit('export-request', {
    ...exportSettings.value,
    palette: selectedPalette.value
  })
}

// 辅助函数
function rgbToHex(rgb) {
  return '#' + rgb.map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

function simulateColorBlind(rgb, type) {
  const [r, g, b] = rgb
  const matrices = {
    deuteranopia: [[0.43, 0.72, -0.15], [0.34, 0.57, 0.09], [-0.02, 0.03, 1.00]],
    protanopia: [[0.57, 0.43, 0], [0.56, 0.44, 0], [0, 0.24, 0.76]],
    tritanopia: [[0.95, 0.05, 0], [0, 0.43, 0.57], [0, 0.48, 0.52]]
  }
  
  const m = matrices[type]
  const newR = m[0][0] * r + m[0][1] * g + m[0][2] * b
  const newG = m[1][0] * r + m[1][1] * g + m[1][2] * b
  const newB = m[2][0] * r + m[2][1] * g + m[2][2] * b
  
  return [
    Math.max(0, Math.min(255, Math.round(newR))),
    Math.max(0, Math.min(255, Math.round(newG))),
    Math.max(0, Math.min(255, Math.round(newB)))
  ]
}
</script>

<style scoped>
.research-panel {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 16px;
  max-height: 450px;
  overflow-y: auto;
}

.research-panel::-webkit-scrollbar {
  width: 4px;
}

.research-panel::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 2px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #e0e0e0;
}

.panel-header h3 {
  margin: 0;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f0f0f0;
}

.action-btn.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.panel-content {
  padding: 16px;
}

/* 色盲预览 */
.colorblind-preview {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
}

.colorblind-preview h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #444;
}

.preview-types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.preview-type {
  text-align: center;
}

.preview-label {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.preview-box {
  height: 30px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.preview-note {
  margin-top: 12px;
  text-align: center;
}

.safe-badge {
  color: #4caf50;
  font-size: 12px;
  font-weight: 500;
}

.warning-badge {
  color: #ff9800;
  font-size: 12px;
  font-weight: 500;
}

/* 工具区 */
.tool-section {
  margin-bottom: 20px;
}

.tool-section:last-child {
  margin-bottom: 0;
}

.tool-section h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #444;
  border-left: 3px solid #1976d2;
  padding-left: 10px;
}

/* 配色卡片 */
.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.palette-card {
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.palette-card:hover {
  border-color: #1976d2;
}

.palette-card.active {
  border-color: #1976d2;
  background: #e3f2fd;
}

.palette-preview {
  display: flex;
  height: 20px;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.palette-color {
  flex: 1;
}

.palette-name {
  font-size: 11px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.palette-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag {
  font-size: 9px;
  padding: 2px 5px;
  border-radius: 3px;
}

.tag.safe {
  background: #e8f5e9;
  color: #2e7d32;
}

.tag.print {
  background: #fff3e0;
  color: #ef6c00;
}

/* 统计工具 */
.stat-tools {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.stat-tool-btn:hover {
  background: #f5f5f5;
}

.stat-tool-btn.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.tool-icon {
  font-size: 14px;
}

.tool-name {
  font-size: 12px;
}

/* 工具详情 */
.tool-detail {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.form-group label {
  font-size: 12px;
  color: #666;
  min-width: 70px;
}

.form-select {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  min-width: 120px;
}

.run-btn {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  align-self: flex-start;
}

.run-btn:hover {
  background: #45a049;
}

.result-panel {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  font-size: 12px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.result-row:last-child {
  margin-bottom: 0;
}

.result-row.significant {
  color: #d32f2f;
  font-weight: 600;
}

.result-row.interpretation {
  color: #666;
  font-style: italic;
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px dashed #e0e0e0;
}

.equation {
  text-align: center;
  margin: 8px 0;
}

/* 导出设置 */
.export-settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.setting-row label {
  font-size: 12px;
  color: #666;
}
</style>
