<template>
  <div class="sci-figure">
    <div class="figure-caption-top">
      <strong>Fig. 3</strong> | {{ aa('fig3Caption1') }}
      {{ aa('fig3Caption2') }}
    </div>
    <div class="ust-container">
      <svg viewBox="0 0 400 320" class="sci-svg-ust">
        <defs>
          <linearGradient id="ustMcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a5276;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#1a5276;stop-opacity:0.05" />
          </linearGradient>
          <linearGradient id="ustCurveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#7b241c;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#7b241c;stop-opacity:0.05" />
          </linearGradient>
          <linearGradient id="ustTsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#145a32;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#145a32;stop-opacity:0.05" />
          </linearGradient>
        </defs>

        <line x1="60" y1="280" x2="360" y2="280" stroke="#2c3e50" stroke-width="2"/>
        <line x1="60" y1="280" x2="60" y2="40" stroke="#2c3e50" stroke-width="2"/>
        <polygon points="365,280 355,275 355,285" fill="#2c3e50"/>
        <polygon points="60,35 55,45 65,45" fill="#2c3e50"/>

        <text x="320" y="305" font-size="14" fill="#2c3e50" font-family="Arial" font-weight="bold">sigma1 / sigma3</text>
        <text x="30" y="50" font-size="14" fill="#2c3e50" font-family="Arial" font-weight="bold">tau / sigma3</text>

        <line x1="110" y1="275" x2="110" y2="285" stroke="#2c3e50" stroke-width="1"/>
        <line x1="160" y1="275" x2="160" y2="285" stroke="#2c3e50" stroke-width="1"/>
        <line x1="210" y1="275" x2="210" y2="285" stroke="#2c3e50" stroke-width="1"/>
        <line x1="260" y1="275" x2="260" y2="285" stroke="#2c3e50" stroke-width="1"/>
        <line x1="310" y1="275" x2="310" y2="285" stroke="#2c3e50" stroke-width="1"/>

        <text x="110" y="300" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial">1</text>
        <text x="210" y="300" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial">2</text>
        <text x="310" y="300" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial">3</text>

        <line x1="55" y1="230" x2="65" y2="230" stroke="#2c3e50" stroke-width="1"/>
        <line x1="55" y1="180" x2="65" y2="180" stroke="#2c3e50" stroke-width="1"/>
        <line x1="55" y1="130" x2="65" y2="130" stroke="#2c3e50" stroke-width="1"/>
        <line x1="55" y1="80" x2="65" y2="80" stroke="#2c3e50" stroke-width="1"/>

        <text x="50" y="235" text-anchor="end" font-size="10" fill="#5d6d7e" font-family="Arial">2</text>
        <text x="50" y="135" text-anchor="end" font-size="10" fill="#5d6d7e" font-family="Arial">4</text>

        <path d="M 60 130 L 210 280" fill="url(#ustMcGrad)" opacity="0.3"/>
        <line x1="60" y1="130" x2="210" y2="280" stroke="#1a5276" stroke-width="2.5" stroke-dasharray="8,4"/>

        <path d="M 60 180 Q 135 205 210 280" fill="none" stroke="#7b241c" stroke-width="3"/>
        <circle cx="60" cy="180" r="4" fill="#7b241c"/>
        <circle cx="210" cy="280" r="4" fill="#7b241c"/>

        <path d="M 60 230 Q 100 235 135 200 Q 170 165 210 280" fill="none" stroke="#145a32" stroke-width="2.5" stroke-dasharray="4,4"/>

        <g transform="translate(220, 60)">
          <rect x="0" y="0" width="130" height="90" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1" rx="4"/>
          <line x1="15" y1="20" x2="45" y2="20" stroke="#1a5276" stroke-width="2.5" stroke-dasharray="8,4"/>
          <text x="55" y="25" font-size="11" fill="#2c3e50" font-family="Arial">b=0 (M-C)</text>
          <line x1="15" y1="45" x2="45" y2="45" stroke="#7b241c" stroke-width="3"/>
          <circle cx="15" cy="45" r="3" fill="#7b241c"/>
          <circle cx="45" cy="45" r="3" fill="#7b241c"/>
          <text x="55" y="50" font-size="11" fill="#2c3e50" font-family="Arial">b=0.5 (UST)</text>
          <line x1="15" y1="70" x2="45" y2="70" stroke="#145a32" stroke-width="2.5" stroke-dasharray="4,4"/>
          <text x="55" y="75" font-size="11" fill="#2c3e50" font-family="Arial">b=1 (Twin-Shear)</text>
        </g>

        <text x="150" y="120" font-size="12" fill="#7b241c" font-family="Arial" font-weight="bold">
          {{ aa('fig3UnifiedLabel') }}
        </text>
        <text x="150" y="135" font-size="10" fill="#5d6d7e" font-family="Arial">0 &lt;= b &lt;= 1</text>
      </svg>
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

.ust-container {
  display: flex;
  justify-content: center;
}

.sci-svg-ust {
  display: block;
  width: 100%;
  max-width: 450px;
  height: auto;
}
</style>
