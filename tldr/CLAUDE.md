# TLDR Plugin - Claude Code Instructions

## Command: /tldr

When the user invokes `/tldr`, follow the instructions in `commands/tldr.md`.

## TLDR Evaluation

When evaluating TLDR command outputs (user says "rate this tldr" or shares samples), read `docs/evaluation/EVALUATION.md` first for the complete evaluation system, scoring criteria, and workflow instructions.

**Quick reference:**
- Evaluation system: `docs/evaluation/EVALUATION.md`
- Summary log: `docs/evaluation/evaluation-log.md`
- Individual samples: `docs/evaluation/samples/`

**Scoring criteria:** Completeness, Conciseness, Actionability, Accuracy (0.0-10.0 scale)

**Workflow:**
1. User shares: Original message + TLDR output
2. Claude scores on four criteria (2.5 points each)
3. User optionally provides score and feedback
4. Claude creates sample file and updates log
5. Pattern analysis after 10-20 samples for v1.1 planning
