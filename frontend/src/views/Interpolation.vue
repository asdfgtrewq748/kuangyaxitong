<template>
  <div class="page interp-page">
    <!-- Header -->
    <div class="header interp-header">
      <div class="header-content">
        <div class="header-title-group">
          <h2>{{ ip('title') }}</h2>
          <span class="header-subtitle">{{ ip('subtitle') }}</span>
        </div>
        <div class="muted">{{ selectedSeam?.name || ip('selectSeamHint') }}</div>
      </div>
      <div v-if="selectedSeam && seamStats" class="header-stats">
        <div class="stat-badge">
          <span class="stat-label">{{ ip('statThicknessRange') }}</span>
          <strong>{{ seamStats?.thickness?.min?.toFixed(2) || '-' }} – {{ seamStats?.thickness?.max?.toFixed(2) || '-' }} m</strong>
        </div>
        <div class="stat-badge primary">
          <span class="stat-label">{{ ip('statAvgThickness') }}</span>
          <strong>{{ seamStats?.thickness?.mean?.toFixed(2) || '-' }} m</strong>
        </div>
        <div class="stat-badge">
          <span class="stat-label">{{ ip('statBoreholeCount') }}</span>
          <strong>{{ seamStats?.borehole_count || seamPoints.length || '-' }}</strong>
        </div>
      </div>
    </div>

    <!-- Seam Selection View -->
    <div v-if="!selectedSeam" class="card seam-select-card">
      <h3 class="section-title">
        <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
        {{ ip('selectSeamTitle') }}
      </h3>
      <p class="section-desc">{{ ip('selectSeamDesc') }}</p>

      <div class="seam-selection-grid">
        <div
          v-for="(seam, idx) in availableSeams"
          :key="seam.name"
          class="seam-selection-card"
          :style="{ animationDelay: `${idx * 0.05}s` }"
          @click="selectSeam(seam)"
        >
          <div class="seam-card-indicator"></div>
          <div class="seam-card-body">
            <div class="seam-card-header">
              <span class="seam-name">{{ seam.name }}</span>
              <span class="seam-count">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="2"/><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                {{ ip('boreholeCount', { count: seam.borehole_count }) }}
              </span>
            </div>
            <div class="seam-card-stats">
              <div class="mini-stat">
                <span class="mini-stat-label">{{ ip('avgThickness') }}</span>
                <span class="mini-stat-value">{{ seam.avg_thickness?.toFixed(2) }} m</span>
              </div>
              <div class="mini-stat-divider"></div>
              <div class="mini-stat">
                <span class="mini-stat-label">{{ ip('thicknessRange') }}</span>
                <span class="mini-stat-value">{{ seam.thickness_range?.min?.toFixed(1) }}–{{ seam.thickness_range?.max?.toFixed(1) }} m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard -->
    <div v-else class="grid interp-grid">
      <!-- Card 1: Interpolation Parameters (Refactored with collapsible groups) -->
      <div class="card params-card compact-card">
        <h3 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6"></path>
            <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"></path>
            <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"></path>
          </svg>
          {{ ip('paramsSection') }}
        </h3>

        <!-- Method Group -->
        <div class="control-group">
          <div class="control-group-header" @click="collapsedSections.method = !collapsedSections.method">
            <span class="control-group-title">{{ ip('groupMethod') }}</span>
            <span class="control-group-hint" :title="ip('tooltipMethod')">ⓘ</span>
            <svg class="chevron" :class="{ rotated: !collapsedSections.method }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <transition name="collapse">
            <div v-show="!collapsedSections.method" class="control-group-content">
              <div class="method-buttons">
                <button
                  v-for="opt in methodOptions"
                  :key="opt.key"
                  :class="['method-btn', { active: method === opt.key }]"
                  @click="method = opt.key"
                >
                  <span class="method-btn-label">{{ opt.label }}</span>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Grid Settings Group -->
        <div class="control-group">
          <div class="control-group-header" @click="collapsedSections.grid = !collapsedSections.grid">
            <span class="control-group-title">{{ ip('groupGrid') }}</span>
            <svg class="chevron" :class="{ rotated: !collapsedSections.grid }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <transition name="collapse">
            <div v-show="!collapsedSections.grid" class="control-group-content">
              <div class="param-row">
                <label class="param-label">{{ ip('gridSize') }}</label>
                <span class="param-value-badge">{{ gridSize }}</span>
              </div>
              <div class="slider-track">
                <input v-model.number="gridSize" type="range" min="30" max="150" step="10" class="slider">
              </div>
              <div class="slider-labels">
                <span>{{ ip('sliderCoarse') }}</span>
                <span>{{ ip('sliderFine') }}</span>
              </div>

              <div class="param-row">
                <label class="param-label">{{ ip('contourLevels') }}</label>
                <span class="param-value-badge">{{ contourLevels }}</span>
              </div>
              <div class="slider-track">
                <input v-model.number="contourLevels" type="range" min="5" max="20" step="1" class="slider">
              </div>
              <div class="slider-labels">
                <span>{{ ip('sliderLow') }}</span>
                <span>{{ ip('sliderHigh') }}</span>
              </div>

              <!-- Smart Recommendation -->
              <div v-if="recommendedParams" class="param-recommendation">
                <div class="recommendation-text">
                  推荐: 网格 {{ recommendedParams.gridSize }}, 等值线 {{ recommendedParams.contourLevels }}
                </div>
                <button class="btn secondary small" @click="applyRecommendedParams">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                  应用推荐
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Render Settings Group -->
        <div class="control-group">
          <div class="control-group-header" @click="collapsedSections.render = !collapsedSections.render">
            <span class="control-group-title">{{ ip('groupRender') }}</span>
            <span class="control-group-hint" :title="ip('tooltipRenderQuality')">ⓘ</span>
            <svg class="chevron" :class="{ rotated: !collapsedSections.render }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <transition name="collapse">
            <div v-show="!collapsedSections.render" class="control-group-content">
              <div class="quality-buttons">
                <button
                  v-for="opt in renderQualityOptions"
                  :key="opt.key"
                  :class="['quality-btn', { active: renderQuality === opt.key }]"
                  @click="renderQuality = opt.key"
                >
                  {{ opt.label }}
                </button>
              </div>
              <p class="param-hint">{{ ip('renderQualityHint') }}</p>
            </div>
          </transition>
        </div>

        <!-- Advanced Options Group -->
        <div class="control-group" v-if="thicknessResult">
          <div class="control-group-header" @click="collapsedSections.advanced = !collapsedSections.advanced">
            <span class="control-group-title">{{ ip('groupAdvanced') }}</span>
            <span class="control-group-hint" :title="ip('tooltipCrossSection')">ⓘ</span>
            <svg class="chevron" :class="{ rotated: !collapsedSections.advanced }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <transition name="collapse">
            <div v-show="!collapsedSections.advanced" class="control-group-content">
              <label class="toggle-btn" style="width: 100%">
                <input type="checkbox" v-model="crossSectionMode">
                <span>{{ ip('drawProfile') }}</span>
              </label>
              <p v-if="crossSectionMode" class="hint-text">{{ ip('drawProfileHint') }}</p>
            </div>
          </transition>
        </div>

        <!-- Geomodel Group -->
        <div class="control-group geomodel-group">
          <div class="control-group-header" @click="collapsedSections.geomodel = !collapsedSections.geomodel">
            <span class="control-group-title">{{ ip('groupGeomodel') }}</span>
            <span class="control-group-hint" :title="ip('tooltipGeomodel')">ⓘ</span>
            <svg class="chevron" :class="{ rotated: !collapsedSections.geomodel }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          <transition name="collapse">
            <div v-show="!collapsedSections.geomodel" class="control-group-content">
              <div class="geomodel-controls">
                <select v-model="geomodelMethod" class="geomodel-select">
                  <option
                    v-for="opt in geomodelMethodOptions"
                    :key="opt.key"
                    :value="opt.key"
                  >
                    {{ opt.label }}
                  </option>
                </select>
                <div class="geomodel-range">
                  <label>{{ ip('geomodelResolution') }}</label>
                  <input v-model.number="geomodelResolution" type="number" min="1" max="500" step="1">
                </div>
                <button class="btn outline geomodel-btn" @click="startGeomodelJob" :disabled="geomodelSubmitting">
                  {{ geomodelSubmitting ? ip('geomodelSubmitting') : ip('geomodelSubmit') }}
                </button>
              </div>

              <div v-if="geomodelJob" class="geomodel-status">
                <span>{{ ip('geomodelStatus') }}: {{ geomodelJob.status }}</span>
                <span v-if="geomodelPolling">{{ ip('geomodelPolling') }}</span>
                <span v-if="geomodelJob.message">{{ geomodelJob.message }}</span>
              </div>
              <p v-if="geomodelError" class="geomodel-error">{{ geomodelError }}</p>

              <div v-if="geomodelQualitySummary" class="geomodel-summary">
                <div class="summary-item">
                  <span>{{ ip('geomodelContinuity') }}</span>
                  <strong>{{ Number(geomodelQualitySummary.continuity_score || 0).toFixed(3) }}</strong>
                </div>
                <div class="summary-item">
                  <span>{{ ip('geomodelPinchoutRatio') }}</span>
                  <strong>{{ Number(geomodelQualitySummary.pinchout_ratio || 0).toFixed(3) }}</strong>
                </div>
                <div class="summary-item">
                  <span>{{ ip('geomodelLayerCv') }}</span>
                  <strong>{{ Number(geomodelQualitySummary.layer_cv || 0).toFixed(3) }}</strong>
                </div>
              </div>

              <div class="geomodel-files" v-if="geomodelArtifacts.length">
                <button
                  v-for="artifact in geomodelArtifacts"
                  :key="artifact.name"
                  class="file-chip"
                  @click="downloadGeomodelFile(artifact.name)"
                >
                  {{ artifact.name }}
                </button>
              </div>
            </div>
          </transition>
        </div>

        <div class="action-buttons">
          <button class="btn primary" @click="handleInterpolate({ forceRefresh: true, silent: false })" :disabled="loading">
            <svg v-if="!loading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span v-if="loading" class="spinner sm"></span>
            {{ loading ? ip('computing') : ip('generateContours') }}
          </button>
          <button class="btn outline" @click="selectedSeam = null; thicknessResult = null; depthResult = null">
            {{ ip('changeSeam') }}
          </button>
          <button
            v-if="thicknessResult || depthResult"
            class="btn outline"
            @click="goPressureAnalysis"
          >
            {{ ip('nextStep') }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
        <p v-if="interpolationStatus" class="status-text">{{ interpolationStatus }}</p>
      </div>

      <!-- Card 2: Data Distribution -->
      <div class="card compact-card data-dist-card">
        <h3 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          {{ ip('dataDistSection') }}
        </h3>
        <div v-if="seamPoints.length > 0" class="figure-wrapper">
          <canvas ref="histogramCanvas" class="figure-canvas histogram-canvas"></canvas>
        </div>
        <div v-else class="empty-state-panel">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <p>{{ ip('noDataDist') }}</p>
        </div>
        <!-- 统计信息 -->
        <div v-if="seamPoints.length > 0" class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">{{ ip('sampleCount') }}</span>
            <span class="stat-value">{{ seamThicknessStats.count }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ ip('meanValue') }}</span>
            <span class="stat-value">{{ seamThicknessStats.mean.toFixed(2) }}m</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ ip('stdDev') }}</span>
            <span class="stat-value">{{ seamThicknessStats.stdDev.toFixed(2) }}m</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ ip('cv') }}</span>
            <span class="stat-value">{{ seamThicknessStats.cv.toFixed(2) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ ip('minValue') }}</span>
            <span class="stat-value">{{ seamThicknessStats.min.toFixed(2) }}m</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ ip('maxValue') }}</span>
            <span class="stat-value">{{ seamThicknessStats.max.toFixed(2) }}m</span>
          </div>
        </div>
      </div>

      <!-- Card 3: Lithology Column -->
      <div class="card compact-card strat-card">
        <h3 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="m2 17 10 5 10-5"></path>
            <path d="m2 12 10 5 10-5"></path>
          </svg>
          {{ ip('stratSection') }}
        </h3>
        <div class="figure-wrapper strat-figure">
          <canvas ref="stratigraphicCanvas" class="figure-canvas stratigraphic-canvas"></canvas>
        </div>
        <div class="lithology-legend">
          <div class="legend-title">{{ ip('lithologyLegend') }}</div>
          <div v-for="(color, name) in lithologyColors" :key="name" class="legend-chip">
            <span class="legend-dot" :style="{ background: color }"></span>
            <span class="legend-text">{{ name }}</span>
          </div>
        </div>
      </div>

      <!-- Card 4-5: Contour Maps -->
      <div class="map-row" v-if="selectedSeam">
        <div class="card map-card-large">
          <div class="map-header">
            <div>
              <h3 class="section-title map-section-title">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                </svg>
                {{ ip('thicknessMapSection') }}
              </h3>
              <p class="section-desc map-method-desc" v-if="thicknessResult">
                <span class="method-tag">{{ methodName(method) }}</span>
                {{ thicknessResult?.valueRange?.min?.toFixed(1) }} – {{ thicknessResult?.valueRange?.max?.toFixed(1) }} m
              </p>
              <p class="section-desc" v-else>{{ ip('preparingMap', { type: ip('thicknessDist') }) }}</p>
            </div>
          </div>
          <div class="map-wrapper">
            <EChartsContourMap
              v-if="thicknessResult && seamPoints.length > 0"
              :boreholes="seamPoints"
              :bounds="thicknessResult.bounds"
              property="thickness"
              property-label="厚度"
              :value-range="thicknessResult.valueRange"
              colormap="YlOrBr"
              :cross-section-mode="crossSectionMode"
              @cross-section-complete="handleCrossSectionComplete"
            />
            <SkeletonMap
              v-else-if="loading"
              :show-progress="true"
              :progress="loadingProgress"
              :progress-text="loadingStage || ip('generatingMap', { type: ip('thicknessDist') })"
            />
            <div v-else class="map-placeholder">
              <p>{{ ip('noMapClickHint', { type: ip('thicknessDist') }) }}</p>
            </div>
          </div>
        </div>

        <div class="card map-card-large">
          <div class="map-header">
            <div>
              <h3 class="section-title map-section-title">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="m2 17 10 5 10-5"></path>
                </svg>
                {{ ip('depthMapSection') }}
              </h3>
              <p class="section-desc map-method-desc" v-if="depthResult">
                <span class="method-tag">{{ methodName(method) }}</span>
                {{ depthResult?.valueRange?.min?.toFixed(1) }} – {{ depthResult?.valueRange?.max?.toFixed(1) }} m
              </p>
              <p class="section-desc" v-else>{{ ip('preparingMap', { type: ip('depthDist') }) }}</p>
            </div>
          </div>
          <div class="map-wrapper">
            <EChartsContourMap
              v-if="depthResult && seamPoints.length > 0"
              :boreholes="seamPoints"
              :bounds="depthResult.bounds"
              property="burial_depth"
              property-label="埋深"
              :value-range="depthResult.valueRange"
              colormap="viridis"
              :cross-section-mode="crossSectionMode"
              @cross-section-complete="handleCrossSectionComplete"
            />
            <SkeletonMap
              v-else-if="loading"
              :show-progress="true"
              :progress="loadingProgress"
              :progress-text="loadingStage || ip('generatingMap', { type: ip('depthDist') })"
            />
            <div v-else class="map-placeholder">
              <p>{{ ip('noMapClickHint', { type: ip('depthDist') }) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Uncertainty Map -->
      <div class="card map-card-full" v-if="selectedSeam">
        <div class="map-header">
          <div>
            <h3 class="section-title map-section-title">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {{ ip('uncertaintyMapSection') }}
            </h3>
            <p class="section-desc">
              <span class="uncertainty-high">■</span> {{ ip('uncertaintyHigh') }} &nbsp;
              <span class="uncertainty-low">■</span> {{ ip('uncertaintyLow') }}
            </p>
          </div>
        </div>
        <div class="map-wrapper uncertainty-wrapper">
          <canvas v-if="thicknessResult" ref="uncertaintyCanvas" class="uncertainty-canvas"></canvas>
          <SkeletonMap
            v-else-if="loading"
            :show-progress="true"
            :progress="loadingProgress"
            :progress-text="loadingStage || ip('generatingMap', { type: ip('uncertaintyMapSection') })"
          />
          <div v-else class="map-placeholder">
            <p>{{ ip('noContoursYet') }}</p>
          </div>
        </div>
      </div>

      <!-- Cross Section Profile -->
      <div class="card map-card-full cross-section-card" v-if="crossSectionData.hasData">
        <div class="map-header">
          <div>
            <h3 class="section-title map-section-title">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
              {{ ip('crossSectionSection') }}
              <span class="section-badge">{{ ip('crossSectionDistance', { distance: crossSectionData.distance?.toFixed(0) }) }}</span>
            </h3>
          </div>
          <button class="btn outline small" @click="resetCrossSection">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            {{ ip('resetCrossSection') }}
          </button>
        </div>
        <div class="cross-section-wrapper">
          <canvas ref="crossSectionCanvas" class="cross-section-canvas"></canvas>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '../composables/useI18n'
import { useToast } from '../composables/useToast'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import { useGeomodelJob } from '../composables/useGeomodelJob'
import EChartsContourMap from '../components/EChartsContourMap.vue'
import SkeletonMap from '../components/SkeletonMap.vue'
import {
  downloadGeomodelArtifact,
  getCoalSeams,
  getSeamOverburden,
  getSeamContourImages
} from '../api'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const ip = (key, params) => t(`interpolation.${key}`, params)
const { workspaceState, setSelectedSeam, markStepDone } = useWorkspaceFlow()

// State
const loadingSeams = ref(false)
const seamError = ref(null)
const loading = ref(false)
const loadingProgress = ref(0)
const loadingStage = ref('')
const availableSeams = ref([])
const selectedSeam = ref(null)
const seamStats = ref(null)
const seamPoints = ref([])
const sortedLayers = ref([])
const method = ref('kriging')
const gridSize = ref(80)
const contourLevels = ref(10)
const renderQuality = ref('standard')
const interpolationStatus = ref('')
const thicknessResult = ref(null)
const depthResult = ref(null)
const crossSectionMode = ref(false)

// Cross section
const crossSectionData = ref({ line: null, points: [], depthProfile: [], distance: null, hasData: false })
const uncertaintyData = ref(null)

// Auto-save key
const STORAGE_KEY = 'interpolation-params-v1'

// Smart parameter recommendations
const recommendedParams = computed(() => {
  const count = seamPoints.value.length
  if (count === 0) return null

  // Recommend grid size based on borehole count
  let recommendedGrid = 60
  if (count < 10) recommendedGrid = 40
  else if (count < 20) recommendedGrid = 60
  else if (count < 50) recommendedGrid = 80
  else recommendedGrid = 100

  // Recommend contour levels based on data range
  const thicknesses = seamPoints.value.map(p => p.thickness).filter(v => v != null)
  const range = thicknesses.length > 0 ? Math.max(...thicknesses) - Math.min(...thicknesses) : 0
  let recommendedLevels = 10
  if (range < 2) recommendedLevels = 6
  else if (range < 5) recommendedLevels = 10
  else recommendedLevels = 14

  return {
    gridSize: recommendedGrid,
    contourLevels: recommendedLevels,
    method: count < 15 ? 'idw' : 'kriging' // Use IDW for sparse data, Kriging for dense
  }
})

const applyRecommendedParams = () => {
  const rec = recommendedParams.value
  if (!rec) return

  gridSize.value = rec.gridSize
  contourLevels.value = rec.contourLevels
  method.value = rec.method
  toast.success(`已应用推荐参数: 网格 ${rec.gridSize}, 等值线 ${rec.contourLevels}, ${rec.method === 'kriging' ? '克里金' : 'IDW'}插值`)
}

// Load saved parameters from localStorage
const loadSavedParams = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const params = JSON.parse(saved)
      if (params.method) method.value = params.method
      if (params.gridSize) gridSize.value = params.gridSize
      if (params.contourLevels) contourLevels.value = params.contourLevels
      if (params.renderQuality) renderQuality.value = params.renderQuality
      if (params.collapsedSections) {
        collapsedSections.value = { ...collapsedSections.value, ...params.collapsedSections }
      }
    }
  } catch (e) {
    console.warn('Failed to load saved params:', e)
  }
}

