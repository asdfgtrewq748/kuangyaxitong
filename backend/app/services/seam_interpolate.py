"""
Coal seam-specific interpolation service.

This module orchestrates interpolation for specific coal seams,
integrating coal seam data extraction, spatial interpolation, and
contour line generation.
"""

from __future__ import annotations

from typing import Dict, List, Optional
from pathlib import Path

import numpy as np

from app.core.config import get_data_dir
from app.services.coal_seam_parser import get_coal_seam_data, get_overburden_lithology, get_seam_stats
from app.services.coords_loader import load_borehole_coords
from app.services.interpolate import interpolate_from_points
from app.services.contour_generator import generate_contours_simplified


def interpolate_seam_property(
    files: List[Path],
    coords: Dict[str, Dict[str, float]],
    seam_name: str,
    property: str,  # "thickness" or "burial_depth"
    method: str = "kriging",
    grid_size: int = 50,
    contour_levels: int = 10,
    include_contours: bool = True
) -> Dict:
    """
    Interpolate a property for a specific coal seam.

    Args:
        files: List of borehole CSV file paths
        coords: Dictionary mapping borehole names to coordinates
        seam_name: Name of the coal seam (e.g., "16-3煤")
        property: Property to interpolate ("thickness" or "burial_depth")
        method: Interpolation method ("kriging", "idw", "linear", "nearest")
        grid_size: Grid resolution
        contour_levels: Number of contour levels
        include_contours: Whether to generate contour line data

    Returns:
        Dictionary with interpolation results:
        {
            "seam_name": "16-3煤",
            "property": "thickness",
            "method": "idw",
            "grid_size": 50,
            "bounds": {"min_x": ..., "max_x": ..., "min_y": ..., "max_y": ...},
            "values": [[...]],  # 2D grid
            "contours": {...},  # if include_contours
            "point_count": 15,
            "stats": {...}
        }
    """
    # Validate property
    if property not in ["thickness", "burial_depth"]:
        return {"error": f"Invalid property: {property}. Must be 'thickness' or 'burial_depth'"}

    # Get seam data
    seam_data = get_coal_seam_data(files, coords, seam_name)

    if seam_data["point_count"] < 3:
        return {
            "error": f"Not enough data points for seam '{seam_name}'. Found {seam_data['point_count']} boreholes, need at least 3.",
            "seam_name": seam_name,
            "point_count": seam_data["point_count"]
        }

    # Extract points for interpolation
    points = []
    values = []
    value_key = property  # "thickness" or "burial_depth"

    for point_data in seam_data["points"]:
        x = point_data.get("x")
        y = point_data.get("y")
        value = point_data.get(value_key)

        if x is not None and y is not None and value is not None:
            points.append([x, y])
            values.append(value)

    if len(points) < 3:
        return {"error": "Not enough valid points for interpolation"}

    # Perform interpolation
    pts = np.array(points)
    vals = np.array(values)

    interp_result = interpolate_from_points(
        points=pts,
        values=vals,
        method=method,
        grid_size=grid_size
    )

    if "error" in interp_result:
        return interp_result

    grid = interp_result["grid"]
    bounds = interp_result["bounds"]

    # Calculate statistics
    stats = {
        "min": float(np.min(vals)),
        "max": float(np.max(vals)),
        "mean": float(np.mean(vals)),
        "std": float(np.std(vals)) if len(vals) > 1 else 0.0
    }

    result = {
        "seam_name": seam_name,
        "property": property,
        "method": method,
        "grid_size": grid_size,
        "bounds": bounds,
        "values": grid.tolist(),
        "point_count": len(points),
        "stats": stats,
        "points": [{"x": float(p[0]), "y": float(p[1]), "value": float(v)} for p, v in zip(points, values)]
    }

    # Generate contours if requested
    if include_contours:
        contours = generate_contours_simplified(
            grid=np.array(grid),
            bounds=bounds,
            num_levels=contour_levels
        )
        result["contours"] = contours

    return result


