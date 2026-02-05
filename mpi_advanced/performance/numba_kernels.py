"""
Numba加速计算核心

使用Numba JIT编译加速关键计算
"""

import numpy as np
from typing import Tuple, List

try:
    from numba import jit, prange
    NUMBA_AVAILABLE = True
except ImportError:
    NUMBA_AVAILABLE = False
    # 创建空装饰器作为回退
    def jit(*args, **kwargs):
        def decorator(func):
            return func
        return decorator if args and callable(args[0]) else decorator
    prange = range


# 相场计算加速
@jit(nopython=True, cache=True)
def fast_phase_field_compute(
    x: np.ndarray,
    crack_pos: float,
    length_scale: float,
    loading: float
) -> np.ndarray:
    """
    快速相场计算

    Args:
        x: 位置数组
        crack_pos: 裂纹位置
        length_scale: 长度尺度
        loading: 载荷

    Returns:
        相场值数组
    """
    n = len(x)
    phi = np.zeros(n)

    for i in prange(n):
        distance = abs(x[i] - crack_pos)
        # 考虑加载影响的相场
        load_factor = min(1.0, loading / 20e6)  # 归一化载荷
        effective_l = length_scale * (1.0 - 0.5 * load_factor)
        phi[i] = 1.0 - np.exp(-distance / effective_l)

        # 限制范围
        if phi[i] < 0.0:
            phi[i] = 0.0
        elif phi[i] > 1.0:
            phi[i] = 1.0

    return phi


@jit(nopython=True, cache=True)
def fast_moment_tensor_inversion(
    green_functions: np.ndarray,
    observations: np.ndarray
) -> np.ndarray:
    """
    快速矩张量反演（简化版最小二乘）

    Args:
        green_functions: 格林函数矩阵 (n_obs x 6)
        observations: 观测值向量 (n_obs)

    Returns:
        矩张量分量 (6,)
    """
    # 简化的正规方程求解
    # M = (G^T G)^-1 G^T d

    n_obs, n_param = green_functions.shape

    # G^T G
    gtg = np.zeros((n_param, n_param))
    for i in range(n_param):
        for j in range(n_param):
            for k in range(n_obs):
                gtg[i, j] += green_functions[k, i] * green_functions[k, j]

    # G^T d
    gtd = np.zeros(n_param)
    for i in range(n_param):
        for k in range(n_obs):
            gtd[i] += green_functions[k, i] * observations[k]

    # 简单的高斯消元求解（简化版，假设矩阵良态）
    # 实际应用中应该使用更稳定的求解方法
    M = np.linalg.solve(gtg, gtd)

    return M


@jit(nopython=True, parallel=True, cache=True)
def parallel_energy_field_build(
    events_x: np.ndarray,
    events_y: np.ndarray,
    events_z: np.ndarray,
    events_energy: np.ndarray,
    grid_x: np.ndarray,
    grid_y: np.ndarray,
    grid_z: np.ndarray,
    sigma: float
) -> np.ndarray:
    """
    并行能量场构建

    Args:
        events_x, events_y, events_z: 事件位置
        events_energy: 事件能量
        grid_x, grid_y, grid_z: 网格坐标
        sigma: 高斯核宽度

    Returns:
        能量场数组
    """
    nx, ny, nz = len(grid_x), len(grid_y), len(grid_z)
    n_events = len(events_x)

    energy_field = np.zeros((nx, ny, nz))

    # 并行遍历网格
    for i in prange(nx):
        for j in range(ny):
            for k in range(nz):
                x, y, z = grid_x[i], grid_y[j], grid_z[k]

                # 累加所有事件的贡献
                total_energy = 0.0
                for e in range(n_events):
                    dx = x - events_x[e]
                    dy = y - events_y[e]
                    dz = z - events_z[e]
                    r2 = dx*dx + dy*dy + dz*dz

                    # 高斯核
                    weight = np.exp(-r2 / (2 * sigma * sigma))
                    total_energy += events_energy[e] * weight

                energy_field[i, j, k] = total_energy

    return energy_field


@jit(nopython=True, cache=True)
def fast_ust_calculation(
    r: float,
    R0: float,
    P0: float,
    Pi: float,
    c: float,
    phi: float,
    b: float
) -> float:
    """
    快速统一强度理论计算

    Args:
        r: 计算点半径
        R0: 巷道半径
        P0: 原岩应力
        Pi: 支护压力
        c: 粘聚力
        phi: 内摩擦角
        b: UST参数

    Returns:
        应力值
    """
    # 简化计算（避免复杂循环）
    sin_phi = np.sin(phi)

    # UST参数
    A = 2 * (1 + b) * sin_phi / ((1 + b) - (b - sin_phi))

    # 塑性区半径估计
    numerator = 2 * P0 - Pi + c * (1 + b) * (1 - sin_phi) / ((1 + b) - (b - sin_phi))
    denominator = Pi + c * (1 + b) * (1 - sin_phi) / ((1 + b) - (b - sin_phi))

    if denominator <= 0 or numerator <= 0:
        return P0

    Rp = R0 * (numerator / denominator) ** (1 / (A - 1))

    # 径向应力
    if r <= Rp:
        # 塑性区
        radial_stress = (P0 + c / np.tan(phi)) * (r / R0) ** (A - 1) - c / np.tan(phi)
    else:
        # 弹性区
        radial_stress = P0 - (P0 - Pi) * (R0 / r) ** 2

    return radial_stress


# 性能对比函数
def benchmark_speedup(func_fast, func_slow, *args, n_runs=10):
    """
    基准测试加速比

    Args:
        func_fast: 加速函数
        func_slow: 原始函数
        args: 函数参数
        n_runs: 运行次数

    Returns:
        加速比
    """
    import time

    # 预热（编译JIT）
    if NUMBA_AVAILABLE:
        func_fast(*args)

    # 测试加速版本
    start = time.time()
    for _ in range(n_runs):
        result_fast = func_fast(*args)
    time_fast = time.time() - start

    # 测试原始版本
    start = time.time()
    for _ in range(n_runs):
        result_slow = func_slow(*args)
    time_slow = time.time() - start

    speedup = time_slow / time_fast if time_fast > 0 else float('inf')

    return {
        'speedup': speedup,
        'time_fast': time_fast,
        'time_slow': time_slow,
        'results_match': np.allclose(result_fast, result_slow, rtol=1e-5)
    }


def get_numba_status() -> dict:
    """获取Numba状态信息"""
    return {
        'available': NUMBA_AVAILABLE,
        'version': 'installed' if NUMBA_AVAILABLE else 'not installed',
        'parallel_enabled': NUMBA_AVAILABLE
    }
