<template>
  <!-- Quick Start Tips (Collapsible) -->
  <section class="card quickstart-card">
    <div class="section-header clickable" @click="quickstartExpanded = !quickstartExpanded">
      <h2>{{ aa('quickstartTitle') }}</h2>
      <span class="expand-icon" :class="{ expanded: quickstartExpanded }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </span>
    </div>
    <transition name="collapse">
      <div v-show="quickstartExpanded" class="quickstart-content">
        <p class="quickstart-intro">{{ aa('quickstartIntro') }}</p>
        <div class="quickstart-tips">
          <div v-for="(tip, idx) in quickTips" :key="idx" class="quickstart-tip">
            <span class="tip-icon">{{ tip.icon }}</span>
            <div class="tip-body">
              <strong>{{ aa(tip.titleKey) }}</strong>
              <p>{{ aa(tip.descKey) }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>

  <!-- Interactive Algorithm Flow -->
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
          :class="{ active: activeFlowNode === idx, visited: visitedNodes.has(idx) }"
          @click="setFlowNode(idx)"
          @mouseenter="setFlowNode(idx)"
        >
          <div class="node-ring"></div>
          <div class="node-icon" v-html="node.icon"></div>
          <div class="node-title">{{ aa(node.titleKey) }}</div>
          <div class="node-subtitle">{{ aa(node.subtitleKey) }}</div>
        </div>
      </div>
      <div class="flow-connections">
        <svg class="flow-svg" viewBox="0 0 800 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" :style="{ stopColor: visitedNodes.has(0) ? 'var(--color-primary)' : '#cbd5e1' }"/>
              <stop offset="100%" :style="{ stopColor: visitedNodes.has(3) ? 'var(--color-primary)' : '#cbd5e1' }"/>
            </linearGradient>
          </defs>
          <path
            v-for="i in 3"
            :key="`path-${i}`"
            class="flow-path"
            :class="{ active: visitedNodes.has(i) }"
            :d="`M ${i * 200 + 80} 30 L ${(i + 1) * 200 - 80} 30`"
          />
          <circle
            v-for="i in 4"
            :key="`dot-${i}`"
            :cx="i * 200"
            cy="30"
            r="6"
            class="flow-dot"
            :class="{ active: visitedNodes.has(i - 1) }"
          />
        </svg>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="flow-detail" v-if="activeNode" :key="activeFlowNode">
        <div class="detail-header">
          <span class="detail-badge">{{ aa('flowStep') }} {{ activeFlowNode + 1 }}</span>
          <h4>{{ aa(activeNode.detailTitleKey) }}</h4>
        </div>
        <p>{{ aa(activeNode.detailKey) }}</p>
        <div class="detail-actions">
          <button v-if="activeFlowNode > 0" class="btn-link" @click="setFlowNode(activeFlowNode - 1)">
            ← {{ aa('flowPrev') }}
          </button>
          <button v-if="activeFlowNode < flowNodes.length - 1" class="btn-link primary" @click="setFlowNode(activeFlowNode + 1)">
            {{ aa('flowNext') }} →
          </button>
        </div>
      </div>
    </transition>
  </section>

  <!-- Algorithm Storyboards (Compact) -->
  <section class="card storyboard-card">
    <div class="section-header">
      <h2>{{ aa('storyboardTitle') }}</h2>
      <p>{{ aa('storyboardDesc') }}</p>
    </div>
    <div class="storyboard-grid">
      <article
        class="storyboard-item"
        v-for="item in algorithmStoryboards"
        :key="item.key"
        @click="emit('update:active-algo', item.key)"
      >
        <div class="storyboard-icon">{{ item.icon }}</div>
        <div class="storyboard-content">
          <div class="storyboard-head">
            <span class="storyboard-tag">{{ item.tag }}</span>
            <h3>{{ aa(item.nameKey) }}</h3>
          </div>
          <div class="storyboard-flow">
            <span class="flow-badge input">{{ aa('storyNodeInput') }}</span>
            <span class="flow-arrow">→</span>
            <span class="flow-badge process">{{ aa('storyNodeProcess') }}</span>
            <span class="flow-arrow">→</span>
            <span class="flow-badge output">{{ aa('storyNodeOutput') }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>

  <!-- Glossary (Compact Pills) -->
  <section class="card glossary-card">
    <div class="section-header clickable" @click="glossaryExpanded = !glossaryExpanded">
      <h2>{{ aa('glossaryTitle') }}</h2>
      <span class="expand-icon" :class="{ expanded: glossaryExpanded }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </span>
    </div>
    <transition name="collapse">
      <div v-show="glossaryExpanded" class="glossary-pills">
        <div
          v-for="item in termGlossary"
          :key="item.termKey"
          class="glossary-pill"
          :title="aa(item.cueKey)"
        >
          <span class="pill-term">{{ aa(item.termKey) }}</span>
          <span class="pill-hint">{{ aa(item.plainKey) }}</span>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

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

const quickstartExpanded = ref(false)
const glossaryExpanded = ref(false)
const visitedNodes = ref(new Set([0]))

const activeNode = computed(() => props.flowNodes[props.activeFlowNode])

const quickTips = [
  { icon: '📖', titleKey: 'quickTip1Title', descKey: 'quickTip1Desc' },
  { icon: '🔄', titleKey: 'quickTip2Title', descKey: 'quickTip2Desc' },
  { icon: '🎯', titleKey: 'quickTip3Title', descKey: 'quickTip3Desc' }
]

const setFlowNode = (idx) => {
  emit('update:active-flow-node', idx)
  visitedNodes.value.add(idx)
}

// Auto-advance flow for first-time visitors
watch(() => props.activeFlowNode, (newIdx) => {
  visitedNodes.value.add(newIdx)
})
</script>

<style scoped>
.section-header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-header.clickable {
  cursor: pointer;
  user-select: none;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.section-header p {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.expand-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: transform 0.2s ease;
}

.expand-icon svg {
  width: 18px;
  height: 18px;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* Quick Start Card */
.quickstart-card {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.04) 0%, rgba(14, 165, 233, 0.01) 100%);
}

.quickstart-content {
  padding-top: 4px;
}

.quickstart-intro {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
}

.quickstart-tips {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.quickstart-tip {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
}

.tip-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.tip-body strong {
  display: block;
  font-size: 13px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.tip-body p {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Flow Diagram */
.flow-diagram {
  position: relative;
  padding: 40px 0;
}

.flow-row {
  display: flex;
  justify-content: center;
  gap: 40px;
  position: relative;
  z-index: 1;
}

.flow-node {
  flex: 0 0 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 12px;
  border-radius: 16px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
}

.node-ring {
  position: absolute;
  inset: -4px;
  border-radius: 18px;
  border: 2px solid transparent;
  transition: border-color 0.25s ease;
}

.flow-node.visited .node-ring {
  border-color: var(--color-primary);
}

.flow-node:hover,
.flow-node.active {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.15);
}

.flow-node.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

.flow-node.active .node-title,
.flow-node.active .node-subtitle {
  color: white;
}

.flow-node.active .node-icon {
  background: rgba(255,255,255,0.2);
  color: white;
}

.node-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--bg-primary);
  color: var(--color-primary);
  transition: all 0.25s ease;
}

.node-icon svg {
  width: 24px;
  height: 24px;
}

.node-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
}

.node-subtitle {
  font-size: 11px;
  color: var(--text-tertiary);
  text-align: center;
}

.flow-connections {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 180px);
  z-index: 0;
}

