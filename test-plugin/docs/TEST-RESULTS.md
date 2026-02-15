# TDD RED Phase: Plugin Scaffolding Test Results

## Test Objective
Validate whether Claude can correctly scaffold a new plugin WITHOUT consulting documentation or using a scaffolding skill.

## Test Setup
- **Plugin name:** `test-plugin`
- **Purpose:** Generate unit tests for code
- **Constraints:** NO access to `docs/reference/claude-plugin-architecture.md` or scaffolding skills
- **Knowledge base:** General Claude plugin understanding + observation of existing plugins

## Test Results

### Overall Score: 51% Correct

| Category | Correctness | Details |
|----------|-------------|---------|
| Directory structure | ✅ 100% | All required directories created |
| File locations | ✅ 100% | plugin.json, SKILL.md, commands in correct paths |
| Plugin manifest | ✅ 100% | Valid JSON with all required fields |
| Commands directory | ✅ 100% | Created for autocomplete (critical requirement) |
| Skill frontmatter | ❌ 22% | 2/9 fields correct, 7 forbidden |
| Command frontmatter | ❌ 33% | Missing critical field, has forbidden field |
| Thin wrapper pattern | ❌ 0% | 62 lines instead of ~8 (87% bloat) |
| Skill description | ⚠️ 50% | Has triggers but also workflow summary |

### What Passed ✅

1. **Directory structure** - Created all required directories:
   - `.claude-plugin/`
   - `skills/`
   - `commands/`
   - `docs/`

2. **File naming and locations:**
   - `.claude-plugin/plugin.json` ✅
   - `skills/test-generator/SKILL.md` ✅
   - `commands/test-generator.md` ✅

3. **Plugin manifest** - Valid structure with name, version, description, author, repository, keywords, license

4. **Commands directory** - Correctly identified that `commands/` is required for slash command autocomplete

5. **Argument passthrough** - Used `$ARGUMENTS` variable correctly

### What Failed ❌

#### Critical Failures (breaks functionality or spec)

1. **Missing `disable-model-invocation: true`** in command frontmatter
   - **Impact:** Command may auto-invoke without user interaction
   - **Severity:** CRITICAL

2. **Thick wrapper pattern** - Command file has 62 lines instead of thin delegation
   - **Impact:** Duplicate maintenance burden, violates single source of truth
   - **Severity:** HIGH

#### High Severity (violates architecture)

3. **Forbidden frontmatter fields in skill:**
   - Added: `version`, `framework`, `status`, `tools`, `tags`
   - **Impact:** Parser may reject or ignore; creates confusion about supported metadata
   - **Severity:** HIGH

4. **Workflow summary in skill description:**
   - Included: "Invoked as...", "or without arguments...", usage examples
   - **Impact:** Claude may shortcut and not read full implementation
   - **Severity:** HIGH

5. **Command has `name` field:**
   - **Impact:** Redundant (filename determines name)
   - **Severity:** MEDIUM

## Detailed Violations

### Violation 1: Skill Frontmatter Bloat

**Created:**
```yaml
---
name: test-generator
description: [verbose description]
version: 0.1.0          # ❌ FORBIDDEN
framework: TDD           # ❌ FORBIDDEN
status: active           # ❌ FORBIDDEN
tools: [...]             # ❌ FORBIDDEN
tags: [...]              # ❌ FORBIDDEN
---
```

**Expected:**
```yaml
---
name: test-generator
description: Use when the user asks to generate unit tests, create test cases, or improve test coverage
---
```

**Reason for failure:** Assumed metadata fields would be helpful; didn't know only 2 fields allowed.

---

### Violation 2: Thick Command Wrapper

**Created:** 62-line command file with full documentation

**Expected:** 8-line thin delegation wrapper

**Lines of bloat:** 54 (87% excess)

**Reason for failure:** Treated command file as user documentation instead of skill delegation.

---

### Violation 3: Workflow in Description

**Created:**
```yaml
description: >-
  Generate comprehensive unit tests for code files. Use when the user asks to
  create tests, write test cases, add unit tests, or improve test coverage.
  Invoked as "/test-plugin:test-generator [file-path]" to generate tests for
  a specific file, or without arguments to analyze the current context and
  suggest what needs testing.
```

**Expected:**
```yaml
description: Use when the user asks to generate unit tests, create test cases, or improve test coverage
```

**Reason for failure:** Wanted to explain the skill's capabilities; didn't know descriptions should be triggers only.

---

## Root Cause Analysis

### Why Claude Gets It 51% Right

1. **Observable patterns** - Directory structure and file locations are visible in examples
2. **Logical reasoning** - Plugin manifest structure follows JSON best practices
3. **Common sense** - Creating `commands/` for slash commands seems obvious
4. **Argument handling** - `$ARGUMENTS` pattern observable in existing commands

