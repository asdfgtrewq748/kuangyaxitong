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
          active-class="active"
        >
          <span class="nav-badge">{{ navBadge(routeItem) }}</span>
          <span class="nav-text">{{ routeItem.meta.title }}</span>
        </router-link>
      </nav>
    </aside>

    <main class="main-content">
      <div class="content-wrapper">
        <section class="workflow-strip">
          <div class="workflow-head">
            <strong>Product Flow</strong>
            <span>{{ Math.round(completionRate * 100) }}%</span>
          </div>

          <div class="workflow-track">
            <button
              v-for="(item, index) in flowRoutes"
              :key="item.path"
              type="button"
              class="workflow-step"
              :class="{ active: item.name === activeRouteName, done: isFlowDone(item.name) }"
              @click="goFlowRoute(item)"
            >
              <span class="step-index">{{ index + 1 }}</span>
              <span class="step-title">{{ item.meta.title }}</span>
            </button>
          </div>

          <div class="workflow-actions">
            <span v-if="workspaceState.selectedSeam" class="workflow-seam">Seam {{ workspaceState.selectedSeam }}</span>
            <button v-if="recommendedFlowRoute" type="button" class="workflow-btn" @click="goRecommendedFlow">
              Next: {{ recommendedFlowRoute.meta.title }}
            </button>
            <button type="button" class="workflow-btn ghost" @click="resetFlow">Reset</button>
          </div>

          <div v-if="flowGuard" class="workflow-guard">
            <div class="workflow-guard-text">
              <strong>Flow guard</strong>
              <span>
                Previous step {{ flowGuard.blockedBy.meta.title }} is not done. You can stay here,
                but completing it first is recommended.
              </span>
            </div>
            <button type="button" class="workflow-btn guard" @click="goFlowRoute(flowGuard.blockedBy)">
              Go to {{ flowGuard.blockedBy.meta.title }}
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
    toast.value.add(`Flow hint: finish ${missing.meta?.title || missing.name} first`, 'warning', 2600)
  }

  router.push({ name: item.name, query: seamQuery.value })
}

const goRecommendedFlow = () => {
  if (!recommendedFlowRoute.value?.name) return
  router.push({ name: recommendedFlowRoute.value.name, query: seamQuery.value })
}

const navBadge = (routeItem) => {
  const title = String(routeItem?.meta?.title || '')
  return title.slice(0, 1) || '•'
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
  background: linear-gradient(140deg, #f4f6fb 0%, #f8fafc 55%, #edf8f1 100%);
}

.sidebar {
  width: 92px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  border-right: 1px solid #dbe3ef;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.sidebar-logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  margin-top: 16px;
  margin-bottom: 18px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.sidebar-nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
}

.nav-item {
  width: 76px;
  min-height: 56px;
  border-radius: 12px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #64748b;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.nav-item:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
  color: #334155;
}

.nav-item.active {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
}

.nav-badge {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #e2e8f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.nav-item.active .nav-badge {
  background: #bfdbfe;
}

.nav-text {
  font-size: 11px;
  line-height: 1.2;
  text-align: center;
  max-width: 64px;
  word-break: break-word;
}

.main-content {
  margin-left: 92px;
  width: calc(100% - 92px);
}

.content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px 24px 28px;
}

.workflow-strip {
  margin-bottom: 14px;
  padding: 10px 14px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
}

.workflow-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: #334155;
}

.workflow-head strong {
  font-size: 13px;
  color: #0f172a;
}

.workflow-track {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.workflow-step {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #dbe5f1;
  border-radius: 10px;
  background: #ffffff;
  color: #475569;
  padding: 7px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.workflow-step:hover {
  border-color: #94a3b8;
  transform: translateY(-1px);
}

.workflow-step.done {
  border-color: #86efac;
  background: #f0fdf4;
  color: #166534;
}

.workflow-step.active {
  border-color: #60a5fa;
  background: #eff6ff;
  color: #1d4ed8;
}

.step-index {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #e2e8f0;
  color: #334155;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.workflow-step.done .step-index {
  background: #bbf7d0;
  color: #166534;
}

.workflow-step.active .step-index {
  background: #bfdbfe;
  color: #1d4ed8;
}

.step-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.workflow-actions {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.workflow-seam {
  font-size: 12px;
  color: #475569;
  background: rgba(148, 163, 184, 0.16);
  border-radius: 999px;
  padding: 3px 10px;
}

.workflow-btn {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #1e293b;
  font-size: 12px;
  padding: 6px 10px;
  cursor: pointer;
}

.workflow-btn:hover {
  border-color: #94a3b8;
  background: #f8fafc;
}

.workflow-btn.ghost {
  color: #64748b;
}

.workflow-btn.guard {
  border-color: #fbbf24;
  background: #fff7ed;
  color: #92400e;
}

.workflow-btn.guard:hover {
  border-color: #f59e0b;
  background: #ffedd5;
}

.workflow-guard {
  margin-top: 8px;
  border: 1px solid #fed7aa;
  background: #fff7ed;
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.workflow-guard-text {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 12px;
  color: #9a3412;
}

.workflow-guard-text strong {
  color: #7c2d12;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .workflow-track {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 62px;
  }

  .sidebar-logo {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    margin-top: 12px;
    margin-bottom: 12px;
    font-size: 11px;
  }

  .nav-item {
    width: 50px;
    min-height: 42px;
  }

  .nav-text {
    display: none;
  }

  .main-content {
    margin-left: 62px;
    width: calc(100% - 62px);
  }

  .content-wrapper {
    padding: 14px;
  }

  .workflow-track {
    grid-template-columns: 1fr;
  }
}
</style>
