<template>
  <div class="page mpi-algorithm-page">
    <div class="page-header">
      <div class="page-header-content">
        <div class="page-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <path d="M8 12h8"/>
            <path d="M12 8v8"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">MPI 矿压影响指标算法原理</h1>
          <p class="page-subtitle">从岩层参数到空间分布的可解释指数，3-5 分钟快速理解</p>
        </div>
      </div>
      <div class="header-actions">
        <div class="export-controls">
          <select v-model="exportScope" class="param-select export-select">
            <option value="sub">导出当前子图</option>
            <option value="all">导出全部图（批量）</option>
          </select>
          <select v-model="exportFormat" class="param-select export-select">
            <option value="svg">SVG</option>
            <option value="png">PNG</option>
          </select>
          <select v-model="exportVariant" class="param-select export-select">
            <option value="current">当前配色</option>
            <option value="both">彩色+黑白</option>
          </select>
          <label class="export-toggle">
            <input type="checkbox" v-model="exportAsZip" />
            打包ZIP
          </label>
          <button class="btn ghost" :disabled="exportBusy" @click="downloadFigure">
            {{ exportBusy ? '导出中...' : '开始导出' }}
          </button>
          <button class="btn ghost" :class="{ highlight: exportDone }" @click="openDownloads">打开下载记录</button>
        </div>
        <div v-if="exportStatus" class="export-status">{{ exportStatus }}</div>
        <div v-if="exportDone" class="export-done">导出完成，可查看下载记录。</div>
        <div v-if="exportError" class="export-error">{{ exportError }}</div>
        <div v-if="exportBusy" class="export-progress">
          <div class="export-progress-bar" :style="{ width: `${exportProgress}%` }"></div>
        </div>
      </div>
    </div>

    <section class="card overview-card">
      <div class="overview-text">
        <h2>一句话总览</h2>
        <p>
          MPI 将<strong>岩层参数</strong>转化为 RSI / BRI / ASI 三个子指标，
          通过权重融合得到综合指数，并映射为<strong>空间风险等级</strong>热力图。
        </p>
      </div>
      <div class="overview-badges">
        <span class="badge">可解释</span>
        <span class="badge">可追踪</span>
        <span class="badge">可验证</span>
      </div>
    </section>

    <section class="card flow-card">
      <div class="section-header flow-header">
        <div>
          <h2>总体流程图</h2>
          <p>悬停查看每一步数据含义与输出说明</p>
        </div>
        <div class="mode-tabs">
          <button :class="['mode-tab', { active: !useBwFigures }]" @click="useBwFigures = false">彩色</button>
          <button :class="['mode-tab', { active: useBwFigures }]" @click="useBwFigures = true">黑白</button>
        </div>
      </div>
      <div class="flow-figure">
        <img :src="useBwFigures ? '/mpi-algorithm/flow_overview_bw.svg' : '/mpi-algorithm/flow_overview.svg'" alt="MPI流程图" class="flow-image" loading="lazy" decoding="async" />
        <p class="figure-caption">图1 | MPI 计算流程示意</p>
      </div>
      <div class="flow-steps">
        <div
          v-for="(step, idx) in flowSteps"
          :key="step.key"
          class="flow-step"
          :class="{ active: activeStep === idx }"
          @mouseenter="activeStep = idx"
        >
          <div class="step-index">{{ idx + 1 }}</div>
          <div class="step-content">
            <h3>{{ step.title }}</h3>
            <p>{{ step.subtitle }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="card indicators-card">
      <div class="section-header">
        <h2>子指标模块</h2>
        <p>每个子指标都对应明确的输入参数与物理含义</p>
      </div>
      <div class="indicator-grid">
        <div class="indicator-card">
          <div class="indicator-head">
            <span class="indicator-tag">RSI</span>
            <h3>顶板稳定性</h3>
          </div>
          <ul>
            <li>输入：抗拉强度、关键层数量、岩层结构</li>
            <li>含义：描述顶板破坏敏感性</li>
          </ul>
          <div class="figure-block">
            <img :src="useBwFigures ? '/mpi-algorithm/rsi_stability_bw.svg' : '/mpi-algorithm/rsi_stability.svg'" alt="RSI顶板稳定性示意" loading="lazy" decoding="async" />
            <span>图2 | 顶板稳定性构成</span>
          </div>
          <div class="formula">
            <div class="formula-title">计算公式</div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.main"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.norm"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.key"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.rsi.struct"></div>
          </div>
          <div class="indicator-visual">
            <div class="visual-bar">
              <span>稳定性 ↑</span>
              <div class="bar-track"><div class="bar-fill" style="width:72%"></div></div>
            </div>
          </div>
        </div>

        <div class="indicator-card">
          <div class="indicator-head">
            <span class="indicator-tag">BRI</span>
            <h3>冲击地压风险</h3>
          </div>
          <ul>
            <li>输入：采深、硬厚岩层、煤层厚度</li>
            <li>含义：描述深度与硬层带来的能量积累</li>
          </ul>
          <div class="figure-block">
            <img :src="useBwFigures ? '/mpi-algorithm/bri_depth_curve_bw.svg' : '/mpi-algorithm/bri_depth_curve.svg'" alt="BRI采深影响曲线" loading="lazy" decoding="async" />
            <span>图3 | 采深影响曲线</span>
          </div>

          <!-- 深度交互滑块 -->
          <div class="interactive-control">
            <div class="control-header">
              <span class="control-label">采深模拟</span>
              <span class="control-value" :class="briRiskClass">{{ briSimDepth }}m ({{ briSimLabel }})</span>
            </div>
            <input
              type="range"
              min="0"
              max="1200"
              step="10"
              v-model.number="briSimDepth"
              class="depth-slider"
            />
            <div class="depth-labels">
              <span>0m</span>
              <span>400m</span>
              <span>800m</span>
              <span>1200m</span>
            </div>
            <div class="bri-sim-result">
              <div class="bri-value-bar">
                <div class="bri-bar-track">
                  <div class="bri-bar-fill" :style="{ width: briSimValue + '%', background: briBarColor }"></div>
                </div>
                <span class="bri-value">BRI = {{ briSimValue.toFixed(1) }}</span>
              </div>
            </div>
          </div>

          <div class="formula">
            <div class="formula-title">计算公式</div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.bri.main"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.bri.depth"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.bri.hard"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.bri.thick"></div>
          </div>
          <div class="indicator-visual">
            <div class="visual-line">
              <span>深度 ↑ 风险 ↑</span>
              <div class="line-track"></div>
            </div>
          </div>
        </div>

        <div class="indicator-card">
          <div class="indicator-head">
            <span class="indicator-tag">ASI</span>
            <h3>支承压力分布</h3>
          </div>
          <ul>
            <li>输入：综合刚度、内摩擦角</li>
            <li>含义：描述应力传递与集中程度</li>
          </ul>
          <div class="figure-block">
            <img :src="useBwFigures ? '/mpi-algorithm/asi_stress_profile_bw.svg' : '/mpi-algorithm/asi_stress_profile.svg'" alt="ASI应力传递示意" loading="lazy" decoding="async" />
            <span>图4 | 应力传递剖面</span>
          </div>
          <div class="formula">
            <div class="formula-title">计算公式</div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.asi.main"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.asi.stiff"></div>
            <div class="formula-body formula-katex" v-html="renderedFormulas.asi.fric"></div>
          </div>
          <!-- ASI应力传递动画 -->
          <div class="asi-animation-container">
            <div class="asi-label">应力传递模拟</div>
            <div class="stress-bars">
              <div
                v-for="(bar, idx) in stressBars"
                :key="idx"
                class="stress-bar"
                :style="{
                  height: bar.height + '%',
                  background: bar.color,
                  animationDelay: bar.delay + 's'
                }"
              ></div>
            </div>
            <div class="stress-labels">
              <span>采空区</span>
              <span>煤壁</span>
              <span>前方</span>
            </div>
            <div class="peak-indicator" :style="{ left: peakPosition + '%' }">
              <div class="peak-arrow">↑</div>
              <div class="peak-label">峰值</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="card weight-card">
      <div class="section-header">
        <h2>权重解释区</h2>
        <p>拖动滑块模拟权重变化对 MPI 的影响</p>
      </div>
      <div class="weight-grid">
        <div class="weight-controls">
          <div class="weight-item" v-for="item in weightItems" :key="item.key">
            <div class="weight-label">
              <span>{{ item.label }}</span>
              <span class="weight-value">{{ (normalizedWeights[item.key] * 100).toFixed(1) }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="weights[item.key]"
            />
            <div class="weight-hint">默认：{{ item.default }}</div>
          </div>
        </div>
        <div class="weight-preview">
          <div class="stack-bar">
            <div class="stack-segment rsi" :style="{ width: normalizedWeights.rsi * 100 + '%' }"></div>
            <div class="stack-segment bri" :style="{ width: normalizedWeights.bri * 100 + '%' }"></div>
            <div class="stack-segment asi" :style="{ width: normalizedWeights.asi * 100 + '%' }"></div>
          </div>
          <div class="stack-legend">
            <span><i class="dot rsi"></i>RSI</span>
            <span><i class="dot bri"></i>BRI</span>
            <span><i class="dot asi"></i>ASI</span>
          </div>
          <div class="weight-note">
            默认权重来源于专家经验与历史样本拟合，可在后续版本中开放自定义策略。
          </div>
          <!-- MPI融合公式 -->
          <div class="formula formula-inline">
            <div class="formula-title">MPI融合公式</div>
            <div class="formula-body formula-katex" v-html="renderInlineFormula(formulas.mpi)"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="card risk-card">
      <div class="section-header">
        <h2>风险等级与决策解释</h2>
        <p>MPI 值越高表示稳定性越好，风险越低</p>
      </div>
      <div class="risk-grid">
        <div class="risk-level">
          <span class="level high">高风险</span>
          <p>MPI &lt; 50，建议加强支护与监测</p>
        </div>
        <div class="risk-level">
          <span class="level medium">中风险</span>
          <p>50 ≤ MPI &lt; 70，建议适度优化施工参数</p>
        </div>
        <div class="risk-level">
          <span class="level low">低风险</span>
          <p>MPI ≥ 70，施工条件相对稳定</p>
        </div>
      </div>
    </section>

    <section class="card example-card">
      <div class="section-header">
        <h2>示例演算</h2>
        <p>选择真实样点做可追踪演算，增强可信度</p>
      </div>
      <div class="example-grid">
        <div class="example-table">
          <div class="sample-selector">
            <button
              v-for="item in samplePoints"
              :key="item.id"
              :class="['sample-btn', { active: activeSampleId === item.id }]"
              @click="activeSampleId = item.id"
            >
              {{ item.name }}
            </button>
          </div>
          <div class="table-row header">
            <span>参数</span>
            <span>示例值</span>
          </div>
          <div class="table-row" v-for="row in sampleRows" :key="row.label">
            <span>{{ row.label }}</span>
            <span>{{ row.value }}</span>
          </div>
        </div>
        <div class="example-result">
          <div class="result-title">综合 MPI</div>
          <div class="result-value">{{ sampleResult.mpi.toFixed(2) }}</div>
          <div class="result-level" :class="sampleRisk.class">{{ sampleRisk.label }}</div>
          <div class="result-breakdown">
            <span>RSI: {{ sampleResult.breakdown.rsi.toFixed(2) }}</span>
            <span>BRI: {{ sampleResult.breakdown.bri.toFixed(2) }}</span>
            <span>ASI: {{ sampleResult.breakdown.asi.toFixed(2) }}</span>
          </div>
          <div class="result-desc">基于 MPI 设计文档公式的实时演算</div>
        </div>
      </div>
    </section>

    <section class="card output-card">
      <div class="section-header">
        <h2>图像生成逻辑</h2>
        <p>说明 MPI 网格与可视化映射流程</p>
      </div>

      <div class="output-steps">
        <div class="output-step" v-for="item in outputSteps" :key="item.title">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
      <div class="output-note">
        颜色映射采用 ODI 色带标准，支持 SVG + PNG 高分辨率输出。
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
// Lazy load KaTeX - only loads formulas when component is mounted
let katex = null
let jsZipCtor = null
const { markStepDone } = useWorkspaceFlow()

const getJSZipCtor = async () => {
  if (jsZipCtor) return jsZipCtor
  const mod = await import('jszip')
  jsZipCtor = mod?.default || mod?.JSZip || window.JSZip || null
  if (!jsZipCtor) throw new Error('JSZip 加载失败')
  return jsZipCtor
}

// KaTeX渲染函数 - handles lazy loaded KaTeX
const renderFormula = (formula) => {
  if (!katex) return formula // Return plain text if KaTeX not loaded yet
  try {
    return katex.renderToString(formula, {
      throwOnError: false,
      displayMode: true,
      output: 'html',
      strict: false
    })
  } catch (e) {
    console.error('KaTeX render error:', e)
    return formula
  }
}

// 定义公式的LaTeX表达式
const formulas = {
  rsi: {
    main: '\\text{RSI} = \\min(\\text{RSI}_{\\text{norm}} + \\text{RSI}_{\\text{key}} + \\text{RSI}_{\\text{struct}}, 0, 100)',
    norm: '\\text{RSI}_{\\text{norm}} = \\min\\left(\\frac{\\bar{\\sigma_t}}{10}, 1\\right) \\times 40',
    key: '\\text{RSI}_{\\text{key}} = \\min(n_{\\text{key}} \\times 15, 30)',
    struct: '\\text{RSI}_{\\text{struct}} = (1 - r_{\\text{soft}}) \\times 40'
  },
  bri: {
    main: '\\text{BRI} = \\max(100 - P_{\\text{depth}} - P_{\\text{hard}} - P_{\\text{thick}}, 0)',
    depth: 'P_{\\text{depth}} = \\min\\left(\\frac{H - H_{\\text{crit}}}{200}, 1\\right) \\times 40',
    hard: 'P_{\\text{hard}} = \\min\\left(\\frac{E_{\\text{hard}}}{500}, 1\\right) \\times 30',
    thick: 'P_{\\text{thick}} = \\min\\left(\\frac{h_{\\text{coal}}}{10}, 1\\right) \\times 30'
  },
  asi: {
    main: '\\text{ASI} = S_{\\text{stiff}} + S_{\\text{fric}}',
    stiff: 'S_{\\text{stiff}} = \\min\\left(\\frac{\\bar{E}}{35} \\times 50, 50\\right)',
    fric: 'S_{\\text{fric}} = \\max\\left(\\frac{\\bar{\\varphi} - 20}{25} \\times 50, 0\\right)'
  },
  mpi: '\\text{MPI} = w_r \\cdot \\text{RSI} + w_b \\cdot \\text{BRI} + w_a \\cdot \\text{ASI}'
}

// 渲染后的公式HTML
const renderedFormulas = reactive({
  rsi: { main: '', norm: '', key: '', struct: '' },
  bri: { main: '', depth: '', hard: '', thick: '' },
  asi: { main: '', stiff: '', fric: '' }
})

onMounted(async () => {
  markStepDone('MpiAlgorithm')
  // Lazy load KaTeX only when this component mounts
  try {
    const katexModule = await import('katex')
    katex = katexModule.default || katexModule
    await import('katex/dist/katex.min.css')

    // 渲染RSI公式
    renderedFormulas.rsi.main = renderFormula(formulas.rsi.main)
    renderedFormulas.rsi.norm = renderFormula(formulas.rsi.norm)
    renderedFormulas.rsi.key = renderFormula(formulas.rsi.key)
    renderedFormulas.rsi.struct = renderFormula(formulas.rsi.struct)

    // 渲染BRI公式
    renderedFormulas.bri.main = renderFormula(formulas.bri.main)
    renderedFormulas.bri.depth = renderFormula(formulas.bri.depth)
    renderedFormulas.bri.hard = renderFormula(formulas.bri.hard)
    renderedFormulas.bri.thick = renderFormula(formulas.bri.thick)

    // 渲染ASI公式
    renderedFormulas.asi.main = renderFormula(formulas.asi.main)
    renderedFormulas.asi.stiff = renderFormula(formulas.asi.stiff)
    renderedFormulas.asi.fric = renderFormula(formulas.asi.fric)
  } catch (e) {
    console.error('Failed to load KaTeX:', e)
    // Fallback to plain text formulas
    Object.keys(formulas).forEach(key => {
      if (typeof formulas[key] === 'string') {
        // Single formula
      } else if (typeof formulas[key] === 'object') {
        // Multiple formulas
        Object.keys(formulas[key]).forEach(subKey => {
          renderedFormulas[key][subKey] = formulas[key][subKey]
        })
      }
    })
  }
})

// 内联渲染函数 (用于单行公式)
const renderInlineFormula = (formula) => {
  if (!katex) return formula
  try {
    return katex.renderToString(formula, {
      throwOnError: false,
      displayMode: false,
      output: 'html',
      strict: false
    })
  } catch (e) {
    console.error('KaTeX render error:', e)
    return formula
  }
}

const flowSteps = [
  {
    key: 'input',
    title: '数据输入',
    subtitle: '岩层参数 / 地质信息',
    detailTitle: '输入数据来源',
    detail: '包括钻孔岩性、煤层厚度、抗拉强度、采深等，所有参数可追踪到原始表格。'
  },
  {
    key: 'sub',
    title: '子指标计算',
    subtitle: 'RSI / BRI / ASI',
    detailTitle: '子指标输出',
    detail: '分别描述顶板稳定性、冲击风险与支承压力分布，便于解释与诊断。'
  },
  {
    key: 'fusion',
    title: '权重融合',
    subtitle: '默认 0.4 / 0.35 / 0.25',
    detailTitle: '权重融合逻辑',
    detail: '通过权重加权得到综合 MPI，可根据矿区经验进行微调并记录。'
  },
  {
    key: 'risk',
    title: '风险等级',
    subtitle: '低 / 中 / 高',
    detailTitle: '风险映射',
    detail: '将 MPI 数值划分为风险等级，支撑施工决策与预警。'
  },
  {
    key: 'output',
    title: '图像输出',
    subtitle: '热力图 / 等值线',
    detailTitle: '可视化输出',
    detail: '生成高分辨率热力图与等值线，支持报告级导出。'
  }
]

const activeStep = ref(0)

const useBwFigures = ref(false)
const exportScope = ref('sub')
const exportFormat = ref('svg')
const exportVariant = ref('current')
const exportAsZip = ref(false)
const exportBusy = ref(false)
const exportProgress = ref(0)
const exportStatus = ref('')
const exportError = ref('')
const exportDone = ref(false)

const weights = reactive({
  rsi: 0.4,
  bri: 0.35,
  asi: 0.25
})

// BRI深度模拟
const briSimDepth = ref(600)
const briSimValue = computed(() => {
  const depth = briSimDepth.value
  const criticalDepth = 400
  const depthPenalty = depth > criticalDepth
    ? Math.min((depth - criticalDepth) / 200, 1) * 40
    : 0
  // 假设中等硬层和煤层厚度
  const hardPenalty = 15
  const thicknessPenalty = 15
  return Math.min(Math.max(100 - depthPenalty - hardPenalty - thicknessPenalty, 0), 100)
})
const briRiskClass = computed(() => {
  const v = briSimValue.value
  if (v >= 70) return 'low'
  if (v >= 50) return 'medium'
  return 'high'
})
const briSimLabel = computed(() => {
  const v = briSimValue.value
  if (v >= 70) return '低风险'
  if (v >= 50) return '中风险'
  return '高风险'
})
const briBarColor = computed(() => {
  const v = briSimValue.value
  if (v >= 70) return 'linear-gradient(90deg, #22c55e, #16a34a)'
  if (v >= 50) return 'linear-gradient(90deg, #f59e0b, #d97706)'
  return 'linear-gradient(90deg, #ef4444, #dc2626)'
})

// ASI应力动画
const stressBars = computed(() => {
  // 模拟支承压力分布曲线：采空区低 -> 煤壁峰值 -> 前方衰减
  const bars = []
  for (let i = 0; i < 20; i++) {
    const x = i / 19 // 0 到 1
    // 应力分布函数：左低 -> 中峰 -> 右衰减
    let stress
    if (x < 0.4) {
      // 采空区：较低应力
      stress = 30 + Math.random() * 10
    } else if (x < 0.6) {
      // 煤壁附近：应力集中峰值
      const peak = 1 - Math.abs(x - 0.5) / 0.1
      stress = 30 + peak * 60 + Math.random() * 5
    } else {
      // 前方：衰减至原岩应力
      const decay = Math.exp(-(x - 0.6) * 3)
      stress = 30 + decay * 30 + Math.random() * 10
    }
    bars.push({
      height: Math.min(Math.max(stress, 10), 95),
      color: stress > 70 ? 'linear-gradient(180deg, #ef4444, #dc2626)' :
             stress > 50 ? 'linear-gradient(180deg, #f59e0b, #d97706)' :
             'linear-gradient(180deg, #22c55e, #16a34a)',
      delay: i * 0.05
    })
  }
  return bars
})

const peakPosition = computed(() => 50) // 峰值在煤壁位置

const weightItems = [
  { key: 'rsi', label: 'RSI 权重', default: '0.40' },
  { key: 'bri', label: 'BRI 权重', default: '0.35' },
  { key: 'asi', label: 'ASI 权重', default: '0.25' }
]

const weightSum = computed(() => weights.rsi + weights.bri + weights.asi)
const normalizedWeights = computed(() => {
  const sum = weightSum.value || 1
  return {
    rsi: weights.rsi / sum,
    bri: weights.bri / sum,
    asi: weights.asi / sum
  }
})

const samplePoints = [
  {
    id: 'a',
    name: '样例点 A（汇总表浅埋）',
    point: { burial_depth: 86.0, thickness: 6.0 },
    strata: [
      { name: '岩层1', thickness: 6.0, tensile_strength: 2.3, compressive_strength: 20.51, elastic_modulus: 3.0, friction_angle: 28.0 },
      { name: '岩层2', thickness: 1.5, tensile_strength: 1.2, compressive_strength: 14.32, elastic_modulus: 9.8, friction_angle: 17.5 },
      { name: '岩层3', thickness: 8.0, tensile_strength: 4.5, compressive_strength: 26.93, elastic_modulus: 17.0, friction_angle: 22.3 },
      { name: '岩层4', thickness: 12.5, tensile_strength: 10.5, compressive_strength: 35.36, elastic_modulus: 28.0, friction_angle: 20.0 },
      { name: '岩层5', thickness: 7.0, tensile_strength: 3.6, compressive_strength: 33.93, elastic_modulus: 25.0, friction_angle: 28.0 }
    ]
  },
  {
    id: 'b',
    name: '样例点 B（汇总表深埋）',
    point: { burial_depth: 967.7, thickness: 5.9 },
    strata: [
      { name: '岩层1', thickness: 5.9, tensile_strength: 2.4, compressive_strength: 27.0, elastic_modulus: 0.5, friction_angle: 42.6 },
      { name: '岩层2', thickness: 1.5, tensile_strength: 4.7, compressive_strength: 38.3, elastic_modulus: 10.8, friction_angle: 36.0 },
      { name: '岩层3', thickness: 15.7, tensile_strength: 3.1, compressive_strength: 32.8, elastic_modulus: 9.3, friction_angle: 38.8 },
      { name: '岩层4', thickness: 20.0, tensile_strength: 2.1, compressive_strength: 27.0, elastic_modulus: 8.34, friction_angle: 37.8 },
      { name: '岩层5', thickness: 46.0, tensile_strength: 3.1, compressive_strength: 27.0, elastic_modulus: 9.3, friction_angle: 38.8 }
    ]
  }
]

const activeSampleId = ref(samplePoints[0].id)

const activeSample = computed(() => samplePoints.find(item => item.id === activeSampleId.value) || samplePoints[0])

const identifyKeyLayers = (strata) => {
  const referenceModulus = 35
  return strata.filter(layer =>
    layer.compressive_strength > 60 &&
    layer.thickness > 5 &&
    layer.elastic_modulus / referenceModulus > 0.8
  )
}

const calcRsi = (strata) => {
  const immediate = strata.slice(0, 2)
  const totalImmediate = immediate.reduce((sum, layer) => sum + layer.thickness, 0)
  const rsiImmediate = totalImmediate > 0
    ? immediate.reduce((sum, layer) => sum + layer.thickness * layer.tensile_strength, 0) / totalImmediate
    : 0

  const keyLayers = identifyKeyLayers(strata)
  const rsiKey = Math.min(keyLayers.length * 15, 30)

  const totalStrata = strata.reduce((sum, layer) => sum + layer.thickness, 0)
  const softRatio = totalStrata > 0
    ? strata.filter(layer => layer.compressive_strength < 30).reduce((sum, layer) => sum + layer.thickness, 0) / totalStrata
    : 0
  const rsiStructure = (1 - softRatio) * 40

  const rsiNorm = Math.min(rsiImmediate / 10, 1) * 40
  return Math.min(Math.max(rsiNorm + rsiKey + rsiStructure, 0), 100)
}

const calcBri = (point, strata) => {
  const depth = point.burial_depth || 0
  const coalThickness = point.thickness || 0
  const criticalDepth = 400
  const depthPenalty = depth > criticalDepth
    ? Math.min((depth - criticalDepth) / 200, 1) * 40
    : 0

  const hardEnergy = strata
    .filter(layer => layer.compressive_strength > 60)
    .reduce((sum, layer) => sum + layer.thickness * layer.elastic_modulus, 0)
  const hardPenalty = Math.min(hardEnergy / 500, 1) * 30
  const thicknessPenalty = Math.min(coalThickness / 10, 1) * 30
  return Math.min(Math.max(100 - depthPenalty - hardPenalty - thicknessPenalty, 0), 100)
}

const calcAsi = (strata) => {
  const total = strata.reduce((sum, layer) => sum + layer.thickness, 0)
  if (total === 0) return 50

  const avgStiffness = strata.reduce((sum, layer) => sum + layer.elastic_modulus * layer.thickness, 0) / total
  const stiffnessScore = Math.min(avgStiffness / 35 * 50, 50)

  const avgFriction = strata.reduce((sum, layer) => sum + layer.friction_angle * layer.thickness, 0) / total
  const frictionScore = Math.max(Math.min((avgFriction - 20) / 25 * 50, 50), 0)

  return Math.min(Math.max(stiffnessScore + frictionScore, 0), 100)
}

const sampleResult = computed(() => {
  const { point, strata } = activeSample.value
  const rsi = calcRsi(strata)
  const bri = calcBri(point, strata)
  const asi = calcAsi(strata)
  const mpi = (
    normalizedWeights.value.rsi * rsi +
    normalizedWeights.value.bri * bri +
    normalizedWeights.value.asi * asi
  )
  return {
    mpi,
    breakdown: { rsi, bri, asi }
  }
})

const sampleRisk = computed(() => {
  const value = sampleResult.value.mpi
  if (value >= 70) {
    return { label: '低风险', class: 'low' }
  }
  if (value >= 50) {
    return { label: '中风险', class: 'medium' }
  }
  return { label: '高风险', class: 'high' }
})

const sampleRows = computed(() => [
  { label: '埋深 (m)', value: activeSample.value.point.burial_depth.toFixed(1) },
  { label: '煤层厚度 (m)', value: activeSample.value.point.thickness.toFixed(1) },
  { label: '关键层数量', value: identifyKeyLayers(activeSample.value.strata).length },
  { label: 'RSI', value: sampleResult.value.breakdown.rsi.toFixed(2) },
  { label: 'BRI', value: sampleResult.value.breakdown.bri.toFixed(2) },
  { label: 'ASI', value: sampleResult.value.breakdown.asi.toFixed(2) },
  { label: '权重 (RSI/BRI/ASI)', value: `${normalizedWeights.value.rsi.toFixed(2)} / ${normalizedWeights.value.bri.toFixed(2)} / ${normalizedWeights.value.asi.toFixed(2)}` },
  { label: 'MPI', value: sampleResult.value.mpi.toFixed(2) }
])

const outputSteps = [
  { title: '1. 网格化', desc: '将采集点转换为规则网格，保障空间分辨率一致。' },
  { title: '2. 插值', desc: '采用 IDW/Linear/Nearest 等方法填补空缺区域。' },
  { title: '3. 颜色映射', desc: '按照风险等级与 ODI 色带映射颜色。' },
  { title: '4. 叠加标注', desc: '叠加等值线、坐标轴与关键点注记。' }
]

const downloadFiles = (files) => {
  files.forEach((fileName, idx) => {
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = `/mpi-algorithm/${fileName}`
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, idx * 200)
  })
}

