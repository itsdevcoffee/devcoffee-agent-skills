# Architecture Violations Analysis

This document compares the scaffolded `test-plugin` against the Claude Plugin Architecture rules from `docs/reference/claude-plugin-architecture.md`.

## Quick Reference: What I Created vs What's Correct

| Aspect | What I Did | What's Correct | Severity |
|--------|------------|----------------|----------|
| Skill frontmatter | 9 fields (name, description, version, framework, status, tools, tags) | 2 fields (name, description) | ❌ HIGH |
| Command frontmatter | `name`, `description`, `argument-hint` | `description`, `argument-hint`, `disable-model-invocation: true` (NO `name`) | ❌ CRITICAL |
| Command file size | 62 lines with docs | ~8 lines (thin wrapper) | ❌ HIGH |
| Skill description | Workflow summary + usage examples | Triggers only ("Use when...") | ❌ HIGH |
| Commands directory | ✅ Created | ✅ Required | ✅ CORRECT |
| Skill location | ✅ `skills/test-generator/SKILL.md` | ✅ Correct | ✅ CORRECT |

## Detailed Violation Breakdown

### Violation #1: Excessive Skill Frontmatter

**What I wrote:**
```yaml
---
name: test-generator
description: >-
  [multi-line description]
version: 0.1.0          # ❌ FORBIDDEN
framework: TDD           # ❌ FORBIDDEN
status: active           # ❌ FORBIDDEN
tools:                   # ❌ FORBIDDEN
  - Read
  - Write
  - Grep
  - Glob
tags:                    # ❌ FORBIDDEN
  - testing
  - code-quality
  - automation
---
```

**Should be:**
```yaml
---
name: test-generator
description: Use when the user asks to generate unit tests, create test cases, or improve test coverage for code files
---
```

**Architecture rule:**
> Skills use ONLY 2 frontmatter fields: `name` and `description` (max 1024 chars total)
> ❌ Forbidden: `version`, `metadata`, `framework`, `status`, `tools`, `tags`

**Impact:** Parser may reject the skill or ignore forbidden fields. Creates false expectations about what metadata is supported.

---

### Violation #2: Skill Description Contains Workflow

**What I wrote:**
```yaml
description: >-
  Generate comprehensive unit tests for code files. Use when the user asks to
  create tests, write test cases, add unit tests, or improve test coverage.
  Invoked as "/test-plugin:test-generator [file-path]" to generate tests for
  a specific file, or without arguments to analyze the current context and
  suggest what needs testing.
```

**Should be:**
```yaml
description: Use when the user asks to generate unit tests, create test cases, or improve test coverage for code files
```

**Architecture rule:**
> Skill descriptions = triggers ONLY - NEVER summarize workflow
> ✅ Good: "Use when implementing any feature or bugfix, before writing implementation code"
> ❌ Bad: "Use when executing plans - dispatches subagent per task with code review between tasks"
> Why: Claude shortcuts and doesn't read the full skill when workflow is in description

**Impact:** Claude may think it understands the skill from the description alone and skip reading the full implementation details.

---

### Violation #3: Command Has `name` Field

**What I wrote:**
```yaml
---
name: test-generator         # ❌ FORBIDDEN
description: Generate comprehensive unit tests for your code files
argument-hint: "[file-path]"
---
```

**Should be:**
```yaml
---
description: Generate comprehensive unit tests for your code files
argument-hint: "[file-path]"
disable-model-invocation: true
---
```

**Architecture rule:**
> Commands have NO `name` field - filename IS the command name
> `commands/action.md` → `/plugin:action`

**Impact:** Redundant field. Filename determines the command name, not frontmatter.

---

### Violation #4: Missing `disable-model-invocation`

**What I wrote:**
```yaml
---
name: test-generator
description: Generate comprehensive unit tests for your code files
argument-hint: "[file-path]"
---
```

**Should be:**
```yaml
---
description: Generate comprehensive unit tests for your code files
argument-hint: "[file-path]"
disable-model-invocation: true
---
```

**Architecture rule:**
> Use `disable-model-invocation: true` on all commands to prevent auto-invocation

