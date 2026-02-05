"""
融合模块 - 多指标耦合方法

子模块:
    - dbn_fusion: 基础DBN融合（占位）
    - dbn_fusion_advanced: 完整DBN融合（学术版本）
"""

from .dbn_fusion import DBNFusionMethod, DBNFusionAdvanced as DBNFusionAdvancedPlaceholder
from .dbn_fusion_advanced import (
    DBNFusionAdvanced,
    DynamicBayesianNetwork,
    DBNNode,
    Factor,
    create_dbn_fusion_basic,
    create_dbn_fusion_temporal
)

__all__ = [
    'DBNFusionMethod',
    'DBNFusionAdvancedPlaceholder',
    'DBNFusionAdvanced',
    'DynamicBayesianNetwork',
    'DBNNode',
    'Factor',
    'create_dbn_fusion_basic',
    'create_dbn_fusion_temporal'
]
