#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
24/7 Continuous Optimization System

This scheduler runs the agent team continuously with intelligent task scheduling.
Uses schedule_config.json for configuration and supports automatic confirmation mode.
"""

import asyncio
import json
import logging
import signal
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, List, Optional

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_team.coordinator import AgentCoordinator
from agent_team.agents_advanced import create_advanced_agents
from agent_team.agents import create_domain_agents
from agent_team.core import Task, TaskPriority

# Setup logging
log_file = Path(__file__).parent / "continuous_optimization.log"
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


class ContinuousOptimizationScheduler:
    """
    24/7 Continuous Optimization Scheduler

    Runs optimization cycles continuously with:
    - Time-based focus areas
    - Weekly themes
    - Quality gates
    - Automatic confirmation
    - Detailed reporting
    """

    def __init__(self, auto_confirm: bool = True):
        self.auto_confirm = auto_confirm
        self.coordinator = AgentCoordinator()
        self.schedule_config = self._load_schedule_config()
        self.is_running = False
        self.cycle_count = 0
        self.reports_dir = Path(__file__).parent / "optimization_reports"
        self.reports_dir.mkdir(parents=True, exist_ok=True)

        # Setup graceful shutdown
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)

    def _signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        logger.info(f"[Scheduler] Received signal {signum}, shutting down gracefully...")
        self.is_running = False

    def _load_schedule_config(self) -> Dict:
        """Load schedule configuration from file"""
        config_path = Path.cwd() / "agent_team" / "schedule_config.json"

        if config_path.exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            logger.warning(f"[Scheduler] Config file not found: {config_path}, using defaults")
            return self._default_schedule()

    def _default_schedule(self) -> Dict:
        """Default schedule if no config file exists"""
        return {
            "cycle_interval_minutes": 30,
            "focus_hours": {
                "00-06": ["stability", "bug_fixes", "security"],
                "06-12": ["performance", "testing", "optimization"],
                "12-18": ["features", "architecture", "refactoring"],
                "18-24": ["review", "documentation", "cleanup"]
            },
            "weekly_theme": {
                "monday": "performance_optimization",
                "tuesday": "test_coverage",
                "wednesday": "architecture_improvements",
                "thursday": "security_hardening",
                "friday": "documentation",
                "saturday": "bug_bash",
                "sunday": "tech_debt_cleanup"
            },
            "quality_gates": {
                "code_coverage_minimum": 80,
                "lighthouse_performance_minimum": 85,
                "critical_violations_maximum": 0
            },
            "automation_settings": {
                "auto_fix_simple_bugs": True,
                "auto_refactor_safe_code": True,
                "auto_deploy": False
            },
            "limits": {
                "max_concurrent_tasks": 5,
                "max_retries": 3,
                "task_timeout_minutes": 30
            }
        }

    async def start(self):
        """Start 24/7 continuous optimization loop"""
        self.is_running = True

        print("=" * 70)
        print("24/7 Continuous Optimization System")
        print("=" * 70)
        print("\nThis will run continuous optimization cycles until stopped.")
        print("Press Ctrl+C to stop gracefully.\n")
        print("Configuration:")

        # Show configuration
        cycle_interval = self.schedule_config.get("cycle_interval_minutes", 30)
        print(f"  - Cycle interval: {cycle_interval} minutes")
        print(f"  - Auto-confirm: {self.auto_confirm}")
        print(f"  - Reports directory: {self.reports_dir}")
        print("\nAdvanced Features:")
        print("  - Team Leader uses brainstorming skill for analysis")
        print("  - QA Specialist uses Playwright for browser testing")
        print("  - Intelligent task scheduling based on time and day")
        print("  - Quality gates enforce standards")
        print("=" * 70 + "\n")

        # Register all agents
        logger.info("[Scheduler] Registering agents...")

        # Role-based agents (advanced versions with skills)
        advanced_agents = create_advanced_agents(auto_confirm=self.auto_confirm)
        for agent in advanced_agents:
            self.coordinator.register_agent(agent)
            logger.info(f"  ✓ Registered advanced agent: {agent.config.name}")

        # Domain-specific agents
        domain_agents = create_domain_agents()
        for agent in domain_agents:
            self.coordinator.register_agent(agent)
            logger.info(f"  ✓ Registered domain agent: {agent.config.name}")

        # Start coordinator
        await self.coordinator.start()

        # Main optimization loop
        while self.is_running:
            try:
                await self._run_optimization_cycle()

                # Wait for next cycle
                interval_minutes = self.schedule_config.get("cycle_interval_minutes", 30)
                logger.info(f"[Scheduler] Waiting {interval_minutes} minutes until next cycle...")

                # Sleep in small increments to check for shutdown signal
                for _ in range(interval_minutes * 60):
                    if not self.is_running:
                        break
                    await asyncio.sleep(1)

            except Exception as e:
                logger.error(f"[Scheduler] Error in optimization cycle: {e}")
                # Continue to next cycle despite errors
                await asyncio.sleep(60)  # Wait 1 minute before retry

        # Shutdown
        logger.info("[Scheduler] Shutting down...")
        await self.coordinator.stop()
        logger.info("[Scheduler] Shutdown complete")

    async def _run_optimization_cycle(self):
        """Run a single optimization cycle"""
        self.cycle_count += 1
        cycle_id = datetime.now().strftime("%Y%m%d_%H%M%S")

        logger.info("=" * 70)
        logger.info(f"[Cycle #{self.cycle_count}] Starting optimization cycle {cycle_id}")
        logger.info("=" * 70)

        # Phase 1: Analysis (5 minutes)
        logger.info("[Phase 1/5] Analysis - Team Leader analyzing project...")
        analysis = await self._analyze_project()
        self._log_analysis(analysis)

        # Phase 2: Planning (5 minutes)
        logger.info("[Phase 2/5] Planning - Creating optimization tasks...")
        tasks = await self._create_optimization_tasks(analysis)
        logger.info(f"  Created {len(tasks)} optimization tasks")

        # Phase 3: Execution (15 minutes)
        logger.info("[Phase 3/5] Execution - Running optimization tasks...")
        execution_results = await self._execute_tasks_batch(tasks)
        logger.info(f"  Executed {len(execution_results)} tasks")

        # Phase 4: Validation (3 minutes)
        logger.info("[Phase 4/5] Validation - QA Specialist validating results...")
        validation = await self._validate_results(execution_results)
        self._log_validation(validation)

        # Phase 5: Report (2 minutes)
        logger.info("[Phase 5/5] Report - Generating optimization report...")
        await self._generate_cycle_report(cycle_id, analysis, execution_results, validation)

        logger.info("=" * 70)
        logger.info(f"[Cycle #{self.cycle_count}] Optimization cycle complete")
        logger.info("=" * 70)

    async def _analyze_project(self) -> Dict[str, Any]:
        """Analyze current project state"""
        # Get current focus areas based on time
        focus_areas = self._get_current_focus_areas()

        # Create analysis task for Team Leader
        analysis_task = self.coordinator.create_task(
            title=f"Analyze Project - Cycle #{self.cycle_count}",
            description=f"Analyze project and identify optimization opportunities",
            agent_type="leader",
            priority=TaskPriority.HIGH,
            input_data={
                "action": "analyze_and_plan",
                "focus_areas": focus_areas,
                "cycle_count": self.cycle_count,
            },
        )

        # Submit and wait for completion
        task_id = self.coordinator.submit_task(analysis_task)
        await asyncio.sleep(5)  # Wait for analysis

        # Get result
        status = self.coordinator.get_task_status(task_id)
        if status and status["status"] == "completed":
            return status.get("output_data", {})
        else:
            return {"opportunities": []}

    def _get_current_focus_areas(self) -> List[str]:
        """Get focus areas based on current time and day"""
        now = datetime.now()
        hour = now.hour
        weekday = now.strftime("%A").lower()

        # Get time-based focus
        for time_range, areas in self.schedule_config.get("focus_hours", {}).items():
            start_hour, end_hour = map(int, time_range.split("-"))
            if start_hour <= hour < end_hour:
                time_focus = areas
                break
        else:
            time_focus = ["optimization"]

        # Get weekly theme
        weekly_theme = self.schedule_config.get("weekly_theme", {})
        day_theme = weekly_theme.get(weekday, "optimization")

        # Combine time focus and day theme
        focus_areas = list(set(time_focus + [day_theme]))

        logger.info(f"[Scheduler] Current focus areas: {', '.join(focus_areas)}")
        return focus_areas

    async def _create_optimization_tasks(self, analysis: Dict[str, Any]) -> List[Task]:
        """Create optimization tasks based on analysis"""
        opportunities = analysis.get("opportunities", [])
        tasks = []

        # Convert opportunities to tasks
        for opp in opportunities[:5]:  # Limit to 5 tasks per cycle
            agent_type = opp.get("agent", "backend")
            priority = TaskPriority.HIGH if opp.get("priority") == "critical" else TaskPriority.NORMAL

            task = self.coordinator.create_task(
                title=opp.get("description", "Optimization task"),
                description=opp.get("description", ""),
                agent_type=agent_type,
                priority=priority,
                input_data={
                    "action": self._map_opportunity_to_action(opp.get("type", "optimization")),
                    "opportunity": opp,
                },
            )

            tasks.append(task)

        return tasks

    def _map_opportunity_to_action(self, opportunity_type: str) -> str:
        """Map opportunity type to agent action"""
        action_map = {
            "bug_fix": "fix_bug",
            "optimization": "optimize_component",  # Frontend uses optimize_component
            "testing": "run_all_tests",
            "performance": "optimize_component",
            "security": "security_scan",
        }
        return action_map.get(opportunity_type, "optimize_component")

    async def _execute_tasks_batch(self, tasks: List[Task]) -> List[Dict[str, Any]]:
        """Execute a batch of tasks"""
        results = []

        for task in tasks:
            task_id = self.coordinator.submit_task(task)
            logger.info(f"  → Executing: {task.title}")

            # Wait for task completion
            await asyncio.sleep(3)

            # Get result
            status = self.coordinator.get_task_status(task_id)
            results.append(status or {})

        return results

    async def _validate_results(self, execution_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Validate optimization results"""
        # Create validation task for QA Specialist
        validation_task = self.coordinator.create_task(
            title=f"Validate Results - Cycle #{self.cycle_count}",
            description="Validate all optimization changes using Playwright",
            agent_type="qa",
            priority=TaskPriority.HIGH,
            input_data={
                "action": "validate_changes",
                "changes": execution_results,
            },
        )

        task_id = self.coordinator.submit_task(validation_task)
        await asyncio.sleep(5)

        status = self.coordinator.get_task_status(task_id)
        return status.get("output_data", {}) if status else {}

    def _log_analysis(self, analysis: Dict[str, Any]):
        """Log analysis results"""
        metrics = analysis.get("metrics", {})
        logger.info("  Analysis Results:")
        if metrics:
            for key, value in metrics.items():
                logger.info(f"    • {key}: {value}")

    def _log_validation(self, validation: Dict[str, Any]):
        """Log validation results"""
        approved = validation.get("approved", False)
        issues = validation.get("issues_found", 0)

        logger.info(f"  Validation Results:")
        logger.info(f"    • Approved: {approved}")
        logger.info(f"    • Issues found: {issues}")

    async def _generate_cycle_report(self, cycle_id: str, analysis: Dict,
                                    execution_results: List[Dict],
                                    validation: Dict):
        """Generate optimization cycle report"""
        report = {
            "cycle_id": cycle_id,
            "cycle_number": self.cycle_count,
            "timestamp": datetime.now().isoformat(),
            "analysis": analysis,
            "execution": {
                "total_tasks": len(execution_results),
                "completed": len([r for r in execution_results if r.get("status") == "completed"]),
                "failed": len([r for r in execution_results if r.get("status") == "failed"]),
                "results": execution_results,
            },
            "validation": validation,
            "focus_areas": self._get_current_focus_areas(),
        }

        # Save report
        report_file = self.reports_dir / f"cycle_{cycle_id}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)

        logger.info(f"  Report saved: {report_file}")

        # Also save human-readable markdown
        md_report_file = self.reports_dir / f"cycle_{cycle_id}.md"
        await self._generate_markdown_report(md_report_file, report)

        logger.info(f"  Markdown report saved: {md_report_file}")

    async def _generate_markdown_report(self, report_file: Path, report_data: Dict):
        """Generate human-readable markdown report"""
        md_content = f"""# Optimization Cycle Report

**Cycle ID**: {report_data['cycle_id']}
**Cycle Number**: {report_data['cycle_number']}
**Timestamp**: {report_data['timestamp']}
**Focus Areas**: {', '.join(report_data['focus_areas'])}

## Analysis Results

```json
{json.dumps(report_data['analysis'].get('metrics', {}), indent=2)}
```

## Execution Summary

- **Total Tasks**: {report_data['execution']['total_tasks']}
- **Completed**: {report_data['execution']['completed']}
- **Failed**: {report_data['execution']['failed']}

### Task Results

"""

        for i, result in enumerate(report_data['execution']['results'], 1):
            md_content += f"{i}. **{result.get('title', 'Unknown')}**\n"
            md_content += f"   - Status: {result.get('status', 'unknown')}\n"
            md_content += f"   - Agent: {result.get('assigned_to', 'unknown')}\n\n"

        md_content += f"""
## Validation Results

- **Approved**: {report_data['validation'].get('approved', False)}
- **Issues Found**: {report_data['validation'].get('issues_found', 0)}
- **Method**: {report_data['validation'].get('method', 'unknown')}

---

*Generated by 24/7 Continuous Optimization System*
"""

        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(md_content)


async def main():
    """Main entry point"""
    # Check for command line arguments
    auto_confirm = "--auto-confirm" in sys.argv or "-y" in sys.argv

    scheduler = ContinuousOptimizationScheduler(auto_confirm=auto_confirm)

    try:
        await scheduler.start()
    except KeyboardInterrupt:
        logger.info("\n\n[STOPPED] Scheduler stopped by user")
    except Exception as e:
        logger.error(f"\n\n[ERROR] Scheduler error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
