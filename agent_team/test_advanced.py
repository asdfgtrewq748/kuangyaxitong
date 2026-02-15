#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test Advanced Agent Features

This script tests the advanced features:
- Team Leader with brainstorming
- QA Specialist with Playwright
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_team.coordinator import AgentCoordinator
from agent_team.agents_advanced import create_advanced_agents
from agent_team.agents import create_domain_agents
from agent_team.core import Task, TaskPriority


async def test_advanced_features():
    """Test advanced agent features"""

    print("""
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║          🧪 Testing Advanced Agent Features                     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
""")

    # Create coordinator
    coordinator = AgentCoordinator()

    # Register advanced agents
    print("[1/3] Registering advanced agents...")
    advanced_agents = create_advanced_agents(auto_confirm=True)
    for agent in advanced_agents:
        coordinator.register_agent(agent)
        print(f"  ✓ {agent.config.name}")

    # Register domain agents
    print("\n[2/3] Registering domain agents...")
    domain_agents = create_domain_agents()
    for agent in domain_agents:
        coordinator.register_agent(agent)
        print(f"  ✓ {agent.config.name}")

    # Start coordinator
    print("\n[3/3] Starting coordinator...")
    await coordinator.start()
    print("  ✓ Coordinator started\n")

    # Test 1: Team Leader Analysis with Brainstorming
    print("=" * 70)
    print("TEST 1: Team Leader with Brainstorming Skill")
    print("=" * 70)

    analysis_task = coordinator.create_task(
        title="Analyze Project Quality",
        description="Use brainstorming skill to analyze project",
        agent_type="leader",
        priority=TaskPriority.HIGH,
        input_data={
            "action": "analyze_and_plan",
            "focus_areas": ["performance", "quality"],
        },
    )

    task_id = coordinator.submit_task(analysis_task)
    print(f"✓ Task submitted: {analysis_task.title}")

    # Wait for completion
    print("⏳ Waiting for analysis (brainstorming)...")
    await asyncio.sleep(5)

    # Check result
    status = coordinator.get_task_status(task_id)
    if status and status["status"] == "completed":
        print("✓ Analysis completed successfully")
        output = status.get("output_data", {})
        print(f"  Method: {output.get('method', 'unknown')}")
        print(f"  Opportunities found: {len(output.get('opportunities', []))}")
    else:
        print("✗ Analysis failed")

    # Test 2: QA Specialist with Playwright
    print("\n" + "=" * 70)
    print("TEST 2: QA Specialist with Playwright Browser Testing")
    print("=" * 70)

    qa_task = coordinator.create_task(
        title="Validate Changes with Playwright",
        description="Use Playwright to validate page rendering",
        agent_type="qa",
        priority=TaskPriority.HIGH,
        input_data={
            "action": "validate_changes",
            "changes": [
                {"file": "frontend/src/views/GeomodelVisualization.vue", "type": "frontend"},
                {"file": "frontend/src/views/ResearchWorkbench.vue", "type": "frontend"},
            ],
        },
    )

    task_id = coordinator.submit_task(qa_task)
    print(f"✓ Task submitted: {qa_task.title}")

    # Wait for completion
    print("⏳ Waiting for validation (Playwright testing)...")
    print("  Note: This will create Playwright test scripts and run them")

    await asyncio.sleep(5)

    # Check result
    status = coordinator.get_task_status(task_id)
    if status:
        if status["status"] == "completed":
            print("✓ Validation completed")
            output = status.get("output_data", {})
            print(f"  Method: {output.get('method', 'unknown')}")
            print(f"  Approved: {output.get('approved', False)}")
            print(f"  Issues found: {len(output.get('issues', []))}")

            if output.get("screenshots"):
                print(f"  Screenshots: {len(output['screenshots'])} captured")
                for screenshot in output['screenshots'][:3]:
                    print(f"    - {screenshot}")
        else:
            print(f"⚠ Validation status: {status['status']}")
    else:
        print("✗ Validation failed")

    # Show final status
    print("\n" + "=" * 70)
    print("Final Status")
    print("=" * 70)
    coordinator.print_status()

    # Stop coordinator
    await coordinator.stop()

    print("\n" + "=" * 70)
    print("✅ Advanced Features Test Complete")
    print("=" * 70)
    print("\nNext Steps:")
    print("  • Run 'python start_247_optimization.py' for 24/7 continuous optimization")
    print("  • Check agent_team/optimization_reports/ for detailed reports")
    print("  • Check agent_team/playwright_tests/ for Playwright test scripts")
    print("  • Check agent_team/playwright_screenshots/ for test screenshots")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    try:
        asyncio.run(test_advanced_features())
    except KeyboardInterrupt:
        print("\n\n✋ Test stopped by user")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
