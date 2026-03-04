<template>
  <div class="app-layout">
    <aside class="sidebar" role="navigation" :aria-label="t('layout.mainNavigation')">
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
          @mouseenter="preloadRoute(routeItem)"
          @focus="preloadRoute(routeItem)"
          @touchstart.passive="preloadRoute(routeItem)"
        >
          <span class="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="(segment, index) in navIconSegments(routeItem)" :key="index" :d="segment" />
            </svg>
          </span>
          <span class="sr-only">{{ navTitle(routeItem) }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button
          type="button"
          class="lang-toggle"
          :title="t('layout.toggleLanguage')"
          :aria-label="t('layout.toggleLanguage')"
          @click="toggleLanguage"
        >
          <span class="lang-label">{{ locale === 'zh-CN' ? '中' : 'EN' }}</span>
          <span class="sr-only">{{ t('layout.toggleLanguage') }}</span>
        </button>
      </div>
    </aside>

    <main class="main-content" role="main">
      <div class="content-wrapper">
        <section v-if="showWorkflowStrip" class="workflow-strip">
          <div class="workflow-head">
            <div class="workflow-progress" :title="workflowProgressLabel" :aria-label="workflowProgressLabel">
              <span class="progress-dot" aria-hidden="true"></span>
              <span class="workflow-rate">{{ Math.round(completionRate * 100) }}%</span>
            </div>
            <div class="workflow-actions">
              <span
                v-if="workspaceState.selectedSeam"
                class="workflow-seam"
                :title="seamTitle"
              >
                {{ workspaceState.selectedSeam }}
              </span>
              <button
                v-if="recommendedFlowRoute"
                type="button"
                class="workflow-btn icon"
                :title="t('layout.goTo', { target: routeLabel(recommendedFlowRoute) })"
                :aria-label="t('layout.goTo', { target: routeLabel(recommendedFlowRoute) })"
                @click="goRecommendedFlow"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14"></path>
                  <path d="m13 5 7 7-7 7"></path>
                </svg>
                <span class="sr-only">{{ t('layout.goToRecommendedStep') }}</span>
              </button>
              <button
                type="button"
                class="workflow-btn icon ghost"
                :title="t('layout.resetWorkflow')"
                :aria-label="t('layout.resetWorkflow')"
                @click="resetFlow"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-2.64-6.36"></path>
                  <path d="M21 3v6h-6"></path>
                </svg>
                <span class="sr-only">{{ t('layout.resetWorkflow') }}</span>
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
              :title="workflowStepLabel(index, item)"
              :aria-label="workflowStepLabel(index, item)"
              @click="goFlowRoute(item)"
            >
              <span class="step-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                  <path v-for="(segment, iconIndex) in navIconSegments(item)" :key="iconIndex" :d="segment" />
                </svg>
              </span>
              <span class="sr-only">{{ routeLabel(item) }}</span>
            </button>
          </div>

          <div v-if="flowGuard" class="workflow-guard">
            <div class="workflow-guard-text">
              <span class="guard-dot" aria-hidden="true"></span>
              <span class="workflow-guard-label">{{ t('layout.flowGuardEnabled') }}</span>
            </div>
            <button
              type="button"
              class="workflow-btn guard icon"
              :title="t('layout.goTo', { target: routeLabel(flowGuard.blockedBy) })"
              :aria-label="t('layout.goTo', { target: routeLabel(flowGuard.blockedBy) })"
              @click="goFlowRoute(flowGuard.blockedBy)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M10 14 4 8l6-6"></path>
                <path d="M20 20v-3a9 9 0 0 0-9-9H4"></path>
              </svg>
              <span class="sr-only">{{ t('layout.goToPrerequisiteStep') }}</span>
            </button>
          </div>
        </section>

        <router-view />

        <!-- AI Search Bar -->
        <div class="ai-search-container">
          <AiSearchBar
            v-if="showAiSearch"
            :label="t('layout.aiAssistant')"
            :expanded="false"
          />
        </div>
      </div>
    </main>

    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Toast from '../components/library/feedback/Toast.vue'
import { useWorkspaceFlow } from '../composables/useWorkspaceFlow'
import AiSearchBar from '../components/AiSearchBar.vue'
import { useI18n } from '../composables/useI18n'

const route = useRoute()
const router = useRouter()
const toast = ref(null)
const { flowOrder, workspaceState, completionRate, resetFlow } = useWorkspaceFlow()
const { t, locale, toggleLanguage } = useI18n()
const appToastRef = getCurrentInstance()?.appContext?.config?.globalProperties?.$toast
const showAiSearch = ref(true) // 控制 AI 搜索栏显示
const preloadedRoutes = new Set()

const routes = computed(() => {
  const unique = new Map()

  router
    .getRoutes()
    .filter((r) => !r.aliasOf) // avoid duplicate sidebar entries from route aliases
    .filter((r) => !r.redirect)
    .filter((r) => (r.meta?.title || r.meta?.titleKey) && r.meta?.nav !== false)
    .sort((a, b) => Number(a.meta?.navOrder || 999) - Number(b.meta?.navOrder || 999))
    .forEach((routeItem) => {
      const key = String(routeItem.name || routeItem.path)
      if (!unique.has(key)) unique.set(key, routeItem)
    })

  return [...unique.values()]
})

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

const routeLabel = (routeItem) => {
  if (!routeItem) return t('layout.navigation')
  if (routeItem.meta?.titleKey) return t(routeItem.meta.titleKey)
  return String(routeItem.meta?.title || routeItem.name || t('layout.navigation'))
}

const workflowProgressLabel = computed(() => {
  return `${t('layout.workflowProgress')} ${Math.round(completionRate.value * 100)}%`
})

const seamTitle = computed(() => {
  if (!workspaceState.selectedSeam) return t('layout.currentSeam')
  return `${t('layout.currentSeam')} ${workspaceState.selectedSeam}`
})

const workflowStepLabel = (index, item) => {
  return `${t('layout.step')} ${index + 1} · ${routeLabel(item)}`
}

const goFlowRoute = (item) => {
  if (!item?.name) return

  const missing = findMissingPrerequisite(item.name)
  if (missing && toast.value?.add) {
    toast.value.add(t('layout.completeFirst', { target: routeLabel(missing) }), { type: 'warning', duration: 2600 })
  }

  router.push({ name: item.name, query: seamQuery.value })
}

const goRecommendedFlow = () => {
  if (!recommendedFlowRoute.value?.name) return
  router.push({ name: recommendedFlowRoute.value.name, query: seamQuery.value })
}

const navTitle = (routeItem) => routeLabel(routeItem)

const resolveRouteLoader = (routeItem) => {
  if (!routeItem) return null
  if (routeItem.components?.default && typeof routeItem.components.default === 'function') {
    return routeItem.components.default
  }
  if (typeof routeItem.component === 'function') {
    return routeItem.component
  }
  return null
}

const preloadRoute = (routeItem) => {
  const routeName = String(routeItem?.name || routeItem?.path || '')
  if (!routeName || preloadedRoutes.has(routeName)) return

  const loader = resolveRouteLoader(routeItem)
  if (!loader) return

  preloadedRoutes.add(routeName)
  Promise.resolve(loader()).catch(() => {
    preloadedRoutes.delete(routeName)
  })
}

const navIconMap = {
  upload: ['M12 3v10', 'm8 9 4 4 4-4', 'M5 20h14'],
  chart: ['M4 19h16', 'M7 15V9', 'M12 15V6', 'M17 15v-3'],
  bolt: ['M13 2 4 14h6l-1 8 9-12h-6l1-8'],
  book: ['M4 5a2 2 0 0 1 2-2h13v17H6a2 2 0 0 0-2 2V5z', 'M6 3v17'],
  flask: ['M10 2v5l-5 8a4 4 0 0 0 3.4 6h7.2A4 4 0 0 0 19 15l-5-8V2', 'M9 11h6'],
  cube: ['M12 3 4 7v10l8 4 8-4V7l-8-4z', 'M4 7l8 4 8-4', 'M12 11v13'],
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
  background: var(--bg-secondary);
}

.sidebar {
  width: 88px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  border-right: 1px solid var(--border-color-light);
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  backdrop-filter: blur(14px);
  box-shadow: 8px 0 24px rgba(0, 0, 0, 0.06);
}

.sidebar::before {
  content: "";
  width: 34px;
  height: 2px;
  border-radius: 999px;
  margin-top: 14px;
  background: var(--border-color-dark);
}

.sidebar-logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  margin-top: 12px;
  margin-bottom: 14px;
  background: var(--color-primary);
  color: var(--text-inverted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  letter-spacing: 0.04em;
  font-size: 12px;
  box-shadow: var(--shadow-sm);
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

.sidebar-footer {
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px 0 16px;
}

.lang-toggle {
  width: 52px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.lang-toggle:hover {
  border-color: var(--border-color-dark);
  color: var(--color-primary);
  background: var(--color-primary-lighter);
}

.lang-toggle:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.lang-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
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
  color: var(--text-secondary);
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
  background: var(--bg-tooltip);
  color: var(--text-inverted);
  font-size: 11px;
  line-height: 1;
  letter-spacing: 0.01em;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.nav-item:hover {
  border-color: var(--border-color-dark);
  background: var(--color-primary-lighter);
  color: var(--color-primary);
  transform: translateY(-1px) scale(1.01);
}

.nav-item.active {
  border-color: var(--border-color-dark);
  background: var(--color-primary-light);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
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
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
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
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
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
  background: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-light);
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
  background: var(--bg-primary);
  color: var(--text-secondary);
  padding: 6px 7px;
  min-height: 38px;
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.workflow-step:hover {
  border-color: var(--border-color-dark);
  color: var(--color-primary);
  background: var(--bg-secondary);
  transform: translateY(-1px);
}

.workflow-step.done {
  border-color: var(--color-success-light);
  background: var(--color-success-bg);
  color: var(--color-success-text);
}

.workflow-step.active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
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
  box-shadow: 0 0 0 2px var(--color-primary-light);
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
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
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
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 12px;
  padding: 5px 8px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.workflow-btn:hover {
  border-color: var(--border-color-dark);
  background: var(--bg-secondary);
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
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.workflow-btn.ghost {
  color: var(--text-secondary);
}

.workflow-btn.guard {
  border-color: var(--color-warning-light);
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.workflow-btn.guard:hover {
  border-color: var(--color-warning);
  background: var(--color-warning-bg);
}

.workflow-guard {
  margin-top: 6px;
  border: 1px solid var(--color-warning-light);
  background: var(--color-warning-bg);
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
  background: var(--color-warning);
  box-shadow: 0 0 0 3px rgba(202, 138, 4, 0.16);
}

.workflow-guard-label {
  font-size: 11px;
  color: #854d0e;
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

  .lang-toggle {
    width: 44px;
    height: 30px;
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

@media (max-width: 640px) {
  .sidebar {
    width: 56px;
  }

  .main-content {
    margin-left: 56px;
    width: calc(100% - 56px);
  }

  .content-wrapper {
    padding: 10px;
  }

  .nav-item {
    width: 40px;
    height: 40px;
  }

  .lang-toggle {
    width: 40px;
    height: 28px;
  }

  .workflow-head {
    gap: 6px;
    flex-wrap: wrap;
  }

  .workflow-track {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .workflow-step {
    flex: 0 0 42px;
    min-width: 42px;
    min-height: 34px;
  }

  .ai-search-container {
    right: 12px;
    bottom: 12px;
  }
}

.ai-search-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 50;
}

</style>
