from fastapi.testclient import TestClient
from io import BytesIO
import zipfile
import json
from pathlib import Path

from app.main import app


client = TestClient(app)


def _sample_run_payload():
    return {
        "dataset_id": "demo_dataset",
        "time_window": {
            "train_start": "2025-01-01",
            "train_end": "2025-10-31",
            "test_start": "2025-11-01",
            "test_end": "2025-12-31",
        },
        "params": {
            "rsi": {"mesh_size": 50, "time_steps": 10},
            "bri": {"time_window_days": 7},
            "asi": {
                "tunnel_radius": 3.0,
                "original_stress": 10.0,
                "support_pressure": 0.5,
                "ust_parameter_b": 0.5,
            },
            "dbn": {"weights": {"rsi": 0.4, "bri": 0.35, "asi": 0.25}},
        },
        "strata": [
            {
                "name": "roof",
                "thickness": 5.0,
                "tensile_strength": 2.5,
                "elastic_modulus": 15.0,
                "compressive_strength": 35.0,
            },
            {
                "name": "coal",
                "thickness": 3.0,
                "tensile_strength": 1.0,
                "elastic_modulus": 5.0,
                "compressive_strength": 15.0,
            },
        ],
        "microseismic_events": [
            {"time": "2026-01-01T10:00:00", "location": [100, 200, -500], "magnitude": 2.5}
        ],
        "baseline": {"name": "old_mpi_v1"},
    }


def _write_dataset_files(base_dir: Path, dataset_id: str) -> None:
    dataset_csv = (
        "序号,名称,厚度/m,弹性模量/Gpa,抗拉强度/MPa,抗压强度/MPa,内摩擦角\n"
        "1,细砂岩,10,20,3,60,32\n"
        "2,煤,3,5,1,20,25\n"
        "3,泥岩,4,8,1.5,25,28\n"
    )
    (base_dir / f"{dataset_id}.csv").write_text(dataset_csv, encoding="utf-8")

    labels_csv = (
        "y_true,y_prob\n"
        "1,0.9\n"
        "0,0.2\n"
        "1,0.8\n"
        "0,0.3\n"
    )
    (base_dir / f"{dataset_id}_labels.csv").write_text(labels_csv, encoding="utf-8")


def _write_spatial_seam_files(base_dir: Path, seam_name: str = "16-3煤") -> None:
    coords_csv = (
        "钻孔名,坐标x,坐标y\n"
        "BH01,100,100\n"
        "BH02,200,120\n"
        "BH03,120,240\n"
        "BH04,260,260\n"
    )
    (base_dir / "zuobiao.csv").write_text(coords_csv, encoding="utf-8")

    rows = {
        "BH01": [28, 18, 4.0, 10],
        "BH02": [32, 12, 3.6, 16],
        "BH03": [24, 22, 4.4, 8],
        "BH04": [30, 16, 3.8, 14],
    }
    for borehole, vals in rows.items():
        h1, h2, coal_t, h3 = vals
        borehole_csv = (
            "序号,名称,厚度/m,弹性模量/Gpa,抗拉强度/MPa,抗压强度/MPa,内摩擦角\n"
            f"1,细砂岩,{h1},20,3.0,62,32\n"
            f"2,泥岩,{h2},10,1.4,28,28\n"
            f"3,{seam_name},{coal_t},6,1.0,18,25\n"
            f"4,粉砂岩,{h3},15,2.2,48,30\n"
        )
        (base_dir / f"{borehole}.csv").write_text(borehole_csv, encoding="utf-8")


def test_validation_run_and_result():
    run_resp = client.post("/api/algorithm-validation/run", json=_sample_run_payload())
    assert run_resp.status_code == 200

    run_data = run_resp.json()
    assert "run_id" in run_data
    assert run_data["status"] in {"running", "completed"}

    result_resp = client.get(f"/api/algorithm-validation/result/{run_data['run_id']}")
    assert result_resp.status_code == 200

    result = result_resp.json()
    assert result["status"] == "completed"
    assert result["algorithm_mode"] == "advanced_v2"
    assert "indicator_diagnostics" in result
    assert "kpi" in result
    assert "modules" in result
    assert "fusion" in result
    assert "figures" in result
    assert "tables" in result
    assert "auc" in result["kpi"]
    assert "brier_score" in result["kpi"]


def test_validation_result_not_found():
    resp = client.get("/api/algorithm-validation/result/run_not_exists")
    assert resp.status_code == 404


def test_validation_datasets_list_reads_real_data(tmp_path, monkeypatch):
    dataset_id = "site_a01"
    _write_dataset_files(tmp_path, dataset_id)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))

    resp = client.get("/api/algorithm-validation/datasets")
    assert resp.status_code == 200
    data = resp.json()
    assert data["count"] == 1
    assert data["datasets"][0]["dataset_id"] == dataset_id
    assert data["datasets"][0]["has_label_stream"] is True
    assert data["datasets"][0]["rows"] >= 1


