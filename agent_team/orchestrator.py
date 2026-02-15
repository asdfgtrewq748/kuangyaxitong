"""
Workflow Orchestrator - Manages complex multi-step workflows

This module provides high-level workflow orchestration that coordinates
multiple agents to complete complex tasks.
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum

from .core import Task, TaskPriority
from .coordinator import AgentCoordinator


class WorkflowStatus(Enum):
    """Status of a workflow"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class WorkflowStep:
    """A single step in a workflow"""
    id: str
    title: str
    agent_type: str
    action: str
    input_data: Dict[str, Any]
    depends_on: List[str] = None  # Step IDs this step depends on
    status: WorkflowStatus = WorkflowStatus.PENDING


@dataclass
class Workflow:
    """A multi-step workflow that may involve multiple agents"""
    id: str
    name: str
    description: str
    steps: List[WorkflowStep]
    status: WorkflowStatus = WorkflowStatus.PENDING
    current_step: int = 0
    results: Dict[str, Any] = None

    def __post_init__(self):
        if self.results is None:
            self.results = {}


class WorkflowOrchestrator:
    """
    Orchestrates complex workflows across multiple agents.

    Example workflows:
    - Full feature development (frontend + backend + testing)
    - Performance optimization (algorithm + data + testing)
    - Deployment pipeline (devops + testing + monitoring)
    """

    def __init__(self, coordinator: AgentCoordinator):
        self.coordinator = coordinator
        self.workflows: Dict[str, Workflow] = {}
        self.workflow_templates = self._init_templates()

    def _init_templates(self) -> Dict[str, List[WorkflowStep]]:
        """Initialize predefined workflow templates"""
        return {
            "optimize_mpi_performance": [
                WorkflowStep(
                    id="analyze_current",
                    title="Analyze current MPI performance",
                    agent_type="algorithm",
                    action="optimize_mpi",
                    input_data={"analysis_only": True},
                ),
                WorkflowStep(
                    id="optimize_algorithm",
                    title="Optimize MPI calculation algorithm",
                    agent_type="algorithm",
                    action="optimize_mpi",
                    input_data={},
                    depends_on=["analyze_current"],
                ),
                WorkflowStep(
                    id="optimize_data_loading",
                    title="Optimize data loading and parsing",
                    agent_type="data",
                    action="parse_borehole",
                    input_data={"optimize": True},
                    depends_on=["analyze_current"],
                ),
                WorkflowStep(
                    id="optimize_backend_api",
                    title="Optimize backend API endpoints",
                    agent_type="backend",
                    action="optimize_api",
                    input_data={"focus": "performance"},
                    depends_on=["optimize_algorithm"],
                ),
                WorkflowStep(
                    id="run_performance_tests",
                    title="Run performance benchmark tests",
                    agent_type="testing",
                    action="performance_test",
                    input_data={},
                    depends_on=["optimize_algorithm", "optimize_data_loading", "optimize_backend_api"],
                ),
            ],
            "add_new_feature": [
                WorkflowStep(
                    id="design_backend",
                    title="Design and implement backend API",
                    agent_type="backend",
                    action="add_endpoint",
                    input_data={},
                ),
                WorkflowStep(
                    id="implement_frontend",
                    title="Implement frontend UI components",
                    agent_type="frontend",
                    action="add_page",
                    input_data={},
                    depends_on=["design_backend"],
                ),
                WorkflowStep(
                    id="write_tests",
                    title="Write unit and integration tests",
                    agent_type="testing",
                    action="write_integration_test",
                    input_data={},
                    depends_on=["design_backend", "implement_frontend"],
                ),
                WorkflowStep(
                    id="run_tests",
                    title="Run all tests and verify",
                    agent_type="testing",
                    action="run_all_tests",
                    input_data={},
                    depends_on=["write_tests"],
                ),
            ],
            "fix_encoding_issues": [
                WorkflowStep(
                    id="scan_data",
                    title="Scan data files for encoding issues",
                    agent_type="data",
                    action="validate_data",
                    input_data={"check_encoding": True},
                ),
                WorkflowStep(
                    id="fix_encoding",
                    title="Fix encoding issues in affected files",
                    agent_type="data",
                    action="fix_csv_encoding",
                    input_data={},
                    depends_on=["scan_data"],
                ),
                WorkflowStep(
                    id="verify_fixes",
                    title="Verify all files are properly encoded",
                    agent_type="data",
                    action="validate_data",
                    input_data={},
                    depends_on=["fix_encoding"],
                ),
            ],
            "deploy_application": [
                WorkflowStep(
                    id="run_tests",
                    title="Run all tests before deployment",
                    agent_type="testing",
                    action="run_all_tests",
                    input_data={},
                ),
                WorkflowStep(
                    id="build_frontend",
                    title="Build frontend for production",
                    agent_type="frontend",
                    action="optimize_bundle",
                    input_data={"mode": "production"},
                    depends_on=["run_tests"],
                ),
                WorkflowStep(
                    id="configure_env",
                    title="Configure production environment",
                    agent_type="devops",
                    action="configure_environment",
                    input_data={"environment": "production"},
                    depends_on=["run_tests"],
                ),
                WorkflowStep(
                    id="deploy_services",
                    title="Deploy services",
                    agent_type="devops",
                    action="deploy",
                    input_data={},
                    depends_on=["build_frontend", "configure_env"],
                ),
                WorkflowStep(
                    id="setup_monitoring",
                    title="Setup monitoring and health checks",
                    agent_type="devops",
                    action="setup_monitoring",
                    input_data={},
                    depends_on=["deploy_services"],
                ),
            ],
        }

    def create_workflow(
        self,
        name: str,
        description: str,
        steps: List[WorkflowStep],
        workflow_id: str = None,
    ) -> Workflow:
        """Create a new workflow"""
        import uuid
        if workflow_id is None:
            workflow_id = str(uuid.uuid4())

        workflow = Workflow(
            id=workflow_id,
            name=name,
            description=description,
            steps=steps,
        )
        self.workflows[workflow_id] = workflow
        return workflow

    def create_workflow_from_template(self, template_name: str) -> Optional[Workflow]:
        """Create a workflow from a predefined template"""
        if template_name not in self.workflow_templates:
            return None

        import uuid
        template_steps = self.workflow_templates[template_name]

        # Create deep copy of steps with unique IDs
        steps = []
        for step in template_steps:
            steps.append(WorkflowStep(
                id=f"{uuid.uuid4()}",
                title=step.title,
                agent_type=step.agent_type,
                action=step.action,
                input_data=step.input_data.copy(),
                depends_on=step.depends_on.copy() if step.depends_on else [],
            ))

        return self.create_workflow(
            name=template_name.replace("_", " ").title(),
            description=f"Workflow from template: {template_name}",
            steps=steps,
        )

    async def execute_workflow(self, workflow_id: str) -> Dict[str, Any]:
        """Execute a workflow"""
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            raise ValueError(f"Workflow not found: {workflow_id}")

        workflow.status = WorkflowStatus.IN_PROGRESS

        try:
            # Create tasks from workflow steps
            task_map = {}

            for step in workflow.steps:
                task = self.coordinator.create_task(
                    title=step.title,
                    description=f"Step in workflow: {workflow.name}",
                    agent_type=step.agent_type,
                    input_data=step.input_data,
                )

                # Set up dependencies
                if step.depends_on:
                    task.dependencies = [
                        task_map[dep_id]
                        for dep_id in step.depends_on
                        if dep_id in task_map
                    ]

                task_map[step.id] = self.coordinator.submit_task(task)

            # Wait for all tasks to complete
            import asyncio
            while True:
                all_done = True
                for task_id in task_map.values():
                    status = self.coordinator.get_task_status(task_id)
                    if not status or status["status"] in ["pending", "in_progress"]:
                        all_done = False
                        break

                if all_done:
                    break

                await asyncio.sleep(1)

            # Collect results
            results = {}
            for step_id, task_id in task_map.items():
                status = self.coordinator.get_task_status(task_id)
                results[step_id] = status

            workflow.results = results
            workflow.status = WorkflowStatus.COMPLETED
            return results

        except Exception as e:
            workflow.status = WorkflowStatus.FAILED
            raise

    def get_workflow_status(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        """Get status of a workflow"""
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            return None

        return {
            "id": workflow.id,
            "name": workflow.name,
            "description": workflow.description,
            "status": workflow.status.value,
            "current_step": workflow.current_step,
            "total_steps": len(workflow.steps),
            "steps": [
                {
                    "id": step.id,
                    "title": step.title,
                    "agent_type": step.agent_type,
                    "status": step.status.value,
                }
                for step in workflow.steps
            ],
        }

    def list_templates(self) -> List[str]:
        """List available workflow templates"""
        return list(self.workflow_templates.keys())

    def print_workflow_status(self, workflow_id: str) -> None:
        """Print workflow status"""
        status = self.get_workflow_status(workflow_id)
        if not status:
            print(f"Workflow not found: {workflow_id}")
            return

        print(f"\nWorkflow: {status['name']}")
        print(f"Status: {status['status']}")
        print(f"Progress: {status['current_step']}/{status['total_steps']}")
        print("\nSteps:")
        for step in status["steps"]:
            print(f"  [{step['status']}] {step['title']} ({step['agent_type']})")
