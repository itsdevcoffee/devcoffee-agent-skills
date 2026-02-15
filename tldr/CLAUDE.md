# TLDR Plugin - Claude Code Instructions

## Command: /tldr

When the user invokes `/tldr`, follow the instructions in `skills/tldr/SKILL.md`.

## Architecture

```
tldr/
├── skills/
│   ├── tldr/           # Main /tldr skill
│   ├── feedback/       # /tldr:feedback - sample evaluation
│   ├── note/           # /tldr:note - quick-capture improvements
│   └── review/         # /tldr:review - triage pending notes
├── docs/
│   ├── design/         # Plugin design docs
│   └── evaluation/     # Evaluation data, samples, and notes
│       ├── evaluation-log.md
│       ├── notes.md
│       └── samples/    # Scored TLDR samples
└── .claude-plugin/     # Plugin manifest
```

## Development Skills

The plugin includes three development skills for continuous improvement:

- `/tldr:feedback` -- Evaluate TLDR samples against quality criteria. Rubrics at `skills/feedback/references/EVALUATION.md`, data at `docs/evaluation/`.
- `/tldr:note` -- Quick-capture improvement ideas. Catalog at `docs/evaluation/notes.md`. Supports `--ex` flag (auto-triggers evaluation).
- `/tldr:review` -- Guided triage session through pending notes.

## Key Files

- `skills/tldr/SKILL.md` -- Main skill implementation (entry point)
- `skills/feedback/references/EVALUATION.md` -- Scoring rubrics
- `docs/evaluation/notes.md` -- Improvement backlog
- `docs/evaluation/evaluation-log.md` -- Historical evaluation scores

**Path convention:** All `docs/evaluation/` paths are relative to this plugin's root directory.
