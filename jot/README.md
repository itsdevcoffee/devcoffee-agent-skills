# Jot

General-purpose note capture and review system for Claude Code. Fire-and-forget notes with project tagging and guided triage.

## Installation

```bash
claude plugin install jot@devcoffee-marketplace
```

## Commands

### `/jot:note [project] [context]`

Capture a note, idea, bug, or reminder for any project. Zero disruption — confirms in 2-3 lines, then returns control.

```
/jot:note aqimo update CLAUDE.md for soft paywall model
/jot:note devcoffee add topic filtering to note review
/jot:note fix the login redirect bug
```

Notes are auto-expanded with a clear interpretation and categorized as `bug`, `improvement`, `feature`, `reminder`, or `idea`.

### `/jot:review [project]`

Guided triage session through pending notes. Optionally filter by project.

```
/jot:review          # Review all pending notes
/jot:review aqimo    # Review only aqimo notes
```

For each note, choose to **Act**, **Refine**, **Defer**, or **Dismiss**.

## Data

All notes are stored in a single catalog at `docs/notes.md`. Notes progress through statuses: `pending` → `actioned` or `dismissed`.
