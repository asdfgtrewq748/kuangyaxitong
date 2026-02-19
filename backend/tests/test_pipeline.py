"""
Unit tests for pipeline service

Tests cover:
- Pipeline execution
- Data processing workflow
"""
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock
import tempfile
import os

from app.services.pipeline import run_pipeline


class TestRunPipeline:
    """Test pipeline execution"""

    @patch('app.services.pipeline.interpolate_index')
    @patch('app.services.pipeline.compute_borehole_index')
    @patch('app.services.pipeline.interpolate_field')
    @patch('app.services.pipeline.load_borehole_coords')
    @patch('app.services.pipeline.fix_csv_encoding')
    def test_run_pipeline_basic(
        self, mock_fix, mock_load_coords, mock_interp_field, mock_compute, mock_interp_index
    ):
        """Test basic pipeline execution"""
        # Mock dependencies
        mock_load_coords.return_value = {"borehole1": {"x": 0, "y": 0}}
        mock_interp_field.return_value = {"grid": [[1.0, 2.0]], "bounds": {}}
        mock_compute.return_value = {"items": [{"x": 0, "y": 0, "index": 1.0}]}
        mock_interp_index.return_value = {"values": [[1.0]]}

        with tempfile.TemporaryDirectory() as tmpdir:
            data_dir = Path(tmpdir)
            # Create test files
            (data_dir / "borehole1.csv").write_text("test")
            (data_dir / "zuobiao.csv").write_text("test")

            result = run_pipeline(
                data_dir=data_dir,
                field="thickness",
                method="linear",
                grid_size=10,
                fix_encoding=True
            )

        assert isinstance(result, dict)
        assert "field" in result
        assert "method" in result
        assert "grid_size" in result
        assert result["field"] == "thickness"
        assert result["method"] == "linear"

    @patch('app.services.pipeline.interpolate_index')
    @patch('app.services.pipeline.compute_borehole_index')
    @patch('app.services.pipeline.interpolate_field')
    @patch('app.services.pipeline.load_borehole_coords')
    def test_run_pipeline_no_fix_encoding(
        self, mock_load_coords, mock_interp_field, mock_compute, mock_interp_index
    ):
        """Test pipeline without encoding fix"""
        mock_load_coords.return_value = {}
        mock_interp_field.return_value = {}
        mock_compute.return_value = {"items": []}
        mock_interp_index.return_value = {}

        with tempfile.TemporaryDirectory() as tmpdir:
            data_dir = Path(tmpdir)
            (data_dir / "zuobiao.csv").write_text("test")

            result = run_pipeline(
                data_dir=data_dir,
                field="density",
                method="idw",
                grid_size=5,
                fix_encoding=False
            )

        assert isinstance(result, dict)
        assert result["fix_results"] == []

    @patch('app.services.pipeline.interpolate_index')
    @patch('app.services.pipeline.compute_borehole_index')
    @patch('app.services.pipeline.interpolate_field')
    @patch('app.services.pipeline.load_borehole_coords')
    @patch('app.services.pipeline.fix_csv_encoding')
    def test_run_pipeline_with_multiple_files(
        self, mock_fix, mock_load_coords, mock_interp_field, mock_compute, mock_interp_index
    ):
        """Test pipeline with multiple data files"""
        mock_load_coords.return_value = {}
        mock_interp_field.return_value = {}
        mock_compute.return_value = {"items": []}
        mock_interp_index.return_value = {}

        with tempfile.TemporaryDirectory() as tmpdir:
            data_dir = Path(tmpdir)
            # Create multiple files
            (data_dir / "borehole1.csv").write_text("test1")
            (data_dir / "borehole2.csv").write_text("test2")
            (data_dir / "borehole3.csv").write_text("test3")
            (data_dir / "zuobiao.csv").write_text("coords")

            result = run_pipeline(
                data_dir=data_dir,
                field="elastic_modulus",
                method="cubic",
                grid_size=20,
                fix_encoding=True
            )

        assert isinstance(result, dict)
        assert result["field"] == "elastic_modulus"

    @patch('app.services.pipeline.interpolate_index')
    @patch('app.services.pipeline.compute_borehole_index')
    @patch('app.services.pipeline.interpolate_field')
    @patch('app.services.pipeline.load_borehole_coords')
    def test_run_pipeline_result_structure(
        self, mock_load_coords, mock_interp_field, mock_compute, mock_interp_index
    ):
        """Test that result has correct structure"""
        mock_load_coords.return_value = {}
        mock_interp_field.return_value = {"grid": [[1.0]], "bounds": {"min_x": 0}}
        mock_compute.return_value = {"items": [], "missing_coords": []}
        mock_interp_index.return_value = {"values": [[1.0]], "bounds": {}}

        with tempfile.TemporaryDirectory() as tmpdir:
            data_dir = Path(tmpdir)
            (data_dir / "zuobiao.csv").write_text("test")

            result = run_pipeline(
                data_dir=data_dir,
                field="test",
                method="test",
                grid_size=10,
                fix_encoding=False
            )

        assert "interpolation" in result
        assert "index" in result
        assert "base" in result["index"]
        assert "grid" in result["index"]

    @patch('app.services.pipeline.interpolate_index')
    @patch('app.services.pipeline.compute_borehole_index')
    @patch('app.services.pipeline.interpolate_field')
    @patch('app.services.pipeline.load_borehole_coords')
    def test_run_pipeline_empty_items(
        self, mock_load_coords, mock_interp_field, mock_compute, mock_interp_index
    ):
        """Test pipeline when compute_borehole_index returns no items"""
        mock_load_coords.return_value = {}
        mock_interp_field.return_value = {}
        mock_compute.return_value = {"items": []}
        mock_interp_index.return_value = {}

        with tempfile.TemporaryDirectory() as tmpdir:
            data_dir = Path(tmpdir)
            (data_dir / "zuobiao.csv").write_text("test")

            result = run_pipeline(
                data_dir=data_dir,
                field="test",
                method="linear",
                grid_size=10,
                fix_encoding=False
            )

        # Should handle empty items gracefully
        assert isinstance(result, dict)
