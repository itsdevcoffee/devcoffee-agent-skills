---
name: maximus-review
description: This skill should be used when the user wants to review Maximus Loop results, analyze run performance, or check execution status. Triggers on "review the run", "analyze maximus results", "check status", "how is the run going", "show me the summary", "what's the progress", "/maximus-review", or when the user wants post-execution analysis with cost/performance insights.
---

# Maximus Review Analyzer

Post-run analysis and intelligent status checking for Maximus Loop executions. Provides two modes: full review (default) for comprehensive analysis, and quick status (--quick flag) for fast progress checks.

**Announce:** "I'll analyze the Maximus Loop execution for you."

## Supporting Documentation

Load these reference files as needed:
- **Run Summary Schema:** `${CLAUDE_PLUGIN_ROOT}/references/run-summary-schema.md` — Task outcome, cost, and performance field reference
- **Cost Estimation:** `${CLAUDE_PLUGIN_ROOT}/references/cost-estimation.md` — Cost benchmarks and optimization analysis
- **Task API:** `${CLAUDE_PLUGIN_ROOT}/references/task-api.md` — Visual progress tracking with TaskCreate/TaskUpdate

---

## Operating Modes

### Full Review Mode (Default)

Use when: User wants comprehensive analysis of completed or in-progress runs.

Triggers: "review the run", "analyze results", "/maximus-review"

Process: Complete 6-phase analysis with visual progress tracking.

### Quick Status Mode (--quick)

Use when: User wants fast progress check without deep analysis.

Triggers: "check status", "how is it going", "quick status", "--quick flag"

Process: Read-only snapshot with concise terminal output.

---

## Full Review Mode: 6-Phase Analysis

Create all phase tasks upfront with Task API, then execute sequentially.

### Phase 1: Read Progress

**Create Task:**
```
TaskCreate:
  subject: "Read progress metadata"
  description: "Parse .maximus/progress.md frontmatter and iteration history"
  activeForm: "Reading progress metadata"
```

**Actions:**
1. Read `.maximus/progress.md`
2. Parse YAML frontmatter: `current_iteration`, `total_tasks`, `completed_tasks`, `status`
3. Extract latest iteration entry for current state
4. Note any blockers or errors in recent iterations

**Mark completed:** `TaskUpdate: taskId "task-1", status "completed"`

---

### Phase 2: Read Run Summary

**Create Task:**
```
TaskCreate:
  subject: "Load run summary data"
  description: "Parse .maximus/run-summary.json for per-task outcomes and costs"
  activeForm: "Loading run summary data"
```

**Actions:**
1. Read `.maximus/run-summary.json`
2. Parse TaskSummaryEntry fields: `taskId`, `phase`, `feature`, `model`, `costUsd`, `durationMs`, `numTurns`, `outcome`, `timestamp`, `errorMessage`
3. Load reference: `${CLAUDE_PLUGIN_ROOT}/references/run-summary-schema.md` for field definitions
4. Build in-memory summary of outcomes: completed, failed, blocked, timeout, skipped

**Mark completed:** `TaskUpdate: taskId "task-2", status "completed"`

---

### Phase 3: Analyze Patterns

**Create Task:**
```
TaskCreate:
  subject: "Identify failure patterns and anomalies"
  description: "Detect failures, retries, timeouts, cost outliers, complexity mismatches"
  activeForm: "Analyzing patterns and anomalies"
```

**Actions:**
1. **Failure analysis:**
   - Count by `outcome`: completed, failed, blocked, timeout
   - Identify tasks with `errorMessage` and group by error type
   - Detect retry patterns (same feature name, multiple attempts)

2. **Cost analysis:**
   - Load reference: `${CLAUDE_PLUGIN_ROOT}/references/cost-estimation.md` for benchmarks
   - Calculate cost per complexity level, compare to expected:
     - Simple (haiku): Expected ~$0.32, flag if >$0.50
     - Medium (sonnet): Expected ~$2.27, flag if >$3.50
     - Complex (opus): Expected ~$5.00, flag if >$8.00
   - Identify top 5 most expensive tasks

3. **Complexity mismatch detection:**
   - Haiku tasks with >5 files changed → should be medium
   - Haiku tasks with `numTurns` >8 → likely too complex
   - Timeout tasks (durationMs = 900,000ms) → should be split

4. **Performance patterns:**
   - Average `durationMs` per complexity level
   - Outlier detection: tasks >2x average duration for their complexity
   - High turn count (numTurns >15) indicates task complexity underestimation

**Mark completed:** `TaskUpdate: taskId "task-3", status "completed"`

---

### Phase 4: Review Code (Optional)

**Create Task:**
```
TaskCreate:
  subject: "Review code changes"
  description: "Optionally check files changed during the run via git diff"
  activeForm: "Reviewing code changes"
```

