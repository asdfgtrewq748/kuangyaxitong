#!/usr/bin/env python
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from pathlib import Path
from typing import List


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Run N perf rounds and evaluate thresholds in one command."
    )
    p.add_argument("--runs", type=int, default=3, help="Number of perf rounds.")
    p.add_argument(
        "--output-dir",
        default="data/research/perf/latest",
        help="Output directory for run reports and evaluation.",
    )
    p.add_argument("--base-url", default="http://127.0.0.1:8001", help="Backend base URL.")
    p.add_argument("--inprocess", action="store_true", help="Use FastAPI TestClient mode.")
    p.add_argument("--requests", type=int, default=60, help="Requests per scenario.")
    p.add_argument("--concurrency", type=int, default=12, help="Concurrent workers.")
    p.add_argument("--resolution", type=int, default=120, help="Grid resolution.")
    p.add_argument("--points", type=int, default=81, help="Synthetic points count.")
    p.add_argument("--method", default="idw", choices=["idw", "linear", "nearest"])
    p.add_argument("--geomodel-job-id", default="", help="Geomodel job id for geomodel scenarios.")
    p.add_argument("--artifact-name", default="quality_report.json", help="Artifact for download scenario.")
    p.add_argument(
        "--thresholds",
        default="scripts/perf/thresholds.default.json",
        help="Threshold JSON path.",
    )
    p.add_argument(
        "--allow-missing-scenarios",
        action="store_true",
        help="Allow scenarios without data in threshold evaluation.",
    )
    return p


def run_cmd(cmd: List[str], cwd: Path) -> None:
    proc = subprocess.run(cmd, cwd=str(cwd), check=False)
    if proc.returncode != 0:
        raise RuntimeError(f"command failed ({proc.returncode}): {' '.join(cmd)}")


def generate_markdown(eval_json_path: Path, md_path: Path) -> None:
    data = json.loads(eval_json_path.read_text(encoding="utf-8"))
    lines = [
        "# Backend Perf Baseline Report",
        "",
        f"- generated_at: {time.strftime('%Y-%m-%d %H:%M:%S')}",
        f"- all_passed: {data.get('all_passed')}",
        "",
        "## Scenario Results",
        "",
        "| Scenario | Passed | Metric | Min | Max | Avg | Count | Threshold |",
        "|---|---|---|---:|---:|---:|---:|---|",
    ]
    for scenario in data.get("results", []):
        scenario_name = scenario.get("scenario")
        scenario_passed = scenario.get("passed")
        checks = scenario.get("checks", [])
        if not checks:
            lines.append(f"| {scenario_name} | {scenario_passed} | - | - | - | - | - | - |")
            continue
        for check in checks:
            metric = check.get("metric")
            actual = check.get("actual", {})
            threshold = check.get("threshold", {})
            lines.append(
                "| {scenario} | {sp} | {metric} | {minv} | {maxv} | {avgv} | {cnt} | `{thr}` |".format(
                    scenario=scenario_name,
                    sp=check.get("passed"),
                    metric=metric,
                    minv=_fmt(actual.get("min")),
                    maxv=_fmt(actual.get("max")),
                    avgv=_fmt(actual.get("avg")),
                    cnt=actual.get("count", 0),
                    thr=json.dumps(threshold, ensure_ascii=False),
                )
            )
    md_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def _fmt(v) -> str:
    try:
        if v is None:
            return "-"
        return f"{float(v):.4f}"
    except Exception:
        return "-"


def main() -> int:
    args = build_parser().parse_args()
    repo_root = Path(__file__).resolve().parents[2]
    run_script = repo_root / "scripts" / "perf" / "run_backend_perf.py"
    eval_script = repo_root / "scripts" / "perf" / "evaluate_backend_perf.py"

    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    reports: List[Path] = []

    print("== Perf Baseline Suite ==")
    print(
        "runs={runs} mode={mode} requests={req} concurrency={cc} points={pts} resolution={res}".format(
            runs=args.runs,
            mode="inprocess" if args.inprocess else f"http({args.base_url})",
            req=args.requests,
            cc=args.concurrency,
            pts=args.points,
            res=args.resolution,
        )
    )

    for i in range(max(args.runs, 1)):
        out = output_dir / f"run_{i + 1}.json"
        cmd = [
            sys.executable,
            str(run_script),
            "--requests",
            str(args.requests),
            "--concurrency",
            str(args.concurrency),
            "--resolution",
            str(args.resolution),
            "--points",
            str(args.points),
            "--method",
            str(args.method),
            "--artifact-name",
            str(args.artifact_name),
            "--output-json",
            str(out),
        ]
        if args.inprocess:
            cmd.append("--inprocess")
        else:
            cmd.extend(["--base-url", str(args.base_url)])
        if args.geomodel_job_id.strip():
            cmd.extend(["--geomodel-job-id", args.geomodel_job_id.strip()])
        print(f"\n[round {i + 1}]")
        run_cmd(cmd, repo_root)
        reports.append(out)

    eval_out = output_dir / "evaluation.json"
    eval_cmd = [
        sys.executable,
        str(eval_script),
        "--reports",
        *[str(p) for p in reports],
        "--thresholds",
        str(Path(args.thresholds).resolve()),
        "--output-json",
        str(eval_out),
    ]
    if args.allow_missing_scenarios:
        eval_cmd.append("--allow-missing-scenarios")

    print("\n[evaluation]")
    run_cmd(eval_cmd, repo_root)

    md_out = output_dir / "evaluation.md"
    generate_markdown(eval_out, md_out)
    print(f"[report] wrote markdown: {md_out}")

    data = json.loads(eval_out.read_text(encoding="utf-8"))
    return 0 if data.get("all_passed") else 2


if __name__ == "__main__":
    raise SystemExit(main())
