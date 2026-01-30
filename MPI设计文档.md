# 矿压影响指标（MPI）设计文档

## 一、概述

矿压影响指标（Mining Pressure Impact Index, MPI）是用于评估煤矿开采过程中矿山压力分布及其对开采活动影响的综合指标系统。该系统参考 ODI（扰动影响指标）的设计思路，采用多维度加权评分模型。

### 设计目标

- 评估每个坐标位置的矿山压力影响程度
- 为工作面布置和支护设计提供定量依据
- 支持等值线可视化和空间插值

---

## 二、现状分析

| 对比项 | 当前系统 | ODI参考系统 |
|--------|----------|-------------|
| 已有岩层参数 | 厚度、弹性模量、容重、抗拉强度、抗剪强度 | - |
| 缺少参数 | 抗压强度、剪切模量、内摩擦角、泊松比 | - |
| 计算方式 | 厚度加权平均的单一指标 | 多维度评分+权重组合 |
| 输出 | 矿压指标+来压步距 | 安全/环保/经济三大评分 |

---

## 三、MPI系统架构

```
                    ┌─────────────────────────────────────┐
                    │         矿压影响指标 (MPI)           │
                    └─────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
┌───────▼────────┐          ┌────────▼────────┐          ┌────────▼────────┐
│ 顶板稳定性指标  │          │ 冲击地压风险指标 │          │ 支承压力分布指标 │
│    (RSI)       │          │    (BRI)        │          │    (ASI)        │
└────────────────┘          └─────────────────┘          └─────────────────┘
        │                             │                             │
   ┌────┴────┐                  ┌─────┴─────┐                 ┌────┴────┐
   │关键层理论│                  │岩层能量积聚│                 │应力传递│
   │直接顶厚度│                  │采深临界值 │                 │内摩擦角│
   │岩层强度  │                  │硬厚岩层比 │                 │刚度分布│
   └─────────┘                  └───────────┘                 └─────────┘
```

---

## 四、数据结构

### 4.1 岩层参数结构

每层岩层需要以下参数：

```python
rock_layer = {
    # ===== 已有参数 =====
    "thickness": 12.5,          # 厚度 (m)
    "name": "砂岩",             # 岩性名称
    "z_top": 450.5,             # 顶板深度 (m)
    "z_bottom": 463.0,          # 底板深度 (m)
    "elastic_modulus": 35,      # 弹性模量 (GPa)
    "density": 26.5,            # 容重 (kN/m³)
    "tensile_strength": 4.2,    # 抗拉强度 (MPa)
    "shear_strength": 8.5,      # 抗剪强度 (MPa)

    # ===== 新增参数 =====
    "compressive_strength": 85, # 抗压强度 (MPa)
    "shear_modulus": 18,        # 剪切模量 (GPa)
    "friction_angle": 38,       # 内摩擦角 (°)
    "poissons_ratio": 0.25,     # 泊松比
    "cohesion": 12,             # 内聚力 (MPa)
    "integrity": 0.8,           # 完整性系数 (0-1)
}
```

### 4.2 坐标点数据结构

```python
point = {
    "x": 495394.96,
    "y": 5404813.13,
    "borehole": "50-14",        # 关联钻孔名称
    "thickness": 18.86,         # 煤层厚度 (m)
    "burial_depth": 450.5,      # 埋深 (m)
    "z_top": 450.5,             # 煤层顶板深度
    "z_bottom": 469.36,         # 煤层底板深度
    "overlying_strata": [...]   # 上覆岩层列表
}
```

---

## 五、子指标计算公式

### 5.1 顶板稳定性指标 (RSI - Roof Stability Index)

基于**关键层理论**和**直接顶稳定性**。

**计算要素：**

| 子指标 | 计算方法 | 权重 |
|--------|----------|------|
| 直接顶抗拉强度 | 厚度加权平均 × 归一化 | 40% |
| 关键层数量 | 每层15分，上限30分 | 30% |
| 岩层结构 | (1 - 软岩比例) × 40 | 30% |

**软岩判定标准：** 抗压强度 < 30 MPa

```python
def calc_roof_stability(strata, ctx=None):
    """
    顶板稳定性评分
    分数越高 = 顶板越稳定
    """
    ctx = ctx or {}

    # (1) 直接顶稳定性 - 厚度加权抗拉强度
    immediate = strata[:2]  # 直接顶+伪顶
    total_thick = sum(l["thickness"] for l in immediate)
    if total_thick > 0:
        rsi_immediate = sum(
            layer["thickness"] * layer["tensile_strength"]
            for layer in immediate
        ) / total_thick
    else:
        rsi_immediate = 0

    # (2) 关键层识别与评分
    key_layers = identify_key_layers(strata)
    rsi_key = min(len(key_layers) * 15, 30)

    # (3) 软硬岩层结构 - 软岩比例
    total_strata_thick = sum(l["thickness"] for l in strata)
    if total_strata_thick > 0:
        soft_ratio = sum(
            l["thickness"] for l in strata
            if l.get("compressive_strength", 0) < 30
        ) / total_strata_thick
    else:
        soft_ratio = 0
    rsi_structure = (1 - soft_ratio) * 40

    # 归一化并加权
    rsi_norm = min(rsi_immediate / 10, 1) * 40  # 抗拉强度4-10MPa归一化
    rsi = rsi_norm + rsi_key + rsi_structure

    return min(max(rsi, 0), 100)
```

