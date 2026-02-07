#!/bin/bash
# Dev Coffee Plugin Setup Script
# Automates installation of all dependencies with cross-platform support
#
# Usage:
#   ./scripts/setup.sh              # Interactive mode (default)
#   ./scripts/setup.sh --auto       # Auto mode (no prompts)
#   ./scripts/setup.sh --dry-run    # Show what would be installed
#   ./scripts/setup.sh --minimal    # Only required dependencies

# Exit on unhandled errors (we handle specific errors explicitly)
set -e

# === Script Path Resolution ===
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
PLUGIN_DIR="$REPO_DIR/devcoffee"
DOCTOR_SCRIPT="$SCRIPT_DIR/doctor.sh"

# === Colors ===
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# === Counters ===
INSTALLED=0
SKIPPED=0
FAILED=0
FAILED_PACKAGES=()
FAILED_PLUGINS=()

# === Flags ===
AUTO_MODE=false
DRY_RUN=false
MINIMAL=false
SKIP_SYSTEM_DEPS=false
VERBOSE=false

# === System Detection Variables ===
OS=""
OS_NAME=""
PKG_MANAGER=""
INSTALL_CMD=""
SUDO_REQUIRED=false

# === Helper Functions ===
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
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

print_header() {
    echo ""
    echo -e "${CYAN}${BOLD}🔧 Dev Coffee Setup${NC}"
    echo "======================"
    echo ""
}

show_help() {
    cat << EOF
Dev Coffee Plugin Setup Script

Usage:
  ./scripts/setup.sh [OPTIONS]

Options:
  --auto          Auto mode - no prompts, install everything
  --dry-run       Show what would be installed without installing
  --minimal       Install only required dependencies (skip ffmpeg)
  --verbose       Show detailed output
  -h, --help      Show this help message

Examples:
  ./scripts/setup.sh              # Interactive setup (recommended)
  ./scripts/setup.sh --auto       # Automated setup for CI/CD
  ./scripts/setup.sh --dry-run    # Preview installation plan
  ./scripts/setup.sh --minimal    # Minimal installation

EOF
}

# === System Detection ===
detect_system() {
    print_section "Detecting System"

    # Detect OS and package manager
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        PKG_MANAGER="brew"
        INSTALL_CMD="brew install"
        SUDO_REQUIRED=false
        print_info "Detected: macOS"

        # Check if Homebrew is installed
        if ! command -v brew &> /dev/null; then
            print_warning "Homebrew not installed"
            PKG_MANAGER="none"
        else
            BREW_VERSION=$(brew --version | head -1)
            print_info "Package manager: Homebrew ($BREW_VERSION)"
        fi

    elif [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS="linux"
        OS_NAME="$ID"

        case "$ID" in
            ubuntu|debian|pop)
                PKG_MANAGER="apt"
                INSTALL_CMD="sudo apt install -y"
                SUDO_REQUIRED=true
                print_info "Detected: $PRETTY_NAME"
                print_info "Package manager: apt"
                ;;
            fedora|rhel|centos)
                PKG_MANAGER="dnf"
                INSTALL_CMD="sudo dnf install -y"
                SUDO_REQUIRED=true
                print_info "Detected: $PRETTY_NAME"
                print_info "Package manager: dnf"
                ;;
            arch|manjaro)
                PKG_MANAGER="pacman"
                INSTALL_CMD="sudo pacman -S --noconfirm"
                SUDO_REQUIRED=true
                print_info "Detected: $PRETTY_NAME"
                print_info "Package manager: pacman"
                ;;
            *)
                PKG_MANAGER="unknown"
                print_warning "Unknown Linux distribution: $PRETTY_NAME"
                ;;
        esac
    else
        OS="unknown"
        PKG_MANAGER="unknown"
        print_warning "Unknown operating system"
    fi
}

