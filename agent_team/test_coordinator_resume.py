from agent_team.coordinator import AgentCoordinator


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
