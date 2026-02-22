from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import shutil
import sys
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.model_selection import KFold, StratifiedKFold, train_test_split


REPO_ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIR = REPO_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
os.environ.setdefault("DATA_DIR", str(REPO_ROOT / "data"))

from app.services.research_manager import create_split_manifest, register_dataset_manifest  # noqa: E402


REQUIRED_COLUMNS = [
    "sample_id",
    "borehole_name",
    "event_time",
    "x",
    "y",
    "label",
]


def _to_int_list(values: np.ndarray) -> List[int]:
    return [int(v) for v in values.tolist()]


def _load_dataset(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path, encoding="utf-8")
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        raise ValueError(f"dataset missing required columns: {missing}")
    return df.reset_index(drop=True)


def _spatial_strata(df: pd.DataFrame, bins: int = 2) -> pd.Series:
    x_bin = pd.qcut(df["x"], q=min(bins, len(df)), labels=False, duplicates="drop")
    y_bin = pd.qcut(df["y"], q=min(bins, len(df)), labels=False, duplicates="drop")
    x_bin = x_bin.fillna(0).astype(int)
    y_bin = y_bin.fillna(0).astype(int)
    label = df["label"].fillna(0).astype(int)
    return (x_bin.astype(str) + "_" + y_bin.astype(str) + "_" + label.astype(str))


def _choose_strata(df: pd.DataFrame, n_splits: int) -> Tuple[Optional[pd.Series], str]:
    x_bin = pd.qcut(df["x"], q=min(2, len(df)), labels=False, duplicates="drop").fillna(0).astype(int)
    y_bin = pd.qcut(df["y"], q=min(2, len(df)), labels=False, duplicates="drop").fillna(0).astype(int)
    label = df["label"].fillna(0).astype(int)

    candidates: List[Tuple[str, pd.Series]] = [
        ("spatial_xy_label", x_bin.astype(str) + "_" + y_bin.astype(str) + "_" + label.astype(str)),
        ("spatial_x_label", x_bin.astype(str) + "_" + label.astype(str)),
        ("spatial_y_label", y_bin.astype(str) + "_" + label.astype(str)),
        ("label_only", label.astype(str)),
    ]
    for name, series in candidates:
        counts = series.value_counts()
        if len(counts) >= 2 and int(counts.min()) >= int(n_splits):
            return series, name
    return None, "kfold_fallback"


def _safe_time_range(df: pd.DataFrame, idx: List[int]) -> Dict[str, str]:
    if not idx:
        return {"start": "", "end": ""}
    col = pd.to_datetime(df.loc[idx, "event_time"], errors="coerce")
    col = col.dropna()
    if col.empty:
        return {"start": "", "end": ""}
    return {"start": col.min().isoformat(), "end": col.max().isoformat()}


def _intersection_count(a: List[Any], b: List[Any]) -> int:
    return int(len(set(a) & set(b)))


def _section_audit(df: pd.DataFrame, idx: List[int]) -> Dict[str, Any]:
    section = df.loc[idx]
    return {
        "count": int(len(idx)),
        "sample_ids": [int(v) for v in section["sample_id"].tolist()],
        "boreholes": sorted({str(v) for v in section["borehole_name"].astype(str).tolist()}),
        "time_range": _safe_time_range(df, idx),
        "label_counts": {
            str(k): int(v)
            for k, v in section["label"].value_counts().sort_index().to_dict().items()
        },
    }


def _fold_audit(df: pd.DataFrame, train_idx: List[int], val_idx: List[int], test_idx: List[int]) -> Dict[str, Any]:
    train_sec = _section_audit(df, train_idx)
    val_sec = _section_audit(df, val_idx)
    test_sec = _section_audit(df, test_idx)

    overlap = {
        "sample_train_val": _intersection_count(train_sec["sample_ids"], val_sec["sample_ids"]),
        "sample_train_test": _intersection_count(train_sec["sample_ids"], test_sec["sample_ids"]),
        "sample_val_test": _intersection_count(val_sec["sample_ids"], test_sec["sample_ids"]),
        "borehole_train_val": _intersection_count(train_sec["boreholes"], val_sec["boreholes"]),
        "borehole_train_test": _intersection_count(train_sec["boreholes"], test_sec["boreholes"]),
        "borehole_val_test": _intersection_count(val_sec["boreholes"], test_sec["boreholes"]),
        "time_train_val": _intersection_count(
            [str(v) for v in df.loc[train_idx, "event_time"].tolist()],
            [str(v) for v in df.loc[val_idx, "event_time"].tolist()],
        ),
        "time_train_test": _intersection_count(
            [str(v) for v in df.loc[train_idx, "event_time"].tolist()],
            [str(v) for v in df.loc[test_idx, "event_time"].tolist()],
        ),
        "time_val_test": _intersection_count(
            [str(v) for v in df.loc[val_idx, "event_time"].tolist()],
            [str(v) for v in df.loc[test_idx, "event_time"].tolist()],
        ),
    }
    return {
        "train": train_sec,
        "val": val_sec,
        "test": test_sec,
        "overlap": overlap,
    }


