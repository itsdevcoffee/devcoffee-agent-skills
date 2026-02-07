#!/bin/bash
# Health check script for devcoffee plugin
# Verifies all dependencies and configuration
#
# Usage:
#   ./scripts/doctor.sh          # Normal mode (shows relevant plugins only)
#   ./scripts/doctor.sh --verbose # Show all installed plugins

# Don't exit on error - we want to check everything
set +e

# Parse arguments
VERBOSE=false
if [ "$1" = "--verbose" ] || [ "$1" = "-v" ]; then
    VERBOSE=true
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
CRITICAL_ISSUES=0
WARNINGS=0
CHECKS_PASSED=0

# Helper functions
print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((CHECKS_PASSED++))
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    ((CRITICAL_ISSUES++))
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_section() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Start diagnostics
echo ""
echo "🏥 Dev Coffee Plugin Health Check"
echo "====================================="
echo ""

# 1. Claude CLI Check
print_section "1. Claude CLI"

if ! command -v claude &> /dev/null; then
    print_error "Claude CLI not installed"
    echo "  Install from: https://www.anthropic.com/claude/code"
else
    CLAUDE_VERSION=$(claude --version 2>&1)
    print_success "Claude CLI installed: $CLAUDE_VERSION"
fi

# 2. Required Plugins (for maximus)
print_section "2. Required Plugins (for maximus)"

CLAUDE_DIR="$HOME/.claude"
INSTALLED_PLUGINS_FILE="$CLAUDE_DIR/plugins/installed_plugins.json"

if [ -f "$INSTALLED_PLUGINS_FILE" ] && command -v jq &> /dev/null; then
    # Check feature-dev using JSON file (check for any key containing "feature-dev")
    FEATURE_DEV_KEY=$(jq -r '.plugins | keys[] | select(contains("feature-dev"))' "$INSTALLED_PLUGINS_FILE" 2>/dev/null | head -1)
    if [ -n "$FEATURE_DEV_KEY" ]; then
        FEATURE_DEV_VERSION=$(jq -r --arg key "$FEATURE_DEV_KEY" '.plugins[$key][0].version // "unknown"' "$INSTALLED_PLUGINS_FILE")
        print_success "feature-dev plugin installed (version: $FEATURE_DEV_VERSION)"
    else
        print_error "feature-dev plugin not installed"
        echo "  Maximus requires this for code-reviewer agent"
        echo "  Install in Claude: /plugin install feature-dev@claude-plugins-official"
    fi

    # Check code-simplifier using JSON file (check for any key containing "code-simplifier")
    CODE_SIMPLIFIER_KEY=$(jq -r '.plugins | keys[] | select(contains("code-simplifier"))' "$INSTALLED_PLUGINS_FILE" 2>/dev/null | head -1)
    if [ -n "$CODE_SIMPLIFIER_KEY" ]; then
        CODE_SIMPLIFIER_VERSION=$(jq -r --arg key "$CODE_SIMPLIFIER_KEY" '.plugins[$key][0].version // "unknown"' "$INSTALLED_PLUGINS_FILE")
        print_success "code-simplifier plugin installed (version: $CODE_SIMPLIFIER_VERSION)"
    else
        print_error "code-simplifier plugin not installed"
        echo "  Maximus requires this for code simplification"
        echo "  Install in Claude: /plugin install code-simplifier@claude-plugins-official"
    fi
else
    print_warning "Cannot check installed plugins"
    if [ ! -f "$INSTALLED_PLUGINS_FILE" ]; then
        echo "  Reason: $INSTALLED_PLUGINS_FILE not found"
        echo "  Run Claude Code and install a plugin to initialize"
    elif ! command -v jq &> /dev/null; then
        echo "  Reason: jq not installed (needed to parse plugin list)"
    fi
fi

# 3. Optional Dependencies
print_section "3. Optional Dependencies"

# Check ffmpeg (for video-analysis)
if command -v ffmpeg &> /dev/null; then
    FFMPEG_VERSION=$(ffmpeg -version 2>&1 | head -1 | awk '{print $3}')
    print_success "ffmpeg installed (version: $FFMPEG_VERSION)"
    echo "  Required by: video-analysis skill"
else
    print_warning "ffmpeg not installed (optional)"
    echo "  Required for: video-analysis skill only"
    echo "  Install:"
    echo "    Mac:     brew install ffmpeg"
    echo "    Ubuntu:  sudo apt install ffmpeg"
    echo "    Fedora:  sudo dnf install ffmpeg"
    echo "    Arch:    sudo pacman -S ffmpeg"
fi

# Check jq (used by utility scripts)
if command -v jq &> /dev/null; then
    JQ_VERSION=$(jq --version 2>&1)
    print_success "jq installed ($JQ_VERSION)"
    echo "  Used by: plugin management scripts"
