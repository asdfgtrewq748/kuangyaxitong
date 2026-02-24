#!/usr/bin/env python
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Tuple
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Run Stage E manual-acceptance checks (perf/frontend/research/rollout-smoke) and output one report."
    )
    p.add_argument("--output-dir", default="data/research/stage_e/manual_latest")
    p.add_argument("--base-url", default="http://127.0.0.1:8001")
    p.add_argument("--timeout", type=float, default=20.0, help="HTTP timeout (seconds).")
    p.add_argument("--poll-timeout", type=int, default=180, help="Geomodel poll timeout (seconds).")

    p.add_argument("--skip-perf", action="store_true")
    p.add_argument("--perf-runs", type=int, default=3)
    p.add_argument("--perf-requests", type=int, default=30)
    p.add_argument("--perf-concurrency", type=int, default=6)
    p.add_argument("--perf-resolution", type=int, default=100)
    p.add_argument("--perf-points", type=int, default=81)
    p.add_argument("--perf-method", default="idw", choices=["idw", "linear", "nearest"])
    p.add_argument("--perf-thresholds", default="scripts/perf/thresholds.http.json")

    p.add_argument("--skip-frontend", action="store_true")
    p.add_argument("--frontend-command", default="npm run e2e")

    p.add_argument("--skip-research", action="store_true")
    p.add_argument("--dataset-ids", nargs="+", default=["research_boreholes_28", "research_boreholes_36"])
    p.add_argument(
        "--templates",
        nargs="+",
        default=["geomodel_ablation", "hybrid_augmented_upgrade", "rk_vs_kriging"],
    )
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--auto-register", action="store_true")
    p.add_argument("--label-column", default="label")

    p.add_argument("--skip-rollout-smoke", action="store_true")
    p.add_argument("--rollout-requests", type=int, default=5)
    p.add_argument("--rollout-concurrency", type=int, default=2)
    p.add_argument("--rollout-resolution", type=int, default=40)
    p.add_argument("--rollout-artifact-name", default="quality_report.json")

    p.add_argument("--dry-run", action="store_true", help="Print commands only.")
    return p


def resolve_repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def resolve_repo_path(repo_root: Path, raw: str) -> Path:
    p = Path(raw)
    if p.is_absolute():
        return p
    return (repo_root / p).resolve()


def now_str() -> str:
    return time.strftime("%Y-%m-%d %H:%M:%S")


def http_json(
    base_url: str,
    method: str,
    path: str,
    payload: Dict[str, Any] | None = None,
    timeout: float = 20.0,
) -> Tuple[bool, int, Dict[str, Any], str]:
    url = f"{base_url.rstrip('/')}{path}"
    data = None
    headers: Dict[str, str] = {}
    if payload is not None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = Request(url, data=data, headers=headers, method=method.upper())
    try:
        with urlopen(req, timeout=timeout) as resp:
            status = int(getattr(resp, "status", 200))
            body = resp.read().decode("utf-8", errors="ignore")
            parsed = json.loads(body) if body else {}
            return 200 <= status < 300, status, parsed, ""
    except HTTPError as exc:
        detail = ""
        try:
            detail = exc.read().decode("utf-8", errors="ignore")
        except Exception:
            detail = str(exc)
        return False, int(exc.code), {}, detail[:320]
    except URLError as exc:
        return False, 0, {}, f"URLError: {exc.reason}"
    except Exception as exc:  # pragma: no cover
        return False, 0, {}, f"{type(exc).__name__}: {exc}"


def run_cmd(cmd: List[str], cwd: Path, dry_run: bool = False) -> int:
    print(f"[run] {' '.join(cmd)}")
    if dry_run:
        return 0
    proc = subprocess.run(cmd, cwd=str(cwd), check=False)
    return int(proc.returncode)


def run_shell(cmd: str, cwd: Path, dry_run: bool = False) -> int:
    print(f"[run-shell] {cmd}")
    if dry_run:
        return 0
    proc = subprocess.run(cmd, cwd=str(cwd), check=False, shell=True)
    return int(proc.returncode)