def _build_kfold_splits(
    df: pd.DataFrame,
    n_splits: int,
    seed: int,
    val_ratio_total: float,
) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    n = len(df)
    indices = np.arange(n, dtype=int)
    strata, strata_mode = _choose_strata(df, n_splits=n_splits)
    if strata is not None:
        splitter = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=seed)
        fold_iter = splitter.split(indices, strata)
        split_strategy = f"stratified_kfold:{strata_mode}"
    else:
        splitter = KFold(n_splits=n_splits, shuffle=True, random_state=seed)
        fold_iter = splitter.split(indices)
        split_strategy = strata_mode

    val_ratio_within_train = float(val_ratio_total / max(1e-9, 1.0 - (1.0 / n_splits)))
    folds: List[Dict[str, Any]] = []
    fold_audits: List[Dict[str, Any]] = []

    for fold_id, (train_val_idx, test_idx) in enumerate(fold_iter, start=1):
        tv = np.asarray(train_val_idx, dtype=int)
        te = np.asarray(test_idx, dtype=int)

        tv_labels = df.loc[tv, "label"].astype(int).to_numpy()
        stratify_arg = tv_labels if len(np.unique(tv_labels)) >= 2 else None
        try:
            train_idx, val_idx = train_test_split(
                tv,
                test_size=val_ratio_within_train,
                random_state=seed + fold_id,
                shuffle=True,
                stratify=stratify_arg,
            )
        except Exception:
            cut = max(1, int(round(len(tv) * (1 - val_ratio_within_train))))
            train_idx = tv[:cut]
            val_idx = tv[cut:]
            if len(val_idx) == 0:
                val_idx = tv[-1:]
                train_idx = tv[:-1]

        train_list = _to_int_list(np.sort(train_idx))
        val_list = _to_int_list(np.sort(val_idx))
        test_list = _to_int_list(np.sort(te))

        fold = {
            "fold": fold_id,
            "train_idx": train_list,
            "val_idx": val_list,
            "test_idx": test_list,
            "train_row_keys": [str(df.loc[i, "sample_id"]) for i in train_list],
            "val_row_keys": [str(df.loc[i, "sample_id"]) for i in val_list],
            "test_row_keys": [str(df.loc[i, "sample_id"]) for i in test_list],
        }
        folds.append(fold)
        fold_audits.append(_fold_audit(df, train_list, val_list, test_list))

    summary = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "strategy": split_strategy,
        "n_splits": int(n_splits),
        "seed": int(seed),
        "row_count": int(n),
        "fold_audits": fold_audits,
    }
    return folds, summary


def _build_leave_one_out(df: pd.DataFrame) -> Dict[str, Any]:
    n = len(df)
    folds: List[Dict[str, Any]] = []
    for i in range(n):
        test_idx = [i]
        train_idx = [j for j in range(n) if j != i]
        folds.append(
            {
                "fold": i + 1,
                "train_idx": train_idx,
                "test_idx": test_idx,
                "train_row_keys": [str(df.loc[j, "sample_id"]) for j in train_idx],
                "test_row_keys": [str(df.loc[j, "sample_id"]) for j in test_idx],
            }
        )
    return {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "strategy": "leave_one_out",
        "row_count": int(n),
        "folds": folds,
    }


