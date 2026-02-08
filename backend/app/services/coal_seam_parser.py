"""
Coal seam data parser - extracts coal seam information from borehole data.

This module provides functions to:
- Identify coal seams from borehole layer data
- Extract thickness and burial depth for specific seams
- Get overburden lithology data for visualization
"""

from __future__ import annotations

from typing import Dict, List, Optional
from pathlib import Path

import numpy as np
import pandas as pd

from app.services.csv_loader import read_csv_robust
from app.services.borehole_parser import normalize_borehole_df, add_depth_columns


# Lithology color mapping for visualization
LITHOLOGY_COLORS = {
    "细砂岩": "#A8D8EA",
    "粉砂岩": "#AA96DA",
    "泥岩": "#FCBAD3",
    "中砂岩": "#FFFFD2",
    "粗砂岩": "#95E1D3",
    "砾岩": "#F38181",
    "炭质泥岩": "#6C5B7B",
    "砂质泥岩": "#D4A5A5",
    "泥质砂岩": "#D5E8D4",
    "煤": "#2C2C2C",
}


def _float_or_none(value: object) -> Optional[float]:
    """Safely convert values from CSV rows to float."""
    parsed = pd.to_numeric(value, errors="coerce")
    if pd.isna(parsed):
        return None
    return float(parsed)


def is_coal_seam(name: str) -> bool:
    """Check if a layer name indicates a coal seam."""
    if not name or not isinstance(name, str):
        return False
    name_clean = name.strip()
    return "煤" in name_clean


def get_all_coal_seams(files: List[Path], coords: Optional[Dict[str, Dict[str, float]]] = None) -> Dict:
    """
    Scan all borehole files and extract unique coal seam information.

    Args:
        files: List of borehole CSV file paths
        coords: Optional dictionary mapping borehole names to coordinates

    Returns:
        Dictionary with seams list and statistics:
        {
            "seams": [
                {
                    "name": "16-3煤",
                    "borehole_count": 15,
                    "thickness_values": [18.86, 15.2, ...],
                    "avg_thickness": 8.5,
                    "thickness_range": {"min": 1.5, "max": 18.86}
                },
                ...
            ],
            "total_boreholes": len(files),
            "unique_seams": N
        }
    """
    seam_data: Dict[str, List[Dict]] = {}

    for p in files:
        borehole_name = p.stem
        try:
            df = read_csv_robust(p)
            df = normalize_borehole_df(df)
            df = add_depth_columns(df)

            if "name" not in df.columns:
                continue

            # Find coal seam layers
            coal_rows = df[df["name"].apply(is_coal_seam)]

            for _, row in coal_rows.iterrows():
                seam_name = str(row["name"]).strip()
                thickness = pd.to_numeric(row.get("thickness"), errors="coerce")

                if seam_name not in seam_data:
                    seam_data[seam_name] = []

                seam_info = {
                    "borehole": borehole_name,
                    "thickness": float(thickness) if pd.notna(thickness) else None,
                    "z_top": float(row.get("z_top", 0)) if pd.notna(row.get("z_top")) else None,
                    "z_bottom": float(row.get("z_bottom", 0)) if pd.notna(row.get("z_bottom")) else None,
                }

                # Add coordinates if available
                if coords and borehole_name in coords:
                    seam_info["x"] = coords[borehole_name]["x"]
                    seam_info["y"] = coords[borehole_name]["y"]

                seam_data[seam_name].append(seam_info)

        except Exception as e:
            print(f"Error processing {p.name}: {e}")
            continue

    # Process seam data into output format
    seams = []
    for seam_name, data_list in seam_data.items():
        thickness_values = [d["thickness"] for d in data_list if d.get("thickness") is not None]

        seams.append({
            "name": seam_name,
            "borehole_count": len(data_list),
            "thickness_values": thickness_values,
            "avg_thickness": float(np.mean(thickness_values)) if thickness_values else None,
            "thickness_range": {
                "min": float(np.min(thickness_values)) if thickness_values else None,
                "max": float(np.max(thickness_values)) if thickness_values else None
            }
        })

    # Sort by name
    seams.sort(key=lambda x: x["name"])

    return {
        "seams": seams,
        "total_boreholes": len(files),
        "unique_seams": len(seams)
    }


