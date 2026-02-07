# Maximus Usage Scenarios

## When to Use Review-Only vs YOLO Mode

### Review-Only Mode (Default)

**Use when you want to:**
- Explore code quality without making changes
- Get a comprehensive assessment before deciding on fixes
- Understand what both review and simplification perspectives suggest
- Share findings with team before implementing changes
- Audit code quality metrics
- Learn what types of issues exist in the codebase

**Perfect for:**
- 🔍 Initial code exploration
- 📊 Quality audits
- 👥 Team discussions
- 🎓 Learning and understanding
- 📋 Planning refactoring work
- ⚖️ Evaluating trade-offs before committing

**Example scenarios:**
```bash
# Before committing - check what issues exist
/maximus

# Before code review - get comprehensive analysis
/maximus

# Exploring a new codebase
/maximus

# Planning a refactoring session
/maximus
```

---

### YOLO Mode (--yolo flag)

**Use when you want:**
- Autonomous fixes to all detected issues
- Quick cleanup before committing
- Automated quality improvements
- Full review-fix-simplify cycle
- Hands-off code quality workflow

**Perfect for:**
- ✅ Final cleanup before commit
- 🚀 Quick quality improvements
- 🔄 Automated workflows/CI
- ⚡ Rapid iteration cycles
- 🎯 Known-good code patterns

**Example scenarios:**
```bash
# Quick cleanup before committing
/maximus --yolo

# Full automated quality cycle
/maximus --yolo

# With control points for critical issues
/maximus --yolo --pause-major

# Iterative development with automated QA
/maximus --yolo --max-rounds 10
```

---

## Common Workflows

### 1. Feature Development with Buzzminson

**Scenario:** Building a new feature with integrated quality assurance

```bash
# Step 1: Implement feature
/buzzminson Add user authentication with JWT

# ... buzzminson implements feature ...

# Step 2: Review without changes (see what buzzminson missed)
/maximus

# ... review findings ...

# Step 3: Apply fixes if needed
/maximus --yolo

# Step 4: Commit
git add .
git commit -m "feat: add JWT authentication"
```

---

### 2. Pre-Commit Quality Check

**Scenario:** You've made changes manually and want to ensure quality before committing

```bash
# Step 1: See what needs fixing
/maximus

# Review the findings, decide if you want to proceed

# Step 2: Auto-fix everything
/maximus --yolo

# Step 3: Commit clean code
git add .
git commit -m "fix: address code quality issues"
```

---

### 3. Exploring an Unfamiliar Codebase

**Scenario:** Understanding code quality in a project you just joined

```bash
# Get comprehensive analysis without touching anything
/maximus

# Review findings to understand:
# - Common patterns and anti-patterns
# - Areas needing improvement
# - Complexity hotspots
# - Simplification opportunities

# If you want to improve something specific:
# (Make manual changes, then check again)
/maximus
```

---

### 4. Refactoring Planning

**Scenario:** Planning a large refactoring effort

```bash
# Step 1: Get baseline analysis
/maximus > docs/quality-baseline.md

# Review findings, prioritize work

# Step 2: Make manual changes for complex refactoring

# Step 3: Check impact of changes
/maximus

# Step 4: Auto-fix any issues introduced
/maximus --yolo

# Step 5: Verify improvements
/maximus  # Should show fewer issues
```

---

### 5. Continuous Integration

**Scenario:** Automated quality checks in CI/CD pipeline

```bash
# .github/workflows/quality.yml

# Option A: Review-only (fail if issues found)
- name: Quality Check
  run: claude /maximus
  # Parse output, fail if critical issues found

# Option B: Auto-fix (commit fixes back)
- name: Quality Fix
  run: claude /maximus --yolo
- name: Commit Fixes
  run: |
    git config user.name "Quality Bot"
    git add .
    git commit -m "chore: automated quality fixes" || true
    git push
```

---

### 6. Code Review Preparation

**Scenario:** Preparing code for peer review

```bash
# Step 1: Initial review
/maximus

# Findings show:
# - 5 critical issues
# - 10 simplification opportunities
# - Some conflicts between reviewers

# Step 2: Fix critical issues automatically
/maximus --yolo

# Step 3: Review simplification opportunities
/maximus

# Decide which simplifications to apply manually
# (Some may require architectural decisions)

# Step 4: Commit and open PR
git add .
git commit -m "feat: new feature with quality improvements"
git push
gh pr create
```

---

### 7. Iterative Quality Improvement

**Scenario:** Improving code quality over multiple sessions

```bash
# Session 1: Initial assessment
/maximus > docs/quality-initial.md

# Review findings: 50 issues, 30 improvement opportunities

# Session 2: Fix critical issues
/maximus --yolo --pause-major
# Review each major/critical issue before auto-fixing

# Session 3: Address remaining issues
/maximus > docs/quality-after-critical.md
# Review findings: 15 issues remaining

/maximus --yolo --max-rounds 10
# Auto-fix remaining issues

# Session 4: Final verification
/maximus > docs/quality-final.md
# Should show significant improvement
```

---

### 8. Learning from AI Insights

**Scenario:** Understanding best practices by seeing what maximus suggests

