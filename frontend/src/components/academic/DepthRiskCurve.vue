<template>
  <div class="sci-figure">
    <div class="figure-caption-top">
      <strong>Fig. 5</strong> | {{ aa('fig5Caption1') }}
      {{ aa('fig5Caption2') }}
    </div>
    <svg viewBox="0 0 420 260" class="sci-svg-depth">
      <defs>
        <linearGradient id="fig5RiskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#27ae60;stop-opacity:0.2"/>
          <stop offset="33%" style="stop-color:#27ae60;stop-opacity:0.2"/>
          <stop offset="33%" style="stop-color:#f39c12;stop-opacity:0.2"/>
          <stop offset="66%" style="stop-color:#f39c12;stop-opacity:0.2"/>
          <stop offset="66%" style="stop-color:#e74c3c;stop-opacity:0.2"/>
          <stop offset="100%" style="stop-color:#e74c3c;stop-opacity:0.2"/>
        </linearGradient>
        <clipPath id="fig5ChartArea">
          <rect x="60" y="40" width="320" height="160"/>
        </clipPath>
      </defs>

      <rect x="60" y="40" width="107" height="160" fill="#27ae60" opacity="0.1"/>
      <rect x="167" y="40" width="106" height="160" fill="#f39c12" opacity="0.1"/>
      <rect x="273" y="40" width="107" height="160" fill="#e74c3c" opacity="0.1"/>

      <line x1="60" y1="200" x2="380" y2="200" stroke="#2c3e50" stroke-width="2"/>
      <line x1="60" y1="200" x2="60" y2="40" stroke="#2c3e50" stroke-width="2"/>
      <polygon points="385,200 375,195 375,205" fill="#2c3e50"/>
      <polygon points="60,35 55,45 65,45" fill="#2c3e50"/>

      <text x="320" y="230" font-size="13" fill="#2c3e50" font-family="Arial" font-weight="bold">{{ aa('fig5BurialDepthAxis') }}</text>
      <text x="25" y="50" font-size="13" fill="#2c3e50" font-family="Arial" font-weight="bold">BRI</text>

      <line x1="55" y1="40" x2="65" y2="40" stroke="#2c3e50" stroke-width="1"/>
      <line x1="55" y1="80" x2="65" y2="80" stroke="#2c3e50" stroke-width="1"/>
      <line x1="55" y1="120" x2="65" y2="120" stroke="#2c3e50" stroke-width="1"/>
      <line x1="55" y1="160" x2="65" y2="160" stroke="#2c3e50" stroke-width="1"/>
      <text x="50" y="45" text-anchor="end" font-size="10" fill="#5d6d7e" font-family="Arial">100</text>
      <text x="50" y="85" text-anchor="end" font-size="10" fill="#5d6d7e" font-family="Arial">75</text>
      <text x="50" y="125" text-anchor="end" font-size="10" fill="#5d6d7e" font-family="Arial">50</text>
      <text x="50" y="165" text-anchor="end" font-size="10" fill="#5d6d7e" font-family="Arial">25</text>

      <line x1="60" y1="200" x2="60" y2="205" stroke="#2c3e50" stroke-width="1"/>
      <line x1="167" y1="200" x2="167" y2="205" stroke="#2c3e50" stroke-width="1.5"/>
      <line x1="273" y1="200" x2="273" y2="205" stroke="#2c3e50" stroke-width="1"/>
      <line x1="380" y1="200" x2="380" y2="205" stroke="#2c3e50" stroke-width="1"/>
      <text x="60" y="220" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial">0</text>
      <text x="167" y="220" text-anchor="middle" font-size="11" fill="#c0392b" font-family="Arial" font-weight="bold">400</text>
      <text x="273" y="220" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial">800</text>
      <text x="380" y="220" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial">1200</text>

      <line x1="167" y1="40" x2="167" y2="200" stroke="#c0392b" stroke-width="2" stroke-dasharray="6,3"/>
      <text x="162" y="35" font-size="10" fill="#c0392b" font-family="Arial" font-weight="bold">Hcrit</text>

      <text x="110" y="55" text-anchor="middle" font-size="11" fill="#27ae60" font-family="Arial" font-weight="bold">{{ aa('risk.low') }}</text>
      <text x="220" y="55" text-anchor="middle" font-size="11" fill="#d68910" font-family="Arial" font-weight="bold">{{ aa('risk.medium') }}</text>
      <text x="325" y="55" text-anchor="middle" font-size="11" fill="#c0392b" font-family="Arial" font-weight="bold">{{ aa('risk.high') }}</text>

      <path d="M 60 40 Q 120 42 167 60 Q 220 100 273 150 Q 330 190 380 195" fill="none" stroke="#1a5276" stroke-width="3"/>
      <circle cx="167" cy="60" r="5" fill="#c0392b" stroke="white" stroke-width="2"/>
      <circle cx="273" cy="150" r="4" fill="#1a5276" stroke="white" stroke-width="1.5"/>

      <g transform="translate(240, 80)">
        <rect x="0" y="0" width="130" height="45" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1" rx="3"/>
        <text x="65" y="18" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial" font-style="italic">BRI(H) = max(100 -</text>
        <text x="65" y="35" text-anchor="middle" font-size="10" fill="#5d6d7e" font-family="Arial" font-style="italic">Pdepth, 0)</text>
      </g>

      <g transform="translate(60, 240)">
        <line x1="0" y1="5" x2="25" y2="5" stroke="#1a5276" stroke-width="3"/>
        <text x="32" y="10" font-size="10" fill="#2c3e50" font-family="Arial">{{ aa('fig5LegendCurve') }}</text>
        <line x1="100" y1="5" x2="120" y2="5" stroke="#c0392b" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="127" y="10" font-size="10" fill="#2c3e50" font-family="Arial">{{ aa('fig5LegendCriticalDepth') }}</text>
      </g>
    </svg>
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

.sci-svg-depth {
  display: block;
  width: 100%;
  max-width: 420px;
  height: auto;
}
</style>
