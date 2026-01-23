# Dev Coffee

A collection of productivity tools for Claude Code focused on code quality and development efficiency.

## Available Tools

### Commands (explicit invocation)

| Command | Description |
|---------|-------------|
| `/devcoffee:maximus` | Full review cycle: code-reviewer loop + code-simplifier |

### Agents (can be spawned or mentioned)

| Agent | Description |
|-------|-------------|
| `@devcoffee:maximus` | Full review cycle as a subagent |

Both invoke the same workflow - use whichever is more convenient:
- `/devcoffee:maximus` - Type the slash command directly
- `@devcoffee:maximus` - Mention in conversation or let Claude spawn it

## Installation

```bash
# From marketplace (when published)
/plugin install devcoffee

# For development
claude --plugin-dir /path/to/devcoffee
```

## Prerequisites

This plugin depends on external agents. Install these plugins first:

```bash
/plugin install feature-dev
/plugin install code-simplifier
```

| Plugin | Agent | Purpose |
|--------|-------|---------|
| feature-dev | `code-reviewer` | Reviews code for bugs, security issues, quality |
| code-simplifier | `code-simplifier` | Simplifies and refines code for clarity |

Maximus will check for these dependencies and show installation instructions if missing.

---

## Maximus

Full automated review cycle: runs code-reviewer in a loop until clean, then finishes with code-simplifier.

### Basic Usage

```bash
# After implementing a feature, run the full cycle
/devcoffee:maximus
```

### Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--pause-reviews` | off | Pause after each code-reviewer round |
| `--pause-simplifier` | off | Pause before running code-simplifier |
| `--pause-major` | off | Pause only when critical/major issues found |
| `--max-rounds N` | 5 | Maximum review rounds before stopping |
| `--interactive` | off | Enable all pauses |

### Examples

```bash
# Default: fully autonomous, 5 max rounds
/devcoffee:maximus

# Interactive mode - pause at every step
/devcoffee:maximus --interactive

# Custom max rounds
/devcoffee:maximus --max-rounds 10

# Only pause if something serious is found
/devcoffee:maximus --pause-major

# Pause before simplification to review changes first
/devcoffee:maximus --pause-simplifier

# Combine flags
/devcoffee:maximus --pause-simplifier --max-rounds 3
```

### What Gets Reviewed

Maximus automatically detects what to review in this priority order:

| Priority | Source | Detection |
|----------|--------|-----------|
| 1 | Uncommitted changes | `git diff --name-only` (staged + unstaged) |
| 2 | Unpushed commits | `git diff --name-only @{upstream}..HEAD` |

If you have 2 commits ahead of origin but no uncommitted changes, maximus will review those 2 commits.

### Workflow

```
┌─────────────────────────────────────┐
│ Detect changed files                │
│ (uncommitted → unpushed commits)    │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Round N: code-reviewer              │◄──┐
│ → Found X issues                    │   │
└─────────────────────────────────────┘   │
              │                           │
              ▼                           │
┌─────────────────────────────────────┐   │
│ Implement fixes                     │   │
└─────────────────────────────────────┘   │
              │                           │
              ▼                           │
        Issues remain? ───────────────────┘
              │ No
              ▼
┌─────────────────────────────────────┐
│ code-simplifier                     │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Summary Report                      │
└─────────────────────────────────────┘
```

### Sample Output

```
## Maximus Review Cycle Complete

### Review Rounds

| Round | Issues Found | Issues Fixed | Status |
|-------|--------------|--------------|--------|
| 1     | 3            | 3            | Fixed  |
| 2     | 1            | 1            | Fixed  |
| 3     | 0            | -            | Clean  |

### Issue Summary
- Total issues found: 4
- Total issues fixed: 4
- Remaining issues: None

### Timeline
1. Initial scan → 3 issues (1 critical, 2 minor)
2. Round 1 fixes → Fixed null check, validation, error handling
3. Verification scan → 1 new issue (edge case)
4. Round 2 fixes → Added boundary check
5. Final scan → Clean
6. Simplification → Reduced complexity, improved naming

### Result: PASS
```

---

## License

MIT
