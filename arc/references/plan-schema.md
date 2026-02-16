# plan.json Schema Reference

## Top-Level Structure

```json
{
  "version": "1.0.0",
  "tasks": [Task, ...]
}
```

- `version` (string, optional) — Schema version. Recommended: `"1.0.0"`
- `tasks` (array, required) — Ordered array of Task objects

## Task Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | Yes | Unique sequential integer starting at 1 |
| `phase` | number | Yes | Logical grouping (1-based, contiguous) |
| `category` | string | Yes | Type of work: `api`, `database`, `ui`, `testing`, `refactor`, `documentation`, `feature`, `bugfix`, `server-fix`, `config` |
| `feature` | string | Yes | Short title (2-8 words) |
| `description` | string | Yes | 2-3 sentences explaining the work, specific enough for an agent with zero project context |
| `acceptance_criteria` | string[] | Yes | 4-7 specific, verifiable conditions (non-empty array) |
| `passes` | boolean | Yes | Always set to `false` for new tasks. Engine sets to `true` on completion |
| `file` | string | Recommended | Primary file being changed (relative path from project root) |
| `complexity_level` | `"simple"` \| `"medium"` \| `"complex"` | Recommended | Controls which AI model runs the task |
| `testing_steps` | string[] | Recommended | Shell commands or manual checks to verify the work |

## Field Details

### `id`
- Must be unique across all tasks
- Sequential with no gaps (1, 2, 3... not 1, 3, 5)
- When extending an existing plan, start from `max(existingIds) + 1`

### `phase`
- Represents logical milestones, not arbitrary groupings
- Must be contiguous (1, 2, 3... not 1, 3, 5)
- Good boundaries: foundation → core features → integration → testing
- Maximum 8 tasks per phase recommended

### `complexity_level`
Controls model selection and directly impacts cost:

| Level | Model | Avg Cost | Avg Duration | Use When |
|-------|-------|----------|-------------|----------|
| `simple` | haiku | ~$0.32 | ~110s | Single file, <100 LOC, existing patterns to copy |
| `medium` | sonnet | ~$2.27 | ~310s | 2-5 files, moderate logic, 100-300 LOC |
| `complex` | opus | ~$5.00+ | ~500s+ | >5 files, external APIs, architectural changes |

**CRITICAL: Multi-file tasks are ALWAYS `medium` minimum.** Haiku consistently fails on tasks requiring changes across multiple files.

### `acceptance_criteria`
- Must be specific and verifiable (not "works correctly" or "is clean")
- Include: happy path, error cases, edge cases
- Reference actual file paths, commands, and expected outputs
- 4-7 criteria per task recommended

### `testing_steps`
- Runnable shell commands preferred
- Include both automated tests and manual verification
- Use project-specific commands (e.g., `bun test`, `npm test`, `cargo test`)

## Engine Behavior

The engine processes tasks sequentially via `Array.find(task => task.passes === false)`:
- No explicit dependency system — task ordering in the array IS the dependency order
- Tasks within the same phase run sequentially
- The engine validates only `id` (must be number) and `passes` (must be boolean or "blocked")
- All other validation is the responsibility of the plan generator

## Example Task

```json
{
  "id": 4,
  "phase": 2,
  "category": "api",
  "feature": "Implement registration endpoint",
  "description": "Create POST /auth/register endpoint that validates email format, checks for duplicate emails, hashes passwords with bcrypt, creates user record, and returns JWT token.",
  "acceptance_criteria": [
    "POST /auth/register with valid email/password returns 201 with JWT token",
    "Duplicate email returns 409 Conflict with error message",
    "Missing email or password returns 400 Bad Request",
    "Password is hashed with bcrypt (cost factor 10) before storing",
    "Integration test in server/tests/auth/register.test.ts passes all cases"
  ],
  "passes": false,
  "file": "server/routes/auth.ts",
  "complexity_level": "medium",
  "testing_steps": [
    "cd server && bun test tests/auth/register.test.ts",
    "curl -X POST http://localhost:3000/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"secure123\"}'"
  ]
}
```
