# ADR: Maximus Review-Only Default Mode

**Date:** 2026-02-06
**Status:** Implemented
**Decision:** Change Maximus default behavior from autonomous fixes to review-only mode

## Context

We encountered a use case where a user wanted Maximus to review code and report issues without implementing fixes. However, Maximus's core design was to autonomously fix issues by default. This created a conflict between explicit user instructions and agent behavior, forcing a pause for clarification.

## Problem

**Current Behavior:**
- Maximus is autonomous by default (review → fix → simplify)
- User must accept full workflow or manually invoke sub-components
- No way to get review insights without automatic changes
- Risky for exploration or when user wants control

**The Conflict:**
```
User: "Review my code but don't fix anything"
Maximus: "I'm designed to fix issues automatically by default"
Result: Confusion, friction, blocked workflow
```

## Decision

**Flip the defaults:**
- **Default Mode:** Review-only (safe, no changes)
- **YOLO Mode:** Autonomous fixes (opt-in via `--yolo` flag)

### Review-Only Mode (New Default)

**Behavior:**
1. Spawn `code-reviewer` and `code-simplifier` in parallel
2. Both agents analyze code WITHOUT making changes
3. Synthesize results:
   - Deduplicate overlapping findings
   - Resolve conflicts between recommendations
   - Present unified summary
4. Provide clear next steps: "To apply fixes: `/maximus --yolo`"

**Benefits:**
- Safe by default (no unexpected changes)
- Fast (parallel execution)
- Comprehensive (both review + simplification perspectives)
- Intelligent synthesis (deduplication, conflict resolution)
- User maintains control

### YOLO Mode (Opt-in)

**Behavior:**
- Current autonomous workflow preserved
- Review-fix loop until clean (max 5 rounds)
- Automatic simplification
- Complete summary report

**Activation:**
```bash
/maximus --yolo
```

## Implementation

### Files Modified

1. **`devcoffee/agents/maximus.md`** (Agent definition)
   - Updated description and examples
   - Added flag detection logic
   - Added review-only workflow (parallel agents + synthesis)
   - Preserved YOLO workflow (existing autonomous behavior)
   - Updated rules for both modes

2. **`devcoffee/commands/maximus.md`** (Command wrapper)
   - Updated description and argument hints
   - Added `--yolo` flag to arguments table
   - Added review-only workflow section
   - Updated flag parsing logic
   - Clarified when pause flags apply (YOLO mode only)

3. **`devcoffee/README.md`** (Documentation)
   - Updated command and agent descriptions
   - Added modes section (Review-Only vs YOLO)
   - Updated flags table with `--yolo`
   - Updated examples to show both modes
   - Added separate workflow diagrams for each mode

## Rationale

### Why Review-Only Default?

1. **Safety First:** No unexpected code changes
2. **Better UX:** User sees what's wrong before committing to fixes
3. **Faster Exploration:** Parallel execution, no fixing delays
4. **More Valuable:** Synthesis adds intelligence (deduplication, conflict resolution)
5. **Aligned with User Intent:** Most users want to see issues before fixing

### Why `--yolo` Name?

- Clear signal of autonomous behavior
- Memorable and searchable
- Indicates "I trust you, proceed without asking"
- Matches team culture/humor

## Consequences

### Positive

✅ **User Control:** Users review findings before committing to changes
✅ **Flexibility:** Can use review-only OR autonomous mode
✅ **Speed:** Parallel execution in review-only mode
✅ **Intelligence:** Synthesis provides better insights than raw output
✅ **Safety:** Safe by default, explicit opt-in for risky operations

### Negative

⚠️ **Breaking Change:** Existing workflows expecting auto-fix will need `--yolo` flag
⚠️ **Migration:** Users must update habits/scripts
⚠️ **Documentation:** Need to update all references

### Mitigation

- Clear documentation with migration guide
- Examples showing both modes
- Error messages guide users to correct flag
- README prominently features both modes

## Alternatives Considered

### 1. Add `--review-only` flag (keep autonomous default)
**Rejected:** Keeps risky behavior as default, requires flag for safe operation

### 2. Expose sub-components as separate commands
**Rejected:** Fragments user experience, loses synthesis value

### 3. Better agent selection UX (AI picks right agent)
**Rejected:** Relies on NLU, still has ambiguous cases, doesn't add synthesis value

### 4. Keep current approach (AI suggests alternatives)
**Rejected:** Adds friction, requires user to understand agent architecture

## Future Considerations

- Monitor usage patterns of review-only vs YOLO mode
- Consider adding `--dry-run` alias for review-only (explicit naming)
- Explore additional synthesis capabilities (priority scoring, fix effort estimates)
- Integration with buzzminson workflow (review-only before QA phase)

## Migration Guide

**For existing users:**

```bash
# Old (autonomous by default)
/maximus

# New (review-only by default)
/maximus  # Shows recommendations only

# To get old behavior
/maximus --yolo  # Autonomous fixes
```

**In buzzminson integration:**
- Buzzminson already uses explicit Task tool spawns
- No changes needed to buzzminson workflow
- Users can still choose `--yolo` when buzzminson calls maximus

## Summary

This change makes Maximus safer and more flexible by defaulting to review-only mode while preserving the autonomous fix capability behind an explicit `--yolo` flag. The review-only mode adds value through parallel execution and intelligent synthesis of findings from both code-reviewer and code-simplifier agents.

**Key takeaway:** Measure twice, cut once. Review first, fix when ready.
