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


def test_geomodel_job_lifecycle_and_artifacts(tmp_path, monkeypatch):
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
    create_data = create_resp.json()
    assert create_data["job_id"]
    assert create_data["status"] in {"pending", "running"}

    job_id = create_data["job_id"]
    status_data = _wait_until_completed(job_id)
    assert status_data["status"] == "completed"
    assert status_data["result_manifest"]["artifacts"]

    artifacts_resp = client.get(f"/api/geomodel/jobs/{job_id}/artifacts")
    assert artifacts_resp.status_code == 200
    artifacts_data = artifacts_resp.json()
    names = {item["name"] for item in artifacts_data["artifacts"]}
    assert "summary.json" in names
    assert "quality_report.json" in names
    assert "model.vtk" in names

    download_resp = client.get(f"/api/geomodel/jobs/{job_id}/artifacts/summary.json")
    assert download_resp.status_code == 200
    assert download_resp.content


def test_geomodel_job_invalid_method_returns_422(tmp_path, monkeypatch):
    _write_geomodel_dataset(tmp_path)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))

    resp = client.post(
        "/api/geomodel/jobs",
        json={
            "method": "unknown_method",
            "resolution": 20.0,
        },
    )
    assert resp.status_code == 422


def test_geomodel_job_not_found():
    resp = client.get("/api/geomodel/jobs/not_exists")
    assert resp.status_code == 404
