"""
Unit tests for summary service

Tests cover:
- Grid summarization
- Point values summarization
"""
import pytest
import numpy as np

from app.services.summary import summarize_grid, summarize_points


class TestSummarizeGrid:
    """Test grid summarization function"""

    def test_summarize_grid_basic(self):
        """Test basic grid summarization"""
        grid = [[1.0, 2.0], [3.0, 4.0]]
        result = summarize_grid(grid)

        assert isinstance(result, dict)
        assert "min" in result
        assert "max" in result
        assert "mean" in result
        assert "std" in result
        assert "p10" in result
        assert "p50" in result
        assert "p90" in result

        assert result["min"] == 1.0
        assert result["max"] == 4.0
        assert result["mean"] == 2.5

    def test_summarize_grid_single_value(self):
        """Test with single value grid"""
        grid = [[5.0]]
        result = summarize_grid(grid)

        assert result["min"] == 5.0
        assert result["max"] == 5.0
        assert result["mean"] == 5.0
        assert result["std"] == 0.0

    def test_summarize_grid_uniform_values(self):
        """Test with uniform values"""
        grid = [[10.0, 10.0], [10.0, 10.0]]
        result = summarize_grid(grid)

        assert result["min"] == 10.0
        assert result["max"] == 10.0
        assert result["mean"] == 10.0
        assert result["std"] == 0.0
        assert result["p10"] == 10.0
        assert result["p50"] == 10.0
        assert result["p90"] == 10.0

    def test_summarize_grid_empty(self):
        """Test with empty grid"""
        grid = []
        result = summarize_grid(grid)

        assert "error" in result
        assert result["error"] == "empty grid"

    def test_summarize_grid_empty_row(self):
        """Test with grid containing empty row"""
        grid = [[]]
        result = summarize_grid(grid)

        assert "error" in result

    def test_summarize_grid_large(self):
        """Test with larger grid"""
        grid = [[float(i * j) for j in range(10)] for i in range(10)]
        result = summarize_grid(grid)

        assert isinstance(result, dict)
        assert result["min"] == 0.0
        assert result["max"] == 81.0

    def test_summarize_grid_negative_values(self):
        """Test with negative values"""
        grid = [[-5.0, -3.0], [-2.0, -1.0]]
        result = summarize_grid(grid)

        assert result["min"] == -5.0
        assert result["max"] == -1.0

    def test_summarize_grid_mixed_signs(self):
        """Test with mixed positive and negative values"""
        grid = [[-2.0, 0.0], [0.0, 2.0]]
        result = summarize_grid(grid)

        assert result["min"] == -2.0
        assert result["max"] == 2.0
        assert result["mean"] == 0.0


class TestSummarizePoints:
    """Test points summarization function"""

    def test_summarize_points_basic(self):
        """Test basic points summarization"""
        values = [1.0, 2.0, 3.0, 4.0, 5.0]
        result = summarize_points(values)

        assert isinstance(result, dict)
        assert "min" in result
        assert "max" in result
        assert "mean" in result
        assert "std" in result
        assert "p10" in result
        assert "p50" in result
        assert "p90" in result

        assert result["min"] == 1.0
        assert result["max"] == 5.0
        assert result["mean"] == 3.0

    def test_summarize_points_single_value(self):
        """Test with single value"""
        values = [10.0]
        result = summarize_points(values)

        assert result["min"] == 10.0
        assert result["max"] == 10.0
        assert result["mean"] == 10.0
        assert result["std"] == 0.0

    def test_summarize_points_uniform_values(self):
        """Test with uniform values"""
        values = [5.0, 5.0, 5.0, 5.0]
        result = summarize_points(values)

        assert result["mean"] == 5.0
        assert result["std"] == 0.0

    def test_summarize_points_empty(self):
        """Test with empty list"""
        values = []
        result = summarize_points(values)

        assert "error" in result
        assert result["error"] == "empty values"

    def test_summarize_points_large_dataset(self):
        """Test with large dataset"""
        values = list(range(1000))
        result = summarize_points(values)

        assert isinstance(result, dict)
        assert result["min"] == 0.0
        assert result["max"] == 999.0
        assert result["mean"] == 499.5

    def test_summarize_points_negative_values(self):
        """Test with negative values"""
        values = [-10.0, -5.0, -2.0]
        result = summarize_points(values)

        assert result["min"] == -10.0
        assert result["max"] == -2.0

    def test_summarize_points_percentiles(self):
        """Test percentile calculations"""
        # Values 1-100
        values = list(range(1, 101))
        result = summarize_points(values)

        # p10 should be around 10.9
        assert 10.0 <= result["p10"] <= 11.0
        # p50 should be around 50.5
        assert 50.0 <= result["p50"] <= 51.0
        # p90 should be around 90.1
        assert 90.0 <= result["p90"] <= 91.0
