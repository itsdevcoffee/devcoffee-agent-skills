# Maximus Summary Output Formats

## Review-Only Mode Output

### Clean Repository (No Issues)

```markdown
## Maximus Code Quality Review

### Scope
- **Files analyzed:** 3
- **Source:** uncommitted changes

### Issues Found (code-reviewer)
No issues found. Code is clean!

### Improvement Opportunities (code-simplifier)

#### By Category
- **Rename Variable:** 2 opportunities
- **Extract Function:** 1 opportunity

#### Detailed Opportunities

**UserController.ts:**
- [Rename Variable] Variable name 'x' is unclear
  - Current: `let x = user.position`
  - Suggested: `let userPosition = user.position`
  - Impact: Improved code readability

**utils.ts:**
- [Rename Variable] Variable name 'tmp' is unclear
  - Current: `const tmp = processData(input)`
  - Suggested: `const processedData = processData(input)`
  - Impact: Improved code clarity

- [Extract Function] Repeated validation logic
  - Current: Inline validation in 3 places
  - Suggested: Extract to `validateInput()` helper
  - Impact: Reduced duplication, improved maintainability

### Overlapping Findings
None - no issues found by code-reviewer.

### Conflicts & Trade-offs
None detected.

### Summary
- **Total issues:** 0 (Clean)
- **Total improvements:** 3 opportunities identified
- **Files requiring attention:** 2 files could be simplified

### Next Steps
Code is functionally correct. Consider applying simplifications for improved maintainability.

To automatically apply these improvements, run: `/maximus --yolo`
```

---

### Issues Found (Some Overlap)

```markdown
## Maximus Code Quality Review

### Scope
- **Files analyzed:** 2
- **Source:** uncommitted changes

### Issues Found (code-reviewer)

#### Critical Issues (1)
- **api.ts:42** - Potential SQL injection vulnerability
  - Recommended fix: Use parameterized queries instead of string concatenation

#### Major Issues (2)
- **UserController.ts:15** - Missing error handling for async operation
  - Recommended fix: Add try-catch around database call

- **UserController.ts:58** - Unused import statement
  - Recommended fix: Remove unused import 'lodash/debounce'
  - **Note:** Also flagged by simplifier

#### Minor Issues (2)
- **api.ts:103** - Magic number should be a constant
  - Recommended fix: Extract 3600 to CACHE_TTL constant

- **utils.ts:23** - Console.log in production code
  - Recommended fix: Remove debug statement or use proper logging

### Improvement Opportunities (code-simplifier)

#### By Category
- **Extract Function:** 2 opportunities
- **Remove Duplication:** 1 opportunity
- **Simplify Logic:** 1 opportunity
- **Consolidate Code:** 1 opportunity

#### Detailed Opportunities

**UserController.ts:**
- [Extract Function] Complex validation logic
  - Current: 45 lines of inline validation
  - Suggested: Extract to `validateUserInput()` helper
  - Impact: Improved testability, reduced file size by 40 lines

- [Remove Duplication] Unused import (also found by reviewer)
  - Current: `import { debounce } from 'lodash'` (never used)
  - Suggested: Remove unused import
  - Impact: Cleaner dependencies
  - **Note:** Also flagged by code-reviewer

**api.ts:**
- [Simplify Logic] Nested conditionals
  - Current: 4 levels of nesting in error handling
  - Suggested: Use early returns to flatten
  - Impact: Improved readability (4 levels → 1 level)

- [Consolidate Code] Duplicate error handling
  - Current: 3 similar error handlers with slight variations
  - Suggested: Extract common pattern to `handleApiError()` helper
  - Impact: Reduced duplication, consistent error handling

**utils.ts:**
- [Extract Function] Repeated date formatting logic
  - Current: Same formatting logic in 5 places
  - Suggested: Extract to `formatDate()` utility
  - Impact: Single source of truth, easier to maintain

### Overlapping Findings

- **UserController.ts:58** - Unused import 'lodash/debounce'
  - code-reviewer: "Unused import statement - remove"
  - code-simplifier: "Remove unused import for cleaner dependencies"
  - **Resolution:** Remove import (both agents agree)

### Conflicts & Trade-offs

- **api.ts:87** - Error handling approach
  - code-reviewer: "Add try-catch for error handling"
  - code-simplifier: "Remove unnecessary try-catch - overly defensive"
  - **Context:** The try-catch is at the wrong level. Current code wraps a single function call that already returns errors. Move error handling to route middleware instead of individual functions.
  - **Recommendation:** Remove local try-catch, add error handling middleware at router level

### Summary
- **Total issues:** 5 (Critical: 1, Major: 2, Minor: 2)
- **Total improvements:** 5 opportunities identified
- **Files requiring attention:** All 2 files need review

### Next Steps
Critical SQL injection vulnerability must be addressed immediately.

To automatically fix these issues, run: `/maximus --yolo`
```

