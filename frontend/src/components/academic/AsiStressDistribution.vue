<template>
  <div class="sci-figure asi-stress-figure">
    <div class="figure-caption-top">
      <strong>Fig. 6</strong> | {{ aa('fig6Caption1') }}
      {{ aa('fig6Caption2') }}
      {{ aa('fig6Caption3') }}
      {{ aa('fig6Caption4') }}
    </div>

    <div class="asi-viz-wrapper">
      <div class="asi-viz-panel">
        <div class="panel-title">{{ aa('fig6PanelA') }}</div>
        <svg viewBox="0 0 300 320" class="sci-svg-asi">
          <defs>
            <linearGradient id="asiFig6StressLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#3498db;stop-opacity:0.8"/>
              <stop offset="100%" style="stop-color:#3498db;stop-opacity:0.2"/>
            </linearGradient>
            <radialGradient id="asiFig6StressConc" cx="50%" cy="50%">
              <stop offset="0%" style="stop-color:#e74c3c;stop-opacity:0.6"/>
              <stop offset="100%" style="stop-color:#e74c3c;stop-opacity:0"/>
            </radialGradient>
            <marker id="asiArrGray" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#7f8c8d"/>
            </marker>
            <marker id="asiArrRed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#c0392b"/>
            </marker>
            <marker id="asiArrGreen" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="#27ae60"/>
            </marker>
            <marker id="asiArrBlack" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="#2c3e50"/>
            </marker>
          </defs>

          <g opacity="0.3">
            <line x1="0" y1="30" x2="300" y2="30" stroke="#95a5a6" stroke-width="1" stroke-dasharray="5,5"/>
            <line x1="0" y1="60" x2="300" y2="60" stroke="#95a5a6" stroke-width="1" stroke-dasharray="5,5"/>
            <line x1="0" y1="260" x2="300" y2="260" stroke="#95a5a6" stroke-width="1" stroke-dasharray="5,5"/>
            <line x1="0" y1="290" x2="300" y2="290" stroke="#95a5a6" stroke-width="1" stroke-dasharray="5,5"/>
          </g>

          <ellipse cx="150" cy="160" rx="80" ry="70" fill="url(#asiFig6StressConc)" opacity="0.4"/>
          <ellipse cx="150" cy="160" rx="55" ry="50" fill="none" stroke="#27ae60" stroke-width="2" stroke-dasharray="6,3"/>
          <text x="195" y="130" font-size="10" fill="#27ae60" font-family="Arial" font-weight="bold">Rp</text>

          <g opacity="0.4">
            <line x1="40" y1="30" x2="40" y2="50" stroke="#7f8c8d" stroke-width="1.5" marker-end="url(#asiArrGray)"/>
            <line x1="260" y1="30" x2="260" y2="50" stroke="#7f8c8d" stroke-width="1.5" marker-end="url(#asiArrGray)"/>
            <line x1="40" y1="290" x2="40" y2="270" stroke="#7f8c8d" stroke-width="1.5" marker-end="url(#asiArrGray)"/>
            <line x1="260" y1="290" x2="260" y2="270" stroke="#7f8c8d" stroke-width="1.5" marker-end="url(#asiArrGray)"/>
          </g>

          <path d="M 80 30 Q 120 80 140 140" fill="none" stroke="#2980b9" stroke-width="1.5" opacity="0.7"/>
          <path d="M 220 30 Q 180 80 160 140" fill="none" stroke="#2980b9" stroke-width="1.5" opacity="0.7"/>
          <path d="M 80 290 Q 120 240 140 180" fill="none" stroke="#2980b9" stroke-width="1.5" opacity="0.7"/>
          <path d="M 220 290 Q 180 240 160 180" fill="none" stroke="#2980b9" stroke-width="1.5" opacity="0.7"/>

          <ellipse cx="150" cy="160" rx="35" ry="32" fill="#2c3e50" stroke="#1a252f" stroke-width="2"/>
          <text x="150" y="165" text-anchor="middle" font-size="9" fill="#ecf0f1" font-family="Arial">{{ aa('fig6Tunnel') }}</text>

          <path d="M 110 100 Q 130 120 145 135" fill="none" stroke="#c0392b" stroke-width="2" marker-end="url(#asiArrRed)"/>
          <path d="M 190 100 Q 170 120 155 135" fill="none" stroke="#c0392b" stroke-width="2" marker-end="url(#asiArrRed)"/>
          <path d="M 110 220 Q 130 200 145 185" fill="none" stroke="#c0392b" stroke-width="2" marker-end="url(#asiArrRed)"/>
          <path d="M 190 220 Q 170 200 155 185" fill="none" stroke="#c0392b" stroke-width="2" marker-end="url(#asiArrRed)"/>

          <line x1="135" y1="145" x2="125" y2="135" stroke="#27ae60" stroke-width="1.5" marker-end="url(#asiArrGreen)"/>
          <line x1="165" y1="145" x2="175" y2="135" stroke="#27ae60" stroke-width="1.5" marker-end="url(#asiArrGreen)"/>

          <g transform="translate(10, 10)">
            <rect x="0" y="0" width="100" height="45" fill="white" stroke="#bdc3c7" stroke-width="1" rx="3" opacity="0.9"/>
            <line x1="8" y1="15" x2="25" y2="15" stroke="#c0392b" stroke-width="2"/>
            <text x="30" y="19" font-size="9" fill="#2c3e50" font-family="Arial">{{ aa('fig6SigmaTConcentration') }}</text>
            <line x1="8" y1="32" x2="25" y2="32" stroke="#2980b9" stroke-width="1.5"/>
            <text x="30" y="36" font-size="9" fill="#2c3e50" font-family="Arial">{{ aa('fig6StressTrajectory') }}</text>
          </g>

          <line x1="20" y1="160" x2="50" y2="160" stroke="#2c3e50" stroke-width="1.5" marker-end="url(#asiArrBlack)"/>
          <text x="25" y="155" font-size="9" fill="#2c3e50" font-family="Arial">sigma_r</text>
          <line x1="150" y1="300" x2="150" y2="270" stroke="#2c3e50" stroke-width="1.5" marker-end="url(#asiArrBlack)"/>
          <text x="160" y="285" font-size="9" fill="#2c3e50" font-family="Arial">sigma_theta</text>
        </svg>

        <div class="principle-text">
          <p><strong>{{ aa('asiExcavationEffectTitle') }}</strong>{{ aa('asiExcavationEffectDesc') }}</p>
        </div>
      </div>

      <div class="asi-viz-panel">
        <div class="panel-title">{{ aa('fig6PanelB') }}</div>
        <svg viewBox="0 0 280 280" class="sci-svg-asi">
          <line x1="50" y1="240" x2="260" y2="240" stroke="#2c3e50" stroke-width="2"/>
          <line x1="50" y1="240" x2="50" y2="30" stroke="#2c3e50" stroke-width="2"/>
          <polygon points="265,240 255,235 255,245" fill="#2c3e50"/>
          <polygon points="50,25 45,35 55,35" fill="#2c3e50"/>

          <text x="240" y="258" font-size="11" fill="#2c3e50" font-family="Arial" font-weight="bold">r/a</text>
          <text x="30" y="35" font-size="11" fill="#2c3e50" font-family="Arial" font-weight="bold">sigma/sigma0</text>

          <line x1="100" y1="235" x2="100" y2="245" stroke="#2c3e50" stroke-width="1"/>
          <line x1="150" y1="235" x2="150" y2="245" stroke="#2c3e50" stroke-width="1"/>
          <line x1="200" y1="235" x2="200" y2="245" stroke="#2c3e50" stroke-width="1"/>
          <text x="100" y="256" text-anchor="middle" font-size="9" fill="#5d6d7e">1</text>
          <text x="150" y="256" text-anchor="middle" font-size="9" fill="#5d6d7e">2</text>
          <text x="200" y="256" text-anchor="middle" font-size="9" fill="#5d6d7e">3</text>

          <line x1="45" y1="190" x2="55" y2="190" stroke="#2c3e50" stroke-width="1"/>
          <line x1="45" y1="140" x2="55" y2="140" stroke="#2c3e50" stroke-width="1"/>
          <line x1="45" y1="90" x2="55" y2="90" stroke="#2c3e50" stroke-width="1"/>
          <text x="40" y="195" text-anchor="end" font-size="9" fill="#5d6d7e">1</text>
          <text x="40" y="145" text-anchor="end" font-size="9" fill="#5d6d7e">2</text>
          <text x="40" y="95" text-anchor="end" font-size="9" fill="#5d6d7e">3</text>

          <path d="M 50 90 L 100 170 Q 150 220 200 232 Q 250 238 260 240" fill="none" stroke="#2980b9" stroke-width="2.5"/>
          <text x="210" y="225" font-size="10" fill="#2980b9" font-weight="bold">sigma_r</text>

          <path d="M 50 240 L 100 60 Q 125 35 150 55 Q 200 100 250 160" fill="none" stroke="#c0392b" stroke-width="2.5"/>
          <text x="110" y="50" font-size="10" fill="#c0392b" font-weight="bold">sigma_theta</text>

          <line x1="50" y1="140" x2="260" y2="140" stroke="#e74c3c" stroke-width="1" stroke-dasharray="4,2" opacity="0.5"/>
          <text x="220" y="135" font-size="9" fill="#c0392b">2sigma0</text>

          <line x1="100" y1="30" x2="100" y2="240" stroke="#34495e" stroke-width="1.5" stroke-dasharray="5,3"/>
          <text x="95" y="25" font-size="8" fill="#34495e">r=a</text>

          <g transform="translate(150, 80)">
            <rect x="0" y="0" width="105" height="50" fill="white" stroke="#bdc3c7" stroke-width="1" rx="3" opacity="0.95"/>
            <line x1="8" y1="18" x2="28" y2="18" stroke="#2980b9" stroke-width="2.5"/>
            <text x="35" y="22" font-size="9" fill="#2c3e50">{{ aa('fig6RadialLegend') }}</text>
            <line x1="8" y1="35" x2="28" y2="35" stroke="#c0392b" stroke-width="2.5"/>
            <text x="35" y="39" font-size="9" fill="#2c3e50">{{ aa('fig6TangentialLegend') }}</text>
          </g>
        </svg>

        <div class="principle-text">
          <p><strong>{{ aa('asiKirschSolveTitle') }}</strong>{{ aa('asiKirschSolveDesc') }}</p>
        </div>
      </div>

      <div class="asi-viz-panel">
        <div class="panel-title">{{ aa('fig6PanelC') }}</div>
        <svg viewBox="0 0 320 280" class="sci-svg-asi">
          <line x1="50" y1="240" x2="300" y2="240" stroke="#2c3e50" stroke-width="2"/>
          <line x1="50" y1="240" x2="50" y2="30" stroke="#2c3e50" stroke-width="2"/>
          <polygon points="305,240 295,235 295,245" fill="#2c3e50"/>

          <text x="270" y="258" font-size="11" fill="#2c3e50" font-family="Arial" font-weight="bold">{{ aa('fig6DistanceAxis') }}</text>
          <text x="25" y="35" font-size="11" fill="#2c3e50" font-family="Arial" font-weight="bold">K</text>

          <rect x="50" y="40" width="60" height="200" fill="#95a5a6" opacity="0.2"/>
          <text x="80" y="55" text-anchor="middle" font-size="9" fill="#7f8c8d">{{ aa('fig6Mined') }}</text>

          <line x1="110" y1="40" x2="110" y2="240" stroke="#2c3e50" stroke-width="2"/>
          <text x="110" y="255" text-anchor="middle" font-size="10" fill="#2c3e50" font-weight="bold">{{ aa('fig6Face') }}</text>

          <line x1="170" y1="235" x2="170" y2="245" stroke="#2c3e50" stroke-width="1"/>
          <line x1="230" y1="235" x2="230" y2="245" stroke="#2c3e50" stroke-width="1"/>
          <line x1="290" y1="235" x2="290" y2="245" stroke="#2c3e50" stroke-width="1"/>
          <text x="170" y="256" text-anchor="middle" font-size="9" fill="#5d6d7e">5m</text>
          <text x="230" y="256" text-anchor="middle" font-size="9" fill="#5d6d7e">10m</text>
          <text x="290" y="256" text-anchor="middle" font-size="9" fill="#5d6d7e">15m</text>

          <line x1="45" y1="190" x2="55" y2="190" stroke="#2c3e50" stroke-width="1"/>
          <line x1="45" y1="140" x2="55" y2="140" stroke="#2c3e50" stroke-width="1"/>
          <line x1="45" y1="90" x2="55" y2="90" stroke="#2c3e50" stroke-width="1"/>
          <text x="40" y="195" text-anchor="end" font-size="9" fill="#5d6d7e">1</text>
          <text x="40" y="145" text-anchor="end" font-size="9" fill="#5d6d7e">2</text>
          <text x="40" y="95" text-anchor="end" font-size="9" fill="#5d6d7e">3</text>

          <line x1="50" y1="190" x2="300" y2="190" stroke="#7f8c8d" stroke-width="1.5" stroke-dasharray="5,3"/>
          <text x="270" y="185" font-size="9" fill="#7f8c8d">K=1</text>

          <path d="M 50 190 L 90 180 Q 110 120 130 60 Q 150 40 170 55 Q 230 130 300 185" fill="none" stroke="#c0392b" stroke-width="3"/>
          <circle cx="140" cy="50" r="5" fill="#c0392b" stroke="white" stroke-width="2"/>
          <text x="155" y="45" font-size="10" fill="#c0392b" font-weight="bold">Kmax>=2.5</text>
          <line x1="140" y1="50" x2="140" y2="240" stroke="#c0392b" stroke-width="1" stroke-dasharray="4,2" opacity="0.5"/>

          <rect x="110" y="40" width="120" height="200" fill="#f39c12" opacity="0.08"/>
          <line x1="230" y1="40" x2="230" y2="240" stroke="#f39c12" stroke-width="1" stroke-dasharray="5,3"/>
          <text x="235" y="55" font-size="9" fill="#d68910">{{ aa('fig6InfluenceZone') }}</text>

          <g transform="translate(165, 95)">
            <rect x="0" y="0" width="125" height="60" fill="white" stroke="#bdc3c7" stroke-width="1" rx="3" opacity="0.95"/>
            <line x1="8" y1="20" x2="33" y2="20" stroke="#c0392b" stroke-width="3"/>
            <text x="40" y="24" font-size="9" fill="#2c3e50">{{ aa('fig6AbutmentPressure') }}</text>
            <line x1="8" y1="40" x2="33" y2="40" stroke="#7f8c8d" stroke-width="1.5" stroke-dasharray="4,2"/>
            <text x="40" y="44" font-size="9" fill="#2c3e50">{{ aa('fig6InSituStress') }}</text>
          </g>
        </svg>

        <div class="principle-text">
          <p><strong>{{ aa('asiAbutmentTitle') }}</strong>{{ aa('asiAbutmentDesc') }}</p>
        </div>
      </div>
    </div>

    <div class="asi-calculation-principle">
      <div class="calc-step">
        <div class="step-num">1</div>
        <div class="step-content">
          <strong>{{ aa('asiStep1Title') }}</strong>{{ aa('asiStep1Desc') }}
        </div>
      </div>
      <div class="calc-arrow">-></div>
      <div class="calc-step">
        <div class="step-num">2</div>
        <div class="step-content">
          <strong>{{ aa('asiStep2Title') }}</strong>{{ aa('asiStep2Desc') }}
        </div>
      </div>
      <div class="calc-arrow">-></div>
      <div class="calc-step">
        <div class="step-num">3</div>
        <div class="step-content">
          <strong>{{ aa('asiStep3Title') }}</strong>{{ aa('asiStep3Desc') }}
        </div>
      </div>
      <div class="calc-arrow">-></div>
      <div class="calc-step">
        <div class="step-num">4</div>
        <div class="step-content">
          <strong>{{ aa('asiStep4Title') }}</strong>{{ aa('asiStep4Desc') }}
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

