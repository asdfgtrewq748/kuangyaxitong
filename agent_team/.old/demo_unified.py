#!/usr/bin/env python3
"""
Unified Demo: 24/7 Agent Team System

This demo shows the complete agent team with both role-based agents
(Team Leader, QA Specialist, Bug Hunter) and domain-specific agents
(Backend, Frontend, Data, Algorithm, DevOps, Testing).
"""

import asyncio
import sys
from pathlib import Path

# Add agent_team to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_team.coordinator import AgentCoordinator
from agent_team.agents import create_all_agents, create_role_agents, create_domain_agents
from agent_team.core import Task, TaskPriority


async def demo_single_cycle():
    """
    Run a single optimization cycle demonstrating the agent team
    """
    print("""
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║              🤖 24/7 Agent Team - Single Cycle Demo              ║
║                                                                  ║
║  This demo shows ONE optimization cycle with the full team:      ║
║                                                                  ║
║  Role-Based Agents (Coordinators):                               ║
║    • Team Leader (决策者) - Analyzes and coordinates             ║
║    • QA Specialist (验收专家) - Validates quality                 ║
║    • Bug Hunter (修复者) - Fixes issues                           ║
║                                                                  ║
║  Domain-Specific Agents (Executors):                             ║
║    • Backend Agent - FastAPI optimization                        ║
║    • Frontend Agent - Vue 3 optimization                         ║
║    • Data Agent - Data processing                                ║
║    • Algorithm Agent - MPI & modeling                            ║
║    • DevOps Agent - Infrastructure                               ║
║    • Testing Agent - Test suites                                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
""")

    print("\n🔧 Step 1: Initializing Agent Team...")

    # Create coordinator
    coordinator = AgentCoordinator()

    # Create and register ALL agents
    agents = create_all_agents()
    for agent in agents:
        coordinator.register_agent(agent)

    print(f"  ✓ Registered {len(agents)} agents")

    # Show agent breakdown
    role_agents = create_role_agents()
    domain_agents = create_domain_agents()
    print(f"    - Role-based agents (coordinators): {len(role_agents)}")
    for agent in role_agents:
        print(f"      • {agent.config.name}")
    print(f"    - Domain-specific agents (executors): {len(domain_agents)}")
    for agent in domain_agents:
        print(f"      • {agent.config.name}")

    # Start coordinator
    print("\n🚀 Step 2: Starting Agent Team...")
    await coordinator.start()

    # Show initial status
    print("\n📊 Step 3: Agent Team Status:")
    coordinator.print_status()

    # Create demo tasks simulating a real optimization cycle
    print("\n" + "="*70)
    print("📋 Step 4: Creating Optimization Tasks (Simulating Analysis)...")
    print("="*70 + "\n")

    # Phase 1: Analysis (Leader)
    print("[Phase 1: Analysis]")
    leader_task = coordinator.create_task(
        title="Analyze Project Quality",
        description="Team Leader analyzes project metrics and identifies issues",
        agent_type="leader",
        priority=TaskPriority.HIGH,
        input_data={"action": "analyze_and_plan"},
    )
    leader_task_id = coordinator.submit_task(leader_task)
    print(f"  ✓ Created: {leader_task.title}")

    # Phase 2: Execution (Domain agents)
    print("\n[Phase 2: Execution]")

    # Backend optimization
    backend_task = coordinator.create_task(
        title="Optimize Backend API",
        description="Optimize FastAPI endpoints for better performance",
        agent_type="backend",
        priority=TaskPriority.NORMAL,
        input_data={"action": "optimize_api"},
    )
    coordinator.submit_task(backend_task)
    print(f"  ✓ Created: {backend_task.title}")

    # Frontend optimization
    frontend_task = coordinator.create_task(
        title="Optimize Frontend Components",
        description="Optimize Vue 3 components for better rendering",
        agent_type="frontend",
        priority=TaskPriority.NORMAL,
        input_data={"action": "optimize_component"},
    )
    coordinator.submit_task(frontend_task)
    print(f"  ✓ Created: {frontend_task.title}")

    # Bug fixing
    bug_task = coordinator.create_task(
        title="Fix Critical Code Violations",
        description="Fix all critical SonarQube violations",
        agent_type="bug_hunter",
        priority=TaskPriority.CRITICAL,
        input_data={"action": "fix_critical_violations", "violations": [1, 2, 3]},
    )
    coordinator.submit_task(bug_task)
    print(f"  ✓ Created: {bug_task.title}")

    # Phase 3: Validation (QA)
    print("\n[Phase 3: Validation]")

    qa_task = coordinator.create_task(
        title="Validate All Changes",
        description="QA Specialist validates all changes and checks quality gates",
        agent_type="qa",
        priority=TaskPriority.HIGH,
        input_data={"action": "validate_changes"},
    )
    coordinator.submit_task(qa_task)
    print(f"  ✓ Created: {qa_task.title}")

    # Testing
    testing_task = coordinator.create_task(
        title="Run Full Test Suite",
        description="Run all unit and integration tests",
        agent_type="testing",
        priority=TaskPriority.HIGH,
        input_data={"action": "run_all_tests"},
    )
    coordinator.submit_task(testing_task)
    print(f"  ✓ Created: {testing_task.title}")

    # Wait a bit for tasks to process
    print("\n⏳ Processing tasks...")
    await asyncio.sleep(3)

    # Show updated status
    print("\n📊 Step 5: Updated Agent Status:")
    coordinator.print_status()

    # Check task statuses
    print("\n📋 Step 6: Task Statuses:")
    print("-" * 70)
    all_tasks = [leader_task, backend_task, frontend_task, bug_task, qa_task, testing_task]
    for task in all_tasks:
        status = coordinator.get_task_status(task.id)
        if status:
            status_symbol = "✓" if status["status"] == "completed" else "⏳"
            print(f"  {status_symbol} {status['title']}: {status['status'].upper()}")
    print("-" * 70)

    # Show summary
    print("\n📊 Step 7: Optimization Summary:")
    print(f"  Total tasks created: {len(all_tasks)}")
    print(f"  Agents active: {len([a for a in agents if a.status.value == 'busy'])}")
    print(f"  Tasks in queue: {len(coordinator.task_queue)}")
    print(f"  Tasks completed: {len(coordinator.completed_tasks)}")

    # Demo the role-based agent capabilities
    print("\n" + "="*70)
    print("🎯 Role-Based Agent Capabilities:")
    print("="*70 + "\n")

    print("[Team Leader (决策者)]")
    leader = coordinator.get_agent_by_type("leader")
    if leader:
        print(f"  • ID: {leader.config.id}")
        print(f"  • Capabilities: {', '.join(leader.config.capabilities)}")
        print(f"  • Max concurrent tasks: {leader.config.max_concurrent_tasks}")

    print("\n[QA Specialist (验收专家)]")
    qa = coordinator.get_agent_by_type("qa")
    if qa:
        print(f"  • ID: {qa.config.id}")
        print(f"  • Capabilities: {', '.join(qa.config.capabilities)}")

    print("\n[Bug Hunter (修复者)]")
    bug_hunter = coordinator.get_agent_by_type("bug_hunter")
    if bug_hunter:
        print(f"  • ID: {bug_hunter.config.id}")
        print(f"  • Capabilities: {', '.join(bug_hunter.config.capabilities)}")

    # Stop coordinator
    print("\n" + "="*70)
    await coordinator.stop()
    print("\n✅ Demo Complete!")
    print("\n💡 Next Steps:")
    print("  • Run 'python agent_team/scheduler_247.py' for 24/7 continuous optimization")
    print("  • Check agent_team/GUIDE.md for detailed documentation")
    print("  • Customize schedule in agent_team/schedule_config.json")
    print("="*70 + "\n")


if __name__ == "__main__":
    try:
        asyncio.run(demo_single_cycle())
    except KeyboardInterrupt:
        print("\n\n✋ Demo stopped by user")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
