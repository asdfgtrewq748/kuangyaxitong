"""
Agent Team Interface - User-facing API for interacting with the agent team

This module provides a simple command-line interface for interacting
with the agent team system.
"""

import asyncio
import sys
from pathlib import Path
from typing import Optional

from .coordinator import AgentCoordinator
from .orchestrator import WorkflowOrchestrator
from .agents import create_all_agents
from .core import TaskPriority


class AgentTeamInterface:
    """
    User interface for the agent team system.

    Provides commands for:
    - Starting/stopping the agent team
    - Submitting tasks
    - Checking status
    - Running workflows
    """

    def __init__(self, workspace_path: str = None):
        self.workspace_path = Path(workspace_path) if workspace_path else Path.cwd()
        self.coordinator = AgentCoordinator(str(self.workspace_path))
        self.orchestrator = WorkflowOrchestrator(self.coordinator)
        self.running = False

    def start(self) -> None:
        """Start the agent team"""
        print("\n" + "=" * 60)
        print(" MINING PRESSURE ASSESSMENT - AGENT TEAM")
        print("=" * 60)

        # Create and register all agents
        agents = create_all_agents()
        for agent in agents:
            self.coordinator.register_agent(agent)

        print(f"\nRegistered {len(agents)} specialized agents:")
        for agent in agents:
            print(f"  - {agent.config.name}: {', '.join(agent.config.capabilities[:3])}...")

        # Start the coordinator
        asyncio.run(self.coordinator.start())
        self.running = True

        print("\nAgent Team is ready! Type 'help' for commands.\n")

    def stop(self) -> None:
        """Stop the agent team"""
        asyncio.run(self.coordinator.stop())
        self.running = False
        print("\nAgent Team stopped.")

    def submit_task(
        self,
        title: str,
        description: str,
        agent_type: str,
        action: str,
        input_data: dict = None,
        priority: TaskPriority = TaskPriority.NORMAL,
    ) -> str:
        """Submit a task to the agent team"""
        task = self.coordinator.create_task(
            title=title,
            description=description,
            agent_type=agent_type,
            priority=priority,
            input_data={"action": action, **(input_data or {})},
        )
        return self.coordinator.submit_task(task)

    def run_workflow(self, template_name: str) -> dict:
        """Run a predefined workflow"""
        workflow = self.orchestrator.create_workflow_from_template(template_name)
        if not workflow:
            print(f"Unknown workflow template: {template_name}")
            print(f"Available templates: {', '.join(self.orchestrator.list_templates())}")
            return {}

        print(f"\nStarting workflow: {workflow.name}")
        print(f"Description: {workflow.description}")
        print(f"Steps: {len(workflow.steps)}\n")

        result = asyncio.run(self.orchestrator.execute_workflow(workflow.id))
        return result

    def status(self) -> dict:
        """Get overall system status"""
        return self.coordinator.get_status()

    def print_status(self) -> None:
        """Print formatted status"""
        self.coordinator.print_status()

    def task_status(self, task_id: str) -> Optional[dict]:
        """Get status of a specific task"""
        return self.coordinator.get_task_status(task_id)

    def workflow_status(self, workflow_id: str) -> Optional[dict]:
        """Get status of a workflow"""
        return self.orchestrator.get_workflow_status(workflow_id)

    def list_workflows(self) -> list:
        """List available workflow templates"""
        return self.orchestrator.list_templates()

    def print_workflows(self) -> None:
        """Print available workflows"""
        workflows = self.list_workflows()
        print("\nAvailable Workflow Templates:")
        print("-" * 40)
        for wf in workflows:
            print(f"  - {wf}")
        print()

    def print_help(self) -> None:
        """Print help information"""
        print("\n" + "=" * 60)
        print(" AGENT TEAM COMMANDS")
        print("=" * 60)

        print("\nStatus Commands:")
        print("  status          - Show overall system status")
        print("  agents          - List all agents and their status")
        print("  task <id>       - Show status of a specific task")

        print("\nTask Commands:")
        print("  submit          - Submit a new task (interactive)")
        print("  quick <type>    - Quick task: backend, frontend, data, algorithm, devops, testing")

        print("\nWorkflow Commands:")
        print("  workflows       - List available workflow templates")
        print("  run <workflow>  - Run a predefined workflow")

        print("\nSystem Commands:")
        print("  help            - Show this help message")
        print("  quit/exit       - Exit the agent team")

        print("\nQuick Tasks Examples:")
        print("  quick backend    - Optimize backend API")
        print("  quick frontend   - Optimize frontend bundle")
        print("  quick data       - Fix data encoding issues")
        print("  quick algorithm  - Optimize MPI algorithm")
        print("  quick devops     - Check service status")
        print("  quick testing    - Run all tests")

        print("\nWorkflow Examples:")
        print("  run optimize_mpi_performance    - Full MPI optimization workflow")
        print("  run add_new_feature             - Complete feature development")
        print("  run fix_encoding_issues         - Fix all data encoding")
        print("  run deploy_application         - Deploy to production")

        print("\n" + "=" * 60 + "\n")

    def run_interactive(self) -> None:
        """Run the interactive command loop"""
        import cmd
        import shlex

        class AgentTeamCmd(cmd.Cmd):
            """Simple command processor for agent team"""

            def __init__(self, interface: AgentTeamInterface):
                super().__init__()
                self.interface = interface
                self.prompt = "(agent-team) "

            def do_status(self, args: str) -> None:
                """Show system status"""
                self.interface.print_status()

            def do_agents(self, args: str) -> None:
                """List all agents"""
                status = self.interface.status()
                print("\nRegistered Agents:")
                print("-" * 40)
                for agent_id, agent_info in status["agents"].items():
                    print(f"  {agent_info['name']} ({agent_info['type']})")
                    print(f"    Status: {agent_info['status']}")
                    print(f"    Current tasks: {agent_info['current_tasks']}")
                    print()

            def do_workflows(self, args: str) -> None:
                """List available workflows"""
                self.interface.print_workflows()

            def do_run(self, args: str) -> None:
                """Run a workflow"""
                if not args:
                    print("Usage: run <workflow_name>")
                    return
                self.interface.run_workflow(args.strip())

            def do_submit(self, args: str) -> None:
                """Submit a new task (interactive)"""
                print("\n-- Submit New Task --")

                agent_type = input("Agent type (backend/frontend/data/algorithm/devops/testing): ").strip()
                if agent_type not in ["backend", "frontend", "data", "algorithm", "devops", "testing"]:
                    print("Invalid agent type")
                    return

                title = input("Task title: ").strip()
                description = input("Description (optional): ").strip() or title
                action = input("Action: ").strip()

                input_data = {}
                add_data = input("Add input data? (y/n): ").strip().lower()
                if add_data == "y":
                    key = input("Key (blank to finish): ").strip()
                    while key:
                        value = input(f"Value for {key}: ").strip()
                        input_data[key] = value
                        key = input("Key (blank to finish): ").strip()

                task_id = self.interface.submit_task(
                    title=title,
                    description=description,
                    agent_type=agent_type,
                    action=action,
                    input_data=input_data,
                )

                print(f"\nTask submitted! ID: {task_id}")

            def do_quick(self, args: str) -> None:
                """Quick task commands"""
                if not args:
                    print("Usage: quick <agent_type>")
                    print("  backend, frontend, data, algorithm, devops, testing")
                    return

                agent_type = args.strip()

                # Predefined quick tasks for each agent type
                quick_tasks = {
                    "backend": ("Optimize Backend API", "optimize_api", {"file_path": "app/routes/"}),
                    "frontend": ("Optimize Frontend Bundle", "optimize_bundle", {}),
                    "data": ("Fix Data Encoding", "fix_csv_encoding", {"scan_all": True}),
                    "algorithm": ("Optimize MPI Algorithm", "optimize_mpi", {}),
                    "devops": ("Check Service Status", "check_status", {}),
                    "testing": ("Run All Tests", "run_all_tests", {}),
                }

                if agent_type not in quick_tasks:
                    print(f"Unknown agent type: {agent_type}")
                    return

                title, action, input_data = quick_tasks[agent_type]
                task_id = self.interface.submit_task(
                    title=title,
                    description=f"Quick {agent_type} task",
                    agent_type=agent_type,
                    action=action,
                    input_data=input_data,
                )

                print(f"Quick task submitted! ID: {task_id}")

            def do_task(self, args: str) -> None:
                """Show task status"""
                if not args:
                    print("Usage: task <task_id>")
                    return

                status = self.interface.task_status(args.strip())
                if status:
                    print(f"\nTask: {status['title']}")
                    print(f"Status: {status['status']}")
                    print(f"Agent: {status['agent_type']}")
                    print(f"Progress: {status['progress'] * 100:.0f}%")
                else:
                    print("Task not found")

            def do_help(self, args: str) -> None:
                """Show help"""
                self.interface.print_help()

            def do_quit(self, args: str) -> None:
                """Exit"""
                print("\nGoodbye!")
                return True

            def do_exit(self, args: str) -> None:
                """Exit"""
                return self.do_quit(args)

        # Run the command loop
        AgentTeamCmd(self.interface).cmdloop()


def main():
    """Main entry point"""
    import argparse

    parser = argparse.ArgumentParser(description="Mining Pressure Assessment - Agent Team")
    parser.add_argument("--workspace", "-w", help="Workspace path", default=None)
    parser.add_argument("--non-interactive", "-n", action="store_true", help="Run in non-interactive mode")
    parser.add_argument("--run-workflow", help="Run a specific workflow and exit")

    args = parser.parse_args()

    interface = AgentTeamInterface(args.workspace)
    interface.start()

    if args.run_workflow:
        interface.run_workflow(args.run_workflow)
        interface.stop()
    elif args.non_interactive:
        print("Non-interactive mode. Use API or run workflows with --run-workflow")
        import time
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            interface.stop()
    else:
        try:
            interface.run_interactive()
        except KeyboardInterrupt:
            print("\nInterrupted by user")
        finally:
            interface.stop()


if __name__ == "__main__":
    main()
