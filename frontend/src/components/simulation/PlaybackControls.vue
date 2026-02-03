<template>
  <div class="playback-controls">
    <!-- Playback Buttons -->
    <div class="playback-buttons">
      <button class="ctrl-btn" @click="skipToStart" title="回到起点">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5-6V12z"/></svg>
      </button>
      <button class="ctrl-btn" @click="stepBackward" title="后退一步">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5-6V12z"/></svg>
      </button>
      <button class="ctrl-btn play-btn" :class="{ playing }" @click="togglePlay" :title="playing ? '暂停' : '播放'">
        <svg v-if="!playing" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
      <button class="ctrl-btn" @click="stepForward" title="前进一步">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
      </button>
      <button class="ctrl-btn" @click="skipToEnd" title="跳到终点">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
      </button>
    </div>

    <!-- Progress Bar -->
    <div class="progress-section">
      <div class="progress-info">
        <span class="progress-label">开采推进度</span>
        <span class="progress-value">{{ Math.round(progress) }}%</span>
      </div>
      <div class="progress-bar-container">
        <input type="range"
               :value="progress"
               @input="$emit('update:progress', Number($event.target.value))"
               @mousedown="isDragging = true"
               @mouseup="isDragging = false"
               @touchstart="isDragging = true"
               @touchend="isDragging = false"
               min="0"
               max="100"
               step="0.1"
               class="progress-slider">
        <div class="progress-bar-fill" :style="{ width: `${progress}%` }">
          <div class="progress-bar-thumb"></div>
        </div>
      </div>
      <div class="distance-info">
        <span>已推进: {{ currentDistance.toFixed(0) }}m</span>
        <span>剩余: {{ remainingDistance.toFixed(0) }}m</span>
      </div>
    </div>

    <!-- Speed Control -->
    <div class="speed-section">
      <span class="speed-label">播放速度</span>
      <div class="speed-buttons">
        <button v-for="speed in speedOptions"
                :key="speed.value"
                :class="['speed-btn', { active: playbackSpeed === speed.value }]"
                @click="$emit('update:playbackSpeed', speed.value)">
          {{ speed.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  playing: {
    type: Boolean,
    default: false
  },
  playbackSpeed: {
    type: Number,
    default: 1
  },
  totalDistance: {
    type: Number,
    default: 500
  }
})

const emit = defineEmits([
  'update:progress',
  'togglePlay',
  'update:playbackSpeed',
  'stepForward',
  'stepBackward',
  'skipToStart',
  'skipToEnd'
])

const isDragging = ref(false)

const speedOptions = [
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 2, label: '2x' },
  { value: 5, label: '5x' }
]

const currentDistance = computed(() => (props.progress / 100) * props.totalDistance)
const remainingDistance = computed(() => props.totalDistance - currentDistance.value)

const togglePlay = () => emit('togglePlay')
const skipToStart = () => emit('skipToStart')
const skipToEnd = () => emit('skipToEnd')
const stepForward = () => emit('stepForward')
const stepBackward = () => emit('stepBackward')
</script>

<style scoped>
.playback-controls {
  background: var(--bg-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

/* Playback Buttons */
.playback-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.ctrl-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.ctrl-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--color-secondary);
}

.ctrl-btn svg {
  width: 18px;
  height: 18px;
}

.play-btn {
  width: 48px;
  height: 48px;
  background: var(--gradient-primary);
  border: none;
  color: white;
}

.play-btn:hover {
  background: var(--gradient-primary);
  border: none;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(90, 99, 120, 0.3);
}

.play-btn svg {
  width: 22px;
  height: 22px;
}

/* Progress Section */
.progress-section {
  margin-bottom: var(--spacing-md);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.progress-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.progress-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  font-family: 'Consolas', monospace;
}

.progress-bar-container {
  position: relative;
  height: 8px;
  margin-bottom: var(--spacing-sm);
}

.progress-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: var(--bg-secondary);
  outline: none;
  -webkit-appearance: none;
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.progress-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 4px;
  pointer-events: none;
  transition: width 0.05s linear;
}

.progress-bar-thumb {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  pointer-events: none;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: grab;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  margin-top: -4px;
}

.progress-slider::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.1);
}

.progress-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: grab;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

.distance-info {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-tertiary);
}

/* Speed Section */
.speed-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.speed-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.speed-buttons {
  display: flex;
  gap: var(--spacing-xs);
}

.speed-btn {
  padding: 6px 12px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.speed-btn:hover {
  border-color: var(--color-secondary);
  color: var(--color-primary);
}

.speed-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}
</style>
