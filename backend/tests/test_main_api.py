import asyncio
import json
from pathlib import Path

import numpy as np
import pandas as pd
import pytest
from fastapi import HTTPException

from app import main as main_api


def _make_data_dir(tmp_path: Path, with_coord: bool = True, boreholes: tuple[str, ...] = ("bh1.csv", "bh2.csv")) -> Path:
    data_dir = tmp_path / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    if with_coord:
        (data_dir / "zuobiao.csv").write_text("name,x,y\nbh1,1,2\nbh2,2,3\n", encoding="utf-8")
    for name in boreholes:
        (data_dir / name).write_text("x\n1\n", encoding="utf-8")
    return data_dir


class _DummyUpload:
    def __init__(self, filename: str, payload: bytes):
        self.filename = filename
        self._payload = payload

    async def read(self) -> bytes:
        return self._payload


def test_main_helpers_and_cache(tmp_path):
    assert main_api._clip01_100(-1) == 0.0
    assert main_api._clip01_100(10) == 10.0
    assert main_api._clip01_100(101) == 100.0
    assert main_api._stats_from_values([]) == {"min": 0.0, "max": 0.0, "mean": 0.0, "std": 0.0}

    stats = main_api._stats_from_values([1.0, 2.0, 3.0])
    assert stats["min"] == 1.0
    assert stats["max"] == 3.0
    assert stats["mean"] == 2.0

    data_dir = _make_data_dir(tmp_path, with_coord=False, boreholes=("a.csv", "b.csv"))
    signature = main_api._build_contour_data_signature(data_dir)
    assert signature.startswith("2:")

    main_api._clear_contour_cache()
    assert main_api._get_cached_contour_response(("k",)) is None
    main_api._set_cached_contour_response(("k",), {"ok": True})
    assert main_api._get_cached_contour_response(("k",)) == {"ok": True}

    for i in range(main_api._CONTOUR_CACHE_MAXSIZE + 3):
        main_api._set_cached_contour_response((f"k{i}",), {"i": i})
    assert len(main_api._contour_cache) <= main_api._CONTOUR_CACHE_MAXSIZE
    main_api._clear_contour_cache()

    report_sig = main_api._build_report_data_signature(data_dir)
    assert report_sig.count(":") == 2
    main_api._clear_report_cache()
    assert main_api._get_cached_report_response(("rk",)) is None
    main_api._set_cached_report_response(("rk",), {"ok": True})
    assert main_api._get_cached_report_response(("rk",)) == {"ok": True}
    old_ttl = main_api._REPORT_CACHE_TTL_SEC
    main_api._REPORT_CACHE_TTL_SEC = 0.0
    try:
        assert main_api._get_cached_report_response(("rk",)) is None
    finally:
        main_api._REPORT_CACHE_TTL_SEC = old_ttl
    main_api._clear_report_cache()