# === Pre-flight Checks ===
check_prerequisites() {
    print_section "Pre-flight Checks"

    # Critical: Claude CLI must be installed
    if ! command -v claude &> /dev/null; then
        print_error "Claude CLI not installed"
        echo ""
        echo "Install Claude Code first:"
        echo "  https://claude.ai/download"
        echo ""
        echo "After installing Claude Code, run this script again."
        exit 1
    else
        CLAUDE_VERSION=$(claude --version 2>&1)
        print_success "Claude CLI installed: $CLAUDE_VERSION"
    fi

    # Critical: Must be in correct directory
    if [ ! -d "$PLUGIN_DIR" ] || [ ! -f "$PLUGIN_DIR/.claude-plugin/plugin.json" ]; then
        print_error "Not in devcoffee-agent-skills repository"
        echo ""
        echo "Run this script from the repository root:"
        echo "  cd /path/to/devcoffee-agent-skills"
        echo "  ./scripts/setup.sh"
        exit 1
    else
        print_success "Repository structure valid"
    fi

    # Check if doctor.sh exists
    if [ ! -f "$DOCTOR_SCRIPT" ]; then
        print_warning "doctor.sh not found (won't be able to verify installation)"
    else
        print_success "doctor.sh found"
    fi

    # Check sudo access (Linux only) - Skip in dry-run mode
    if [ "$SUDO_REQUIRED" = true ] && [ "$DRY_RUN" = false ]; then
        if ! sudo -n true 2>/dev/null; then
            print_warning "Sudo access required for system package installation"
            echo ""
            if [ "$AUTO_MODE" = false ]; then
                echo "Options:"
                echo "  1. Run: sudo -v  (to cache sudo credentials)"
                echo "  2. Skip system dependencies (install manually later)"
                echo ""
                read -p "Continue without system dependencies? [y/N] " -n 1 -r
                echo ""
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    SKIP_SYSTEM_DEPS=true
                    print_warning "Skipping system dependencies"
                else
                    echo "Please run 'sudo -v' and try again"
                    exit 1
                fi
            else
                print_warning "Auto mode: skipping system dependencies (no sudo access)"
                SKIP_SYSTEM_DEPS=true
            fi
        else
            print_success "Sudo access confirmed"
        fi
    elif [ "$SUDO_REQUIRED" = true ] && [ "$DRY_RUN" = true ]; then
        print_info "Dry-run mode: sudo check skipped"
    fi
}

# === Show Installation Plan ===
show_installation_plan() {
    print_section "Installation Plan"

    echo ""
    echo "The following will be installed:"
    echo ""

    # System Dependencies
    if [ "$SKIP_SYSTEM_DEPS" = false ] && [ "$PKG_MANAGER" != "none" ] && [ "$PKG_MANAGER" != "unknown" ]; then
        echo "System Dependencies (via $PKG_MANAGER):"

        if [ "$MINIMAL" = false ]; then
            if ! command -v ffmpeg &> /dev/null; then
                echo "  • ffmpeg (for video-analysis skill)"
            else
                echo "  • ffmpeg (already installed, skip)"
            fi
        fi

        if ! command -v jq &> /dev/null; then
            echo "  • jq (for plugin management)"
        else
            echo "  • jq (already installed, skip)"
        fi
        echo ""
    elif [ "$PKG_MANAGER" = "none" ]; then
        echo "System Dependencies:"
        echo "  ⚠ Homebrew not installed - will prompt to install"
        echo ""
    elif [ "$PKG_MANAGER" = "unknown" ]; then
        echo "System Dependencies:"
        echo "  ⚠ Unknown package manager - manual installation required"
        echo ""
    else
        echo "System Dependencies:"
        echo "  ⚠ Skipped (no sudo access)"
        echo ""
    fi

    # Claude Plugins
    echo "Claude Plugins:"

    INSTALLED_PLUGINS_FILE="$HOME/.claude/plugins/installed_plugins.json"

    # Check feature-dev
    if [ -f "$INSTALLED_PLUGINS_FILE" ] && command -v jq &> /dev/null; then
        FEATURE_DEV_KEY=$(jq -r '.plugins | keys[] | select(contains("feature-dev"))' "$INSTALLED_PLUGINS_FILE" 2>/dev/null | head -1)
        if [ -n "$FEATURE_DEV_KEY" ]; then
            echo "  • feature-dev@claude-plugins-official (already installed, skip)"
        else
            echo "  • feature-dev@claude-plugins-official"
        fi

        # Check code-simplifier
        CODE_SIMPLIFIER_KEY=$(jq -r '.plugins | keys[] | select(contains("code-simplifier"))' "$INSTALLED_PLUGINS_FILE" 2>/dev/null | head -1)
        if [ -n "$CODE_SIMPLIFIER_KEY" ]; then
            echo "  • code-simplifier@claude-plugins-official (already installed, skip)"
        else
            echo "  • code-simplifier@claude-plugins-official"
        fi
    else
        echo "  • feature-dev@claude-plugins-official"
        echo "  • code-simplifier@claude-plugins-official"
    fi
    echo ""

    # Local Plugin
    echo "Local Plugin:"
    if command -v jq &> /dev/null && [ -f "$PLUGIN_DIR/.claude-plugin/plugin.json" ]; then
        PLUGIN_VERSION=$(jq -r '.version // "unknown"' "$PLUGIN_DIR/.claude-plugin/plugin.json")
        echo "  • devcoffee v$PLUGIN_VERSION (from ./devcoffee)"
    else
        echo "  • devcoffee (from ./devcoffee)"
    fi
    echo ""
}

