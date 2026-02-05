"""
Monte Carlo不确定性分析

使用蒙特卡洛方法进行不确定性传播和量化
"""

import numpy as np
from typing import Dict, Any, Optional, List, Callable, Tuple
from dataclasses import dataclass, field
from concurrent.futures import ProcessPoolExecutor, as_completed
import warnings


@dataclass
class MCResult:
    """Monte Carlo分析结果"""
    samples: np.ndarray  # 输入样本
    outputs: np.ndarray  # 输出样本
    mean: float
    std: float
    percentiles: Dict[float, float]  # 分位数
    confidence_interval: Tuple[float, float]  # 置信区间
    n_samples: int
    convergence_achieved: bool = False


class MCSampler:
    """
    Monte Carlo采样器

    支持多种分布类型的参数采样
    """

    @staticmethod
    def sample_uniform(low: float, high: float, n_samples: int) -> np.ndarray:
        """均匀分布采样"""
        return np.random.uniform(low, high, n_samples)

    @staticmethod
    def sample_normal(mean: float, std: float, n_samples: int) -> np.ndarray:
        """正态分布采样"""
        return np.random.normal(mean, std, n_samples)

    @staticmethod
    def sample_lognormal(mean: float, std: float, n_samples: int) -> np.ndarray:
        """对数正态分布采样"""
        return np.random.lognormal(mean, std, n_samples)

    @staticmethod
    def sample_triangular(low: float, mode: float, high: float, n_samples: int) -> np.ndarray:
        """三角分布采样"""
        return np.random.triangular(low, mode, high, n_samples)

    @staticmethod
    def latin_hypercube_sample(bounds: List[Tuple[float, float]], n_samples: int) -> np.ndarray:
        """
        拉丁超立方采样（LHS）

        Args:
            bounds: 各维度的边界 [(low1, high1), (low2, high2), ...]
            n_samples: 样本数

        Returns:
            样本矩阵 (n_samples x n_dims)
        """
        n_dims = len(bounds)
        samples = np.zeros((n_samples, n_dims))

        for i, (low, high) in enumerate(bounds):
            # 分层采样
            intervals = np.linspace(0, 1, n_samples + 1)
            points = np.random.uniform(intervals[:-1], intervals[1:])
            np.random.shuffle(points)

            # 映射到实际范围
            samples[:, i] = low + points * (high - low)

        return samples


