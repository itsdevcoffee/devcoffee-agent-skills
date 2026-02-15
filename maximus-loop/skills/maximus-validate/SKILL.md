---
name: maximus-validate
description: Validate a Maximus Loop project configuration. Run deterministic CLI checks and provide project-aware advisories. Use when the user asks to "validate maximus", "check maximus config", "verify maximus setup", "is my maximus config correct", or before running the engine.
---

# Maximus Validate — Configuration Validator

Validate the Maximus Loop project configuration by running deterministic CLI checks and providing project-aware advisories.

**Announce:** "I'll validate your Maximus Loop configuration and check for potential issues."

## Phase 1: Run CLI Validation

Run the `maximus validate` CLI command with JSON output:

```bash
maximus validate --json
```

Parse the JSON result. The output has this structure:
```json
{
  "valid": true|false,
  "checks": [{ "name": "...", "status": "pass|fail|warn", "message": "..." }],
  "config_summary": { "project_name": "...", "default_model": "...", ... } | null
}
```

**If all checks pass with no failures:** Proceed to Phase 2 for advisories.

**If any checks fail:** Present the failures clearly:
```
Validation Failures:
  ✗ [check.message for each failed check]
```

If the user asks to fix issues, apply targeted fixes. Otherwise, report only.

---

## Phase 2: Project-Aware Analysis

This phase adds intelligence on top of the CLI's deterministic checks. Read project files and compare against the config.

### Advisories to check (only report if relevant):

1. **Timeout vs project size:**
   - Count files: `find . -type f -not -path './node_modules/*' -not -path './.git/*' | wc -l`
   - Small (<100 files): 600s is fine, 900+ may be excessive
   - Medium (100–500): 900s recommended
   - Large (500+): 1200s recommended
   - Report if timeout seems mismatched

2. **Context files:**
   - Check if `context.files` includes `CLAUDE.md` (if one exists in the project)
   - Check if referenced context files actually exist

3. **Escalation status:**
   - If escalation is disabled but plan has tasks with `complexity_level`, note the mismatch

4. **Commit prefix vs git log:**
   - Run `git log --oneline -5` and compare against `git.commit_prefix`
   - If prefix doesn't match recent commit style, note it (informational only)

5. **Plan health:**
   - If plan has tasks, report completion status (X/Y completed, Z pending)
   - If all tasks are complete, suggest creating a new plan

### Output format:

**If advisories found:**
```
Advisories:
  • [advisory description]
  • [advisory description]
```

**If no advisories:** Skip this section entirely. Don't pad the output.

---

## Phase 3: Present Findings

Combine CLI results and advisories into a clear summary.

**Valid with no advisories:**
```
✓ Configuration is valid

Configuration:
  Project:      [name]
  Model:        [model] (escalation: [status])
  Timeout:      [N]s
  Iterations:   [N]
  Auto-commit:  [yes/no] (prefix: "[prefix]")
  Auto-push:    [yes/no]

Ready to run: maximus run
```

**Valid with advisories:**
```
✓ Configuration is valid (with advisories)

[Config summary as above]

Advisories:
  • [list]
```

**Invalid:**
```
✗ Configuration has errors

Failures:
  ✗ [list]

[Advisories if any]

Fix the failures above, then re-run /maximus-validate.
```

---

## Constraints

- **Read-only by default.** Do NOT write files unless the user explicitly asks to fix something.
- **CLI facts vs skill advisories:** Always distinguish between what the CLI reported (deterministic) and what you observed (advisory). Never mix them.
- **Short output when valid:** If everything passes with no advisories, keep it brief. Don't pad.
- **Config schema reference:** `${CLAUDE_PLUGIN_ROOT}/skills/maximus-validate/references/config-schema.md`