// Save parameters to localStorage
const saveParams = () => {
  try {
    const params = {
      method: method.value,
      gridSize: gridSize.value,
      contourLevels: contourLevels.value,
      renderQuality: renderQuality.value,
      collapsedSections: collapsedSections.value,
      timestamp: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params))
  } catch (e) {
    console.warn('Failed to save params:', e)
  }
}

// Canvas refs
const histogramCanvas = ref(null)
const crossSectionCanvas = ref(null)
const stratigraphicCanvas = ref(null)
const uncertaintyCanvas = ref(null)

// Collapsible sections state
const collapsedSections = ref({
  method: false,
  grid: false,
  render: false,
  advanced: false,
  geomodel: true,
  maps: false
})

// Geomodel state
const geomodelMethod = ref('thickness')
const geomodelResolution = ref(20)
const geomodelMethodOptions = computed(() => [
  { key: 'thickness', label: ip('geomodelMethodThickness') },
  { key: 'hybrid', label: ip('geomodelMethodHybrid') },
  { key: 'regression_kriging', label: ip('geomodelMethodRegressionKriging') },
  { key: 'smart_pinchout', label: ip('geomodelMethodSmartPinchout') }
])

const {
  jobId: geomodelJobId,
  job: geomodelJob,
  artifacts: geomodelArtifacts,
  loading: geomodelSubmitting,
  polling: geomodelPolling,
  error: geomodelError,
  submit: submitGeomodelJob,
  refresh: refreshGeomodelJob
} = useGeomodelJob()

// Options
const methodOptions = computed(() => [
  { key: 'kriging', label: ip('methodKriging') },
  { key: 'idw', label: ip('methodIdw') },
  { key: 'linear', label: ip('methodLinear') },
  { key: 'nearest', label: ip('methodNearest') }
])

const renderQualityOptions = computed(() => [
  { key: 'fast', label: ip('renderFast') },
  { key: 'standard', label: ip('renderStandard') },
  { key: 'high', label: ip('renderHigh') }
])

const renderQualityConfig = computed(() => ({
  fast: { dpi: 120, smoothSigma: 0.75, label: ip('renderFast') },
  standard: { dpi: 200, smoothSigma: 1.15, label: ip('renderStandard') },
  high: { dpi: 300, smoothSigma: 1.35, label: ip('renderHigh') }
}))

