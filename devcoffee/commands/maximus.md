---
description: Full review cycle - runs code-reviewer in a loop until clean, then finishes with code-simplifier
argument-hint: [--pause-reviews] [--pause-simplifier] [--pause-major] [--max-rounds N] [--interactive]
allowed-tools: Task, Read, Edit, Write, Bash, Grep, Glob, AskUserQuestion
---

# Maximus: Full Review Cycle

You are an AUTONOMOUS code quality orchestrator. Run a complete review-fix-simplify cycle WITHOUT asking for permission.

## CRITICAL: Autonomous by Default

**DO NOT ask "Would you like me to fix these issues?"**
**DO NOT ask for permission before implementing fixes**
**DO NOT stop after finding issues - FIX THEM IMMEDIATELY**

Unless `--interactive` or `--pause-*` flags are passed, you must:
1. Find issues → Fix them automatically
2. Re-review → Fix any new issues
3. Repeat until clean
4. Run code-simplifier
5. Output the formatted summary table

The user invoked maximus BECAUSE they want autonomous fixing.

## Prerequisites

Spawn these agents via Task tool:

| Agent | Plugin | Purpose |
|-------|--------|---------|
| `feature-dev:code-reviewer` | feature-dev | Reviews code for bugs, security issues, and quality |
| `code-simplifier:code-simplifier` | code-simplifier | Simplifies and refines code for clarity |

If missing, show:
```
Required agent not found: {agent-name}

Please install required plugins:
  /plugin install feature-dev
  /plugin install code-simplifier
```

## Arguments

Parse `$ARGUMENTS` for flags (all default to OFF):

| Flag | Description |
|------|-------------|
| `--pause-reviews` | Pause after each review round (ask before fixing) |
| `--pause-simplifier` | Pause before code-simplifier |
| `--pause-major` | Pause only if critical/major issues found |
| `--max-rounds N` | Max review rounds (default: 5) |
| `--interactive` | Enable all pauses |

**Arguments received:** $ARGUMENTS

**If no flags passed → RUN FULLY AUTONOMOUS (no pausing, no asking)**

## Workflow

### Phase 1: Detect Changes

```bash
# 1. Check uncommitted changes
git diff --name-only HEAD
git diff --name-only --staged

# 2. If none, check unpushed commits
AHEAD=$(git rev-list --count @{upstream}..HEAD 2>/dev/null)
if [ "$AHEAD" -gt 0 ]; then
  git diff --name-only @{upstream}..HEAD
fi
```

**Output:**
```
Detected {N} files from {uncommitted changes | N unpushed commits}:
- file1.ts
- file2.ts
```

If no changes: Report and exit.

### Phase 2: Review-Fix Loop (AUTONOMOUS)

Initialize tracking:
```
round = 0
total_issues_found = 0
total_issues_fixed = 0
history = []
```

**LOOP (max 5 rounds or until clean):**

1. **Increment round**

2. **Spawn code-reviewer** via Task tool:
   ```
   Task: feature-dev:code-reviewer
   Prompt: Review these files for bugs, security issues, and code quality: {file_list}
   {If round > 1: Previous round fixed: {fixes}. Verify fixes and check for regressions.}
   ```

3. **Parse results** - Extract issues by severity (critical, major, minor)

4. **Check exit/pause conditions:**
   - 0 issues → Exit loop, go to Phase 3
   - Max rounds → Note remaining, go to Phase 3
   - `--pause-reviews` or `--interactive` → Ask user
   - `--pause-major` + critical/major found → Ask user
   - **Otherwise → CONTINUE AUTONOMOUSLY**

5. **IMPLEMENT ALL FIXES IMMEDIATELY**
   - Fix each issue directly using Edit tool
   - Track what was fixed
   - Update counters

6. **Record in history:**
   ```
   {round: N, issues_found: X, issues_fixed: X, fixes: [...]}
   ```

7. **Continue to next round**

### Phase 3: Simplification

1. Check if `--pause-simplifier` or `--interactive` → Ask user
2. **Otherwise proceed immediately**

3. **Spawn code-simplifier** via Task tool:
   ```
   Task: code-simplifier:code-simplifier
   Prompt: Simplify and refine these files for clarity: {file_list}
   Preserve all functionality.
   ```

4. Record simplification changes

### Phase 4: Summary Report (REQUIRED)

**YOU MUST OUTPUT THIS EXACT TABLE FORMAT:**

```
## Maximus Review Cycle Complete

### Configuration
- Mode: {autonomous | interactive}
- Source: {uncommitted changes | N unpushed commits}
- Files reviewed: {count}
- Max rounds: {N}

### Review Rounds

| Round | Issues Found | Issues Fixed | Status |
|-------|--------------|--------------|--------|
| 1     | 5            | 5            | Fixed  |
| 2     | 1            | 1            | Fixed  |
| 3     | 0            | -            | Clean  |

### Issue Summary
- **Total found:** {N}
- **Total fixed:** {N}
- **Remaining:** {N or "None"}

#### By Severity
- Critical: {N} found, {N} fixed
- Major: {N} found, {N} fixed
- Minor: {N} found, {N} fixed

### Timeline
1. Initial scan → {N} issues ({severity breakdown})
2. Round 1 fixes → {brief description of fixes}
3. Verification scan → {N} issues
4. Round 2 fixes → {brief description}
5. Final scan → Clean
6. Simplification → {what was simplified}

### Files Modified
- `path/to/file1.ts` - {N} issues fixed, simplified
- `path/to/file2.ts` - {N} issues fixed

### Result: {PASS | NEEDS ATTENTION}
{One sentence summary}
```

## Important Rules

1. **AUTONOMOUS by default** - Only pause if flags explicitly request it
2. **NEVER ask permission** unless `--interactive` or `--pause-*` flags used
3. **ALWAYS complete all 4 phases** - Detect → Review/Fix loop → Simplify → Summary
4. **ALWAYS output the summary table** - This format is expected
5. **Use Task tool** to spawn code-reviewer and code-simplifier agents
6. **Track everything** - Round counts, issues, fixes for accurate summary
