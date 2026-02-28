<template>
  <div class="sci-figure">
    <div class="figure-caption-top">
      <strong>Fig. 4</strong> | {{ aa('fig4Caption1') }}
      {{ aa('fig4Caption2') }}
    </div>
    <div class="dbn-container">
      <svg viewBox="0 0 860 320" class="sci-svg-dbn" role="img" :aria-label="aa('fig4AriaLabel')">
        <defs>
          <marker id="dbnFigureArrowSolid" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#111827"/>
          </marker>
          <marker id="dbnFigureArrowDash" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#111827"/>
          </marker>
        </defs>

        <rect x="26" y="44" width="248" height="184" rx="8" fill="#ffffff" stroke="#374151" stroke-width="1.2"/>
        <rect x="306" y="44" width="248" height="184" rx="8" fill="#ffffff" stroke="#374151" stroke-width="1.2"/>
        <rect x="586" y="44" width="248" height="184" rx="8" fill="#ffffff" stroke="#374151" stroke-width="1.2"/>

        <text x="150" y="72" text-anchor="middle" font-size="14" fill="#111827" font-family="Times New Roman, serif" font-weight="700">{{ aa('fig4SliceTMinus1') }}</text>
        <text x="430" y="72" text-anchor="middle" font-size="14" fill="#111827" font-family="Times New Roman, serif" font-weight="700">{{ aa('fig4SliceT') }}</text>
        <text x="710" y="72" text-anchor="middle" font-size="14" fill="#111827" font-family="Times New Roman, serif" font-weight="700">{{ aa('fig4SliceTPlus1') }}</text>

        <rect x="50" y="136" width="80" height="54" rx="6" fill="#ffffff" stroke="#111827" stroke-width="1.6"/>
        <text x="90" y="158" text-anchor="middle" font-size="17" fill="#111827" font-family="Times New Roman, serif" font-weight="700">O</text>
        <text x="90" y="175" text-anchor="middle" font-size="11" fill="#374151" font-family="Times New Roman, serif">{{ aa('fig4Observed') }}</text>

        <ellipse cx="206" cy="161" rx="56" ry="38" fill="#ffffff" stroke="#111827" stroke-width="1.8"/>
        <text x="206" y="154" text-anchor="middle" font-size="18" fill="#111827" font-family="Times New Roman, serif" font-weight="700">H</text>
        <text x="206" y="172" text-anchor="middle" font-size="11" fill="#374151" font-family="Times New Roman, serif">{{ aa('fig4HiddenState') }}</text>
        <text x="206" y="186" text-anchor="middle" font-size="10" fill="#374151" font-family="Times New Roman, serif">{{ aa('fig4RiskStress') }}</text>

        <circle cx="248" cy="96" r="26" fill="#ffffff" stroke="#111827" stroke-width="1.6"/>
        <text x="248" y="93" text-anchor="middle" font-size="16" fill="#111827" font-family="Times New Roman, serif" font-weight="700">R</text>
        <text x="248" y="108" text-anchor="middle" font-size="10" fill="#374151" font-family="Times New Roman, serif">{{ aa('fig4Output') }}</text>

        <rect x="330" y="136" width="80" height="54" rx="6" fill="#ffffff" stroke="#111827" stroke-width="1.6"/>
        <text x="370" y="158" text-anchor="middle" font-size="17" fill="#111827" font-family="Times New Roman, serif" font-weight="700">O</text>
        <text x="370" y="175" text-anchor="middle" font-size="11" fill="#374151" font-family="Times New Roman, serif">{{ aa('fig4Observed') }}</text>

        <ellipse cx="486" cy="161" rx="56" ry="38" fill="#ffffff" stroke="#111827" stroke-width="1.8"/>
        <text x="486" y="154" text-anchor="middle" font-size="18" fill="#111827" font-family="Times New Roman, serif" font-weight="700">H</text>
        <text x="486" y="172" text-anchor="middle" font-size="11" fill="#374151" font-family="Times New Roman, serif">{{ aa('fig4HiddenState') }}</text>
        <text x="486" y="186" text-anchor="middle" font-size="10" fill="#374151" font-family="Times New Roman, serif">{{ aa('fig4RiskStress') }}</text>

        <circle cx="528" cy="96" r="26" fill="#ffffff" stroke="#111827" stroke-width="1.6"/>
        <text x="528" y="93" text-anchor="middle" font-size="16" fill="#111827" font-family="Times New Roman, serif" font-weight="700">R</text>
        <text x="528" y="108" text-anchor="middle" font-size="10" fill="#374151" font-family="Times New Roman, serif">{{ aa('fig4Output') }}</text>

        <rect x="610" y="136" width="80" height="54" rx="6" fill="#ffffff" stroke="#111827" stroke-width="1.6"/>
        <text x="650" y="158" text-anchor="middle" font-size="17" fill="#111827" font-family="Times New Roman, serif" font-weight="700">O</text>
        <text x="650" y="175" text-anchor="middle" font-size="11" fill="#374151" font-family="Times New Roman, serif">{{ aa('fig4Observed') }}</text>

        <ellipse cx="766" cy="161" rx="56" ry="38" fill="#ffffff" stroke="#111827" stroke-width="1.8"/>
        <text x="766" y="154" text-anchor="middle" font-size="18" fill="#111827" font-family="Times New Roman, serif" font-weight="700">H</text>
        <text x="766" y="172" text-anchor="middle" font-size="11" fill="#374151" font-family="Times New Roman, serif">{{ aa('fig4HiddenState') }}</text>
        <text x="766" y="186" text-anchor="middle" font-size="10" fill="#374151" font-family="Times New Roman, serif">{{ aa('fig4RiskStress') }}</text>

        <circle cx="808" cy="96" r="26" fill="#ffffff" stroke="#111827" stroke-width="1.6"/>
        <text x="808" y="93" text-anchor="middle" font-size="16" fill="#111827" font-family="Times New Roman, serif" font-weight="700">R</text>
        <text x="808" y="108" text-anchor="middle" font-size="10" fill="#374151" font-family="Times New Roman, serif">{{ aa('fig4Output') }}</text>

        <path d="M130 156 Q142 140 154 140" fill="none" stroke="#111827" stroke-width="1.8" marker-end="url(#dbnFigureArrowSolid)"/>
        <path d="M410 156 Q422 140 434 140" fill="none" stroke="#111827" stroke-width="1.8" marker-end="url(#dbnFigureArrowSolid)"/>
        <path d="M690 156 Q702 140 714 140" fill="none" stroke="#111827" stroke-width="1.8" marker-end="url(#dbnFigureArrowSolid)"/>

        <path d="M238 122 Q244 112 248 104" fill="none" stroke="#111827" stroke-width="1.8" marker-end="url(#dbnFigureArrowSolid)"/>
        <path d="M518 122 Q524 112 528 104" fill="none" stroke="#111827" stroke-width="1.8" marker-end="url(#dbnFigureArrowSolid)"/>
        <path d="M798 122 Q804 112 808 104" fill="none" stroke="#111827" stroke-width="1.8" marker-end="url(#dbnFigureArrowSolid)"/>

        <line x1="258" y1="160" x2="434" y2="160" stroke="#111827" stroke-width="1.9" stroke-dasharray="6 5" marker-end="url(#dbnFigureArrowDash)"/>
        <line x1="538" y1="160" x2="714" y2="160" stroke="#111827" stroke-width="1.9" stroke-dasharray="6 5" marker-end="url(#dbnFigureArrowDash)"/>
        <text x="346" y="152" text-anchor="middle" font-size="11" fill="#111827" font-family="Times New Roman, serif">P(H<tspan baseline-shift="sub">t</tspan>|H<tspan baseline-shift="sub">t-1</tspan>)</text>
        <text x="626" y="152" text-anchor="middle" font-size="11" fill="#111827" font-family="Times New Roman, serif">P(H<tspan baseline-shift="sub">t+1</tspan>|H<tspan baseline-shift="sub">t</tspan>)</text>

        <g transform="translate(32, 246)">
          <rect x="0" y="0" width="560" height="54" rx="6" fill="#ffffff" stroke="#374151" stroke-width="1"/>
          <rect x="14" y="17" width="22" height="15" rx="3" fill="#ffffff" stroke="#111827" stroke-width="1.2"/>
          <text x="46" y="29" font-size="12" fill="#111827" font-family="Times New Roman, serif">{{ aa('fig4LegendObserved') }}</text>

          <ellipse cx="302" cy="24" rx="13" ry="9" fill="#ffffff" stroke="#111827" stroke-width="1.2"/>
          <text x="324" y="29" font-size="12" fill="#111827" font-family="Times New Roman, serif">{{ aa('fig4LegendHidden') }}</text>

          <circle cx="26" cy="42" r="8" fill="#ffffff" stroke="#111827" stroke-width="1.2"/>
          <text x="46" y="46" font-size="12" fill="#111827" font-family="Times New Roman, serif">{{ aa('fig4LegendRisk') }}</text>

          <line x1="290" y1="42" x2="318" y2="42" stroke="#111827" stroke-width="1.8" stroke-dasharray="6 5"/>
          <text x="324" y="46" font-size="12" fill="#111827" font-family="Times New Roman, serif">{{ aa('fig4LegendDashed') }}</text>
        </g>
      </svg>
    </div>

    <div class="node-types dbn-node-types">
      <div class="node-type"><span class="dot obs"></span>{{ aa('dbnObsNode') }}</div>
      <div class="node-type"><span class="dot hidden"></span>{{ aa('dbnHiddenNode') }}</div>
      <div class="node-type"><span class="dot output"></span>{{ aa('dbnOutputNode') }}</div>
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

.dbn-container {
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: var(--spacing-2) 0 var(--spacing-1);
  border-radius: var(--border-radius-sm);
  background: #ffffff;
  border: 1px solid #d1d5db;
}

.sci-svg-dbn {
  display: block;
  width: min(100%, 860px);
  min-width: 720px;
  max-width: 860px;
  height: auto;
}

.node-types {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.node-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  padding: var(--spacing-2) var(--spacing-3);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dbn-node-types .node-type {
  background: #ffffff;
  border-color: #d1d5db;
  font-family: "Times New Roman", serif;
  color: #111827;
}

.dbn-node-types .dot {
  border: 1.4px solid #111827;
}

.dbn-node-types .dot.obs { background: #e5e7eb; }
.dbn-node-types .dot.hidden { background: #9ca3af; }
.dbn-node-types .dot.output { background: #4b5563; }

@media (max-width: 768px) {
  .sci-svg-dbn {
    min-width: 640px;
  }

  .node-types {
    gap: 10px;
  }

  .node-type {
    font-size: 12px;
    padding: var(--spacing-2) var(--spacing-3);
  }
}
</style>
