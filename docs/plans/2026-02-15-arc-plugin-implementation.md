# Arc Plugin Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a standalone Claude Code plugin (`arc/`) that wraps the Maximus Loop CLI with imperative step-sequence skills for init, validate, plan, and review.

**Architecture:** Hybrid step machine — skills use rigid numbered steps (each step = one tool call), reference docs hold flexible content (schemas, anti-patterns, cost formulas). 4 commands, 4 skills, 4 agents, 6 reference docs.

**Tech Stack:** Claude Code plugin system (Markdown files with YAML frontmatter)

**Design Doc:** `docs/plans/2026-02-15-arc-plugin-design.md`

---

### Task 1: Scaffold Plugin Directory and Manifests

**Files:**
- Create: `arc/.claude-plugin/plugin.json`
- Create: `arc/.claude-plugin/plugin-metadata.json`

**Step 1: Create plugin.json**

Write `arc/.claude-plugin/plugin.json`:

```json
{
  "name": "arc",
  "version": "0.1.0",
  "description": "Automation companion for the Maximus Loop CLI — project initialization, validation, task planning, and run analysis",
  "author": {
    "name": "Dev Coffee",
    "url": "https://github.com/itsdevcoffee"
  },
  "repository": "https://github.com/itsdevcoffee/devcoffee-agent-skills",
  "keywords": ["maximus-loop", "automation", "planning", "init", "validate", "review"],
  "license": "MIT"
}
```

**Step 2: Create plugin-metadata.json**

Write `arc/.claude-plugin/plugin-metadata.json`:

```json
{
  "name": "arc",
  "version": "0.1.0",
  "displayName": "Arc",
  "description": "Automation companion for the Maximus Loop CLI — project initialization, validation, task planning, and run analysis",
  "category": "Automation"
}
```

**Step 3: Commit**

```bash
git add arc/.claude-plugin/
git commit -m "feat(arc): scaffold plugin directory and manifests (v0.1.0)"
```

---

### Task 2: Create Reference Docs — Task API and Config Schema

**Files:**
- Create: `arc/references/task-api.md`
- Create: `arc/references/config-schema.md`

**Step 1: Write task-api.md**

Port from `maximus-loop/references/task-api.md` — keep identical content. This is a Claude Code Task API reference card used by all skills.

Copy the full content from the source file at `maximus-loop/references/task-api.md` into `arc/references/task-api.md`. No modifications needed.

**Step 2: Write config-schema.md**

Port from `maximus-loop/skills/maximus-validate/references/config-schema.md` into `arc/references/config-schema.md`. No modifications needed — this is the authoritative config.yml field reference.

Copy the full content from the source file at `maximus-loop/skills/maximus-validate/references/config-schema.md`.

**Step 3: Commit**

```bash
git add arc/references/task-api.md arc/references/config-schema.md
git commit -m "feat(arc): add task-api and config-schema reference docs"
```

---

### Task 3: Create Reference Docs — Plan Schema and Anti-Patterns

**Files:**
- Create: `arc/references/plan-schema.md`
- Create: `arc/references/anti-patterns.md`

**Step 1: Write plan-schema.md**

Port from `maximus-loop/references/plan-schema.md` into `arc/references/plan-schema.md`. No modifications needed.

**Step 2: Write anti-patterns.md**

Port from `maximus-loop/references/anti-patterns.md` into `arc/references/anti-patterns.md`. No modifications needed.

**Step 3: Commit**

```bash
git add arc/references/plan-schema.md arc/references/anti-patterns.md
git commit -m "feat(arc): add plan-schema and anti-patterns reference docs"
```

---

### Task 4: Create Reference Docs — Cost Estimation and Run Summary Schema

**Files:**
- Create: `arc/references/cost-estimation.md`
- Create: `arc/references/run-summary-schema.md`

**Step 1: Write cost-estimation.md**

Port from `maximus-loop/references/cost-estimation.md` into `arc/references/cost-estimation.md`. No modifications needed.

**Step 2: Write run-summary-schema.md**

Port from `maximus-loop/references/run-summary-schema.md` into `arc/references/run-summary-schema.md`. No modifications needed.

**Step 3: Commit**

```bash
git add arc/references/cost-estimation.md arc/references/run-summary-schema.md
git commit -m "feat(arc): add cost-estimation and run-summary-schema reference docs"
```

---

### Task 5: Create Init Skill

**Files:**
- Create: `arc/skills/init/SKILL.md`

