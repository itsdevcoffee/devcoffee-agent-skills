---
name: review
description: >-
  This skill should be used when the user asks to "review tldr notes",
  "triage tldr improvements", "go through tldr backlog", "check my
  tldr notes", "what tldr notes do I have", "/tldr:review", or wants
  a dedicated session to discuss, refine, and act on pending improvement
  notes captured via /tldr:note. Walks through each pending item for
  discussion and implementation.
---

# review

Guided triage session through pending TLDR improvement notes. Discuss, refine, and act on items captured via `/tldr:note`.

## Purpose

Notes captured mid-workflow via `/tldr:note` are intentionally brief. Provide a dedicated session to:
- Review each pending note with full context
- Refine the agent's interpretation ("I said X but I meant Y")
- Decide on action: implement now, defer, or discard
- Implement changes to the TLDR skill when ready

## Path Resolution

All data lives inside the TLDR plugin directory. This skill is at `skills/review/SKILL.md` — the plugin root is two directories up (the directory containing `skills/`, `docs/`, and `.claude-plugin/`). All file paths below are relative to the plugin root.

- Notes catalog: `docs/evaluation/notes.md`
- TLDR skill file: `skills/tldr/SKILL.md`

## Review Workflow

### Step 1: Load Pending Notes

Read `docs/evaluation/notes.md` and identify all entries with `**Status:** pending`.

If no pending notes exist, inform the user:
> "No pending notes to review. Use `/tldr:note [context]` to capture improvement ideas."

### Step 2: Present Summary

Show a brief overview of all pending notes:

```
Pending TLDR notes: N items

| # | Date | Category | Summary |
|---|------|----------|---------|
| 001 | 2026-02-15 | improvement | Numbered questions get flattened |
| 002 | 2026-02-15 | feature | Timeline format for debugging |
| ... | ... | ... | ... |

Start from the top, or pick a specific note number.
```

### Step 3: Walk Through Each Note

For each pending note, present:

1. **The raw note** — What the user originally captured
2. **The expanded interpretation** — What the agent intuited
3. **The example** — If one was attached via `--ex`
4. **Related evaluation** — If a sample was auto-created, reference its score and findings

Then ask the user:
> "What would you like to do with this note?"

Options to present:
- **Implement** — Make the change to the TLDR skill now
- **Refine** — Correct the interpretation, add detail, then decide
- **Defer** — Keep as pending for a future session
- **Discard** — Remove (not relevant or already addressed)

### Step 4: Handle Each Decision

**Implement:**
1. Discuss the specific change needed
2. Read the relevant TLDR skill file (`skills/tldr/SKILL.md` or related files relative to the plugin root)
3. Make the edit
4. Update the note's status to `resolved` with a resolution note
5. Move to the next pending note

**Refine:**
1. Let the user correct or expand the interpretation
2. Update the note's "Expanded" field in `docs/evaluation/notes.md`
3. Re-present the updated note and ask for a decision again

**Defer:**
1. Keep the note as `pending`
2. Optionally add user's comment about why it's deferred
3. Move to the next pending note

**Discard:**
1. Update the note's status to `discarded` with a brief reason
2. Move to the next pending note

### Step 5: Session Summary

After processing all pending notes (or when the user wants to stop), provide a summary:

```
Review session complete:
- Implemented: N notes
- Deferred: N notes
- Discarded: N notes
- Remaining pending: N notes

Changes made:
- [List of specific edits to TLDR skill files]
```

## Status Values

Notes progress through these statuses:
- `pending` — Awaiting review (set by `/tldr:note`)
- `resolved` — Implemented or addressed (set during review)
- `discarded` — Not relevant or already fixed (set during review)

## Interaction Style

- **Conversational** — Treat this as a discussion, not a checklist. Allow the user to explore ideas.
- **One at a time** — Present notes individually to avoid overwhelm.
- **User drives pace** — Let the user decide when to move on. Do not rush through items.
- **Implementation ready** — When the user says "implement", read the relevant files and make changes immediately. Do not just describe what to change.
