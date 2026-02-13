#!/usr/bin/env python
from __future__ import annotations

import csv
import json
import re
import time
import zipfile
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen

from playwright.sync_api import sync_playwright


REPO_ROOT = Path(__file__).resolve().parents[2]
BASE_URL = "http://127.0.0.1:5173"
API_BASE = "http://127.0.0.1:8001"
DATA_DIR_CANDIDATES = [
    REPO_ROOT / "data",
    REPO_ROOT / "backend" / "data",
]


@dataclass
class StepResult:
    item: str
    status: str
    detail: str


def api_call(method: str, path: str, payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    url = f"{API_BASE}{path}"
    body = None
    headers = {"Content-Type": "application/json"}
    if payload is not None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = Request(url, data=body, headers=headers, method=method.upper())
    try:
        with urlopen(req, timeout=40) as resp:
            text = resp.read().decode("utf-8", errors="ignore")
            return json.loads(text) if text else {}
    except HTTPError as exc:
        text = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"HTTP {exc.code} {path}: {text[:240]}")
    except URLError as exc:
        raise RuntimeError(f"URL error {path}: {exc.reason}")


def ensure_health() -> None:
    data = api_call("GET", "/health")
    if data.get("status") != "ok":
        raise RuntimeError("backend /health is not ok")