def get_coal_seam_data(
    files: List[Path],
    coords: Dict[str, Dict[str, float]],
    seam_name: str
) -> Dict:
    """
    Extract thickness and burial depth data for a specific coal seam.

    Args:
        files: List of borehole CSV file paths
        coords: Dictionary mapping borehole names to coordinates
        seam_name: Name of the coal seam to extract (e.g., "16-3煤")

    Returns:
        Dictionary with point data for interpolation:
        {
            "seam_name": "16-3煤",
            "points": [
                {
                    "borehole": "50-14",
                    "x": 495394.96,
                    "y": 5404813.13,
                    "thickness": 18.86,
                    "burial_depth": 450.5,
                    "z_top": 450.5,
                    "z_bottom": 469.36
                },
                ...
            ],
            "missing_coords": [],
            "point_count": 15,
            "stats": {...}
        }
    """
    points = []
    missing = []

    for p in files:
        borehole_name = p.stem
        if borehole_name not in coords:
            missing.append(borehole_name)
            continue

        try:
            df = read_csv_robust(p)
            df = normalize_borehole_df(df)
            df = add_depth_columns(df)

            if "name" not in df.columns:
                continue

            # Find the specific seam layer
            seam_rows = df[df["name"].str.strip() == seam_name.strip()]

            if len(seam_rows) == 0:
                continue

            # Take the first match (there should typically be only one)
            row = seam_rows.iloc[0]

            thickness = pd.to_numeric(row.get("thickness"), errors="coerce")
            z_top = pd.to_numeric(row.get("z_top"), errors="coerce")

            point_data = {
                "borehole": borehole_name,
                "x": coords[borehole_name]["x"],
                "y": coords[borehole_name]["y"],
                "thickness": float(thickness) if pd.notna(thickness) else None,
                "burial_depth": float(z_top) if pd.notna(z_top) else None,
                "z_top": float(z_top) if pd.notna(z_top) else None,
                "z_bottom": float(row.get("z_bottom")) if pd.notna(row.get("z_bottom")) else None
            }

            points.append(point_data)

        except Exception as e:
            print(f"Error processing {p.name} for seam {seam_name}: {e}")
            continue

    # Calculate statistics
    thickness_values = [p["thickness"] for p in points if p.get("thickness") is not None]
    depth_values = [p["burial_depth"] for p in points if p.get("burial_depth") is not None]

    stats = {}
    if thickness_values:
        stats["thickness"] = {
            "min": float(np.min(thickness_values)),
            "max": float(np.max(thickness_values)),
            "mean": float(np.mean(thickness_values)),
            "std": float(np.std(thickness_values)) if len(thickness_values) > 1 else 0.0
        }
    if depth_values:
        stats["burial_depth"] = {
            "min": float(np.min(depth_values)),
            "max": float(np.max(depth_values)),
            "mean": float(np.mean(depth_values)),
            "std": float(np.std(depth_values)) if len(depth_values) > 1 else 0.0
        }

    return {
        "seam_name": seam_name,
        "points": points,
        "missing_coords": missing,
        "point_count": len(points),
        "stats": stats
    }


