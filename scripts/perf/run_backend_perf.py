#!/usr/bin/env python
from __future__ import annotations

import argparse
import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = REPO_ROOT / "backend"
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.services.perf_stats import summarize_latencies  # noqa: E402


class Transport:
    def post_json(self, path: str, payload: Dict[str, Any]) -> Tuple[bool, int, str]:
        raise NotImplementedError

    def get(self, path: str) -> Tuple[bool, int, str]:
        raise NotImplementedError


class UrllibTransport(Transport):
    def __init__(self, base_url: str, timeout_sec: float) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout_sec = timeout_sec

    def _url(self, path: str) -> str:
        return f"{self.base_url}{path}"

    def post_json(self, path: str, payload: Dict[str, Any]) -> Tuple[bool, int, str]:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        req = Request(
            url=self._url(path),
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urlopen(req, timeout=self.timeout_sec) as resp:
                status = int(getattr(resp, "status", 200))
                return 200 <= status < 300, status, ""
        except HTTPError as exc:
            return False, int(exc.code), _read_http_error(exc)
        except URLError as exc:
            return False, 0, f"URLError: {exc.reason}"
        except Exception as exc:  # pragma: no cover
            return False, 0, f"{type(exc).__name__}: {exc}"

    def get(self, path: str) -> Tuple[bool, int, str]:
        req = Request(url=self._url(path), method="GET")
        try:
            with urlopen(req, timeout=self.timeout_sec) as resp:
                status = int(getattr(resp, "status", 200))
                return 200 <= status < 300, status, ""
        except HTTPError as exc:
            return False, int(exc.code), _read_http_error(exc)
        except URLError as exc:
            return False, 0, f"URLError: {exc.reason}"
        except Exception as exc:  # pragma: no cover
            return False, 0, f"{type(exc).__name__}: {exc}"


class TestClientTransport(Transport):
    def __init__(self) -> None:
        from fastapi.testclient import TestClient
        from app.main import app

        self.client = TestClient(app)

    def post_json(self, path: str, payload: Dict[str, Any]) -> Tuple[bool, int, str]:
        try:
            resp = self.client.post(path, json=payload)
            ok = 200 <= resp.status_code < 300
            if ok:
                return True, resp.status_code, ""
            try:
                data = resp.json()
                detail = data.get("detail", "")
            except Exception:
                detail = resp.text[:200]
            return False, resp.status_code, str(detail)
        except Exception as exc:  # pragma: no cover
            return False, 0, f"{type(exc).__name__}: {exc}"

    def get(self, path: str) -> Tuple[bool, int, str]:
        try:
            resp = self.client.get(path)
            ok = 200 <= resp.status_code < 300
            if ok:
                return True, resp.status_code, ""
            try:
                data = resp.json()
                detail = data.get("detail", "")
            except Exception:
                detail = resp.text[:200]
            return False, resp.status_code, str(detail)
        except Exception as exc:  # pragma: no cover
            return False, 0, f"{type(exc).__name__}: {exc}"


@dataclass
class ScenarioResult:
    name: str
    summary: Dict[str, Any]
    error_buckets: Dict[str, int]


def _read_http_error(exc: HTTPError) -> str:
    try:
        raw = exc.read().decode("utf-8", errors="ignore")
    except Exception:
        raw = str(exc)
    return raw[:280]


def _now_ms() -> float:
    return time.perf_counter() * 1000.0


def build_points(point_count: int) -> List[Dict[str, Any]]:
    side = max(int(point_count**0.5), 1)
    points: List[Dict[str, Any]] = []
    idx = 0
    for iy in range(side):
        for ix in range(side):
            if idx >= point_count:
                return points
            x = float(ix * 35.0 + (iy % 3) * 4.0)
            y = float(iy * 32.0 + (ix % 4) * 3.0)
            thickness = 4.5 + ((ix + iy) % 9) * 0.28
            burial_depth = 280.0 + ((ix * 3 + iy * 5) % 140)
            strata = [
                {
                    "name": "sandstone",
                    "thickness": 5.0,
                    "density": 2.45,
                    "bulk_modulus": 17.0,
                    "shear_modulus": 10.0,
                    "cohesion": 2.4,
                    "friction_angle": 31.0,
                    "tensile_strength": 3.1,
                },
                {
                    "name": "mudstone",
                    "thickness": 7.0,
                    "density": 2.35,
                    "bulk_modulus": 14.0,
                    "shear_modulus": 8.5,
                    "cohesion": 2.0,
                    "friction_angle": 29.0,
                    "tensile_strength": 2.5,
                },
                {
                    "name": "limestone",
                    "thickness": 6.0,
                    "density": 2.6,
                    "bulk_modulus": 19.0,
                    "shear_modulus": 11.0,
                    "cohesion": 2.8,
                    "friction_angle": 34.0,
                    "tensile_strength": 3.4,
                },
            ]
            points.append(
                {
                    "x": x,
                    "y": y,
                    "borehole": f"BH_{idx:04d}",
                    "thickness": thickness,
                    "burial_depth": burial_depth,
                    "z_top": burial_depth,
                    "z_bottom": burial_depth + thickness,
                    "strata": strata,
                }
            )
            idx += 1
    return points


def run_scenario(
    name: str,
    request_fn: Callable[[], Tuple[bool, int, str]],
    total_requests: int,
    concurrency: int,
) -> ScenarioResult:
    total = max(int(total_requests), 1)
    workers = max(int(concurrency), 1)
    latencies: List[float] = []
    success_count = 0
    error_buckets: Dict[str, int] = {}

    start = _now_ms()
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = [pool.submit(_request_once, request_fn) for _ in range(total)]
        for fut in as_completed(futures):
            ok, status, err, latency_ms = fut.result()
            latencies.append(latency_ms)
            if ok:
                success_count += 1
            else:
                key = f"{status}" if status else "EXC"
                if err:
                    key = f"{key}:{err[:72]}"
                error_buckets[key] = error_buckets.get(key, 0) + 1

    elapsed = _now_ms() - start
    summary = summarize_latencies(
        latencies_ms=latencies,
        total_requests=total,
        success_count=success_count,
        elapsed_ms=elapsed,
    )
    return ScenarioResult(name=name, summary=summary, error_buckets=error_buckets)


def _request_once(
    request_fn: Callable[[], Tuple[bool, int, str]]
) -> Tuple[bool, int, str, float]:
    start = _now_ms()
    ok, status, err = request_fn()
    latency_ms = _now_ms() - start
    return ok, status, err, latency_ms


def print_summary(result: ScenarioResult) -> None:
    s = result.summary
    l = s["latency_ms"]
    print(f"\n[{result.name}]")
    print(
        "  total={total} success={ok} failed={failed} success_rate={rate:.2%} rps={rps:.2f}".format(
            total=s["total_requests"],
            ok=s["success_count"],
            failed=s["failed_count"],
            rate=s["success_rate"],
            rps=s["rps"],
        )
    )
    print(
        "  latency(ms): min={min:.2f} p50={p50:.2f} p95={p95:.2f} p99={p99:.2f} max={max:.2f}".format(
            min=l["min"],
            p50=l["p50"],
            p95=l["p95"],
            p99=l["p99"],
            max=l["max"],
        )
    )
    if result.error_buckets:
        print("  errors:")
        for key, count in sorted(result.error_buckets.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"    - {key} x {count}")


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Run backend performance baselines for MPI and Geomodel APIs.")
    p.add_argument("--base-url", default="http://127.0.0.1:8001", help="Backend base URL for HTTP mode.")
    p.add_argument("--inprocess", action="store_true", help="Use FastAPI TestClient instead of HTTP network calls.")
    p.add_argument("--requests", type=int, default=60, help="Requests per scenario.")
    p.add_argument("--concurrency", type=int, default=12, help="Concurrent workers.")
    p.add_argument("--timeout", type=float, default=20.0, help="HTTP timeout in seconds (HTTP mode only).")
    p.add_argument("--resolution", type=int, default=120, help="Grid resolution for interpolation scenarios.")
    p.add_argument("--method", default="idw", choices=["idw", "linear", "nearest"], help="Interpolation method.")
    p.add_argument("--points", type=int, default=81, help="Synthetic points count.")
    p.add_argument("--geomodel-job-id", default="", help="Geomodel job id for status and artifact scenarios.")
    p.add_argument("--artifact-name", default="quality_report.json", help="Artifact file name for download scenario.")
    p.add_argument("--disable-geo", action="store_true", help="Skip /api/mpi/interpolate-geo scenario.")
    p.add_argument("--disable-geomodel", action="store_true", help="Skip Geomodel status/download scenarios.")
    p.add_argument("--output-json", default="", help="Optional path to write JSON report.")
    return p


def main() -> int:
    args = build_parser().parse_args()
    transport: Transport
    if args.inprocess:
        transport = TestClientTransport()
    else:
        transport = UrllibTransport(base_url=args.base_url, timeout_sec=args.timeout)

    points = build_points(max(args.points, 4))
    common_payload = {
        "points": points,
        "resolution": int(args.resolution),
        "method": args.method,
    }
    geo_payload = dict(common_payload)
    if args.geomodel_job_id.strip():
        geo_payload["geomodel_job_id"] = args.geomodel_job_id.strip()

    scenarios: List[Tuple[str, Callable[[], Tuple[bool, int, str]]]] = []
    scenarios.append(
        (
            "mpi_interpolate_large_grid",
            lambda: transport.post_json("/api/mpi/interpolate", common_payload),
        )
    )
    if not args.disable_geo:
        scenarios.append(
            (
                "mpi_interpolate_geo_large_grid",
                lambda: transport.post_json("/api/mpi/interpolate-geo", geo_payload),
            )
        )

    job_id = args.geomodel_job_id.strip()
    if not args.disable_geomodel and job_id:
        scenarios.append(
            (
                "geomodel_status_poll",
                lambda: transport.get(f"/api/geomodel/jobs/{quote(job_id, safe='')}"),
            )
        )
        scenarios.append(
            (
                "geomodel_artifact_download",
                lambda: transport.get(
                    "/api/geomodel/jobs/{job}/artifacts/{name}".format(
                        job=quote(job_id, safe=""),
                        name=quote(args.artifact_name, safe=""),
                    )
                ),
            )
        )
    elif not args.disable_geomodel:
        print("[info] skipped geomodel scenarios: missing --geomodel-job-id")

    results: List[ScenarioResult] = []
    print("== Backend Performance Baseline ==")
    print(
        "mode={mode} requests={req} concurrency={cc} points={pts} resolution={res} method={method}".format(
            mode="inprocess" if args.inprocess else f"http({args.base_url})",
            req=args.requests,
            cc=args.concurrency,
            pts=len(points),
            res=args.resolution,
            method=args.method,
        )
    )

    for name, fn in scenarios:
        results.append(
            run_scenario(
                name=name,
                request_fn=fn,
                total_requests=args.requests,
                concurrency=args.concurrency,
            )
        )

    for result in results:
        print_summary(result)

    if args.output_json:
        payload = {
            "meta": {
                "mode": "inprocess" if args.inprocess else "http",
                "base_url": args.base_url,
                "requests": args.requests,
                "concurrency": args.concurrency,
                "points": len(points),
                "resolution": args.resolution,
                "method": args.method,
                "geomodel_job_id": job_id or None,
                "artifact_name": args.artifact_name,
                "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            },
            "scenarios": [
                {
                    "name": r.name,
                    "summary": r.summary,
                    "error_buckets": r.error_buckets,
                }
                for r in results
            ],
        }
        out_path = Path(args.output_json).resolve()
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\n[report] wrote json: {out_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
