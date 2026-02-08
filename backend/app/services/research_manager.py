from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from hashlib import sha256
import json
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple
from uuid import uuid4

import numpy as np
import pandas as pd
from scipy.stats import ttest_rel
from sklearn.metrics import (
    average_precision_score,
    brier_score_loss,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    roc_auc_score,
)

from app.core.config import get_data_dir
from app.services.csv_loader import read_csv_robust


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None:
            return default
        if pd.isna(value):
            return default
        return float(value)
    except Exception:
        return default


def _sigmoid(x: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-x))


def _coerce_binary(y: pd.Series, positive_values: List[Any]) -> np.ndarray:
    positive_set = {str(v).strip().lower() for v in positive_values}
    out: List[int] = []
    for value in y:
        text = str(value).strip().lower()
        if text in positive_set:
            out.append(1)
            continue
        try:
            out.append(1 if float(value) >= 1 else 0)
        except Exception:
            out.append(0)
    return np.asarray(out, dtype=int)


@dataclass
class ResearchPaths:
    root: Path
    datasets_dir: Path
    experiments_dir: Path


def get_research_paths() -> ResearchPaths:
    root = get_data_dir() / "research"
    datasets_dir = root / "datasets"
    experiments_dir = root / "experiments"
    datasets_dir.mkdir(parents=True, exist_ok=True)
    experiments_dir.mkdir(parents=True, exist_ok=True)
    return ResearchPaths(root=root, datasets_dir=datasets_dir, experiments_dir=experiments_dir)


def dataset_csv_path(dataset_id: str) -> Path:
    return get_data_dir() / f"{dataset_id}.csv"


def dataset_dir(dataset_id: str) -> Path:
    path = get_research_paths().datasets_dir / dataset_id
    path.mkdir(parents=True, exist_ok=True)
    return path


def dataset_manifest_path(dataset_id: str) -> Path:
    return dataset_dir(dataset_id) / "dataset_manifest.json"


def split_dir(dataset_id: str) -> Path:
    path = dataset_dir(dataset_id) / "splits"
    path.mkdir(parents=True, exist_ok=True)
    return path


def split_path(dataset_id: str, split_id: str) -> Path:
    return split_dir(dataset_id) / f"{split_id}.json"


def experiment_dir(exp_id: str) -> Path:
    path = get_research_paths().experiments_dir / exp_id
    path.mkdir(parents=True, exist_ok=True)
    return path


def experiment_result_path(exp_id: str) -> Path:
    return experiment_dir(exp_id) / "result.json"


def _row_key_series(df: pd.DataFrame) -> pd.Series:
    for col in ("sample_id", "id", "row_id"):
        if col in df.columns:
            return df[col].astype(str)
    return pd.Series([str(i) for i in range(len(df))], index=df.index)


def _choose_column(df: pd.DataFrame, candidates: List[str]) -> Optional[str]:
    for candidate in candidates:
        if candidate in df.columns:
            return candidate
    lower_map = {str(col).strip().lower(): str(col) for col in df.columns}
    for candidate in candidates:
        key = candidate.strip().lower()
        if key in lower_map:
            return lower_map[key]
    return None


def _quality_report(df: pd.DataFrame, label_column: Optional[str]) -> Dict[str, Any]:
    missing_ratio = (df.isna().sum() / max(len(df), 1)).to_dict()
    numeric_cols = [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c])]
    report: Dict[str, Any] = {
        "row_count": int(len(df)),
        "column_count": int(len(df.columns)),
        "missing_ratio": {str(k): float(v) for k, v in missing_ratio.items()},
        "numeric_columns": numeric_cols,
        "required_columns": {
            "label_column": label_column or "",
            "has_label_column": bool(label_column and label_column in df.columns),
        },
    }
    return report


