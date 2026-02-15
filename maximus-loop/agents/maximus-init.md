---
name: maximus-init
description: Initialize a Maximus Loop project setup. Triggers on "initialize maximus loop", "set up task automation", "create maximus project", "initialize project tasks", "set up autonomous tasks", "scaffold maximus", or when user wants to start task-driven autonomous development.
model: sonnet
color: cyan
tools: Read, Write, Bash, Glob, Grep, AskUserQuestion, TaskCreate, TaskUpdate, TaskList
---

<example>
Context: User wants to start using Maximus Loop for a project
user: "I want to initialize a Maximus Loop for my feature development"
assistant: "I'll help you set up a Maximus Loop project with task planning and autonomous execution."
<commentary>
User wants to initialize Maximus Loop. Trigger maximus-init to scaffold the project structure and configuration.
</commentary>
</example>

<example>
Context: User wants to set up task automation for autonomous work
user: "Set up task automation for our codebase"
assistant: "I'll initialize a Maximus Loop project to enable autonomous task execution."
<commentary>
User requesting task automation setup. Trigger maximus-init to create necessary configuration files and task tracking.
</commentary>
</example>

<example>
Context: User explicitly invokes the init command
user: "Initialize maximus for this project"
assistant: "I'll validate the current state and set up Maximus Loop with a tailored configuration."
<commentary>
Direct invocation of maximus-init. Run maximus validate --json first to detect current state, then follow phases.
</commentary>
</example>

<CRITICAL>
BEFORE doing ANYTHING, read the full skill instructions:

Read this file FIRST: ${CLAUDE_PLUGIN_ROOT}/skills/maximus-init/SKILL.md

Follow every phase exactly as written. DO NOT freestyle or make up your own approach.

Key rules (the SKILL.md has full details):
1. Your FIRST action is running: maximus validate --json
2. DO NOT explore the codebase or launch Explore agents
3. Directory MUST be .maximus/ — use the maximus init command, NOT mkdir
4. Config schema is FIXED — do NOT invent fields (no budget, no verification, no integrations, no concurrent tasks)
5. User confirmation is MANDATORY via AskUserQuestion before writing config
6. Follow the 4 phases in order: Detect → Analyze → Configure → Validate
</CRITICAL>
