#!/bin/bash
# Correctly register local plugin WITHOUT @local suffix

set -e

PLUGIN_PATH="/home/maskkiller/dev-coffee/repos/devcoffee-agent-skills/devcoffee"
PLUGIN_NAME="devcoffee"
INSTALLED_PLUGINS="$HOME/.claude/plugins/installed_plugins.json"
SETTINGS="$HOME/.claude/settings.json"

echo "🧹 Removing old @local registration..."

# Remove old entries if they exist
jq 'del(.plugins["devcoffee@local"])' "$INSTALLED_PLUGINS" > "$INSTALLED_PLUGINS.tmp"
mv "$INSTALLED_PLUGINS.tmp" "$INSTALLED_PLUGINS"

jq 'del(.enabledPlugins["devcoffee@local"])' "$SETTINGS" > "$SETTINGS.tmp"
mv "$SETTINGS.tmp" "$SETTINGS"

echo "📝 Registering plugin as 'devcoffee' (no @local suffix)..."

# Get current timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Add the plugin entry WITHOUT @local suffix
jq --arg path "$PLUGIN_PATH" --arg ts "$TIMESTAMP" \
  '.plugins["devcoffee"] = [{
    "scope": "user",
    "installPath": $path,
    "version": "0.1.0",
    "installedAt": $ts,
    "lastUpdated": $ts,
    "gitCommitSha": ""
  }]' "$INSTALLED_PLUGINS" > "$INSTALLED_PLUGINS.tmp"

mv "$INSTALLED_PLUGINS.tmp" "$INSTALLED_PLUGINS"

# Update settings.json
echo "⚙️  Enabling plugin in settings..."
jq '.enabledPlugins["devcoffee"] = true' "$SETTINGS" > "$SETTINGS.tmp"
mv "$SETTINGS.tmp" "$SETTINGS"

echo ""
echo "✅ Plugin registered successfully as 'devcoffee'!"
echo ""
echo "📋 Registration details:"
jq '.plugins["devcoffee"]' "$INSTALLED_PLUGINS"
echo ""
echo "🔄 CRITICAL: Restart Claude Code:"
echo ""
echo "   pkill -f claude && sleep 1 && claude"
echo ""
echo "   Then test: /devcoffee:maximus or /maximus"
echo ""
