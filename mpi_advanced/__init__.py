"""
MPI Advanced - 矿压影响评价系统高级版

学术创新框架实现：
- RSI: 相场断裂模型 (Phase-Field Fracture)
- BRI: 微震矩张量反演 + AI前兆识别
- ASI: 统一强度理论 (Unified Strength Theory)
- Fusion: 动态贝叶斯网络 (Dynamic Bayesian Network)
"""

from .core.data_models import (
    GeologyModel, MiningParameters, GeologyLayer,
    MonitoringData, MicroseismicEvent, StressMeasurement,
    IndicatorResult, MPIResult, RiskLevel,
    GeologyLayerType
)

from .core.mpi_engine import MPIEngine

# 基础指标
from .indicators.rsi_indicator import RSIIndicator
from .indicators.bri_indicator import BRIIndicator
from .indicators.asi_indicator import ASIIndicator

# 学术升级版指标
from .indicators.rsi_phase_field import (
    RSIIndicatorPhaseField,
    PhaseFieldFractureModel,
    create_phase_field_analytical
)
from .indicators.bri_microseismic import (
    BRIIndicatorMicroseismic,
    MomentTensorInversion,
    EnergyDensityField,
    PrecursorPredictor,
    create_bri_microseismic_full,
    create_bri_microseismic_basic
)
from .indicators.asi_indicator_ust import (
    ASIIndicatorUST,
    UnifiedStrengthTheory,
    create_asi_ust_standard,
    create_asi_twin_shear,
    create_asi_mohr_coulomb
)

# 融合方法
from .fusion.dbn_fusion import DBNFusionMethod
from .fusion.dbn_fusion_advanced import (
    DBNFusionAdvanced,
    DynamicBayesianNetwork,
    DBNNode,
    create_dbn_fusion_basic,
    create_dbn_fusion_temporal
)

__version__ = "3.0.0-academic"
__author__ = "学术创新团队"

__all__ = [
    # 核心类
    'MPIEngine',
    'GeologyModel', 'MiningParameters', 'GeologyLayer',
    'MonitoringData', 'MicroseismicEvent', 'StressMeasurement',
    'IndicatorResult', 'MPIResult', 'RiskLevel',
    'GeologyLayerType',

    # 基础指标类
    'RSIIndicator', 'BRIIndicator', 'ASIIndicator',

    # RSI学术升级版 (相场)
    'RSIIndicatorPhaseField',
    'PhaseFieldFractureModel',
    'create_phase_field_analytical',

    # BRI学术升级版 (微震)
    'BRIIndicatorMicroseismic',
    'MomentTensorInversion',
    'EnergyDensityField',
    'PrecursorPredictor',
    'create_bri_microseismic_full',
    'create_bri_microseismic_basic',

    # ASI学术升级版 (UST)
    'ASIIndicatorUST',
    'UnifiedStrengthTheory',
    'create_asi_ust_standard',
    'create_asi_twin_shear',
    'create_asi_mohr_coulomb',

    # 融合方法
    'DBNFusionMethod',
    'DBNFusionAdvanced',
    'DynamicBayesianNetwork',
    'DBNNode',
    'create_dbn_fusion_basic',
    'create_dbn_fusion_temporal',
]
