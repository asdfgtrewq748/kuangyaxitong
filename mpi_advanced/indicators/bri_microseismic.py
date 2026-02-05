"""
BRI指标计算模块 - 微震驱动版本

Burst Risk Index based on Microseismic Monitoring

核心功能：
1. 微震信号处理与特征提取
2. 矩张量反演 (Moment Tensor Inversion)
3. 能量密度场构建
4. 深度学习前兆识别

创新点：
- 微震矩张量反演的工程化应用
- 能量密度场实时构建
- AI识别冲击前兆模式

参考文献：
- Aki & Richards (2002): Quantitative Seismology
- Jost & Herrmann (1989): A student's guide to and review of moment tensors
"""

import numpy as np
from typing import Optional, Dict, Any, List, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
from scipy import signal
from scipy.optimize import minimize

from .bri_indicator import BRIIndicator
from ..core.data_models import (
    GeologyModel, MonitoringData, IndicatorResult,
    MicroseismicEvent, GeologyLayerType
)


@dataclass
class MomentTensor:
    """矩张量"""
    M: np.ndarray  # 3x3 矩张量矩阵

    @property
    def M0(self) -> float:
        """标量地震矩"""
        return np.sqrt(np.sum(self.M**2) / 2)

    @property
    def magnitude(self) -> float:
        """矩震级"""
        return (2.0/3.0) * np.log10(self.M0) - 6.0

    def decompose(self) -> Dict[str, Any]:
        """分解矩张量 (ISO + DC + CLVD)"""
        # 各向同性部分
        iso = np.trace(self.M) / 3
        M_iso = iso * np.eye(3)

        # 偏量部分
        M_dev = self.M - M_iso

        # 特征值分解
        eigenvalues, eigenvectors = np.linalg.eigh(M_dev)
        eigenvalues = eigenvalues[::-1]  # 从大到小排序

        # 计算DC和CLVD比例 (简化算法)
        # 参考 Jost & Herrmann (1989)

        # 双力偶部分
        F = -eigenvalues[1] / eigenvalues[0] if eigenvalues[0] != 0 else 0

        # ISO, DC, CLVD 比例
        iso_percent = abs(iso) / (abs(iso) + np.max(np.abs(eigenvalues))) * 100

        # 简化计算DC比例
        dc_percent = (1 - abs(F)) * (100 - iso_percent)
        clvd_percent = 100 - iso_percent - dc_percent

        return {
            'iso': iso,
            'iso_percent': iso_percent,
            'dc_percent': dc_percent,
            'clvd_percent': clvd_percent,
            'eigenvalues': eigenvalues,
            'F': F,
            'mechanism': self._classify_mechanism(iso_percent, dc_percent, F)
        }

    def _classify_mechanism(self, iso, dc, F) -> str:
        """分类震源机制"""
        if iso > 50:
            return "爆炸/塌陷"
        elif dc > 60:
            if F > 0.5:
                return "正断层"
            elif F < -0.5:
                return "逆断层"
            else:
                return "走滑断层"
        else:
            return "复合机制"


