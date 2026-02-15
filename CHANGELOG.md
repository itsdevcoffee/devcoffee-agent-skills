# Changelog

All notable changes to Dev Coffee Agent Skills will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [maximus-loop v0.3.3] - 2026-02-15

### Fixed

- **Critical: Prevent subagent delegation** — All 4 command files now include `<CRITICAL>` anti-delegation block preventing the outer agent from using the Task tool to spawn subagents with made-up prompts instead of following skill instructions
- **Agent files: Read-first pattern** — All 4 agent files now instruct subagents to `Read ${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md` before doing anything, with inline critical rules as a fallback
- Fix misleading agent example commentary ("Analyze the project first" → "Run maximus validate --json first")

## [TLDR v1.1.4] - 2026-02-15

### Fixed

- Rename command files to remove `tldr-` prefix that caused doubled namespace in autocomplete (`/tldr:tldr-feedback` → `/tldr:feedback`, `/tldr:tldr-note` → `/tldr:note`, `/tldr:tldr-review` → `/tldr:review`)
- Update `plugin-metadata.json` commands list to match new filenames

## [maximus-loop v0.3.2] - 2026-02-15

### Fixed

- Fixed task state synchronization bug in maximus-loop engine where completed tasks were incorrectly marked as in-progress after process restart, causing agents to re-execute already-finished work and create duplicate commits

## [maximus-loop v0.3.1] - 2026-02-15

### Fixed

- Fixed critical loop termination bug

## [TLDR v1.1.3] - 2026-02-15

### Fixed

- Add `disable-model-invocation: true` to all command frontmatter per superpowers convention

## [TLDR v1.1.2] - 2026-02-15

### Fixed

- Add `commands/` directory with thin wrapper files for proper autocomplete registration — skills alone do not create slash command entries
- Commands follow repo convention with hyphen-prefixed names: `/tldr`, `/tldr-feedback`, `/tldr-note`, `/tldr-review`
- Each command delegates to its corresponding skill via `Invoke the tldr:<skill> skill`

## [TLDR v1.1.1] - 2026-02-15

### Fixed

- Restore `name` fields in skill frontmatter for correct autocomplete display — skills were showing as `/TLDR`, `/TLDR Feedback`, `/TLDR Note`, `/TLDR Review` instead of colon-format (`/tldr:feedback`, etc.) due to fallback to H1 headings
- Update H1 headings to lowercase to match directory-based naming convention
- Remove phantom `"tldr"` from `commands` array in plugin-metadata.json (no commands/ directory exists)

## [maximus-loop v0.3.0] - 2026-02-15

### Added

**New `/maximus-validate` skill — deterministic config validation with project-aware advisories**
- `maximus validate` CLI command in maximus-loop engine: 6 sequential checks (directory, YAML parse, schema, plan, progress, gitignore), terminal + JSON output modes, exit code 0/1
- `/maximus-validate` skill: 3-phase workflow — run CLI validation, project-aware analysis (timeout vs project size, context files, escalation status, commit prefix), present findings
- `config-schema.md` reference: authoritative field reference with types, defaults, valid values, and "Common Mistakes" table of invented fields agents create
- Command and agent files with yellow color (semantic for validation/caution)

### Changed

**Refactored `/maximus-init` to 4 phases using `maximus validate` for detection and verification**
- Phase 1 (Detect): runs `maximus validate --json` instead of manual `ls .maximus/` — handles 3 states (missing, invalid, valid)
- Phase 2 (Analyze): unchanged — reads project files for name, timeout, commit prefix
- Phase 3 (Configure): uses `maximus init` CLI + modifies only 3 values instead of writing config from scratch
- Phase 4 (Validate & Handoff): runs `maximus validate --json` as final safety net with max 2 retry attempts
- Reduced from 6 phases to 4 (merged detect+clean+suggest+handoff)
- Already-valid configs now show summary and ask about changes instead of re-running full setup

## [maximus-loop v0.2.3] - 2026-02-15

### Fixed

- Resolved plan.json schema contradiction between maximus-init and maximus-plan — init now allows optional `version` field, aligning with plan-schema.md and both example files
- Added `TaskCreate`, `TaskUpdate`, `TaskList` to tools list in all 3 commands and all 3 agents (Task API calls would fail without these)
- Removed hardcoded version from README plugin structure tree to prevent future drift

## [maximus-loop v0.2.2] - 2026-02-15

### Fixed

**maximus-init: Rewrote skill to be agent-proof after testing revealed complete schema violation**

Testing showed the agent:
- Created `maximus-loop/` instead of `.maximus/`
- Invented its own config schema (`project: {name, root, description}` instead of flat `project_name`)
- Added non-existent fields to plan.json (`version`, `project`, `created`)
- Used `mkdir` instead of `maximus init`
- Skipped user confirmation, Task API, and all 6 phases

