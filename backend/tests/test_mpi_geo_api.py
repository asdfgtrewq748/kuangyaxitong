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


def _build_point_payload() -> dict:
    return {
        "x": 100.0,
        "y": 120.0,
        "borehole": "BH01",
        "thickness": 3.5,
        "burial_depth": 420.0,
        "z_top": 420.0,
        "z_bottom": 423.5,
        "strata": [
            {
                "name": "细砂岩",
                "thickness": 10.0,
                "elastic_modulus": 20.0,
                "compressive_strength": 60.0,
                "tensile_strength": 3.0,
                "friction_angle": 30.0,
            },
            {
                "name": "泥岩",
                "thickness": 8.0,
                "elastic_modulus": 10.0,
                "compressive_strength": 25.0,
                "tensile_strength": 1.2,
                "friction_angle": 26.0,
            },
        ],
    }


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


def test_calculate_geo_fallback_to_baseline_when_no_job():
    payload = {"point": _build_point_payload()}
    resp = client.post("/api/mpi/calculate-geo", json=payload)
    assert resp.status_code == 200

    data = resp.json()
    assert data["fallback_used"] is True
    assert data["algorithm_mode"] == "baseline_fallback"
    assert abs(data["geology_aware"]["mpi"] - data["baseline"]["mpi"]) < 1e-6


def test_calculate_geo_uses_geomodel_features(tmp_path, monkeypatch):
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

    payload = {
        "point": _build_point_payload(),
        "geomodel_job_id": job_id,
        "include_baseline": True,
    }
    resp = client.post("/api/mpi/calculate-geo", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["fallback_used"] is False
    assert data["algorithm_mode"] == "geology_aware_v1"
    assert data["feature_trace"]["source"]["job_id"] == job_id
    assert "key_layer_span" in data["feature_trace"]["values"]
    assert "continuity_score" in data["feature_trace"]["values"]


def test_calculate_geo_invalid_job_id_graceful_fallback():
    payload = {
        "point": _build_point_payload(),
        "geomodel_job_id": "not_exists",
        "include_baseline": True,
    }
    resp = client.post("/api/mpi/calculate-geo", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["fallback_used"] is True
    assert data["feature_trace"]["source"]["mode"] == "fallback_default"


def _build_points_payload() -> list[dict]:
    base = _build_point_payload()
    p1 = {**base, "x": 100.0, "y": 100.0, "borehole": "BH01"}
    p2 = {**base, "x": 200.0, "y": 120.0, "borehole": "BH02"}
    p3 = {**base, "x": 120.0, "y": 240.0, "borehole": "BH03"}
    return [p1, p2, p3]


def test_interpolate_geo_uses_geomodel_features(tmp_path, monkeypatch):
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

    resp = client.post(
        "/api/mpi/interpolate-geo",
        json={
            "points": _build_points_payload(),
            "resolution": 30,
            "method": "idw",
            "geomodel_job_id": job_id,
            "include_baseline_grid": True,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["fallback_used"] is False
    assert data["algorithm_mode"] == "geology_aware_v1"
    assert len(data["geology_aware_grid"]) == 30
    assert len(data["geology_aware_grid"][0]) == 30
    assert data["baseline_grid"] is not None
    assert data["feature_trace"]["source"]["job_id"] == job_id


def test_interpolate_geo_invalid_job_id_fallback():
    resp = client.post(
        "/api/mpi/interpolate-geo",
        json={
            "points": _build_points_payload(),
            "resolution": 25,
            "method": "idw",
            "geomodel_job_id": "not_exists",
            "include_baseline_grid": True,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["fallback_used"] is True
    assert data["algorithm_mode"] == "baseline_fallback"
    assert data["feature_trace"]["source"]["mode"] == "fallback_default"


def test_interpolate_geo_returns_component_grids_when_enabled():
    resolution = 24
    resp = client.post(
        "/api/mpi/interpolate-geo",
        json={
            "points": _build_points_payload(),
            "resolution": resolution,
            "method": "idw",
            "geomodel_job_id": "not_exists",
            "include_baseline_grid": True,
            "include_component_grids": True,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["fallback_used"] is True
    assert data["algorithm_mode"] == "baseline_fallback"

    component_grids = data.get("component_grids")
    assert isinstance(component_grids, dict)

    for mode_key in ("baseline", "geology_aware", "delta"):
        mode_payload = component_grids.get(mode_key)
        assert isinstance(mode_payload, dict)
        for metric_key in ("mpi", "rsi", "bri", "asi"):
            grid = mode_payload.get(metric_key)
            assert isinstance(grid, list)
            assert len(grid) == resolution
            assert len(grid[0]) == resolution

    component_statistics = data.get("component_statistics")
    assert isinstance(component_statistics, dict)
    for mode_key in ("baseline", "geology_aware", "delta"):
        mode_stats = component_statistics.get(mode_key)
        assert isinstance(mode_stats, dict)
        for metric_key in ("mpi", "rsi", "bri", "asi"):
            stats = mode_stats.get(metric_key)
            assert isinstance(stats, dict)
            assert {"min", "max", "mean", "std"}.issubset(set(stats.keys()))

    delta_mpi = component_grids["delta"]["mpi"]
    delta_abs_max = max(abs(float(v)) for row in delta_mpi for v in row if v is not None)
    assert delta_abs_max < 1e-6
