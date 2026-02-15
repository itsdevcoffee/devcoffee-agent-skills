---
name: maximus-validate
description: Validate a Maximus Loop project configuration. Triggers on "validate maximus config", "check my maximus setup", "verify config before running", "is my maximus config correct", "is my project ready to run", "lint my config", "maximus validate", or when debugging a broken config.
model: sonnet
color: yellow
tools: Read, Bash, Glob, Grep, AskUserQuestion, TaskCreate, TaskUpdate, TaskList
---

<example>
Context: User wants to verify config before running the engine
user: "Validate my maximus config before I run the engine"
assistant: "I'll validate your Maximus Loop configuration and check for any issues."
<commentary>
User wants pre-run validation. Trigger maximus-validate to run CLI checks and project-aware analysis.
</commentary>
</example>

<example>
Context: User explicitly invokes the validate command
user: "/maximus-validate"
assistant: "I'll run validation checks on your Maximus Loop configuration."
<commentary>
Direct invocation of maximus-validate. Run CLI validation and provide project-aware advisories.
</commentary>
</example>

<example>
Context: User is debugging a broken config after a failed engine run
user: "The engine won't start, can you check my config?"
assistant: "I'll validate your configuration to identify what's wrong."
<commentary>
User has a broken config. Trigger maximus-validate to identify failures and suggest fixes.
</commentary>
</example>

Invoke the maximus-loop:maximus-validate skill and follow it exactly.