Changes:
- Added `<CRITICAL-CONSTRAINTS>` block at top with 7 non-negotiable rules
- Added `<SCHEMA-ENFORCEMENT>` block listing exact TypeScript Config interface fields
- Explicitly banned common invented field names (`project:`, `stack:`, `verify:`, `guardrails:`, etc.)
- Made `maximus init` the required path (not optional `mkdir`)
- Strengthened confirmation checkpoint: "STOP and wait for user confirmation"
- Removed Best Practices / Configuration Validation sections (redundant, added noise that diluted core instructions)
- Simplified all phases to be more directive and less descriptive

## [devcoffee v0.5.1] - 2026-02-15

### Fixed

**Buzzminson: Autonomous execution of git operations without user approval**
- Replace weak "Ask:" directives in Phase 3 (Review) and Phase 4 (Assure) with **BLOCKING** checkpoints using explicit `AskUserQuestion` tool calls
- Phase 3 now requires user to select "I have feedback", "Run maximus QA", or "Skip QA and finish" before proceeding
- Phase 4 now requires user confirmation before committing and before final wrap-up
- Add "Git operations — NEVER autonomous" guideline preventing commits, pushes, and PRs without explicit user approval
- Root cause: Handoff doc with "feature complete" status caused buzzminson to skip interactive phases and execute cleanup tasks autonomously

### Added

**Buzzminson: Scope section for task type guidance**
- Add Scope section after Mission explaining what buzzminson is and isn't for
- Explicitly states cleanup checklists, merge prep, and commit-and-PR tasks are out of scope
- When given a handoff doc marked "feature complete", buzzminson should inform the user and suggest manual execution instead of running the full 4-phase workflow

## [TLDR v1.1.0] - 2026-02-15

### Added

**Three new development skills for continuous TLDR improvement:**
- **`/tldr:feedback`** — Codified evaluation workflow for scoring TLDR samples against 4 quality criteria (Completeness, Conciseness, Actionability, Accuracy). Supports `--no-user-score` flag for agent-only evaluation. Scoring rubrics bundled as `references/EVALUATION.md` using progressive disclosure.
- **`/tldr:note`** — Fire-and-forget capture of improvement ideas mid-workflow. Appends to centralized catalog (`docs/evaluation/notes.md`) with agent-expanded context. Supports `--ex` flag to include examples, which auto-triggers evaluation via feedback skill.
- **`/tldr:review`** — Guided triage session through pending notes. Presents items one at a time with Implement/Refine/Defer/Discard options. Implementation-ready — makes changes to TLDR skill files directly during review.

**Architecture improvements:**
- Consolidated evaluation data into `tldr/docs/evaluation/` (single canonical location inside plugin directory)
- Removed duplicate `docs/tldr-evaluation/` from repo root
- All skills use plugin-root-relative path resolution — works regardless of user's working directory

### Fixed

**Skill slash command naming**
- Removed `name` fields from all skill frontmatter — `name` was overriding auto-discovery, producing `/TLDR`, `/TLDR Feedback` etc. instead of correct `/tldr:feedback`, `/tldr:note`, `/tldr:review`

## [maximus-loop v0.2.1] - 2026-02-15

### Fixed

**Critical: Config Template Alignment**
- Fixed `max_iterations: 20` to match CLI template default of `-1` (unlimited). Previous value caused unexpected early engine stops for users expecting unlimited iteration.
- Fixed re-initialization ambiguity — skill now explicitly handles two paths: run `maximus init` when `.maximus/` is missing, write config directly when it already exists (CLI refuses to reinitialize).
- Added `.gitignore` handling for cases where CLI is bypassed — ensures `.heartbeat`, `.stop`, `.pause`, `.completed-tasks.json`, `run-summary.json`, and `logs/` entries are present.

**Major: Template Corrections**
- Removed `maximus_version: "1.0.0"` from config template (not in CLI template, engine auto-defaults it).
- Removed `"version": "1.0.0"` from clean plan.json template (field is optional, actual template omits it).
- Added commented-out `review` section to match CLI template.
- Added inline comments explaining that escalation is enabled beyond CLI defaults.

**Minor: Trigger and Description Improvements**
- Replaced role-play phrasing ("You are a configuration expert") with direct action statement.
- Added "scaffold maximus" and "bootstrap maximus" trigger phrases to skill description.
- Replaced hardcoded skill name examples in Phase 5 with dynamic discovery from `~/.claude/plugins/` and `~/.claude/skills/`.

**maximus-init Command:**
- Removed misleading `argument-hint: "[project path] [optional-config]"` — skill does not accept or process arguments.
- Updated description to accurately reflect project-aware analysis behavior.

