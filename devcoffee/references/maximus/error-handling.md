# Maximus Error Handling Guide

## Error Categories

### 1. Subagent Failures
### 2. Git Command Failures
### 3. File Access Issues
### 4. Partial Results

---

## 1. Subagent Failures

### code-reviewer Subagent Failure

**Symptoms:**
- Task tool returns error when spawning `feature-dev:code-reviewer`
- Subagent crashes or times out
- Malformed output from subagent

**Recovery Procedure:**

1. **First attempt:** Retry with simpler prompt
   ```
   Task: feature-dev:code-reviewer
   Prompt: Review these files: {file_list}
   ```

2. **Second attempt:** If still fails after 2 attempts:
   - Record failure in state:
     ```javascript
     {
       error: "code-reviewer failed after 2 attempts",
       round: N,
       files_skipped: [...files]
     }
     ```
   - Skip to next phase (simplification or final summary)

3. **Note in summary:**
   - REVIEW-ONLY MODE: "Review phase incomplete due to subagent failure"
   - YOLO MODE: "Review phase incomplete due to subagent failure"
   - Mark result as "NEEDS ATTENTION"

**Example:**
```markdown
### Result: NEEDS ATTENTION
Review phase could not be completed due to code-reviewer subagent failure.
Please ensure feature-dev plugin is installed: `/plugin install feature-dev`
```

---

### code-simplifier Subagent Failure

**Symptoms:**
- Task tool returns error when spawning `code-simplifier:code-simplifier`
- Subagent crashes or times out
- No output or malformed output

**Recovery Procedure:**

1. **First attempt:** Retry with simpler prompt
   ```
   Task: code-simplifier:code-simplifier
   Prompt: Simplify these files: {file_list}
   ```

2. **Second attempt:** If still fails after 2 attempts:
   - Record failure in state:
     ```javascript
     state.simplification = {
       completed: false,
       files_processed: 0,
       improvements: [],
       by_category: {},
       error: "subagent failed after 2 attempts"
     }
     ```
   - Proceed to final summary anyway

3. **Note in summary:**
   - Timeline section: "Simplification skipped due to subagent failure"
   - Simplification Summary: "Simplification attempted but failed"
   - Mark result as "NEEDS ATTENTION"

**Example:**
```markdown
### Simplification Summary
- **Status:** Failed
- **Reason:** code-simplifier subagent failed after 2 attempts

### Result: NEEDS ATTENTION
Code review completed but simplification failed.
Please ensure code-simplifier plugin is installed: `/plugin install code-simplifier`
```

---

## 2. Git Command Failures

### No Remote Tracking Branch

**Symptom:**
```bash
git rev-list --count @{upstream}..HEAD 2>/dev/null
# Error: no upstream configured
```

**Recovery:**
1. Fall back to comparing with last commit:
   ```bash
   git diff --name-only HEAD~1..HEAD
   ```

2. If that also fails (e.g., first commit):
   ```bash
   git diff --name-only HEAD
   ```

3. If no git repository at all:
   - Ask user which files to review using AskUserQuestion tool

**Example:**
```
No git changes detected (no remote tracking branch).

Which files would you like me to review?
[ ] src/app.ts
[ ] src/utils.ts
[ ] Enter file paths manually
```

---

### Detached HEAD State

**Symptom:**
```bash
git symbolic-ref HEAD
# Error: ref HEAD is not a symbolic ref (detached HEAD)
```

**Recovery:**
1. Use last commit comparison:
   ```bash
   git diff --name-only HEAD~1..HEAD
   ```

2. Note in summary that detection was affected:
   ```
   Note: Detected changes from last commit (detached HEAD state)
   ```

---

### Empty Repository

**Symptom:**
```bash
git diff --name-only HEAD
# Error: ambiguous argument 'HEAD': unknown revision
```

**Recovery:**
1. Check for staged files:
   ```bash
   git diff --name-only --cached --diff-filter=A
   ```