.asi-stress-figure {
  margin-top: 20px;
}

.asi-viz-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: var(--spacing-4) 0;
}

.asi-viz-panel {
  background: #f8f9fa;
  border-radius: 8px;
  padding: var(--spacing-3);
  border: 1px solid #e5e7eb;
}

.panel-title {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e7eb;
  font-family: Arial, sans-serif;
}

.sci-svg-asi {
  width: 100%;
  height: auto;
  display: block;
}

.principle-text {
  margin-top: 10px;
  padding: var(--spacing-3);
  background: white;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.principle-text p {
  margin: 0;
  font-size: 11px;
  line-height: 1.6;
  color: #4b5563;
}

.principle-text strong {
  color: #1f2937;
}

.asi-calculation-principle {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: var(--spacing-4);
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  border: 1px solid #bae6fd;
  overflow-x: auto;
}

.calc-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  width: 140px;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #0284c7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.step-content {
  font-size: 10px;
  line-height: 1.5;
  color: #374151;
  text-align: center;
}

.step-content strong {
  display: block;
  margin-bottom: 2px;
  color: #0c4a6e;
}

.calc-arrow {
  font-size: 20px;
  color: #0284c7;
  font-weight: bold;
  flex-shrink: 0;
}

@media (max-width: 1200px) {
  .asi-viz-wrapper {
    grid-template-columns: 1fr;
  }

  .asi-calculation-principle {
    flex-direction: column;
    gap: 12px;
  }

  .calc-arrow {
    transform: rotate(90deg);
  }
}
</style>