**maximus-init Agent:**
- Removed example with non-existent `--enable-auto-commit` flag.
- Replaced with realistic "Initialize maximus for this project" example.
- Added "scaffold maximus" trigger phrase, removed "create task plan" (that's `/maximus-plan`).

### Changed

- Synced marketplace.json version from `0.1.0` to `0.2.1` (was out of date since initial plugin creation).

## [devcoffee v0.5.0] - 2026-02-15

### Added - Compaction Resilience

**Session Recovery for Buzzminson and Maximus**
- Add Session Recovery sections to both buzzminson agent and maximus agent/command with explicit instructions for resuming after context compaction
- Add resume detection via TaskList at session start — checks for existing tasks before creating new ones to prevent duplicate task creation
- Add `.active-session` pointer file for buzzminson (`docs/buzzminson/.active-session`) so the agent can find the active tracking document after context loss
- Add `.maximus-review-state.json` file persistence for maximus — state written to disk after each phase transition for accurate Phase 4 summary generation after recovery
- Add YAML frontmatter to buzzminson tracking template with `current_phase` and `status` fields for machine-parseable phase detection
- Add PreCompact hook (project-level `.claude/settings.json`) that injects recovery hints before context compaction occurs
- Add Stop hook (project-level `.claude/settings.json`) with `scripts/hooks/check-version.sh` that reminds agents to bump versions when plugin source files are modified without a corresponding version update

**Task API Improvements for Maximus**
- Add TaskCreate/TaskUpdate for all maximus phases (detect, review-fix, simplify, summary) — previously maximus had zero phase-level task tracking
- Add separate task sets for review-only mode (3 tasks) and YOLO mode (4 tasks)
- Add TaskUpdate calls at every phase transition in both agent and command files

**State Management Updates**
- Add Dual Tracking Strategy section to `state-management.md` documenting Task API + state file + in-memory state layers
- Add `.maximus-review-state.json` schema and recovery protocol documentation
- Add state file cleanup instruction after successful Phase 4 completion

### Fixed - Task API in Buzzminson

**Critical Task ID Bug**
- Replace hardcoded task IDs (`"task-1"` through `"task-4"`) with dynamic ID references throughout buzzminson agent
- TaskCreate returns dynamically generated IDs — hardcoded references could target wrong tasks or fail silently
- All TaskUpdate calls now reference the returned IDs from TaskCreate (`{clarify_task.id}`, `{implement_task.id}`, etc.)

**Enhanced Phase 2 Granularity**
- Add sub-task creation guidance in Phase 2 (Implement) for granular checkpoint tracking during long implementation phases
- Add `activeForm` update instructions so the status spinner reflects current sub-task work

**Tracking Template Updates**
- Add YAML frontmatter block to buzzminson tracking template (`current_phase`, `status`, `feature`, `started`, `agent`)
- Update status transitions documentation with frontmatter field values for each phase

## [opentui-dev v0.1.1] - 2026-02-15

### Added

**Terminal UI Development Plugin**
- Added `opentui-dev` plugin to marketplace with comprehensive OpenTUI patterns
- Production-tested patterns extracted from Maximus Loop TUI POC (4,100+ LOC)
- Comprehensive skill documentation (700+ lines) covering:
  - Dual API patterns (declarative VNodes + imperative Renderables)
  - Component factory pattern with cleanup discipline
  - Screen pattern with lifecycle management
  - Animation patterns (timeline, interval, cascade)
  - Pool-based scrolling for performance
  - Theme system architecture (base palette + semantic tokens)
  - Type safety guides for pre-1.0 framework
  - Performance best practices and common pitfalls
- Working examples with pinned dependency versions
- Framework dependency tracking with version compatibility matrix
- Experimental status with quarterly maintenance schedule

**Maintenance Strategy Documentation**
- Created `docs/context/2026-02-13-skill-maintenance-strategy.md` (16KB)
- Best practices for maintaining framework-dependent skills
- Metadata strategy for version tracking and compatibility
- Status lifecycle (experimental → stable → maintenance → deprecated → archived)
- Documentation patterns (version badges, migration guides, compatibility matrices)
- Quarterly maintenance workflow and automation guidelines
- Deprecation and archival processes

**Plugin Files:**
- `opentui-dev/.claude-plugin/plugin.json` - Base plugin configuration
- `opentui-dev/.claude-plugin/plugin-metadata.json` - Extended metadata with framework tracking
- `opentui-dev/README.md` - Comprehensive documentation with compatibility matrix
- `opentui-dev/CHANGELOG.md` - Version history and maintenance notes
- `opentui-dev/MIGRATION.md` - Version-specific migration guides
- `opentui-dev/skills/opentui-builder/SKILL.md` - Main skill with 700+ lines of patterns
- `opentui-dev/skills/opentui-builder/examples/package.json` - Pinned dependencies for examples

**Framework Compatibility:**
- Tested with @opentui/core v0.1.79
- Compatible with v0.1.70 - v0.1.x
- Pre-1.0 framework status with clear warnings
- Quarterly review schedule for compatibility updates

**Installation:**
```bash
claude plugin install opentui-dev@devcoffee-marketplace
bun add @opentui/core
```

## [devcoffee v0.4.1] - 2026-02-13

### Added - Task API Integration

**Visual Progress Tracking for Buzzminson**
- Integrated Claude Code Task API into buzzminson agent for visual progress tracking
- Users now see real-time phase progress with checkboxes, spinners, and time/token tracking
- Visual indicators: `◼` (in_progress), `◻` (pending), `✔` (completed), `✶` (spinner with activeForm text)
- Four tracked phases: Clarify → Implement → Review → Assure (Maximus)
- Task status updates automatically as buzzminson progresses through workflow
- Benefits: Clear visual feedback, time tracking, token awareness, progress clarity

**Comprehensive Task API Documentation**
- Created `docs/context/2026-02-13-task-api-visual-progress-tracking.md` (17KB, 600+ lines)
- Complete API reference for TaskCreate, TaskUpdate, TaskList, TaskGet
- Implementation patterns: basic workflow, multi-phase dependencies, agent team coordination, dynamic task creation
- Best practices: subject vs activeForm, task granularity, dependency management, status lifecycle
- Integration examples for Buzzminson and Maximus agents
- Error handling patterns and recovery strategies
- Storage/persistence details and multi-session coordination

**File Changes:**
- `devcoffee/agents/buzzminson.md` - Added Task API integration throughout all 4 phases
- `docs/context/2026-02-13-task-api-visual-progress-tracking.md` - New comprehensive reference

## [TLDR v1.0.1] - 2026-02-06

### Fixed

**Critical Bug Fix: File-Reading Approach**
- **Issue:** Skill instructed Claude to read `~/.claude/history.jsonl` which doesn't exist, causing wild goose chase through various `.jsonl` files until giving up
- **Root cause:** Misunderstanding of conversation history architecture - actual files at `~/.claude/projects/[hash]/conversations/[id].jsonl` and Claude can't reliably find them
- **Fix:** Completely removed file-reading approach - Claude now uses conversation context window (already available) to access previous messages
- **Impact:** TLDR now works instantly and reliably with zero tool calls instead of multiple failed file reads
- **Result:** Skill went from "hunt through filesystem" to "just look at what's in front of you"

**Feature Enhancement: Argument Support**
- Added two-mode operation: `/tldr` (no args) summarizes previous Claude message, `/tldr [topic]` summarizes whatever user specifies
- Improved description with specific trigger phrases: "summarize that", "recap", "give me the tldr", "shorten your last response"
- Lowered minimum message threshold from 100 to 50 words with graceful handling instead of refusal
- Updated error handling for context-relevant cases (no previous message, ambiguous topic) instead of impossible file scenarios
- Added Example 3 demonstrating with-arguments mode

**File Changes:**
- `tldr/skills/tldr/SKILL.md` - Complete rewrite from file-based to context-based approach
- Removed `allowed-tools: [Read]` from frontmatter (no longer needed)

## [devcoffee v0.4.0] - 2026-02-07 (Marketplace Scripts)

### Added - Automation Scripts

**Health Check Script (doctor.sh)**
- Comprehensive health check script that validates all devcoffee plugin dependencies and configuration
- Checks Claude CLI installation, required plugins (feature-dev, code-simplifier), optional dependencies (ffmpeg, jq)
- Smart plugin detection with suffix matching (e.g., matches "feature-dev@claude-plugins-official")
- Color-coded output with clear indicators (✓ ✗ ⚠ ℹ)
- Validates plugin structure and configuration files (settings.json, installed_plugins.json)
- Shows only relevant plugins by default with `--verbose` flag for full list
- Exit codes: 0 (success), 1 (critical issues), 2 (warnings only)
- Location: `scripts/doctor.sh`

**Setup Script (setup.sh)**
- Automated installation of all devcoffee plugin dependencies with cross-platform support
- Detects OS and package manager (macOS/Homebrew, Ubuntu/apt, Fedora/dnf, Arch/pacman)
- Multiple operation modes: interactive (default), `--auto`, `--dry-run`, `--minimal`
- Installs system dependencies (ffmpeg, jq) with OS-specific commands
- Installs required Claude plugins (feature-dev, code-simplifier)
- Installs devcoffee plugin from local directory
- Comprehensive edge case handling (no Homebrew, no sudo, unknown OS, install failures)
- Integrates with doctor.sh for pre-flight checks and post-install verification
- Graceful degradation with manual fallback instructions
- Exit codes: 0 (full success), 1 (critical failure), 2 (partial success with warnings)
- Location: `scripts/setup.sh`

### Added - Maximus Progressive Disclosure

**Reference Documentation**
- `devcoffee/references/maximus/flag-parsing.md` (1,200 words) - Complete flag documentation with decision trees and edge cases
- `devcoffee/references/maximus/error-handling.md` (2,100 words) - Comprehensive error recovery procedures for all scenarios
- `devcoffee/references/maximus/state-management.md` (1,800 words) - State structure and tracking patterns for both modes

**Examples Documentation**
- `devcoffee/examples/maximus/summary-formats.md` (2,400 words) - Output examples for review-only and YOLO modes
- `devcoffee/examples/maximus/usage-scenarios.md` (3,200 words) - 10 common workflows, decision matrix, pro tips, anti-patterns

**Documentation Expansion**
- Total maximus documentation expanded from 4,850 to 15,550 words (3.2x increase)
- Core agent and command files now reference supporting documentation via `${CLAUDE_PLUGIN_ROOT}`
- Progressive disclosure pattern improves maintainability and user navigation

### Changed - Shell Script Organization

**Directory Restructure**
- Moved 10 shell scripts from repository root to organized `scripts/` directory structure
- Created subdirectories: `scripts/plugin/`, `scripts/marketplace/`, `scripts/utils/`
- Renamed scripts with clearer, shorter names following verb-noun pattern
- Added comprehensive `scripts/README.md` (11KB) with usage examples and troubleshooting
- Added `scripts/RUN.md` quick reference guide

**Script Reorganization**
- `install-local-plugin.sh` → `scripts/plugin/install.sh`
- `uninstall-local-plugin.sh` → `scripts/plugin/uninstall.sh`
- `reinstall-plugin.sh` → `scripts/plugin/reinstall.sh`
- `diagnose-plugin.sh` → `scripts/plugin/diagnose.sh`
- `test-plugin.sh` → `scripts/plugin/test-local.sh`
- `fix-marketplace-structure.sh` → `scripts/marketplace/fix-structure.sh`
- `install-from-marketplace.sh` → `scripts/marketplace/install-devcoffee.sh`
- `register-plugin-correct.sh` → `scripts/utils/register-no-local-suffix.sh`

### Fixed - Critical Script Bugs

**setup.sh Critical Fixes**
- Fixed sudo prompt in dry-run mode - now properly skips sudo check when `--dry-run` flag is present
- Added error logging for apt update with proper output redirection
- Changed to POSIX-compliant redirection (`2>&1` instead of bash-specific `&>`)

**doctor.sh Improvements**
- Fixed plugin detection to match keys containing plugin name (handles @marketplace, @official suffixes)
- Fixed escape code rendering in summary section (added `-e` flag to echo)
- Reduced verbosity - shows only 3 relevant plugins by default instead of all 15
- Made validation warnings non-critical (extra metadata fields are harmless)

### Removed

**Redundant Scripts**
- `scripts/utils/register-manual.sh` - Redundant registration script (correct version kept)
- `scripts/marketplace/add-remotion.sh` - One-off setup script (task already completed)

**Cleanup**
- Removed `devcoffee/agents/buzzminson.md.backup` backup file from agents directory

## [devcoffee v0.4.0] - 2026-02-07 (README Automation)

### Added - CLAUDE.md Improvements

**Essential Sections Added:**
- **Project Overview** - Clear description of marketplace purpose, plugins, and repository
- **Quick Start** - Installation and update commands for local development
- **Architecture** - Comprehensive directory structure map with descriptions
- **Development Commands** - Plugin management, README automation, testing, and git workflows
- **Result:** Passed cclint validation (0 errors, 6 warnings) - improved from 68/100 (C+) baseline

**CLAUDE.md Management Guidelines:**
- Complete CHANGELOG maintenance section with Keep a Changelog and Semantic Versioning
- When to update, version numbering rules, entry format examples
- Automation workflow for commits and releases
- Research-backed best practices for agent versioning

### Added - README Automation System

**Metadata-Driven Documentation**
- **Automation scripts** for plugin metadata validation and README generation
  - `scripts/validate-plugins.js` - Validates all plugin metadata against schema (required fields, formats, structure)
  - `scripts/generate-readme-plugins.js` - Generates "Available Plugins" section from plugin.json metadata
  - NPM scripts: `readme:validate`, `readme:generate`, `readme:check`
- **JSON schema** for plugin metadata standardization (`docs/schemas/plugin-metadata-schema.json`)
- **Plugin template** for consistent documentation (`docs/templates/PLUGIN-README-TEMPLATE.md`)
- **Extended metadata fields** in all plugin.json files:
  - `tagline` - Short one-liner description (max 80 chars)
  - `category` - Plugin category (media, code-quality, automation, development, standalone)
  - `components` - Lists of agents, commands, skills, hooks
  - `dependencies` - Plugin and external tool dependencies
  - `installation` - Marketplace name and setup instructions
  - `usage` - When to use and usage examples

**Documentation**
- **Plugin Development Guide** (`docs/guides/PLUGIN-DEVELOPMENT.md`) - Complete workflow for adding new plugins (11KB, 500+ lines)
- **CONTRIBUTING.md** - Contribution guidelines with plugin development section
- **scripts/README.md** - Updated with automation script documentation

**Workflow Improvements**
- **Single source of truth:** plugin.json files contain all metadata
- **Automated validation:** Catches missing fields, invalid formats, structure errors
- **Automated generation:** Creates README sections from metadata
- **Manual review step:** Generated content saved to `.readme-plugins-section.md` for review before merging
- **Time savings:** ~30 minutes per plugin (vs ~60 minutes manual)

### Added - tldr Plugin to Marketplace

- Added tldr plugin entry to `.claude-plugin/marketplace.json`
- Category: "Standalone Tools"
- Full metadata: tagline, components, installation, usage examples
- Now discoverable and installable via marketplace

### Changed - Plugin Metadata

**All Plugins Extended:**
- **devcoffee** - Added metadata: tagline "Automated code quality workflows", category "code-quality"
- **video-analysis** - Added metadata including FFmpeg installation instructions across all platforms
- **remotion-max** - Added repository field and complete metadata
- **tldr** - Added full metadata with category "standalone"

**HTML Markers in README:**
- Added `<!-- BEGIN AUTO-GENERATED PLUGIN SECTIONS -->` and `<!-- END AUTO-GENERATED PLUGIN SECTIONS -->` markers
- Clear boundaries for automated vs manual content
- Prevents accidental overwrites during regeneration

### Fixed - Security

**Path Traversal Vulnerability (Critical)**
- **Issue:** `plugin.source` paths from marketplace.json were used directly without validation
- **Attack vector:** Malicious marketplace.json could use `../../../etc/passwd` to read arbitrary files
- **Fix:** Added path validation in both scripts to ensure resolved paths stay within repository root
- **Security check:**
  ```javascript
  const repoRoot = path.resolve(__dirname, '..');
  if (!pluginPath.startsWith(repoRoot)) {
    error('path traversal detected');
  }
  ```

### Fixed - Command Generation Bug

**Incorrect Command Formatting**
- **Issue:** Commands where name equals plugin name generated incorrectly
  - Before: `/video-analysis:video-analysis`, `/tldr:tldr` ❌
  - After: `/video-analysis`, `/tldr` ✅
- **Fix:** Generator now detects when command name equals plugin name and omits redundant prefix
- **Impact:** README now shows correct command invocations for all plugins

### Fixed - Error Handling

**Generation Script Resilience**
- **Error markers:** When plugin.json parsing fails, error markers now added to output file
- **User visibility:** Failed plugins clearly marked in generated content instead of silent skipping
- **Type validation:** Added `typeof` check for components object to prevent runtime errors

## [TLDR v1.0.0] - 2026-02-07

### Fixed

**Standalone Skill Structure**
- **Fixed namespace issue:** Converted tldr from plugin command to standalone skill
- **Before:** `/tldr:tldr` (double namespace from command structure)
- **After:** `/tldr` (clean invocation as standalone skill)
- **Installation:** Users copy to `~/.claude/skills/tldr/` for direct installation
- **Structure:** `skills/tldr/SKILL.md` following le-redditor pattern
- **Trade-off:** Clean invocation vs marketplace distribution (standalone skills aren't marketplace-installable)
- **Result:** Matches user expectations for simple, single-purpose skills

**Documentation Updates**
- Added evaluation system with first sample scored 9.7/10.0
- Created comprehensive EVALUATION.md with scoring criteria (Completeness, Conciseness, Actionability, Accuracy)
- Sample collection workflow for data-driven v1.1 improvements

## [devcoffee v0.3.0] - 2026-02-06

### Changed - Buzzminson Agent

**Research-Backed Simplification**
- **Simplified agent definition from 453 to 172 lines (62% reduction)** based on research showing agents perform better with concise prompts (<150 lines recommended)
- **Added XML tags** (`<instructions>`, `<success-criteria>`, `<formatting>`, `<context>`, `<error-handling>`) creating clear structural boundaries that Claude respects better than plain text
- **Implemented success criteria checkboxes** for self-validation at each phase (Clarify, Implement, Review, Assure)
- **Progressive disclosure pattern** - moved detailed examples and templates to reference files
- **Result:** Priority markers `[CRITICAL]`, `[IMPORTANT]`, `[PREFERENCE]` now consistently showing in agent output

**Research Documentation**
- Created `docs/research/2026-02-06-community-patterns-and-updates.md` (41KB) - comprehensive analysis of Claude 4.x behavioral shifts, structured output techniques, and agent design patterns from 2025-2026
- Research revealed instruction priority hierarchy: formatting instructions are Level 4 (advisory), XML tags create Level 3 "contracts"
- Documented Claude Sonnet 4.5's pragmatic reasoning shift: "context wins over literal compliance"

### Added - Buzzminson Agent

- **New reference files for progressive disclosure:**
  - `devcoffee/references/buzzminson-tracking-template.md` - comprehensive template with examples for implementation tracking documents
  - `devcoffee/references/buzzminson-question-examples.md` - examples of proper AskUserQuestion usage with priority markers
- **AskUserQuestion integration examples** showing proper tool usage with header field for priority markers
- **Comprehensive question quality guidelines** - limit 5-7 questions, use priority markers, provide context and trade-offs

### Changed - Buzzminson Agent

- Agent structure reorganized with XML-tagged sections for clarity
- Mission statement condensed to 4 phases with essential steps only
- Guidelines section restructured with `<context>` and `<error-handling>` tags
- Removed verbose inline examples (moved to reference files)
- Streamlined workflow descriptions focusing on actionable steps
- Updated references to point to detailed documentation files

### Changed - Maximus Agent (Breaking)

**Review-Only Default Mode**
- **Switched to review-only mode by default** - analyzes code quality and identifies issues without making changes
- **Added `--yolo` flag** for autonomous fix mode when user wants automatic corrections
- **Progressive disclosure pattern** - uses sub-agents to offload context and provide detailed analysis without overwhelming main conversation
- Agent description updated to reflect new default behavior

**Benefits:**
- Users can review findings before authorizing fixes
- Safer default for production code
- Clear opt-in for autonomous changes
- Better aligns with user expectations of "review" vs "fix"

### Added - New Skills

**Video Analysis Skill (Production-Ready)**
- `devcoffee/skills/video-analysis.md` - AI-powered video analysis using Claude's vision capabilities
- Frame extraction with ffmpeg (configurable intervals: 1s, 2s, 5s, 10s, or custom)
- Multi-image vision analysis with Claude 4.x
- Comprehensive reporting with timestamped findings, themes, notable moments
- Configurable analysis focus: content, technical quality, narrative flow, emotions, or custom
- Scene detection and content categorization
- Production-ready with error handling and validation
- **Packaged for marketplace** with complete skill structure

**TLDR Command Evolution**
- Split into standalone plugin structure for potential marketplace release
- Added evaluation system in `docs/tldr-evaluation/EVALUATION.md` for data-driven improvement
- Scoring criteria: Completeness, Conciseness, Actionability, Accuracy (0.0-10.0 scale)
- Sample collection and analysis workflow
- LICENSE and .gitignore files for plugin packaging

### Added - Examples & Documentation

**Examples:**
- `examples/devcoffee-speedrun-game/` - retro gaming speedrun video showcasing Buzzminson and Maximus workflow
- Video analysis report for speedrun game demonstrating new video analysis skill
- Explainer video context documents for agent handoff

**Research & Context:**
- `docs/research/2026-02-06-ai-video-analysis-capabilities.md` - comprehensive research on AI video analysis techniques
- `docs/research/2026-02-06-video-analysis-implementation-research.md` - implementation patterns and best practices
- `docs/research/2026-02-06-tldr-*.md` - TLDR design review and critical fixes checklist
- `docs/context/video-analysis-skill-specification.md` - detailed skill spec
- Quick test guide for video analysis skill

**Documentation Updates:**
- README updated with video analysis skill and speedrun example
- Comprehensive video analysis skill launch summary
- Buzzminson tracking template research and examples

### Fixed

- **Marketplace name corrections** in install commands (consistency across docs)
- **Explainer video scaling** - quadrant panels scaled to 1.6x, fixed feedback overlap
- **Plugin structure** - cleaned up and removed devcoffee-explainer example project

### Research Insights Applied

**Claude 4.x Behavioral Understanding:**
- Claude Sonnet 4.5 prioritizes pragmatic reasoning over literal instruction following
- Structured output with XML tags works better than verbose plain text
- Context window pressure causes formatting adherence to degrade after ~60k tokens
- Empowerment-based prompting beats prohibition (give decision frameworks, not rigid rules)

**Agent Design Best Practices:**
- Keep system prompts <150 lines for better adherence
- Use XML tags for critical sections (creates "contracts")
- Implement success criteria with checkboxes for self-validation
- Progressive disclosure: surface detailed info only when needed
- Filesystem for context offloading in complex agents

**Community Patterns:**
- Multi-agent systems outperform single agents by 90.2%
- Task scoping is critical: specific tasks succeed, vague ones fail
- Hooks are the solution for deterministic enforcement (Level 3 priority)
- Agent teams work best with clear handoff protocols

### Breaking Changes

**Maximus Agent:**
- Default behavior changed from autonomous fixes to review-only
- Users must explicitly use `--yolo` flag for autonomous fix mode
- This is a safer default but requires behavioral adjustment for users expecting automatic fixes

### Deprecated

- Removed devcoffee-explainer example project (consolidated into other examples)

### Dependencies

- Video analysis skill requires `ffmpeg` for frame extraction
- All existing dependencies remain (feature-dev, code-simplifier)

### Migration Guide

**For Maximus Users:**
- **Old behavior:** `/devcoffee:maximus` would automatically fix issues
- **New behavior:** `/devcoffee:maximus` reviews and reports issues
- **To get old behavior:** Use `/devcoffee:maximus --yolo`

**For Buzzminson Users:**
- No breaking changes - improvements are backward compatible
- New reference files provide better guidance for question formatting
- Tracking documents now have comprehensive template with examples

## [devcoffee v0.2.1] - 2026-02-04

### Changed - Maximus Agent
- **Enhanced code-simplifier output** with detailed metrics and categorization
- Simplifier now provides structured output matching review phase detail level
- Added 8 improvement categories: Extract Function, Rename Variable, Reduce Nesting, Consolidate Code, Remove Duplication, Improve Types, Add Constants, Simplify Logic
- Phase 4 summary now includes comprehensive Simplification Summary section
- Detailed improvements per file with specific changes and impact measurements
- Files Modified section shows simplification counts instead of generic "simplified"

### Added - Maximus Agent
- New state tracking structure for simplification with `files_processed`, `improvements`, and `by_category`
- Structured simplifier prompt requesting categorized output with impact details
- Simplification Summary section in Phase 4 output with metrics and breakdowns
- Improvements by Category grouping in output
- Detailed Improvements section showing per-file changes with categories and impacts

### Changed - Maximus Agent
- State structure: `simplification.changes` → `simplification.improvements` (array of objects with file, category, description, impact)
- Timeline output: Generic "Simplification → {files}" → Detailed "Simplification Results: {specific improvements per file}"
- Error handling: Updated to handle new state structure and provide graceful degradation

### Result
Phase 3 (Simplification) now provides the same level of detail and clarity as Phase 2 (Review), making it easy to understand what code quality improvements were made and their impact.

## [0.2.0] - 2026-02-04

### Added - devcoffee Plugin
- **Buzzminson agent and command** for structured feature implementation
- Upfront clarification phase with option to skip questions and use best judgment
- Living documentation system in `docs/buzzminson/` with tracking files
- Implementation tracking template (TEMPLATE.md) with comprehensive structure
- Iterative feedback loops for feature refinement
- Integrated quality assurance via maximus handoff
- Backburner tracking for future enhancements
- Session timeline logging for audit trail
- Manual testing instructions generation
- 4-phase workflow: Clarification → Implementation → Review → QA
- **LICENSE.md** - Full MIT license text at repository root
- WebFetch, WebSearch, and NotebookEdit tools to buzzminson for enhanced capabilities

### Changed - devcoffee Plugin
- Plugin description updated to include both buzzminson and maximus
- README reorganized with comprehensive buzzminson documentation
- Added workflow diagrams for buzzminson
- Enhanced command reference table with both agents
- Buzzminson command documentation expanded from 183 to 634 words (247% increase)
- Language improved to professional tone throughout all documentation
- Version bumped to 0.2.0

### Fixed
- **Critical:** Version consistency - marketplace.json and plugin.json now aligned at 0.2.0
- **Critical:** Marketplace description now includes both agents (previously only maximus)
- Tool configuration in agent frontmatter (maximus now has explicit tools field)
- Example format for reliable agent triggering (all examples show actual Task tool invocation)
- Description clarity for better auto-delegation (trigger-focused descriptions)
- Professional language replacing casual phrases for broader audience appropriateness

## [0.1.0] - 2026-01-23

### Added
- Initial release of devcoffee plugin
- Maximus command (`/devcoffee:maximus`) for autonomous code review cycles
- Maximus agent (`@devcoffee:maximus`) for subagent invocation
- Support for code-reviewer and code-simplifier integration
- Autonomous review-fix-simplify loop (max 5 rounds)
- Detection of uncommitted changes and unpushed commits
- Formatted summary tables with rounds, issues found/fixed
- Pause flags: `--pause-reviews`, `--pause-simplifier`, `--pause-major`, `--max-rounds N`, `--interactive`
- Comprehensive documentation with examples and workflow diagrams
- MIT License
- Marketplace configuration

### Dependencies
- Requires `feature-dev` plugin (for code-reviewer agent)
- Requires `code-simplifier` plugin (for code-simplifier agent)
