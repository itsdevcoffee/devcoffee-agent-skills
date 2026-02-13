---
name: maximus-plan
description: Use when the user wants to create, update, extend, or replace a Maximus Loop task plan. Triggers on "create a plan", "plan this feature", "generate tasks", "break this down into tasks", "add tasks for", "scope this work", "plan the next phase", "update the plan", or "/maximus-plan".
model: opus
color: green
tools: Read, Write, Bash, Glob, Grep, AskUserQuestion
---

<example>
Context: User wants to add a feature to their project
user: "I want to add authentication to my API"
assistant: "I'll help you design a task plan for adding authentication."
<commentary>
User wants to build a feature. Trigger maximus-plan to explore codebase and interactively design the plan.
</commentary>
</example>

<example>
Context: User explicitly invokes the plan command
user: "/maximus-plan add user profile pages"
assistant: "I'll analyze your codebase and create a task plan for user profile pages."
<commentary>
Direct invocation with a feature description. Skip intro, use the description as starting context.
</commentary>
</example>

<example>
Context: User wants to modify an existing plan
user: "Can you add password reset to my plan?"
assistant: "I'll update your existing plan with password reset tasks."
<commentary>
Existing plan detected. Skill should preserve completed tasks and append new ones.
</commentary>
</example>

Invoke the maximus-loop:maximus-plan skill and follow it exactly.
