#!/usr/bin/env python3
"""
24/7 Agent Team Startup Script

Run this script to start the continuous optimization team:
  python start_agents.py

Or run in background:
  nohup python start_agents.py > agent_team.log 2>&1 &
"""

import asyncio
import sys
import signal
from pathlib import Path

# Add agent_team to path
sys.path.insert(0, str(Path(__file__).parent))

from scheduler import main

# Handle shutdown gracefully
def signal_handler(sig, frame):
    print("\n\nShutdown signal received. Stopping gracefully...")
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║          🤖 24/7 Continuous Optimization Agent Team              ║
║                                                                  ║
║  Starting automated optimization team for the mining pressure    ║
║  assessment system...                                             ║
║                                                                  ║
║  Roles:                                                          ║
║    • Team Leader - Decision maker & coordinator                   ║
║    • Frontend Architect - UI/UX optimization                     ║
║    • Backend Architect - API performance                          ║
║    • QA Specialist - Testing & validation                         ║
║    • Bug Hunter - Code quality & security                         ║
║    • Performance Expert - Optimization                            ║
║    • Documentation Keeper - Docs maintenance                      ║
║                                                                  ║
║  Press Ctrl+C to stop                                             ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
""")

    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n✋ Agent Team stopped by user")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        sys.exit(1)
