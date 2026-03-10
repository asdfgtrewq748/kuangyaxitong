<template>
  <figure class="nature-chart-container-ultra" :style="containerStyle">
    <div class="paper-grain" aria-hidden="true"></div>

    <header class="chart-header">
      <div class="header-main">
        <div class="eyebrow-row">
          <span v-if="panelLabel" class="panel-label">{{ panelLabel }}</span>
          <span v-if="icon" class="figure-icon">{{ icon }}</span>
          <span v-if="subtitle" class="chart-subtitle">{{ subtitle }}</span>
        </div>

        <h3 class="chart-title">{{ title }}</h3>
        <p v-if="story" class="chart-story">{{ story }}</p>
      </div>

      <div v-if="$slots.actions" class="header-actions">
        <slot name="actions"></slot>
      </div>
    </header>

    <div v-if="normalizedHighlights.length" class="highlights-row">
      <div
        v-for="(item, index) in normalizedHighlights"
        :key="`${item.label}-${index}`"
        class="highlight-chip"
        :class="item.tone ? `tone-${item.tone}` : ''"
      >
        <span v-if="item.icon" class="highlight-icon">{{ item.icon }}</span>
        <span class="highlight-label">{{ item.label }}</span>
        <strong v-if="item.value" class="highlight-value">{{ item.value }}</strong>
      </div>
    </div>

    <div class="chart-body-shell">
      <div class="chart-body" :style="bodyStyle">
        <slot></slot>
      </div>

      <div class="axis-labels">
        <span v-if="xAxisLabel" class="x-label">{{ xAxisLabel }}</span>
        <span v-if="yAxisLabel" class="y-label">{{ yAxisLabel }}</span>
      </div>
    </div>

    <footer v-if="caption || footnote || note" class="chart-footer">
      <p v-if="caption" class="chart-caption">{{ caption }}</p>
      <p v-if="footnote" class="chart-footnote">{{ footnote }}</p>
      <p v-if="note" class="chart-note">{{ note }}</p>
    </footer>
  </figure>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  panelLabel: String,
  title: { type: String, required: true },
  subtitle: String,
  story: String,
  caption: String,
  xAxisLabel: String,
  yAxisLabel: String,
  footnote: String,
  note: String,
  icon: String,
  highlights: {
    type: Array,
    default: () => []
  },
  width: { type: String, default: 'full' },
  height: { type: String, default: '200px' }
})

const normalizedHighlights = computed(() =>
  (props.highlights || [])
    .map((item) => {
      if (typeof item === 'string') {
        return { label: item, value: '', tone: '', icon: '' }
      }

      return {
        label: item?.label || '',
        value: item?.value || '',
        tone: item?.tone || '',
        icon: item?.icon || ''
      }
    })
    .filter((item) => item.label)
)

const containerStyle = computed(() => ({
  width: props.width === 'full' ? '100%' : props.width,
  '--chart-height': props.height
}))

const bodyStyle = computed(() => ({
  height: props.height
}))
</script>

<style scoped>
.nature-chart-container-ultra {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 20px 16px;
  background:
    radial-gradient(circle at top left, rgba(174, 84, 34, 0.08), transparent 34%),
    linear-gradient(180deg, #fffef9 0%, #fffdf6 100%);
  border: 1px solid rgba(108, 84, 54, 0.16);
  border-radius: 20px;
  box-shadow:
    0 20px 40px rgba(83, 59, 32, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  overflow: hidden;
}

.paper-grain {
  position: absolute;
  inset: 0;
  opacity: 0.28;
  background-image:
    linear-gradient(rgba(112, 90, 62, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(112, 90, 62, 0.03) 1px, transparent 1px);
  background-size: 18px 18px;
  pointer-events: none;
}

.chart-header,
.highlights-row,
.chart-body-shell,
.chart-footer {
  position: relative;
  z-index: 1;
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.eyebrow-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.panel-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 9px;
  background: #1d1a17;
  color: #fffdf7;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.figure-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid rgba(141, 96, 47, 0.2);
  background: rgba(187, 138, 88, 0.1);
  color: #815225;
  font-size: 14px;
}

.chart-subtitle {
  font-size: 10px;
  font-weight: 700;
  color: #8b6b46;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.chart-title {
  margin: 0;
  color: #221b12;
  font-size: 18px;
  line-height: 1.15;
  font-weight: 700;
  font-family: "Source Han Serif SC", "Noto Serif SC", "Times New Roman", serif;
}

.chart-story {
  margin: 0;
  max-width: 68ch;
  color: #594733;
  font-size: 12px;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.highlights-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.highlight-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(113, 88, 57, 0.16);
  background: rgba(255, 255, 255, 0.72);
  color: #4f3d2a;
  backdrop-filter: blur(8px);
}

.highlight-chip.tone-alert {
  border-color: rgba(170, 58, 44, 0.22);
  background: rgba(170, 58, 44, 0.08);
  color: #8d332a;
}

.highlight-chip.tone-positive {
  border-color: rgba(50, 117, 76, 0.22);
  background: rgba(50, 117, 76, 0.08);
  color: #25573a;
}

.highlight-chip.tone-focus {
  border-color: rgba(137, 92, 38, 0.22);
  background: rgba(137, 92, 38, 0.08);
  color: #77491b;
}

.highlight-icon {
  font-size: 13px;
  line-height: 1;
}

.highlight-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.highlight-value {
  font-size: 12px;
  font-weight: 700;
  font-family: "Source Han Sans SC", "Segoe UI", sans-serif;
}

.chart-body-shell {
  position: relative;
  padding-left: 20px;
}

.chart-body {
  position: relative;
  min-height: 160px;
  border-radius: 16px;
  border: 1px solid rgba(122, 99, 74, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 252, 244, 0.92));
  overflow: hidden;
}

.axis-labels {
  position: relative;
  min-height: 26px;
  margin-top: 8px;
}

.x-label,
.y-label {
  font-size: 10px;
  font-weight: 700;
  color: #80664a;
  text-transform: uppercase;
  letter-spacing: 0.13em;
}

.x-label {
  position: absolute;
  right: 4px;
  bottom: 0;
}

.y-label {
  position: absolute;
  left: -18px;
  top: -54px;
  transform: rotate(-90deg);
  transform-origin: left center;
  white-space: nowrap;
}

.chart-footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 12px;
  border-top: 1px solid rgba(115, 90, 61, 0.14);
}

.chart-caption,
.chart-footnote,
.chart-note {
  margin: 0;
  color: #5a4630;
  font-size: 11px;
  line-height: 1.6;
}

.chart-caption {
  font-weight: 600;
  color: #3f2f1e;
}

.chart-footnote {
  font-family: "Source Han Serif SC", "Noto Serif SC", "Times New Roman", serif;
}

.chart-note {
  color: #7b6247;
}

@media (max-width: 768px) {
  .nature-chart-container-ultra {
    padding: 16px;
    border-radius: 18px;
  }

  .chart-header {
    flex-direction: column;
  }

  .chart-body-shell {
    padding-left: 0;
  }

  .y-label {
    position: static;
    display: inline-block;
    margin-bottom: 8px;
    transform: none;
  }

  .axis-labels {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: auto;
  }

  .x-label {
    position: static;
  }
}
</style>
