/**
 * 矿压数据预处理模块
 * Mine Pressure Data Processor
 *
 * 用于处理液压支架末阻力数据，生成热力图矩阵和统计分析
 */

// ============================================================================
// 类型定义 (JSDoc)
// ============================================================================

/**
 * @typedef {Object} RawPressureRecord
 * @property {string} workFaceName - 工作面名称
 * @property {number} supportId - 支架号
 * @property {string} columnType - 柱类型 (前左柱/后右柱)
 * @property {Date} cycleStartTime - 循环开始时间
 * @property {Date} cycleEndTime - 循环结束时间
 * @property {Date} finalResistanceTime - 末阻力时间
 * @property {number} finalResistanceValue - 末阻力值 (MPa)
 */

/**
 * @typedef {Object} AggregatedRecord
 * @property {Date} date - 日期
 * @property {number} supportId - 支架号
 * @property {string} columnType - 柱类型
 * @property {number} mean - 均值
 * @property {number} std - 标准差
 * @property {number} count - 样本数
 * @property {number} advanceDistance - 推进距离 (m)
 */

/**
 * @typedef {Object} HeatmapCell
 * @property {number} row - 行索引
 * @property {number} col - 列索引
 * @property {number} x - X坐标
 * @property {number} y - Y坐标
 * @property {number} value - 阻力值
 * @property {Date} date - 日期
 * @property {number} supportId - 支架号
 * @property {number} std - 标准差
 * @property {number} count - 样本数
 */

/**
 * @typedef {Object} PressureStats
 * @property {number} mean - 均值
 * @property {number} std - 标准差
 * @property {number} min - 最小值
 * @property {number} max - 最大值
 * @property {number} median - 中位数
 * @property {number} q1 - 第一四分位数
 * @property {number} q3 - 第三四分位数
 * @property {number} n - 样本数
 */

/**
 * @typedef {Object} CycleDetectionResult
 * @property {number[]} periods - 各周期长度
 * @property {Date[]} peaks - 峰值日期
 * @property {number} meanPeriod - 平均周期
 * @property {number} stdPeriod - 周期标准差
 */

// ============================================================================
// 工作面坐标配置
// ============================================================================

/**
 * 02 工作面边界坐标
 * 来源: 1-工作面四个圈定坐标点.xlsx
 */
export const WORKFACE_BOUNDS = {
  // 四角坐标 (CGCS2000)
  corners: {
    BJ1: { x: 493827.2631, y: 5403730.276 }, // 西南角
    BJ2: { x: 495204.7150, y: 5403730.059 }, // 东南角
    BJ3: { x: 495204.7150, y: 5403525.741 }, // 东北角
    BJ4: { x: 493827.2631, y: 5403526.016 }, // 西北角
  },
  // 计算尺寸
  dimensions: {
    length: 1377.46, // 走向长度 (m)
    width: 204.54,   // 倾向宽度 (m)
  },
  // 支架配置
  supports: {
    count: 125,
    spacing: 11, // 支架间距 (m)
  },
  // 推进配置
  advance: {
    speed: 10, // 推进速度 (m/天)
    direction: 'north', // 推进方向
  }
}

/**
 * 敏东采区边界坐标
 * 来源: 敏东采区坐标.csv
 */
export const MINING_AREA_BOUNDS = {
  vertices: [
    { x: 498958.8109, y: 5405677.7 },
    { x: 495625.2405, y: 5405808.045 },
    { x: 495683.992, y: 5405751.926 },
    { x: 495685.6996, y: 5405672.939 },
    { x: 495603.0531, y: 5405610.878 },
    { x: 495603.0673, y: 5404851.351 },
    { x: 495687.4409, y: 5404819.902 },
    { x: 495693.6678, y: 5404712.835 },
    { x: 495601.8241, y: 5404671.804 },
    { x: 495601.8241, y: 5404270.607 },
    { x: 496085.1344, y: 5404272.579 },
    { x: 496085.1344, y: 5404207.591 },
    { x: 496177.6283, y: 5404207.591 },
    { x: 496171.0123, y: 5403933.395 },
    { x: 498958.8109, y: 5403926.114 },
  ],
  // 边界范围
  bounds: {
    minX: 495601.82,
    maxX: 498958.81,
    minY: 5403926.11,
    maxY: 5405808.05,
  }
}

// ============================================================================
// 基础统计函数
// ============================================================================

/**
 * 计算均值
 * @param {number[]} data
 * @returns {number}
 */
export function mean(data) {
  if (!data || data.length === 0) return NaN
  const valid = data.filter(v => Number.isFinite(v))
  if (valid.length === 0) return NaN
  return valid.reduce((sum, v) => sum + v, 0) / valid.length
}

