<template>
  <section class="card onboarding-card">
    <div class="section-header">
      <h2>{{ aa('onboardingTitle') }}</h2>
      <p>{{ aa('onboardingDesc') }}</p>
    </div>
    <div class="onboarding-grid">
      <div class="reading-path">
        <div class="reading-step" v-for="item in newcomerJourney" :key="item.step">
          <span class="reading-index">{{ item.step }}</span>
          <div class="reading-body">
            <h3>{{ aa(item.titleKey) }}</h3>
            <p>{{ aa(item.descKey) }}</p>
          </div>
        </div>
      </div>
      <div class="io-map">
        <h3>{{ aa('ioMapTitle') }}</h3>
        <svg viewBox="0 0 680 220" class="io-map-svg" role="img" :aria-label="aa('ioMapAriaLabel')">
          <defs>
            <linearGradient id="ioInputGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#e0f2fe"/>
              <stop offset="100%" style="stop-color:#bae6fd"/>
            </linearGradient>
            <linearGradient id="ioProcessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#ede9fe"/>
              <stop offset="100%" style="stop-color:#ddd6fe"/>
            </linearGradient>
            <linearGradient id="ioOutputGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#dcfce7"/>
              <stop offset="100%" style="stop-color:#bbf7d0"/>
            </linearGradient>
            <marker id="ioArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#64748b"/>
            </marker>
          </defs>

          <rect x="20" y="48" width="190" height="124" rx="14" fill="url(#ioInputGradient)" stroke="#0ea5e9" stroke-width="1.5"/>
          <text x="115" y="78" text-anchor="middle" font-size="16" fill="#0f172a" font-weight="700">{{ aa('ioMap.inputLayer') }}</text>
          <text x="115" y="104" text-anchor="middle" font-size="12" fill="#334155">{{ aa('ioMap.inputLine1') }}</text>
          <text x="115" y="124" text-anchor="middle" font-size="12" fill="#334155">{{ aa('ioMap.inputLine2') }}</text>
          <text x="115" y="144" text-anchor="middle" font-size="12" fill="#334155">{{ aa('ioMap.inputLine3') }}</text>

          <rect x="245" y="32" width="190" height="156" rx="14" fill="url(#ioProcessGradient)" stroke="#8b5cf6" stroke-width="1.5"/>
          <text x="340" y="62" text-anchor="middle" font-size="16" fill="#0f172a" font-weight="700">{{ aa('ioMap.processLayer') }}</text>
          <text x="340" y="87" text-anchor="middle" font-size="12" fill="#334155">{{ aa('ioMap.processLine1') }}</text>
          <text x="340" y="107" text-anchor="middle" font-size="12" fill="#334155">{{ aa('ioMap.processLine2') }}</text>
          <text x="340" y="127" text-anchor="middle" font-size="12" fill="#334155">{{ aa('ioMap.processLine3') }}</text>
          <text x="340" y="147" text-anchor="middle" font-size="12" fill="#334155">{{ aa('ioMap.processLine4') }}</text>
          <text x="340" y="167" text-anchor="middle" font-size="11" fill="#475569">{{ aa('ioMap.processLine5') }}</text>

          <rect x="470" y="48" width="190" height="124" rx="14" fill="url(#ioOutputGradient)" stroke="#22c55e" stroke-width="1.5"/>
          <text x="565" y="78" text-anchor="middle" font-size="16" fill="#0f172a" font-weight="700">{{ aa('ioMap.outputLayer') }}</text>
          <text x="565" y="104" text-anchor="middle" font-size="12" fill="#334155">{{ aa('ioMap.outputLine1') }}</text>
          <text x="565" y="124" text-anchor="middle" font-size="12" fill="#334155">{{ aa('ioMap.outputLine2') }}</text>
          <text x="565" y="144" text-anchor="middle" font-size="12" fill="#334155">{{ aa('ioMap.outputLine3') }}</text>

          <line x1="210" y1="110" x2="245" y2="110" stroke="#64748b" stroke-width="2" marker-end="url(#ioArrow)"/>
          <line x1="435" y1="110" x2="470" y2="110" stroke="#64748b" stroke-width="2" marker-end="url(#ioArrow)"/>
        </svg>
        <p class="io-map-tip">{{ aa('ioMapTip') }}</p>
      </div>
    </div>
  </section>

  <section class="card glossary-card">
    <div class="section-header">
      <h2>{{ aa('glossaryTitle') }}</h2>
      <p>{{ aa('glossaryDesc') }}</p>
    </div>
    <div class="glossary-grid">
      <article class="glossary-item" v-for="item in termGlossary" :key="item.termKey">
        <h3>{{ aa(item.termKey) }}</h3>
        <p class="glossary-plain">{{ aa(item.plainKey) }}</p>
        <p class="glossary-cue">{{ aa(item.cueKey) }}</p>
      </article>
    </div>
  </section>

  <section class="card storyboard-card">
    <div class="section-header">
      <h2>{{ aa('storyboardTitle') }}</h2>
      <p>{{ aa('storyboardDesc') }}</p>
    </div>
    <div class="storyboard-grid">
      <article class="storyboard-item" v-for="item in algorithmStoryboards" :key="item.key">
        <div class="storyboard-head">
          <span class="storyboard-tag">{{ item.tag }}</span>
          <h3>{{ aa(item.nameKey) }}</h3>
        </div>
        <div class="storyboard-strip">
          <div class="story-node input">
            <span class="story-node-label">{{ aa('storyNodeInput') }}</span>
            <span class="story-node-text">{{ aa(item.inputKey) }}</span>
          </div>
          <span class="story-arrow">&rarr;</span>
          <div class="story-node process">
            <span class="story-node-label">{{ aa('storyNodeProcess') }}</span>
            <span class="story-node-text">{{ aa(item.processKey) }}</span>
          </div>
          <span class="story-arrow">&rarr;</span>
          <div class="story-node output">
            <span class="story-node-label">{{ aa('storyNodeOutput') }}</span>
            <span class="story-node-text">{{ aa(item.outputKey) }}</span>
          </div>
        </div>
        <p class="storyboard-watch">{{ aa('storyboardWatchPrefix') }}{{ aa(item.watchKey) }}</p>
        <button class="storyboard-jump" @click="emit('update:active-algo', item.key)">{{ aa('storyboardJump') }}</button>
      </article>
    </div>
  </section>

  <section class="card flow-card">
    <div class="section-header">
      <h2>{{ aa('flowTitle') }}</h2>
      <p>{{ aa('flowDesc') }}</p>
    </div>
    <div class="flow-diagram">
      <div class="flow-row">
        <div
          class="flow-node"
          v-for="(node, idx) in flowNodes"
          :key="node.key"
          :class="{ active: activeFlowNode === idx }"
          @mouseenter="emit('update:active-flow-node', idx)"
        >
          <div class="node-icon" v-html="node.icon"></div>
          <div class="node-title">{{ aa(node.titleKey) }}</div>
          <div class="node-subtitle">{{ aa(node.subtitleKey) }}</div>
        </div>
      </div>
      <div class="flow-arrows">
        <div class="flow-arrow" v-for="i in 3" :key="i">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="flow-detail" v-if="activeNode">
      <div class="detail-content">
        <h4>{{ aa(activeNode.detailTitleKey) }}</h4>
        <p>{{ aa(activeNode.detailKey) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['update:active-flow-node', 'update:active-algo'])

const props = defineProps({
  aa: {
    type: Function,
    required: true
  },
  newcomerJourney: {
    type: Array,
    required: true
  },
  termGlossary: {
    type: Array,
    required: true
  },
  algorithmStoryboards: {
    type: Array,
    required: true
  },
  flowNodes: {
    type: Array,
    required: true
  },
  activeFlowNode: {
    type: Number,
    required: true
  }
})

const activeNode = computed(() => props.flowNodes[props.activeFlowNode])
</script>

<style scoped>
.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0 0 var(--spacing-2) 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.section-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.onboarding-card {
  background:
    radial-gradient(circle at top right, rgba(90, 99, 120, 0.08), transparent 55%),
    var(--bg-primary);
}

.onboarding-grid {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(420px, 1.2fr);
  gap: 24px;
  align-items: start;
}

.reading-path {
  display: grid;
  gap: 14px;
}

.reading-step {
  display: flex;
  gap: 14px;
  padding: var(--spacing-4);
  border-radius: var(--border-radius-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.reading-index {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  color: #fff;
  background: var(--gradient-primary);
  flex-shrink: 0;
}

.reading-body h3 {
  margin: 0 0 var(--spacing-1) 0;
  font-size: 15px;
  color: var(--text-primary);
}

.reading-body p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.65;
}

.io-map {
  padding: var(--spacing-4);
  border-radius: var(--border-radius-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.io-map h3 {
  margin: 0 0 var(--spacing-3) 0;
  font-size: 16px;
  color: var(--text-primary);
}

.io-map-svg {
  width: 100%;
  height: auto;
  display: block;
}

.io-map-tip {
  margin: var(--spacing-3) 0 0;
  font-size: 12px;
  color: var(--text-tertiary);
}

.glossary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.glossary-item {
  padding: var(--spacing-4);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.glossary-item h3 {
  margin: 0 0 var(--spacing-2);
  font-size: 15px;
  color: var(--text-primary);
}

.glossary-plain {
  margin: 0 0 var(--spacing-2);
  font-size: 13px;
  color: var(--color-primary);
  font-weight: 600;
}

.glossary-cue {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.65;
}

.storyboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.storyboard-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.storyboard-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.storyboard-tag {
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.storyboard-head h3 {
  margin: 0;
  font-size: 15px;
  color: var(--text-primary);
}

.storyboard-strip {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 8px;
  align-items: center;
}

.story-node {
  min-height: 78px;
  padding: var(--spacing-3) var(--spacing-2);
  border-radius: 10px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  text-align: center;
}

.story-node.input {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(14, 165, 233, 0.03));
}

.story-node.process {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(139, 92, 246, 0.03));
}

.story-node.output {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.03));
}

.story-node-label {
  font-size: 11px;
  color: var(--text-tertiary);
}

.story-node-text {
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 600;
  line-height: 1.45;
}

.story-arrow {
  font-size: 18px;
  color: var(--text-tertiary);
  font-weight: 700;
}

.storyboard-watch {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.storyboard-jump {
  align-self: flex-start;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.storyboard-jump:hover {
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.flow-diagram {
  position: relative;
  padding: var(--spacing-6) 0;
}

.flow-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.flow-node {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: var(--spacing-6) var(--spacing-4);
  border-radius: var(--border-radius-md);
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all 0.25s ease;
}

.flow-node:hover,
.flow-node.active {
  background: var(--gradient-primary);
  border-color: transparent;
  transform: translateY(-2px);
}

.flow-node:hover .node-title,
.flow-node.active .node-title,
.flow-node:hover .node-subtitle,
.flow-node.active .node-subtitle {
  color: white;
}

.flow-node:hover .node-icon,
.flow-node.active .node-icon {
  background: rgba(255,255,255,0.2);
}

.node-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-primary);
  color: var(--color-primary);
  transition: all 0.25s ease;
}

.node-icon svg {
  width: 24px;
  height: 24px;
}

.node-icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.node-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
}

.node-subtitle {
  font-size: 12px;
  color: var(--text-tertiary);
  text-align: center;
}

.flow-arrows {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  transform: translateY(-50%);
  z-index: 0;
  padding: 0 12%;
}

.flow-arrow {
  width: 24px;
  height: 24px;
  color: var(--color-secondary);
}

.flow-arrow svg {
  width: 100%;
  height: 100%;
}

.flow-detail {
  margin-top: 20px;
  padding: var(--spacing-5);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-primary);
}

.flow-detail h4 {
  margin: 0 0 var(--spacing-2) 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.flow-detail p {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}

@media (max-width: 1100px) {
  .onboarding-grid,
  .storyboard-grid,
  .glossary-grid {
    grid-template-columns: 1fr;
  }

  .storyboard-strip {
    grid-template-columns: 1fr;
  }

  .story-arrow {
    transform: rotate(90deg);
    justify-self: center;
  }
}

@media (max-width: 768px) {
  .reading-step {
    padding: var(--spacing-3);
  }

  .io-map {
    padding: var(--spacing-3);
  }

  .flow-row {
    flex-direction: column;
  }

  .flow-arrows {
    display: none;
  }
}
</style>