const buildFileList = (variant) => {
  const format = exportFormat.value
  const isBw = variant === 'bw'
  const suffix = isBw ? '_bw' : ''

  if (exportScope.value === 'sub') {
    return [
      `flow_overview${suffix}.${format}`,
      `rsi_stability${suffix}.${format}`,
      `bri_depth_curve${suffix}.${format}`,
      `asi_stress_profile${suffix}.${format}`,
      `mpi_colorbar${suffix}.${format}`
    ]
  }

  return [
    `flow_overview${suffix}.${format}`,
    `rsi_stability${suffix}.${format}`,
    `bri_depth_curve${suffix}.${format}`,
    `asi_stress_profile${suffix}.${format}`,
    `mpi_colorbar${suffix}.${format}`
  ]
}

const buildZipName = () => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  return `kuangyaxitong-mpi-${exportScope.value}-${exportFormat.value}-${date}.zip`
}

const downloadZip = async (files) => {
  const JSZip = await getJSZipCtor()
  const zip = new JSZip()
  const folder = zip.folder('mpi-figures')
  let completed = 0

  for (const fileName of files) {
    const res = await fetch(`/mpi-algorithm/${fileName}`)
    const blob = await res.blob()
    folder.file(fileName, blob)
    completed += 1
    exportProgress.value = Math.round((completed / files.length) * 80)
    exportStatus.value = `正在打包：${completed}/${files.length}`
  }

  exportStatus.value = '正在生成ZIP...'
  const zipBlob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    exportProgress.value = 80 + Math.round(metadata.percent * 0.2)
  })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(zipBlob)
  link.download = buildZipName()
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

