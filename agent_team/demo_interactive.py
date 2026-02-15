"""
Interactive Demo for Agent Team System
展示 Agent Team 的交互式界面功能
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_team.coordinator import AgentCoordinator
from agent_team.orchestrator import WorkflowOrchestrator
from agent_team.agents import create_all_agents
from agent_team.core import TaskPriority


def print_banner():
    """Print the banner"""
    print("\n" + "=" * 70)
    print(" " * 15 + "MINING PRESSURE ASSESSMENT - AGENT TEAM")
    print("=" * 70)
    print()


def print_menu():
    """Print the menu"""
    print("\n" + "-" * 70)
    print(" COMMAND MENU")
    print("-" * 70)
    print("\n  [STATUS COMMANDS]")
    print("    1. status      - Show overall system status")
    print("    2. agents      - List all agents and their status")
    print("    3. tasks       - Show all tasks")
    print()
    print("  [TASK COMMANDS]")
    print("    4. quick       - Quick task menu")
    print("    5. custom      - Create custom task")
    print()
    print("  [WORKFLOW COMMANDS]")
    print("    6. workflows   - List available workflows")
    print("    7. run         - Run a workflow")
    print()
    print("  [SYSTEM]")
    print("    8. help        - Show detailed help")
    print("    0. exit        - Exit")
    print("-" * 70)


def print_quick_menu():
    """Print quick task menu"""
    print("\n" + "-" * 70)
    print(" QUICK TASKS")
    print("-" * 70)
    print("\n  Select a quick task:")
    print("    1. Backend      - Optimize backend API")
    print("    2. Frontend     - Optimize frontend bundle")
    print("    3. Data         - Fix data encoding issues")
    print("    4. Algorithm    - Optimize MPI algorithm")
    print("    5. DevOps       - Check service status")
    print("    6. Testing      - Run all tests")
    print("    0. Back")
    print("-" * 70)


class InteractiveDemo:
    """Interactive demo of the agent team"""

    def __init__(self):
        self.coordinator = AgentCoordinator()
        self.orchestrator = WorkflowOrchestrator(self.coordinator)
        self.running = False

    async def start(self):
        """Start the agent team"""
        print_banner()

        # Create and register agents
        agents = create_all_agents()
        print(f"[INIT] Registering {len(agents)} specialized agents...")
        for agent in agents:
            self.coordinator.register_agent(agent)

        # Start coordinator
        await self.coordinator.start()
        self.running = True

        print("\n[READY] Agent Team is ready!\n")

        # Show initial status
        self.coordinator.print_status()

    async def stop(self):
        """Stop the agent team"""
        await self.coordinator.stop()
        self.running = False
        print("\n[STOP] Agent Team stopped.")

    def show_status(self):
        """Show system status"""
        self.coordinator.print_status()

    def show_agents(self):
        """Show detailed agent info"""
        status = self.coordinator.get_status()

        print("\n" + "=" * 70)
        print(" REGISTERED AGENTS")
        print("=" * 70)

        for agent_id, agent_info in status["agents"].items():
            print(f"\n  [{agent_info['status'].upper()}] {agent_info['name']}")
            print(f"     ID:       {agent_id}")
            print(f"     Type:     {agent_info['type']}")
            print(f"     Tasks:    {agent_info['current_tasks']} current / {agent_info['completed_tasks']} completed")

        print("\n" + "=" * 70)

    def show_tasks(self):
        """Show all tasks"""
        status = self.coordinator.get_status()

        print("\n" + "=" * 70)
        print(f" TASK OVERVIEW (Queued: {status['queued_tasks']} | Completed: {status['completed_tasks']} | Failed: {status['failed_tasks']})")
        print("=" * 70)

        # Show recent completed tasks
        completed = list(self.coordinator.completed_tasks)
        if completed:
            print("\n  [COMPLETED TASKS]")
            for task in completed[-5:]:
                print(f"    - {task.title}")
                print(f"      ID: {task.id[:8]}... | Agent: {task.agent_type}")

        # Show queued tasks
        queued = self.coordinator.task_queue
        if queued:
            print("\n  [QUEUED TASKS]")
            for task in queued:
                print(f"    - {task.title}")
                print(f"      ID: {task.id[:8]}... | Priority: {task.priority.name}")

        if not completed and not queued:
            print("\n  No tasks in history or queue.")

        print("\n" + "=" * 70)

    def submit_quick_task(self, agent_type):
        """Submit a quick task"""
        quick_tasks = {
            "1": ("Backend", "Optimize Backend API", "backend", "optimize_api"),
            "2": ("Frontend", "Optimize Frontend Bundle", "frontend", "optimize_bundle"),
            "3": ("Data", "Fix Data Encoding Issues", "data", "fix_csv_encoding"),
            "4": ("Algorithm", "Optimize MPI Algorithm", "algorithm", "optimize_mpi"),
            "5": ("DevOps", "Check Service Status", "devops", "check_status"),
            "6": ("Testing", "Run All Tests", "testing", "run_all_tests"),
        }

        if agent_type not in quick_tasks:
            print("Invalid selection")
            return

        name, title, agent_type, action = quick_tasks[agent_type]

        task = self.coordinator.create_task(
            title=title,
            description=f"Quick {name.lower()} task",
            agent_type=agent_type,
            priority=TaskPriority.NORMAL,
            input_data={"action": action},
        )

        task_id = self.coordinator.submit_task(task)

        print(f"\n[SUBMITTED] Task: {title}")
        print(f"           Agent: {name}")
        print(f"           ID:    {task_id}")

        # Just queue it, don't execute in this demo
        print(f"\n[QUEUED] Task added to queue")

    async def execute_and_show(self, task_id):
        """Execute a task and show results"""
        try:
            # Get task from queue
            task = None
            for t in self.coordinator.task_queue:
                if t.id == task_id:
                    task = t
                    break

            if task:
                self.coordinator.task_queue.remove(task)

            # Execute
            result = await self.coordinator.execute_task(task)

            print(f"\n[COMPLETED] Task finished successfully!")
            print(f"           Result: {result}")

        except Exception as e:
            print(f"\n[ERROR] Task failed: {str(e)}")

    def list_workflows(self):
        """List available workflows"""
        workflows = self.orchestrator.list_templates()

        print("\n" + "=" * 70)
        print(" AVAILABLE WORKFLOWS")
        print("=" * 70)

        descriptions = {
            "optimize_mpi_performance": "Optimize MPI calculation performance",
            "add_new_feature": "Complete feature development workflow",
            "fix_encoding_issues": "Fix all data encoding issues",
            "deploy_application": "Deploy application to production",
        }

        for wf in workflows:
            desc = descriptions.get(wf, "No description")
            print(f"\n  - {wf}")
            print(f"    {desc}")

        print("\n" + "=" * 70)

    def run_workflow(self, workflow_name=None):
        """Run a workflow"""
        if not workflow_name:
            workflows = self.orchestrator.list_templates()
            print("\nSelect workflow:")
            for i, wf in enumerate(workflows, 1):
                print(f"  {i}. {wf}")

            try:
                choice = input("\nEnter choice: ").strip()
                workflow_name = workflows[int(choice) - 1]
            except (ValueError, IndexError):
                print("Invalid choice")
                return

        workflow = self.orchestrator.create_workflow_from_template(workflow_name)

        if not workflow:
            print(f"Unknown workflow: {workflow_name}")
            return

        print(f"\n[WORKFLOW] Starting: {workflow.name}")
        print(f"           Description: {workflow.description}")
        print(f"           Steps: {len(workflow.steps)}")

        print("\n  Steps:")
        for i, step in enumerate(workflow.steps, 1):
            print(f"    {i}. [{step.agent_type}] {step.title}")

        print("\n[EXECUTING] Running workflow...")
        # Note: Actual execution would happen here
        print("\n[DONE] Workflow execution complete (demo mode)")

    def run(self):
        """Run the interactive demo"""

        async def main_loop():
            await self.start()

            while self.running:
                print_menu()
                choice = input("\nSelect command (0-8, or 'help' for details): ").strip().lower()

                if choice in ["0", "exit", "quit"]:
                    break
                elif choice == "1" or choice == "status":
                    self.show_status()
                elif choice == "2" or choice == "agents":
                    self.show_agents()
                elif choice == "3" or choice == "tasks":
                    self.show_tasks()
                elif choice == "4" or choice == "quick":
                    print_quick_menu()
                    quick_choice = input("\nSelect quick task (0-6): ").strip()
                    if quick_choice != "0":
                        self.submit_quick_task(quick_choice)
                elif choice == "5" or choice == "custom":
                    print("\n[CUSTOM TASK] Enter task details:")
                    agent_type = input("  Agent type (backend/frontend/data/algorithm/devops/testing): ").strip()
                    if agent_type:
                        title = input("  Task title: ").strip()
                        action = input("  Action: ").strip()
                        if title and action:
                            task = self.coordinator.create_task(
                                title=title,
                                description=title,
                                agent_type=agent_type,
                                input_data={"action": action},
                            )
                            task_id = self.coordinator.submit_task(task)
                            print(f"\n[SUBMITTED] Task ID: {task_id}")
                elif choice == "6" or choice == "workflows":
                    self.list_workflows()
                elif choice == "7" or choice == "run":
                    self.run_workflow()
                elif choice == "8" or choice == "help":
                    self.show_help()
                else:
                    print(f"\nUnknown command: {choice}")

            await self.stop()

        asyncio.run(main_loop())

    def show_help(self):
        """Show detailed help"""
        print("\n" + "=" * 70)
        print(" AGENT TEAM - DETAILED HELP")
        print("=" * 70)

        print("\n[AGENTS]")
        print("  Each agent is specialized for a specific domain:")
        print("  - Backend Agent:   FastAPI routes, services, performance")
        print("  - Frontend Agent:  Vue 3 components, UI/UX, optimization")
        print("  - Data Agent:      Borehole parsing, encoding, interpolation")
        print("  - Algorithm Agent: MPI calculations, geological modeling")
        print("  - DevOps Agent:    Deployment, environment, monitoring")
        print("  - Testing Agent:   Unit tests, integration tests, benchmarks")

        print("\n[TASKS]")
        print("  Tasks are assigned to agents based on their specialization.")
        print("  Each task has a priority, status, and can depend on other tasks.")

        print("\n[WORKFLOWS]")
        print("  Workflows are multi-step processes that may involve multiple agents.")
        print("  They handle complex operations like feature development or deployment.")

        print("\n[STATUS]")
        print("  - idle:    Agent is available for new tasks")
        print("  - busy:    Agent is currently processing tasks")
        print("  - error:   Agent encountered an error")
        print("  - offline: Agent is not available")

        print("\n" + "=" * 70)


def main():
    """Main entry point"""
    demo = InteractiveDemo()

    try:
        demo.run()
    except KeyboardInterrupt:
        print("\n\n[INTERRUPT] Shutting down...")
        asyncio.run(demo.stop())
    except Exception as e:
        print(f"\n[ERROR] {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
