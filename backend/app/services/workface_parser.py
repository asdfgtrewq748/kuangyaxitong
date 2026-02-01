from __future__ import annotations

from typing import Any, Dict, List
from io import StringIO
import json
import csv
import re


RECT_COLS = {
    "xmin": ["xmin", "minx", "min_x", "x_min", "x1"],
    "xmax": ["xmax", "maxx", "max_x", "x_max", "x2"],
    "ymin": ["ymin", "miny", "min_y", "y_min", "y1"],
    "ymax": ["ymax", "maxy", "max_y", "y_max", "y2"],
}


def _find_col(columns: List[str], candidates: List[str]) -> str | None:
    lower_map = {c.lower(): c for c in columns}
    for key in candidates:
        if key in lower_map:
            return lower_map[key]
    return None


def _normalize_bounds(bounds: Dict[str, float]) -> Dict[str, float]:
    min_x = float(bounds["min_x"])
    max_x = float(bounds["max_x"])
    min_y = float(bounds["min_y"])
    max_y = float(bounds["max_y"])
    if min_x > max_x:
        min_x, max_x = max_x, min_x
    if min_y > max_y:
        min_y, max_y = max_y, min_y
    return {"min_x": min_x, "max_x": max_x, "min_y": min_y, "max_y": max_y}


def _bounds_from_points(points: List[List[float]]) -> Dict[str, float]:
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    return _normalize_bounds({
        "min_x": min(xs),
        "max_x": max(xs),
        "min_y": min(ys),
        "max_y": max(ys),
    })


def _parse_points(value: Any) -> List[List[float]]:
    if isinstance(value, str):
        value = value.strip()
        if not value:
            return []
        value = json.loads(value)
    points = []
    for item in value or []:
        if not isinstance(item, (list, tuple)) or len(item) < 2:
            continue
        x = float(item[0])
        y = float(item[1])
        points.append([x, y])
    return points


def _parse_from_rows(rows: List[List[str]]) -> List[Dict[str, Any]]:
    workfaces: List[Dict[str, Any]] = []
    if not rows:
        return workfaces

    header = [c.strip() for c in rows[0]]
    header_lower = [c.lower() for c in header]
    has_header = any(col in header_lower for col in ["name", "名称", "工作面", "workface", "xmin", "xmax", "ymin", "ymax", "points"])

    if has_header:
        columns = header
        name_col = _find_col(columns, ["name", "名称", "工作面", "workface"]) or columns[0]
        points_col = _find_col(columns, ["points", "polygon", "pts", "坐标", "多边形"])
        xmin_col = _find_col(columns, RECT_COLS["xmin"])
        xmax_col = _find_col(columns, RECT_COLS["xmax"])
        ymin_col = _find_col(columns, RECT_COLS["ymin"])
        ymax_col = _find_col(columns, RECT_COLS["ymax"])

        for idx, row in enumerate(rows[1:]):
            record = {columns[i]: row[i] if i < len(row) else "" for i in range(len(columns))}
            name = str(record.get(name_col, "")).strip() or f"工作面{idx + 1}"

            if points_col and record.get(points_col):
                points = _parse_points(record.get(points_col))
                if len(points) >= 3:
                    workfaces.append({
                        "name": name,
                        "type": "polygon",
                        "points": points,
                        "bounds": _bounds_from_points(points)
                    })
                continue

            if xmin_col and xmax_col and ymin_col and ymax_col:
                try:
                    bounds = _normalize_bounds({
                        "min_x": float(record.get(xmin_col)),
                        "max_x": float(record.get(xmax_col)),
                        "min_y": float(record.get(ymin_col)),
                        "max_y": float(record.get(ymax_col)),
                    })
                except Exception:
                    continue

                workfaces.append({
                    "name": name,
                    "type": "rect",
                    "bounds": bounds
                })
        return workfaces

    for idx, row in enumerate(rows):
        if len(row) < 2:
            continue
        name = str(row[0]).strip() or f"工作面{idx + 1}"
        if len(row) == 2:
            points = _parse_points(row[1])
            if len(points) >= 3:
                workfaces.append({
                    "name": name,
                    "type": "polygon",
                    "points": points,
                    "bounds": _bounds_from_points(points)
                })
            continue
        if len(row) >= 5:
            try:
                bounds = _normalize_bounds({
                    "min_x": float(row[1]),
                    "max_x": float(row[2]),
                    "min_y": float(row[3]),
                    "max_y": float(row[4]),
                })
            except Exception:
                continue
            workfaces.append({
                "name": name,
                "type": "rect",
                "bounds": bounds
            })

    return workfaces


def _parse_from_json(payload: Any) -> List[Dict[str, Any]]:
    if isinstance(payload, dict):
        items = payload.get("workfaces") or payload.get("faces") or payload.get("items")
    else:
        items = payload

    workfaces: List[Dict[str, Any]] = []
    for idx, item in enumerate(items or []):
        if not isinstance(item, dict):
            continue
        name = str(item.get("name") or item.get("title") or f"工作面{idx + 1}").strip()
        points = item.get("points")
        if points:
            pts = _parse_points(points)
            if len(pts) >= 3:
                workfaces.append({
                    "name": name,
                    "type": "polygon",
                    "points": pts,
                    "bounds": _bounds_from_points(pts)
                })
                continue

        bounds = item.get("bounds") or {}
        if all(k in bounds for k in ("min_x", "max_x", "min_y", "max_y")):
            workfaces.append({
                "name": name,
                "type": "rect",
                "bounds": _normalize_bounds(bounds)
            })
            continue

        xmin = item.get("xmin") or item.get("min_x")
        xmax = item.get("xmax") or item.get("max_x")
        ymin = item.get("ymin") or item.get("min_y")
        ymax = item.get("ymax") or item.get("max_y")
        if xmin is not None and xmax is not None and ymin is not None and ymax is not None:
            workfaces.append({
                "name": name,
                "type": "rect",
                "bounds": _normalize_bounds({
                    "min_x": float(xmin),
                    "max_x": float(xmax),
                    "min_y": float(ymin),
                    "max_y": float(ymax)
                })
            })

    return workfaces


def parse_workface_file(content: str, filename: str) -> List[Dict[str, Any]]:
    name = filename.lower()
    if name.endswith(".json"):
        payload = json.loads(content)
        return _parse_from_json(payload)

    lines = [line for line in content.splitlines() if line.strip()]
    if not lines:
        return []

    sample = lines[0]
    delimiter = ','
    if '\t' in sample:
        delimiter = '\t'
    elif ';' in sample:
        delimiter = ';'
    elif ',' not in sample and re.search(r"\s+", sample):
        delimiter = None

    rows: List[List[str]] = []
    if delimiter:
        reader = csv.reader(StringIO("\n".join(lines)), delimiter=delimiter)
        rows = [[cell.strip() for cell in row] for row in reader if row]
    else:
        for line in lines:
            parts = re.split(r"\s+", line.strip())
            rows.append(parts)

    return _parse_from_rows(rows)
