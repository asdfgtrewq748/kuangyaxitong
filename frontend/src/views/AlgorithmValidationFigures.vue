<template>
  <div class="figures-page">
    <header class="page-header">
      <button class="icon-btn" type="button" :title="avf('back')" @click="goBack">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m0 0 6-6m-6 6 6 6" /></svg>
      </button>
      <div class="title-wrap">
        <h1>{{ avf('title') }}</h1>
        <p>{{ avf('subtitle') }}</p>
      </div>
      <div class="header-actions">
        <button class="tool-btn" type="button" :disabled="exportingMain" @click="exportActiveFigure">
          {{ exportingMain ? avf('exportingFigure') : avf('exportFigure') }}
        </button>
        <button class="tool-btn secondary" type="button" :disabled="exportingPack" @click="exportSupplementPackage">
          {{ exportingPack ? avf('packaging') : avf('exportSupplement') }}
        </button>
        <button class="tool-btn" type="button" @click="goBack">{{ avf('backToValidation') }}</button>
      </div>
    </header>

    <section v-if="snapshotError" class="empty-state">
      <h3>{{ avf('emptyTitle') }}</h3>
      <p>{{ snapshotError }}</p>
      <button class="tool-btn" type="button" @click="goBack">{{ avf('backToValidation') }}</button>
    </section>

    <section v-else class="figures-panel">
      <section class="publication-frame">
        <div class="figure-heading-band">
          <span class="figure-kicker">{{ paperFrame.heading }}</span>
          <h2>{{ paperFrame.title }}</h2>
          <p>{{ paperFrame.summary }}</p>
        </div>
        <div class="publication-summary-grid">
          <article v-for="item in paperFrame.cards" :key="item.label" class="publication-summary-card">
            <span class="label">{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>
        <p class="methods-footer">{{ paperFrame.methodsFooter }}</p>
      </section>
      <div class="meta-line">
        <span>{{ avf('seam') }} {{ snapshot?.seam || '--' }}</span>
        <span>{{ avf('updatedAt') }} {{ snapshotUpdatedLabel }}</span>
      </div>
      <div class="layout-toolbar">
        <div class="toolbar-group">
          <span class="toolbar-label">{{ avf('columns') }}</span>
          <button
            v-for="mode in columnModes"
            :key="mode.value"
            type="button"
            class="chip-btn"
            :class="{ active: layoutColumns === mode.value }"
            @click="layoutColumns = mode.value"
          >
            {{ mode.label }}
          </button>
        </div>
        <div class="toolbar-group">
          <span class="toolbar-label">{{ avf('density') }}</span>
          <button
            v-for="mode in densityModes"
            :key="mode.value"
            type="button"
            class="chip-btn"
            :class="{ active: density === mode.value }"
            @click="density = mode.value"
          >
            {{ mode.label }}
          </button>
        </div>
        <div class="toolbar-group scale-group">
          <span class="toolbar-label">{{ avf('scale') }}</span>
          <input
            v-model.number="chartScale"
            class="scale-slider"
            type="range"
            min="85"
            max="130"
            step="1"
          />
          <span class="scale-value">{{ chartScale }}%</span>
          <button type="button" class="chip-btn" @click="resetLayoutControls">{{ avf('reset') }}</button>
        </div>
        <div class="toolbar-group selector-group">
          <span class="toolbar-label">{{ avf('activeFigure') }}</span>
          <button
            v-for="item in figureMetaList"
            :key="item.id"
            type="button"
            class="chip-btn"
            :class="{ active: activeFigureId === item.id }"
            @click="activeFigureId = item.id"
          >
            {{ item.id.toUpperCase() }}
          </button>
        </div>
      </div>
      <section class="active-figure-caption">
        <div class="caption-head">
          <span class="caption-kicker">{{ activeFigureMeta.title || avf('figureContextUnavailable') }}</span>
          <h3>{{ activeFigureMeta.result || avf('selectFigurePrompt') }}</h3>
        </div>
        <p class="caption-summary">{{ activeFigureMeta.interpretation || avf('metadataPending') }}</p>
        <div class="caption-notes">
          <span><strong>{{ avf('notesLabel') }}:</strong> {{ activeFigureMeta.notes || '--' }}</span>
          <span><strong>{{ avf('abbrevLabel') }}:</strong> {{ activeFigureMeta.abbreviations || '--' }}</span>
        </div>
        <p class="methods-footer">{{ activeFigureMethodsFooter }}</p>
      </section>
      <ValidationScienceFigures
        ref="scienceFiguresRef"
        :result="snapshot?.result || null"
        :evaluation="snapshot?.evaluation || null"
        :columns="layoutColumns"
        :density="density"
        :chart-scale="chartScale"
        @figure-focus="handleFigureFocus"
      />
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ValidationScienceFigures from '../components/validation/ValidationScienceFigures.vue'
import { useI18n } from '../composables/useI18n'
import { useToast } from '../composables/useToast'
import { exportECharts } from '@/utils/figureExport'
import {
  buildPaperArtifact,
  buildPaperFigure,
  buildPaperFigureId,
  buildPaperFigurePath,
  buildPaperManifest,
  buildPaperRootPath,
  buildPaperSupplementZipName,
  buildPaperTimestampTag,
  buildPublicationCaptionsMarkdown,
  buildPublicationIndexDocument,
  buildPublicationLabelSet,
  buildPublicationMethodsFooter,
  buildPublicationNotesMarkdown,
  buildPublicationRows,
  buildPublicationReadmeMarkdown
} from '@/utils/paperExportSchema'

const SCIENCE_SNAPSHOT_KEY = 'algorithm_validation_science_snapshot_v1'
const SCIENCE_LAYOUT_PREF_KEY = 'algorithm_validation_figures_layout_v1'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()

const avf = (key, params) => t(`algorithmValidationFigures.${key}`, params)

const scienceFiguresRef = ref(null)
const snapshot = ref(null)
const snapshotError = ref('')
const layoutColumns = ref('auto')
const density = ref('balanced')
const chartScale = ref(100)
const activeFigureId = ref('fig2')
const exportingMain = ref(false)
const exportingPack = ref(false)
let jsZipCtor = null

const columnModes = [
  { value: 'auto', label: 'Auto' },
  { value: 1, label: '1 Column' },
  { value: 2, label: '2 Columns' }
]

const densityModes = [
  { value: 'compact', label: 'Compact' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'focus', label: '聚焦' }
]

const snapshotUpdatedLabel = computed(() => {
  const raw = snapshot.value?.updated_at
  if (!raw) return '--'
  const ts = Date.parse(String(raw))
  if (!Number.isFinite(ts)) return '--'
  return new Date(ts).toLocaleString()
})

const thresholdMode = computed(() => String(
  snapshot.value?.result?.evaluation_inputs?.mode ||
  snapshot.value?.result?.evaluation_inputs?.source ||
  '--'
))

const paperFrame = computed(() => {
  const auc = Number(snapshot.value?.evaluation?.auc ?? snapshot.value?.result?.kpi?.auc)
  const prAuc = Number(snapshot.value?.evaluation?.pr_auc)
  return {
    heading: '图组 | 算法验证',
    title: '融合模型评估验证图版',
    summary: `面向煤层 ${snapshot.value?.seam || '--'} 的论文级验证图组，将 ROC、PR、校准与机理证据统一整理到一个出版工作区。`,
    cards: [
      { label: '煤层', value: String(snapshot.value?.seam || '--') },
      { label: 'ROC AUC', value: Number.isFinite(auc) ? auc.toFixed(3) : '--' },
      { label: 'PR AUC', value: Number.isFinite(prAuc) ? prAuc.toFixed(3) : '--' },
    ],
    methodsFooter: buildPublicationMethodsFooter({
      subject: '验证科研图版',
      source: '缓存验证快照',
      seam: snapshot.value?.seam || '',
      details: [
        `阈值模式 ${thresholdMode.value}`,
        '本地布局控制',
        '论文导向多图版渲染'
      ]
    }),
  }
})

const figureMetaList = computed(() => {
  snapshot.value
  return scienceFiguresRef.value?.getFigureMetaList?.() || []
})

const activeFigureMeta = computed(() => {
  const list = figureMetaList.value
  return list.find((item) => item.id === activeFigureId.value) || list[0] || {}
})

const activeFigureMethodsFooter = computed(() => {
  if (!activeFigureMeta.value?.id) {
    return '方法注：图廊初始化完成后，这里会显示当前验证图的元数据。'
  }
  return buildPublicationMethodsFooter({
    subject: activeFigureMeta.value.title,
    source: '缓存验证快照',
    seam: snapshot.value?.seam || '',
    details: [
      `阈值模式 ${thresholdMode.value}`,
      `布局 ${String(layoutColumns.value)}`,
      `密度 ${density.value}`,
      `图表缩放 ${chartScale.value}%`
    ]
  })
})

watch(figureMetaList, (list) => {
  if (!Array.isArray(list) || !list.length) return
  if (!list.some((item) => item.id === activeFigureId.value)) {
    activeFigureId.value = list[0].id
  }
}, { immediate: true })

const normalizeQuerySeam = (value) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value : ''
}

