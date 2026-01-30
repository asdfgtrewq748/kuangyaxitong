"""
岩石力学参数数据库模块

从汇总表.csv加载岩石力学参数，支持按岩性、矿名查询。

数据来源: 汇总表.csv
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Any

import numpy as np
import pandas as pd

from .csv_loader import read_csv_robust

# 项目根目录
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
DEFAULT_DB_PATH = PROJECT_ROOT / "汇总表.csv"


@dataclass
class RockParams:
    """岩石力学参数数据类"""

    # 基础信息
    lithology: str  # 岩性
    mine: str = ""  # 矿名
    province: str = ""  # 省份
    city: str = ""  # 市/县
    source: str = ""  # 文献来源

    # 力学参数
    density: Optional[float] = None  # 密度 kg/m³
    bulk_modulus: Optional[float] = None  # 体积模量 GPa
    shear_modulus: Optional[float] = None  # 剪切模量 GPa
    cohesion: Optional[float] = None  # 内聚力 MPa
    friction_angle: Optional[float] = None  # 内摩擦角 °
    tensile_strength: Optional[float] = None  # 抗拉强度 MPa
    compressive_strength: Optional[float] = None  # 抗压强度 MPa
    elastic_modulus: Optional[float] = None  # 弹性模量 GPa
    poisson_ratio: Optional[float] = None  # 泊松比

    # 位置信息
    depth: Optional[float] = None  # 埋深 m
    thickness: Optional[float] = None  # 厚度 m

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return {
            "lithology": self.lithology,
            "mine": self.mine,
            "province": self.province,
            "city": self.city,
            "source": self.source,
            "density": self.density,
            "bulk_modulus": self.bulk_modulus,
            "shear_modulus": self.shear_modulus,
            "cohesion": self.cohesion,
            "friction_angle": self.friction_angle,
            "tensile_strength": self.tensile_strength,
            "compressive_strength": self.compressive_strength,
            "elastic_modulus": self.elastic_modulus,
            "poisson_ratio": self.poisson_ratio,
            "depth": self.depth,
            "thickness": self.thickness,
        }

    @classmethod
    def from_row(cls, row: pd.Series) -> "RockParams":
        """从DataFrame行创建"""
        return cls(
            lithology=str(row.get("岩性", "")).strip(),
            mine=str(row.get("矿名", "")).strip(),
            province=str(row.get("份", "")).strip(),
            city=str(row.get("市/县", "")).strip(),
            source=str(row.get("文献", "")).strip(),
            density=_parse_float(row.get("密度（kg*m3）")),
            bulk_modulus=_parse_float(row.get("体积模量（Gpa）")),
            shear_modulus=_parse_float(row.get("剪切模量/GPa")),
            cohesion=_parse_float(row.get("内聚力（MPa）")),
            friction_angle=_parse_float(row.get("内摩擦角")),
            tensile_strength=_parse_float(row.get("抗拉强度（MPa）")),
            compressive_strength=_parse_float(row.get("抗压强度/MPa")),
            elastic_modulus=_parse_float(row.get("弹性模量（Gpa）")),
            poisson_ratio=_parse_float(row.get("泊松比")),
            depth=_parse_float(row.get("埋深")),
            thickness=_parse_float(row.get("厚度")),
        )


def _parse_float(value: Any) -> Optional[float]:
    """安全解析浮点数"""
    if pd.isna(value) or value is None or value == "":
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


# 岩性同义词映射表
# 基于汇总表.csv中194种岩性统计分析得出
LITHOLOGY_SYNONYMS: Dict[str, List[str]] = {
    # ===== 砂岩类 =====
    "粉砂岩": [
        "粉砂质泥岩", "粉细砂岩", "细粉砂岩", "粉粒砂岩",
        "粉砂岩泥岩互层", "细、粉砂岩", "粉细砂岩互层",
    ],
    "细砂岩": [
        "细粒砂岩", "细粒长石砂岩", "石英细砂岩",
        "细砂岩泥岩互层", "细、粉砂岩",
    ],
    "中砂岩": [
        "中粒砂岩", "中粒长石砂岩", "泥质中砂岩",
        "含砾中砂岩", "钙质中砂岩",
    ],
    "粗砂岩": [
        "粗粒砂岩", "含砾粗砂岩", "中粗砂岩",
        "粗-细砂岩", "中粗砂岩",
    ],
    "砂岩": [
        "石英砂岩", "泥质砂岩", "中细砂岩", "中细砂岩互层",
        "砂岩互层", "砂泥岩互层", "泥岩砂岩互层",
        "风化砂岩", "粗砂岩、中砂岩", "粗砂岩、粉砂岩",
    ],
    "砂质泥岩": ["泥质粉砂岩", "粉沙泥岩", "砂泥岩", "泥岩及砂质泥岩"],
    "砂质砾岩": ["砂岩砾岩互层", "含砾砂岩"],

    # ===== 泥岩类 =====
    "泥岩": [
        "砂质泥岩", "粉砂质泥岩", "碳质泥岩", "粉砂质泥岩",
        "软泥岩", "灰质泥岩", "灰泥岩", "高岭质泥岩", "铝质泥岩",
        "泥岩3", "泥岩层组",
    ],
    "砾岩": ["砂砾岩", "中砾岩", "细砾岩", "含砾砂岩", "砂质砾岩"],
    "石灰岩": ["灰岩", "大青石灰岩"],

    # ===== 煤层类（汇总表中的煤层命名变体）=====
    "煤层": [
        "煤", "煤炭", "2-1煤", "2-2煤", "2-2#煤", "2#煤",
        "3#煤", "3#下煤", "3-5\"煤", "3-煤", "3号煤", "3煤", "3上煤",
        "5#煤", "5煤", "5号煤", "6#煤", "6#煤层", "6煤", "6号煤",
        "7#煤层", "8#煤", "8煤、9煤", "8煤", "9#煤", "9#煤层", "9煤", "10#煤", "10煤", "10号煤",
        "11#煤", "11-1煤", "12煤", "12上煤", "13-2煤", "13煤、泥岩", "14#煤", "14\"煤", "14煤", "15#煤", "15煤", "15号煤",
        "16煤", "16号煤", "1#、5#煤", "1#煤", "1煤", "1-2煤",
        "2煤", "26煤", "27煤", "4#煤", "4#煤层", "4煤", "4号煤", "4-2煤",
        "K1煤", "M6煤层", "M7煤层", "M8煤层",
        "B1+2煤", "B2煤", "B3+6煤", "B4煤", "B4-1煤", "B10煤", "B12煤",
        "F1煤", "F2煤",
        "C3#煤层",
        "煤层1", "煤层2", "煤一层", "煤二层",
        "煤线",
    ],

    # ===== 表土/松散层 =====
    "表土层": ["黄土", "松散层"],

    # ===== 复合岩性（主要成分优先）=====
    "泥煤互层": ["泥岩细砂岩互层"],
    "砂岩互层": ["粉砂岩泥岩互层", "粗砂岩泥岩互层", "粉砂岩、细砂岩", "粗砂岩、中砂岩"],
}


class RockParamsDatabase:
    """
    岩石力学参数数据库

    从汇总表.csv加载参数数据，支持按岩性、矿名查询。
    """

    def __init__(self, db_path: Optional[Path] = None):
        """
        初始化数据库

        Args:
            db_path: 数据库文件路径，默认使用项目根目录的汇总表.csv
        """
        self.db_path = db_path or DEFAULT_DB_PATH
        self.data: pd.DataFrame = pd.DataFrame()
        self._index_by_lithology: Dict[str, List[int]] = {}
        self._index_by_mine: Dict[str, List[int]] = {}
        self._stats_cache: Dict[str, Dict[str, float]] = {}

        self._load()
        self._build_indexes()

    def _load(self):
        """加载数据"""
        if not self.db_path.exists():
            raise FileNotFoundError(f"数据库文件不存在: {self.db_path}")

        self.data = read_csv_robust(self.db_path)
        print(f"[RockParamsDB] 加载数据: {len(self.data)} 条记录")

    def _build_indexes(self):
        """构建查询索引"""
        # 按岩性索引
        for idx, row in self.data.iterrows():
            lithology = str(row.get("岩性", "")).strip()
            if lithology:
                if lithology not in self._index_by_lithology:
                    self._index_by_lithology[lithology] = []
                self._index_by_lithology[lithology].append(idx)

        # 按矿名索引
        for idx, row in self.data.iterrows():
            mine = str(row.get("矿名", "")).strip()
            if mine:
                if mine not in self._index_by_mine:
                    self._index_by_mine[mine] = []
                self._index_by_mine[mine].append(idx)

        print(f"[RockParamsDB] 构建索引: {len(self._index_by_lithology)} 种岩性, {len(self._index_by_mine)} 个矿名")

    def get_by_lithology(self, lithology: str, use_synonyms: bool = True) -> List[RockParams]:
        """
        按岩性查询参数

        Args:
            lithology: 岩性名称
            use_synonyms: 是否使用同义词匹配

        Returns:
            参数列表
        """
        results = []
        indices = set()

        # 精确匹配
        if lithology in self._index_by_lithology:
            indices.update(self._index_by_lithology[lithology])

        # 同义词匹配
        if use_synonyms:
            for standard_name, synonyms in LITHOLOGY_SYNONYMS.items():
                if lithology in synonyms or lithology == standard_name:
                    if standard_name in self._index_by_lithology:
                        indices.update(self._index_by_lithology[standard_name])
                    # 也查找同义词
                    for syn in synonyms:
                        if syn in self._index_by_lithology:
                            indices.update(self._index_by_lithology[syn])

        # 转换为结果
        for idx in indices:
            row = self.data.iloc[idx]
            results.append(RockParams.from_row(row))

        return results

    def get_params_by_lithology(self, lithology: str, use_synonyms: bool = True) -> Dict[str, float]:
        """
        按岩性获取统计参数（均值）

        Args:
            lithology: 岩性名称
            use_synonyms: 是否使用同义词匹配

        Returns:
            参数字典（均值）
        """
        cache_key = f"{lithology}_{use_synonyms}"
        if cache_key in self._stats_cache:
            return self._stats_cache[cache_key]

        records = self.get_by_lithology(lithology, use_synonyms)
        if not records:
            return {}

        # 计算均值
        params = {
            "count": len(records),
            "density": _mean([r.density for r in records if r.density is not None]),
            "bulk_modulus": _mean([r.bulk_modulus for r in records if r.bulk_modulus is not None]),
            "shear_modulus": _mean([r.shear_modulus for r in records if r.shear_modulus is not None]),
            "cohesion": _mean([r.cohesion for r in records if r.cohesion is not None]),
            "friction_angle": _mean([r.friction_angle for r in records if r.friction_angle is not None]),
            "tensile_strength": _mean([r.tensile_strength for r in records if r.tensile_strength is not None]),
            "compressive_strength": _mean([r.compressive_strength for r in records if r.compressive_strength is not None]),
            "elastic_modulus": _mean([r.elastic_modulus for r in records if r.elastic_modulus is not None]),
            "poisson_ratio": _mean([r.poisson_ratio for r in records if r.poisson_ratio is not None]),
        }

        self._stats_cache[cache_key] = params
        return params

    def get_by_mine(self, mine_name: str) -> List[RockParams]:
        """
        按矿名查询所有岩层参数

        Args:
            mine_name: 矿名

        Returns:
            参数列表
        """
        results = []
        indices = self._index_by_mine.get(mine_name, [])

        for idx in indices:
            row = self.data.iloc[idx]
            results.append(RockParams.from_row(row))

        return results

    def get_all_lithologies(self) -> List[str]:
        """获取所有岩性名称"""
        return list(self._index_by_lithology.keys())

    def get_all_mines(self) -> List[str]:
        """获取所有矿名"""
        return list(self._index_by_mine.keys())

    def get_statistics(self) -> Dict[str, Any]:
        """
        获取数据库统计信息

        Returns:
            统计信息字典
        """
        total_records = len(self.data)

        # 参数覆盖率统计
        coverage = {
            "density": _coverage_ratio(self.data.get("密度（kg*m3）")),
            "bulk_modulus": _coverage_ratio(self.data.get("体积模量（Gpa）")),
            "shear_modulus": _coverage_ratio(self.data.get("剪切模量/GPa")),
            "cohesion": _coverage_ratio(self.data.get("内聚力（MPa）")),
            "friction_angle": _coverage_ratio(self.data.get("内摩擦角")),
            "tensile_strength": _coverage_ratio(self.data.get("抗拉强度（MPa）")),
            "compressive_strength": _coverage_ratio(self.data.get("抗压强度/MPa")),
            "elastic_modulus": _coverage_ratio(self.data.get("弹性模量（Gpa）")),
            "poisson_ratio": _coverage_ratio(self.data.get("泊松比")),
        }

        return {
            "total_records": total_records,
            "unique_lithologies": len(self._index_by_lithology),
            "unique_mines": len(self._index_by_mine),
            "parameter_coverage": coverage,
        }


def _mean(values: List[float]) -> Optional[float]:
    """计算均值"""
    if not values:
        return None
    return float(np.mean(values))


def _coverage_ratio(series: pd.Series) -> float:
    """计算参数覆盖率"""
    if series is None:
        return 0.0
    valid_count = series.notna().sum()
    total_count = len(series)
    return round(valid_count / total_count * 100, 2) if total_count > 0 else 0.0


# 全局数据库实例
_global_db: Optional[RockParamsDatabase] = None


def get_database(db_path: Optional[Path] = None) -> RockParamsDatabase:
    """
    获取全局数据库实例

    Args:
        db_path: 数据库文件路径

    Returns:
        RockParamsDatabase实例
    """
    global _global_db
    if _global_db is None:
        _global_db = RockParamsDatabase(db_path)
    return _global_db


def get_params_by_lithology(lithology: str, use_synonyms: bool = True) -> Dict[str, float]:
    """
    便捷函数：按岩性获取参数

    Args:
        lithology: 岩性名称
        use_synonyms: 是否使用同义词匹配

    Returns:
        参数字典
    """
    db = get_database()
    params = db.get_params_by_lithology(lithology, use_synonyms)

    # 如果没有找到数据，使用默认参数
    if not params or params.get("count", 0) == 0:
        params = get_default_params(lithology)

    return params


# 默认岩石力学参数库（基于文献和工程经验）
# 参考：《岩石力学与工程》、《煤矿安全规程》等
DEFAULT_PARAMS: Dict[str, Dict[str, float]] = {
    # ===== 砂岩类 =====
    "粉砂岩": {
        "density": 2550.0,
        "bulk_modulus": 8.0,
        "shear_modulus": 5.0,
        "cohesion": 4.0,
        "friction_angle": 32.0,
        "tensile_strength": 2.5,
        "compressive_strength": 45.0,
        "elastic_modulus": 15.0,
        "poisson_ratio": 0.25,
    },
    "细砂岩": {
        "density": 2650.0,
        "bulk_modulus": 12.0,
        "shear_modulus": 8.0,
        "cohesion": 5.0,
        "friction_angle": 34.0,
        "tensile_strength": 3.5,
        "compressive_strength": 55.0,
        "elastic_modulus": 20.0,
        "poisson_ratio": 0.23,
    },
    "中砂岩": {
        "density": 2600.0,
        "bulk_modulus": 10.0,
        "shear_modulus": 6.5,
        "cohesion": 4.5,
        "friction_angle": 33.0,
        "tensile_strength": 3.0,
        "compressive_strength": 50.0,
        "elastic_modulus": 18.0,
        "poisson_ratio": 0.24,
    },
    "粗砂岩": {
        "density": 2580.0,
        "bulk_modulus": 9.0,
        "shear_modulus": 6.0,
        "cohesion": 4.2,
        "friction_angle": 33.0,
        "tensile_strength": 2.8,
        "compressive_strength": 48.0,
        "elastic_modulus": 16.0,
        "poisson_ratio": 0.24,
    },
    "砂岩": {
        "density": 2600.0,
        "bulk_modulus": 10.0,
        "shear_modulus": 6.5,
        "cohesion": 4.5,
        "friction_angle": 33.0,
        "tensile_strength": 3.0,
        "compressive_strength": 50.0,
        "elastic_modulus": 18.0,
        "poisson_ratio": 0.24,
    },

    # ===== 泥岩类 =====
    "泥岩": {
        "density": 2500.0,
        "bulk_modulus": 4.0,
        "shear_modulus": 2.0,
        "cohesion": 2.0,
        "friction_angle": 28.0,
        "tensile_strength": 1.5,
        "compressive_strength": 25.0,
        "elastic_modulus": 8.0,
        "poisson_ratio": 0.30,
    },
    "砂质泥岩": {
        "density": 2530.0,
        "bulk_modulus": 6.0,
        "shear_modulus": 3.5,
        "cohesion": 3.0,
        "friction_angle": 30.0,
        "tensile_strength": 2.0,
        "compressive_strength": 30.0,
        "elastic_modulus": 12.0,
        "poisson_ratio": 0.27,
    },
    "碳质泥岩": {
        "density": 2450.0,
        "bulk_modulus": 3.5,
        "shear_modulus": 1.8,
        "cohesion": 1.8,
        "friction_angle": 26.0,
        "tensile_strength": 1.2,
        "compressive_strength": 20.0,
        "elastic_modulus": 6.0,
        "poisson_ratio": 0.32,
    },

    # ===== 砾岩类 =====
    "砾岩": {
        "density": 2700.0,
        "bulk_modulus": 15.0,
        "shear_modulus": 10.0,
        "cohesion": 6.0,
        "friction_angle": 35.0,
        "tensile_strength": 4.0,
        "compressive_strength": 65.0,
        "elastic_modulus": 25.0,
        "poisson_ratio": 0.22,
    },

    # ===== 石灰岩类 =====
    "石灰岩": {
        "density": 2700.0,
        "bulk_modulus": 25.0,
        "shear_modulus": 15.0,
        "cohesion": 8.0,
        "friction_angle": 38.0,
        "tensile_strength": 5.0,
        "compressive_strength": 80.0,
        "elastic_modulus": 30.0,
        "poisson_ratio": 0.20,
    },

    # ===== 煤层类 =====
    "煤层": {
        "density": 1400.0,
        "bulk_modulus": 2.0,
        "shear_modulus": 1.0,
        "cohesion": 1.5,
        "friction_angle": 25.0,
        "tensile_strength": 0.8,
        "compressive_strength": 15.0,
        "elastic_modulus": 5.0,
        "poisson_ratio": 0.35,
    },

    # ===== 表土/松散层 =====
    "表土层": {
        "density": 1800.0,
        "bulk_modulus": 0.1,
        "shear_modulus": 0.05,
        "cohesion": 0.05,
        "friction_angle": 15.0,
        "tensile_strength": 0.01,
        "compressive_strength": 1.0,
        "elastic_modulus": 0.1,
        "poisson_ratio": 0.40,
    },
}


def get_default_params(lithology: str) -> Dict[str, float]:
    """
    获取岩性默认参数

    Args:
        lithology: 岩性名称

    Returns:
        参数字典
    """
    # 先尝试精确匹配
    if lithology in DEFAULT_PARAMS:
        return DEFAULT_PARAMS[lithology].copy()

    # 尝试从同义词映射中查找标准名称
    for standard_name, synonyms in LITHOLOGY_SYNONYMS.items():
        if lithology in synonyms:
            if standard_name in DEFAULT_PARAMS:
                return DEFAULT_PARAMS[standard_name].copy()

    # 尝试按关键词匹配
    if "砂" in lithology and "泥" in lithology:
        return DEFAULT_PARAMS.get("砂质泥岩", DEFAULT_PARAMS["泥岩"]).copy()
    if "砂岩" in lithology:
        return DEFAULT_PARAMS.get("砂岩", DEFAULT_PARAMS["细砂岩"]).copy()
    if "泥岩" in lithology:
        return DEFAULT_PARAMS["泥岩"].copy()
    if "煤" in lithology:
        return DEFAULT_PARAMS["煤层"].copy()
    if "砾岩" in lithology:
        return DEFAULT_PARAMS["砾岩"].copy()
    if "石灰岩" in lithology or "灰岩" in lithology:
        return DEFAULT_PARAMS["石灰岩"].copy()

    # 默认使用泥岩参数（保守估计）
    return DEFAULT_PARAMS["泥岩"].copy()


def estimate_missing_params(params: Dict[str, Optional[float]]) -> Dict[str, float]:
    """
    估算缺失参数

    对于None值的参数，使用理论公式或经验关系进行估算。

    Args:
        params: 包含部分参数的字典

    Returns:
        完整的参数字典
    """
    result = params.copy()

    # 如果所有关键参数都缺失，使用默认值
    if all(v is None for v in [result.get("density"), result.get("elastic_modulus"), result.get("compressive_strength")]):
        return get_default_params("泥岩")

    # 密度估算（基于岩性）
    if result.get("density") is None:
        if "煤" in str(params.get("lithology", "")):
            result["density"] = 1400.0
        elif "砾岩" in str(params.get("lithology", "")):
            result["density"] = 2700.0
        elif "灰岩" in str(params.get("lithology", "")) or "石灰岩" in str(params.get("lithology", "")):
            result["density"] = 2700.0
        elif "砂" in str(params.get("lithology", "")):
            result["density"] = 2600.0
        else:
            result["density"] = 2500.0  # 泥岩默认值

    # 弹性模量与剪切模量的关系: G = E / [2(1+v)]
    if result.get("elastic_modulus") is not None and result.get("shear_modulus") is None:
        E = result["elastic_modulus"]
        v = result.get("poisson_ratio", 0.25)
        result["shear_modulus"] = E / (2 * (1 + v))

    # 体积模量估算: K = E / [3(1-2v)]
    if result.get("elastic_modulus") is not None and result.get("bulk_modulus") is None:
        E = result["elastic_modulus"]
        v = result.get("poisson_ratio", 0.25)
        result["bulk_modulus"] = E / (3 * (1 - 2 * v))

    # 泊松比估算
    if result.get("poisson_ratio") is None:
        if "煤" in str(params.get("lithology", "")):
            result["poisson_ratio"] = 0.35
        elif "砾岩" in str(params.get("lithology", "")):
            result["poisson_ratio"] = 0.22
        elif "灰岩" in str(params.get("lithology", "")) or "石灰岩" in str(params.get("lithology", "")):
            result["poisson_ratio"] = 0.20
        else:
            result["poisson_ratio"] = 0.25  # 砂岩/泥岩默认值

    # 抗压强度与抗拉强度的关系: σt ≈ σc / 15
    if result.get("compressive_strength") is not None and result.get("tensile_strength") is None:
        result["tensile_strength"] = result["compressive_strength"] / 15
    # 抗压强度估算（基于抗拉强度）
    elif result.get("tensile_strength") is not None and result.get("compressive_strength") is None:
        result["compressive_strength"] = result["tensile_strength"] * 15
    # 两者都缺失时，使用经验公式估算
    elif result.get("compressive_strength") is None and result.get("tensile_strength") is None:
        # 基于岩性估算
        lithology = str(params.get("lithology", "")).lower()
        if "煤" in lithology:
            result["compressive_strength"] = 15.0
            result["tensile_strength"] = 1.0
        elif "砾岩" in lithology or "石灰岩" in lithology or "灰岩" in lithology:
            result["compressive_strength"] = 70.0
            result["tensile_strength"] = 4.5
        elif "砂岩" in lithology:
            result["compressive_strength"] = 50.0
            result["tensile_strength"] = 3.0
        else:  # 泥岩
            result["compressive_strength"] = 25.0
            result["tensile_strength"] = 1.5

    # 内摩擦角估算
    if result.get("friction_angle") is None:
        if "煤" in str(params.get("lithology", "")):
            result["friction_angle"] = 25.0
        elif "砾岩" in str(params.get("lithology", "")):
            result["friction_angle"] = 35.0
        elif "灰岩" in str(params.get("lithology", "")) or "石灰岩" in str(params.get("lithology", "")):
            result["friction_angle"] = 38.0
        else:
            result["friction_angle"] = 30.0  # 砂岩/泥岩默认值

    # 内聚力估算
    if result.get("cohesion") is None:
        if "煤" in str(params.get("lithology", "")):
            result["cohesion"] = 1.5
        else:
            result["cohesion"] = 3.0  # 岩石默认值

    return result
