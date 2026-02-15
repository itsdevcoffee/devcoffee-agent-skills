# Superpowers vs Dev Coffee Plugin Comparison: Skill Naming & Autocomplete Analysis

**Date:** 2026-02-15
**Purpose:** Deep analysis of the superpowers plugin (github.com/obra/superpowers) compared against our tldr, devcoffee, and maximus-loop plugins to diagnose and fix autocomplete issues in the tldr plugin.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Root Cause: Why TLDR Autocomplete Is Broken](#root-cause-why-tldr-autocomplete-is-broken)
3. [How Claude Code Plugin Discovery Works](#how-claude-code-plugin-discovery-works)
4. [Superpowers Plugin Analysis](#superpowers-plugin-analysis)
5. [Our Working Plugins Analysis](#our-working-plugins-analysis)
6. [Our Broken Plugin Analysis (TLDR)](#our-broken-plugin-analysis-tldr)
7. [Side-by-Side Comparison](#side-by-side-comparison)
8. [Concrete Fix: Exactly What to Change](#concrete-fix-exactly-what-to-change)

---

## Executive Summary

**The problem:** The tldr plugin has NO `commands/` directory. It only has `skills/`. In Claude Code, only files in `commands/` create slash commands that appear in autocomplete. Skills are background knowledge loaded via the `Skill` tool -- they never appear in the autocomplete dropdown.

**The solution:** Create a `commands/` directory in the tldr plugin with four command files that delegate to the corresponding skills. This is exactly the pattern used by both superpowers and our own maximus-loop plugin.

**Why our previous attempts failed:**
- Removing `name` fields from skills had no effect on autocomplete because skills never appear in autocomplete.
- Adding `name: feedback` to a skill made the Skill tool resolve it as `/feedback` (top-level), but skills still do not appear in autocomplete.
- The H1 heading behavior (`/TLDR`, `/TLDR Feedback`) was likely from Claude attempting to invoke the skill content as if it were a command.

---

## Root Cause: Why TLDR Autocomplete Is Broken

### The Architecture of Claude Code Plugins

Claude Code plugins have three component types, each in its own directory:

| Component | Directory | Purpose | Creates Slash Command? |
|-----------|-----------|---------|----------------------|
| **Commands** | `commands/` | Slash commands in autocomplete | **YES** -- auto-discovered, shown in `/help` |
| **Skills** | `skills/` | Background knowledge loaded via Skill tool | **NO** -- never shown in autocomplete |
| **Agents** | `agents/` | Subagent definitions for Task tool | **NO** -- dispatched programmatically |

### The Critical Insight

**Commands create slash commands. Skills do not.**

The `commands/` directory is the ONLY mechanism for creating entries in Claude Code's autocomplete. Files in `commands/` are auto-discovered at plugin load time and registered as native slash commands.

Skills in `skills/` are reference material. They are loaded when Claude decides (or is told) to use the Skill tool. They have NO autocomplete presence.

### What TLDR Has vs What It Needs

```
CURRENT (broken):                    NEEDED (working):
tldr/                                tldr/
  skills/                              commands/          <-- MISSING
    tldr/SKILL.md                        tldr.md          <-- creates /tldr
    feedback/SKILL.md                    feedback.md      <-- creates /tldr:feedback
    note/SKILL.md                        note.md          <-- creates /tldr:note
    review/SKILL.md                      review.md        <-- creates /tldr:review
  .claude-plugin/                      skills/
    plugin.json                          tldr/SKILL.md
                                         feedback/SKILL.md
                                         note/SKILL.md
                                         review/SKILL.md
                                       .claude-plugin/
                                         plugin.json
```

---

## How Claude Code Plugin Discovery Works

### Command Discovery (from official Claude Code documentation)

```
plugin-name/
  commands/                    # Auto-discovered commands
    foo.md                     # Creates /foo (plugin:plugin-name)
    bar.md                     # Creates /bar (plugin:plugin-name)
  plugin.json
```

**Key rules:**
1. All `.md` files in `commands/` are auto-discovered at plugin load time
2. The **filename** (without `.md`) becomes the slash command name
3. Commands are namespaced as `plugin-name:command-name` (e.g., `/tldr:feedback`)
4. The `name` field in frontmatter sets the display name but the filename determines the command
5. Commands appear in `/help` output with plugin attribution

### Skill Discovery

```
plugin-name/
  skills/
    skill-name/
      SKILL.md               # Loaded via Skill tool
      references/             # Supporting material
```

**Key rules:**
1. Skills are discovered from `skills/` subdirectories
2. Each skill lives in a directory containing `SKILL.md`
3. The **directory name** becomes the skill identifier
4. Skills are invoked via the `Skill` tool (e.g., `Skill: plugin-name:skill-name`)
5. Skills NEVER appear in autocomplete -- they are background knowledge

### Command-to-Skill Delegation Pattern

The standard pattern (used by both superpowers and maximus-loop) is:
1. Create a thin **command** file in `commands/` (appears in autocomplete)
2. Command body says "Invoke the plugin:skill-name skill and follow it"
3. Actual logic lives in the **skill** in `skills/`

This gives you both:
- Autocomplete presence (from the command)
- Rich, detailed instructions (from the skill)

---

## Superpowers Plugin Analysis

### Plugin Metadata

```json
// .claude-plugin/plugin.json
{
  "name": "superpowers",
  "version": "4.3.0",
  "description": "Core skills library for Claude Code: TDD, debugging, collaboration patterns, and proven techniques"
}
```

### Directory Structure

```
superpowers/
  .claude-plugin/
    plugin.json
    marketplace.json
  commands/                            # 3 command files
    brainstorm.md
    execute-plan.md
    write-plan.md
  skills/                              # 14 skill directories
    brainstorming/SKILL.md
    dispatching-parallel-agents/SKILL.md
    executing-plans/SKILL.md
    finishing-a-development-branch/SKILL.md
    receiving-code-review/SKILL.md
    requesting-code-review/SKILL.md
    subagent-driven-development/SKILL.md
    systematic-debugging/SKILL.md
    test-driven-development/SKILL.md
    using-git-worktrees/SKILL.md
    using-superpowers/SKILL.md
    verification-before-completion/SKILL.md
    writing-plans/SKILL.md
    writing-skills/SKILL.md
  agents/                              # 1 agent
    code-reviewer.md
```

### Command Frontmatter Pattern (all 3 commands)

```yaml
# commands/brainstorm.md
---
description: "You MUST use this before any creative work..."
disable-model-invocation: true
---

Invoke the superpowers:brainstorming skill and follow it exactly as presented to you
```

```yaml
# commands/execute-plan.md
---
description: Execute plan in batches with review checkpoints
disable-model-invocation: true
---

Invoke the superpowers:executing-plans skill and follow it exactly as presented to you
```

```yaml
# commands/write-plan.md
---
description: Create detailed implementation plan with bite-sized tasks
disable-model-invocation: true
---

Invoke the superpowers:writing-plans skill and follow it exactly as presented to you
```

**Pattern observations:**
- Commands have NO `name` field in frontmatter -- the filename IS the command name
- Commands use `description` and `disable-model-invocation: true`
- Command body is a single line delegating to the skill
- Commands reference skills as `superpowers:{skill-name}` (plugin:skill format)
- Only 3 of 14 skills have corresponding commands (not every skill needs a slash command)

### Skill Frontmatter Pattern (all 14 skills)

Every skill follows this exact pattern:

```yaml
---
name: skill-name-with-hyphens
description: Use when [specific triggering conditions]
---

# Skill Title
...
```

**Key observations:**
- Skills always have both `name` and `description`
- `name` uses lowercase with hyphens
- `description` starts with "Use when..." (triggering conditions only, no workflow summary)
- Only 2 fields: `name` and `description` (max 1024 chars total)
- The skill name matches the directory name (e.g., `name: brainstorming` in `skills/brainstorming/SKILL.md`)

### Agent Frontmatter Pattern

```yaml
# agents/code-reviewer.md
---
name: code-reviewer
description: |
  Use this agent when a major project step has been completed...
model: inherit
---
```

### Complete Skill Name Inventory

| Directory Name | `name` in SKILL.md | Match? |
|---------------|-------------------|--------|
| brainstorming | brainstorming | YES |
| dispatching-parallel-agents | dispatching-parallel-agents | YES |
| executing-plans | executing-plans | YES |
| finishing-a-development-branch | finishing-a-development-branch | YES |
| receiving-code-review | receiving-code-review | YES |
| requesting-code-review | requesting-code-review | YES |
| subagent-driven-development | subagent-driven-development | YES |
| systematic-debugging | systematic-debugging | YES |
| test-driven-development | test-driven-development | YES |
| using-git-worktrees | using-git-worktrees | YES |
| using-superpowers | using-superpowers | YES |
| verification-before-completion | verification-before-completion | YES |
| writing-plans | writing-plans | YES |
| writing-skills | writing-skills | YES |

**100% match between directory names and skill `name` fields.**

---

## Our Working Plugins Analysis

### maximus-loop Plugin (WORKS CORRECTLY)

**Plugin name:** `maximus-loop`

**Structure:**
```
maximus-loop/
  .claude-plugin/
    plugin.json                        # name: "maximus-loop"
  commands/                            # 4 command files
    maximus-init.md
    maximus-plan.md
    maximus-review.md
    maximus-validate.md
  skills/                              # 4 skill directories
    maximus-init/SKILL.md
    maximus-plan/SKILL.md
    maximus-review/SKILL.md
    maximus-validate/SKILL.md
  agents/                              # 4 agent files
    maximus-init.md
    maximus-plan.md
    maximus-review.md
    maximus-validate.md
```

**Command frontmatter pattern:**

```yaml
# commands/maximus-init.md
---
name: maximus-init
description: Project-aware Maximus Loop initialization...
tools: Read, Write, Bash, Glob, Grep, AskUserQuestion, TaskCreate, TaskUpdate, TaskList
---

Invoke the maximus-loop:maximus-init skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

**Key observations:**
- Commands DO have `name` field (unlike superpowers which omits it)
- Command names match the filename: `maximus-init.md` has `name: maximus-init`
- Command body delegates to skill: `maximus-loop:maximus-init`
- Commands include `tools` field and `$ARGUMENTS` passthrough
- Each command has a corresponding skill AND agent

**Skill frontmatter pattern:**

```yaml
# skills/maximus-init/SKILL.md
---
name: maximus-init
description: This skill should be used when the user asks to "set up maximus"...
---
```

**Result:** Creates autocomplete entries `/maximus-init`, `/maximus-plan`, `/maximus-review`, `/maximus-validate` that appear as `(plugin:maximus-loop)`.

### devcoffee Plugin (WORKS CORRECTLY)

**Plugin name:** `devcoffee`

**Structure:**
```
devcoffee/
  .claude-plugin/
    plugin.json                        # name: "devcoffee"
  commands/                            # 2 command files
    buzzminson.md
    maximus.md
  agents/                              # 2 agent files
    buzzminson.md
    maximus.md
```

**Command frontmatter pattern:**

```yaml
# commands/buzzminson.md
---
name: buzzminson
description: Feature implementation agent...
argument-hint: [task description or path to markdown file]
tools: Task
---
```

**Note:** devcoffee has commands and agents but NO skills directory. Commands contain the full implementation logic inline.

**Result:** Creates autocomplete entries `/buzzminson` and `/maximus` that appear as `(plugin:devcoffee)`.

---

## Our Broken Plugin Analysis (TLDR)

### Plugin Metadata

```json
// .claude-plugin/plugin.json
{
  "name": "tldr",
  "version": "1.1.1",
  "description": "Conversation summarization for Claude Code..."
}
```

### Structure (CURRENT -- BROKEN)

```
tldr/
  .claude-plugin/
    plugin.json                        # name: "tldr"
    plugin-metadata.json
  skills/                              # 4 skill directories
    tldr/SKILL.md
    feedback/SKILL.md
    note/SKILL.md
    review/SKILL.md
  docs/                                # Evaluation data
    design/
    evaluation/
```

**NO `commands/` directory exists.**
**NO `agents/` directory exists.**

### Skill Frontmatter (CURRENT)

```yaml
# skills/tldr/SKILL.md
---
name: tldr
description: >-
  This skill should be used when the user asks for a TLDR, summary, recap...
---

# tldr
```

```yaml
# skills/feedback/SKILL.md
---
name: feedback
description: >-
  This skill should be used when the user asks to "rate this tldr"...
---

# feedback
```

```yaml
# skills/note/SKILL.md
---
name: note
description: >-
  This skill should be used when the user asks to "note a tldr improvement"...
---

# note
```

```yaml
# skills/review/SKILL.md
---
name: review
description: >-
  This skill should be used when the user asks to "review tldr notes"...
---

# review
```

### Why Each Attempt Failed

**Attempt 1: Removing `name` fields**
- Skills showed up from H1 headings as `/TLDR`, `/TLDR Feedback`
- This is because without a `name`, the Skill tool falls back to the H1 heading as the identifier
- But skills STILL do not appear in autocomplete -- whatever was showing was a different mechanism (possibly Claude attempting to treat the skill as a command)

**Attempt 2: Adding `name: feedback`**
- The Skill tool resolved `feedback` as a top-level skill name
- It appeared as `/feedback` (not `/tldr:feedback`) because the Skill tool resolution uses the skill name directly
- But again, skills do not create autocomplete entries -- the autocomplete issue remains unresolved

**The fundamental mistake:** Both attempts modified skill frontmatter, but skills NEVER create autocomplete entries. Only commands do.

---

## Side-by-Side Comparison

### Component: Slash Commands (Autocomplete Entries)

| Aspect | superpowers | maximus-loop | devcoffee | TLDR (broken) |
|--------|-------------|--------------|-----------|---------------|
| Has `commands/` dir? | YES (3 files) | YES (4 files) | YES (2 files) | **NO** |
| Command creates autocomplete? | YES | YES | YES | N/A |
| Command delegates to skill? | YES | YES | Inline logic | N/A |
| Delegation format | `superpowers:brainstorming` | `maximus-loop:maximus-init` | N/A (inline) | N/A |
| `name` in command frontmatter? | NO (uses filename) | YES (matches filename) | YES (matches filename) | N/A |

### Component: Skills (Background Knowledge)

| Aspect | superpowers | maximus-loop | TLDR (broken) |
|--------|-------------|--------------|---------------|
| Has `skills/` dir? | YES (14 dirs) | YES (4 dirs) | YES (4 dirs) |
| Skill creates autocomplete? | **NO** | **NO** | **NO** |
| `name` in SKILL.md? | YES (always) | YES (always) | YES (always) |
| Name matches directory? | YES (100%) | YES (100%) | YES (100%) |
| Description format | "Use when..." | "This skill should be used when..." | "This skill should be used when..." |

### Component: Agents (Subagent Definitions)

| Aspect | superpowers | maximus-loop | devcoffee | TLDR (broken) |
|--------|-------------|--------------|-----------|---------------|
| Has `agents/` dir? | YES (1 file) | YES (4 files) | YES (2 files) | **NO** |
| Agent creates autocomplete? | **NO** | **NO** | **NO** | N/A |

### The Pattern That Works

Every plugin with working slash commands follows this pattern:

```
plugin/
  commands/           <-- REQUIRED for autocomplete
    command-name.md   <-- Each file = one slash command
  skills/             <-- Optional, for rich logic
    skill-name/
      SKILL.md        <-- Loaded by Skill tool when needed
```

The command file is a thin wrapper:
```markdown
---
description: Brief description for autocomplete tooltip
---

Invoke the plugin-name:skill-name skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

---

## Concrete Fix: Exactly What to Change

### Step 1: Create the `commands/` Directory

Create four files in `tldr/commands/`:

#### `tldr/commands/tldr.md`

```yaml
---
description: Create a hyper-condensed bullet-point summary of content from the current conversation
---

Invoke the tldr:tldr skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

#### `tldr/commands/feedback.md`

```yaml
---
description: Evaluate a TLDR sample against quality criteria and log results for improvement tracking
---

Invoke the tldr:feedback skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

#### `tldr/commands/note.md`

```yaml
---
description: Quick-capture a TLDR improvement idea, bug, or feature request without disrupting workflow
argument-hint: "[context] [--ex example]"
---

Invoke the tldr:note skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

#### `tldr/commands/review.md`

```yaml
---
description: Guided triage session through pending TLDR improvement notes
---

Invoke the tldr:review skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

### Step 2: Verify Expected Autocomplete Results

After creating the commands, the expected autocomplete entries will be:

| Typed | Autocomplete Shows | Source |
|-------|-------------------|--------|
| `/tldr` | `/tldr` (plugin:tldr) | `commands/tldr.md` |
| `/feedback` | `/feedback` (plugin:tldr) | `commands/feedback.md` |
| `/note` | `/note` (plugin:tldr) | `commands/note.md` |
| `/review` | `/review` (plugin:tldr) | `commands/review.md` |

**Important note on namespacing:** Based on the Claude Code documentation and how maximus-loop works, the commands appear in autocomplete by their filename (e.g., `/feedback`), with the plugin attribution shown in parentheses (e.g., `(plugin:tldr)`). The colon-namespaced format (`/tldr:feedback`) is used for programmatic invocation (e.g., `Skill: tldr:feedback`) and to disambiguate when multiple plugins define the same command name.

If you want the autocomplete to literally show `/tldr:feedback` instead of `/feedback`, you would need to name the command file `tldr:feedback.md` -- but colons in filenames are problematic on many systems. The standard approach (as used by maximus-loop) is to use descriptive command names that include the plugin prefix in the filename:

**Alternative (prefix approach, matching maximus-loop pattern):**

| File | Autocomplete |
|------|-------------|
| `commands/tldr.md` | `/tldr` |
| `commands/tldr-feedback.md` | `/tldr-feedback` |
| `commands/tldr-note.md` | `/tldr-note` |
| `commands/tldr-review.md` | `/tldr-review` |

This mirrors the maximus-loop approach where commands are named `maximus-init`, `maximus-plan`, etc. -- with the plugin name as a prefix in the command name itself.

### Step 3: Keep Existing Skills Unchanged

The skill files in `skills/` should remain as-is. They contain the actual logic. The commands are thin wrappers that delegate to them.

### Step 4: Update CLAUDE.md (Optional)

Update the architecture section of `tldr/CLAUDE.md` to reflect the new `commands/` directory.

### Summary of Changes Required

```
CREATE: tldr/commands/tldr.md              (5-6 lines)
CREATE: tldr/commands/feedback.md          (5-6 lines)
CREATE: tldr/commands/note.md              (6-7 lines)
CREATE: tldr/commands/review.md            (5-6 lines)
MODIFY: tldr/CLAUDE.md                     (add commands/ to architecture diagram)
NO CHANGES: skills/ files remain untouched
NO CHANGES: plugin.json remains untouched
```

### Decision Required: Naming Convention

Choose one of these naming approaches:

**Option A: Short names (like superpowers)**
- Files: `tldr.md`, `feedback.md`, `note.md`, `review.md`
- Autocomplete: `/tldr`, `/feedback`, `/note`, `/review`
- Risk: Generic names like `/feedback`, `/note`, `/review` could conflict with other plugins
- Disambiguation: User types `/feedback` and sees `(plugin:tldr)` in the tooltip

**Option B: Prefixed names (like maximus-loop)**
- Files: `tldr.md`, `tldr-feedback.md`, `tldr-note.md`, `tldr-review.md`
- Autocomplete: `/tldr`, `/tldr-feedback`, `/tldr-note`, `/tldr-review`
- Risk: No conflicts -- all names are unique
- This is the safer choice and matches the maximus-loop convention already used in this repo

**Recommendation: Option B (prefixed names).** It prevents conflicts, is self-documenting, and matches the existing maximus-loop convention. The user types `/tldr-` and sees all four commands.

---

## Appendix A: How the Skill Tool Resolves Names

When Claude invokes `Skill: tldr:feedback`, the resolution works as:
1. Find plugin named `tldr` (from `plugin.json` `name` field)
2. Find skill directory `feedback` within that plugin's `skills/` directory
3. Load `skills/feedback/SKILL.md`
4. The `name` field in the SKILL.md frontmatter is used by Claude to identify/reference the skill internally

This is a **programmatic** resolution path -- it happens when the Skill tool is invoked, not through autocomplete.

## Appendix B: Superpowers Command-to-Skill Mapping

| Command File | Command Name | Delegates To | Skill Directory |
|-------------|-------------|-------------|-----------------|
| `brainstorm.md` | `/brainstorm` | `superpowers:brainstorming` | `skills/brainstorming/` |
| `execute-plan.md` | `/execute-plan` | `superpowers:executing-plans` | `skills/executing-plans/` |
| `write-plan.md` | `/write-plan` | `superpowers:writing-plans` | `skills/writing-plans/` |

Note: Only 3 of 14 skills have slash commands. The other 11 skills are invoked only programmatically (by other skills or by Claude's judgment).

## Appendix C: Full Skill Frontmatter Comparison

### Superpowers Pattern

```yaml
---
name: skill-name-with-hyphens
description: Use when [triggering conditions only, no workflow summary]
---
```

- Only 2 fields: `name` and `description`
- Max 1024 chars total
- `name` uses letters, numbers, hyphens only
- `description` starts with "Use when..."
- Third person, no workflow summary in description

### TLDR Pattern (Current)

```yaml
---
name: skill-name
description: >-
  This skill should be used when the user asks to "specific phrase"...
---
```

- Same 2 fields
- Uses YAML block scalar (`>-`) for multi-line descriptions
- Description includes trigger phrases (good for Skill tool discovery)
- Slightly more verbose but functionally equivalent

### maximus-loop Pattern

```yaml
---
name: maximus-skill-name
description: This skill should be used when the user asks to "specific phrase"...
---
```

- Same pattern as TLDR
- Skill names include `maximus-` prefix (matches command names)

### Assessment

The skill frontmatter patterns across all three codebases are functionally equivalent. **The skill naming is not the issue.** The absence of `commands/` is the sole cause of the autocomplete problem.
