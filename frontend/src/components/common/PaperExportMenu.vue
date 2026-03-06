<template>
  <div ref="rootRef" class="paper-export-menu">
    <button
      type="button"
      class="trigger-btn"
      :disabled="disabledMain && disabledPack"
      @click="toggleMenu"
    >
      {{ triggerLabel }}
    </button>

    <div v-if="open" class="menu-panel">
      <button
        type="button"
        class="menu-item"
        :disabled="disabledMain || loadingMain"
        @click="handleExportMain"
      >
        <span>{{ loadingMain ? loadingMainLabel : mainLabel }}</span>
        <small>{{ mainHint }}</small>
      </button>

      <button
        type="button"
        class="menu-item"
        :disabled="disabledPack || loadingPack"
        @click="handleExportPack"
      >
        <span>{{ loadingPack ? loadingPackLabel : packLabel }}</span>
        <small>{{ packHint }}</small>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  triggerLabel: { type: String, default: '论文导出' },
  mainLabel: { type: String, default: '导出主图' },
  packLabel: { type: String, default: '导出补充图包' },
  loadingMainLabel: { type: String, default: '主图导出中...' },
  loadingPackLabel: { type: String, default: '打包中...' },
  mainHint: { type: String, default: '高分辨率主图' },
  packHint: { type: String, default: 'ZIP + 图注 + 清单' },
  disabledMain: { type: Boolean, default: false },
  disabledPack: { type: Boolean, default: false },
  loadingMain: { type: Boolean, default: false },
  loadingPack: { type: Boolean, default: false }
})

const emit = defineEmits(['export-main', 'export-pack'])

const rootRef = ref(null)
const open = ref(false)

const toggleMenu = () => {
  open.value = !open.value
}

const closeMenu = () => {
  open.value = false
}

const onGlobalPointerDown = (event) => {
  if (!open.value) return
  const root = rootRef.value
  if (!root) return
  if (!root.contains(event.target)) {
    closeMenu()
  }
}

const handleExportMain = () => {
  emit('export-main')
  closeMenu()
}

const handleExportPack = () => {
  emit('export-pack')
  closeMenu()
}

onMounted(() => {
  window.addEventListener('pointerdown', onGlobalPointerDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', onGlobalPointerDown)
})
</script>

<style scoped>
.paper-export-menu {
  position: relative;
}

.trigger-btn {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  color: #0f172a;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
}

.trigger-btn:hover:not(:disabled) {
  border-color: #94a3b8;
  background: #f1f5f9;
}

.trigger-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.menu-panel {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  z-index: 60;
  min-width: 220px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
  padding: 6px;
  display: grid;
  gap: 4px;
}

.menu-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 8px 10px;
  text-align: left;
  color: #0f172a;
  cursor: pointer;
  display: grid;
  gap: 3px;
}

.menu-item:hover:not(:disabled) {
  border-color: #0f766e;
  background: #f0fdfa;
}

.menu-item span {
  font-size: 12px;
  font-weight: 600;
}

.menu-item small {
  font-size: 10px;
  color: #64748b;
}

.menu-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
