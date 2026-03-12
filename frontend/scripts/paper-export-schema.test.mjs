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
  buildPublicationSectionProfileDiagnostics,
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
      details: ['threshold mode real_label_stream', 'layout 2', 'density balanced'],
      locale: 'en-US'
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

    expect(text).toBe('MPI shows right-tailed stress amplification; strongest anomaly at #1 r3, c4, 12.40 MPa。Section keeps 58.0% of the volume, with moderately heterogeneous fabric under dense control。')
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
      profileLine: '剖面来源：Stress anchoring | 焦点：roof transfer window',
      metaLine: '煤层 3-1 | 网格 46 x 42 x 18 | 方法 KRIGING | 分辨率 40.00 m',
      structureLine: '地层 6 | 钻孔 18 | 锚点 7',
      methodsLine: '数据融合：地层网格 + 钻孔 + 46 x 42 x 18 指标网格',
      depthNotes: [
        '焦点带：roof transfer window',
        '锚点按传递权重排序。',
        '深度框架：1280.00 至 920.00 m。'
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
        '剖切保留：58.0%',
        '热点数（P90+）：4',
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
      metaLine: '煤层 3-1 | 网格 46 x 42 x 18 | 方法 KRIGING',
      kpiLines: [
        '地层 6',
        '钻孔 18',
        '锚点 7',
        '焦点 roof transfer window'
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
      topic: 'MPI-地质耦合视图',
      headline: '多源结构-应力综合解译',
      metricRows: [
        '均值 9.21 MPa',
        'CV 0.31',
        'P90覆盖 12.0%',
        'IQR 2.18',
        '熵值 0.84',
        '偏度 0.42'
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
      depthSpanLine: '深度跨度 920.00 至 1280.00 m',
      sectionLine: '剖切 Z = 1085.00',
      cloudLine: '应力云 = MPI 场 × 深度传递（roof transfer）',
      orientationMeta: 'X east / Y north',
      northLabel: '北'
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
      summaryLead: 'MPI shows right-tailed stress amplification. MPI 取值跨度为 6.20 至 12.40 MPa，样本量 n = 128。',
      metricLine: 'MPI（proxy）最小值 6.20，均值 9.21，最大值 12.40',
      quantileLine: 'Q1 / Q2 / Q3：8.10 / 9.25 / 11.40 MPa | CV 0.31',
      coverLine: 'Q3覆盖 25.0% | P90覆盖 10.0% | 剖切保留 58.0%',
      distributionLine: '熵值 0.84 | 偏度 0.42 | n = 128',
      supportLine: '异质性 0.48 | 钻孔密度 4.30 boreholes km^-2 | n = 128'
    })
  })

  it('builds normalized section profile diagnostics for representative transects', () => {
    expect(buildPublicationSectionProfileDiagnostics({
      grid: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ],
      sectionAxis: 'z',
      sectionRetainedRatio: 0.58,
      labels: {
        sectionTransectTitle: 'Section transect',
        xSectionTransectTitle: 'X-section transect',
        ySectionTransectTitle: 'Y-section transect',
        representativeTransectTitle: 'Representative transect',
        peakFallback: 'No resolved peak',
        spreadFallback: 'Insufficient spread'
      },
      formatValue: (value) => Number(value).toFixed(2)
    })).toEqual({
      path: 'M 0.000,25.400 L 50.000,19.000 L 100.000,12.600',
      bandPath: 'M 0.000,15.800 L 50.000,9.400 L 100.000,3.000 L 100.000,22.200 L 50.000,28.600 L 0.000,35.000 Z',
      guideX: null,
      modeLabel: 'Representative transect',
      peakLabel: '峰值 X3 | 6.00 MPa',
      spreadLabel: '带状区表示局部四分位包络，平均宽度 3.00 MPa。',
      rangeLabel: '2.50 至 7.50 MPa'
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
      summary: '摘要',
      caption: '图注',
      notes: 'Notes',
      methodsFooter: 'Methods',
      unit: '单位',
      abbrev: '缩写',
      interpretation: '解释',
      result: '结果',
      metric: '指标',
      title: '标题',
      finding: '发现',
      support: '支撑证据',
      data: '数据',
      frame: '框架',
      seam: '煤层',
      fusion: '融合',
      resolution: '分辨率',
      stressPrior: '应力先验',
      section: '剖面',
      control: '控制条件',
      fabric: '构造纹理',
      hotspot: '热点',
      sampling: '采样',
      methodsPanel: '方法与溯源',
      depthGuideTitle: '地层深度导引',
      insetTitle: 'MPI 平面插图',
      insetCaption: '线表示剖面，圆表示热点',
      distributionTitle: 'MPI 分布',
      sectionTransectTitle: '剖面切线',
      xSectionTransectTitle: 'X 方向剖面切线',
      ySectionTransectTitle: 'Y 方向剖面切线',
      representativeTransectTitle: '代表性横向切线',
      peakFallback: '峰值 --',
      spreadFallback: '带状区表示局部四分位包络。',
      captionBlock: '图注块',
      notesBlock: '注释与缩写',
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
    expect(markdown).toContain('- `来源页面`: `fusion-preview`')
    expect(markdown).toContain('- `manifest.json`: 规范化导出清单。')
    expect(markdown).toContain('- `captions.md`: 结构化图注。')
    expect(markdown).toContain('- `publication-notes.md`: 补充注释与缩写说明。')
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
