<template>
  <div class="skeleton-card" :style="{ height: height }">
    <div class="skeleton-header" v-if="showHeader">
      <div class="skeleton-badge"></div>
      <div class="skeleton-title"></div>
    </div>
    <div class="skeleton-body">
      <div class="skeleton-chart"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  height: { type: String, default: '300px' },
  showHeader: { type: Boolean, default: true }
})
</script>

<style scoped>
.skeleton-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.skeleton-badge {
  width: 28px;
  height: 28px;
  background: #e5e5e5;
  border-radius: 6px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-title {
  height: 16px;
  width: 120px;
  background: #e5e5e5;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.skeleton-chart {
  flex: 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  animation: shimmer 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