### 5.2 冲击地压风险指标 (BRI - Burst Risk Index)

基于**能量积聚理论**和**冲击倾向性**。

**计算要素：**

| 子指标 | 计算方法 | 最大罚分 |
|--------|----------|----------|
| 采深度因子 | (depth - critical) / 200 × 40 | 40分 |
| 硬厚岩层能量 | energy / 500 × 30 | 30分 |
| 煤层厚度因子 | thickness / 10 × 30 | 30分 |

**临界深度默认值：** 400 m

```python
def calc_burst_risk(point, strata, ctx=None):
    """
    冲击地压风险评分
    分数越高 = 风险越低
    """
    ctx = ctx or {}
    depth = point.get("burial_depth", 0)
    coal_thickness = point.get("thickness", 0)

    # (1) 采深因子 - 超过临界深度风险激增
    critical_depth = ctx.get("critical_depth", 400)
    if depth > critical_depth:
        depth_penalty = min((depth - critical_depth) / 200, 1) * 40
    else:
        depth_penalty = 0

    # (2) 硬厚岩层因子 - 能量储存能力
    hard_rock_energy = sum(
        layer["thickness"] * layer.get("elastic_modulus", 0)
        for layer in strata
        if layer.get("compressive_strength", 0) > 60
    )
    hard_penalty = min(hard_rock_energy / 500, 1) * 30

    # (3) 煤层厚度因子
    thickness_penalty = min(coal_thickness / 10, 1) * 30

    # 风险越高分越低
    bri = 100 - depth_penalty - hard_penalty - thickness_penalty
    return min(max(bri, 0), 100)
```

### 5.3 支承压力分布指标 (ASI - Abutment Stress Index)

基于**应力传递理论**和**岩层刚度分布**。

**计算要素：**

| 子指标 | 计算方法 | 权重 |
|--------|----------|------|
| 综合刚度 | avg_stiffness / 35 × 50 | 50% |
| 内摩擦角 | (avg_friction - 20) / 25 × 50 | 50% |

```python
def calc_abutment_stress(strata, ctx=None):
    """
    支承压力分布评分
    分数越高 = 应力分布越合理
    """
    total_thick = sum(l["thickness"] for l in strata)

    if total_thick == 0:
        return 50  # 无数据时返回中值

    # (1) 综合刚度 - 影响应力传递范围
    avg_stiffness = sum(
        l.get("elastic_modulus", 0) * l["thickness"]
        for l in strata
    ) / total_thick
    stiffness_score = min(avg_stiffness / 35 * 50, 50)

    # (2) 内摩擦角 - 影响承载能力
    avg_friction = sum(
        l.get("friction_angle", 25) * l["thickness"]
        for l in strata
    ) / total_thick
    friction_score = max(min((avg_friction - 20) / 25 * 50, 50), 0)

    asi = stiffness_score + friction_score
    return min(max(asi, 0), 100)
```

---

## 六、综合MPI计算

### 6.1 主计算函数

```python
def calc_mpi(point, strata, weights=None, ctx=None):
    """
    矿压影响指标主计算函数

    Args:
        point: 坐标点数据 {x, y, thickness, burial_depth, ...}
        strata: 上覆岩层列表 [layer1, layer2, ...]
        weights: 各子指标权重
        ctx: 上下文参数 {critical_depth, ...}

    Returns:
        {
            "mpi": 85.6,           # 综合指标
            "breakdown": {          # 分项得分
                "rsi": 82.3,
                "bri": 88.1,
                "asi": 86.4
            }
        }
    """
    weights = weights or {
        "roof_stability": 0.4,
        "burst_risk": 0.35,
        "abutment_stress": 0.25
    }

    ctx = ctx or {}

    rsi = calc_roof_stability(strata, ctx)
    bri = calc_burst_risk(point, strata, ctx)
    asi = calc_abutment_stress(strata, ctx)

    mpi = (
        weights["roof_stability"] * rsi +
        weights["burst_risk"] * bri +
        weights["abutment_stress"] * asi
    )

    return {
        "mpi": round(mpi, 2),
        "breakdown": {
            "rsi": round(rsi, 2),
            "bri": round(bri, 2),
            "asi": round(asi, 2)
        }
    }
```

### 6.2 批量计算接口

