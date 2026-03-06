import { describe, expect, it } from 'vitest'
import { analyzeVueSfc } from './audit-ui-clicks.mjs'

describe('analyzeVueSfc', () => {
  it('reports button without click handler when styled as interactive', () => {
    const source = `
<template>
  <button class="tool-btn">Export</button>
</template>
<script setup>
const noop = () => {}
</script>
`

    const findings = analyzeVueSfc('/tmp/TestButton.vue', source)
    expect(findings).toHaveLength(1)
    expect(findings[0].type).toBe('button-without-click')
  })

  it('reports missing click handler bindings', () => {
    const source = `
<template>
  <button class="tool-btn" @click="runExport">Export</button>
</template>
<script setup>
const ready = true
</script>
`

    const findings = analyzeVueSfc('/tmp/TestMissingHandler.vue', source)
    expect(findings).toHaveLength(1)
    expect(findings[0].type).toBe('missing-handler')
    expect(findings[0].detail).toContain('runExport')
  })

  it('avoids false positives for valid bindings and non-button tooltips', () => {
    const source = `
<template>
  <button v-if="step > 0" class="tool-btn" type="button" @click="goPrev">Prev</button>
  <span class="stat-tooltip" title="hint">i</span>
</template>
<script setup>
function goPrev() {}
</script>
`

    const findings = analyzeVueSfc('/tmp/TestClean.vue', source)
    expect(findings).toHaveLength(0)
  })
})