const LAST_CONTOUR_CACHE_KEY = 'interpolation:lastContour:v1'
const UNCERTAINTY_RESOLUTION_BASE = { fast: 72, standard: 96, high: 128 }
const FIGURE_STYLE = {
  textColor: '#111827',
  subTextColor: '#475569',
  axisColor: '#1f2937',
  gridColor: 'rgba(148, 163, 184, 0.28)',
  panelBorder: '#cbd5e1',
  fontFamily: "'Helvetica Neue', Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif",
  monoFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace"
}

let interpolateRequestToken = 0
let seamSelectionToken = 0
let uncertaintyIdleHandle = null
let uncertaintyTimer = null

// Lithology colors (Nature style - matching Python script)
const lithologyColors = {
  '细砂岩': '#FCEBB6',      // Sandstone - light yellow
  '粉砂岩': '#E0FFFF',      // Siltstone - light cyan
  '泥岩': '#D3D3D3',       // Mudstone - gray
  '中砂岩': '#FCEBB6',      // Sandstone - light yellow
  '粗砂岩': '#F5DEB3',      // Coarse sandstone - wheat
  '砾岩': '#DEB887',       // Conglomerate - brown
  '炭质泥岩': '#8B8B8B',    // Carbonaceous mudstone - dark gray
  '砂质泥岩': '#D8D8D8',    // Sandy mudstone
  '泥质砂岩': '#E8E8E8',    // Muddy sandstone
  '石灰岩': '#B0E0E6',      // Limestone - light blue
  '煤': '#2F4F4F'          // Coal - dark gray
}

// Lithology styles (Nature style - matching Python script)
const lithologyStyles = {
  '细砂岩': { facecolor: '#FCEBB6', hatch: '...', edgecolor: '#999999' },  // Sandstone: yellow + dots
  '粉砂岩': { facecolor: '#E0FFFF', hatch: '...', edgecolor: '#AAAAAA' },  // Siltstone: light cyan + dots
  '泥岩': { facecolor: '#D3D3D3', hatch: '---', edgecolor: '#666666' },   // Mudstone: gray + h-lines
  '中砂岩': { facecolor: '#FCEBB6', hatch: '...', edgecolor: '#999999' },  // Sandstone
  '粗砂岩': { facecolor: '#F5DEB3', hatch: '...', edgecolor: '#999999' },  // Coarse sandstone: wheat + dots
  '砾岩': { facecolor: '#DEB887', hatch: 'ooo', edgecolor: '#8B4513' },    // Conglomerate: brown + circles
  '炭质泥岩': { facecolor: '#8B8B8B', hatch: '---', edgecolor: '#444444' },  // Carbonaceous mudstone
  '砂质泥岩': { facecolor: '#D8D8D8', hatch: '-..', edgecolor: '#777777' },  // Sandy mudstone
  '泥质砂岩': { facecolor: '#E8E8E8', hatch: '.-.', edgecolor: '#888888' },  // Muddy sandstone
  '石灰岩': { facecolor: '#B0E0E6', hatch: '+++', edgecolor: '#5F9EA0' },  // Limestone: light blue + cross
  '煤': { facecolor: '#2F4F4F', hatch: '', edgecolor: '#1a1a1a' }          // Coal: dark gray, solid
}

const methodName = (key) => {
  const names = {
    kriging: ip('methodKriging'),
    idw: ip('methodIdw'),
    linear: ip('methodLinear'),
    nearest: ip('methodNearest')
  }
  return names[key] || key
}

const figureFont = (size, weight = 400, mono = false) => {
  const family = mono ? FIGURE_STYLE.monoFamily : FIGURE_STYLE.fontFamily
  return `${weight} ${size}px ${family}`
}

const applyFigureRenderDefaults = (ctx) => {
  ctx.imageSmoothingEnabled = true
  if ('imageSmoothingQuality' in ctx) {
    ctx.imageSmoothingQuality = 'high'
  }
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

const seamThicknessValues = computed(() => {
  return seamPoints.value
    .map((p) => Number(p.thickness))
    .filter((v) => Number.isFinite(v))
})

const seamThicknessStats = computed(() => {
  const values = seamThicknessValues.value
  const count = values.length
  if (!count) {
    return { count: 0, mean: 0, stdDev: 0, cv: 0, min: 0, max: 0 }
  }

  const mean = values.reduce((sum, v) => sum + v, 0) / count
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / count
  const stdDev = Math.sqrt(variance)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const cv = mean > 0 ? (stdDev / mean) * 100 : 0

  return { count, mean, stdDev, cv, min, max }
})

const geomodelQualitySummary = computed(() => {
  return geomodelJob.value?.result_manifest?.quality_summary || null
})

const applyContourResult = (data) => {
  seamPoints.value = data?.boreholes || seamPoints.value

  if (data?.thickness?.image) {
    thicknessResult.value = {
      imageUrl: `data:image/png;base64,${data.thickness.image}`,
      valueRange: data.thickness.value_range,
      bounds: data.bounds
    }
  } else {
    thicknessResult.value = null
  }

  if (data?.depth?.image) {
    depthResult.value = {
      imageUrl: `data:image/png;base64,${data.depth.image}`,
      valueRange: data.depth.value_range,
      bounds: data.bounds
    }
  } else {
    depthResult.value = null
  }
}

const readLastContourCache = (seamName) => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(LAST_CONTOUR_CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw)
    if (!cached?.seamName || cached.seamName !== seamName) return null
    if (!cached?.data?.bounds) return null
    return cached
  } catch (err) {
    return null
  }
}

const writeLastContourCache = (seamName, data) => {
  if (typeof window === 'undefined') return
  try {
    const payload = {
      seamName,
      updatedAt: Date.now(),
      method: method.value,
      gridSize: gridSize.value,
      contourLevels: contourLevels.value,
      quality: renderQuality.value,
      data: {
        bounds: data?.bounds || null,
        boreholes: data?.boreholes || [],
        thickness: data?.thickness || null,
        depth: data?.depth || null
      }
    }
    window.sessionStorage.setItem(LAST_CONTOUR_CACHE_KEY, JSON.stringify(payload))
  } catch (err) {
    // Ignore cache errors (quota / unavailable storage).
  }
}

// Load seams
const loadSeams = async () => {
  loadingSeams.value = true
  try {
    const { data } = await getCoalSeams()
    availableSeams.value = data.seams || []
  } catch (err) {
    seamError.value = '加载煤层失败'
  } finally {
    loadingSeams.value = false
  }
}

// Select seam
const normalizeLayers = (layers = []) => {
  let cursor = 0
  return layers.map((layer) => {
    const thickness = Number(layer.thickness ?? 0) || 0
    let zTop = Number(layer.z_top)
    let zBottom = Number(layer.z_bottom)

    if (!Number.isFinite(zTop)) {
      zTop = cursor
    }
    if (!Number.isFinite(zBottom)) {
      zBottom = zTop + thickness
    }
    if (!Number.isFinite(thickness) || thickness === 0) {
      const computed = Math.max((zBottom || 0) - (zTop || 0), 0)
      if (computed > 0) {
        layer.thickness = computed
      }
    }

    cursor = zBottom
    return {
      ...layer,
      thickness: Number(layer.thickness ?? thickness) || 0,
      z_top: zTop,
      z_bottom: zBottom
    }
  })
}

const extractSeamPointsFromBoreholes = (boreholes = [], seamName = '') => {
  return (boreholes || [])
    .map((borehole) => {
      const layers = Array.isArray(borehole?.layers) ? borehole.layers : []
      const seamLayer = layers.find((layer) => String(layer?.name || '') === String(seamName))
      const thickness = Number(seamLayer?.thickness ?? borehole?.thickness ?? 0)
      const burialDepth = Number(borehole?.seam_top_depth ?? borehole?.total_overburden_thickness ?? 0)
      const x = Number(borehole?.x)
      const y = Number(borehole?.y)
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null
      return {
        ...borehole,
        x,
        y,
        thickness: Number.isFinite(thickness) ? thickness : 0,
        burial_depth: Number.isFinite(burialDepth) ? burialDepth : 0
      }
    })
    .filter(Boolean)
}

const buildSeamStatsFromPoints = (points = []) => {
  const values = points
    .map((point) => Number(point?.thickness))
    .filter((value) => Number.isFinite(value))

  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 0
  const mean = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0

  return {
    borehole_count: points.length,
    thickness: { min, max, mean },
    points
  }
}

const selectSeam = async (seam) => {
  const currentSelectionToken = ++seamSelectionToken
  selectedSeam.value = seam
  setSelectedSeam(seam?.name || '')
  thicknessResult.value = null
  depthResult.value = null
  sortedLayers.value = []
  interpolationStatus.value = ''

  try {
    const cached = readLastContourCache(seam.name)
    if (cached?.data) {
      applyContourResult(cached.data)
      interpolationStatus.value = '已加载上次缓存结果，正在后台刷新...'
      await nextTick()
      scheduleUncertaintyCalculation()
    }

    const overburdenResult = await getSeamOverburden(seam.name)
    if (currentSelectionToken !== seamSelectionToken) return
    const overburdenBoreholes = overburdenResult?.data?.boreholes || []

    const fallbackPoints = extractSeamPointsFromBoreholes(overburdenBoreholes, seam.name)
    seamPoints.value = fallbackPoints
    seamStats.value = buildSeamStatsFromPoints(seamPoints.value)

    if (!seamPoints.value.length) {
      throw new Error('当前煤层没有可用钻孔点，无法生成插值图。')
    }

    // Draw histogram first and start fast interpolation immediately.
    await nextTick()
    drawHistogram()
    markStepDone('Interpolation', {
      interpolationPoints: seamPoints.value.length || 0
    })
    void handleInterpolate({ presetKey: 'fast', forceRefresh: false, silent: true, autoMode: true })

    // Load stratigraphic data in background to avoid blocking first paint.
    void (async () => {
      if (currentSelectionToken !== seamSelectionToken) return
      const boreholes = overburdenBoreholes
      const best = boreholes.reduce((acc, cur) => {
        const accLen = acc?.layers?.length || 0
        const curLen = cur?.layers?.length || 0
        return curLen > accLen ? cur : acc
      }, boreholes[0])
      const layers = normalizeLayers(best?.layers || [])
      sortedLayers.value = layers.sort((a, b) => (a.z_top || 0) - (b.z_top || 0))
      await nextTick()
      drawStratigraphicColumn()
    })()
  } catch (err) {
    if (currentSelectionToken !== seamSelectionToken) return
    toast.add('加载煤层详情失败: ' + (err.response?.data?.detail || err.message), 'error')
  }
}

const startGeomodelJob = async () => {
  if (!selectedSeam.value?.name) {
    toast.add('请先选择煤层后再发起建模任务', 'warning')
    return
  }
  try {
    await submitGeomodelJob({
      method: geomodelMethod.value,
      seam_name: selectedSeam.value.name,
      resolution: geomodelResolution.value,
      output_formats: ['vtk', 'vtp', 'summary', 'quality']
    })
    toast.add('建模任务已提交，正在后台计算', 'success')
  } catch (err) {
    toast.add(geomodelError.value || '建模任务提交失败', 'error')
  }
}

