import asyncio

from agent_team.continuous_optimization import ContinuousOptimizationScheduler


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

    assert result["status"] == "pending"
    assert result["timed_out"] is True
