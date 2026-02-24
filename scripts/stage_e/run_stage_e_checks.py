#!/usr/bin/env python
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Dict, List


DEFAULT_TEST_TARGETS = [
    "backend/tests/test_geomodel_api.py",
    "backend/tests/test_mpi_geo_api.py",
    "backend/tests/test_research_api.py",
    "backend/tests/test_perf_stats.py",
    "backend/tests/test_perf_baseline.py",
]
DEFAULT_PERF_THRESHOLDS = "scripts/perf/thresholds.default.json"
HTTP_PERF_THRESHOLDS = "scripts/perf/thresholds.http.json"
DEFAULT_PERF_REQUESTS = 40
DEFAULT_PERF_CONCURRENCY = 8
HTTP_PERF_REQUESTS = 30
HTTP_PERF_CONCURRENCY = 6


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Run Stage E checks (tests + perf baseline + research template e2e) and output summary report."
    )
    p.add_argument("--output-dir", default="data/research/stage_e/latest", help="Output directory for stage E report.")
    p.add_argument("--inprocess", action="store_true", help="Use in-process mode for perf/research scripts.")
    p.add_argument("--base-url", default="http://127.0.0.1:8001", help="Backend URL when not using --inprocess.")

    p.add_argument("--skip-tests", action="store_true", help="Skip backend regression test step.")
    p.add_argument(
        "--test-targets",
        nargs="+",
        default=list(DEFAULT_TEST_TARGETS),
        help="pytest targets for regression step.",
    )

    p.add_argument("--skip-perf", action="store_true", help="Skip perf baseline step.")
    p.add_argument("--perf-runs", type=int, default=3)
    p.add_argument("--perf-requests", type=int, default=DEFAULT_PERF_REQUESTS)
    p.add_argument("--perf-concurrency", type=int, default=DEFAULT_PERF_CONCURRENCY)
    p.add_argument("--perf-resolution", type=int, default=100)
    p.add_argument("--perf-points", type=int, default=81)
    p.add_argument("--perf-method", default="idw", choices=["idw", "linear", "nearest"])
    p.add_argument("--perf-thresholds", default=DEFAULT_PERF_THRESHOLDS)
    p.add_argument("--perf-allow-missing-scenarios", action="store_true")
    p.add_argument(
        "--perf-geomodel-job-id",
        default="",
        help="Optional geomodel job id for perf geomodel scenarios.",
    )
    p.add_argument(
        "--perf-artifact-name",
        default="quality_report.json",
        help="Artifact file name for geomodel download perf scenario.",
    )

    p.add_argument("--skip-research", action="store_true", help="Skip research template e2e step.")
    p.add_argument("--dataset-ids", nargs="+", default=[], help="At least two dataset ids for research e2e.")
    p.add_argument(
        "--templates",
        nargs="+",
        default=["geomodel_ablation", "hybrid_augmented_upgrade", "rk_vs_kriging"],
    )
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--auto-register", action="store_true")
    p.add_argument("--label-column", default="label")
    return p


def resolve_repo_path(repo_root: Path, raw: str) -> Path:
    path = Path(raw)
    if path.is_absolute():
        return path
    return (repo_root / path).resolve()


def run_cmd(cmd: List[str], cwd: Path, env: Dict[str, str] | None = None) -> int:
    print(f"[run] {' '.join(cmd)}")
    proc = subprocess.run(cmd, cwd=str(cwd), check=False, env=env)
    return int(proc.returncode)


