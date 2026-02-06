import { reactive } from 'vue'

export function useViewport() {
  const viewport = reactive({
    x: 0,
    y: 0,
    scale: 1,
    isDragging: false,
    lastX: 0,
    lastY: 0
  })

  const worldToScreen = (wx, wy, bounds) => {
    if (!bounds) return { x: 0, y: 0 }
    const dx = wx - bounds.min_x
    const dy = bounds.max_y - wy
    return {
      x: dx * viewport.scale + viewport.x,
      y: dy * viewport.scale + viewport.y
    }
  }

  const screenToWorld = (sx, sy, bounds) => {
    if (!bounds || viewport.scale === 0) return { x: 0, y: 0 }
    const dx = (sx - viewport.x) / viewport.scale
    const dy = (sy - viewport.y) / viewport.scale
    return {
      x: bounds.min_x + dx,
      y: bounds.max_y - dy
    }
  }

  const fitToBounds = (bounds, screenW, screenH, padding = 56) => {
    if (!bounds || !screenW || !screenH) return
    const worldW = Math.max(bounds.max_x - bounds.min_x, 1e-6)
    const worldH = Math.max(bounds.max_y - bounds.min_y, 1e-6)
    const scale = Math.min(
      (screenW - padding * 2) / worldW,
      (screenH - padding * 2) / worldH
    )

    const midX = (bounds.min_x + bounds.max_x) / 2
    const midY = (bounds.min_y + bounds.max_y) / 2
    viewport.scale = Math.max(0.01, scale)
    viewport.x = screenW / 2 - (midX - bounds.min_x) * viewport.scale
    viewport.y = screenH / 2 - (bounds.max_y - midY) * viewport.scale
  }

  const startDrag = (clientX, clientY) => {
    viewport.isDragging = true
    viewport.lastX = clientX
    viewport.lastY = clientY
  }

  const dragTo = (clientX, clientY) => {
    if (!viewport.isDragging) return
    viewport.x += clientX - viewport.lastX
    viewport.y += clientY - viewport.lastY
    viewport.lastX = clientX
    viewport.lastY = clientY
  }

  const endDrag = () => {
    viewport.isDragging = false
  }

  const zoomAt = (factor, sx, sy, bounds, minScale = 0.1, maxScale = 50) => {
    if (!bounds) return
    const nextScale = Math.max(minScale, Math.min(maxScale, viewport.scale * factor))
    if (nextScale === viewport.scale) return
    const anchor = screenToWorld(sx, sy, bounds)
    viewport.scale = nextScale
    viewport.x = sx - (anchor.x - bounds.min_x) * viewport.scale
    viewport.y = sy - (bounds.max_y - anchor.y) * viewport.scale
  }

  return {
    viewport,
    worldToScreen,
    screenToWorld,
    fitToBounds,
    startDrag,
    dragTo,
    endDrag,
    zoomAt
  }
}

