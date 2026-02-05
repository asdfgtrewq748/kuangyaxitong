"""
微震数据专用导入器

处理微震监测系统的特定数据格式
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, Optional, List, Tuple
from pathlib import Path
from datetime import datetime
from dataclasses import dataclass

from .field_data_loader import FieldDataLoader, ImportConfig, ImportResult, DataFormat


@dataclass
class MicroseismicConfig:
    """微震导入配置"""
    # 坐标系统
    coordinate_system: str = "local"  # local, utm, mine
    origin: Optional[Tuple[float, float, float]] = None

    # 传感器配置
    sensor_positions: Optional[Dict[str, np.ndarray]] = None

    # 震级类型
    magnitude_type: str = "ml"  # ml, mw, md

    # 滤波设置
    apply_filter: bool = True
    min_magnitude: float = -2.0
    max_magnitude: float = 5.0

    # 质量控制
    min_station_count: int = 3
    max_rms: float = 0.5


class MicroseismicImporter:
    """
    微震数据导入器

    支持多种微震数据格式：
    - CSV/Excel: 通用表格格式
    - SEISAN: 地震分析软件格式
    - Custom JSON: 自定义JSON格式
    """

    # 标准列名映射
    COLUMN_MAP = {
        # 英文常见列名
        'event_id': ['event_id', 'id', 'event', 'eventid', '事件编号'],
        'timestamp': ['timestamp', 'time', 'datetime', 'date', 'origin_time', '时间'],
        'x': ['x', 'east', 'easting', 'x_coord', 'X'],
        'y': ['y', 'north', 'northing', 'y_coord', 'Y'],
        'z': ['z', 'depth', 'elevation', 'z_coord', 'Z'],
        'magnitude': ['magnitude', 'mag', 'ml', 'mw', 'md', '震级'],
        'energy': ['energy', 'e', 'energy_j', '能量'],
        'rms': ['rms', 'residual', '误差'],
        'station_count': ['station_count', 'n_stations', 'stations', '台站数']
    }

    def __init__(self, config: Optional[MicroseismicConfig] = None):
        """
        初始化导入器

        Args:
            config: 微震配置
        """
        self.config = config or MicroseismicConfig()
        self.base_loader = FieldDataLoader()

    def import_csv(self, filepath: Path, **kwargs) -> ImportResult:
        """导入CSV格式的微震数据"""
        # 构建导入配置
        import_config = ImportConfig(
            format=DataFormat.CSV,
            column_mapping=self._build_column_mapping(),
            skip_errors=True
        )

        loader = FieldDataLoader(import_config)
        result = loader.load(filepath)

        if result.success and result.data is not None:
            # 微震专用处理
            result.data = self._process_microseismic_data(result.data)
            result = self._apply_quality_control(result)

        return result

    def import_excel(self, filepath: Path, sheet_name: Optional[str] = None) -> ImportResult:
        """导入Excel格式的微震数据"""
        import_config = ImportConfig(
            format=DataFormat.EXCEL,
            column_mapping=self._build_column_mapping()
        )

        loader = FieldDataLoader(import_config)

        # 读取指定sheet或自动检测
        try:
            xlsx = pd.ExcelFile(filepath)
            if sheet_name is None:
                # 寻找包含微震数据的sheet
                for name in xlsx.sheet_names:
                    if any(keyword in name.lower() for keyword in ['ms', 'micro', 'seismic', '微震']):
                        sheet_name = name
                        break
                if sheet_name is None:
                    sheet_name = xlsx.sheet_names[0]

            df = pd.read_excel(filepath, sheet_name=sheet_name)

            # 应用列名映射
            df = df.rename(columns=import_config.column_mapping)

            # 处理数据
            df = self._process_microseismic_data(df)

            result = ImportResult(
                success=True,
                data=df,
                record_count=len(df),
                metadata={'sheet': sheet_name}
            )

            return self._apply_quality_control(result)

        except Exception as e:
            return ImportResult(success=False, errors=[str(e)])

    def import_seisan(self, filepath: Path) -> ImportResult:
        """
        导入SEISAN格式的微震数据

        SEISAN格式示例：
        2025 02 01 1234 12.5 45.6 1234.5 2.5
        (年月日 时分 秒 X Y Z 震级)
        """
        events = []
        errors = []

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                for line_num, line in enumerate(f, 1):
                    try:
                        event = self._parse_seisan_line(line)
                        if event:
                            events.append(event)
                    except Exception as e:
                        errors.append(f"行 {line_num}: {e}")

            df = pd.DataFrame(events)

            return ImportResult(
                success=len(events) > 0,
                data=df if len(events) > 0 else None,
                record_count=len(events),
                error_count=len(errors),
                errors=errors
            )

        except Exception as e:
            return ImportResult(success=False, errors=[str(e)])

    def _parse_seisan_line(self, line: str) -> Optional[Dict]:
        """解析SEISAN格式的一行"""
        line = line.strip()
        if not line or line.startswith('#'):
            return None

        try:
            # 简化解析（实际格式可能更复杂）
            parts = line.split()

            year = int(parts[0])
            month = int(parts[1])
            day = int(parts[2])
            hour = int(parts[3][:2])
            minute = int(parts[3][2:])
            second = float(parts[4])
            x = float(parts[5])
            y = float(parts[6])
            z = float(parts[7])
            mag = float(parts[8])

            return {
                'timestamp': datetime(year, month, day, hour, minute, int(second)),
                'x': x, 'y': y, 'z': z,
                'magnitude': mag
            }

        except (IndexError, ValueError) as e:
            raise ValueError(f"格式错误: {e}")

    def _build_column_mapping(self) -> Dict[str, str]:
        """构建列名映射"""
        mapping = {}
        for standard_name, aliases in self.COLUMN_MAP.items():
            for alias in aliases:
                mapping[alias] = standard_name
        return mapping

    def _process_microseismic_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """处理微震数据"""
        # 确保必要列存在
        required_cols = ['magnitude']
        for col in required_cols:
            if col not in df.columns:
                df[col] = np.nan

        # 计算能量（如果缺失）
        if 'energy' not in df.columns and 'magnitude' in df.columns:
            df['energy'] = 10 ** (1.5 * df['magnitude'] + 4.8)

        # 坐标转换
        if self.config.coordinate_system != "local" and self.config.origin:
            df = self._convert_coordinates(df)

        return df

    def _convert_coordinates(self, df: pd.DataFrame) -> pd.DataFrame:
        """坐标转换"""
        if self.config.origin is None:
            return df

        ox, oy, oz = self.config.origin

        if 'x' in df.columns:
            df['x'] = df['x'] - ox
        if 'y' in df.columns:
            df['y'] = df['y'] - oy
        if 'z' in df.columns:
            df['z'] = df['z'] - oz

        return df

    def _apply_quality_control(self, result: ImportResult) -> ImportResult:
        """应用质量控制"""
        if not result.success or result.data is None:
            return result

        df = result.data.copy()
        warnings = []

        # 震级范围筛选
        if self.config.apply_filter and 'magnitude' in df.columns:
            n_before = len(df)
            df = df[
                (df['magnitude'] >= self.config.min_magnitude) &
                (df['magnitude'] <= self.config.max_magnitude)
            ]
            n_filtered = n_before - len(df)
            if n_filtered > 0:
                warnings.append(f"震级过滤: {n_filtered} 个事件")

        # 最小台站数筛选
        if 'station_count' in df.columns:
            n_before = len(df)
            df = df[df['station_count'] >= self.config.min_station_count]
            n_filtered = n_before - len(df)
            if n_filtered > 0:
                warnings.append(f"台站数过滤: {n_filtered} 个事件")

        # RMS误差筛选
        if 'rms' in df.columns:
            n_before = len(df)
            df = df[df['rms'] <= self.config.max_rms]
            n_filtered = n_before - len(df)
            if n_filtered > 0:
                warnings.append(f"RMS过滤: {n_filtered} 个事件")

        result.data = df
        result.record_count = len(df)
        result.warnings.extend(warnings)

        return result

    def generate_statistics(self, result: ImportResult) -> Dict[str, Any]:
        """生成统计数据"""
        if not result.success or result.data is None:
            return {}

        df = result.data

        stats = {
            'total_events': len(df),
            'time_range': {
                'start': df.index.min().isoformat() if hasattr(df.index, 'min') else None,
                'end': df.index.max().isoformat() if hasattr(df.index, 'max') else None
            },
            'magnitude': {
                'min': df['magnitude'].min() if 'magnitude' in df.columns else None,
                'max': df['magnitude'].max() if 'magnitude' in df.columns else None,
                'mean': df['magnitude'].mean() if 'magnitude' in df.columns else None,
            },
            'spatial_range': {
                'x': (df['x'].min(), df['x'].max()) if 'x' in df.columns else None,
                'y': (df['y'].min(), df['y'].max()) if 'y' in df.columns else None,
                'z': (df['z'].min(), df['z'].max()) if 'z' in df.columns else None,
            }
        }

        # G-R关系b值估算
        if 'magnitude' in df.columns and len(df) > 10:
            stats['b_value'] = self._estimate_b_value(df['magnitude'].values)

        return stats

    def _estimate_b_value(self, magnitudes: np.ndarray) -> float:
        """估算G-R关系的b值"""
        # 最大似然估计
        m_min = magnitudes.min()
        m_mean = magnitudes.mean()
        b = 1.0 / (m_mean - m_min) * np.log10(np.e)
        return b