def test_week3_research_summary_helpers(tmp_path):
    data_dir = _make_data_dir(tmp_path)
    split_dir = data_dir / "experiments" / "splits"
    split_dir.mkdir(parents=True, exist_ok=True)
    (split_dir / "split_leakage_audit.json").write_text(
        json.dumps(
            {
                "generated_at_utc": "2026-02-22T06:02:39Z",
                "kfold_summary": {
                    "strategy": "stratified_kfold:spatial_x_label",
                    "n_splits": 5,
                    "row_count": 28,
                },
                "aggregate": {
                    "all_overlap_zero": True,
                    "max_overlap": {"sample_train_val": 0},
                },
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    suites_root = data_dir / "research" / "suites"
    suite_a = suites_root / "suite_20260222_060425"
    suite_b = suites_root / "suite_20260222_060448"
    suite_a.mkdir(parents=True, exist_ok=True)
    suite_b.mkdir(parents=True, exist_ok=True)
    (suite_a / "summary.json").write_text(
        json.dumps(
            {
                "suite_id": "suite_20260222_060425",
                "template_name": "rsi_paper_core",
                "runs": [
                    {
                        "experiment_name": "rsi_main",
                        "model_type": "rsi_phase_field",
                        "metrics": {"auc": 0.99, "brier": 0.2},
                    }
                ],
                "comparison_conclusion": {
                    "best_auc_experiment": "rsi_main",
                    "best_auc_value": 0.99,
                    "best_brier_experiment": "rsi_main",
                    "best_brier_value": 0.2,
                },
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    (suite_b / "summary.json").write_text(
        json.dumps(
            {
                "suite_id": "suite_20260222_060448",
                "template_name": "geomodel_ablation",
                "runs": [
                    {
                        "experiment_name": "geomodel_full",
                        "model_type": "geomodel_aware",
                        "metrics": {"auc": 1.0, "brier": float("nan")},
                    }
                ],
                "comparison_conclusion": {
                    "best_auc_experiment": "geomodel_full",
                    "best_auc_value": 1.0,
                    "best_brier_experiment": "geomodel_full",
                    "best_brier_value": 0.18,
                },
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    signature = main_api._build_week3_research_signature(data_dir)
    assert signature.startswith("3:")

    summary = main_api._load_week3_research_summary(data_dir, max_suites=2)
    assert summary["status"] == "ready"
    assert summary["split_audit"]["all_overlap_zero"] is True
    assert len(summary["suites"]) == 2
    assert summary["suites"][0]["suite_id"] == "suite_20260222_060448"
    assert summary["suites"][0]["runs"][0]["auc"] == 1.0
    assert summary["suites"][0]["runs"][0]["brier"] is None
    assert "stability_compare" in summary


def test_scene3d_data_api_branches(monkeypatch, tmp_path):
    missing_dir = tmp_path / "missing"
    monkeypatch.setattr(main_api, "get_data_dir", lambda: missing_dir)
    with pytest.raises(HTTPException) as exc:
        main_api.get_scene3d_data_api(seam="S1")
    assert exc.value.status_code == 404

    data_dir = _make_data_dir(tmp_path, with_coord=False)
    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)
    with pytest.raises(HTTPException) as exc:
        main_api.get_scene3d_data_api(seam="S1")
    assert exc.value.status_code == 404

    data_dir = _make_data_dir(tmp_path / "x1")
    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)
    monkeypatch.setattr(main_api, "load_borehole_coords", lambda p: {"bh1": {"x": 1, "y": 2}})
    monkeypatch.setattr(main_api, "get_coal_seam_data", lambda files, coords, seam: {"point_count": 0, "points": []})
    with pytest.raises(HTTPException) as exc:
        main_api.get_scene3d_data_api(seam="S1")
    assert exc.value.status_code == 404

    monkeypatch.setattr(main_api, "get_coal_seam_data", lambda files, coords, seam: {"point_count": 1, "points": []})
    monkeypatch.setattr(main_api, "get_overburden_lithology", lambda files, coords, seam: {"boreholes": []})
    with pytest.raises(HTTPException) as exc:
        main_api.get_scene3d_data_api(seam="S1")
    assert exc.value.status_code == 404


def test_scene3d_data_api_success(monkeypatch, tmp_path):
    data_dir = _make_data_dir(tmp_path)
    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)
    monkeypatch.setattr(main_api, "load_borehole_coords", lambda p: {"bh1": {"x": 1, "y": 2}, "bh2": {"x": 2, "y": 3}})
    monkeypatch.setattr(
        main_api,
        "get_coal_seam_data",
        lambda files, coords, seam: {
            "point_count": 2,
            "points": [
                {"x": 1.0, "y": 2.0, "thickness": 4.0, "burial_depth": 500.0},
                {"x": 2.0, "y": 3.0, "thickness": 6.0, "burial_depth": 520.0},
            ],
        },
    )
    monkeypatch.setattr(
        main_api,
        "get_overburden_lithology",
        lambda files, coords, seam: {
            "boreholes": [
                {
                    "x": 1.0,
                    "y": 2.0,
                    "layers": [
                        {"name": "L1", "thickness": 10, "z_top": 100, "z_bottom": 110, "color": "#111111"},
                        {"name": "L2", "thickness": "bad", "z_top": 90, "z_bottom": 100},
                    ],
                },
                {"x": 2.0, "y": 3.0, "layers": [{"name": "L1", "thickness": 12, "z_top": 102, "z_bottom": 114}]},
            ]
        },
    )

    result = main_api.get_scene3d_data_api(seam="S1", resolution=33)
    assert result["scene"]["pointCount"] == 2
    assert result["bounds"]["min_x"] == 1.0
    assert len(result["layers"]) == 2
    assert result["indicators"]["mpi"]["max"] >= result["indicators"]["mpi"]["min"]


def test_borehole_scan_preview_upload_and_fix(monkeypatch, tmp_path):
    data_dir = _make_data_dir(tmp_path)
    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)
    monkeypatch.setattr(main_api, "analyze_csv_file", lambda p: {"file": p.name})
    scan = main_api.scan_boreholes()
    assert len(scan["files"]) >= 3

    with pytest.raises(HTTPException):
        main_api.preview_borehole(file="missing.csv")

    (data_dir / "x.txt").write_text("x", encoding="utf-8")
    with pytest.raises(HTTPException) as exc:
        main_api.preview_borehole(file="x.txt")
    assert exc.value.status_code == 400

    monkeypatch.setattr(main_api, "read_csv_robust", lambda p: pd.DataFrame({"name": ["A"], "thickness": [1.0]}))
    monkeypatch.setattr(main_api, "normalize_borehole_df", lambda df: df)
    monkeypatch.setattr(main_api, "add_depth_columns", lambda df: df.assign(z_top=[0.0], z_bottom=[1.0]))
    preview = main_api.preview_borehole(file="bh1.csv", limit=1)
    assert preview["row_count"] == 1

    cleared = {"n": 0}
    monkeypatch.setattr(main_api, "_clear_contour_cache", lambda: cleared.__setitem__("n", cleared["n"] + 1))
    new_dir = tmp_path / "upload_data"
    monkeypatch.setattr(main_api, "get_data_dir", lambda: new_dir)
    upload = asyncio.run(
        main_api.upload_boreholes(
            files=[
                _DummyUpload("a.csv", b"a,b\n1,2\n"),
                _DummyUpload("b.txt", b"x"),
            ]
        )
    )
    assert upload["saved"] == ["a.csv"]
    assert cleared["n"] == 1
    assert (new_dir / "a.csv").exists()

    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)
    monkeypatch.setattr(main_api, "fix_csv_encoding", lambda p: {"file": p.name, "status": "ok"})
    fixed = main_api.fix_encoding()
    assert len(fixed["files"]) >= 3
    assert cleared["n"] == 2


def test_lithology_and_pressure_steps_entrypoints(monkeypatch, tmp_path):
    data_dir = _make_data_dir(tmp_path)
    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)
    monkeypatch.setattr(main_api, "compute_lithology_averages", lambda files: [{"name": "L1"}])
    lit = main_api.lithology_averages()
    assert lit["averages"] == [{"name": "L1"}]

    monkeypatch.setattr(main_api, "compute_pressure_steps", lambda **kwargs: {"model": kwargs["model"], "ok": True})
    ps = main_api.pressure_steps(model="fixed", h=1, q=2, t=3)
    assert ps["ok"] is True


def test_pressure_steps_boreholes_and_exports(monkeypatch, tmp_path):
    data_dir = _make_data_dir(tmp_path)
    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)
    monkeypatch.setattr(main_api, "load_borehole_coords", lambda p: {"bh1": {"x": 1.0, "y": 2.0}})
    monkeypatch.setattr(
        main_api,
        "compute_pressure_steps_boreholes",
        lambda **kwargs: {
            "items": [
                {"borehole": "bh1", "h": 1, "q": 2, "t": 3, "s": 4, "result": {"initial_step": 8, "periodic_step": (1, 2)}},
                {"borehole": "bh2", "h": 1, "q": 2, "t": 3, "s": 4, "result": {"error": "bad"}},
            ]
        },
    )

    result = main_api.pressure_steps_boreholes()
    assert len(result["items"]) == 2

    exported = main_api.export_pressure_steps(model="fixed")
    text = exported.body.decode("utf-8")
    assert "borehole,h,q,t,s,initial_step,periodic_step,error" in text
    assert "bh1" in text

    monkeypatch.setattr(
        main_api,
        "compute_pressure_steps_boreholes",
        lambda **kwargs: {"items": [{"x": 1.0, "y": 2.0, "result": {"initial_step": 5.0}}]},
    )
    assert main_api.pressure_steps_grid()["error"] == "not enough points for interpolation"

    monkeypatch.setattr(
        main_api,
        "compute_pressure_steps_boreholes",
        lambda **kwargs: {
            "items": [
                {"x": 1.0, "y": 1.0, "result": {"periodic_step": (1.0, 3.0)}},
                {"x": 2.0, "y": 2.0, "result": {"periodic_step": (2.0, 4.0)}},
                {"x": 3.0, "y": 3.0, "result": {"periodic_step": (3.0, 5.0)}},
            ]
        },
    )
    seen = {}

    def _interp(points, values, method, grid_size):
        seen["values"] = values.tolist()
        return {"grid": np.array([[1.0, 2.0], [3.0, 4.0]]), "bounds": {"min_x": 1, "max_x": 3, "min_y": 1, "max_y": 3}}

    monkeypatch.setattr(main_api, "interpolate_from_points", _interp)
    grid = main_api.pressure_steps_grid(target="periodic", grid_size=7)
    assert grid["grid_size"] == 7
    assert seen["values"] == [2.0, 3.0, 4.0]

    monkeypatch.setattr(main_api, "interpolate_from_points", lambda **kwargs: {"error": "interp failed"})
    assert main_api.pressure_steps_grid(target="periodic")["error"] == "interp failed"

    monkeypatch.setattr(main_api, "pressure_steps_grid", lambda **kwargs: {"error": "bad"})
    assert main_api.pressure_steps_workfaces()["error"] == "bad"
    with pytest.raises(HTTPException):
        main_api.export_pressure_steps_grid()

    monkeypatch.setattr(main_api, "pressure_steps_grid", lambda **kwargs: {"values": [[1.0]], "bounds": {"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1}})
    monkeypatch.setattr(main_api, "compute_workface_adjusted_grid", lambda **kwargs: {"adjusted": [[2.0]], "face_map": [[0]]})
    monkeypatch.setattr(main_api, "grid_to_csv_bytes", lambda values, bounds: b"csv")
    wf = main_api.pressure_steps_workfaces()
    assert wf["workfaces"]["adjusted"] == [[2.0]]
    assert main_api.export_pressure_steps_grid().body == b"csv"
    assert main_api.export_pressure_steps_workfaces().body == b"csv"


def test_interpolation_recommend_index_summary_export_pipeline(monkeypatch, tmp_path):
    data_dir = _make_data_dir(tmp_path)
    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)
    monkeypatch.setattr(main_api, "load_borehole_coords", lambda p: {"bh1": {"x": 1, "y": 2}})
    monkeypatch.setattr(main_api, "interpolate_field", lambda **kwargs: {"values": [[1.0]], "bounds": {"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1}})

    assert main_api.interpolate_field_api(field="density")["values"] == [[1.0]]
    compared = main_api.interpolate_compare_api(field="density")
    assert set(compared["results"].keys()) == {"kriging", "idw", "linear", "nearest"}

    monkeypatch.setattr(main_api, "compute_points_values", lambda **kwargs: {"points": [(1, 2), (2, 3)], "values": [1, 2]})
    assert main_api.interpolate_recommend_api(field="density")["error"] == "not enough points for evaluation"

    monkeypatch.setattr(main_api, "compute_points_values", lambda **kwargs: {"points": [(1, 2), (2, 3), (3, 4)], "values": [1, 2, 3]})
    monkeypatch.setattr(main_api, "evaluate_methods", lambda **kwargs: {"idw": {"rmse": 1.2}, "linear": {"rmse": 0.8}})
    rec = main_api.interpolate_recommend_api(field="density", methods="idw,linear")
    assert rec["recommended"] == "linear"

    seen = {}
    monkeypatch.setattr(main_api, "compute_borehole_index", lambda **kwargs: seen.setdefault("weights", kwargs.get("weights")) or {"items": [{"x": 1, "y": 2, "index": 10}]})
    monkeypatch.setattr(main_api, "interpolate_index", lambda **kwargs: {"values": [[1.0]], "bounds": {"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1}})
    monkeypatch.setattr(main_api, "compute_workface_adjusted_grid", lambda **kwargs: {"adjusted": [[9.0]]})
    monkeypatch.setattr(main_api, "grid_to_csv_bytes", lambda values, bounds: b"grid")
    monkeypatch.setattr(main_api, "summarize_grid", lambda grid: {"mean": 5.0})

    main_api.pressure_index_boreholes(elastic_modulus=1.0, density=2.0, tensile_strength=3.0)
    assert seen["weights"] == {"elastic_modulus": 1.0, "density": 2.0, "tensile_strength": 3.0}
    assert "grid" in main_api.pressure_index_grid()
    assert "workfaces" in main_api.pressure_index_workfaces()
    assert main_api.export_pressure_index_workfaces().body == b"grid"
    assert main_api.summary_index()["grid"]["mean"] == 5.0
    assert main_api.summary_index_workfaces()["grid"]["mean"] == 5.0
    monkeypatch.setattr(main_api, "pressure_steps_grid", lambda **kwargs: {"values": [[1.0]], "bounds": {"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1}})
    monkeypatch.setattr(main_api, "pressure_steps_workfaces", lambda **kwargs: {"workfaces": {"adjusted": [[2.0]]}})
    assert main_api.summary_steps(model="fixed")["grid"]["mean"] == 5.0
    assert main_api.summary_steps_workfaces(model="fixed")["grid"]["mean"] == 5.0

    assert main_api.export_interpolation(field="density").body == b"grid"
    assert main_api.export_index().body == b"grid"

    monkeypatch.setattr(main_api, "run_pipeline", lambda **kwargs: {"ok": True})
    assert main_api.pipeline_run()["ok"] is True

    missing = tmp_path / "missing_pipeline"
    monkeypatch.setattr(main_api, "get_data_dir", lambda: missing)
    with pytest.raises(HTTPException):
        main_api.pipeline_run()


def test_summary_report_endpoint_and_cache(monkeypatch, tmp_path):
    data_dir = _make_data_dir(tmp_path)
    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)

    calls = {"index": 0, "index_wf": 0, "steps": 0}

    def _index(**kwargs):
        calls["index"] += 1
        return {
            "grid": {
                "values": [[1.0, 2.0], [3.0, 4.0]],
                "bounds": {"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1},
            }
        }

    def _index_wf(**kwargs):
        calls["index_wf"] += 1
        return {"workfaces": {"adjusted": [[2.0, 3.0], [4.0, 5.0]]}}

    def _steps(**kwargs):
        calls["steps"] += 1
        return {
            "values": [[6.0, 7.0], [8.0, 9.0]],
            "bounds": {"min_x": 0, "max_x": 1, "min_y": 0, "max_y": 1},
        }

    monkeypatch.setattr(main_api, "pressure_index_grid", _index)
    monkeypatch.setattr(main_api, "pressure_index_workfaces", _index_wf)
    monkeypatch.setattr(main_api, "pressure_steps_grid", _steps)
    monkeypatch.setattr(main_api, "compute_workface_adjusted_grid", lambda **kwargs: {"adjusted": [[10.0, 11.0], [12.0, 13.0]]})
    monkeypatch.setattr(main_api, "summarize_grid", lambda grid: {"mean": float(np.nanmean(np.asarray(grid, dtype=float)))})
    monkeypatch.setattr(main_api, "_build_week3_research_signature", lambda d: "wk3sig")
    monkeypatch.setattr(
        main_api,
        "_load_week3_research_summary",
        lambda d: {"status": "ready", "split_audit": None, "suites": [], "stability_compare": [], "notes": []},
    )

    main_api._clear_report_cache()
    payload1 = main_api.summary_report(
        method="idw",
        grid_size=60,
        workface_elastic_modulus=0.4,
        workface_density=0.3,
        workface_tensile_strength=0.3,
    )
    assert payload1["summary"]["index"]["mean"] == 2.5
    assert payload1["summary"]["index_workfaces"]["mean"] == 3.5
    assert payload1["summary"]["steps"]["mean"] == 7.5
    assert payload1["summary"]["steps_workfaces"]["mean"] == 11.5
    assert payload1["research"]["status"] == "ready"
    assert payload1["cache"]["hit"] is False
    assert payload1["performance"]["requests_total"] >= 1
    assert calls == {"index": 1, "index_wf": 1, "steps": 1}

    payload2 = main_api.summary_report(
        method="idw",
        grid_size=60,
        workface_elastic_modulus=0.4,
        workface_density=0.3,
        workface_tensile_strength=0.3,
    )
    assert payload2["summary"]["index"]["mean"] == 2.5
    assert payload2["cache"]["hit"] is True
    assert payload2["performance"]["cache_hits"] >= 1
    assert calls == {"index": 1, "index_wf": 1, "steps": 1}


def test_summary_report_perf_endpoint():
    perf_payload = main_api.summary_report_perf()
    assert "performance" in perf_payload
    assert "cache_hit_rate" in perf_payload["performance"]


def test_summary_api_alias_routes_registered():
    paths = {getattr(route, "path", "") for route in main_api.app.routes}
    assert "/api/boreholes/scan" in paths
    assert "/api/boreholes/preview" in paths
    assert "/api/boreholes/upload" in paths
    assert "/api/boreholes/fix-encoding" in paths
    assert "/api/interpolate/field" in paths
    assert "/api/interpolate/compare" in paths
    assert "/api/interpolate/recommend" in paths
    assert "/api/pipeline/run" in paths
    assert "/api/summary/index" in paths
    assert "/api/summary/index-workfaces" in paths
    assert "/api/summary/steps" in paths
    assert "/api/summary/steps-workfaces" in paths
    assert "/api/summary/report" in paths
    assert "/api/summary/report/perf" in paths
    assert "/api/pressure/index/grid" in paths
    assert "/api/pressure/index/workfaces" in paths
    assert "/api/pressure/steps/grid" in paths
    assert "/api/pressure/steps/workfaces" in paths
    assert "/api/export/interpolation" in paths
    assert "/api/export/index" in paths
    assert "/api/seams/list" in paths
    assert "/api/seams/stats" in paths
    assert "/api/seams/interpolate" in paths
    assert "/api/seams/overburden" in paths
    assert "/api/seams/compare" in paths
    assert "/api/seams/contour-images" in paths
    assert "/api/seams/test-contour" in paths


def test_build_week3_stability_compare_rows():
    suites = [
        {
            "suite_id": "suite_1",
            "template_name": "rsi_paper_core",
            "dataset_id": "research_boreholes_28",
            "runs": [
                {"experiment_name": "rsi_main", "auc": 1.0, "brier": 0.2, "f1": 1.0},
                {"experiment_name": "rsi_baseline", "auc": 0.9, "brier": 0.3, "f1": 0.8},
            ],
        },
        {
            "suite_id": "suite_2",
            "template_name": "rsi_paper_core",
            "dataset_id": "research_boreholes_36",
            "runs": [
                {"experiment_name": "rsi_main", "auc": 0.95, "brier": 0.24, "f1": 0.9},
                {"experiment_name": "rsi_baseline", "auc": 0.7, "brier": 0.35, "f1": 0.2},
            ],
        },
    ]
    rows = main_api._build_week3_stability_compare(suites)
    assert len(rows) == 1
    row = rows[0]
    assert row["template_name"] == "rsi_paper_core"
    assert row["datasets"] == ["research_boreholes_28", "research_boreholes_36"]
    comp = {item["experiment_name"]: item for item in row["comparisons"]}
    assert comp["rsi_main"]["delta_auc"] == pytest.approx(-0.05)
    assert comp["rsi_baseline"]["delta_f1"] == pytest.approx(-0.6)


def test_export_error_paths_and_missing_coord(monkeypatch, tmp_path):
    data_dir = _make_data_dir(tmp_path, with_coord=False)
    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)
    with pytest.raises(HTTPException) as exc:
        main_api.interpolate_field_api(field="density")
    assert exc.value.status_code == 404

    data_dir = _make_data_dir(tmp_path / "d2")
    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)
    monkeypatch.setattr(main_api, "load_borehole_coords", lambda p: {})
    monkeypatch.setattr(main_api, "interpolate_field", lambda **kwargs: {"error": "bad interp"})
    with pytest.raises(HTTPException) as exc:
        main_api.export_interpolation(field="density")
    assert exc.value.status_code == 400

    monkeypatch.setattr(main_api, "compute_borehole_index", lambda **kwargs: {"items": []})
    monkeypatch.setattr(main_api, "interpolate_index", lambda **kwargs: {"error": "bad grid"})
    with pytest.raises(HTTPException) as exc:
        main_api.export_index()
    assert exc.value.status_code == 400

    monkeypatch.setattr(main_api, "pressure_index_workfaces", lambda **kwargs: {"error": "bad wf"})
    with pytest.raises(HTTPException):
        main_api.export_pressure_index_workfaces()


def test_seam_endpoints_and_contour_images(monkeypatch, tmp_path):
    missing = tmp_path / "missing_seam"
    monkeypatch.setattr(main_api, "get_data_dir", lambda: missing)
    with pytest.raises(HTTPException):
        main_api.get_coal_seams_api()

    data_dir = _make_data_dir(tmp_path / "d3")
    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)
    monkeypatch.setattr(main_api, "load_borehole_coords", lambda p: {"bh1": {"x": 1, "y": 2}})
    monkeypatch.setattr(main_api, "get_all_coal_seams", lambda files, coords: {"seams": [{"name": "S1"}]})
    assert main_api.get_coal_seams_api()["seams"][0]["name"] == "S1"

    monkeypatch.setattr(main_api, "get_seam_stats", lambda files, coords, seam_name: {"borehole_count": 0})
    with pytest.raises(HTTPException):
        main_api.get_seam_stats_api(seam_name="S1")
    monkeypatch.setattr(main_api, "get_seam_stats", lambda files, coords, seam_name: {"borehole_count": 2, "stats": {}})
    assert main_api.get_seam_stats_api(seam_name="S1")["borehole_count"] == 2

    monkeypatch.setattr(main_api, "interpolate_seam_property", lambda **kwargs: {"values": [[1.0]]})
    assert main_api.interpolate_seam_api(seam_name="S1", property="thickness")["values"] == [[1.0]]

    with pytest.raises(HTTPException) as exc:
        main_api.get_seam_overburden_api()
    assert exc.value.status_code == 422

    monkeypatch.setattr(
        main_api,
        "get_overburden_lithology",
        lambda files, coords, seam: {"boreholes": [{"name": "bh1"}, {"name": "bh2"}], "borehole_count": 2},
    )
    filtered = main_api.get_seam_overburden_api(seam="S1", borehole="bh1")
    assert filtered["borehole_count"] == 1
    with pytest.raises(HTTPException):
        main_api.get_seam_overburden_api(seam_name="S1", borehole="missing")

    monkeypatch.setattr(main_api, "compare_interpolation_methods_for_seam", lambda **kwargs: {"recommended": "idw"})
    assert main_api.compare_seam_methods_api(seam_name="S1")["recommended"] == "idw"

    monkeypatch.setattr(main_api, "_get_cached_contour_response", lambda key: {"cached": True})
    assert main_api.get_seam_contour_images_api(seam_name="S1") == {"cached": True}


def test_seam_contour_images_error_and_success(monkeypatch, tmp_path):
    data_dir = _make_data_dir(tmp_path / "d4")
    monkeypatch.setattr(main_api, "get_data_dir", lambda: data_dir)
    monkeypatch.setattr(main_api, "_build_contour_data_signature", lambda d: "sig")
    monkeypatch.setattr(main_api, "_get_cached_contour_response", lambda key: None)
    monkeypatch.setattr(main_api, "load_borehole_coords", lambda p: {"bh1": {"x": 1, "y": 2}})

    monkeypatch.setattr(main_api, "get_coal_seam_data", lambda files, coords, seam_name: {"error": "missing"})
    with pytest.raises(HTTPException) as exc:
        main_api.get_seam_contour_images_api(seam_name="S1")
    assert exc.value.status_code == 404

    monkeypatch.setattr(main_api, "get_coal_seam_data", lambda files, coords, seam_name: {"points": [], "point_count": 0})
    with pytest.raises(HTTPException) as exc:
        main_api.get_seam_contour_images_api(seam_name="S1")
    assert exc.value.status_code == 404

    monkeypatch.setattr(
        main_api,
        "get_coal_seam_data",
        lambda files, coords, seam_name: {
            "points": [{"x": 1, "y": 2, "thickness": 1, "burial_depth": 2}],
            "point_count": 1,
        },
    )
    with pytest.raises(HTTPException) as exc:
        main_api.get_seam_contour_images_api(seam_name="S1")
    assert exc.value.status_code == 400

    monkeypatch.setattr(
        main_api,
        "get_coal_seam_data",
        lambda files, coords, seam_name: {
            "points": [
                {"x": 1, "y": 1, "thickness": 1, "burial_depth": 2},
                {"x": 2, "y": 2, "thickness": 2, "burial_depth": 3},
                {"x": 3, "y": 3, "thickness": 3, "burial_depth": 4},
            ],
            "point_count": 3,
        },
    )
    monkeypatch.setattr("app.services.interpolate.interpolate_from_points", lambda **kwargs: {"error": "interp"})
    with pytest.raises(HTTPException) as exc:
        main_api.get_seam_contour_images_api(seam_name="S1")
    assert exc.value.status_code == 400

    calls = {"set": 0}

    def _interp_ok(**kwargs):
        return {"grid": np.array([[1.0, 2.0], [3.0, 4.0]]), "bounds": {"min_x": 1, "max_x": 3, "min_y": 1, "max_y": 3}}

    monkeypatch.setattr("app.services.interpolate.interpolate_from_points", _interp_ok)
    monkeypatch.setattr(
        main_api,
        "generate_dual_contour_images",
        lambda **kwargs: {"thickness": {"image": "a", "format": "png"}, "depth": {"image": "b", "format": "png"}},
    )
    monkeypatch.setattr(main_api, "_set_cached_contour_response", lambda key, payload: calls.__setitem__("set", calls["set"] + 1))

    res = main_api.get_seam_contour_images_api(seam_name="S1", grid_size=20, num_levels=4, dpi=90, smooth_sigma=0.5)
    assert res["seam_name"] == "S1"
    assert res["thickness"]["format"] == "png"
    assert calls["set"] == 1

    monkeypatch.setattr(main_api, "generate_dual_contour_images", lambda **kwargs: (_ for _ in ()).throw(RuntimeError("boom")))
    with pytest.raises(HTTPException) as exc:
        main_api.get_seam_contour_images_api(seam_name="S1")
    assert exc.value.status_code == 500


def test_test_contour_api(monkeypatch):
    monkeypatch.setattr(
        "app.services.contour_generator.generate_dual_contour_images",
        lambda **kwargs: {"thickness": {"image": "x"}, "depth": {"image": "y"}},
    )
    result = main_api.test_contour_api()
    assert result["test"] == "OK"
    assert result["thickness"]["image"] == "x"
