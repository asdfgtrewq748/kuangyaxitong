"""
Unit tests for pressure_index service

Tests cover:
- Weight normalization
- Thickness-weighted mean calculation
- Borehole index computation
- Index interpolation
"""
import pandas as pd
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock
import numpy as np

from app.services.pressure_index import (
    normalize_weights,
    _thickness_weighted_mean,
    compute_borehole_index,
    interpolate_index
)


class TestNormalizeWeights:
    """Test weight normalization function"""

    def test_normalize_weights_default(self):
        """Test that default weights are returned when None is passed"""
        result = normalize_weights(None)

        assert isinstance(result, dict)
        assert "elastic_modulus" in result
        assert "density" in result
        assert "tensile_strength" in result

        # Check default values (actual implementation uses these)
        assert result["elastic_modulus"] == 0.4
        assert result["density"] == 0.3
        assert result["tensile_strength"] == 0.3

    def test_normalize_weights_custom(self):
        """Test that custom weights are normalized to sum to 1"""
        weights = {
            "elastic_modulus": 2.0,
            "density": 2.0,
            "tensile_strength": 1.0,
        }

        result = normalize_weights(weights)

        # Check normalization
        total = sum(result.values())
        assert abs(total - 1.0) < 0.001, f"Weights should sum to 1, got {total}"

        # Check proportions preserved
        assert result["elastic_modulus"] == result["density"]
        assert result["elastic_modulus"] == 2 * result["tensile_strength"]

    def test_normalize_weights_empty_dict(self):
        """Test that empty dict returns default weights"""
        result = normalize_weights({})

        assert isinstance(result, dict)
        assert "elastic_modulus" in result
        # Should return defaults
        assert result["elastic_modulus"] == 0.4


class TestThicknessWeightedMean:
    """Test thickness-weighted mean calculation"""

    def test_thickness_weighted_mean_basic(self):
        """Test basic weighted mean calculation"""
        df = pd.DataFrame({
            "thickness": [10.0, 20.0, 30.0],
            "value": [100.0, 200.0, 300.0]
        })

        result = _thickness_weighted_mean(df, "value")

        # Expected: (10*100 + 20*200 + 30*300) / (10+20+30) = 233.33...
        expected = (10*100 + 20*200 + 30*300) / 60
        assert abs(result - expected) < 0.01

    def test_thickness_weighted_mean_single_row(self):
        """Test with single row"""
        df = pd.DataFrame({
            "thickness": [15.0],
            "value": [250.0]
        })

        result = _thickness_weighted_mean(df, "value")
        assert result == 250.0

    def test_thickness_weighted_mean_empty_dataframe(self):
        """Test with empty dataframe"""
        df = pd.DataFrame({"thickness": [], "value": []})

        result = _thickness_weighted_mean(df, "value")
        assert result is None or np.isnan(result)

    def test_thickness_weighted_mean_missing_column(self):
        """Test with missing column"""
        df = pd.DataFrame({"thickness": [10.0, 20.0]})

        # Should return None when field is missing
        result = _thickness_weighted_mean(df, "nonexistent")
        assert result is None


class TestComputeBoreholeIndex:
    """Test borehole index computation"""

    @patch('app.services.pressure_index.fill_missing_by_lithology')
    @patch('app.services.pressure_index.add_depth_columns')
    @patch('app.services.pressure_index.normalize_borehole_df')
    @patch('app.services.pressure_index.read_csv_robust')
    @patch('app.services.pressure_index.compute_lithology_averages')
    def test_compute_borehole_index_success(
        self, mock_lith_avg, mock_read_csv, mock_normalize, mock_add_depth, mock_fill
    ):
        """Test successful borehole index computation"""
        # Mock lithology averages
        mock_lith_avg.return_value = []

        # Mock CSV data
        mock_df = pd.DataFrame({
            "elastic_modulus": [10.0, 20.0],
            "density": [100.0, 150.0],
            "tensile_strength": [15.0, 20.0],
            "thickness": [5.0, 10.0]
        })
        mock_read_csv.return_value = mock_df
        mock_normalize.return_value = mock_df
        mock_add_depth.return_value = mock_df
        mock_fill.return_value = mock_df

        files = [Path("test1.csv"), Path("test2.csv")]
        coords = {
            "test1": {"x": 0, "y": 0},
            "test2": {"x": 100, "y": 100}
        }

        result = compute_borehole_index(files, coords)

        assert isinstance(result, dict)
        assert "items" in result
        assert "missing_coords" in result
        # Both files should be processed
        assert len(result["items"]) == 2

    @patch('app.services.pressure_index.compute_lithology_averages')
    def test_compute_borehole_index_missing_coord(self, mock_lith_avg):
        """Test handling of missing coordinate"""
        mock_lith_avg.return_value = []

        files = [Path("nonexistent.csv")]
        coords = {}  # No coords for this file

        result = compute_borehole_index(files, coords)

        # Should report missing coords
        assert isinstance(result, dict)
        assert "missing_coords" in result
        assert "nonexistent" in result["missing_coords"]

    @patch('app.services.pressure_index.compute_lithology_averages')
    def test_compute_borehole_index_empty_files(self, mock_lith_avg):
        """Test with empty file list"""
        mock_lith_avg.return_value = []

        result = compute_borehole_index([], {})

        assert isinstance(result, dict)
        assert result["items"] == []

    @patch('app.services.pressure_index.fill_missing_by_lithology')
    @patch('app.services.pressure_index.add_depth_columns')
    @patch('app.services.pressure_index.normalize_borehole_df')
    @patch('app.services.pressure_index.read_csv_robust')
    @patch('app.services.pressure_index.compute_lithology_averages')
    def test_compute_borehole_index_custom_weights(
        self, mock_lith_avg, mock_read_csv, mock_normalize, mock_add_depth, mock_fill
    ):
        """Test computation with custom weights"""
        mock_lith_avg.return_value = []

        mock_df = pd.DataFrame({
            "elastic_modulus": [10.0],
            "density": [100.0],
            "tensile_strength": [15.0],
            "thickness": [10.0]
        })
        mock_read_csv.return_value = mock_df
        mock_normalize.return_value = mock_df
        mock_add_depth.return_value = mock_df
        mock_fill.return_value = mock_df

        files = [Path("test.csv")]
        coords = {"test": {"x": 0, "y": 0}}
        weights = {"elastic_modulus": 0.5, "density": 0.3, "tensile_strength": 0.2}

        result = compute_borehole_index(files, coords, weights)

        assert isinstance(result, dict)
        assert "items" in result
        assert len(result["items"]) == 1


