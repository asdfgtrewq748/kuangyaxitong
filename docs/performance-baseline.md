# Performance Baseline (Week2)

- Date: 2026-02-22
- Tool: Lighthouse 13.0.3
- Browser binary: Playwright Chromium (`ms-playwright`)
- Target env: local dev server (`frontend` on `5173`, `backend` on `8001`)
- Pages: Home (`/` -> `/algorithm-validation`) + 3 core pages (`/data`, `/interpolation`, `/report`)

## Scores

| Page | URL | Performance | Accessibility | Best Practices | SEO |
|---|---|---:|---:|---:|---:|
| Home | `http://127.0.0.1:5173/algorithm-validation` | 32 | 90 | 96 | 82 |
| Data Import | `http://127.0.0.1:5173/data` | 56 | 89 | 96 | 82 |
| Interpolation | `http://127.0.0.1:5173/interpolation` | 55 | 89 | 96 | 82 |
| Report | `http://127.0.0.1:5173/report` | 60 | 83 | 96 | 82 |

## Raw Reports

- `docs/lighthouse/home.json`
- `docs/lighthouse/data.json`
- `docs/lighthouse/interpolation.json`
- `docs/lighthouse/report.json`

## Quick Notes

1. Baseline was captured against Vite dev mode, so performance scores are conservative.
2. The home page is currently the bottleneck and should be first optimization target.
3. Accessibility is generally stable (83-90), while performance needs focused improvement.