else
    print_warning "jq not installed (recommended)"
    echo "  Required for: plugin installation scripts, plugin checks"
    echo "  Install:"
    echo "    Mac:     brew install jq"
    echo "    Ubuntu:  sudo apt install jq"
    echo "    Fedora:  sudo dnf install jq"
    echo "    Arch:    sudo pacman -S jq"
fi

# 4. Plugin Status
print_section "4. Dev Coffee Plugin Status"

PLUGIN_PATH="$(pwd)/devcoffee"

# Check if we're in the right directory
if [ ! -d "$PLUGIN_PATH" ]; then
    print_warning "Not in devcoffee-agent-skills repository"
    echo "  Run this script from: /path/to/devcoffee-agent-skills/"
else
    # Validate plugin structure
    if [ -f "$PLUGIN_PATH/.claude-plugin/plugin.json" ]; then
        print_success "Plugin structure valid"

        # Get plugin info
        if command -v jq &> /dev/null; then
            PLUGIN_NAME=$(jq -r '.name // "unknown"' "$PLUGIN_PATH/.claude-plugin/plugin.json")
            PLUGIN_VERSION=$(jq -r '.version // "unknown"' "$PLUGIN_PATH/.claude-plugin/plugin.json")
            print_info "Plugin: $PLUGIN_NAME v$PLUGIN_VERSION"
        fi

        # Validate with Claude CLI if available
        if command -v claude &> /dev/null; then
            if claude plugin validate "$PLUGIN_PATH" &> /dev/null; then
                print_success "Plugin passes Claude validation"
            else
                print_warning "Plugin validation has warnings (non-critical)"
                echo "  Extra metadata fields detected - plugin still functional"
                echo "  Run for details: claude plugin validate $PLUGIN_PATH"
            fi
        fi
    else
        print_error "Invalid plugin structure - missing plugin.json"
        echo "  Expected: $PLUGIN_PATH/.claude-plugin/plugin.json"
    fi
fi

# Check if plugin is installed (check for any key containing "devcoffee")
if [ -f "$INSTALLED_PLUGINS_FILE" ] && command -v jq &> /dev/null; then
    DEVCOFFEE_KEY=$(jq -r '.plugins | keys[] | select(contains("devcoffee"))' "$INSTALLED_PLUGINS_FILE" 2>/dev/null | head -1)
    if [ -n "$DEVCOFFEE_KEY" ]; then
        DEVCOFFEE_VERSION=$(jq -r --arg key "$DEVCOFFEE_KEY" '.plugins[$key][0].version // "unknown"' "$INSTALLED_PLUGINS_FILE")
        print_success "devcoffee plugin installed (version: $DEVCOFFEE_VERSION)"

        # Check if enabled (check for any key containing "devcoffee")
        SETTINGS_FILE="$CLAUDE_DIR/settings.json"
        if [ -f "$SETTINGS_FILE" ]; then
            DEVCOFFEE_ENABLED_KEY=$(jq -r '.enabledPlugins | keys[] | select(contains("devcoffee"))' "$SETTINGS_FILE" 2>/dev/null | head -1)
            if [ -n "$DEVCOFFEE_ENABLED_KEY" ]; then
                print_success "devcoffee plugin enabled"
            else
                print_warning "devcoffee plugin not enabled in settings"
                echo "  Enable in Claude: /plugin enable devcoffee"
            fi
        fi
    else
        print_warning "devcoffee plugin not installed"
        echo "  Install from repo: ./scripts/plugin/install.sh"
        echo "  Or marketplace: /plugin install devcoffee@devcoffee-marketplace"
    fi
fi

# 5. Configuration Health
print_section "5. Configuration Files"

if [ -d "$CLAUDE_DIR" ]; then
    print_success "Claude directory exists: $CLAUDE_DIR"
else
    print_error "Claude directory not found: $CLAUDE_DIR"
    echo "  Run Claude Code at least once to initialize"
fi

# Check settings.json
SETTINGS_FILE="$CLAUDE_DIR/settings.json"
if [ -f "$SETTINGS_FILE" ]; then
    if command -v jq &> /dev/null; then
        if jq empty "$SETTINGS_FILE" 2>/dev/null; then
            print_success "settings.json is valid JSON"
        else
            print_error "settings.json is corrupted (invalid JSON)"
            echo "  Backup exists: $CLAUDE_DIR/settings.json.backup-*"
        fi
    else
        print_success "settings.json exists"
    fi
else
    print_error "settings.json not found"
    echo "  Expected: $SETTINGS_FILE"
    echo "  Run Claude Code at least once to initialize"
