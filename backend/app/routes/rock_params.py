"""
岩石力学参数查询API路由

提供以下功能：
- 按岩性查询参数
- 按矿名查询参数
- 获取数据库统计信息
- 获取所有岩性列表
- 获取所有矿名列表
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any

from app.services.rock_params_db import (
    RockParamsDatabase,
    get_database,
    get_params_by_lithology,
    get_default_params,
    estimate_missing_params,
    LITHOLOGY_SYNONYMS,
)


# =============================================================================
# Pydantic Models
# =============================================================================


class RockParamsResponse(BaseModel):
    """岩石力学参数响应"""
    lithology: str = Field(..., description="岩性名称")
    source: str = Field(..., description="数据来源: database | default")
    count: int = Field(..., description="数据样本数")
    density: Optional[float] = Field(None, description="密度 (kg/m³)")
    bulk_modulus: Optional[float] = Field(None, description="体积模量 (GPa)")
    shear_modulus: Optional[float] = Field(None, description="剪切模量 (GPa)")
    cohesion: Optional[float] = Field(None, description="内聚力 (MPa)")
    friction_angle: Optional[float] = Field(None, description="内摩擦角 (°)")
    tensile_strength: Optional[float] = Field(None, description="抗拉强度 (MPa)")
    compressive_strength: Optional[float] = Field(None, description="抗压强度 (MPa)")
    elastic_modulus: Optional[float] = Field(None, description="弹性模量 (GPa)")
    poisson_ratio: Optional[float] = Field(None, description="泊松比")


class LithologyInfo(BaseModel):
    """岩性信息"""
    name: str = Field(..., description="岩性名称")
    is_standard: bool = Field(..., description="是否为标准名称")
    standard_name: Optional[str] = Field(None, description="对应标准名称")


class DatabaseStats(BaseModel):
    """数据库统计信息"""
    total_records: int = Field(..., description="总记录数")
    unique_lithologies: int = Field(..., description="唯一岩性数")
    unique_mines: int = Field(..., description="唯一矿名数")
    parameter_coverage: Dict[str, float] = Field(..., description="参数覆盖率")


# =============================================================================
# Router Setup
# =============================================================================

router = APIRouter(
    prefix="/api/rock-params",
    tags=["岩石力学参数"],
)


# =============================================================================
# API Endpoints
# =============================================================================

@router.get("/query", response_model=RockParamsResponse, summary="按岩性查询参数")
def query_by_lithology(
    lithology: str = Query(..., description="岩性名称，如：砂岩、泥岩、煤层"),
    use_synonyms: bool = Query(True, description="是否使用同义词匹配"),
    include_default: bool = Query(True, description="数据库无数据时是否使用默认值")
) -> RockParamsResponse:
    """
    按岩性查询岩石力学参数

    ## 查询逻辑
    1. 首先在数据库中查找精确匹配
    2. 如果开启同义词匹配，查找同义词数据
    3. 如果数据库无数据且开启默认值，返回默认参数

    ## 参数说明
    - lithology: 岩性名称，如"砂岩"、"泥岩"、"煤层"
    - use_synonyms: 是否启用同义词匹配，如"粉砂岩"匹配"粉砂质泥岩"
    - include_default: 是否在无数据时返回默认参数

    ## 返回值
    - 各参数的统计均值（基于数据库中所有匹配数据）
    - source: 数据来源标识
    """
    db = get_database()

    # 查询参数
    params = db.get_params_by_lithology(lithology, use_synonyms)

    # 如果没有数据且启用默认值
    source = "database"
    if not params or params.get("count", 0) == 0:
        if include_default:
            params = get_default_params(lithology)
            params["count"] = 0
            source = "default"
        else:
            raise HTTPException(
                status_code=404,
                detail=f"未找到岩性 '{lithology}' 的参数数据"
            )

    # 确定标准名称
    standard_name = _get_standard_name(lithology)

    return RockParamsResponse(
        lithology=standard_name or lithology,
        source=source,
        count=params.get("count", 0),
        density=params.get("density"),
        bulk_modulus=params.get("bulk_modulus"),
        shear_modulus=params.get("shear_modulus"),
        cohesion=params.get("cohesion"),
        friction_angle=params.get("friction_angle"),
        tensile_strength=params.get("tensile_strength"),
        compressive_strength=params.get("compressive_strength"),
        elastic_modulus=params.get("elastic_modulus"),
        poisson_ratio=params.get("poisson_ratio"),
    )


@router.get("/stats", response_model=DatabaseStats, summary="获取数据库统计信息")
def get_stats() -> DatabaseStats:
    """
    获取岩石力学参数数据库的统计信息

    ## 返回值
    - total_records: 数据库总记录数
    - unique_lithologies: 唯一岩性数量
    - unique_mines: 唯一矿名数量
    - parameter_coverage: 各参数的数据覆盖率
    """
    db = get_database()
    stats = db.get_statistics()
    return DatabaseStats(**stats)


@router.get("/lithologies", summary="获取所有岩性列表")
def get_lithologies(
    standard_only: bool = Query(False, description="是否只返回标准岩性名称")
) -> Dict[str, Any]:
    """
    获取数据库中所有岩性名称

    ## 参数说明
    - standard_only: 是否只返回标准岩性名称（不含同义词）

    ## 返回值
    - lithologies: 岩性名称列表
    - count: 岩性数量
    """
    db = get_database()
    all_lithologies = db.get_all_lithologies()

    if standard_only:
        # 只返回标准名称（不含同义词）
        standard_names = set(LITHOLOGY_SYNONYMS.keys())
        lithologies = [name for name in all_lithologies if name in standard_names]
    else:
        lithologies = all_lithologies

    return {
        "lithologies": sorted(lithologies),
        "count": len(lithologies)
    }


@router.get("/mines", summary="获取所有矿名列表")
def get_mines() -> Dict[str, Any]:
    """
    获取数据库中所有矿名列表

    ## 返回值
    - mines: 矿名列表
    - count: 矿名数量
    """
    db = get_database()
    mines = db.get_all_mines()

    return {
        "mines": sorted(mines),
        "count": len(mines)
    }


@router.get("/synonyms", summary="获取岩性同义词映射")
def get_synonyms() -> Dict[str, List[str]]:
    """
    获取岩性同义词映射表

    ## 返回值
    - 标准岩性名称 -> 同义词列表 的映射
    """
    return LITHOLOGY_SYNONYMS.copy()


@router.get("/standardize", summary="岩性名称标准化")
def standardize_lithology(
    lithology: str = Query(..., description="待标准化的岩性名称")
) -> Dict[str, Any]:
    """
    将岩性名称转换为标准名称

    ## 功能
    - 输入任意岩性名称，返回对应的标准名称
    - 支持同义词匹配
    - 返回匹配类型（精确/同义词/未知）

    ## 示例
    - "粉砂岩" -> "粉砂岩" (精确)
    - "粉砂质泥岩" -> "粉砂岩" (同义词)
    - "未知岩石" -> "未知岩石" (未知)
    """
    standard_name = _get_standard_name(lithology)

    match_type = "unknown"
    if standard_name == lithology:
        match_type = "exact"
    elif standard_name:
        match_type = "synonym"

    return {
        "input": lithology,
        "standard_name": standard_name or lithology,
        "match_type": match_type
    }


@router.post("/estimate", summary="估算缺失参数")
def estimate_params(
    lithology: str = Query(..., description="岩性名称"),
    density: Optional[float] = Query(None, description="密度 (kg/m³)"),
    bulk_modulus: Optional[float] = Query(None, description="体积模量 (GPa)"),
    shear_modulus: Optional[float] = Query(None, description="剪切模量 (GPa)"),
    cohesion: Optional[float] = Query(None, description="内聚力 (MPa)"),
    friction_angle: Optional[float] = Query(None, description="内摩擦角 (°)"),
    tensile_strength: Optional[float] = Query(None, description="抗拉强度 (MPa)"),
    compressive_strength: Optional[float] = Query(None, description="抗压强度 (MPa)"),
    elastic_modulus: Optional[float] = Query(None, description="弹性模量 (GPa)"),
    poisson_ratio: Optional[float] = Query(None, description="泊松比"),
) -> Dict[str, Any]:
    """
    估算缺失的岩石力学参数

    ## 功能
    - 根据已有参数估算缺失参数
    - 使用理论公式和经验关系
    - 如果所有参数都缺失，返回默认值

    ## 估算公式
    - 剪切模量: G = E / [2(1+v)]
    - 体积模量: K = E / [3(1-2v)]
    - 抗拉强度: σt ≈ σc / 15
    """
    params = {
        "lithology": lithology,
        "density": density,
        "bulk_modulus": bulk_modulus,
        "shear_modulus": shear_modulus,
        "cohesion": cohesion,
        "friction_angle": friction_angle,
        "tensile_strength": tensile_strength,
        "compressive_strength": compressive_strength,
        "elastic_modulus": elastic_modulus,
        "poisson_ratio": poisson_ratio,
    }

    estimated = estimate_missing_params(params)

    # 标记哪些参数是估算的
    estimated_fields = {
        key: value is not None and params.get(key) is None
        for key, value in estimated.items()
        if key != "lithology"
    }

    return {
        "params": estimated,
        "estimated_fields": estimated_fields
    }


@router.get("/default/{lithology}", response_model=RockParamsResponse, summary="获取默认参数")
def get_default_params_endpoint(lithology: str) -> RockParamsResponse:
    """
    获取指定岩性的默认参数

    ## 功能
    - 返回内置默认参数库中的数据
    - 用于数据库无数据时的后备方案
    - 支持同义词匹配

    ## 参数说明
    - lithology: 岩性名称
    """
    params = get_default_params(lithology)
    standard_name = _get_standard_name(lithology)

    return RockParamsResponse(
        lithology=standard_name or lithology,
        source="default",
        count=0,
        density=params.get("density"),
        bulk_modulus=params.get("bulk_modulus"),
        shear_modulus=params.get("shear_modulus"),
        cohesion=params.get("cohesion"),
        friction_angle=params.get("friction_angle"),
        tensile_strength=params.get("tensile_strength"),
        compressive_strength=params.get("compressive_strength"),
        elastic_modulus=params.get("elastic_modulus"),
        poisson_ratio=params.get("poisson_ratio"),
    )


# =============================================================================
# Helper Functions
# =============================================================================

def _get_standard_name(lithology: str) -> Optional[str]:
    """获取岩性的标准名称"""
    lithology_stripped = lithology.strip()

    # 精确匹配
    if lithology_stripped in LITHOLOGY_SYNONYMS:
        return lithology_stripped

    # 同义词匹配
    for standard_name, synonyms in LITHOLOGY_SYNONYMS.items():
        if lithology_stripped in synonyms:
            return standard_name

    # 关键词匹配
    if "砂" in lithology_stripped and "泥" in lithology_stripped:
        return "砂质泥岩"
    if "粉砂" in lithology_stripped:
        return "粉砂岩"
    if "细砂" in lithology_stripped:
        return "细砂岩"
    if "中砂" in lithology_stripped:
        return "中砂岩"
    if "粗砂" in lithology_stripped:
        return "粗砂岩"
    if "砂岩" in lithology_stripped:
        return "砂岩"
    if "泥岩" in lithology_stripped:
        return "泥岩"
    if "砾岩" in lithology_stripped:
        return "砾岩"
    if "石灰岩" in lithology_stripped or "灰岩" in lithology_stripped:
        return "石灰岩"
    if "煤" in lithology_stripped:
        return "煤层"

    return None
