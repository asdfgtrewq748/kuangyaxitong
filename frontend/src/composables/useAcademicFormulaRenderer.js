import { reactive } from 'vue'

const createRenderedFormulaState = () => ({
  rsi: {},
  bri: {},
  asi: {},
  dbn: {}
})

export const useAcademicFormulaRenderer = ({ formulas }) => {
  let katex = null
  const renderedFormulas = reactive(createRenderedFormulaState())

  const renderFormula = (formula) => {
    if (!katex) return formula
    try {
      return katex.renderToString(formula, {
        throwOnError: false,
        displayMode: true,
        output: 'html',
        strict: false
      })
    } catch {
      return formula
    }
  }

  const renderAllFormulas = async () => {
    try {
      const katexModule = await import('katex')
      katex = katexModule.default || katexModule
      await import('katex/dist/katex.min.css')
    } catch (error) {
      console.error('KaTeX load failed:', error)
      return
    }

    Object.keys(formulas).forEach((algo) => {
      Object.keys(formulas[algo]).forEach((key) => {
        renderedFormulas[algo][key] = renderFormula(formulas[algo][key])
      })
    })
  }

  return {
    renderedFormulas,
    renderAllFormulas
  }
}
