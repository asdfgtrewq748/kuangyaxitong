#!/bin/bash
# Monitor Agent Team Progress

echo "======================================================================"
echo "Agent Team Progress Monitor"
echo "======================================================================"
echo ""
echo "Running 10 optimization cycles..."
echo "Each cycle takes ~30 minutes"
echo "Total estimated time: ~5 hours"
echo ""
echo "Press Ctrl+C to stop at any time"
echo ""
echo "======================================================================"
echo ""

# Run the agent team
cd agent_team
python run_n_cycles.py 10
