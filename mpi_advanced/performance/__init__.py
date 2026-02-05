"""
性能优化模块

功能：
1. Numba/JIT加速核心计算
2. 并行计算支持
3. 缓存机制
4. 内存优化
"""

from .numba_kernels import (
    fast_phase_field_compute,
    fast_moment_tensor_inversion,
    parallel_energy_field_build
)
from .cache_manager import CacheManager
from .parallel_executor import ParallelExecutor

__all__ = [
    'fast_phase_field_compute',
    'fast_moment_tensor_inversion',
    'parallel_energy_field_build',
    'CacheManager',
    'ParallelExecutor'
]
