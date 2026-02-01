# ODI评分系统色盘常量

> 说明：本文汇总当前工程内与 ODI 评分/分级相关的色盘常量与分级边界，便于统一前后端显示。

## 1. 后端热力图色带（ODI/ODI归一化）
来源于 [backend_python/routers/disturbance.py](backend_python/routers/disturbance.py#L1259-L1283)。

- 颜色列表（5级）：
  - I：#3b82f6
  - II：#facc15
  - III：#fb923c
  - IV：#f87171
  - V：#dc2626
- 分级边界（用于 `BoundaryNorm`）：
  - [0, 0.045, 0.345, 0.825, 0.847, 1.0]

## 2. 前端等级色（ODI等级展示）
来源于 [frontend/src/components/DisturbanceEvaluation.jsx](frontend/src/components/DisturbanceEvaluation.jsx#L35-L43)。

- `LEVEL_COLORS`：
  - 1级：hex #3b82f6，label “I级 轻微扰动”，`odiMax=0.045`
  - 2级：hex #facc15，label “II级 较弱扰动”，`odiMax=0.345`
  - 3级：hex #fb923c，label “III级 中等扰动”，`odiMax=0.825`
  - 4级：hex #f87171，label “IV级 较强扰动”，`odiMax=0.847`
  - 5级：hex #dc2626，label “V级 强扰动”，`odiMax=1.0`

## 3. 备注
- 前后端的颜色与分级边界一致：
  - 颜色顺序一致：蓝 → 黄 → 橙 → 红 → 深红
  - 边界一致：0.045 / 0.345 / 0.825 / 0.847 / 1.0
