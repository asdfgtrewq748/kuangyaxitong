#!/usr/bin/env python
from __future__ import annotations

import argparse
import csv
import json
import statistics
import sys
import time
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = REPO_ROOT / "backend"
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.services.research_manager import (  # noqa: E402
    latest_split_id,
    load_dataset_manifest,
    run_experiment,
)


DEFAULT_DATASETS = ["research_boreholes_28", "research_boreholes_36"]
DEFAULT_MODELS = [
    "kriging_baseline",
    "geomodel_aware",
    "hybrid_augmented",
    "geomodel_ablation",
    "pinchout_no_zoning",
]
METRIC_COLUMNS = ["auc", "pr_auc", "brier", "f1", "mae", "rmse", "paired_significance_p"]


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Run Week4 multi-seed stability benchmark and export JSON/CSV/Markdown reports.",
    )
    p.add_argument("--dataset-ids", nargs="+", default=list(DEFAULT_DATASETS))
    p.add_argument("--models", nargs="+", default=list(DEFAULT_MODELS))
    p.add_argument("--seed-start", type=int, default=43000)
    p.add_argument("--seed-count", type=int, default=5)
    p.add_argument("--split-map", default="", help="Optional mapping: ds1=split_x,ds2=split_y")
    p.add_argument(
        "--output-dir",
        default="data/experiments/results/week4_multi_seed_stability",
        help="Directory for json/csv outputs.",
    )
    p.add_argument(
        "--output-md",
        default="docs/experiments/week4_multi_seed_stability.md",
        help="Markdown report output path.",
    )
    return p.parse_args()


def parse_split_map(raw: str) -> Dict[str, str]:
    result: Dict[str, str] = {}
    text = (raw or "").strip()
    if not text:
        return result
    for item in text.split(","):
        part = item.strip()
        if not part or "=" not in part:
            continue
        key, value = part.split("=", 1)
        k = key.strip()
        v = value.strip()
        if k and v:
            result[k] = v
    return result


def _mean(values: Iterable[float]) -> float:
    vals = list(values)
    if not vals:
        return 0.0
    return float(sum(vals) / len(vals))


def _std(values: Iterable[float]) -> float:
    vals = list(values)
    if len(vals) <= 1:
        return 0.0
    return float(statistics.pstdev(vals))


def _safe_float(value: Any) -> float:
    try:
        return float(value)
    except Exception:
        return 0.0


def run_benchmark(
    dataset_ids: List[str],
    models: List[str],
    seed_start: int,
    seed_count: int,
    split_map: Dict[str, str],
) -> Dict[str, Any]:
    rows: List[Dict[str, Any]] = []
    meta: Dict[str, Any] = {"datasets": {}}
    begin = time.time()

    for ds_idx, dataset_id in enumerate(dataset_ids):
        manifest = load_dataset_manifest(dataset_id)
        split_id = split_map.get(dataset_id) or (latest_split_id(dataset_id) or "")
        if not split_id:
            raise ValueError(f"No split_id found for dataset={dataset_id}")
        dataset_version = str(manifest["dataset_version"])

        meta["datasets"][dataset_id] = {
            "dataset_version": dataset_version,
            "split_id": split_id,
        }

        for model_idx, model_type in enumerate(models):
            for offset in range(seed_count):
                seed = int(seed_start + ds_idx * 1000 + model_idx * 100 + offset)
                exp_name = f"stability_{dataset_id}_{model_type}_s{seed}"
                payload = {
                    "dataset_id": dataset_id,
                    "dataset_version": dataset_version,
                    "split_id": split_id,
                    "experiment_name": exp_name,
                    "model_type": model_type,
                    "seed": seed,
                }
                result = run_experiment(payload)
                metrics = result.get("metrics", {})
                row = {
                    "dataset_id": dataset_id,
                    "dataset_version": dataset_version,
                    "split_id": split_id,
                    "model_type": model_type,
                    "seed": seed,
                    "exp_id": result.get("exp_id", ""),
                    "experiment_name": exp_name,
                }
                for metric in METRIC_COLUMNS:
                    row[metric] = _safe_float(metrics.get(metric))
                rows.append(row)

    grouped: Dict[Tuple[str, str], List[Dict[str, Any]]] = defaultdict(list)
    for row in rows:
        grouped[(row["dataset_id"], row["model_type"])].append(row)

    summary_rows: List[Dict[str, Any]] = []
    for (dataset_id, model_type), items in sorted(grouped.items()):
        summary = {
            "dataset_id": dataset_id,
            "model_type": model_type,
            "sample_count": len(items),
        }
        for metric in METRIC_COLUMNS:
            vals = [_safe_float(it.get(metric)) for it in items]
            summary[f"{metric}_mean"] = _mean(vals)
            summary[f"{metric}_std"] = _std(vals)
            summary[f"{metric}_min"] = min(vals) if vals else 0.0
            summary[f"{metric}_max"] = max(vals) if vals else 0.0
        summary_rows.append(summary)

    elapsed = round(time.time() - begin, 3)
    return {
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "elapsed_sec": elapsed,
        "config": {
            "dataset_ids": dataset_ids,
            "models": models,
            "seed_start": seed_start,
            "seed_count": seed_count,
            "split_map": split_map,
        },
        "meta": meta,
        "rows": rows,
        "summary": summary_rows,
    }


