#!/bin/bash
# Clean reinstall of devcoffee plugin

set -e

PLUGIN_PATH="/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee"

echo "🧹 Uninstalling devcoffee plugin..."
claude plugin uninstall devcoffee@local 2>/dev/null || true

echo "⏳ Waiting for cleanup..."
sleep 1

echo "📦 Validating plugin structure..."
claude plugin validate "$PLUGIN_PATH"

echo "🔧 Installing plugin..."
claude plugin install "$PLUGIN_PATH"

echo "✅ Enabling plugin..."
claude plugin enable devcoffee

echo ""
echo "✨ Plugin reinstalled!"
echo ""
echo "📝 Next steps:"
echo "   1. Close this terminal completely"
echo "   2. Open a new terminal"
echo "   3. Run: claude"
echo "   4. Test: /devcoffee:maximus or /maximus"
echo ""
