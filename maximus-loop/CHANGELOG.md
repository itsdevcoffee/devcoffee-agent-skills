# Changelog

All notable changes to the maximus-loop plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.6] - 2026-02-15

### Fixed

- Remove invalid `name` field from all 4 command frontmatter files (filename IS the command name)
- Remove invalid `tools` field from all 4 command frontmatter files (not a valid command field)
- Fix command CRITICAL blocks contradicting skill Task API instructions
- Fix plan.json template missing `version` field (now writes `{"version": "1.0.0", "tasks": []}`)

### Added

- Mandatory Task API usage across all 4 phases of maximus-init (TaskCreate at start, TaskUpdate at end)
- Constraint #8 in CRITICAL-CONSTRAINTS enforcing Task API usage
- Inline `<DO-NOT-INVENT>` block in Phase 3 with 8-row table of commonly hallucinated config fields
- Stronger "copy CHARACTER-FOR-CHARACTER" language for config template
- Red flags for skipping TaskCreate/TaskUpdate and running unspecified commands
- Created missing `plugin-metadata.json`
- Created CHANGELOG.md

## [0.3.5] - 2026-02-15

### Fixed

- Prevent brainstorming interception in init/validate commands

## [0.3.4] - 2026-02-15

### Fixed

- Restore Invoke in commands to load SKILL.md

## [0.3.3] - 2026-02-15

### Fixed

- Remove invalid tagline field from plugin.json

## [0.3.2] - 2026-02-15

### Fixed

- Prevent subagent delegation in all 4 skills