const dataUrlToBlob = async (dataUrl) => {
  const resp = await fetch(dataUrl)
  return resp.blob()
}

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const getJSZipCtor = async () => {
  if (jsZipCtor) return jsZipCtor
  const mod = await import('jszip')
  jsZipCtor = mod?.default || mod?.JSZip || null
  if (!jsZipCtor) throw new Error('JSZip unavailable')
  return jsZipCtor
}

const wait = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms))
const resolveChartInstanceById = (figureId) => scienceFiguresRef.value?.getChartInstanceById?.(figureId) || null
const publicationLabels = buildPublicationLabelSet()

const buildPublicationCaptionRows = (meta) => {
  if (!meta?.id) return []
  return buildPublicationRows([
    { label: publicationLabels.figure, value: meta.title || meta.id },
    { label: publicationLabels.interpretation, value: meta.interpretation || '--' },
    { label: publicationLabels.result, value: meta.result || '--' }
  ])
}

const buildPublicationNoteRows = (meta) => {
  if (!meta?.id) return []
  return buildPublicationRows([
    { label: publicationLabels.notes, value: meta.notes || '--' },
    { label: publicationLabels.abbrev, value: meta.abbreviations || '--' },
    {
      label: publicationLabels.methodsFooter,
      value: buildPublicationMethodsFooter({
        subject: meta.title,
        source: '缓存验证快照',
        seam: snapshot.value?.seam || '',
        details: [
          `阈值模式 ${thresholdMode.value}`,
          `布局 ${String(layoutColumns.value)}`,
          `密度 ${density.value}`,
          `图表缩放 ${chartScale.value}%`
        ]
      })
    }
  ])
}

