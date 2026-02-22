from __future__ import annotations

import argparse
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import sys
from typing import Any, Dict, Iterable, List, Optional, Tuple

import numpy as np
import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIR = REPO_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.csv_loader import read_csv_robust  # noqa: E402


COORD_NAME_CANDIDATES = [
    "borehole_name",
    "borehole",
    "hole",
    "name",
    "钻孔名",
    "钻孔",
]
COORD_X_CANDIDATES = ["x", "coord_x", "坐标x", "坐标X", "x坐标"]
COORD_Y_CANDIDATES = ["y", "coord_y", "坐标y", "坐标Y", "y坐标"]

LAYER_NAME_CANDIDATES = ["名称", "name", "岩性", "岩层", "layer", "lithology"]
THICKNESS_CANDIDATES = ["厚度/m", "厚度", "thickness", "thickness_m", "厚度(m)"]
ELASTIC_CANDIDATES = ["弹性模量/Gpa", "弹性模量", "elastic_modulus", "elastic_modulus_gpa"]
DENSITY_CANDIDATES = ["容重/kN*m-3", "容重", "density", "density_kn_m3"]
TENSILE_CANDIDATES = ["抗拉强度/MPa", "抗拉强度", "tensile_strength", "tensile_strength_mpa"]


@dataclass
class BoreholeParseResult:
    borehole_name: str
    row: Dict[str, Any]
    details: Dict[str, Any]


def _normalize_col(col: Any) -> str:
    return str(col).strip().lower().replace(" ", "")


def _pick_column(columns: Iterable[Any], candidates: List[str]) -> Optional[str]:
    col_map = {_normalize_col(c): str(c) for c in columns}
    for candidate in candidates:
        hit = col_map.get(_normalize_col(candidate))
        if hit:
            return hit
    for candidate in candidates:
        key = _normalize_col(candidate)
        for col_key, original in col_map.items():
            if key in col_key or col_key in key:
                return original
    return None


def _to_float(value: Any) -> float:
    try:
        if value is None or pd.isna(value):
            return float("nan")
        return float(value)
    except Exception:
        return float("nan")


def _is_coal_layer(name: str) -> bool:
    text = str(name or "").strip().lower()
    return ("煤" in text) or ("coal" in text)


def _contains_target_seam(name: str, target_seam: str) -> bool:
    if not target_seam:
        return False
    text = str(name or "").strip().lower()
    seam = target_seam.strip().lower()
    return seam in text