/**
 * 计算标准差
 * @param {number[]} data
 * @param {boolean} population - 是否为总体标准差
 * @returns {number}
 */
export function std(data, population = false) {
  if (!data || data.length === 0) return NaN
  const valid = data.filter(v => Number.isFinite(v))
  if (valid.length === 0) return NaN
  const m = mean(valid)
  const sqDiffs = valid.map(v => Math.pow(v - m, 2))
  const variance = sqDiffs.reduce((sum, v) => sum + v, 0) / (population ? valid.length : valid.length - 1)
  return Math.sqrt(variance)
}

/**
 * 计算中位数
 * @param {number[]} data
 * @returns {number}
 */
export function median(data) {
  if (!data || data.length === 0) return NaN
  const valid = data.filter(v => Number.isFinite(v)).sort((a, b) => a - b)
  if (valid.length === 0) return NaN
  const mid = Math.floor(valid.length / 2)
  return valid.length % 2 !== 0 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2
}

/**
 * 计算四分位数
 * @param {number[]} data
 * @param {number} q - 分位数 (0-1)
 * @returns {number}
 */
export function quartile(data, q) {
  if (!data || data.length === 0) return NaN
  const valid = data.filter(v => Number.isFinite(v)).sort((a, b) => a - b)
  if (valid.length === 0) return NaN
  const pos = (valid.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (rest === 0) return valid[base]
  return valid[base] + rest * (valid[base + 1] - valid[base])
}

/**
 * 计算完整统计量
 * @param {number[]} data
 * @returns {PressureStats}
 */
export function calculateStats(data) {
  const valid = data.filter(v => Number.isFinite(v))
  return {
    mean: mean(valid),
    std: std(valid),
    min: Math.min(...valid),
    max: Math.max(...valid),
    median: median(valid),
    q1: quartile(valid, 0.25),
    q3: quartile(valid, 0.75),
    n: valid.length
  }
}

// ============================================================================
// 日期工具函数
// ============================================================================

/**
 * 计算两个日期之间的天数差
 * @param {Date} date1
 * @param {Date} date2
 * @returns {number}
 */
export function dateDiff(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * 获取日期的字符串键 (YYYY-MM-DD)
 * @param {Date} date
 * @returns {string}
 */
export function getDateKey(date) {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

/**
 * 获取日期范围
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Date[]}
 */
export function getDateRange(startDate, endDate) {
  const dates = []
  const current = new Date(startDate)
  const end = new Date(endDate)
  while (current <= end) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

// ============================================================================
// 坐标映射函数
// ============================================================================

/**
 * 支架号 → X坐标
 * @param {number} supportId - 支架号 (1-125)
 * @returns {number}
 */
export function supportToX(supportId) {
  const startX = WORKFACE_BOUNDS.corners.BJ1.x
  const spacing = WORKFACE_BOUNDS.supports.spacing
  return startX + (supportId - 1) * spacing
}

/**
 * 推进距离 → Y坐标
 * @param {number} advanceDistance - 推进距离 (m)
 * @returns {number}
 */
export function advanceToY(advanceDistance) {
  const baseY = WORKFACE_BOUNDS.corners.BJ4.y
  return baseY + advanceDistance
}

/**
 * 日期 → 推进距离
 * @param {Date} date
 * @param {Date} startDate
 * @returns {number}
 */
export function dateToAdvanceDistance(date, startDate) {
  const days = dateDiff(date, startDate)
  return days * WORKFACE_BOUNDS.advance.speed
}

/**
 * 日期 → Y坐标
 * @param {Date} date
 * @param {Date} startDate
 * @returns {number}
 */
export function dateToY(date, startDate) {
  const distance = dateToAdvanceDistance(date, startDate)
  return advanceToY(distance)
}

// ============================================================================
// 数据处理主函数
// ============================================================================

/**
 * 解析 CSV 行
 * @param {string} line
 * @returns {string[]}
 */
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

/**
 * 加载原始 CSV 数据
 * @param {string} csvContent - CSV 文件内容
 * @returns {RawPressureRecord[]}
 */
export function loadRawData(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim())

  // 跳过标题行 (前两行)
  if (lines.length < 3) return []

  const records = []
  for (let i = 2; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i])
    if (fields.length < 7) continue

    const record = {
      workFaceName: fields[0],
      supportId: parseInt(fields[1], 10),
      columnType: fields[2],
      cycleStartTime: new Date(fields[3]),
      cycleEndTime: new Date(fields[4]),
      finalResistanceTime: new Date(fields[5]),
      finalResistanceValue: parseFloat(fields[6])
    }

    // 验证数据
    if (Number.isFinite(record.supportId) &&
        Number.isFinite(record.finalResistanceValue) &&
        !isNaN(record.finalResistanceTime.getTime())) {
      records.push(record)
    }
  }

  return records
}

/**
 * 按天聚合数据
 * @param {RawPressureRecord[]} rawData
 * @param {string} columnType - 柱类型 ('all' | '前左柱' | '后右柱')
 * @returns {Map<string, Map<number, { mean: number, std: number, count: number, values: number[] }>>}
 */
export function aggregateByDay(rawData, columnType = 'all') {
  // 筛选柱类型
  const filtered = columnType === 'all'
    ? rawData
    : rawData.filter(r => r.columnType === columnType)

  // 按日期和支架号分组
  const grouped = new Map()

  for (const record of filtered) {
    const dateKey = getDateKey(record.finalResistanceTime)

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, new Map())
    }

    const dayMap = grouped.get(dateKey)
    if (!dayMap.has(record.supportId)) {
      dayMap.set(record.supportId, [])
    }

    dayMap.get(record.supportId).push(record.finalResistanceValue)
  }

  // 计算统计量
  for (const [dateKey, dayMap] of grouped) {
    for (const [supportId, values] of dayMap) {
      dayMap.set(supportId, {
        mean: mean(values),
        std: std(values),
        count: values.length,
        values
      })
    }
  }

  return grouped
}

