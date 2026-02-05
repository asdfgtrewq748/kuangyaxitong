"""
传感器校准模块

功能：
1. 传感器标定参数管理
2. 时间同步校准
3. 坐标系统校准
4. 灵敏度校准
5. 漂移补偿
"""

import numpy as np
from typing import Dict, Any, Optional, List, Tuple
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path
import json


@dataclass
class SensorCalibration:
    """传感器标定参数"""
    sensor_id: str
    sensor_type: str  # 'microseismic', 'stress', 'displacement', etc.

    # 位置参数
    position: np.ndarray = field(default_factory=lambda: np.zeros(3))
    position_error: float = 0.0

    # 时间参数
    time_offset: timedelta = field(default_factory=lambda: timedelta(0))
    time_drift_rate: float = 0.0  # ms/day

    # 灵敏度参数
    sensitivity: float = 1.0  # V/unit
    sensitivity_error: float = 0.0

    # 频率响应
    frequency_response: Optional[Dict[float, float]] = None  # freq -> gain

    # 校准时间
    calibration_date: Optional[datetime] = None
    valid_until: Optional[datetime] = None

    # 状态
    is_active: bool = True
    notes: str = ""


class CalibrationModule:
    """
    校准模块

    管理传感器标定、时间同步和坐标校准
    """

    def __init__(self, config_path: Optional[Path] = None):
        """
        初始化校准模块

        Args:
            config_path: 校准配置文件路径
        """
        self.sensors: Dict[str, SensorCalibration] = {}
        self.config_path = config_path

        if config_path and config_path.exists():
            self.load_calibration(config_path)

    def add_sensor(self, calibration: SensorCalibration):
        """添加传感器标定"""
        self.sensors[calibration.sensor_id] = calibration

    def get_sensor(self, sensor_id: str) -> Optional[SensorCalibration]:
        """获取传感器标定"""
        return self.sensors.get(sensor_id)

    def calibrate_position(self,
                          raw_position: np.ndarray,
                          sensor_id: str) -> np.ndarray:
        """
        校准位置坐标

        Args:
            raw_position: 原始坐标
            sensor_id: 传感器ID

        Returns:
            校准后坐标
        """
        sensor = self.sensors.get(sensor_id)
        if sensor is None:
            return raw_position

        # 应用位置偏移
        calibrated = raw_position + sensor.position

        return calibrated

    def calibrate_time(self,
                      raw_timestamp: datetime,
                      sensor_id: str) -> datetime:
        """
        校准时间戳

        Args:
            raw_timestamp: 原始时间戳
            sensor_id: 传感器ID

        Returns:
            校准后时间戳
        """
        sensor = self.sensors.get(sensor_id)
        if sensor is None:
            return raw_timestamp

        # 应用时间偏移
        calibrated = raw_timestamp + sensor.time_offset

        # 应用漂移补偿（如果有校准日期）
        if sensor.calibration_date and sensor.time_drift_rate != 0:
            elapsed = (raw_timestamp - sensor.calibration_date).total_seconds()
            drift_correction = timedelta(milliseconds=sensor.time_drift_rate * elapsed / 86400)
            calibrated = calibrated - drift_correction

        return calibrated

    def calibrate_amplitude(self,
                           raw_value: float,
                           sensor_id: str,
                           frequency: Optional[float] = None) -> float:
        """
        校准振幅值

        Args:
            raw_value: 原始值
            sensor_id: 传感器ID
            frequency: 频率（用于频率响应校正）

        Returns:
            校准后值
        """
        sensor = self.sensors.get(sensor_id)
        if sensor is None:
            return raw_value

        # 应用灵敏度校正
        calibrated = raw_value / sensor.sensitivity

        # 应用频率响应校正
        if frequency is not None and sensor.frequency_response:
            gain = self._interpolate_frequency_response(
                sensor.frequency_response, frequency
            )
            calibrated = calibrated / gain

        return calibrated

    def _interpolate_frequency_response(self,
                                       response: Dict[float, float],
                                       frequency: float) -> float:
        """插值频率响应"""
        freqs = sorted(response.keys())
        gains = [response[f] for f in freqs]

        return np.interp(frequency, freqs, gains)

    def perform_time_sync(self,
                         reference_sensor: str,
                         target_sensors: List[str],
                         events: List[Dict[str, Any]]) -> Dict[str, timedelta]:
        """
        执行时间同步

        基于共同事件计算时间偏移

        Args:
            reference_sensor: 参考传感器ID
            target_sensors: 目标传感器ID列表
            events: 共同事件列表

        Returns:
            各传感器的时间偏移
        """
        time_offsets = {}

        ref_events = {e['event_id']: e for e in events
                     if e.get('sensor_id') == reference_sensor}

        for sensor_id in target_sensors:
            sensor_events = [e for e in events if e.get('sensor_id') == sensor_id]

            if not sensor_events:
                continue

            # 计算平均时间差
            time_diffs = []
            for event in sensor_events:
                event_id = event.get('event_id')
                if event_id in ref_events:
                    ref_time = ref_events[event_id]['timestamp']
                    target_time = event['timestamp']
                    time_diffs.append(ref_time - target_time)

            if time_diffs:
                avg_offset = sum(time_diffs, timedelta(0)) / len(time_diffs)
                time_offsets[sensor_id] = avg_offset

                # 更新传感器标定
                if sensor_id in self.sensors:
                    self.sensors[sensor_id].time_offset = avg_offset

        return time_offsets

    def estimate_position_error(self,
                               sensor_id: str,
                               known_points: List[Tuple[np.ndarray, np.ndarray]]) -> float:
        """
        估算位置误差

        Args:
            sensor_id: 传感器ID
            known_points: (测量位置, 真实位置)列表

        Returns:
            RMS误差
        """
        if not known_points:
            return 0.0

        errors = []
        for measured, true in known_points:
            error = np.linalg.norm(measured - true)
            errors.append(error)

        rms_error = np.sqrt(np.mean(np.array(errors) ** 2))

        if sensor_id in self.sensors:
            self.sensors[sensor_id].position_error = rms_error

        return rms_error

    def save_calibration(self, filepath: Path):
        """保存标定到文件"""
        data = {
            'sensors': {}
        }

        for sensor_id, sensor in self.sensors.items():
            data['sensors'][sensor_id] = {
                'sensor_id': sensor.sensor_id,
                'sensor_type': sensor.sensor_type,
                'position': sensor.position.tolist(),
                'position_error': sensor.position_error,
                'time_offset_ms': sensor.time_offset.total_seconds() * 1000,
                'time_drift_rate': sensor.time_drift_rate,
                'sensitivity': sensor.sensitivity,
                'sensitivity_error': sensor.sensitivity_error,
                'frequency_response': sensor.frequency_response,
                'calibration_date': sensor.calibration_date.isoformat() if sensor.calibration_date else None,
                'valid_until': sensor.valid_until.isoformat() if sensor.valid_until else None,
                'is_active': sensor.is_active,
                'notes': sensor.notes
            }

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def load_calibration(self, filepath: Path):
        """从文件加载标定"""
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        for sensor_id, sensor_data in data.get('sensors', {}).items():
            calibration = SensorCalibration(
                sensor_id=sensor_data['sensor_id'],
                sensor_type=sensor_data['sensor_type'],
                position=np.array(sensor_data['position']),
                position_error=sensor_data.get('position_error', 0.0),
                time_offset=timedelta(milliseconds=sensor_data.get('time_offset_ms', 0)),
                time_drift_rate=sensor_data.get('time_drift_rate', 0.0),
                sensitivity=sensor_data.get('sensitivity', 1.0),
                sensitivity_error=sensor_data.get('sensitivity_error', 0.0),
                frequency_response=sensor_data.get('frequency_response'),
                calibration_date=datetime.fromisoformat(sensor_data['calibration_date'])
                    if sensor_data.get('calibration_date') else None,
                valid_until=datetime.fromisoformat(sensor_data['valid_until'])
                    if sensor_data.get('valid_until') else None,
                is_active=sensor_data.get('is_active', True),
                notes=sensor_data.get('notes', '')
            )

            self.sensors[sensor_id] = calibration

    def get_calibration_report(self) -> Dict[str, Any]:
        """生成校准报告"""
        report = {
            'total_sensors': len(self.sensors),
            'active_sensors': sum(1 for s in self.sensors.values() if s.is_active),
            'sensors_by_type': {},
            'calibration_status': []
        }

        # 按类型统计
        for sensor in self.sensors.values():
            sensor_type = sensor.sensor_type
            if sensor_type not in report['sensors_by_type']:
                report['sensors_by_type'][sensor_type] = 0
            report['sensors_by_type'][sensor_type] += 1

        # 各传感器状态
        for sensor_id, sensor in self.sensors.items():
            status = {
                'sensor_id': sensor_id,
                'type': sensor.sensor_type,
                'active': sensor.is_active,
                'position_error': sensor.position_error,
                'time_offset_ms': sensor.time_offset.total_seconds() * 1000,
                'calibration_date': sensor.calibration_date.isoformat() if sensor.calibration_date else None,
                'needs_recalibration': False
            }

            # 检查是否需要重新校准
            if sensor.valid_until and datetime.now() > sensor.valid_until:
                status['needs_recalibration'] = True

            report['calibration_status'].append(status)

        return report
