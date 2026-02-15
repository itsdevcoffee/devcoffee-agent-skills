# Superpowers Plugin: Naming, Autocomplete, and Skill/Command Architecture

**Date:** 2026-02-15
**Source:** https://github.com/obra/superpowers (v4.3.0)
**Purpose:** Understand exactly how slash command naming, autocomplete, and the relationship between skills/commands/agents works in a well-structured Claude Code plugin, so we can fix our broken autocomplete patterns.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [The Three File Types: Skills vs Commands vs Agents](#the-three-file-types)
3. [The `name` Field in Frontmatter](#the-name-field-in-frontmatter)
4. [How Colon-Namespacing Works](#how-colon-namespacing-works)
5. [H1 Headings in SKILL.md Files](#h1-headings)
6. [Description Fields and Autocomplete](#description-fields-and-autocomplete)
7. [How Superpowers Avoids Duplicate Autocomplete Entries](#avoiding-duplicates)
8. [The `(user)` vs `(plugin-name)` Tags](#autocomplete-tags)
9. [Complete Frontmatter Catalog](#complete-frontmatter-catalog)
10. [Side-by-Side Comparison: Superpowers vs Our Plugins](#comparison)
11. [Specific Issues in Our Plugins](#our-issues)
12. [Recommended Fixes](#recommended-fixes)

---

## Executive Summary

After reading every SKILL.md, every command file, and every agent file in the superpowers repo, the key findings are:

1. **Skills and commands are fundamentally different things.** Skills are background knowledge that Claude loads via the `Skill` tool when relevant. Commands are user-facing slash commands that appear in autocomplete. Superpowers has 14 skills but only 3 commands.

2. **Skills DO use a `name` field** in YAML frontmatter. The name is a bare slug (e.g., `name: brainstorming`), never prefixed with the plugin name. The `plugin:` prefix is added automatically by Claude Code's plugin system.

3. **Commands do NOT use a `name` field.** The filename IS the command name. A file at `commands/brainstorm.md` becomes `/superpowers:brainstorm`.

4. **Not every skill needs a corresponding command.** Only 3 of superpowers' 14 skills have commands. This is how they avoid duplicate autocomplete entries.

5. **Commands are thin wrappers** that just say "invoke this skill." They exist only when a user should be able to explicitly type a slash command.

---

## The Three File Types

### Skills (`skills/<name>/SKILL.md`)

**What they are:** Reference documents that Claude loads via the `Skill` tool when it determines a skill is relevant to the current task. Skills are NOT slash commands.

**How they show up:** At startup, only the `name` and `description` from all skill frontmatter are pre-loaded into the system prompt. Claude reads the full SKILL.md only when it decides the skill is relevant. Users never directly invoke skills -- Claude does it automatically or when instructed.

**Superpowers has 14 skills:**
- brainstorming
- dispatching-parallel-agents
- executing-plans
- finishing-a-development-branch
- receiving-code-review
- requesting-code-review
- subagent-driven-development
- systematic-debugging
- test-driven-development
- using-git-worktrees
- using-superpowers
- verification-before-completion
- writing-plans
- writing-skills

### Commands (`commands/<name>.md`)

**What they are:** User-facing slash commands that appear in autocomplete. When the user types `/superpowers:`, these show up as completions.

**How they show up:** In the autocomplete dropdown when typing `/`. They appear as `/plugin-name:command-name`.

**Superpowers has only 3 commands:**
- `brainstorm` (maps to `brainstorming` skill)
- `execute-plan` (maps to `executing-plans` skill)
- `write-plan` (maps to `writing-plans` skill)

### Agents (`agents/<name>.md`)

**What they are:** Subagent definitions that can be dispatched via the `Task` tool. They define specialized roles with specific models, tools, and system prompts.

**How they show up:** NOT in autocomplete. They are invoked programmatically by other skills/commands via `Task` tool with `subagent_type` parameter.

**Superpowers has 1 agent:**
- `code-reviewer` (dispatched by the `requesting-code-review` skill)

---

## The `name` Field in Frontmatter

### Skills: ALWAYS have a `name` field

Every single SKILL.md in superpowers has a `name` field. The name is a **bare slug** -- never prefixed with the plugin name.

```yaml
# EVERY skill uses this pattern:
---
name: brainstorming
description: "You MUST use this before any creative work..."
---

# NOT this:
---
name: superpowers:brainstorming  # WRONG - never include plugin prefix
---
```

**The name matches the directory name.** The skill at `skills/brainstorming/SKILL.md` has `name: brainstorming`. The skill at `skills/test-driven-development/SKILL.md` has `name: test-driven-development`.

**Format rules from the `writing-skills` SKILL.md:**
- Use letters, numbers, and hyphens only (no parentheses, special chars)
- Max 64 characters (per Anthropic docs)
- Active voice, verb-first or gerund form preferred
- Examples: `brainstorming`, `test-driven-development`, `using-git-worktrees`

### Commands: NO `name` field

Commands in superpowers do NOT have a `name` field in their frontmatter. The **filename is the command name.**

```yaml
# commands/brainstorm.md -- no name field!
---
description: "You MUST use this before any creative work..."
disable-model-invocation: true
---

Invoke the superpowers:brainstorming skill and follow it exactly as presented to you
```

```yaml
# commands/execute-plan.md -- no name field!
---
description: Execute plan in batches with review checkpoints
disable-model-invocation: true
---

Invoke the superpowers:executing-plans skill and follow it exactly as presented to you
```

```yaml
# commands/write-plan.md -- no name field!
---
description: Create detailed implementation plan with bite-sized tasks
disable-model-invocation: true
---

Invoke the superpowers:writing-plans skill and follow it exactly as presented to you
```

**Key observation:** Command names can differ from skill names. The command is `brainstorm` but it invokes the `brainstorming` skill. The command is `execute-plan` but it invokes the `executing-plans` skill.

### Agents: HAVE a `name` field

```yaml
# agents/code-reviewer.md
---
name: code-reviewer
description: |
  Use this agent when a major project step has been completed...
model: inherit
---
```

---

## How Colon-Namespacing Works

The colon namespace (e.g., `/superpowers:brainstorm`) is **automatic and derived from the plugin name in `plugin.json`**.

```json
// .claude-plugin/plugin.json
{
  "name": "superpowers",
  ...
}
```

This means:
- Commands at `commands/brainstorm.md` become `/superpowers:brainstorm`
- Skills with `name: brainstorming` are referenced as `superpowers:brainstorming`
- Agents with `name: code-reviewer` are referenced as `superpowers:code-reviewer`

**You never write the prefix in your files.** Claude Code constructs it from:
```
{plugin.json "name"} + ":" + {filename or frontmatter name}
```

### How Skills Reference Each Other

Within the superpowers plugin, skills reference each other using the full `plugin:skill` notation:

```markdown
# From executing-plans SKILL.md:
**REQUIRED SUB-SKILL:** Use superpowers:finishing-a-development-branch

# From subagent-driven-development SKILL.md:
**Required workflow skills:**
- **superpowers:using-git-worktrees** - REQUIRED: Set up isolated workspace
- **superpowers:writing-plans** - Creates the plan this skill executes
- **superpowers:requesting-code-review** - Code review template
- **superpowers:finishing-a-development-branch** - Complete after all tasks
```

---

## H1 Headings

### Skills use HUMAN-READABLE titles for H1

Every skill uses a descriptive, human-readable H1 heading -- NOT the slug format:

| Skill `name` (slug) | H1 Heading (human-readable) |
|---|---|
| `brainstorming` | `# Brainstorming Ideas Into Designs` |
| `dispatching-parallel-agents` | `# Dispatching Parallel Agents` |
| `executing-plans` | `# Executing Plans` |
| `finishing-a-development-branch` | `# Finishing a Development Branch` |
| `receiving-code-review` | `# Code Review Reception` |
| `requesting-code-review` | `# Requesting Code Review` |
| `subagent-driven-development` | `# Subagent-Driven Development` |
| `systematic-debugging` | `# Systematic Debugging` |
| `test-driven-development` | `# Test-Driven Development (TDD)` |
| `using-git-worktrees` | `# Using Git Worktrees` |
| `using-superpowers` | `# Using Skills` |
| `verification-before-completion` | `# Verification Before Completion` |
| `writing-plans` | `# Writing Plans` |
| `writing-skills` | `# Writing Skills` |

**Pattern:** The H1 is Title Case, human-readable, sometimes with additional context (e.g., "(TDD)", "Ideas Into Designs"). The H1 does NOT need to match the slug name exactly.

### Commands use descriptive H1s

Commands use descriptive H1 headings or no H1 at all (since they are thin wrappers):

- `brainstorm.md` -- no H1, just body text: "Invoke the superpowers:brainstorming skill..."
- `execute-plan.md` -- no H1, just body text
- `write-plan.md` -- no H1, just body text

---

## Description Fields and Autocomplete

### What shows in autocomplete

The `description` field in frontmatter is what appears in the autocomplete dropdown. For skills, it is also what Claude uses to decide whether to load the skill.

### Skill descriptions: "Use when..." format

Superpowers follows a strict pattern for skill descriptions: they start with "Use when..." and describe ONLY triggering conditions, never the workflow.

```yaml
# GOOD (superpowers pattern):
description: Use when implementing any feature or bugfix, before writing implementation code

# GOOD:
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes

# BAD (summarizes workflow -- Claude may follow description instead of reading skill):
description: Use when executing plans - dispatches subagent per task with code review between tasks
```

**Critical finding from the `writing-skills` SKILL.md:**

> Testing revealed that when a description summarizes the skill's workflow, Claude may follow the description instead of reading the full skill content. A description saying "code review between tasks" caused Claude to do ONE review, even though the skill's flowchart clearly showed TWO reviews (spec compliance then code quality).

### Command descriptions: Short action descriptions

Command descriptions are brief and action-oriented:

```yaml
# commands/brainstorm.md
description: "You MUST use this before any creative work..."

# commands/execute-plan.md
description: Execute plan in batches with review checkpoints

# commands/write-plan.md
description: Create detailed implementation plan with bite-sized tasks
```

### Agent descriptions: Rich with examples

Agent descriptions include `<example>` XML tags with full conversation examples:

```yaml
# agents/code-reviewer.md
description: |
  Use this agent when a major project step has been completed...
  <example>Context: The user is creating a code-review agent...
  </example>
```

---

## Avoiding Duplicate Autocomplete Entries

### The core principle: Most skills do NOT have commands

Superpowers has **14 skills but only 3 commands**. This means 11 skills have NO corresponding slash command.

**Skills that DO have commands (3):**
| Skill | Command | Why it has a command |
|---|---|---|
| `brainstorming` | `/superpowers:brainstorm` | User explicitly kicks off brainstorming |
| `executing-plans` | `/superpowers:execute-plan` | User explicitly starts plan execution |
| `writing-plans` | `/superpowers:write-plan` | User explicitly starts plan writing |

**Skills that do NOT have commands (11):**
- `dispatching-parallel-agents` -- triggered automatically
- `finishing-a-development-branch` -- triggered by other skills
- `receiving-code-review` -- triggered automatically
- `requesting-code-review` -- triggered by other skills
- `subagent-driven-development` -- triggered by other skills
- `systematic-debugging` -- triggered automatically
- `test-driven-development` -- triggered automatically
- `using-git-worktrees` -- triggered by other skills
- `using-superpowers` -- meta skill, loaded at session start
- `verification-before-completion` -- triggered automatically
- `writing-skills` -- triggered automatically

### The `disable-model-invocation` flag

All 3 commands in superpowers use `disable-model-invocation: true`:

```yaml
---
description: "..."
disable-model-invocation: true
---
```

This prevents the command from being auto-invoked by the model. The user must explicitly type the slash command.

### Commands are THIN WRAPPERS

Each command is literally one line of body text:

```markdown
Invoke the superpowers:brainstorming skill and follow it exactly as presented to you
```

The command does not contain the actual logic. It just delegates to the skill.

---

## Autocomplete Tags

### `(user)` tag

When you create personal skills in `~/.claude/skills/`, they appear with the `(user)` tag in autocomplete.

### `(plugin-name)` tag

When skills/commands come from an installed plugin, they appear with the plugin name. For example:
- `/superpowers:brainstorm (superpowers)` in autocomplete

### What determines the tag

The tag is the `name` field from `.claude-plugin/plugin.json`. It is NOT configurable per-skill or per-command.

---

## Complete Frontmatter Catalog

### All 14 Skill Frontmatters (from superpowers)

```yaml
# skills/brainstorming/SKILL.md
---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation."
---

# skills/dispatching-parallel-agents/SKILL.md
---
name: dispatching-parallel-agents
description: Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies
---

# skills/executing-plans/SKILL.md
---
name: executing-plans
description: Use when you have a written implementation plan to execute in a separate session with review checkpoints
---

# skills/finishing-a-development-branch/SKILL.md
---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup
---

# skills/receiving-code-review/SKILL.md
---
name: receiving-code-review
description: Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable - requires technical rigor and verification, not performative agreement or blind implementation
---

# skills/requesting-code-review/SKILL.md
---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements
---

# skills/subagent-driven-development/SKILL.md
---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

# skills/systematic-debugging/SKILL.md
---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes
---

# skills/test-driven-development/SKILL.md
---
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code
---

# skills/using-git-worktrees/SKILL.md
---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated git worktrees with smart directory selection and safety verification
---

# skills/using-superpowers/SKILL.md
---
name: using-superpowers
description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
---

# skills/verification-before-completion/SKILL.md
---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always
---

# skills/writing-plans/SKILL.md
---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# skills/writing-skills/SKILL.md
---
name: writing-skills
description: Use when creating new skills, editing existing skills, or verifying skills work before deployment
---
```

### All 3 Command Frontmatters (from superpowers)

```yaml
# commands/brainstorm.md
---
description: "You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores requirements and design before implementation."
disable-model-invocation: true
---

# commands/execute-plan.md
---
description: Execute plan in batches with review checkpoints
disable-model-invocation: true
---

# commands/write-plan.md
---
description: Create detailed implementation plan with bite-sized tasks
disable-model-invocation: true
---
```

### The 1 Agent Frontmatter (from superpowers)

```yaml
# agents/code-reviewer.md
---
name: code-reviewer
description: |
  Use this agent when a major project step has been completed and needs to be reviewed against the original plan and coding standards. Examples: <example>...</example>
model: inherit
---
```

---

## Side-by-Side Comparison: Superpowers vs Our Plugins

### Superpowers Pattern (CORRECT)

```
superpowers/
  .claude-plugin/plugin.json    # name: "superpowers"
  skills/
    brainstorming/SKILL.md      # name: brainstorming (14 skills)
    test-driven-development/SKILL.md
    ...
  commands/
    brainstorm.md               # NO name field, thin wrapper (3 commands)
    execute-plan.md
    write-plan.md
  agents/
    code-reviewer.md            # name: code-reviewer (1 agent)
```

**Result:** User sees only 3 commands in autocomplete: `/superpowers:brainstorm`, `/superpowers:execute-plan`, `/superpowers:write-plan`. Skills trigger automatically via the Skill tool when Claude detects relevance.

### Our maximus-loop Pattern (PROBLEMATIC)

```
maximus-loop/
  .claude-plugin/plugin.json    # name: "maximus-loop"
  skills/
    maximus-init/SKILL.md       # name: maximus-init
    maximus-plan/SKILL.md       # name: maximus-plan
    maximus-review/SKILL.md     # name: maximus-review
    maximus-validate/SKILL.md   # name: maximus-validate
  commands/
    maximus-init.md             # name: maximus-init (DUPLICATES skill!)
    maximus-plan.md             # name: maximus-plan (DUPLICATES skill!)
    maximus-review.md           # name: maximus-review (DUPLICATES skill!)
    maximus-validate.md         # name: maximus-validate (DUPLICATES skill!)
  agents/
    maximus-init.md             # name: maximus-init (TRIPLES it!)
    maximus-plan.md             # name: maximus-plan
    maximus-review.md           # name: maximus-review
    maximus-validate.md         # name: maximus-validate
```

**Problem:** For each capability (like `maximus-plan`), there is a skill, a command, AND an agent -- all with the same name. This likely creates duplicate or triple entries in autocomplete.

### Our tldr Pattern (PARTIALLY CORRECT)

```
tldr/
  .claude-plugin/plugin.json    # name: "tldr"
  skills/
    tldr/SKILL.md               # name: tldr
    feedback/SKILL.md           # name: feedback
    note/SKILL.md               # name: note
    review/SKILL.md             # name: review
  commands/
    (none)
```

**This is actually closer to correct** -- skills exist, no commands duplicate them. But the lack of commands means there are no explicit slash commands for `/tldr:tldr`, `/tldr:feedback`, etc. Users must rely on Claude auto-detecting relevance.

### Our devcoffee Pattern (MIXED)

```
devcoffee/
  .claude-plugin/plugin.json    # name: "devcoffee"
  skills/
    (none -- devcoffee has no skills!)
  commands/
    buzzminson.md               # name: buzzminson
    maximus.md                  # name: maximus
  agents/
    buzzminson.md               # name: buzzminson
    maximus.md                  # name: maximus
```

**Observation:** Commands and agents share the same names. Commands have `name` fields (superpowers commands do not). No skills at all.

---

## Specific Issues in Our Plugins

### Issue 1: Commands have `name` fields (they should not)

Superpowers commands do NOT have `name` fields. The filename IS the command name. Our commands all have `name:` in their frontmatter:

```yaml
# OUR commands/maximus-init.md (WRONG)
---
name: maximus-init
description: ...
tools: ...
---

# SUPERPOWERS commands/brainstorm.md (CORRECT)
---
description: ...
disable-model-invocation: true
---
```

**Impact:** The `name` field in commands may cause Claude Code to register the command under both the filename AND the name field, or it may cause unexpected behavior. At minimum, it is unnecessary.

### Issue 2: Every skill has a matching command (creating duplicates)

In maximus-loop, every single skill has a matching command with the same name. Superpowers only creates commands for 3 of 14 skills -- specifically the ones users should explicitly invoke.

**Fix:** Remove commands for skills that should trigger automatically. Only keep commands for things users explicitly type.

### Issue 3: Every skill+command has a matching agent (triple registration)

In maximus-loop, every skill also has a matching agent with the same name. This means `maximus-plan` exists as:
- A skill at `skills/maximus-plan/SKILL.md`
- A command at `commands/maximus-plan.md`
- An agent at `agents/maximus-plan.md`

Superpowers never does this. The `code-reviewer` agent exists ONLY as an agent, not as a skill or command.

### Issue 4: Commands contain full implementation logic

Our commands contain the full agent prompt and logic. Superpowers commands are one-line wrappers:

```markdown
# Superpowers command (1 line):
Invoke the superpowers:brainstorming skill and follow it exactly as presented to you

# Our command (100+ lines):
[Full agent prompt, system instructions, examples, etc.]
```

### Issue 5: Descriptions are verbose trigger lists

Our descriptions are long lists of trigger phrases:

```yaml
# OUR PATTERN:
description: This skill should be used when the user asks to "rate this tldr",
  "evaluate this tldr", "score this summary", "grade this tldr", ...

# SUPERPOWERS PATTERN:
description: Use when implementing any feature or bugfix, before writing implementation code
```

Superpowers descriptions are concise "Use when..." statements focused on conditions, not trigger phrase enumeration.

### Issue 6: Extra frontmatter fields in skills

Some of our skills have non-standard frontmatter fields:

```yaml
# opentui-builder SKILL.md:
version: 0.2.0
framework:
  name: "@opentui/core"
  tested: "0.1.79"
  compatible: "^0.1.70"
status: experimental
last-updated: "2026-02-14"

# remotion-best-practices SKILL.md:
metadata:
  tags: remotion, video, react, animation, composition
```

Superpowers and Anthropic docs are explicit: **only two fields are supported in skill frontmatter: `name` and `description`.** Max 1024 characters total. Everything else is ignored or may cause issues.

### Issue 7: Missing `disable-model-invocation` on commands

Our commands do not use `disable-model-invocation: true`. Superpowers uses it on all 3 commands. Without this flag, Claude may auto-invoke commands that should only be triggered by explicit user action.

---

## Recommended Fixes

### Fix 1: Remove `name` fields from command frontmatter

Commands should derive their name from the filename. Remove `name:` from all command files.

**Before:**
```yaml
---
name: maximus-plan
description: ...
---
```

**After:**
```yaml
---
description: ...
disable-model-invocation: true
---
```

### Fix 2: Eliminate skill/command/agent triplication

For each capability, decide: is it a **skill** (background knowledge, auto-triggered), a **command** (user-facing slash command), or an **agent** (subagent dispatched by other skills)?

**maximus-loop example:**

| Capability | Keep as Skill? | Keep as Command? | Keep as Agent? |
|---|---|---|---|
| maximus-init | Yes (logic) | Yes (user types `/maximus-loop:init`) | No (command invokes skill) |
| maximus-plan | Yes (logic) | Yes (user types `/maximus-loop:plan`) | Yes (for subagent dispatch) |
| maximus-review | Yes (logic) | Yes (user types `/maximus-loop:review`) | No |
| maximus-validate | Yes (logic) | Yes (user types `/maximus-loop:validate`) | No |

Commands should be thin wrappers:
```markdown
Invoke the maximus-loop:maximus-plan skill and follow it exactly as presented to you
```

### Fix 3: Shorten descriptions to "Use when..." format

**Before:**
```yaml
description: This skill should be used when the user asks to "rate this tldr",
  "evaluate this tldr", "score this summary", "grade this tldr",
  "how good was that summary", "tldr feedback", or "/tldr:feedback".
  Handles the complete TLDR evaluation workflow...
```

**After:**
```yaml
description: Use when evaluating TLDR quality, scoring summary samples, or providing feedback on summary output
```

### Fix 4: Strip non-standard frontmatter fields

Only `name` and `description` are supported. Remove `version`, `metadata`, `framework`, `status`, `last-updated`, `examples`, `argument-hint`, and `tools` from SKILL.md frontmatter.

Note: `tools` and `argument-hint` may be valid for command frontmatter (Claude Code specific), but NOT for skill frontmatter.

### Fix 5: Add `disable-model-invocation: true` to commands

Unless you want Claude to auto-invoke a command, add this flag:

```yaml
---
description: ...
disable-model-invocation: true
---
```

### Fix 6: Use skill frontmatter format per Anthropic spec

Per Anthropic's official docs:
- `name`: 64 characters max, letters/numbers/hyphens only
- `description`: 1024 characters max, third person, starts with "Use when..."
- Total frontmatter: max 1024 characters
- No other fields

---

## Appendix: How the Superpowers Session Start Hook Works

Superpowers injects the `using-superpowers` skill content at session start via a hook:

```json
// hooks/hooks.json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup|resume|clear|compact",
      "hooks": [{
        "type": "command",
        "command": "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh",
        "async": false
      }]
    }]
  }
}
```

The shell script reads `skills/using-superpowers/SKILL.md` and injects its content into `additionalContext` wrapped in `<EXTREMELY_IMPORTANT>` tags. This ensures Claude always knows about the skill system from the first message.

This is NOT about autocomplete -- it is about ensuring the model knows to use the `Skill` tool proactively.

---

## Appendix: The `lib/skills-core.js` Skill Resolution Logic

Superpowers includes a JavaScript module that shows how skill names resolve:

```javascript
// When resolving "superpowers:brainstorming":
// 1. Strip the "superpowers:" prefix
// 2. Look for skills/<stripped-name>/SKILL.md
// 3. If not found with prefix, try personal skills dir

// Key insight: the `name` field in SKILL.md is a FALLBACK.
// The primary name comes from the directory name:
name: name || entry.name  // frontmatter name OR directory name
```

This confirms: the directory name is the canonical skill name. The `name` field in frontmatter is used when present, but if absent, the directory name is used as fallback. Either way, they should match.

---

## Key Takeaways

1. **Skills = background knowledge, Commands = user-facing slash commands, Agents = subagent definitions.** Never duplicate the same thing across all three.

2. **The `name` field in SKILL.md should be a bare slug** matching the directory name. Never include the plugin prefix.

3. **Commands should NOT have `name` fields.** The filename IS the command name.

4. **Most skills should NOT have commands.** Only create commands for things users explicitly type.

5. **Commands should be thin wrappers** that delegate to skills. One line: "Invoke the plugin:skill-name skill and follow it exactly."

6. **Descriptions should be concise "Use when..." statements** that describe triggering conditions only, never workflow summaries.

7. **Only `name` and `description` belong in skill frontmatter.** Everything else is non-standard and may cause issues.

8. **Use `disable-model-invocation: true`** on commands that should only be triggered by explicit user action.
