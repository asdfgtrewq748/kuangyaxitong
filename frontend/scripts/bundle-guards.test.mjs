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
const uncertaintyAnalysisView = 'src/views/UncertaintyAnalysis.vue'
const zhLocaleFile = 'src/locales/zh-CN.js'
const enLocaleFile = 'src/locales/en-US.js'

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
    expect(content.includes('publicationLabels.fabric')).toBe(true)
    expect(content.includes('publicationLabels.hotspot')).toBe(true)
    expect(content.includes('publicationLabels.sampling')).toBe(true)
    expect(content.includes('publicationLabels.methodsPanel')).toBe(true)
    expect(content.includes('publicationLabels.depthGuideTitle')).toBe(true)
    expect(content.includes('publicationLabels.insetTitle')).toBe(true)
    expect(content.includes('publicationLabels.insetCaption')).toBe(true)
    expect(content.includes('publicationLabels.distributionTitle')).toBe(true)
    expect(content.includes('buildPublicationSectionProfileDiagnostics')).toBe(true)
    expect(content.includes('sectionProfileModeLabel')).toBe(true)
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
    expect(content.includes('publicationLabels.seam')).toBe(true)
    expect(content.includes('publicationLabels.fusion')).toBe(true)
    expect(content.includes('publicationLabels.resolution')).toBe(true)
    expect(content.includes('publicationLabels.stressPrior')).toBe(true)
    expect(content.includes('publicationLabels.section')).toBe(true)
    expect(content.includes('publicationLabels.control')).toBe(true)
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
    expect(content.includes('publicationLabels,')).toBe(true)
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
    expect(content.includes('snapshot.publicationLabels?.insetTitle')).toBe(true)
    expect(content.includes('snapshot.publicationLabels?.sectionTransectTitle')).toBe(true)
    expect(content.includes('snapshot.publicationLabels?.depthGuideTitle')).toBe(true)
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

  it('routes 3D fusion methods footer through the shared publication schema helper', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes("from '@/utils/paperExportSchema'")).toBe(true)
    expect(content.includes('buildPublicationMethodsFooter({')).toBe(true)
    expect(content.includes("methodsFooter: `Methods footer:")).toBe(false)
  })

  it('routes 3D fusion narrative text through the shared publication schema helper', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('buildPublicationNarrativeSentence')).toBe(true)
    expect(content.includes('const figureNarrative = computed(() => buildPublicationNarrativeSentence({')).toBe(true)
  })

  it('routes 3D fusion diagnostic summary lines through the shared publication schema helper', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('buildPublicationDiagnosticCopy')).toBe(true)
    expect(content.includes('const diagnosticCopy = computed(() => buildPublicationDiagnosticCopy({')).toBe(true)
    expect(content.includes('profileLine: `Profile source:')).toBe(false)
    expect(content.includes('metaLine: `Seam ')).toBe(false)
    expect(content.includes("`Focus band: ${stressFocusLabel.value}`")).toBe(false)
  })

  it('routes 3D fusion statistic panel titles and summary rows through the shared publication schema helper', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('buildPublicationStatisticCopy')).toBe(true)
    expect(content.includes('const statisticCopy = computed(() => buildPublicationStatisticCopy({')).toBe(true)
    expect(content.includes('>Quantitative Highlights<')).toBe(false)
    expect(content.includes('>Depth transfer profile<')).toBe(false)
    expect(content.includes('>Depth anchors<')).toBe(false)
    expect(content.includes('>Q1/Q2/Q3 markers<')).toBe(false)
    expect(content.includes('Section retained: {{')).toBe(false)
  })

  it('routes 3D fusion header metadata and KPI pills through the shared publication schema helper', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('buildPublicationFigureHeaderCopy')).toBe(true)
    expect(content.includes('const figureHeaderCopy = computed(() => buildPublicationFigureHeaderCopy({')).toBe(true)
    expect(content.includes('Seam {{ contextMeta?.seam ||')).toBe(false)
    expect(content.includes('<span>Layers {{ layerCount }}</span>')).toBe(false)
    expect(content.includes('<span>Focus {{ stressFocusLabel }}</span>')).toBe(false)
  })

  it('routes 3D fusion hero topic, headline, and metric rows through the shared publication schema helper', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('buildPublicationHeroCopy')).toBe(true)
    expect(content.includes('const heroCopy = computed(() => buildPublicationHeroCopy({')).toBe(true)
    expect(content.includes('{{ metricLabel }}-Geology Coupled View')).toBe(false)
    expect(content.includes('>Integrated Multi-source Structure-Stress Interpretation<')).toBe(false)
    expect(content.includes('>Mean {{ formatValue(mpiSummary.mean) }} MPa<')).toBe(false)
  })

  it('routes 3D fusion legend and orientation hints through the shared publication schema helper', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('buildPublicationLegendCopy')).toBe(true)
    expect(content.includes('const legendCopy = computed(() => buildPublicationLegendCopy({')).toBe(true)
    expect(content.includes('{{ metricLabel }} (MPa)')).toBe(false)
    expect(content.includes('Depth span {{ formatValue(dataBounds.min_z) }} to {{ formatValue(dataBounds.max_z) }}')).toBe(false)
    expect(content.includes('Stress cloud = MPI field x depth transfer ({{ stressProfileLabel }})')).toBe(false)
    expect(content.includes('>X-east / Y-north<')).toBe(false)
  })

  it('routes 3D fusion quantitative summary notation through the shared publication schema helper', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('buildPublicationSummaryCopy')).toBe(true)
    expect(content.includes('const summaryCopy = computed(() => buildPublicationSummaryCopy({')).toBe(true)
    expect(content.includes('metricLine: `${metricLabel.value}')).toBe(false)
    expect(content.includes('quantileLine: `Q1 / Q2 / Q3')).toBe(false)
    expect(content.includes('coverLine: `Q3 cover')).toBe(false)
    expect(content.includes('distributionLine: `Entropy')).toBe(false)
    expect(content.includes('supportLine: `Heterogeneity')).toBe(false)
  })

  it('routes 3D fusion section profile diagnostics through the shared publication schema helper', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('buildPublicationSectionProfileDiagnostics')).toBe(true)
    expect(content.includes('const sectionProfileDiagnostics = computed(() => buildPublicationSectionProfileDiagnostics({')).toBe(true)
    expect(content.includes('const focusCol = Math.max(0, Math.min(cols - 1, Math.round(sectionRetainedRatio.value * (cols - 1))))')).toBe(false)
    expect(content.includes('Band = local interquartile envelope, mean width')).toBe(false)
  })

  it('routes 3D fusion caption and note rows through the shared publication row helper', () => {
    const content = fs.readFileSync(path.resolve(geoFusionComponent), 'utf8')

    expect(content.includes('buildPublicationLabelSet')).toBe(true)
    expect(content.includes('const publicationLabels = buildPublicationLabelSet({')).toBe(true)
    expect(content.includes('publicationLabels.captionBlock')).toBe(true)
    expect(content.includes('publicationLabels.notesBlock')).toBe(true)
    expect(content.includes('buildPublicationRows')).toBe(true)
    expect(content.includes('const publicationCaptionRows = computed(() => buildPublicationRows([')).toBe(true)
    expect(content.includes('const publicationNoteRows = computed(() => buildPublicationRows([')).toBe(true)
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

  it('writes structured publication rows into pressure supplement exports', () => {
    const content = fs.readFileSync(path.resolve(chartCenterView), 'utf8')

    expect(content.includes('buildPublicationLabelSet')).toBe(true)
    expect(content.includes('buildPublicationRows')).toBe(true)
    expect(content.includes('const buildPublicationCaptionRows = (meta) => buildPublicationRows([')).toBe(true)
    expect(content.includes('const buildPublicationNoteRows = (meta) => buildPublicationRows([')).toBe(true)
    expect(content.includes('caption_rows: buildPublicationCaptionRows(meta)')).toBe(true)
    expect(content.includes('note_rows: buildPublicationNoteRows(meta)')).toBe(true)
    expect(content.includes('buildPaperRootPath')).toBe(true)
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

  it('exposes validation figure metadata and chart instances for publication exports', () => {
    const content = fs.readFileSync(path.resolve(validationScienceFigures), 'utf8')

    expect(content.includes('const chartRefs = ref({})')).toBe(true)
    expect(content.includes('const getFigureMetaList = () =>')).toBe(true)
    expect(content.includes('const getChartInstanceById = (figureId) =>')).toBe(true)
    expect(content.includes('defineExpose({')).toBe(true)
  })

  it('adds active figure captions and supplement export controls to the validation figures page', () => {
    const content = fs.readFileSync(path.resolve(validationFiguresView), 'utf8')

    expect(content.includes('ref="scienceFiguresRef"')).toBe(true)
    expect(content.includes('const activeFigureId = ref(')).toBe(true)
    expect(content.includes('const activeFigureMeta = computed(() =>')).toBe(true)
    expect(content.includes('active-figure-caption')).toBe(true)
    expect(content.includes('async function exportActiveFigure()')).toBe(true)
    expect(content.includes('async function exportSupplementPackage()')).toBe(true)
  })

  it('writes structured publication rows into validation supplement exports', () => {
    const content = fs.readFileSync(path.resolve(validationFiguresView), 'utf8')

    expect(content.includes('buildPublicationLabelSet')).toBe(true)
    expect(content.includes('buildPublicationRows')).toBe(true)
    expect(content.includes('const buildPublicationCaptionRows = (meta) => {')).toBe(true)
    expect(content.includes('return buildPublicationRows([')).toBe(true)
    expect(content.includes('const buildPublicationNoteRows = (meta) => {')).toBe(true)
    expect(content.includes('caption_rows: buildPublicationCaptionRows(meta)')).toBe(true)
    expect(content.includes('note_rows: buildPublicationNoteRows(meta)')).toBe(true)
    expect(content.includes('buildPaperRootPath')).toBe(true)
  })

  it('uses shared publication caption helpers in fusion supplement exports', () => {
    const content = fs.readFileSync(path.resolve(fusionPreviewView), 'utf8')

    expect(content.includes('buildPublicationLabelSet')).toBe(true)
    expect(content.includes('buildPublicationRows')).toBe(true)
    expect(content.includes('buildPublicationCaptionsMarkdown')).toBe(true)
    expect(content.includes('buildPublicationIndexDocument')).toBe(true)
    expect(content.includes('buildPublicationReadmeMarkdown')).toBe(true)
    expect(content.includes('buildPublicationNotesMarkdown')).toBe(true)
    expect(content.includes('const buildFusionCaptionRows = (focus) => buildPublicationRows([')).toBe(true)
    expect(content.includes('const buildFusionNoteRows = (focus, payload) => buildPublicationRows([')).toBe(true)
    expect(content.includes('caption_rows: buildFusionCaptionRows(focus)')).toBe(true)
    expect(content.includes('note_rows: buildFusionNoteRows(focus, payload)')).toBe(true)
    expect(content.includes("buildPaperRootPath({ name: 'README', ext: 'md' })")).toBe(true)
    expect(content.includes("buildPaperRootPath({ name: 'index', ext: 'json' })")).toBe(true)
    expect(content.includes('data/manifest.json')).toBe(false)
  })

  it('uses shared publication caption helpers in uncertainty supplement exports', () => {
    const content = fs.readFileSync(path.resolve(uncertaintyAnalysisView), 'utf8')

    expect(content.includes('buildPublicationLabelSet')).toBe(true)
    expect(content.includes('buildPublicationRows')).toBe(true)
    expect(content.includes('buildPublicationCaptionsMarkdown')).toBe(true)
    expect(content.includes('buildPublicationIndexDocument')).toBe(true)
    expect(content.includes('buildPublicationReadmeMarkdown')).toBe(true)
    expect(content.includes('buildPublicationNotesMarkdown')).toBe(true)
    expect(content.includes('const buildUncertaintyCaptionRows = (title, summary, caption) => buildPublicationRows([')).toBe(true)
    expect(content.includes('const buildUncertaintyNoteRows = (notes, methodsFooter) => {')).toBe(true)
    expect(content.includes('return buildPublicationRows(rows)')).toBe(true)
    expect(content.includes('caption_rows: buildUncertaintyCaptionRows(')).toBe(true)
    expect(content.includes('note_rows: buildUncertaintyNoteRows(')).toBe(true)
    expect(content.includes('buildPaperRootPath')).toBe(true)
  })

  it('adds a supplement readme to 2D publication export packages', () => {
    const pressureContent = fs.readFileSync(path.resolve(chartCenterView), 'utf8')
    const validationContent = fs.readFileSync(path.resolve(validationFiguresView), 'utf8')

    expect(pressureContent.includes('buildPublicationIndexDocument')).toBe(true)
    expect(pressureContent.includes('buildPublicationReadmeMarkdown')).toBe(true)
    expect(pressureContent.includes("buildPaperRootPath({ name: 'README', ext: 'md' })")).toBe(true)
    expect(pressureContent.includes("buildPaperRootPath({ name: 'index', ext: 'json' })")).toBe(true)
    expect(validationContent.includes('buildPublicationIndexDocument')).toBe(true)
    expect(validationContent.includes('buildPublicationReadmeMarkdown')).toBe(true)
    expect(validationContent.includes("buildPaperRootPath({ name: 'README', ext: 'md' })")).toBe(true)
    expect(validationContent.includes("buildPaperRootPath({ name: 'index', ext: 'json' })")).toBe(true)
  })

  it('routes export menu copy through locale dictionaries on publication pages', () => {
    const fusionContent = fs.readFileSync(path.resolve(fusionPreviewView), 'utf8')
    const uncertaintyContent = fs.readFileSync(path.resolve(uncertaintyAnalysisView), 'utf8')
    const validationContent = fs.readFileSync(path.resolve(validationFiguresView), 'utf8')

    expect(fusionContent.includes(`:trigger-label="fp('exportTrigger')"`)).toBe(true)
    expect(fusionContent.includes(`:main-hint="fp('exportMainHint')"`)).toBe(true)
    expect(fusionContent.includes(`:pack-hint="fp('exportPackHint')"`)).toBe(true)
    expect(fusionContent.includes('3D fusion preview is deferred until you request it')).toBe(false)

    expect(uncertaintyContent.includes(':trigger-label="copy.exportTrigger"')).toBe(true)
    expect(uncertaintyContent.includes(':main-hint="copy.exportMainHint"')).toBe(true)
    expect(uncertaintyContent.includes(':pack-hint="copy.exportPackHint"')).toBe(true)
    expect(uncertaintyContent.includes('trigger-label="论文导出"')).toBe(false)

    expect(validationContent.includes(`{{ exportingMain ? avf('exportingFigure') : avf('exportFigure') }}`)).toBe(true)
    expect(validationContent.includes(`{{ exportingPack ? avf('packaging') : avf('exportSupplement') }}`)).toBe(true)
    expect(validationContent.includes(`{{ avf('columns') }}`)).toBe(true)
    expect(validationContent.includes(`{{ avf('density') }}`)).toBe(true)
    expect(validationContent.includes(`{{ avf('scale') }}`)).toBe(true)
    expect(validationContent.includes(`{{ avf('activeFigure') }}`)).toBe(true)
  })

  it('routes pressure chart center publication copy through locale dictionaries', () => {
    const pressureContent = fs.readFileSync(path.resolve(chartCenterView), 'utf8')
    const zhContent = fs.readFileSync(path.resolve(zhLocaleFile), 'utf8')
    const enContent = fs.readFileSync(path.resolve(enLocaleFile), 'utf8')

    expect(pressureContent.includes("import { useI18n } from '../composables/useI18n'")).toBe(true)
    expect(pressureContent.includes("const pac = (key, params) => t(`pressureAnalysisCharts.${key}`, params)")).toBe(true)
    expect(pressureContent.includes(':trigger-label="pac(\'exportTrigger\')"')).toBe(true)
    expect(pressureContent.includes(':main-label="pac(\'exportMain\')"')).toBe(true)
    expect(pressureContent.includes(':pack-label="pac(\'exportSupplement\')"')).toBe(true)
    expect(pressureContent.includes(':loading-main-label="pac(\'exportingMain\')"')).toBe(true)
    expect(pressureContent.includes(':loading-pack-label="pac(\'exportingPack\')"')).toBe(true)
    expect(pressureContent.includes(':main-hint="pac(\'exportMainHint\')"')).toBe(true)
    expect(pressureContent.includes(':pack-hint="pac(\'exportPackHint\')"')).toBe(true)
    expect(pressureContent.includes('trigger-label="论文导出"')).toBe(false)
    expect(pressureContent.includes('main-label="导出当前主图"')).toBe(false)
    expect(pressureContent.includes('pack-label="导出补充图包"')).toBe(false)

    for (const content of [zhContent, enContent]) {
      expect(content.includes('pressureAnalysisCharts: {')).toBe(true)
      expect(content.includes('exportTrigger')).toBe(true)
      expect(content.includes('exportMainHint')).toBe(true)
      expect(content.includes('exportPackHint')).toBe(true)
      expect(content.includes('activeFigureUnit')).toBe(true)
      expect(content.includes('summaryDateRange')).toBe(true)
    }
  })

  it('routes pressure chart titles and subtitles through locale dictionaries', () => {
    const pressureContent = fs.readFileSync(path.resolve(chartCenterView), 'utf8')
    const zhContent = fs.readFileSync(path.resolve(zhLocaleFile), 'utf8')
    const enContent = fs.readFileSync(path.resolve(enLocaleFile), 'utf8')

    expect(pressureContent.includes(`:title="pac('chartHistTitle')"`)).toBe(true)
    expect(pressureContent.includes(`:title="pac('chartSpatialTitle')"`)).toBe(true)
    expect(pressureContent.includes(`:title="pac('chartContourTitle')"`)).toBe(true)
    expect(pressureContent.includes(`:subtitle="pac('chartBoxplotSubtitle')"`)).toBe(true)
    expect(pressureContent.includes(`:subtitle="pac('chartRadarSubtitle')"`)).toBe(true)
    expect(pressureContent.includes('title="阻力分布直方图"')).toBe(false)
    expect(pressureContent.includes('title="空间分布"')).toBe(false)
    expect(pressureContent.includes('subtitle="Box Plot Analysis"')).toBe(false)

    for (const content of [zhContent, enContent]) {
      expect(content.includes('chartHistTitle')).toBe(true)
      expect(content.includes('chartSpatialTitle')).toBe(true)
      expect(content.includes('chartContourTitle')).toBe(true)
      expect(content.includes('chartBoxplotSubtitle')).toBe(true)
      expect(content.includes('chartRadarSubtitle')).toBe(true)
    }
  })

  it('routes pressure chart figure metadata through locale dictionaries', () => {
    const pressureContent = fs.readFileSync(path.resolve(chartCenterView), 'utf8')
    const zhContent = fs.readFileSync(path.resolve(zhLocaleFile), 'utf8')
    const enContent = fs.readFileSync(path.resolve(enLocaleFile), 'utf8')

    expect(pressureContent.includes('const buildChartMeta = (prefix, unit) => ({')).toBe(true)
    expect(pressureContent.includes("figureTitle: pac(`${prefix}FigureTitle`)")).toBe(true)
    expect(pressureContent.includes("figureSummary: pac(`${prefix}FigureSummary`)")).toBe(true)
    expect(pressureContent.includes("figureCaption: pac(`${prefix}FigureCaption`)")).toBe(true)
    expect(pressureContent.includes("figureNotes: pac(`${prefix}FigureNotes`)")).toBe(true)
    expect(pressureContent.includes("methodsFooter: pac(`${prefix}MethodsFooter`)")).toBe(true)
    expect(pressureContent.includes("figureSummary: 'Histogram plate resolving the empirical resistance envelope")).toBe(false)
    expect(pressureContent.includes("figureSummary: 'Active chart metadata unavailable.'")).toBe(false)

    for (const content of [zhContent, enContent]) {
      expect(content.includes('histFigureTitle')).toBe(true)
      expect(content.includes('histFigureSummary')).toBe(true)
      expect(content.includes('histFigureCaption')).toBe(true)
      expect(content.includes('histFigureNotes')).toBe(true)
      expect(content.includes('histMethodsFooter')).toBe(true)
      expect(content.includes('fallbackFigureSummary')).toBe(true)
      expect(content.includes('fallbackMethodsFooter')).toBe(true)
    }
  })

  it('routes fusion supplement export metadata through locale dictionaries', () => {
    const fusionContent = fs.readFileSync(path.resolve(fusionPreviewView), 'utf8')
    const zhContent = fs.readFileSync(path.resolve(zhLocaleFile), 'utf8')
    const enContent = fs.readFileSync(path.resolve(enLocaleFile), 'utf8')

    expect(fusionContent.includes("title: fp('supplementCaptionsTitle')")).toBe(true)
    expect(fusionContent.includes("title: fp('supplementNotesTitle')")).toBe(true)
    expect(fusionContent.includes("title: fp('supplementExportTitle')")).toBe(true)
    expect(fusionContent.includes("intro: fp('supplementReadmeIntro')")).toBe(true)
    expect(fusionContent.includes("notes: [")).toBe(true)
    expect(fusionContent.includes("fp('supplementManifestNote1')")).toBe(true)
    expect(fusionContent.includes("fp('supplementManifestNote2')")).toBe(true)
    expect(fusionContent.includes("title: 'Fusion Figure Captions'")).toBe(false)
    expect(fusionContent.includes("title: 'Publication Notes'")).toBe(false)
    expect(fusionContent.includes("title: 'Fusion Supplement Export'")).toBe(false)

    for (const content of [zhContent, enContent]) {
      expect(content.includes('supplementCaptionsTitle')).toBe(true)
      expect(content.includes('supplementNotesTitle')).toBe(true)
      expect(content.includes('supplementExportTitle')).toBe(true)
      expect(content.includes('supplementReadmeIntro')).toBe(true)
      expect(content.includes('supplementManifestNote1')).toBe(true)
      expect(content.includes('supplementManifestNote2')).toBe(true)
    }
  })

  it('centralizes uncertainty supplement caption and note builders', () => {
    const uncertaintyContent = fs.readFileSync(path.resolve(uncertaintyAnalysisView), 'utf8')

    expect(uncertaintyContent.includes('const publicationLabels = computed(() => buildPublicationLabelSet({')).toBe(true)
    expect(uncertaintyContent.includes('const buildUncertaintyCaptionRows = (title, summary, caption) => buildPublicationRows([')).toBe(true)
    expect(uncertaintyContent.includes('const buildUncertaintyNoteRows = (notes, methodsFooter) => {')).toBe(true)
    expect(uncertaintyContent.includes('return buildPublicationRows(rows)')).toBe(true)
    expect(uncertaintyContent.includes("title: 'Figure Captions'")).toBe(false)
    expect(uncertaintyContent.includes("title: 'Publication Notes'")).toBe(false)
    expect(uncertaintyContent.includes("title: 'Uncertainty Supplement Export'")).toBe(false)
    expect(uncertaintyContent.includes("label: 'Figure'")).toBe(false)
    expect(uncertaintyContent.includes("label: 'Summary'")).toBe(false)
    expect(uncertaintyContent.includes("label: 'Caption'")).toBe(false)
    expect(uncertaintyContent.includes("label: 'Notes'")).toBe(false)
    expect(uncertaintyContent.includes("label: 'Methods footer'")).toBe(false)
  })

  it('routes uncertainty analysis copy through the global locale dictionaries', () => {
    const uncertaintyContent = fs.readFileSync(path.resolve(uncertaintyAnalysisView), 'utf8')
    const zhContent = fs.readFileSync(path.resolve(zhLocaleFile), 'utf8')
    const enContent = fs.readFileSync(path.resolve(enLocaleFile), 'utf8')

    expect(uncertaintyContent.includes('const zh = {')).toBe(false)
    expect(uncertaintyContent.includes('const en = {')).toBe(false)
    expect(uncertaintyContent.includes("const ua = (key, params) => t(`uncertaintyAnalysis.${key}`, params)")).toBe(true)
    expect(uncertaintyContent.includes('const copy = computed(() => ({')).toBe(true)
    expect(uncertaintyContent.includes('title: ua(\'title\')')).toBe(true)
    expect(uncertaintyContent.includes('exportTrigger: ua(\'exportTrigger\')')).toBe(true)
    expect(uncertaintyContent.includes('atlasTitle: ua(\'atlasTitle\')')).toBe(true)

    for (const content of [zhContent, enContent]) {
      expect(content.includes('uncertaintyAnalysis: {')).toBe(true)
      expect(content.includes('atlasTitle')).toBe(true)
      expect(content.includes('publicationCaptionsTitle')).toBe(true)
      expect(content.includes('supplementExportTitle')).toBe(true)
    }
  })

  it('defines publication export vocabulary in both locale dictionaries', () => {
    const zhContent = fs.readFileSync(path.resolve(zhLocaleFile), 'utf8')
    const enContent = fs.readFileSync(path.resolve(enLocaleFile), 'utf8')

    for (const content of [zhContent, enContent]) {
      expect(content.includes('exportTrigger')).toBe(true)
      expect(content.includes('exportMainHint')).toBe(true)
      expect(content.includes('exportPackHint')).toBe(true)
      expect(content.includes('exportFigure')).toBe(true)
      expect(content.includes('exportingFigure')).toBe(true)
      expect(content.includes('packaging')).toBe(true)
      expect(content.includes('columns')).toBe(true)
      expect(content.includes('density')).toBe(true)
      expect(content.includes('scale')).toBe(true)
      expect(content.includes('activeFigure')).toBe(true)
    }
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
