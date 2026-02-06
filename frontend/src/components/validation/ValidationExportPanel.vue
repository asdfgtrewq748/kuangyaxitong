<template>
  <section class="export-wrap">
    <article class="card">
      <h4>复现实验导出</h4>
      <p class="desc">导出运行包用于论文附录、复现实验与审计追踪。</p>

      <div class="btn-row">
        <button class="primary" type="button" :disabled="!runId || exporting" @click="$emit('export-zip')">
          {{ exporting ? '正在导出 ZIP...' : '导出运行 ZIP' }}
        </button>
        <button class="ghost" type="button" :disabled="!result" @click="$emit('download-config')">下载 config.json</button>
        <button class="ghost" type="button" :disabled="!result" @click="$emit('download-metrics')">下载 metrics.json</button>
      </div>

      <p class="tip" v-if="exportMessage">{{ exportMessage }}</p>

      <div class="meta-grid">
        <div><span>运行ID</span><strong>{{ runId || '暂无' }}</strong></div>
        <div><span>数据集</span><strong>{{ result?.dataset_id || '暂无' }}</strong></div>
        <div><span>创建时间</span><strong>{{ result?.created_at || '暂无' }}</strong></div>
      </div>
    </article>
  </section>
</template>

<script setup>
defineProps({
  runId: {
    type: String,
    default: ''
  },
  result: {
    type: Object,
    default: null
  },
  exporting: {
    type: Boolean,
    default: false
  },
  exportMessage: {
    type: String,
    default: ''
  }
})

defineEmits(['export-zip', 'download-config', 'download-metrics'])
</script>

<style scoped>
.export-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  border: 1px solid #dde3ea;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.card h4 {
  margin: 0;
  font-size: 15px;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Times New Roman', serif;
}

.desc {
  margin: 6px 0 0;
  font-size: 12px;
  color: #64748b;
}

.btn-row {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.primary,
.ghost {
  border-radius: 10px;
  font-size: 13px;
  padding: 8px 12px;
  cursor: pointer;
}

.primary {
  border: 1px solid #111827;
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  color: #f9fafb;
}

.ghost {
  border: 1px solid #9ca3af;
  color: #1f2937;
  background: #f8fafc;
}

.primary:disabled,
.ghost:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.tip {
  margin: 10px 0 0;
  font-size: 12px;
  color: #4b5563;
}

.meta-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, minmax(140px, 1fr));
  gap: 8px;
}

.meta-grid > div {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px;
  background: #fcfdff;
}

.meta-grid span {
  display: block;
  font-size: 12px;
  color: #64748b;
}

.meta-grid strong {
  font-size: 13px;
  color: #111827;
  word-break: break-all;
}

@media (max-width: 900px) {
  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>
