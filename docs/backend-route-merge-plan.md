# Week5 后端路由合并方案（2026-02-22）

## 1. 现状问题

- `backend/app/main.py` 仍承载大量业务接口（boreholes/interpolate/pressure/summary/seams 等），体量过大。
- `backend/app/routes/` 已有多套模块化路由（`/api/research`、`/api/mpi`、`/api/geomodel` 等），风格与主文件直挂路由并存。
- 前端 `frontend/src/api.js` 中仍存在大量非 `/api/*` 前缀调用，不利于统一网关、鉴权、版本化。

## 2. 合并目标

- 保持兼容: 旧路径可用，不中断当前页面。
- 统一入口: 新调用统一到 `/api/*`。
- 分阶段推进: 先迁移最核心读接口（summary/report），再迁移 pressure/seams/interpolate。

## 3. 分阶段计划

### Phase A（本轮已落地）

- 为 summary 系列接口增加 `/api/summary/*` 别名，保留旧 `/summary/*`。
- 前端 summary API 调用切换到 `/api/summary/*`。
- 补充回归测试，确保别名路由已注册。

已落地接口:

- `/api/summary/index`
- `/api/summary/index-workfaces`
- `/api/summary/steps`
- `/api/summary/steps-workfaces`
- `/api/summary/report`
- `/api/summary/report/perf`

### Phase B（本轮已落地）

- 对 pressure/export 核心路径增加 `/api/pressure/*` 与 `/api/export/*` 统一别名。
- 前端 `frontend/src/api.js` 中 pressure/export 调用切换到新路径。

### Phase C（本轮已落地 + 下一步）

- 已落地:
  - boreholes/lithology/interpolate/pipeline/seams 已补 `/api/*` 别名并保持旧路径兼容。
  - 前端 API 调用已切换为 `/api/*` 前缀。
- 下一步:
  - 将 `main.py` 路由定义逐步下沉到 `backend/app/routes/` 新模块，`main.py` 仅保留 app 创建与 router 注册。

## 4. 验收标准

- 前端主流程无回归（Report/Pressure/Steps/Research 页面可正常请求）。
- 后端核心测试通过。
- 新开发接口默认仅使用 `/api/*` 路径。

## Phase C.1 Update (Completed)

- Added route modules:
  - `backend/app/routes/pressure.py`
  - `backend/app/routes/seams.py`
- `backend/app/main.py` now includes:
  - `app.include_router(pressure_router)`
  - `app.include_router(seams_router)`
- Pressure and seams route decorators were removed from `main.py` and are now managed in route modules.
- Logic functions remain in `main.py` to keep existing tests and internal calls stable.
- Verified by tests:
  - `python -m pytest backend/tests/test_main_api.py -q` (16 passed)
  - `python -m pytest backend/tests/test_scene3d_route.py backend/tests/test_seam_interpolate_service.py backend/tests/test_pressure_steps_service.py backend/tests/test_pressure_index.py -q` (45 passed)

## Phase C.2 Update (Completed)

- Added route module:
  - `backend/app/routes/data_ops.py`
- `backend/app/main.py` now includes:
  - `app.include_router(data_ops_router)`
- Route decorators removed from `main.py` and registered via `data_ops` module:
  - `/api/boreholes/*`
  - `/api/lithology/averages`
  - `/api/interpolate/*`
  - `/api/export/interpolation`
  - `/api/export/index`
  - `/api/pipeline/run`
- Logic functions remain in `main.py` to keep tests and internal calls stable.
- Verified by tests:
  - `python -m pytest backend/tests/test_main_api.py -q` (16 passed)

## Next

- Continue splitting remaining direct route registration from `main.py` (currently `/api/scene3d/data`).
