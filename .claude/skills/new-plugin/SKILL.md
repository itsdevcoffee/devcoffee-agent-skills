---
name: new-plugin
description: Use when creating a new Claude Code plugin - enforces architecture patterns, prevents frontmatter bloat, thin wrapper violations, and missing critical fields
---

# New Plugin Scaffolding

## Overview

**This skill prevents the 5 deadly sins of plugin creation:** forbidden frontmatter fields, verbose command bloat, using `disable-model-invocation`, workflow descriptions, and redundant `name` fields.

**Core principle:** Follow Claude Code plugin architecture from `docs/reference/claude-plugin-architecture.md`. Observable structure (directories) is easy. Hidden rules (frontmatter, thin wrappers) require discipline.

## When to Use

Use when:
- Creating a new plugin from scratch
- User says "scaffold plugin", "create plugin", "new plugin"
- Adding plugin to this marketplace
- Setting up plugin directory structure

**Reference:** `docs/reference/claude-plugin-architecture.md` for complete architecture rules.

## Scaffolding Workflow

### Step 1: Gather Requirements

Ask user:

```markdown
**Plugin name:** [lowercase-with-hyphens]
**Purpose:** [What problem does this solve?]
**Components needed:**
- [ ] Skills (always - provides logic)
- [ ] Commands (optional - user-facing slash commands)
- [ ] Agents (optional - dispatched by skills)
- [ ] Hooks (optional - lifecycle automation)

**User-facing entry points?** [Which skills need slash commands?]
```

**Validate name:**
- Lowercase with hyphens only
- Descriptive but concise
- No conflicts with existing plugins

### Step 2: Create Directory Structure

```bash
mkdir -p <plugin>/.claude-plugin
mkdir -p <plugin>/skills
# Only if needed:
mkdir -p <plugin>/commands
mkdir -p <plugin>/agents
```

**Rules:**
- Skills directory is REQUIRED
- Commands only if user needs slash commands
- Agents only if skills dispatch subagents

### Step 3: Create plugin.json

**Location:** `<plugin>/.claude-plugin/plugin.json`

**Template:**
```json
{
  "name": "<plugin-name>",
  "description": "<Brief plugin description>",
  "version": "0.1.0",
  "author": {
    "name": "Dev Coffee",
    "url": "https://github.com/itsdevcoffee"
  },
  "homepage": "https://github.com/itsdevcoffee/devcoffee-agent-skills",
  "repository": "https://github.com/itsdevcoffee/devcoffee-agent-skills",
  "license": "MIT",
  "keywords": ["tag1", "tag2", "tag3"]
}
```

**Fields explained:**
- `name`: Plugin identifier (must match directory name)
- `description`: Brief summary (< 200 chars)
- `version`: Semantic version (start at 0.1.0)
- `author`, `homepage`, `repository`, `license`: Standard metadata
- `keywords`: Search tags (3-5 recommended)

### Step 4: Create First Skill

**Location:** `<plugin>/skills/<skill-name>/SKILL.md`

**Critical frontmatter rules:**
- **ONLY 2 fields allowed:** `name` + `description`
- **Max 1024 chars total frontmatter**
- **Description:** 150-200 chars max (trigger matching efficiency)
- **Description starts with:** "Use when..."
- **FORBIDDEN fields:** version, framework, status, tools, tags, examples, category, metadata, ANY field that's not name/description

**Template:**
```markdown
---
name: <skill-name>
description: Use when [specific triggering conditions - NO workflow summary]
---

# Human-Readable Skill Title

## Overview

[Brief explanation of what this skill does]

## When to Use

- [Triggering condition 1]
- [Triggering condition 2]
- [Triggering condition 3]

When NOT to use:
- [Anti-condition 1]
- [Anti-condition 2]

## Process

[Step-by-step instructions or flowchart]

## Examples

[Code examples, usage scenarios]

## Common Mistakes

[What goes wrong + how to fix]
```

**The Description Trap (CRITICAL):**

❌ **BAD** (workflow summary):
```yaml
description: Generate unit tests by analyzing code structure, creating test stubs, implementing assertions, and validating coverage
```

✅ **GOOD** (triggers only):
```yaml
description: Use when implementing features/bugfixes and need unit test generation
```

**Why:** Descriptions with workflow summaries cause Claude to shortcut and not read the full skill content. Keep descriptions to "Use when..." triggers ONLY.

### Step 5: Create Command (If Needed)

