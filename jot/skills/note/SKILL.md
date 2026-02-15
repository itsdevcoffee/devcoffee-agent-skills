---
name: note
description: >-
  This skill should be used when the user asks to "jot this down", "note this",
  "capture a note", "remember this for later", "log a reminder", "save this thought",
  "make a note", or wants to quickly record a bug, idea, reminder, or improvement
  for any project.
---

# note

Quickly capture notes, ideas, bugs, reminders, or improvements for any project without disrupting the current workflow.

## Purpose

Observations and ideas arise mid-task. Provide a fire-and-forget capture mechanism so nothing is lost. All entries are stored in a single catalog file tagged by project/topic for later review via `/jot:review`.

## Path Resolution

The plugin root is the directory containing `skills/`, `docs/`, and `.claude-plugin/`. All file paths below are relative to the plugin root.

- Notes catalog: `docs/notes.md`

## Input Format

```
/jot:note [project/topic] [context of the note]
/jot:note [context without explicit project]
```

When no project is explicitly stated, infer the project from context (e.g., current working directory, recent conversation topic). If unambiguous, use the inferred project. If truly ambiguous, use `general`.

## Capture Workflow

### Step 1: Parse Input

Extract two components from the user's input:
1. **Project/Topic** — The project or topic this note belongs to (e.g., `aqimo`, `devcoffee`, `personal`). Infer from context if not explicitly stated.
2. **Context** — The description of the note, idea, bug, or reminder.

### Step 2: Expand the Note

From the user's raw context, generate an expanded interpretation:
- Restate the observation in clear, specific terms
- Identify the category: `bug`, `improvement`, `feature`, `reminder`, or `idea`
- Consider what a future reviewer would need to understand the note
- Keep the expansion brief (2-4 sentences)

### Step 3: Append to Catalog

Read `docs/notes.md` and append a new entry. Determine the next note number by reading existing entries — zero-pad to 3 digits (e.g., `Note 007`).

After appending, update the header counters in `notes.md`:
- Increment **Total Notes** by 1
- Increment **Pending** by 1

Entry format:

```markdown
---

### Note NNN
**Date:** YYYY-MM-DD
**Project:** [project/topic name]
**Category:** [bug | improvement | feature | reminder | idea]
**Status:** pending

**Raw:** [User's original context text]

**Expanded:** [Agent's expanded interpretation of the context]
```

### Step 4: Confirm and Return

Provide a brief confirmation (2-3 lines max):
- Note ID, project, and category
- One-line summary of what was captured

Then immediately return control to the user. Do NOT engage in discussion or ask follow-up questions. This is fire-and-forget.

## Important Constraints

- **Zero disruption** — Confirm in 2-3 lines, then stop. No follow-up questions.
- **Preserve user flow** — The user invoked this mid-task. Do not derail their current work.
- **Expand thoughtfully** — The agent expansion should add clarity, not just restate. Consider what a future reviewer would need to understand the note.
- **Idempotent numbering** — Always read the catalog to determine the next note number. Never assume.
- **Smart project inference** — Prefer inferring the project from context over defaulting to `general`. Use conversation history, working directory name, or explicit mention.