def _parse_borehole_file(path: Path, borehole_name: str, target_seam: str) -> BoreholeParseResult:
    df = read_csv_robust(path)
    name_col = _pick_column(df.columns, LAYER_NAME_CANDIDATES)
    thickness_col = _pick_column(df.columns, THICKNESS_CANDIDATES)
    elastic_col = _pick_column(df.columns, ELASTIC_CANDIDATES)
    density_col = _pick_column(df.columns, DENSITY_CANDIDATES)
    tensile_col = _pick_column(df.columns, TENSILE_CANDIDATES)

    if name_col is None or thickness_col is None:
        raise ValueError(f"required columns not found in {path.name}")

    work = pd.DataFrame()
    work["layer_name"] = df[name_col].astype(str).fillna("").str.strip()
    work["thickness_m"] = df[thickness_col].map(_to_float)
    work["elastic_modulus_gpa"] = df[elastic_col].map(_to_float) if elastic_col else np.nan
    work["density_kn_m3"] = df[density_col].map(_to_float) if density_col else np.nan
    work["tensile_strength_mpa"] = df[tensile_col].map(_to_float) if tensile_col else np.nan

    raw_rows = int(len(work))
    work = work[np.isfinite(work["thickness_m"]) & (work["thickness_m"] > 0)].copy()
    valid_rows = int(len(work))

    layer_count = int(valid_rows)
    coal_mask = work["layer_name"].map(_is_coal_layer)
    seam_mask = work["layer_name"].map(lambda x: _contains_target_seam(x, target_seam))

    coal_thickness = float(work.loc[coal_mask, "thickness_m"].sum()) if valid_rows else 0.0
    seam_thickness = float(work.loc[seam_mask, "thickness_m"].sum()) if valid_rows else 0.0
    max_single_coal_thickness = float(work.loc[coal_mask, "thickness_m"].max()) if coal_mask.any() else 0.0
    target_thickness = seam_thickness if seam_thickness > 0 else max_single_coal_thickness

    row = {
        "borehole_name": borehole_name,
        "layer_count": layer_count,
        "coal_layer_count": int(coal_mask.sum()),
        "total_strata_thickness_m": float(work["thickness_m"].sum()) if valid_rows else 0.0,
        "total_coal_thickness_m": coal_thickness,
        "target_coal_thickness_m": target_thickness,
        "target_seam_thickness_m": seam_thickness,
        "mean_layer_thickness_m": float(work["thickness_m"].mean()) if valid_rows else float("nan"),
        "std_layer_thickness_m": float(work["thickness_m"].std(ddof=0)) if valid_rows else float("nan"),
        "mean_elastic_modulus_gpa": float(work["elastic_modulus_gpa"].mean()) if valid_rows else float("nan"),
        "mean_density_kn_m3": float(work["density_kn_m3"].mean()) if valid_rows else float("nan"),
        "mean_tensile_strength_mpa": float(work["tensile_strength_mpa"].mean()) if valid_rows else float("nan"),
    }
    details = {
        "source_file": path.name,
        "raw_rows": raw_rows,
        "valid_rows": valid_rows,
        "dropped_rows": raw_rows - valid_rows,
        "seam_hit_rows": int(seam_mask.sum()) if valid_rows else 0,
    }
    return BoreholeParseResult(borehole_name=borehole_name, row=row, details=details)


def _impute_missing(df: pd.DataFrame, numeric_cols: List[str]) -> Dict[str, Dict[str, float]]:
    report: Dict[str, Dict[str, float]] = {}
    for col in numeric_cols:
        missing_before = int(df[col].isna().sum())
        median_value = float(df[col].median()) if missing_before < len(df) else 0.0
        if not np.isfinite(median_value):
            median_value = 0.0
        df[col] = df[col].fillna(median_value)
        report[col] = {
            "missing_before": float(missing_before),
            "missing_after": float(df[col].isna().sum()),
            "median_fill_value": float(median_value),
        }
    return report


def _clip_outliers_iqr(df: pd.DataFrame, numeric_cols: List[str]) -> Dict[str, Dict[str, float]]:
    report: Dict[str, Dict[str, float]] = {}
    for col in numeric_cols:
        values = df[col].astype(float)
        q1 = float(values.quantile(0.25))
        q3 = float(values.quantile(0.75))
        iqr = q3 - q1
        if not np.isfinite(iqr) or iqr <= 0:
            report[col] = {
                "q1": q1,
                "q3": q3,
                "iqr": iqr,
                "lower_bound": q1,
                "upper_bound": q3,
                "outlier_count_before": 0.0,
                "clipped_count": 0.0,
            }
            continue
        lo = q1 - 1.5 * iqr
        hi = q3 + 1.5 * iqr
        low_mask = values < lo
        high_mask = values > hi
        outlier_count = int((low_mask | high_mask).sum())
        df[col] = values.clip(lower=lo, upper=hi)
        report[col] = {
            "q1": q1,
            "q3": q3,
            "iqr": iqr,
            "lower_bound": float(lo),
            "upper_bound": float(hi),
            "outlier_count_before": float(outlier_count),
            "clipped_count": float(outlier_count),
        }
    return report


def _serialize_for_json(value: Any) -> Any:
    if isinstance(value, dict):
        return {str(k): _serialize_for_json(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_serialize_for_json(v) for v in value]
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, (np.ndarray,)):
        return value.tolist()
    if isinstance(value, float) and (np.isnan(value) or np.isinf(value)):
        return None
    return value


