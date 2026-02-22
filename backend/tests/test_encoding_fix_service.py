from pathlib import Path

from app.services import encoding_fix


def test_fix_csv_encoding_success(monkeypatch, tmp_path):
    csv_path = tmp_path / "sample.csv"
    csv_path.write_text("x,y\n1,2\n", encoding="utf-8")

    calls = {"analyze": 0, "to_csv": None}

    def fake_analyze(path: Path):
        assert path == csv_path
        calls["analyze"] += 1
        return {"stage": calls["analyze"]}

    class DummyDf:
        def to_csv(self, path, index=False, encoding="utf-8"):
            calls["to_csv"] = (path, index, encoding)

    monkeypatch.setattr(encoding_fix, "analyze_csv_file", fake_analyze)
    monkeypatch.setattr(encoding_fix, "read_csv_robust", lambda path: DummyDf())

    result = encoding_fix.fix_csv_encoding(csv_path)

    assert result["file"] == "sample.csv"
    assert result["status"] == "ok"
    assert result["error"] is None
    assert result["before"] == {"stage": 1}
    assert result["after"] == {"stage": 2}
    assert calls["to_csv"] == (csv_path, False, "utf-8")


def test_fix_csv_encoding_failure(monkeypatch, tmp_path):
    csv_path = tmp_path / "broken.csv"
    csv_path.write_text("x\n1\n", encoding="utf-8")

    monkeypatch.setattr(encoding_fix, "analyze_csv_file", lambda path: {"ok": True})

    def fake_read_csv_robust(path):
        raise ValueError("decode failed")

    monkeypatch.setattr(encoding_fix, "read_csv_robust", fake_read_csv_robust)

    result = encoding_fix.fix_csv_encoding(csv_path)

    assert result["file"] == "broken.csv"
    assert result["status"] == "failed"
    assert result["error"] == "decode failed"
