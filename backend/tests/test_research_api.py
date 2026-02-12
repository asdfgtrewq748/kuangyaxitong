from __future__ import annotations

from io import BytesIO
from pathlib import Path
from zipfile import ZipFile

from fastapi.testclient import TestClient

from app.main import app
from app.routes import research as research_routes


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
    assert "geomodel_ablation" in templates
    assert "pinchout_effect" in templates
    assert "rk_vs_kriging" in templates

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
    assert "comparison_conclusion" in suite
    assert suite["comparison_conclusion"]["best_auc_experiment"]
    assert "parameter_snapshot" in suite["runs"][0]

    geo_suite_resp = client.post(
        "/api/research/experiments/run-suite",
        json={
            "template_name": "geomodel_ablation",
            "dataset_id": dataset_id,
            "dataset_version": manifest["dataset_version"],
            "split_id": split_id,
            "seed": 321,
        },
    )
    assert geo_suite_resp.status_code == 200
    geo_suite = geo_suite_resp.json()
    run_names = {item["experiment_name"] for item in geo_suite["runs"]}
    assert "geomodel_full" in run_names
    assert "geomodel_ablation_no_geo" in run_names
    assert geo_suite["comparison_conclusion"]["best_auc_experiment"] in run_names


def test_research_papers_overview_and_download(tmp_path, monkeypatch):
    papers_dir = tmp_path / "papers"
    gates_en = papers_dir / "gates_en"
    gates_zh = papers_dir / "gates_zh"
    gates_en.mkdir(parents=True, exist_ok=True)
    gates_zh.mkdir(parents=True, exist_ok=True)

    en_doc = papers_dir / "en.docx"
    zh_doc = papers_dir / "zh.docx"
    en_doc.write_bytes(b"en-draft")
    zh_doc.write_bytes(b"zh-draft")
    (gates_en / "manuscript_gates_report.json").write_text(
        '{"summary":{"overall_pass":true,"total_gates":4,"passed":4,"failed":0}}',
        encoding="utf-8",
    )
    (gates_zh / "manuscript_gates_report.json").write_text(
        '{"summary":{"overall_pass":false,"total_gates":4,"passed":3,"failed":1}}',
        encoding="utf-8",
    )

    monkeypatch.setattr(research_routes, "_PAPERS_DIR", papers_dir)
    monkeypatch.setattr(
        research_routes,
        "_PAPER_SPECS",
        {
            "science_en": {
                "title": "EN",
                "language": "en",
                "manuscript": "en.docx",
                "gates_dir": "gates_en",
            },
            "coal_zh": {
                "title": "ZH",
                "language": "zh",
                "manuscript": "zh.docx",
                "gates_dir": "gates_zh",
            },
        },
    )

    overview_resp = client.get("/api/research/papers/overview")
    assert overview_resp.status_code == 200
    overview = overview_resp.json()
    assert len(overview["papers"]) == 2
    en_item = next(item for item in overview["papers"] if item["paper_id"] == "science_en")
    assert en_item["manuscript"]["exists"] is True
    assert en_item["gate_summary"]["overall_pass"] is True

    download_resp = client.get("/api/research/papers/science_en/download", params={"kind": "manuscript"})
    assert download_resp.status_code == 200
    assert download_resp.content == b"en-draft"

    bad_kind_resp = client.get("/api/research/papers/science_en/download", params={"kind": "unknown"})
    assert bad_kind_resp.status_code == 400

    bundle_resp = client.get("/api/research/papers/science_en/bundle")
    assert bundle_resp.status_code == 200
    with ZipFile(BytesIO(bundle_resp.content)) as zf:
        names = set(zf.namelist())
        assert "README.txt" in names
        assert any(name.endswith("manuscript_en.docx") for name in names)


def test_research_experiment_leaderboard(tmp_path, monkeypatch):
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
    dataset_version = register_resp.json()["dataset_version"]

    split_resp = client.post(
        f"/api/research/dataset/{dataset_id}/split",
        json={
            "strategy": "borehole_block",
            "borehole_column": "borehole_name",
            "train_ratio": 0.5,
            "val_ratio": 0.25,
            "test_ratio": 0.25,
            "seed": 13,
        },
    )
    assert split_resp.status_code == 200
    split_id = split_resp.json()["split_id"]

    run1 = client.post(
        "/api/research/experiments/run",
        json={
            "dataset_id": dataset_id,
            "dataset_version": dataset_version,
            "split_id": split_id,
            "experiment_name": "baseline_a",
            "model_type": "baseline",
            "target_label_column": "label",
            "seed": 100,
        },
    )
    run2 = client.post(
        "/api/research/experiments/run",
        json={
            "dataset_id": dataset_id,
            "dataset_version": dataset_version,
            "split_id": split_id,
            "experiment_name": "rsi_a",
            "model_type": "rsi_phase_field",
            "target_label_column": "label",
            "seed": 101,
        },
    )
    assert run1.status_code == 200
    assert run2.status_code == 200

    lb_auc = client.get("/api/research/leaderboard/experiments", params={"metric": "auc", "limit": 10})
    assert lb_auc.status_code == 200
    payload_auc = lb_auc.json()
    assert payload_auc["metric"] == "auc"
    assert payload_auc["higher_is_better"] is True
    assert payload_auc["total_runs"] >= 2
    assert len(payload_auc["rows"]) >= 2
    assert len(payload_auc["model_summary"]) >= 1
    for item in payload_auc["model_summary"]:
        assert "best_exp_id" in item
        assert "dataset_count" in item

    lb_brier = client.get("/api/research/leaderboard/experiments", params={"metric": "brier", "limit": 10})
    assert lb_brier.status_code == 200
    payload_brier = lb_brier.json()
    assert payload_brier["higher_is_better"] is False
    assert payload_brier["total_runs"] >= 2


def test_research_template_e2e_with_two_datasets(tmp_path, monkeypatch):
    dataset_ids = ["research_demo_a", "research_demo_b"]
    for did in dataset_ids:
        _write_dataset(tmp_path, dataset_id=did)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))

    for did in dataset_ids:
        register_resp = client.post(
            "/api/research/dataset/register",
            json={
                "dataset_id": did,
                "label_schema": {
                    "label_column": "label",
                    "positive_values": [1],
                    "event_definition": "roof_pressure_event",
                    "time_window_hours": 24,
                },
            },
        )
        assert register_resp.status_code == 200
        dataset_version = register_resp.json()["dataset_version"]

        split_resp = client.post(
            f"/api/research/dataset/{did}/split",
            json={
                "strategy": "borehole_block",
                "borehole_column": "borehole_name",
                "train_ratio": 0.5,
                "val_ratio": 0.25,
                "test_ratio": 0.25,
                "seed": 23,
            },
        )
        assert split_resp.status_code == 200
        split_id = split_resp.json()["split_id"]

        for template_name in ("geomodel_ablation", "rk_vs_kriging"):
            suite_resp = client.post(
                "/api/research/experiments/run-suite",
                json={
                    "template_name": template_name,
                    "dataset_id": did,
                    "dataset_version": dataset_version,
                    "split_id": split_id,
                    "seed": 202,
                },
            )
            assert suite_resp.status_code == 200
            suite = suite_resp.json()
            assert suite["template_name"] == template_name
            assert len(suite["runs"]) >= 2
            assert "comparison_conclusion" in suite