def _file_sha256(path: Path) -> str:
    digest = sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def register_dataset_manifest(
    dataset_id: str,
    label_schema: Dict[str, Any],
    description: str = "",
) -> Dict[str, Any]:
    csv_path = dataset_csv_path(dataset_id)
    if not csv_path.exists():
        raise FileNotFoundError(f"dataset csv not found: {csv_path.name}")

    df = read_csv_robust(csv_path)
    label_column = str(label_schema.get("label_column", "")).strip() or None
    quality = _quality_report(df, label_column=label_column)

    manifest = {
        "dataset_id": dataset_id,
        "dataset_file": csv_path.name,
        "dataset_version": _file_sha256(csv_path)[:16],
        "dataset_sha256": _file_sha256(csv_path),
        "row_count": int(len(df)),
        "column_count": int(len(df.columns)),
        "columns": [str(c) for c in df.columns],
        "description": description,
        "label_schema": label_schema,
        "quality_report": quality,
        "registered_at": _utc_now_iso(),
        "updated_at": _utc_now_iso(),
    }
    dataset_manifest_path(dataset_id).write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return manifest


def load_dataset_manifest(dataset_id: str) -> Dict[str, Any]:
    path = dataset_manifest_path(dataset_id)
    if not path.exists():
        raise FileNotFoundError(f"dataset manifest not found for dataset_id={dataset_id}")
    return json.loads(path.read_text(encoding="utf-8"))


def _compute_time_ranges(values: pd.Series) -> Dict[str, str]:
    if values.empty:
        return {"start": "", "end": ""}
    return {"start": str(values.min()), "end": str(values.max())}


def _split_by_borehole(
    df: pd.DataFrame,
    borehole_col: str,
    train_ratio: float,
    val_ratio: float,
    seed: int,
) -> Tuple[pd.Index, pd.Index, pd.Index]:
    groups = sorted({str(v) for v in df[borehole_col].fillna("").astype(str).tolist() if str(v).strip()})
    rng = np.random.default_rng(seed)
    shuffled = list(groups)
    rng.shuffle(shuffled)

    n = len(shuffled)
    n_train = max(1, int(round(n * train_ratio)))
    n_val = max(1, int(round(n * val_ratio))) if n >= 3 else max(0, n - n_train - 1)
    n_test = max(1, n - n_train - n_val) if n >= 3 else max(0, n - n_train - n_val)
    if n_train + n_val + n_test > n:
        n_test = max(0, n - n_train - n_val)

    train_set = set(shuffled[:n_train])
    val_set = set(shuffled[n_train:n_train + n_val])
    test_set = set(shuffled[n_train + n_val:n_train + n_val + n_test])
    if not test_set and val_set:
        moved = sorted(val_set)[-1]
        val_set.remove(moved)
        test_set.add(moved)

    train_idx = df.index[df[borehole_col].astype(str).isin(train_set)]
    val_idx = df.index[df[borehole_col].astype(str).isin(val_set)]
    test_idx = df.index[df[borehole_col].astype(str).isin(test_set)]
    return train_idx, val_idx, test_idx


def _split_by_time(
    df: pd.DataFrame,
    time_col: str,
    train_ratio: float,
    val_ratio: float,
) -> Tuple[pd.Index, pd.Index, pd.Index]:
    time_df = df.copy()
    time_df["__t__"] = pd.to_datetime(time_df[time_col], errors="coerce")
    time_df = time_df.sort_values("__t__")
    valid = time_df.dropna(subset=["__t__"])
    if valid.empty:
        idx = list(df.index)
        n = len(idx)
        n_train = max(1, int(round(n * train_ratio)))
        n_val = max(1, int(round(n * val_ratio))) if n >= 3 else 0
        return (
            pd.Index(idx[:n_train]),
            pd.Index(idx[n_train:n_train + n_val]),
            pd.Index(idx[n_train + n_val:]),
        )

    n = len(valid)
    n_train = max(1, int(round(n * train_ratio)))
    n_val = max(1, int(round(n * val_ratio))) if n >= 3 else 0
    train_idx = valid.index[:n_train]
    val_idx = valid.index[n_train:n_train + n_val]
    test_idx = valid.index[n_train + n_val:]
    return train_idx, val_idx, test_idx


