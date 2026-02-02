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
        <img src="/mpi-algorithm/flow_overview.svg" alt="MPI流程图" />
        <p class="figure-caption">图1 | MPI 计算流程（高分辨率示意）</p>
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
            <img :src="useBwFigures ? '/mpi-algorithm/rsi_stability_bw.svg' : '/mpi-algorithm/rsi_stability.svg'" alt="RSI顶板稳定性示意" />
            <span>图2 | 顶板稳定性构成</span>
          </div>
          <div class="formula">
            <div class="formula-title">计算公式</div>
            <div class="formula-body">
              RSI = clamp( RSI_norm + RSI_key + RSI_structure, 0, 100 )
            </div>
            <div class="formula-body">
              RSI_norm = min( avg(σt) / 10, 1 ) × 40
            </div>
            <div class="formula-body">
              RSI_key = min( n_key × 15, 30 )
            </div>
            <div class="formula-body">
              RSI_structure = (1 - soft_ratio) × 40
            </div>
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
            <img :src="useBwFigures ? '/mpi-algorithm/bri_depth_curve_bw.svg' : '/mpi-algorithm/bri_depth_curve.svg'" alt="BRI采深影响曲线" />
            <span>图3 | 采深影响曲线</span>
          </div>
          <div class="formula">
            <div class="formula-title">计算公式</div>
            <div class="formula-body">
              BRI = clamp( 100 - depth_penalty - hard_penalty - thickness_penalty, 0, 100 )
            </div>
            <div class="formula-body">
              depth_penalty = min( (depth - critical) / 200, 1 ) × 40
            </div>
            <div class="formula-body">
              hard_penalty = min( hard_energy / 500, 1 ) × 30
            </div>
            <div class="formula-body">
              thickness_penalty = min( thickness / 10, 1 ) × 30
            </div>
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
            <img :src="useBwFigures ? '/mpi-algorithm/asi_stress_profile_bw.svg' : '/mpi-algorithm/asi_stress_profile.svg'" alt="ASI应力传递示意" />
            <span>图4 | 应力传递剖面</span>
          </div>
          <div class="formula">
            <div class="formula-title">计算公式</div>
            <div class="formula-body">
              ASI = clamp( stiffness_score + friction_score, 0, 100 )
            </div>
            <div class="formula-body">
              stiffness_score = min( avg_stiffness / 35 × 50, 50 )
            </div>
            <div class="formula-body">
              friction_score = clamp( (avg_friction - 20) / 25 × 50, 0, 50 )
            </div>
          </div>
          <div class="indicator-visual">
            <div class="visual-wave"></div>
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
import { computed, reactive, ref } from 'vue'
import JSZip from 'jszip'

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

/* Page Header - Improved proportions and spacing */
.page-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 28px;
  background: var(--gradient-header);
  padding: 28px 32px;
  border-radius: var(--border-radius-xl);
  color: #fff;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
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
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.page-header-icon svg {
  width: 26px;
  height: 26px;
  color: #fff;
}

.page-title {
  margin: 0 0 6px 0;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
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
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.2);
  backdrop-filter: blur(10px);
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
  color: rgba(255, 255, 255, 0.9);
  text-align: right;
}

.export-done {
  font-size: 12px;
  color: #bbf7d0;
  text-align: right;
}

.export-error {
  font-size: 12px;
  color: #fecaca;
  text-align: right;
}

.export-progress {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  overflow: hidden;
}

.export-progress-bar {
  height: 100%;
  background: #ffffff;
  width: 0;
  transition: width 0.2s ease;
}

.export-select {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  background: #fff;
  color: #0f172a;
  font-size: 13px;
  font-weight: 600;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-select:hover {
  border-color: #cbd5e1;
  background: #fafbff;
}

.export-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.export-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  height: 40px;
  padding: 0 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-toggle:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
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

/* Card Improvements - Visual Hierarchy */
.overview-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 32px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 2px solid rgba(99, 102, 241, 0.15);
}

.overview-text h2 {
  margin: 0 0 10px 0;
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
}

.overview-text p {
  margin: 0;
  color: #475569;
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
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%);
  color: #4f46e5;
  font-weight: 600;
  font-size: 13px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  backdrop-filter: blur(5px);
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
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.01em;
}

