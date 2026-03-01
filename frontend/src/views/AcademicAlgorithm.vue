<template>
  <div class="page academic-algorithm-page">
    <PageHeader
      class="main-header"
      :title="aa('pageTitle')"
      :description="aa('pageSubtitle')"
    >
      <template #actions>
        <div class="header-actions">
          <div class="mode-tabs">
            <button :class="['mode-tab', { active: activeTab === 'principle' }]" @click="activeTab = 'principle'">{{ aa('tabPrinciple') }}</button>
            <button :class="['mode-tab', { active: activeTab === 'calculation' }]" @click="activeTab = 'calculation'">{{ aa('tabCalculation') }}</button>
          </div>
        </div>
      </template>
    </PageHeader>

    <template v-if="activeTab === 'principle'">
      <Suspense>
        <template #default>
          <div class="tab-stack">
            <AcademicPrincipleIntro
              :aa="aa"
              :newcomer-journey="newcomerJourney"
              :flow-nodes="flowNodes"
              :active-flow-node="activeFlowNode"
              @update:active-flow-node="activeFlowNode = $event"
              @update:active-algo="activeAlgo = $event"
            />

            <AcademicIndicatorsPanel
              :aa="aa"
              :algorithms="algorithms"
              :active-algo="activeAlgo"
              :rendered-formulas="renderedFormulas"
              :evidence="evidence"
              :posterior-probs="posteriorProbs"
              :prob-color="probColor"
              @update:active-algo="activeAlgo = $event"
              @update:evidence="updateEvidence"
            />
          </div>
        </template>
        <template #fallback>
          <SkeletonPanel :rows="7" />
        </template>
      </Suspense>
    </template>

    <template v-if="activeTab === 'calculation'">
      <Suspense>
        <template #default>
          <div class="tab-stack">
            <AcademicCalcDashboard
              :aa="aa"
              :indicators="indicators"
              :value-class="valueClass"
              :progress-color="progressColor"
            />

            <AcademicCalculationModules
              :aa="aa"
              :strata-data="strataData"
              :microseismic-data="microseismicData"
              :tunnel-params="tunnelParams"
              :weight-items="weightItems"
              :weights="weights"
              :normalized-weights="normalizedWeights"
              :calculating="calculating"
              :results="results"
              :value-class="valueClass"
              :set-rsi-chart-ref="setRsiChartRef"
              :set-bri-chart-ref="setBriChartRef"
              :set-asi-chart-ref="setAsiChartRef"
              :update-tunnel-param="updateTunnelParam"
              :update-weight="updateWeight"
              @calculate-rsi="calculateRSI"
              @calculate-bri="calculateBRI"
              @calculate-asi="calculateASI"
              @calculate-comprehensive="calculateComprehensive"
            />
          </div>
        </template>
        <template #fallback>
          <SkeletonPanel :rows="8" />
        </template>
      </Suspense>
    </template>
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted, ref } from 'vue'
import axios from 'axios'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import { useI18n } from '../composables/useI18n'
import { useAcademicAlgorithmCalculations } from '../composables/useAcademicAlgorithmCalculations'
import { useAcademicFormulaRenderer } from '../composables/useAcademicFormulaRenderer'
import { PageHeader, SkeletonPanel } from '../components/library'
import {
  algorithms,
  flowNodes,
  formulas,
  newcomerJourney,
  weightItems
} from './academicAlgorithm.constants'

const AcademicCalcDashboard = defineAsyncComponent(() => import('../components/academic/AcademicCalcDashboard.vue'))
const AcademicCalculationModules = defineAsyncComponent(() => import('../components/academic/AcademicCalculationModules.vue'))
const AcademicIndicatorsPanel = defineAsyncComponent(() => import('../components/academic/AcademicIndicatorsPanel.vue'))
const AcademicPrincipleIntro = defineAsyncComponent(() => import('../components/academic/AcademicPrincipleIntro.vue'))

const API_BASE = (import.meta.env.VITE_ACADEMIC_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '')
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000
})

const { markStepDone } = useWorkspaceFlow()
const { t } = useI18n()
const aa = (key, params) => t(`academicAlgorithm.${key}`, params)

const activeTab = ref('principle')
const activeAlgo = ref('rsi')
const activeFlowNode = ref(0)

const { renderedFormulas, renderAllFormulas } = useAcademicFormulaRenderer({ formulas })

const {
  evidence,
  updateEvidence,
  posteriorProbs,
  probColor,
  indicators,
  weights,
  normalizedWeights,
  calculating,
  results,
  strataData,
  microseismicData,
  tunnelParams,
  updateTunnelParam,
  updateWeight,
  valueClass,
  progressColor,
  setRsiChartRef,
  setBriChartRef,
  setAsiChartRef,
  calculateRSI,
  calculateBRI,
  calculateASI,
  calculateComprehensive
} = useAcademicAlgorithmCalculations({
  apiClient,
  aa
})

onMounted(async () => {
  markStepDone('AcademicAlgorithm')
  await renderAllFormulas()
})
</script>

<style scoped>
.academic-algorithm-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  line-height: 1.75;
  animation: pageIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 24px;
  background: var(--bg-primary);
  padding: var(--spacing-6) var(--spacing-8);
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
}

.page-title {
  margin: 0 0 var(--spacing-1) 0;
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

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mode-tabs {
  display: flex;
  gap: 8px;
  background: var(--bg-secondary);
  padding: var(--spacing-1);
  border-radius: var(--border-radius-md);
}

.mode-tab {
  padding: var(--spacing-3) var(--spacing-5);
  border: none;
  border-radius: var(--border-radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-tab:hover {
  color: var(--text-primary);
}

.mode-tab.active {
  background: var(--bg-primary);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.card {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-5) var(--spacing-6);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0 0 var(--spacing-2) 0;
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

.overview-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.overview-text h2 {
  margin: 0 0 var(--spacing-3) 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.overview-text p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.75;
  max-width: 700px;
}

.overview-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: 999px;
  background: var(--bg-secondary);
  color: var(--color-primary);
  font-weight: 500;
  font-size: 13px;
  border: 1px solid var(--border-color);
}

@media (max-width: 1100px) {
  .page-header {
    grid-template-columns: 1fr;
  }

  .header-actions {
    justify-self: stretch;
  }
}

@media (max-width: 768px) {
  .academic-algorithm-page {
    gap: 20px;
  }

  .page-header {
    padding: var(--spacing-5) var(--spacing-6);
  }

  .page-title {
    font-size: 20px;
  }

  .overview-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .mode-tabs {
    flex-direction: column;
    width: 100%;
  }

  .mode-tab {
    text-align: center;
  }
}

@media print {
  .academic-algorithm-page {
    max-width: 100%;
  }

  .header-actions {
    display: none;
  }

  .card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid var(--border-color);
  }
}
</style>