def build_clean_dataset(
    data_dir: Path,
    coord_file: Path,
    target_seam: str,
    output_csv: Path,
    output_report_json: Path,
    output_report_md: Path,
) -> Dict[str, Any]:
    coords_df = read_csv_robust(coord_file)
    name_col = _pick_column(coords_df.columns, COORD_NAME_CANDIDATES)
    x_col = _pick_column(coords_df.columns, COORD_X_CANDIDATES)
    y_col = _pick_column(coords_df.columns, COORD_Y_CANDIDATES)
    if name_col is None or x_col is None or y_col is None:
        raise ValueError("coordinate file missing required columns (name/x/y)")

    coords = coords_df[[name_col, x_col, y_col]].copy()
    coords.columns = ["borehole_name", "x", "y"]
    coords["borehole_name"] = coords["borehole_name"].astype(str).str.strip()
    coords["x"] = coords["x"].map(_to_float)
    coords["y"] = coords["y"].map(_to_float)
    coords = coords.dropna(subset=["borehole_name"]).drop_duplicates(subset=["borehole_name"])

    parse_details: List[Dict[str, Any]] = []
    rows: List[Dict[str, Any]] = []
    missing_files: List[str] = []
    parse_errors: List[Dict[str, str]] = []

    for _, item in coords.iterrows():
        name = str(item["borehole_name"])
        file_path = data_dir / f"{name}.csv"
        if not file_path.exists():
            missing_files.append(file_path.name)
            continue
        try:
            parsed = _parse_borehole_file(file_path, name, target_seam=target_seam)
        except Exception as exc:
            parse_errors.append({"file": file_path.name, "error": str(exc)})
            continue
        row = {
            "borehole_name": name,
            "x": float(item["x"]),
            "y": float(item["y"]),
            **parsed.row,
        }
        rows.append(row)
        parse_details.append(parsed.details)

    clean_df = pd.DataFrame(rows)
    if clean_df.empty:
        raise ValueError("no borehole records parsed; cannot build cleaned dataset")

    numeric_cols = [c for c in clean_df.columns if c not in {"borehole_name"}]
    clean_df = clean_df.replace([np.inf, -np.inf], np.nan)
    missing_before = {c: int(clean_df[c].isna().sum()) for c in clean_df.columns}
    impute_report = _impute_missing(clean_df, numeric_cols=numeric_cols)
    outlier_report = _clip_outliers_iqr(
        clean_df,
        numeric_cols=[c for c in numeric_cols if c not in {"x", "y"}],
    )

    clean_df["sample_id"] = np.arange(1, len(clean_df) + 1, dtype=int)
    base_time = datetime(2025, 1, 1, tzinfo=timezone.utc)
    clean_df["event_time"] = [
        (base_time + timedelta(days=i)).isoformat().replace("+00:00", "Z")
        for i in range(len(clean_df))
    ]
    median_target = float(clean_df["target_coal_thickness_m"].median())
    clean_df["label"] = (clean_df["target_coal_thickness_m"] >= median_target).astype(int)

    ordered_columns = [
        "sample_id",
        "borehole_name",
        "event_time",
        "x",
        "y",
        "target_coal_thickness_m",
        "target_seam_thickness_m",
        "total_coal_thickness_m",
        "total_strata_thickness_m",
        "layer_count",
        "coal_layer_count",
        "mean_layer_thickness_m",
        "std_layer_thickness_m",
        "mean_elastic_modulus_gpa",
        "mean_density_kn_m3",
        "mean_tensile_strength_mpa",
        "label",
    ]
    clean_df = clean_df[ordered_columns].sort_values("borehole_name").reset_index(drop=True)

    output_csv.parent.mkdir(parents=True, exist_ok=True)
    output_report_json.parent.mkdir(parents=True, exist_ok=True)
    clean_df.to_csv(output_csv, index=False, encoding="utf-8")

    missing_after = {c: int(clean_df[c].isna().sum()) for c in clean_df.columns}
    report = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "target_seam": target_seam,
        "input": {
            "data_dir": str(data_dir),
            "coord_file": str(coord_file),
            "coordinate_rows": int(len(coords)),
            "parsed_rows": int(len(parse_details)),
            "missing_files": missing_files,
            "parse_errors": parse_errors,
        },
        "output": {
            "clean_csv": str(output_csv),
            "row_count": int(len(clean_df)),
            "column_count": int(len(clean_df.columns)),
            "columns": list(clean_df.columns),
        },
        "data_quality": {
            "missing_before": missing_before,
            "missing_after": missing_after,
            "imputation": impute_report,
            "outlier_clipping": outlier_report,
            "label_distribution": clean_df["label"].value_counts().to_dict(),
            "target_thickness_stats": {
                "min": float(clean_df["target_coal_thickness_m"].min()),
                "max": float(clean_df["target_coal_thickness_m"].max()),
                "mean": float(clean_df["target_coal_thickness_m"].mean()),
                "median": float(clean_df["target_coal_thickness_m"].median()),
            },
        },
        "per_borehole_parse": parse_details,
    }

    output_report_json.write_text(
        json.dumps(_serialize_for_json(report), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    md_lines = [
        "# Experiment Data Preparation Report",
        "",
        f"- generated_at_utc: {report['generated_at_utc']}",
        f"- target_seam: {target_seam}",
        f"- coordinate_rows: {report['input']['coordinate_rows']}",
        f"- parsed_rows: {report['input']['parsed_rows']}",
        f"- output_csv: `{output_csv}`",
        f"- output_rows: {report['output']['row_count']}",
        "",
        "## Label Distribution",
    ]
    for k, v in sorted(report["data_quality"]["label_distribution"].items()):
        md_lines.append(f"- label={k}: {v}")
    md_lines.extend(
        [
            "",
            "## Target Thickness Stats",
            f"- min: {report['data_quality']['target_thickness_stats']['min']:.4f}",
            f"- max: {report['data_quality']['target_thickness_stats']['max']:.4f}",
            f"- mean: {report['data_quality']['target_thickness_stats']['mean']:.4f}",
            f"- median: {report['data_quality']['target_thickness_stats']['median']:.4f}",
            "",
            "## Missing Files",
        ]
    )
    if missing_files:
        for name in missing_files:
            md_lines.append(f"- {name}")
    else:
        md_lines.append("- none")

    output_report_md.write_text("\n".join(md_lines) + "\n", encoding="utf-8")
    return report


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Prepare cleaned experiment dataset from borehole CSV files.")
    parser.add_argument("--data-dir", type=Path, default=REPO_ROOT / "data")
    parser.add_argument("--coord-file", type=Path, default=REPO_ROOT / "data" / "zuobiao.csv")
    parser.add_argument("--target-seam", type=str, default="16-3")
    parser.add_argument(
        "--output-csv",
        type=Path,
        default=REPO_ROOT / "data" / "experiments" / "cleaned" / "boreholes_28_cleaned.csv",
    )
    parser.add_argument(
        "--output-report-json",
        type=Path,
        default=REPO_ROOT / "data" / "experiments" / "cleaned" / "boreholes_28_quality_report.json",
    )
    parser.add_argument(
        "--output-report-md",
        type=Path,
        default=REPO_ROOT / "data" / "experiments" / "cleaned" / "boreholes_28_quality_report.md",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    report = build_clean_dataset(
        data_dir=args.data_dir,
        coord_file=args.coord_file,
        target_seam=args.target_seam,
        output_csv=args.output_csv,
        output_report_json=args.output_report_json,
        output_report_md=args.output_report_md,
    )
    print(
        f"[prepare_experiment_data] rows={report['output']['row_count']} "
        f"output={report['output']['clean_csv']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