const downloadGeomodelFile = async (artifactName) => {
  if (!geomodelJobId.value) return
  try {
    const response = await downloadGeomodelArtifact(geomodelJobId.value, artifactName)
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = artifactName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (err) {
    toast.add(err?.response?.data?.detail || '下载产物失败', 'error')
  }
}

// Interpolate
const handleInterpolate = async (options = {}) => {
  if (!selectedSeam.value) return

  const {
    presetKey = renderQuality.value,
    forceRefresh = false,
    silent = false,
    autoMode = false
  } = options

  const preset = renderQualityConfig.value[presetKey] || renderQualityConfig.value.standard
  const seamName = selectedSeam.value.name
  const requestToken = ++interpolateRequestToken
  loading.value = true
  loadingProgress.value = 0
  loadingStage.value = autoMode ? `正在生成${preset.label}预览图...` : `正在渲染${preset.label}质量结果...`

  // 模拟进度更新
  const progressInterval = setInterval(() => {
    if (loadingProgress.value < 90) {
      loadingProgress.value += Math.random() * 15
      if (loadingProgress.value > 90) loadingProgress.value = 90
    }
  }, 300)

  try {
    const { data } = await getSeamContourImages(
      seamName,
      method.value,
      gridSize.value,
      contourLevels.value,
      preset.dpi,
      preset.smoothSigma,
      { forceRefresh }
    )
    if (requestToken !== interpolateRequestToken) {
      return
    }

    applyContourResult(data)
    writeLastContourCache(seamName, data)

    // 完成进度
    clearInterval(progressInterval)
    loadingProgress.value = 100
    loadingStage.value = '渲染完成'

    // Calculate uncertainty map and draw other charts after DOM update
    await nextTick()
    scheduleUncertaintyCalculation()
    drawHistogram()
    markStepDone('Interpolation', {
      interpolationPoints: seamPoints.value.length || 0
    })
    if (!silent) {
      toast.success('等值线图生成完成')
    }
  } catch (err) {
    console.error('Interpolate error:', err)
    console.error('Error response:', err.response?.data)
    toast.add(err.response?.data?.detail || '生成等值线图失败', 'error')
  } finally {
    clearInterval(progressInterval)
    if (requestToken === interpolateRequestToken) {
      loading.value = false
      loadingProgress.value = 0
      loadingStage.value = ''
      interpolationStatus.value = ''
    }
  }
}

// Calculate uncertainty map - matching 误差分布图绘制.py style
const scheduleUncertaintyCalculation = () => {
  if (typeof window === 'undefined') {
    calculateUncertainty()
    return
  }

  if (typeof window.cancelIdleCallback === 'function' && uncertaintyIdleHandle !== null) {
    window.cancelIdleCallback(uncertaintyIdleHandle)
    uncertaintyIdleHandle = null
  }
  if (uncertaintyTimer !== null) {
    window.clearTimeout(uncertaintyTimer)
    uncertaintyTimer = null
  }

  if (typeof window.requestIdleCallback === 'function') {
    uncertaintyIdleHandle = window.requestIdleCallback(() => {
      uncertaintyIdleHandle = null
      calculateUncertainty()
    }, { timeout: 240 })
    return
  }

  uncertaintyTimer = window.setTimeout(() => {
    uncertaintyTimer = null
    calculateUncertainty()
  }, 16)
}

const calculateUncertainty = () => {
  if (!seamPoints.value.length || !thicknessResult.value) {
    return
  }

  const canvas = uncertaintyCanvas.value
  if (!canvas) {
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const hostRect = canvas.parentElement?.getBoundingClientRect()
  const cssW = Math.max(720, Math.floor(hostRect?.width || 900))
  const cssH = Math.max(420, Math.floor(hostRect?.height || 550))
  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1

  canvas.width = Math.floor(cssW * dpr)
  canvas.height = Math.floor(cssH * dpr)
  canvas.style.width = `${cssW}px`
  canvas.style.height = `${cssH}px`

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  applyFigureRenderDefaults(ctx)
  const w = cssW
  const h = cssH

  const bounds = thicknessResult.value.bounds
  const hasValidBounds = bounds &&
    Number.isFinite(bounds.min_x) &&
    Number.isFinite(bounds.max_x) &&
    Number.isFinite(bounds.min_y) &&
    Number.isFinite(bounds.max_y) &&
    bounds.max_x > bounds.min_x &&
    bounds.max_y > bounds.min_y

  if (!hasValidBounds) return

  const points = seamPoints.value
    .map((p) => ({ x: Number(p.x), y: Number(p.y) }))
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))

  if (points.length === 0) return

  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  // Draw area dimensions (matching Python script style)
  const padding = { left: 56, right: 48, top: 26, bottom: 76 }
  const drawW = w - padding.left - padding.right - 58  // Extra space for colorbar
  const drawH = h - padding.top - padding.bottom

  // Calculate uncertainty map with Gaussian smoothing
  const requestedGrid = Math.max(30, Number(gridSize.value) || 80)
  const baseResolution = UNCERTAINTY_RESOLUTION_BASE[renderQuality.value] || UNCERTAINTY_RESOLUTION_BASE.standard
  const resolution = Math.max(64, Math.min(144, Math.round((requestedGrid + baseResolution) / 2)))
  const uncertaintyMap = []

  // First pass: calculate raw distances
  const maxDist = 500  // meters
  for (let py = 0; py < resolution; py++) {
    uncertaintyMap[py] = []
    for (let px = 0; px < resolution; px++) {
      const worldX = bounds.min_x + (px / resolution) * (bounds.max_x - bounds.min_x)
      const worldY = bounds.max_y - (py / resolution) * (bounds.max_y - bounds.min_y)

      // Find minimum distance to any borehole
      let minDist = Infinity
      for (const p of points) {
        const dist = Math.sqrt((worldX - p.x)**2 + (worldY - p.y)**2)
        if (dist < minDist) minDist = dist
      }

      // Normalize to 0-1.6 (matching Python script)
      uncertaintyMap[py][px] = Math.min(1.6, (minDist / maxDist) * 1.6)
    }
  }

  // Second pass: apply Gaussian smoothing (simplified)
  const smoothedMap = []
  const sigma = renderQuality.value === 'high' ? 3 : (renderQuality.value === 'standard' ? 2.4 : 2)
  const kernelRadius = Math.max(1, Math.ceil(sigma * 2))
  for (let py = 0; py < resolution; py++) {
    smoothedMap[py] = []
    for (let px = 0; px < resolution; px++) {
      let sum = 0
      let weightSum = 0
      for (let dy = -kernelRadius; dy <= kernelRadius; dy++) {
        for (let dx = -kernelRadius; dx <= kernelRadius; dx++) {
          const ny = py + dy
          const nx = px + dx
          if (ny >= 0 && ny < resolution && nx >= 0 && nx < resolution) {
            const dist = Math.sqrt(dx*dx + dy*dy)
            const weight = Math.exp(-(dist*dist) / (2*sigma*sigma))
            const sample = uncertaintyMap[ny]?.[nx]
            if (!Number.isFinite(sample)) continue
            sum += sample * weight
            weightSum += weight
          }
        }
      }
      smoothedMap[py][px] = weightSum > 0 ? (sum / weightSum) : uncertaintyMap[py][px]
    }
  }

  // RdYlBu_r colormap function (Red=high uncertainty, Blue=low)
  const rdylbu_r = (value) => {
    // value from 0 to 1.5
    const normalized = Math.min(1.5, Math.max(0, value)) / 1.5
    // RdYlBu_r: Red (1.0) -> Yellow (0.5) -> Blue (0.0)
    if (normalized < 0.5) {
      // Blue to Yellow (0.0-0.5)
      const t = normalized * 2
      return {
        r: Math.floor(49 + (255 - 49) * t),
        g: Math.floor(130 + (255 - 130) * t),
        b: Math.floor(189 + (0 - 189) * t)
      }
    } else {
      // Yellow to Red (0.5-1.0)
      const t = (normalized - 0.5) * 2
      return {
        r: Math.floor(255 + (215 - 255) * t),
        g: Math.floor(255 + (48 - 255) * t),
        b: Math.floor(0 + (48 - 0) * t)
      }
    }
  }

  // Draw heatmap
  const cellW = drawW / resolution
  const cellH = drawH / resolution

  for (let py = 0; py < resolution; py++) {
    for (let px = 0; px < resolution; px++) {
      const value = smoothedMap[py][px]
      const color = rdylbu_r(value)
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
      ctx.fillRect(
        padding.left + px * cellW,
        padding.top + (resolution - 1 - py) * cellH,
        cellW + 1,
        cellH + 1
      )
    }
  }

  // Draw borehole points (black circles, matching Python script)
  const boreholeRadius = 6
  for (const p of points) {
    const px = padding.left + ((p.x - bounds.min_x) / (bounds.max_x - bounds.min_x)) * drawW
    const py = padding.top + ((bounds.max_y - p.y) / (bounds.max_y - bounds.min_y)) * drawH

    ctx.beginPath()
    ctx.arc(px, py, boreholeRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#000000'
    ctx.fill()
  }

  // Draw bold border (matching Python script: linewidth=2.0)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2.0
  ctx.strokeRect(padding.left, padding.top, drawW, drawH)

  // Custom legend box (bottom-left, matching Python script)
  const legendBoxX = padding.left + 20
  const legendBoxY = padding.top + drawH - 80
  const legendBoxW = 120
  const legendBoxH = 50

  // White background box with black border
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1.5
  ctx.fillRect(legendBoxX, legendBoxY, legendBoxW, legendBoxH)
  ctx.strokeRect(legendBoxX, legendBoxY, legendBoxW, legendBoxH)

  // High uncertainty color patch (red)
  ctx.fillStyle = '#d73027'
  ctx.fillRect(legendBoxX + 10, legendBoxY + 28, 15, 15)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1
  ctx.strokeRect(legendBoxX + 10, legendBoxY + 28, 15, 15)

  // Legend text
  ctx.fillStyle = FIGURE_STYLE.textColor
  ctx.font = figureFont(12)
  ctx.textAlign = 'left'
  ctx.fillText('高不确定性', legendBoxX + 32, legendBoxY + 40)

  // Borehole location dot
  ctx.beginPath()
  ctx.arc(legendBoxX + 17, legendBoxY + 18, boreholeRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#000000'
  ctx.fill()

  ctx.fillText('钻孔位置', legendBoxX + 32, legendBoxY + 22)

  // Custom scale bar (bottom-right, matching Python script)
  const scaleBoxX = padding.left + drawW - 150
  const scaleBoxY = legendBoxY
  const scaleBoxW = 130
  const scaleBoxH = 35

  // White background box
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1.5
  ctx.fillRect(scaleBoxX, scaleBoxY, scaleBoxW, scaleBoxH)
  ctx.strokeRect(scaleBoxX, scaleBoxY, scaleBoxW, scaleBoxH)

  // Scale labels
  ctx.fillStyle = FIGURE_STYLE.textColor
  ctx.font = figureFont(11)
  ctx.textAlign = 'left'
  ctx.fillText('0', scaleBoxX + 10, scaleBoxY + 22)
  ctx.textAlign = 'center'
  ctx.fillText('500', scaleBoxX + 75, scaleBoxY + 22)
  ctx.textAlign = 'right'
  ctx.fillText('1000 米', scaleBoxX + 120, scaleBoxY + 22)

  // Scale line
  const lineY = scaleBoxY + 12
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(scaleBoxX + 10, lineY)
  ctx.lineTo(scaleBoxX + 120, lineY)
  ctx.stroke()

  // Bold part (0-500)
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(scaleBoxX + 10, lineY)
  ctx.lineTo(scaleBoxX + 75, lineY)
  ctx.stroke()

  // Draw colorbar (right side, matching Python script)
  const colorbarX = padding.left + drawW + 20
  const colorbarY = padding.top
  const colorbarW = 20
  const colorbarH = drawH

  // Colorbar gradient
  for (let i = 0; i < colorbarH; i++) {
    const value = (1 - i / colorbarH) * 1.5
    const color = rdylbu_r(value)
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
    ctx.fillRect(colorbarX, colorbarY + i, colorbarW, 1)
  }

  // Colorbar border
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 1.5
  ctx.strokeRect(colorbarX, colorbarY, colorbarW, colorbarH)

  // Colorbar ticks and labels
  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(10)
  ctx.textAlign = 'left'

  const ticks = [0, 0.5, 1.0, 1.5]
  const tickLabels = ['0', '0.5', '1.0', '1.5+']

  ticks.forEach((tick, i) => {
    const y = colorbarY + colorbarH - (tick / 1.5) * colorbarH
    // Tick mark
    ctx.beginPath()
    ctx.moveTo(colorbarX + colorbarW, y)
    ctx.lineTo(colorbarX + colorbarW + 4, y)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.stroke()
    // Label
    ctx.fillText(tickLabels[i], colorbarX + colorbarW + 8, y + 4)
  })

  // Colorbar label (rotated)
  ctx.save()
  ctx.translate(colorbarX + colorbarW + 35, colorbarY + colorbarH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.font = figureFont(11, 500)
  ctx.fillText('不确定性 (归一化)', 0, 0)
  ctx.restore()

  // Title (matching Python script style)
  ctx.fillStyle = FIGURE_STYLE.textColor
  ctx.font = figureFont(13, 700)
  ctx.textAlign = 'center'
  ctx.fillText('Fig. 3 | 插值不确定性分布', padding.left + drawW / 2, h - 28)

  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(10)
  ctx.fillText('红色区域表示较高不确定性，蓝色区域表示相对可靠。', padding.left + drawW / 2, h - 12)

}

// Draw histogram - clean modern style matching AlgorithmValidation
const drawHistogram = () => {
  const canvas = histogramCanvas.value
  if (!canvas || seamPoints.value.length === 0) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const container = canvas.parentElement
  const cssW = container?.clientWidth || canvas.clientWidth || 500
  const cssH = container?.clientHeight || canvas.clientHeight || 280
  canvas.width = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)
  canvas.style.width = `${cssW}px`
  canvas.style.height = `${cssH}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const w = cssW
  const h = cssH

  const values = seamPoints.value
    .map((p) => Number(p.thickness))
    .filter((v) => Number.isFinite(v))
  if (values.length === 0) return

  // Statistics
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
  const stdDev = Math.sqrt(variance)

  const valueSpan = maxVal - minVal
  const numBins = 20
  const binWidthVal = valueSpan > 0 ? valueSpan / numBins : 1

  // Calculate bins
  const bins = Array(numBins).fill(0)
  for (const v of values) {
    const bin = Math.min(Math.floor((v - minVal) / binWidthVal), numBins - 1)
    bins[bin]++
  }
  const maxCount = Math.max(...bins)

  // Colors matching AlgorithmValidation
  const barColor = '#0f766e'
  const curveColor = '#f59e0b'
  const meanColor = '#dc2626'

  // Clear
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  const padding = { left: 48, right: 20, top: 40, bottom: 40 }
  const drawW = w - padding.left - padding.right
  const drawH = h - padding.top - padding.bottom

  const barWidth = drawW / numBins
  const scaleY = drawH / (maxCount * 1.1)

  // Draw grid lines
  ctx.strokeStyle = '#f1f5f9'
  ctx.lineWidth = 1
  for (let i = 1; i <= 4; i++) {
    const y = h - padding.bottom - (i / 4) * drawH
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(w - padding.right, y)
    ctx.stroke()
  }

  // Draw histogram bars
  for (let i = 0; i < numBins; i++) {
    const barH = bins[i] * scaleY
    const x = padding.left + i * barWidth + 1
    const y = h - padding.bottom - barH
    const bw = barWidth - 2

    if (barH > 0) {
      ctx.fillStyle = barColor
      ctx.globalAlpha = 0.8
      ctx.fillRect(x, y, bw, barH)
    }
  }
  ctx.globalAlpha = 1

  // Draw density curve
  if (stdDev > Number.EPSILON && valueSpan > 0) {
    ctx.strokeStyle = curveColor
    ctx.lineWidth = 2
    ctx.beginPath()

    const segments = 100
    for (let i = 0; i <= segments; i++) {
      const x = padding.left + (i / segments) * drawW
      const val = minVal + (i / segments) * valueSpan
      const pdf = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((val - mean) / stdDev) ** 2)
      const curveCount = pdf * values.length * binWidthVal
      const y = h - padding.bottom - curveCount * scaleY

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // Draw mean line
  if (valueSpan > 0) {
    const meanX = padding.left + ((mean - minVal) / valueSpan) * drawW
    ctx.strokeStyle = meanColor
    ctx.lineWidth = 2
    ctx.setLineDash([4, 2])
    ctx.beginPath()
    ctx.moveTo(meanX, padding.top)
    ctx.lineTo(meanX, h - padding.bottom)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // Draw axes
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding.left, padding.top)
  ctx.lineTo(padding.left, h - padding.bottom)
  ctx.lineTo(w - padding.right, h - padding.bottom)
  ctx.stroke()

  // X labels
  ctx.fillStyle = '#64748b'
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  for (let i = 0; i <= 5; i++) {
    const val = minVal + (i / 5) * (maxVal - minVal)
    const x = padding.left + (i / 5) * drawW
    ctx.fillText(val.toFixed(1), x, h - padding.bottom + 16)
  }

  // Y labels
  ctx.textAlign = 'right'
  for (let i = 0; i <= 4; i++) {
    const count = Math.round((i / 4) * (maxCount * 1.1))
    const y = h - padding.bottom - (i / 4) * drawH
    ctx.fillText(count.toString(), padding.left - 6, y + 4)
  }

  // Axis labels
  ctx.fillStyle = '#475569'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('厚度 (m)', padding.left + drawW / 2, h - 8)

  ctx.save()
  ctx.translate(16, padding.top + drawH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('频数', 0, 0)
  ctx.restore()

  // Title
  ctx.fillStyle = '#1f2937'
  ctx.font = 'bold 13px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`煤层厚度分布 (n=${values.length}, μ=${mean.toFixed(2)}m)`, padding.left, 24)
}

// Helper function to draw rounded rectangle
const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// Draw stratigraphic column - clean modern style
const drawStratigraphicColumn = () => {
  const canvas = stratigraphicCanvas.value
  if (!canvas || sortedLayers.value.length === 0) return

  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const container = canvas.parentElement
  const cssW = container?.clientWidth || canvas.clientWidth || 280
  const cssH = container?.clientHeight || canvas.clientHeight || 400
  canvas.width = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)
  canvas.style.width = `${cssW}px`
  canvas.style.height = `${cssH}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const w = cssW
  const h = cssH

  // Clean white background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  const layers = sortedLayers.value
  let totalDepth = Math.max(...layers.map(l => l.z_bottom || 0))
  if (!Number.isFinite(totalDepth) || totalDepth <= 0) {
    totalDepth = layers.reduce((sum, l) => sum + (Number(l.thickness) || 0), 0)
  }
  if (!Number.isFinite(totalDepth) || totalDepth <= 0) return

  // Simple clean layout
  const padding = { top: 20, bottom: 20, left: 10, right: 10 }
  const drawHeight = h - padding.top - padding.bottom
  const scale = drawHeight / totalDepth
  const topY = padding.top

  // Layout: depth axis | column | labels
  const axisWidth = 45
  const columnWidth = Math.max(55, Math.min(80, w * 0.28))
  const labelWidth = w - axisWidth - columnWidth - 25
  const axisX = padding.left + 30
  const columnX = axisX + 10
  const labelX = columnX + columnWidth + 8

  // Depth axis line
  ctx.strokeStyle = '#64748b'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(axisX, topY)
  ctx.lineTo(axisX, h - padding.bottom)
  ctx.stroke()

  // Depth ticks and labels
  const depthStep = Math.max(20, Math.ceil(totalDepth / 5 / 10) * 10)
  ctx.textAlign = 'right'
  ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif'

  for (let depth = 0; depth <= totalDepth; depth += depthStep) {
    const y = topY + depth * scale

    // Tick
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(axisX - 4, y)
    ctx.lineTo(axisX, y)
    ctx.stroke()

    // Label
    ctx.fillStyle = '#475569'
    ctx.fillText(`${Math.round(depth)}`, axisX - 6, y + 4)
  }

  // Unit
  ctx.save()
  ctx.translate(axisX - 28, topY + drawHeight / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#64748b'
  ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.fillText('深度 (m)', 0, 0)
  ctx.restore()

  // Column border
  const columnBottom = h - padding.bottom
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1.5
  ctx.strokeRect(columnX, topY, columnWidth, columnBottom - topY)

  // Draw layers
  layers.forEach((layer) => {
    const yTop = topY + (layer.z_top || 0) * scale
    const thickness = layer.thickness || 0
    const layerHeight = Math.max(thickness * scale, 2)

    const style = lithologyStyles[layer.name] || {
      facecolor: '#e2e8f0',
      hatch: '---',
      edgecolor: '#94a3b8'
    }

    // Fill
    ctx.fillStyle = style.facecolor
    ctx.fillRect(columnX, yTop, columnWidth, layerHeight)

    // Hatch pattern (subtle)
    if (layerHeight > 4 && style.hatch) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(columnX, yTop, columnWidth, layerHeight)
      ctx.clip()
      ctx.strokeStyle = style.edgecolor
      ctx.globalAlpha = 0.25
      ctx.lineWidth = 0.5

      const spacing = 6
      switch (style.hatch) {
        case '...':
          for (let dx = 3; dx < columnWidth; dx += spacing) {
            for (let dy = 3; dy < layerHeight; dy += spacing) {
              ctx.beginPath()
              ctx.arc(columnX + dx, yTop + dy, 0.7, 0, Math.PI * 2)
              ctx.stroke()
            }
          }
          break
        case '---':
          for (let dy = 4; dy < layerHeight; dy += spacing) {
            ctx.beginPath()
            ctx.moveTo(columnX, yTop + dy)
            ctx.lineTo(columnX + columnWidth, yTop + dy)
            ctx.stroke()
          }
          break
        case '+++':
          for (let dx = spacing; dx < columnWidth; dx += spacing) {
            for (let dy = spacing; dy < layerHeight; dy += spacing) {
              const s = 2
              ctx.beginPath()
              ctx.moveTo(columnX + dx - s, yTop + dy)
              ctx.lineTo(columnX + dx + s, yTop + dy)
              ctx.stroke()
              ctx.beginPath()
              ctx.moveTo(columnX + dx, yTop + dy - s)
              ctx.lineTo(columnX + dx, yTop + dy + s)
              ctx.stroke()
            }
          }
          break
      }
      ctx.restore()
    }

    // Layer boundary line
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(columnX, yTop)
    ctx.lineTo(columnX + columnWidth, yTop)
    ctx.stroke()

    // Label
    if (layerHeight >= 14) {
      ctx.fillStyle = '#1e293b'
      ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif'
      ctx.textAlign = 'left'
      const midY = yTop + layerHeight / 2 + 4
      ctx.fillText(layer.name, labelX, midY)
    } else if (layerHeight >= 8) {
      ctx.fillStyle = '#1e293b'
      ctx.font = '9px -apple-system, BlinkMacSystemFont, sans-serif'
      ctx.textAlign = 'left'
      const midY = yTop + layerHeight / 2 + 3
      ctx.fillText(layer.name.slice(0, 3), labelX, midY)
    }
  })

  // Bottom border
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(columnX, columnBottom)
  ctx.lineTo(columnX + columnWidth, columnBottom)
  ctx.stroke()
}

// Professional geological hatch patterns
const drawSimpleHatch = (ctx, hatch, x, y, w, h, edgeColor) => {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()

  ctx.strokeStyle = edgeColor
  ctx.lineWidth = 0.8

  const spacing = 6

  switch (hatch) {
    case '...': // Sandstone - fine dots
      ctx.fillStyle = edgeColor
      for (let dx = 2; dx < w; dx += 3) {
        for (let dy = 2; dy < h; dy += 3) {
          ctx.beginPath()
          ctx.arc(x + dx, y + dy, 0.6, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      break

    case 'ooo': // Conglomerate - circles
      ctx.strokeStyle = edgeColor
      ctx.lineWidth = 0.6
      for (let dx = spacing; dx < w; dx += spacing) {
        for (let dy = spacing; dy < h; dy += spacing) {
          ctx.beginPath()
          ctx.arc(x + dx, y + dy, 2, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
      break

    case '---': // Mudstone - horizontal lines
      ctx.strokeStyle = edgeColor
      ctx.lineWidth = 0.7
      ctx.setLineDash([3, 2])
      for (let dy = spacing/2; dy < h; dy += spacing) {
        ctx.beginPath()
        ctx.moveTo(x, y + dy)
        ctx.lineTo(x + w, y + dy)
        ctx.stroke()
      }
      ctx.setLineDash([])
      break

    case '+++': // Limestone - cross pattern
      ctx.strokeStyle = edgeColor
      ctx.lineWidth = 0.6
      for (let dx = spacing; dx < w; dx += spacing) {
        for (let dy = spacing; dy < h; dy += spacing) {
          const size = 2.5
          ctx.beginPath()
          ctx.moveTo(x + dx - size, y + dy)
          ctx.lineTo(x + dx + size, y + dy)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x + dx, y + dy - size)
          ctx.lineTo(x + dx, y + dy + size)
          ctx.stroke()
        }
      }
      break

    case '-..': // Sandy mudstone - mixed
      ctx.strokeStyle = edgeColor
      ctx.lineWidth = 0.6
      for (let dy = spacing/2; dy < h; dy += spacing * 2) {
        ctx.beginPath()
        ctx.moveTo(x, y + dy)
        ctx.lineTo(x + w, y + dy)
        ctx.stroke()
      }
      ctx.fillStyle = edgeColor
      for (let dx = 2; dx < w; dx += 4) {
        for (let dy = spacing + 1; dy < h; dy += spacing * 2) {
          ctx.beginPath()
          ctx.arc(x + dx, y + dy, 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      break

    case '.-.': // Muddy sandstone - mixed reverse
      ctx.fillStyle = edgeColor
      for (let dx = 2; dx < w; dx += 4) {
        ctx.beginPath()
        ctx.arc(x + dx, y + spacing/2, 0.5, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.strokeStyle = edgeColor
      ctx.lineWidth = 0.6
      for (let dy = spacing + 1; dy < h; dy += spacing * 2) {
        ctx.beginPath()
        ctx.moveTo(x, y + dy)
        ctx.lineTo(x + w, y + dy)
        ctx.stroke()
      }
      break

    case '///': // Diagonal lines
      ctx.strokeStyle = edgeColor
      ctx.lineWidth = 0.7
      for (let offset = -h; offset < w; offset += spacing) {
        ctx.beginPath()
        ctx.moveTo(x + offset, y + h)
        ctx.lineTo(x + offset + h, y)
        ctx.stroke()
      }
      break

    case '\\\\\\': // Reverse diagonal
      ctx.strokeStyle = edgeColor
      ctx.lineWidth = 0.7
      for (let offset = 0; offset < w + h; offset += spacing) {
        ctx.beginPath()
        ctx.moveTo(x + offset, y)
        ctx.lineTo(x + offset - h, y + h)
        ctx.stroke()
      }
      break

    default:
      ctx.strokeStyle = edgeColor
      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.2
      for (let dy = spacing/2; dy < h; dy += spacing) {
        ctx.beginPath()
        ctx.moveTo(x, y + dy)
        ctx.lineTo(x + w, y + dy)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
  }

  ctx.restore()
}

// Draw Nature-style hatch patterns (matching Python matplotlib hatches)
const drawNatureHatchPattern = (ctx, hatch, x, y, w, h, edgeColor) => {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()

  ctx.strokeStyle = edgeColor
  ctx.globalAlpha = 0.4
  ctx.lineWidth = 0.5

  const spacing = 6

  switch (hatch) {
    case '...': // Dots
    case 'ooo': // Circles
      ctx.fillStyle = edgeColor
      ctx.globalAlpha = 0.3
      for (let dx = spacing/2; dx < w; dx += spacing) {
        for (let dy = spacing/2; dy < h; dy += spacing) {
          ctx.beginPath()
          if (hatch === 'ooo') {
            // Larger circles for conglomerate
            ctx.arc(x + dx, y + dy, 2.5, 0, Math.PI * 2)
          } else {
            // Small dots
            ctx.arc(x + dx, y + dy, 1, 0, Math.PI * 2)
          }
          ctx.fill()
        }
      }
      break

    case '---': // Horizontal lines
      ctx.globalAlpha = 0.5
      for (let dy = 4; dy < h; dy += spacing) {
        ctx.beginPath()
        ctx.moveTo(x, y + dy)
        ctx.lineTo(x + w, y + dy)
        ctx.stroke()
      }
      break

    case '+++': // Cross/plus pattern
    case 'xx':  // Cross pattern
      ctx.globalAlpha = 0.3
      for (let dx = spacing/2; dx < w; dx += spacing) {
        for (let dy = spacing/2; dy < h; dy += spacing) {
          // Draw cross
          const size = 3
          ctx.beginPath()
          ctx.moveTo(x + dx - size, y + dy)
          ctx.lineTo(x + dx + size, y + dy)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x + dx, y + dy - size)
          ctx.lineTo(x + dx, y + dy + size)
          ctx.stroke()
        }
      }
      break

    case '-..': // Dash-dot pattern
    case '.-.': // Dot-dash pattern
      ctx.globalAlpha = 0.5
      for (let dy = spacing; dy < h; dy += spacing * 1.5) {
        ctx.beginPath()
        ctx.moveTo(x, y + dy)
        ctx.lineTo(x + w / 2, y + dy)
        ctx.stroke()
        // Dot
        ctx.fillStyle = edgeColor
        ctx.beginPath()
        ctx.arc(x + w * 0.75, y + dy, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
      break

    case '//':  // Diagonal lines
    case '\\\\':  // Reverse diagonal
      ctx.globalAlpha = 0.4
      for (let i = -h; i < w; i += spacing) {
        ctx.beginPath()
        ctx.moveTo(x + i, y)
        ctx.lineTo(x + i + h, y + h)
        ctx.stroke()
      }
      break
  }

  ctx.restore()
}

// Cross section handling
const handleMapClick = (event) => {
  // Not used anymore - cross-section drawing is handled in ContourMap component
}

const handleCrossSectionComplete = (data) => {
  crossSectionData.value = {
    line: { start: data.startCanvas, end: data.endCanvas },
    worldLine: { start: data.start, end: data.end },
    points: data.points || [],
    depthProfile: [],
    distance: data.distance,
    hasData: true
  }

  // Generate the cross-section profile
  generateCrossSectionProfile(data.start, data.end, data.distance)
}

const generateCrossSectionProfile = (start, end, distance) => {
  if (!seamPoints.value.length || distance === null) return

  const canvas = crossSectionCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1
  const w = Math.max(640, canvas.offsetWidth || 900)
  const h = 300
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  // Generate sample points along the cross-section line
  const numSamples = 100
  const dx = (end.x - start.x) / numSamples
  const dy = (end.y - start.y) / numSamples

  // Get burial depth from boreholes using IDW interpolation
  const profile = []

  for (let i = 0; i <= numSamples; i++) {
    const px = start.x + dx * i
    const py = start.y + dy * i

    // Find nearby boreholes and interpolate burial depth
    const depths = seamPoints.value
      .map(b => {
        const dist = Math.sqrt((px - b.x)**2 + (py - b.y)**2)
        return {
          depth: b.burial_depth,
          distance: dist
        }
      })
      .filter(b => b.depth != null && b.distance < 500) // Only use nearby boreholes

    if (depths.length > 0) {
      // IDW interpolation
      let sumWeights = 0
      let weightedDepth = 0
      for (const d of depths) {
        const weight = 1 / (d.distance + 1) ** 2
        weightedDepth += d.depth * weight
        sumWeights += weight
      }
      profile.push({
        distance: (i / numSamples) * distance,
        depth: weightedDepth / sumWeights
      })
    }
  }

  crossSectionData.value.depthProfile = profile

  // Draw the profile
  drawCrossSectionProfile(profile, distance, w, h)
}

const drawCrossSectionProfile = (profile, totalDistance, w, h) => {
  const canvas = crossSectionCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  applyFigureRenderDefaults(ctx)

  // Clear canvas - Light theme
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, w, h)

  if (!profile.length || !Number.isFinite(totalDistance) || totalDistance <= 0) {
    ctx.fillStyle = FIGURE_STYLE.subTextColor
    ctx.font = figureFont(14)
    ctx.textAlign = 'center'
    ctx.fillText('当前剖面线附近缺少可用埋深数据，请重选剖面线。', w / 2, h / 2)
    return
  }

  const padding = { left: 50, right: 30, top: 35, bottom: 40 }
  const drawW = w - padding.left - padding.right
  const drawH = h - padding.top - padding.bottom

  // Find depth range
  const depths = profile.map(p => p.depth)
  const minDepth = Math.min(...depths)
  const maxDepth = Math.max(...depths)
  const depthRange = maxDepth - minDepth || 1

  // Geological layer colors (matching Python script 地质剖面图绘制.py)
  const geoColors = {
    topSoil: '#8FBC8F',      // 草绿色/表土
    sandstone: '#F4A460',    // 砂岩黄
    shale: '#778899',        // 页岩灰
    coal: '#2F2F2F',         // 煤层黑 (重点)
    sandyShale: '#A9A9A9',   // 砂质页岩
    limestone: '#B0C4DE'     // 石灰岩蓝
  }

  // Draw geological background layers (simulated stratigraphy)
  // This creates a visual representation of geological layers
  const layerCount = 6
  const layerHeight = drawH / layerCount
  const layerColors = [geoColors.limestone, geoColors.sandyShale, geoColors.coal,
                       geoColors.shale, geoColors.sandstone, geoColors.topSoil]

  layerColors.forEach((color, i) => {
    const y = padding.top + i * layerHeight
    ctx.fillStyle = color
    ctx.globalAlpha = 0.08  // Subtle background effect
    ctx.fillRect(padding.left, y, drawW, layerHeight)
    ctx.globalAlpha = 1.0
  })

  // Draw grid (Nature style: subtle, light theme)
  ctx.strokeStyle = FIGURE_STYLE.gridColor
  ctx.lineWidth = 0.8

  // Vertical grid lines (distance)
  const numVerticalLines = 10
  for (let i = 0; i <= numVerticalLines; i++) {
    const x = padding.left + (i / numVerticalLines) * drawW
    ctx.beginPath()
    ctx.moveTo(x, padding.top)
    ctx.lineTo(x, h - padding.bottom)
    ctx.stroke()
  }

  // Horizontal grid lines (depth)
  const numHorizontalLines = 5
  for (let i = 0; i <= numHorizontalLines; i++) {
    const y = padding.top + (i / numHorizontalLines) * drawH
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(w - padding.right, y)
    ctx.stroke()
  }

  // Draw axes (Nature style: ticks pointing inward)
  ctx.strokeStyle = FIGURE_STYLE.axisColor
  ctx.lineWidth = 1.0

  // Y-axis line
  ctx.beginPath()
  ctx.moveTo(padding.left, padding.top)
  ctx.lineTo(padding.left, h - padding.bottom)
  ctx.stroke()

  // X-axis line
  ctx.beginPath()
  ctx.moveTo(padding.left, h - padding.bottom)
  ctx.lineTo(w - padding.right, h - padding.bottom)
  ctx.stroke()

  // Draw ticks (pointing inward - Nature style)
  const tickSize = 4
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.75)'
  ctx.lineWidth = 1.0

  // X-axis ticks
  for (let i = 0; i <= numVerticalLines; i++) {
    const x = padding.left + (i / numVerticalLines) * drawW
    ctx.beginPath()
    ctx.moveTo(x, h - padding.bottom)
    ctx.lineTo(x, h - padding.bottom + tickSize)
    ctx.stroke()
  }

  // Y-axis ticks
  for (let i = 0; i <= numHorizontalLines; i++) {
    const y = h - padding.bottom - (i / numHorizontalLines) * drawH
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(padding.left - tickSize, y)
    ctx.stroke()
  }

  // Draw the burial depth profile (smoothed curve for publication quality)
  ctx.beginPath()
  // Use sandstone color for main profile line (matching Python script)
  ctx.strokeStyle = geoColors.sandstone
  ctx.lineWidth = 2.5
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const screenPoints = profile.map((p) => ({
    x: padding.left + (p.distance / totalDistance) * drawW,
    y: h - padding.bottom - ((p.depth - minDepth) / depthRange) * drawH
  }))
  ctx.moveTo(screenPoints[0].x, screenPoints[0].y)
  if (screenPoints.length > 2) {
    for (let i = 1; i < screenPoints.length - 1; i++) {
      const xc = (screenPoints[i].x + screenPoints[i + 1].x) / 2
      const yc = (screenPoints[i].y + screenPoints[i + 1].y) / 2
      ctx.quadraticCurveTo(screenPoints[i].x, screenPoints[i].y, xc, yc)
    }
    const last = screenPoints[screenPoints.length - 1]
    const prev = screenPoints[screenPoints.length - 2]
    ctx.quadraticCurveTo(prev.x, prev.y, last.x, last.y)
  } else if (screenPoints.length === 2) {
    ctx.lineTo(screenPoints[1].x, screenPoints[1].y)
  }

  ctx.stroke()

  // Fill area under the curve (subtle)
  ctx.lineTo(padding.left + drawW, h - padding.bottom)
  ctx.lineTo(padding.left, h - padding.bottom)
  ctx.closePath()
  ctx.fillStyle = 'rgba(244, 164, 96, 0.12)'  // Sandstone color with low alpha
  ctx.fill()

  // Draw borehole points on the profile (Nature style)
  for (const borehole of seamPoints.value) {
    if (borehole.burial_depth == null) continue

    // Find the closest point on the profile line
    const px = borehole.x
    const py = borehole.y

    // Calculate distance from start of line to this borehole
    const start = crossSectionData.value.worldLine?.start || { x: 0, y: 0 }
    const end = crossSectionData.value.worldLine?.end || { x: 0, y: 0 }

    // Project point onto line
    const lineLength = Math.sqrt((end.x - start.x)**2 + (end.y - start.y)**2)
    if (lineLength === 0) continue

    const t = ((px - start.x) * (end.x - start.x) + (py - start.y) * (end.y - start.y)) / (lineLength ** 2)

    // Check if point is close to the line
    const projX = start.x + t * (end.x - start.x)
    const projY = start.y + t * (end.y - start.y)
    const distToLine = Math.sqrt((px - projX)**2 + (py - projY)**2)

    if (distToLine < 50 && t >= 0 && t <= 1) {
      const x = padding.left + t * drawW
      const y = h - padding.bottom - ((borehole.burial_depth - minDepth) / depthRange) * drawH

      // Draw borehole point (coal color for contrast)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = geoColors.coal
      ctx.fill()
      // White edge for visibility
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Borehole label (Nature style: compact)
      ctx.fillStyle = FIGURE_STYLE.subTextColor
      ctx.font = figureFont(10)
      ctx.textAlign = 'center'
      const label = borehole.borehole || borehole.name || ''
      if (label) {
        ctx.fillText(label, x, y - 10)
      }
    }
  }

  // Draw axes labels (Nature style - Light theme)
  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(11)
  ctx.textAlign = 'center'

  // X-axis labels (distance)
  for (let i = 0; i <= numVerticalLines; i++) {
    const x = padding.left + (i / numVerticalLines) * drawW
    const dist = (i / numVerticalLines) * totalDistance
    ctx.fillText(`${dist.toFixed(0)}`, x, h - 15)
  }

  // Y-axis labels (depth)
  ctx.textAlign = 'right'
  for (let i = 0; i <= numHorizontalLines; i++) {
    const y = h - padding.bottom - (i / numHorizontalLines) * drawH
    const depth = minDepth + (i / numHorizontalLines) * depthRange
    ctx.fillText(`${depth.toFixed(0)}`, padding.left - 8, y + 4)
  }

  // Axis titles (Nature style: normal weight, sans-serif)
  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(12)
  ctx.textAlign = 'center'

  // X-axis title
  ctx.fillText('剖面距离 (米)', padding.left + drawW / 2, h - 5)

  // Y-axis title (rotated)
  ctx.save()
  ctx.translate(12, padding.top + drawH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('埋藏深度 (米)', 0, 0)
  ctx.restore()

  // Title (Nature style: Figure label format - Light theme)
  ctx.fillStyle = FIGURE_STYLE.textColor
  ctx.font = figureFont(13, 700)
  ctx.textAlign = 'left'
  ctx.fillText(`Fig. 4 | 剖面 A-A' 深度分布 (${minDepth.toFixed(1)}-${maxDepth.toFixed(1)} m)`, padding.left, 18)

  // Scale bar
  const preferredScale = Math.max(10, totalDistance / 4)
  const scaleCandidates = [10, 20, 50, 100, 200, 500, 1000]
  let scaleMeters = scaleCandidates[0]
  for (const candidate of scaleCandidates) {
    if (candidate <= preferredScale) scaleMeters = candidate
  }
  const scaleLength = Math.max(34, Math.min(110, (scaleMeters / totalDistance) * drawW))
  const scaleBarX = w - padding.right - scaleLength - 16
  const scaleBarY = h - padding.bottom + 12

  ctx.strokeStyle = FIGURE_STYLE.axisColor
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(scaleBarX, scaleBarY)
  ctx.lineTo(scaleBarX + scaleLength, scaleBarY)
  ctx.stroke()

  // Scale bar end caps
  ctx.beginPath()
  ctx.moveTo(scaleBarX, scaleBarY - 3)
  ctx.lineTo(scaleBarX, scaleBarY + 3)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(scaleBarX + scaleLength, scaleBarY - 3)
  ctx.lineTo(scaleBarX + scaleLength, scaleBarY + 3)
  ctx.stroke()

  ctx.fillStyle = FIGURE_STYLE.subTextColor
  ctx.font = figureFont(10, 500)
  ctx.textAlign = 'center'
  ctx.fillText(`比例尺: ${Math.round(scaleMeters)} m`, scaleBarX + scaleLength / 2, scaleBarY + 12)
}

const resetCrossSection = () => {
  crossSectionMode.value = false
  crossSectionData.value = { line: null, points: [], depthProfile: [], distance: null, hasData: false }
  if (crossSectionCanvas.value) {
    const ctx = crossSectionCanvas.value.getContext('2d')
    ctx.clearRect(0, 0, crossSectionCanvas.value.width, crossSectionCanvas.value.height)
  }
}

const goPressureAnalysis = () => {
  router.push({
    name: 'AcademicAlgorithm',
    query: selectedSeam.value?.name ? { seam: selectedSeam.value.name } : undefined
  })
}

const normalizeQuerySeam = (value) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value : ''
}

const normalizeQueryJobId = (value) => {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value.trim() : ''
}

// Resize handler for stratigraphic column
let resizeTimeout = null
const handleResize = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    drawStratigraphicColumn()
    drawHistogram()
  }, 150)
}

onMounted(async () => {
  // Load saved parameters first
  loadSavedParams()

  // Watch for parameter changes and auto-save
  watch([method, gridSize, contourLevels, renderQuality, collapsedSections], () => {
    saveParams()
  }, { deep: true })

  await loadSeams()
  const preferredJobId = normalizeQueryJobId(route.query?.geomodel_job_id || route.query?.geomodelJobId)
  if (preferredJobId) {
    geomodelJobId.value = preferredJobId
    try {
      await refreshGeomodelJob()
    } catch (err) {
      toast.add('读取 Geomodel 任务状态失败: ' + (err?.response?.data?.detail || err?.message || ''), 'warning')
    }
  }
  const preferredName = normalizeQuerySeam(route.query?.seam) || workspaceState.selectedSeam
  if (!preferredName) return
  const preferred = availableSeams.value.find((item) => item.name === preferredName)
  if (preferred) {
    await selectSeam(preferred)
  }

  // Register keyboard shortcuts
  document.addEventListener('keydown', handleKeydown)

  // Register resize handler
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  clearTimeout(resizeTimeout)
})

// Reset view function
const resetView = () => {
  resetCrossSection()
}

// Keyboard shortcuts
const handleKeydown = (e) => {
  // Only handle shortcuts when not in input fields
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
    return
  }

  switch (e.key.toLowerCase()) {
    case 'r':
      // Reset cross-section
      e.preventDefault()
      resetCrossSection()
      toast.info('已重置视图')
      break
    case '+':
    case '=':
      // Zoom in - handled by map component
      break
    case '-':
      // Zoom out - handled by map component
      break
    case 'c':
      // Toggle cross-section mode
      e.preventDefault()
      if (selectedSeam.value) {
        crossSectionMode.value = !crossSectionMode.value
        toast.info(crossSectionMode.value ? '剖面模式已开启，点击两点绘制剖面线' : '剖面模式已关闭')
      }
      break
    case 'escape':
      // Cancel cross-section drawing
      if (crossSectionMode.value) {
        crossSectionMode.value = false
        resetCrossSection()
      }
      break
    case 'g':
      // Generate contours
      e.preventDefault()
      if (selectedSeam.value && !loading.value) {
        handleInterpolate()
      }
      break
  }
}

defineExpose({ resetView })
</script>

<style scoped>
/* Interpolation Analysis - scientific dashboard refinement */

.interp-page {
  --panel-gap: var(--spacing-md);
  --header-height: 64px;
}

/* Main layout grid - 使用更灵活的布局 */
.interp-grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(340px, 1.3fr) minmax(260px, 0.9fr);
  gap: var(--panel-gap);
  align-items: start;
  min-width: 0;
}

/* 卡片基础样式 */
.compact-card {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  overflow: hidden;
}

/* 三个顶部卡片 */
.params-card,
.data-dist-card,
.strat-card {
  grid-column: auto;
  min-height: 400px;
  max-height: 500px;
  min-width: 0;
}

/* 参数卡片 */
.params-card {
  overflow-y: auto;
  min-width: 0;
  max-height: 480px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.params-card::-webkit-scrollbar {
  width: 6px;
}

.params-card::-webkit-scrollbar-track {
  background: transparent;
}

.params-card::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.params-card::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* 数据分布卡片 */
.data-dist-card .figure-canvas {
  flex: 1;
  min-height: 0;
}

/* 地层卡片 */
.strat-card {
  min-width: 0;
}

.strat-card .figure-wrapper {
  flex: 1;
  min-height: 280px;
  max-height: 380px;
  position: relative;
  overflow: hidden;
}

.strat-card .figure-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.interp-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.header-title-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.header-subtitle {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-tight);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: var(--font-weight-medium);
}

.header-stats {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.stat-badge {
  min-width: 150px;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.14);
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: right;
}

.stat-badge .stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.78);
  letter-spacing: 0.06em;
}

.stat-badge strong {
  font-size: 13px;
  color: var(--text-inverted);
  font-family: var(--font-family-mono);
  font-weight: var(--font-weight-semibold);
}

.stat-badge.primary {
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.24);
}

.seam-select-card {
  padding: var(--spacing-xl);
}

.seam-selection-grid {
  margin-top: var(--spacing-xl);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  max-height: 620px;
  overflow-y: auto;
  padding-right: var(--spacing-xs);
}

.seam-selection-card {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
  cursor: pointer;
  overflow: hidden;
}

.seam-selection-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.seam-card-indicator {
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--gradient-primary);
}

.seam-card-body {
  padding: var(--spacing-lg);
  padding-left: calc(var(--spacing-lg) + var(--spacing-sm));
}

.seam-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.seam-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.seam-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  background: var(--color-primary-lighter);
  border: 1px solid var(--border-color);
  padding: 4px 8px;
  border-radius: var(--radius-full);
}

.seam-card-stats {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.mini-stat {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.mini-stat-label {
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
}

.mini-stat-value {
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-family: var(--font-family-mono);
  font-weight: var(--font-weight-semibold);
}

.mini-stat-divider {
  height: 1px;
  background: var(--border-color-light);
}

.param-section {
  margin-bottom: var(--spacing-lg);
}

.param-section:last-of-type {
  margin-bottom: var(--spacing-md);
}

.param-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-sm);
}

.param-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.param-value-badge {
  font-family: var(--font-family-mono);
  color: var(--text-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: 4px 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
}

.method-buttons,
.quality-buttons {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background: var(--bg-secondary);
  min-width: 0;
}

.method-btn,
.quality-btn {
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  padding: 6px 4px;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.method-btn:hover,
.quality-btn:hover {
  background: var(--bg-primary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.method-btn.active,
.quality-btn.active {
  background: var(--color-primary);
  color: var(--text-inverted);
  border-color: var(--color-primary);
}

.method-btn-label {
  display: inline-block;
  letter-spacing: 0.01em;
}

.slider-track {
  padding: 4px 0;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: var(--radius-full);
  outline: none;
  -webkit-appearance: none;
  background: var(--color-primary-light);
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 2px solid var(--bg-primary);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}

.slider-labels {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-tertiary);
}

.param-hint {
  margin: var(--spacing-sm) 0 0;
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: var(--bg-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
}

.toggle-btn input {
  accent-color: var(--color-primary);
}

.toggle-btn span {
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

.hint-text {
  margin-top: var(--spacing-sm);
  margin-bottom: 0;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  background: var(--color-warning-bg);
  border: 1px solid var(--color-warning-border);
  color: var(--color-warning-text);
  font-size: var(--font-size-xs);
}

.action-buttons {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xl);
}

.btn {
  padding: 10px 14px;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
}

.btn.primary {
  background: var(--gradient-primary);
  color: var(--text-inverted);
  box-shadow: var(--shadow-sm);
}

.btn.primary:hover:not(:disabled) {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn.outline {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.btn.outline:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--text-primary);
}

.btn.small {
  padding: 8px 12px;
  font-size: var(--font-size-xs);
}

.status-text {
  margin: var(--spacing-sm) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
}

/* Collapsible Control Groups */
.control-group {
  margin-bottom: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  overflow: hidden;
  flex-shrink: 0;
}

.control-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
}

.control-group-header:hover {
  background: var(--bg-tertiary);
}

.control-group-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.control-group-hint {
  margin-right: var(--spacing-xs);
  font-size: 14px;
  color: var(--text-tertiary);
  cursor: help;
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
  color: var(--text-tertiary);
}

.chevron.rotated {
  transform: rotate(180deg);
}

.param-recommendation {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border: 1px solid #86efac;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.recommendation-text {
  font-size: 11px;
  color: #166534;
  font-weight: 500;
}

.param-recommendation .btn {
  flex-shrink: 0;
  padding: 4px 10px;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.param-recommendation .btn svg {
  width: 14px;
  height: 14px;
}

.control-group-content {
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  min-width: 0;
}

.param-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
  gap: var(--spacing-sm);
  min-width: 0;
}

.param-row label,
.param-row .param-label {
  flex-shrink: 0;
  min-width: 0;
}

.param-row input,
.param-row select {
  min-width: 0;
  max-width: 120px;
}

/* Collapse transition */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px;
  opacity: 1;
}

/* Legend styles */
.lithology-legend {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.legend-title {
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-sm);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.geomodel-panel {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.geomodel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.geomodel-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.geomodel-jobid {
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--text-secondary);
}

.geomodel-controls {
  display: grid;
  grid-template-columns: 1.4fr 1fr auto;
  gap: var(--spacing-sm);
  align-items: center;
}

.geomodel-select,
.geomodel-range input {
  height: 34px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--font-size-xs);
  padding: 0 10px;
}

.geomodel-range {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.geomodel-range label {
  color: var(--text-secondary);
  font-size: 11px;
}

.geomodel-btn {
  height: 34px;
  padding: 0 12px;
}

.geomodel-status {
  margin-top: var(--spacing-sm);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: 11px;
  color: var(--text-secondary);
}

.geomodel-error {
  margin: var(--spacing-sm) 0 0;
  color: var(--color-error-text);
  font-size: 11px;
}

.geomodel-summary {
  margin-top: var(--spacing-sm);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-sm);
}

.summary-item {
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-item span {
  color: var(--text-secondary);
  font-size: 10px;
}

.summary-item strong {
  color: var(--text-primary);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
}

.geomodel-files {
  margin-top: var(--spacing-sm);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.file-chip {
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  font-size: 11px;
  padding: 4px 10px;
  cursor: pointer;
}

.file-chip:hover {
  border-color: var(--color-primary);
  color: var(--text-primary);
}

.figure-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color-light);
  border-radius: var(--border-radius-md);
  background: var(--bg-primary);
  min-height: 290px;
  padding: var(--spacing-sm);
}

.figure-canvas {
  width: 100%;
  max-width: 100%;
  display: block;
}

.histogram-canvas {
  min-height: 300px;
}

.strat-figure {
  min-height: 320px;
}

.stratigraphic-canvas {
  height: 320px;
}

.empty-state-panel {
  min-height: 290px;
  border: 1px dashed var(--border-color-dark);
  border-radius: var(--border-radius-md);
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--text-tertiary);
}

.empty-state-panel p {
  margin: 0;
  font-size: var(--font-size-sm);
}

.stats-grid {
  margin-top: var(--spacing-sm);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-xs);
}

.stat-item {
  border: 1px solid var(--border-color-light);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-item .stat-label {
  font-size: 10px;
  color: var(--text-tertiary);
}

.stat-item .stat-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  font-family: var(--font-family-mono);
}

.lithology-legend {
  margin-top: var(--spacing-sm);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.legend-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  padding: 4px 10px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid var(--border-color-dark);
}

.legend-text {
  color: var(--text-secondary);
  font-size: 11px;
}

.map-row {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--panel-gap);
}

.map-card-large {
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 380px;
  max-height: 480px;
}

.map-card-full {
  grid-column: 1 / -1;
}

.cross-section-card {
  border: 1px solid var(--border-color-dark);
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color-light);
}

