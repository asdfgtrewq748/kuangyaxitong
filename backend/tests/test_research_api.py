from __future__ import annotations

from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def _write_dataset(base_dir: Path, dataset_id: str = "research_demo") -> None:
    csv_text = (
        "sample_id,borehole_name,event_time,elastic_modulus,friction_angle,cohesion,thickness,label\n"
        "1,BH01,2025-01-01,18,28,2.5,8,1\n"
        "2,BH01,2025-01-02,17,29,2.3,7,0\n"
        "3,BH02,2025-01-03,23,33,3.0,10,1\n"
        "4,BH02,2025-01-04,22,32,3.1,9,1\n"
        "5,BH03,2025-01-05,14,26,1.8,6,0\n"
        "6,BH03,2025-01-06,13,25,1.7,5,0\n"
        "7,BH04,2025-01-07,21,31,2.9,9,1\n"
        "8,BH04,2025-01-08,20,30,2.8,8,0\n"
    )
    (base_dir / f"{dataset_id}.csv").write_text(csv_text, encoding="utf-8")


def test_research_dataset_register_get_and_split(tmp_path, monkeypatch):
    dataset_id = "research_demo"
    _write_dataset(tmp_path, dataset_id=dataset_id)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))

    register_payload = {
        "dataset_id": dataset_id,
        "label_schema": {
            "label_column": "label",
            "positive_values": [1],
            "event_definition": "roof_pressure_event",
            "time_window_hours": 24,
        },
        "description": "research baseline dataset",
    }
    register_resp = client.post("/api/research/dataset/register", json=register_payload)
    assert register_resp.status_code == 200
    manifest = register_resp.json()
    assert manifest["dataset_id"] == dataset_id
    assert manifest["row_count"] == 8
    assert manifest["label_schema"]["label_column"] == "label"
    assert "quality_report" in manifest

    get_resp = client.get(f"/api/research/dataset/{dataset_id}")
    assert get_resp.status_code == 200
    got = get_resp.json()
    assert got["dataset_id"] == dataset_id
    assert got["manifest_file"].endswith("dataset_manifest.json")

    split_payload = {
        "strategy": "time_borehole_block",
        "time_column": "event_time",
        "borehole_column": "borehole_name",
        "train_ratio": 0.5,
        "val_ratio": 0.25,
        "test_ratio": 0.25,
        "seed": 7,
    }
    split_resp = client.post(f"/api/research/dataset/{dataset_id}/split", json=split_payload)
    assert split_resp.status_code == 200
    split = split_resp.json()
    assert split["dataset_id"] == dataset_id
    assert split["counts"]["train"] > 0
    assert split["counts"]["val"] > 0
    assert split["counts"]["test"] > 0

    for section in ("train", "val", "test"):
        assert "boreholes" in split["leakage_audit"][section]
        assert "time_range" in split["leakage_audit"][section]

    overlap = split["leakage_audit"]["overlap"]
    assert overlap["boreholes_train_val"] == 0
    assert overlap["boreholes_train_test"] == 0
    assert overlap["boreholes_val_test"] == 0


def test_research_experiment_run_and_artifacts(tmp_path, monkeypatch):
    dataset_id = "research_demo"
    _write_dataset(tmp_path, dataset_id=dataset_id)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))

    register_payload = {
        "dataset_id": dataset_id,
        "label_schema": {
            "label_column": "label",
            "positive_values": [1],
            "event_definition": "roof_pressure_event",
            "time_window_hours": 24,
        },
    }
    register_resp = client.post("/api/research/dataset/register", json=register_payload)
    assert register_resp.status_code == 200
    manifest = register_resp.json()

    split_resp = client.post(
        f"/api/research/dataset/{dataset_id}/split",
        json={
            "strategy": "borehole_block",
            "borehole_column": "borehole_name",
            "train_ratio": 0.5,
            "val_ratio": 0.25,
            "test_ratio": 0.25,
            "seed": 11,
        },
    )
    assert split_resp.status_code == 200
    split_id = split_resp.json()["split_id"]

    run_payload = {
        "dataset_id": dataset_id,
        "dataset_version": manifest["dataset_version"],
        "split_id": split_id,
        "experiment_name": "rsi_phasefield_v1",
        "model_type": "rsi_phase_field",
        "target_label_column": "label",
        "seed": 123,
    }
    run_resp = client.post("/api/research/experiments/run", json=run_payload)
    assert run_resp.status_code == 200
    run_data = run_resp.json()
    assert run_data["status"] == "completed"
    exp_id = run_data["exp_id"]
    assert run_data["metrics"]["auc"] >= 0
    assert "calibration" in run_data
    assert "ci95" in run_data

    result_resp = client.get(f"/api/research/experiments/{exp_id}")
    assert result_resp.status_code == 200
    result_data = result_resp.json()
    assert result_data["exp_id"] == exp_id
    assert result_data["dataset_id"] == dataset_id
    assert result_data["spec"]["model_type"] == "rsi_phase_field"

    art_resp = client.get(f"/api/research/experiments/{exp_id}/artifacts")
    assert art_resp.status_code == 200
    artifacts = art_resp.json()["artifacts"]
    names = {item["name"] for item in artifacts}
    assert "result.json" in names
    assert "metrics.csv" in names

    download_resp = client.get(f"/api/research/experiments/{exp_id}/artifacts/result.json")
    assert download_resp.status_code == 200
    assert download_resp.content

    missing_artifact_resp = client.get(f"/api/research/experiments/{exp_id}/artifacts/not_exists.txt")
    assert missing_artifact_resp.status_code == 404

    templates_resp = client.get("/api/research/experiments/templates")
    assert templates_resp.status_code == 200
    templates = templates_resp.json()["templates"]
    assert "rsi_paper_core" in templates

    suite_resp = client.post(
        "/api/research/experiments/run-suite",
        json={
            "template_name": "rsi_paper_core",
            "dataset_id": dataset_id,
            "dataset_version": manifest["dataset_version"],
            "split_id": split_id,
            "seed": 123,
        },
    )
    assert suite_resp.status_code == 200
    suite = suite_resp.json()
    assert suite["template_name"] == "rsi_paper_core"
    assert len(suite["runs"]) >= 2
