from __future__ import annotations

from pathlib import Path
import os


def get_data_dir() -> Path:
    env = os.getenv("DATA_DIR")
    if env:
        return Path(env).resolve()
    return (Path(__file__).resolve().parents[2] / "data").resolve()
