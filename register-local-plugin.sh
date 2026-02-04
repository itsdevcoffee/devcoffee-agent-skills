#!/bin/bash
# Manually register local plugin in Claude Code

set -e

PLUGIN_PATH="/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee"
PLUGIN_NAME="devcoffee"
INSTALLED_PLUGINS="$HOME/.claude/plugins/installed_plugins.json"
SETTINGS="$HOME/.claude/settings.json"

echo "📝 Manually registering local plugin..."
echo ""

# Backup files
echo "💾 Creating backups..."
cp "$INSTALLED_PLUGINS" "$INSTALLED_PLUGINS.backup"
cp "$SETTINGS" "$SETTINGS.backup"

# Get current timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Read current installed_plugins.json
echo "📝 Updating installed_plugins.json..."

# Add the plugin entry using jq
jq --arg path "$PLUGIN_PATH" --arg ts "$TIMESTAMP" \
  '.plugins["devcoffee@local"] = [{
    "scope": "user",
    "installPath": $path,
    "version": "0.1.0",
    "installedAt": $ts,
    "lastUpdated": $ts,
    "gitCommitSha": "",
    "isLocal": true
  }]' "$INSTALLED_PLUGINS" > "$INSTALLED_PLUGINS.tmp"

mv "$INSTALLED_PLUGINS.tmp" "$INSTALLED_PLUGINS"

# Update settings.json
echo "⚙️  Updating settings.json..."
jq '.enabledPlugins["devcoffee@local"] = true' "$SETTINGS" > "$SETTINGS.tmp"
mv "$SETTINGS.tmp" "$SETTINGS"

echo ""
echo "✅ Plugin registered successfully!"
echo ""
echo "📋 Registration details:"
jq '.plugins["devcoffee@local"]' "$INSTALLED_PLUGINS"
echo ""
echo "🔄 IMPORTANT: You MUST restart Claude Code for changes to take effect:"
echo ""
echo "   1. Close ALL Claude Code sessions"
echo "   2. Run: pkill -f claude"
echo "   3. Start fresh: claude"
echo "   4. Test: /devcoffee:maximus"
echo ""
echo "💾 Backups saved:"
echo "   - $INSTALLED_PLUGINS.backup"
echo "   - $SETTINGS.backup"
echo ""