**Only create commands for user-facing entry points.**

**Not every skill needs a command.** From superpowers analysis:
- 14 skills defined
- 3 commands created
- 11 skills have no autocomplete presence (auto-triggered or called by other skills)

**Location:** `<plugin>/commands/<command-name>.md`

**Critical frontmatter rules:**
- **NO `name` field** - filename IS the command name
- **NO `disable-model-invocation: true`** - it blocks the Skill tool from invoking commands
- **MUST have:** `description`
- **Optional:** `tools`, `argument-hint`

**Thin Wrapper Template (7 lines):**
```markdown
---
description: [Brief tooltip for autocomplete]
---

Invoke the <plugin>:<skill-name> skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

**CRITICAL:** Commands are thin wrappers. 8 lines, not 62. Full logic lives in the skill.

**Commands Are 1:1 Delegators, Not Routers:**

❌ **WRONG** (dispatcher pattern):
```markdown
Analyze file type and invoke appropriate skill:
- PDF → plugin:pdf
- DOCX → plugin:docx
- XLSX → plugin:xlsx
```

✅ **CORRECT** (1:1 delegation):
- Create `commands/pdf.md` → delegates to `plugin:pdf`
- Create `commands/docx.md` → delegates to `plugin:docx`
- Create `commands/xlsx.md` → delegates to `plugin:xlsx`

**Why?** Dispatchers add complexity, make autocomplete unclear, and violate the thin wrapper pattern. If you need 3 skills, create 3 commands.

**Why NO `disable-model-invocation: true`?**
- It blocks the Skill tool from invoking commands
- Breaks all `/plugin:command` invocations
- See `docs/reference/claude-plugin-architecture.md` anti-patterns

### Step 6: Create Agent (If Needed)

**Only create if skill needs to dispatch subagents.**

**Location:** `<plugin>/agents/<agent-name>.md`

**Frontmatter:**
```yaml
---
name: <agent-name>
description: |
  Use this agent when [conditions]

  <example>
  Context: [scenario]
  user: "[message]"
  assistant: "[response]"
  <commentary>[why this agent applies]</commentary>
  </example>

model: inherit
---

You are a [Role]. Your role is to [purpose].

