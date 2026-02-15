#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simplified 24/7 Optimization - No Special Characters
"""

import asyncio
import sys
import os
from pathlib import Path

# Set UTF-8 encoding
if sys.platform == "win32":
    os.system("chcp 65001 > nul")

sys.path.insert(0, str(Path(__file__).parent))

from continuous_optimization import ContinuousOptimizationScheduler


async def main():
    print("=" * 70)
    print("24/7 Continuous Optimization System Starting")
    print("=" * 70)
    print("\nConfiguration:")
    print("  - Auto-confirm: ENABLED")
    print("  - Cycle interval: 30 minutes")
    print("  - Test artifacts: test_artifacts/")
    print("  - Reports: agent_team/optimization_reports/")
    print("\nPress Ctrl+C to stop\n")
    print("=" * 70 + "\n")

    scheduler = ContinuousOptimizationScheduler(auto_confirm=True)

    try:
        await scheduler.start()
    except KeyboardInterrupt:
        print("\n\n[STOPPED] Optimization stopped by user")
    except Exception as e:
        print(f"\n\n[ERROR] {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
