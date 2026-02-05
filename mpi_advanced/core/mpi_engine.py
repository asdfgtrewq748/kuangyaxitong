"""
MPI Advanced - 主控制引擎
整合所有模块，提供统一接口
"""

import logging
from typing import Optional, Dict, Any, List
from datetime import datetime

from .data_models import (
    GeologyModel, MonitoringData, MPIResult,
    SimulationScenario
)
from .interfaces import BaseUncertaintyMethod

from ..indicators.rsi_indicator import RSIIndicator
from ..indicators.bri_indicator import BRIIndicator
from ..indicators.asi_indicator import ASIIndicator

# 学术升级版
from ..indicators.rsi_phase_field import RSIIndicatorPhaseField, create_phase_field_analytical
from ..indicators.bri_microseismic import BRIIndicatorMicroseismic, create_bri_microseismic_full
from ..indicators.asi_indicator_ust import ASIIndicatorUST, create_asi_ust_standard

# 融合方法
from ..fusion.dbn_fusion import DBNFusionMethod
from ..fusion.dbn_fusion_advanced import DBNFusionAdvanced, create_dbn_fusion_basic


class MPIEngine:
    """
    MPI高级评估引擎

    整合RSI、BRI、ASI三个子指标和DBN融合方法，
    提供完整的矿压影响评价功能。
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None, use_academic_version: bool = True):
        """
        初始化MPI引擎

        Args:
            config: 配置字典，可自定义各模块参数
            use_academic_version: 是否使用学术升级版（相场/微震/统一强度理论/DBN）
        """
        self.logger = logging.getLogger(__name__)
        self.config = config or {}
        self.use_academic_version = use_academic_version

        # 初始化各模块
        if use_academic_version:
            # 学术升级版
            self.rsi_indicator = create_phase_field_analytical()
            self.bri_indicator = create_bri_microseismic_full()
            self.asi_indicator = create_asi_ust_standard()
            self.fusion_method = create_dbn_fusion_basic()
            self.logger.info("使用学术升级版指标和DBN融合")
        else:
            # 基础版
            self.rsi_indicator = RSIIndicator()
            self.bri_indicator = BRIIndicator()
            self.asi_indicator = ASIIndicator()
            self.fusion_method = DBNFusionMethod()
            self.logger.info("使用基础版指标和线性融合")

        # 不确定性方法（可选）
        self.uncertainty_method: Optional[BaseUncertaintyMethod] = None

        # 配置各模块
        self._configure_modules()

        # 状态记录
        self.last_result: Optional[MPIResult] = None
        self.computation_history: List[MPIResult] = []

    def _configure_modules(self):
        """根据配置设置各模块参数"""
        # RSI配置
        if 'rsi' in self.config:
            self.rsi_indicator.configure(self.config['rsi'])

        # BRI配置
        if 'bri' in self.config:
            self.bri_indicator.configure(self.config['bri'])

        # ASI配置
        if 'asi' in self.config:
            self.asi_indicator.configure(self.config['asi'])

        # 融合配置
        if 'fusion' in self.config:
            self.fusion_method.configure(self.config['fusion'])

    def evaluate(self,
                 geology: GeologyModel,
                 monitoring: Optional[MonitoringData] = None,
                 use_uncertainty: bool = False,
                 n_scenarios: int = 100) -> Dict[str, Any]:
        """
        执行完整的MPI评估

        Args:
            geology: 地质模型
            monitoring: 监测数据（可选）
            use_uncertainty: 是否进行不确定性分析
            n_scenarios: 模拟场景数量（不确定性分析用）

        Returns:
            包含评估结果的字典
        """
        self.logger.info("开始MPI评估...")

        # 步骤1：验证输入数据
        validation = self._validate_inputs(geology, monitoring)
        if not validation['valid']:
            return {
                'success': False,
                'error': validation['errors'],
                'result': None
            }

        # 步骤2：计算三个子指标
        self.logger.info("计算子指标...")
        rsi_result = self.rsi_indicator.compute(geology, monitoring)
        bri_result = self.bri_indicator.compute(geology, monitoring)
        asi_result = self.asi_indicator.compute(geology, monitoring)

        sub_results = {
            'RSI': rsi_result,
            'BRI': bri_result,
            'ASI': asi_result
        }

        # 检查子指标有效性
        invalid_indicators = [
            name for name, result in sub_results.items()
            if not result.is_valid
        ]

        if invalid_indicators:
            self.logger.warning(f"以下指标计算失败: {invalid_indicators}")

        # 步骤3：融合三个指标
        self.logger.info("融合指标...")
        mpi_result = self.fusion_method.fuse(
            rsi_result, bri_result, asi_result
        )

        # 步骤4：不确定性分析（可选）
        uncertainty_results = None
        if use_uncertainty and self.uncertainty_method:
            self.logger.info(f"进行不确定性分析 ({n_scenarios} 场景)...")
            uncertainty_results = self._uncertainty_analysis(
                geology, monitoring, n_scenarios
            )

        # 步骤5：组装结果
        result = {
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'result': mpi_result,
            'sub_indicators': sub_results,
            'validation': validation,
            'uncertainty': uncertainty_results,
            'data_quality': self._assess_data_quality(geology, monitoring)
        }

        # 记录历史
        self.last_result = mpi_result
        self.computation_history.append(mpi_result)

        self.logger.info(f"MPI评估完成: {mpi_result.mpi_value:.2f} "
                        f"({mpi_result.risk_level.value})")

        return result

    def evaluate_scenario(self, scenario: SimulationScenario) -> MPIResult:
        """
        评估单个模拟场景

        用于不确定性分析中的批量计算
        """
        return self.evaluate(
            scenario.geology,
            None,  # 模拟场景通常不包含监测数据
            use_uncertainty=False
        )['result']

    def batch_evaluate(self,
                      scenarios: List[SimulationScenario]) -> List[MPIResult]:
        """批量评估多个场景"""
        results = []
        for i, scenario in enumerate(scenarios):
            self.logger.info(f"评估场景 {i+1}/{len(scenarios)}...")
            result = self.evaluate_scenario(scenario)
            results.append(result)
        return results

    def _validate_inputs(self,
                        geology: GeologyModel,
                        monitoring: Optional[MonitoringData]) -> Dict:
        """验证输入数据"""
        errors = []
        warnings = []

        # 验证地质模型
        if not geology.layers:
            errors.append("地质模型为空")
        else:
            # 检查必要岩层
            has_coal = any(l.layer_type.name == 'COAL'
                          for l in geology.layers)
            if not has_coal:
                warnings.append("未找到煤层")

        # 验证开采参数
        if geology.mining_params.mining_depth <= 0:
            errors.append("开采深度必须大于0")

        # 验证各模块的输入要求
        if not self.rsi_indicator.validate_input(geology, monitoring):
            warnings.append("RSI模块: 输入数据不完整")

        if not self.bri_indicator.validate_input(geology, monitoring):
            warnings.append("BRI模块: 输入数据不完整")

        if not self.asi_indicator.validate_input(geology, monitoring):
            warnings.append("ASI模块: 输入数据不完整")

        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }

    def _uncertainty_analysis(self,
                             geology: GeologyModel,
                             monitoring: Optional[MonitoringData],
                             n_scenarios: int) -> Dict[str, Any]:
        """执行不确定性分析（占位）"""
        # 占位实现，未来使用PCE或其他方法
        return {
            'method': 'placeholder',
            'n_scenarios': n_scenarios,
            'message': '不确定性分析模块待实现'
        }

    def _assess_data_quality(self,
                            geology: GeologyModel,
                            monitoring: Optional[MonitoringData]) -> Dict[str, float]:
        """评估数据质量"""
        quality = {}

        # 地质数据质量
        geo_score = min(1.0, len(geology.layers) / 5) * 0.5
        if all(l.elastic_modulus > 0 for l in geology.layers):
            geo_score += 0.3
        if all(l.cohesion > 0 for l in geology.layers):
            geo_score += 0.2
        quality['geology'] = geo_score

        # 监测数据质量
        if monitoring:
            mon_score = 0.0
            if len(monitoring.microseismic_events) > 10:
                mon_score += 0.4
            if len(monitoring.stress_measurements) > 0:
                mon_score += 0.3
            if monitoring.displacement_data is not None:
                mon_score += 0.3
            quality['monitoring'] = mon_score
        else:
            quality['monitoring'] = 0.0

        return quality

    def get_trend_analysis(self, n_history: int = 5) -> Optional[Dict[str, Any]]:
        """获取趋势分析"""
        if len(self.computation_history) < 2:
            return None

        recent = self.computation_history[-n_history:]

        mpi_values = [r.mpi_value for r in recent]
        risk_levels = [r.risk_level for r in recent]

        # 简单统计分析
        return {
            'mpi_mean': sum(mpi_values) / len(mpi_values),
            'mpi_std': (sum((x - sum(mpi_values)/len(mpi_values))**2
                          for x in mpi_values) / len(mpi_values))**0.5,
            'mpi_trend': 'improving' if mpi_values[-1] > mpi_values[0]
                        else 'worsening' if mpi_values[-1] < mpi_values[0]
                        else 'stable',
            'risk_changes': len(set(risk_levels)) > 1,
            'current_trend': self.fusion_method.get_trend()
        }

    def get_module_info(self) -> Dict[str, Any]:
        """获取各模块信息"""
        return {
            'version': 'academic' if self.use_academic_version else 'basic',
            'RSI': {
                'name': self.rsi_indicator.name,
                'version': getattr(self.rsi_indicator, 'version', '1.0'),
                'config': getattr(self.rsi_indicator, 'config', {})
            },
            'BRI': {
                'name': self.bri_indicator.name,
                'version': getattr(self.bri_indicator, 'version', '1.0'),
                'config': getattr(self.bri_indicator, 'config', {})
            },
            'ASI': {
                'name': self.asi_indicator.name,
                'version': getattr(self.asi_indicator, 'version', '1.0'),
                'config': getattr(self.asi_indicator, 'config', {})
            },
            'Fusion': {
                'name': self.fusion_method.name,
                'config': getattr(self.fusion_method, 'config', {})
            }
        }