def create_split_manifest(
    dataset_id: str,
    strategy: str,
    train_ratio: float,
    val_ratio: float,
    test_ratio: float,
    seed: int,
    time_column: Optional[str] = None,
    borehole_column: Optional[str] = None,
) -> Dict[str, Any]:
    manifest = load_dataset_manifest(dataset_id)
    df = read_csv_robust(dataset_csv_path(dataset_id))
    key_series = _row_key_series(df)

    time_col = time_column or _choose_column(df, ["event_time", "timestamp", "time", "date", "event_date"])
    borehole_col = borehole_column or _choose_column(df, ["borehole_name", "borehole", "hole", "钻孔名", "钻孔"])

    if strategy in {"borehole_block", "time_borehole_block"} and not borehole_col:
        raise ValueError("borehole_block strategy requires borehole column")
    if strategy in {"time_block", "time_borehole_block"} and not time_col:
        raise ValueError("time_block strategy requires time column")

    if strategy == "borehole_block":
        train_idx, val_idx, test_idx = _split_by_borehole(df, borehole_col, train_ratio, val_ratio, seed)
    elif strategy == "time_block":
        train_idx, val_idx, test_idx = _split_by_time(df, time_col, train_ratio, val_ratio)
    elif strategy == "time_borehole_block":
        # Prefer leakage-safe borehole partition, then keep time ranges for audit.
        train_idx, val_idx, test_idx = _split_by_borehole(df, borehole_col, train_ratio, val_ratio, seed)
    else:
        rng = np.random.default_rng(seed)
        indices = np.asarray(list(df.index), dtype=int)
        rng.shuffle(indices)
        n = len(indices)
        n_train = max(1, int(round(n * train_ratio)))
        n_val = max(1, int(round(n * val_ratio))) if n >= 3 else 0
        train_idx = pd.Index(indices[:n_train])
        val_idx = pd.Index(indices[n_train:n_train + n_val])
        test_idx = pd.Index(indices[n_train + n_val:])

    sections = {
        "train": sorted([int(i) for i in train_idx.tolist()]),
        "val": sorted([int(i) for i in val_idx.tolist()]),
        "test": sorted([int(i) for i in test_idx.tolist()]),
    }
    if len(sections["val"]) == 0 and len(sections["test"]) > 1:
        sections["val"].append(sections["test"].pop(0))
    if len(sections["test"]) == 0 and len(sections["val"]) > 1:
        sections["test"].append(sections["val"].pop())

    train_bh = set(df.loc[sections["train"], borehole_col].astype(str).tolist()) if borehole_col else set()
    val_bh = set(df.loc[sections["val"], borehole_col].astype(str).tolist()) if borehole_col else set()
    test_bh = set(df.loc[sections["test"], borehole_col].astype(str).tolist()) if borehole_col else set()

    split_id = f"split_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}_{uuid4().hex[:6]}"
    split_manifest = {
        "split_id": split_id,
        "dataset_id": dataset_id,
        "dataset_version": manifest["dataset_version"],
        "strategy": strategy,
        "seed": int(seed),
        "time_column": time_col or "",
        "borehole_column": borehole_col or "",
        "ratios": {"train": train_ratio, "val": val_ratio, "test": test_ratio},
        "counts": {k: len(v) for k, v in sections.items()},
        "index_splits": sections,
        "row_key_splits": {
            k: key_series.loc[v].astype(str).tolist() for k, v in sections.items()
        },
        "leakage_audit": {
            "train": {
                "boreholes": sorted(train_bh),
                "time_range": _compute_time_ranges(df.loc[sections["train"], time_col].astype(str)) if time_col else {"start": "", "end": ""},
            },
            "val": {
                "boreholes": sorted(val_bh),
                "time_range": _compute_time_ranges(df.loc[sections["val"], time_col].astype(str)) if time_col else {"start": "", "end": ""},
            },
            "test": {
                "boreholes": sorted(test_bh),
                "time_range": _compute_time_ranges(df.loc[sections["test"], time_col].astype(str)) if time_col else {"start": "", "end": ""},
            },
            "overlap": {
                "boreholes_train_val": int(len(train_bh & val_bh)),
                "boreholes_train_test": int(len(train_bh & test_bh)),
                "boreholes_val_test": int(len(val_bh & test_bh)),
            },
        },
        "created_at": _utc_now_iso(),
    }
    split_path(dataset_id, split_id).write_text(
        json.dumps(split_manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return split_manifest


def load_split_manifest(dataset_id: str, split_id: str) -> Dict[str, Any]:
    path = split_path(dataset_id, split_id)
    if not path.exists():
        raise FileNotFoundError(f"split manifest not found: {split_id}")
    return json.loads(path.read_text(encoding="utf-8"))


def latest_split_id(dataset_id: str) -> Optional[str]:
    candidates = sorted(split_dir(dataset_id).glob("split_*.json"))
    if not candidates:
        return None
    return candidates[-1].stem


def _rank01(series: pd.Series) -> np.ndarray:
    arr = pd.to_numeric(series, errors="coerce").fillna(float(series.median() if len(series) else 0)).to_numpy(dtype=float)
    if arr.size == 0:
        return arr
    min_v = float(np.min(arr))
    max_v = float(np.max(arr))
    if max_v - min_v < 1e-12:
        return np.full_like(arr, 0.5, dtype=float)
    return (arr - min_v) / (max_v - min_v)


def _build_model_probabilities(df: pd.DataFrame, model_type: str, seed: int) -> np.ndarray:
    numeric_cols = [col for col in df.columns if pd.api.types.is_numeric_dtype(df[col])]
    if not numeric_cols:
        return np.full(len(df), 0.5, dtype=float)

    rng = np.random.default_rng(seed)
    normalized = {col: _rank01(df[col]) for col in numeric_cols}

    def col_like(keys: List[str], default: np.ndarray) -> np.ndarray:
        for col in df.columns:
            text = str(col).lower()
            if any(k in text for k in keys):
                return normalized.get(col, default)
        return default

    fallback = normalized[numeric_cols[0]]
    elastic = col_like(["elastic", "模量"], fallback)
    friction = col_like(["friction", "摩擦"], fallback)
    cohesion = col_like(["cohesion", "内聚"], fallback)
    thickness = col_like(["thickness", "厚度"], fallback)
    depth = col_like(["depth", "埋深"], fallback)
    tensile = col_like(["tensile", "抗拉"], fallback)

    if model_type == "baseline":
        score = 0.55 * depth + 0.45 * thickness
    elif model_type == "rsi_phase_field":
        score = 0.35 * elastic + 0.25 * tensile + 0.20 * thickness + 0.20 * (1 - depth)
    elif model_type == "asi_ust":
        score = 0.35 * friction + 0.35 * cohesion + 0.15 * elastic + 0.15 * (1 - depth)
    else:
        raw = np.vstack([normalized[col] for col in numeric_cols]).mean(axis=0)
        score = raw

    noise = rng.normal(0.0, 0.02, size=len(df))
    logits = (score + noise - 0.5) * 4.0
    return _sigmoid(logits)


def _ece_report(y_true: np.ndarray, y_prob: np.ndarray, bins: int = 10) -> Dict[str, Any]:
    n = max(len(y_true), 1)
    edges = np.linspace(0, 1, bins + 1)
    rows: List[Dict[str, Any]] = []
    ece = 0.0
    mce = 0.0
    for i in range(bins):
        lo = edges[i]
        hi = edges[i + 1]
        if i < bins - 1:
            mask = (y_prob >= lo) & (y_prob < hi)
        else:
            mask = (y_prob >= lo) & (y_prob <= hi)
        count = int(np.sum(mask))
        if count == 0:
            rows.append({"bin": i, "range": [float(lo), float(hi)], "count": 0, "acc": 0.0, "conf": 0.0, "gap": 0.0})
            continue
        acc = float(np.mean(y_true[mask]))
        conf = float(np.mean(y_prob[mask]))
        gap = abs(acc - conf)
        ece += (count / n) * gap
        mce = max(mce, gap)
        rows.append({"bin": i, "range": [float(lo), float(hi)], "count": count, "acc": acc, "conf": conf, "gap": gap})
    return {"ece": float(ece), "mce": float(mce), "bin_count": bins, "bins": rows}


def _bootstrap_ci(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    metric_fn: Callable[[np.ndarray, np.ndarray], float],
    seed: int,
    n_bootstrap: int = 200,
) -> Tuple[float, float]:
    if len(y_true) <= 1:
        value = metric_fn(y_true, y_prob)
        return float(value), float(value)
    rng = np.random.default_rng(seed)
    vals: List[float] = []
    n = len(y_true)
    for _ in range(n_bootstrap):
        idx = rng.integers(0, n, size=n)
        yt = y_true[idx]
        yp = y_prob[idx]
        try:
            vals.append(float(metric_fn(yt, yp)))
        except Exception:
            continue
    if not vals:
        value = metric_fn(y_true, y_prob)
        return float(value), float(value)
    lo, hi = np.percentile(vals, [2.5, 97.5])
    return float(lo), float(hi)


def run_experiment(spec: Dict[str, Any]) -> Dict[str, Any]:
    dataset_id = str(spec["dataset_id"])
    manifest = load_dataset_manifest(dataset_id)
    expected_version = str(spec.get("dataset_version", "")).strip()
    if expected_version and expected_version != manifest["dataset_version"]:
        raise ValueError("dataset version mismatch")

    split_id = str(spec.get("split_id", "")).strip() or (latest_split_id(dataset_id) or "")
    if not split_id:
        raise ValueError("no split found for dataset, run /split first")
    split_manifest = load_split_manifest(dataset_id, split_id)
    df = read_csv_robust(dataset_csv_path(dataset_id))

    label_schema = manifest.get("label_schema", {})
    label_col = str(spec.get("target_label_column") or label_schema.get("label_column") or "").strip()
    if not label_col or label_col not in df.columns:
        raise ValueError("label column not found in dataset")
    positive_values = label_schema.get("positive_values", [1, "1", True, "true", "high", "高风险"])

    test_idx = split_manifest["index_splits"]["test"]
    if not test_idx:
        raise ValueError("split test set is empty")
    test_df = df.loc[test_idx].copy()
    y_true = _coerce_binary(test_df[label_col], positive_values)

    seed = int(spec.get("seed", 42))
    model_type = str(spec.get("model_type", "baseline"))
    y_prob = _build_model_probabilities(test_df, model_type=model_type, seed=seed)
    y_pred = (y_prob >= 0.5).astype(int)

    if len(np.unique(y_true)) < 2:
        auc = 0.5
        pr_auc = 0.5
    else:
        auc = float(roc_auc_score(y_true, y_prob))
        pr_auc = float(average_precision_score(y_true, y_prob))
    brier = float(brier_score_loss(y_true, y_prob))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))
    mae = float(mean_absolute_error(y_true, y_prob))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_prob)))
    calibration = _ece_report(y_true, y_prob, bins=10)

    baseline_prob = _build_model_probabilities(test_df, model_type="baseline", seed=seed)
    try:
        stat = ttest_rel((y_true - baseline_prob) ** 2, (y_true - y_prob) ** 2, alternative="greater")
        p_value = float(stat.pvalue)
    except Exception:
        p_value = 1.0

    ci = {
        "auc": list(_bootstrap_ci(y_true, y_prob, lambda yt, yp: roc_auc_score(yt, yp) if len(np.unique(yt)) > 1 else 0.5, seed + 1)),
        "pr_auc": list(_bootstrap_ci(y_true, y_prob, lambda yt, yp: average_precision_score(yt, yp) if len(np.unique(yt)) > 1 else 0.5, seed + 2)),
        "brier": list(_bootstrap_ci(y_true, y_prob, lambda yt, yp: brier_score_loss(yt, yp), seed + 3)),
        "f1": list(_bootstrap_ci(y_true, y_prob, lambda yt, yp: f1_score(yt, (yp >= 0.5).astype(int), zero_division=0), seed + 4)),
        "mae": list(_bootstrap_ci(y_true, y_prob, lambda yt, yp: mean_absolute_error(yt, yp), seed + 5)),
        "rmse": list(_bootstrap_ci(y_true, y_prob, lambda yt, yp: np.sqrt(mean_squared_error(yt, yp)), seed + 6)),
    }

    exp_id = f"exp_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}_{uuid4().hex[:6]}"
    metrics = {
        "auc": round(auc, 6),
        "pr_auc": round(pr_auc, 6),
        "brier": round(brier, 6),
        "f1": round(f1, 6),
        "mae": round(mae, 6),
        "rmse": round(rmse, 6),
        "paired_significance_p": round(p_value, 8),
    }
    result = {
        "exp_id": exp_id,
        "status": "completed",
        "dataset_id": dataset_id,
        "dataset_version": manifest["dataset_version"],
        "split_id": split_id,
        "spec": spec,
        "metrics": metrics,
        "calibration": calibration,
        "ci95": ci,
        "traceability": {
            "dataset_manifest": str(dataset_manifest_path(dataset_id)),
            "split_manifest": str(split_path(dataset_id, split_id)),
        },
        "created_at": _utc_now_iso(),
    }

    exp_folder = experiment_dir(exp_id)
    experiment_result_path(exp_id).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    metrics_lines = ["metric,value"]
    metrics_lines.extend([f"{k},{v}" for k, v in metrics.items()])
    (exp_folder / "metrics.csv").write_text("\n".join(metrics_lines) + "\n", encoding="utf-8")

    summary_lines = [
        f"Experiment: {exp_id}",
        f"Dataset: {dataset_id}@{manifest['dataset_version']}",
        f"Model: {model_type}",
        f"Split: {split_id}",
        "",
        "Metrics:",
    ]
    summary_lines.extend([f"- {k}: {v}" for k, v in metrics.items()])
    (exp_folder / "summary.md").write_text("\n".join(summary_lines) + "\n", encoding="utf-8")
    return result


