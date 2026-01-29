from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import csv

import pandas as pd

try:
    import chardet
except Exception:  # pragma: no cover
    chardet = None

COMMON_ENCODINGS = [
    "utf-8",
    "utf-8-sig",
    "gbk",
    "gb2312",
    "cp936",
    "latin1",
]

COMMON_DELIMITERS = [",", ";", "\t", "|"]


def _detect_encoding(raw: bytes) -> Optional[str]:
    if chardet is not None:
        result = chardet.detect(raw)
        if result and result.get("confidence", 0) >= 0.6:
            return result.get("encoding")
    for enc in COMMON_ENCODINGS:
        try:
            raw.decode(enc)
            return enc
        except Exception:
            continue
    return None


def _detect_delimiter(sample_text: str) -> Optional[str]:
    try:
        return csv.Sniffer().sniff(sample_text).delimiter
    except Exception:
        return None


def analyze_csv_file(path: Path) -> Dict:
    raw = path.read_bytes()[:100_000]
    encoding = _detect_encoding(raw) or "unknown"
    try:
        sample_text = raw.decode(encoding if encoding != "unknown" else "utf-8", errors="ignore")
    except Exception:
        sample_text = raw.decode("utf-8", errors="ignore")

    delimiter = _detect_delimiter(sample_text) or ","
    header = sample_text.splitlines()[0:1]

    return {
        "file": path.name,
        "encoding": encoding,
        "delimiter": delimiter,
        "header_preview": header[0] if header else "",
    }


def read_csv_robust(path: Path) -> pd.DataFrame:
    raw = path.read_bytes()
    encoding = _detect_encoding(raw)
    sample_text = raw[:100_000].decode(encoding or "utf-8", errors="ignore")
    delimiter = _detect_delimiter(sample_text) or ","

    tried = []
    encodings = [encoding] if encoding else []
    encodings.extend([e for e in COMMON_ENCODINGS if e not in encodings])

    for enc in encodings:
        for sep in [delimiter] + [d for d in COMMON_DELIMITERS if d != delimiter]:
            try:
                df = pd.read_csv(
                    path,
                    encoding=enc,
                    sep=sep,
                    engine="python",
                )
                if df.shape[1] >= 2:
                    return df
            except Exception as exc:
                tried.append(f"{enc}|{sep}: {exc}")
                continue

    raise ValueError(f"failed to read csv: {path.name}")
