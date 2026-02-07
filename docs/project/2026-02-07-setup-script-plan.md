# Setup Script Implementation Plan

**Date:** 2026-02-07
**Status:** Planning
**Related:** `scripts/doctor.sh`

## Overview

Create `scripts/setup.sh` - an interactive setup script that automates installation of all devcoffee plugin dependencies and handles OS-specific nuances.

## Goals

1. **One-command setup** - New users can run `./scripts/setup.sh` and be fully configured
2. **Cross-platform** - Support macOS and major Linux distributions
3. **Smart detection** - Detect OS, package manager, and what's already installed
4. **Safe defaults** - Interactive by default, auto mode available with flag
5. **Error resilient** - Handle edge cases gracefully with fallback instructions

## How It Works

### High-Level Flow

```
┌─────────────────────────────┐
│ 1. Detect OS & Package Mgr  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 2. Run doctor.sh            │
│    Parse current state      │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 3. Show Installation Plan   │
│    (what will be installed) │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 4. Confirm with User        │
│    (unless --auto)          │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 5. Install System Deps      │
│    (ffmpeg, jq)             │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 6. Install Claude Plugins   │
│    (feature-dev, simplifier)│
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 7. Install devcoffee Plugin │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 8. Verify with doctor.sh    │
│    Show final status        │
└─────────────────────────────┘
```

## OS & Package Manager Detection

### Supported Platforms

| Platform | Package Manager | Detection Method |
|----------|----------------|------------------|
| macOS | Homebrew (brew) | `[[ "$OSTYPE" == "darwin"* ]]` |
| Ubuntu/Debian | apt | Check `/etc/os-release` for `ID=ubuntu` or `ID=debian` |
| Fedora/RHEL | dnf | Check `/etc/os-release` for `ID=fedora` or `ID=rhel` |
| Arch Linux | pacman | Check `/etc/os-release` for `ID=arch` |
| Other Linux | manual | Provide manual instructions |

### Detection Logic

```bash
# Detect OS and package manager
detect_system() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        PKG_MANAGER="brew"
        INSTALL_CMD="brew install"
        SUDO_REQUIRED=false
    elif [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS="linux"
        case "$ID" in
            ubuntu|debian|pop)
                PKG_MANAGER="apt"
                INSTALL_CMD="sudo apt install -y"
                SUDO_REQUIRED=true
                ;;
            fedora|rhel|centos)
                PKG_MANAGER="dnf"
                INSTALL_CMD="sudo dnf install -y"
                SUDO_REQUIRED=true
                ;;
            arch|manjaro)
                PKG_MANAGER="pacman"
                INSTALL_CMD="sudo pacman -S --noconfirm"
                SUDO_REQUIRED=true
                ;;
            *)
                PKG_MANAGER="unknown"
                OS_NAME="$ID"
                SUDO_REQUIRED=true
                ;;
        esac
    else
        OS="unknown"
        PKG_MANAGER="unknown"
    fi
}
```

## Edge Cases & Handling

### 1. Package Manager Not Installed

**Scenario:** macOS without Homebrew

**Handling:**
```bash
if ! command -v brew &> /dev/null; then
    echo "⚠ Homebrew not installed"
    echo ""
    echo "Install Homebrew first:"
    echo '  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    echo ""
    read -p "Install Homebrew now? [y/N] " -n 1 -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Run Homebrew installation
    else
        echo "Skipping system dependencies (install Homebrew manually later)"
    fi
fi
```

### 2. No Sudo Access

**Scenario:** Linux user without sudo privileges

**Handling:**
```bash
if [ "$SUDO_REQUIRED" = true ]; then
    if ! sudo -n true 2>/dev/null; then
        echo "⚠ System package installation requires sudo access"
        echo ""
        echo "Options:"
        echo "  1. Run: sudo -v  (to cache sudo credentials)"
        echo "  2. Skip system dependencies (install manually later)"
        echo "  3. Ask system administrator to install: ffmpeg jq"
        echo ""
        read -p "Continue without system dependencies? [y/N] " -n 1 -r
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
        SKIP_SYSTEM_DEPS=true
    fi
fi
```