const buildFigureCaption = (meta) => {
  if (!meta) return '暂无图注。'
  return `${meta.interpretation || ''} ${meta.result || ''}`.trim() || '暂无图注。'
}

const loadSnapshot = () => {
  snapshotError.value = ''
  try {
    const raw = window.sessionStorage?.getItem?.(SCIENCE_SNAPSHOT_KEY)
    if (!raw) {
      snapshot.value = null
      snapshotError.value = avf('emptyDesc')
      return
    }
    const parsed = JSON.parse(raw)
    if (!parsed?.result) {
      snapshot.value = null
      snapshotError.value = avf('emptyDesc')
      return
    }
    const querySeam = normalizeQuerySeam(route.query?.seam)
    if (querySeam && parsed.seam && parsed.seam !== querySeam) {
      snapshot.value = null
      snapshotError.value = avf('emptyMismatch', { seam: querySeam })
      return
    }
    snapshot.value = parsed
  } catch {
    snapshot.value = null
    snapshotError.value = avf('emptyDesc')
  }
}

const goBack = () => {
  router.push({
    name: 'AlgorithmValidation',
    query: route.query?.seam ? { seam: route.query.seam } : undefined
  })
}

const loadLayoutPrefs = () => {
  try {
    const raw = window.localStorage?.getItem?.(SCIENCE_LAYOUT_PREF_KEY)
    if (!raw) return
    const saved = JSON.parse(raw)
    if ([1, 2, 'auto'].includes(saved?.columns)) layoutColumns.value = saved.columns
    if (['compact', 'balanced', 'focus'].includes(saved?.density)) density.value = saved.density
    if (Number.isFinite(saved?.scale)) chartScale.value = Math.max(85, Math.min(130, Number(saved.scale)))
  } catch {
    // ignore malformed cache
  }
}

