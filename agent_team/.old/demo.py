#!/usr/bin/env python3
"""
Quick Demo: Run a Single Optimization Cycle

This script demonstrates the agent team by running one optimization cycle.
"""

import asyncio
import sys
from pathlib import Path

# Add agent_team to path
sys.path.insert(0, str(Path(__file__).parent))

from scheduler import OptimizationScheduler, AgentCoordinator
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(message)s'
)


async def demo_single_cycle():
    """Run a single optimization cycle for demonstration"""
    print("""
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║              🤖 Agent Team - Single Cycle Demo                    ║
║                                                                  ║
║  This will run ONE optimization cycle to demonstrate the system    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
""")

    print("\n🔧 Initializing Agent Team...")

    # Create coordinator
    coordinator = AgentCoordinator()

    # Import and create agents
    from agents import create_all_agents
    for agent in create_all_agents():
        coordinator.register_agent(agent)

    print(f"  ✓ Registered {len(coordinator.agents)} agents")

    # Start coordinator
    await coordinator.start()

    # Create scheduler
    scheduler = OptimizationScheduler(coordinator)

    print("\n🚀 Running single optimization cycle...\n")

    # Manually run one cycle (bypassing the loop)
    from datetime import datetime

    # Analyze
    print("⚡ Step 1: Analyzing project...")
    analysis = await scheduler._analyze_project()
    print(f"  Quality Score: {analysis['quality_score']:.1f}/100")
    print(f"  Test Coverage: {analysis['coverage']}%")
    print(f"  Issues Found: {analysis['issues']}")

    # Get focus areas
    focus_areas = scheduler._get_current_focus_areas()
    print(f"\n🎯 Focus Areas: {', '.join(focus_areas)}")

    # Create tasks
    print("\n📋 Step 2: Creating tasks...")
    tasks = await scheduler._create_optimization_tasks(analysis, focus_areas)
    print(f"  Created {len(tasks)} tasks")
    for task in tasks:
        print(f"    • {task['title']} ({task['priority']})")

    # Execute
    print("\n⚙️  Step 3: Executing tasks...")
    results = await scheduler._execute_tasks_batch(tasks)
    print(f"  Completed: {results['completed']}")
    print(f"  Failed: {results['failed']}")

    # Validate
    print("\n✅ Step 4: Validating results...")
    validation = await scheduler._validate_results(results)
    print(f"  Bugs Fixed: {validation['bugs_fixed']}")
    print(f"  Approved: {validation['approved']}")
    print(f"  All Passed: {validation['all_passed']}")

    # Report
    print("\n📊 Step 5: Generating report...")
    stats = {
        "total_cycles": 1,
        "tasks_completed": results['completed'],
        "bugs_fixed": validation['bugs_fixed'],
        "optimizations_applied": validation['approved']
    }

    await scheduler._generate_cycle_report(stats, analysis, results, validation)

    # Cleanup
    print("\n🧹 Cleaning up...")
    await coordinator.stop()

    print("""
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                      ✨ Demo Complete!                          ║
║                                                                  ║
║  To run 24/7 optimization:                                      ║
║    python start_agents.py                                        ║
║                                                                  ║
║  To view reports:                                               ║
║    cd optimization_reports                                      ║
║    ls -la                                                       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
""")


if __name__ == "__main__":
    try:
        asyncio.run(demo_single_cycle())
    except KeyboardInterrupt:
        print("\n\nDemo stopped by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
