"""
Unit tests for borehole_parser service

Tests cover:
- Column normalization
- Borehole DataFrame normalization
- Depth column addition
- Missing value filling by lithology
"""
import pytest
import pandas as pd
import numpy as np

from app.services.borehole_parser import (
    _normalize_column,
    normalize_borehole_df,
    add_depth_columns,
    fill_missing_by_lithology,
)


class TestNormalizeColumn:
    """Test column name normalization"""

    def test_normalize_column_chinese_name(self):
        """Test Chinese column name normalization"""
        assert _normalize_column("名称") == "name"
        assert _normalize_column("岩性") == "name"

    def test_normalize_column_chinese_thickness(self):
        """Test Chinese thickness column normalization"""
        assert _normalize_column("厚度") == "thickness"
        assert _normalize_column("厚度/m") == "thickness"

    def test_normalize_column_chinese_elastic_modulus(self):
        """Test Chinese elastic modulus column normalization"""
        assert _normalize_column("弹性模量") == "elastic_modulus"
        assert _normalize_column("弹性模量/Gpa") == "elastic_modulus"

    def test_normalize_column_chinese_density(self):
        """Test Chinese density column normalization"""
        assert _normalize_column("容重") == "density"
        assert _normalize_column("容重/kN*m-3") == "density"

    def test_normalize_column_english(self):
        """Test English column name normalization"""
        assert _normalize_column("layer_name") == "name"

    def test_normalize_column_unknown(self):
        """Test unknown column name"""
        assert _normalize_column("custom_column") == "custom_column"

    def test_normalize_column_with_spaces(self):
        """Test column name with spaces"""
        assert _normalize_column("  名称  ") == "name"


class TestNormalizeBoreholeDf:
    """Test borehole DataFrame normalization"""

    def test_normalize_borehole_df_basic(self):
        """Test basic DataFrame normalization"""
        df = pd.DataFrame({
            "名称": ["砂岩", "泥岩"],
            "厚度": [10.0, 20.0]
        })

        result = normalize_borehole_df(df)

        assert "name" in result.columns
        assert "thickness" in result.columns
        assert list(result["name"]) == ["砂岩", "泥岩"]

    def test_normalize_borehole_df_mixed_columns(self):
        """Test with mixed Chinese and English columns"""
        df = pd.DataFrame({
            "名称": ["砂岩"],
            "elastic_modulus": [10.0]
        })

        result = normalize_borehole_df(df)

        assert "name" in result.columns
        assert "elastic_modulus" in result.columns

    def test_normalize_borehole_df_preserves_data(self):
        """Test that normalization preserves data"""
        df = pd.DataFrame({
            "名称": ["砂岩", "泥岩", "煤层"],
            "厚度": [10.0, 20.0, 5.0],
            "弹性模量": [15.0, 10.0, 8.0]
        })

        result = normalize_borehole_df(df)

        assert len(result) == 3
        assert list(result["thickness"]) == [10.0, 20.0, 5.0]

    def test_normalize_borehole_df_empty(self):
        """Test with empty DataFrame"""
        df = pd.DataFrame()
        result = normalize_borehole_df(df)
        assert isinstance(result, pd.DataFrame)


class TestAddDepthColumns:
    """Test depth column addition"""

    def test_add_depth_columns_basic(self):
        """Test basic depth column addition"""
        df = pd.DataFrame({
            "thickness": [10.0, 20.0, 30.0]
        })

        result = add_depth_columns(df)

        assert "z_top" in result.columns
        assert "z_bottom" in result.columns
        assert result["z_top"].iloc[0] == 0
        assert result["z_bottom"].iloc[0] == 10.0
        assert result["z_top"].iloc[1] == 10.0
        assert result["z_bottom"].iloc[1] == 30.0

    def test_add_depth_columns_single_row(self):
        """Test with single row"""
        df = pd.DataFrame({"thickness": [15.0]})

        result = add_depth_columns(df)

        assert result["z_top"].iloc[0] == 0
        assert result["z_bottom"].iloc[0] == 15.0

    def test_add_depth_columns_no_thickness(self):
        """Test with missing thickness column"""
        df = pd.DataFrame({"name": ["砂岩"]})

        result = add_depth_columns(df)

        # Should return original df without depth columns
        assert "z_top" not in result.columns
        assert "z_bottom" not in result.columns

    def test_add_depth_columns_with_nan(self):
        """Test with NaN thickness values"""
        df = pd.DataFrame({
            "thickness": [10.0, np.nan, 20.0]
        })

        result = add_depth_columns(df)

        # NaN should be treated as 0
        assert "z_top" in result.columns
        assert "z_bottom" in result.columns

    def test_add_depth_columns_preserves_original(self):
        """Test that original DataFrame is not modified"""
        df = pd.DataFrame({"thickness": [10.0, 20.0]})

        result = add_depth_columns(df)

        # Original df should not have depth columns
        assert "z_top" not in df.columns
        # Result should have them
        assert "z_top" in result.columns