const resetLayoutControls = () => {
  layoutColumns.value = 'auto'
  density.value = 'balanced'
  chartScale.value = 100
}

const handleFigureFocus = (figureId) => {
  if (typeof figureId === 'string' && figureId) {
    activeFigureId.value = figureId
  }
}

watch([layoutColumns, density, chartScale], () => {
  try {
    window.localStorage?.setItem?.(
      SCIENCE_LAYOUT_PREF_KEY,
      JSON.stringify({
        columns: layoutColumns.value,
        density: density.value,
        scale: chartScale.value
      })
    )
  } catch {
    // ignore write failure
  }
})

async function exportActiveFigure() {
  if (exportingMain.value) return
  exportingMain.value = true
  try {
    await nextTick()
    await wait(80)
    const chart = resolveChartInstanceById(activeFigureId.value)
    const meta = activeFigureMeta.value
    if (!chart || !meta?.id) {
      toast.warning('Validation figure is not ready for export yet.')
      return
    }
    const dataUrl = exportECharts(chart, {
      type: 'png',
      pixelRatio: 3.2,
      backgroundColor: '#FFFFFF'
    })
    const blob = await dataUrlToBlob(dataUrl)
    const filename = `Validation_${meta.id}_${buildPaperTimestampTag()}.png`
    triggerDownload(blob, filename)
    toast.success(`Exported ${meta.id.toUpperCase()} as ${filename}`)
  } catch (error) {
    toast.error(error?.message || 'Validation figure export failed.')
  } finally {
    exportingMain.value = false
  }
}

