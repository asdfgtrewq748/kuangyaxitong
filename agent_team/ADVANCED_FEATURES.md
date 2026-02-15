# Advanced Agent Team Features

This document describes the advanced features of the agent team system that integrate external tools and skills for enhanced automation.

## 🎯 Overview

The advanced agent team includes:

1. **Brainstorming Skill Integration** - Team Leader uses brainstorming for analysis
2. **Playwright Browser Testing** - QA Specialist automates browser testing
3. **24/7 Continuous Optimization** - Intelligent scheduling around the clock
4. **Auto-Confirmation Mode** - Fully automated without prompts

---

## 🧠 Brainstorming Skill Integration

### What It Does

The Team Leader agent uses the brainstorming skill to:
- Analyze project state thoroughly
- Identify optimization opportunities
- Explore multiple approaches
- Make informed decisions
- Plan implementation strategies

### How It Works

```python
from agent_team.agents_advanced import AdvancedTeamLeaderAgent

# Create advanced Team Leader
leader = AdvancedTeamLeaderAgent(auto_confirm=True)

# When analyzing project, it will:
# 1. Create brainstorming request
# 2. Invoke brainstorming skill
# 3. Explore opportunities
# 4. Present optimization plan
# 5. Auto-confirm all prompts
```

### Benefits

- **Deeper Analysis**: Brainstorming explores multiple angles
- **Better Decisions**: Considers trade-offs and alternatives
- **Comprehensive Plans**: Validates approach before implementation
- **Expert Guidance**: Uses structured brainstorming methodology

### Configuration

```python
# Auto-confirm mode (recommended for 24/7 operation)
leader = AdvancedTeamLeaderAgent(auto_confirm=True)

# Manual confirmation (for interactive use)
leader = AdvancedTeamLeaderAgent(auto_confirm=False)
```

---

## 🌐 Playwright Browser Testing

### What It Does

The QA Specialist agent uses Playwright to:
- Automate browser testing
- Verify UI/UX fixes
- Test user flows end-to-end
- Capture screenshots for verification
- Check console errors
- Measure page rendering

### How It Works

```python
from agent_team.agents_advanced import AdvancedQASpecialistAgent

# Create advanced QA Specialist
qa = AdvancedQASpecialistAgent(auto_confirm=True)

# When validating changes, it will:
# 1. Create Playwright test scripts dynamically
# 2. Launch Chromium browser
# 3. Navigate to pages
# 4. Check for errors and content
# 5. Capture screenshots
# 6. Return detailed results
```

### Test Coverage

**Default Pages Tested**:
- Geomodel Visualization (`/geomodel-visualization`)
- Research Workbench (`/research-workbench`)
- MPI Heatmap Pro (`/mpi-heatmap-pro`)

**Checks Performed**:
- Page loads successfully
- Main content exists
- No console errors
- Content length sufficient
- Screenshot captured

### Example Test Output

```json
{
  "page": "geomodel",
  "url": "http://localhost:5173/geomodel-visualization",
  "title": "地质建模可视化",
  "passed": true,
  "hasContent": true,
  "contentLength": 15234,
  "errors": [],
  "screenshot": "agent_team/playwright_screenshots/geomodel_20260215_143022.png",
  "timestamp": "2026-02-15T14:30:22.123456"
}
```

### Artifacts Created

**Test Scripts**: `agent_team/playwright_tests/test_*.ts`
- Dynamic TypeScript files created for each test
- Can be reviewed and debugged manually

**Screenshots**: `agent_team/playwright_screenshots/*.png`
- Full-page screenshots of each tested page
- Named with page name and timestamp
- Useful for visual regression testing

---

## 🔄 24/7 Continuous Optimization

### Architecture

The continuous optimization system runs in cycles:

