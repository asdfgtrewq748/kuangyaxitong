import asyncio
import json

from agent_team.continuous_optimization import ContinuousOptimizationScheduler


def test_extract_strategy_plan_backlog_from_markdown(tmp_path):
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    plan_path = tmp_path / "plan.md"
    plan_path.write_text(
        "\n".join(
            [
                "### Week 1",
                "- [ ] Fix critical issue",
                "- [x] Done item",
                "### Week 2",
                "- [ ] Add e2e tests",
            ]
        )
        + "\n",
        encoding="utf-8",
    )

    backlog = scheduler._extract_strategy_plan_backlog({"plan_path": str(plan_path)})

    assert len(backlog) == 2
    assert backlog[0]["section"] == "Week 1"
    assert backlog[0]["title"] == "Fix critical issue"
    assert backlog[1]["section"] == "Week 2"
    assert backlog[1]["title"] == "Add e2e tests"
    assert backlog[0]["task_id"] != backlog[1]["task_id"]


def test_select_strategy_plan_tasks_skips_completed(tmp_path):
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    plan_path = tmp_path / "plan.md"
    state_path = tmp_path / "state.json"
    plan_path.write_text(
        "\n".join(
            [
                "### Week 1",
                "- [ ] task one",
                "- [ ] task two",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    backlog = scheduler._extract_strategy_plan_backlog({"plan_path": str(plan_path)})
    state_path.write_text(
        json.dumps({"completed_task_ids": [backlog[0]["task_id"]]}, ensure_ascii=False),
        encoding="utf-8",
    )

    scheduler.schedule_config["strategy_plan"] = {
        "enabled": True,
        "plan_path": str(plan_path),
        "state_path": str(state_path),
        "max_tasks_per_cycle": 2,
    }

    selected = scheduler._select_strategy_plan_tasks_for_cycle()

    assert len(selected) == 1
    assert selected[0]["title"] == "task two"


def test_create_tasks_includes_strategy_plan_and_marks_progress(tmp_path):
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    plan_path = tmp_path / "plan.md"
    state_path = tmp_path / "state.json"
    plan_path.write_text(
        "\n".join(
            [
                "### Week 1",
                "- [ ] Add Playwright e2e tests",
                "- [ ] Fix Sonar critical issue",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    scheduler.schedule_config["strategy_plan"] = {
        "enabled": True,
        "plan_path": str(plan_path),
        "state_path": str(state_path),
        "max_tasks_per_cycle": 2,
    }

    tasks = asyncio.run(
        scheduler._create_optimization_tasks({"opportunities": []})
    )
    assert len(tasks) == 2
    assert all(task.input_data.get("strategy_plan_task_id") for task in tasks)

    execution_results = []
    for task in tasks:
        execution_results.append(
            {
                "status": "completed",
                "input_data": task.input_data,
            }
        )

    scheduler._update_strategy_plan_progress(execution_results)
    state_payload = json.loads(state_path.read_text(encoding="utf-8"))
    assert len(state_payload["completed_task_ids"]) == 2

