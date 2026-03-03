<template>
  <span class="latex-formula" v-html="renderedFormula" :title="formula"></span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  formula: {
    type: String,
    required: true
  },
  display: {
    type: Boolean,
    default: false
  }
})

/**
 * 简化的LaTeX到HTML渲染
 * 支持基本的数学符号和公式
 */
const renderedFormula = computed(() => {
  let html = props.formula
  
  // 希腊字母
  const greekLetters = {
    '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ',
    '\\epsilon': 'ε', '\\zeta': 'ζ', '\\eta': 'η', '\\theta': 'θ',
    '\\iota': 'ι', '\\kappa': 'κ', '\\lambda': 'λ', '\\mu': 'μ',
    '\\nu': 'ν', '\\xi': 'ξ', '\\pi': 'π', '\\rho': 'ρ',
    '\\sigma': 'σ', '\\tau': 'τ', '\\upsilon': 'υ', '\\phi': 'φ',
    '\\chi': 'χ', '\\psi': 'ψ', '\\omega': 'ω',
    '\\Gamma': 'Γ', '\\Delta': 'Δ', '\\Theta': 'Θ', '\\Lambda': 'Λ',
    '\\Xi': 'Ξ', '\\Pi': 'Π', '\\Sigma': 'Σ', '\\Phi': 'Φ',
    '\\Psi': 'Ψ', '\\Omega': 'Ω'
  }
  
  Object.entries(greekLetters).forEach(([latex, char]) => {
    html = html.replace(new RegExp(latex, 'g'), char)
  })
  
  // 数学符号
  const symbols = {
    '\\pm': '±', '\\times': '×', '\\div': '÷', '\\cdot': '·',
    '\\leq': '≤', '\\geq': '≥', '\\neq': '≠', '\\approx': '≈',
    '\\infty': '∞', '\\partial': '∂', '\\nabla': '∇', '\\sum': 'Σ',
    '\\prod': 'Π', '\\int': '∫', '\\oint': '∮', '\\forall': '∀',
    '\\exists': '∃', '\\in': '∈', '\\subset': '⊂', '\\subseteq': '⊆',
    '\\cup': '∪', '\\cap': '∩', '\\emptyset': '∅', '\\rightarrow': '→',
    '\\leftarrow': '←', '\\Rightarrow': '⇒', '\\Leftarrow': '⇐',
    '\\sqrt': '√', '\\ldots': '...', '\\cdots': '⋯', '\\vdots': '⋮',
    '\\ddots': '⋱'
  }
  
  Object.entries(symbols).forEach(([latex, char]) => {
    html = html.replace(new RegExp(latex, 'g'), char)
  })
  
  // 上下标
  // ^{} 上标
  html = html.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
  html = html.replace(/\^([a-zA-Z0-9])/g, '<sup>$1</sup>')
  
  // _{} 下标
  html = html.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')
  html = html.replace(/_([a-zA-Z0-9])/g, '<sub>$1</sub>')
  
  // 分数 \frac{a}{b}
  html = html.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, 
    '<span class="frac"><sup>$1</sup><span class="frac-line"></span><sub>$2</sub></span>')
  
  // 根号 \sqrt{x}
  html = html.replace(/\\sqrt\{([^}]+)\}/g, '<span class="sqrt"><span class="sqrt-symbol">√</span><span class="sqrt-over">$1</span></span>')
  
  // 括号大小调整
  html = html.replace(/\\left\(/g, '(')
  html = html.replace(/\\right\)/g, ')')
  html = html.replace(/\\left\[/g, '[')
  html = html.replace(/\\right\]/g, ']')
  html = html.replace(/\\left\{/g, '{')
  html = html.replace(/\\right\}/g, '}')
  
  // 省略号
  html = html.replace(/\\dots/g, '...')
  
  // 空格
  html = html.replace(/\\,/g, ' ')
  html = html.replace(/\\;/g, '  ')
  html = html.replace(/\\quad/g, '    ')
  
  // 移除转义的空格
  html = html.replace(/\\ /g, ' ')
  
  // 如果显示模式，包装在display容器中
  if (props.display) {
    html = `<div class="latex-display">${html}</div>`
  }
  
  return html
})
</script>

<style scoped>
.latex-formula {
  font-family: 'Times New Roman', 'STIX Two Math', serif;
  font-style: italic;
}

/* 分数样式 */
:deep(.frac) {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  margin: 0 2px;
}

:deep(.frac sup),
:deep(.frac sub) {
  font-size: 0.75em;
  line-height: 1;
  padding: 0 2px;
}

:deep(.frac-line) {
  width: 100%;
  height: 1px;
  background: currentColor;
  margin: 2px 0;
}

/* 根号样式 */
:deep(.sqrt) {
  display: inline-flex;
  align-items: flex-start;
}

:deep(.sqrt-symbol) {
  font-size: 1.2em;
  margin-right: 1px;
}

:deep(.sqrt-over) {
  border-top: 1px solid currentColor;
  padding-top: 1px;
}

/* 上下标 */
:deep(sup),
:deep(sub) {
  font-size: 0.7em;
  line-height: 0;
}

/* 显示模式 */
:deep(.latex-display) {
  display: block;
  text-align: center;
  margin: 1em 0;
  font-size: 1.1em;
}
</style>