### 3. Unknown Package Manager

**Scenario:** Unsupported Linux distribution

**Handling:**
```bash
if [ "$PKG_MANAGER" = "unknown" ]; then
    echo "⚠ Unknown Linux distribution: $OS_NAME"
    echo ""
    echo "Please install these packages manually:"
    echo "  - ffmpeg (for video-analysis skill)"
    echo "  - jq (for plugin management scripts)"
    echo ""
    echo "Continuing with Claude plugin installation..."
    SKIP_SYSTEM_DEPS=true
fi
```

### 4. Package Names Differ

**Most packages have consistent names:**
- `ffmpeg` - Same across all platforms ✓
- `jq` - Same across all platforms ✓

**If we encounter package name differences:**
```bash
# Package name mapping
case "$PKG_MANAGER" in
    apt)
        FFMPEG_PKG="ffmpeg"
        JQ_PKG="jq"
        ;;
    dnf)
        FFMPEG_PKG="ffmpeg"
        JQ_PKG="jq"
        ;;
    pacman)
        FFMPEG_PKG="ffmpeg"
        JQ_PKG="jq"
        ;;
    brew)
        FFMPEG_PKG="ffmpeg"
        JQ_PKG="jq"
        ;;
esac
```

### 5. Package Manager Update Needed

**Scenario:** Package index out of date (Linux)

**Handling:**
```bash
if [ "$PKG_MANAGER" = "apt" ]; then
    echo "Updating package index..."
    sudo apt update -qq
fi
```

### 6. Claude CLI Not Installed

**Scenario:** User doesn't have Claude CLI

**Handling:**
```bash
if ! command -v claude &> /dev/null; then
    echo "✗ Claude CLI not installed"
    echo ""
    echo "Install Claude Code first:"
    echo "  https://claude.ai/download"
    echo ""
    echo "After installing Claude Code, run this script again."
    exit 1
fi
```

### 7. Plugin Installation Failures

**Scenario:** Network issues, plugin not found, etc.

**Handling:**
```bash
install_plugin() {
    local plugin_name=$1
    local plugin_id=$2

    echo "Installing $plugin_name..."
    if claude plugin install "$plugin_id" 2>&1 | grep -q "Successfully installed"; then
        echo "  ✓ $plugin_name installed"
        return 0
    else
        echo "  ✗ Failed to install $plugin_name"
        echo "    Try manually: /plugin install $plugin_id"
        FAILED_PLUGINS+=("$plugin_name")
        return 1
    fi
}
```

### 8. Already Installed

**Scenario:** Dependencies already installed

**Handling:**
```bash
# Check before installing
if command -v ffmpeg &> /dev/null; then
    echo "✓ ffmpeg already installed"
else
    echo "Installing ffmpeg..."
    $INSTALL_CMD ffmpeg
fi
```

## Installation Modes

### Interactive Mode (Default)

```bash
./scripts/setup.sh
```

**Behavior:**
- Shows what will be installed
- Asks for confirmation before each step
- Allows user to skip optional dependencies
- Safe for cautious users

**Example:**
```
🔧 Dev Coffee Setup

Detected: macOS (Homebrew)

Installation Plan:
  System Dependencies:
    - ffmpeg (for video-analysis skill)
    - jq (for plugin management scripts)

  Claude Plugins:
    - feature-dev@claude-plugins-official
    - code-simplifier@claude-plugins-official

  Local Plugin:
    - devcoffee (from ./devcoffee)

Continue? [y/N]
```

### Auto Mode

```bash
./scripts/setup.sh --auto
```

**Behavior:**
- No prompts
- Installs everything automatically
- Useful for CI/CD or scripted setups

### Dry-run Mode

```bash
./scripts/setup.sh --dry-run
```