def interpolate_seam_with_overburden(
    files: List[Path],
    coords: Dict[str, Dict[str, float]],
    seam_name: str,
    method: str = "kriging",
    grid_size: int = 50,
    contour_levels: int = 10
) -> Dict:
    """
    Interpolate both thickness and burial depth for a coal seam,
    and include overburden lithology data.

    This is a comprehensive function that provides all data needed for
    the seam analysis page.

    Args:
        files: List of borehole CSV file paths
        coords: Dictionary mapping borehole names to coordinates
        seam_name: Name of the coal seam
        method: Interpolation method
        grid_size: Grid resolution
        contour_levels: Number of contour levels

    Returns:
        Comprehensive result dictionary with interpolation data and overburden info
    """
    # Get seam stats first
    stats = get_seam_stats(files, coords, seam_name)

    # Interpolate thickness
    thickness_result = interpolate_seam_property(
        files=files,
        coords=coords,
        seam_name=seam_name,
        property="thickness",
        method=method,
        grid_size=grid_size,
        contour_levels=contour_levels,
        include_contours=True
    )

    # Interpolate burial depth
    depth_result = interpolate_seam_property(
        files=files,
        coords=coords,
        seam_name=seam_name,
        property="burial_depth",
        method=method,
        grid_size=grid_size,
        contour_levels=contour_levels,
        include_contours=True
    )

    # Get overburden data
    overburden = get_overburden_lithology(files, coords, seam_name)

    # Compile results
    result = {
        "seam_name": seam_name,
        "method": method,
        "grid_size": grid_size,
        "stats": stats,
        "thickness": thickness_result,
        "burial_depth": depth_result,
        "overburden": overburden
    }

    return result


def compare_interpolation_methods_for_seam(
    files: List[Path],
    coords: Dict[str, Dict[str, float]],
    seam_name: str,
    property: str = "thickness",
    grid_size: int = 50
) -> Dict:
    """
    Compare different interpolation methods for a specific coal seam property.

    Args:
        files: List of borehole CSV file paths
        coords: Dictionary mapping borehole names to coordinates
        seam_name: Name of the coal seam
        property: Property to compare ("thickness" or "burial_depth")
        grid_size: Grid resolution

    Returns:
        Dictionary comparing different methods
    """
    methods = ["kriging", "idw", "linear", "nearest"]
    results = {}

    for method in methods:
        result = interpolate_seam_property(
            files=files,
            coords=coords,
            seam_name=seam_name,
            property=property,
            method=method,
            grid_size=grid_size,
            include_contours=False  # No contours for comparison
        )
        results[method] = result

    # Determine best method (lowest standard deviation relative to mean)
    best_method = None
    best_score = float('inf')

    for method, result in results.items():
        if "error" not in result and "stats" in result:
            # Use coefficient of variation (std/mean) as score
            stats = result["stats"]
            if stats["mean"] > 0:
                cv = stats["std"] / stats["mean"]
                if cv < best_score:
                    best_score = cv
                    best_method = method

    return {
        "seam_name": seam_name,
        "property": property,
        "grid_size": grid_size,
        "results": results,
        "recommended": best_method
    }


async def get_seam_overburden(seam_name: str) -> Dict:
    """
    Compatibility helper for routes expecting an async overburden loader.
    """
    data_dir = get_data_dir()
    if not data_dir.exists():
        return {"seam_name": seam_name, "boreholes": [], "borehole_count": 0}

    coord_path = data_dir / "zuobiao.csv"
    if not coord_path.exists():
        return {"seam_name": seam_name, "boreholes": [], "borehole_count": 0}

    coords = load_borehole_coords(coord_path)
    files = sorted([p for p in data_dir.glob("*.csv") if p.is_file() and p.name != "zuobiao.csv"])
    return get_overburden_lithology(files, coords, seam_name)