def create_and_wait_geomodel_job(
    base_url: str,
    timeout: float,
    poll_timeout_sec: int,
    artifact_name: str,
    dry_run: bool,
) -> Tuple[bool, str, str]:
    if dry_run:
        return True, "dryrun_job", ""
    ok, status, data, err = http_json(base_url, "POST", "/api/geomodel/jobs", payload={}, timeout=timeout)
    if not ok:
        return False, "", f"create geomodel job failed status={status} err={err}"
    job_id = str(data.get("job_id", "")).strip()
    if not job_id:
        return False, "", "geomodel job_id missing"

    deadline = time.time() + max(poll_timeout_sec, 10)
    while time.time() < deadline:
        ok_s, status_s, job, err_s = http_json(base_url, "GET", f"/api/geomodel/jobs/{job_id}", timeout=timeout)
        if not ok_s:
            return False, job_id, f"poll job failed status={status_s} err={err_s}"
        state = str(job.get("status", "")).lower()
        if state == "completed":
            ok_a, status_a, arts, err_a = http_json(
                base_url,
                "GET",
                f"/api/geomodel/jobs/{job_id}/artifacts",
                timeout=timeout,
            )
            if not ok_a:
                return False, job_id, f"list artifacts failed status={status_a} err={err_a}"
            names = [str(x.get("name", "")) for x in arts.get("artifacts", [])]
            if artifact_name and artifact_name not in names:
                return False, job_id, f"artifact missing: {artifact_name}"
            return True, job_id, ""
        if state == "failed":
            return False, job_id, f"geomodel job failed: {job.get('error') or job.get('message')}"
        time.sleep(1.0)
    return False, job_id, "geomodel poll timeout"


def write_markdown(report: Dict[str, Any], path: Path) -> None:
    lines = [
        "# Stage E Manual Acceptance Report",
        "",
        f"- generated_at: {report.get('generated_at')}",
        f"- base_url: {report.get('base_url')}",
        f"- all_passed: {report.get('all_passed')}",
        "",
        "## Step Results",
        "",
        "| Step | Status | Exit Code | Output | Note |",
        "|---|---|---:|---|---|",
    ]
    for step in report.get("steps", []):
        lines.append(
            "| {name} | {status} | {code} | `{output}` | {note} |".format(
                name=step.get("name"),
                status=step.get("status"),
                code=step.get("exit_code", "-"),
                output=step.get("output", "-"),
                note=step.get("note", "-"),
            )
        )
    lines.extend(["", "## Online-Only Pending", ""])
    for item in report.get("online_pending", []):
        lines.append(f"- [ ] {item}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def append_step(
    report: Dict[str, Any],
    name: str,
    status: str,
    exit_code: int = 0,
    output: str = "-",
    note: str = "-",
) -> None:
    report["steps"].append(
        {
            "name": name,
            "status": status,
            "exit_code": int(exit_code),
            "output": output,
            "note": note,
        }
    )
    if status == "failed":
        report["all_passed"] = False


