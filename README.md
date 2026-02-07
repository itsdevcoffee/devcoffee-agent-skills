# Dev Coffee - Claude Code Plugin Marketplace

> Automated code quality workflows for Claude Code. Battle-tested tools that run code reviews, fix issues, and simplify code automatically.

[![Claude Code](https://img.shields.io/badge/Claude_Code-Plugin-5865F2)](https://code.claude.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
# 1. Add this marketplace to Claude Code
/plugin marketplace add itsdevcoffee/devcoffee-agent-skills

# 2. Install the plugin(s) you want
/plugin install video-analysis@devcoffee-marketplace  # Video feedback
/plugin install devcoffee@devcoffee-marketplace       # Code review
/plugin install remotion-max@devcoffee-marketplace    # Remotion tools

# 3. Install dependencies (if using devcoffee)
/plugin install feature-dev@claude-plugins-official
/plugin install code-simplifier@claude-plugins-official

# 4. Install FFmpeg (if using video-analysis)
brew install ffmpeg                # Mac
# sudo apt install ffmpeg         # Debian/Ubuntu
# sudo dnf install ffmpeg         # Fedora/RHEL
# sudo pacman -S ffmpeg           # Arch Linux

# 5. Try them out
/video-analysis path/to/video.mp4   # Analyze videos
/devcoffee:maximus                  # Run code review
```

---

## What's Included

### 🎯 Maximus - Automated Code Review Cycle

> **Plugin:** `devcoffee`

An autonomous agent that runs code reviews in a loop until your code is clean, then polishes it with automatic simplification.

**When to use:**
- ✅ After implementing a feature
- ✅ Before committing changes
- ✅ Before creating a pull request
- ✅ When you want quality assurance without manual review

**What it does:**
1. Detects your uncommitted changes or unpushed commits
2. Runs `code-reviewer` agent to find bugs, security issues, and quality problems
3. Automatically implements fixes
4. Repeats until no issues remain (max 5 rounds by default)
5. Runs `code-simplifier` for final polish
6. Gives you a formatted summary report

**Basic usage:**
```bash
/devcoffee:maximus
```

**With options:**
```bash
# Interactive mode - pause at each step for review
/devcoffee:maximus --interactive

# Only pause if critical/major issues found
/devcoffee:maximus --pause-major

# Custom max rounds
/devcoffee:maximus --max-rounds 10

# Pause before simplification step
/devcoffee:maximus --pause-simplifier
```

---

### 🎬 Remotion Max - Complete Remotion Toolkit

> **Plugin:** `remotion-max`

Complete toolkit for [Remotion](https://remotion.dev) video creation combining best practices, intelligent agents, and automation.

**When to use:**
- ✅ Building Remotion video projects
- ✅ Setting up new Remotion projects
- ✅ Generating animations and components
- ✅ Learning Remotion patterns

**What's included:**

**📚 Comprehensive Skill**: 29+ guides covering animations, audio, video, captions, 3D, Lottie, charts, fonts, Tailwind, transitions, and more

**🤖 Intelligent Agents**:
- `remotion-builder` - Generates Remotion components following best practices
- `remotion-setup` - Initializes and configures Remotion projects

**⚡ Commands**:
```bash
/remotion-max:builder text-reveal    # Generate components
/remotion-max:setup --new-project    # Initialize projects
```

**How it works:**
- **Skill**: Loads automatically when discussing Remotion
- **Agents**: Activate when you ask to "create a Remotion component" or "set up a Remotion project"
- **Commands**: Use directly for quick generation and setup

[View remotion-max documentation →](./remotion-max/README.md)

---

### 🎬 Video Analysis - AI-Powered Video Feedback

> **Plugin:** `video-analysis` (standalone)

Analyze videos and get comprehensive visual feedback using FFmpeg frame extraction and Claude's vision API.

**When to use:**
- ✅ Review Remotion video output
- ✅ Get UI/UX feedback on video prototypes
- ✅ Check visual quality and consistency
- ✅ Validate technical execution

**What it does:**
1. Extracts strategic frames from your video (5-20 frames based on mode)
2. Analyzes each frame with Claude vision API
3. Provides scene-by-scene analysis with scores
4. Identifies strengths and improvement areas
5. Generates comprehensive markdown report

**Basic usage:**
```bash
# Just ask naturally
"Can you analyze this video and give me feedback?"
path/to/video.mp4

# Or be specific about mode
"Give me a quick analysis" → 5 frames, ~15 min
"Detailed analysis please" → 20 frames, ~60 min
```

**Modes:**
- **Quick** (5 frames) - Fast overview in ~15 minutes
- **Standard** (10 frames) - Balanced analysis in ~30 minutes
- **Detailed** (20 frames) - Thorough review in ~60 minutes
- **Custom** - Specify exact timestamps to analyze

**Focus areas:**
- UI/UX - Readability, layout, navigation
- Aesthetics - Visual style, color, composition
- Technical - Quality, artifacts, performance
- Storytelling - Narrative flow, pacing

[View video-analysis documentation →](./devcoffee/skills/video-analysis/README.md)

---

<!-- BEGIN AUTO-GENERATED PLUGIN SECTIONS -->
<!-- Generated by: npm run readme:generate -->
<!-- Source: .claude-plugin/marketplace.json + plugin.json files -->
<!-- Do not edit manually - edit plugin.json files instead -->

## Available Plugins

### `devcoffee`

Dev Coffee productivity skills for Claude Code - feature implementation with buzzminson and code quality with maximus

**Components:**
- **Agents:** `maximus`, `buzzminson`
- **Commands:** `/devcoffee:maximus`

**Installation:**

```bash
/plugin install devcoffee@devcoffee-marketplace

# Plugin dependencies (auto-installed):
# - feature-dev@claude-plugins-official
# - code-simplifier@claude-plugins-official
```

**When to use:** After coding, before commit, quality assurance

**Examples:**

```bash
/devcoffee:maximus
/devcoffee:maximus --interactive
```

---

### `video-analysis`

AI-powered video analysis using FFmpeg frame extraction and Claude vision API

**Components:**
- **Commands:** `/video-analysis`
- **Skills:** `video-analysis`

**Installation:**

```bash
/plugin install video-analysis@devcoffee-marketplace

# External dependency required: ffmpeg

# Mac
brew install ffmpeg
# Debian/Ubuntu
sudo apt install ffmpeg
# Fedora/RHEL
sudo dnf install ffmpeg
# Arch Linux
sudo pacman -S ffmpeg
# Windows
https://ffmpeg.org/download.html
```

**When to use:** Review videos, get UI/UX feedback, check visual quality

**Examples:**

```bash
/video-analysis path/to/video.mp4
```

---

### `remotion-max`

Complete toolkit for Remotion video creation - best practices, agents, and automation

**Components:**
- **Agents:** `remotion-builder`, `remotion-setup`
- **Commands:** `/remotion-max:builder`, `/remotion-max:setup`
- **Skills:** `remotion-best-practices`

**Installation:**

```bash
/plugin install remotion-max@devcoffee-marketplace
```

**When to use:** Building Remotion video projects

**Examples:**

```bash
/remotion-max:builder text-reveal
```

---

### `tldr`

Conversation summarization for Claude Code - creates hyper-condensed bullet-point summaries of Claude's messages

**Components:**
- **Commands:** `/tldr`
- **Skills:** `tldr`

**Installation:**

```bash
/plugin install tldr@devcoffee-marketplace
```

**When to use:** After long Claude responses, reviewing conversation history

**Examples:**

```bash
/tldr
```

---

<!-- END AUTO-GENERATED PLUGIN SECTIONS -->

## Installation

### Step 1: Add Marketplace

In Claude Code, run:
```bash
/plugin marketplace add itsdevcoffee/devcoffee-agent-skills
```

Or use the local path if you've cloned the repo:
```bash
/plugin marketplace add /path/to/devcoffee-agent-skills
```

### Step 2: Install Plugins

Install only what you need:

```bash
# Video analysis only
/plugin install video-analysis@devcoffee-marketplace

# Code review automation only
/plugin install devcoffee@devcoffee-marketplace

# Remotion toolkit only
/plugin install remotion-max@devcoffee-marketplace

# Or install all
/plugin install video-analysis@devcoffee-marketplace
/plugin install devcoffee@devcoffee-marketplace
/plugin install remotion-max@devcoffee-marketplace
```

### Step 3: Install Dependencies

**For maximus (code review):**
```bash
/plugin install feature-dev@claude-plugins-official
/plugin install code-simplifier@claude-plugins-official
```

**For video-analysis:**
```bash
# Install FFmpeg (if not already installed)
# Mac: brew install ffmpeg
# Linux (Debian/Ubuntu): sudo apt install ffmpeg
# Linux (Fedora/RHEL): sudo dnf install ffmpeg
# Linux (Arch): sudo pacman -S ffmpeg
# Windows: https://ffmpeg.org/download.html
```

**Why these dependencies?**
- `feature-dev` provides the `code-reviewer` agent (finds bugs and issues)
- `code-simplifier` provides the `code-simplifier` agent (polishes code)
- `ffmpeg` enables frame extraction for video analysis

### Verify Installation

```bash
# Check installed plugins
/plugin list | grep devcoffee

# Should show:
# ✔ devcoffee@devcoffee-marketplace
# ✔ remotion-max@devcoffee-marketplace

# Check available commands
/help | grep devcoffee
# Should show: /devcoffee:maximus
```

---

## Usage Examples

### Example 1: Basic Review After Feature Implementation

```bash
# You just finished implementing user authentication
# Run maximus to review and clean up

/devcoffee:maximus

# Output:
# Round 1: Found 3 issues (1 critical, 2 minor)
# → Fixed null check, validation, error handling
# Round 2: Found 1 issue (edge case)
# → Added boundary check
# Round 3: Clean ✓
# Simplification: Reduced complexity, improved naming
# Result: PASS
```

### Example 2: Interactive Review

```bash
# Pause at each step to review what's happening
/devcoffee:maximus --interactive

# At each pause, you can:
# - Review the issues found
# - See the fixes applied
# - Decide whether to continue
```

### Example 3: Only Stop for Serious Issues

```bash
# Run autonomously, only pause if critical/major issues found
/devcoffee:maximus --pause-major

# This is great for:
# - Quick pre-commit checks
# - CI/CD workflows
# - When you trust the automation
```

### Example 4: Natural Language

You can also just ask Claude:

```
"Run maximus on my changes"
"Review and fix my code"
"Do a full code review cycle"
```

Claude will automatically spawn the maximus agent.

---

## What Gets Reviewed

Maximus automatically detects what to review:

| Priority | Source | Command |
|----------|--------|---------|
| 1️⃣ | Uncommitted changes | `git diff` (staged + unstaged) |
| 2️⃣ | Unpushed commits | `git diff @{upstream}..HEAD` |

**Example scenarios:**

- **Scenario A**: You have uncommitted changes → Reviews those files
- **Scenario B**: Everything committed but not pushed → Reviews the commits
- **Scenario C**: Both exist → Reviews uncommitted changes (higher priority)

---

## Workflow Diagram

```
┌─────────────────────────────────────┐
│ Start: /devcoffee:maximus           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Detect changed files                │
│ • Uncommitted changes (priority 1)  │
│ • Unpushed commits (priority 2)     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Round 1: code-reviewer scan         │◄─────┐
│ → Finds X issues                    │      │
└─────────────────────────────────────┘      │
              ↓                              │
┌─────────────────────────────────────┐      │
│ Implement fixes automatically       │      │
└─────────────────────────────────────┘      │
              ↓                              │
         Issues remain? ─────────────────────┘
              ↓ No
┌─────────────────────────────────────┐
│ code-simplifier polish              │
│ • Reduce complexity                 │
│ • Improve naming                    │
│ • Enhance readability               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Summary Report                      │
│ • Rounds: 3                         │
│ • Issues found: 4                   │
│ • Issues fixed: 4                   │
│ • Result: PASS ✓                    │
└─────────────────────────────────────┘
```

---

## Command Reference

### `/devcoffee:maximus`

**Flags:**

| Flag | Default | Description |
|------|---------|-------------|
| `--pause-reviews` | off | Pause after each code-reviewer round |
| `--pause-simplifier` | off | Pause before running code-simplifier |
| `--pause-major` | off | Pause only when critical/major issues found |
| `--max-rounds N` | 5 | Maximum review rounds before stopping |
| `--interactive` | off | Enable all pauses (same as all pause flags) |

**Examples:**

```bash
# Fully autonomous (default)
/devcoffee:maximus

# Stop at each step
/devcoffee:maximus --interactive

# Only stop for serious issues
/devcoffee:maximus --pause-major

# Allow up to 10 rounds
/devcoffee:maximus --max-rounds 10

# Pause before simplification
/devcoffee:maximus --pause-simplifier

# Combine multiple flags
/devcoffee:maximus --pause-major --max-rounds 3
```

---

## Troubleshooting

### "Plugin devcoffee not found"

Make sure you've added the marketplace first:
```bash
/plugin marketplace add itsdevcoffee/devcoffee-agent-skills
```

### "Agent code-reviewer not found"

Install the required dependencies:
```bash
/plugin install feature-dev@claude-plugins-official
/plugin install code-simplifier@claude-plugins-official
```

### Commands not appearing in autocomplete

Restart Claude Code after installation:
```bash
# Exit Claude Code
# Start fresh
claude
```

### Check if plugin is installed

```bash
/plugin list | grep devcoffee
```

Should show:
```
✔ devcoffee@devcoffee-marketplace
```

---

## Development

### Testing Locally

```bash
# Clone the repo
git clone https://github.com/maskkiller/devcoffee-agent-skills.git
cd devcoffee-agent-skills

# Add as local marketplace
/plugin marketplace add $(pwd)

# Install
/plugin install devcoffee@devcoffee-marketplace
```

### Project Structure

```
devcoffee-agent-skills/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace configuration
├── devcoffee/                    # Plugin directory
│   ├── .claude-plugin/
│   │   └── plugin.json          # Plugin manifest
│   ├── commands/
│   │   └── maximus.md           # /devcoffee:maximus command
│   ├── agents/
│   │   └── maximus.md           # maximus agent definition
│   └── README.md                # Plugin-specific docs
├── docs/                         # Documentation
└── README.md                     # This file
```

### Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Test your changes locally
4. Submit a pull request

---

## FAQ

**Q: Is this safe? What if it breaks my code?**
A: Maximus only reviews and suggests fixes - it doesn't commit or push anything. You can review all changes before committing. Use `--interactive` mode for full control.

**Q: How long does it take?**
A: Depends on how many files changed and issues found. Typically 2-5 minutes for small changes, 10-15 minutes for larger features.

**Q: Can I use this in CI/CD?**
A: Yes! Maximus is designed for automation. Use it in pre-commit hooks or CI pipelines.

**Q: What languages are supported?**
A: Any language that code-reviewer and code-simplifier support (basically anything Claude understands).

**Q: Does it work with uncommitted changes?**
A: Yes! That's the primary use case. It reviews whatever git diff shows.

**Q: What if I have both uncommitted changes and unpushed commits?**
A: It prioritizes uncommitted changes (higher priority). Run maximus twice if you want to review both.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**Dev Coffee**
- GitHub: [@maskkiller](https://github.com/maskkiller)
- Marketplace: [devcoffee-agent-skills](https://github.com/maskkiller/devcoffee-agent-skills)

---

## Examples

### Speedrun Game Video
**Location:** `examples/devcoffee-speedrun-game/`

A 45-second retro gaming video (9.3/10 quality) showcasing Buzzminson and Maximus agents in authentic 16-bit SNES/Genesis style.

**Highlights:**
- 100% CSS-based sprites (no image assets!)
- 4 platformer levels + 3 shooter phases
- CRT scanlines and pixel-perfect rendering
- Complete Remotion project (ready to customize)

[View example →](./examples/devcoffee-speedrun-game/README.md)

---

## Changelog

### v0.3.0 (2026-02-06)
- 🎬 **NEW:** Video analysis skill - AI-powered video feedback via frame extraction
- 🎮 **NEW:** Speedrun game example - 45s retro gaming video (9.3/10 quality)
- ✨ Added 4 sampling modes (quick/standard/detailed/custom)
- ✨ Added 5 focus areas (UI/aesthetics/technical/storytelling/all)
- 🔧 Comprehensive error handling (10+ cases)
- 📚 Complete documentation with test cases and quick start guides
- ✅ Production-ready quality (validated by maximus)

### v0.2.0 (2026-02-04)
- Added `remotion-max` plugin (renamed from remotion-best-practices)
- Added `remotion-builder` and `remotion-setup` agents
- Added `/remotion-max:builder` and `/remotion-max:setup` commands
- 29+ comprehensive guides for Remotion video creation
- Complete automation for Remotion project setup and component generation

### v0.1.0 (2026-02-04)
- Initial release
- Maximus automated review cycle
- Support for code-reviewer loop
- Integration with code-simplifier
- Configurable pause points and max rounds
- Formatted summary reports

---

**Made with ☕ by Dev Coffee**
