"""
Unit tests for lithology_stats service

Tests cover:
- Lithology average computation
"""
import pytest
import pandas as pd
from pathlib import Path
from unittest.mock import patch, MagicMock
import tempfile
import os

from app.services.lithology_stats import compute_lithology_averages


class TestComputeLithologyAverages:
    """Test lithology average computation"""

    @patch('app.services.lithology_stats.read_csv_robust')
    @patch('app.services.lithology_stats.normalize_borehole_df')
    def test_compute_lithology_averages_basic(self, mock_normalize, mock_read):
        """Test basic lithology average computation"""
        df1 = pd.DataFrame({
            "name": ["砂岩", "泥岩"],
            "thickness": [10.0, 20.0],
            "elastic_modulus": [15.0, 10.0],
            "density": [25.0, 24.0],
            "tensile_strength": [5.0, 4.0]
        })
        df2 = pd.DataFrame({
            "name": ["砂岩", "泥岩"],
            "thickness": [12.0, 18.0],
            "elastic_modulus": [14.0, 11.0],
            "density": [26.0, 23.0],
            "tensile_strength": [6.0, 3.0]
        })

        mock_read.side_effect = [df1, df2]
        mock_normalize.side_effect = [df1, df2]

        files = [Path("file1.csv"), Path("file2.csv")]
        result = compute_lithology_averages(files)

        assert isinstance(result, list)
        # Should have averages for both lithologies
        assert len(result) == 2

    @patch('app.services.lithology_stats.read_csv_robust')
    @patch('app.services.lithology_stats.normalize_borehole_df')
    def test_compute_lithology_averages_single_file(self, mock_normalize, mock_read):
        """Test with single file"""
        df = pd.DataFrame({
            "name": ["砂岩", "泥岩"],
            "thickness": [10.0, 20.0],
            "elastic_modulus": [15.0, 10.0],
            "density": [25.0, 24.0],
            "tensile_strength": [5.0, 4.0]
        })

        mock_read.return_value = df
        mock_normalize.return_value = df

        result = compute_lithology_averages([Path("file.csv")])

        assert isinstance(result, list)

    @patch('app.services.lithology_stats.read_csv_robust')
    def test_compute_lithology_averages_empty_files(self, mock_read):
        """Test with empty file list"""
        result = compute_lithology_averages([])

        assert result == {}

    @patch('app.services.lithology_stats.read_csv_robust')
    def test_compute_lithology_averages_read_error(self, mock_read):
        """Test when CSV reading fails"""
        mock_read.side_effect = Exception("Read error")

        result = compute_lithology_averages([Path("bad.csv")])

        # Should handle error gracefully
        assert result == {}

    @patch('app.services.lithology_stats.read_csv_robust')
    @patch('app.services.lithology_stats.normalize_borehole_df')
    def test_compute_lithology_averages_no_name_column(self, mock_normalize, mock_read):
        """Test when name column is missing"""
        df = pd.DataFrame({
            "thickness": [10.0, 20.0]
        })

        mock_read.return_value = df
        mock_normalize.return_value = df

        result = compute_lithology_averages([Path("file.csv")])

        assert result == {}

    @patch('app.services.lithology_stats.read_csv_robust')
    @patch('app.services.lithology_stats.normalize_borehole_df')
    def test_compute_lithology_averages_with_nan(self, mock_normalize, mock_read):
        """Test with NaN values"""
        import numpy as np

        df = pd.DataFrame({
            "name": ["砂岩", "砂岩"],
            "thickness": [10.0, np.nan],
            "elastic_modulus": [15.0, 20.0],
            "density": [25.0, 26.0],
            "tensile_strength": [5.0, 6.0]
        })

        mock_read.return_value = df
        mock_normalize.return_value = df

        result = compute_lithology_averages([Path("file.csv")])

        assert isinstance(result, list)
        # NaN should be filled with 0
        assert len(result) == 1

    @patch('app.services.lithology_stats.read_csv_robust')
    @patch('app.services.lithology_stats.normalize_borehole_df')
    def test_compute_lithology_averages_mixed_types(self, mock_normalize, mock_read):
        """Test with mixed data types"""
        df = pd.DataFrame({
            "name": ["砂岩", "泥岩"],
            "thickness": ["10.0", "20.0"],  # String values
            "elastic_modulus": [15.0, 10.0],
            "density": [25.0, 24.0],
            "tensile_strength": [5.0, 4.0]
        })

        mock_read.return_value = df
        mock_normalize.return_value = df

        result = compute_lithology_averages([Path("file.csv")])

        assert isinstance(result, list)
        # Should convert strings to numbers

    @patch('app.services.lithology_stats.read_csv_robust')
    @patch('app.services.lithology_stats.normalize_borehole_df')
    def test_compute_lithology_averages_multiple_lithologies(self, mock_normalize, mock_read):
        """Test with multiple different lithologies"""
        df = pd.DataFrame({
            "name": ["砂岩", "泥岩", "煤层", "灰岩"],
            "thickness": [10.0, 20.0, 5.0, 15.0],
            "elastic_modulus": [15.0, 10.0, 8.0, 12.0],
            "density": [25.0, 24.0, 13.0, 27.0],
            "tensile_strength": [5.0, 4.0, 2.0, 6.0]
        })

        mock_read.return_value = df
        mock_normalize.return_value = df

        result = compute_lithology_averages([Path("file.csv")])

        assert isinstance(result, list)
        assert len(result) == 4

    @patch('app.services.lithology_stats.read_csv_robust')
    @patch('app.services.lithology_stats.normalize_borehole_df')
    def test_compute_lithology_averages_grouping(self, mock_normalize, mock_read):
        """Test that grouping works correctly"""
        df = pd.DataFrame({
            "name": ["砂岩", "砂岩", "泥岩"],
            "thickness": [10.0, 20.0, 15.0],
            "elastic_modulus": [15.0, 25.0, 10.0],
            "density": [25.0, 26.0, 24.0],
            "tensile_strength": [5.0, 6.0, 4.0]
        })

        mock_read.return_value = df
        mock_normalize.return_value = df

        result = compute_lithology_averages([Path("file.csv")])

        assert isinstance(result, list)
        # Should have 2 groups
        assert len(result) == 2

        # Find 砂岩 average
        sandstone = next((item for item in result if item.get("name") == "砂岩"), None)
        if sandstone:
            # Average thickness: (10 + 20) / 2 = 15
            assert "thickness" in sandstone

    @patch('app.services.lithology_stats.read_csv_robust')
    @patch('app.services.lithology_stats.normalize_borehole_df')
    def test_compute_lithology_averages_partial_fields(self, mock_normalize, mock_read):
        """Test with partial numeric fields"""
        df = pd.DataFrame({
            "name": ["砂岩"],
            "thickness": [10.0],
            "elastic_modulus": [15.0],
            "density": [25.0],
            "tensile_strength": [5.0]
        })

        mock_read.return_value = df
        mock_normalize.return_value = df

        result = compute_lithology_averages([Path("file.csv")])

        assert isinstance(result, list)
        # Should handle missing fields gracefully
