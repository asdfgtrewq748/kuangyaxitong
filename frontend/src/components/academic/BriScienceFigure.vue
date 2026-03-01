<template>
  <figure class="nature-figure" role="img" :aria-label="aa('briFigureAria')">
    <figcaption class="nature-caption">
      <span class="fig-label">{{ aa('briFigureTag') }}</span> {{ aa('briFigureCaption') }}
    </figcaption>

    <div class="nature-grid">
      <!-- Panel A: Seismic Waveform Analysis -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">a</span>
          <span class="nature-title">{{ aa('briPanelA_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrowBriA" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0,6 2,0 4" fill="#2C3E50"/>
              </marker>
            </defs>

            <!-- Clean axes -->
            <line x1="40" y1="130" x2="310" y2="130" stroke="#2C3E50" stroke-width="0.8"/>
            <line x1="40" y1="130" x2="40" y2="20" stroke="#2C3E50" stroke-width="0.8"/>

            <!-- Axis arrows -->
            <polygon points="310,130 305,128 305,132" fill="#2C3E50"/>
            <polygon points="40,20 38,25 42,25" fill="#2C3E50"/>

            <!-- Subtle grid -->
            <line v-for="i in 3" :key="`h-${i}`" x1="40" :x2="305" :y1="130 - i * 27" :y2="130 - i * 27"
                  stroke="#ECF0F1" stroke-width="0.4"/>

            <!-- P-wave arrival line -->
            <line x1="90" y1="35" x2="90" y2="130" stroke="#27AE60" stroke-width="1"
                  stroke-dasharray="3,2" opacity="0.8"/>
            <text x="90" y="30" text-anchor="middle" font-size="7" fill="#27AE60"
                  font-family="Helvetica, Arial, sans-serif" font-weight="600">P</text>

            <!-- S-wave arrival line -->
            <line x1="145" y1="35" x2="145" y2="130" stroke="#E74C3C" stroke-width="1"
                  stroke-dasharray="3,2" opacity="0.8"/>
            <text x="145" y="30" text-anchor="middle" font-size="7" fill="#E74C3C"
                  font-family="Helvetica, Arial, sans-serif" font-weight="600">S</text>

            <!-- Waveform trace -->
            <path d="M 40 85 L 60 85 L 65 80 L 70 90 L 75 78 L 80 92 L 85 75 L 90 95 L 95 82 L 100 85
                     L 105 85 L 110 65 L 115 105 L 120 55 L 125 115 L 130 50 L 135 110 L 140 60 L 145 100
                     L 150 70 L 155 85 L 305 85"
                  fill="none" stroke="#2874A6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>

            <!-- Envelope -->
            <path d="M 105 85 Q 125 45, 145 85 Q 125 125, 105 85" fill="none" stroke="#E67E22"
                  stroke-width="0.8" stroke-dasharray="3,2" opacity="0.5"/>

            <!-- Axis labels -->
            <text x="175" y="145" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">时间 (s)</text>
            <text x="18" y="75" text-anchor="middle" transform="rotate(-90 18 75)" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">振幅</text>

            <!-- Minimal legend -->
            <rect x="225" y="25" width="75" height="35" fill="#FFF" stroke="#BDC3C7" stroke-width="0.5" rx="2" opacity="0.95"/>
            <line x1="232" y1="38" x2="245" y2="38" stroke="#2874A6" stroke-width="1.2"/>
            <text x="248" y="40" font-size="6" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">波形</text>
            <line x1="232" y1="50" x2="245" y2="50" stroke="#E67E22" stroke-width="0.8" stroke-dasharray="3,2"/>
            <text x="248" y="52" font-size="6" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">包络</text>
          </svg>
        </div>
      </article>

      <!-- Panel B: Moment Tensor Components -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">b</span>
          <span class="nature-title">{{ aa('briPanelB_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="sphereGradBri" cx="30%" cy="30%">
                <stop offset="0%" stop-color="#FDFEFE"/>
                <stop offset="100%" stop-color="#E5E8E8"/>
              </radialGradient>
            </defs>

            <!-- Three beachballs -->
            <g v-for="(item, idx) in beachballs" :key="idx" :transform="`translate(${30 + idx * 95}, 30)`">
              <!-- Shadow -->
              <ellipse cx="40" cy="42" rx="35" ry="35" fill="#BDC3C7" opacity="0.2"/>

              <!-- Sphere base -->
              <circle cx="38" cy="38" r="35" fill="url(#sphereGradBri)" stroke="#2C3E50" stroke-width="0.8"/>

              <!-- Grid lines -->
              <ellipse cx="38" cy="38" rx="35" ry="12" fill="none" stroke="#BDC3C7" stroke-width="0.3" opacity="0.5"/>
              <ellipse cx="38" cy="38" rx="17" ry="35" fill="none" stroke="#BDC3C7" stroke-width="0.3" opacity="0.5"/>

              <!-- ISO pattern -->
              <template v-if="item.type === 'ISO'">
                <circle cx="38" cy="38" r="22" fill="#8E44AD" opacity="0.75"/>
                <text x="38" y="85" text-anchor="middle" font-size="7" fill="#2C3E50"
                      font-family="Helvetica, Arial, sans-serif" font-weight="600">+</text>
              </template>

              <!-- DC pattern -->
              <template v-if="item.type === 'DC'">
                <path d="M 38 3 A 35 35 0 0 1 38 73 A 17.5 35 0 0 0 38 38 A 17.5 35 0 0 1 38 3"
                      fill="#A04000" opacity="0.8"/>
                <path d="M 38 3 A 35 35 0 0 0 38 73 A 17.5 35 0 0 1 38 38 A 17.5 35 0 0 0 38 3"
                      fill="#FDFEFE" opacity="0.9"/>
                <line x1="38" y1="3" x2="38" y2="73" stroke="#2C3E50" stroke-width="0.6"/>
                <line x1="3" y1="38" x2="73" y2="38" stroke="#2C3E50" stroke-width="0.6"/>
                <text x="45" y="22" font-size="6" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">T</text>
                <text x="31" y="55" font-size="6" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">P</text>
              </template>

              <!-- CLVD pattern -->
              <template v-if="item.type === 'CLVD'">
                <ellipse cx="38" cy="38" rx="15" ry="28" fill="#16A085" opacity="0.75"/>
                <ellipse cx="38" cy="38" rx="28" ry="10" fill="#FDFEFE" opacity="0.9"/>
              </template>

              <!-- Outer ring -->
              <circle cx="38" cy="38" r="35" fill="none" stroke="#2C3E50" stroke-width="0.8"/>

              <!-- Label -->
              <text x="38" y="88" text-anchor="middle" font-size="8" fill="#2C3E50"
                    font-family="Helvetica, Arial, sans-serif" font-weight="600">{{ item.type }}</text>
            </g>

            <!-- Decomposition bar -->
            <rect x="60" y="125" width="200" height="18" fill="#F8F9F9" stroke="#BDC3C7" stroke-width="0.5" rx="1"/>
            <rect x="62" y="127" width="40" height="14" fill="#8E44AD" opacity="0.85" rx="1"/>
            <rect x="104" y="127" width="100" height="14" fill="#A04000" opacity="0.85" rx="1"/>
            <rect x="206" y="127" width="20" height="14" fill="#16A085" opacity="0.85" rx="1"/>

            <text x="82" y="137" text-anchor="middle" font-size="7" fill="#FFF"
                  font-family="Helvetica, Arial, sans-serif" font-weight="600">20%</text>
            <text x="154" y="137" text-anchor="middle" font-size="7" fill="#FFF"
                  font-family="Helvetica, Arial, sans-serif" font-weight="600">70%</text>
            <text x="216" y="137" text-anchor="middle" font-size="7" fill="#FFF"
                  font-family="Helvetica, Arial, sans-serif" font-weight="600">10%</text>
          </svg>
        </div>
      </article>

      <!-- Panel C: Depth-Risk Relationship -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">c</span>
          <span class="nature-title">{{ aa('briPanelC_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="riskAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#E74C3C" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#E74C3C" stop-opacity="0.02"/>
              </linearGradient>
            </defs>

            <!-- Clean axes -->
            <line x1="50" y1="130" x2="310" y2="130" stroke="#2C3E50" stroke-width="0.8"/>
            <line x1="50" y1="130" x2="50" y2="20" stroke="#2C3E50" stroke-width="0.8"/>

            <!-- Axis arrows -->
            <polygon points="310,130 305,128 305,132" fill="#2C3E50"/>
            <polygon points="50,20 48,25 52,25" fill="#2C3E50"/>

            <!-- Subtle grid -->
            <line v-for="i in 3" :key="`h-${i}`" x1="50" :x2="305" :y1="130 - i * 27" :y2="130 - i * 27"
                  stroke="#ECF0F1" stroke-width="0.4"/>

            <!-- Risk area fill -->
            <path d="M 50 115 Q 100 110, 140 95 Q 180 80, 220 60 Q 260 45, 305 35 L 305 130 L 50 130 Z"
                  fill="url(#riskAreaGrad)"/>

            <!-- Risk curve -->
            <path d="M 50 115 Q 100 110, 140 95 Q 180 80, 220 60 Q 260 45, 305 35"
                  fill="none" stroke="#E74C3C" stroke-width="1.8" stroke-linecap="round"/>

            <!-- Hard layer annotation -->
            <rect x="125" y="38" width="35" height="12" fill="#5D6D7E" opacity="0.25" rx="1"/>
            <text x="142" y="46" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">硬岩层</text>
            <line x1="142" y1="50" x2="180" y2="65" stroke="#5D6D7E" stroke-width="0.5" stroke-dasharray="2,2"/>

            <!-- Coal seam annotation -->
            <rect x="70" y="92" width="30" height="10" fill="#A04000" opacity="0.3" rx="1"/>
            <text x="85" y="99" text-anchor="middle" font-size="5" fill="#A04000"
                  font-family="Helvetica, Arial, sans-serif">煤层</text>
            <line x1="100" y1="96" x2="120" y2="108" stroke="#A04000" stroke-width="0.5" stroke-dasharray="2,2"/>

            <!-- Axis labels -->
            <text x="180" y="148" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">深度 (m)</text>
            <text x="22" y="75" text-anchor="middle" transform="rotate(-90 22 75)" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">风险指标</text>

            <!-- Legend -->
            <rect x="210" y="28" width="90" height="22" fill="#FFF" stroke="#BDC3C7" stroke-width="0.5" rx="2" opacity="0.95"/>
            <line x1="218" y1="39" x2="232" y2="39" stroke="#E74C3C" stroke-width="1.5"/>
            <text x="236" y="41" font-size="6" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">BRI(depth)</text>
          </svg>
        </div>
      </article>

      <!-- Panel D: BRI Computation Flow -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">d</span>
          <span class="nature-title">{{ aa('briPanelD_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <!-- Waveform input -->
            <rect x="12" y="55" width="70" height="45" fill="#F4ECF7" stroke="#8E44AD" stroke-width="0.8" rx="3"/>
            <text x="47" y="72" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="500">波形输入</text>
            <text x="47" y="84" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">u(t)</text>
            <!-- Mini waveform -->
            <path d="M 20 90 L 25 90 L 27 86 L 29 94 L 31 88 L 33 92 L 35 86 L 37 94 L 39 90 L 72 90"
                  fill="none" stroke="#8E44AD" stroke-width="0.8"/>

            <!-- Arrow -->
            <line x1="87" y1="77" x2="107" y2="77" stroke="#2C3E50" stroke-width="0.8" marker-end="url(#arrowBriA)"/>

            <!-- Tensor inversion -->
            <rect x="112" y="52" width="85" height="50" fill="#FEF9E7" stroke="#D4AC0D" stroke-width="0.8" rx="3"/>
            <text x="154" y="70" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="500">张量分解</text>
            <text x="154" y="82" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">ISO+DC+CLVD</text>
            <text x="154" y="92" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">M = ΣMᵢ</text>

            <!-- Arrow -->
            <line x1="202" y1="77" x2="222" y2="77" stroke="#2C3E50" stroke-width="0.8" marker-end="url(#arrowBriA)"/>

            <!-- Depth correction -->
            <rect x="227" y="52" width="85" height="50" fill="#FEF9E7" stroke="#D4AC0D" stroke-width="0.8" rx="3"/>
            <text x="269" y="70" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="500">深度校正</text>
            <text x="269" y="82" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">β(d)</text>
            <text x="269" y="92" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">correction</text>

            <!-- Output -->
            <rect x="140" y="18" width="65" height="24" fill="#FDEDEC" stroke="#E74C3C" stroke-width="0.8" rx="12"/>
            <text x="172" y="33" text-anchor="middle" font-size="9" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="600">BRI</text>

            <!-- Arrow to output -->
            <line x1="269" y1="107" x2="269" y2="115" stroke="#2C3E50" stroke-width="0.8" marker-end="url(#arrowBriA)"/>
            <line x1="269" y1="119" x2="208" y2="119" stroke="#2C3E50" stroke-width="0.8" marker-end="url(#arrowBriA)"/>
            <line x1="172" y1="44" x2="172" y2="50" stroke="#2C3E50" stroke-width="0.8"/>
          </svg>
        </div>
      </article>
    </div>
  </figure>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  aa: {
    type: Function,
    required: true
  }
})

const beachballs = computed(() => [
  { type: 'ISO' },
  { type: 'DC' },
  { type: 'CLVD' }
])
</script>

<style scoped>
.nature-figure {
  background: #FFFFFF;
  border: 1px solid #E5E8E8;
  border-radius: 4px;
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.nature-caption {
  font-size: 11px;
  color: #34495E;
  line-height: 1.7;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ECF0F1;
  font-family: "Helvetica", "Arial", sans-serif;
}

.fig-label {
  color: #2C3E50;
  font-weight: 700;
  margin-right: 4px;
  font-size: 11px;
}

.nature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.nature-panel {
  background: #FFFFFF;
  border: none;
  padding: 0;
  position: relative;
}

.panel-annotation {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 8px;
}

.nature-label {
  font-family: "Helvetica", "Arial", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #2C3E50;
  line-height: 1;
}

.nature-title {
  margin: 0;
  font-family: "Helvetica", "Arial", sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: #5D6D7E;
  text-transform: capitalize;
  letter-spacing: 0.3px;
}

.panel-svg {
  background: #FAFAFA;
  border-radius: 2px;
  overflow: hidden;
}

.panel-svg svg {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 960px) {
  .nature-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .nature-figure {
    padding: 16px;
  }
}
</style>