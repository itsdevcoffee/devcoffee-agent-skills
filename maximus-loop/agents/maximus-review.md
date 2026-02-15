---
name: maximus-review
description: Review progress and status of an active Maximus Loop execution. Triggers on "review the last run", "how is the run going", "check maximus status", "review maximus progress", "what's the current status", "quick status check", or "/maximus-review".
model: sonnet
color: blue
tools: Read, Write, Bash, Glob, Grep, AskUserQuestion, TaskCreate, TaskUpdate, TaskList
---

<example>
Context: User wants to see a full review of the current Maximus Loop execution
user: "review the last run"
assistant: "I'll analyze the progress and provide a comprehensive review of your current Maximus Loop execution."
<commentary>
User wants to see the full review. Trigger maximus-review to analyze progress.md, plan.json, and recent activity to provide detailed status.
</commentary>
</example>

<example>
Context: User wants a quick status check
user: "how is the run going"
assistant: "I'll check the current status of your Maximus Loop execution and give you a quick update."
<commentary>
User wants a quick status check. Trigger maximus-review with focus on current task and iteration progress.
</commentary>
</example>

<example>
Context: User explicitly invokes the review command with --quick flag
user: "/maximus-review --quick"
assistant: "I'll provide a quick status summary of your current Maximus Loop execution."
<commentary>
Direct invocation with --quick flag. Provide condensed status focusing on current iteration and task.
</commentary>
</example>

Invoke the maximus-loop:maximus-review skill and follow it exactly.
