---
name: maximus-init
description: This skill should be used when the user asks to "set up maximus", "configure maximus", "initialize maximus", "create maximus config", "scaffold maximus", "bootstrap maximus", or "maximus init". Provides project-aware setup that analyzes the codebase to generate a tailored config.yml instead of generic boilerplate.
---

# Maximus Init — Project-Aware Setup

Set up the Maximus Loop autonomous engine for a specific project. Analyze the codebase to generate a tailored config.yml instead of generic defaults.

**Announce:** "I'll set up Maximus Loop for your project by analyzing the codebase and generating a tailored configuration."

<CRITICAL-CONSTRAINTS>
## Non-Negotiable Rules

1. **Directory MUST be `.maximus/`** — NOT `maximus-loop/`, NOT `maximus/`, NOT any other name.

2. **Config schema is FIXED** — Use EXACT field names from the template below. Do NOT invent fields, do NOT add custom comments beyond the template's comments. Reference: `${CLAUDE_PLUGIN_ROOT}/skills/maximus-validate/references/config-schema.md`

3. **Plan schema is FIXED** — plan.json MUST contain `{"tasks": []}` at minimum.

4. **Run `maximus init` first** — When `.maximus/` does not exist, run the CLI command. Do NOT manually `mkdir`. Note: `maximus init` has NO `--help` flag — running `maximus init --help` will execute init. Just run `maximus init` directly.

5. **User confirmation is MANDATORY** — Use `AskUserQuestion` tool to confirm the config BEFORE writing it. Do NOT skip this.

6. **Follow the 4 phases in order** — Do NOT launch Explore agents, do NOT do broad codebase exploration. Each phase specifies exactly what to read and run.

7. **Phase 1 is ALWAYS `maximus validate --json`** — This is your FIRST action. Do not read files, explore, or check anything else before running this command.
</CRITICAL-CONSTRAINTS>

---

## Phase 1: Detect & Validate

**Create Task:**
```
TaskCreate:
  subject: "Detect & validate existing setup"
  description: "Run maximus validate --json and determine current state"
  activeForm: "Detecting existing setup"
```

**Your FIRST action must be running this command:**

```bash
maximus validate --json
```

Parse the JSON output. The `valid` field and `checks` array tell you the state:

### State A — `.maximus/` missing

The `directory` check has `status: "fail"`. Report to the user:

```
No Maximus setup found. I'll analyze the project and create a tailored configuration.
```

Proceed to Phase 2.

### State B — Invalid configuration

Directory exists but other checks failed. Show the failures from the JSON:

```
Existing Maximus setup found with errors:
  [list each check where status is "fail" with its message]
```

Proceed to Phase 2.

### State C — Valid configuration

All checks pass (`valid: true`). Show the `config_summary` from the JSON output:

```
Valid Maximus setup found:
  Project:      [config_summary.project_name]
  Model:        [config_summary.default_model] (escalation: [enabled/disabled])
  Timeout:      [config_summary.timeout]s
  Iterations:   [config_summary.max_iterations]
  Auto-commit:  [yes/no] (prefix: "[config_summary.commit_prefix]")
  Auto-push:    [yes/no]
```

**Use AskUserQuestion:** "Would you like to change anything?"
- Options: "No, this is good" / "Yes, I want to change settings"

- If no changes → Skip to Phase 4 handoff (skip Phases 2 and 3)
- If changes → Note what to change, proceed to Phase 2

**Mark task as completed.**

---

## Phase 2: Analyze

**Create Task:**
```
TaskCreate:
  subject: "Analyze project structure"
  description: "Read package files, git log, and count files to determine config values"
  activeForm: "Analyzing project structure"
```

Read these specific files to determine 3 values. Do NOT launch Explore agents or do broad exploration.