/**
 * 生成热力图矩阵
 * @param {Map<string, Map<number, { mean: number, std: number, count: number }>>} aggregatedData
 * @param {Object} config
 * @param {Date} config.startDate - 起始日期
 * @param {Date} config.endDate - 结束日期
 * @param {number} config.numSupports - 支架数量
 * @returns {{ matrix: number[][], stats: PressureStats, cells: HeatmapCell[] }}
 */
export function generateHeatmapMatrix(aggregatedData, config) {
  const { startDate, endDate, numSupports = 125 } = config

  const dates = getDateRange(startDate, endDate)
  const numRows = dates.length
  const numCols = numSupports

  // 初始化矩阵
  const matrix = Array(numRows).fill(null).map(() => Array(numCols).fill(NaN))
  const cells = []
  const allValues = []

  // 填充矩阵
  for (let row = 0; row < numRows; row++) {
    const date = dates[row]
    const dateKey = getDateKey(date)
    const dayData = aggregatedData.get(dateKey)

    if (dayData) {
      for (const [supportId, stats] of dayData) {
        const col = supportId - 1
        if (col >= 0 && col < numCols) {
          matrix[row][col] = stats.mean
          allValues.push(stats.mean)

          cells.push({
            row,
            col,
            x: supportToX(supportId),
            y: dateToY(date, startDate),
            value: stats.mean,
            date: new Date(date),
            supportId,
            std: stats.std,
            count: stats.count
          })
        }
      }
    }
  }

  return {
    matrix,
    stats: calculateStats(allValues),
    cells,
    numRows,
    numCols
  }
}

/**
 * 检测来压周期
 * @param {number[]} timeSeries - 时间序列数据
 * @param {Object} options
 * @param {number} options.threshold - 峰值检测阈值 (标准差倍数)
 * @param {number} options.minDistance - 最小峰间距 (数据点数)
 * @returns {CycleDetectionResult}
 */
export function detectPressureCycles(timeSeries, options = {}) {
  const { threshold = 1.5, minDistance = 5 } = options

  const m = mean(timeSeries)
  const s = std(timeSeries)
  const peakThreshold = m + threshold * s

  // 检测峰值
  const peaks = []
  for (let i = 1; i < timeSeries.length - 1; i++) {
    if (timeSeries[i] > peakThreshold &&
        timeSeries[i] > timeSeries[i - 1] &&
        timeSeries[i] > timeSeries[i + 1]) {
      // 检查与上一个峰的距离
      if (peaks.length === 0 || i - peaks[peaks.length - 1] >= minDistance) {
        peaks.push(i)
      }
    }
  }

  // 计算周期
  const periods = []
  for (let i = 1; i < peaks.length; i++) {
    periods.push(peaks[i] - peaks[i - 1])
  }

  return {
    periods,
    peaks: peaks.map(i => timeSeries[i]),
    peakIndices: peaks,
    meanPeriod: periods.length > 0 ? mean(periods) : 0,
    stdPeriod: periods.length > 1 ? std(periods) : 0,
    numCycles: periods.length
  }
}

/**
 * 检测异常值
 * @param {number[]} data
 * @param {number} threshold - Z-score 阈值
 * @returns {{ outliers: number[], indices: number[], threshold: number }}
 */