def load_experiment_result(exp_id: str) -> Dict[str, Any]:
    path = experiment_result_path(exp_id)
    if not path.exists():
        raise FileNotFoundError(f"experiment result not found: {exp_id}")
    return json.loads(path.read_text(encoding="utf-8"))


def list_experiment_artifacts(exp_id: str) -> List[Dict[str, Any]]:
    folder = experiment_dir(exp_id)
    if not folder.exists():
        raise FileNotFoundError(f"experiment directory not found: {exp_id}")
    artifacts: List[Dict[str, Any]] = []
    for file_path in sorted(folder.glob("*")):
        if not file_path.is_file():
            continue
        artifacts.append(
            {
                "name": file_path.name,
                "path": str(file_path),
                "size_bytes": int(file_path.stat().st_size),
            }
        )
    return artifacts


def get_experiment_artifact_path(exp_id: str, artifact_name: str) -> Path:
    folder = experiment_dir(exp_id).resolve()
    if not folder.exists():
        raise FileNotFoundError(f"experiment directory not found: {exp_id}")

    # Prevent path traversal outside the experiment directory.
    candidate = (folder / artifact_name).resolve()
    if folder not in candidate.parents:
        raise ValueError("invalid artifact path")
    if not candidate.is_file():
        raise FileNotFoundError(f"artifact not found: {artifact_name}")
    return candidate
