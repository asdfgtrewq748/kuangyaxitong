/**
 * Cache Management Store
 *
 * 管理应用缓存：
 * - API 响应缓存
 * - 计算结果缓存
 * - TTL 管理
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCacheStore = defineStore('cache', () => {
  // State
  const cache = ref(new Map())
  const defaultTTL = 5 * 60 * 1000 // 5 分钟

  // Actions
  function set(key, value, ttl = defaultTTL) {
    const expiresAt = Date.now() + ttl
    cache.value.set(key, { value, expiresAt })
  }

  function get(key) {
    const item = cache.value.get(key)
    if (!item) return null

    // 检查是否过期
    if (Date.now() > item.expiresAt) {
      cache.value.delete(key)
      return null
    }

    return item.value
  }

  function has(key) {
    return get(key) !== null
  }

  function remove(key) {
    cache.value.delete(key)
  }

  function clear() {
    cache.value.clear()
  }

  // 清理过期缓存
  function cleanup() {
    const now = Date.now()
    for (const [key, item] of cache.value.entries()) {
      if (now > item.expiresAt) {
        cache.value.delete(key)
      }
    }
  }

  // 获取缓存统计
  function getStats() {
    let total = 0
    let expired = 0
    const now = Date.now()

    for (const item of cache.value.values()) {
      total++
      if (now > item.expiresAt) {
        expired++
      }
    }

    return {
      total,
      expired,
      active: total - expired
    }
  }

  // 定期清理过期缓存（每分钟）
  function startCleanup(interval = 60000) {
    return setInterval(cleanup, interval)
  }

  return {
    cache,
    defaultTTL,
    set,
    get,
    has,
    remove,
    clear,
    cleanup,
    getStats,
    startCleanup
  }
})
