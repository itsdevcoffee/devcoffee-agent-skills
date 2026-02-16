---
name: init
description: Use when the user asks to "set up maximus", "configure maximus", "initialize maximus", "create maximus config", "scaffold maximus", "bootstrap maximus", or "maximus init".
---

# Arc Init

**Announce:** "I'll validate your current setup, analyze the project, and configure Maximus Loop."

---

## Phase 1: Detect & Validate

Execute the following steps in order. Each step is a single tool call.

### Step 1: Create Task
Call TaskCreate with:
- subject: "Detect & validate existing setup"
- description: "Run maximus validate --json and determine current state"
- activeForm: "Detecting existing setup"

### Step 2: Update Task Status
Call TaskUpdate with status `in_progress` for the task from Step 1.

### Step 3: Run Validation
Run `maximus validate --json`

This is your FIRST action. Do NOT read files, explore, or run anything else before this.

### Step 4: Parse Validation Output

Parse the JSON output and check the `directory` check status. This determines which state path to follow.

**State A — No Maximus Setup (directory check has `status: "fail"`)**

No `.maximus/` directory exists.

Announce:
```
No Maximus setup found. I'll analyze the project and create a tailored configuration.
```

Proceed to Phase 2.

**State B — Existing Setup with Errors (directory exists, other checks fail)**

`.maximus/` exists but validation shows failures.

Announce:
```
Existing Maximus setup found with errors:
  [list each check where status is "fail" with its message]
```

Proceed to Phase 2. **CRITICAL:** Do NOT run `maximus init` in Phase 3 Step 14 — it refuses to re-initialize existing directories. In Phase 3, apply targeted fixes instead.

**State C — Valid Setup (`valid: true`)**

All checks pass. Show the `config_summary` from the JSON:

```
Valid Maximus setup found:
  Project:      [config_summary.project_name]
  Model:        [config_summary.default_model] (escalation: [enabled/disabled])
  Timeout:      [config_summary.timeout]s
  Iterations:   [config_summary.max_iterations]
  Auto-commit:  [yes/no] (prefix: "[config_summary.commit_prefix]")
  Auto-push:    [yes/no]
```

Use AskUserQuestion: "Would you like to change anything?" with options:
- "No, this is good"
- "Yes, I want to change settings"

If user selects "No, this is good":
- Complete task with TaskUpdate status `completed`
- Skip to Phase 4 (skip Phases 2 and 3 entirely)

If user selects "Yes, I want to change settings":
- Note what settings to change
- Complete task with TaskUpdate status `completed`
- Proceed to Phase 2

### Step 5: Complete Detection Task
Call TaskUpdate with status `completed` for the task from Step 1.

---

## Phase 2: Analyze

Execute the following steps in order. Each step is a single tool call.

### Step 6: Create Analysis Task
Call TaskCreate with:
- subject: "Analyze project structure"
- description: "Read package.json, git log, and count files to determine 3 config values"
- activeForm: "Analyzing project structure"

### Step 7: Update Task Status
Call TaskUpdate with status `in_progress` for the task from Step 6.

### Step 8: Extract Project Name
Read `package.json` (or `Cargo.toml`, `go.mod`, `pyproject.toml` for other languages).

Extract the `name` field value.

STOP. Move to Step 9.

### Step 9: Detect Commit Prefix
Run `git log --oneline -10`

Look for consistent prefixes in commit messages (e.g., "feat:", "fix:", "maximus:").

If a prefix pattern is found, use it. If no consistent pattern exists, default to `"maximus:"`.

STOP. Move to Step 10.

### Step 10: Calculate Timeout
Run:
```bash
find . -type f -not -path './node_modules/*' -not -path './.git/*' -not -path './dist/*' -not -path './build/*' -not -path './.next/*' -not -path './vendor/*' | wc -l
```

Calculate timeout based on file count:
- Less than 100 files → 600
- 100-500 files → 900
- More than 500 files → 1200

STOP. Move to Step 11.

### Step 11: Print Analysis Summary
Print:
```
Project Analysis:
  Name:           [project-name from Step 8]
  Timeout:        [N]s (based on ~[X] files)
  Commit prefix:  "[detected-prefix from Step 9]"
```

Phase 2 is complete.

<HARD-CONSTRAINT>
Steps 8-10 are the ONLY reads in this phase. Do NOT read, explore, or analyze:
- README, tsconfig, or any config files beyond package.json
- Framework or dependency details
- Project architecture or integrations
- Test configuration or CI setup
- Any file not explicitly listed in Steps 8-10
</HARD-CONSTRAINT>

### Step 12: Complete Analysis Task
Call TaskUpdate with status `completed` for the task from Step 6.

