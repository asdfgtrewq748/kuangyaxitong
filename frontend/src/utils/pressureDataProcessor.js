/**
 * 矿压数据预处理模块 - 修正版
 * 
 * 正确的空间关系：
 * - X轴：推进距离（工作面推进方向）
 * - Y轴：支架编号（工作面宽度方向）
 * - 工作面是一个矩形区域，采区是包含工作面的更大区域
 */

// ============================================================================
// 工作面和采区边界配置
// ============================================================================

/**
 * 02 工作面边界坐标 (CGCS2000)
 */
export const WORKFACE_BOUNDS = {
  corners: {
    BJ1: { x: 493827.2631, y: 5403730.276 }, // 西南角 (推进起点, 支架1端)
    BJ2: { x: 495204.7150, y: 5403730.059 }, // 东南角 (推进终点, 支架1端)
    BJ3: { x: 495204.7150, y: 5403525.741 }, // 东北角 (推进终点, 支架125端)
    BJ4: { x: 493827.2631, y: 5403526.016 }, // 西北角 (推进起点, 支架125端)
  },
  dimensions: {
    length: 1377.46,  // 走向长度 = 推进方向 (X轴)
    width: 204.54,    // 倾向宽度 = 支架排列方向 (Y轴)
  },
  supports: {
    count: 125,
    spacing: 1.636,   // 支架间距 = 204.54m / 125 = 1.636m
  },
  advance: {
    speed: 10,        // 推进速度 (m/天)
    direction: 'north',
  }
}

/**
 * 敏东采区边界坐标
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
  bounds: {
    minX: 495601.82, maxX: 498958.81,
    minY: 5403926.11, maxY: 5405808.05,
  }
}

// ============================================================================
// 基础统计函数
// ============================================================================

export function mean(data) {
  if (!data || data.length === 0) return NaN
  const valid = data.filter(v => Number.isFinite(v))
  if (valid.length === 0) return NaN
  return valid.reduce((sum, v) => sum + v, 0) / valid.length
}

export function std(data, population = false) {
  if (!data || data.length === 0) return NaN
  const valid = data.filter(v => Number.isFinite(v))
  if (valid.length === 0) return NaN
  const m = mean(valid)
  const sqDiffs = valid.map(v => Math.pow(v - m, 2))
  const variance = sqDiffs.reduce((sum, v) => sum + v, 0) / (population ? valid.length : valid.length - 1)
  return Math.sqrt(variance)
}

export function calculateStats(data) {
  const valid = data.filter(v => Number.isFinite(v))
  if (valid.length === 0) return { mean: NaN, std: NaN, min: NaN, max: NaN, n: 0 }
  return {
    mean: mean(valid),
    std: std(valid),
    min: Math.min(...valid),
    max: Math.max(...valid),
    n: valid.length
  }
}

// ============================================================================
// 日期工具函数
// ============================================================================

export function getDateKey(date) {
  return new Date(date).toISOString().split('T')[0]
}

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

export function dateDiff(date1, date2) {
  return Math.floor((new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24))
}

// ============================================================================
// 空间坐标转换函数
// ============================================================================

/**
 * 推进距离 → X坐标 (CGCS2000)
 * @param {number} advanceDistance - 从工作面起点开始的推进距离 (m)
 */
export function advanceDistanceToX(advanceDistance) {
  const startX = WORKFACE_BOUNDS.corners.BJ1.x
  const angle = Math.atan2(
    WORKFACE_BOUNDS.corners.BJ2.y - WORKFACE_BOUNDS.corners.BJ1.y,
    WORKFACE_BOUNDS.corners.BJ2.x - WORKFACE_BOUNDS.corners.BJ1.x
  )
  return startX + advanceDistance * Math.cos(angle)
}

/**
 * 支架号 → Y坐标 (CGCS2000)
 * @param {number} supportId - 支架号 (1-125)
 */
export function supportIdToY(supportId) {
  // 支架1在BJ1-BJ2边，支架125在BJ4-BJ3边
  const ratio = (supportId - 1) / (WORKFACE_BOUNDS.supports.count - 1)
  const y1 = WORKFACE_BOUNDS.corners.BJ1.y
  const y2 = WORKFACE_BOUNDS.corners.BJ4.y
  return y1 + (y2 - y1) * ratio
}

/**
 * 日期 → 推进距离
 * @param {Date} date - 当前日期
 * @param {Date} startDate - 开始日期
 */
export function dateToAdvanceDistance(date, startDate) {
  const days = dateDiff(startDate, date)
  return days * WORKFACE_BOUNDS.advance.speed
}

// ============================================================================
// 数据加载和聚合
// ============================================================================

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

export function loadRawData(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim())
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

    if (Number.isFinite(record.supportId) && 
        Number.isFinite(record.finalResistanceValue) &&
        !isNaN(record.finalResistanceTime.getTime())) {
      records.push(record)
    }
  }
  return records
}

/**
 * 按日期聚合数据 - 正确的数据结构
 * 返回: Map<dateKey, Map<supportId, stats>>
 */
