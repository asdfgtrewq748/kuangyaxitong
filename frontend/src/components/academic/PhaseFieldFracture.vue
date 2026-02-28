<template>
  <div class="sci-figure">
    <div class="figure-caption-top">
      <strong>Fig. 1</strong> | {{ aa('fig1Caption1') }}
      {{ aa('fig1Caption2') }}
    </div>

    <div class="phase-field-container">
      <div class="pf-subfigure">
        <div class="pf-label">{{ aa('fig1OrderParameter') }}</div>
        <svg viewBox="0 0 280 120" class="sci-svg">
          <defs>
            <linearGradient id="phiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#1a5276" />
              <stop offset="50%" style="stop-color:#7fb3d5" />
              <stop offset="100%" style="stop-color:#c0392b" />
            </linearGradient>
          </defs>

          <rect x="40" y="30" width="200" height="40" fill="url(#phiGradient)" stroke="#2c3e50" stroke-width="1" />
          <line x1="40" y1="75" x2="40" y2="80" stroke="#2c3e50" stroke-width="1.5" />
          <line x1="140" y1="75" x2="140" y2="80" stroke="#2c3e50" stroke-width="1.5" />
          <line x1="240" y1="75" x2="240" y2="80" stroke="#2c3e50" stroke-width="1.5" />

          <text x="40" y="95" text-anchor="middle" font-size="11" fill="#2c3e50" font-family="Arial">0.0</text>
          <text x="140" y="95" text-anchor="middle" font-size="11" fill="#2c3e50" font-family="Arial">0.5</text>
          <text x="240" y="95" text-anchor="middle" font-size="11" fill="#2c3e50" font-family="Arial">1.0</text>
          <text x="140" y="15" text-anchor="middle" font-size="12" fill="#2c3e50" font-family="Arial" font-weight="bold">
            {{ aa('fig1IntactToFractured') }}
          </text>
        </svg>
      </div>

      <div class="pf-subfigure">
        <div class="pf-label">{{ aa('fig1CrackSequence') }}</div>
        <div class="crack-sequence">
          <div class="sequence-frame" v-for="t in 4" :key="t">
            <svg viewBox="0 0 80 80" class="sci-svg-small">
              <defs>
                <pattern :id="`grid-${t}`" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ecf0f1" stroke-width="0.5" />
                </pattern>
              </defs>

              <rect width="80" height="80" :fill="`url(#grid-${t})`" stroke="#bdc3c7" stroke-width="1" />
              <path v-if="t >= 1" d="M 10 40 Q 25 38 30 40" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round" />
              <path v-if="t >= 2" d="M 30 40 Q 45 42 50 38" fill="none" stroke="#c0392b" stroke-width="2.5" stroke-linecap="round" />
              <path v-if="t >= 3" d="M 50 38 Q 60 35 65 40" fill="none" stroke="#c0392b" stroke-width="3" stroke-linecap="round" />
              <path v-if="t >= 4" d="M 65 40 Q 72 45 75 40" fill="none" stroke="#c0392b" stroke-width="3.5" stroke-linecap="round" />

              <ellipse v-if="t >= 1" cx="30" cy="40" rx="6" ry="4" fill="#e74c3c" opacity="0.3" />
              <ellipse v-if="t >= 2" cx="50" cy="38" rx="8" ry="5" fill="#e74c3c" opacity="0.3" />
              <ellipse v-if="t >= 3" cx="65" cy="40" rx="7" ry="4" fill="#e74c3c" opacity="0.3" />
              <ellipse v-if="t >= 4" cx="75" cy="40" rx="5" ry="3" fill="#e74c3c" opacity="0.3" />
            </svg>
            <span class="time-label">t<sub>{{ t - 1 }}</sub></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  aa: {
    type: Function,
    required: true
  }
})
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

.phase-field-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.pf-subfigure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
}

.pf-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  font-family: Arial, sans-serif;
}

.crack-sequence {
  display: flex;
  gap: var(--spacing-4);
  justify-content: center;
}

.sequence-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-1);
}

.time-label {
  font-size: 11px;
  color: #6b7280;
  font-family: "Times New Roman", serif;
  font-style: italic;
}

.sci-svg {
  display: block;
  max-width: 100%;
  height: auto;
}

.sci-svg-small {
  width: 70px;
  height: 70px;
}
</style>
