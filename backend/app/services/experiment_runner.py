from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any, Dict, List

from app.services.research_manager import run_experiment, get_research_paths


DEFAULT_EXPERIMENT_TEMPLATES: Dict[str, List[Dict[str, Any]]] = {
    "rsi_paper_core": [
        {
            "experiment_name": "rsi_main",
            "model_type": "rsi_phase_field",
            "metrics": ["auc", "pr_auc", "brier", "ece", "f1", "mae", "rmse"],
        },
        {
            "experiment_name": "rsi_baseline",
            "model_type": "baseline",
            "metrics": ["auc", "pr_auc", "brier", "ece", "f1", "mae", "rmse"],
        },
    ],
    "asi_paper_core": [
        {
            "experiment_name": "asi_main",
            "model_type": "asi_ust",
            "metrics": ["auc", "pr_auc", "brier", "ece", "f1", "mae", "rmse"],
        },
        {
            "experiment_name": "asi_baseline",
            "model_type": "baseline",
            "metrics": ["auc", "pr_auc", "brier", "ece", "f1", "mae", "rmse"],
        },
    ],
}


def _suite_dir() -> Path:
    path = get_research_paths().root / "suites"
    path.mkdir(parents=True, exist_ok=True)
    return path


def run_experiment_suite(
    template_name: str,
    dataset_id: str,
    dataset_version: str,
    split_id: str,
    seed: int = 42,
) -> Dict[str, Any]:
    template = DEFAULT_EXPERIMENT_TEMPLATES.get(template_name)
    if not template:
        raise ValueError(f"unknown template: {template_name}")

    results: List[Dict[str, Any]] = []
    for idx, block in enumerate(template):
        payload = {
            "dataset_id": dataset_id,
            "dataset_version": dataset_version,
            "split_id": split_id,
            "experiment_name": block["experiment_name"],
            "model_type": block["model_type"],
            "metrics": block.get("metrics", []),
            "seed": int(seed + idx),
        }
        results.append(run_experiment(payload))

    suite_id = f"suite_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}"
    summary = {
        "suite_id": suite_id,
        "template_name": template_name,
        "dataset_id": dataset_id,
        "dataset_version": dataset_version,
        "split_id": split_id,
        "seed": seed,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "runs": [{"exp_id": r["exp_id"], "experiment_name": r["spec"]["experiment_name"], "metrics": r["metrics"]} for r in results],
    }

    out_dir = _suite_dir() / suite_id
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = ["experiment_name,exp_id,auc,pr_auc,brier,f1,mae,rmse,paired_significance_p"]
    for run in summary["runs"]:
        m = run["metrics"]
        lines.append(
            f"{run['experiment_name']},{run['exp_id']},{m.get('auc','')},{m.get('pr_auc','')},{m.get('brier','')},{m.get('f1','')},{m.get('mae','')},{m.get('rmse','')},{m.get('paired_significance_p','')}"
        )
    (out_dir / "summary_metrics.csv").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return summary