# === Confirm Installation ===
confirm_installation() {
    if [ "$DRY_RUN" = true ]; then
        echo "Dry-run mode - exiting without changes"
        exit 0
    fi

    echo -n "Continue with installation? [y/N] "
    read -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled"
        exit 0
    fi
}

# === Install Homebrew ===
install_homebrew() {
    print_warning "Homebrew is required to install system dependencies on macOS"
    echo ""
    echo "Install command:"
    echo '  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    echo ""

    if [ "$AUTO_MODE" = true ]; then
        print_warning "Auto mode: skipping Homebrew installation"
        SKIP_SYSTEM_DEPS=true
        return
    fi

    read -p "Install Homebrew now? [y/N] " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

        # Check if installation succeeded
        if command -v brew &> /dev/null; then
            print_success "Homebrew installed successfully"
            PKG_MANAGER="brew"
            INSTALL_CMD="brew install"
        else
            print_error "Homebrew installation failed"
            SKIP_SYSTEM_DEPS=true
        fi
    else
        print_warning "Skipping Homebrew installation"
        SKIP_SYSTEM_DEPS=true
    fi
}

# === Install System Packages ===
install_system_packages() {
    if [ "$SKIP_SYSTEM_DEPS" = true ]; then
        print_section "System Dependencies"
        print_warning "Skipped (manual installation required)"
        return
    fi

    print_section "Installing System Dependencies"

    # Handle missing Homebrew on macOS
    if [ "$OS" = "macos" ] && [ "$PKG_MANAGER" = "none" ]; then
        install_homebrew
        if [ "$SKIP_SYSTEM_DEPS" = true ]; then
            return
        fi
    fi

    # Handle unknown package manager
    if [ "$PKG_MANAGER" = "unknown" ]; then
        print_warning "Unknown package manager on $OS_NAME"
        echo ""
        echo "Please install these packages manually:"
        echo "  • ffmpeg (for video-analysis skill)"
        echo "  • jq (for plugin management scripts)"
        echo ""
        SKIP_SYSTEM_DEPS=true
        return
    fi

    # Update package index for apt
    if [ "$PKG_MANAGER" = "apt" ]; then
        echo "Updating package index..."
        if sudo apt update -qq 2>&1 | tee /tmp/setup-apt-update.log >/dev/null; then
            print_success "Package index updated"
        else
            print_warning "Failed to update package index (continuing anyway)"
            echo "  Error log: /tmp/setup-apt-update.log"
        fi
    fi

    # Install ffmpeg (unless minimal mode)
    if [ "$MINIMAL" = false ]; then
        if command -v ffmpeg &> /dev/null; then
            print_success "ffmpeg already installed"
            ((SKIPPED++))
        else
            echo "Installing ffmpeg..."
            if $INSTALL_CMD ffmpeg >/tmp/setup-ffmpeg.log 2>&1; then
                print_success "ffmpeg installed"
                ((INSTALLED++))
            else
                print_error "Failed to install ffmpeg"
                echo "  Error log: /tmp/setup-ffmpeg.log"
                echo "  Manual install: $INSTALL_CMD ffmpeg"
                FAILED_PACKAGES+=("ffmpeg")
                ((FAILED++))
            fi
        fi
    else
        print_info "ffmpeg skipped (minimal mode)"
    fi

    # Install jq
    if command -v jq &> /dev/null; then
        print_success "jq already installed"
        ((SKIPPED++))
    else
        echo "Installing jq..."
        if $INSTALL_CMD jq >/tmp/setup-jq.log 2>&1; then
            print_success "jq installed"
            ((INSTALLED++))
        else
            print_error "Failed to install jq"
            echo "  Error log: /tmp/setup-jq.log"
            echo "  Manual install: $INSTALL_CMD jq"
            FAILED_PACKAGES+=("jq")
            ((FAILED++))
        fi
    fi
}

