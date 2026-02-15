from __future__ import annotations

import importlib
import sys
from pathlib import Path


def test_geomodel_integration_module_importable():
    """Regression test: geomodel integration route must be importable."""
    backend_root = Path(__file__).resolve().parents[1]
    if str(backend_root) not in sys.path:
        sys.path.insert(0, str(backend_root))
    module = importlib.import_module("app.routes.geomodel_integration")
    assert hasattr(module, "router")


def test_main_module_importable():
    """Regression test: backend app main module should import successfully."""
    backend_root = Path(__file__).resolve().parents[1]
    if str(backend_root) not in sys.path:
        sys.path.insert(0, str(backend_root))
    module = importlib.import_module("app.main")
    assert hasattr(module, "app")
