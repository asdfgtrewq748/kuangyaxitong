import asyncio

from agent_team.continuous_optimization import ContinuousOptimizationScheduler
from agent_team.core import Task


class FakeCoordinator:
    def __init__(self, statuses):
        self.statuses = statuses
        self.calls = 0

    def get_task_status(self, task_id):
        idx = min(self.calls, len(self.statuses) - 1)
        self.calls += 1
        return self.statuses[idx]


def test_wait_for_task_completion_returns_completed_status():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    scheduler.coordinator = FakeCoordinator(
        [
            {"status": "pending"},
            {"status": "in_progress"},
            {"status": "completed", "output_data": {"approved": True}},
        ]
    )

    result = asyncio.run(
        scheduler._wait_for_task_completion("task-1", timeout_seconds=1, poll_interval=0.01)
    )

    assert result["status"] == "completed"
    assert result["output_data"]["approved"] is True


def test_wait_for_task_completion_marks_timeout():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    scheduler.coordinator = FakeCoordinator([{"status": "pending"}])

    result = asyncio.run(
        scheduler._wait_for_task_completion("task-2", timeout_seconds=0.03, poll_interval=0.01)
    )

    assert result["status"] == "timed_out"
    assert result["timed_out"] is True


def test_wait_for_task_completion_uses_task_context_when_status_missing():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    scheduler.coordinator = FakeCoordinator([None])
    task = Task(
        id="task-ctx",
        title="important task",
        description="execute with context fallback",
        agent_type="qa",
    )

    result = asyncio.run(
        scheduler._wait_for_task_completion(
            "task-ctx",
            timeout_seconds=0.03,
            poll_interval=0.01,
            task_context=task,
        )
    )

    assert result["status"] == "timed_out"
    assert result["timed_out"] is True
    assert result["title"] == "important task"
    assert result["assigned_to"] == "qa"
