"""
Unit tests for geomodel_features service

Tests cover:
- Geomodel feature extraction
- JSON loading
- Quality flag handling
"""
import pytest
import json
from pathlib import Path
from unittest.mock import patch, MagicMock
import tempfile

from app.services.geomodel_features import (
    _load_json,
    extract_geomodel_features,
    DEFAULT_GEOMODEL_FEATURES,
)


class TestLoadJson:
    """Test JSON loading function"""

    def test_load_json_basic(self):
        """Test basic JSON loading"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False, encoding='utf-8') as f:
            json.dump({"test": "value"}, f)
            f.flush()
            path = Path(f.name)

        try:
            result = _load_json(path)
            assert result == {"test": "value"}
        finally:
            path.unlink()

    def test_load_json_complex(self):
        """Test loading complex JSON"""
        data = {
            "nested": {
                "key": "value",
                "number": 123
            },
            "list": [1, 2, 3]
        }
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False, encoding='utf-8') as f:
            json.dump(data, f)
            f.flush()
            path = Path(f.name)

        try:
            result = _load_json(path)
            assert result == data
        finally:
            path.unlink()

    def test_load_json_unicode(self):
        """Test loading JSON with unicode"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False, encoding='utf-8') as f:
            json.dump({"chinese": "测试"}, f)
            f.flush()
            path = Path(f.name)

        try:
            result = _load_json(path)
            assert result["chinese"] == "测试"
        finally:
            path.unlink()


