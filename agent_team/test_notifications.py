import asyncio
import json

from agent_team.continuous_optimization import ContinuousOptimizationScheduler


def test_quality_gates_detect_violations():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)

    analysis = {
        "metrics": {
            "code_coverage": 70,
            "critical_issues": 2,
            "performance_score": 60,
        }
    }
    validation = {"approved": False}

    result = scheduler._evaluate_quality_gates(analysis, validation)

    assert result["passed"] is False
    checks = {item["name"]: item for item in result["checks"]}
    assert checks["code_coverage"]["passed"] is False
    assert checks["critical_issues"]["passed"] is False
    assert checks["performance_score"]["passed"] is False
    assert checks["validation_approved"]["passed"] is False
    assert len(result["violations"]) >= 1


def test_build_cycle_summary_normalizes_issue_count():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)

    summary = scheduler._build_cycle_summary(
        cycle_id="cycle_x",
        analysis={"metrics": {"code_coverage": 81}},
        execution_results=[
            {"status": "completed"},
            {"status": "failed"},
            {"status": "completed"},
        ],
        validation={
            "approved": False,
            "issues_found": ["a", "b", "c"],
            "method": "playwright_browser_testing",
        },
        quality_gate_result={"passed": False, "violations": ["code_coverage"]},
        focus_areas=["testing", "performance"],
    )

    assert summary["cycle_id"] == "cycle_x"
    assert summary["execution"]["total_tasks"] == 3
    assert summary["execution"]["completed"] == 2
    assert summary["execution"]["failed"] == 1
    assert summary["execution"]["timed_out"] == 0
    assert summary["validation"]["issues_found"] == 3
    assert summary["quality_gates"]["passed"] is False


def test_quality_gates_support_extended_config_fields():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    scheduler.schedule_config["quality_gates"] = {
        "code_coverage_minimum": 80,
        "lighthouse_accessibility_minimum": 90,
        "lighthouse_best_practices_minimum": 85,
        "major_violations_maximum": 10,
        "sonar_quality_gate_required": True,
        "all_tests_pass_required": True,
    }

    analysis = {
        "metrics": {
            "code_coverage": 88,
            "accessibility_score": 92,
            "best_practices_score": 87,
            "major_issues": 12,
            "sonar_quality_gate_passed": False,
        }
    }
    validation = {"approved": True}

    result = scheduler._evaluate_quality_gates(analysis, validation)
    checks = {item["name"]: item for item in result["checks"]}

    assert checks["code_coverage"]["passed"] is True
    assert checks["lighthouse_accessibility"]["passed"] is True
    assert checks["lighthouse_best_practices"]["passed"] is True
    assert checks["major_violations"]["passed"] is False
    assert checks["sonar_quality_gate"]["passed"] is False
    assert checks["validation_approved"]["passed"] is True
    assert result["passed"] is False


def test_quality_gates_can_fail_on_missing_metrics():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    scheduler.schedule_config["quality_gates"] = {
        "lighthouse_accessibility_minimum": 90,
        "fail_on_missing_metrics": True,
    }

    result = scheduler._evaluate_quality_gates({"metrics": {}}, {"approved": True})
    checks = {item["name"]: item for item in result["checks"]}

    assert checks["lighthouse_accessibility"]["evaluated"] is False
    assert checks["lighthouse_accessibility"]["passed"] is False
    assert "lighthouse_accessibility" in result["missing_metrics"]
    assert result["passed"] is False


def test_notify_runtime_alert_appends_jsonl(tmp_path):
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    alert_file = tmp_path / "alerts.jsonl"
    scheduler.schedule_config["notifications"] = {
        "alert_file": str(alert_file),
        "webhook_url": "",
        "on_critical_issue": False,
    }

    asyncio.run(
        scheduler._notify_runtime_alert(
            "cycle_error",
            "simulated failure",
            {"cycle_number": 5},
        )
    )

    lines = alert_file.read_text(encoding="utf-8").strip().splitlines()
    assert len(lines) == 1
    payload = json.loads(lines[0])
    assert payload["type"] == "cycle_error"
    assert payload["message"] == "simulated failure"
    assert payload["context"]["cycle_number"] == 5


def test_get_cycle_timeout_seconds_uses_limits():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    scheduler.schedule_config["limits"]["cycle_timeout_minutes"] = 2

    assert scheduler._get_cycle_timeout_seconds() == 120.0


def test_build_cycle_summary_counts_timed_out_as_failed():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)

    summary = scheduler._build_cycle_summary(
        cycle_id="cycle_timeout",
        analysis={"metrics": {"code_coverage": 85}},
        execution_results=[
            {"status": "completed", "title": "done"},
            {"status": "timed_out", "title": "timeout"},
            {"status": "failed", "title": "failed"},
        ],
        validation={
            "approved": False,
            "issues_found": 1,
        },
        quality_gate_result={"passed": False, "violations": ["validation_approved"]},
        focus_areas=["testing"],
    )

    assert summary["execution"]["completed"] == 1
    assert summary["execution"]["failed"] == 2
    assert summary["execution"]["timed_out"] == 1
    assert summary["validation"]["method"] == "qa_validation"
