#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Run N Optimization Cycles

This script runs a specific number of optimization cycles
and then stops automatically.
"""

import asyncio
import sys
import os
from pathlib import Path
from datetime import datetime

# Set UTF-8 encoding
if sys.platform == "win32":
    os.system("chcp 65001 > nul")

sys.path.insert(0, str(Path(__file__).parent))

from continuous_optimization import ContinuousOptimizationScheduler
from agent_team.agents_advanced import create_advanced_agents
from agent_team.agents import create_domain_agents
import logging

logger = logging.getLogger(__name__)
import logging

logger = logging.getLogger(__name__)


class LimitedCycleScheduler(ContinuousOptimizationScheduler):
    """Scheduler that runs a specific number of cycles"""

    def __init__(self, max_cycles: int, auto_confirm: bool = True):
        super().__init__(auto_confirm=auto_confirm)
        self.max_cycles = max_cycles

    async def start(self):
        """Start optimization loop with cycle limit"""
        self.is_running = True

        print("=" * 70)
        print("24/7 Continuous Optimization - Limited Cycles")
        print("=" * 70)
        print(f"\nConfiguration:")
        print(f"  - Max cycles: {self.max_cycles}")
        print(f"  - Cycle interval: {self.schedule_config.get('cycle_interval_minutes', 30)} minutes")
        print(f"  - Auto-confirm: {self.auto_confirm}")
        print(f"  - Reports: {self.reports_dir}")
        print("\nAdvanced Features:")
        print("  - Team Leader: brainstorming skill")
        print("  - QA Specialist: Playwright browser testing")
        print("  - Intelligent scheduling")
        print("  - Quality gates enforcement")
        print("=" * 70 + "\n")

        # Register all agents
        logger.info("[Scheduler] Registering agents...")
        advanced_agents = create_advanced_agents(auto_confirm=self.auto_confirm)
        for agent in advanced_agents:
            self.coordinator.register_agent(agent)
            logger.info(f"  + Registered advanced agent: {agent.config.name}")

        domain_agents = create_domain_agents()
        for agent in domain_agents:
            self.coordinator.register_agent(agent)
            logger.info(f"  + Registered domain agent: {agent.config.name}")

        # Start coordinator
        await self.coordinator.start()

        # Run limited cycles
        while self.is_running and self.cycle_count < self.max_cycles:
            try:
                await self._run_optimization_cycle()

                # Check if we should continue
                if self.cycle_count >= self.max_cycles:
                    logger.info(f"[Scheduler] Completed {self.max_cycles} cycles. Stopping.")
                    break

                # Wait for next cycle
                interval_minutes = self.schedule_config.get("cycle_interval_minutes", 30)
                remaining_cycles = self.max_cycles - self.cycle_count

                logger.info(f"[Scheduler] Waiting {interval_minutes} minutes until next cycle...")
                logger.info(f"[Scheduler] Cycles remaining: {remaining_cycles}/{self.max_cycles}")

                # Sleep in small increments
                for _ in range(interval_minutes * 60):
                    if not self.is_running:
                        break
                    await asyncio.sleep(1)

            except Exception as e:
                logger.error(f"[Scheduler] Error in optimization cycle: {e}")
                await asyncio.sleep(60)  # Wait 1 minute before retry

        # Shutdown
        logger.info("[Scheduler] All cycles completed. Shutting down...")
        await self.coordinator.stop()

        # Final summary
        print("\n" + "=" * 70)
        print("OPTIMIZATION COMPLETE")
        print("=" * 70)
        print(f"\nTotal cycles completed: {self.cycle_count}/{self.max_cycles}")
        print(f"Reports directory: {self.reports_dir}")
        print(f"Test artifacts: test_artifacts/")
        print("\nView reports:")
        print(f"  cat {self.reports_dir}/cycle_*.md | tail -100")
        print("=" * 70 + "\n")


async def main():
    """Main entry point"""
    # Parse command line arguments
    max_cycles = 10  # Default to 10 cycles
    auto_confirm = True

    if "--manual" in sys.argv:
        auto_confirm = False

    # Try to get cycle count from argument
    for arg in sys.argv[1:]:
        if arg.isdigit():
            max_cycles = int(arg)
            break

    scheduler = LimitedCycleScheduler(max_cycles=max_cycles, auto_confirm=auto_confirm)

    try:
        await scheduler.start()
    except KeyboardInterrupt:
        print("\n\n[STOPPED] Optimization stopped by user")
    except Exception as e:
        print(f"\n\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
