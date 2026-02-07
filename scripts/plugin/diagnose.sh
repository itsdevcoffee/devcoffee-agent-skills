#!/bin/bash
# Diagnostic script for devcoffee plugin discovery issues

PLUGIN_PATH="/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee"

echo "🔍 Claude Code Plugin Discovery Diagnostics"
echo "==========================================="
echo ""

echo "📌 Claude Code Version:"
claude --version
echo ""

echo "📌 Plugin Structure:"
tree -L 2 "$PLUGIN_PATH" 2>/dev/null || find "$PLUGIN_PATH" -maxdepth 2 -type f
echo ""

echo "📌 Plugin Validation:"
claude plugin validate "$PLUGIN_PATH"
echo ""

echo "📌 Installed Plugins:"
claude plugin list | grep -A 5 "devcoffee" || echo "❌ devcoffee not found in plugin list"
echo ""

echo "📌 Plugin Registration in installed_plugins.json:"
cat ~/.claude/plugins/installed_plugins.json | jq '.["devcoffee@local"]' 2>/dev/null || echo "❌ Not found in installed_plugins.json"
echo ""

echo "📌 Plugin Enabled in settings.json:"
cat ~/.claude/settings.json | jq '.enabledPlugins["devcoffee@local"]' 2>/dev/null || echo "❌ Not enabled in settings.json"
echo ""

echo "📌 Command File Structure:"
echo "commands/maximus.md frontmatter:"
head -10 "$PLUGIN_PATH/commands/maximus.md"
echo ""

echo "📌 Agent File Structure:"
echo "agents/maximus.md frontmatter:"
head -10 "$PLUGIN_PATH/agents/maximus.md"
echo ""

echo "📌 Checking for conflicts:"
echo "Other plugins with 'maximus' command:"
grep -r "maximus" ~/.claude/plugins/ 2>/dev/null | grep -v "devcoffee" | head -5 || echo "✅ No conflicts found"
echo ""

echo "==========================================="
echo "✅ Diagnostics complete!"
echo ""
echo "💡 Common Issues:"
echo "   1. Session not restarted after plugin installation"
echo "   2. Plugin installed but Claude Code still running"
echo "   3. Trying to use --plugin-dir with installed plugin"
echo ""
echo "🔧 Recommended Fix:"
echo "   1. Run: ./reinstall-plugin.sh"
echo "   2. Close ALL terminals completely"
echo "   3. Open fresh terminal"
echo "   4. Run: claude"
echo "   5. Test: /devcoffee:maximus"
echo ""