```
┌────────────────────────────────────────────────────────────┐
│  Phase 1: Analysis (5 min)                                 │
│  • Team Leader uses brainstorming to analyze project       │
│  • Identifies optimization opportunities                   │
│  • Considers time-based focus and weekly themes            │
└──────────────────┬─────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────────────────────┐
│  Phase 2: Planning (5 min)                                 │
│  • Creates optimization tasks based on analysis            │
│  • Assigns to appropriate agents                           │
│  • Prioritizes by impact and effort                       │
└──────────────────┬─────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────────────────────┐
│  Phase 3: Execution (15 min)                               │
│  • Domain agents execute optimization tasks                │
│  • Bug Hunter fixes issues                                 │
│  • All changes are tracked                                 │
└──────────────────┬─────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────────────────────┐
│  Phase 4: Validation (3 min)                               │
│  • QA Specialist validates all changes                    │
│  • Uses Playwright for browser testing                     │
│  • Checks quality gates                                    │
└──────────────────┬─────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────────────────────┐
│  Phase 5: Reporting (2 min)                                │
│  • Generates JSON and Markdown reports                     │
│  • Saves to optimization_reports/                          │
│  • Tracks metrics and trends                               │
└────────────────────────────────────────────────────────────┘
                   ↓
              [Wait for next cycle]
                   ↓
              [Repeat continuously]
```

### Intelligent Scheduling

**Time-Based Focus**:
| Time | Focus Areas |
|------|-------------|
| 00-06 | Stability, bug fixes, security |
| 06-12 | Performance, testing, optimization |
| 12-18 | Features, architecture, refactoring |
| 18-24 | Review, documentation, cleanup |

**Weekly Themes**:
| Day | Theme |
|-----|-------|
| Monday | Performance optimization |
| Tuesday | Test coverage |
| Wednesday | Architecture improvements |
| Thursday | Security hardening |
| Friday | Documentation |
| Saturday | Bug bash |
| Sunday | Technical debt cleanup |

### Quality Gates

The system enforces quality standards:

```json
{
  "code_coverage_minimum": 80,
  "lighthouse_performance_minimum": 85,
  "critical_violations_maximum": 0
}
```

Changes that don't meet these gates are flagged for review.

---

## 📊 Reports and Monitoring

### Report Location

```
agent_team/optimization_reports/
├── cycle_20260215_143022.json    # Detailed JSON report
├── cycle_20260215_143022.md      # Human-readable Markdown
├── cycle_20260215_150022.json
├── cycle_20260215_150022.md
└── ...
```

### Report Contents

**Analysis Section**:
- Metrics (code coverage, issues, performance)
- Identified opportunities
- Prioritized recommendations

**Execution Section**:
- Tasks created
- Tasks completed/failed
- Per-task results

**Validation Section**:
- Playwright test results
- Screenshots captured
- Issues found
- Approval status

### Monitoring Commands

```bash
# View latest cycle report
cat agent_team/optimization_reports/cycle_$(ls -t agent_team/optimization_reports/*.json | head -1 | xargs basename)

# Watch optimization log in real-time
tail -f agent_team/continuous_optimization.log

# Count completed cycles
ls -1 agent_team/optimization_reports/cycle_*.json | wc -l
```

---

## 🚀 Getting Started

### 1. Test Advanced Features

```bash
cd agent_team
python test_advanced.py
```

This will:
- Register all 9 agents (3 advanced + 6 domain)
- Test Team Leader with brainstorming
- Test QA Specialist with Playwright
- Show results and status

### 2. Start 24/7 Optimization

```bash
cd agent_team
python start_247_optimization.py
```

**What Happens**:
- System starts optimizing immediately
- Runs continuous cycles (default: 30 min intervals)
- Generates reports after each cycle
- Runs until you stop it (Ctrl+C)

### 3. Check Progress

```bash
# View latest reports
ls -lt agent_team/optimization_reports/ | head -5

# View current cycle status
tail -20 agent_team/continuous_optimization.log

# Check Playwright tests
ls -lt agent_team/playwright_tests/
```

---

## ⚙️ Configuration

### Schedule Configuration

Edit `agent_team/schedule_config.json`:

