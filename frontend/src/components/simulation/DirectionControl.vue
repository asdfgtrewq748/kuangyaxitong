<template>
  <div class="direction-control">
    <div class="control-header">
      <span class="label">推进方向</span>
      <span class="value-display">{{ direction }}°</span>
    </div>

    <div class="compass-container">
      <div class="compass-ring">
        <div class="compass-marks">
          <span v-for="mark in compassMarks" :key="mark.angle"
                class="mark"
                :class="{ active: isDirectionActive(mark.angle) }"
                :style="{ transform: `rotate(${mark.angle}deg) translateX(-50%)` }">
            <span class="mark-label" :style="{ transform: `rotate(-${mark.angle}deg)` }">{{ mark.label }}</span>
          </span>
        </div>
        <div class="compass-arrow" :style="{ transform: `rotate(${direction}deg)` }">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4.5 20L12 17L19.5 20L12 2Z"/>
          </svg>
        </div>
        <div class="compass-center" :style="{ transform: `rotate(${direction}deg)` }">
          <div class="direction-line"></div>
        </div>
      </div>
    </div>

    <div class="quick-select">
      <button v-for="opt in quickOptions"
              :key="opt.value"
              :class="['quick-btn', { active: direction === opt.value }]"
              @click="$emit('update:direction', opt.value)"
              :title="opt.label">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path :d="opt.icon"/>
        </svg>
      </button>
    </div>

    <div class="fine-control">
      <input type="range"
             :value="direction"
             @input="$emit('update:direction', Number($event.target.value))"
             min="0"
             max="360"
             step="1"
             class="direction-slider">
      <div class="slider-labels">
        <span>0°</span>
        <span>180°</span>
        <span>360°</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  direction: {
    type: Number,
    default: 0
  }
})

defineEmits(['update:direction'])

const compassMarks = [
  { angle: 0, label: 'E' },
  { angle: 45, label: 'NE' },
  { angle: 90, label: 'N' },
  { angle: 135, label: 'NW' },
  { angle: 180, label: 'W' },
  { angle: 225, label: 'SW' },
  { angle: 270, label: 'S' },
  { angle: 315, label: 'SE' }
]

const quickOptions = [
  { value: 0, label: '向东 (0°)', icon: 'M5 12h14M12 5l7 7-7 7' },
  { value: 90, label: '向北 (90°)', icon: 'M12 19V5M5 12l7-7 7 7' },
  { value: 180, label: '向西 (180°)', icon: 'M19 12H5M12 19l-7-7 7-7' },
  { value: 270, label: '向南 (270°)', icon: 'M12 5v14M19 12l-7 7-7-7' }
]

const isDirectionActive = (angle) => {
  const diff = Math.abs(props.direction - angle)
  return diff <= 10 || diff >= 350
}
</script>

<style scoped>
.direction-control {
  background: var(--bg-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.value-display {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  font-family: 'Consolas', monospace;
}

/* Compass */
.compass-container {
  display: flex;
  justify-content: center;
  margin: var(--spacing-lg) 0;
}

.compass-ring {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  position: relative;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.05);
}

.compass-marks {
  position: absolute;
  inset: 0;
}

.mark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
}

.mark-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--text-tertiary);
}

.mark.active .mark-label {
  color: var(--color-primary);
}

.compass-arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  margin-left: -30px;
  margin-top: -30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.compass-arrow svg {
  width: 100%;
  height: 100%;
  color: var(--color-primary);
}

.compass-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin-left: -40px;
  margin-top: -40px;
  border-radius: 50%;
  border: 1px dashed var(--border-color);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.direction-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  margin-top: -1px;
}

/* Quick Select */
.quick-select {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.quick-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.quick-btn:hover {
  border-color: var(--color-primary);
  background: var(--bg-secondary);
  color: var(--color-primary);
}

.quick-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.quick-btn svg {
  width: 18px;
  height: 18px;
}

/* Fine Control */
.fine-control {
  margin-top: var(--spacing-md);
}

.direction-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--bg-secondary);
  outline: none;
  -webkit-appearance: none;
}

.direction-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.1s ease;
}

.direction-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.direction-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-xs);
}

.slider-labels span {
  font-size: 11px;
  color: var(--text-tertiary);
}
</style>
