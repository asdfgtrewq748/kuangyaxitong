<template>
  <div class="research-page page">
    <header class="hero card">
      <div>
        <h1>科研工作台</h1>
        <p>面向论文复现：数据版本化、泄漏审计、实验运行、结果归档一体化。</p>
      </div>
      <div class="hero-status">
        <span class="status-pill info">Dataset {{ manifest?.dataset_id || '-' }}</span>
        <span class="status-pill" :class="splitManifest ? 'ok' : 'idle'">Split {{ splitManifest?.split_id || '-' }}</span>
        <span class="status-pill" :class="displayResult ? 'ok' : 'idle'">Experiment {{ displayResult?.exp_id || '-' }}</span>
      </div>
    </header>

    <section class="grid grid-2">
      <article class="card panel">
        <div class="panel-head">
          <h2>1) 数据集注册</h2>
          <span class="tip">固定标签口径与版本哈希</span>
        </div>
        <div class="form-grid">
          <label>
            <span>dataset_id</span>
            <input v-model.trim="registerForm.dataset_id" class="input" placeholder="例如 research_demo" />
          </label>
          <label>
            <span>label_column</span>
            <input v-model.trim="registerForm.label_column" class="input" placeholder="例如 label" />
          </label>
          <label>
            <span>positive_values (逗号分隔)</span>
            <input v-model.trim="registerForm.positive_values" class="input" placeholder="例如 1,true,high" />
          </label>
          <label>
            <span>event_definition</span>
            <input v-model.trim="registerForm.event_definition" class="input" />
          </label>
          <label>
            <span>time_window_hours</span>
            <input v-model.number="registerForm.time_window_hours" type="number" min="1" class="input" />
          </label>
          <label>
            <span>threshold (可选)</span>
            <input v-model.trim="registerForm.threshold" class="input" placeholder="留空表示 null" />
          </label>
          <label class="full">
            <span>description</span>
            <textarea v-model.trim="registerForm.description" class="input textarea" rows="3" placeholder="数据来源、标签定义、时间空间对齐说明"></textarea>
          </label>
        </div>
        <div class="actions">
          <button class="btn" :disabled="busy.register || !registerForm.dataset_id || !registerForm.label_column" @click="registerDataset">
            {{ busy.register ? '注册中...' : '注册数据集' }}
          </button>
        </div>
      </article>

      <article class="card panel">
        <div class="panel-head">
          <h2>2) 数据集查询与切分</h2>
          <span class="tip">防止时间/钻孔泄漏</span>
        </div>
        <div class="lookup-row">
          <input v-model.trim="datasetQueryId" class="input" placeholder="输入 dataset_id 查询 manifest" />
          <button class="btn secondary" :disabled="busy.loadDataset || !datasetQueryId" @click="loadDataset">
            {{ busy.loadDataset ? '查询中...' : '查询' }}
          </button>
        </div>

        <div v-if="manifest" class="manifest-meta">
          <span class="meta-item">version: <b>{{ manifest.dataset_version }}</b></span>
          <span class="meta-item">rows: <b>{{ manifest.row_count }}</b></span>
          <span class="meta-item">cols: <b>{{ manifest.column_count }}</b></span>
          <span class="meta-item">file: <b>{{ manifest.dataset_file }}</b></span>
        </div>

        <div class="form-grid">
          <label>
            <span>strategy</span>
            <select v-model="splitForm.strategy">
              <option value="time_borehole_block">time_borehole_block</option>
              <option value="borehole_block">borehole_block</option>
              <option value="time_block">time_block</option>
              <option value="random">random</option>
            </select>
          </label>
          <label>
            <span>train_ratio</span>
            <input v-model.number="splitForm.train_ratio" type="number" step="0.05" min="0.05" max="0.95" class="input" />
          </label>
          <label>
            <span>val_ratio</span>
            <input v-model.number="splitForm.val_ratio" type="number" step="0.05" min="0.05" max="0.95" class="input" />
          </label>
          <label>
            <span>test_ratio</span>
            <input v-model.number="splitForm.test_ratio" type="number" step="0.05" min="0.05" max="0.95" class="input" />
          </label>
          <label>
            <span>time_column (可选)</span>
            <input v-model.trim="splitForm.time_column" class="input" placeholder="例如 event_time" />
          </label>
          <label>
            <span>borehole_column (可选)</span>
            <input v-model.trim="splitForm.borehole_column" class="input" placeholder="例如 borehole_name" />
          </label>
          <label>
            <span>seed</span>
            <input v-model.number="splitForm.seed" type="number" class="input" />
          </label>
        </div>

        <div class="actions">
          <button class="btn" :disabled="busy.split || !targetDatasetId" @click="splitDataset">
            {{ busy.split ? '切分中...' : '执行切分' }}
          </button>
        </div>

        <div v-if="splitManifest" class="split-summary">
          <div class="summary-grid">
            <div><span>train</span><strong>{{ splitManifest.counts?.train ?? 0 }}</strong></div>
            <div><span>val</span><strong>{{ splitManifest.counts?.val ?? 0 }}</strong></div>
            <div><span>test</span><strong>{{ splitManifest.counts?.test ?? 0 }}</strong></div>
          </div>
          <div class="leakage" :class="hasLeakage ? 'warn' : 'safe'">
            <span>泄漏审计</span>
            <b v-if="hasLeakage">
              train-val {{ splitManifest.leakage_audit?.overlap?.boreholes_train_val || 0 }},
              train-test {{ splitManifest.leakage_audit?.overlap?.boreholes_train_test || 0 }},
              val-test {{ splitManifest.leakage_audit?.overlap?.boreholes_val_test || 0 }}
            </b>
            <b v-else>钻孔无交叉</b>
          </div>
        </div>
      </article>
    </section>

    <section class="grid grid-2">
      <article class="card panel">
        <div class="panel-head">
          <h2>3) 单实验运行</h2>
          <span class="tip">输出 metrics + calibration + ci95</span>
        </div>
        <div class="form-grid">
          <label>
            <span>dataset_id</span>
            <input v-model.trim="experimentForm.dataset_id" class="input" />
          </label>
          <label>
            <span>dataset_version</span>
            <input v-model.trim="experimentForm.dataset_version" class="input" />
          </label>
          <label>
            <span>split_id</span>
            <input v-model.trim="experimentForm.split_id" class="input" />
          </label>
          <label>
            <span>experiment_name</span>
            <input v-model.trim="experimentForm.experiment_name" class="input" />
          </label>
          <label>
            <span>model_type</span>
            <select v-model="experimentForm.model_type">
              <option value="baseline">baseline</option>
              <option value="rsi_phase_field">rsi_phase_field</option>
              <option value="asi_ust">asi_ust</option>
              <option value="custom">custom</option>
            </select>
          </label>
          <label>
            <span>target_label_column (可选)</span>
            <input v-model.trim="experimentForm.target_label_column" class="input" />
          </label>
          <label>
            <span>metrics (逗号分隔)</span>
            <input v-model.trim="experimentForm.metrics" class="input" />
          </label>
          <label>
            <span>seed</span>
            <input v-model.number="experimentForm.seed" type="number" class="input" />
          </label>
        </div>
        <div class="actions">
          <button
            class="btn"
            :disabled="busy.runExperiment || !canRunExperiment"
            @click="runExperiment"
          >
            {{ busy.runExperiment ? '运行中...' : '运行实验' }}
          </button>
        </div>
      </article>

      <article class="card panel">
        <div class="panel-head">
          <h2>4) 模板批量实验</h2>
          <span class="tip">论文主实验与基线对照</span>
        </div>
        <div class="lookup-row">
          <select v-model="selectedTemplate">
            <option v-for="name in templateNames" :key="name" :value="name">{{ name }}</option>
          </select>
          <button class="btn secondary" :disabled="busy.loadTemplates" @click="loadTemplates">
            {{ busy.loadTemplates ? '刷新中...' : '刷新模板' }}
          </button>
        </div>
        <div class="template-preview" v-if="templateSteps.length">
          <table class="table">
            <thead>
              <tr>
                <th>experiment_name</th>
                <th>model_type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in templateSteps" :key="`${item.experiment_name}-${item.model_type}`">
                <td>{{ item.experiment_name }}</td>
                <td>{{ item.model_type }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="actions">
          <button
            class="btn"
            :disabled="busy.runSuite || !canRunSuite || !selectedTemplate"
            @click="runSuite"
          >
            {{ busy.runSuite ? '运行中...' : '运行模板实验' }}
          </button>
        </div>
        <div v-if="suiteResult" class="suite-summary">
          <div class="meta-item">suite_id: <b>{{ suiteResult.suite_id }}</b></div>
          <div class="meta-item">runs: <b>{{ suiteResult.runs?.length || 0 }}</b></div>
        </div>
      </article>
    </section>

    <section class="card panel">
      <div class="panel-head">
        <h2>5) 实验结果与产物查询</h2>
        <span class="tip">按 exp_id 回溯证据链</span>
      </div>
      <div class="lookup-row">
        <input v-model.trim="resultQueryExpId" class="input" placeholder="输入 exp_id 查询" />
        <button class="btn secondary" :disabled="busy.loadResult || !resultQueryExpId" @click="loadExperimentResult">
          {{ busy.loadResult ? '查询中...' : '查结果' }}
        </button>
        <button class="btn secondary" :disabled="busy.loadArtifacts || !resultQueryExpId" @click="loadArtifacts">
          {{ busy.loadArtifacts ? '查询中...' : '查产物' }}
        </button>
        <button class="btn secondary" :disabled="busy.exportEvidence || (!displayResult && !comparisonRows.length)" @click="exportEvidenceBundle">
          {{ busy.exportEvidence ? '打包中...' : '导出证据 ZIP' }}
        </button>
      </div>

      <div v-if="displayResult" class="result-grid">
        <article class="result-card">
          <h3>关键指标</h3>
          <div class="metric-grid">
            <div v-for="[name, value] in metricEntries" :key="name" class="metric-item">
              <span>{{ name }}</span>
              <b>{{ formatNumber(value, 6) }}</b>
            </div>
          </div>
        </article>

        <article class="result-card">
          <h3>95% 置信区间</h3>
          <table class="table compact">
            <thead>
              <tr>
                <th>metric</th>
                <th>low</th>
                <th>high</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="[name, range] in ciEntries" :key="name">
                <td>{{ name }}</td>
                <td>{{ formatNumber(range?.[0], 6) }}</td>
                <td>{{ formatNumber(range?.[1], 6) }}</td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>

      <div class="result-grid" v-if="displayResult">
        <article class="result-card">
          <h3>校准报告</h3>
          <div class="meta-row">
            <span>ECE: <b>{{ formatNumber(displayResult.calibration?.ece, 6) }}</b></span>
            <span>MCE: <b>{{ formatNumber(displayResult.calibration?.mce, 6) }}</b></span>
            <span>Bins: <b>{{ displayResult.calibration?.bin_count ?? 0 }}</b></span>
          </div>
          <table class="table compact">
            <thead>
              <tr>
                <th>bin</th>
                <th>count</th>
                <th>acc</th>
                <th>conf</th>
                <th>gap</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in (displayResult.calibration?.bins || []).slice(0, 10)" :key="item.bin">
                <td>{{ item.bin }}</td>
                <td>{{ item.count }}</td>
                <td>{{ formatNumber(item.acc, 4) }}</td>
                <td>{{ formatNumber(item.conf, 4) }}</td>
                <td>{{ formatNumber(item.gap, 4) }}</td>
              </tr>
            </tbody>
          </table>
        </article>

        <article class="result-card">
          <h3>Traceability</h3>
          <div class="trace-row">
            <span>dataset_manifest</span>
            <code>{{ displayResult.traceability?.dataset_manifest || '-' }}</code>
          </div>
          <div class="trace-row">
            <span>split_manifest</span>
            <code>{{ displayResult.traceability?.split_manifest || '-' }}</code>
          </div>
          <div class="trace-row">
            <span>created_at</span>
            <code>{{ displayResult.created_at || '-' }}</code>
          </div>
        </article>
      </div>

      <article v-if="artifacts.length" class="result-card">
        <h3>Artifacts</h3>
        <table class="table">
          <thead>
            <tr>
              <th>name</th>
              <th>size</th>
              <th>path</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in artifacts" :key="item.path">
              <td>{{ item.name }}</td>
              <td>{{ formatBytes(item.size_bytes) }}</td>
              <td><code>{{ item.path }}</code></td>
              <td>
                <button
                  class="btn secondary btn-inline"
                  :disabled="busy.downloadArtifact && downloadingArtifactName === item.name"
                  @click="downloadArtifact(item)"
                >
                  {{ busy.downloadArtifact && downloadingArtifactName === item.name ? '下载中...' : '下载' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>

    <section class="card panel">
      <div class="panel-head">
        <h2>6) 实验对比看板</h2>
        <span class="tip">按多个 exp_id 横向比较，支持 CSV/JSON 导出</span>
      </div>
      <label class="compare-label">
        <span>exp_id 列表（逗号、空格或换行分隔）</span>
        <textarea
          v-model.trim="compareExpIdsText"
          class="input textarea"
          rows="4"
          placeholder="exp_20260208_120000_xxxxxx, exp_20260208_120500_yyyyyy"
        ></textarea>
      </label>
      <div class="actions actions-split">
        <button class="btn" :disabled="busy.compare" @click="loadComparison">
          {{ busy.compare ? '加载中...' : '加载对比' }}
        </button>
        <button class="btn secondary" :disabled="!comparisonRows.length" @click="exportComparisonCsv">
          导出 CSV
        </button>
        <button class="btn secondary" :disabled="!comparisonRows.length" @click="exportComparisonJson">
          导出 JSON
        </button>
      </div>

      <div v-if="comparisonRows.length" class="viz-controls">
        <label>
          <span>可视化指标</span>
          <select v-model="compareVizMetric">
            <option v-for="metric in comparisonMetricOrder" :key="`viz-${metric}`" :value="metric">{{ metric }}</option>
          </select>
        </label>
      </div>

      <div v-if="comparisonPointChart" class="result-grid">
        <article class="result-card">
          <h3>实验分布与95%CI（{{ compareVizMetric }}）</h3>
          <svg class="compare-svg" :viewBox="`0 0 ${comparisonPointChart.width} ${comparisonPointChart.height}`" preserveAspectRatio="none">
            <rect
              :x="comparisonPointChart.margin.left"
              :y="comparisonPointChart.margin.top"
              :width="comparisonPointChart.plotWidth"
              :height="comparisonPointChart.plotHeight"
              fill="#f8fafc"
              stroke="#e2e8f0"
            />
            <g v-for="tick in comparisonPointChart.ticks" :key="`tick-${tick}`">
              <line
                :x1="comparisonPointChart.scaleX(tick)"
                :x2="comparisonPointChart.scaleX(tick)"
                :y1="comparisonPointChart.margin.top"
                :y2="comparisonPointChart.margin.top + comparisonPointChart.plotHeight"
                stroke="#cbd5e1"
                stroke-dasharray="3 3"
              />
              <text
                :x="comparisonPointChart.scaleX(tick)"
                :y="comparisonPointChart.height - 8"
                text-anchor="middle"
                class="axis-label"
              >
                {{ formatNumber(tick, 4) }}
              </text>
            </g>
            <g v-for="row in comparisonPointChart.rows" :key="`pt-${row.exp_id}`">
              <line
                v-if="row.hasCi"
                :x1="comparisonPointChart.scaleX(row.ciLow)"
                :x2="comparisonPointChart.scaleX(row.ciHigh)"
                :y1="row.y"
                :y2="row.y"
                stroke="#64748b"
                stroke-width="1.5"
              />
              <circle
                :cx="comparisonPointChart.scaleX(row.value)"
                :cy="row.y"
                r="4.5"
                :fill="row.isChampion ? '#0f766e' : '#0e7490'"
              />
              <text
                :x="comparisonPointChart.margin.left - 6"
                :y="row.y + 4"
                text-anchor="end"
                class="axis-label left"
              >
                {{ row.shortExpId }}
              </text>
            </g>
          </svg>
        </article>

        <article class="result-card" v-if="comparisonModelBarChart">
          <h3>模型均值条形图（{{ compareVizMetric }}）</h3>
          <svg class="compare-svg" :viewBox="`0 0 ${comparisonModelBarChart.width} ${comparisonModelBarChart.height}`" preserveAspectRatio="none">
            <rect
              :x="comparisonModelBarChart.margin.left"
              :y="comparisonModelBarChart.margin.top"
              :width="comparisonModelBarChart.plotWidth"
              :height="comparisonModelBarChart.plotHeight"
              fill="#f8fafc"
              stroke="#e2e8f0"
            />
            <g v-for="bar in comparisonModelBarChart.rows" :key="`bar-${bar.model_type}`">
              <rect
                :x="comparisonModelBarChart.margin.left"
                :y="bar.y - bar.height / 2"
                :width="comparisonModelBarChart.scaleX(bar.value) - comparisonModelBarChart.margin.left"
                :height="bar.height"
                rx="6"
                fill="#0f766e"
                opacity="0.88"
              />
              <text :x="comparisonModelBarChart.margin.left - 8" :y="bar.y + 4" text-anchor="end" class="axis-label left">
                {{ bar.model_type }}
              </text>
              <text :x="comparisonModelBarChart.scaleX(bar.value) + 6" :y="bar.y + 4" class="axis-label">
                {{ formatNumber(bar.value, 4) }}
              </text>
            </g>
          </svg>
        </article>
      </div>

      <div v-if="comparisonRows.length" class="result-card">
        <table class="table">
          <thead>
            <tr>
              <th>exp_id</th>
              <th>model_type</th>
              <th v-for="metric in comparisonMetricOrder" :key="`head-${metric}`">{{ metric }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in comparisonRows" :key="row.exp_id">
              <td><code>{{ row.exp_id }}</code></td>
              <td>{{ row.spec?.model_type || '-' }}</td>
              <td v-for="metric in comparisonMetricOrder" :key="`${row.exp_id}-${metric}`">
                <span :class="{ best: isBestMetricValue(metric, row.metrics?.[metric]) }">
                  {{ formatNumber(row.metrics?.[metric], 6) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="comparisonModelRows.length" class="result-card">
        <h3>按模型聚合（均值）</h3>
        <table class="table compact">
          <thead>
            <tr>
              <th>model_type</th>
              <th>samples</th>
              <th v-for="metric in comparisonMetricOrder" :key="`model-head-${metric}`">{{ metric }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in comparisonModelRows" :key="row.model_type">
              <td>{{ row.model_type }}</td>
              <td>{{ row.sample_count }}</td>
              <td v-for="metric in comparisonMetricOrder" :key="`model-${row.model_type}-${metric}`">
                {{ formatNumber(row.metrics?.[metric], 6) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="comparisonChampionRows.length" class="result-card">
        <h3>指标冠军</h3>
        <table class="table compact">
          <thead>
            <tr>
              <th>metric</th>
              <th>best_value</th>
              <th>exp_id</th>
              <th>model_type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in comparisonChampionRows" :key="`champion-${item.metric}`">
              <td>{{ item.metric }}</td>
              <td>{{ formatNumber(item.value, 6) }}</td>
              <td><code>{{ item.exp_id }}</code></td>
              <td>{{ item.model_type }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  researchDownloadArtifact,
  researchGetArtifacts,
  researchGetDataset,
  researchGetExperiment,
  researchListExperimentTemplates,
  researchRegisterDataset,
  researchRunExperiment,
  researchRunExperimentSuite,
  researchSplitDataset
} from '../api'
import { useToast } from '../composables/useToast'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const comparisonMetricOrder = ['auc', 'pr_auc', 'f1', 'brier', 'mae', 'rmse', 'paired_significance_p']
const higherBetterMetrics = new Set(['auc', 'pr_auc', 'f1'])

const busy = reactive({
  register: false,
  loadDataset: false,
  split: false,
  runExperiment: false,
  loadTemplates: false,
  runSuite: false,
  loadResult: false,
  loadArtifacts: false,
  downloadArtifact: false,
  compare: false,
  exportEvidence: false
})

const registerForm = reactive({
  dataset_id: '',
  description: '',
  label_column: 'label',
  positive_values: '1',
  event_definition: 'roof_pressure_event',
  time_window_hours: 24,
  threshold: ''
})

const splitForm = reactive({
  strategy: 'time_borehole_block',
  train_ratio: 0.7,
  val_ratio: 0.15,
  test_ratio: 0.15,
  seed: 42,
  time_column: '',
  borehole_column: ''
})

const experimentForm = reactive({
  dataset_id: '',
  dataset_version: '',
  split_id: '',
  experiment_name: 'rsi_phasefield_v1',
  model_type: 'rsi_phase_field',
  target_label_column: 'label',
  metrics: 'auc,pr_auc,brier,ece,f1,mae,rmse',
  seed: 42
})

const manifest = ref(null)
const splitManifest = ref(null)
const experimentResult = ref(null)
const suiteResult = ref(null)
const templates = ref({})
const selectedTemplate = ref('')
const loadedResult = ref(null)
const artifacts = ref([])
const datasetQueryId = ref('')
const resultQueryExpId = ref('')
const downloadingArtifactName = ref('')
const compareExpIdsText = ref('')
const comparisonRows = ref([])
const compareVizMetric = ref('auc')
let jsZipCtor = null

const targetDatasetId = computed(() => datasetQueryId.value || manifest.value?.dataset_id || '')
const canRunExperiment = computed(() => (
  Boolean(experimentForm.dataset_id) &&
  Boolean(experimentForm.dataset_version) &&
  Boolean(experimentForm.experiment_name)
))
const canRunSuite = computed(() => (
  Boolean(experimentForm.dataset_id) &&
  Boolean(experimentForm.dataset_version) &&
  Boolean(experimentForm.split_id)
))
const displayResult = computed(() => loadedResult.value || experimentResult.value)
const metricEntries = computed(() => Object.entries(displayResult.value?.metrics || {}))
const ciEntries = computed(() => Object.entries(displayResult.value?.ci95 || {}))
const templateNames = computed(() => Object.keys(templates.value || {}))
const templateSteps = computed(() => templates.value?.[selectedTemplate.value] || [])
const hasLeakage = computed(() => {
  const overlap = splitManifest.value?.leakage_audit?.overlap
  if (!overlap) return false
  return Number(overlap.boreholes_train_val || 0) > 0 ||
    Number(overlap.boreholes_train_test || 0) > 0 ||
    Number(overlap.boreholes_val_test || 0) > 0
})
const bestMetricValues = computed(() => {
  const rows = comparisonRows.value || []
  const result = {}
  for (const metric of comparisonMetricOrder) {
    const values = rows
      .map((row) => Number(row?.metrics?.[metric]))
      .filter((value) => Number.isFinite(value))
    if (!values.length) continue
    result[metric] = higherBetterMetrics.has(metric)
      ? Math.max(...values)
      : Math.min(...values)
  }
  return result
})
const comparisonModelRows = computed(() => {
  const buckets = new Map()
  for (const row of comparisonRows.value || []) {
    const modelType = String(row?.spec?.model_type || 'unknown')
    if (!buckets.has(modelType)) {
      buckets.set(modelType, {
        model_type: modelType,
        sample_count: 0,
        values: {},
        metrics: {}
      })
    }
    const bucket = buckets.get(modelType)
    bucket.sample_count += 1
    for (const metric of comparisonMetricOrder) {
      const value = Number(row?.metrics?.[metric])
      if (!Number.isFinite(value)) continue
      if (!bucket.values[metric]) bucket.values[metric] = []
      bucket.values[metric].push(value)
    }
  }
  for (const bucket of buckets.values()) {
    for (const metric of comparisonMetricOrder) {
      const vals = bucket.values[metric] || []
      if (!vals.length) continue
      bucket.metrics[metric] = vals.reduce((acc, item) => acc + item, 0) / vals.length
    }
  }
  return Array.from(buckets.values()).sort((a, b) => a.model_type.localeCompare(b.model_type))
})
const comparisonChampionRows = computed(() => {
  const rows = comparisonRows.value || []
  const champions = []
  for (const metric of comparisonMetricOrder) {
    let winner = null
    for (const row of rows) {
      const value = Number(row?.metrics?.[metric])
      if (!Number.isFinite(value)) continue
      if (!winner) {
        winner = row
        continue
      }
      const winnerValue = Number(winner?.metrics?.[metric])
      const takeCurrent = higherBetterMetrics.has(metric) ? value > winnerValue : value < winnerValue
      if (takeCurrent) winner = row
    }
    if (winner) {
      champions.push({
        metric,
        value: Number(winner?.metrics?.[metric]),
        exp_id: winner?.exp_id || '',
        model_type: winner?.spec?.model_type || 'unknown'
      })
    }
  }
  return champions
})
const championExpIdByMetric = computed(() => {
  const map = {}
  for (const row of comparisonChampionRows.value) {
    map[row.metric] = row.exp_id
  }
  return map
})
const comparisonPointChart = computed(() => {
  const metric = compareVizMetric.value
  const rows = (comparisonRows.value || [])
    .map((row) => {
      const value = Number(row?.metrics?.[metric])
      if (!Number.isFinite(value)) return null
      const ciRange = row?.ci95?.[metric]
      const ciLow = Number(ciRange?.[0])
      const ciHigh = Number(ciRange?.[1])
      return {
        exp_id: row.exp_id,
        shortExpId: String(row.exp_id || '').slice(-8),
        value,
        ciLow: Number.isFinite(ciLow) ? ciLow : value,
        ciHigh: Number.isFinite(ciHigh) ? ciHigh : value,
        hasCi: Number.isFinite(ciLow) && Number.isFinite(ciHigh),
        isChampion: championExpIdByMetric.value?.[metric] === row.exp_id
      }
    })
    .filter(Boolean)

  if (!rows.length) return null

  const width = 900
  const margin = { top: 20, right: 34, bottom: 34, left: 110 }
  const rowGap = 28
  const plotHeight = Math.max(160, rows.length * rowGap)
  const height = margin.top + plotHeight + margin.bottom
  const plotWidth = width - margin.left - margin.right

  const minValue = Math.min(...rows.map((row) => Math.min(row.ciLow, row.value)))
  const maxValue = Math.max(...rows.map((row) => Math.max(row.ciHigh, row.value)))
  const span = Math.max(maxValue - minValue, 1e-9)
  const pad = span * 0.12
  const domainMin = minValue - pad
  const domainMax = maxValue + pad
  const domainSpan = Math.max(domainMax - domainMin, 1e-9)
  const scaleX = (val) => margin.left + ((val - domainMin) / domainSpan) * plotWidth

  const ticks = Array.from({ length: 5 }, (_, idx) => domainMin + (idx / 4) * domainSpan)

  const chartRows = rows.map((row, idx) => ({
    ...row,
    y: margin.top + 14 + idx * rowGap
  }))

  return {
    width,
    height,
    margin,
    plotWidth,
    plotHeight,
    rows: chartRows,
    ticks,
    scaleX
  }
})
const comparisonModelBarChart = computed(() => {
  const metric = compareVizMetric.value
  const rows = (comparisonModelRows.value || [])
    .map((row) => ({
      model_type: row.model_type,
      value: Number(row?.metrics?.[metric])
    }))
    .filter((row) => Number.isFinite(row.value))
  if (!rows.length) return null

  const width = 900
  const margin = { top: 20, right: 60, bottom: 20, left: 150 }
  const rowGap = 34
  const barHeight = 20
  const plotHeight = Math.max(140, rows.length * rowGap)
  const height = margin.top + plotHeight + margin.bottom
  const plotWidth = width - margin.left - margin.right

  const minValue = Math.min(...rows.map((row) => row.value))
  const maxValue = Math.max(...rows.map((row) => row.value))
  const span = Math.max(maxValue - minValue, 1e-9)
  const pad = span * 0.1
  const domainMin = Math.min(0, minValue - pad)
  const domainMax = maxValue + pad
  const domainSpan = Math.max(domainMax - domainMin, 1e-9)
  const scaleX = (val) => margin.left + ((val - domainMin) / domainSpan) * plotWidth

  const chartRows = rows.map((row, idx) => ({
    ...row,
    y: margin.top + 16 + idx * rowGap,
    height: barHeight
  }))

  return {
    width,
    height,
    margin,
    plotWidth,
    plotHeight,
    rows: chartRows,
    scaleX
  }
})

const parseList = (text) => (
  String(text || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
)

const parseFlexibleList = (text) => (
  Array.from(
    new Set(
      String(text || '')
        .split(/[\s,]+/g)
        .map((item) => item.trim())
        .filter(Boolean)
    )
  )
)

const parsePositiveValues = (text) => (
  parseList(text).map((item) => {
    if (/^(true|false)$/i.test(item)) return item.toLowerCase() === 'true'
    const num = Number(item)
    return Number.isFinite(num) ? num : item
  })
)

const parseNullableNumber = (value) => {
  const text = String(value ?? '').trim()
  if (!text) return null
  const num = Number(text)
  return Number.isFinite(num) ? num : null
}

const getErrorMessage = (error, fallback) => (
  error?.response?.data?.detail ||
  error?.message ||
  fallback
)

const formatNumber = (value, digits = 4) => {
  const n = Number(value)
  return Number.isFinite(n) ? n.toFixed(digits) : '-'
}

const formatBytes = (value) => {
  const size = Number(value)
  if (!Number.isFinite(size) || size < 0) return '-'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const safeStamp = () => new Date().toISOString().replace(/[:.]/g, '-')
const syncRouteExpId = (expId) => {
  const nextExpId = String(expId || '').trim()
  if (!nextExpId) return
  const currentExpId = String(route.query?.exp_id || '').trim()
  if (currentExpId === nextExpId) return
  router.replace({
    path: '/research-workbench',
    query: {
      ...route.query,
      exp_id: nextExpId
    }
  }).catch(() => {})
}

const bootstrapExpFromRoute = async () => {
  const expId = String(route.query?.exp_id || '').trim()
  if (!expId) return
  resultQueryExpId.value = expId
  await loadExperimentResult()
  await loadArtifacts()
}

const getJSZipCtor = async () => {
  if (jsZipCtor) return jsZipCtor
  const mod = await import('jszip')
  jsZipCtor = mod?.default || mod?.JSZip || null
  if (!jsZipCtor) {
    throw new Error('JSZip 加载失败')
  }
  return jsZipCtor
}

const parseFilenameFromHeader = (value, fallback) => {
  const text = String(value || '')
  const utf8Match = text.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1])
    } catch {
      return utf8Match[1]
    }
  }
  const plainMatch = text.match(/filename="?([^";]+)"?/i)
  return plainMatch?.[1] || fallback
}

const isBestMetricValue = (metric, value) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return false
  const best = Number(bestMetricValues.value?.[metric])
  if (!Number.isFinite(best)) return false
  return Math.abs(best - num) <= 1e-12
}

const buildComparisonCsvText = (rows) => {
  if (!rows?.length) return ''
  const headers = ['exp_id', 'model_type', 'dataset_id', 'dataset_version', 'split_id', ...comparisonMetricOrder, 'created_at']
  const lines = [headers.join(',')]
  for (const row of rows) {
    const modelType = row?.spec?.model_type || ''
    const values = [
      row?.exp_id || '',
      modelType,
      row?.dataset_id || '',
      row?.dataset_version || '',
      row?.split_id || '',
      ...comparisonMetricOrder.map((metric) => row?.metrics?.[metric] ?? ''),
      row?.created_at || ''
    ]
    lines.push(values.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(','))
  }
  return `${lines.join('\n')}\n`
}

const buildModelSummaryCsvText = (rows) => {
  if (!rows?.length) return ''
  const headers = ['model_type', 'sample_count', ...comparisonMetricOrder]
  const lines = [headers.join(',')]
  for (const row of rows) {
    const values = [
      row.model_type,
      row.sample_count,
      ...comparisonMetricOrder.map((metric) => row?.metrics?.[metric] ?? '')
    ]
    lines.push(values.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(','))
  }
  return `${lines.join('\n')}\n`
}
const buildMethodsMarkdown = () => {
  const metric = compareVizMetric.value
  const lines = [
    '# Methods Summary',
    '',
    '## Data Governance',
    `- Dataset ID: ${manifest.value?.dataset_id || '-'}`,
    `- Dataset Version: ${manifest.value?.dataset_version || '-'}`,
    `- Dataset Rows: ${manifest.value?.row_count ?? '-'}`,
    `- Label Column: ${manifest.value?.label_schema?.label_column || '-'}`,
    `- Positive Values: ${(manifest.value?.label_schema?.positive_values || []).join(', ') || '-'}`,
    '',
    '## Split Strategy',
    `- Split ID: ${splitManifest.value?.split_id || displayResult.value?.split_id || '-'}`,
    `- Strategy: ${splitManifest.value?.strategy || '-'}`,
    `- Ratios: train=${splitManifest.value?.ratios?.train ?? '-'}, val=${splitManifest.value?.ratios?.val ?? '-'}, test=${splitManifest.value?.ratios?.test ?? '-'}`,
    `- Leakage Overlap: train-val=${splitManifest.value?.leakage_audit?.overlap?.boreholes_train_val ?? '-'}, train-test=${splitManifest.value?.leakage_audit?.overlap?.boreholes_train_test ?? '-'}, val-test=${splitManifest.value?.leakage_audit?.overlap?.boreholes_val_test ?? '-'}`,
    '',
    '## Experiment Protocol',
    `- Primary Experiment ID: ${displayResult.value?.exp_id || '-'}`,
    `- Model Type: ${displayResult.value?.spec?.model_type || '-'}`,
    `- Seed: ${displayResult.value?.spec?.seed ?? '-'}`,
    `- Metrics: ${comparisonMetricOrder.join(', ')}`,
    '- Statistics: bootstrap 95% CI and paired significance (as implemented by backend experiment runner).',
    '',
    '## Comparison Snapshot',
    `- Compared Experiments: ${comparisonRows.value.length}`,
    `- Visualized Metric: ${metric}`,
    `- Model Groups: ${comparisonModelRows.value.length}`,
    `- Champion Count: ${comparisonChampionRows.value.length}`,
    '',
    '## Notes',
    '- This material is generated from current reproducibility workspace state.',
    '- Use this file as supplementary methods draft for manuscript preparation.'
  ]
  return lines.join('\n')
}

const applyManifestToForms = (data) => {
  if (!data) return
  datasetQueryId.value = data.dataset_id || datasetQueryId.value
  experimentForm.dataset_id = data.dataset_id || experimentForm.dataset_id
  experimentForm.dataset_version = data.dataset_version || experimentForm.dataset_version
  if (data.label_schema?.label_column && !experimentForm.target_label_column) {
    experimentForm.target_label_column = data.label_schema.label_column
  }
}

const registerDataset = async () => {
  busy.register = true
  try {
    const payload = {
      dataset_id: registerForm.dataset_id,
      description: registerForm.description,
      label_schema: {
        label_column: registerForm.label_column,
        positive_values: parsePositiveValues(registerForm.positive_values),
        event_definition: registerForm.event_definition,
        time_window_hours: Number(registerForm.time_window_hours || 24),
        threshold: parseNullableNumber(registerForm.threshold)
      }
    }
    const { data } = await researchRegisterDataset(payload)
    manifest.value = data
    splitManifest.value = null
    applyManifestToForms(data)
    toast.success(`注册成功：${data.dataset_id}`)
  } catch (error) {
    toast.error(getErrorMessage(error, '数据集注册失败'))
  } finally {
    busy.register = false
  }
}

const loadDataset = async () => {
  if (!datasetQueryId.value) return
  busy.loadDataset = true
  try {
    const { data } = await researchGetDataset(datasetQueryId.value)
    manifest.value = data
    applyManifestToForms(data)
    toast.success(`已加载 manifest：${data.dataset_id}`)
  } catch (error) {
    toast.error(getErrorMessage(error, '数据集查询失败'))
  } finally {
    busy.loadDataset = false
  }
}

const splitDataset = async () => {
  if (!targetDatasetId.value) return
  busy.split = true
  try {
    const payload = {
      strategy: splitForm.strategy,
      train_ratio: Number(splitForm.train_ratio),
      val_ratio: Number(splitForm.val_ratio),
      test_ratio: Number(splitForm.test_ratio),
      seed: Number(splitForm.seed),
      time_column: splitForm.time_column || null,
      borehole_column: splitForm.borehole_column || null
    }
    const { data } = await researchSplitDataset(targetDatasetId.value, payload)
    splitManifest.value = data
    experimentForm.split_id = data.split_id || experimentForm.split_id
    toast[hasLeakage.value ? 'warning' : 'success'](
      hasLeakage.value ? '切分完成，但检测到钻孔交叉' : `切分成功：${data.split_id}`
    )
  } catch (error) {
    toast.error(getErrorMessage(error, '数据切分失败'))
  } finally {
    busy.split = false
  }
}

const runExperiment = async () => {
  busy.runExperiment = true
  try {
    const payload = {
      dataset_id: experimentForm.dataset_id,
      dataset_version: experimentForm.dataset_version,
      split_id: experimentForm.split_id || null,
      experiment_name: experimentForm.experiment_name,
      model_type: experimentForm.model_type,
      target_label_column: experimentForm.target_label_column || null,
      metrics: parseList(experimentForm.metrics),
      seed: Number(experimentForm.seed)
    }
    const { data } = await researchRunExperiment(payload)
    experimentResult.value = data
    loadedResult.value = data
    resultQueryExpId.value = data.exp_id
    syncRouteExpId(data.exp_id)
    artifacts.value = []
    toast.success(`实验完成：${data.exp_id}`)
  } catch (error) {
    toast.error(getErrorMessage(error, '实验运行失败'))
  } finally {
    busy.runExperiment = false
  }
}

const loadTemplates = async () => {
  busy.loadTemplates = true
  try {
    const { data } = await researchListExperimentTemplates()
    templates.value = data?.templates || {}
    if (!selectedTemplate.value && templateNames.value.length > 0) {
      selectedTemplate.value = templateNames.value[0]
    }
  } catch (error) {
    toast.error(getErrorMessage(error, '模板查询失败'))
  } finally {
    busy.loadTemplates = false
  }
}

const runSuite = async () => {
  if (!selectedTemplate.value) return
  busy.runSuite = true
  try {
    const payload = {
      template_name: selectedTemplate.value,
      dataset_id: experimentForm.dataset_id,
      dataset_version: experimentForm.dataset_version,
      split_id: experimentForm.split_id,
      seed: Number(experimentForm.seed)
    }
    const { data } = await researchRunExperimentSuite(payload)
    suiteResult.value = data
    const firstExpId = data?.runs?.[0]?.exp_id
    if (firstExpId) {
      resultQueryExpId.value = firstExpId
      syncRouteExpId(firstExpId)
    }
    toast.success(`模板实验完成：${data.suite_id}`)
  } catch (error) {
    toast.error(getErrorMessage(error, '模板实验运行失败'))
  } finally {
    busy.runSuite = false
  }
}

const loadExperimentResult = async () => {
  if (!resultQueryExpId.value) return
  busy.loadResult = true
  try {
    const { data } = await researchGetExperiment(resultQueryExpId.value)
    loadedResult.value = data
    syncRouteExpId(data.exp_id)
    toast.success(`已加载结果：${data.exp_id}`)
  } catch (error) {
    toast.error(getErrorMessage(error, '实验结果查询失败'))
  } finally {
    busy.loadResult = false
  }
}

const loadArtifacts = async () => {
  if (!resultQueryExpId.value) return
  busy.loadArtifacts = true
  try {
    const { data } = await researchGetArtifacts(resultQueryExpId.value)
    artifacts.value = data?.artifacts || []
    toast.success(`已加载产物：${artifacts.value.length} 个`)
  } catch (error) {
    toast.error(getErrorMessage(error, '实验产物查询失败'))
  } finally {
    busy.loadArtifacts = false
  }
}

const downloadArtifact = async (item) => {
  const expId = resultQueryExpId.value || displayResult.value?.exp_id
  const artifactName = item?.name
  if (!expId || !artifactName) return
  busy.downloadArtifact = true
  downloadingArtifactName.value = artifactName
  try {
    const response = await researchDownloadArtifact(expId, artifactName)
    const filename = parseFilenameFromHeader(response?.headers?.['content-disposition'], artifactName)
    saveBlob(response.data, filename)
    toast.success(`已下载：${filename}`)
  } catch (error) {
    toast.error(getErrorMessage(error, '产物下载失败'))
  } finally {
    busy.downloadArtifact = false
    downloadingArtifactName.value = ''
  }
}

const loadComparison = async () => {
  const expIds = parseFlexibleList(compareExpIdsText.value)
  if (!expIds.length) {
    toast.warning('请先输入至少一个 exp_id')
    return
  }
  busy.compare = true
  try {
    const settled = await Promise.allSettled(expIds.map((expId) => researchGetExperiment(expId)))
    const okRows = []
    const failed = []
    settled.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value?.data) {
        okRows.push(result.value.data)
      } else {
        failed.push(expIds[index])
      }
    })
    comparisonRows.value = okRows
    if (okRows.length > 0) {
      loadedResult.value = okRows[0]
      resultQueryExpId.value = okRows[0].exp_id
      syncRouteExpId(okRows[0].exp_id)
    }
    if (failed.length > 0) {
      toast.warning(`部分实验加载失败：${failed.join(', ')}`)
    }
    if (okRows.length > 0) {
      toast.success(`已加载 ${okRows.length} 个实验用于对比`)
    } else {
      toast.error('没有可用实验结果')
    }
  } catch (error) {
    toast.error(getErrorMessage(error, '实验对比加载失败'))
  } finally {
    busy.compare = false
  }
}

