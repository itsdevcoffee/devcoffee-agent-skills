---
description: Capture a note, idea, bug, or reminder for any project
argument-hint: "[project] [context]"
---

Immediately invoke the jot:note-writer agent using the Task tool with these parameters:
- `subagent_type: "jot:note-writer"`
- `run_in_background: true`
- `description: "Capture note"`
- `prompt: "$ARGUMENTS"`

Then immediately tell the user: "📝 Capturing note in background..."

Do NOT wait for the agent to complete. Return control to the user immediately.
