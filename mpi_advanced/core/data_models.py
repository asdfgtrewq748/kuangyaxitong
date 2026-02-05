"""
MPI Advanced - 基础数据模型
定义系统使用的核心数据结构
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple, Any
from enum import Enum
import numpy as np
from datetime import datetime


class RiskLevel(Enum):
    """风险等级枚举"""
    LOW = "低风险"
    MEDIUM = "中风险"
    HIGH = "高风险"
    UNKNOWN = "未知"


class GeologyLayerType(Enum):
    """岩层类型"""
    COAL = "煤层"
    MUDSTONE = "泥岩"
    SANDSTONE = "砂岩"
    LIMESTONE = "石灰岩"
    SHALE = "页岩"
    UNKNOWN = "未知"


@dataclass
class GeologyLayer:
    """地质岩层数据"""
    name: str
    layer_type: GeologyLayerType
    thickness: float          # 厚度 (m)
    depth_top: float          # 顶板埋深 (m)
    depth_bottom: float       # 底板埋深 (m)

    # 力学参数
    elastic_modulus: float = 10e9      # 弹性模量 (Pa)
    poisson_ratio: float = 0.25        # 泊松比
    cohesion: float = 5e6              # 粘聚力 (Pa)
    friction_angle: float = 30.0       # 内摩擦角 (度)
    tensile_strength: float = 2e6      # 抗拉强度 (Pa)
    fracture_toughness: float = 1.0    # 断裂韧度 (MPa·m^1/2)

    # 其他属性
    density: float = 2500.0            # 密度 (kg/m³)
    description: str = ""              # 描述


@dataclass
class MiningParameters:
    """开采参数"""
    panel_length: float = 200.0        # 采区长度 (m)
    panel_width: float = 200.0         # 采区宽度 (m)
    mining_height: float = 3.5         # 采高 (m)
    mining_depth: float = 500.0        # 开采深度 (m)
    advance_rate: float = 5.0          # 日推进度 (m/day)
    support_pressure: float = 0.5e6    # 支护压力 (Pa)

    # 工作面位置
    face_position: float = 0.0         # 当前位置 (m)
    face_angle: float = 0.0            # 工作面角度 (度)


@dataclass
class MicroseismicEvent:
    """微震事件数据"""
    event_id: str
    timestamp: datetime
    location: np.ndarray               # [x, y, z] 位置 (m)
    magnitude: float                   # 震级
    energy: float                      # 能量 (J)

    # 震源机制 (可选)
    moment_tensor: Optional[np.ndarray] = None  # 3x3 矩张量

    # 波形数据 (可选)
    waveform: Optional[np.ndarray] = None       # 波形数据
    p_arrival: Optional[int] = None             # P波到时索引
    s_arrival: Optional[int] = None             # S波到时索引


@dataclass
class StressMeasurement:
    """应力测量数据"""
    location: np.ndarray               # [x, y, z] 位置 (m)
    stress_tensor: np.ndarray          # 3x3 应力张量 (Pa)
    measurement_time: datetime = field(default_factory=datetime.now)
    measurement_type: str = "hydraulic"  # 测量方法


@dataclass
class IndicatorResult:
    """单指标计算结果"""
    indicator_name: str                # 指标名称
    value: float                       # 指标值 (0-100)
    confidence: float                  # 置信度 (0-1)
    uncertainty_range: Tuple[float, float] = (0, 100)  # 不确定性区间

    # 详细信息
    details: Dict[str, Any] = field(default_factory=dict)

    # 中间计算结果
    intermediate_results: Dict[str, Any] = field(default_factory=dict)

    # 计算时间
    computation_time: datetime = field(default_factory=datetime.now)

    # 有效性
    is_valid: bool = True
    error_message: str = ""


@dataclass
class MPIResult:
    """MPI综合评估结果"""
    mpi_value: float                   # MPI综合值 (0-100)
    risk_level: RiskLevel              # 风险等级
    confidence: float                  # 综合置信度

    # 子指标结果
    rsi_result: Optional[IndicatorResult] = None
    bri_result: Optional[IndicatorResult] = None
    asi_result: Optional[IndicatorResult] = None

    # 动态权重
    weights: Dict[str, float] = field(default_factory=dict)

    # 不确定性分析
    uncertainty_distribution: Optional[np.ndarray] = None
    credible_interval: Tuple[float, float] = (0, 100)

    # 决策建议
    recommendations: List[str] = field(default_factory=list)

    # 计算信息
    computation_time: datetime = field(default_factory=datetime.now)
    computation_method: str = ""


@dataclass
class GeologyModel:
    """地质模型 - 包含所有地质信息"""
    layers: List[GeologyLayer] = field(default_factory=list)
    mining_params: MiningParameters = field(default_factory=MiningParameters)

    # 空间网格
    grid_x: Optional[np.ndarray] = None
    grid_y: Optional[np.ndarray] = None
    grid_z: Optional[np.ndarray] = None

    # 属性场
    property_fields: Dict[str, np.ndarray] = field(default_factory=dict)

    def get_layer_at_depth(self, depth: float) -> Optional[GeologyLayer]:
        """获取指定深度的岩层"""
        for layer in self.layers:
            if layer.depth_top <= depth <= layer.depth_bottom:
                return layer
        return None

    def get_overlying_strata(self, depth: float) -> List[GeologyLayer]:
        """获取指定深度以上的所有岩层"""
        return [l for l in self.layers if l.depth_bottom <= depth]


@dataclass
class MonitoringData:
    """监测数据集合"""
    microseismic_events: List[MicroseismicEvent] = field(default_factory=list)
    stress_measurements: List[StressMeasurement] = field(default_factory=list)
    displacement_data: Optional[np.ndarray] = None
    support_pressure_data: Optional[np.ndarray] = None

    # 时间范围
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


@dataclass
class SimulationScenario:
    """模拟场景 - 用于不确定性分析"""
    scenario_id: int
    geology: GeologyModel
    parameters: Dict[str, Any]
    probability: float = 1.0

    # 结果缓存
    result: Optional[MPIResult] = None
