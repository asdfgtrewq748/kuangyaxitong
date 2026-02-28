export class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = Math.max(1, Number(maxSize) || 100)
    this.cache = new Map()
  }

  has(key) {
    return this.cache.has(key)
  }

  get(key) {
    if (!this.cache.has(key)) return undefined
    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
    this.cache.set(key, value)
    return value
  }

  delete(key) {
    return this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  get size() {
    return this.cache.size
  }
}
