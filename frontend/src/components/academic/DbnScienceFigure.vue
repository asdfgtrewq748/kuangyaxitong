<template>
  <figure class="nature-figure" role="img" :aria-label="aa('dbnFigureAria')">
    <figcaption class="nature-caption">
      <span class="fig-label">{{ aa('dbnFigureTag') }}</span> {{ aa('dbnFigureCaption') }}
    </figcaption>

    <div class="nature-grid">
      <!-- Panel A: Network Architecture -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">a</span>
          <span class="nature-title">{{ aa('dbnPanelA_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <defs>
              <!-- Node gradients -->
              <linearGradient id="nodeONature" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#EBF5FB"/>
                <stop offset="100%" stop-color="#D4E6F1"/>
              </linearGradient>
              <linearGradient id="nodeHNature" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FEF9E7"/>
                <stop offset="100%" stop-color="#FCF3CF"/>
              </linearGradient>
              <linearGradient id="nodeRNature" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FDEDEC"/>
                <stop offset="100%" stop-color="#FADBD8"/>
              </linearGradient>
              <marker id="arrowDbn" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0,6 2,0 4" fill="#2C3E50"/>
              </marker>
            </defs>

            <!-- Time slice t-1 -->
            <rect x="22" y="18" width="78" height="120" fill="#F8F9F9" stroke="#BDC3C7" stroke-width="0.5" rx="3"/>
            <text x="61" y="32" text-anchor="middle" font-size="9" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif" font-style="italic">t-1</text>

            <circle cx="61" cy="52" r="12" fill="url(#nodeONature)" stroke="#2874A6" stroke-width="0.8"/>
            <text x="61" y="56" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="600">O</text>

            <circle cx="61" cy="82" r="12" fill="url(#nodeHNature)" stroke="#D4AC0D" stroke-width="0.8"/>
            <text x="61" y="86" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="600">H</text>

            <circle cx="61" cy="112" r="12" fill="url(#nodeRNature)" stroke="#C0392B" stroke-width="0.8"/>
            <text x="61" y="116" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="600">R</text>

            <!-- Intra-slice edges -->
            <line x1="61" y1="64" x2="61" y2="70" stroke="#7F8C8D" stroke-width="0.8" marker-end="url(#arrowDbn)"/>
            <line x1="61" y1="94" x2="61" y2="100" stroke="#7F8C8D" stroke-width="0.8" marker-end="url(#arrowDbn)"/>

            <!-- Time slice t (highlighted) -->
            <rect x="123" y="18" width="78" height="120" fill="#FFF" stroke="#2874A6" stroke-width="1.5" rx="3"/>
            <text x="162" y="32" text-anchor="middle" font-size="9" fill="#2874A6" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-style="italic">t</text>

            <circle cx="162" cy="52" r="12" fill="url(#nodeONature)" stroke="#2874A6" stroke-width="0.8"/>
            <text x="162" y="56" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="600">O</text>

            <circle cx="162" cy="82" r="12" fill="url(#nodeHNature)" stroke="#D4AC0D" stroke-width="0.8"/>
            <text x="162" y="86" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="600">H</text>

            <circle cx="162" cy="112" r="12" fill="url(#nodeRNature)" stroke="#C0392B" stroke-width="0.8"/>
            <text x="162" y="116" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="600">R</text>

            <!-- Intra-slice edges -->
            <line x1="162" y1="64" x2="162" y2="70" stroke="#7F8C8D" stroke-width="0.8" marker-end="url(#arrowDbn)"/>
            <line x1="162" y1="94" x2="162" y2="100" stroke="#7F8C8D" stroke-width="0.8" marker-end="url(#arrowDbn)"/>

            <!-- Time slice t+1 -->
            <rect x="224" y="18" width="78" height="120" fill="#F8F9F9" stroke="#BDC3C7" stroke-width="0.5" rx="3"/>
            <text x="263" y="32" text-anchor="middle" font-size="9" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif" font-style="italic">t+1</text>

            <circle cx="263" cy="52" r="12" fill="url(#nodeONature)" stroke="#2874A6" stroke-width="0.8"/>
            <text x="263" y="56" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="600">O</text>

            <circle cx="263" cy="82" r="12" fill="url(#nodeHNature)" stroke="#D4AC0D" stroke-width="0.8"/>
            <text x="263" y="86" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="600">H</text>

            <circle cx="263" cy="112" r="12" fill="url(#nodeRNature)" stroke="#C0392B" stroke-width="0.8"/>
            <text x="263" y="116" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="600">R</text>

            <!-- Intra-slice edges -->
            <line x1="263" y1="64" x2="263" y2="70" stroke="#7F8C8D" stroke-width="0.8" marker-end="url(#arrowDbn)"/>
            <line x1="263" y1="94" x2="263" y2="100" stroke="#7F8C8D" stroke-width="0.8" marker-end="url(#arrowDbn)"/>

            <!-- Temporal edges -->
            <line x1="73" y1="52" x2="115" y2="52" stroke="#2874A6" stroke-width="0.8" stroke-dasharray="3,2" marker-end="url(#arrowDbn)"/>
            <line x1="73" y1="82" x2="115" y2="82" stroke="#D4AC0D" stroke-width="0.8" stroke-dasharray="3,2" marker-end="url(#arrowDbn)"/>
            <line x1="73" y1="112" x2="115" y2="112" stroke="#C0392B" stroke-width="0.8" stroke-dasharray="3,2" marker-end="url(#arrowDbn)"/>

            <line x1="174" y1="52" x2="216" y2="52" stroke="#2874A6" stroke-width="0.8" stroke-dasharray="3,2" marker-end="url(#arrowDbn)"/>
            <line x1="174" y1="82" x2="216" y2="82" stroke="#D4AC0D" stroke-width="0.8" stroke-dasharray="3,2" marker-end="url(#arrowDbn)"/>
            <line x1="174" y1="112" x2="216" y2="112" stroke="#C0392B" stroke-width="0.8" stroke-dasharray="3,2" marker-end="url(#arrowDbn)"/>

            <!-- Legend -->
            <rect x="230" y="145" width="85" height="12" fill="#FFF" stroke="#BDC3C7" stroke-width="0.5" rx="1"/>
            <text x="272" y="154" text-anchor="middle" font-size="7" fill="#7F8C8D" font-family="Helvetica, Arial, sans-serif">O=观测, H=隐层, R=风险</text>
          </svg>
        </div>
      </article>

      <!-- Panel B: Conditional Probabilities -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">b</span>
          <span class="nature-title">{{ aa('dbnPanelB_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <!-- Axes -->
            <line x1="55" y1="130" x2="280" y2="130" stroke="#2C3E50" stroke-width="0.8"/>
            <line x1="55" y1="130" x2="55" y2="25" stroke="#2C3E50" stroke-width="0.8"/>

            <!-- Axis arrows -->
            <polygon points="280,130 275,128 275,132" fill="#2C3E50"/>
            <polygon points="55,25 53,30 57,30" fill="#2C3E50"/>

            <!-- Heatmap cells -->
            <g v-for="(row, i) in heatmapData" :key="`row-${i}`">
              <rect v-for="(val, j) in row" :key="`cell-${i}-${j}`"
                    :x="75 + j * 60" :y="40 + i * 28" width="56" height="24"
                    :fill="getHeatColor(val)" stroke="#FFF" stroke-width="0.8" rx="1"/>
              <text :x="103 + j * 60" :y="56 + i * 28" text-anchor="middle" font-size="9" fill="#2C3E50"
                    font-family="Helvetica, Arial, sans-serif" font-weight="600">{{ val }}%</text>
            </g>

            <!-- Row labels -->
            <text x="50" y="56" text-anchor="end" font-size="7" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">H(t-1)=L</text>
            <text x="50" y="84" text-anchor="end" font-size="7" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">H(t-1)=M</text>
            <text x="50" y="112" text-anchor="end" font-size="7" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">H(t-1)=H</text>

            <!-- Column labels -->
            <text x="103" y="142" text-anchor="middle" font-size="7" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">H(t)=L</text>
            <text x="163" y="142" text-anchor="middle" font-size="7" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">H(t)=M</text>
            <text x="223" y="142" text-anchor="middle" font-size="7" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">H(t)=H</text>

            <!-- Axis titles -->
            <text x="167" y="155" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-style="italic">当前状态 H(t)</text>
            <text x="25" y="77" text-anchor="middle" transform="rotate(-90 25 77)" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-style="italic">前一状态 H(t-1)</text>

            <!-- Color bar -->
            <rect x="265" y="40" width="10" height="70" fill="url(#heatBarDbn)" stroke="#BDC3C7" stroke-width="0.5" rx="1"/>
            <text x="282" y="44" font-size="6" fill="#7F8C8D" font-family="Helvetica, Arial, sans-serif">100%</text>
            <text x="282" y="108" font-size="6" fill="#7F8C8D" font-family="Helvetica, Arial, sans-serif">0%</text>
          </svg>
        </div>
      </article>

      <!-- Panel C: Inference Process -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">c</span>
          <span class="nature-title">{{ aa('dbnPanelC_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <!-- Evidence -->
            <rect x="18" y="50" width="55" height="35" fill="#EBF5FB" stroke="#2874A6" stroke-width="0.8" rx="3"/>
            <text x="45" y="67" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="500">证据</text>
            <text x="45" y="78" text-anchor="middle" font-size="6" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">e₁, e₂, e₃</text>

            <!-- Arrow -->
            <line x1="78" y1="67" x2="98" y2="67" stroke="#2C3E50" stroke-width="0.8" marker-end="url(#arrowDbn)"/>

            <!-- Message passing -->
            <rect x="103" y="42" width="80" height="50" fill="#FEF9E7" stroke="#D4AC0D" stroke-width="0.8" rx="3"/>
            <text x="143" y="60" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="500">消息</text>
            <text x="143" y="72" text-anchor="middle" font-size="6" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">传递</text>
            <text x="143" y="82" text-anchor="middle" font-size="6" fill="#7F8C8D" font-family="Helvetica, Arial, sans-serif" font-style="italic">μ, λ 传播</text>

            <!-- Propagation arrows -->
            <line x1="143" y1="97" x2="118" y2="115" stroke="#95A5A6" stroke-width="0.6" stroke-dasharray="2,2" marker-end="url(#arrowDbn)"/>
            <line x1="143" y1="97" x2="143" y2="118" stroke="#95A5A6" stroke-width="0.6" stroke-dasharray="2,2" marker-end="url(#arrowDbn)"/>
            <line x1="143" y1="97" x2="168" y2="115" stroke="#95A5A6" stroke-width="0.6" stroke-dasharray="2,2" marker-end="url(#arrowDbn)"/>

            <!-- Network nodes -->
            <circle cx="118" cy="122" r="10" fill="#EBF5FB" stroke="#2874A6" stroke-width="0.8"/>
            <text x="118" y="126" text-anchor="middle" font-size="7" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">O</text>

            <circle cx="143" cy="130" r="10" fill="#FEF9E7" stroke="#D4AC0D" stroke-width="0.8"/>
            <text x="143" y="134" text-anchor="middle" font-size="7" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">H</text>

            <circle cx="168" cy="122" r="10" fill="#FDEDEC" stroke="#C0392B" stroke-width="0.8"/>
            <text x="168" y="126" text-anchor="middle" font-size="7" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">R</text>

            <!-- Arrow to belief -->
            <line x1="188" y1="67" x2="208" y2="67" stroke="#2C3E50" stroke-width="0.8" marker-end="url(#arrowDbn)"/>

            <!-- Belief update -->
            <rect x="213" y="45" width="75" height="45" fill="#E8F8F5" stroke="#27AE60" stroke-width="0.8" rx="3"/>
            <text x="250" y="62" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="500">信念</text>
            <text x="250" y="73" text-anchor="middle" font-size="6" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">更新</text>
            <text x="250" y="83" text-anchor="middle" font-size="6" fill="#7F8C8D" font-family="Helvetica, Arial, sans-serif" font-style="italic">P(X|e)</text>

            <!-- Arrow to posterior -->
            <line x1="250" y1="95" x2="250" y2="110" stroke="#2C3E50" stroke-width="0.8" marker-end="url(#arrowDbn)"/>

            <!-- Posterior -->
            <rect x="220" y="115" width="60" height="32" fill="#D5F5E3" stroke="#27AE60" stroke-width="0.8" rx="12"/>
            <text x="250" y="130" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-weight="600">后验</text>
            <text x="250" y="140" text-anchor="middle" font-size="6" fill="#27AE60" font-family="Helvetica, Arial, sans-serif">P(风险|证据)</text>
          </svg>
        </div>
      </article>

      <!-- Panel D: Risk Evolution Timeline -->
      <article class="nature-panel">
        <div class="panel-annotation">
          <span class="nature-label">d</span>
          <span class="nature-title">{{ aa('dbnPanelD_Title') }}</span>
        </div>
        <div class="panel-svg">
          <svg viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet">
            <!-- Axes -->
            <line x1="45" y1="130" x2="305" y2="130" stroke="#2C3E50" stroke-width="0.8"/>
            <line x1="45" y1="130" x2="45" y2="20" stroke="#2C3E50" stroke-width="0.8"/>

            <!-- Axis arrows -->
            <polygon points="305,130 300,128 300,132" fill="#2C3E50"/>
            <polygon points="45,20 43,25 47,25" fill="#2C3E50"/>

            <!-- Grid -->
            <line v-for="i in 4" :key="`h-${i}`" x1="45" :x2="300" :y1="130 - i * 22" :y2="130 - i * 22"
                  stroke="#ECF0F1" stroke-width="0.4"/>

            <!-- Alert threshold -->
            <line x1="45" y1="55" x2="305" y2="55" stroke="#E74C3C" stroke-width="1" stroke-dasharray="4,2"/>
            <text x="310" y="58" font-size="7" fill="#E74C3C" font-family="Helvetica, Arial, sans-serif" font-style="italic">预警</text>

            <!-- Posterior probability curves -->
            <path d="M 45 108 L 82 102 L 119 90 L 156 78 L 193 65 L 230 52 L 267 48 L 305 45"
                  fill="none" stroke="#2874A6" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M 45 115 L 82 112 L 119 108 L 156 104 L 193 100 L 230 97 L 267 95 L 305 93"
                  fill="none" stroke="#D4AC0D" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3,2"/>

            <!-- Evidence points -->
            <circle cx="82" cy="102" r="3" fill="#2874A6" stroke="#FFF" stroke-width="1"/>
            <circle cx="119" cy="90" r="3" fill="#2874A6" stroke="#FFF" stroke-width="1"/>
            <circle cx="156" cy="78" r="3" fill="#2874A6" stroke="#FFF" stroke-width="1"/>
            <circle cx="193" cy="65" r="3" fill="#2874A6" stroke="#FFF" stroke-width="1"/>
            <circle cx="230" cy="52" r="4" fill="#E74C3C" stroke="#FFF" stroke-width="1"/>
            <circle cx="267" cy="48" r="4" fill="#E74C3C" stroke="#FFF" stroke-width="1"/>

            <!-- Time labels -->
            <text x="82" y="145" text-anchor="middle" font-size="8" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">t₁</text>
            <text x="119" y="145" text-anchor="middle" font-size="8" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">t₂</text>
            <text x="156" y="145" text-anchor="middle" font-size="8" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">t₃</text>
            <text x="193" y="145" text-anchor="middle" font-size="8" fill="#5D6D7E" font-family="Helvetica, Arial, sans-serif">t₄</text>
            <text x="230" y="145" text-anchor="middle" font-size="8" fill="#E74C3C" font-family="Helvetica, Arial, sans-serif" font-weight="600">t₅</text>
            <text x="267" y="145" text-anchor="middle" font-size="8" fill="#E74C3C" font-family="Helvetica, Arial, sans-serif" font-weight="600">t₆</text>

            <!-- Axis labels -->
            <text x="175" y="158" text-anchor="middle" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-style="italic">时间步</text>
            <text x="18" y="75" text-anchor="middle" transform="rotate(-90 18 75)" font-size="8" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif" font-style="italic">P(风险 | 证据)</text>

            <!-- Legend -->
            <rect x="200" y="25" width="100" height="32" fill="#FFF" stroke="#BDC3C7" stroke-width="0.5" rx="2" opacity="0.95"/>
            <line x1="208" y1="38" x2="223" y2="38" stroke="#2874A6" stroke-width="1.5"/>
            <text x="227" y="40" font-size="6" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">P(风险|e)</text>
            <line x1="208" y1="50" x2="223" y2="50" stroke="#D4AC0D" stroke-width="1.2" stroke-dasharray="3,2"/>
            <text x="227" y="52" font-size="6" fill="#2C3E50" font-family="Helvetica, Arial, sans-serif">P(正常|e)</text>
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

// Heatmap data for transition matrix P(H_t | H_{t-1})
const heatmapData = computed(() => [
  [85, 12, 3],
  [15, 70, 15],
  [5, 20, 75]
])

// Helper function to get color based on value
function getHeatColor(value) {
  if (value >= 75) return '#1B4F72'
  if (value >= 50) return '#2874A6'
  if (value >= 25) return '#5499C7'
  return '#D6EAF8'
}
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