const exportComparisonCsv = () => {
  if (!comparisonRows.value.length) return
  const blob = new Blob([buildComparisonCsvText(comparisonRows.value)], { type: 'text/csv;charset=utf-8;' })
  saveBlob(blob, `research_comparison_${safeStamp()}.csv`)
  toast.success('对比 CSV 已导出')
}

const exportComparisonJson = () => {
  if (!comparisonRows.value.length) return
  const payload = {
    exported_at: new Date().toISOString(),
    comparison_metric_order: comparisonMetricOrder,
    rows: comparisonRows.value
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' })
  saveBlob(blob, `research_comparison_${safeStamp()}.json`)
  toast.success('对比 JSON 已导出')
}

const exportEvidenceBundle = async () => {
  busy.exportEvidence = true
  try {
    const JSZip = await getJSZipCtor()
    const zip = new JSZip()
    const stamp = safeStamp()
    const expId = resultQueryExpId.value || displayResult.value?.exp_id || ''

    const readmeLines = [
      '# Research Evidence Bundle',
      '',
      `exported_at: ${new Date().toISOString()}`,
      `dataset_id: ${manifest.value?.dataset_id || '-'}`,
      `dataset_version: ${manifest.value?.dataset_version || '-'}`,
      `split_id: ${splitManifest.value?.split_id || displayResult.value?.split_id || '-'}`,
      `primary_exp_id: ${expId || '-'}`,
      '',
      '包含内容:',
      '- manifests/dataset_manifest.json',
      '- manifests/split_manifest.json',
      '- results/latest_result.json',
      '- results/suite_result.json',
      '- methods/methods.md',
      '- comparison/*.json|csv',
      '- artifacts/index.json (和可下载产物)'
    ]
    zip.file('README.md', readmeLines.join('\n'))
    zip.file('methods/methods.md', buildMethodsMarkdown())

    if (manifest.value) zip.file('manifests/dataset_manifest.json', JSON.stringify(manifest.value, null, 2))
    if (splitManifest.value) zip.file('manifests/split_manifest.json', JSON.stringify(splitManifest.value, null, 2))
    if (displayResult.value) zip.file('results/latest_result.json', JSON.stringify(displayResult.value, null, 2))
    if (suiteResult.value) zip.file('results/suite_result.json', JSON.stringify(suiteResult.value, null, 2))

    if (comparisonRows.value.length) {
      zip.file('comparison/comparison_rows.json', JSON.stringify(comparisonRows.value, null, 2))
      zip.file('comparison/comparison_rows.csv', buildComparisonCsvText(comparisonRows.value))
    }
    if (comparisonModelRows.value.length) {
      zip.file('comparison/model_summary.json', JSON.stringify(comparisonModelRows.value, null, 2))
      zip.file('comparison/model_summary.csv', buildModelSummaryCsvText(comparisonModelRows.value))
    }
    if (comparisonChampionRows.value.length) {
      zip.file('comparison/champions.json', JSON.stringify(comparisonChampionRows.value, null, 2))
    }
    if (comparisonPointChart.value) {
      zip.file('comparison/point_chart_data.json', JSON.stringify(comparisonPointChart.value.rows, null, 2))
    }
    if (comparisonModelBarChart.value) {
      zip.file('comparison/model_bar_chart_data.json', JSON.stringify(comparisonModelBarChart.value.rows, null, 2))
    }

    zip.file('artifacts/index.json', JSON.stringify(artifacts.value || [], null, 2))

    const downloaded = []
    const failed = []
    if (expId && artifacts.value.length) {
      for (const artifact of artifacts.value) {
        try {
          const response = await researchDownloadArtifact(expId, artifact.name)
          zip.file(`artifacts/files/${artifact.name}`, response.data)
          downloaded.push(artifact.name)
        } catch {
          failed.push(artifact.name)
        }
      }
    }
    zip.file('artifacts/download_report.json', JSON.stringify({
      exp_id: expId,
      requested: artifacts.value.map((item) => item.name),
      downloaded,
      failed
    }, null, 2))

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    })
    saveBlob(blob, `research_evidence_bundle_${stamp}.zip`)
    if (failed.length) {
      toast.warning(`证据包已导出，${failed.length} 个产物未能打包`)
    } else {
      toast.success('证据包 ZIP 已导出')
    }
  } catch (error) {
    toast.error(getErrorMessage(error, '证据包导出失败'))
  } finally {
    busy.exportEvidence = false
  }
}

