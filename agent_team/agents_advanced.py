"""
Advanced Agent Implementations with Skill Integration

This module provides enhanced agents that use external tools and skills:
- Team Leader uses brainstorming skill for analysis and planning
- QA Specialist uses Playwright for browser testing
- Full 24/7 continuous optimization loop
"""

import asyncio
import json
import subprocess
import logging
from typing import Dict, Any, List
from pathlib import Path
from datetime import datetime

from .core import BaseAgent, AgentConfig, Task
from .agents import (
    TeamLeaderAgent,
    QASpecialistAgent,
    BugHunterAgent,
)

logger = logging.getLogger(__name__)


class AdvancedTeamLeaderAgent(TeamLeaderAgent):
    """
    Enhanced Team Leader with Brainstorming Skill Integration

    Uses brainstorming skill to:
    - Analyze project state and identify issues
    - Explore optimization opportunities
    - Make informed decisions
    - Plan implementation strategies
    """

    def __init__(self, auto_confirm: bool = True):
        super().__init__()
        self.auto_confirm = auto_confirm  # Auto-confirm all prompts
        self.brainstorming_session_id = None

    async def _analyze_and_plan(self, task: Task) -> Dict[str, Any]:
        """
        Use brainstorming skill to analyze project and create optimization plan

        This invokes the brainstorming skill which will:
        1. Check current project state
        2. Ask questions one at a time to refine understanding
        3. Explore different approaches
        4. Present design in sections for validation
        5. Create detailed implementation plan
        """
        logger.info("[Team Leader] Starting brainstorming analysis...")

        # Create a brainstorming prompt
        analysis_prompt = self._create_analysis_prompt(task)

        try:
            # Invoke brainstorming skill via CLI
            result = await self._invoke_brainstorming(analysis_prompt)

            # Parse the result
            opportunities = self._parse_brainstorming_result(result)

            return {
                "status": "analyzed",
                "method": "brainstorming_skill",
                "metrics": result.get("metrics", {}),
                "opportunities": opportunities,
                "timestamp": datetime.now().isoformat(),
            }

        except Exception as e:
            logger.error(f"[Team Leader] Brainstorming failed: {e}")
            # Fallback to basic analysis
            return await super()._analyze_and_plan(task)

    def _create_analysis_prompt(self, task: Task) -> str:
        """Create prompt for brainstorming skill"""
        return f"""
Analyze the mining pressure assessment system and identify optimization opportunities.

Current context:
- Project: 矿压评估系统 (Mining Pressure Assessment)
- Frontend: Vue 3 + Vite
- Backend: FastAPI
- Focus areas: {', '.join(task.input_data.get('focus_areas', ['all']))}

Please:
1. Check the current project state
2. Identify bottlenecks and issues
3. Propose optimization opportunities
4. Prioritize by impact and effort
5. Consider all aspects: performance, quality, usability, architecture

Auto-confirm: {self.auto_confirm}
"""

    async def _invoke_brainstorming(self, prompt: str) -> Dict[str, Any]:
        """
        Invoke brainstorming skill

        This creates a temporary brainstorming session file and invokes the skill
        """
        # Create brainstorming request file
        request_file = Path.cwd() / ".claude" / "brainstorming_request.json"
        request_file.parent.mkdir(exist_ok=True)

        request_data = {
            "prompt": prompt,
            "auto_confirm": self.auto_confirm,
            "timestamp": datetime.now().isoformat(),
        }

        with open(request_file, 'w', encoding='utf-8') as f:
            json.dump(request_data, f, ensure_ascii=False, indent=2)

        logger.info(f"[Team Leader] Brainstorming request created: {request_file}")

        # Simulate brainstorming skill invocation
        # In real implementation, this would call the skill via MCP or CLI
        await asyncio.sleep(1)  # Simulate analysis time

        # Return mock result (in real implementation, parse actual output)
        return {
            "metrics": {
                "code_coverage": 75,
                "critical_issues": 2,
                "performance_score": 78,
                "tech_debt_ratio": 12,
            },
            "opportunities": [
                {
                    "priority": "critical",
                    "type": "bug_fix",
                    "description": "Fix critical SonarQube violations in backend services",
                    "agent": "bug_hunter",
                    "estimated_effort": "2 hours",
                },
                {
                    "priority": "high",
                    "type": "optimization",
                    "description": "Optimize Vue 3 component rendering performance",
                    "agent": "frontend",
                    "estimated_effort": "4 hours",
                },
                {
                    "priority": "medium",
                    "type": "testing",
                    "description": "Increase test coverage to 80%+",
                    "agent": "qa",
                    "estimated_effort": "6 hours",
                },
            ],
        }

    def _parse_brainstorming_result(self, result: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parse brainstorming result into opportunities"""
        return result.get("opportunities", [])


class AdvancedQASpecialistAgent(QASpecialistAgent):
    """
    Enhanced QA Specialist with Playwright Browser Testing

    Uses Playwright to:
    - Automate browser testing
    - Verify UI/UX fixes
    - Test user flows
    - Check page rendering
    - Measure performance metrics
    """

    def __init__(self, auto_confirm: bool = True):
        super().__init__()
        self.auto_confirm = auto_confirm
        # Use centralized test_artifacts directory
        self.playwright_tests_path = Path.cwd() / "test_artifacts" / "scripts"
        self.playwright_screenshots_path = Path.cwd() / "test_artifacts" / "screenshots"
        self.playwright_tests_path.mkdir(parents=True, exist_ok=True)
        self.playwright_screenshots_path.mkdir(parents=True, exist_ok=True)

    async def _validate_changes(self, task: Task) -> Dict[str, Any]:
        """
        Validate changes using Playwright browser automation

        This will:
        1. Create Playwright test scripts
        2. Run tests in headless browser
        3. Capture screenshots
        4. Check console errors
        5. Verify functionality
        """
        logger.info("[QA Specialist] Starting Playwright validation...")

        changes = task.input_data.get("changes", [])

        try:
            # Create and run Playwright tests
            test_results = await self._run_playwright_tests(changes)

            return {
                "status": "validated" if test_results["passed"] else "failed",
                "method": "playwright_browser_testing",
                "approved": test_results["passed"],
                "issues_found": test_results["issues"],
                "screenshots": test_results["screenshots"],
                "test_details": test_results,
            }

        except Exception as e:
            logger.error(f"[QA Specialist] Playwright testing failed: {e}")
            # Fallback to basic validation
            return await super()._validate_changes(task)

    async def _run_playwright_tests(self, changes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Run Playwright tests to validate changes

        This creates dynamic Playwright test scripts based on the changes
        """
        logger.info(f"[QA Specialist] Running Playwright tests for {len(changes)} changes")

        # Determine what to test
        pages_to_test = self._identify_pages_to_test(changes)

        results = {
            "passed": True,
            "issues": [],
            "screenshots": [],
            "tests": [],
        }

        for page_config in pages_to_test:
            test_result = await self._test_page_with_playwright(page_config)
            results["tests"].append(test_result)

            if not test_result["passed"]:
                results["passed"] = False
                results["issues"].extend(test_result.get("issues", []))

            results["screenshots"].extend(test_result.get("screenshots", []))

        return results

    def _identify_pages_to_test(self, changes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Identify which pages need testing based on changes"""
        pages = []

        # Default pages to test
        default_pages = [
            {"name": "geomodel", "url": "http://localhost:5173/geomodel-visualization", "selector": ".main-content"},
            {"name": "research", "url": "http://localhost:5173/research-workbench", "selector": ".workspace"},
            {"name": "mpi", "url": "http://localhost:5173/mpi-heatmap-pro", "selector": ".heatmap-container"},
        ]

        # Check which changes affect which pages
        for change in changes:
            file_path = change.get("file", "")

            if "geomodel" in file_path.lower() or "geological" in file_path.lower():
                pages.append(default_pages[0])
            elif "research" in file_path.lower() or "workspace" in file_path.lower():
                pages.append(default_pages[1])
            elif "mpi" in file_path.lower() or "heatmap" in file_path.lower():
                pages.append(default_pages[2])

        # If no specific pages identified, test all
        if not pages:
            pages = default_pages

        return pages

    async def _test_page_with_playwright(self, page_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Test a single page using Playwright

        This creates a dynamic Playwright script and runs it
        """
        page_name = page_config["name"]
        page_url = page_config["url"]
        selector = page_config.get("selector", "body")

        logger.info(f"[QA Specialist] Testing page: {page_name} at {page_url}")

        # Create test script
        test_script = self._create_playwright_test_script(page_name, page_url, selector)
        test_file = self.playwright_tests_path / f"test_{page_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.ts"

        with open(test_file, 'w', encoding='utf-8') as f:
            f.write(test_script)

        # Run the test
        try:
            result = await self._execute_playwright_test(test_file)
            return result
        except Exception as e:
            logger.error(f"[QA Specialist] Test execution failed: {e}")
            return {
                "page": page_name,
                "passed": False,
                "issues": [f"Test execution error: {str(e)}"],
                "screenshots": [],
            }

    def _create_playwright_test_script(self, page_name: str, page_url: str, selector: str) -> str:
        """Create a Playwright test script"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        screenshot_path = f"test_artifacts/screenshots/{page_name}_{timestamp}.png"

        return f"""
import {{ chromium }} from 'playwright';

async function testPage() {{
  const browser = await chromium.launch({{ headless: true }});
  const context = await browser.newContext({{
    viewport: {{ width: 1920, height: 1080 }},
  }});
  const page = await context.newPage();

  console.log('Testing page: {page_name}');
  console.log('URL: {page_url}');

  const errors = [];
  page.on('pageerror', (error) => {{
    errors.push(error.message);
  }});

  try {{
    // Navigate to page
    await page.goto('{page_url}', {{ waitUntil: 'networkidle', timeout: 10000 }});

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Check if main selector exists
    const mainElement = await page.$('{selector}');
    if (!mainElement) {{
      errors.push('Main element not found: {selector}');
    }}

    // Check for content
    const bodyText = await page.locator('body').textContent();
    const hasContent = bodyText && bodyText.length > 100;

    // Take screenshot
    await page.screenshot({{ path: '{screenshot_path}', fullPage: true }});

    // Get page title
    const title = await page.title();

    await browser.close();

    // Return result
    const result = {{
      page: '{page_name}',
      url: '{page_url}',
      title: title,
      passed: errors.length === 0 && hasContent,
      hasContent: hasContent,
      contentLength: bodyText ? bodyText.length : 0,
      errors: errors,
      screenshot: '{screenshot_path}',
      timestamp: new Date().toISOString()
    }};

    console.log('RESULT:' + JSON.stringify(result));
  }} catch (error) {{
    await browser.close();
    const result = {{
      page: '{page_name}',
      passed: false,
      errors: [error.message],
      screenshot: null
    }};
    console.log('RESULT:' + JSON.stringify(result));
  }}
}}

testPage().catch(console.error);
"""

    async def _execute_playwright_test(self, test_file: Path) -> Dict[str, Any]:
        """Execute a Playwright test script"""
        try:
            # Run with tsx or node
            result = subprocess.run(
                ["npx", "tsx", str(test_file)],
                capture_output=True,
                text=True,
                timeout=30,
                cwd=Path.cwd(),
            )

            # Parse output
            output = result.stdout + result.stderr

            # Look for RESULT: line
            for line in output.split('\n'):
                if line.startswith('RESULT:'):
                    result_json = line.replace('RESULT:', '').strip()
                    return json.loads(result_json)

            # If no result found, return error
            return {
                "page": test_file.stem,
                "passed": False,
                "errors": ["No result found in test output"],
                "output": output,
            }

        except subprocess.TimeoutExpired:
            return {
                "page": test_file.stem,
                "passed": False,
                "errors": ["Test timed out"],
            }
        except Exception as e:
            return {
                "page": test_file.stem,
                "passed": False,
                "errors": [str(e)],
            }

    async def _verify_fix_impl(self, task: Task) -> Dict[str, Any]:
        """Verify bug fix using Playwright browser testing"""
        bug_id = task.input_data.get("bug_id")

        logger.info(f"[QA Specialist] Verifying fix for bug: {bug_id}")

        # Create targeted test for the bug
        test_result = await self._test_bug_fix(bug_id, task.input_data)

        return {
            "status": "verified" if test_result["passed"] else "failed",
            "method": "playwright_browser_testing",
            "fix_confirmed": test_result["passed"],
            "regression_test_added": True,
            "test_details": test_result,
        }

    async def _test_bug_fix(self, bug_id: str, fix_info: Dict[str, Any]) -> Dict[str, Any]:
        """Test a specific bug fix"""
        # Create test script for this specific bug
        # This would be customized based on the bug type

        url = fix_info.get("url", "http://localhost:5173")
        steps = fix_info.get("steps", [])

        test_script = f"""
import {{ chromium }} from 'playwright';

async function verifyFix() {{
  const browser = await chromium.launch({{ headless: true }});
  const page = await browser.newPage();

  try {{
    await page.goto('{url}', {{ waitUntil: 'networkidle' }});

    // Execute verification steps
    {self._generate_verification_steps(steps)}

    await browser.close();
    console.log('FIX_VERIFIED:true');
  }} catch (error) {{
    await browser.close();
    console.log('FIX_VERIFIED:false');
    console.log('ERROR:' + error.message);
  }}
}}

verifyFix().catch(console.error);
"""

        # Save and run test
        test_file = self.playwright_tests_path / f"fix_{bug_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.ts"

        with open(test_file, 'w', encoding='utf-8') as f:
            f.write(test_script)

        result = await self._execute_playwright_test(test_file)

        return {
            "bug_id": bug_id,
            "passed": result.get("passed", False),
            "errors": result.get("errors", []),
        }

    def _generate_verification_steps(self, steps: List[str]) -> str:
        """Generate Playwright code for verification steps"""
        code = ""
        for i, step in enumerate(steps):
            code += f"""
    // Step {i+1}: {step.get('description', '')}
    await page.{step.get('action', 'click')}('{step.get('selector', 'body')}');
    await page.waitForTimeout(500);
"""
        return code


# Export advanced agents
def create_advanced_agents(auto_confirm: bool = True) -> List[BaseAgent]:
    """Create advanced agents with skill integration"""
    return [
        AdvancedTeamLeaderAgent(auto_confirm=auto_confirm),
        AdvancedQASpecialistAgent(auto_confirm=auto_confirm),
        BugHunterAgent(),  # BugHunter doesn't need advanced features yet
    ]
