---
name: list
description: >-
  Use when the user asks to "list my notes", "show my notes", "what notes do I have",
  "jot list", "show notes for [project]", or wants a quick overview of captured notes
  without starting a full review session.
---

# list

Display a quick summary table of all captured jot notes.

## Purpose

Provide a fast, read-only overview of notes without entering a full triage session (`/jot:review`). Supports optional filtering by project or status.

## Path Resolution

The plugin root is the directory containing `skills/`, `docs/`, and `.claude-plugin/`. All file paths below are relative to the plugin root.

- Notes catalog: `docs/notes.md`

## Input Format

```
/jot:list
/jot:list [project]
/jot:list [status]
/jot:list [project] [status]
```

- No arguments: show all notes
- Project filter: show only notes matching that project (e.g., `aqimo`, `maximus-loop`)
- Status filter: `pending`, `resolved`, `wontfix`, or `all` (default: all)
- Both: filter by project AND status

## Workflow

### Step 1: Read Catalog

Read `docs/notes.md` and parse all note entries.

### Step 2: Apply Filters

If the user provided arguments, determine if they are a project name or status keyword:
- Status keywords: `pending`, `resolved`, `wontfix`, `all`
- Anything else is treated as a project filter

Apply matching filters. If no arguments, show all notes.

### Step 3: Display Summary

Present results as a markdown table:

```markdown
**Jot Notes** — [N] total ([X] pending, [Y] resolved)

| # | Project | Category | Status | Summary |
|---|---------|----------|--------|---------|
| 001 | aqimo | bug | pending | Brief summary of the raw note |
| 002 | devcoffee | feature | pending | Brief summary of the raw note |
```

- **Summary** column: First ~60 characters of the **Raw** field, truncated with `...` if longer
- If filters are active, show: `Filtered by: [project] [status]`
- If no notes match the filter, say: `No notes found matching "[filter]".`

### Step 4: Return

After displaying the table, stop. Do not ask follow-up questions or suggest actions.

## Important Constraints

- **Read-only** — Never modify the catalog
- **Fast** — Read once, display once, done
- **No follow-ups** — Display the table and stop
- **Smart argument parsing** — Distinguish project names from status keywords automatically
