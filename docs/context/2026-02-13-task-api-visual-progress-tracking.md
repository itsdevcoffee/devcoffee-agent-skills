# Task API - Visual Progress Tracking in Claude Code

**Date:** 2026-02-13
**Purpose:** Technical reference for implementing visual task tracking with checkboxes, spinners, and progress indicators in Claude Code plugins and skills
**API Version:** January 2026 release

## Overview

The Task API enables Claude Code plugins and skills to create visual progress trackers that display in the terminal UI with real-time status updates, spinners, and checkbox indicators.

**Visual Example:**
```
✶ Writing design document… (2m 48s · ↑ 2.0k tokens)
  ⎿  ◼ Write design doc to docs/plans/
     ◻ Transition to implementation planning
     ✔ Explore project context for IAP implementation
     ✔ Ask clarifying questions about IAP requirements
     ✔ Propose 2-3 IAP implementation approaches
     ✔ Present design sections for user approval
```

## Core Concepts

### Visual Indicators

| Symbol | Status | Meaning |
|--------|--------|---------|
| `◼` | `in_progress` | Solid checkbox - actively being worked on |
| `◻` | `pending` | Empty checkbox - waiting to be started |
| `✔` | `completed` | Checkmark - finished work |
| `✶` | (spinner) | Displays `activeForm` text during tool execution |

### Status Lifecycle

```
pending → in_progress → completed
  ◻          ◼            ✔
```

Tasks can only move forward through this lifecycle. Once marked `completed`, a task is done.

## API Reference

### TaskCreate

Creates a new task and adds it to the task list.

**Parameters:**
- `subject` (required, string) - Brief, actionable title in **imperative form**
  - Good: "Build authentication module", "Fix syntax error", "Write tests"
  - Bad: "Building auth", "Auth module", "Tests"
- `description` (required, string) - Detailed description of what needs to be done
- `activeForm` (recommended, string) - **Present continuous form** shown in spinner
  - Good: "Building authentication module", "Fixing syntax error", "Writing tests"
  - Bad: "Build auth", "Auth built", "Test writing"
- `metadata` (optional, object) - Arbitrary key-value data attached to task

**Returns:** Task object with auto-generated `taskId`

**Example:**
```javascript
TaskCreate({
  subject: "Design authentication system",
  description: "Create design doc with JWT strategy, token refresh flow, and security considerations",
  activeForm: "Designing authentication system"
})
```

**Important:** All tasks are created with `status: pending` by default.

### TaskUpdate

Updates an existing task's properties or status.

**Parameters:**
- `taskId` (required, string) - ID of task to update
- `status` (optional, string) - New status: `pending`, `in_progress`, `completed`, or `deleted`
- `subject` (optional, string) - New subject (imperative form)
- `description` (optional, string) - New description
- `activeForm` (optional, string) - New activeForm (present continuous)
- `owner` (optional, string) - Assign task to agent/session (prevents duplicate work)
- `metadata` (optional, object) - Merge metadata keys (set to null to delete)
- `addBlocks` (optional, array) - Task IDs that this task blocks
- `addBlockedBy` (optional, array) - Task IDs that block this task

**Example:**
```javascript
// Mark task as in progress
TaskUpdate({
  taskId: "task-1",
  status: "in_progress"
})

// Mark task as completed
TaskUpdate({
  taskId: "task-1",
  status: "completed"
})

// Set up dependency
TaskUpdate({
  taskId: "task-2",
  addBlockedBy: ["task-1"]  // task-2 waits for task-1
})
```

### TaskList

Lists all tasks with summary information.

**No parameters required.**

**Returns:**
- `id` - Task identifier
- `subject` - Task title
- `status` - Current status
- `owner` - Assigned agent/session (empty if available)
- `blockedBy` - List of blocking task IDs

**Example:**
```javascript
TaskList()
// Returns summary of all tasks for progress overview
```

### TaskGet

Retrieves full details of a specific task.

**Parameters:**
- `taskId` (required, string) - ID of task to retrieve

**Returns:** Complete task object with all fields including description, metadata, dependencies

**Example:**
```javascript
TaskGet({ taskId: "task-1" })
// Returns full task details for understanding context before starting work
```

## Implementation Patterns

### Pattern 1: Basic Task Workflow

```markdown
# In your agent/skill

## Phase 1: Planning

Create task:
TaskCreate:
  subject: "Write feature specification"
  description: "Document requirements, constraints, and acceptance criteria"
  activeForm: "Writing feature specification"

Start work:
TaskUpdate:
  taskId: "task-1"
  status: "in_progress"

[do the work]

Complete:
TaskUpdate:
  taskId: "task-1"
  status: "completed"
```

### Pattern 2: Multi-Phase with Dependencies

