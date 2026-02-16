import asyncio
import json
import os

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


def test_extract_lighthouse_runtime_error_from_payload():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    payload = {
        "runtimeError": {
            "code": "CHROME_INTERSTITIAL_ERROR",
            "message": "Chrome prevented page load with an interstitial.",
        }
    }

    error = scheduler._extract_lighthouse_runtime_error(payload)

    assert "CHROME_INTERSTITIAL_ERROR" in error
    assert "interstitial" in error.lower()


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


def test_collect_lighthouse_metrics_retries_with_fallback_url(tmp_path):
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    report_path = tmp_path / "lighthouse.json"
    called_urls = []

    async def fake_run_metric_command(command: str, timeout_seconds: float, env_overrides=None):
        if "http://127.0.0.1:5173/" in command:
            called_urls.append("http://127.0.0.1:5173/")
            report_path.write_text(
                json.dumps(
                    {
                        "runtimeError": {
                            "code": "CHROME_INTERSTITIAL_ERROR",
                            "message": "interstitial",
                        },
                        "finalUrl": "chrome-error://chromewebdata/",
                    }
                ),
                encoding="utf-8",
            )
        else:
            called_urls.append("http://localhost:5173/")
            report_path.write_text(
                json.dumps(
                    {
                        "categories": {
                            "performance": {"score": 0.64},
                            "accessibility": {"score": 0.91},
                            "best-practices": {"score": 0.86},
                        }
                    }
                ),
                encoding="utf-8",
            )
        return {"ok": True}

    scheduler._run_metric_command = fake_run_metric_command  # type: ignore[method-assign]

    config = {
        "enabled": True,
        "source": "command",
        "url": "http://127.0.0.1:5173/",
        "url_fallbacks": ["http://localhost:5173/"],
        "report_path": str(report_path),
        "command": "npx.cmd --yes lighthouse {url} --output=json --output-path=\"{report_path}\"",
        "timeout_seconds": 10,
        "freshness_minutes": 30,
    }

    result = asyncio.run(scheduler._collect_lighthouse_metrics("cycle_retry", config))

    assert called_urls == ["http://127.0.0.1:5173/", "http://localhost:5173/"]
    assert result["metrics"]["lighthouse_performance"] == 64.0
    assert result["metrics"]["lighthouse_accessibility"] == 91.0
    assert result["metrics"]["lighthouse_best_practices"] == 86.0
    assert not any("lighthouse runtime error" in msg for msg in result["errors"])


def test_collect_lighthouse_metrics_reports_runtime_error_details(tmp_path):
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    report_path = tmp_path / "lighthouse_runtime_error.json"

    async def fake_run_metric_command(command: str, timeout_seconds: float, env_overrides=None):
        report_path.write_text(
            json.dumps(
                {
                    "runtimeError": {
                        "code": "CHROME_INTERSTITIAL_ERROR",
                        "message": "Chrome prevented page load with an interstitial.",
                    },
                    "finalUrl": "chrome-error://chromewebdata/",
                }
            ),
            encoding="utf-8",
        )
        return {"ok": True}

    scheduler._run_metric_command = fake_run_metric_command  # type: ignore[method-assign]

    config = {
        "enabled": True,
        "source": "command",
        "url": "http://127.0.0.1:5173/",
        "url_fallbacks": [],
        "report_path": str(report_path),
        "command": "npx.cmd --yes lighthouse {url} --output=json --output-path=\"{report_path}\"",
        "timeout_seconds": 10,
        "freshness_minutes": 0,
    }

    result = asyncio.run(scheduler._collect_lighthouse_metrics("cycle_runtime_err", config))

    assert result["metrics"] == {}
    assert any("lighthouse runtime error" in msg for msg in result["errors"])
    assert any("CHROME_INTERSTITIAL_ERROR" in msg for msg in result["errors"])


def test_build_sonar_api_urls_includes_project_and_branch():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    urls = scheduler._build_sonar_api_urls(
        {
            "base_url": "http://sonar.local",
            "project_key": "mine-app",
            "branch": "main",
            "metric_keys": "critical_violations,major_violations",
        }
    )

    assert "projectKey=mine-app" in urls["quality_gate"]
    assert "branch=main" in urls["quality_gate"]
    assert "component=mine-app" in urls["measures"]
    assert "metricKeys=critical_violations%2Cmajor_violations" in urls["measures"]