.section-header p {
  margin: 0;
  color: #64748b;
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
  border-radius: 16px;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
  cursor: pointer;
  min-width: calc(20% - 10px);
  flex: 1;
  max-width: calc(20% - 10px);
}

.flow-step.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
}

.flow-step.active .step-content h3,
.flow-step.active .step-content p {
  color: #ffffff;
}

.step-index {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
  flex-shrink: 0;
}

.step-content h3 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
}

.step-content p {
  margin: 0;
  color: #64748b;
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
  border-radius: 14px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  background: linear-gradient(145deg, #ffffff 0%, #fafbff 100%);
  box-shadow: var(--shadow-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.indicator-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(99, 102, 241, 0.3);
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
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%);
  color: #2563eb;
  font-weight: 700;
  font-size: 13px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.indicator-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.indicator-card ul {
  margin: 0 0 16px 20px;
  padding: 0;
  color: #475569;
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

/* Formula - Better Readability */
.formula {
  background: linear-gradient(135deg, #fafbff 0%, #f8fafc 100%);
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.formula-title {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.formula-body {
  font-family: "Times New Roman", "Cambria Math", serif;
  color: #0f172a;
  font-size: 14px;
  line-height: 1.8;
  padding-left: 12px;
  border-left: 3px solid rgba(99, 102, 241, 0.3);
}

.indicator-visual {
  display: flex;
  align-items: center;
  gap: 12px;
}

.visual-bar span,
.visual-line span {
  font-size: 12px;
  color: #64748b;
}

.bar-track {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--gradient-success);
}

.line-track {
  flex: 1;
  height: 4px;
  background: linear-gradient(90deg, #cbd5f5 0%, #6366f1 100%);
  border-radius: 999px;
}

.visual-wave {
  width: 100%;
  height: 40px;
  background: radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 60%),
    radial-gradient(circle at 60% 40%, rgba(16, 185, 129, 0.2) 0%, transparent 70%),
    radial-gradient(circle at 90% 60%, rgba(59, 130, 246, 0.2) 0%, transparent 60%);
  border-radius: 12px;
}

/* Weight Controls - Better Spacing */
.weight-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.weight-item {
  margin-bottom: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #fafbff 0%, #f8fafc 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.weight-label {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 14px;
}

.weight-value {
  color: #6366f1;
  font-weight: 700;
}

.weight-hint {
  font-size: 12px;
  color: #94a3b8;
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
  color: #64748b;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.dot.rsi { background: #6366f1; }
.dot.bri { background: #8b5cf6; }
.dot.asi { background: #22c55e; }

.weight-note {
  margin-top: 12px;
  font-size: 12px;
  color: #64748b;
}

/* Risk Levels - Optimized proportions */
.risk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.risk-level {
  padding: 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, #fafbff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.risk-level:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.risk-level p {
  margin: 12px 0 0 0;
  font-size: 14px;
  color: #475569;
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
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.level.medium {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
  border: 1px solid #fbbf24;
}

.level.low {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
  border: 1px solid #4ade80;
}

/* Example Section - Better Layout */
.example-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
}

.sample-selector {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 2px solid #e2e8f0;
}

.sample-btn {
  padding: 8px 16px;
  border-radius: 999px;
  border: 2px solid #cbd5f5;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sample-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.sample-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.example-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
  font-size: 14px;
}

.table-row.header {
  background: linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%);
  font-weight: 700;
  color: #334155;
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
  background: linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #e0e7ff;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.08);
}

.result-breakdown {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  font-size: 13px;
  color: #475569;
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
}

.result-title {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-value {
  font-size: 36px;
  font-weight: 800;
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
  font-weight: 700;
  letter-spacing: 0.02em;
}

.result-level.low {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
  border: 1px solid #4ade80;
}

.result-level.medium {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
  border: 1px solid #fbbf24;
}

.result-level.high {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  border: 1px solid #fca5a5;
}

/* Output Steps - Optimized spacing */
.output-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.output-step {
  padding: 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, #fafbff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.output-step:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: rgba(99, 102, 241, 0.3);
}

.output-step h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.output-step p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
}

.output-note {
  margin-top: 20px;
  padding: 16px;
  font-size: 14px;
  color: #475569;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.03) 100%);
  border-radius: 12px;
  border-left: 4px solid #6366f1;
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