class TestFillMissingByLithology:
    """Test filling missing values by lithology"""

    def test_fill_missing_by_lithology_basic(self):
        """Test basic missing value filling"""
        df = pd.DataFrame({
            "name": ["砂岩", "泥岩"],
            "elastic_modulus": [10.0, np.nan]
        })
        lith_map = {
            "泥岩": {"elastic_modulus": 8.0, "density": 25.0}
        }

        result = fill_missing_by_lithology(df, lith_map)

        assert result["elastic_modulus"].iloc[1] == 8.0
        assert result["elastic_modulus"].iloc[0] == 10.0

    def test_fill_missing_by_lithology_multiple_fields(self):
        """Test filling multiple fields"""
        df = pd.DataFrame({
            "name": ["砂岩", "砂岩"],
            "elastic_modulus": [np.nan, np.nan],
            "density": [np.nan, 26.0]
        })
        lith_map = {
            "砂岩": {"elastic_modulus": 15.0, "density": 25.0}
        }

        result = fill_missing_by_lithology(df, lith_map)

        assert result["elastic_modulus"].iloc[0] == 15.0
        assert result["elastic_modulus"].iloc[1] == 15.0
        assert result["density"].iloc[0] == 25.0

    def test_fill_missing_by_lithology_no_match(self):
        """Test when lithology not in map"""
        df = pd.DataFrame({
            "name": ["砂岩"],
            "elastic_modulus": [np.nan]
        })
        lith_map = {
            "泥岩": {"elastic_modulus": 8.0}
        }

        result = fill_missing_by_lithology(df, lith_map)

        # Should remain NaN
        assert pd.isna(result["elastic_modulus"].iloc[0])

    def test_fill_missing_by_lithology_no_name_column(self):
        """Test when name column is missing"""
        df = pd.DataFrame({
            "thickness": [10.0]
        })
        lith_map = {"砂岩": {"elastic_modulus": 15.0}}

        result = fill_missing_by_lithology(df, lith_map)

        # Should return df unchanged
        assert "thickness" in result.columns

    def test_fill_missing_by_lithology_empty_string(self):
        """Test filling empty string values"""
        df = pd.DataFrame({
            "name": ["砂岩"],
            "elastic_modulus": [""]  # Empty string
        })
        lith_map = {
            "砂岩": {"elastic_modulus": 15.0}
        }

        result = fill_missing_by_lithology(df, lith_map)

        # Should fill empty string with average
        assert result["elastic_modulus"].iloc[0] == 15.0

    def test_fill_missing_by_lithology_preserves_existing(self):
        """Test that existing values are not overwritten"""
        df = pd.DataFrame({
            "name": ["砂岩", "砂岩"],
            "elastic_modulus": [20.0, np.nan]
        })
        lith_map = {
            "砂岩": {"elastic_modulus": 15.0}
        }

        result = fill_missing_by_lithology(df, lith_map)

        # First value should be preserved
        assert result["elastic_modulus"].iloc[0] == 20.0
        # Second should be filled
        assert result["elastic_modulus"].iloc[1] == 15.0


class TestIntegration:
    """Integration tests for borehole parser workflow"""

    def test_full_workflow(self):
        """Test complete parsing workflow"""
        # Start with raw data
        df = pd.DataFrame({
            "名称": ["砂岩", "泥岩", "煤层"],
            "厚度/m": [10.0, np.nan, 5.0],
            "弹性模量/Gpa": [15.0, 10.0, np.nan]
        })

        # Step 1: Normalize columns
        df = normalize_borehole_df(df)
        assert "name" in df.columns
        assert "thickness" in df.columns

        # Step 2: Fill missing values
        lith_map = {
            "泥岩": {"thickness": 8.0, "elastic_modulus": 10.0},
            "煤层": {"thickness": 5.0, "elastic_modulus": 5.0}
        }
        df = fill_missing_by_lithology(df, lith_map)

        # Step 3: Add depth columns
        df = add_depth_columns(df)

        assert "z_top" in df.columns
        assert "z_bottom" in df.columns
        assert len(df) == 3
