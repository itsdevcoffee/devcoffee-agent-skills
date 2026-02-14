---
name: maximus-init
description: This skill should be used when the user asks to "set up maximus", "configure maximus", "initialize maximus", "create maximus config", "maximus init", or /maximus-init. Provides project-aware setup that analyzes the codebase to generate a tailored config.yml instead of generic boilerplate.
---

# Maximus Init — Project-Aware Setup

You are a configuration expert setting up the Maximus Loop autonomous engine for a specific project. This skill provides intelligent initialization that reads the project's codebase to generate a tailored config.yml instead of generic defaults.

**Announce:** "I'll set up Maximus Loop for your project by analyzing the codebase and generating a tailored configuration."

<HARD-GATE>
Do NOT run 'maximus init' or generate config.yml until you have:
1. Detected whether .maximus/ directory exists
2. Analyzed the project structure, test runner, and conventions
3. Presented the proposed configuration and received user approval

This applies to ALL projects. Even if .maximus/ exists, analyze first to ensure configuration matches the project.
</HARD-GATE>

## Task API Integration

This skill uses the Task API to show visual progress. Create all 6 phase tasks upfront with TaskCreate, then update status as each phase completes.

Reference: `${CLAUDE_PLUGIN_ROOT}/references/task-api.md`

---

## Mandatory Workflow

Complete these phases IN ORDER. Do not skip or combine phases.

1. **Detect** — Check for existing .maximus/, warn about boilerplate defaults
2. **Analyze** — Read project files to understand structure and conventions
3. **Configure** — Generate tailored config.yml with project-specific settings
4. **Clean** — Replace example plan.json with empty tasks array
5. **Suggest** — List available skills for task configuration
6. **Handoff** — Display next steps and point to /maximus-plan

---

## Setup: Create Phase Tasks

Before starting Phase 1, create all 6 tasks using TaskCreate:

```
TaskCreate:
  subject: "Detect existing Maximus configuration"
  description: "Check for .maximus/ directory and validate config quality"
  activeForm: "Detecting existing Maximus configuration"

TaskCreate:
  subject: "Analyze project structure"
  description: "Read CLAUDE.md, package files, and detect conventions"
  activeForm: "Analyzing project structure"

TaskCreate:
  subject: "Configure Maximus settings"
  description: "Generate tailored config.yml based on project analysis"
  activeForm: "Configuring Maximus settings"

TaskCreate:
  subject: "Clean example plan tasks"
  description: "Replace boilerplate plan.json with empty tasks array"
  activeForm: "Cleaning example plan tasks"

TaskCreate:
  subject: "Suggest available skills"
  description: "List installed skills for task configuration"
  activeForm: "Suggesting available skills"

TaskCreate:
  subject: "Handoff to planning"
  description: "Display next steps and guide to /maximus-plan"
  activeForm: "Preparing handoff documentation"
```

---

## Phase 1: Detect

**Mark task as in_progress:**
```
TaskUpdate: taskId "task-1", status "in_progress"
```

Check for existing Maximus setup:

1. **Directory check:** `ls -la .maximus/`
   - If missing: Note that 'maximus init' will be run in Phase 3
   - If exists: Continue to config validation

2. **Config validation:** Read `.maximus/config.yml` if it exists
   - Check for boilerplate project_name (e.g., "my-project", "example")
   - Check for default commit_prefix ("feat:", "chore:")
   - Check for generic context files
   - If boilerplate detected: Warn user and offer to regenerate with project-specific values

3. **Plan validation:** Read `.maximus/plan.json` if it exists
   - Check if tasks array contains example tasks (tasks with "Example" in description)
   - Note example tasks will be replaced in Phase 4

**Present findings:**
```
Maximus Setup Status:
  Directory: [EXISTS | MISSING]
  Config: [TAILORED | BOILERPLATE | MISSING]
  Plan: [N tasks (M examples) | MISSING]
```

**Mark task as completed:**
```
TaskUpdate: taskId "task-1", status "completed"
```

---

## Phase 2: Analyze

**Mark task as in_progress:**
```
TaskUpdate: taskId "task-2", status "in_progress"
```

Read project files to understand structure and conventions:

1. **Project identity:**
   - Read `package.json`, `Cargo.toml`, `go.mod`, or `pyproject.toml`
   - Extract project name from package file
   - Identify programming language and framework

2. **Project conventions:**
   - Read `CLAUDE.md` for project-specific instructions
   - Check `git log --oneline -10` for commit message patterns
   - Look for commit prefixes (e.g., "feat:", "fix:", "maximus:")
   - Note any testing conventions mentioned in CLAUDE.md

3. **Test runner detection:**
   - Check package.json scripts for test commands
   - Look for: `npm test`, `bun test`, `cargo test`, `go test`, `pytest`
   - Check for testing framework: jest, vitest, mocha, cargo-test, go-test, pytest
   - Extract test command pattern

4. **Directory structure:**
   - Run `ls -la` to see top-level directories
   - Identify source directories: `src/`, `lib/`, `pkg/`, `app/`
   - Identify test directories: `test/`, `tests/`, `__tests__/`

**Present analysis summary:**
```
Project Analysis:
  Name: [project-name]
  Language: [language + framework]
  Test runner: [test command]
  Commit style: [prefix pattern]
  Source: [directory]
```

**Mark task as completed:**
```
TaskUpdate: taskId "task-2", status "completed"
```

---

## Phase 3: Configure

**Mark task as in_progress:**
```
TaskUpdate: taskId "task-3", status "in_progress"
```