export function aggregateByDay(rawData, columnType = 'all') {
  const filtered = columnType === 'all'
    ? rawData
    : rawData.filter(r => r.columnType === columnType)

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

// ============================================================================
// 热力图矩阵生成 - 修正版 (X=推进距离, Y=支架)
// ============================================================================

/**
 * 生成正确的热力图数据
 * 
 * 坐标系定义：
 * - X轴：推进距离 (0 ~ workfaceLength)
 * - Y轴：支架编号 (1 ~ supportCount)
 * 
 * 显示区域：
 * - 工作面内：显示实际矿压数据
 * - 采区内工作面外：显示采区背景
 * - 采区外：空白/透明
 */
export function generateHeatmapMatrix(aggregatedData, config) {
  const { 
    startDate, 
    endDate, 
    supportStart = 1, 
    supportEnd = WORKFACE_BOUNDS.supports.count 
  } = config

  const dates = getDateRange(startDate, endDate)
  const numSupports = supportEnd - supportStart + 1
  const workfaceLength = WORKFACE_BOUNDS.dimensions.length  // 1377.46m
  
  // 计算需要多少列来显示整个工作面长度
  // 按天推进，每天推进10m
  const maxAdvanceDistance = Math.max(
    workfaceLength,
    dates.length * WORKFACE_BOUNDS.advance.speed
  )
  const numCols = Math.ceil(maxAdvanceDistance / WORKFACE_BOUNDS.advance.speed)
  
  // 矩阵：行=支架，列=推进距离（按天离散）
  const matrix = Array(numSupports).fill(null).map(() => Array(numCols).fill(NaN))
  const cells = []
  const allValues = []

  // 填充数据
  for (let dateIdx = 0; dateIdx < dates.length; dateIdx++) {
    const date = dates[dateIdx]
    const dateKey = getDateKey(date)
    const dayData = aggregatedData.get(dateKey)
    
    // 当天的推进位置（列索引）
    const col = dateIdx
    
    if (dayData) {
      for (const [supportId, stats] of dayData) {
        // 检查支架是否在筛选范围内
        if (supportId < supportStart || supportId > supportEnd) continue
        
        // 行索引 = 支架相对位置
        const row = supportId - supportStart
        
        if (row >= 0 && row < numSupports && col >= 0 && col < numCols) {
          matrix[row][col] = stats.mean
          allValues.push(stats.mean)
          
          cells.push({
            row,           // 支架索引
            col,           // 时间/推进距离索引
            supportId,     // 实际支架号
            advanceDistance: col * WORKFACE_BOUNDS.advance.speed,  // 推进距离(m)
            value: stats.mean,
            date: new Date(date),
            std: stats.std,
            count: stats.count,
            // 空间坐标 (CGCS2000)
            x: advanceDistanceToX(col * WORKFACE_BOUNDS.advance.speed),
            y: supportIdToY(supportId)
          })
        }
      }
    }
  }

  return {
    matrix,
    cells,
    stats: calculateStats(allValues),
    numRows: numSupports,      // 支架数
    numCols: numCols,          // 推进天数
    workfaceLength,
    supportStart,
    supportEnd
  }
}

// ============================================================================
// 空间关系判断函数
// ============================================================================

/**
 * 判断点是否在工作面内
 */
export function isPointInWorkface(x, y) {
  const { BJ1, BJ2, BJ3, BJ4 } = WORKFACE_BOUNDS.corners
  
  // 简化的矩形检测（工作面近似为矩形）
  const minX = Math.min(BJ1.x, BJ2.x, BJ3.x, BJ4.x)
  const maxX = Math.max(BJ1.x, BJ2.x, BJ3.x, BJ4.x)
  const minY = Math.min(BJ1.y, BJ2.y, BJ3.y, BJ4.y)
  const maxY = Math.max(BJ1.y, BJ2.y, BJ3.y, BJ4.y)
  
  return x >= minX && x <= maxX && y >= minY && y <= maxY
}

/**
 * 判断点是否在采区内（射线法）
 */
export function isPointInMiningArea(x, y) {
  const vertices = MINING_AREA_BOUNDS.vertices
  let inside = false
  
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x, yi = vertices[i].y
    const xj = vertices[j].x, yj = vertices[j].y
    
    if (((yi > y) !== (yj > y)) && 
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside
    }
  }
  
  return inside
}

/**
 * 获取区域类型
 * @returns {'workface' | 'mining_area' | 'outside'}
 */
export function getRegionType(x, y) {
  if (isPointInWorkface(x, y)) return 'workface'
  if (isPointInMiningArea(x, y)) return 'mining_area'
  return 'outside'
}

// ============================================================================
// 分析函数
// ============================================================================

export function detectAnomalies(data, threshold = 2) {
  const m = mean(data)
  const s = std(data)
  const outliers = []
  const indices = []
  
  data.forEach((value, index) => {
    if (Math.abs((value - m) / s) > threshold) {
      outliers.push(value)
      indices.push(index)
    }
  })
  
  return { outliers, indices, upperBound: m + threshold * s, lowerBound: m - threshold * s }
}

