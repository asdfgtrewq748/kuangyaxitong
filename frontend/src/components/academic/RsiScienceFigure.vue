<template>
  <PublicationFigureShell
    :figure-label="aa('rsiFigureTag')"
    :caption="aa('rsiFigureCaption')"
    :summary="shellSummary"
    :chips="shellChips"
    :note="shellNote"
    :aria-label="aa('rsiFigureAria')"
  >
    <div class="nature-grid">
      <!-- Panel A: Phase Field Order Parameter -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">a</span>
          <span class="nature-title">{{ aa('rsiPanelA_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <defs>
              <!-- Professional gradient for phase field -->
              <linearGradient id="phiGradNature" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#2874A6" />
                <stop offset="50%" stop-color="#85C1E9" />
                <stop offset="100%" stop-color="#E74C3C" />
              </linearGradient>
              <!-- Subtle shadow -->
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
                <feOffset dx="0.5" dy="0.5" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.2"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <marker id="arrowNature" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0,6 2,0 4" fill="#2C3E50"/>
              </marker>
            </defs>

            <!-- Background panel -->
            <rect x="20" y="35" width="300" height="45" fill="url(#phiGradNature)"
                  stroke="#2C3E50" stroke-width="0.8" rx="2" filter="url(#softShadow)"/>

            <!-- Crack position indicator -->
            <line x1="200" y1="85" x2="200" y2="125" stroke="#E74C3C" stroke-width="1.5"
                  stroke-dasharray="3,2" opacity="0.8"/>
            <circle cx="200" cy="105" r="3" fill="#E74C3C" opacity="0.9"/>

            <!-- Position label -->
            <text x="200" y="138" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">x</text>

            <!-- Left label -->
            <text x="25" y="28" font-size="9" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif">
              <tspan font-style="italic">φ</tspan> = 0
            </text>
            <text x="25" y="18" font-size="7" fill="#7F8C8D"
                  font-family="Helvetica, Arial, sans-serif">(完整)</text>

            <!-- Right label -->
            <text x="315" y="28" text-anchor="end" font-size="9" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif">
              <tspan font-style="italic">φ</tspan> = 1
            </text>
            <text x="315" y="18" text-anchor="end" font-size="7" fill="#7F8C8D"
                  font-family="Helvetica, Arial, sans-serif">(断裂)</text>

            <!-- Scale bar -->
            <line x1="30" y1="90" x2="30" y2="95" stroke="#2C3E50" stroke-width="0.8"/>
            <line x1="170" y1="90" x2="170" y2="95" stroke="#2C3E50" stroke-width="0.8"/>
            <line x1="310" y1="90" x2="310" y2="95" stroke="#2C3E50" stroke-width="0.8"/>

            <text x="30" y="102" text-anchor="middle" font-size="7" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">0.0</text>
            <text x="170" y="102" text-anchor="middle" font-size="7" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">0.5</text>
            <text x="310" y="102" text-anchor="middle" font-size="7" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">1.0</text>

            <!-- Evolution arrow -->
            <line x1="45" y1="125" x2="110" y2="125" stroke="#2C3E50" stroke-width="0.8"
                  marker-end="url(#arrowNature)" opacity="0.7"/>
            <text x="77" y="122" text-anchor="middle" font-size="7" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">损伤演化</text>
          </svg>
        </div>
      </article>

      <!-- Panel B: Crack Propagation Sequence -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">b</span>
          <span class="nature-title">{{ aa('rsiPanelB_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrowNature" markerWidth="6" markerHeight="4" refX="5" refY="2"
                      orient="auto">
                <polygon points="0 0,6 2,0 4" fill="#2C3E50"/>
              </marker>
              <pattern id="gridPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#ECF0F1" stroke-width="0.3"/>
              </pattern>
            </defs>

            <!-- Four time steps -->
            <g v-for="(step, idx) in 4" :key="idx"
               :transform="`translate(${25 + idx * 80}, 35)`">
              <!-- Background -->
              <rect width="60" height="60" fill="url(#gridPattern)"
                    stroke="#BDC3C7" stroke-width="0.5" rx="1"/>

              <!-- Crack progression -->
              <path v-if="idx >= 0" d="M 5 30 Q 12 28 16 30" fill="none"
                    stroke="#C0392B" stroke-width="1.2" stroke-linecap="round"/>
              <path v-if="idx >= 1" d="M 16 30 Q 26 32 32 28" fill="none"
                    stroke="#C0392B" stroke-width="1.5" stroke-linecap="round"/>
              <path v-if="idx >= 2" d="M 32 28 Q 40 26 46 30" fill="none"
                    stroke="#C0392B" stroke-width="1.8" stroke-linecap="round"/>
              <path v-if="idx >= 3" d="M 46 30 Q 52 33 56 30" fill="none"
                    stroke="#C0392B" stroke-width="2" stroke-linecap="round"/>

              <!-- Damage zones -->
              <ellipse v-if="idx >= 0" cx="16" cy="30" rx="4" ry="2.5"
                       fill="#E74C3C" opacity="0.25"/>
              <ellipse v-if="idx >= 1" cx="32" cy="28" rx="5" ry="3"
                       fill="#E74C3C" opacity="0.3"/>
              <ellipse v-if="idx >= 2" cx="46" cy="30" rx="4" ry="2.5"
                       fill="#E74C3C" opacity="0.25"/>
              <ellipse v-if="idx >= 3" cx="56" cy="30" rx="3" ry="2"
                       fill="#E74C3C" opacity="0.2"/>

              <!-- Time label -->
              <text x="30" y="78" text-anchor="middle" font-size="8" fill="#5D6D7E"
                    font-family="Helvetica, Arial, sans-serif" font-style="italic">
                t<tspan font-size="6" baseline-shift="sub">{{ idx }}</tspan>
              </text>

              <!-- Arrow between panels -->
              <line v-if="idx < 3" x1="65" y1="30" x2="75" y2="30"
                    stroke="#BDC3C7" stroke-width="0.6" marker-end="url(#arrowNature)"/>
            </g>
          </svg>
        </div>
      </article>

      <!-- Panel C: Griffith Energy Balance -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">c</span>
          <span class="nature-title">{{ aa('rsiPanelC_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <defs>
              <!-- Smooth curve gradient -->
              <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#2874A6" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#2E86AB" stop-opacity="0.7"/>
              </linearGradient>
            </defs>

            <!-- Clean axes -->
            <line x1="45" y1="130" x2="310" y2="130" stroke="#2C3E50" stroke-width="0.8"/>
            <line x1="45" y1="130" x2="45" y2="25" stroke="#2C3E50" stroke-width="0.8"/>

            <!-- Axis arrows -->
            <polygon points="310,130 305,128 305,132" fill="#2C3E50"/>
            <polygon points="45,25 43,30 47,30" fill="#2C3E50"/>

            <!-- Subtle grid -->
            <line v-for="i in 4" :key="`h-${i}`" x1="45" :x2="305"
                  :y1="130 - i * 21" :y2="130 - i * 21"
                  stroke="#ECF0F1" stroke-width="0.4"/>

            <!-- Energy release rate curve -->
            <path d="M 45 110 Q 90 98, 130 82 Q 170 66, 210 50 Q 260 36, 305 28"
                  fill="none" stroke="#2874A6" stroke-width="1.8" stroke-linecap="round"/>

            <!-- Critical threshold -->
            <line x1="45" y1="55" x2="305" y2="55" stroke="#E67E22"
                  stroke-width="1.2" stroke-dasharray="4,3" opacity="0.9"/>
            <text x="310" y="58" font-size="8" fill="#E67E22"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">
              G<tspan font-size="6" baseline-shift="sub">c</tspan>
            </text>

            <!-- Critical point -->
            <circle cx="210" cy="55" r="3.5" fill="#E67E22" stroke="#FFF" stroke-width="1"/>
            <line x1="210" y1="55" x2="210" y2="130" stroke="#95A5A6"
                  stroke-width="0.6" stroke-dasharray="2,2"/>
            <text x="210" y="140" text-anchor="middle" font-size="8" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">
              a<tspan font-size="6" baseline-shift="sub">c</tspan>
            </text>

            <!-- Axis labels -->
            <text x="177" y="152" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">裂纹长度</text>
            <text x="22" y="77" text-anchor="middle" transform="rotate(-90 22 77)"
                  font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">
              能量释放率
            </text>

            <!-- Minimal legend -->
            <rect x="215" y="20" width="85" height="28" fill="#FFF"
                  stroke="#BDC3C7" stroke-width="0.5" rx="2" opacity="0.95"/>
            <line x1="222" y1="32" x2="238" y2="32" stroke="#2874A6"
                  stroke-width="1.5" stroke-linecap="round"/>
            <text x="242" y="34" font-size="7" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif">G(a)</text>
            <line x1="222" y1="42" x2="238" y2="42" stroke="#E67E22"
                  stroke-width="1" stroke-dasharray="3,2"/>
            <text x="242" y="44" font-size="7" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif">
              G<tspan font-size="5" baseline-shift="sub">c</tspan>
            </text>
          </svg>
        </div>
      </article>

      <!-- Panel D: RSI Computation Flow -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">d</span>
          <span class="nature-title">{{ aa('rsiPanelD_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <!-- Input -->
            <rect x="15" y="50" width="65" height="50" fill="#EBF5FB"
                  stroke="#2874A6" stroke-width="0.8" rx="3"/>
            <text x="47" y="70" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="500">输入参数</text>
            <text x="47" y="82" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">
              E, <tspan font-style="italic">ν</tspan>, G<tspan font-size="4" baseline-shift="sub">c</tspan>
            </text>
            <text x="47" y="90" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">
              <tspan font-style="italic">σ</tspan><tspan font-size="4" baseline-shift="sub">t</tspan>, l<tspan font-size="4" baseline-shift="sub">0</tspan>
            </text>

            <!-- Arrow -->
            <line x1="85" y1="75" x2="105" y2="75" stroke="#2C3E50" stroke-width="0.8"
                  marker-end="url(#arrowNature)"/>

            <!-- Energy calc -->
            <rect x="110" y="52" width="80" height="46" fill="#FEF9E7"
                  stroke="#D4AC0D" stroke-width="0.8" rx="3"/>
            <text x="150" y="70" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="500">能量计算</text>
            <text x="150" y="82" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">
              Ψ<tspan font-size="4" baseline-shift="sub">e</tspan> + Ψ<tspan font-size="4" baseline-shift="sub">s</tspan>
            </text>

            <!-- Arrow -->
            <line x1="195" y1="75" x2="215" y2="75" stroke="#2C3E50" stroke-width="0.8"
                  marker-end="url(#arrowNature)"/>

            <!-- Phase evolution -->
            <rect x="220" y="52" width="80" height="46" fill="#FEF9E7"
                  stroke="#D4AC0D" stroke-width="0.8" rx="3"/>
            <text x="260" y="70" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="500">相场演化</text>
            <text x="260" y="82" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">∂<tspan font-style="italic">φ</tspan>/∂t</text>

            <!-- Feedback loop -->
            <path d="M 260 102 Q 260 125, 170 125 Q 47 125, 47 103" fill="none"
                  stroke="#95A5A6" stroke-width="0.6" stroke-dasharray="3,2"
                  marker-end="url(#arrowNature)"/>
            <text x="150" y="135" text-anchor="middle" font-size="6" fill="#7F8C8D"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">迭代</text>

            <!-- Output -->
            <rect x="140" y="18" width="75" height="24" fill="#E8F8F5"
                  stroke="#27AE60" stroke-width="0.8" rx="12"/>
            <text x="177" y="33" text-anchor="middle" font-size="9" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="600">RSI</text>

            <!-- Output arrow -->
            <line x1="260" y1="52" x2="260" y2="45" stroke="#2C3E50" stroke-width="0.8"
                  marker-end="url(#arrowNature)"/>
            <line x1="260" y1="41" x2="220" y2="41" stroke="#2C3E50" stroke-width="0.8"
                  marker-end="url(#arrowNature)"/>
          </svg>
        </div>
      </article>
    </div>
  </PublicationFigureShell>
</template>

<script setup>
import PublicationFigureShell from '../common/PublicationFigureShell.vue'

const props = defineProps({
  aa: {
    type: Function,
    required: true
  }
})

const aa = (...args) => props.aa(...args)

const shellSummary = '相场损伤力学、裂纹扩展历程、能量释放平衡与迭代计算被整合为一张高信息密度的破裂敏感性机理图。'
const shellChips = [
  '相场序参量',
  'Griffith 阈值穿越',
  '迭代能量最小化'
]
const shellNote = '方法注：图版按论文机理链组织，依次展示状态变量定义、裂纹扩展序列、能量判据与最终 RSI 综合过程。'
</script>

<style scoped>
.nature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  align-items: start;
}

.nature-panel {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 246, 238, 0.98) 100%);
  border: 1px solid rgba(215, 208, 195, 0.82);
  border-radius: 18px;
  padding: 14px;
  position: relative;
  box-shadow: 0 14px 30px rgba(29, 39, 51, 0.06);
}

.panel-annotation {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}

.nature-label {
  font-family: "Aptos", "Segoe UI", Arial, sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #1D2733;
  line-height: 1;
}

.nature-title {
  margin: 0;
  font-family: "Source Han Sans SC", "Noto Sans SC", "Aptos", "Segoe UI", Arial, sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #607081;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.panel-svg {
  background: linear-gradient(180deg, #FCFBF8 0%, #F5EFE6 100%);
  border: 1px solid rgba(215, 208, 195, 0.72);
  border-radius: 14px;
  overflow: hidden;
  padding: 6px;
}

.panel-svg svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Responsive */
@media (max-width: 960px) {
  .nature-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .nature-panel {
    padding: 12px;
  }

  .panel-svg {
    padding: 4px;
  }
}
</style>
