<template>
  <figure class="publication-figure-shell" role="img" :aria-label="computedAriaLabel">
    <header class="shell-header">
      <div class="shell-heading">
        <span class="shell-kicker">{{ figureLabel }}</span>
        <p v-if="summary" class="shell-summary">{{ summary }}</p>
      </div>
      <div v-if="normalizedChips.length" class="shell-chip-row">
        <span v-for="chip in normalizedChips" :key="chip" class="shell-chip">{{ chip }}</span>
      </div>
    </header>

    <figcaption class="shell-caption">{{ caption }}</figcaption>

    <div class="shell-body">
      <slot />
    </div>

    <footer v-if="note" class="shell-footer">
      <p>{{ note }}</p>
    </footer>
  </figure>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  figureLabel: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  chips: {
    type: Array,
    default: () => []
  },
  note: {
    type: String,
    default: ''
  },
  ariaLabel: {
    type: String,
    default: ''
  }
})

const normalizedChips = computed(() => props.chips.filter(Boolean).map((chip) => String(chip)))
const computedAriaLabel = computed(() => props.ariaLabel || `${props.figureLabel}. ${props.caption}`)
</script>

<style scoped>
.publication-figure-shell {
  margin: 20px 0;
  padding: 20px 22px 18px;
  border: 1px solid #d7d0c3;
  border-radius: 20px;
  background:
    radial-gradient(circle at top left, rgba(195, 138, 45, 0.08), transparent 28%),
    radial-gradient(circle at top right, rgba(37, 95, 133, 0.08), transparent 30%),
    #fffdfa;
  box-shadow: 0 18px 42px rgba(29, 39, 51, 0.08);
  display: grid;
  gap: 14px;
}

.shell-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid rgba(215, 208, 195, 0.82);
  padding-bottom: 12px;
}

.shell-heading {
  display: grid;
  gap: 6px;
}

.shell-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: "Source Han Sans SC", "Noto Sans SC", "Aptos", "Segoe UI", Arial, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8a3b4b;
}

.shell-kicker::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, #255f85, #c38a2d);
  box-shadow: 0 0 0 3px rgba(37, 95, 133, 0.1);
}

.shell-summary {
  margin: 0;
  max-width: 760px;
  color: #576576;
  font-size: 13px;
  line-height: 1.7;
}

.shell-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.shell-chip {
  border: 1px solid rgba(195, 138, 45, 0.28);
  border-radius: 999px;
  background: rgba(255, 251, 245, 0.92);
  color: #255f85;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

.shell-caption {
  margin: 0;
  color: #1d2733;
  font-size: 12px;
  line-height: 1.8;
  font-family: "Source Han Serif SC", "Noto Serif SC", "Palatino Linotype", "Times New Roman", serif;
}

.shell-body {
  display: block;
}

.shell-footer {
  border-top: 1px solid rgba(215, 208, 195, 0.82);
  padding-top: 10px;
}

.shell-footer p {
  margin: 0;
  color: #607081;
  font-size: 11px;
  line-height: 1.7;
}

@media (max-width: 900px) {
  .shell-header {
    flex-direction: column;
  }

  .shell-chip-row {
    justify-content: flex-start;
  }
}
</style>
