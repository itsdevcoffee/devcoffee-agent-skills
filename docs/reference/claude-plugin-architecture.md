# Claude Code Plugin Architecture Reference

**Version:** Based on superpowers v4.3.0 analysis (2026-02-15)
**Source:** Deep analysis of github.com/obra/superpowers (Jesse Vincent's reference implementation)
**Research:** See `docs/research/2026-02-15-superpowers-*.md` for complete findings

---

## Table of Contents

1. [Component Types](#component-types)
2. [Directory Structure](#directory-structure)
3. [Frontmatter Specifications](#frontmatter-specifications)
4. [The Thin Wrapper Pattern](#the-thin-wrapper-pattern)
5. [Naming Conventions](#naming-conventions)
6. [Common Anti-Patterns](#common-anti-patterns)
7. [Real-World Examples](#real-world-examples)
8. [Decision Trees](#decision-trees)

---

## Component Types

### The Fundamental Architecture

```
Commands (commands/)  → Creates slash commands in autocomplete
Skills (skills/)      → Background knowledge, loaded via Skill tool (NO autocomplete)
Agents (agents/)      → Subagent definitions for Task tool (NO autocomplete)
```

**Critical Rule:** Only files in `commands/` create autocomplete entries. Skills and agents are invoked programmatically.

### Component Comparison

| Component | Directory | Autocomplete? | Purpose | Invocation Method |
|-----------|-----------|---------------|---------|-------------------|
| **Command** | `commands/` | ✅ YES | User-facing slash commands | User types `/plugin:command` |
| **Skill** | `skills/` | ❌ NO | Background knowledge/processes | Agent uses Skill tool or auto-triggers |
| **Agent** | `agents/` | ❌ NO | Subagent definitions | Dispatched via Task tool with `subagent_type` |

---

## Directory Structure

### Canonical Pattern

```
plugin-name/
├── .claude-plugin/
│   ├── plugin.json              # Metadata only (name, version, author)
│   └── plugin-metadata.json     # Optional marketplace metadata
├── commands/                     # Thin wrappers for autocomplete
│   └── action.md                 # Creates /plugin-name:action
├── skills/                       # Rich logic loaded on demand
│   └── skill-name/               # Directory per skill
│       ├── SKILL.md              # Main skill file (REQUIRED)
│       ├── references/           # Supporting docs (optional)
│       ├── templates/            # Prompt templates (optional)
│       └── examples/             # Code examples (optional)
├── agents/                       # Subagent system prompts
│   └── worker.md                 # Dispatched by skills via Task tool
└── hooks/                        # Lifecycle hooks (optional)
    ├── hooks.json                # Hook configuration
    └── session-start.sh          # Example hook script
```

### Convention Over Configuration

**`plugin.json` contains ONLY metadata** - no component registry:

```json
{
  "name": "plugin-name",
  "description": "Brief plugin description",
  "version": "1.0.0",
  "author": {
    "name": "Author Name",
    "email": "email@example.com"
  },
  "homepage": "https://github.com/...",
  "repository": "https://github.com/...",
  "license": "MIT",
  "keywords": ["tag1", "tag2"]
}
```

Components are auto-discovered by directory presence:
- Presence of `commands/` → auto-discover all `.md` files as commands
- Presence of `skills/` → auto-discover all `skill-name/SKILL.md` patterns
- Presence of `agents/` → auto-discover all `.md` files as agents

---

## Frontmatter Specifications

### Skills (`skills/skill-name/SKILL.md`)

**ONLY 2 fields allowed** (per Anthropic specification):

```yaml
---
name: skill-name-with-hyphens
description: Use when [specific triggering conditions - NO workflow summary]
---

# Human-Readable Title

## Overview
[Concise explanation of what this skill does]

## When to Use
[Bullet list of triggering conditions]

## Process
[Step-by-step instructions or flowchart]
```

#### Skill Frontmatter Rules

| Field | Rules | Example |
|-------|-------|---------|
| `name` | Bare slug (no plugin prefix), matches directory name, max 64 chars, letters/numbers/hyphens only | `test-driven-development` |
| `description` | Max 1024 chars total frontmatter, starts with "Use when...", third person, **trigger conditions ONLY** | `Use when implementing any feature or bugfix, before writing implementation code` |

**Forbidden Fields:** `version`, `metadata`, `framework`, `status`, `tools`, `tags`, `examples`, `argument-hint` - these are ignored or may cause issues.

#### The Description Trap ⚠️

**Critical finding from superpowers testing:**

When skill descriptions contain workflow summaries, Claude may follow the description shortcut instead of reading the full skill content.

❌ **BAD** (workflow summary):
```yaml
description: Use when executing plans - dispatches subagent per task with code review between tasks
```

✅ **GOOD** (trigger conditions only):
```yaml
description: Use when executing implementation plans with independent tasks in the current session
```

#### Skill H1 Heading

The H1 heading is human-readable and doesn't need to match the slug:

| Slug (`name`) | H1 Heading |
|--------------|------------|
| `test-driven-development` | `# Test-Driven Development (TDD)` |
| `brainstorming` | `# Brainstorming Ideas Into Designs` |
| `using-git-worktrees` | `# Using Git Worktrees` |

### Commands (`commands/action.md`)

**NO `name` field** - filename IS the command name:

```yaml
---
description: Brief tooltip text for autocomplete
disable-model-invocation: true
---

Invoke the plugin-name:skill-name skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

#### Command Frontmatter Rules

| Field | Required? | Purpose | Example |
|-------|-----------|---------|---------|
| `description` | ✅ YES | Shows in autocomplete tooltip | `Execute plan in batches with review checkpoints` |
| `disable-model-invocation` | ✅ YES | Prevents auto-invocation by agent | `true` |
| `tools` | ⚠️ Optional | Claude Code specific - tools available to command | `Read, Write, Bash, Glob, Grep` |
| `argument-hint` | ⚠️ Optional | Claude Code specific - shows in autocomplete | `[task description or path]` |

**Forbidden:** `name` field (filename IS the name)

#### Command Body Pattern

Commands are **thin wrappers** (1-2 lines):

```markdown
Invoke the plugin-name:skill-name skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

### Agents (`agents/worker.md`)

```yaml
---
name: agent-name
description: |
  Use this agent when [conditions]...

  <example>
  Context: [scenario description]
  user: "[user message]"
  assistant: "[expected response]"
  <commentary>[why this agent applies]</commentary>
  </example>
model: inherit
---

You are a [Role]. Your role is to [purpose].

[Detailed agent system prompt and instructions...]
```

#### Agent Frontmatter Rules

| Field | Required? | Purpose |
|-------|-----------|---------|
| `name` | ✅ YES | Agent identifier (bare slug) |
| `description` | ✅ YES | Includes `<example>` blocks with conversation examples |
| `model` | ✅ YES | `inherit` or specific model (`sonnet`, `opus`, `haiku`) |

---

## The Thin Wrapper Pattern

### Architecture Flow

```
User types /plugin:command
    ↓
commands/command.md (thin wrapper - 1 line)
    ↓
Invokes Skill tool → plugin:skill-name
    ↓
skills/skill-name/SKILL.md (full logic - hundreds of lines)
```

### Why This Pattern?

1. **Single source of truth** - Logic lives in ONE place (the skill)
2. **Reusability** - Skills can be called by other skills, agents, or commands
3. **Autocomplete UX** - Commands provide user-facing entry points
4. **Progressive disclosure** - Not every skill needs autocomplete presence

### Thin Wrapper Example

**Command file** (`commands/brainstorm.md`):
```yaml
---
description: "You MUST use this before any creative work..."
disable-model-invocation: true
---

Invoke the superpowers:brainstorming skill and follow it exactly as presented to you
```

**Skill file** (`skills/brainstorming/SKILL.md`):
```yaml
---
name: brainstorming
description: "You MUST use this before any creative work..."
---

# Brainstorming Ideas Into Designs

[300+ lines of detailed instructions, flowcharts, examples...]
```

### Skill-to-Command Ratio

**Not every skill needs a command.**

From superpowers analysis:
- **14 skills** defined
- **3 commands** created
- **11 skills** have no autocomplete presence (auto-triggered or called by other skills)

#### When to Create a Command

✅ Create command when:
- User needs explicit entry point (e.g., `/brainstorm`)
- Interactive workflows requiring user initiation
- Top-level orchestration commands

❌ Don't create command when:
- Skill is called by other skills (e.g., `finishing-a-development-branch`)
- Auto-triggered by conditions (e.g., `systematic-debugging`)
- Internal workflow steps (e.g., `requesting-code-review`)

---

## Naming Conventions

### Plugin Name (`plugin.json` → `name` field)

- Lowercase with hyphens
- Descriptive but concise
- Examples: `superpowers`, `maximus-loop`, `tldr`

### Command Names (filename in `commands/`)

**Filename becomes slash command:**

| Filename | Slash Command | Notes |
|----------|---------------|-------|
| `brainstorm.md` | `/plugin:brainstorm` | Short, verb form |
| `execute-plan.md` | `/plugin:execute-plan` | Hyphenated phrase |
| `maximus-init.md` | `/maximus-loop:maximus-init` | Plugin prefix in filename |

**Two naming strategies:**

1. **Short names** (like superpowers): `brainstorm.md`, `review.md`
   - Risk: Generic names may conflict with other plugins
   - Benefit: Shorter to type

2. **Prefixed names** (like maximus-loop): `maximus-init.md`, `maximus-plan.md`
   - Risk: Longer to type
   - Benefit: No conflicts, self-documenting

**Recommendation:** Use prefixed names for safer namespacing.

### Skill Names (`name` field in SKILL.md)

- Bare slug (no plugin prefix)
- Matches directory name
- Lowercase with hyphens
- Active voice, verb-first or gerund form

**Examples:**
- `brainstorming` (gerund)
- `test-driven-development` (noun phrase)
- `using-git-worktrees` (gerund phrase)
- `dispatching-parallel-agents` (gerund phrase)

### Cross-References Between Skills

Skills reference each other using `plugin:skill` notation:

```markdown
**REQUIRED SUB-SKILL:** Use superpowers:test-driven-development

**Complementary skills:**
- superpowers:verification-before-completion
- superpowers:requesting-code-review
```

**❌ DO NOT use `@file` references** between skills - this force-loads files immediately. Let the Skill tool handle on-demand loading.

---

## Common Anti-Patterns

### Anti-Pattern Catalog

| Anti-Pattern | Why It's Wrong | Correct Approach |
|-------------|----------------|------------------|
| ❌ Command has `name` field | Filename IS the name | Remove `name:` from command frontmatter |
| ❌ Every skill has matching command | Namespace pollution, duplicates | Only create commands for user-facing entry points |
| ❌ Skill + command + agent all same name | Triple registration | Choose ONE type per capability |
| ❌ Full logic in command file | Violates thin wrapper pattern | Move to skill, command delegates in 1 line |
| ❌ Workflow summary in skill description | Claude shortcuts, doesn't read skill | Trigger conditions only: "Use when..." |
| ❌ Extra fields in skill frontmatter | Non-standard, may cause issues | Only `name` + `description` (max 1024 chars) |
| ❌ Missing `disable-model-invocation` | Commands auto-invoke unexpectedly | Add `disable-model-invocation: true` |
| ❌ Skills in flat `skills/*.md` | Wrong structure, auto-discovery fails | Use `skills/skill-name/SKILL.md` |
| ❌ Using `@` refs between skills | Force-loads, wastes tokens | Use skill names: `plugin:skill-name` |

### Detection Checklist

When reviewing plugin code, check for:

- [ ] Commands in `commands/` are thin wrappers (1-2 lines)
- [ ] Skills in `skills/skill-name/SKILL.md` structure (not flat)
- [ ] Skill frontmatter has ONLY `name` + `description`
- [ ] Command frontmatter has NO `name` field
- [ ] All commands have `disable-model-invocation: true`
- [ ] Skill descriptions start with "Use when..." (no workflow summary)
- [ ] No triple registration (same name as skill + command + agent)
- [ ] Cross-references use `plugin:skill` format (not `@file`)

---

## Real-World Examples

### Example 1: Superpowers Command-Skill Pairing

| Command File | Slash Command | Skill Directory | Skill `name` |
|--------------|---------------|-----------------|--------------|
| `brainstorm.md` | `/superpowers:brainstorm` | `skills/brainstorming/` | `brainstorming` |
| `execute-plan.md` | `/superpowers:execute-plan` | `skills/executing-plans/` | `executing-plans` |
| `write-plan.md` | `/superpowers:write-plan` | `skills/writing-plans/` | `writing-plans` |

**Note:** Command names differ from skill names (e.g., `brainstorm` → `brainstorming`).

### Example 2: Maximus-Loop Pattern

**Directory structure:**
```
maximus-loop/
  commands/
    maximus-init.md          → /maximus-loop:maximus-init
    maximus-plan.md          → /maximus-loop:maximus-plan
  skills/
    maximus-init/SKILL.md    (name: maximus-init)
    maximus-plan/SKILL.md    (name: maximus-plan)
  agents/
    maximus-plan.md          (name: maximus-plan)
```

**Observation:**
- `maximus-plan` exists as both skill AND agent (valid - agent is dispatched by skill)
- Each command has corresponding skill (valid for this use case - all are user-facing)

### Example 3: TLDR Issue (BEFORE FIX)

**Problem structure:**
```
tldr/
  skills/
    tldr/SKILL.md
    feedback/SKILL.md
    note/SKILL.md
    review/SKILL.md
  (NO commands/ directory!)
```

**Result:** Zero autocomplete entries. Skills don't create slash commands.

**Fix required:**
```
tldr/
  commands/                  ← CREATE THIS
    tldr.md                  → /tldr:tldr
    feedback.md              → /tldr:feedback
    note.md                  → /tldr:note
    review.md                → /tldr:review
  skills/
    tldr/SKILL.md
    feedback/SKILL.md
    note/SKILL.md
    review/SKILL.md
```

---

## Decision Trees

### Should I Create a Command, Skill, or Agent?

```
Start
  ↓
Does user need to type a slash command to invoke it?
  ├─ YES → Create COMMAND (in commands/)
  │         ↓
  │         Does it need rich logic/instructions?
  │         ├─ YES → Also create SKILL (command delegates to it)
  │         └─ NO → Put minimal logic in command
  │
  └─ NO → Is it background knowledge/process?
            ├─ YES → Create SKILL (in skills/)
            │         ↓
            │         Will it dispatch subagents?
            │         ├─ YES → Also create AGENT (skill uses Task tool)
            │         └─ NO → Skill only
            │
            └─ NO → Is it a subagent persona?
                      └─ YES → Create AGENT (in agents/)
```

### Should This Skill Have a Command?

```
Start: I have a skill
  ↓
Is it auto-triggered by conditions?
  ├─ YES (e.g., systematic-debugging)
  │   └─ NO COMMAND NEEDED
  │
  └─ NO
      ↓
      Is it called by other skills as a sub-step?
      ├─ YES (e.g., finishing-a-development-branch)
      │   └─ NO COMMAND NEEDED
      │
      └─ NO
          ↓
          Does user need explicit control over when it runs?
          ├─ YES (e.g., brainstorm, write-plan)
          │   └─ CREATE COMMAND
          │
          └─ NO
              └─ NO COMMAND NEEDED
```

### Frontmatter Field Decision Tree

```
Component type?
  ├─ SKILL
  │   └─ Fields: name, description ONLY
  │       NO: version, metadata, tools, tags, etc.
  │
  ├─ COMMAND
  │   └─ Fields: description, disable-model-invocation
  │       Optional: tools, argument-hint
  │       NO: name (filename IS name)
  │
  └─ AGENT
      └─ Fields: name, description, model
          Optional: tools (if agent needs specific tools)
```

---

## Quick Reference

### Critical Rules (Memorize These)

1. **Only `commands/` creates autocomplete** - skills/agents do NOT
2. **Commands = thin wrappers** - one line delegating to skills
3. **Skills = 2 frontmatter fields** - `name` + `description` only
4. **Commands = NO `name` field** - filename IS the command name
5. **Descriptions = triggers only** - NEVER workflow summary
6. **`disable-model-invocation: true`** - on ALL commands
7. **Not every skill needs a command** - only user-facing entry points

### File Creation Checklist

**Creating a new skill:**
- [ ] Directory: `skills/skill-name/`
- [ ] File: `SKILL.md` (not `skill-name.md`)
- [ ] Frontmatter: Only `name` + `description`
- [ ] Description: "Use when..." format (triggers only)
- [ ] H1: Human-readable title
- [ ] Decide: Does it need a command? (Usually no)

**Creating a new command:**
- [ ] File: `commands/action.md` (filename = command name)
- [ ] Frontmatter: NO `name` field
- [ ] Frontmatter: `disable-model-invocation: true`
- [ ] Body: One line: `Invoke the plugin:skill skill...`
- [ ] Create corresponding skill in `skills/action/SKILL.md`

**Creating a new agent:**
- [ ] File: `agents/agent-name.md`
- [ ] Frontmatter: `name`, `description`, `model`
- [ ] Description: Include `<example>` blocks
- [ ] Body: Full system prompt for subagent
- [ ] Decide: Which skill will dispatch this agent?

---

## Further Reading

**Research documents (full analysis):**
- `docs/research/2026-02-15-superpowers-plugin-structure-analysis.md`
- `docs/research/2026-02-15-superpowers-naming-and-autocomplete-patterns.md`
- `docs/research/2026-02-15-superpowers-vs-devcoffee-comparison.md`

**Reference implementations:**
- Superpowers: https://github.com/obra/superpowers (v4.3.0)
- Anthropic skill authoring guide: In superpowers at `skills/writing-skills/anthropic-best-practices.md`

**Official documentation:**
- Claude Code plugin development: https://docs.anthropic.com/claude-code/plugins
- Skill tool specification: https://docs.anthropic.com/claude-code/skills
