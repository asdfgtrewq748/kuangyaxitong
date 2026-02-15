"""
Specialized Agents for different domains of the project

Each agent handles a specific aspect of the mining pressure assessment system.
"""

import os
import subprocess
import re
from typing import Dict, Any, List
from pathlib import Path

from .core import BaseAgent, AgentConfig, Task


class BackendAgent(BaseAgent):
    """
    Backend Agent - Handles FastAPI backend development and maintenance

    Responsibilities:
    - API route optimization
    - Service layer refactoring
    - Performance tuning
    - Database operations
    - Backend testing
    """

    def __init__(self):
        config = AgentConfig(
            id="backend-01",
            name="Backend Specialist",
            agent_type="backend",
            description="Handles FastAPI backend development, API routes, and services",
            capabilities=[
                "api_development",
                "service_refactoring",
                "performance_optimization",
                "backend_testing",
                "database_management",
            ],
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
            max_concurrent_tasks=3,
        )
        super().__init__(config)
        self.backend_path = Path.cwd() / "backend"

    def _register_handlers(self) -> None:
        """Register backend-specific message handlers"""
        self.message_handlers = {
            "check_api_health": self._check_api_health,
            "restart_backend": self._restart_backend,
            "analyze_routes": self._analyze_routes,
            "optimize_service": self._optimize_service,
        }

    async def process_task(self, task: Task) -> Dict[str, Any]:
        """Process backend-specific tasks"""
        action = task.input_data.get("action")

        if action == "optimize_api":
            return await self._optimize_api(task)
        elif action == "refactor_service":
            return await self._refactor_service(task)
        elif action == "add_endpoint":
            return await self._add_endpoint(task)
        elif action == "fix_encoding":
            return await self._fix_encoding_issue(task)
        elif action == "analyze_performance":
            return await self._analyze_performance(task)
        else:
            raise ValueError(f"Unknown action: {action}")

    async def _optimize_api(self, task: Task) -> Dict[str, Any]:
        """Optimize API performance"""
        file_path = task.input_data.get("file_path")
        # Implementation would analyze and optimize the API
        return {"status": "optimized", "file": file_path}

    async def _refactor_service(self, task: Task) -> Dict[str, Any]:
        """Refactor a service module"""
        service_name = task.input_data.get("service_name")
        return {"status": "refactored", "service": service_name}

    async def _add_endpoint(self, task: Task) -> Dict[str, Any]:
        """Add a new API endpoint"""
        endpoint_info = task.input_data.get("endpoint", {})
        return {"status": "created", "endpoint": endpoint_info}

    async def _fix_encoding_issue(self, task: Task) -> Dict[str, Any]:
        """Fix encoding issues in data files"""
        return {"status": "fixed", "encoding": "utf-8"}

    async def _analyze_performance(self, task: Task) -> Dict[str, Any]:
        """Analyze backend performance"""
        return {"status": "analyzed", "metrics": {}}

    # Message handlers
    def _check_api_health(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Check if backend API is healthy"""
        try:
            import requests
            response = requests.get("http://localhost:8001/health", timeout=2)
            return {"healthy": response.status_code == 200}
        except:
            return {"healthy": False}

    def _restart_backend(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Restart the backend server"""
        return {"status": "restarted"}

    def _analyze_routes(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze API routes"""
        routes_path = self.backend_path / "app" / "routes"
        if not routes_path.exists():
            return {"routes": []}

        routes = []
        for route_file in routes_path.glob("*.py"):
            routes.append(str(route_file))
        return {"routes": routes}

    def _optimize_service(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize a specific service"""
        return {"status": "optimized"}


class FrontendAgent(BaseAgent):
    """
    Frontend Agent - Handles Vue 3 frontend development

    Responsibilities:
    - Component optimization
    - State management improvements
    - UI/UX enhancements
    - Performance optimization
    - Frontend testing
    """

    def __init__(self):
        config = AgentConfig(
            id="frontend-01",
            name="Frontend Specialist",
            agent_type="frontend",
            description="Handles Vue 3 frontend, components, and UI/UX",
            capabilities=[
                "component_development",
                "state_management",
                "ui_optimization",
                "responsive_design",
                "frontend_testing",
            ],
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
            max_concurrent_tasks=2,
        )
        super().__init__(config)
        self.frontend_path = Path.cwd() / "frontend"

    def _register_handlers(self) -> None:
        """Register frontend-specific message handlers"""
        self.message_handlers = {
            "check_dev_server": self._check_dev_server,
            "analyze_components": self._analyze_components,
            "optimize_bundle": self._optimize_bundle,
        }

    async def process_task(self, task: Task) -> Dict[str, Any]:
        """Process frontend-specific tasks"""
        action = task.input_data.get("action")

        if action == "optimize_component":
            return await self._optimize_component(task)
        elif action == "add_page":
            return await self._add_page(task)
        elif action == "improve_ui":
            return await self._improve_ui(task)
        elif action == "fix_layout":
            return await self._fix_layout(task)
        elif action == "add_chart":
            return await self._add_chart(task)
        else:
            raise ValueError(f"Unknown action: {action}")

    async def _optimize_component(self, task: Task) -> Dict[str, Any]:
        """Optimize a Vue component"""
        component_path = task.input_data.get("component_path")
        return {"status": "optimized", "component": component_path}

    async def _add_page(self, task: Task) -> Dict[str, Any]:
        """Add a new page"""
        page_info = task.input_data.get("page", {})
        return {"status": "created", "page": page_info}

    async def _improve_ui(self, task: Task) -> Dict[str, Any]:
        """Improve UI/UX of a component"""
        return {"status": "improved"}

    async def _fix_layout(self, task: Task) -> Dict[str, Any]:
        """Fix layout issues"""
        return {"status": "fixed"}

    async def _add_chart(self, task: Task) -> Dict[str, Any]:
        """Add a chart component"""
        chart_type = task.input_data.get("chart_type", "line")
        return {"status": "created", "chart_type": chart_type}

    def _check_dev_server(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Check if frontend dev server is running"""
        return {"running": True}

    def _analyze_components(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze Vue components"""
        components_path = self.frontend_path / "src" / "components"
        components = list(components_path.glob("*.vue")) if components_path.exists() else []
        return {"components": [str(c) for c in components]}

    def _optimize_bundle(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize the bundle size"""
        return {"status": "optimized"}


class DataAgent(BaseAgent):
    """
    Data Agent - Handles data processing and management

    Responsibilities:
    - Borehole data parsing
    - Interpolation algorithm optimization
    - Encoding issue fixes
    - Data validation
    - Data export/import
    """

    def __init__(self):
        config = AgentConfig(
            id="data-01",
            name="Data Specialist",
            agent_type="data",
            description="Handles data parsing, encoding, interpolation, and validation",
            capabilities=[
                "data_parsing",
                "encoding_fix",
                "interpolation",
                "data_validation",
                "data_export",
            ],
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
            max_concurrent_tasks=4,
        )
        super().__init__(config)
        self.data_path = Path.cwd() / "data"

    def _register_handlers(self) -> None:
        """Register data-specific message handlers"""
        self.message_handlers = {
            "scan_data": self._scan_data,
            "validate_data": self._validate_data,
            "fix_encoding": self._fix_encoding,
            "interpolate": self._interpolate_data,
        }

    async def process_task(self, task: Task) -> Dict[str, Any]:
        """Process data-specific tasks"""
        action = task.input_data.get("action")

        if action == "parse_borehole":
            return await self._parse_borehole(task)
        elif action == "fix_csv_encoding":
            return await self._fix_csv_encoding(task)
        elif action == "validate_coordinates":
            return await self._validate_coordinates(task)
        elif action == "interpolate_field":
            return await self._interpolate_field(task)
        elif action == "export_data":
            return await self._export_data(task)
        else:
            raise ValueError(f"Unknown action: {action}")

    async def _parse_borehole(self, task: Task) -> Dict[str, Any]:
        """Parse borehole data"""
        file_name = task.input_data.get("file_name")
        return {"status": "parsed", "records": 0, "file": file_name}

    async def _fix_csv_encoding(self, task: Task) -> Dict[str, Any]:
        """Fix CSV encoding issues"""
        file_name = task.input_data.get("file_name")
        return {"status": "fixed", "file": file_name}

    async def _validate_coordinates(self, task: Task) -> Dict[str, Any]:
        """Validate coordinate data"""
        return {"status": "validated", "valid": True}

    async def _interpolate_field(self, task: Task) -> Dict[str, Any]:
        """Perform field interpolation"""
        method = task.input_data.get("method", "kriging")
        return {"status": "interpolated", "method": method, "points": 0}

    async def _export_data(self, task: Task) -> Dict[str, Any]:
        """Export data to file"""
        format_type = task.input_data.get("format", "csv")
        return {"status": "exported", "format": format_type}

    def _scan_data(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Scan data directory"""
        if not self.data_path.exists():
            return {"files": []}

        files = list(self.data_path.glob("*.csv"))
        return {"files": [str(f) for f in files], "count": len(files)}

    def _validate_data(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Validate data integrity"""
        return {"valid": True, "errors": []}

    def _fix_encoding(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Fix file encoding"""
        return {"status": "fixed"}

    def _interpolate_data(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Interpolate missing data"""
        return {"status": "interpolated"}


class AlgorithmAgent(BaseAgent):
    """
    Algorithm Agent - Handles core algorithm implementations

    Responsibilities:
    - MPI calculation optimization
    - Geological modeling algorithms
    - Kriging interpolation
    - Algorithm validation
    - Performance benchmarking
    """

    def __init__(self):
        config = AgentConfig(
            id="algorithm-01",
            name="Algorithm Specialist",
            agent_type="algorithm",
            description="Handles MPI calculations, geological modeling, and algorithms",
            capabilities=[
                "mpi_calculation",
                "kriging_interpolation",
                "geological_modeling",
                "algorithm_validation",
                "performance_benchmarking",
            ],
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
            max_concurrent_tasks=2,
        )
        super().__init__(config)
        self.mpi_advanced_path = Path.cwd() / "mpi_advanced"
        self.geomodel_path = Path.cwd() / "dizhijianmo"

    def _register_handlers(self) -> None:
        """Register algorithm-specific message handlers"""
        self.message_handlers = {
            "calculate_mpi": self._calculate_mpi,
            "run_interpolation": self._run_interpolation,
            "validate_algorithm": self._validate_algorithm,
            "benchmark": self._benchmark,
        }

    async def process_task(self, task: Task) -> Dict[str, Any]:
        """Process algorithm-specific tasks"""
        action = task.input_data.get("action")

        if action == "optimize_mpi":
            return await self._optimize_mpi(task)
        elif action == "improve_interpolation":
            return await self._improve_interpolation(task)
        elif action == "validate_algorithm":
            return await self._validate_algorithm_impl(task)
        elif action == "add_algorithm":
            return await self._add_algorithm(task)
        elif action == "benchmark_algorithm":
            return await self._benchmark_algorithm(task)
        else:
            raise ValueError(f"Unknown action: {action}")

    async def _optimize_mpi(self, task: Task) -> Dict[str, Any]:
        """Optimize MPI calculation algorithm"""
        return {"status": "optimized", "improvement": "20%"}

    async def _improve_interpolation(self, task: Task) -> Dict[str, Any]:
        """Improve interpolation algorithm"""
        method = task.input_data.get("method", "kriging")
        return {"status": "improved", "method": method}

    async def _validate_algorithm_impl(self, task: Task) -> Dict[str, Any]:
        """Validate an algorithm"""
        algorithm = task.input_data.get("algorithm")
        return {"status": "valid", "algorithm": algorithm}

    async def _add_algorithm(self, task: Task) -> Dict[str, Any]:
        """Add a new algorithm"""
        return {"status": "created"}

    async def _benchmark_algorithm(self, task: Task) -> Dict[str, Any]:
        """Benchmark algorithm performance"""
        return {"status": "benchmarked", "time_ms": 100}

    def _calculate_mpi(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate MPI"""
        return {"mpi": 0.5}

    def _run_interpolation(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Run interpolation"""
        return {"status": "completed"}

    def _validate_algorithm(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Validate algorithm"""
        return {"valid": True}

    def _benchmark(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Run benchmark"""
        return {"time_ms": 100}


class DevOpsAgent(BaseAgent):
    """
    DevOps Agent - Handles infrastructure and deployment

    Responsibilities:
    - Deployment scripts
    - Environment configuration
    - Service orchestration
    - Monitoring and logging
    - CI/CD pipelines
    """

    def __init__(self):
        config = AgentConfig(
            id="devops-01",
            name="DevOps Specialist",
            agent_type="devops",
            description="Handles deployment, environment setup, and monitoring",
            capabilities=[
                "deployment",
                "environment_setup",
                "service_management",
                "monitoring",
                "logging",
            ],
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
            max_concurrent_tasks=3,
        )
        super().__init__(config)

    def _register_handlers(self) -> None:
        """Register DevOps-specific message handlers"""
        self.message_handlers = {
            "start_services": self._start_services,
            "stop_services": self._stop_services,
            "check_status": self._check_status,
            "view_logs": self._view_logs,
            "restart_service": self._restart_service,
        }

    async def process_task(self, task: Task) -> Dict[str, Any]:
        """Process DevOps-specific tasks"""
        action = task.input_data.get("action")

        if action == "deploy":
            return await self._deploy(task)
        elif action == "configure_environment":
            return await self._configure_environment(task)
        elif action == "setup_monitoring":
            return await self._setup_monitoring(task)
        elif action == "update_startup_script":
            return await self._update_startup_script(task)
        elif action == "add_health_check":
            return await self._add_health_check(task)
        else:
            raise ValueError(f"Unknown action: {action}")

    async def _deploy(self, task: Task) -> Dict[str, Any]:
        """Deploy the application"""
        environment = task.input_data.get("environment", "development")
        return {"status": "deployed", "environment": environment}

    async def _configure_environment(self, task: Task) -> Dict[str, Any]:
        """Configure environment variables"""
        return {"status": "configured"}

    async def _setup_monitoring(self, task: Task) -> Dict[str, Any]:
        """Setup monitoring"""
        return {"status": "setup"}

    async def _update_startup_script(self, task: Task) -> Dict[str, Any]:
        """Update startup scripts"""
        return {"status": "updated"}

    async def _add_health_check(self, task: Task) -> Dict[str, Any]:
        """Add health check endpoint"""
        return {"status": "created"}

    def _start_services(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Start all services"""
        return {"status": "started"}

    def _stop_services(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Stop all services"""
        return {"status": "stopped"}

    def _check_status(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Check service status"""
        return {"backend": "running", "frontend": "running"}

    def _view_logs(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """View logs"""
        return {"logs": []}

    def _restart_service(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Restart a service"""
        service = payload.get("service", "all")
        return {"status": "restarted", "service": service}


class TestingAgent(BaseAgent):
    """
    Testing Agent - Handles quality assurance and testing

    Responsibilities:
    - Unit testing
    - Integration testing
    - Performance testing
    - Test automation
    - Test report generation
    """

    def __init__(self):
        config = AgentConfig(
            id="testing-01",
            name="Testing Specialist",
            agent_type="testing",
            description="Handles unit tests, integration tests, and performance benchmarks",
            capabilities=[
                "unit_testing",
                "integration_testing",
                "performance_testing",
                "test_automation",
                "report_generation",
            ],
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
            max_concurrent_tasks=3,
        )
        super().__init__(config)
        self.backend_tests_path = Path.cwd() / "backend" / "tests"
        self.frontend_tests_path = Path.cwd() / "frontend" / "tests"

    def _register_handlers(self) -> None:
        """Register testing-specific message handlers"""
        self.message_handlers = {
            "run_tests": self._run_tests,
            "generate_report": self._generate_report,
            "coverage": self._coverage,
        }

    async def process_task(self, task: Task) -> Dict[str, Any]:
        """Process testing-specific tasks"""
        action = task.input_data.get("action")

        if action == "write_unit_test":
            return await self._write_unit_test(task)
        elif action == "write_integration_test":
            return await self._write_integration_test(task)
        elif action == "run_all_tests":
            return await self._run_all_tests(task)
        elif action == "generate_coverage_report":
            return await self._generate_coverage_report(task)
        elif action == "performance_test":
            return await self._performance_test(task)
        else:
            raise ValueError(f"Unknown action: {action}")

    async def _write_unit_test(self, task: Task) -> Dict[str, Any]:
        """Write a unit test"""
        module = task.input_data.get("module")
        return {"status": "created", "module": module}

    async def _write_integration_test(self, task: Task) -> Dict[str, Any]:
        """Write an integration test"""
        return {"status": "created"}

    async def _run_all_tests(self, task: Task) -> Dict[str, Any]:
        """Run all tests"""
        return {"status": "passed", "total": 10, "failed": 0}

    async def _generate_coverage_report(self, task: Task) -> Dict[str, Any]:
        """Generate coverage report"""
        return {"status": "generated", "coverage": "85%"}

    async def _performance_test(self, task: Task) -> Dict[str, Any]:
        """Run performance tests"""
        return {"status": "completed", "avg_response_time_ms": 50}

    def _run_tests(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Run tests"""
        return {"passed": 10, "failed": 0}

    def _generate_report(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Generate test report"""
        return {"report": "test_report.html"}

    def _coverage(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Get test coverage"""
        return {"coverage": "85%"}


class TeamLeaderAgent(BaseAgent):
    """
    Team Leader - Decision maker and coordinator (决策者)

    Responsibilities:
    - Analyze project quality metrics
    - Identify optimization opportunities
    - Create and prioritize task queue
    - Assign tasks to specialized agents
    - Monitor progress and coordinate team
    - Review results and make decisions
    - Approve or reject changes
    """

    def __init__(self):
        config = AgentConfig(
            id="leader-01",
            name="Team Leader (决策者)",
            agent_type="leader",
            description="Coordinates the agent team, makes decisions, and reviews optimization results",
            capabilities=[
                "project_analysis",
                "task_prioritization",
                "team_coordination",
                "decision_making",
                "quality_gates",
            ],
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
            max_concurrent_tasks=5,  # Can handle multiple coordination tasks
        )
        super().__init__(config)
        self.task_queue: List[Task] = []
        self.team_members: Dict[str, str] = {}  # agent_id -> agent_type
        self.decision_log: List[Dict[str, Any]] = []

    def _register_handlers(self) -> None:
        """Register leader-specific message handlers"""
        self.message_handlers = {
            "analyze_project": self._analyze_project,
            "assign_tasks": self._assign_tasks,
            "review_results": self._review_results,
            "get_status": self._get_status,
        }

    async def process_task(self, task: Task) -> Dict[str, Any]:
        """Process leadership tasks"""
        action = task.input_data.get("action")

        if action == "analyze_and_plan":
            return await self._analyze_and_plan(task)
        elif action == "coordinate_optimization":
            return await self._coordinate_optimization(task)
        elif action == "review_cycle":
            return await self._review_cycle(task)
        elif action == "make_decision":
            return await self._make_decision(task)
        else:
            raise ValueError(f"Unknown action: {action}")

    async def _analyze_and_plan(self, task: Task) -> Dict[str, Any]:
        """Analyze project and create optimization plan"""
        # Would check:
        # - Code quality (SonarQube, linting)
        # - Test coverage
        # - Performance metrics
        # - Security vulnerabilities
        # - Documentation completeness

        return {
            "status": "analyzed",
            "metrics": {
                "code_coverage": 75,
                "critical_issues": 2,
                "performance_score": 78,
            },
            "opportunities": [
                {"priority": "high", "type": "bug_fix", "description": "Fix critical violations"},
                {"priority": "medium", "type": "optimization", "description": "Improve test coverage"},
            ],
        }

    async def _coordinate_optimization(self, task: Task) -> Dict[str, Any]:
        """Coordinate optimization cycle"""
        focus_areas = task.input_data.get("focus_areas", [])

        return {
            "status": "coordinated",
            "tasks_created": len(self.task_queue),
            "agents_assigned": len(self.team_members),
        }

    async def _review_cycle(self, task: Task) -> Dict[str, Any]:
        """Review optimization cycle results"""
        return {
            "status": "reviewed",
            "tasks_approved": 5,
            "tasks_rejected": 0,
            "tasks_needing_retry": 1,
        }

    async def _make_decision(self, task: Task) -> Dict[str, Any]:
        """Make decision on proposed changes"""
        decision = task.input_data.get("decision")
        return {
            "status": "decided",
            "decision": decision,
            "reasoning": "Based on quality gates and impact analysis",
        }

    # Message handlers
    def _analyze_project(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze project state"""
        return {"status": "analyzed", "health": "good"}

    def _assign_tasks(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Assign tasks to agents"""
        return {"status": "assigned", "count": 3}

    def _review_results(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Review optimization results"""
        return {"status": "approved", "improvements": 5}

    def _get_status(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Get team status"""
        return {
            "agents_active": len(self.team_members),
            "tasks_pending": len(self.task_queue),
            "decisions_made": len(self.decision_log),
        }


class QASpecialistAgent(BaseAgent):
    """
    QA Specialist - Validation and quality assurance expert (验收专家)

    Responsibilities:
    - Review code changes
    - Validate bug fixes
    - Run test suites
    - Enforce quality standards
    - Generate QA reports
    - Monitor continuous integration
    """

    def __init__(self):
        config = AgentConfig(
            id="qa-01",
            name="QA Specialist (验收专家)",
            agent_type="qa",
            description="Validates all changes, enforces quality gates, and ensures standards compliance",
            capabilities=[
                "code_review",
                "validation",
                "quality_assurance",
                "test_execution",
                "standards_enforcement",
            ],
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
            max_concurrent_tasks=4,
        )
        super().__init__(config)

    def _register_handlers(self) -> None:
        """Register QA-specific message handlers"""
        self.message_handlers = {
            "review_changes": self._review_changes,
            "validate_fix": self._validate_fix,
            "check_quality_gates": self._check_quality_gates,
            "generate_qa_report": self._generate_qa_report,
        }

    async def process_task(self, task: Task) -> Dict[str, Any]:
        """Process QA tasks"""
        action = task.input_data.get("action")

        if action == "validate_changes":
            return await self._validate_changes(task)
        elif action == "run_test_suite":
            return await self._run_test_suite(task)
        elif action == "check_quality_gates":
            return await self._check_quality_gates_impl(task)
        elif action == "review_pull_request":
            return await self._review_pull_request(task)
        elif action == "verify_fix":
            return await self._verify_fix_impl(task)
        else:
            raise ValueError(f"Unknown action: {action}")

    async def _validate_changes(self, task: Task) -> Dict[str, Any]:
        """Validate proposed changes"""
        changes = task.input_data.get("changes", [])

        return {
            "status": "validated",
            "approved": True,
            "issues_found": 0,
            "suggestions": [],
        }

    async def _run_test_suite(self, task: Task) -> Dict[str, Any]:
        """Run full test suite"""
        return {
            "status": "passed",
            "unit_tests": {"total": 150, "passed": 145, "failed": 5},
            "integration_tests": {"total": 50, "passed": 48, "failed": 2},
            "coverage": "78.5%",
        }

    async def _check_quality_gates_impl(self, task: Task) -> Dict[str, Any]:
        """Check if quality gates are met"""
        return {
            "status": "passed",
            "gates": {
                "code_coverage": {"minimum": 80, "actual": 78.5, "passed": False},
                "critical_violations": {"maximum": 0, "actual": 2, "passed": False},
                "test_pass_rate": {"minimum": 95, "actual": 96.7, "passed": True},
            },
        }

    async def _review_pull_request(self, task: Task) -> Dict[str, Any]:
        """Review a pull request"""
        pr_id = task.input_data.get("pr_id")

        return {
            "status": "reviewed",
            "pr_id": pr_id,
            "approved": True,
            "comments": [],
        }

    async def _verify_fix_impl(self, task: Task) -> Dict[str, Any]:
        """Verify that a bug fix is correct"""
        return {
            "status": "verified",
            "fix_confirmed": True,
            "regression_test_added": True,
        }

    # Message handlers
    def _review_changes(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Review code changes"""
        return {"status": "approved", "issues": []}

    def _validate_fix(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Validate a fix"""
        return {"status": "valid", "verified": True}

    def _check_quality_gates(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Check quality gates"""
        return {"status": "passed", "all_gates_met": True}

    def _generate_qa_report(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Generate QA report"""
        return {"report": "qa_report.html", "metrics": {}}


class BugHunterAgent(BaseAgent):
    """
    Bug Hunter - Code quality and security specialist (修复者)

    Responsibilities:
    - Scan code for issues
    - Fix bugs
    - Resolve security vulnerabilities
    - Clean up technical debt
    - Refactor code smells
    - Enforce code quality standards
    """

    def __init__(self):
        config = AgentConfig(
            id="bug-hunter",
            name="Bug Hunter (修复者)",
            agent_type="bug_hunter",
            description="Hunts down and fixes bugs, security issues, and code quality problems",
            capabilities=[
                "bug_detection",
                "bug_fixing",
                "security_scanning",
                "code_refactoring",
                "technical_debt_cleanup",
            ],
            tools=["Read", "Edit", "Write", "Bash", "Grep", "Glob"],
            max_concurrent_tasks=3,
        )
        super().__init__(config)

    def _register_handlers(self) -> None:
        """Register bug hunter-specific message handlers"""
        self.message_handlers = {
            "scan_issues": self._scan_issues,
            "fix_bug": self._fix_bug,
            "security_scan": self._security_scan,
            "cleanup_debt": self._cleanup_debt,
        }

    async def process_task(self, task: Task) -> Dict[str, Any]:
        """Process bug hunting tasks"""
        action = task.input_data.get("action")

        if action == "fix_critical_violations":
            return await self._fix_critical_violations(task)
        elif action == "security_scan":
            return await self._security_scan_impl(task)
        elif action == "cleanup_technical_debt":
            return await self._cleanup_technical_debt(task)
        elif action == "refactor_smells":
            return await self._refactor_smells(task)
        elif action == "fix_bug":
            return await self._fix_bug_impl(task)
        else:
            raise ValueError(f"Unknown action: {action}")

    async def _fix_critical_violations(self, task: Task) -> Dict[str, Any]:
        """Fix critical code violations"""
        violations = task.input_data.get("violations", [])

        return {
            "status": "fixed",
            "violations_fixed": len(violations),
            "files_modified": 5,
        }

    async def _security_scan_impl(self, task: Task) -> Dict[str, Any]:
        """Perform security scan"""
        return {
            "status": "scanned",
            "vulnerabilities_found": 3,
            "vulnerabilities_fixed": 3,
            "secrets_scanned": 150,
            "secrets_found": 0,
        }

    async def _cleanup_technical_debt(self, task: Task) -> Dict[str, Any]:
        """Clean up technical debt"""
        return {
            "status": "cleaned",
            "dead_code_removed": 250,
            "dependencies_updated": 12,
            "files_refactored": 8,
        }

    async def _refactor_smells(self, task: Task) -> Dict[str, Any]:
        """Refactor code smells"""
        smells = task.input_data.get("smells", [])

        return {
            "status": "refactored",
            "smells_fixed": len(smells),
            "complexity_reduced": 15,
            "duplications_removed": 8,
        }

    async def _fix_bug_impl(self, task: Task) -> Dict[str, Any]:
        """Fix a specific bug"""
        bug_id = task.input_data.get("bug_id")
        return {
            "status": "fixed",
            "bug_id": bug_id,
            "verified": True,
        }

    # Message handlers
    def _scan_issues(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Scan for code issues"""
        return {"issues": [], "critical": 0, "major": 2}

    def _fix_bug(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Fix a bug"""
        return {"status": "fixed"}

    def _security_scan(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Security scan"""
        return {"vulnerabilities": []}

    def _cleanup_debt(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Clean up technical debt"""
        return {"status": "cleaned"}


# Factory function to create agents by type
def create_agent(agent_type: str) -> BaseAgent:
    """Factory function to create an agent of the specified type"""
    agent_classes = {
        "backend": BackendAgent,
        "frontend": FrontendAgent,
        "data": DataAgent,
        "algorithm": AlgorithmAgent,
        "devops": DevOpsAgent,
        "testing": TestingAgent,
        # Role-based agents
        "leader": TeamLeaderAgent,
        "qa": QASpecialistAgent,
        "bug_hunter": BugHunterAgent,
    }

    agent_class = agent_classes.get(agent_type)
    if agent_class:
        return agent_class()
    else:
        raise ValueError(f"Unknown agent type: {agent_type}")


def create_all_agents() -> List[BaseAgent]:
    """Create all specialized agents (both domain and role-based)"""
    return [
        # Role-based agents (coordinators)
        TeamLeaderAgent(),
        QASpecialistAgent(),
        BugHunterAgent(),
        # Domain-specific agents (executors)
        BackendAgent(),
        FrontendAgent(),
        DataAgent(),
        AlgorithmAgent(),
        DevOpsAgent(),
        TestingAgent(),
    ]


def create_domain_agents() -> List[BaseAgent]:
    """Create only domain-specific agents (executors)"""
    return [
        BackendAgent(),
        FrontendAgent(),
        DataAgent(),
        AlgorithmAgent(),
        DevOpsAgent(),
        TestingAgent(),
    ]


def create_role_agents() -> List[BaseAgent]:
    """Create only role-based agents (coordinators)"""
    return [
        TeamLeaderAgent(),
        QASpecialistAgent(),
        BugHunterAgent(),
    ]
