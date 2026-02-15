---
name: TLDR Feedback
description: >-
  This skill should be used when the user asks to "rate this tldr",
  "evaluate this tldr", "score this summary", "grade this tldr",
  "how good was that summary", "tldr feedback", or "/tldr:feedback".
  Handles the complete TLDR evaluation workflow: scoring samples on
  4 criteria, creating sample files, and updating the evaluation log.
  Supports --no-user-score flag for agent-only evaluation when called
  programmatically by /tldr:note --ex.
---

# TLDR Feedback

Evaluate TLDR command outputs against quality criteria and log results for improvement tracking. This is a development tool for improving the `/tldr` skill itself.

## Path Resolution

All evaluation data lives inside the TLDR plugin directory. This skill is at `skills/feedback/SKILL.md` — the plugin root is two directories up (the directory containing `skills/`, `docs/`, and `.claude-plugin/`). All file paths below are relative to the plugin root.

- Scoring rubrics: `skills/feedback/references/EVALUATION.md`
- Evaluation log: `docs/evaluation/evaluation-log.md`
- Sample files: `docs/evaluation/samples/NNN-description.md`
- Notes catalog: `docs/evaluation/notes.md`

## Evaluation Workflow

### Step 1: Identify the Sample

Determine the input mode:

- **Interactive (default):** User pastes or references an original message and its TLDR output
- **Automated (`--no-user-score`):** Called from `/tldr:note --ex` — skip user prompts, agent scores only

### Step 2: Load Scoring Rubrics

Read `references/EVALUATION.md` (bundled with this skill) for the complete scoring criteria, detailed rubrics for each dimension, and the sample file format template.

### Step 3: Determine Next Sample ID

Read `docs/evaluation/evaluation-log.md` and find the highest existing sample ID. The new sample is that number + 1, zero-padded to 3 digits (e.g., `004`).

### Step 4: Score the Sample

Evaluate on four criteria (Completeness, Conciseness, Actionability, Accuracy) at 2.5 points each — detailed rubrics are in `references/EVALUATION.md`.

For each criterion, produce: (1) items captured correctly, (2) items missed or needing improvement, (3) a numeric score with one-line justification.

### Step 5: Provide Analysis

Include in the evaluation:
- **What Went Well** — Specific strengths
- **What Needs Work** — Specific weaknesses
- **Recommendations** — Actionable improvements for future TLDR versions

### Step 6: Create Sample File

Write to `docs/evaluation/samples/NNN-description.md` following the format template in `references/EVALUATION.md`:
- Header with date, type, context
- Original message (or URL reference if external)
- TLDR output
- Claude's evaluation with breakdown
- User's evaluation section (populated or "Not provided")

### Step 7: Update Evaluation Log

Update `docs/evaluation/evaluation-log.md`:
1. Increment "Samples Collected" count
2. Recalculate all averages (overall + per-criterion)
3. Add row to the evaluation samples table
4. Update "Samples with User Feedback" count if user scored

### Step 8: User Score Handling

**Interactive mode (default):**
1. Present the agent's score and analysis
2. Ask the user for their score (0.0-10.0) and optional feedback
3. If user provides a score, update the sample file and evaluation log

**Automated mode (`--no-user-score`):**
- Skip user prompts entirely
- Mark sample status as "Unscored" in the log
- Set user evaluation to "Not provided" / "None"

## Output

After logging, provide a brief summary in chat:

```
Sample 004 logged (8.5 / 10.0)
- Strengths: Captured all key findings and file paths accurately
- Needs work: Two bullets could be more action-oriented
- Running tally: 4 samples, 9.1 avg, 1 with user feedback

Saved to docs/evaluation/samples/004-auth-refactor.md
```

