from __future__ import annotations

from typing import Any, Dict, List, Optional


def get_nested_value(data: Dict[str, Any], path: str) -> Optional[float]:
    current: Any = data
    for key in str(path).split("."):
        if not isinstance(current, dict) or key not in current:
            return None
        current = current[key]
    try:
        return float(current)
    except Exception:
        return None


def _collect_metric_values(
    reports: List[Dict[str, Any]],
    scenario_name: str,
    metric_path: str,
) -> List[float]:
    values: List[float] = []
    for report in reports:
        for scenario in report.get("scenarios", []):
            if scenario.get("name") != scenario_name:
                continue
            summary = scenario.get("summary", {})
            value = get_nested_value(summary, metric_path)
            if value is not None:
                values.append(value)
    return values


def evaluate_reports(
    reports: List[Dict[str, Any]],
    thresholds: Dict[str, Any],
    allow_missing_scenarios: bool = False,
) -> Dict[str, Any]:
    scenario_rules = thresholds.get("scenarios", {})
    results: List[Dict[str, Any]] = []
    all_passed = True

    for scenario_name, metric_rules in scenario_rules.items():
        checks: List[Dict[str, Any]] = []
        scenario_passed = True
        for metric_path, rule in metric_rules.items():
            values = _collect_metric_values(reports, scenario_name, metric_path)
            if not values:
                passed_when_missing = bool(allow_missing_scenarios)
                check = {
                    "metric": metric_path,
                    "passed": passed_when_missing,
                    "reason": "no_data",
                    "threshold": rule,
                    "actual": {"min": None, "max": None, "avg": None, "count": 0},
                }
                checks.append(check)
                scenario_passed = scenario_passed and passed_when_missing
                continue

            actual = {
                "min": min(values),
                "max": max(values),
                "avg": sum(values) / len(values),
                "count": len(values),
            }
            passed = True
            if "min" in rule:
                passed = passed and (actual["min"] >= float(rule["min"]))
            if "max" in rule:
                passed = passed and (actual["max"] <= float(rule["max"]))
            checks.append(
                {
                    "metric": metric_path,
                    "passed": passed,
                    "threshold": rule,
                    "actual": actual,
                }
            )
            scenario_passed = scenario_passed and passed

        results.append(
            {
                "scenario": scenario_name,
                "passed": scenario_passed,
                "checks": checks,
            }
        )
        all_passed = all_passed and scenario_passed

    return {"all_passed": all_passed, "results": results}
