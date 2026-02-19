"""
Unit tests for grid_export service

Tests cover:
- Grid to CSV conversion
"""
import pytest
import csv
import io

from app.services.grid_export import grid_to_csv_bytes


class TestGridToCsvBytes:
    """Test grid to CSV bytes conversion"""

    def test_grid_to_csv_bytes_basic(self):
        """Test basic grid to CSV conversion"""
        grid = [[1.0, 2.0], [3.0, 4.0]]
        bounds = {"min_x": 0, "max_x": 10, "min_y": 0, "max_y": 10}

        result = grid_to_csv_bytes(grid, bounds)

        assert isinstance(result, bytes)
        assert len(result) > 0

        # Verify CSV content
        decoded = result.decode("utf-8")
        reader = csv.reader(io.StringIO(decoded))
        rows = list(reader)

        assert rows[0] == ["x", "y", "value"]
        assert len(rows) == 5  # header + 4 data rows

    def test_grid_to_csv_bytes_single_cell(self):
        """Test with single cell grid"""
        grid = [[5.0]]
        bounds = {"min_x": 0, "max_x": 10, "min_y": 0, "max_y": 10}

        result = grid_to_csv_bytes(grid, bounds)

        assert isinstance(result, bytes)
        decoded = result.decode("utf-8")
        reader = csv.reader(io.StringIO(decoded))
        rows = list(reader)

        assert len(rows) == 2  # header + 1 data row

    def test_grid_to_csv_bytes_empty_grid(self):
        """Test with empty grid"""
        grid = []
        bounds = {"min_x": 0, "max_x": 10, "min_y": 0, "max_y": 10}

        result = grid_to_csv_bytes(grid, bounds)

        assert result == b""

    def test_grid_to_csv_bytes_empty_row(self):
        """Test with grid containing empty row"""
        grid = [[]]
        bounds = {"min_x": 0, "max_x": 10, "min_y": 0, "max_y": 10}

        result = grid_to_csv_bytes(grid, bounds)

        assert result == b""

    def test_grid_to_csv_bytes_bounds_calculation(self):
        """Test that x,y coordinates are calculated correctly"""
        grid = [[1.0, 2.0, 3.0]]
        bounds = {"min_x": 0, "max_x": 10, "min_y": 0, "max_y": 5}

        result = grid_to_csv_bytes(grid, bounds)
        decoded = result.decode("utf-8")
        reader = csv.reader(io.StringIO(decoded))
        rows = list(reader)

        # First data row should have x=0, y=0
        assert float(rows[1][0]) == 0.0  # x
        assert float(rows[1][1]) == 0.0  # y

        # Last data row should have x=10
        assert float(rows[3][0]) == 10.0  # x

    def test_grid_to_csv_bytes_negative_bounds(self):
        """Test with negative bounds"""
        grid = [[1.0, 2.0], [3.0, 4.0]]
        bounds = {"min_x": -10, "max_x": 10, "min_y": -5, "max_y": 5}

        result = grid_to_csv_bytes(grid, bounds)

        assert isinstance(result, bytes)
        decoded = result.decode("utf-8")
        reader = csv.reader(io.StringIO(decoded))
        rows = list(reader)

        # Verify negative values are handled
        assert float(rows[1][0]) == -10.0  # x starts at -10
        assert float(rows[1][1]) == -5.0   # y starts at -5

    def test_grid_to_csv_bytes_large_grid(self):
        """Test with larger grid"""
        grid = [[float(i * j) for j in range(10)] for i in range(10)]
        bounds = {"min_x": 0, "max_x": 100, "min_y": 0, "max_y": 100}

        result = grid_to_csv_bytes(grid, bounds)

        assert isinstance(result, bytes)
        decoded = result.decode("utf-8")
        reader = csv.reader(io.StringIO(decoded))
        rows = list(reader)

        # Should have header + 100 data rows
        assert len(rows) == 101

    def test_grid_to_csv_bytes_single_column(self):
        """Test with single column grid"""
        grid = [[1.0], [2.0], [3.0]]
        bounds = {"min_x": 0, "max_x": 0, "min_y": 0, "max_y": 10}

        result = grid_to_csv_bytes(grid, bounds)

        assert isinstance(result, bytes)
        decoded = result.decode("utf-8")
        reader = csv.reader(io.StringIO(decoded))
        rows = list(reader)

        assert len(rows) == 4  # header + 3 data rows

    def test_grid_to_csv_bytes_value_preservation(self):
        """Test that grid values are preserved correctly"""
        grid = [[1.5, 2.7], [3.2, 4.9]]
        bounds = {"min_x": 0, "max_x": 10, "min_y": 0, "max_y": 10}

        result = grid_to_csv_bytes(grid, bounds)
        decoded = result.decode("utf-8")
        reader = csv.reader(io.StringIO(decoded))
        rows = list(reader)

        # Check first value
        assert float(rows[1][2]) == 1.5
        # Check last value
        assert float(rows[4][2]) == 4.9
