# Run Summary Schema Reference

Documentation of TaskSummaryEntry fields from `.maximus/run-summary.json` produced by the Maximus Loop engine.

## File Location

```
.maximus/run-summary.json
```

The engine writes this file after each task execution with a complete summary of task outcomes, costs, and performance metrics.

## Schema Structure

```json
{
  "version": "1.0.0",
  "summary": [
    {
      "taskId": "1",
      "phase": 1,
      "feature": "Add Task API reference doc",
      "model": "haiku",
      "costUsd": 0.32,
      "durationMs": 120000,
      "numTurns": 4,
      "outcome": "completed",
      "timestamp": "2026-02-14T03:30:00Z",
      "errorMessage": null
    }
  ]
}
```

## TaskSummaryEntry Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `taskId` | string | Yes | Task identifier from plan.json (e.g., "1", "2", "3") |
| `phase` | number | Yes | Phase number from plan.json (1-based integer) |
| `feature` | string | Yes | Feature title from plan.json, 2-8 words |
| `model` | string | Yes | Model used: `haiku`, `sonnet`, or `opus` |
| `costUsd` | number | Yes | Total API cost in USD (rounded to 2 decimals) |
| `durationMs` | number | Yes | Task execution time in milliseconds |
| `numTurns` | number | Yes | Number of Claude API calls (turns) during execution |
| `outcome` | string | Yes | Result status: `completed`, `blocked`, `timeout`, `failed`, `skipped` |
| `timestamp` | string | Yes | ISO 8601 UTC timestamp when task finished |
| `errorMessage` | string \| null | Yes | Error details if outcome is not `completed`, null otherwise |

## Field Details

### `taskId`

- Matches `id` field in plan.json
- Used to correlate run-summary entries with plan tasks
- Always a string ("1", not 1)

### `phase`

- Matches `phase` field in plan.json
- Enables grouping by logical milestone
- Example: Group all phase 1 tasks to review first phase costs

### `feature`

- Copied from plan.json `feature` field for reference
- Short title (2-8 words)
- Example: "Add Task API reference doc"

### `model`

Possible values:
- `haiku` - For simple tasks (complexity_level: simple)
- `sonnet` - For medium tasks (complexity_level: medium)
- `opus` - For complex tasks (complexity_level: complex)

### `costUsd`

- Sum of input tokens + output tokens at model pricing rates
- Includes API overhead but not infrastructure costs
- Example: 0.32 = 32 cents

**Pricing (as of 2026-02):**
- Haiku: Input $0.80/M tokens, Output $4.00/M tokens
- Sonnet: Input $3.00/M tokens, Output $15.00/M tokens
- Opus: Input $15.00/M tokens, Output $75.00/M tokens

### `durationMs`

- Elapsed wall-clock time from task start to completion
- Includes all API calls, tool execution, and parsing
- Used to detect timeouts (900,000ms = 15 minutes)

### `numTurns`

- Count of API calls (Claude messages) during task execution
- Higher turns = more complex problem solving
- Example: 4 turns = 4 API calls

### `outcome`

Status values:

| Outcome | Meaning | Next Step |
|---------|---------|-----------|
| `completed` | Task finished successfully | Mark task `passes: true` in plan |
| `blocked` | External dependency or user intervention needed | Review blockers, unblock if possible |
| `timeout` | Exceeded 15-minute limit (900,000ms) | Task too complex, split into smaller tasks |
| `failed` | Task failed with error | Review errorMessage, may need retry |
| `skipped` | Task was skipped (e.g., dependency failed) | Address prerequisite task |

### `timestamp`

- ISO 8601 format: `2026-02-14T03:30:00Z`
- UTC timezone always
- Enables time-series analysis and performance trends

### `errorMessage`

- null for `completed` outcome
- String describing error for other outcomes
- Examples:
  - "Task timed out after 900 seconds"
  - "API rate limit exceeded"
  - "File not found: src/index.ts"
  - "Dependency task #2 is blocked"

## Usage Examples

### Analyzing Cost by Phase

```javascript
const summary = JSON.parse(fs.readFileSync('.maximus/run-summary.json'));

// Group by phase
const costByPhase = {};
summary.summary.forEach(entry => {
  costByPhase[entry.phase] = (costByPhase[entry.phase] || 0) + entry.costUsd;
});

console.log(costByPhase);
// { 1: 5.23, 2: 8.47, 3: 2.15 }
```

### Finding Failed Tasks

```javascript
const failed = summary.summary.filter(e => e.outcome !== 'completed');

failed.forEach(task => {
  console.log(`Task #${task.taskId}: ${task.feature}`);
  console.log(`  Error: ${task.errorMessage}`);
  console.log(`  Cost: $${task.costUsd}, Duration: ${task.durationMs}ms`);
});
```

### Calculating Performance Metrics

```javascript
// Average cost per task
const avgCost = summary.summary.reduce((sum, t) => sum + t.costUsd, 0) / summary.summary.length;

// Average duration
const avgDuration = summary.summary.reduce((sum, t) => sum + t.durationMs, 0) / summary.summary.length;

// Success rate
const successRate = summary.summary.filter(t => t.outcome === 'completed').length / summary.summary.length;

console.log(`Avg cost: $${avgCost.toFixed(2)}`);
console.log(`Avg duration: ${(avgDuration / 1000).toFixed(1)}s`);
console.log(`Success rate: ${(successRate * 100).toFixed(1)}%`);
```

### Identifying Expensive Tasks

```javascript
const expensive = summary.summary
  .sort((a, b) => b.costUsd - a.costUsd)
  .slice(0, 5);

console.log('Top 5 most expensive tasks:');
expensive.forEach((t, i) => {
  console.log(`${i + 1}. Task #${t.taskId} ($${t.costUsd}): ${t.feature}`);
});
```

## Common Queries

### When would outcome be "blocked"?

When a task can't proceed due to:
- Previous task failed and this task depends on it
- User intervention required (e.g., approval, decision)
- External service unavailable

### Why might a task timeout?

- Task is too complex, needs splitting
- Recursive problem-solving loops
- Tool failures causing retries
- Missing context about project structure

### How to interpret numTurns?

- 1-3 turns: Simple, straightforward task
- 4-8 turns: Moderate complexity, some problem-solving
- 9+: Complex task, heavy iteration, consider splitting

## Relationship to plan.json

| Field | From plan.json | Used for | In run-summary |
|-------|----------------|----------|---|
| `taskId` | `id` | Cross-reference | Yes, as string |
| `phase` | `phase` | Grouping, validation | Yes |
| `feature` | `feature` | Display, reference | Yes |
| Model | `complexity_level` | Selection | Yes, as model name |
| Cost | (calculated) | Analysis | Yes, costUsd |
| Duration | (measured) | Performance | Yes, durationMs |
| Outcome | (actual result) | Status | Yes |

## Schema Evolution

**Version 1.0.0:**
- Initial release with 10 core fields
- Supports all model types (haiku, sonnet, opus)
- Outcome types: completed, blocked, timeout, failed, skipped

## Example Entry

```json
{
  "taskId": "3",
  "phase": 2,
  "feature": "Implement registration endpoint",
  "model": "sonnet",
  "costUsd": 2.47,
  "durationMs": 285000,
  "numTurns": 6,
  "outcome": "completed",
  "timestamp": "2026-02-14T04:15:30Z",
  "errorMessage": null
}
```

---

**Version:** 1.0
**Last Updated:** 2026-02-13