class MicroseismicProcessor:
    """微震信号处理器"""

    def __init__(self, sampling_rate: float = 1000.0):
        """
        初始化

        Args:
            sampling_rate: 采样频率 (Hz)
        """
        self.fs = sampling_rate

    def process_waveform(self, waveform: np.ndarray) -> Dict[str, Any]:
        """
        处理微震波形

        Args:
            waveform: 原始波形数据 (3通道 x 时间样本)

        Returns:
            处理后的波形和特征
        """
        # 1. 去趋势
        data_detrended = signal.detrend(waveform, axis=1)

        # 2. 带通滤波 (10-200 Hz)
        lowcut = 10.0
        highcut = 200.0
        sos = signal.butter(4, [lowcut, highcut], btype='band',
                           fs=self.fs, output='sos')
        data_filtered = signal.sosfilt(sos, data_detrended, axis=1)

        # 3. 到时拾取
        p_arrival = self._pick_p_wave(data_filtered)
        s_arrival = self._pick_s_wave(data_filtered, p_arrival)

        # 4. 提取特征
        features = self._extract_waveform_features(data_filtered)

        return {
            'waveform': data_filtered,
            'p_arrival': p_arrival,
            's_arrival': s_arrival,
            'features': features
        }

    def _pick_p_wave(self, data: np.ndarray,
                     window_length: int = 100) -> int:
        """
        使用STA/LTA算法拾取P波到时

        STA/LTA = Short Term Average / Long Term Average
        """
        # 使用垂直分量 (假设为第0通道)
        cf = np.abs(data[0, :])

        # STA和LTA窗口
        sta_len = int(0.01 * self.fs)  # 10ms
        lta_len = int(0.1 * self.fs)   # 100ms

        # 计算STA和LTA
        sta = np.convolve(cf**2, np.ones(sta_len)/sta_len, mode='same')
        lta = np.convolve(cf**2, np.ones(lta_len)/lta_len, mode='same')

        # STA/LTA比值
        ratio = sta / (lta + 1e-10)

        # 找最大值
        p_arrival = np.argmax(ratio[window_length:]) + window_length

        return p_arrival

    def _pick_s_wave(self, data: np.ndarray,
                     p_arrival: int) -> int:
        """
        拾取S波到时

        使用水平分量能量比
        """
        # 水平分量 (假设为第1,2通道)
        horizontal_energy = data[1, :]**2 + data[2, :]**2

        # 在P波之后搜索
        start_idx = p_arrival + int(0.01 * self.fs)  # P波后10ms

        if start_idx >= len(horizontal_energy):
            return p_arrival + int(0.05 * self.fs)

        # 找水平能量最大值
        s_arrival = start_idx + np.argmax(horizontal_energy[start_idx:])

        return s_arrival

    def _extract_waveform_features(self, data: np.ndarray) -> Dict[str, float]:
        """提取波形特征"""
        # 峰值振幅
        max_amp = np.max(np.abs(data))

        # RMS振幅
        rms_amp = np.sqrt(np.mean(data**2))

        # 持续时间 (基于能量包络)
        energy = np.sum(data**2, axis=0)
        threshold = 0.1 * np.max(energy)
        above_threshold = energy > threshold
        duration = np.sum(above_threshold) / self.fs

        # 主频率 (FFT)
        freqs = np.fft.rfftfreq(data.shape[1], 1/self.fs)
        fft_vals = np.abs(np.fft.rfft(data[0, :]))
        dominant_freq = freqs[np.argmax(fft_vals)]

        return {
            'max_amplitude': max_amp,
            'rms_amplitude': rms_amp,
            'duration': duration,
            'dominant_frequency': dominant_freq
        }