.map-header h3 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.map-section-title {
  margin-bottom: var(--spacing-xs);
}

.map-method-desc {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.method-tag {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  padding: 2px 8px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 11px;
  font-family: var(--font-family-mono);
}

.section-badge {
  display: inline-flex;
  align-items: center;
  margin-left: var(--spacing-sm);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-warning-border);
  background: var(--color-warning-bg);
  color: var(--color-warning-text);
  padding: 2px 10px;
  font-size: 11px;
  font-family: var(--font-family-mono);
}

.map-wrapper {
  width: 100%;
  flex: 1;
  min-height: 280px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color-light);
  overflow: hidden;
  background: var(--bg-primary);
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  position: relative;
}

.map-wrapper :deep(.canvas-contour-wrapper),
.map-wrapper :deep(.contour-image) {
  width: 100%;
  height: 100%;
}

.map-wrapper :deep(.contour-image) {
  object-fit: contain;
  display: block;
}

.uncertainty-wrapper {
  min-height: 380px;
  max-height: 480px;
}

.uncertainty-canvas,
.cross-section-canvas {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  display: block;
}

.cross-section-wrapper {
  min-height: 340px;
  max-height: 420px;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  background: var(--bg-secondary);
}

.map-placeholder p {
  margin: 0;
  font-size: var(--font-size-sm);
}

