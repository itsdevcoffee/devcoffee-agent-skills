# TLDR Plugin - Claude Code Instructions

## Command: /tldr

When the user invokes `/tldr`, follow the instructions in `skills/tldr/SKILL.md`.

## TLDR Development Skills

The plugin includes three development skills for continuous improvement:

- `/tldr:feedback` — Evaluate TLDR samples against quality criteria and log results. Scoring rubrics at `skills/feedback/references/EVALUATION.md`, data at `docs/evaluation/`.
- `/tldr:note` — Quick-capture improvement ideas mid-workflow. Catalog at `docs/evaluation/notes.md`. Supports `--ex` flag for including examples (auto-triggers evaluation).
- `/tldr:review` — Guided triage session through pending notes. Discuss, refine, and implement improvements.

**Path convention:** All `docs/evaluation/` paths are relative to this plugin's root directory.