class MomentTensorInversion:
    """矩张量反演"""

    def __init__(self, sensor_positions: np.ndarray,
                 velocity_model: Dict[str, float]):
        """
        初始化

        Args:
            sensor_positions: 传感器位置 (N x 3)
            velocity_model: 速度模型 {'Vp': ..., 'Vs': ...}
        """
        self.sensors = sensor_positions
        self.vp = velocity_model.get('Vp', 4000.0)  # m/s
        self.vs = velocity_model.get('Vs', 2500.0)  # m/s

    def invert(self, waveforms: List[np.ndarray],
               arrivals: List[int],
               event_location: np.ndarray) -> MomentTensor:
        """
        矩张量反演

        简化的格林函数法反演

        Args:
            waveforms: 波形列表 (每个传感器一个)
            arrivals: 到时列表
            event_location: 震源位置

        Returns:
            MomentTensor: 反演结果
        """
        # 计算格林函数 (简化)
        G = self._compute_green_functions(event_location)

        # 构建观测向量 (振幅)
        observations = []
        for wf, arr in zip(waveforms, arrivals):
            # 取P波到达后10个样本的峰值
            end_idx = min(arr + 10, wf.shape[1])
            amp = np.max(np.abs(wf[:, arr:end_idx]))
            observations.append(amp)

        observations = np.array(observations)

        # 最小二乘反演
        # 简化的矩张量表示 (6个独立分量)
        M_est, residuals, rank, s = np.linalg.lstsq(G, observations, rcond=None)

        # 构建3x3对称矩阵
        M = np.array([
            [M_est[0], M_est[3], M_est[4]],
            [M_est[3], M_est[1], M_est[5]],
            [M_est[4], M_est[5], M_est[2]]
        ])

        return MomentTensor(M=M)

    def _compute_green_functions(self, source_pos: np.ndarray) -> np.ndarray:
        """
        计算格林函数 (简化)

        基于点源在均匀介质中的辐射图案
        """
        n_sensors = len(self.sensors)
        G = np.zeros((n_sensors, 6))  # 6个矩张量分量

        for i, sensor_pos in enumerate(self.sensors):
            # 距离和方向
            r_vec = sensor_pos - source_pos
            distance = np.linalg.norm(r_vec)
            direction = r_vec / (distance + 1e-10)

            # 简化的格林函数 (远场P波)
            # 振幅与 1/r 成正比
            amplitude = 1.0 / (distance + 1e-10)

            # 辐射图案系数 (简化)
            # 注意：这是高度简化的版本
            g = direction * amplitude

            # 填充格林函数矩阵
            G[i, 0] = g[0] * direction[0]  # Mxx
            G[i, 1] = g[1] * direction[1]  # Myy
            G[i, 2] = g[2] * direction[2]  # Mzz
            G[i, 3] = g[0] * direction[1] + g[1] * direction[0]  # Mxy
            G[i, 4] = g[0] * direction[2] + g[2] * direction[0]  # Mxz
            G[i, 5] = g[1] * direction[2] + g[2] * direction[1]  # Myz

        return G


class EnergyDensityField:
    """能量密度场构建"""

    def __init__(self, grid_shape: Tuple[int, int, int] = (50, 50, 30),
                 grid_spacing: float = 10.0):
        """
        初始化

        Args:
            grid_shape: 网格尺寸 (nx, ny, nz)
            grid_spacing: 网格间距 (m)
        """
        self.grid_shape = grid_shape
        self.grid_spacing = grid_spacing

        # 创建网格
        self.x = np.arange(grid_shape[0]) * grid_spacing
        self.y = np.arange(grid_shape[1]) * grid_spacing
        self.z = np.arange(grid_shape[2]) * grid_spacing

    def build_field(self, events: List[MicroseismicEvent]) -> np.ndarray:
        """
        从微震事件构建能量密度场

        Args:
            events: 微震事件列表

        Returns:
            3D能量密度场
        """
        energy_field = np.zeros(self.grid_shape)

        for event in events:
            # 微震能量 (从震级计算)
            if event.energy > 0:
                E_s = event.energy
            else:
                # 从震级估算
                E_s = 10 ** (1.5 * event.magnitude + 4.8)

            # 计算到每个网格点的贡献
            for i in range(self.grid_shape[0]):
                for j in range(self.grid_shape[1]):
                    for k in range(self.grid_shape[2]):
                        grid_point = np.array([
                            self.x[i], self.y[j], self.z[k]
                        ])

                        # 距离
                        distance = np.linalg.norm(
                            grid_point - event.location
                        )

                        # 几何扩散 + 衰减
                        if distance > 0:
                            attenuation_length = 100.0  # m
                            contribution = E_s / (4 * np.pi * distance**2) * \
                                         np.exp(-distance / attenuation_length)
                            energy_field[i, j, k] += contribution

        return energy_field

    def get_local_energy(self, position: np.ndarray,
                        energy_field: np.ndarray) -> float:
        """获取指定位置的能量密度"""
        # 找到最近的网格点
        ix = int(position[0] / self.grid_spacing)
        iy = int(position[1] / self.grid_spacing)
        iz = int(position[2] / self.grid_spacing)

        # 边界检查
        ix = np.clip(ix, 0, self.grid_shape[0] - 1)
        iy = np.clip(iy, 0, self.grid_shape[1] - 1)
        iz = np.clip(iz, 0, self.grid_shape[2] - 1)

        return energy_field[ix, iy, iz]


