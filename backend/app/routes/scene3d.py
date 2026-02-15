"""
3D Scene API - 提供三维可视化数据

This module provides API endpoints for 3D visualization of geological model
and calculated indicator values (MPI, RSI, BRI, ASI).
"""

from __future__ import annotations

from typing import Dict, List, Optional, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
import numpy as np


router = APIRouter(
    prefix="/api/scene3d",
    tags=["3D Scene"],
)


class Scene3DRequest(BaseModel):
    """Request for 3D scene data"""
    seam_name: str
    indicator: str = Field(default="mpi", description="Indicator: mpi, rsi, bri, asi")
    resolution: int = Field(default=50, ge=20, le=150)
    include_geomodel: bool = Field(default=True)
    include_boreholes: bool = Field(default=True)


class Layer3D(BaseModel):
    """3D Layer data"""
    id: str
    name: str
    display_name: str
    color: str
    thickness: float
    depth_top: float
    depth_bottom: float
    vertices: List[List[float]]  # [[x,y,z], ...]
    faces: List[List[int]]  # [[v1, v2, v3], ...]


class Borehole3D(BaseModel):
    """3D Borehole data"""
    name: str
    x: float
    y: float
    z_top: float
    z_bottom: float
    layers: List[Dict[str, Any]]


class IndicatorValues3D(BaseModel):
    """Indicator values for 3D visualization"""
    indicator: str
    grid: List[List[float]]
    min: float
    max: float
    mean: float
    std: float
    color_scale: Dict[str, str]  # low, mid, high colors


class Scene3DResponse(BaseModel):
    """Complete 3D scene data"""
    bounds: Dict[str, float]
    layers: List[Layer3D]
    boreholes: List[Borehole3D]
    indicator: Optional[IndicatorValues3D] = None
    stats: Dict[str, Any] = {}


def _generate_layer_vertices(
    bounds: Dict[str, float],
    thickness: float,
    depth_top: float
) -> List[List[float]]:
    """Generate vertices for a horizontal layer plane"""
    min_x, max_x = bounds["min_x"], bounds["max_x"]
    min_y, max_y = bounds["min_y"], bounds["max_y"]

    # Add some padding
    padding = 0.1
    min_x -= padding
    min_y -= padding
    max_x += padding
    max_y += padding

    z = depth_top + thickness / 2

    return [
        [min_x, min_y, z],
        [max_x, min_y, z],
        [max_x, max_y, z],
        [min_x, max_y, z],
    ]


def _generate_borehole_cylinder(
    x: float,
    y: float,
    z_top: float,
    z_bottom: float,
    radius: float = 0.5,
    segments: int = 16
) -> Dict[str, Any]:
    """Generate cylinder geometry for a borehole"""
    import math

    vertices = []
    faces = []

    # Top circle
    for i in range(segments):
        angle = 2 * math.pi * i / segments
        x_pos = x + radius * math.cos(angle)
        y_pos = y + radius * math.sin(angle)
        vertices.append([x_pos, y_pos, z_top])

    # Bottom circle
    for i in range(segments):
        angle = 2 * math.pi * i / segments
        x_pos = x + radius * math.cos(angle)
        y_pos = y + radius * math.sin(angle)
        vertices.append([x_pos, y_pos, z_bottom])

    # Side faces
    for i in range(segments - 1):
        next_i = (i + 1) % segments
        top_offset = i
        bottom_offset = i + segments
        faces.append([
            top_offset,
            top_offset + 1,
            bottom_offset,
        ])
        faces.append([
            top_offset + 1,
            next_i + 1,
            bottom_offset + 1,
        ])

    return {
        "vertices": vertices,
        "faces": faces,
    }


def _get_indicator_color_scale(indicator: str) -> Dict[str, str]:
    """Get color scale for an indicator"""
    scales = {
        "mpi": {"low": "#22c55e", "mid": "#f59e0b", "high": "#ef4444"},
        "rsi": {"low": "#3b82f6", "mid": "#10b981", "high": "#06b6d4"},
        "bri": {"low": "#8b5cf6", "mid": "#a855f7", "high": "#ef4444"},
        "asi": {"low": "#06b6d4", "mid": "#84cc16", "high": "#22c55e"},
    }
    return scales.get(indicator, scales["mpi"])