**Behavior:**
- Shows what would be installed
- Doesn't actually install anything
- Useful for verification

### Minimal Mode

```bash
./scripts/setup.sh --minimal
```

**Behavior:**
- Only installs required dependencies (skip optional)
- Skips ffmpeg (optional)
- Installs: Claude plugins + devcoffee only

## What Gets Installed

### System Dependencies

| Package | Required/Optional | Purpose | Platforms |
|---------|------------------|---------|-----------|
| `ffmpeg` | Optional | video-analysis skill | macOS, Linux |
| `jq` | Recommended | Plugin management scripts | macOS, Linux |

### Claude Plugins

| Plugin | Required/Optional | Purpose |
|--------|------------------|---------|
| `feature-dev@claude-plugins-official` | Required | code-reviewer agent (for maximus) |
| `code-simplifier@claude-plugins-official` | Required | code simplification (for maximus) |

### Local Plugin

| Plugin | Source |
|--------|--------|
| `devcoffee` | `./devcoffee` (local directory) |

## Script Structure

```bash
#!/bin/bash
# Dev Coffee Plugin Setup Script
# Automates installation of all dependencies

# === Configuration ===
set -e  # Exit on error (unless handled)

# === Variables ===
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
PLUGIN_DIR="$REPO_DIR/devcoffee"

# Counters
INSTALLED=0
SKIPPED=0
FAILED=0
FAILED_PACKAGES=()
FAILED_PLUGINS=()

# === Argument Parsing ===
AUTO_MODE=false
DRY_RUN=false
MINIMAL=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --auto) AUTO_MODE=true ;;
        --dry-run) DRY_RUN=true ;;
        --minimal) MINIMAL=true ;;
        -h|--help) show_help; exit 0 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
    shift
done

# === Functions ===
detect_system() { ... }
check_dependencies() { ... }
install_system_packages() { ... }
install_claude_plugins() { ... }
install_devcoffee() { ... }
verify_installation() { ... }

# === Main Execution ===
main() {
    print_header
    detect_system
    check_dependencies
    show_installation_plan

    if [ "$DRY_RUN" = true ]; then
        echo "Dry-run mode - exiting without changes"
        exit 0
    fi

    if [ "$AUTO_MODE" = false ]; then
        confirm_installation
    fi

    install_system_packages
    install_claude_plugins
    install_devcoffee
    verify_installation
    print_summary
}

main "$@"
```

## Error Handling Strategy

### Levels of Failures

