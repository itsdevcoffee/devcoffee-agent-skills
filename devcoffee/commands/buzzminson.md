---
description: Feature implementation agent with upfront clarification, iterative development, and quality assurance via maximus
argument-hint: [task description or path to markdown file]
tools: Task
---

# Buzzminson: Feature Implementation Agent

Invokes the buzzminson agent to handle structured feature implementation with planning, feedback loops, and quality assurance.

## When to Use This Command

Use `/devcoffee:buzzminson` when:
- ✅ Implementing mid-to-large features (estimated >30 minutes of work)
- ✅ You have a clear task description or specification document
- ✅ You want a structured workflow with upfront planning
- ✅ You need implementation tracking and documentation
- ✅ Quality assurance through maximus integration is desired

**Don't use for:**
- ❌ Trivial bug fixes or small changes (<5 minutes)
- ❌ Package updates or dependency management
- ❌ Documentation-only changes
- ❌ Git operations (commits, pushes, branch management)

## Arguments

**Syntax:**
```bash
/devcoffee:buzzminson [task description]
/devcoffee:buzzminson [path to markdown file with tasks]
/devcoffee:buzzminson  # Interactive mode - will prompt for task
```

**Arguments received:** $ARGUMENTS

**Behavior:**
- If arguments provided: Treated as task description or file path, passed directly to agent
- If no arguments: Command prompts user for task description interactively

## Usage Examples

### Example 1: Direct Task Description
```bash
/devcoffee:buzzminson Add user authentication with JWT tokens and refresh logic
```

**What happens:**
1. Buzzminson asks clarifying questions about implementation details
2. Creates tracking document at `docs/buzzminson/2026-02-04-user-auth.md`
3. Implements the authentication system systematically
4. Provides iterative feedback opportunities
5. Runs maximus for comprehensive quality assurance
6. Delivers commit-ready, production-quality code

### Example 2: Task from Specification File
```bash
/devcoffee:buzzminson Implement features from docs/specs/dashboard-requirements.md
```

**Useful when:** You have detailed requirements already documented. Buzzminson reads the file and asks clarifying questions about implementation approach.

### Example 3: Interactive Mode
```bash
/devcoffee:buzzminson
```

Buzzminson prompts: **"What feature should I implement?"**

Then you provide the task description conversationally.

## Workflow Overview

```
┌─────────────────┐
│ Clarification   │ → Ask questions or skip with best judgment
└────────┬────────┘
         ↓
┌─────────────────┐
│ Implementation  │ → Build feature, track progress, document decisions
└────────┬────────┘
         ↓
┌─────────────────┐
│ Review/Feedback │ → Gather feedback, iterate if needed
└────────┬────────┘
         ↓
┌─────────────────┐
│ Maximus QA      │ → Autonomous review-fix-simplify cycle
└────────┬────────┘
         ↓
┌─────────────────┐
│ Complete        │ → Ready to commit
└─────────────────┘
```

See [buzzminson agent documentation](../agents/buzzminson.md) for detailed workflow and phase descriptions.

## What Gets Created

Every buzzminson session creates comprehensive documentation:

**Primary artifact:**
- `docs/buzzminson/YYYY-MM-DD-feature-name.md` - Complete implementation log

**Document includes:**
- High-level summary of what was built
- Task breakdown (planned, completed, backburner)
- Questions asked and answers received (or assumptions if skipped)
- Key decisions and their rationale
- Step-by-step implementation details with file paths
- Problems encountered and solutions applied
- Manual testing instructions
- Maximus quality assurance results
- Complete session timeline

**Code artifacts:**
- New/modified files implementing the feature
- All changes tracked in the documentation

## Clarification Options

When buzzminson has questions, you'll see:

**"Moon Buzzminson has some questions before getting started 🌚 🐝"**

Two options:
1. **"Skip questions - use your best judgment"** - Buzzminson proceeds immediately, documenting assumptions
2. **"Answer the questions"** - Interactive Q&A session before implementation begins

## Tips for Success

### Before Starting
- Have clear requirements or be ready to answer clarification questions
- Consider which approach you prefer (if multiple valid approaches exist)
- Know your constraints (performance, dependencies, timeline)

### During Implementation
- Review the tracking document periodically - it's your implementation audit trail
- Provide feedback when buzzminson asks - it improves the final result
- Trust the process - buzzminson documents everything

### After Completion
- Use tracking document for PR descriptions (comprehensive context)
- Follow manual testing instructions to verify functionality
- Review maximus findings to understand quality improvements made

## Integration with Maximus

Buzzminson seamlessly hands off to maximus for quality assurance:

1. **Before maximus:** Buzzminson offers to commit current state (checkpoint)
2. **During maximus:** Autonomous review-fix-simplify cycle runs
3. **After maximus:** Buzzminson provides final summary and backburner items

This integration ensures production-ready code quality.

## Common Issues & Solutions

**Issue:** "maximus agent not found"
**Solution:** Install required dependencies:
```bash
/plugin install feature-dev@claude-plugins-official
/plugin install code-simplifier@claude-plugins-official
```

**Issue:** Tracking document not created
**Solution:** Buzzminson creates `docs/buzzminson/` automatically. If permission denied, check directory write permissions.

**Issue:** Want to skip maximus quality assurance
**Solution:** When buzzminson asks about running maximus, respond with "skip maximus" or "no thanks"

**Issue:** Need to pause mid-implementation
**Solution:** Tracking document preserves all context. Simply resume later - buzzminson can read the log and continue.

## Next Steps After Completion

1. **Review changes:** `git diff` to see all modifications
2. **Manual testing:** Follow instructions in tracking document
3. **Review tracking doc:** Check backburner items and key decisions
4. **Commit:** Use tracking doc summary for commit message context
5. **Create PR:** Tracking document provides comprehensive description

## Invocation

The command spawns the buzzminson agent via Task tool:

```
Task: devcoffee:buzzminson
Prompt: Implement the following: $ARGUMENTS
```

The agent handles the complete workflow autonomously with appropriate user checkpoints.

---

**Ready to build features systematically?** Pass your task and let buzzminson handle the structured implementation! 🌚🐝