const downloadFigure = async () => {
  exportBusy.value = true
  exportProgress.value = 0
  exportStatus.value = '准备导出...'
  exportError.value = ''
  exportDone.value = false
  try {
    const variants = exportVariant.value === 'both'
      ? ['color', 'bw']
      : [useBwFigures.value ? 'bw' : 'color']

    const files = variants.flatMap(variant => buildFileList(variant))

    if (exportAsZip.value) {
      await downloadZip(files)
    } else {
      exportStatus.value = `准备下载 ${files.length} 个文件...`
      downloadFiles(files)
      exportProgress.value = 100
    }
    exportStatus.value = '导出完成'
    exportDone.value = true
  } catch (error) {
    exportStatus.value = '导出失败'
    exportError.value = `错误原因：${error?.message || '未知错误'}`
  } finally {
    setTimeout(() => {
      exportBusy.value = false
      exportStatus.value = ''
      exportError.value = ''
      exportProgress.value = 0
      exportDone.value = false
    }, 1200)
  }
}

const openDownloads = () => {
  const targets = ['chrome://downloads/', 'edge://downloads/all', 'about:downloads']
  let opened = false
  for (const url of targets) {
    const win = window.open(url, '_blank')
    if (win) {
      opened = true
      break
    }
  }
  if (!opened) {
    exportStatus.value = '浏览器限制打开下载页，可用快捷键 Ctrl+J 查看下载记录。'
  }
}
</script>

