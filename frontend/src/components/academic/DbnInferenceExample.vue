<template>
  <div class="inference-example">
    <div class="evidence-panel">
      <h5>{{ aa('evidenceTitle') }}</h5>
      <div class="evidence-items">
        <label class="evidence-item">
          <span>{{ aa('evidence.seismic') }}</span>
          <input type="checkbox" :checked="modelValue.seismic" @change="onToggle('seismic', $event.target.checked)"/>
        </label>
        <label class="evidence-item">
          <span>{{ aa('evidence.rsiLow') }}</span>
          <input type="checkbox" :checked="modelValue.rsiLow" @change="onToggle('rsiLow', $event.target.checked)"/>
        </label>
        <label class="evidence-item">
          <span>{{ aa('evidence.briLow') }}</span>
          <input type="checkbox" :checked="modelValue.briLow" @change="onToggle('briLow', $event.target.checked)"/>
        </label>
        <label class="evidence-item">
          <span>{{ aa('evidence.asiLow') }}</span>
          <input type="checkbox" :checked="modelValue.asiLow" @change="onToggle('asiLow', $event.target.checked)"/>
        </label>
      </div>
    </div>

    <div class="posterior-panel">
      <h5>{{ aa('posteriorTitle') }}</h5>
      <div class="prob-bars">
        <div class="prob-bar-item" v-for="(prob, level) in posteriorProbs" :key="level">
          <span class="prob-label">{{ aa(`risk.${level}`) }}</span>
          <div class="prob-bar-track">
            <div class="prob-bar-fill" :style="{ width: `${prob}%`, background: probColor(prob) }"></div>
          </div>
          <span class="prob-value">{{ Number(prob).toFixed(1) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  aa: {
    type: Function,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  },
  posteriorProbs: {
    type: Object,
    required: true
  },
  probColor: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const onToggle = (key, checked) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: checked
  })
}
</script>

<style scoped>
.inference-example {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-top: 20px;
}

.evidence-panel,
.posterior-panel {
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-6);
  border: 1px solid var(--border-color);
}

.evidence-panel h5,
.posterior-panel h5 {
  margin: 0 0 var(--spacing-4) 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.evidence-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.evidence-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.evidence-item:hover {
  background: var(--bg-tertiary);
}

.evidence-item span {
  font-size: 14px;
  color: var(--text-secondary);
}

.evidence-item input {
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
}

.prob-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prob-bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.prob-label {
  width: 60px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.prob-bar-track {
  flex: 1;
  height: 24px;
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
}

.prob-bar-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.5s ease;
}

.prob-value {
  width: 50px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: right;
}

@media (max-width: 1100px) {
  .inference-example {
    grid-template-columns: 1fr;
  }
}
</style>