export function detectAnomalies(data, threshold = 2) {
  const m = mean(data)
  const s = std(data)

  const outliers = []
  const indices = []

  data.forEach((value, index) => {
    const zScore = Math.abs((value - m) / s)
    if (zScore > threshold) {
      outliers.push(value)
      indices.push(index)
    }
  })

  return {
    outliers,
    indices,
    threshold,
    upperBound: m + threshold * s,
    lowerBound: m - threshold * s
  }
}

/**
 * 计算支架相关性矩阵
 * @param {number[][]} matrix - 热力图矩阵 (行=时间, 列=支架)
 * @returns {number[][]} 相关性矩阵
 */
export function calculateCorrelationMatrix(matrix) {
  const numCols = matrix[0]?.length || 0
  const corrMatrix = Array(numCols).fill(null).map(() => Array(numCols).fill(0))

  // 提取每列数据
  const columns = []
  for (let col = 0; col < numCols; col++) {
    const colData = matrix.map(row => row[col]).filter(v => Number.isFinite(v))
    columns.push(colData)
  }

  // 计算相关系数
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numCols; j++) {
      if (i === j) {
        corrMatrix[i][j] = 1
      } else {
        corrMatrix[i][j] = pearsonCorrelation(columns[i], columns[j])
      }
    }
  }

  return corrMatrix
}

/**
 * 计算皮尔逊相关系数
 * @param {number[]} x
 * @param {number[]} y
 * @returns {number}
 */
function pearsonCorrelation(x, y) {
  const n = Math.min(x.length, y.length)
  if (n === 0) return 0

  const meanX = mean(x)
  const meanY = mean(y)

  let num = 0
  let denX = 0
  let denY = 0

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX
    const dy = y[i] - meanY
    num += dx * dy
    denX += dx * dx
    denY += dy * dy
  }

  const den = Math.sqrt(denX * denY)
  return den === 0 ? 0 : num / den
}

/**
 * 计算累积分布函数 (CDF)
 * @param {number[]} data
 * @returns {{ x: number[], y: number[] }}
 */
export function calculateCDF(data) {
  const valid = data.filter(v => Number.isFinite(v)).sort((a, b) => a - b)
  const n = valid.length

  const x = []
  const y = []

  for (let i = 0; i < n; i++) {
    x.push(valid[i])
    y.push((i + 1) / n)
  }

  return { x, y }
}

/**
 * 按月分组数据
 * @param {RawPressureRecord[]} data
 * @returns {Map<string, number[]>}
 */
export function groupByMonth(data) {
  const grouped = new Map()

  for (const record of data) {
    const date = new Date(record.finalResistanceTime)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, [])
    }
    grouped.get(monthKey).push(record.finalResistanceValue)
  }

  return grouped
}

/**
 * 按支架分组数据
 * @param {RawPressureRecord[]} data
 * @returns {Map<number, number[]>}
 */
export function groupBySupport(data) {
  const grouped = new Map()

  for (const record of data) {
    if (!grouped.has(record.supportId)) {
      grouped.set(record.supportId, [])
    }
    grouped.get(record.supportId).push(record.finalResistanceValue)
  }

  return grouped
}

// ============================================================================
// 导出配置
// ============================================================================

export const PRESSURE_CONFIG = {
  // 热力图颜色配置
  colorScale: {
    diverging: ['#2166AC', '#F7F7F7', '#B2182B'],
    sequential: ['#440154', '#31688E', '#35B779', '#FDE725'],
    viridis: ['#440154', '#482878', '#3E4A89', '#31688E', '#26838F', '#1F9E89', '#35B779', '#6DCD59', '#B4DE2C', '#FDE725']
  },

  // 阻力阈值
  thresholds: {
    low: 10,    // 低阻力阈值 (MPa)
    high: 45,   // 高阻力阈值 (MPa)
    danger: 55  // 危险阈值 (MPa)
  },

  // Nature 期刊图表配置
  nature: {
    fontSize: {
      base: 7,
      label: 8,
      title: 9,
      panelLabel: 10
    },
    lineWidth: 0.5,
    markerSize: 4,
    chartWidth: {
      single: 89,  // mm
      double: 183  // mm
    },
    exportDPI: 300
  }
}

export default {
  // 坐标配置
  WORKFACE_BOUNDS,
  MINING_AREA_BOUNDS,

  // 统计函数
  mean,
  std,
  median,
  quartile,
  calculateStats,

  // 日期函数
  dateDiff,
  getDateKey,
  getDateRange,

  // 坐标映射
  supportToX,
  advanceToY,
  dateToAdvanceDistance,
  dateToY,

  // 数据处理
  loadRawData,
  aggregateByDay,
  generateHeatmapMatrix,

  // 分析函数
  detectPressureCycles,
  detectAnomalies,
  calculateCorrelationMatrix,
  calculateCDF,
  groupByMonth,
  groupBySupport,

  // 配置
  PRESSURE_CONFIG
}
