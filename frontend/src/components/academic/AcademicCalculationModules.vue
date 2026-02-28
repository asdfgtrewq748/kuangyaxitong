<template>
  <section class="card calculation-card">
    <div class="section-header">
      <h2>{{ aa('calcModuleTitle') }}</h2>
      <p>{{ aa('calcModuleDesc') }}</p>
    </div>

    <div class="calc-grid">
      <div class="calc-module">
        <div class="module-header">
          <span class="module-tag">RSI</span>
          <h3>{{ aa('calc.rsiTitle') }}</h3>
        </div>
        <div class="module-params">
          <div class="param-group">
            <label>{{ aa('calc.strataData') }}</label>
            <div class="strata-list">
              <div class="strata-item" v-for="(layer, i) in strataData" :key="i">
                <span>{{ aa(layer.nameKey) }}</span>
                <span>{{ aa('calc.thickness') }}: {{ layer.thickness }}m</span>
                <span>{{ aa('calc.tensileStrength') }}: {{ layer.tensile_strength }}MPa</span>
              </div>
            </div>
          </div>
        </div>
        <button class="btn calc-btn" @click="emit('calculate-rsi')" :disabled="calculating.rsi">
          <span v-if="calculating.rsi" class="spinner sm"></span>
          <span>{{ calculating.rsi ? aa('calc.calculating') : aa('calc.run') }}</span>
        </button>
        <div v-if="results.rsi" class="module-result">
          <div :ref="setRsiChartRef" class="chart-container"></div>
        </div>
      </div>

      <div class="calc-module">
        <div class="module-header">
          <span class="module-tag">BRI</span>
          <h3>{{ aa('calc.briTitle') }}</h3>
        </div>
        <div class="module-params">
          <div class="param-group">
            <label>{{ aa('calc.microseismicEvents') }}</label>
            <div class="event-list">
              <div class="event-item" v-for="(event, i) in microseismicData" :key="i">
                <span>{{ event.time }}</span>
                <span>{{ aa('calc.magnitude') }}: M{{ event.magnitude }}</span>
              </div>
            </div>
          </div>
        </div>
        <button class="btn calc-btn" @click="emit('calculate-bri')" :disabled="calculating.bri">
          <span v-if="calculating.bri" class="spinner sm"></span>
          <span>{{ calculating.bri ? aa('calc.calculating') : aa('calc.run') }}</span>
        </button>
        <div v-if="results.bri" class="module-result">
          <div :ref="setBriChartRef" class="chart-container"></div>
        </div>
      </div>

      <div class="calc-module">
        <div class="module-header">
          <span class="module-tag">ASI</span>
          <h3>{{ aa('calc.asiTitle') }}</h3>
        </div>
        <div class="module-params">
          <div class="param-row">
            <label>{{ aa('calc.tunnelRadius') }}</label>
            <input type="number" :value="tunnelParams.radius" class="param-input" @input="handleTunnelInput('radius', $event)"/>
            <span>m</span>
          </div>
          <div class="param-row">
            <label>{{ aa('calc.inSituStress') }}</label>
            <input type="number" :value="tunnelParams.original_stress" class="param-input" @input="handleTunnelInput('original_stress', $event)"/>
            <span>MPa</span>
          </div>
          <div class="param-row">
            <label>{{ aa('calc.supportPressure') }}</label>
            <input type="number" :value="tunnelParams.support_pressure" class="param-input" @input="handleTunnelInput('support_pressure', $event)"/>
            <span>MPa</span>
          </div>
          <div class="param-row">
            <label>{{ aa('calc.ustB') }}</label>
            <input type="range" :value="tunnelParams.ust_b" min="0" max="1" step="0.1" class="param-slider" @input="handleTunnelInput('ust_b', $event)"/>
            <span>{{ tunnelParams.ust_b }}</span>
          </div>
        </div>
        <button class="btn calc-btn" @click="emit('calculate-asi')" :disabled="calculating.asi">
          <span v-if="calculating.asi" class="spinner sm"></span>
          <span>{{ calculating.asi ? aa('calc.calculating') : aa('calc.run') }}</span>
        </button>
        <div v-if="results.asi" class="module-result">
          <div :ref="setAsiChartRef" class="chart-container"></div>
        </div>
      </div>

      <div class="calc-module fusion-module">
        <div class="module-header">
          <span class="module-tag">DBN</span>
          <h3>{{ aa('calc.dbnTitle') }}</h3>
        </div>
        <div class="fusion-weights">
          <div class="weight-control" v-for="w in weightItems" :key="w.key">
            <label>{{ aa(w.labelKey) }}</label>
            <input type="range" :value="weights[w.key]" min="0" max="1" step="0.05" @input="handleWeightInput(w.key, $event)"/>
            <span>{{ (normalizedWeights[w.key] * 100).toFixed(0) }}%</span>
          </div>
        </div>
        <div class="weight-bar">
          <div class="weight-segment rsi" :style="{ width: normalizedWeights.rsi * 100 + '%' }"></div>
          <div class="weight-segment bri" :style="{ width: normalizedWeights.bri * 100 + '%' }"></div>
          <div class="weight-segment asi" :style="{ width: normalizedWeights.asi * 100 + '%' }"></div>
        </div>
        <button class="btn calc-btn fusion-btn" @click="emit('calculate-comprehensive')" :disabled="calculating.fusion">
          <span v-if="calculating.fusion" class="spinner sm"></span>
          <span>{{ calculating.fusion ? aa('calc.fusing') : aa('calc.comprehensive') }}</span>
        </button>
        <div v-if="results.fusion" class="fusion-result">
          <div class="mpi-display">
            <span class="mpi-label">{{ aa('mpiLabel') }}</span>
            <span class="mpi-value" :class="valueClass(results.fusion.mpi)">{{ Number(results.fusion.mpi).toFixed(1) }}</span>
            <span class="mpi-risk" :class="results.fusion.riskClass">{{ aa(`risk.${results.fusion.riskKey}`) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(['calculate-rsi', 'calculate-bri', 'calculate-asi', 'calculate-comprehensive'])

const props = defineProps({
  aa: {
    type: Function,
    required: true
  },
  strataData: {
    type: Array,
    required: true
  },
  microseismicData: {
    type: Array,
    required: true
  },
  tunnelParams: {
    type: Object,
    required: true
  },
  weightItems: {
    type: Array,
    required: true
  },
  weights: {
    type: Object,
    required: true
  },
  normalizedWeights: {
    type: Object,
    required: true
  },
  calculating: {
    type: Object,
    required: true
  },
  results: {
    type: Object,
    required: true
  },
  valueClass: {
    type: Function,
    required: true
  },
  setRsiChartRef: {
    type: Function,
    required: true
  },
  setBriChartRef: {
    type: Function,
    required: true
  },
  setAsiChartRef: {
    type: Function,
    required: true
  },
  updateTunnelParam: {
    type: Function,
    required: true
  },
  updateWeight: {
    type: Function,
    required: true
  }
})

const toNumber = (event) => Number(event?.target?.value ?? 0)

const handleTunnelInput = (key, event) => {
  props.updateTunnelParam(key, toNumber(event))
}

const handleWeightInput = (key, event) => {
  props.updateWeight(key, toNumber(event))
}
</script>

<style scoped>
.calc-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.calc-module {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-6);
  border: 1px solid var(--border-color);
}

.calc-module.fusion-module {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--color-primary-light) 100%);
}

