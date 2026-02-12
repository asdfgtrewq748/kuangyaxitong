from __future__ import annotations

from typing import Dict, Iterable, List


def percentile(values: Iterable[float], pct: float) -> float:
    data = sorted(float(v) for v in values)
    if not data:
        return 0.0

    p = max(0.0, min(100.0, float(pct)))
    if len(data) == 1:
        return data[0]

    rank = (p / 100.0) * (len(data) - 1)
    low = int(rank)
    high = min(low + 1, len(data) - 1)
    weight = rank - low
    return data[low] + (data[high] - data[low]) * weight


def summarize_latencies(
    latencies_ms: List[float],
    total_requests: int,
    success_count: int,
    elapsed_ms: float,
) -> Dict[str, object]:
    total = max(0, int(total_requests))
    success = max(0, min(int(success_count), total))
    failed = max(total - success, 0)
    elapsed = max(float(elapsed_ms), 0.0)

    values = [float(v) for v in latencies_ms if v is not None]
    if values:
        avg = sum(values) / len(values)
        latency = {
            "min": min(values),
            "max": max(values),
            "avg": avg,
            "p50": percentile(values, 50),
            "p90": percentile(values, 90),
            "p95": percentile(values, 95),
            "p99": percentile(values, 99),
        }
    else:
        latency = {
            "min": 0.0,
            "max": 0.0,
            "avg": 0.0,
            "p50": 0.0,
            "p90": 0.0,
            "p95": 0.0,
            "p99": 0.0,
        }

    success_rate = (success / total) if total else 0.0
    elapsed_sec = elapsed / 1000.0
    rps = (total / elapsed_sec) if elapsed_sec > 0 else 0.0

    return {
        "total_requests": total,
        "success_count": success,
        "failed_count": failed,
        "success_rate": success_rate,
        "elapsed_ms": elapsed,
        "rps": rps,
        "latency_ms": latency,
    }