.uncertainty-high {
  color: var(--color-error);
}

.uncertainty-low {
  color: var(--color-success);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-primary-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner.sm {
  width: 14px;
  height: 14px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1400px) {
  .interp-grid {
    grid-template-columns: 1fr 1fr;
  }

  .params-card {
    grid-column: 1 / -1;
    order: -1;
    max-height: none;
  }

  .data-dist-card,
  .strat-card {
    grid-column: auto;
  }

  .map-row {
    grid-template-columns: 1fr;
  }

  .map-card-large {
    grid-column: 1 / -1;
  }
}

@media (max-width: 1024px) {
  .interp-grid {
    grid-template-columns: 1fr;
  }

  .params-card,
  .data-dist-card,
  .strat-card {
    grid-column: 1 / -1;
    max-height: none;
    min-height: 350px;
  }

  .map-card-large,
  .map-card-full {
    grid-column: 1 / -1;
  }

  .interp-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .header-stats {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .stat-badge {
    min-width: auto;
    flex: 1;
    min-width: 120px;
  }

  .stat-badge {
    text-align: left;
  }

  .method-buttons,
  .quality-buttons {
    grid-template-columns: 1fr;
  }

  .geomodel-controls,
  .geomodel-summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .seam-selection-grid {
    grid-template-columns: 1fr;
    max-height: 420px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .map-wrapper,
  .uncertainty-wrapper,
  .cross-section-wrapper {
    min-height: 280px;
    max-height: 360px;
  }
}
</style>
