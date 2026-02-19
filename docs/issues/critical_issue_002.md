# Critical Issue #002: scene3d.py 函数调用缺少必需参数

**发现时间**: 2026-02-19 21:51
**严重程度**: HIGH
**优先级**: P0 (立即修复)
**影响范围**: Backend - 3D Scene API
**工具检测**: Pylint E1120 (no-value-for-parameter)

---

## 问题描述

### 错误位置
- **文件**: `backend/app/routes/scene3d.py`
- **行号**: 181
- **错误代码**: E1120 no-value-for-parameter

### 错误详情

在 `get_scene_3d_data()` 函数中调用 `get_coal_seam_data()` 时，缺少必需的参数 `files` 和 `coords`，只传递了 `seam_name` 和 `data_dir`。

**错误代码片段**:
```python
@router.get("/data", response_model=Scene3DResponse, summary="Get 3D scene data")
async def get_scene_3d_data(
    seam_name: str = Query(..., description="煤层名称"),
    indicator: str = Query(default="mpi", description="指标类型"),
    resolution: int = Query(default=50, description="分辨率"),
) -> Scene3DResponse:
    """获取3D场景数据"""
    from app.services.coal_seam_parser import get_all_coal_seams, get_coal_seam_data
    from app.core.config import get_data_dir
    from pathlib import Path

    try:
        # Get seam data
        data_dir = get_data_dir()
        seam_data = get_coal_seam_data(seam_name, data_dir)  # ❌ Line 181: 参数不匹配
        # ...
```

**函数签名**:
```python
# backend/app/services/coal_seam_parser.py:144
def get_coal_seam_data(
    files: List[Path],      # ❌ 缺少
    coords: Dict[str, Dict[str, float]],  # ❌ 缺少
    seam_name: str
) -> Dict:
    """..."""
```

### 问题原因

函数调用时传递的参数与函数定义的签名不匹配：
- **期望参数**: `files: List[Path]`, `coords: Dict`, `seam_name: str`
- **实际参数**: `seam_name: str`, `data_dir: Path` (类型也不匹配)

这可能是由于：
1. 函数签名重构后，调用点未更新
2. 参数顺序或命名理解错误
3. API 文档或注释不准确

---

## 影响分析

### 功能影响
- **3D 场景渲染**: `/data` 端点会在运行时抛出 `TypeError`
- **前端 3D 可视化**: 所有依赖 3D 场景数据的前端功能都会失败
- **煤层可视化**: 无法展示煤层的 3D 模型、钻孔和热力图
- **用户体验**: 用户无法查看关键的 3D 地质模型

### 影响范围
- **直接影响**: `backend/app/routes/scene3d.py` 的 `/data` 端点
- **间接影响**:
  - 前端 3D 可视化页面
  - 地质模型展示功能
  - 矿压指标 3D 热力图叠加
  - 钻孔 3D 分布展示

### 严重程度评估
- **High**: 运行时错误，会导致 API 请求失败
- **功能中断**: 3D 可视化功能完全不可用
- **用户体验差**: 用户会看到错误提示或空白页面
- **测试阻塞**: 所有涉及 3D 场景的 E2E 测试都会失败

---

## 修复方案

### 方案 1: 使用正确的辅助函数 (推荐)

检查 `coal_seam_parser.py` 中是否有其他更合适的函数：

```python
# 可能存在的替代函数
from app.services.coal_seam_parser import get_coal_seam_by_name

async def get_scene_3d_data(...):
    # ...
    try:
        # 使用更合适的函数
        seam_data = get_coal_seam_by_name(seam_name)  # 或者其他合适的函数
        # ...
```

### 方案 2: 获取必要的参数后调用

如果确实需要 `files` 和 `coords` 参数：

```python
async def get_scene_3d_data(...):
    from app.services.coal_seam_parser import get_coal_seam_data, get_all_coal_seams
    from app.core.config import get_data_dir
    from pathlib import Path

    try:
        data_dir = get_data_dir()

        # 首先获取所有煤层信息
        all_seams = get_all_coal_seams(data_dir)

        # 提取 files 和 coords
        files = []  # 需要从 all_seams 或其他地方获取
        coords = {}  # 需要从 all_seams 或其他地方获取

        # 然后调用
        seam_data = get_coal_seam_data(files, coords, seam_name)
        # ...
```

