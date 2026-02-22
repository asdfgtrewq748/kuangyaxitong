from pathlib import Path

import pandas as pd

from app.services import rock_params_db as rpdb


def _row_template(**overrides):
    row = {
        "岩性": "砂岩",
        "矿名": "M1",
        "份": "P1",
        "市/县": "C1",
        "文献": "paper",
        "密度（kg*m3）": "2600",
        "体积模量（Gpa）": "10",
        "剪切模量/GPa": "6",
        "内聚力（MPa）": "3",
        "内摩擦角": "30",
        "抗拉强度（MPa）": "2",
        "抗压强度/MPa": "50",
        "弹性模量（Gpa）": "18",
        "泊松比": "0.25",
        "埋深": "100",
        "厚度": "5",
    }
    row.update(overrides)
    return row


def test_rockparams_from_row_to_dict_and_parse_helpers():
    obj = rpdb.RockParams.from_row(pd.Series(_row_template()))
    payload = obj.to_dict()
    assert payload["lithology"] == "砂岩"
    assert payload["mine"] == "M1"
    assert payload["density"] == 2600.0
    assert payload["elastic_modulus"] == 18.0

    assert rpdb._parse_float("1.5") == 1.5
    assert rpdb._parse_float("") is None
    assert rpdb._parse_float("bad") is None
    assert rpdb._mean([]) is None
    assert rpdb._mean([1.0, 2.0]) == 1.5
    assert rpdb._coverage_ratio(None) == 0.0
    assert rpdb._coverage_ratio(pd.Series([1, None, 3])) == 66.67


def test_database_queries_indexes_cache_and_statistics(monkeypatch, tmp_path):
    path = tmp_path / "db.csv"
    path.write_text("x\n1\n", encoding="utf-8")

    df = pd.DataFrame(
        [
            _row_template(**{"岩性": "砂岩", "矿名": "M1", "密度（kg*m3）": "2600", "弹性模量（Gpa）": "18"}),
            _row_template(**{"岩性": "泥岩", "矿名": "M1", "密度（kg*m3）": "2500", "弹性模量（Gpa）": "8"}),
            _row_template(**{"岩性": "粉砂岩", "矿名": "M2", "密度（kg*m3）": "", "弹性模量（Gpa）": ""}),
        ]
    )
    monkeypatch.setattr(rpdb, "read_csv_robust", lambda p: df.copy())
    monkeypatch.setattr(rpdb, "LITHOLOGY_SYNONYMS", {"砂岩": ["粉砂岩"], "泥岩": []})

    db = rpdb.RockParamsDatabase(path)

    # exact + synonym hit
    records = db.get_by_lithology("砂岩", use_synonyms=True)
    assert len(records) == 2
    assert all(isinstance(r, rpdb.RockParams) for r in records)

    by_mine = db.get_by_mine("M1")
    assert len(by_mine) == 2
    assert sorted(db.get_all_lithologies()) == ["泥岩", "砂岩", "粉砂岩"]
    assert sorted(db.get_all_mines()) == ["M1", "M2"]

    params_first = db.get_params_by_lithology("砂岩", use_synonyms=True)
    assert params_first["count"] == 2
    assert params_first["density"] == 2600.0  # second row has empty density

    # cache hit path
    db._stats_cache["砂岩_True"] = {"count": 99}
    assert db.get_params_by_lithology("砂岩", use_synonyms=True)["count"] == 99

    stats = db.get_statistics()
    assert stats["total_records"] == 3
    assert stats["unique_lithologies"] == 3
    assert stats["unique_mines"] == 2
    assert "density" in stats["parameter_coverage"]


def test_database_missing_file(monkeypatch, tmp_path):
    missing = tmp_path / "missing.csv"
    monkeypatch.setattr(rpdb, "read_csv_robust", lambda p: pd.DataFrame())
    try:
        rpdb.RockParamsDatabase(missing)
        assert False, "expected FileNotFoundError"
    except FileNotFoundError:
        pass