onMounted(async () => {
  await loadTemplates()
  await bootstrapExpFromRoute()
})
</script>

<style scoped>
.research-page {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding-bottom: 12px;
}

.card {
  background: var(--gradient-card);
  border: 1px solid rgba(14, 116, 144, 0.16);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-lg);
  align-items: center;
  background:
    radial-gradient(circle at 12% 15%, rgba(15, 118, 110, 0.18) 0%, transparent 48%),
    radial-gradient(circle at 92% 92%, rgba(180, 83, 9, 0.14) 0%, transparent 40%),
    linear-gradient(145deg, #ffffff 0%, #edf6f4 100%);
}

.hero h1 {
  margin: 0;
  font-family: "Source Han Serif SC", "Noto Serif SC", "Times New Roman", serif;
  font-size: 28px;
  color: #0f172a;
}

.hero p {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.hero-status {
  display: grid;
  gap: 8px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 11px;
  border: 1px solid var(--border-color-light);
  background: #fff;
  color: var(--text-secondary);
}

.status-pill.ok {
  background: #ecfdf5;
  color: #065f46;
  border-color: #a7f3d0;
}

.status-pill.idle {
  background: #f8fafc;
  color: #64748b;
}

.status-pill.info {
  background: #ecfeff;
  color: #0e7490;
  border-color: #a5f3fc;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: baseline;
}

.panel-head h2 {
  margin: 0;
  font-size: 17px;
  color: #111827;
}

.tip {
  font-size: 11px;
  color: #64748b;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #475569;
}

.form-grid label.full {
  grid-column: 1 / -1;
}

.textarea {
  resize: vertical;
}

.lookup-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 8px;
  align-items: center;
}

