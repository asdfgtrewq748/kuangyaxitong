"""
Core Agent Framework - Base classes and interfaces for all agents
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Callable
from dataclasses import dataclass, field
from enum import Enum
import json
import logging
from datetime import datetime
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AgentStatus(Enum):
    """Status of an agent"""
    IDLE = "idle"
    BUSY = "busy"
    ERROR = "error"
    OFFLINE = "offline"


class TaskPriority(Enum):
    """Task priority levels"""
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4


class TaskStatus(Enum):
    """Status of a task"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class Task:
    """Represents a task to be executed by an agent"""
    id: str
    title: str
    description: str
    agent_type: str  # Which agent type should handle this
    priority: TaskPriority = TaskPriority.NORMAL
    status: TaskStatus = TaskStatus.PENDING
    input_data: Dict[str, Any] = field(default_factory=dict)
    output_data: Dict[str, Any] = field(default_factory=dict)
    error_message: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    dependencies: List[str] = field(default_factory=list)  # Task IDs this depends on
    assigned_to: Optional[str] = None  # Agent ID
    progress: float = 0.0  # 0.0 to 1.0

    def to_dict(self) -> Dict[str, Any]:
        """Convert task to dictionary"""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "agent_type": self.agent_type,
            "priority": self.priority.value,
            "status": self.status.value,
            "input_data": self.input_data,
            "output_data": self.output_data,
            "error_message": self.error_message,
            "created_at": self.created_at.isoformat(),
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "dependencies": self.dependencies,
            "assigned_to": self.assigned_to,
            "progress": self.progress,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Task":
        """Create task from dictionary"""
        data["priority"] = TaskPriority(data["priority"])
        data["status"] = TaskStatus(data["status"])
        data["created_at"] = datetime.fromisoformat(data["created_at"])
        if data.get("started_at"):
            data["started_at"] = datetime.fromisoformat(data["started_at"])
        if data.get("completed_at"):
            data["completed_at"] = datetime.fromisoformat(data["completed_at"])
        return cls(**{k: v for k, v in data.items() if k in cls.__annotations__})


@dataclass
class AgentConfig:
    """Configuration for an agent"""
    id: str
    name: str
    agent_type: str
    description: str
    capabilities: List[str]
    tools: List[str]
    max_concurrent_tasks: int = 1
    auto_restart: bool = True
    log_level: str = "INFO"


class BaseAgent(ABC):
    """
    Base class for all agents in the system.

    Each agent is responsible for a specific domain of the project.
    """

    def __init__(self, config: AgentConfig):
        self.config = config
        self.status = AgentStatus.IDLE
        self.current_tasks: List[Task] = []
        self.completed_tasks: List[Task] = []
        self.message_handlers: Dict[str, Callable] = {}
        self._setup_logging()
        self._register_handlers()

    def _setup_logging(self):
        """Setup agent-specific logging"""
        self.logger = logging.getLogger(f"Agent.{self.config.agent_type}.{self.config.id}")
        self.logger.setLevel(getattr(logging, self.config.log_level))

    @abstractmethod
    def _register_handlers(self) -> None:
        """Register message handlers for this agent type"""
        pass

    @abstractmethod
    async def process_task(self, task: Task) -> Dict[str, Any]:
        """
        Process a task assigned to this agent.

        Args:
            task: The task to process

        Returns:
            Dictionary containing the result
        """
        pass

    async def execute_task(self, task: Task) -> Dict[str, Any]:
        """Execute a task with status tracking"""
        self.status = AgentStatus.BUSY
        self.current_tasks.append(task)
        task.status = TaskStatus.IN_PROGRESS
        task.started_at = datetime.now()
        task.assigned_to = self.config.id

        try:
            self.logger.info(f"Executing task: {task.id} - {task.title}")
            result = await self.process_task(task)

            task.status = TaskStatus.COMPLETED
            task.completed_at = datetime.now()
            task.progress = 1.0
            task.output_data = result

            self.completed_tasks.append(task)
            self.current_tasks.remove(task)

            return result

        except Exception as e:
            self.logger.error(f"Task {task.id} failed: {str(e)}")
            task.status = TaskStatus.FAILED
            task.error_message = str(e)
            task.completed_at = datetime.now()
            raise

        finally:
            if not self.current_tasks:
                self.status = AgentStatus.IDLE

    def can_handle_task(self, task: Task) -> bool:
        """Check if this agent can handle the given task"""
        return task.agent_type == self.config.agent_type and (
            len(self.current_tasks) < self.config.max_concurrent_tasks
        )

    def get_status(self) -> Dict[str, Any]:
        """Get current agent status"""
        return {
            "id": self.config.id,
            "name": self.config.name,
            "type": self.config.agent_type,
            "status": self.status.value,
            "current_tasks": len(self.current_tasks),
            "completed_tasks": len(self.completed_tasks),
            "task_ids": [t.id for t in self.current_tasks],
        }

    def handle_message(self, message_type: str, payload: Dict[str, Any]) -> Any:
        """Handle an incoming message"""
        handler = self.message_handlers.get(message_type)
        if handler:
            return handler(payload)
        else:
            self.logger.warning(f"No handler for message type: {message_type}")
            return None