<style scoped>
/* Page Container - Optimized max-width and spacing */
.mpi-algorithm-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 1400px;
  margin: 0 auto;
  line-height: 1.75;
}

/* Page Header - Improved proportions and spacing - Academic Light Style */
.page-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 28px;
  background: var(--bg-primary);
  padding: 28px 32px;
  border-radius: var(--border-radius-lg);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.page-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.page-header-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.page-header-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  background: var(--gradient-primary);
  flex-shrink: 0;
  color: white;
}

.page-header-icon svg {
  width: 26px;
  height: 26px;
  color: #fff;
}

.page-title {
  margin: 0 0 6px 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Header Actions - Optimized width and spacing */
.header-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 300px;
}

.export-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  background: var(--bg-primary);
  padding: 12px;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.export-controls .export-select:nth-child(1),
.export-controls .export-select:nth-child(2) {
  grid-column: span 1;
}

.export-controls .export-select:nth-child(3) {
  grid-column: span 2;
}

.export-status {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: right;
}

.export-done {
  font-size: 12px;
  color: var(--color-success);
  text-align: right;
}

.export-error {
  font-size: 12px;
  color: var(--color-error);
  text-align: right;
}

.export-progress {
  width: 100%;
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 999px;
  overflow: hidden;
}

.export-progress-bar {
  height: 100%;
  background: var(--color-primary);
  width: 0;
  transition: width 0.2s ease;
}

