#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quick Start: 24/7 Continuous Optimization

Usage:
  python start_247_optimization.py          # Start with auto-confirm
  python start_247_optimization.py --manual # Manual confirmation mode
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from continuous_optimization import ContinuousOptimizationScheduler


async def main():
    """Start the 24/7 optimization system"""

    print("""
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║          🤖 24/7 Agent Team - Continuous Optimization            ║
║                                                                  ║
║  This system will continuously optimize your project using:       ║
║                                                                  ║
║  🎯 Team Leader (决策者)                                         ║
║     • Uses brainstorming skill for deep analysis                 ║
║     • Makes informed decisions on optimizations                  ║
║                                                                  ║
║  ✅ QA Specialist (验收专家)                                    ║
║     • Uses Playwright for browser testing                        ║
║     • Validates all changes automatically                        ║
║                                                                  ║
║  🔧 Bug Hunter (修复者)                                         ║
║     • Fixes bugs and security issues                             ║
║     • Cleans up technical debt                                  ║
║                                                                  ║
║  🛠️ Domain Agents (Backend, Frontend, Data, Algorithm, DevOps)  ║
║     • Execute specialized optimization tasks                     ║
║                                                                  ║
║  Features:                                                       ║
║    • Intelligent scheduling (time-based + weekly themes)         ║
║    • Quality gates enforcement                                  ║
║    • Detailed reports every cycle                               ║
║    • Auto-confirmation mode (no prompts)                        ║
║                                                                  ║
║  Press Ctrl+C to stop gracefully                                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
""")

    # Check for manual mode
    auto_confirm = "--manual" not in sys.argv

    if auto_confirm:
        print("✅ Auto-confirm mode ENABLED - All decisions will be made automatically")
        print("    Use --manual flag for manual confirmation mode\n")
    else:
        print("⚠️  Manual confirmation mode ENABLED - You will be prompted for decisions\n")

    input("Press Enter to start optimization... ")

    scheduler = ContinuousOptimizationScheduler(auto_confirm=auto_confirm)

    try:
        await scheduler.start()
    except KeyboardInterrupt:
        print("\n\n✋ Optimization stopped by user")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
