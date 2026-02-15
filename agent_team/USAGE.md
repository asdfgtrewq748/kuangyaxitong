# Agent Team 使用指南

## 快速开始

### 方式一：使用 Python 代码调用

```python
from agent_team.client import AgentTeamClient

# 1. 创建并启动客户端
client = AgentTeamClient()
client.start()

# 2. 调用你需要的任务
task_id = client.optimize_backend()
print(f"任务已提交: {task_id}")

# 3. 查看状态
client.print_status()

# 4. 停止（可选）
client.stop()
```

### 方式二：使用交互式界面

```bash
python agent_team/demo_interactive.py
```

### 方式三：直接运行工作流

```bash
python -m agent_team.main --run-workflow optimize_mpi_performance
```

---

## 可用任务列表

### 后端开发 (Backend)

| 方法 | 说明 | 参数 |
|------|------|------|
| `optimize_backend()` | 优化后端 API | `file_path` (可选) |
| `add_api_endpoint(path, method, desc)` | 添加 API 端点 | 路径, 方法, 描述 |
| `refactor_service(service_name)` | 重构服务模块 | 服务名称 |

### 前端开发 (Frontend)

| 方法 | 说明 | 参数 |
|------|------|------|
| `optimize_frontend()` | 优化前端打包 | - |
| `add_page(page_name, route)` | 添加新页面 | 页面名, 路由 |
| `add_chart(chart_type, title)` | 添加图表组件 | 图表类型, 标题 |
| `improve_ui(component_path)` | 改进 UI 组件 | 组件路径 |

### 数据处理 (Data)

| 方法 | 说明 | 参数 |
|------|------|------|
| `fix_data_encoding(file_name)` | 修复数据编码 | 文件名 (可选) |
| `parse_borehole_data(file_name)` | 解析钻孔数据 | 文件名 |
| `interpolate_field(method)` | 执行场插值 | 插值方法 |
| `validate_coordinates()` | 验证坐标数据 | - |

### 算法优化 (Algorithm)

| 方法 | 说明 | 参数 |
|------|------|------|
| `optimize_mpi_algorithm()` | 优化 MPI 算法 | - |
| `improve_interpolation(method)` | 改进插值算法 | 方法名称 |
| `add_algorithm(name, desc)` | 添加新算法 | 名称, 描述 |
| `benchmark_algorithm(name)` | 算法基准测试 | 算法名称 |

### DevOps

| 方法 | 说明 | 参数 |
|------|------|------|
| `deploy(environment)` | 部署应用 | 环境 (默认 production) |
| `setup_monitoring()` | 设置监控 | - |
| `check_services()` | 检查服务状态 | - |

### 测试 (Testing)

| 方法 | 说明 | 参数 |
|------|------|------|
| `run_tests()` | 运行所有测试 | - |
| `write_unit_test(module_path)` | 编写单元测试 | 模块路径 |
| `performance_test()` | 运行性能测试 | - |

---

## 使用示例

### 示例 1: 优化整个系统

```python
from agent_team.client import AgentTeamClient

client = AgentTeamClient()
client.start()

# 运行完整的优化工作流
result = client.run_workflow("optimize_mpi_performance")

client.stop()
```

### 示例 2: 添加新功能

```python
from agent_team.client import AgentTeamClient

client = AgentTeamClient()
client.start()

# 后端：添加 API
client.add_api_endpoint("/api/new-feature", "POST", "新功能接口")

# 前端：添加页面
client.add_page("NewFeature", "/new-feature")

# 测试：编写测试
client.write_unit_test("backend/app/routes/new_feature")

# 运行测试
client.run_tests()

client.stop()
```

### 示例 3: 修复数据问题

```python
from agent_team.client import AgentTeamClient

client = AgentTeamClient()
client.start()

# 修复所有数据编码
client.fix_data_encoding()

# 或者运行完整的数据修复工作流
client.run_workflow("fix_encoding_issues")

client.stop()
```

### 示例 4: 部署应用

```python
from agent_team.client import AgentTeamClient

client = AgentTeamClient()
client.start()

# 运行部署工作流（包含测试、构建、部署）
result = client.run_workflow("deploy_application")

client.stop()
```

---

## 预定义工作流

| 工作流名称 | 说明 | 包含步骤 |
|-----------|------|---------|
| `optimize_mpi_performance` | MPI 性能优化 | 算法分析 → 算法优化 → 数据优化 → 后端优化 → 性能测试 |
| `add_new_feature` | 添加新功能 | 后端开发 → 前端开发 → 编写测试 → 运行测试 |
| `fix_encoding_issues` | 修复编码问题 | 扫描数据 → 修复编码 → 验证修复 |
| `deploy_application` | 部署应用 | 运行测试 → 构建前端 → 配置环境 → 部署 → 设置监控 |

---

## 常见问题

### Q: 如何查看任务执行结果？

```python
task_id = client.optimize_backend()
status = client.get_task_status(task_id)
print(status)
```

### Q: 如何查看所有可用的命令？

运行交互式界面，然后输入 `help`：
```bash
python agent_team/demo_interactive.py
```

### Q: Agent Team 会修改我的代码吗？

目前 Agent Team 处于**框架阶段**，它会接收并处理任务，但实际的代码修改需要你确认后执行。你可以根据返回的建议手动应用，或者扩展 Agent 的 `process_task` 方法来实现自动化修改。

---

## 扩展 Agent Team

如果需要添加自定义功能，可以编辑对应的 Agent 类：

- `backend/app/agent_team/agents.py` - 修改 Agent 实现
- `backend/app/agent_team/core.py` - 修改核心类
- `backend/app/agent_team/orchestrator.py` - 添加新的工作流

然后在 `client.py` 中添加对应的方法。
