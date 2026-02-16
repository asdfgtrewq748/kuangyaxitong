#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Real-time Monitor for Agent Team Optimization

Shows live progress of the agent team optimization cycles.
"""

import sys
import os
import time
from pathlib import Path

# Set UTF-8
if sys.platform == "win32":
    os.system("chcp 65001 > nul")

def get_latest_report():
    """Get the latest optimization report"""
    reports_dir = Path("agent_team/optimization_reports")
    if not reports_dir.exists():
        return None

    cycle_files = sorted(reports_dir.glob("cycle_*.md"), reverse=True)
    if not cycle_files:
        return None

    return cycle_files[0]

def count_cycles():
    """Count completed cycles"""
    reports_dir = Path("agent_team/optimization_reports")
    if not reports_dir.exists():
        return 0

    cycle_files = list(reports_dir.glob("cycle_*.md"))
    return len(cycle_files)

def show_status():
    """Show current status"""
    print("\033[H\033[J", end="")  # Clear screen
    print("=" * 70)
    print("Agent Team 24/7 Optimization - Real-time Monitor")
    print("=" * 70)
    print()

    # Count cycles
    completed_cycles = count_cycles()
    remaining_cycles = 10 - completed_cycles

    print(f"Progress: {completed_cycles}/10 cycles completed")
    print(f"Remaining: {remaining_cycles} cycles")
    print()

    # Show progress bar
    bar_length = 40
    completed_length = int((completed_cycles / 10) * bar_length)
    bar = "=" * completed_length + "-" * (bar_length - completed_length)
    print(f"[{bar}] {completed_cycles * 10}%")
    print()

    # Show latest report
    latest_report = get_latest_report()
    if latest_report:
        print(f"Latest Report: {latest_report.name}")
        print()

        # Parse and show summary
        try:
            with open(latest_report, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract key info
            for line in content.split('\n')[:30]:
                if "Cycle Number:" in line:
                    print(f"  {line}")
                elif "Focus Areas:" in line:
                    print(f"  {line}")
                elif "**Total Tasks**" in line or "- **Completed**:" in line:
                    print(f"  {line}")
                elif "- **Failed**:" in line:
                    print(f"  {line}")

        except Exception as e:
            print(f"  (Error reading report: {e})")

    print()
    print("=" * 70)
    print("Monitoring (press Ctrl+C to stop)")
    print("Commands:")
    print("  tail -f agent_team/agent_team_10cycles.log")
    print("  ls -lh agent_team/optimization_reports/")
    print("  ls -lh test_artifacts/screenshots/")
    print("=" * 70)
    print()

def main():
    """Main monitoring loop"""
    try:
        update_interval = 30  # Update every 30 seconds

        while True:
            show_status()
            print(f"Next update in {update_interval} seconds... (Ctrl+C to stop)")
            time.sleep(update_interval)

    except KeyboardInterrupt:
        print("\n\n[STOPPED] Monitoring stopped")
        print("\nFinal Status:")
        print(f"  Total cycles completed: {count_cycles()}/10")
        print(f"  Reports: agent_team/optimization_reports/")
        print(f"  Logs: agent_team/agent_team_10cycles.log")

if __name__ == "__main__":
    main()