.export-select {
  width: 100%;
  height: 40px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-select:hover {
  border-color: var(--color-secondary);
  background: var(--bg-elevated);
}

.export-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(90, 99, 120, 0.1);
}

.export-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  height: 40px;
  padding: 0 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-toggle:hover {
  border-color: var(--color-secondary);
  background: var(--bg-tertiary);
}

.export-toggle input {
  accent-color: #6366f1;
  width: 16px;
  height: 16px;
}

/* Ghost Button Style */
.btn.ghost {
  background: rgba(255, 255, 255, 0.95);
  color: #6366f1;
  border: 2px solid rgba(99, 102, 241, 0.3);
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 700;
}

.btn.ghost:hover:not(:disabled) {
  background: #6366f1;
  color: #fff;
  border-color: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.export-toggle input {
  accent-color: #6366f1;
}

.btn.highlight {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.7);
  animation: pulseGlow 1.2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.6);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.9);
  }
  100% {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.6);
  }
}

@media (max-width: 1100px) {
  .page-header {
    grid-template-columns: 1fr;
  }

  .header-actions {
    justify-self: stretch;
  }
}

/* Card Improvements - Visual Hierarchy - Academic Light */
.overview-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 32px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.overview-text h2 {
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.overview-text p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.75;
}

.overview-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.badge {
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--bg-secondary);
  color: var(--color-primary);
  font-weight: 500;
  font-size: 13px;
  border: 1px solid var(--border-color);
}