**Step 1: Write the init skill**

This is the critical skill — 4-phase imperative step sequence. Write `arc/skills/init/SKILL.md` with:

**Frontmatter (ONLY 2 fields):**
```yaml
---
name: init
description: Use when the user asks to "set up maximus", "configure maximus", "initialize maximus", "create maximus config", "scaffold maximus", "bootstrap maximus", or "maximus init".
---
```

**Body structure:**

1. **Announce line:** `"I'll validate your current setup, analyze the project, and configure Maximus Loop."`

2. **Phase 1: Detect & Validate** — Steps 1-4
   - Step 1: TaskCreate with subject "Detect & validate existing setup", activeForm "Detecting existing setup"
   - Step 2: TaskUpdate status in_progress
   - Step 3: Run `maximus validate --json` — this is the FIRST action, do NOT read files or explore before this
   - Step 4: Parse JSON, check `directory` check status:
     - **State A** (directory `status: "fail"`): Print "No Maximus setup found. I'll analyze the project and create a tailored configuration." → Proceed to Phase 2
     - **State B** (directory exists, other checks fail): Print failures → Proceed to Phase 2 (but in Phase 3, do NOT run `maximus init`, apply targeted fixes instead)
     - **State C** (`valid: true`): Show config_summary → AskUserQuestion "Would you like to change anything?" with options "No, this is good" / "Yes, I want to change settings". If no → skip to Phase 4. If yes → proceed to Phase 2.
   - TaskUpdate status completed

3. **Phase 2: Analyze** — Steps 5-11
   - Step 5: TaskCreate with subject "Analyze project structure", activeForm "Analyzing project structure"
   - Step 6: TaskUpdate status in_progress
   - Step 7: Read `package.json` (or `Cargo.toml`, `go.mod`, `pyproject.toml`). Extract the `name` field. STOP.
   - Step 8: Run `git log --oneline -10`. Look for consistent prefixes (e.g., "feat:", "fix:", "maximus:"). If none found, default to `"maximus:"`. STOP.
   - Step 9: Run `find . -type f -not -path './node_modules/*' -not -path './.git/*' -not -path './dist/*' -not -path './build/*' -not -path './.next/*' -not -path './vendor/*' | wc -l`. Calculate timeout: <100 files → 600, 100-500 → 900, >500 → 1200. STOP.
   - Step 10: Print summary:
     ```
     Project Analysis:
       Name:           [project-name]
       Timeout:        [N]s (based on ~[X] files)
       Commit prefix:  "[detected-prefix]"
     ```
   - Step 11: TaskUpdate status completed
   - **HARD CONSTRAINT:** Steps 7-9 are the ONLY reads in this phase. Do NOT explore frameworks, dependencies, integrations, README, tsconfig, or anything else.

4. **Phase 3: Configure** — Steps 12-21
   - Step 12: TaskCreate with subject "Configure Maximus settings", activeForm "Configuring Maximus settings"
   - Step 13: TaskUpdate status in_progress
   - Step 14: **State A only:** Run `maximus init` (no flags). **State B:** Skip this step (directory already exists, `maximus init` refuses to re-initialize).
   - Step 15: Read `.maximus/config.yml`
   - Step 16: Edit `project_name` to value from Step 7
   - Step 17: Edit `timeout` under `agent:` section to value from Step 9
   - Step 18: Edit `commit_prefix` under `git:` section to value from Step 8
   - These are the ONLY 3 values you modify. Do NOT change any other fields. Do NOT add fields. Do NOT use Write on config.yml.
   - Step 19: Write `.maximus/plan.json`:
     ```json
     {
       "version": "1.0.0",
       "tasks": []
     }
     ```
   - Step 20: **BLOCKING** — AskUserQuestion: "Does this configuration look correct?" with options "Yes, looks good" / "No, I want to change something". If changes requested, apply them and re-confirm. Do NOT proceed to Phase 4 until user approves.
   - Step 21: TaskUpdate status completed

5. **Phase 4: Validate & Handoff** — Steps 22-27
   - Step 22: TaskCreate with subject "Validate & handoff", activeForm "Validating final configuration"
   - Step 23: TaskUpdate status in_progress
   - Step 24: Run `maximus validate --json`
   - Step 25: If `valid: true`: Print success message with next steps:
     ```
     Maximus Loop is configured for [project-name]

     Configuration saved to:
       .maximus/config.yml — Engine settings
       .maximus/plan.json — Empty task list (ready for planning)
       .maximus/progress.md — Iteration tracker

     Next Steps:
       1. Commit setup:
          git add .maximus/ .gitignore
          git commit -m "[prefix] Initialize Maximus Loop"
       2. Create your first task plan:
          Run /arc:plan to design tasks for your feature
     ```
   - Step 26: If invalid: Show failures. Attempt to fix (max 2 retries). Re-validate after each fix. If still invalid after 2 attempts, ask the user for help.
   - Step 27: TaskUpdate status completed

