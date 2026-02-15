"""
Agent Coordinator - Central orchestrator for the agent team
"""

import asyncio
import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime
from pathlib import Path
import json

from .core import (
    BaseAgent,
    Task,
    TaskPriority,
    TaskStatus,
    AgentStatus,
    AgentConfig,
)


class AgentCoordinator:
    """
    Central coordinator that manages the agent team.

    Responsibilities:
    - Task distribution to appropriate agents
    - Monitoring agent health and status
    - Handling inter-agent communication
    - Task queue management
    - Progress tracking and reporting
    """

    def __init__(self, workspace_path: str = None):
        self.workspace_path = Path(workspace_path) if workspace_path else Path.cwd()
        self.agents: Dict[str, BaseAgent] = {}
        self.task_queue: List[Task] = []
        self.completed_tasks: List[Task] = []
        self.failed_tasks: List[Task] = []
        self.running = False
        self.task_history_path = self.workspace_path / ".claude" / "agent_tasks.json"

    def register_agent(self, agent: BaseAgent) -> None:
        """Register an agent with the coordinator"""
        self.agents[agent.config.id] = agent
        print(f"[Coordinator] Registered agent: {agent.config.name} ({agent.config.agent_type})")

    def unregister_agent(self, agent_id: str) -> None:
        """Unregister an agent"""
        if agent_id in self.agents:
            del self.agents[agent_id]
            print(f"[Coordinator] Unregistered agent: {agent_id}")

    def get_agent_by_type(self, agent_type: str) -> Optional[BaseAgent]:
        """Get an available agent of the specified type"""
        for agent in self.agents.values():
            if agent.config.agent_type == agent_type and agent.status == AgentStatus.IDLE:
                return agent
        return None

    def get_all_agents_by_type(self, agent_type: str) -> List[BaseAgent]:
        """Get all agents of the specified type"""
        return [a for a in self.agents.values() if a.config.agent_type == agent_type]

    def create_task(
        self,
        title: str,
        description: str,
        agent_type: str,
        priority: TaskPriority = TaskPriority.NORMAL,
        input_data: Dict[str, Any] = None,
        dependencies: List[str] = None,
    ) -> Task:
        """Create a new task"""
        task = Task(
            id=str(uuid.uuid4()),
            title=title,
            description=description,
            agent_type=agent_type,
            priority=priority,
            input_data=input_data or {},
            dependencies=dependencies or [],
        )
        return task

    def submit_task(self, task: Task) -> str:
        """Submit a task to the queue"""
        self.task_queue.append(task)
        self._save_tasks()
        print(f"[Coordinator] Task queued: {task.title} (ID: {task.id})")
        return task.id

    async def execute_task(self, task: Task) -> Dict[str, Any]:
        """Execute a specific task"""
        # Find an appropriate agent
        agent = self.get_agent_by_type(task.agent_type)
        if not agent:
            raise ValueError(f"No available agent for type: {task.agent_type}")

        # Execute the task
        result = await agent.execute_task(task)

        # Update tracking
        if task.status == TaskStatus.COMPLETED:
            self.completed_tasks.append(task)
        elif task.status == TaskStatus.FAILED:
            self.failed_tasks.append(task)

        self._save_tasks()
        return result

    async def start(self) -> None:
        """Start the coordinator and begin processing tasks"""
        self.running = True
        print("[Coordinator] Starting agent team coordinator...")

        # Load previous tasks if any
        self._load_tasks()

        # Start task processing loop
        asyncio.create_task(self._process_queue())

    async def stop(self) -> None:
        """Stop the coordinator"""
        self.running = False
        print("[Coordinator] Stopping coordinator...")

    async def _process_queue(self) -> None:
        """Process tasks from the queue"""
        while self.running:
            if self.task_queue:
                # Sort by priority and dependencies
                self.task_queue.sort(key=lambda t: (t.priority.value, t.created_at))

                # Check for tasks whose dependencies are met
                for task in self.task_queue[:]:
                    if self._can_execute_task(task):
                        self.task_queue.remove(task)
                        asyncio.create_task(self._execute_and_handle(task))

            await asyncio.sleep(0.5)

    def _can_execute_task(self, task: Task) -> bool:
        """Check if task dependencies are satisfied"""
        if not task.dependencies:
            return True

        completed_ids = {t.id for t in self.completed_tasks}
        return all(dep_id in completed_ids for dep_id in task.dependencies)

    async def _execute_and_handle(self, task: Task) -> None:
        """Execute task and handle result"""
        try:
            await self.execute_task(task)
            print(f"[Coordinator] Task completed: {task.title}")
        except Exception as e:
            print(f"[Coordinator] Task failed: {task.title} - {str(e)}")

    def get_status(self) -> Dict[str, Any]:
        """Get overall system status"""
        agent_statuses = {agent_id: agent.get_status() for agent_id, agent in self.agents.items()}

        return {
            "coordinator_running": self.running,
            "total_agents": len(self.agents),
            "queued_tasks": len(self.task_queue),
            "completed_tasks": len(self.completed_tasks),
            "failed_tasks": len(self.failed_tasks),
            "agents": agent_statuses,
        }

    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get status of a specific task"""
        # Check queue
        for task in self.task_queue:
            if task.id == task_id:
                return task.to_dict()

        # Check completed
        for task in self.completed_tasks:
            if task.id == task_id:
                return task.to_dict()

        # Check failed
        for task in self.failed_tasks:
            if task.id == task_id:
                return task.to_dict()

        # Check agent current tasks
        for agent in self.agents.values():
            for task in agent.current_tasks:
                if task.id == task_id:
                    return task.to_dict()

        return None

    def _save_tasks(self) -> None:
        """Save task history to file"""
        self.task_history_path.parent.mkdir(parents=True, exist_ok=True)

        history = {
            "completed": [t.to_dict() for t in self.completed_tasks],
            "failed": [t.to_dict() for t in self.failed_tasks],
            "queued": [t.to_dict() for t in self.task_queue],
        }

        with open(self.task_history_path, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2, ensure_ascii=False)

    def _load_tasks(self) -> None:
        """Load task history from file"""
        if not self.task_history_path.exists():
            return

        with open(self.task_history_path, "r", encoding="utf-8") as f:
            history = json.load(f)

        self.completed_tasks = [Task.from_dict(t) for t in history.get("completed", [])]
        self.failed_tasks = [Task.from_dict(t) for t in history.get("failed", [])]
        self.task_queue = [Task.from_dict(t) for t in history.get("queued", [])]

        print(f"[Coordinator] Loaded {len(self.completed_tasks)} completed tasks")

    def print_status(self) -> None:
        """Print a formatted status report"""
        status = self.get_status()

        print("\n" + "=" * 60)
        print(" AGENT TEAM STATUS")
        print("=" * 60)
        print(f"Running: {status['coordinator_running']}")
        print(f"Total Agents: {status['total_agents']}")
        print(f"Queued Tasks: {status['queued_tasks']}")
        print(f"Completed Tasks: {status['completed_tasks']}")
        print(f"Failed Tasks: {status['failed_tasks']}")

        print("\n--- Agents ---")
        for agent_id, agent_status in status["agents"].items():
            print(f"  {agent_id}: {agent_status['status']} ({agent_status['current_tasks']} tasks)")

        print("=" * 60 + "\n")