**Critical (exit immediately):**
- Claude CLI not installed
- Not in correct directory (can't find ./devcoffee)
- User cancels installation

**Non-critical (continue with warning):**
- System package installation fails → Provide manual instructions
- Optional dependency fails → Skip and note in summary
- Plugin already installed → Skip and note as success

**Recovery Actions:**
```bash
# Example: System package fails
install_system_package() {
    local pkg=$1

    if $INSTALL_CMD "$pkg" 2>&1 | tee /tmp/install-$pkg.log; then
        echo "✓ $pkg installed"
        ((INSTALLED++))
    else
        echo "✗ Failed to install $pkg"
        echo "  Error log: /tmp/install-$pkg.log"
        echo "  Manual install: $INSTALL_CMD $pkg"
        FAILED_PACKAGES+=("$pkg")
        ((FAILED++))
        # Don't exit - continue with other packages
    fi
}
```

## Output Examples

### Success Case

```
🔧 Dev Coffee Setup
===================

Detected: macOS (Homebrew)

Current Status (from doctor.sh):
  ✓ Claude CLI: 2.1.34
  ✗ ffmpeg: not installed
  ✗ jq: not installed
  ✗ feature-dev plugin: not installed
  ✗ code-simplifier plugin: not installed

Installation Plan:
  System Dependencies (via Homebrew):
    • ffmpeg
    • jq

  Claude Plugins:
    • feature-dev@claude-plugins-official
    • code-simplifier@claude-plugins-official

  Local Plugin:
    • devcoffee v0.3.0

Continue? [y/N] y

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Installing System Dependencies
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ ffmpeg installed
✓ jq installed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Installing Claude Plugins
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ feature-dev@claude-plugins-official installed
✓ code-simplifier@claude-plugins-official installed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Installing Local Plugin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ devcoffee plugin installed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Running doctor.sh...]

✅ Setup Complete!

Summary:
  ✓ 6 components installed
  ⚠ 0 warnings
  ✗ 0 failures

Next steps:
  1. Start Claude: claude
  2. Test maximus: /devcoffee:maximus
  3. Test buzzminson: /devcoffee:buzzminson "Add login feature"
```

### Partial Failure Case

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Installed: 4
⚠ Skipped: 1
✗ Failed: 1

Failed Packages:
  ✗ ffmpeg (network error)
    Retry: brew install ffmpeg

All Claude plugins installed successfully!

⚠ Setup completed with warnings
Plugin is functional but some features may not work.

Manual steps required:
  1. Install ffmpeg: brew install ffmpeg
  2. Re-run doctor.sh to verify: ./scripts/doctor.sh
```

## Testing Strategy

### Test Scenarios

1. **Clean installation** - Nothing installed, everything succeeds
2. **Partial installation** - Some deps installed, install rest
3. **Fully installed** - Everything already there, skip all
4. **No sudo** - Linux without sudo access
5. **No Homebrew** - macOS without Homebrew
6. **Network failure** - Package installation fails
7. **Plugin failure** - Claude plugin install fails
8. **Unknown OS** - Unsupported Linux distro

### Test Matrix

| OS | Package Manager | Sudo | Expected Behavior |
|----|----------------|------|-------------------|
| macOS 14 | Homebrew | N/A | Full auto install |
| macOS 14 | No brew | N/A | Prompt to install brew |
| Ubuntu 22.04 | apt | Yes | Full auto install |
| Ubuntu 22.04 | apt | No | Skip sys deps, install plugins |
| Fedora 39 | dnf | Yes | Full auto install |
| Arch | pacman | Yes | Full auto install |
| Unknown | N/A | N/A | Skip sys deps, manual instructions |

## Success Criteria

- ✅ Works on macOS with Homebrew
- ✅ Works on Ubuntu/Debian with apt
- ✅ Works on Fedora with dnf
- ✅ Works on Arch with pacman
- ✅ Handles missing Homebrew gracefully
- ✅ Handles no sudo access gracefully
- ✅ Handles unknown OS gracefully
- ✅ Handles package install failures gracefully
- ✅ Handles plugin install failures gracefully
- ✅ Provides clear manual instructions for edge cases
- ✅ Verifies installation with doctor.sh
- ✅ Exit code 0 on full success
- ✅ Exit code 1 on critical failure
- ✅ Exit code 2 on partial success (warnings)

## Open Questions

1. **Homebrew installation** - Should we auto-install Homebrew on macOS if missing, or just prompt?
   - Recommendation: Prompt with option to install

2. **Package manager update** - Should we run `apt update` / `brew update` before installing?
   - Recommendation: Yes for apt (required), optional for brew (slow)

3. **Plugin versions** - Should we pin specific plugin versions or use latest?
   - Recommendation: Use latest (@claude-plugins-official suffix handles versioning)

4. **devcoffee installation** - Install from local directory or from marketplace?
   - Recommendation: Local directory (user is in the repo)

5. **Verbose output** - Should we show full command output or hide it?
   - Recommendation: Hide by default, show on error, add --verbose flag

## Implementation Notes

- Use doctor.sh as a library (source it to parse current state)
- Color-coded output matching doctor.sh style
- Idempotent - safe to run multiple times
- Fast - skip already-installed dependencies
- Clear error messages with remediation steps
- Exit codes match doctor.sh convention

## Dependencies

- `doctor.sh` must exist and be executable
- Must be run from repository root or scripts/ directory
- Requires bash 4.0+ for associative arrays
