#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Configure local Sonar environment variables for agent-team scheduler."""

import argparse
import asyncio
from pathlib import Path

from continuous_optimization import ContinuousOptimizationScheduler


def _write_env_file(path: Path, host: str, project: str, token: str, branch: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Local Sonar config loaded by agent_team/continuous_optimization.py",
        f"SONAR_HOST_URL={host.strip()}",
        f"SONAR_PROJECT_KEY={project.strip()}",
    ]
    if token.strip():
        lines.append(f"SONAR_TOKEN={token.strip()}")
    if branch.strip():
        lines.append(f"SONAR_BRANCH={branch.strip()}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


async def _check_connectivity(host: str, project: str, branch: str) -> None:
    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
    sonar_cfg = scheduler.schedule_config.get("metric_collection", {}).get("sonar", {})
    sonar_cfg = dict(sonar_cfg) if isinstance(sonar_cfg, dict) else {}
    sonar_cfg.update(
        {
            "enabled": True,
            "source": "api",
            "base_url": host,
            "project_key": project,
            "branch": branch,
        }
    )
    result = await scheduler._check_sonar_connectivity(sonar_cfg)
    print(f"connected={result.get('connected', False)}")
    if result.get("sources"):
        print("sources=", ",".join(result.get("sources", [])))
    if result.get("errors"):
        for item in result.get("errors", []):
            print("error:", item)


def main() -> None:
    parser = argparse.ArgumentParser(description="Configure Sonar env for agent-team.")
    parser.add_argument("--host", required=True, help="Sonar host URL, e.g. http://localhost:9000")
    parser.add_argument("--project", required=True, help="Sonar project key")
    parser.add_argument("--token", default="", help="Sonar token (optional but recommended)")
    parser.add_argument("--branch", default="", help="Default branch (optional)")
    parser.add_argument(
        "--env-file",
        default="agent_team/.sonar.env",
        help="Path to output env file (default: agent_team/.sonar.env)",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Run connectivity check after writing env file",
    )
    args = parser.parse_args()

    env_path = Path(args.env_file)
    _write_env_file(env_path, args.host, args.project, args.token, args.branch)
    print(f"written: {env_path}")

    if args.check:
        asyncio.run(_check_connectivity(args.host, args.project, args.branch))


if __name__ == "__main__":
    main()

