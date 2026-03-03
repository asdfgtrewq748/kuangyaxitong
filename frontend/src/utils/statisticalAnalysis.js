/**
 * 统计分析模块 - 科研级别统计计算
 * Statistical Analysis Module for Scientific Research
 */

// ============================================================================
// 基础统计检验
// ============================================================================

/**
 * 单样本t检验
 * @param {number[]} sample - 样本数据
 * @param {number} mu0 - 假设均值
 * @returns {{ t: number, pValue: number, significant: boolean }}
 */
export function oneSampleTTest(sample, mu0 = 0) {
  const n = sample.length
  if (n < 2) return { t: NaN, pValue: NaN, significant: false }
  
  const mean = sample.reduce((a, b) => a + b, 0) / n
  const variance = sample.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1)
  const std = Math.sqrt(variance)
  
  const t = (mean - mu0) / (std / Math.sqrt(n))
  const df = n - 1
  const pValue = 2 * (1 - studentTCDF(Math.abs(t), df))
  
  return {
    t,
    df,
    pValue,
    mean,
    std,
    significant: pValue < 0.05,
    ci95: [mean - 1.96 * std / Math.sqrt(n), mean + 1.96 * std / Math.sqrt(n)]
  }
}

/**
 * 双样本t检验（独立样本）
 * @param {number[]} sample1 - 第一组样本
 * @param {number[]} sample2 - 第二组样本
 */
export function twoSampleTTest(sample1, sample2) {
  const n1 = sample1.length
  const n2 = sample2.length
  
  const mean1 = sample1.reduce((a, b) => a + b, 0) / n1
  const mean2 = sample2.reduce((a, b) => a + b, 0) / n2
  
  const var1 = sample1.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0) / (n1 - 1)
  const var2 = sample2.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0) / (n2 - 1)
  
  // Welch's t-test (不假设方差齐性)
  const se = Math.sqrt(var1 / n1 + var2 / n2)
  const t = (mean1 - mean2) / se
  
  // Welch-Satterthwaite自由度近似
  const df = Math.pow(var1 / n1 + var2 / n2, 2) / 
    (Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1))
  
  const pValue = 2 * (1 - studentTCDF(Math.abs(t), df))
  
  return {
    t,
    df,
    pValue,
    mean1,
    mean2,
    diff: mean1 - mean2,
    significant: pValue < 0.05,
    effectSize: (mean1 - mean2) / Math.sqrt((var1 + var2) / 2) // Cohen's d
  }
}

/**
 * Mann-Whitney U检验（非参数检验）
 * @param {number[]} sample1 
 * @param {number[]} sample2 
 */
export function mannWhitneyUTest(sample1, sample2) {
  const combined = [
    ...sample1.map(x => ({ value: x, group: 1 })),
    ...sample2.map(x => ({ value: x, group: 2 }))
  ].sort((a, b) => a.value - b.value)
  
  // 分配秩次
  const ranks = combined.map((item, index) => ({ ...item, rank: index + 1 }))
  
  const R1 = ranks.filter(r => r.group === 1).reduce((sum, r) => sum + r.rank, 0)
  const n1 = sample1.length
  const n2 = sample2.length
  
  const U1 = R1 - (n1 * (n1 + 1)) / 2
  const U2 = n1 * n2 - U1
  const U = Math.min(U1, U2)
  
  // 正态近似
  const mu = (n1 * n2) / 2
  const sigma = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12)
  const z = (U - mu) / sigma
  
  // 双尾p值
  const pValue = 2 * (1 - normalCDF(Math.abs(z)))
  
  return {
    U,
    z,
    pValue,
    significant: pValue < 0.05,
    median1: median(sample1),
    median2: median(sample2)
  }
}

/**
 * Kruskal-Wallis H检验（多组非参数检验）
 * @param {number[][]} groups - 多组样本
 */