.manifest-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-item {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-size: 12px;
  border: 1px solid var(--border-color-light);
  border-radius: 999px;
  background: #fff;
  padding: 4px 10px;
  color: #475569;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.summary-grid div {
  border: 1px solid var(--border-color-light);
  border-radius: 10px;
  background: #fff;
  padding: 8px 10px;
}

.summary-grid span {
  font-size: 11px;
  color: #64748b;
}

.summary-grid strong {
  display: block;
  margin-top: 4px;
  font-size: 18px;
  color: #111827;
}

.split-summary {
  display: grid;
  gap: 8px;
}

.leakage {
  border: 1px solid;
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.leakage.safe {
  background: #f0fdf4;
  border-color: #86efac;
  color: #166534;
}

.leakage.warn {
  background: #fffbeb;
  border-color: #fcd34d;
  color: #92400e;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.actions.actions-split {
  justify-content: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}

.compare-label {
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #475569;
}

.viz-controls {
  display: flex;
  justify-content: flex-start;
}

.viz-controls label {
  display: inline-grid;
  gap: 6px;
  font-size: 12px;
  color: #475569;
}

.viz-controls select {
  min-width: 180px;
}

.btn-inline {
  padding: 5px 10px;
  font-size: 12px;
}

.template-preview {
  max-height: 220px;
  overflow: auto;
}

.suite-summary {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.result-card {
  border: 1px solid var(--border-color-light);
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.result-card h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #111827;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.metric-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  background: #f8fafc;
}

.metric-item span {
  display: block;
  font-size: 11px;
  color: #64748b;
}

.metric-item b {
  display: block;
  margin-top: 4px;
  font-size: 14px;
  color: #111827;
}

.best {
  display: inline-flex;
  padding: 2px 6px;
  border-radius: 7px;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  color: #065f46;
  font-weight: 700;
}

.compare-svg {
  width: 100%;
  height: 280px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
}

.axis-label {
  font-size: 11px;
  fill: #475569;
}

.axis-label.left {
  fill: #334155;
}

.meta-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #475569;
  margin-bottom: 8px;
}

.trace-row {
  display: grid;
  gap: 5px;
  font-size: 12px;
  margin-bottom: 10px;
  color: #475569;
}

.trace-row code {
  padding: 6px 8px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  word-break: break-all;
}

.table.compact th,
.table.compact td {
  padding: 8px 9px;
  font-size: 12px;
}

@media (max-width: 1200px) {
  .result-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .grid-2,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .lookup-row {
    grid-template-columns: 1fr;
  }

  .hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-status {
    width: 100%;
    grid-template-columns: 1fr;
  }

  .actions {
    justify-content: flex-start;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>

