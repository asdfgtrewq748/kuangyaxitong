<template>
  <section class="mechanism-wrap">
    <div v-if="!result" class="empty">机制结果正在自动生成，稍后将展示 RSI/BRI/ASI 结果。</div>

    <template v-else>
      <div class="module-grid">
        <article class="module-card">
          <h4>RSI 模块</h4>
          <p><span>输出值：</span>{{ fmt(result.modules?.rsi?.value) }}</p>
          <p><span>输入层数：</span>{{ result.modules?.rsi?.input_layers ?? 0 }}</p>
          <p><span>作用：</span>顶板稳定性推断。</p>
          <button class="mini" type="button" @click="$emit('download-module', 'rsi')">下载原始数据</button>
        </article>

        <article class="module-card">
          <h4>BRI 模块</h4>
          <p><span>输出值：</span>{{ fmt(result.modules?.bri?.value) }}</p>
          <p><span>事件数：</span>{{ result.modules?.bri?.event_count ?? 0 }}</p>
          <p><span>平均震级：</span>{{ fmt(result.modules?.bri?.avg_magnitude) }}</p>
          <button class="mini" type="button" @click="$emit('download-module', 'bri')">下载原始数据</button>
        </article>

        <article class="module-card">
          <h4>ASI 模块</h4>
          <p><span>输出值：</span>{{ fmt(result.modules?.asi?.value) }}</p>
          <p><span>平均内摩擦角：</span>{{ fmt(result.modules?.asi?.avg_friction_angle) }}</p>
          <p><span>作用：</span>支承应力强度评估。</p>
          <button class="mini" type="button" @click="$emit('download-module', 'asi')">下载原始数据</button>
        </article>
      </div>

      <article id="mechanism-fig6" class="figure-card">
        <div class="figure-head">
          <h4>图6 | 新旧算法对比</h4>
          <button class="mini" type="button" @click="$emit('download-figure', 'fig6')">下载图6</button>
        </div>

        <div class="bars">
          <div class="bar-row">
            <span>基线算法</span>
            <div class="track"><div class="fill old" :style="{ width: widthOf(result.fusion?.baseline?.mpi) }"></div></div>
            <strong>{{ fmt(result.fusion?.baseline?.mpi) }}</strong>
          </div>
          <div class="bar-row">
            <span>新算法</span>
            <div class="track"><div class="fill new" :style="{ width: widthOf(result.fusion?.mpi) }"></div></div>
            <strong>{{ fmt(result.fusion?.mpi) }}</strong>
          </div>
        </div>

        <p class="note"><strong>怎么看：</strong>比较两根柱高即可判断 MPI 净增益。</p>
        <p class="note"><strong>工程意义：</strong>若新算法持续高于基线，可进入试运行替换阶段。</p>
      </article>
    </template>
  </section>
</template>

<script setup>
defineProps({
  result: {
    type: Object,
    default: null
  }
})

defineEmits(['download-module', 'download-figure'])

const fmt = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--'
  return Number(value).toFixed(3)
}

const widthOf = (value) => {
  const num = Number(value)
  if (Number.isNaN(num)) return '0%'
  const clamped = Math.max(0, Math.min(100, num))
  return `${clamped}%`
}
</script>

<style scoped>
.mechanism-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty {
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 16px;
  font-size: 13px;
  color: #475569;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 10px;
}

.module-card {
  border: 1px solid #dde3ea;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.module-card h4 {
  margin: 0 0 8px;
  font-size: 15px;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Times New Roman', serif;
}

.module-card p {
  margin: 6px 0;
  font-size: 13px;
  color: #334155;
}

.module-card span {
  color: #64748b;
}

.mini {
  margin-top: 8px;
  border: 1px solid #9ca3af;
  border-radius: 8px;
  background: #f8fafc;
  color: #1f2937;
  font-size: 12px;
  padding: 6px 10px;
  cursor: pointer;
}

.figure-card {
  border: 1px solid #dde3ea;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.figure-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.figure-head h4 {
  margin: 0;
  font-size: 15px;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Times New Roman', serif;
}

.bars {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar-row {
  display: grid;
  grid-template-columns: 112px 1fr 70px;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.track {
  height: 12px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.fill {
  height: 100%;
}

.fill.old {
  background: linear-gradient(90deg, #64748b 0%, #475569 100%);
}

.fill.new {
  background: linear-gradient(90deg, #0f766e 0%, #0d9488 100%);
}

.note {
  margin: 8px 0 0;
  font-size: 12px;
  color: #374151;
}

@media (max-width: 1000px) {
  .module-grid {
    grid-template-columns: 1fr;
  }

  .bar-row {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .figure-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
