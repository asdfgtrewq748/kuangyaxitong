# 热力图坐标系修正说明

## 问题总结

根据用户示意图，原热力图存在以下**严重问题**：

1. **坐标轴方向错误**
   - 原：X轴=支架编号，Y轴=推进距离
   - 正确：X轴=推进距离（工作面推进方向），Y轴=支架编号

2. **数据范围错误**
   - 原：整个热力图都填充了颜色（模拟数据）
   - 正确：只应在"工作面"矩形范围内显示数据

3. **缺少空间关系**
   - 未显示"采区"与"工作面"的包含关系
   - 工作面外应该是采区背景或空白

## 修正内容

### 1. 坐标系重新定义

```
修正后的坐标系：
                    Y轴 (支架编号)
                    ↑
                    |
      支架125 ------+------- 工作面顶部
                    |       |
                    |       |
      支架1 --------+------- 工作面底部
                    |
                    +----------------→ X轴 (推进距离)
                    0m              1377.46m
```

- **X轴**：推进距离（0 ~ 1377.46m）
- **Y轴**：支架编号（1 ~ 125），1号在底部

### 2. 矩阵维度调整

```javascript
// 修正前：
// rows = 天数
// cols = 支架数

// 修正后：
// rows = 支架数 (125)
// cols = 推进天数
const matrix = Array(numSupports).fill(null).map(() => Array(numDays).fill(NaN))
```

### 3. 渲染时Y轴反转

因为 Canvas 坐标系Y轴向下，但支架编号1应该在底部：

```javascript
// 行索引 0 对应支架125（顶部）
// 行索引 124 对应支架1（底部）
const y = (numSupports - 1 - row) * cellHeight
```

### 4. 工作面-采区显示

```
┌─────────────────────────────────────┐
│            采区背景 (浅灰)           │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │       工作面 (数据显示)      │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

- **采区**：浅灰色背景 (#F0F0F0)
- **工作面**：白色背景 + 实际矿压数据
- **工作面边框**：黑色线条标注

## 修改的文件

### 1. `src/utils/pressureDataProcessor.js`
- 修正坐标映射函数
- `generateHeatmapMatrix`：矩阵维度改为 (支架数 × 推进天数)
- 添加 `advanceDistance` 到 cell 对象
- 添加 `COLORS` 和 `createColorLookup` 导出

### 2. `src/components/pressure/PressureHeatmapUltra.vue`
- 重写渲染逻辑，Y轴反转
- 添加背景 Canvas 显示采区和工作面边界
- 修正坐标轴标签（X=推进距离m，Y=支架编号）
- 添加区域图例（工作面/采区）

## 数据流

```
原始数据 (支架号, 日期, 阻力值)
         ↓
aggregateByDay() → Map<date, Map<supportId, stats>>
         ↓
generateHeatmapMatrix()
         ↓
matrix[row][col]  // row=支架索引, col=日期索引
         ↓
渲染 (Y轴反转，支架1在底部)
```

## 使用方式

组件API保持不变，只需传入正确的数据：

```vue
<PressureHeatmapUltra
  :matrix="heatmapMatrix"      // 支架数 × 推进天数
  :cells="heatmapCells"
  :num-rows="numSupports"      // 125
  :num-cols="numDays"          // 推进天数
/>
```
