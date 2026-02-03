import { ref, shallowRef, computed, onUnmounted } from 'vue'

/**
 * Optimized Particle System with Object Pooling
 * Reduces GC pressure by reusing particle objects
 */
export function useParticles(config = {}) {
  const {
    maxParticles = 200,
    particleLife = 2000, // ms
    emitRate = 2, // particles per frame
  } = config

  // Use shallowRef for large arrays to reduce reactivity overhead
  const particles = shallowRef([])
  const particlePool = []
  let animationId = null
  let lastEmitTime = 0

  // Pre-allocate particle pool (js-cache-function-results pattern)
  const initPool = () => {
    for (let i = 0; i < maxParticles + 50; i++) {
      particlePool.push(createParticle())
    }
  }

  /**
   * Particle class with pooling support
   */
  function createParticle() {
    return {
      x: 0, y: 0, vx: 0, vy: 0,
      type: 'stress',
      life: 0,
      maxLife: particleLife,
      birth: 0,
      size: 2,
      colorHue: 0,
      colorSat: 80,
      colorLight: 60,
      active: false
    }
  }

  /**
   * Acquire particle from pool (js-index-maps pattern)
   */
  function acquireParticle() {
    // Find inactive particle
    for (let i = 0; i < particlePool.length; i++) {
      if (!particlePool[i].active) {
        return particlePool[i]
      }
    }
    // Pool exhausted, create new
    const p = createParticle()
    particlePool.push(p)
    return p
  }

  /**
   * Release particle back to pool
   */
  function releaseParticle(p) {
    p.active = false
  }

  /**
   * Initialize particle with values
   */
  function initParticle(p, x, y, vx, vy, type = 'stress') {
    p.x = x
    p.y = y
    p.vx = vx
    p.vy = vy
    p.type = type
    p.life = 1
    p.maxLife = particleLife + Math.random() * 500 - 250
    p.birth = Date.now()
    p.size = 2 + Math.random() * 2
    p.active = true

    // Stress particles: red/orange, Relief particles: blue/cyan
    if (type === 'stress') {
      p.colorHue = Math.random() * 30
    } else {
      p.colorHue = 200 + Math.random() * 40
    }
  }

  /**
   * Emit stress particles along a line
   * @param {Array} line - Array of {x, y} points defining the emission line
   * @param {Object} direction - {x, y} normalized direction vector
   * @param {Number} speed - Base particle speed
   */
  const emitStressParticles = (line, direction, speed = 1) => {
    // Count active particles (js-length-check-first pattern)
    let activeCount = 0
    for (let i = 0; i < particlePool.length; i++) {
      if (particlePool[i].active) activeCount++
    }

    if (activeCount >= maxParticles) return

    const spread = 0.3
    const now = Date.now()

    for (let i = 0; i < emitRate; i++) {
      const p = acquireParticle()

      // Random position along the line
      const t = Math.random()
      const x = line[0].x + (line[1].x - line[0].x) * t
      const y = line[0].y + (line[1].y - line[0].y) * t

      // Velocity with spread
      const vx = direction.x * speed + (Math.random() - 0.5) * spread
      const vy = direction.y * speed + (Math.random() - 0.5) * spread

      initParticle(p, x, y, vx, vy, 'stress')
    }

    // Update active particles array for drawing
    updateActiveParticles()
  }

  /**
   * Emit relief particles in an area
   */
  const emitReliefParticles = (area, speed = 0.5) => {
    let activeCount = 0
    for (let i = 0; i < particlePool.length; i++) {
      if (particlePool[i].active) activeCount++
    }

    if (activeCount >= maxParticles) return

    for (let i = 0; i < Math.ceil(emitRate / 2); i++) {
      const p = acquireParticle()

      // Random position in area
      const x = area.minX + Math.random() * (area.maxX - area.minX)
      const y = area.minY + Math.random() * (area.maxY - area.minY)

      // Random velocity direction
      const angle = Math.random() * Math.PI * 2
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed

      initParticle(p, x, y, vx, vy, 'relief')
    }

    updateActiveParticles()
  }

  /**
   * Update active particles array for drawing
   * Called after emitting to sync the display array
   */
  function updateActiveParticles() {
    const active = []
    for (let i = 0; i < particlePool.length; i++) {
      if (particlePool[i].active) {
        active.push(particlePool[i])
      }
    }
    particles.value = active
  }

  /**
   * Update all particles (js-combine-iterations pattern)
   * @param {Number} dt - Delta time in seconds
   */
  const update = (dt = 0.016) => {
    const now = Date.now()
    const writeIdx = 0

    // Update in place, filtering dead particles
    for (let i = 0; i < particlePool.length; i++) {
      const p = particlePool[i]
      if (!p.active) continue

      const age = now - p.birth
      p.life = 1 - (age / p.maxLife)

      if (p.life <= 0) {
        p.active = false
        continue
      }

      // Apply velocity
      p.x += p.vx * dt
      p.y += p.vy * dt

      // Add turbulence
      p.vx += (Math.random() - 0.5) * 0.02
      p.vy += (Math.random() - 0.5) * 0.02

      // Damping
      p.vx *= 0.99
      p.vy *= 0.99
    }

    updateActiveParticles()
  }

  /**
   * Draw all particles (batch Canvas operations)
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  const draw = (ctx) => {
    // Batch draw calls by particle type (js-batch-dom-css pattern)
    const stressParticles = []
    const reliefParticles = []

    for (let i = 0; i < particles.value.length; i++) {
      const p = particles.value[i]
      if (p.type === 'stress') {
        stressParticles.push(p)
      } else {
        reliefParticles.push(p)
      }
    }

    // Draw stress particles
    for (let i = 0; i < stressParticles.length; i++) {
      const p = stressParticles[i]
      const alpha = p.life * 0.6
      ctx.fillStyle = `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight}%, ${alpha})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw relief particles
    for (let i = 0; i < reliefParticles.length; i++) {
      const p = reliefParticles[i]
      const alpha = p.life * 0.6
      ctx.fillStyle = `hsla(${p.colorHue}, ${p.colorSat}%, ${p.colorLight}%, ${alpha})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  /**
   * Clear all particles
   */
  const clear = () => {
    for (let i = 0; i < particlePool.length; i++) {
      particlePool[i].active = false
    }
    particles.value = []
  }

  /**
   * Get particle count
   */
  const count = computed(() => particles.value.length)

  // Initialize particle pool on creation
  initPool()

  /**
   * Start animation loop
   * @param {Function} renderFn - Function to call each frame
   */
  const startAnimation = (renderFn) => {
    if (animationId) cancelAnimationFrame(animationId)

    let lastTime = performance.now()

    const loop = () => {
      const now = performance.now()
      const dt = (now - lastTime) / 1000
      lastTime = now

      update(dt)
      renderFn()

      animationId = requestAnimationFrame(loop)
    }

    animationId = requestAnimationFrame(loop)
  }

  /**
   * Stop animation loop
   */
  const stopAnimation = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  /**
   * Cleanup on unmount
   */
  onUnmounted(() => {
    stopAnimation()
    clear()
  })

  return {
    particles,
    count,
    emitStressParticles,
    emitReliefParticles,
    update,
    draw,
    clear,
    startAnimation,
    stopAnimation
  }
}

