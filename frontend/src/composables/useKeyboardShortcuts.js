/**
 * 键盘快捷键组合式函数
 */

import { onMounted, onUnmounted } from 'vue'

export function useKeyboardShortcuts(shortcuts) {
  const handlers = new Map()

  function normalizeKey(event) {
    const keys = []
    if (event.ctrlKey || event.metaKey) keys.push('Ctrl')
    if (event.altKey) keys.push('Alt')
    if (event.shiftKey) keys.push('Shift')
    keys.push(event.key)
    return keys.join('+')
  }

  function handleKeyDown(event) {
    // 忽略输入框中的快捷键
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return
    }

    const keyCombo = normalizeKey(event)
    const handler = handlers.get(keyCombo)
    
    if (handler) {
      event.preventDefault()
      handler(event)
    }
  }

  function register(keyCombo, handler) {
    handlers.set(keyCombo, handler)
  }

  function unregister(keyCombo) {
    handlers.delete(keyCombo)
  }

  // 注册所有快捷键
  onMounted(() => {
    if (shortcuts) {
      Object.entries(shortcuts).forEach(([key, handler]) => {
        register(key, handler)
      })
    }
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    handlers.clear()
  })

  return {
    register,
    unregister
  }
}

// 预定义的快捷键组合
export const KEYBOARD_SHORTCUTS = {
  // 导航
  REFRESH: 'Ctrl+R',
  RESET_VIEW: 'Ctrl+0',
  ZOOM_IN: 'Ctrl+Plus',
  ZOOM_OUT: 'Ctrl+Minus',
  
  // 功能
  EXPORT: 'Ctrl+E',
  FULLSCREEN: 'F11',
  TOGGLE_GRID: 'Ctrl+G',
  
  // 分析
  ANOMALY_DETECT: 'Ctrl+Shift+A',
  TREND_ANALYSIS: 'Ctrl+Shift+T',
  
  // 标签页
  TAB_NEXT: 'Tab',
  TAB_PREV: 'Shift+Tab',
  
  // 数据
  APPLY_FILTER: 'Ctrl+Enter',
  RESET_FILTER: 'Ctrl+Shift+R'
}
