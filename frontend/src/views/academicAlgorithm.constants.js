export const formulas = {
  rsi: {
    energy: 'E(u, \\phi) = \\int_\\Omega \\left[ g(\\phi) \\Psi_e^+ + \\Psi_e^- + \\frac{G_c}{c_0} \\left( \\frac{\\phi}{l_0} + l_0 \\nabla \\phi \\cdot \\nabla \\phi \\right) \\right] d\\Omega',
    governing: '\\frac{\\partial \\phi}{\\partial t} = -M \\frac{\\delta E}{\\delta \\phi} = M \\left( 2l_0(1-\\phi)H - \\frac{G_c}{c_0 l_0} \\right)',
    griffith: '\\sigma_c = \\sqrt{\\frac{2 E G_c}{\\pi a}}',
    norm: '\\text{RSI}_{\\text{norm}} = \\min\\left(\\frac{\\bar{\\sigma_t}}{10}, 1\\right) \\times 40',
    key: '\\text{RSI}_{\\text{key}} = \\min(n_{\\text{key}} \\times 15, 30)',
    struct: '\\text{RSI}_{\\text{struct}} = (1 - r_{\\text{soft}}) \\times 40'
  },
  bri: {
    decomposition: '\\mathbf{M} = M_{\\text{ISO}} + M_{\\text{DC}} + M_{\\text{CLVD}}',
    waveform: 'u_i(t) = \\sum_{j=1}^3 M_{ij} \\cdot G_{ij}(t) + n(t)',
    main: '\\text{BRI} = \\max(100 - P_{\\text{depth}} - P_{\\text{hard}} - P_{\\text{thick}}, 0)',
    depth: 'P_{\\text{depth}} = \\min\\left(\\frac{H - H_{\\text{crit}}}{200}, 1\\right) \\times 40',
    hard: 'P_{\\text{hard}} = \\min\\left(\\frac{E_{\\text{hard}}}{500}, 1\\right) \\times 30',
    thick: 'P_{\\text{thick}} = \\min\\left(\\frac{h_{\\text{coal}}}{10}, 1\\right) \\times 30'
  },
  asi: {
    ust: 'F = \\sigma_1 - \\frac{1}{1+b}(b\\sigma_2 + \\sigma_3) = \\sigma_t',
    case1: '\\text{闂?} \\sigma_2 \\leq \\frac{\\sigma_1 + b\\sigma_3}{1+b}: F = \\sigma_1 - \\frac{1}{1+b}(b\\sigma_2 + \\sigma_3)',
    kirsch: '\\sigma_r = \\sigma_0\\left(1 - \\frac{a^2}{r^2}\\right) + p_i\\frac{a^2}{r^2}',
    stiff: 'S_{\\text{stiff}} = \\min\\left(\\frac{\\bar{E}}{35} \\times 50, 50\\right)',
    fric: 'S_{\\text{fric}} = \\max\\left(\\frac{\\bar{\\varphi} - 20}{25} \\times 50, 0)'
  },
  dbn: {
    bayes: 'P(H|O) = \\frac{P(O|H) \\cdot P(H)}{P(O)}',
    mpi: '\\text{MPI} = w_r \\cdot \\text{RSI} + w_b \\cdot \\text{BRI} + w_a \\cdot \\text{ASI}',
    transition: 'P(H_t | H_{t-1}) = \\prod_{i} P(H_t^{(i)} | \\text{Pa}(H_t^{(i)}))',
    posterior: 'P(H_t | O_{1:t}) \\propto P(O_t | H_t) \\sum_{H_{t-1}} P(H_t | H_{t-1}) P(H_{t-1} | O_{1:t-1})'
  }
}

export const flowNodes = [
  {
    key: 'rsi',
    titleKey: 'flow.rsi.title',
    subtitleKey: 'flow.rsi.subtitle',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    detailTitleKey: 'flow.rsi.detailTitle',
    detailKey: 'flow.rsi.detail'
  },
  {
    key: 'bri',
    titleKey: 'flow.bri.title',
    subtitleKey: 'flow.bri.subtitle',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>',
    detailTitleKey: 'flow.bri.detailTitle',
    detailKey: 'flow.bri.detail'
  },
  {
    key: 'asi',
    titleKey: 'flow.asi.title',
    subtitleKey: 'flow.asi.subtitle',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3z"/><path d="M12 12l9-4.5"/><path d="M12 12v9"/></svg>',
    detailTitleKey: 'flow.asi.detailTitle',
    detailKey: 'flow.asi.detail'
  },
  {
    key: 'dbn',
    titleKey: 'flow.dbn.title',
    subtitleKey: 'flow.dbn.subtitle',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="M12 8l-4 8"/><path d="M12 8l4 8"/></svg>',
    detailTitleKey: 'flow.dbn.detailTitle',
    detailKey: 'flow.dbn.detail'
  }
]

