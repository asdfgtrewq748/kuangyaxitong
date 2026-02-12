from __future__ import annotations

from app.services.perf_baseline import evaluate_reports, get_nested_value


def test_get_nested_value_reads_dot_path():
    payload = {"a": {"b": {"c": 1.23}}}
    assert get_nested_value(payload, "a.b.c") == 1.23
    assert get_nested_value(payload, "a.b.x") is None


def test_evaluate_reports_aggregates_and_validates_thresholds():
    reports = [
        {
            "scenarios": [
                {
                    "name": "mpi_interpolate_large_grid",
                    "summary": {
                        "success_rate": 1.0,
                        "rps": 11.2,
                        "latency_ms": {"p95": 320.0},
                    },
                }
            ]
        },
        {
            "scenarios": [
                {
                    "name": "mpi_interpolate_large_grid",
                    "summary": {
                        "success_rate": 0.98,
                        "rps": 9.8,
                        "latency_ms": {"p95": 380.0},
                    },
                }
            ]
        },
    ]
    thresholds = {
        "scenarios": {
            "mpi_interpolate_large_grid": {
                "success_rate": {"min": 0.99},
                "rps": {"min": 8.0},
                "latency_ms.p95": {"max": 400.0},
            }
        }
    }

    result = evaluate_reports(reports, thresholds)
    assert result["all_passed"] is False
    checks = result["results"][0]["checks"]
    success_check = next(item for item in checks if item["metric"] == "success_rate")
    assert success_check["passed"] is False
    assert success_check["actual"]["min"] == 0.98
    rps_check = next(item for item in checks if item["metric"] == "rps")
    assert rps_check["passed"] is True
    p95_check = next(item for item in checks if item["metric"] == "latency_ms.p95")
    assert p95_check["actual"]["max"] == 380.0


def test_evaluate_reports_can_allow_missing_scenarios():
    reports = [
        {
            "scenarios": [
                {
                    "name": "mpi_interpolate_large_grid",
                    "summary": {"success_rate": 1.0},
                }
            ]
        }
    ]
    thresholds = {
        "scenarios": {
            "geomodel_status_poll": {
                "success_rate": {"min": 0.99},
            }
        }
    }

    strict_result = evaluate_reports(reports, thresholds, allow_missing_scenarios=False)
    assert strict_result["all_passed"] is False

    relaxed_result = evaluate_reports(reports, thresholds, allow_missing_scenarios=True)
    assert relaxed_result["all_passed"] is True