class MonteCarloAnalysis:
    """
    Monte Carlo不确定性分析

    功能：
    1. 参数不确定性传播
    2. 置信区间估计
    3. 收敛性检查
    4. 并行计算支持
    """

    def __init__(self, n_samples: int = 1000, confidence_level: float = 0.95,
                 use_parallel: bool = False, n_workers: Optional[int] = None):
        """
        初始化MC分析器

        Args:
            n_samples: 样本数量
            confidence_level: 置信水平
            use_parallel: 是否使用并行计算
            n_workers: 并行工作进程数
        """
        self.n_samples = n_samples
        self.confidence_level = confidence_level
        self.use_parallel = use_parallel
        self.n_workers = n_workers

    def analyze(self,
                model_func: Callable,
                param_distributions: Dict[str, Dict[str, Any]],
                fixed_params: Optional[Dict[str, Any]] = None) -> MCResult:
        """
        执行Monte Carlo分析

        Args:
            model_func: 模型函数 func(**params) -> float
            param_distributions: 参数分布定义
                {
                    'param1': {'type': 'normal', 'mean': 10, 'std': 1},
                    'param2': {'type': 'uniform', 'low': 0, 'high': 100}
                }
            fixed_params: 固定参数

        Returns:
            MCResult对象
        """
        # 生成样本
        samples = self._generate_samples(param_distributions)

        # 评估模型
        if self.use_parallel:
            outputs = self._evaluate_parallel(model_func, samples, fixed_params)
        else:
            outputs = self._evaluate_sequential(model_func, samples, fixed_params)

        # 统计分析
        return self._compute_statistics(samples, outputs)

    def _generate_samples(self, param_distributions: Dict[str, Dict[str, Any]]) -> Dict[str, np.ndarray]:
        """生成参数样本"""
        samples = {}

        for param_name, dist_config in param_distributions.items():
            dist_type = dist_config['type']

            if dist_type == 'normal':
                samples[param_name] = MCSampler.sample_normal(
                    dist_config['mean'], dist_config['std'], self.n_samples
                )
            elif dist_type == 'uniform':
                samples[param_name] = MCSampler.sample_uniform(
                    dist_config['low'], dist_config['high'], self.n_samples
                )
            elif dist_type == 'lognormal':
                samples[param_name] = MCSampler.sample_lognormal(
                    dist_config['mean'], dist_config['std'], self.n_samples
                )
            elif dist_type == 'triangular':
                samples[param_name] = MCSampler.sample_triangular(
                    dist_config['low'], dist_config['mode'], dist_config['high'], self.n_samples
                )
            else:
                raise ValueError(f"不支持的分布类型: {dist_type}")

        return samples

    def _evaluate_sequential(self, model_func: Callable,
                            samples: Dict[str, np.ndarray],
                            fixed_params: Optional[Dict[str, Any]]) -> np.ndarray:
        """顺序评估模型"""
        outputs = np.zeros(self.n_samples)

        for i in range(self.n_samples):
            # 构建参数字典
            params = {k: v[i] for k, v in samples.items()}
            if fixed_params:
                params.update(fixed_params)

            # 评估模型
            try:
                outputs[i] = model_func(**params)
            except Exception as e:
                warnings.warn(f"样本 {i} 评估失败: {e}")
                outputs[i] = np.nan

        return outputs

    def _evaluate_parallel(self, model_func: Callable,
                          samples: Dict[str, np.ndarray],
                          fixed_params: Optional[Dict[str, Any]]) -> np.ndarray:
        """并行评估模型"""
        outputs = np.zeros(self.n_samples)

        # 准备任务
        tasks = []
        for i in range(self.n_samples):
            params = {k: v[i] for k, v in samples.items()}
            if fixed_params:
                params.update(fixed_params)
            tasks.append(params)

        # 并行执行
        with ProcessPoolExecutor(max_workers=self.n_workers) as executor:
            futures = {executor.submit(model_func, **params): i
                      for i, params in enumerate(tasks)}

            for future in as_completed(futures):
                i = futures[future]
                try:
                    outputs[i] = future.result()
                except Exception as e:
                    warnings.warn(f"样本 {i} 评估失败: {e}")
                    outputs[i] = np.nan

        return outputs

    def _compute_statistics(self, samples: Dict[str, np.ndarray],
                           outputs: np.ndarray) -> MCResult:
        """计算统计量"""
        # 移除NaN值
        valid_mask = ~np.isnan(outputs)
        valid_outputs = outputs[valid_mask]

        if len(valid_outputs) == 0:
            raise ValueError("所有样本评估失败")

        # 基本统计量
        mean = np.mean(valid_outputs)
        std = np.std(valid_outputs)

        # 分位数
        percentiles = {
            0.05: np.percentile(valid_outputs, 5),
            0.25: np.percentile(valid_outputs, 25),
            0.50: np.percentile(valid_outputs, 50),
            0.75: np.percentile(valid_outputs, 75),
            0.95: np.percentile(valid_outputs, 95)
        }

        # 置信区间
        alpha = 1 - self.confidence_level
        ci_low = np.percentile(valid_outputs, alpha/2 * 100)
        ci_high = np.percentile(valid_outputs, (1 - alpha/2) * 100)

        # 收敛性检查
        convergence = self._check_convergence(valid_outputs)

        # 构建样本矩阵
        sample_matrix = np.column_stack([samples[k] for k in sorted(samples.keys())])

        return MCResult(
            samples=sample_matrix,
            outputs=outputs,
            mean=mean,
            std=std,
            percentiles=percentiles,
            confidence_interval=(ci_low, ci_high),
            n_samples=len(valid_outputs),
            convergence_achieved=convergence
        )

    def _check_convergence(self, outputs: np.ndarray, window_size: int = 100) -> bool:
        """检查收敛性（基于滑动窗口均值稳定性）"""
        if len(outputs) < window_size * 2:
            return False

        # 计算滑动窗口均值
        cumulative_mean = np.cumsum(outputs) / np.arange(1, len(outputs) + 1)

        # 检查最后部分的变化率
        recent_means = cumulative_mean[-window_size:]
        variation = np.std(recent_means) / np.abs(np.mean(recent_means))

        # 变化率小于1%认为收敛
        return variation < 0.01

    def sensitivity_analysis(self,
                            model_func: Callable,
                            param_distributions: Dict[str, Dict[str, Any]],
                            method: str = 'correlation') -> Dict[str, float]:
        """
        敏感性分析

        Args:
            model_func: 模型函数
            param_distributions: 参数分布
            method: 方法 ('correlation', 'variance')

        Returns:
            各参数的敏感性指标
        """
        # 生成样本
        samples = self._generate_samples(param_distributions)
        outputs = self._evaluate_sequential(model_func, samples, None)

        # 移除NaN
        valid_mask = ~np.isnan(outputs)
        outputs = outputs[valid_mask]

        sensitivities = {}

        if method == 'correlation':
            # Pearson相关系数
            for param_name, param_samples in samples.items():
                param_samples = param_samples[valid_mask]
                corr = np.corrcoef(param_samples, outputs)[0, 1]
                sensitivities[param_name] = abs(corr)

        elif method == 'variance':
            # 方差分解（简化版）
            total_var = np.var(outputs)
            for param_name, param_samples in samples.items():
                param_samples = param_samples[valid_mask]

                # 条件期望的方差
                n_bins = 10
                bins = np.linspace(param_samples.min(), param_samples.max(), n_bins + 1)
                bin_indices = np.digitize(param_samples, bins)

                conditional_means = []
                for i in range(1, n_bins + 1):
                    mask = bin_indices == i
                    if np.sum(mask) > 0:
                        conditional_means.append(np.mean(outputs[mask]))

                if conditional_means:
                    var_conditional = np.var(conditional_means)
                    sensitivities[param_name] = var_conditional / total_var if total_var > 0 else 0

        return sensitivities


def create_mc_analyzer(n_samples: int = 1000,
                      confidence_level: float = 0.95,
                      use_parallel: bool = False) -> MonteCarloAnalysis:
    """
    创建Monte Carlo分析器

    Args:
        n_samples: 样本数
        confidence_level: 置信水平
        use_parallel: 是否并行

    Returns:
        MonteCarloAnalysis实例
    """
    return MonteCarloAnalysis(n_samples, confidence_level, use_parallel)