export function kruskalWallisTest(groups) {
  const allData = groups.flat()
  const ranked = rankData(allData)
  
  let rankIndex = 0
  const groupRanks = groups.map(group => {
    const groupRankSum = ranked
      .slice(rankIndex, rankIndex + group.length)
      .reduce((sum, r) => sum + r.rank, 0)
    rankIndex += group.length
    return { n: group.length, rankSum: groupRankSum }
  })
  
  const N = allData.length
  const H = (12 / (N * (N + 1))) * groupRanks.reduce((sum, g) => sum + g.rankSum ** 2 / g.n, 0) - 3 * (N + 1)
  
  const df = groups.length - 1
  const pValue = 1 - chiSquareCDF(H, df)
  
  return {
    H,
    df,
    pValue,
    significant: pValue < 0.05
  }
}

// ============================================================================
// 相关性分析
// ============================================================================

/**
 * Pearson相关系数及显著性检验
 * @param {number[]} x 
 * @param {number[]} y 
 */
export function pearsonCorrelation(x, y) {
  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)
  
  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2))
  
  const r = numerator / denominator
  
  // t检验显著性
  const t = r * Math.sqrt((n - 2) / (1 - r ** 2))
  const pValue = 2 * (1 - studentTCDF(Math.abs(t), n - 2))
  
  return {
    r,
    rSquared: r ** 2,
    t,
    pValue,
    significant: pValue < 0.05,
    n
  }
}

/**
 * Spearman秩相关系数
 * @param {number[]} x 
 * @param {number[]} y 
 */
export function spearmanCorrelation(x, y) {
  const rankX = getRanks(x)
  const rankY = getRanks(y)
  return pearsonCorrelation(rankX, rankY)
}

// ============================================================================
// 回归分析
// ============================================================================

/**
 * 简单线性回归
 * @param {number[]} x - 自变量
 * @param {number[]} y - 因变量
 */
export function linearRegression(x, y) {
  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2)
  const intercept = (sumY - slope * sumX) / n
  
  // 预测值和残差
  const predictions = x.map(xi => slope * xi + intercept)
  const residuals = y.map((yi, i) => yi - predictions[i])
  
  // R²
  const ssRes = residuals.reduce((sum, r) => sum + r * r, 0)
  const yMean = sumY / n
  const ssTot = y.reduce((sum, yi) => sum + (yi - yMean) ** 2, 0)
  const rSquared = 1 - ssRes / ssTot
  
  // 标准误差
  const mse = ssRes / (n - 2)
  const seSlope = Math.sqrt(mse / (sumX2 - sumX ** 2 / n))
  const seIntercept = Math.sqrt(mse * (1 / n + sumX ** 2 / (n * sumX2 - sumX ** 2)))
  
  // 置信区间 (95%)
  const tCrit = 1.96 // 近似值
  const slopeCI = [slope - tCrit * seSlope, slope + tCrit * seSlope]
  const interceptCI = [intercept - tCrit * seIntercept, intercept + tCrit * seIntercept]
  
  return {
    slope,
    intercept,
    rSquared,
    rmse: Math.sqrt(mse),
    seSlope,
    seIntercept,
    slopeCI,
    interceptCI,
    equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
    predict: (x) => slope * x + intercept
  }
}

// ============================================================================
// 时间序列分析
// ============================================================================

/**
 * 自相关函数 (ACF)
 * @param {number[]} data - 时间序列数据
 * @param {number} maxLag - 最大滞后阶数
 */
export function autocorrelation(data, maxLag = 20) {
  const n = data.length
  const mean = data.reduce((a, b) => a + b, 0) / n
  const c0 = data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / n
  
  const acf = []
  for (let lag = 0; lag <= maxLag; lag++) {
    let c = 0
    for (let t = 0; t < n - lag; t++) {
      c += (data[t] - mean) * (data[t + lag] - mean)
    }
    c /= n
    acf.push({ lag, value: c / c0 })
  }
  
  // 95% 置信区间 (近似)
  const confBound = 1.96 / Math.sqrt(n)
  
  return { acf, confBound }
}