async function exportSupplementPackage() {
  if (exportingPack.value) return
  exportingPack.value = true
  try {
    await nextTick()
    const JSZip = await getJSZipCtor()
    const zip = new JSZip()
    const figures = []
    let exportedCount = 0

    for (let i = 0; i < figureMetaList.value.length; i += 1) {
      const meta = figureMetaList.value[i]
      const chart = resolveChartInstanceById(meta.id)
      if (!chart) continue

      const figId = buildPaperFigureId({ index: exportedCount + 1, supplement: true })
      const figureFiles = []

      const pngUrl = exportECharts(chart, {
        type: 'png',
        pixelRatio: 3.2,
        backgroundColor: '#FFFFFF'
      })
      const pngPath = buildPaperFigurePath({
        index: exportedCount + 1,
        supplement: true,
        slug: meta.id,
        ext: 'png'
      })
      zip.file(pngPath, await dataUrlToBlob(pngUrl))
      figureFiles.push(pngPath)

      try {
        const svgUrl = exportECharts(chart, {
          type: 'svg',
          pixelRatio: 2,
          backgroundColor: '#FFFFFF'
        })
        const svgPath = buildPaperFigurePath({
          index: exportedCount + 1,
          supplement: true,
          slug: meta.id,
          ext: 'svg'
        })
        zip.file(svgPath, await dataUrlToBlob(svgUrl))
        figureFiles.push(svgPath)
      } catch {
        // no-op: svg export is optional
      }

      figures.push(buildPaperFigure({
        id: figId,
        panel: String.fromCharCode(65 + exportedCount),
        title: meta.title,
        caption: buildFigureCaption(meta),
        files: figureFiles,
        tags: ['validation', 'science-plates', meta.id],
        meta: {
          figure_id: meta.id,
          exported_at: new Date().toISOString(),
          seam: snapshot.value?.seam || '',
          figure_heading: meta.title || meta.id,
          caption_title: meta.title || meta.id,
          caption_rows: buildPublicationCaptionRows(meta),
          note_rows: buildPublicationNoteRows(meta),
          notes: meta.notes || '',
          abbreviations: meta.abbreviations || '',
          methods_footer: buildPublicationMethodsFooter({
            subject: meta.title,
            source: '缓存验证快照',
            seam: snapshot.value?.seam || '',
            details: [
              `阈值模式 ${thresholdMode.value}`,
              `布局 ${String(layoutColumns.value)}`,
              `密度 ${density.value}`,
              `图表缩放 ${chartScale.value}%`
            ]
          })
        }
      }))
      exportedCount += 1
    }

    const captionsPath = buildPaperRootPath({ name: 'captions', ext: 'md' })
    const notesPath = buildPaperRootPath({ name: 'publication-notes', ext: 'md' })
    const manifestPath = buildPaperRootPath({ name: 'manifest', ext: 'json' })
    const indexPath = buildPaperRootPath({ name: 'index', ext: 'json' })
    const readmePath = buildPaperRootPath({ name: 'README', ext: 'md' })
    const generatedAt = new Date().toISOString()

    zip.file(captionsPath, buildPublicationCaptionsMarkdown({
      title: '验证图补充材料',
      intro: `煤层：${snapshot.value?.seam || '--'}；更新时间：${snapshotUpdatedLabel.value}；阈值模式：${thresholdMode.value}。`,
      figures
    }))
    zip.file(notesPath, buildPublicationNotesMarkdown({
      title: 'Publication Notes',
      figures
    }))
    zip.file(readmePath, buildPublicationReadmeMarkdown({
      title: '算法验证补充图导出',
      intro: '该压缩包包含论文级验证图件及其支撑元数据。',
      sourcePage: 'algorithm-validation-figures',
      manifestPath,
      indexPath,
      captionsPath,
      notesPath,
      figures
    }))
    zip.file(indexPath, JSON.stringify(buildPublicationIndexDocument({
      title: '算法验证补充图导出',
      generatedAt,
      sourcePage: 'algorithm-validation-figures',
      manifestPath,
      captionsPath,
      notesPath,
      readmePath,
      figures
    }), null, 2))

    zip.file(manifestPath, JSON.stringify(buildPaperManifest({
      sourcePage: 'algorithm-validation-figures',
      title: '算法验证补充图导出',
      locale: 'zh-CN',
      context: {
        seam: snapshot.value?.seam || '',
        updated_at: snapshot.value?.updated_at || '',
        threshold_mode: thresholdMode.value,
        layout_columns: layoutColumns.value,
        density: density.value,
        chart_scale: chartScale.value
      },
      figures,
      artifacts: [
        buildPaperArtifact({ name: 'captions', path: captionsPath }),
        buildPaperArtifact({ name: 'publication_notes', path: notesPath }),
        buildPaperArtifact({ name: 'index', path: indexPath }),
        buildPaperArtifact({ name: 'readme', path: readmePath }),
        buildPaperArtifact({ name: 'manifest', path: manifestPath })
      ],
      notes: [`exported_count=${exportedCount}`],
      generatedAt
    }), null, 2))

    const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    const zipName = buildPaperSupplementZipName({
      topic: 'Validation',
      timestampTag: buildPaperTimestampTag()
    })
    triggerDownload(zipBlob, zipName)
    toast.success(`Exported validation supplement with ${exportedCount} figures.`)
  } catch (error) {
    toast.error(error?.message || 'Validation supplement export failed.')
  } finally {
    exportingPack.value = false
  }
}