def write_markdown_report(report: Dict[str, Any], md_path: Path) -> None:
    lines = [
        "# Stage E Auto Check Report",
        "",
        f"- generated_at: {report.get('generated_at')}",
        f"- mode: {report.get('mode')}",
        f"- all_passed: {report.get('all_passed')}",
        "",
        "## Step Results",
        "",
        "| Step | Passed | Exit Code | Output | Note |",
        "|---|---|---:|---|---|",
    ]
    for step in report.get("steps", []):
        lines.append(
            "| {name} | {passed} | {code} | `{output}` | {note} |".format(
                name=step.get("name"),
                passed=step.get("passed"),
                code=step.get("exit_code"),
                output=step.get("output", "-"),
                note=step.get("note", "-"),
            )
        )
    lines.extend(
        [
            "",
            "## Manual Acceptance Still Required",
            "",
        ]
    )
    for item in report.get("manual_acceptance_pending", []):
        lines.append(f"- [ ] {item}")
    md_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    args = build_parser().parse_args()
    repo_root = Path(__file__).resolve().parents[2]
    output_dir = resolve_repo_path(repo_root, args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    report: Dict[str, Any] = {
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "mode": "inprocess" if args.inprocess else f"http({args.base_url})",
        "all_passed": True,
        "steps": [],
        "manual_acceptance_pending": [
            "Collect three baseline perf runs in target deployment and finalize thresholds.",
            "Execute the Stage E frontend regression checklist document under docs/plans.",
            "Run research templates on two real datasets and archive reports.",
            "Execute the Stage E rollout and rollback checklist document under docs/plans.",
        ],
    }

    if not args.skip_tests:
        test_env = os.environ.copy()
        backend_root = str((repo_root / "backend").resolve())
        prev = test_env.get("PYTHONPATH", "").strip()
        test_env["PYTHONPATH"] = backend_root if not prev else f"{backend_root}{os.pathsep}{prev}"
        test_cmd = [sys.executable, "-m", "pytest", *args.test_targets, "-q"]
        rc = run_cmd(test_cmd, repo_root, env=test_env)
        step = {
            "name": "backend_regression_tests",
            "passed": rc == 0,
            "exit_code": rc,
            "output": "-",
            "note": "pytest targeted suite",
        }
        report["steps"].append(step)
        if rc != 0:
            report["all_passed"] = False

    if not args.skip_perf:
        perf_dir = output_dir / "perf"
        perf_script = repo_root / "scripts" / "perf" / "run_baseline_suite.py"
        perf_thresholds = str(args.perf_thresholds)
        if (
            not args.inprocess
            and str(args.perf_thresholds) == DEFAULT_PERF_THRESHOLDS
            and (repo_root / HTTP_PERF_THRESHOLDS).exists()
        ):
            perf_thresholds = HTTP_PERF_THRESHOLDS
        perf_requests = int(args.perf_requests)
        perf_concurrency = int(args.perf_concurrency)
        if not args.inprocess:
            if int(args.perf_requests) == DEFAULT_PERF_REQUESTS:
                perf_requests = HTTP_PERF_REQUESTS
            if int(args.perf_concurrency) == DEFAULT_PERF_CONCURRENCY:
                perf_concurrency = HTTP_PERF_CONCURRENCY
        perf_cmd = [
            sys.executable,
            str(perf_script),
            "--runs",
            str(max(args.perf_runs, 1)),
            "--requests",
            str(perf_requests),
            "--concurrency",
            str(perf_concurrency),
            "--resolution",
            str(args.perf_resolution),
            "--points",
            str(args.perf_points),
            "--method",
            str(args.perf_method),
            "--thresholds",
            str(resolve_repo_path(repo_root, perf_thresholds)),
            "--output-dir",
            str(perf_dir),
        ]
        if args.inprocess:
            perf_cmd.append("--inprocess")
        else:
            perf_cmd.extend(["--base-url", str(args.base_url)])
        job_id = str(args.perf_geomodel_job_id).strip()
        if job_id:
            perf_cmd.extend(["--geomodel-job-id", job_id])
        perf_artifact_name = str(args.perf_artifact_name).strip()
        if perf_artifact_name:
            perf_cmd.extend(["--artifact-name", perf_artifact_name])

        allow_missing_scenarios = bool(args.perf_allow_missing_scenarios or not job_id)
        if allow_missing_scenarios:
            perf_cmd.append("--allow-missing-scenarios")
        rc = run_cmd(perf_cmd, repo_root)
        step = {
            "name": "backend_perf_baseline",
            "passed": rc == 0,
            "exit_code": rc,
            "output": str((perf_dir / "evaluation.json").as_posix()),
            "note": (
                f"run_baseline_suite.py (thresholds={perf_thresholds}, requests={perf_requests}, concurrency={perf_concurrency})"
                if not allow_missing_scenarios
                else (
                    "run_baseline_suite.py "
                    f"(thresholds={perf_thresholds}, requests={perf_requests}, concurrency={perf_concurrency}, allow-missing-scenarios)"
                )
            ),
        }
        report["steps"].append(step)
        if rc != 0:
            report["all_passed"] = False

    if not args.skip_research:
        if len(args.dataset_ids) < 2:
            raise ValueError("research step requires --dataset-ids with at least two values or use --skip-research")
        research_dir = output_dir / "research"
        research_dir.mkdir(parents=True, exist_ok=True)
        research_report = research_dir / "template_e2e.json"
        research_script = repo_root / "scripts" / "research" / "validate_template_e2e.py"
        research_cmd: List[str] = [
            sys.executable,
            str(research_script),
            "--dataset-ids",
            *args.dataset_ids,
            "--templates",
            *args.templates,
            "--seed",
            str(args.seed),
            "--output-json",
            str(research_report),
            "--label-column",
            str(args.label_column),
        ]
        if args.inprocess:
            research_cmd.append("--inprocess")
        else:
            research_cmd.extend(["--base-url", str(args.base_url)])
        if args.auto_register:
            research_cmd.append("--auto-register")
        rc = run_cmd(research_cmd, repo_root)
        step = {
            "name": "research_template_e2e",
            "passed": rc == 0,
            "exit_code": rc,
            "output": str(research_report.as_posix()),
            "note": "validate_template_e2e.py",
        }
        report["steps"].append(step)
        if rc != 0:
            report["all_passed"] = False

    report_json = output_dir / "stage_e_auto_report.json"
    report_md = output_dir / "stage_e_auto_report.md"
    report_json.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    write_markdown_report(report, report_md)

    print("\n== Stage E Auto Check Summary ==")
    print(f"all_passed: {report['all_passed']}")
    print(f"json_report: {report_json}")
    print(f"md_report: {report_md}")
    return 0 if report["all_passed"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