export const algorithms = [
  { key: 'rsi', tag: 'RSI', nameKey: 'algorithms.rsi' },
  { key: 'bri', tag: 'BRI', nameKey: 'algorithms.bri' },
  { key: 'asi', tag: 'ASI', nameKey: 'algorithms.asi' },
  { key: 'dbn', tag: 'DBN', nameKey: 'algorithms.dbn' }
]

export const newcomerJourney = [
  {
    step: '01',
    titleKey: 'newcomer.step1Title',
    descKey: 'newcomer.step1Desc'
  },
  {
    step: '02',
    titleKey: 'newcomer.step2Title',
    descKey: 'newcomer.step2Desc'
  },
  {
    step: '03',
    titleKey: 'newcomer.step3Title',
    descKey: 'newcomer.step3Desc'
  }
]

export const termGlossary = [
  {
    termKey: 'glossary.rsi.term',
    plainKey: 'glossary.rsi.plain',
    cueKey: 'glossary.rsi.cue'
  },
  {
    termKey: 'glossary.bri.term',
    plainKey: 'glossary.bri.plain',
    cueKey: 'glossary.bri.cue'
  },
  {
    termKey: 'glossary.asi.term',
    plainKey: 'glossary.asi.plain',
    cueKey: 'glossary.asi.cue'
  },
  {
    termKey: 'glossary.dbn.term',
    plainKey: 'glossary.dbn.plain',
    cueKey: 'glossary.dbn.cue'
  },
  {
    termKey: 'glossary.phi.term',
    plainKey: 'glossary.phi.plain',
    cueKey: 'glossary.phi.cue'
  },
  {
    termKey: 'glossary.posterior.term',
    plainKey: 'glossary.posterior.plain',
    cueKey: 'glossary.posterior.cue'
  }
]

export const algorithmStoryboards = [
  {
    key: 'rsi',
    tag: 'RSI',
    nameKey: 'storyboards.rsi.name',
    inputKey: 'storyboards.rsi.input',
    processKey: 'storyboards.rsi.process',
    outputKey: 'storyboards.rsi.output',
    watchKey: 'storyboards.rsi.watch'
  },
  {
    key: 'bri',
    tag: 'BRI',
    nameKey: 'storyboards.bri.name',
    inputKey: 'storyboards.bri.input',
    processKey: 'storyboards.bri.process',
    outputKey: 'storyboards.bri.output',
    watchKey: 'storyboards.bri.watch'
  },
  {
    key: 'asi',
    tag: 'ASI',
    nameKey: 'storyboards.asi.name',
    inputKey: 'storyboards.asi.input',
    processKey: 'storyboards.asi.process',
    outputKey: 'storyboards.asi.output',
    watchKey: 'storyboards.asi.watch'
  },
  {
    key: 'dbn',
    tag: 'DBN',
    nameKey: 'storyboards.dbn.name',
    inputKey: 'storyboards.dbn.input',
    processKey: 'storyboards.dbn.process',
    outputKey: 'storyboards.dbn.output',
    watchKey: 'storyboards.dbn.watch'
  }
]

export const defaultEvidence = {
  seismic: true,
  rsiLow: false,
  briLow: true,
  asiLow: false
}

export const defaultIndicators = [
  { key: 'rsi', tag: 'RSI', nameKey: 'indicators.rsi.name', value: 0, methodKey: 'indicators.rsi.method' },
  { key: 'bri', tag: 'BRI', nameKey: 'indicators.bri.name', value: 0, methodKey: 'indicators.bri.method' },
  { key: 'asi', tag: 'ASI', nameKey: 'indicators.asi.name', value: 0, methodKey: 'indicators.asi.method' },
  { key: 'mpi', tag: 'MPI', nameKey: 'indicators.mpi.name', value: 0, methodKey: 'indicators.mpi.method' }
]

export const defaultWeights = { rsi: 0.4, bri: 0.35, asi: 0.25 }

export const weightItems = [
  { key: 'rsi', labelKey: 'weights.rsi' },
  { key: 'bri', labelKey: 'weights.bri' },
  { key: 'asi', labelKey: 'weights.asi' }
]

export const strataData = [
  { name: 'Roof Rock', nameKey: 'strata.roof', thickness: 5.0, tensile_strength: 2.5, elastic_modulus: 15.0, compressive_strength: 35 },
  { name: 'Coal Seam', nameKey: 'strata.coal', thickness: 3.0, tensile_strength: 1.0, elastic_modulus: 5.0, compressive_strength: 15 },
  { name: 'Floor Rock', nameKey: 'strata.floor', thickness: 4.0, tensile_strength: 3.0, elastic_modulus: 20.0, compressive_strength: 45 }
]

export const microseismicData = [
  { time: '2024-01-01 10:00', location: [100, 200, -500], magnitude: 2.5 },
  { time: '2024-01-01 12:00', location: [150, 220, -480], magnitude: 3.0 },
  { time: '2024-01-01 14:00', location: [120, 210, -490], magnitude: 2.8 }
]

export const defaultTunnelParams = {
  radius: 3.0,
  original_stress: 10.0,
  support_pressure: 0.5,
  ust_b: 0.5
}
