# Dev Coffee

A collection of productivity tools for Claude Code focused on code quality and development efficiency.

## Available Tools

### Commands (explicit invocation)

| Command | Description |
|---------|-------------|
| `/devcoffee:buzzminson` | Feature implementation with planning, feedback loops, and quality assurance |
| `/devcoffee:maximus` | Full review cycle: code-reviewer loop + code-simplifier |

### Agents (can be spawned or mentioned)

| Agent | Description |
|-------|-------------|
| `@devcoffee:buzzminson` | Feature implementation agent with structured workflow |
| `@devcoffee:maximus` | Full review cycle as a subagent |

Both invoke the same workflow - use whichever is more convenient:
- `/devcoffee:command` - Type the slash command directly
- `@devcoffee:agent` - Mention in conversation or let Claude spawn it

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

## Buzzminson 🌚🐝

Feature implementation agent with upfront clarification, iterative development, and integrated quality assurance.

### When to Use

**Use buzzminson for:**
- Mid to large features on existing apps
- Isolated, well-defined functionality
- Bug fixes requiring implementation
- Tasks that benefit from planning and feedback

**Don't use buzzminson for:**
- Very small tasks or trivial bug fixes
- Package updates
- Documentation-only changes
- Git operations (commits, pushes, etc.)

### Basic Usage

```bash
# Let buzzminson implement a feature
/devcoffee:buzzminson Add user authentication with JWT

# Or just mention it in conversation
"Have @devcoffee:buzzminson implement the dashboard component"

# With a markdown file of tasks
/devcoffee:buzzminson Implement features from docs/tasks.md
```

### Workflow

```
┌─────────────────────────────────────┐
│ 1. Clarification Phase              │
│ → Ask questions OR YOLO it          │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 2. Implementation Phase             │
│ → Build feature fully               │
│ → Update tracking document          │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 3. Review & Feedback                │
│ → Summarize changes                 │◄──┐
│ → Gather user feedback              │   │
└─────────────────────────────────────┘   │
              │                           │
        User feedback? ───────────────────┘
              │ Ready for QA
              ▼
┌─────────────────────────────────────┐
│ 4. Quality Assurance (Maximus)      │
│ → Review, fix, simplify             │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 5. Final Summary & Commit           │
└─────────────────────────────────────┘
```

### Features

**Upfront Clarification**
- Buzzminson asks questions before starting
- Choose "Answer the questions" to clarify details
- Choose "Skip questions - use your best judgment" to proceed with assumptions

**Living Documentation**
- Creates tracking document at `docs/buzzminson/YYYY-MM-DD-feature-name.md`
- Tracks tasks, decisions, changes, and problems
- Serves as audit trail and context

**Iterative Feedback**
- After implementation, gather feedback
- Iterate until you're satisfied
- Maintains context across feedback loops

**Integrated Quality Assurance**
- Hands off to maximus when ready
- Full review-fix-simplify cycle
- Commit checkpoints before and after maximus

**Backburner Tracking**
- Non-critical enhancements tracked separately
- Focus on current task
- Document future improvements

### Example Session

```
User: /devcoffee:buzzminson Add dark mode support

Buzzminson: Moon Buzzminson has some questions before getting started 🌚 🐝
  [ ] Skip questions - use your best judgment
  [ ] Answer the questions

User: [Selects "Answer the questions"]

Buzzminson:
  Q1: Should dark mode be a toggle or auto-detect system preference?
  Q2: Which components need dark mode support?

User: [Answers questions]

Buzzminson: [Implements feature, updates tracking doc]

Buzzminson: Implementation Complete 🐝
  Summary: Added dark mode with theme toggle...

  What's next?
  Do you have any feedback or should I run maximus for quality assurance? 🌚

User: Looks good, run maximus

Buzzminson: Should I commit the current changes before running maximus?

User: Yes

Buzzminson: [Runs maximus for review-fix-simplify cycle]

Buzzminson: Buzzminson + Maximus Cycle Complete ✅
  Summary: Implemented dark mode with full quality assurance...
  Backburner Items: None

  Anything else or should I commit?

User: Commit it

Buzzminson: ✅ Ready to commit!
```

### Tracking Documents

All buzzminson sessions create implementation logs at:
```
docs/buzzminson/YYYY-MM-DD-descriptive-name.md
```

These documents include:
- High-level summary
- Task breakdown (planned, completed, backburner)
- Questions and clarifications
- Key decisions and assumptions
- Implementation details and changes
- Problems and roadblocks
- Testing instructions
- Maximus review results
- Session timeline

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

### Simplification Summary
- **Files processed:** 2
- **Total improvements:** 4

#### Improvements by Category
- **Extract Function:** 1 improvement
- **Reduce Nesting:** 1 improvement
- **Rename Variable:** 1 improvement
- **Simplify Logic:** 1 improvement

### Timeline
1. Initial scan → 3 issues (1 critical, 2 minor)
2. Round 1 fixes → Fixed null check, validation, error handling
3. Verification scan → 1 new issue (edge case)
4. Round 2 fixes → Added boundary check
5. Final scan → Clean
6. Simplification Results:
   - file1.ts: Extracted helper function (reduced 25 lines), renamed 'x' to 'position'
   - file2.ts: Flattened nested conditionals (3 levels → 1), simplified boolean logic

### Result: PASS
```

---

## License

MIT
