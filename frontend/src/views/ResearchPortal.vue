<template>
  <div class="research-portal page">
    <header class="portal-hero card">
      <div class="hero-copy">
        <p class="kicker">RESEARCH FRONTEND</p>
        <h1>MPI Research Portal</h1>
        <p>
          独立科研入口：论文草稿、门禁报告、可复现实验三条线并行。
          这个页面只面向科研产出，不承载生产流程配置。
        </p>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <span>Paper Drafts</span>
          <strong>{{ papers.length }}</strong>
        </div>
        <div class="stat">
          <span>Gate Pass</span>
          <strong>{{ passCount }}/{{ papers.length || 0 }}</strong>
        </div>
        <div class="stat">
          <span>Last Sync</span>
          <strong>{{ syncedAt || '-' }}</strong>
        </div>
      </div>
    </header>

    <section class="quick-grid">
      <article class="card quick-card">
        <h2>Quick Actions</h2>
        <div class="quick-actions">
          <button class="btn" type="button" @click="go('/research-workbench')">科研工作台</button>
          <button class="btn secondary" type="button" @click="go('/algorithm-validation')">算法实证</button>
          <button class="btn secondary" type="button" @click="go('/academic-algorithm')">新算法原理</button>
        </div>
      </article>

      <article class="card quick-card timeline">
        <h2>12-Month Track</h2>
        <ol>
          <li><b>A1-A2:</b> 数据治理与评估协议固化</li>
          <li><b>A3-A6:</b> RSI 相场主论文实证</li>
          <li><b>A5-A9:</b> ASI-UST 强度论文实证</li>
          <li><b>A8-A10:</b> 图表脚本与复现实验材料包</li>
          <li><b>A10-A12:</b> 双稿错峰投稿与返修准备</li>
        </ol>
      </article>
    </section>

    <section class="card leaderboard-panel">
      <div class="panel-head">
        <div>
          <h2>Experiment Leaderboard</h2>
          <p>基于 <code>data/research/experiments/*/result.json</code> 自动统计。</p>
        </div>
        <div class="leaderboard-actions">
          <select v-model="leaderboardMetric" @change="loadLeaderboard">
            <option v-for="item in metricOptions" :key="item" :value="item">{{ item }}</option>
          </select>
          <button class="btn secondary" type="button" :disabled="leaderboardLoading" @click="loadLeaderboard">
            {{ leaderboardLoading ? '刷新中...' : '刷新榜单' }}
          </button>
        </div>
      </div>

      <div v-if="leaderboardLoading" class="state">正在计算实验榜单...</div>
      <div v-else-if="leaderboardError" class="state error">{{ leaderboardError }}</div>
      <div v-else-if="!leaderboardRows.length" class="state">暂无实验结果，请先在科研工作台运行实验。</div>
      <div v-else class="leaderboard-grid">
        <article class="result-card">
          <h3>Top Runs ({{ leaderboardMetric }})</h3>
          <table class="table compact">
            <thead>
              <tr>
                <th>#</th>
                <th>exp_id</th>
                <th>model</th>
                <th>value</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in leaderboardRows" :key="row.exp_id">
                <td>{{ idx + 1 }}</td>
                <td><code>{{ row.exp_id }}</code></td>
                <td>{{ row.model_type || '-' }}</td>
                <td>{{ formatNumber(row.value, 6) }}</td>
                <td>
                  <button class="btn secondary btn-mini" type="button" @click="openExperiment(row.exp_id)">
                    在工作台打开
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </article>

        <article class="result-card">
          <h3>Model Summary</h3>
          <table class="table compact">
            <thead>
              <tr>
                <th>model</th>
                <th>count</th>
                <th>datasets</th>
                <th>mean</th>
                <th>best</th>
                <th>best_exp</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in leaderboardModels" :key="row.model_type">
                <td>{{ row.model_type }}</td>
                <td>{{ row.count }}</td>
                <td>{{ row.dataset_count ?? '-' }}</td>
                <td>{{ formatNumber(row.mean, 6) }}</td>
                <td>{{ formatNumber(row.best, 6) }}</td>
                <td>
                  <button
                    class="btn secondary btn-mini"
                    type="button"
                    :disabled="!row.best_exp_id"
                    @click="openExperiment(row.best_exp_id)"
                  >
                    {{ row.best_exp_id ? '打开' : '-' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </section>

    <section class="card paper-panel">
      <div class="panel-head">
        <div>
          <h2>Manuscripts & Gate Reports</h2>
          <p>后端读取 <code>docs/papers</code>，直接展示当前稿件与门禁状态。</p>
        </div>
        <button class="btn secondary" type="button" :disabled="loading" @click="loadOverview">
          {{ loading ? '刷新中...' : '刷新状态' }}
        </button>
      </div>

      <div v-if="loading" class="state">正在同步科研资产...</div>
      <div v-else-if="errorMessage" class="state error">{{ errorMessage }}</div>

      <div v-else class="paper-list">
        <article v-for="paper in papers" :key="paper.paper_id" class="paper-card">
          <header class="paper-head">
            <div>
              <h3>{{ paper.title }}</h3>
              <p>{{ paper.language.toUpperCase() }} · {{ paper.paper_id }}</p>
            </div>
            <span class="gate-pill" :class="paper.gate_summary?.overall_pass ? 'ok' : 'warn'">
              {{ paper.gate_summary?.overall_pass ? 'Gates PASS' : 'Gates BLOCKED' }}
            </span>
          </header>

          <div class="paper-meta">
            <span>manuscript: <b>{{ paper.manuscript?.exists ? 'ready' : 'missing' }}</b></span>
            <span v-if="paper.manuscript?.updated_at">updated: <b>{{ formatTime(paper.manuscript.updated_at) }}</b></span>
            <span v-if="paper.gate_summary">passed: <b>{{ paper.gate_summary.passed }}/{{ paper.gate_summary.total_gates }}</b></span>
          </div>
          <div class="paper-actions">
            <button
              class="btn btn-mini"
              type="button"
              :disabled="isDownloadingBundle(paper.paper_id)"
              @click="downloadBundle(paper.paper_id)"
            >
              {{ isDownloadingBundle(paper.paper_id) ? '打包中...' : '下载投稿包 ZIP' }}
            </button>
          </div>

          <div class="asset-table-wrap">
            <table class="table compact">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="asset in paper.assets" :key="`${paper.paper_id}-${asset.kind}`">
                  <td>{{ asset.kind }}</td>
                  <td>
                    <span class="tag" :class="asset.exists ? 'tag-ok' : 'tag-missing'">
                      {{ asset.exists ? 'ready' : 'missing' }}
                    </span>
                  </td>
                  <td>{{ asset.updated_at ? formatTime(asset.updated_at) : '-' }}</td>
                  <td>
                    <button
                      class="btn secondary btn-mini"
                      type="button"
                      :disabled="!asset.exists || isDownloading(paper.paper_id, asset.kind)"
                      @click="downloadAsset(paper.paper_id, asset.kind, asset.name)"
                    >
                      {{ isDownloading(paper.paper_id, asset.kind) ? '下载中...' : '下载' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  researchDownloadPaperAsset,
  researchDownloadPaperBundle,
  researchExperimentLeaderboard,
  researchPapersOverview
} from '../api'
import { useToast } from '../composables/useToast'

const router = useRouter()
const toast = useToast()

const papers = ref([])
const loading = ref(false)
const errorMessage = ref('')
const syncedAt = ref('')
const downloading = reactive({})
const leaderboardMetric = ref('auc')
const leaderboardLoading = ref(false)
const leaderboardError = ref('')
const leaderboardRows = ref([])
const leaderboardModels = ref([])
const metricOptions = ['auc', 'pr_auc', 'f1', 'brier', 'ece', 'mae', 'rmse', 'paired_significance_p']

const passCount = computed(() => papers.value.filter((item) => item?.gate_summary?.overall_pass).length)

const formatTime = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const markDownloading = (paperId, kind, value) => {
  const key = `${paperId}:${kind}`
  downloading[key] = value
}

const isDownloading = (paperId, kind) => Boolean(downloading[`${paperId}:${kind}`])
const isDownloadingBundle = (paperId) => Boolean(downloading[`bundle:${paperId}`])
const formatNumber = (value, digits = 4) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return '-'
  return n.toFixed(digits)
}

const parseFilename = (contentDisposition, fallback) => {
  if (!contentDisposition) return fallback
  const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(contentDisposition)
  const name = decodeURIComponent(match?.[1] || match?.[2] || '')
  return name || fallback
}

const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

const go = (path) => {
  router.push(path)
}

const openExperiment = (expId) => {
  if (!expId) return
  router.push({
    path: '/research-workbench',
    query: { exp_id: expId }
  })
}

const loadOverview = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const { data } = await researchPapersOverview()
    papers.value = data?.papers || []
    syncedAt.value = formatTime(data?.generated_at_utc)
  } catch (error) {
    errorMessage.value = error?.response?.data?.detail || error?.message || '科研资产同步失败'
  } finally {
    loading.value = false
  }
}

const loadLeaderboard = async () => {
  leaderboardLoading.value = true
  leaderboardError.value = ''
  try {
    const { data } = await researchExperimentLeaderboard(leaderboardMetric.value, 12)
    leaderboardRows.value = data?.rows || []
    leaderboardModels.value = data?.model_summary || []
  } catch (error) {
    leaderboardError.value = error?.response?.data?.detail || error?.message || '实验榜单读取失败'
  } finally {
    leaderboardLoading.value = false
  }
}

const downloadAsset = async (paperId, kind, fallbackName) => {
  markDownloading(paperId, kind, true)
  try {
    const response = await researchDownloadPaperAsset(paperId, kind)
    const filename = parseFilename(response?.headers?.['content-disposition'], fallbackName || `${paperId}_${kind}`)
    saveBlob(response.data, filename)
    toast.success(`已下载 ${filename}`)
  } catch (error) {
    toast.error(error?.response?.data?.detail || '下载失败')
  } finally {
    markDownloading(paperId, kind, false)
  }
}

const downloadBundle = async (paperId) => {
  markDownloading('bundle', paperId, true)
  try {
    const response = await researchDownloadPaperBundle(paperId)
    const filename = parseFilename(response?.headers?.['content-disposition'], `${paperId}_research_bundle.zip`)
    saveBlob(response.data, filename)
    toast.success(`已下载 ${filename}`)
  } catch (error) {
    toast.error(error?.response?.data?.detail || '投稿包下载失败')
  } finally {
    markDownloading('bundle', paperId, false)
  }
}

onMounted(() => {
  loadOverview()
  loadLeaderboard()
})
</script>

<style scoped>
.research-portal {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.portal-hero {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: var(--spacing-lg);
  background:
    radial-gradient(circle at 8% 12%, rgba(15, 118, 110, 0.18), transparent 45%),
    radial-gradient(circle at 92% 88%, rgba(180, 83, 9, 0.14), transparent 40%),
    linear-gradient(148deg, #ffffff 0%, #eef7f5 52%, #fdf8f1 100%);
}

.kicker {
  margin: 0;
  letter-spacing: 0.12em;
  font-size: 11px;
  color: #0e7490;
  font-weight: 700;
}

.hero-copy h1 {
  margin: 8px 0 10px;
  font-size: 34px;
  line-height: 1.1;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
}

.hero-copy p {
  margin: 0;
  font-size: 13px;
  color: #475569;
}

.hero-stats {
  display: grid;
  gap: 10px;
}

.stat {
  border: 1px solid rgba(14, 116, 144, 0.22);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.86);
  padding: 10px 12px;
}

.stat span {
  display: block;
  font-size: 11px;
  color: #64748b;
}

.stat strong {
  display: block;
  margin-top: 4px;
  font-size: 24px;
  color: #0f172a;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-lg);
}

.quick-card h2,
.paper-panel h2 {
  margin: 0;
  font-size: 18px;
}

.quick-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.timeline ol {
  margin: 10px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  color: #475569;
  font-size: 13px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.panel-head p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 12px;
}

.leaderboard-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.leaderboard-actions select {
  min-width: 180px;
}

.leaderboard-grid {
  margin-top: 12px;
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
}

.state {
  margin-top: 12px;
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  color: #475569;
  font-size: 13px;
}

.state.error {
  border-color: #fca5a5;
  background: #fef2f2;
  color: #b91c1c;
}

.paper-list {
  margin-top: 12px;
  display: grid;
  gap: 12px;
}

.paper-card {
  border: 1px solid var(--border-color-light);
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.paper-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.paper-head h3 {
  margin: 0;
  font-size: 16px;
}

.paper-head p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #64748b;
}

.gate-pill {
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid transparent;
}

.gate-pill.ok {
  background: #ecfdf5;
  border-color: #86efac;
  color: #166534;
}

.gate-pill.warn {
  background: #fffbeb;
  border-color: #fcd34d;
  color: #92400e;
}

.paper-meta {
  margin-top: 8px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #64748b;
}

.paper-actions {
  margin-top: 10px;
}

.asset-table-wrap {
  margin-top: 10px;
}

.tag {
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid transparent;
}

.tag-ok {
  background: #ecfdf5;
  border-color: #86efac;
  color: #166534;
}

.tag-missing {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #64748b;
}

.btn-mini {
  padding: 6px 10px;
  font-size: 12px;
}

.table.compact th,
.table.compact td {
  padding: 8px 10px;
}

@media (max-width: 1080px) {
  .portal-hero,
  .quick-grid {
    grid-template-columns: 1fr;
  }

  .hero-copy h1 {
    font-size: 28px;
  }

  .leaderboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
