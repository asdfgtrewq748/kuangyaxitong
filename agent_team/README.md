# Agent Team System

Multi-agent orchestration system for the Mining Pressure Assessment project with **9 specialized agents**.

## Overview

This system coordinates two types of agents working together:

### Role-Based Agents (Coordinators)

| Agent | Role | Responsibilities |
|-------|------|-----------------|
| **Team Leader** | 决策者 (Decision Maker) | Analyzes project, coordinates team, makes decisions, reviews results |
| **QA Specialist** | 验收专家 (Validation Expert) | Reviews code, validates changes, enforces quality gates, generates reports |
| **Bug Hunter** | 修复者 (Fixer) | Scans for bugs, fixes violations, security checks, cleans technical debt |

### Domain-Specific Agents (Executors)

| Agent | Responsibilities |
|-------|-----------------|
| **Backend Agent** | FastAPI routes, services, performance |
| **Frontend Agent** | Vue 3 components, UI/UX, optimization |
| **Data Agent** | Borehole parsing, encoding, interpolation |
| **Algorithm Agent** | MPI calculations, geological modeling |
| **DevOps Agent** | Deployment, environment, monitoring |
| **Testing Agent** | Unit tests, integration tests, benchmarks |

## Quick Start

### Option 1: Basic Demo (Standard Agents)

```bash
cd agent_team
python demo_simple.py
```

This demonstrates:
- 9 agents working together
- Task creation and distribution
- Real-time status monitoring
- Results validation

### Option 2: Advanced Features (Recommended for Production)

```bash
cd agent_team
python test_advanced.py        # Test advanced features
python start_247_optimization.py   # Start 24/7 continuous optimization
```

**Advanced Features**:
- 🧠 **Team Leader** uses brainstorming skill for deep analysis
- 🌐 **QA Specialist** uses Playwright for automated browser testing
- 🔄 **24/7 Continuous Optimization** with intelligent scheduling
- ✅ **Auto-confirmation mode** - no prompts needed
- 📊 **Detailed reports** after every cycle

### Option 3: Manual Confirmation Mode

```bash
cd agent_team
python start_247_optimization.py --manual
```

This will prompt you for confirmation before each decision.

### Interactive Mode

```bash
python -m agent_team.main
```

### Run a Workflow

```bash
python -m agent_team.main --run-workflow optimize_mpi_performance
```

## Commands (Interactive)

| Command | Description |
|---------|-------------|
| `status` | Show overall system status |
| `agents` | List all agents and their status |
| `workflows` | List available workflow templates |
| `run <workflow>` | Run a predefined workflow |
| `submit` | Submit a new task (interactive) |
| `quick <type>` | Quick task for agent type |
| `task <id>` | Show status of a specific task |
| `help` | Show help message |
| `quit` | Exit the agent team |

## Workflows

- `optimize_mpi_performance` - Full MPI optimization workflow
- `add_new_feature` - Complete feature development
- `fix_encoding_issues` - Fix all data encoding
- `deploy_application` - Deploy to production

## Example

```python
from agent_team.interface import AgentTeamInterface

# Start the agent team
interface = AgentTeamInterface()
interface.start()

# Submit a task
task_id = interface.submit_task(
    title="Optimize MPI Algorithm",
    description="Analyze and optimize the MPI calculation",
    agent_type="algorithm",
    action="optimize_mpi",
)

# Check status
status = interface.task_status(task_id)
print(status)

# Run a workflow
interface.run_workflow("optimize_mpi_performance")
```