def _write_json(path: Path, payload: Dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def _aggregate_leakage(kfold_summary: Dict[str, Any]) -> Dict[str, Any]:
    overlap_max: Dict[str, int] = {}
    overlap_sum: Dict[str, int] = {}
    audits = kfold_summary.get("fold_audits", [])
    if not audits:
        return {"max_overlap": {}, "sum_overlap": {}, "all_overlap_zero": True}
    keys = list(audits[0].get("overlap", {}).keys())
    for key in keys:
        vals = [int(a["overlap"].get(key, 0)) for a in audits]
        overlap_max[key] = max(vals)
        overlap_sum[key] = int(sum(vals))
    all_zero = all(v == 0 for v in overlap_max.values())
    return {
        "max_overlap": overlap_max,
        "sum_overlap": overlap_sum,
        "all_overlap_zero": bool(all_zero),
    }


def _write_audit_markdown(path: Path, kfold_summary: Dict[str, Any], aggregate: Dict[str, Any]) -> None:
    lines = [
        "# Split Leakage Audit",
        "",
        f"- generated_at_utc: {kfold_summary.get('generated_at_utc', '')}",
        f"- strategy: {kfold_summary.get('strategy', '')}",
        f"- n_splits: {kfold_summary.get('n_splits', 0)}",
        f"- all_overlap_zero: {aggregate.get('all_overlap_zero', False)}",
        "",
        "## Max Overlap",
    ]
    for key, value in sorted((aggregate.get("max_overlap") or {}).items()):
        lines.append(f"- {key}: {value}")
    lines.extend(["", "## Per Fold"])
    for fold_item in kfold_summary.get("fold_audits", []):
        idx = len(lines)
        _ = idx
        overlap = fold_item.get("overlap", {})
        lines.append(f"- fold overlap: {overlap}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def _register_to_research(clean_csv: Path, dataset_id: str) -> Dict[str, Any]:
    target_csv = REPO_ROOT / "data" / f"{dataset_id}.csv"
    shutil.copy2(clean_csv, target_csv)
    manifest = register_dataset_manifest(
        dataset_id=dataset_id,
        label_schema={
            "label_column": "label",
            "positive_values": [1, "1", True],
            "event_definition": "target_coal_thickness_above_median",
            "time_window_hours": 24,
            "notes": "generated by create_experiment_splits.py",
        },
        description="Cleaned 28-borehole experiment dataset",
    )
    split_manifest = create_split_manifest(
        dataset_id=dataset_id,
        strategy="time_borehole_block",
        train_ratio=0.7,
        val_ratio=0.15,
        test_ratio=0.15,
        seed=42,
        time_column="event_time",
        borehole_column="borehole_name",
    )
    return {
        "dataset_csv": str(target_csv),
        "dataset_manifest": manifest,
        "default_split_manifest": split_manifest,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create reproducible experiment splits and leakage audit.")
    parser.add_argument(
        "--input-csv",
        type=Path,
        default=REPO_ROOT / "data" / "experiments" / "cleaned" / "boreholes_28_cleaned.csv",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=REPO_ROOT / "data" / "experiments" / "splits",
    )
    parser.add_argument("--n-splits", type=int, default=5)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--val-ratio", type=float, default=0.15)
    parser.add_argument(
        "--register-research-dataset-id",
        type=str,
        default="",
        help="if set, copy cleaned csv to data/<dataset_id>.csv and register in research manifests",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    df = _load_dataset(args.input_csv)
    output_dir = args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    folds, kfold_summary = _build_kfold_splits(
        df,
        n_splits=args.n_splits,
        seed=args.seed,
        val_ratio_total=args.val_ratio,
    )
    kfold_payload = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "input_csv": str(args.input_csv),
        "strategy": kfold_summary["strategy"],
        "n_splits": args.n_splits,
        "seed": args.seed,
        "row_count": int(len(df)),
        "folds": folds,
    }
    kfold_path = output_dir / f"kfold_{args.n_splits}_spatial_seed{args.seed}.json"
    _write_json(kfold_path, kfold_payload)

    loo_payload = _build_leave_one_out(df)
    loo_path = output_dir / f"leave_one_out_seed{args.seed}.json"
    _write_json(loo_path, loo_payload)

    aggregate = _aggregate_leakage(kfold_summary)
    audit_payload = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "input_csv": str(args.input_csv),
        "kfold_summary": kfold_summary,
        "aggregate": aggregate,
    }
    audit_json_path = output_dir / "split_leakage_audit.json"
    _write_json(audit_json_path, audit_payload)
    _write_audit_markdown(output_dir / "split_leakage_audit.md", kfold_summary, aggregate)

    integration_result: Optional[Dict[str, Any]] = None
    if args.register_research_dataset_id.strip():
        integration_result = _register_to_research(args.input_csv, args.register_research_dataset_id.strip())
        _write_json(output_dir / "research_entry_integration.json", integration_result)

    print(
        f"[create_experiment_splits] kfold={kfold_path} loo={loo_path} "
        f"audit={audit_json_path}"
    )
    if integration_result:
        print(
            f"[create_experiment_splits] research_dataset={args.register_research_dataset_id.strip()} "
            f"manifest_ok=true"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
