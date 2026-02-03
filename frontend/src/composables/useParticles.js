import { ref, computed, onUnmounted } from 'vue'

/**
 * Particle System for Mining Simulation
 * Visualizes stress accumulation and relief zones with flowing particles
 */
export function useParticles(config = {}) {
  const {
    maxParticles = 200,
    particleLife = 2000, // ms
    emitRate = 2, // particles per frame
  } = config

  const particles = ref([])
  let animationId = null
  let lastEmitTime = 0

  /**
   * Particle class
   */
  class Particle {
    constructor(x, y, vx, vy, type = 'stress') {
      this.x = x
      this.y = y
      this.vx = vx
      this.vy = vy
      this.type = type // 'stress' or 'relief'
      this.life = 1 // 1 = full life, 0 = dead
      this.maxLife = particleLife + Math.random() * 500 - 250
      this.birth = Date.now()
      this.size = 2 + Math.random() * 2

      // Stress particles: red/orange, moving away from face
      // Relief particles: blue/cyan, moving toward goaf
      if (type === 'stress') {
        this.color = `hsl(${0 + Math.random() * 30}, 80%, 60%)` // Red to orange
      } else {
        this.color = `hsl(${200 + Math.random() * 40}, 80%, 60%)` // Blue to cyan
      }
    }

    update(dt) {
      const age = Date.now() - this.birth
      this.life = 1 - (age / this.maxLife)

      if (this.life <= 0) return false

      // Apply velocity
      this.x += this.vx * dt
      this.y += this.vy * dt

      // Add some turbulence
      this.vx += (Math.random() - 0.5) * 0.02
      this.vy += (Math.random() - 0.5) * 0.02

      // Damping
      this.vx *= 0.99
      this.vy *= 0.99

      return true
    }

    draw(ctx) {
      const alpha = this.life * 0.6
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2)
      ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla')
      ctx.fill()
    }
  }

  /**
   * Emit stress particles along a line
   * @param {Array} line - Array of {x, y} points defining the emission line
   * @param {Object} direction - {x, y} normalized direction vector
   * @param {Number} speed - Base particle speed
   */
  const emitStressParticles = (line, direction, speed = 1) => {
    if (particles.value.length >= maxParticles) return

    for (let i = 0; i < emitRate; i++) {
      // Random position along the line
      const t = Math.random()
      const x = line[0].x + (line[1].x - line[0].x) * t
      const y = line[0].y + (line[1].y - line[0].y) * t

      // Velocity in emission direction with some spread
      const spread = 0.3
      const vx = direction.x * speed + (Math.random() - 0.5) * spread
      const vy = direction.y * speed + (Math.random() - 0.5) * spread

      particles.value.push(new Particle(x, y, vx, vy, 'stress'))
    }
  }

  /**
   * Emit relief particles in an area
   */
  const emitReliefParticles = (area, speed = 0.5) => {
    if (particles.value.length >= maxParticles) return

    for (let i = 0; i < emitRate / 2; i++) {
      // Random position in area
      const x = area.minX + Math.random() * (area.maxX - area.minX)
      const y = area.minY + Math.random() * (area.maxY - area.minY)

      // Velocity generally toward goaf (backward)
      const angle = Math.random() * Math.PI * 2
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed

      particles.value.push(new Particle(x, y, vx, vy, 'relief'))
    }
  }

  /**
   * Update all particles
   * @param {Number} dt - Delta time in seconds
   */
  const update = (dt = 0.016) => {
    particles.value = particles.value.filter(p => p.update(dt))
  }

  /**
   * Draw all particles
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  const draw = (ctx) => {
    particles.value.forEach(p => p.draw(ctx))
  }

  /**
   * Clear all particles
   */
  const clear = () => {
    particles.value = []
  }

  /**
   * Get particle count
   */
  const count = computed(() => particles.value.length)

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
 * Ripple Effect for stress zone visualization
 */
export function useRipples(config = {}) {
  const {
    maxRipples = 10,
    rippleSpeed = 50, // pixels per second
    rippleInterval = 800, // ms between ripples
  } = config

  const ripples = ref([])
  let lastRippleTime = 0
  let animationId = null

  class Ripple {
    constructor(x, y) {
      this.x = x
      this.y = y
      this.radius = 0
      this.maxRadius = 100 + Math.random() * 50
      this.life = 1
      this.speed = rippleSpeed + Math.random() * 20
      this.width = 2 + Math.random() * 2
    }

    update(dt) {
      this.radius += this.speed * dt
      this.life = 1 - (this.radius / this.maxRadius)
      return this.life > 0
    }

    draw(ctx) {
      if (this.life <= 0) return

      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(239, 68, 68, ${this.life * 0.5})`
      ctx.lineWidth = this.width * this.life
      ctx.stroke()
    }
  }

  const emit = (x, y) => {
    const now = Date.now()
    if (now - lastRippleTime < rippleInterval) return
    if (ripples.value.length >= maxRipples) return

    ripples.value.push(new Ripple(x, y))
    lastRippleTime = now
  }

  const update = (dt = 0.016) => {
    ripples.value = ripples.value.filter(r => r.update(dt))
  }

  const draw = (ctx) => {
    ripples.value.forEach(r => r.draw(ctx))
  }

  const clear = () => {
    ripples.value = []
  }

  return {
    ripples,
    emit,
    update,
    draw,
    clear
  }
}
