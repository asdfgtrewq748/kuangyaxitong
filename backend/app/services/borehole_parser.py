from __future__ import annotations

from typing import Dict, List
import pandas as pd

COLUMN_MAP = {
    "名称": "name",
    "岩性": "name",
    "layer_name": "name",
    "厚度": "thickness",
    "厚度/m": "thickness",
    "弹性模量": "elastic_modulus",
    "弹性模量/Gpa": "elastic_modulus",
    "容重": "density",
    "容重/kN*m-3": "density",
    "抗拉强度": "tensile_strength",
    "抗拉强度/MPa": "tensile_strength",
    "抗剪强度": "shear_strength",
    "抗剪强度/MPa": "shear_strength",
    "序号": "index",
}


def _normalize_column(col: str) -> str:
    key = col.strip()
    return COLUMN_MAP.get(key, key)


def normalize_borehole_df(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [_normalize_column(c) for c in df.columns]
    return df


def add_depth_columns(df: pd.DataFrame) -> pd.DataFrame:
    if "thickness" not in df.columns:
        return df

    df = df.copy()
    thickness = pd.to_numeric(df["thickness"], errors="coerce").fillna(0)
    z_top = thickness.cumsum().shift(fill_value=0)
    z_bottom = thickness.cumsum()
    df["z_top"] = z_top
    df["z_bottom"] = z_bottom
    return df


def fill_missing_by_lithology(df: pd.DataFrame, lith_avg_map: Dict) -> pd.DataFrame:
    if "name" not in df.columns:
        return df

    df = df.copy()
    for idx, row in df.iterrows():
        name = row.get("name")
        if name not in lith_avg_map:
            continue
        averages = lith_avg_map[name]
        for key in ["thickness", "elastic_modulus", "density", "tensile_strength", "shear_strength"]:
            if key in df.columns:
                if pd.isna(row.get(key)) or str(row.get(key)).strip() == "":
                    df.at[idx, key] = averages.get(key, row.get(key))
    return df