@router.get("/data", response_model=Scene3DResponse, summary="Get 3D scene data")
async def get_scene_3d_data(
    seam_name: str = Query(..., description="煤层名称"),
    indicator: str = Query(default="mpi", description="指标类型"),
    resolution: int = Query(default=50, description="分辨率"),
) -> Scene3DResponse:
    """
    获取3D场景数据，包含：
    - 地质层（3D顶点）
    - 钻孔（3D圆柱）
    - 指标值（用于热力图叠加）
    - 边界和统计
    """
    from app.services.coal_seam_parser import get_all_coal_seams, get_coal_seam_data
    from app.core.config import get_data_dir
    from pathlib import Path

    try:
        # Get seam data
        data_dir = get_data_dir()
        seam_data = get_coal_seam_data(seam_name, data_dir)

        if not seam_data:
            raise HTTPException(status_code=404, detail=f"Seam not found: {seam_name}")

        # Parse boreholes
        boreholes = seam_data.get("boreholes", [])
        if not boreholes:
            raise HTTPException(status_code=404, detail="No borehole data found")

        # Calculate bounds
        x_coords = [bh.get("x", 0) for bh in boreholes]
        y_coords = [bh.get("y", 0) for bh in boreholes]

        if not x_coords or not y_coords:
            raise HTTPException(status_code=400, detail="Invalid coordinate data")

        bounds = {
            "min_x": float(min(x_coords)),
            "max_x": float(max(x_coords)),
            "min_y": float(min(y_coords)),
            "max_y": float(max(y_coords)),
        }

        # Generate layers
        layers = []
        layer_thicknesses = {}

        # Collect layer data from all boreholes
        for bh in boreholes:
            layers_data = bh.get("layers", {})
            for layer_name, thickness in layers_data.items():
                if layer_name not in layer_thicknesses:
                    layer_thicknesses[layer_name] = []
                layer_thicknesses[layer_name].append(thickness)

        # Generate layer meshes
        layer_id = 0
        for layer_name, thicknesses in layer_thicknesses.items():
            if not thicknesses:
                continue

            avg_thickness = sum(thicknesses) / len(thicknesses)

            # Estimate depth (simplified - would need overburden data)
            depth_top = 450 - layer_id * avg_thickness
            depth_bottom = depth_top + avg_thickness

            vertices = _generate_layer_vertices(bounds, avg_thickness, depth_top)

            layers.append(Layer3D(
                id=f"layer_{layer_id}",
                name=layer_name,
                display_name=layer_name,
                color=_get_layer_color(layer_name),
                thickness=avg_thickness,
                depth_top=depth_top,
                depth_bottom=depth_bottom,
                vertices=vertices,
                faces=[[0, 1, 2, 3]],  # Two triangles per quad
            ))
            layer_id += 1

        # Generate boreholes
        borehole_3d_list = []
        for bh in boreholes:
            bh_name = bh.get("name", "")
            x = bh.get("x", 0)
            y = bh.get("y", 0)
            total_thickness = bh.get("total_thickness", 0)

            z_top = 500 - total_thickness / 2
            z_bottom = z_top + total_thickness

            # Generate cylinder geometry
            cylinder = _generate_borehole_cylinder(x, y, z_top, z_bottom)
            layers_data = []

            # Add layer info
            layers_data_obj = bh.get("layers", {})
            for layer_name, thickness in layers_data_obj.items():
                layers_data.append({
                    "name": layer_name,
                    "thickness": thickness,
                })

            borehole_3d_list.append(Borehole3D(
                name=bh_name,
                x=float(x),
                y=float(y),
                z_top=float(z_top),
                z_bottom=float(z_bottom),
                layers=layers_data,
            ))

        # Generate indicator data (simplified - would calculate from actual data)
        indicator = None
        if indicator:
            # Generate a simple grid with demo values
            grid_size = resolution
            grid = []
            for i in range(grid_size):
                row = []
                for j in range(grid_size):
                    # Generate some plausible values based on position
                    x_ratio = (j / grid_size)
                    y_ratio = (i / grid_size)
                    value = 0.3 + 0.5 * (1 - abs(x_ratio - 0.5) * (1 - abs(y_ratio - 0.5)))
                    row.append(round(value, 3))
                grid.append(row)

            # Calculate stats
            flat_values = [v for row in grid for v in row]
            indicator = IndicatorValues3D(
                indicator=indicator,
                grid=grid,
                min=float(min(flat_values)),
                max=float(max(flat_values)),
                mean=float(sum(flat_values) / len(flat_values)),
                std=0.1,
                color_scale=_get_indicator_color_scale(indicator),
            )

        # Stats
        stats = {
            "borehole_count": len(boreholes),
            "layer_count": len(layers),
            "bounds": bounds,
            "resolution": resolution,
        }

        return Scene3DResponse(
            bounds=bounds,
            layers=layers,
            boreholes=borehole_3d_list,
            indicator=indicator,
            stats=stats,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/indicator/{indicator}", summary="Get specific indicator data")
async def get_indicator_3d(
    indicator: str,
    seam_name: str = Query(..., description="煤层名称"),
    resolution: int = Query(default=50, description="分辨率"),
) -> Dict[str, Any]:
    """获取特定指标的3D可视化数据"""
    # This would integrate with actual calculation services
    # For now, return a placeholder
    return {
        "indicator": indicator,
        "seam_name": seam_name,
        "resolution": resolution,
        "grid_size": resolution,
        "color_scale": _get_indicator_color_scale(indicator),
        "message": "Use /scene3d/data endpoint for full scene data",
    }


def _get_layer_color(name: str) -> str:
    """Generate consistent color for layer name"""
    colors = [
        "#8B5CF6", "#EC4899", "#F59E0B", "#10B981",
        "#3B82F6", "#6366F1", "#14B8A6", "#F97316",
    ]
    hash = 0
    for char in name:
        hash = ord(char) + ((hash << 5) - hash)
    return colors[hash % len(colors)]
