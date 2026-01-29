from __future__ import annotations

from pathlib import Path
from typing import Dict

import pandas as pd

from app.services.csv_loader import analyze_csv_file, read_csv_robust


def fix_csv_encoding(path: Path) -> Dict:
    info_before = analyze_csv_file(path)
    try:
        df = read_csv_robust(path)
        df.to_csv(path, index=False, encoding="utf-8")
        status = "ok"
        error = None
    except Exception as exc:
        status = "failed"
        error = str(exc)

    info_after = analyze_csv_file(path)
    return {
        "file": path.name,
        "status": status,
        "error": error,
        "before": info_before,
        "after": info_after,
    }