1. **Project name:** Read `package.json` (or `Cargo.toml`, `go.mod`, `pyproject.toml`) — extract the `name` field
2. **Commit prefix:** Run `git log --oneline -10` — look for consistent prefixes (e.g., "feat:", "fix:", "maximus:")
3. **Timeout:** Run `find . -type f -not -path './node_modules/*' -not -path './.git/*' | wc -l` — small (<100) = 600, medium (100–500) = 900, large (500+) = 1200

Present summary:

```
Project Analysis:
  Name:           [project-name]
  Timeout:        [N]s (based on ~[X] files)
  Commit prefix:  "[detected-prefix]"
```

**Mark task as completed.**

---

## Phase 3: Configure

**Create Task:**
```
TaskCreate:
  subject: "Configure Maximus settings"
  description: "Generate tailored config.yml and clean plan.json"
  activeForm: "Configuring Maximus settings"
```

### Step 1: Create or fix .maximus/

**If `.maximus/` does NOT exist (State A):**

Run this command directly (no flags):
```bash
maximus init
```

This creates `.maximus/` with config.yml, plan.json, progress.md, and updates .gitignore.

**If `.maximus/` exists but invalid (State B):**

Do NOT run `maximus init` (it refuses to re-initialize). Apply targeted fixes to the specific failed fields.

**If valid with user-requested changes (State C):**

Apply only the requested changes.

### Step 2: Write config.yml

Write `.maximus/config.yml` using EXACTLY this template. Replace only `[bracketed]` values with real values from Phase 2. Do NOT add extra comments, do NOT add descriptive comments about the project, do NOT modify the template structure.

```yaml
# Maximus Loop Configuration — [project-name]

project_name: "[actual-project-name]"

loop:
  max_iterations: -1
  mode: sequential
  auto_commit: true
  continue_on_error: false

agent:
  default_model: sonnet
  timeout: [calculated-timeout-integer]
  max_retries: 2
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
The config above is the COMPLETE and EXACT schema. Top-level keys:
- `project_name` (string)
- `loop` (max_iterations, mode, auto_commit, continue_on_error)
- `agent` (default_model, timeout, max_retries, escalation?)
- `tasks` (source, auto_mark_done)
- `context` (files?)
- `progress` (file, format)
- `git` (enabled, commit_prefix, auto_push)
- `review` (enabled, min_severity, max_phases) — optional

Do NOT invent fields. Do NOT add custom comments beyond what the template shows. See `${CLAUDE_PLUGIN_ROOT}/skills/maximus-validate/references/config-schema.md` for the full reference.
</SCHEMA-ENFORCEMENT>

### Step 3: Write clean plan.json

```json
{
  "tasks": []
}
```

### Step 4: Confirm with user

**BLOCKING — You MUST use AskUserQuestion before proceeding.**

Present the key config values, then use the `AskUserQuestion` tool:
- Question: "Does this configuration look correct?"
- Options: "Yes, looks good" / "No, I want to change something"

If the user wants changes, apply them and re-confirm. Do NOT proceed to Phase 4 until the user approves.

**Mark task as completed after user confirms.**

---

## Phase 4: Validate & Handoff

**Create Task:**
```
TaskCreate:
  subject: "Validate & handoff"
  description: "Run final validation and present next steps"
  activeForm: "Validating final configuration"
```

Run `maximus validate --json` as a final safety net.

### If valid (`valid: true`):

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
     Run /maximus-plan to design tasks for your feature
```

### If invalid:

Show failures from the JSON output. Attempt to fix (max 2 attempts). Re-validate after each fix.

If still invalid after 2 attempts, report the remaining failures and ask the user for help.

**Mark task as completed.**

---

## Red Flags

If you catch yourself doing any of these, STOP immediately:
- Launching an Explore agent or doing broad codebase exploration
- Running any command before `maximus validate --json` in Phase 1
- Creating a directory named anything other than `.maximus/`
- Adding fields or comments to config.yml that aren't in the template
- Running `maximus init --help` (there is no --help flag — this will execute init)
- Writing config without using AskUserQuestion for confirmation
- Skipping the final `maximus validate --json` check in Phase 4
- Proceeding past Phase 3 without user approval
