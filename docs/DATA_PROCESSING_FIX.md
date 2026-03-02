# 数据处理逻辑修复说明

## 问题描述

### 1. advanceDistance 计算不一致
**问题**：`generateHeatmapMatrix` 生成的 cell 对象不包含 `advanceDistance` 字段，而是在组件中临时计算 `row * 10`。

**影响**：
- 数据源头不一致，可能出现显示错误
- 如果推进速度配置改变，需要修改多处代码
- 支架筛选时，row 索引对应的推进距离可能不正确

**修复方案**：
```javascript
// 在 generateHeatmapMatrix 中统一计算
const advanceDistance = row * WORKFACE_BOUNDS.advance.speed

cells.push({
  // ... 其他字段
  advanceDistance  // 现在包含此字段
})
```

### 2. 支架号筛选时的列索引映射错误
**问题**：当用户筛选支架范围 (如 10-50 号) 时，列索引计算使用 `supportId - 1`，导致矩阵错位。

**修复方案**：
```javascript
// 添加 supportStart 参数
const col = supportId - supportStart  // 而不是 supportId - 1
```

## 修改的文件

### 1. `src/utils/pressureDataProcessor.js`
- `generateHeatmapMatrix` 函数添加 `advanceDistance` 字段
- 添加 `supportStart` 参数支持支架筛选
- 更新 HeatmapCell 类型定义

### 2. `src/views/PressureAnalysisUltra.vue`
- 调用 `generateHeatmapMatrix` 时传入 `supportStart` 参数

### 3. `src/components/pressure/PressureHeatmapUltra.vue`
- 简化 `getCellAtEvent`，直接使用 cell.advanceDistance

### 4. `src/components/pressure/PressureHeatmapPro.vue`
- 同上修复

### 5. `src/components/pressure/PressureHeatmap.vue`
- 同上修复

## 数据流验证

```
原始 CSV 数据
    ↓
loadRawData() → RawPressureRecord[]
    ↓
aggregateByDay() → Map<dateKey, Map<supportId, stats>>
    ↓
generateHeatmapMatrix() → { matrix, cells, stats }
    ↓
 cells[i] = {
   row,              // 日期索引 (0-based)
   col,              // 支架索引 (0-based, 考虑 supportStart 偏移)
   supportId,        // 实际支架号 (1-125)
   advanceDistance,  // 推进距离 (m) = row * 10
   value,            // 末阻力均值 (MPa)
   date,             // 日期
   ...
 }
```

## 推进距离计算

推进距离 = 行索引 × 每日推进速度

```javascript
// WORKFACE_BOUNDS.advance.speed = 10 (m/天)
const advanceDistance = row * 10  // 单位：米

// 示例：
// row = 0  → advanceDistance = 0m   (起始日期)
// row = 5  → advanceDistance = 50m  (第5天)
// row = 30 → advanceDistance = 300m (第30天)
```