def test_global_helpers(monkeypatch):
    class _FakeDB:
        def __init__(self, db_path=None):
            self.db_path = db_path

        def get_params_by_lithology(self, lithology, use_synonyms):
            return {}

    rpdb._global_db = None
    monkeypatch.setattr(rpdb, "RockParamsDatabase", _FakeDB)
    db1 = rpdb.get_database(Path("one.csv"))
    db2 = rpdb.get_database(Path("two.csv"))
    assert db1 is db2
    assert db1.db_path == Path("one.csv")

    monkeypatch.setattr(rpdb, "get_database", lambda: _FakeDB())
    monkeypatch.setattr(rpdb, "get_default_params", lambda lithology: {"density": 1.0})
    assert rpdb.get_params_by_lithology("X") == {"density": 1.0}

    class _FakeDB2:
        def get_params_by_lithology(self, lithology, use_synonyms):
            return {"count": 1, "density": 2.0}

    monkeypatch.setattr(rpdb, "get_database", lambda: _FakeDB2())
    assert rpdb.get_params_by_lithology("X")["density"] == 2.0


def test_get_default_params_branches(monkeypatch):
    monkeypatch.setattr(
        rpdb,
        "DEFAULT_PARAMS",
        {
            "砂岩": {"density": 2600.0},
            "泥岩": {"density": 2500.0},
            "煤层": {"density": 1400.0},
            "砾岩": {"density": 2700.0},
            "石灰岩": {"density": 2800.0},
            "砂质泥岩": {"density": 2550.0},
            "细砂岩": {"density": 2650.0},
        },
    )
    monkeypatch.setattr(rpdb, "LITHOLOGY_SYNONYMS", {"砂岩": ["砂X"], "泥岩": []})

    assert rpdb.get_default_params("砂岩")["density"] == 2600.0
    assert rpdb.get_default_params("砂X")["density"] == 2600.0
    assert rpdb.get_default_params("含砂含泥层")["density"] == 2550.0
    assert rpdb.get_default_params("某砂岩层")["density"] == 2600.0
    assert rpdb.get_default_params("某泥岩层")["density"] == 2500.0
    assert rpdb.get_default_params("某煤层")["density"] == 1400.0
    assert rpdb.get_default_params("某砾岩")["density"] == 2700.0
    assert rpdb.get_default_params("某灰岩")["density"] == 2800.0
    assert rpdb.get_default_params("未知岩性")["density"] == 2500.0


def test_estimate_missing_params_branches(monkeypatch):
    monkeypatch.setattr(rpdb, "get_default_params", lambda lithology: {"density": 999.0})
    all_none = rpdb.estimate_missing_params({"density": None, "elastic_modulus": None, "compressive_strength": None})
    assert all_none == {"density": 999.0}

    coal_case = rpdb.estimate_missing_params(
        {
            "lithology": "煤",
            "density": None,
            "elastic_modulus": 12.0,
            "poisson_ratio": 0.25,
            "bulk_modulus": None,
            "shear_modulus": None,
            "compressive_strength": 30.0,
            "tensile_strength": None,
            "friction_angle": None,
            "cohesion": None,
        }
    )
    assert coal_case["density"] == 1400.0
    assert coal_case["shear_modulus"] == 12.0 / (2 * (1 + 0.25))
    assert coal_case["bulk_modulus"] == 12.0 / (3 * (1 - 2 * 0.25))
    assert coal_case["tensile_strength"] == 2.0
    assert coal_case["friction_angle"] == 25.0
    assert coal_case["cohesion"] == 1.5

    tensile_only_none_v = rpdb.estimate_missing_params(
        {
            "lithology": "普通砂岩",
            "density": None,
            "elastic_modulus": 10.0,
            "poisson_ratio": None,
            "compressive_strength": None,
            "tensile_strength": 2.0,
            "friction_angle": None,
            "cohesion": None,
        }
    )
    assert tensile_only_none_v["density"] == 2600.0
    assert tensile_only_none_v["shear_modulus"] == 10.0 / (2 * (1 + 0.25))
    assert tensile_only_none_v["bulk_modulus"] == 10.0 / (3 * (1 - 2 * 0.25))
    assert tensile_only_none_v["compressive_strength"] == 30.0
    assert tensile_only_none_v["friction_angle"] == 30.0
    assert tensile_only_none_v["cohesion"] == 3.0

    both_missing = rpdb.estimate_missing_params(
        {
            "lithology": "普通砂岩",
            "density": None,
            "elastic_modulus": 8.0,
            "compressive_strength": None,
            "tensile_strength": None,
            "friction_angle": None,
            "cohesion": None,
        }
    )
    assert both_missing["compressive_strength"] == 50.0
    assert both_missing["tensile_strength"] == 3.0