# === Install Claude Plugins ===
install_claude_plugins() {
    print_section "Installing Claude Plugins"

    INSTALLED_PLUGINS_FILE="$HOME/.claude/plugins/installed_plugins.json"

    # Install feature-dev
    if [ -f "$INSTALLED_PLUGINS_FILE" ] && command -v jq &> /dev/null; then
        FEATURE_DEV_KEY=$(jq -r '.plugins | keys[] | select(contains("feature-dev"))' "$INSTALLED_PLUGINS_FILE" 2>/dev/null | head -1)
        if [ -n "$FEATURE_DEV_KEY" ]; then
            print_success "feature-dev already installed"
            ((SKIPPED++))
        else
            install_plugin "feature-dev" "feature-dev@claude-plugins-official"
        fi
    else
        install_plugin "feature-dev" "feature-dev@claude-plugins-official"
    fi

    # Install code-simplifier
    if [ -f "$INSTALLED_PLUGINS_FILE" ] && command -v jq &> /dev/null; then
        CODE_SIMPLIFIER_KEY=$(jq -r '.plugins | keys[] | select(contains("code-simplifier"))' "$INSTALLED_PLUGINS_FILE" 2>/dev/null | head -1)
        if [ -n "$CODE_SIMPLIFIER_KEY" ]; then
            print_success "code-simplifier already installed"
            ((SKIPPED++))
        else
            install_plugin "code-simplifier" "code-simplifier@claude-plugins-official"
        fi
    else
        install_plugin "code-simplifier" "code-simplifier@claude-plugins-official"
    fi
}

# === Install Plugin Helper ===
install_plugin() {
    local plugin_name=$1
    local plugin_id=$2

    echo "Installing $plugin_name..."

    # Capture output to check for success
    local output
    output=$(claude plugin install "$plugin_id" 2>&1)

    if echo "$output" | grep -q "Successfully installed\|already installed"; then
        print_success "$plugin_name installed"
        ((INSTALLED++))
        return 0
    else
        print_error "Failed to install $plugin_name"
        echo "  Try manually: /plugin install $plugin_id"
        echo "  Error: $output"
        FAILED_PLUGINS+=("$plugin_name")
        ((FAILED++))
        return 1
    fi
}

# === Install Dev Coffee Plugin ===
install_devcoffee() {
    print_section "Installing Dev Coffee Plugin"

    echo "Installing devcoffee from local directory..."

    # Use claude plugin install with local path
    local output
    output=$(claude plugin install "$PLUGIN_DIR" 2>&1)

    if echo "$output" | grep -q "Successfully installed\|already installed\|installed successfully"; then
        print_success "devcoffee plugin installed"
        ((INSTALLED++))
    else
        print_error "Failed to install devcoffee plugin"
        echo "  Error: $output"
        echo "  Try manually: claude plugin install $PLUGIN_DIR"
        FAILED_PLUGINS+=("devcoffee")
        ((FAILED++))
    fi
}

# === Verify Installation ===
verify_installation() {
    print_section "Verifying Installation"

    if [ ! -f "$DOCTOR_SCRIPT" ]; then
        print_warning "doctor.sh not found - skipping verification"
        return
    fi

    echo ""
    echo "Running health check..."
    echo ""

    # Run doctor.sh and capture exit code
    set +e
    bash "$DOCTOR_SCRIPT"
    local doctor_exit=$?
    set -e

    echo ""
    if [ $doctor_exit -eq 0 ]; then
        print_success "All systems verified"
    elif [ $doctor_exit -eq 2 ]; then
        print_warning "Verification completed with warnings"
    else
        print_error "Verification found issues"
    fi
}

