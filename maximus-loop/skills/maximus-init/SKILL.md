---
name: maximus-init
description: This skill should be used when the user asks to "set up maximus", "configure maximus", "initialize maximus", "create maximus config", "scaffold maximus", "bootstrap maximus", or "maximus init". Provides project-aware setup that analyzes the codebase to generate a tailored config.yml instead of generic boilerplate.
---

# Maximus Init — Project-Aware Setup

Run `maximus init` to generate default config files, then tailor exactly 3 values based on project analysis. The agent does NOT write config from scratch — `maximus init` generates the correct template and the agent only tweaks 3 values.

**Announce:** "I'll set up Maximus Loop for your project by analyzing the codebase and generating a tailored configuration."

<CRITICAL-CONSTRAINTS>
## Non-Negotiable Rules

1. **Never `mkdir`** — Always use `maximus init` to create `.maximus/`. Never create the directory manually. Note: `maximus init` has NO `--help` flag — running `maximus init --help` will execute init. Just run `maximus init` directly.

2. **Only modify 3 config values** — After `maximus init` generates the default config, change ONLY: `project_name`, `agent.timeout`, `git.commit_prefix`. Do NOT add fields, remove fields, rewrite the file, or restructure the config. The defaults are correct for everything else.

3. **Phase 2 reads exactly 3 things** — package.json (project name), git log (commit prefix), file count (timeout). No framework detection, no dependency analysis, no broad exploration, no reading source files.

4. **User confirmation is MANDATORY** — Use `AskUserQuestion` to confirm the config BEFORE proceeding to Phase 4.

5. **Task API is MANDATORY** — Call TaskCreate at the START of each phase and TaskUpdate (status: "completed") at the END. This gives the user real-time progress visibility.

6. **Phase 1 is ALWAYS `maximus validate --json`** — This is the first action after creating the Phase 1 task. Do not read files, explore, or check anything else before running this command.
</CRITICAL-CONSTRAINTS>

---

## Phase 1: Detect & Validate

**Create a task for this phase.** Call the TaskCreate tool:
- subject: `Detect & validate existing setup`
- description: `Run maximus validate --json and determine current state`
- activeForm: `Detecting existing setup`

Then set it to in_progress with TaskUpdate.

**First action — run this command:**

```bash
maximus validate --json
```

Parse the JSON output. The `valid` field and `checks` array determine the state:

### State A — `.maximus/` missing

The `directory` check has `status: "fail"`. Report:

```
No Maximus setup found. I'll analyze the project and create a tailored configuration.
```

Proceed to Phase 2.

### State B — Invalid configuration

Directory exists but other checks failed. Show the failures:

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

**BLOCKING — Use AskUserQuestion:** "Would you like to change anything?"
- Options: "No, this is good" / "Yes, I want to change settings"

Wait for the user's response before proceeding.

- If no changes → Skip to Phase 4 (skip Phases 2 and 3)
- If changes → Note what to change, proceed to Phase 2

**Mark the Phase 1 task as completed** using TaskUpdate (status: "completed").

---

## Phase 2: Analyze

**Create a task for this phase.** Call the TaskCreate tool:
- subject: `Analyze project structure`
- description: `Read package.json, git log, and count files to determine 3 config values`
- activeForm: `Analyzing project structure`

Then set it to in_progress with TaskUpdate.

Read exactly 3 things to derive 3 config values. Nothing else.

1. **Project name:** Read `package.json` (or `Cargo.toml`, `go.mod`, `pyproject.toml`) — extract the `name` field
2. **Commit prefix:** Run `git log --oneline -10` — look for consistent prefixes (e.g., "feat:", "fix:", "maximus:")
3. **Timeout:** Run `find . -type f -not -path './node_modules/*' -not -path './.git/*' -not -path './dist/*' -not -path './build/*' -not -path './.next/*' -not -path './vendor/*' | wc -l` — small (<100) = 600, medium (100–500) = 900, large (500+) = 1200

Present summary:

```
Project Analysis:
  Name:           [project-name]
  Timeout:        [N]s (based on ~[X] files)
  Commit prefix:  "[detected-prefix]"
```

That's it. Do NOT explore frameworks, dependencies, integrations, architecture, or anything else.

**Mark the Phase 2 task as completed** using TaskUpdate (status: "completed").

---

## Phase 3: Configure

**Create a task for this phase.** Call the TaskCreate tool:
- subject: `Configure Maximus settings`
- description: `Run maximus init, then modify 3 config values from Phase 2 analysis`
- activeForm: `Configuring Maximus settings`

Then set it to in_progress with TaskUpdate.

### Step 1: Create .maximus/

**If `.maximus/` does NOT exist (State A):**

Run this command directly (no flags):
```bash
maximus init
```

This generates correct default files: config.yml, plan.json, progress.md, and updates .gitignore. Do NOT manually create any of these files.

**If `.maximus/` exists but is invalid (State B):**

Do NOT run `maximus init` (it refuses to re-initialize). Apply targeted fixes to the specific failed checks only.

**If valid with user-requested changes (State C):**

Apply only the requested changes to the existing config.

### Step 2: Modify ONLY 3 values in config.yml

Read the generated `.maximus/config.yml` first to see the defaults. Then use the Edit tool to change exactly these 3 values:

1. **`project_name`** → value from Phase 2 analysis
2. **`agent.timeout`** → calculated timeout from Phase 2 (600, 900, or 1200)
3. **`git.commit_prefix`** → detected prefix from Phase 2

Do NOT modify any other fields. Do NOT add fields. Do NOT rewrite the file. Do NOT restructure the config. The defaults generated by `maximus init` are correct for everything else.

### Step 3: Write clean plan.json

Overwrite `.maximus/plan.json` with:

```json
{
  "version": "1.0.0",
  "tasks": []
}
```

### Step 4: Confirm with user

**BLOCKING — Use AskUserQuestion before proceeding.**

Present the 3 modified values and ask:
- Question: "Does this configuration look correct?"
- Options: "Yes, looks good" / "No, I want to change something"

If changes requested, apply them and re-confirm. Do NOT proceed to Phase 4 until approved.

**Mark the Phase 3 task as completed** using TaskUpdate (status: "completed") after user confirms.

---

## Phase 4: Validate & Handoff

**Create a task for this phase.** Call the TaskCreate tool:
- subject: `Validate & handoff`
- description: `Run final validation and present next steps`
- activeForm: `Validating final configuration`

Then set it to in_progress with TaskUpdate.

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

**Mark the Phase 4 task as completed** using TaskUpdate (status: "completed").

---

## Red Flags

If you catch yourself doing any of these, STOP immediately:
- Running any command before `maximus validate --json` in Phase 1
- Reading anything beyond package.json, git log, and file count in Phase 2
- Exploring frameworks, dependencies, integrations, or architecture
- Reading source files, tsconfig, app configs, or any project files beyond the 3 specified
- Using `mkdir` to create `.maximus/` instead of `maximus init`
- Writing config.yml from scratch instead of editing the generated file
- Modifying more than 3 values (project_name, agent.timeout, git.commit_prefix) in config.yml
- Adding, removing, or renaming any fields in config.yml
- Rewriting the entire config.yml file
- Re-running `maximus init` when `.maximus/` already exists
- Running `maximus init --help` (no --help flag — this will execute init)
- Skipping AskUserQuestion for user confirmation
- Proceeding past Phase 3 without user approval
- Modifying progress.md contents (maximus init generates it correctly)
- Skipping TaskCreate/TaskUpdate calls — every phase MUST have both
- Running commands not specified in the phases (e.g., `maximus --version`)
