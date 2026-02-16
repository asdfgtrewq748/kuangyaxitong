import asyncio

import pytest

from agent_team.coordinator import AgentCoordinator
from agent_team.core import AgentConfig, BaseAgent


def test_load_tasks_does_not_resume_queue_by_default(tmp_path):
    coordinator = AgentCoordinator(workspace_path=str(tmp_path))
    task = coordinator.create_task(
        title="queued-task",
        description="should not be auto-resumed",
        agent_type="leader",
    )
    coordinator.submit_task(task)

    reloaded = AgentCoordinator(workspace_path=str(tmp_path))
    reloaded._load_tasks()

    assert len(reloaded.task_queue) == 0


def test_load_tasks_can_resume_queue_when_requested(tmp_path):
    coordinator = AgentCoordinator(workspace_path=str(tmp_path))
    task = coordinator.create_task(
        title="queued-task",
        description="resume expected",
        agent_type="leader",
    )
    coordinator.submit_task(task)

    reloaded = AgentCoordinator(workspace_path=str(tmp_path))
    reloaded._load_tasks(resume_queued_tasks=True)

    assert len(reloaded.task_queue) == 1
    assert reloaded.task_queue[0].title == "queued-task"


class _AlwaysFailAgent(BaseAgent):
    def __init__(self):
        config = AgentConfig(
            id="failing-01",
            name="Failing Agent",
            agent_type="failing",
            description="always fails",
            capabilities=[],
            tools=[],
        )
        super().__init__(config)

    def _register_handlers(self) -> None:
        self.message_handlers = {}

    async def process_task(self, task):
        raise RuntimeError("simulated failure")


def test_execute_task_tracks_failed_task_on_exception(tmp_path):
    coordinator = AgentCoordinator(workspace_path=str(tmp_path))
    coordinator.register_agent(_AlwaysFailAgent())
    task = coordinator.create_task(
        title="will-fail",
        description="failure should be tracked",
        agent_type="failing",
    )

    with pytest.raises(RuntimeError):
        asyncio.run(coordinator.execute_task(task))

    assert len(coordinator.failed_tasks) == 1
    status = coordinator.get_task_status(task.id)
    assert status is not None
    assert status["status"] == "failed"
    assert "simulated failure" in str(status.get("error_message", ""))
