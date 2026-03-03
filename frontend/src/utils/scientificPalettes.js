/**
 * 科学配色方案 - 科研级可视化
 * Scientific Color Palettes for Academic Visualization
 * 
 * 遵循标准:
 * - 色盲友好 (Color-blind friendly)
 * - 黑白打印友好 (Print-friendly)
 * - 符合Nature/Science等期刊要求
 */

// ============================================================================
// 色盲模拟
// ============================================================================

/**
 * RGB转色盲模拟
 * @param {number[]} rgb - [r, g, b] 0-255
 * @param {string} type - 'deuteranopia'|'protanopia'|'tritanopia'
 */
export function simulateColorBlind(rgb, type = 'deuteranopia') {
  const [r, g, b] = rgb.map(x => x / 255)
  
  const matrices = {
    deuteranopia: [ // 绿色盲
      [0.43, 0.72, -0.15],
      [0.34, 0.57, 0.09],
      [-0.02, 0.03, 1.00]
    ],
    protanopia: [ // 红色盲
      [0.57, 0.43, 0],
      [0.56, 0.44, 0],
      [0, 0.24, 0.76]
    ],
    tritanopia: [ // 蓝色盲
      [0.95, 0.05, 0],
      [0, 0.43, 0.57],
      [0, 0.48, 0.52]
    ]
  }
  
  const m = matrices[type] || matrices.deuteranopia
  
  const newR = m[0][0] * r + m[0][1] * g + m[0][2] * b
  const newG = m[1][0] * r + m[1][1] * g + m[1][2] * b
  const newB = m[2][0] * r + m[2][1] * g + m[2][2] * b
  
  return [
    Math.max(0, Math.min(255, Math.round(newR * 255))),
    Math.max(0, Math.min(255, Math.round(newG * 255))),
    Math.max(0, Math.min(255, Math.round(newB * 255)))
  ]
}

/**
 * 检查配色方案是否色盲友好
 */
export function checkColorBlindSafety(palette) {
  const results = []
  const types = ['deuteranopia', 'protanopia', 'tritanopia']
  
  for (const type of types) {
    const simulated = palette.map(c => simulateColorBlind(c, type))
    // 检查区分度
    const distinctPairs = countDistinctPairs(simulated)
    results.push({
      type,
      safe: distinctPairs >= palette.length * (palette.length - 1) / 2 * 0.8,
      simulated
    })
  }
  
  return results
}

function countDistinctPairs(colors) {
  let count = 0
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      if (colorDistance(colors[i], colors[j]) > 10) count++
    }
  }
  return count
}

function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1[0] - c2[0], 2) + 
    Math.pow(c1[1] - c2[1], 2) + 
    Math.pow(c1[2] - c2[2], 2)
  )
}

// ============================================================================
// 连续色阶 (Sequential)
// ============================================================================

/**
 * Viridis - 感知均匀的色阶，色盲友好
 * 适合: 连续数值，如压力值、温度
 */
export const viridis = {
  name: 'Viridis',
  type: 'sequential',
  colorBlindSafe: true,
  printFriendly: false,
  colors: [
    [68, 1, 84], [72, 40, 120], [62, 73, 137], [49, 104, 142],
    [38, 130, 142], [31, 158, 137], [53, 183, 121], [109, 205, 89],
    [180, 222, 44], [253, 231, 37]
  ],
  interpolate: (t) => interpolateFromArray(viridis.colors, t)
}

/**
 * Plasma - 鲜艳的感知均匀色阶
 */
export const plasma = {
  name: 'Plasma',
  type: 'sequential',
  colorBlindSafe: true,
  printFriendly: false,
  colors: [
    [13, 8, 135], [84, 2, 163], [139, 10, 165], [185, 50, 137],
    [219, 92, 104], [244, 136, 73], [254, 188, 43], [240, 249, 33]
  ],
  interpolate: (t) => interpolateFromArray(plasma.colors, t)
}

