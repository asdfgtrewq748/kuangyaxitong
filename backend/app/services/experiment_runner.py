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
    "geomodel_ablation": [
        {
            "experiment_name": "geomodel_full",
            "model_type": "geomodel_aware",
            "metrics": ["auc", "pr_auc", "brier", "ece", "f1", "mae", "rmse", "paired_significance_p"],
        },
        {
            "experiment_name": "geomodel_ablation_no_geo",
            "model_type": "geomodel_ablation",
            "metrics": ["auc", "pr_auc", "brier", "ece", "f1", "mae", "rmse", "paired_significance_p"],
        },
    ],
    "pinchout_effect": [
        {
            "experiment_name": "pinchout_sensitive_on",
            "model_type": "pinchout_sensitive",
            "metrics": ["auc", "pr_auc", "brier", "ece", "f1", "mae", "rmse", "paired_significance_p"],
        },
        {
            "experiment_name": "pinchout_sensitive_off",
            "model_type": "geomodel_ablation",
            "metrics": ["auc", "pr_auc", "brier", "ece", "f1", "mae", "rmse", "paired_significance_p"],
        },
    ],
    "rk_vs_kriging": [
        {
            "experiment_name": "rk_enhanced",
            "model_type": "rk_enhanced",
            "metrics": ["auc", "pr_auc", "brier", "ece", "f1", "mae", "rmse", "paired_significance_p"],
        },
        {
            "experiment_name": "kriging_baseline",
            "model_type": "kriging_baseline",
            "metrics": ["auc", "pr_auc", "brier", "ece", "f1", "mae", "rmse", "paired_significance_p"],
        },
    ],
}


def _suite_dir() -> Path:
    path = get_research_paths().root / "suites"
    path.mkdir(parents=True, exist_ok=True)
    return path


def _safe_metric(metrics: Dict[str, Any], name: str, default: float = 0.0) -> float:
    try:
        value = metrics.get(name)
        if value is None:
            return default
        return float(value)
    except Exception:
        return default


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
    run_rows = []
    for r in results:
        spec = r.get("spec", {}) or {}
        run_rows.append(
            {
                "exp_id": r["exp_id"],
                "experiment_name": spec.get("experiment_name"),
                "model_type": spec.get("model_type"),
                "seed": spec.get("seed"),
                "metrics": r["metrics"],
                "dataset_version": r.get("dataset_version"),
                "split_id": r.get("split_id"),
                "parameter_snapshot": spec.get("params", {}),
                "traceability": r.get("traceability", {}),
            }
        )

    best_auc = max(run_rows, key=lambda row: _safe_metric(row["metrics"], "auc"))
    best_brier = min(run_rows, key=lambda row: _safe_metric(row["metrics"], "brier", default=1e9))
    summary = {
        "suite_id": suite_id,
        "template_name": template_name,
        "dataset_id": dataset_id,
        "dataset_version": dataset_version,
        "split_id": split_id,
        "seed": seed,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "runs": run_rows,
        "comparison_conclusion": {
            "best_auc_experiment": best_auc["experiment_name"],
            "best_auc_value": _safe_metric(best_auc["metrics"], "auc"),
            "best_brier_experiment": best_brier["experiment_name"],
            "best_brier_value": _safe_metric(best_brier["metrics"], "brier", default=1e9),
            "note": (
                f"Template={template_name}, AUC-best={best_auc['experiment_name']}, "
                f"Brier-best={best_brier['experiment_name']}"
            ),
        },
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