6. **Alternate Paths section** at the bottom for State B and State C details.

**Step 2: Commit**

```bash
git add arc/skills/init/SKILL.md
git commit -m "feat(arc): add init skill — 4-phase imperative step sequence"
```

---

### Task 6: Create Validate Skill

**Files:**
- Create: `arc/skills/validate/SKILL.md`

**Step 1: Write the validate skill**

Write `arc/skills/validate/SKILL.md` with:

**Frontmatter:**
```yaml
---
name: validate
description: Use when the user asks to "validate maximus", "check maximus config", "verify maximus setup", "is my maximus config correct", "is my project ready to run", "lint my config", or before running the engine.
---
```

**Body:** 3-phase validation. Port from the existing maximus-loop validate skill design but rewrite for arc's imperative style.

- **Phase 1: CLI Validation** — Run `maximus validate --json`, parse JSON, present pass/fail/warn checks. If all pass → Phase 2. If failures → present clearly.
- **Phase 2: Project-Aware Advisories** — 5 checks (timeout vs file count, context files, escalation, commit prefix, plan health). Only report mismatches.
- **Phase 3: Present Findings** — Three output formats (valid/no advisories, valid/with advisories, invalid).
- **Constraint:** Read-only by default. Config schema reference: `${CLAUDE_PLUGIN_ROOT}/references/config-schema.md`.

**Step 2: Commit**

```bash
git add arc/skills/validate/SKILL.md
git commit -m "feat(arc): add validate skill — CLI validation + project-aware advisories"
```

---

### Task 7: Create Plan Skill

**Files:**
- Create: `arc/skills/plan/SKILL.md`

**Step 1: Write the plan skill**

Write `arc/skills/plan/SKILL.md` with:

**Frontmatter:**
```yaml
---
name: plan
description: Use when the user wants to create, update, extend, or replace a Maximus Loop task plan (plan.json). Triggers on "create a plan", "plan this feature", "generate tasks", "break this down into tasks", "add tasks for", "scope this work", "plan the next phase", "update the plan", or /arc:plan.
---
```

**Body:** Port from `maximus-loop/skills/maximus-plan/SKILL.md` with these changes:
- Replace all `/maximus-plan` references with `/arc:plan`
- Replace all `maximus-loop:` namespace references with `arc:`
- Keep the 6-phase HARD-GATE structure (Explore → Understand → Propose → Detail → Validate → Write)
- Keep the existing plan modes (Extend, Replace, Remove)
- Reference docs use `${CLAUDE_PLUGIN_ROOT}/references/` paths:
  - Phase 3: `${CLAUDE_PLUGIN_ROOT}/references/cost-estimation.md`
  - Phase 4: `${CLAUDE_PLUGIN_ROOT}/references/plan-schema.md`
  - Phase 5: `${CLAUDE_PLUGIN_ROOT}/references/anti-patterns.md`
- Keep the Task API integration pattern (create all 6 tasks upfront)
- Keep the Anti-Pattern section and HARD-GATE block
- Keep the Red Flags section

**Step 2: Commit**

```bash
git add arc/skills/plan/SKILL.md
git commit -m "feat(arc): add plan skill — 6-phase interactive task plan generation"
```

---

### Task 8: Create Review Skill

**Files:**
- Create: `arc/skills/review/SKILL.md`

**Step 1: Write the review skill**

Write `arc/skills/review/SKILL.md` with:

**Frontmatter:**
```yaml
---
name: review
description: Use when the user wants to review Maximus Loop results, analyze run performance, or check execution status. Triggers on "review the run", "analyze maximus results", "check status", "how is the run going", "show me the summary", "what's the progress", or when the user wants post-execution analysis with cost/performance insights.
---
```