class TestExtractGeomodelFeatures:
    """Test geomodel feature extraction"""

    @patch('app.services.geomodel_features._load_json')
    @patch('app.services.geomodel_features.geomodel_service')
    def test_extract_geomodel_features_basic(self, mock_service, mock_load):
        """Test basic feature extraction"""
        mock_service.get_artifact_path.side_effect = lambda job_id, name: Path(f"/tmp/{name}")

        summary_data = {
            "thickness_stats": {"max": 100.0},
            "top_layers": []
        }
        quality_data = {
            "layer_cv": 0.25,
            "pinchout_ratio": 0.1,
            "continuity_score": 0.8,
            "warning_flags": {}
        }
        mock_load.side_effect = [summary_data, quality_data]

        result = extract_geomodel_features("test-job")

        assert isinstance(result, dict)
        assert "values" in result
        assert "source" in result
        assert "quality_flags" in result

        assert result["values"]["key_layer_span"] == 100.0
        assert result["values"]["layer_cv"] == 0.25
        assert result["values"]["pinchout_ratio"] == 0.1
        assert result["values"]["continuity_score"] == 0.8

    @patch('app.services.geomodel_features._load_json')
    @patch('app.services.geomodel_features.geomodel_service')
    def test_extract_geomodel_features_with_top_layers(self, mock_service, mock_load):
        """Test with top layers"""
        mock_service.get_artifact_path.side_effect = lambda job_id, name: Path(f"/tmp/{name}")

        summary_data = {
            "thickness_stats": {"max": 80.0},
            "top_layers": [{"mean_thickness": 10.0}]
        }
        quality_data = {
            "layer_cv": 0.3,
            "pinchout_ratio": 0.0,
            "continuity_score": 0.5,
            "warning_flags": {}
        }
        mock_load.side_effect = [summary_data, quality_data]

        result = extract_geomodel_features("test-job")

        # top_layer mean * 10 = 100.0, should be used as max
        assert result["values"]["key_layer_span"] >= 100.0

    @patch('app.services.geomodel_features._load_json')
    @patch('app.services.geomodel_features.geomodel_service')
    def test_extract_geomodel_features_quality_flags(self, mock_service, mock_load):
        """Test quality flag extraction"""
        mock_service.get_artifact_path.side_effect = lambda job_id, name: Path(f"/tmp/{name}")

        summary_data = {}
        quality_data = {
            "warning_flags": {
                "low_continuity": True,
                "high_pinchout": True,
                "high_variability": False
            }
        }
        mock_load.side_effect = [summary_data, quality_data]

        result = extract_geomodel_features("test-job")

        assert "low_continuity" in result["quality_flags"]
        assert "high_pinchout" in result["quality_flags"]
        assert "high_variability" not in result["quality_flags"]

    @patch('app.services.geomodel_features._load_json')
    @patch('app.services.geomodel_features.geomodel_service')
    def test_extract_geomodel_features_defaults(self, mock_service, mock_load):
        """Test default values when data is missing"""
        mock_service.get_artifact_path.side_effect = lambda job_id, name: Path(f"/tmp/{name}")

        summary_data = {}
        quality_data = {}
        mock_load.side_effect = [summary_data, quality_data]

        result = extract_geomodel_features("test-job")

        # Should use defaults
        assert result["values"]["key_layer_span"] == 80.0
        assert result["values"]["layer_cv"] == 0.3
        assert result["values"]["pinchout_ratio"] == 0.0
        assert result["values"]["continuity_score"] == 0.5

    @patch('app.services.geomodel_features._load_json')
    @patch('app.services.geomodel_features.geomodel_service')
    def test_extract_geomodel_features_source_info(self, mock_service, mock_load):
        """Test source information in result"""
        mock_service.get_artifact_path.side_effect = lambda job_id, name: Path(f"/tmp/{name}")

        summary_data = {}
        quality_data = {}
        mock_load.side_effect = [summary_data, quality_data]

        result = extract_geomodel_features("test-job-123")

        assert result["source"]["job_id"] == "test-job-123"
        assert "summary_file" in result["source"]
        assert "quality_file" in result["source"]

    @patch('app.services.geomodel_features._load_json')
    @patch('app.services.geomodel_features.geomodel_service')
    def test_extract_geomodel_features_all_warnings(self, mock_service, mock_load):
        """Test with all quality warnings"""
        mock_service.get_artifact_path.side_effect = lambda job_id, name: Path(f"/tmp/{name}")

        summary_data = {}
        quality_data = {
            "warning_flags": {
                "low_continuity": True,
                "high_pinchout": True,
                "high_variability": True
            }
        }
        mock_load.side_effect = [summary_data, quality_data]

        result = extract_geomodel_features("test-job")

        assert len(result["quality_flags"]) == 3

    @patch('app.services.geomodel_features._load_json')
    @patch('app.services.geomodel_features.geomodel_service')
    def test_extract_geomodel_features_no_warnings(self, mock_service, mock_load):
        """Test with no quality warnings"""
        mock_service.get_artifact_path.side_effect = lambda job_id, name: Path(f"/tmp/{name}")

        summary_data = {}
        quality_data = {
            "warning_flags": {
                "low_continuity": False,
                "high_pinchout": False,
                "high_variability": False
            }
        }
        mock_load.side_effect = [summary_data, quality_data]

        result = extract_geomodel_features("test-job")

        assert len(result["quality_flags"]) == 0


class TestDefaultFeatures:
    """Test default feature values"""

    def test_default_features_structure(self):
        """Test that default features have correct structure"""
        assert "key_layer_span" in DEFAULT_GEOMODEL_FEATURES
        assert "layer_cv" in DEFAULT_GEOMODEL_FEATURES
        assert "pinchout_ratio" in DEFAULT_GEOMODEL_FEATURES
        assert "continuity_score" in DEFAULT_GEOMODEL_FEATURES

    def test_default_features_values(self):
        """Test default feature values"""
        assert DEFAULT_GEOMODEL_FEATURES["key_layer_span"] == 80.0
        assert DEFAULT_GEOMODEL_FEATURES["layer_cv"] == 0.3
        assert DEFAULT_GEOMODEL_FEATURES["pinchout_ratio"] == 0.0
        assert DEFAULT_GEOMODEL_FEATURES["continuity_score"] == 0.5
