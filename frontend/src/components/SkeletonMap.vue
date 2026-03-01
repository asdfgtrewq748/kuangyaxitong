<template>
  <div class="skeleton-map">
    <div class="skeleton-header">
      <div class="skeleton-title"></div>
      <div class="skeleton-meta"></div>
    </div>
    <div class="skeleton-grid">
      <div v-for="i in gridRows" :key="i" class="skeleton-row">
        <div
          v-for="j in gridCols"
          :key="j"
          class="skeleton-cell"
          :style="{ animationDelay: `${(i * j) * 0.02}s` }"
        ></div>
      </div>
    </div>
    <div class="skeleton-legend">
      <div class="skeleton-legend-bar"></div>
      <div class="skeleton-legend-labels">
        <div v-for="i in 3" :key="i" class="skeleton-label"></div>
      </div>
    </div>
    <div v-if="showProgress" class="progress-indicator">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="progress-text">{{ progressText }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  gridRows: { type: Number, default: 8 },
  gridCols: { type: Number, default: 12 },
  showProgress: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  progressText: { type: String, default: '' }
})
</script>

<style scoped>
.skeleton-map {
  width: 100%;
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 16px;
  position: relative;
}

.skeleton-header {
  margin-bottom: 12px;
}

.skeleton-title {
  height: 16px;
  width: 120px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-meta {
  height: 12px;
  width: 80px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 3px;
}

.skeleton-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 6px;
}

.skeleton-row {
  display: flex;
  gap: 2px;
  flex: 1;
}

.skeleton-cell {
  flex: 1;
  background: linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 2px;
  opacity: 0.6;
}

.skeleton-legend {
  position: absolute;
  bottom: 12px;
  left: 12px;
  width: 120px;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 10px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #E2E8F0;
}

.skeleton-legend-bar {
  height: 8px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 4px;
}

.skeleton-legend-labels {
  display: flex;
  justify-content: space-between;
}

.skeleton-label {
  height: 8px;
  width: 24px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 2px;
}

.progress-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.98);
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border: 1px solid #E2E8F0;
  min-width: 180px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0f766e, #14b8a6);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #475569;
  font-weight: 500;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
