<template>
  <PublicationFigureShell
    :figure-label="aa('asiFigureTag')"
    :caption="aa('asiFigureCaption')"
    :summary="shellSummary"
    :chips="shellChips"
    :note="shellNote"
    :aria-label="aa('asiFigureAria')"
  >
    <div class="nature-grid">
      <!-- Panel A: Kirsch Stress Distribution -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">a</span>
          <span class="nature-title">{{ aa('asiPanelA_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="stressGradAsi" cx="50%" cy="50%">
                <stop offset="0%" stop-color="#16A085" stop-opacity="0.15"/>
                <stop offset="40%" stop-color="#16A085" stop-opacity="0.08"/>
                <stop offset="70%" stop-color="#E67E22" stop-opacity="0.12"/>
                <stop offset="100%" stop-color="#E67E22" stop-opacity="0.25"/>
              </radialGradient>
              <pattern id="gridAsi" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#ECF0F1" stroke-width="0.3"/>
              </pattern>
              <marker id="arrowAsi" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0,6 2,0 4" fill="#2C3E50"/>
              </marker>
            </defs>

            <!-- Background with subtle grid -->
            <rect x="15" y="15" width="180" height="130" fill="url(#gridAsi)" stroke="#BDC3C7" stroke-width="0.5" rx="2"/>

            <!-- Stress concentration contours -->
            <circle cx="105" cy="80" r="70" fill="none" stroke="#16A085" stroke-width="0.6" opacity="0.3"/>
            <circle cx="105" cy="80" r="55" fill="none" stroke="#16A085" stroke-width="0.7" opacity="0.4"/>
            <circle cx="105" cy="80" r="42" fill="none" stroke="#16A085" stroke-width="0.8" opacity="0.5"/>
            <circle cx="105" cy="80" r="28" fill="none" stroke="#16A085" stroke-width="0.9" opacity="0.6"/>

            <!-- Opening -->
            <circle cx="105" cy="80" r="15" fill="#FAFAFA" stroke="#16A085" stroke-width="1.5"/>

            <!-- Stress concentration vectors -->
            <line x1="105" y1="65" x2="105" y2="48" stroke="#E67E22" stroke-width="1.5" marker-end="url(#arrowAsi)"/>
            <line x1="120" y1="80" x2="137" y2="80" stroke="#E67E22" stroke-width="1.5" marker-end="url(#arrowAsi)"/>
            <line x1="105" y1="95" x2="105" y2="112" stroke="#E67E22" stroke-width="1.5" marker-end="url(#arrowAsi)"/>
            <line x1="90" y1="80" x2="73" y2="80" stroke="#E67E22" stroke-width="1.5" marker-end="url(#arrowAsi)"/>

            <!-- Opening label -->
            <text x="105" y="84" text-anchor="middle" font-size="7" fill="#16A085"
                  font-family="Helvetica, Arial, sans-serif" font-weight="600">巷道</text>

            <!-- Max stress annotation -->
            <text x="135" y="55" font-size="7" fill="#E67E22"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">
              σ<tspan font-size="5" baseline-shift="sub">θ</tspan><tspan font-size="5">max</tspan>
            </text>

            <!-- Legend -->
            <rect x="210" y="25" width="115" height="110" fill="#FFF" stroke="#BDC3C7" stroke-width="0.5" rx="2" opacity="0.95"/>
            <text x="220" y="42" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="600">应力等值线</text>

            <circle cx="230" cy="58" r="8" fill="none" stroke="#16A085" stroke-width="0.8" opacity="0.6"/>
            <text x="245" y="61" font-size="7" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">σ<tspan font-size="5" baseline-shift="sub">θ</tspan></text>

            <circle cx="230" cy="80" r="6" fill="#E67E22" opacity="0.3"/>
            <text x="245" y="83" font-size="7" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">σ<tspan font-size="5" baseline-shift="sub">r</tspan></text>

            <text x="220" y="105" font-size="6" fill="#7F8C8D"
                  font-family="Helvetica, Arial, sans-serif">Kirsch解：</text>
            <text x="220" y="115" font-size="6" fill="#7F8C8D"
                  font-family="Helvetica, Arial, sans-serif">σ<tspan font-size="4" baseline-shift="sub">r</tspan>, σ<tspan font-size="4" baseline-shift="sub">θ</tspan> at (r,θ)</text>
            <text x="220" y="125" font-size="6" fill="#7F8C8D"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">从巷道壁</text>
          </svg>
        </div>
      </article>

      <!-- Panel B: UST Failure Envelope -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">b</span>
          <span class="nature-title">{{ aa('asiPanelB_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <!-- Clean axes -->
            <line x1="45" y1="130" x2="300" y2="130" stroke="#2C3E50" stroke-width="0.8"/>
            <line x1="45" y1="130" x2="45" y2="15" stroke="#2C3E50" stroke-width="0.8"/>

            <!-- Axis arrows -->
            <polygon points="300,130 295,128 295,132" fill="#2C3E50"/>
            <polygon points="45,15 43,20 47,20" fill="#2C3E50"/>

            <!-- Subtle grid -->
            <line v-for="i in 4" :key="`h-${i}`" x1="45" :x2="295" :y1="130 - i * 23" :y2="130 - i * 23"
                  stroke="#ECF0F1" stroke-width="0.4"/>
            <line v-for="i in 4" :key="`v-${i}`" :x1="45 + i * 50" :x2="45 + i * 50" y1="15" y2="130"
                  stroke="#ECF0F1" stroke-width="0.4"/>

            <!-- Mohr-Coulomb (b=0) - straight line -->
            <line x1="45" y1="130" x2="260" y2="25" stroke="#16A085" stroke-width="1.8" stroke-linecap="round"/>

            <!-- UST (b=0.5) - intermediate curve -->
            <path d="M 45 130 Q 110 105, 155 80 Q 200 55, 280 35"
                  fill="none" stroke="#E67E22" stroke-width="1.8" stroke-linecap="round"/>

            <!-- Twin-Shear (b=1) - outer curve -->
            <path d="M 45 130 Q 120 100, 165 70 Q 210 45, 295 22"
                  fill="none" stroke="#C0392B" stroke-width="1.8" stroke-linecap="round"/>

            <!-- Axis labels -->
            <text x="172" y="148" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">
              正应力 σ
            </text>
            <text x="20" y="72" text-anchor="middle" transform="rotate(-90 20 72)" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">
              剪应力 τ
            </text>

            <!-- Minimal legend -->
            <rect x="195" y="15" width="100" height="50" fill="#FFF" stroke="#BDC3C7" stroke-width="0.5" rx="2" opacity="0.95"/>

            <line x1="203" y1="28" x2="218" y2="28" stroke="#16A085" stroke-width="1.5"/>
            <text x="222" y="30" font-size="7" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">M-C (b=0)</text>

            <line x1="203" y1="42" x2="218" y2="42" stroke="#E67E22" stroke-width="1.5"/>
            <text x="222" y="44" font-size="7" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">UST (b=0.5)</text>

            <line x1="203" y1="56" x2="218" y2="56" stroke="#C0392B" stroke-width="1.5"/>
            <text x="222" y="58" font-size="7" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">双剪 (b=1)</text>
          </svg>
        </div>
      </article>

      <!-- Panel C: Mohr Stress Circles -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">c</span>
          <span class="nature-title">{{ aa('asiPanelC_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <!-- Clean axes -->
            <line x1="45" y1="130" x2="300" y2="130" stroke="#2C3E50" stroke-width="0.8"/>
            <line x1="45" y1="130" x2="45" y2="15" stroke="#2C3E50" stroke-width="0.8"/>

            <!-- Axis arrows -->
            <polygon points="300,130 295,128 295,132" fill="#2C3E50"/>
            <polygon points="45,15 43,20 47,20" fill="#2C3E50"/>

            <!-- Subtle grid -->
            <line v-for="i in 4" :key="`h-${i}`" x1="45" :x2="295" :y1="130 - i * 23" :y2="130 - i * 23"
                  stroke="#ECF0F1" stroke-width="0.4"/>

            <!-- Failure envelope -->
            <line x1="45" y1="130" x2="260" y2="30" stroke="#E67E22" stroke-width="1.5" stroke-dasharray="4,2"/>

            <!-- Mohr circles -->
            <!-- Circle 1: smallest -->
            <circle cx="95" cy="105" r="22" fill="none" stroke="#16A085" stroke-width="1.5"/>
            <line x1="73" y1="105" x2="117" y2="105" stroke="#16A085" stroke-width="0.6" stroke-dasharray="2,2"/>

            <!-- Circle 2: medium -->
            <circle cx="145" cy="92" r="35" fill="none" stroke="#16A085" stroke-width="1.5"/>
            <line x1="110" y1="92" x2="180" y2="92" stroke="#16A085" stroke-width="0.6" stroke-dasharray="2,2"/>

            <!-- Circle 3: largest, touching envelope -->
            <circle cx="200" cy="72" r="48" fill="none" stroke="#C0392B" stroke-width="2"/>
            <line x1="152" y1="72" x2="248" y2="72" stroke="#C0392B" stroke-width="0.6" stroke-dasharray="2,2"/>

            <!-- Tangent point -->
            <circle cx="230" cy="42" r="3" fill="#C0392B" stroke="#FFF" stroke-width="1"/>
            <line x1="230" y1="42" x2="248" y2="30" stroke="#7F8C8D" stroke-width="0.5" stroke-dasharray="2,2"/>
            <text x="252" y="28" font-size="7" fill="#C0392B" font-family="Helvetica, Arial, sans-serif">failure</text>

            <!-- Axis labels -->
            <text x="172" y="148" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">
              正应力 σ
            </text>
            <text x="22" y="72" text-anchor="middle" transform="rotate(-90 22 72)" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">
              剪应力 τ
            </text>

            <!-- Legend -->
            <rect x="225" y="95" width="70" height="32" fill="#FFF" stroke="#BDC3C7" stroke-width="0.5" rx="2" opacity="0.95"/>
            <circle cx="235" cy="107" r="6" fill="none" stroke="#16A085" stroke-width="1"/>
            <text x="248" y="110" font-size="7" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">稳定</text>
            <circle cx="235" cy="120" r="6" fill="none" stroke="#C0392B" stroke-width="1"/>
            <text x="248" y="123" font-size="7" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">临界</text>
          </svg>
        </div>
      </article>

      <!-- Panel D: ASI Computation Flow -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">d</span>
          <span class="nature-title">{{ aa('asiPanelD_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <!-- Boundary conditions -->
            <rect x="12" y="55" width="78" height="48" fill="#E8F8F5" stroke="#16A085" stroke-width="0.8" rx="3"/>
            <text x="51" y="75" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="500">边界条件</text>
            <text x="51" y="87" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">
              σ<tspan font-size="4" baseline-shift="sub">0</tspan>, p, a, b, c, φ
            </text>

            <!-- Arrow -->
            <line x1="95" y1="79" x2="115" y2="79" stroke="#2C3E50" stroke-width="0.8" marker-end="url(#arrowAsi)"/>

            <!-- Kirsch solution -->
            <rect x="120" y="50" width="90" height="58" fill="#FEF9E7" stroke="#D4AC0D" stroke-width="0.8" rx="3"/>
            <text x="165" y="70" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="500">Kirsch解</text>
            <text x="165" y="82" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">σ<tspan font-size="4" baseline-shift="sub">r</tspan>, σ<tspan font-size="4" baseline-shift="sub">θ</tspan> at (r,θ)</text>
            <text x="165" y="92" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">从巷道壁</text>

            <!-- Arrow -->
            <line x1="215" y1="79" x2="235" y2="79" stroke="#2C3E50" stroke-width="0.8" marker-end="url(#arrowAsi)"/>

            <!-- UST evaluation -->
            <rect x="240" y="50" width="90" height="58" fill="#FEF9E7" stroke="#D4AC0D" stroke-width="0.8" rx="3"/>
            <text x="285" y="70" text-anchor="middle" font-size="8" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="500">UST</text>
            <text x="285" y="82" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif" font-style="italic">F(σ, τ, b)</text>
            <text x="285" y="92" text-anchor="middle" font-size="6" fill="#5D6D7E"
                  font-family="Helvetica, Arial, sans-serif">vs. strength</text>

            <!-- Output arrow -->
            <line x1="285" y1="112" x2="285" y2="118" stroke="#2C3E50" stroke-width="0.8" marker-end="url(#arrowAsi)"/>
            <line x1="285" y1="122" x2="165" y2="122" stroke="#2C3E50" stroke-width="0.8" marker-end="url(#arrowAsi)"/>

            <!-- Output -->
            <rect x="125" y="110" width="80" height="28" fill="#FEF5E7" stroke="#E67E22" stroke-width="0.8" rx="14"/>
            <text x="165" y="123" text-anchor="middle" font-size="9" fill="#2C3E50"
                  font-family="Helvetica, Arial, sans-serif" font-weight="600">ASI</text>
            <text x="165" y="132" text-anchor="middle" font-size="6" fill="#E67E22"
                  font-family="Helvetica, Arial, sans-serif">K<tspan font-size="4" baseline-shift="sub">max</tspan> × D<tspan font-size="4" baseline-shift="sub">f</tspan></text>
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

const shellSummary = 'Kirsch 应力重分布、统一强度包络、Mohr 圆相切分析与解析指标综合被压缩到一张紧凑的失稳筛查图中。'
const shellChips = [
  'Kirsch 应力场',
  '统一强度理论',
  '临界圆相切'
]
const shellNote = '方法注：图版按照论文阅读顺序组织，依次展示边界加载、破坏包络对比、应力状态校验与最终 ASI 推导。'
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