onMounted(() => {
  loadLayoutPrefs()
  loadSnapshot()
})
</script>

<style scoped>
.figures-page {
  display: grid;
  gap: 12px;
}

.page-header {
  border: 1px solid #d8e6e3;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 12px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
}

.icon-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #334155;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.title-wrap h1 {
  margin: 0;
  font-size: 20px;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
  color: #0f172a;
}

.title-wrap p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #475569;
}

.header-actions {
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.publication-frame {
  display: grid;
  gap: 10px;
  margin-bottom: 12px;
  padding: 14px 16px;
  border: 1px solid #dbe4ea;
  border-radius: 12px;
  background: linear-gradient(180deg, #f8fbfc 0%, #ffffff 100%);
}

.figure-heading-band {
  display: grid;
  gap: 4px;
}

.figure-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.figure-heading-band h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.15;
  color: #0f172a;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
}

.figure-heading-band p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #475569;
  max-width: 980px;
}

.publication-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.publication-summary-card {
  display: grid;
  gap: 5px;
  padding: 10px 12px;
  border: 1px solid #dbe4ea;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.88);
}

.publication-summary-card .label {
  font-size: 11px;
  color: #64748b;
}

.publication-summary-card strong {
  font-size: 14px;
  color: #0f172a;
}

.methods-footer {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: #526071;
}

.figures-panel {
  border-radius: 12px;
  border: 1px solid #d8e6e3;
  background: #fff;
  padding: 12px;
}

.meta-line {
  margin-bottom: 8px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #475569;
}

.layout-toolbar {
  margin-bottom: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  padding: 8px 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.toolbar-group {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.toolbar-label {
  font-size: 12px;
  color: #334155;
  font-weight: 600;
}

.chip-btn,
.tool-btn {
  height: 28px;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #fff;
  color: #334155;
  font-size: 12px;
  padding: 0 10px;
  cursor: pointer;
  transition: all 0.16s ease;
}

.tool-btn {
  height: 32px;
}

.chip-btn:hover,
.tool-btn:hover {
  border-color: #94a3b8;
}

.chip-btn.active,
.tool-btn.secondary {
  border-color: #0f766e;
  background: #ecfeff;
  color: #134e4a;
}

.chip-btn:disabled,
.tool-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.scale-group {
  margin-left: auto;
}

.selector-group {
  width: 100%;
}

.scale-slider {
  width: 140px;
}

.scale-value {
  min-width: 42px;
  text-align: right;
  font-size: 12px;
  color: #0f172a;
  font-variant-numeric: tabular-nums;
}

.active-figure-caption {
  display: grid;
  gap: 10px;
  margin-bottom: 12px;
  padding: 14px 16px;
  border: 1px solid #dbe4ea;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbfc 100%);
}

.caption-head {
  display: grid;
  gap: 4px;
}

.caption-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
}

.caption-head h3 {
  margin: 0;
  font-size: 18px;
  line-height: 1.35;
  color: #0f172a;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'Times New Roman', serif;
}

.caption-summary {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #334155;
}

.caption-notes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;
  font-size: 12px;
  line-height: 1.6;
  color: #475569;
}

.empty-state {
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  background: #fff;
  padding: 16px;
  display: grid;
  gap: 8px;
}

.empty-state h3 {
  margin: 0;
  font-size: 16px;
  color: #0f172a;
}

.empty-state p {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

@media (max-width: 760px) {
  .page-header {
    grid-template-columns: auto 1fr;
  }

  .header-actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }

  .scale-group {
    width: 100%;
    margin-left: 0;
  }

  .selector-group {
    width: 100%;
  }

  .scale-slider {
    width: 110px;
  }

  .publication-summary-grid,
  .caption-notes {
    grid-template-columns: 1fr;
  }
}
</style>
