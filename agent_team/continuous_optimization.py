#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
24/7 Continuous Optimization System

This scheduler runs the agent team continuously with intelligent task scheduling.
Uses schedule_config.json for configuration and supports automatic confirmation mode.
"""

import asyncio
import base64
import hashlib
import json
import logging
import os
import re
import subprocess
import signal
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, List, Optional
from urllib import request as urllib_request
from urllib import error as urllib_error
from urllib import parse as urllib_parse

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_team.coordinator import AgentCoordinator
from agent_team.agents_advanced import create_advanced_agents
from agent_team.agents import create_domain_agents
from agent_team.core import Task, TaskPriority

# Setup logging
log_file = Path(__file__).parent / "continuous_optimization.log"
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


class ContinuousOptimizationScheduler:
    """
    24/7 Continuous Optimization Scheduler

    Runs optimization cycles continuously with:
    - Time-based focus areas
    - Weekly themes
    - Quality gates
    - Automatic confirmation
    - Detailed reporting
    """

    def __init__(self, auto_confirm: bool = True):
        self.auto_confirm = auto_confirm
        self._load_local_env_files()
        self.coordinator = AgentCoordinator()
        self.schedule_config = self._load_schedule_config()
        self.is_running = False
        self.cycle_count = 0
        self.reports_dir = Path(__file__).parent / "optimization_reports"
        self.reports_dir.mkdir(parents=True, exist_ok=True)
        self.notifications_dir = Path(__file__).parent / "notifications"
        self.notifications_dir.mkdir(parents=True, exist_ok=True)

        # Setup graceful shutdown
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)

    def _signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        logger.info(f"[Scheduler] Received signal {signum}, shutting down gracefully...")
        self.is_running = False

    def _load_local_env_files(self) -> None:
        """Load optional local env files without overriding existing variables."""
        candidates = [
            Path.cwd() / ".env",
            Path.cwd() / "agent_team" / ".env",
            Path.cwd() / "agent_team" / ".sonar.env",
        ]
        loaded_paths: List[str] = []
        for path in candidates:
            if self._load_env_file(path):
                loaded_paths.append(str(path))
        if loaded_paths:
            logger.info("[Scheduler] Loaded env file(s): %s", ", ".join(loaded_paths))

    def _load_env_file(self, path: Path) -> bool:
        """Load KEY=VALUE entries from a local env file."""
        if not path.exists() or not path.is_file():
            return False
        loaded_any = False
        try:
            with open(path, "r", encoding="utf-8") as handle:
                for raw_line in handle:
                    line = raw_line.strip()
                    if not line or line.startswith("#"):
                        continue
                    if line.startswith("export "):
                        line = line[len("export ") :].strip()
                    if "=" not in line:
                        continue
                    key, value = line.split("=", 1)
                    key = key.strip()
                    if not key:
                        continue
                    value = value.strip()
                    if len(value) >= 2 and (
                        (value.startswith('"') and value.endswith('"'))
                        or (value.startswith("'") and value.endswith("'"))
                    ):
                        value = value[1:-1]
                    if key in os.environ:
                        continue
                    os.environ[key] = value
                    loaded_any = True
        except Exception as exc:
            logger.warning("[Scheduler] Failed to load env file %s: %s", path, exc)
            return False
        return loaded_any

    def _load_schedule_config(self) -> Dict:
        """Load schedule configuration from file"""
        config_path = Path.cwd() / "agent_team" / "schedule_config.json"

        if config_path.exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            logger.warning(f"[Scheduler] Config file not found: {config_path}, using defaults")
            return self._default_schedule()

    def _default_schedule(self) -> Dict:
        """Default schedule if no config file exists"""
        return {
            "cycle_interval_minutes": 30,
            "focus_hours": {
                "00-06": ["stability", "bug_fixes", "security"],
                "06-12": ["performance", "testing", "optimization"],
                "12-18": ["features", "architecture", "refactoring"],
                "18-24": ["review", "documentation", "cleanup"]
            },
            "weekly_theme": {
                "monday": "performance_optimization",
                "tuesday": "test_coverage",
                "wednesday": "architecture_improvements",
                "thursday": "security_hardening",
                "friday": "documentation",
                "saturday": "bug_bash",
                "sunday": "tech_debt_cleanup"
            },
            "quality_gates": {
                "code_coverage_minimum": 80,
                "lighthouse_performance_minimum": 85,
                "critical_violations_maximum": 0
            },
            "metric_collection": {
                "enabled": True,
                "notify_on_collection_error": False,
                "lighthouse": {
                    "enabled": True,
                    "source": "command",
                    "url": "http://localhost:5173/",
                    "url_fallbacks": ["http://127.0.0.1:5173/"],
                    "report_path": "agent_team/metrics/lighthouse_report.json",
                    "chrome_path": "",
                    "command": "npx.cmd --yes lighthouse {url} --only-categories=performance,accessibility,best-practices --quiet --chrome-flags=\"--headless --no-sandbox --disable-gpu --ignore-certificate-errors --allow-insecure-localhost --disable-dev-shm-usage\" --output=json --output-path=\"{report_path}\"",
                    "timeout_seconds": 180,
                    "freshness_minutes": 30
                },
                "sonar": {
                    "enabled": True,
                    "source": "auto",
                    "base_url": "",
                    "base_url_env": "SONAR_HOST_URL",
                    "project_key": "",
                    "project_key_env": "SONAR_PROJECT_KEY",
                    "branch": "",
                    "branch_env": "SONAR_BRANCH",
                    "token_env": "SONAR_TOKEN",
                    "startup_connectivity_check": True,
                    "notify_on_connectivity_failure": False,
                    "connectivity_timeout_seconds": 15,
                    "api_cache_path": "agent_team/metrics/sonar_api.json",
                    "metric_keys": "critical_violations,major_violations",
                    "report_path": "agent_team/metrics/sonar_report.json",
                    "quality_gate_path": "agent_team/metrics/sonar_quality_gate.json",
                    "command": "",
                    "timeout_seconds": 60,
                    "freshness_minutes": 30
                }
            },
            "notifications": {
                "on_cycle_complete": True,
                "on_critical_issue": True,
                "summary_file": "agent_team/notifications/cycle_summaries.jsonl",
                "alert_file": "agent_team/notifications/quality_alerts.jsonl",
                "webhook_url": "",
                "webhook_timeout_seconds": 5,
            },
            "automation_settings": {
                "auto_fix_simple_bugs": True,
                "auto_refactor_safe_code": True,
                "auto_deploy": False
            },
            "limits": {
                "max_concurrent_tasks": 5,
                "max_retries": 3,
                "task_timeout_minutes": 30,
                "cycle_timeout_minutes": 120,
            },
            "strategy_plan": {
                "enabled": True,
                "plan_path": "8_WEEK_ACTION_PLAN.md",
                "state_path": "agent_team/state/strategy_plan_state.json",
                "max_tasks_per_cycle": 2,
            },
        }

    def _safe_float(self, value: Any) -> Optional[float]:
        """Convert value to float, returning None on failure."""
        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    def _coerce_bool(self, value: Any) -> bool:
        """Normalize boolean-like values from config/metrics."""
        if isinstance(value, bool):
            return value
        if isinstance(value, (int, float)):
            return value != 0
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"1", "true", "yes", "y", "on", "pass", "passed"}:
                return True
            if normalized in {"0", "false", "no", "n", "off", "fail", "failed"}:
                return False
        return bool(value)

    def _get_cycle_interval_seconds(self) -> int:
        """Read cycle interval from config with validation."""
        interval_minutes = self._safe_float(self.schedule_config.get("cycle_interval_minutes", 30))
        if interval_minutes is None or interval_minutes <= 0:
            return 30 * 60
        return max(int(interval_minutes * 60), 1)

    def _get_cycle_timeout_seconds(self) -> Optional[float]:
        """Read cycle timeout from config (None means disabled)."""
        limits = self.schedule_config.get("limits", {})
        timeout_minutes = self._safe_float(limits.get("cycle_timeout_minutes"))
        if timeout_minutes is None or timeout_minutes <= 0:
            return None
        return timeout_minutes * 60.0

    async def _sleep_with_shutdown_checks(self, sleep_seconds: int) -> None:
        """Sleep while still responding quickly to shutdown signals."""
        for _ in range(max(int(sleep_seconds), 0)):
            if not self.is_running:
                break
            await asyncio.sleep(1)

    async def _notify_runtime_alert(
        self,
        alert_type: str,
        message: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Persist runtime alerts and optionally send webhook notifications."""
        notifications = self.schedule_config.get("notifications", {})
        context = context or {}
        payload = {
            "type": alert_type,
            "timestamp": datetime.now().isoformat(),
            "message": message,
            "context": context,
        }

        alert_path = self._resolve_notification_path(
            notifications.get("alert_file", "agent_team/notifications/quality_alerts.jsonl"),
            "agent_team/notifications/quality_alerts.jsonl",
        )
        self._append_json_line(alert_path, payload)
        logger.warning("[Notifications] Runtime alert appended: %s", alert_path)

        webhook_url = notifications.get("webhook_url")
        webhook_timeout = float(notifications.get("webhook_timeout_seconds", 5))
        if webhook_url and notifications.get("on_critical_issue", True):
            self._post_webhook_notification(
                webhook_url,
                {"type": alert_type, "data": payload},
                timeout_seconds=webhook_timeout,
            )

    async def _run_cycle_with_timeout(self) -> bool:
        """Run one cycle with optional timeout enforcement."""
        timeout_seconds = self._get_cycle_timeout_seconds()
        if timeout_seconds is None:
            await self._run_optimization_cycle()
            return True

        try:
            await asyncio.wait_for(self._run_optimization_cycle(), timeout=timeout_seconds)
            return True
        except asyncio.TimeoutError:
            timeout_minutes = timeout_seconds / 60.0
            cycle_number = max(self.cycle_count, 1)
            message = (
                f"Cycle #{cycle_number} timed out after {timeout_minutes:.2f} minutes"
            )
            logger.error("[Scheduler] %s", message)
            await self._notify_runtime_alert(
                "cycle_timeout",
                message,
                {
                    "cycle_number": cycle_number,
                    "timeout_seconds": timeout_seconds,
                },
            )
            return False

    def _resolve_data_path(self, configured_path: str, fallback_name: str) -> Path:
        """Resolve a data path relative to workspace and ensure parent exists."""
        target = configured_path or fallback_name
        path = Path(target)
        if not path.is_absolute():
            path = Path.cwd() / target
        path.parent.mkdir(parents=True, exist_ok=True)
        return path

    def _load_json_if_exists(self, path: Path) -> Any:
        """Load JSON payload if file exists and is valid."""
        if not path.exists():
            return None
        try:
            with open(path, "r", encoding="utf-8") as handle:
                return json.load(handle)
        except Exception as exc:
            logger.warning("[Metrics] Failed to parse JSON from %s: %s", path, exc)
            return None

    def _is_file_fresh(self, path: Path, freshness_minutes: float) -> bool:
        """Check whether a file is newer than freshness threshold."""
        if not path.exists():
            return False
        freshness_seconds = max(float(freshness_minutes), 0.0) * 60.0
        if freshness_seconds <= 0:
            return False
        age_seconds = (datetime.now() - datetime.fromtimestamp(path.stat().st_mtime)).total_seconds()
        return age_seconds <= freshness_seconds

    def _compact_error_text(self, value: str, max_lines: int = 4, max_chars: int = 400) -> str:
        """Trim noisy command stderr/stdout text for concise alerts."""
        text = (value or "").strip()
        if not text:
            return ""
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        compact = " | ".join(lines[:max_lines])
        if len(compact) > max_chars:
            compact = compact[: max_chars - 3] + "..."
        return compact

    def _discover_lighthouse_browser_path(self) -> str:
        """Find a Chromium-based browser path for Lighthouse on Windows/macOS/Linux."""
        candidates = [
            Path("C:/Program Files/Google/Chrome/Application/chrome.exe"),
            Path("C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"),
            Path("C:/Program Files/Microsoft/Edge/Application/msedge.exe"),
            Path("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"),
            Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
            Path("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"),
            Path("/usr/bin/google-chrome"),
            Path("/usr/bin/chromium-browser"),
            Path("/usr/bin/chromium"),
            Path("/snap/bin/chromium"),
        ]
        for candidate in candidates:
            if candidate.exists():
                return str(candidate)
        return ""

    async def _run_metric_command(
        self,
        command: str,
        timeout_seconds: float,
        env_overrides: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """Run external metric command and return execution metadata."""
        env = dict(os.environ)
        if env_overrides:
            env.update({k: str(v) for k, v in env_overrides.items() if v is not None})
        try:
            completed = await asyncio.to_thread(
                subprocess.run,
                command,
                shell=True,
                cwd=str(Path.cwd()),
                capture_output=True,
                text=True,
                timeout=max(timeout_seconds, 1.0),
                env=env,
            )
        except subprocess.TimeoutExpired:
            return {"ok": False, "error": f"command timed out after {timeout_seconds} seconds"}
        except Exception as exc:
            return {"ok": False, "error": f"command execution failed: {exc}"}

        if completed.returncode != 0:
            stderr = (completed.stderr or "").strip()
            stdout = (completed.stdout or "").strip()
            detail = self._compact_error_text(stderr or stdout or f"exit code {completed.returncode}")
            return {"ok": False, "error": detail}

        return {"ok": True}

    def _build_sonar_auth_header(self, token: str) -> str:
        """Build Sonar Basic auth header from token."""
        encoded = base64.b64encode(f"{token}:".encode("utf-8")).decode("ascii")
        return f"Basic {encoded}"

    def _fetch_json_url(
        self,
        url: str,
        timeout_seconds: float = 15.0,
        token: str = "",
    ) -> Dict[str, Any]:
        """Fetch JSON over HTTP and return normalized result."""
        headers = {"Accept": "application/json"}
        if token:
            headers["Authorization"] = self._build_sonar_auth_header(token)

        request_obj = urllib_request.Request(url, headers=headers, method="GET")
        try:
            with urllib_request.urlopen(request_obj, timeout=max(timeout_seconds, 1.0)) as response:
                body = response.read().decode("utf-8", errors="replace")
                payload = json.loads(body)
                return {"ok": True, "payload": payload}
        except urllib_error.HTTPError as exc:
            return {"ok": False, "error": self._compact_error_text(f"HTTP {exc.code}: {exc.reason}")}
        except urllib_error.URLError as exc:
            return {"ok": False, "error": self._compact_error_text(str(exc.reason))}
        except json.JSONDecodeError as exc:
            return {"ok": False, "error": self._compact_error_text(f"invalid JSON response: {exc}")}
        except Exception as exc:
            return {"ok": False, "error": self._compact_error_text(str(exc))}

    def _resolve_sonar_token(self, config: Dict[str, Any]) -> str:
        """Resolve Sonar token from config value or environment variable."""
        token = str(config.get("token", "")).strip()
        if token:
            return token
        env_name = str(config.get("token_env", "SONAR_TOKEN")).strip()
        if not env_name:
            return ""
        return str(os.environ.get(env_name, "")).strip()

    def _resolve_sonar_connection(self, config: Dict[str, Any]) -> Dict[str, str]:
        """Resolve Sonar base_url/project_key/branch from config or environment."""
        base_url = str(config.get("base_url", "")).strip()
        project_key = str(config.get("project_key", "")).strip()
        branch = str(config.get("branch", "")).strip()

        base_url_env = str(config.get("base_url_env", "SONAR_HOST_URL")).strip() or "SONAR_HOST_URL"
        project_key_env = str(config.get("project_key_env", "SONAR_PROJECT_KEY")).strip() or "SONAR_PROJECT_KEY"
        branch_env = str(config.get("branch_env", "SONAR_BRANCH")).strip() or "SONAR_BRANCH"

        if not base_url:
            base_url = str(os.environ.get(base_url_env, "")).strip()
        if not project_key:
            project_key = str(os.environ.get(project_key_env, "")).strip()
        if not branch:
            branch = str(os.environ.get(branch_env, "")).strip()

        return {
            "base_url": base_url.rstrip("/"),
            "project_key": project_key,
            "branch": branch,
            "base_url_env": base_url_env,
            "project_key_env": project_key_env,
            "branch_env": branch_env,
        }

    def _build_sonar_api_urls(self, config: Dict[str, Any]) -> Dict[str, str]:
        """Build Sonar API endpoint URLs from config."""
        connection = self._resolve_sonar_connection(config)
        base_url = connection.get("base_url", "")
        project_key = connection.get("project_key", "")
        branch = connection.get("branch", "")
        metric_keys = str(config.get("metric_keys", "critical_violations,major_violations")).strip()
        if not base_url or not project_key:
            return {}

        quality_params = {"projectKey": project_key}
        measures_params = {"component": project_key, "metricKeys": metric_keys}
        if branch:
            quality_params["branch"] = branch
            measures_params["branch"] = branch

        return {
            "quality_gate": f"{base_url}/api/qualitygates/project_status?{urllib_parse.urlencode(quality_params)}",
            "measures": f"{base_url}/api/measures/component?{urllib_parse.urlencode(measures_params)}",
        }

    def _parse_lighthouse_report(self, payload: Any) -> Dict[str, Any]:
        """Parse lighthouse JSON payload into quality gate metrics."""
        metrics: Dict[str, Any] = {}
        if not isinstance(payload, dict):
            return metrics

        categories = payload.get("categories", {})
        category_map = {
            "lighthouse_performance": "performance",
            "lighthouse_accessibility": "accessibility",
            "lighthouse_best_practices": "best-practices",
        }
        for metric_key, category_key in category_map.items():
            category = categories.get(category_key, {})
            score = category.get("score") if isinstance(category, dict) else None
            numeric = self._safe_float(score)
            if numeric is not None:
                value = round(numeric * 100.0, 2)
                metrics[metric_key] = value
                metrics[f"{metric_key}_score"] = value

        return metrics

    def _extract_lighthouse_runtime_error(self, payload: Any) -> str:
        """Extract runtime error details from Lighthouse payload."""
        if not isinstance(payload, dict):
            return ""

        runtime_error = payload.get("runtimeError")
        if isinstance(runtime_error, dict):
            code = str(runtime_error.get("code", "")).strip()
            message = str(runtime_error.get("message", "")).strip()
            if code and message:
                return f"{code}: {self._compact_error_text(message)}"
            if code:
                return code
            if message:
                return self._compact_error_text(message)

        final_url = str(payload.get("finalUrl", "")).strip()
        if final_url.startswith("chrome-error://"):
            return f"CHROME_INTERSTITIAL_ERROR: finalUrl={final_url}"
        return ""

    def _resolve_lighthouse_urls(self, config: Dict[str, Any]) -> List[str]:
        """Resolve Lighthouse target URLs with fallback candidates."""
        primary = str(config.get("url", "http://localhost:5173/")).strip() or "http://localhost:5173/"
        raw_fallbacks = config.get("url_fallbacks", ["http://localhost:5173/", "http://127.0.0.1:5173/"])
        fallback_urls: List[str] = []
        if isinstance(raw_fallbacks, list):
            fallback_urls = [str(item).strip() for item in raw_fallbacks if str(item).strip()]
        elif isinstance(raw_fallbacks, str):
            fallback_urls = [part.strip() for part in raw_fallbacks.split(",") if part.strip()]

        urls: List[str] = []
        for candidate in [primary, *fallback_urls]:
            if candidate and candidate not in urls:
                urls.append(candidate)
        return urls

    def _extract_sonar_metrics(self, payload: Any) -> Dict[str, Any]:
        """Extract sonar metrics from common SonarQube JSON formats."""
        metrics: Dict[str, Any] = {}
        if not isinstance(payload, dict):
            return metrics

        project_status = payload.get("projectStatus")
        if isinstance(project_status, dict):
            status_text = str(project_status.get("status", "")).upper()
            if status_text:
                metrics["sonar_quality_gate"] = status_text in {"OK", "PASS", "PASSED"}
            for condition in project_status.get("conditions", []):
                if not isinstance(condition, dict):
                    continue
                metric_key = str(condition.get("metricKey", "")).lower()
                value = self._safe_float(condition.get("actualValue"))
                if value is None:
                    continue
                if "critical_violations" in metric_key:
                    metrics["critical_violations"] = int(value)
                elif "major_violations" in metric_key:
                    metrics["major_violations"] = int(value)

        component = payload.get("component")
        if isinstance(component, dict):
            for measure in component.get("measures", []):
                if not isinstance(measure, dict):
                    continue
                metric = str(measure.get("metric", "")).lower()
                value = self._safe_float(measure.get("value"))
                if value is None:
                    continue
                if metric == "critical_violations":
                    metrics["critical_violations"] = int(value)
                elif metric == "major_violations":
                    metrics["major_violations"] = int(value)

        issues = payload.get("issues")
        if isinstance(issues, list):
            severity_counts = {"CRITICAL": 0, "MAJOR": 0}
            for issue in issues:
                if not isinstance(issue, dict):
                    continue
                severity = str(issue.get("severity", "")).upper()
                if severity in severity_counts:
                    severity_counts[severity] += 1
            if severity_counts["CRITICAL"] > 0 and "critical_violations" not in metrics:
                metrics["critical_violations"] = severity_counts["CRITICAL"]
            if severity_counts["MAJOR"] > 0 and "major_violations" not in metrics:
                metrics["major_violations"] = severity_counts["MAJOR"]

        return metrics

    async def _collect_lighthouse_metrics(self, cycle_id: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Collect lighthouse metrics from command or report file."""
        report_path = self._resolve_data_path(
            config.get("report_path", "agent_team/metrics/lighthouse_report.json"),
            "agent_team/metrics/lighthouse_report.json",
        )
        source_mode = str(config.get("source", "file")).lower()
        freshness_minutes = self._safe_float(config.get("freshness_minutes", 30)) or 30.0
        timeout_seconds = self._safe_float(config.get("timeout_seconds", 180)) or 180.0
        errors: List[str] = []
        payload = self._load_json_if_exists(report_path)
        metrics = self._parse_lighthouse_report(payload)
        runtime_error = self._extract_lighthouse_runtime_error(payload)

        if source_mode == "command":
            has_fresh_report = self._is_file_fresh(report_path, freshness_minutes)
            needs_refresh = (not has_fresh_report) or (not metrics) or bool(runtime_error)
            if needs_refresh:
                command_template = config.get(
                    "command",
                    "npx.cmd --yes lighthouse {url} --only-categories=performance,accessibility,best-practices --quiet --chrome-flags=\"--headless --no-sandbox --disable-gpu --ignore-certificate-errors --allow-insecure-localhost --disable-dev-shm-usage\" --output=json --output-path=\"{report_path}\"",
                )
                browser_path = str(config.get("chrome_path", "")).strip() or self._discover_lighthouse_browser_path()
                env_overrides = {"CHROME_PATH": browser_path} if browser_path else None
                candidate_urls = self._resolve_lighthouse_urls(config)
                command_succeeded = False
                runtime_error = ""

                for candidate_url in candidate_urls:
                    command = str(command_template).format(url=candidate_url, report_path=str(report_path))
                    command_result = await self._run_metric_command(command, timeout_seconds, env_overrides=env_overrides)
                    if not command_result.get("ok", False):
                        errors.append(
                            f"lighthouse command failed ({candidate_url}): {command_result.get('error', 'unknown error')}"
                        )
                        continue

                    command_succeeded = True
                    payload = self._load_json_if_exists(report_path)
                    metrics = self._parse_lighthouse_report(payload)
                    runtime_error = self._extract_lighthouse_runtime_error(payload)
                    if metrics:
                        break

                if command_succeeded and (not metrics) and runtime_error:
                    errors.append(f"lighthouse runtime error: {runtime_error}")

        if not metrics:
            errors.append("lighthouse report missing or no parseable category scores")

        return {
            "collector": "lighthouse",
            "cycle_id": cycle_id,
            "source_mode": source_mode,
            "report_path": str(report_path),
            "metrics": metrics,
            "errors": errors,
        }

    async def _collect_sonar_metrics(self, cycle_id: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Collect sonar metrics from file(s), command output, and/or Sonar API."""
        report_path = self._resolve_data_path(
            config.get("report_path", "agent_team/metrics/sonar_report.json"),
            "agent_team/metrics/sonar_report.json",
        )
        gate_path = self._resolve_data_path(
            config.get("quality_gate_path", "agent_team/metrics/sonar_quality_gate.json"),
            "agent_team/metrics/sonar_quality_gate.json",
        )
        cache_path = self._resolve_data_path(
            config.get("api_cache_path", "agent_team/metrics/sonar_api.json"),
            "agent_team/metrics/sonar_api.json",
        )
        source_mode = str(config.get("source", "auto")).lower()
        freshness_minutes = self._safe_float(config.get("freshness_minutes", 30)) or 30.0
        timeout_seconds = self._safe_float(config.get("timeout_seconds", 60)) or 60.0
        errors: List[str] = []
        metrics: Dict[str, Any] = {}
        required_metrics = {"sonar_quality_gate", "critical_violations", "major_violations"}

        if source_mode in {"command", "auto"}:
            command = str(config.get("command", "")).strip()
            has_fresh_data = self._is_file_fresh(report_path, freshness_minutes) or self._is_file_fresh(gate_path, freshness_minutes)
            if command and not has_fresh_data:
                command_result = await self._run_metric_command(command, timeout_seconds)
                if not command_result.get("ok", False):
                    errors.append(f"sonar command failed: {command_result.get('error', 'unknown error')}")

        if source_mode in {"file", "auto", "command"}:
            report_payload = self._load_json_if_exists(report_path)
            gate_payload = self._load_json_if_exists(gate_path)
            metrics.update(self._extract_sonar_metrics(report_payload))
            metrics.update(self._extract_sonar_metrics(gate_payload))

        needs_api = source_mode == "api" or (
            source_mode == "auto" and not required_metrics.issubset(set(metrics.keys()))
        )
        api_payloads: Dict[str, Any] = {}
        connection = self._resolve_sonar_connection(config) if needs_api else {}
        api_urls = self._build_sonar_api_urls(config) if needs_api else {}
        token = self._resolve_sonar_token(config)

        if needs_api:
            if self._is_file_fresh(cache_path, freshness_minutes):
                cached_payload = self._load_json_if_exists(cache_path)
                if isinstance(cached_payload, dict):
                    api_payloads = cached_payload.get("payloads", {}) if isinstance(cached_payload.get("payloads", {}), dict) else {}

            if not api_payloads:
                if not api_urls:
                    errors.append(
                        "sonar api disabled: missing base_url/project_key "
                        f"(set {connection.get('base_url_env', 'SONAR_HOST_URL')} and {connection.get('project_key_env', 'SONAR_PROJECT_KEY')})"
                    )
                else:
                    fetch_failed = False
                    for name, url in api_urls.items():
                        fetch_result = await asyncio.to_thread(
                            self._fetch_json_url,
                            url,
                            timeout_seconds,
                            token,
                        )
                        if fetch_result.get("ok", False):
                            api_payloads[name] = fetch_result.get("payload")
                        else:
                            fetch_failed = True
                            errors.append(f"sonar api {name} failed: {fetch_result.get('error', 'unknown error')}")

                    if not fetch_failed and api_payloads:
                        cache_payload = {
                            "fetched_at": datetime.now().isoformat(),
                            "payloads": api_payloads,
                        }
                        with open(cache_path, "w", encoding="utf-8") as handle:
                            json.dump(cache_payload, handle, ensure_ascii=False, indent=2)

            metrics.update(self._extract_sonar_metrics(api_payloads.get("quality_gate")))
            metrics.update(self._extract_sonar_metrics(api_payloads.get("measures")))

        if not metrics:
            errors.append("sonar report missing or no parseable metrics")

        return {
            "collector": "sonar",
            "cycle_id": cycle_id,
            "source_mode": source_mode,
            "report_path": str(report_path),
            "quality_gate_path": str(gate_path),
            "api_cache_path": str(cache_path),
            "api_urls": api_urls,
            "metrics": metrics,
            "errors": errors,
        }

    async def _check_sonar_connectivity(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Check whether Sonar data sources are reachable/configured at startup."""
        source_mode = str(config.get("source", "auto")).lower()
        timeout_seconds = (
            self._safe_float(config.get("connectivity_timeout_seconds"))
            or self._safe_float(config.get("timeout_seconds"))
            or 15.0
        )
        result = {"collector": "sonar", "connected": False, "sources": [], "errors": []}

        report_path = self._resolve_data_path(
            config.get("report_path", "agent_team/metrics/sonar_report.json"),
            "agent_team/metrics/sonar_report.json",
        )
        gate_path = self._resolve_data_path(
            config.get("quality_gate_path", "agent_team/metrics/sonar_quality_gate.json"),
            "agent_team/metrics/sonar_quality_gate.json",
        )

        if source_mode in {"file", "auto", "command"}:
            if report_path.exists() or gate_path.exists():
                result["sources"].append("file")
            elif source_mode == "file":
                result["errors"].append("sonar file source selected but no report files found")

        if source_mode in {"api", "auto"}:
            connection = self._resolve_sonar_connection(config)
            api_urls = self._build_sonar_api_urls(config)
            token = self._resolve_sonar_token(config)
            token_env = str(config.get("token_env", "SONAR_TOKEN")).strip() or "SONAR_TOKEN"

            if not api_urls:
                result["errors"].append(
                    "sonar api not configured: missing base_url/project_key "
                    f"(set {connection.get('base_url_env', 'SONAR_HOST_URL')} and {connection.get('project_key_env', 'SONAR_PROJECT_KEY')})"
                )
            elif not token:
                result["errors"].append(f"sonar api token missing: set {token_env}")
            else:
                quality_url = api_urls.get("quality_gate", "")
                fetch_result = await asyncio.to_thread(
                    self._fetch_json_url,
                    quality_url,
                    timeout_seconds,
                    token,
                )
                if fetch_result.get("ok", False):
                    result["sources"].append("api")
                else:
                    result["errors"].append(
                        f"sonar api quality_gate check failed: {fetch_result.get('error', 'unknown error')}"
                    )

        if source_mode == "command":
            command = str(config.get("command", "")).strip()
            if command:
                result["sources"].append("command")
            else:
                result["errors"].append("sonar command source selected but command is empty")

        result["sources"] = sorted(set(result["sources"]))
        result["connected"] = len(result["sources"]) > 0
        return result

    async def _run_metric_connectivity_checks(self) -> None:
        """Run startup connectivity checks for external metric providers."""
        collection_config = self.schedule_config.get("metric_collection", {})
        if not self._coerce_bool(collection_config.get("enabled", False)):
            return

        sonar_config = collection_config.get("sonar", {})
        if not self._coerce_bool(sonar_config.get("enabled", False)):
            return
        if not self._coerce_bool(sonar_config.get("startup_connectivity_check", True)):
            return

        result = await self._check_sonar_connectivity(sonar_config)
        if result.get("connected", False):
            logger.info(
                "[Metrics] Sonar connectivity check passed via: %s",
                ", ".join(result.get("sources", [])),
            )
            return

        errors = result.get("errors", [])
        logger.warning(
            "[Metrics] Sonar connectivity check failed: %s",
            "; ".join(errors) if errors else "unknown reason",
        )
        if self._coerce_bool(sonar_config.get("notify_on_connectivity_failure", False)):
            await self._notify_runtime_alert(
                "metric_connectivity_failure",
                "Sonar connectivity check failed",
                {
                    "collector": "sonar",
                    "errors": errors,
                },
            )

    async def _collect_external_quality_metrics(self, cycle_id: str) -> Dict[str, Any]:
        """Collect external quality metrics and aggregate results."""
        collection_config = self.schedule_config.get("metric_collection", {})
        if not self._coerce_bool(collection_config.get("enabled", False)):
            return {"metrics": {}, "sources": [], "errors": []}

        aggregated = {"metrics": {}, "sources": [], "errors": []}

        lighthouse_config = collection_config.get("lighthouse", {})
        if self._coerce_bool(lighthouse_config.get("enabled", False)):
            lighthouse_result = await self._collect_lighthouse_metrics(cycle_id, lighthouse_config)
            aggregated["metrics"].update(lighthouse_result.get("metrics", {}))
            aggregated["sources"].append(
                {
                    "collector": "lighthouse",
                    "mode": lighthouse_result.get("source_mode", "unknown"),
                    "report_path": lighthouse_result.get("report_path", ""),
                }
            )
            aggregated["errors"].extend(lighthouse_result.get("errors", []))

        sonar_config = collection_config.get("sonar", {})
        if self._coerce_bool(sonar_config.get("enabled", False)):
            sonar_result = await self._collect_sonar_metrics(cycle_id, sonar_config)
            aggregated["metrics"].update(sonar_result.get("metrics", {}))
            aggregated["sources"].append(
                {
                    "collector": "sonar",
                    "mode": sonar_result.get("source_mode", "unknown"),
                    "report_path": sonar_result.get("report_path", ""),
                    "quality_gate_path": sonar_result.get("quality_gate_path", ""),
                    "api_cache_path": sonar_result.get("api_cache_path", ""),
                    "api_enabled": bool(sonar_result.get("api_urls")),
                }
            )
            aggregated["errors"].extend(sonar_result.get("errors", []))

        return aggregated

    def _merge_analysis_metrics(
        self,
        analysis: Dict[str, Any],
        external_collection: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Merge externally collected metrics into analysis payload."""
        merged = analysis if isinstance(analysis, dict) else {}
        merged.setdefault("metrics", {})
        merged.setdefault("opportunities", [])

        if not isinstance(merged.get("metrics"), dict):
            merged["metrics"] = {}

        external_metrics = external_collection.get("metrics", {}) if isinstance(external_collection, dict) else {}
        if isinstance(external_metrics, dict):
            merged["metrics"].update(external_metrics)

        merged["external_metrics"] = {
            "sources": external_collection.get("sources", []) if isinstance(external_collection, dict) else [],
            "errors": external_collection.get("errors", []) if isinstance(external_collection, dict) else [],
            "timestamp": datetime.now().isoformat(),
        }
        return merged

    async def start(self):
        """Start 24/7 continuous optimization loop"""
        self.is_running = True

        print("=" * 70)
        print("24/7 Continuous Optimization System")
        print("=" * 70)
        print("\nThis will run continuous optimization cycles until stopped.")
        print("Press Ctrl+C to stop gracefully.\n")
        print("Configuration:")

        # Show configuration
        cycle_interval_seconds = self._get_cycle_interval_seconds()
        cycle_timeout_seconds = self._get_cycle_timeout_seconds()
        print(f"  - Cycle interval: {cycle_interval_seconds / 60:.2f} minutes")
        if cycle_timeout_seconds:
            print(f"  - Cycle timeout: {cycle_timeout_seconds / 60:.2f} minutes")
        else:
            print("  - Cycle timeout: disabled")
        print(f"  - Auto-confirm: {self.auto_confirm}")
        print(f"  - Reports directory: {self.reports_dir}")
        print("\nAdvanced Features:")
        print("  - Team Leader uses brainstorming skill for analysis")
        print("  - QA Specialist uses Playwright for browser testing")
        print("  - Intelligent task scheduling based on time and day")
        print("  - Quality gates enforce standards")
        print("=" * 70 + "\n")

        # Register all agents
        logger.info("[Scheduler] Registering agents...")

        # Role-based agents (advanced versions with skills)
        advanced_agents = create_advanced_agents(auto_confirm=self.auto_confirm)
        for agent in advanced_agents:
            self.coordinator.register_agent(agent)
            logger.info(f"  鉁?Registered advanced agent: {agent.config.name}")

        # Domain-specific agents
        domain_agents = create_domain_agents()
        for agent in domain_agents:
            self.coordinator.register_agent(agent)
            logger.info(f"  鉁?Registered domain agent: {agent.config.name}")

        # Start coordinator
        await self.coordinator.start()
        await self._run_metric_connectivity_checks()

        # Main optimization loop
        while self.is_running:
            try:
                await self._run_cycle_with_timeout()

                # Wait for next cycle
                interval_minutes = cycle_interval_seconds / 60.0
                logger.info(f"[Scheduler] Waiting {interval_minutes} minutes until next cycle...")

                # Sleep in small increments to check for shutdown signal
                await self._sleep_with_shutdown_checks(cycle_interval_seconds)

            except Exception as e:
                logger.error(f"[Scheduler] Error in optimization cycle: {e}")
                await self._notify_runtime_alert(
                    "cycle_error",
                    str(e),
                    {"cycle_number": self.cycle_count},
                )
                # Continue to next cycle despite errors
                await asyncio.sleep(60)  # Wait 1 minute before retry

        # Shutdown
        logger.info("[Scheduler] Shutting down...")
        await self.coordinator.stop()
        logger.info("[Scheduler] Shutdown complete")

    async def _run_optimization_cycle(self):
        """Run a single optimization cycle"""
        self.cycle_count += 1
        cycle_id = datetime.now().strftime("%Y%m%d_%H%M%S")

        logger.info("=" * 70)
        logger.info(f"[Cycle #{self.cycle_count}] Starting optimization cycle {cycle_id}")
        logger.info("=" * 70)

        # Phase 1: Analysis (5 minutes)
        logger.info("[Phase 1/5] Analysis - Team Leader analyzing project...")
        analysis = await self._analyze_project()
        external_collection = await self._collect_external_quality_metrics(cycle_id)
        analysis = self._merge_analysis_metrics(analysis, external_collection)
        collection_errors = external_collection.get("errors", [])
        if collection_errors:
            logger.warning(
                "[Metrics] Collection reported %s issue(s): %s",
                len(collection_errors),
                "; ".join(collection_errors),
            )
            if self._coerce_bool(
                self.schedule_config.get("metric_collection", {}).get("notify_on_collection_error", False)
            ):
                await self._notify_runtime_alert(
                    "metric_collection_error",
                    "External metric collection reported errors",
                    {
                        "cycle_id": cycle_id,
                        "errors": collection_errors,
                    },
                )
        self._log_analysis(analysis)

        # Phase 2: Planning (5 minutes)
        logger.info("[Phase 2/5] Planning - Creating optimization tasks...")
        tasks = await self._create_optimization_tasks(analysis)
        logger.info(f"  Created {len(tasks)} optimization tasks")

        # Phase 3: Execution (15 minutes)
        logger.info("[Phase 3/5] Execution - Running optimization tasks...")
        execution_results = await self._execute_tasks_batch(tasks)
        self._update_strategy_plan_progress(execution_results)
        logger.info(f"  Executed {len(execution_results)} tasks")

        # Phase 4: Validation (3 minutes)
        logger.info("[Phase 4/5] Validation - QA Specialist validating results...")
        validation = await self._validate_results(execution_results)
        self._log_validation(validation)
        focus_areas = self._get_current_focus_areas()
        quality_gate_result = self._evaluate_quality_gates(analysis, validation)
        self._log_quality_gate_result(quality_gate_result)

        # Phase 5: Report (2 minutes)
        logger.info("[Phase 5/5] Report - Generating optimization report...")
        await self._generate_cycle_report(
            cycle_id,
            analysis,
            execution_results,
            validation,
            focus_areas,
            quality_gate_result,
        )
        await self._notify_cycle_result(
            cycle_id,
            analysis,
            execution_results,
            validation,
            focus_areas,
            quality_gate_result,
        )

        logger.info("=" * 70)
        logger.info(f"[Cycle #{self.cycle_count}] Optimization cycle complete")
        logger.info("=" * 70)

    async def _analyze_project(self) -> Dict[str, Any]:
        """Analyze current project state"""
        # Get current focus areas based on time
        focus_areas = self._get_current_focus_areas()

        # Create analysis task for Team Leader
        analysis_task = self.coordinator.create_task(
            title=f"Analyze Project - Cycle #{self.cycle_count}",
            description=f"Analyze project and identify optimization opportunities",
            agent_type="leader",
            priority=TaskPriority.HIGH,
            input_data={
                "action": "analyze_and_plan",
                "focus_areas": focus_areas,
                "cycle_count": self.cycle_count,
            },
        )

        # Submit and wait for completion
        task_id = self.coordinator.submit_task(analysis_task)
        status = await self._wait_for_task_completion(task_id, timeout_seconds=120)
        if status and status["status"] == "completed":
            return status.get("output_data", {})
        return {"opportunities": []}

    def _get_current_focus_areas(self) -> List[str]:
        """Get focus areas based on current time and day"""
        now = datetime.now()
        hour = now.hour
        weekday = now.strftime("%A").lower()

        # Get time-based focus
        time_focus = ["optimization"]  # Default
        for time_range, areas in self.schedule_config.get("focus_hours", {}).items():
            start_hour, end_hour = map(int, time_range.split("-"))
            if start_hour <= hour < end_hour:
                # Handle both list format and dict format with "focus" key
                if isinstance(areas, list):
                    time_focus = areas
                elif isinstance(areas, dict) and "focus" in areas:
                    time_focus = areas["focus"]
                else:
                    time_focus = ["optimization"]
                break

        # Get weekly theme
        weekly_theme = self.schedule_config.get("weekly_theme", {})
        day_theme_data = weekly_theme.get(weekday, "optimization")

        # Handle both string format and dict format with "extra_focus" key
        extra_focus = []
        if isinstance(day_theme_data, str):
            extra_focus = [day_theme_data]
        elif isinstance(day_theme_data, dict):
            # Use extra_focus if available, otherwise use the name
            if "extra_focus" in day_theme_data:
                extra_focus = day_theme_data["extra_focus"]
            elif "name" in day_theme_data:
                # Convert name to snake_case focus area
                name = day_theme_data["name"]
                extra_focus = [name.lower().replace(" ", "_").replace("-", "_")]

        # Combine time focus and day theme
        focus_areas = list(set(time_focus + extra_focus))

        logger.info(f"[Scheduler] Current focus areas: {', '.join(focus_areas)}")
        return focus_areas

    def _resolve_strategy_plan_path(self, configured_path: str) -> Path:
        """Resolve strategy plan markdown path."""
        target = configured_path or "8_WEEK_ACTION_PLAN.md"
        path = Path(target)
        if not path.is_absolute():
            path = Path.cwd() / target
        return path

    def _resolve_strategy_state_path(self, configured_path: str) -> Path:
        """Resolve strategy plan state JSON path and ensure parent exists."""
        target = configured_path or "agent_team/state/strategy_plan_state.json"
        path = Path(target)
        if not path.is_absolute():
            path = Path.cwd() / target
        path.parent.mkdir(parents=True, exist_ok=True)
        return path

    def _load_strategy_plan_state(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Load strategy plan execution state from disk."""
        state_path = self._resolve_strategy_state_path(
            str(config.get("state_path", "agent_team/state/strategy_plan_state.json"))
        )
        if not state_path.exists():
            return {"completed_task_ids": []}
        try:
            with open(state_path, "r", encoding="utf-8") as handle:
                payload = json.load(handle)
            if isinstance(payload, dict):
                payload.setdefault("completed_task_ids", [])
                return payload
        except Exception as exc:
            logger.warning("[Strategy Plan] Failed to load state %s: %s", state_path, exc)
        return {"completed_task_ids": []}

    def _save_strategy_plan_state(self, config: Dict[str, Any], state: Dict[str, Any]) -> None:
        """Persist strategy plan execution state."""
        state_path = self._resolve_strategy_state_path(
            str(config.get("state_path", "agent_team/state/strategy_plan_state.json"))
        )
        payload = dict(state) if isinstance(state, dict) else {"completed_task_ids": []}
        payload.setdefault("completed_task_ids", [])
        with open(state_path, "w", encoding="utf-8") as handle:
            json.dump(payload, handle, ensure_ascii=False, indent=2)

    def _extract_strategy_plan_backlog(self, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract open checklist items from strategy markdown plan."""
        plan_path = self._resolve_strategy_plan_path(str(config.get("plan_path", "8_WEEK_ACTION_PLAN.md")))
        if not plan_path.exists():
            return []

        try:
            raw_text = plan_path.read_text(encoding="utf-8", errors="replace")
        except Exception as exc:
            logger.warning("[Strategy Plan] Failed to read plan %s: %s", plan_path, exc)
            return []

        backlog: List[Dict[str, Any]] = []
        current_section = "General"
        for raw_line in raw_text.splitlines():
            line = raw_line.strip()
            if not line:
                continue

            section_match = re.match(r"^###\s+(.+)$", line)
            if section_match:
                current_section = section_match.group(1).strip()
                continue

            task_match = re.match(r"^- \[( |x|X)\]\s+(.+)$", line)
            if not task_match:
                continue
            if task_match.group(1).lower() == "x":
                continue

            title = task_match.group(2).strip()
            if not title:
                continue

            task_hash = hashlib.sha1(f"{current_section}|{title}".encode("utf-8")).hexdigest()[:12]
            backlog.append(
                {
                    "task_id": task_hash,
                    "title": title,
                    "section": current_section,
                }
            )
        return backlog

    def _map_strategy_plan_item(self, title: str) -> Dict[str, str]:
        """Map strategy checklist item to agent/action pair."""
        lowered = title.lower()
        if any(keyword in lowered for keyword in ["sonar", "critical", "bug", "漏洞", "违", "修复"]):
            return {"agent_type": "bug_hunter", "action": "fix_critical_violations"}
        if any(keyword in lowered for keyword in ["e2e", "playwright", "test", "测试", "coverage", "覆盖"]):
            return {"agent_type": "qa", "action": "run_test_suite"}
        if any(keyword in lowered for keyword in ["frontend", "vue", "router", "route", "页面", "组件"]):
            return {"agent_type": "frontend", "action": "optimize_component"}
        if any(keyword in lowered for keyword in ["backend", "api", "service", "后端"]):
            return {"agent_type": "backend", "action": "optimize_api"}
        return {"agent_type": "testing", "action": "write_unit_test"}

    def _select_strategy_plan_tasks_for_cycle(self) -> List[Dict[str, Any]]:
        """Select unfinished strategy plan tasks for the current cycle."""
        config = self.schedule_config.get("strategy_plan", {})
        if not self._coerce_bool(config.get("enabled", False)):
            return []

        backlog = self._extract_strategy_plan_backlog(config)
        if not backlog:
            return []

        max_tasks = int(config.get("max_tasks_per_cycle", 2) or 2)
        max_tasks = max(max_tasks, 0)
        if max_tasks == 0:
            return []

        state = self._load_strategy_plan_state(config)
        completed = set(state.get("completed_task_ids", []))
        selected = [item for item in backlog if item.get("task_id") not in completed][:max_tasks]
        return selected

    def _update_strategy_plan_progress(self, execution_results: List[Dict[str, Any]]) -> None:
        """Mark completed strategy plan tasks in local progress state."""
        config = self.schedule_config.get("strategy_plan", {})
        if not self._coerce_bool(config.get("enabled", False)):
            return

        completed_ids: List[str] = []
        for result in execution_results:
            if not isinstance(result, dict):
                continue
            if str(result.get("status", "")).lower() != "completed":
                continue
            input_data = result.get("input_data", {})
            if not isinstance(input_data, dict):
                continue
            task_id = str(input_data.get("strategy_plan_task_id", "")).strip()
            if task_id:
                completed_ids.append(task_id)

        if not completed_ids:
            return

        state = self._load_strategy_plan_state(config)
        existing = set(state.get("completed_task_ids", []))
        existing.update(completed_ids)
        state["completed_task_ids"] = sorted(existing)
        state["last_updated"] = datetime.now().isoformat()
        self._save_strategy_plan_state(config, state)
        logger.info("[Strategy Plan] Marked %s task(s) as completed", len(set(completed_ids)))

    async def _create_optimization_tasks(self, analysis: Dict[str, Any]) -> List[Task]:
        """Create optimization tasks based on analysis"""
        opportunities = analysis.get("opportunities", [])
        tasks = []
        max_total_tasks = 5

        # Convert opportunities to tasks
        for opp in opportunities[:max_total_tasks]:
            agent_type = opp.get("agent", "backend")
            priority = TaskPriority.HIGH if opp.get("priority") == "critical" else TaskPriority.NORMAL

            task = self.coordinator.create_task(
                title=opp.get("description", "Optimization task"),
                description=opp.get("description", ""),
                agent_type=agent_type,
                priority=priority,
                input_data={
                    "action": self._map_opportunity_to_action(opp.get("type", "optimization")),
                    "opportunity": opp,
                },
            )

            tasks.append(task)

        # Fill remaining slots with strategy plan backlog items.
        remaining_slots = max(0, max_total_tasks - len(tasks))
        if remaining_slots > 0:
            plan_items = self._select_strategy_plan_tasks_for_cycle()[:remaining_slots]
            for item in plan_items:
                mapping = self._map_strategy_plan_item(item.get("title", ""))
                section = item.get("section", "Strategy Plan")
                title = str(item.get("title", "")).strip() or "Strategy plan task"
                display_title = f"[Plan] {title}"
                task = self.coordinator.create_task(
                    title=display_title,
                    description=f"{section}: {title}",
                    agent_type=mapping.get("agent_type", "testing"),
                    priority=TaskPriority.NORMAL,
                    input_data={
                        "action": mapping.get("action", "write_unit_test"),
                        "strategy_plan_task_id": item.get("task_id"),
                        "strategy_plan_section": section,
                        "strategy_plan_title": title,
                    },
                )
                tasks.append(task)

        return tasks

    def _map_opportunity_to_action(self, opportunity_type: str) -> str:
        """Map opportunity type to agent action"""
        action_map = {
            "bug_fix": "fix_bug",
            "optimization": "optimize_component",  # Frontend uses optimize_component
            "testing": "run_test_suite",  # Changed to match QA agent's action
            "performance": "optimize_component",
            "security": "security_scan_impl",  # Changed to match Bug Hunter's action
        }
        return action_map.get(opportunity_type, "optimize_component")

    async def _execute_tasks_batch(self, tasks: List[Task]) -> List[Dict[str, Any]]:
        """Execute a batch of tasks"""
        results = []

        for index, task in enumerate(tasks, 1):
            task_id = self.coordinator.submit_task(task)
            logger.info(f"  鈫?Executing: {task.title}")

            status = await self._wait_for_task_completion(task_id, task_context=task)
            normalized = self._normalize_execution_result(status, fallback_title=f"Task #{index}")
            results.append(normalized)

        return results

    async def _validate_results(self, execution_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Validate optimization results"""
        # Create validation task for QA Specialist
        validation_task = self.coordinator.create_task(
            title=f"Validate Results - Cycle #{self.cycle_count}",
            description="Validate all optimization changes using Playwright",
            agent_type="qa",
            priority=TaskPriority.HIGH,
            input_data={
                "action": "validate_changes",
                "changes": execution_results,
            },
        )

        task_id = self.coordinator.submit_task(validation_task)
        status = await self._wait_for_task_completion(task_id, task_context=validation_task)
        payload = status.get("output_data", {}) if status else {}
        if not isinstance(payload, dict):
            payload = {}

        if status and status.get("timed_out", False):
            payload.setdefault("approved", False)
            payload.setdefault("issues", ["validation task timed out"])
            payload.setdefault("issues_found", len(payload.get("issues", [])))
            payload.setdefault("method", "qa_validation_timeout")

        return self._normalize_validation_payload(payload)

    async def _wait_for_task_completion(
        self,
        task_id: str,
        timeout_seconds: Optional[float] = None,
        poll_interval: float = 0.5,
        task_context: Optional[Task] = None,
    ) -> Dict[str, Any]:
        """Poll task status until completion (or timeout)."""
        if timeout_seconds is None:
            timeout_minutes = self.schedule_config.get("limits", {}).get("task_timeout_minutes", 30)
            timeout_seconds = max(float(timeout_minutes) * 60.0, poll_interval)

        elapsed = 0.0
        latest_status: Optional[Dict[str, Any]] = None
        terminal_states = {"completed", "failed", "cancelled"}

        while elapsed < timeout_seconds:
            current_status = self.coordinator.get_task_status(task_id)
            if current_status:
                if task_context is not None:
                    current_status.setdefault("title", task_context.title)
                    current_status.setdefault("description", task_context.description)
                    current_status.setdefault("agent_type", task_context.agent_type)
                latest_status = current_status
                if current_status.get("status") in terminal_states:
                    return current_status

            await asyncio.sleep(poll_interval)
            elapsed += poll_interval

        if latest_status is None:
            if task_context is not None:
                return {
                    "id": task_id,
                    "title": task_context.title,
                    "description": task_context.description,
                    "agent_type": task_context.agent_type,
                    "assigned_to": task_context.assigned_to or task_context.agent_type,
                    "status": "timed_out",
                    "timed_out": True,
                    "error_message": "task status unavailable before timeout",
                }
            return {
                "id": task_id,
                "status": "timed_out",
                "timed_out": True,
                "error_message": "task status unavailable before timeout",
            }

        timed_out_status = dict(latest_status)
        timed_out_status["timed_out"] = True
        if timed_out_status.get("status") not in terminal_states:
            timed_out_status["status"] = "timed_out"
        timed_out_status.setdefault("error_message", "task timed out before reaching terminal state")
        return timed_out_status

    def _normalize_issue_count(self, issues_value: Any) -> int:
        """Normalize issues count from int/list-like values."""
        if isinstance(issues_value, (list, tuple, set)):
            return len(issues_value)
        if issues_value is None:
            return 0
        try:
            return int(issues_value)
        except (TypeError, ValueError):
            return 0

    def _normalize_execution_result(
        self, result: Dict[str, Any], fallback_title: str = "Optimization task"
    ) -> Dict[str, Any]:
        """Normalize task execution payload for stable reporting."""
        normalized = dict(result) if isinstance(result, dict) else {}
        status = str(normalized.get("status", "")).strip().lower()
        if not status:
            status = "failed"
        if status == "unknown":
            status = "failed"
        normalized["status"] = status
        normalized["title"] = str(normalized.get("title") or fallback_title)
        normalized["assigned_to"] = str(
            normalized.get("assigned_to") or normalized.get("agent_type") or "unassigned"
        )
        return normalized

    def _normalize_validation_payload(self, validation: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize validation payload to avoid ambiguous report fields."""
        normalized = dict(validation) if isinstance(validation, dict) else {}
        normalized["approved"] = bool(normalized.get("approved", False))

        issues_value = normalized.get("issues")
        if isinstance(issues_value, list):
            issues_list = issues_value
        elif issues_value is None:
            issues_list = []
        else:
            issues_list = [str(issues_value)]

        issue_count = self._normalize_issue_count(normalized.get("issues_found", issues_list))
        normalized["issues_found"] = issue_count
        normalized["issues"] = issues_list
        normalized["method"] = str(normalized.get("method", "")).strip() or "qa_validation"
        return normalized

    def _evaluate_quality_gates(self, analysis: Dict[str, Any], validation: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate configured quality gates for the current cycle."""
        gates = self.schedule_config.get("quality_gates", {})
        metrics = analysis.get("metrics", {}) if isinstance(analysis, dict) else {}
        checks: List[Dict[str, Any]] = []
        fail_on_missing = self._coerce_bool(gates.get("fail_on_missing_metrics", False))
        missing_metrics: List[str] = []

        metric_aliases = {
            "code_coverage": ["code_coverage", "coverage", "coverage_percent"],
            "critical_violations": ["critical_violations", "critical_issues"],
            "major_violations": ["major_violations", "major_issues"],
            "lighthouse_performance": ["lighthouse_performance", "performance_score", "lighthouse_performance_score"],
            "lighthouse_accessibility": ["lighthouse_accessibility", "accessibility_score", "lighthouse_accessibility_score"],
            "lighthouse_best_practices": ["lighthouse_best_practices", "best_practices_score", "lighthouse_best_practices_score"],
            "sonar_quality_gate": ["sonar_quality_gate", "sonar_quality_gate_passed"],
        }

        compatibility_check_names = {
            ("critical_violations", "critical_issues"): "critical_issues",
            ("lighthouse_performance", "performance_score"): "performance_score",
        }

        def resolve_metric(metric_name: str) -> tuple[str, Any]:
            candidates = metric_aliases.get(metric_name, [metric_name])
            for candidate in candidates:
                if candidate in metrics:
                    check_name = compatibility_check_names.get((metric_name, candidate), metric_name)
                    return check_name, metrics.get(candidate)
            return metric_name, None

        def add_check(
            name: str,
            actual: Any,
            expected: Any,
            passed: bool,
            operator: str,
            evaluated: bool = True,
            skipped_reason: str = "",
        ) -> None:
            checks.append(
                {
                    "name": name,
                    "actual": actual,
                    "expected": expected,
                    "operator": operator,
                    "passed": bool(passed),
                    "evaluated": bool(evaluated),
                    "skipped_reason": skipped_reason,
                }
            )

        for gate_name, expected_value in gates.items():
            if gate_name == "fail_on_missing_metrics":
                continue

            if gate_name.endswith("_minimum"):
                metric_name = gate_name[: -len("_minimum")]
                check_name, actual_value = resolve_metric(metric_name)
                if actual_value is None:
                    missing_metrics.append(metric_name)
                    add_check(
                        check_name,
                        None,
                        expected_value,
                        not fail_on_missing,
                        ">=",
                        evaluated=False,
                        skipped_reason="metric_missing",
                    )
                    continue

                actual_number = self._safe_float(actual_value)
                expected_number = self._safe_float(expected_value)
                passed = False
                if actual_number is not None and expected_number is not None:
                    passed = actual_number >= expected_number
                add_check(check_name, actual_value, expected_value, passed, ">=")
                continue

            if gate_name.endswith("_maximum"):
                metric_name = gate_name[: -len("_maximum")]
                check_name, actual_value = resolve_metric(metric_name)
                if actual_value is None:
                    missing_metrics.append(metric_name)
                    add_check(
                        check_name,
                        None,
                        expected_value,
                        not fail_on_missing,
                        "<=",
                        evaluated=False,
                        skipped_reason="metric_missing",
                    )
                    continue

                actual_number = self._safe_float(actual_value)
                expected_number = self._safe_float(expected_value)
                passed = False
                if actual_number is not None and expected_number is not None:
                    passed = actual_number <= expected_number
                add_check(check_name, actual_value, expected_value, passed, "<=")
                continue

            if gate_name.endswith("_required"):
                metric_name = gate_name[: -len("_required")]
                expected_bool = self._coerce_bool(expected_value)

                if metric_name == "all_tests_pass":
                    actual_bool = self._coerce_bool(validation.get("approved", False))
                    add_check("validation_approved", actual_bool, expected_bool, actual_bool == expected_bool, "==")
                    continue

                check_name, actual_value = resolve_metric(metric_name)
                if actual_value is None:
                    missing_metrics.append(metric_name)
                    add_check(
                        check_name,
                        None,
                        expected_bool,
                        not fail_on_missing,
                        "==",
                        evaluated=False,
                        skipped_reason="metric_missing",
                    )
                    continue

                actual_bool = self._coerce_bool(actual_value)
                add_check(check_name, actual_bool, expected_bool, actual_bool == expected_bool, "==")

        passed = all(item["passed"] for item in checks) if checks else True
        violations = [f"{item['name']} ({item['actual']} {item['operator']} {item['expected']})" for item in checks if not item["passed"]]

        return {
            "passed": passed,
            "checks": checks,
            "violations": violations,
            "missing_metrics": sorted(set(missing_metrics)),
        }

    def _log_quality_gate_result(self, result: Dict[str, Any]) -> None:
        """Log quality gate evaluation result."""
        passed = bool(result.get("passed", False))
        violations = result.get("violations", [])
        missing_metrics = result.get("missing_metrics", [])
        if passed:
            logger.info("[Quality Gates] Passed")
            if missing_metrics:
                logger.info(
                    "[Quality Gates] Missing metrics skipped: %s",
                    ", ".join(missing_metrics),
                )
            return

        logger.warning("[Quality Gates] Failed with %s violation(s)", len(violations))
        for item in violations:
            logger.warning("  - %s", item)
        if missing_metrics:
            logger.warning(
                "[Quality Gates] Missing metrics: %s",
                ", ".join(missing_metrics),
            )

    def _build_cycle_summary(
        self,
        cycle_id: str,
        analysis: Dict[str, Any],
        execution_results: List[Dict[str, Any]],
        validation: Dict[str, Any],
        quality_gate_result: Dict[str, Any],
        focus_areas: List[str],
    ) -> Dict[str, Any]:
        """Build compact summary payload for notifications."""
        normalized_results = [
            self._normalize_execution_result(item, fallback_title=f"Task #{idx}")
            for idx, item in enumerate(execution_results, 1)
        ]
        completed = len([item for item in normalized_results if item.get("status") == "completed"])
        timed_out = len([item for item in normalized_results if item.get("status") == "timed_out"])
        failed = len(
            [
                item
                for item in normalized_results
                if item.get("status") in {"failed", "timed_out"}
            ]
        )
        normalized_validation = self._normalize_validation_payload(validation)

        return {
            "cycle_id": cycle_id,
            "cycle_number": self.cycle_count,
            "timestamp": datetime.now().isoformat(),
            "focus_areas": focus_areas,
            "analysis_metrics": analysis.get("metrics", {}),
            "execution": {
                "total_tasks": len(normalized_results),
                "completed": completed,
                "failed": failed,
                "timed_out": timed_out,
            },
            "validation": {
                "approved": normalized_validation.get("approved", False),
                "issues_found": normalized_validation.get("issues_found", 0),
                "method": normalized_validation.get("method", "qa_validation"),
            },
            "quality_gates": {
                "passed": bool(quality_gate_result.get("passed", False)),
                "violations": quality_gate_result.get("violations", []),
            },
        }

    def _resolve_notification_path(self, configured_path: str, fallback_name: str) -> Path:
        """Resolve relative/absolute notification file paths."""
        target = configured_path or fallback_name
        path = Path(target)
        if not path.is_absolute():
            path = Path.cwd() / target
        path.parent.mkdir(parents=True, exist_ok=True)
        return path

    def _append_json_line(self, path: Path, payload: Dict[str, Any]) -> None:
        """Append one JSON line to a file."""
        with open(path, "a", encoding="utf-8") as handle:
            handle.write(json.dumps(payload, ensure_ascii=False) + "\n")

    def _post_webhook_notification(self, webhook_url: str, payload: Dict[str, Any], timeout_seconds: float = 5.0) -> None:
        """Send JSON payload to webhook URL."""
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        req = urllib_request.Request(
            webhook_url,
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib_request.urlopen(req, timeout=timeout_seconds) as response:
                logger.info("[Notifications] Webhook sent, status=%s", response.status)
        except urllib_error.URLError as exc:
            logger.warning("[Notifications] Webhook failed: %s", exc)
        except Exception as exc:
            logger.warning("[Notifications] Unexpected webhook error: %s", exc)

    async def _notify_cycle_result(
        self,
        cycle_id: str,
        analysis: Dict[str, Any],
        execution_results: List[Dict[str, Any]],
        validation: Dict[str, Any],
        focus_areas: List[str],
        quality_gate_result: Dict[str, Any],
    ) -> None:
        """Persist cycle summaries and emit optional alerts/webhooks."""
        notifications = self.schedule_config.get("notifications", {})
        summary = self._build_cycle_summary(
            cycle_id=cycle_id,
            analysis=analysis,
            execution_results=execution_results,
            validation=validation,
            quality_gate_result=quality_gate_result,
            focus_areas=focus_areas,
        )

        summary_path = self._resolve_notification_path(
            notifications.get("summary_file", "agent_team/notifications/cycle_summaries.jsonl"),
            "agent_team/notifications/cycle_summaries.jsonl",
        )
        self._append_json_line(summary_path, summary)
        logger.info("[Notifications] Cycle summary appended: %s", summary_path)

        if not quality_gate_result.get("passed", True):
            alert_entry = {
                "type": "quality_gate_alert",
                "cycle_id": cycle_id,
                "timestamp": datetime.now().isoformat(),
                "violations": quality_gate_result.get("violations", []),
            }
            alert_path = self._resolve_notification_path(
                notifications.get("alert_file", "agent_team/notifications/quality_alerts.jsonl"),
                "agent_team/notifications/quality_alerts.jsonl",
            )
            self._append_json_line(alert_path, alert_entry)
            logger.warning("[Notifications] Quality gate alert appended: %s", alert_path)

        webhook_url = notifications.get("webhook_url")
        webhook_timeout = float(notifications.get("webhook_timeout_seconds", 5))

        if webhook_url and notifications.get("on_cycle_complete", True):
            self._post_webhook_notification(
                webhook_url,
                {"type": "cycle_summary", "data": summary},
                timeout_seconds=webhook_timeout,
            )

        if webhook_url and (not quality_gate_result.get("passed", True)) and notifications.get("on_critical_issue", True):
            self._post_webhook_notification(
                webhook_url,
                {"type": "quality_gate_alert", "data": summary},
                timeout_seconds=webhook_timeout,
            )

    def _log_analysis(self, analysis: Dict[str, Any]):
        """Log analysis results."""
        metrics = analysis.get("metrics", {})
        external = analysis.get("external_metrics", {})
        logger.info("  Analysis Results:")
        if metrics:
            for key, value in metrics.items():
                logger.info(f"    - {key}: {value}")
        if isinstance(external, dict):
            sources = external.get("sources", [])
            errors = external.get("errors", [])
            if sources:
                collector_names = [str(item.get("collector", "unknown")) for item in sources if isinstance(item, dict)]
                logger.info("    - External metric sources: %s", ", ".join(collector_names))
            if errors:
                logger.warning("    - External metric errors: %s", "; ".join([str(err) for err in errors]))

    def _log_validation(self, validation: Dict[str, Any]):
        """Log validation results."""
        approved = validation.get("approved", False)
        issues = self._normalize_issue_count(validation.get("issues_found", 0))

        logger.info(f"  Validation Results:")
        logger.info(f"    - Approved: {approved}")
        logger.info(f"    - Issues found: {issues}")

    async def _generate_cycle_report(
        self,
        cycle_id: str,
        analysis: Dict,
        execution_results: List[Dict],
        validation: Dict,
        focus_areas: Optional[List[str]] = None,
        quality_gate_result: Optional[Dict[str, Any]] = None,
    ):
        """Generate optimization cycle report"""
        if focus_areas is None:
            focus_areas = self._get_current_focus_areas()
        if quality_gate_result is None:
            quality_gate_result = self._evaluate_quality_gates(analysis, validation)
        normalized_results = [
            self._normalize_execution_result(item, fallback_title=f"Task #{idx}")
            for idx, item in enumerate(execution_results, 1)
        ]
        normalized_validation = self._normalize_validation_payload(validation)
        timed_out = len([r for r in normalized_results if r.get("status") == "timed_out"])

        report = {
            "cycle_id": cycle_id,
            "cycle_number": self.cycle_count,
            "timestamp": datetime.now().isoformat(),
            "analysis": analysis,
            "execution": {
                "total_tasks": len(normalized_results),
                "completed": len([r for r in normalized_results if r.get("status") == "completed"]),
                "failed": len([r for r in normalized_results if r.get("status") in {"failed", "timed_out"}]),
                "timed_out": timed_out,
                "results": normalized_results,
            },
            "validation": normalized_validation,
            "focus_areas": focus_areas,
            "quality_gates": quality_gate_result,
        }

        # Save report
        report_file = self.reports_dir / f"cycle_{cycle_id}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)

        logger.info(f"  Report saved: {report_file}")

        # Also save human-readable markdown
        md_report_file = self.reports_dir / f"cycle_{cycle_id}.md"
        await self._generate_markdown_report(md_report_file, report)

        logger.info(f"  Markdown report saved: {md_report_file}")

    async def _generate_markdown_report(self, report_file: Path, report_data: Dict):
        """Generate human-readable markdown report"""
        md_content = f"""# Optimization Cycle Report

**Cycle ID**: {report_data['cycle_id']}
**Cycle Number**: {report_data['cycle_number']}
**Timestamp**: {report_data['timestamp']}
**Focus Areas**: {', '.join(report_data['focus_areas'])}

## Analysis Results

```json
{json.dumps(report_data['analysis'].get('metrics', {}), indent=2)}
```

## Execution Summary

- **Total Tasks**: {report_data['execution']['total_tasks']}
- **Completed**: {report_data['execution']['completed']}
- **Failed**: {report_data['execution']['failed']}

### Task Results

"""

        for i, result in enumerate(report_data['execution']['results'], 1):
            md_content += f"{i}. **{result.get('title', 'Unknown')}**\n"
            md_content += f"   - Status: {result.get('status', 'unknown')}\n"
            md_content += f"   - Agent: {result.get('assigned_to', 'unknown')}\n\n"

        md_content += f"""
## Validation Results

- **Approved**: {report_data['validation'].get('approved', False)}
- **Issues Found**: {len(report_data['validation'].get('issues_found', [])) if isinstance(report_data['validation'].get('issues_found', 0), list) else report_data['validation'].get('issues_found', 0)}
- **Method**: {report_data['validation'].get('method', 'unknown')}

## Quality Gates

- **Passed**: {report_data.get('quality_gates', {}).get('passed', False)}
- **Violations**: {len(report_data.get('quality_gates', {}).get('violations', []))}

---

*Generated by 24/7 Continuous Optimization System*
"""

        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(md_content)


async def main():
    """Main entry point"""
    # Check for command line arguments
    auto_confirm = "--auto-confirm" in sys.argv or "-y" in sys.argv

    scheduler = ContinuousOptimizationScheduler(auto_confirm=auto_confirm)

    try:
        await scheduler.start()
    except KeyboardInterrupt:
        logger.info("\n\n[STOPPED] Scheduler stopped by user")
    except Exception as e:
        logger.error(f"\n\n[ERROR] Scheduler error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
