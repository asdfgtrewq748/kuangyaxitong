#!/usr/bin/env python
from __future__ import annotations

import json
import re
import time
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright


REPO_ROOT = Path(__file__).resolve().parents[2]
BASE_URL = "http://127.0.0.1:5173"


def run() -> int:
  ts = datetime.now().strftime("%Y%m%d_%H%M%S")
  out_dir = REPO_ROOT / "data" / "research" / "stage_e" / "ui_regression" / f"geo_mpi_studio_{ts}"
  out_dir.mkdir(parents=True, exist_ok=True)

  result = {
    "generated_at": datetime.now().isoformat(),
    "page": f"{BASE_URL}/geo-mpi-studio",
    "status": "FAIL",
    "detail": "",
  }

  with sync_playwright() as p:
    browser = None
    try:
      try:
        browser = p.chromium.launch(headless=True, channel="msedge")
      except Exception:
        browser = p.chromium.launch(headless=True)

      context = browser.new_context()
      page = context.new_page()

      page.goto(f"{BASE_URL}/geo-mpi-studio", wait_until="domcontentloaded", timeout=60000)
      page.wait_for_timeout(1200)
      page.wait_for_selector("text=Geo-MPI Studio", timeout=20000)

      seams = page.locator(".controls select").first.locator("option").count()
      if seams <= 0:
        raise RuntimeError("no seam options loaded")

      page.locator("button:has-text('Run Spatial Analysis')").first.click(timeout=10000)

      deadline = time.time() + 180
      while time.time() < deadline:
        if page.locator("[data-testid='geo-mpi-tile-mpi'] canvas").count() > 0:
          break
        if page.locator(".error").count() > 0:
          err_text = page.locator(".error").first.inner_text(timeout=2000)
          raise RuntimeError(f"page error: {err_text[:240]}")
        page.wait_for_timeout(1200)
      else:
        raise RuntimeError("timeout waiting for MPI tile heatmap")

      # Mode switch check: delta mode should keep matrix renderable.
      page.locator("input[type='radio'][value='delta']").check(force=True)
      page.wait_for_timeout(800)
      if page.locator("[data-testid='geo-mpi-tile-mpi'] canvas").count() == 0:
        raise RuntimeError("delta mode did not render MPI tile")

      # P4 check: click on matrix canvas and verify explain + 3D linkage updates.
      mpi_canvas = page.locator("[data-testid='geo-mpi-tile-mpi'] canvas").first
      explain_panel = page.locator("[data-testid='geo-mpi-explain-panel']")
      if explain_panel.count() == 0:
        raise RuntimeError("missing explain panel")
      selected_hit = False
      for x_px, y_px in [(140, 140), (90, 90), (190, 165), (220, 120)]:
        mpi_canvas.click(position={"x": x_px, "y": y_px}, force=True)
        page.wait_for_timeout(500)
        panel_text = explain_panel.inner_text(timeout=4000)
        if re.search(r"\(\s*\d+\s*,\s*\d+\s*\)", panel_text):
          selected_hit = True
          break
      if not selected_hit:
        raise RuntimeError("explain panel did not show selected cell coordinates after canvas click")

      linkage_panel = page.locator("[data-testid='geo-mpi-3d-linkage']")
      if linkage_panel.count() == 0:
        raise RuntimeError("missing 3d linkage panel")
      linkage_text = linkage_panel.inner_text(timeout=4000)
      if "Anchor" not in linkage_text and "锚点" not in linkage_text:
        raise RuntimeError("3d linkage panel did not show selected anchor title")
      if "X/Y" not in linkage_text and "x/y" not in linkage_text:
        raise RuntimeError("3d linkage panel did not show selected anchor coordinates")

      page.screenshot(path=str(out_dir / "geo_mpi_studio.png"), full_page=True)
      result["status"] = "PASS"
      result["detail"] = "matrix rendered, delta switch stable, explain + 3d linkage updated"
      context.close()
    except Exception as exc:  # noqa: BLE001
      result["detail"] = str(exc)
      if 'page' in locals():
        try:
          page.screenshot(path=str(out_dir / "geo_mpi_studio_fail.png"), full_page=True)
        except Exception:
          pass
    finally:
      if browser:
        browser.close()

  (out_dir / "result.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
  (out_dir / "result.txt").write_text(f"{result['status']}: {result['detail']}\n", encoding="utf-8")
  print(f"[{result['status']}] {result['detail']}")
  print(f"output: {out_dir}")
  return 0 if result["status"] == "PASS" else 2


if __name__ == "__main__":
  raise SystemExit(run())
