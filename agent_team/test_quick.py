#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quick Test: Agent Team Advanced Features
"""

import asyncio
import sys
import os
from pathlib import Path

# Set UTF-8 encoding for Windows console
if sys.platform == "win32":
    os.system("chcp 65001 > nul")

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_team.coordinator import AgentCoordinator
from agent_team.agents_advanced import create_advanced_agents
from agent_team.agents import create_domain_agents
from agent_team.core import Task, TaskPriority


async def test_agents():
    """Test agent team"""

    print("=" * 70)
    print("Agent Team Advanced Features Test")
    print("=" * 70)

    # Create coordinator
    coordinator = AgentCoordinator()

    # Register agents
    print("\n[1/2] Registering agents...")
    advanced_agents = create_advanced_agents(auto_confirm=True)
    for agent in advanced_agents:
        coordinator.register_agent(agent)
        print(f"  + {agent.config.name}")

    domain_agents = create_domain_agents()
    for agent in domain_agents:
        coordinator.register_agent(agent)
        print(f"  + {agent.config.name}")

    print(f"\n  Total: {len(coordinator.agents)} agents registered")

    # Start coordinator
    print("\n[2/2] Starting coordinator...")
    await coordinator.start()
    print("  Coordinator started")

    # Test 1: Team Leader Analysis
    print("\n" + "=" * 70)
    print("TEST 1: Team Leader Analysis")
    print("=" * 70)

    analysis_task = coordinator.create_task(
        title="Analyze Project",
        description="Analyze project for optimization opportunities",
        agent_type="leader",
        priority=TaskPriority.HIGH,
        input_data={"action": "analyze_and_plan", "focus_areas": ["performance", "quality"]},
    )

    task_id = coordinator.submit_task(analysis_task)
    print(f"  Task submitted: {analysis_task.title}")
    print("  Waiting for analysis...")

    await asyncio.sleep(3)

    status = coordinator.get_task_status(task_id)
    if status and status["status"] == "completed":
        print("  [OK] Analysis completed")
        output = status.get("output_data", {})
        print(f"  Method: {output.get('method', 'standard')}")
        print(f"  Opportunities: {len(output.get('opportunities', []))}")
    else:
        print("  [ERROR] Analysis failed")

    # Test 2: QA Validation
    print("\n" + "=" * 70)
    print("TEST 2: QA Specialist Validation")
    print("=" * 70)

    qa_task = coordinator.create_task(
        title="Validate with Playwright",
        description="Validate pages using Playwright",
        agent_type="qa",
        priority=TaskPriority.HIGH,
        input_data={
            "action": "validate_changes",
            "changes": [{"file": "frontend/src/views/GeomodelVisualization.vue", "type": "frontend"}],
        },
    )

    task_id = coordinator.submit_task(qa_task)
    print(f"  Task submitted: {qa_task.title}")
    print("  Waiting for validation...")

    await asyncio.sleep(3)

    status = coordinator.get_task_status(task_id)
    if status:
        if status["status"] == "completed":
            print("  [OK] Validation completed")
            output = status.get("output_data", {})
            print(f"  Method: {output.get('method', 'standard')}")
            print(f"  Approved: {output.get('approved', False)}")
        else:
            print(f"  Status: {status['status']}")
    else:
        print("  [ERROR] Validation failed")

    # Show status
    print("\n" + "=" * 70)
    print("Final Status")
    print("=" * 70)
    coordinator.print_status()

    # Stop
    await coordinator.stop()

    print("\n" + "=" * 70)
    print("Test Complete!")
    print("=" * 70)
    print("\nNext: Run 'python start_247_optimization.py' for 24/7 optimization")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    try:
        asyncio.run(test_agents())
    except KeyboardInterrupt:
        print("\n\n[STOPPED] Test stopped")
    except Exception as e:
        print(f"\n\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