class TestInterpolateIndex:
    """Test index interpolation"""

    @patch('app.services.pressure_index.interpolate_from_points')
    def test_interpolate_index_basic(self, mock_interp):
        """Test basic interpolation"""
        # Mock the interpolation function
        mock_interp.return_value = {
            "grid": np.array([[1.0, 2.0], [3.0, 4.0]]),
            "bounds": {"min_x": 0, "max_x": 100, "min_y": 0, "max_y": 100}
        }

        items = [
            {"x": 0, "y": 0, "index": 10.0},
            {"x": 100, "y": 100, "index": 20.0},
            {"x": 50, "y": 50, "index": 15.0}
        ]

        result = interpolate_index(items, method="linear", grid_size=10)

        assert isinstance(result, dict)
        # Check for expected keys
        assert "values" in result
        assert "bounds" in result
        assert "method" in result
        assert result["method"] == "linear"

    def test_interpolate_index_empty_items(self):
        """Test with empty items list"""
        result = interpolate_index([], method="linear", grid_size=10)

        # Should return error
        assert isinstance(result, dict)
        assert "error" in result

    @patch('app.services.pressure_index.interpolate_from_points')
    def test_interpolate_index_different_methods(self, mock_interp):
        """Test different interpolation methods"""
        mock_interp.return_value = {
            "grid": np.array([[1.0]]),
            "bounds": {"min_x": 0, "max_x": 100, "min_y": 0, "max_y": 100}
        }

        items = [
            {"x": 0, "y": 0, "index": 10.0},
            {"x": 100, "y": 100, "index": 20.0},
            {"x": 50, "y": 50, "index": 15.0}
        ]

        # Test various methods
        for method in ["linear", "nearest", "cubic"]:
            result = interpolate_index(items, method=method, grid_size=5)
            assert isinstance(result, dict)
            assert "values" in result

    @patch('app.services.pressure_index.interpolate_from_points')
    def test_interpolate_index_grid_size(self, mock_interp):
        """Test different grid sizes"""
        mock_interp.return_value = {
            "grid": np.array([[1.0]]),
            "bounds": {"min_x": 0, "max_x": 100, "min_y": 0, "max_y": 100}
        }

        items = [
            {"x": 0, "y": 0, "index": 10.0},
            {"x": 100, "y": 100, "index": 20.0},
            {"x": 50, "y": 50, "index": 15.0}
        ]

        result_small = interpolate_index(items, method="linear", grid_size=5)
        result_large = interpolate_index(items, method="linear", grid_size=20)

        # Both should produce valid results
        assert isinstance(result_small, dict)
        assert isinstance(result_large, dict)


class TestIntegration:
    """Integration tests for pressure index workflow"""

    @patch('app.services.pressure_index.fill_missing_by_lithology')
    @patch('app.services.pressure_index.add_depth_columns')
    @patch('app.services.pressure_index.normalize_borehole_df')
    @patch('app.services.pressure_index.read_csv_robust')
    @patch('app.services.pressure_index.compute_lithology_averages')
    @patch('app.services.pressure_index.interpolate_from_points')
    def test_full_workflow(
        self, mock_interp, mock_lith_avg, mock_read_csv, mock_normalize, mock_add_depth, mock_fill
    ):
        """Test complete workflow from borehole to interpolation"""
        # Mock lithology averages
        mock_lith_avg.return_value = []

        # Create realistic test data
        mock_df = pd.DataFrame({
            "elastic_modulus": [10.0, 15.0, 20.0],
            "density": [100.0, 120.0, 150.0],
            "tensile_strength": [15.0, 18.0, 20.0],
            "thickness": [5.0, 8.0, 10.0]
        })
        mock_read_csv.return_value = mock_df
        mock_normalize.return_value = mock_df
        mock_add_depth.return_value = mock_df
        mock_fill.return_value = mock_df

        # Step 1: Compute borehole indices
        files = [Path("borehole1.csv"), Path("borehole2.csv"), Path("borehole3.csv")]
        coords = {
            "borehole1": {"x": 0, "y": 0},
            "borehole2": {"x": 100, "y": 100},
            "borehole3": {"x": 50, "y": 50}
        }

        borehole_result = compute_borehole_index(files, coords)
        assert isinstance(borehole_result, dict)
        assert "items" in borehole_result
        assert len(borehole_result["items"]) == 3

        # Step 2: Interpolate
        mock_interp.return_value = {
            "grid": np.array([[1.0, 2.0], [3.0, 4.0]]),
            "bounds": {"min_x": 0, "max_x": 100, "min_y": 0, "max_y": 100}
        }

        items = [
            {"x": v["x"], "y": v["y"], "index": v["index"]}
            for v in borehole_result["items"]
        ]

        interp_result = interpolate_index(items, method="linear", grid_size=10)
        assert isinstance(interp_result, dict)
        assert "values" in interp_result