**Body:** Port from `maximus-loop/skills/maximus-review/SKILL.md` with these changes:
- Replace all `/maximus-review` references with `/arc:review`
- Replace all `/maximus-plan` references with `/arc:plan`
- Replace all `maximus-loop:` namespace references with `arc:`
- Keep both modes: Full Review (6 phases with Task API) and Quick Status (`--quick`)
- Reference docs use `${CLAUDE_PLUGIN_ROOT}/references/` paths:
  - Phase 2: `${CLAUDE_PLUGIN_ROOT}/references/run-summary-schema.md`
  - Phase 3: `${CLAUDE_PLUGIN_ROOT}/references/cost-estimation.md`
- Keep the Task API integration pattern
- Keep the error handling section

**Step 2: Commit**

```bash
git add arc/skills/review/SKILL.md
git commit -m "feat(arc): add review skill — post-run analysis and quick status"
```

---

### Task 9: Create Commands (Thin Wrappers)

**Files:**
- Create: `arc/commands/init.md`
- Create: `arc/commands/validate.md`
- Create: `arc/commands/plan.md`
- Create: `arc/commands/review.md`

**Step 1: Write init command**

Write `arc/commands/init.md`:

```markdown
---
description: Initialize Maximus Loop — 4-phase setup with project analysis and task tracking
argument-hint: "[project-path]"
---

Invoke the arc:init skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

**Step 2: Write validate command**

Write `arc/commands/validate.md`:

```markdown
---
description: Validate Maximus Loop project configuration with CLI checks and project-aware advisories
argument-hint: "[--json]"
---

Invoke the arc:validate skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

**Step 3: Write plan command**

Write `arc/commands/plan.md`:

```markdown
---
description: Design and generate a task plan for the Maximus Loop autonomous engine
argument-hint: "[feature description]"
---

Invoke the arc:plan skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

**Step 4: Write review command**

Write `arc/commands/review.md`:

```markdown
---
description: Review Maximus Loop run results with cost analysis and performance insights
argument-hint: "[--quick]"
---

Invoke the arc:review skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

**Step 5: Commit**

```bash
git add arc/commands/
git commit -m "feat(arc): add 4 thin wrapper commands (init, validate, plan, review)"
```

---

### Task 10: Create Agent Definitions

**Files:**
- Create: `arc/agents/init.md`
- Create: `arc/agents/validate.md`
- Create: `arc/agents/plan.md`
- Create: `arc/agents/review.md`

**Step 1: Write init agent**

Write `arc/agents/init.md`:

```markdown
---
name: init
description: Initialize a Maximus Loop project setup. Triggers on "initialize maximus loop", "set up task automation", "create maximus project", "initialize project tasks", "set up autonomous tasks", "scaffold maximus", or when user wants to start task-driven autonomous development.
model: sonnet
color: cyan
tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion, TaskCreate, TaskUpdate, TaskList
---

<example>
Context: User wants to start using Maximus Loop for a project
user: "I want to initialize Maximus Loop for my feature development"
assistant: "I'll validate the current setup, analyze the project, and configure Maximus Loop."
<commentary>
User wants to initialize Maximus Loop. Trigger init to scaffold the project structure and configuration.
</commentary>
</example>

<CRITICAL>
Read this file FIRST: ${CLAUDE_PLUGIN_ROOT}/skills/init/SKILL.md

Follow EVERY step in the skill EXACTLY as written. Start with Phase 1, Step 1. Do NOT skip steps, reorder, or freestyle.
</CRITICAL>
```

**Step 2: Write validate agent**

Write `arc/agents/validate.md`:

```markdown
---
name: validate
description: Validate a Maximus Loop project configuration. Run deterministic CLI checks and provide project-aware advisories.
model: haiku
color: green
tools: Read, Bash, Glob, Grep, AskUserQuestion, TaskCreate, TaskUpdate, TaskList
---

<example>
Context: User wants to check their maximus configuration
user: "Validate my maximus setup"
assistant: "I'll validate your Maximus Loop configuration and check for potential issues."
<commentary>
User requesting validation. Trigger validate to run CLI checks and project-aware advisories.
</commentary>
</example>

<CRITICAL>
Read this file FIRST: ${CLAUDE_PLUGIN_ROOT}/skills/validate/SKILL.md

Follow EVERY step in the skill EXACTLY as written. Do NOT skip steps, reorder, or freestyle.
</CRITICAL>
```

**Step 3: Write plan agent**

Write `arc/agents/plan.md`:

