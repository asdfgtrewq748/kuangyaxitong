/**
 * UI State Store
 *
 * 管理 UI 相关状态：
 * - 面板显示/隐藏（侧边栏、控制面板）
 * - 模态框
 * - Toast 通知
 * - 工具栏状态
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const sidebarCollapsed = ref(false)
  const controlPanelVisible = ref(true)
  const loadingOverlay = ref(false)

  // Modal
  const activeModal = ref(null)
  const modalProps = ref({})

  // Toast
  const toasts = ref([])

  // 工具栏状态
  const activeToolbar = ref('default')

  // Actions
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setSidebarCollapsed(collapsed) {
    sidebarCollapsed.value = collapsed
  }

  function toggleControlPanel() {
    controlPanelVisible.value = !controlPanelVisible.value
  }

  function setControlPanelVisible(visible) {
    controlPanelVisible.value = visible
  }

  function showLoading() {
    loadingOverlay.value = true
  }

  function hideLoading() {
    loadingOverlay.value = false
  }

  // Modal
  function showModal(modalId, props = {}) {
    activeModal.value = modalId
    modalProps.value = props
  }

  function hideModal() {
    activeModal.value = null
    modalProps.value = {}
  }

  // Toast
  function addToast(message, type = 'info', duration = 3000) {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      type, // 'success' | 'error' | 'warning' | 'info'
      duration
    }
    toasts.value.push(toast)

    // 自动移除
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function clearToasts() {
    toasts.value = []
  }

  // 快捷方式
  function showToast(message) {
    return addToast(message, 'info')
  }

  function showSuccess(message) {
    return addToast(message, 'success')
  }

  function showError(message) {
    return addToast(message, 'error', 5000) // 错误消息显示更久
  }

  function showWarning(message) {
    return addToast(message, 'warning')
  }

  // 工具栏
  function setActiveToolbar(toolbarId) {
    activeToolbar.value = toolbarId
  }

  // 重置
  function reset() {
    sidebarCollapsed.value = false
    controlPanelVisible.value = true
    loadingOverlay.value = false
    activeModal.value = null
    modalProps.value = {}
    clearToasts()
    activeToolbar.value = 'default'
  }

  return {
    // State
    sidebarCollapsed,
    controlPanelVisible,
    loadingOverlay,
    activeModal,
    modalProps,
    toasts,
    activeToolbar,

    // Actions
    toggleSidebar,
    setSidebarCollapsed,
    toggleControlPanel,
    setControlPanelVisible,
    showLoading,
    hideLoading,
    showModal,
    hideModal,
    addToast,
    removeToast,
    clearToasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    setActiveToolbar,
    reset
  }
})
