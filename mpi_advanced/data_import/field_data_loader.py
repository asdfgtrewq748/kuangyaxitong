"""
现场数据加载器

统一接口加载各类监测数据和地质数据
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, Optional, List, Union, Callable
from pathlib import Path
from datetime import datetime
import json
import warnings
from dataclasses import dataclass, field
from enum import Enum


class DataFormat(Enum):
    """支持的数据格式"""
    CSV = "csv"
    EXCEL = "excel"
    JSON = "json"
    SEGY = "segy"
    SAC = "sac"
    MSEED = "mseed"
    CUSTOM = "custom"


@dataclass
class ImportConfig:
    """导入配置"""
    # 文件格式
    format: DataFormat = DataFormat.CSV

    # 列名映射
    column_mapping: Dict[str, str] = field(default_factory=dict)

    # 时间格式
    timestamp_format: str = "%Y-%m-%d %H:%M:%S"
    timezone: str = "UTC"

    # 数据筛选
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

    # 质量控制
    skip_errors: bool = True
    error_threshold: float = 0.1  # 错误率阈值

    # 插值配置
    interpolate_missing: bool = True
    interpolation_method: str = "linear"

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return {
            'format': self.format.value,
            'column_mapping': self.column_mapping,
            'timestamp_format': self.timestamp_format,
            'timezone': self.timezone,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'skip_errors': self.skip_errors,
            'error_threshold': self.error_threshold,
            'interpolate_missing': self.interpolate_missing,
            'interpolation_method': self.interpolation_method
        }


@dataclass
class ImportResult:
    """导入结果"""
    success: bool
    data: Optional[Any] = None
    record_count: int = 0
    error_count: int = 0
    warning_count: int = 0
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def error_rate(self) -> float:
        """错误率"""
        if self.record_count == 0:
            return 0.0
        return self.error_count / (self.record_count + self.error_count)

    @property
    def is_valid(self) -> bool:
        """数据是否有效"""
        return self.success and self.error_rate < 0.1


class FieldDataLoader:
    """
    现场数据加载器

    支持多种数据格式的统一加载接口
    """

    # 格式到加载函数的映射
    _LOADERS: Dict[DataFormat, Callable] = {}

    def __init__(self, config: Optional[ImportConfig] = None):
        """
        初始化加载器

        Args:
            config: 导入配置
        """
        self.config = config or ImportConfig()
        self._register_default_loaders()

    def _register_default_loaders(self):
        """注册默认加载器"""
        self._LOADERS = {
            DataFormat.CSV: self._load_csv,
            DataFormat.EXCEL: self._load_excel,
            DataFormat.JSON: self._load_json,
        }

    def load(self, filepath: Union[str, Path],
             format: Optional[DataFormat] = None,
             custom_loader: Optional[Callable] = None) -> ImportResult:
        """
        加载数据文件

        Args:
            filepath: 文件路径
            format: 数据格式（自动检测如果为None）
            custom_loader: 自定义加载函数

        Returns:
            ImportResult对象
        """
        filepath = Path(filepath)

        if not filepath.exists():
            return ImportResult(
                success=False,
                errors=[f"文件不存在: {filepath}"]
            )

        # 自动检测格式
        if format is None:
            format = self._detect_format(filepath)

        # 使用自定义加载器或默认加载器
        if custom_loader:
            return custom_loader(filepath, self.config)

        loader = self._LOADERS.get(format)
        if loader is None:
            return ImportResult(
                success=False,
                errors=[f"不支持的格式: {format}"]
            )

        try:
            return loader(filepath)
        except Exception as e:
            return ImportResult(
                success=False,
                errors=[f"加载失败: {str(e)}"]
            )

    def _detect_format(self, filepath: Path) -> DataFormat:
        """自动检测文件格式"""
        suffix = filepath.suffix.lower()

        format_map = {
            '.csv': DataFormat.CSV,
            '.xlsx': DataFormat.EXCEL,
            '.xls': DataFormat.EXCEL,
            '.json': DataFormat.JSON,
            '.segy': DataFormat.SEGY,
            '.sgy': DataFormat.SEGY,
            '.sac': DataFormat.SAC,
            '.mseed': DataFormat.MSEED,
        }

        return format_map.get(suffix, DataFormat.CUSTOM)

    def _load_csv(self, filepath: Path) -> ImportResult:
        """加载CSV文件"""
        result = ImportResult(success=True)

        try:
            # 尝试不同的编码
            encodings = ['utf-8', 'gbk', 'gb2312', 'latin1']
            df = None

            for encoding in encodings:
                try:
                    df = pd.read_csv(filepath, encoding=encoding)
                    break
                except UnicodeDecodeError:
                    continue

            if df is None:
                raise ValueError("无法解码文件，请检查编码")

            # 应用列名映射
            if self.config.column_mapping:
                df = df.rename(columns=self.config.column_mapping)

            # 解析时间列
            df = self._parse_timestamp(df)

            # 时间筛选
            df = self._filter_by_time(df)

            # 数据质量检查
            df, quality_info = self._check_quality(df)
            result.record_count = len(df)
            result.error_count = quality_info['missing_count']
            result.warnings = quality_info['warnings']

            # 插值缺失值
            if self.config.interpolate_missing:
                df = self._interpolate_missing(df)

            result.data = df
            result.metadata = {
                'columns': list(df.columns),
                'dtypes': df.dtypes.to_dict(),
                'memory_usage': df.memory_usage(deep=True).sum()
            }

        except Exception as e:
            result.success = False
            result.errors.append(str(e))

        return result

    def _load_excel(self, filepath: Path) -> ImportResult:
        """加载Excel文件"""
        result = ImportResult(success=True)

        try:
            # 读取所有sheet
            xlsx = pd.ExcelFile(filepath)

            # 默认读取第一个sheet
            sheet_name = xlsx.sheet_names[0]
            df = pd.read_excel(filepath, sheet_name=sheet_name)

            # 应用列名映射
            if self.config.column_mapping:
                df = df.rename(columns=self.config.column_mapping)

            # 解析时间
            df = self._parse_timestamp(df)

            # 时间筛选
            df = self._filter_by_time(df)

            # 质量检查
            df, quality_info = self._check_quality(df)
            result.record_count = len(df)
            result.error_count = quality_info['missing_count']
            result.warnings = quality_info['warnings']

            if self.config.interpolate_missing:
                df = self._interpolate_missing(df)

            result.data = df
            result.metadata = {
                'sheets': xlsx.sheet_names,
                'loaded_sheet': sheet_name,
                'columns': list(df.columns)
            }

        except Exception as e:
            result.success = False
            result.errors.append(str(e))

        return result

    def _load_json(self, filepath: Path) -> ImportResult:
        """加载JSON文件"""
        result = ImportResult(success=True)

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # 尝试转换为DataFrame
            if isinstance(data, list):
                df = pd.DataFrame(data)
            elif isinstance(data, dict):
                df = pd.json_normalize(data)
            else:
                df = pd.DataFrame([data])

            # 解析时间
            df = self._parse_timestamp(df)

            result.data = df
            result.record_count = len(df)
            result.metadata = {'json_keys': list(data.keys()) if isinstance(data, dict) else []}

        except Exception as e:
            result.success = False
            result.errors.append(str(e))

        return result

    def _parse_timestamp(self, df: pd.DataFrame) -> pd.DataFrame:
        """解析时间戳列"""
        # 常见的时间列名
        time_columns = ['time', 'timestamp', 'datetime', 'date', '时间',
                       'timestamp', 'event_time', 'record_time']

        for col in df.columns:
            if col.lower() in time_columns:
                try:
                    df[col] = pd.to_datetime(df[col],
                                            format=self.config.timestamp_format,
                                            errors='coerce')
                    # 设置为索引
                    df = df.set_index(col)
                    break
                except:
                    continue

        return df

    def _filter_by_time(self, df: pd.DataFrame) -> pd.DataFrame:
        """按时间范围筛选"""
        if df.index.dtype == 'datetime64[ns]':
            if self.config.start_time:
                df = df[df.index >= self.config.start_time]
            if self.config.end_time:
                df = df[df.index <= self.config.end_time]

        return df

    def _check_quality(self, df: pd.DataFrame) -> tuple:
        """数据质量检查"""
        warnings_list = []

        # 检查缺失值
        missing = df.isnull().sum()
        missing_count = missing.sum()

        if missing_count > 0:
            missing_cols = missing[missing > 0]
            warnings_list.append(f"缺失值: {dict(missing_cols)}")

        # 检查异常值（简单的3-sigma规则）
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            mean = df[col].mean()
            std = df[col].std()
            outliers = df[(df[col] - mean).abs() > 3 * std]
            if len(outliers) > 0:
                warnings_list.append(f"{col}: {len(outliers)} 个异常值")

        quality_info = {
            'missing_count': missing_count,
            'warnings': warnings_list
        }

        return df, quality_info

    def _interpolate_missing(self, df: pd.DataFrame) -> pd.DataFrame:
        """插值缺失值"""
        numeric_cols = df.select_dtypes(include=[np.number]).columns

        for col in numeric_cols:
            if df[col].isnull().any():
                df[col] = df[col].interpolate(method=self.config.interpolation_method)
                # 边界值用前值或后值填充
                df[col] = df[col].fillna(method='bfill').fillna(method='ffill')

        return df

    def batch_load(self, filepaths: List[Union[str, Path]],
                   merge: bool = True) -> ImportResult:
        """
        批量加载多个文件

        Args:
            filepaths: 文件路径列表
            merge: 是否合并为一个数据集

        Returns:
            ImportResult对象
        """
        all_results = []
        all_errors = []
        total_records = 0

        for filepath in filepaths:
            result = self.load(filepath)
            all_results.append(result)
            all_errors.extend(result.errors)
            total_records += result.record_count

        if merge:
            # 合并数据
            dfs = [r.data for r in all_results if r.data is not None]
            if dfs:
                merged_df = pd.concat(dfs, ignore_index=True)
                return ImportResult(
                    success=len(all_errors) == 0,
                    data=merged_df,
                    record_count=len(merged_df),
                    errors=all_errors
                )

        return ImportResult(
            success=len(all_errors) == 0,
            data=all_results,
            record_count=total_records,
            errors=all_errors
        )


def create_field_data_loader(config: Optional[ImportConfig] = None) -> FieldDataLoader:
    """
    创建现场数据加载器

    Args:
        config: 导入配置

    Returns:
        FieldDataLoader实例
    """
    return FieldDataLoader(config)
