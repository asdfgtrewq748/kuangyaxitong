#!/usr/bin/env python
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = REPO_ROOT / "backend"
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))


class Transport:
    def get_json(self, path: str) -> Tuple[bool, int, Dict[str, Any], str]:
        raise NotImplementedError

    def post_json(self, path: str, payload: Dict[str, Any]) -> Tuple[bool, int, Dict[str, Any], str]:
        raise NotImplementedError


class UrllibTransport(Transport):
    def __init__(self, base_url: str, timeout_sec: float) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout_sec = timeout_sec

    def _url(self, path: str) -> str:
        return f"{self.base_url}{path}"

    def get_json(self, path: str) -> Tuple[bool, int, Dict[str, Any], str]:
        req = Request(self._url(path), method="GET")
        return self._send(req)

    def post_json(self, path: str, payload: Dict[str, Any]) -> Tuple[bool, int, Dict[str, Any], str]:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        req = Request(
            self._url(path),
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        return self._send(req)

    def _send(self, req: Request) -> Tuple[bool, int, Dict[str, Any], str]:
        try:
            with urlopen(req, timeout=self.timeout_sec) as resp:
                status = int(getattr(resp, "status", 200))
                body = resp.read().decode("utf-8", errors="ignore")
                data = json.loads(body) if body else {}
                return 200 <= status < 300, status, data, ""
        except HTTPError as exc:
            detail = _read_http_error(exc)
            return False, int(exc.code), {}, detail
        except URLError as exc:
            return False, 0, {}, f"URLError: {exc.reason}"
        except Exception as exc:  # pragma: no cover
            return False, 0, {}, f"{type(exc).__name__}: {exc}"


class TestClientTransport(Transport):
    def __init__(self) -> None:
        from fastapi.testclient import TestClient
        from app.main import app

        self.client = TestClient(app)

    def get_json(self, path: str) -> Tuple[bool, int, Dict[str, Any], str]:
        try:
            resp = self.client.get(path)
            ok = 200 <= resp.status_code < 300
            data = resp.json() if resp.content else {}
            return ok, resp.status_code, data, "" if ok else str(data.get("detail", ""))
        except Exception as exc:  # pragma: no cover
            return False, 0, {}, f"{type(exc).__name__}: {exc}"

    def post_json(self, path: str, payload: Dict[str, Any]) -> Tuple[bool, int, Dict[str, Any], str]:
        try:
            resp = self.client.post(path, json=payload)
            ok = 200 <= resp.status_code < 300
            data = resp.json() if resp.content else {}
            return ok, resp.status_code, data, "" if ok else str(data.get("detail", ""))
        except Exception as exc:  # pragma: no cover
            return False, 0, {}, f"{type(exc).__name__}: {exc}"


def _read_http_error(exc: HTTPError) -> str:
    try:
        raw = exc.read().decode("utf-8", errors="ignore")
    except Exception:
        raw = str(exc)
    return raw[:280]


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Validate research template end-to-end flow on 2+ datasets."
    )
    p.add_argument("--dataset-ids", nargs="+", required=True, help="Existing dataset_id list (at least 2).")
    p.add_argument("--templates", nargs="+", default=["geomodel_ablation", "rk_vs_kriging"], help="Template names.")
    p.add_argument("--inprocess", action="store_true", help="Use FastAPI TestClient mode.")
    p.add_argument("--base-url", default="http://127.0.0.1:8001", help="Backend base URL.")
    p.add_argument("--timeout", type=float, default=20.0, help="HTTP timeout in seconds.")
    p.add_argument("--seed", type=int, default=42, help="Seed baseline for suites.")
    p.add_argument(
        "--auto-register",
        action="store_true",
        help="Auto register dataset manifest if not found and CSV exists in DATA_DIR.",
    )
    p.add_argument("--label-column", default="label", help="Label column for auto register.")
    p.add_argument("--output-json", default="", help="Optional report path.")
    return p


def ensure_split(
    transport: Transport,
    dataset_id: str,
) -> Tuple[bool, Dict[str, Any], str]:
    payload = {
        "strategy": "borehole_block",
        "borehole_column": "borehole_name",
        "train_ratio": 0.6,
        "val_ratio": 0.2,
        "test_ratio": 0.2,
        "seed": 17,
    }
    ok, _, data, err = transport.post_json(f"/api/research/dataset/{dataset_id}/split", payload)
    if not ok:
        return False, {}, err
    return True, data, ""