.module-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.module-tag {
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: 999px;
  background: var(--color-primary);
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.module-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.module-params {
  margin-bottom: 20px;
}

.param-group {
  margin-bottom: 16px;
}

.param-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.strata-list,
.event-list {
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  max-height: 120px;
  overflow-y: auto;
}

.strata-item,
.event-item {
  display: flex;
  gap: 16px;
  padding: var(--spacing-3) var(--spacing-3);
  font-size: 13px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color-light);
}

.strata-item:last-child,
.event-item:last-child {
  border-bottom: none;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.param-row label {
  width: 80px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.param-input {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: var(--bg-primary);
  font-size: 14px;
  color: var(--text-primary);
}

.param-slider {
  flex: 1;
  accent-color: var(--color-primary);
}

.param-row span {
  width: 40px;
  font-size: 13px;
  color: var(--text-tertiary);
}

.calc-btn {
  width: 100%;
  margin-bottom: 16px;
}

.calc-btn.fusion-btn {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
}

.module-result {
  margin-top: 16px;
}

.chart-container {
  width: 100%;
  height: 250px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
}

.fusion-weights {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 20px;
}

.weight-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.weight-control label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.weight-control input {
  accent-color: var(--color-primary);
}

.weight-control span {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}

.weight-bar {
  display: flex;
  height: 24px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}

.weight-segment {
  transition: width 0.3s ease;
}

.weight-segment.rsi {
  background: #6366f1;
}

.weight-segment.bri {
  background: #8b5cf6;
}

.weight-segment.asi {
  background: #22c55e;
}

.fusion-result {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.mpi-display {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: var(--spacing-6) var(--spacing-10);
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

.mpi-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mpi-value {
  font-size: 48px;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mpi-risk {
  padding: var(--spacing-2) var(--spacing-5);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.mpi-risk.low {
  background: var(--color-success-light);
  color: var(--color-success);
}

.mpi-risk.medium {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.mpi-risk.high {
  background: var(--color-error-light);
  color: var(--color-error);
}

@media (max-width: 1100px) {
  .calc-grid {
    grid-template-columns: 1fr;
  }

  .fusion-weights {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .mpi-display {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