/* Section Headers - Better Typography */
.section-header {
  margin-bottom: 20px;
}

.flow-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.section-header h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.section-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

/* Flow Steps - Redesigned for better visual appeal */
.flow-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 24px 0;
  justify-content: center;
}

.flow-figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  width: 100%;
}

.flow-figure img {
  width: 100%;
  max-width: 1100px;
  height: auto;
  object-fit: contain;
  border-radius: 16px;
  background: #fff;
  padding: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: var(--shadow-md);
}

.figure-caption {
  font-size: 12px;
  color: #64748b;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  position: relative;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  min-width: calc(20% - 10px);
  flex: 1;
  max-width: calc(20% - 10px);
}

.flow-step.active {
  background: var(--gradient-primary);
  border-color: transparent;
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.flow-step.active .step-content h3,
.flow-step.active .step-content p {
  color: #ffffff;
}

.step-index {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.step-content h3 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
}

.step-content p {
  margin: 0;
  color: var(--text-tertiary);
  font-size: 12px;
  line-height: 1.4;
}

/* Indicator Cards - Optimized spacing */
.indicator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.indicator-card {
  padding: 20px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.indicator-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.indicator-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.indicator-tag {
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
  font-size: 13px;
  border: 1px solid var(--border-color);
}

.indicator-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.indicator-card ul {
  margin: 0 0 16px 20px;
  padding: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

.figure-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.figure-block img {
  width: 100%;
  height: auto;
  max-height: 350px;
  object-fit: contain;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  padding: 8px;
}

.figure-block span {
  font-size: 11px;
  color: #64748b;
}

/* Formula - Better Readability - Academic */
.formula {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  padding: 16px 18px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
}

.formula-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.formula-body {
  font-family: "Times New Roman", "Cambria Math", serif;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.8;
  padding-left: 12px;
  border-left: 3px solid var(--color-primary);
}

/* KaTeX公式样式 - 学术风格 */
.formula-katex {
  font-size: 15px;
  line-height: 2;
  padding: 16px 20px;
  margin: 8px 0;
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.formula-inline {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
}

.formula-inline .formula-title {
  margin-bottom: var(--spacing-sm);
}

.formula-inline .formula-body {
  padding: 0;
  border-left: none;
  font-size: 16px;
}

.formula-inline .formula-katex {
  padding: 12px 16px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
}

.formula-katex :deep(.katex) {
  color: var(--text-primary);
}

.formula-katex :deep(.katex .mord) {
  color: var(--text-primary);
}

.formula-katex :deep(.katex .mrel) {
  color: var(--color-primary);
}

.formula-katex :deep(.katex .mbin) {
  color: var(--color-primary);
}

.formula-katex :deep(.katex .mop) {
  color: var(--text-secondary);
}

.formula-katex :deep(.katex .minner) {
  color: var(--text-secondary);
}

.formula-katex :deep(.katex .vlist-t) {
  color: var(--text-primary);
}

/* 流程图样式优化 */
.flow-figure {
  background: var(--bg-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.flow-image {
  width: 100%;
  max-width: 1100px;
  height: auto;
  border-radius: var(--border-radius-sm);
}

.indicator-visual {
  display: flex;
  align-items: center;
  gap: 12px;
}

.visual-bar span,
.visual-line span {
  font-size: 12px;
  color: var(--text-tertiary);
}

.bar-track {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: var(--border-color);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--gradient-success);
}

.line-track {
  flex: 1;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: 999px;
}

/* Weight Controls - Better Spacing - Academic */
.weight-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.weight-item {
  margin-bottom: 20px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
}

.weight-label {
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--text-primary);
}

.weight-value {
  color: var(--color-primary);
  font-weight: 600;
}

.weight-hint {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 6px;
}

.weight-controls input[type='range'] {
  width: 100%;
}

.stack-bar {
  display: flex;
  height: 16px;
  border-radius: 999px;
  overflow: hidden;
  background: #e2e8f0;
  margin-bottom: 12px;
}

.stack-segment.rsi {
  background: #6366f1;
}

.stack-segment.bri {
  background: #8b5cf6;
}

.stack-segment.asi {
  background: #22c55e;
}

.stack-legend {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.dot.rsi { background: #6366f1; }
.dot.bri { background: #7a7cb0; }
.dot.asi { background: #5b8c6e; }

/* BRI深度交互控件 */
.interactive-control {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  padding: 16px;
  margin: 16px 0;
  border: 1px solid var(--border-color);
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.control-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.control-value {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
}

.control-value.low {
  background: var(--color-success-light);
  color: var(--color-success);
}

.control-value.medium {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.control-value.high {
  background: var(--color-error-light);
  color: var(--color-error);
}

.depth-slider {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #22c55e 0%, #22c55e 33%, #f59e0b 33%, #f59e0b 66%, #ef4444 66%, #ef4444 100%);
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.depth-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--color-primary);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.depth-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.depth-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--color-primary);
  box-shadow: var(--shadow-md);
  cursor: pointer;
}

.depth-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: 6px;
  margin-bottom: 12px;
}

.bri-sim-result {
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.bri-value-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bri-bar-track {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: var(--bg-tertiary);
  overflow: hidden;
}

.bri-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease, background 0.3s ease;
}

.bri-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 80px;
  text-align: right;
}

.weight-note {
  margin-top: 12px;
  font-size: 12px;
  color: var(--text-tertiary);
}

/* ASI应力传递动画 */
.asi-animation-container {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  padding: 16px;
  margin: 16px 0;
  border: 1px solid var(--border-color);
  position: relative;
}

.asi-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.stress-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 80px;
  padding: 0 40px;
  position: relative;
}

.stress-bar {
  flex: 1;
  border-radius: 2px 2px 0 0;
  min-width: 4px;
  transition: height 0.5s ease;
  animation: stressPulse 2s ease-in-out infinite;
}

@keyframes stressPulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

.stress-labels {
  display: flex;
  justify-content: space-between;
  padding: 8px 40px 0;
  font-size: 11px;
  color: var(--text-tertiary);
}

.peak-indicator {
  position: absolute;
  top: 16px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: left 0.5s ease;
}

.peak-arrow {
  font-size: 16px;
  color: var(--color-error);
  font-weight: bold;
  animation: arrowBounce 1s ease-in-out infinite;
}

@keyframes arrowBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.peak-label {
  font-size: 10px;
  color: var(--color-error);
  font-weight: 600;
  background: rgba(239, 68, 68, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 2px;
}

/* Risk Levels - Optimized proportions - Academic */
.risk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.risk-level {
  padding: 20px;
  border-radius: var(--border-radius-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  transition: all 0.25s ease;
}

.risk-level:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
  border-color: var(--color-primary);
}

.risk-level p {
  margin: 12px 0 0 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.level {
  display: inline-flex;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.level.high {
  background: var(--color-error-light);
  color: var(--color-error);
  border: 1px solid var(--border-color);
}

.level.medium {
  background: var(--color-warning-light);
  color: var(--color-warning);
  border: 1px solid var(--border-color);
}

.level.low {
  background: var(--color-success-light);
  color: var(--color-success);
  border: 1px solid var(--border-color);
}

/* Example Section - Better Layout - Academic */
.example-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
}

.sample-selector {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.sample-btn {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.sample-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.sample-btn.active {
  background: var(--gradient-primary);
  color: #fff;
  border-color: transparent;
  box-shadow: var(--shadow-sm);
}

.example-table {
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
  font-size: 14px;
  color: var(--text-primary);
}

.table-row.header {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-row:last-child {
  border-bottom: none;
}

.example-result {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-md);
  padding: 24px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.result-breakdown {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  font-size: 13px;
  color: var(--text-secondary);
  width: 100%;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
}

.result-title {
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-value {
  font-size: 36px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.result-level {
  padding: 8px 20px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.result-level.low {
  background: var(--color-success-light);
  color: var(--color-success);
  border: 1px solid var(--border-color);
}

.result-level.medium {
  background: var(--color-warning-light);
  color: var(--color-warning);
  border: 1px solid var(--border-color);
}

.result-level.high {
  background: var(--color-error-light);
  color: var(--color-error);
  border: 1px solid var(--border-color);
}

/* Output Steps - Optimized spacing - Academic */
.output-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.output-step {
  padding: 20px;
  border-radius: var(--border-radius-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  transition: all 0.25s ease;
}

.output-step:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
  border-color: var(--color-primary);
}

.output-step h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.output-step p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.output-note {
  margin-top: 20px;
  padding: 16px;
  font-size: 14px;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border-left: 4px solid var(--color-primary);
  line-height: 1.75;
}

/* Responsive Design - Professional Breakpoints */
@media (max-width: 1100px) {
  .page-header {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .header-actions {
    min-width: 100%;
  }

  .export-controls {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .mpi-algorithm-page {
    gap: 24px;
    padding: 0;
  }

  .page-header {
    padding: 24px;
  }

  .page-title {
    font-size: 24px;
  }

  .overview-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
  }

  .overview-badges {
    width: 100%;
  }

  .weight-grid,
  .example-grid,
  .indicator-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .flow-steps {
    grid-template-columns: 1fr;
  }

  .export-controls {
    grid-template-columns: 1fr;
  }

  .export-controls .export-select:nth-child(3) {
    grid-column: span 1;
  }
}

@media (max-width: 600px) {
  .mpi-algorithm-page {
    gap: 20px;
  }

  .page-header {
    padding: 20px;
    border-radius: 16px;
  }

  .page-header-content {
    flex-direction: column;
    gap: 12px;
  }

  .page-header-icon {
    width: 48px;
    height: 48px;
  }

  .page-header-icon svg {
    width: 24px;
    height: 24px;
  }

  .page-title {
    font-size: 22px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .export-controls {
    padding: 12px;
    gap: 8px;
  }

  .section-header h2 {
    font-size: 20px;
  }

  .overview-text h2 {
    font-size: 18px;
  }

  .indicator-card {
    padding: 20px;
  }

  .risk-grid {
    grid-template-columns: 1fr;
  }
}

/* Print Styles */
@media print {
  .mpi-algorithm-page {
    max-width: 100%;
  }

  .header-actions,
  .export-controls {
    display: none;
  }

  .card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #e2e8f0;
  }

  .flow-figure img,
  .figure-block img {
    max-width: 100%;
    page-break-inside: avoid;
  }
}
</style>