```markdown
# Create all tasks upfront with dependencies

TaskCreate:
  subject: "Design architecture"
  description: "Create high-level design and document decisions"
  activeForm: "Designing architecture"

TaskCreate:
  subject: "Implement core logic"
  description: "Write main implementation following design"
  activeForm: "Implementing core logic"
  addBlockedBy: ["task-1"]  # Waits for design

TaskCreate:
  subject: "Write tests"
  description: "Create test suite covering all scenarios"
  activeForm: "Writing tests"
  addBlockedBy: ["task-2"]  # Waits for implementation

# Then work through them sequentially
TaskUpdate: taskId "task-1", status "in_progress"
[work...]
TaskUpdate: taskId "task-1", status "completed"  # Unblocks task-2

TaskUpdate: taskId "task-2", status "in_progress"
[work...]
TaskUpdate: taskId "task-2", status "completed"  # Unblocks task-3

TaskUpdate: taskId "task-3", status "in_progress"
[work...]
TaskUpdate: taskId "task-3", status "completed"
```

### Pattern 3: Agent Team Coordination

```markdown
# Agent 1 creates task list
TaskCreate:
  subject: "Research API options"
  description: "Compare REST, GraphQL, and gRPC for our use case"
  activeForm: "Researching API options"

TaskCreate:
  subject: "Implement chosen API"
  description: "Build API layer based on research findings"
  activeForm: "Implementing API"
  addBlockedBy: ["task-1"]

# Agent 1 claims and completes research
TaskUpdate: taskId "task-1", owner "researcher-agent", status "in_progress"
[research work...]
TaskUpdate: taskId "task-1", status "completed"

# Agent 2 sees task-2 is now unblocked, claims it
TaskUpdate: taskId "task-2", owner "builder-agent", status "in_progress"
[implementation work...]
TaskUpdate: taskId "task-2", status "completed"
```

### Pattern 4: Dynamic Task Creation

```markdown
# Don't know all tasks upfront? Create them as you discover work

# Initial task
TaskCreate:
  subject: "Analyze codebase"
  description: "Understand current architecture"
  activeForm: "Analyzing codebase"

TaskUpdate: taskId "task-1", status "in_progress"
[analysis reveals 3 components need updates...]

# Dynamically create tasks based on findings
TaskCreate:
  subject: "Update component A"
  description: "Refactor to new pattern"
  activeForm: "Updating component A"

TaskCreate:
  subject: "Update component B"
  description: "Refactor to new pattern"
  activeForm: "Updating component B"

TaskCreate:
  subject: "Update component C"
  description: "Refactor to new pattern"
  activeForm: "Updating component C"

TaskUpdate: taskId "task-1", status "completed"
```

## Best Practices

### 1. Subject vs ActiveForm

**Subject:** Imperative form (command)
- "Write tests"
- "Implement authentication"
- "Fix memory leak"

**ActiveForm:** Present continuous (status update)
- "Writing tests"
- "Implementing authentication"
- "Fixing memory leak"

### 2. Task Granularity

**Too small (avoid):**
- "Add import statement"
- "Fix typo in variable name"
- "Save file"

**Good granularity:**
- "Implement user registration flow"
- "Refactor database layer"
- "Write integration tests"

**Too large (split into subtasks):**
- "Build entire application"
- "Complete phase 1 through 4"

### 3. Dependency Management

- Use `blockedBy` to chain sequential work
- Don't create circular dependencies
- Group independent tasks separately from dependent ones
- Tasks automatically unblock when prerequisites complete

### 4. Status Updates

**When to mark `in_progress`:**
- Immediately before starting work on a task
- Use to signal to other agents/sessions that work is claimed

**When to mark `completed`:**
- Only when task is FULLY done
- Tests passing (if applicable)
- No unresolved errors or blockers

**When to use `deleted`:**
- Task is no longer relevant
- Work was superseded by different approach
- Permanently removes task from list

### 5. Multi-Session Coordination

Share task lists across sessions:

```bash
# Terminal 1
export CLAUDE_CODE_TASK_LIST_ID=my-project
claude

# Terminal 2 (shares same task list)
export CLAUDE_CODE_TASK_LIST_ID=my-project
claude
```

Tasks stored in: `~/.claude/tasks/{CLAUDE_CODE_TASK_LIST_ID}/`

## Keyboard Shortcuts

- `Ctrl+T` - Toggle task list visibility
- `Ctrl+B` - Background running tasks
- `/tasks` - List and manage background tasks

## Integration with Existing Agents

### Adding to Buzzminson Agent

```markdown
## Phase 1: Clarification

Create phase tasks:
TaskCreate:
  subject: "Gather requirements"
  description: "Ask clarifying questions and document user needs"
  activeForm: "Gathering requirements"

TaskCreate:
  subject: "Document feature specification"
  description: "Create tracking document with requirements and approach"
  activeForm: "Documenting feature specification"
  addBlockedBy: ["task-1"]

Start phase:
TaskUpdate: taskId "task-1", status "in_progress"
[ask questions, analyze...]
TaskUpdate: taskId "task-1", status "completed"

TaskUpdate: taskId "task-2", status "in_progress"
[write tracking doc...]
TaskUpdate: taskId "task-2", status "completed"
```

