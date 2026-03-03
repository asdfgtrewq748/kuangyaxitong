# 矿压分析系统 - 科研方向优化

## 概述

本次优化从学术研究的角度对矿压分析界面进行了全面升级，使其符合 Nature/Science 等顶级期刊的图表标准和科研工作流程需求。

## 新增功能

### 1. 统计分析模块 (`statisticalAnalysis.js`)

提供科研级别的统计分析功能：

- **假设检验**
  - 单样本 t 检验 (oneSampleTTest)
  - 双样本 t 检验 (twoSampleTTest) - Welch's t-test
  - Mann-Whitney U 检验 (非参数)
  - Kruskal-Wallis H 检验 (多组比较)

- **相关性分析**
  - Pearson 相关系数及显著性检验
  - Spearman 秩相关系数
  - 效应量计算 (Cohen's d)

- **回归分析**
  - 简单线性回归
  - R² 计算
  - 斜率和截距的置信区间

- **时间序列分析**
  - 自相关函数 (ACF)
  - Durbin-Watson 自相关检验

### 2. 科学配色方案 (`scientificPalettes.js`)

符合学术出版标准的配色方案：

**连续色阶 (Sequential)**
- `viridis` - 感知均匀，色盲友好 (推荐)
- `plasma` - 鲜艳，感知均匀
- `grayscale` - 黑白打印友好
- `pressureHeatmap` - 矿压数据优化

**发散色阶 (Diverging)**
- `rdBu` - 红蓝色阶，适合正负值
- `brBG` - 棕青色阶，打印友好
- `puOr` - 紫橙色阶

**分类配色 (Qualitative)**
- `tableau10` - 经典分类配色
- `okabeIto` - 色盲友好 (强烈推荐)
- `printFriendly` - 黑白打印友好

**色盲检测功能**
- 支持 Protanopia (红色盲)、Deuteranopia (绿色盲)、Tritanopia (蓝色盲) 模拟
- 自动检测配色方案的色盲友好性

### 3. 不确定性可视化 (`UncertaintyVisualization.vue`)

- 均值趋势线图
- 95% 置信区间填充区域
- 标准差误差条
- 交互式提示显示详细统计信息

### 4. 统计显著性标注 (`StatisticalAnnotation.vue`)

- 图表上的显著性标记 (* p<0.05, ** p<0.01, *** p<0.001)
- 组间比较连接线
- 统计检验结果面板
- 效应量显示

### 5. LaTeX 公式支持 (`LatexFormula.vue`)

- 简化版 LaTeX 渲染
- 支持希腊字母、数学符号
- 上下标、分数、根号
- 行内和显示模式

### 6. 方法论与引用面板 (`MethodologyPanel.vue`)

- 数据处理方法说明
- 统计检验假设和参考文献
- 数据溯源信息 (来源、时间、版本、哈希)
- DOI 支持
- 相关文献列表

### 7. 矢量图导出 (`vectorExport.js`)

- **SVG 导出** - 完整矢量图形，支持元数据
- **PDF 导出** - 通过打印到 PDF
- **高 DPI PNG** - 300/600 DPI 选项
- Nature 标准支持 (300 DPI, Arial 8pt)

### 8. 科研分析面板 (`ResearchPanel.vue`)

集成所有科研功能的控制面板：

**配色方案选择**
- 9种预设配色方案
- 色盲友好预览
- 打印友好标识

**统计分析工具**
- t检验 (双样本比较)
- 相关性分析 (Pearson/Spearman)
- 回归分析

**导出设置**
- DPI 选择 (300/600)
- 格式选择 (SVG/PNG/PDF)
- 字体大小 (8pt Nature标准)
- 颜色模式 (RGB/CMYK/灰度)

## 使用说明

### 在 PressureAnalysisUltra.vue 中使用

```vue
<!-- 科研分析面板 -->
<ResearchPanel 
  :data="researchData"
  @palette-change="onResearchPaletteChange"
  @export-request="onResearchExport"
/>

<!-- 方法论与引用 -->
<MethodologyPanel />
```

### 统计分析示例

```javascript
import { twoSampleTTest, pearsonCorrelation } from '@/utils/statisticalAnalysis.js'

// t检验
const result = twoSampleTTest(group1, group2)
// result: { t, df, pValue, significant, effectSize }

// 相关性分析
const corr = pearsonCorrelation(x, y)
// corr: { r, rSquared, pValue, significant }
```

### 配色方案使用

```javascript
import { viridis, getColorForValue } from '@/utils/scientificPalettes.js'

// 获取颜色
const color = getColorForValue(value, min, max, viridis)

// 生成色阶
const colors = generateColorScale(10, viridis)
```

### 矢量图导出

```javascript
import { exportToSVG, exportToPDF } from '@/utils/vectorExport.js'

const svg = exportToSVG({
  type: 'heatmap',
  data: matrix,
  // ...其他配置
}, {
  width: 800,
  height: 600,
  dpi: 300
})
```

## 学术标准合规性

### Nature 期刊标准
- ✅ 300/600 DPI 分辨率
- ✅ Arial 8pt 字体
- ✅ CMYK 颜色模式支持
- ✅ 矢量图导出 (SVG/PDF)

### 色盲友好
- ✅ Okabe-Ito 配色方案
- ✅ Viridis 感知均匀色阶
- ✅ 实时色盲模拟预览
- ✅ 所有图表可用黑白打印

### 统计规范
- ✅ 效应量报告 (Cohen's d)
- ✅ 置信区间显示
- ✅ p值显著性标注
- ✅ 非参数检验选项

### 可重复性
- ✅ 数据溯源信息
- ✅ 版本控制
- ✅ 方法论说明
- ✅ 参考文献引用

## 文件结构

```
frontend/src/
├── components/pressure/
│   ├── ResearchPanel.vue           # 科研分析主面板
│   ├── MethodologyPanel.vue        # 方法论与引用
│   ├── UncertaintyVisualization.vue # 不确定性可视化
│   ├── StatisticalAnnotation.vue   # 统计显著性标注
│   └── LatexFormula.vue            # LaTeX公式渲染
├── utils/
│   ├── statisticalAnalysis.js      # 统计分析函数
│   ├── scientificPalettes.js       # 科学配色方案
│   └── vectorExport.js             # 矢量图导出
└── views/
    └── PressureAnalysisUltra.vue   # 主界面(已集成)
```

## 后续优化建议

1. **交互式统计分析** - 允许用户在热力图上框选区域进行统计分析
2. **多组比较** - 支持 ANOVA 和事后检验
3. **时间序列模型** - ARIMA、指数平滑等预测模型
4. **机器学习** - 异常检测、聚类分析的可视化
5. **参考文献管理** - 与 Zotero 等工具集成
6. **DOI 注册** - 数据集 DOI 自动注册
