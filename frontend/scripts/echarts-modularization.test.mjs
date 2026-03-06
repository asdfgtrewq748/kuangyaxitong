import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const pressureFiles = [
  'src/components/pressure/UncertaintyVisualization.vue',
  'src/components/pressure/charts/AnomalyHeatmap.vue',
  'src/components/pressure/charts/PressureBoxPlot.vue',
  'src/components/pressure/charts/PressureCDF.vue',
  'src/components/pressure/charts/PressureColumnCompare.vue',
  'src/components/pressure/charts/PressureColumnCompareUltra.vue',
  'src/components/pressure/charts/PressureContour.vue',
  'src/components/pressure/charts/PressureCorrelation.vue',
  'src/components/pressure/charts/PressureCorrelationUltra.vue',
  'src/components/pressure/charts/PressureCycleDetect.vue',
  'src/components/pressure/charts/PressureCycleDetectUltra.vue',
  'src/components/pressure/charts/PressureDensity.vue',
  'src/components/pressure/charts/PressureHistogram.vue',
  'src/components/pressure/charts/PressureHistogramUltra.vue',
  'src/components/pressure/charts/PressureRadar.vue',
  'src/components/pressure/charts/PressureScatterMatrix.vue',
  'src/components/pressure/charts/PressureSpatialDist.vue',
  'src/components/pressure/charts/PressureSpatialDistUltra.vue',
  'src/components/pressure/charts/PressureSpectral.vue',
  'src/components/pressure/charts/PressureTimeSeries.vue',
  'src/components/pressure/charts/PressureTimeSeriesUltra.vue'
]

const scienceFiles = [
  'src/components/validation/ScienceChart.vue',
  'src/composables/useAcademicAlgorithmCalculations.js'
]

describe('echarts runtime imports', () => {
  it('routes pressure charts to the pressure runtime entry', () => {
    const frontendRoot = path.resolve(import.meta.dirname, '..')

    for (const relativePath of pressureFiles) {
      const filePath = path.join(frontendRoot, relativePath)
      const source = fs.readFileSync(filePath, 'utf8')

      expect(source, relativePath).not.toMatch(/import\s+\*\s+as\s+echarts\s+from\s+['"]echarts['"]/)
      expect(source, relativePath).toMatch(/import\s+\{\s*echarts\s*\}\s+from\s+['"]@\/lib\/echarts-pressure['"]/)
    }
  })

  it('routes science charts to the science runtime entry', () => {
    const frontendRoot = path.resolve(import.meta.dirname, '..')

    for (const relativePath of scienceFiles) {
      const filePath = path.join(frontendRoot, relativePath)
      const source = fs.readFileSync(filePath, 'utf8')

      expect(source, relativePath).toMatch(/import\s+\{\s*echarts\s*\}\s+from\s+['"](\.\.\/)+lib\/echarts-science['"]|import\s+\{\s*echarts\s*\}\s+from\s+['"]\.\.\/lib\/echarts-science['"]|import\s+\{\s*echarts\s*\}\s+from\s+['"]\.\.\/\.\.\/lib\/echarts-science['"]/)
    }
  })
})
