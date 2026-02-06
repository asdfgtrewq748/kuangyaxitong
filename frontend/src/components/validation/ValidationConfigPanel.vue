<template>
  <div class="config-stack">
    <section class="panel-card">
      <h3>数据与时间窗</h3>
      <label class="field">
        <span>数据集</span>
        <select
          v-model="form.datasetId"
          :disabled="datasetLoading || datasets.length === 0 || runState.running"
        >
          <option v-if="datasets.length === 0" value="">暂无数据集</option>
          <option v-for="item in datasets" :key="item.dataset_id" :value="item.dataset_id">
            {{ item.dataset_id }}（{{ item.rows }} 行）
          </option>
        </select>
      </label>
      <p class="tip" v-if="selectedDataset">
        标签流：{{ selectedDataset.has_label_stream ? '已检测到' : '未检测到（评估将受限）' }}
      </p>
      <p class="tip" v-if="datasetMessage">{{ datasetMessage }}</p>

      <div class="grid-2">
        <label class="field">
          <span>训练开始</span>
          <input v-model="form.timeWindow.train_start" type="date" :disabled="runState.running">
        </label>
        <label class="field">
          <span>训练结束</span>
          <input v-model="form.timeWindow.train_end" type="date" :disabled="runState.running">
        </label>
        <label class="field">
          <span>测试开始</span>
          <input v-model="form.timeWindow.test_start" type="date" :disabled="runState.running">
        </label>
        <label class="field">
          <span>测试结束</span>
          <input v-model="form.timeWindow.test_end" type="date" :disabled="runState.running">
        </label>
      </div>
    </section>

    <section class="panel-card">
      <h3>算法参数</h3>
      <div class="weight-row">
        <span>RSI 权重</span>
        <input v-model.number="form.dbnWeights.rsi" type="range" min="0" max="1" step="0.05" :disabled="runState.running">
        <strong>{{ (normalizedWeights.rsi * 100).toFixed(0) }}%</strong>
      </div>
      <div class="weight-row">
        <span>BRI 权重</span>
        <input v-model.number="form.dbnWeights.bri" type="range" min="0" max="1" step="0.05" :disabled="runState.running">
        <strong>{{ (normalizedWeights.bri * 100).toFixed(0) }}%</strong>
      </div>
      <div class="weight-row">
        <span>ASI 权重</span>
        <input v-model.number="form.dbnWeights.asi" type="range" min="0" max="1" step="0.05" :disabled="runState.running">
        <strong>{{ (normalizedWeights.asi * 100).toFixed(0) }}%</strong>
      </div>
      <p class="tip">权重自动归一化，总和为 100%。</p>

      <div class="grid-2 compact">
        <label class="field">
          <span>RSI 网格</span>
          <input v-model.number="form.rsi.meshSize" type="number" min="20" max="300" step="10" :disabled="runState.running">
        </label>
        <label class="field">
          <span>RSI 步数</span>
          <input v-model.number="form.rsi.timeSteps" type="number" min="5" max="100" step="1" :disabled="runState.running">
        </label>
        <label class="field">
          <span>BRI 窗口（天）</span>
          <input v-model.number="form.bri.timeWindowDays" type="number" min="1" max="30" step="1" :disabled="runState.running">
        </label>
        <label class="field">
          <span>ASI 半径</span>
          <input v-model.number="form.asi.tunnelRadius" type="number" min="1" max="20" step="0.1" :disabled="runState.running">
        </label>
      </div>
    </section>

    <section class="panel-card">
      <h3>基线设置</h3>
      <label class="field">
        <span>基线算法名称</span>
        <input v-model.trim="form.baselineName" type="text" :disabled="runState.running">
      </label>
      <button class="ghost" type="button" @click="$emit('save-snapshot')">保存参数快照</button>
    </section>

    <section class="panel-card">
      <h3>运行状态（自动）</h3>
      <p class="tip auto-tip">系统将自动运行并刷新全部图表，无需手动点击生成。</p>
      <div class="progress-wrap">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${runState.progress}%` }"></div>
        </div>
        <span>{{ runState.progress }}%</span>
      </div>
      <div class="status-line">
        <span class="status-chip" :class="runState.status">{{ statusLabel }}</span>
        <span class="status-text">{{ runState.message }}</span>
      </div>
      <p class="tip" v-if="runState.runId">运行ID：{{ runState.runId }}</p>

      <div class="logs">
        <div class="log-row" v-for="item in runState.logs" :key="item.ts + item.text">
          <span class="ts">{{ item.ts }}</span>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  datasets: {
    type: Array,
    default: () => []
  },
  selectedDataset: {
    type: Object,
    default: null
  },
  datasetLoading: {
    type: Boolean,
    default: false
  },
  datasetMessage: {
    type: String,
    default: ''
  },
  normalizedWeights: {
    type: Object,
    required: true
  },
  runState: {
    type: Object,
    required: true
  }
})

defineEmits(['save-snapshot'])

const statusLabel = computed(() => {
  if (props.runState.status === 'running') return '运行中'
  if (props.runState.status === 'completed') return '已完成'
  if (props.runState.status === 'error') return '失败'
  return '待运行'
})
</script>

<style scoped>
.config-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.panel-card {
  border: 1px solid #d8dee5;
  border-radius: 14px;
  background: #ffffff;
  padding: 14px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
}

.panel-card h3 {
  margin: 0 0 12px;
  font-size: 15px;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Times New Roman', serif;
  color: #111827;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.field span {
  font-size: 12px;
  color: #4b5563;
}

.field input,
.field select {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  background: #fff;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.grid-2.compact .field {
  margin-bottom: 0;
}

.weight-row {
  display: grid;
  grid-template-columns: 76px 1fr 46px;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 12px;
}

.tip {
  margin: 0 0 10px;
  font-size: 12px;
  color: #6b7280;
}

.ghost {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #111827;
  padding: 9px 12px;
  font-size: 13px;
  cursor: pointer;
}

.ghost {
  border-color: #9ca3af;
  color: #1f2937;
  background: #f8fafc;
}

.ghost:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.auto-tip {
  margin-top: -2px;
}

.progress-wrap {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
}

.progress-track {
  height: 8px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0f766e 0%, #14b8a6 100%);
  transition: width 0.3s ease;
}

.status-line {
  margin-top: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
}

.status-chip {
  font-size: 11px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 2px 8px;
}

.status-chip.running {
  background: #fffbeb;
  color: #92400e;
  border-color: #f59e0b;
}

.status-chip.completed {
  background: #ecfdf5;
  color: #065f46;
  border-color: #10b981;
}

.status-chip.error {
  background: #fef2f2;
  color: #991b1b;
  border-color: #ef4444;
}

.status-text {
  font-size: 12px;
  color: #4b5563;
}

.logs {
  margin-top: 10px;
  max-height: 170px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-row {
  display: grid;
  grid-template-columns: 62px 1fr;
  gap: 8px;
  font-size: 12px;
  color: #1f2937;
  border-top: 1px dashed #e5e7eb;
  padding-top: 6px;
}

.ts {
  color: #6b7280;
  font-family: 'Times New Roman', serif;
}

@media (max-width: 900px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
