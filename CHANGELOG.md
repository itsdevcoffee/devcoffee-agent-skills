# Changelog

All notable changes to Dev Coffee Agent Skills will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-02-04

### Improved - Maximus Agent
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
