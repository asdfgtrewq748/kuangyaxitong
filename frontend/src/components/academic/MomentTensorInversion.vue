<template>
  <div class="sci-figure">
    <div class="figure-caption-top">
      <strong>Fig. 2</strong> | {{ aa('fig2Caption1') }}
      {{ aa('fig2Caption2') }}
    </div>

    <div class="beachball-container">
      <div class="beachball-item" v-for="(item, idx) in beachballItems" :key="idx">
        <svg viewBox="0 0 140 140" class="sci-svg-beachball">
          <defs>
            <radialGradient id="sphereGrad" cx="30%" cy="30%">
              <stop offset="0%" style="stop-color:#f8f9fa" />
              <stop offset="100%" style="stop-color:#dee2e6" />
            </radialGradient>
          </defs>

          <circle cx="70" cy="70" r="65" fill="url(#sphereGrad)" stroke="#2c3e50" stroke-width="1.5" />
          <ellipse cx="70" cy="70" rx="65" ry="22" fill="none" stroke="#bdc3c7" stroke-width="0.8" opacity="0.5" />
          <ellipse cx="70" cy="70" rx="33" ry="65" fill="none" stroke="#bdc3c7" stroke-width="0.8" opacity="0.5" />

          <template v-if="item.type === 'ISO'">
            <circle cx="70" cy="70" r="45" fill="#1a5276" opacity="0.85" />
            <text x="70" y="110" text-anchor="middle" font-size="9" fill="#2c3e50" font-family="Arial">+</text>
          </template>

          <template v-else-if="item.type === 'DC'">
            <path d="M 70 5 A 65 65 0 0 1 70 135 A 32.5 65 0 0 0 70 70 A 32.5 65 0 0 1 70 5" fill="#7b241c" opacity="0.9" />
            <path d="M 70 5 A 65 65 0 0 0 70 135 A 32.5 65 0 0 1 70 70 A 32.5 65 0 0 0 70 5" fill="#f8f9fa" opacity="0.9" />
            <line x1="70" y1="5" x2="70" y2="135" stroke="#2c3e50" stroke-width="1" />
            <line x1="5" y1="70" x2="135" y2="70" stroke="#2c3e50" stroke-width="1" />
            <text x="85" y="35" font-size="9" fill="#2c3e50" font-family="Arial">T</text>
            <text x="55" y="115" font-size="9" fill="#2c3e50" font-family="Arial">P</text>
          </template>

          <template v-else>
            <ellipse cx="70" cy="70" rx="25" ry="55" fill="#145a32" opacity="0.85" />
            <ellipse cx="70" cy="70" rx="55" ry="15" fill="#f8f9fa" opacity="0.9" />
          </template>

          <circle cx="70" cy="70" r="65" fill="none" stroke="#2c3e50" stroke-width="2" />
        </svg>

        <div class="beachball-info">
          <div class="bb-type">{{ item.type }}</div>
          <div class="bb-name">{{ item.name }}</div>
          <div class="bb-desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  aa: {
    type: Function,
    required: true
  }
})

const beachballItems = computed(() => [
  { type: 'ISO', name: props.aa('beachballIsotropicName'), desc: props.aa('beachballIsotropicDesc') },
  { type: 'DC', name: props.aa('beachballDoubleCoupleName'), desc: props.aa('beachballDoubleCoupleDesc') },
  { type: 'CLVD', name: props.aa('beachballClvdName'), desc: props.aa('beachballClvdDesc') }
])
</script>

<style scoped>
.sci-figure {
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  padding: var(--spacing-5);
  margin: var(--spacing-5) 0;
}

.figure-caption-top {
  font-size: 12px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid #e5e7eb;
  font-family: "Times New Roman", Georgia, serif;
}

.figure-caption-top strong {
  color: #1f2937;
  font-weight: 600;
}

.beachball-container {
  display: flex;
  gap: var(--spacing-10);
  justify-content: center;
  flex-wrap: wrap;
}

.beachball-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
}

.beachball-info {
  text-align: center;
}

.bb-type {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  font-family: Arial, sans-serif;
  margin-bottom: var(--spacing-1);
}

.bb-name {
  font-size: 12px;
  color: #4b5563;
  font-family: Arial, sans-serif;
  margin-bottom: var(--spacing-1);
}

.bb-desc {
  font-size: 10px;
  color: #6b7280;
  font-family: Arial, sans-serif;
}

.sci-svg-beachball {
  display: block;
  max-width: 100%;
  width: 140px;
  height: 140px;
}
</style>