```markdown
---
name: plan
description: Design and generate a task plan for the Maximus Loop autonomous engine. Interactive plan generation with cost estimates.
model: sonnet
color: yellow
tools: Read, Write, Bash, Glob, Grep, AskUserQuestion, TaskCreate, TaskUpdate, TaskList
---

<example>
Context: User wants to plan tasks for a feature
user: "Plan the authentication feature for my app"
assistant: "I'll help you design a task plan for the Maximus Loop engine."
<commentary>
User wants to create a task plan. Trigger plan to explore codebase, ask clarifying questions, and generate plan.json.
</commentary>
</example>

<CRITICAL>
Read this file FIRST: ${CLAUDE_PLUGIN_ROOT}/skills/plan/SKILL.md

Follow EVERY step in the skill EXACTLY as written. Do NOT skip phases or write plan.json before user approval.
</CRITICAL>
```

**Step 4: Write review agent**

Write `arc/agents/review.md`:

```markdown
---
name: review
description: Review Maximus Loop run results, analyze performance, detect failures, and propose follow-up actions.
model: sonnet
color: magenta
tools: Read, Bash, Glob, Grep, AskUserQuestion, TaskCreate, TaskUpdate, TaskList
---

<example>
Context: User wants to review a completed run
user: "Review the last maximus run"
assistant: "I'll analyze the Maximus Loop execution for you."
<commentary>
User requesting run review. Trigger review for comprehensive 6-phase analysis.
</commentary>
</example>

<CRITICAL>
Read this file FIRST: ${CLAUDE_PLUGIN_ROOT}/skills/review/SKILL.md

Follow EVERY step in the skill EXACTLY as written. Create all phase tasks upfront.
</CRITICAL>
```

**Step 5: Commit**

```bash
git add arc/agents/
git commit -m "feat(arc): add 4 agent definitions (init, validate, plan, review)"
```

---

### Task 11: Register in Marketplace and Create CHANGELOG

**Files:**
- Modify: `.claude-plugin/marketplace.json`
- Create: `arc/CHANGELOG.md`

**Step 1: Add arc to marketplace.json**

Read `.claude-plugin/marketplace.json`. Add this entry to the `plugins` array:

```json
{
  "name": "arc",
  "source": "./arc",
  "description": "Automation companion for the Maximus Loop CLI — project initialization, validation, task planning, and run analysis",
  "version": "0.1.0",
  "author": {
    "name": "Dev Coffee",
    "url": "https://github.com/itsdevcoffee"
  },
  "repository": "https://github.com/itsdevcoffee/devcoffee-agent-skills",
  "keywords": ["maximus-loop", "automation", "planning", "init", "validate", "review"],
  "category": "Automation",
  "license": "MIT"
}
```

**Step 2: Write CHANGELOG.md**

Write `arc/CHANGELOG.md`:

```markdown
# Changelog

All notable changes to the Arc plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-15

### Added

- `/arc:init` — 4-phase imperative initialization with conditional state handling (A/B/C)
- `/arc:validate` — CLI validation with project-aware advisories
- `/arc:plan` — Interactive 6-phase task plan generation with cost estimates
- `/arc:review` — Post-run analysis with full review and quick status modes
- 6 reference docs: plan-schema, config-schema, anti-patterns, cost-estimation, run-summary-schema, task-api
- 4 agent definitions for subagent dispatch
```

**Step 3: Commit**

```bash
git add .claude-plugin/marketplace.json arc/CHANGELOG.md
git commit -m "feat(arc): register in marketplace and add changelog (v0.1.0)"
```

---

### Task 12: Validate Plugin Structure

**Files:** None (validation only)

**Step 1: Run plugin validation**

```bash
npm run readme:validate
```

Expected: No errors for the arc plugin entries.

**Step 2: Verify file tree**

Run `ls -R arc/` and verify the structure matches the design:
- `.claude-plugin/plugin.json` and `plugin-metadata.json`
- `commands/` with 4 `.md` files
- `skills/` with 4 subdirectories each containing `SKILL.md`
- `agents/` with 4 `.md` files
- `references/` with 6 `.md` files
- `CHANGELOG.md`

**Step 3: Spot-check frontmatter compliance**

Verify these rules from CLAUDE.md:
- Commands have ONLY `description` and `argument-hint` in frontmatter
- Skills have ONLY `name` and `description` in frontmatter
- Command bodies are thin wrappers (1 line delegating to skill)
- Skill descriptions start with "Use when..."
- No `disable-model-invocation`, `tools`, or `tags` in command frontmatter

**Step 4: Final commit if any fixes needed**

```bash
git add arc/
git commit -m "fix(arc): address validation findings"
```
