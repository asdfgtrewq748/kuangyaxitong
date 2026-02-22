from fastapi.testclient import TestClient

from app.main import app
from app.routes import geomodel_integration as gi


client = TestClient(app)


class _Req:
    def __init__(self, seam_name="S1", resolution=50, method="thickness"):
        self.seam_name = seam_name
        self.resolution = resolution
        self.method = method


class _Record:
    def __init__(self, status="completed", created_at="2026-01-01T00:00:00", request=None):
        self.status = status
        self.created_at = created_at
        self.request = request
        self.result_manifest = None


def test_list_geomodel_jobs_success(monkeypatch):
    class _Svc:
        _jobs = {"job-1": _Record(request=_Req())}

    monkeypatch.setattr(gi, "geomodel_service", _Svc())

    resp = client.get("/api/geomodel-integration/jobs")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["job_id"] == "job-1"
    assert data[0]["status"] == "completed"
    assert "request" not in data[0]


def test_list_geomodel_jobs_error_path(monkeypatch):
    class _Svc:
        _jobs = 1

    monkeypatch.setattr(gi, "geomodel_service", _Svc())

    resp = client.get("/api/geomodel-integration/jobs")
    assert resp.status_code == 500


def test_get_geomodel_visualization_data_success(monkeypatch):
    class _Svc:
        def get_job(self, job_id):
            return {
                "result_manifest": {
                    "artifacts": [
                        {"file_type": "vtk", "name": "layer_A.vtk", "download_url": "/x", "size_bytes": 123},
                        {"file_type": "txt", "name": "ignore.txt"},
                    ],
                    "quality_summary": {
                        "continuity_score": 0.9,
                    },
                }
            }

    monkeypatch.setattr(gi, "geomodel_service", _Svc())

    resp = client.get("/api/geomodel-integration/visualization/job-1")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["layers"]) == 1
    assert data["layers"][0]["name"] == "A"
    assert data["boreholes"] == []
    assert data["bounds"] == {"min_x": 0, "max_x": 100, "min_y": 0, "max_y": 100}


def test_get_geomodel_visualization_data_keyerror(monkeypatch):
    class _Svc:
        def get_job(self, job_id):
            raise KeyError("missing")

    monkeypatch.setattr(gi, "geomodel_service", _Svc())

    resp = client.get("/api/geomodel-integration/visualization/not-found")
    assert resp.status_code == 404


def test_get_geomodel_visualization_data_missing_manifest_returns_404(monkeypatch):
    class _Svc:
        def get_job(self, job_id):
            return {"result_manifest": None}

    monkeypatch.setattr(gi, "geomodel_service", _Svc())

    resp = client.get("/api/geomodel-integration/visualization/job-1")
    assert resp.status_code == 404


