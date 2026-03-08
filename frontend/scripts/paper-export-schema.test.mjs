import { describe, expect, it } from 'vitest'
import {
  PAPER_EXPORT_SCHEMA_VERSION,
  buildPaperManifest,
  buildPaperContext,
  buildPaperNote,
  buildPaperTimestampTag,
  buildPaperFigureId,
  buildPaperFigureStem,
  buildPaperSupplementZipName,
  buildPaperFigurePath,
  buildPaperTablePath,
  buildPaperRootPath,
  buildPublicationCaptionsMarkdown,
  buildPublicationIndexDocument,
  buildPublicationLabelSet,
  buildPublicationNarrativeSentence,
  buildPublicationReadmeMarkdown,
  buildPublicationNotesMarkdown,
  buildPublicationMethodsFooter,
  buildPublicationDiagnosticCopy,
  buildPublicationFigureHeaderCopy,
  buildPublicationHeroCopy,
  buildPublicationLegendCopy,
  buildPublicationSummaryCopy,
  buildPublicationStatisticCopy,
  buildPublicationRows,
  buildPaperArtifact,
  buildPaperTable
} from '../src/utils/paperExportSchema.js'

describe('paper export schema', () => {
  it('renders publication captions with summary and notes sections', () => {
    const markdown = buildPublicationCaptionsMarkdown({
      title: 'Validation Figure Supplement',
      intro: 'Seam: 3-1; threshold mode real_label_stream.',
      figures: [
        {
          id: 'FigS1',
          title: 'Figure 9 | ROC curve with Youden operating point',
          meta: {
            caption_rows: [
              { label: 'Figure', value: 'Figure 9 | ROC curve with Youden operating point' },
              { label: 'Summary', value: 'Upper-left trajectories indicate stronger class separation.' },
              { label: 'Caption', value: 'ROC AUC is summarized with bootstrap confidence limits.' }
            ],
            note_rows: [
              { label: 'Notes', value: 'Derived from cached validation snapshot.' },
              { label: 'Abbrev.', value: 'ROC, receiver operating characteristic.' }
            ]
          }
        }
      ]
    })

    expect(markdown).toContain('# Validation Figure Supplement')
    expect(markdown).toContain('## FigS1 Figure 9 | ROC curve with Youden operating point')
    expect(markdown).toContain('**Figure:** Figure 9 | ROC curve with Youden operating point')
    expect(markdown).toContain('**Summary:** Upper-left trajectories indicate stronger class separation.')
    expect(markdown).toContain('**Notes:** Derived from cached validation snapshot.')
    expect(markdown).toContain('**Abbrev.:** ROC, receiver operating characteristic.')
  })

  it('renders publication notes markdown from note rows', () => {
    const markdown = buildPublicationNotesMarkdown({
      title: 'Publication Notes',
      figures: [
        {
          id: 'FigS1',
          title: 'Figure 3 | Fusion balanced',
          meta: {
            note_rows: [
              { label: 'Notes', value: 'Exported from publication mode.' },
              { label: 'Methods footer', value: 'Resolution 40 m; metric MPI.' }
            ]
          }
        }
      ]
    })

    expect(markdown).toContain('# Publication Notes')
    expect(markdown).toContain('## FigS1 Figure 3 | Fusion balanced')
    expect(markdown).toContain('- Notes: Exported from publication mode.')
    expect(markdown).toContain('- Methods footer: Resolution 40 m; metric MPI.')
  })

  it('builds a normalized methods footer sentence', () => {
    const text = buildPublicationMethodsFooter({
      subject: 'Figure 9 | ROC curve with Youden operating point',
      source: 'cached validation snapshot',
      seam: '3-1',
      details: ['threshold mode real_label_stream', 'layout 2', 'density balanced']
    })

    expect(text).toBe('Methods footer: Figure 9 | ROC curve with Youden operating point is exported from the cached validation snapshot for seam 3-1, using threshold mode real_label_stream, layout 2, density balanced.')
  })

  it('builds a normalized publication narrative sentence from clauses', () => {
    const text = buildPublicationNarrativeSentence({
      clauses: [
        'MPI shows right-tailed stress amplification; strongest anomaly at #1 r3, c4, 12.40 MPa',
        'Section keeps 58.0% of the volume, with moderately heterogeneous fabric under dense control'
      ]
    })

    expect(text).toBe('MPI shows right-tailed stress amplification; strongest anomaly at #1 r3, c4, 12.40 MPa. Section keeps 58.0% of the volume, with moderately heterogeneous fabric under dense control.')
  })

  it('builds normalized diagnostic copy for fusion figure summaries and depth notes', () => {
    expect(buildPublicationDiagnosticCopy({
      profileSource: 'Stress anchoring',
      focus: 'roof transfer window',
      seam: '3-1',
      grid: '46 x 42 x 18',
      method: 'kriging',
      resolution: '40.00 m',
      layerCount: 6,
      boreholeCount: 18,
      anchorCount: 7,
      depthMax: '1280.00',
      depthMin: '920.00'
    })).toEqual({
      profileLine: 'Profile source: Stress anchoring | Focus: roof transfer window',
      metaLine: 'Seam 3-1 | Grid 46 x 42 x 18 | Method KRIGING | Resolution 40.00 m',
      structureLine: 'Layers 6 | Boreholes 18 | Anchors 7',
      methodsLine: 'Data fusion: mesh layers + boreholes + 46 x 42 x 18 metric grid',
      depthNotes: [
        'Focus band: roof transfer window',
        'Anchors ranked by transfer weight.',
        'Depth frame: 1280.00 to 920.00 m.'
      ]
    })
  })

  it('builds normalized statistic copy for 3D fusion panel titles and summary rows', () => {
    expect(buildPublicationStatisticCopy({
      analysisTitle: 'Quantitative Highlights',
      profileTitle: 'Depth transfer profile',
      anchorTitle: 'Depth anchors',
      figureNote: 'Nature-style content panel: structure + statistics + depth coupling.',
      distributionCaption: 'Q1/Q2/Q3 markers',
      sectionRetained: '58.0%',
      hotspotCount: 4,
      p25: '8.10',
      p50: '9.25',
      p75: '11.40'
    })).toEqual({
      analysisTitle: 'Quantitative Highlights',
      profileTitle: 'Depth transfer profile',
      anchorTitle: 'Depth anchors',
      figureNote: 'Nature-style content panel: structure + statistics + depth coupling.',
      distributionCaption: 'Q1/Q2/Q3 markers',
      summaryLines: [
        'Section retained: 58.0%',
        'Hotspots (P90+): 4',
        'Q1/Q2/Q3: 8.10 / 9.25 / 11.40'
      ]
    })
  })

  it('builds normalized figure header copy for seam metadata and KPI pills', () => {
    expect(buildPublicationFigureHeaderCopy({
      seam: '3-1',
      grid: '46 x 42 x 18',
      method: 'kriging',
      layerCount: 6,
      boreholeCount: 18,
      anchorCount: 7,
      focus: 'roof transfer window'
    })).toEqual({
      metaLine: 'Seam 3-1 | Grid 46 x 42 x 18 | Method KRIGING',
      kpiLines: [
        'Layers 6',
        'Boreholes 18',
        'Anchors 7',
        'Focus roof transfer window'
      ]
    })
  })

  it('builds normalized hero copy for topic, headline, and metric rows', () => {
    expect(buildPublicationHeroCopy({
      metricLabel: 'MPI',
      metricUnit: 'MPa',
      mean: '9.21',
      cv: '0.31',
      p90Cover: '12.0%',
      iqr: '2.18',
      entropy: '0.84',
      skew: '0.42'
    })).toEqual({
      topic: 'MPI-Geology Coupled View',
      headline: 'Integrated Multi-source Structure-Stress Interpretation',
      metricRows: [
        'Mean 9.21 MPa',
        'CV 0.31',
        'P90 cover 12.0%',
        'IQR 2.18',
        'Entropy 0.84',
        'Skew 0.42'
      ]
    })
  })

  it('builds normalized legend copy for metric, section, and orientation hints', () => {
    expect(buildPublicationLegendCopy({
      metricLabel: 'MPI',
      metricUnit: 'MPa',
      depthMin: '920.00',
      depthMax: '1280.00',
      depthUnit: 'm',
      sectionAxis: 'z',
      sectionThreshold: '1085.00',
      stressProfileLabel: 'roof transfer',
      spatialFrameLabel: 'X east / Y north'
    })).toEqual({
      legendTitle: 'MPI (MPa)',
      depthSpanLine: 'Depth span 920.00 to 1280.00 m',
      sectionLine: 'Section Z = 1085.00',
      cloudLine: 'Stress cloud = MPI field x depth transfer (roof transfer)',
      orientationMeta: 'X east / Y north',
      northLabel: 'N'
    })
  })

  it('builds normalized summary copy for fusion quantitative notation lines', () => {
    expect(buildPublicationSummaryCopy({
      figureNarrative: 'MPI shows right-tailed stress amplification.',
      metricLabel: 'MPI',
      metricKind: 'proxy',
      metricUnit: 'MPa',
      metricMin: '6.20',
      metricMean: '9.21',
      metricMax: '12.40',
      sampleSizeLabel: 'n = 128',
      p25: '8.10',
      p50: '9.25',
      p75: '11.40',
      cv: '0.31',
      p75Cover: '25.0%',
      p90Cover: '10.0%',
      sectionRetained: '58.0%',
      entropy: '0.84',
      skewness: '0.42',
      heterogeneity: '0.48',
      boreholeDensity: '4.30',
      densityUnit: 'boreholes km^-2'
    })).toEqual({
      summaryLead: 'MPI shows right-tailed stress amplification. MPI evidence spans 6.20 to 12.40 MPa with n = 128.',
      metricLine: 'MPI (proxy) min 6.20 mean 9.21 max 12.40',
      quantileLine: 'Q1 / Q2 / Q3 8.10 / 9.25 / 11.40 MPa | CV 0.31',
      coverLine: 'Q3 cover 25.0% | P90 cover 10.0% | Section retained 58.0%',
      distributionLine: 'Entropy 0.84 | Skewness 0.42 | n = 128',
      supportLine: 'Heterogeneity 0.48 | Borehole density 4.30 boreholes km^-2 | n = 128'
    })
  })

  it('builds normalized publication rows for caption and note blocks', () => {
    expect(buildPublicationRows([
      { label: 'Title', value: 'Figure 3. Fusion view' },
      { label: 'Support', value: 12 },
      { label: '', value: '' },
      null
    ])).toEqual([
      { label: 'Title', value: 'Figure 3. Fusion view' },
      { label: 'Support', value: '12' },
      { label: '--', value: '--' }
    ])
  })

  it('builds publication label sets with defaults and overrides', () => {
    expect(buildPublicationLabelSet({
      figure: 'Figure',
      notes: 'Notes',
      methodsFooter: 'Methods'
    })).toEqual({
      figure: 'Figure',
      summary: 'Summary',
      caption: 'Caption',
      notes: 'Notes',
      methodsFooter: 'Methods',
      unit: 'Unit',
      abbrev: 'Abbrev.',
      interpretation: 'Interpretation',
      result: 'Result',
      metric: 'Metric',
      title: 'Title',
      finding: 'Finding',
      support: 'Support',
      data: 'Data',
      frame: 'Frame',
      seam: 'Seam',
      fusion: 'Fusion',
      resolution: 'Resolution',
      stressPrior: 'Stress prior',
      section: 'Section',
      control: 'Control',
      fabric: 'Fabric',
      hotspot: 'Hotspot',
      sampling: 'Sampling',
      methodsPanel: 'Methods and provenance',
      depthGuideTitle: 'Stratigraphic depth guide',
      insetTitle: 'Plan-view MPI inset',
      insetCaption: 'Line = section, circles = hotspots',
      distributionTitle: 'MPI distribution',
      sectionTransectTitle: 'Section transect',
      xSectionTransectTitle: 'X-direction section transect',
      ySectionTransectTitle: 'Y-direction section transect',
      representativeTransectTitle: 'Representative lateral transect',
      peakFallback: 'Peak --',
      spreadFallback: 'Band = local interquartile envelope.',
      captionBlock: 'Figure caption',
      notesBlock: 'Notes and abbreviations',
    })
  })

  it('builds a normalized artifact descriptor', () => {
    expect(buildPaperArtifact({ name: 'captions', path: 'captions.md' })).toEqual({
      name: 'captions',
      path: 'captions.md'
    })
  })

  it('builds a normalized table descriptor', () => {
    expect(buildPaperTable({ name: 'metric_summary', path: 'tables/metric_summary.csv' })).toEqual({
      name: 'metric_summary',
      path: 'tables/metric_summary.csv'
    })
  })

  it('normalizes manifest artifacts and tables to descriptors', () => {
    const manifest = buildPaperManifest({
      sourcePage: 'uncertainty-analysis',
      artifacts: ['captions.md'],
      tables: ['tables/metric_summary.csv']
    })

    expect(manifest.artifacts).toEqual([
      { name: 'captions', path: 'captions.md' }
    ])
    expect(manifest.tables).toEqual([
      { name: 'metric_summary', path: 'tables/metric_summary.csv' }
    ])
  })

  it('builds a normalized context object', () => {
    expect(buildPaperContext({
      seam: '3-1',
      resolution: 40,
      enabled: true,
      missing: undefined
    })).toEqual({
      seam: '3-1',
      resolution: 40,
      enabled: true
    })
  })

  it('builds a normalized note string', () => {
    expect(buildPaperNote('exported_count=4')).toBe('exported_count=4')
    expect(buildPaperNote(12)).toBe('12')
  })

  it('normalizes manifest context and notes', () => {
    const manifest = buildPaperManifest({
      sourcePage: 'fusion-preview',
      context: {
        seam: '3-1',
        figure_mode: 'nature',
        ignored: undefined
      },
      notes: ['exported_count=3', 12]
    })

    expect(manifest.context).toEqual({
      seam: '3-1',
      figure_mode: 'nature'
    })
    expect(manifest.notes).toEqual(['exported_count=3', '12'])
  })

  it('builds a normalized timestamp tag', () => {
    const tag = buildPaperTimestampTag('2026-03-08T09:10:11.123Z')
    expect(tag).toBe('2026-03-08T09-10-11-123Z')
  })

  it('builds figure ids and stems for supplement exports', () => {
    expect(buildPaperFigureId({ index: 1 })).toBe('Fig1')
    expect(buildPaperFigureId({ index: 2, supplement: true })).toBe('FigS2')
    expect(buildPaperFigureStem({ index: 2, supplement: true, slug: 'fusion_balanced' })).toBe('FigS2_fusion_balanced')
  })

  it('builds a normalized supplement zip name', () => {
    expect(buildPaperSupplementZipName({
      topic: 'Fusion',
      variant: 'nature',
      timestampTag: '2026-03-08T09-10-11-123Z'
    })).toBe('Fusion_Supplement_nature_2026-03-08T09-10-11-123Z.zip')
  })

  it('builds normalized figure file paths', () => {
    expect(buildPaperFigurePath({
      index: 2,
      supplement: true,
      slug: 'fusion_balanced',
      ext: 'png'
    })).toBe('figures/FigS2_fusion_balanced.png')
  })

  it('builds normalized table file paths', () => {
    expect(buildPaperTablePath({
      name: 'metric_summary',
      ext: 'csv'
    })).toBe('tables/metric_summary.csv')
  })

  it('builds normalized root file paths', () => {
    expect(buildPaperRootPath({ name: 'captions', ext: 'md' })).toBe('captions.md')
    expect(buildPaperRootPath({ name: 'publication-notes', ext: 'md' })).toBe('publication-notes.md')
    expect(buildPaperRootPath({ name: 'manifest', ext: 'json' })).toBe('manifest.json')
    expect(buildPaperRootPath({ name: 'README', ext: 'md' })).toBe('README.md')
  })

  it('renders a supplement readme with package structure and figure inventory', () => {
    const markdown = buildPublicationReadmeMarkdown({
      title: 'Fusion Supplement Export',
      intro: 'This archive contains the publication-ready supplement package.',
      sourcePage: 'fusion-preview',
      manifestPath: 'manifest.json',
      captionsPath: 'captions.md',
      notesPath: 'publication-notes.md',
      figures: [
        { id: 'FigS1', title: 'Fusion balanced', files: ['figures/FigS1_fusion_balanced.png'] }
      ],
      tables: [
        { name: 'metric_summary', path: 'tables/metric_summary.csv' }
      ]
    })

    expect(markdown).toContain('# Fusion Supplement Export')
    expect(markdown).toContain('This archive contains the publication-ready supplement package.')
    expect(markdown).toContain('- `Source page`: `fusion-preview`')
    expect(markdown).toContain('- `manifest.json`: normalized package manifest.')
    expect(markdown).toContain('- `captions.md`: structured figure captions.')
    expect(markdown).toContain('- `publication-notes.md`: supporting notes and abbreviations.')
    expect(markdown).toContain('- `FigS1` Fusion balanced: `figures/FigS1_fusion_balanced.png`')
    expect(markdown).toContain('- `metric_summary`: `tables/metric_summary.csv`')
  })

  it('builds a supplement index document with root files and inventories', () => {
    const indexDoc = buildPublicationIndexDocument({
      title: 'Fusion Supplement Export',
      generatedAt: '2026-03-08T10:11:12.000Z',
      sourcePage: 'fusion-preview',
      manifestPath: 'manifest.json',
      captionsPath: 'captions.md',
      notesPath: 'publication-notes.md',
      readmePath: 'README.md',
      figures: [
        { id: 'FigS1', title: 'Fusion balanced', files: ['figures/FigS1_fusion_balanced.png'] }
      ],
      tables: [
        { name: 'metric_summary', path: 'tables/metric_summary.csv' }
      ]
    })

    expect(indexDoc).toEqual({
      schema_version: PAPER_EXPORT_SCHEMA_VERSION,
      generated_at: '2026-03-08T10:11:12.000Z',
      source_page: 'fusion-preview',
      title: 'Fusion Supplement Export',
      files: {
        manifest: 'manifest.json',
        captions: 'captions.md',
        publication_notes: 'publication-notes.md',
        readme: 'README.md'
      },
      figures: [
        { id: 'FigS1', title: 'Fusion balanced', files: ['figures/FigS1_fusion_balanced.png'] }
      ],
      tables: [
        { name: 'metric_summary', path: 'tables/metric_summary.csv' }
      ]
    })
  })
})