.flow-svg {
  width: 100%;
  height: 60px;
}

.flow-path {
  fill: none;
  stroke: #cbd5e1;
  stroke-width: 2;
  stroke-dasharray: 8 4;
  transition: stroke 0.3s ease;
}

.flow-path.active {
  stroke: var(--color-primary);
  stroke-dasharray: 0;
  animation: flowPulse 1.5s ease-in-out infinite;
}

@keyframes flowPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.flow-dot {
  fill: #cbd5e1;
  transition: fill 0.3s ease;
}

.flow-dot.active {
  fill: var(--color-primary);
}

.flow-detail {
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(14, 165, 233, 0.02) 100%);
  border-radius: 12px;
  border-left: 4px solid var(--color-primary);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.detail-badge {
  padding: 4px 10px;
  border-radius: 20px;
  background: var(--color-primary);
  color: white;
  font-size: 11px;
  font-weight: 600;
}

.flow-detail h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.flow-detail p {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.detail-actions {
  display: flex;
  gap: 12px;
}

.btn-link {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-link:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-link.primary {
  color: var(--color-primary);
}

.btn-link.primary:hover {
  background: rgba(14, 165, 233, 0.1);
}

/* Storyboard */
.storyboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.storyboard-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.storyboard-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
  transform: translateY(-2px);
}

.storyboard-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: var(--bg-primary);
  border-radius: 10px;
  flex-shrink: 0;
}

.storyboard-content {
  flex: 1;
  min-width: 0;
}

.storyboard-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.storyboard-tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.storyboard-head h3 {
  margin: 0;
  font-size: 14px;
  color: var(--text-primary);
}

.storyboard-flow {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.flow-badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
}

.flow-badge.input {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(14, 165, 233, 0.05));
  color: #0369a1;
}

.flow-badge.process {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05));
  color: #7c3aed;
}

.flow-badge.output {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05));
  color: #16a34a;
}

.flow-arrow {
  color: var(--text-tertiary);
  font-size: 12px;
}

/* Glossary */
.glossary-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 4px;
}

.glossary-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  cursor: help;
  transition: all 0.2s ease;
}

.glossary-pill:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.pill-term {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.pill-hint {
  font-size: 11px;
  color: var(--text-secondary);
}

/* Transitions */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px;
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Responsive */
@media (max-width: 1100px) {
  .quickstart-tips,
  .storyboard-grid {
    grid-template-columns: 1fr;
  }

  .flow-row {
    flex-wrap: wrap;
    gap: 20px;
  }

  .flow-node {
    flex: 0 0 calc(50% - 10px);
  }

  .flow-connections {
    display: none;
  }
}

@media (max-width: 768px) {
  .flow-node {
    flex: 0 0 100%;
  }

  .quickstart-tip {
    flex-direction: column;
    align-items: flex-start;
  }

  .storyboard-item {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media print {
  .section-header.clickable {
    pointer-events: none;
  }

  .expand-icon {
    display: none;
  }

  .flow-connections {
    display: none;
  }
}
</style>