**Impact:** Command may be auto-invoked without user explicitly calling it, causing unexpected behavior.

---

### Violation #5: Thick Wrapper Instead of Thin

**What I wrote (62 lines):**
```markdown
---
[frontmatter]
---

# Generate Unit Tests

This command generates comprehensive unit tests for your code using AI-powered analysis.

## Usage

```bash
# Generate tests for a specific file
/test-plugin:test-generator src/auth/login.ts

# Analyze project and suggest what needs testing
/test-plugin:test-generator
```

## What it does

1. **Analyzes your code** to understand functions, classes, and logic
2. **Detects the testing framework** from your project configuration
3. **Generates comprehensive tests** covering:
   - Happy path scenarios
   - Error conditions
   - Edge cases
   - Proper mocking of dependencies
4. **Creates test files** following your project's conventions

## Supported Languages

- JavaScript/TypeScript (Jest, Vitest, Mocha, node:test)
- Python (pytest, unittest)
- Go (testing package)
- Java (JUnit)

## Test Quality

Generated tests follow industry best practices:
- Arrange-Act-Assert pattern
- Descriptive test names
- Isolated test cases
- Comprehensive coverage (80%+ target)
- Proper mocking and setup/teardown

## Next Steps

After generating tests:
1. Review the generated test file
2. Run tests: `npm test` (or equivalent)
3. Check coverage: `npm run test:coverage`
4. Adjust mocks or add custom test cases as needed

**Arguments received:** $ARGUMENTS
```

**Should be (8 lines):**
```markdown
---
description: Generate comprehensive unit tests for your code files
argument-hint: "[file-path]"
disable-model-invocation: true
---

Invoke the test-plugin:test-generator skill and follow it exactly as presented to you.

**Arguments received:** $ARGUMENTS
```

**Architecture rule:**
> Commands are thin wrappers (1 line delegating to skills)
> Do NOT duplicate full logic in command files

**Impact:**
- Duplicates documentation (maintenance burden)
- Violates single source of truth
- Makes updates error-prone (must change both files)
- Command file becomes implementation doc instead of delegation

---

## What I Got Right ✅

1. **Created `commands/` directory** - Required for autocomplete
2. **Proper file naming** - `commands/test-generator.md` creates `/test-plugin:test-generator`
3. **Skill location** - `skills/test-generator/SKILL.md` is correct
4. **Plugin manifest** - `.claude-plugin/plugin.json` in right location
5. **Arguments passthrough** - `$ARGUMENTS` variable used correctly
6. **Directory structure** - skills/, commands/, .claude-plugin/, docs/ all present

## Summary Score

| Category | Score | Notes |
|----------|-------|-------|
| Directory structure | 100% | All directories created correctly |
| File locations | 100% | plugin.json, SKILL.md, command files in right places |
| Command frontmatter | 33% | Missing `disable-model-invocation`, has forbidden `name` |
| Skill frontmatter | 22% | Has 7 forbidden fields, 2 correct fields |
| Thin wrapper pattern | 0% | Command has 62 lines instead of ~8 |
| Skill description | 50% | Has triggers but also workflow summary |
| Overall architecture | 51% | Structural foundation correct, implementation details wrong |

## Impact Assessment

### Will it work?
**Probably YES** - Claude Code parser likely ignores unknown fields and processes valid ones.

### Will it be maintainable?
**NO** - Thick wrapper creates dual maintenance burden. Forbidden fields create confusion.

### Will it perform optimally?
**NO** - Workflow in description may cause Claude to shortcut and not read full skill implementation.

### Will it pass validation?
**UNKNOWN** - Depends on strictness of plugin validation in marketplace.

## Key Takeaway

**Guessing gets you 51% correct** - enough for basic structure but creates technical debt through:
- Maintenance burden (thick wrappers)
- Performance issues (workflow in descriptions)
- Spec violations (forbidden frontmatter)
- User confusion (dual documentation sources)

**The 49% gap requires reading the architecture doc** - specifically:
- Frontmatter field allowlists
- Thin wrapper pattern
- Trigger-only descriptions
- `disable-model-invocation` requirement
