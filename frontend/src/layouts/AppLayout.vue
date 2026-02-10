<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-logo">MPI</div>
      <nav class="sidebar-nav">
        <router-link
          v-for="routeItem in routes"
          :key="routeItem.path"
          :to="routeItem.path"
          class="nav-item"
          :title="navTitle(routeItem)"
          :aria-label="navTitle(routeItem)"
          :data-title="navTitle(routeItem)"
          active-class="active"
        >
          <span class="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(segment, index) in navIconSegments(routeItem)" :key="index" :d="segment" />
            </svg>
          </span>
          <span class="sr-only">{{ navTitle(routeItem) }}</span>
        </router-link>
      </nav>
    </aside>

    <main class="main-content">
      <div class="content-wrapper">
        <section v-if="showWorkflowStrip" class="workflow-strip">
          <div class="workflow-head">
            <div class="workflow-progress" :title="`娴佺▼杩涘害 ${Math.round(completionRate * 100)}%`" :aria-label="`娴佺▼杩涘害 ${Math.round(completionRate * 100)}%`">
              <span class="progress-dot" aria-hidden="true"></span>
              <span class="workflow-rate">{{ Math.round(completionRate * 100) }}%</span>
            </div>
            <div class="workflow-actions">
              <span
                v-if="workspaceState.selectedSeam"
                class="workflow-seam"
                :title="`褰撳墠鐓ゅ眰 ${workspaceState.selectedSeam}`"
              >
                {{ workspaceState.selectedSeam }}
              </span>
              <button
                v-if="recommendedFlowRoute"
                type="button"
                class="workflow-btn icon"
                :title="`鍓嶅線 ${recommendedFlowRoute.meta.title}`"
                :aria-label="`鍓嶅線 ${recommendedFlowRoute.meta.title}`"
                @click="goRecommendedFlow"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14"></path>
                  <path d="m13 5 7 7-7 7"></path>
                </svg>
                <span class="sr-only">鍓嶅線鎺ㄨ崘姝ラ</span>
              </button>
              <button
                type="button"
                class="workflow-btn icon ghost"
                title="閲嶇疆娴佺▼"
                aria-label="閲嶇疆娴佺▼"
                @click="resetFlow"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-2.64-6.36"></path>
                  <path d="M21 3v6h-6"></path>
                </svg>
                <span class="sr-only">閲嶇疆娴佺▼</span>
              </button>
            </div>
          </div>

          <div class="workflow-track">
            <button
              v-for="(item, index) in flowRoutes"
              :key="item.path"
              type="button"
              class="workflow-step"
              :class="{ active: item.name === activeRouteName, done: isFlowDone(item.name) }"
              :title="`姝ラ ${index + 1} 路 ${item.meta.title}`"
              :aria-label="`姝ラ ${index + 1} 路 ${item.meta.title}`"
              @click="goFlowRoute(item)"
            >
              <span class="step-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                  <path v-for="(segment, iconIndex) in navIconSegments(item)" :key="iconIndex" :d="segment" />
                </svg>
              </span>
              <span class="sr-only">{{ item.meta.title }}</span>
            </button>
          </div>

          <div v-if="flowGuard" class="workflow-guard">
            <div class="workflow-guard-text">
              <span class="guard-dot" aria-hidden="true"></span>
              <span class="workflow-guard-label">流程保护已启用</span>
            </div>
            <button
              type="button"
              class="workflow-btn guard icon"
              :title="`鍓嶅線鍓嶇疆姝ラ ${flowGuard.blockedBy.meta.title}`"
              :aria-label="`鍓嶅線鍓嶇疆姝ラ ${flowGuard.blockedBy.meta.title}`"
              @click="goFlowRoute(flowGuard.blockedBy)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M10 14 4 8l6-6"></path>
                <path d="M20 20v-3a9 9 0 0 0-9-9H4"></path>
              </svg>
              <span class="sr-only">鍓嶅線鍓嶇疆姝ラ</span>
            </button>
          </div>
        </section>

        <router-view />
      </div>
    </main>

    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Toast from '../components/Toast.vue'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'

const route = useRoute()
const router = useRouter()
const toast = ref(null)
const { flowOrder, workspaceState, completionRate, resetFlow } = useWorkspaceFlow()
const appToastRef = getCurrentInstance()?.appContext?.config?.globalProperties?.$toast

const routes = computed(() => (
  router
    .getRoutes()
    .filter((r) => r.meta?.title && r.meta?.nav !== false)
    .sort((a, b) => Number(a.meta?.navOrder || 999) - Number(b.meta?.navOrder || 999))
))