def main() -> int:
    args = build_parser().parse_args()
    if len(args.dataset_ids) < 2:
        raise ValueError("--dataset-ids requires at least 2 entries")

    transport: Transport
    if args.inprocess:
        transport = TestClientTransport()
    else:
        transport = UrllibTransport(args.base_url, args.timeout)

    report: Dict[str, Any] = {
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "mode": "inprocess" if args.inprocess else "http",
        "base_url": args.base_url,
        "templates": list(args.templates),
        "datasets": [],
        "all_passed": True,
    }

    for idx, dataset_id in enumerate(args.dataset_ids):
        item: Dict[str, Any] = {"dataset_id": dataset_id, "passed": True, "templates": []}
        ok, status, dataset, err = transport.get_json(f"/api/research/dataset/{dataset_id}")
        if (not ok) and status == 404 and args.auto_register:
            register_payload = {
                "dataset_id": dataset_id,
                "label_schema": {
                    "label_column": args.label_column,
                    "positive_values": [1],
                    "event_definition": "roof_pressure_event",
                    "time_window_hours": 24,
                },
            }
            reg_ok, reg_status, _, reg_err = transport.post_json(
                "/api/research/dataset/register",
                register_payload,
            )
            if reg_ok:
                ok, status, dataset, err = transport.get_json(f"/api/research/dataset/{dataset_id}")
            else:
                ok = False
                status = reg_status
                err = f"auto-register failed: {reg_err}"
        if not ok:
            item["passed"] = False
            item["error"] = f"dataset lookup failed status={status} err={err}"
            report["all_passed"] = False
            report["datasets"].append(item)
            continue

        dataset_version = dataset.get("dataset_version")
        if not dataset_version:
            item["passed"] = False
            item["error"] = "dataset_version missing"
            report["all_passed"] = False
            report["datasets"].append(item)
            continue

        split_ok, split_data, split_err = ensure_split(transport, dataset_id)
        if not split_ok:
            item["passed"] = False
            item["error"] = f"split failed: {split_err}"
            report["all_passed"] = False
            report["datasets"].append(item)
            continue

        split_id = split_data.get("split_id")
        if not split_id:
            item["passed"] = False
            item["error"] = "split_id missing"
            report["all_passed"] = False
            report["datasets"].append(item)
            continue

        for t_idx, template_name in enumerate(args.templates):
            payload = {
                "template_name": template_name,
                "dataset_id": dataset_id,
                "dataset_version": dataset_version,
                "split_id": split_id,
                "seed": int(args.seed + idx * 10 + t_idx),
            }
            ok_suite, status_suite, suite_data, suite_err = transport.post_json(
                "/api/research/experiments/run-suite",
                payload,
            )
            if not ok_suite:
                item["passed"] = False
                report["all_passed"] = False
                item["templates"].append(
                    {
                        "template_name": template_name,
                        "passed": False,
                        "error": f"status={status_suite} err={suite_err}",
                    }
                )
                continue

            item["templates"].append(
                {
                    "template_name": template_name,
                    "passed": True,
                    "suite_id": suite_data.get("suite_id"),
                    "run_count": len(suite_data.get("runs", [])),
                    "comparison_conclusion": suite_data.get("comparison_conclusion", {}),
                }
            )
        report["datasets"].append(item)

    print("== Research Template E2E Validation ==")
    print(f"all_passed: {report['all_passed']}")
    for ds in report["datasets"]:
        flag = "PASS" if ds.get("passed") else "FAIL"
        print(f"\n[{flag}] dataset={ds.get('dataset_id')}")
        if ds.get("error"):
            print(f"  error: {ds['error']}")
        for temp in ds.get("templates", []):
            tflag = "PASS" if temp.get("passed") else "FAIL"
            print(f"  - [{tflag}] template={temp.get('template_name')} runs={temp.get('run_count', 0)}")
            if temp.get("error"):
                print(f"    err={temp['error']}")

    if args.output_json:
        out = Path(args.output_json).resolve()
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\n[report] wrote json: {out}")

    return 0 if report["all_passed"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
