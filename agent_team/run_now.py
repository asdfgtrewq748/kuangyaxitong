#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Start 24/7 Optimization Immediately (No Prompt)
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from continuous_optimization import ContinuousOptimizationScheduler


async def main():
    """Start immediately without prompt"""

    print("\n" + "=" * 70)
    print("Starting 24/7 Continuous Optimization...")
    print("=" * 70)
    print("\nConfiguration:")
    print("  - Auto-confirm: ENABLED")
    print("  - Cycle interval: 30 minutes")
    print("  - Reports: test_artifacts/reports/")
    print("  - Screenshots: test_artifacts/screenshots/")
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
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
