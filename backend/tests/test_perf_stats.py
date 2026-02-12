from __future__ import annotations

from app.services.perf_stats import percentile, summarize_latencies


def test_percentile_returns_expected_values():
    values = [10.0, 20.0, 30.0, 40.0, 50.0]
    assert percentile(values, 0) == 10.0
    assert percentile(values, 50) == 30.0
    assert percentile(values, 90) == 46.0
    assert percentile(values, 100) == 50.0


def test_summarize_latencies_builds_core_metrics():
    stats = summarize_latencies(
        latencies_ms=[120.0, 140.0, 160.0, 180.0],
        total_requests=5,
        success_count=4,
        elapsed_ms=1000.0,
    )
    assert stats["total_requests"] == 5
    assert stats["success_count"] == 4
    assert stats["failed_count"] == 1
    assert stats["success_rate"] == 0.8
    assert stats["rps"] == 5.0
    assert stats["latency_ms"]["p50"] == 150.0
    assert stats["latency_ms"]["p95"] == 177.0
    assert stats["latency_ms"]["max"] == 180.0


def test_summarize_latencies_handles_empty_input():
    stats = summarize_latencies(
        latencies_ms=[],
        total_requests=0,
        success_count=0,
        elapsed_ms=0.0,
    )
    assert stats["success_rate"] == 0.0
    assert stats["rps"] == 0.0
    assert stats["latency_ms"]["p50"] == 0.0
    assert stats["latency_ms"]["max"] == 0.0
