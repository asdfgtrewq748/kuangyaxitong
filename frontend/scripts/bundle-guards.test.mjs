import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const filesToCheck = [
  'src/components/GeomodelViewer.vue',
  'src/components/GeoMpiFusion3D.vue',
  'src/components/Scene3DViewer.vue'
]

const pressureProcessorImportTargets = [
  'src/views/PressureAnalysisUltra.vue'
]

const asyncFusionViewTargets = [
  'src/views/AlgorithmValidation.vue',
  'src/views/FusionPreview.vue'
]

const geoFusionComponent = 'src/components/GeoMpiFusion3D.vue'
const fusionPreviewView = 'src/views/FusionPreview.vue'
const chartCenterView = 'src/views/PressureAnalysisCharts.vue'
const validationFiguresView = 'src/views/AlgorithmValidationFigures.vue'
const validationScienceFigures = 'src/components/validation/ValidationScienceFigures.vue'

describe('bundle guards', () => {
  it('avoids whole-package dynamic imports for three', () => {
    const offenders = filesToCheck.filter((file) => {
      const content = fs.readFileSync(path.resolve(file), 'utf8')
      return content.includes("import('three')") || content.includes('import("three")')
    })

    expect(offenders).toEqual([])
  })

  it('routes three usage through local runtime entry modules', () => {
    const directThreeImports = filesToCheck.filter((file) => {
      const content = fs.readFileSync(path.resolve(file), 'utf8')
      return (
        content.includes("from 'three'") ||
        content.includes('from "three"') ||
        content.includes("from 'three/addons/controls/OrbitControls.js'") ||
        content.includes('from "three/addons/controls/OrbitControls.js"') ||
        content.includes("import('three/addons/controls/OrbitControls.js')") ||
        content.includes('import("three/addons/controls/OrbitControls.js")')
      )
    })

    expect(directThreeImports).toEqual([])
  })

  it('loads heavy fusion viewer asynchronously in route views', () => {
    const staticImports = asyncFusionViewTargets.filter((file) => {
      const content = fs.readFileSync(path.resolve(file), 'utf8')
      return content.includes("import GeoMpiFusion3D from '../components/GeoMpiFusion3D.vue'")
        || content.includes('import GeoMpiFusion3D from "../components/GeoMpiFusion3D.vue"')
    })

    expect(staticImports).toEqual([])
  })

  it('gates heavy fusion viewer mounting behind an activation flag', () => {
    const ungatedViews = asyncFusionViewTargets.filter((file) => {
      const content = fs.readFileSync(path.resolve(file), 'utf8')
      return !content.includes('fusionSceneRequested')
    })

    expect(ungatedViews).toEqual([])
  })

  it('loads fusion export implementation on demand', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(
      content.includes("import('../utils/geoFusionExport.js')") ||
      content.includes('import("../utils/geoFusionExport.js")')
    ).toBe(true)
  })

  it('pauses fusion render loop when the scene is hidden', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(
      content.includes('document.visibilityState') ||
      content.includes('IntersectionObserver')
    ).toBe(true)
  })

  it('prefetches fusion component code without auto-mounting the scene', () => {
    const content = fs.readFileSync(path.resolve(fusionPreviewView), 'utf8')

    expect(content.includes('prefetchFusionScene')).toBe(true)
  })

  it('renders the fusion scene on demand instead of relying on a perpetual loop', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('markSceneDirty')).toBe(true)
    expect(content.includes("controls.addEventListener('change'")).toBe(true)
  })

  it('keeps paper-style diagnostics and depth stratigraphy overlays in the fusion figure', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('diagnosticBadges')).toBe(true)
    expect(content.includes('depthAxisTicks')).toBe(true)
    expect(content.includes('depth-strip-wrap')).toBe(true)
  })

  it('includes a section transect panel with an uncertainty band in the fusion diagnostics', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('sectionProfilePath')).toBe(true)
    expect(content.includes('sectionUncertaintyBandPath')).toBe(true)
    expect(content.includes('section-profile-wrap')).toBe(true)
  })

  it('adds publication-style subfigure labels and provenance rows to the fusion figure', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('subfigure-label')).toBe(true)
    expect(content.includes('methodProvenanceRows')).toBe(true)
    expect(content.includes('methods-panel')).toBe(true)
  })

  it('uses a structured publication caption layout with notes and abbreviations', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('publicationCaptionRows')).toBe(true)
    expect(content.includes('publicationNoteRows')).toBe(true)
    expect(content.includes('caption-grid')).toBe(true)
  })

  it('passes structured publication rows into the export snapshot for figure parity', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('publicationCaptionRows: publicationCaptionRows.value')).toBe(true)
    expect(content.includes('publicationNoteRows: publicationNoteRows.value')).toBe(true)
    expect(content.includes('methodProvenanceRows: methodProvenanceRows.value')).toBe(true)
  })

  it('passes subfigure diagnostics into the export snapshot for publication-style parity', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('insetHeatmapCells: insetHeatmapCells.value')).toBe(true)
    expect(content.includes('sectionProfile: sectionProfileDiagnostics.value')).toBe(true)
    expect(content.includes('depthGuide: {')).toBe(true)
    expect(content.includes('subfigureLabels: {')).toBe(true)
  })

  it('renders labeled inset, section, and depth guide panels in the export figure', () => {
    const content = fs.readFileSync(path.resolve('src/utils/geoFusionExport.js'), 'utf8')

    expect(content.includes("fillText('a'")).toBe(true)
    expect(content.includes("fillText('b'")).toBe(true)
    expect(content.includes("fillText('c'")).toBe(true)
    expect(content.includes("fillText('d'")).toBe(true)
    expect(content.includes('Plan-view MPI inset')).toBe(true)
    expect(content.includes('Section transect')).toBe(true)
    expect(content.includes('Stratigraphic depth guide')).toBe(true)
  })

  it('centralizes publication notation for units, quantiles, and abbreviations', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(
      content.includes('const paperNotation = computed(() => ({') ||
      content.includes('const paperNotation = computed(() => {')
    ).toBe(true)
    expect(content.includes("densityUnit: 'boreholes km^-2'")).toBe(true)
    expect(content.includes("sampleSizeLabel: `n = ${mpiSummary.value.count || 0}`")).toBe(true)
    expect(content.includes("Q1/Q2/Q3, 25th/50th/75th percentiles")).toBe(true)
  })

  it('passes a normalized figure heading and caption title into the export snapshot', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('figureHeading: paperNotation.value.figureHeading')).toBe(true)
    expect(content.includes('captionTitle: paperNotation.value.captionTitle')).toBe(true)
  })

  it('renders a dedicated figure heading band in the export layout', () => {
    const content = fs.readFileSync(path.resolve('src/utils/geoFusionExport.js'), 'utf8')

    expect(content.includes('const headingBandH =')).toBe(true)
    expect(content.includes('snapshot.figureHeading')).toBe(true)
    expect(content.includes('snapshot.captionTitle')).toBe(true)
  })

  it('passes concise figure summary and methods footer into the export snapshot', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('summaryLead: paperNotation.value.summaryLead')).toBe(true)
    expect(content.includes('methodsFooter: paperNotation.value.methodsFooter')).toBe(true)
  })

  it('renders a concise summary block and methods footer in the export layout', () => {
    const content = fs.readFileSync(path.resolve('src/utils/geoFusionExport.js'), 'utf8')

    expect(content.includes('snapshot.summaryLead')).toBe(true)
    expect(content.includes('snapshot.methodsFooter')).toBe(true)
    expect(content.includes('Methods footer')).toBe(true)
  })

  it('uses publication framing on the pressure chart center page', () => {
    const content = fs.readFileSync(path.resolve(chartCenterView), 'utf8')

    expect(
      content.includes('const paperFrame = computed(() => ({') ||
      content.includes('const paperFrame = computed(() => {')
    ).toBe(true)
    expect(content.includes('figure-heading-band')).toBe(true)
    expect(content.includes('publication-summary-card')).toBe(true)
    expect(content.includes('methods-footer')).toBe(true)
  })

  it('centralizes figure metadata for active pressure chart captions and exports', () => {
    const content = fs.readFileSync(path.resolve(chartCenterView), 'utf8')

    expect(
      content.includes('const chartPaperMeta = computed(() => ({') ||
      content.includes('const chartPaperMeta = computed(() => {')
    ).toBe(true)
    expect(content.includes('const activeFigureMeta = computed(() =>')).toBe(true)
    expect(content.includes('active-figure-caption')).toBe(true)
    expect(content.includes('title: meta.figureTitle')).toBe(true)
    expect(content.includes('caption: meta.figureCaption')).toBe(true)
  })

  it('uses publication framing on the validation figures page', () => {
    const content = fs.readFileSync(path.resolve(validationFiguresView), 'utf8')

    expect(
      content.includes('const paperFrame = computed(() => ({') ||
      content.includes('const paperFrame = computed(() => {')
    ).toBe(true)
    expect(content.includes('figure-heading-band')).toBe(true)
    expect(content.includes('publication-summary-card')).toBe(true)
    expect(content.includes('methods-footer')).toBe(true)
  })

  it('centralizes validation figure metadata with publication caption sections', () => {
    const content = fs.readFileSync(path.resolve(validationScienceFigures), 'utf8')

    expect(
      content.includes('const validationNotation = computed(() => ({') ||
      content.includes('const validationNotation = computed(() => {')
    ).toBe(true)
    expect(
      content.includes('const figureCards = computed(() => ([') ||
      content.includes('const figureCards = computed(() => {')
    ).toBe(true)
    expect(content.includes('figure-caption-block')).toBe(true)
    expect(content.includes('caption-label')).toBe(true)
    expect(content.includes('caption-note-row')).toBe(true)
  })

  it('avoids dynamic imports for pressureDataProcessor where static imports already exist', () => {
    const offenders = pressureProcessorImportTargets.filter((file) => {
      const content = fs.readFileSync(path.resolve(file), 'utf8')
      return content.includes("import('@/utils/pressureDataProcessor')") ||
        content.includes('import("@/utils/pressureDataProcessor")')
    })

    expect(offenders).toEqual([])
  })
})