```bash
# Get comprehensive analysis
/maximus

# Review findings to learn:
# - What patterns are considered problematic
# - How to improve code clarity
# - Common simplification patterns
# - Security best practices

# Apply some suggestions manually to understand them better
# Then check again:
/maximus

# See how your changes affected the analysis
```

---

### 9. Selective Fixing with Pause Flags

**Scenario:** Want automation but with control points

```bash
# Pause before every fix (interactive mode)
/maximus --yolo --interactive
# Review each finding, approve or skip

# Pause only for serious issues
/maximus --yolo --pause-major
# Auto-fix minor issues, pause for critical/major

# Pause before simplification
/maximus --yolo --pause-simplifier
# Auto-fix all issues, then review simplifications before applying
```

---

### 10. Team Code Review

**Scenario:** Discussing code quality with team

```bash
# Get comprehensive report
/maximus > meeting-notes/code-quality-review.md

# Share with team, discuss:
# - Which issues to prioritize
# - Which simplifications make sense
# - Any conflicts between review and simplification perspectives

# After team discussion, apply agreed-upon fixes
/maximus --yolo
```

---

## Flag Combinations

### Conservative (Safe Mode)
```bash
# Just review, no changes
/maximus
```

### Aggressive (Full Auto)
```bash
# Fix everything, no questions
/maximus --yolo
```

### Controlled Automation
```bash
# Auto-fix but pause for important decisions
/maximus --yolo --pause-major

# Auto-fix with review checkpoints
/maximus --yolo --pause-reviews

# Auto-fix but review simplifications
/maximus --yolo --pause-simplifier
```

### Extended Iteration
```bash
# More rounds for complex code
/maximus --yolo --max-rounds 10

# Maximum automation with extended rounds
/maximus --yolo --max-rounds 20
```

### Full Control
```bash
# Manual approval at every step
/maximus --yolo --interactive
```

---

## Decision Matrix

| Scenario | Recommended Mode | Reasoning |
|----------|-----------------|-----------|
| First time running | Review-only | Safe, learn what it finds |
| Pre-commit cleanup | YOLO | Fast, trusted automation |
| Exploring new code | Review-only | No changes to unfamiliar code |
| Critical/production | Review-only first | Review before any changes |
| Rapid iteration | YOLO | Speed over caution |
| Team collaboration | Review-only | Share findings, discuss first |
| CI/CD pipeline | Review-only or YOLO | Depends on pipeline goals |
| Learning session | Review-only | Understand patterns |
| Refactoring prep | Review-only | Plan before executing |
| Final polish | YOLO | Quick cleanup |

---

## Pro Tips

### Tip 1: Review First, YOLO Second
```bash
# See what will change
/maximus

# If comfortable with findings
/maximus --yolo
```

### Tip 2: Save Reports for Comparison
```bash
# Before
/maximus > docs/quality-before.md

# ... make changes ...

# After
/maximus > docs/quality-after.md

# Compare to see improvement
diff docs/quality-before.md docs/quality-after.md
```

### Tip 3: Use in Conjunction with Git Stash
```bash
# Stash your work
git stash

# Run maximus on different branch/commit
git checkout main
/maximus

# Compare with your work
git checkout -
/maximus

# Restore your work
git stash pop
```

### Tip 4: Combine with Commit Checkpoints
```bash
# Commit current state
git add .
git commit -m "WIP: before maximus"

# Run maximus
/maximus --yolo

# If unhappy with results
git reset --hard HEAD~1

# If happy
git commit --amend -m "feat: feature with quality improvements"
```

### Tip 5: Iterative Refinement
```bash
# Round 1: Critical issues only
/maximus --yolo --pause-major

# Round 2: Remaining issues
/maximus --yolo

# Round 3: Verification
/maximus
# Should show clean or minimal issues
```

---

## Anti-Patterns to Avoid

### ❌ Don't: Blindly YOLO on Critical Production Code
```bash
# BAD: No idea what changes will be made
/maximus --yolo
```

### ✅ Do: Review First
```bash
# GOOD: See what will change, then decide
/maximus
# ... review findings ...
/maximus --yolo  # Now informed
```

---

### ❌ Don't: Ignore Findings from Review-Only
```bash
# BAD: Run review, ignore output, move on
/maximus
# ... never read the output ...
```

### ✅ Do: Act on Findings
```bash
# GOOD: Review, understand, decide
/maximus
# ... read and understand findings ...
# Either fix manually or run:
/maximus --yolo
```

---

### ❌ Don't: Use YOLO Without Git Safety Net
```bash
# BAD: No way to undo if something goes wrong
# (uncommitted changes, no backup)
/maximus --yolo
```

### ✅ Do: Commit First or Use Git Stash
```bash
# GOOD: Can revert if needed
git add .
git commit -m "WIP: before maximus"
/maximus --yolo

# Or
git stash
/maximus --yolo
git stash pop  # if unhappy
```

---

### ❌ Don't: Run Without Understanding What It Does
```bash
# BAD: No idea what maximus does
/maximus --yolo
```

### ✅ Do: Start with Review-Only to Learn
```bash
# GOOD: Learn what maximus finds
/maximus
# ... review findings, understand the tool ...
# Then use YOLO when comfortable
```
