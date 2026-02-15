---
name: maximus-init
description: This skill should be used when the user asks to "set up maximus", "configure maximus", "initialize maximus", "create maximus config", "scaffold maximus", "bootstrap maximus", or "maximus init". Provides project-aware setup that analyzes the codebase to generate a tailored config.yml instead of generic boilerplate.
---

# Maximus Init — Project-Aware Setup

Set up the Maximus Loop autonomous engine for a specific project. Analyze the codebase to generate a tailored config.yml instead of generic defaults.

**Announce:** "I'll set up Maximus Loop for your project by analyzing the codebase and generating a tailored configuration."

<CRITICAL-CONSTRAINTS>
## Non-Negotiable Rules

1. **Directory MUST be `.maximus/`** — NOT `maximus-loop/`, NOT `maximus/`, NOT any other name. The engine ONLY reads from `.maximus/`.

2. **Config schema is FIXED** — Use the EXACT field names from the template below. Do NOT invent fields. Reference: `${CLAUDE_PLUGIN_ROOT}/skills/maximus-validate/references/config-schema.md`

3. **Plan schema is FIXED** — plan.json MUST contain `{"tasks": []}` at minimum.

4. **Run `maximus init` first** — When `.maximus/` does not exist, run the CLI command. Do NOT manually `mkdir`.

5. **Ask for user confirmation** — Present config and ask "Does this look correct?" BEFORE writing it.
</CRITICAL-CONSTRAINTS>

## Task API Integration

Create 4 phase tasks upfront with TaskCreate, then update status as each phase completes.

```
TaskCreate: subject="Detect & validate existing setup", activeForm="Detecting existing setup"
TaskCreate: subject="Analyze project structure", activeForm="Analyzing project structure"
TaskCreate: subject="Configure Maximus settings", activeForm="Configuring Maximus settings"
TaskCreate: subject="Validate & handoff", activeForm="Validating final configuration"
```

---

## Phase 1: Detect & Validate

**Mark task as in_progress.**

Run `maximus validate --json` to detect the current state.

Three outcomes:

### State A — `.maximus/` missing
The `directory` check will fail. Report:
```
No Maximus setup found. I'll create one tailored to your project.
```
Proceed to Phase 2.

### State B — Invalid configuration
One or more checks failed (but directory exists). Show the failures:
```
Existing setup found with errors:
  ✗ [failure messages from checks]
I'll fix these issues.
```
Proceed to Phase 2.

### State C — Valid configuration
All checks pass. Show the config summary from the JSON output:
```
Valid Maximus setup found:
  Project:      [project_name]
  Model:        [default_model] (escalation: [status])
  Timeout:      [N]s
  Iterations:   [N]
  Auto-commit:  [yes/no] (prefix: "[prefix]")
```

**Ask:** "Would you like to change anything, or is this good?"

- If no changes → Skip to Phase 4 handoff
- If changes requested → Note what to change, proceed to Phase 2

**Mark task as completed.**

---

## Phase 2: Analyze

**Mark task as in_progress.**

Read project files to determine tailored values:

1. **Project name:** Read `package.json`, `Cargo.toml`, `go.mod`, or `pyproject.toml`
2. **Commit prefix:** Check `git log --oneline -10` for patterns (e.g., "feat:", "fix:", "maximus:")
3. **Timeout:** Count files — small (<100) = 600, medium (100–500) = 900, large (500+) = 1200

Present summary:
```
Project Analysis:
  Name:           [project-name]
  Timeout:        [N]s (based on [X] files)
  Commit prefix:  "[detected-prefix]"
```

**Mark task as completed.**

---

## Phase 3: Configure

**Mark task as in_progress.**

### If `.maximus/` does NOT exist (State A):

1. Run `maximus init` — creates the directory, default files, and .gitignore entries
2. Read the generated `.maximus/config.yml`
3. Modify only these 3 values from Phase 2 analysis:
   - `project_name`
   - `agent.timeout`
   - `git.commit_prefix`
4. Enable escalation (the default template doesn't include it):
   ```yaml
   escalation:
     enabled: true
     simple: haiku
     medium: sonnet
     complex: opus
   ```

### If `.maximus/` exists but invalid (State B):

Apply targeted fixes to the specific failed fields. Do NOT rewrite the entire config unless it's unsalvageable.

### If valid with user-requested changes (State C):

Apply only the requested changes.

### Write config.yml

The config MUST follow this exact schema. Replace only `[bracketed]` values:

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

Do NOT invent fields. See `${CLAUDE_PLUGIN_ROOT}/skills/maximus-validate/references/config-schema.md` for the full reference.
</SCHEMA-ENFORCEMENT>

### Write clean plan.json

```json
{
  "tasks": []
}
```

### Present config and confirm

Show the key values and **ask:** "Does this configuration look correct?"

**STOP and wait for user confirmation before proceeding.**

**Mark task as completed after user confirms.**

---

## Phase 4: Validate & Handoff

**Mark task as in_progress.**

Run `maximus validate --json` as a final safety net.

### If valid:

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

Show failures. Attempt to fix (max 2 attempts). Re-validate after each fix.

If still invalid after 2 attempts, report the remaining failures and ask the user for help.

**Mark task as completed.**

---

## Red Flags

If you catch yourself doing any of these, STOP:
- Creating a directory named anything other than `.maximus/`
- Adding fields to config.yml that aren't in the schema
- Using `mkdir` instead of `maximus init`
- Writing config without asking the user first
- Skipping the final `maximus validate --json` check
