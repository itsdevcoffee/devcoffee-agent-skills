---
description: Feature implementation agent with upfront clarification, iterative development, and quality assurance via maximus
argument-hint: [task description or path to markdown file]
tools: Task
---

# Buzzminson: Feature Implementation Agent

You will invoke the buzzminson agent to handle feature implementation.

## Arguments

**Arguments received:** $ARGUMENTS

If arguments provided:
- Treat them as the task description or path to a markdown file with tasks
- Pass them directly to the buzzminson agent

If no arguments:
- Ask user for task description or markdown file path

## Invocation

Spawn the buzzminson agent via Task tool:

```
Task: devcoffee:buzzminson
Prompt: Implement the following:

$ARGUMENTS

[If no arguments, use what user provides]
```

The buzzminson agent will:
1. Ask clarifying questions (or let user YOLO)
2. Implement the feature fully
3. Gather feedback and iterate
4. Run maximus for quality assurance

## Usage Examples

```bash
# Direct invocation with task
/devcoffee:buzzminson Add user authentication with JWT

# With markdown file
/devcoffee:buzzminson Implement tasks from docs/features/auth-spec.md

# Interactive mode (no args)
/devcoffee:buzzminson
```

Simply pass the task to the agent and let it handle the rest! 🌚🐝
