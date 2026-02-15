---
name: review
description: >-
  This skill should be used when the user asks to "review my notes",
  "triage my jot notes", "go through my notes", "check my notes",
  "what notes do I have", "review notes for [project]", "/jot:review",
  or wants to go through their pending jot notes.
---

# review

Guided triage session through pending notes. Discuss, refine, and act on items captured via `/jot:note`.

## Purpose

Notes captured mid-workflow via `/jot:note` are intentionally brief. Provide a dedicated session to:
- Review each pending note with full context
- Refine the agent's interpretation ("I said X but I meant Y")
- Decide on action: implement now, defer, or dismiss
- Act on notes when ready

## Path Resolution

The plugin root is the directory containing `skills/`, `docs/`, and `.claude-plugin/`. All file paths below are relative to the plugin root.

- Notes catalog: `docs/notes.md`

## Input Format

```
/jot:review              # Review all pending notes
/jot:review [project]    # Review pending notes for a specific project/topic
```

## Review Workflow

### Step 1: Load Pending Notes

Read `docs/notes.md` and identify all entries with `**Status:** pending`.

If a project/topic argument was provided, filter to only notes matching that project (case-insensitive).

If no pending notes exist (or none match the filter), inform the user:
> "No pending notes to review. Use `/jot:note [context]` to capture ideas."

If filtered and no matches but other pending notes exist:
> "No pending notes for '[project]'. There are N other pending notes. Run `/jot:review` to see all."

### Step 2: Present Summary

Show a brief overview of all matching pending notes:

```
Pending notes: N items [for project X]

| # | Date | Project | Category | Summary |
|---|------|---------|----------|---------|
| 001 | 2026-02-15 | aqimo | reminder | Update CLAUDE.md for soft paywall |
| 002 | 2026-02-15 | devcoffee | improvement | Add topic filtering to note review |
| ... | ... | ... | ... | ... |

Start from the top, or pick a specific note number.
```

### Step 3: Walk Through Each Note

For each pending note, present:

1. **The raw note** — What the user originally captured
2. **The expanded interpretation** — What the agent intuited
3. **The project** — Which project/topic it belongs to

Then ask the user:
> "What would you like to do with this note?"

Options to present:
- **Act** — Take action on this note now (implement, file an issue, update a file, etc.)
- **Refine** — Correct the interpretation, change project/category, add detail, then decide
- **Defer** — Keep as pending for a future session
- **Dismiss** — Remove (not relevant or already addressed)

### Step 4: Handle Each Decision

**Act:**
1. Discuss the specific action needed
2. Execute the action (edit files, create tasks, etc.)
3. Update the note's status to `actioned` with a resolution note
4. Decrement **Pending** counter in the catalog header
5. Move to the next pending note

**Refine:**
1. Let the user correct or expand the interpretation
2. Update the note's fields in `docs/notes.md` (Expanded, Project, Category)
3. Re-present the updated note and ask for a decision again

**Defer:**
1. Keep the note as `pending`
2. Optionally add user's comment about why it's deferred
3. Move to the next pending note

**Dismiss:**
1. Update the note's status to `dismissed` with a brief reason
2. Decrement **Pending** counter in the catalog header
3. Move to the next pending note

### Step 5: Session Summary

After processing all pending notes (or when the user wants to stop), provide a summary:

```
Review session complete:
- Actioned: N notes
- Deferred: N notes
- Dismissed: N notes
- Remaining pending: N notes

Actions taken:
- [List of specific actions performed]
```

## Status Values

Notes progress through these statuses:
- `pending` — Awaiting review (set by `/jot:note`)
- `actioned` — Implemented or addressed (set during review)
- `dismissed` — Not relevant or already resolved (set during review)

## Interaction Style

- **Conversational** — Treat this as a discussion, not a checklist. Allow the user to explore ideas.
- **One at a time** — Present notes individually to avoid overwhelm.
- **User drives pace** — Let the user decide when to move on. Do not rush through items.
- **Action ready** — When the user says "act", execute immediately. Do not just describe what to do.
