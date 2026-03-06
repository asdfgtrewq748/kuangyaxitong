<template>
  <div class="pressure-analysis-ultra" ref="pageRef">
    <!-- 顶部导航栏 -->
    <header class="top-nav-ultra">
      <div class="nav-brand">
        <button class="back-btn" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="brand-info">
          <h1 class="page-title">矿压数据分析</h1>
          <div class="workface-info">
            <span class="badge">02 工作面</span>
            <span class="date-range" v-if="dateRangeText">{{ dateRangeText }}</span>
          </div>
        </div>
      </div>

      <div class="nav-stats">
        <div class="stat-cards">
          <div class="stat-card">
            <span class="stat-label">均值</span>
            <span class="stat-value">{{ stats?.mean?.toFixed(2) || '--' }}</span>
            <span class="stat-unit">MPa</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">峰值</span>
            <span class="stat-value highlight">{{ stats?.max?.toFixed(2) || '--' }}</span>
            <span class="stat-unit">MPa</span>
          </div>
          <div class="stat-card warning" v-if="anomalyCount > 0">
            <span class="stat-label">异常</span>
            <span class="stat-value">{{ anomalyCount }}</span>
          </div>
        </div>
      </div>

      <div class="nav-actions">
            <button class="action-btn" @click="toggleLayout" :title="'当前布局: ' + (layoutModes.find(m => m.id === layoutMode)?.label || '默认')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span class="layout-indicator" v-if="layoutMode !== 'default'">●</span>
        </button>
        <button class="action-btn" @click="exportReport" title="导出报告">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
        <button class="action-btn" @click="showPerformancePanel = !showPerformancePanel" title="性能监控">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 20V10M18 20V4M6 20v-4"/>
          </svg>
        </button>
        <button class="action-btn" @click="openChartCenter" title="图表中心">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="11" width="4" height="10" rx="1"/>
            <rect x="10" y="7" width="4" height="14" rx="1"/>
            <rect x="17" y="4" width="4" height="17" rx="1"/>
          </svg>
        </button>
        <button class="action-btn primary" @click="toggleFullscreen" title="全屏 (F11)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content-ultra">
      <!-- 左侧控制面板 -->
      <aside class="control-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
        
        <div class="sidebar-content" v-show="!sidebarCollapsed">
          <!-- 数据筛选 -->
          <div class="control-section">
            <h4 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              数据筛选
            </h4>
            
            <div class="control-group">
              <label>柱类型</label>
              <select v-model="columnType" class="control-select">
                <option value="all">全部</option>
                <option value="front">前柱</option>
                <option value="rear">后柱</option>
              </select>
            </div>

            <div class="control-group">
              <label>日期范围</label>
              <div class="date-inputs">
                <input type="date" v-model="startDateStr" class="control-input" />
                <span>至</span>
                <input type="date" v-model="endDateStr" class="control-input" />
              </div>
            </div>

            <div class="control-group">
              <label>支架范围</label>
              <div class="range-inputs">
                <input type="number" v-model.number="supportStart" min="1" max="125" class="control-input" />
                <span>-</span>
                <input type="number" v-model.number="supportEnd" min="1" max="125" class="control-input" />
              </div>
            </div>
          </div>

          <!-- 阈值设置 -->
          <div class="control-section">
            <h4 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2v20M2 12h20"/>
              </svg>
              阈值设置
            </h4>
            
            <div class="control-group">
              <label>低压阈值: {{ lowThreshold }} MPa</label>
              <input type="range" v-model.number="lowThreshold" min="0" max="30" class="control-slider" />
            </div>

            <div class="control-group">
              <label>高压阈值: {{ highThreshold }} MPa</label>
              <input type="range" v-model.number="highThreshold" min="30" max="60" class="control-slider" />
            </div>
          </div>

          <!-- 显示选项 -->
          <div class="control-section">
            <h4 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              显示选项
            </h4>
            
            <div class="toggle-list">
              <label class="toggle-item">
                <input type="checkbox" v-model="showGrid" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">显示网格</span>
              </label>
              <label class="toggle-item">
                <input type="checkbox" v-model="showAnomalies" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">标记异常</span>
              </label>
              <label class="toggle-item">
                <input type="checkbox" v-model="showPeaks" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">显示峰值</span>
              </label>
            </div>
          </div>

          <!-- 智能分析工具 -->
          <div class="control-section">
            <h4 class="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              智能分析
            </h4>
            <div class="analysis-tools">
              <button 
                v-for="tool in analysisTools" 
                :key="tool.id"
                :class="['tool-btn', { active: activeTool === tool.id, loading: toolLoading === tool.id }]"
                @click="executeTool(tool.id)"
                :disabled="toolLoading !== null"
              >
                <span class="tool-icon">{{ tool.icon }}</span>
                <span class="tool-label">{{ tool.label }}</span>
                <span v-if="toolLoading === tool.id" class="tool-spinner"></span>
              </button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="control-actions">
            <button class="btn-primary" @click="applyFilters">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              应用筛选
            </button>
            <button class="btn-secondary" @click="resetFilters">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/>
              </svg>
              重置
            </button>
          </div>
        </div>
      </aside>

      <!-- 中央可视化区 -->
      <section class="visualization-area">
        <!-- 热力图 -->
        <div class="heatmap-panel">
          <PressureHeatmapUltra
            panel-label="A"
            title="矿压强度热力图"
            :subtitle="heatmapSubtitle"
            :matrix="heatmapMatrix"
            :cells="heatmapCells"
            :stats="stats"
            :num-rows="numRows"
            :num-cols="numCols"
            :start-date="startDate"
            :end-date="endDate"
            :color-scale="colorScheme"
            :show-grid="showGrid"
            :loading="loading"
            :loading-progress="loadingProgress"
            @cell-select="onCellSelect"
            @export="onHeatmapExport"
            @scheme-change="onSchemeChange"
          />
        </div>

        <!-- 时间轴 -->
        <div class="timeline-panel">
          <PressureTimeSeriesUltra
            title="时序分析"
            :data="selectedSupportData"
            :support-id="selectedSupport"
            :show-peaks="showPeaks"
            :peaks="selectedSupportPeaks"
            :show-trend="true"
            :show-bands="true"
          />
        </div>
      </section>

      <!-- 右侧分析面板 -->
      <aside class="analysis-sidebar">
        <!-- KPI卡片 -->
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-icon" style="background: linear-gradient(135deg, #0072B2, #4da6e8);">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div class="kpi-data">
                <span class="kpi-value">{{ stats?.mean?.toFixed(2) || '--' }}</span>
                <span class="kpi-unit">MPa</span>
                <span class="kpi-label">平均值</span>
              </div>
            </div>
            
            <div class="kpi-card">
              <div class="kpi-icon" style="background: linear-gradient(135deg, #D55E00, #f5a623);">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <div class="kpi-data">
                <span class="kpi-value">{{ stats?.max?.toFixed(2) || '--' }}</span>
                <span class="kpi-unit">MPa</span>
                <span class="kpi-label">最大值</span>
              </div>
            </div>
            
            <div class="kpi-card">
              <div class="kpi-icon" style="background: linear-gradient(135deg, #009E73, #35B779);">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div class="kpi-data">
                <span class="kpi-value">{{ stats?.min?.toFixed(2) || '--' }}</span>
                <span class="kpi-unit">MPa</span>
                <span class="kpi-label">最小值</span>
              </div>
            </div>
            
            <div class="kpi-card" v-if="anomalyCount > 0">
              <div class="kpi-icon" style="background: linear-gradient(135deg, #CC79A7, #f5a623);">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div class="kpi-data">
                <span class="kpi-value warning">{{ anomalyCount }}</span>
                <span class="kpi-unit">个</span>
                <span class="kpi-label">异常点</span>
              </div>
            </div>
          </div>

        <div class="chart-hub-card">
          <div class="hub-title-row">
            <h4 class="hub-title">图表中心</h4>
            <span class="hub-badge">子页面</span>
          </div>
          <p class="hub-desc">
            右侧多图表、Nature 导出和科研工具已迁移到独立子页面，当前页仅保留核心分析与筛选。
          </p>
          <div class="hub-actions">
            <button class="hub-btn" @click="openChartCenter">打开图表中心</button>
          </div>
        </div>

          <!-- 标签页图表 -->
        <div v-if="false" class="chart-tabs-container">
          <div class="tabs-header">
            <button
              v-for="tab in chartTabs"
              :key="tab.id"
              :class="['tab-btn', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <span class="tab-icon">{{ tab.icon }}</span>
              <span class="tab-label">{{ tab.label }}</span>
            </button>
          </div>
          
          <div class="tabs-content">
            <Transition name="tab-slide" mode="out-in">
              <!-- 分布图 -->
              <div v-if="activeTab === 'hist'" key="hist" class="tab-panel">
                <LazyChart height="280px" :loading="!histogramData.length">
                  <PressureHistogramUltra
                    ref="histogramRef"
                    title="阻力分布直方图"
                    :data="histogramData"
                    :bins="30"
                  />
                </LazyChart>
              </div>

              <!-- 空间分布 -->
              <div v-else-if="activeTab === 'spatial'" key="spatial" class="tab-panel">
                <LazyChart height="280px" :loading="!spatialDistData.length">
                  <PressureSpatialDistUltra
                    ref="spatialRef"
                    title="空间分布"
                    :data="spatialDistData"
                  />
                </LazyChart>
              </div>

              <!-- 周期检测 -->
              <div v-else-if="activeTab === 'cycle'" key="cycle" class="tab-panel">
                <LazyChart height="280px" :loading="!cycleData.length">
                  <PressureCycleDetectUltra
                    ref="cycleRef"
                    title="周期检测"
                    :data="cycleData"
                    :periods="detectedPeriods"
                  />
                </LazyChart>
              </div>

              <!-- 相关性 -->
              <div v-else-if="activeTab === 'corr'" key="corr" class="tab-panel">
                <LazyChart height="280px" :loading="!correlationMatrix">
                  <PressureCorrelationUltra
                    ref="correlationRef"
                    title="支架相关性"
                    :matrix="correlationMatrix"
                  />
                </LazyChart>
              </div>

              <!-- 对比 -->
              <div v-else-if="activeTab === 'compare'" key="compare" class="tab-panel">
                <LazyChart height="280px" :loading="!frontColumnData.length && !rearColumnData.length">
                  <PressureColumnCompareUltra
                    ref="compareRef"
                    title="前后柱对比"
                    :front-data="frontColumnData"
                    :rear-data="rearColumnData"
                  />
                </LazyChart>
              </div>

              <!-- 箱线图 -->
              <div v-else-if="activeTab === 'boxplot'" key="boxplot" class="tab-panel">
                <LazyChart height="280px" :loading="!rawData.length">
                  <PressureBoxPlot
                    ref="boxplotRef"
                    panel-label="C"
                    title="压力分布箱线图"
                    subtitle="Box Plot Analysis"
                    :data="rawData"
                    time-range="day"
                  />
                </LazyChart>
              </div>

              <!-- 累积分布 -->
              <div v-else-if="activeTab === 'cdf'" key="cdf" class="tab-panel">
                <LazyChart height="280px" :loading="!rawData.length">
                  <PressureCDF
                    ref="cdfRef"
                    panel-label="D"
                    title="累积分布函数"
                    subtitle="Cumulative Distribution"
                    :data="rawData"
                  />
                </LazyChart>
              </div>

              <!-- 频谱分析 -->
              <div v-else-if="activeTab === 'spectral'" key="spectral" class="tab-panel">
                <LazyChart height="280px" :loading="!selectedSupportData.length">
                  <PressureSpectral
                    ref="spectralRef"
                    panel-label="E"
                    title="频谱分析"
                    subtitle="Spectral Analysis"
                    :data="selectedSupportData"
                  />
                </LazyChart>
              </div>

              <!-- 散点矩阵 -->
              <div v-else-if="activeTab === 'scatter'" key="scatter" class="tab-panel">
                <LazyChart height="280px" :loading="!rawData.length">
                  <PressureScatterMatrix
                    ref="scatterRef"
                    panel-label="F"
                    title="多支架相关性矩阵"
                    subtitle="Scatter Plot Matrix"
                    :data="rawData"
                    :support-ids="[1, 25, 50, 75, 100, 125]"
                  />
                </LazyChart>
              </div>

              <!-- 异常热力图 -->
              <div v-else-if="activeTab === 'anomaly'" key="anomaly" class="tab-panel">
                <LazyChart height="280px" :loading="!heatmapMatrix.length">
                  <AnomalyHeatmap
                    ref="anomalyRef"
                    panel-label="G"
                    title="异常分布热力图"
                    subtitle="Anomaly Detection Map"
                    :matrix="heatmapMatrix"
                    :stats="stats"
                    :threshold="2.0"
                  />
                </LazyChart>
              </div>

              <!-- 雷达图 -->
              <div v-else-if="activeTab === 'radar'" key="radar" class="tab-panel">
                <LazyChart height="280px" :loading="!selectedSupportData.length">
                  <PressureRadar
                    ref="radarRef"
                    panel-label="H"
                    title="压力特征雷达图"
                    subtitle="Multi-dimensional Analysis"
                    :data="selectedSupportData"
                  />
                </LazyChart>
              </div>

              <!-- 密度图 -->
              <div v-else-if="activeTab === 'density'" key="density" class="tab-panel">
                <LazyChart height="280px" :loading="!rawData.length">
                  <PressureDensity
                    ref="densityRef"
                    panel-label="I"
                    title="核密度估计"
                    subtitle="Kernel Density Estimation"
                    :data="rawData"
                  />
                </LazyChart>
              </div>

              <!-- 等值线图 -->
              <div v-else-if="activeTab === 'contour'" key="contour" class="tab-panel">
                <LazyChart height="280px" :loading="!heatmapMatrix.length">
                  <PressureContour
                    ref="contourRef"
                    panel-label="J"
                    title="压力等值线图"
                    subtitle="Contour Map"
                    :matrix="heatmapMatrix"
                    :num-supports="numRows"
                    :levels="12"
                  />
                </LazyChart>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Nature导出面板 -->
        <NatureExportPanel 
          v-if="false"
          :charts="chartInstances"
          @export-complete="onExportComplete"
        />

        <!-- 科研分析面板 -->
        <ResearchPanel 
          v-if="false"
          :data="researchData"
          @palette-change="onResearchPaletteChange"
          @export-request="onResearchExport"
        />

        <!-- 方法论与引用 -->
        <MethodologyPanel v-if="false" />
      </aside>
    </main>

    <!-- 底部状态栏 -->
    <footer class="status-bar-ultra">
      <div class="status-info">
        <div class="status-item">
          <span class="status-dot active"></span>
          <span class="status-label">数据点</span>
          <span class="status-value">{{ formatNumber(dataPoints) }}</span>
        </div>
        <div class="status-divider"></div>
        <div class="status-item">
          <span class="status-label">时间跨度</span>
          <span class="status-value">{{ dateRangeText }}</span>
        </div>
        <div class="status-divider"></div>
        <div class="status-item">
          <span class="status-label">支架范围</span>
          <span class="status-value">#{{ supportStart }} - #{{ supportEnd }}</span>
        </div>
        <div class="status-divider"></div>
        <div class="status-item">
          <span class="status-label">选中支架</span>
          <span class="status-value highlight">#{{ selectedSupport }}</span>
        </div>
      </div>
      
      <div class="status-actions">
        <Transition name="fade">
          <div v-if="loading" class="loading-indicator">
            <div class="loading-spinner-sm"></div>
            <span>数据处理中...</span>
          </div>
        </Transition>
      </div>
    </footer>

    <!-- Toast 提示 -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast-notification">
        <span class="toast-icon">✓</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- 导出菜单模态框 -->
    <Transition name="modal">
      <div v-if="showExportModal" class="modal-overlay" @click.self="showExportModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3>导出数据</h3>
            <button class="modal-close" @click="showExportModal = false">×</button>
          </div>
          <div class="modal-body">
            <div class="export-options">
              <button 
                v-for="opt in exportOptions" 
                :key="opt.id"
                class="export-option-btn"
                @click="handleExport(opt.id)"
              >
                <span class="export-icon">{{ opt.icon }}</span>
                <span class="export-label">{{ opt.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 性能监控面板 -->
    <PerformancePanel
      :show="showPerformancePanel"
      :fps="currentFps"
      :render-time="currentRenderTime"
      :data-points="totalDataPoints"
      :cells="totalCells"
      @close="showPerformancePanel = false"
      @toggle-low-power="handleLowPowerMode"
    />

    <!-- 键盘快捷键帮助 -->
    <Transition name="modal">
      <div v-if="showShortcutsHelp" class="modal-overlay" @click.self="showShortcutsHelp = false">
        <div class="modal-content shortcuts-modal">
          <div class="modal-header">
            <h3>键盘快捷键</h3>
            <button class="modal-close" @click="showShortcutsHelp = false">×</button>
          </div>
          <div class="modal-body">
            <div class="shortcuts-list">
              <div class="shortcut-group">
                <h4>视图控制</h4>
                <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>0</kbd> <span>重置视图</span></div>
                <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>+</kbd> <span>放大</span></div>
                <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>-</kbd> <span>缩小</span></div>
                <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>G</kbd> <span>切换网格</span></div>
              </div>
              <div class="shortcut-group">
                <h4>功能操作</h4>
                <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>E</kbd> <span>导出数据</span></div>
                <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Enter</kbd> <span>应用筛选</span></div>
                <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> <span>重置筛选</span></div>
                <div class="shortcut-item"><kbd>F11</kbd> <span>全屏模式</span></div>
              </div>
              <div class="shortcut-group">
                <h4>智能分析</h4>
                <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> <span>异常检测</span></div>
                <div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> <span>趋势分析</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// 导入优化后的组件
import PressureHeatmapUltra from '@/components/pressure/PressureHeatmapUltra.vue'
import PressureTimeSeriesUltra from '@/components/pressure/charts/PressureTimeSeriesUltra.vue'
import PressureHistogramUltra from '@/components/pressure/charts/PressureHistogramUltra.vue'
import PressureSpatialDistUltra from '@/components/pressure/charts/PressureSpatialDistUltra.vue'
import PressureCycleDetectUltra from '@/components/pressure/charts/PressureCycleDetectUltra.vue'
import PressureCorrelationUltra from '@/components/pressure/charts/PressureCorrelationUltra.vue'
import PressureColumnCompareUltra from '@/components/pressure/charts/PressureColumnCompareUltra.vue'
import NatureExportPanel from '@/components/pressure/NatureExportPanel.vue'
import LazyChart from '@/components/common/LazyChart.vue'
import PerformancePanel from '@/components/common/PerformancePanel.vue'
import { useKeyboardShortcuts, KEYBOARD_SHORTCUTS } from '@/composables/useKeyboardShortcuts'

// 新增 Nature 标准可视化组件
import PressureBoxPlot from '@/components/pressure/charts/PressureBoxPlot.vue'
import PressureCDF from '@/components/pressure/charts/PressureCDF.vue'
import PressureSpectral from '@/components/pressure/charts/PressureSpectral.vue'
import PressureScatterMatrix from '@/components/pressure/charts/PressureScatterMatrix.vue'
import AnomalyHeatmap from '@/components/pressure/charts/AnomalyHeatmap.vue'
import PressureRadar from '@/components/pressure/charts/PressureRadar.vue'
import PressureDensity from '@/components/pressure/charts/PressureDensity.vue'
import PressureContour from '@/components/pressure/charts/PressureContour.vue'

// 科研分析组件
import ResearchPanel from '@/components/pressure/ResearchPanel.vue'
import MethodologyPanel from '@/components/pressure/MethodologyPanel.vue'

// 导入数据处理函数
import {
  aggregateByDay,
  generateHeatmapMatrix,
  calculateStats,
  detectPressureCycles,
  detectAnomalies,
  calculateCorrelationMatrix,
  groupBySupport,
  getDateKey
} from '@/utils/pressureDataProcessor'

const router = useRouter()
const pageRef = ref(null)
const CHART_CENTER_SNAPSHOT_KEY = 'pressure_analysis_chart_snapshot_v1'
let chartSnapshotTimer = null

// ============================================================================
// 状态管理
// ============================================================================

// 智能分析工具配置（必须在模板使用前定义）
const analysisTools = [
  { id: 'anomaly', label: '异常检测', icon: '🔍' },
  { id: 'trend', label: '趋势分析', icon: '📈' },
  { id: 'forecast', label: '压力预测', icon: '🔮' },
  { id: 'cluster', label: '聚类分析', icon: '⚡' }
]

const loading = ref(false)
const loadingProgress = ref(0)
const sidebarCollapsed = ref(false)
const activeTab = ref('hist')

// 控制参数
const columnType = ref('all')
const startDate = ref(new Date('2025-01-01'))
const endDate = ref(new Date('2025-09-30'))
const lowThreshold = ref(10)
const highThreshold = ref(45)
const supportStart = ref(1)
const supportEnd = ref(125)
const showGrid = ref(false)
const showAnomalies = ref(false)
const showPeaks = ref(false)
const colorScheme = ref('diverging')

// 数据状态
const rawData = ref([])
const aggregatedData = ref(new Map())
const heatmapMatrix = ref([])
const heatmapCells = ref([])
const numRows = ref(0)
const numCols = ref(125)
const stats = ref(null)
const anomalies = ref([])

// 选中状态
const selectedSupport = ref(22)
const selectedSupportData = ref([])
const selectedSupportPeaks = ref([])

// 标签页配置
// Chart instances for export
const chartInstances = ref([])

// 图表组件引用
const histogramRef = ref(null)
const spatialRef = ref(null)
const cycleRef = ref(null)
const correlationRef = ref(null)
const compareRef = ref(null)

// 新增 Nature 图表组件引用
const boxplotRef = ref(null)
const cdfRef = ref(null)
const spectralRef = ref(null)
const scatterRef = ref(null)
const anomalyRef = ref(null)
const radarRef = ref(null)
const densityRef = ref(null)
const contourRef = ref(null)

// 收集所有图表实例
function collectChartInstances() {
  const instances = []
  const refs = [
    histogramRef.value,
    spatialRef.value,
    cycleRef.value,
    correlationRef.value,
    compareRef.value,
    boxplotRef.value,
    cdfRef.value,
    spectralRef.value,
    scatterRef.value,
    anomalyRef.value,
    radarRef.value,
    densityRef.value,
    contourRef.value
  ]
  
  refs.forEach(ref => {
    if (ref?.getChartInstance) {
      const instance = ref.getChartInstance()
      if (instance) instances.push(instance)
    }
  })
  
  chartInstances.value = instances
}

// 监听标签页切换，收集当前可见图表
watch(activeTab, () => {
  nextTick(() => {
    collectChartInstances()
  })
}, { immediate: true })

const chartTabs = [
  { id: 'hist', label: '分布', icon: '📊' },
  { id: 'spatial', label: '空间', icon: '🗺' },
  { id: 'cycle', label: '周期', icon: '🔄' },
  { id: 'corr', label: '相关', icon: '🔗' },
  { id: 'compare', label: '对比', icon: '⚖' },
  { id: 'boxplot', label: '箱线', icon: '📦' },
  { id: 'cdf', label: '累积', icon: '📈' },
  { id: 'spectral', label: '频谱', icon: '🔊' },
  { id: 'scatter', label: '矩阵', icon: '⬛' },
  { id: 'anomaly', label: '异常', icon: '⚠️' },
  { id: 'radar', label: '雷达', icon: '🕸️' },
  { id: 'density', label: '密度', icon: '🌊' },
  { id: 'contour', label: '等值', icon: '⭕' }
]

// ============================================================================
// 计算属性
// ============================================================================

const startDateStr = computed({
  get: () => startDate.value.toISOString().split('T')[0],
  set: (val) => startDate.value = new Date(val)
})

const endDateStr = computed({
  get: () => endDate.value.toISOString().split('T')[0],
  set: (val) => endDate.value = new Date(val)
})

const dateRangeText = computed(() => {
  if (!startDate.value || !endDate.value) return ''
  const fmt = (d) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
  return `${fmt(startDate.value)} - ${fmt(endDate.value)}`
})

const heatmapSubtitle = computed(() => {
  return `${dateRangeText.value} · 支架 #${supportStart.value}-${supportEnd.value}`
})

const anomalyCount = computed(() => anomalies.value.length)
const dataPoints = computed(() => rawData.value.length)

// 性能监控数据
const totalDataPoints = computed(() => rawData.value.length)
const totalCells = computed(() => numRows.value * numCols.value)

// 直方图数据
const histogramData = computed(() => {
  if (!heatmapMatrix.value.length) return []
  const values = heatmapMatrix.value.flat().filter(Number.isFinite)
  return values
})

// 空间分布数据
const spatialDistData = computed(() => {
  if (!rawData.value.length) return []
  const grouped = groupBySupport(rawData.value)
  const data = []
  for (let i = supportStart.value; i <= supportEnd.value; i++) {
    const values = grouped.get(i) || []
    if (values.length) {
      data.push({
        supportId: i,
        mean: calculateStats(values).mean,
        count: values.length
      })
    }
  }
  return data
})

// 周期数据
const cycleData = computed(() => {
  if (!heatmapMatrix.value.length) return []
  const midCol = Math.floor(numCols.value / 2)
  return heatmapMatrix.value.map((row, i) => ({
    date: new Date(startDate.value.getTime() + i * 24 * 60 * 60 * 1000),
    value: row[midCol]
  }))
})

const detectedPeriods = computed(() => {
  if (!cycleData.value.length) return null
  const values = cycleData.value.map(d => d.value).filter(Number.isFinite)
  return detectPressureCycles(values)
})

// 相关性矩阵
const correlationMatrix = computed(() => {
  if (!heatmapMatrix.value.length) return null
  return calculateCorrelationMatrix(heatmapMatrix.value)
})

// 前后柱数据
const frontColumnData = computed(() => 
  rawData.value.filter(r => r.columnType === '前左柱')
)

const rearColumnData = computed(() => 
  rawData.value.filter(r => r.columnType === '后右柱')
)

// ============================================================================
// 方法
// ============================================================================

function goBack() {
  router.back()
}

function buildChartSnapshot() {
  const compactRawRows = (rows = []) =>
    rows.map((row) => ([
      Number(row?.supportId ?? 0),
      Number(row?.finalResistanceValue ?? row?.value ?? 0),
      row?.cycleStartTime ? new Date(row.cycleStartTime).toISOString() : (row?.date ? new Date(row.date).toISOString() : null),
      String(row?.columnType || '')
    ]))

  const compactSeriesRows = (rows = []) =>
    rows.map((row) => ([
      row?.date ? new Date(row.date).toISOString() : null,
      Number(row?.value ?? row?.finalResistanceValue ?? 0),
      Number(row?.std ?? 0)
    ]))

  return {
    version: 2,
    createdAt: Date.now(),
    context: {
      dateRangeText: dateRangeText.value,
      startDateIso: startDate.value ? new Date(startDate.value).toISOString() : null,
      endDateIso: endDate.value ? new Date(endDate.value).toISOString() : null,
      supportStart: supportStart.value,
      supportEnd: supportEnd.value,
      selectedSupport: selectedSupport.value,
      anomalyCount: anomalyCount.value
    },
    datasets: {
      rawData: compactRawRows(rawData.value),
      heatmapMatrix: heatmapMatrix.value,
      numRows: numRows.value,
      stats: stats.value,
      detectedPeriods: detectedPeriods.value,
      correlationMatrix: correlationMatrix.value,
      selectedSupportData: compactSeriesRows(selectedSupportData.value)
    }
  }
}

function persistChartSnapshot() {
  if (!rawData.value.length || !heatmapMatrix.value.length) return
  try {
    const snapshot = buildChartSnapshot()
    window.sessionStorage?.setItem(CHART_CENTER_SNAPSHOT_KEY, JSON.stringify(snapshot))
  } catch (error) {
    console.warn('Failed to persist chart snapshot:', error)
  }
}

function schedulePersistChartSnapshot() {
  if (chartSnapshotTimer) {
    clearTimeout(chartSnapshotTimer)
  }
  chartSnapshotTimer = setTimeout(() => {
    persistChartSnapshot()
    chartSnapshotTimer = null
  }, 120)
}

function openChartCenter() {
  persistChartSnapshot()
  router.push({ name: 'PressureAnalysisCharts' })
}

function formatNumber(num) {
  if (!num) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// 布局模式
const layoutMode = ref('default') // 'default', 'compact', 'focus'
const layoutModes = [
  { id: 'default', label: '默认布局', icon: '◫' },
  { id: 'compact', label: '紧凑布局', icon: '▣' },
  { id: 'focus', label: '聚焦模式', icon: '⊙' }
]

// 智能分析工具状态
const activeTool = ref(null)
const toolLoading = ref(null)

// 分析结果
const analysisResults = ref({
  anomaly: null,
  trend: null,
  forecast: null,
  cluster: null
})

function toggleLayout() {
  const currentIndex = layoutModes.findIndex(m => m.id === layoutMode.value)
  const nextIndex = (currentIndex + 1) % layoutModes.length
  layoutMode.value = layoutModes[nextIndex].id
  
  // 应用布局
  applyLayout()
  
  // 显示提示
  showToast(`已切换到: ${layoutModes[nextIndex].label}`)
}

function applyLayout() {
  // 触发重绘以应用新布局
  nextTick(() => {
    // 通知子组件重新计算尺寸
    window.dispatchEvent(new Event('resize'))
  })
}

// Toast 提示
const toast = ref({ show: false, message: '' })
let toastTimeout = null

function showToast(message) {
  toast.value = { show: true, message }
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

async function exportReport() {
  showExportModal.value = true
}

// 导出状态
const showExportModal = ref(false)
const showPerformancePanel = ref(false)
const showShortcutsHelp = ref(false)
const currentFps = ref(60)
const currentRenderTime = ref(0)
const lowPowerMode = ref(false)

const exportOptions = ref([
  { id: 'pdf', label: '导出 PDF 报告', icon: '📄' },
  { id: 'excel', label: '导出 Excel 数据', icon: '📊' },
  { id: 'csv', label: '导出 CSV 数据', icon: '📋' },
  { id: 'json', label: '导出 JSON 数据', icon: '{ }' }
])

// 导出处理函数
async function handleExport(exportId) {
  showExportModal.value = false
  
  switch (exportId) {
    case 'pdf':
      await exportPDFReport()
      break
    case 'excel':
      await exportExcelData()
      break
    case 'csv':
      await exportCSVData()
      break
    case 'json':
      await exportJSONData()
      break
  }
}

// 处理低功耗模式
function handleLowPowerMode(enabled) {
  lowPowerMode.value = enabled
  showToast(enabled ? '已开启省电模式' : '已关闭省电模式')
  // 可以在这里添加更多优化逻辑，如降低动画质量等
}

// 导出 PDF 报告
async function exportPDFReport() {
  showToast('正在生成 PDF 报告...')
  
  try {
    // 收集所有图表数据
    const reportData = {
      title: '矿压数据分析报告',
      workFace: '02工作面',
      dateRange: dateRangeText.value,
      generatedAt: new Date().toLocaleString('zh-CN'),
      stats: stats.value,
      summary: generateReportSummary()
    }
    
    // 创建报告 HTML
    const reportHTML = generateReportHTML(reportData)
    
    // 打开打印窗口
    const printWindow = window.open('', '_blank')
    printWindow.document.write(reportHTML)
    printWindow.document.close()
    
    // 延迟打印以等待资源加载
    setTimeout(() => {
      printWindow.print()
    }, 500)
    
    showToast('PDF 报告已生成')
  } catch (error) {
    console.error('导出失败:', error)
    showToast('导出失败，请重试')
  }
}

function generateReportSummary() {
  if (!stats.value) return ''
  return `本次分析涵盖 ${dateRangeText.value} 期间的矿压数据，共 ${rawData.value.length} 个数据点。
平均矿压为 ${stats.value.mean.toFixed(2)} MPa，峰值达到 ${stats.value.max.toFixed(2)} MPa。
${anomalyCount.value > 0 ? `检测到 ${anomalyCount.value} 个异常数据点，建议进一步分析。` : '未发现明显异常数据。'}`
}

function generateReportHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${data.title}</title>
      <style>
        body { font-family: 'Microsoft YaHei', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { font-size: 24px; border-bottom: 2px solid #1a1a1a; padding-bottom: 10px; }
        .meta { color: #666; margin: 20px 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }
        .stat-box { background: #f5f5f5; padding: 16px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #1a1a1a; }
        .stat-label { font-size: 12px; color: #666; margin-top: 4px; }
        .summary { background: #fafafa; padding: 20px; border-radius: 8px; line-height: 1.8; margin-top: 24px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <h1>${data.title}</h1>
      <div class="meta">
        <div>工作面: ${data.workFace}</div>
        <div>时间范围: ${data.dateRange}</div>
        <div>生成时间: ${data.generatedAt}</div>
      </div>
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">${data.stats?.mean?.toFixed(2) || '--'}</div>
          <div class="stat-label">平均值 (MPa)</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${data.stats?.max?.toFixed(2) || '--'}</div>
          <div class="stat-label">最大值 (MPa)</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${data.stats?.min?.toFixed(2) || '--'}</div>
          <div class="stat-label">最小值 (MPa)</div>
        </div>
      </div>
      <div class="summary">
        <strong>分析摘要</strong><br>
        ${data.summary}
      </div>
      <div class="footer">
        本报告由矿压监测系统自动生成
      </div>
    </body>
    </html>
  `
}

// 导出 Excel 数据
async function exportExcelData() {
  showToast('正在生成 Excel...')
  
  try {
    // 使用 CSV 格式作为 Excel 兼容格式
    const csv = convertToCSV(rawData.value)
    downloadFile(csv, `矿压数据_${formatDateForFilename()}.csv`, 'text/csv;charset=utf-8;')
    showToast('Excel 数据已导出')
  } catch (error) {
    console.error('导出失败:', error)
    showToast('导出失败')
  }
}

// 导出 CSV 数据
async function exportCSVData() {
  showToast('正在生成 CSV...')
  
  try {
    const csv = convertToCSV(rawData.value)
    downloadFile(csv, `矿压数据_${formatDateForFilename()}.csv`, 'text/csv;charset=utf-8;')
    showToast('CSV 数据已导出')
  } catch (error) {
    console.error('导出失败:', error)
    showToast('导出失败')
  }
}

// 导出 JSON 数据
async function exportJSONData() {
  showToast('正在生成 JSON...')
  
  try {
    const json = JSON.stringify({
      metadata: {
        exportTime: new Date().toISOString(),
        workFace: '02工作面',
        dateRange: dateRangeText.value
      },
      data: rawData.value
    }, null, 2)
    downloadFile(json, `矿压数据_${formatDateForFilename()}.json`, 'application/json')
    showToast('JSON 数据已导出')
  } catch (error) {
    console.error('导出失败:', error)
    showToast('导出失败')
  }
}

// 转换为 CSV
function convertToCSV(data) {
  if (!data.length) return ''
  
  const headers = Object.keys(data[0])
  const rows = data.map(row => 
    headers.map(h => {
      const val = row[h]
      // 处理包含逗号或换行符的值
      if (typeof val === 'string' && (val.includes(',') || val.includes('\n') || val.includes('"'))) {
        return `"${val.replace(/"/g, '""')}"`
      }
      return val
    }).join(',')
  )
  
  return [headers.join(','), ...rows].join('\n')
}

// 下载文件
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function formatDateForFilename() {
  const now = new Date()
  return `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    pageRef.value?.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function applyFilters() {
  loadData()
}

function resetFilters() {
  columnType.value = 'all'
  startDate.value = new Date('2025-01-01')
  endDate.value = new Date('2025-09-30')
  lowThreshold.value = 10
  highThreshold.value = 45
  supportStart.value = 1
  supportEnd.value = 125
  showGrid.value = false
  showAnomalies.value = false
  showPeaks.value = false
  loadData()
}

function onCellSelect(cell) {
  if (cell) {
    selectedSupport.value = cell.supportId
    updateSelectedSupportData()
    schedulePersistChartSnapshot()
  }
}

function onHeatmapExport() {
  showToast('热力图已导出')
}

function onSchemeChange(scheme) {
  colorScheme.value = scheme
}

function onExportComplete(results) {
  const successCount = results.filter(r => r.success).length
  showToast(`成功导出 ${successCount} 个图表`)
}

// 科研分析相关数据
const researchData = computed(() => ({
  heatmapMatrix: heatmapMatrix.value,
  stats: stats.value,
  dateRange: dateRangeText.value,
  supportRange: `${supportStart.value}-${supportEnd.value}`,
  rawData: rawData.value
}))

function onResearchPaletteChange(palette) {
  // 更新热力图配色方案
  colorScheme.value = palette.name.toLowerCase()
  showToast(`已切换到配色方案: ${palette.name}`)
}

function onResearchExport(config) {
  // 触发图表导出
  showToast(`正在导出 ${config.format.toUpperCase()} 格式 (DPI: ${config.dpi})...`)
  
  // 调用NatureExportPanel的导出功能
  // 这里可以扩展为支持更多导出选项
  setTimeout(() => {
    showToast('导出完成')
  }, 1000)
}

// 执行智能分析工具
async function executeTool(toolId) {
  if (toolLoading.value) return
  
  toolLoading.value = toolId
  activeTool.value = toolId
  
  try {
    // 模拟分析延迟
    await new Promise(r => setTimeout(r, 1500))
    
    switch (toolId) {
      case 'anomaly':
        await runAnomalyDetection()
        break
      case 'trend':
        await runTrendAnalysis()
        break
      case 'forecast':
        await runForecast()
        break
      case 'cluster':
        await runClusterAnalysis()
        break
    }
  } finally {
    toolLoading.value = null
  }
}

async function runAnomalyDetection() {
  // 使用现有的异常检测逻辑
  showAnomalies.value = true
  
  const values = rawData.value.map(r => r.finalResistanceValue)
  const { detectAnomalies } = await import('@/utils/pressureDataProcessor')
  const result = detectAnomalies(values, 2)
  
  analysisResults.value.anomaly = {
    count: result.indices.length,
    indices: result.indices,
    threshold: result.threshold
  }
  
  showToast(`检测到 ${result.indices.length} 个异常点`)
  
  // 切换到相关标签页
  activeTab.value = 'hist'
}

async function runTrendAnalysis() {
  if (!selectedSupportData.value.length) {
    showToast('请先选择支架')
    return
  }
  
  const values = selectedSupportData.value.map(d => d.value)
  const n = values.length
  
  // 简单线性回归
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0
  values.forEach((y, x) => {
    sumX += x
    sumY += y
    sumXY += x * y
    sumXX += x * x
  })
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  const trend = slope > 0 ? '上升' : slope < 0 ? '下降' : '平稳'
  
  analysisResults.value.trend = {
    slope,
    intercept,
    trend,
    r2: calculateR2(values, slope, intercept)
  }
  
  showToast(`趋势分析: ${trend}趋势 (斜率: ${slope.toFixed(4)})`)
  showPeaks.value = true
}

function calculateR2(values, slope, intercept) {
  const n = values.length
  const yMean = values.reduce((a, b) => a + b, 0) / n
  
  let ssRes = 0, ssTot = 0
  values.forEach((y, x) => {
    const yPred = slope * x + intercept
    ssRes += Math.pow(y - yPred, 2)
    ssTot += Math.pow(y - yMean, 2)
  })
  
  return 1 - (ssRes / ssTot)
}

async function runForecast() {
  if (!selectedSupportData.value.length) {
    showToast('请先选择支架')
    return
  }
  
  // 简单预测：基于最近7天的平均值
  const recent = selectedSupportData.value.slice(-7)
  const avg = recent.reduce((a, b) => a + b.value, 0) / recent.length
  
  analysisResults.value.forecast = {
    next7Days: avg,
    confidence: 0.85,
    trend: avg > stats.value?.mean ? '高于平均' : '低于平均'
  }
  
  showToast(`预测未来7天平均压力: ${avg.toFixed(2)} MPa`)
}

async function runClusterAnalysis() {
  // 简单聚类：将支架按压力值分为高、中、低三组
  const grouped = {}
  rawData.value.forEach(r => {
    if (!grouped[r.supportId]) grouped[r.supportId] = []
    grouped[r.supportId].push(r.finalResistanceValue)
  })
  
  const supportMeans = Object.entries(grouped).map(([id, values]) => ({
    id: parseInt(id),
    mean: values.reduce((a, b) => a + b, 0) / values.length
  }))
  
  const sorted = supportMeans.sort((a, b) => a.mean - b.mean)
  const n = sorted.length
  
  analysisResults.value.cluster = {
    low: sorted.slice(0, Math.floor(n / 3)),
    medium: sorted.slice(Math.floor(n / 3), Math.floor(2 * n / 3)),
    high: sorted.slice(Math.floor(2 * n / 3))
  }
  
  showToast(`聚类完成: 低压${analysisResults.value.cluster.low.length}个, 中压${analysisResults.value.cluster.medium.length}个, 高压${analysisResults.value.cluster.high.length}个`)
  
  // 切换到空间分布标签
  activeTab.value = 'spatial'
}

// 生成更真实的模拟数据
function generateMockData() {
  const mockData = []
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  
  // 添加一些周期性模式
  const cycleLength = 30 // 30天周期
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfCycle = Math.floor((d - start) / (24 * 60 * 60 * 1000)) % cycleLength
    const cycleFactor = Math.sin((dayOfCycle / cycleLength) * Math.PI * 2) * 0.3 + 1
    
    for (let s = supportStart.value; s <= supportEnd.value; s++) {
      // 基础值 + 位置相关 + 周期 + 随机噪声
      const baseValue = 20 + (s / supportEnd.value) * 15
      const positionFactor = Math.sin(s / 20) * 5
      const noise = (Math.random() - 0.5) * 10
      const value = Math.max(5, Math.min(60, 
        (baseValue + positionFactor) * cycleFactor + noise
      ))
      
      mockData.push({
        workFaceName: '02工作面',
        supportId: s,
        columnType: s % 2 === 0 ? '前左柱' : '后右柱',
        cycleStartTime: new Date(d),
        cycleEndTime: new Date(d.getTime() + 10 * 60 * 1000),
        finalResistanceTime: new Date(d),
        finalResistanceValue: value
      })
    }
  }
  
  rawData.value = mockData
}

function processData() {
  if (!rawData.value.length) return
  
  loading.value = true
  loadingProgress.value = 0
  
  // 模拟渐进式加载
  const steps = 5
  let currentStep = 0
  
  const processStep = () => {
    currentStep++
    loadingProgress.value = (currentStep / steps) * 100
    
    if (currentStep === 1) {
      aggregatedData.value = aggregateByDay(rawData.value, columnType.value)
    } else if (currentStep === 2) {
      const result = generateHeatmapMatrix(aggregatedData.value, {
        startDate: startDate.value,
        endDate: endDate.value,
        numSupports: supportEnd.value - supportStart.value + 1,
        supportStart: supportStart.value
      })
      heatmapMatrix.value = result.matrix
      heatmapCells.value = result.cells
      numRows.value = result.numRows
      numCols.value = result.numCols
      stats.value = result.stats
    } else if (currentStep === 3) {
      const values = rawData.value.map(r => r.finalResistanceValue)
      const anomalyResult = detectAnomalies(values, 2)
      anomalies.value = anomalyResult.indices.map(i => ({
        index: i,
        value: values[i]
      }))
    } else if (currentStep === 4) {
      updateSelectedSupportData()
    } else if (currentStep >= steps) {
      loading.value = false
      loadingProgress.value = 100
      schedulePersistChartSnapshot()
      return
    }
    
    setTimeout(processStep, 50)
  }
  
  processStep()
}

function updateSelectedSupportData() {
  const supportData = []
  const current = new Date(startDate.value)
  
  while (current <= endDate.value) {
    const dateKey = getDateKey(current)
    const dayData = aggregatedData.value.get(dateKey)
    
    if (dayData?.has(selectedSupport.value)) {
      const cellStats = dayData.get(selectedSupport.value)
      supportData.push({
        date: new Date(current),
        value: cellStats.mean,
        std: cellStats.std
      })
    }
    
    current.setDate(current.getDate() + 1)
  }
  
  selectedSupportData.value = supportData
  
  const values = supportData.map(d => d.value)
  const cycleResult = detectPressureCycles(values)
  selectedSupportPeaks.value = cycleResult.peakIndices || []
}

async function loadData() {
  loading.value = true
  try {
    generateMockData()
    processData()
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

// ============================================================================
// 生命周期
// ============================================================================

onMounted(() => {
  loadData()
  schedulePersistChartSnapshot()
  
  // 设置键盘快捷键
  useKeyboardShortcuts({
    'Ctrl+0': () => {
      showToast('视图已重置 (快捷键)')
    },
    'Ctrl+e': () => {
      showExportModal.value = true
    },
    'Ctrl+Enter': () => {
      applyFilters()
    },
    'Ctrl+Shift+r': () => {
      resetFilters()
    },
    'Ctrl+g': () => {
      showGrid.value = !showGrid.value
    },
    'F11': () => {
      toggleFullscreen()
    },
    'Ctrl+Shift+a': () => {
      executeTool('anomaly')
    },
    'Ctrl+Shift+t': () => {
      executeTool('trend')
    },
    '?': () => {
      showShortcutsHelp.value = true
    }
  })
  
  // FPS 监控
  let lastTime = performance.now()
  let frames = 0
  const fpsLoop = () => {
    frames++
    const currentTime = performance.now()
    if (currentTime - lastTime >= 1000) {
      currentFps.value = frames
      frames = 0
      lastTime = currentTime
    }
    requestAnimationFrame(fpsLoop)
  }
  requestAnimationFrame(fpsLoop)
})

watch(
  [
    rawData,
    heatmapMatrix,
    stats,
    anomalies,
    selectedSupportData,
    startDate,
    endDate,
    supportStart,
    supportEnd,
    columnType
  ],
  () => {
    schedulePersistChartSnapshot()
  },
  { deep: true, flush: 'post' }
)

onBeforeUnmount(() => {
  if (chartSnapshotTimer) {
    clearTimeout(chartSnapshotTimer)
    chartSnapshotTimer = null
  }
  persistChartSnapshot()
})

watch([columnType, startDate, endDate, supportStart, supportEnd], () => {
  // 防抖处理
  const timeout = setTimeout(() => {
    // 可选：自动更新
  }, 500)
  return () => clearTimeout(timeout)
})
</script>

<style scoped>
.pressure-analysis-ultra {
  --nav-height: 64px;
  --status-height: 40px;
  --sidebar-width: 280px;
  --panel-gap: 16px;
  
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
  min-width: 1280px; /* 确保最小宽度，防止内容被挤出 */
}

/* Top Navigation */
.top-nav-ultra {
  height: var(--nav-height);
  background: white;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #525252;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #1a1a1a;
  color: white;
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.page-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.workface-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge {
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #525252;
}

.date-range {
  font-size: 12px;
  color: #737373;
}

.nav-stats {
  display: flex;
  align-items: center;
}

.stat-cards {
  display: flex;
  gap: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #f5f5f5;
  border-radius: 8px;
}

.stat-card.warning {
  background: #fef2f2;
}

.stat-label {
  font-size: 11px;
  font-weight: 500;
  color: #737373;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-value.highlight {
  color: #D55E00;
}

.stat-value.warning {
  color: #dc2626;
}

.stat-unit {
  font-size: 10px;
  color: #a3a3a3;
}

.nav-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #525252;
  transition: all 0.2s;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.action-btn.primary {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: white;
}

.action-btn.primary:hover {
  background: #333;
}

/* Main Content */
.main-content-ultra {
  flex: 1;
  display: flex;
  overflow: auto; /* 允许横向滚动 */
  padding: var(--panel-gap);
  gap: var(--panel-gap);
}

/* Control Sidebar */
.control-sidebar {
  width: var(--sidebar-width);
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  transition: width 0.3s;
}

.control-sidebar.collapsed {
  width: 0;
  overflow: hidden;
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: white;
  border: 1px solid #e5e5e5;
  border-left: none;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 2px 0 8px rgba(0,0,0,0.06);
}

.sidebar-toggle svg {
  width: 14px;
  height: 14px;
  color: #737373;
  transition: transform 0.3s;
}

.control-sidebar.collapsed .sidebar-toggle svg {
  transform: rotate(180deg);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.control-section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-title svg {
  width: 14px;
  height: 14px;
  color: #525252;
}

.control-group {
  margin-bottom: 12px;
}

.control-group label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #525252;
  margin-bottom: 6px;
}

.control-select,
.control-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 12px;
  background: white;
  transition: all 0.2s;
}

.control-select:focus,
.control-input:focus {
  outline: none;
  border-color: #1a1a1a;
}

.date-inputs,
.range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-inputs span,
.range-inputs span {
  font-size: 11px;
  color: #737373;
}

.control-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: #e5e5e5;
  border-radius: 2px;
  outline: none;
}

.control-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #1a1a1a;
  border-radius: 50%;
  cursor: pointer;
}

.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toggle-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.toggle-item input {
  display: none;
}

.toggle-slider {
  width: 36px;
  height: 20px;
  background: #e5e5e5;
  border-radius: 10px;
  position: relative;
  transition: all 0.2s;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  left: 2px;
  top: 2px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.toggle-item input:checked + .toggle-slider {
  background: #1a1a1a;
}

.toggle-item input:checked + .toggle-slider::after {
  left: 18px;
}

.toggle-label {
  font-size: 12px;
  color: #525252;
}

.control-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #1a1a1a;
  border: none;
  color: white;
}

.btn-primary:hover {
  background: #333;
}

.btn-secondary {
  background: white;
  border: 1px solid #e5e5e5;
  color: #525252;
}

.btn-secondary:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.btn-primary svg,
.btn-secondary svg {
  width: 14px;
  height: 14px;
}

/* Analysis Tools */
.analysis-tools {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tool-btn:hover:not(:disabled) {
  border-color: #1a1a1a;
  background: #fafafa;
}

.tool-btn.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: white;
}

.tool-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tool-icon {
  font-size: 20px;
}

.tool-label {
  font-size: 11px;
  font-weight: 500;
}

.tool-spinner {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(0,0,0,0.1);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.tool-btn.active .tool-spinner {
  border-color: rgba(255,255,255,0.3);
  border-top-color: white;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Visualization Area */
.visualization-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--panel-gap);
  min-width: 0;
}

.heatmap-panel {
  flex: 2;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  overflow: hidden;
  min-height: 0;
}

.timeline-panel {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  overflow: hidden;
  min-height: 200px;
}

/* Analysis Sidebar */
.analysis-sidebar {
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  height: calc(100vh - var(--nav-height) - var(--status-height) - var(--panel-gap) * 2);
  overflow-y: auto;
  padding-right: 4px;
}

.analysis-sidebar::-webkit-scrollbar {
  width: 4px;
}

.analysis-sidebar::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 2px;
}

.analysis-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  flex-shrink: 0;
}

.kpi-card {
  background: white;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.kpi-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon svg {
  width: 18px;
  height: 18px;
}

.kpi-data {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.kpi-value {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.kpi-value.warning {
  color: #dc2626;
}

.kpi-unit {
  font-size: 10px;
  font-weight: 500;
  color: #a3a3a3;
}

.kpi-label {
  font-size: 11px;
  color: #737373;
}

.chart-hub-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  display: grid;
  gap: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.hub-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.hub-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.hub-badge {
  padding: 2px 8px;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.hub-desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: #4b5563;
}

.hub-actions {
  display: flex;
  justify-content: flex-start;
}

.hub-btn {
  height: 34px;
  border: none;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 0 14px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.hub-btn:hover {
  opacity: 0.9;
}

.chart-tabs-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 260px;
  flex-shrink: 0;
}

.tabs-header {
  display: flex;
  gap: 3px;
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #d0d0d0 transparent;
}

.tabs-header::-webkit-scrollbar {
  height: 4px;
}

.tabs-header::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 2px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #737373;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.tab-btn:hover {
  background: #f5f5f5;
  color: #525252;
}

.tab-btn.active {
  background: #1a1a1a;
  color: white;
}

.tab-icon {
  font-size: 14px;
}

.tabs-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.tab-panel {
  height: 100%;
  padding: 12px;
}

.tab-slide-enter-active,
.tab-slide-leave-active {
  transition: all 0.3s ease;
}

.tab-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.tab-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Status Bar */
.status-bar-ultra {
  height: var(--status-height);
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #525252;
}

.status-dot.active {
  background: #22c55e;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-label {
  color: #a3a3a3;
}

.status-value {
  color: white;
  font-weight: 600;
}

.status-value.highlight {
  color: #4da6e8;
}

.status-divider {
  width: 1px;
  height: 16px;
  background: #404040;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #22c55e;
  font-size: 12px;
}

.loading-spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(34, 197, 94, 0.2);
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1a1a;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  z-index: 10000;
}

.toast-icon {
  width: 20px;
  height: 20px;
  background: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 360px;
  max-width: 90vw;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 20px;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.export-option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.export-option-btn:hover {
  background: #f5f5f5;
  border-color: #d0d0d0;
}

.export-icon {
  font-size: 20px;
}

.export-label {
  font-size: 14px;
  color: #333;
}

/* Shortcuts Modal */
.shortcuts-modal {
  max-width: 480px;
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.shortcut-group h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.shortcut-item:last-child {
  border-bottom: none;
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  padding: 4px 8px;
  background: #f5f5f5;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  box-shadow: 0 2px 0 #d0d0d0;
}

.shortcut-item span {
  font-size: 13px;
  color: #525252;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}

/* Layout Indicator */
.layout-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  font-size: 0;
}

.action-btn {
  position: relative;
}

/* ========== 响应式布局优化 ========== */

/* 大屏幕 (1440px+) */
@media (min-width: 1440px) {
  .pressure-analysis-ultra {
    --sidebar-width: 300px;
    --panel-gap: 20px;
  }
  
  .analysis-sidebar {
    width: 360px;
  }
}

/* 中等屏幕 (1280px - 1439px) */
@media (max-width: 1439px) and (min-width: 1280px) {
  .pressure-analysis-ultra {
    --sidebar-width: 260px;
    --panel-gap: 14px;
  }
  
  .analysis-sidebar {
    width: 330px;
  }
}

/* 小屏幕 (1024px - 1279px) */
@media (max-width: 1279px) and (min-width: 1024px) {
  .pressure-analysis-ultra {
    --sidebar-width: 240px;
    --panel-gap: 12px;
  }
  
  .analysis-sidebar {
    width: 280px;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs-header {
    flex-wrap: wrap;
  }
  
  .tab-btn {
    padding: 6px 10px;
    font-size: 11px;
  }
}

/* 平板屏幕 (768px - 1023px) */
@media (max-width: 1023px) and (min-width: 768px) {
  .pressure-analysis-ultra {
    --nav-height: 56px;
    --sidebar-width: 220px;
    --panel-gap: 10px;
  }
  
  .analysis-sidebar {
    width: 240px;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .kpi-card {
    padding: 12px;
  }
  
  .kpi-icon {
    width: 40px;
    height: 40px;
  }
  
  .kpi-value {
    font-size: 18px;
  }
  
  .tab-btn {
    padding: 5px 8px;
    font-size: 10px;
  }
  
  .tab-icon {
    font-size: 14px;
  }
}

/* 超小屏幕 (< 768px) - 移动端优化 */
@media (max-width: 767px) {
  .pressure-analysis-ultra {
    --nav-height: 52px;
    --panel-gap: 8px;
    min-width: auto;
  }
  
  .main-content-ultra {
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .control-sidebar {
    width: 100%;
    max-height: 200px;
    order: -1;
  }
  
  .control-sidebar.collapsed {
    width: 100%;
    max-height: 40px;
  }
  
  .visualization-area {
    min-height: 400px;
  }
  
  .analysis-sidebar {
    width: 100%;
  }
  
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-hub-card {
    padding: 12px;
  }
  
  .tabs-header {
    padding: 8px;
    gap: 2px;
  }
  
  .tab-btn {
    padding: 5px 8px;
    font-size: 10px;
  }
  
  .tab-label {
    display: none;
  }
  
  .nav-stats {
    display: none;
  }
  
  .page-title {
    font-size: 16px;
  }
}

/* 图表加载动画 */
.chart-fade-enter-active,
.chart-fade-leave-active {
  transition: opacity 0.3s ease;
}

.chart-fade-enter-from,
.chart-fade-leave-to {
  opacity: 0;
}

/* 骨架屏适配 */
@media (max-width: 1023px) {
  .skeleton-card {
    padding: 12px;
  }
  
  .skeleton-header {
    margin-bottom: 12px;
  }
  
  .skeleton-badge {
    width: 24px;
    height: 24px;
  }
  
  .skeleton-title {
    width: 100px;
    height: 14px;
  }
}

/* 性能优化：减少动画 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .pressure-analysis-ultra {
    background: #1a1a1a;
  }
  
  .top-nav-ultra,
  .control-sidebar,
  .kpi-card,
  .chart-tabs-container,
  .modal-content {
    background: #242424;
    color: #e0e0e0;
  }
  
  .section-title,
  .kpi-label,
  .tab-label {
    color: #b0b0b0;
  }
}
</style>
