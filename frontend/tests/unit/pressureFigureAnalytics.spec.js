import {
  calculateConfidenceBands,
  calculateHistogram,
  calculateTrendLine,
  summarizeDistribution,
  summarizeTimeSeries
} from '@/utils/pressureFigureAnalytics'

describe('pressureFigureAnalytics', () => {
  it('summarizes time-series statistics and drift', () => {
    const summary = summarizeTimeSeries([
      { date: '2026-01-01', value: 20, std: 0.5 },
      { date: '2026-01-02', value: 22, std: 0.6 },
      { date: '2026-01-03', value: 25, std: 0.9 },
      { date: '2026-01-04', value: 28, std: 0.7 }
    ])

    expect(summary.count).toBe(4)
    expect(summary.mean).toBe(23.75)
    expect(summary.latest).toBe(28)
    expect(summary.peak.value).toBe(28)
    expect(summary.drift).toBe(8)
    expect(summary.slope).toBeGreaterThan(0)
  })

  it('builds trend line and confidence envelope for the series', () => {
    const data = [
      { date: '2026-01-01', value: 20 },
      { date: '2026-01-02', value: 21 },
      { date: '2026-01-03', value: 22 },
      { date: '2026-01-04', value: 24 }
    ]

    const trend = calculateTrendLine(data)
    const bands = calculateConfidenceBands(data)

    expect(trend).toHaveLength(4)
    expect(bands.lower).toHaveLength(4)
    expect(bands.upper[3].value).toBeGreaterThan(bands.lower[3].value)
  })

  it('summarizes the distribution and constructs histogram bins', () => {
    const values = [8, 9, 9, 10, 11, 12, 14, 15, 18, 20]
    const summary = summarizeDistribution(values)
    const histogram = calculateHistogram(values, 4)

    expect(summary.count).toBe(10)
    expect(summary.p50).toBe(11.5)
    expect(summary.p90).toBeGreaterThan(summary.p50)
    expect(histogram.values).toHaveLength(4)
    expect(histogram.values.reduce((sum, value) => sum + value, 0)).toBe(10)
  })
})
