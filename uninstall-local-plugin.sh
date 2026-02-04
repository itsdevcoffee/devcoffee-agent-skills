#!/bin/bash
# Uninstall a local plugin from Claude Code
# This removes it from both settings.json and installed_plugins.json

set -e

PLUGIN_NAME="${1:-devcoffee}"
MARKETPLACE="local"
PLUGIN_KEY="${PLUGIN_NAME}@${MARKETPLACE}"

CLAUDE_DIR="$HOME/.claude"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"
INSTALLED_FILE="$CLAUDE_DIR/plugins/installed_plugins.json"

echo "Uninstalling plugin: $PLUGIN_KEY"

# Backup files
cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup-$(date +%Y%m%d-%H%M%S)"
cp "$INSTALLED_FILE" "$INSTALLED_FILE.backup-$(date +%Y%m%d-%H%M%S)"

# Remove from settings.json
echo "Removing from settings.json..."
jq --arg key "$PLUGIN_KEY" \
   'del(.enabledPlugins[$key])' \
   "$SETTINGS_FILE" > "$SETTINGS_FILE.tmp" && mv "$SETTINGS_FILE.tmp" "$SETTINGS_FILE"

# Remove from installed_plugins.json
echo "Removing from installed_plugins.json..."
jq --arg key "$PLUGIN_KEY" \
   'del(.plugins[$key])' \
   "$INSTALLED_FILE" > "$INSTALLED_FILE.tmp" && mv "$INSTALLED_FILE.tmp" "$INSTALLED_FILE"

echo ""
echo "✓ Plugin uninstalled successfully!"
echo ""
echo "The plugin has been removed. Restart Claude if it's running."