def write_csv(path: Path, rows: List[Dict[str, Any]]) -> None:
    headers = [
        "dataset_id",
        "dataset_version",
        "split_id",
        "model_type",
        "seed",
        "exp_id",
        "experiment_name",
        *METRIC_COLUMNS,
    ]
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in headers})


def write_summary_csv(path: Path, rows: List[Dict[str, Any]]) -> None:
    headers = [
        "dataset_id",
        "model_type",
        "sample_count",
        "auc_mean",
        "auc_std",
        "brier_mean",
        "brier_std",
        "f1_mean",
        "f1_std",
        "rmse_mean",
        "rmse_std",
    ]
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in headers})


def write_markdown(path: Path, report: Dict[str, Any]) -> None:
    lines: List[str] = []
    lines.append("# Week4 Multi-Seed Stability Report")
    lines.append("")
    lines.append(f"- generated_at: {report.get('generated_at')}")
    lines.append(f"- elapsed_sec: {report.get('elapsed_sec')}")
    lines.append(f"- dataset_ids: {', '.join(report['config'].get('dataset_ids', []))}")
    lines.append(f"- models: {', '.join(report['config'].get('models', []))}")
    lines.append(f"- seed_count_per_model: {report['config'].get('seed_count')}")
    lines.append("")

    by_dataset: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    for row in report.get("summary", []):
        by_dataset[str(row.get("dataset_id"))].append(row)

    for dataset_id in report["config"].get("dataset_ids", []):
        rows = sorted(by_dataset.get(dataset_id, []), key=lambda x: str(x.get("model_type", "")))
        lines.append(f"## Dataset: `{dataset_id}`")
        meta = report.get("meta", {}).get("datasets", {}).get(dataset_id, {})
        lines.append(f"- dataset_version: `{meta.get('dataset_version', '')}`")
        lines.append(f"- split_id: `{meta.get('split_id', '')}`")
        lines.append("")
        lines.append("| model_type | auc(mean±std) | brier(mean±std) | f1(mean±std) | rmse(mean±std) |")
        lines.append("| --- | ---: | ---: | ---: | ---: |")
        for row in rows:
            lines.append(
                "| {m} | {auc_m:.6f}±{auc_s:.6f} | {br_m:.6f}±{br_s:.6f} | {f1_m:.6f}±{f1_s:.6f} | {rm_m:.6f}±{rm_s:.6f} |".format(
                    m=row.get("model_type", ""),
                    auc_m=float(row.get("auc_mean", 0.0)),
                    auc_s=float(row.get("auc_std", 0.0)),
                    br_m=float(row.get("brier_mean", 0.0)),
                    br_s=float(row.get("brier_std", 0.0)),
                    f1_m=float(row.get("f1_mean", 0.0)),
                    f1_s=float(row.get("f1_std", 0.0)),
                    rm_m=float(row.get("rmse_mean", 0.0)),
                    rm_s=float(row.get("rmse_std", 0.0)),
                )
            )
        lines.append("")

    lines.append("## Notes")
    lines.append("")
    lines.append("- Higher is better for AUC/F1; lower is better for Brier/RMSE.")
    lines.append("- This report is generated from repeated runs using frozen split per dataset.")
    lines.append("")

    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    split_map = parse_split_map(args.split_map)
    output_dir = (REPO_ROOT / args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    md_path = (REPO_ROOT / args.output_md).resolve()
    md_path.parent.mkdir(parents=True, exist_ok=True)

    report = run_benchmark(
        dataset_ids=list(args.dataset_ids),
        models=list(args.models),
        seed_start=int(args.seed_start),
        seed_count=max(1, int(args.seed_count)),
        split_map=split_map,
    )

    json_path = output_dir / "stability_summary.json"
    csv_path = output_dir / "stability_runs.csv"
    summary_csv_path = output_dir / "stability_model_summary.csv"

    json_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    write_csv(csv_path, report.get("rows", []))
    write_summary_csv(summary_csv_path, report.get("summary", []))
    write_markdown(md_path, report)

    print("== Week4 Multi-Seed Stability ==")
    print(f"json: {json_path}")
    print(f"runs_csv: {csv_path}")
    print(f"summary_csv: {summary_csv_path}")
    print(f"markdown: {md_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