### 方案 3: 重构函数签名 (如果调用点很多)

如果 `get_coal_seam_data` 的签名不合理，可以考虑重构：

```python
# coal_seam_parser.py
def get_coal_seam_data(
    seam_name: str,
    data_dir: Path  # 新增默认参数
) -> Dict:
    """简化的函数签名"""
    # 内部处理 files 和 coords 的获取
    files = _get_seam_files(data_dir)
    coords = _load_coordinates(data_dir)
    # ...
```

---

## 调查步骤

1. **检查函数定义**: 查看 `coal_seam_parser.py` 中的所有相关函数
2. **检查其他调用点**: 搜索代码库中其他调用 `get_coal_seam_data` 的地方
3. **理解数据流**: 弄清楚 `files` 和 `coords` 应该从哪里获取
4. **选择最佳方案**: 根据实际业务逻辑选择修复方案

---

## 回归测试

### 测试用例 1: 3D 场景数据获取成功
```python
def test_get_scene_3d_data_success(client):
    """测试 3D 场景数据获取成功"""
    response = client.get("/data?seam_name=test_seam&indicator=mpi&resolution=50")
    assert response.status_code == 200
    data = response.json()
    assert "layers" in data
    assert "boreholes" in data
    assert "bounds" in data
```

### 测试用例 2: 煤层不存在的错误处理
```python
def test_get_scene_3d_data_seam_not_found(client):
    """测试煤层不存在时的错误处理"""
    response = client.get("/data?seam_name=nonexistent_seam")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
```

### 测试用例 3: 参数验证
```python
def test_get_scene_3d_data_missing_params(client):
    """测试缺少必需参数时的验证"""
    response = client.get("/data")  # 缺少 seam_name
    assert response.status_code == 422  # Validation error
```

---

## 验证标准

修复后需要满足以下所有条件：

- [ ] **Pylint 无参数错误**:
  ```bash
  cd backend && python -m pylint app/routes/scene3d.py --disable=C,R,W --enable=E1120
  ```

- [ ] **模块可正常导入**:
  ```bash
  cd backend && python -c "from app.routes import scene3d"
  ```

- [ ] **类型检查通过** (如果使用 mypy):
  ```bash
  cd backend && python -m mypy app/routes/scene3d.py
  ```

- [ ] **API 端点可访问**:
  ```bash
  curl "http://localhost:8000/data?seam_name=test"
  # 不应返回 500 错误
  ```

- [ ] **回归测试通过** (至少 3 个测试用例全部通过)

- [ ] **手动测试 3D 可视化**:
  - 在前端打开 3D 可视化页面
  - 选择煤层，确认 3D 模型正常渲染
  - 检查浏览器控制台无错误

---

## 相关文件

- **源文件**: `backend/app/routes/scene3d.py`
- **依赖文件**: `backend/app/services/coal_seam_parser.py`
- **测试文件**: `backend/tests/test_scene3d_api.py` (需要创建)
- **配置文件**: `backend/app/main.py` (路由注册)

---

## 状态跟踪

- [x] Issue 已识别和记录
- [ ] 函数定义和调用点调查完成
- [ ] 修复方案确定
- [ ] 代码修复完成
- [ ] 回归测试编写完成
- [ ] 所有验证标准通过
- [ ] Code Review 通过
- [ ] 合并到主分支

---

## 时间估算

- **调查时间**: 15 分钟
- **修复时间**: 10 分钟
- **测试时间**: 15 分钟
- **验证时间**: 10 分钟
- **总计**: ~50 分钟

---

## 标签

`critical` `type-error` `3d-visualization` `backend` `week1` `p0`

---

## 相关 Issues

- Critical Issue #001: health.py 语法错误
- Week 1 目标: Critical Issues 归零 (2 → 0)

---

## 附加说明

这个 issue 的修复需要先调查清楚：
1. `get_coal_seam_data` 函数的正确用法
2. `files` 和 `coords` 参数应该从哪里获取
3. 是否有其他更合适的辅助函数可以使用

建议先查看 `coal_seam_parser.py` 的完整代码和文档注释。
