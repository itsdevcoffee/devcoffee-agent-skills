---
name: maximus-init
description: This skill should be used when the user asks to "set up maximus", "configure maximus", "initialize maximus", "create maximus config", "scaffold maximus", "bootstrap maximus", or "maximus init". Provides project-aware setup that analyzes the codebase to generate a tailored config.yml instead of generic boilerplate.
---

# Maximus Init — Project-Aware Setup

Set up the Maximus Loop autonomous engine for a specific project. Analyze the codebase to generate a tailored config.yml instead of generic defaults.

**Announce:** "I'll set up Maximus Loop for your project by analyzing the codebase and generating a tailored configuration."

<CRITICAL-CONSTRAINTS>
## Non-Negotiable Rules

These rules are ABSOLUTE. Violating any of them means the setup is broken and the engine WILL NOT work.

1. **Directory MUST be `.maximus/`** — NOT `maximus-loop/`, NOT `maximus/`, NOT any other name. The engine ONLY reads from `.maximus/`. If you create any other directory name, the engine cannot find its files.

2. **Config schema is FIXED** — The engine parses config.yml with a strict TypeScript interface. You MUST use the EXACT field names shown in the template below. Do NOT invent fields like `project:`, `stack:`, `verify:`, `guardrails:`, `conventions:`, etc. The engine will crash or silently ignore unknown fields.

3. **Plan schema is FIXED** — plan.json MUST contain `{"tasks": []}` at minimum. An optional `"version"` field (string) is acceptable. Do NOT add `project`, `created`, or any other non-standard fields.

4. **Run `maximus init` first** — When `.maximus/` does not exist, you MUST run the `maximus init` CLI command. Do NOT manually `mkdir`. The CLI creates the correct directory structure, default files, and .gitignore entries.

5. **Ask for user confirmation** — You MUST present the generated config and ask "Does this configuration look correct?" BEFORE writing it. Do NOT skip this step.

6. **Use TaskCreate for progress tracking** — You MUST create all 6 phase tasks upfront using TaskCreate before starting Phase 1.

7. **Complete all 6 phases in order** — Do NOT skip or combine phases. Each phase has a specific purpose.
</CRITICAL-CONSTRAINTS>

## Task API Integration

This skill uses the Task API to show visual progress. Create all 6 phase tasks upfront with TaskCreate, then update status as each phase completes.

Reference: `${CLAUDE_PLUGIN_ROOT}/references/task-api.md`

---

## Setup: Create Phase Tasks

Before starting Phase 1, you MUST create all 6 tasks using TaskCreate:

```
TaskCreate:
  subject: "Detect existing Maximus configuration"
  description: "Check for .maximus/ directory and validate config quality"
  activeForm: "Detecting existing Maximus configuration"

TaskCreate:
  subject: "Analyze project structure"
  description: "Read CLAUDE.md, package files, and detect conventions"
  activeForm: "Analyzing project structure"

TaskCreate:
  subject: "Configure Maximus settings"
  description: "Generate tailored config.yml based on project analysis"
  activeForm: "Configuring Maximus settings"

TaskCreate:
  subject: "Clean example plan tasks"
  description: "Replace boilerplate plan.json with empty tasks array"
  activeForm: "Cleaning example plan tasks"

TaskCreate:
  subject: "Suggest available skills"
  description: "List installed skills for task configuration"
  activeForm: "Suggesting available skills"

TaskCreate:
  subject: "Handoff to planning"
  description: "Display next steps and guide to /maximus-plan"
  activeForm: "Preparing handoff documentation"
```

---

## Phase 1: Detect

**Mark task as in_progress:**
```
TaskUpdate: taskId for "Detect existing Maximus configuration", status "in_progress"
```

Check for existing Maximus setup:

1. **Directory check:** `ls -la .maximus/`
   - If missing: Note that `maximus init` will be run in Phase 3
   - If exists: Continue to config validation

2. **Config validation:** Read `.maximus/config.yml` if it exists
   - Check for boilerplate project_name (e.g., "My Project", "example")
   - Check for default commit_prefix ("feat:", "chore:")
   - If boilerplate detected: Warn user and offer to regenerate

3. **Plan validation:** Read `.maximus/plan.json` if it exists
   - Check if tasks array contains example tasks
   - Note example tasks will be replaced in Phase 4

**Present findings to the user:**
```
Maximus Setup Status:
  Directory: [EXISTS | MISSING]
  Config: [TAILORED | BOILERPLATE | MISSING]
  Plan: [N tasks (M examples) | MISSING]
```

**Mark task as completed.**

---

## Phase 2: Analyze

**Mark task as in_progress.**

Read project files to understand structure and conventions:

1. **Project identity:**
   - Read `package.json`, `Cargo.toml`, `go.mod`, or `pyproject.toml`
   - Extract project name from package file
   - Identify programming language and framework

2. **Project conventions:**
   - Read `CLAUDE.md` for project-specific instructions
   - Check `git log --oneline -10` for commit message patterns
   - Look for commit prefixes (e.g., "feat:", "fix:", "maximus:")

3. **Test runner detection:**
   - Check package.json scripts for test commands
   - Look for: `npm test`, `bun test`, `cargo test`, `go test`, `pytest`
   - Identify testing framework: jest, vitest, mocha, etc.

4. **Directory structure:**
   - Run `ls` to see top-level directories
   - Identify source and test directories

**Present analysis summary to the user:**
```
Project Analysis:
  Name: [project-name]
  Language: [language + framework]
  Test runner: [test command]
  Commit style: [prefix pattern]
  Source dirs: [directories]
```

**Mark task as completed.**

---

## Phase 3: Configure

**Mark task as in_progress.**