/**
 * 灰度色阶 - 黑白打印友好
 */
export const grayscale = {
  name: 'Grayscale',
  type: 'sequential',
  colorBlindSafe: true,
  printFriendly: true,
  colors: [
    [255, 255, 255], [240, 240, 240], [217, 217, 217], [189, 189, 189],
    [150, 150, 150], [115, 115, 115], [82, 82, 82], [37, 37, 37]
  ],
  interpolate: (t) => interpolateFromArray(grayscale.colors, t)
}

/**
 * 热力色阶 - 经典热力图配色
 */
export const heatmap = {
  name: 'Heatmap',
  type: 'sequential',
  colorBlindSafe: false,
  printFriendly: false,
  colors: [
    [0, 0, 255], [0, 255, 255], [0, 255, 0], [255, 255, 0], [255, 0, 0]
  ],
  interpolate: (t) => interpolateFromArray(heatmap.colors, t)
}

// ============================================================================
// 发散色阶 (Diverging) - 适合正负值
// ============================================================================

/**
 * RdBu - 红蓝色阶，适合正负值
 * 适合: 异常值、偏差、相关性
 */
export const rdBu = {
  name: 'RdBu',
  type: 'diverging',
  colorBlindSafe: true,
  printFriendly: false,
  center: 0.5,
  colors: [
    [5, 48, 97], [33, 102, 172], [67, 147, 195], [146, 197, 222],
    [209, 229, 240], [247, 247, 247], [253, 219, 199], [244, 165, 130],
    [214, 96, 77], [178, 24, 43], [103, 0, 31]
  ],
  interpolate: (t) => interpolateFromArray(rdBu.colors, t)
}

/**
 * 棕青色阶 - 打印友好
 */
export const brBG = {
  name: 'BrBG',
  type: 'diverging',
  colorBlindSafe: true,
  printFriendly: true,
  center: 0.5,
  colors: [
    [84, 48, 5], [140, 81, 10], [191, 129, 45], [223, 194, 125],
    [246, 232, 195], [245, 245, 245], [199, 234, 229], [128, 205, 193],
    [53, 151, 143], [1, 102, 94], [0, 60, 48]
  ],
  interpolate: (t) => interpolateFromArray(brBG.colors, t)
}

/**
 * PuOr - 紫橙色阶
 */
export const puOr = {
  name: 'PuOr',
  type: 'diverging',
  colorBlindSafe: true,
  printFriendly: false,
  center: 0.5,
  colors: [
    [127, 59, 8], [179, 88, 6], [224, 130, 20], [253, 184, 99],
    [254, 224, 182], [247, 247, 247], [216, 218, 235], [178, 171, 210],
    [128, 115, 172], [84, 39, 136], [45, 0, 75]
  ],
  interpolate: (t) => interpolateFromArray(puOr.colors, t)
}

// ============================================================================
// 分类配色 (Qualitative) - 适合离散类别
// ============================================================================

/**
 * Tableau 10 - 经典分类配色，色盲友好
 */
export const tableau10 = {
  name: 'Tableau 10',
  type: 'qualitative',
  colorBlindSafe: true,
  printFriendly: false,
  colors: [
    [78, 121, 167], [242, 142, 44], [225, 87, 89], [118, 183, 178],
    [89, 161, 79], [237, 201, 73], [175, 122, 161], [255, 157, 167],
    [156, 117, 95], [186, 176, 172]
  ]
}

/**
 * ColorBrewer Set1 - 高对比度分类配色
 */
export const set1 = {
  name: 'Set1',
  type: 'qualitative',
  colorBlindSafe: false,
  printFriendly: false,
  colors: [
    [228, 26, 28], [55, 126, 184], [77, 175, 74], [152, 78, 163],
    [255, 127, 0], [255, 255, 51], [166, 86, 40], [247, 129, 191],
    [153, 153, 153]
  ]
}

/**
 * 打印友好的分类配色
 */
