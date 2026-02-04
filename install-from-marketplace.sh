#!/bin/bash
# Install devcoffee plugin from local marketplace

set -e

REPO_PATH="/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills"

echo "🧹 Cleaning up old registrations..."

# Remove old entries from installed_plugins.json
jq 'del(.plugins["devcoffee"]) | del(.plugins["devcoffee@local"])' \
  ~/.claude/plugins/installed_plugins.json > /tmp/installed_plugins.json
mv /tmp/installed_plugins.json ~/.claude/plugins/installed_plugins.json

# Remove old entries from settings.json
jq 'del(.enabledPlugins["devcoffee"]) | del(.enabledPlugins["devcoffee@local"])' \
  ~/.claude/settings.json > /tmp/settings.json
mv /tmp/settings.json ~/.claude/settings.json

echo "✅ Cleanup complete"
echo ""
echo "📝 Next steps - Run these commands in Claude Code:"
echo ""
echo "   /plugin marketplace add $REPO_PATH"
echo "   /plugin install devcoffee@devcoffee-marketplace"
echo "   /devcoffee:maximus"
echo ""
echo "Or run interactively:"
echo ""

# Check if we're in an interactive shell
if [ -t 0 ]; then
    read -p "Start Claude Code now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "🚀 Starting Claude Code..."
        echo "   After it starts, run:"
        echo "   /plugin marketplace add $REPO_PATH"
        echo "   /plugin install devcoffee@devcoffee-marketplace"
        echo ""
        claude
    fi
else
    echo "Run 'claude' and execute the commands above"
fi
