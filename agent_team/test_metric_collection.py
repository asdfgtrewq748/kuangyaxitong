import asyncio
import json

from agent_team.continuous_optimization import ContinuousOptimizationScheduler


def test_parse_lighthouse_report_extracts_percent_scores():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    payload = {
        "categories": {
            "performance": {"score": 0.81},
            "accessibility": {"score": 0.93},
            "best-practices": {"score": 0.88},
        }
    }

    metrics = scheduler._parse_lighthouse_report(payload)

    assert metrics["lighthouse_performance"] == 81.0
    assert metrics["lighthouse_accessibility"] == 93.0
    assert metrics["lighthouse_best_practices"] == 88.0


def test_extract_sonar_metrics_from_quality_gate_payload():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    payload = {
        "projectStatus": {
            "status": "ERROR",
            "conditions": [
                {"metricKey": "critical_violations", "actualValue": "2"},
                {"metricKey": "major_violations", "actualValue": "7"},
            ],
        }
    }

    metrics = scheduler._extract_sonar_metrics(payload)

    assert metrics["sonar_quality_gate"] is False
    assert metrics["critical_violations"] == 2
    assert metrics["major_violations"] == 7


def test_collect_external_quality_metrics_from_files(tmp_path):
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    lighthouse_path = tmp_path / "lighthouse.json"
    sonar_gate_path = tmp_path / "sonar_gate.json"
    sonar_report_path = tmp_path / "sonar_report.json"

    lighthouse_path.write_text(
        json.dumps(
            {
                "categories": {
                    "performance": {"score": 0.79},
                    "accessibility": {"score": 0.90},
                    "best-practices": {"score": 0.86},
                }
            }
        ),
        encoding="utf-8",
    )
    sonar_gate_path.write_text(
        json.dumps(
            {
                "projectStatus": {
                    "status": "OK",
                    "conditions": [
                        {"metricKey": "critical_violations", "actualValue": "0"},
                        {"metricKey": "major_violations", "actualValue": "4"},
                    ],
                }
            }
        ),
        encoding="utf-8",
    )
    sonar_report_path.write_text(json.dumps({"issues": []}), encoding="utf-8")

    scheduler.schedule_config["metric_collection"] = {
        "enabled": True,
        "notify_on_collection_error": False,
        "lighthouse": {
            "enabled": True,
            "source": "file",
            "report_path": str(lighthouse_path),
        },
        "sonar": {
            "enabled": True,
            "source": "file",
            "report_path": str(sonar_report_path),
            "quality_gate_path": str(sonar_gate_path),
        },
    }

    collection = asyncio.run(scheduler._collect_external_quality_metrics("cycle_test"))
    analysis = scheduler._merge_analysis_metrics({"metrics": {"code_coverage": 82}}, collection)

    assert collection["errors"] == []
    assert analysis["metrics"]["code_coverage"] == 82
    assert analysis["metrics"]["lighthouse_performance"] == 79.0
    assert analysis["metrics"]["lighthouse_accessibility"] == 90.0
    assert analysis["metrics"]["lighthouse_best_practices"] == 86.0
    assert analysis["metrics"]["sonar_quality_gate"] is True
    assert analysis["metrics"]["critical_violations"] == 0
    assert analysis["metrics"]["major_violations"] == 4


def test_collect_lighthouse_metrics_adds_discovered_browser_path(tmp_path):
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    captured = {}

    async def fake_run_metric_command(command: str, timeout_seconds: float, env_overrides=None):
        captured["command"] = command
        captured["env"] = env_overrides or {}
        return {"ok": False, "error": "simulated"}

    scheduler._run_metric_command = fake_run_metric_command  # type: ignore[method-assign]
    scheduler._discover_lighthouse_browser_path = lambda: "C:/fake/browser.exe"  # type: ignore[method-assign]

    config = {
        "enabled": True,
        "source": "command",
        "url": "http://127.0.0.1:5173/",
        "report_path": str(tmp_path / "lighthouse.json"),
        "command": "npx.cmd --yes lighthouse {url} --output=json --output-path=\"{report_path}\"",
        "timeout_seconds": 10,
        "freshness_minutes": 0,
    }

    result = asyncio.run(scheduler._collect_lighthouse_metrics("cycle_x", config))

    assert captured["env"]["CHROME_PATH"] == "C:/fake/browser.exe"
    assert result["metrics"] == {}
    assert len(result["errors"]) >= 1
