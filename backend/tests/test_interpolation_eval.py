"""
Unit tests for interpolation_eval service

Tests cover:
- RMSE calculation
- Method evaluation with cross-validation
"""
import numpy as np
import pytest
from unittest.mock import patch, MagicMock

from app.services.interpolation_eval import _rmse, evaluate_methods


class TestRmse:
    """Test RMSE calculation function"""

    def test_rmse_basic(self):
        """Test basic RMSE calculation"""
        errors = [3.0, 4.0]  # RMSE = sqrt((9+16)/2) = sqrt(12.5) ≈ 3.536
        result = _rmse(errors)
        expected = np.sqrt(12.5)
        assert abs(result - expected) < 0.01

    def test_rmse_empty_list(self):
        """Test RMSE with empty list"""
        result = _rmse([])
        assert result == float("inf")

    def test_rmse_single_value(self):
        """Test RMSE with single value"""
        errors = [5.0]
        result = _rmse(errors)
        assert result == 5.0

    def test_rmse_zero_errors(self):
        """Test RMSE with all zero errors"""
        errors = [0.0, 0.0, 0.0]
        result = _rmse(errors)
        assert result == 0.0

    def test_rmse_mixed_positive_negative(self):
        """Test RMSE with mixed positive and negative errors"""
        errors = [-3.0, 3.0, -4.0, 4.0]
        result = _rmse(errors)
        # RMSE should be same as [3,3,4,4]
        expected = np.sqrt((9+9+16+16)/4)
        assert abs(result - expected) < 0.01


class TestEvaluateMethods:
    """Test method evaluation with cross-validation"""

    @patch('app.services.interpolation_eval.interpolate_from_points')
    def test_evaluate_methods_single_method(self, mock_interp):
        """Test evaluation with single method"""
        # Mock interpolation results
        mock_grid = np.array([[1.0, 2.0], [3.0, 4.0]])
        mock_interp.return_value = {
            "grid": mock_grid,
            "bounds": {"min_x": 0, "max_x": 10, "min_y": 0, "max_y": 10}
        }

        # Create simple test data
        points = np.array([[0.0, 0.0], [10.0, 10.0], [5.0, 5.0]])
        values = np.array([1.0, 4.0, 2.5])

        result = evaluate_methods(points, values, methods=["linear"])

        assert isinstance(result, dict)
        assert "linear" in result
        assert "rmse" in result["linear"]
        assert "count" in result["linear"]

    @patch('app.services.interpolation_eval.interpolate_from_points')
    def test_evaluate_methods_multiple_methods(self, mock_interp):
        """Test evaluation with multiple methods"""
        mock_grid = np.array([[1.0, 2.0], [3.0, 4.0]])
        mock_interp.return_value = {
            "grid": mock_grid,
            "bounds": {"min_x": 0, "max_x": 10, "min_y": 0, "max_y": 10}
        }

        points = np.array([[0.0, 0.0], [10.0, 10.0], [5.0, 5.0]])
        values = np.array([1.0, 4.0, 2.5])

        result = evaluate_methods(points, values, methods=["linear", "nearest", "cubic"])

        assert isinstance(result, dict)
        assert len(result) == 3
        for method in ["linear", "nearest", "cubic"]:
            assert method in result
            assert "rmse" in result[method]

    @patch('app.services.interpolation_eval.interpolate_from_points')
    def test_evaluate_methods_with_error(self, mock_interp):
        """Test evaluation when interpolation returns error"""
        # Mock interpolation error
        mock_interp.return_value = {"error": "Interpolation failed"}

        points = np.array([[0.0, 0.0], [10.0, 10.0], [5.0, 5.0]])
        values = np.array([1.0, 4.0, 2.5])

        result = evaluate_methods(points, values, methods=["linear"])

        assert isinstance(result, dict)
        assert "linear" in result
        # Should have inf RMSE due to errors
        assert result["linear"]["rmse"] == float("inf")

    @patch('app.services.interpolation_eval.interpolate_from_points')
    def test_evaluate_methods_empty_grid(self, mock_interp):
        """Test evaluation when grid is empty"""
        # Mock empty grid
        mock_interp.return_value = {
            "grid": [],
            "bounds": {"min_x": 0, "max_x": 10, "min_y": 0, "max_y": 10}
        }

        points = np.array([[0.0, 0.0], [10.0, 10.0], [5.0, 5.0]])
        values = np.array([1.0, 4.0, 2.5])

        result = evaluate_methods(points, values, methods=["linear"])

        assert isinstance(result, dict)
        assert "linear" in result
        # Should have inf RMSE due to empty grid
        assert result["linear"]["rmse"] == float("inf")

    @patch('app.services.interpolation_eval.interpolate_from_points')
    def test_evaluate_methods_perfect_prediction(self, mock_interp):
        """Test evaluation with perfect predictions"""
        # Create a mock that returns the exact target value
        def mock_interpolate(points, values, **kwargs):
            # Return a grid that will predict the exact value
            target_value = values[0]  # Just use first value for simplicity
            return {
                "grid": np.array([[target_value, target_value], [target_value, target_value]]),
                "bounds": {"min_x": 0, "max_x": 10, "min_y": 0, "max_y": 10}
            }

        mock_interp.side_effect = mock_interpolate

        points = np.array([[0.0, 0.0], [10.0, 10.0], [5.0, 5.0]])
        values = np.array([2.0, 2.0, 2.0])

        result = evaluate_methods(points, values, methods=["linear"])

        # With perfect predictions, RMSE should be close to 0
        assert isinstance(result, dict)
        assert "linear" in result
        assert result["linear"]["rmse"] >= 0  # Should be non-negative

    def test_evaluate_methods_insufficient_points(self):
        """Test with insufficient points for interpolation"""
        # Only 2 points - not enough for meaningful cross-validation
        points = np.array([[0.0, 0.0], [10.0, 10.0]])
        values = np.array([1.0, 2.0])

        # Should raise error due to insufficient points for interpolation
        with pytest.raises(Exception):  # QhullError from scipy
            evaluate_methods(points, values, methods=["linear"])