[Detailed system prompt and instructions...]
```

**Required fields:** `name`, `description` (with examples), `model`

### Step 7: Register in Marketplace

**Location:** `.claude-plugin/marketplace.json`

**Add entry:**
```json
{
  "name": "<plugin-name>",
  "source": "./<plugin>",
  "description": "<Brief description>",
  "version": "0.1.0",
  "author": {
    "name": "Dev Coffee",
    "url": "https://github.com/itsdevcoffee"
  },
  "repository": "https://github.com/itsdevcoffee/devcoffee-agent-skills",
  "keywords": ["tag1", "tag2"],
  "category": "Development Tools",
  "license": "MIT"
}
```

**Verify:** Version matches plugin.json

### Step 8: Create Documentation

**Essential files:**
- `<plugin>/README.md` - User-facing documentation
- `<plugin>/LICENSE` - MIT license (copy from other plugins)

**Optional:**
- `<plugin>/CHANGELOG.md` - If planning releases
- `<plugin>/docs/` - Supporting documentation

### Step 9: Validate Structure

**Run validation:**
```bash
cd /home/maskkiller/dev-coffee/repos/devcoffee-agent-skills
node scripts/validate-plugins.js
```

**Fix any errors before continuing.**

## Architecture Checklists

### Skill Checklist
- [ ] Directory: `skills/<skill-name>/SKILL.md` (not flat `skills/*.md`)
- [ ] Frontmatter: ONLY `name` + `description` (2 fields max)
- [ ] Description starts with "Use when..."
- [ ] Description has NO workflow summary
- [ ] H1 heading is human-readable (doesn't need to match slug)
- [ ] Supporting files in same directory (if needed)

### Command Checklist
- [ ] Location: `commands/<command-name>.md`
- [ ] Frontmatter: NO `name` field (filename IS the name)
- [ ] Frontmatter: NO `disable-model-invocation` (blocks Skill tool)
- [ ] Body: Thin wrapper (7 lines, delegates to skill)
- [ ] NOT duplicating skill logic

### Plugin Manifest Checklist
- [ ] `plugin.json` exists at `.claude-plugin/plugin.json`
- [ ] Has name, description, version, author, repository, license
- [ ] Name matches directory name
- [ ] Version uses semantic versioning (MAJOR.MINOR.PATCH)

### Marketplace Registration Checklist
- [ ] Entry added to `.claude-plugin/marketplace.json`
- [ ] Source path matches plugin directory
- [ ] Version matches plugin.json
- [ ] Keywords added (3-5 recommended)
- [ ] Category assigned

## Common Mistakes

### Mistake 1: Extra Frontmatter Fields

**Symptom:** Skill has `version`, `framework`, `status`, `tools`, `tags` fields.

**Fix:** Remove ALL fields except `name` + `description`.

### Mistake 2: Verbose Command Files

**Symptom:** Command file is 50+ lines with full documentation.

**Fix:** Use thin wrapper template (8 lines). Move docs to skill.

### Mistake 3: Using `disable-model-invocation: true`

**Symptom:** Command frontmatter has `disable-model-invocation: true`.

**Fix:** Remove it. It blocks the Skill tool from invoking commands, breaking `/plugin:command`.

### Mistake 4: Workflow in Description

**Symptom:** Description explains HOW skill works instead of WHEN to use it.

**Fix:** Rewrite to start with "Use when..." and list triggers only.

### Mistake 5: Command Has `name` Field

**Symptom:** Command frontmatter includes `name: command-name`.

**Fix:** Remove it. Filename IS the command name.

### Mistake 6: Flat Skills Directory

**Symptom:** Skills at `skills/skill-name.md` instead of `skills/skill-name/SKILL.md`.

**Fix:** Create directory per skill, SKILL.md inside.

### Mistake 7: Every Skill Has Command

**Symptom:** 1:1 ratio of skills to commands.

**Fix:** Only create commands for user-facing entry points. Most skills don't need commands.

## Templates Reference

### Skill Frontmatter Template
```yaml
---
name: skill-name-with-hyphens
description: Use when [specific triggering conditions]
---
```

### Command Frontmatter Template
```yaml
---
description: Brief tooltip text for autocomplete
---
```

### Command Body Template
```markdown
Invoke the plugin-name:skill-name skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

### Agent Frontmatter Template
```yaml
---
name: agent-name
description: |
  Use this agent when [conditions]

  <example>
  Context: [scenario]
  user: "[user message]"
  assistant: "[expected response]"
  <commentary>[why agent applies]</commentary>
  </example>

model: inherit
---
```

## Red Flags - STOP Immediately

| Thought | Reality |
|---------|---------|
| "More metadata = better structure" | Only `name` + `description` allowed in skills. |
| "Commands should explain everything" | Commands delegate in 8 lines. Skills have full docs. |
| "I should add `disable-model-invocation`" | NO. It blocks Skill tool invocation. Never add it. |
| "Description should explain workflow" | NO. Triggers only. Claude shortcuts if workflow in description. |
| "Commands need `name` field like skills" | NO. Filename IS the command name. |
| "Every skill needs a command" | NO. Only user-facing entry points need commands. |
| "Flat `skills/*.md` is simpler" | WRONG. Must be `skills/skill-name/SKILL.md`. |
| "One command can dispatch to multiple skills" | NO. Commands are 1:1 delegators, not routers. |
| "900 chars is under the 1024 limit" | Descriptions should be 150-200 chars max for efficiency. |
| "Category isn't in forbidden list" | ANY field not `name`/`description` is forbidden. |

## Further Reading

**Complete architecture reference:** `docs/reference/claude-plugin-architecture.md`

**Key sections:**
- Component Types (commands vs skills vs agents)
- Frontmatter Specifications
- The Thin Wrapper Pattern
- Common Anti-Patterns
- Decision Trees

**Research documents:**
- `docs/research/2026-02-15-superpowers-plugin-structure-analysis.md`
- `docs/research/2026-02-15-superpowers-naming-and-autocomplete-patterns.md`
- `docs/research/2026-02-15-superpowers-vs-devcoffee-comparison.md`

## The Bottom Line

**51% of plugin creation is obvious** (directories, file locations). **49% requires architecture knowledge** (frontmatter rules, thin wrappers, critical fields).

**Follow the templates. Reference the architecture doc. Prevent the 5 deadly sins.**

Natural instincts mislead:
- "Document everywhere" → Creates bloat
- "Add metadata" → Violates spec
- "Explain thoroughly" → Reduces performance

**Templates over intuition. Architecture over assumptions.**