# === Print Summary ===
print_summary() {
    print_section "Summary"

    echo ""
    echo "Installation Results:"
    echo -e "  ${GREEN}✓${NC} Installed: $INSTALLED"
    if [ $SKIPPED -gt 0 ]; then
        echo -e "  ${BLUE}⊘${NC} Skipped: $SKIPPED"
    fi
    if [ $FAILED -gt 0 ]; then
        echo -e "  ${RED}✗${NC} Failed: $FAILED"
    fi
    echo ""

    # Show failures if any
    if [ ${#FAILED_PACKAGES[@]} -gt 0 ]; then
        echo "Failed System Packages:"
        for pkg in "${FAILED_PACKAGES[@]}"; do
            echo "  ✗ $pkg"
            echo "    Retry: $INSTALL_CMD $pkg"
        done
        echo ""
    fi

    if [ ${#FAILED_PLUGINS[@]} -gt 0 ]; then
        echo "Failed Plugins:"
        for plugin in "${FAILED_PLUGINS[@]}"; do
            echo "  ✗ $plugin"
        done
        echo ""
    fi

    # Overall status
    if [ $FAILED -gt 0 ]; then
        print_section "⚠️  Setup Completed with Errors"
        echo ""
        echo "Some components failed to install."
        echo "Review the errors above and install manually if needed."
        echo ""
        echo "Next steps:"
        echo "  1. Install failed components manually"
        echo "  2. Run health check: ./scripts/doctor.sh"
        echo ""
        exit 2
    elif [ $SKIPPED -gt 0 ] && [ "$SKIP_SYSTEM_DEPS" = true ]; then
        print_section "⚠️  Setup Completed with Warnings"
        echo ""
        echo "System dependencies were skipped."
        echo "Plugin is functional but some features may not work."
        echo ""
        echo "Manual installation required:"
        if [ "$OS" = "macos" ]; then
            echo "  • Install Homebrew: https://brew.sh"
            echo "  • Install ffmpeg: brew install ffmpeg"
            echo "  • Install jq: brew install jq"
        elif [ "$PKG_MANAGER" = "apt" ]; then
            echo "  • Install ffmpeg: sudo apt install ffmpeg"
            echo "  • Install jq: sudo apt install jq"
        elif [ "$PKG_MANAGER" = "dnf" ]; then
            echo "  • Install ffmpeg: sudo dnf install ffmpeg"
            echo "  • Install jq: sudo dnf install jq"
        elif [ "$PKG_MANAGER" = "pacman" ]; then
            echo "  • Install ffmpeg: sudo pacman -S ffmpeg"
            echo "  • Install jq: sudo pacman -S jq"
        else
            echo "  • Install ffmpeg (for video-analysis skill)"
            echo "  • Install jq (for plugin management scripts)"
        fi
        echo ""
        echo "Next steps:"
        echo "  1. Install missing dependencies (optional)"
        echo "  2. Start Claude: claude"
        echo "  3. Test maximus: /devcoffee:maximus"
        echo ""
        exit 2
    else
        print_section "✅ Setup Complete!"
        echo ""
        echo "All components installed successfully."
        echo ""
        echo "Next steps:"
        echo "  1. Start Claude: claude"
        echo "  2. Test maximus: /devcoffee:maximus"
        echo "  3. Test buzzminson: /devcoffee:buzzminson \"Add login feature\""
        echo ""
        if [ "$MINIMAL" = false ] && ! command -v ffmpeg &> /dev/null; then
            echo "Optional: Install ffmpeg for video-analysis"
            if [ "$OS" = "macos" ]; then
                echo "  brew install ffmpeg"
            elif [ "$PKG_MANAGER" = "apt" ]; then
                echo "  sudo apt install ffmpeg"
            fi
            echo ""
        fi
        exit 0
    fi
}

# === Parse Arguments ===
while [[ $# -gt 0 ]]; do
    case $1 in
        --auto)
            AUTO_MODE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --minimal)
            MINIMAL=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# === Main Execution ===
main() {
    print_header
    detect_system
    check_prerequisites
    show_installation_plan

    if [ "$AUTO_MODE" = false ]; then
        confirm_installation
    fi

    install_system_packages
    install_claude_plugins
    install_devcoffee
    verify_installation
    print_summary
}

main