const flowRoutes = computed(() => {
  const routeMap = new Map(router.getRoutes().map((item) => [item.name, item]))
  return flowOrder.map((name) => routeMap.get(name)).filter(Boolean)
})

const activeRouteName = computed(() => String(route.name || ''))
const seamQuery = computed(() => (workspaceState.selectedSeam ? { seam: workspaceState.selectedSeam } : undefined))
const showWorkflowStrip = computed(() => route.meta?.workflow !== false)

const isFlowDone = (name) => Boolean(workspaceState.steps?.[name])

const recommendedFlowRoute = computed(() => {
  if (flowRoutes.value.length === 0) return null

  const currentIndex = flowRoutes.value.findIndex((item) => item.name === activeRouteName.value)
  if (currentIndex >= 0) {
    const current = flowRoutes.value[currentIndex]
    if (!isFlowDone(current.name)) return current

    for (let i = currentIndex + 1; i < flowRoutes.value.length; i += 1) {
      if (!isFlowDone(flowRoutes.value[i].name)) return flowRoutes.value[i]
    }
  }

  return flowRoutes.value.find((item) => !isFlowDone(item.name)) || flowRoutes.value[flowRoutes.value.length - 1]
})

const findMissingPrerequisite = (targetName) => {
  const targetIndex = flowRoutes.value.findIndex((item) => item.name === targetName)
  if (targetIndex <= 0) return null
  return flowRoutes.value.find((item, index) => index < targetIndex && !isFlowDone(item.name)) || null
}

const flowGuard = computed(() => {
  const currentName = activeRouteName.value
  if (!currentName) return null
  const missing = findMissingPrerequisite(currentName)
  if (!missing) return null
  const current = flowRoutes.value.find((item) => item.name === currentName)
  if (!current) return null
  return { blockedBy: missing, current }
})

const goFlowRoute = (item) => {
  if (!item?.name) return

  const missing = findMissingPrerequisite(item.name)
  if (missing && toast.value?.add) {
    toast.value.add(`建议先完成：${missing.meta?.title || missing.name}`, 'warning', 2600)
  }

  router.push({ name: item.name, query: seamQuery.value })
}

const goRecommendedFlow = () => {
  if (!recommendedFlowRoute.value?.name) return
  router.push({ name: recommendedFlowRoute.value.name, query: seamQuery.value })
}

const navTitle = (routeItem) => String(routeItem?.meta?.title || routeItem?.name || '导航')

const navIconMap = {
  upload: ['M12 3v10', 'm8 9 4 4 4-4', 'M5 20h14'],
  chart: ['M4 19h16', 'M7 15V9', 'M12 15V6', 'M17 15v-3'],
  bolt: ['M13 2 4 14h6l-1 8 9-12h-6l1-8'],
  book: ['M4 5a2 2 0 0 1 2-2h13v17H6a2 2 0 0 0-2 2V5z', 'M6 3v17'],
  flask: ['M10 2v5l-5 8a4 4 0 0 0 3.4 6h7.2A4 4 0 0 0 19 15l-5-8V2', 'M9 11h6'],
  grid: ['M4 4h7v7H4z', 'M13 4h7v7h-7z', 'M4 13h7v7H4z', 'M13 13h7v7h-7z'],
  report: ['M7 3h8l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M15 3v5h5', 'M9 13h6', 'M9 17h4']
}

const navIconSegments = (routeItem) => {
  const key = String(routeItem?.meta?.icon || '').trim()
  return navIconMap[key] || ['M5 12h14', 'M12 5v14']
}

onMounted(() => {
  if (appToastRef && typeof appToastRef === 'object') {
    appToastRef.value = toast.value
  }
})

onBeforeUnmount(() => {
  if (appToastRef && typeof appToastRef === 'object') {
    appToastRef.value = null
  }
})

</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  background:
    radial-gradient(circle at 18% 12%, rgba(15, 118, 110, 0.12) 0%, transparent 42%),
    radial-gradient(circle at 85% 88%, rgba(180, 83, 9, 0.1) 0%, transparent 44%),
    linear-gradient(150deg, #eef3f1 0%, #f8fbfa 52%, #fdf8f1 100%);
}

.sidebar {
  width: 88px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  border-right: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  backdrop-filter: blur(14px);
  box-shadow: 8px 0 24px rgba(15, 23, 42, 0.06);
}

.sidebar::before {
  content: "";
  width: 34px;
  height: 2px;
  border-radius: 999px;
  margin-top: 14px;
  background: rgba(15, 118, 110, 0.38);
}

