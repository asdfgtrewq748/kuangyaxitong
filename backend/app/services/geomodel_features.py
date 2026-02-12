from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict

from app.services.geomodel_service import geomodel_service


DEFAULT_GEOMODEL_FEATURES = {
    "key_layer_span": 80.0,
    "layer_cv": 0.3,
    "pinchout_ratio": 0.0,
    "continuity_score": 0.5,
}


def _load_json(path: Path) -> Dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def extract_geomodel_features(job_id: str) -> Dict[str, Any]:
    """
    从 Geomodel 产物中提取 MPI geology-aware 所需特征。

    返回结构:
    {
      "values": {...},
      "source": {...},
      "quality_flags": [...]
    }
    """
    summary_path = geomodel_service.get_artifact_path(job_id, "summary.json")
    quality_path = geomodel_service.get_artifact_path(job_id, "quality_report.json")
    summary = _load_json(summary_path)
    quality = _load_json(quality_path)

    thickness_stats = summary.get("thickness_stats") or {}
    top_layers = summary.get("top_layers") or []

    key_layer_span = float(thickness_stats.get("max", 80.0))
    if top_layers:
        top_mean = top_layers[0].get("mean_thickness")
        if isinstance(top_mean, (int, float)):
            key_layer_span = max(key_layer_span, float(top_mean) * 10.0)

    layer_cv = float(quality.get("layer_cv", 0.3))
    pinchout_ratio = float(quality.get("pinchout_ratio", 0.0))
    continuity_score = float(quality.get("continuity_score", 0.5))

    values = {
        "key_layer_span": key_layer_span,
        "layer_cv": layer_cv,
        "pinchout_ratio": pinchout_ratio,
        "continuity_score": continuity_score,
    }

    quality_flags = []
    warning_flags = quality.get("warning_flags") or {}
    if warning_flags.get("low_continuity"):
        quality_flags.append("low_continuity")
    if warning_flags.get("high_pinchout"):
        quality_flags.append("high_pinchout")
    if warning_flags.get("high_variability"):
        quality_flags.append("high_variability")

    return {
        "values": values,
        "source": {
            "job_id": job_id,
            "summary_file": str(summary_path),
            "quality_file": str(quality_path),
        },
        "quality_flags": quality_flags,
    }
