# 报告页后端链路性能剖析（2026-02-22）

## 背景

报告页（`frontend/src/views/Report.vue`）原先会并发请求 4 个统计接口：

1. `GET /summary/index`
2. `GET /summary/index-workfaces`
3. `GET /summary/steps`
4. `GET /summary/steps-workfaces`

并单独执行 MPI 专题分析链路。

## 问题定位

实测发现 4 个统计接口存在大量重复计算与重复数据读取，典型耗时（本地）：

- 四接口总耗时（一次报告刷新）: **3385.5 ms**

此外，`summary/steps*` 在当前数据状态下可能返回 `not enough points for interpolation`，会导致报告刷新稳定性受影响。

## 优化方案

### 1) 新增聚合接口

- 新增 `GET /summary/report`（文件：`backend/app/main.py`）
- 一次请求返回报告页 4 块统计结果，减少前后端往返和重复逻辑。

### 2) 后端轻量缓存

- 在 `backend/app/main.py` 增加 `_report_cache`（LRU + TTL）
- TTL: `45s`
- cache key 包含：
  - 请求参数
  - 数据签名（CSV 文件数量/总大小/最新修改时间）
- 数据变更触发失效：
  - `POST /boreholes/upload`
  - `POST /boreholes/fix-encoding`

### 3) 结果容错

- `summary/report` 对 `steps` 失败做降级返回（保留其余统计），并返回 `warnings` 字段。
- 避免单一子模块失败导致整页完全失败。

### 4) 前端调用优化

- `frontend/src/views/Report.vue` 改为优先调用 `summaryReport()`
- 仅在旧后端不支持时回退到 4 个老接口。
- `buildMpiPoints` 前置并行预取岩性参数，降低逐层串行等待。

## 实测结果（优化后）

- `GET /summary/report` 冷启动: **2502.7 ms**
- `GET /summary/report` 缓存命中: **1.1 ms**
- 相比旧链路（3385.5 ms），冷启动减少约 **26%**，连续刷新显著提速。

> 注：当前数据下 `steps` 仍会出现 `not enough points for interpolation`，但已通过 `warnings` 降级，不再阻断整页统计刷新。

## 变更文件

- `backend/app/main.py`
- `frontend/src/api.js`
- `frontend/src/views/Report.vue`
- `backend/tests/test_main_api.py`

## 后续修复（2026-02-22）

为彻底消除报告页 `summary/steps*` 不稳定问题，进一步修复了步距批量计算数据链路：

- 文件：`backend/app/services/pressure_steps_batch.py`
- 关键修复：
  - 有坐标输入时，仅处理坐标表内钻孔（剔除无坐标研究CSV）
  - `q_mode=density_thickness` 若计算得到 `q<=0`，回退 `default_q`
  - `fixed/shear` 模型缺失参数时，`t/s` 回退默认值（2.0 / 1.0）
- 结果：
  - `pressure_steps_boreholes`：`28` 个样本全部可计算（错误数从 28 -> 0）
  - `summary_steps` / `summary_steps_workfaces` 不再返回 `not enough points for interpolation`