.sidebar-logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  margin-top: 12px;
  margin-bottom: 14px;
  background: linear-gradient(145deg, #0f766e 0%, #0e7490 100%);
  color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  letter-spacing: 0.04em;
  font-size: 12px;
  box-shadow: 0 6px 18px rgba(15, 118, 110, 0.24);
}

.sidebar-nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  position: relative;
  z-index: 1;
}

.nav-item {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  position: relative;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5f6b7c;
  border: 1px solid transparent;
  background: transparent;
  transition: transform var(--transition-fast), background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.nav-item::after {
  content: attr(data-title);
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%) translateX(-6px);
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
  font-size: 11px;
  line-height: 1;
  letter-spacing: 0.01em;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.nav-item:hover {
  border-color: rgba(15, 118, 110, 0.34);
  background: rgba(15, 118, 110, 0.09);
  color: var(--color-primary);
  transform: translateY(-1px) scale(1.01);
}

.nav-item.active {
  border-color: rgba(15, 118, 110, 0.38);
  background: var(--color-primary-light);
  color: var(--color-primary);
  box-shadow: 0 6px 14px rgba(15, 118, 110, 0.14);
  transform: translateY(-1px);
}

.nav-item.active::before {
  content: "";
  position: absolute;
  left: -8px;
  top: 17px;
  width: 3px;
  height: 18px;
  border-radius: 999px;
  background: var(--color-primary);
}

.nav-item:hover::after,
.nav-item:focus-visible::after {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

.nav-item:focus-visible {
  outline: none;
  border-color: rgba(15, 118, 110, 0.45);
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.2);
}

.nav-icon {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nav-icon svg {
  width: 20px;
  height: 20px;
  stroke-width: 1.9;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.main-content {
  margin-left: 88px;
  width: calc(100% - 88px);
}

.content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px 24px 28px;
}

.workflow-strip {
  margin-bottom: 14px;
  padding: 8px 10px;
  border: 1px solid rgba(14, 116, 144, 0.22);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
}

.workflow-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}

.workflow-progress {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, #0f766e, #0e7490);
  box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.12);
}

.workflow-rate {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.workflow-track {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
}

.workflow-step {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color-light);
  border-radius: 9px;
  background: #ffffff;
  color: var(--text-secondary);
  padding: 6px 7px;
  min-height: 38px;
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.workflow-step:hover {
  border-color: rgba(15, 118, 110, 0.36);
  color: var(--color-primary);
  background: rgba(15, 118, 110, 0.07);
  transform: translateY(-1px);
}

.workflow-step.done {
  border-color: #86efac;
  background: #f0fdf4;
  color: #166534;
}

.workflow-step.active {
  border-color: rgba(14, 116, 144, 0.42);
  background: rgba(20, 184, 166, 0.13);
  color: #0f766e;
}

.step-icon {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.step-icon svg {
  width: 17px;
  height: 17px;
  stroke-width: 1.9;
}

.workflow-step:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.2);
}

.workflow-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.workflow-seam {
  font-size: 11px;
  color: var(--text-secondary);
  background: rgba(15, 118, 110, 0.12);
  border: 1px solid rgba(15, 118, 110, 0.18);
  border-radius: 999px;
  padding: 2px 8px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.workflow-btn {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #ffffff;
  color: var(--text-primary);
  font-size: 12px;
  padding: 5px 8px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.workflow-btn:hover {
  border-color: rgba(15, 118, 110, 0.4);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.workflow-btn.icon {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.workflow-btn.icon svg {
  width: 15px;
  height: 15px;
  stroke-width: 1.9;
}

.workflow-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.2);
}

.workflow-btn.ghost {
  color: var(--text-secondary);
}

.workflow-btn.guard {
  border-color: rgba(180, 83, 9, 0.25);
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.workflow-btn.guard:hover {
  border-color: rgba(180, 83, 9, 0.45);
  background: #ffedd5;
}

.workflow-guard {
  margin-top: 6px;
  border: 1px solid rgba(180, 83, 9, 0.25);
  background: rgba(255, 247, 237, 0.88);
  border-radius: 8px;
  padding: 5px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.workflow-guard-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.guard-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.16);
}

.workflow-guard-label {
  font-size: 11px;
  color: #9a3412;
  font-weight: 600;
}

@media (max-width: 1100px) {
  .workflow-track {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 68px;
  }

  .sidebar-logo {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 11px;
  }

  .nav-item {
    width: 44px;
    height: 44px;
  }

  .main-content {
    margin-left: 68px;
    width: calc(100% - 68px);
  }

  .nav-item::after {
    display: none;
  }

  .content-wrapper {
    padding: 14px;
  }

  .workflow-seam {
    display: none;
  }

  .workflow-track {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>

