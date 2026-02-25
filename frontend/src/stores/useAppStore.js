/**
 * Global Application State Store
 *
 * 管理全局应用状态，包括：
 * - 主题设置
 * - 用户信息
 * - 全局加载状态
 * - 应用配置
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const SUPPORTED_LANGUAGES = new Set(['zh-CN', 'en-US'])

  // State
  const theme = ref('light') // 'light' | 'dark'
  const language = ref('zh-CN')
  const user = ref(null)
  const globalLoading = ref(false)
  const appConfig = ref({
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    apiTimeout: 30000,
    enableDevTools: import.meta.env.DEV
  })

  // Computed
  const isDarkMode = computed(() => theme.value === 'dark')
  const isLoggedIn = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || '访客')

  // Actions
  function setTheme(newTheme) {
    theme.value = newTheme
    // 更新 DOM
    document.documentElement.setAttribute('data-theme', newTheme)
    // 持久化到 localStorage
    localStorage.setItem('theme', newTheme)
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  function setLanguage(lang) {
    const normalizedLanguage = SUPPORTED_LANGUAGES.has(lang) ? lang : 'zh-CN'
    language.value = normalizedLanguage
    document.documentElement.setAttribute('lang', normalizedLanguage)
    localStorage.setItem('language', normalizedLanguage)
  }

  function setUser(userData) {
    user.value = userData
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }

  function setGlobalLoading(loading) {
    globalLoading.value = loading
  }

  function updateConfig(newConfig) {
    appConfig.value = { ...appConfig.value, ...newConfig }
  }

  // 初始化（从 localStorage 恢复状态）
  function initialize() {
    // 恢复主题
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }

    // 恢复语言
    const savedLanguage = localStorage.getItem('language')
    setLanguage(savedLanguage || language.value)

    // 恢复用户
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        console.error('Failed to parse user data:', e)
        localStorage.removeItem('user')
      }
    }
  }

  return {
    // State
    theme,
    language,
    user,
    globalLoading,
    appConfig,

    // Computed
    isDarkMode,
    isLoggedIn,
    userName,

    // Actions
    setTheme,
    toggleTheme,
    setLanguage,
    setUser,
    logout,
    setGlobalLoading,
    updateConfig,
    initialize
  }
})