```json
{
  "cycle_interval_minutes": 30,        // How often to run cycles
  "focus_hours": {
    "00-06": ["stability", "bug_fixes", "security"],
    "06-12": ["performance", "testing", "optimization"],
    "12-18": ["features", "architecture", "refactoring"],
    "18-24": ["review", "documentation", "cleanup"]
  },
  "quality_gates": {
    "code_coverage_minimum": 80,
    "lighthouse_performance_minimum": 85,
    "critical_violations_maximum": 0
  },
  "automation_settings": {
    "auto_fix_simple_bugs": true,
    "auto_refactor_safe_code": true,
    "auto_deploy": false  // Set to true only after thorough testing
  }
}
```

### Auto-Confirm Mode

**Enabled by default** - All decisions are made automatically:

```python
# In start_247_optimization.py
scheduler = ContinuousOptimizationScheduler(auto_confirm=True)
```

**Manual mode** - Prompts for each decision:

```python
scheduler = ContinuousOptimizationScheduler(auto_confirm=False)
```

Or via command line:
```bash
python start_247_optimization.py --manual
```

---

## 🔧 Troubleshooting

### Playwright Not Installed

```bash
npm install -D playwright
npx playwright install chromium
```

### Browser Launch Fails

Make sure the frontend dev server is running:
```bash
cd frontend
npm run dev
```

### Brainstorming Skill Not Found

The brainstorming skill should be available in your Claude Code environment. If you see errors:
1. Check that brainstorming skill is installed
2. Verify skill path in system configuration
3. Check `.claude/brainstorming_request.json` for details

### High Memory Usage

The continuous optimizer maintains logs and reports. Periodically clean up:
```bash
# Keep only last 100 cycles
cd agent_team/optimization_reports
ls -t cycle_*.json | tail -n +101 | xargs rm -f

# Clear old logs (> 7 days)
find agent_team -name "*.log" -mtime +7 -delete
```

---

## 🎯 Best Practices

### For Development

- Start with `test_advanced.py` to verify setup
- Use `demo_simple.py` for understanding basic flow
- Keep cycles short (15-30 min) for faster feedback
- Review reports regularly to catch issues early

### For Production

- Use auto-confirm mode for true 24/7 operation
- Set appropriate cycle intervals (30-60 min)
- Monitor logs and reports daily
- Keep backups before enabling `auto_deploy`
- Set up log rotation to prevent disk filling

### Safety First

- Never enable `auto_deploy` without thorough testing
- Review first few cycles manually
- Keep manual mode available for emergencies
- Maintain recent backups
- Monitor resource usage

---

## 📝 Example Output

### Console Output During Cycle

```
======================================================================
[Cycle #42] Starting optimization cycle 20260215_143022
======================================================================
[Phase 1/5] Analysis - Team Leader analyzing project...
[Scheduler] Current focus areas: performance, optimization
  Analysis Results:
    • code_coverage: 75
    • critical_issues: 2
    • performance_score: 78
[Phase 2/5] Planning - Creating optimization tasks...
  Created 5 optimization tasks
[Phase 3/5] Execution - Running optimization tasks...
  → Executing: Optimize Backend API
  → Executing: Fix critical SonarQube violations
  → Executing: Optimize Vue 3 components
  → Executing: Improve test coverage
  → Executing: Validate all changes
  Executed 5 tasks
[Phase 4/5] Validation - QA Specialist validating results...
  Validation Results:
    • Approved: true
    • Issues found: 0
[Phase 5/5] Report - Generating optimization report...
  Report saved: agent_team/optimization_reports/cycle_20260215_143022.json
  Markdown report saved: agent_team/optimization_reports/cycle_20260215_143022.md
======================================================================
[Cycle #42] Optimization cycle complete
======================================================================
[Scheduler] Waiting 30 minutes until next cycle...
```

---

## 🎉 Summary

The advanced agent team system provides:

✅ **Intelligent Analysis** - Uses brainstorming for deep insights
✅ **Automated Testing** - Playwright validates every change
✅ **Continuous Optimization** - 24/7 operation with smart scheduling
✅ **Zero Touch** - Auto-confirm mode requires no human intervention
✅ **Complete Visibility** - Detailed reports every cycle
✅ **Quality Focused** - Enforces quality gates and standards

This is a production-ready system for continuous project optimization!
