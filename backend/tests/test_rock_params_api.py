from fastapi.testclient import TestClient

from app.main import app
from app.routes import rock_params


client = TestClient(app)


class _FakeDb:
    def __init__(self, params=None):
        self._params = params if params is not None else {}

    def get_params_by_lithology(self, lithology, use_synonyms):
        return self._params

    def get_statistics(self):
        return {
            "total_records": 10,
            "unique_lithologies": 3,
            "unique_mines": 2,
            "parameter_coverage": {"density": 0.8},
        }

    def get_all_lithologies(self):
        keys = list(rock_params.LITHOLOGY_SYNONYMS.keys())
        return [keys[0], "other"]

    def get_all_mines(self):
        return ["mine_b", "mine_a"]


def test_query_by_lithology_database_source(monkeypatch):
    monkeypatch.setattr(
        rock_params,
        "get_database",
        lambda: _FakeDb(params={"count": 5, "density": 2500.0, "elastic_modulus": 12.0}),
    )

    resp = client.get("/api/rock-params/query?lithology=test")
    assert resp.status_code == 200
    data = resp.json()
    assert data["source"] == "database"
    assert data["count"] == 5
    assert data["density"] == 2500.0


def test_query_by_lithology_default_and_404(monkeypatch):
    monkeypatch.setattr(rock_params, "get_database", lambda: _FakeDb(params={}))
    monkeypatch.setattr(rock_params, "get_default_params", lambda lithology: {"density": 2400.0})

    ok_resp = client.get("/api/rock-params/query?lithology=missing&include_default=true")
    assert ok_resp.status_code == 200
    assert ok_resp.json()["source"] == "default"

    not_found = client.get("/api/rock-params/query?lithology=missing&include_default=false")
    assert not_found.status_code == 404


def test_get_stats_lithologies_mines_synonyms(monkeypatch):
    monkeypatch.setattr(rock_params, "get_database", lambda: _FakeDb())

    stats_resp = client.get("/api/rock-params/stats")
    assert stats_resp.status_code == 200
    assert stats_resp.json()["total_records"] == 10

    lith_all = client.get("/api/rock-params/lithologies")
    assert lith_all.status_code == 200
    assert lith_all.json()["count"] == 2

    lith_std = client.get("/api/rock-params/lithologies?standard_only=true")
    assert lith_std.status_code == 200
    assert lith_std.json()["count"] == 1

    mines_resp = client.get("/api/rock-params/mines")
    assert mines_resp.status_code == 200
    assert mines_resp.json()["mines"] == ["mine_a", "mine_b"]

    synonyms_resp = client.get("/api/rock-params/synonyms")
    assert synonyms_resp.status_code == 200
    assert isinstance(synonyms_resp.json(), dict)
    assert len(synonyms_resp.json()) > 0


def test_standardize_lithology_exact_synonym_unknown():
    standard = next(iter(rock_params.LITHOLOGY_SYNONYMS.keys()))
    synonym = rock_params.LITHOLOGY_SYNONYMS[standard][0]

    exact = client.get(f"/api/rock-params/standardize?lithology={standard}")
    assert exact.status_code == 200
    assert exact.json()["match_type"] == "exact"

    syn = client.get(f"/api/rock-params/standardize?lithology={synonym}")
    assert syn.status_code == 200
    assert syn.json()["match_type"] == "synonym"
    assert syn.json()["standard_name"] == standard

    unknown = client.get("/api/rock-params/standardize?lithology=UNKNOWN_LITH")
    assert unknown.status_code == 200
    assert unknown.json()["match_type"] == "unknown"


def test_estimate_params_and_default_endpoint(monkeypatch):
    def _fake_estimate(params):
        return {
            "lithology": params["lithology"],
            "density": 2600.0,
            "bulk_modulus": params.get("bulk_modulus"),
            "shear_modulus": params.get("shear_modulus"),
            "cohesion": params.get("cohesion"),
            "friction_angle": params.get("friction_angle"),
            "tensile_strength": params.get("tensile_strength"),
            "compressive_strength": params.get("compressive_strength"),
            "elastic_modulus": params.get("elastic_modulus"),
            "poisson_ratio": params.get("poisson_ratio"),
        }

    monkeypatch.setattr(rock_params, "estimate_missing_params", _fake_estimate)
    monkeypatch.setattr(rock_params, "get_default_params", lambda lithology: {"density": 2300.0})

    resp = client.post("/api/rock-params/estimate?lithology=X&elastic_modulus=10")
    assert resp.status_code == 200
    data = resp.json()
    assert data["params"]["density"] == 2600.0
    assert data["estimated_fields"]["density"] is True
    assert data["estimated_fields"]["elastic_modulus"] is False

    default_resp = client.get("/api/rock-params/default/X")
    assert default_resp.status_code == 200
    assert default_resp.json()["source"] == "default"
    assert default_resp.json()["count"] == 0


def test_get_standard_name_helper():
    standard = next(iter(rock_params.LITHOLOGY_SYNONYMS.keys()))
    synonym = rock_params.LITHOLOGY_SYNONYMS[standard][0]
    assert rock_params._get_standard_name(standard) == standard
    assert rock_params._get_standard_name(synonym) == standard
    assert rock_params._get_standard_name("UNKNOWN_LITH") is None