**Actions:**
1. Ask user: "Would you like me to review the code changes made during this run?"
2. If yes:
   - Run `git diff <starting-commit>..HEAD --stat` to see changed files
   - For critical files, run `git diff <starting-commit>..HEAD <file-path>` to see changes
   - Check for common issues: missing tests, hardcoded values, security concerns
3. If no: Skip to Phase 5

**Mark completed:** `TaskUpdate: taskId "task-4", status "completed"`

---

### Phase 5: Generate Report

**Create Task:**
```
TaskCreate:
  subject: "Generate structured findings report"
  description: "Create report with severity levels and actionable insights"
  activeForm: "Generating findings report"
```

**Report Structure:**

```markdown
# Maximus Loop Run Review

## Summary
- Total Tasks: X
- Completed: X (Y%)
- Failed: X
- Blocked: X
- Timeout: X
- Total Cost: $X.XX
- Total Duration: Xm Ys
- Success Rate: Y%

## Cost Breakdown
| Complexity | Count | Total Cost | Avg Cost | Expected Avg |
|-----------|-------|------------|----------|--------------|
| Simple    | X     | $X.XX      | $X.XX    | $0.32        |
| Medium    | X     | $X.XX      | $X.XX    | $2.27        |
| Complex   | X     | $X.XX      | $X.XX    | $5.00        |

## Issues

### 🔴 Critical
- [List critical issues: timeouts, repeated failures, major cost overruns]

### 🟡 Warning
- [List warnings: minor cost outliers, complexity mismatches, high turn counts]

### 🔵 Info
- [List informational findings: performance trends, optimization opportunities]

## Top 5 Most Expensive Tasks
1. Task #X ($X.XX): [feature] — [reason if outlier]
2. ...

## Failed Tasks Detail
[For each failed task, show: taskId, feature, error message, cost wasted]

## Recommendations
- [Actionable suggestions based on patterns]
- [Complexity level adjustments for future runs]
- [Task splitting recommendations for timeouts]
```

**Severity Levels:**
- **Critical (🔴):** Blocking issues that prevent completion
  - Timeouts (durationMs = 900,000ms)
  - Repeated failures on same task (>2 attempts)
  - Cost >3x expected for complexity level
- **Warning (🟡):** Issues that reduce efficiency
  - Cost >1.5x expected
  - High turn counts (numTurns >10 for simple, >15 for medium)
  - Complexity mismatches (haiku failing multi-file)
- **Info (🔵):** Optimization opportunities
  - Tasks that could be simpler complexity
  - Performance trends worth noting

**Mark completed:** `TaskUpdate: taskId "task-5", status "completed"`

---

### Phase 6: Propose Follow-up

**Create Task:**
```
TaskCreate:
  subject: "Propose follow-up actions"
  description: "Suggest plan extensions or task fixes with user approval"
  activeForm: "Proposing follow-up actions"
```

**Actions:**
1. Based on findings, propose:
   - Retry failed tasks with complexity adjustments
   - Split timeout tasks into smaller subtasks
   - Extend plan with missing test coverage
   - Add documentation tasks for undocumented features

2. Present as actionable commands:
   ```
   Suggested next steps:

   1. Retry Task #X with medium complexity:
      maximus retry 5 --complexity medium

   2. Split Task #Y (timeout) into 3 subtasks:
      Use /maximus-plan to add:
        - Task A: [specific subtask]
        - Task B: [specific subtask]
        - Task C: [specific subtask]

   3. Extend plan with test coverage:
      Use /maximus-plan to add Phase N+1 testing tasks
   ```

3. Ask: "Would you like me to help implement any of these suggestions?"

4. If user approves, use `/maximus-plan` skill to extend the plan

**Mark completed:** `TaskUpdate: taskId "task-6", status "completed"`

---

## Quick Status Mode

When user triggers with "--quick" flag or status phrases ("check status", "how is it going"):

**Process (No Task API):**

1. **Read Progress:**
   - Parse `.maximus/progress.md` frontmatter only
   - Get: `current_iteration`, `total_tasks`, `completed_tasks`, `status`

2. **Read Run Summary:**
   - Parse `.maximus/run-summary.json`
   - Count outcomes, sum costs, calculate duration

3. **Calculate Metrics:**
   - Completion percentage: `(completed_tasks / total_tasks) * 100`
   - Total cost so far: sum of all `costUsd`
   - Average task duration: sum(`durationMs`) / count
   - ETA: `(total_tasks - completed_tasks) * avg_duration`
   - Warnings: count of failed, blocked, timeout outcomes

4. **Output Concise Summary:**
   ```
   Maximus Loop Status

   Progress: 7/10 tasks (70%)
   Cost: $12.45 (Est. total: ~$17.50)
   ETA: ~8 minutes remaining

   Status: ✓ Running smoothly

   Warnings:
   - 1 task timed out (Task #5)
   - 1 task blocked (Task #8)

   Use '/maximus-review' for full analysis.
   ```

