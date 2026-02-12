from __future__ import annotations

from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class GeomodelMethod(str, Enum):
    thickness = "thickness"
    hybrid = "hybrid"
    regression_kriging = "regression_kriging"
    smart_pinchout = "smart_pinchout"


class GeomodelJobStatus(str, Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"


class GeomodelJobCreate(BaseModel):
    method: GeomodelMethod = Field(default=GeomodelMethod.thickness, description="建模方法")
    seam_name: Optional[str] = Field(default=None, description="目标煤层名称（可选）")
    resolution: float = Field(default=20.0, ge=1.0, le=500.0, description="建模分辨率（米）")
    layer_order_method: str = Field(default="position_based", description="层序策略")
    pinchout_strategy: str = Field(default="smooth", description="尖灭策略")
    output_formats: List[str] = Field(
        default_factory=lambda: ["vtk", "vtp", "summary", "quality"],
        description="产物格式列表",
    )
    params: Dict[str, float | int | str | bool] = Field(default_factory=dict, description="附加参数")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "method": "thickness",
                "seam_name": "16-3煤",
                "resolution": 20.0,
                "layer_order_method": "position_based",
                "pinchout_strategy": "smooth",
                "output_formats": ["vtk", "vtp", "summary", "quality"],
            }
        }
    )


class GeomodelArtifactItem(BaseModel):
    name: str
    file_type: str
    size_bytes: int
    updated_at: str
    download_url: str


class GeomodelManifest(BaseModel):
    job_id: str
    method: GeomodelMethod
    created_at: str
    output_dir: str
    input_signature: Dict[str, str | int | float]
    quality_summary: Dict[str, float | int | str]
    artifacts: List[GeomodelArtifactItem]


class GeomodelJobResponse(BaseModel):
    job_id: str
    status: GeomodelJobStatus
    created_at: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    message: str = ""
    error: Optional[str] = None
    result_manifest: Optional[GeomodelManifest] = None


class GeomodelArtifactsResponse(BaseModel):
    job_id: str
    status: GeomodelJobStatus
    artifacts: List[GeomodelArtifactItem]