export function detectPressureCycles(timeSeries, options = {}) {
  const { threshold = 1.5, minDistance = 5 } = options
  const m = mean(timeSeries)
  const s = std(timeSeries)
  const peakThreshold = m + threshold * s
  
  const peaks = []
  for (let i = 1; i < timeSeries.length - 1; i++) {
    if (timeSeries[i] > peakThreshold &&
        timeSeries[i] > timeSeries[i - 1] &&
        timeSeries[i] > timeSeries[i + 1]) {
      if (peaks.length === 0 || i - peaks[peaks.length - 1] >= minDistance) {
        peaks.push(i)
      }
    }
  }
  
  const periods = []
  for (let i = 1; i < peaks.length; i++) {
    periods.push(peaks[i] - peaks[i - 1])
  }
  
  return {
    peaks: peaks.map(i => timeSeries[i]),
    peakIndices: peaks,
    meanPeriod: periods.length > 0 ? mean(periods) : 0,
    periods
  }
}

// ============================================================================
// 导出配置
// ============================================================================

// 配色方案（供组件使用）
export const COLORS = {
  diverging: {
    name: '发散色',
    colors: ['#313695', '#4575B4', '#74ADD1', '#ABD9E9', '#E0F3F8', '#FFFFBF', '#FEE090', '#FDAE61', '#F46D43', '#D73027', '#A50026']
  },
  viridis: {
    name: 'Viridis',
    colors: ['#440154', '#482878', '#3E4A89', '#31688E', '#26828E', '#1F9E89', '#35B779', '#6DCD59', '#B4DE2C', '#FDE725']
  },
  plasma: {
    name: 'Plasma',
    colors: ['#0D0887', '#3E049C', '#6300A7', '#8707A6', '#A62098', '#C03A83', '#D5546E', '#E76F5A', '#F58F46', '#FDB32F', '#F0F921']
  }
}

// 颜色查找表生成
export function createColorLookup(colors, size = 256) {
  const lookup = new Uint32Array(size)
  for (let i = 0; i < size; i++) {
    const t = i / (size - 1)
    const color = interpolateColorArray(colors, t)
    lookup[i] = (255 << 24) | (color.b << 16) | (color.g << 8) | color.r
  }
  return lookup
}

function interpolateColorArray(colors, t) {
  const idx = t * (colors.length - 1)
  const lower = Math.floor(idx)
  const upper = Math.ceil(idx)
  const frac = idx - lower
  
  const c1 = hexToRgb(colors[lower] || colors[0])
  const c2 = hexToRgb(colors[upper] || colors[colors.length - 1])
  const smoothT = frac * frac * (3 - 2 * frac)
  
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * smoothT),
    g: Math.round(c1.g + (c2.g - c1.g) * smoothT),
    b: Math.round(c1.b + (c2.b - c1.b) * smoothT)
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 128, g: 128, b: 128 }
}

export const PRESSURE_CONFIG = {
  colorScale: {
    diverging: ['#313695', '#4575B4', '#74ADD1', '#ABD9E9', '#E0F3F8', '#FFFFBF', '#FEE090', '#FDAE61', '#F46D43', '#D73027', '#A50026'],
    viridis: ['#440154', '#482878', '#3E4A89', '#31688E', '#26828E', '#1F9E89', '#35B779', '#6DCD59', '#B4DE2C', '#FDE725']
  },
  thresholds: {
    low: 10, high: 45, danger: 55
  },
  regionColors: {
    workface: null,
    mining_area: '#E8E8E8',
    outside: '#FFFFFF'
  }
}

/**
 * 按支架分组数据
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

/**
 * 计算相关系数矩阵
 */
export function calculateCorrelationMatrix(matrix) {
  const numCols = matrix[0]?.length || 0
  const corrMatrix = Array(numCols).fill(null).map(() => Array(numCols).fill(0))
  
  const columns = []
  for (let col = 0; col < numCols; col++) {
    columns.push(matrix.map(row => row[col]).filter(v => Number.isFinite(v)))
  }
  
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numCols; j++) {
      corrMatrix[i][j] = (i === j) ? 1 : pearsonCorrelation(columns[i], columns[j])
    }
  }
  return corrMatrix
}

function pearsonCorrelation(x, y) {
  const n = Math.min(x.length, y.length)
  if (n === 0) return 0
  const mx = mean(x)
  const my = mean(y)
  let num = 0, denX = 0, denY = 0
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx
    const dy = y[i] - my
    num += dx * dy
    denX += dx * dx
    denY += dy * dy
  }
  return denX * denY === 0 ? 0 : num / Math.sqrt(denX * denY)
}

export default {
  WORKFACE_BOUNDS,
  MINING_AREA_BOUNDS,
  COLORS,
  mean, std, calculateStats,
  getDateKey, getDateRange, dateDiff,
  advanceDistanceToX, supportIdToY, dateToAdvanceDistance,
  loadRawData, aggregateByDay, generateHeatmapMatrix,
  isPointInWorkface, isPointInMiningArea, getRegionType,
  detectAnomalies, detectPressureCycles,
  calculateCorrelationMatrix, groupBySupport,
  createColorLookup,
  PRESSURE_CONFIG
}
