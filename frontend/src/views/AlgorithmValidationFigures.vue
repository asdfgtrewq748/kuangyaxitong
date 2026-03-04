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
      <button class="tool-btn" type="button" @click="goBack">{{ avf('backToValidation') }}</button>
    </header>

    <section v-if="snapshotError" class="empty-state">
      <h3>{{ avf('emptyTitle') }}</h3>
      <p>{{ snapshotError }}</p>
      <button class="tool-btn" type="button" @click="goBack">{{ avf('backToValidation') }}</button>
    </section>

    <section v-else class="figures-panel">
      <div class="meta-line">
        <span>{{ avf('seam') }} {{ snapshot?.seam || '--' }}</span>
        <span>{{ avf('updatedAt') }} {{ snapshotUpdatedLabel }}</span>
      </div>
      <div class="layout-toolbar">
        <div class="toolbar-group">
          <span class="toolbar-label">列数</span>
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
          <span class="toolbar-label">密度</span>
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
          <span class="toolbar-label">图表缩放</span>
          <input
            v-model.number="chartScale"
            class="scale-slider"
            type="range"
            min="85"
            max="130"
            step="1"
          />
          <span class="scale-value">{{ chartScale }}%</span>
          <button type="button" class="chip-btn" @click="resetLayoutControls">重置</button>
        </div>
      </div>
      <ValidationScienceFigures
        :result="snapshot?.result || null"
        :evaluation="snapshot?.evaluation || null"
        :columns="layoutColumns"
        :density="density"
        :chart-scale="chartScale"
      />
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ValidationScienceFigures from '../components/validation/ValidationScienceFigures.vue'
import { useI18n } from '../composables/useI18n'

const SCIENCE_SNAPSHOT_KEY = 'algorithm_validation_science_snapshot_v1'
const SCIENCE_LAYOUT_PREF_KEY = 'algorithm_validation_figures_layout_v1'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const avf = (key, params) => t(`algorithmValidationFigures.${key}`, params)

const snapshot = ref(null)
const snapshotError = ref('')
const layoutColumns = ref('auto')
const density = ref('balanced')
const chartScale = ref(100)

const columnModes = [
  { value: 'auto', label: '自适应' },
  { value: 1, label: '1列' },
  { value: 2, label: '2列' }
]

const densityModes = [
  { value: 'compact', label: '紧凑' },
  { value: 'balanced', label: '均衡' },
  { value: 'focus', label: '沉浸' }
]

const snapshotUpdatedLabel = computed(() => {
  const raw = snapshot.value?.updated_at
  if (!raw) return '--'
  const ts = Date.parse(String(raw))
  if (!Number.isFinite(ts)) return '--'
  return new Date(ts).toLocaleString()
})

const normalizeQuerySeam = (value) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value : ''
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

.chip-btn {
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

.chip-btn:hover {
  border-color: #94a3b8;
}

.chip-btn.active {
  border-color: #0f766e;
  background: #ecfeff;
  color: #134e4a;
}

.scale-group {
  margin-left: auto;
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

  .page-header .tool-btn {
    grid-column: 1 / -1;
  }

  .scale-group {
    width: 100%;
    margin-left: 0;
  }

  .scale-slider {
    width: 110px;
  }
}
</style>