def main() -> int:
    args = build_parser().parse_args()
    repo_root = resolve_repo_root()
    output_dir = resolve_repo_path(repo_root, args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    report: Dict[str, Any] = {
        "generated_at": now_str(),
        "base_url": args.base_url,
        "all_passed": True,
        "steps": [],
        "online_pending": [
            "Execute 10%/30%/100% progressive rollout in production and observe error/latency windows.",
            "Run alert-routing/on-call drill with real notification channels.",
            "Execute rollback trigger drill under production guardrails.",
            "Archive 24h post-release observation report.",
        ],
    }

    if args.dry_run:
        append_step(report, "dry_run", "skipped", note="No command executed.")
    else:
        ok_h, status_h, _, err_h = http_json(args.base_url, "GET", "/health", timeout=args.timeout)
        if ok_h:
            append_step(report, "backend_health", "passed", 0, "-", "GET /health")
        else:
            append_step(
                report,
                "backend_health",
                "failed",
                1,
                "-",
                f"GET /health failed status={status_h} err={err_h}",
            )

    geomodel_ok = False
    geomodel_job_id = ""
    if args.skip_rollout_smoke:
        append_step(report, "geomodel_job_prepare", "skipped", note="skip-rollout-smoke=true")
    else:
        geomodel_ok, geomodel_job_id, geomodel_err = create_and_wait_geomodel_job(
            base_url=args.base_url,
            timeout=float(args.timeout),
            poll_timeout_sec=int(args.poll_timeout),
            artifact_name=str(args.rollout_artifact_name),
            dry_run=bool(args.dry_run),
        )
        if geomodel_ok:
            append_step(
                report,
                "geomodel_job_prepare",
                "passed",
                0,
                geomodel_job_id,
                f"artifact={args.rollout_artifact_name}",
            )
        else:
            append_step(report, "geomodel_job_prepare", "failed", 1, geomodel_job_id, geomodel_err)

    if args.skip_perf:
        append_step(report, "perf_baseline_3runs", "skipped")
    else:
        perf_dir = output_dir / "perf_http"
        perf_cmd = [
            sys.executable,
            str(repo_root / "scripts" / "perf" / "run_baseline_suite.py"),
            "--base-url",
            str(args.base_url),
            "--runs",
            str(max(int(args.perf_runs), 1)),
            "--requests",
            str(int(args.perf_requests)),
            "--concurrency",
            str(int(args.perf_concurrency)),
            "--resolution",
            str(int(args.perf_resolution)),
            "--points",
            str(int(args.perf_points)),
            "--method",
            str(args.perf_method),
            "--thresholds",
            str(resolve_repo_path(repo_root, args.perf_thresholds)),
            "--output-dir",
            str(perf_dir),
        ]
        if geomodel_job_id:
            perf_cmd.extend(["--geomodel-job-id", geomodel_job_id, "--artifact-name", str(args.rollout_artifact_name)])
        rc = run_cmd(perf_cmd, repo_root, dry_run=bool(args.dry_run))
        status = "passed" if rc == 0 else "failed"
        append_step(
            report,
            "perf_baseline_3runs",
            status,
            rc,
            str((perf_dir / "evaluation.json").as_posix()),
            "run_baseline_suite.py",
        )

    if args.skip_frontend:
        append_step(report, "frontend_e2e", "skipped")
    else:
        rc = run_shell(str(args.frontend_command), repo_root, dry_run=bool(args.dry_run))
        status = "passed" if rc == 0 else "failed"
        append_step(
            report,
            "frontend_e2e",
            status,
            rc,
            "-",
            str(args.frontend_command),
        )

    if args.skip_research:
        append_step(report, "research_templates_real_datasets", "skipped")
    else:
        if len(args.dataset_ids) < 2:
            append_step(
                report,
                "research_templates_real_datasets",
                "failed",
                2,
                "-",
                "--dataset-ids requires at least 2 values",
            )
        else:
            research_dir = output_dir / "research"
            research_dir.mkdir(parents=True, exist_ok=True)
            out_json = research_dir / "template_e2e_manual.json"
            cmd = [
                sys.executable,
                str(repo_root / "scripts" / "research" / "validate_template_e2e.py"),
                "--base-url",
                str(args.base_url),
                "--dataset-ids",
                *[str(x) for x in args.dataset_ids],
                "--templates",
                *[str(x) for x in args.templates],
                "--seed",
                str(int(args.seed)),
                "--label-column",
                str(args.label_column),
                "--output-json",
                str(out_json),
            ]
            if args.auto_register:
                cmd.append("--auto-register")
            rc = run_cmd(cmd, repo_root, dry_run=bool(args.dry_run))
            status = "passed" if rc == 0 else "failed"
            append_step(
                report,
                "research_templates_real_datasets",
                status,
                rc,
                str(out_json.as_posix()),
                "validate_template_e2e.py",
            )

    if args.skip_rollout_smoke:
        append_step(report, "rollout_rollback_smoke", "skipped")
    else:
        rollout_dir = output_dir / "rollout"
        rollout_dir.mkdir(parents=True, exist_ok=True)
        out_json = rollout_dir / "rollout_smoke.json"
        cmd = [
            sys.executable,
            str(repo_root / "scripts" / "perf" / "run_backend_perf.py"),
            "--base-url",
            str(args.base_url),
            "--requests",
            str(int(args.rollout_requests)),
            "--concurrency",
            str(int(args.rollout_concurrency)),
            "--resolution",
            str(int(args.rollout_resolution)),
            "--artifact-name",
            str(args.rollout_artifact_name),
            "--output-json",
            str(out_json),
        ]
        if geomodel_job_id:
            cmd.extend(["--geomodel-job-id", geomodel_job_id])
        rc = run_cmd(cmd, repo_root, dry_run=bool(args.dry_run))
        status = "passed" if rc == 0 else "failed"
        append_step(
            report,
            "rollout_rollback_smoke",
            status,
            rc,
            str(out_json.as_posix()),
            f"geomodel_job_id={geomodel_job_id or 'n/a'}",
        )

    report_json = output_dir / "manual_acceptance_report.json"
    report_md = output_dir / "manual_acceptance_report.md"
    report_json.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    write_markdown(report, report_md)

    print("\n== Stage E Manual Acceptance Summary ==")
    print(f"all_passed: {report.get('all_passed')}")
    print(f"json_report: {report_json}")
    print(f"md_report: {report_md}")
    return 0 if bool(report.get("all_passed")) else 2


if __name__ == "__main__":
    raise SystemExit(main())