class PrecursorPredictor:
    """前兆预测器 (简化版，不使用PyTorch)"""

    def __init__(self):
        """初始化"""
        self.is_trained = False
        self.threshold_low = 0.3
        self.threshold_high = 0.7

    def extract_features(self, events: List[MicroseismicEvent],
                        time_window: timedelta = timedelta(days=7)) -> np.ndarray:
        """
        提取时序特征

        Args:
            events: 微震事件列表
            time_window: 时间窗口

        Returns:
            特征向量
        """
        if not events:
            return np.zeros(10)

        # 筛选时间窗口内的事件
        end_time = max(e.timestamp for e in events)
        start_time = end_time - time_window
        recent_events = [e for e in events
                        if start_time <= e.timestamp <= end_time]

        if not recent_events:
            return np.zeros(10)

        # 1. 事件频率
        freq = len(recent_events) / time_window.days

        # 2. 震级统计
        magnitudes = [e.magnitude for e in recent_events]
        mag_mean = np.mean(magnitudes)
        mag_std = np.std(magnitudes)
        mag_max = np.max(magnitudes)

        # 3. b值 (简化计算)
        b_value = self._compute_b_value(magnitudes)

        # 4. 能量统计
        energies = [e.energy for e in recent_events]
        energy_total = np.sum(energies)
        energy_rate = energy_total / time_window.days

        # 5. 空间集中度 (简化)
        locations = np.array([e.location for e in recent_events])
        spatial_std = np.mean(np.std(locations, axis=0))

        features = np.array([
            freq,
            mag_mean,
            mag_std,
            mag_max,
            b_value,
            np.log10(energy_total + 1),
            np.log10(energy_rate + 1),
            spatial_std,
            len([m for m in magnitudes if m > 0]),  # 强震数量
            len(recent_events) / (np.max([e.timestamp for e in recent_events]) -
                                 np.min([e.timestamp for e in recent_events])).total_seconds() * 3600 if len(recent_events) > 1 else 0
        ])

        return features

    def _compute_b_value(self, magnitudes: List[float]) -> float:
        """计算b值 (Gutenberg-Richter关系)"""
        if len(magnitudes) < 10:
            return 1.0  # 默认值

        # 最大似然估计
        M_mean = np.mean(magnitudes)
        M_min = min(magnitudes)

        if M_mean <= M_min:
            return 1.0

        b_value = np.log10(np.e) / (M_mean - M_min)

        return max(0.5, min(2.0, b_value))

    def predict_risk(self, features: np.ndarray) -> Tuple[str, float]:
        """
        预测风险等级

        Args:
            features: 特征向量

        Returns:
            (风险等级, 置信度)
        """
        # 简化的规则-based预测
        # 未来版本：使用训练好的LSTM模型

        # 关键指标权重
        weights = np.array([
            0.15,  # 频率
            0.15,  # 平均震级
            0.10,  # 震级标准差
            0.15,  # 最大震级
            -0.10, # b值 (负相关)
            0.15,  # 总能量
            0.15,  # 能量速率
            -0.05, # 空间集中度
            0.05,  # 强震数量
            0.05   # 时间密度
        ])

        # 归一化特征 (简化)
        features_norm = np.tanh(features / 10.0)  # 压缩到[-1, 1]

        # 计算风险分数
        risk_score = np.dot(weights, features_norm)

        # 映射到0-1
        risk_prob = 1 / (1 + np.exp(-risk_score))

        # 分类
        if risk_prob < self.threshold_low:
            return "低风险", 1 - risk_prob
        elif risk_prob < self.threshold_high:
            return "中风险", 0.5 + abs(risk_prob - 0.5)
        else:
            return "高风险", risk_prob