/**
 * Durbin-Watson检验（自相关检验）
 * @param {number[]} residuals - 回归残差
 */
export function durbinWatsonTest(residuals) {
  const n = residuals.length
  let numerator = 0
  let denominator = residuals[0] ** 2
  
  for (let i = 1; i < n; i++) {
    numerator += (residuals[i] - residuals[i - 1]) ** 2
    denominator += residuals[i] ** 2
  }
  
  const dw = numerator / denominator
  
  // 解释: dw ≈ 2 表示无自相关, dw < 2 表示正自相关, dw > 2 表示负自相关
  return {
    statistic: dw,
    interpretation: dw < 1.5 ? '存在正自相关' : dw > 2.5 ? '存在负自相关' : '无显著自相关'
  }
}

// ============================================================================
// 效应量计算
// ============================================================================

/**
 * Cohen's d (效应量)
 * @param {number[]} group1 
 * @param {number[]} group2 
 */
export function cohensD(group1, group2) {
  const mean1 = group1.reduce((a, b) => a + b, 0) / group1.length
  const mean2 = group2.reduce((a, b) => a + b, 0) / group2.length
  
  const var1 = variance(group1)
  const var2 = variance(group2)
  
  // 合并标准差
  const pooledSD = Math.sqrt(((group1.length - 1) * var1 + (group2.length - 1) * var2) / 
    (group1.length + group2.length - 2))
  
  const d = (mean1 - mean2) / pooledSD
  
  // 解释
  let interpretation = '小效应'
  if (Math.abs(d) >= 0.5) interpretation = '中等效应'
  if (Math.abs(d) >= 0.8) interpretation = '大效应'
  
  return { d, interpretation, magnitude: Math.abs(d) }
}

// ============================================================================
// 辅助函数
// ============================================================================

function studentTCDF(t, df) {
  // 简化的t分布CDF近似
  const x = df / (df + t * t)
  const a = df / 2
  const b = 0.5
  return 1 - 0.5 * incompleteBeta(x, a, b)
}

function normalCDF(x) {
  return 0.5 * (1 + erf(x / Math.sqrt(2)))
}

function chiSquareCDF(x, k) {
  // 简化的卡方分布CDF
  return incompleteGamma(x / 2, k / 2)
}

function incompleteBeta(x, a, b) {
  // 简化的不完全Beta函数
  return Math.pow(x, a) / a // 粗略近似
}

function incompleteGamma(s, x) {
  // 简化的不完全Gamma函数
  let sum = 0
  for (let n = 0; n < 20; n++) {
    sum += Math.pow(x, n) / factorial(n) / (s + n)
  }
  return Math.pow(x, s) * Math.exp(-x) * sum
}

function erf(x) {
  // 误差函数近似
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  
  const sign = x < 0 ? -1 : 1
  x = Math.abs(x)
  
  const t = 1 / (1 + p * x)
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)
  
  return sign * y
}

function factorial(n) {
  if (n <= 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

function median(data) {
  const sorted = [...data].sort((a, b) => a - b)
  const n = sorted.length
  return n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]
}

function variance(data) {
  const mean = data.reduce((a, b) => a + b, 0) / data.length
  return data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (data.length - 1)
}

function getRanks(data) {
  const sorted = data.map((x, i) => ({ value: x, index: i }))
    .sort((a, b) => a.value - b.value)
  
  const ranks = new Array(data.length)
  sorted.forEach((item, i) => {
    ranks[item.index] = i + 1
  })
  return ranks
}

function rankData(data) {
  return data.map((value, i) => ({ value, rank: getRanks(data)[i] }))
}

// ============================================================================
// 导出
// ============================================================================

export default {
  oneSampleTTest,
  twoSampleTTest,
  mannWhitneyUTest,
  kruskalWallisTest,
  pearsonCorrelation,
  spearmanCorrelation,
  linearRegression,
  autocorrelation,
  durbinWatsonTest,
  cohensD
}