/**
 * Optimized Ripple Effect with Object Pooling
 */
export function useRipples(config = {}) {
  const {
    maxRipples = 10,
    rippleSpeed = 50, // pixels per second
    rippleInterval = 800, // ms between ripples
  } = config

  // Use shallowRef for arrays
  const ripples = shallowRef([])
  const ripplePool = []
  let lastRippleTime = 0

  // Initialize ripple pool
  const initRipplePool = () => {
    for (let i = 0; i < maxRipples + 2; i++) {
      ripplePool.push({
        x: 0, y: 0, radius: 0,
        maxRadius: 100,
        life: 0,
        speed: rippleSpeed,
        width: 2,
        active: false
      })
    }
  }

  function acquireRipple() {
    for (let i = 0; i < ripplePool.length; i++) {
      if (!ripplePool[i].active) {
        return ripplePool[i]
      }
    }
    const r = { x: 0, y: 0, radius: 0, maxRadius: 100, life: 0, speed: rippleSpeed, width: 2, active: false }
    ripplePool.push(r)
    return r
  }

  function updateActiveRipples() {
    const active = []
    for (let i = 0; i < ripplePool.length; i++) {
      if (ripplePool[i].active) {
        active.push(ripplePool[i])
      }
    }
    ripples.value = active
  }

  const emit = (x, y) => {
    const now = Date.now()
    if (now - lastRippleTime < rippleInterval) return

    // Count active ripples
    let activeCount = 0
    for (let i = 0; i < ripplePool.length; i++) {
      if (ripplePool[i].active) activeCount++
    }
    if (activeCount >= maxRipples) return

    const r = acquireRipple()
    r.x = x
    r.y = y
    r.radius = 0
    r.maxRadius = 100 + Math.random() * 50
    r.life = 1
    r.speed = rippleSpeed + Math.random() * 20
    r.width = 2 + Math.random() * 2
    r.active = true
    lastRippleTime = now

    updateActiveRipples()
  }

  const update = (dt = 0.016) => {
    for (let i = 0; i < ripplePool.length; i++) {
      const r = ripplePool[i]
      if (!r.active) continue

      r.radius += r.speed * dt
      r.life = 1 - (r.radius / r.maxRadius)

      if (r.life <= 0) {
        r.active = false
      }
    }
    updateActiveRipples()
  }

  const draw = (ctx) => {
    // Batch stroke style setting
    for (let i = 0; i < ripples.value.length; i++) {
      const r = ripples.value[i]
      ctx.beginPath()
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(239, 68, 68, ${r.life * 0.5})`
      ctx.lineWidth = r.width * r.life
      ctx.stroke()
    }
  }

  const clear = () => {
    for (let i = 0; i < ripplePool.length; i++) {
      ripplePool[i].active = false
    }
    ripples.value = []
  }

  // Initialize pool
  initRipplePool()

  return {
    ripples,
    emit,
    update,
    draw,
    clear
  }
}