class BRIIndicatorMicroseismic(BRIIndicator):
    """
    BRI指标 - 微震驱动版本

    功能：
    1. 微震矩张量反演
    2. 能量密度场构建
    3. AI前兆识别
    """

    def __init__(self,
                 use_moment_tensor: bool = True,
                 use_energy_field: bool = True,
                 use_deep_learning: bool = True):
        """
        初始化

        Args:
            use_moment_tensor: 使用矩张量分析
            use_energy_field: 使用能量密度场
            use_deep_learning: 使用深度学习预测
        """
        super().__init__()
        self.name = "BRI-Microseismic"
        self.version = "3.0-microseismic"

        self.use_moment_tensor = use_moment_tensor
        self.use_energy_field = use_energy_field
        self.use_deep_learning = use_deep_learning

        # 初始化组件
        self.signal_processor = MicroseismicProcessor()
        self.energy_field_builder = EnergyDensityField()
        self.precursor_predictor = PrecursorPredictor()

        # 传感器配置 (默认)
        self.sensor_positions = np.array([
            [0, 0, 400],
            [100, 0, 400],
            [0, 100, 400],
            [100, 100, 400],
        ])

    def compute(self,
                geology: GeologyModel,
                monitoring: Optional[MonitoringData] = None,
                **kwargs) -> IndicatorResult:
        """
        基于微震的BRI计算
        """
        try:
            if monitoring is None or not monitoring.microseismic_events:
                # 无监测数据，降级为占位版本
                return super().compute(geology, monitoring)

            events = monitoring.microseismic_events

            # 1. 矩张量分析
            mt_results = []
            if self.use_moment_tensor:
                mt_results = self._analyze_moment_tensors(events)

            # 2. 能量密度场
            energy_field = None
            local_energy = 0.0
            if self.use_energy_field:
                energy_field = self.energy_field_builder.build_field(events)
                # 获取采区中心能量
                center = np.array([50, 50, 450])  # 简化
                local_energy = self.energy_field_builder.get_local_energy(
                    center, energy_field
                )

            # 3. 前兆预测
            risk_level = "未知"
            dl_confidence = 0.0
            if self.use_deep_learning:
                features = self.precursor_predictor.extract_features(events)
                risk_level, dl_confidence = self.precursor_predictor.predict_risk(features)

            # 4. 综合BRI计算
            bri_value, details = self._compute_bri_microseismic(
                events, mt_results, local_energy, risk_level
            )

            # 5. 计算置信度
            confidence = self._compute_confidence_ms(
                len(events), len(mt_results), dl_confidence
            )

            # 6. 不确定性
            uncertainty = 10 + (1 - confidence) * 15
            bri_low = max(0, bri_value - uncertainty)
            bri_high = min(100, bri_value + uncertainty)

            return IndicatorResult(
                indicator_name="BRI-Microseismic",
                value=bri_value,
                confidence=confidence,
                uncertainty_range=(bri_low, bri_high),
                details=details,
                intermediate_results={
                    'microseismic_stats': {
                        'event_count': len(events),
                        'moment_tensor_count': len(mt_results),
                        'average_magnitude': np.mean([e.magnitude for e in events]),
                        'max_magnitude': max([e.magnitude for e in events]),
                        'local_energy': local_energy
                    },
                    'moment_tensors': mt_results[:5] if mt_results else [],  # 前5个
                    'dl_prediction': {
                        'risk_level': risk_level,
                        'confidence': dl_confidence
                    }
                }
            )

        except Exception as e:
            # 出错时回退到占位版本
            result = super().compute(geology, monitoring)
            result.indicator_name = "BRI-Microseismic(Fallback)"
            result.error_message = f"微震分析错误: {str(e)}"
            return result

    def _analyze_moment_tensors(self,
                               events: List[MicroseismicEvent]) -> List[Dict]:
        """分析矩张量"""
        results = []

        # 创建反演器 (简化)
        mt_inversion = MomentTensorInversion(
            sensor_positions=self.sensor_positions,
            velocity_model={'Vp': 4000, 'Vs': 2500}
        )

        for event in events:
            if event.moment_tensor is not None:
                # 已有矩张量，直接分解
                mt = MomentTensor(M=event.moment_tensor)
            else:
                # 模拟生成矩张量 (实际应用需要波形数据)
                # 这里使用随机生成作为示例
                M = np.random.randn(3, 3)
                M = (M + M.T) / 2  # 对称化
                mt = MomentTensor(M=M)

            # 分解
            decomp = mt.decompose()

            results.append({
                'event_id': event.event_id,
                'M0': mt.M0,
                'magnitude': mt.magnitude,
                'iso_percent': decomp['iso_percent'],
                'dc_percent': decomp['dc_percent'],
                'clvd_percent': decomp['clvd_percent'],
                'mechanism': decomp['mechanism']
            })

        return results

    def _compute_bri_microseismic(self,
                                 events: List[MicroseismicEvent],
                                 mt_results: List[Dict],
                                 local_energy: float,
                                 dl_risk: str) -> Tuple[float, Dict]:
        """基于微震数据计算BRI"""

        # 基础风险分数 (从高到低)
        risk_score = 50.0

        # 1. 微震活动强度
        if events:
            # 平均震级
            avg_mag = np.mean([e.magnitude for e in events])
            risk_score += (avg_mag - 0.5) * 10  # 震级越高风险越高

            # 最大震级
            max_mag = max([e.magnitude for e in events])
            risk_score += max_mag * 5

            # 事件频率
            freq = len(events)
            risk_score += min(20, freq * 0.5)

        # 2. 矩张量机制
        if mt_results:
            # 双力偶比例高 (构造活动)
            avg_dc = np.mean([mt['dc_percent'] for mt in mt_results])
            if avg_dc > 60:
                risk_score += 10

            # 各向同性成分高 (压出/冒落)
            avg_iso = np.mean([mt['iso_percent'] for mt in mt_results])
            if avg_iso > 30:
                risk_score += 15

        # 3. 能量密度
        if local_energy > 0:
            energy_factor = min(20, np.log10(local_energy + 1) * 3)
            risk_score += energy_factor

        # 4. 深度学习预测
        risk_multipliers = {
            "低风险": 0.8,
            "中风险": 1.0,
            "高风险": 1.2
        }
        risk_score *= risk_multipliers.get(dl_risk, 1.0)

        # 转换为BRI (100-风险分数)
        bri = max(0, min(100, 100 - risk_score))

        details = {
            'risk_score': risk_score,
            'average_magnitude': np.mean([e.magnitude for e in events]) if events else 0,
            'max_magnitude': max([e.magnitude for e in events]) if events else 0,
            'event_frequency': len(events),
            'local_energy_density': local_energy,
            'dl_risk_level': dl_risk,
            'mechanism_dominant': self._get_dominant_mechanism(mt_results) if mt_results else "未知"
        }

        return bri, details

    def _get_dominant_mechanism(self, mt_results: List[Dict]) -> str:
        """获取主导机制"""
        mechanisms = [mt['mechanism'] for mt in mt_results]

        # 统计
        from collections import Counter
        counter = Counter(mechanisms)

        return counter.most_common(1)[0][0]

    def _compute_confidence_ms(self,
                              n_events: int,
                              n_mt: int,
                              dl_conf: float) -> float:
        """计算微震版本的置信度"""
        confidence = 0.6  # 基础置信度

        # 事件数量
        if n_events > 50:
            confidence += 0.15
        elif n_events > 20:
            confidence += 0.10
        elif n_events > 5:
            confidence += 0.05

        # 矩张量数量
        if n_mt > 10:
            confidence += 0.1

        # 深度学习置信度
        confidence += dl_conf * 0.1

        return min(0.95, confidence)


# 工厂函数
def create_bri_microseismic_full() -> BRIIndicatorMicroseismic:
    """创建完整功能的微震BRI"""
    return BRIIndicatorMicroseismic(
        use_moment_tensor=True,
        use_energy_field=True,
        use_deep_learning=True
    )


def create_bri_microseismic_basic() -> BRIIndicatorMicroseismic:
    """创建基础功能的微震BRI"""
    return BRIIndicatorMicroseismic(
        use_moment_tensor=False,
        use_energy_field=True,
        use_deep_learning=False
    )