### Adding to Maximus Agent

```markdown
## Code Review Workflow

Create review tasks:
TaskCreate:
  subject: "Run code-reviewer analysis"
  description: "Identify bugs, security issues, and code quality problems"
  activeForm: "Running code-reviewer analysis"

TaskCreate:
  subject: "Run code-simplifier analysis"
  description: "Find refactoring opportunities and complexity issues"
  activeForm: "Running code-simplifier analysis"

TaskCreate:
  subject: "Generate review summary"
  description: "Compile findings and create actionable report"
  activeForm: "Generating review summary"
  addBlockedBy: ["task-1", "task-2"]

# Execute review
[work through tasks sequentially...]
```

## Common Patterns

### Pattern: Checkpoint-Based Progress

```markdown
# Large task with checkpoints

TaskCreate:
  subject: "Migrate database schema"
  description: "Update all tables to new schema version"
  activeForm: "Migrating database schema"
  metadata:
    checkpoints: ["backup", "migrate-users", "migrate-posts", "verify", "cleanup"]
    current_checkpoint: "backup"

# Update metadata as you progress
TaskUpdate:
  taskId: "task-1"
  metadata:
    current_checkpoint: "migrate-users"
```

### Pattern: Parallel Work

```markdown
# Create independent tasks that can run in parallel

TaskCreate: subject "Build frontend", activeForm "Building frontend"
TaskCreate: subject "Build backend", activeForm "Building backend"
TaskCreate: subject "Write documentation", activeForm "Writing documentation"

# No blockedBy - all three can work simultaneously
# Different agents/sessions can claim different tasks
```

### Pattern: Conditional Task Creation

```markdown
# Create tasks based on runtime conditions

TaskCreate:
  subject: "Analyze test results"
  description: "Run test suite and analyze failures"
  activeForm: "Analyzing test results"

TaskUpdate: taskId "task-1", status "in_progress"
[run tests...]

# If tests fail, create fix tasks
if (tests_failed):
  for each failure:
    TaskCreate:
      subject: f"Fix {failure.test_name}"
      description: f"Fix failing test: {failure.message}"
      activeForm: f"Fixing {failure.test_name}"

TaskUpdate: taskId "task-1", status "completed"
```

## Error Handling

### Handling Task Failures

```markdown
# If work on a task fails, don't mark it completed

TaskUpdate: taskId "task-1", status "in_progress"

try:
  [attempt work...]
  if (encountered_blocker):
    # Create new task for blocker
    TaskCreate:
      subject: "Resolve dependency issue"
      description: "Fix npm package conflict blocking feature implementation"
      activeForm: "Resolving dependency issue"

    # Update original task to wait for blocker resolution
    TaskUpdate:
      taskId: "task-1"
      addBlockedBy: ["task-2"]
      status: "pending"  # Back to pending until blocker resolved
  else:
    TaskUpdate: taskId "task-1", status "completed"
```

### Recovering from Errors

```markdown
# If an error occurs mid-task, preserve state

TaskUpdate: taskId "task-1", status "in_progress"
[work...]
[error occurs]

# Document error in metadata
TaskUpdate:
  taskId: "task-1"
  metadata:
    error: "API rate limit exceeded"
    retry_after: "2026-02-13T15:30:00Z"
    progress: "completed 3 of 5 API calls"

# Keep status as in_progress or set to pending
# User/agent can resume later with context preserved
```

## Storage and Persistence

Tasks are stored in JSON format at:
```
~/.claude/tasks/{TASK_LIST_ID}/tasks.json
```

**Task file structure:**
```json
{
  "version": "1.0.0",
  "tasks": [
    {
      "id": "task-1",
      "subject": "Implement authentication",
      "description": "Build JWT-based auth system",
      "activeForm": "Implementing authentication",
      "status": "in_progress",
      "owner": "builder-agent",
      "blockedBy": [],
      "blocks": ["task-2", "task-3"],
      "metadata": {
        "created": "2026-02-13T14:00:00Z",
        "updated": "2026-02-13T14:30:00Z"
      }
    }
  ]
}
```

## References

- [Interactive mode - Claude Code Docs](https://code.claude.com/docs/en/interactive-mode)
- [Orchestrate teams of Claude Code sessions - Claude Code Docs](https://code.claude.com/docs/en/agent-teams)
- [Agent SDK overview - Claude API Docs](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Claude Code Tasks: Complete Guide](https://www.dplooy.com/blog/claude-code-tasks-complete-guide-to-ai-agent-workflow)

## Changelog

### 2026-02-13
- Initial documentation created
- Comprehensive API reference
- Implementation patterns and best practices
- Integration examples for Buzzminson and Maximus agents

---

**Document Version:** 1.0
**Last Updated:** 2026-02-13
**Maintainer:** Dev Coffee Team
