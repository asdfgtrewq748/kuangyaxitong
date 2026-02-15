# Agent Team System

Multi-agent orchestration system for the Mining Pressure Assessment project.

## Overview

This system coordinates specialized agents, each responsible for different aspects of the project:

| Agent | Responsibilities |
|-------|-----------------|
| **Backend Agent** | FastAPI routes, services, performance |
| **Frontend Agent** | Vue 3 components, UI/UX, optimization |
| **Data Agent** | Borehole parsing, encoding, interpolation |
| **Algorithm Agent** | MPI calculations, geological modeling |
| **DevOps Agent** | Deployment, environment, monitoring |
| **Testing Agent** | Unit tests, integration tests, benchmarks |

## Usage

### Interactive Mode

```bash
python -m agent_team.main
```

### Run a Workflow

```bash
python -m agent_team.main --run-workflow optimize_mpi_performance
```

### Demo

```bash
python -m agent_team.main demo
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
