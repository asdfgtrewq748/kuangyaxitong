from __future__ import annotations

import time
from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def _write_geomodel_dataset(base_dir: Path) -> None:
    (base_dir / "zuobiao.csv").write_text(
        "钻孔名,坐标x,坐标y\n"
        "BH01,100,100\n"
        "BH02,200,120\n"
        "BH03,120,240\n",
        encoding="utf-8",
    )
    (base_dir / "BH01.csv").write_text(
        "序号,名称,厚度/m\n"
        "1,细砂岩,10\n"
        "2,16-3煤,3.5\n"
        "3,泥岩,8\n",
        encoding="utf-8",
    )
    (base_dir / "BH02.csv").write_text(
        "序号,名称,厚度/m\n"
        "1,细砂岩,12\n"
        "2,16-3煤,3.2\n"
        "3,泥岩,7\n",
        encoding="utf-8",
    )
    (base_dir / "BH03.csv").write_text(
        "序号,名称,厚度/m\n"
        "1,细砂岩,11\n"
        "2,16-3煤,3.8\n"
        "3,泥岩,9\n",
        encoding="utf-8",
    )


def _wait_until_completed(job_id: str, timeout_sec: float = 10.0) -> dict:
    deadline = time.time() + timeout_sec
    last_payload = {}
    while time.time() < deadline:
        resp = client.get(f"/api/geomodel/jobs/{job_id}")
        assert resp.status_code == 200
        payload = resp.json()
        last_payload = payload
        if payload["status"] in {"completed", "failed"}:
            return payload
        time.sleep(0.1)
    return last_payload


def test_visualization_endpoint_reads_model_json(tmp_path, monkeypatch):
    _write_geomodel_dataset(tmp_path)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))

    create_resp = client.post(
        "/api/geomodel/jobs",
        json={
            "method": "thickness",
            "resolution": 20.0,
            "output_formats": ["vtk", "vtp", "summary", "quality"],
        },
    )
    assert create_resp.status_code == 200
    job_id = create_resp.json()["job_id"]

    status_data = _wait_until_completed(job_id)
    assert status_data["status"] == "completed"

    viz_resp = client.get(f"/api/geomodel-integration/visualization/{job_id}")
    assert viz_resp.status_code == 200
    payload = viz_resp.json()

    assert isinstance(payload.get("layers"), list)
    assert isinstance(payload.get("boreholes"), list)
    assert isinstance(payload.get("bounds"), dict)
    assert len(payload["layers"]) > 0
    assert len(payload["boreholes"]) > 0

    bounds = payload["bounds"]
    assert bounds["max_x"] > bounds["min_x"]
    assert bounds["max_y"] > bounds["min_y"]

    first_layer = payload["layers"][0]
    assert "name" in first_layer
    assert "mean_thickness" in first_layer
    assert first_layer.get("has_mesh") is True

    mesh_resp = client.get(f"/api/geomodel-integration/visualization/{job_id}", params={"include_mesh": True})
    assert mesh_resp.status_code == 200
    mesh_payload = mesh_resp.json()
    mesh_layer = mesh_payload["layers"][0]
    assert isinstance(mesh_layer.get("mesh"), dict)
    assert len(mesh_layer["mesh"].get("vertices") or []) > 0
    assert len(mesh_layer["mesh"].get("faces") or []) > 0


def test_stress_profile_endpoint_returns_normalized_profile(tmp_path, monkeypatch):
    _write_geomodel_dataset(tmp_path)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))

    create_resp = client.post(
        "/api/geomodel/jobs",
        json={
            "method": "thickness",
            "resolution": 20.0,
            "output_formats": ["vtk", "vtp", "summary", "quality"],
        },
    )
    assert create_resp.status_code == 200
    job_id = create_resp.json()["job_id"]

    status_data = _wait_until_completed(job_id)
    assert status_data["status"] == "completed"

    profile_resp = client.get(
        f"/api/geomodel-integration/stress-profile/{job_id}",
        params={"samples": 64, "focus": "balanced"},
    )
    assert profile_resp.status_code == 200
    payload = profile_resp.json()

    bins = payload.get("bins") or []
    weights = payload.get("weights") or []
    anchors = payload.get("anchors") or []

    assert payload.get("job_id") == job_id
    assert payload.get("algorithm") == "depth-transfer-v1"
    assert len(bins) == 64
    assert len(weights) == 64
    assert bins[0] == 0
    assert bins[-1] == 1
    assert all(0 <= float(value) <= 1 for value in weights)
    assert any(float(value) > 0.6 for value in weights)
    assert isinstance(anchors, list)
