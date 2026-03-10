function toFiniteNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function normalizeSeries(data = []) {
  return data
    .map((item, index) => {
      const value = toFiniteNumber(item?.value)
      if (value === null) {
        return null
      }

      return {
        index,
        date: item?.date || `${index + 1}`,
        value,
        std: toFiniteNumber(item?.std) || 0
      }
    })
    .filter(Boolean)
}

function normalizeValues(values = []) {
  return values.map(toFiniteNumber).filter((value) => value !== null)
}

function mean(values = []) {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function standardDeviation(values = []) {
  if (values.length < 2) return 0
  const avg = mean(values)
  const variance = values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

function quantile(values = [], q = 0.5) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const position = (sorted.length - 1) * q
  const lower = Math.floor(position)
  const upper = Math.ceil(position)

  if (lower === upper) {
    return sorted[lower]
  }

  const weight = position - lower
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

export function calculateTrendLine(data = []) {
  const series = normalizeSeries(data)
  if (series.length < 2) return []

  const n = series.length
  const xMean = mean(series.map((item) => item.index))
  const yMean = mean(series.map((item) => item.value))

  const numerator = series.reduce(
    (sum, item) => sum + (item.index - xMean) * (item.value - yMean),
    0
  )
  const denominator = series.reduce((sum, item) => sum + (item.index - xMean) ** 2, 0)
  const slope = denominator === 0 ? 0 : numerator / denominator
  const intercept = yMean - slope * xMean

  return series.map((item) => ({
    date: item.date,
    value: slope * item.index + intercept
  }))
}

export function calculateConfidenceBands(data = [], zScore = 1.96) {
  const series = normalizeSeries(data)
  const trend = calculateTrendLine(series)

  if (series.length < 2 || !trend.length) {
    return { upper: [], lower: [], band: 0 }
  }

  const residuals = series.map((item, index) => item.value - trend[index].value)
  const residualStd = standardDeviation(residuals)
  const band = residualStd * zScore

  return {
    band,
    upper: trend.map((item) => ({ date: item.date, value: item.value + band })),
    lower: trend.map((item) => ({ date: item.date, value: item.value - band }))
  }
}

export function summarizeTimeSeries(data = []) {
  const series = normalizeSeries(data)
  const values = series.map((item) => item.value)
  if (!values.length) {
    return {
      count: 0,
      mean: 0,
      std: 0,
      median: 0,
      min: 0,
      max: 0,
      latest: 0,
      drift: 0,
      slope: 0,
      peak: null
    }
  }

  const avg = mean(values)
  const sd = standardDeviation(values)
  const peak = series.reduce((best, item) => (item.value > best.value ? item : best), series[0])
  const trend = calculateTrendLine(series)
  const slope =
    trend.length > 1 ? trend[trend.length - 1].value - trend[trend.length - 2].value : 0

  return {
    count: series.length,
    mean: avg,
    std: sd,
    median: quantile(values, 0.5),
    min: Math.min(...values),
    max: Math.max(...values),
    latest: values.at(-1),
    first: values[0],
    drift: values.at(-1) - values[0],
    slope,
    startDate: series[0].date,
    endDate: series.at(-1).date,
    peak: {
      date: peak.date,
      value: peak.value
    }
  }
}

export function summarizeDistribution(values = []) {
  const normalized = normalizeValues(values)
  if (!normalized.length) {
    return {
      count: 0,
      mean: 0,
      std: 0,
      min: 0,
      max: 0,
      p10: 0,
      p25: 0,
      p50: 0,
      p75: 0,
      p90: 0
    }
  }

  return {
    count: normalized.length,
    mean: mean(normalized),
    std: standardDeviation(normalized),
    min: Math.min(...normalized),
    max: Math.max(...normalized),
    p10: quantile(normalized, 0.1),
    p25: quantile(normalized, 0.25),
    p50: quantile(normalized, 0.5),
    p75: quantile(normalized, 0.75),
    p90: quantile(normalized, 0.9)
  }
}

export function calculateHistogram(values = [], bins = 20) {
  const normalized = normalizeValues(values)
  if (!normalized.length) {
    return { values: [], edges: [], centers: [], stats: summarizeDistribution([]) }
  }

  const min = Math.min(...normalized)
  const max = Math.max(...normalized)
  const safeBins = Math.max(1, bins)
  const width = max === min ? 1 : (max - min) / safeBins
  const edges = Array.from({ length: safeBins + 1 }, (_, index) => min + width * index)
  const counts = Array(safeBins).fill(0)

  for (const value of normalized) {
    const rawIndex = Math.floor((value - min) / width)
    const index = max === min ? 0 : Math.min(Math.max(rawIndex, 0), safeBins - 1)
    counts[index] += 1
  }

  return {
    values: counts,
    edges,
    centers: counts.map((_, index) => (edges[index] + edges[index + 1]) / 2),
    stats: summarizeDistribution(normalized)
  }
}

export function calculateKDE(values = [], points = 120) {
  const normalized = normalizeValues(values)
  if (normalized.length < 2) return []

  const min = Math.min(...normalized)
  const max = Math.max(...normalized)
  const sd = standardDeviation(normalized) || 1
  const bandwidth = 1.06 * sd * normalized.length ** (-0.2) || 1

  return Array.from({ length: points }, (_, index) => {
    const x = min + ((max - min) * index) / Math.max(points - 1, 1)
    const density =
      normalized.reduce((sum, value) => {
        const u = (x - value) / bandwidth
        return sum + Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI)
      }, 0) /
      (normalized.length * bandwidth)

    return {
      x,
      y: density
    }
  })
}

export { quantile }