Generate tailored config.yml based on analysis:

1. **Run maximus init if needed:**
   - If `.maximus/` doesn't exist: `maximus init`
   - This creates the directory structure and default config

2. **Generate project-specific config:**
   - Use actual project name (not "my-project")
   - Set commit_prefix from git log analysis
   - Configure test runner based on detection
   - Set appropriate timeouts based on project size:
     - Small (<100 files): 600s (10 min)
     - Medium (100-500 files): 900s (15 min)
     - Large (500+ files): 1200s (20 min)
   - Configure model escalation (simple→haiku, medium→sonnet, complex→opus)

3. **Configuration template:**

```yaml
# Maximus Loop Configuration — [project-name]

project_name: "[actual-project-name]"
maximus_version: "1.0.0"

loop:
  mode: sequential
  max_iterations: 20
  auto_commit: true
  continue_on_error: false

agent:
  default_model: sonnet
  timeout: [calculated-timeout]
  max_retries: 2

  escalation:
    enabled: true
    simple: haiku
    medium: sonnet
    complex: opus

tasks:
  source: .maximus/plan.json
  auto_mark_done: true

context:
  files:
    - CLAUDE.md

progress:
  file: .maximus/progress.md
  format: markdown

git:
  enabled: true
  commit_prefix: "[detected-prefix]"
  auto_push: false
```

4. **Write config:** Save to `.maximus/config.yml`

**Present generated config:**
```
Generated Configuration:
  Project: [name]
  Timeout: [value]s
  Commit prefix: "[prefix]"
  Test command: [command]
  Model escalation: enabled
```

Ask: "Does this configuration look correct?"

Wait for user confirmation before proceeding.

**Mark task as completed:**
```
TaskUpdate: taskId "task-3", status "completed"
```

---

## Phase 4: Clean

**Mark task as in_progress:**
```
TaskUpdate: taskId "task-4", status "in_progress"
```

Replace example plan.json tasks with empty array:

1. **Read current plan:** `cat .maximus/plan.json`
2. **Preserve version field:** Extract `version` value
3. **Generate clean plan:**

```json
{
  "version": "1.0.0",
  "tasks": []
}
```

4. **Write clean plan:** Save to `.maximus/plan.json`

**Note:** This removes any example/boilerplate tasks. User will create their own task plan with `/maximus-plan`.

**Mark task as completed:**
```
TaskUpdate: taskId "task-4", status "completed"
```

---

## Phase 5: Suggest

**Mark task as in_progress:**
```
TaskUpdate: taskId "task-5", status "in_progress"
```

List installed skills available for task configuration:

1. **Check skill availability:**
   - Skills can be referenced in task `skills` property in plan.json
   - Skills provide specialized knowledge for complex tasks

2. **List installed skills:**
   - Read skill metadata from Claude Code's skill directory
   - Format as table with name and description

**Present suggestions:**
```
Available Skills for Tasks:
  - superpowers:test-driven-development
  - superpowers:systematic-debugging
  - frontend-design:frontend-design
  - [other installed skills]

These skills can be added to individual tasks in the plan
to provide specialized guidance during execution.
```

**Mark task as completed:**
```
TaskUpdate: taskId "task-5", status "completed"
```

---

## Phase 6: Handoff

**Mark task as in_progress:**
```
TaskUpdate: taskId "task-6", status "in_progress"
```

Display next steps and guide to /maximus-plan:

**Present completion message:**

```
✓ Maximus Loop is configured for [project-name]

Configuration saved to:
  .maximus/config.yml — Engine settings
  .maximus/plan.json — Empty task list (ready for planning)

Next Steps:
  1. Review config: cat .maximus/config.yml
  2. Commit setup:
     git add .maximus/
     git commit -m "[prefix] Initialize Maximus Loop"
  3. Create your first task plan:
     Run /maximus-plan to design tasks for your feature

Your project is configured. Run /maximus-plan to create your first task plan.
```

**Mark task as completed:**
```
TaskUpdate: taskId "task-6", status "completed"
```

---

## Best Practices

**Project-Specific Configuration:**
- Always read actual project files, never use generic defaults
- Extract project name from package.json/Cargo.toml/etc.
- Detect commit conventions from git history
- Configure test runner based on actual testing setup

**Timeout Calculation:**
- Consider project size and complexity
- Small projects: 10 min per task
- Medium projects: 15 min per task
- Large projects: 20 min per task
- Can be adjusted in config.yml after setup

**Model Escalation:**
- Always enable escalation for cost efficiency
- Simple tasks → haiku (~$0.32)
- Medium tasks → sonnet (~$2.27)
- Complex tasks → opus (~$5.00+)

**Configuration Validation:**
- Verify project_name is not boilerplate
- Verify commit_prefix matches git history
- Verify test command exists in project
- Verify timeout is appropriate for project size

---

## Red Flags

**Never:**
- Run 'maximus init' without analyzing the project first
- Use generic project names like "my-project" or "example"
- Set commit_prefix to generic values when project has specific conventions
- Skip reading CLAUDE.md for project-specific requirements
- Write config.yml without user approval
- Keep example tasks in plan.json after initialization
- Skip the handoff message that points to /maximus-plan

**If you catch yourself thinking** "this project looks standard, I'll use defaults":
STOP. Every project has unique conventions. Read the files.

---

## Reference Files

For additional context:
- **Task API patterns:** `${CLAUDE_PLUGIN_ROOT}/references/task-api.md`
- **Plan schema:** `${CLAUDE_PLUGIN_ROOT}/references/plan-schema.md`
