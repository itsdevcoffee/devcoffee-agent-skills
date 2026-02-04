# Dev Coffee - Claude Code Plugin Marketplace

> Automated code quality workflows for Claude Code. Battle-tested tools that run code reviews, fix issues, and simplify code automatically.

[![Claude Code](https://img.shields.io/badge/Claude_Code-Plugin-5865F2)](https://code.claude.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
# 1. Add this marketplace to Claude Code
/plugin marketplace add maskkiller/devcoffee-agent-skills

# 2. Install the plugin
/plugin install devcoffee@devcoffee-agent-skills

# 3. Install dependencies
/plugin install feature-dev@claude-plugins-official
/plugin install code-simplifier@claude-plugins-official

# 4. Run your first review cycle
/devcoffee:maximus
```

That's it! Maximus will now automatically review your code, fix issues, and simplify it.

---

## What's Included

### 🎯 Maximus - Automated Code Review Cycle

The star of the show: an autonomous agent that runs code reviews in a loop until your code is clean, then polishes it with automatic simplification.

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

## Available Commands & Agents

| Command | Agent | Description | When to Use |
|---------|-------|-------------|-------------|
| `/devcoffee:maximus` | `maximus` | Full review-fix-simplify cycle | After coding, before commit |

**Two ways to invoke:**
- **Command**: `/devcoffee:maximus` - Direct invocation
- **Agent**: Just ask Claude to "run maximus" or "review my code" - it will trigger automatically

---

## Installation

### Step 1: Add Marketplace

In Claude Code, run:
```bash
/plugin marketplace add maskkiller/devcoffee-agent-skills
```

Or use the local path if you've cloned the repo:
```bash
/plugin marketplace add /path/to/devcoffee-agent-skills
```

### Step 2: Install Plugin

```bash
/plugin install devcoffee@devcoffee-agent-skills
```

### Step 3: Install Dependencies

Maximus requires these official plugins:

```bash
/plugin install feature-dev@claude-plugins-official
/plugin install code-simplifier@claude-plugins-official
```

**Why these dependencies?**
- `feature-dev` provides the `code-reviewer` agent (finds bugs and issues)
- `code-simplifier` provides the `code-simplifier` agent (polishes code)

### Verify Installation

```bash
/help | grep devcoffee
```

You should see `/devcoffee:maximus` listed.

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
/plugin marketplace add maskkiller/devcoffee-agent-skills
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
✔ devcoffee@devcoffee-agent-skills
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
/plugin install devcoffee@devcoffee-agent-skills
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

## Changelog

### v0.1.0 (2026-02-04)
- Initial release
- Maximus automated review cycle
- Support for code-reviewer loop
- Integration with code-simplifier
- Configurable pause points and max rounds
- Formatted summary reports

---

**Made with ☕ by Dev Coffee**
