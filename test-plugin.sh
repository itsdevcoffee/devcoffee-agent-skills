#!/bin/bash
# Test local plugin with --plugin-dir

PLUGIN_PATH="/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee"

echo "🧪 Testing devcoffee plugin locally..."
echo ""
echo "Starting Claude Code with --plugin-dir flag..."
echo "Commands should be available as:"
echo "  /devcoffee:maximus"
echo "  /maximus"
echo ""
echo "Press Ctrl+C to exit when done testing."
echo ""

claude --plugin-dir "$PLUGIN_PATH"