---

## Phase 3: Configure

Execute the following steps in order. Each step is a single tool call.

### Step 13: Create Configuration Task
Call TaskCreate with:
- subject: "Configure Maximus settings"
- description: "Run maximus init, then edit 3 config values from Phase 2"
- activeForm: "Configuring Maximus settings"

### Step 14: Update Task Status
Call TaskUpdate with status `in_progress` for the task from Step 13.

### Step 15: Initialize Directory

**For State A only (no existing setup):**

Run `maximus init` with no flags and no arguments.

Never use `mkdir`. Never add flags — `maximus init --help` will execute init instead of showing help.

**For State B (existing setup with errors):**

Skip this step entirely. The `.maximus/` directory already exists, and `maximus init` refuses to re-initialize existing directories.

### Step 16: Read Default Configuration
Read `.maximus/config.yml` to see the current/default values.

### Step 17: Update Project Name
Use Edit tool to change `project_name` to the value from Phase 2, Step 8.

### Step 18: Update Timeout
Use Edit tool to change the `timeout` value under the `agent:` section to the value from Phase 2, Step 10 (600, 900, or 1200).

### Step 19: Update Commit Prefix
Use Edit tool to change `commit_prefix` under the `git:` section to the value from Phase 2, Step 9.

**CONSTRAINT:** These are the ONLY 3 values you modify. Do NOT change any other fields. Do NOT add fields. Do NOT use Write tool on config.yml — only use Edit.

### Step 20: Initialize Plan File
Write `.maximus/plan.json` with:
```json
{
  "version": "1.0.0",
  "tasks": []
}
```

### Step 21: User Confirmation (BLOCKING)

Use AskUserQuestion: "Does this configuration look correct?" with options:
- "Yes, looks good"
- "No, I want to change something"

Present the 3 modified values:
```
Configuration:
  Project name:   [value from Step 17]
  Timeout:        [value from Step 18]s
  Commit prefix:  "[value from Step 19]"
```

If user selects "No, I want to change something":
- Ask what to change
- Apply changes using Edit tool
- Re-confirm with another AskUserQuestion
- Repeat until user approves

Do NOT proceed to Step 22 until user selects "Yes, looks good".

### Step 22: Complete Configuration Task
Call TaskUpdate with status `completed` for the task from Step 13 after user confirms.

---

## Phase 4: Validate & Handoff

Execute the following steps in order. Each step is a single tool call.

### Step 23: Create Validation Task
Call TaskCreate with:
- subject: "Validate & handoff"
- description: "Run final validation and present next steps"
- activeForm: "Validating final configuration"

### Step 24: Update Task Status
Call TaskUpdate with status `in_progress` for the task from Step 23.

### Step 25: Final Validation
Run `maximus validate --json`

### Step 26: Handle Validation Result

**If `valid: true`:**

Print:
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

Proceed to Step 28.

**If invalid:**

Show failures from the validation output.

Attempt to fix the issues (max 2 retries):
1. Identify the failing check
2. Apply targeted fix using Edit tool
3. Run `maximus validate --json` again
4. If still invalid, repeat once more (max 2 total attempts)

If still invalid after 2 attempts:
- Show the persistent failures
- Ask the user for help: "I've attempted to fix these issues but validation still fails. Could you help me understand what needs to change?"

### Step 27: Complete Validation Task
Call TaskUpdate with status `completed` for the task from Step 23.

---

## Alternate Paths

This skill has three possible execution paths determined in Phase 1, Step 4:

### State A: No Existing Setup
**Trigger:** `directory` check has `status: "fail"` in validation JSON

**Path:** Phase 1 → Phase 2 → Phase 3 (with `maximus init` in Step 15) → Phase 4

**Description:** Fresh initialization. Creates `.maximus/` directory, analyzes project, configures settings, validates.

### State B: Existing Setup with Errors
**Trigger:** `.maximus/` exists but other validation checks fail

**Path:** Phase 1 → Phase 2 → Phase 3 (skip `maximus init` in Step 15) → Phase 4

**Description:** Repair mode. Skips `maximus init` (refuses to re-initialize), analyzes project, applies targeted fixes to existing config, validates.

**Critical difference:** Step 15 is skipped because `maximus init` will fail on existing directories.

### State C: Valid Existing Setup
**Trigger:** `valid: true` in validation JSON and user selects "No, this is good"

**Path:** Phase 1 → Phase 4 (Phases 2 and 3 skipped entirely)

**Description:** Configuration already valid. Skips analysis and configuration, jumps directly to validation and handoff.

**Critical difference:** If user wants changes, treat as State B and proceed through all phases.