def test_build_sonar_api_urls_supports_env_fallback():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    old_host = os.environ.get("SONAR_HOST_URL")
    old_project = os.environ.get("SONAR_PROJECT_KEY")
    old_branch = os.environ.get("SONAR_BRANCH")
    try:
        os.environ["SONAR_HOST_URL"] = "http://sonar.env.local"
        os.environ["SONAR_PROJECT_KEY"] = "mine-env"
        os.environ["SONAR_BRANCH"] = "develop"
        urls = scheduler._build_sonar_api_urls(
            {
                "base_url": "",
                "project_key": "",
                "branch": "",
                "branch_env": "SONAR_BRANCH",
                "metric_keys": "critical_violations,major_violations",
            }
        )
        assert "projectKey=mine-env" in urls["quality_gate"]
        assert "branch=develop" in urls["quality_gate"]
        assert "component=mine-env" in urls["measures"]
        assert "branch=develop" in urls["measures"]
        assert urls["quality_gate"].startswith("http://sonar.env.local/")
    finally:
        if old_host is None:
            os.environ.pop("SONAR_HOST_URL", None)
        else:
            os.environ["SONAR_HOST_URL"] = old_host
        if old_project is None:
            os.environ.pop("SONAR_PROJECT_KEY", None)
        else:
            os.environ["SONAR_PROJECT_KEY"] = old_project
        if old_branch is None:
            os.environ.pop("SONAR_BRANCH", None)
        else:
            os.environ["SONAR_BRANCH"] = old_branch


def test_load_env_file_populates_missing_env_values(tmp_path):
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    env_file = tmp_path / ".sonar.env"
    env_file.write_text(
        "\n".join(
            [
                "# comment",
                "SONAR_HOST_URL=http://sonar.test.local",
                "SONAR_PROJECT_KEY=test-project",
                "SONAR_BRANCH=main",
                "SONAR_TOKEN='abc123'",
            ]
        )
        + "\n",
        encoding="utf-8",
    )

    old_values = {key: os.environ.get(key) for key in ["SONAR_HOST_URL", "SONAR_PROJECT_KEY", "SONAR_BRANCH", "SONAR_TOKEN"]}
    for key in old_values:
        os.environ.pop(key, None)

    try:
        loaded = scheduler._load_env_file(env_file)
        assert loaded is True
        assert os.environ.get("SONAR_HOST_URL") == "http://sonar.test.local"
        assert os.environ.get("SONAR_PROJECT_KEY") == "test-project"
        assert os.environ.get("SONAR_BRANCH") == "main"
        assert os.environ.get("SONAR_TOKEN") == "abc123"
    finally:
        for key, value in old_values.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value


def test_collect_sonar_metrics_from_api(tmp_path):
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)

    def fake_fetch_json_url(url: str, timeout_seconds: float = 15.0, token: str = ""):
        if "qualitygates/project_status" in url:
            return {
                "ok": True,
                "payload": {
                    "projectStatus": {
                        "status": "OK",
                        "conditions": [
                            {"metricKey": "critical_violations", "actualValue": "0"},
                            {"metricKey": "major_violations", "actualValue": "3"},
                        ],
                    }
                },
            }
        if "measures/component" in url:
            return {
                "ok": True,
                "payload": {
                    "component": {
                        "measures": [
                            {"metric": "critical_violations", "value": "0"},
                            {"metric": "major_violations", "value": "3"},
                        ]
                    }
                },
            }
        return {"ok": False, "error": "unexpected url"}

    scheduler._fetch_json_url = fake_fetch_json_url  # type: ignore[method-assign]

    config = {
        "enabled": True,
        "source": "api",
        "base_url": "http://sonar.local",
        "project_key": "mine-app",
        "branch": "main",
        "token": "abc123",
        "api_cache_path": str(tmp_path / "sonar_api.json"),
        "report_path": str(tmp_path / "sonar_report.json"),
        "quality_gate_path": str(tmp_path / "sonar_gate.json"),
        "timeout_seconds": 5,
        "freshness_minutes": 0,
    }

    result = asyncio.run(scheduler._collect_sonar_metrics("cycle_sonar", config))

    assert result["metrics"]["sonar_quality_gate"] is True
    assert result["metrics"]["critical_violations"] == 0
    assert result["metrics"]["major_violations"] == 3
    assert result["errors"] == []


def test_check_sonar_connectivity_reports_missing_api_config(tmp_path):
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    config = {
        "enabled": True,
        "source": "api",
        "base_url": "",
        "project_key": "",
        "token_env": "SONAR_TOKEN",
        "report_path": str(tmp_path / "sonar_report.json"),
        "quality_gate_path": str(tmp_path / "sonar_gate.json"),
    }

    result = asyncio.run(scheduler._check_sonar_connectivity(config))

    assert result["connected"] is False
    assert any("sonar api not configured: missing base_url/project_key" in msg for msg in result["errors"])


def test_check_sonar_connectivity_api_success():
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)

    def fake_fetch_json_url(url: str, timeout_seconds: float = 15.0, token: str = ""):
        return {"ok": True, "payload": {"projectStatus": {"status": "OK"}}}

    scheduler._fetch_json_url = fake_fetch_json_url  # type: ignore[method-assign]

    config = {
        "enabled": True,
        "source": "api",
        "base_url": "http://sonar.local",
        "project_key": "mine-app",
        "token": "abc123",
        "connectivity_timeout_seconds": 1,
    }

    result = asyncio.run(scheduler._check_sonar_connectivity(config))

    assert result["connected"] is True
    assert "api" in result["sources"]
    assert result["errors"] == []