def get_overburden_lithology(
    files: List[Path],
    coords: Dict[str, Dict[str, float]],
    seam_name: str
) -> Dict:
    """
    Get lithology data above a specific coal seam for column chart visualization.

    Args:
        files: List of borehole CSV file paths
        coords: Dictionary mapping borehole names to coordinates
        seam_name: Name of the coal seam

    Returns:
        Dictionary with overburden lithology data:
        {
            "seam_name": "16-3煤",
            "boreholes": [
                {
                    "name": "50-14",
                    "x": 495394.96,
                    "y": 5404813.13,
                    "layers": [
                        {"name": "细砂岩", "thickness": 38.95, "z_top": 0, "z_bottom": 38.95, "color": "#A8D8EA"},
                        {"name": "砾岩", "thickness": 18.35, "z_top": 38.95, "z_bottom": 57.3, "color": "#F38181"},
                        ...
                    ],
                    "seam_top_depth": 450.5,
                    "total_overburden_thickness": 450.5
                },
                ...
            ]
        }
    """
    boreholes = []

    for p in files:
        borehole_name = p.stem
        if borehole_name not in coords:
            continue

        try:
            df = read_csv_robust(p)
            df = normalize_borehole_df(df)
            df = add_depth_columns(df)

            if "name" not in df.columns:
                continue

            # Find the seam layer
            seam_rows = df[df["name"].str.strip() == seam_name.strip()]

            if len(seam_rows) == 0:
                continue

            seam_row = seam_rows.iloc[0]
            seam_z_top = pd.to_numeric(seam_row.get("z_top"), errors="coerce")

            if pd.isna(seam_z_top):
                continue

            # Get all layers above the seam
            overburden_rows = df[df["z_top"] < seam_z_top].copy()
            overburden_rows = overburden_rows.sort_values("z_top", ascending=False)

            layers = []
            for _, row in overburden_rows.iterrows():
                layer_name = str(row.get("name", "")).strip()
                thickness = _float_or_none(row.get("thickness"))
                z_top = _float_or_none(row.get("z_top"))
                z_bottom = _float_or_none(row.get("z_bottom"))
                tensile_strength = _float_or_none(row.get("tensile_strength"))
                elastic_modulus = _float_or_none(row.get("elastic_modulus"))
                compressive_strength = _float_or_none(row.get("compressive_strength"))
                friction_angle = _float_or_none(row.get("friction_angle"))
                density = _float_or_none(row.get("density"))
                cohesion = _float_or_none(row.get("cohesion"))

                # Get color for this lithology
                color = LITHOLOGY_COLORS.get(layer_name, "#CCCCCC")

                layers.append({
                    "name": layer_name,
                    "thickness": thickness if thickness is not None else 0.0,
                    "z_top": z_top if z_top is not None else 0.0,
                    "z_bottom": z_bottom if z_bottom is not None else 0.0,
                    "color": color,
                    "tensile_strength": tensile_strength,
                    "elastic_modulus": elastic_modulus,
                    "compressive_strength": compressive_strength,
                    "friction_angle": friction_angle,
                    "density": density,
                    "cohesion": cohesion,
                })

            # Add the seam itself as a layer
            seam_thickness = _float_or_none(seam_row.get("thickness"))
            seam_z_bottom = _float_or_none(seam_row.get("z_bottom"))
            layers.append({
                "name": seam_name,
                "thickness": seam_thickness if seam_thickness is not None else 0.0,
                "z_top": float(seam_z_top) if pd.notna(seam_z_top) else 0.0,
                "z_bottom": seam_z_bottom if seam_z_bottom is not None else 0.0,
                "color": LITHOLOGY_COLORS.get("煤", "#2C2C2C"),
                "tensile_strength": _float_or_none(seam_row.get("tensile_strength")),
                "elastic_modulus": _float_or_none(seam_row.get("elastic_modulus")),
                "compressive_strength": _float_or_none(seam_row.get("compressive_strength")),
                "friction_angle": _float_or_none(seam_row.get("friction_angle")),
                "density": _float_or_none(seam_row.get("density")),
                "cohesion": _float_or_none(seam_row.get("cohesion")),
            })

            boreholes.append({
                "name": borehole_name,
                "x": coords[borehole_name]["x"],
                "y": coords[borehole_name]["y"],
                "layers": layers,
                "seam_top_depth": float(seam_z_top) if pd.notna(seam_z_top) else None,
                "total_overburden_thickness": float(seam_z_top) if pd.notna(seam_z_top) else None
            })

        except Exception as e:
            print(f"Error processing overburden for {p.name}: {e}")
            continue

    return {
        "seam_name": seam_name,
        "boreholes": boreholes,
        "borehole_count": len(boreholes)
    }


def get_seam_stats(
    files: List[Path],
    coords: Dict[str, Dict[str, float]],
    seam_name: str
) -> Dict:
    """
    Get detailed statistics for a specific coal seam.

    Args:
        files: List of borehole CSV file paths
        coords: Dictionary mapping borehole names to coordinates
        seam_name: Name of the coal seam

    Returns:
        Dictionary with detailed statistics:
        {
            "seam_name": "16-3煤",
            "borehole_count": 15,
            "thickness": {"min": 1.5, "max": 18.86, "mean": 8.2, "std": 4.3},
            "burial_depth": {"min": 420.5, "max": 520.3, "mean": 470.1},
            "lithology_summary": [...]
        }
    """
    seam_data = get_coal_seam_data(files, coords, seam_name)
    overburden_data = get_overburden_lithology(files, coords, seam_name)

    # Build lithology summary from overburden data
    lithology_totals: Dict[str, Dict] = {}

    for bh in overburden_data.get("boreholes", []):
        for layer in bh.get("layers", []):
            layer_name = layer["name"]
            thickness = layer.get("thickness", 0)

            if layer_name not in lithology_totals:
                lithology_totals[layer_name] = {"total_thickness": 0, "count": 0}

            lithology_totals[layer_name]["total_thickness"] += thickness
            lithology_totals[layer_name]["count"] += 1

    # Calculate percentages
    total_thickness = sum(v["total_thickness"] for v in lithology_totals.values())
    lithology_summary = []

    for name, data in lithology_totals.items():
        if name == seam_name:
            continue  # Skip the seam itself
        lithology_summary.append({
            "name": name,
            "avg_thickness": data["total_thickness"] / data["count"] if data["count"] > 0 else 0,
            "percentage": (data["total_thickness"] / total_thickness * 100) if total_thickness > 0 else 0,
            "color": LITHOLOGY_COLORS.get(name, "#CCCCCC")
        })

    # Sort by thickness
    lithology_summary.sort(key=lambda x: x["avg_thickness"], reverse=True)

    return {
        "seam_name": seam_name,
        "borehole_count": seam_data.get("point_count", 0),
        "thickness": seam_data.get("stats", {}).get("thickness", {}),
        "burial_depth": seam_data.get("stats", {}).get("burial_depth", {}),
        "lithology_summary": lithology_summary
    }