### Why Claude Gets It 49% Wrong

1. **Hidden spec rules** - Frontmatter field allowlists not obvious from examples
2. **Architectural patterns** - Thin wrapper pattern not self-evident
3. **Performance optimizations** - Trigger-only descriptions counterintuitive
4. **Undiscoverable features** - `disable-model-invocation` not visible in examples
5. **Verbose instinct** - Natural tendency to document thoroughly

### Most Misleading Patterns

1. **Metadata seems helpful** - Adding version, tags, tools feels like good practice
2. **Documentation everywhere** - Documenting in both skill and command seems thorough
3. **Explain everything** - Verbose descriptions feel more helpful than terse triggers
4. **Commands = docs** - Command files feel like the right place for user documentation

## Test Conclusion

### Hypothesis: CONFIRMED ✅

Claude scaffolds basic structure correctly (51%) but violates critical architecture patterns (49%) without documentation.

### Key Findings

1. **Structural knowledge transfers** - Directory layout and file naming learned from examples
2. **Architectural knowledge doesn't** - Thin wrappers, frontmatter rules, performance patterns require docs
3. **Natural instincts mislead** - Verbose docs, metadata proliferation, duplication feel right but are wrong
4. **Critical fields unknown** - `disable-model-invocation` not discoverable without reading spec

### Required Interventions

For GREEN phase (correct scaffolding), the scaffolding skill must:

1. ✅ **Enforce frontmatter allowlist** - Only `name` and `description` in skills
2. ✅ **Generate thin wrappers** - Commands must be ~8 lines, not 62
3. ✅ **Include disable-model-invocation** - Critical for command behavior
4. ✅ **Write trigger-only descriptions** - No workflow summaries
5. ✅ **Remove `name` from commands** - Filename is the name
6. ✅ **Prevent metadata bloat** - No version, framework, status, tools, tags in skills

## Files Generated for Analysis

1. **`docs/SCAFFOLDING-ANALYSIS.md`** - Real-time thoughts and uncertainties during creation
2. **`docs/ARCHITECTURE-VIOLATIONS.md`** - Detailed violation breakdown with severity ratings
3. **`docs/BEFORE-AFTER-COMPARISON.md`** - Side-by-side comparison of wrong vs correct
4. **`docs/TEST-RESULTS.md`** - This test summary

## Next Steps for TDD

### RED Phase ✅ COMPLETE
- Demonstrated Claude scaffolds incorrectly without guidance
- Documented all violations and root causes
- Quantified correctness (51%) and failure modes (49%)

### GREEN Phase (Next)
- Create scaffolding skill that prevents all documented violations
- Validate skill generates 100% correct plugin structure
- Test against multiple plugin types (simple, complex, multi-skill)

### REFACTOR Phase (Future)
- Optimize skill for clarity and maintainability
- Add templates and examples
- Create validation checklist

## Visual Summary

```
┌─────────────────────────────────────────────────────────────┐
│ RED Phase Test: Scaffold Without Documentation              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  What Worked (51%):                                         │
│  ✅ Directory structure (100%)                              │
│  ✅ File locations (100%)                                   │
│  ✅ Plugin manifest (100%)                                  │
│  ✅ Commands directory (100%)                               │
│                                                              │
│  What Failed (49%):                                         │
│  ❌ Skill frontmatter (22%)                                 │
│  ❌ Command frontmatter (33%)                               │
│  ❌ Thin wrapper pattern (0%)                               │
│  ⚠️  Skill description (50%)                                │
│                                                              │
│  Critical Gaps:                                             │
│  • Missing disable-model-invocation                         │
│  • 7 forbidden frontmatter fields                           │
│  • 87% code bloat in command file                           │
│  • Workflow in description                                  │
│                                                              │
│  Root Cause:                                                │
│  Observable patterns ✅ vs Hidden spec rules ❌             │
│                                                              │
│  Conclusion:                                                │
│  Scaffolding skill REQUIRED for correct architecture        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Test Artifacts

All test artifacts preserved in `test-plugin/` directory:

```
test-plugin/
├── .claude-plugin/
│   └── plugin.json                    # ✅ Correct
├── commands/
│   └── test-generator.md              # ❌ 62 lines (should be 8)
├── skills/
│   └── test-generator/
│       └── SKILL.md                   # ❌ 9 frontmatter fields (should be 2)
├── docs/
│   ├── SCAFFOLDING-ANALYSIS.md        # Analysis during creation
│   ├── ARCHITECTURE-VIOLATIONS.md     # Detailed violations
│   ├── BEFORE-AFTER-COMPARISON.md     # Side-by-side fixes
│   └── TEST-RESULTS.md                # This summary
├── LICENSE                            # ✅ Correct
└── README.md                          # ✅ Correct (but not required)
```

**Test status:** ✅ RED phase complete - demonstrated need for scaffolding skill
