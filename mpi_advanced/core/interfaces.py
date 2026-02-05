"""
MPI Advanced - 接口定义
定义各模块的标准接口
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Optional, Tuple, Any
import numpy as np

from .data_models import (
    GeologyModel, MonitoringData, IndicatorResult,
    MPIResult, SimulationScenario
)


class BaseIndicator(ABC):
    """指标计算基类"""

    def __init__(self, name: str, version: str = "1.0"):
        self.name = name
        self.version = version
        self.config = {}

    @abstractmethod
    def compute(self, geology: GeologyModel,
                monitoring: Optional[MonitoringData] = None,
                **kwargs) -> IndicatorResult:
        """
        计算指标值

        Args:
            geology: 地质模型
            monitoring: 监测数据（可选）
            **kwargs: 额外参数

        Returns:
            IndicatorResult: 计算结果
        """
        pass

    @abstractmethod
    def validate_input(self, geology: GeologyModel,
                       monitoring: Optional[MonitoringData] = None) -> bool:
        """验证输入数据是否满足计算要求"""
        pass

    def configure(self, config: Dict[str, Any]):
        """配置参数"""
        self.config.update(config)

    def get_required_data(self) -> List[str]:
        """获取计算所需的数据列表"""
        return []


class BaseFusionMethod(ABC):
    """指标融合方法基类"""

    def __init__(self, name: str):
        self.name = name
        self.config = {}

    @abstractmethod
    def fuse(self,
             rsi_result: IndicatorResult,
             bri_result: IndicatorResult,
             asi_result: IndicatorResult,
             **kwargs) -> MPIResult:
        """
        融合三个子指标

        Args:
            rsi_result: RSI计算结果
            bri_result: BRI计算结果
            asi_result: ASI计算结果
            **kwargs: 额外参数

        Returns:
            MPIResult: 融合结果
        """
        pass

    @abstractmethod
    def update_weights(self, evidence: Dict[str, Any]):
        """根据证据更新权重"""
        pass


class BaseUncertaintyMethod(ABC):
    """不确定性量化方法基类"""

    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def generate_scenarios(self, geology: GeologyModel,
                          n_scenarios: int = 100) -> List[SimulationScenario]:
        """
        生成模拟场景

        Args:
            geology: 基础地质模型
            n_scenarios: 场景数量

        Returns:
            List[SimulationScenario]: 场景列表
        """
        pass

    @abstractmethod
    def propagate_uncertainty(self,
                             scenarios: List[SimulationScenario],
                             compute_function) -> Dict[str, np.ndarray]:
        """
        不确定性传播分析

        Args:
            scenarios: 模拟场景列表
            compute_function: 计算函数

        Returns:
            Dict: 统计结果
        """
        pass


class BaseOptimizer(ABC):
    """优化器基类 - 用于勘探优化等"""

    @abstractmethod
    def optimize(self, objective_function,
                 constraints: List,
                 initial_guess: Optional[np.ndarray] = None) -> Dict[str, Any]:
        """执行优化"""
        pass


# 类型别名
IndicatorComputeFunc = callable
FusionComputeFunc = callable
