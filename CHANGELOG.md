# Changelog

All notable changes to Dev Coffee Agent Skills will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

### Fixed - TLDR Skill

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

## [0.3.0] - 2026-02-06

### Major Changes - Buzzminson Agent

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

### Major Changes - Maximus Agent

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
