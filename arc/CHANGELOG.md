# Changelog

All notable changes to the Arc plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-02-18

### Added

- Schema fixes: run-summary-schema corrections for cost/duration fields, plan-schema additions for model/provider/skills fields, config-schema agent.provider support
- Anti-patterns Pattern 7 documentation
- Skill next-steps updates for improved agent guidance

## [0.1.3] - 2026-02-15

### Fixed

- Agent was reusing 1 task across all 4 phases instead of creating 4 separate tasks — CRITICAL block now explicitly lists all 4 tasks and says "do NOT reuse"
- Each BEGIN block reinforced with "(NEW task, do not reuse previous)"

## [0.1.2] - 2026-02-15

### Fixed

- Enforce mandatory Task API usage — added CRITICAL block, restructured phases with BEGIN/END bookends instead of skippable numbered steps
- Per-phase step numbering (Steps 1-N per phase instead of global 1-27) for clarity
- Plan.json Write handles existing file gracefully (read first if exists)

## [0.1.1] - 2026-02-15

### Fixed

- Commands now use direct Read instead of Skill tool — agent was treating "Successfully loaded skill" as completion instead of processing the loaded instructions

## [0.1.0] - 2026-02-15

### Added

- `/arc:init` — 4-phase imperative initialization with conditional state handling (A/B/C)
- `/arc:validate` — CLI validation with project-aware advisories
- `/arc:plan` — Interactive 6-phase task plan generation with cost estimates
- `/arc:review` — Post-run analysis with full review and quick status modes
- 6 reference docs: plan-schema, config-schema, anti-patterns, cost-estimation, run-summary-schema, task-api
- 4 agent definitions for subagent dispatch
