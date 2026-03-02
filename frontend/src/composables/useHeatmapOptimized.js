/**
 * 高性能热力图渲染组合式函数
 * 包含多种优化策略：
 * - 脏矩形检测
 * - 离屏缓存
 * - 瓦片渲染
 * - 渐进渲染
 */

import { ref, shallowRef, computed, onBeforeUnmount } from 'vue'

export function useHeatmapOptimized() {
  // 配置
  const config = ref({
    tileSize: 256,
    maxTileCache: 20,
    useOffscreen: typeof OffscreenCanvas !== 'undefined',
    progressiveRender: true,
    renderDelay: 16
  })

  // 瓦片缓存
  const tileCache = shallowRef(new Map())
  const renderQueue = ref([])
  const isRendering = ref(false)
  
  // 脏矩形区域
  const dirtyRects = ref([])
  
  // 离屏缓存
  const offscreenCanvas = shallowRef(null)
  
  // 动画帧ID
  let renderFrameId = null
  let lastRenderTime = 0

  /**
   * 初始化离屏画布
   */
  function initOffscreenCanvas(width, height) {
    if (config.value.useOffscreen) {
      offscreenCanvas.value = new OffscreenCanvas(width, height)
    } else {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      offscreenCanvas.value = canvas
    }
    return offscreenCanvas.value
  }

  /**
   * 创建瓦片键
   */
  function getTileKey(zoom, x, y) {
    return `${zoom}:${x}:${y}`
  }

  /**
   * 计算瓦片坐标
   */
  function getTileCoords(row, col, tileRows, tileCols) {
    return {
      x: Math.floor(col / tileCols),
      y: Math.floor(row / tileRows)
    }
  }

  /**
   * 将矩阵分割为瓦片
   */
  function splitIntoTiles(matrix, rows, cols, options = {}) {
    const tileSize = options.tileSize || config.value.tileSize
    const tilesPerRow = Math.ceil(cols / tileSize)
    const tilesPerCol = Math.ceil(rows / tileSize)
    
    const tiles = []
    
    for (let tileY = 0; tileY < tilesPerCol; tileY++) {
      for (let tileX = 0; tileX < tilesPerRow; tileX++) {
        const startRow = tileY * tileSize
        const endRow = Math.min(startRow + tileSize, rows)
        const startCol = tileX * tileSize
        const endCol = Math.min(startCol + tileSize, cols)
        
        const tileData = []
        for (let row = startRow; row < endRow; row++) {
          tileData.push(matrix[row].slice(startCol, endCol))
        }
        
        tiles.push({
          x: tileX,
          y: tileY,
          data: tileData,
          startRow,
          startCol,
          rows: endRow - startRow,
          cols: endCol - startCol
        })
      }
    }
    
    return tiles
  }

  /**
   * 渲染瓦片到画布
   */
  function renderTile(tile, canvas, options = {}) {
    const { 
      colorScale, 
      minValue, 
      maxValue, 
      cellWidth, 
      cellHeight,
      antialias = false 
    } = options
    
    const ctx = canvas.getContext('2d')
    const { data, rows, cols } = tile
    
    // 设置抗锯齿
    ctx.imageSmoothingEnabled = antialias
    ctx.imageSmoothingQuality = 'low'
    
    // 使用 ImageData 批量渲染
    const w = cols * cellWidth
    const h = rows * cellHeight
    
    if (w <= 0 || h <= 0) return
    
    // 缩放到合适的尺寸
    canvas.width = w
    canvas.height = h
    
    const imageData = ctx.createImageData(w, h)
    const pixels = imageData.data
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const value = data[row][col]
        if (!Number.isFinite(value)) continue
        
        const t = (value - minValue) / (maxValue - minValue)
        const color = colorScale(t)
        
        // 填充该单元格对应的所有像素
        const startX = col * cellWidth
        const startY = row * cellHeight
        
        for (let py = startY; py < startY + cellHeight; py++) {
          for (let px = startX; px < startX + cellWidth; px++) {
            const idx = (py * w + px) * 4
            pixels[idx] = color.r
            pixels[idx + 1] = color.g
            pixels[idx + 2] = color.b
            pixels[idx + 3] = 255
          }
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
  }

  /**
   * 渐进渲染 - 分块渲染大数据集
   */
  function progressiveRender(renderFn, totalItems, options = {}) {
    const chunkSize = options.chunkSize || 1000
    const delay = options.delay || config.value.renderDelay
    
    return new Promise((resolve) => {
      let index = 0
      
      function renderChunk() {
        const start = performance.now()
        
        while (index < totalItems && performance.now() - start < 16) {
          const end = Math.min(index + chunkSize, totalItems)
          renderFn(index, end)
          index = end
        }
        
        if (index < totalItems) {
          renderFrameId = requestAnimationFrame(renderChunk)
        } else {
          resolve()
        }
      }
      
      renderChunk()
    })
  }

  /**
   * 脏矩形渲染 - 只重绘变化的区域
   */
  function markDirty(rect) {
    // 合并重叠的脏矩形
    const newRects = []
    let merged = false
    
    for (const existing of dirtyRects.value) {
      if (rectsIntersect(rect, existing)) {
        // 合并
        rect = mergeRects(rect, existing)
        merged = true
      } else {
        newRects.push(existing)
      }
    }
    
    newRects.push(rect)
    dirtyRects.value = newRects
  }

  /**
   * 检查两个矩形是否相交
   */
  function rectsIntersect(r1, r2) {
    return !(r2.x > r1.x + r1.w ||
             r2.x + r2.w < r1.x ||
             r2.y > r1.y + r1.h ||
             r2.y + r2.h < r1.y)
  }

  /**
   * 合并两个矩形
   */
  function mergeRects(r1, r2) {
    const x = Math.min(r1.x, r2.x)
    const y = Math.min(r1.y, r2.y)
    const w = Math.max(r1.x + r1.w, r2.x + r2.w) - x
    const h = Math.max(r1.y + r1.h, r2.y + r2.h) - y
    return { x, y, w, h }
  }

  /**
   * 渲染脏矩形
   */
  function renderDirtyRects(ctx, renderFn) {
    ctx.save()
    
    // 裁剪到脏矩形区域
    ctx.beginPath()
    for (const rect of dirtyRects.value) {
      ctx.rect(rect.x, rect.y, rect.w, rect.h)
    }
    ctx.clip()
    
    // 渲染
    renderFn(ctx)
    
    ctx.restore()
    
    // 清空脏矩形列表
    dirtyRects.value = []
  }

  /**
   * 双缓冲渲染
   */
  function doubleBufferRender(mainCtx, renderFn, options = {}) {
    const width = options.width
    const height = options.height
    
    // 确保离屏画布存在
    if (!offscreenCanvas.value || 
        offscreenCanvas.value.width !== width || 
        offscreenCanvas.value.height !== height) {
      initOffscreenCanvas(width, height)
    }
    
    // 在离屏画布上渲染
    const offCtx = offscreenCanvas.value.getContext('2d')
    offCtx.clearRect(0, 0, width, height)
    renderFn(offCtx)
    
    // 一次性复制到主画布
    mainCtx.drawImage(offscreenCanvas.value, 0, 0)
  }

  /**
   * 智能重绘调度
   */
  function scheduleRender(renderFn, options = {}) {
    const { priority = 'normal', debounce = 0 } = options
    
    if (renderFrameId) {
      cancelAnimationFrame(renderFrameId)
    }
    
    const execute = () => {
      lastRenderTime = performance.now()
      isRendering.value = true
      renderFn()
      isRendering.value = false
    }
    
    if (debounce > 0) {
      setTimeout(() => {
        renderFrameId = requestAnimationFrame(execute)
      }, debounce)
    } else {
      renderFrameId = requestAnimationFrame(execute)
    }
  }

  /**
   * 预计算颜色查找表
   */
  function createColorLookup(colors, size = 256) {
    const lookup = new Uint32Array(size)
    
    for (let i = 0; i < size; i++) {
      const t = i / (size - 1)
      const color = interpolateColorArray(colors, t)
      lookup[i] = (255 << 24) | (color.b << 16) | (color.g << 8) | color.r
    }
    
    return lookup
  }

  /**
   * 颜色插值
   */
  function interpolateColorArray(colors, t) {
    const idx = t * (colors.length - 1)
    const lower = Math.floor(idx)
    const upper = Math.ceil(idx)
    const frac = idx - lower
    
    const c1 = hexToRgb(colors[lower] || colors[0])
    const c2 = hexToRgb(colors[upper] || colors[colors.length - 1])
    
    const smoothT = frac * frac * (3 - 2 * frac)
    
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * smoothT),
      g: Math.round(c1.g + (c2.g - c1.g) * smoothT),
      b: Math.round(c1.b + (c2.b - c1.b) * smoothT)
    }
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 128, g: 128, b: 128 }
  }

  /**
   * 空间哈希 - 快速空间查询
   */
  function createSpatialHash(cellSize) {
    const cells = new Map()
    
    return {
      insert(item, x, y) {
        const key = `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`
        if (!cells.has(key)) {
          cells.set(key, [])
        }
        cells.get(key).push(item)
      },
      
      query(x, y, radius) {
        const results = []
        const minX = Math.floor((x - radius) / cellSize)
        const maxX = Math.floor((x + radius) / cellSize)
        const minY = Math.floor((y - radius) / cellSize)
        const maxY = Math.floor((y + radius) / cellSize)
        
        for (let cx = minX; cx <= maxX; cx++) {
          for (let cy = minY; cy <= maxY; cy++) {
            const key = `${cx},${cy}`
            const cell = cells.get(key)
            if (cell) {
              results.push(...cell)
            }
          }
        }
        
        return results
      },
      
      clear() {
        cells.clear()
      }
    }
  }

  /**
   * 性能监控
   */
  const performanceMetrics = ref({
    renderTime: 0,
    fps: 60,
    frameCount: 0,
    lastFpsUpdate: performance.now()
  })

  function updatePerformanceMetrics() {
    const now = performance.now()
    performanceMetrics.value.frameCount++
    
    if (now - performanceMetrics.value.lastFpsUpdate >= 1000) {
      performanceMetrics.value.fps = performanceMetrics.value.frameCount
      performanceMetrics.value.frameCount = 0
      performanceMetrics.value.lastFpsUpdate = now
    }
  }

  /**
   * 清理
   */
  onBeforeUnmount(() => {
    if (renderFrameId) {
      cancelAnimationFrame(renderFrameId)
    }
    tileCache.value.clear()
  })

  return {
    // 配置
    config,
    
    // 状态
    isRendering,
    tileCache,
    performanceMetrics,
    
    // 核心方法
    splitIntoTiles,
    renderTile,
    progressiveRender,
    markDirty,
    renderDirtyRects,
    doubleBufferRender,
    scheduleRender,
    createColorLookup,
    createSpatialHash,
    updatePerformanceMetrics
  }
}