def ensure_demo_dataset(dataset_id: str = "research_demo") -> Dict[str, Any]:
    csv_paths = [path / f"{dataset_id}.csv" for path in DATA_DIR_CANDIDATES]
    rows: List[Dict[str, Any]] = []
    if not any(path.exists() for path in csv_paths):
        boreholes = [f"bh_{i:02d}" for i in range(1, 9)]
        idx = 0
        for day in range(1, 16):
            for bh in boreholes:
                idx += 1
                label = 1 if (idx % 5 in (0, 1)) else 0
                rows.append(
                    {
                        "sample_id": f"s_{idx:04d}",
                        "borehole_name": bh,
                        "event_time": f"2026-01-{day:02d} 08:00:00",
                        "label": label,
                        "thickness": round(1.5 + (idx % 9) * 0.37, 3),
                        "burial_depth": round(220 + (idx % 13) * 6.8, 3),
                        "elastic_modulus": round(12 + (idx % 11) * 0.9, 3),
                        "friction_angle": round(24 + (idx % 7) * 1.3, 3),
                        "cohesion": round(1.1 + (idx % 10) * 0.18, 3),
                        "tensile_strength": round(0.7 + (idx % 8) * 0.09, 3),
                    }
                )

    source_path = next((path for path in csv_paths if path.exists()), None)
    source_text = source_path.read_text(encoding="utf-8") if source_path else ""
    for csv_path in csv_paths:
        if csv_path.exists():
            continue
        csv_path.parent.mkdir(parents=True, exist_ok=True)
        if source_text:
            csv_path.write_text(source_text, encoding="utf-8")
            continue
        with csv_path.open("w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)

    try:
        manifest = api_call("GET", f"/api/research/dataset/{dataset_id}")
    except RuntimeError:
        manifest = api_call(
            "POST",
            "/api/research/dataset/register",
            {
                "dataset_id": dataset_id,
                "description": "auto-generated dataset for stage E UI regression",
                "label_schema": {
                    "label_column": "label",
                    "positive_values": [1],
                    "event_definition": "roof_pressure_event",
                    "time_window_hours": 24,
                },
            },
        )

    split = api_call(
        "POST",
        f"/api/research/dataset/{dataset_id}/split",
        {
            "strategy": "borehole_block",
            "borehole_column": "borehole_name",
            "train_ratio": 0.6,
            "val_ratio": 0.2,
            "test_ratio": 0.2,
            "seed": 17,
        },
    )

    suite_payload = {
        "template_name": "geomodel_ablation",
        "dataset_id": dataset_id,
        "dataset_version": manifest["dataset_version"],
        "split_id": split["split_id"],
        "seed": 42,
    }
    suite = api_call(
        "POST",
        "/api/research/experiments/run-suite",
        suite_payload,
    )
    exp_ids = [str(item.get("exp_id", "")).strip() for item in suite.get("runs", []) if item.get("exp_id")]
    if len(exp_ids) < 2:
        raise RuntimeError("failed to bootstrap enough experiments for comparison")

    # Re-run with identical inputs to verify deterministic metrics reproducibility.
    suite_repeat = api_call("POST", "/api/research/experiments/run-suite", suite_payload)
    first_runs = suite.get("runs", [])
    repeat_runs = suite_repeat.get("runs", [])
    by_name_first: Dict[str, Dict[str, float]] = {}
    by_name_repeat: Dict[str, Dict[str, float]] = {}
    for item in first_runs:
        name = str(item.get("experiment_name", "")).strip()
        if not name:
            continue
        metrics = item.get("metrics", {}) or {}
        by_name_first[name] = {
            str(k): round(float(v), 8)
            for k, v in metrics.items()
            if isinstance(v, (int, float))
        }
    for item in repeat_runs:
        name = str(item.get("experiment_name", "")).strip()
        if not name:
            continue
        metrics = item.get("metrics", {}) or {}
        by_name_repeat[name] = {
            str(k): round(float(v), 8)
            for k, v in metrics.items()
            if isinstance(v, (int, float))
        }
    if set(by_name_first.keys()) != set(by_name_repeat.keys()):
        raise RuntimeError("reproducibility check failed: experiment_name set mismatch")
    for name in sorted(by_name_first.keys()):
        if by_name_first[name] != by_name_repeat[name]:
            raise RuntimeError(f"reproducibility check failed for experiment={name}")

    return {
        "dataset_id": dataset_id,
        "dataset_version": manifest["dataset_version"],
        "split_id": split["split_id"],
        "exp_ids": exp_ids[:2],
        "reproducible": True,
    }


def save_report(output_dir: Path, results: List[StepResult]) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    payload = {
        "generated_at": datetime.now().isoformat(),
        "base_url": BASE_URL,
        "api_base": API_BASE,
        "results": [asdict(x) for x in results],
    }
    (output_dir / "report.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    lines = [
        "# Stage E Frontend Regression Report",
        "",
        f"- generated_at: {payload['generated_at']}",
        f"- base_url: {BASE_URL}",
        "",
        "| Item | Status | Detail |",
        "|---|---|---|",
    ]
    for item in results:
        lines.append(f"| {item.item} | {item.status} | {item.detail} |")
    (output_dir / "report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def try_click(page, selectors: List[str], timeout_ms: int = 8000) -> str:
    last_err = ""
    for sel in selectors:
        try:
            page.locator(sel).first.click(timeout=timeout_ms)
            return sel
        except Exception as exc:  # noqa: BLE001
            last_err = str(exc)
    raise RuntimeError(f"all selectors failed: {selectors}; last={last_err[:120]}")


def parse_percent_sum(texts: List[str]) -> float:
    total = 0.0
    for text in texts:
        m = re.search(r"([0-9]+(?:\.[0-9]+)?)\s*%", text)
        if m:
            total += float(m.group(1))
    return total


def run() -> int:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = REPO_ROOT / "data" / "research" / "stage_e" / "ui_regression" / ts
    download_dir = output_dir / "downloads"
    screenshot_dir = output_dir / "screenshots"
    download_dir.mkdir(parents=True, exist_ok=True)
    screenshot_dir.mkdir(parents=True, exist_ok=True)

    results: List[StepResult] = []
    geomodel_job_id = ""
    compare_exp_ids: List[str] = []

    def record(item: str, status: str, detail: str) -> None:
        results.append(StepResult(item=item, status=status, detail=detail))
        print(f"[{status}] {item}: {detail}")

    try:
        ensure_health()
        prep = ensure_demo_dataset("research_demo")
        compare_exp_ids = prep["exp_ids"]
        record(
            "precheck",
            "PASS",
            f"backend healthy; prepared dataset={prep['dataset_id']} exp_ids={compare_exp_ids}; reproducible={prep.get('reproducible')}",
        )
    except Exception as exc:  # noqa: BLE001
        record("precheck", "FAIL", str(exc))
        save_report(output_dir, results)
        return 2

    with sync_playwright() as p:
        browser = None
        try:
            try:
                browser = p.chromium.launch(headless=True, channel="msedge")
            except Exception:  # noqa: BLE001
                browser = p.chromium.launch(headless=True)

            context = browser.new_context(accept_downloads=True)
            page = context.new_page()

            # 3.1 Interpolation
            try:
                page.goto(f"{BASE_URL}/interpolation", wait_until="domcontentloaded", timeout=60000)
                page.wait_for_timeout(1500)
                if page.locator(".seam-selection-card").count() > 0:
                    page.locator(".seam-selection-card").first.click(timeout=10000)
                page.wait_for_selector(".geomodel-panel", timeout=30000)

                with page.expect_response(lambda r: "/api/geomodel/jobs" in r.url and r.request.method == "POST", timeout=60000):
                    page.locator(".geomodel-btn").first.click(timeout=10000)

                deadline = time.time() + 180
                status_text = ""
                while time.time() < deadline:
                    status_text = page.locator(".geomodel-status").first.inner_text(timeout=5000)
                    if "completed" in status_text.lower():
                        break
                    if "failed" in status_text.lower():
                        raise RuntimeError(f"geomodel failed: {status_text}")
                    page.wait_for_timeout(1500)
                if "completed" not in status_text.lower():
                    raise RuntimeError("geomodel did not complete within timeout")

                job_text = page.locator(".geomodel-jobid").first.inner_text(timeout=5000).strip()
                geomodel_job_id = job_text.replace("#", "").strip()
                if not geomodel_job_id:
                    raise RuntimeError("missing geomodel job id")

                summary_values = page.locator(".geomodel-summary .summary-item strong").all_inner_texts()
                if len(summary_values) < 3:
                    raise RuntimeError("quality summary cards missing")

                with page.expect_download(timeout=45000) as dl_info:
                    page.locator(".geomodel-files .file-chip").first.click(timeout=10000)
                dl = dl_info.value
                artifact_path = download_dir / f"interpolation_{dl.suggested_filename}"
                dl.save_as(str(artifact_path))
                if not artifact_path.exists() or artifact_path.stat().st_size == 0:
                    raise RuntimeError("artifact download empty")

                page.screenshot(path=str(screenshot_dir / "interpolation.png"), full_page=True)
                record("3.1 Interpolation", "PASS", f"job={geomodel_job_id}; status=completed; artifact={artifact_path.name}")
            except Exception as exc:  # noqa: BLE001
                page.screenshot(path=str(screenshot_dir / "interpolation_fail.png"), full_page=True)
                record("3.1 Interpolation", "FAIL", str(exc))

            # 3.2 MpiHeatmapPro
            try:
                page.goto(f"{BASE_URL}/mpi-heatmap-pro", wait_until="domcontentloaded", timeout=60000)
                page.wait_for_timeout(2500)
                page.locator(".nav-tool").first.click(timeout=10000)
                page.wait_for_selector(".control-panel", timeout=15000)

                geo_toggle = page.locator(".control-panel .control-section").nth(1).locator("input[type='checkbox']").first
                if not geo_toggle.is_checked():
                    geo_toggle.check(force=True)
                page.locator(".geo-input").fill(geomodel_job_id)
                page.locator(".geo-btn").first.click(timeout=10000)
                page.wait_for_selector(".geo-summary", timeout=120000)

                rows = page.locator(".geo-summary .geo-row").all_inner_texts()
                if len(rows) < 4:
                    raise RuntimeError("geo summary rows incomplete")

                page.locator(".geo-btn.secondary").click(timeout=10000)
                page.wait_for_url(re.compile(r".*/interpolation.*"), timeout=30000)
                parsed = urlparse(page.url)
                query = parse_qs(parsed.query)
                if not query.get("geomodel_job_id"):
                    raise RuntimeError("missing geomodel_job_id in jump query")

                page.wait_for_selector(".geomodel-jobid", timeout=30000)
                read_job = page.locator(".geomodel-jobid").first.inner_text(timeout=10000).replace("#", "").strip()
                if read_job != geomodel_job_id:
                    raise RuntimeError(f"jumped interpolation loaded different job id: {read_job}")

                page.screenshot(path=str(screenshot_dir / "mpi_heatmap_pro.png"), full_page=True)
                record("3.2 MpiHeatmapPro", "PASS", "geo-aware compare shown; jump carried geomodel_job_id and auto-loaded status")
            except Exception as exc:  # noqa: BLE001
                page.screenshot(path=str(screenshot_dir / "mpi_heatmap_pro_fail.png"), full_page=True)
                record("3.2 MpiHeatmapPro", "FAIL", str(exc))

            # 3.3 AlgorithmValidation
            try:
                page.goto(f"{BASE_URL}/algorithm-validation", wait_until="domcontentloaded", timeout=60000)
                page.wait_for_timeout(2000)
                page.locator(".nav-right .tool-btn").nth(1).click(timeout=10000)
                page.wait_for_selector(".geo-panel", timeout=15000)
                page.locator(".geo-panel input").fill(geomodel_job_id)
                page.locator(".geo-run-btn").click(timeout=10000)
                page.wait_for_selector(".geo-result-grid", timeout=120000)
                if page.locator(".geo-result-grid .geo-cell").count() < 5:
                    raise RuntimeError("geo compare result cells incomplete")

                seam_select = page.locator(".seam-select select")
                opt_values = seam_select.locator("option").evaluate_all("els => els.map(e => e.value)")
                if len(opt_values) > 1:
                    current = seam_select.input_value()
                    target = next((v for v in opt_values if v != current), current)
                    seam_select.select_option(target)
                    page.wait_for_timeout(1500)
                    if page.locator(".geo-result-grid").count() > 0:
                        raise RuntimeError("geo panel result did not reset after seam switch")
                    detail = "geo result panel reset confirmed after seam change"
                else:
                    detail = "single seam only; reset check skipped"

                page.screenshot(path=str(screenshot_dir / "algorithm_validation.png"), full_page=True)
                record("3.3 AlgorithmValidation", "PASS", detail)
            except Exception as exc:  # noqa: BLE001
                page.screenshot(path=str(screenshot_dir / "algorithm_validation_fail.png"), full_page=True)
                record("3.3 AlgorithmValidation", "FAIL", str(exc))

            # 3.4 Steps
            try:
                page.goto(f"{BASE_URL}/steps", wait_until="domcontentloaded", timeout=60000)
                page.wait_for_selector(".steps-page", timeout=20000)
                seam_selects = page.locator(".params-grid label select")
                if seam_selects.count() >= 5:
                    mpi_seam_select = seam_selects.nth(4)
                    seam_values = mpi_seam_select.locator("option").evaluate_all("els => els.map(e => e.value).filter(Boolean)")
                    if seam_values:
                        mpi_seam_select.select_option(seam_values[0])
                        page.wait_for_timeout(500)
                geo_checkbox = page.locator(".geo-toggle-line input[type='checkbox']")
                if not geo_checkbox.is_checked():
                    geo_checkbox.check(force=True)
                geo_input = page.locator("input[placeholder*='gm_']")
                geo_input.fill(geomodel_job_id)
                refresh_btn = page.locator(".hero-actions .btn.primary")
                refresh_btn.click(timeout=10000, force=True)

                deadline = time.time() + 180
                while time.time() < deadline:
                    if page.locator(".suggestion p").count() > 0 and page.locator(".zone-item").count() >= 3:
                        break
                    page.wait_for_timeout(1500)

                if page.locator(".suggestion p").count() == 0:
                    hint = page.locator(".kpi-card .hint").first.inner_text() if page.locator(".kpi-card .hint").count() else ""
                    raise RuntimeError(f"missing step suggestion text; hint={hint[:120]}")
                if page.locator(".zone-item").count() < 3:
                    hint = page.locator(".kpi-card .hint").first.inner_text() if page.locator(".kpi-card .hint").count() else ""
                    raise RuntimeError(f"missing zone risk blocks; hint={hint[:120]}")
                ratio_texts = page.locator(".zone-item strong").all_inner_texts()
                ratio_sum = parse_percent_sum(ratio_texts)
                if abs(ratio_sum - 100.0) > 1.0:
                    raise RuntimeError(f"zone ratio sum not 100%, got {ratio_sum:.2f}")

                page.screenshot(path=str(screenshot_dir / "steps.png"), full_page=True)
                record("3.4 Steps", "PASS", f"geo summary + MPI suggestion visible; zone ratio sum={ratio_sum:.2f}%")
            except Exception as exc:  # noqa: BLE001
                page.screenshot(path=str(screenshot_dir / "steps_fail.png"), full_page=True)
                record("3.4 Steps", "FAIL", str(exc))

            # 3.5 Report
            try:
                page.goto(f"{BASE_URL}/report", wait_until="domcontentloaded", timeout=60000)
                page.wait_for_selector(".report-page", timeout=20000)
                report_input = page.locator(".geomodel-input-row input")
                read_btn = page.locator(".geomodel-input-row button")
                report_input.fill(geomodel_job_id)
                read_btn.scroll_into_view_if_needed(timeout=10000)
                with page.expect_response(
                    lambda r: f"/api/geomodel/jobs/{geomodel_job_id}" in r.url and r.request.method == "GET",
                    timeout=30000,
                ):
                    read_btn.evaluate("el => el.click()")

                deadline = time.time() + 45
                while time.time() < deadline:
                    if page.locator(".geomodel-quality-grid").count() > 0:
                        break
                    if page.locator(".error").count() > 0:
                        break
                    page.wait_for_timeout(500)

                if page.locator(".geomodel-quality-grid").count() == 0:
                    err_text = page.locator(".error").first.inner_text().strip() if page.locator(".error").count() else ""
                    raise RuntimeError(f"geomodel quality section not shown; error={err_text[:120]}")
                if page.locator(".geomodel-quality-grid .metric-card").count() < 4:
                    raise RuntimeError("geomodel quality cards incomplete")

                report_input.fill("invalid_job_for_regression")
                with page.expect_response(
                    lambda r: "/api/geomodel/jobs/invalid_job_for_regression" in r.url and r.request.method == "GET",
                    timeout=30000,
                ):
                    read_btn.evaluate("el => el.click()")
                page.wait_for_selector(".error", timeout=30000)
                if page.locator(".error").count() == 0:
                    raise RuntimeError("invalid job did not show explicit error")
                if page.locator(".report-page").count() == 0:
                    raise RuntimeError("report page crashed after invalid job")

                page.screenshot(path=str(screenshot_dir / "report.png"), full_page=True)
                record("3.5 Report", "PASS", "quality section loaded; invalid job error handled without crash")
            except Exception as exc:  # noqa: BLE001
                page.screenshot(path=str(screenshot_dir / "report_fail.png"), full_page=True)
                record("3.5 Report", "FAIL", str(exc))

            # 3.6 ResearchWorkbench
            try:
                page.goto(f"{BASE_URL}/research-workbench", wait_until="domcontentloaded", timeout=60000)
                page.wait_for_selector(".research-page", timeout=25000)
                required_model_types = {
                    "geomodel_aware",
                    "geomodel_ablation",
                    "pinchout_sensitive",
                    "rk_enhanced",
                    "kriging_baseline",
                }
                required_templates = {"geomodel_ablation", "pinchout_effect", "rk_vs_kriging"}

                option_values: List[str] = []
                deadline = time.time() + 45
                while time.time() < deadline:
                    option_values = page.locator("option").evaluate_all("els => els.map(e => e.value)")
                    missing_models = sorted(required_model_types - set(option_values))
                    missing_templates = sorted(required_templates - set(option_values))
                    if not missing_models and not missing_templates:
                        break
                    # Template options are loaded asynchronously on mount; refresh once as fallback.
                    if page.locator("button:has-text('刷新模板')").count() > 0:
                        page.locator("button:has-text('刷新模板')").first.click(timeout=5000, force=True)
                    page.wait_for_timeout(1200)

                missing_models = sorted(required_model_types - set(option_values))
                if missing_models:
                    raise RuntimeError(f"missing model_type options: {missing_models}")
                missing_templates = sorted(required_templates - set(option_values))
                if missing_templates:
                    raise RuntimeError(f"missing template options: {missing_templates}")

                dataset_lookup = page.locator("input[placeholder*='dataset_id']").first
                dataset_lookup.evaluate(
                    """el => {
                        el.value = 'research_demo';
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                    }"""
                )
                if page.locator(".lookup-row .btn.secondary").count() > 0:
                    with page.expect_response(
                        lambda r: "/api/research/dataset/research_demo" in r.url and r.request.method == "GET",
                        timeout=30000,
                    ):
                        page.locator(".lookup-row .btn.secondary").first.evaluate("el => el.click()")
                else:
                    dataset_lookup.press("Enter")
                page.wait_for_selector(".manifest-meta", timeout=45000)

                compare_textarea = page.locator("textarea[placeholder*='exp_']")
                compare_textarea.fill(", ".join(compare_exp_ids))
                page.locator(".actions.actions-split .btn").first.click(timeout=10000)
                page.wait_for_selector(".compare-svg", timeout=120000)

                with page.expect_download(timeout=120000) as dl_info:
                    page.locator("button:has-text('ZIP')").first.click(timeout=10000)
                dl = dl_info.value
                zip_path = download_dir / f"evidence_{dl.suggested_filename}"
                dl.save_as(str(zip_path))
                if not zip_path.exists() or zip_path.stat().st_size == 0:
                    raise RuntimeError("evidence zip not downloaded")

                required_entries = {
                    "manifests/dataset_quality_report.json",
                    "figures/comparison_point_chart.svg",
                    "figures/model_summary_bar.svg",
                }
                with zipfile.ZipFile(zip_path, "r") as zf:
                    names = set(zf.namelist())
                missing_entries = sorted(required_entries - names)
                if missing_entries:
                    raise RuntimeError(f"missing evidence files: {missing_entries}")

                page.screenshot(path=str(screenshot_dir / "research_workbench.png"), full_page=True)
                record("3.6 ResearchWorkbench", "PASS", f"options verified; evidence zip ok ({zip_path.name})")
            except Exception as exc:  # noqa: BLE001
                page.screenshot(path=str(screenshot_dir / "research_workbench_fail.png"), full_page=True)
                record("3.6 ResearchWorkbench", "FAIL", str(exc))

            # 3.7 GeoMpiStudio
            try:
                page.goto(f"{BASE_URL}/geo-mpi-studio", wait_until="domcontentloaded", timeout=60000)
                page.wait_for_timeout(1200)
                page.wait_for_selector("text=Geo-MPI Studio", timeout=20000)

                seam_options = page.locator(".controls select").first.locator("option").count()
                if seam_options <= 0:
                    raise RuntimeError("no seam options loaded for GeoMpiStudio")

                page.locator("button:has-text('Run Spatial Analysis')").first.click(timeout=10000)
                deadline = time.time() + 180
                while time.time() < deadline:
                    if page.locator("[data-testid='geo-mpi-tile-mpi'] canvas").count() > 0:
                        break
                    if page.locator(".error").count() > 0:
                        err_text = page.locator(".error").first.inner_text(timeout=2000).strip()
                        raise RuntimeError(f"GeoMpiStudio error: {err_text[:240]}")
                    page.wait_for_timeout(1000)
                else:
                    raise RuntimeError("GeoMpiStudio matrix render timeout")

                page.locator("input[type='radio'][value='delta']").check(force=True)
                page.wait_for_timeout(800)
                if page.locator("[data-testid='geo-mpi-tile-mpi'] canvas").count() == 0:
                    raise RuntimeError("GeoMpiStudio delta mode did not keep matrix renderable")

                mpi_canvas = page.locator("[data-testid='geo-mpi-tile-mpi'] canvas").first
                explain_panel = page.locator("[data-testid='geo-mpi-explain-panel']")
                if explain_panel.count() == 0:
                    raise RuntimeError("GeoMpiStudio missing explain panel")
                selected_hit = False
                for x_px, y_px in [(140, 140), (90, 90), (190, 165), (220, 120)]:
                    mpi_canvas.click(position={"x": x_px, "y": y_px}, force=True)
                    page.wait_for_timeout(500)
                    panel_text = explain_panel.inner_text(timeout=4000)
                    if re.search(r"\(\s*\d+\s*,\s*\d+\s*\)", panel_text):
                        selected_hit = True
                        break
                if not selected_hit:
                    raise RuntimeError("GeoMpiStudio explain panel did not update with selected cell coordinates")

                linkage_panel = page.locator("[data-testid='geo-mpi-3d-linkage']")
                if linkage_panel.count() == 0:
                    raise RuntimeError("GeoMpiStudio missing 3d linkage panel")
                linkage_text = linkage_panel.inner_text(timeout=4000)
                if "Anchor" not in linkage_text and "锚点" not in linkage_text:
                    raise RuntimeError("GeoMpiStudio 3d linkage panel missing anchor title")
                if "X/Y" not in linkage_text and "x/y" not in linkage_text:
                    raise RuntimeError("GeoMpiStudio 3d linkage panel missing anchor coordinates")

                page.screenshot(path=str(screenshot_dir / "geo_mpi_studio.png"), full_page=True)
                record("3.7 GeoMpiStudio", "PASS", "four-metric matrix rendered; delta switch stable; explain + 3d linkage linked")
            except Exception as exc:  # noqa: BLE001
                page.screenshot(path=str(screenshot_dir / "geo_mpi_studio_fail.png"), full_page=True)
                record("3.7 GeoMpiStudio", "FAIL", str(exc))

            context.close()
        finally:
            if browser:
                browser.close()

    save_report(output_dir, results)
    fail_count = sum(1 for x in results if x.status == "FAIL")
    print(f"\nReport: {output_dir}")
    print(f"PASS={sum(1 for x in results if x.status == 'PASS')} FAIL={fail_count}")
    return 2 if fail_count else 0


if __name__ == "__main__":
    raise SystemExit(run())