**No follow-up actions** — this mode is read-only and concise.

---

## Task API Integration

### Full Review Setup (Before Phase 1)

Create all 6 phase tasks upfront:

```
Announce: "Running 6-phase analysis: Progress → Summary → Patterns → Code Review → Report → Follow-up"

TaskCreate:
  subject: "Read progress metadata"
  description: "Parse .maximus/progress.md frontmatter and iteration history"
  activeForm: "Reading progress metadata"

TaskCreate:
  subject: "Load run summary data"
  description: "Parse .maximus/run-summary.json for per-task outcomes"
  activeForm: "Loading run summary data"

TaskCreate:
  subject: "Identify failure patterns"
  description: "Detect failures, retries, timeouts, cost outliers"
  activeForm: "Analyzing patterns and anomalies"

TaskCreate:
  subject: "Review code changes"
  description: "Optionally check files changed via git diff"
  activeForm: "Reviewing code changes"

TaskCreate:
  subject: "Generate findings report"
  description: "Create structured report with severity levels"
  activeForm: "Generating findings report"

TaskCreate:
  subject: "Propose follow-up actions"
  description: "Suggest plan extensions or task fixes"
  activeForm: "Proposing follow-up actions"
```

### Execution Pattern

For each phase:
1. `TaskUpdate: taskId "task-N", status "in_progress"`
2. Execute phase work
3. `TaskUpdate: taskId "task-N", status "completed"`
4. Move to next phase

### Quick Status Mode (No Task API)

Quick mode skips Task API entirely — no TaskCreate or TaskUpdate calls. Just read files, calculate metrics, and output concise summary.

---

## Reference File Usage

### When to Load References

- **run-summary-schema.md:** Load during Phase 2 (Read Run Summary) to understand TaskSummaryEntry fields
- **cost-estimation.md:** Load during Phase 3 (Analyze Patterns) for cost benchmarks and complexity expectations
- **task-api.md:** Reference during setup for Task API usage patterns (already loaded in this skill)

### How to Reference

Use `${CLAUDE_PLUGIN_ROOT}/references/` path prefix:
```
Read: ${CLAUDE_PLUGIN_ROOT}/references/run-summary-schema.md
```

---

## Best Practices

**Do:**
- Create all 6 tasks upfront in Full Review mode
- Mark tasks `in_progress` immediately before starting
- Mark tasks `completed` immediately after finishing
- Use Quick Status for fast checks without deep analysis
- Load cost-estimation.md to validate expected vs actual costs
- Provide actionable recommendations, not just observations

**Don't:**
- Skip Task API in Full Review mode
- Create tasks incrementally (create all upfront)
- Batch multiple phase completions (mark each immediately)
- Modify `.maximus/plan.json` or `.maximus/progress.md` (engine-managed)
- Generate reports in Quick Status mode (concise terminal output only)

---

## Common Use Cases

### "How's my run going?"
→ Use Quick Status mode (phases 1-3 only, concise output)

### "Review the completed run"
→ Use Full Review mode (all 6 phases, detailed report)

### "What went wrong?"
→ Use Full Review mode, focus on Phase 3 (patterns) and Phase 5 (report)

### "Should I retry failed tasks?"
→ Use Full Review mode through Phase 6 (propose follow-up)

### "How much did this cost?"
→ Use Quick Status for fast answer, or Full Review Phase 5 for detailed breakdown

---

## Error Handling

**If `.maximus/progress.md` is missing:**
- Inform user: "No progress file found. Has the engine run yet?"
- Suggest: "Use '/maximus-plan' to create a plan first."

**If `.maximus/run-summary.json` is missing:**
- Inform user: "No run summary found. The engine may not have started yet."
- Can still read progress.md for basic status

**If run is currently active:**
- Check `.maximus/.heartbeat` timestamp
- If <30 seconds old: "Engine is currently running. Status may be incomplete."
- Proceed with available data, note incompleteness

---

## Example Workflows

### Full Review After Completion

1. User: "Review the run results"
2. Create 6 phase tasks
3. Execute phases 1-6 sequentially
4. Generate detailed report
5. Propose follow-up actions
6. Ask if user wants help implementing suggestions

### Quick Status During Execution

1. User: "Check status"
2. Read progress.md (current state)
3. Read run-summary.json (completed tasks)
4. Calculate completion %, cost, ETA
5. Output concise 5-line summary
6. Done (no follow-up)

### Cost Analysis Focus

1. User: "Why was this so expensive?"
2. Create 6 phase tasks
3. Execute Phase 1-3 (focus on Phase 3 cost analysis)
4. Load cost-estimation.md for benchmarks
5. In Phase 5 report, highlight cost outliers with explanations
6. In Phase 6, suggest complexity adjustments for future runs

---

**Version:** 1.0
**Last Updated:** 2026-02-13
