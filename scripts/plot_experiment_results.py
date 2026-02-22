from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict, List

import matplotlib.pyplot as plt
import numpy as np


def _read_json(path: Path) -> Dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError(f"invalid json object: {path}")
    return payload


def _safe_float(value: Any) -> float:
    try:
        return float(value)
    except Exception:
        return float("nan")


def _suite_runs(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    runs = payload.get("runs") or []
    return [r for r in runs if isinstance(r, dict)]


def _plot_single_suite(payload: Dict[str, Any], metrics: List[str], out_dir: Path) -> List[Path]:
    suite_id = str(payload.get("suite_id") or "suite")
    template_name = str(payload.get("template_name") or "")
    dataset_id = str(payload.get("dataset_id") or "")
    runs = _suite_runs(payload)
    if not runs:
        return []

    exp_names = [str(r.get("experiment_name") or "unknown") for r in runs]
    x = np.arange(len(exp_names))
    generated: List[Path] = []

    for metric in metrics:
        values = np.asarray([_safe_float((r.get("metrics") or {}).get(metric)) for r in runs], dtype=float)
        fig, ax = plt.subplots(figsize=(8, 4))
        bars = ax.bar(x, np.nan_to_num(values, nan=0.0), color="#0f766e", alpha=0.85)
        ax.set_xticks(x, exp_names, rotation=15)
        ax.set_ylabel(metric)
        ax.set_title(f"{suite_id} | {template_name} | {dataset_id} | {metric}")
        ax.grid(axis="y", alpha=0.25)
        for idx, b in enumerate(bars):
            v = values[idx]
            if np.isfinite(v):
                ax.text(b.get_x() + b.get_width() / 2.0, b.get_height(), f"{v:.3f}", ha="center", va="bottom", fontsize=9)
        out_path = out_dir / f"{suite_id}_{metric}.png"
        fig.tight_layout()
        fig.savefig(out_path, dpi=180)
        plt.close(fig)
        generated.append(out_path)
    return generated


def _plot_two_suites_compare(
    left: Dict[str, Any],
    right: Dict[str, Any],
    metrics: List[str],
    out_dir: Path,
) -> List[Path]:
    left_runs = {str(r.get("experiment_name") or ""): r for r in _suite_runs(left)}
    right_runs = {str(r.get("experiment_name") or ""): r for r in _suite_runs(right)}
    exp_names = [e for e in sorted(set(left_runs) & set(right_runs)) if e]
    if not exp_names:
        return []

    left_suite = str(left.get("suite_id") or "left")
    right_suite = str(right.get("suite_id") or "right")
    left_dataset = str(left.get("dataset_id") or "left")
    right_dataset = str(right.get("dataset_id") or "right")
    template_name = str(left.get("template_name") or right.get("template_name") or "template")

    x = np.arange(len(exp_names))
    width = 0.35
    generated: List[Path] = []

    for metric in metrics:
        left_values = np.asarray(
            [_safe_float((left_runs[e].get("metrics") or {}).get(metric)) for e in exp_names],
            dtype=float,
        )
        right_values = np.asarray(
            [_safe_float((right_runs[e].get("metrics") or {}).get(metric)) for e in exp_names],
            dtype=float,
        )

        fig, ax = plt.subplots(figsize=(9, 4.5))
        ax.bar(x - width / 2, np.nan_to_num(left_values, nan=0.0), width=width, label=left_dataset, color="#0ea5e9")
        ax.bar(x + width / 2, np.nan_to_num(right_values, nan=0.0), width=width, label=right_dataset, color="#f59e0b")
        ax.set_xticks(x, exp_names, rotation=15)
        ax.set_ylabel(metric)
        ax.set_title(f"{metric} comparison | {left_suite} vs {right_suite}")
        ax.legend()
        ax.grid(axis="y", alpha=0.25)

        out_path = out_dir / f"compare_{template_name}_{left_dataset}_vs_{right_dataset}_{metric}.png"
        fig.tight_layout()
        fig.savefig(out_path, dpi=180)
        plt.close(fig)
        generated.append(out_path)
    return generated


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Plot experiment suite summary metrics.")
    parser.add_argument("--suite-summary", type=Path, default=None, help="single suite summary.json path")
    parser.add_argument("--suite-a", type=Path, default=None, help="left suite summary.json path")
    parser.add_argument("--suite-b", type=Path, default=None, help="right suite summary.json path")
    parser.add_argument("--metrics", type=str, default="auc,brier,f1", help="comma-separated metrics")
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=Path("docs/experiments/figures"),
        help="output directory for png figures",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    metrics = [m.strip() for m in str(args.metrics).split(",") if m.strip()]
    if not metrics:
        raise ValueError("metrics is empty")
    args.out_dir.mkdir(parents=True, exist_ok=True)

    generated: List[Path] = []
    if args.suite_summary:
        generated.extend(_plot_single_suite(_read_json(args.suite_summary), metrics, args.out_dir))
    if args.suite_a and args.suite_b:
        generated.extend(
            _plot_two_suites_compare(
                _read_json(args.suite_a),
                _read_json(args.suite_b),
                metrics,
                args.out_dir,
            )
        )

    print(f"[plot_experiment_results] generated={len(generated)}")
    for path in generated:
        print(f"- {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