```python
def calc_mpi_batch(points_data, weights=None, ctx=None):
    """
    批量计算多个坐标点的MPI

    Args:
        points_data: {point_id: {point, strata}, ...}

    Returns:
        {point_id: {mpi, breakdown}, ...}
    """
    results = {}
    for pid, data in points_data.items():
        results[pid] = calc_mpi(
            data["point"],
            data["strata"],
            weights,
            ctx
        )
    return results
```

---

## 七、关键辅助算法

### 7.1 关键层识别

基于钱鸣高院士的关键层理论：

```python
def identify_key_layers(strata):
    """
    关键层识别

    判定条件：
    1. 抗压强度 > 60 MPa（硬岩）
    2. 厚度 > 5 m（厚层）
    3. 弹性模量相对比 > 0.8（高刚度）

    Args:
        strata: 上覆岩层列表

    Returns:
        [index1, index2, ...] 关键层索引列表
    """
    key_layers = []
    reference_modulus = 35  # 参考弹性模量 GPa

    for i, layer in enumerate(strata):
        is_hard = layer.get("compressive_strength", 0) > 60
        is_thick = layer.get("thickness", 0) > 5
        is_stiff = layer.get("elastic_modulus", 0) / reference_modulus > 0.8

        if is_hard and is_thick and is_stiff:
            key_layers.append(i)

    return key_layers
```

### 7.2 工具函数

```python
def normalize(value, min_val, max_val):
    """归一化到 [0, 1]"""
    if max_val <= min_val:
        return 0.5
    return max(0, min(1, (value - min_val) / (max_val - min_val)))

def clamp(value, min_val, max_val):
    """限制范围"""
    return max(min_val, min(max_val, value))
```

---

## 八、权重配置系统

### 8.1 默认权重

```python
DEFAULT_MPI_WEIGHTS = {
    "roof_stability": 0.4,      # 顶板稳定性
    "burst_risk": 0.35,         # 冲击地压风险
    "abutment_stress": 0.25     # 支承压力分布
}

DEFAULT_CTX = {
    "critical_depth": 400,      # 冲击地压临界深度 (m)
    "reference_modulus": 35,    # 参考弹性模量 (GPa)
    "soft_rock_threshold": 30,  # 软岩抗压强度阈值 (MPa)
}
```

### 8.2 权重调整接口

```python
def update_weights(new_weights):
    """
    更新MPI计算权重

    Args:
        new_weights: {roof_stability: 0.5, burst_risk: 0.3, ...}
    """
    global DEFAULT_MPI_WEIGHTS
    for key, value in new_weights.items():
        if key in DEFAULT_MPI_WEIGHTS:
            DEFAULT_MPI_WEIGHTS[key] = value
    # 归一化确保总和为1
    total = sum(DEFAULT_MPI_WEIGHTS.values())
    for key in DEFAULT_MPI_WEIGHTS:
        DEFAULT_MPI_WEIGHTS[key] /= total
```

---

## 九、实现路线图

| 步骤 | 内容 | 文件 | 优先级 |
|------|------|------|--------|
| 1 | 扩展数据模型，添加新参数字段 | `borehole_parser.py` | 高 |
| 2 | 创建MPI计算模块 | `mpi_calculator.py` | 高 |
| 3 | 添加批量计算接口 | `mpi_calculator.py` | 高 |
| 4 | 集成到插值系统 | `seam_interpolate.py` | 高 |
| 5 | 添加MPI API端点 | `routes/` | 高 |
| 6 | 生成MPI等值线 | `contour_generator.py` | 中 |
| 7 | 权重配置接口 | `routes/config.py` | 中 |
| 8 | 前端MPI可视化 | `frontend/` | 中 |

---

## 十、API接口设计

### 10.1 计算MPI

```
POST /api/mpi/calculate
Request:
{
    "point": {x, y, thickness, burial_depth},
    "strata": [{thickness, tensile_strength, ...}],
    "weights": {roof_stability: 0.4, ...}
}

Response:
{
    "mpi": 85.6,
    "breakdown": {"rsi": 82.3, "bri": 88.1, "asi": 86.4}
}
```

### 10.2 批量计算

```
POST /api/mpi/batch
Request:
{
    "points": {id1: {point, strata}, id2: ...},
    "weights": {...}
}

Response:
{
    "results": {id1: {...}, id2: {...}}
}
```

### 10.3 插值网格

```
POST /api/mpi/interpolate
Request:
{
    "resolution": 50,
    "weights": {...}
}

Response:
{
    "grid": [[mpi11, mpi12, ...], ...],
    "bounds": {xmin, xmax, ymin, ymax}
}
```

---

## 十一、参考资料

1. **关键层理论** - 钱鸣高院士
2. **冲击地压机理** - 能量积聚与释放理论
3. **ODI计算系统** - https://github.com/asdfgtrewq748/shejixitong
4. **矿山压力与岩层控制** - 煤炭工业出版社

---

## 十二、版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0 | 2026-01-30 | 初始设计版本 |
