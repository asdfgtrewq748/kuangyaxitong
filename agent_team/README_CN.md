# Agent Team - 调用指南

## 概述

Agent Team 是一个多代理协作系统，帮助你管理项目的不同功能模块。它包含 6 个专业化 Agent，可以帮你处理各种开发任务。

## 三种调用方式

### 方式 1: Python 代码调用

```python
from agent_team.client import AgentTeamClient

client = AgentTeamClient()
client.start()

# 提交任务
task_id = client.optimize_backend()

# 运行工作流
client.run_workflow("optimize_mpi_performance")

client.stop()
```

### 方式 2: 命令行工具

```bash
# 优化任务
python agent_team/at.py optimize backend
python agent_team/at.py optimize mpi

# 开发任务
python agent_team/at.py add api /test POST
python agent_team/at.py add page TestPage /test

# 工作流
python agent_team/at.py workflow run optimize_mpi_performance

# 查看状态
python agent_team/at.py status
```

### 方式 3: 交互式界面

```bash
python agent_team/demo_interactive.py
```

---

## 快速命令参考

| 命令 | 说明 |
|------|------|
| `at optimize backend` | 优化后端 API |
| `at optimize frontend` | 优化前端 |
| `at optimize mpi` | 优化 MPI 算法 |
| `at optimize all` | 运行完整优化工作流 |
| `at add api <path> <method>` | 添加 API 端点 |
| `at add page <name> <route>` | 添加页面 |
| `at data fix` | 修复数据编码 |
| `at test run` | 运行测试 |
| `at workflow list` | 列出所有工作流 |
| `at status` | 查看系统状态 |

---

## 预定义工作流

| 工作流 | 说明 |
|--------|------|
| `optimize_mpi_performance` | MPI 性能优化完整流程 |
| `add_new_feature` | 新功能开发完整流程 |
| `fix_encoding_issues` | 数据编码修复完整流程 |
| `deploy_application` | 应用部署完整流程 |

---

## 示例

### 示例 1: 添加新功能

```bash
# 1. 添加后端 API
python agent_team/at.py add api /pressure/new POST

# 2. 添加前端页面
python agent_team/at.py add page PressureNew /pressure/new

# 3. 编写测试
python agent_team/at.py test unit backend/app/routes/pressure

# 4. 运行测试
python agent_team/at.py test run
```

### 示例 2: 优化系统

```bash
# 运行完整优化工作流
python agent_team/at.py workflow run optimize_mpi_performance
```

### 示例 3: 修复数据问题

```bash
# 运行数据修复工作流
python agent_team/at.py workflow run fix_encoding_issues
```

---

## 文件结构

```
agent_team/
├── __init__.py          # 包初始化
├── core.py              # 核心类
├── coordinator.py       # 协调器
├── agents.py            # 6 个 Agent 实现
├── orchestrator.py      # 工作流编排
├── interface.py         # 交互界面
├── client.py            # Python 客户端
├── at.py               # 命令行工具
├── demo_interactive.py # 交互式演示
├── main.py             # 入口文件
└── USAGE.md            # 详细使用指南
```

---

## 注意事项

1. 当前 Agent Team 处于**框架阶段**
2. 任务会被接收和处理，但实际代码修改需要确认后执行
3. 你可以根据返回的建议手动应用修改
4. 如需自动化，可以扩展 Agent 的 `process_task` 方法