def test_calculate_mpi_with_geomodel_without_job(monkeypatch):
    async def _fake_overburden(seam_name):
        return {"boreholes": [{"x": 1, "y": 2}]}

    async def _fake_grid(seam_name, resolution, points):
        return [[1.0, 2.0], [3.0, 4.0]]

    monkeypatch.setattr(gi, "get_seam_overburden", _fake_overburden)
    monkeypatch.setattr(gi, "calculate_pressure_index_grid", _fake_grid)

    resp = client.post("/api/geomodel-integration/mpi-with-geomodel", json={"seam_name": "S1"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["geomodel_used"] is False
    assert data["mpi_grid"] == [[1.0, 2.0], [3.0, 4.0]]


def test_calculate_mpi_with_geomodel_with_job(monkeypatch):
    async def _fake_overburden(seam_name):
        return {"boreholes": [{"x": 1, "y": 2}]}

    async def _fake_grid(seam_name, resolution, points):
        return [[9.0]]

    class _Svc:
        def get_job(self, job_id):
            return {
                "result_manifest": {
                    "quality_summary": {"continuity_score": 0.8, "pinchout_ratio": 0.2, "layer_cv": 0.1},
                    "artifacts": [],
                }
            }

    monkeypatch.setattr(gi, "get_seam_overburden", _fake_overburden)
    monkeypatch.setattr(gi, "calculate_pressure_index_grid", _fake_grid)
    monkeypatch.setattr(gi, "geomodel_service", _Svc())

    resp = client.post(
        "/api/geomodel-integration/mpi-with-geomodel",
        json={"seam_name": "S1", "geomodel_job_id": "job-1"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["geomodel_used"] is True
    assert data["geomodel_quality"]["continuity_score"] == 0.8
    assert 0.0 <= data["geomodel_influence"] <= 1.0


def test_calculate_mpi_with_geomodel_error(monkeypatch):
    async def _boom(seam_name):
        raise RuntimeError("boom")

    monkeypatch.setattr(gi, "get_seam_overburden", _boom)

    resp = client.post("/api/geomodel-integration/mpi-with-geomodel", json={"seam_name": "S1"})
    assert resp.status_code == 500
    assert "boom" in resp.text


def test_get_combined_visualization_success(monkeypatch):
    async def _fake_geomodel(job_id):
        return gi.GeomodelVisualizationData(
            layers=[],
            boreholes=[],
            bounds={"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1},
            quality_summary={"continuity_score": 0.8, "pinchout_ratio": 0.1},
        )

    async def _fake_overburden(seam_name):
        return {"boreholes": [{"x": 1, "y": 2}]}

    async def _fake_grid(seam_name, resolution, points):
        return [[1.0, 2.0], [3.0, 4.0]]

    monkeypatch.setattr(gi, "get_geomodel_visualization_data", _fake_geomodel)
    monkeypatch.setattr(gi, "get_seam_overburden", _fake_overburden)
    monkeypatch.setattr(gi, "calculate_pressure_index_grid", _fake_grid)

    resp = client.get("/api/geomodel-integration/combined-visualization/job-1?seam=S1")
    assert resp.status_code == 200
    data = resp.json()
    assert data["geomodel"]["bounds"]["max_x"] == 1
    assert data["mpi_grid"] == [[1.0, 2.0], [3.0, 4.0]]
    assert data["combined_quality"]["data_coverage"] == 2


def test_get_combined_visualization_error(monkeypatch):
    async def _boom(job_id):
        raise RuntimeError("bad")

    monkeypatch.setattr(gi, "get_geomodel_visualization_data", _boom)

    resp = client.get("/api/geomodel-integration/combined-visualization/job-1?seam=S1")
    assert resp.status_code == 500


def test_geomodel_integration_helper_functions():
    artifacts = [
        {"file_type": "vtk", "name": "layer_A.vtk", "download_url": "/a", "size_bytes": 11},
        {"file_type": "obj", "name": "ignore.obj"},
    ]
    quality = {
        "top_layers": [{"layer_name": "A", "mean_thickness": 5.0, "appearance_ratio": 0.7}],
        "continuity_score": 0.9,
        "pinchout_ratio": 0.2,
        "layer_cv": 0.4,
    }
    layers = gi._build_layer_list(artifacts, quality)
    assert len(layers) == 1
    assert layers[0]["name"] == "A"
    assert layers[0]["mean_thickness"] == 5.0

    assert gi._build_borehole_list(artifacts) == []
    assert gi._calculate_bounds([]) == {"min_x": 0, "max_x": 100, "min_y": 0, "max_y": 100}
    assert gi._calculate_bounds([{"x": 3, "y": 2}, {"x": 9, "y": 5}]) == {
        "min_x": 3,
        "max_x": 9,
        "min_y": 2,
        "max_y": 5,
    }

    influence = gi._calculate_geomodel_influence(quality)
    assert 0.0 <= influence <= 1.0

    assert gi._calculate_combined_quality(None, [[1.0]]) is None
    combined = gi._calculate_combined_quality({"continuity_score": 0.8, "pinchout_ratio": 0.25}, [[1.0], [2.0]])
    assert combined["data_coverage"] == 2
