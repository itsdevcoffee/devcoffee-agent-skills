---
description: >-
  This skill should be used when the user asks to "note a tldr improvement",
  "log a tldr issue", "capture a tldr idea", "jot down a tldr problem",
  "/tldr:note", or wants to quickly record a bug, feature request, or
  improvement idea for the TLDR plugin without disrupting their current
  workflow. Supports an optional --ex flag to include an example of the
  issue, which auto-triggers evaluation via /tldr:feedback.
---

# TLDR Note

Quickly capture improvement ideas, bugs, or feature requests for the TLDR plugin without disrupting the current workflow.

## Purpose

Observations about what needs fixing or improving often arise mid-task. Provide a fire-and-forget capture mechanism so nothing is lost. All entries are stored in a single catalog file for later review via `/tldr:review`.

## Path Resolution

All data lives inside the TLDR plugin directory. This skill is at `skills/note/SKILL.md` — the plugin root is two directories up (the directory containing `skills/`, `docs/`, and `.claude-plugin/`). All file paths below are relative to the plugin root.

- Notes catalog: `docs/evaluation/notes.md`
- Evaluation log: `docs/evaluation/evaluation-log.md` (used when `--ex` triggers auto-evaluation)
- Sample files: `docs/evaluation/samples/` (used when `--ex` triggers auto-evaluation)

## Input Format

```
/tldr:note [context of the improvement/issue/idea]
/tldr:note [context] --ex [copy-paste example of the issue]
```

## Capture Workflow

### Step 1: Parse Input

Extract two components from the user's input:
1. **Context** — The description of the improvement, issue, or idea (everything before `--ex` if present, or the entire input)
2. **Example** (optional) — Content after the `--ex` flag, typically a copy-paste of TLDR output demonstrating the issue

### Step 2: Expand the Note

From the user's raw context, generate an expanded interpretation:
- Restate the observation in clear, specific terms
- Identify the category: `bug`, `improvement`, `feature`, or `observation`
- Suggest the likely impact on TLDR quality
- Keep the expansion brief (2-4 sentences)

### Step 3: Append to Catalog

Read `docs/evaluation/notes.md` and append a new entry. Determine the next note number by reading existing entries — zero-pad to 3 digits (e.g., `Note 007`).

After appending, update the header counters in `notes.md`:
- Increment **Total Notes** by 1
- Increment **Pending** by 1

Entry format:

```markdown
---

### Note NNN
**Date:** YYYY-MM-DD
**Category:** [bug | improvement | feature | observation]
**Status:** pending

**Raw:** [User's original context text]

**Expanded:** [Agent's intuited expansion of the context]

**Example:** [If --ex was provided, the example content. Otherwise omit this field.]
```

### Step 4: Handle --ex Flag (When Present)

When the user includes `--ex [example]`:

1. **Log the note** as above (Steps 1-3)
2. **Auto-evaluate the example** by following the `/tldr:feedback` workflow steps inline with `--no-user-score` mode (do not prompt the user or invoke a separate command):
   - Treat the example as a TLDR sample
   - Score it on the 4 criteria (Completeness, Conciseness, Actionability, Accuracy)
   - Create a sample file in `docs/evaluation/samples/`
   - Update `docs/evaluation/evaluation-log.md`
   - The note's context provides the "what went wrong" framing for the evaluation
3. **Cross-reference:** Add the sample ID to the note entry, and reference the note ID in the sample file

### Step 5: Confirm and Return

Provide a brief confirmation (2-3 lines max):
- Note ID and category
- One-line summary of what was captured
- If `--ex` was used: mention the evaluation was logged

Then immediately return control to the user. Do NOT engage in discussion or ask follow-up questions. This is fire-and-forget.

## Important Constraints

- **Zero disruption** — Confirm in 2-3 lines, then stop. No follow-up questions.
- **Preserve user flow** — The user invoked this mid-task. Do not derail their current work.
- **Expand thoughtfully** — The agent expansion should add clarity, not just restate. Consider what a future reviewer would need to understand the note.
- **Idempotent numbering** — Always read the catalog to determine the next note number. Never assume.
