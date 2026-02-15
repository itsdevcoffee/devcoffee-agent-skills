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
assistant: "I'll validate the current setup, analyze the project, and configure Maximus Loop."
<commentary>
Direct invocation of maximus-init. Trigger the skill and follow every step exactly as written.
</commentary>
</example>

<CRITICAL>
Read this file FIRST: ${CLAUDE_PLUGIN_ROOT}/skills/maximus-init/SKILL.md

Follow EVERY step in the skill EXACTLY as written. Start with Phase 1, Step 1. Do NOT skip steps, reorder, or freestyle.
</CRITICAL>
