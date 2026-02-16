#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quick Status Check - Check agent team progress without running
"""

import sys
import os
from pathlib import Path

# Set UTF-8
if sys.platform == "win32":
    os.system("chcp 65001 > nul")

reports_dir = Path("agent_team/optimization_reports")

print("=" * 70)
print("Agent Team Status Check")
print("=" * 70)
print()

# Check if reports exist
if not reports_dir.exists():
    print("[STATUS] Agent Team has not started yet")
    print("\nTo start:")
    print("  cd agent_team")
    print("  python run_n_cycles.py 10")
    print("=" * 70)
    sys.exit(0)

# List all cycle reports
cycle_files = sorted(reports_dir.glob("cycle_*.md"), reverse=True)

if not cycle_files:
    print("[STATUS] No cycle reports found yet")
    print("\nAgent Team may be running first cycle...")
else:
    latest_report = cycle_files[0]
    print(f"[STATUS] Found {len(cycle_files)} completed cycles")
    print(f"\nLatest report: {latest_report.name}")
    print()

    # Show latest report content
    print("=" * 70)
    print("Latest Cycle Summary")
    print("=" * 70)
    print()

    with open(latest_report, 'r', encoding='utf-8') as f:
        content = f.read()
        # Show first 50 lines
        lines = content.split('\n')[:50]
        print('\n'.join(lines))
        if len(content.split('\n')) > 50:
            print(f"\n... (report truncated)")
            print(f"\nFull report: {latest_report}")

print()
print("=" * 70)
print("Live Commands:")
if sys.platform == "win32":
    print("  Get-Content agent_team\\optimizer.err.log -Wait -Tail 60")
    print("  Get-ChildItem agent_team\\optimization_reports | Sort-Object LastWriteTime -Descending | Select-Object -First 10")
    print("  Get-ChildItem test_artifacts\\screenshots")
else:
    print("  tail -f agent_team/continuous_optimization.log")
    print("  ls -lh agent_team/optimization_reports/")
    print("  ls -lh test_artifacts/screenshots/")
print("=" * 70)