---

## YOLO Mode Output

### Single Round - Clean Result

```markdown
## Maximus Review Cycle Complete

### Configuration
- **Mode:** autonomous
- **Source:** uncommitted changes
- **Files reviewed:** 2
- **Total rounds:** 1

### Review Rounds

| Round | Issues Found | Issues Fixed | Status |
|-------|--------------|--------------|--------|
| 1     | 3            | 3            | Fixed  |
| 2     | 0            | -            | Clean  |

### Issue Summary
- **Total found:** 3
- **Total fixed:** 3
- **Remaining:** None

#### By Severity (Across All Rounds)
- Critical: 0 found, 0 fixed
- Major: 2 found, 2 fixed
- Minor: 1 found, 1 fixed

### Simplification Summary
- **Files processed:** 2
- **Total improvements:** 4

#### Improvements by Category
- **Extract Function:** 1 improvement
- **Reduce Nesting:** 1 improvement
- **Rename Variable:** 1 improvement
- **Consolidate Code:** 1 improvement

#### Detailed Improvements
**UserController.ts:**
- Extract Function: Extracted validation logic into validateUser helper (reduced 40 lines)
- Reduce Nesting: Flattened nested conditionals using early returns (3 levels → 1)
- Rename Variable: Renamed 'x' to 'userPosition' for clarity

**utils.ts:**
- Consolidate Code: Combined 3 similar error handlers into single function (reduced duplication)

### Timeline
1. Initial scan → 3 issues (2 major, 1 minor)
2. Round 1 fixes → Fixed missing useEffect dependencies in UserController.ts, added cleanup logic for state, added error handling for async operation
3. Verification scan → Clean
4. Simplification Results:
   - UserController.ts: Extracted validation logic (reduced 40 lines), flattened nested conditionals (3 levels → 1), renamed 'x' to 'userPosition'
   - utils.ts: Combined 3 error handlers into single function

### Files Modified
- `UserController.ts` - 2 issues fixed, 3 simplifications applied
- `utils.ts` - 1 issue fixed, 1 simplification applied

### Result: PASS
All issues resolved. Code reviewed, fixed, and simplified with 4 quality improvements.
```

---

### Multiple Rounds - Max Rounds Reached

```markdown
## Maximus Review Cycle Complete

### Configuration
- **Mode:** autonomous
- **Source:** 2 unpushed commits
- **Files reviewed:** 5
- **Total rounds:** 5 (max reached)

### Review Rounds

| Round | Issues Found | Issues Fixed | Status |
|-------|--------------|--------------|--------|
| 1     | 12           | 12           | Fixed  |
| 2     | 5            | 5            | Fixed  |
| 3     | 3            | 3            | Fixed  |
| 4     | 2            | 2            | Fixed  |
| 5     | 1            | 1            | Fixed  |

### Issue Summary
- **Total found:** 23
- **Total fixed:** 23
- **Remaining:** None

#### By Severity (Across All Rounds)
- Critical: 3 found, 3 fixed
- Major: 11 found, 11 fixed
- Minor: 9 found, 9 fixed

### Simplification Summary
- **Files processed:** 5
- **Total improvements:** 12

#### Improvements by Category
- **Extract Function:** 4 improvements
- **Reduce Nesting:** 3 improvements
- **Rename Variable:** 2 improvements
- **Consolidate Code:** 2 improvements
- **Simplify Logic:** 1 improvement

#### Detailed Improvements
**api.ts:**
- Extract Function: Extracted auth logic to separate middleware (reduced 60 lines)
- Reduce Nesting: Flattened nested error handlers (4 levels → 1)
- Consolidate Code: Merged 5 similar validation functions into one

**UserController.ts:**
- Extract Function: Extracted user validation to helper (reduced 45 lines)
- Rename Variable: Renamed 'data' to 'userData', 'result' to 'validationResult'
- Simplify Logic: Replaced complex conditional chain with lookup table

**AuthService.ts:**
- Extract Function: Extracted token generation to separate function (improved testability)
- Reduce Nesting: Used early returns in token validation (3 levels → 1)

**utils.ts:**
- Extract Function: Extracted date formatting to utility (5 call sites updated)
- Consolidate Code: Unified error message formatting

**types.ts:**
- Reduce Nesting: Simplified type guards using type predicates

### Timeline
1. Initial scan → 12 issues (3 critical, 5 major, 4 minor)
2. Round 1 fixes → Fixed SQL injection, missing error handling, null checks, async/await patterns
3. Verification scan → 5 issues (regressions + new issues found)
4. Round 2 fixes → Fixed edge cases in date parsing, validation logic, error messages
5. Verification scan → 3 issues (new patterns discovered)
6. Round 3 fixes → Fixed race conditions, added input sanitization, improved error context
7. Verification scan → 2 issues (final edge cases)
8. Round 4 fixes → Fixed timezone handling, added missing type guards
9. Verification scan → 1 issue (last edge case)
10. Round 5 fixes → Fixed final boundary condition in pagination
11. Final scan → Clean (max rounds reached)
12. Simplification Results:
    - api.ts: Extracted auth middleware (reduced 60 lines), flattened error handlers (4 levels → 1), merged validation functions
    - UserController.ts: Extracted validation helper (reduced 45 lines), renamed variables, simplified conditionals
    - AuthService.ts: Extracted token generation, reduced nesting with early returns
    - utils.ts: Extracted date formatting utility, unified error messages
    - types.ts: Simplified type guards

### Files Modified
- `api.ts` - 6 issues fixed, 3 simplifications applied
- `UserController.ts` - 8 issues fixed, 3 simplifications applied
- `AuthService.ts` - 5 issues fixed, 2 simplifications applied
- `utils.ts` - 3 issues fixed, 2 simplifications applied
- `types.ts` - 1 issue fixed, 2 simplifications applied

### Result: PASS
All 23 issues resolved across 5 iterative rounds. Code quality significantly improved with 12 simplifications applied.
```

