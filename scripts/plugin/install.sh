#!/bin/bash
# Install a local plugin for Claude Code development
# This properly registers it in both settings.json and installed_plugins.json

set -e

# Check dependencies
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed"
    echo "Install with: sudo apt-get install jq  # or brew install jq on macOS"
    exit 1
fi

PLUGIN_NAME="${1:-devcoffee}"
PLUGIN_PATH="${2:-$(pwd)/devcoffee}"

# Validate plugin exists
if [ ! -d "$PLUGIN_PATH" ]; then
    echo "Error: Plugin directory not found: $PLUGIN_PATH"
    exit 1
fi

if [ ! -f "$PLUGIN_PATH/.claude-plugin/plugin.json" ]; then
    echo "Error: No plugin.json found at $PLUGIN_PATH/.claude-plugin/plugin.json"
    exit 1
fi

# Validate plugin structure
echo "Validating plugin structure..."
claude plugin validate "$PLUGIN_PATH" || exit 1

# Get plugin version from plugin.json
PLUGIN_VERSION=$(jq -r '.version // "1.0.0"' "$PLUGIN_PATH/.claude-plugin/plugin.json")

PLUGIN_KEY="${PLUGIN_NAME}"
CLAUDE_DIR="$HOME/.claude"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"
INSTALLED_FILE="$CLAUDE_DIR/plugins/installed_plugins.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Ensure Claude directories exist
if [ ! -d "$CLAUDE_DIR/plugins" ]; then
    echo "Error: Claude plugins directory not found: $CLAUDE_DIR/plugins"
    echo "Please run Claude Code at least once to initialize the directory structure"
    exit 1
fi

if [ ! -f "$SETTINGS_FILE" ]; then
    echo "Error: settings.json not found: $SETTINGS_FILE"
    echo "Please run Claude Code at least once to initialize configuration"
    exit 1
fi

if [ ! -f "$INSTALLED_FILE" ]; then
    echo "Creating installed_plugins.json..."
    echo '{"plugins":{}}' > "$INSTALLED_FILE"
fi

echo "Installing plugin: $PLUGIN_KEY"
echo "  Path: $PLUGIN_PATH"
echo "  Version: $PLUGIN_VERSION"

# Create absolute path
ABSOLUTE_PATH=$(cd "$PLUGIN_PATH" && pwd)

# Backup files
cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup-$(date +%Y%m%d-%H%M%S)"
cp "$INSTALLED_FILE" "$INSTALLED_FILE.backup-$(date +%Y%m%d-%H%M%S)"

# Update settings.json - enable the plugin
echo "Updating settings.json..."
jq --arg key "$PLUGIN_KEY" \
   '.enabledPlugins[$key] = true' \
   "$SETTINGS_FILE" > "$SETTINGS_FILE.tmp" && mv "$SETTINGS_FILE.tmp" "$SETTINGS_FILE"

# Update installed_plugins.json - register the plugin
echo "Updating installed_plugins.json..."
jq --arg key "$PLUGIN_KEY" \
   --arg path "$ABSOLUTE_PATH" \
   --arg version "$PLUGIN_VERSION" \
   --arg timestamp "$TIMESTAMP" \
   '.plugins[$key] = [{
     "scope": "user",
     "installPath": $path,
     "version": $version,
     "installedAt": $timestamp,
     "lastUpdated": $timestamp,
     "gitCommitSha": ""
   }]' \
   "$INSTALLED_FILE" > "$INSTALLED_FILE.tmp" && mv "$INSTALLED_FILE.tmp" "$INSTALLED_FILE"

echo ""
echo "✓ Plugin installed successfully!"
echo ""
echo "IMPORTANT: Restart Claude Code for commands/agents to be discovered:"
echo "  pkill -f claude && claude"
echo ""
echo "Then test with:"
echo "  /devcoffee:maximus    # Full command name"
echo "  /maximus              # Short name (if no conflicts)"
echo ""
echo "To uninstall:"
echo "  claude plugin uninstall $PLUGIN_NAME"