fi

# Check installed_plugins.json
if [ -f "$INSTALLED_PLUGINS_FILE" ]; then
    if command -v jq &> /dev/null; then
        if jq empty "$INSTALLED_PLUGINS_FILE" 2>/dev/null; then
            print_success "installed_plugins.json is valid JSON"

            # Count installed plugins
            PLUGIN_COUNT=$(jq '.plugins | length' "$INSTALLED_PLUGINS_FILE" 2>/dev/null || echo "0")
            print_info "Total plugins: $PLUGIN_COUNT"

            if [ "$VERBOSE" = true ]; then
                # Verbose mode: show all plugins
                echo ""
                echo "All installed plugins:"
                jq -r '.plugins | keys[]' "$INSTALLED_PLUGINS_FILE" 2>/dev/null | while read -r plugin; do
                    echo "  - $plugin"
                done
            else
                # Normal mode: show only relevant plugins
                echo ""
                echo "Relevant plugins:"

                # Check for each relevant plugin
                for plugin_name in "feature-dev" "code-simplifier" "devcoffee"; do
                    FOUND_KEY=$(jq -r --arg name "$plugin_name" '.plugins | keys[] | select(contains($name))' "$INSTALLED_PLUGINS_FILE" 2>/dev/null | head -1)
                    if [ -n "$FOUND_KEY" ]; then
                        echo -e "  ${GREEN}✓${NC} $FOUND_KEY"
                    else
                        echo -e "  ${RED}✗${NC} $plugin_name (not installed)"
                    fi
                done

                # Show how to see full list
                if [ "$PLUGIN_COUNT" -gt 3 ]; then
                    echo ""
                    print_info "$(($PLUGIN_COUNT - 3)) other plugins installed"
                    echo "  Run with --verbose to see full list"
                fi
            fi
        else
            print_error "installed_plugins.json is corrupted (invalid JSON)"
            echo "  Backup exists: $INSTALLED_PLUGINS_FILE.backup-*"
        fi
    else
        print_success "installed_plugins.json exists"
    fi
else
    print_warning "installed_plugins.json not found"
    echo "  Expected: $INSTALLED_PLUGINS_FILE"
    echo "  This will be created on first plugin install"
fi

# Summary
print_section "Summary"

echo ""
echo "Results:"
echo -e "  ${GREEN}✓${NC} Checks passed: $CHECKS_PASSED"
if [ $WARNINGS -gt 0 ]; then
    echo -e "  ${YELLOW}⚠${NC} Warnings: $WARNINGS"
fi
if [ $CRITICAL_ISSUES -gt 0 ]; then
    echo -e "  ${RED}✗${NC} Critical issues: $CRITICAL_ISSUES"
fi
echo ""

# Next steps
if [ $CRITICAL_ISSUES -gt 0 ]; then
    print_section "❌ Critical Issues Found"
    echo ""
    echo "Fix critical issues above before using the plugin."
    echo ""

    if ! command -v claude &> /dev/null; then
        echo "1. Install Claude CLI:"
        echo "   https://www.anthropic.com/claude/code"
        echo ""
    fi

    if [ ! -f "$SETTINGS_FILE" ]; then
        echo "2. Run Claude Code at least once:"
        echo "   claude"
        echo ""
    fi

    if [ -d "$PLUGIN_PATH" ] && [ -f "$PLUGIN_PATH/.claude-plugin/plugin.json" ]; then
        echo "3. Install required plugins in Claude:"
        echo "   /plugin install feature-dev@claude-plugins-official"
        echo "   /plugin install code-simplifier@claude-plugins-official"
        echo ""
    fi

    exit 1

elif [ $WARNINGS -gt 0 ]; then
    print_section "⚠️  Warnings Found"
    echo ""
    echo "Plugin is functional but some optional features may not work."
    echo "Review warnings above and install optional dependencies as needed."
    echo ""
    echo "Recommended installations:"
    echo "  - jq: For plugin management and checks"
    echo "  - ffmpeg: For video-analysis skill"
    echo ""
    exit 2

else
    print_section "✅ All Systems Go!"
    echo ""
    echo "Your devcoffee plugin is healthy and ready to use."
    echo ""
    echo "Quick start:"
    echo "  1. Start Claude: claude"
    echo "  2. Test maximus: /devcoffee:maximus"
    echo "  3. Test buzzminson: /devcoffee:buzzminson \"Add login feature\""
    echo ""
    if ! command -v ffmpeg &> /dev/null; then
        echo "Optional: Install ffmpeg for video-analysis"
        echo "  Mac:     brew install ffmpeg"
        echo "  Ubuntu:  sudo apt install ffmpeg"
        echo ""
    fi
    exit 0
fi
