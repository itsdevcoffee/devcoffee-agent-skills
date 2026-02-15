---
name: maximus-init
description: Use when the user asks to "set up maximus", "configure maximus", "initialize maximus", "create maximus config", "scaffold maximus", "bootstrap maximus", or "maximus init".
---

# Maximus Init

**Announce:** "I'll validate your current setup, analyze the project, and configure Maximus Loop."

---

## Phase 1: Detect & Validate

### Step 1: Create detection task

Call TaskCreate with:
- subject: `Detect & validate existing setup`
- description: `Run maximus validate --json and determine current state`
- activeForm: `Detecting existing setup`

### Step 2: Start task

Call TaskUpdate with status `in_progress` for the task from Step 1.

### Step 3: Run validation

Run this command. This is your FIRST action — do not read files, explore, or run anything else before this.

```bash
maximus validate --json
```

Parse the JSON output. Check the `directory` check status:

**If the `directory` check has `status: "fail"`** — no `.maximus/` exists. Report to the user:

> No Maximus setup found. I'll analyze the project and create a tailored configuration.

Proceed to Phase 2.

**If `valid: true`** or **directory exists but other checks fail** — see [Alternate Paths](#alternate-paths) at the bottom.

### Step 4: Complete task

Call TaskUpdate with status `completed`.

---

## Phase 2: Analyze

### Step 1: Create analysis task

Call TaskCreate with:
- subject: `Analyze project structure`
- description: `Read package.json, git log, and count files to determine 3 config values`
- activeForm: `Analyzing project structure`

### Step 2: Start task

Call TaskUpdate with status `in_progress`.

### Step 3: Extract project name

Read `package.json` (or `Cargo.toml`, `go.mod`, `pyproject.toml`). Extract the `name` field.

STOP. Do you have the project name? Move to Step 4.

### Step 4: Detect commit prefix

Run:

```bash
git log --oneline -10
```

Look for consistent prefixes (e.g., "feat:", "fix:", "maximus:"). If none found, default to `"maximus:"`.

STOP. Do you have the commit prefix? Move to Step 5.

### Step 5: Calculate timeout

Run:

```bash
find . -type f -not -path './node_modules/*' -not -path './.git/*' -not -path './dist/*' -not -path './build/*' -not -path './.next/*' -not -path './vendor/*' | wc -l
```

- Less than 100 files → timeout: `600`
- 100–500 files → timeout: `900`
- More than 500 files → timeout: `1200`

STOP. Do you have the timeout value? Move to Step 6.

### Step 6: Present summary

```
Project Analysis:
  Name:           [project-name]
  Timeout:        [N]s (based on ~[X] files)
  Commit prefix:  "[detected-prefix]"
```

Phase 2 is complete. Do NOT explore frameworks, dependencies, integrations, or architecture.

### Step 7: Complete task

Call TaskUpdate with status `completed`.

---

## Phase 3: Configure

### Step 1: Create configuration task

Call TaskCreate with:
- subject: `Configure Maximus settings`
- description: `Run maximus init, then edit 3 config values from Phase 2`
- activeForm: `Configuring Maximus settings`

### Step 2: Start task

Call TaskUpdate with status `in_progress`.

### Step 3: Run maximus init

Run this command to create `.maximus/` with correct defaults. Never use `mkdir`. Never add flags — `maximus init --help` will execute init.

```bash
maximus init
```

This generates config.yml, plan.json, progress.md, and updates .gitignore.

### Step 4: Read the generated config

Read `.maximus/config.yml` to see the defaults.

### Step 5: Edit project_name

Use the Edit tool to change `project_name` to the value from Phase 2, Step 3.

### Step 6: Edit agent.timeout

Use the Edit tool to change the `timeout` value under the `agent:` section to the value from Phase 2, Step 5 (600, 900, or 1200).

### Step 7: Edit git.commit_prefix

Use the Edit tool to change `commit_prefix` under the `git:` section to the value from Phase 2, Step 4.

These are the ONLY 3 values you modify. Do NOT change any other fields. Do NOT add fields. Do NOT use Write on config.yml.

### Step 8: Clean plan.json

Overwrite `.maximus/plan.json` with:

```json
{
  "version": "1.0.0",
  "tasks": []
}
```

### Step 9: Confirm with user

**BLOCKING — You MUST use AskUserQuestion here.**

Present the 3 modified values and ask:
- Question: "Does this configuration look correct?"
- Options: "Yes, looks good" / "No, I want to change something"

If changes requested, apply them and re-confirm. Do NOT proceed to Phase 4 until the user approves.

### Step 10: Complete task

Call TaskUpdate with status `completed` after user confirms.

---

## Phase 4: Validate & Handoff

### Step 1: Create validation task

Call TaskCreate with:
- subject: `Validate & handoff`
- description: `Run final validation and present next steps`
- activeForm: `Validating final configuration`

### Step 2: Start task

Call TaskUpdate with status `in_progress`.

### Step 3: Run final validation

```bash
maximus validate --json
```

### Step 4: Show results

**If `valid: true`:**

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

**If invalid:** Show failures. Attempt to fix (max 2 retries). Re-validate after each fix. If still invalid after 2 attempts, ask the user for help.

### Step 5: Complete task

Call TaskUpdate with status `completed`.

---

## Alternate Paths

These paths are only used when Phase 1 detects an existing `.maximus/` directory.

### State B — Invalid configuration

Directory exists but validation checks failed. Show the failures:

```
Existing Maximus setup found with errors:
  [list each check where status is "fail" with its message]
```

Do NOT run `maximus init` (it refuses to re-initialize). Proceed to Phase 2 to gather values, then in Phase 3 apply targeted fixes to the failed checks instead of running `maximus init`.

### State C — Valid configuration

All checks pass (`valid: true`). Show the `config_summary` from the JSON:

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

- If no changes → Skip to Phase 4 (skip Phases 2 and 3)
- If changes → Note what to change, proceed to Phase 2
