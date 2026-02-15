"""
Main entry point for the Agent Team system

This module provides the primary interface for running and interacting
with the agent team.
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_team.coordinator import AgentCoordinator
from agent_team.orchestrator import WorkflowOrchestrator
from agent_team.agents import create_all_agents
from agent_team.core import Task, TaskPriority


async def demo():
    """Demo function showing how to use the agent team"""
    print("\n=== Agent Team Demo ===\n")

    # Create coordinator
    coordinator = AgentCoordinator()

    # Create and register agents
    agents = create_all_agents()
    for agent in agents:
        coordinator.register_agent(agent)

    # Start coordinator
    await coordinator.start()

    # Show status
    coordinator.print_status()

    # Create some demo tasks
    print("\n--- Creating Demo Tasks ---\n")

    tasks = [
        coordinator.create_task(
            title="Optimize MPI Algorithm",
            description="Analyze and optimize the MPI calculation algorithm",
            agent_type="algorithm",
            priority=TaskPriority.HIGH,
            input_data={"action": "optimize_mpi"},
        ),
        coordinator.create_task(
            title="Fix Data Encoding",
            description="Scan and fix encoding issues in data files",
            agent_type="data",
            priority=TaskPriority.NORMAL,
            input_data={"action": "fix_csv_encoding"},
        ),
        coordinator.create_task(
            title="Optimize Backend API",
            description="Optimize API endpoints for better performance",
            agent_type="backend",
            priority=TaskPriority.NORMAL,
            input_data={"action": "optimize_api"},
        ),
    ]

    # Submit tasks
    task_ids = []
    for task in tasks:
        task_id = coordinator.submit_task(task)
        task_ids.append(task_id)
        print(f"Submitted task: {task.title} (ID: {task_id})")

    # Wait a bit for tasks to process
    print("\nProcessing tasks...")
    await asyncio.sleep(2)

    # Show updated status
    coordinator.print_status()

    # Check task statuses
    print("\n--- Task Statuses ---\n")
    for task_id in task_ids:
        status = coordinator.get_task_status(task_id)
        if status:
            print(f"{status['title']}: {status['status']}")

    # Demo workflow
    print("\n--- Workflow Demo ---\n")
    orchestrator = WorkflowOrchestrator(coordinator)

    print("Available workflows:")
    for name in orchestrator.list_templates():
        print(f"  - {name}")

    # Stop coordinator
    await coordinator.stop()
    print("\n=== Demo Complete ===\n")


if __name__ == "__main__":
    print("Mining Pressure Assessment - Agent Team System")
    print("=" * 50)

    if len(sys.argv) > 1 and sys.argv[1] == "demo":
        asyncio.run(demo())
    else:
        # Run the interface
        from agent_team.interface import main as interface_main
        interface_main()
