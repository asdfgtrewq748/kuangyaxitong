# Science Journal-Style Algorithm Figures Design

## Summary
Replace `AlgorithmFigureAtlas.vue` with custom, minimalist academic-style figures for each algorithm module (RSI, BRI, ASI, DBN). Each figure will be tailored to its specific physical/mathematical principles following Science/Nature journal publication standards.

## Scope
- **Remove:** `AlgorithmFigureAtlas.vue` (the 2x2 grid with A/B/C/D panels)
- **Keep:** Individual principle diagrams (PhaseFieldFracture, MomentTensorInversion, UnifiedStrengthTheory, DbnNetworkFigure)
- **Create:** 4 new custom figure components, one per algorithm

## Visual Style Guidelines

### Color Palette
- **Primary:** Deep academic blue (#1a365d), charcoal (#1f2937)
- **Accent colors (algorithm-specific):**
  - RSI: Blue (#2563eb) / Orange (#ea580c)
  - BRI: Purple (#7c3aed) / Brown (#92400e)
  - ASI: Teal (#0d9488) / Amber (#d97706)
  - DBN: Indigo (#4f46e5) / Rose (#e11d48)
- **Background:** Pure white (#ffffff)
- **Grid/auxiliary lines:** Light gray (#e5e7eb)

### Typography
- **Panel labels:** Bold Arial, 14pt, uppercase (A, B, C, D)
- **Axis labels:** Times New Roman, 11pt
- **Annotations:** Times New Roman, 10pt, italic
- **Figure caption:** Times New Roman, 12pt

### Line Standards
- **Primary data lines:** 2-2.5px stroke
- **Secondary lines:** 1.5px stroke
- **Grid lines:** 0.8px stroke, dashed
- **Borders:** 1.5px solid

### Layout
- **Panel arrangement:** 2x2 grid (A top-left, B top-right, C bottom-left, D bottom-right)
- **Panel spacing:** 16px gap
- **Panel padding:** 12px internal padding
- **Border radius:** 6px for panels

## Figure Specifications

### RSI (Rock Stability Index) - `RsiScienceFigure.vue`

| Panel | Title | Content |
|-------|-------|---------|
| A | Phase Field Order Parameter | Gradient bar showing φ(x) from 0 (intact, blue) to 1 (fractured, red), with crack interface visualization |
| B | Crack Propagation Sequence | 4 time steps (t₀→t₃) showing crack growth with damage zone ellipses |
| C | Griffith Energy Balance | Line graph showing strain energy release rate G vs crack length a, with critical G_c threshold |
| D | RSI Computation Flow | Flowchart: Input parameters → Energy calculation → Phase evolution → RSI output |

### BRI (Burst Risk Index) - `BriScienceFigure.vue`

| Panel | Title | Content |
|-------|-------|---------|
| A | Seismic Waveform Analysis | Time-series with P-wave and S-wave arrivals marked, amplitude envelope |
| B | Moment Tensor Components | Three beachball diagrams (ISO, DC, CLVD) with percentage decomposition bar |
| C | Depth-Risk Relationship | Line graph showing risk vs depth, with hard layer and coal seam annotations |
| D | BRI Computation Flow | Flowchart: Waveform input → Tensor inversion → Depth correction → BRI output |

### ASI (Activity Stress Index) - `AsiScienceFigure.vue`

| Panel | Title | Content |
|-------|-------|---------|
| A | Kirsch Stress Distribution | Circular opening with stress concentration contours (σ_θ, σ_r color map) |
| B | UST Failure Envelope | τ vs σ plot with Mohr-Coulomb (b=0), UST (b=0.5), and Twin-Shear (b=1) curves |
| C | Mohr Stress Circles | Three Mohr circles representing different stress states with failure line |
| D | ASI Computation Flow | Flowchart: Boundary conditions → Kirsch solution → UST evaluation → ASI output |

### DBN (Dynamic Bayesian Network) - `DbnScienceFigure.vue`

| Panel | Title | Content |
|-------|-------|---------|
| A | Network Architecture | Three time slices (t-1, t, t+1) with nodes (O, H, R) and temporal edges |
| B | Conditional Probabilities | Heatmap or bar chart showing P(H_t | H_{t-1}) transition matrix |
| C | Inference Process | Diagram showing evidence propagation through network with message passing |
| D | Risk Evolution Timeline | Line graph showing posterior probability P(Risk | Evidence) over time steps |

## Technical Implementation

### Component Structure
```
frontend/src/components/academic/
├── RsiScienceFigure.vue      # RSI 4-panel figure
├── BriScienceFigure.vue      # BRI 4-panel figure
├── AsiScienceFigure.vue      # ASI 4-panel figure
├── DbnScienceFigure.vue      # DBN 4-panel figure
└── AcademicIndicatorsPanel.vue  # Updated to use new figures
```

### Shared Utilities
- Create a `useScienceFigureStyles.js` composable for consistent styling
- Define color constants and typography mixins
- Shared SVG marker definitions (arrows, patterns)

### Props Interface
Each figure component will accept:
```typescript
interface ScienceFigureProps {
  aa: (key: string) => string  // Translation function
  size?: 'compact' | 'full'     // Size variant
}
```

### Internationalization
All text labels will use the existing `aa()` translation function. New keys will be added to:
- `frontend/src/locales/zh-CN.js`
- `frontend/src/locales/en-US.js`

## Files to Modify

1. **Create new files:**
   - `RsiScienceFigure.vue`
   - `BriScienceFigure.vue`
   - `AsiScienceFigure.vue`
   - `DbnScienceFigure.vue`

2. **Modify existing files:**
   - `AcademicIndicatorsPanel.vue` - Replace AlgorithmFigureAtlas import with new components
   - `zh-CN.js` - Add new translation keys
   - `en-US.js` - Add new translation keys

3. **Delete:**
   - `AlgorithmFigureAtlas.vue` (after replacement is complete)

## Success Criteria
- All 4 algorithms have custom, scientifically accurate figures
- Figures follow Science/Nature journal visual standards
- Responsive design works on desktop and tablet viewports
- All text is internationalized (Chinese + English)
- SVG graphics are crisp at all zoom levels
- Consistent styling across all 4 figures