def test_validation_run_uses_real_label_stream(tmp_path, monkeypatch):
    dataset_id = "site_b02"
    _write_dataset_files(tmp_path, dataset_id)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))

    payload = _sample_run_payload()
    payload["dataset_id"] = dataset_id
    payload["strata"] = []
    payload["microseismic_events"] = []

    run_resp = client.post("/api/algorithm-validation/run", json=payload)
    assert run_resp.status_code == 200
    run_id = run_resp.json()["run_id"]

    result_resp = client.get(f"/api/algorithm-validation/result/{run_id}")
    assert result_resp.status_code == 200
    result = result_resp.json()
    assert result["evaluation_inputs"]["source"] == f"{dataset_id}_labels.csv"
    assert result["evaluation_inputs"]["y_true"] == [1, 0, 1, 0]
    assert result["evaluation_inputs"]["y_prob"] == [0.9, 0.2, 0.8, 0.3]


def test_validation_evaluate_metrics():
    payload = {
        "y_true": [1, 0, 1, 0, 1, 0],
        "y_prob": [0.92, 0.11, 0.81, 0.43, 0.67, 0.08],
    }
    resp = client.post("/api/algorithm-validation/evaluate", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "auc" in data
    assert "pr_auc" in data
    assert "f1" in data
    assert "brier" in data
    assert "ece" in data
    assert "confusion_matrix" in data
    assert data["confusion_matrix"]["tp"] >= 0


def test_validation_export_package():
    run_resp = client.post("/api/algorithm-validation/run", json=_sample_run_payload())
    assert run_resp.status_code == 200
    run_id = run_resp.json()["run_id"]

    export_resp = client.get(f"/api/algorithm-validation/export/{run_id}")
    assert export_resp.status_code == 200
    assert "application/zip" in export_resp.headers.get("content-type", "")

    with zipfile.ZipFile(BytesIO(export_resp.content), "r") as zf:
        names = set(zf.namelist())
        assert "manifest.json" in names
        assert "config.json" in names
        assert "metrics.json" in names
        assert "figures/fig6.svg" in names
        assert "tables/table1_dataset_stats.csv" in names
        assert "tables/table2_main_results.csv" in names

        manifest = json.loads(zf.read("manifest.json").decode("utf-8"))
        assert manifest["run_id"] == run_id


def test_validation_spatial_overview_returns_four_grids(tmp_path, monkeypatch):
    seam_name = "16-3煤"
    _write_spatial_seam_files(tmp_path, seam_name=seam_name)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))

    resp = client.get(
        "/api/algorithm-validation/spatial-overview",
        params={"seam_name": seam_name, "resolution": 30, "method": "idw"},
    )
    assert resp.status_code == 200

    data = resp.json()
    assert data["seam_name"] == seam_name
    assert data["algorithm_mode"] == "advanced_v2"
    assert data["borehole_count"] == 4
    assert data["evidence_level"] in {"none", "pseudo", "real"}
    assert isinstance(data["label_mode_strict"], bool)
    assert set(data["grids"].keys()) == {"rsi", "bri", "asi", "mpi"}
    assert set(data["statistics"].keys()) == {"rsi", "bri", "asi", "mpi"}
    assert set(data["indicator_diagnostics"].keys()) == {"rsi", "bri", "asi", "mpi"}
    assert len(data["boreholes"]) == 4

    for metric in ("rsi", "bri", "asi", "mpi"):
        grid = data["grids"][metric]
        assert len(grid) == 30
        assert len(grid[0]) == 30

        stats = data["statistics"][metric]
        assert 0 <= stats["min"] <= 100
        assert 0 <= stats["max"] <= 100
        assert 0 <= stats["mean"] <= 100

    for borehole in data["boreholes"]:
        for metric in ("rsi", "bri", "asi", "mpi"):
            assert 0 <= borehole[metric] <= 100


def test_validation_spatial_overview_includes_real_label_stream(tmp_path, monkeypatch):
    seam_name = "16-3煤"
    _write_spatial_seam_files(tmp_path, seam_name=seam_name)
    labels_csv = (
        "borehole_name,seam_name,y_true,y_prob\n"
        "BH01,16-3煤,1,0.82\n"
        "BH02,16-3煤,0,0.21\n"
        "BH03,16-3煤,1,0.76\n"
        "BH04,16-3煤,0,0.33\n"
        "BH01,15-4煤,0,0.11\n"
    )
    (tmp_path / "validation_labels.csv").write_text(labels_csv, encoding="utf-8")
    monkeypatch.setenv("DATA_DIR", str(tmp_path))

    resp = client.get(
        "/api/algorithm-validation/spatial-overview",
        params={"seam_name": seam_name, "resolution": 30, "method": "idw"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["evidence_level"] == "real"
    assert data["label_mode_strict"] is True
    eval_inputs = data["evaluation_inputs"]
    assert eval_inputs["source"] == "validation_labels.csv"
    assert eval_inputs["mode"] == "real_label_stream"
    assert eval_inputs["y_true"] == [1, 0, 1, 0]
    assert eval_inputs["y_prob"] == [0.82, 0.21, 0.76, 0.33]
