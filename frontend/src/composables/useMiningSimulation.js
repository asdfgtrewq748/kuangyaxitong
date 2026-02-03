import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'

/**
 * Mining Simulation Composable
 * Handles directional mining advancement simulation with playback controls
 */
export function useMiningSimulation(workface, options = {}) {
  // Configuration
  const config = {
    totalDistance: options.totalDistance || 500,  // Total mining distance in meters
    frameRate: options.frameRate || 60,
    progressPerSecond: options.progressPerSecond || 10, // % per second at 1x speed
    autoPlay: options.autoPlay || false
  }

  // State
  const state = reactive({
    isPlaying: config.autoPlay,
    progress: 0,
    direction: 0,        // Direction angle in degrees (0 = East, 90 = North)
    playbackSpeed: 1,     // Playback speed multiplier (0.5x - 5x)
    lastFrameTime: 0,
    animationId: null
  })

  // Computed values
  const currentDistance = computed(() => (state.progress / 100) * config.totalDistance)
  const remainingDistance = computed(() => config.totalDistance - currentDistance.value)
  const isComplete = computed(() => state.progress >= 100)

  // Direction in radians for calculations
  const directionRad = computed(() => (state.direction - 90) * Math.PI / 180)

  // Workface bounds
  const workfaceBounds = computed(() => {
    if (!workface.value) return null
    if (workface.value.bounds) return workface.value.bounds

    // Calculate bounds from polygon points
    if (workface.value.points && workface.value.points.length > 0) {
      const xs = workface.value.points.map(p => p[0])
      const ys = workface.value.points.map(p => p[1])
      return {
        min_x: Math.min(...xs),
        max_x: Math.max(...xs),
        min_y: Math.min(...ys),
        max_y: Math.max(...ys)
      }
    }

    return null
  })

  const workfaceCenter = computed(() => {
    if (!workfaceBounds.value) return null
    return {
      x: (workfaceBounds.value.min_x + workfaceBounds.value.max_x) / 2,
      y: (workfaceBounds.value.min_y + workfaceBounds.value.max_y) / 2
    }
  })

  const workfaceLength = computed(() => {
    if (!workfaceBounds.value) return 0
    return workfaceBounds.value.max_y - workfaceBounds.value.min_y
  })

  /**
   * Calculate the front line (mining face) at current progress and direction
   * @returns {Object} Line segment with start, end points and perpendicular angle
   */
  const frontLine = computed(() => {
    if (!workfaceCenter.value || !workfaceBounds.value) return null

    const angle = directionRad.value
    const maxWidth = workfaceBounds.value.max_x - workfaceBounds.value.min_x
    const distance = maxWidth * (state.progress / 100)

    // Calculate front line center point
    const startX = workfaceBounds.value.min_x
    const frontCenterX = startX + Math.cos(angle) * distance
    const frontCenterY = workfaceCenter.value.y + Math.sin(angle) * distance

    // Front line is perpendicular to direction
    const perpAngle = angle + Math.PI / 2
    const halfLength = workfaceLength.value / 2

    return {
      start: {
        x: frontCenterX - Math.cos(perpAngle) * halfLength,
        y: frontCenterY - Math.sin(perpAngle) * halfLength
      },
      end: {
        x: frontCenterX + Math.cos(perpAngle) * halfLength,
        y: frontCenterY + Math.sin(perpAngle) * halfLength
      },
      center: { x: frontCenterX, y: frontCenterY },
      angle: perpAngle,
      length: workfaceLength.value
    }
  })

  /**
   * Calculate goaf (mined area) polygon
   * @returns {Array} Array of points defining the goaf polygon
   */
  const goafArea = computed(() => {
    if (!workfaceBounds.value || !frontLine.value) return null

    const angle = directionRad.value
    const backLeft = { x: workfaceBounds.value.min_x, y: workfaceBounds.value.max_y }
    const backRight = { x: workfaceBounds.value.min_x, y: workfaceBounds.value.min_y }

    // Calculate back line corners rotated by direction
    const center = workfaceCenter.value
    const initialX = workfaceBounds.value.min_x

    // Goaf polygon consists of:
    // - Initial back line (rotated and positioned)
    // - Two side lines connecting back to front
    // - Current front line

    // For simplicity, we create a polygon that extends from the initial position
    // along the direction to the current front line
    const backCenter = {
      x: center.x - Math.cos(angle) * (center.x - initialX),
      y: center.y - Math.sin(angle) * (center.x - initialX)
    }

    const perpAngle = angle + Math.PI / 2
    const halfLength = workfaceLength.value / 2

    // Back line points (perpendicular to direction)
    const backLineStart = {
      x: backCenter.x - Math.cos(perpAngle) * halfLength,
      y: backCenter.y - Math.sin(perpAngle) * halfLength
    }
    const backLineEnd = {
      x: backCenter.x + Math.cos(perpAngle) * halfLength,
      y: backCenter.y + Math.sin(perpAngle) * halfLength
    }

    // Connect to form closed polygon
    return [
      backLineStart,
      backLineEnd,
      frontLine.value.end,
      frontLine.value.start
    ]
  })

  /**
   * Calculate stress zone (ahead of face)
   * @param {Number} distance - Distance ahead of face in meters
   * @returns {Object} Area definition with bounds
   */
  const stressZone = computed(() => {
    if (!frontLine.value) return null

    const aheadDistance = 50  // 50m stress influence zone
    const scale = aheadDistance / frontLine.value.length

    return {
      distance: aheadDistance,
      frontLine: frontLine.value,
      // Can be used for rendering gradient
    }
  })

  /**
   * Calculate relief zone (behind face in goaf)
   */
  const reliefZone = computed(() => {
    if (!frontLine.value) return null

    const behindDistance = 30  // 30m relief zone

    return {
      distance: behindDistance,
      frontLine: frontLine.value
    }
  })

  // Controls
  const play = () => {
    if (isComplete.value) {
      state.progress = 0
    }
    state.isPlaying = true
    state.lastFrameTime = performance.now()
    startAnimationLoop()
  }

  const pause = () => {
    state.isPlaying = false
    if (state.animationId) {
      cancelAnimationFrame(state.animationId)
      state.animationId = null
    }
  }

  const togglePlay = () => {
    if (state.isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const seek = (value) => {
    state.progress = Math.max(0, Math.min(100, value))
  }

  const skipToStart = () => {
    seek(0)
  }

  const skipToEnd = () => {
    seek(100)
  }

  const stepForward = () => {
    seek(state.progress + 2)  // 2% increment
  }

  const stepBackward = () => {
    seek(state.progress - 2)
  }

  const setDirection = (angle) => {
    state.direction = angle % 360
    if (state.direction < 0) state.direction += 360
  }

  const setPlaybackSpeed = (speed) => {
    state.playbackSpeed = Math.max(0.1, Math.min(10, speed))
  }

  /**
   * Animation loop for smooth playback
   */
  const startAnimationLoop = () => {
    if (!state.isPlaying) return

    const now = performance.now()
    const deltaTime = now - state.lastFrameTime
    state.lastFrameTime = now

    // Calculate progress increment based on playback speed
    const progressDelta = (deltaTime / 1000) * config.progressPerSecond * state.playbackSpeed
    const newProgress = state.progress + progressDelta

    if (newProgress >= 100) {
      state.progress = 100
      state.isPlaying = false
    } else {
      state.progress = newProgress
      state.animationId = requestAnimationFrame(startAnimationLoop)
    }

    // Emit progress change for external listeners
    if (onProgressCallback) {
      onProgressCallback(state.progress)
    }
  }

  // Callback for progress updates
  let onProgressCallback = null

  const onProgress = (callback) => {
    onProgressCallback = callback
  }

  // Cleanup
  onUnmounted(() => {
    pause()
  })

  return {
    // State
    state,
    isPlaying: computed(() => state.isPlaying),
    progress: computed(() => state.progress),
    direction: computed(() => state.direction),
    playbackSpeed: computed(() => state.playbackSpeed),

    // Computed geometry
    frontLine,
    goafArea,
    stressZone,
    reliefZone,
    currentDistance,
    remainingDistance,
    isComplete,

    // Controls
    play,
    pause,
    togglePlay,
    seek,
    skipToStart,
    skipToEnd,
    stepForward,
    stepBackward,
    setDirection,
    setPlaybackSpeed,
    onProgress
  }
}