### Step 1: Initialize .maximus/ directory

**If `.maximus/` does NOT exist:**
Run this command:
```bash
maximus init
```
This creates `.maximus/` with config.yml, plan.json, progress.md, and updates .gitignore.

**If `.maximus/` already exists:**
Do NOT run `maximus init` (it will refuse). You will overwrite config.yml directly in Step 3. Also ensure `.gitignore` has the required entries (see Step 4).

### Step 2: Determine config values from Phase 2 analysis

From your analysis, determine these values:
- `project_name` — from package.json name field
- `timeout` — based on project size: small (<100 files) = 600, medium (100-500) = 900, large (500+) = 1200
- `commit_prefix` — from git log patterns (e.g., "feat:", "maximus:", etc.)

### Step 3: Write config.yml

Write `.maximus/config.yml` using EXACTLY this schema. Replace only the `[bracketed]` values with real values from Step 2. Do NOT add, remove, rename, or restructure any fields.

```yaml
# Maximus Loop Configuration — [project-name]

project_name: "[actual-project-name]"

loop:
  # How many iterations to run (-1 for unlimited).
  # Set to a small number (e.g., 5) for first runs, -1 once confident.
  max_iterations: -1
  mode: sequential
  auto_commit: true
  continue_on_error: false

agent:
  default_model: sonnet
  timeout: [calculated-timeout-integer]
  max_retries: 2

  # Model escalation — assigns different models by task complexity_level.
  escalation:
    enabled: true
    simple: haiku
    medium: sonnet
    complex: opus

tasks:
  source: .maximus/plan.json
  auto_mark_done: true

context:
  files:
    - CLAUDE.md

progress:
  file: .maximus/progress.md
  format: markdown

git:
  enabled: true
  commit_prefix: "[detected-prefix]"
  auto_push: false

# Code review (future feature)
# review:
#   enabled: false
#   min_severity: "medium"
#   max_phases: 3
```

<SCHEMA-ENFORCEMENT>
The config above is the COMPLETE and EXACT schema. The engine's TypeScript Config interface defines these top-level keys and ONLY these:
- `project_name` (string)
- `loop` (object with: max_iterations, mode, auto_commit, continue_on_error)
- `agent` (object with: default_model, timeout, max_retries, escalation?)
- `tasks` (object with: source, auto_mark_done)
- `context` (optional object with: files?)
- `progress` (object with: file, format)
- `git` (object with: enabled, commit_prefix, auto_push)
- `review` (optional object with: enabled, min_severity, max_phases)

Do NOT invent additional fields. Do NOT nest fields differently. Do NOT add `project:`, `stack:`, `verify:`, `guardrails:`, `conventions:`, `description:`, or any other custom sections. The engine parser will not understand them.
</SCHEMA-ENFORCEMENT>

### Step 4: Ensure .gitignore entries

If `.maximus/` already existed (you skipped `maximus init`), check `.gitignore` and add any missing entries:
```
.maximus/.heartbeat
.maximus/.stop
.maximus/.pause
.maximus/.completed-tasks.json
.maximus/run-summary.json
.maximus/logs/
```

### Step 5: Present config and ask for confirmation

**Present generated config to the user:**
```
Generated Configuration:
  Project: [name]
  Timeout: [value]s
  Commit prefix: "[prefix]"
  Model escalation: haiku / sonnet / opus
  Max iterations: -1 (unlimited)
```

**Ask:** "Does this configuration look correct?"

**STOP and wait for user confirmation before proceeding to Phase 4.**

**Mark task as completed after user confirms.**

---

## Phase 4: Clean

**Mark task as in_progress.**

Replace example plan.json tasks with an empty tasks array:

1. **Write clean plan to `.maximus/plan.json`:**

```json
{
  "tasks": []
}
```

That is the COMPLETE file contents. A `"version": "1.0.0"` field is optional and acceptable, but do NOT add `project`, `created`, or any other non-standard fields.

**Mark task as completed.**

---

## Phase 5: Suggest

**Mark task as in_progress.**

List installed skills available for task configuration:

1. **Discover installed skills:**
   - Check `~/.claude/plugins/` for installed plugin directories
   - For each plugin, read its `plugin.json` or scan `skills/` subdirectory
   - Also check `~/.claude/skills/` for standalone skills

2. **Present suggestions to the user:**
```
Available Skills for Tasks:
  - [plugin-name:skill-name] — [description]
  - [plugin-name:skill-name] — [description]
  - ...

These skills can be added to individual tasks in the plan
to provide specialized guidance during execution.
```

Only list skills that are actually installed. Do NOT guess or hardcode skill names.

**Mark task as completed.**

---

## Phase 6: Handoff

**Mark task as in_progress.**

**Present completion message to the user:**

```
Maximus Loop is configured for [project-name]

Configuration saved to:
  .maximus/config.yml — Engine settings
  .maximus/plan.json — Empty task list (ready for planning)
  .maximus/progress.md — Iteration tracker

Next Steps:
  1. Review config: cat .maximus/config.yml
  2. Commit setup:
     git add .maximus/ .gitignore
     git commit -m "[prefix] Initialize Maximus Loop"
  3. Create your first task plan:
     Run /maximus-plan to design tasks for your feature

Your project is configured. Run /maximus-plan to create your first task plan.
```

**Mark task as completed.**

---

## Red Flags

**If you catch yourself doing any of these, STOP immediately:**
- Creating a directory named anything other than `.maximus/`
- Adding fields to config.yml that aren't in the template above
- Adding fields to plan.json beyond `{"tasks": []}`
- Using `mkdir` instead of `maximus init`
- Writing config without asking the user first
- Skipping phases or combining them
- Not using TaskCreate for progress tracking