export const printFriendly = {
  name: 'Print Friendly',
  type: 'qualitative',
  colorBlindSafe: true,
  printFriendly: true,
  colors: [
    [0, 0, 0], [230, 159, 0], [86, 180, 233], [0, 158, 115],
    [240, 228, 66], [0, 114, 178], [213, 94, 0], [204, 121, 167]
  ]
}

/**
 * Okabe-Ito - 色盲友好分类配色（推荐）
 */
export const okabeIto = {
  name: 'Okabe-Ito',
  type: 'qualitative',
  colorBlindSafe: true,
  printFriendly: true,
  colors: [
    [230, 159, 0], [86, 180, 233], [0, 158, 115], [240, 228, 66],
    [0, 114, 178], [213, 94, 0], [204, 121, 167]
  ]
}

// ============================================================================
// 矿压专用配色
// ============================================================================

/**
 * 矿压热力图 - 针对矿压数据优化
 * 低值: 蓝绿 (正常)
 * 高值: 红黄 (预警)
 */
export const pressureHeatmap = {
  name: 'Pressure Heatmap',
  type: 'sequential',
  colorBlindSafe: true,
  printFriendly: false,
  colors: [
    [247, 252, 240], [224, 243, 219], [204, 235, 197], [168, 221, 181],
    [123, 204, 196], [78, 179, 211], [43, 140, 190], [8, 104, 172],
    [8, 64, 129], [255, 255, 0], [255, 165, 0], [255, 0, 0]
  ],
  interpolate: (t) => interpolateFromArray(pressureHeatmap.colors, t)
}

/**
 * 应力分布 - 地质学常用
 */
export const stressField = {
  name: 'Stress Field',
  type: 'diverging',
  colorBlindSafe: true,
  printFriendly: true,
  colors: [
    [94, 60, 153], [50, 136, 189], [102, 194, 165], [171, 221, 164],
    [230, 245, 152], [255, 255, 191], [254, 224, 139], [253, 174, 97],
    [244, 109, 67], [213, 62, 79], [158, 1, 66]
  ],
  interpolate: (t) => interpolateFromArray(stressField.colors, t)
}

// ============================================================================
// 工具函数
// ============================================================================

function interpolateFromArray(colors, t) {
  t = Math.max(0, Math.min(1, t))
  const n = colors.length - 1
  const i = Math.floor(t * n)
  const localT = (t * n) - i
  
  if (i >= n) return rgbToHex(colors[n])
  
  const c1 = colors[i]
  const c2 = colors[i + 1]
  
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * localT)
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * localT)
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * localT)
  
  return rgbToHex([r, g, b])
}

export function rgbToHex(rgb) {
  return '#' + rgb.map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0]
}

/**
 * 生成连续色阶的函数
 * @param {number} steps - 色阶数量
 * @param {Object} palette - 色板配置
 */
export function generateColorScale(steps, palette = viridis) {
  const colors = []
  for (let i = 0; i < steps; i++) {
    colors.push(palette.interpolate(i / (steps - 1)))
  }
  return colors
}

/**
 * 根据数值获取颜色
 * @param {number} value - 数值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {Object} palette - 色板
 */
export function getColorForValue(value, min, max, palette = viridis) {
  if (value < min) value = min
  if (value > max) value = max
  const t = (value - min) / (max - min)
  return palette.interpolate(t)
}

// ============================================================================
// 导出所有色板
// ============================================================================

export const allPalettes = {
  // 连续色阶
  viridis,
  plasma,
  grayscale,
  heatmap,
  pressureHeatmap,
  stressField,
  
  // 发散色阶
  rdBu,
  brBG,
  puOr,
  
  // 分类配色
  tableau10,
  set1,
  printFriendly,
  okabeIto
}

export const recommendedForResearch = [
  viridis,
  plasma,
  rdBu,
  okabeIto,
  grayscale,
  brBG
]

export default allPalettes