---

### Error Case - Needs Attention

```markdown
## Maximus Review Cycle Complete

### Configuration
- **Mode:** autonomous
- **Source:** uncommitted changes
- **Files reviewed:** 3 (1 skipped)
- **Total rounds:** 2

### Review Rounds

| Round | Issues Found | Issues Fixed | Status |
|-------|--------------|--------------|--------|
| 1     | 5            | 4            | Partial |
| 2     | 1            | 1            | Fixed  |
| 3     | 0            | -            | Clean  |

### Issue Summary
- **Total found:** 6
- **Total fixed:** 5
- **Remaining:** 1 (file access issue)

#### By Severity (Across All Rounds)
- Critical: 1 found, 0 fixed (access denied)
- Major: 3 found, 3 fixed
- Minor: 2 found, 2 fixed

#### Unfixed Issues
- **locked.ts:42** - [Critical] Potential null pointer dereference
  - Reason: File not writable (permission denied)
  - Recommended fix: Add null check before accessing user.profile

### Simplification Summary
- **Status:** Partial completion
- **Files processed:** 2 of 3
- **Files skipped:** 1 (access denied)
- **Total improvements:** 3

#### Improvements by Category
- **Extract Function:** 1 improvement
- **Reduce Nesting:** 1 improvement
- **Rename Variable:** 1 improvement

#### Detailed Improvements
**UserController.ts:**
- Extract Function: Extracted validation logic into helper (reduced 30 lines)
- Reduce Nesting: Flattened conditionals using early returns (3 levels → 1)

**utils.ts:**
- Rename Variable: Renamed 'x' to 'position' for clarity

**locked.ts:**
- SKIPPED - Permission denied

### Timeline
1. Initial scan → 5 issues (1 critical, 2 major, 2 minor)
2. Round 1 fixes → Fixed 4 issues; 1 critical issue in locked.ts could not be fixed (permission denied)
3. Verification scan → 1 new issue found
4. Round 2 fixes → Fixed edge case in date parsing
5. Final scan → Clean (except skipped file)
6. Simplification Results:
   - UserController.ts: Extracted validation helper (reduced 30 lines), flattened conditionals (3 levels → 1)
   - utils.ts: Renamed 'x' to 'position'
   - locked.ts: SKIPPED (permission denied)

### Files Modified
- `UserController.ts` - 3 issues fixed, 2 simplifications applied
- `utils.ts` - 2 issues fixed, 1 simplification applied
- `locked.ts` - SKIPPED (permission denied)

### Result: NEEDS ATTENTION
5 of 6 issues resolved. 1 critical issue in locked.ts could not be fixed due to file permissions.

**Next steps:**
- Fix file permissions for locked.ts
- Manually address critical null pointer issue
- Re-run maximus after permissions updated
```