2. If none, inform user:
   ```
   No changes detected. This appears to be an empty repository.

   Which files would you like me to review?
   ```

---

## 3. File Access Issues

### File Not Readable

**Symptoms:**
- Read tool returns permission denied error
- File path doesn't exist
- File is a directory, not a file

**Recovery:**
1. Skip the problematic file
2. Track in state:
   ```javascript
   state.skipped_files = [
     {
       file: "path/to/file.ts",
       reason: "access denied"
     }
   ]
   ```
3. Continue with accessible files
4. Note skipped files in summary

**Example:**
```markdown
### Files Modified
- `src/app.ts` - 2 issues fixed, 1 simplification
- `src/utils.ts` - SKIPPED (access denied)

### Result: NEEDS ATTENTION
1 file could not be accessed and was skipped from review.
```

---

### File Not Writable (YOLO mode only)

**Symptoms:**
- Edit tool returns permission denied
- File is read-only

**Recovery:**
1. Note the issue found but not fixed:
   ```javascript
   state.rounds[N].issues_found += 1;
   state.rounds[N].issues_fixed += 0;  // Could not fix
   state.rounds[N].unfixed_issues.push({
     file: "path/to/file.ts",
     issue: "description",
     reason: "file not writable"
   });
   ```

2. Continue with other fixes
3. Mark as "NEEDS ATTENTION" in summary

---

## 4. Partial Results

**Philosophy:** Always prefer partial results over complete failure.

### Some Issues Fixed, Some Remain

**Scenario:** Max rounds reached but issues still present

**Handling:**
1. Complete all phases anyway
2. Mark remaining issues clearly:
   ```markdown
   ### Issue Summary
   - **Total found:** 10
   - **Total fixed:** 7
   - **Remaining:** 3

   #### Remaining Issues
   - `file.ts:42` - [Major] Description of unfixed issue
   - `file.ts:58` - [Minor] Description of unfixed issue
   - `other.ts:12` - [Critical] Description of unfixed issue
   ```

3. Mark result as "NEEDS ATTENTION"

---

### Simplifier Only Processed Some Files

**Scenario:** code-simplifier partially succeeded

**Handling:**
1. Track what was processed:
   ```javascript
   state.simplification = {
     completed: true,  // Partially
     files_processed: 2,
     files_skipped: 1,
     improvements: [...],
     by_category: {...},
     note: "1 file could not be processed"
   }
   ```

2. Note in summary:
   ```markdown
   ### Simplification Summary
   - **Files processed:** 2 of 3
   - **Files skipped:** 1 (error during processing)
   - **Total improvements:** 5
   ```

---

## General Recovery Principles

1. **Never fail completely** - Always try to provide some value
2. **Always output Phase 4 summary** - Even with errors noted
3. **Mark result clearly** - "PASS" vs "NEEDS ATTENTION"
4. **Include error details in Timeline** - Help user understand what happened
5. **Suggest next steps** - Plugin installation, permission fixes, etc.

---

## Error Message Templates

### Missing Plugin
```markdown
### Result: NEEDS ATTENTION
Required agent not found: {agent-name}

Please install required plugins:
  /plugin install feature-dev
  /plugin install code-simplifier
```

### Permission Issues
```markdown
### Result: NEEDS ATTENTION
File access issues prevented complete review:
- `path/to/file.ts` - Permission denied

Please check file permissions or run as appropriate user.
```

### Partial Completion
```markdown
### Result: NEEDS ATTENTION
Review completed with {N} remaining issues after {max_rounds} rounds.

Consider:
- Running maximus again with --max-rounds {N+5}
- Manually addressing remaining critical issues
- Reviewing issues for false positives
```

### Multiple Errors
```markdown
### Result: NEEDS ATTENTION
Multiple issues encountered:
1. code-reviewer failed after 2 attempts
2. 1 file could not be accessed (permission denied)
3. Simplification skipped due to subagent failure

Next steps:
- Verify plugins installed: /plugin install feature-dev code-simplifier
- Check file permissions
- Re-run maximus after addressing issues
```
